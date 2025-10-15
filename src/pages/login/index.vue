<template>
    <view class="login-page">
        <!-- 顶部语言切换 -->
        <view class="lang-switch">
            <view class="lang-chip" :class="{ active: lang === 'zh-Hans' }" @tap="setLang('zh-Hans')">中</view>
            <view class="lang-chip" :class="{ active: lang === 'en' }" @tap="setLang('en')">EN</view>
        </view>

        <!-- 标题 -->
        <view class="title">{{ $t('login.title') }}</view>

        <!-- 插画 / Banner（自行替换图片地址或用 <image>） -->
        <view class="banner">
            <image class="banner-img" src="../../assets/images/login-img.png" mode="aspectFit" />
        </view>

        <!-- 表单 -->
        <view class="form">
            <!-- 账号 -->
            <view class="input-wrap">
                <view class="left-icon">
                    <image class="form-icon" src="../../assets/images/login-phone.png"></image>
                </view>
                <input
                    class="input"
                    type="text"
                    :placeholder="$t('login.account')"
                    placeholder-class="ph"
                    v-model="form.account"
                    confirm-type="next"
                />
            </view>

            <!-- 密码 -->
            <view class="input-wrap">
                <view class="left-icon">
                    <image class="form-icon" src="../../assets/images/login-password.png"></image>
                </view>
                <input
                    class="input"
                    :password="!showPwd"
                    type="text"
                    :placeholder="$t('login.password')"
                    placeholder-class="ph"
                    v-model="form.password"
                    confirm-type="done"
                />
                <!-- <view class="right-action" @tap="showPwd = !showPwd">
                    <text>{{ showPwd ? t('hide') : t('show') }}</text>
                </view> -->
            </view>

            <!-- 登录按钮 -->
            <button class="btn-login" :loading="loading" :disabled="loading" @tap="onSubmit">
                {{ $t('login.login') }}
            </button>
        </view>
    </view>
</template>

<script setup lang="ts">
    import { reactive, ref } from 'vue';
    import { i18n } from '@/main';
    import { useGlobalStore } from '@/stores/index';
    import API from '@/apis/index';
    import { aesEncrypt } from '@/utils/crypt';
    const GlobalStore = useGlobalStore();

    type Lang = 'zh-Hans' | 'en';
    const systemInfo = uni.getSystemInfoSync();
    const systemLocale = GlobalStore.locale || uni.getLocale();
    console.log('111', systemInfo, systemLocale);

    const lang = ref<Lang>(systemLocale as Lang);
    const showPwd = ref(false);
    const loading = ref(false);

    const form = reactive({
        account: '',
        password: '',
    });

    const setLang = (l: Lang) => {
        lang.value = l;

        i18n.global.locale = l;
        uni.setLocale(l);
        GlobalStore.setLocale(l);
    };

    // 提交骨架：你可以在这里衔接真实登录 API
    const onSubmit = async () => {
        if (!form.account || !form.password) {
            uni.showToast({ title: i18n.global.t('login.emptyMsg'), icon: 'none' });
            return;
        }
        try {
            loading.value = true;

            await fetchLogin();
        } catch (e) {
            console.log('error', e);
        } finally {
            loading.value = false;
        }
    };

    // 模拟请求
    const fetchLogin = async () => {
        console.log('form', form);
        const language = lang.value == 'zh-Hans' ? 0 : 1;
        const res = await API.loginAPI({
            userName: form.account,
            password: aesEncrypt(form.password),
            language,
        });
        GlobalStore.setUserInfo(res.data.userSession);
        GlobalStore.setToken(res.data.token);
        if (res.data.userSession.identityType === 0) {
            // 0-工人 1-客户
            uni.switchTab({ url: '/pages/index/index' });
        }
    };
</script>

<style scoped lang="scss">
    /* 页面整体 */
    .login-page {
        padding: 40rpx 32rpx 80rpx;
        min-height: 100vh;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        background: #ffffff;
    }

    /* 语言切换 */
    .lang-switch {
        display: flex;

        align-self: flex-end;
        width: 136rpx;
        height: 48rpx;
        background: #f5f6fa;
        border-radius: 24rpx;
    }
    .lang-chip {
        width: 68rpx;
        height: 48rpx;
        text-align: center;
        line-height: 48rpx;
        border-radius: 24rpx;
        font-size: 28rpx;
        font-size: 28rpx;
        color: #909399;
        &:first-of-type {
            margin-right: 10rpx;
        }
    }
    .lang-chip.active {
        color: #fff;
        background: #303133;
    }

    /* 标题 */
    .title {
        margin-top: 62rpx;
        font-weight: 600;
        font-size: 56rpx;
        color: #303133;
        line-height: 78rpx;
        text-align: center;
    }

    /* Banner */
    .banner {
        margin-top: 48rpx;
        height: 412rpx;

        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        .banner-img {
            width: 515rpx;
            height: 100%;
        }
    }

    /* 表单 */
    .form {
        margin-top: 53rpx;
        display: flex;
        flex-direction: column;
        gap: 64rpx;
        padding: 0 32rpx;
    }

    /* 输入框容器 */
    .input-wrap {
        display: flex;
        align-items: center;
        padding: 0 30rpx;
        position: relative;
        height: 88rpx;
        background: #f5f6fa;
        border-radius: 24rpx;
    }

    /* 左侧图标占位 */
    .left-icon {
        width: 40rpx;
        height: 40rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 16rpx;
        color: #9ca3af;
        .form-icon {
            width: 40rpx;
            height: 40rpx;
        }
    }

    /* 输入框 */
    .input {
        flex: 1;
        height: 100%;
        font-size: 28rpx;
        color: #111827;
    }

    /* 右侧操作（显示/隐藏密码） */
    .right-action {
        padding-left: 16rpx;
        color: #9ca3af;
        font-size: 26rpx;
    }

    /* 登录按钮 */
    .btn-login {
        width: 100%;
        margin-top: 32rpx;
        height: 88rpx;
        background: #f7931e;
        border-radius: 24rpx;
        line-height: 88rpx;
        font-weight: 600;
        font-size: 28rpx;
        color: #ffffff;
        &::after {
            border: none;
        }
    }
    .btn-login[disabled] {
        opacity: 0.8;
        background-color: #f7931e !important;
    }
</style>
