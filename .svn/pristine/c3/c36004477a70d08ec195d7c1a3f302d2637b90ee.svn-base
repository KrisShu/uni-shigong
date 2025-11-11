<template>
    <view class="page invoice-page" :style="{ height: contentHeight + 'px' }">
        <view class="pd-header common-cap">
            <!-- 示例：返回按钮 -->
            <view class="pd-back common-back" @click="Back"> </view>
            <text class="pd-title common-title">{{ $t('cus.invoice.title') }}</text>
        </view>

        <scroll-view
            class="scroll-content common-scroll-area"
            :scroll-y="true"
            :refresher-enabled="true"
            :refresher-triggered="refreshing"
            @refresherrefresh="onRefresh"
            @scrolltolower="onLoadMore"
            refresher-background="transparent"
        >
            <!-- 加载中 -->
            <view v-if="loading && page === 1" class="loading-box">
                <text class="loading-icon">⏳</text>
                <text class="loading-text">{{ $t('common.loading') }}</text>
            </view>

            <!-- 数据为空 -->
            <EmptyBox v-else-if="!loading && invoiceList.length === 0" />

            <view v-else>
                <view class="invoice-card" v-for="(invoice, index) in invoiceList" :key="index">
                    <!-- 开票时间 -->
                    <view class="info-row">
                        <text class="label">开票时间</text>
                        <text class="value">{{ invoice.creattime }}</text>
                    </view>
                    <!-- 开票金额 -->
                    <view class="info-row">
                        <text class="label">开票金额</text>
                        <text class="value">${{ invoice.amount }}</text>
                    </view>

                    <!-- 分割线 -->
                    <view class="divider"></view>

                    <!-- 下载发票按钮 -->
                    <view class="download-btn" @click="downloadInvoice(invoice.filePath)">
                        <text class="btn-text">下载发票</text>
                    </view>
                </view>
            </view>
        </scroll-view>
    </view>
</template>

