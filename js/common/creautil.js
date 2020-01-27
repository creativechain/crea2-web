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
    let energy = creaEnergy;

    if (typeof creaEnergy === 'string') {
        energy = parseFloat(Asset.parse(creaEnergy).toPlainString(null, false));
    }

    let total_vests = parseFloat(Asset.parse(state.props.total_vesting_shares).toPlainString(null, false));
    let total_vest_crea = parseFloat(Asset.parse(state.props.total_vesting_fund_crea).toPlainString(null, false));
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
    let nai = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'cgy';
    let vests = vestingShares;

    if (typeof vestingShares === 'string') {
        vests = parseFloat(Asset.parse(vestingShares).toPlainString(null, false));
    }

    let total_vests = parseFloat(Asset.parse(state.props.total_vesting_shares).toPlainString(null, false));
    let total_vest_crea = parseFloat(Asset.parse(state.props.total_vesting_fund_crea).toPlainString(null, false));
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
    let vests = parseFloat(Asset.parse(account.vesting_shares).toPlainString(null, false));
    let totalVests = parseFloat(Asset.parse(props.total_vesting_shares).toPlainString(null, false));
    let totalVestCrea = parseFloat(Asset.parse(props.total_vesting_fund_crea).toPlainString(null, false));
    let vestingCrea = totalVestCrea * (vests / totalVests);
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
    let delegatedVests = parseFloat(Asset.parse(account.delegated_vesting_shares).toPlainString(null, false));
    let receivedVests = parseFloat(Asset.parse(account.received_vesting_shares).toPlainString(null, false));
    let vests = delegatedVests - receivedVests;
    let totalVests = parseFloat(Asset.parse(props.total_vesting_shares).toPlainString(null, false));
    let totalVestCrea = parseFloat(Asset.parse(props.total_vesting_fund_crea).toPlainString(null, false));
    let vestingCrea = totalVestCrea * (vests / totalVests);
    return Asset.parse({
        amount: vestingCrea,
        nai: 'cgy'
    });
}

/**
 *
 * @param account
 * @param props
 * @returns {*}
 */
function receivedDelegatedCGY(account, props) {
    let delegatedVests = 0; //parseFloat(Asset.parse(account.delegated_vesting_shares).toPlainString(null, false));
    let receivedVests = parseFloat(Asset.parse(account.received_vesting_shares).toPlainString(null, false));
    let vests = delegatedVests - receivedVests;
    let totalVests = parseFloat(Asset.parse(props.total_vesting_shares).toPlainString(null, false));
    let totalVestCrea = parseFloat(Asset.parse(props.total_vesting_fund_crea).toPlainString(null, false));
    let vestingCrea = totalVestCrea * (vests / totalVests);
    return Asset.parse({
        amount: vestingCrea,
        nai: 'cgy'
    });
}