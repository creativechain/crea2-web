/**
 * Created by ander on 25/09/18.
 */

class IpfsFile {
    constructor(hash, name, type, size) {
        this.hash = hash;
        this.name = name;
        this.type = type;
        this.size = size;
        this.url = 'https://ipfs.io/ipfs/' + hash;
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
    console.log(password);
    let keys = crea.auth.getPrivateKeys(username, password, DEFAULT_ROLES);
    console.log(keys);

    crea.api.getWitnessSchedule(function (err, result) {
        if (err) {
            console.error(err);
            callback(err);
        } else {
            let creationFee = Asset.parse(result.median_props.account_creation_fee);
            crea.broadcast.accountCreate(apiOptions.privCreator, creationFee.toFriendlyString(), apiOptions.accountCreator, username,
                createAuth(keys.ownerPubkey), createAuth(keys.activePubkey), createAuth(keys.postingPubkey), keys.memoPubkey, {}, function (err, result) {
                    console.log(err, result);
                    if (callback) {
                        callback(err, result);
                    }
                });
        }
    })

}

function makeVote(post, callback) {
    let session = Session.getAlive();
    if (session) {
        crea.broadcast.vote(session.account.keys.posting.prv, session.account.username, post.author, post.permlink, 10000, function (err, result) {
            if (err) {
                console.error(err);
            } else {
                console.log(result);
                if (callback) {
                    callback();
                }
            }
        })
    }

    return false;
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
        crea.broadcast.customJson(s.account.keys.posting.prv, [], [s.account.username], 'follow', jsonstring(followJson), function (err, result) {
            if (err) {
                console.error(err);
                callback(err);
            } else {
                callback(null, result);
            }
        })
    } else if (callback) {
        callback(Errors.USER_NOT_LOGGED)
    }
}

function updateUserSession() {
    let session = Session.getAlive();
    if (session) {
        session.login(function (err, account) {
            if (err) {
                console.error(err);
            } else {
                let followings = [];
                crea.api.getFollowing(session.account.username, '', 'blog', 1000, function (err, result) {
                    if (err) {
                        console.error(err);
                    } else {
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

    if (!expiration || expiration <= now) {
        let url = 'https://platform.creativechain.net/oauth/v2/token';
        let http = new HttpClient(url);

        let params = {
            grant_type: 'client_credentials',
            client_id: '1_4juuakri1zqckgo444ows4gckw08so0w848sowkckk40wo8w80',
            client_secret: '5co2o9zprcgskcw0ok4ko0csocwkc44swsko4k0kwks04o0koo'
        };

        http.on('done', function (data) {
            data = JSON.parse(data);
            console.log(data);
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
            //let fr = new FileReader();

            refreshAccessToken(function (accessToken) {
                let http = new HttpClient('https://platform.creativechain.net/ipfs');
                http.setHeaders({
                    Authorization: 'Bearer ' + accessToken
                }).post({
                    file: file
                }).on('done', function (data) {
                    data = jsonify(data);
                    console.log(data);
                    if (callback) {
                        let f = new IpfsFile(data.data.hash, file.name, file.type, file.size);
                        callback(null, f);
                    }
                });

                http.on('fail', function (jqXHR, textStatus, errorThrown) {
                    if (callback) {
                        callback(errorThrown)
                    }
                })

            });

/*            fr.onload = function (loadedFile) {

                let progress = function (uploaded) {
                    console.log('Progress', uploaded);
                };

                let fileData = toBuffer(fr.result);
                console.log(fr.result.byteLength, fileData.length);
                ipfs.files.add(fileData, {progress: progress}, function (err, files) {

                    if (err) {
                        if (callback) {
                            callback(err);
                        }
                    } else if (files.length > 0) {
                        let file = files[0];
                        file = new IpfsFile(file.hash, fileName, mimeType, file.size);
                        console.log('Pushed to ipfs', err, file);
                        if (callback) {
                            callback(null, file);
                        }
                    }

                });
            };
            fr.readAsArrayBuffer(file);*/
        } else {
            globalLoading.show = false;
            console.error('File', file.name, 'too large. Size:', file.size, 'MAX:', maxSize);
            publishContainer.error = lang.PUBLISH.FILE_TO_LARGE;
        }
    } else {
        console.error('File API unsupported');
        globalLoading.show = false;
    }

}

/**
 *
 * @param {string} resource
 * @param {string} filename
 */
function downloadFile(resource, filename) {
    let element = document.createElement('a');
    element.setAttribute('href', resource);
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
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
            lang: lang
        }
    });
});

