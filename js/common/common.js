"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by ander on 25/09/18.
 */
var IpfsFile = function IpfsFile(hash, name, type, size) {
    _classCallCheck(this, IpfsFile);

    this.hash = hash;
    this.name = name;
    this.type = type;
    this.size = size;
    this.url = 'https://ipfs.creary.net/ipfs/' + hash;
};

var creaEvents = new EventEmitter();

var bannerVue;
var globalLoading;
var CONSTANTS = {
    ACCOUNT: {
        UPDATE_THRESHOLD: 1000 * 60 * 60
    },
    TRANSFER: {
        TRANSFER_CREA: 'transfer_crea',
        TRANSFER_CBD: 'transfer_cbd',
        TRANSFER_TO_SAVINGS_CREA: 'transfer_to_savings_crea',
        TRANSFER_TO_SAVINGS_CBD: 'transfer_to_savings_cbd',
        TRANSFER_FROM_SAVINGS_CREA: 'transfer_from_savings_crea',
        TRANSFER_FROM_SAVINGS_CBD: 'transfer_from_savings_cbd',
        TRANSFER_TO_VESTS: 'transfer_to_vests'
    },
    FILE_MAX_SIZE: {
        PROFILE: {
            IMAGE: 1024 * 500
        },
        POST_BODY: {
            AUDIO: 100 * 1024 * 1024,
            VIDEO: 200 * 1024 * 1024,
            IMAGE: 5 * 1024 * 1024,
            DOWNLOAD: 200 * 1024 * 1024 //200 MB

        },
        POST_PREVIEW: {
            IMAGE: 1024 * 500
        }
    },
    TEXT_MAX_SIZE: {
        PROFILE: {
            PUBLIC_NAME: 21,
            ABOUT: 144,
            CONTACT: 55,
            WEB: 55
        },
        TITLE: 55,
        DESCRIPTION: 233,
        COMMENT: 233,
        TAG: 21,
        PERMLINK: 255
    },
    MAX_TAGS: 8,
    BUZZ: {
        USER_BLOCK_THRESHOLD: -30,
        MAX_LOG_NUM: 20,
        LEVELS: ['novice', 'trainee', 'advanced', 'expert', 'influencer', 'master', 'guru', 'genius']
    }
};
creaEvents.on('crea.session.login', function (session, account) {
    showBanner(session === false);
});

function showBanner() {
    var show = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

    if (bannerVue) {
        bannerVue.showBanner = show;
    }
}

function goTo(location) {
    window.location.href = location;
}

function showPost(post) {
    if (!post.url) {
        post.url = '/' + post.metadata.tags[0] + '/@' + post.author + '/' + post.permlink;
    }

    goTo(post.url);
}

function showProfile(username) {
    username = username.match(/[\w\.\d-]+/gm);
    if (username) {
        goTo('/@' + username);
    }
}

function updateUrl(url) {
    window.history.pushState('', '', url);
}
/**
 *
 * @param {string} location
 */


function toHome(location) {
    if (location) {
        if (window.location.href.indexOf(location) > -1) {
            goTo('/');
        }
    } else {
        goTo('/');
    }
}
/**
 *
 * @param {string} filter
 * @returns {string}
 */


function resolveFilter(filter) {
    filter = filter.toLowerCase();
    /*if (filter.startsWith('/popular')) {
        return filter.replace('/popular', '/trending');
    } else if (filter.startsWith('/skyrockets')) {
        return filter.replace('/skyrockets', '/hot');
    } else if (filter.startsWith('/now')) {
        return filter.replace('/now', '/created');
    }*/

    return filter;
}

/**
 *
 * @returns {boolean}
 */
function isInHome() {
    var filters = ['/skyrockets', '/popular', '/now', '/popular30', '/created', '/promoted', '/votes', '/actives', '/cashout', '/responses', '/payout', '/payout_comments']; //Check if path is user feed

    var s = Session.getAlive();

    if (s && isUserFeed(s.account.username)) {
        return true;
    }

    return filters.includes(window.location.pathname);
}

function createBlockchainAccount(username, password, callback) {
    var keys = crea.auth.getPrivateKeys(username, password, DEFAULT_ROLES);
    refreshAccessToken(function (accessToken) {
        var http = new HttpClient(apiOptions.apiUrl + '/createCrearyAccount');
        http.when('done', function (data) {
            data = jsonify(data);

            if (callback) {
                callback(null, data);
            }
        });
        http.when('fail', function (jqXHR, textStatus, errorThrown) {
            if (callback) {
                callback(errorThrown);
            }
        });
        http.headers = {
            Authorization: 'Bearer ' + accessToken
        };
        http.post({
            username: username,
            active: keys.activePubkey,
            owner: keys.ownerPubkey,
            posting: keys.postingPubkey,
            memo: keys.memoPubkey
        });
    });
}

