import { http } from '@/utils/request';

// 登录
export function loginAPI(data: any) {
    return http.post('/login', data);
}

// 员工端上传文件

export function EMP_fileUploadAPI(data: any) {
    return http.post('/emp/common/fileUpload', data);
}

export default {
    loginAPI,
    EMP_fileUploadAPI,
};
