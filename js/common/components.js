"use strict";

/**
 * Created by ander on 16/10/18.
 */

var LIKE_STATE = {
    LIKE_OP: 0,
    NO_LIKE: 1,
    LIKED: 2,
    NO_LIKE_END: 3,
    LIKED_END: 4
};

var WITNESS_STATE = {
    VOTE_OP: 0,
    NO_VOTE: 1,
    VOTED: 2,
    NO_VOTE_END: 3,
    VOTED_END: 4
};

var RECOMMEND_STATE = {
    RECOMMEND_OP: 0,
    RECOMMENDED: 1,
    NO_RECOMMENDED: 2
};

Vue.component('recommend-post', {
    template: '' +
        '<ul class="ul-recommended-post">' +
        '   <li>' +
        '       <a href="#0" class="d-flex" v-on:click="makeRecommend">' +
        '           <!-- Para activar el parpadeo cuando alguien hace click en el icono, poner esta clases: pre-recommended -->' +
        '           <!-- Hay dos estados: icon-recommended-post (por defecto), icon-recommended-post-active cuando esta recomendado -->' +
        '           <div v-bind:class="recommendedClasses" v-on:mouseover="onHover(true)" v-on:mouseleave="onHover(false)"></div>' +
        '           <span>({{ countRecommended() }})</span>' +
        '       </a>' +
        '   </li>' +
        '</ul>',
    props: {
        post: Object,
        session: [Object, Boolean],
        user: [Object, Boolean]
    },
    watch: {
        post: {
            immediate: true,
            deep: true,
            handler: function handler(newVal, oldVal) {
                this.$forceUpdate();
            }
        },
        user: {
            immediate: true,
            deep: true,
            handler: function handler(newVal, oldVal) {
                this.$forceUpdate();
            }
        }
    },
    computed: {
        recommendedClasses: function (){
            return {
                'icon-recommended-post': !this.hover && this.state === RECOMMEND_STATE.NO_RECOMMENDED,
                'icon-recommended-post-active': this.state !== RECOMMEND_STATE.NO_RECOMMENDED || this.hover,
                'pre-recommended': this.state === RECOMMEND_STATE.RECOMMEND_OP
            };
        }
    },
    data: function data() {
        return {
            lang: lang,
            states: RECOMMEND_STATE,
            state: RECOMMEND_STATE.NO_RECOMMENDED,
            hover: false
        };
    },
    methods: {
        onHover: function(hover) {
            this.hover = hover;
        },
        isOwn: function() {
            if (this.session) {
                return this.session.account.username === this.post.author;
            }

            return false;
        },
        isRecommendedByUser: function() {
            return this.post.reblogged_by.includes(this.user.name);
        },
        countRecommended: function() {
            return this.post.reblogged_by.length;
        },
        makeRecommend: function(event) {
            cancelEventPropagation(event);

            var that = this;
            if (!this.isRecommendedByUser() && this.state !== this.states.RECOMMEND_OP) {
                this.state = RECOMMEND_STATE.RECOMMEND_OP;
                recommendPost(that.post.author, that.post.permlink, true, function (err, result) {
                    if (err) {
                        that.state = RECOMMEND_STATE.NO_RECOMMENDED;
                        that.$emit('recommend', err, null, that.post);
                    } else {
                        that.post.reblogged_by.push(that.session.account.username);
                        that.state = RECOMMEND_STATE.RECOMMENDED;

                        //Notify
                        that.$emit('recommend', null, result, that.post);
                    }
                })
            }
        }
    },
    mounted: function() {
        var that = this;
        this.state = this.isRecommendedByUser() ? RECOMMEND_STATE.RECOMMENDED : RECOMMEND_STATE.NO_RECOMMENDED;
    },
    updated: function() {
        if (this.state !== RECOMMEND_STATE.RECOMMEND_OP) {
            this.state = this.isRecommendedByUser() ? RECOMMEND_STATE.RECOMMENDED : RECOMMEND_STATE.NO_RECOMMENDED;
        }
    }
});

