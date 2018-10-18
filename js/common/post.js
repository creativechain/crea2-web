/**
 * Created by ander on 18/10/18.
 */

let postContainer;

(function () {

    let query = window.location.search;

    function setUp(state) {
        let session = Session.getAlive();
        if (!postContainer) {
            postContainer = new Vue({
                el: '#post-view',
                data: {
                    lang: lang,
                    session: session,
                    state: state,
                },
                methods: {
                    getLicense: function () {
                        return License.fromFlag(this.state.content.metadata.license);
                    }
                }
            })
        } else {
            postContainer.state = state;
            postContainer.session = session;
        }
    }

    let url = getParameterByName('url', query);
    crea.api.getState(url, function (err, result) {
        if (err) {
            console.error(err);
        } else {
            let cKeys = Object.keys(result.content);
            result.content = result.content[cKeys[0]];
            result.content.metadata = jsonify(result.content.json_metadata);
            result.author = result.accounts[result.content.author];
            result.author.metadata = jsonify(result.author.json_metadata);
            console.log(result);
            setUp(result);
        }
    })

})();