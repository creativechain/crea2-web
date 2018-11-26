/**
 * Created by ander on 16/10/18.
 */

Vue.component('post-like', {
    template: `<div class="col-likes">
                <img style="cursor: pointer" v-on:click="makeVote" v-bind:src="getIcon()" alt="">
                    <div class="dropdown dropdown-price">
                        <span class="dropdown__trigger"> {{ hasPaid() ? post.net_votes : _post.active_votes.length }} {{ lang.PUBLICATION.LIKES }}</span>
                        <div class="dropdown__container">
                            <div class="container">
                                <div class="row">
                                    <div class="col-md-3 col-lg-3 dropdown__content amount-post-view-home">
                                        <p class="title">1</p>
                                        <p>2</p>
                                        <p>3</p>
                                        <p>4</p>
                                        <p>5</p>
                                        <p>6</p>
                                        <p>7</p>
                                        <p>8</p>
                                        <p>9</p>
                                        <p>10</p>
                                        <p>...</p>
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

                crea.broadcast.vote(session.account.keys.posting.prv, session.account.username, post.author, post.permlink, 10000, function (err, result) {
                    if (err) {
                        console.error(err);
                        that.$emit('vote', err);
                    } else {
                        console.log(result);
                        that.$emit('vote', null, result);
                    }
                })
            }
        }
    }
});

Vue.component('like', {
    template: `<div><div class="lds-heart size-20" v-bind:class="{'like-normal': $data.state == -1, 'active-like': $data.state == 0, 'like-normal-activate': $data.state == 1 }" v-on:click="makeVote"><div></div>
</div><span>{{ hasPaid() ? post.net_votes : post.active_votes.length }}</span></div>`,
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
                crea.broadcast.vote(session.account.keys.posting.prv, session.account.username, post.author, post.permlink, 10000, function (err, result) {
                    if (err) {
                        that.state = -1;
                        console.error(err);
                        that.$emit('vote', err);
                    } else {
                        that.state = 1;
                        console.log(result);
                        that.$emit('vote', null, result);
                    }
                })
            }
        }
    },
    mounted: function () {
        console.log('updated like')
        this.state = this.hasVote() ? 1 : -1
    }
});

Vue.component('btn-follow',  {
    template: `<a v-on:click="performFollow" v-on:mouseleave="onleave" v-on:mouseover="onover" v-bind:class="{ btn: true, 'btn--sm': true, 'btn--primary': !innerFollowing, 'btn-following': innerFollowing, 'btn-unfollow': over && innerFollowing }" href="#0"><span v-bind:class="{ btn__text: true, text__dark: innerFollowing && !over }">{{ followText() }}</span></a>`,
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
        console.log('btn-follow', this.$props)
        return {
            lang: lang,
            over: false,
            innerFollowing: this.$props.session && this.account.followings.indexOf(this.$props.user) > -1
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
                    what: this.innerFollowing ? [] : ['blog']
                };

                followJson = [operation, followJson];
                crea.broadcast.customJson(session.account.keys.posting.prv, [], [session.account.username], operation, jsonstring(followJson), function (err, result) {
                    if (err) {
                        console.error(err);
                        that.$emit('follow', err)
                    } else {
                        //that.innerFollowing = !that.innerFollowing;
                        that.$emit('follow', null, result);
                    }
                })
            } else {
                this.$emit('follow', Errors.USER_NOT_LOGGED)
            }

        },
        followText: function () {
            if (this.innerFollowing) {
                return this.over ? this.lang.BUTTON.UNFOLLOW : this.lang.BUTTON.FOLLOWING;
            }

            return this.lang.BUTTON.FOLLOW
        },
        onover: function () {
            this.over = true;
        },
        onleave: function () {
            this.over = false;
        }
    }
});

Vue.component('username', {
    template: `<p class="cursor" v-bind:style="{ display: inline > 0 ? 'inline' : 'inherit' }" v-on:click="seeProfile(user)">{{ name || user }}</p>`,
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
    template: `<span class="cursor" v-on:click="seeProfile(user)">{{ name || '@' + user }}</span>`,
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
    template: `<div class="img-user-avatar" v-bind:style="{ 'background-image': 'url(' + ( url || getDefaultAvatar(username)) + ')' }"></div>`,
    props: ['url', 'username'],
    methods: {
        getDefaultAvatar: R.getDefaultAvatar
    }
});

Vue.component('taginput', {
    template: `<input :id="id" class="validate-required" type="text" :value="value" :data-role="data-role" :data-options="data-options" :placeholder="placeholder">`,
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