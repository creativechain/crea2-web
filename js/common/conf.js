/**
 * Created by ander on 30/09/18.
 */


let local = false;
let localNode = 'http://cn.localhost';

let apiUrl = local ? 'http://127.0.0.1:8000' : 'https://platform.creativechain.net';
let apiOptions = {
    url: local ? localNode : 'https://crea.owldevelopers.site',
    apiUrl : apiUrl,
    ipfs: 'https://ipfs.creary.net',
    ipfsd: 'https://platform.creativechain.net/ipfs/',
    addressPrefix: 'CREA',
    symbol: {
        CREA: 'CREA',
        CGY: 'CGY',
        CBD: 'CBD',
        VESTS: 'VESTS',
    },
    nai: {
        CREA: '@@000000021',
        CBD: '@@000000013',
        VESTS: '@@000000037'
    },
    chainId: '0000000000000000000000000000000000000000000000000000000000000000'
};

localStorage.debug = 'crea:*';
crea.api.setOptions(apiOptions);
crea.config.set('address_prefix', apiOptions.addressPrefix);
crea.config.set('chain_id', apiOptions.chainId);
//Vue.config.silent = false;
