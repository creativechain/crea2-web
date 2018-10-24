<div class="col-md-11 text-center menu-secondary-profile">
    <ul class="list-inline list-unstyled">
        <li><a href="#/" v-on:click="navfilter = 'projects'" class="active">{{ lang.PROFILE.SECONDARY_MENU_PROJECTS }}</a></li>
        <li><a href="/notifications.php" v-on:click="navfilter = 'wallet'">{{ lang.PROFILE.SECONDARY_MENU_NOTIFICATIONS }}</a></li>

        <li class="dropdown">
            <span class="dropdown__trigger">{{ lang.PROFILE.SECONDARY_MENU_REWARDS }}</span>
            <div class="dropdown__container">
                <div class="container">
                    <div class="row">
                        <div class="dropdown__content col-lg-2 col-md-4">
                            <ul class="menu-vertical">
                                <li class="">
                                    <a href="shop-cart.html">
                                        Autor
                                    </a>
                                </li>
                                <li class="">
                                    <a href="shop-checkout.html">
                                        Curación
                                    </a>
                                </li>
                                <li class="">
                                    <a href="shop-terms.html">
                                        Terms
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <!--end dropdown content-->
                    </div>
                    <!--end row-->
                </div>
            </div>
            <!--end dropdown container-->
        </li>

        <li><a href="#/">{{ lang.PROFILE.SECONDARY_MENU_BLOCKED }}</a></li>
        <li><a href="/wallet.php" v-on:click="navfilter = 'wallet'">{{ lang.PROFILE.SECONDARY_MENU_WALLET }}</a></li>
    </ul>
</div>
<div class="col-md-1 text-right">
    <a href="simple-view-home.php">
        <img src="../img/crea-web/icon-view-mode-all.png" alt="">
    </a>
</div>