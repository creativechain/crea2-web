"use strict";

/**
 * Created by ander on 9/10/18.
 */
(function () {
    var homePosts;
    var lastPage;
    var session, account;
    /**
     *
     * @param {string} urlFilter
     * @param {string} filter
     * @param state
     * @returns {License}
     */

    function showPosts(urlFilter, filter, state) {
        //console.log(urlFilter, filter, state);
        var content = state.content;
        var accounts = state.accounts;
        var cKeys = Object.keys(content);
        var newKeys = [];

        for (var x = 0; x < cKeys.length; x++) {
            var k = cKeys[x];

            if (!content[k].parent_author) {
                content[k].metadata = jsonify(content[k].json_metadata);
                newKeys.push(k);
            }
        }

        state.content = content;
        var aKeys = Object.keys(accounts);
        aKeys.forEach(function (k) {
            accounts[k] = parseAccount(accounts[k]);
        });
        state.accounts = accounts; //Normalize filter

        if (filter.startsWith('/')) {
            filter = filter.substring(1);
        }

        var category = resolveFilter('/' + getPathPart()).replace('/', '');
        var discuss = getPathPart(1) || '';

        if (isUserFeed(getPathPart()) && !state.discussion_idx[discuss]) {
            cKeys = newKeys;
            cKeys.sort(function (k1, k2) {
                var d1 = toLocaleDate(content[k1].created);
                var d2 = toLocaleDate(content[k2].created);
                return d2.getTime() - d1.getTime();
            });
            state.discussion_idx[discuss] = {};
            state.discussion_idx[discuss][category] = cKeys;
            lastPage = lastPage ? lastPage : 1;
        } else if (window.location.pathname === '/search') {
            lastPage = getParameterByName('page') || 1;
        } else {
            var contentArray = state.discussion_idx[discuss][category];
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
                    getDefaultAvatar: R.getAvatar,
                    toggleSimpleView: function () {
                        this.simpleView = !this.simpleView;
                        console.log('SimpleView', this.simpleView)
                    },
                    onFollow: function onFollow(err, result) {
                        //creaEvents.emit('crea.content.filter', this.urlFilter);
                        updateUserSession();
                    },
                    openPost: showPost,
                    parseAsset: function parseAsset(asset) {
                        return Asset.parse(asset).toFriendlyString();
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
                    getFutureDate: function getFutureDate(date) {
                        return moment(toLocaleDate(date)).fromNow();
                    },
                    hasPaid: function hasPaid(post) {
                        var now = new Date();
                        var payout = toLocaleDate(post.cashout_time);
                        return now.getTime() > payout.getTime();
                    },
                    getPayoutPostDate: function getPayoutPostDate(post) {
                        var date = toLocaleDate(post.cashout_time);

                        if (this.hasPaid(post)) {
                            date = toLocaleDate(post.last_payout);
                        }

                        return moment(date).fromNow();
                    },
                    hasPromotion: function hasPromotion(post) {
                        var amount = Asset.parseString(post.promoted);
                        return amount.amount > 0;
                    },
                    getPromotion: function getPromotion(post) {
                        var amount = Asset.parseString(post.promoted);
                        return '$ ' + amount.toPlainString();
                    },
                    getPayout: function getPayout(post) {
                        var amount = Asset.parseString(post.pending_payout_value);

                        if (this.hasPaid(post)) {
                            amount = Asset.parseString(post.total_payout_value);
                            amount = amount.add(Asset.parseString(post.curator_payout_value));
                        } //amount.amount = parseInt(amount.amount / 1000000000);


                        return '$ ' + amount.toPlainString();
                    },
                    getPendingPayouts: function getPendingPayouts(post, asset) {
                        asset = asset ? asset.toLowerCase() : '';

                        var PRICE_PER_CREA = Asset.parse({
                            amount: Asset.parseString(this.state.feed_price.base).toFloat() / Asset.parseString(this.state.feed_price.quote).toFloat(),
                            nai: 'cbd'
                        });
                        var CBD_PRINT_RATE = this.state.props.cbd_print_rate;
                        var CBD_PRINT_RATE_MAX = 10000;
                        var payout = Asset.parse(post.pending_payout_value); //payout.amount = parseInt(payout.amount / 1000000000);

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
        var authors = [];

        for (var c in state.content) {
            var author = state.content[c].author;

            if (!authors.includes(author)) {
                authors.push(author);
            } //separate votes


            state.content[c] = parsePost(state.content[c]);
        }

        if (isUserFeed(getPathPart())) {
            //Retrieve another accounts
            getAccounts(authors, function (err, result) {
                if (!catchError(err)) {
                    var accounts = {};
                    result.forEach(function (a) {
                        accounts[a.name] = a;
                    });

                    if (homePosts) {
                        //On Session update
                        //Accounts
                        for (var a in accounts) {
                            homePosts.state.accounts[a] = accounts[a];
                        } //Posts


                        for (var _c in state.content) {
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
            var query = getParameterByName('query');

            if (query === homePosts.search && query !== null) {
                //Accounts
                for (var a in state.accounts) {
                    homePosts.state.accounts[a] = parseAccount(state.accounts[a]);
                } //Posts


                for (var _c2 in state.content) {
                    homePosts.state.content[_c2] = parsePost(state.content[_c2]);
                } //Order


                var newPosts = state.discussion_idx[""].search;

                for (var x = 0; x < newPosts.length; x++) {
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
                for (var _a in state.accounts) {
                    homePosts.state.accounts[_a] = parseAccount(state.accounts[_a]);
                } //Posts


                for (var _c3 in state.content) {
                    homePosts.state.content[_c3] = parsePost(state.content[_c3]);
                }

                state = homePosts.state;
            }

            showPosts(urlFilter, filter, state);
        }
    });

    function beforeInit(urlFilter) {
        var path = window.location.pathname;

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
                var search = getParameterByName('query');
                var page = getParameterByName('page') || 1;
                performSearch(search, page, true);
            } else {
                creaEvents.emit('crea.content.filter', path);
            }
        }
    }

    creaEvents.on('crea.session.update', function (s, a) {
        homePosts.session = session = s;
        homePosts.account = account = a;
        beforeInit(homePosts.urlFilter);
    });
    creaEvents.on('crea.session.login', function (s, a) {
        session = s;
        account = a;
        beforeInit();
    });
    var onScrollCalling;
    creaEvents.on('crea.scroll.bottom', function () {
        if (!onScrollCalling) {
            onScrollCalling = true;

            if (isUserFeed()) {
                var http = new HttpClient(apiOptions.apiUrl + '/creary/feed');
                http.when('done', function (response) {
                    var data = jsonify(response).data;

                    if (data.length) {
                        var count = data.length;
                        var discussions = [];
                        var accounts = [];

                        var onContentFetched = function onContentFetched() {
                            count--;

                            if (count <= 0) {
                                getAccounts(accounts, function (err, newAccounts) {
                                    if (!catchError(err)) {
                                        //Update accounts
                                        newAccounts.forEach(function (a) {
                                            homePosts.state.accounts[a.name] = parseAccount(a);
                                        }); //Sort

                                        discussions.sort(function (k1, k2) {
                                            var d1 = toLocaleDate(k1.created);
                                            var d2 = toLocaleDate(k2.created);
                                            return d2.getTime() - d1.getTime();
                                        });
                                        var discuss = homePosts.discuss;
                                        var category = homePosts.category; //Update Posts

                                        discussions.forEach(function (d) {
                                            var permlink = d.author + '/' + d.permlink;
                                            homePosts.state.content[permlink] = d;
                                            homePosts.state.discussion_idx[discuss][category].push(permlink);
                                        });

                                        homePosts.state.discussion_idx[discuss][category] = removeBlockedContents(homePosts.state, account, homePosts.state.discussion_idx[discuss][category]);
                                        homePosts.$forceUpdate();
                                    }

                                    onScrollCalling = false;
                                });
                            } else {
                                onScrollCalling = false;
                            }
                        };

                        data.forEach(function (d) {
                            var permlink = d.author + '/' + d.permlink;

                            if (!homePosts.state.content[permlink]) {
                                crea.api.getContent(d.author, d.permlink, function (err, result) {
                                    if (err) {
                                        console.error('Error getting', permlink, err);
                                    } else {
                                        discussions.push(parsePost(result));

                                        if (!homePosts.state.accounts[d.author] && !accounts.includes(d.author)) {
                                            accounts.push(d.author);
                                        }
                                    }

                                    onContentFetched();
                                });
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
                var username = getPathPart().replace('/', '').replace('@', '');
                crea.api.getFollowing(username, '', 'blog', 1000, function (err, result) {
                    if (!catchError(err)) {
                        var followings = [];
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
                                    page: lastPage
                                });
                            });
                        }
                    }
                });
            } else if (window.location.pathname === '/search') {
                var query = getParameterByName('query');
                var postCount = Object.keys(homePosts.state.content).length;

                if (postCount > 0 && postCount % 20 === 0) {
                    globalLoading.show = true;
                    performSearch(query, ++lastPage, true, function () {
                        onScrollCalling = false;
                        globalLoading.show = false;
                    });
                }
            } else {
                var apiCall;
                var category = homePosts.category;

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
                    apiCall(lastPage.author, lastPage.permlink, 21, function (err, result) {
                        if (err) {
                            console.error(err);
                        } else {
                            //Get new accounts
                            var discussions = result.discussions; //Remove first duplicate post

                            discussions.shift();
                            var accounts = [];

                            for (var x = 0; x < discussions.length; x++) {
                                var d = discussions[x];
                                discussions[x] = parsePost(d);

                                if (!homePosts.state.accounts[d.author] && !accounts.includes(d.author)) {
                                    accounts.push(d.author);
                                }
                            }

                            //Get new accounts
                            getAccounts(accounts, function (err, newAccounts) {
                                if (!catchError(err)) {
                                    //Update accounts
                                    newAccounts.forEach(function (a) {
                                        homePosts.state.accounts[a.name] = a;
                                    }); //Update Posts

                                    var discuss = homePosts.discuss;
                                    discussions.forEach(function (d) {
                                        var permlink = d.author + '/' + d.permlink;
                                        homePosts.state.content[permlink] = d;

                                        homePosts.state.discussion_idx[discuss][category].push(permlink);
                                    });

                                    homePosts.state.discussion_idx[discuss][category] = removeBlockedContents(homePosts.state, account, homePosts.state.discussion_idx[discuss][category]);
                                    lastPage = discussions[discussions.length - 1];
                                    homePosts.$forceUpdate();
                                }

                                onScrollCalling = false;
                            });
                        }
                    });
                }

            }
        }
    });

    creaEvents.on('crea.search.content', function (data) {
        var searchState = {
            content: {},
            accounts: {},
            discussion: []
        };
        var count = 0;

        var onFinish = function onFinish(state) {
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

        var _loop = function _loop(x) {
            var getState = function getState(r) {
                var permalink = r.author + '/' + r.permlink;
                var url = '/' + r.tags[0] + '/@' + permalink;
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

        for (var x = 0; x < data.length; x++) {
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


    creaEvents.on('crea.dom.ready', function () {
        $("#view-changer").click(function () {
            homePosts.toggleSimpleView();
        });
    })
})();