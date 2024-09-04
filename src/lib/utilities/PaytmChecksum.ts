import * as crypto from 'crypto'

class PaytmChecksum {
    static iv: crypto.BinaryLike = "@@@@&&&&####$$$$"
    static encrypt(input: string, key: crypto.CipherKey) {
        const cipher = crypto.createCipheriv('AES-128-CBC', key, PaytmChecksum.iv);
        let encrypted = cipher.update(input, 'binary', 'base64');
        encrypted += cipher.final('base64');
        return encrypted;
    }
    static decrypt(encrypted: string, key: crypto.CipherKey) {
        const decipher = crypto.createDecipheriv('AES-128-CBC', key, PaytmChecksum.iv);
        let decrypted = decipher.update(encrypted, 'base64', 'binary');
        try {
            decrypted += decipher.final('binary');
        }
        catch (e) {
            console.log(e);
        }
        return decrypted;
    }
    static generateSignature(params: string | object, key: crypto.CipherKey) {
        if (typeof params !== "object" && typeof params !== "string") {
            const error = "string or object expected, " + (typeof params) + " given.";
            return Promise.reject(error);
        }
        if (typeof params !== "string") {
            params = PaytmChecksum.getStringByParams(params);
        }
        return PaytmChecksum.generateSignatureByString(params, key);
    }


    static verifySignature(params: string | object, key: crypto.CipherKey, checksum: string) {
        if (typeof params !== "object" && typeof params !== "string") {
            const error = "string or object expected, " + (typeof params) + " given.";
            return Promise.reject(error);
        }
        if (params.hasOwnProperty("CHECKSUMHASH") && typeof params === "object") {
            //@ts-ignore
            delete params.CHECKSUMHASH
        }
        if (typeof params !== "string") {
            params = PaytmChecksum.getStringByParams(params);
        }
        return PaytmChecksum.verifySignatureByString(params, key, checksum);
    }

    static async generateSignatureByString(params: string, key: crypto.CipherKey) {
        const salt = await PaytmChecksum.generateRandomString(4);
        return PaytmChecksum.calculateChecksum(params, key, salt);
    }

    static verifySignatureByString(params: string, key: crypto.CipherKey, checksum: string) {
        const paytm_hash = PaytmChecksum.decrypt(checksum, key);
        const salt = paytm_hash.substring(paytm_hash.length - 4);
        return (paytm_hash === PaytmChecksum.calculateHash(params, salt));
    }

    static generateRandomString(length: number): Promise<string> {
        return new Promise(function (resolve, reject) {
            crypto.randomBytes((length * 3.0) / 4.0, function (err, buf) {
                if (!err) {
                    let salt = buf.toString("base64");
                    resolve(salt);
                }
                else {
                    console.log("error occurred in generateRandomString: " + err);
                    reject(err);
                }
            });
        });
    }

    static getStringByParams(params: object) {
        let data: object = {};
        Object.keys(params).sort((a, b) => a < b ? -1 : 1).forEach((key, value) => {
            //@ts-ignore
            data[key] = (params[key] !== null && params[key].toLowerCase() !== "null") ? params[key] : "";
        });
        return Object.values(data).join('|');
    }

    static calculateHash(params: string, salt: string) {
        const finalString = params + "|" + salt;
        return crypto.createHash('sha256').update(finalString).digest('hex') + salt;
    }
    static calculateChecksum(params: string, key: crypto.CipherKey, salt: string) {
        const hashString = PaytmChecksum.calculateHash(params, salt);
        return PaytmChecksum.encrypt(hashString, key);
    }
}
module.exports = PaytmChecksum;