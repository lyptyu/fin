<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const qrcodeUrl = ref('https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=pay-demo')
const paying = ref(false)

function mockPay() {
  paying.value = true
  setTimeout(() => {
    router.push('/ca-auth')
  }, 1200)
}
</script>

<template>
  <div class="pay-page">
    <div class="pay-box">
      <h2>扫码支付</h2>
      <div class="qrcode-area">
        <img :src="qrcodeUrl" alt="支付二维码">
      </div>
      <div class="pay-tip">
        请使用微信/支付宝扫码支付
      </div>
      <button class="pay-btn" :disabled="paying" @click="mockPay">
        模拟支付成功
      </button>
    </div>
  </div>
</template>

<style scoped>
.pay-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #e8f0ff 0%, #f9fafe 100%);
}
.pay-box {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 32px #c0d6f7;
  padding: 32px 24px 28px 24px;
  max-width: 340px;
  width: 92vw;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.pay-box h2 {
  margin-bottom: 18px;
  font-size: 22px;
  color: #3477f5;
  font-weight: 600;
}
.qrcode-area {
  margin: 12px 0 18px 0;
  background: #f3f7ff;
  border-radius: 10px;
  padding: 16px;
  box-shadow: 0 2px 8px #e3eafd;
  display: flex;
  justify-content: center;
}
.qrcode-area img {
  width: 180px;
  height: 180px;
  object-fit: contain;
}
.pay-tip {
  color: #888;
  font-size: 15px;
  margin-bottom: 22px;
}
.pay-btn {
  width: 100%;
  padding: 12px 0;
  background: #3477f5;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 17px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}
.pay-btn:disabled {
  background: #b4c7f7;
  cursor: not-allowed;
}
@media (max-width: 600px) {
  .pay-box {
    padding: 18px 2vw 16px 2vw;
    max-width: 98vw;
  }
  .qrcode-area img {
    width: 140px;
    height: 140px;
  }
}
</style>
