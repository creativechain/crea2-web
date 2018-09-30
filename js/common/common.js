/**
 * Created by ander on 25/09/18.
 */

let apiOptions = {
    url: 'http://localhost/node/',
    addressPrefix: 'CREA',
    chainId: '0000000000000000000000000000000000000000000000000000000000000000',
    accountCreator: 'initminer',
    privCreator: '5JNHfZYKGaomSFvd4NUdQ9qMcEAC43kujbfjueTHpVapX1Kzq2n'
};

localStorage.debug = 'crea:*';
crea.api.setOptions(apiOptions);
crea.config.set('address_prefix', apiOptions.addressPrefix);
crea.config.set('chain_id', apiOptions.chainId);

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
    console.log(keys)

    crea.broadcast.accountCreate(apiOptions.privCreator, "0.001 CREA", apiOptions.accountCreator, username, createAuth(keys.ownerPubkey), createAuth(keys.activePubkey), createAuth(keys.postingPubkey), keys.memoPubkey, {}, function (err, result) {
        console.log(err, result);
    });
}

