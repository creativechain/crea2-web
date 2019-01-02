/**
 * Created by ander on 21/12/18.
 */

(function () {

    let roleModal;
    let alertModal;

    function setUpAlertModal() {
        let defaultData = {
            title: '',
            body: [],
        };

        if (!alertModal) {
            alertModal = new Vue({
                el: '#modal-alert',
                data: {
                    lang: lang,
                    config: clone(defaultData),
                    show: false
                },
                mounted: function () {
                    let that = this;
                    $('#modal-alert').on('modalClosed.modals.mr', function () {
                        that.closeModal();
                    })
                },
                methods: {
                    cleanModal: function () {
                        this.config = clone(defaultData);
                    },
                    closeModal: function (event) {
                        cancelEventPropagation(event);
                        this.cleanModal();
                        this.show = false;
                    }
                }
            })
        }
    }

    function setUpRoleModal() {

        let defaultData = {
            username: {
                disabled: false,
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
                    role: null,
                    inputs: clone(defaultData),
                    show: false
                },
                mounted: function () {
                    let that = this;
                    $('#modal-role').on('modalClosed.modals.mr', function () {
                        that.closeModal();
                    })
                },
                methods: {
                    cleanModal: function () {
                        this.inputs = clone(defaultData);
                        this.title = '';
                        this.role = '';
                        this.id = null;
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

                        let that = this;
                        let username = this.inputs.username.value.split('/')[0];
                        let role = this.role;
                        let password = this.inputs.password.value;

                        let s = Session.create(username, password, role);
                        s.login(function (err, result) {
                            if (!catchError(err)) {
                                creaEvents.emit('crea.auth.role.' + that.id, s.account.keys[role].prv);
                                that.closeModal();
                            }
                        })
                    }
                }
            })
        }
    }

    function setUp() {
        setUpAlertModal();
        setUpRoleModal();
    }

    creaEvents.on('crea.alert', function (data) {
       alertModal.config = data;
       alertModal.show = true;
    });

    creaEvents.on('crea.auth.role', function (username, role, id) {
        roleModal.id = id;
        roleModal.inputs.username.value = username;
        roleModal.role = role;
        roleModal.show = true
    });

    creaEvents.on('crea.content.loaded', function () {
        setUp();
    })
})();