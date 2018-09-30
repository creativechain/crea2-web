/**
 * Created by ander on 25/09/18.
 */

let walletMenu;
let walletProfile;

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
        joinDate: false
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
}

function setUpWallet() {
    let session  = Session.getAlive();

    if (session) {
        crea.api.getAccounts([session.account.username], function (err, result) {

            if (err) {
                //TODO: Show an error
            } else if (result.length > 0) {
                let account = result[0];
                walletContainer.$data.funds = {
                    crea: account.balance,
                    cbd: account.cbd_balance,
                    vests: account.vesting_balance,
                    cgy: '0.000000 CGY',
                };
                setUpWalletAccount(account);
            } else {
                //TODO: Account not exists
            }
        });

    }
}

setUpWallet();

