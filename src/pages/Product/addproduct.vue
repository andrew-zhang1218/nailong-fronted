<template>
  <div class="add-product">
    <el-form :model="product" ref="productForm" label-width="120px">
      <!-- 商品名称 -->
      <el-form-item label="商品名称" prop="title" :rules="[{ required: true, message: '请输入商品名称', trigger: 'blur' }]">
        <el-input v-model="product.title" placeholder="请输入商品名称" />
      </el-form-item>

      <!-- 商品价格 -->
      <el-form-item label="价格" prop="price" :rules="[{ required: true, message: '请输入商品价格', trigger: 'blur' }]">
        <el-input-number v-model="product.price" :min="0" :max="10000" placeholder="请输入商品价格" />
      </el-form-item>

      <!-- 商品评分 -->
      <el-form-item label="评分" prop="rate" :rules="[{ required: true, message: '请输入商品评分', trigger: 'blur' }]">
        <el-input-number v-model="product.rate" :min="0" :max="5" step="0.1" placeholder="请输入商品评分" />
      </el-form-item>

      <!-- 商品描述 -->
      <el-form-item label="描述" prop="description">
        <el-input v-model="product.description" placeholder="请输入商品描述" />
      </el-form-item>

      <!-- 商品封面 -->
      <el-form-item label="封面" prop="cover">
        <el-input v-model="product.cover" placeholder="请输入商品封面链接" />
      </el-form-item>

      <!-- 商品规格 -->
      <el-form-item label="规格">
        <el-button type="primary" @click="addSpecification">添加规格</el-button>
        <div v-for="(spec, index) in product.specifications" :key="index">
          <el-form-item :label="'规格项 ' + (index + 1)">
            <el-input v-model="spec.item" placeholder="规格项 (如：作者)" />
            <el-input v-model="spec.value" placeholder="规格值 (如：Robert C. Martin)" />
            <el-button @click="removeSpecification(index)" type="danger" size="small">删除规格</el-button>
          </el-form-item>
        </div>
      </el-form-item>

      <!-- 商品库存 -->
      <el-form-item label="库存信息">
        <el-row>
          <el-col :span="12">
            <el-input-number v-model="product.stockpile.amount" :min="0" :max="10000" label="库存数量" placeholder="请输入库存数量" style="width: 100%" />
          </el-col>
          <el-col :span="12">
            <el-input-number v-model="product.stockpile.frozen" :min="0" :max="10000" label="冻结库存" placeholder="请输入冻结库存" style="width: 100%" />
          </el-col>
        </el-row>
      </el-form-item>

      <el-button type="primary" @click="submitProduct">提交商品</el-button>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { addProduct } from '@/api/product'; // 导入添加商品的 API
import { ElButton, ElInput, ElInputNumber, ElForm, ElFormItem, ElMessage } from 'element-plus';  // 导入所需的 Element Plus 组件

// 商品对象
const product = ref({
  title: '',
  price: 0,
  rate: 0,
  description: '',
  cover: '',
  specifications: [] as { item: string, value: string }[], // 商品规格数组
  stockpile: { amount: 0, frozen: 0 } // 商品库存
});

// 添加规格
const addSpecification = () => {
  product.value.specifications.push({ item: '', value: '' });
};

// 删除规格
const removeSpecification = (index: number) => {
  product.value.specifications.splice(index, 1);
};

// 提交商品
const submitProduct = async () => {
  try {
    const response = await addProduct(product.value);  // 调用API添加商品
    ElMessage.success('商品添加成功');
    // 重置表单
    product.value = {
      title: '',
      price: 0,
      rate: 0,
      description: '',
      cover: '',
      specifications: [],
      stockpile: { amount: 0, frozen: 0 }
    };
  } catch (error) {
    ElMessage.error('商品添加失败');
  }
};
</script>

<style scoped>
.add-product {
  padding: 20px;
}

.el-form-item {
  margin-bottom: 20px;
}

.el-button {
  margin-top: 10px;
}

.el-input-number {
  width: 100%;
}
</style>

