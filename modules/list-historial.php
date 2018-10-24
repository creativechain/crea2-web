<div class="boxed boxed--border">
    <div class="col-md-12">
        <h3>{{ lang.WALLET.HISTORY }}</h3>
    </div>
    <template v-for="op in history.data">
        <div v-if="op.op.type == 'transfer_operation'" class="row-list-user">
            <div class="user-avatar">
                <a v-bind:href="'/profile.php?profile=' + op.op.value.from">
                    <div class="img-user-avatar" v-bind:style="{ 'background-image': 'url(' + (history.accounts[op.op.value.from].metadata.avatar.url || getDefaultAvatar(op.op.value.from)) + ')' }"></div>
                </a>
            </div>
            <div class="list-data-user">
                <p>
                    <a v-bind:href="'/profile.php?profile=' + op.op.value.from">
                        {{ history.accounts[op.op.value.from].metadata.publicName || op.op.value.from }}
                    </a>
                    <span>{{ dateFromNow(op.timestamp) }}</span>
                </p>

                    <p v-if="account && op.op.value.from == account.name">
                        {{ lang.HISTORY.TRANSFER_TO }}
                        <a v-bind:href="'/profile.php?profile=' + op.op.value.to">
                             {{ (history.accounts[op.op.value.to].metadata.publicName || op.op.value.to) }}
                        </a>
                    </p>
                    <p v-else>
                        {{ lang.HISTORY.TRANSFER_FROM }}
                        <a v-bind:href="'/profile.php?profile=' + op.op.value.from">
                            {{ (history.accounts[op.op.value.from].metadata.publicName || op.op.value.from) }}
                        </a>
                    </p>
                <p>{{ op.op.value.memo || '' }}</p>
            </div>
            <div class="list-amount">
                <p v-if="account && op.op.value.from == account.name">+{{ parseAsset(op.op.value.amount) }}</p>
                <p v-else >+{{ parseAsset(op.op.value.amount) }}</p>
            </div>
            <hr>
        </div>
        <div v-else-if="op.op.type == 'transfer_to_vesting_operation'" class="row-list-user">
            <div class="user-avatar">
                <a v-bind:href="'/profile.php?profile=' + op.op.value.from">
                    <div class="img-user-avatar" v-bind:style="{ 'background-image': 'url(' + (history.accounts[op.op.value.from].metadata.avatar.url || getDefaultAvatar(op.op.value.from)) + ')' }"></div>
                </a>
            </div>
            <div class="list-data-user">
                <p>
                    <a v-bind:href="'/profile.php?profile=' + op.op.value.from">
                        {{ history.accounts[op.op.value.from].metadata.publicName || op.op.value.from }}
                    </a>
                    <span>{{ dateFromNow(op.timestamp) }}</span>
                </p>

                <p v-if="account && op.op.value.from == account.name">
                    {{ lang.HISTORY.TRANSFER_VESTING_TO }}
                    <a  v-bind:href="'/profile.php?profile=' + op.op.value.to">
                        {{ (history.accounts[op.op.value.to].metadata.publicName || op.op.value.to) }}
                    </a>
                </p>
                <p v-else >
                    {{ lang.HISTORY.TRANSFER_VESTING_FROM }}
                    <a v-bind:href="'/profile.php?profile=' + op.op.value.from">
                        {{ (history.accounts[op.op.value.from].metadata.publicName || op.op.value.from) }}
                    </a>
                </p>

                <p>{{ op.op.value.memo || '' }}</p>
            </div>
            <div class="list-amount">
                <p v-if="account && op.op.value.from == account.name">+{{ parseAsset(op.op.value.amount) }}</p>
                <p v-else >+{{ parseAsset(op.op.value.amount) }}</p>
            </div>
            <hr>
        </div>
        <div v-else-if="op.op.type == 'comment_operation'" class="row-list-user">
            <div class="user-avatar">
                <a v-bind:href="'/profile.php?profile=' + op.op.value.author">
                    <div class="img-user-avatar" v-bind:style="{ 'background-image': 'url(' + (history.accounts[op.op.value.author].metadata.avatar.url || getDefaultAvatar(op.op.value.author)) + ')' }"></div>
                </a>
            </div>
            <div class="list-data-user">
                <p>
                    <a v-bind:href="'/profile.php?profile=' + op.op.value.author">
                        {{ history.accounts[op.op.value.author].metadata.publicName || op.op.value.author }}
                    </a>
                    <span>{{ dateFromNow(op.timestamp) }}</span>
                </p>

                <p v-if="op.op.value.parent_author != ''">
                    {{ lang.HISTORY.COMMENTED + op.op.value.parent_permlink }}
                </p>
                <p v-else >
                    {{ lang.HISTORY.POSTED + op.op.value.title }}
                </p>
                <p>{{ op.op.value.parent_author != '' ? op.op.value.body : '' }}</p>
            </div>
            <div class="list-amount">
                <p v-if="account && op.op.value.from == account.name">-</p>
            </div>
            <hr>
        </div>
        <div v-else-if="op.op.type == 'vote_operation'" class="row-list-user">
            <div class="user-avatar">
                <a v-bind:href="'/profile.php?profile=' + op.op.value.voter">
                    <div class="img-user-avatar" v-bind:style="{ 'background-image': 'url(' + (history.accounts[op.op.value.voter].metadata.avatar.url || getDefaultAvatar(op.op.value.voter)) + ')' }"></div>
                </a>
            </div>
            <div class="list-data-user">
                <p>
                    <a v-bind:href="'/profile.php?profile=' + op.op.value.voter">
                        {{ history.accounts[op.op.value.voter].metadata.publicName || op.op.value.voter }}
                    </a>
                    <span>{{ dateFromNow(op.timestamp) }}</span>
                </p>
                <p>
                    {{ lang.HISTORY.VOTED_FOR + op.op.value.permlink }}
                </p>
                <p></p>
            </div>
            <div class="list-amount">
                <p>{{ (op.op.value.weight * 100 / 10000).toFixed(0) }}%</p>
            </div>
            <hr>
        </div>
        <div v-else-if="op.op.type == 'account_create_operation'" class="row-list-user">
            <div class="user-avatar">
                <a v-bind:href="'/profile.php?profile=' + op.op.value.creator">
                    <div class="img-user-avatar" v-bind:style="{ 'background-image': 'url(' + (history.accounts[op.op.value.creator].metadata.avatar.url || getDefaultAvatar(op.op.value.creator)) + ')' }"></div>
                </a>
            </div>
            <div class="list-data-user">
                <p>
                    <a v-bind:href="'/profile.php?profile=' + op.op.value.creator">
                        {{ history.accounts[op.op.value.creator].metadata.publicName || op.op.value.creator }}
                    </a>
                    <span>{{ dateFromNow(op.timestamp) }}</span>
                </p>
                <p>
                    {{ (history.accounts[op.op.value.creator].metadata.publicName || op.op.value.creator) +
                    lang.HISTORY.CREATE_ACCOUNT + op.op.value.new_account_name }}
                </p>
                <p></p>
            </div>
            <div class="list-amount">
                <p>{{ parseAsset(op.op.value.fee) }}</p>
            </div>
            <hr>
        </div>
    </template>
    <!--<div class="row-list-user">
        <div class="avatare-list">
            <img src="img/profile/avatar-round-3.png" alt="">
        </div>
        <div class="list-data-user">
            <p>Comando C <span>4 days ago</span></p>
            <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam
                nonummy nibh euismod … tincidunt ut laoreet dolore magna aliquam
                erat</p>
        </div>
        <div class="list-amount">
            <p>+1 300 755,2850 CREA </p>
        </div>
        <hr>
    </div>-->
</div>