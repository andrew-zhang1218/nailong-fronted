<script setup lang="ts">
import { ElForm, ElFormItem, ElInput, ElButton, ElMessage, ElUpload, ElAvatar,ElIcon } from 'element-plus'
import { ref, onMounted } from 'vue'
import { getUser, updateUser } from '@/api/user'
// 用户信息
const userInfo = ref({
  username: '',
  password: '',
  name: '',
  role: '',
  avatar: '',
  telephone: '',
  email: '',
  location: ''
})

// 编辑数据
const editData = ref({ ...userInfo.value })
const isEditMode = ref(false)

// 上传的 URL
const uploadUrl = ref()

// 设置请求头
const headers = ref({
  'Authorization': 'Bearer your-token', // 如果需要认证
})

// 上传成功后的回调
const handleSuccess = (response, uploadFile) => {
  // 更新头像 URL
  editData.value.avatar = URL.createObjectURL(uploadFile.raw);
  ElMessage.success('上传成功！');
  console.log('服务器返回:', response);
};

// 上传前的校验
const beforeUpload = (file) => {
  const isImage = file.type.includes('image');
  const isLt2M = file.size / 1024 / 1024 < 2;

  if (!isImage) {
    ElMessage.error('上传文件只能是图片格式！');
  }
  if (!isLt2M) {
    ElMessage.error('上传图片大小不能超过 2MB！');
  }
  return isImage && isLt2M;
};

// 上传失败的回调
const handleError = () => {
  ElMessage.error('上传失败，请稍后再试！');
};

// 表单规则（复用注册页面的验证）
const validatePhone = (rule: any, value: string, callback: any) => {
  if (value && !/^1[3-9]\d{9}$/.test(value)) {
    callback(new Error('手机号格式不正确'))
  } else {
    callback()
  }
}

const validateEmail = (rule: any, value: string, callback: any) => {
  if (value && !/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value)) {
    callback(new Error('邮箱格式不正确'))
  } else {
    callback()
  }
}

const rules = {
  name: [{ required: true, message: '请输入真实姓名', trigger: 'blur' }],
  telephone: [{ validator: validatePhone, trigger: 'blur' }],
  email: [{ validator: validateEmail, trigger: 'blur' }]
}

// 加载用户信息
const loadUserInfo = async () => {
  try {
    const username = sessionStorage.getItem('username')
    if (!username) return
    const res = await getUser(username)
    console.log(res)
    userInfo.value = res.data.data
    editData.value = { ...userInfo.value }
  } catch (err) {
    console.error('获取用户信息失败:', err)
  }
}

// 进入编辑模式
const enterEditMode = () => {
  isEditMode.value = true
}

// 取消编辑
const cancelEdit = () => {
  editData.value = { ...userInfo.value }
  isEditMode.value = false
}

// 提交修改
const submitEdit = async () => {
  try {
    const params = {
      ...editData.value,
      // 清除未修改的空值
      telephone: editData.value.telephone || undefined,
      email: editData.value.email || undefined,
      location: editData.value.location || undefined
    }
    console.log(params)
    const res = await updateUser(params)
    console.log(res)
    if (res.data.code === '200') {
      userInfo.value = { ...editData.value }
      isEditMode.value = false
      ElMessage.success('修改成功')
    } else {
      ElMessage.error(res.data.message)
    }
  } catch (err) {
    console.error('修改失败:', err)
    ElMessage.error('修改失败')
  }
}

onMounted(() => {
  loadUserInfo()
})
</script>

<template>
  <div class="profile-container">
    <div class="profile-header">
      <h2>个人信息</h2>
      <el-button
          v-if="!isEditMode"
          type="primary"
          @click="enterEditMode"
      >
        修改信息
      </el-button>
    </div>

    <el-form
        v-if="isEditMode"
        :model="editData"
        :rules="rules"
        label-width="100px"
        class="edit-form"
    >
      <!-- 头像上传 -->
      <el-form-item label="头像">
        <div class="avatar-container">
          <el-upload
              class="avatar-uploader"
              :action="uploadUrl"
              :headers="headers"
              :show-file-list="false"
              :on-success="handleSuccess"
              :before-upload="beforeUpload"
              :on-error="handleError"
          >
            <img v-if="editData.avatar" :src="editData.avatar" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"></el-icon>
          </el-upload>
        </div>
      </el-form-item>

      <!-- 用户名（只读） -->
      <el-form-item label="用户名">
        <el-input v-model="editData.username" disabled />
      </el-form-item>

      <!-- 密码 -->
      <el-form-item label="密码" prop="password">
        <el-input v-model="editData.password" />
      </el-form-item>

      <!-- 真实姓名 -->
      <el-form-item label="真实姓名" prop="name">
        <el-input v-model="editData.name" />
      </el-form-item>

      <!-- 手机号 -->
      <el-form-item label="手机号" prop="telephone">
        <el-input v-model="editData.telephone" />
      </el-form-item>

      <!-- 邮箱 -->
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="editData.email" />
      </el-form-item>

      <!-- 所在地 -->
      <el-form-item label="所在地">
        <el-input v-model="editData.location" />
      </el-form-item>

      <div class="form-actions">
        <el-button @click="cancelEdit">取消</el-button>
        <el-button type="primary" @click="submitEdit">保存</el-button>
      </div>
    </el-form>

    <!-- 展示模式 -->
    <div v-else class="info-display">
      <div class="avatar-section">
        <el-avatar :src="userInfo.avatar" :size="100" />
      </div>

      <div class="info-item">
        <label>用户名：</label>
        <span>{{ userInfo.username }}</span>
      </div>

      <div class="info-item">
        <label>密码：</label>
        <span>******</span>
      </div>

      <div class="info-item">
        <label>真实姓名：</label>
        <span>{{ userInfo.name }}</span>
      </div>

      <div class="info-item">
        <label>用户角色：</label>
        <span>{{ userInfo.role === 'admin' ? '管理员' : '普通用户' }}</span>
      </div>

      <div class="info-item">
        <label>手机号：</label>
        <span>{{ userInfo.telephone || '未填写' }}</span>
      </div>

      <div class="info-item">
        <label>邮箱：</label>
        <span>{{ userInfo.email || '未填写' }}</span>
      </div>

      <div class="info-item">
        <label>所在地：</label>
        <span>{{ userInfo.location || '未填写' }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-container {
  max-width: 800px;
  margin: 30px auto;
  padding: 30px;
  border: 1px solid #eee;
  border-radius: 8px;
  background-color: #fff;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.edit-form {
  padding: 20px;
}

.info-display {
  padding: 20px;
}

.info-item {
  margin: 15px 0;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.info-item label {
  display: inline-block;
  width: 100px;
  color: #666;
}

.avatar-section {
  text-align: center;
  margin-bottom: 30px;
}

.form-actions {
  margin-top: 30px;
  text-align: right;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: border-color 0.3s;
  width: 178px;
  height: 178px;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.avatar-container {
  display: flex;
  align-items: center;
  gap: 20px;
}
</style>