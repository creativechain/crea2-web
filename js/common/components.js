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

Vue.component('post-like-big', {
    template: `
    <div class="circle-like-post bs-popover-left" v-bind:class="{'circle-like-post-active': state === 1}" role="button" data-toggle="popover" data-trigger="hover" data-placement="left" data-html="true" v-bind:title="post.active_votes.length  + ' Likes'" v-bind:data-content="payouts">
        <div class="lds-heart size-20 size-30-like post-like" v-bind:class="{'like-normal': $data.state == -1, 'active-like': $data.state == 0, 'like-normal-activate': $data.state == 1 }" v-on:click="makeVote">
            <div></div>
        </div>
    </div>`,
    props: {
        payouts: [String, Boolean],
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
                //event.preventDefault();
            }

            if (!this.hasVote() && this.$data.state != 0) {
                let that = this;
                let session = this.$props.session;
                let post = this.$props.post;

                let username = session ? session.account.username : null;

                requireRoleKey(username, 'posting', function (postingKey, username) {
                    that.state = 0;
                    crea.broadcast.vote(postingKey, username, post.author, post.permlink, 10000, function (err, result) {
                        console.log(err, result);
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

Vue.component('post-like', {
    template: `
    <div class="text-right">
        <div class="lds-heart size-20 post-like" v-bind:class="{'like-normal': $data.state == -1, 'active-like': $data.state == 0, 'like-normal-activate': $data.state == 1 }" v-on:click="makeVote">
            <div></div>
        </div>

        <div class="dropdown inline post-like-count">
            <span class="dropdown__trigger"> {{ post.up_votes.length }}</span>
            <div class="dropdown__container">
                <div class="container">
                    <div class="row">
                        <div class="col-4 col-sm-6 col-md-6 col-lg-2 dropdown__content amount-post-view-home">
                            <ul>
                                <li v-for="v in (post.up_votes.length > 10 ? 10 : post.up_votes.length)">
                                    <a v-if="(v-1) < 10" class="text-truncate" v-bind:href="'/@' + post.up_votes[v-1].voter">+{{ post.up_votes[v-1].voter }}</a>
                                    <span v-else class="text-truncate" >+{{ '..and ' + post.up_votes.length - 10  + ' users'}}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`,
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
        getVote: function () {
            let session = this.$props.session;
            let post = this.$props.post;

            if (session && post) {
                let activeVotes = post.active_votes;

                for (let x = 0; x < activeVotes.length; x++) {
                    let vote = activeVotes[x];
                    if (session.account.username === vote.voter) {
                        return vote;
                    }
                }
            }

            return null;
        },
        hasVote: function () {
            let v = this.getVote();
            return v != null && v.percent > 0;
        },
        makeVote: function (event) {
            if (event) {
                event.preventDefault();
            }

            if (!this.hasVote() && this.$data.state !== 0) {
                let that = this;
                let session = this.$props.session;
                let post = this.$props.post;

                let username = session ? session.account.username : null;

                requireRoleKey(username, 'posting', function (postingKey, username) {
                    that.state = 0;
                    crea.broadcast.vote(postingKey, username, post.author, post.permlink, 10000, function (err, result) {
                        console.log(err, result);
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

let LIKE_STATE = {
    LIKE_OP: 0,
    NO_LIKE: 1,
    LIKED: 2,
    NO_LIKE_END: 3,
    LIKED_END: 4,
};

Vue.component('like', {
    template: `<div>
<div class="lds-heart size-20" v-bind:class="likeClasses" v-on:click="makeVote">
<div></div>
</div><span>{{ post.up_votes.length }}</span></div>`,
    props: {
        session: [Object, Boolean],
        post: {
            type: Object
        }
    },
    watch: {
        post: {
            immediate: true,
            deep: true,
            handler: function (newVal, oldVal) {
                this.state = this.getVote();
            }
        }
    },
    data: function () {
        return {
            R: R,
            states: LIKE_STATE,
            state: 0
        }
    },
    computed: {
        likeClasses: function () {
            return {
                'like-normal': this.state === this.states.NO_LIKE || this.state === this.states.NO_LIKE_END,
                'like-normal-activate': this.state === this.states.LIKED || this.state === this.states.LIKED_END,
                'active-like': this.state === this.states.LIKE_OP
            }
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
        getVote: function () {
            let session = this.$props.session;
            let post = this.$props.post;

            if (session && post) {
                let activeVotes = post.active_votes;

                for (let x = 0; x < activeVotes.length; x++) {
                    let vote = activeVotes[x];
                    if (session.account.username === vote.voter) {
                        return this.states.LIKED;
                    }
                }
            }

            return this.states.NO_LIKE;
        },
        hasVote: function () {
            return this.getVote() === this.states.LIKED || this.getVote() === this.states.LIKED_END;
        },
        makeVote: function (event) {
            if (event) {
                event.preventDefault();
            }

            if (!this.hasVote() && this.$data.state !== this.states.LIKE_OP) {
                let that = this;
                let session = this.$props.session;
                let post = this.$props.post;

                let username = session ? session.account.username : null;

                this.state = this.states.LIKE_OP;
                requireRoleKey(username, 'posting', function (postingKey, username) {
                    crea.broadcast.vote(postingKey, username, post.author, post.permlink, 10000, function (err, result) {
                        if (err) {
                            that.state = that.states.NO_LIKE_END;
                            that.$emit('vote', err);
                        } else {
                            that.state = that.states.LIKED_END;
                            that.$emit('vote', null, result);
                        }
                    })
                })

            }
        }
    },
    updated: function () {
        switch (this.state) {
            case this.states.NO_LIKE:
            case this.states.NO_LIKE_END:
                this.state = this.states.NO_LIKE;
                break;
            case this.states.LIKED:
            case this.states.LIKED_END:
                this.state = this.states.LIKED;

        }
    },
    mounted: function () {
        this.state = this.getVote();
    }
});

Vue.component('comment-like', {
    template: `<div>
<div class="lds-heart size-20 comment-like" v-bind:class="{'like-normal': $data.state == -1, 'active-like': $data.state == 0, 'like-normal-activate': $data.state == 1 }" v-on:click="makeVote">
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

                let username = session ? session.account.username : null;

                requireRoleKey(username, 'posting', function (postingKey, username) {
                    that.state = 0;
                    crea.broadcast.vote(postingKey, username, post.author, post.permlink, 10000, function (err, result) {
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
    template: `<div><span class="d-flex">
                    {{ index }}
                    <div class="lds-heart size-20" v-bind:class="{'like-normal': $data.state == -1, 'active-like': $data.state == 0, 'like-normal-activate': $data.state > 0}" v-on:click="makeVote" style="margin-top: 5px;">
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

                let username = session ? session.account.username : null;

                requireRoleKey(username, 'active', function (activeKey, username) {
                    that.state = 0;
                    crea.broadcast.accountWitnessVote(activeKey, username, witness.owner, true, function (err, result) {
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

let FOLLOW_STATE = {
    NO_FOLLOWING: 0,
    UNFOLLOWED: 1,
    FOLLOWING: 2,
    FOLLOWED: 3,
    UNFOLLOWING_OP: 4,
    FOLLOWING_OP: 5,
};

Vue.component('btn-follow',  {
    template: `<div v-on:click="performFollow" v-on:mouseleave="onleave" v-on:mouseover="onover" class="btn btn-sm running ld ld-ext-right font-weight-bold" v-bind:class="btnClasses">
<div class="btn__text ld-spin-fast ld" v-bind:class="textClasses"></div>{{ text }}<div></div>
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
    watch: {
        user: {
            immediate: true,
            deep: true,
            handler: function (newVal, oldVal) {
                this.$forceUpdate();
            }
        },
        account: {
            immediate: true,
            deep: true,
            handler: function (newVal, oldVal) {
                this.$forceUpdate();
            }
        }
    },
    computed: {
        btnClasses: function () {
            return {
                'btn--primary': this.state === this.states.NO_FOLLOWING || this.state === this.states.UNFOLLOWED || this.state === this.states.FOLLOWING_OP,
                'btn-following': (!this.over && (this.state === this.states.FOLLOWING || this.state === this.states.FOLLOWED)) || this.state === this.states.UNFOLLOWING_OP,
                'btn-unfollow': this.over && (this.state === this.states.FOLLOWING || this.state === this.states.FOLLOWED),
            }
        },
        textClasses: function () {
            return {
                'text__dark': !this.over && (this.state === this.states.FOLLOWING || this.state === this.states.FOLLOWED),
                'ld-ring': this.state === this.states.FOLLOWING_OP || this.state === this.states.UNFOLLOWING_OP,
                'ld-ring-blue': this.state === this.states.UNFOLLOWING_OP,
            }
        }

    },
    data: function () {
        return {
            lang: getLanguage(),
            over: false,
            states: FOLLOW_STATE,
            state: FOLLOW_STATE.NO_FOLLOWING,
            lastState: FOLLOW_STATE.NO_FOLLOWING,
            text: null,
        }
    },
    methods: {
        isStateOp: function() {
            return this.state === this.states.FOLLOWING_OP || this.state === this.states.UNFOLLOWING_OP;
        },
        isStateFollowing: function(state) {
            return state === this.states.FOLLOWING || state === this.states.FOLLOWED;
        },
        performFollow: function () {

            if (!this.isStateOp()) {
                let operation = 'follow';
                let that = this;
                let session = this.$props.session;
                let lastState = this.state;

                this.state = this.isStateFollowing(this.state) ? this.states.UNFOLLOWING_OP : this.states.FOLLOWING_OP;
                if (session) {
                    let followJson = {
                        follower: session.account.username,
                        following: this.$props.user,
                        what: this.isStateFollowing(lastState) ? [] : ['blog']
                    };

                    followJson = [operation, followJson];

                    requireRoleKey(session.account.username, 'posting', function (postingKey) {
                        crea.broadcast.customJson(postingKey, [], [session.account.username], operation, jsonstring(followJson), function (err, result) {
                            if (err) {
                                that.state = lastState;
                                that.$emit('follow', err)
                            } else {
                                that.state = that.isStateFollowing(lastState) ? that.states.UNFOLLOWED : that.states.FOLLOWED;
                                that.$emit('follow', null, result);
                            }
                        })
                    });

                } else {
                    this.state = lastState;
                    this.$emit('follow', Errors.USER_NOT_LOGGED)
                }
            }


        },
        onover: function () {
            this.over = true;
        },
        onleave: function () {
            this.over = false;
        },
        isFollowing: function () {
            return this.session && this.account.followings.includes(this.user);
        },
        updateText: function () {
            switch (this.state) {
                case this.states.NO_FOLLOWING:
                case this.states.UNFOLLOWED:
                    this.text = this.lang.BUTTON.FOLLOW;
                    break;
                case this.states.FOLLOWING:
                case this.states.FOLLOWED:
                    this.text = this.over ? this.lang.BUTTON.UNFOLLOW : this.lang.BUTTON.FOLLOWING;
                    break;
                case this.states.FOLLOWING_OP:
                    this.text = this.text = this.lang.BUTTON.FOLLOW;
                    break;
                case this.states.UNFOLLOWING_OP:
                    this.text = this.lang.BUTTON.FOLLOWING;
            }

        }
    },
    updated: function () {
        if (!this.isStateOp()) {
            this.state = this.isFollowing() ? this.states.FOLLOWING : this.states.NO_FOLLOWING;
        }

        this.updateText();

    },
    mounted: function () {
        this.state = this.isFollowing() ? this.states.FOLLOWING : this.states.NO_FOLLOWING;
        this.updateText();
    }
});

Vue.component('username', {
    template: `<a v-bind:href="'/@' + user" class="color-name"><p  v-bind:style="{ display: inline > 0 ? 'inline' : 'inherit' }">{{ name || user }}</p></a>`,
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
});

Vue.component('linkname', {
    template: `<a v-bind:href="'/@' + user" class="link-username">{{ name || '@' + user }}</a>`,
    props: {
        user: {
            type: String
        },
        name: {
            type: String
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
    methods: {
        onInput: function (event) {
            console.log(event);
            this.$emit('input', true);
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
        let that = this;
        CKEDITOR.instances[ckeditorId].on('change', () => {
            let ckeditorData = CKEDITOR.instances[ckeditorId].getData();
            if (ckeditorData !== this.value) {
                that.$emit('input', ckeditorData)
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