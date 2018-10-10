/**
 * Created by ander on 9/10/18.
 */

let homePosts;

function showPosts(filter, data) {
    if (!homePosts) {
        homePosts = new Vue({
            el: '#home-posts',
            data: {
                session: Session.getAlive() != false,
                filter: filter,
                data: data,
                lang: lang
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
                }
            }
        })
    } else {
        homePosts.$data.filter = filter;
        homePosts.$data.data = data;
        homePosts.$data.session = Session.getAlive() != false;
    }
}



if (Session.getAlive()) {
    //TODO: REPLACE BY FOLLOWING CONTENT
    creaEvents.emit('crea.content.filter', 'created');
} else {
    creaEvents.emit('crea.content.filter', 'created');
}
