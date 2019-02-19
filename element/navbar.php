<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>CREARY</title>
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"    <meta property="og:url" content="https://creary.net/">
    <meta property="og:type" content="website">
    <meta property="og:title" content="CREARY">
    <meta property="og:description" content="Creary is the blockchain-based social network of creative portfolios that rewards creatives and curators.">
    <meta property="og:image" content="https://creary.net/img/creary-social-media.jpg">

    <link href="/css/bootstrap.css" rel="stylesheet" type="text/css" media="all"/>
    <link href="/css/stack-interface.css" rel="stylesheet" type="text/css" media="all"/>
    <link href="/css/socicon.css" rel="stylesheet" type="text/css" media="all"/>
    <link href="/css/lightbox.min.css" rel="stylesheet" type="text/css" media="all"/>
    <link href="/css/flickity.css" rel="stylesheet" type="text/css" media="all"/>
    <link href="/css/iconsmind.css" rel="stylesheet" type="text/css" media="all"/>
    <link href="/css/jquery.steps.css" rel="stylesheet" type="text/css" media="all"/>
    <link href="/css/theme.css" rel="stylesheet" type="text/css" media="all"/>
    <link href="/css/custom/creativechain.css" rel="stylesheet" type="text/css" media="all" />
    <link href="/css/tagsinput.css" rel="stylesheet" type="text/css" media="all" />
    <link href="/css/custom.css" rel="stylesheet" type="text/css" media="all" />

    <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.10.19/css/jquery.dataTables.css">


    <link rel="stylesheet" type="text/css" href="//loading.io/css/loading.css"/>
    <link rel="stylesheet" type="text/css" href="//loading.io/css/loading-btn.css"/>

    <link href="https://fonts.googleapis.com/css?family=Open+Sans:200,300,400,400i,500,600,700%7CMerriweather:300,300i"
          rel="stylesheet">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">

    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.3.1/css/all.css" integrity="sha384-mzrmE5qonljUremFsqc01SB46JvROS7bZs3IO2EmfFsd15uHvIt+Y8vEf7N7fWAU" crossorigin="anonymous">
    <link rel="icon" type="image/ico" href="/img/favicon.ico" />

    <script src="/js/jquery-3.1.1.min.js"></script>
    <script src="/js/common/start.js"></script>
    <script src="/js/vue.js"></script>
    <script src="/ckeditor/ckeditor.js"></script>

    <script src="/js/tagsinput.js"></script>
    <script src="/js/moment.min.js"></script>
    <script src="/js/buffer.js"></script>
    <script src="/js/event-emitter.js"></script>
    <script src="/js/clipboard.min.js"></script>
    <script src="/js/crea.min.js"></script>
    <script src="https://unpkg.com/ipfs-api@24.0.2/dist/index.js"
            integrity="sha384-thjn3ED9bGCo7vHWbuwbVVJ4i/4LFfScA3c4oYcahbQkMpu6QAu/pcaq+1xhkheg"
            crossorigin="anonymous"></script>
    <script src="https://unpkg.com/popper.js/dist/umd/popper.min.js"></script>

    <script src="/js/common/ls.js"></script>
    <script src="/js/common/conf.js"></script>
    <script src="/js/common/resources.js"></script>
    <script src="/language/isolangs.js"></script>
    <script src="/language/lang-en.js"></script>
    <script src="/js/common/components.js"></script>
    <script src="/js/common/util.js"></script>
    <script src="/js/common/creautil.js"></script>
    <script src="/js/common/http.js"></script>
    <script src="/js/lib/amount.js"></script>
    <script src="/js/lib/license.js"></script>
    <script src="/js/lib/error.js"></script>
    <script src="/js/lib/account.js"></script>
    <script src="/js/lib/session.js"></script>
    <script src="/js/common/login.js"></script>
    <script src="/js/common/common.js"></script>

</head>
<body id="body" class=" " >
<a id="start"></a>

