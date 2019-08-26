
(function () {

    var postContainer, otherProjectsContainer;
    var promoteModal, downloadModal, reportModal, reportCommentModal;
    var session, userAccount;

    function onVueReady() {
/*        --vueInstances;

        if (vueInstances === 0) {
            creaEvents.emit('crea.dom.ready');
        }*/
    }

    function setUp(state) {

        updateUrl(state.post.url, 'Creary - ' + state.post.title, state);
        console.log(clone(state));

        if (!postContainer) {
            postContainer = new Vue({
                el: '#post-navigation-view',
                data: {
                    lang: lang,
                    CONSTANTS: CONSTANTS,
                    session: session,
                    user: userAccount ? userAccount.user : false,
                    state: state,
                    comment: '',
                    response_comment: '',
                    active_comment: null,
                    active_comment_edit: null,
                    active_response: null,
                    active_response_edit: null,
                    comments_shown: CONSTANTS.POST.MAX_COMMENT_SHOWN,
                    navigation: true
                },
                watch: {
                    state: {
                        immediate: true,
                        deep: true,
                        handler: function handler(newVal, oldVal) {
                            if (newVal) {
                                globalLoading.show = !newVal.post;
                            }
                        }
                    }
                },
                mounted: function mounted() {
                    onVueReady();
                },
                methods: {
                    nextPost: nextPost,
                    lastPost: lastPost,
                    showPost: showPost,
                    humanFileSize: humanFileSize,
                    getBuzzClass: function getBuzzClass(account) {
                        var buzzClass = {};
                        var levelName = account.buzz.level_name;

                        buzzClass[levelName] = true;
                        return buzzClass;
                    },
                    cbdToDollar: function cbdToDollar(cbd) {
                        return '$ ' + Asset.parseString(cbd).toPlainString();
                    },
                    assetToString: function assetToString(asset) {
                        return Asset.parse(asset).toFriendlyString();
                    },
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
                    getDefaultAvatar: R.getAvatar,
                    getLicense: function getLicense() {
                        return License.fromFlag(this.state.post.metadata.license);
                    },
                    dateFromNow: function dateFromNow(date) {
                        return moment(toLocaleDate(date)).fromNow();
                    },
                    formatDate: function formatDate(date) {
                        return moment(date + 'Z').format('LLLL');
                    },
                    hasPaid: function hasPaid(post) {
                        post = post || this.state.post;
                        var now = new Date();
                        var payout = toLocaleDate(post.cashout_time);
                        return now.getTime() > payout.getTime();
                    },
                    getPayoutPostDate: function getPayoutPostDate(post) {
                        post = post || this.state.post;
                        var date = toLocaleDate(post.cashout_time);

                        if (this.hasPaid(post)) {
                            date = toLocaleDate(post.last_payout);
                        }

                        return moment(date).fromNow();
                    },
                    hasPromotion: function hasPromotion() {
                        var post = this.state.post;
                        var amount = Asset.parseString(post.promoted);
                        return amount.amount > 0;
                    },
                    getPromotion: function getPromotion() {
                        var post = this.state.post;
                        var amount = Asset.parseString(post.promoted);
                        return '$ ' + amount.toPlainString();
                    },
                    getPayout: function getPayout(post, sym, dec) {

                        post = post || this.state.post;

                        if (!dec) {
                            dec = 2;
                        }

                        var amount = Asset.parseString(post.pending_payout_value);

                        if (this.hasPaid(post)) {
                            amount = Asset.parseString(post.total_payout_value);
                            amount = amount.add(Asset.parseString(post.curator_payout_value));
                        } //amount.amount = parseInt(amount.amount / 1000000000);


                        return (sym ? '$ ' : '') + amount.toPlainString(dec);
                    },
                    getFriendlyPayout: function getFriendlyPayout(post) {
                        post = post || this.state.post;
                        return this.getPayout(post, false) + ' CBD';
                    },
                    getPendingPayouts: function getPendingPayouts(post, asset) {
                        if (asset) {
                            console.log('Asset:', asset)
                        }
                        asset = asset ? asset.toLowerCase() : '';

                        post = post || this.state.post;
                        var PRICE_PER_CREA = Asset.parse({
                            amount: Asset.parseString(this.state.feed_price.base).toFloat() / Asset.parseString(this.state.feed_price.quote).toFloat(),
                            nai: 'cbd'
                        });
                        var CBD_PRINT_RATE = this.state.props.cbd_print_rate;
                        var CBD_PRINT_RATE_MAX = 10000;
                        var payout = Asset.parseString(post.pending_payout_value); //payout.amount = parseInt(payout.amount / 1000000000);

                        var PENDING_PAYOUT = payout;
                        var PERCENT_CREA_DOLLARS = post.percent_crea_dollars / 20000;
                        var PENDING_PAYOUT_CBD = Asset.parse({
                            amount: PENDING_PAYOUT.toFloat() * PERCENT_CREA_DOLLARS,
                            nai: 'cbd'
                        });
                        var PENDING_PAYOUT_CGY = Asset.parse({
                            amount: NaNOr(((PENDING_PAYOUT.toFloat() - PENDING_PAYOUT_CBD.toFloat()) / PRICE_PER_CREA.toFloat()), 0),
                            nai: 'cgy'
                        });
                        var PENDING_PAYOUT_PRINTED_CBD = Asset.parse({
                            amount: NaNOr((PENDING_PAYOUT_CBD.toFloat() * (CBD_PRINT_RATE / CBD_PRINT_RATE_MAX)), 0),
                            nai: 'cbd'
                        });
                        var PENDING_PAYOUT_PRINTED_CREA = Asset.parse({
                            amount: NaNOr(((PENDING_PAYOUT_CBD.toFloat() - PENDING_PAYOUT_PRINTED_CBD.toFloat()) / PRICE_PER_CREA.toFloat()), 0),
                            nai: 'crea'
                        });

                        switch (asset) {
                            case 'cgy':
                                return PENDING_PAYOUT_CGY.toFriendlyString(null, false);
                            case 'cbd':
                                return PENDING_PAYOUT_PRINTED_CBD.toFriendlyString(null, false);
                            case 'crea':
                                return PENDING_PAYOUT_PRINTED_CREA.toFriendlyString(null, false);
                            default:
                                return '(' + PENDING_PAYOUT_PRINTED_CBD.toFriendlyString(null, false) + ', ' + PENDING_PAYOUT_PRINTED_CREA.toFriendlyString(null, false) + ', ' + PENDING_PAYOUT_CGY.toFriendlyString(null, false) + ')';
                        }
                    },
                    showMoreComments: function() {
                        this.comments_shown += CONSTANTS.POST.COMMENT_SHOW_INTERVAL;
                        this.$forceUpdate();
                    },
                    getFeaturedImage: function getFeaturedImage(post) {
                        var featuredImage = post.metadata.featuredImage;

                        if (featuredImage && featuredImage.hash) {
                            return {
                                url: 'https://ipfs.creary.net/ipfs/' + featuredImage.hash
                            };
                        } else if (featuredImage && featuredImage.url) {
                            return featuredImage;
                        }

                        return {};
                    },
                    getLinkedTags: function getLinkedTags(asString) {
                        //<a v-bind:href="'/popular/' + x">{{ x }}</a>
                        var tags = this.state.post.metadata.tags;
                        var linkedTags = [];
                        tags.forEach(function (t) {
                            linkedTags.push('<a href="/search?page=1&query=' + encodeURIComponent(t) + '">' + t + '</a>');
                        });

                        if (asString) {
                            return linkedTags.join(', ');
                        }

                        return linkedTags;
                    },
                    isSameUser: function isSameUser() {
                        if (this.session) {
                            return this.state.post.author === this.session.account.username;
                        }

                        return false;
                    },
                    isCommentResponse: function(comment, parentComment) {
                        return comment.parent_author === parentComment.author && comment.parent_permlink === parentComment.permlink;
                    },
                    editPost: function editPost() {
                        var route = this.state.post.author + '/' + this.state.post.permlink;
                        goTo('/publish?edit=' + encodeURIComponent(route));
                    },
                    addComment: function (parentPost, commentReply, editingResponse) {
                        var that = this;

                        var post = editingResponse;
                        var comment = commentReply ? this.response_comment : this.comment;
                        makeComment(comment, post, parentPost, function (err, result) {
                            globalLoading.show = false;
                            if (!catchError(err)) {

                                if (commentReply) {
                                    that.cleanMakeResponse();
                                } else {
                                    that.cleanMakeComment();
                                }
                                showPostData(that.state.post, that.state, that.state.discuss, that.state.category, null, true);
                            }
                        })
                    },
                    linkfyUser: function (comment) {
                        return makeMentions(comment, this.state);
                    },
                    mustShowCommentField: function (comment) {
                        return (this.active_response != null && this.active_response.link === comment.link) || (this.active_response_edit != null && this.active_response_edit.parent_author === comment.author && this.active_response_edit.parent_permlink === comment.permlink);
                    },
                    setActiveComment: function(activeComment) {
                        this.active_comment = activeComment;
                        if (reportCommentModal) {
                            reportCommentModal.active_comment = activeComment;
                            reportCommentModal.$forceUpdate();
                        }

                        this.$forceUpdate();
                    },
                    setActiveCommentEdit: function(editComment) {
                        this.active_comment_edit = editComment;
                        this.comment = editComment.body;
                        this.$forceUpdate();
                    },
                    cleanMakeComment: function() {
                        this.active_comment = null;
                        this.active_comment_edit = null;
                        this.comment = '';
                        this.$forceUpdate();
                    },
                    cleanMakeResponse: function() {
                        this.active_response = null;
                        this.active_response_edit = null;
                        this.response_comment = '';
                        this.$forceUpdate();
                    },
                    makeDownload: makeDownload,
                    removeComment: function(comment) {
                        var that = this;
                        deleteComment(comment, this.session, function (err, result) {
                            if (!catchError(err)) {
                                globalLoading.show = false;
                                showPostData(that.state.post, that.state, that.state.discuss, that.state.category, null, true);
                            }
                        })
                    },
                    editComment: function(comment) {
                        this.response_comment = comment.body;
                        this.active_response_edit = comment;
                    },
                    ignoreUser: function (_ignoreUser) {
                        function ignoreUser() {
                            return _ignoreUser.apply(this, arguments);
                        }

                        ignoreUser.toString = function () {
                            return _ignoreUser.toString();
                        };

                        return ignoreUser;
                    }(function () {
                        ignoreUser(this.state.post.author, true, function (err, result) {
                            updatePostData();
                        });
                    }),
                    vote: function vote(post, weight) {
                        console.log('Vote', weight, post);
                        post = post || this.state.post;
                        if (this.session) {
                            var that = this;
                            var username = this.session.account.username;
                            requireRoleKey(username, 'posting', function (postingKey) {
                                globalLoading.show = true;
                                crea.broadcast.vote(postingKey, username, post.author, post.permlink, weight, function (err, result) {
                                    globalLoading.show = false;
                                    if (!catchError(err)) {
                                        showPostData(that.state.post, that.state, that.state.discuss, that.state.category, null, true);
                                        showModal('#modal-post');
                                    }
                                });
                            });
                        }
                    },
                    onVote: function onVote(err) {
                        var that = this;
                        catchError(err);
                        showPostData(that.state.post, that.state, that.state.discuss, that.state.category, null, true);
                    },
                    onFollow: function onFollow(err, result) {
                        catchError(err);
                        showPostData(that.state.post, that.state, that.state.discuss, that.state.category, null, true);
                    }
                }
            });
        } else {
            postContainer.state = state;
            postContainer.session = session;
            postContainer.user = userAccount ? userAccount.user : null;
        }

        postContainer.$forceUpdate();

        if (session) {
            if (!promoteModal) {
                promoteModal = new Vue({
                    el: "#modal-promote",
                    data: {
                        lang: lang,
                        session: session,
                        user: userAccount ? userAccount.user : null,
                        state: state,
                        amount: 0
                    },
                    mounted: function mounted() {
                        onVueReady();
                    },
                    methods: {
                        hideModalPromote: function hideModalPromote(event) {
                            cancelEventPropagation(event);
                            hideModal('#modal-promote');
                            showModal('#modal-post');
                        },
                        makePromotion: function makePromotion(event) {
                            cancelEventPropagation(event);
                            var from = this.session.account.username;
                            var to = 'null';
                            var memo = "@" + this.state.post.author + '/' + this.state.post.permlink;
                            var amount = parseFloat(this.amount) + 0.0001;
                            console.log(amount);
                            amount = Asset.parse({
                                amount: amount,
                                nai: apiOptions.nai.CBD
                            }).toFriendlyString(null, false);
                            console.log(amount);
                            var that = this;
                            requireRoleKey(from, 'active', function (activeKey) {
                                globalLoading.show = true;
                                crea.broadcast.transfer(activeKey, from, to, amount, memo, function (err, result) {
                                    globalLoading.show = false;

                                    if (!catchError(err)) {
                                        that.hideModalPromote();
                                        updateUserSession();
                                    }
                                });
                            });
                        }
                    }
                });
            } else {
                promoteModal.session = session;
                promoteModal.user = userAccount ? userAccount.user : null;
                promoteModal.state = state;
            }

            if (state.post.download.resource) {
                if (!downloadModal) {
                    var price = Asset.parse(state.post.download.price);

                    var balance = price.asset.symbol === apiOptions.symbol.CREA ? Asset.parseString('0.000 CREA') : Asset.parseString('0.000 CBD');
                    var alreadyPayed = false;

                    if (session) {
                        balance = price.asset.symbol === apiOptions.symbol.CREA ? Asset.parseString(userAccount.user.balance) : Asset.parseString(userAccount.user.cbd_balance);
                        alreadyPayed = state.post.download.downloaders.includes(userAccount.user.name);
                    }

                    downloadModal = new Vue({
                        el: '#modal-download',
                        data: {
                            lang: lang,
                            session: session,
                            user: userAccount ? userAccount.user : false,
                            state: state,
                            modal: {
                                amount: price.toPlainString(null, false),
                                symbol: price.asset.symbol.toUpperCase(),
                                balance: balance.toFriendlyString(null, false),
                                alreadyPayed: alreadyPayed,
                                confirmed: false
                            }
                        },
                        mounted: function mounted() {
                            onVueReady();
                        },
                        methods: {
                            cancelPay: function cancelPay() {
                                this.modal.confirmed = false;
                            },
                            confirmDownload: function confirmDownload() {
                                console.log('Donwload content', this.modal.alreadyPayed, this.modal.confirmed);
                                if (this.modal.alreadyPayed || this.modal.confirmed) {
                                    makeDownload(null, session, this.user, this.state.post, function () {
                                        console.log('On download success');
                                        showModal('#modal-post');
                                    })
                                } else {
                                    this.modal.confirmed = true;
                                }
                            }
                        }
                    });
                } else {
                    downloadModal.session = session;
                    downloadModal.user = userAccount ? userAccount.user : null;
                    downloadModal.state = state;
                }
            } else {
                //This post not has a download, so downloadModal cannot be mounted
                onVueReady();
            }

            if (!reportModal) {
                reportModal = new Vue({
                    el: '#modal-report',
                    data: {
                        lang: lang,
                        session: session,
                        user: userAccount ? userAccount.user : null,
                        state: state
                    },
                    methods: {
                        vote: function vote(weight, post) {
                            console.log('Vote', weight, post);
                            post = post || this.state.post;
                            if (this.session) {
                                var that = this;
                                var username = this.session.account.username;
                                requireRoleKey(username, 'posting', function (postingKey) {
                                    globalLoading.show = true;
                                    crea.broadcast.vote(postingKey, username, post.author, post.permlink, weight, function (err, result) {
                                        globalLoading.show = false;
                                        catchError(err);
                                        showPostData(that.state.post, that.state, that.state.discuss, that.state.category, null, true);
                                        showModal('#modal-post');
                                    });
                                });
                            }
                        }
                    }
                })
            } else {
                reportModal.session = session;
                reportModal.user = userAccount ? userAccount.user : null;
                reportModal.state = state;
            }

            if (!reportCommentModal) {
                reportCommentModal = new Vue({
                    el: '#modal-report-comment',
                    data: {
                        lang: lang,
                        session: session,
                        user: userAccount ? userAccount.user : null,
                        state: state,
                        active_comment: null
                    },
                    methods: {
                        vote: function vote(post, weight) {
                            console.log('Vote', weight, post);
                            post = post || this.state.post;
                            if (this.session) {
                                var that = this;
                                var username = this.session.account.username;
                                requireRoleKey(username, 'posting', function (postingKey) {
                                    globalLoading.show = true;
                                    crea.broadcast.vote(postingKey, username, post.author, post.permlink, weight, function (err, result) {
                                        globalLoading.show = false;
                                        if (!catchError(err)) {
                                            showPostData(that.state.post, that.state, that.state.discuss, that.state.category, null, true);
                                            showModal('#modal-post');
                                        }

                                    });
                                });
                            }
                        }
                    }
                })
            } else {
                reportCommentModal.session = session;
                reportCommentModal.user = userAccount ? userAccount.user : null;
                reportCommentModal.state = state;
            }
        }
    }

    function fetchOtherProjects(author, permlink, state) {
        var loadOtherProjects = function loadOtherProjects(discussions) {
            console.log('Others', discussions)
            otherProjectsContainer = new Vue({
                el: '#more-projects-navigation',
                data: {
                    lang: lang,
                    state: state,
                    otherProjects: discussions,
                    navigation: true
                },
                updated: function() {
                    mr.sliders.documentReady($);
                    console.log('Slider updated');
                },
                methods: {
                    loadPost: function (post, event) {
                        cancelEventPropagation(event)
                        var state = postContainer.state;
                        var moreProjects = [];
                        this.otherProjects.forEach(function (d) {
                            moreProjects.push(d.link);
                            state.content[d.link] = d;
                        });

                        var discuss = state.discuss || '';
                        if (!state.discussion_idx[discuss]) {
                            state.discussion_idx[discuss] = {};
                        }

                        state.discussion_idx[discuss].more_projects = moreProjects;
                        showPostData(post, postContainer.state, discuss, 'more_projects', moreProjects.indexOf(post.link));
                    },
                    getFeaturedImage: function getFeaturedImage(post) {
                        var featuredImage = post.metadata.featuredImage;

                        if (featuredImage && featuredImage.hash) {
                            return {
                                url: 'https://ipfs.creary.net/ipfs/' + featuredImage.hash
                            };
                        } else if (featuredImage && featuredImage.url) {
                            return featuredImage;
                        }

                        return {};
                    }
                }
            });

            otherProjectsContainer.$forceUpdate();
            console.log('More projects updated');
        };

        var date = new Date().toISOString().replace('Z', '');
        crea.api.getDiscussionsByAuthorBeforeDateWith({
            start_permlink: '',
            limit: 100,
            before_date: date,
            author: author
        }, function (err, result) {
            if (!catchError(err)) {
                var discussions = [];
                console.log('Other projects', result);

                result.discussions.forEach(function (d) {
                    d = parsePost(d, d.reblogged_by);

                    if (d.permlink !== permlink && d.metadata.featuredImage) {
                        discussions.push(d);
                    }
                });

                if (discussions.length > CONSTANTS.POST.MAX_OTHER_PROJECTS) {
                    var selectedDiscuss = [];

                    for (var x = 0; x < CONSTANTS.POST.MAX_OTHER_PROJECTS; x++) {
                        var r = randomNumber(0, discussions.length - 1);
                        selectedDiscuss.push(discussions.splice(r, 1)[0]);
                    }

                    discussions = selectedDiscuss;
                }

                loadOtherProjects(discussions);
            }
        });
    }

    function updatePostData() {
        if (postContainer) {
            setUp(postContainer.state);
        }
    }

    function nextPost(event) {
        cancelEventPropagation(event);
        var state = postContainer.state;
        var postIndex = state.discussions.indexOf(state.author.name + '/' + state.post.permlink);

        if (postIndex >= 0 && postIndex <= state.discussions.length -2) {
            postIndex++;
            showPostIndex(postIndex, state);
        }
    }

    function lastPost(event) {
        cancelEventPropagation(event);
        var state = postContainer.state;
        var postIndex = state.discussions.indexOf(state.post.link);

        if (postIndex > 0 && postIndex <= state.discussions.length -1) {
            postIndex--;
            showPostIndex(postIndex, state);
        }
    }

    function showPostIndex(postIndex, state) {
        var postContent = state.discussions[postIndex];
        var post = clone(state.content[postContent]);
        showPostData(post, state, state.discuss, state.category, postIndex);
    }

    function showPostData(post, state, discuss, category, postIndex, postRefresh) {
        //state.post = null;
        console.log('post', post);
        if (!postRefresh && postContainer) {
            postContainer.$set(postContainer.state, 'post', null);
            postContainer.$forceUpdate();
        }

        state = clone(state);
        console.log(state);
        state.discuss = discuss || '';
        state.category = category;
        state.discussions = state.discussion_idx[discuss][category];
        if (!postIndex) {
            state.postIndex = state.discussion_idx[discuss][category].indexOf(post.author + '/' + post.permlink);
        } else {
            state.postIndex = postIndex;
        }

        var postUrl = "/" + post.metadata.tags[0] + '/@' + post.author + '/' + post.permlink;
        var postRoute = post.author + '/' + post.permlink;
        crea.api.getState(postUrl, function (err, postState) {
            if (!err) {
                refreshAccessToken(function (accessToken) {

                    var http = new HttpClient(apiOptions.apiUrl + String.format('/creary/%s/%s', post.author, post.permlink));

                    var onReblogs = function(reblogs) {
                        var aKeys = Object.keys(postState.accounts);

                        if (aKeys.length === 0) {
                            console.log('No post:', postState)
                        } else {
                            aKeys.forEach(function (k) {
                                state.accounts[k] = parseAccount(postState.accounts[k]);
                            });

                            state.post = parsePost(postState.content[postRoute], reblogs);
                            state.author = parseAccount(state.accounts[state.post.author]);

                            //Order comments by date, latest first
                            var cKeys = Object.keys(postState.content);
                            cKeys.sort(function (k1, k2) {
                                var d1 = new Date(postState.content[k1].created);
                                var d2 = new Date(postState.content[k2].created);
                                return d2.getTime() - d1.getTime();
                            });
                            cKeys.forEach(function (c) {
                                state.post[c] = parsePost(postState.content[c]);
                            });
                            state.post.comments = cKeys;

                            setUp(state);

                            setTimeout(function () {
                                fetchOtherProjects(post.author, post.permlink, state);
                            }, 300);
                        }
                    };

                    http.when('done', function (response) {
                        var data = jsonify(response).data;

                        onReblogs(data.reblogged_by);
                    });

                    http.when('fail', function (jqXHR, textStatus, errorThrown) {
                        console.error(textStatus, errorThrown);
                        onReblogs();
                    });

                    http.headers = {
                        Authorization: 'Bearer ' + accessToken
                    };

                    http.get({});
                });
            } else {
                console.error(err);
            }
        });
    }

    $(window).bind('popstate', function(event) {
        if (event.originalEvent.state && event.originalEvent.state.post) {
            setUp(event.originalEvent.state, true);
        }

    });

    creaEvents.on('navigation.post.data', showPostData);

    creaEvents.on('crea.session.login', function (s, a) {
        session = s;
        userAccount = a;

        updatePostData();
    });

    creaEvents.on('crea.session.update', function (s, a) {
        session = s;
        userAccount = a;
        updatePostData();
    });

    creaEvents.on('crea.session.logout', function () {
        session = false;
        userAccount = false;

        updatePostData();
    });

    creaEvents.on('crea.modal.ready', function () {
        console.log('MODALS Ready');
        setTimeout(function () {
            $('#modal-post').on('modalOpened.modals.mr', function () {
                console.log('Showing modal');
                $('body').css({ overflow: 'hidden'});
            }).on('modalClosed.modals.mr', function () {
                console.log('Closing modal');
                $('body').css({ overflow: ''});
            })
        }, 1000);
    });
})();