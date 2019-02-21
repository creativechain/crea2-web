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
        energy = parseFloat(Asset.parseString(creaEnergy).toPlainString(null, false));
    }

    const total_vests = parseFloat(Asset.parseString(state.props.total_vesting_shares).toPlainString(null, false));
    const total_vest_crea = parseFloat(Asset.parseString(state.props.total_vesting_fund_crea).toPlainString(null, false));

    return Asset.parse({
        amount: energy / total_vest_crea * total_vests,
        nai: apiOptions.nai.VESTS
    })
}


/**
 *
 * @param state
 * @param vestingShares
 * @param nai
 * @returns {Asset}
 */
function vestsToCgy(state, vestingShares, nai='cgy') {

    let vests = vestingShares;
    if (typeof vestingShares === 'string') {
        vests = parseFloat(Asset.parseString(vestingShares).toPlainString(null, false));
    }

    const total_vests = parseFloat(Asset.parseString(state.props.total_vesting_shares).toPlainString(null, false));
    const total_vest_crea = parseFloat(Asset.parseString(state.props.total_vesting_fund_crea).toPlainString(null, false));

    return Asset.parse({
        amount: total_vest_crea * (vests / total_vests),
        nai: nai
    })
}

/**
 *
 * @param account
 * @param props
 * @returns {Asset}
 */
function vestingCrea(account, props) {
    const vests = parseFloat(Asset.parseString(account.vesting_shares).toPlainString(null, false));
    const totalVests = parseFloat(Asset.parseString(props.total_vesting_shares).toPlainString(null, false));
    const totalVestCrea = parseFloat(Asset.parseString(props.total_vesting_fund_crea).toPlainString(null, false));

    const vestingCrea = totalVestCrea * (vests / totalVests);
    return Asset.parse({amount: vestingCrea, nai: apiOptions.nai.CGY});
}

/**
 *
 * @param account
 * @param props
 * @returns {Asset}
 */
function delegatedCrea(account, props) {
    const delegatedVests = parseFloat(Asset.parseString(account.delegated_vesting_shares).toPlainString(null, false));
    const receivedVests = parseFloat(Asset.parseString(account.received_vesting_shares).toPlainString(null, false));

    const vests = delegatedVests - receivedVests;
    const totalVests = parseFloat(Asset.parseString(props.total_vesting_shares).toPlainString(null, false));
    const totalVestCrea = parseFloat(Asset.parseString(props.total_vesting_fund_crea).toPlainString(null, false));

    const vestingCrea = totalVestCrea * (vests / totalVests);
    return Asset.parse({amount: vestingCrea, nai: 'crea'});
}