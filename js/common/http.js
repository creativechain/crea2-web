/**
 * Created by ander on 11/10/18.
 */

class HttpClient extends EventEmitter {
    constructor(url) {
        super();
        this.url = url;
        this.params = null;
        this.method = null;
        this.headers = {};
        this.mimeType = 'multipart/form-data';
        this.contentType = false
    }

    __exec() {
        let that = this;

        let settings = {
            url: this.url,
            method: this.method,
            headers: this.headers,
            mimeType: this.mimeType,
            contentType: this.contentType,
            crossDomain: true,
            processData: false
        };

        if (this.params) {
            let form = new FormData();
            let keys = Object.keys(this.params);

            keys.forEach(function (k) {
                form.append(k, that.params[k]);
            });

            settings.data = form;
        }

        $.ajax(settings)
            .done(function (data, textStatus, jqXHR) {
                that.emit('done', data, textStatus, jqXHR);
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                that.emit('fail', jqXHR, textStatus, errorThrown);
            })
            .always(function (data, textStatus, jqXHR) {
                that.emit('always', data, textStatus, jqXHR);
            })
    }

    /**
     *
     * @param headers
     * @returns {HttpClient}
     */
    setHeaders(headers) {
        this.headers = headers;
        return this;
    }

    /**
     *
     * @param params
     * @returns {HttpClient}
     */
    post(params) {

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
    get(params) {
        this.params = params;
        this.method = 'GET';
        this.__exec();

        return this;
    }
}