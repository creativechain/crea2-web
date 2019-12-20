
/**
 * Created by ander on 10/10/18.
 */
let ASSET_CREA = {
    exponent: 3,
    symbol: apiOptions.symbol.CREA
};

let ASSET_CBD = {
    exponent: 3,
    symbol: apiOptions.symbol.CBD
};

let ASSET_CGY = {
    exponent: 3,
    symbol: apiOptions.symbol.CGY
};

let ASSET_VESTS = {
    exponent: 6,
    symbol: apiOptions.symbol.VESTS
};

let NAI = {
    "@@000000013": ASSET_CBD,
    "cbd": ASSET_CBD,
    "@@000000021": ASSET_CREA,
    "crea": ASSET_CREA,
    "@@000000037": ASSET_VESTS,
    "vests": ASSET_VESTS,
    "cgy": ASSET_CGY,
    "@@000000005": ASSET_CGY
};

class MonetaryFormat {
    constructor() {
        this.maxDigits = 2;
    }

    digits(maxDigits) {
        if (isNaN(maxDigits)) {
            maxDigits = 2;
        }

        this.maxDigits = maxDigits;
    }

    abbr(value) {
        value = parseFloat(value);

        if (value < 10000) {
            return value;
        }

        let newValue = value;
        let suffixes = ["", "K", "M", "B", "T"];
        let suffixNum = 0;

        while (newValue >= 10000) {
            newValue /= 1000;
            suffixNum++;
        }

        newValue = Math.round(newValue * 100) / 100; //2 decimals places

        newValue += suffixes[suffixNum];
        return newValue;
    }

    format(value, exponent, abbr = true) {

        if (typeof value !== "number") {
            value = 0;
        }

        if (typeof exponent !== "number") {
            exponent = 2;
        }

        let toFloat = (value / Math.pow(10, exponent)).toFixed(this.maxDigits);

        if (abbr) {
            return this.abbr(toFloat);
        } else {
            return toFloat;
        }
    }
}

class Asset {
    constructor(amount, asset) {
        this.amount = amount;
        this.asset = asset
    }
    
    add(val) {
        if (val.asset.symbol === this.asset.symbol) {
            this.amount += val.amount;
        }

        return this;
    }

    subtract(val) {
        if (val.asset.symbol === this.asset.symbol) {
            this.amount -= val.amount;
        }

        return this;
    }

    divide(val) {
        this.amount /= val;
        return this;
    }

    multiply(val) {
        this.amount *= val;
        return this;
    }

    /**
     *
     * @param assetEval
     * @param mode
     * @param strict
     * @returns {boolean}
     * @private
     */
    _evaluate(assetEval, mode, strict = true) {
        mode = mode ? mode.toLowerCase() : mode;

        /**
         *
         * @returns {boolean}
         */
        let evaluate = () => {
            switch (mode) {
                case 'gt':
                    return this.toFloat() > assetEval.toFloat();
                case 'gte':
                    return this.toFloat() >= assetEval.toFloat();
                case 'lt':
                    return this.toFloat() < assetEval.toFloat();
                case 'lte':
                    return this.toFloat() <= assetEval.toFloat();
                default:
                    return this.toFloat() === assetEval.toFloat();
            }
        };
        
        if (strict) {
            if (assetEval.asset.symbol) {
                if (assetEval.asset.symbol === this.asset.symbol) {
                    return evaluate();
                }

                throw new Error(`Symbol currency must be '${this.asset.symbol}'`);
            }

            throw new Error('Symbol currency not found');
        } else {
            return evaluate();
        }
    }

    /**
     *
     * @param asset
     * @param strict
     * @returns {boolean}
     */
    isGT(asset, strict = true) {
        return this._evaluate(asset, 'gt', strict);
    }

    /**
     *
     * @param asset
     * @param strict
     * @returns {boolean}
     */
    isGTE(asset, strict = true) {
        return this._evaluate(asset, 'gte', strict);

    }

    /**
     *
     * @param asset
     * @param strict
     * @returns {boolean}
     */
    isLT(asset, strict = true) {
        return this._evaluate(asset, 'lt', strict);

    }

