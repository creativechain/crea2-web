<div class="col-sm-6 col-md-6 col-lg-3 masonry__item">
    <div class="card card-2 card-home">
        <div class="card__top">
            <div class="img-post-list" v-on:click="openPost(data.content[p])"
                 v-bind:style="{ 'background-image': 'url(' + (data.content[p].metadata.featuredImage || 'https://ipfs.io/ipfs/QmbV3jBeZ2irQgWSBp4SC7H1L4KN3rLruMrA4ZYwiTMSeA') + ')' }">

            </div>
        </div>
        <div class="card__body">
            <h4>{{ data.content[p].title }}</h4>
            <p class="description-post-box">{{ data.content[p].metadata.description || "--" }}</p>
            <ul class="list-inline list-unstyled w-100">
                <li class="li-like">
                    <a href="#/" v-on:click="makeVote(data.content[p])">
                        <img v-if="userHasVote(data.content[p])" src="img/crea-web/like/like_ACT_RED.svg" alt="">
                        <img v-else src="img/crea-web/like/like.svg" alt="">
                        <span>{{ data.content[p].active_votes.length }}</span>
                    </a>
                </li>
                <li>
                    <div class="dropdown dropdown-price">
                        <span class="dropdown__trigger"> {{ data.content[p].pending_payout_value }}
                            <i class="stack-down-open"></i>
                        </span>
                        <div class="dropdown__container">
                            <div class="container">
                                <div class="row">
                                    <div class="col-md-3 col-lg-3 dropdown__content">
                                        <p class="title">{{ lang.HOME.DROPDOWN_PENDING_PAYOUT }} {{ data.content[p].pending_payout_value }} </p>
                                        <p>{{ data.content[p].total_pending_payout_value }}</p>
                                        <p>{{ getFutureDate(data.content[p].cashout_time) }}</p>
                                    </div>
                                </div><!--end row-->
                            </div><!--end container-->
                        </div><!--end dropdown container-->
                    </div>
                </li>
                <li class="float-right li-comment">
                    <a href="">
                        <img src="img/crea-web/comments.svg" alt="">
                        <span>{{ data.content[p].children }}</span>
                    </a>
                </li>
            </ul>
        </div>


        <div class="card__bottom card-show">
            <ul class="list-inline list-unstyled w-100">
                <li>
                    <div class="dropdown dropdown-autor">
                        <div class="row-flex">
                            <div class="user-avatar">

                                <div class="img-user-avatar" v-bind:style="{ 'background-image': 'url(' + (data.accounts[data.content[p].author].metadata.avatar.url || getDefaultAvatar(data.content[p].author)) + ')'}"></div>
                            </div>
                            <span class="dropdown-autor-span-name">{{ data.accounts[data.content[p].author].metadata.publicName || data.content[p].author }}</span>
                        </div>
                        <div class="dropdown__container dropdown-info-user">
                            <div class="container">
                                <div class="row">
                                    <div class="col-md-4 col-lg-4 dropdown__content">
                                        <div v-if="session && data.content[p].author !== session.account.username" class="row">
                                            <div class="col text-right">
                                                <a class="btn btn--primary" href="#/" v-on:click="followUser(data.content[p].author)">
                                                    <span class="btn__text">{{ lang.BUTTON.FOLLOW }}</span>
                                                </a>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col text-center">
                                                <div class="user-avatar">
                                                    <div class="img-user-avatar" v-bind:style="{ 'background-image': 'url(' + (data.accounts[data.content[p].author].metadata.avatar.url || getDefaultAvatar(data.content[p].author)) + ')'}"></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col text-center">
                                                <p class="name">{{ data.accounts[data.content[p].author].metadata.publicName || data.content[p].author }}</p>
                                                <p class="user">@{{ data.content[p].author }}</p>
                                                <p class="description-user">{{ data.accounts[data.content[p].author].metadata.description || '-' }}</p>
                                                <p class="email-user">{{ data.accounts[data.content[p].author].metadata.email || '-' }}</p>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col">
                                                <p class="title-stats">{{ lang.HOME.DROPDOWN_USER_PROFILE_LIKES }}</p>
                                                <span>{{ data.accounts[data.content[p].author].reputation }}</span>
                                            </div>
                                            <div class="col">
                                                <p class="title-stats">{{ lang.HOME.DROPDOWN_USER_PROFILE_FOLLOWERS }}</p>
                                                <span>0</span>
                                            </div>
                                            <div class="col">
                                                <p class="title-stats">{{ lang.HOME.DROPDOWN_USER_PROFILE_FOLLOWING }}</p>
                                                <span>0</span>
                                            </div>
                                        </div>
                                    </div>
                                </div><!--end row-->
                            </div><!--end container-->
                        </div><!--end dropdown container-->
                    </div>
                </li>
                <li class="float-right li-certificate">
                    <template v-for="i in getLicense(data.content[p].metadata.license).getIcons()">
                        <img v-bind:src="i" alt="">
                    </template>
                </li>
            </ul>
        </div>
    </div>
</div>