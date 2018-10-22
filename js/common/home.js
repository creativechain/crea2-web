/**
 * Created by ander on 9/10/18.
 */

let homePosts;

function showPosts(filter, data) {
    //console.log(filter, data);
    let content = data.content;
    let accounts = data.accounts;

    let cKeys = Object.keys(content);
    cKeys.forEach(function (k) {
        content[k].metadata = jsonify(content[k].json_metadata);
    });
    data.content = content;

    let aKeys = Object.keys(accounts);
    aKeys.forEach(function (k) {
        accounts[k].metadata = jsonify(accounts[k].json_metadata);
        accounts[k].metadata.avatar = accounts[k].metadata.avatar || {};
    });
    data.accounts = accounts;

    if (!homePosts) {
        homePosts = new Vue({
            el: '#home-posts',
            data: {
                session: Session.getAlive() != false,
                filter: filter,
                data: data,
                lang: lang,
            },
            methods: {
                getDefaultAvatar: R.getDefaultAvatar,
                openPost: function (post) {
                    window.location.href = '/post-view.php?url=' + post.url;
                },
                parseAsset: function (asset) {
                    return Asset.parse(asset).toFriendlyString();
                },
                getFutureDate: function (date) {
                    date = new Date(date);
                    return moment(date.getTime(), 'x').endOf('day').fromNow();
                },
                parseJSON: function (strJson) {

                    if (strJson && strJson.length > 0) {
                        try {
                            return JSON.parse(strJson);
                        } catch (e) {
                            console.error('JSON Error parsing', strJson);
                        }
                    }

                    return {};
                },
                userHasVote: function (post) {
                    let session = Session.getAlive();

                    if (session) {
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
                makeVote: function (post) {
                    let filter = this.filter;
                    makeVote(post, function () {
                        creaEvents.emit('crea.content.filter', filter);
                    })
                },
                getLicense(flag) {
                    if (flag) {
                        return License.fromFlag(flag);
                    }

                    return new License(LICENSE.FREE_CONTENT);
                }
            }
        })
    } else {
        homePosts.$data.filter = filter;
        homePosts.$data.data = data;
        homePosts.$data.session = Session.getAlive() != false;
    }
}



creaEvents.on('crea.login', function (session) {
    showBanner(session == false);
    creaEvents.emit('crea.content.filter', 'promoted');
});


if (Session.getAlive()) {
    //TODO: REPLACE BY FOLLOWING CONTENT
    creaEvents.emit('crea.content.filter', 'created');
} else {
    creaEvents.emit('crea.content.filter', 'promoted');
}