<div v-cloak id="navbar-right-menu" class="notification pos-right pos-top side-menu bg--white" data-notification-link="side-menu" data-animation="from-right">
    <div class="side-menu__module">
        <ul class="list--loose list--hover">
            <li>
                <a href="/faq">
                    <span>{{ lang.DOTS_MENU.FAQ }}</span>
                </a>
            </li>
            <li>
                <a href="/~witness">
                    <span>{{ lang.DOTS_MENU.VOTE }}</span>
                </a>
            </li>
            <li>
                <a href="/explore">
                    <span class="h5">{{ lang.DOTS_MENU.EXPLORE }}</span>
                </a>
            </li>

        </ul>

    </div>
    <hr />
    <div class="side-menu__module">
        <ul class="list--loose list--hover">
            <li>
                <a href="https://creaproject.io/creary/" target="_blank">
                    <span >{{ lang.DOTS_MENU.ABOUT }}</span>
                </a>
            </li>
            <!--<li>
                <a href="#">
                    <span>{{ lang.DOTS_MENU.WHITEPAPER }}</span>
                </a>
            </li>-->
            <li>
                <a href="/privacy_policy">
                    <span>{{ lang.DOTS_MENU.PRIVACY }}</span>
                </a>
            </li>
            <li>
                <a href="/terms_and_conditions">
                    <span>{{ lang.DOTS_MENU.TERMS }}</span>
                </a>
            </li>
        </ul>
    </div>
    <!--end module-->
    <hr />
    <div class="side-menu__module">
        <ul class="social-list list-inline list--hover">
            <li>
                <a href="https://t.me/Creary_net" target="_blank">
                    <i class="socicon socicon-telegram icon icon--xs"></i>
                </a>
            </li>
            <li>
                <a href="https://twitter.com/Crearynet" target="_blank">
                    <i class="socicon socicon-twitter icon icon--xs"></i>
                </a>
            </li>
            <li>
                <a href="https://www.instagram.com/crearynet/" target="_blank">
                    <i class="socicon socicon-instagram icon icon--xs"></i>
                </a>
            </li>
            <li>
                <a href="https://medium.com/creary/" target="_blank">
                    <i class="socicon socicon-medium icon icon--xs"></i>
                </a>
            </li>
        </ul>
    </div>
</div>

<div v-cloak id="navbar-search" class="notification pos-top pos-right search-box bg--white border--bottom" data-animation="from-top"
     data-notification-link="search-box">
    <form v-on:submit="performSearch">
        <div class="row justify-content-center">
            <div class="col-lg-6 col-md-8">
                <input v-model="search" type="text" v-bind:placeholder="lang.HOME.SEARCH_ACTIVE"/>
            </div>
        </div>
    </form>
</div>


