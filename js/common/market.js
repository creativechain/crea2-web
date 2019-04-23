"use strict";
var marketContainer;
var buyTable, buyAllTable, sellTable, sellAllTable, userOrdersTable, marketHistoryTable;
(function () {

    var session, account, chart;

    function setUp() {
        if (!marketContainer) {
            marketContainer = new Vue({
                el: '#market-container',
                data: {
                    lang: lang,
                    session: session,
                    account: account,
                    recentTrades: [],
                    ticker: {
                        latest: "0.000000",
                        lowest_ask: "0.000000",
                        highest_bid: "0.000000",
                        percent_change: "0.000000",
                        crea_volume: "0.000 CREA",
                        cbd_volume: "0.000 CREA"
                    },
                    buyForm: {
                        price: '0.000',
                        amount: '0.000',
                        total: '0.000'
                    },
                    sellForm: {
                        price: '0.000',
                        amount: '0.000',
                        total: '0.000'
                    }
                },
                methods: {
                    parseAsset: Asset.parse,
                    dateFromNow: function (date) {
                        return moment(toLocaleDate(date)).fromNow();
                    },
                    priceFor: function (base, quote) {
                        var assetBase = Asset.parse(base);
                        var assetQuote = Asset.parse(quote);

                        var plainPrice = assetQuote.toFloat() / assetBase.toFloat();
                        return Asset.parse({
                            amount: plainPrice,
                            nai: assetQuote.asset.symbol
                        })
                    },
                    clearOrderForm: function(type) {
                        type = type.toLowerCase();
                        if (type === 'buy') {
                            this.buyForm.price = '0.000';
                            this.buyForm.amount = '0.000';
                            this.buyForm.total = '0.000';
                        } else {
                            this.sellForm.price = '0.000';
                            this.sellForm.amount = '0.000';
                            this.sellForm.total = '0.000';
                        }
                    },
                    onParseBuyForm: function () {
                        this.buyForm.price = Asset.parse({
                            amount: parseFloat(this.buyForm.price) + 0.0001,
                            nai: 'cbd'
                        }).toPlainString();

                        this.buyForm.amount = Asset.parse({
                            amount: parseFloat(this.buyForm.amount) + 0.0001,
                            nai: 'cbd'
                        }).toPlainString();

                        if (!isNaN(this.buyForm.price) && !isNaN(this.buyForm.amount)) {
                            this.buyForm.total = Asset.parse({amount: parseFloat(this.buyForm.price * this.buyForm.amount) + 0.0001, nai: 'cbd'}).toPlainString();
                        } else {
                            this.buyForm.total = Asset.parse({
                                amount: parseFloat(this.buyForm.total) + 0.0001,
                                nai: 'cbd'
                            }).toPlainString();
                        }
                    },
                    inputBuy: function (event, field) {
                        field = field.toLowerCase();
                        var charCode = (event.which) ? event.which : event.keyCode;
                        if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
                            cancelEventPropagation(event);
                            return false;
                        }

                        var value = event.target.value + String.fromCharCode(charCode);
                        console.log(value, field);

                        if (!isNaN(value)) {
                            this.buyForm[field] = Asset.parse({amount: value, nai: 'crea'}).toPlainString();
                            var amount = this.buyForm.amount;
                            switch (field) {
                                case 'price':
                                    //change only total if amount != 0
                                    // total = amount * price
                                    if (amount) {
                                        var t = (amount * value) + 0.0001;
                                        this.buyForm.total = Asset.parse({amount: t, nai: 'cbd'}).toPlainString();
                                    }
                                    break;
                                case 'amount':
                                    //change only total if price != 0
                                    // total = amount * price
                                    var price = this.buyForm.price;
                                    if (price) {
                                        var t = (value * price) + 0.0001;
                                        this.buyForm.total = Asset.parse({amount: t, nai: 'cbd'}).toPlainString();
                                    }
                                    break;
                                default:
                                    //change only price if amount != 0
                                    // price = total / amount
                                    if (amount) {
                                        var p = (value / amount) + 0.0001;
                                        this.buyForm.price = Asset.parse({amount: p, nai: 'cbd'}).toPlainString();
                                    }
                            }
                        }
                        return true;
                    },
                    onParseSellForm: function () {
                        this.sellForm.price = Asset.parse({
                            amount: parseFloat(this.sellForm.price) + 0.0001,
                            nai: 'cbd'
                        }).toPlainString();

                        this.sellForm.amount = Asset.parse({
                            amount: parseFloat(this.sellForm.amount) + 0.0001,
                            nai: 'cbd'
                        }).toPlainString();

                        if (!isNaN(this.sellForm.price) && !isNaN(this.sellForm.amount)) {
                            this.sellForm.total = Asset.parse({amount: parseFloat(this.sellForm.price * this.sellForm.amount) + 0.0001, nai: 'cbd'}).toPlainString();
                        } else {
                            this.sellForm.total = Asset.parse({
                                amount: parseFloat(this.sellForm.total) + 0.0001,
                                nai: 'cbd'
                            }).toPlainString();
                        }
                    },
                    inputSell: function (event, field) {
                        field = field.toLowerCase();
                        var charCode = (event.which) ? event.which : event.keyCode;
                        if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
                            cancelEventPropagation(event);
                            return false;
                        }

                        var value = event.target.value + String.fromCharCode(charCode);
                        console.log(value, field);

                        if (!isNaN(value)) {
                            this.sellForm[field] = Asset.parse({amount: value, nai: 'crea'}).toPlainString();
                            var amount = this.sellForm.amount;
                            switch (field) {
                                case 'price':
                                    //change only total if amount != 0
                                    // total = amount * price
                                    if (amount) {
                                        var t = (amount * value) + 0.0001;
                                        this.sellForm.total = Asset.parse({amount: t, nai: 'cbd'}).toPlainString();
                                    }
                                    break;
                                case 'amount':
                                    //change only total if price != 0
                                    // total = amount * price
                                    var price = this.sellForm.price;
                                    if (price) {
                                        var t = (value * price) + 0.0001;
                                        this.sellForm.total = Asset.parse({amount: t, nai: 'cbd'}).toPlainString();
                                    }
                                    break;
                                default:
                                    //change only price if amount != 0
                                    // price = total / amount
                                    if (amount) {
                                        var p = (value / amount) + 0.0001;
                                        this.sellForm.price = Asset.parse({amount: p, nai: 'cbd'}).toPlainString();
                                    }
                            }
                        }
                        return true;
                    },
                    makeOrder: function (type) {
                        type = type.toLowerCase();
                        var that = this;
                        var username = session ? session.account.username : null;
                        requireRoleKey(username, 'active', function (activeKey, username) {
                            var amountToSell, minToReceive, expiration, orderId;

                            var now = new Date();
                            expiration = new Date(now.getTime() + (60 * 60 * 24 * 27 * 1000)); //28 days
                            orderId = randomNumber(0, 0xFFFFFFFF); //MAX uint32_t

                            if (type === 'buy') {
                                //Buy CREA - Sell CBD
                                amountToSell = that.buyForm.total + ' CBD';
                                minToReceive = that.buyForm.amount + ' CREA';
                            } else if (type === 'sell') {
                                //Sell CREA - Buy CBD
                                amountToSell = that.sellForm.amount + ' CREA';
                                minToReceive = that.sellForm.total + ' CBD';
                            }

                            crea.broadcast.limitOrderCreate(activeKey, username, orderId, amountToSell, minToReceive, false, expiration, function (err, result) {
                                if (!catchError(err)) {
                                    that.clearOrderForm(type);
                                    fetchOpenOrders(session);
                                }
                            })
                        });


                    }
                }
            })
        }
    }

    function prepareFormOrder(order, type) {
        type = type.toLowerCase();

        if (type === 'buy') {
            marketContainer.buyForm.price = order.price;
            marketContainer.buyForm.amount = order.crea;
        }
    }
    function fetchOpenOrders(session) {

        if (session) {
            crea.api.getOpenOrders(session.account.username, function (err, result) {
                if (!catchError(err)) {

                    var parseOpenOrder = function (order) {
                        var priceBase = Asset.parse(order.sell_price.base);
                        var priceQuote = Asset.parse(order.sell_price.quote);
                        var type = priceBase.asset.symbol === 'CREA' ? 'Buy' : 'Sell';

                        return {
                            date: order.created,
                            type: type,
                            price: Asset.parse({
                                amount: (type === 'Buy' ? priceQuote.toFloat() / priceBase.toFloat() : priceBase.toFloat() / priceQuote.toFloat()) + 0.0001,
                                nai: 'cbd'
                            }).toPlainString(),
                            crea: type === 'Buy' ? Asset.parse({amount: order.for_sale, nai: 'crea'}).toPlainString() : priceQuote.toPlainString(),
                            cbd: type === 'Buy' ? priceQuote.toPlainString() : Asset.parse({amount: order.for_sale, nai: 'cbd'}).toPlainString(),
                            action: 'button'
                        };
                    };

                    var userOrders = [];

                    result.forEach(function (o) {
                        userOrders.push(parseOpenOrder(o));
                    });

                    userOrders.sort(function (a, b) {
                        return new Date(b.date).getTime() - new Date(a.date).getTime();
                    });

                    console.log(userOrders);
                    userOrdersTable.rows.add(userOrders).draw();
                }
            })
        }
    }

    function fetchTicker() {
        crea.api.getTicker(function (err, result) {
            if (!err) {
                result.latest = Asset.parse({amount: result.latest, nai: 'cbd', precision: 6}).toPlainString();
                result.lowest_ask = Asset.parse({amount: result.lowest_ask, nai: 'cbd', precision: 6}).toPlainString();
                result.highest_bid = Asset.parse({amount: result.highest_bid, nai: 'cbd', precision: 6}).toPlainString();
                result.percent_change = parseFloat(result.percent_change).toFixed(3);

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
                var asks = []; //Offer CREA - Demand CBD
                var bids = []; //Demand CREA - Offer CBD

                var parseOrder = function(order) {
                    return {
                        price: order.order_price,
                        crea: order.crea,
                        cbd: order.cbd,
                        total_cbd: order.total_cbd
                    };
                };

                var accumulativeAsk = 0;
                var accumulativeBid = 0;
                result.bids.forEach(function (ask, index) {
                    ask.order_price = Asset.parse({
                        amount: ask.real_price,
                        nai: 'cbd',
                        precision: 6
                    }).toPlainString();

                    ask.crea = Asset.parse({amount: ask.crea, nai: 'crea'}).toPlainString();
                    ask.cbd = Asset.parse({amount: ask.cbd, nai: 'cbd'}).toPlainString();

                    accumulativeAsk += parseFloat(ask.cbd);
                    ask.total_cbd = Asset.parse({amount: accumulativeAsk, nai: 'cbd'}).toPlainString();

                    asks.push(parseOrder(ask));
                });

                //Order ask by price ASC
                asks.sort(function (a, b) {
                    return b.price - a.price;
                });

                buyTable.rows.add(asks).draw();
                buyAllTable.rows.add(asks).draw();

                result.asks.forEach(function (bid, index) {
                    bid.order_price = Asset.parse({
                        amount: bid.real_price,
                        nai: 'cbd',
                        precision: 6
                    }).toPlainString();

                    bid.crea = Asset.parse({amount: bid.crea, nai: 'crea'}).toPlainString();
                    bid.cbd = Asset.parse({amount: bid.cbd, nai: 'cbd'}).toPlainString();

                    accumulativeBid += parseFloat(bid.cbd);
                    bid.total_cbd = Asset.parse({amount: accumulativeBid, nai: 'cbd'}).toPlainString();

                    bids.push(parseOrder(bid));
                    //sellTable.row.add(bid).draw();
                });

                //Order sell by price ASC
                bids.sort(function (a, b) {
                    return a.price - b.price;
                });

                sellTable.rows.add(bids).draw();
                sellAllTable.rows.add(bids).draw();

            }
        })
    }

    function loadRecentTrades() {
        crea.api.getRecentTrades(100, function (err, result) {
            if (!err) {
                var trades = [];

                //Order by date DESC
                result.trades.sort(function (a, b) {
                    return new Date(b.date).getTime() - new Date(a.date).getTime();
                });

                result.trades.forEach(function (t) {
                    t.date = moment(toLocaleDate(t.date)).fromNow();
                    var currentPays = Asset.parse(t.current_pays);
                    var openPays = Asset.parse(t.open_pays);

                    t.current_pays = currentPays.toPlainString();
                    t.open_pays = openPays.toPlainString();

                    t.cbd = currentPays.asset.symbol === 'CBD' ? t.current_pays : t.open_pays;
                    t.crea = currentPays.asset.symbol === 'CBD' ? t.open_pays : t.current_pays;
                    t.type = currentPays.asset.symbol === 'CBD' ? 'buy' : 'sell';

                    //Show price in CBD
                    t.price = Asset.parse({
                        amount: currentPays.asset.symbol === 'CBD' ? (t.current_pays / t.open_pays) : (t.open_pays / t.current_pays),
                        nai: 'cbd',
                        precision: 6
                    }).toPlainString();

                    trades.push(t);
                });

                //marketContainer.recentTrades = trades;
                //marketContainer.$forceUpdate();
                marketHistoryTable.rows.add(trades).draw();
            } else {
                console.error('Error getting recent trades', err);
            }
        })
    }

    function fetchDataToChart() {
        var now = moment().format('YYYY-MM-DD[T]H:mm:ss');
        var yesterday = moment().subtract(7, 'days').format('YYYY-MM-DD[T]H:mm:ss');

        crea.api.getMarketHistory(86400, yesterday, now, function (err, result) {
            if (!err) {
                var buckets = [];
                result.buckets.forEach(function (b) {
                    b.t = new Date(b.open);
                    b.o = Asset.parse({amount: b.non_crea.open, nai: 'cbd'}).toFloat();
                    b.h = Asset.parse({amount: b.non_crea.high, nai: 'cbd'}).toFloat();
                    b.l = Asset.parse({amount: b.non_crea.low, nai: 'cbd'}).toFloat();
                    b.c = Asset.parse({amount: b.non_crea.close, nai: 'cbd'}).toFloat();

                });
                setUpChart(result.buckets);
            } else {
                console.error('Fail getting chart data', err)
            }
        });
    }

    function refreshData(interval) {
        var refresh = function () {
            fetchTicker();
            fetchOpenOrders(session);
            loadOrderBook();
            loadRecentTrades();
            fetchDataToChart();
        };

        if (interval) {
            setInterval(function () {
                refresh();
            }, interval);
        } else {
            refresh();
        }

    }

    function setUpChart(data) {
        if (!chart) {
            //Build
            var ctx = document.getElementById('market-chart').getContext('2d');
            chart = new Chart(ctx, {
                type: 'candlestick',
                data: {
                    datasets: [{
                        data: data
                    }]
                }
            })
        } else {
            //Update
            chart.config.data.datasets[0] = data;
            chart.update();
        }
    }

    function setUpTables() {
        buyTable = $('#buy-orders').DataTable({
            bFilter: false,
            bInfo: false,
            /*lengthChange: false,*/
            aoColumnDefs : [ {
                orderable : false,
                aTargets : ['_all']
            }],
            order: [],
            scrollY:        "250px",
            scrollCollapse: true,
            paging:         false,
            columns: [
                {data: 'price', className: 'color-buy'},
                {data: 'crea'},
                {data: 'cbd'},
                {data: 'total_cbd'}
            ]
        });

        buyAllTable = $('#buy-orders-all').DataTable({
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
            "paging":         false,
            columns: [
                {data: 'price', className: 'color-buy'},
                {data: 'crea'},
                {data: 'cbd'},
                {data: 'total_cbd'}
            ]
        });

        sellTable = $('#sell-orders').DataTable({
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
            "paging":         false,
            columns: [
                {data: 'price', className: 'color-sell'},
                {data: 'crea'},
                {data: 'cbd'},
                {data: 'total_cbd'}
            ]
        });

        sellAllTable = $('#sell-all-orders').DataTable({
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
            "paging":         false,
            columns: [
                {data: 'price', className: 'color-sell'},
                {data: 'crea'},
                {data: 'cbd'},
                {data: 'total_cbd'}
            ]
        });

        userOrdersTable = $('#user-orders').DataTable({
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
            "paging":         false,
            columns: [
                {data: 'date'},
                {data: 'type'},
                {data: 'price'},
                {data: 'crea'},
                {data: 'cbd'},
                {data: 'action'}
            ]
        });

        marketHistoryTable = $('#market-history').DataTable({
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
            "paging":         false,
            columns: [
                {data: 'date'},
                {data: 'price'},
                {data: 'crea'},
                {data: 'cbd'}
            ]
        });
    }

    creaEvents.on('crea.session.login', function (s, a) {
        creaEvents.emit('crea.dom.ready');
        session = s;
        account = a;
        setUp();
        setTimeout(function () {
            console.log('session started');

            setUpTables();
            refreshData()
        }, 500)


    });
})();