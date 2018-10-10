<?php include ('element/navbar.php'); ?>
<div class="main-container">
    <section class="imagebg image--light cover cover-blocks bg--secondary" id="slide-home">
        <div class="background-image-holder hidden-xs">
            <img alt="background" src="img/crea-web/welcome/banner-home.jpg"/>
        </div>
        <div class="container">
            <div class="row">
                <div class="col-md-6 col-lg-5 ">
                    <div>

                    </div>
                </div>
            </div>
        </div>
    </section>
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
                    <template v-for="p in data.discussion_idx[''][filter]">
                        <?php include ('modules/post-view-home.php') ?>
                    </template>
                </div>
            </div>
        </div>
    </section>


<?php include ('element/footer.php'); ?>