Vue.component('recommend', {
    template: '<div>' +
        '           <template v-if="session && !isOwn()">' +
        '               <div v-bind:class="actionClasses" v-on:click="makeRecommend()">' +
        '                   <div v-bind:class="recommendedClasses"></div>' +
        '               </div>' +
        '           </template>' +
        '            <div v-if="feed && recommendedBy()" class="row-recommended">' +
        '                <p>' +
        '                   <img src="/img/recommended/recommended_icon_1.svg" alt=""> {{ lang.PUBLICATION.RECOMMENDED_BY }} <a v-bind:href="\'/@\' + recommendedBy()">@{{ recommendedBy() }}</a> ' +
        '                   <template v-if="countRecommended() > 1">' +
        '                       {{ lang.COMMON.AND + " " + countRecommended() + " " + lang.COMMON.MORE }}' +
        '                   </template>' +
        '                </p>' +
        '            </div>' +
        '</div>',
    props: {
        post: Object,
        session: [Object, Boolean],
        user: [Object, Boolean],
        feed: {
            type: Boolean,
            'default': false
        }
    },
    watch: {
        post: {
            immediate: true,
            deep: true,
            handler: function handler(newVal, oldVal) {
                this.$forceUpdate();
            }
        },
        user: {
            immediate: true,
            deep: true,
            handler: function handler(newVal, oldVal) {
                this.$forceUpdate();
            }
        },
        feed: {
            immediate: true,
            handler: function handler(newVal, oldVal) {
                this.$forceUpdate();
            }
        }
    },
    computed: {
        recommendedClasses: function (){
            return {
                'icon-recommended': true,
                'hover-recommended': this.state !== RECOMMEND_STATE.RECOMMENDED,
                'my-active': this.state === RECOMMEND_STATE.RECOMMENDED
            };
        },
        actionClasses: function (){
            return {
                'hidden': !this.hover && this.state !== RECOMMEND_STATE.RECOMMEND_OP,
                'row-circle-recommended': true,
                'pre-recommended': this.state === RECOMMEND_STATE.RECOMMEND_OP,
                'parpadeo': this.state === RECOMMEND_STATE.RECOMMEND_OP
            };
        }
    },
    data: function data() {
        return {
            lang: lang,
            states: RECOMMEND_STATE,
            state: RECOMMEND_STATE.NO_RECOMMENDED,
            hover: false
        };
    },
    methods: {
        isOwn: function() {
            if (this.session) {
                return this.session.account.username === this.post.author;
            }

            return false;
        },
        isRecommendedByUser: function() {
            return this.post.reblogged_by.includes(this.user.name);
        },
        recommendedBy: function () {
            var that = this;
            var recommended = false;
            this.user.followings.forEach(function (followed) {
                if (that.post.reblogged_by.includes(followed)) {
                    recommended = followed;
                }
            });

            return recommended;
        },
        countRecommended: function() {
            var that = this;
            var recommendeds = 0;
            this.user.followings.forEach(function (followed) {
                if (that.post.reblogged_by.includes(followed)) {
                    recommendeds += 1;
                }
            });

            //sconsole.log(this.post.author + '/' + this.post.permlink, recommendeds);
            return recommendeds;
        },
        makeRecommend: function() {
            var that = this;
            if (!this.isRecommendedByUser() && this.state !== this.states.RECOMMEND_OP) {
                this.state = RECOMMEND_STATE.RECOMMEND_OP;
                recommendPost(that.post.author, that.post.permlink, true, function (err, result) {
                    if (err) {
                        that.state = RECOMMEND_STATE.NO_RECOMMENDED;
                        that.$emit('recommend', err, null, that.post);
                    } else {
                        that.post.reblogged_by.push(that.session.account.username);
                        that.state = RECOMMEND_STATE.RECOMMENDED;

                        //Notify
                        that.$emit('recommend', null, result, that.post);
                    }
                })
            }
        }
    },
    mounted: function() {
        var that = this;
        this.state = this.isRecommendedByUser() ? RECOMMEND_STATE.RECOMMENDED : RECOMMEND_STATE.NO_RECOMMENDED;
        //efect recommended
        $(this.$el).parent().hover(
            function() {
                that.hover = true;
                that.$forceUpdate();
            }, function() {
                that.hover = false;
                that.$forceUpdate();
            }
        );
    },
    updated: function() {
        if (this.state !== RECOMMEND_STATE.RECOMMEND_OP) {
            this.state = this.isRecommendedByUser() ? RECOMMEND_STATE.RECOMMENDED : RECOMMEND_STATE.NO_RECOMMENDED;
        }
    }
});

Vue.component('post-amount', {
    template:
        "<span class='amount-price'> " +
        "   <template v-if='symbefore'>" +
        "       {{ assetPart(value, 'sym') }}" +
        "       {{ assetPart(value, 'int') + '.'  }}" +
        "       <span>{{ assetPart(value, 'dec') }}</span>" +
        "   </template>" +
        "   <template v-else>" +
        "       {{ assetPart(value, 'int') + '.' }}" +
        "       <span>{{ assetPart(value, 'dec') }}</span>" +
        "       {{ assetPart(value, 'sym') }}" +
        "   </template>" +
        "</span>",
    props: {
        value: [Number, String, Object],
        symbol: [String],
        symbefore: {
            type: Boolean,
            'default': false
        }
    },
    methods : {
        assetPart: function assetPart(asset, part) {
            asset = Asset.parse(asset);

            switch (part) {
                case 'int':
                    return asset.toPlainString(null, false).split('.')[0];
                case 'dec':
                    return asset.toPlainString(null, false).split('.')[1];
                case 'sym':
                    return this.symbol ? this.symbol : asset.asset.symbol;
                default:
                    return Asset.parse(asset).toFriendlyString();
            }
        },
    }
});

Vue.component('amount', {
    template:
        "<div class='amount-price'> " +
        "   <span>{{ assetPart(value, 'int') + '.' }}</span>" +
        "   <span>{{ assetPart(value, 'dec') }}</span>" +
        "   <span>{{ assetPart(value, 'sym') }}</span>" +
        "</div>",
    props: {
        value: [Number, String, Object]
    },
    methods : {
        assetPart: function assetPart(asset, part) {
            asset = Asset.parse(asset);

            switch (part) {
                case 'int':
                    return asset.toPlainString(null, false).split('.')[0];
                case 'dec':
                    return asset.toPlainString(null, false).split('.')[1];
                case 'sym':
                    return asset.asset.symbol;
                default:
                    return Asset.parse(asset).toFriendlyString();
            }
        },
    }
});

