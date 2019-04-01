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
            IMAGE: 1024 * 1024
        },
        POST_BODY: {
            AUDIO: 100 * 1024 * 1024,
            VIDEO: 200 * 1024 * 1024,
            IMAGE: 5 * 1024 * 1024,
            DOWNLOAD: 200 * 1024 * 1024 //200 MB

        },
        POST_PREVIEW: {
            IMAGE: 1024 * 1024
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
    MAX_TAGS: 8
};
creaEvents.on('crea.session.login', function (session, account) {
    showBanner(session == false);
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
    if (!username.startsWith('/@')) {
        username = '/@' + username;
    }

    goTo(username);
}

function updateUrl(url) {
    window.history.pushState('', '', url);
}
/**
 *
 * @param {string} location
 */


function toHome(location) {
    console.log('Real location:', window.location.href, 'Checked location:', location, location && window.location.href.indexOf(location) > -1);

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
    var filters = ['/hot', '/trending', '/trending30', '/created', '/promoted', '/votes', '/actives', '/cashout', '/responses', '/payout', '/payout_comments', '/skyrockets', '/popular', '/now']; //Check if path is user feed

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
    if (state) {
        //Remove post for blocked users
        var cKeys = discussion_idx ? discussion_idx : Object.keys(state.content);

        if (accountState) {
            var allowedContents = [];
            console.log(jsonify(jsonstring(accountState.user)));
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
        account.metadata = jsonify(account.json_metadata);
        account.metadata.avatar = account.metadata.avatar || {};
        return account;
    }

    return account;
}

function parsePost(post) {
    if (post) {
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

                if (err) {
                    callback(err);
                } else {
                    callback(null, result);
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
                var followings = [];
                crea.api.getFollowing(session.account.username, '', 'blog', 1000, function (err, result) {
                    if (!catchError(err)) {
                        result.following.forEach(function (f) {
                            followings.push(f.following);
                        });
                        account.user.followings = followings;
                        creaEvents.emit('crea.session.update', session, account);
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

function uploadToIpfs(file, maxSize, callback) {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        if (file.size <= maxSize) {
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
                callback(lang.PUBLISH.FILE_TO_LARGE);
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

        if (typeof err === 'string') {
            title = err;
        } else {
            if (err.name) {
                title = name;
            }

            if (err.message) {
                var m = err.message.split(':');
                body.push(m[m.length - 1]);
            }
        }

        body.unshift(title);
        showAlert.apply(null, body);
        return true;
    }

    return false;
}
/**
 *
 * @param {string} title
 * @param {...string} body
 */


function showAlert(title) {
    for (var _len = arguments.length, body = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        body[_key - 1] = arguments[_key];
    }

    var config = {
        title: title,
        body: body
    };
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
            console.log(id);
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