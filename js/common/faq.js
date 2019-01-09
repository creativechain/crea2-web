/**
 * Created by ander on 28/12/18.
 */

let faqContainer;
(function () {

    function setUp() {
        faqContainer = new Vue({
            el: '#faq-container',
            data: {
                lang: getLanguage(),
                faq: faq[getLanguage().CODE],
            },
            methods: {
                linkfy: function (str) {
                    let newStr = str.replace(/(<a href=")?((https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)))(">(.*)<\/a>)?/gi, function () {
                        return '<a href="' + arguments[2] + '">' + (arguments[7] || arguments[2]) + '</a>'
                    });

                    if (str === newStr) {
                        return null;
                    }

                    return newStr;
                },
                toPermalink: toPermalink
            }
        });

        creaEvents.emit('crea.dom.ready');
    }

    creaEvents.on('crea.session.login', function (s, a) {
        setUp();
    })
})();
