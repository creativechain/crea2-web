"use strict";

(function () {
    var marketContainer;

    function setUp(session, account) {
        if (!marketContainer) {
            marketContainer = new Vue({
                el: '#market-container',
                data: {
                    lang: lang,
                    session: session,
                    account: account,
                    orderBook : {
                        bids: [],
                        asks: []
                    },
                    recentTrades: [],
                    ticker: {
                        latest: 0.00000000000000000,
                        lowest_ask: 0.00000000000000000,
                        highest_bid: 0.00000000000000000,
                        percent_change: 0.00000000000000000,
                        crea_volume: "0.000 CREA",
                        cbd_volume: "0.000 CREA"
                    }
                },
                methods: {
                    parseAsset: Asset.parse
                }
            })
        }
    }

    function fetchTicker() {
        crea.api.getTicker(function (err, result) {
            if (!err) {
                result.crea_volume = Asset.parse(result.crea_volume);
                result.cbd_volume = Asset.parse(result.cbd_volume);
                marketContainer.ticker = result;
                marketContainer.$forceUpdate();
            } else {
                console.error('Error getting ticker', err);
            }
        })
    }

    function loadOrderBook () {
        crea.api.getOrderBook(100, function (err, result) {
            if (!catchError(err)) {
                //parse order book
                marketContainer.orderBook = result;
                marketContainer.$forceUpdate();
            }
        })
    }

    function loadRecentTrades() {
        crea.api.getRecentTrades(100, function (err, result) {
            if (!err) {
                marketContainer.recentTrandes = result.trades;
                marketContainer.$forceUpdate();
            } else {
                console.error('Error getting recent trades', err);
            }
        })
    }

    function refreshData() {
        setInterval(function () {
            fetchTicker();
            loadOrderBook();
            loadRecentTrades();
        }, 3000);
    }

    creaEvents.on('crea.session.login', function (s, a) {
        setUp(s, a);
        fetchTicker();
        loadOrderBook();
        loadRecentTrades();
        //refreshData();
        creaEvents.emit('crea.dom.ready');
    });
})();