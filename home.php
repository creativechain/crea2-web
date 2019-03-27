<?php include ('element/navbar.php'); ?>

<div class="main-container">
    <div v-cloak id="home-banner">
        <?php include ('modules/banner.php') ?>
    </div>

    <section class="cta cta-4 space--xxs border--bottom d-none d-md-block navbar-filter">
        <div class="container post-container-home">
            <div class="row align-items-end">
                <?php include ('modules/navbar-filter-home.php') ?>
            </div>
        </div>
    </section>

    <section v-cloak id="navbar-mobile" class="cta cta-4 space--xxs border--bottom d-block d-sm-block d-md-none navbar-filter mobile">
        <div class="container post-container-home">
            <div class="row align-items-end">
                <div class="col-md-12 text-center">
                    <ul class="list-inline navbar-followin-home">
                        <li class="list-inline-item" v-if="session" v-bind:class="{'active': isUserFeed()}">
                            <a v-bind:href="'/@' + session.account.username + '/feed'">{{ lang.HOME.MENU_FOLLOWING }}</a>
                        </li>
                        <li class="list-inline-item" v-bind:class="{'active': nav == 'popular'}">
                            <a href="/popular" v-on:click="retrieveTrendingContent">{{ lang.HOME.MENU_POPULAR }}</a>
                        </li>
                        <li class="list-inline-item" v-bind:class="{'active': nav == 'skyrockets'}">
                            <a href="/skyrockets" v-on:click="retrieveHotContent">{{ lang.HOME.MENU_SKYROCKETS }}</a>
                        </li>
                        <li class="list-inline-item" v-bind:class="{'active': nav == 'now'}">
                            <a href="/now" v-on:click="retrieveNowContent">{{ lang.HOME.MENU_NOW }}</a>
                        </li>
                        <li class="list-inline-item" v-bind:class="{'active': nav == 'promoted'}">
                            <a href="/promoted" v-on:click="retrievePromotedContent">{{ lang.HOME.MENU_PROMOTED }}</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </section>
    <script src="/js/common/navbar-mobile.js"></script>

    <div v-cloak id="home-posts">
        <section v-if="state.discussion_idx[discuss][category].length > 0" class="pt-4">
            <div class="container post-container-home">
                <div class="row">
                    <template v-for="p in state.discussion_idx[discuss][category]">
                        <?php include ('modules/post-view-home.php') ?>
                    </template>
                </div>
            </div>
        </section>

        <div v-else-if="category === 'search'" class="view-empty">
            <section class="height-60 bg--light text-center">
                <div class="container pos-vertical-center">
                    <div class="row align-items-center">
                        <div class="col-md-12 text-center">

                            <div class="row mt-2">
                                <div class="col-md-4 col-sm-6">
                                    <p class="title">{{ lang.HOME.NO_SEARCH_RESULTS_1 }}</p>
                                    <p class="subtitle">{{ lang.HOME.NO_SEARCH_RESULTS_2 }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--end of row-->
                </div>
                <!--end of container-->
            </section>
        </div>

        <div v-else-if="discuss == 'feed' && state.discussion_idx[discuss][category].length == 0" class="view-empty">
            <section class="height-60 bg--light text-center">
                <div class="container pos-vertical-center">
                    <div class="row align-items-center">
                        <div class="col-md-12 text-center">
                            <img src="/img/empty.svg" alt="" />
                            <div class="row mt-2">
                                <div class="col-md-4 col-sm-6">
                                    <p class="title">{{ lang.HOME.EMPTY_TITLE }}</p>
                                    <p class="subtitle">{{ lang.HOME.EMPTY_SUBTITLE }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--end of row-->
                </div>
                <!--end of container-->
            </section>
        </div>

    </div>



    <script src="/js/common/home.js"></script>

<?php include ('element/footer.php'); ?>