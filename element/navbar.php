<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Stack Multipurpose HTML Template</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Site Description Here">
    <link href="css/bootstrap.css" rel="stylesheet" type="text/css" media="all"/>
    <link href="css/stack-interface.css" rel="stylesheet" type="text/css" media="all"/>
    <link href="css/socicon.css" rel="stylesheet" type="text/css" media="all"/>
    <link href="css/lightbox.min.css" rel="stylesheet" type="text/css" media="all"/>
    <link href="css/flickity.css" rel="stylesheet" type="text/css" media="all"/>
    <link href="css/iconsmind.css" rel="stylesheet" type="text/css" media="all"/>
    <link href="css/jquery.steps.css" rel="stylesheet" type="text/css" media="all"/>
    <link href="css/theme.css" rel="stylesheet" type="text/css" media="all"/>
    <link href="css/custom/creativechain.css" rel="stylesheet" type="text/css" media="all" />

    <link href="https://fonts.googleapis.com/css?family=Open+Sans:200,300,400,400i,500,600,700%7CMerriweather:300,300i"
          rel="stylesheet">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">

    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.3.1/css/all.css" integrity="sha384-mzrmE5qonljUremFsqc01SB46JvROS7bZs3IO2EmfFsd15uHvIt+Y8vEf7N7fWAU" crossorigin="anonymous">

</head>
<body class=" ">
<a id="start"></a>

<div id="navbar-right-menu" class="notification pos-right pos-top side-menu bg--white" data-notification-link="side-menu"
     data-animation="from-right">
    <div class="side-menu__module">
        <a class="btn btn--icon bg--facebook block" href="#">
            <span class="btn__text">
                <i class="socicon-facebook"></i>
                {{ lang.LOGIN.FACEBOOK }}
            </span>
        </a>
        <a class="btn btn--icon bg--dark block" href="#">
            <span class="btn__text">
                <i class="socicon-mail"></i>
                Sign up with Email
            </span>
        </a>
    </div>
    <!--end module-->
    <hr>
    <div class="side-menu__module">
        <span class="type--fine-print float-left">Already have an account?</span>
        <a class="btn type--uppercase float-right" href="#">
            <span class="btn__text">Login</span>
        </a>
    </div>
    <!--end module-->
    <hr>
    <div class="side-menu__module">
        <ul class="list--loose list--hover">
            <li>
                <a href="#">
                    <span class="h5">About Stack</span>
                </a>
            </li>
            <li>
                <a href="#">
                    <span class="h5">Careers</span>
                </a>
            </li>
            <li>
                <a href="#">
                    <span class="h5">Investors</span>
                </a>
            </li>
            <li>
                <a href="#">
                    <span class="h5">Locations</span>
                </a>
            </li>
            <li>
                <a href="#">
                    <span class="h5">Contact</span>
                </a>
            </li>
        </ul>
    </div>
    <!--end module-->
    <hr>
    <div class="side-menu__module">
        <ul class="social-list list-inline list--hover">
            <li>
                <a href="#">
                    <i class="socicon socicon-google icon icon--xs"></i>
                </a>
            </li>
            <li>
                <a href="#">
                    <i class="socicon socicon-twitter icon icon--xs"></i>
                </a>
            </li>
            <li>
                <a href="#">
                    <i class="socicon socicon-facebook icon icon--xs"></i>
                </a>
            </li>
            <li>
                <a href="#">
                    <i class="socicon socicon-instagram icon icon--xs"></i>
                </a>
            </li>
            <li>
                <a href="#">
                    <i class="socicon socicon-pinterest icon icon--xs"></i>
                </a>
            </li>
        </ul>
    </div>
</div>
<div id="navbar-search" class="notification pos-top pos-right search-box bg--white border--bottom" data-animation="from-top"
     data-notification-link="search-box">
    <form>
        <div class="row justify-content-center">
            <div class="col-lg-6 col-md-8">
                <input type="search" name="query" v-bind:placeholder="lang.HOME.SEARCH_ACTIVE"/>
            </div>
        </div>
        <!--end of row-->
    </form>
