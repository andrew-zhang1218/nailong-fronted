<script setup>
import { ElMenu, ElMenuItem, ElTooltip } from "element-plus";

// 获取用户角色
const userRole = sessionStorage.getItem('role') || '';  // 获取角色信息，默认为空
const isAdmin = userRole === 'admin';  // 判断是否是管理员
</script>

<template>
  <div class="nav-bar-container">
    <el-menu
        class="nav-bar"
        mode="horizontal"
        :router="true"
    >
      <el-menu-item index="/home">奶龙书城</el-menu-item>
      <el-menu-item index="/cart">购物车</el-menu-item>

      <!-- 库存管理按钮，只有管理员能访问 -->
      <el-tooltip v-if="!isAdmin" content="只有管理员才能访问" placement="bottom">
        <el-menu-item index="/warehouse" disabled>库存管理</el-menu-item>
      </el-tooltip>
      <el-menu-item v-else index="/warehouse">库存管理</el-menu-item>

      <el-menu-item index="/userinfo">个人信息</el-menu-item>
    </el-menu>
  </div>
</template>

<style scoped>
.nav-bar-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  height: 60px;
}

.nav-bar {
  display: inline-block;
  width: 100%;
  margin: 0 auto;
  height: 100%;
}
</style>

