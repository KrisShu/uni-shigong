import { http } from '@/utils/request';

export function CUS_myProjectStatistics() {
    return http.post('/cus/personalCenter/myProjectStatistics');
}

// 修改密码
export function CUS_updatePwd(data: any) {
    return http.post('/cus/personalCenter/updatePwd', data);
}

// 退出登录
export function CUS_logout(data: any) {
    return http.post('/cus/personalCenter/logout', data);
}

// 修改发票信息
export function CUS_modifyInvoiceInfo(data: any) {
    return http.post('/cus/personalCenter/modifyInvoiceInfo', data);
}

// 获取发票信息回显
export function CUS_completeInvoiceInfo() {
    return http.post('/cus/personalCenter/completeInvoiceInfo');
}
export default {
    CUS_myProjectStatistics,
    CUS_updatePwd,
    CUS_logout,
    CUS_modifyInvoiceInfo,
    CUS_completeInvoiceInfo,
};