    /**
     *
     * @param asset
     * @param strict
     * @returns {boolean}
     */
    isLTE(asset, strict = true) {
        return this._evaluate(asset, 'tle', strict);

    }

    /**
     *
     * @param asset
     * @param strict
     * @returns {boolean}
     */
    isEqual(asset, strict = true) {
        return this._evaluate(asset, 'equal', strict);

    }

    /**
     *
     * @param maxDecimals
     * @returns {*|string}
     */
    toPlainString(maxDecimals) {
        let abbr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        if (isNaN(maxDecimals) || maxDecimals === null) {
            maxDecimals = this.asset.exponent;
        }

        let mf = new MonetaryFormat();
        mf.digits(maxDecimals);
        return mf.format(Math.abs(this.amount), this.asset.exponent, abbr);
    }

    /**
     *
     * @param maxDecimals
     * @returns {string}
     */
    toFriendlyString(maxDecimals) {
        let abbr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        return this.toPlainString(maxDecimals, abbr) + " " + this.asset.symbol;
    }

    /**
     *
     * @returns {string}
     */
    toString() {
        return this.toFriendlyString(this.asset.exponent);
    }

    /**
     *
     * @returns {number}
     */
    toFloat() {
        return parseFloat(this.toPlainString(null, false));
    }

    /**
     *
     * @returns {Asset}
     */
    clone() {
        let asset = new Asset();
        asset.asset = JSON.parse(JSON.stringify(this.asset));
        asset.amount = this.amount;
        return asset;
    }

    /**
     *
     * @param assetData
     * @param log
     * @returns {Asset}
     */
    static parse(assetData, log) {

        if (log) {
            console.log('Asset log:', assetData);
        }
        if (typeof assetData === 'string') {
            return Asset.parseString(assetData);
        }

        let nai = assetData.asset ? NAI[assetData.asset.symbol.toLowerCase()] : NAI[assetData.nai.toLowerCase()];
        nai = Object.assign({}, nai);
        nai.exponent = assetData.exponent || nai.exponent;

        if (typeof assetData.amount === 'number') {
            if (assetData.amount % 1 !== 0 || assetData.round) {
                if (assetData.precision) {
                    assetData.amount = assetData.amount / Math.pow(10, assetData.precision);
                }
                assetData.amount = Math.round(assetData.amount * Math.pow(10, nai.exponent));
            }
        } else if (typeof assetData.amount === 'string') {
            assetData.amount = assetData.amount.replace(',', '.');

            if (!isNaN(assetData.amount)) {
                if (assetData.amount % 1 !== 0) {
                    assetData.amount = parseFloat(assetData.amount);
                } else {
                    if (assetData.precision) {
                        assetData.amount = assetData.amount / Math.pow(10, assetData.precision);
                    }

                    assetData.amount = parseInt(assetData.amount * Math.pow(10, nai.exponent));
                    assetData.precision = nai.exponent;
                }

                return Asset.parse(assetData);
            }
        } else {
            assetData.amount = 0;
        }

        return new Asset(assetData.amount, nai);

    }

    /**
     *
     * @param assetString
     * @returns {Asset}
     */
    static parseString(assetString) {
        let strSplitted = assetString.split(' ');
        let amount = parseFloat(strSplitted[0]);
        let symbol = strSplitted[1];
        let nai = NAI[symbol.toLowerCase()];

        amount = Math.round(amount * Math.pow(10, nai.exponent));

        return Asset.parse({amount: amount, nai: symbol.toLowerCase()});
    }
}

class Crea extends Asset {
    constructor(amount) {
        super(amount, ASSET_CREA)
    }
}

class CreaDollar extends Asset {
    constructor(amount) {
        super(amount, ASSET_CBD)
    }
}

class Vests extends Asset {
    constructor(amount) {
        super(amount, ASSET_VESTS)
    }
}

class CreaEnergy extends Asset {
    constructor(amount) {
        super(amount, ASSET_CGY)
    }
}