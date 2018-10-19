<?php include ('element/navbar.php'); ?>
<div class="main-container view-profile">
    <div id="home-banner">
        <?php include ('modules/banner.php') ?>
    </div>
    <div id="profile-container" v-cloak>
        <section v-cloak class="cta cta-4 space--xxs border--bottom ">
            <div class="container">
                <div class="row">
                    <?php include ('modules/navbar-profile.php') ?>
                </div>
            </div>
        </section>

        <section class="bg--secondary p-top-15">
            <div class="container">
                <div class="row">
                    <div class="col-lg-4 col-xl-3">
                        <?php include ('modules/profile-info.php') ?>
                    </div>
                    <div class="col-lg-8 col-xl-9">
                        <section class="space--sm unpad--top">
                            <div class="container">
                                <div v-if="navfilter === 'projects'" >
                                    <template v-for="p in data.discussion_idx['']">
                                        <?php include ('modules/post-view-home.php') ?>
                                    </template>
                                </div>
                                <div v-else-if="navfilter === 'edit'">
                                    <?php include ('modules/profile-edit.php') ?>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </section>
    </div>



<?php include ('element/footer.php'); ?>