</div>
<!--end of notification-->
<div id="navbar-container"  class="nav-container background-navbar-dark">
    <div class="bar bar--sm visible-xs">
        <div class="container">
            <div class="row">
                <div class="col-3 col-md-2">
                    <a href="/">
                        <img class="logo logo-dark" alt="logo" src="img/logo-dark.png"/>
                        <img class="logo logo-light" alt="logo" src="img/logo-light.png"/>
                    </a>
                </div>
                <div class="col-9 col-md-10 text-right">
                    <a href="#" class="hamburger-toggle" data-toggle-class="#menu1;hidden-xs">
                        <i class="icon icon--sm stack-interface stack-menu"></i>
                    </a>
                </div>
            </div>
            <!--end of row-->
        </div>
        <!--end of container-->
    </div>
    <!--end bar-->
    <nav id="menu1" class="bar bar--sm bar-1 hidden-xs ">
        <div class="container">
            <div class="row">
                <div class="col-lg-2 col-md-2 hidden-xs">
                    <div class="bar__module">
                        <a href="/">
                            <img class="logo" alt="logo" src="img/logo-light.png"/>
                        </a>
                    </div>
                    <!--end module-->
                </div>
                <div class="col-lg-10 col-md-10 text-center text-left-xs text-left-sm">
                    <div class="bar__module">
                        <ul class="menu-horizontal text-left">
                            <li><a href="">{{ lang.HOME.MENU_FOLLOWING }}</a></li>
                            <li><a href="">{{ lang.HOME.MENU_POPULAR }}</a></li>
                            <li><a href="">{{ lang.HOME.MENU_SKYROCKETS }}</a></li>
                            <li><a href="">{{ lang.HOME.MENU_NOW }}</a></li>
                            <li><a href="">{{ lang.HOME.MENU_PROMOTED }}</a></li>
                        </ul>
                    </div>
                    <div class="bar__module float-right">
                        <ul class="menu-horizontal text-left">
                            <li>
                                <a href="#" data-notification-link="search-box">
                                    <i class="stack-search"></i>
                                </a>
                            </li>
                            <li>
                                <a href="">
                                    <i class="far fa-bell"></i>
                                </a>
                            </li>
                            <li>
                                <div class="modal-instance">
                                    <span  v-if="session" v-on:click="window.location.href = 'profile.php'" class="log-in cursor">{{ session.account.username }}</span>
                                    <a href="#" v-else class="modal-trigger log-in">{{ lang.BUTTON.LOGIN }}</a>
                                    <div v-if="!session" class="modal-container">
                                        <div class="modal-content section-modal">
                                            <section class="unpad ">
                                                <div class="container">
                                                    <div class="row justify-content-center">
                                                        <div class="col-md-6">
                                                            <div class="boxed boxed--lg bg--white text-center feature">
                                                                <div class="modal-close modal-close-cross"></div>
                                                                <h3>{{ lang.LOGIN.TITLE }}</h3>
                                                                <a class="btn block btn--icon bg--facebook type--uppercase"
                                                                   href="#">
                                                                        <span class="btn__text">
                                                                            <i class="socicon-facebook"></i>
                                                                            {{ lang.LOGIN.FACEBOOK }}
                                                                        </span>
                                                                </a>
                                                                <a class="btn block btn--icon bg--twitter type--uppercase"
                                                                   href="#">
                                                                        <span class="btn__text">
                                                                            <i class="socicon-twitter"></i>
                                                                            {{ lang.LOGIN.TWITTER }}
                                                                        </span>
                                                                </a>
                                                                <hr v-bind:data-title="lang.COMMON.OR_CAP">
                                                                <div class="feature__body">
                                                                    <form id="login-form" action="#" v-on:submit="login">
                                                                        <div class="row">
                                                                            <div class="col-md-12">
                                                                                <input id="login-username" type="text" v-bind:placeholder="lang.LOGIN.USERNAME"/>
                                                                            </div>
                                                                            <div class="col-md-12">
                                                                                <input id="login-password" type="password"
                                                                                       v-bind:placeholder="lang.LOGIN.PASSWORD"/>
                                                                            </div>
                                                                            <div class="col-md-12">
                                                                                <button id="login-button"
                                                                                    class="btn btn--primary type--uppercase"
                                                                                    type="submit">{{ lang.BUTTON.LOGIN }}
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                        <!--end of row-->
                                                                    </form>
                                                                        <span class="type--fine-print block"> {{ lang.LOGIN.NOT_USER }}
                                                                            <a href="#">Create account</a>
                                                                        </span>
                                                                        <span class="type--fine-print block">{{ lang.LOGIN.FORGOT_ACCOUNT }}
                                                                            <a href="#">Recover account</a>
                                                                        </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <!--end of row-->
                                                </div>
                                                <!--end of container-->
                                            </section>
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <a class="btn btn--sm type--uppercase" href="#" onclick="return startLogin()">
                                    <span class="btn__text">
                                        {{ lang.BUTTON.SIGN_UP }}
                                    </span>
                                </a>
                            </li>
                            <li>


                            <li>
                                <a href="#" data-notification-link="side-menu">
                                    <i class="stack-menu"></i>
                                </a>
                            </li>
                        </ul>
                    </div>
                    <!--end module-->
                </div>
            </div>
            <!--end of row-->
        </div>
        <!--end of container-->
    </nav>
    <!--end bar-->
</div>