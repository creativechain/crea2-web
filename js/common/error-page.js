/**
 * Created by ander on 7/01/19.
 */


let errorContainer;

(function () {

    function setUp() {
        if (!errorContainer) {
            errorContainer = new Vue({
                el: '#error-container',
                data: {
                    lang: getLanguage(),
                    url: window.location.pathname
                }
            })
        }
    }

    creaEvents.on('crea.session.login', function () {
        setUp();
    })
})();