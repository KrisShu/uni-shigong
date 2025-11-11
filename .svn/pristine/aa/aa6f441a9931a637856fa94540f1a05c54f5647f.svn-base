// utils/image.ts
export interface CompressOpts {
    /** 期望单图最大体积（MB），超出才压缩；不传则无条件压缩 */
    maxSizeMB?: number;
    /** H5/canvas 最大边，默认 1600，越小体积越小 */
    maxWH?: number;
    /** 压缩质量（0–1 for canvas, 0–100 for uni.compressImage），默认 0.8/80 */
    quality?: number;
}

/** 判断是否需要压缩 */
function needCompress(size: number, maxSizeMB?: number) {
    if (!maxSizeMB) return true; // 未设置就直接压缩
    return size > maxSizeMB * 1024 * 1024;
}

/** H5: 用 canvas 压缩（可控尺寸+质量） */
async function compressByCanvas(src: string, maxWH = 1600, quality = 0.8): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous'; // 需要同源/允许跨域的图
        img.onload = () => {
            let { width, height } = img;
            // 按最长边等比缩放
            if (Math.max(width, height) > maxWH) {
                if (width > height) {
                    height = Math.round((height * maxWH) / width);
                    width = maxWH;
                } else {
                    width = Math.round((width * maxWH) / height);
                    height = maxWH;
                }
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d')!;
            ctx.drawImage(img, 0, 0, width, height);

            // 导出 JPEG（可改成 image/png）
            canvas.toBlob(
                blob => {
                    if (!blob) return reject(new Error('canvas 压缩失败'));
                    const url = URL.createObjectURL(blob);
                    resolve(url);
                },
                'image/jpeg',
                quality, // 0–1
            );
        };
        img.onerror = reject;
        img.src = src;
    });
}

/** 通用：压缩并返回新路径（各端兼容） */
export async function compressImageIfNeeded(path: string, size: number, opts: CompressOpts = {}): Promise<string> {
    const { maxSizeMB, maxWH = 1600, quality } = opts;

    if (!needCompress(size, maxSizeMB)) return path;

    // #ifdef H5
    // H5：canvas 更灵活（尺寸+质量）
    const blobUrl = await compressByCanvas(path, maxWH, quality ?? 0.8);
    return blobUrl;
    // #endif

    // 其它端统一走官方 API（quality: 0–100）
    const q = Math.min(100, Math.max(10, Math.round((quality ?? 0.8) * 100)));
    const compressed = await new Promise<string>((resolve, reject) => {
        uni.compressImage({
            src: path,
            quality: q,
            success: res => resolve((res as any).tempFilePath || (res as any).tempFilePaths?.[0]),
            fail: reject,
        });
    });
    return compressed;
}
