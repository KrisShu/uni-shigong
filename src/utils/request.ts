// http.ts
import { useGlobalStore } from '@/stores';
import { aesEncrypt } from '@/utils/crypt';
import CryptoJS from 'crypto-js';
import { getBizMsgByCode } from './code'; // 路径按你项目放

const tip = (msg: string) => uni.showToast({ title: msg, icon: 'none', duration: 2000 });

/** 鉴权统一处理：返回 true 表示已处理（需拦截） */
function needAuthorize(info: any): boolean {
    const GlobalStore = useGlobalStore();
    const code = info?.code;

    /**
     * 
        1001	token未传入
        1002	token解析失败非法token
        1003	账号信息过期，请重新登录！
        1004	系统异常
        1009	用户被挤了
     */
    // 未登录 / 过期 / 被顶
    if (code === 1001 || code === 1002 || code === 1003 || code === 1009) {
        tip(info?.msg || '登录状态失效，请重新登录');
        GlobalStore.loginOut();
        return true;
    }

    return false;
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface HttpOptions<TData = any> {
    url: string;
    method?: HttpMethod;
    data?: TData;
    header?: Record<string, string>;
    timeout?: number;
    hidetips?: boolean;
    /** 是否加密 body（POST/PUT/PATCH 有意义） */
    encrypt?: boolean;
}

export function http<TResp = any, TData = any>(opts: HttpOptions<TData>) {
    const GlobalStore = useGlobalStore();
    const baseURL = import.meta.env.VITE_SERVER_BASEURL as string;
    const { url, method = 'GET', data, header, timeout = 20000, hidetips = false, encrypt = false } = opts;

    // 组装 URL（避免多/或无/）
    const fullURL = baseURL.replace(/\/+$/, '') + '/' + url.replace(/^\/+/, '');

    // 构造 data（加密仅示例：按你们约定即可）
    let payload: any = data;
    if (encrypt && (method === 'POST' || method === 'PUT')) {
        const iv = CryptoJS.lib.WordArray.random(16);
        payload = {
            cipherText: aesEncrypt(JSON.stringify(data ?? {}), iv),
            base64Iv: iv.toString(CryptoJS.enc.Base64),
            clearText: data, // ⚠️ 生产不要传明文
        };
    }

    const finalHeader = {
        'Content-Type': 'application/json',
        token: GlobalStore.token || '',
        ...(header || {}),
    };

    return new Promise<TResp>((resolve, reject) => {
        uni.request({
            url: fullURL,
            method,
            data: payload,
            header: finalHeader,
            timeout,
            success(res) {
                // HTTP 层
                if (res.statusCode !== 200) {
                    if (!hidetips) tip(`HTTP ${res.statusCode}`);
                    reject({ code: res.statusCode, msg: 'HTTP_ERROR', data: res.data });
                    return;
                }

                const body: any = res.data;

                // 业务层
                if (body?.code === 2000) {
                    resolve(body as TResp);
                    return;
                }

                // 鉴权/未授权等
                if (needAuthorize(body)) {
                    reject(body);
                    return;
                }

                // console.log('业务层：', body);
                // 其它业务错误
                if (!hidetips) {
                    const bizMsg = getBizMsgByCode(body?.code, body?.msg ?? '请求失败，请重试');
                    tip(bizMsg!);
                }

                reject(body);
            },
            fail(err) {
                if (!hidetips) {
                    tip(err?.errMsg?.includes('timeout') ? '请求超时，请重试' : '请求失败，请重试');
                }
                reject(err);
            },
        });
    });
}

// 便捷方法
http.post = function <TResp = any, TData = any>(url: string, data?: TData, configs?: Partial<HttpOptions<TData>>) {
    return http<TResp, TData>({ url, method: 'POST', data, encrypt: true, ...(configs || {}) });
};
http.get = function <TResp = any, TData = Record<string, any>>(
    url: string,
    data?: TData,
    configs?: Partial<HttpOptions<TData>>,
) {
    return http<TResp, TData>({ url, method: 'GET', data, ...(configs || {}) });
};
http.delete = function <TResp = any, TData = any>(url: string, data?: TData, configs?: Partial<HttpOptions<TData>>) {
    return http<TResp, TData>({ url, method: 'DELETE', data, ...(configs || {}) });
};
export default { http };
