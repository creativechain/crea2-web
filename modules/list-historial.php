<div class="boxed boxed--border no-padding">
    <div class="col-md-12">
        <h3 class="title-section-profile title-list-historial" >{{ lang.WALLET.HISTORY }}</h3>
    </div>
    <div class="col-md-12">
        <hr class="mb-0">
    </div>
    <template v-for="op in history.data">
        <div v-if="op.op.type == 'transfer_operation'" class="row-list-user">
            <div class="col-md-12">
                <div class="row">
                    <div class="col-md-8">
                        <div class="row-list-user-display">
                            <div class="user-avatar cursor" v-on:click="showProfile(op.op.value.from)">
                                <avatar v-bind:username="op.op.value.from" v-bind:url="history.accounts[op.op.value.from].metadata.avatar.url"></avatar>
                            </div>
                            <div class="list-data-user">
                                <p>
                                    <username v-bind:user="op.op.value.from" v-bind:name="history.accounts[op.op.value.from].metadata.publicName"></username>
                                    <span>{{ dateFromNow(op.timestamp) }}</span>
                                </p>
                                <p v-if="account && op.op.value.from == account.user.name">
                                    {{ lang.HISTORY.TRANSFER_TO }}
                                    <linkname v-bind:user="op.op.value.to" v-bind:name="history.accounts[op.op.value.to].metadata.publicName"></linkname>
                                </p>
                                <p v-else>
                                    {{ lang.HISTORY.TRANSFER_FROM }}
                                    <linkname v-bind:user="op.op.value.from" v-bind:name="history.accounts[op.op.value.from].metadata.publicName"></linkname>
                                </p>
                                <p>{{ op.op.value.memo || '' }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4 text-right">
                        <div class="list-amount">
                            <p v-if="account && op.op.value.from == account.user.name">-{{ parseAsset(op.op.value.amount) }}</p>
                            <p v-else >+{{ parseAsset(op.op.value.amount) }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="op.op.type == 'transfer_to_savings_operation'" class="row-list-user">
            <div class="col-md-12">
                <div class="row">
                    <div class="col-md-8">
                        <div class="row-list-user-display">
                            <div class="user-avatar cursor" v-on:click="showProfile(op.op.value.from)">
                                <avatar v-bind:username="op.op.value.from" v-bind:url="history.accounts[op.op.value.from].metadata.avatar.url"></avatar>
                            </div>
                            <div class="list-data-user">
                                <p>
                                    <username v-bind:user="op.op.value.from" v-bind:name="history.accounts[op.op.value.from].metadata.publicName"></username>
                                    <span>{{ dateFromNow(op.timestamp) }}</span>
                                </p>
                                <p v-if="account && op.op.value.from == account.user.name">
                                    {{ lang.HISTORY.TRANSFER_SAVINGS_TO }}
                                    <linkname v-bind:user="op.op.value.to" v-bind:name="history.accounts[op.op.value.to].metadata.publicName"></linkname>
                                </p>
                                <p v-else>
                                    {{ lang.HISTORY.TRANSFER_SAVINGS_FROM }}
                                    <linkname v-bind:user="op.op.value.from" v-bind:name="history.accounts[op.op.value.from].metadata.publicName"></linkname>
                                </p>
                                <p>{{ op.op.value.memo || '' }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4 text-right">
                        <div class="list-amount">
                            <p v-if="account && op.op.value.from == account.user.name">-{{ parseAsset(op.op.value.amount) }}</p>
                            <p v-else >+{{ parseAsset(op.op.value.amount) }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else-if="op.op.type == 'transfer_to_vesting_operation'" class="row-list-user">
            <div class="col-md-12">
                <div class="row">
                    <div class="col-md-8">
                        <div class="row-list-user-display">
                            <div class="user-avatar">
                                <a v-bind:href="'/profile.php?profile=' + op.op.value.from">
                                    <avatar v-bind:username="op.op.value.from" v-bind:url="history.accounts[op.op.value.from].metadata.avatar.url"></avatar>
                                </a>
                            </div>
                            <div class="list-data-user">
                                <p>
                                    <username v-bind:user="op.op.value.from" v-bind:name="history.accounts[op.op.value.from].metadata.publicName"></username>
                                    <span>{{ dateFromNow(op.timestamp) }}</span>
                                </p>

                                <p v-if="account && op.op.value.from == account.user.name">
                                    {{ lang.HISTORY.TRANSFER_VESTING_TO }}
                                    <linkname v-bind:user="op.op.value.to" v-bind:name="history.accounts[op.op.value.to].metadata.publicName"></linkname>
                                </p>
                                <p v-else >
                                    {{ lang.HISTORY.TRANSFER_VESTING_FROM }}
                                    <linkname v-bind:user="op.op.value.from" v-bind:name="history.accounts[op.op.value.from].metadata.publicName"></linkname>
                                </p>

                                <p>{{ op.op.value.memo || '' }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4 text-right">
                        <div class="list-amount">
                            <p v-if="account && op.op.value.from == account.user.name">+{{ parseAsset(op.op.value.amount) }}</p>
                            <p v-else >+{{ parseAsset(op.op.value.amount) }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else-if="op.op.type == 'comment_operation'" class="row-list-user">
            <div class="col-md-12">
                <div class="row">
                    <div class="col-md-8">
                        <div class="row-list-user-display">
                            <div class="user-avatar">
                                <a v-bind:href="'/profile.php?profile=' + op.op.value.author">
                                    <avatar v-bind:username="op.op.value.author" v-bind:url="history.accounts[op.op.value.author].metadata.avatar.url"></avatar>
                                </a>
                            </div>
                            <div class="list-data-user">
                                <p>
                                    <username v-bind:user="op.op.value.author" v-bind:name="history.accounts[op.op.value.author].metadata.publicName"></username>
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
                        </div>
                    </div>
                    <div class="col-md-4 text-right">
                        <div class="list-amount">
                            <p v-if="account && op.op.value.from == account.user.name">-</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else-if="op.op.type == 'vote_operation'" class="row-list-user">
            <div class="col-md-12">
                <div class="row">
                    <div class="col-md-8">
                        <div class="row-list-user-display">
                            <div class="user-avatar">
                                <a v-bind:href="'/profile.php?profile=' + op.op.value.voter">
                                    <avatar v-bind:username="op.op.value.voter" v-bind:url="history.accounts[op.op.value.voter].metadata.avatar.url"></avatar>
                                </a>
                            </div>
                            <div class="list-data-user">
                                <p>
                                    <username v-bind:user="op.op.value.voter" v-bind:name="history.accounts[op.op.value.voter].metadata.publicName"></username>
                                    <span>{{ dateFromNow(op.timestamp) }}</span>
                                </p>
                                <p>
                                    {{ lang.HISTORY.VOTED_FOR + op.op.value.permlink }}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4 text-right">
                        <div class="list-amount">
                            <p>{{ (op.op.value.weight * 100 / 10000).toFixed(0) }}%</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else-if="op.op.type == 'producer_reward_operation'" class="row-list-user">
            <div class="user-avatar">
                <a v-bind:href="'/profile.php?profile=' + op.op.value.producer">
                    <avatar v-bind:username="op.op.value.producer" v-bind:url="history.accounts[op.op.value.producer].metadata.avatar.url"></avatar>
                </a>
            </div>
            <div class="list-data-user">
                <p>
                    <username v-bind:user="op.op.value.producer" v-bind:name="history.accounts[op.op.value.producer].metadata.publicName"></username>
                    <span>{{ dateFromNow(op.timestamp) }}</span>
                </p>
                <p>
                    {{ parseAsset(op.op.value.vesting_shares) }} {{ lang.HISTORY.PRODUCED }}
                    <linkname v-bind:user="op.op.value.producer" v-bind:name="history.accounts[op.op.value.producer].metadata.publicName"></linkname>
                </p>
                <p></p>
            </div>
            <div class="list-amount">
                <p>+{{ parseAsset(op.op.value.vesting_shares) }}</p>
            </div>
            <hr>
        </div>
        <div v-else-if="op.op.type == 'account_create_operation'" class="row-list-user">
            <div class="col-md-12">
                <div class="row">
                    <div class="col-md-8">
                        <div class="row-list-user-display">
                            <div class="user-avatar">
                                <a v-bind:href="'/profile.php?profile=' + op.op.value.creator">
                                    <avatar v-bind:username="op.op.value.creator" v-bind:url="history.accounts[op.op.value.creator].metadata.avatar.url"></avatar>
                                </a>
                            </div>
                            <div class="list-data-user">
                                <p>
                                    <username v-bind:user="op.op.value.creator" v-bind:name="history.accounts[op.op.value.creator].metadata.publicName"></username>
                                    <span>{{ dateFromNow(op.timestamp) }}</span>
                                </p>
                                <p>
                                    <linkname v-bind:user="op.op.value.creator" v-bind:name="history.accounts[op.op.value.creator].metadata.publicName"></linkname>
                                    {{ lang.HISTORY.CREATE_ACCOUNT + op.op.value.new_account_name }}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4 text-right">
                        <div class="list-amount">
                            <p>{{ parseAsset(op.op.value.fee) }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </template>
</div>