<template>
  <div class="product-detail" v-if="product">
    <el-row :gutter="40" class="product-row">
      <!-- 商品封面 -->
      <el-col :span="12" class="product-image-col">
        <img :src="product.cover" class="product-cover" alt="Product Cover" />
      </el-col>

      <!-- 商品信息 -->
      <el-col :span="12" class="product-info-col">
        <div class="product-info">
          <h2 class="product-title">{{ product.title }}</h2>
          <p><strong>作者：</strong>{{ getSpecificationValue('作者') }}</p>
          <p><strong>价格：</strong>¥{{ product.price }}</p>
          <p><strong>评分：</strong>{{ product.rate }}</p>
          <p><strong>描述：</strong>{{ product.description || '暂无描述' }}</p>
          <p><strong>详情：</strong>{{ product.detail || '暂无详细信息' }}</p>

          <div class="stock-info">
            <p><strong>库存：</strong>{{ product.stockpile?.amount }}</p>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getProduct } from '@/api/product';
import { useRoute } from 'vue-router';

// 存储商品详情数据
const product = ref(null);

// 获取商品 ID
const route = useRoute();
const productId = route.params.id;

// 获取商品详情
const fetchProductDetail = async () => {
  try {
    const response = await getProduct(productId);
    product.value = response.data.data;
  } catch (error) {
    console.error('获取商品详情失败', error);
  }
};

// 组件挂载时获取商品详情
onMounted(fetchProductDetail);

// 获取商品规格值
const getSpecificationValue = (item) => {
  const spec = product.value?.specifications?.find(spec => spec.item === item);
  return spec ? spec.value : '无信息';
};
</script>

<style scoped>
.product-detail {
  padding: 80px 20px 20px; /* 增加顶部间距，避免导航栏遮挡 */
}

.product-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.product-image-col {
  display: flex;
  justify-content: center;
}

.product-cover {
  width: 100%;
  max-width: 350px;  /* 限制图片最大宽度 */
  height: auto;
  border-radius: 8px;
}

.product-info-col {
  max-width: 500px;
}

.product-info {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.product-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.product-info p {
  font-size: 16px;
  line-height: 1.6;
  margin: 10px 0;
}

.product-info strong {
  font-weight: bold;
  color: #333;
}

.stock-info {
  margin-top: 20px;
  font-size: 16px;
  color: #555;
}
</style>

