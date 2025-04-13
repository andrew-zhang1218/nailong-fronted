<template>
  <div v-if="product" class="product-detail">
    <el-row :gutter="40" class="product-row">
      <!-- 商品封面 -->
      <el-col :span="12">
        <img :src="product.cover" alt="Product Cover" class="product-cover" />
      </el-col>

      <!-- 商品信息 -->
      <el-col :span="12">
        <div class="product-info">
          <h2>{{ product.title }}</h2>
          <el-input v-model="product.title" placeholder="修改商品名称" />
          <p><strong>价格：</strong>
            <el-input-number v-model="product.price" :min="1" :max="10000" label="价格" />
          </p>
          <p><strong>评分：</strong>
            <el-input-number v-model="product.rate" :min="0" :max="5" step="0.1" label="评分" />
          </p>
          <el-input v-model="product.description" placeholder="修改商品描述" />

          <div v-if="product.specifications?.length">
            <h3>规格</h3>
            <el-form v-for="(spec, index) in product.specifications" :key="spec.id" :model="spec" label-width="80px">
              <!-- 规格项不可修改 -->
              <el-form-item label="规格项">
                <el-input :value="spec.item" disabled placeholder="规格项不可修改" />
              </el-form-item>
              <!-- 规格值可修改 -->
              <el-form-item label="规格值">
                <el-input v-model="spec.value" placeholder="修改规格值" />
              </el-form-item>
            </el-form>
          </div>

          <div>
            <h3>库存信息</h3>
            <p><strong>库存数量：</strong>
              <el-input-number v-model="stockpile.amount" :min="0" :max="10000" label="库存数量" />
            </p>
            <p><strong>冻结库存：</strong>
              <el-input-number v-model="stockpile.frozen" :min="0" :max="10000" label="冻结库存" />
            </p>
          </div>

          <el-button type="primary" @click="updateProductDetails">提交商品修改</el-button>
          <el-button type="success" @click="updateProductStockpileInfo">提交库存修改</el-button>
          <!-- 删除商品按钮 -->
          <el-button type="danger" @click="delete_Product" style="margin-top: 10px;">删除商品</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getProduct, getProductStockpile, updateProduct, updateProductStockpile, deleteProduct, ProductVO, StockpileVO } from '@/api/product';
import { useRoute, useRouter } from 'vue-router';
import { ElButton, ElInput, ElInputNumber, ElForm, ElFormItem, ElMessage } from 'element-plus';  // 导入所需的 Element Plus 组件

// 存储商品详情和库存数据
const product = ref<ProductVO | null>(null);

// 初始化库存信息，避免 null 错误
const stockpile = ref<StockpileVO>({
  amount: 0,
  frozen: 0,
  productId: 0,
  id: 0
});

// 获取商品 ID
const route = useRoute();
const router = useRouter();
const productId = parseInt(route.params.id as string);

// 获取商品详情
const fetchProductDetail = async () => {
  try {
    const response = await getProduct(productId);
    product.value = response.data.data;
  } catch (error) {
    console.error('获取商品详情失败', error);
  }
};

// 获取商品库存信息
const fetchStockpile = async () => {
  try {
    const response = await getProductStockpile(productId);
    stockpile.value = response.data.data || {
      amount: 0, // 默认值
      frozen: 0, // 默认值
      productId: productId,
      id: 0
    };
  } catch (error) {
    console.error('获取库存信息失败', error);
  }
};

// 提交商品信息修改
const updateProductDetails = async () => {
  if (product.value) {
    try {
      const response = await updateProduct(product.value);
      if (response.data.data && response.data.data.length > 0) {
        product.value = response.data.data[0];
        fetchProductDetail(); // 更新商品详情
      } else {
        ElMessage.error('商品信息更新失败');
        return;
      }
      ElMessage.success('商品信息更新成功');
    } catch (error) {
      ElMessage.error('商品信息更新失败');
    }
  }
};

// 提交库存信息修改
const updateProductStockpileInfo = async () => {
  if (stockpile.value) {
    try {
      const res = await updateProductStockpile(productId, stockpile.value.amount);
      if (res.data.code === '200') {
        stockpile.value = res.data.data;
        ElMessage.success('库存信息更新成功');
        fetchStockpile(); // 更新库存信息
      } else {
        ElMessage.error('库存信息更新失败');
        return;
      }
    } catch (error) {
      ElMessage.error('库存信息更新失败');
    }
  }
};

// 删除商品
const delete_Product = async () => {
  try {
    const response = await deleteProduct(productId); // 调用删除商品的API

    if (response.data.code === '200') {
      ElMessage.success('商品删除成功');
      // 删除商品后跳转到商品列表页面，防止再次请求已删除商品
      router.push('/warehouse');  // 跳转到库存管理页

    } else {
      ElMessage.error('商品删除失败');
    }
  } catch (error) {
    ElMessage.error('删除商品时出错');
  }
};

// 组件挂载时获取商品详情和库存信息
onMounted(fetchProductDetail);
onMounted(fetchStockpile);
</script>

<style scoped>
.product-detail {
  padding: 20px;
}

.product-cover {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
}

.product-info {
  padding: 20px;
}

.product-info h2 {
  font-size: 24px;
  margin-bottom: 10px;
}

.product-info p {
  font-size: 16px;
  margin-bottom: 10px;
}

.product-info ul {
  padding-left: 20px;
}
</style>





