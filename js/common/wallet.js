/**
 * Created by ander on 25/09/18.
 */

let walletMenu;

walletMenu = new Vue({
    el: '#wallet-menu',
    data: {
        lang: lang
    }
});

let walletContainer = new Vue({
    el: '#wallet-container',
    data: {
        lang: lang,
        session: Session.getAlive(),
        funds: {
            crea: '0.000 CREA',
            cgy: '0.000000 CGY',
            cbd: '0.000 CBD',
            vests: '0.000000 VESTS'
        },
        account: false,
    },

    methods: {
        getJoinDate: function () {
            let date = new Date(this.account.created);
            return this.lang.PROFILE.JOINED + moment(date.getTime(), 'x').format('MMMM YYYY');
        }
    }
});

function setUpWalletAccount(account) {
    walletContainer.$data.account = account;
    walletContainer.funds = {
        crea: account.balance,
        cbd: account.cbd_balance,
        vests: account.vesting_balance,
        cgy: '0.000000 CGY',
    };
}

function setUpWallet() {
    let session = Session.getAlive();

    if (session) {
        crea.api.getAccounts([session.account.username], function (err, result) {

            if (err) {
                console.error(err);
                //TODO: Show an error
            } else if (result.length > 0) {
                let account = result[0];
                setUpWalletAccount(account);
            } else {
                //TODO: Account not exists
            }
        });

    } else {
        //Not logged, redirect to Home if location is wallet.php
        toHome('wallet.php');
    }
}

/**
 *
 * @param {string} destiny
 * @param {string} amount
 * @param {string} memo
 * @param callback
 */
function sendMoney(destiny, amount, memo, callback) {
    let session = Session.getAlive();
    crea.api.getAccounts([destiny], function (err, result) {
        if (err) {
            console.error(err);
        } else if (result.length > 0) {
            if (amount.indexOf(apiOptions.addressPrefix) < 0) {
                amount += ' ' + apiOptions.addressPrefix;
            }

            crea.broadcast.transfer(session.account.keys.active.prv, session.account.username, destiny, amount, memo, function (err, result) {
                console.log(err, result);
                callback(err, result);
                setUpWallet();
            })

        } else {
            callback(Errors.USER_NOT_FOUND);
        }
    });
}

function performSendMoney() {
    let username = $('#wallet-send-origin').val();
    let destiny = $('#wallet-send-destiny').val();
    let amount = $('#wallet-send-amount').val();
    let memo = $('#wallet-send-memo').val();

    if (amount.indexOf(',')) {
        amount = amount.replace(',', '.');
    }

    sendMoney(destiny, amount, memo);
}

setUpWallet();

