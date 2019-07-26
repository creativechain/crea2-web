"use strict";

(function () {

    var marketContainer;
    var tablesInitiated, buyTable, buyAllTable, sellTable, sellAllTable, userOrdersTable, marketHistoryTable;
    var chart;

    var session = null;
    var account = null;

    var socket = new RpcWsClient('wss://nodes.creary.net');
    socket.connect();

    socket.on('ws.message', function (data, id) {
        console.log('WS MSG', data, id);
    });

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
                        penultimate: null,
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
                            amount: this.buyForm.price ? parseFloat(this.buyForm.price) + 0.0001 : '0.000',
                            nai: 'cbd'
                        }).toPlainString();

                        this.buyForm.amount = Asset.parse({
                            amount: this.buyForm.amount ? parseFloat(this.buyForm.amount) + 0.0001 : '0.000',
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

                        var value = event.target.value;
                        var formValue = Asset.parse({amount: value, nai: 'crea', exponent: 3}).toPlainString();

                        //console.log(formValue, field);
                        if (!isNaN(value) || !isNaN(formValue)) {

                            var amount = this.buyForm.amount;
                            switch (field) {
                                case 'price':
                                    //change only total if amount != 0
                                    // total = amount * price
                                    if (amount) {
                                        var t = (amount * formValue).toString();
                                        this.buyForm.total = Asset.parse({amount: t, nai: 'cbd', exponent: 3}).toPlainString();
                                    }
                                    break;
                                case 'amount':
                                    //change only total if price != 0
                                    // total = amount * price
                                    var price = this.buyForm.price;
                                    if (price) {
                                        var t = (formValue * price).toString();
                                        this.buyForm.total = Asset.parse({amount: t, nai: 'cbd', exponent: 3}).toPlainString();
                                    }
                                    break;
                                default:
                                    //change only price if amount != 0
                                    // price = total / amount
                                    if (amount) {
                                        var p = (formValue / amount).toString();
                                        this.buyForm.price = Asset.parse({amount: p, nai: 'cbd', exponent: 3}).toPlainString();
                                    }
                            }

                        }

                        return true;
                    },
                    onParseSellForm: function () {
                        this.sellForm.price = Asset.parse({
                            amount: this.sellForm.price ? parseFloat(this.sellForm.price) + 0.0001 : '0.000',
                            nai: 'cbd'
                        }).toPlainString();

                        this.sellForm.amount = Asset.parse({
                            amount: this.sellForm.amount ? parseFloat(this.sellForm.amount) + 0.0001 : '0.000',
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

                        var value = event.target.value;
                        var formValue = Asset.parse({amount: value, nai: 'crea', exponent: 3}).toPlainString();

                        //console.log(formValue, field);
                        if (!isNaN(value) || !isNaN(formValue)) {

                            var amount = this.sellForm.amount;
                            switch (field) {
                                case 'price':
                                    //change only total if amount != 0
                                    // total = amount * price
                                    if (amount) {
                                        var t = (amount * value).toString();
                                        this.sellForm.total = Asset.parse({amount: t, nai: 'cbd', exponent: 3}).toPlainString();
                                    }
                                    break;
                                case 'amount':
                                    //change only total if price != 0
                                    // total = amount * price
                                    var price = this.sellForm.price;
                                    if (price) {
                                        var t = (value * price).toString();
                                        this.sellForm.total = Asset.parse({amount: t, nai: 'cbd', exponent: 3}).toPlainString();
                                    }
                                    break;
                                default:
                                    //change only price if amount != 0
                                    // price = total / amount
                                    if (amount) {
                                        var p = (value / amount).toString();
                                        this.sellForm.price = Asset.parse({amount: p, nai: 'cbd', exponent: 3}).toPlainString();
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
                                    fetchOpenOrders();
                                    updateUserSession();
                                }
                            })
                        });


                    }
                }
            })
        } else {
            //Update session and account
            marketContainer.session = session;
            marketContainer.account = account;
            marketContainer.$forceUpdate();
        }
    }

    function prepareFormOrder(order, formType) {
        formType = formType.toLowerCase();

        if (formType === 'buy') {
            marketContainer.buyForm.price = order.price;
            marketContainer.buyForm.amount = order.crea;
            marketContainer.onParseBuyForm();
        } else {
            marketContainer.sellForm.price = order.price;
            marketContainer.sellForm.amount = order.crea;
            marketContainer.onParseSellForm();
        }
    }

    function cancelOrder(orderId) {
        requireRoleKey(session.account.username, 'active', function (activeKey) {
            crea.broadcast.limitOrderCancel(activeKey, session.account.username, orderId, function (err, result) {
                if (!catchError(err)) {
                    fetchOpenOrders();
                    updateUserSession();
                }
            })
        });

    }

    function fetchOpenOrders() {

        if (session) {
            var data = {
                method: 'condenser_api.get_open_orders',
                params: [session.account.username]
            };

            socket.send(data, function (err, result) {
                if (!catchError(err)) {

                    var parseOpenOrder = function (order) {
                        var priceBase = Asset.parse(order.sell_price.base);
                        var priceQuote = Asset.parse(order.sell_price.quote);
                        var type = priceBase.asset.symbol === 'CREA' ? 'Sell' : 'Buy';

                        return {
                            date: moment(order.created).format('MMM DD, YYYY H:mm:ss'),
                            expiration: moment(order.expiration).format('MMM DD, YYYY H:mm:ss'),
                            type: type,
                            price: '$' + Asset.parse({
                                amount: (type === 'Buy' ? priceBase.toFloat() / priceQuote.toFloat() : priceQuote.toFloat() / priceBase.toFloat()) + 0.0001,
                                nai: 'cbd'
                            }).toPlainString(),
                            crea: type === 'Buy' ? priceQuote.toFriendlyString() : Asset.parse({amount: order.for_sale, nai: 'crea'}).toFriendlyString(),
                            cbd: type === 'Buy' ? Asset.parse({amount: order.for_sale, nai: 'cbd'}).toFriendlyString() : priceQuote.toFriendlyString(),
                            action: 'button',
                            orderid: order.orderid
                        };
                    };

                    var userOrders = [];

                    result.forEach(function (o) {
                        userOrders.push(parseOpenOrder(o));
                    });

                    userOrders.sort(function (a, b) {
                        return new Date(b.date).getTime() - new Date(a.date).getTime();
                    });

                    userOrdersTable.clear();
                    userOrdersTable.rows.add(userOrders).draw();
                }
            });
        }
    }

    function fetchTicker() {
        var data = {
            method: 'market_history_api.get_ticker',
            params: {}
        };

        socket.send(data, function (err, result) {
            if (!err) {

                result.latest = Asset.parse({amount: result.latest, nai: 'cbd', exponent: 6}).toPlainString();
                result.lowest_ask = Asset.parse({amount: result.lowest_ask, nai: 'cbd', exponent: 6}).toPlainString();
                result.highest_bid = Asset.parse({amount: result.highest_bid, nai: 'cbd', exponent: 6}).toPlainString();
                result.percent_change = parseFloat(result.percent_change).toFixed(3);
                result.penultimate = marketContainer.ticker.penultimate;

                if (marketContainer.ticker.latest !== result.latest) {
                    result.penultimate = marketContainer.ticker.latest;
                }

                marketContainer.ticker = result;
                marketContainer.$forceUpdate();
            } else {
                console.error('Error getting ticker', err);
            }
        });
    }

    function loadOrderBook () {
        var data = {
            method: 'condenser_api.get_order_book',
            params: [100]
        };

        socket.send(data, function (err, result) {
            if (!catchError(err)) {
                //parse order book
                var asks = []; //Offer CREA - Demand CBD
                var bids = []; //Demand CREA - Offer CBD
                var asksData = mixToArray(buyTable.rows().data());
                var bidsData = mixToArray(sellTable.rows().data());

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
                        exponent: 6
                    }).toPlainString();

                    ask.crea = Asset.parse({amount: ask.crea, nai: 'crea'}).toPlainString();
                    ask.cbd = Asset.parse({amount: ask.cbd, nai: 'cbd'}).toPlainString();

                    accumulativeAsk += parseFloat(ask.cbd);
                    ask.total_cbd = Asset.parse({amount: accumulativeAsk, nai: 'cbd'}).toPlainString();

                    asks.push(parseOrder(ask));
                });

                //Order ask by price DESC
                asks.sort(function (a, b) {
                    return b.price - a.price;
                });

                if (!isEqual(asksData, asks)) {
                    buyTable.clear();
                    buyAllTable.clear();
                    buyTable.rows.add(asks).draw();
                    buyAllTable.rows.add(asks).draw();
                }

                result.asks.forEach(function (bid, index) {
                    bid.order_price = Asset.parse({
                        amount: bid.real_price,
                        nai: 'cbd',
                        exponent: 6
                    }).toPlainString();

                    bid.crea = Asset.parse({amount: bid.crea, nai: 'crea'}).toPlainString();
                    bid.cbd = Asset.parse({amount: bid.cbd, nai: 'cbd'}).toPlainString();

                    accumulativeBid += parseFloat(bid.cbd);
                    bid.total_cbd = Asset.parse({amount: accumulativeBid, nai: 'cbd'}).toPlainString();

                    bids.push(parseOrder(bid));
                    //sellTable.row.add(bid).draw();
                });

                //Order sell by price DESC
                bids.sort(function (a, b) {
                    return b.price - a.price;
                });

                if (!isEqual(bidsData, bids)) {
                    sellTable.clear();
                    sellAllTable.clear();
                    sellTable.rows.add(bids).draw();
                    sellAllTable.rows.add(bids).draw();

                    //Set scroll to bottom
                    var sellTableScroll = $(sellTable.table().node()).parent();
                    sellTableScroll.scrollTop(sellTableScroll.get(0).scrollHeight);

                    var sellAllTableScroll = $(sellAllTable.table().node()).parent();
                    sellAllTableScroll.scrollTop(sellAllTableScroll.get(0).scrollHeight);
                }
            }
        });
    }

    function updateLatestPrices(buyPrice, sellPrice) {
        if (buyPrice) {
            $('[buy-last-price]').html(buyPrice);
        }

        if (sellPrice) {
            $('[sell-last-price]').html(sellPrice);
        }

    }
    function loadRecentTrades() {
        var data = {
            method: 'market_history_api.get_recent_trades',
            params: {
                limit: 100
            }
        };

        socket.send(data, function (err, result) {
            if (!err) {
                var trades = [];

                var buyLastPrice, sellLastPrice;
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
                        exponent: 6
                    }).toPlainString();

                    trades.push(t);

                    if (t.type === 'sell' && !buyLastPrice) {
                        buyLastPrice = t.price;
                    }

                    if (t.type === 'buy' && !sellLastPrice) {
                        sellLastPrice = t.price;
                    }
                });

                //marketContainer.recentTrades = trades;
                //marketContainer.$forceUpdate();

                var lastTrades = mixToArray(marketHistoryTable.rows().data());
                if (!isEqual(lastTrades, trades)) {
                    marketHistoryTable.clear();
                    marketHistoryTable.rows.add(trades).draw();
                }

                //Update latest prices
                updateLatestPrices(buyLastPrice, sellLastPrice);
            } else {
                console.error('Error getting recent trades', err);
            }
        })
    }

    function fetchDataToChart() {
        var data = {
            method: 'market_history_api.get_market_history',
            params: {
                bucket_seconds: 86400, //15, 30, 60, 3600, 86400
                end: moment().format('YYYY-MM-DD[T]H:mm:ss'),
                start: '2019-02-19T00:00:00'
            }
        };

        socket.send(data, function (err, result) {
            if (!err) {
                var buckets = [];
                result.buckets.forEach(function (b) {
                    var buck = {
                        date: moment(b.open).format('DD-MM-YYYY H:mm'),
                        open: Asset.parse({amount: b.non_crea.open, nai: 'cbd'}).toFloat(),
                        high: Asset.parse({amount: b.non_crea.high, nai: 'cbd'}).toFloat(),
                        low: Asset.parse({amount: b.non_crea.low, nai: 'cbd'}).toFloat(),
                        close: Asset.parse({amount: b.non_crea.close, nai: 'cbd'}).toFloat()
                    };

                    buckets.push(buck)

                });

                //Update only detected new data
                if (!isEqual(chart ? chart.data : [], buckets)) {
                    setUpChart(buckets);
                }

            } else {
                console.error('Fail getting chart data', err)
            }
        });
    }

    function refreshData(interval, inmediate) {

        var refresh = function () {
            fetchTicker();
            fetchOpenOrders();
            loadOrderBook();
            loadRecentTrades();
            fetchDataToChart();
        };

        if (inmediate || inmediate === undefined) {
            refresh();
        }

        if (interval) {
            setInterval(function () {
                refresh();
            }, interval);
        }

    }

    function setUpChart(data) {
        if (!chart) {
            // Themes begin
            am4core.useTheme(am4themes_animated);
// Themes end

            chart = am4core.create("market-chart", am4charts.XYChart);
            chart.paddingRight = 20;

            chart.dateFormatter.inputDateFormat = "dd-MM-yyyy HH:mm";

            var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
            dateAxis.renderer.grid.template.location = 0;

            var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
            valueAxis.tooltip.disabled = true;

            var series = chart.series.push(new am4charts.CandlestickSeries());
            series.dataFields.dateX = "date";
            series.dataFields.valueY = "close";
            series.dataFields.openValueY = "open";
            series.dataFields.lowValueY = "low";
            series.dataFields.highValueY = "high";
            series.simplifiedProcessing = true;
            series.tooltipText = "" +
                "Open: ${openValueY.value}\n" +
                "Low: ${lowValueY.value}\n" +
                "High: ${highValueY.value}\n" +
                "Close: ${valueY.value}";

            //Change Candlestick colors
            series.riseFromOpenState.properties.fill = am4core.color('#25D77C');
            series.dropFromOpenState.properties.fill = am4core.color('#ff5766');
            series.riseFromOpenState.properties.stroke = am4core.color('#25D77C');
            series.dropFromOpenState.properties.stroke = am4core.color('#ff5766');

            chart.cursor = new am4charts.XYCursor();

// a separate series for scrollbar
            var lineSeries = chart.series.push(new am4charts.LineSeries());
            lineSeries.dataFields.dateX = "date";
            lineSeries.dataFields.valueY = "close";
// need to set on default state, as initially series is "show"
            lineSeries.defaultState.properties.visible = false;

// hide from legend too (in case there is one)
            lineSeries.hiddenInLegend = true;
            lineSeries.fillOpacity = 0.5;
            lineSeries.strokeOpacity = 0.5;

            var scrollbarX = new am4charts.XYChartScrollbar();
            scrollbarX.series.push(lineSeries);
            chart.scrollbarX = scrollbarX;

        }

        chart.data = data;
    }

    function setUpTables() {
        if (!tablesInitiated) {
            tablesInitiated = true;

            $.fn.dataTable.render.ellipsis = function () {
                return function (data, type, row) {
                    return type === 'display' && data.length > 10 ?
                        data.substr( 0, 10 ) +'…' :
                        data;
                }
            };

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
                    {data: 'price', className: 'color-buy', render: $.fn.dataTable.render.ellipsis() },
                    {data: 'crea', render: $.fn.dataTable.render.ellipsis() },
                    {data: 'cbd', render: $.fn.dataTable.render.ellipsis() }/*,
                    {data: 'total_cbd'}*/
                ],
                fnCreatedRow: function (row, data, index) {
                    $(row).click(function () {
                        prepareFormOrder(data, 'sell');
                    })
                }
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
                    {data: 'price', className: 'color-buy', render: $.fn.dataTable.render.ellipsis() },
                    {data: 'crea', render: $.fn.dataTable.render.ellipsis() },
                    {data: 'cbd', render: $.fn.dataTable.render.ellipsis() }/*,
                    {data: 'total_cbd'}*/
                ],
                fnCreatedRow: function (row, data, index) {
                    $(row).click(function () {
                        prepareFormOrder(data, 'sell');
                    })
                }
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
                    {data: 'price', className: 'color-sell', render: $.fn.dataTable.render.ellipsis() },
                    {data: 'crea', render: $.fn.dataTable.render.ellipsis() },
                    {data: 'cbd', render: $.fn.dataTable.render.ellipsis() }/*,
                    {data: 'total_cbd'}*/
                ],
                fnCreatedRow: function (row, data, index) {
                    $(row).click(function () {
                        prepareFormOrder(data, 'buy');
                    })
                }
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
                    {data: 'price', className: 'color-sell', render: $.fn.dataTable.render.ellipsis() },
                    {data: 'crea', render: $.fn.dataTable.render.ellipsis() },
                    {data: 'cbd', render: $.fn.dataTable.render.ellipsis() }/*,
                    {data: 'total_cbd'}*/
                ],
                fnCreatedRow: function (row, data, index) {
                    $(row).click(function () {
                        prepareFormOrder(data, 'buy');
                    })
                }
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
                    {data: 'expiration'},
                    {
                        data: 'type',
                        render: function (cellValue, type, rowData, meta) {
                            if (cellValue.toLowerCase() === 'buy') {
                                return '<span class="color-buy">' + cellValue.toUpperCase() + '</span>'
                            } else {
                                return '<span class="color-sell">' + cellValue.toUpperCase() + '</span>'
                            }
                        }
                    },
                    {data: 'price'},
                    {data: 'crea'},
                    {data: 'cbd'},
                    {
                        data: 'action',
                        render: function (cellValue, type, rowData, meta) {
                            return '<div id="' + rowData.orderid + '" class="btn btn--sm"><span class="btn__text text__dark font-weight-bold"> ' + lang.BUTTON.CANCEL + '</span></a>';
                        }
                    }
                ],
                fnCreatedRow: function (row, data, index) {
                    $('#' + data.orderid, row).click(function () {
                        cancelOrder(data.orderid);
                    })
                }
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
                    {data: 'date', render: $.fn.dataTable.render.ellipsis() },
                    {
                        data: 'price',
                        render: function (cellValue, type, rowData, meta) {
                            if (rowData.type.toLowerCase() === 'buy') {
                                return '<span class="color-buy">' + cellValue + '</span>'
                            } else {
                                return '<span class="color-sell">' + cellValue + '</span>'
                            }
                        }
                    },
                    {data: 'crea', render: $.fn.dataTable.render.ellipsis() },
                    {data: 'cbd', render: $.fn.dataTable.render.ellipsis() }
                ]
            });
        }

    }

    function setUpUser(s, a) {
        session = s;
        account = a;
        setUp();
    }

    creaEvents.on('crea.session.login', function (session, account) {
        creaEvents.emit('crea.dom.ready');
        setUpUser(session, account);
        setTimeout(function () {
            console.log('session started');

            setUpTables();
            refreshData(3000);
        }, 500)


    });

    creaEvents.on('crea.session.update', function (session, account) {
        setUpUser(session, account);
    });

    //Close socket on unload
    $(window).on('beforeunload', function () {
        console.log('before unload event');
        socket.close();
    })

})();