Vue.component('slider', {
    template: "<div class=\"slider slider-horizontal\" v-on:mousedown=\"onMouseDown\" v-on:mouseup=\"onMouseUp\" v-on:mousemove=\"onMouse\">" +
        "<div class=\"slider-track\">" +
        "   <div class=\"slider-track-low\" style=\"left: 0px; width: 0px;\"></div>" +
        "   <div class=\"slider-selection\" v-bind:style=\"{ left: '0%', width: percentage + '%' }\"></div>" +
        "   <div class=\"slider-selection hidden\" v-bind:style=\"{ right: '0px', width: (100 - percentage) + '%' }\"></div>" +
        "</div>" +
        "<div class=\"slider-handle min-slider-handle round\" v-bind:style=\"{left: percentage + '%'}\" tabindex=\"0\"></div>" +
        "</div>",
    props: {
        initvalue: {
            type: Number,
            'default': 0
        },
        min: {
            type: Number,
            'default': 0
        },
        max: {
            type: Number,
            'default': 100
        }
    },
    watch: {
        initvalue: function initvalue(newVal, oldVal) {
            console.log(newVal, oldVal);
            this.$forceUpdate();
        }
    },
    data: function data() {
        return {
            value: 0,
            lastInitValue: 0,
            percentage: 0,
            draggable: false
        };
    },
    mounted: function mounted() {
        this.calcInitValue();
    },
    updated: function updated() {
        this.calcInitValue();
    },
    methods: {
        onMouse: function onMouse(ev) {
            if (ev) {
                ev.preventDefault();
            }

            if (!this.draggable) {
                return true;
            }

            var offsets = $(this.$el).offset();
            var mouseOffset = ev.pageX - offsets.left;
            this.calcValues(mouseOffset);
            return true;
        },
        onMouseDown: function onMouseDown(ev) {
            this.draggable = true;
            this.onMouse(ev);
        },
        onMouseUp: function onMouseUp(ev) {
            this.draggable = false;
        },
        calcInitValue: function calcInitValue() {
            if (this.initvalue !== this.lastInitValue) {
                var width = this.$el.offsetWidth;
                var mouseOffset = this.initvalue * width / this.max;
                this.lastInitValue = this.initvalue;
                this.calcValues(mouseOffset);
            }
        },
        calcValues: function calcValues(mouseOffset) {
            var width = this.$el.offsetWidth;
            var val = mouseOffset * this.max / width;
            var percentage = val / this.max * 100;

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
        updateValues: function updateValues(value, percentage) {
            this.value = value;
            this.percentage = percentage;
            this.$emit('change', value, percentage);
        }
    }
});

Vue.component('post-like-big', {
    template: '' +
        '<div v-on:mouseover="onOver(true)" v-on:mouseleave="onOver(false)" class="circle-like-post bs-popover-left"' +
        '   v-bind:class="circleClasses" role="button" data-toggle="popover" data-trigger="hover" data-placement="left" ' +
        '   data-html="true" v-bind:title="tooltipTitle" v-bind:data-original-title="tooltipTitle" v-bind:data-content="payouts">' +
        '   <div class="lds-heart size-20 size-30-like post-like" v-bind:class="likeClasses" v-on:click="makeVote">' +
        '       <div></div>' +
        '   </div>' +
        '</div>',
    props: {
        payouts: [String, Boolean],
        session: [Object, Boolean],
        post: {
            type: Object
        }
    },
    watch: {
        post: {
            immediate: true,
            deep: true,
            handler: function handler(newVal, oldVal) {
                this.state = this.hasVote() ? this.states.LIKED : this.states.NO_LIKE;
            }
        }
    },
    computed: {
        circleClasses: function circleClasses(){
            return {
                'circle-like-post-active': (!this.over && this.state === this.states.LIKED) || (this.over && (this.state === this.states.NO_LIKE || this.state === this.states.NO_LIKE_END))
            }
        },

        likeClasses: function likeClasses() {
            return {
                'like-normal': !this.over && (this.state === this.states.NO_LIKE || this.state === this.states.NO_LIKE_END) || (this.over && (this.state === this.states.LIKED || this.state === this.states.LIKED_END)),
                'like-normal-activate': !this.over && (this.state === this.states.LIKED || this.state === this.states.LIKED_END) || (this.over && (this.state === this.states.NO_LIKE || this.state === this.states.NO_LIKE_END)),
                'active-like': this.state === this.states.LIKE_OP
            };
        },
        tooltipTitle: function() {
            return this.post.up_votes.length + ' Likes';
        }
    },
    data: function data() {
        return {
            R: R,
            states: LIKE_STATE,
            state: 0,
            over: false
        };
    },
    methods: {
        onOver: function onOver(isOver) {
            this.over = isOver;
        },
        hasPaid: function hasPaid() {
            var now = new Date();
            var payout = toLocaleDate(this.$props.post.cashout_time);
            return now.getTime() > payout.getTime();
        },
        getVote: function getVote() {
            var session = this.$props.session;
            var post = this.$props.post;

            if (session && post) {
                var upVotes = post.up_votes;

                for (var x = 0; x < upVotes.length; x++) {
                    var vote = upVotes[x];

                    if (session.account.username === vote.voter) {
                        return vote;
                    }
                }
            }

            return null;
        },
        removeVote: function removeVote(username) {
            var post = this.post;

            if (post) {
                var upVotes = post.up_votes;
                var i = -1;

                for (var x = 0; x < upVotes.length; x++) {
                    var vote = upVotes[x];

                    if (username === vote.voter) {
                        i = x;
                        break;
                    }
                }

                if (i > -1) {
                    this.post.up_votes.slice(i, 1);
                    this.$forceUpdate();
                }
            }
        },
        hasVote: function hasVote() {
            var v = this.getVote();
            return v != null;
        },
        makeVote: function makeVote(event) {
            if (event) {
                event.preventDefault();
            }

            if (this.state !== this.states.LIKE_OP) {
                var that = this;
                var session = this.$props.session;
                var post = this.$props.post;
                var username = session ? session.account.username : null;
                var percent = that.hasVote() ? 0 : 10000;

                requireRoleKey(username, 'posting', function (postingKey, username) {
                    that.state = that.states.LIKE_OP;
                    crea.broadcast.vote(postingKey, username, post.author, post.permlink, percent, function (err, result) {
                        if (err) {
                            that.$emit('vote', err, null, post);
                        } else {
                            if (percent > 0) {
                                that.post.up_votes.push({
                                    voter: username,
                                    author: post.author,
                                    permlink: post.permlink,
                                    percent: percent
                                });
                                that.state = that.states.LIKED_END;
                            } else {
                                that.removeVote(username);
                                that.state = that.states.NO_LIKE_END;
                            }
                            that.$emit('vote', null, result, post);

                            //Update tooltip;
                            var circleLike = $('.circle-like-post');
                            var realTooltip = circleLike.attr('aria-describedby');
                            console.log('realTooltip', realTooltip);
                            realTooltip = $('#' + realTooltip);
                            if (realTooltip.length > 0) {
                                $('.popover-header').html(that.tooltipTitle)
                            }
                        }
                    });
                });
            }
        }
    },
    mounted: function mounted() {
        this.state = this.hasVote() ? LIKE_STATE.LIKED : LIKE_STATE.NO_LIKE;
    },
    updated: function updated() {
        if (this.state !== LIKE_STATE.LIKE_OP) {
            this.state = this.hasVote() ? LIKE_STATE.LIKED : LIKE_STATE.NO_LIKE;
        }
    }
});

Vue.component('post-like', {
    template: "" +
        '<div class="text-right">' +
        '   <div class="lds-heart size-20 post-like" v-bind:class="likeClasses" v-on:click="makeVote">' +
        '       <div></div>' +
        '   </div>' +
        '   <div class="dropdown inline post-like-count">' +
        '      <span class="dropdown__trigger"> {{ post.up_votes.length }}</span>' +
        '       <div class="dropdown__container">' +
        '           <div>' +
        '               <div class="row">' +
        '                   <div class="col-4 col-sm-3 col-md-6 col-lg-2 dropdown__content amount-post-view-home">' +
        '                       <ul>' +
        '                           <li v-for="v in (post.up_votes.length > 10 ? 10 : post.up_votes.length)">' +
        '                               <a v-if="(v-1) < 10" class="text-truncate" v-bind:href="\'/@\' + post.up_votes[v-1].voter">+{{ post.up_votes[v-1].voter }}</a>' +
        '                               <span v-else class="text-truncate" >+{{ "..and " + post.up_votes.length - 10  + " users"}}</span>' +
        '                           </li>' +
        '                       </ul>' +
        '                   </div>' +
        '               </div>' +
        '           </div>' +
        '       </div>' +
        '   </div>' +
        '</div>',
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
            handler: function handler(newVal, oldVal) {
                this.state = this.hasVote() ? this.states.LIKED : this.states.NO_LIKE;
            }
        }
    },
    data: function data() {
        return {
            R: R,
            states: LIKE_STATE,
            state: 0
        };
    },
    computed: {
        likeClasses: function likeClasses() {
            return {
                'like-normal': this.state === this.states.NO_LIKE || this.state === this.states.NO_LIKE_END,
                'like-normal-activate': this.state === this.states.LIKED || this.state === this.states.LIKED_END,
                'active-like': this.state === this.states.LIKE_OP
            };
        }
    },
    methods: {
        hasPaid: function hasPaid() {
            var now = new Date();
            var payout = toLocaleDate(this.$props.post.cashout_time);
            return now.getTime() > payout.getTime();
        },
        getVote: function getVote() {
            var session = this.$props.session;
            var post = this.$props.post;

            if (session && post) {
                var upVotes = post.up_votes;

                for (var x = 0; x < upVotes.length; x++) {
                    var vote = upVotes[x];

                    if (session.account.username === vote.voter) {
                        return vote;
                    }
                }
            }

            return null;
        },
        removeVote: function removeVote(username) {
            var post = this.post;

            if (post) {
                var upVotes = post.up_votes;
                var i = -1;

                for (var x = 0; x < upVotes.length; x++) {
                    var vote = upVotes[x];

                    if (username === vote.voter) {
                        i = x;
                        break;
                    }
                }

                console.log(i, username);
                if (i > -1) {
                    this.post.up_votes.slice(i, 1);
                    this.$forceUpdate();
                }
            }
        },
        hasVote: function hasVote() {
            var v = this.getVote();
            return v != null;
        },
        makeVote: function makeVote(event) {
            if (event) {
                event.preventDefault();
            }

            if (this.state !== this.states.LIKE_OP) {
                var that = this;
                var session = this.$props.session;
                var post = this.$props.post;
                var username = session ? session.account.username : null;
                var percent = that.hasVote() ? 0 : 10000;

                requireRoleKey(username, 'posting', function (postingKey, username) {
                    that.state = that.states.LIKE_OP;
                    crea.broadcast.vote(postingKey, username, post.author, post.permlink, percent, function (err, result) {
                        console.log(err, result);

                        if (err) {
                            that.$emit('vote', err, null, post);
                        } else {
                            if (percent > 0) {
                                that.post.up_votes.push({
                                    voter: username,
                                    author: post.author,
                                    permlink: post.permlink,
                                    percent: percent
                                });
                                that.state = that.states.LIKED_END;
                            } else {
                                that.removeVote(username);
                                that.state = that.states.NO_LIKE_END;
                            }
                            that.$emit('vote', null, result, post);
                        }
                    });
                });
            }
        }
    },
    mounted: function mounted() {
        this.state = this.hasVote() ? LIKE_STATE.LIKED : LIKE_STATE.NO_LIKE;
    },
    updated: function updated() {
        if (this.state != LIKE_STATE.LIKE_OP) {
            this.state = this.hasVote() ? LIKE_STATE.LIKED : LIKE_STATE.NO_LIKE;
        }
    }
});

