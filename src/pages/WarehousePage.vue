<template>
  <div class="home">
    <el-row :gutter="20" class="product-row">
      <!-- 遍历商品列表展示商品 -->
      <el-col :span="8" v-for="product in products" :key="product.id">
        <el-card class="product-card" @click="goToProductDetail(product.id)">
          <div class="product-info">
            <h3>{{ product.title }}</h3>
            <span class="stock">库存: {{ product.stockpile?.amount || '暂无库存信息' }}</span>
            <span class="price">¥{{ product.price }}</span>
            <el-button type="primary" size="small" class="details-btn">查看详情</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 增加商品按钮 -->
    <el-button type="success" size="medium" class="add-product-btn" @click="goToAddProductPage">增加商品</el-button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getProductList, getProductStockpile } from '@/api/product';  // 假设你已经定义了 getProductStockpile API 方法
import { useRouter } from 'vue-router';
import { ElButton, ElCard, ElRow, ElCol } from 'element-plus';

// 使用 Vue Router 的实例
const router = useRouter();

// 存储商品列表数据
const products = ref([]);

// 获取商品列表并获取库存信息
const fetchProducts = async () => {
  try {
    const response = await getProductList();
    if (response.data.code === '200') {
      // 获取商品列表数据
      const productList = response.data.data;

      // 获取每个商品的库存信息
      for (const product of productList) {
        const stockpileResponse = await getProductStockpile(product.id);
        product.stockpile = stockpileResponse.data.data;
      }

      // 更新商品列表
      products.value = productList;
    }
  } catch (error) {
    console.error('获取商品列表或库存信息失败', error);
  }
};

// 跳转到商品详情页面
const goToProductDetail = (id) => {
  router.push({ name: 'productupdate', params: { id } });
};

// 跳转到增加商品页面
const goToAddProductPage = () => {
  router.push({ name: 'addproduct' });  // 假设你已经配置了 'addproduct' 路由
};

// 组件挂载时获取商品列表和库存信息
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

.stock {
  font-size: 14px;
  color: #555;
  margin-bottom: 10px;
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

.add-product-btn {
  margin-top: 20px;
  width: 200px;
  margin-left: auto;
  margin-right: auto;
}
</style>


