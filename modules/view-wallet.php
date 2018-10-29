<div class="col-md-12 padding-b-10">
    <div class="alert bg--primary">
        <div class="alert__body">
            <span>Pending Rewards: {{ state.user.reward_crea_balance}},
                {{ state.user.reward_cbd_balance}} {{ lang.COMMON.AND }}
                {{ getCGYReward() }}
            </span>
        </div>
        <div class="alert__close">
            ×
        </div>
    </div>
</div>

<div class="col-md-12">
    <div class="boxed boxed--border">
        <div class="tabs-container tabs--folder tabs-container-primary">
            <ul class="tabs tabs-primary">
                <li v-bind:class="{ active: walletTab === 'balances' }" v-on:click="walletTab = 'balances'">
                    <div class="tab__title">
                        <span class="h5">{{ lang.WALLET.BALANCES }}</span>
                    </div>

                </li>
                <li v-if="session" v-bind:class="{ active: walletTab === 'permissions' }" v-on:click="walletTab = 'permissions'">
                    <div class="tab__title">
                        <span class="h5">{{ lang.WALLET.PERMISSIONS }}</span>
                    </div>

                </li>
                <li v-if="session" v-bind:class="{ active: walletTab === 'passwords' }" v-on:click="walletTab = 'passwords'">
                    <div class="tab__title">
                        <span class="h5">{{ lang.WALLET.PASSWORDS }}</span>
                    </div>

                </li>

            </ul>

            <ul id="wallet-tabs" class="tabs-content">
                <li v-bind:class="{ active: walletTab === 'balances' }">
                    <div v-bind:class="{ tab__content: true, hidden: walletTab !== 'balances' }">
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
                                        <span id="wallet-balance-crea" class="dropdown__trigger">{{ state.user.balance }}</span>
                                        <div v-if="canWithdraw()" class="dropdown__container">
                                            <div class="container">
                                                <div class="row">
                                                    <div class="col-md-3 col-lg-2 dropdown__content">
                                                        <ul class="menu-vertical">
                                                            <li>
                                                                <div class="modal-instance block">
                                                                    <a class="modal-trigger" href="#wallet-send">
                                                                        <span class="btn__text" v-on:click="prepareModal('transfer_crea')">
                                                                            {{ lang.WALLET.DROPDOWN_MENU_TRANSFER }}
                                                                        </span>
                                                                    </a>
                                                                    <div id="wallet-send" class="modal-container modal-send" data-modal-id="wallet-send">
                                                                        <div class="modal-content section-modal">
                                                                            <section class="unpad ">
                                                                                <div class="container">
                                                                                    <div class="row justify-content-center">
                                                                                        <div class="col-lg-6 col-md-8 col-sm-12">
                                                                                            <div class="feature feature-1">
                                                                                                <div class="feature__body boxed boxed--lg boxed--border">
                                                                                                    <div class="modal-close modal-close-cross"></div>
                                                                                                    <div class="text-block">
                                                                                                        <h3>{{ config.title }}</h3>
                                                                                                        <hr class="short">
                                                                                                        <p>{{ config.text }}</p>
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
                                                                                                                    <input v-on:input="validateDestiny" v-bind:class="{ 'field-error': toError }" v-model="to" type="text" name="input" v-bind:placeholder="lang.MODAL.WALLET_INPUT_SEND_PLACEHOLDER">
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                        <div class="row">
                                                                                                            <div class="col-md-2">
                                                                                                                <p class="text-p-form">{{ lang.MODAL.WALLET_AMOUNT }}</p>
                                                                                                            </div>
                                                                                                            <div class="col-md-10">
                                                                                                                <div class="input-icon input-icon--right">
                                                                                                                    <i class="">CREA</i>
                                                                                                                    <input v-model="amount" type="number" step="0.001" name="input" v-bind:placeholder="lang.MODAL.WALLET_INPUT_AMOUNT">
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                        <div v-if="config.op != 'transfer_to_vests'" class="row">
                                                                                                            <div class="col-md-2"></div>
                                                                                                            <div class="col-md-10">
                                                                                                                <p>{{ lang.MODAL.WALLET_MEMO_TEXT }}</p>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                        <div v-if="config.op != 'transfer_to_vests'" class="row">
                                                                                                            <div class="col-2">
                                                                                                                <p class="text-p-form">{{ lang.MODAL.WALLET_MEMO }}</p>
                                                                                                            </div>
                                                                                                            <div class="col-md-10">
                                                                                                                <div class="input-icon input-icon--right">
                                                                                                                    <input v-model="memo" type="text" placeholder="Enter your name">
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                        <div class="row mt-3">
                                                                                                            <div class="col text-right">
                                                                                                                <a href="#0" class="btn btn--sm btn--primary type--uppercase" v-on:click="sendCrea">
                                                                                                                    <span class="btn__text">{{ config.button }}</span>
                                                                                                                </a>
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
                                                            <li>
                                                                <div class="modal-instance block">
                                                                    <a class="modal-trigger" href="#wallet-send">
                                                                        <span class="btn__text" v-on:click="prepareModal('transfer_to_savings')">
                                                                            {{ lang.WALLET.DROPDOWN_MENU_TRANS_SAVINGS }}
                                                                        </span>
                                                                    </a>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div class="modal-instance block">
                                                                    <a class="modal-trigger" href="#wallet-send">
                                                                        <span class="btn__text" v-on:click="prepareModal('transfer_to_vests')">
                                                                            {{ lang.WALLET.DROPDOWN_MENU_ENERGIZE }}
                                                                        </span>
                                                                    </a>
                                                                </div>
                                                            </li>
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
                                        <div v-if="canWithdraw()" class="dropdown__container">
                                            <div class="container">
                                                <div class="row">
                                                    <div class="col-md-3 col-lg-2 dropdown__content">
                                                        <ul class="menu-vertical">
                                                            <li>{{ lang.WALLET.DROPDOWN_MENU_DE_ENERGIZE }}</li>
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
                                        <span class="dropdown__trigger">{{ state.user.cbd_balance }}</span>
                                        <div v-if="canWithdraw()" class="dropdown__container">
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
                                        <span class="dropdown__trigger">{{ state.user.savings_balance }}</span>
                                        <div v-if="canWithdraw()" class="dropdown__container">
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
                <li v-if="session" v-bind:class="{ active: walletTab === 'permissions' }">
                    <div v-bind:class="{ tab__content: true, hidden: walletTab !== 'permissions' }">
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
                                    <a v-if="session" class="btn btn--sm" href="#0" v-on:click="showPriv.posting = true">
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
                                    <a v-if="session" class="btn btn--sm" href="#0" v-on:click="showPriv.active = true">
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
                                    <a v-if="session" class="btn btn--sm" href="#0" v-on:click="showPriv.memo = true">
                                        <span class="btn__text text__dark">{{ lang.BUTTON.SHOW_PRIV_KEY }}</span>
                                    </a>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </li>
                <li v-if="session" v-bind:class="{ active: walletTab === 'passwords' }" class="wallet-password-tab">
                    <div v-bind:class="{ tab__content: true, hidden: walletTab !== 'passwords' }">
                        <div class="row content-tab-password">
                            <div class="col-md-12">
                                <h3>{{ lang.CHANGE_PASSWORD.TITLE }}</h3>
                                <p class="alert-wallet-tab">{{ lang.CHANGE_PASSWORD.SUBTITLE }}</p>
                                <ul class="alert-wallet-tab">
                                    <li><p>{{ lang.CHANGE_PASSWORD.RULE_1 }}</p></li>
                                    <li><p>{{ lang.CHANGE_PASSWORD.RULE_2 }}</p></li>
                                    <li><p>{{ lang.CHANGE_PASSWORD.RULE_3 }}</p></li>
                                    <li><p>{{ lang.CHANGE_PASSWORD.RULE_4 }}</p></li>
                                    <li><p>{{ lang.CHANGE_PASSWORD.RULE_5 }}</p></li>
                                    <li><p>{{ lang.CHANGE_PASSWORD.RULE_6 }}</p></li>
                                </ul>
                            </div>
                            <div class="col-md-12 mt-3">
                                <label>{{ lang.CHANGE_PASSWORD.ACCOUNT_NAME }}</label>
                                <input class="validate-required" disabled type="text" v-bind:value="session.account.username"/>
                            </div>
                            <div class="col-md-12 mt-3">
                                <label>{{ lang.CHANGE_PASSWORD.CURRENT_PASSWORD }}</label>
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
                                <span>{{ lang.CHANGE_PASSWORD.RADIO_INPUT_UNDERSTAND }}</span>
                            </div>
                            <div class="col-md-12">
                                <div class="input-checkbox">
                                    <input id="" type="checkbox" name="" />
                                    <label for=""></label>
                                </div>
                                <span>{{ lang.CHANGE_PASSWORD.RADIO_INPUT_SAFELY }}</span>
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

<div class="col-md-12">
    <?php include ('modules/list-historial.php') ?>
</div>