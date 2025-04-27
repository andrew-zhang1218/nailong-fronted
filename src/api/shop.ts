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

// 5. 提交订单
export const checkoutOrder = (
    cartItemIds: string[],
    shipping_address: string,
    payment_method: string
) => {
    return apiClient.post<ApiResponse<Order>>(
        '/cart/checkout',
        qs.stringify({
            cartItemIds,         // 自动序列化为多个 cartItemIds=xxx
            shipping_address,    // 如果是 JSON 字符串也可以直接传
            payment_method
        }, { arrayFormat: 'repeat' }), // 关键配置：让数组变成 ?cartItemIds=1&cartItemIds=2...
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
    );
}

// 6. 发起支付请求（支付宝 HTML 表单）
export const payOrder = (orderId: number) => {
    return apiClient.post<ApiResponse<{
        paymentForm: string,
        orderId: number,
        totalAmount: string,
        paymentMethod: string
    }>>(`/orders/${orderId}/pay`);
};

