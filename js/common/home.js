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
        console.log('Showing posts', state);
        let content = state.content;
        let accounts = state.accounts;

        let cKeys = Object.keys(content);
        let newKeys = [];
        cKeys.forEach(function (k) {
            if (content[k].parent_author) {
                delete content[k];
            } else {
                content[k].metadata = jsonify(content[k].json_metadata);
                newKeys.push(k);
            }
        });

        cKeys = newKeys;
        state.content = content;
        console.log(cKeys, jsonify(jsonstring(content)));

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
        //Set discussion feed
        const DEFAULT_DISCUSSIONS = ['created', 'popular', 'trending', 'hot', 'promoted'];

        let category = resolveFilter('/' + getPathPart()).replace('/', '');
        let discuss = getPathPart(1) || '';
        if (isUserFeed(getPathPart()) && !state.discussion_idx[discuss]) {

            cKeys.sort(function (k1, k2) {
                return new Date(state.content[k2].created).getTime() - new Date(state.content[k1].created).getTime();
            });

            state.discussion_idx[discuss] = {};
        }

        state.discussion_idx[discuss][category] = cKeys;

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
                        mr.masonry.updateLayout();
                    }
                },
                methods: {
                    getDefaultAvatar: R.getDefaultAvatar,
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
                        if (featuredImage.hash) {
                            return {
                                url: 'http://144.217.106.119:8080/ipfs/' + featuredImage.hash
                            }
                        }

                        return {};
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

