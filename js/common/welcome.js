"use strict";

/**
 * Created by ander on 11/10/18.
 */
(function () {
    var welcomeVue;
    var emailCallback;
    var usernameInputs = {
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
                changeSlide: function changeSlide(slide, error) {
                    console.log("Change to slide", slide, error);

                    if (!error || error.length === 0) {
                        this.slide = slide;
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

    function checkUsername() {
        var target = welcomeVue.$refs.inputusername;
        target.value = target.value.toLowerCase();
        var username = target.value;
        var time = new Date().getTime();
        usernameInputs.last.value = username;
        usernameInputs.last.date = time;
        usernameInputs[username] = time;

        if (!crea.utils.validateAccountName(username)) {
            var accounts = [username];

            var usernameCallback = function usernameCallback(err, result) {
                var userTime = usernameInputs[username];

                if (userTime > usernameInputs.last.date || userTime >= usernameInputs.last.date && username === usernameInputs.last.value) {
                    if (err) {
                        console.error(err);
                        welcomeVue.error.username = lang.ERROR.INVALID_USERNAME;
                    } else if (result[0] != null) {
                        welcomeVue.error.username = lang.ERROR.USERNAME_EXISTS;
                    } else {
                        welcomeVue.error.username = null;
                        welcomeVue.username = username;
                    }
                } //console.log("Checking", username, userTime, usernameInputs.last.value, usernameInputs.last.date, welcomeVue.username);

            };

            crea.api.lookupAccountNames(accounts, usernameCallback);
        } else {
            welcomeVue.error.username = lang.ERROR.INVALID_USERNAME;
        }
    }

    function checkEmail(event) {
        if (!emailCallback) {
            emailCallback = null;
        }

        var email = event.target.value;
        console.log("Checking mail", email, validateEmail(email));

        if (validateEmail(email)) {
            refreshAccessToken(function (accessToken) {
                var url = apiOptions.apiUrl + '/validateAccount';
                var http = new HttpClient(url);

                emailCallback = function emailCallback(data) {
                    console.log('Validate', data, email);
                    welcomeVue.error.email = null;
                    welcomeVue.email = email;
                };

                http.setHeaders({
                    Authorization: 'Bearer ' + accessToken
                }).when('fail', function (data, status, error) {
                    console.error('Request failed', data, status, error, email);

                    if (data.responseText) {
                        var response = jsonify(data.responseText);

                        if (response.error === 'REGISTERED_EMAIL') {
                            welcomeVue.error.email = lang.ERROR.EMAIL_EXISTS;
                        }
                    } else {
                        welcomeVue.error.email = lang.ERROR.UNKNOWN_ERROR;
                    }
                }).when('done', emailCallback).post({
                    username: welcomeVue.username,
                    email: email
                });
            });
        } else {
            welcomeVue.error.email = lang.ERROR.INVALID_EMAIL;
            welcomeVue.email = '';
        }
    }

    function checkPhone() {
        var token = getParameterByName('token'); //console.log('Token', token);

        if (token) {
            globalLoading.show = true;
            refreshAccessToken(function (accessToken) {
                var url = apiOptions.apiUrl + `/validation-phone/${token}`;
                var http = new HttpClient(url);
                http.setHeaders({
                    Authorization: 'Bearer ' + accessToken
                }).post({
                    phone: welcomeVue.country_code + welcomeVue.phone
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
        var token = getParameterByName('token'); //console.log('Token', token);

        refreshAccessToken(function (accessToken) {
            var url = apiOptions.apiUrl + `/validate-phone/${token}`;
            var http = new HttpClient(url);
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
        var password = event.target.value;
        var match = welcomeVue.password === password;

        if (match) {
            welcomeVue.error.matchPassword = null;
            welcomeVue.passwordMatch = true;
        } else {
            welcomeVue.error.matchPassword = lang.ERROR.PASSWORDS_NOT_MATCH;
        }

        welcomeVue.passwordMatch = match;
    }

    function inputPassword(event) {
        var pass = event.target.value;
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
                var url = apiOptions.apiUrl + '/crearySignUp';
                var http = new HttpClient(url);
                http.setHeaders({
                    Authorization: 'Bearer ' + accessToken
                }).post({
                    username: welcomeVue.username,
                    email: $('#reg-email').val()
                }).when('done', function (data) {
                    console.log('SignUp', data);
                    welcomeVue.slide = 4;
                    globalLoading.show = false;

                    if (callback) {
                        callback();
                    }
                });
            });
        }
    }

    function createAccount() {
        if (!welcomeVue.error.matchPassword && welcomeVue.checkedTerms && welcomeVue.checkedPolicy) {
            globalLoading.show = true;
            var username = welcomeVue.username;
            var password = welcomeVue.password;
            createBlockchainAccount(username, password, function (err, result) {
                globalLoading.show = false;

                if (!catchError(err)) {
                    console.log(result);
                    welcomeVue.slide = 8;
                }
            });
        } else {
            console.error('Account could not be created', 'Match pass:', welcomeVue.passwordMatch, 'Terms:', welcomeVue.checkedTerms, 'Policy:', welcomeVue.checkedPolicy);
        }
    }

    creaEvents.on('crea.content.loaded', function () {
        console.log('Content loaded!');
        setUp();

        var token = getParameterByName('token');

        if (token) {
            globalLoading.show = true;
            refreshAccessToken(function (accessToken) {
                var url = apiOptions.apiUrl + `/validation/${token}`;
                var http = new HttpClient(url);
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