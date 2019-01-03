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

        <section v-cloak class="bg--secondary p-top-15">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-lg-4 col-xl-3">
                        <?php include ('modules/profile-info.php') ?>
                    </div>
                    <div class="col-lg-8 col-xl-9">
                        <section class="space--sm unpad--top">
                            <div class="container">
                                <div v-show="navbar.section === 'projects' && Object.keys(state.content).length == 0" class="row welcome-profile-empty">
                                    <?php include ('modules/welcome-profile-empty.php') ?>
                                </div>
                                <div v-show="navbar.section === 'projects'" class="row project-profile">
                                    <template v-for="p in state.discussion_idx['']">
                                        <?php include ('modules/post-view-home.php') ?>
                                    </template>
                                </div>
                                <div v-show="session && account.user.name === state.user.name && navbar.section === 'notifications'" class="row view-notifications" >
                                    <?php include ('modules/list-notifications.php') ?>
                                </div>
                                <div v-show="navbar.section === 'author-rewards'" >
                                    <div v-pre >
                                        <div id="profile-author-rewards" class="row view-rewards">
                                            <?php include('modules/view-rewards-author.php') ?>
                                        </div>
                                    </div>
                                </div>
                                <div v-show="navbar.section === 'curation-rewards'" class="view-rewards" >
                                    <div v-pre >
                                        <div id="profile-curation-rewards" class="row view-rewards">
                                            <?php include('modules/view-rewards-curation.php') ?>
                                        </div>
                                    </div>
                                </div>
                                <div v-show="session && account.user.name === state.user.name && navbar.section === 'blocked'" class="row view-notifications" >
                                    <div v-pre >
                                        <?php include ('modules/list-blocked.php') ?>
                                    </div>

                                </div>
                                <div v-show="navbar.section === 'wallet'" class="row view-wallet">
                                    <?php include ('modules/view-wallet.php') ?>
                                </div>
                                <div v-show="navbar.section === 'settings'" class="row view-edit-profile">
                                    <?php include ('modules/profile-edit.php') ?>
                                </div>
                                <div v-show="navbar.section === 'followers'" class="row view-notifications">
                                    <?php include ('modules/list-followers.php') ?>
                                </div>
                                <div v-show="navbar.section === 'following'" class="row view-notifications">
                                    <?php include ('modules/list-following.php') ?>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </section>
    </div>
    <script src="/js/common/profile.js"></script>
    <!--<script src="/js/common/author_rewards.js"></script>-->



<?php include ('element/footer.php'); ?>