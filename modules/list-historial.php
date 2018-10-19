<div class="boxed boxed--border">
    <div class="col-md-12">
        <h3>{{ lang.WALLET.HISTORY }}</h3>
    </div>
    <template v-for="op in history.data">
        <div v-if="op.op.type == 'transfer_operation'" class="row-list-user">
            <div class="avatare-list">
                <img v-bind:src="history.accounts[op.op.value.from].metadata.avatar || '/img/avatar/avatar1.png'" alt="">
            </div>
            <div class="list-data-user">
                <p>{{ history.accounts[op.op.value.from].metadata.publicName || history.accounts[op.op.value.from].name }} <span>{{ dateFromNow(op.timestamp) }}</span></p>
                <p v-if="op.op.value.from == account.name">
                    {{ lang.HISTORY.TRANSFER_TO + (history.accounts[op.op.value.to].metadata.publicName || history.accounts[op.op.value.to].name) }}
                </p>
                <p v-else >
                    {{ lang.HISTORY.TRANSFER_FROM + (history.accounts[op.op.value.from].metadata.publicName || history.accounts[op.op.value.from].name) }}
                </p>
                <p>{{ op.op.value.memo || '' }}</p>
            </div>
            <div class="list-amount">
                <p v-if="op.op.value.from == account.name">+{{ parseAsset(op.op.value.amount) }}</p>
                <p v-else >+{{ parseAsset(op.op.value.amount) }}</p>
            </div>
            <hr>
        </div>
        <div v-else-if="op.op.type == 'transfer_to_vesting_operation'" class="row-list-user">
            <div class="avatare-list">
                <img v-bind:src="history.accounts[op.op.value.from].metadata.avatar || '/img/avatar/avatar1.png'" alt="">
            </div>
            <div class="list-data-user">
                <p>{{ history.accounts[op.op.value.from].metadata.publicName || history.accounts[op.op.value.from].name }} <span>{{ dateFromNow(op.timestamp) }}</span></p>
                <p v-if="op.op.value.from == account.name">
                    {{ lang.HISTORY.TRANSFER_VESTING_TO + (history.accounts[op.op.value.to].metadata.publicName || history.accounts[op.op.value.to].name) }}
                </p>
                <p v-else >
                    {{ lang.HISTORY.TRANSFER_VESTING_FROM + (history.accounts[op.op.value.from].metadata.publicName || history.accounts[op.op.value.from].name) }}
                </p>
                <p>{{ op.op.value.memo || '' }}</p>
            </div>
            <div class="list-amount">
                <p v-if="op.op.value.from == account.name">+{{ parseAsset(op.op.value.amount) }}</p>
                <p v-else >+{{ parseAsset(op.op.value.amount) }}</p>
            </div>
            <hr>
        </div>
        <div v-else-if="op.op.type == 'comment_operation'" class="row-list-user">
            <div class="avatare-list">
                <img v-bind:src="history.accounts[op.op.value.author].metadata.avatar || '/img/avatar/avatar1.png'" alt="">
            </div>
            <div class="list-data-user">
                <p>{{ history.accounts[op.op.value.author].metadata.publicName || op.op.value.author }} <span>{{ dateFromNow(op.timestamp) }}</span></p>
                <p v-if="op.op.value.parent_author != ''">
                    {{ lang.HISTORY.COMMENTED + op.op.value.parent_permlink }}
                </p>
                <p v-else >
                    {{ lang.HISTORY.POSTED + op.op.value.title }}
                </p>
                <p>{{ op.op.value.parent_author != '' ? op.op.value.body : '' }}</p>
            </div>
            <div class="list-amount">
                <p v-if="op.op.value.from == account.name">-</p>
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