Vue.component('comment-like', {
    template: '' +
        '<div>' +
        '   <div class="lds-heart size-20 size-20-comment comment-like" v-bind:class="likeClasses" v-on:click="makeVote">' +
        '       <div></div>' +
        '   </div>' +
        '   <div class="dropdown inline">' +
        '       <span class="dropdown__trigger">{{ post.up_votes.length }}</span>' +
        '       <div class="dropdown__container">' +
        '           <div class="container">' +
        '               <div class="row">' +
        '                   <div class="col-4 col-sm-3 col-md-6 col-lg-2 dropdown__content dropdown-like-comment">' +
        '                       <ul>' +
        '                           <li v-for="v in (post.up_votes.length > 10 ? 10 : post.up_votes.length)">' +
        '                               <a v-if="(v-1) < 10" class="text-truncate" v-bind:href="\'/@\' + post.up_votes[v-1].voter">+{{ post.up_votes[v-1].voter }}</a>' +
        '                               <span v-else class="text-truncate" >+{{ "..and " + post.up_votes.length - 10  + " users"}}</span>' +
        '                           </li>' +
        '                       </ul>' +
        '                   </div>' +
        '               </div>' +
        '           </div>' +
        '       </div>' +
        '   </div>' +
        '</div>',
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
            handler: function handler(newVal, oldVal) {
                this.state = this.hasVote() ? this.states.LIKED : this.states.NO_LIKE;
            }
        }
    },
    data: function data() {
        return {
            R: R,
            states: LIKE_STATE,
            state: 0
        };
    },
    computed: {
        likeClasses: function likeClasses() {
            return {
                'like-normal': this.state === this.states.NO_LIKE || this.state === this.states.NO_LIKE_END,
                'like-normal-activate': this.state === this.states.LIKED || this.state === this.states.LIKED_END,
                'active-like': this.state === this.states.LIKE_OP
            };
        }
    },
    methods: {
        hasPaid: function hasPaid() {
            var now = new Date();
            var payout = toLocaleDate(this.$props.post.cashout_time);
            return now.getTime() > payout.getTime();
        },
        getVote: function getVote() {
            var session = this.$props.session;
            var post = this.$props.post;

            if (session && post) {
                var upVotes = post.up_votes;

                for (var x = 0; x < upVotes.length; x++) {
                    var vote = upVotes[x];

                    if (session.account.username === vote.voter) {
                        return vote;
                    }
                }
            }

            return null;
        },
        removeVote: function removeVote(username) {
            var post = this.post;

            if (post) {
                var upVotes = post.up_votes;
                var i = -1;

                for (var x = 0; x < upVotes.length; x++) {
                    var vote = upVotes[x];

                    if (username === vote.voter) {
                        i = x;
                        break;
                    }
                }

                console.log(i, username);
                if (i > -1) {
                    this.post.up_votes.slice(i, 1);
                    this.$forceUpdate();
                }
            }
        },
        hasVote: function hasVote() {
            var v = this.getVote();
            return v != null;
        },
        makeVote: function makeVote(event) {
            if (event) {
                event.preventDefault();
            }

            if (this.state !== this.states.LIKE_OP) {
                var that = this;
                var session = this.$props.session;
                var post = this.$props.post;
                var username = session ? session.account.username : null;
                var percent = that.hasVote() ? 0 : 10000;

                requireRoleKey(username, 'posting', function (postingKey, username) {
                    that.state = that.states.LIKE_OP;
                    crea.broadcast.vote(postingKey, username, post.author, post.permlink, percent, function (err, result) {
                        console.log(err, result);

                        if (err) {
                            that.$emit('vote', err, null, post);
                        } else {
                            if (percent > 0) {
                                that.post.up_votes.push({
                                    voter: username,
                                    author: post.author,
                                    permlink: post.permlink,
                                    percent: percent
                                });
                                that.state = that.states.LIKED_END;
                            } else {
                                that.removeVote(username);
                                that.state = that.states.NO_LIKE_END;
                            }
                            that.$emit('vote', null, result, post);
                        }
                    });
                });
            }
        }
    },
    mounted: function mounted() {
        this.state = this.hasVote() ? LIKE_STATE.LIKED : LIKE_STATE.NO_LIKE;
    },
    updated: function updated() {
        if (this.state != LIKE_STATE.LIKE_OP) {
            this.state = this.hasVote() ? LIKE_STATE.LIKED : LIKE_STATE.NO_LIKE;
        }
    }
});

