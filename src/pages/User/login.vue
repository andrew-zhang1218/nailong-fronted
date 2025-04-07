<script setup lang="ts">
import { ElForm, ElFormItem, ElInput, ElButton, ElMessage } from 'element-plus'
import { ref, computed } from 'vue'
import {useRouter} from 'vue-router'
import { login, getUser } from '@/api/user'

const router = useRouter()
// 输入框值
const username = ref('')
const password = ref('')

// 用户名是否为空
const hasUsernameInput = computed(() => username.value !== '')
// 密码是否为空
const hasPasswordInput = computed(() => password.value !== '')

// 登录按钮可用性
const loginDisabled = computed(() => {
  return !(hasUsernameInput.value && hasPasswordInput.value)
})

// 登录按钮触发
function handleLogin() {
  login(username.value, password.value)
      .then(res => {
        console.log(res.data)
        if (res.data.code === '200') {
          const token = res.data.data

          // 保存 token
          sessionStorage.setItem('token', token)

          // 再调用 getUser 接口获取用户信息
          getUser(username.value).then(userRes => {
            console.log(userRes)
            const user = userRes.data.data
            sessionStorage.setItem('name', user.name || '')
            sessionStorage.setItem('role', user.role || '')
            sessionStorage.setItem('username', user.username || '')

            ElMessage({
              message: "登录成功！",
              type: 'success',
              center: true,
            })

            // 跳转到主页
            router.push('/home')
          })
        } else {
          ElMessage({
            message: res.data.message,
            type: 'error',
            center: true,
          })
          password.value = ''
        }
      })
      .catch(err => {
        console.error('登录出错：', err)
        ElMessage({
          message: '服务器错误，登录失败',
          type: 'error',
          center: true,
        })
      })
}
</script>


<template>
  <!-- 登录表单 -->
  <el-form :model="{ username, password }" class="login-form" label-position="top">
    <!-- 用户名 -->
    <el-form-item label="用户名">
      <el-input
          v-model="username"
          placeholder="请输入用户名"
          clearable
      ></el-input>
    </el-form-item>

    <!-- 密码 -->
    <el-form-item label="密码">
      <el-input
          v-model="password"
          placeholder="请输入密码"
          clearable
          show-password
          @keyup.enter="handleLogin"
      ></el-input>
    </el-form-item>

    <!-- 登录按钮 -->
    <el-form-item>
      <div class="button-group">
      <el-button
          type="primary"
          :disabled="loginDisabled"
          @click="handleLogin"
          class="login-button"
      >
        登录
      </el-button>
      <el-button
          plain
          @click="router.push('/register')"
          class="register-button"
      >
        立即注册
      </el-button>
      </div>
    </el-form-item>
  </el-form>
</template>

<style scoped>
.login-form {
  width: 300px;
  margin: 100px auto;
  padding: 30px;
  border: 1px solid #eee;
  border-radius: 6px;
  background-color: #fff;
}
.button-group {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.login-button {
  width:30%;
}
.register-button {
  width:30%;
}
</style>
