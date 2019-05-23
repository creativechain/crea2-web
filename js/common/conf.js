"use strict";

/**
 * Created by ander on 30/09/18.
 */
var local = false;
var apiOptions = {
    nodes: ['https://crea.owldevelopers.site'],
    apiUrl: 'https://api.creary.net',
    ipfs: 'https://ipfs.creary.net/ipfs/',
    ipfsd: 'https://api.creary.net/ipfs',
    addressPrefix: 'CREA',
    symbol: {
        CREA: 'CREA',
        CGY: 'CGY',
        CBD: 'CBD',
        VESTS: 'VESTS'
    },
    nai: {
        CREA: '@@000000021',
        CBD: '@@000000013',
        VESTS: '@@000000037',
        CGY: '@@000000005'
    },
    chainId: '0000000000000000000000000000000000000000000000000000000000000000'
};

localStorage.debug = 'crea:*';
crea.api.setOptions(apiOptions);
crea.config.set('address_prefix', apiOptions.addressPrefix);
crea.config.set('chain_id', apiOptions.chainId);
var isoLangs = {};

var faq = {};

var language = $('html').attr('lang');

$.getJSON('/language/isolangs.json', function(data) {
    isoLangs = data;
});