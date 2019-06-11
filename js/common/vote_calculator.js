"use strict";

/**
 * Created by ander on 7/11/18.
 */
(function () {
    var calculatorContainer;

    function setUpCalculator(session, account, rewardFunds) {
        if (!calculatorContainer) {
            calculatorContainer = new Vue({
                el: '#calculator-container',
                data: {
                    lang: lang,
                    session: session,
                    account: account,
                    rewardFund: rewardFunds,
                    calculator: {
                        vote_worth: '$ ' + Asset.parse('0.000 CBD').toPlainString(),
                        cgy: 10000,
                        voting_energy: 100,
                        vote_weight: 100
                    }

                },
                updated: function() {
                    this.calculate();
                },
                methods: {
                    calculate: function () {
                        var basePrice = Asset.parse(this.account.feed_price.base);
                        var quotePrice = Asset.parse(this.account.feed_price.quote);
                        var tvs = Asset.parse(this.account.props.total_vesting_shares);
                        var tvfs = Asset.parse(this.account.props.total_vesting_fund_crea);
                        var price = basePrice;
                        var rewardBalance = Asset.parse(this.rewardFund.reward_balance);
                        var recentClaims = parseInt(this.rewardFund.recent_claims);

                        var g = (tvs.amount / tvfs.toFloat()) * (rewardBalance.toFloat() / recentClaims) * price.toFloat();

                        console.log(tvs.toFloat(), tvfs.toFloat(), rewardBalance.toFloat(), recentClaims, basePrice.toFloat(), quotePrice.toFloat());
                        var vote = ((this.calculator.voting_energy / 100) / 50) * this.calculator.cgy * (this.calculator.vote_weight / 100) * g;
                        this.calculator.vote_worth = '$ ' + Asset.parse({amount: vote, nai: 'cbd'}).toPlainString();
                        console.log(g, vote, this.calculator.vote_worth);
                    }
                }
            });
        } else {
            calculatorContainer.session = session;
            calculatorContainer.account = account;
            calculatorContainer.rewardFund = rewardFunds;
        }

        creaEvents.emit('crea.dom.ready', 'publish');
        calculatorContainer.calculate();
    }

    function fetchRewardFund(session, account) {
        crea.api.getRewardFunds('post', function (err, result) {
            if (!catchError(err)) {
                setUpCalculator(session, account, result.funds[0]);
            }
        })
    }

    creaEvents.on('crea.session.login', function (session, account) {
        fetchRewardFund(session, account);
    });
    creaEvents.on('crea.session.update', function (session, account) {
        fetchRewardFund(session, account);
    });
})();