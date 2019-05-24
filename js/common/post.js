"use strict";

/**
 * Created by ander on 18/10/18.
 */
(function () {
    var postContainer;
    var promoteModal;
    var downloadModal;
    var url = window.location.pathname;
    var session, userAccount;
    var vueInstances = 3;

    function onVueReady() {
        --vueInstances;

        if (vueInstances === 0) {
            creaEvents.emit('crea.dom.ready');
        }
    }

    function setUp(state) {
        //updateUrl(state.current_route);

        state.post.reported = false;
        if (session) {
            //Set reported by user
            var username = session.account.username;
            for (var x = 0; x < state.post.down_votes.length; x++) {
                var v = state.post.down_votes[x];
                if (v.voter === username) {

                    state.post.reported = true;
                    break;
                }
            }
        }

        if (!postContainer) {
            postContainer = new Vue({
                el: '#post-view',
                data: {
                    lang: lang,
                    CONSTANTS: CONSTANTS,
                    session: session,
                    user: userAccount ? userAccount.user : false,
                    state: state,
                    comment: ''
                },
                mounted: function mounted() {
                    onVueReady();
                },
                methods: {
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
                        return moment(toLocaleDate(date)).format('LLLL');
                    },
                    hasPaid: function hasPaid() {
                        var now = new Date();
                        var payout = toLocaleDate(this.state.post.cashout_time);
                        return now.getTime() > payout.getTime();
                    },
                    getPayoutPostDate: function getPayoutPostDate() {
                        var post = this.state.post;
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
                    getPayout: function getPayout(post, sym) {

                        if (!post) {
                            post = this.state.post;
                        }

                        var amount = Asset.parseString(post.pending_payout_value);

                        if (this.hasPaid()) {
                            amount = Asset.parseString(post.total_payout_value);
                            amount = amount.add(Asset.parseString(post.curator_payout_value));
                        } //amount.amount = parseInt(amount.amount / 1000000000);


                        return (sym ? '$ ' : '') + amount.toPlainString(2);
                    },
                    getFriendlyPayout: function getFriendlyPayout() {
                        return this.getPayout(null, false) + ' CBD';
                    },
                    getPendingPayouts: function getPendingPayouts(asset) {
                        asset = asset ? asset.toLowerCase() : '';

                        var post = this.state.post;
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
                    editPost: function editPost() {
                        var route = this.state.post.author + '/' + this.state.post.permlink;
                        goTo('/publish?edit=' + encodeURIComponent(route));
                    },
                    makeComment: makeComment,
                    makeDownload: makeDownload,
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
                    vote: function vote(weight) {
                        //TODO: SHOW ALERT CONFIRMATION
                        if (this.session) {
                            var that = this;
                            var username = this.session.account.username;
                            requireRoleKey(username, 'posting', function (postingKey) {
                                globalLoading.show = true;
                                crea.broadcast.vote(postingKey, username, that.state.post.author, that.state.post.permlink, weight, function (err, result) {
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
                            $('#modal-promote').removeClass('modal-active');
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
                                if (this.modal.alreadyPayed || this.modal.confirmed) {
                                    makeDownload();
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
        } else {
            //No session, so downloadModal and modalPromoted can not be mounted
            onVueReady();
            onVueReady();
        }

    }

    function makeComment() {
        var session = Session.getAlive();
        var comment = postContainer.comment;

        if (session && comment.length > 0) {
            requireRoleKey(session.account.username, 'posting', function (postingKey) {
                globalLoading.show = true;
                var parentAuthor = postContainer.state.post.author;
                var parentPermlink = postContainer.state.post.permlink;
                var permlink = crea.formatter.commentPermlink(parentAuthor, parentPermlink);

                if (permlink.length > CONSTANTS.TEXT_MAX_SIZE.PERMLINK) {
                    permlink = permlink.substring(0, CONSTANTS.TEXT_MAX_SIZE.PERMLINK);
                }

                console.log(permlink.length, parentPermlink.length);
                var metadata = {
                    tags: [postContainer.state.post.metadata.tags[0]]
                };
                crea.broadcast.comment(postingKey, parentAuthor, parentPermlink, session.account.username, permlink, '', comment, '', jsonstring(metadata), function (err, result) {
                    globalLoading.show = false;

                    if (!catchError(err)) {
                        postContainer.comment = '';
                        fetchContent();
                    }
                });
            });
        }
    }

    function makeDownload(event) {
        cancelEventPropagation(event);
        var session = postContainer.session;
        var user = postContainer.user;
        var post = postContainer.state.post;

        if (session) {
            requireRoleKey(session.account.username, 'active', function (activeKey) {
                globalLoading.show = true;

                var downloadResource = function downloadResource() {
                    setTimeout(function () {
                        var authorBuff = Buffer.from(post.author);
                        var permlinkBuff = Buffer.from(post.permlink);
                        var buff = Buffer.concat([authorBuff, permlinkBuff]);
                        var signature = crea.utils.Signature.signBuffer(buff, activeKey);
                        var s64 = signature.toBuffer().toString('base64');
                        crea.api.getDownload(session.account.username, post.author, post.permlink, s64, function (err, result) {
                            globalLoading.show = false;

                            if (!catchError(err)) {
                                var re = /Qm[a-zA-Z0-9]+/;
                                var hash = re.exec(result.resource)[0];
                                console.log(hash); //For .rar, .zip or unrecognized MIME type

                                if (!post.download.type) {
                                    post.download.type = 'application/octet-stream';
                                }

                                var _url = apiOptions.ipfsd + '/' + post.download.type + '/' + hash + '/' + post.download.name;

                                _url += '?stream=false';
                                downloadFile(_url, post.download.name);
                                //Close modal download
                                $('#modal-download').removeClass('modal-active');
                            }
                        });
                    }, 3000);
                };

                var payDownload = function payDownload() {
                    crea.broadcast.commentDownload(activeKey, session.account.username, post.author, post.permlink, function (err, result) {
                        if (!catchError(err)) {
                            downloadResource();
                            fetchContent();
                        } else {
                            globalLoading.show = false;
                        }
                    });
                };

                if (post.download.downloaders.includes(user.name)) {
                    //Download paid
                    downloadResource();
                } else {
                    payDownload();
                }
            });
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

        var route = postUrl.replace('@', '').split('/');
        route.splice(0, 2);
        return route.join('/');
    }

    function fetchOtherProjects(author, permlink) {
        var loadOtherProjects = function loadOtherProjects(discussions) {
            var otherProjects = new Vue({
                el: '#more-projects',
                data: {
                    otherProjects: discussions
                },
                mounted: function mounted() {
                    mr.sliders.documentReady($);
                },
                methods: {
                    showPost: showPost,
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
            otherProjects.$forceUpdate();
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
                result.discussions.forEach(function (d) {
                    d.metadata = jsonify(d.json_metadata);

                    if (d.permlink !== permlink && d.metadata.featuredImage) {
                        discussions.push(d);
                    }
                });

                if (discussions.length > 12) {
                    var selectedDiscuss = [];

                    for (var x = 0; x < 12; x++) {
                        var r = randomNumber(0, discussions.length - 1);
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
            var parts = url.slice(1, url.length).split('/').length;
            var fetchContentState = function fetchContentState(finalUrl) {
                crea.api.getState(finalUrl, function (err, result) {
                    if (!catchError(err)) {
                        //Resolve metadata
                        var aKeys = Object.keys(result.accounts);

                        if (aKeys.length === 0) {
                            goTo('/404');
                        } else {
                            aKeys.forEach(function (k) {
                                result.accounts[k] = parseAccount(result.accounts[k]);
                            });
                            result.postKey = getPostKey(finalUrl);
                            result.post = parsePost(result.content[result.postKey]);
                            result.author = result.accounts[result.post.author]; //Order comments by date, latest first

                            var cKeys = Object.keys(result.content);
                            cKeys.sort(function (k1, k2) {
                                var d1 = new Date(result.content[k1].created);
                                var d2 = new Date(result.content[k2].created);
                                return d2.getTime() - d1.getTime();
                            });
                            cKeys.forEach(function (c) {
                                result[c] = parsePost(result.content[c]);
                            });
                            result.comments = cKeys;
                            setUp(result);
                        }
                    }
                });
            };

            if (parts === 2) {
                var author = getPathPart().replace('@', '');
                var permlink = getPathPart(1);
                crea.api.getContent(author, permlink, function (err, result) {
                    if (!catchError(err)) {
                        var post = parsePost(result);
                        fetchContentState('/' + post.metadata.tags[0] + '/@' + author + '/' + permlink);
                    }
                });
            } else {
                fetchContentState(url);
            }
        }
    }

    creaEvents.on('crea.dom.ready', function () {
        var author = getPathPart();
        var permlink;

        if (!author.startsWith('@')) {
            author = getPathPart(1).replace('@', '');
            permlink = getPathPart(2);
        } else {
            author = getPathPart().replace('@', '');
            permlink = getPathPart(1);
        }

        fetchOtherProjects(author, permlink);
    });

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