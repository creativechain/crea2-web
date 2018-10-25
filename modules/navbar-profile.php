<div class="col-md-11 text-center menu-secondary-profile">
    <ul class="list-inline list-unstyled">
        <li><a href="#0" v-on:click="navfilter = 'projects'" v-bind:class="{ active: navfilter == 'projects' }">{{ lang.PROFILE.SECONDARY_MENU_PROJECTS }}</a></li>
        <li v-if="session && account.user.name === state.user.name"><a href="#0" v-on:click="navfilter = 'notifications'" v-bind:class="{ active: navfilter == 'notifications' }">{{ lang.PROFILE.SECONDARY_MENU_NOTIFICATIONS }}</a></li>

        <li class="dropdown">
            <span class="dropdown__trigger">{{ lang.PROFILE.SECONDARY_MENU_REWARDS }}</span>
            <div class="dropdown__container">
                <div class="container">
                    <div class="row">
                        <div class="dropdown__content col-lg-2 col-md-4">
                            <ul class="menu-vertical">
                                <li class="">
                                    <a href="#0" v-on:click="navfilter = 'author-rewards'">
                                        {{ lang.REWARDS.SECONDARY_MENU_AUTHOR }}
                                    </a>
                                </li>
                                <li class="">
                                    <a href="#0" v-on:click="navfilter = 'curation-rewards'">
                                        {{ lang.REWARDS.SECONDARY_MENU_CURATION }}
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </li>

        <li><a href="#0" v-on:click="navfilter = 'blocked'" v-bind:class="{ active: navfilter == 'blocked' }">{{ lang.PROFILE.SECONDARY_MENU_BLOCKED }}</a></li>
        <li><a href="#0" v-on:click="navfilter = 'wallet'" v-bind:class="{ active: navfilter == 'wallet' }">{{ lang.PROFILE.SECONDARY_MENU_WALLET }}</a></li>
    </ul>
</div>
<div class="col-md-1 text-right">
    <a href="simple-view-home.php">
        <img src="../img/crea-web/icon-view-mode-all.png" alt="">
    </a>
</div>