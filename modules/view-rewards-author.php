<div class="col-md-12">
    <h3 class="title-section-profile">{{ lang.PROFILE.TITLE_AUTHOR }}</h3>
</div>
<div class="col-md-12">
    <div class="boxed boxed--border box-rewards-autor">
        <div class="row">
            <div class="col">
                <p>{{ lang.PROFILE.TEXT_AUTHOR}}:</p>
            </div>
            <div class="col text-right box-summary">
                <p>+{{ vestsToCgy(rewards.rewardsWeekVests).toFriendlyString() }}</p>
                <p>+{{ parseAsset({amount: rewards.rewardsWeekCBD, nai: 'cbd'}).toFriendlyString() }}</p>
                <p class="blue-summary">+{{ parseAsset({amount: rewards.rewardsWeekCrea, nai: 'crea'}).toFriendlyString() }}</p>
            </div>
        </div>
    </div>
</div>

<div class="col-md-12">
    <h3 class="title-section-profile">{{ lang.PROFILE.TITLE_AUTHOR_HISTORY }}</h3>
</div>

<div class="col-md-12">
    <div class="boxed boxed--border">
        <div class="row">
            <div class="col-md-12">
                <table class="table">
                    <thead class="hidden">
                    <tr>
                        <th scope="col">Last</th>
                        <th scope="col">Handle</th>
                    </tr>
                    </thead>
                    <tbody class="tbody-rewards">
                    <tr v-for="t in rewardsOp">
                        <td>{{ formatTime(t[1].timestamp) }}</td>
                        <td>{{ t[1].op[1].cbd_payout }}, {{ t[1].op[1].crea_payout }} {{ lang.COMMON.AND }} {{ vestsToCgy(t[1].op[1].vesting_payout).toFriendlyString() }} {{ lang.COMMON.FOR }} {{ '@' + t[1].op[1].author + '/' + t[1].op[1].permlink }}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>