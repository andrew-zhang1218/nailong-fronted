import {apiClient,ApiResponse}from './user';

export interface Advertisement{
    id: number;
    title: string;
    content: string;
    image_url: string;
    product_id: number;
}

// 1. 获取广告列表
export const getAllAdvertisements = () => {
    return apiClient.get<ApiResponse<Advertisement>>('/advertisements');
}

// 2. 更新广告信息
export const updateAdvertisement = (id: number, title: string, content: string, imgUrl: string, productId: string) => {
    return apiClient.put<ApiResponse<string>>(`/advertisements`);
}

// 3. 创建广告
export const createAdvertisement = (title: string, content: string, imgUrl: string, productId: string) => {
    return apiClient.post<ApiResponse<Advertisement>>(`/advertisements`);
}

// 4. 删除广告
export const deleteAdvertisement = (id: number) => {
    return apiClient.delete<ApiResponse<string>>(`/advertisements/${id}`);
}