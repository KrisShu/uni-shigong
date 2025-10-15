// 定义通用函数类型
type AnyFunction = (...args: any[]) => any;

/**
 * 防抖函数（TS 版本）
 * @param fn - 要防抖的函数
 * @param wait - 延迟时间（毫秒）
 * @param immediate - 是否立即执行（首次触发时）
 * @returns 返回包装后的防抖函数
 */
export function debounce<F extends AnyFunction>(
    fn: F,
    wait: number,
    immediate: boolean = false,
): (...args: Parameters<F>) => void {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    return function (this: ThisParameterType<F>, ...args: Parameters<F>): void {
        const context = this;

        if (timeout) {
            clearTimeout(timeout);
        }

        if (immediate) {
            const callNow = !timeout;
            timeout = setTimeout(() => {
                timeout = null;
            }, wait);

            if (callNow) {
                fn.apply(context, args);
            }
        } else {
            timeout = setTimeout(() => {
                fn.apply(context, args);
            }, wait);
        }
    };
}

export function getNowTimeStr(type: string = 'yyyy-MM-dd HH:mm:ss'): string {
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');

    if (type === 'HH:mm:ss') {
        return `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    }
    if (type === 'yyyy-MM-dd') {
        return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    }
    if (type === 'start') {
        const year = now.getFullYear() - 10;
        return `${year}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    }
    if (type === 'end') {
        const year = now.getFullYear() + 10;
        return `${year}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    }

    return (
        `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ` +
        `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
    );
}
