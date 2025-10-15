import { useGlobalStore } from '@/stores/index';

import { aesEncrypt } from '@/utils/crypt';
import CryptoJS from 'crypto-js';

// 错误提示
const _tips = (msg: string) => {
    uni.showToast({
        title: msg,
        icon: 'none',
        duration: 2000,
    });
};
// 需要跳转到授权的操作
const needAuthorize = function (info: any) {
    const GlobalStore = useGlobalStore();

    /**
     * 错误信息码
     * 1001  token未传入
     * 1002  认证失败请联系管理员
     * 1003  账号信息过期，请重新登录！
     * 1005  未授权不能进行操作
     * 1006  账号被挤掉了
     * 2000  Ok
     * >2000  各种错误提示
     */
    if (info.code === 1001) {
        uni.hideLoading();
        // v1.9.1逻辑更正
        GlobalStore.loginOut();
        return true;
    }
    if (info.code === 1003 || info.code === 1006) {
        uni.showToast({
            title: info.msg,
            icon: 'none',
            duration: 2000,
            mask: true,

            complete: function (res) {
                GlobalStore.loginOut();
            },
        });

        return true;
    }
};

/**
 * isencrypt:true 参数加密
 *
 */
// 封装http方法
export function http(params: any) {
    // if (params?.isencrypt) {
    //     params.data = encrypt(JSON.stringify(params.data));
    // }
    const GlobalStore = useGlobalStore();
    const BaseUrl = import.meta.env.VITE_SERVER_BASEURL;

    return new Promise((resolve, reject) => {
        const requestTask = uni.request({
            url: BaseUrl + params.url,
            header: Object.assign(
                {
                    token: '',
                },
                params.header || {},
            ),
            data: params.data,
            method: params.method,
            timeout: 12000,
            success(res: any) {
                if (res.statusCode === 200) {
                    if (res.data.code === 2000) {
                        resolve(res.data);
                    } else if (res.data.code === 4001) {
                        reject(res.data);
                    } else {
                        // resolve(res.data);
                        const hasNeed = needAuthorize(res.data);
                        console.log('hasNeed', hasNeed);
                        if (!hasNeed && !params.hidetips) {
                            _tips(res.data?.msg ?? '请求失败，请重试');
                        }
                        reject(res.data?.msg ?? '请求失败，请重试');
                    }
                } else {
                    console.log(res.statusCode, '崩溃辣~~~~~~');
                }
                // hideLoading();
            },
            fail(err) {
                console.log('errerrerr', err);
                if (err.errMsg === 'request:fail timeout') {
                    _tips('请求超时，请重试');
                } else {
                    _tips('请求失败，请重试');
                }
                reject(err);
                setTimeout(() => {
                    uni.hideLoading();
                }, 2000);
            },
        });
    });
}

// 扩展get和post请求
http.post = function (url: string, data: any, configs?: any) {
    const base64Iv = CryptoJS.lib.WordArray.random(16); // 生成一个随机的 16 字节 IV
    const paramsData = {
        cipherText: aesEncrypt(JSON.stringify({ ...data }), base64Iv),
        base64Iv: base64Iv.toString(CryptoJS.enc.Base64),
        clearText: data,
    };
    return http(
        Object.assign(
            {},
            {
                method: 'POST',
                url,
                data: paramsData,
            },
            configs,
        ),
    );
};
http.get = function (url: string, data: any, configs?: any) {
    return http(
        Object.assign(
            {},
            {
                url,
                data,
            },
            configs,
        ),
    );
};
http.delete = function (url: string, data: any) {
    return http(
        Object.assign(
            {},
            {
                method: 'DELETE',
                url,
                data,
            },
        ),
    );
};
export default {
    http,
};
