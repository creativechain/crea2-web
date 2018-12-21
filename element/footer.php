<div class="modal-instance ">
    <a href="" class="modal-trigger link-report" href="#">Alert</a>

    <div class="modal-container modal-report">
        <div class="modal-content">
            <section class="unpad ">
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-md-6">
                            <div class="boxed boxed--lg bg--white feature">
                                <div class="modal-close modal-close-cross"></div>
                                <h3>Denunciar contenido</h3>
                                <div class="feature__body">
                                    <p class="mb-0">Denunciar contenido ayuda a mejorar la calidad y la convivencia del plataforma.</p>
                                    <p>Los motivos más comunes para reportar un contenido son:</p>
                                    <p>Recuerda que reportar contenido puede influir en la visibilidad y las recompensa alcanzadas por la publicación.</p>
                                </div>
                                <div class="row mt-3">
                                    <div class="col-md-12 text-right">
                                        <div class="btn btn--primary">
                                            <span class="btn__text">
                                                Close
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--end of row-->
                </div>
                <!--end of container-->
            </section>
        </div>
    </div>
</div>

<div class="modal-instance">

    <div id="modal-role" class="modal-container" v-bind:class="{'modal-active': show}">
        <div class="modal-content section-modal">
            <section class="unpad ">
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-md-6">
                            <div class="boxed boxed--lg bg--white text-center feature">
                                <div class="modal-close modal-close-cross"></div>
                                <h3>{{ lang.LOGIN.TITLE }}</h3>
                                <div class="feature__body">
                                    <form action="#0" v-on:submit="fetchKey" class="content-login">
                                        <div class="row">
                                            <div class="col-md-12 text-left">
                                                <input v-model="inputs.username.value"
                                                       v-on:input="checkUsername"
                                                       type="text" v-bind:placeholder="lang.LOGIN.USERNAME"/>
                                                <span class="error-color-form">{{ inputs.username.error || ' ' }}</span>
                                            </div>
                                            <div class="col-md-12 text-left">
                                                <input v-model="inputs.password.value"
                                                       type="password" v-bind:placeholder="lang.LOGIN.PASSWORD"/>
                                                <span class="error-color-form">{{ inputs.password.error || ' ' }}</span>
                                            </div>
                                            <div class="col m-2">
                                                <a class="btn btn--transparent w-100" href="#" v-on:click="closeModal">
                                                    <span class="btn__text color--dark">{{ lang.BUTTON.CANCEL }}</span>
                                                </a>
                                            </div>
                                            <div class="col m-2">
                                                <a class="btn btn--primary w-100" href="#" v-on:click="fetchKey">
                                                    <span class="btn__text">{{ lang.BUTTON.LOGIN }}</span>
                                                </a>
                                            </div>
                                        </div>
                                        <!--end of row-->
                                    </form>

                                </div>
                            </div>
                        </div>
                    </div>
                    <!--end of row-->
                </div>
                <!--end of container-->
            </section>
        </div>
    </div>
</div>





</div>
<!--<div class="loader"></div>-->
<a class="back-to-top inner-link" href="#start" data-scroll-class="100vh:active">
    <i class="stack-interface stack-up-open-big"></i>
</a>

<div id="global-loading" v-bind:class="{ loading: true, hidden: !show }">
    <div class="center-loading">
        <svg viewBox="0 0 50 50" class="spinner">
            <circle class="ring" cx="25" cy="25" r="22.5" />
            <circle class="line" cx="25" cy="25" r="22.5" />
        </svg>
    </div>
</div>

<script src="/js/flickity.min.js"></script>
<script src="/js/easypiechart.min.js"></script>
<script src="/js/parallax.js"></script>
<script src="/js/typed.min.js"></script>
<script src="/js/datepicker.js"></script>
<script src="/js/isotope.min.js"></script>
<script src="/js/ytplayer.min.js"></script>
<script src="/js/lightbox.min.js"></script>
<script src="/js/granim.min.js"></script>
<script src="/js/jquery.steps.min.js"></script>
<script src="/js/countdown.min.js"></script>
<script src="/js/twitterfetcher.min.js"></script>
<script src="/js/spectragram.min.js"></script>
<script src="/js/smooth-scroll.min.js"></script>
<script src="/js/bootstrap-slider.js"></script>
<script src="/js/scripts.js"></script>

<script src="/js/custom.js"></script>

<script src="/js/common/modals.js"></script>
<script src="/js/common/setup.js"></script>

</body>
</html>