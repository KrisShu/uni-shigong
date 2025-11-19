<template>
    <view class="cropper-mask">
        <view class="cropper-panel">
            <view class="cropper-header">
                <text>调整头像</text>
            </view>

            <view class="cropper-body">
                <view class="cropper-area" id="cropperArea">
                    <movable-area class="mv-area" :scale-area="true">
                        <movable-view
                            class="mv-view"
                            direction="all"
                            :inertia="true"
                            :scale="true"
                            :out-of-bounds="true"
                            :scale-min="minScale"
                            :scale-max="6"
                            :x="x"
                            :y="y"
                            :scale-value="scale"
                            @change="onMove"
                            @scale="onScale"
                            :style="{ width: displayW + 'px', height: displayH + 'px' }"
                        >
                            <image
                                class="crop-img"
                                :src="src"
                                mode="aspectFit"
                                :style="{ width: displayW + 'px', height: displayH + 'px' }"
                            />
                        </movable-view>

                        <!-- 中间裁剪框：正方形 + 居中 + 动态尺寸 -->
                        <view
                            class="crop-box"
                            :style="{
                                width: boxSize + 'px',
                                height: boxSize + 'px',
                                left: boxLeft + 'px',
                                top: boxTop + 'px',
                            }"
                        ></view>

                        <!-- 遮罩：根据裁剪框动态计算 -->
                        <view class="mask top" :style="{ height: boxTop + 'px' }"></view>
                        <view class="mask bottom" :style="{ height: boxTop + 'px' }"></view>
                        <view
                            class="mask left"
                            :style="{
                                top: boxTop + 'px',
                                bottom: boxTop + 'px',
                                width: boxLeft + 'px',
                            }"
                        ></view>
                        <view
                            class="mask right"
                            :style="{
                                top: boxTop + 'px',
                                bottom: boxTop + 'px',
                                width: boxLeft + 'px',
                            }"
                        ></view>
                    </movable-area>
                </view>
            </view>

            <view class="cropper-footer">
                <view class="btn cancel" @click="onCancel">取消</view>
                <view class="btn confirm" @click="onConfirm">确定</view>
            </view>
        </view>

        <canvas
            class="hidden-canvas"
            canvas-id="avatarCanvas"
            id="avatarCanvas"
            :style="{ width: cropWidth + 'px', height: cropHeight + 'px' }"
        ></canvas>
    </view>
</template>