Vue.component('like', {
    template: '' +
        '<div>' +
        '   <div class="lds-heart size-20" v-bind:class="likeClasses" v-on:click="makeVote">' +
        '       <div></div>' +
        '   </div>' +
        '   <span>{{ post.up_votes.length }}</span>' +
        '</div>',
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
            handler: function handler(newVal, oldVal) {
                this.state = this.hasVote() ? this.states.LIKED : this.states.NO_LIKE;
            }
        }
    },
    data: function data() {
        return {
            R: R,
            states: LIKE_STATE,
            state: 0
        };
    },
    computed: {
        likeClasses: function likeClasses() {
            return {
                'like-normal': this.state === this.states.NO_LIKE || this.state === this.states.NO_LIKE_END,
                'like-normal-activate': this.state === this.states.LIKED || this.state === this.states.LIKED_END,
                'active-like': this.state === this.states.LIKE_OP
            };
        }
    },
    methods: {
        hasPaid: function hasPaid() {
            var now = new Date();
            var payout = toLocaleDate(this.$props.post.cashout_time);
            return now.getTime() > payout.getTime();
        },
        getVote: function getVote() {
            var session = this.$props.session;
            var post = this.$props.post;

            if (session && post) {
                var upVotes = post.up_votes;

                for (var x = 0; x < upVotes.length; x++) {
                    var vote = upVotes[x];

                    if (session.account.username === vote.voter) {
                        return vote;
                    }
                }
            }

            return null;
        },
        removeVote: function removeVote(username) {
            var post = this.post;

            if (post) {
                var upVotes = post.up_votes;
                var i = -1;

                for (var x = 0; x < upVotes.length; x++) {
                    var vote = upVotes[x];

                    if (username === vote.voter) {
                        i = x;
                        break;
                    }
                }

                console.log(i, username);
                if (i > -1) {
                    this.post.up_votes.slice(i, 1);
                    this.$forceUpdate();
                }
            }
        },
        hasVote: function hasVote() {
            var v = this.getVote();
            return v != null;
        },
        makeVote: function makeVote(event) {
            if (event) {
                event.preventDefault();
            }

            if (this.state !== this.states.LIKE_OP) {
                var that = this;
                var session = this.$props.session;
                var post = this.$props.post;
                var username = session ? session.account.username : null;
                var percent = that.hasVote() ? 0 : 10000;

                requireRoleKey(username, 'posting', function (postingKey, username) {
                    that.state = that.states.LIKE_OP;
                    crea.broadcast.vote(postingKey, username, post.author, post.permlink, percent, function (err, result) {
                        console.log(err, result);

                        if (err) {
                            that.$emit('vote', err, null, post);
                        } else {
                            if (percent > 0) {
                                that.post.up_votes.push({
                                    voter: username,
                                    author: post.author,
                                    permlink: post.permlink,
                                    percent: percent
                                });
                                that.state = that.states.LIKED_END;
                            } else {
                                that.removeVote(username);
                                that.state = that.states.NO_LIKE_END;
                            }
                            that.$emit('vote', null, result, post);
                        }

                        that.$forceUpdate();
                    });
                });
            }
        }
    },
    mounted: function mounted() {
        this.state = this.hasVote() ? LIKE_STATE.LIKED : LIKE_STATE.NO_LIKE;
    },
    updated: function updated() {
        if (this.state !== LIKE_STATE.LIKE_OP) {
            this.state = this.hasVote() ? LIKE_STATE.LIKED : LIKE_STATE.NO_LIKE;
        }
    }
});

