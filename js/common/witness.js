/**
 * Created by ander on 7/11/18.
 */

let witnessContainer;

(function () {

    function updateWitnessView(session, account, state) {

        if (!witnessContainer) {
            witnessContainer = new Vue({
                el: '#witness-container',
                data: {
                    lang: lang,
                    session: session,
                    account: account,
                    state: state
                },
                methods: {

                }
            })
        } else {
            witnessContainer.session = session;
            witnessContainer.account = account;
            witnessContainer.state = state;
        }
    }
    
    function fetchWitness(session, account) {
        crea.api.getState('/~witnesses', function (err, result) {
            if (err) {
                console.error(err);
            } else {
                let wKeys = Object.keys(result.witnesses);
                wKeys.sort(function (w1, w2) {
                    return result.witnesses[w2].votes - result.witnesses[w1].votes;
                });

                result.ordered_witnesses = wKeys;
                updateWitnessView(session, account, result);
            }
        })
    }

    creaEvents.on('crea.session.login', function (session, account) {
        fetchWitness(session, account)
    });
})();