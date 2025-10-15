import { http } from '@/utils/request';

export function loginAPI(data: any) {
    return http.post('/login', data);
}

export default { loginAPI };
