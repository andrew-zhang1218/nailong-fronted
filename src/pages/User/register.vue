<script setup lang="ts">
import { ElForm, ElFormItem, ElInput, ElButton, ElMessage } from 'element-plus'
import { ref, computed } from 'vue'
import {useRouter} from 'vue-router'
import {AccountVO, createUser} from '@/api/user'

const router = useRouter()
// 表单字段
const form = ref({
  username: '',
  password: '',
  confirmPassword: '',
  name: '',
  telephone: '',
  email: '',
  location: ''
})

// 非空验证
const hasUsername = computed(() => form.value.username !== '')
const hasPassword = computed(() => form.value.password !== '')
const hasConfirmPassword = computed(() => form.value.confirmPassword !== '')
const hasName = computed(() => form.value.name !== '')

// 注册按钮状态
const registerDisabled = computed(() => {
  return !(hasUsername.value &&
      hasPassword.value &&
      hasConfirmPassword.value &&
      hasName.value)
})

// 手机号格式验证
const validatePhone = (rule: any, value: string, callback: any) => {
  if (value && !/^1[3-9]\d{9}$/.test(value)) {
    callback(new Error('手机号格式不正确'))
  } else {
    callback()
  }
}

// 邮箱格式验证
const validateEmail = (rule: any, value: string, callback: any) => {
  if (value && !/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value)) {
    callback(new Error('邮箱格式不正确'))
  } else {
    callback()
  }
}

// 表单规则
const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: any) => {
        if (value !== form.value.password) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  name: [{ required: true, message: '请输入真实姓名', trigger: 'blur' }],
  telephone: [{ validator: validatePhone, trigger: 'blur' }],
  email: [{ validator: validateEmail, trigger: 'blur' }]
}

// 提交注册
const handleRegister = () => {
  const userData: AccountVO = {
    username: form.value.username,
    password: form.value.password,
    name: form.value.name,
    role: 'user', // 固定为普通用户
    telephone: form.value.telephone || undefined,
    email: form.value.email || undefined,
    location: form.value.location || undefined
  }

  createUser(userData)
      .then(res => {
        if (res.data.code === '200') {
          ElMessage({
            message: '注册成功，请登录',
            type: 'success',
            center: true
          })
          // 跳转到登录页，并携带用户名
          router.push({
            path: '/login',
            query: { username: form.value.username }
          })
        } else {
          ElMessage.error(res.data.message)
        }
      })
      .catch(err => {
        console.error('注册失败:', err)
        ElMessage.error('注册失败，请稍后重试')
      })
}
</script>

<template>
  <el-form
      :model="form"
      :rules="rules"
      class="register-form"
      label-position="top"
      label-width="120px"
  >
    <h2 class="form-title">用户注册</h2>

    <!-- 用户名 -->
    <el-form-item label="用户名" prop="username">
      <el-input
          v-model="form.username"
          placeholder="4-16位字母/数字/下划线"
          clearable
      />
    </el-form-item>

    <!-- 密码 -->
    <el-form-item label="密码" prop="password">
      <el-input
          v-model="form.password"
          placeholder="至少6位字符"
          show-password
          clearable
      />
    </el-form-item>

    <!-- 确认密码 -->
    <el-form-item label="确认密码" prop="confirmPassword">
      <el-input
          v-model="form.confirmPassword"
          placeholder="请再次输入密码"
          show-password
          clearable
          @keyup.enter="handleRegister"
      />
    </el-form-item>

    <!-- 真实姓名 -->
    <el-form-item label="真实姓名" prop="name">
      <el-input
          v-model="form.name"
          placeholder="请输入真实姓名"
          clearable
      />
    </el-form-item>

    <!-- 手机号 -->
    <el-form-item label="手机号" prop="telephone">
      <el-input
          v-model="form.telephone"
          placeholder="可选"
          clearable
      />
    </el-form-item>

    <!-- 邮箱 -->
    <el-form-item label="邮箱" prop="email">
      <el-input
          v-model="form.email"
          placeholder="可选"
          clearable
      />
    </el-form-item>

    <!-- 所在地 -->
    <el-form-item label="所在地">
      <el-input
          v-model="form.location"
          placeholder="可选"
          clearable
      />
    </el-form-item>

    <el-form-item>
      <div class="button-container">
      <el-button
          type="primary"
          :disabled="registerDisabled"
          @click="handleRegister"
          class="left-button"
      >
        立即注册
      </el-button>

        <el-button
            plain
            @click="router.push('/login')"
            class="right-button"
        >
          返回登录
        </el-button>
      </div>
    </el-form-item>
  </el-form>
</template>

<style scoped>
.register-form {
  width: 400px;
  margin: 50px auto;
  padding: 30px;
  border: 1px solid #eee;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}

.form-title {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}
.button-container {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

/* 可选：为按钮添加固定宽度 */
.left-button {
  width: 25%;
}
.right-button {
  width: 25%;
}

</style>