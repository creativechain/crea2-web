/**
 * Created by ander on 25/09/18.
 */

class IpfsFile {
    constructor(hash, name, type, size) {
        this.hash = hash;
        this.name = name;
        this.type = type;
        this.size = size;
        this.url = 'https://ipfs.creary.net/ipfs/' + hash;
    }
}

let creaEvents = new EventEmitter();

const ipfs = IpfsApi({
    host: 'ipfs.creary.net',
    port: 443,
    protocol: 'https'
});

let bannerVue;
let globalLoading;

const CONSTANTS = {
    TRANSFER: {
        TRANSFER_CREA: 'transfer_crea',
        TRANSFER_CBD: 'transfer_cbd',
        TRANSFER_TO_SAVINGS_CREA: 'transfer_to_savings_crea',
        TRANSFER_TO_SAVINGS_CBD: 'transfer_to_savings_cbd',
        TRANSFER_FROM_SAVINGS_CREA: 'transfer_from_savings_crea',
        TRANSFER_FROM_SAVINGS_CBD: 'transfer_from_savings_cbd',
        TRANSFER_TO_VESTS: 'transfer_to_vests',
    },
    FILE_MAX_SIZE: {
        AUDIO: 100 * 1024 * 1024,
        VIDEO: 200 * 1024 * 1024,
        IMAGE: 1024 * 1024,
        DOWNLOAD: 200 * 1024 * 1024, //200 MB
    },
    TEXT_MAX_SIZE: {
        PROFILE: {
            PUBLIC_NAME: 21,
            ABOUT: 144,
            CONTACT: 55,
            WEB: 55,
        },
        TITLE: 55,
        DESCRIPTION: 233,
        COMMENT: 233,
        TAG: 21,

    },
    MAX_TAGS: 8,

};

creaEvents.on('crea.session.login', function (session, account) {
    showBanner(session == false);
});

function showBanner(show = true) {
    bannerVue.showBanner = show;
}

function goTo(location) {
    window.location.href = location;
}

function showPost(post) {
    if (!post.url) {
        post.url = '/' + post.metadata.tags[0] + '/@' + post.author + '/' + post.permlink;
    }
    goTo(post.url)
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
    if (filter.startsWith('/popular')) {
        return filter.replace('/popular', '/trending');
    } else if (filter.startsWith('/skyrockets')) {
        return filter.replace('/skyrockets', '/hot');
    } else if (filter.startsWith('/now')) {
        return filter.replace('/now', '/created');
    }

    return filter;
}

function createBlockchainAccount(username, password, callback) {

    let keys = crea.auth.getPrivateKeys(username, password, DEFAULT_ROLES);

    refreshAccessToken(function (accessToken) {
        let http = new HttpClient('https://platform.creativechain.net/createCrearyAccount');

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
            memo: keys.memoPubkey,
        })
    });

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
        post.metadata = jsonify(post.json_metadata);
        post.down_votes = [];
        post.up_votes = [];
        post.active_votes.forEach(function (v) {
            if (v.percent <= -10000) {
                post.down_votes.push(v);
            } else {
                post.up_votes.push(v);
            }
        });

        let toStringAsset = function (data) {
            if (typeof data === 'object') {
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
                for (let x = 0; x < result.length; x++) {
                    result[x] = parseAccount(result[x]);
                }

                callback(null, result);
            }
        }
    })
}

function ignoreUser(following, ignore, callback) {
    let s = Session.getAlive();
    if (s) {
        let followJson = {
            follower: s.account.username,
            following: following,
            what: ignore ? ['ignore'] : [],
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
            })
        });

    } else if (callback) {
        callback(Errors.USER_NOT_LOGGED)
    }
}

