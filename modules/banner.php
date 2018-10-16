<section v-if="showBanner" class="imagebg image--light cover cover-blocks bg--secondary" id="slide-home">
    <div class="row-close" v-on:click="closeBanner()">
        <a href="#"><i class="fas fa-times"></i></a>
    </div>
    <div class="background-image-holder hidden-xs">
        <img alt="background" src="img/crea-web/slide_casmiclab_logo.jpg"/>
    </div>
    <div class="container">
        <div class="row">
            <div class="col-md-6 col-lg-5 offset-1">
                <h1>Bienvenidos a la blockchain de las comunidades creativas</h1>
                <h3>Un mundo sin intermediarios</h3>
                <a href="welcome.php" class="btn btn--primary btn--sm btn--transparent type--uppercase">
                    <span class="btn__text">
                            {{ lang.BUTTON.SIGN_UP }}
                    </span>
                </a>
            </div>
        </div>
    </div>
</section>