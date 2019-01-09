/**
 * Created by ander on 22/10/18.
 */

const R = {
    IMG: {
        DEFAULT_AVATAR: ['/img/avatar/avatar1.png', '/img/avatar/avatar2.png', '/img/avatar/avatar3.png',
            '/img/avatar/avatar4.png', '/img/avatar/avatar5.png'],
        LIKE: {
            BORDER: '/img/crea-web/like/like.svg',
            BLUE: {
                BORDER: '/img/crea-web/like/like_BLUE.svg',
                FILLED: '/img/crea-web/like/like_ACT_BLUE.svg'
            },
            RED: {
                BORDER: '/img/crea-web/like/like_RED.svg',
                FILLED: '/img/crea-web/like/like_ACT_RED.svg'
            }
        },
        BUZZ: {
            GENIUS: '/img/crea-web/roll/genius.svg',
            GURU: '/img/crea-web/roll/guru.svg',
            MASTER: '/img/crea-web/roll/master.svg',
            INFLUENCER: '/img/crea-web/roll/influencer.svg',
            EXPERT: '/img/crea-web/roll/expert.svg',
            ADVANCED: '/img/crea-web/roll/advanced.svg',
            TRAINEE: '/img/crea-web/roll/trainee.svg',
            NOVICE: '/img/crea-web/roll/novice.svg',
        }
    }
};

/**
 *
 * @param account
 * @returns {string}
 */
R.getAvatar = function (account) {
    if (account.metadata && account.metadata.avatar) {
        if (account.metadata.avatar.hash) {
            return 'https://ipfs.creary.net/ipfs/' + account.metadata.avatar.hash;
        } else if (account.metadata.avatar.url) {
            return account.metadata.avatar.url;
        }
    }

    return R.getDefaultAvatar(account.name);
};

/**
 *
 * @param username
 * @returns {string}
 */
R.getDefaultAvatar = function (username) {
    let buffer = new window.Buffer(username);
    let n = parseInt(buffer.toString('hex'), 16);
    n = n % R.IMG.DEFAULT_AVATAR.length;
    return R.IMG.DEFAULT_AVATAR[n];
};