<!--end of notification-->
<div v-cloak id="navbar-container"  class="nav-container background-navbar-dark">
    <div class="bar bar--sm visible-xs">
        <div class="container">
            <div class="row">
                <div class="col-3 col-md-2">
                    <a href="/">
                        <img class="logo" alt="logo" src="/img/logo_creary_beta.svg"/>
                    </a>
                </div>

                <!--logueado -->
                <div class="col-9 col-md-10 text-right" v-if="session">
                    <ul class="list-inline">
                        <li class="">
                            <!-- desktop-->
                            <div data-notification-link="search-box" class="search icons-navbar logged-in-search">
                                <i class="stack-search"></i>
                            </div>
                        </li>
                        <li class="list-inline-item">
                            <div class="li-avatar-navbar-mobile" data-toggle-class="#menu1;hidden-xs">
                                <div class="user-avatar" >
                                    <avatar v-bind:account="user"></avatar>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>

                <!-- invitado -->
                <div class="col-9 col-md-10 text-right" v-if="!session">
                    <ul class="list-inline">
                        <li class="">
                            <!-- desktop-->
                            <div data-notification-link="search-box" class="search icons-navbar disconnected-search">
                                <i class="stack-search"></i>
                            </div>
                        </li>

                        <li>
                            <div class="modal-instance w-100">
                                <a class="btn btn--sm type--uppercase modal-trigger log-in mt-1" href="#modal-login" v-if="!session" style="line-height: 30px;width: 100%;">
                                    <span class="btn__text btn-publish-navbar">
                                        {{ lang.BUTTON.LOGIN }}
                                    </span>
                                </a>

                                <div id="modal-login" class="modal-container">
                                    <div class="modal-content section-modal">
                                        <section class="unpad">
                                            <div class="container">
                                                <div class="row justify-content-center">
                                                    <div class="col-md-6">
                                                        <div class="boxed boxed--lg bg--white text-center feature">
                                                            <div class="modal-close modal-close-cross"></div>
                                                            <h3>{{ lang.LOGIN.TITLE }}</h3>
                                                            <div class="feature__body">
                                                                <form id="login-form" action="#0" v-on:submit="login" class="content-login">
                                                                    <div class="row">
                                                                        <div class="col-md-12 text-left">
                                                                            <input id="login-username" v-model="loginForm.username.value"
                                                                                   ref="loginusername"
                                                                                   v-on:input="checkUsername"
                                                                                   type="text" v-bind:placeholder="lang.LOGIN.USERNAME"/>
                                                                            <span class="error-color-form">{{ loginForm.username.error || ' ' }}</span>
                                                                        </div>
                                                                        <div class="col-md-12 text-left">
                                                                            <input id="login-password" v-model="loginForm.password.value"
                                                                                   type="password" v-bind:placeholder="lang.LOGIN.PASSWORD_OR_WIF"/>
                                                                            <span class="error-color-form">{{ loginForm.password.error || ' ' }}</span>
                                                                        </div>
                                                                        <div class="col m-2">
                                                                            <div class="btn btn--transparent w-100">
                                                                                <span class="btn__text color--dark" v-on:click="closeLogin">
                                                                                    {{ lang.BUTTON.CANCEL }}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                        <div class="col m-2">
                                                                            <div class="btn btn--primary w-100" v-on:click="login">
                                                                                <span class="btn__text">
                                                                                    {{ lang.BUTTON.LOGIN }}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div class="row">
                                                                        <div class="col-md-12 text-center">
                                                                            <h3 class="login-description">{{ lang.LOGIN.NOT_USER }}</h3>
                                                                        </div>
                                                                    </div>
                                                                    <div class="row">
                                                                        <div class="col-md-8 offset-md-2 text-center">
                                                                            <span>{{ lang.LOGIN.TEXT }}</span>
                                                                        </div>
                                                                    </div>
                                                                    <div class="row mt-3">
                                                                        <div class="col-md-8 offset-md-2 text-center">
                                                                            <a class="btn btn--black" href="/welcome">
                                                                                <span class="btn__text color--white">
                                                                                    {{ lang.BUTTON.SIGN_UP }}
                                                                                </span>
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                </form>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>

    <nav id="menu1" class="bar bar--sm bar-1 hidden-xs bar--absolute pos-fixed bg-dark" data-scroll-class="90vh:pos-fixed">
        <div class="container">
            <div class="row">
                <div class="col-2 col-md-2 col-lg-2 hidden-xs">
                    <div class="bar__module">
                        <a href="/">
                            <img class="logo" alt="logo" src="/img/logo_creary_beta.svg"/>
                        </a>
                    </div>
                </div>
                <div class="col-12 col-md-10 col-lg-10  text-center text-left-xs text-left-sm">
                    <div class="bar__module">
                        <ul class="menu-horizontal text-left">
                            <li v-if="session" class="d-none d-md-inline-block">
                                <a v-bind:href="'/@' + session.account.username + '/feed'">{{ lang.HOME.MENU_FOLLOWING }}</a>
                            </li>
                            <li class="d-none d-md-inline-block"><a href="/popular" v-on:click="retrieveTrendingContent">{{ lang.HOME.MENU_POPULAR }}</a></li>
                            <li class="d-none d-md-inline-block"><a href="/skyrockets" v-on:click="retrieveHotContent">{{ lang.HOME.MENU_SKYROCKETS }}</a></li>
                            <li class="d-none d-md-inline-block"><a href="/now" v-on:click="retrieveNowContent">{{ lang.HOME.MENU_NOW }}</a></li>
                            <li class="d-none d-md-inline-block"><a href="/promoted" v-on:click="retrievePromotedContent">{{ lang.HOME.MENU_PROMOTED }}</a></li>



                            <!--- Links Mobil --->

                            <li class="d-block d-sm-block d-md-none" v-if="session"><a v-bind:href="'/@' + session.account.username + '/projects'">{{ lang.PROFILE_MENU.PROJECTS }}</a></li>
                            <li class="d-block d-sm-block d-md-none" v-if="session"><a v-bind:href="'/@' + session.account.username + '/wallet'">{{ lang.PROFILE_MENU.WALLET }}</a></li>
                            <li class="d-block d-sm-block d-md-none" v-if="session"><a v-bind:href="'/@' + session.account.username + '/passwords'">{{ lang.PROFILE_MENU.CHANGE_PASSWORD }}</a></li>
                            <li class="d-block d-sm-block d-md-none" v-if="session"><a v-bind:href="'/@' + session.account.username + '/settings'">{{ lang.PROFILE_MENU.SETTINGS }}</a></li>
                            <li class="dropdown d-block d-sm-block d-md-none" v-if="session">
                                <span class="dropdown__trigger text-capitalize">More</span>
                                <div class="dropdown__container">
                                    <div class="container">
                                        <div class="row">
                                            <div class="dropdown__content col-lg-2 col-md-4 dropdown__content-mobile">
                                                <ul class="menu-vertical">
                                                    <li class="separate">
                                                        <a href="/faq">
                                                            <span>{{ lang.DOTS_MENU.FAQ }}</span>
                                                        </a>
                                                    </li>
                                                    <li class="">
                                                        <a href="/~witness">
                                                            <span>{{ lang.DOTS_MENU.VOTE }}</span>
                                                        </a>
                                                    </li>

                                                    <li class="">
                                                        <a href="/explore">
                                                            <span>{{ lang.DOTS_MENU.EXPLORE }}</span>
                                                        </a>
                                                    </li>
                                                    <li class="separate">
                                                        <a href="https://creaproject.io/creary/" target="_blank">
                                                            <span >{{ lang.DOTS_MENU.ABOUT }}</span>
                                                        </a>
                                                    </li>
                                                    <li class="">
                                                        <a href="#">
                                                            <span>{{ lang.DOTS_MENU.WHITEPAPER }}</span>
                                                        </a>
                                                    </li>
                                                    <li class="">
                                                        <a href="#">
                                                            <span>{{ lang.DOTS_MENU.PRIVACY }}</span>
                                                        </a>
                                                    </li>
                                                    <li class="">
                                                        <a href="#">
                                                            <span>{{ lang.DOTS_MENU.TERMS }}</span>
                                                        </a>
                                                    </li>
                                                    <li class="separate">
                                                        <div class="side-menu__module">
                                                            <ul class="social-list list-inline list--hover">
                                                                <li>
                                                                    <a href="https://t.me/Creary_net" target="_blank">
                                                                        <i class="socicon socicon-telegram icon icon--xs"></i>
                                                                    </a>
                                                                </li>
                                                                <li>
                                                                    <a href="https://twitter.com/Crearynet" target="_blank">
                                                                        <i class="socicon socicon-twitter icon icon--xs"></i>
                                                                    </a>
                                                                </li>
                                                                <li>
                                                                    <a href="https://www.instagram.com/crearynet/" target="_blank">
                                                                        <i class="socicon socicon-instagram icon icon--xs"></i>
                                                                    </a>
                                                                </li>
                                                                <li>
                                                                    <a href="https://medium.com/creary/" target="_blank">
                                                                        <i class="socicon socicon-medium icon icon--xs"></i>
                                                                    </a>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <!-- Mobile --->
                    <div class="bar__module d-block d-sm-block d-md-none" v-if="session">
                        <ul class="menu-horizontal text-left">
                            <li><a href="." v-on:click="logout">{{ lang.PROFILE_MENU.LOGOUT }}</a></li>
                        </ul>
                    </div>


                    <div class="bar__module float-lg-right float-md-right">
                        <ul class="menu-horizontal text-left">
                            <li class="hidden-xs">
                                <!-- desktop-->
                                <div data-notification-link="search-box" class="search icons-navbar">
                                    <i class="stack-search"></i>
                                </div>
                            </li>


                            <li v-if="session">
                                <!-- mobile-->
                                <a class="btn btn--sm btn--primary type--uppercase hidden-sm hidden-md hidden-lg li-publish-navbar mb-2" href="/publish" style="margin: 10px auto 20px !important;">
                                    <span class="btn__text btn-publish-navbar">
                                        {{ lang.BUTTON.PUBLISH }}
                                    </span>
                                </a>
                                <!-- desktop-->
                                <a class="btn btn--sm btn--primary type--uppercase  hidden-xs" href="/publish">
                                    <span class="btn__text btn-publish-navbar">
                                        {{ lang.BUTTON.PUBLISH }}
                                    </span>
                                </a>
                            </li>

                            <li v-if="!session" class="hidden-xs">
                                <a class="btn btn--sm type--uppercase " href="/welcome">
                                    <span class="btn__text btn-publish-navbar">
                                        {{ lang.BUTTON.SIGN_UP }}
                                    </span>
                                </a>
                            </li>

                            <li v-if="!session" class="hidden-xs">
                                <div class="hidden-sm hidden-md hidden-lg navbar-submenu-mobile">
                                    <a href="#0" data-notification-link="side-menu">
                                        <i class="stack-menu"></i>
                                    </a>
                                </div>
                            </li>

                            <li v-if="session" class="li-avatar-navbar hidden-xs">

                                <div class="dropdown">
                                    <span class="dropdown__trigger">
                                        <div class="user-avatar" >
                                            <avatar v-bind:account="user"></avatar>
                                        </div>
                                        <div class="row-user-name-navbar-mobile hidden-sm hidden-md hidden-lg">
                                            <span style="color: white;">{{ '@' + user.name }}</span>
                                        </div>
                                        <div class="hidden-sm hidden-md hidden-lg navbar-submenu-mobile">
                                            <a href="#0" data-notification-link="side-menu">
                                                <i class="stack-menu"></i>
                                            </a>
                                        </div>
                                    </span>
                                    <div class="dropdown__container">
                                        <div class="container">
                                            <div class="row">
                                                <div class="col-md-12 col-lg-2 dropdown__content">
                                                    <ul class="menu-vertical">
                                                        <li><a v-bind:href="'/@' + session.account.username + '/projects'">{{ lang.PROFILE_MENU.PROJECTS }}</a></li>
                                                        <li class="separate"><a v-bind:href="'/@' + session.account.username + '/wallet'">{{ lang.PROFILE_MENU.WALLET }}</a></li>
                                                        <li class="separate"><a v-bind:href="'/@' + session.account.username + '/passwords'">{{ lang.PROFILE_MENU.CHANGE_PASSWORD }}</a></li>
                                                        <li class="separate"><a v-bind:href="'/@' + session.account.username + '/settings'">{{ lang.PROFILE_MENU.SETTINGS }}</a></li>
                                                        <li class="separate"><a href="." v-on:click="logout">{{ lang.PROFILE_MENU.LOGOUT }}</a></li>
                                                    </ul>
                                                </div>
                                            </div><!--end row-->
                                        </div><!--end container-->
                                    </div><!--end dropdown container-->
                                </div>
                            </li>

                            <li class="hidden-xs">
                                <div class="modal-instance">
                                    <a href="#modal-login" v-if="!session" class="modal-trigger log-in">{{ lang.BUTTON.LOGIN }}</a>

                                    <div id="modal-login" v-if="!session" class="modal-container">
                                        <div class="modal-content section-modal">
                                            <section class="unpad ">
                                                <div class="container">
                                                    <div class="row justify-content-center">
                                                        <div class="col-md-6">
                                                            <div class="boxed boxed--lg bg--white text-center feature">
                                                                <div class="modal-close modal-close-cross"></div>
                                                                <h3>{{ lang.LOGIN.TITLE }}</h3>
                                                                <div class="feature__body">
                                                                    <form id="login-form" action="#0" v-on:submit="login" class="content-login">
                                                                        <div class="row">
                                                                            <div class="col-md-12 text-left">
                                                                                <input id="login-username" v-model="loginForm.username.value"
                                                                                       ref="loginusername"
                                                                                       v-on:input="checkUsername"
                                                                                       type="text" v-bind:placeholder="lang.LOGIN.USERNAME"/>
                                                                                <span class="error-color-form">{{ loginForm.username.error || ' ' }}</span>
                                                                            </div>
                                                                            <div class="col-md-12 text-left">
                                                                                <input id="login-password" v-model="loginForm.password.value"
                                                                                       type="password" v-bind:placeholder="lang.LOGIN.PASSWORD_OR_WIF"/>
                                                                                <span class="error-color-form">{{ loginForm.password.error || ' ' }}</span>
                                                                            </div>
                                                                            <div class="col m-2">
                                                                                <div class="btn btn--transparent w-100">
                                                                                    <span class="btn__text color--dark" v-on:click="closeLogin">
                                                                                        {{ lang.BUTTON.CANCEL }}
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                            <div class="col m-2">
                                                                                <div class="btn btn--primary w-100" v-on:click="login">
                                                                                    <span class="btn__text">
                                                                                        {{ lang.BUTTON.LOGIN }}
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div class="row">
                                                                            <div class="col-md-12 text-center">
                                                                                <h3 class="login-description">{{ lang.LOGIN.NOT_USER }}</h3>
                                                                            </div>
                                                                        </div>
                                                                        <div class="row">
                                                                            <div class="col-md-8 offset-md-2 text-center">
                                                                                <span>{{ lang.LOGIN.TEXT }}</span>
                                                                            </div>
                                                                        </div>
                                                                        <div class="row mt-3">
                                                                            <div class="col-md-8 offset-md-2 text-center">
                                                                                <a class="btn btn--black" href="/welcome">
                                                                                    <span class="btn__text color--white">
                                                                                        {{ lang.BUTTON.SIGN_UP }}
                                                                                    </span>
                                                                                </a>
                                                                            </div>
                                                                        </div>
                                                                        <!--end of row-->
                                                                    </form>

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
                            <li v-pre class="hidden-xs">
                                <div class="icons-navbar navbar-menu-icon" data-notification-link="side-menu">
                                    <i class="stack-menu"></i>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </nav>
</div>
<script src="/js/common/navbar.js"></script>