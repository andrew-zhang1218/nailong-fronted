import {apiClient,ApiResponse}from './user';

// 规格对象结构（Specification）
export interface Specification {
    id: number;          // 规格 ID
    item: string;        // 规格项（如：作者、ISBN、页数等）
    value: string;       // 规格值（如：周志明、9787111421900、540页等）
    product_id: number;  // 商品 ID
}
// 库存对象结构（StockpileVO）
export interface StockpileVO {
    id: number;          // 库存记录的 ID
    productId: number;   // 商品的 ID
    amount: number;      // 商品的库存数量
    frozen: number;      // 冻结库存数量
}
// 商品对象结构（包含 specifications,Stockpile）
export interface ProductVO {
    id?: number;
    title: string;
    price: number;
    rate: number;
    description?: string;
    cover?: string;
    detail?: string;
    specifications?: Specification[];  // 商品规格数组
    stockpile?: StockpileVO;  // 新增库存信息字段
}


// 1️⃣ 获取全部商品列表
export const getProductList = () => {
    return apiClient.get<ApiResponse<ProductVO[]>>('/products');
};

// 2️⃣ 获取单个商品信息
export const getProduct = (id: number) => {
    return apiClient.get<ApiResponse<ProductVO>>(`/products/${id}`);
};

// 3️⃣ 更新商品信息
export const updateProduct = (product: ProductVO) => {
    return apiClient.put<ApiResponse<string>>('/products', product);
};

// 4️⃣ 添加商品
export const addProduct = (product: ProductVO) => {
    return apiClient.post<ApiResponse<ProductVO>>('/products', product);
};

// 5️⃣ 删除商品
export const deleteProduct = (id: number) => {
    return apiClient.delete<ApiResponse<string>>(`/products/${id}`);
};

// 6️⃣ 修改库存（增加或减少）
export const updateProductStockpile = (productId: number, amount: number) => {
    return apiClient.patch<ApiResponse<string>>(`/products/stockpile/${productId}`, null, {
        params: { amount }
    });
};

// 7️⃣ 获取商品库存
export const getProductStockpile = (productId: number) => {
    return apiClient.get<ApiResponse<StockpileVO>>(`/products/stockpile/${productId}`);
};
