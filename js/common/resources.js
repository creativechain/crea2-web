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
        }
    }
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