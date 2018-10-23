<?php include('element/navbar.php'); ?>
<div class="main-container view-profile">
    <div v-cloak id="home-banner">
        <?php include ('modules/banner.php') ?>
    </div>
    <section v-cloak id="wallet-menu" class="cta cta-4 space--xxs border--bottom ">
        <div class="container">
            <div class="row">
                <?php include('modules/navbar-profile.php') ?>
            </div>
        </div>
    </section>

    <section v-cloak id="wallet-container" class="bg--secondary p-top-15">
        <div class="container-fluid">
            <div class="row">
                <div class="col-lg-4 col-xl-3">
                    <?php include('modules/profile-info.php') ?>
                </div>
                <div class="col-lg-8 col-xl-9  view-notifications">
                    <section class="unpad--top">
                        <div class="container">
                            <div class="row">
                                <div class="col-md-12">
                                    <?php include ('modules/list-notifications.php') ?>
                                </div>
                            </div>
                            <!--end of row-->
                        </div>
                        <!--end of container-->
                    </section>
                </div>
            </div>
            <!--end of row-->
        </div>
        <!--end of container-->
    </section>


    <?php include('element/footer.php'); ?>
