<div class="col-md-12 text-center">
    <ul class="list-inline list-unstyled">
        <li><a href="#/" v-on:click="navfilter = 'projects'">{{ lang.PROFILE.SECONDARY_MENU_PROJECTS }}</a></li>
        <li><a href="#/">{{ lang.PROFILE.SECONDARY_MENU_NOTIFICATIONS }}</a></li>
        <li><a href="#/">{{ lang.PROFILE.SECONDARY_MENU_REWARDS }}</a></li>
        <li><a href="#/">{{ lang.PROFILE.SECONDARY_MENU_BLOCKED }}</a></li>
        <li><a href="#/" v-on:click="navfilter = 'wallet'">{{ lang.PROFILE.SECONDARY_MENU_WALLET }}</a></li>
        <li>
            <a href="">
                <img src="/img/crea-web/icon-view-mode-all.png" alt="">
            </a>
        </li>
    </ul>
</div>