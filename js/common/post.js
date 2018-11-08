/**
 * Created by ander on 18/10/18.
 */

let postContainer;

(function () {

    let query = window.location.search;
    let url = getParameterByName('url', query);

    console.log('URL:', url);
    let session, userAccount;

    function setUp(state) {
        console.log('state', !postContainer);
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
                    makeComment: makeComment,
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
    }

    function makeComment() {
        let session = Session.getAlive();
        let comment = postContainer.comment;
        if (comment.length > 0) {
            globalLoading.show = true;
            let parentAuthor = postContainer.state.post.author;
            let parentPermlink = postContainer.state.post.permlink;
            let permlink = crea.formatter.commentPermlink(parentAuthor, parentPermlink);
            let metadata = {
                tags: [postContainer.state.post.metadata.tags[0]]
            };
            crea.broadcast.comment(session.account.keys.posting.prv, parentAuthor, parentPermlink, session.account.username,
                permlink, '', comment, jsonstring(metadata), function (err, result) {
                    if (err) {
                        console.error(err);
                    } else {
                        postContainer.comment = '';
                        fetchContent();
                    }

                    globalLoading.show = false;
                })
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