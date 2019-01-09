/**
 * Created by ander on 16/10/18.
 */

Vue.component('slider',  {
    template: `
                <div class="slider slider-horizontal" v-on:mousedown="onMouseDown" v-on:mouseup="onMouseUp" v-on:mousemove="onMouse">
                    <div class="slider-track">
                        <div class="slider-track-low" style="left: 0px; width: 0px;"></div>
                        <div class="slider-selection" v-bind:style="{ left: '0%', width: percentage + '%' }"></div>
                        <div class="slider-selection hidden" v-bind:style="{ right: '0px', width: (100 - percentage) + '%' }"></div>
                    </div>
                    <div class="slider-handle min-slider-handle round" v-bind:style="{left: percentage + '%'}" tabindex="0"></div>
                </div>`,
    props: {
        initvalue: {
            type: Number,
            default: 0
        },
        min: {
            type: Number,
            default: 0
        },
        max: {
            type: Number,
            default: 100
        }
    },
    watch: {
        initvalue: function (newVal, oldVal) {
            console.log(newVal, oldVal);
            this.$forceUpdate();
        }
    },
    data: function () {
        return {
            value: 0,
            lastInitValue: 0,
            percentage: 0,
            draggable: false
        }
    },
    mounted: function () {
        this.calcInitValue();
    },
    updated: function () {
        this.calcInitValue();
    },
    methods: {
        onMouse: function (ev) {
            if (ev) {
                ev.preventDefault();
            }

            if (!this.draggable) {
                return true;
            }

            let offsets = $(this.$el).offset();
            let mouseOffset = ev.pageX - offsets.left;

            this.calcValues(mouseOffset);

            return true;
        },
        onMouseDown: function (ev) {
            this.draggable = true;
            this.onMouse(ev);
        },
        onMouseUp: function (ev) {
            this.draggable = false;
        },
        calcInitValue: function () {
            if (this.initvalue !== this.lastInitValue) {
                let width = this.$el.offsetWidth;
                let mouseOffset = this.initvalue * width / this.max;


                this.lastInitValue = this.initvalue;
                this.calcValues(mouseOffset);
            }

        },
        calcValues: function (mouseOffset) {

            let width = this.$el.offsetWidth;
            let val = mouseOffset * this.max / width;
            let percentage = val / this.max * 100;

            if (val < 0) {
                val = 0;
                percentage = 0;
            }

            if (val > this.max) {
                val = this.max;
                percentage = 100;
            }

            this.updateValues(val, percentage);
        },
        updateValues: function (value, percentage) {
            this.value = value;
            this.percentage = percentage;

            this.$emit('change', value, percentage);
        }
    }
});

Vue.component('post-like2', {
    template: `<div class="col-likes">
                <img class="cursor" v-on:click="makeVote" v-bind:src="getIcon()" alt="" />
                    <div class="dropdown dropdown-price">
                        <span class="dropdown__trigger"> {{ post.up_votes.length }} {{ lang.PUBLICATION.LIKES }}</span>
                        <div class="dropdown__container">
                            <div class="container">
                                <div class="row">
                                    <div class="col-md-3 col-lg-3 dropdown__content amount-post-view-home">
                                    testing voters
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`,
    props: {
        session: {
            type: Object
        },
        post: {
            type: Object
        }
    },
    data: function () {
        return {
            R: R,
            lang: lang
        }
    },
    methods: {
        getIcon: function () {
            if (this.hasVote()) {
                return this.R.IMG.LIKE.BLUE.FILLED;
            }

            return this.R.IMG.LIKE.BLUE.BORDER;
        },
        hasPaid: function () {
            let now = new Date();
            let payout = toLocaleDate(this.$props.post.cashout_time);
            return now.getTime() > payout.getTime();
        },
        hasVote: function () {
            let session = this.$props.session;
            let post = this.$props.post;

            if (session && post) {
                let activeVotes = post.active_votes;

                for (let x = 0; x < activeVotes.length; x++) {
                    let vote = activeVotes[x];
                    if (session.account.username === vote.voter) {
                        return true;
                    }
                }
            }

            return false;
        },
        makeVote: function (event) {
            if (event) {
                event.preventDefault();
            }

            if (!this.hasVote()) {
                let that = this;
                let session = this.$props.session;
                let post = this.$props.post;

                requireRoleKey(session.account.username, 'posting', function (postingKey) {
                    crea.broadcast.vote(postingKey, session.account.username, post.author, post.permlink, 10000, function (err, result) {
                        if (err) {
                            that.$emit('vote', err);
                        } else {
                            that.$emit('vote', null, result);
                        }
                    })
                });

            }
        }
    }
});