function removeBlockedContents(state, accountState, discussion_idx) {
    //console.log('State:', jsonify(jsonstring(state)), 'Account:', jsonify(jsonstring(accountState)), 'discussion:', discussion_idx);
    if (state) {
        //Remove post for blocked users
        var cKeys = discussion_idx ? discussion_idx : Object.keys(state.content);

        if (accountState) {
            var allowedContents = [];
            cKeys.forEach(function (ck) {
                var c = state.content[ck];


                //If author is blocked, post must be blocked
                if (accountState.user.blockeds.indexOf(c.author) < 0) {
                    allowedContents.push(ck);
                }
            });

            return allowedContents;
        }

        return cKeys;
    }

    return null;

}

function parseAccount(account) {
    if (account) {
        account.buzz = crea.formatter.reputation(account.reputation, CONSTANTS.BUZZ.LEVELS.length, CONSTANTS.BUZZ.MAX_LOG_NUM);
        //Level 1 for bad users
        if (account.buzz.level <= 0) {
            account.buzz.level = 1
        }
        account.buzz.level_name = CONSTANTS.BUZZ.LEVELS[account.buzz.level -1];
        account.buzz.level_title = lang.BUZZ[account.buzz.level -1];
        account.buzz.blocked = account.buzz.formatted <= CONSTANTS.BUZZ.USER_BLOCK_THRESHOLD;

        account.metadata = jsonify(account.json_metadata);

        if (account.buzz.blocked) {
            account.metadata.avatar = {};
        } else {
            account.metadata.avatar = account.metadata.avatar || {};
        }

        account.metadata.adult_content = account.metadata.adult_content || 'hide';
        account.metadata.post_rewards = account.metadata.post_rewards || '50';
        account.metadata.comment_rewards = account.metadata.comment_rewards || '50';
        account.metadata.lang = account.metadata.lang || getNavigatorLanguage();


        //console.log(jsonify(jsonstring(account)));
        return account;
    }

    return account;
}

function parsePost(post, reblogged_by ) {
    if (!reblogged_by || !Array.isArray(reblogged_by)) {
        reblogged_by = []
    }

    if (post) {
        post.link = post.author + '/' + post.permlink;
        post.body = isJSON(post.body) ? jsonify(post.body) : post.body;
        post.body = cleanArray(post.body);
        post.metadata = jsonify(post.json_metadata);
        post.down_votes = [];
        post.up_votes = [];
        post.active_votes.forEach(function (v) {
            if (v.percent < 0) {
                //Content reports
                post.down_votes.push(v);
            } else if (v.percent > 0) {
                //Content likes
                post.up_votes.push(v);
            }
        });

        var toStringAsset = function toStringAsset(data) {
            if (_typeof(data) === 'object') {
                return Asset.parse(data).toFriendlyString(null, false);
            }

            return data;
        };

        post.curator_payout_value = toStringAsset(post.curator_payout_value);
        post.max_accepted_payout = toStringAsset(post.max_accepted_payout);
        post.pending_payout_value = toStringAsset(post.pending_payout_value);
        post.promoted = toStringAsset(post.promoted);
        post.total_payout_value = toStringAsset(post.total_payout_value);
        post.total_pending_value = toStringAsset(post.total_pending_value);

        if (!post.reblogged_by || post.reblogged_by.length === 0) {
            post.reblogged_by = reblogged_by;
        }
    }

    return post;
}

function getAccounts(accounts, callback) {
    crea.api.getAccounts(accounts, function (err, result) {
        if (callback) {
            if (err) {
                callback(err);
            } else {
                for (var x = 0; x < result.length; x++) {
                    result[x] = parseAccount(result[x]);
                }

                callback(null, result);
            }
        }
    });
}

function getDiscussion(author, permlink, callback) {

    if (typeof permlink === 'function') {
        callback = permlink;
        var all;
        [all, author, permlink] = /([\w\.\d-]+)\/([\w\d-]+)/gm.exec(author);
    } else {
        author = /[\w\.\d-]+/gm.exec(author)[0];
    }

    crea.api.getDiscussion(author, permlink, callback);
}

