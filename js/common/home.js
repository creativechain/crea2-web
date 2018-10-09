/**
 * Created by ander on 9/10/18.
 */

let homePosts;

function retrieveContent(limit = 20) {
    let params = {
        limit: limit
    };

    crea.api.getDiscussionsByCreatedWith(params, function (err, result) {
        if (err) {
            console.error(err);
        } else if (result.discussions) {
            result = result.discussions;
            console.log(result);

            if (!homePosts) {
                homePosts = new Vue({
                    el: '#home-posts',
                    data: {
                        posts: result,
                        lang: lang
                    }
                })
            } else {
                homePosts.$data.posts = result;
            }
        }
    })
}

retrieveContent();