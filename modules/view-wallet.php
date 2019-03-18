<div class="w-100 padding-b-10" v-bind:class="{ hidden: !(session && state.user.name === session.account.username && hasRewardBalance()) }">
    <div class="alert bg--primary">
        <div class="alert__body">
            <span>{{ lang.WALLET.PENDING_REWARDS }}: {{ state.user.reward_crea_balance}},
                {{ state.user.reward_cbd_balance}} {{ lang.COMMON.AND }}
                {{ getCGYReward() }}
            </span>
            <span class="row-liquid">
                <a href="#" class="btn btn--sm btn--secondary" v-on:click="claimRewards">
                    <span class="btn__text color-secondary font-weight-bold">{{ lang.BUTTON.CLAIM_REWARDS }}</span>
                </a>
            </span>
        </div>
    </div>
</div>

<div class="w-100">
    <div class="boxed boxed--border no-padding">
        <div class="tabs-container tabs--folder tabs-container-primary">
            <ul class="tabs-content tabs tabs-primary ul-submenu-wallet">
                <li class="col-4 col-sm-2" v-bind:class="{ active: walletTab === 'balances' }" v-on:click="walletTab = 'balances'">
                    <div class="tab__title">
                        <span class="h5">{{ lang.WALLET.BALANCES }}</span>
                    </div>

                </li>
                <li  class="col-4 col-sm-2" v-if="session && isUserProfile()" v-bind:class="{ active: walletTab === 'permissions' }" v-on:click="walletTab = 'permissions'">
                    <div class="tab__title">
                        <span class="h5">{{ lang.WALLET.PERMISSIONS }}</span>
                    </div>
                </li>
                <li  class="col-4 col-sm-2" v-if="session && isUserProfile()" v-bind:class="{ active: walletTab === 'passwords' }" v-on:click="walletTab = 'passwords'">
                    <div class="tab__title">
                        <span class="h5">{{ lang.WALLET.PASSWORDS }}</span>
                    </div>
                </li>
            </ul>
            <ul style="display: contents">
                <li class="text-right li-buy-crea d-sm-none d-none col-sm-3">
                    <a href="https://creaproject.io/buy/" target="_blank" class="btn btn--sm btn--primary">
                        <span class="btn__text font-weight-bold">{{ lang.BUTTON.BUY_CREA }}</span>
                    </a>
                </li>

                <!-- responsive laptop -->
                <li class="text-right li-buy-crea d-none d-sm-none d-md-block">
                    <a href="https://creaproject.io/buy/" target="_blank" class="btn btn--sm btn--primary">
                        <span class="btn__text font-weight-bold">{{ lang.BUTTON.BUY_CREA }}</span>
                    </a>
                </li>
            </ul>

            <!-- responsive mobile -->
            <div class="d-block d-sm-block d-md-none mobile-button-buy-crea">
                <a href="https://creaproject.io/buy/" target="_blank" class="btn btn--sm btn--primary">
                    <span class="btn__text font-weight-bold">{{ lang.BUTTON.BUY_CREA }}</span>
                </a>
            </div>




            <ul id="wallet-tabs" class="tabs-content no-padding">
                <li v-bind:class="{ active: walletTab === 'balances' }" class="wallet-balances-tab">
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
                                <td class="td-right-balance">
                                    <div class="dropdown">
                                        <span id="wallet-balance-crea" class="dropdown__trigger active">{{ state.user.balance }}</span>
                                        <div v-if="canWithdraw()" class="dropdown__container">
                                            <div class="container">
                                                <div class="row">
                                                    <div class="col-12 col-sm-3 col-md-3 col-lg-2 dropdown__content">
                                                        <ul class="menu-vertical">
                                                            <li>
                                                                <div class="modal-instance block">
                                                                    <a class="modal-trigger" href="#wallet-send">
                                                                        <span class="btn__text" v-on:click="prepareModal('transfer_crea')">
                                                                            {{ lang.WALLET.DROPDOWN_MENU_TRANSFER }}
                                                                        </span>
                                                                    </a>
                                                                    <div v-pre>
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
                                                                                                                        <input disabled type="text" v-model="from" v-bind:placeholder="lang.MODAL.WALLET_INPUT_SEND_PLACEHOLDER" />
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
                                                                                                                        <input v-bind:disabled="config.confirmed || config.disabledTo" v-on:input="validateDestiny" v-bind:class="{ 'field-error': toError }" v-model="config.to" type="text" name="input" v-bind:placeholder="lang.MODAL.WALLET_INPUT_SEND_PLACEHOLDER" />
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                            <div class="row">
                                                                                                                <div class="col-md-2">
                                                                                                                    <p class="text-p-form">{{ lang.MODAL.WALLET_AMOUNT }}</p>
                                                                                                                </div>
                                                                                                                <div class="col-md-10">
                                                                                                                    <div class="input-icon input-icon--right">
                                                                                                                        <i class="">{{ config.nai }}</i>
                                                                                                                        <input v-bind:disabled="config.confirmed" v-model="amount" type="number" step="0.001" name="input" v-bind:placeholder="lang.MODAL.WALLET_INPUT_AMOUNT" />
                                                                                                                        <p class="amount-save" >{{ lang.WALLET.BALANCE }}: {{ config.total_amount.toFriendlyString(null, false) }}</p>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                            <div v-if="shouldShowMemo()" class="row">
                                                                                                                <div class="col-md-2"></div>
                                                                                                                <div class="col-md-10">
                                                                                                                    <p>{{ lang.MODAL.WALLET_MEMO_TEXT }}</p>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                            <div v-if="shouldShowMemo()" class="row">
                                                                                                                <div class="col-2">
                                                                                                                    <p class="text-p-form">{{ lang.MODAL.WALLET_MEMO }}</p>
                                                                                                                </div>
                                                                                                                <div class="col-md-10">
                                                                                                                    <div class="input-icon input-icon--right">
                                                                                                                        <input v-bind:disabled="config.confirmed" v-model="memo" type="text" placeholder="Enter your memo" />
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                            <div class="row mt-3">
                                                                                                                <div class="col text-right">
                                                                                                                    <div v-if="config.confirmed" class="btn btn--sm"
                                                                                                                         v-on:click="cancelSend">
                                                                                                                        <span class="btn__text text__dark">{{ lang.BUTTON.CANCEL}}</span>
                                                                                                                    </div>
                                                                                                                    <div class="btn btn--sm btn--primary" v-on:click="sendCrea">
                                                                                                                        <span class="btn__text">{{ config.confirmed ? config.button : lang.BUTTON.CONFIRM }}</span>
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
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div class="modal-instance block">
                                                                    <a class="modal-trigger" href="#wallet-send" data-modal-id="wallet-send">
                                                                        <span class="btn__text" v-on:click="prepareModal('transfer_to_savings_crea')">
                                                                            {{ lang.WALLET.DROPDOWN_MENU_TRANS_SAVINGS }}
                                                                        </span>
                                                                    </a>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div class="modal-instance block">
                                                                    <a class="modal-trigger" href="#wallet-send" data-modal-id="wallet-send">
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
                                <td class="td-right-balance">
                                    <div class="dropdown">
                                        <span class="dropdown__trigger">{{ getCGYBalance().toFriendlyString(null, false) }}</span>
                                        <div v-if="canWithdraw()" class="dropdown__container">
                                            <div class="container">
                                                <div class="row">
                                                    <div class="col-md-3 col-lg-2 dropdown__content">
                                                        <ul class="menu-vertical">
                                                            <li>
                                                                <div class="modal-instance block">
                                                                    <a class="modal-trigger" href="#wallet-de-energize">
                                                                        <span class="btn__text">
                                                                            {{ lang.WALLET.DROPDOWN_MENU_DE_ENERGIZE }}
                                                                        </span>
                                                                    </a>
                                                                    <div v-pre class="modal-container" data-modal-id="wallet-de-energize">
                                                                        <div id="wallet-de-energize" class="modal-content section-modal">
                                                                            <section class="unpad ">
                                                                                <div class="container">
                                                                                    <div class="row justify-content-center">
                                                                                        <div class="col-lg-6 col-md-8 col-sm-12">
                                                                                            <div class="feature">
                                                                                                <div class="feature__body boxed boxed--lg boxed--border">
                                                                                                    <div class="modal-close modal-close-cross"></div>
                                                                                                    <div class="text-block">
                                                                                                        <h3>De-Energize</h3>
                                                                                                        <div class="slide-energize">
                                                                                                            <slider :initvalue="sliderValue" v-bind:max="maxPowerDown" v-on:change="onAmount"></slider>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <form>
                                                                                                        <div class="row">
                                                                                                            <div class="col-md-2">
                                                                                                                <p class="text-p-form">{{ lang.MODAL.WALLET_AMOUNT }}</p>
                                                                                                            </div>
                                                                                                            <div class="col-md-10">
                                                                                                                <div class="input-icon input-icon--right">
                                                                                                                    <i class="">CREA</i>
                                                                                                                    <input v-model="finalAmount" step="0.001" v-on:input="onManualChange" type="number" name="input" />
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                        <div class="row">
                                                                                                            <div class="col-md-12">
                                                                                                                <p class="mt--1">{{ amountByWeek }}</p>
                                                                                                                <p >{{ withdrawNote }}</p>
                                                                                                                <p v-if="(maxPowerDown - finalAmount) < 5" class="error-color-form">{{ lang.WALLET.DE_ENERGIZE_UNUSABLE_ACCOUNT }}</p>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                        <div class="row mt-1">
                                                                                                            <div class="col text-right">
                                                                                                                <a href="#0" v-on:click="makePowerDown" class="btn btn--sm btn--primary">
                                                                                                                    <span class="btn__text">{{ lang.BUTTON.DE_ENERGIZE }}</span>
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

                                                            <li>
                                                                <div class="cursor" v-on:click="cancelPowerDown">
                                                                    <span class="btn__text">{{ lang.WALLET.DROPDOWN_MENU_CANCEL_DE_ENERGIZE }}</span>
                                                                </div>
                                                            </li>
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
                                <td class="td-right-balance">
                                    <div class="dropdown">
                                        <span class="dropdown__trigger">{{ state.user.cbd_balance }}</span>
                                        <div v-if="canWithdraw()" class="dropdown__container">
                                            <div class="container">
                                                <div class="row">
                                                    <div class="col-md-3 col-lg-2 dropdown__content">
                                                        <ul class="menu-vertical">
                                                            <li>
                                                                <a class="modal-trigger" href="#wallet-send" data-modal-id="wallet-send">
                                                                    <span class="btn__text" v-on:click="prepareModal('transfer_cbd')">
                                                                        {{ lang.WALLET.DROPDOWN_MENU_TRANSFER }}
                                                                    </span>
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <a class="modal-trigger" href="#wallet-send" data-modal-id="wallet-send">
                                                                    <span class="btn__text" v-on:click="prepareModal('transfer_to_savings_cbd')">
                                                                        {{ lang.WALLET.DROPDOWN_MENU_TRANS_SAVINGS }}
                                                                    </span>
                                                                </a>
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
                                    <p>{{ lang.WALLET.BALANCES_SAVING_TITLE }}</p>
                                    <p>{{ lang.WALLET.BALANCES_SAVING_TEXT }}</p>
                                </td>
                                <td class="td-right-balance">
                                    <div class="dropdown">
                                        <span class="dropdown__trigger">{{ state.user.savings_balance }}</span>
                                        <div v-if="canWithdraw()" class="dropdown__container">
                                            <div class="container">
                                                <div class="row">
                                                    <div class="col-md-3 col-lg-2 dropdown__content">
                                                        <ul class="menu-vertical">
                                                            <li>
                                                                <a class="modal-trigger" href="#wallet-send" data-modal-id="wallet-send">
                                                                    <span class="btn__text" v-on:click="prepareModal('transfer_from_savings_crea')">
                                                                        {{ lang.WALLET.DROPDOWN_MENU_WITHDRAW_CREA }}
                                                                    </span>
                                                                </a>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div><!--end row-->
                                            </div><!--end container-->
                                        </div><!--end dropdown container-->
                                    </div>
                                    <div class="dropdown">
                                        <span class="dropdown__trigger">{{ state.user.savings_cbd_balance }}</span>
                                        <div v-if="canWithdraw()" class="dropdown__container">
                                            <div class="container">
                                                <div class="row">
                                                    <div class="col-md-3 col-lg-2 dropdown__content">
                                                        <ul class="menu-vertical">
                                                            <li>
                                                                <a class="modal-trigger" href="#wallet-send" data-modal-id="wallet-send">
                                                                    <span class="btn__text" v-on:click="prepareModal('transfer_from_savings_cbd')">
                                                                        {{ lang.WALLET.DROPDOWN_MENU_WITHDRAW_CBD }}
                                                                    </span>
                                                                </a>
                                                            </li>
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
                                <td class="td-right-balance">
                                    <p class="total-active">{{ state.user.estimate_account_value }}$</p>
                                </td>
                            </tr>
                            <tr v-if="nextDeEnergize">
                                <td class="colo-primary">
                                    {{ nextDeEnergize }}
                                </td>
                                <td><!--NO DELETE--></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </li>
                <li v-if="session" v-bind:class="{ active: walletTab === 'permissions' }" class="wallet-permissions-tab">
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
                                    <p>{{ getKey('posting') }}</p>
                                    <p>{{ lang.WALLET.PERMISSIONS_TEXT_POSTING }}</p>
                                </td>
                                <td style="text-align: right">
                                    <div v-if="session && !showPriv.posting" class="btn btn--sm" v-on:click="getPrivKey('posting')">
                                        <span class="btn__text text__dark font-weight-bold">{{ lang.BUTTON.SHOW_PRIV_KEY }}</span>
                                    </div>
                                    <div v-else-if="session" class="btn btn--sm" v-on:click="hidePrivKey('posting')">
                                        <span class="btn__text text__dark font-weight-bold">{{ lang.BUTTON.HIDE_PRIV_KEY }}</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <p>{{ lang.WALLET.PERMISSIONS_TITLE_ACTIVE }}</p>
                                    <p>{{ getKey('active') }}</p>
                                    <p>{{ lang.WALLET.PERMISSIONS_TEXT_POSTING }}</p>
                                </td>
                                <td style="text-align: right">
                                    <div v-if="session && !showPriv.active" class="btn btn--sm" v-on:click="getPrivKey('active')">
                                        <span class="btn__text text__dark font-weight-bold">{{ lang.BUTTON.SHOW_PRIV_KEY }}</span>
                                    </div>
                                    <div v-else-if="session" class="btn btn--sm" v-on:click="hidePrivKey('active')">
                                        <span class="btn__text text__dark font-weight-bold">{{ lang.BUTTON.HIDE_PRIV_KEY }}</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <p>{{ lang.WALLET.PERMISSIONS_TITLE_OWNER }}</p>
                                    <p>{{ getKey('owner') }}</p>
                                    <p>{{ lang.WALLET.PERMISSIONS_TEXT_OWNER }}</p>
                                </td>
                                <td style="text-align: right">

                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <p>{{ lang.WALLET.PERMISSIONS_TITLE_MEMO }}</p>
                                    <p>{{ getKey('memo') }}</p>
                                    <p>{{ lang.WALLET.PERMISSIONS_TEXT_MEMO }}</p>
                                </td>
                                <td style="text-align: right">
                                    <div v-if="session && !showPriv.memo" class="btn btn--sm" v-on:click="getPrivKey('memo')">
                                        <span class="btn__text text__dark font-weight-bold">{{ lang.BUTTON.SHOW_PRIV_KEY }}</span>
                                    </div>
                                    <div v-else-if="session" class="btn btn--sm" v-on:click="hidePrivKey('memo')">
                                        <span class="btn__text text__dark font-weight-bold">{{ lang.BUTTON.HIDE_PRIV_KEY }}</span>
                                    </div>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </li>
                <li v-if="session" v-bind:class="{ active: walletTab === 'passwords' }" class="wallet-password-tab">
                    <div v-bind:class="{ tab__content: true, hidden: walletTab !== 'passwords' }">
                        <div class="content-tab-password">
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
                                <input class="validate-required" disabled type="text" v-model="changePass.username"/>
                            </div>
                            <div class="col-md-12 mt-3">
                                <label>{{ lang.CHANGE_PASSWORD.CURRENT_PASSWORD }}</label>
                                <label class="float-right"><a href="" class="color--primary button-recover-account">{{ lang.CHANGE_PASSWORD.ACCOUNT_RECOVERY }}</a></label>
                                <input v-model="changePass.oldPass" class="validate-required" type="password" v-bind:placeholder="lang.CHANGE_PASSWORD.PASSWORD"/>
                            </div>
                            <div class="col-md-12 mt-3">
                                <label>{{ lang.CHANGE_PASSWORD.PASSWORD_CREATED }}</label>
                                <input v-if="changePass.newPass" v-model="changePass.newPass" class="validate-required" type="text" v-bind:placeholder="lang.CHANGE_PASSWORD.PASSWORD" readonly/>

                                <div v-else class="">
                                    <div class="">
                                        <div v-on:click="suggestPassword" class="btn btn--sm btn--black mt-3 cursor">
                                            <span class="btn__text  font-weight-bold">{{ lang.CHANGE_PASSWORD.CONFIRM_PASSWORD }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-12 mt-3">
                                <label>{{ lang.CHANGE_PASSWORD.INSERT_PASSWORD_CREATED }}</label>
                                <input v-model="changePass.matchedPass" class="validate-required" type="password" v-bind:placeholder="lang.CHANGE_PASSWORD.PASSWORD"/>
                            </div>
                            <div class="col-md-12 mt-3">
                                <div class="input-checkbox">
                                    <input id="change-pass-understand" v-model="changePass.checkedLostPass" type="checkbox" />
                                    <label for="change-pass-understand"></label>
                                </div>
                                <span>{{ lang.CHANGE_PASSWORD.RADIO_INPUT_UNDERSTAND }}</span>
                            </div>
                            <div class="col-md-12">
                                <div class="input-checkbox">
                                    <input id="change-pass-safely" v-model="changePass.checkedStoredPass" type="checkbox" />
                                    <label for="change-pass-safely"></label>
                                </div>
                                <span>{{ lang.CHANGE_PASSWORD.RADIO_INPUT_SAFELY }}</span>
                            </div>
                            <div v-if="changePass.error" class="col-md-4 mt-3 error-color-form">
                                {{ changePass.error }}
                            </div>
                            <div class="col-md-4 mt-3">
                                <div class="btn btn--sm btn--primary cursor" v-on:click="changePassword">
                                    <span class="btn__text  font-weight-bold">{{ lang.CHANGE_PASSWORD.UPDATE_PASSWORD }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</div>

<div class="w-100">
    <?php include ('list-historial.php') ?>
</div>