Vue.component('new-like', {
    template: '' +
        '<div class="row-likes">' +
        '   <div class="d-flex w-100">' +
        '       <div>' +
        '           <div class="text-right">' +
        '               <div class="lds-heart size-20 post-like" v-bind:class="likeClasses" v-on:click="makeVote">' +
        '                   <div></div>' +
        '               </div>' +
        '               <div class="dropdown inline post-like-count">' +
        '                   <span class="dropdown__trigger"> {{ post.up_votes.length }}</span>' +
        '                   <div class="dropdown__container">' +
        '                       <div class="container">' +
        '                           <div class="row">' +
        '                               <div class="col-4 col-sm-3 col-md-6 col-lg-2 dropdown__content amount-post-view-home">' +
        '                                   <ul class="list-inline text-right">' +
        '                                       <template v-for="v in (post.up_votes.length > 10 ? 10 : post.up_votes.length)">' +
        '                                           <li class="list-inline-item w-100">' +
        '                                               <a v-if="(v-1) < 10" v-bind:href="\'/@\' + post.up_votes[v-1].voter" class="text-truncate">+{{ post.up_votes[v-1].voter }}</a>' +
        '                                               <span v-else class="text-truncate" >+{{ "..and " + post.up_votes.length - 10  + " users"}}</span>' +
        '                                           </li>' +
        '                                       </template>' +
        '                                   </ul>' +
        '                               </div>' +
        '                           </div>' +
        '                       </div>' +
        '                   </div>' +
        '               </div>' +
        '           </div>' +
        '       </div>' +
        '   </div>' +
        '</div>',
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
            handler: function handler(newVal, oldVal) {
                this.state = this.hasVote() ? this.states.LIKED : this.states.NO_LIKE;
            }
        }
    },
    data: function data() {
        return {
            R: R,
            states: LIKE_STATE,
            state: 0
        };
    },
    computed: {
        likeClasses: function likeClasses() {
            return {
                'like-normal': this.state === this.states.NO_LIKE || this.state === this.states.NO_LIKE_END,
                'like-normal-activate': this.state === this.states.LIKED || this.state === this.states.LIKED_END,
                'active-like': this.state === this.states.LIKE_OP
            };
        }
    },
    methods: {
        hasPaid: function hasPaid() {
            var now = new Date();
            var payout = toLocaleDate(this.$props.post.cashout_time);
            return now.getTime() > payout.getTime();
        },
        getVote: function getVote() {
            var session = this.$props.session;
            var post = this.$props.post;

            if (session && post) {
                var upVotes = post.up_votes;

                for (var x = 0; x < upVotes.length; x++) {
                    var vote = upVotes[x];

                    if (session.account.username === vote.voter) {
                        return vote;
                    }
                }
            }

            return null;
        },
        removeVote: function removeVote(username) {
            var post = this.post;

            if (post) {
                var upVotes = post.up_votes;
                var i = -1;

                for (var x = 0; x < upVotes.length; x++) {
                    var vote = upVotes[x];

                    if (username === vote.voter) {
                        i = x;
                        break;
                    }
                }

                console.log(i, username);
                if (i > -1) {
                    this.post.up_votes.slice(i, 1);
                    this.$forceUpdate();
                }
            }
        },
        hasVote: function hasVote() {
            var v = this.getVote();
            return v != null;
        },
        makeVote: function makeVote(event) {
            if (event) {
                event.preventDefault();
            }

            if (this.state !== this.states.LIKE_OP) {
                var that = this;
                var session = this.$props.session;
                var post = this.$props.post;
                var username = session ? session.account.username : null;
                var percent = that.hasVote() ? 0 : 10000;

                console.log(this.hasVote(), percent);
                requireRoleKey(username, 'posting', function (postingKey, username) {
                    that.state = that.states.LIKE_OP;
                    crea.broadcast.vote(postingKey, username, post.author, post.permlink, percent, function (err, result) {
                        if (err) {
                            that.$emit('vote', err, null, post);
                        } else {
                            if (percent > 0) {
                                that.post.up_votes.push({
                                    voter: username,
                                    author: post.author,
                                    permlink: post.permlink,
                                    percent: percent
                                });
                                that.state = that.states.LIKED_END;
                            } else {
                                that.removeVote(username);
                                that.state = that.states.NO_LIKE_END;
                            }
                            that.$emit('vote', null, result, post);
                        }

                        that.$forceUpdate();
                        console.log(err, that.state);
                    });
                });
            }
        }
    },
    mounted: function mounted() {
        this.state = this.hasVote() ? LIKE_STATE.LIKED : LIKE_STATE.NO_LIKE;
    },
    updated: function updated() {
        if (this.state !== LIKE_STATE.LIKE_OP) {
            this.state = this.hasVote() ? LIKE_STATE.LIKED : LIKE_STATE.NO_LIKE;
        }
    }
});

