<?php include ('element/navbar.php'); ?>
<div class="main-container view-profile">
    <?php include ('modules/banner.php') ?>
    <section id="profile-menu" class="cta cta-4 space--xxs border--bottom ">
        <div class="container">
            <div class="row">
                <?php include ('modules/navbar-profile.php') ?>
            </div>
        </div>
    </section>

    <section id="profile-container" class="bg--secondary p-top-15">
        <div class="container">
            <div class="row">
                <div class="col-lg-4 col-xl-3">
                    <?php include ('modules/profile-info.php') ?>
                </div>
                <div class="col-lg-8 col-xl-9">
                    <section class="space--sm unpad--top">
                        <div class="container">
                            <?php include ('modules/post-view-home.php') ?>
                            <?php include ('modules/profile-edit.php') ?>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    </section>


<?php include ('element/footer.php'); ?>