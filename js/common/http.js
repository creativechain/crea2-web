"use strict";

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * Created by ander on 11/10/18.
 */
var HttpClient =
    /*#__PURE__*/
    function (_EventEmitter) {
        _inherits(HttpClient, _EventEmitter);

        function HttpClient(url) {
            var _this;

            _classCallCheck(this, HttpClient);

            _this = _possibleConstructorReturn(this, _getPrototypeOf(HttpClient).call(this));
            _this.id = randomNumber(0, Number.MAX_SAFE_INTEGER);
            _this.url = url;
            _this.params = null;
            _this.method = null;
            _this.headers = {};
            _this.mimeType = 'multipart/form-data';
            _this.contentType = false;
            _this.xhr = null;
            return _this;
        }

        _createClass(HttpClient, [{
            key: "__exec",
            value: function __exec() {
                var that = this;
                var settings = {
                    url: this.url,
                    method: this.method,
                    headers: this.headers,
                    mimeType: this.mimeType,
                    contentType: this.contentType,
                    crossDomain: true,
                    processData: false
                };

                if (this.params) {
                    if (this.method === 'GET') {
                        settings.processData = true;
                        settings.data = this.params;
                    } else {
                        var form = new FormData();
                        var keys = Object.keys(this.params);
                        keys.forEach(function (k) {
                            form.append(k, that.params[k]);
                        });
                        settings.data = form;
                    }
                }

                this.xhr = $.ajax(settings).done(function (data, textStatus, jqXHR) {
                    that.emit('done' + that.id, data, textStatus, jqXHR);
                }).fail(function (jqXHR, textStatus, errorThrown) {
                    that.emit('fail' + that.id, jqXHR, textStatus, errorThrown);
                }).always(function (data, textStatus, jqXHR) {
                    that.emit('always' + that.id, data, textStatus, jqXHR);
                });
            }
            /**
             *
             * @param {string} event
             * @param {function} callback
             * @returns {HttpClient}
             */

        }, {
            key: "when",
            value: function when(event, callback) {
                this.on(event + this.id, callback);
                return this;
            }
            /**
             *
             * @param headers
             * @returns {HttpClient}
             */

        }, {
            key: "setHeaders",
            value: function setHeaders(headers) {
                this.headers = headers;
                return this;
            }
            /**
             *
             * @param params
             * @returns {HttpClient}
             */

        }, {
            key: "post",
            value: function post(params) {
                this.params = params;
                this.method = 'POST';

                this.__exec();

                return this;
            }
            /**
             *
             * @param params
             * @returns {HttpClient}
             */

        }, {
            key: "get",
            value: function get(params) {
                this.params = params;
                this.method = 'GET';

                this.__exec();

                return this;
            }
        }, {
            key: "abort",
            value: function abort() {
                if (this.xhr) {
                    this.xhr.abort();
                }
            }
        }]);

        return HttpClient;
    }(EventEmitter);