Vue.component('witness-like', {
    template: '<div>' +
        '<span class="d-flex">{{ index }}' +
        '   <div class="lds-heart size-20" v-bind:class="voteClasses" v-on:click="makeVote" style="margin-top: 5px;">' +
        '       <div></div>' +
        '   </div>' +
        '</span></div>',
    props: {
        session: [Object, Boolean],
        account: [Object, Boolean],
        witness: Object,
        index: Number
    },
    watch: {
        account: {
            immediate: true,
            deep: true,
            handler: function handler(newVal, oldVal) {
                this.state = this.hasVote() ? this.states.VOTED : this.states.NO_VOTE;
            }
        }
    },
    data: function data() {
        return {
            R: R,
            states: WITNESS_STATE,
            state: WITNESS_STATE.NO_VOTE
        };
    },
    computed: {
        voteClasses: function () {
            return {
                'like-normal': this.state === this.states.NO_VOTE || this.state === this.states.NO_VOTE_END,
                'like-normal-activate': this.state === this.states.VOTED || this.state === this.states.VOTED_END,
                'active-like': this.state === this.states.VOTE_OP
            }
        }
    },
    methods: {
        removeVote: function removeVote() {
            var i = this.account.witness_votes.indexOf(this.witness.owner);
            if (i > -1) {
                this.account.witness_votes.splice(i, 1);
            }

            this.$forceUpdate();
        },
        hasVote: function hasVote() {
            var session = this.$props.session;
            var account = this.$props.account;

            if (session && account) {
                return account.witness_votes.indexOf(this.$props.witness.owner) >= 0;
            }

            return false;
        },
        makeVote: function makeVote(event) {
            if (event) {
                event.preventDefault();
            }

            if (this.state !== this.states.VOTE_OP) {
                var that = this;
                var session = this.$props.session;
                var witness = this.$props.witness;
                var username = session ? session.account.username : null;
                var vote = !this.hasVote();
                console.log('Voting for', witness.owner, vote);

                requireRoleKey(username, 'active', function (activeKey, username) {
                    that.state = that.states.VOTE_OP;

                    crea.broadcast.accountWitnessVote(activeKey, username, witness.owner, vote, function (err, result) {
                        if (err) {
                            that.$emit('vote', err);
                        } else {
                            if (vote) {
                                that.account.witness_votes.push(witness.owner);
                                that.state = that.states.VOTED_END;
                            } else {
                                that.removeVote();
                                that.state = that.states.NO_VOTE_END;
                            }
                            that.$emit('vote', null, result);
                        }
                    });
                });

            }
        }
    },
    mounted: function mounted() {
        this.state = this.hasVote() ? this.states.VOTED : this.states.NO_VOTE;
    },
    updated: function updated() {
        if (this.state !== this.states.VOTE_OP) {
            this.state = this.hasVote() ? this.states.VOTED : this.states.NO_VOTE;
        }
    }
});

var FOLLOW_STATE = {
    NO_FOLLOWING: 0,
    UNFOLLOWED: 1,
    FOLLOWING: 2,
    FOLLOWED: 3,
    UNFOLLOWING_OP: 4,
    FOLLOWING_OP: 5
};

Vue.component('btn-follow', {
    template: "<div v-on:click=\"performFollow\" v-on:mouseleave=\"onleave\" v-on:mouseover=\"onover\" class=\"btn btn-sm running ld ld-ext-right font-weight-bold\" v-bind:class=\"btnClasses\">\n<div class=\"btn__text ld-spin-fast ld\" v-bind:class=\"textClasses\"></div>{{ text }}<div></div>\n</div>",
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
            handler: function handler(newVal, oldVal) {
                this.$forceUpdate();
            }
        },
        account: {
            immediate: true,
            deep: true,
            handler: function handler(newVal, oldVal) {
                this.$forceUpdate();
            }
        }
    },
    computed: {
        btnClasses: function btnClasses() {
            return {
                'btn--primary': this.state === this.states.NO_FOLLOWING || this.state === this.states.UNFOLLOWED || this.state === this.states.FOLLOWING_OP,
                'btn-following': !this.over && (this.state === this.states.FOLLOWING || this.state === this.states.FOLLOWED) || this.state === this.states.UNFOLLOWING_OP,
                'btn-unfollow': this.over && (this.state === this.states.FOLLOWING || this.state === this.states.FOLLOWED)
            };
        },
        textClasses: function textClasses() {
            return {
                'text__dark': !this.over && (this.state === this.states.FOLLOWING || this.state === this.states.FOLLOWED),
                'ld-ring': this.state === this.states.FOLLOWING_OP || this.state === this.states.UNFOLLOWING_OP,
                'ld-ring-blue': this.state === this.states.UNFOLLOWING_OP
            };
        }
    },
    data: function data() {
        return {
            lang: lang,
            over: false,
            states: FOLLOW_STATE,
            state: FOLLOW_STATE.NO_FOLLOWING,
            lastState: FOLLOW_STATE.NO_FOLLOWING,
            text: null
        };
    },
    methods: {
        isStateOp: function isStateOp() {
            return this.state === this.states.FOLLOWING_OP || this.state === this.states.UNFOLLOWING_OP;
        },
        isStateFollowing: function isStateFollowing(state) {
            return state === this.states.FOLLOWING || state === this.states.FOLLOWED;
        },
        performFollow: function performFollow() {
            if (!this.isStateOp()) {
                var operation = 'follow';
                var that = this;
                var session = this.$props.session;
                var lastState = this.state;
                this.state = this.isStateFollowing(this.state) ? this.states.UNFOLLOWING_OP : this.states.FOLLOWING_OP;

                if (session) {
                    var followJson = {
                        follower: session.account.username,
                        following: this.$props.user,
                        what: this.isStateFollowing(lastState) ? [] : ['blog']
                    };
                    followJson = [operation, followJson];
                    requireRoleKey(session.account.username, 'posting', function (postingKey) {
                        crea.broadcast.customJson(postingKey, [], [session.account.username], operation, jsonstring(followJson), function (err, result) {
                            if (err) {
                                that.state = lastState;
                                that.$emit('follow', err);
                            } else {
                                that.state = that.isStateFollowing(lastState) ? that.states.UNFOLLOWED : that.states.FOLLOWED;
                                that.$emit('follow', null, result);
                            }
                        });
                    });
                } else {
                    this.state = lastState;
                    this.$emit('follow', Errors.USER_NOT_LOGGED);
                }
            }
        },
        onover: function onover() {
            this.over = true;
        },
        onleave: function onleave() {
            this.over = false;
        },
        isFollowing: function isFollowing() {
            return this.session && this.account.followings.includes(this.user);
        },
        updateText: function updateText() {
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
    updated: function updated() {
        if (!this.isStateOp()) {
            this.state = this.isFollowing() ? this.states.FOLLOWING : this.states.NO_FOLLOWING;
        }

        this.updateText();
    },
    mounted: function mounted() {
        this.state = this.isFollowing() ? this.states.FOLLOWING : this.states.NO_FOLLOWING;
        this.updateText();
    }
});

