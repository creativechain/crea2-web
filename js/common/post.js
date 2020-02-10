"use strict";

/**
 * Created by ander on 18/10/18.
 */
(function () {
    let postContainer, otherProjects;
    let promoteModal, downloadModal, reportModal, reportCommentModal;
    let url = window.location.pathname;
    let session, userAccount;
    let vueInstances = 5;

    function onVueReady(force) {
        --vueInstances;

        if (vueInstances === 0 || force) {
            creaEvents.emit('crea.dom.ready');
        }
    }

    function setUp(state) {
        //updateUrl(state.current_route);

        if (!postContainer) {
            console.log(clone(state));
            postContainer = new Vue({
                el: '#post-view',
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
                    navigation: false
                },
                mounted: function mounted() {
                    onVueReady();
                },
                methods: {
                    showPost: showPost,
                    humanFileSize: humanFileSize,
                    getBuzzClass: function getBuzzClass(account) {
                        let buzzClass = {};
                        let levelName = account.buzz.level_name;

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
                        return toLocaleDate(date).fromNow();
                    },
                    formatDate: function formatDate(date) {
                        return moment(date + 'Z').format('LLLL');
                    },
                    hasPaid: function hasPaid(post) {
                        post = post || this.state.post;

                        let now = moment();
                        let payout = toLocaleDate(post.cashout_time);
                        return now.isAfter(payout);
                    },
                    getPayoutPostDate: function getPayoutPostDate(post) {
                        post = post || this.state.post;
                        let date = toLocaleDate(post.cashout_time);

                        if (this.hasPaid(post)) {
                            date = toLocaleDate(post.last_payout);
                        }

                        return date.fromNow();
                    },
                    hasPromotion: function hasPromotion() {
                        let post = this.state.post;
                        let amount = Asset.parseString(post.promoted);
                        return amount.amount > 0;
                    },
                    getPromotion: function getPromotion() {
                        let post = this.state.post;
                        let amount = Asset.parseString(post.promoted);
                        return '$ ' + amount.toPlainString();
                    },
                    getPayout: function getPayout(post, sym, dec) {

                        post = post || this.state.post;

                        if (!dec) {
                            dec = 2;
                        }

                        let amount = Asset.parseString(post.pending_payout_value);

                        if (this.hasPaid()) {
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
                        asset = asset ? asset.toLowerCase() : '';

                        post = post || this.state.post;
                        let PRICE_PER_CREA = Asset.parse({
                            amount: Asset.parseString(this.state.feed_price.base).toFloat() / Asset.parseString(this.state.feed_price.quote).toFloat(),
                            nai: 'cbd'
                        });
                        let CBD_PRINT_RATE = this.state.props.cbd_print_rate;
                        let CBD_PRINT_RATE_MAX = 10000;
                        let payout = Asset.parseString(post.pending_payout_value); //payout.amount = parseInt(payout.amount / 1000000000);

                        let PENDING_PAYOUT = payout;
                        let PERCENT_CREA_DOLLARS = post.percent_crea_dollars / 20000;
                        let PENDING_PAYOUT_CBD = Asset.parse({
                            amount: PENDING_PAYOUT.toFloat() * PERCENT_CREA_DOLLARS,
                            nai: 'cbd'
                        });
                        let PENDING_PAYOUT_CGY = Asset.parse({
                            amount: NaNOr(((PENDING_PAYOUT.toFloat() - PENDING_PAYOUT_CBD.toFloat()) / PRICE_PER_CREA.toFloat()), 0),
                            nai: 'cgy'
                        });
                        let PENDING_PAYOUT_PRINTED_CBD = Asset.parse({
                            amount: NaNOr((PENDING_PAYOUT_CBD.toFloat() * (CBD_PRINT_RATE / CBD_PRINT_RATE_MAX)), 0),
                            nai: 'cbd'
                        });
                        let PENDING_PAYOUT_PRINTED_CREA = Asset.parse({
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
                        let featuredImage = post.metadata.featuredImage;

                        if (featuredImage && featuredImage.hash) {
                            return {
                                url: 'https://ipfs3.creary.net/ipfs/' + featuredImage.hash
                            };
                        } else if (featuredImage && featuredImage.url) {
                            return featuredImage;
                        }

                        return {};
                    },
                    getLinkedTags: function getLinkedTags(asString) {
                        //<a v-bind:href="'/popular/' + x">{{ x }}</a>
                        let tags = this.state.post.metadata.tags;
                        let linkedTags = [];
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
                        let route = this.state.post.author + '/' + this.state.post.permlink;
                        goTo('/publish?edit=' + encodeURIComponent(route));
                    },
                    addComment: function (parentPost, commentReply, editingResponse) {
                        let that = this;

                        let post = editingResponse;
                        let comment = commentReply ? this.response_comment : this.comment;
                        makeComment(comment, post, parentPost, function (err, result) {
                            globalLoading.show = false;
                            if (!catchError(err)) {

                                if (commentReply) {
                                    that.cleanMakeResponse();
                                } else {
                                    that.cleanMakeComment();
                                }
                                fetchContent();
                            }
                        })
                    },
                    linkfy: function (comment) {
                        //return comment;
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
                        let that = this;
                        deleteComment(comment, this.session, function (err, result) {
                            if (!catchError(err)) {
                                globalLoading.show = false;
                                fetchContent();
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
                            fetchContent();
                        });
                    }),
                    vote: function vote(weight, post) {
                        post = post || this.state.post;
                        if (this.session) {
                            let that = this;
                            let username = this.session.account.username;
                            requireRoleKey(username, 'posting', function (postingKey) {
                                globalLoading.show = true;
                                crea.broadcast.vote(postingKey, username, post.author, post.permlink, weight, function (err, result) {
                                    globalLoading.show = false;
                                    catchError(err);
                                    fetchContent();
                                });
                            });
                        }
                    },
                    onVote: function onVote(err) {
                        catchError(err);
                        updateUserSession();
                    },
                    onFollow: function onFollow(err, result) {
                        catchError(err);
                        updateUserSession();
                    }
                }
            });
        } else {
            postContainer.state = state;
            postContainer.session = session;
            postContainer.user = userAccount ? userAccount.user : null;
        }

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
                        },
                        makePromotion: function makePromotion(event) {
                            cancelEventPropagation(event);
                            let from = this.session.account.username;
                            let to = 'null';
                            let memo = "@" + this.state.post.author + '/' + this.state.post.permlink;
                            let amount = parseFloat(this.amount) + 0.0001;
                            console.log(amount);
                            amount = Asset.parse({
                                amount: amount,
                                nai: apiOptions.nai.CBD
                            }).toFriendlyString(null, false);
                            console.log(amount);
                            let that = this;
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
                    let price = Asset.parse(state.post.download.price);

                    let balance = price.asset.symbol === apiOptions.symbol.CREA ? Asset.parseString('0.000 CREA') : Asset.parseString('0.000 CBD');
                    let alreadyPayed = false;

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
                                if (this.modal.alreadyPayed || this.modal.confirmed) {
                                    makeDownload(null, session, this.user, this.state.post, fetchContent);
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
                    mounted: function mounted() {
                        onVueReady();
                    },
                    methods: {
                        vote: function vote(weight, post) {
                            console.log('Vote', weight, post);
                            post = post || this.state.post;
                            if (this.session) {
                                let that = this;
                                let username = this.session.account.username;
                                requireRoleKey(username, 'posting', function (postingKey) {
                                    globalLoading.show = true;
                                    crea.broadcast.vote(postingKey, username, post.author, post.permlink, weight, function (err, result) {
                                        globalLoading.show = false;
                                        catchError(err);
                                        fetchContent();
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
                    mounted: function mounted() {
                        onVueReady();
                    },
                    methods: {
                        vote: function vote(weight, post) {
                            console.log('Report comment', weight, post);
                            post = post || this.state.post;
                            if (this.session) {
                                let that = this;
                                let username = this.session.account.username;
                                requireRoleKey(username, 'posting', function (postingKey) {
                                    globalLoading.show = true;
                                    crea.broadcast.vote(postingKey, username, post.author, post.permlink, weight, function (err, result) {
                                        globalLoading.show = false;
                                        catchError(err);
                                        fetchContent();

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
        } else {
            //No session, so downloadModal and modalPromoted can not be mounted
            onVueReady(true);
        }

    }


    /**
     *
     * @returns {string}
     */


    function getPostKey(postUrl) {
        if (!postUrl) {
            postUrl = url;
        }

        let route = postUrl.replace('@', '').split('/');
        route.splice(0, 2);
        return route.join('/');
    }

    function fetchOtherProjects(author, permlink, state) {
        let loadOtherProjects = function loadOtherProjects(discussions) {
            otherProjects = new Vue({
                el: '#more-projects',
                data: {
                    lang: lang,
                    state: state,
                    otherProjects: discussions,
                    navigation: false
                },
                updated: function () {
                    mr.sliders.documentReady($);

                    let fl = $('#more-projects .flickity-slider');
                    let count = fl.length;
                    console.log('Slider post updated', count);
                    setTimeout(function () {
                        fl.each(function (index) {
                            let sl = $(this);
                            if (sl.children().length === 0) {
                                sl.parent().remove()
                            }
                        });
                    }, 500);
                },
                methods: {
                    loadPost: function (post, event) {
                        cancelEventPropagation(event);
                        console.log('loading')
                        let state = postContainer.state;
                        let moreProjects = [];
                        this.otherProjects.forEach(function (d) {
                            moreProjects.push(d.link);
                            state.content[d.link] = d;
                        });

                        let discuss = state.discuss || '';
                        if (!state.discussion_idx[discuss]) {
                            state.discussion_idx[discuss] = {};
                        }

                        state.discussion_idx[discuss].more_projects = moreProjects;
                        creaEvents.emit('navigation.post.data', post, postContainer.state, discuss, 'more_projects', moreProjects.indexOf(post.link));
                        showModal('#modal-post');
                    },
                    getFeaturedImage: function getFeaturedImage(post) {
                        let featuredImage = post.metadata.featuredImage;

                        if (featuredImage && featuredImage.hash) {
                            return {
                                url: 'https://ipfs3.creary.net/ipfs/' + featuredImage.hash
                            };
                        } else if (featuredImage && featuredImage.url) {
                            return featuredImage;
                        }

                        return {};
                    }
                }
            });

            otherProjects.$forceUpdate();
        };

        let date = new Date().toISOString().replace('Z', '');
        crea.api.getDiscussionsByAuthorBeforeDateWith({
            start_permlink: '',
            limit: 100,
            before_date: date,
            author: author
        }, function (err, result) {
            if (!catchError(err)) {
                let discussions = [];
                result.discussions.forEach(function (d) {
                    d.metadata = jsonify(d.json_metadata);

                    if (d.permlink !== permlink && d.metadata.featuredImage) {
                        discussions.push(d);
                    }
                });

                if (discussions.length > 12) {
                    let selectedDiscuss = [];

                    for (let x = 0; x < 12; x++) {
                        let r = randomNumber(0, discussions.length - 1);
                        selectedDiscuss.push(discussions.splice(r, 1)[0]);
                    }

                    discussions = selectedDiscuss;
                }

                loadOtherProjects(discussions);
            }
        });
    }

    function fetchContent() {
        if (url) {
            //Delete first char "/"
            let parts = url.slice(1, url.length).split('/').length;
            let fetchContentState = function fetchContentState(finalUrl) {


                crea.api.getState(finalUrl, function (err, result) {
                    if (!catchError(err)) {

                        refreshAccessToken(function (accessToken) {
                            let finalParts = finalUrl.slice(1, finalUrl.length).split('/');
                            let author = finalParts[1].slice(1, finalParts[1].length);
                            let permlink = finalParts[2];

                            let http = new HttpClient(apiOptions.apiUrl + String.format('/creary/%s/%s', author, permlink));

                            let onReblogs = function(reblogs) {
                                let aKeys = Object.keys(result.accounts);

                                if (aKeys.length === 0) {
                                    goTo('/404');
                                } else {
                                    aKeys.forEach(function (k) {
                                        result.accounts[k] = parseAccount(result.accounts[k]);
                                    });
                                    result.postKey = getPostKey(finalUrl);
                                    result.post = parsePost(result.content[result.postKey], reblogs);
                                    result.author = parseAccount(result.accounts[result.post.author]); //Order comments by date, latest first

                                    //console.log(clone(result.author));
                                    let cKeys = Object.keys(result.content);
                                    cKeys.sort(function (k1, k2) {
                                        let d1 = toLocaleDate(result.content[k1].created);
                                        let d2 = toLocaleDate(result.content[k2].created);
                                        return d2.valueOf() - d1.valueOf();
                                    });
                                    cKeys.forEach(function (c) {
                                        result.post[c] = parsePost(result.content[c]);
                                    });
                                    result.post.comments = cKeys;
                                    setUp(result);

                                    fetchOtherProjects(result.post.author, result.post.permlink, result);
                                }
                            };

                            http.when('done', function (response) {
                                let data = jsonify(response).data;

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
                    }
                });
            };

            if (parts === 2) {
                let author = getPathPart().replace('@', '');
                let permlink = getPathPart(null,1);

                crea.api.getContent(author, permlink, function (err, result) {
                    if (!catchError(err)) {
                        let post = parsePost(result);
                        fetchContentState('/' + post.metadata.tags[0] + '/@' + author + '/' + permlink);
                    }
                });
            } else {
                fetchContentState(url);
            }
        }
    }

    creaEvents.on('crea.session.login', function (s, a) {
        session = s;
        userAccount = a;

        fetchContent();
    });

    creaEvents.on('crea.session.update', function (s, a) {
        session = s;
        userAccount = a;
        fetchContent();
    });

    creaEvents.on('crea.session.logout', function () {
        session = false;
        userAccount = false;

        fetchContent();
    });

})();