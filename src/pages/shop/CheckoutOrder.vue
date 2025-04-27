<template>
  <div class="checkout-page" v-loading="loading">
    <h2>订单确认</h2>

    <!-- 收货人信息表单 -->
    <el-form :model="form" label-width="80px" class="address-form">
      <el-form-item label="姓名">
        <el-input v-model="form.name" placeholder="请输入收货人姓名" />
      </el-form-item>
      <el-form-item label="电话">
        <el-input v-model="form.phone" placeholder="请输入联系电话" />
      </el-form-item>
      <el-form-item label="地址">
        <el-input v-model="form.address" placeholder="请输入收货地址" />
      </el-form-item>
    </el-form>

    <!-- 商品列表 -->
    <el-card v-for="item in cartData.items" :key="item.cartItemId" class="checkout-item">
      <div class="item-row">
        <img :src="item.cover" alt="商品封面" class="product-cover" />
        <div class="info">
          <div>{{ item.title }}</div>
          <div>单价：¥{{ item.price.toFixed(2) }}</div>
          <div>数量：{{ item.quantity }}</div>
          <div>小计：¥{{ (item.price * item.quantity).toFixed(2) }}</div>
          <div v-if="item.quantity > getMaxQuantity(item)" class="error-text">
            当前购买数量超出库存！（库存：{{ getMaxQuantity(item) }}）
          </div>
        </div>
      </div>
    </el-card>

    <!-- 提交订单栏 -->
    <div class="submit-bar">
      <div class="total">订单总金额：¥{{ totalAmount.toFixed(2) }}</div>
      <el-button type="primary" size="large" @click="submitOrder">提交订单</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { ElMessage, ElForm, ElFormItem, ElInput, ElButton, ElCard } from 'element-plus'
import { getProductinCart, checkoutOrder } from '@/api/shop'
import { getProductStockpile } from '@/api/product'
import type { Cart, CartResponse } from '@/api/shop'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(false)

// 购物车数据
const cartData = ref<CartResponse>({
  items: [],
  total: 0,
  totalAmount: 0
})

// 收货人信息
const form = ref({
  name: '',
  phone: '',
  address: ''
})

// 商品库存缓存
const stockMap = ref<Map<number, number>>(new Map())

// 总金额计算
const totalAmount = computed(() =>
    cartData.value.items.reduce((sum, item) => sum + item.quantity * item.price, 0)
)

// 获取库存
const getMaxQuantity = (item: Cart) => {
  return stockMap.value.get(item.productId) || 1
}

// 加载购物车 & 库存
const fetchCart = async () => {
  try {
    loading.value = true
    const res = await getProductinCart()
    cartData.value = res.data.data

    const promises = cartData.value.items.map(async (item) => {
      try {
        const res = await getProductStockpile(item.productId)
        stockMap.value.set(item.productId, res.data.data.amount)
      } catch {
        stockMap.value.set(item.productId, 1)
      }
    })

    await Promise.all(promises)
  } catch (err) {
    ElMessage.error('获取购物车数据失败')
  } finally {
    loading.value = false
  }
}

// 提交订单
const submitOrder = async () => {
  // 校验表单信息
  if (!form.value.name || !form.value.phone || !form.value.address) {
    ElMessage.warning('请完整填写收货人信息')
    return
  }

  // 校验库存
  const overStockItems = cartData.value.items.filter(
      item => item.quantity > getMaxQuantity(item)
  )
  if (overStockItems.length > 0) {
    ElMessage.error('部分商品库存不足，无法提交订单')
    return
  }

  try {
    loading.value = true
    const cartItemIds = cartData.value.items.map(item => item.cartItemId.toString())
    const shipping_address = JSON.stringify({
      name: form.value.name,
      phone: form.value.phone,
      address: form.value.address
    })
    const res = await checkoutOrder(cartItemIds, shipping_address, 'ALIPAY')
    const order = res.data.data
    ElMessage.success(`订单提交成功，订单号：${order.orderId}`)
    console.log(order)
    // 这里可以跳转支付页或订单页
    router.push({
      path: '/paypage',
      query: {
        orderId: order.orderId,
        username: order.username,
        totalAmount: order.totalAmount,
        paymentMethod: order.paymentMethod,
        createTime: order.createTime,
        status: order.status,
        shippingAddress: shipping_address // 还是 JSON 字符串
      }
    })
  } catch (err) {
    ElMessage.error('提交订单失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchCart()
})
</script>

<style scoped>
.checkout-page {
  max-width: 900px;
  margin: 40px auto;
  padding: 20px;
}

.address-form {
  margin-bottom: 20px;
  background: #fff;
  padding: 20px;
  border-radius: 6px;
}

.checkout-item {
  margin-bottom: 20px;
}

.item-row {
  display: flex;
  gap: 20px;
}

.product-cover {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
}

.info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.error-text {
  color: red;
  font-weight: bold;
}

.submit-bar {
  margin-top: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f8f8;
  padding: 20px;
  border-radius: 6px;
}

.total {
  font-size: 18px;
  font-weight: bold;
  color: #e4393c;
}
</style>
