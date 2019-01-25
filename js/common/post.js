/**
 * Created by ander on 18/10/18.
 */


let postContainer;
(function () {

    let promoteModal;

    let url = window.location.pathname;

    let session, userAccount;

    let vueInstances = 2;

    function onVueReady() {
        --vueInstances;

        if (vueInstances <= 0) {
            creaEvents.emit('crea.dom.ready');
        }
    }

    function setUp(state) {

        if (!postContainer) {
            postContainer = new Vue({
                el: '#post-view',
                data: {
                    lang: getLanguage(),
                    CONSTANTS: CONSTANTS,
                    session: session,
                    user: userAccount ? userAccount.user : null,
                    state: state,
                    comment: '',
                    otherProjects: []
                },
                mounted: function () {
                    onVueReady();
                },
                methods: {
                    showPost: showPost,
                    humanFileSize: humanFileSize,
                    cbdToDollar: function (cbd) {
                        return '$ ' + Asset.parseString(cbd).toPlainString();
                    },
                    assetToString: function (asset) {
                        return Asset.parse(asset).toFriendlyString();
                    },
                    getDefaultAvatar: R.getAvatar,
                    getLicense: function () {
                        return License.fromFlag(this.state.post.metadata.license);
                    },
                    dateFromNow: function(date) {
                        return moment(toLocaleDate(date)).fromNow();
                    },
                    formatDate: function (date) {
                        return moment(toLocaleDate(date)).format('LLLL');
                    },
                    hasPaid: function () {
                        let now = new Date();
                        let payout = toLocaleDate(this.state.post.cashout_time);
                        return now.getTime() > payout.getTime();
                    },
                    getPayoutPostDate: function () {
                        let post = this.state.post;
                        let date = toLocaleDate(post.cashout_time);
                        if (this.hasPaid(post)) {
                            date = toLocaleDate(post.last_payout);
                        }

                        return moment(date).fromNow();
                    },
                    hasPromotion: function () {
                        let post = this.state.post;
                        let amount = Asset.parseString(post.promoted);
                        return amount.amount > 0;
                    },
                    getPromotion: function () {
                        let post = this.state.post;
                        let amount = Asset.parseString(post.promoted);

                        return '$ ' + amount.toPlainString();
                    },
                    getPayout: function () {
                        let amount = Asset.parseString(this.state.post.pending_payout_value);
                        if (this.hasPaid()) {
                            amount = Asset.parseString(this.state.post.total_payout_value);
                            amount = amount.add(Asset.parseString(this.state.post.curator_payout_value));
                        }

                        return '$ ' + amount.toPlainString(2);
                    },
                    getPendingPayouts: function () {
                        let post = this.state.post;
                        const PRICE_PER_CREA = Asset.parse({ amount: Asset.parseString(this.state.feed_price.base).toFloat() / Asset.parseString(this.state.feed_price.quote).toFloat(), nai: 'cbd'});
                        const CBD_PRINT_RATE = this.state.props.cbd_print_rate;
                        const CBD_PRINT_RATE_MAX = 10000;
                        const PENDING_PAYOUT = Asset.parseString(post.pending_payout_value);
                        const PERCENT_CREA_DOLLARS = post.percent_crea_dollars / 20000;
                        const PENDING_PAYOUT_CBD = Asset.parse({ amount: PENDING_PAYOUT.toFloat() * PERCENT_CREA_DOLLARS, nai: 'cbd'});
                        const PENDING_PAYOUT_CGY = Asset.parse({ amount: (PENDING_PAYOUT.toFloat() - PENDING_PAYOUT_CBD.toFloat()) / PRICE_PER_CREA.toFloat(), nai: 'cgy'});
                        const PENDING_PAYOUT_PRINTED_CBD = Asset.parse({ amount: PENDING_PAYOUT_CBD.toFloat() * (CBD_PRINT_RATE / CBD_PRINT_RATE_MAX), nai: 'cbd'});
                        const PENDING_PAYOUT_PRINTED_CREA = Asset.parse({ amount: (PENDING_PAYOUT_CBD.toFloat() - PENDING_PAYOUT_PRINTED_CBD.toFloat()) / PRICE_PER_CREA.toFloat(), nai: 'crea'});

                        return '(' + PENDING_PAYOUT_PRINTED_CBD.toFriendlyString(null, false) +
                            ', ' + PENDING_PAYOUT_PRINTED_CREA.toFriendlyString(null, false) +
                            ', ' + PENDING_PAYOUT_CGY.toFriendlyString(null, false) + ')';

                    },
                    getFeaturedImage: function (post) {
                        let featuredImage = post.metadata.featuredImage;
                        if (featuredImage && featuredImage.hash) {
                            return {
                                url: 'https://ipfs.creary.net/ipfs/' + featuredImage.hash
                            }
                        } else if (featuredImage && featuredImage.url) {
                            return featuredImage;
                        }

                        return {};
                    },
                    getLinkedTags: function(asString) {
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
                    isReportedByUser: function () {
                        let reported = false;

                        if (this.session) {
                            let username = this.session.account.username;

                            this.state.post.down_votes.forEach(function (v) {
                                if (v.voter === username) {
                                    reported = true;
                                    return;
                                }
                            });
                        }


                        return reported;
                    },
                    isSameUser: function () {
                        if (this.session) {
                            return this.state.post.author === this.session.account.username;
                        }

                        return false;
                    },
                    editPost: function () {
                        let route = this.state.post.author + '/' + this.state.post.permlink;
                        goTo('/publish?edit=' + encodeURIComponent(route));
                    },
                    makeComment: makeComment,
                    makeDownload: makeDownload,
                    ignoreUser: function () {

                        ignoreUser(this.state.post.author, true, function (err, result) {
                            fetchContent();
                        });
                    },
                    vote: function (weight) {
                        //TODO: SHOW ALERT CONFIRMATION
                        if (this.session) {
                            let that = this;
                            let username = this.session.account.username;

                            requireRoleKey(username, 'posting', function (postingKey) {
                                globalLoading.show = true;
                                crea.broadcast.vote(postingKey, username, that.state.post.author, that.state.post.permlink, weight, function (err, result) {
                                    globalLoading.show = false;
                                    catchError(err);

                                    fetchContent();

                                })
                            });

                        }

                    },
                    onVote: function () {
                        updateUserSession();
                    },
                    onFollow: function (err, result) {
                        updateUserSession();
                    }
                }
            });
        } else {
            postContainer.state = state;
            postContainer.session = session;
            postContainer.user = userAccount ? userAccount.user : null;
        }

        if (!promoteModal) {
            promoteModal = new Vue({
                el: "#modal-promote",
                data: {
                    lang: getLanguage(),
                    session: session,
                    user: userAccount ? userAccount.user : null,
                    state: state,
                    amount: 0
                },
                mounted: function () {
                    onVueReady();
                },
                methods: {
                    hideModalPromote: function (event) {
                        cancelEventPropagation(event);

                        $('#modal-promote').removeClass('modal-active');
                    },
                    makePromotion: function (event) {
                        cancelEventPropagation(event);

                        let from = this.session.account.username;
                        let to = 'null';
                        let memo = "@" + this.state.post.author + '/' + this.state.post.permlink;

                        let amount = parseFloat(this.amount) + 0.0001;
                        console.log(amount);
                        amount = Asset.parse({amount: amount, nai: apiOptions.nai.CBD}).toFriendlyString(null, false);
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
            })
        } else {
            promoteModal.session = session;
            promoteModal.user = userAccount ? userAccount.user : null;
            promoteModal.state = state;
        }
    }

    function makeComment() {
        let session = Session.getAlive();
        let comment = postContainer.comment;
        if (session && comment.length > 0) {

            requireRoleKey(session.account.username, 'posting', function (postingKey) {
                globalLoading.show = true;
                let parentAuthor = postContainer.state.post.author;
                let parentPermlink = postContainer.state.post.permlink;
                let permlink = crea.formatter.commentPermlink(parentAuthor, parentPermlink);

                if (permlink.length > CONSTANTS.TEXT_MAX_SIZE.PERMLINK) {
                    permlink = permlink.substring(0, CONSTANTS.TEXT_MAX_SIZE.PERMLINK);
                }

                console.log(permlink.length, parentPermlink.length);
                let metadata = {
                    tags: [postContainer.state.post.metadata.tags[0]]
                };

                crea.broadcast.comment(postingKey, parentAuthor, parentPermlink, session.account.username,
                    permlink, '', comment, '', jsonstring(metadata), function (err, result) {
                        globalLoading.show = false;
                        if (!catchError(err)) {
                            postContainer.comment = '';
                            fetchContent();
                        }
                    })
            });

        }

    }

    function makeDownload(event) {
        cancelEventPropagation(event);

        let session = postContainer.session;
        let user = postContainer.user;
        let post = postContainer.state.post;
        if (session) {

            requireRoleKey(session.account.username, 'posting', function (postingKey) {
                globalLoading.show = true;
                let downloadResource = function () {
                    setTimeout(function () {
                        let authorBuff = Buffer.from(post.author);
                        let permlinkBuff = Buffer.from(post.permlink);
                        let buff = Buffer.concat([authorBuff, permlinkBuff]);
                        let signature = crea.utils.Signature.signBuffer(buff, postingKey);
                        let s64 = signature.toBuffer().toString('base64');

                        crea.api.getDownload(session.account.username, post.author, post.permlink, s64, function (err, result) {
                            globalLoading.show = false;

                            if (!catchError(err)) {
                                let re = /Qm[a-zA-Z0-9]+/;
                                let hash = re.exec(result.resource)[0];
                                console.log(hash);

                                let url = apiOptions.ipfsd + post.download.type + '/' + hash + '/' + post.download.name;
                                url += '?stream=false';
                                downloadFile(url, post.download.name);
                            }
                        })
                    }, 3000);
                };

                let payDownload = function () {
                    crea.broadcast.commentDownload(postingKey, session.account.username,
                        post.author, post.permlink, function (err, result) {

                            if (!catchError(err)) {
                                downloadResource();
                                fetchContent();
                            } else {
                                globalLoading.show = false;
                            }
                        })
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
    function getPostKey() {
        if (url) {
            let route = url.replace('@', '').split('/');
            route.splice(0, 2);
            return route.join('/');
        }

    }

    function fetchOtherProjects(author, permlink) {
        let date = new Date().toISOString().replace('Z', '');
        crea.api.getDiscussionsByAuthorBeforeDateWith({start_permlink: '', limit: 100, before_date: date, author}, function (err, result) {

            if (!catchError(err)) {
                let discussions = [];
                result.discussions.forEach(function (d) {
                    d.metadata = jsonify(d.json_metadata);
                    if (d.permlink !== permlink && d.metadata.featuredImage) {
                        discussions.push(d);
                    }
                });

                if (discussions.length > 3) {
                    let selectedDiscuss = [];
                    for (let x = 0; x < 3; x++) {
                        let r = randomNumber(0, discussions.length-1);
                        selectedDiscuss.push(discussions.splice(r, 1)[0])
                    }

                    postContainer.otherProjects = selectedDiscuss;
                } else if (discussions.length > 0) {
                    postContainer.otherProjects = discussions;
                }
            }
        });
    }

    function fetchContent() {

        if (url) {
            crea.api.getState(url, function (err, result) {
                if (!catchError(err)) {
                    //Resolve metadata
                    let aKeys = Object.keys(result.accounts);

                    if (aKeys.length === 0) {
                        goTo('/404');
                    } else {
                        aKeys.forEach(function (k) {
                            result.accounts[k].metadata = jsonify(result.accounts[k].json_metadata);
                            result.accounts[k].metadata.avatar = result.accounts[k].metadata.avatar || {};
                        });

                        result.postKey = getPostKey();
                        result.post = result.content[result.postKey];
                        result.post.metadata = jsonify(result.post.json_metadata);
                        result.post.body = jsonify(result.post.body);
                        result.author = result.accounts[result.post.author];
                        fetchOtherProjects(result.author.name, result.post.permlink);

                        //separate votes
                        result.post.down_votes = [];
                        result.post.up_votes = [];
                        result.post.active_votes.forEach(function (v) {
                            if (v.percent <= -10000) {
                                result.post.down_votes.push(v);
                            } else {
                                result.post.up_votes.push(v);
                            }
                        });

                        //Order comments by date, latest first
                        let cKeys = Object.keys(result.content);
                        cKeys.sort(function (k1, k2) {
                            let d1 = new Date(result.content[k1].created);
                            let d2 = new Date(result.content[k2].created);

                            return d2.getTime() - d1.getTime();
                        });

                        cKeys.forEach(function (c) {
                            let comment = result.content[c];
                            comment.down_votes = [];
                            comment.up_votes = [];
                            comment.active_votes.forEach(function (v) {
                                if (v.percent <= -10000) {
                                    comment.down_votes.push(v);
                                } else {
                                    comment.up_votes.push(v);
                                }
                            });

                            result[c] = comment;
                        });

                        result.comments = cKeys;
                        console.log(result.comments);
                        setUp(result);
                    }
                }
            })
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
    })
})();