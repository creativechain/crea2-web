<?php include ('element/navbar.php'); ?>
<div class="main-container view-profile view-wallet">
    <section id="wallet-menu" class="cta cta-4 space--xxs border--bottom ">
        <div class="container">
            <div class="row">
                <?php include ('modules/navbar-profile.php') ?>
            </div>
        </div>
    </section>

    <section id="wallet-container" class="bg--secondary p-top-15">
        <div class="container">
            <div class="row">
                <div class="col-lg-4 col-xl-3">
                    <?php include ('modules/profile-info.php') ?>
                </div>
                <div class="col-lg-8 col-xl-9">
                    <section class="unpad--bottom unpad--top">
                        <div class="container padding-b-10">
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="alert bg--primary">
                                        <div class="alert__body">
                                            <span>Your current rewards: 0.877 CREA, 0.665 CREA EURO and 1.357 CREA POWER</span>
                                        </div>
                                        <div class="alert__close">
                                            ×
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!--end of masonry-->
                        </div>
                        <!--end of container-->
                    </section>
                    <section class="unpad--top">
                        <div class="container">
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="boxed boxed--border">
                                        <div class="tabs-container tabs--folder tabs-container-primary">
                                            <ul class="tabs tabs-primary">
                                                <li class="active">
                                                    <div class="tab__title">
                                                        <span class="h5">Saldos</span>
                                                    </div>
                                                    <div class="tab__content">
                                                        <table class="table-amount table">
                                                            <thead class="hidden">
                                                                <tr>
                                                                    <th style="width: 70%">Value 1</th>
                                                                    <th style="width: 30%">Value 2</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                            <tr>
                                                                <td>
                                                                    <p>{{ lang.WALLET.BALANCES_CREA_TITLE }}</p>
                                                                    <p>{{ lang.WALLET.BALANCES_CREA_TEXT }}</p>
                                                                </td>
                                                                <td style="text-align: right">
                                                                    <div class="dropdown">
                                                                        <span class="dropdown__trigger">{{ funds.crea }}</span>
                                                                        <div class="dropdown__container">
                                                                            <div class="container">
                                                                                <div class="row">
                                                                                    <div class="col-md-3 col-lg-2 dropdown__content">
                                                                                        <ul class="menu-vertical">
                                                                                            <li>
                                                                                                <div class="modal-instance">
                                                                                                    <a class="modal-trigger" href="#">
                                                                                                        <span class="btn__text">
                                                                                                            Enviar
                                                                                                        </span>
                                                                                                    </a>
                                                                                                    <div class="modal-container">
                                                                                                        <div class="modal-content">
                                                                                                            <div class="boxed boxed--lg">
                                                                                                                <h2>Enviar CREA</h2>
                                                                                                                <hr class="short">
                                                                                                                <p>Mover fondos a otras cuents</p>
                                                                                                                <div class="row">
                                                                                                                    <div class="col-md-3">
                                                                                                                        <p>DE</p>
                                                                                                                    </div>
                                                                                                                    <div class="col-md-9">
                                                                                                                        <div class="input-icon input-icon--left">
                                                                                                                            <i class="fas fa-at"></i>
                                                                                                                            <input type="text" name="input" placeholder="Enter your name">
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div class="row">
                                                                                                                    <div class="col-md-3">
                                                                                                                        <p>A</p>
                                                                                                                    </div>
                                                                                                                    <div class="col-md-9">
                                                                                                                        <div class="input-icon input-icon--left">
                                                                                                                            <i class="fas fa-at"></i>
                                                                                                                            <input type="text" name="input" placeholder="Enter your name">
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div class="row">
                                                                                                                    <div class="col-md-3">
                                                                                                                        <p>Cantidad</p>
                                                                                                                    </div>
                                                                                                                    <div class="col-md-9">
                                                                                                                        <div class="input-icon input-icon--right">
                                                                                                                            <i class="">CREA</i>
                                                                                                                            <input type="text" name="input" placeholder="Enter your name">
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                            <div class="modal-close modal-close-cross"></div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </li>
                                                                                            <li>Transferir ahorros</li>
                                                                                            <li>Energize</li>
                                                                                            <li>Mercado</li>
                                                                                        </ul>
                                                                                    </div>
                                                                                </div><!--end row-->
                                                                            </div><!--end container-->
                                                                        </div><!--end dropdown container-->
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    <p>{{ lang.WALLET.BALANCES_CGY_TITLE }}</p>
                                                                    <p>{{ lang.WALLET.BALANCES_CGY_TEXT }}</p>
                                                                </td>
                                                                <td style="text-align: right">
                                                                    <div class="dropdown">
                                                                        <span class="dropdown__trigger">{{ funds.cgy }}</span>
                                                                        <div class="dropdown__container">
                                                                            <div class="container">
                                                                                <div class="row">
                                                                                    <div class="col-md-3 col-lg-2 dropdown__content">
                                                                                        <ul class="menu-vertical">
                                                                                            <li>Enviar</li>
                                                                                            <li>Transferir ahorros</li>
                                                                                            <li>Energize</li>
                                                                                            <li>Mercado</li>
                                                                                        </ul>
                                                                                    </div>
                                                                                </div><!--end row-->
                                                                            </div><!--end container-->
                                                                        </div><!--end dropdown container-->
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    <p>{{ lang.WALLET.BALANCES_CBD_TITLE }}</p>
                                                                    <p>{{ lang.WALLET.BALANCES_CBD_TEXT }}</p>
                                                                </td>
                                                                <td style="text-align: right">
                                                                    <div class="dropdown">
                                                                        <span class="dropdown__trigger">{{ funds.cbd }}</span>
                                                                        <div class="dropdown__container">
                                                                            <div class="container">
                                                                                <div class="row">
                                                                                    <div class="col-md-3 col-lg-2 dropdown__content">
                                                                                        <ul class="menu-vertical">
                                                                                            <li>Enviar</li>
                                                                                            <li>Transferir ahorros</li>
                                                                                            <li>Energize</li>
                                                                                            <li>Mercado</li>
                                                                                        </ul>
                                                                                    </div>
                                                                                </div><!--end row-->
                                                                            </div><!--end container-->
                                                                        </div><!--end dropdown container-->
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    <p>{{ lang.WALLET.BALANCES_SAVING_TITLE }}</p>
                                                                    <p>{{ lang.WALLET.BALANCES_SAVING_TEXT }}</p>
                                                                </td>
                                                                <td style="text-align: right">
                                                                    <div class="dropdown">
                                                                        <span class="dropdown__trigger">{{ funds.vests }}</span>
                                                                        <div class="dropdown__container">
                                                                            <div class="container">
                                                                                <div class="row">
                                                                                    <div class="col-md-3 col-lg-2 dropdown__content">
                                                                                        <ul class="menu-vertical">
                                                                                            <li>Enviar</li>
                                                                                            <li>Transferir ahorros</li>
                                                                                            <li>Energize</li>
                                                                                            <li>Mercado</li>
                                                                                        </ul>
                                                                                    </div>
                                                                                </div><!--end row-->
                                                                            </div><!--end container-->
                                                                        </div><!--end dropdown container-->
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    <p>Valor de la cuenta aproximada</p>
                                                                    <p>{{ lang.WALLET.BALANCES_ACCOUNT }}</p>
                                                                </td>
                                                                <td style="text-align: right">
                                                                    <p>55,28$</p>
                                                                </td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div class="tab__title">
                                                        <span class="h5">Permisos</span>
                                                    </div>
                                                    <div class="tab__content">
                                                        <table class="table-permission table">
                                                            <thead class="hidden">
                                                                <tr>
                                                                    <th style="width: 70%">Value 1</th>
                                                                    <th style="width: 30%">Value 2</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr>
                                                                    <td>
                                                                        <p>{{ lang.WALLET.PERMISSIONS_TITLE_POSTING }}</p>
                                                                        <p><img src="img/qr-demo-permisos.png" alt="">{{ session.account.keys.posting.pub }}</p>
                                                                        <p>{{ lang.WALLET.PERMISSIONS_TEXT_POSTING }}</p>
                                                                    </td>
                                                                    <td style="text-align: right">
                                                                        <a class="btn btn--sm" href="#">
                                                                            <span class="btn__text">Mostrar clave privada</span>
                                                                        </a>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                                                        <p>{{ lang.WALLET.PERMISSIONS_TITLE_ACTIVE }}</p>
                                                                        <p><img src="img/qr-demo-permisos.png" alt="">{{ session.account.keys.active.pub }}</p>
                                                                        <p>{{ lang.WALLET.PERMISSIONS_TEXT_POSTING }}</p>
                                                                    </td>
                                                                    <td style="text-align: right">
                                                                        <a class="btn btn--sm" href="#">
                                                                            <span class="btn__text">Acceder para mostrar</span>
                                                                        </a>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                                                        <p>{{ lang.WALLET.PERMISSIONS_TITLE_OWNER }}</p>
                                                                        <p><img src="img/qr-demo-permisos.png" alt="">{{ session.account.keys.owner.pub }}</p>
                                                                        <p>{{ lang.WALLET.PERMISSIONS_TEXT_OWNER }}</p>
                                                                    </td>
                                                                    <td style="text-align: right">

                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                                                        <p>{{ lang.WALLET.PERMISSIONS_TITLE_MEMO }}</p>
                                                                        <p><img src="img/qr-demo-permisos.png" alt="">{{ session.account.keys.memo.pub }}</p>
                                                                        <p>{{ lang.WALLET.PERMISSIONS_TEXT_MEMO }}</p>
                                                                    </td>
                                                                    <td style="text-align: right">
                                                                        <a class="btn btn--sm" href="#">
                                                                            <span class="btn__text">Mostrar clave privada</span>
                                                                        </a>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div class="tab__title">
                                                        <span class="h5">Contraseñas</span>
                                                    </div>
                                                    <div class="tab__content">
                                                        <p class="lead">
                                                            Medium Rare is an elite author known for offering high-quality, high-value products backed by timely and personable support. Recognised and awarded by Envato on multiple occasions for producing consistently outstanding products, it's no wonder over 20,000 customers enjoy using Medium Rare templates.
                                                        </p>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="boxed boxed--border">
                                        <h5>Modern Aesthetic</h5>
                                        <p>
                                            Build a beautifully performant site with Stack's vast collection of modular elements.
                                        </p>
                                        <a class="btn btn--primary" href="#">
                                            <span class="btn__text">
                                                Build Now
                                            </span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <!--end of row-->
                        </div>
                        <!--end of container-->
                    </section>
                </div>
            </div>
            <!--end of row-->
        </div>
        <!--end of container-->
    </section>


<?php include ('element/footer.php'); ?>
