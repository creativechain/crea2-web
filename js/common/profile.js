/**
 * Created by ander on 25/09/18.
 */

let profileContainer;
let rewardsContainer = {};
let walletModalSend;
let walletModalDeEnergize;

(function () {

    let defaultModalConfig = {
        op: 'transfer_crea',
        title: lang.WALLET.TRANSFER_CREA_TITLE,
        text: lang.WALLET.TRANSFER_CREA_TEXT,
        button: lang.BUTTON.SEND,
        total_amount: Asset.parseString('0.000 CREA'),
        confirmed: false,
        to: null,
        disableTo: false
    };

    function updateModalDeEnergize(state, session) {
        console.log('Modal De-Energize', jsonify(jsonstring(state)));

        let vestsCrea = parseFloat(vestingCrea(state.user, state.props).toPlainString());
        let delegatedVesting = parseFloat(delegatedCrea(state.user, state.props).toPlainString());
        let maxPowerDown = vestsCrea - delegatedVesting;

        let withdrawn = vestsToCgy(state, new Vests(state.user.withdrawn).toFriendlyString(), apiOptions.nai.CREA);
        let toWithdraw = vestsToCgy(state, new Vests(state.user.to_withdraw).toFriendlyString(), apiOptions.nai.CREA);

        let withdrawNote = '';
        if (toWithdraw.amount - withdrawn.amount > 0) {
            withdrawNote = String.format(lang.WALLET.DE_ENERGIZE_TEXT, toWithdraw.toFriendlyString(), withdrawn.toFriendlyString());
        }

        if (!walletModalDeEnergize) {
            walletModalDeEnergize = new Vue({
                el: '#wallet-de-energize',
                data: {
                    lang: lang,
                    session: session,
                    state: state,
                    maxPowerDown: maxPowerDown,
                    finalAmount: 0,
                    sliderValue: 0,
                    amountByWeek: '',
                    withdrawNote: withdrawNote

                },
                methods: {
                    formatString: String.format,
                    onAmount: function (amount) {
                        amount += 0.0001;
                        let asset = Asset.parse({amount: amount, nai: apiOptions.nai.CREA});
                        this.finalAmount = parseFloat(asset.toPlainString());
                        this.amountByWeek = amount < 0.001 ? '' : String.format(this.lang.WALLET.DE_ENERGIZE_AMOUNT_BY_WEEK, asset.divide(8).toFriendlyString());
                    },
                    onManualChange: function (event) {
                        if (event) {
                            let amount = event.target.valueAsNumber;
                            if (isNaN(amount)) {
                                amount = 0;
                            }
                            this.sliderValue = amount;
                        }
                    },
                    hideModalDeEnergize: function (event) {
                        cancelEventPropagation(event);

                        $('#wallet-de-energize').removeClass('modal-active');
                    },
                    makePowerDown: function (event, amount) {
                        cancelEventPropagation(event);

                        globalLoading.show = true;
                        let finalAmount = this.finalAmount + ' CREA';
                        let vests = cgyToVests(this.state, finalAmount);
                        let that = this;
                        crea.broadcast.withdrawVesting(this.session.account.keys.active.prv, this.session.account.username, vests.toFriendlyString(), function (err, result) {
                            globalLoading.show = false;
                            if (err) {
                                console.error(err);
                            } else {
                                that.hideModalDeEnergize();
                                updateUserSession();
                            }
                        });
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
                    amount: 0,
                    memo: '',
                    config: clone(defaultModalConfig),
                    toError: false,
                },
                mounted: function () {
                    let that = this;
                    $('#wallet-send').on('modalClosed.modals.mr', function () {
                        that.clearFields();
                    })
                },
                methods: {
                    shouldShowMemo() {
                        const avoidMemoOps = ['transfer_to_vests', 'transfer_to_savings_crea', 'transfer_to_savings_cbd'];
                        return !avoidMemoOps.includes(this.config.op);
                    },
                    cancelSend: function (event) {
                        cancelEventPropagation(event);

                        this.config.confirmed = false;
                    },
                    hideModalSend: function (event) {
                        cancelEventPropagation(event);

                        $('#wallet-send').removeClass('modal-active');
                        this.clearFields();
                    },
                    clearFields: function () {
                        //Clear fields
                        this.amount = 0;
                        this.memo = '';
                        this.config = clone(defaultModalConfig);
                    },
                    useTotalAmount: function (event) {
                        cancelEventPropagation(event);

                        this.amount = this.config.total_amount.toPlainString();
                    },
                    sendCrea: function () {
                        if (this.toError || !this.amount) {
                            //TODO: SHOW ERRORS
                        } else if (this.config.confirmed) {
                            let that = this;
                            let amount = Asset.parseString(this.amount + ' CREA').toFriendlyString();
                            globalLoading.show = true;
                            transfer(this.config.op, this.session, this.config.to, amount, this.memo, function (err, result) {
                                console.log(err, result);
                                globalLoading.show  = false;
                                if (result) {
                                    updateUserSession();
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
     * @param navSection
     * @param walletSection
     */
    function updateProfileView(state, session, account, usernameFilter, navSection = 'projects', walletSection = 'balance') {
        console.log('Updating profile', account);

        let nextDeEnergize = '';
        if (state.user.to_withdraw > 0 && state.user.name === session.account.username) {
            nextDeEnergize = String.format(lang.WALLET.NEXT_DE_ENERGIZE, moment(toLocaleDate(state.user.next_vesting_withdrawal)).fromNow());
        }
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
                    navbar: {
                        section: navSection
                    },
                    profile: state.user.metadata,
                    walletTab: walletSection,
                    history: {
                        data: [],
                        accounts: {}
                    },
                    showPriv: {
                        posting: false,
                        active: false,
                        owner: false,
                        memo: false
                    },
                    changePass: {
                        username: session ? session.account.username : null,
                        oldPass: null,
                        newPass: null,
                        matchedPass: null,
                        checkedLostPass: false,
                        checkedStoredPass: false,
                        error: null
                    },
                    nextDeEnergize: nextDeEnergize,
                },
                updated: function () {
                    let t = $('#wallet-tabs').prev();
                    if (t.is(':empty')) {
                        t.remove();
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
                                config = {title: this.lang.WALLET.TRANSFER_TO_SAVINGS_TITLE,
                                    text: this.lang.WALLET.TRANSFER_TO_SAVINGS_TEXT, button: lang.BUTTON.TRANSFER,
                                    total_amount: Asset.parseString(this.state.user.balance),
                                    to: this.session.account.username,
                                    disableTo: true,
                                };
                                break;
                            case 'transfer_to_savings_cbd':
                                config = {title: this.lang.WALLET.TRANSFER_TO_SAVINGS_TITLE,
                                    text: this.lang.WALLET.TRANSFER_TO_SAVINGS_TEXT, button: lang.BUTTON.TRANSFER,
                                    total_amount: Asset.parseString(this.state.user.cbd_balance),
                                    to: this.session.account.username,
                                    disableTo: true,
                                };
                                break;
                            case 'transfer_from_savings_cbd':
                                config = {title: this.lang.WALLET.TRANSFER_FROM_SAVINGS_TITLE_CBD,
                                    text: this.lang.WALLET.TRANSFER_FROM_SAVINGS_TEXT, button: lang.BUTTON.TRANSFER,
                                    total_amount: Asset.parseString(this.state.user.savings_cbd_balance),
                                };
                                break;
                            case 'transfer_from_savings_crea':
                                config = {title: this.lang.WALLET.TRANSFER_FROM_SAVINGS_TITLE_CREA,
                                    text: this.lang.WALLET.TRANSFER_FROM_SAVINGS_TEXT, button: lang.BUTTON.TRANSFER,
                                    total_amount: Asset.parseString(this.state.user.savings_balance),
                                };
                                break;
                            case 'transfer_to_vests':
                                config = {title: this.lang.WALLET.CONVERT_CGY_TITLE,
                                    text: this.lang.WALLET.CONVERT_CGY_TEXT, button: lang.BUTTON.TRANSFER,
                                    total_amount: Asset.parseString(this.state.user.balance),
                                    to: this.session.account.username,
                                    disableTo: true,
                                };
                                break;
                            case 'transfer_cbd':
                                config = {title: this.lang.WALLET.TRANSFER_CBD_TITLE,
                                    text: this.lang.WALLET.TRANSFER_CBD_TEXT, button: lang.BUTTON.SEND,
                                    total_amount: Asset.parseString(this.state.user.cbd_balance)
                                };
                                break;

                        }
                        config.op = op;
                        walletModalSend.config = Object.assign(clone(defaultModalConfig), config);
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
                    getFeaturedImage: function (post) {
                        let featuredImage = post.metadata.featuredImage;
                        if (featuredImage) {
                            if (featuredImage.url) {
                                return featuredImage;
                            } else {
                                return {
                                    url: featuredImage
                                }
                            }
                        }

                        return {};
                    },
                    getTags: function (post) {
                        let tags = post.metadata.tags;
                        if (tags) {
                            tags = tags.slice(0, 7);
                            return tags.join(', ');
                        }

                        return '';
                    },
                    getLinkedTags: function(tags, asString) {
                        //<a v-bind:href="'/popular/' + x">{{ x }}</a>
                        let linkedTags = [];
                        if (tags) {
                            tags.forEach(function (t) {
                                linkedTags.push(`<a href="/popular/${t}">${t}</a>`)
                            });

                            if (asString) {
                                return linkedTags.join(', ');
                            }
                        }

                        return linkedTags;
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
                        updateUserSession();
                    },
                    onVote: function (err, result) {
                        updateUserSession();
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
                        return vestingCrea(this.state.user, this.state.props);
                    },
                    hasRewardBalance: function () {
                        let crea = Asset.parseString(this.state.user.reward_crea_balance);
                        let cbd = Asset.parseString(this.state.user.reward_cbd_balance);
                        let vests = Asset.parseString(this.state.user.reward_vesting_balance);
                        return crea.amount > 0 || cbd.amount > 0 || vests.amount > 0;
                    },
                    cancelPowerDown: function (event) {
                        cancelEventPropagation(event);

                        globalLoading.show = true;
                        let vests = new Vests(0);
                        crea.broadcast.withdrawVesting(this.session.account.keys.active.prv, this.session.account.username, vests.toFriendlyString(), function (err, result) {
                            globalLoading.show = false;
                            if (err) {
                                console.error(err);
                            } else {
                                updateUserSession();
                            }
                        });
                    },
                    navigateTo: function (event, tab) {
                        cancelEventPropagation(event);

                        updateUrl('/@' + this.state.user.name + '/' + tab);
                        this.navbar.section = tab;
                    },
                    isUserProfile: function () {
                        if (this.session) {
                            return this.session.account.username === state.user.name;
                        }

                        return false;
                    },
                    onLoadAvatar: function (event) {
                        let files = event.target.files;
                        if (files.length > 0) {
                            globalLoading.show = true;
                            let that = this;
                            let file = files[0];

                            let maximumSize = CONSTANTS.FILE_MAX_SIZE[file.type.toUpperCase().split('/')[0]];

                            uploadToIpfs(files[0], maximumSize, function (err, file) {
                                globalLoading.show = false;
                                if (err) {
                                    console.error(err);
                                } else {
                                    Vue.set(that.profile, 'avatar', file);
                                }
                            });
                        }
                    },
                    loadAvatar: function (event) {
                        cancelEventPropagation(event);

                        $('#profile-edit-input-avatar').click();
                    },
                    suggestPassword: function() {
                        this.changePass.newPass = 'P' + crea.formatter.createSuggestedPassword();
                    },
                    claimRewards: claimRewards,
                    sendAccountUpdate: sendAccountUpdate,
                    changePassword: function () {
                        let that = this;

                        let setError = function (error) {
                            that.changePass.error = error;
                            globalLoading.show = false;
                        };

                        globalLoading.show = true;
                        //Check current password
                        if (this.changePass.oldPass) {

                            //Check if passwords match
                            if (this.changePass.newPass && this.changePass.newPass === this.changePass.matchedPass) {

                                //Check radio inputs
                                if (this.changePass.checkedLostPass && this.changePass.checkedStoredPass) {
                                    let session = Session.create(this.changePass.username, this.changePass.oldPass);

                                    //Check if current is valid
                                    session.login(function (err, result) {
                                        if (err) {
                                            if (err === Errors.USER_LOGIN_ERROR) {
                                                setError(that.lang.CHANGE_PASSWORD.ERROR_CURRENT_PASSWORD);
                                            }
                                        } else {
                                            //Current pass is valid

                                            let keys = Account.generate(that.changePass.username, that.changePass.newPass).keys;

                                            sendAccountUpdate(keys, function (err, result) {
                                                let s = Session.getAlive();
                                                if (s) {
                                                    s.logout();
                                                    goTo('/');
                                                }
                                            });
                                        }
                                    });

                                } else {
                                    setError(that.lang.CHANGE_PASSWORD.ERROR_CONDITIONS);
                                }

                            } else {
                                setError(that.lang.CHANGE_PASSWORD.ERROR_MATCHED_PASSWORDS);
                            }

                        } else {
                            setError(that.lang.CHANGE_PASSWORD.ERROR_CURRENT_PASSWORD);
                        }

                    }
                }
            });
        } else {
            console.log('Updating data');
            profileContainer.state = state;
            profileContainer.session = session;
            profileContainer.account = account;
            profileContainer.filter = usernameFilter;
            profileContainer.profile = state.user.metadata;
            profileContainer.navbar.section = navSection;
            profileContainer.changePass.username = session ? session.account.username : null;
        }

        profileContainer.$forceUpdate();
        creaEvents.emit('crea.dom.ready');
    }

    /**
     *
     * @param state
     * @param {Session} session
     */
    function setUpModals(state, session) {
        if (session && session.account.username === state.user.name) {
            updateModalSendView(state, session);
            updateModalDeEnergize(state, session);
        }
    }
    function setUpRewards(rewardView, session, state) {

        let rewardType = rewardView.replace('s', '').replace('-', '_');

        let rewards = {
            rewards24Vests: 0,
            rewardsWeekVests: 0,
            totalRewardsVests: 0,
            rewards24Crea: 0,
            rewardsWeekCrea: 0,
            totalRewardsCrea: 0,
            rewards24CBD: 0,
            rewardsWeekCBD: 0,
            totalRewardsCBD: 0
        };

        const today = new Date();
        const oneDay = 86400 * 1000;
        const yesterday = new Date(today.getTime() - oneDay).getTime();
        const lastWeek = new Date(today.getTime() - 7 * oneDay).getTime();

        let firstDate, finalDate;
        let rewardsOp = [];
        state.user.transfer_history.forEach(function (item) {

            if (item[1].op[0] === 'author_reward' && rewardType === 'author_reward') {

                if (!finalDate) {
                    finalDate = new Date(item[1].timestamp).getTime();
                }

                firstDate = new Date(item[1].timestamp).getTime();

                const vest = Asset.parseString(item[1].op[1].vesting_payout);
                const crea = Asset.parseString(item[1].op[1].crea_payout);
                const cbd = Asset.parseString(item[1].op[1].cbd_payout);

                if (firstDate > lastWeek) {
                    if (firstDate > yesterday) {
                        rewards.rewards24Vests += vest.amount;
                        rewards.rewards24Crea += crea.amount;
                        rewards.rewards24CBD += cbd.amount;
                    }

                    rewards.rewardsWeekVests += vest.amount;
                    rewards.rewardsWeekCrea += crea.amount;
                    rewards.rewardsWeekCBD += cbd.amount;
                }

                rewards.totalRewardsVests += vest.amount;
                rewards.totalRewardsCrea += crea.amount;
                rewards.totalRewardsCBD += cbd.amount;

                rewardsOp.push(item);
            } else if (item[1].op[0] === 'curation_reward' && rewardType === 'curation_reward') {

                if (!finalDate) {
                    finalDate = new Date(item[1].timestamp).getTime();
                }

                firstDate = new Date(item[1].timestamp).getTime();

                const vest = Asset.parseString(item[1].op[1].reward);

                if (firstDate > lastWeek) {
                    if (firstDate > yesterday) {
                        rewards.rewards24Vests += vest.amount;
                    }

                    rewards.rewardsWeekVests += vest.amount;
                }

                rewards.totalRewardsVests += vest.amount;

                rewardsOp.push(item);
            }
        });


        if (!rewardsContainer[rewardView]) {
            rewardsContainer[rewardView] = new Vue({
                el: '#profile-' + rewardView,
                data: {
                    lang: lang,
                    session: session,
                    state: state,
                    rewards: rewards,
                    rewardsOp: rewardsOp
                },
                methods: {
                    vestsToCgy: function (vests) {
                        return vestsToCgy(this.state, vests);
                    },
                    parseAsset: Asset.parse,
                    formatTime: function (date) {
                        return moment(date).format('DD MMM HH:MM')
                    }
                }
            })
        } else {
            rewardsContainer[rewardView].session = session;
            rewardsContainer[rewardView].state = state;
            rewardsContainer[rewardView].rewards = rewards;
            rewardsContainer[rewardView].rewardsOp = rewardsOp;
        }
    }

    /**
     *
     * @param {Session} session
     */
    function fetchRewards(session) {

        let username = getPathPart().replace('@', '');

        fetchUserState(username, 'transfers', function (err, state) {
            if (err) {
                console.error(err);
            } else {
                setUpRewards('author-rewards', session, state);
                setUpRewards('curation-rewards', session, state);
            }
        })
    }

    /**
     *
     * @param state
     * @param session
     * @param account
     * @param usernameFilter
     */
    function detectNav(state, session, account, usernameFilter) {
        let nav = getPathPart(1);
        let walletNav = 'balances';

        if (!nav || nav.isEmpty()) {
            nav = 'projects';
        }

        switch (nav) {
            case 'balances':
            case 'passwords':
            case 'permissions':
                walletNav = nav;
                nav = 'wallet';
        }

        nav = nav.toLowerCase();

        updateProfileView(state, session, account, usernameFilter, nav, walletNav);
        fetchRewards(session);
    }

    function sendAccountUpdate(keys, callback) {
        let session = Session.getAlive();

        if (session) {
            let metadata = profileContainer.profile;
            metadata.tags = $('#profile-edit-tags').val().split(' ');
            metadata = jsonstring(metadata);

            if (!keys) {
                keys = session.account.keys;
            }

            crea.broadcast.accountUpdate(session.account.keys.owner.prv, session.account.username,
                createAuth(keys.owner.pub), createAuth(keys.active.pub),
                createAuth(keys.posting.pub), keys.memo.pub, metadata,
                function (err, data) {
                    globalLoading.show = false;
                    if (err) {
                        console.error(err);
                        if (callback) {
                            callback(err);
                        }
                    } else {
                        updateUserSession();
                        if (callback) {
                            callback(null, data);
                        }
                    }
                }
            )
        } else {
            globalLoading.show = false;
            if (callback) {
                callback(Errors.USER_NOT_LOGGED);
            }
        }

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
                        } else if (h.op.type == 'transfer_to_savings_operation') {
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
                        } else if (h.op.type == 'curation_reward_operation') {
                            addIfNotExists(h.op.value.curator);
                            addIfNotExists(h.op.value.comment_author);
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
     * @param {string|Function} view
     * @param {Function} callback
     */
    function fetchUserState(username, view = null, callback = null) {
        let stateUrl;
        if (!username.startsWith('/@')) {
            stateUrl = '/@' + username;
        } else {
            stateUrl = username;
        }

        if (view) {
            if (typeof view === 'string') {
                stateUrl = stateUrl + '/' + view;
            } else if (typeof view === 'function') {
                callback = view;
            }
        }

        crea.api.getState(stateUrl, function (err, state) {
            if (err) {
                console.error(err);
            } else  {
                let accounts = Object.keys(state.accounts);

                accounts.forEach(function (k) {
                    state.accounts[k].metadata = jsonify(state.accounts[k].json_metadata);
                    state.accounts[k].metadata.avatar = state.accounts[k].metadata.avatar || {};
                });

                if (state.accounts[username]) {
                    state.user = state.accounts[username];
                    crea.formatter.estimateAccountValue(state.user)
                        .then(function (value) {
                            state.user.estimate_account_value = value;
                        });
                }

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

    function handleView(session, account) {
        let profileName = getPathPart();
        profileName = profileName.replace('@', '');
        if (profileName) {
            fetchHistory(profileName);
            fetchUserState(profileName, function (err, state) {
                if (err) {
                    console.error(err);
                } else {
                    detectNav(state, session, account, profileName);
                    setUpModals(state, session);
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
                    updateUserSession();
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
                case CONSTANTS.TRANSFER.TRANSFER_FROM_SAVINGS_CREA:
                case CONSTANTS.TRANSFER.TRANSFER_FROM_SAVINGS_CBD:
                    crea.broadcast.transferFromSavings(wif, from, parseInt(new Date().getTime() / 1000), to, amount, memo, callback);
                    break;
                case CONSTANTS.TRANSFER.TRANSFER_TO_VESTS:
                    crea.broadcast.transferToVesting(wif, from, to, amount, callback);
                    break;
            }
        } else if(callback) {
            callback(Errors.USER_NOT_LOGGED);
        }
    }

    function handleSession(session, account) {
        if (session) {
            account.user.cgy_balance = '0.000 ' + apiOptions.symbol.CGY;
        }

        handleView(session, account);
    }

    creaEvents.on('crea.session.login', handleSession);

    creaEvents.on('crea.session.update', handleSession);

})();
