"use strict";

/**
 * Created by ander on 7/11/18.
 */
(function () {
    var calculatorContainer;

    function setUpCalculator(session, account, state, rewardFunds) {
        if (!calculatorContainer) {
            calculatorContainer = new Vue({
                el: '#calculator-container',
                data: {
                    lang: lang,
                    session: session,
                    state: state,
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
                        var basePrice = assetToFloat(this.state.feed_price.base);
                        var quotePrice = assetToFloat(this.state.feed_price.quote);
                        var tvs = assetToFloat(this.state.props.total_vesting_shares);
                        var tvfs = assetToFloat(this.state.props.total_vesting_fund_steem);
                        var price = basePrice;
                        var rewardBalance = assetToFloat(this.rewardFund.reward_balance);
                        var recentClaims = parseInt(this.rewardFund.recent_claims);

                        var g = (tvs / tvfs) * (rewardBalance / recentClaims) * price;

                        console.log(tvs, tvfs, rewardBalance, recentClaims, basePrice, quotePrice);
                        var vote = ((this.calculator.voting_energy / 100) / 50) * this.calculator.cgy * (this.calculator.vote_weight / 100) * g;
                        this.calculator.vote_worth = '$ ' + Asset.parse({amount: vote, nai: 'cbd'}).toPlainString();
                        console.log(g, vote, this.calculator.vote_worth);
                    }
                }
            });
        } else {
            calculatorContainer.session = session;
            calculatorContainer.state = state;
            calculatorContainer.account = account;
            calculatorContainer.rewardFund = rewardFunds;
        }

        creaEvents.emit('crea.dom.ready', 'publish');
        calculatorContainer.calculate();
    }

    function fetchRewardFund(session, account, state) {
        steem.api.getRewardFund('post', function (err, result) {
            if (!catchError(err)) {
                setUpCalculator(session, account, state, result);
            }
        })
    }

    creaEvents.on('crea.session.login', function (session, account) {
        steem.config.set('address_prefix', 'STEEM');
        steem.config.set('chain_id', apiOptions.chainId);

        steem.api.getState('/hot', function (err, result) {
            if (!catchError(err)) {
                fetchRewardFund(session, account, result);
            }
        })

    });
    creaEvents.on('crea.session.update', function (session, account) {
        fetchRewardFund(session, account);
    });

    function assetToFloat(asset) {
        if (typeof asset === 'object') {
            return asset.amount / (Math.pow(10, asset.precision));
        }

        return parseFloat(asset.split(' ')[0]);
    }
})();