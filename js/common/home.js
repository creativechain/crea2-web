/**
 * Created by ander on 9/10/18.
 */

let homePosts;
let homeBanner;

homeBanner =  new Vue({
    el: '#home-banner',
    data: {
        showBanner: true,
        lang: lang
    },
    methods: {
        closeBanner: showBanner
    }
});

function showPosts(filter, data) {
    //console.log(filter, data);
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
                    makeVote(post, function () {
                        creaEvents.emit('crea.content.filter', this.filter);
                    })
                },
            }
        })
    } else {
        homePosts.$data.filter = filter;
        homePosts.$data.data = data;
        homePosts.$data.session = Session.getAlive() != false;
    }
}

function showBanner(show = true) {
        homeBanner.$data.showBanner = show;
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
