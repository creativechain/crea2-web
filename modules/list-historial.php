<div class="boxed boxed--border">
    <div class="col-md-12">
        <h3>{{ lang.WALLET.HISTORY }}</h3>
    </div>
    <template v-for="op in history.data">
        <div v-if="op.op.type == transfer_operation" class="row-list-user">
            <div v-if="op.op.value.from == account.name" class="avatare-list">
                <img v-bind:src="history[op.op.value.from].metadata.avatar || '/img/avatar/avatar1.png'" alt="">
            </div>
            <div class="list-data-user">
                <p>{{ history[op.op.value.from].metadata.publicName || history[op.op.value.from].name }}<span>{{ dateFromNow(op.timestamp) }}</span></p>
                <p>{{ op.op.value.memo || '' }}</p>
            </div>
            <div class="list-amount">
                <p>+1 300 755,2850 CREA </p>
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