"use strict";

/**
 * Created by ander on 28/11/18.
 */

/**
 *
 * @param state
 * @param creaEnergy
 * @returns {Asset}
 */
function cgyToVests(state, creaEnergy) {
    var energy = creaEnergy;

    if (typeof creaEnergy === 'string') {
        energy = parseFloat(Asset.parseString(creaEnergy).toPlainString(null, false));
    }

    var total_vests = parseFloat(Asset.parseString(state.props.total_vesting_shares).toPlainString(null, false));
    var total_vest_crea = parseFloat(Asset.parseString(state.props.total_vesting_fund_crea).toPlainString(null, false));
    return Asset.parse({
        amount: energy / total_vest_crea * total_vests,
        nai: apiOptions.nai.VESTS
    });
}
/**
 *
 * @param state
 * @param vestingShares
 * @param nai
 * @returns {Asset}
 */


function vestsToCgy(state, vestingShares) {
    var nai = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'cgy';
    var vests = vestingShares;

    if (typeof vestingShares === 'string') {
        vests = parseFloat(Asset.parseString(vestingShares).toPlainString(null, false));
    }

    var total_vests = parseFloat(Asset.parseString(state.props.total_vesting_shares).toPlainString(null, false));
    var total_vest_crea = parseFloat(Asset.parseString(state.props.total_vesting_fund_crea).toPlainString(null, false));
    return Asset.parse({
        amount: total_vest_crea * (vests / total_vests),
        nai: nai
    });
}
/**
 *
 * @param account
 * @param props
 * @returns {Asset}
 */


function vestingCrea(account, props) {
    var vests = parseFloat(Asset.parseString(account.vesting_shares).toPlainString(null, false));
    var totalVests = parseFloat(Asset.parseString(props.total_vesting_shares).toPlainString(null, false));
    var totalVestCrea = parseFloat(Asset.parseString(props.total_vesting_fund_crea).toPlainString(null, false));
    var vestingCrea = totalVestCrea * (vests / totalVests);
    return Asset.parse({
        amount: vestingCrea,
        nai: apiOptions.nai.CGY
    });
}
/**
 *
 * @param account
 * @param props
 * @returns {Asset}
 */


function delegatedCrea(account, props) {
    var delegatedVests = parseFloat(Asset.parseString(account.delegated_vesting_shares).toPlainString(null, false));
    var receivedVests = parseFloat(Asset.parseString(account.received_vesting_shares).toPlainString(null, false));
    var vests = delegatedVests - receivedVests;
    var totalVests = parseFloat(Asset.parseString(props.total_vesting_shares).toPlainString(null, false));
    var totalVestCrea = parseFloat(Asset.parseString(props.total_vesting_fund_crea).toPlainString(null, false));
    var vestingCrea = totalVestCrea * (vests / totalVests);
    return Asset.parse({
        amount: vestingCrea,
        nai: 'crea'
    });
}