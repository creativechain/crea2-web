/**
 * Created by ander on 11/10/18.
 */

if (Session.getAlive()) {
    creaEvents.emit('crea.login', Session.getAlive());
} else {
    creaEvents.emit('crea.login', false);
}