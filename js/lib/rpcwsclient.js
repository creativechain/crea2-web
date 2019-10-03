
class RpcWsClient extends EventEmitter{
    constructor (url) {
        super();
        this.url = url;
        this.ws = null;
    }

    connect() {
        if (this.isClosed()) {
            let that = this;
            this.ws = new WebSocket(this.url);

            this.ws.onopen = function (event) {
                that.emit('ws.open', event);
            };

            this.ws.onmessage = function (event) {
                let data = JSON.parse(event.data);
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

    close() {
        if (this.canClose()) {
            this.ws.close();
        }

        this.ws = null;
    }

    send(data, callback) {
        let jsonRpc = {
            id: Math.floor(Math.random() * (Number.MAX_SAFE_INTEGER - 1 + 1)) + 1,
            jsonrpc: '2.0'
        };
        let jsonData = Object.assign(data, jsonRpc);
        this.sendStringData(JSON.stringify(jsonData), jsonData.id, callback);
    }

    sendStringData(data, id, callback) {
        if (this.ws && this.isOpen()) {
            if (callback) {
                let that = this;
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

    isOpen() {
        return this.ws && this.ws.readyState === WebSocket.OPEN;
    }

    isClosed() {
        return !this.ws || this.ws.readyState === WebSocket.CLOSED;
    }

    canClose() {
        return this.ws && (this.ws.readyState === WebSocket.CONNECTING || this.isOpen());
    }
}