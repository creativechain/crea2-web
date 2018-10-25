/**
 * Created by ander on 25/09/18.
 */

let profileContainer;
let walletModalSend;

(function () {
    function tags(element) {
        $('#' + element).tagsinput();
    }


    function updateModalSendView(state) {
        if (!walletModalSend) {
            walletModalSend = new Vue({
                el: '#wallet-send-crea',
                data: {
                    state: state,
                    lang: lang,
                    from: state.user.name,
                    to: '',
                    amount: 0,
                    memo: ''
                },
                methods: {
                    sendCrea: function () {
                        let amount = Asset.parseString(this.amount + ' CREA').toFriendlyString();
                        sendMoney(this.to, amount, this.memo, function (err, result) {
                            console.log(err, result);
                        })
                    }
                }
            });
        } else {
            walletModalSend.from = state.user.name;
        }
    }
    /**
     *
     * @param state
     * @param session
     * @param account
     * @param usernameFilter
     * @returns {License}
     */
    function updateProfileView(state, session, account, usernameFilter) {
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
                    navfilter: 'projects',
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
                mounted: function () {
                    $('#wallet-tabs').prev().remove();
                },
                updated: function () {
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
                    parseAsset: function (asset) {
                        return Asset.parse(asset).toFriendlyString();
                    },
                    openPost: function (post) {
                        window.location.href = '/post-view.php?url=' + post.url;
                    },
                    getJoinDate: function () {
                        let date = new Date(this.state.user.created);
                        return this.lang.PROFILE.JOINED + moment(date.getTime(), 'x').format('MMMM YYYY');
                    },
                    userHasVote: function (post) {
                        let session = this.session;

                        if (session) {
                            let activeVotes = post.active_votes;

                            for (let x = 0; x < activeVotes.length; x++) {
                                let vote = activeVotes[x];
                                if (session.account.username === vote.voter) {
                                    return true;
                                }
                            }
                        }

                        return false;
                    },
                    dateFromNow(date) {
                        date = new Date(date + 'Z');
                        return moment(date.getTime()).fromNow();
                    },
                    getFutureDate: function (date) {
                        if (typeof date === 'string') {
                            date += 'Z';
                        }

                        date = new Date(date);
                        return moment(date.getTime(), 'x').endOf('day').fromNow();
                    },
                    makeFollow: function (user) {
                        followUser(user, function (err, result) {
                            updateData(Session.getAlive());
                        })
                    },
                    makeVote: function (post) {
                        let filter = this.filter;
                        makeVote(post, function () {
                            updateData(Session.getAlive());
                        })
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

                        let energy = totalVestCrea * (vest / totalVests);
                        return Asset.parse({
                            amount: energy,
                            nai: apiOptions.nai.CREA
                        }).toFriendlyString();
                    },
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
        }
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

                            updateProfileView(state, session, userAccount, user);
                            updateModalSendView(state);
                        }
                    })
                }
            });
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
                    updateData(session);
                })

            } else {
                callback(Errors.USER_NOT_FOUND);
            }
        });
    }

    creaEvents.on('crea.login', function (session, userAccount) {
        console.log(session, userAccount);
        if (session) {
            userAccount.user.cgy_balance = '0.000 ' + apiOptions.symbol.CGY;
        }

        handleProfile(session, userAccount);

    });

})();
