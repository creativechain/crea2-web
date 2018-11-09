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


    <section v-cloak id="home-posts" class="space--sm">
        <div class="row">
            <div class="col-md-4 text-center">
                <a href="#0" class="btn btn--sm btn--primary">
                    <span class="btn__text">Follow</span>
                </a>
            </div>
            <div class="col-md-4 text-center">
                <a href="#0" class="btn btn--sm btn-following">
                    <span class="btn__text text__dark">Following</span>
                </a>
            </div>
            <div class="col-md-4 text-center">
                <a href="#0" class="btn btn--sm btn-unfollow">
                    <span class="btn__text">Unfollow</span>
                </a>
            </div>
        </div>
        <div class="container post-container-home">
            <div class="masonry">
                <div class="masonry__container row">
                    <template v-for="p in state.discussion_idx[''][filter]">
                        <?php include ('modules/post-view-home.php') ?>
                    </template>
                </div>
            </div>
        </div>
    </section>


<?php include ('element/footer.php'); ?>