<div id="wallet-profile" class="boxed boxed--sm boxed--border menu-profile-user">
    <div class="text-block text-center">
        <div class="user-avatar">
            <div class="img-user-avatar" v-bind:style="{ 'background-image': 'url(' + (state.user.metadata.avatar.url || getDefaultAvatar(state.user.name)) + ')' }"></div>
        </div>

        <span class="h5">{{ profile.publicName || '@' + state.user.name }} </span>
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
            <span>{{ state.user.reputation }} Buzz</span>
        </div>
        <div class="col">
            <div v-if="session">
                <a v-if="state.user.name != account.user.name" class="btn btn--sm btn--primary" href="#0"
                   v-on:click="makeFollow(state.user.name)">
                    <span class="btn__text">{{ lang.BUTTON.FOLLOW }}</span>
                </a>

                <a v-else class="btn btn--sm" href="#0" v-on:click="navfilter = 'edit'">
                    <span class="btn__text text__dark">{{ lang.BUTTON.EDIT_PROFILE }}</span>
                </a>
            </div>

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
                        <p>{{ state.user.comment_count }}</p>
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
                        <p>{{ state.user.followers_count }}</p>
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
                        <p>{{ state.user.following_count }}</p>
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
                        <p>{{ state.user.post_count }}</p>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
    <hr>
    <div class="row">
        <div class="col">
            <p>
                {{ profile.tags ? profile.tags.join(', ') : '' }}
            </p>
        </div>
    </div>


</div>