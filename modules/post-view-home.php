<div class="col-sm-6 col-md-6 col-lg-3 masonry__item">
    <div class="card card-2 card-home">
        <div class="card__top">
            <a href="#">
                <img alt="Image" src="https://ipfs.io/ipfs/QmbV3jBeZ2irQgWSBp4SC7H1L4KN3rLruMrA4ZYwiTMSeA">
            </a>
        </div>
        <div class="card__body">
            <h4>{{ data.content[p].title }}</h4>
            <p>{{ JSON.parse(data.content[p].json_metadata).description || "--" }}</p>
            <ul class="list-inline list-unstyled w-100">
                <li class="li-like">
                    <a href="#" v-on:click="makeVote(data.content[p])">
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
                        <span><img src="img/crea-web/ficha/avatare-ficha-demo.png" alt="">{{ JSON.parse(data.content[p].json_metadata).author || data.content[p].author }}</span>
                        <div class="dropdown__container dropdown-info-user">
                            <div class="container">
                                <div class="row">
                                    <div class="col-md-4 col-lg-4 dropdown__content">
                                        <div v-if="session" class="row">
                                            <div class="col text-right">
                                                <a class="btn btn--primary" href="#">
                                                    <span class="btn__text">{{ lang.BUTTON.FOLLOW }}</span>
                                                </a>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col text-center">
                                                <img src="img/crea-web/like/like.svg" alt="" class="avatare-info">
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col text-center">
                                                <p class="name">{{ JSON.parse(data.content[p].json_metadata).author || data.content[p].author }}</p>
                                                <p class="user">@{{ data.content[p].author }}</p>
                                                <p class="description-user">{{ parseJSON(data.accounts[data.content[p].author].json_metadata).description || '-' }}</p>
                                                <p class="email-user">{{ parseJSON(data.accounts[data.content[p].author].json_metadata).email || '-' }}</p>
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
                    <img src="img/crea-web/certificate/attribution.svg" alt="">
                </li>
            </ul>
        </div>
    </div>
</div>