

(function () {


    creaEvents.on('crea.session.login', function (s, a) {
        creaEvents.emit('crea.dom.ready');
    });
})();