function recommendPost(author, permlink, reblog, callback) {
    var s = Session.getAlive();

    if (s) {
        if (typeof reblog === 'function') {
            callback = reblog;
            reblog = true;
        }

        var recommendedJson = {
            account: s.account.username,
            author: author,
            permlink: permlink
        };

        recommendedJson = [reblog ? 'reblog' : 'unreblog', recommendedJson];

        requireRoleKey(s.account.username, 'posting', function (postingKey) {
            crea.broadcast.customJson(postingKey, [], [s.account.username], 'follow', jsonstring(recommendedJson), function (err, result) {

                if (callback) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, result);
                    }
                }
            });
        });
    }

}
function ignoreUser(following, ignore, callback) {
    var s = Session.getAlive();

    if (s) {
        var followJson = {
            follower: s.account.username,
            following: following,
            what: ignore ? ['ignore'] : []
        };
        followJson = ['follow', followJson];
        requireRoleKey(s.account.username, 'posting', function (postingKey) {
            globalLoading.show = true;
            crea.broadcast.customJson(postingKey, [], [s.account.username], 'follow', jsonstring(followJson), function (err, result) {
                globalLoading.show = false;

                if (callback) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, result);
                    }
                }
            });
        });
    } else if (callback) {
        callback(Errors.USER_NOT_LOGGED);
    }
}

function updateUserSession() {
    var session = Session.getAlive();

    if (session) {
        session.login(function (err, account) {
            if (!catchError(err)) {
                var count = 2;

                var onTaskEnded = function onTaskEnded(session, account) {
                    --count;

                    if (count === 0) {
                        creaEvents.emit('crea.session.login', session, account);
                    }
                };

                var followings = [];
                var blockeds = [];
                crea.api.getFollowing(session.account.username, '', 'blog', 1000, function (err, result) {
                    if (!catchError(err)) {
                        result.following.forEach(function (f) {
                            followings.push(f.following);
                        });
                        account.user.followings = followings;
                        onTaskEnded(session, account);
                    }
                });
                crea.api.getFollowing(session.account.username, '', 'ignore', 1000, function (err, result) {
                    if (!catchError(err)) {
                        result.following.forEach(function (f) {
                            blockeds.push(f.following);
                        });
                        account.user.blockeds = blockeds;
                        onTaskEnded(session, account);
                    }
                });
            }
        });
    } else {
        creaEvents.emit('crea.session.update', false);
    }
}

function refreshAccessToken(callback) {
    var now = new Date().getTime();
    var expiration = localStorage.getItem(CREARY.ACCESS_TOKEN_EXPIRATION);
    expiration = isNaN(expiration) ? 0 : expiration;

    if (expiration <= now) {
        var url = apiOptions.apiUrl + '/oauth/v2/token';
        var http = new HttpClient(url);
        var params = {
            grant_type: 'client_credentials',
            client_id: '1_2e5ws1sr915wk0o4kksc0swwoc8kc4wgkgcksscgkkko404g8c',
            client_secret: '3c2x9uf9uwg0ook0kksk8koccsk44w0gg4csos04ows444ko4k'
        };
        http.when('done', function (data) {
            data = JSON.parse(data);
            localStorage.setItem(CREARY.ACCESS_TOKEN, data.access_token);
            localStorage.setItem(CREARY.ACCESS_TOKEN_EXPIRATION, new Date().getTime() + data.expires_in * 1000);

            if (callback) {
                callback(data.access_token);
            }
        });
        http.post(params);
    } else if (callback) {
        var accessToken = localStorage.getItem(CREARY.ACCESS_TOKEN);
        callback(accessToken);
    }
}

function resizeImage(file, callback) {
    var MAX_PIXEL_SIZE = 500;
    console.log(file);
    if (file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/jpeg') {
        //Only PNG, JPG, JPEG

        var reader = new FileReader();
        reader.onload = function (event) {

            var tmpImage = new Image();

            tmpImage.onload = function () {
                var options;
                if (tmpImage.width <= tmpImage.height && tmpImage.width > MAX_PIXEL_SIZE) {
                    options = {
                        maxWidth: MAX_PIXEL_SIZE,
                        maxHeight: Infinity
                    }
                } else if (tmpImage.height <= tmpImage.width && tmpImage.height > MAX_PIXEL_SIZE) {
                    options = {
                        maxWidth: Infinity,
                        maxHeight: MAX_PIXEL_SIZE
                    }
                }

                if (options) {
                    options.quality = 0.8;
                    options.success = function (result) {
                        console.log(result);
                        if (callback) {
                            callback(result);
                        }
                    };

                    new Compressor(file, options);
                } else if (callback) {
                    //Nothing to do
                    callback(file);
                }
            };

            tmpImage.src = event.target.result;
        };

        reader.readAsDataURL(file);
    } else if (callback) {
        callback(file);
    }
}

