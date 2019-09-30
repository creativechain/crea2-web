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
        energy = parseFloat(Asset.parse(creaEnergy).toPlainString(null, false));
    }

    var total_vests = parseFloat(Asset.parse(state.props.total_vesting_shares).toPlainString(null, false));
    var total_vest_crea = parseFloat(Asset.parse(state.props.total_vesting_fund_crea).toPlainString(null, false));
    return Asset.parse({
        amount: energy / total_vest_crea * total_vests,
        nai: apiOptions.nai.VESTS
    });
}
/**
 *
 * @param state
 * @param vestingShares
 * @returns {Asset}
 */


function vestsToCgy(state, vestingShares) {
    var nai = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'cgy';
    var vests = vestingShares;

    if (typeof vestingShares === 'string') {
        vests = parseFloat(Asset.parse(vestingShares).toPlainString(null, false));
    }

    var total_vests = parseFloat(Asset.parse(state.props.total_vesting_shares).toPlainString(null, false));
    var total_vest_crea = parseFloat(Asset.parse(state.props.total_vesting_fund_crea).toPlainString(null, false));
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
    var vests = parseFloat(Asset.parse(account.vesting_shares).toPlainString(null, false));
    var totalVests = parseFloat(Asset.parse(props.total_vesting_shares).toPlainString(null, false));
    var totalVestCrea = parseFloat(Asset.parse(props.total_vesting_fund_crea).toPlainString(null, false));
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
    var delegatedVests = parseFloat(Asset.parse(account.delegated_vesting_shares).toPlainString(null, false));
    var receivedVests = parseFloat(Asset.parse(account.received_vesting_shares).toPlainString(null, false));
    var vests = delegatedVests - receivedVests;
    var totalVests = parseFloat(Asset.parse(props.total_vesting_shares).toPlainString(null, false));
    var totalVestCrea = parseFloat(Asset.parse(props.total_vesting_fund_crea).toPlainString(null, false));
    var vestingCrea = totalVestCrea * (vests / totalVests);
    return Asset.parse({
        amount: vestingCrea,
        nai: 'cgy'
    });
}

function receivedDelegatedCGY(account, props) {
    var delegatedVests = 0; //parseFloat(Asset.parse(account.delegated_vesting_shares).toPlainString(null, false));
    var receivedVests = parseFloat(Asset.parse(account.received_vesting_shares).toPlainString(null, false));
    var vests = delegatedVests - receivedVests;
    var totalVests = parseFloat(Asset.parse(props.total_vesting_shares).toPlainString(null, false));
    var totalVestCrea = parseFloat(Asset.parse(props.total_vesting_fund_crea).toPlainString(null, false));
    var vestingCrea = totalVestCrea * (vests / totalVests);
    return Asset.parse({
        amount: vestingCrea,
        nai: 'cgy'
    });
}