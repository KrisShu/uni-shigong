import { http } from '@/utils/request';
// 我的项目 列表 接口
export function CUS_ProjectList(data: any) {
    return http.post('/cus/project/list', data);
}

// 我的项目 详情 获取接口
export function CUS_ProjectDetail(data: any) {
    return http.post('/cus/project/detail', data);
}
// 我的项目 历史签到记录列表
export function CUS_ProjectHistorySignInRecordList(data: any) {
    return http.post('/cus/project/historySignInRecordList', data);
}

// 我的项目 施工记录列表
export function CUS_ProjectConstructionList(data: any) {
    return http.post('/cus/project/constructionList', data);
}

// 我的项目 验收列表
export function CUS_ProjectAcceptanceList(data: any) {
    return http.post('/cus/project/acceptanceList', data);
}

// 查看发票列表
export function CUS_ProjectInvoiceList(data: any) {
    return http.post('/cus/project/invoiceList', data);
}
export default {
    CUS_ProjectList,
    CUS_ProjectDetail,
    CUS_ProjectHistorySignInRecordList,
    CUS_ProjectConstructionList,
    CUS_ProjectAcceptanceList,
    CUS_ProjectInvoiceList,
};
