/**
 * Created by ander on 9/10/18.
 */

let homePosts;

(function () {
    let session, account;

    function showPosts(filter, state) {
        //console.log(filter, data);
        let content = state.content;
        let accounts = state.accounts;

        let cKeys = Object.keys(content);
        cKeys.forEach(function (k) {
            content[k].metadata = jsonify(content[k].json_metadata);
        });
        state.content = content;

        let aKeys = Object.keys(accounts);
        aKeys.forEach(function (k) {
            accounts[k].metadata = jsonify(accounts[k].json_metadata);
            accounts[k].metadata.avatar = accounts[k].metadata.avatar || {};
        });
        state.accounts = accounts;

        if (!homePosts) {
            homePosts = new Vue({
                el: '#home-posts',
                data: {
                    session: session,
                    account: account,
                    filter: filter,
                    state: state,
                    lang: lang,
                },
                methods: {
                    getDefaultAvatar: R.getDefaultAvatar,
                    onFollow: function (err, result) {
                        console.log('onFollow', err, result);
                        creaEvents.emit('crea.content.filter', this.filter);
                    },
                    openPost: function (post) {
                        window.location.href = '/post-view.php?url=' + post.url;
                    },
                    parseAsset: function (asset) {
                        return Asset.parse(asset).toFriendlyString();
                    },
                    getBuzz: function (reputation) {
                        return crea.formatter.reputation(reputation);
                    },
                    getTags: function (post) {
                        let tags = post.metadata.tags;
                        tags = tags.slice(0, 7);
                        return tags.join(', ');
                    },
                    getFutureDate: function (date) {
                        return moment(toLocaleDate(date)).fromNow();
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
                    parseJSON: function (strJson) {

                        if (strJson && strJson.length > 0) {
                            try {
                                return JSON.parse(strJson);
                            } catch (e) {
                                console.error('JSON Error parsing', strJson);
                            }
                        }

                        return {};
                    },
                    onVote: function (err, result) {
                        creaEvents.emit('crea.content.filter', filter);
                    },
                    getLicense(flag) {
                        if (flag) {
                            return License.fromFlag(flag);
                        }

                        return new License(LICENSE.FREE_CONTENT);
                    }
                }
            })
        } else {
            homePosts.filter = filter;
            homePosts.state = state;
            homePosts.session = session;
            homePosts.account = account;
        }
    }

    creaEvents.on('crea.posts', function (filter, state) {
        showPosts(filter, state);
    });

    creaEvents.on('crea.session.update', function (s, a) {
        homePosts.session = session = s;
        homePosts.aaccount = account = a;
    });

    creaEvents.on('crea.session.login', function (s, a) {
        session = s;
        account = a;
        console.log(s, a);
        if (s) {
            //TODO: REPLACE BY FOLLOWING CONTENT
            creaEvents.emit('crea.content.filter', 'created');
        } else {
            creaEvents.emit('crea.content.filter', 'promoted');
        }
    });
})();

