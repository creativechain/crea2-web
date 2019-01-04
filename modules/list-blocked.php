<div v-cloak id="blocked-container" class="row view-notifications">
    <div class="col-md-12">
        <h3 class="title-section-profile">{{ lang.PROFILE.TITLE_BLOCKED }}</h3>
    </div>

    <div v-for="b in blocked" class="col-md-12">
        <div class="boxed boxed--border row-list">
            <div class="row row-list-user">
                <div class="col-md-9">
                    <div class="row-list-user-display">
                        <div class="user-avatar">
                            <a v-bind:href="'/@' + b.name ">
                                <avatar v-bind:account="b"></avatar>
                            </a>
                        </div>

                        <div class="list-data-user">
                            <username v-bind:user="b.name" v-bind:name="b.metadata.publicName"></username>
                            <p><span>{{ b.metadata.description || 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod' }}</span></p>
                        </div>
                    </div>
                </div>
                <div class="col-md-3 align-self-center text-right">
                    <div class="btn btn--sm btn--primary" v-on:click="unlock(b.name)">
                        <span class="btn__text">{{ lang.BUTTON.UNLOCK }}</span>
                    </div>
                </div>
            </div>

        </div>
    </div>

</div>