Vue.component('username', {
    template: "<a v-bind:href=\"'/@' + user\" class=\"color-name\"><p>{{ name || user }}</p></a>",
    props: {
        user: {
            type: String
        },
        name: {
            type: String
        },
        inline: {
            type: Number,
            'default': 1
        }
    }
});

Vue.component('linkname', {
    template: "<a v-bind:href=\"'/@' + user\" class=\"link-username\">{{ name || '@' + user }}</a>",
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
    template: '<div class="img-user-avatar" v-bind:style="{ \'background-image\': \'url(\' + ( getDefaultAvatar(account)) + \')\' }"></div>',
    props: {
        account: {
            type: Object
        }
    },
    methods: {
        getDefaultAvatar: R.getAvatar
    }
});

Vue.component('taginput', {
    template: "<input v-bind:id=\"id\" class=\"validate-required\" type=\"text\" v-bind:value=\"value\" v-bind:data-role=\"data-role\" v-bind:data-options=\"data-options\" v-bind:placeholder=\"placeholder\" />",
    props: {
        id: {
            type: String
        },
        value: {
            type: String
        },
        'data-role': {
            type: String,
            'default': 'tagsinput'
        },
        placeholder: {
            type: String
        },
        'data-options': {
            type: String
        }
    },
    mounted: function mounted() {
        var el = $('#' + this.id); //this['data-options'] = JSON.parse(this['data-options']);

        console.log('Mounted tags', el, this.id, this.options, this.role); //tags(this.id);
    }
});

Vue.component('ckeditor', {
    template: "<textarea v-bind:id=\"id\" v-bind:value=\"value\" rows=30 cols=80></textarea>",
    props: {
        value: {
            type: String
        },
        id: {
            type: String,
            'default': 'editor'
        }
    },
    beforeUpdate: function beforeUpdate() {
        var ckeditorId = this.id;

        if (this.value !== CKEDITOR.instances[ckeditorId].getData()) {
            CKEDITOR.instances[ckeditorId].setData(this.value);
        }
    },
    methods: {
        onInput: function onInput(event) {
            console.log(event);
            this.$emit('input', true);
        }
    },
    mounted: function mounted() {
        var _this = this;

        var ckeditorId = this.id;
        console.log(this.value);
        var config = {};
        config.toolbarGroups = [{
            name: 'clipboard',
            groups: ['clipboard', 'undo']
        }, {
            name: 'basicstyles',
            groups: ['basicstyles', 'cleanup']
        }, {
            name: 'links',
            groups: ['links']
        }, {
            name: 'styles',
            groups: ['styles']
        }, {
            name: 'paragraph',
            groups: ['list', 'indent', 'blocks', 'align', 'bidi', 'paragraph']
        }, {
            name: 'editing',
            groups: ['find', 'selection', 'spellchecker', 'editing']
        }, {
            name: 'insert',
            groups: ['insert']
        }, {
            name: 'forms',
            groups: ['forms']
        }, {
            name: 'tools',
            groups: ['tools']
        }, {
            name: 'document',
            groups: ['mode', 'document', 'doctools']
        }, {
            name: 'others',
            groups: ['others']
        }, '/', {
            name: 'colors',
            groups: ['colors']
        }, {
            name: 'about',
            groups: ['about']
        }];
        config.removeButtons = 'Subscript,Superscript,PasteText,PasteFromWord,Undo,Redo,Scayt,Anchor,Image,Maximize,Source,HorizontalRule,Table,SpecialChar,Strike,RemoveFormat,NumberedList,Blockquote,About,BulletedList'; //Disallow tags, classes and attributes

        config.disallowedContent = 'img script *[on*] *[style]'; // Set the most common block elements.

        config.format_tags = 'p;h1;h2;h3;h4;pre'; // Simplify the dialog windows.

        config.removeDialogTabs = 'image:advanced;link:advanced';
        config.resize_enabled = true; //config.extraPlugins = 'html5audio,html5video';

        CKEDITOR.replace(ckeditorId, config); //CKEDITOR.disableAutoInline = true;
        //CKEDITOR.inline(ckeditorId, config);

        CKEDITOR.instances[ckeditorId].setData(this.value);
        var that = this;
        CKEDITOR.instances[ckeditorId].on('change', function () {
            var ckeditorData = CKEDITOR.instances[ckeditorId].getData();

            if (ckeditorData !== _this.value) {
                that.$emit('input', ckeditorData);
            }
        });
    },
    destroyed: function destroyed() {
        var ckeditorId = this.id;

        if (CKEDITOR.instances[ckeditorId]) {
            CKEDITOR.instances[ckeditorId].destroy();
        }
    }
});