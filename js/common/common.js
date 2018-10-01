/**
 * Created by ander on 25/09/18.
 */

function goTo(location) {
    window.location.href = location;
}
/**
 *
 * @param {string} location
 */
function toHome(location) {
    console.log('Real location:', window.location.href, 'Checked location:', location, location && window.location.href.indexOf(location) > -1);
    if (location) {
        if (window.location.href.indexOf(location) > -1) {
            goTo('/crea');
        }
    } else {
        goTo('/crea');
    }
}

function createAuth(key) {
    return {
        weight_threshold: 1,
        account_auths: [],
        key_auths: [
            [key, 1]
        ]
    }
}

function createAccount(username) {
    let password = crea.formatter.createSuggestedPassword();
    console.log(password);
    let keys = crea.auth.getPrivateKeys(username, password, DEFAULT_ROLES);
    console.log(keys);

    crea.broadcast.accountCreate(apiOptions.privCreator, "0.001 CREA", apiOptions.accountCreator, username, createAuth(keys.ownerPubkey), createAuth(keys.activePubkey), createAuth(keys.postingPubkey), keys.memoPubkey, {}, function (err, result) {
        console.log(err, result);
    });
}

