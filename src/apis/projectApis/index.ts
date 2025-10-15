import { http } from '@/utils/request';

// 我的项目 列表 接口
export function EMP_ProjectList(data: any) {
    return http.post('/emp/project/list', data);
}

export default { EMP_ProjectList };
