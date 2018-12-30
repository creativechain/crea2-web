/**
 * Created by ander on 27/09/18.
 */

const DEFAULT_ROLES = ['posting', 'active', 'owner', 'memo'];

class Account {

    constructor(username, keys) {
        this.username = username;
        this.keys = keys;
    }

    /**
     *
     * @param username
     * @param password
     * @param role
     * @returns {Account}
     */
    static generate(username, password, role = 'posting') {
        let neededRoles = [];
        let keys = {};

        if (role) {
            if (DEFAULT_ROLES.indexOf(role) > -1) {
                neededRoles.push(role);
            } else {
                throw 'Role not valid: ' + role;
            }

        } else {
            neededRoles = DEFAULT_ROLES;
        }

        let privKeys = crea.auth.getPrivateKeys(username, password, neededRoles);

        neededRoles.forEach(function (r) {
            keys[r] = {
                prv: privKeys[r],
                pub: privKeys[r + 'Pubkey']
            }
        });

        return new Account(username, keys);
    }
}
