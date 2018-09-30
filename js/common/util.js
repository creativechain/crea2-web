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
 * @param obj
 * @returns {*}
 */
function jsonify(obj) {
    if (obj && typeof obj == 'string') {
        return JSON.parse(obj);
    }

    return obj;
}

function jsonstring(obj) {
    if (obj && typeof obj == 'object') {
        return JSON.stringify(obj);
    }

    return obj;
}
