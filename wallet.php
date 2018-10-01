<?php include('element/navbar.php'); ?>
<div class="main-container view-profile view-wallet">
    <section id="wallet-menu" class="cta cta-4 space--xxs border--bottom ">
        <div class="container">
            <div class="row">
                <?php include('modules/navbar-profile.php') ?>
            </div>
        </div>
    </section>

    <section id="wallet-container" class="bg--secondary p-top-15">
        <div class="container">
            <div class="row">
                <div class="col-lg-4 col-xl-3">
                    <?php include('modules/profile-info.php') ?>
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
                                                        <span class="h5">{{ lang.WALLET.BALANCES }}</span>
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
                                                                        <span class="dropdown__trigger">{{ account ? account.balance : '0.000 CREA' }}</span>
                                                                        <div class="dropdown__container">
                                                                            <div class="container">
                                                                                <div class="row">
                                                                                    <div class="col-md-3 col-lg-2 dropdown__content">
                                                                                        <ul class="menu-vertical">
                                                                                            <li>
                                                                                                <div class="modal-instance block">
                                                                                                    <a class="modal-trigger" href="#">
                                                                                                            <span class="btn__text">
                                                                                                                Enviar
                                                                                                            </span>
                                                                                                    </a>
                                                                                                    <div class="modal-container modal-send">
                                                                                                        <div class="modal-content section-modal">
                                                                                                            <section class="unpad ">
                                                                                                                <div class="container">
                                                                                                                    <div class="row justify-content-center">
                                                                                                                        <div class="col-lg-6 col-md-8 col-sm-12">
                                                                                                                            <div class="feature feature-1">
                                                                                                                                <div class="feature__body boxed boxed--lg boxed--border">
                                                                                                                                    <div class="modal-close modal-close-cross"></div>
                                                                                                                                    <div class="text-block">
                                                                                                                                        <h3>{{ lang.WALLET.TRANSFER_CREA_TITLE }}</h3>
                                                                                                                                        <hr class="short">
                                                                                                                                        <p>{{ lang.WALLET.TRANSFER_CREA_TEXT }}</p>
                                                                                                                                    </div>
                                                                                                                                    <form>
                                                                                                                                        <div class="row">
                                                                                                                                            <div class="col-md-1">
                                                                                                                                                <p class="text-p-form">{{ lang.MODAL.WALLET_FROM }}</p>
                                                                                                                                            </div>
                                                                                                                                            <div class="col-md-11">
                                                                                                                                                <div class="input-icon input-icon--left">
                                                                                                                                                    <i class="fas fa-at"></i>
                                                                                                                                                    <input id="wallet-send-origin" type="text" name="input" placeholder="Enter your name">
                                                                                                                                                </div>
                                                                                                                                            </div>
                                                                                                                                        </div>
                                                                                                                                        <div class="row">
                                                                                                                                            <div class="col-md-1">
                                                                                                                                                <p class="text-p-form">{{ lang.MODAL.WALLET_TO}}</p>
                                                                                                                                            </div>
                                                                                                                                            <div class="col-md-11">
                                                                                                                                                <div class="input-icon input-icon--left">
                                                                                                                                                    <i class="fas fa-at"></i>
                                                                                                                                                    <input id="wallet-send-destiny" type="text" name="input" placeholder="Enter your name">
                                                                                                                                                </div>
                                                                                                                                            </div>
                                                                                                                                        </div>
                                                                                                                                        <div class="row">
                                                                                                                                            <div class="col-md-1">
                                                                                                                                                <p class="text-p-form">{{ lang.MODAL.WALLET_AMOUNT }}</p>
                                                                                                                                            </div>
                                                                                                                                            <div class="col-md-11">
                                                                                                                                                <div class="input-icon input-icon--right">
                                                                                                                                                    <i class="">CREA</i>
                                                                                                                                                    <input id="wallet-send-amount" type="text" name="input" v-bind:placeholder="lang.MODAL.WALLET_INPUT_AMOUNT">
                                                                                                                                                </div>
                                                                                                                                            </div>
                                                                                                                                        </div>
                                                                                                                                        <div class="row">
                                                                                                                                            <div class="col-md-1"></div>
                                                                                                                                            <div class="col-md-11">
                                                                                                                                                <p>{{ lang.MODAL.WALLET_MEMO_TEXT }}</p>
                                                                                                                                            </div>
                                                                                                                                        </div>
                                                                                                                                        <div class="row">
                                                                                                                                            <div class="col-md-1">
                                                                                                                                                <p class="text-p-form">{{ lang.MODAL.WALLET_MEMO }}</p>
                                                                                                                                            </div>
                                                                                                                                            <div class="col-md-11">
                                                                                                                                                <div class="input-icon input-icon--right">
                                                                                                                                                    <input id="wallet-send-memo" type="text" name="input" placeholder="Enter your name">
                                                                                                                                                </div>
                                                                                                                                            </div>
                                                                                                                                        </div>
                                                                                                                                        <!--end of row-->
                                                                                                                                    </form>
                                                                                                                                </div>
                                                                                                                            </div>
                                                                                                                            <!--end feature-->
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
                                                                        <span class="dropdown__trigger">{{ '0.000000 CGY' }}</span>
                                                                        <div class="dropdown__container">
                                                                            <div class="container">
                                                                                <div class="row">
                                                                                    <div class="col-md-3 col-lg-2 dropdown__content">
                                                                                        <ul class="menu-vertical">
                                                                                            <li>De-energize</li>
                                                                                            <li>Cancel De-energize</li>
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
                                                                        <span class="dropdown__trigger">{{ account ? account.cbd_balance : '0.000 CBD' }}</span>
                                                                        <div class="dropdown__container">
                                                                            <div class="container">
                                                                                <div class="row">
                                                                                    <div class="col-md-3 col-lg-2 dropdown__content">
                                                                                        <ul class="menu-vertical">
                                                                                            <li>Enviar</li>
                                                                                            <li>Transferir ahorros</li>
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
                                                                        <span class="dropdown__trigger">{{ account ? account.vesting_balance : '0.000 CREA' }}</span>
                                                                        <div class="dropdown__container">
                                                                            <div class="container">
                                                                                <div class="row">
                                                                                    <div class="col-md-3 col-lg-2 dropdown__content">
                                                                                        <ul class="menu-vertical">
                                                                                            <li>Retirar CREA</li>
                                                                                            <li>Retirar CBD</li>
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
                                                        <span class="h5">{{ lang.WALLET.PERMISSIONS }}</span>
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
                                                                    <p><img src="img/qr-demo-permisos.png" alt="">{{ session.account.keys.posting ? session.account.keys.posting.pub : '---' }}</p>
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
                                                                    <p><img src="img/qr-demo-permisos.png" alt="">{{ session.account.keys.active ? session.account.keys.active.pub : '---' }}</p>
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
                                                                    <p><img src="img/qr-demo-permisos.png" alt="">{{ session.account.keys.owner ? session.account.keys.owner.pub : '---' }}</p>
                                                                    <p>{{ lang.WALLET.PERMISSIONS_TEXT_OWNER }}</p>
                                                                </td>
                                                                <td style="text-align: right">

                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    <p>{{ lang.WALLET.PERMISSIONS_TITLE_MEMO }}</p>
                                                                    <p><img src="img/qr-demo-permisos.png" alt="">{{ session.account.keys.owner ? session.account.keys.memo.pub : '---' }}</p>
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
                                                        <span class="h5">{{ lang.WALLET.PASSWORDS }}</span>
                                                    </div>
                                                    <div class="tab__content">
                                                        <p class="lead">
                                                            Medium Rare is an elite author known for offering
                                                            high-quality, high-value products backed by timely and
                                                            personable support. Recognised and awarded by Envato on
                                                            multiple occasions for producing consistently outstanding
                                                            products, it's no wonder over 20,000 customers enjoy using
                                                            Medium Rare templates.
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
                                    <?php include ('modules/list-historial.php') ?>
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


    <?php include('element/footer.php'); ?>
