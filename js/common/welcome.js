"use strict";

/**
 * Created by ander on 11/10/18.
 */
let welcomeVue;
(function () {

    let emailCallback;
    let usernameInputs = {
        last: {
            value: null,
            date: 0
        }
    };

    function setUp() {
        welcomeVue = new Vue({
            el: '#welcome',
            data: {
                slide: 0,
                username: '',
                email: '',
                phone: '',
                phone_code: '',
                country_code: '',
                error: {
                    username: '',
                    email: '',
                    phone: '',
                    phone_code: '',
                    password: null,
                    matchPassword: '',
                    terms: '',
                    policy: ''
                },
                validUsername: false,
                validEmail: false,
                validPhone: false,
                sentSMS: false,
                passwordMatch: false,
                checkedTerms: false,
                checkedPolicy: false,
                suggestedPassword: '',
                password: '',
                lang: lang,
                countryCodes: countryCodes
            },
            methods: {
                inputPassword: inputPassword,
                inputCheckPassword: inputCheckPassword,
                checkEmail: checkEmail,
                checkPhone: checkPhone,
                verifyPhone: verifyPhone,
                onPhonePrefix: function (item) {
                    console.log('Prefix selected', item);
                    if (typeof item === 'string') {
                        this.country_code = item;
                    } else {
                        this.country_code = item.callingCodes[0];
                    }
                },
                changeSlide: function changeSlide(slide, error) {
                    console.log("Change to slide", slide, error);

                    let that = this;

                    //Validate username
                    if (this.slide === 2) {

                        this.checkUsername(function (err, result, username) {
                            if (err) {
                                console.error(err);
                                that.error.username = lang.ERROR.INVALID_USERNAME;
                            } else if (result[0] != null) {
                                that.error.username = lang.ERROR.USERNAME_EXISTS;
                            } else {
                                that.error.username = null;
                                that.username = username;
                                that.slide = slide;
                            }
                        });
                    } else if (this.slide === 3) {
                        this.checkEmail(function (err, email) {
                            if (err) {
                                welcomeVue.error.email = err;
                                welcomeVue.email = '';
                            } else {
                                welcomeVue.error.email = null;
                                welcomeVue.email = email;
                                that.sendConfirmationMail(function (err, result) {
                                    if (!catchError(err)) {
                                        that.slide = slide;
                                    }
                                });

                            }
                        });
                    } else {
                        if (!error || error.length === 0) {
                            this.slide = slide;
                        }
                    }


                },
                suggestPassword: function suggestPassword() {
                    this.suggestedPassword = 'P' + crea.formatter.createSuggestedPassword();
                    this.password = this.suggestedPassword;
                },
                checkUsername: checkUsername,
                sendConfirmationMail: sendConfirmationMail,
                createAccount: createAccount,
                copyToClipboard: copyToClipboard
            }
        });

        creaEvents.emit('crea.dom.ready');
    }

    function checkUsername(callback) {
        let target = welcomeVue.$refs.inputusername;
        target.value = target.value.toLowerCase();
        let username = target.value;
        let time = moment().valueOf();
        usernameInputs.last.value = username;
        usernameInputs.last.date = time;
        usernameInputs[username] = time;

        if (!crea.utils.validateAccountName(username)) {
            let accounts = [username];

            let usernameCallback = function usernameCallback(err, result) {
                let userTime = usernameInputs[username];

                if (userTime > usernameInputs.last.date || userTime >= usernameInputs.last.date && username === usernameInputs.last.value) {
                    if (callback) {
                        callback(err, result, username);
                    }
                }
            };

            crea.api.lookupAccountNames(accounts, usernameCallback);
        } else {
            welcomeVue.error.username = lang.ERROR.INVALID_USERNAME;
        }
    }

    function checkEmail(callback) {
        if (!emailCallback) {
            emailCallback = null;
        }

        let target = welcomeVue.$refs.regemail;
        let email = target.value;
        console.log("Checking mail", email, validateEmail(email));

        if (validateEmail(email)) {
            refreshAccessToken(function (accessToken) {
                let url = apiOptions.apiUrl + '/validateAccount';
                let http = new HttpClient(url);

                emailCallback = function emailCallback(data) {
                    console.log('Validate', data, email);
                    welcomeVue.error.email = null;
                    welcomeVue.email = email;
                    callback(null, email);
                };

                http.setHeaders({
                    Authorization: 'Bearer ' + accessToken
                }).when('fail', function (data, status, error) {
                    console.error('Request failed', data, status, error, email);

                    if (data.responseText) {
                        let response = jsonify(data.responseText);

                        if (response.error === 'REGISTERED_EMAIL') {
                            callback(lang.ERROR.EMAIL_EXISTS, null)
                        }
                    } else {
                        callback(lang.ERROR.UNKNOWN_ERROR, null)
                    }
                }).when('done', emailCallback).post({
                    username: welcomeVue.username,
                    email: email
                });
            });
        } else {
            callback(lang.ERROR.INVALID_EMAIL, null)
        }
    }

    function checkPhone() {
        let token = getParameterByName('token'); //console.log('Token', token);

        if (token) {
            //Normalize phone, remove spaces and '+'
            let phone = welcomeVue.country_code + welcomeVue.phone;
            phone = phone.replace(' ', '').replace('+', '');
            globalLoading.show = true;
            refreshAccessToken(function (accessToken) {
                let url = apiOptions.apiUrl + `/validation-phone/${token}`;
                let http = new HttpClient(url);
                http.setHeaders({
                    Authorization: 'Bearer ' + accessToken
                }).post({
                    phone: phone
                }).when('done', function (data) {
                    globalLoading.show = false;
                    data = JSON.parse(data);
                    console.log('Phone validation', data);
                    welcomeVue.validPhone = true;
                    welcomeVue.sentSMS = true;
                    welcomeVue.error.phone = '';
                }).when('fail', function (jqXHR, textStatus, errorThrown) {
                    console.error(jqXHR, textStatus, errorThrown);
                    let response = jsonify(jqXHR.responseText);
                    welcomeVue.error.phone = lang.ERROR[response.error];
                    globalLoading.show = false;
                });
            });
        } else {
            welcomeVue.slide = 1;
        }
    }
    
    function verifyPhone() {
        let token = getParameterByName('token'); //console.log('Token', token);

        refreshAccessToken(function (accessToken) {
            let url = apiOptions.apiUrl + `/validate-phone/${token}`;
            let http = new HttpClient(url);
            http.setHeaders({
                Authorization: 'Bearer ' + accessToken
            }).post({
                phoneCode: welcomeVue.phone_code
            }).when('done', function (data) {
                globalLoading.show = false;
                data = JSON.parse(data);
                console.log('Phone verified', data);
                welcomeVue.username = data.data.username;
                welcomeVue.suggestPassword();
                welcomeVue.slide = 7; //Set Password step
                welcomeVue.error.phone_code = '';
            }).when('fail', function (jqXHR, textStatus, errorThrown) {
                console.error(jqXHR, textStatus, errorThrown);
                let response = jsonify(jqXHR.responseText);
                welcomeVue.error.phone_code = lang.ERROR[response.error];
                globalLoading.show = false;
            });
        })
    }

    function inputCheckPassword(event) {
        let password = event.target.value;
        let match = welcomeVue.password === password;

        if (match) {
            welcomeVue.error.matchPassword = null;
            welcomeVue.passwordMatch = true;
        } else {
            welcomeVue.error.matchPassword = lang.ERROR.PASSWORDS_NOT_MATCH;
        }

        welcomeVue.passwordMatch = match;
    }

    function inputPassword(event) {
        let pass = event.target.value;
        console.log("Input password", pass);

        if (pass && !pass.isEmpty()) {
            welcomeVue.password = event.target.value;
            welcomeVue.error.password = null;
        } else {
            welcomeVue.error.password = lang.ERROR.INVALID_PASSWORD;
        }
    }

    function sendConfirmationMail(callback) {
        if (!welcomeVue.error.email) {
            globalLoading.show = true;
            refreshAccessToken(function (accessToken) {
                let url = apiOptions.apiUrl + '/crearySignUp';
                let http = new HttpClient(url);
                http.setHeaders({
                    Authorization: 'Bearer ' + accessToken
                }).post({
                    username: welcomeVue.username,
                    email: $('#reg-email').val()
                }).when('fail', function (jqXHR, textStatus, errorThrown) {
                    globalLoading.show = false;
                    let response = jsonify(jqXHR.responseText);
                    if (callback) {
                        callback(lang.ERROR[response.error], null);
                    }
                }).when('done', function (data) {
                    console.log('SignUp', data);
                    welcomeVue.slide = 4;
                    globalLoading.show = false;

                    if (callback) {
                        callback(null, data);
                    }
                });
            });
        }
    }

    function createAccount() {
        if (!welcomeVue.error.matchPassword && welcomeVue.checkedTerms && welcomeVue.checkedPolicy) {
            globalLoading.show = true;
            let username = welcomeVue.username;
            let password = welcomeVue.password;
            createBlockchainAccount(username, password, function (err, result) {
                globalLoading.show = false;

                if (!catchError(err)) {
                    console.log(result);
                    welcomeVue.slide = 9;
                }
            });
        } else {
            console.error('Account could not be created', 'Match pass:', welcomeVue.passwordMatch, 'Terms:', welcomeVue.checkedTerms, 'Policy:', welcomeVue.checkedPolicy);
        }
    }

    creaEvents.on('crea.content.loaded', function () {
        console.log('Content loaded!');
        setUp();

        let token = getParameterByName('token');

        if (token) {
            globalLoading.show = true;
            refreshAccessToken(function (accessToken) {
                let url = apiOptions.apiUrl + `/validation/${token}`;
                let http = new HttpClient(url);
                http.setHeaders({
                    Authorization: 'Bearer ' + accessToken
                }).get().when('done', function (data) {
                    globalLoading.show = false;
                    data = JSON.parse(data);
                    console.log('SignUp', data);
                    welcomeVue.username = data.data.username;
                    welcomeVue.slide = 5;
                }).when('fail', function (jqXHR, textStatus, errorThrown) {
                    console.error(jqXHR, textStatus, errorThrown);
                    //TODO: SHOW ERROR
                    goTo('/' + jqXHR.status);
                });
            });
        } else {
            welcomeVue.slide = 1;
        }

    });

})();