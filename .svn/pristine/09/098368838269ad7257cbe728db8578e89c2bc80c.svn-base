<template>
    <view class="website-page">
        <view class="header" :class="{ 'with-shadow': hasShadow }">
            <image src="../../assets/images/website/logo2.png" class="logo" />

            <view class="nav-list">
                <view @click="changeTab(1)" class="nav-item nav-item1" :class="curTab === 1 ? 'active' : ''">Home</view>
                <view @click="changeTab(2)" class="nav-item nav-item2" :class="curTab === 2 ? 'active' : ''">
                    About
                </view>
                <view @click="changeTab(3)" class="nav-item nav-item3" :class="curTab === 3 ? 'active' : ''">
                    Projects
                </view>

                <view class="active-line" :style="{ left: left + '%' }"></view>
            </view>
        </view>

        <view class="chunk Home-wrap">
            <view class="image-box">
                <image class="img" :src="webSiteInfo.banner" mode="aspectFit" lazy-load></image>
            </view>
        </view>
        <!-- 关于我们 -->
        <view class="chunk about-us-wrap">
            <view class="title">
                <text class="text">About</text>
                <text class="title-line"></text>
            </view>
            <view class="content-wrap">
                <rich-text :nodes="webSiteInfo.introduce"></rich-text>
            </view>
        </view>

        <!-- 成功案例 -->
        <view class="chunk our-projects-wrap">
            <view class="title">
                <text class="text">Projects</text>
                <text class="title-line"></text>
            </view>
            <view class="swiper-wrap">
                <CardCarousel
                    v-model="cur"
                    :items="webSiteInfo.caseList"
                    height="692rpx"
                    :autoplay="true"
                    :interval="3800"
                />
            </view>
        </view>
        <!-- 底部 -->
        <view class="bottom-wrap">
            <view class="form-item">
                <view class="label">Contact：</view>
                <view class="value width">{{ webSiteInfo.name }}</view>
            </view>
            <view class="form-item">
                <view class="label">Phone：</view>
                <view class="value width">{{ webSiteInfo.phone }}</view>
            </view>
            <view class="form-item">
                <view class="label">Email：</view>
                <view class="value width">{{ webSiteInfo.email }}</view>
            </view>
            <view class="form-item">
                <view class="label">CompanyName：</view>
                <view class="value">{{ webSiteInfo.companyName }}</view>
            </view>
            <view class="form-item">
                <view class="label">Address：</view>
                <view class="value">{{ webSiteInfo.address }}</view>
            </view>

            <image src="../../assets/images/website/logo1.png" mode="aspectFill" class="logo"></image>
        </view>

        <movable-area class="bg">
            <movable-view :x="x" :y="y" direction="all">
                <view @click="toLogin" class="login-btn">Login</view>
            </movable-view>
        </movable-area>
    </view>
