/**
 * Created by ander on 11/10/18.
 */

let welcomeVue;

let email = $('#welcome-slide3-email');

let query = window.location.search;

function welcomeSetUp() {

    welcomeVue = new Vue({
        el: '#welcome',
        data: {
            slide: 0,
            username: '',
            email: '',
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
            checkTerms: checkTerms,
            checkPolicy: checkPolicy,
            inputPassword: inputPassword,
            inputCheckPassword: inputCheckPassword,
            checkEmail: checkEmail,
            changeSlide: function (slide, change = true) {
                console.log("Change to slide", slide, change);
                if (change === true) {
                    this.slide = slide;
                }
            },
            suggestPassword: function() {
                this.suggestedPassword = crea.formatter.createSuggestedPassword();
                this.password = this.suggestedPassword;
            },
            checkUsername: checkUsername,
            sendConfirmationMail: sendConfirmationMail,
            createAccount: createAccount
        }
    });

    let token = getParameterByName('token');
    //console.log('Token', token);

    if (token) {
        refreshAccessToken(function (accessToken) {
            let url = 'https://platform.creativechain.net/validate/' + token;
            let http = new HttpClient(url);
            http.setHeaders({
                Authorization: 'Bearer ' + accessToken
            }).get().on('done', function (data) {

                data = JSON.parse(data);
                console.log('SignUp', data);
                welcomeVue.username = data.data.username;
                welcomeVue.password = crea.formatter.createSuggestedPassword();
                welcomeVue.suggestedPassword = welcomeVue.password;
                welcomeVue.slide = 5;
            });
        });
    } else {
        welcomeVue.slide = 1;
    }
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
                welcomeVue.validUsername = false;
            } else {
                result = result[0];
                console.log(result, result === null);
                welcomeVue.validUsername = result === null;
                if (welcomeVue.validUsername) {
                    welcomeVue.username = username;
                }
            }
        })
    } else {
        welcomeVue.validUsername = false;
    }
}

function checkEmail(event) {
    let email = event.target.value;
    console.log("Checking mail", email, validateEmail(email));
    welcomeVue.validEmail = validateEmail(email);
    if (welcomeVue.validEmail) {
        welcomeVue.email = email;
    }
}

function checkTerms(event) {
    welcomeVue.checkedTerms = event.target.checked;
    console.log('Terms', welcomeVue.checkedTerms);
}

function checkPolicy(event) {
    welcomeVue.checkedPolicy = event.target.checked;
    console.log('Policy', welcomeVue.checkedPolicy);
}

function inputCheckPassword(event) {
    let password = event.target.value;
    console.log("Input check password", password);

    welcomeVue.passwordMatch = welcomeVue.password === password;
}

function inputPassword(event) {
    welcomeVue.password = event.target.value;
    console.log("Input password", welcomeVue.password);
}

function sendConfirmationMail(callback) {
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
            if (callback) {
                callback();
            }
        });
    });
}

function createAccount() {

    if (welcomeVue.passwordMatch && welcomeVue.checkedTerms && welcomeVue.checkedPolicy) {
        let username = welcomeVue.username;
        let password = welcomeVue.password;
        createBlockchainAccount(username, password, function (err, result) {
            if (err) {
                console.error(err);
            } else {
                console.log(result);
                welcomeVue.slide = 8;
            }
        })
    } else {
        console.error('Account could not be created', 'Match pass:', welcomeVue.passwordMatch, 'Terms:', welcomeVue.checkedTerms, 'Policy:', welcomeVue.checkedPolicy);
    }


}
welcomeSetUp();
