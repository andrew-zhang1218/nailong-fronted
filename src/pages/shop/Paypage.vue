<template>
  <div class="pay-page" v-loading="loading">
    <h2>订单支付确认</h2>

    <!-- 订单信息展示 -->
    <el-card class="order-info">
      <div class="info-item"><strong>订单号：</strong>{{ order.orderId }}</div>
      <div class="info-item"><strong>用户名：</strong>{{ order.username }}</div>
      <div class="info-item"><strong>订单状态：</strong>{{ getStatusText(order.status) }}</div>
      <div class="info-item"><strong>支付方式：</strong>{{ order.paymentMethod }}</div>
      <div class="info-item"><strong>订单总金额：</strong>¥{{ order.totalAmount }}</div>
      <div class="info-item"><strong>下单时间：</strong>{{ order.createTime }}</div>
    </el-card>

    <!-- 收货地址展示 -->
    <el-card class="address-info" style="margin-top: 20px;">
      <div class="info-item"><strong>收货人：</strong>{{ address.name }}</div>
      <div class="info-item"><strong>电话：</strong>{{ address.phone }}</div>
      <div class="info-item"><strong>收货地址：</strong>{{ address.address }}</div>
    </el-card>

    <!-- 支付按钮 -->
    <div class="pay-btn-bar">
      <el-button type="primary" size="large" @click="handlePay">立即支付</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElCard, ElButton } from 'element-plus'
import { payOrder } from '@/api/shop'

const route = useRoute()
const router = useRouter()
const loading = ref(false)

// 订单信息
const order = ref({
  orderId: '',
  username: '',
  totalAmount: '',
  paymentMethod: '',
  createTime: '',
  status: ''
})

// 收货人地址信息
const address = ref({
  name: '',
  phone: '',
  address: ''
})

// 将状态码转中文
const getStatusText = (status: string) => {
  switch (status) {
    case 'PENDING':
      return '待支付'
    case 'PAID':
      return '已支付'
    case 'CANCELLED':
      return '已取消'
    default:
      return '未知状态'
  }
}

// 页面加载时初始化
onMounted(() => {
  const query = route.query
  order.value.orderId = query.orderId as string || ''
  order.value.username = query.username as string || ''
  order.value.totalAmount = query.totalAmount as string || ''
  order.value.paymentMethod = query.paymentMethod as string || ''
  order.value.createTime = query.createTime as string || ''
  order.value.status = query.status as string || ''

  try {
    const addr = JSON.parse(query.shippingAddress as string || '{}')
    address.value.name = addr.name || ''
    address.value.phone = addr.phone || ''
    address.value.address = addr.address || ''
  } catch (error) {
    ElMessage.error('收货人信息解析失败')
  }
})

// 点击支付
const handlePay = async () => {
  if (!order.value.orderId) {
    ElMessage.error('无效的订单，无法支付')
    return
  }

  try {
    loading.value = true
    const res = await payOrder(Number(order.value.orderId))
    const html = res.data.data.payment_form
    console.log(res)
    console.log(html)

    document.open();
    document.write(html);
    document.close();
  } catch (error) {
    ElMessage.error('发起支付失败')
  } finally {
    loading.value = false
  }
}

</script>

<style scoped>
.pay-page {
  max-width: 700px;
  margin: 40px auto;
  padding: 20px;
}

.order-info, .address-info {
  margin-bottom: 20px;
  background: #fff;
  border-radius: 6px;
  padding: 20px;
}

.info-item {
  margin-bottom: 10px;
  font-size: 16px;
}

.pay-btn-bar {
  margin-top: 30px;
  text-align: center;
}
</style>

