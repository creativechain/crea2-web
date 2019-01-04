<div v-cloak id="following-container" class="row view-notifications">
    <div class="col-md-12">
        <h3 class="title-section-profile">Following</h3>
    </div>

    <div v-for="f in following" class="col-md-12">
        <div class="boxed boxed--border row-list">
            <div class="row row-list-user">
                <div class="col-md-9">
                    <div class="row-list-user-display">
                        <div class="user-avatar">
                            <a v-bind:href="'/@' + f.name ">
                                <avatar v-bind:account="f"></avatar>
                            </a>
                        </div>
                        <div class="list-data-user">
                            <username v-bind:user="f.name" v-bind:name="f.metadata.publicName"></username>
                            <p><span>{{ f.metadata.description || 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod' }}</span></p>
                        </div>
                    </div>
                </div>
                <div v-if="session" class="col-md-3 align-self-center text-right">
                    <btn-follow v-on:follow="onFollow" v-bind:session="session"
                                v-bind:account="account.user"
                                v-bind:user="f.name" >
                    <!--<a href="/publish.php" class="btn btn--sm btn--primary">
                        <span class="btn__text">Unlock</span>
                    </a>-->
                </div>
            </div>
        </div>
    </div>
</div>