Vue.component('post-like', {
    template: `
    <div class="position-relative">
        <div class="lds-heart size-20 post-like" v-bind:class="{'like-normal': $data.state == -1, 'active-like': $data.state == 0, 'like-normal-activate': $data.state == 1 }" v-on:click="makeVote">
            <div></div>
        </div>

        <div class="dropdown dropdown-price inline post-like-count">
            <span class="dropdown__trigger"> {{ post.up_votes.length }}</span>
            <div class="dropdown__container">
                <div class="container">
                    <div v-for="v in post.up_votes" class="row">
                        <div class="col-md-3 col-lg-3 dropdown__content amount-post-view-home">
                            <a v-bind:href="'/@' + v.voter">+{{ v.voter }}</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`,
    props: {
        session: {
            type: Object
        },
        post: {
            type: Object
        }
    },
    data: function () {
        return {
            R: R,
            state: 0
        }
    },
    methods: {
        getIcon: function () {
            if (this.hasVote()) {
                return this.R.IMG.LIKE.RED.FILLED;
            }

            return this.R.IMG.LIKE.BORDER;
        },
        hasPaid: function () {
            let now = new Date();
            let payout = toLocaleDate(this.$props.post.cashout_time);
            return now.getTime() > payout.getTime();
        },
        hasVote: function () {
            let session = this.$props.session;
            let post = this.$props.post;

            if (session && post) {
                let activeVotes = post.active_votes;

                for (let x = 0; x < activeVotes.length; x++) {
                    let vote = activeVotes[x];
                    if (session.account.username === vote.voter) {
                        return true;
                    }
                }
            }

            return false;
        },
        makeVote: function (event) {
            if (event) {
                event.preventDefault();
            }

            if (!this.hasVote() && this.$data.state != 0) {
                let that = this;
                let session = this.$props.session;
                let post = this.$props.post;

                that.state = 0;

                requireRoleKey(session.account.username, 'posting', function (postingKey) {
                    crea.broadcast.vote(postingKey, session.account.username, post.author, post.permlink, 10000, function (err, result) {
                        if (err) {
                            that.state = -1;
                            that.$emit('vote', err);
                        } else {
                            that.state = 1;
                            that.$emit('vote', null, result);
                        }
                    })
                });

            }
        }
    },
    mounted: function () {
        console.log('updated like')
        this.state = this.hasVote() ? 1 : -1
    }
});

Vue.component('like', {
    template: `<div>
<div class="lds-heart size-20" v-bind:class="{'like-normal': $data.state == -1, 'active-like': $data.state == 0, 'like-normal-activate': $data.state == 1 }" v-on:click="makeVote">
<div></div>
</div><span>{{ post.up_votes.length }}</span></div>`,
    props: {
        session: [Object, Boolean],
        post: {
            type: Object
        }
    },
    data: function () {
        return {
            R: R,
            state: 0
        }
    },
    methods: {
        getIcon: function () {
            if (this.hasVote()) {
                return this.R.IMG.LIKE.RED.FILLED;
            }

            return this.R.IMG.LIKE.BORDER;
        },
        hasPaid: function () {
            let now = new Date();
            let payout = toLocaleDate(this.$props.post.cashout_time);
            return now.getTime() > payout.getTime();
        },
        hasVote: function () {
            let session = this.$props.session;
            let post = this.$props.post;

            if (session && post) {
                let activeVotes = post.active_votes;

                for (let x = 0; x < activeVotes.length; x++) {
                    let vote = activeVotes[x];
                    if (session.account.username === vote.voter) {
                        return true;
                    }
                }
            }

            return false;
        },
        makeVote: function (event) {
            if (event) {
                event.preventDefault();
            }

            if (!this.hasVote() && this.$data.state != 0) {
                let that = this;
                let session = this.$props.session;
                let post = this.$props.post;

                that.state = 0;

                requireRoleKey(session.account.username, 'posting', function (postingKey) {
                    crea.broadcast.vote(postingKey, session.account.username, post.author, post.permlink, 10000, function (err, result) {
                        if (err) {
                            that.state = -1;
                            that.$emit('vote', err);
                        } else {
                            that.state = 1;
                            that.$emit('vote', null, result);
                        }
                    })
                })

            }
        }
    },
    mounted: function () {
        this.state = this.hasVote() ? 1 : -1
    }
});

