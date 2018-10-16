/**
 * Created by ander on 16/10/18.
 */

class LicensePermission {

    /**
     *
     * @param {number} flag
     * @param {string} name
     */
    constructor(flag, name) {
        this.flag = flag;
        this.name = name
    }

    getIcon(color = '') {
        return 'img/icons/license/' + this.name.toLowerCase() + '_' + color.toUpperCase() + '.svg';
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
        })
    }

    /**
     *
     * @param flag
     * @returns {License}
     */
    static fromFlag(flag) {

        if (flag === 0) {
            return new License(LICENSE.FREE_CONTENT);
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
            checkPerm(LICENSE.SHARE_ALIKE);
            checkPerm(LICENSE.NON_COMMERCIAL);
            checkPerm(LICENSE.NON_DERIVATES);

            return license;
        }
    }
}

let LICENSE = {
    FREE_CONTENT: new LicensePermission(0x00, 'FreeContent'),
    CREATIVE_COMMONS: new LicensePermission(0x01, 'CreativeCommons'),
    ATTRIBUTION: new LicensePermission(0x02, 'Attribution'),
    SHARE_ALIKE: new LicensePermission(0x04, 'ShareAlike'),
    NON_COMMERCIAL: new LicensePermission(0x08, 'NonCommercial'),
    NON_DERIVATES: new LicensePermission(0x10, 'NonDerivates'),
};