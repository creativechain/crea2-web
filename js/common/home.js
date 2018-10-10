/**
 * Created by ander on 9/10/18.
 */

let homePosts;

function showPosts(posts) {
    if (!homePosts) {
        homePosts = new Vue({
            el: '#home-posts',
            data: {
                posts: posts,
                lang: lang
            },
            methods: {
                retrieveNowContent: retrieveNowContent,
                retrieveTrendingContent: retrieveTrendingContent,
                retrieveHotContent: retrieveHotContent,
                retrievePromotedContent: retrievePromotedContent
            }
        })
    } else {
        homePosts.$data.posts = posts;
    }
}



if (Session.getAlive()) {
    //TODO: REPLACE BY FOLLOWING CONTENT
    retrieveNowContent();
} else {
    retrieveNowContent();
}
