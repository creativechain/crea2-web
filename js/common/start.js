/**
 * Created by ander on 7/12/18.
 */

$.holdReady(true);

/**
 *
 * @returns {{set: set, get: (function(*=): *), remove: remove}}
 * @constructor
 */
var CookieManager = function() {
    return {
        get: function(name) {
            return Cookies.get(name);
        },
        set: function(name, value, attributes) {
            Cookies.set(name, value, attributes);
        },
        remove: function(name, attributes) {
            Cookies.remove(name, attributes);
        }
    };
};

/**
 *
 * @param attributes
 * @returns {{set: set, get: (function(*=): *), remove: remove}}
 */
function createCookieInstance(attributes) {
    var m = CookieManager();
    return {
        get: function(name) {
            return m.get(name);
        },
        set: function(name, value) {
            m.set(name, value, attributes);
        },
        remove: function(name) {
            m.remove(name, attributes);
        }
    }
}

var CreaCookies = createCookieInstance({
    domain: window.location.hostname
});