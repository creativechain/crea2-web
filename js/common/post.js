/**
 * Created by ander on 18/10/18.
 */

let postContainer;

(function () {

    let query = window.location.search;
    let url = getParameterByName('url', query);

    let session, userAccount;

    function setUp(state) {
        if (!postContainer) {
            postContainer = new Vue({
                el: '#post-view',
                data: {
                    lang: lang,
                    session: session,
                    user: userAccount.user,
                    state: state,
                    comment: '',
                },
                methods: {
                    getDefaultAvatar: R.getDefaultAvatar,
                    getLicense: function () {
                        return License.fromFlag(this.state.post.metadata.license);
                    },
                    dateFromNow(date) {
                        date = new Date(date + 'Z');
                        return moment(date.getTime()).fromNow();
                    },
                    makeComment: makeComment,
                    makeVote: function (post) {
                        makeVote(post, function () {
                            fetchContent();
                        })
                    },
                    onFollow: function (err, result) {
                        console.log('onFollow', err, result);
                    }
                }
            })
        } else {
            postContainer.state = state;
            postContainer.session = session;
            postContainer.user = userAccount.user;
        }
    }

    function makeComment() {
        let session = Session.getAlive();
        let comment = postContainer.comment;
        if (comment.length > 0) {
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

    creaEvents.on('crea.login', function (s, a) {
        session = s;
        userAccount = a;
        fetchContent();
    });

    creaEvents.on('crea.logout', function () {
        fetchContent();
    })
})();