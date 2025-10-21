import { http } from '@/utils/request';

// 我的项目 统计
export function EMP_myProjectStatistics() {
    return http.post('/emp/personalCenter/myProjectStatistics');
}

// 待办项 统计
// /emp/personalCenter/todo
export function EMP_todo() {
    return http.post('/emp/personalCenter/todo');
}

// 修改密码
export function EMP_updatePwd(data: any) {
    return http.post('/emp/personalCenter/updatePwd', data);
}

// 退出登录
export function EMP_logout(data: any) {
    return http.post('/emp/personalCenter/logout', data);
}

// 整改列表
export function EMP_getRectifyList(data: any) {
    return http.post('/emp/rectify/getList', data);
}
// 完成整改
export function EMP_rectifySubmit(data: any) {
    return http.post('/emp/rectify/rectifySubmit', data);
}

// 延期列表
export function EMP_getDelayWarningList(data: any) {
    return http.post('/emp/delayWarning/getList', data);
}
export default {
    EMP_myProjectStatistics,
    EMP_todo,
    EMP_updatePwd,
    EMP_logout,
    EMP_getRectifyList,
    EMP_rectifySubmit,
    EMP_getDelayWarningList,
};
