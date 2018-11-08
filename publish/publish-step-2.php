<div class="step-2">
    <div class="boxed boxed--border">
        <div class="section-title-step">
            <h4 class="title-steps">{{ lang.PUBLISH.INFO_TITLE }}</h4>
            <span class="description-step-title">{{ lang.PUBLISH.INFO_SUBTITLE }}</span>
        </div>
        <div class="boxed boxed--border box-image-step-2" v-on:click="loadFeaturedImage">
            <div class="row row-image">
                <div v-if="!featuredImage.url" class="col-md-4 offset-4 text-center">
                    <img src="/img/crea-web/publish/b-img-portada.png" alt="">
                    <p>{{ lang.PUBLISH.INFO_IMAGE }}</p>
                    <p class="disabled">Imagen máximo 0,5MB</p>
                </div>
                <div v-else>
                    <img v-bind:src="featuredImage.url" alt="">
                </div>
            </div>
            <div class="pos-vertical-center text-center hidden">
                <div class="row">
                    <div v-if="!featuredImage.url" class="col-md-4 offset-4">
                        <div class="row row-options-steps-1">
                            <div class="col">
                                <img src="/img/crea-web/publish/b-img-portada.png" alt="" class="img-protada">
                                <p>{{ lang.PUBLISH.INFO_IMAGE }}</p>
                            </div>
                        </div>
                    </div>
                    <div v-else>
                        <img v-bind:src="featuredImage.url" alt="">
                    </div>
                </div>
            </div>
            <input ref="publishInputCover" class="hidden" type="file" accept="image/*" v-on:change="onLoadFeaturedImage" >

        </div>

    </div>
    <div class="boxed boxed--border">
        <div class="section-title-step">
            <h4 class="title-steps">{{ lang.PUBLISH.INFO_POST }}</h4>
        </div>

        <form action="" class="row">
                <div class="col-md-12">
                    <label>{{ lang.PUBLISH.INFO_POST_TITLE }}</label>
                    <input v-model="title" v-bind:maxlength="CONSTANTS.TEXT_MAX_SIZE.TITLE" class="validate-required" type="text" name="My Input" v-bind:placeholder="lang.PUBLISH.INFO_INPUT_TITLE" />
                </div>
                <div class="col-md-12">
                    <label>{{ lang.PUBLISH.INFO_DESCRIPTION }}</label>
                    <input v-model="description" v-bind:maxlength="CONSTANTS.TEXT_MAX_SIZE.DESCRIPTION" class="validate-required" type="text" name="My Input" v-bind:placeholder="lang.PUBLISH.INFO_INPUT_DESCRIPTION" />
                </div>
                <div class="col-md-12">
                    <label>{{ lang.PUBLISH.INFO_TAGS }}</label>
                    <input class="validate-required" v-on:keypress="onTagsChange" v-bind:data-options="'{maxTags: '+ CONSTANTS.MAX_TAGS + ', maxChars: ' + CONSTANTS.TEXT_MAX_SIZE.TAG + '}'"
                           type="text" data-role="tagsinput" value="" v-bind:placeholder="lang.PUBLISH.INFO_INPUT_TAGS"
                           tags-view >
                </div>
                <div class="col-md-12">
                    <label>{{ lang.PUBLISH.QUESTION }}</label>
                    <div class="input-radio-step-2">
                        <div class="input-radio">
                            <span class="input__label">{{ lang.COMMON.YES }}</span>
                            <input id="radio-1" type="radio" name="adult" v-model="adult" v-bind:value="true" />
                            <label for="radio-1"></label>
                        </div>
                        <div class="input-radio">
                            <span class="input__label">{{ lang.COMMON.NO }}</span>
                            <input id="radio-2" type="radio" name="adult" v-model="adult" v-bind:value="false"/>
                            <label for="radio-2"></label>
                        </div>
                    </div>
                </div>
                <div class="col-md-12">

                </div>
            </form>
    </div>
</div>

