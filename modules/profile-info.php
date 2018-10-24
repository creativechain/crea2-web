<div id="wallet-profile" class="boxed boxed--sm boxed--border menu-profile-user">
    <div class="text-block text-center">
        <div class="user-avatar">
            <div class="img-user-avatar" v-bind:style="{ 'background-image': 'url(' + (profile.avatar.url || getDefaultAvatar(session.account.username)) + ')' }"></div>
        </div>

        <span class="h5">{{ profile.publicName || '@' + session.account.username }} </span>
        <p>{{ profile.web || '-' }}</p>
        <p>{{ profile.about || '-' }}</p>
    </div>
    <div class="row">
        <div class="col text-center">
            <a href="#">{{ profile.contact || '-' }}</a>
        </div>
        <div class="col text-center">
            <p id="wallet-profile-join-date">{{ getJoinDate() }}</p>
        </div>
    </div>
    <div class="row">
        <div class="col text-center">
            <a v-if="account.name != session.account.username" class="btn btn--sm btn--primary" href="#">
                <span class="btn__text">{{ lang.BUTTON.FOLLOW }}</span>
            </a>


            <a v-else class="btn btn--sm" href="#/" v-on:click="navfilter = 'edit'">
                <span class="btn__text text__dark">{{ lang.BUTTON.EDIT_PROFILE }}</span>
            </a>
        </div>
    </div>
    <hr>
    <div class="row ranking-user-info">
        <div class="col">
            <img src="img/icons/trainer.svg" alt="">
            <span>Traineer</span>
        </div>
        <div class="col">
            <img src="img/icons/buzz.svg" alt="">
            <span>{{ account.reputation }} Buzz</span>
        </div>

    </div>
    <hr>
    <div class="row">
        <div class="col">
            <table>
                <thead class="hidden">
                <tr>
                    <th>Value 1</th>
                    <th>Value 2</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>
                        <p>
                            <img src="img/icons/like.svg" alt="">
                            <span>{{ lang.PROFILE.LIKES }}</span>
                        </p>
                    </td>
                    <td class="text-right">
                        <p>0</p>
                    </td>
                </tr>
                <tr>
                    <td>
                        <p>
                            <img src="img/icons/comments.svg" alt="">
                            <span>{{ lang.PROFILE.COMMENTS }}</span>
                        </p>
                    </td>
                    <td class="text-right">
                        <p>{{ account.comment_count }}</p>
                    </td>
                </tr>
                <tr>
                    <td>
                        <p>
                            <img src="img/icons/followers.svg" alt="">
                            <span>{{ lang.PROFILE.FOLLOWERS }}</span>
                        </p>
                    </td>
                    <td class="text-right">
                        <p>{{ account.followers_count }}</p>
                    </td>
                </tr>
                <tr>
                    <td>
                        <p>
                            <img src="img/icons/following.svg" alt="">
                            <span>{{ lang.PROFILE.FOLLOWING }}</span>
                        </p>
                    </td>
                    <td class="text-right">
                        <p>{{ account.following_count }}</p>
                    </td>
                </tr>
                <tr>
                    <td>
                        <p>
                            <img src="img/icons/projects.svg" alt="">
                            <span>{{ lang.PROFILE.POSTS }}</span>
                        </p>
                    </td>
                    <td class="text-right">
                        <p>{{ account.post_count }}</p>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
    <hr>
    <div class="row profile-tags">
        <div class="col">
            <p class="title-tags">Tags</p>
            <span>Digital, agency, about, loop, ilustration</span>
        </div>
    </div>
    <hr>
    <div class="row block-all">
        <div class="col-md-12">
            <ul class="list-inline list-unstyled">
                <li><p><img src="/img/icons/NO_see.svg" alt="">(0) Block all posts by this user</p></li>
            </ul>
        </div>
    </div>
</div>