function updateUserSession() {
    let session = Session.getAlive();
    if (session) {
        session.login(function (err, account) {
            if (!catchError(err)) {
                let followings = [];
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
        })
    } else {
        creaEvents.emit('crea.session.update', false);
    }
}

function refreshAccessToken(callback) {
    let now = new Date().getTime();
    let expiration = localStorage.getItem(CREARY.ACCESS_TOKEN_EXPIRATION);

    expiration = isNaN(expiration) ? 0 : expiration;

    if (expiration <= now) {
        let url = apiOptions.apiUrl + '/oauth/v2/token';
        let http = new HttpClient(url);

        let params = {
            grant_type: 'client_credentials',
            client_id: local ? '1_11gxxww27idwo0skoo8s4k0g044skswwkcg08c88swgsowkwgk' : '1_4juuakri1zqckgo444ows4gckw08so0w848sowkckk40wo8w80',
            client_secret: local ? 'jf8ltr7u5fk0gwssos4g8w8kwc4owosk4gcs0g4wk4k8ks0wk' : '5co2o9zprcgskcw0ok4ko0csocwkc44swsko4k0kwks04o0koo'
        };

        http.when('done', function (data) {
            data = JSON.parse(data);

            localStorage.setItem(CREARY.ACCESS_TOKEN, data.access_token);
            localStorage.setItem(CREARY.ACCESS_TOKEN_EXPIRATION, new Date().getTime() + (data.expires_in * 1000));

            if (callback) {
                callback(data.access_token)
            }
        });

        http.post(params);
    } else if (callback) {
        let accessToken = localStorage.getItem(CREARY.ACCESS_TOKEN);
        callback(accessToken);
    }

}

function uploadToIpfs(file, maxSize, callback) {
    if (window.File && window.FileReader && window.FileList && window.Blob) {

        if (file.size <= maxSize) {

            refreshAccessToken(function (accessToken) {
                let http = new HttpClient('https://platform.creativechain.net/ipfs');
                http.setHeaders({
                    Authorization: 'Bearer ' + accessToken
                }).post({
                    file: file
                }).when('done', function (data) {
                    data = jsonify(data);
                    console.log(data);
                    if (callback) {
                        let f = new IpfsFile(data.data.hash, file.name, file.type, file.size);
                        callback(null, f);
                    }
                });

                http.when('fail', function (jqXHR, textStatus, errorThrown) {
                    if (callback) {
                        callback(errorThrown)
                    }
                })

            });
        } else {
            globalLoading.show = false;
            console.error('File', file.name, 'too large. Size:', file.size, 'MAX:', maxSize);
            publishContainer.error = getLanguage().PUBLISH.FILE_TO_LARGE;
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
    let element = document.createElement('a');
    element.setAttribute('href', url);
    element.setAttribute('download', filename);
    //element.setAttribute('target', '_blank');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function performSearch(search, page = 1, inHome = false) {
    if (inHome) {
        refreshAccessToken(function (accessToken) {
            let http = new HttpClient('https://platform.creativechain.net/searchCreaContent');
            http.setHeaders({
                Authorization: 'Bearer ' + accessToken
            });

            http.when('done', function (response) {
                let data = jsonify(response).data;

                for (let x = 0; x < data.length; x++) {
                    data[x].tags = jsonify(data[x].tags);
                }

                console.log(data);
                creaEvents.emit('crea.search.content', data);
            });

            http.when('fail', function (jqXHR, textStatus, errorThrown) {
                console.error(jqXHR, textStatus, errorThrown);
                catchError(errorThrown);
            });

            http.get({
                search: search,
                page: page
            });
        })
    } else {
        goTo('/search?query=' + encodeURIComponent(search) + '&page=' + page);
    }
}

/**
 *
 * @param err
 */
function catchError(err) {

    if (err) {

        let title;
        let body = [];

        if (typeof err === 'string') {
            title = err;
        } else {
            if (err.name) {
                title = name;
            }

            if (err.message) {
                body.push(err.message);
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
function showAlert(title, ...body) {
    let config = { title, body};
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
        let id = randomNumber(0, Number.MAX_SAFE_INTEGER);

        let session = Session.getAlive();
        if (session && session.account.keys[role]) {
            callback(session.account.keys[role].prv);
        } else {
            console.log(id);
            creaEvents.on('crea.auth.role.' + id, function (roleKey, username) {
                console.log(roleKey, typeof callback, typeof login);
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

    bannerVue = new Vue({
        el: '#home-banner',
        data: {
            showBanner: false,
            lang: getLanguage()
        }
    });
});