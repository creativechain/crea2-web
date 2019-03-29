"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Created by ander on 10/10/18.
 */
var ASSET_CREA = {
    precision: 3,
    symbol: apiOptions.symbol.CREA
};
var ASSET_CBD = {
    precision: 3,
    symbol: apiOptions.symbol.CBD
};
var ASSET_CGY = {
    precision: 3,
    symbol: apiOptions.symbol.CGY
};
var ASSET_VESTS = {
    precision: 6,
    symbol: apiOptions.symbol.VESTS
};
var NAI = {
    "@@000000013": ASSET_CBD,
    "cbd": ASSET_CBD,
    "@@000000021": ASSET_CREA,
    "crea": ASSET_CREA,
    "@@000000037": ASSET_VESTS,
    "vests": ASSET_VESTS,
    "cgy": ASSET_CGY,
    "@@000000005": ASSET_CGY
};

var MonetaryFormat =
    /*#__PURE__*/
    function () {
        function MonetaryFormat() {
            _classCallCheck(this, MonetaryFormat);

            this.maxDigits = 2;
        }

        _createClass(MonetaryFormat, [{
            key: "digits",
            value: function digits(maxDigits) {
                if (isNaN(maxDigits)) {
                    maxDigits = 2;
                }

                this.maxDigits = maxDigits;
            }
        }, {
            key: "abbr",
            value: function abbr(value) {
                value = parseFloat(value);

                if (value < 10000) {
                    return value;
                }

                var newValue = value;
                var suffixes = ["", "K", "M", "B", "T"];
                var suffixNum = 0;

                while (newValue >= 10000) {
                    newValue /= 1000;
                    suffixNum++;
                }

                newValue = Math.round(newValue * 100) / 100; //2 decimals places

                newValue += suffixes[suffixNum];
                return newValue;
            }
            /**
             *
             * @param {Number} value
             * @param {Number} exponent
             * @param {Boolean} abbr
             * @returns {string}
             */

        }, {
            key: "format",
            value: function format(value, exponent) {
                var abbr = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

                if (typeof value !== "number") {
                    value = 0;
                }

                if (typeof exponent !== "number") {
                    exponent = 2;
                }

                var toFloat = (value / Math.pow(10, exponent)).toFixed(this.maxDigits);

                if (abbr) {
                    return this.abbr(toFloat);
                } else {
                    return toFloat;
                }
            }
        }]);

        return MonetaryFormat;
    }();

