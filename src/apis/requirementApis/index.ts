import { http } from '@/utils/request';

// 我的项目 列表 接口
export function EMP_ProjectList(data: any) {
    return http.post('/emp/project/list', data);
}
// 我的项目 项目详情
export function EMP_ProjectDetail(data: any) {
    return http.post('/emp/project/detail', data);
}

// 项目的启动信息获取
export function EMP_ProjectStartProjectRecord(data: any) {
    return http.post('/emp/project/startProjectRecord', data);
}

//项目启动 第一步 安全告知 点击确认
export function EMP_ProjectSafeguardRead(data: any) {
    return http.post('/emp/project/safeguardRead', data);
}

// 项目启动 第二步 保存设备检查答案
export function EMP_ProjectEquipmentCheck(data: any) {
    return http.post('/emp/project/equipmentCheck', data);
}

// 项目启动 第三步 确认施工场地
export function EMP_ProjectConfirmConstructionSite(data: any) {
    return http.post('/emp/project/confirmConstructionSite', data);
}

// 项目详情 更新进度
export function EMP_ProjectUpdateProgress(data: any) {
    return http.post('/emp/project/updateProgress', data);
}

// 项目详情 保存施工结束内容
export function EMP_ProjectConstructionEndSave(data: any) {
    return http.post('/emp/project/constructionEndSave', data);
}

// 获取当日的打卡记录
export function EMP_ProjectClockRecord(data: any) {
    return http.post('/emp/project/clockRecord', data);
}

// 打卡 施工签到
export function EMP_ProjectConstructionSignIn(data: any) {
    return http.post('/emp/project/constructionSignIn', data);
}

// 打卡 施工签退
export function EMP_ProjectConstructionSignOut(data: any) {
    return http.post('/emp/project/constructionSignOut', data);
}

// 历史签到记录
export function EMP_ProjectHistorySignInRecordList(data: any) {
    return http.post('/emp/project/historySignInRecordList', data);
}

//施工 添加施工记录
export function EMP_ProjectAddConstructionProgress(data: any) {
    return http.post('/emp/project/addConstructionProgress', data);
}
// 施工 添加问题反馈
export function EMP_ProjectAddQuestionFeedback(data: any) {
    return http.post('/emp/project/addQuestionFeedback', data);
}
// 施工记录列表
export function EMP_ProjectConstructionList(data: any) {
    return http.post('/emp/project/constructionList', data);
}

// 验收列表
export function EMP_ProjectAcceptanceList(data: any) {
    return http.post('/emp/project/acceptanceList', data);
}
export default {
    EMP_ProjectList,
    EMP_ProjectDetail,
    EMP_ProjectStartProjectRecord,
    EMP_ProjectSafeguardRead,
    EMP_ProjectEquipmentCheck,
    EMP_ProjectConfirmConstructionSite,
    EMP_ProjectUpdateProgress,
    EMP_ProjectConstructionEndSave,
    EMP_ProjectClockRecord,
    EMP_ProjectConstructionSignIn,
    EMP_ProjectConstructionSignOut,
    EMP_ProjectHistorySignInRecordList,
    EMP_ProjectAddConstructionProgress,
    EMP_ProjectAddQuestionFeedback,
    EMP_ProjectConstructionList,
    EMP_ProjectAcceptanceList,
};
