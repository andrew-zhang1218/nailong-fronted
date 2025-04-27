import {apiClient,ApiResponse}from './user';
import qs from 'qs';
export interface Cart{
    cartItemId: number;
    productId: number;
    title: string;
    price: number;
    description?: string;
    cover?: string;
    detail?: string;
    quantity: number;
}

export interface CartResponse{
    items: Cart[];
    total: number;
    totalAmount: number;
}

export interface Order {
    orderId: number;
    userId: number;
    total_amount: number;
    payment_method: string;
    status: string;
    create_time: number;
}

export interface OrdersDone {
    id: number;
    cartitem_id: number;
    order_id: number;
}

// 1. 加入商品到购物车
export const postProductinCart = (product_id: number, quantity: number) => {
    return apiClient.post<ApiResponse<Cart>>(
        '/cart',
        qs.stringify({ productId: product_id, quantity }),
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
    );
};


// 2. 删除购物车商品
export const deleteProductinCart = (id: number) => {
    return apiClient.delete<ApiResponse<string>>(`/cart`, {
        params: {
            cartItemId: id
        }
    });
};


// 3. 修改购物车商品数量
export const updateProductinCart = (id: number, quantity: number) => {
    return apiClient.patch<ApiResponse<string>>(
        `/cart/${id}`,
        qs.stringify({
            cartItem_id: id,
            quantity: quantity
        }),
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
    );
};

// 4. 获取购物车商品列表
export const getProductinCart = () => {
    return apiClient.get<ApiResponse<CartResponse>>(`/cart`);
}