<script setup lang="ts">
    import { ref, reactive } from 'vue';
    import EmptyBox from '@/components/EmptyBox/index.vue';
    import API from '@/apis/index';
    import { i18n } from '@/main';
    import { useSmartBack } from '@/hooks/useSmartBack';
    import { onLoad } from '@dcloudio/uni-app';
    import { useContentHeight } from '@/hooks/useContentHeight';
    import { aesDecrypt } from '@/utils/crypt';

    const { contentHeight } = useContentHeight(0); // 可自定义 tabBar 高度
    const { smartBack } = useSmartBack();

    const invoiceList = ref<any[]>([]);
    const currentProjectId = ref<any>(0);
    const page = ref(1);
    const loadingText = ref('');
    const refreshing = ref(false);
    const loading = ref(false); //
    const hasMore = ref(true); // 新增：是否还有更多数据

    const fetchData = async (reset = false) => {
        if (loading.value) return; // ✅ 防止重复加载
        loading.value = true;
        loadingText.value = i18n.global.t('common.loading');

        if (reset) {
            page.value = 1;
            invoiceList.value = [];
            hasMore.value = true; // 重置时认为还有更多，直到服务端返回判断
        }

        try {
            const res = await API.CUS_ProjectInvoiceList({
                id: currentProjectId.value,
                pageNo: page.value, //page.value
            });
            const newData = res.data.list || [];

            if (newData.length < res.data.pageSize) {
                console.log('没有更多数据了');
                hasMore.value = false;
                loadingText.value = i18n.global.t('common.no-more');
            } else {
                console.log('上拉加载更多');
                hasMore.value = true;
                loadingText.value = i18n.global.t('common.release');
            }
            if (reset) {
                invoiceList.value = newData;
            } else {
                invoiceList.value.push(...newData);
            }

            console.log('列表结果res', res);
        } catch (error) {
            console.log('列表结果error', error);
        } finally {
            refreshing.value = false;
            loading.value = false;
        }
    };

    const onRefresh = async () => {
        refreshing.value = true;
        await fetchData(true);
    };
    const onLoadMore = () => {
        if (!hasMore.value || loading.value) return;
        page.value++;
        fetchData();
    };

    const Back = () => {
        let fallback = '/pages/packageCustomer/index/proDetail/index';
        smartBack(fallback);
    };
    const BASEURL = import.meta.env.VITE_IMAGE_BASEURL;

    function downloadForH5(blobUrl: any, originalUrl: any) {
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = blobUrl;

        // 尝试从 URL 提取文件名
        const fileName = decodeURIComponent(originalUrl.split('/').pop()) || 'download';

        a.download = fileName; // 指定下载的文件名
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // 可选：释放 Blob URL 内存
        setTimeout(() => {
            URL.revokeObjectURL(blobUrl);
        }, 100);

        uni.showToast({ title: '开始下载' });
    }

    // 工具：取后缀
    function getExt(u = '') {
        const m = u.match(/\.([a-z0-9]+)(?:\?|#|$)/i);
        return (m?.[1] || '').toLowerCase();
    }

    // H5：在“点击事件”里同步打开
    function openInH5(url: string) {
        const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
        // iOS：同步导航，最不易被拦截
        if (isIOS) {
            window.location.href = url;
            return;
        }
        // 非 iOS：新窗口打开（预览/下载由服务端 headers 决定）
        const a = document.createElement('a');
        a.href = url;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    // APP：保存后打开（图片预览 / 文档 openDocument）
    function openInApp(savedFilePath: string, ext: string) {
        if (/^(png|jpe?g|gif|webp|bmp)$/.test(ext)) {
            uni.previewImage({ urls: [savedFilePath] });
            return;
        }
        uni.openDocument({
            filePath: savedFilePath,
            showMenu: true,
            fail: () => {
                // @ts-ignore
                plus.runtime.openFile(savedFilePath);
            },
        });
    }

    // === 你的入口函数，改成分平台处理 ===
    function downloadInvoice(path: string) {
        const url = BASEURL + path; // 若有鉴权token，建议加在query里：?token=xxx

        // #ifdef H5
        // H5：直接打开预览
        openInH5(url);
        return;
        // #endif

        // #ifdef APP-PLUS
        // App：下载->保存->打开
        uni.downloadFile({
            url,
            success: ({ tempFilePath, statusCode }) => {
                if (statusCode !== 200) return;
                const ext = getExt(path) || getExt(tempFilePath);
                uni.saveFile({
                    tempFilePath,
                    success: ({ savedFilePath }) => openInApp(savedFilePath, ext),
                    fail: () => uni.showToast({ title: '保存失败', icon: 'none' }),
                });
            },
            fail: () => uni.showToast({ title: '下载失败', icon: 'none' }),
        });
        // #endif
    }

    onLoad((options: any) => {
        currentProjectId.value = Number(aesDecrypt(options.id));
        fetchData(true);
    });
</script>
<style lang="scss" scoped>
    .invoice-page {
        display: flex;
        flex-direction: column;
        height: 100vh; /* 让页面占满可视高度 */
        overflow: hidden; /* 避免外层也滚动 */
    }

    .nav-back {
        position: absolute;
        left: 30rpx;
        top: 40rpx;
        z-index: 99;
        font-size: 40rpx;
        color: #333;
    }

    .page-title {
        margin-top: 40rpx;
        font-size: 40rpx;
        font-weight: bold;
        color: #333;
    }

    .invoice-card {
        background-color: white;
        border-radius: 24rpx;
        padding: 24rpx;
        margin-bottom: 24rpx;
        .info-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 28rpx;
            color: #909399;
            margin-bottom: 24rpx;
            .label {
                color: #909399;
            }
            .value {
                color: #303133;
            }
        }
        .divider {
            width: 100%;
            height: 1rpx;
            border-top: 1rpx dashed #e4e4e4;
            margin-top: 40rpx;

            display: block;
            position: relative;
            &::before,
            &::after {
                content: '';
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                width: 36rpx;
                height: 36rpx;
                border-radius: 50%;
                background-color: #f4f6f8;
            }
            &::before {
                left: -40rpx;
            }
            &::after {
                right: -40rpx;
            }
        }
    }

    .download-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 24rpx;
        color: #303133;
        margin-top: 20rpx;
        cursor: pointer;
        .btn-text {
            position: relative;
            padding-left: 45rpx;
            &::before {
                content: '';
                background-image: url('@/assets/images/download.png');
                background-size: cover;
                display: block;
                width: 35rpx;
                height: 37rpx;
                position: absolute;
                left: 0;
            }
        }
    }
</style>
