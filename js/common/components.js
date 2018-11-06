/**
 * Created by ander on 16/10/18.
 */

Vue.component('btn-follow',  {
    template: `<a v-on:click="performFollow" v-on:mouseleave="onleave" v-on:mouseover="onover" v-bind:class="{ btn: true, 'btn--sm': true, 'btn--primary': !innerFollowing }" href="#0"><span v-bind:class="{ btn__text: true, text__dark: innerFollowing }">{{ followText() }}</span></a>`,
    props: {
        following: {
            type: Boolean,
            default: 0
        },
        self: {
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
            innerFollowing: this.$props.following
        }
    },
    methods: {
        performFollow: function () {
            let operation = this.innerFollowing ? 'unfollow' : 'follow';
            let that = this;
            let s = this.$props.self;
            if (s) {
                let followJson = {
                    follower: s.account.username,
                    following: this.$props.user,
                    what: ['blog']
                };

                followJson = [operation, followJson];
                crea.broadcast.customJson(s.account.keys.posting.prv, [], [s.account.username], operation, jsonstring(followJson), function (err, result) {
                    if (err) {
                        console.error(err);
                        that.$emit('follow', err)
                    } else {
                        that.innerFollowing = !that.innerFollowing;
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