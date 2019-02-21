<div id="wallet-profile" class="boxed boxed--sm boxed--border menu-profile-user">
    <div class="text-block text-center">
        <div class="user-avatar">
            <avatar v-bind:account="state.user"></avatar>
        </div>
        <span class="h5">{{ profile.publicName || ''}}</span>
        <p class="mb-2 nameUser">{{ '@' + state.user.name }}</p>
        <p class="mb-0"><a v-bind:href="toUrl(profile.web) || '#'">{{ profile.web || '-' }}</a></p>
        <p>{{ profile.about || '-' }}</p>
    </div>
    <div class="row">
        <div class="col text-center">
            <a href="#">{{ profile.contact || '-' }}</a>
        </div>
    </div>
    <div class="row">
        <div class="col text-center">
            <p id="wallet-profile-join-date">{{ getJoinDate() }}</p>
        </div>
    </div>
    <div class="row mt-3">
        <div class="col text-center">
            <div v-if="session">
                <btn-follow v-if="state.user.name != account.user.name"
                            v-on:follow="onFollow" v-bind:session="session"
                            v-bind:account="account.user" v-bind:user="state.user.name" >
                </btn-follow>

                <a v-else class="btn btn--sm" v-bind:href="'/@' + session.account.username + '/settings'" v-on:click="navigateTo($event, 'settings')">
                    <span class="btn__text text__dark font-weight-bold">{{ lang.BUTTON.EDIT_PROFILE }}</span>
                </a>
            </div>

        </div>
    </div>

    <hr />
    <div class="row profile-summary">
        <div class="col-7 col-md-7">
            <ul class="list-inline">
                <li class="list-inline-item">
                    <a class="text-uppercase a-follower" v-bind:href="'/@' + state.user.name + '/followers'" v-on:click="navigateTo($event, 'followers')" v-bind:class="{ active: navbar.section == 'followers' }">
                        {{ lang.PROFILE.FOLLOWERS }}
                    </a>
                </li>
            </ul>
        </div>
        <div class="col-5 col-md-5 text-right">
            <a class="text-uppercase" v-bind:href="'/@' + state.user.name + '/followers'" v-on:click="navigateTo($event, 'followers')" v-bind:class="{ active: navbar.section == 'followers' }">
                {{ state.user.follower_count }}
            </a>
        </div>

        <div class="col-7 col-md-7">
            <ul class="list-inline">
                <li class="list-inline-item">
                    <a class="text-uppercase a-following" v-bind:href="'/@' + state.user.name + '/following'" v-on:click="navigateTo($event, 'following')" v-bind:class="{ active: navbar.section == 'following' }">
                        {{ lang.PROFILE.FOLLOWING }}
                    </a>
                </li>
            </ul>
        </div>
        <div class="col-5 col-md-5 text-right">
            <a class="text-uppercase" v-bind:href="'/@' + state.user.name + '/following'" v-on:click="navigateTo($event, 'following')" v-bind:class="{ active: navbar.section == 'following' }">
                {{ state.user.following_count }}
            </a>
        </div>

        <div class="col-7 col-md-7">
            <ul class="list-inline">
                <li class="list-inline-item">
                    <a class="text-uppercase a-projects" v-bind:href="'/@' + state.user.name + '/projects'" v-on:click="navigateTo($event, 'projects')" v-bind:class="{ active: navbar.section == 'projects' }">
                        {{ lang.PROFILE.SECONDARY_MENU_PROJECTS }}
                    </a>
                </li>
            </ul>
        </div>
        <div class="col-5 col-md-5 text-right">
            <a class="text-uppercase" v-bind:href="'/@' + state.user.name + '/projects'" v-on:click="navigateTo($event, 'projects')" v-bind:class="{ active: navbar.section == 'projects' }">
                {{ state.user.post_count }}
            </a>
        </div>

    </div>
    <hr />
    <div class="row profile-tags">
        <div class="col">
            <p class="title-tags">Tags</p>
            <span v-html="getLinkedTags(profile.tags, true)"></span>
        </div>
    </div>
    <hr v-if="!isUserProfile()">
    <div v-if="!isUserProfile()" class="row block-all">
        <div class="col-md-12">
            <ul class="list-inline list-unstyled">
                <li class="cursor" v-on:click="ignoreUser"><p><img src="/img/icons/NO_see.svg" alt="" />{{ lang.PUBLICATION.BLOCK_USER }}</p></li>
            </ul>
        </div>
    </div>
</div>