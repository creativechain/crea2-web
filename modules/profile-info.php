<div id="wallet-profile" class="boxed boxed--sm boxed--border">
    <div class="text-block text-center">
        <img alt="avatar" src="img/profile/avatar-round-3.png" class="image--sm" />
        <span class="h5">{{ session.account.username }} </span>
        <p>casmiclab.com</p>
        <p>Casmic Lab is a Valencia based design studio founded in 2006 by Amadeo Castroviejo and Roser Miquel. We love old science fiction movies and books.</p>
    </div>
    <div class="row">
        <div class="col">
            <a href="">casmic@lab.com</a>
        </div>
        <div id="wallet-profile-join-date" class="col">{{ getJoinDate() }}</div>
    </div>
    <hr>
    <div class="row">
        <div class="col">
            <table>
                <thead class="hidden">
                <tr>
                    <th>Value 1</th>
                    <th>Value 2</th>
                    <th>Value 3</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>
                        <p>
                            <img src="img/icons/trainer.svg" alt="">
                            <span>Traineer</span>
                        </p>
                    </td>
                    <td>
                        <p>
                            <img src="img/icons/buzz.svg" alt="">
                            <span>385 Buzz</span>
                        </p>
                    </td>
                    <td>
                        <a class="btn btn--sm" href="#">
                            <span class="btn__text">{{ lang.BUTTON.FOLLOW }}</span>
                        </a>
                    </td>
                </tr>
                </tbody>
            </table>
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
                        <p>974</p>
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
                        <p>16</p>
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
                        <p>753</p>
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
                        <p>594</p>
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
                        <p>74</p>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
    <hr>


</div>