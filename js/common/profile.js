/**
 * Created by ander on 25/09/18.
 */

let profileContainer;

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

    function tags(element) {
        $('#' + element).tagsinput();
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
                    navfilter: 'projects'
                },
                updated: function () {
                    console.log('Mounted! ');
                    $('#profile-edit-tags').tagsinput({
                        maxTags: CONSTANTS.MAX_TAGS,
                        maxChars: CONSTANTS.TEXT_MAX_SIZE.TAG,
                        delimiter: ' '
                    });

                },
                methods: {
                    getDefaultAvatar: R.getDefaultAvatar,
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
        } else {
            //Handle use rby parameter profile
            user = getParameterByName('profile', window.location.href);
            if (!user) {
                //No user found
                user = session.account.username;
            }
        }

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
                    }
                })
            }
        });
    }

    creaEvents.on('crea.login', function (session, userAccount) {
        console.log(session, userAccount);
        if (session) {
            userAccount.user.cgy_balance = '0.000 ' + apiOptions.symbol.CGY;
            handleProfile(session, userAccount);
        } else {
            toHome('profile.php');
        }

    });

})();
