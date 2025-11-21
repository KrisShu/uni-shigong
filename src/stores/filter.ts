// stores/filter.ts

import { defineStore } from 'pinia';
export const useFilterStore = defineStore('listFilter', {
    state: () => ({
        /**
         * 在要保存返回的特定选项时，按照页面要求 自行添加要保存的值
         */
        empIndexActiveTab: '', //员工项目列表当前激活的标签
        empIndexKeyword: '', //员工项目列表搜索关键字
        empPageNo: 1, //员工项目列表当前页码
        cusPageNo: 1, //客户项目列表当前页码
        pageName: '', // 当前页名称，用于区分不同页面的筛选存储
        scrollTop: 0, //当前滚动到 的位置
        ZG_scrollTop: 0, // 整改页面的滚动位置

        taskKeyword: '', //任务列表搜索关键字
        taskPageNo: 1,
        taskActiveTab: '',
        taskScrollTop: 0,

        ts: 0, // 时间戳
    }),
    actions: {
        set(partial: any) {
            Object.assign(this, partial, { ts: Date.now() });
        },
        clear() {
            this.$reset();
            uni.removeStorageSync('listFilter');
        },
    },
    // persist: true,
});
