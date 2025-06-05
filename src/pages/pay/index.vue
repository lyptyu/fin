<script setup>
import { onMounted, ref, watch } from 'vue'
import { alipayAppPayRequest, queryTradeNo } from '@/api/utils.js'
import router from '@/router/index.js'

const route = useRoute()
const payUrl = ref('')
const isSuccess = ref(false)
onMounted(async () => {
  // 如果route.query.out_trade_no存在，表示是支付回调，需要获取支付结果
  if (route.query.outTradeNo) {
    const res = await queryTradeNo({ outTradeNo: route.query.outTradeNo })
    if (res.code === 0) {
      // 支付成功，跳转到gama-bigdata页面
      router.push('/gama-bigdata')
      isSuccess.value = true
    }
    else {
      // 支付失败，提示用户重新支付，重新获取支付页面
      payUrl.value = ''
      showToast('支付失败，请重新支付')
      getPayUrl()
      isSuccess.value = false
    }
  }
  else {
    // 如果route.query.outTradeNo，表示是支付页面，需要获取支付页
    getPayUrl()
  }
})
async function getPayUrl() {
  const res = await alipayAppPayRequest()
  console.log('res', res)
  payUrl.value = res.data.html
}
// 自动提交表单
function autoSubmitForm() {
  // 确保表单已加载
  if (payUrl.value) {
    setTimeout(() => {
      // 查找表单元素并自动提交
      const formElement = document.querySelector('.payment-container form')
      if (formElement)
        formElement.submit()
    }, 100)
  }
}

// 监听payUrl变化，当表单内容加载后自动提交
watch(() => payUrl.value, (newVal) => {
  if (newVal)
    autoSubmitForm()
})
</script>

<template>
  <div class="payment-container">
    <div v-if="!payUrl" class="loading">
      <template v-if="isSuccess">
        <van-loading type="spinner" color="#1989fa" />
        <p>正在跳转到Gama大数据...</p>
      </template>
      <template v-else>
        <van-loading type="spinner" color="#1989fa" />
        <p>正在加载支付页面...</p>
        <!-- 重新获取支付页面 -->
        <van-button type="primary" @click="autoSubmitForm">
          重新获取支付页面
        </van-button>
      </template>
    </div>
    <div v-else class="form-container" v-html="payUrl" />
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
