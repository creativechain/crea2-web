/**
 * Created by ander on 25/09/18.
 */

let profileContainer;
let walletModalSend;
let walletModalDeEnergize;

(function () {

    let defaultModalConfig = {
        op: 'transfer_crea',
        title: lang.WALLET.TRANSFER_CREA_TITLE,
        text: lang.WALLET.TRANSFER_CREA_TEXT,
        button: lang.BUTTON.SEND,
        total_amount: Asset.parseString('0.000 CREA'),
        confirmed: false
    };

    function tags(element) {
        $('#' + element).tagsinput();
    }

    function updateModalDeEnergize(state, session) {
        if (!walletModalDeEnergize) {
            walletModalDeEnergize = new Vue({
                el: '#crea-de-energize',
                data: {
                    lang: lang,
                    session: session,
                    state: state,
                    amount: 0
                },
                methods: {
                    onAmount: function (amount) {
                        console.log(amount);
                    }
                }
            })
        } else {
            walletModalDeEnergize.session = session;
            walletModalDeEnergize.state = state;
        }
    }

    function updateModalSendView(state, session) {
        if (!walletModalSend) {
            walletModalSend = new Vue({
                el: '#wallet-send',
                data: {
                    CONSTANTS: CONSTANTS,
                    session: session,
                    state: state,
                    lang: lang,
                    from: state.user.name,
                    to: '',
                    amount: 0,
                    memo: '',
                    config: defaultModalConfig,
                    toError: false,
                },
                methods: {
                    cancelSend: function (event) {
                        if (event) {
                            event.preventDefault();
                        }

                        this.config.confirmed = false;
                    },
                    hideModalSend: function (event) {
                        if (event) {
                            event.preventDefault();
                        }

                        $('#wallet-send').removeClass('modal-active');
                        this.clearFields();
                    },
                    clearFields: function () {
                        //Clear fields
                        this.to = '';
                        this.amount = 0;
                        this.memo = '';
                        this.config = defaultModalConfig;
                    },
                    useTotalAmount: function (event) {
                        if (event) {
                            event.preventDefault();
                        }

                        this.amount = this.config.total_amount.toPlainString();
                    },
                    sendCrea: function () {
                        if (this.toError || !this.amount) {
                            //TODO: SHOW ERRORS
                        } else if (this.config.confirmed) {
                            let that = this;
                            let amount = Asset.parseString(this.amount + ' CREA').toFriendlyString();
                            globalLoading.show = true;
                            transfer(this.config.op, this.session, this.to, amount, this.memo, function (err, result) {
                                console.log(err, result);
                                globalLoading.show  = false;
                                if (result) {
                                    fetchUserState(profileContainer.session.account.username);
                                    fetchHistory(profileContainer.session.account.username);
                                    that.hideModalSend();
                                }
                            });
                        } else {
                            this.config.confirmed = true;
                            this.config.button = this.lang.BUTTON.SEND;
                        }

                    },
                    validateDestiny: function(event) {
                        let username = event.target.value;
                        if (!crea.utils.validateAccountName(username)) {
                            let accounts = [ username ];
                            console.log("Checking", accounts);
                            let that = this;
                            crea.api.lookupAccountNames(accounts, function (err, result) {
                                if (err) {
                                    console.error(err);
                                    that.toError = true;
                                } else {
                                    that.toError = result[0] == null;
                                }
                            })
                        } else {
                            this.toError = true;
                        }
                    }
                }
            });
        } else {
            walletModalSend.state = state;
            walletModalSend.session = session;
            walletModalSend.from = state.user.name;
        }
    }
    /**
     *
     * @param state
     * @param {Session} session
     * @param account
     * @param usernameFilter
     * @param navfilter
     * @returns {License}
     */
    function updateProfileView(state, session, account, usernameFilter, navfilter = 'projects') {
        if (!profileContainer) {
            profileContainer = new Vue({
                el: '#profile-container',
                data: {
                    CONSTANTS: CONSTANTS,
                    lang: lang,
                    session: session,
                    account: account,
                    state: state,
                    filter: usernameFilter,
                    profile: state.user.metadata,
                    navfilter: navfilter,
                    walletTab: 'balances',
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
                updated: function () {
                    let t = $('#wallet-tabs').prev();
                    if (t.is(':empty')) {
                        t.remove();
                        console.log('Removed generated tabs');
                    }

                    let inputTags = $('#profile-edit-tags');
                    inputTags.tagsinput({
                        maxTags: CONSTANTS.MAX_TAGS,
                        maxChars: CONSTANTS.TEXT_MAX_SIZE.TAG,
                        delimiter: ' '
                    });

                    if (this.profile.tags) {
                        this.profile.tags.forEach(function (t) {
                            inputTags.tagsinput('add', t);
                        })
                    }

                    //$('#wallet-tabs').prev().remove();
                },
                methods: {
                    getDefaultAvatar: R.getDefaultAvatar,
                    getKey: function (auth) {
                        if (this.showPriv[auth] && session) {
                            if (this.session.account.keys[auth]) {
                                return this.session.account.keys[auth].prv;
                            }
                        } else if (auth === 'memo') {
                            return state.user['memo_key'];
                        } else {
                            return state.user[auth].key_auths[0][0];
                        }
                    },
                    prepareModal: function(op) {
                        let config;
                        switch (op) {
                            case 'transfer_crea':
                                config = {title: this.lang.WALLET.TRANSFER_CREA_TITLE,
                                    text: this.lang.WALLET.TRANSFER_CREA_TEXT, button: lang.BUTTON.CONFIRM,
                                    total_amount: Asset.parseString(this.state.user.balance)
                                };
                                break;
                            case 'transfer_to_savings_crea':
                                config = {title: this.lang.WALLET.TRANSFER_SAVINGS_TITLE,
                                    text: this.lang.WALLET.TRANSFER_SAVINGS_TEXT, button: lang.BUTTON.TRANSFER,
                                    total_amount: Asset.parseString(this.state.user.balance)
                                };
                                break;
                            case 'transfer_to_vests':
                                config = {title: this.lang.WALLET.CONVERT_CGY_TITLE,
                                    text: this.lang.WALLET.CONVERT_CGY_TEXT, button: lang.BUTTON.TRANSFER,
                                    total_amount: Asset.parseString(this.state.user.balance)
                                };
                                break;
                            case 'transfer_cbd':
                                config = {title: this.lang.WALLET.TRANSFER_CBD_TITLE,
                                    text: this.lang.WALLET.TRANSFER_CBD_TEXT, button: lang.BUTTON.SEND,
                                    total_amount: Asset.parseString(this.state.user.cbd_balance)
                                };
                                break;
                            case 'transfer_to_savings_cbd':
                                config = {title: this.lang.WALLET.TRANSFER_SAVINGS_TITLE,
                                    text: this.lang.WALLET.TRANSFER_SAVINGS_TEXT, button: lang.BUTTON.TRANSFER,
                                    total_amount: Asset.parseString(this.state.user.cbd_balance)
                                };
                                break;

                        }
                        config.op = op;
                        walletModalSend.config = Object.assign(defaultModalConfig, config);
                    },
                    canWithdraw: function () {
                        return this.session && this.session.account.username == state.user.name;
                    },
                    parseAsset: function (asset) {
                        return Asset.parse(asset).toFriendlyString();
                    },
                    openPost: showPost,
                    showProfile: showProfile,
                    getJoinDate: function () {
                        let date = new Date(this.state.user.created);
                        return this.lang.PROFILE.JOINED + moment(date.getTime(), 'x').format('MMMM YYYY');
                    },
                    getBuzz: function (reputation) {
                        return crea.formatter.reputation(reputation);
                    },
                    getTags: function (post) {
                        let tags = post.metadata.tags;
                        if (tags) {
                            tags = tags.slice(0, 7);
                            return tags.join(', ');
                        }

                        return '';
                    },
                    hasPaid: function (post) {
                        let now = new Date();
                        let payout = toLocaleDate(post.cashout_time);
                        return now.getTime() > payout.getTime();
                    },
                    getPayoutPostDate: function (post) {
                        let date = toLocaleDate(post.cashout_time);
                        if (this.hasPaid(post)) {
                            date = toLocaleDate(post.last_payout);
                        }

                        return moment(toLocaleDate(date)).fromNow();
                    },
                    getPayout: function (post) {
                        let amount = Asset.parseString(post.pending_payout_value);
                        if (this.hasPaid(post)) {
                            amount = Asset.parseString(post.total_payout_value);
                            amount = amount.add(Asset.parseString(post.curator_payout_value));
                        }

                        return amount.toPlainString() + '$'
                    },
                    dateFromNow(date) {
                        return moment(toLocaleDate(date)).fromNow();
                    },
                    getFutureDate: function (date) {
                        return moment(toLocaleDate(date)).fromNow();
                    },
                    onFollow: function (err, result) {
                        console.log('onFollow', err, result);
                    },
                    onVote: function (err, result) {
                        updateData(Session.getAlive());
                    },
                    getLicense(flag) {
                        if (flag) {
                            return License.fromFlag(flag);
                        }

                        return new License(LICENSE.FREE_CONTENT);
                    },
                    getCGYReward() {
                        let reward = parseFloat(this.state.user.reward_vesting_crea.split(' ')[0]);
                        return reward + ' CGY';
                    },
                    getCGYBalance() {
                        let vest = parseFloat(this.state.user.vesting_shares.split(' ')[0]);
                        let totalVests = parseFloat(state.props.total_vesting_shares.split(' ')[0]);
                        let totalVestCrea = parseFloat(state.props.total_vesting_fund_crea.split(' ')[0]);

                        let energy = crea.formatter.vestToCrea(vest, totalVests, totalVestCrea);
                        return Asset.parse({
                            amount: energy,
                            nai: apiOptions.nai.CREA
                        }).toFriendlyString();
                    },
                    hasRewardBalance: function () {
                        let crea = Asset.parseString(this.state.user.reward_crea_balance);
                        let cbd = Asset.parseString(this.state.user.reward_cbd_balance);
                        let cgy = Asset.parseString(this.state.user.reward_vesting_balance);
                        return crea.amount > 0 || cbd.amount > 0 || cgy.amount > 0;
                    },
                    claimRewards: claimRewards,
                    sendAccountUpdate: sendAccountUpdate
                }
            });
        } else {
            if (session) {
                profileContainer.session = session;
            }

            if (account) {
                profileContainer.account = account;
            }

            profileContainer.state = state;
            profileContainer.filter = usernameFilter;
            profileContainer.profile = state.user.metadata;
            profileContainer.navfilter = navfilter;
        }
    }

    /**
     *
     * @param state
     * @param session
     * @param account
     * @param usernameFilter
     */
    function detectNav(state, session, account, usernameFilter) {

        let nav = getParameterByName('nav', window.location.href);

        if (!nav) {
            nav = 'projects';
        }

        updateProfileView(state, session, account, usernameFilter, nav);
    }

    function sendAccountUpdate() {
        let session = Session.getAlive();
        let metadata = profileContainer.profile;
        metadata.tags = $('#profile-edit-tags').val().split(' ');
        metadata = jsonstring(metadata);
        crea.broadcast.accountUpdate(session.account.keys.owner.prv, session.account.username,
            createAuth(session.account.keys.owner.pub), createAuth(session.account.keys.active.pub),
            createAuth(session.account.keys.posting.pub), session.account.keys.memo.pub,
            metadata, function (err, data) {
                if (err) {
                    console.error(err);
                } else {
                    updateData(session);
                }
            })
    }

    /**
     *
     * @param {Session} session
     */
    function updateData(session) {
        fetchUserState(session.account.username, function (err, result) {
            if (err) {
                console.error(err);
            } else {
                handleProfile(session, result, session.account.username);
            }
        });
    }
    /**
     *
     * @param {string} username
     * @param callback
     */
    function fetchFollowCount(username, callback) {

        crea.api.getFollowCount(username, function(err, result) {
            if (err) {
                console.error(err);
            } else {
                if (callback) {
                    callback(err, result);
                }
            }
        });
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
                        } else if (h.op.type == 'producer_reward_operation') {
                            addIfNotExists(h.op.value.producer);
                        } else if (h.op.type == 'account_create_operation') {
                            addIfNotExists(h.op.value.creator);
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
                                        opsAccounts[u].metadata.avatar = opsAccounts[u].metadata.avatar || {};
                                        break;
                                    }
                                }
                            });

                            profileContainer.history.data = history;
                            profileContainer.history.accounts = opsAccounts;
                        }
                    })
                }
            })
        });
    }

    /**
     *
     * @param {string} username
     * @param callback
     */
    function fetchUserState(username, callback) {
        let usernameFilter;
        if (!username.startsWith('/@')) {
            usernameFilter = '/@' + username;
        }

        crea.api.getState(usernameFilter, function (err, state) {
            if (err) {
                console.error(err);
            } else  {
                console.log(state);
                let accounts = Object.keys(state.accounts);

                accounts.forEach(function (k) {
                    state.accounts[k].metadata = jsonify(state.accounts[k].json_metadata);
                    state.accounts[k].metadata.avatar = state.accounts[k].metadata.avatar || {};
                });

                state.user = state.accounts[username];
                crea.formatter.estimateAccountValue(state.user)
                    .then(function (value) {
                        state.user.estimate_account_value = value;
                    });
                let posts = Object.keys(state.content);

                posts.forEach(function (k) {
                    state.content[k].metadata = jsonify(state.content[k].json_metadata);
                });

                state.discussion_idx = {};
                posts.sort(function (k1, k2) {
                    let d1 = new Date(state.content[k1].created);
                    let d2 = new Date(state.content[k2].created);

                    return d2.getTime() - d1.getTime();
                });

                state.discussion_idx[''] = posts;

                if (callback) {
                    callback(err, state);
                }
            }
        });
    }

    function handleProfile(session, userAccount, user = null) {
        if (!user) {
            let path = window.location.pathname;
            user = path.split('/')[1];
        }

        if (user.startsWith('@')) {
            user = user.replace('@', '');
        } else if (session) {
            //Handle use by parameter profile
            user = getParameterByName('profile', window.location.href);
            if (!user) {
                //No user found
                user = session.account.username;
            }
        }

        if (user) {
            fetchHistory(user);
            fetchUserState(user, function (err, state) {
                if (err) {
                    console.error(err);
                } else {
                    fetchFollowCount(user, function (err, followCount) {
                        if (err) {
                            console.error(err);
                        } else {
                            console.log(state, followCount);
                            state.user.followers_count = followCount.follower_count;
                            state.user.following_count = followCount.following_count;

                            detectNav(state, session, userAccount, user);
                            updateModalSendView(state, session);
                            updateModalDeEnergize(state, session);
                        }
                    })
                }
            });
        }

    }

    function claimRewards (event) {
        if (event) {
            event.preventDefault();
        }

        let creaBalance = profileContainer.state.user.reward_crea_balance;
        let cbd = profileContainer.state.user.reward_cbd_balance;
        let cgy = profileContainer.state.user.reward_vesting_balance;

        globalLoading.show = true;
        crea.broadcast.claimRewardBalance(profileContainer.session.account.keys.active.prv,
            profileContainer.session.account.username, creaBalance, cbd, cgy, function (err, result) {
                if (err) {
                    console.error(err);
                } else {
                    updateData(profileContainer.session);
                }
                globalLoading.show = false;
            })
    }

    /**
     *
     * @param {string} op
     * @param {Session} session
     * @param {string} to
     * @param {string} amount
     * @param {string} [memo]
     * @param {Function} [callback]
     */
    function transfer(op, session, to, amount, memo, callback) {
        if (typeof memo === 'function') {
            callback = memo;
            memo = '';
        }

        if (session) {
            let from = session.account.username;
            let wif = session.account.keys.active.prv;

            switch (op) {
                case CONSTANTS.TRANSFER.TRANSFER_CREA:
                    crea.broadcast.transfer(wif, from, to, amount, memo, callback);
                    break;
                case CONSTANTS.TRANSFER.TRANSFER_TO_SAVINGS_CREA:
                case CONSTANTS.TRANSFER.TRANSFER_TO_SAVINGS_CBD:
                    crea.broadcast.transferToSavings(wif, from, to, amount, memo, callback);
                    break;
                case CONSTANTS.TRANSFER.TRANSFER_TO_VESTS:
                    crea.broadcast.transferToVesting(wif, from, to, amount, callback);
                    break;
            }
        } else if(callback) {
            callback(Errors.USER_NOT_LOGGED);
        }
    }

    creaEvents.on('crea.session.login', function (session, account) {
        if (session) {
            account.user.cgy_balance = '0.000 ' + apiOptions.symbol.CGY;
        }

        handleProfile(session, account);
    });

    creaEvents.on('crea.session.update', function (session, userAccount) {
        if (session) {
            userAccount.user.cgy_balance = '0.000 ' + apiOptions.symbol.CGY;
        }

        handleProfile(session, userAccount);
    });

})();
