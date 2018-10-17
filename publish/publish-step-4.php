<div class="step-4">
    <div class="boxed boxed--border">
        <div class="section-title-step">
            <h4 class="title-steps">{{ lang.PUBLISH.LICENSE_TITLE }}</h4>
            <span class="description-step-title">{{ lang.PUBLISH.LICENSE_SUBTITLE }}</span>
        </div>
        <form action="" class="row">
            <div class="col-md-12">
                <label>{{ lang.PUBLISH.LICENSE_PUBLIC_DOMAIN }}</label>
                <div class="input-radio-step-2">
                    <div class="input-radio">
                        <input id="radio-1a-1" type="radio" v-bind:value="LICENSES.FREE_CONTENT.flag" v-model="publicDomain"/>
                        <label for="radio-1a-1" ></label>
                        <span class="input__label">{{ lang.COMMON.YES }}</span>
                    </div>
                    <div class="input-radio">
                        <input id="radio-1a-2" type="radio" v-bind:value="LICENSES.NO_LICENSE.flag"  v-model="publicDomain" />
                        <label for="radio-1a-2" ></label>
                        <span class="input__label">{{ lang.COMMON.NO }}</span>
                    </div>
                </div>
            </div>
            <div class="col-md-12">
                <label>{{ lang.PUBLISH.LICENSE_ADAPTATIONS }}</label>
                <div class="input-radio-step-2">
                    <div class="input-radio">
                        <input id="radio-1-1" type="radio" name="radio" value="radio-1-1" />
                        <label for="radio-1-1"></label>
                        <span class="input__label">Si</span>
                    </div>
                    <div class="input-radio">
                        <input id="radio-1-2" type="radio" name="radio" value="radio-1-2" />
                        <label for="radio-1-2"></label>
                        <span class="input__label">no</span>
                    </div>
                    <div class="input-radio">
                        <input id="radio-1-3" type="radio" name="radio" value="radio-1-3" />
                        <label for="radio-1-3"></label>
                        <span class="input__label">Sí, mientras se compartan de la misma manera</span>
                    </div>
                </div>
            </div>
            <div class="col-md-12">
                <label>{{ lang.PUBLISH.LICENSE_COMMERCIAL }}</label>
                <div class="input-radio-step-2">
                    <div class="input-radio">
                        <input id="radio-2-1" type="radio" name="radio" value="radio-2-1" />
                        <label for="radio-2-1"></label>
                        <span class="input__label">Si</span>
                    </div>
                    <div class="input-radio">
                        <input id="radio-2-2" type="radio" name="radio" value="radio-2-2" />
                        <label for="radio-2-2"></label>
                        <span class="input__label">no</span>
                    </div>
                </div>
            </div>
            <div class="col-md-12">
                <label>{{ lang.PUBLISH.LICENSE_NO_LICENSE }}</label>
                <div class="input-radio-step-2">
                    <div class="input-radio">
                        <input id="radio-3-1" type="radio" name="radio" value="radio-3-1" />
                        <label for="radio-3-1"></label>
                        <span class="input__label">Si</span>
                    </div>
                </div>
            </div>
        </form>
    </div>
    <div class="row">
        <div class="col-md-6 offset-md-3">
            <div class="boxed boxed--border">
                <div class="row">
                    <div class="col-md-12 text-center">
                        <ul class="list-unstyled list-inline ul-icon-license">
                            <li><img src="/img/icons/license/attribution.svg" alt=""></li>
                            <li><img src="/img/icons/license/creativecommons.svg" alt=""></li>
                            <li><img src="/img/icons/license/freecontent.svg" alt=""></li>
                            <li><img src="/img/icons/license/noncomercial.svg" alt=""></li>
                            <li><img src="/img/icons/license/nonderivates.svg" alt=""></li>
                            <li><img src="/img/icons/license/sharealike.svg" alt=""></li>
                        </ul>
                    </div>
                    <div class="col-md-12 text-center row-text-license">
                        <p>Attribution + Noncommercial + ShareALike</p>
                        <span>Reconocimiento 4.0 Internacional</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-md-8 offset-md-2 text-center row-text-finish">
            <p>{{ lang.PUBLISH.LICENSE_TEXT_PUBLISH }}</p>
            <span>{{ lang.PUBLISH.LICENSE_TEXT_INMUTABLE }}</span>
        </div>
    </div>
</div>

