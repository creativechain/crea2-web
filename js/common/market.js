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
                var asks = [];
                var bids = [];
                result.asks.forEach(function (aks) {
                    var base = Asset.parse(aks.order_price.base);
                    var quote = Asset.parse(aks.order_price.quote);
                    ask.order_price = Asset.parse({amount: base.toFloat() / quote.toFloat(), nai: quote.asset.symbol}).toFloat();

                    ask.crea = Asset.parse({amount: ask.crea, nai: 'crea'}).toFloat();
                    ask.cbd = Asset.parse({amount: ask.cbd, nai: 'cbd'}).toFloat();

                    asks.push(asks);
                });

                result.bids.forEach(function (bid) {
                    var base = Asset.parse(bid.order_price.base);
                    var quote = Asset.parse(bid.order_price.quote);
                    bid.order_price = Asset.parse({amount: base.toFloat() / quote.toFloat(), nai: quote.asset.symbol}).toFloat();

                    bid.crea = Asset.parse({amount: bid.crea, nai: 'crea'}).toFloat();
                    bid.cbd = Asset.parse({amount: bid.cbd, nai: 'cbd'}).toFloat();

                    bids.push(bid);
                });
                marketContainer.orderBook = {asks: asks, bids: bids};
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

    creaEvents.on('crea.dom.ready', function () {

        $('#buy_left_result_all').DataTable({
            bFilter: false,
            bInfo: false,
            "lengthChange": false,
            aoColumnDefs : [ {
                orderable : false,
                aTargets : ['_all']
            }],
            order: [],
            "scrollY":        "250px",
            "scrollCollapse": true,
            "paging":         false
        });
        $('#sell_left_result_all').DataTable({
            bFilter: false,
            bInfo: false,
            "lengthChange": false,
            aoColumnDefs : [ {
                orderable : false,
                aTargets : ['_all']
            }],
            order: [],
            "scrollY":        "250px",
            "scrollCollapse": true,
            "paging":         false
        });
        $('#buy-left_all').DataTable({
            bFilter: false,
            bInfo: false,
            "lengthChange": false,
            aoColumnDefs : [ {
                orderable : false,
                aTargets : ['_all']
            }],
            order: [],
            "paging":         false
        });

        $('#buy-left').DataTable({
            bFilter: false,
            bInfo: false,
            "lengthChange": false,
            aoColumnDefs : [ {
                orderable : false,
                aTargets : ['_all']
            }],
            order: [],
            "paging":false,
            "bAutoWidth": false,
            "aoColumns" : [
                { sWidth: '25%' },
                { sWidth: '25%' },
                { sWidth: '25%' },
                { sWidth: '25%' }
            ]
        });
        $('#buy_left_result').DataTable({
            bFilter: false,
            bInfo: false,
            "lengthChange": false,
            aoColumnDefs : [ {
                orderable : false,
                aTargets : ['_all']
            }],
            order: [],
            "scrollY":        "400px",
            "scrollCollapse": true,
            "paging":         false
        });
        $('#sell-left').DataTable({
            bFilter: false,
            bInfo: false,
            "lengthChange": false,
            aoColumnDefs : [ {
                orderable : false,
                aTargets : ['_all']
            }],
            order: [],
            "paging":         false
        });
        $('#sell_left_result').DataTable({
            bFilter: false,
            bInfo: false,
            "lengthChange": false,
            aoColumnDefs : [ {
                orderable : false,
                aTargets : ['_all']
            }],
            order: [],
            "scrollY":        "400px",
            "scrollCollapse": true,
            "paging":         false
        });


        $('#example1').DataTable({
            bFilter: false,
            bInfo: false,
            "lengthChange": false,
            aoColumnDefs : [ {
                orderable : false,
                aTargets : ['_all']
            }],
            order: [],
            "scrollY":        "534px",
            "scrollCollapse": true,
            "paging":         false
        });
        $('#example2').DataTable({
            bFilter: false,
            bInfo: false,
            "lengthChange": false,
            aoColumnDefs : [ {
                orderable : false,
                aTargets : ['_all']
            }],
            order: [],
            "scrollY":        "200px",
            "scrollCollapse": true,
            "paging":         false
        });
    })

    creaEvents.on('crea.session.login', function (s, a) {
        setUp(s, a);
        fetchTicker();
        loadOrderBook();
        loadRecentTrades();
        //refreshData();
        creaEvents.emit('crea.dom.ready');
    });
})();