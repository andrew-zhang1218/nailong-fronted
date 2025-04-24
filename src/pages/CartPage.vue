<template>
  <div class="cart-page">
    <!-- 购物车列表 -->
    <div class="cart-list" v-loading="loading">
      <div v-if="cartData.items.length === 0" class="empty-cart">
        <el-empty description="您的购物车是空的"></el-empty>
      </div>

      <div v-else>
        <div class="cart-item" v-for="item in cartData.items" :key="item.cartItemId">
          <el-card shadow="hover">
            <div class="item-content">
              <!-- 商品图片 -->
              <img :src="item.cover" class="product-cover" alt="商品封面" />

              <!-- 商品信息 -->
              <div class="product-info">
                <h3 class="title">{{ item.title }}</h3>
                <p class="description">{{ item.description }}</p>
                <div class="spec-price">
                  <span class="price">¥{{ item.price.toFixed(2) }}</span>
                </div>
              </div>

              <!-- 数量操作 -->
              <div class="quantity-control">
                <el-input-number
                    v-model="item.quantity"
                    :min="1"
                    :max="getMaxQuantity(item)"
                    @change="(val) => updateQuantity(item.cartItemId, val)"
                ></el-input-number>
              </div>

              <!-- 删除按钮 -->
              <div class="delete-btn">
                <el-button
                    type="danger"
                    icon="Delete"
                    circle
                    @click="deleteItem(item.cartItemId)"
                ></el-button>
              </div>
            </div>
          </el-card>
        </div>

        <!-- 结算栏 -->
        <div class="checkout-bar">
          <div class="total-info">
            <span>共 {{ cartData.total }} 件商品</span>
            <span class="total-amount">合计：¥{{ cartData.totalAmount.toFixed(2) }}</span>
          </div>
          <el-button type="primary" size="large" @click="handleCheckout">
            去结算
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox, ElEmpty, ElInputNumber, ElButton, ElCard, ElLoading } from 'element-plus'
import type { Cart, CartResponse } from '@/api/shop'
import {
  getProductinCart,
  updateProductinCart,
  deleteProductinCart
} from '@/api/shop'

// 购物车数据
const cartData = ref<CartResponse>({
  items: [],
  total: 0,
  totalAmount: 0
})

const loading = ref(false)

// 获取购物车数据
const fetchCart = async () => {
  try {
    loading.value = true
    const res = await getProductinCart()
    cartData.value = res.data.data
  } catch (error) {
    ElMessage.error('获取购物车数据失败')
  } finally {
    loading.value = false
  }
}

// 修改商品数量
const updateQuantity = async (cartItemId: number, quantity: number) => {
  try {
    await updateProductinCart(cartItemId, quantity)
    ElMessage.success('修改数量成功')
    await fetchCart() // 重新获取最新数据
  } catch (error) {
    ElMessage.error('修改数量失败')
  }
}

// 删除商品
const deleteItem = async (cartItemId: number) => {
  try {
    await ElMessageBox.confirm('确定要删除该商品吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await deleteProductinCart(cartItemId)
    ElMessage.success('删除成功')
    await fetchCart()
  } catch (error) {
    // 取消删除不处理
  }
}

// 获取最大可购数量
const getMaxQuantity = (item: Cart) => {
  // TODO: 实际应调用库存接口获取最大数量
  return 99 // 临时示例值
}

// 结算处理(订单模块)
const handleCheckout = () => {
  // TODO: 跳转到结算页面
  ElMessage.success('跳转到结算页面')
}

// 初始化加载
onMounted(() => {
  fetchCart()
})
</script>

<style scoped>
.cart-page {
  max-width: 1200px;
  margin: 20px auto;
  padding: 20px;
}

.cart-item {
  margin-bottom: 20px;
}

.item-content {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 15px;
}

.product-cover {
  width: 120px;
  height: 120px;
  object-fit: contain;
}

.product-info {
  flex: 1;
}

.title {
  margin: 0 0 10px;
  font-size: 16px;
  color: #333;
}

.price {
  color: #e4393c;
  font-size: 18px;
  font-weight: bold;
}

.checkout-bar {
  margin-top: 30px;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total-amount {
  font-size: 20px;
  color: #e4393c;
  margin-left: 30px;
}

.quantity-control {
  width: 120px;
}

.delete-btn {
  margin-left: 20px;
}
</style>