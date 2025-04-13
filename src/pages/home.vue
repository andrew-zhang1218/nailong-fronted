<template>
  <div class="home">
    <el-row :gutter="20" class="product-row">
      <!-- 遍历商品列表展示商品 -->
      <el-col :span="8" v-for="product in products" :key="product.id">
        <el-card class="product-card" @click="goToProductDetail(product.id)">
          <div class="product-info">
            <h3>{{ product.title }}</h3>
            <p class="product-description">{{ product.description || '暂无描述' }}</p>
            <span class="price">¥{{ product.price }}</span>
            <el-button type="primary" size="small" class="details-btn">查看详情</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getProductList } from '@/api/product';
import { useRouter } from 'vue-router';
import { ElButton, ElCard, ElRow, ElCol } from 'element-plus'

// 使用 Vue Router 的实例
const router = useRouter();

// 存储商品列表数据
const products = ref([]);

// 获取商品列表
const fetchProducts = async () => {
  try {
    const response = await getProductList();
    if (response.data.code === '200') {
      // 处理返回的数据
      products.value = response.data.data.map(product => {
        // 如果没有提供description，设置为默认值
        product.description = product.description || '暂无描述';
        // 返回处理后的产品对象
        return {
          id: product.id,
          title: product.title,
          price: product.price,
          rate: product.rate,
          description: product.description,
          cover: product.cover,
          specifications: product.specifications || [],  // 确保有规范项
        };
      });
    }
  } catch (error) {
    console.error('获取商品列表失败', error);
  }
};

// 点击商品，跳转到商品详情页面
const goToProductDetail = (id) => {
  router.push({ name: 'productdetail', params: { id } });
};

// 组件挂载时获取商品列表
onMounted(fetchProducts);
</script>

<style scoped>
.home {
  padding: 80px 20px 20px; /* 增加顶部间距，避免导航栏遮挡 */
}

.product-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between; /* 确保每一行商品之间有间距 */
}

.product-card {
  cursor: pointer;
  transition: transform 0.3s;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
  background-color: #fff;
  height: 350px;  /* 确保每个商品卡片的高度一致 */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-card:hover {
  transform: translateY(-10px);
}

.product-info {
  padding: 20px;
}

.product-info h3 {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.product-description {
  font-size: 14px;
  color: #555;
  margin-bottom: 10px;
  display: -webkit-box;
  -webkit-line-clamp: 3; /* 限制为三行 */
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.price {
  font-size: 18px;
  font-weight: bold;
  color: #e74c3c;
}

.details-btn {
  margin-top: 10px;
  width: 100%;
}
</style>






