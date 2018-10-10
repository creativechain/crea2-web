<?php include ('element/navbar.php'); ?>
<div class="main-container view-publish">
    <?php include ('modules/banner.php') ?>
    <section class="cta cta-4 space--xxs border--bottom ">
        <div class="container">
            <div class="row">
                <div class="col-md-11">
                    <ul class="list-inline list-unstyled li-title-steps">
                        <li><p class="active">1. Contenido</p></li>
                        <li>2. Información</li>
                        <li>3. Descarga</li>
                        <li>4. Licencia</li>
                    </ul>
                </div>
            </div>
        </div>
    </section>
    <section class="space--sm">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-md-7">
                    <?php include ('publish/publish-step-1.php') ?>
                    <?php include ('publish/publish-step-2.php') ?>
                    <?php include ('publish/publish-step-3.php') ?>
                    <?php include ('publish/publish-step-4.php') ?>
                    <div class="row">
                        <div class="col-md-3 offset-9">
                            <a class="btn btn--primary type--uppercase w-100" href="#">
                                <span class="btn__text">
                                    Continuar
                                </span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

<?php include ('element/footer.php'); ?>