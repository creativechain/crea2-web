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

var RpcWsClient =
    /*#__PURE__*/
    function (_EventEmitter) {
        _inherits(RpcWsClient, _EventEmitter);

        function RpcWsClient(url) {
            var _this;

            _classCallCheck(this, RpcWsClient);

            _this = _possibleConstructorReturn(this, _getPrototypeOf(RpcWsClient).call(this));
            _this.url = url;
            _this.ws = null;
            return _this;
        }

        _createClass(RpcWsClient, [{
            key: "connect",
            value: function connect() {
                if (this.isClosed()) {
                    var that = this;
                    this.ws = new WebSocket(this.url);

                    this.ws.onopen = function (event) {
                        that.emit('ws.open', event);
                    };

                    this.ws.onmessage = function (event) {
                        var data = JSON.parse(event.data);
                        that.emit('ws.message.' + data.id, data, data.id, event);

                    };

                    this.ws.onclose = function (event) {
                        that.emit('ws.close', event);
                        that.close();
                    };

                    this.ws.onerror = function (event) {
                        that.emit('ws.error', event);
                    };
                }
            }
        }, {
            key: "close",
            value: function close() {
                if (this.canClose()) {
                    this.ws.close();
                }

                this.ws = null;
            }
        }, {
            key: "send",
            value: function send(data, callback) {
                var jsonRpc = {
                    id: Math.floor(Math.random() * (9007199254740991 - 1 + 1)) + 1,
                    jsonrpc: '2.0'
                };
                var jsonData = Object.assign(data, jsonRpc);
                this.sendStringData(JSON.stringify(jsonData), jsonData.id, callback);
            }
        }, {
            key: "sendStringData",
            value: function sendStringData(data, id, callback) {
                if (this.ws && this.isOpen()) {
                    if (callback) {
                        var that = this;
                        this.on('ws.message.' + id, function (data, id, ev) {
                            if (data.error) {
                                callback(data.error);
                            } else {
                                callback(null, data.result);
                            }

                            //Clear event on receive data
                            that.off('es.message.' + id);

                        })
                    }

                    this.ws.send(data);
                }
            }
        }, {
            key: "isOpen",
            value: function isOpen() {
                return this.ws && this.ws.readyState === WebSocket.OPEN;
            }
        }, {
            key: "isClosed",
            value: function isClosed() {
                return !this.ws || this.ws.readyState === WebSocket.CLOSED;
            }
        }, {
            key: "canClose",
            value: function canClose() {
                return this.ws && (this.ws.readyState === WebSocket.CONNECTING || this.isOpen());
            }
        }]);

        return RpcWsClient;
    }(EventEmitter);