"use strict";

/**
 * Created by ander on 9/10/18.
 */

(function () {

    let homePosts;
    let lastPage;
    let session, account;

    /**
     *
     * @param {string} urlFilter
     * @param {string} filter
     * @param state
     * @returns {License}
     */
    function showPosts(urlFilter, filter, state) {
        console.log(urlFilter, filter, state);
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
            accounts[k] = parseAccount(accounts[k]);
        });
        state.accounts = accounts; //Normalize filter

        if (filter.startsWith('/')) {
            filter = filter.substring(1);
        }

        let category = resolveFilter('/' + getPathPart()).replace('/', '');
        let discuss = getPathPart(null, 1) || '';

        if (isUserFeed(getPathPart()) && !state.discussion_idx[discuss]) {
            cKeys = newKeys;
            cKeys.sort(function (k1, k2) {
                let d1 = toLocaleDate(content[k1].created);
                let d2 = toLocaleDate(content[k2].created);
                return d2.valueOf() - d1.valueOf();
            });
            state.discussion_idx[discuss] = {};
            state.discussion_idx[discuss][category] = cKeys;
            lastPage = lastPage ? lastPage : 1;
        } else if (window.location.pathname === '/search') {
            lastPage = getParameterByName('page') || 1;
        } else {
            let contentArray = state.discussion_idx[discuss][category];
            lastPage = state.content[contentArray[contentArray.length - 1]];
        }

        state.discussion_idx[discuss][category] = removeBlockedContents(state, account, state.discussion_idx[discuss][category]);

        if (!homePosts) {
            homePosts = new Vue({
                el: '#home-posts',
                data: {
                    session: session,
                    account: account,
                    filter: filter,
                    category: category,
                    discuss: discuss,
                    urlFilter: urlFilter,
                    state: state,
                    search: getParameterByName('query'),
                    simpleView: false,
                    lang: lang
                },
                updated: function updated() {
                    if (mr.masonry) {
                        mr.masonry.windowLoad();
                        mr.masonry.updateLayout();
                    }
                },
                methods: {
                    isFeed: function () {
                        return isUserFeed();
                    },
                    getDefaultAvatar: R.getAvatar,
                    toggleSimpleView: function () {
                        this.simpleView = !this.simpleView;
                        console.log('SimpleView', this.simpleView)
                    },
                    onFollow: function onFollow(err, result) {
                        //creaEvents.emit('crea.content.filter', this.urlFilter);
                        updateUserSession();
                    },
                    openPost: function (post, event) {
                        cancelEventPropagation(event);
                        creaEvents.emit('navigation.post.data', post, this.state, this.discuss, this.category);
                        showModal('#modal-post');
                    },
                    parseAsset: function parseAsset(asset) {
                        return Asset.parse(asset).toFriendlyString();
                    },
                    getBuzzClass: function getBuzzClass(account) {
                        let buzzClass = {};
                        let levelName = account.buzz.level_name;

                        buzzClass[levelName] = true;
                        return buzzClass;
                    },
                    getFeaturedImage: function getFeaturedImage(post) {
                        let featuredImage;
                        if (!this.account && post.adult_content || this.account && this.account.user.metadata.adult_content === 'warn' && post.adult_content) {
                            featuredImage = {
                                url: R.IMG.POST.NSFW
                            }
                        } else {
                            featuredImage = post.metadata.featuredImage;
                        }

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
                        let tags = post.metadata.tags;
                        let linkedTags = []; //Select only 8 first tags

                        tags = tags.slice(0, 7);
                        tags.forEach(function (t) {
                            linkedTags.push('<a href="/popular/' + encodeURIComponent(t) + '">' + t + '</a>');
                        });
                        return linkedTags.join(', ');
                    },
                    getFutureDate: function getFutureDate(date) {
                        return toLocaleDate(date).fromNow();
                    },
                    hasPaid: function hasPaid(post) {
                        let now = moment();
                        let payout = toLocaleDate(post.cashout_time);
                        return now.isAfter(payout);
                    },
                    getPayoutPostDate: function getPayoutPostDate(post) {
                        let date = toLocaleDate(post.cashout_time);

                        if (this.hasPaid(post)) {
                            date = toLocaleDate(post.last_payout);
                        }

                        return date.fromNow();
                    },
                    hasPromotion: function hasPromotion(post) {
                        let amount = Asset.parseString(post.promoted);
                        return amount.amount > 0;
                    },
                    getPromotion: function getPromotion(post) {
                        let amount = Asset.parseString(post.promoted);
                        return '$ ' + amount.toPlainString();
                    },
                    getPayout: function getPayout(post) {
                        let amount = Asset.parseString(post.pending_payout_value);

                        if (this.hasPaid(post)) {
                            amount = Asset.parseString(post.total_payout_value);
                            amount = amount.add(Asset.parseString(post.curator_payout_value));
                        } //amount.amount = parseInt(amount.amount / 1000000000);


                        return '$ ' + amount.toPlainString();
                    },
                    getPendingPayouts: function getPendingPayouts(post, asset) {
                        asset = asset ? asset.toLowerCase() : '';

                        let PRICE_PER_CREA = Asset.parse({
                            amount: Asset.parseString(this.state.feed_price.base).toFloat() / Asset.parseString(this.state.feed_price.quote).toFloat(),
                            nai: 'cbd'
                        });
                        let CBD_PRINT_RATE = this.state.props.cbd_print_rate;
                        let CBD_PRINT_RATE_MAX = 10000;
                        let payout = Asset.parse(post.pending_payout_value); //payout.amount = parseInt(payout.amount / 1000000000);

                        let PENDING_PAYOUT = payout;
                        let PERCENT_CREA_DOLLARS = post.percent_crea_dollars / 20000;
                        let PENDING_PAYOUT_CBD = Asset.parse({
                            amount: PENDING_PAYOUT.toFloat() * PERCENT_CREA_DOLLARS,
                            nai: 'cbd'
                        });
                        let PENDING_PAYOUT_CGY = Asset.parse({
                            amount: NaNOr(((PENDING_PAYOUT.toFloat() - PENDING_PAYOUT_CBD.toFloat()) / PRICE_PER_CREA.toFloat()), 0),
                            nai: 'cgy'
                        });
                        let PENDING_PAYOUT_PRINTED_CBD = Asset.parse({
                            amount: NaNOr((PENDING_PAYOUT_CBD.toFloat() * (CBD_PRINT_RATE / CBD_PRINT_RATE_MAX)), 0),
                            nai: 'cbd'
                        });
                        let PENDING_PAYOUT_PRINTED_CREA = Asset.parse({
                            amount: NaNOr(((PENDING_PAYOUT_CBD.toFloat() - PENDING_PAYOUT_PRINTED_CBD.toFloat()) / PRICE_PER_CREA.toFloat()), 0),
                            nai: 'crea'
                        });

                        switch (asset) {
                            case 'cgy':
                                return PENDING_PAYOUT_CGY.toFriendlyString(null, false);
                            case 'cbd':
                                return PENDING_PAYOUT_PRINTED_CBD.toFriendlyString(null, false);
                            case 'crea':
                                return PENDING_PAYOUT_PRINTED_CREA.toFriendlyString(null, false);
                            default:
                                return '(' + PENDING_PAYOUT_PRINTED_CBD.toFriendlyString(null, false) + ', ' + PENDING_PAYOUT_PRINTED_CREA.toFriendlyString(null, false) + ', ' + PENDING_PAYOUT_CGY.toFriendlyString(null, false) + ')';
                        }

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
                    onVote: function onVote(err, result, post) {
                        catchError(err);
                        //updateUserSession();
                        let that = this;
                        getDiscussion(post.author, post.permlink, function (err, result) {
                            if (!err) {
                                let updatedPost = parsePost(result, post.reblogged_by);
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
                    }
                }
            });
        } else {
            homePosts.session = session;
            homePosts.account = account;
            homePosts.filter = filter;
            homePosts.category = category;
            homePosts.discuss = discuss;
            homePosts.state = state;
            homePosts.urlFilter = urlFilter;
            homePosts.search = getParameterByName('query');
        }

        homePosts.$forceUpdate();
        creaEvents.emit('crea.dom.ready');
    }

    creaEvents.on('crea.posts', function (urlFilter, filter, state) {
        let authors = [];

        for (let c in state.content) {
            let author = state.content[c].author;

            if (!authors.includes(author)) {
                authors.push(author);
            } //separate votes


            state.content[c] = parsePost(state.content[c]);
        }

        if (isUserFeed(getPathPart())) {
            //Retrieve another accounts
            getAccounts(authors, function (err, result) {
                if (!catchError(err)) {
                    let accounts = {};
                    result.forEach(function (a) {
                        accounts[a.name] = a;
                    });

                    if (homePosts) {
                        //On Session update
                        //Accounts
                        for (let a in accounts) {
                            homePosts.state.accounts[a] = accounts[a];
                        } //Posts


                        for (let _c in state.content) {
                            homePosts.state.content[_c] = parsePost(state.content[_c]);
                        }

                        state = homePosts.state;
                    } else {
                        state.accounts = accounts;
                    }

                    showPosts(urlFilter, filter, state);
                }
            });
        } else if (homePosts && homePosts.urlFilter === urlFilter && urlFilter === '/search') {
            let query = getParameterByName('query');

            if (query === homePosts.search && query !== null) {
                //Accounts
                for (let a in state.accounts) {
                    homePosts.state.accounts[a] = parseAccount(state.accounts[a]);
                } //Posts


                for (let _c2 in state.content) {
                    homePosts.state.content[_c2] = parsePost(state.content[_c2]);
                } //Order


                let newPosts = state.discussion_idx[""].search;

                for (let x = 0; x < newPosts.length; x++) {
                    if (!homePosts.state.discussion_idx[''].search.includes(newPosts[x])) {
                        homePosts.state.discussion_idx[''].search.push(newPosts[x]);
                    }
                }

                homePosts.state.discussion_idx[''].search = removeBlockedContents(homePosts.state, account, homePosts.state.discussion_idx[''].search);

            } else {
                showPosts(urlFilter, filter, state);
            }
        } else {
            if (homePosts && homePosts.urlFilter === urlFilter) {
                //On Session update
                //Accounts
                for (let _a in state.accounts) {
                    homePosts.state.accounts[_a] = parseAccount(state.accounts[_a]);
                }

                state = homePosts.state;
            }

            let ck = Object.keys(state.content);
            let reblogsFetched = 0;
            let onAllReblogs = function () {
                reblogsFetched++;

                if (reblogsFetched >= ck.length) {
                    showPosts(urlFilter, filter, state);
                }
            };

            let onReblogs = function (k, d, reblogs) {
                state.content[k] = parsePost(d, reblogs);
            };

            refreshAccessToken(function (accessToken) {

                for (let x = 0; x < ck.length; x++) {
                    let d = state.content[ck[x]];

                    (function (x, ck, d) {
                        let http = new HttpClient(apiOptions.apiUrl + String.format('/creary/%s/%s', d.author, d.permlink));

                        http.when('done', function (response) {
                            let data = jsonify(response).data;
                            onReblogs(ck[x], d, data.reblogged_by);
                            onAllReblogs();
                        });

                        http.when('fail', function (jqXHR, textStatus, errorThrown) {
                            console.error(textStatus, errorThrown);
                            onReblogs(ck[x], d);
                            onAllReblogs();
                        });

                        http.headers = {
                            Authorization: 'Bearer ' + accessToken
                        };

                        http.get({});
                    })(x, ck, d)

                }
            });
        }
    });

    function beforeInit(urlFilter) {
        let path = currentPage ? currentPage.pathname : window.location.pathname;

        if (path === '/') {
            if (session) {
                urlFilter = urlFilter ? urlFilter : '/@' + session.account.username + '/feed';
                creaEvents.emit('crea.content.filter', urlFilter);
            } else {
                creaEvents.emit('crea.content.filter', '/popular');
            }
        } else {
            if (isUserFeed(getPathPart())) {
                if (session) {
                    if (getPathPart() !== ('@' + session.account.username)) {
                        showProfile(getPathPart());
                    } else {
                        //Show user feed
                        creaEvents.emit('crea.content.filter', path);
                    }
                } else {
                    //Avoid show feed if current user is not logged
                    showProfile(getPathPart());
                }
            } else if (path.startsWith('/search')) {
                let search = getParameterByName('query');
                let page = getParameterByName('page') || 1;
                performSearch(search, page, true);
            } else {
                creaEvents.emit('crea.content.filter', path);
            }
        }
    }

    creaEvents.on('crea.session.update', function (s, a) {
        homePosts.session = session = s;
        homePosts.account = account = a;
        --lastPage;
        beforeInit(homePosts.urlFilter);
    });

    creaEvents.on('crea.session.login', function (s, a) {
        session = s;
        account = a;
        //console.log(clone(a));
        beforeInit();
    });

    let onScrollCalling;
    creaEvents.on('crea.scroll.bottom', function () {
        if (!onScrollCalling) {
            onScrollCalling = true;

            if (isUserFeed()) {
                let http = new HttpClient(apiOptions.apiUrl + '/creary/feed');
                http.when('done', function (response) {
                    let data = jsonify(response).data;

                    if (data.length) {
                        let count = data.length;
                        let discussions = [];
                        let accounts = [];

                        let onContentFetched = function onContentFetched() {
                            count--;

                            if (count <= 0) {
                                getAccounts(accounts, function (err, newAccounts) {
                                    if (!catchError(err)) {
                                        //Update accounts
                                        newAccounts.forEach(function (a) {
                                            homePosts.state.accounts[a.name] = parseAccount(a);
                                        }); //Sort

                                        discussions.sort(function (k1, k2) {
                                            let d1 = toLocaleDate(k1.created);
                                            let d2 = toLocaleDate(k2.created);
                                            return d2.valueOf() - d1.valueOf();
                                        });
                                        let discuss = homePosts.discuss;
                                        let category = homePosts.category; //Update Posts

                                        discussions.forEach(function (d) {
                                            let permlink = d.author + '/' + d.permlink;
                                            homePosts.state.content[permlink] = d;
                                            homePosts.state.discussion_idx[discuss][category].push(permlink);
                                        });

                                        homePosts.state.discussion_idx[discuss][category] = removeBlockedContents(homePosts.state, account, homePosts.state.discussion_idx[discuss][category]);
                                        homePosts.state.discussions = homePosts.state.discussion_idx[discuss][category];
                                        homePosts.$forceUpdate();
                                        creaEvents.emit('navigation.state.update', homePosts.state);
                                    }

                                    onScrollCalling = false;
                                });
                            } else {
                                onScrollCalling = false;
                            }
                        };

                        data.forEach(function (d) {
                            let permlink = d.author + '/' + d.permlink;

                            if (!homePosts.state.content[permlink]) {
                                crea.api.getContent(d.author, d.permlink, function (err, result) {
                                    if (err) {
                                        console.error('Error getting', permlink, err);
                                    } else {
                                        let p = parsePost(result);
                                        p.reblogged_by = d.reblogged_by;
                                        discussions.push(p);

                                        if (!homePosts.state.accounts[d.author] && !accounts.includes(d.author)) {
                                            accounts.push(d.author);
                                        }
                                    }

                                    onContentFetched();
                                });
                            } else {
                                homePosts.state.content[permlink].reblogged_by = d.reblogged_by;
                            }
                        });
                    } else {
                        onScrollCalling = false;
                        --lastPage;
                    }
                });
                http.when('fail', function (jqXHR, textStatus, errorThrown) {
                    onScrollCalling = false;
                    catchError(textStatus);
                });
                let username = getPathPart().replace('/', '').replace('@', '');
                crea.api.getFollowing(username, '', 'blog', 1000, function (err, result) {
                    if (!catchError(err)) {
                        let followings = [];
                        result.following.forEach(function (f) {
                            followings.push(f.following);
                        });

                        if (followings.length) {
                            followings = followings.join(',');
                            refreshAccessToken(function (accessToken) {
                                http.headers = {
                                    Authorization: 'Bearer ' + accessToken
                                };
                                lastPage++;
                                http.post({
                                    following: followings,
                                    page: lastPage,
                                    reblogs: true,
                                    adult: account.user.metadata.adult_content
                                });
                            });
                        }
                    }
                });
            } else if (window.location.pathname === '/search') {
                let query = getParameterByName('query');
                let postCount = Object.keys(homePosts.state.content).length;

                if (postCount > 0 && postCount % 20 === 0) {
                    globalLoading.show = true;
                    performSearch(query, ++lastPage, true, function () {
                        onScrollCalling = false;
                        globalLoading.show = false;
                    });
                }
            } else {
                let apiCall;
                let category = homePosts.category;

                switch (category) {
                    case 'now':
                        apiCall = crea.api.getDiscussionsByNow;
                        break;

                    case 'skyrockets':
                        apiCall = crea.api.getDiscussionsBySkyrockets;
                        break;

                    case 'promoted':
                        apiCall = crea.api.getDiscussionsByPromoted;
                        break;

                    case 'popular':
                        apiCall = crea.api.getDiscussionsByPopular;
                        break;
                    default:
                        apiCall = crea.api['getDiscussionsBy' + category.capitalize()];
                        break;
                }

                if (apiCall) {
                    refreshAccessToken(function (accessToken) {
                        apiCall(lastPage.author, lastPage.permlink, 21, function (err, result) {
                            if (err) {
                                console.error(err);
                            } else {
                                //Get new accounts
                                let discussions = result.discussions; //Remove first duplicate post

                                discussions.shift();
                                let accounts = [];

                                let reblogsFetched = 0;
                                let onAllReblogs = function () {
                                    reblogsFetched++;
                                    if (reblogsFetched >= discussions.length) {
                                        //Get new accounts
                                        getAccounts(accounts, function (err, newAccounts) {
                                            if (!catchError(err)) {
                                                //Update accounts
                                                newAccounts.forEach(function (a) {
                                                    homePosts.state.accounts[a.name] = a;
                                                }); //Update Posts

                                                let discuss = homePosts.discuss;
                                                discussions.forEach(function (d) {
                                                    let permlink = d.author + '/' + d.permlink;
                                                    homePosts.state.content[permlink] = d;

                                                    homePosts.state.discussion_idx[discuss][category].push(permlink);
                                                });

                                                homePosts.state.discussion_idx[discuss][category] = removeBlockedContents(homePosts.state, account, homePosts.state.discussion_idx[discuss][category]);
                                                homePosts.state.discussions = homePosts.state.discussion_idx[discuss][category];
                                                lastPage = discussions[discussions.length - 1];
                                                homePosts.$forceUpdate();
                                                creaEvents.emit('navigation.state.update', homePosts.state);
                                            }

                                            onScrollCalling = false;
                                        });
                                    }

                                };

                                for (let x = 0; x < discussions.length; x++) {
                                    let d = discussions[x];

                                    (function (x, d, discussions) {
                                        let http = new HttpClient(apiOptions.apiUrl + String.format('/creary/%s/%s', d.author, d.permlink));

                                        let onReblogs = function (reblogs) {

                                            discussions[x] = parsePost(d, reblogs);

                                            if (!homePosts.state.accounts[d.author] && !accounts.includes(d.author)) {
                                                accounts.push(d.author);
                                            }
                                        };

                                        http.when('done', function (response) {
                                            let data = jsonify(response).data;
                                            onReblogs(data.reblogged_by);
                                            onAllReblogs();
                                        });

                                        http.when('fail', function (jqXHR, textStatus, errorThrown) {
                                            console.error(textStatus, errorThrown);
                                            onReblogs();
                                            onAllReblogs();
                                        });

                                        http.headers = {
                                            Authorization: 'Bearer ' + accessToken
                                        };

                                        http.get({});
                                    })(x, d, discussions)

                                }
                            }
                        });
                    })

                }

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

        let onFinish = function onFinish(state) {
            count++;

            if (count >= data.length) {
                console.log(state);
                state.content = searchState.content;
                state.accounts = searchState.accounts; //Sort by active_votes

                searchState.discussion.sort(function (c1, c2) {
                    return state.content[c2].active_votes.length - state.content[c1].active_votes.length;
                });
                state.discussion_idx[""] = {};
                state.discussion_idx[""].search = searchState.discussion;
                creaEvents.emit('crea.posts', '/search', 'search', state);
            }
        };

        let _loop = function _loop(x) {
            let getState = function getState(r) {
                let permalink = r.author + '/' + r.permlink;
                let url = '/' + r.tags[0] + '/@' + permalink;
                crea.api.getState(url, function (err, result) {
                    if (err) {
                        console.error(err);
                        getState(r);
                    } else {
                        searchState.discussion.push(permalink);
                        searchState.accounts[r.author] = result.accounts[r.author];
                        searchState.content[permalink] = result.content[permalink];
                        onFinish(result);
                    }
                });
            };

            getState(data[x]);
        };

        for (let x = 0; x < data.length; x++) {
            _loop(x);
        }

        if (data.length === 0) {
            crea.api.getState('/no_results', function (err, result) {
                if (!catchError(err)) {
                    onFinish(result);
                }
            });
        }
    });

    creaEvents.on('crea.content.filter', function (filter) {
        currentPage = {
            pathname: filter,
            title: document.title
        };
    });

    creaEvents.on('crea.dom.ready', function () {
        $("#view-changer").click(function () {
            homePosts.toggleSimpleView();
        });
    })
})();