function uploadToIpfs(file, maxSize, callback) {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        if (!maxSize) {
            //If maxSize is undefined means that file format is not allowed
            if (callback) {
                callback(lang.PUBLISH.FILE_FORMAT_NOT_ALLOWED);
            }
        } else if (file.size <= maxSize) {
            refreshAccessToken(function (accessToken) {
                var http = new HttpClient(apiOptions.ipfsd);
                http.setHeaders({
                    Authorization: 'Bearer ' + accessToken
                }).post({
                    file: file
                }).when('done', function (data) {
                    data = jsonify(data);
                    console.log(data);

                    if (callback) {
                        var f = new IpfsFile(data.data.hash, file.name, file.type, file.size);
                        callback(null, f);
                    }
                });
                http.when('fail', function (jqXHR, textStatus, errorThrown) {
                    if (callback) {
                        callback(errorThrown);
                    }
                });
            });
        } else {
            globalLoading.show = false;
            console.error('File', file.name, 'too large. Size:', file.size, 'MAX:', maxSize);

            if (callback) {
                callback(lang.PUBLISH.FILE_TOO_LARGE);
            }
        }
    } else {
        globalLoading.show = false;
    }
}


/**
 *
 * @param {string} url
 * @param {string} filename
 */


function downloadFile(url, filename) {
    var element = document.createElement('a');
    element.setAttribute('href', url);
    element.setAttribute('download', filename); //element.setAttribute('target', '_blank');

    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function performSearch(search) {
    var page = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    var inHome = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var callback = arguments.length > 3 ? arguments[3] : undefined;
    var path = '/search?query=' + encodeURIComponent(search) + '&page=' + page;

    if (inHome) {
        updateUrl(path);
        refreshAccessToken(function (accessToken) {
            var http = new HttpClient(apiOptions.apiUrl + '/searchCreaContent');
            http.setHeaders({
                Authorization: 'Bearer ' + accessToken
            });
            http.when('done', function (response) {
                var data = jsonify(response).data;

                for (var x = 0; x < data.length; x++) {
                    data[x].tags = jsonify(data[x].tags);
                }

                creaEvents.emit('crea.search.content', data);

                if (callback) {
                    callback();
                }
            });
            http.when('fail', function (jqXHR, textStatus, errorThrown) {
                console.error(jqXHR, textStatus, errorThrown);
                catchError(errorThrown);
            });
            http.get({
                search: search,
                page: page
            });
        });
    } else {
        goTo(path);
    }
}
/**
 *
 * @param err
 */


function catchError(err) {
    if (err) {
        var title;
        var body = [];

        if (err.stack) {
            console.trace(err.stack);
        } else {
            console.error(err);
            switch (err) {
                case 1:
                case 2:
                    err = lang.ERROR[err];
            }

            console.log(err);
        }

        if (typeof err === 'string') {
            title = err;
        } else {
            if (err.name) {
                title = name;
            } else if (err.TITLE) {
                title = err.TITLE;
            }

            if (err.message) {
                var m = err.message.split(':');
                var message = m[m.length - 1];
                console.error(message);

                //RC Special case
                if (message === ' Account does not have enough flow to vote.' ||
                    message.includes('RC. Please wait to transact, or energize CREA.')) {
                    title = lang.ERROR.INSUFFICIENT_RC.TITLE;
                    body = lang.ERROR.INSUFFICIENT_RC.BODY;
                    console.log(body)
                } else {
                    body.push(message);
                }
            }

            if (err.BODY) {
                body = err.BODY;
            }
        }

        showAlert(title, body);
        return true;
    }

    return false;
}
/**
 *
 * @param {string} title
 * @param {...string} body
 */


function showAlert(title, body) {
    var config = {
        title: title,
        body: typeof body === 'string' ? [body] : body
    };

    console.log(config);
    creaEvents.emit('crea.alert', config);
}
/**
 *
 * @param {string} username
 * @param {string} role
 * @param {boolean} login
 * @param {function} callback
 */


function requireRoleKey(username, role, login, callback) {
    if (typeof login === 'function') {
        callback = login;
        login = false;
    }

    if (callback) {
        var id = randomNumber(0, Number.MAX_SAFE_INTEGER);
        var session = Session.getAlive();

        if (session && session.account.keys[role]) {
            callback(session.account.keys[role].prv, session.account.username);
        } else {
            creaEvents.on('crea.auth.role.' + id, function (roleKey, username) {
                if (callback) {
                    callback(roleKey, username);
                }

                creaEvents.off('crea.auth.role.' + id);
            });
            creaEvents.emit('crea.auth.role', username, role, login, id);
        }
    }
}

creaEvents.on('crea.content.prepare', function () {
    globalLoading = new Vue({
        el: '#global-loading',
        data: {
            show: false
        }
    });

    if (document.getElementById('home-banner') !== null) {
        bannerVue = new Vue({
            el: '#home-banner',
            data: {
                showBanner: false,
                lang: lang
            }
        });
    }
});