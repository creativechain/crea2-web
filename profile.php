<?php include ('element/navbar.php'); ?>
<div class="main-container view-profile">
    <div id="home-banner">
        <?php include ('modules/banner.php') ?>
    </div>
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
                            <template v-for="p in data.discussion_idx[''][filter]">
                                <?php include ('modules/post-view-home.php') ?>
                            </template>
                            <?php include ('modules/profile-edit.php') ?>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    </section>


<?php include ('element/footer.php'); ?>