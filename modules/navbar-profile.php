<div class="col-md-12 text-center menu-secondary-profile">
    <ul class="list-inline list-unstyled">
        <li>
            <a v-bind:href="'/@' + state.user.name + '/projects'" v-on:click="navigateTo($event, 'projects')" v-bind:class="{ active: navbar.section == 'projects' }">{{ lang.PROFILE.SECONDARY_MENU_PROJECTS }}</a>
        </li>


        <li class="dropdown">
            <span class="dropdown__trigger">{{ lang.PROFILE.SECONDARY_MENU_REWARDS }}</span>
            <div class="dropdown__container">
                <div class="container">
                    <div class="row">
                        <div class="dropdown__content col-lg-2 col-md-4 text-left">
                            <ul class="menu-vertical">
                                <li class="">
                                    <a v-bind:href="'/@' + state.user.name + '/author-rewards'" v-on:click="navigateTo($event, 'author-rewards')">
                                        {{ lang.REWARDS.SECONDARY_MENU_AUTHOR }}
                                    </a>
                                </li>
                                <li class="">
                                    <a v-bind:href="'/@' + state.user.name + '/curation-rewards'" v-on:click="navigateTo($event, 'curation-rewards')">
                                        {{ lang.REWARDS.SECONDARY_MENU_CURATION }}
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </li>

        <li v-if="isUserProfile()"><a v-bind:href="'/@' + state.user.name + '/blocked'" v-on:click="navigateTo($event, 'blocked')" v-bind:class="{ active: navbar.section == 'blocked' }">{{ lang.PROFILE.SECONDARY_MENU_BLOCKED }}</a></li>
        <li><a v-bind:href="'/@' + state.user.name + '/wallet'" v-on:click="navigateTo($event, 'wallet')" v-bind:class="{ active: navbar.section == 'wallet' }">{{ lang.PROFILE.SECONDARY_MENU_WALLET }}</a></li>
    </ul>
</div>
