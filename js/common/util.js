"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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
    String.format = function (format) {
        var splitter = '%s';
        var parts = format.split(splitter);
        var newFormat = '';

        for (var x = 0; x < parts.length; x++) {
            var r = x + 1 < 1 || arguments.length <= x + 1 ? undefined : arguments[x + 1];

            if (!r) {
                r = '';
            }

            newFormat += parts[x];
            newFormat += r;
        }

        return newFormat;
    };
}

String.prototype.isEmpty = function () {
    return this.length === 0 || !this.trim();
};

String.prototype.capitalize = function () {
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

function isJSON(string) {
    try {
        JSON.parse(string);
        return true;
    } catch (e) {}

    return false;
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

/**
 *
 * @param obj
 * @returns {string}
 */
function jsonstring(obj) {
    if (obj && typeof obj== 'object') {
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
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
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
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);

    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }

    return bytes.buffer;
}

/**
 *
 * @param {string} str
 * @returns {string}
 */


function toPermalink(str) {
    var re = /[^a-z0-9]+/gi; // global and case insensitive matching of non-char/non-numeric

    var re2 = /^-*|-*$/g; // get rid of any leading/trailing dashes

    str = str.replace(re, '-'); // perform the 1st regexp

    return str.replace(re2, '').toLowerCase();
}

function createAuth(key) {
    return {
        weight_threshold: 1,
        account_auths: [],
        key_auths: [[key, 1]]
    };
}

function copyToClipboard(element) {
    if (element) {

        if (typeof element == 'string') {
            element = document.getElementById(element);
        }

        element.select();

        try {
            document.execCommand('copy');
        } catch (err) {
            console.error();
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

        if (_typeof(date) == 'object') {
            var newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
            var offset = date.getTimezoneOffset() / 60;
            var hours = date.getHours();
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
    var UNIT = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    var i = Math.floor(Math.log(size) / Math.log(1024));
    return (size / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + UNIT[i];
}
/**
 *
 * @param {string} username
 * @returns {boolean}
 */


function isUserFeed() {
    var username = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var path = window.location.pathname;
    var regexp = '(\/@[a-zA-Z0-9]+\/feed)';

    if (username) {
        username = username.replace('@', '');
        regexp = '(\/@' + username + '\/feed)';
    }

    return new RegExp(regexp).exec(path) !== null;
}
/**
 *
 * @param {string} string
 * @returns {string}
 */


function toUrl(string) {
    if (string) {
        if (!string.startsWith('http://') && !string.startsWith('https://')) {
            string = 'http://' + string;
        }

        return string;
    }

    return null;
}
/**
 *
 * @param index
 * @returns {string}
 */


function getPathPart() {
    var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var path = window.location.pathname;
    var parts = path.split('/');
    parts.splice(0, 1);
    return parts[index] || '';
}

function getNavigatorLanguage() {
    return navigator.language.split('-')[0];
}
/**
 *
 * @param {Array} array
 * @returns {Array}
 */


function cleanArray(array) {
    if (Array.isArray(array)) {
        var elements = [];
        array.forEach(function (el) {
            if (el) {
                elements.push(el);
            }
        });
        return elements;
    }

    return array;
}
/**
 *
 * @returns {boolean}
 */


function isSmallScreen() {
    return window.screen.width < 768;
}

/**
 *
 * @param {string} text
 * @returns {string}
 */
function removeEmojis(text) {
    if (text && _typeof(text) == 'string') {
        return text.replace(/([\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
    }

    return '';
}

function NaNOr(number, defaultN) {
    if (!isNaN(number)) {
        return number;
    }

    if (defaultN !== undefined && defaultN !== null && !isNaN(defaultN)) {
        return defaultN;
    }

    return NaN;
}

/**
 *
 * @param obj1
 * @param obj2
 * @returns {boolean}
 */
function isEqual(obj1, obj2) {
    if (typeof obj1 !== typeof obj2) {
        return false;
    }

    var jObj1 = jsonstring(obj1);
    var jObj2 = jsonstring(obj2);
    return jObj1 === jObj2;
}