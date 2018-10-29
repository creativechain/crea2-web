<?php include('element/navbar.php'); ?>
<div class="main-container view-profile view-wallet">
    <div v-cloak id="home-banner">
        <?php include ('modules/banner.php') ?>
    </div>
    <section v-cloak id="wallet-menu" class="cta cta-4 space--xxs border--bottom ">
        <div class="container">
            <div class="row">
                <?php include('modules/navbar-profile.php') ?>
            </div>
        </div>
    </section>

    <section v-cloak id="wallet-container" class="bg--secondary p-top-15">
        <div class="container-fluid">
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
                                            <span>Your current rewards: {{ account.user.reward_crea_balance}},
                                                {{ account.user.reward_cbd_balance}} and
                                                {{ getCGYReward() }}
                                            </span>
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
                                                <li v-bind:class="{ active: tab === 'balances' }" v-on:click="tab = 'balances'">
                                                    <div class="tab__title">
                                                        <span class="h5">{{ lang.WALLET.BALANCES }}</span>
                                                    </div>

                                                </li>
                                                <li v-bind:class="{ active: tab === 'permissions' }" v-on:click="tab = 'permissions'">
                                                    <div class="tab__title">
                                                        <span class="h5">{{ lang.WALLET.PERMISSIONS }}</span>
                                                    </div>

                                                </li>
                                                <li v-bind:class="{ active: tab === 'passwords' }" v-on:click="tab = 'passwords'">
                                                    <div class="tab__title">
                                                        <span class="h5">{{ lang.WALLET.PASSWORDS }}</span>
                                                    </div>

                                                </li>

                                            </ul>

                                            <ul id="wallet-tabs" class="tabs-content">
                                                <li v-bind:class="{ active: tab === 'balances' }">
                                                    <div v-bind:class="{ tab__content: true, hidden: tab !== 'balances' }">
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
                                                                        <span id="wallet-balance-crea" class="dropdown__trigger">{{ account.user.balance }}</span>
                                                                        <div class="dropdown__container">
                                                                            <div class="container">
                                                                                <div class="row">
                                                                                    <div class="col-md-3 col-lg-2 dropdown__content">
                                                                                        <ul class="menu-vertical">
                                                                                            <li>
                                                                                                <div class="modal-instance block">
                                                                                                    <a class="modal-trigger" href="#wallet-send-crea">
                                                                                                            <span class="btn__text">
                                                                                                                {{ lang.BUTTON.SEND }}
                                                                                                            </span>
                                                                                                    </a>
                                                                                                    <div id="wallet-send-crea" class="modal-container modal-send" data-modal-id="wallet-send-crea">
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
                                                                                                                                                    <input disabled type="text" v-model="from" v-bind:placeholder="lang.MODAL.WALLET_INPUT_SEND_PLACEHOLDER">
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
                                                                                                                                                    <input v-model="to" type="text" name="input" v-bind:placeholder="lang.MODAL.WALLET_INPUT_SEND_PLACEHOLDER">
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
                                                                                                                                                    <input v-model="amount" type="number" step="0.001" name="input" v-bind:placeholder="lang.MODAL.WALLET_INPUT_AMOUNT">
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
                                                                                            <li>{{ lang.WALLET.DROPDOWN_MENU_TRANSFER }}</li>
                                                                                            <li>{{ lang.WALLET.DROPDOWN_MENU_TRANS_SAVINGS }}</li>
                                                                                            <li>{{ lang.WALLET.DROPDOWN_MENU_ENERGIZE }}</li>
                                                                                            <li>{{ lang.WALLET.DROPDOWN_MENU_MARKET }}</li>
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
                                                                        <span class="dropdown__trigger">{{ getCGYBalance() }}</span>
                                                                        <div class="dropdown__container">
                                                                            <div class="container">
                                                                                <div class="row">
                                                                                    <div class="col-md-3 col-lg-2 dropdown__content">
                                                                                        <ul class="menu-vertical">
                                                                                            <li>{{ lang.WALLET.DROPDOWN_MENU_ENERGIZE }}</li>
                                                                                            <li>{{ lang.WALLET.DROPDOWN_MENU_CANCEL_DE_ENERGIZE }}</li>
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
                                                                        <span class="dropdown__trigger">{{ account.user.cbd_balance }}</span>
                                                                        <div class="dropdown__container">
                                                                            <div class="container">
                                                                                <div class="row">
                                                                                    <div class="col-md-3 col-lg-2 dropdown__content">
                                                                                        <ul class="menu-vertical">
                                                                                            <li>{{ lang.WALLET.DROPDOWN_MENU_TRANSFER }}</li>
                                                                                            <li>{{ lang.WALLET.DROPDOWN_MENU_TRANS_SAVINGS }}</li>
                                                                                            <li>{{ lang.WALLET.DROPDOWN_MENU_MARKET }}</li>
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
                                                                        <span class="dropdown__trigger">{{ account.user.savings_balance }}</span>
                                                                        <div class="dropdown__container">
                                                                            <div class="container">
                                                                                <div class="row">
                                                                                    <div class="col-md-3 col-lg-2 dropdown__content">
                                                                                        <ul class="menu-vertical">
                                                                                            <li>{{ lang.WALLET.DROPDOWN_MENU_WITHDRAW_CREA }}</li>
                                                                                            <li>{{ lang.WALLET.DROPDOWN_MENU_WITHDRAW_CBD }}</li>
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
                                                                    <p>{{ lang.WALLET.BALANCES_ACCOUNT_TITLE }}</p>
                                                                    <p>{{ lang.WALLET.BALANCES_ACCOUNT_TEXT }}</p>
                                                                </td>
                                                                <td style="text-align: right">
                                                                    <p>55,28$</p>
                                                                </td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </li>
                                                <li v-bind:class="{ active: tab === 'permissions' }">
                                                    <div v-bind:class="{ tab__content: true, hidden: tab !== 'permissions' }">
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
                                                                    <p><img src="img/qr-demo-permisos.png" alt="">{{ getKey('posting') }}</p>
                                                                    <p>{{ lang.WALLET.PERMISSIONS_TEXT_POSTING }}</p>
                                                                </td>
                                                                <td style="text-align: right">
                                                                    <a class="btn btn--sm" href="#/" v-on:click="showPriv.posting = true">
                                                                        <span class="btn__text text__dark">{{ lang.BUTTON.SHOW_PRIV_KEY }}</span>
                                                                    </a>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    <p>{{ lang.WALLET.PERMISSIONS_TITLE_ACTIVE }}</p>
                                                                    <p><img src="img/qr-demo-permisos.png" alt="">{{ getKey('active') }}</p>
                                                                    <p>{{ lang.WALLET.PERMISSIONS_TEXT_POSTING }}</p>
                                                                </td>
                                                                <td style="text-align: right">
                                                                    <a class="btn btn--sm" href="#/" v-on:click="showPriv.active = true">
                                                                        <span class="btn__text text__dark">Acceder para mostrar</span>
                                                                    </a>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    <p>{{ lang.WALLET.PERMISSIONS_TITLE_OWNER }}</p>
                                                                    <p><img src="img/qr-demo-permisos.png" alt="">{{ getKey('owner') }}</p>
                                                                    <p>{{ lang.WALLET.PERMISSIONS_TEXT_OWNER }}</p>
                                                                </td>
                                                                <td style="text-align: right">

                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    <p>{{ lang.WALLET.PERMISSIONS_TITLE_MEMO }}</p>
                                                                    <p><img src="img/qr-demo-permisos.png" alt="">{{ getKey('memo') }}</p>
                                                                    <p>{{ lang.WALLET.PERMISSIONS_TEXT_MEMO }}</p>
                                                                </td>
                                                                <td style="text-align: right">
                                                                    <a class="btn btn--sm" href="#/" v-on:click="showPriv.memo = true">
                                                                        <span class="btn__text text__dark">{{ lang.BUTTON.SHOW_PRIV_KEY }}</span>
                                                                    </a>
                                                                </td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </li>
                                                <li v-bind:class="{ active: tab === 'passwords' }" class="wallet-password-tab">
                                                    <div v-bind:class="{ tab__content: true, hidden: tab !== 'passwords' }">
                                                        <div class="row content-tab-password">
                                                            <div class="col-md-12">
                                                                <h3>Restablecer la contraseña de annori</h3>
                                                                <p class="alert-wallet-tab">RECUERDA:</p>
                                                                <ul class="alert-wallet-tab">
                                                                    <li><p>Si alguna vez pierdes tu contraseña, tu cuenta se perderá irremediablemente y no podrás acceder a su contenido o a sus tokens.</p></li>
                                                                    <li><p>No guardamos tu contraseña, y no podremos ayudarte a recuperarla.</p></li>
                                                                    <li><p>Si añades una nueva contraseña que puede memorizar, esta no es una contraseña segura.</p></li>
                                                                    <li><p>Usa contraseñas creadas de forma aleatoria, contra más caracteres de longitud tenga más segura será.</p></li>
                                                                    <li><p>No le digas a nadie cuál es tu contraseña de Creary.</p></li>
                                                                    <li><p>Haz siempre alguna copia de seguridad de tu contraseña.</p></li>
                                                                </ul>
                                                            </div>
                                                            <div class="col-md-12 mt-3">
                                                                <label>NOMBRE DE CUENTA</label>
                                                                <input class="validate-required" type="text" placeholder="Escribe tu nombre de usario"/>
                                                            </div>
                                                            <div class="col-md-12 mt-3">
                                                                <label>CONTRASEÑA ACTUAL</label>
                                                                <input class="validate-required" type="password" placeholder="Contraseña"/>
                                                            </div>
                                                            <div class="col-md-4 mt-3">
                                                                <label>CONTRASEÑA GENERADA</label>
                                                                <a class="btn btn--sm btn--black mt-3" href="">
                                                                    <span class="btn__text">Confirmar contraseña</span>
                                                                </a>
                                                            </div>
                                                            <div class="col-md-12 mt-3">
                                                                <label>REINTRODUCE LA CONTRASEÑA GENERADA</label>
                                                                <input class="validate-required" type="password" placeholder="Contraseña"/>
                                                            </div>
                                                            <div class="col-md-12 mt-3">
                                                                <div class="input-checkbox">
                                                                    <input id="" type="checkbox" name="" />
                                                                    <label for=""></label>
                                                                </div>
                                                                <span>Entiendo y soy consciente que Creary no puede recuperar contraseñas perdidas.</span>
                                                            </div>
                                                            <div class="col-md-12">
                                                                <div class="input-checkbox">
                                                                    <input id="" type="checkbox" name="" />
                                                                    <label for=""></label>
                                                                </div>
                                                                <span>He guardado de forma segura mi nueva contraseña generada.</span>
                                                            </div>
                                                            <div class="col-md-4 mt-3">
                                                                <a class="btn btn--sm btn--primary" href="">
                                                                    <span class="btn__text">Actualizar contraseña</span>
                                                                </a>
                                                            </div>
                                                        </div>
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
