// src/utils/uploader.ts
import { useGlobalStore } from '@/stores';

const store = useGlobalStore();
const BASEURL = import.meta.env.VITE_SERVER_BASEURL;

/**
 * 上传单张文件，返回服务器上的 URL
 * @param localPath 本地临时路径
 * @param options   { url, fieldName, headers, formData, imageBase }
 */
export function uploadOne(
    localPath: string,
    options?: {
        url?: string;
        fieldName?: string;
        headers?: Record<string, string>;
        formData?: Record<string, any>;
        imageBase?: string; // 后端返回相对路径时用来补全域名
    },
): Promise<string> {
    const {
        url = `${BASEURL}/emp/common/fileUpload`,
        fieldName = 'file',
        headers = {},
        formData = {},
        imageBase = import.meta.env.VITE_IMAGE_BASEURL || '',
    } = options || {};

    return new Promise((resolve, reject) => {
        const task = uni.uploadFile({
            url,
            filePath: localPath,
            name: fieldName,
            formData,
            header: {
                Accept: 'application/json',
                token: store?.token || '',
                ...headers,
            },
            success: res => {
                try {
                    if (res.statusCode !== 200) return reject(`HTTP ${res.statusCode}`);
                    const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
                    // 约定：{ code:2000, data:'相对或绝对URL' }
                    if (data?.code === 2000) {
                        const raw = data.data.filePath;
                        const finalUrl = raw;
                        if (!finalUrl) return reject('上传成功但未返回地址');
                        resolve(finalUrl);
                    } else {
                        reject(data?.msg || '上传失败');
                    }
                } catch {
                    reject('返回解析失败');
                }
            },
            fail: err => reject(err?.errMsg || '上传失败'),
        });

        // 如需进度： task?.onProgressUpdate?.(({progress}) => console.log(progress))
    });
}
