<div class="step-1">
    <div class="boxed boxed--border">
        <div class="section-title-step">
            <h4 class="title-steps">{{ lang.PUBLISH.SECONDARY_MENU_CONTENT }}</h4>
            <span class="description-step-title">{{ lang.PUBLISH.CONTENT_SUBTITLE }}</span>
        </div>

        <template v-for="k in Object.keys(bodyElements)">
            <div v-if="bodyElements[k].type.indexOf('text/html') > -1" v-on:click="editText(k)" v-html="bodyElements[k].value">
                <div class="delete-img-step-1" v-on:click="removeElement(k)">
                    <a href="#">X</a>
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

        <div class="section-editor">
            <ckeditor ></ckeditor>
        </div>

        <div class="pos-vertical-center text-center">
            <div class="row">
                <div class="col-md-6 offset-3">
                    <div class="row row-options-steps-1">
                        <div class="col-md-6">
                            <div class="button-add-file" v-on:click="loadFile"></div>
                            <p class="title">{{ lang.PUBLISH.FILE }}</p>
                            <p class="disabled">(imagen, audio, video)</p>
                            <input ref="publishInputFile" type="file" accept="image/*|audio/*|video/*" class="hidden" v-on:change="onLoadFile">
                        </div>
                        <div class="col-md-6">
                            <div class="button-add-text" v-on:click="updateText(updatingIndex)"></div>
                            <p class="title">{{ lang.PUBLISH.TEXT }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <p class="disabled">Imagen máximo 0,5MB. Audio máximo 100MB. Video máximo 200MB</p>
            </div>
        </div>
    </div>
</div>
