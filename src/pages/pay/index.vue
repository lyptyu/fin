<script setup>
import { onMounted, ref, watch } from 'vue'
import { alipayAppPayRequest } from '@/api/utils.js'

const payUrl = ref('')
onMounted(async () => {
  const res = await alipayAppPayRequest()
  console.log('res', res)
  payUrl.value = res.data
})

// 自动提交表单
function autoSubmitForm() {
  // 确保表单已加载
  if (payUrl.value) {
    setTimeout(() => {
      // 查找表单元素并自动提交
      const formElement = document.querySelector('.payment-container form')
      if (formElement) formElement.submit()
    }, 100)
  }
}

// 监听payUrl变化，当表单内容加载后自动提交
watch(() => payUrl.value, (newVal) => {
  if (newVal) autoSubmitForm()
})
</script>

<template>
  <div class="payment-container">
    <div v-if="!payUrl" class="loading">加载支付页面中...</div>
    <div v-else v-html="payUrl" class="form-container" />
  </div>
</template>

<style scoped>
.payment-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  padding: 20px;
}

.loading {
  font-size: 16px;
  color: #666;
}

.form-container {
  width: 100%;
  max-width: 500px;
}

/* 全局样式覆盖，确保表单元素居中显示 */
:deep(form) {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
