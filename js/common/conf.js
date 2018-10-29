/**
 * Created by ander on 30/09/18.
 */

let apiOptions = {
    url: 'https://crea.owldevelopers.site',
    ipfs: 'https://ipfs.creary.net',
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
        VESTS: ''
    },
    chainId: '0000000000000000000000000000000000000000000000000000000000000000',
    accountCreator: 'initminer',
    privCreator: '5JNHfZYKGaomSFvd4NUdQ9qMcEAC43kujbfjueTHpVapX1Kzq2n'
};

localStorage.debug = 'crea:*';
crea.api.setOptions(apiOptions);
crea.config.set('address_prefix', apiOptions.addressPrefix);
crea.config.set('chain_id', apiOptions.chainId);
//Vue.config.silent = false;