<script setup lang="ts">
    import { ref, onMounted, onUnmounted, getCurrentInstance, computed } from 'vue';
    import { uploadOne } from '@/utils/uploader';

    const props = withDefaults(
        defineProps<{
            src: string;
            cropWidth?: number; // 导出图片宽
            cropHeight?: number; // 导出图片高
            cropBoxSize?: number; // 中间裁剪视窗边长（正方形），单位 px，默认 300
            platform?: 'emp' | 'cus'; // 上传平台，默认 emp
        }>(),
        {
            cropWidth: 300,
            cropHeight: 300,
            cropBoxSize: 300,
            platform: 'emp',
        },
    );

    const UPLOAD_URL =
        props.platform === 'emp'
            ? `${import.meta.env.VITE_SERVER_BASEURL.replace(/\/+$/, '')}/emp/common/fileUpload`
            : `${import.meta.env.VITE_SERVER_BASEURL.replace(/\/+$/, '')}/cus/common/fileUpload`;

    const emit = defineEmits<{
        (e: 'cancel'): void;
        (e: 'done', fileObj: { path: string; url: string }): void;
    }>();

    // 导出图像尺寸
    const cropWidth = props.cropWidth ?? 300;
    const cropHeight = props.cropHeight ?? 300;

    // 想要的裁剪视窗目标大小（正方形边长）
    const targetBoxSize = props.cropBoxSize ?? 300;

    // movable-view 位移 & 缩放
    const x = ref(0);
    const y = ref(0);
    const scale = ref(1);
    const minScale = ref(1);
    let baseScale = 1; // 图片基础缩放（让短边覆盖裁剪框）

    // 裁剪区域尺寸
    const areaW = ref(0);
    const areaH = ref(0);

    // 原图尺寸
    const imgW = ref(0);
    const imgH = ref(0);

    // 显示尺寸只用 baseScale（缩放由 movable-view 控制）
    const displayW = computed(() => imgW.value * baseScale);
    const displayH = computed(() => imgH.value * baseScale);

    // 中间裁剪框的实际像素尺寸和位置
    const boxSize = ref(300); // 实际边长 px（会根据屏幕大小做 min 限制）
    const boxLeft = ref(0); // 裁剪框左上角在 cropper-area 内的 x
    const boxTop = ref(0); // 裁剪框左上角在 cropper-area 内的 y

    const instance = getCurrentInstance();

    // 初始化：测量区域 + 计算裁剪框 + 计算基础缩放
    const init = () => {
        if (!props.src) return;

        uni.createSelectorQuery()
            .in(instance)
            .select('#cropperArea')
            .boundingClientRect((rect: any) => {
                if (!rect) return;

                areaW.value = rect.width;
                areaH.value = rect.height;

                // 1）根据容器尺寸和目标 size 计算实际裁剪框边长（防止超出容器）
                const maxPossibleSize = Math.min(areaW.value, areaH.value);
                boxSize.value = Math.min(targetBoxSize, maxPossibleSize);

                // 2）让裁剪框居中
                boxLeft.value = (areaW.value - boxSize.value) / 2;
                boxTop.value = (areaH.value - boxSize.value) / 2;

                // 3）获取图片信息并计算基础缩放
                uni.getImageInfo({
                    src: props.src,
                    success(info) {
                        imgW.value = info.width;
                        imgH.value = info.height;
                        if (!info.width || !info.height) return;

                        // 以短边为基准，让短边刚好覆盖裁剪框
                        const minSide = Math.min(info.width, info.height);
                        baseScale = boxSize.value / minSide;

                        // movable-view 初始缩放为 1
                        minScale.value = 1;
                        scale.value = 1;

                        // 初始显示尺寸（只用 baseScale）
                        const initialDisplayW = info.width * baseScale;
                        const initialDisplayH = info.height * baseScale;

                        // 居中放置整张图
                        x.value = (areaW.value - initialDisplayW) / 2;
                        y.value = (areaH.value - initialDisplayH) / 2;
                    },
                });
            })
            .exec();
    };

    onMounted(() => {
        init();
    });

    // 拖动事件
    const onMove = (e: any) => {
        x.value = e.detail.x;
        y.value = e.detail.y;
    };

    // 缩放事件
    const onScale = (e: any) => {
        scale.value = e.detail.scale;
    };

    // 确定裁剪
    const onConfirm = () => {
        if (!props.src || imgW.value === 0) return;

        // 实际总缩放：基础缩放 * 用户缩放
        const actualScale = baseScale * scale.value;

        // 裁剪框在原图中的起点 & 尺寸
        const cropX = (boxLeft.value - x.value) / actualScale;
        const cropY = (boxTop.value - y.value) / actualScale;
        const cropW = boxSize.value / actualScale;
        const cropH = boxSize.value / actualScale;

        // 防止越界
        const sx = Math.max(0, cropX);
        const sy = Math.max(0, cropY);
        const sWidth = Math.min(imgW.value - sx, cropW);
        const sHeight = Math.min(imgH.value - sy, cropH);

        const ctx = uni.createCanvasContext('avatarCanvas', instance);
        ctx.clearRect(0, 0, cropWidth, cropHeight);
        ctx.drawImage(props.src, sx, sy, sWidth, sHeight, 0, 0, cropWidth, cropHeight);

        ctx.draw(false, () => {
            uni.canvasToTempFilePath(
                {
                    canvasId: 'avatarCanvas',
                    x: 0,
                    y: 0,
                    width: cropWidth,
                    height: cropHeight,
                    destWidth: cropWidth,
                    destHeight: cropHeight,
                    success: async res => {
                        const remoteUrlObj = await uploadOne(res.tempFilePath, { uploadUrl: UPLOAD_URL });
                        console.log('remoteUrlObj', remoteUrlObj);
                        emit('done', remoteUrlObj);
                    },
                    fail: () => {
                        uni.showToast({ title: '裁剪失败', icon: 'none' });
                    },
                },
                instance,
            );
        });
    };

    const onCancel = () => {
        emit('cancel');
    };

    // H5 鼠标滚轮缩放（仅 H5 有效）
    const WHEEL_STEP = 0.1;
    const MAX_SCALE = 6;

    function handleWheel(e: WheelEvent) {
        console.log('wheel', e);
        e.preventDefault();
        const dir = e.deltaY > 0 ? -1 : 1;
        console.log('dir', dir);
        let next = scale.value + dir * WHEEL_STEP;
        console.log('next scale', next);
        if (next < minScale.value) next = minScale.value;
        if (next > MAX_SCALE) next = MAX_SCALE;
        scale.value = next;
    }

    onMounted(() => {
        const el = document.getElementById('cropperArea');
        if (el) {
            el.addEventListener('wheel', handleWheel, { passive: false });
        }
    });

    onUnmounted(() => {
        const el = document.getElementById('cropperArea');
        if (el) {
            el.removeEventListener('wheel', handleWheel);
        }
    });
</script>

<style scoped lang="scss">
    .cropper-mask {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.65);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
    }

    .cropper-panel {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        background: #ffffff;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }

    .cropper-header {
        padding: 24rpx 32rpx;
        font-size: 32rpx;
        font-weight: 600;
        text-align: center;
        border-bottom: 1px solid #f2f3f5;
        flex-shrink: 0;
    }

    .cropper-body {
        flex: 1;
        box-sizing: border-box;
        min-height: 0;
        overflow: hidden;
    }

    .cropper-area {
        width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden;
        cursor: grab;
        background-color: #ffffff;
    }

    .mv-area {
        width: 100%;
        height: 100%;
        position: relative;
    }

    .crop-img {
        width: 100%;
        height: 100%;
    }

    /* 裁剪框：正方形 + 圆形边框，只负责展示，不截事件 */
    .crop-box {
        position: absolute;
        border: 2rpx solid #f7931e;
        box-sizing: border-box;
        z-index: 3;
        // border-radius: 9999rpx;
        pointer-events: none;
    }

    /* 遮罩层：只负责遮挡，不截事件 */
    .mask {
        position: absolute;
        background: rgba(0, 0, 0, 0.45);
        z-index: 2;
        pointer-events: none;
    }
    .mask.top {
        left: 0;
        right: 0;
        top: 0;
    }
    .mask.bottom {
        left: 0;
        right: 0;
        bottom: 0;
    }
    .mask.left {
        left: 0;
    }
    .mask.right {
        right: 0;
    }

    .cropper-footer {
        padding: 16rpx 32rpx 24rpx;
        display: flex;
        justify-content: space-between;
        gap: 24rpx;
        flex-shrink: 0;
    }

    .btn {
        flex: 1;
        text-align: center;
        padding: 20rpx 0;
        border-radius: 999rpx;
        font-size: 28rpx;
    }
    .btn.cancel {
        border: 1rpx solid #dcdfe6;
        color: #606266;
    }
    .btn.confirm {
        background: #f7931e;
        color: #fff;
    }

    .hidden-canvas {
        position: absolute;
        width: 1px;
        height: 1px;
        left: -9999px;
        top: -9999px;
    }
</style>
