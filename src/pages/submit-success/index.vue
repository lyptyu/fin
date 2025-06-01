<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

// 返回首页
function goHome() {
  router.replace('/')
}
</script>

<template>
  <div class="submit-success-container">
    <div class="success-card">
      <div class="icon-container">
        <van-icon name="success" class="success-icon" />
      </div>
      <div class="success-title">
        提交成功
      </div>
      <div class="success-message">
        您的信息已成功提交，我们将尽快处理您的申请
      </div>
    </div>
  </div>
</template>

<style scoped>
.submit-success-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(180deg, #f0f5ff 0%, #ffffff 100%);
  padding: 20px;
}

.success-card {
  width: 90%;
  max-width: 400px;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  padding: 30px 20px;
  text-align: center;
  animation: fadeIn 0.5s ease-in-out;
}

.icon-container {
  margin-bottom: 20px;
}

.success-icon {
  font-size: 60px;
  color: #4caf50;
  background-color: rgba(76, 175, 80, 0.1);
  border-radius: 50%;
  padding: 15px;
}

.success-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 16px;
}

.success-message {
  font-size: 16px;
  color: #666;
  margin-bottom: 30px;
  line-height: 1.5;
}

.button-container {
  margin-top: 10px;
}

.back-button {
  height: 44px;
  font-size: 16px;
  font-weight: 500;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
