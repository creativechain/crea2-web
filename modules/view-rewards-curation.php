<div class="col-md-12">
    <h3 class="title-section-profile">{{ lang.PROFILE.TITLE_CURATION }}</h3>
</div>
<div class="col-md-12">
    <div class="boxed boxed--border box-rewards-autor">
        <div class="row">
            <div class="col">
                <p>{{ lang.PROFILE.TEXT_CURATION }}:</p>
            </div>
            <div class="col text-right box-summary">
                <p class="blue-summary">+{{ vestsToCgy(rewards.totalRewardsVests).toFriendlyString() }}</p>
            </div>
        </div>
    </div>
</div>

<div class="col-md-12">
    <h3 class="title-section-profile">{{ lang.PROFILE.TEXT_CURATION_HISTORY }}</h3>
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
                        <td>{{ vestsToCgy(t[1].op[1].reward).toFriendlyString() }} {{ lang.COMMON.FOR }} {{ '@' + t[1].op[1].comment_author + '/' + t[1].op[1].comment_permlink }}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>