/**
 * Created by ander on 21/12/18.
 */

(function () {

    let roleModal;

    function setUp() {

        let defaultData = {
            username: {
                value: '',
                error: null
            },
            password: {
                value: '',
                error: null
            }
        };

        if (!roleModal) {
            roleModal = new Vue({
                el: '#modal-role',
                data: {
                    lang: lang,
                    id: null,
                    title: '',
                    inputs: clone(defaultData),
                    show: true
                },
                methods: {
                    cleanModal: function () {
                        this.inputs = clone(defaultData);
                    },
                    closeModal: function (event) {
                        cancelEventPropagation(event);
                        this.cleanModal();
                        this.show = false;
                    },
                    checkUsername: function (event) {
                        let username = event.target.value.split('/')[0];
                        let that = this;
                        if (!crea.utils.validateAccountName(username)) {
                            let accounts = [ username ];
                            crea.api.lookupAccountNames(accounts, function (err, result) {
                                if (err) {
                                    console.error(err);
                                    that.inputs.username.error = that.lang.ERROR.INVALID_USERNAME;
                                } else if (result[0] == null) {
                                    that.inputs.username.error = that.lang.ERROR.USERNAME_NOT_EXISTS;
                                } else {
                                    that.inputs.username.error = null;
                                }
                            })
                        } else {
                            that.inputs.username.error = that.lang.ERROR.INVALID_USERNAME;
                        }
                    },
                    fetchKey: function (event) {
                        cancelEventPropagation(event);
                    }
                }
            })
        }
    }

    creaEvents.on('crea.auth.role', function (username, role, id) {
        roleModal.id = id;
        roleModal.inputs.username.value = username + '/' + role;
        roleModal.show = true
    });

    creaEvents.on('crea.content.loaded', function () {
        setUp();
    })
})();