/**
 * Created by ander on 10/10/18.
 */

const ASSET_CREA = {
    precision: 3,
    symbol: apiOptions.symbol.CREA
};

const ASSET_CBD = {
    precision: 3,
    symbol: apiOptions.symbol.CBD
};

const NAI = {
    "@@000000013": ASSET_CBD,
    "@@000000021": ASSET_CREA
};

class MonetaryFormat {
    constructor() {
        this.maxDigits = 2;
    };

    digits(maxDigits) {

        if (isNaN(maxDigits)) {
            maxDigits = 2;
        }

        this.maxDigits = maxDigits;
    };

    /**
     *
     * @param {Number} value
     * @param {Number} exponent
     * @returns {string}
     */
    format(value, exponent) {
        if (typeof value !== "number") {
            value = 0;
        }

        if (typeof exponent !== "number") {
            exponent = 2;
        }

        let toFloat = (value / Math.pow(10, exponent)).toFixed(this.maxDigits);
        return String(toFloat);
    };
}

class Asset {
    constructor(amount, asset) {
        this.amount = amount;
        this.asset = asset;
    }

    /**
     *
     * @param maxDecimals
     * @returns {string}
     */
    toPlainString(maxDecimals) {

        if (isNaN(maxDecimals)) {
            maxDecimals = this.asset.precision;
        }

        let mf = new MonetaryFormat();
        mf.digits(maxDecimals);
        return mf.format(Math.abs(this.amount), this.asset.precision);
    };

    toFriendlyString(maxDecimals) {
        return this.toPlainString(maxDecimals) + " " + this.asset.symbol;
    };

    toString() {
        return this.toFriendlyString(this.asset.precision);
    };

    /**
     *
     * @param assetData
     * @returns {Asset}
     */
    static parse(assetData) {
        let nai = NAI[assetData.nai];

        if (typeof assetData.amount === 'number') {
            assetData.amount = Math.round(assetData.amount * Math.pow(10, nai.precision));
        } else if (typeof assetData.amount === 'string') {
            assetData.amount = assetData.amount.replace(',', '.');

            if (!isNaN(assetData.amount)) {
                if (assetData.amount.indexOf('.') > 0) {
                    assetData.amount = parseFloat(assetData.amount)
                } else {
                    assetData.amount = parseInt(assetData.amount);
                }

                return Asset.parse(assetData);
            }
        } else {
            assetData.amount = 0;
        }

        switch (nai) {
            case ASSET_CBD:
                return new CreaDollar(assetData.amount);
            case ASSET_CREA:
                return new Crea(assetData.amount);
        }

        return undefined;
    }

    /**
     *
     * @param assetString
     * @returns {Asset}
     */
    static parseString(assetString) {
        let strSplitted = assetString.split(' ');
        return Asset.parse({
            amount: strSplitted[0],
            nai: apiOptions.nai[strSplitted[1]],
        })
    }
}

class Crea extends Asset {
    constructor(amount) {
        super(amount, ASSET_CREA);
    }
}

class CreaDollar extends Asset {
    constructor(amount) {
        super(amount, ASSET_CBD);
    }
}