"use strict";

/**
 * Created by ander on 25/09/18.
 */

(function () {
    var profileContainer;
    var rewardsContainer = {};
    var blockedContainer;
    var followingContainer;
    var followerContainer;
    var walletModalSend;
    var walletModalDeEnergize;
    var defaultModalConfig;
    var lastPage = 1;

    function updateModalDeEnergize(state, session) {
        console.log('Modal De-Energize', jsonify(jsonstring(state)));
        var vestsCrea = parseFloat(vestingCrea(state.user, state.props).toPlainString(null, false));
        var delegatedVesting = parseFloat(delegatedCrea(state.user, state.props).toPlainString(null, false));
        var maxPowerDown = vestsCrea - delegatedVesting;
        var withdrawn = vestsToCgy(state, new Vests(state.user.withdrawn).toFriendlyString(null, false), apiOptions.nai.CREA);
        var toWithdraw = vestsToCgy(state, new Vests(state.user.to_withdraw).toFriendlyString(null, false), apiOptions.nai.CREA);
        var withdrawNote = '';

        if (toWithdraw.amount - withdrawn.amount > 0) {
            withdrawNote = String.format(lang.WALLET.DE_ENERGIZE_TEXT, toWithdraw.toFriendlyString(null, false), withdrawn.toFriendlyString(null, false));
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
                    onAmount: function onAmount(amount) {
                        amount += 0.0001;
                        var asset = Asset.parse({
                            amount: amount,
                            nai: apiOptions.nai.CREA
                        });
                        //this.finalAmount = parseFloat(asset.toPlainString(null, false));
                        this.amountByWeek = amount < 0.001 ? '' : String.format(this.lang.WALLET.DE_ENERGIZE_AMOUNT_BY_WEEK, asset.divide(8).toFriendlyString(null, false));
                    },
                    onManualChange: function onManualChange(event) {
                        if (event) {
                            var amount = event.target.valueAsNumber;

                            if (isNaN(amount)) {
                                amount = 0;
                            }

                            //this.sliderValue = amount;
                            this.onAmount(amount);
                        }
                    },
                    hideModalDeEnergize: function hideModalDeEnergize(event) {
                        cancelEventPropagation(event);
                        hideModal($('#wallet-de-energize').parent());
                    },
                    makeDeEnergize: function makePowerDown(event, amount) {
                        cancelEventPropagation(event);
                        var that = this;
                        var username = this.session.account.username;
                        requireRoleKey(username, 'active', function (activeKey) {
                            globalLoading.show = true;
                            var finalAmount = that.finalAmount + ' CREA';
                            console.log(finalAmount);
                            var vests = cgyToVests(that.state, finalAmount);
                            crea.broadcast.withdrawVesting(activeKey, username, vests.toFriendlyString(null, false), function (err, result) {
                                globalLoading.show = false;

                                if (!catchError(err)) {
                                    that.hideModalDeEnergize();
                                    updateUserSession();
                                }
                            });
                        });
                    }
                }
            });
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
                    toError: false
                },
                mounted: function mounted() {
                    var that = this;
                    $('#wallet-send').on('modalClosed.modals.mr', function () {
                        that.clearFields();
                    });
                },
                methods: {
                    shouldShowMemo: function shouldShowMemo() {
                        var avoidMemoOps = ['transfer_to_vests', 'transfer_to_savings_crea', 'transfer_to_savings_cbd'];
                        return !avoidMemoOps.includes(this.config.op);
                    },
                    cancelSend: function cancelSend(event) {
                        cancelEventPropagation(event);
                        this.config.confirmed = false;
                    },
                    hideModalSend: function hideModalSend(event) {
                        cancelEventPropagation(event);
                        hideModal('#wallet-send');
                        this.clearFields();
                    },
                    clearFields: function clearFields() {
                        //Clear fields
                        this.amount = 0;
                        this.memo = '';
                        this.config = clone(defaultModalConfig);
                    },
                    useTotalAmount: function useTotalAmount(event) {
                        cancelEventPropagation(event);
                        this.amount = this.config.total_amount.toPlainString();
                    },
                    sendCrea: function sendCrea() {
                        if (this.toError || !this.amount) {//TODO: SHOW ERRORS
                        } else if (this.config.confirmed) {
                            var that = this;
                            var amountData = {
                                amount: that.amount,
                                nai: that.config.nai.toLowerCase(),
                                round: true
                            };
                            var amount = Asset.parse(amountData).toFriendlyString(null, false);
                            requireRoleKey(this.session.account.username, 'active', function (activeKey) {
                                globalLoading.show = true;
                                console.log('Key:', activeKey, that.config.op);
                                transfer(activeKey, that.config.op, that.session, that.config.to, amount, that.memo, function (err, result) {
                                    globalLoading.show = false;

                                    if (!catchError(err)) {
                                        if (result) {
                                            updateUserSession();
                                            that.hideModalSend();
                                        }
                                    }
                                });
                            });
                        } else {
                            this.config.confirmed = true;
                            this.config.button = this.lang.BUTTON.SEND;
                        }
                    },
                    validateDestiny: function validateDestiny(event) {
                        var username = event.target.value;

                        if (!crea.utils.validateAccountName(username)) {
                            var accounts = [username];
                            console.log("Checking", accounts);
                            var that = this;
                            crea.api.lookupAccountNames(accounts, function (err, result) {
                                if (err) {
                                    console.error(err);
                                    that.toError = true;
                                } else {
                                    that.toError = result[0] == null;
                                }
                            });
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


    function updateProfileView(state, session, account, usernameFilter) {
        var navSection = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'projects';
        var walletSection = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 'balance';
        //console.log('Updating profile', jsonify(jsonstring(account)), jsonify(jsonstring(state)));
        var withdrawingSavings = state.user ? state.user.savings_withdraw_requests : 0;

        var nextDeEnergize = null;
        var savingsWithdrawNote = null;

        if (state.user.to_withdraw > 0 && session && state.user.name === session.account.username) {
            var date = toLocaleDate(state.user.next_vesting_withdrawal);
            if (date.getTime() > 0) {
                nextDeEnergize = String.format(lang.WALLET.NEXT_DE_ENERGIZE, toLocaleDate(state.user.next_vesting_withdrawal)).fromNow();
            }
        }

        if (withdrawingSavings > 0) {
            savingsWithdrawNote = String.format(lang.WALLET.SAVINGS_WITHDRAWAL_TEXT, withdrawingSavings);
        }

        console.log(clone(state));
        if (!profileContainer) {
            profileContainer = new Vue({
                el: '#profile-container',
                data: {
                    CONSTANTS: CONSTANTS,
                    lang: lang,
                    isoLangs: isoLangs,
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
                    blocked: {},
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
                    savingsWithdrawNote: savingsWithdrawNote,
                    simpleView: false //No used, but is needed
                },
                updated: function updated() {
                    var t = $('#wallet-tabs').prev();

                    if (t.is(':empty')) {
                        t.remove();
                    }

                    var inputTags = $('#profile-edit-tags');
                    inputTags.tagsinput({
                        maxTags: CONSTANTS.MAX_TAGS,
                        maxChars: CONSTANTS.TEXT_MAX_SIZE.TAG,
                        delimiter: ' '
                    });

                    if (this.profile.tags) {
                        this.profile.tags.forEach(function (t) {
                            inputTags.tagsinput('add', t);
                        });
                    }
                },
                methods: {
                    isFeed: function () {
                        return false; //Profile page never will the feed page
                    },
                    getDefaultAvatar: R.getAvatar,
                    toUrl: toUrl,
                    hidePrivKey: function hidePrivKey(auth) {
                        this.showPriv[auth] = false;
                    },
                    getPrivKey: function getPrivKey(auth) {
                        var that = this;
                        var username = this.session ? this.session.account.username : '';
                        requireRoleKey(username, auth, function (authKey) {
                            that.showPriv[auth] = authKey;
                        });
                    },
                    getKey: function getKey(auth) {
                        if (this.showPriv[auth]) {
                            return this.showPriv[auth];
                        } else if (auth === 'memo') {
                            return state.user['memo_key'];
                        } else {
                            return state.user[auth].key_auths[0][0];
                        }
                    },
                    prepareModal: function prepareModal(op) {
                        var config;

                        switch (op) {
                            case 'transfer_crea':
                                config = {
                                    title: this.lang.WALLET.TRANSFER_CREA_TITLE,
                                    text: this.lang.WALLET.TRANSFER_CREA_TEXT,
                                    button: this.lang.BUTTON.CONFIRM,
                                    nai: apiOptions.symbol.CREA,
                                    total_amount: Asset.parseString(this.state.user.balance)
                                };
                                break;

                            case 'transfer_to_savings_crea':
                                config = {
                                    title: this.lang.WALLET.TRANSFER_TO_SAVINGS_TITLE,
                                    text: this.lang.WALLET.TRANSFER_TO_SAVINGS_TEXT,
                                    button: this.lang.BUTTON.TRANSFER,
                                    nai: apiOptions.symbol.CREA,
                                    total_amount: Asset.parseString(this.state.user.balance),
                                    to: this.session.account.username,
                                    disableTo: true
                                };
                                break;

                            case 'transfer_to_savings_cbd':
                                config = {
                                    title: this.lang.WALLET.TRANSFER_TO_SAVINGS_TITLE,
                                    text: this.lang.WALLET.TRANSFER_TO_SAVINGS_TEXT,
                                    button: this.lang.BUTTON.TRANSFER,
                                    nai: apiOptions.symbol.CBD,
                                    total_amount: Asset.parseString(this.state.user.cbd_balance),
                                    to: this.session.account.username,
                                    disableTo: true
                                };
                                break;

                            case 'transfer_from_savings_cbd':
                                config = {
                                    title: this.lang.WALLET.TRANSFER_FROM_SAVINGS_TITLE_CBD,
                                    text: this.lang.WALLET.TRANSFER_FROM_SAVINGS_TEXT,
                                    button: this.lang.BUTTON.TRANSFER,
                                    nai: apiOptions.symbol.CBD,
                                    total_amount: Asset.parseString(this.state.user.savings_cbd_balance)
                                };
                                break;

                            case 'transfer_from_savings_crea':
                                config = {
                                    title: this.lang.WALLET.TRANSFER_FROM_SAVINGS_TITLE_CREA,
                                    text: this.lang.WALLET.TRANSFER_FROM_SAVINGS_TEXT,
                                    button: this.lang.BUTTON.TRANSFER,
                                    nai: apiOptions.symbol.CREA,
                                    total_amount: Asset.parseString(this.state.user.savings_balance)
                                };
                                break;

                            case 'transfer_to_vests':
                                config = {
                                    title: this.lang.WALLET.CONVERT_CGY_TITLE,
                                    text: this.lang.WALLET.CONVERT_CGY_TEXT,
                                    button: this.lang.BUTTON.TRANSFER,
                                    nai: apiOptions.symbol.CREA,
                                    total_amount: Asset.parseString(this.state.user.balance),
                                    to: this.session.account.username,
                                    disableTo: true
                                };
                                break;

                            case 'transfer_cbd':
                                config = {
                                    title: this.lang.WALLET.TRANSFER_CBD_TITLE,
                                    text: this.lang.WALLET.TRANSFER_CBD_TEXT,
                                    button: this.lang.BUTTON.SEND,
                                    nai: apiOptions.symbol.CBD,
                                    total_amount: Asset.parseString(this.state.user.cbd_balance)
                                };
                                break;
                        }

                        config.op = op;
                        walletModalSend.config = Object.assign(clone(defaultModalConfig), config);
                    },
                    canWithdraw: function canWithdraw() {
                        return this.session && this.session.account.username == state.user.name;
                    },
                    parseAsset: function parseAsset(asset) {
                        var maxDecimals = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
                        var abbr = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
                        return Asset.parse(asset).toFriendlyString(maxDecimals, abbr);
                    },
                    assetPart: function assetPart(asset, part) {
                        asset = Asset.parse(asset);

                        switch (part) {
                            case 'int':
                                return asset.toPlainString(null, false).split('.')[0];
                            case 'dec':
                                return asset.toPlainString(null, false).split('.')[1];
                            case 'sym':
                                return asset.asset.symbol;
                            default:
                                return Asset.parse(asset).toFriendlyString(null, true);
                        }
                    },
                    openPost: function (post, event) {
                        cancelEventPropagation(event);
                        creaEvents.emit('navigation.post.data', post, this.state, '', 'profile');
                        showModal('#modal-post');
                    },
                    showProfile: showProfile,
                    getJoinDate: function getJoinDate() {
                        var date = new Date(this.state.user.created);
                        return this.lang.PROFILE.JOINED + moment(date.getTime(), 'x').format('MMMM YYYY');
                    },
                    getBuzzClass: function getBuzzClass(account) {
                        var buzzClass = {};
                        var levelName = account.buzz.level_name;

                        buzzClass[levelName] = true;
                        return buzzClass;
                    },
                    getFeaturedImage: function getFeaturedImage(post) {
                        var featuredImage = post.metadata.featuredImage;

                        if (featuredImage && featuredImage.hash) {
                            return {
                                url: apiOptions.ipfs + featuredImage.hash
                            };
                        } else if (featuredImage && featuredImage.url) {
                            return featuredImage;
                        }

                        return {};
                    },
                    getTags: function getTags(post) {
                        var tags = post.metadata.tags;
                        var linkedTags = []; //Select only 8 first tags

                        tags = tags.slice(0, 7);
                        tags.forEach(function (t) {
                            linkedTags.push('<a href="/search?page=1&query=' + encodeURIComponent(t) + '">' + t + '</a>');
                        });
                        return linkedTags.join(', ');
                    },
                    getLinkedTags: function getLinkedTags(tags, asString) {
                        //<a v-bind:href="'/popular/' + x">{{ x }}</a>
                        var linkedTags = [];

                        if (tags) {
                            tags.forEach(function (t) {
                                linkedTags.push('<a href="/search?page=1&query=' + encodeURIComponent(t) + '">' + t + '</a>');
                            });

                            if (asString) {
                                return linkedTags.join(', ');
                            }
                        }

                        return linkedTags;
                    },
                    hasPaid: function hasPaid(post) {
                        var now = moment();
                        var payout = toLocaleDate(post.cashout_time);
                        return now.isAfter(payout);
                    },
                    getPayoutPostDate: function getPayoutPostDate(post) {
                        var date = toLocaleDate(post.cashout_time);

                        if (this.hasPaid(post)) {
                            date = toLocaleDate(post.last_payout);
                        }

                        return date.fromNow();
                    },
                    hasPromotion: function hasPromotion(post) {
                        var amount = Asset.parseString(post.promoted);
                        return amount.amount > 0;
                    },
                    getPromotion: function getPromotion(post) {
                        var amount = Asset.parseString(post.promoted);
                        return '$ ' + amount.toPlainString();
                    },
                    parseJSON: function parseJSON(strJson) {
                        if (strJson && strJson.length > 0) {
                            try {
                                return JSON.parse(strJson);
                            } catch (e) {
                                catchError(e);
                            }
                        }

                        return {};
                    },
                    getPayout: function getPayout(post) {
                        var amount = Asset.parseString(post.pending_payout_value);

                        if (this.hasPaid(post)) {
                            amount = Asset.parseString(post.total_payout_value);
                            amount = amount.add(Asset.parseString(post.curator_payout_value));
                        } //amount.amount = parseInt(amount.amount / 1000000000);


                        return '$ ' + amount.toPlainString();
                    },
                    getPendingPayouts: function getPendingPayouts(post) {
                        var PRICE_PER_CREA = Asset.parse({
                            amount: Asset.parseString(this.state.feed_price.base).toFloat() / Asset.parseString(this.state.feed_price.quote).toFloat(),
                            nai: 'cbd'
                        });
                        var CBD_PRINT_RATE = this.state.props.cbd_print_rate;
                        var CBD_PRINT_RATE_MAX = 10000;
                        var payout = Asset.parseString(post.pending_payout_value); //payout.amount = parseInt(payout.amount / 1000000000);

                        var PENDING_PAYOUT = payout;
                        var PERCENT_CREA_DOLLARS = post.percent_crea_dollars / 20000;
                        var PENDING_PAYOUT_CBD = Asset.parse({
                            amount: PENDING_PAYOUT.toFloat() * PERCENT_CREA_DOLLARS,
                            nai: 'cbd'
                        });
                        var PENDING_PAYOUT_CGY = Asset.parse({
                            amount: NaNOr(((PENDING_PAYOUT.toFloat() - PENDING_PAYOUT_CBD.toFloat()) / PRICE_PER_CREA.toFloat()), 0),
                            nai: 'cgy'
                        });
                        var PENDING_PAYOUT_PRINTED_CBD = Asset.parse({
                            amount: NaNOr((PENDING_PAYOUT_CBD.toFloat() * (CBD_PRINT_RATE / CBD_PRINT_RATE_MAX)), 0),
                            nai: 'cbd'
                        });
                        var PENDING_PAYOUT_PRINTED_CREA = Asset.parse({
                            amount: NaNOr(((PENDING_PAYOUT_CBD.toFloat() - PENDING_PAYOUT_PRINTED_CBD.toFloat()) / PRICE_PER_CREA.toFloat()), 0),
                            nai: 'crea'
                        });

                        return '(' + PENDING_PAYOUT_PRINTED_CBD.toFriendlyString(null, false) + ', ' + PENDING_PAYOUT_PRINTED_CREA.toFriendlyString(null, false) + ', ' + PENDING_PAYOUT_CGY.toFriendlyString(null, false);
                    },
                    dateFromNow: function dateFromNow(date) {
                        return toLocaleDate(date).fromNow();
                    },
                    getFutureDate: function getFutureDate(date) {
                        return toLocaleDate(date).fromNow();
                    },
                    onFollow: function onFollow(err, result) {
                        //Keep same scroll page
                        --lastPage;
                        updateUserSession();
                    },
                    onVote: function onVote(err, result, post) {
                        catchError(err);
                        //updateUserSession();
                        var that = this;
                        getDiscussion(post.author, post.permlink, function (err, result) {
                            if (!err) {
                                var updatedPost = parsePost(result);
                                that.state.content[updatedPost.link] = updatedPost;
                                that.$forceUpdate();
                            }
                        })
                    },
                    getLicense: function getLicense(flag) {
                        if (flag) {
                            return License.fromFlag(flag);
                        }

                        return new License(LICENSE.FREE_CONTENT);
                    },
                    getCGYReward: function getCGYReward() {
                        var reward = parseFloat(this.state.user.reward_vesting_crea.split(' ')[0]);
                        return reward + ' CGY';
                    },
                    getCGYBalance: function getCGYBalance() {
                        return vestingCrea(this.state.user, this.state.props);
                    },
                    getDelegatedCGY: function () {
                        return receivedDelegatedCGY(this.state.user, this.state.props);
                    },
                    hasRewardBalance: function hasRewardBalance() {
                        var crea = Asset.parse(this.state.user.reward_crea_balance);
                        var cbd = Asset.parse(this.state.user.reward_cbd_balance);
                        var vests = Asset.parse(this.state.user.reward_vesting_balance);
                        return crea.amount > 0 || cbd.amount > 0 || vests.amount > 0;
                    },
                    cancelPowerDown: function cancelPowerDown(event) {
                        cancelEventPropagation(event);
                        var username = this.session.account.username;
                        requireRoleKey(username, 'active', function (activeKey) {
                            globalLoading.show = true;
                            var vests = new Vests(0);
                            crea.broadcast.withdrawVesting(activeKey, username, vests.toFriendlyString(null, false), function (err, result) {
                                globalLoading.show = false;

                                if (!catchError(err)) {
                                    updateUserSession();
                                }
                            });
                        });
                    },
                    navigateTo: function navigateTo(event, tab) {
                        cancelEventPropagation(event);
                        updateUrl('/@' + this.state.user.name + '/' + tab);
                        this.navbar.section = tab;
                    },
                    isUserProfile: function isUserProfile() {
                        if (this.session) {
                            return this.session.account.username === state.user.name;
                        }

                        return false;
                    },
                    onLoadAvatar: function onLoadAvatar(event) {
                        var files = event.target.files;

                        if (files.length > 0) {
                            globalLoading.show = true;
                            var that = this;
                            var file = files[0];
                            var maximumSize = CONSTANTS.FILE_MAX_SIZE.PROFILE[file.type.toUpperCase().split('/')[0]];
                            resizeImage(file, function (resizedImage) {
                                uploadToIpfs(resizedImage, maximumSize, function (err, uploadedFile) {
                                    globalLoading.show = false;

                                    if (!catchError(err)) {
                                        Vue.set(that.profile, 'avatar', uploadedFile);
                                    }
                                });
                            });

                        }
                    },
                    loadAvatar: function loadAvatar(event) {
                        cancelEventPropagation(event);
                        $('#profile-edit-input-avatar').click();
                    },
                    suggestPassword: function suggestPassword() {
                        this.changePass.newPass = 'P' + crea.formatter.createSuggestedPassword();
                    },
                    claimRewards: claimRewards,
                    sendAccountUpdate: sendAccountUpdate,
                    ignoreUser: function (_ignoreUser) {
                        function ignoreUser() {
                            return _ignoreUser.apply(this, arguments);
                        }

                        ignoreUser.toString = function () {
                            return _ignoreUser.toString();
                        };

                        return ignoreUser;
                    }(function () {
                        ignoreUser(this.state.user.name, true, function (err, result) {
                            updateUserSession();
                        });
                    }),
                    changePassword: function changePassword() {
                        var that = this;

                        var setError = function setError(error) {
                            that.changePass.error = error;
                            globalLoading.show = false;
                        };

                        if (this.changePass.oldPass) {
                            //Check if passwords match
                            if (this.changePass.newPass && this.changePass.newPass === this.changePass.matchedPass) {
                                //Check radio inputs
                                if (this.changePass.checkedLostPass && this.changePass.checkedStoredPass) {
                                    var _session = Session.create(this.changePass.username, this.changePass.oldPass); //Check if current is valid


                                    _session.login(function (err, result) {
                                        if (err) {
                                            if (err === Errors.USER_LOGIN_ERROR) {
                                                setError(that.lang.CHANGE_PASSWORD.ERROR_CURRENT_PASSWORD);
                                            }
                                        } else {
                                            //Current pass is valid
                                            var keys = Account.generate(that.changePass.username, that.changePass.newPass, DEFAULT_ROLES).keys;
                                            sendAccountUpdate(null, keys, function (err, result) {
                                                var s = Session.getAlive();

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
        var rewardType = rewardView.replace('s', '').replace('-', '_');
        var rewards = {
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
        var today = new Date();
        var oneDay = 60 * 60 * 24 * 1000;
        var yesterday = new Date(today.getTime() - oneDay).getTime();
        var lastWeek = new Date(today.getTime() - 7 * oneDay).getTime();
        var firstDate, finalDate;
        var rewardsOp = [];

        state.user.transfer_history.sort(function (r1, r2) {
            var d1 = Date.fromUTCString(r1[1].timestamp);
            var d2 = Date.fromUTCString(r2[1].timestamp);
            return d2.getTime() - d1.getTime();
        });

        state.user.transfer_history.forEach(function (item) {
            if (item[1].op[0] === 'author_reward' && rewardType === 'author_reward') {
                if (!finalDate) {
                    finalDate = new Date(item[1].timestamp).getTime();
                }

                firstDate = new Date(item[1].timestamp).getTime();
                var vest = Asset.parseString(item[1].op[1].vesting_payout);

                var _crea = Asset.parseString(item[1].op[1].crea_payout);

                var cbd = Asset.parseString(item[1].op[1].cbd_payout);

                if (firstDate > lastWeek) {
                    if (firstDate > yesterday) {
                        rewards.rewards24Vests += vest.toFloat();
                        rewards.rewards24Crea += _crea.toFloat();
                        rewards.rewards24CBD += cbd.toFloat();
                    }

                    rewards.rewardsWeekVests += vest.toFloat();
                    rewards.rewardsWeekCrea += _crea.toFloat();
                    rewards.rewardsWeekCBD += cbd.toFloat();
                }

                rewards.totalRewardsVests += vest.toFloat();
                rewards.totalRewardsCrea += _crea.toFloat();
                rewards.totalRewardsCBD += cbd.toFloat();
                rewardsOp.push(item);
            } else if (item[1].op[0] === 'curation_reward' && rewardType === 'curation_reward') {
                if (!finalDate) {
                    finalDate = new Date(item[1].timestamp).getTime();
                }

                firstDate = new Date(item[1].timestamp).getTime();

                var _vest = Asset.parseString(item[1].op[1].reward);

                if (firstDate > lastWeek) {
                    if (firstDate > yesterday) {
                        rewards.rewards24Vests += _vest.toFloat();
                    }

                    rewards.rewardsWeekVests += _vest.toFloat();
                }

                rewards.totalRewardsVests += _vest.toFloat();
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
                    vestsToCgy: function (_vestsToCgy) {
                        function vestsToCgy(_x) {
                            return _vestsToCgy.apply(this, arguments);
                        }

                        vestsToCgy.toString = function () {
                            return _vestsToCgy.toString();
                        };

                        return vestsToCgy;
                    }(function (vests) {
                        return vestsToCgy(this.state, vests);
                    }),
                    parseAsset: Asset.parse,
                    formatTime: function formatTime(date) {
                        return moment(date).format('DD MMM HH:MM');
                    }
                }
            });
        } else {
            rewardsContainer[rewardView].session = session;
            rewardsContainer[rewardView].state = state;
            rewardsContainer[rewardView].rewards = rewards;
            rewardsContainer[rewardView].rewardsOp = rewardsOp;
        }
    }

    function setUpBlocked(session, account, blocked) {
        if (!blockedContainer) {
            blockedContainer = new Vue({
                el: '#blocked-container',
                data: {
                    lang: lang,
                    session: session,
                    account: account,
                    blocked: blocked
                },
                methods: {
                    unlock: function unlock(user) {
                        ignoreUser(user, false, function (err, result) {
                            if (!catchError(err)) {
                                updateUserSession();
                            }
                        });
                    }
                }
            });
        } else {
            blockedContainer.session = session;
            blockedContainer.account = account;
            blockedContainer.blocked = blocked;
        }
    }

    function setUpFollowing(state, session, account, following) {
        if (!followingContainer) {
            followingContainer = new Vue({
                el: '#following-container',
                data: {
                    lang: lang,
                    state: state,
                    session: session,
                    account: account,
                    following: following
                },
                methods: {
                    onFollow: function onFollow() {
                        updateUserSession();
                    }
                }
            });
        } else {
            followingContainer.state = state;
            followingContainer.session = session;
            followingContainer.account = account;
            followingContainer.following = following;
        }
    }

    function setUpFollowers(state, session, account, follower) {
        if (!followerContainer) {
            followerContainer = new Vue({
                el: '#follower-container',
                data: {
                    lang: lang,
                    state: state,
                    session: session,
                    account: account,
                    follower: follower
                },
                methods: {
                    onFollow: function onFollow() {
                        updateUserSession();
                    }
                }
            });
        } else {
            followerContainer.state = state;
            followerContainer.session = session;
            followerContainer.account = account;
            followerContainer.follower = follower;
        }
    }
    /**
     *
     * @param {Session} session
     */


    function fetchRewards(session) {
        var username = getPathPart().replace('@', '');
        fetchUserState(username, 'transfers', function (err, state) {
            if (!catchError(err)) {
                setUpRewards('author-rewards', session, state);
                setUpRewards('curation-rewards', session, state);
            }
        });
    }

    function fetchBlockeds(session, account) {
        if (session) {
            crea.api.getFollowing(session.account.username, '', 'ignore', 1000, function (err, followings) {
                if (!catchError(err)) {
                    var accounts = [];
                    followings = followings.following;
                    followings.forEach(function (r) {
                        if (r.follower === session.account.username) {
                            if (!accounts.includes(r.following)) {
                                accounts.push(r.following);
                            }
                        }
                    }); //Get blocked accounts;

                    if (accounts.length) {
                        crea.api.getAccounts(accounts, function (err, blockeds) {
                            if (!catchError(err)) {
                                var data = {};

                                for (var x = 0; x < blockeds.length; x++) {
                                    var c = blockeds[x];
                                    c.metadata = jsonify(c.json_metadata);
                                    data[c.name] = c;
                                }

                                setUpBlocked(session, account, data);
                            }
                        });
                    } else {
                        //Not blockeds
                        console.log('Not blockeds');
                        setUpBlocked(session, account, {});
                    }
                }
            });
        }

    }

    function fetchFollowing(state, session, account) {
        var onFetchFollowing = function onFetchFollowing(accountState) {
            crea.api.getAccounts(accountState.user.followings, function (err, result) {
                if (!catchError(err)) {
                    var followings = {};
                    result.forEach(function (a) {
                        a.metadata = jsonify(a.json_metadata);
                        a.metadata.avatar = a.metadata.avatar || {};
                        followings[a.name] = a;
                    });
                    setUpFollowing(state, session, account, followings);
                }
            });
        };

        if (account && state.user.name === account.user.name) {
            onFetchFollowing(account);
        } else {
            crea.api.getFollowing(state.user.name, '', 'blog', 1000, function (err, result) {
                if (!catchError(err)) {
                    var followings = [];
                    result.following.forEach(function (f) {
                        followings.push(f.following);
                    });
                    state.user.followings = followings;
                    onFetchFollowing(state);
                }
            });
        }
    }

    function fetchFollowers(state, session, account) {
        var onFetchFollowers = function onFetchFollowers(accountState) {
            crea.api.getAccounts(accountState.user.followers, function (err, result) {
                if (!catchError(err)) {
                    var followers = {};
                    result.forEach(function (a) {
                        a.metadata = jsonify(a.json_metadata);
                        a.metadata.avatar = a.metadata.avatar || {};
                        followers[a.name] = a;
                    });
                    setUpFollowers(state, session, account, followers);
                }
            });
        };

        crea.api.getFollowers(state.user.name, '', 'blog', 1000, function (err, result) {
            if (!catchError(err)) {
                var followers = [];
                result.followers.forEach(function (f) {
                    followers.push(f.follower);
                });
                state.user.followers = followers;
                onFetchFollowers(state);
            }
        });
    }
    /**
     *
     * @param state
     * @param session
     * @param account
     * @param usernameFilter
     */


    function detectNav(state, session, account, usernameFilter) {
        var nav = getPathPart(null,1);
        var walletNav = 'balances';

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
        setUpModals(state, session);
        fetchHistory(state.user.name);
        fetchRewards(session);
        fetchBlockeds(session, account);
        fetchFollowing(state, session, account);
        fetchFollowers(state, session, account);
    }

    function sendAccountUpdate(event, keys, callback) {
        var lastUpdate = Date.fromUTCString(profileContainer.state.user.last_account_update);
        var now = new Date();
        var time = now.getTime() - lastUpdate.getTime();

        if (time >= CONSTANTS.ACCOUNT.UPDATE_THRESHOLD) {
            var session = Session.getAlive();

            if (session) {
                var metadata = profileContainer.profile;
                metadata.tags = $('#profile-edit-tags').val().split(' ');
                metadata = jsonstring(metadata);

                if (!keys) {
                    var user = profileContainer.state.user;
                    keys = {
                        memo: {
                            pub: user.memo_key
                        },
                        active: {
                            pub: user.active.key_auths[0][0]
                        },
                        posting: {
                            pub: user.posting.key_auths[0][0]
                        },
                        owner: {
                            pub: user.owner.key_auths[0][0]
                        }
                    };
                }

                console.log(keys);
                requireRoleKey(session.account.username, 'owner', function (ownerKey) {
                    globalLoading.show = true;
                    crea.broadcast.accountUpdate(ownerKey, session.account.username, createAuth(keys.owner.pub), createAuth(keys.active.pub), createAuth(keys.posting.pub), keys.memo.pub, metadata, function (err, data) {
                        globalLoading.show = false;

                        if (err) {
                            if (callback) {
                                callback(err);
                            }
                        } else {
                            updateUserSession();

                            if (callback) {
                                callback(null, data);
                            }
                        }
                    });
                });
            } else {
                globalLoading.show = false;

                if (callback) {
                    callback(Errors.USER_NOT_LOGGED);
                }
            }
        } else {
            //Show alert to avoid update
            var title = lang.ERROR.ACCOUNT_UPDATE_THRESHOLD_EXCEEDED.TITLE;
            var message = String.format(lang.ERROR.ACCOUNT_UPDATE_THRESHOLD_EXCEEDED.BODY, moment(lastUpdate).fromNow())
            showAlert(title, message);
        }
    }
    /**
     *
     * @param {string} username
     */


    function fetchHistory(username) {
        setTimeout(function () {
            crea.api.getAccountHistory(username, -1, 50, function (err, result) {
                if (!catchError(err)) {
                    result.history = result.history.reverse();
                    var accounts = [];
                    var history = [];
                    result.history.forEach(function (h) {
                        h = h[1];

                        var addIfNotExists = function addIfNotExists(account) {
                            if (account && accounts.indexOf(account) < 0) {
                                accounts.push(account);
                            }
                        };

                        if (h.op.type === 'transfer_operation') {
                            addIfNotExists(h.op.value.from);
                            addIfNotExists(h.op.value.to);
                        } else if (h.op.type === 'transfer_to_vesting_operation') {
                            addIfNotExists(h.op.value.from);
                            addIfNotExists(h.op.value.to);
                        } else if (h.op.type === 'transfer_to_savings_operation') {
                            addIfNotExists(h.op.value.from);
                            addIfNotExists(h.op.value.to);
                        } else if (h.op.type === 'vote_operation') {
                            addIfNotExists(h.op.value.voter);
                            addIfNotExists(h.op.value.author);
                        } else if (h.op.type === 'comment_operation') {
                            addIfNotExists(h.op.value.parent_author);
                            addIfNotExists(h.op.value.author);
                        } else if (h.op.type === 'producer_reward_operation') {
                            addIfNotExists(h.op.value.producer);
                        } else if (h.op.type === 'account_create_operation') {
                            addIfNotExists(h.op.value.creator);
                        } else if (h.op.type === 'curation_reward_operation') {
                            addIfNotExists(h.op.value.curator);
                            addIfNotExists(h.op.value.comment_author);
                        } else if (h.op.type === 'comment_download_operation') {
                            addIfNotExists(h.op.value.downloader);
                            addIfNotExists(h.op.value.comment_author);
                        }

                        history.push(h);
                    });
                    crea.api.getAccounts(accounts, function (err, result) {
                        if (err) {
                            console.error(err);
                        } else {
                            var opsAccounts = {};
                            accounts.forEach(function (u) {
                                for (var x = 0; x < result.length; x++) {
                                    if (u === result[x].name) {
                                        opsAccounts[u] = parseAccount(result[x]);
                                        break;
                                    }
                                }
                            });
                            profileContainer.history.data = history;
                            profileContainer.history.accounts = opsAccounts;
                        }
                    });
                }
            });
        });
    }
    /**
     *
     * @param {string} username
     * @param {string|Function} view
     * @param {Function} callback
     */


    function fetchUserState(username) {
        var view = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
        var stateUrl;

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
                if (callback) {
                    callback(err);
                }
            } else {
                if (state.accounts[username]) {
                    state.user = parseAccount(state.accounts[username]);
                }
                state.content = {};
                state.discussion_idx = {
                    '': {
                        profile: []
                    }
                };

                if (callback) {
                    callback(err, state);
                }
            }
        });
    }

    function handleView(session, account) {
        var profileName = getPathPart();
        profileName = profileName.replace('@', '');

        if (profileName) {
            var onState = function onState(err, state) {
                if (!catchError(err)) {
                    console.log(clone(state));

                    getProfileDiscussions(function (err, discussions) {
                        var accounts = Object.keys(state.accounts);
                        accounts.forEach(function (k) {
                            state.accounts[k] = parseAccount(state.accounts[k]);
                        });

                        if (state.accounts[profileName]) {
                            state.user = state.accounts[profileName];
                            crea.formatter.estimateAccountValue(state.user).then(function (value) {
                                state.user.estimate_account_value = value;
                            });
                        }

                        //Sort discussions
                        //Nodes return discussion ordered by last update
                        discussions.sort(function (k1, k2) {
                            var d1 = Date.fromUTCString(k1.created);
                            var d2 = Date.fromUTCString(k2.created);
                            return d2.getTime() - d1.getTime();
                        });

                        for (var x = 0; x < discussions.length; x++) {
                            var d = discussions[x];
                            var permlink = d.author + '/' + d.permlink;
                            state.content[permlink] = d;
                            state.discussion_idx[''].profile.push(permlink);

                        }

                        detectNav(state, session, account, profileName);
                    });
                }
            };

            fetchUserState(profileName, onState);
        }
    }

    function claimRewards(event) {
        if (event) {
            event.preventDefault();
        }

        var creaBalance = profileContainer.state.user.reward_crea_balance;
        var cbd = profileContainer.state.user.reward_cbd_balance;
        var cgy = profileContainer.state.user.reward_vesting_balance;
        requireRoleKey(profileContainer.session.account.username, 'posting', function (activeKey) {
            globalLoading.show = true;
            crea.broadcast.claimRewardBalance(activeKey, profileContainer.session.account.username, creaBalance, cbd, cgy, function (err, result) {
                globalLoading.show = false;

                if (!catchError(err)) {
                    updateUserSession();
                }
            });
        });
    }
    
    /**
     *
     * @param {string} wif
     * @param {string} op
     * @param {Session} session
     * @param {string} to
     * @param {string} amount
     * @param {string} [memo]
     * @param {Function} [callback]
     */
    function transfer(wif, op, session, to, amount, memo, callback) {
        if (typeof memo === 'function') {
            callback = memo;
            memo = '';
        }

        if (session) {
            var from = session.account.username;

            switch (op) {
                case CONSTANTS.TRANSFER.TRANSFER_CREA:
                case CONSTANTS.TRANSFER.TRANSFER_CBD:
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
        } else if (callback) {
            callback(Errors.USER_NOT_LOGGED);
        }
    }

    function handleSession(session, account) {
        var settingsPart = getPathPart(null, 1);
        settingsPart = settingsPart.toLowerCase() === 'settings';

        if (session) {
            if (settingsPart) {
                var username = getPathPart();
                if ('@' + session.account.username !== username) {
                    showProfile(username);
                    return;
                }
            }
            account.user.cgy_balance = '0.000 ' + apiOptions.symbol.CGY;

            if (session.account.username === account.user.name) {
                defaultModalConfig = {
                    op: 'transfer_crea',
                    title: lang.WALLET.TRANSFER_CREA_TITLE,
                    text: lang.WALLET.TRANSFER_CREA_TEXT,
                    button: lang.BUTTON.SEND,
                    total_amount: Asset.parseString('0.000 CREA').toFriendlyString(),
                    nai: apiOptions.symbol.CREA,
                    confirmed: false,
                    to: null,
                    disableTo: false
                };
            }
        } else if (settingsPart) {
            var username = getPathPart();
            showProfile(username);
            return;

        }

        handleView(session, account);
    }

    creaEvents.on('crea.session.login', handleSession);
    creaEvents.on('crea.session.update', function (session, account) {
        --lastPage;
        handleSession(session, account);
    });

    function getProfileDiscussions(callback) {
        if (!lastPage) {
            lastPage = 1;
        }

        var http = new HttpClient(apiOptions.apiUrl + '/creary/blog');
        http.when('done', function (response) {
            var data = jsonify(response).data;

            var posts = [];
            var count = data.length;

            var onPostData = function() {
                --count;
                if (count <= 0) {
                    if (callback) {
                        callback(null, posts);

                    }
                }
            };

            data.forEach(function (d) {
                var permlink = d.author + '/' + d.permlink;

                crea.api.getContent(d.author, d.permlink, function (err, result) {
                    if (err || result.author.length <= 0) {
                        console.error('Error getting', permlink, err);
                    } else {
                        var p = parsePost(result);
                        p.reblogged_by = d.reblogged_by;

                        posts.push(p);
                    }

                    onPostData();
                });
            });

            if (data.length === 0) {
                onPostData();
            } else {
                ++lastPage;
            }
        });

        http.when('fail', function (jqXHR, textStatus, errorThrown) {
            onScrollCalling = false;
            catchError(textStatus);
        });

        refreshAccessToken(function (accessToken) {
            http.headers = {
                Authorization: 'Bearer ' + accessToken
            };

            http.post({
                author: getPathPart().replace('@', ''),
                page: lastPage
            });
        });
    }

    var onScrollCalling;
    creaEvents.on('crea.scroll.bottom', function () {
        if (!onScrollCalling) {
            onScrollCalling = true;

            getProfileDiscussions(function (err, discussions) {

                //Remove first duplicate post
                //discussions.shift();

                //Sort discussions
                //Nodes return discussion ordered by last update
                discussions.sort(function (k1, k2) {
                    var d1 = Date.fromUTCString(k1.created);
                    var d2 = Date.fromUTCString(k2.created);
                    return d2.getTime() - d1.getTime();
                });


                for (var x = 0; x < discussions.length; x++) {
                    var d = discussions[x];

                    var permlink = d.author + '/' + d.permlink;
                    profileContainer.state.content[permlink] = d;
                    profileContainer.state.discussion_idx[''].profile.push(permlink);
                }

                profileContainer.state.discussions = profileContainer.state.discussion_idx[''].profile;
                profileContainer.$forceUpdate();
                onScrollCalling = false;

                creaEvents.emit('navigation.state.update', profileContainer.state);
            });
        }
    });

})();