Vue.component('comment-like', {
    template: `<div>
<div class="lds-heart size-20 comment-like" v-bind:class="{'like-normal': $data.state == -1, 'active-like': $data.state == 0, 'like-normal-activate': $data.state == 1 }" v-on:click="makeVote">
<div></div>
</div><span>{{ post.up_votes.length }}</span></div>`,
    props: {
        session: {
            type: Object
        },
        post: {
            type: Object
        }
    },
    data: function () {
        return {
            R: R,
            state: 0
        }
    },
    methods: {
        getIcon: function () {
            if (this.hasVote()) {
                return this.R.IMG.LIKE.RED.FILLED;
            }

            return this.R.IMG.LIKE.BORDER;
        },
        hasPaid: function () {
            let now = new Date();
            let payout = toLocaleDate(this.$props.post.cashout_time);
            return now.getTime() > payout.getTime();
        },
        hasVote: function () {
            let session = this.$props.session;
            let post = this.$props.post;

            if (session && post) {
                let activeVotes = post.active_votes;

                for (let x = 0; x < activeVotes.length; x++) {
                    let vote = activeVotes[x];
                    if (session.account.username === vote.voter) {
                        return true;
                    }
                }
            }

            return false;
        },
        makeVote: function (event) {
            if (event) {
                event.preventDefault();
            }

            if (!this.hasVote() && this.$data.state != 0) {
                let that = this;
                let session = this.$props.session;
                let post = this.$props.post;

                that.state = 0;

                requireRoleKey(session.account.username, 'posting', function (postingKey) {
                    crea.broadcast.vote(postingKey, session.account.username, post.author, post.permlink, 10000, function (err, result) {
                        if (err) {
                            that.state = -1;
                            that.$emit('vote', err);
                        } else {
                            that.state = 1;
                            that.$emit('vote', null, result);
                        }
                    })
                });

            }
        }
    },
    mounted: function () {
        this.state = this.hasVote() ? 1 : -1
    }
});

Vue.component('witness-like', {
    template: `<div><span>
                    {{ index }}
                    <div class="lds-heart size-20" v-bind:class="{'like-normal': $data.state == -1, 'active-like': $data.state == 0, 'like-normal-activate': $data.state > 0}" v-on:click="makeVote">
                        <div></div>
                    </div>
                </span></div>`,
    props: {
        session: [Object, Boolean],
        account: [Object, Boolean],
        witness: Object,
        index: Number
    },
    data: function () {
        return {
            R: R,
            state: 0
        }
    },
    methods: {
        hasVote: function () {
            let session = this.$props.session;
            let account = this.$props.account;

            if (session && account) {

                return account.witness_votes.indexOf(this.$props.witness.owner) >= 0;
            }

            return false;
        },
        makeVote: function (event) {
            if (event) {
                event.preventDefault();
            }

            if (this.$data.state != 0) {
                let that = this;
                let session = this.$props.session;
                let witness = this.$props.witness;

                that.state = 0;

                requireRoleKey(session.account.username, 'active', function (activeKey) {
                    crea.broadcast.accountWitnessVote(activeKey, session.account.username, witness.owner, true, function (err, result) {
                        if (err) {
                            that.state = that.hasVote() ? 1 : -1;
                            that.$emit('vote', err);
                        } else {
                            that.state = 1;
                            that.$emit('vote', null, result);
                        }
                    })
                });

            }
        }
    },
    mounted: function () {
        this.state = this.hasVote() ? 1 : -1
    }
});

Vue.component('btn-follow',  {
    template: `<div v-on:click="performFollow" v-on:mouseleave="onleave" v-on:mouseover="onover" class="btn btn-sm" v-bind:class="{ 'btn--primary': $data.state == -1, 'btn-following': $data.state == 1, 'btn-unfollow': over && $data.state == 1 }">
<span class="btn__text" v-bind:class="{ text__dark: $data.state == 1 && !over }">{{ followText() }}</span>
</div>`,
    props: {
        session: {
            type: [Object, Boolean]
        },
        account: {
            type: [Object, Boolean]
        },
        user: {
            type: String
        }

    },
    data: function () {
        return {
            lang: lang,
            over: false,
            state: -1
        }
    },
    methods: {
        performFollow: function () {
            let operation = 'follow';
            let that = this;
            let session = this.$props.session;
            if (session) {
                let followJson = {
                    follower: session.account.username,
                    following: this.$props.user,
                    what: this.$data.state == 1 ? [] : ['blog']
                };

                followJson = [operation, followJson];

                requireRoleKey(session.account.username, 'posting', function (postingKey) {
                    crea.broadcast.customJson(postingKey, [], [session.account.username], operation, jsonstring(followJson), function (err, result) {
                        if (err) {
                            that.$emit('follow', err)
                        } else {
                            that.$emit('follow', null, result);
                            that.$data.state = that.$data.state == 1 ? -1 : 1;
                        }
                    })
                });

            } else {
                this.$emit('follow', Errors.USER_NOT_LOGGED)
            }

        },
        followText: function () {
            if (this.$data.state > 0) {
                return this.over ? this.lang.BUTTON.UNFOLLOW : this.lang.BUTTON.FOLLOWING;
            }

            return this.lang.BUTTON.FOLLOW
        },
        onover: function () {
            this.over = true;
        },
        onleave: function () {
            this.over = false;
        },
        isFollowing: function () {
            return this.session && this.account.followings.includes(this.user);
        }
    },
    mounted: function () {
        this.$data.state = this.isFollowing() ? 1 : -1;
    }
});

