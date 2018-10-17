/**
 * Created by ander on 16/10/18.
 */

class LicensePermission {

    /**
     *
     * @param {number} flag
     * @param {string} name
     * @param showName
     */
    constructor(flag, name, showName = true) {
        this.flag = flag;
        this.name = name;
        this.showName = showName;
    }

    getIcon(color) {
        return '/img/icons/license/' + this.name.toLowerCase() + (color ? '_' + color.toUpperCase() : '') + '.svg';
    }
}

class License {

    /**
     *
     * @param {...} licensePermissions
     */
    constructor(...licensePermissions) {
        this.licensePermissions = licensePermissions || [];
    }

    /**
     *
     * @param {LicensePermission} licensePermission
     * @param {number} index
     */
    add(licensePermission, index = -1) {
        if (index > -1) {
            this.licensePermissions.splice(index, 0, licensePermission);
        } else {
            this.licensePermissions.push(licensePermission)
        }
    }

    /**
     *
     * @param {LicensePermission} licensePermission
     */
    remove(licensePermission) {
        let index = this.licensePermissions.indexOf(licensePermission);
        if (index > -1) {
            this.licensePermissions.splice(index, 1);
        }
    }

    clear() {
        this.licensePermissions.splice(0, this.licensePermissions.length);
    }

    /**
     *
     * @param color
     * @returns {Array}
     */
    getIcons(color = '') {
        let icons = [];
        this.licensePermissions.forEach(function (perm) {
            icons.push(perm.getIcon())
        });

        return icons;
    }

    getFlag() {
        let flag = 0;
        this.licensePermissions.forEach(function (perm) {
            flag = flag | perm.flag;
        });

        return flag;
    }

    /**
     *
     * @returns {string}
     */
    toString() {
        let str = '';
        this.licensePermissions.forEach(function (perm) {
            if (perm.showName) {
                if (!str.isEmpty()) {
                    str += ' + ';
                }

                str += perm.name;
            }
        });

        return str;
    }

    toLocaleString() {
        let str = '';
        this.licensePermissions.forEach(function (perm) {
            if (perm.showName) {
                if (!str.isEmpty()) {
                    str += '-';
                }

                str += lang.LICENSE[perm.name.toUpperCase()];
            }
        });

        return str;
    }

    /**
     *
     * @param flag
     * @returns {License}
     */
    static fromFlag(flag) {

        if (flag === 0) {
            return new License(LICENSE.NO_LICENSE);
        } else {
            let license = new License();

            let checkPerm = function (perm) {
                let f = flag & perm.flag;
                if (f === perm.flag) {
                    license.add(perm);
                }
            };

            checkPerm(LICENSE.CREATIVE_COMMONS);
            checkPerm(LICENSE.ATTRIBUTION);
            checkPerm(LICENSE.NON_COMMERCIAL);
            checkPerm(LICENSE.SHARE_ALIKE);
            checkPerm(LICENSE.NON_DERIVATES);
            checkPerm(LICENSE.NON_PERMISSION);
            checkPerm(LICENSE.FREE_CONTENT);

            return license;
        }
    }
}

let LICENSE = {
    NO_LICENSE: new LicensePermission(0x00, 'WithoutLicense'),
    CREATIVE_COMMONS: new LicensePermission(0x01, 'CreativeCommons', false),
    ATTRIBUTION: new LicensePermission(0x02, 'Attribution'),
    SHARE_ALIKE: new LicensePermission(0x04, 'ShareAlike'),
    NON_COMMERCIAL: new LicensePermission(0x08, 'NonCommercial'),
    NON_DERIVATES: new LicensePermission(0x10, 'NonDerivates'),
    NON_PERMISSION: new LicensePermission(0x20, 'NonPermission'),
    FREE_CONTENT: new LicensePermission(0x80, 'FreeContent'),
};