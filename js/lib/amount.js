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

const ASSET_CGY = {
    precision: 3,
    symbol: apiOptions.symbol.CGY
};

const ASSET_VESTS = {
    precision: 6,
    symbol: apiOptions.symbol.VESTS
};

const NAI = {
    "@@000000013": ASSET_CBD,
    "cbd": ASSET_CBD,
    "@@000000021": ASSET_CREA,
    "crea": ASSET_CREA,
    "@@000000037": ASSET_VESTS,
    "vests": ASSET_VESTS,
    "cgy": ASSET_CGY,
    "@@000000005": ASSET_CGY,
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

    abbr(value) {
        value = parseFloat(value);

        if (value < 10000) {
            return value;
        }

        let newValue = value;
        const suffixes = ["", "K", "M", "B","T"];
        let suffixNum = 0;
        while (newValue >= 10000) {
            newValue /= 1000;
            suffixNum++;
        }

        newValue = Math.round(newValue * 100) / 100; //2 decimals places

        newValue += suffixes[suffixNum];
        return newValue;
    }

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
        return this.abbr(toFloat);
    };
}

class Asset {
    /**
     *
     * @param {Number} amount
     * @param {{precision: Number, symbol: String}} asset
     */
    constructor(amount, asset) {
        this.amount = amount;
        this.asset = asset;
    }

    /**
     *
     * @param val
     * @returns {Asset}
     */
    add(val) {
        if (val.asset.symbol === this.asset.symbol) {
            this.amount += val.amount;
        }

        return this;
    }

    /**
     *
     * @param val
     * @returns {Asset}
     */
    subtract(val) {
        if (val.asset.symbol === this.asset.symbol) {
            this.amount -= val.amount;
        }

        return this;
    }

    /**
     *
     * @param val
     * @returns {Asset}
     */
    divide(val) {
        this.amount /= val;
        return this;
    }

    /**
     *
     * @param val
     * @returns {Asset}
     */
    multiply(val) {
        this.amount *= val;
        return this;
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
        let nai = NAI[assetData.nai] || NAI[assetData.asset.symbol.toLowerCase()];

        if (typeof assetData.amount === 'number') {
            if (assetData.amount % 1 != 0 || assetData.round) {
                assetData.amount = Math.round(assetData.amount * Math.pow(10, nai.precision));
            }
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
            case ASSET_CGY:
                return new CreaEnergy(assetData.amount);
            case ASSET_VESTS:
                return new Vests(assetData.amount);

        }

        return undefined;
    }

    /**
     *
     * @param {string} assetString
     * @returns {Asset}
     */
    static parseString(assetString) {
        let strSplitted = assetString.split(' ');
        let amount = parseFloat(strSplitted[0]);
        let nai = apiOptions.nai[strSplitted[1]];

        if (amount % 1 == 0) {
            amount = Math.round(amount * Math.pow(10, NAI[nai].precision))
        }

        return Asset.parse({
            amount: amount,
            nai: nai,
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

class Vests extends Asset {
    constructor(amount) {
        super(amount, ASSET_VESTS);
    }
}

class CreaEnergy extends Asset {
    constructor(amount) {
        super(amount, ASSET_CGY);
    }
}