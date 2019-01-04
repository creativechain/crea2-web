<div v-for="b in blocked" class="col-md-12">
    <div class="boxed boxed--border row-list">
        <div class="row row-list-user">
            <div class="col-md-9">
                <div class="row-list-user-display">
                    <div class="user-avatar">
                        <div class="img-user-avatar" v-bind:style="{ 'background-image': 'url(' + ( b.metadata.avatar.url || getDefaultAvatar(blocked[b].name)) + ')' }"></div>
                        <avatar v-bind:account="b"></avatar>
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
