/**
 * Created by ander on 25/09/18.
 */
let walletContainer;
(function () {


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
                    history: {
                        data: [],
                        accounts: {}
                    },
                    showPriv: {
                        posting: false,
                        active: false,
                        owner: false,
                        memo: false
                    }
                },
                mounted: function () {
                    $('#wallet-tabs').prev().remove();
                    console.log('Element deleted');
                },
                methods: {
                    getKey: function (auth) {
                        if (this.showPriv[auth] && this.session.account.keys[auth]) {
                            return this.session.account.keys[auth].prv;
                        } else if (this.session.account.keys[auth]) {
                            return this.session.account.keys[auth].pub;
                        }

                        return '----';
                    },
                    openPost: function (post) {
                        window.location.href = '/post-view.php?url=' + post.url;
                    },
                    parseAsset: function (asset) {
                        return Asset.parse(asset).toFriendlyString();
                    },
                    dateFromNow(date) {
                        date = new Date(date);
                        return moment(date.getTime()).fromNow();
                    },
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
            walletContainer.state = state;
            walletContainer.account = account;
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

    /**
     *
     * @param {string} username
     */
    function fetchHistory(username) {

        setTimeout(function () {
            crea.api.getAccountHistory(username, -1, 50, function (err, result) {
                if (err) {
                    console.error(err);
                } else {
                    result.history = result.history.reverse();
                    let accounts = [];
                    let history = [];
                    result.history.forEach(function (h) {
                        h = h[1];
                        let addIfNotExists = function(account) {
                            if (account && accounts.indexOf(account) < 0) {
                                accounts.push(account);
                            }
                        };

                        if (h.op.type == 'transfer_operation') {
                            addIfNotExists(h.op.value.from);
                            addIfNotExists(h.op.value.to);
                        } else if (h.op.type == 'transfer_to_vesting_operation') {
                            addIfNotExists(h.op.value.from);
                            addIfNotExists(h.op.value.to);
                        } else if (h.op.type == 'vote_operation') {
                            addIfNotExists(h.op.value.voter);
                            addIfNotExists(h.op.value.author);
                        } else if (h.op.type == 'comment_operation') {
                            addIfNotExists(h.op.value.parent_author);
                            addIfNotExists(h.op.value.author);
                        }

                        history.push(h);
                    });

                    crea.api.getAccounts(accounts, function (err, result) {
                        if (err) {
                            console.error(err);
                        } else {
                            let opsAccounts = {};
                            accounts.forEach(function (u) {
                                for (let x = 0; x < result.length; x++) {
                                    if (u == result[x].name) {
                                        opsAccounts[u] = result[x];
                                        opsAccounts[u].metadata = jsonify(opsAccounts[u].json_metadata);
                                        break;
                                    }
                                }
                            });

                            walletContainer.history.data = history;
                            walletContainer.history.accounts = opsAccounts;
                        }
                    })
                }
            })
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
                    fetchHistory(session.account.username);
                    updateWalletProfile(result);
                }
            });

        } else {
            //Not logged, redirect to Home if location is wallet.php
            toHome('wallet.php');
        }
    }

    setUpWallet();
})();


