/**
 * Created by ander on 29/09/18.
 */

if (!String.format) {
    /**
     *
     * @param {string} format
     * @param args
     * @return {*|void|XML|string}
     */
    String.format = function(format, ...args) {
        let splitter = '%s';
        let parts = format.split(splitter);
        let newFormat = '';

        for (let x = 0; x < parts.length; x++) {
            let r = args[x];
            if (!r) {
                r = ''
            }

            newFormat += parts[x];
            newFormat += r;
        }

        return newFormat;
    };
}

String.prototype.isEmpty = function() {
    return (this.length === 0 || !this.trim());
};

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

/**
 *
 * @param {Event} event
 */
function cancelEventPropagation(event) {
    if (event && event.preventDefault) {
        event.preventDefault();
    }
}

/**
 *
 * @param obj
 * @returns {*}
 */
function jsonify(obj) {
    if (obj && typeof obj == 'string') {
        try {
            return JSON.parse(obj);
        } catch (e) {
            console.error('JSON error', e, 'Object:', obj);
        }
    }

    return {};
}

function jsonstring(obj) {
    if (obj && typeof obj == 'object') {
        return JSON.stringify(obj);
    }

    return obj;
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

/**
 *
 * @param name
 * @param url
 * @returns {*}
 */
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

/**
 *
 * @param base64
 * @returns {ArrayBuffer}
 */
function base64ToBuffer(base64) {
    let binary_string = window.atob(base64);
    let len = binary_string.length;
    let bytes = new Uint8Array( len );
    for (let i = 0; i < len; i++)        {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}

/**
 *
 * @param ab
 * @returns {*|s|i|l|o|t}
 */
function toBuffer(ab) {
    let buf = new ipfs.Buffer(ab.byteLength);
    let view = new Uint8Array(ab);
    for (let i = 0; i < buf.length; ++i) {
        buf[i] = view[i];
    }
    return buf;
}

/**
 *
 * @param {string} str
 * @returns {string}
 */
function toPermalink(str) {
    var re = /[^a-z0-9]+/gi; // global and case insensitive matching of non-char/non-numeric
    var re2 = /^-*|-*$/g;     // get rid of any leading/trailing dashes
    str = str.replace(re, '-');  // perform the 1st regexp
    return str.replace(re2, '').toLowerCase();
}

function createAuth(key) {
    return {
        weight_threshold: 1,
        account_auths: [],
        key_auths: [
            [key, 1]
        ]
    }
}

function copyToClipboard(element) {
    if (element) {
        element.select();

        try {
            document.execCommand('copy');
        } catch (err) {
            console.error()
        }
    }
}

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 *
 * @param {string|number|Date} date
 * @returns {Date}
 */
function toLocaleDate(date) {
    if (date) {
        if (typeof date == 'string' || typeof date == 'number') {
            date = new Date(date);
        }

        if (typeof date == 'object') {
            let newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
            let offset = date.getTimezoneOffset() / 60;
            let hours = date.getHours();

            newDate.setHours(hours - offset);
            return newDate;
        }
    }

    return new Date(0);
}

/**
 *
 * @param src
 * @returns {*}
 */
function clone(src) {
    return Object.assign({}, src);
}

function humanFileSize(size) {
    const UNIT = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let i = Math.floor( Math.log(size) / Math.log(1024) );
    return ( size / Math.pow(1024, i) ).toFixed(2) * 1 + ' ' + UNIT[i];
}

/**
 *
 * @param {string} username
 * @returns {boolean}
 */
function isUserFeed(username) {
    let path = window.location.pathname;
    if (username.startsWith('@')) {
        username = '/' + username;
    } else if (!username.startsWith('/@')) {
        username = '/@' + username;
    }

    let feed = username + '/feed';
    console.log('Checking feed', path, feed);
    return path === feed;
}

/**
 *
 * @param index
 * @returns {string}
 */
function getPathPart(index = 0) {
    let path = window.location.pathname;
    let parts = path.split('/');
    parts.splice(0, 1);

    return parts[index];
}