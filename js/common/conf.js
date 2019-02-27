/**
 * Created by ander on 30/09/18.
 */


let local = false;

let apiOptions = {
    nodes: ['https://nodes.creary.net'],
    apiUrl : 'https://api.creary.net',
    ipfs: 'https://ipfs.creary.net/ipfs/',
    ipfsd: 'https://api.creary.net/ipfs',
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
        VESTS: '@@000000037',
        CGY: '@@000000005'
    },
    chainId: '0000000000000000000000000000000000000000000000000000000000000000'
};

localStorage.debug = 'crea:*';
crea.api.setOptions(apiOptions);
crea.config.set('address_prefix', apiOptions.addressPrefix);
crea.config.set('chain_id', apiOptions.chainId);

const lang = {};
const faq = {};

/**
 *
 * @returns {*}
 */
function getLanguage() {
    let language = localStorage.getItem(CREARY.LANG) || getNavigatorLanguage();
    if (lang[language]) {
        return lang[language];
    }

    return jsonify(jsonstring(lang.en));
}
//Vue.config.silent = false;
