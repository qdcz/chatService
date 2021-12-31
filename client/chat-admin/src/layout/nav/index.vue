<script setup>
import {
  Search,
  Edit,
  Check,
} from '@element-plus/icons-vue'
import { ref } from 'vue'

defineProps({
  msg: String
})
const count = ref(0)
</script>

<template>
  <div class="flex jus-spa-bet ali-cen bg-Gray">
    <el-button class="" type="success" :icon="Check" circle></el-button>
    <div class="flex">
      <p>锁屏</p>
      <p>搜索</p>
      <p>通知</p>
      <p>全屏</p>
      <p>语言切换</p>
      <p>主题</p>
      <p>刷新</p>
      <div>
        头像+名字
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
