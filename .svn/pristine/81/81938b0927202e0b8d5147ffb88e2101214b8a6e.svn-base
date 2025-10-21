import * as CryptoJS from 'crypto-js';

const KEY = CryptoJS.enc.Utf8.parse('1234567890123456'); //这里必须与后端一致
const IV = CryptoJS.enc.Base64.parse('WkxwjJImWzBeoM7BOXZUQA=='); //固定向量(这里必须前后端一致)：目前用于1:前端页面跳转url传参加密；2:接口请求是否需要记录日志,请求头notLog参数的加密；

/**
 * Crypt AES 加密方法
 * @param word 需要加密的字符串
 * @param isRandomIV iv向量
 */
export const aesEncrypt = (word: string, isRandomIV?: CryptoJS.lib.WordArray): string => {
    let key = KEY;
    let iv = IV;
    if (isRandomIV) {
        // 比如请求接口时，参数需要一个随机IV加密
        iv = isRandomIV;
    }
    let srcs = CryptoJS.enc.Utf8.parse(word);
    var encrypted = CryptoJS.AES.encrypt(srcs, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.toString();
};

/**
 * Crypt AES 解密方法
 * @param word 需要解密的字符串
 * @param isRandomIV iv向量
 */
export const aesDecrypt = (word: string, isRandomIV?: CryptoJS.lib.WordArray): string => {
    let key = KEY;
    let iv = IV;
    if (isRandomIV) {
        // 使用传入的iv
        iv = isRandomIV;
    }
    let base64 = CryptoJS.enc.Base64.parse(word);
    let src = CryptoJS.enc.Base64.stringify(base64);
    var decrypt = CryptoJS.AES.decrypt(src, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });
    var decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();
};

/**
 * Crypt AES 解密方法2  后端传的iv是字符串
 * @param word 需要解密的字符串
 * @param isRandomIVStr iv向量字符串
 */
export const aesDecryptService = (word: string, isRandomIVStr?: string): string => {
    let key = KEY;
    let iv = IV;
    if (isRandomIVStr) {
        // 使用传入的iv
        iv = CryptoJS.enc.Base64.parse(isRandomIVStr);
    }

    let base64 = CryptoJS.enc.Base64.parse(word);
    let src = CryptoJS.enc.Base64.stringify(base64);
    var decrypt = CryptoJS.AES.decrypt(src, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });
    var decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();
};

export const md5 = (str: string) => {
    return CryptoJS.MD5(str).toString();
};
export default {
    aesEncrypt,
    aesDecrypt,
    aesDecryptService,
    md5,
};
