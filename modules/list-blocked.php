<div id="blocked-container">
    <div class="col-md-12">
        <h3 class="title-section-profile">{{ lang.PROFILE.TITLE_BLOCKED }}</h3>
    </div>

    <div class="col-md-12">
        <div class="boxed boxed--border row-list">
            <template v-for="b in blocked">
                <div class="row row-list-user">
                    <div class="col-md-9">
                        <div class="row-list-user-display">
                            <avatar v-bind:account="b"></avatar>
                            <div class="list-data-user">
                                <p>{{ b.metadata.publicName </p>
                                <username v-bind:user="b.name" v-bind:name="b.metadata.publicName"></username>
                                <p><span>{{ b.metadata.description || '' }}</span></p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3 align-self-center text-right">
                        <a href="/publish.php" class="btn btn--sm btn--primary">
                            <span class="btn__text">Unlock</span>
                        </a>
                    </div>
                </div>
            </template>
        </div>
    </div>
</div>
<script src="/js/common/blocked.js"></script>
