<?php include ('element/navbar.php'); ?>
<div class="main-container view-publish">
    <div id="home-banner">
        <?php include ('modules/banner.php') ?>
    </div>
    <div v-cloak id="publish-container">
        <section class="cta cta-4 space--xxs border--bottom ">
            <div class="container">
                <div class="row">
                    <div class="col-md-11">
                        <ul class="list-inline list-unstyled li-title-steps">
                            <li v-on:click="step = 1"><p v-bind:class="{ active: step == 1}">1. {{ lang.PUBLISH.SECONDARY_MENU_CONTENT }}</p></li>
                            <li v-on:click="step = 2"><p v-bind:class="{ active: step == 2}">2. {{ lang.PUBLISH.SECONDARY_MENU_INFO }}</p></li>
                            <li v-on:click="step = 3"><p v-bind:class="{ active: step == 3}">3. {{ lang.PUBLISH.SECONDARY_MENU_DOWNLOAD }}</p></li>
                            <li v-on:click="step = 4"><p v-bind:class="{ active: step == 4}">4. {{ lang.PUBLISH.SECONDARY_MENU_LICENSE }}</p></li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
        <section class="space--sm">
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-md-8">
                        <template v-if="step == 1">
                            <?php include ('publish/publish-step-1.php') ?>
                        </template>
                        <template v-else-if="step == 2">
                            <?php include ('publish/publish-step-2.php') ?>
                        </template>
                        <template v-else-if="step == 3">
                            <?php include ('publish/publish-step-3.php') ?>
                        </template>
                        <template v-else-if="step == 4">
                            <?php include ('publish/publish-step-4.php') ?>
                        </template>
                        <div class="row">
                            <div class="col-md-4 offset-4">
                                <a v-if="step !== 4" class="btn btn--primary type--uppercase w-100" v-on:click="nextStep">
                                    <span class="btn__text">
                                        {{ lang.BUTTON.CONTINUE }}
                                    </span>
                                </a>
                                <a v-else class="btn btn--primary type--uppercase w-100" v-on:click="makePublication">
                                    <span class="btn__text">
                                        {{ lang.BUTTON.PUBLISH }}
                                    </span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
    <script src="/js/common/publish.js"></script>

<?php include ('element/footer.php'); ?>