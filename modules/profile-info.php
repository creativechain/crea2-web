<div id="wallet-profile" class="boxed boxed--sm boxed--border menu-profile-user">
    <div class="text-block text-center">
        <div class="user-avatar">
            <avatar v-bind:account="state.user"></avatar>
        </div>
        <span class="h5">{{ profile.publicName || ''}}</span>
        <p class="mb-2 nameUser">{{ '@' + state.user.name }}</p>
        <p class="mb-0">{{ profile.web || '-' }}</p>
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

                <!--<a  class="btn btn--sm btn--primary" href="#0"
                   v-on:click="makeFollow(state.user.name)">
                    <span class="btn__text">{{ lang.BUTTON.FOLLOW }}</span>
                </a>-->

                <a v-else class="btn btn--sm" v-bind:href="'/@' + session.account.username + '/settings'" v-on:click="navigateTo($event, 'settings')">
                    <span class="btn__text text__dark">{{ lang.BUTTON.EDIT_PROFILE }}</span>
                </a>
            </div>

        </div>
    </div>

    <hr />
    <div class="row profile-summary">
        <div class="col-md-7">
            <p>
                <img src="/img/icons/followers.svg" alt="" />
                <span>{{ lang.PROFILE.FOLLOWERS }}</span>
            </p>
        </div>
        <div class="col-md-5 text-right">
            <p>{{ state.user.follower_count }}</p>
        </div>

        <div class="col-md-7">
            <ul class="list-inline">
                <li class="list-inline-item" class="list-inline-item">
                    <a class="text-uppercase a-following" v-bind:href="'/@' + state.user.name + '/following'" v-on:click="navigateTo($event, 'following')" v-bind:class="{ active: navbar.section == 'following' }">
                        {{ lang.PROFILE.SECONDARY_MENU_FOLLOWING }}
                    </a>
                </li>
            </ul>
        </div>
        <div class="col-md-5 text-right">
            <p>{{ state.user.following_count }}</p>
        </div>

        <div class="col-md-7">
            <p>
                <img src="/img/icons/projects.svg" alt="" />
                <span>{{ lang.PROFILE.POSTS }}</span>
            </p>
        </div>
        <div class="col-md-5 text-right">
            <p>{{ state.user.post_count }}</p>
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
                <li><p><img src="/img/icons/NO_see.svg" alt="" />(0) Block all posts by this user</p></li>
            </ul>
        </div>
    </div>
</div>