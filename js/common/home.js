/**
 * Created by ander on 9/10/18.
 */

let homePosts;

(function () {
    let session, account;

    /**
     *
     * @param {string} urlFilter
     * @param {string} filter
     * @param state
     * @returns {License}
     */
    function showPosts(urlFilter, filter, state) {
        let content = state.content;
        let accounts = state.accounts;

        let cKeys = Object.keys(content);
        let newKeys = [];

        for (let x = 0; x < cKeys.length; x++) {
            let k = cKeys[x];
            if (!content[k].parent_author) {
                content[k].metadata = jsonify(content[k].json_metadata);
                newKeys.push(k);
            }
        }


        state.content = content;

        let aKeys = Object.keys(accounts);
        aKeys.forEach(function (k) {
            accounts[k].metadata = jsonify(accounts[k].json_metadata);
            accounts[k].metadata.avatar = accounts[k].metadata.avatar || {};
        });

        state.accounts = accounts;

        //Normalize filter
        if (filter.startsWith('/')) {
            filter = filter.substring(1);
        }

        let category = resolveFilter('/' + getPathPart()).replace('/', '');
        let discuss = getPathPart(1) || '';
        if (isUserFeed(getPathPart()) && !state.discussion_idx[discuss]) {
            cKeys = newKeys;
            cKeys.sort(function (k1, k2) {
                let d1 = toLocaleDate(content[k1].created);
                let d2 = toLocaleDate(content[k2].created);

                return d2.getTime() - d1.getTime();
            });

            state.discussion_idx[discuss] = {};
            state.discussion_idx[discuss][category] = cKeys;
        }

        console.log('Filter:', filter, 'discussion:', discuss, 'category:', category, state.discussion_idx[discuss][category]);

        if (!homePosts) {
            homePosts = new Vue({
                el: '#home-posts',
                data: {
                    session: session,
                    account: account,
                    filter: filter,
                    category: category,
                    discuss: discuss,
                    state: state,
                    lang: lang,
                },
                updated: function () {
                    if (mr.masonry) {
                        console.log ('Updating layout');
                        mr.masonry.windowLoad();
                        mr.masonry.updateLayout();
                    }
                },
                methods: {
                    getDefaultAvatar: R.getAvatar,
                    onFollow: function (err, result) {
                        console.log('onFollow', err, result);
                        creaEvents.emit('crea.content.filter', this.filter);
                    },
                    openPost: showPost,
                    parseAsset: function (asset) {
                        return Asset.parse(asset).toFriendlyString();
                    },
                    getBuzz: function (reputation) {
                        return crea.formatter.reputation(reputation);
                    },
                    getFeaturedImage: function (post) {
                        let featuredImage = post.metadata.featuredImage;
                        if (featuredImage && featuredImage.hash) {
                            return {
                                url: 'https://ipfs.creary.net/ipfs/' + featuredImage.hash
                            }
                        } else if (featuredImage && featuredImage.url) {
                            return featuredImage;
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

                        return moment(date).fromNow();
                    },
                    hasPromotion: function (post) {
                        let amount = Asset.parseString(post.promoted);
                        return amount.amount > 0;
                    },
                    getPromotion: function (post) {
                        let amount = Asset.parseString(post.promoted);

                        return amount.toPlainString() + ' $';
                    },
                    getPayout: function (post) {
                        let amount = Asset.parseString(post.pending_payout_value);
                        if (this.hasPaid(post)) {
                            amount = Asset.parseString(post.total_payout_value);
                            amount = amount.add(Asset.parseString(post.curator_payout_value));
                        }

                        return amount.toPlainString() + '$'
                    },
                    getPendingPayouts: function (post) {
                        const PRICE_PER_CREA = Asset.parse({ amount: Asset.parseString(this.state.feed_price.base).toFloat() / Asset.parseString(this.state.feed_price.quote).toFloat(), nai: 'cbd'});
                        const CBD_PRINT_RATE = this.state.props.cbd_print_rate;
                        const CBD_PRINT_RATE_MAX = 10000;
                        const PENDING_PAYOUT = Asset.parseString(post.pending_payout_value);
                        const PERCENT_CREA_DOLLARS = post.percent_crea_dollars / 20000;
                        const PENDING_PAYOUT_CBD = Asset.parse({ amount: PENDING_PAYOUT.toFloat() * PERCENT_CREA_DOLLARS, nai: 'cbd'});
                        const PENDING_PAYOUT_CGY = Asset.parse({ amount: (PENDING_PAYOUT.toFloat() - PENDING_PAYOUT_CBD.toFloat()) / PRICE_PER_CREA.toFloat(), nai: 'cgy'});
                        const PENDING_PAYOUT_PRINTED_CBD = Asset.parse({ amount: PENDING_PAYOUT_CBD.toFloat() * (CBD_PRINT_RATE / CBD_PRINT_RATE_MAX), nai: 'cbd'});
                        const PENDING_PAYOUT_PRINTED_CREA = Asset.parse({ amount: (PENDING_PAYOUT_CBD.toFloat() - PENDING_PAYOUT_PRINTED_CBD.toFloat()) / PRICE_PER_CREA.toFloat(), nai: 'crea'});

                        return '(' + PENDING_PAYOUT_PRINTED_CBD.toFriendlyString(null, false) +
                            ', ' + PENDING_PAYOUT_PRINTED_CREA.toFriendlyString(null, false) +
                            ', ' + PENDING_PAYOUT_CGY.toFriendlyString(null, false) + ')';

                    },
                    parseJSON: function (strJson) {

                        if (strJson && strJson.length > 0) {
                            try {
                                return JSON.parse(strJson);
                            } catch (e) {
                                catchError(e);
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
            homePosts.session = session;
            homePosts.account = account;
            homePosts.filter = filter;
            homePosts.category = category;
            homePosts.discuss = discuss;
            homePosts.state = state;
        }

        creaEvents.emit('crea.dom.ready');
    }

    creaEvents.on('crea.posts', function (urlFilter, filter, state) {

        let authors = [];
        for (let c in state.content) {
            let author = state.content[c].author;
            if (!authors.includes(author)) {
                authors.push(author);
            }

            //separate votes
            state.content[c].down_votes = [];
            state.content[c].up_votes = [];
            state.content[c].active_votes.forEach(function (v) {
                if (v.percent <= -10000) {
                    state.content[c].down_votes.push(v);
                } else {
                    state.content[c].up_votes.push(v);
                }
            });
        }

        if (isUserFeed(getPathPart())) {
            //Retrieve another accounts
            crea.api.getAccounts(authors, function (err, result) {
                if (!catchError(err)) {
                    let accounts = {};
                    result.forEach(function (a) {
                        a.metadata = jsonify(a.json_metadata);
                        a.metadata.avatar = a.metadata.avatar || {};
                        accounts[a.name] = a;
                    });

                    state.accounts = accounts;
                    showPosts(urlFilter, filter, state);
                }
            })

        } else {
            showPosts(urlFilter, filter, state);
        }
    });

    creaEvents.on('crea.session.update', function (s, a) {
        homePosts.session = session = s;
        homePosts.aaccount = account = a;
    });

    creaEvents.on('crea.session.login', function (s, a) {
        session = s;
        account = a;

        let path = window.location.pathname;
        if (path === '/') {
            if (s) {
                creaEvents.emit('crea.content.filter', '/@' + s.account.username + '/feed');
            } else {
                creaEvents.emit('crea.content.filter', '/popular');
            }
        } else {
            if (path.startsWith('/search')) {
                let search = getParameterByName('query');
                let page = getParameterByName('page');
                performSearch(search, page, true);
            } else {
                creaEvents.emit('crea.content.filter', path);
            }
        }
    });

    creaEvents.on('crea.search.content', function (data) {

        let searchState = {
            content: {},
            accounts: {},
            discussion: []
        };

        let count = 0;
        let onFinish = function (state) {
            count++;

            console.log('Finished:', count, data.length);
            if (count >= data.length) {
                console.log(state);
                state.content = searchState.content;
                state.accounts = searchState.accounts;

                //Sort by active_votes

                searchState.discussion.sort(function (c1, c2) {
                    return state.content[c2].active_votes.length - state.content[c1].active_votes.length
                });

                state.discussion_idx[""] = {};
                state.discussion_idx[""].search = searchState.discussion;
                creaEvents.emit('crea.posts', '/search', 'search', state);
            }
        };

        for (let x  = 0; x < data.length; x++) {

            let getState = function (r) {
                let permalink = r.author + '/' + r.permlink;
                let url = '/' + r.tags[0] + '/@' + permalink;

                crea.api.getState(url, function (err, result) {
                    if (err) {
                        console.error(err);
                        getState(r);
                    } else  {
                        searchState.discussion.push(permalink);
                        searchState.accounts[r.author] = result.accounts[r.author];
                        searchState.content[permalink] = result.content[permalink];
                        onFinish(result);
                    }
                })
            };

            getState(data[x]);

        }
    });

})();

