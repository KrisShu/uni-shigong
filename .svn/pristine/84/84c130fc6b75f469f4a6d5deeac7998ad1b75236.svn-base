import { http } from '@/utils/request';
// 我的需求 列表 接口
export function CUS_RequirementList(data: any) {
    return http.post('/cus/myDemand/list', data);
}

// 查看项目
export function CUS_ViewProject(data: any) {
    return http.post('/cus/myDemand/viewProject', data);
}
// 发布需求 接口
export function CUS_PublishDemand(data: any) {
    return http.post('/cus/myDemand/publishDemand', data);
}
// 修改需求 数据获取接口
export function CUS_GetUpdateDemand(data: any) {
    return http.post('/cus/myDemand/getUpdateDemand', data);
}
// 修改需求 接口
export function CUS_UpdateDemand(data: any) {
    return http.post('/cus/myDemand/updateDemand', data);
}
// 撤销需求 接口
export function CUS_CancelDemand(data: any) {
    return http.post('/cus/myDemand/cancelDemand', data);
}

export default {
    CUS_RequirementList,
    CUS_PublishDemand,
    CUS_GetUpdateDemand,
    CUS_UpdateDemand,
    CUS_CancelDemand,
    CUS_ViewProject,
};
