"use strict";

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Created by ander on 16/10/18.
 */
var LicensePermission =
    /*#__PURE__*/
    function () {
        /**
         *
         * @param {number} flag
         * @param {string} name
         * @param {string} tag
         * @param {Object} icons
         */
        function LicensePermission(flag, name, tag, icons) {
            var showName = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;

            _classCallCheck(this, LicensePermission);

            this.flag = flag;
            this.name = name;
            this.tag = tag;
            this.icons = icons;
            this.showName = showName;
        }

        _createClass(LicensePermission, [{
            key: "getIcon",
            value: function getIcon(color) {
                color = color ? color : 'WHITE';
                color = color.toUpperCase();
                return this.icons[color];
            }
        }]);

        return LicensePermission;
    }();

var License =
    /*#__PURE__*/
    function () {
        /**
         *
         * @param {...} licensePermissions
         */
        function License() {
            _classCallCheck(this, License);

            for (var _len = arguments.length, licensePermissions = new Array(_len), _key = 0; _key < _len; _key++) {
                licensePermissions[_key] = arguments[_key];
            }

            this.licensePermissions = licensePermissions || [];
        }
        /**
         *
         * @param {LicensePermission} licensePermission
         * @param {number} index
         */


        _createClass(License, [{
            key: "add",
            value: function add(licensePermission) {
                var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1;

                if (index > -1) {
                    this.licensePermissions.splice(index, 0, licensePermission);
                } else {
                    this.licensePermissions.push(licensePermission);
                }
            }
            /**
             *
             * @param {LicensePermission} licensePermission
             */

        }, {
            key: "remove",
            value: function remove(licensePermission) {
                var index = this.licensePermissions.indexOf(licensePermission);

                if (index > -1) {
                    this.licensePermissions.splice(index, 1);
                }
            }
        }, {
            key: "clear",
            value: function clear() {
                this.licensePermissions.splice(0, this.licensePermissions.length);
            }
            /**
             *
             * @param color
             * @returns {Array}
             */

        }, {
            key: "getIcons",
            value: function getIcons() {
                var color = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
                var icons = [];
                this.licensePermissions.forEach(function (perm) {
                    icons.push(perm.getIcon(color));
                });
                return icons;
            }
        }, {
            key: "getFlag",
            value: function getFlag() {
                var flag = 0;
                this.licensePermissions.forEach(function (perm) {
                    flag = flag | perm.flag;
                });
                return flag;
            }
            /**
             *
             * @returns {string}
             */

        }, {
            key: "getLink",
            value: function getLink() {
                return LICENSE_LINKS[this.getFlag()];
            }
            /**
             *
             * @param flag
             * @returns {boolean}
             */

        }, {
            key: "has",
            value: function has(flag) {
                var flags = this.getFlag();
                return flag === (flags & flag);
            }
            /**
             *
             * @returns {boolean}
             */

        }, {
            key: "isCreativeCommons",
            value: function isCreativeCommons() {
                return this.has(0x01);
            }
            /**
             *
             * @returns {string}
             */

        }, {
            key: "toString",
            value: function toString() {
                var str = '';
                this.licensePermissions.forEach(function (perm) {
                    if (perm.showName) {
                        if (!str.isEmpty()) {
                            str += ' + ';
                        }

                        str += perm.name;
                    }
                });
                return str;
            }
            /**
             *
             * @returns {string}
             */

        }, {
            key: "getTags",
            value: function getTags() {
                var tags = [];
                this.licensePermissions.forEach(function (perm) {
                    tags.push(perm.tag);
                });
                return (this.isCreativeCommons() ? 'Creative Commons ' : '') + tags.join('-');
            }
        }, {
            key: "toLocaleString",
            value: function toLocaleString() {
                var str = '';
                this.licensePermissions.forEach(function (perm) {
                    if (perm.showName) {
                        if (!str.isEmpty()) {
                            str += '-';
                        }

                        str += getLanguage().LICENSE[perm.name.toUpperCase()];
                    }
                });
                return str;
            }
            /**
             *
             * @param flag
             * @returns {License}
             */

        }], [{
            key: "fromFlag",
            value: function fromFlag(flag) {
                if (flag === 0) {
                    return new License(LICENSE.NO_LICENSE);
                } else {
                    var license = new License();

                    var checkPerm = function checkPerm(perm) {
                        var f = flag & perm.flag;

                        if (f === perm.flag) {
                            license.add(perm);
                        }
                    };

                    checkPerm(LICENSE.CREATIVE_COMMONS);
                    checkPerm(LICENSE.ATTRIBUTION);
                    checkPerm(LICENSE.NON_COMMERCIAL);
                    checkPerm(LICENSE.SHARE_ALIKE);
                    checkPerm(LICENSE.NON_DERIVATES);
                    checkPerm(LICENSE.NON_PERMISSION);
                    checkPerm(LICENSE.FREE_CONTENT);
                    return license;
                }
            }
        }]);

        return License;
    }();

var LICENSE = {
    NO_LICENSE: new LicensePermission(0x00, 'WithoutLicense', 'WL', {}),
    CREATIVE_COMMONS: new LicensePermission(0x01, 'CreativeCommons', 'CC', R.IMG.LICENSE.CREATIVE_COMMONS, false),
    ATTRIBUTION: new LicensePermission(0x02, 'Attribution', 'BY', R.IMG.LICENSE.ATTRIBUTION),
    SHARE_ALIKE: new LicensePermission(0x04, 'ShareAlike', 'SA', R.IMG.LICENSE.SHARE_ALIKE),
    NON_COMMERCIAL: new LicensePermission(0x08, 'NonCommercial', 'NC', R.IMG.LICENSE.NON_COMMERCIAL),
    NON_DERIVATES: new LicensePermission(0x10, 'NonDerivates', 'ND', R.IMG.LICENSE.NON_DERIVATES),
    NON_PERMISSION: new LicensePermission(0x20, getLanguage().LICENSE.NON_PERMISSION, getLanguage().LICENSE.NON_PERMISSION, R.IMG.LICENSE.COPYRIGHT),
    FREE_CONTENT: new LicensePermission(0x80, 'FreeContent', 'CC0', R.IMG.LICENSE.FREE_CONTENT)
};
var LICENSE_LINKS = {
    3: 'https://creativecommons.org/licenses/by/4.0/',
    7: 'https://creativecommons.org/licenses/by-sa/4.0/',
    11: 'https://creativecommons.org/licenses/by-nc/4.0/',
    15: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    19: 'https://creativecommons.org/licenses/by-nd/4.0/',
    27: 'https://creativecommons.org/licenses/by-nc-nd/4.0/',
    129: 'https://creativecommons.org/publicdomain/zero/1.0/'
};