// src/utils/photo.ts
export interface PhotoFile {
    path: string; // 本地临时路径
    size: number; // 字节
    mime?: string; // 可能为空（部分端没有）
    ext: string; // 扩展名（小写）
}

/** 获取扩展名（不含 .） */
export function getExtByPath(p: string): string {
    return (p?.split('?')[0].match(/\.([a-zA-Z0-9]+)$/)?.[1] || '').toLowerCase();
}

/** 拍照（仅相机），成功返回一张图片文件信息；用户取消返回 'CANCEL' */
export function takePhoto(opts?: {
    compressed?: boolean;
}): Promise<{ path: string; size: number; mime?: string } | null> {
    const { compressed = true } = opts || {};
    return new Promise((resolve, reject) => {
        uni.chooseImage({
            count: 1,
            sizeType: [compressed ? 'compressed' : 'original'],
            sourceType: ['camera'],
            success: res => {
                // H5 某些内核会 success 但没有文件
                const files: any[] = Array.isArray(res.tempFiles)
                    ? res.tempFiles
                    : res.tempFiles
                    ? [res.tempFiles]
                    : [];
                const f: any = files[0];
                if (!f) return resolve(null); // ← 视为取消
                const path = f.path || f.tempFilePath || (res.tempFilePaths && res.tempFilePaths[0]) || '';
                const size = f.size ?? 0;
                const mime = f.type;
                if (!path) return resolve(null); // ← 视为取消

                resolve({ path, size, mime });
            },
            fail: err => {
                // 统一当取消处理（不抛错，直接返回 null）
                const msg = err?.errMsg || '';
                if (msg.includes('cancel') || msg.includes('denied') || msg.includes('auth')) {
                    return resolve(null);
                }
                return resolve(null);
            },
        });
    });
}

/** 校验图片（类型 + 大小），不通过抛错；通过则无返回 */
export function validateImage(
    file: Pick<PhotoFile, 'ext' | 'mime' | 'size'>,
    options?: { acceptExt?: string[]; maxMB?: number },
): void {
    const accept = (options?.acceptExt || ['png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp']).map(s => s.toLowerCase());
    const maxBytes = (options?.maxMB ?? 5) * 1024 * 1024;

    const isTypeOk = (file.mime && file.mime.startsWith('image/')) || (file.ext && accept.includes(file.ext));
    if (!isTypeOk) {
        throw new Error(`仅支持图片类型：${accept.join('/')}`);
    }
    if (file.size > maxBytes) {
        throw new Error(`图片不能超过 ${options?.maxMB ?? 5}MB`);
    }
}
