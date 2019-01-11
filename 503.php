<?php include ('element/navbar.php'); ?>
<div class="main-container view-error-404">
    <section v-cloak id="error-container" class="height-100 bg--light text-center">
        <div class="container pos-vertical-center">
            <div class="row align-items-center">
                <div class="col-md-6 text-left col-left">
                    <h1 class="h1--large">Oops!</h1>
                    <p class="sub-text"><span>503.</span>{{ lang.ERROR_PAGES.THATS_ERROR }}</p>
                    <p>{{ lang.ERROR_PAGES.MESSAGE_505 }}</p>
                    <p>{{ lang.ERROR_PAGES.WE_KNOW }}</p>
                </div>
                <div class="col-md-6">
                    <img src="/img/creary_manteniment.svg" alt="" />
                </div>
            </div>
            <!--end of row-->
        </div>
        <!--end of container-->
    </section>
    <script src="/js/common/error-page.js"></script>
<?php include ('element/footer.php'); ?>