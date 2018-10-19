<div id="wallet-profile" class="boxed boxed--sm boxed--border menu-profile-user">
    <div class="text-block text-center">
        <img alt="avatar" src="img/profile/avatar-round-3.png" class="image--sm" />
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
        <div class="col">
            <a v-if="account.name != session.account.username" class="btn btn--sm btn--primary" href="#">
                <span class="btn__text">{{ lang.BUTTON.FOLLOW }}</span>
            </a>


            <a v-else class="btn btn--sm btn--transparent" href="#/" v-on:click="navfilter = 'edit'">
                <span class="btn__text text__dark">{{ lang.BUTTON.EDIT_PROFILE }}</span>
            </a>
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
    <div class="row">
        <div class="col">

        </div>
    </div>


</div>