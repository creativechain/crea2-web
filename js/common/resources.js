"use strict";

/**
 * Created by ander on 22/10/18.
 */
var R = {
    IMG: {
        DEFAULT_AVATAR: ['/img/avatar/avatar1.png', '/img/avatar/avatar2.png', '/img/avatar/avatar3.png', '/img/avatar/avatar4.png', '/img/avatar/avatar5.png'],
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
        LICENSE: {
            ATTRIBUTION: { BLACK: '/img/icons/license/attribution.svg', WHITE: '/img/icons/license/attribution_WHITE.svg' },
            COPYRIGHT: { BLACK: '/img/icons/license/copyright.svg', WHITE: '/img/icons/license/copyright_WHITE.svg' },
            CREATIVE_COMMONS: { BLACK: '/img/icons/license/creativecommons.svg', WHITE: '/img/icons/license/creativecommons_WHITE.svg' },
            FREE_CONTENT: { BLACK: '/img/icons/license/freecontent.svg', WHITE: '/img/icons/license/freecontent_WHITE.svg' },
            NON_COMMERCIAL: { BLACK: '/img/icons/license/noncommercial.svg', WHITE: '/img/icons/license/noncommercial_WHITE.svg' },
            NON_DERIVATES: { BLACK: '/img/icons/license/nonderivates.svg', WHITE: '/img/icons/license/nonderivates_WHITE.svg' },
            SHARE_ALIKE: { BLACK: '/img/icons/license/sharealike.svg', WHITE: '/img/icons/license/sharealike_WHITE.svg' }
        },
        BUZZ: {
            GENIUS: '/img/crea-web/roll/genius.svg',
            GURU: '/img/crea-web/roll/guru.svg',
            MASTER: '/img/crea-web/roll/master.svg',
            INFLUENCER: '/img/crea-web/roll/influencer.svg',
            EXPERT: '/img/crea-web/roll/expert.svg',
            ADVANCED: '/img/crea-web/roll/advanced.svg',
            TRAINEE: '/img/crea-web/roll/trainee.svg',
            NOVICE: '/img/crea-web/roll/novice.svg'
        },
        POST: {
            NSFW: '/img/post/nsfw.jpg'
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
    var buffer = new window.Buffer(username);
    var n = parseInt(buffer.toString('hex'), 16);
    n = n % R.IMG.DEFAULT_AVATAR.length;
    return R.IMG.DEFAULT_AVATAR[n];
};