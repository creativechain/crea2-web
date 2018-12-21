<div class="step-1">
    <div class="boxed boxed--border">
        <div v-if="bodyElements.length == 0 && !showEditor" class="section-title-step">
            <h4 class="title-steps">{{ lang.PUBLISH.SECONDARY_MENU_CONTENT }}</h4>
            <span class="description-step-title">{{ lang.PUBLISH.CONTENT_SUBTITLE }}</span>
        </div>

        <template v-for="k in Object.keys(bodyElements)">
            <div v-if="bodyElements[k].type.indexOf('text/html') > -1" v-on:click="editText(k)" >
                <div class="upload-img">
                    <div v-html="bodyElements[k].value"></div>
                    <div class="delete-img-step-1" v-on:click="removeElement(k)">
                        <a href="#" style="color: #222222">X</a>
                    </div>
                </div>

            </div>
            <div v-else-if="bodyElements[k].type.indexOf('image/') > -1" class="upload-img">
                <div class="delete-img-step-1" v-on:click="removeElement(k)">
                    <a href="#">X</a>
                </div>
                <img v-bind:src="bodyElements[k].url" alt="">
            </div>
            <div v-else-if="bodyElements[k].type.indexOf('video/') > -1" class="upload-img">
                <div class="delete-img-step-1" v-on:click="removeElement(k)">
                    <a href="#">X</a>
                </div>
                <video controls>
                    <source v-bind:src="bodyElements[k].url" v-bind:type="bodyElements[k].type">
                </video>
            </div>
            <div v-else-if="bodyElements[k].type.indexOf('audio/') > -1" class="upload-img">
                <div class="delete-img-step-1" v-on:click="removeElement(k)">
                    <a href="#">X</a>
                </div>
                <audio controls>
                    <source v-bind:src="bodyElements[k].url" v-bind:type="bodyElements[k].type">
                </audio>
            </div>
        </template>

        <div v-if="showEditor" class="section-editor">
            <div class="section-title-step upload-img">
                <h4 class="title-steps">{{ lang.PUBLISH.CONTENT_TEXT }}</h4>
                <span class="description-step-title">{{ lang.PUBLISH.CONTENT_SECONDARY_SENTENCE }}</span>

                <div class="delete-img-step-1" v-on:click="toggleEditor">
                    <a href="#" style="color: #222222">X</a>
                </div>
            </div>
            <ckeditor ></ckeditor>
        </div>
        <div v-if="showEditor" class="row mt-3" style="z-index: 1;position: relative;">
            <div class="col-md-12 text-right">
                <div class="btn btn--sm" v-on:click="updateText(updatingIndex)">
                    <span class="btn__text text__dark">{{ lang.BUTTON.SAVE }}</span>
                </div>
            </div>
        </div>

        <div class="pos-vertical-center text-center">
            <div class="row">
                <div class="col-md-6 offset-3">
                    <div class="row row-options-steps-1">
                        <div class="col-md-6">
                            <div class="button-add-file" v-on:click="loadFile"></div>
                            <p class="title">{{ lang.PUBLISH.FILE }}</p>
                            <p class="disabled">{{ lang.PUBLISH.FILE_TYPE_INFO }}</p>
                            <input ref="publishInputFile" type="file" accept="image/*|audio/*|video/*" class="hidden" v-on:change="onLoadFile">
                        </div>
                        <div class="col-md-6">
                            <div class="button-add-text" v-on:click="toggleEditor"></div>
                            <p class="title">{{ lang.PUBLISH.TEXT }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <p class="disabled">
                    {{ String.format(lang.PUBLISH.IMAGE_MAX_FILE_SIZE, humanFileSize(CONSTANTS.FILE_MAX_SIZE.IMAGE)) }},
                    {{ String.format(lang.PUBLISH.AUDIO_MAX_FILE_SIZE, humanFileSize(CONSTANTS.FILE_MAX_SIZE.AUDIO)) }},
                    {{ String.format(lang.PUBLISH.VIDEO_MAX_FILE_SIZE, humanFileSize(CONSTANTS.FILE_MAX_SIZE.VIDEO)) }}
                </p>
                <p class="error-color-form">
                    {{ error || '' }}
                </p>
            </div>
        </div>
    </div>
</div>
