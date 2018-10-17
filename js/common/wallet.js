/**
 * Created by ander on 25/09/18.
 */
(function () {
    let walletContainer;

    let defaultProfile = {
        avatar: {},
        publicName: '',
        about: '',
        web: '',
        contact: '',
        tags: [],
        adultContent: 0,
        lang: 'en',
        valid: true
    };

    let walletMenu = new Vue({
        el: '#wallet-menu',
        data: {
            lang: lang
        }
    });

    function updateWalletAccount(state) {
        //console.log('Updating account', account);
        let session = Session.getAlive();
        let account = state.accounts[session.account.username];
        account.reputation = crea.formatter.reputation(account.reputation);
        state.accounts[session.account.username] = account;

        if (!walletContainer) {
            walletContainer = new Vue({
                el: '#wallet-container',
                data: {
                    lang: lang,
                    session: session,
                    state: state,
                    account: account,
                    profile: defaultProfile,
                    tab: 'balances',
                },
                methods: {
                    getJoinDate: function () {
                        let date = new Date(this.account.created);
                        return this.lang.PROFILE.JOINED + moment(date.getTime(), 'x').format('MMMM YYYY');
                    },
                    getCGYReward() {
                        let reward = parseFloat(this.account.reward_vesting_crea.split(' ')[0]);
                        return reward + ' CGY';
                    },
                    getCGYBalance() {
                        let vest = parseFloat(this.account.vesting_shares.split(' ')[0]);
                        let totalVests = parseFloat(state.props.total_vesting_shares.split(' ')[0]);
                        let totalVestCrea = parseFloat(state.props.total_vesting_fund_crea.split(' ')[0]);

                        let energy = totalVestCrea * (vest / totalVests);
                        return Asset.parse({
                            amount: energy,
                            nai: apiOptions.nai.CREA
                        }).toFriendlyString();
                    },
                    changeTab(tab) {
                        this.tab = tab;
                    }
                }
            });
        } else {
            //Vue.set(walletContainer, 'account', account);
            walletContainer.$data.state = state;
            walletContainer.$data.account = account;
            //walletContainer.$forceUpdate();
        }
    }

    function updateWalletProfile(state) {
        let session = Session.getAlive();
        crea.api.getFollowCount(session.account.username, function(err, result) {
            if (err) {
                console.error(err);
            } else {

                state.accounts[session.account.username].followers_count = result.follower_count;
                state.accounts[session.account.username].following_count = result.following_count;
                updateWalletAccount(state);
            }
        });

    }

    function setUpWallet() {
        let session = Session.getAlive();

        if (session) {
            crea.api.getState('@' + session.account.username, function (err, result) {

                if (err) {
                    console.error(err);
                    //TODO: Show an error
                } else {
                    updateWalletProfile(result);
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
})();


