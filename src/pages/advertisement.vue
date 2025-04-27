<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  getAllAdvertisements,
  createAdvertisement,
  updateAdvertisement,
  deleteAdvertisement
} from '@/api/advertisement';

const router = useRouter();
const ads = ref([]);
const showDialog = ref(false);
const editMode = ref(false);
const formData = ref({
  id: 0,
  title: '',
  content: '',
  image_url: '',
  productId: 0
});

// 加载广告列表
const loadAds = async () => {
  try {
    const res = await getAllAdvertisements();
    ads.value = res.data.data;
  } catch (error) {
    alert('加载失败: ' + error.message);
  }
};

// 跳转商品详情
const goToProduct = (productId) => {
  router.push(`/product/${productId}`);
};

// 提交表单处理
const handleSubmit = async () => {
  try {
    console.log(formData.value);
    const payload = {
      title: formData.value.title,
      content: formData.value.content,
      image_url: formData.value.image_url,
      productId: formData.value.productId
    };
    const payload2 = {
      id: formData.value.id,
      title: formData.value.title,
      content: formData.value.content,
      image_url: formData.value.image_url,
      productId: formData.value.productId
    };

    if (editMode.value) {
      await updateAdvertisement(
          payload2
      );
    } else {
      await createAdvertisement({
        ...payload
      });
    }
    showDialog.value = false;
    await loadAds();
  } catch (error) {
    alert('操作失败: ' + error.message);
  }
};

// 初始化编辑表单
const openEdit = (ad) => {
  editMode.value = true;
  formData.value = {
    id: ad.id,
    title: ad.title,
    content: ad.content,
    image_url: ad.image_url,
    productId: ad.productId
  };
  showDialog.value = true;
};

// 删除处理
const handleDelete = async (id) => {
  if (!confirm('确定删除该广告吗？')) return;
  try {
    await deleteAdvertisement(id);
    console.log(id);
    await loadAds();
  } catch (error) {
    alert('删除失败: ' + error.message);
  }
};

onMounted(loadAds);
</script>

<template>
  <div class="management-container">
    <div class="header-box">
      <h2>广告管理</h2>
      <button class="new-btn" @click="showDialog = true; editMode = false">
        + 新建广告
      </button>
    </div>

    <div class="table-wrapper">
      <table>
        <thead>
        <tr>
          <th>标题</th>
          <th>内容摘要</th>
          <th>关联商品ID</th>
          <th>预览图</th>
          <th>操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="ad in ads" :key="ad.id">
          <td class="link" @click="goToProduct(ad.productId)">{{ ad.title }}</td>
          <td>{{ ad.content.slice(0, 20) }}...</td>
          <td>{{ ad.product_id }}</td>
          <td><img :src="ad.image_url" class="thumb" /></td>
          <td>
            <button class="edit-btn" @click="openEdit(ad)">编辑</button>
            <button class="delete-btn" @click="handleDelete(ad.id)">删除</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- 表单弹窗 -->
    <div v-if="showDialog" class="dialog-mask">
      <div class="dialog-card">
        <h3>{{ editMode ? '编辑广告' : '新建广告' }}</h3>
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label>广告标题：</label>
            <input v-model="formData.title" required />
          </div>

          <div class="form-group">
            <label>广告内容：</label>
            <textarea v-model="formData.content" rows="4" required />
          </div>

          <div class="form-group">
            <label>图片URL：</label>
            <input v-model="formData.image_url" type="url" required />
            <img v-if="formData.image_url" :src="formData.image_url" class="form-preview" />
          </div>

          <div class="form-group">
            <label>关联商品ID：</label>
            <input
                v-model.number="formData.productId"
                type="number"
                min="1"
                required
            />
          </div>

          <div class="action-btns">
            <button type="button" @click="showDialog = false">取消</button>
            <button type="submit" class="confirm-btn">
              {{ editMode ? '更新' : '创建' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.management-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.header-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.new-btn {
  background: #4CAF50;
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
}

.table-wrapper {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  background: #f8f9fa;
  padding: 1rem;
  text-align: left;
}

td {
  padding: 1rem;
  border-top: 1px solid #eee;
}

.thumb {
  max-width: 120px;
  max-height: 80px;
  object-fit: contain;
}

.link {
  color: #2196F3;
  cursor: pointer;
  text-decoration: underline;
}

.edit-btn {
  background: #FFC107;
  margin-right: 0.5rem;
}

.delete-btn {
  background: #F44336;
  color: white;
}

.dialog-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.dialog-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 600px;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
}

.form-preview {
  max-width: 200px;
  margin-top: 0.5rem;
}

.action-btns {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.confirm-btn {
  background: #2196F3;
  color: white;
}
</style>