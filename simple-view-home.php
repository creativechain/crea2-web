<?php include ('element/navbar.php'); ?>
<div class="main-container simple-view-home">
    <section class="cta cta-4 space--xxs border--bottom ">
        <div class="container">
            <div class="row">
                <?php include ('modules/navbar-filter-home.php') ?>
            </div>
        </div>
    </section>

    <section class="space--sm">
        <div class="container">
            <div class="masonry">
                <div class="masonry__container row">
                    <?php include ('modules/post-view-home.php') ?>
                </div>
            </div>
        </div>
    </section>


<?php include ('element/footer.php'); ?>