</template>
<script setup lang="ts">
    import CardCarousel from './CardCarousel.vue';
    import { ref, onMounted, onUnmounted, reactive } from 'vue';
    import API from '@/apis/index';

    const x = ref(0);
    const y = ref(560);

    const cur = ref(0);

    const curTab = ref(1);
    const left = ref(2);
    const sectionSelectors = ['.Home-wrap', '.about-us-wrap', '.our-projects-wrap'];
    const headerOffset = 80; // 与 changeTab 中 pageScrollTo 的偏移一致

    let isProgrammaticScroll = false;
    let programmaticTimer: number | null = null;
    let programmaticTargetScrollTop: number | null = null;
    let programmaticTargetTab: number | null = null;
    let lastProgrammaticAt = 0; // 时间戳 ms
    const changeTab = (index: number) => {
        curTab.value = index;
        if (index === 1) {
            left.value = 2;
        } else if (index === 2) {
            left.value = 32;
        } else if (index === 3) {
            left.value = 78;
        }

        // curTab.value = index;
        // left.value = ((index - 1) * 100) / 3; // 你的导航下划线移动逻辑（示例）

        // 定义对应块 class 映射
        const map: Record<number, string> = {
            1: '.Home-wrap',
            2: '.about-us-wrap',
            3: '.our-projects-wrap',
        };

        const targetClass = map[index];
        if (!targetClass) return;

        isProgrammaticScroll = true;
        programmaticTargetTab = index;
        lastProgrammaticAt = Date.now();
        if (programmaticTimer) {
            clearTimeout(programmaticTimer);
            programmaticTimer = null;
        }

        // 用选择器查找节点位置
        const q1 = uni.createSelectorQuery();
        q1.selectViewport()
            .scrollOffset((viewport: any) => {
                const currentScrollTop = viewport?.scrollTop ?? 0;

                const q2 = uni.createSelectorQuery();
                q2.select(targetClass)
                    .boundingClientRect((rect: any) => {
                        if (!rect) {
                            // 清除标记，防止长期屏蔽
                            programmaticTimer = window.setTimeout(() => {
                                isProgrammaticScroll = false;
                                programmaticTargetScrollTop = null;
                                programmaticTargetTab = null;
                                programmaticTimer = null;
                            }, 400);
                            return;
                        }
                        const targetScrollTop = Math.max(0, currentScrollTop + rect.top - headerOffset);
                        programmaticTargetScrollTop = targetScrollTop;
                        // duration 350ms -> 把标记延时到 duration + margin
                        const duration = 350;
                        uni.pageScrollTo({ scrollTop: targetScrollTop, duration });
                        programmaticTimer = window.setTimeout(() => {
                            isProgrammaticScroll = false;
                            programmaticTargetScrollTop = null;
                            programmaticTargetTab = null;
                            programmaticTimer = null;
                        }, duration + 80);
                    })
                    .exec();
            })
            .exec();
    };

    const webSiteInfo = reactive({
        introduce: '',
        banner: '',
        name: '',
        phone: '',
        email: '',
        companyName: '',
        address: '',
        caseList: [],
    });
    const BASEURL = import.meta.env.VITE_IMAGE_BASEURL;
    // websiteAPI
    const fetchData = async () => {
        const res = await API.websiteAPI();
        console.log('res', res);

        Object.assign(webSiteInfo, res.data);
        webSiteInfo.banner = BASEURL + webSiteInfo.banner;
        webSiteInfo.caseList.map((item: any) => {
            item.img = BASEURL + item.filePath;
            return item;
        });
    };

    const hasShadow = ref(false);
    let ticking = false;
    const handleScroll = () => {
        // 1）始终更新阴影（不受程序化保护影响）
        let scrollY = 0;
        if (typeof window !== 'undefined') {
            scrollY = window.scrollY ?? document.documentElement.scrollTop ?? document.body.scrollTop ?? 0;
        }
        hasShadow.value = scrollY > 70;

        // 2）若最近由 changeTab 发起程序化滚动，则在保护期内不由 scroll 覆盖 tab 状态
        const now = Date.now();
        // 若在保护期（根据时间戳判断）则直接返回（避免频繁 selector 查询）
        const PROTECT_MS = 450; // 若需要调整，请基于 pageScrollTo duration 调整
        if (now - lastProgrammaticAt < PROTECT_MS) {
            return;
        }
        // 另外若显式标记 isProgrammaticScroll，也直接返回
        if (isProgrammaticScroll) return;

        // 节流布局查询
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            try {
                const viewPoint = headerOffset + 10; // 参考线：header 底部 + 偏移

                if (typeof uni !== 'undefined' && uni.createSelectorQuery) {
                    const q = uni.createSelectorQuery();
                    q.selectAll(sectionSelectors.join(','))
                        .boundingClientRect((rects: any[]) => {
                            if (!rects || rects.length === 0) return;
                            let foundIndex = -1;
                            for (let i = 0; i < rects.length; i++) {
                                const r = rects[i];
                                if (!r) continue;
                                if (r.top <= viewPoint) foundIndex = i; // 取最后一个满足条件的
                            }
                            if (foundIndex === -1) foundIndex = 0;
                            const tabIndex = foundIndex + 1;

                            // 仅在非程序化保护期内更新 curTab
                            if (curTab.value !== tabIndex) {
                                curTab.value = tabIndex;
                                if (tabIndex === 1) left.value = 2;
                                else if (tabIndex === 2) left.value = 32;
                                else if (tabIndex === 3) left.value = 78;
                            }
                        })
                        .exec();
                } else if (typeof document !== 'undefined') {
                    const els = sectionSelectors.map(s => document.querySelector(s) as HTMLElement | null);
                    let foundIndex = -1;
                    for (let i = 0; i < els.length; i++) {
                        const el = els[i];
                        if (!el) continue;
                        const rect = el.getBoundingClientRect();
                        if (rect.top <= viewPoint) foundIndex = i;
                    }
                    if (foundIndex === -1) foundIndex = 0;
                    const tabIndex = foundIndex + 1;
                    if (curTab.value !== tabIndex) {
                        curTab.value = tabIndex;
                        if (tabIndex === 1) left.value = 2;
                        else if (tabIndex === 2) left.value = 32;
                        else if (tabIndex === 3) left.value = 78;
                    }
                }
            } finally {
                ticking = false;
            }
        });
    };
    onMounted(() => {
        if (typeof window !== 'undefined') {
            window.addEventListener('scroll', handleScroll, { passive: true });
            // 初始化一次（小延时，确保 DOM 渲染完）
            setTimeout(handleScroll, 80);
        }
    });
    onUnmounted(() => {
        if (typeof window !== 'undefined') {
            window.removeEventListener('scroll', handleScroll);
        }
        if (programmaticTimer) {
            clearTimeout(programmaticTimer);
            programmaticTimer = null;
        }
    });
    fetchData();

    const toLogin = () => {
        uni.navigateTo({
            url: '/pages/login/index',
        });
    };
</script>

