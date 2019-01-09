/**
 * Created by ander on 30/12/18.
 */

let recoverContainer;
(function () {

    function setUp() {
        recoverContainer = new Vue({
            el: '#recover-container',
            data: {
                lang: getLanguage()
            }
        });
    }

    creaEvents.on('crea.session.login', function (s, a) {
        setUp();
        creaEvents.emit('crea.dom.ready', 'publish');
    });

})();