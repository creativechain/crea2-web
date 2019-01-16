<?php include ('element/navbar.php'); ?>

<div class="main-container">
    <div v-cloak id="home-banner">
        <?php include ('modules/banner.php') ?>
    </div>

    <section class="cta cta-4 space--xxs border--bottom ">
        <div class="container post-container-home">
            <div class="row">
                <?php include ('modules/navbar-filter-home.php') ?>
            </div>
        </div>
    </section>

    <div v-cloak id="home-posts">
        <section v-if="state.discussion_idx[discuss][category].length > 0" class="space--sm">
            <div class="container post-container-home">
                <div class="row">
                    <template v-for="p in state.discussion_idx[discuss][category]">
                        <?php include ('modules/post-view-home.php') ?>
                    </template>
                </div>
            </div>
        </section>

        <div v-else class="view-empty">
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