<style lang="scss" scoped>
    .website-page {
        // overflow-x: hidden;
        padding-top: 96rpx;
        .header {
            background-color: #fff;
            position: fixed;
            top: 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10rpx 24rpx;
            box-sizing: border-box;
            left: 0;
            right: 0;
            z-index: 10;
            // 新增阴影样式
            &.with-shadow {
                box-shadow: 0 6rpx 10rpx rgba(0, 0, 0, 0.2);
            }
            .logo {
                width: 153rpx;
                height: 68rpx;
            }
            .nav-list {
                display: flex;
                gap: 48rpx;
                position: relative;
                .nav-item {
                    font-weight: 400;
                    font-size: 28rpx;
                    color: #909399;
                    line-height: 40rpx;

                    text-align: center;
                    &.nav-item1 {
                        width: 80rpx;
                    }
                    &.nav-item2 {
                        width: 138rpx;
                    }
                    &.nav-item3 {
                        width: 180rpx;
                    }
                    &.active {
                        color: #f7931e;
                        font-weight: 600;

                        color: #303133;
                    }
                }
                .active-line {
                    position: absolute;
                    width: 56rpx;
                    height: 4rpx;
                    background-color: #f7931e;
                    left: 10rpx;
                    top: 50rpx;
                    transform: translateX(0);
                    transition: all 0.3s;
                }
            }
        }

        .Home-wrap {
            height: 1076rpx;
            width: 100%;
            position: relative;
            z-index: 2;
            background-color: #ffffff;

            .image-box {
                width: 100%;
                height: 100%;
                background-color: #ffffff;
                .img {
                    width: 100%;
                    height: 100%;
                }
            }
        }
        .about-us-wrap,
        .our-projects-wrap {
            padding-top: 64rpx;
            position: relative;
            background-color: #ffffff;
            z-index: 2;
            .title {
                position: relative;
                height: 44rpx;
                margin-bottom: 42rpx;
                .text {
                    font-weight: 600;
                    font-size: 36rpx;
                    color: #303133;
                    line-height: 32rpx;
                    text-align: center;
                    display: block;
                    z-index: 2;
                    left: 50%;
                    transform: translateX(-50%);
                    position: absolute;
                }
                .title-line {
                    display: block;
                    width: 72rpx;
                    height: 8rpx;
                    background-color: #f7931e;
                    position: absolute;
                    left: 50%;
                    transform: translateX(-50%);
                    z-index: 1;
                    bottom: 10rpx;
                    border-radius: 10rpx;
                }
            }
        }
        .about-us-wrap {
            .content-wrap {
                padding: 0 32rpx;
                box-sizing: border-box;
                overflow: hidden;
                img {
                    width: 100% !important;
                    height: auto !important;
                }
            }
        }

        .our-projects-wrap {
        }

        .bottom-wrap {
            background: #303133;
            padding: 40rpx 32rpx;
            box-sizing: border-box;
            width: 100%;
            box-sizing: border-box;
            position: relative;
            margin-top: 64rpx;
            .form-item {
                font-weight: 400;
                font-size: 24rpx;
                color: #ffffff;
                line-height: 36rpx;
                display: flex;

                & + .form-item {
                    margin-top: 36rpx;
                }
                .value {
                    display: inline-block;
                    flex-wrap: wrap;

                    word-break: break-all;
                    white-space: pre-wrap;
                    &.width {
                        width: 46%;
                    }
                }
                .label {
                    padding-left: 48rpx;
                    position: relative;
                    height: 36rpx;
                    &::before {
                        content: '';
                        display: inline-block;
                        width: 36rpx;
                        height: 36rpx;
                        background-image: url('@/assets/images/website/icon4.png');
                        background-size: cover;
                        position: absolute;
                        left: 0;
                    }
                }
                &:nth-of-type(2) {
                    .label::before {
                        background-image: url('@/assets/images/website/icon3.png');
                    }
                }
                &:nth-of-type(3) {
                    .label::before {
                        background-image: url('@/assets/images/website/iocn5.png');
                    }
                }
                &:nth-of-type(4) {
                    .label::before {
                        background-image: url('@/assets/images/website/iocn2.png');
                    }
                }
                &:nth-of-type(5) {
                    .label::before {
                        background-image: url('@/assets/images/website/icon1.png');
                    }
                }
            }
            .logo {
                position: absolute;
                width: 188rpx;
                height: 98rpx;
                top: 40rpx;
                right: 32rpx;
            }
        }
        .bg {
            background-color: transparent;
            height: 90%;
            width: 100rpx;
            position: fixed;
            bottom: 0;
            right: 0;
            z-index: 5;
        }

        .login-btn {
            width: 88rpx;
            height: 88rpx;
            background: #f7931e;
            box-shadow: 0rpx 0rpx 9rpx 0rpx #f7931e;
            text-align: center;
            border-radius: 50%;
            line-height: 88rpx;
            color: #ffffff;
            font-weight: 600;
            font-size: 24rpx;
            color: #ffffff;
        }
    }
</style>