Vue.component('username', {
    template: `<p class="cursor-link" v-bind:style="{ display: inline > 0 ? 'inline' : 'inherit' }" v-on:click="seeProfile(user)">{{ name || user }}</p>`,
    props: {
        user: {
            type: String
        },
        name: {
            type: String
        },
        inline: {
            type: Number,
            default: 1
        }
    },
    methods: {
        seeProfile: function (username) {
            showProfile(username)
        }
    }
});

Vue.component('linkname', {
    template: `<span class="cursor-link" v-on:click="seeProfile(user)">{{ name || '@' + user }}</span>`,
    props: {
        user: {
            type: String
        },
        name: {
            type: String
        }
    },
    methods: {
        seeProfile: function (username) {
            showProfile(username)
        }
    }
});

Vue.component('avatar', {
    template: `<div class="img-user-avatar" v-bind:style="{ 'background-image': 'url(' + ( getDefaultAvatar(account)) + ')' }"></div>`,
    props: {
        account: {
            type: Object
        }
    },
    methods: {
        getDefaultAvatar: R.getAvatar
    },
});

Vue.component('taginput', {
    template: `<input :id="id" class="validate-required" type="text" :value="value" :data-role="data-role" :data-options="data-options" :placeholder="placeholder" />`,
    props: {
        id: {
            type: String
        },
        value: {
            type: String
        },
        'data-role': {
            type: String,
            default: 'tagsinput'
        },
        placeholder: {
            type: String
        },
        'data-options': {
            type: String
        }
    },
    mounted () {
        let el = $('#' + this.id);
        //this['data-options'] = JSON.parse(this['data-options']);
        console.log('Mounted tags', el, this.id, this.options, this.role);
        //tags(this.id);
    }
});

Vue.component('ckeditor', {
    template: `<textarea :id="id" :value="value" rows=30 cols=80></textarea>`,
    props: {
        value: {
            type: String
        },
        id: {
            type:String,
            default: 'editor',
        }
    },
    beforeUpdate () {
        const ckeditorId = this.id;
        if (this.value !== CKEDITOR.instances[ckeditorId].getData()) {
            CKEDITOR.instances[ckeditorId].setData(this.value);
        }
    },
    mounted () {
        const ckeditorId = this.id;
        console.log(this.value);
        const config = {};
        config.toolbarGroups = [
            { name: 'clipboard', groups: [ 'clipboard', 'undo' ] },
            { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
            { name: 'links', groups: [ 'links' ] },
            { name: 'styles', groups: [ 'styles' ] },
            { name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi', 'paragraph' ] },
            { name: 'editing', groups: [ 'find', 'selection', 'spellchecker', 'editing' ] },
            { name: 'insert', groups: [ 'insert' ] },
            { name: 'forms', groups: [ 'forms' ] },
            { name: 'tools', groups: [ 'tools' ] },
            { name: 'document', groups: [ 'mode', 'document', 'doctools' ] },
            { name: 'others', groups: [ 'others' ] },
            '/',
            { name: 'colors', groups: [ 'colors' ] },
            { name: 'about', groups: [ 'about' ] }
        ];

        config.removeButtons = 'Subscript,Superscript,PasteText,PasteFromWord,Undo,Redo,Scayt,Anchor,Image,Maximize,Source,HorizontalRule,Table,SpecialChar,Strike,RemoveFormat,NumberedList,Blockquote,About,BulletedList';
        //Disallow tags, classes and attributes
        config.disallowedContent = 'img script *[on*] *[style]';

        // Set the most common block elements.
        config.format_tags = 'p;h1;h2;h3;h4;pre';
        // Simplify the dialog windows.
        config.removeDialogTabs = 'image:advanced;link:advanced';
        config.resize_enabled = true;
        //config.extraPlugins = 'html5audio,html5video';

        CKEDITOR.replace(ckeditorId, config);
        //CKEDITOR.disableAutoInline = true;
        //CKEDITOR.inline(ckeditorId, config);

        CKEDITOR.instances[ckeditorId].setData(this.value);
        CKEDITOR.instances[ckeditorId].on('change', () => {
            let ckeditorData = CKEDITOR.instances[ckeditorId].getData();
            if (ckeditorData !== this.value) {
                this.$emit('input', ckeditorData)
            }
        });
    },
    destroyed () {
        const ckeditorId = this.id;
        if (CKEDITOR.instances[ckeditorId]) {
            CKEDITOR.instances[ckeditorId].destroy()
        }
    }
});