<div class="step-3">

    <div class="boxed boxed--border">
        <div class="section-title-step">
            <h4 class="title-steps">{{ lang.PUBLISH.DOWNLOAD_TITLE }}</h4>
            <span class="description-step-title">{{ lang.PUBLISH.DOWNLOAD_SUBTITLE }}</span>
        </div>
        <form action="" class="row">
            <div class="col-md-12">
                <label for="exampleFormControlFile1">{{ lang.PUBLISH.INPUT_SELECT_FILE }}</label>
                <input type="file" class="form-control-file" id="exampleFormControlFile1">
            </div>
            <div class="col-md-12">
                <label>{{ lang.PUBLISH.PRICE }}</label>
                <input class="validate-required" type="number" min="0" step="0.001" v-bind:placeholder="lang.PUBLISH.INPUT_PRICE" />
            </div>
        </form>
    </div>

</div>