/**
 * Created by ander on 30/09/18.
 */

let apiOptions = {
    url: 'http://crea.owldevelopers.site',
    addressPrefix: 'CREA',
    symbol: {
        CREA: 'CREA',
        CGY: 'CGY',
        CBD: 'CBD',
        VESTS: 'VESTS',
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
