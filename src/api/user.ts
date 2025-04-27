import axios from 'axios';
import {useRouter} from 'vue-router'
const router = useRouter()
// 创建 Axios 实例
export const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 通用响应结构
export interface ApiResponse<T = any> {
    code: string;
    message: string;
    data: T;
}

// 对应 Java 中的 AccountVO
export interface AccountVO {
    id?: number; // 新建用户时可能不传
    username: string;
    password?: string; // 登录时需要，其他情况可能忽略
    name: string;
    avatar?: string;
    role?: string;
    telephone?: string;
    email?: string;
    location?: string;
}
//用户信息
export interface Userinfo{
    username: string;
    password: string;
    name: string;
    role: string;
    avatar: string;
    telephone: string;
    email: string;
    location: string;
}
//配置拦截器
apiClient.interceptors.request.use(
    config => {
        const token = sessionStorage.getItem('token')
        if (token) {
            config.headers['token'] = token  // 👈 后端要求的字段名
        }
        return config
    },

)
// 响应拦截器：统一处理 401 未登录
apiClient.interceptors.response.use(
    response => {
        return response
    },
    error => {
        if (error.response && error.response.status === 401) {
            console.warn('未授权，登录失效')
            alert('登录失效，请重新登录')
            sessionStorage.removeItem('token')
            router.push('/login')
        }

    }
)

// 获取用户详情
export const getUser = (username: string) => {
    return apiClient.get<ApiResponse<Userinfo>>(`/accounts/${username}`);
};

// 创建新用户
export const createUser = (account: AccountVO) => {
    return apiClient.post<ApiResponse<string>>('/accounts', account);
};

// 更新用户信息
export const updateUser = (account: AccountVO) => {
    return apiClient.put<ApiResponse<string>>('/accounts', account);
};

// 登录（使用 application/x-www-form-urlencoded）
export const login = (username: string, password: string) => {
    return apiClient.post<ApiResponse<string>>('/accounts/login', {
        username,
        password,
    });
};


