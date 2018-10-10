<?php include ('element/navbar.php'); ?>
<div class="main-container">
    <?php include ('modules/banner.php') ?>
    <section class="cta cta-4 space--xxs border--bottom ">
        <div class="container">
            <div class="row">
                <?php include ('modules/navbar-filter-home.php') ?>
            </div>
        </div>
    </section>


    <section id="home-posts" class="space--sm">
        <div class="container">
            <div class="masonry">
                <div class="masonry__container row">
                    <template v-for="p in posts">
                        <?php include ('modules/post-view-home.php') ?>
                    </template>
                </div>
            </div>
        </div>
    </section>


<?php include ('element/footer.php'); ?>