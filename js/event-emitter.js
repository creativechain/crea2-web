"use strict";

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/* global WeakMap */
var privateMap = new WeakMap(); // For making private properties.

function internal(obj) {
    if (!privateMap.has(obj)) {
        privateMap.set(obj, {});
    }

    return privateMap.get(obj);
} // Excluding callbacks from internal(_callbacks) for speed perfomance.


var _callbacks = {};
/** Class EventEmitter for event-driven architecture. */

var EventEmitter =
    /*#__PURE__*/
    function () {
        /**
         * Constructor.
         *
         * @constructor
         * @param {number|null} maxListeners.
         * @param {object} localConsole.
         *
         * Set private initial parameters:
         *   _events, _callbacks, _maxListeners, _console.
         *
         * @return {this}
         */
        function EventEmitter() {
            var maxListeners = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
            var localConsole = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : console;

            _classCallCheck(this, EventEmitter);

            var self = internal(this);
            self._events = new Set();
            self._console = localConsole;
            self._maxListeners = maxListeners === null ? null : parseInt(maxListeners, 10);
            return this;
        }
        /**
         * Add callback to the event.
         *
         * @param {string} eventName.
         * @param {function} callback
         * @param {object|null} context - In than context will be called callback.
         * @param {number} weight - Using for sorting callbacks calls.
         *
         * @return {this}
         */


        _createClass(EventEmitter, [{
            key: "_addCallback",
            value: function _addCallback(eventName, callback, context, weight) {
                this._getCallbacks(eventName).push({
                    callback: callback,
                    context: context,
                    weight: weight
                }); // @todo instead of sorting insert to right place in Array.
                // @link http://rjzaworski.com/2013/03/composition-in-javascript
                // Sort the array of callbacks in
                // the order of their call by "weight".


                this._getCallbacks(eventName).sort(function (a, b) {
                    return b.weight - a.weight;
                });

                return this;
            }
            /**
             * Get all callback for the event.
             *
             * @param {string} eventName
             *
             * @return {object|undefined}
             */

        }, {
            key: "_getCallbacks",
            value: function _getCallbacks(eventName) {
                return _callbacks[eventName];
            }
            /**
             * Get callback's index for the event.
             *
             * @param {string} eventName
             * @param {callback} callback
             *
             * @return {number|null}
             */

        }, {
            key: "_getCallbackIndex",
            value: function _getCallbackIndex(eventName, callback) {
                return this._has(eventName) ? this._getCallbacks(eventName).findIndex(function (element) {
                    return element.callback === callback;
                }) : -1;
            }
            /**
             * Check if we achive maximum of listeners for the event.
             *
             * @param {string} eventName
             *
             * @return {bool}
             */

        }, {
            key: "_achieveMaxListener",
            value: function _achieveMaxListener(eventName) {
                return internal(this)._maxListeners !== null && internal(this)._maxListeners <= this.listenersNumber(eventName);
            }
            /**
             * Check if callback is already exists for the event.
             *
             * @param {string} eventName
             * @param {function} callback
             * @param {object|null} context - In than context will be called callback.
             *
             * @return {bool}
             */

        }, {
            key: "_callbackIsExists",
            value: function _callbackIsExists(eventName, callback, context) {
                var callbackInd = this._getCallbackIndex(eventName, callback);

                var activeCallback = callbackInd !== -1 ? this._getCallbacks(eventName)[callbackInd] : void 0;
                return callbackInd !== -1 && activeCallback && activeCallback.context === context;
            }
            /**
             * Check is the event was already added.
             *
             * @param {string} eventName
             *
             * @return {bool}
             */

        }, {
            key: "_has",
            value: function _has(eventName) {
                return internal(this)._events.has(eventName);
            }
            /**
             * Add the listener.
             *
             * @param {string} eventName
             * @param {function} callback
             * @param {object|null} context - In than context will be called callback.
             * @param {number} weight - Using for sorting callbacks calls.
             *
             * @return {this}
             */

        }, {
            key: "on",
            value: function on(eventName, callback) {
                var context = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
                var weight = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;

                /* eslint no-unused-vars: 0 */
                var self = internal(this);

                if (typeof callback !== 'function') {
                    throw new TypeError("".concat(callback, " is not a function"));
                } // If event wasn't added before - just add it
                // and define callbacks as an empty object.


                if (!this._has(eventName)) {
                    self._events.add(eventName);

                    _callbacks[eventName] = [];
                } else {
                    // Check if we reached maximum number of listeners.
                    if (this._achieveMaxListener(eventName)) {
                        self._console.warn("Max listeners (".concat(self._maxListeners, ")") + " for event \"".concat(eventName, "\" is reached!"));
                    } // Check if the same callback has already added.


                    if (this._callbackIsExists.apply(this, arguments)) {
                        self._console.warn("Event \"".concat(eventName, "\"") + " already has the callback ".concat(callback, "."));
                    }
                }

                this._addCallback.apply(this, arguments);

                return this;
            }
            /**
             * Add the listener which will be executed only once.
             *
             * @param {string} eventName
             * @param {function} callback
             * @param {object|null} context - In than context will be called callback.
             * @param {number} weight - Using for sorting callbacks calls.
             *
             * @return {this}
             */

        }, {
            key: "once",
            value: function once(eventName, callback) {
                var _this = this;

                var context = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
                var weight = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;

                var onceCallback = function onceCallback() {
                    _this.off(eventName, onceCallback);

                    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                        args[_key] = arguments[_key];
                    }

                    return callback.call(context, args);
                };

                return this.on(eventName, onceCallback, context, weight);
            }
            /**
             * Remove an event at all or just remove selected callback from the event.
             *
             * @param {string} eventName
             * @param {function} callback
             *
             * @return {this}
             */

        }, {
            key: "off",
            value: function off(eventName) {
                var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
                var self = internal(this);
                var callbackInd;

                if (this._has(eventName)) {
                    if (callback === null) {
                        // Remove the event.
                        self._events.delete(eventName); // Remove all listeners.


                        _callbacks[eventName] = null;
                    } else {
                        callbackInd = this._getCallbackIndex(eventName, callback);

                        if (callbackInd !== -1) {
                            this._getCallbacks(eventName).splice(callbackInd, 1); // Remove all equal callbacks.


                            this.off.apply(this, arguments);
                        }
                    }
                }

                return this;
            }
            /**
             * Trigger the event.
             *
             * @param {string} eventName
             * @param {...args} args - All arguments which should be passed into callbacks.
             *
             * @return {this}
             */

        }, {
            key: "emit",
            value: function emit(eventName) {
                for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                    args[_key2 - 1] = arguments[_key2];
                }

                /*
                 if (this._has(eventName)) {
                 this._getCallbacks(eventName)
                 .forEach(element =>
                 element.callback.call(element.context, args)
                 );
                 }
                 */
                // It works ~3 times faster.
                var custom = _callbacks[eventName]; // Number of callbacks.

                var i = custom ? custom.length : 0;
                var len = arguments.length; //let args;

                var current;
                /*        if (i > 0 && len > 1) {
                            args = new Array(len - 1);

                            while (len--) {
                                if (len === 1) {
                                    // We do not need first argument.
                                    break;
                                }
                                args[len] = arguments[len];
                            }
                        }*/

                while (i--) {
                    current = custom[i];

                    if (arguments.length > 1) {
                        var _current$callback;

                        (_current$callback = current.callback).call.apply(_current$callback, [current.context].concat(args));
                    } else {
                        current.callback.call(current.context);
                    }
                } // Just clean it.
                //args = null;


                return this;
            }
            /**
             * Clear all events and callback links.
             *
             * @return {this}
             */

        }, {
            key: "clear",
            value: function clear() {
                internal(this)._events.clear();

                _callbacks = {};
                return this;
            }
            /**
             * Returns number of listeners for the event.
             *
             * @param {string} eventName
             *
             * @return {number|null} - Number of listeners for event
             *                         or null if event isn't exists.
             */

        }, {
            key: "listenersNumber",
            value: function listenersNumber(eventName) {
                return this._has(eventName) ? _callbacks[eventName].length : null;
            }
        }]);

        return EventEmitter;
    }();