import axios from 'axios';

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

// 商品对象结构（ProductVO）
export interface ProductVO {
    id?: number;
    name: string;
    description?: string;
    price: number;
    category?: string;
    imageUrl?: string;
    // 根据后端定义自行补充字段
}

// 库存对象结构（StockpileVO）
export interface StockpileVO {
    productId: number;
    amount: number;
}

// ✅ 添加商品
export const addProduct = (product: ProductVO) => {
    return apiClient.post<ApiResponse<ProductVO>>('/products', product);
};

// ✅ 获取单个商品信息
export const getProduct = (id: number) => {
    return apiClient.get<ApiResponse<ProductVO>>(`/products/${id}`);
};

// ✅ 获取全部商品列表
export const getProductList = () => {
    return apiClient.get<ApiResponse<ProductVO[]>>('/products');
};

// ✅ 更新商品信息
export const updateProduct = (product: ProductVO) => {
    return apiClient.put<ApiResponse>('/products', product);
};

// ✅ 删除商品
export const deleteProduct = (id: number) => {
    return apiClient.delete<ApiResponse>(`/products/${id}`);
};

// ✅ 修改库存（增加或减少）
export const updateProductStockpile = (productId: number, amount: number) => {
    return apiClient.patch<ApiResponse>(`/products/stockpile/${productId}`, null, {
        params: { amount }
    });
};

// ✅ 获取商品库存
export const getProductStockpile = (productId: number) => {
    return apiClient.get<ApiResponse<StockpileVO>>(`/products/stockpile/${productId}`);
};
