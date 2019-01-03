<div id="blocked-container">
    <div class="col-md-12">
        <h3 class="title-section-profile">{{ lang.PROFILE.TITLE_BLOCKED }}</h3>
    </div>

    <div v-cloak="" class="col-md-12">
        <div class="boxed boxed--border row-list">

            <div v-for="b in accounts" class="row row-list-user">
                <div class="col-md-9">
                    <div class="row-list-user-display">
                        <!--<avatar v-bind:account="blocked[b]" v-bind:blocked="1"></avatar>-->
                        <div class="list-data-user">
                            <p>{{ blocked[b].metadata.publicName }} </p>
                            <username v-bind:user="blocked[b].name" v-bind:name="blocked[b].metadata.publicName"></username>
                            <p><span>{{ blocked[b].metadata.description || '' }}</span></p>
                        </div>
                    </div>
                </div>
                <div class="col-md-3 align-self-center text-right">
                    <a href="/publish.php" class="btn btn--sm btn--primary">
                        <span class="btn__text">Unlock</span>
                    </a>
                </div>
            </div>

        </div>
    </div>
</div>
