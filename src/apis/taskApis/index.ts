import { http } from '@/utils/request';

// 我的任务 列表 接口
export function EMP_TaskList(data: any) {
    return http.post('/emp/myTask/getList', data);
}

// 开启任务
export function EMP_startTask(data: any) {
    return http.post('/emp/myTask/startTask', data);
}
// 结束任务
export function EMP_endTask(data: any) {
    return http.post('/emp/myTask/endTask', data);
}

// 获取任务类型
export function EMP_getTaskType() {
    return http.post('/emp/myTask/getTaskType');
}
export default {
    EMP_TaskList,
    EMP_startTask,
    EMP_endTask,
    EMP_getTaskType,
};
