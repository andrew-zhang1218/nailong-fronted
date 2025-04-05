import axios from 'axios';

// 创建 Axios 实例
const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 通用响应结构
export interface ApiResponse<T = any> {
    code: number;
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

// 获取用户详情
export const getUser = (username: string) => {
    return apiClient.get<ApiResponse<AccountVO>>(`/accounts/${username}`);
};

// 创建新用户
export const createUser = (account: AccountVO) => {
    return apiClient.post<ApiResponse<AccountVO>>('/accounts', account);
};

// 更新用户信息
export const updateUser = (account: AccountVO) => {
    return apiClient.put<ApiResponse<AccountVO>>('/accounts', account);
};

// 登录（使用 application/x-www-form-urlencoded）
export const login = (username: string, password: string) => {
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);

    return apiClient.post<ApiResponse<AccountVO>>('/accounts/login', params, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });
};

