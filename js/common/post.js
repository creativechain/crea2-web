/**
 * Created by ander on 18/10/18.
 */

let postContainer;
let promoteModal;

(function () {

    let url = window.location.pathname;

    let session, userAccount;

    function setUp(state) {

        console.log('state', jsonify(jsonstring(state)));
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
                        amount = Asset.parse({amount: amount, nai: apiOptions.nai.CBD}).toFriendlyString();

                        globalLoading.show = true;
                        let that = this;

                        requireRoleKey(from, 'active', function (activeKey) {
                            crea.broadcast.transfer(activeKey, from, to, amount, memo, function (err, result) {
                                globalLoading.show = false;
                                if (err) {
                                    console.error(err);
                                } else {
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

        if (!postContainer) {
            postContainer = new Vue({
                el: '#post-view',
                data: {
                    lang: lang,
                    session: session,
                    user: userAccount ? userAccount.user : null,
                    state: state,
                    comment: '',
                    otherProjects: []
                },
                methods: {
                    showPost: showPost,
                    humanFileSize: humanFileSize,
                    assetToString: function (asset) {
                        return Asset.parse(asset).toFriendlyString();
                    },
                    getDefaultAvatar: R.getDefaultAvatar,
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
                    getPayout: function () {
                        let amount = Asset.parseString(this.state.post.pending_payout_value);
                        if (this.hasPaid()) {
                            amount = Asset.parseString(this.state.post.total_payout_value);
                            amount = amount.add(Asset.parseString(this.state.post.curator_payout_value));
                        }

                        return amount.toPlainString(2) + '$'
                    },
                    getFeaturedImage: function (post) {
                        let featuredImage = post.metadata.featuredImage;
                        if (featuredImage) {
                            if (featuredImage.url) {
                                return featuredImage;
                            } else {
                                return {
                                    url: featuredImage
                                }
                            }
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

                        ignoreUser(this.post.author, true, function (err, result) {
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
                                    if (err) {
                                        console.error(err);
                                    }

                                    fetchContent();

                                })
                            });

                        }

                    },
                    onVote: function () {
                        fetchContent();
                    },
                    onFollow: function (err, result) {
                        fetchContent();
                    }
                }
            });
        } else {
            postContainer.state = state;
            postContainer.session = session;
            postContainer.user = userAccount ? userAccount.user : null;
        }

        creaEvents.emit('crea.dom.ready');
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
                let metadata = {
                    tags: [postContainer.state.post.metadata.tags[0]]
                };

                crea.broadcast.comment(postingKey, parentAuthor, parentPermlink, session.account.username,
                    permlink, '', comment, '', jsonstring(metadata), function (err, result) {
                        if (err) {
                            console.error(err);
                        } else {
                            postContainer.comment = '';
                            fetchContent();
                        }

                        globalLoading.show = false;
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

                            if (err) {
                                console.error(err);
                            } else {
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
                            if (err) {
                                console.error(err);
                                globalLoading.show = false;
                            } else {
                                downloadResource();
                                fetchContent();
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
            if (err) {
                console.error(err);
            } else {

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
                if (err) {
                    console.error(err);
                } else {
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