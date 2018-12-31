/**
 * Created by ander on 30/09/18.
 */


let localNode = 'http://cn.localhost';
let apiOptions = {
    url: false ? localNode : 'https://crea.owldevelopers.site',
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
    chainId: '0000000000000000000000000000000000000000000000000000000000000000',
    accountCreator: 'initminer',
    privCreator: '5JNHfZYKGaomSFvd4NUdQ9qMcEAC43kujbfjueTHpVapX1Kzq2n',
    privCreator2: '5KRFvzfzsbxPEMymDMMeNCGfVYAvu5y29M11Bky6ZdPShrbyphU'
};

localStorage.debug = 'crea:*';
crea.api.setOptions(apiOptions);
crea.config.set('address_prefix', apiOptions.addressPrefix);
crea.config.set('chain_id', apiOptions.chainId);
//Vue.config.silent = false;