var Asset =
    /*#__PURE__*/
    function () {
        /**
         *
         * @param {Number} amount
         * @param {{precision: Number, symbol: String}} asset
         */
        function Asset(amount, asset) {
            _classCallCheck(this, Asset);

            this.amount = amount;
            this.asset = asset;
        }
        /**
         *
         * @param val
         * @returns {Asset}
         */


        _createClass(Asset, [{
            key: "add",
            value: function add(val) {
                if (val.asset.symbol === this.asset.symbol) {
                    this.amount += val.amount;
                }

                return this;
            }
            /**
             *
             * @param val
             * @returns {Asset}
             */

        }, {
            key: "subtract",
            value: function subtract(val) {
                if (val.asset.symbol === this.asset.symbol) {
                    this.amount -= val.amount;
                }

                return this;
            }
            /**
             *
             * @param val
             * @returns {Asset}
             */

        }, {
            key: "divide",
            value: function divide(val) {
                this.amount /= val;
                return this;
            }
            /**
             *
             * @param val
             * @returns {Asset}
             */

        }, {
            key: "multiply",
            value: function multiply(val) {
                this.amount *= val;
                return this;
            }
            /**
             *
             * @param maxDecimals
             * @param {Boolean} abbr
             * @returns {string}
             */

        }, {
            key: "toPlainString",
            value: function toPlainString(maxDecimals) {
                var abbr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

                if (isNaN(maxDecimals) || maxDecimals === null) {
                    maxDecimals = this.asset.precision;
                }

                var mf = new MonetaryFormat();
                mf.digits(maxDecimals);
                return mf.format(Math.abs(this.amount), this.asset.precision, abbr);
            }
        }, {
            key: "toFriendlyString",

            /**
             *
             * @param {Number} maxDecimals
             * @param {Boolean} abbr
             * @returns {string}
             */
            value: function toFriendlyString(maxDecimals) {
                var abbr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
                return this.toPlainString(maxDecimals, abbr) + " " + this.asset.symbol;
            }
        }, {
            key: "toString",
            value: function toString() {
                return this.toFriendlyString(this.asset.precision);
            }
        }, {
            key: "toFloat",

            /**
             *
             * @returns {Number}
             */
            value: function toFloat() {
                return parseFloat(this.toPlainString(null, false));
            }
            /**
             *
             * @param assetData
             * @returns {Asset}
             */

        }], [{
            key: "parse",
            value: function parse(assetData) {
                if (typeof assetData === 'string') {
                    return Asset.parseString(assetData);
                }

                var nai = NAI[assetData.nai] || NAI[assetData.asset.symbol.toLowerCase()];

                if (typeof assetData.amount === 'number') {
                    if (assetData.amount % 1 != 0 || assetData.round) {
                        assetData.amount = Math.round(assetData.amount * Math.pow(10, nai.precision));
                    }
                } else if (typeof assetData.amount === 'string') {
                    assetData.amount = assetData.amount.replace(',', '.');

                    if (!isNaN(assetData.amount)) {
                        if (assetData.amount.indexOf('.') > 0) {
                            assetData.amount = parseFloat(assetData.amount);
                        } else {
                            assetData.amount = parseInt(assetData.amount);
                        }

                        return Asset.parse(assetData);
                    }
                } else {
                    assetData.amount = 0;
                }

                switch (nai) {
                    case ASSET_CBD:
                        return new CreaDollar(assetData.amount);

                    case ASSET_CREA:
                        return new Crea(assetData.amount);

                    case ASSET_CGY:
                        return new CreaEnergy(assetData.amount);

                    case ASSET_VESTS:
                        return new Vests(assetData.amount);
                }

                return undefined;
            }
            /**
             *
             * @param {string} assetString
             * @returns {Asset}
             */

        }, {
            key: "parseString",
            value: function parseString(assetString) {
                var strSplitted = assetString.split(' ');
                var amount = parseFloat(strSplitted[0]);
                var nai = apiOptions.nai[strSplitted[1]];

                if (amount % 1 === 0) {
                    amount = Math.round(amount * Math.pow(10, NAI[nai].precision));
                }

                return Asset.parse({
                    amount: amount,
                    nai: nai
                });
            }
        }]);

        return Asset;
    }();

var Crea =
    /*#__PURE__*/
    function (_Asset) {
        _inherits(Crea, _Asset);

        function Crea(amount) {
            _classCallCheck(this, Crea);

            return _possibleConstructorReturn(this, _getPrototypeOf(Crea).call(this, amount, ASSET_CREA));
        }

        return Crea;
    }(Asset);

var CreaDollar =
    /*#__PURE__*/
    function (_Asset2) {
        _inherits(CreaDollar, _Asset2);

        function CreaDollar(amount) {
            _classCallCheck(this, CreaDollar);

            return _possibleConstructorReturn(this, _getPrototypeOf(CreaDollar).call(this, amount, ASSET_CBD));
        }

        return CreaDollar;
    }(Asset);

var Vests =
    /*#__PURE__*/
    function (_Asset3) {
        _inherits(Vests, _Asset3);

        function Vests(amount) {
            _classCallCheck(this, Vests);

            return _possibleConstructorReturn(this, _getPrototypeOf(Vests).call(this, amount, ASSET_VESTS));
        }

        return Vests;
    }(Asset);

var CreaEnergy =
    /*#__PURE__*/
    function (_Asset4) {
        _inherits(CreaEnergy, _Asset4);

        function CreaEnergy(amount) {
            _classCallCheck(this, CreaEnergy);

            return _possibleConstructorReturn(this, _getPrototypeOf(CreaEnergy).call(this, amount, ASSET_CGY));
        }

        return CreaEnergy;
    }(Asset);