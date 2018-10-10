<?php include ('element/navbar.php'); ?>
<div class="main-container view-publish">
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
                    <div class="boxed boxed--border">
                        <div class="step-1">
                            <div class="section-title-step">
                                <h4 class="title-steps">Contenido</h4>
                                <span class="description-step-title">Empieza a construir tu proyecto</span>
                            </div>
                            <div class="upload-img">
                                <div class="delete-img-step-1">
                                    <a href="">X</a>
                                </div>
                                <img src="img/crea-web/publish/demo-upload.png" alt="">
                            </div>
                            <div class="upload-img">
                                <div class="delete-img-step-1">
                                    <a href="">X</a>
                                </div>
                                <img src="img/crea-web/publish/demo-upload.png" alt="">
                            </div>
                            <div class="section-text-step">
                                <h4 class="title-steps">Contenido</h4>
                                <span class="description-step-title">Empieza a construir tu proyecto</span>
                            </div>

                            <div class="section-editor">
                                <textarea name="editor" id="editor" rows="30" cols="80">

                                </textarea>
                                <script>
                                    CKEDITOR.replace('editor');
                                </script>
                            </div>


                            <div class="pos-vertical-center text-center">
                                <div class="row">
                                    <div class="col-md-4 offset-4">
                                        <div class="row row-options-steps-1">
                                            <div class="col-md-6">
                                                <img src="img/crea-web/publish/b-img.png" alt="">
                                                <p>Archivo</p>
                                            </div>
                                            <div class="col-md-6">
                                                <img src="img/crea-web/publish/b-img.png" alt="">
                                                <p>Texto</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
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
            <!--end of row-->
        </div>
        <!--end of container-->
    </section>


<?php include ('element/footer.php'); ?>