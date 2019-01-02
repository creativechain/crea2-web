/**
 * Created by ander on 11/10/18.
 */

let welcomeVue;

(function () {

    function setUp() {
        console.log('Welcome setup');
        welcomeVue = new Vue({
            el: '#welcome',
            data: {
                slide: 0,
                username: '',
                email: '',
                error: {
                    username: '',
                    email: '',
                    password: null,
                    matchPassword: '',
                    terms: '',
                    policy: '',
                },
                validUsername: false,
                validEmail: false,
                passwordMatch: false,
                checkedTerms: false,
                checkedPolicy: false,
                suggestedPassword: '',
                password: '',
                lang: lang
            },
            methods: {
                inputPassword: inputPassword,
                inputCheckPassword: inputCheckPassword,
                checkEmail: checkEmail,
                changeSlide: function (slide, error = null) {
                    console.log("Change to slide", slide, error);
                    if (!error || error.length == 0) {
                        this.slide = slide;
                    }
                },
                suggestPassword: function() {
                    this.suggestedPassword = 'P' + crea.formatter.createSuggestedPassword();
                    this.password = this.suggestedPassword;
                },
                checkUsername: checkUsername,
                sendConfirmationMail: sendConfirmationMail,
                createAccount: createAccount,
            }
        });

        creaEvents.emit('crea.dom.ready');
    }

    function checkUsername(event) {
        let username = event.target.value;
        console.log("Checking", username);
        if (!crea.utils.validateAccountName(username)) {
            let accounts = [ username ];
            console.log("Checking", accounts);
            crea.api.lookupAccountNames(accounts, function (err, result) {
                if (err) {
                    console.error(err);
                    welcomeVue.error.username = lang.ERROR.INVALID_USERNAME;
                } else if (result[0] != null) {
                    welcomeVue.error.username = lang.ERROR.USERNAME_EXISTS;
                } else {
                    welcomeVue.error.username = null;
                    welcomeVue.username = username;
                }
            })
        } else {
            welcomeVue.error.username = lang.ERROR.INVALID_USERNAME;
        }
    }

    function checkEmail(event) {
        let email = event.target.value;
        console.log("Checking mail", email, validateEmail(email));

        if (validateEmail(email)) {

            refreshAccessToken(function (accessToken) {
                let url = 'https://platform.creativechain.net/validateAccount';
                let http = new HttpClient(url);
                http.setHeaders({
                    Authorization: 'Bearer ' + accessToken
                }).post({
                    username: welcomeVue.username,
                    email: email
                }).on('fail', function (data, status, error) {
                    console.error('Request failed', data, status, error);
                    if (data.responseText) {
                        let response = jsonify(data.responseText);
                        if (response.error === 'REGISTERED_EMAIL') {
                            welcomeVue.error.email = lang.ERROR.EMAIL_EXISTS;
                        }
                    } else {
                        welcomeVue.error.email = lang.ERROR.UNKNOWN_ERROR;
                    }
                });

                http.on('done', function (data) {
                    console.log('Validate', data);
                    welcomeVue.error.email = null;
                    welcomeVue.email = email;
                });
            });


        } else {
            welcomeVue.error.email = lang.ERROR.INVALID_EMAIL;
            welcomeVue.email = '';
        }
    }

    function inputCheckPassword(event) {
        let password = event.target.value;
        console.log("Input check password", password);

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
                let url = 'https://platform.creativechain.net/crearySignUp';
                let http = new HttpClient(url);
                http.setHeaders({
                    Authorization: 'Bearer ' + accessToken
                }).post({
                    username: welcomeVue.username,
                    email: welcomeVue.email
                }).on('done', function (data) {
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
            let username = welcomeVue.username;
            let password = welcomeVue.password;
            createBlockchainAccount(username, password, function (err, result) {
                globalLoading.show = false;
                if (!catchError(err)) {
                    console.log(result);
                    welcomeVue.slide = 8;
                }
            })
        } else {
            console.error('Account could not be created', 'Match pass:', welcomeVue.passwordMatch, 'Terms:', welcomeVue.checkedTerms, 'Policy:', welcomeVue.checkedPolicy);
        }
    }

    creaEvents.on('crea.content.loaded', function () {
        console.log('Content loaded!')
        new ClipboardJS('.btn_copy');
        setUp();

        let token = getParameterByName('token');
        //console.log('Token', token);

        if (token) {
            globalLoading.show = true;
            refreshAccessToken(function (accessToken) {
                let url = 'https://platform.creativechain.net/validate/' + token;
                let http = new HttpClient(url);
                http.setHeaders({
                    Authorization: 'Bearer ' + accessToken
                }).get().on('done', function (data) {

                    globalLoading.show = false;
                    data = JSON.parse(data);
                    console.log('SignUp', data);
                    welcomeVue.username = data.data.username;
                    welcomeVue.suggestPassword();
                    welcomeVue.slide = 5;
                }).on('fail', function (jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR, textStatus, errorThrown);
                    goTo('/' + jqXHR.status);
                });
            });
        } else {
            welcomeVue.slide = 1;
        }
    })

})();

