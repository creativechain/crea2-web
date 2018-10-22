/**
 * Created by ander on 11/10/18.
 */

(function () {
    let session = Session.getAlive();
    if (session) {
        session.login(function (err, account) {
            if (err) {
                console.error(err);
            } else {
                account.metadata = jsonify(account.json_metadata);
                account.metadata.avatar = account.metadata.avatar || {};
                creaEvents.emit('crea.login', session, account);
            }
        })

    } else {
        creaEvents.emit('crea.login', false);
    }

    new ClipboardJS('.btn_copy');
})();
