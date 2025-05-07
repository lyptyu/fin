<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showSuccessToast, showToast } from 'vant'

const router = useRouter()
const isLoading = ref(false)
const isVerifying = ref(false)

// 模拟 CA 认证请求
async function mockCAAuth() {
  try {
    isLoading.value = true

    // 模拟认证中状态
    isVerifying.value = true

    // 模拟请求延时
    await new Promise(resolve => setTimeout(resolve, 2000))

    // 模拟认证成功
    isVerifying.value = false
    showSuccessToast('CA认证成功')

    // 模拟跳转到下一步
    setTimeout(() => {
      router.push('/authbook')
    }, 1000)
  }
  catch {
    showToast('认证失败，请重试')
  }
  finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="ca-auth-page">
    <div class="ca-auth-container">
      <h1 class="ca-auth-title bg-gradient-to-r text-2xl text-transparent font-bold mb-8 text-center from-blue-500 to-cyan-500 bg-clip-text">
        CA 认证
      </h1>

      <div class="ca-auth-content">
        <div class="ca-auth-info">
          <p class="ca-auth-desc">
            为了确保您的资金安全，需要进行 CA 认证。
          </p>
          <p class="ca-auth-steps">
            1. 点击下方按钮开始认证过程<br>
            2. 按照提示完成身份验证<br>
            3. 等待系统验证完成
          </p>
        </div>

        <div v-if="isVerifying" class="ca-auth-status">
          <div class="ca-auth-loading">
            <van-loading type="spinner" color="#1989fa" />
          </div>
          <p class="ca-auth-verifying-text">
            正在进行 CA 认证，请稍候...
          </p>
        </div>

        <div class="ca-auth-actions">
          <van-button
            type="primary"
            block
            class="ca-auth-button"
            :loading="isLoading"
            loading-text="处理中..."
            @click="mockCAAuth"
          >
            模拟 CA 认证成功
          </van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ca-auth-page {
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  justify-content: center;
  align-items: center;
}

.ca-auth-container {
  width: 100%;
  max-width: 500px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  padding: 30px 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.ca-auth-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.ca-auth-info {
  background: rgba(240, 248, 255, 0.6);
  border-radius: 12px;
  padding: 20px;
  border-left: 4px solid #1989fa;
}

.ca-auth-desc {
  font-size: 16px;
  margin-bottom: 15px;
  color: #333;
  font-weight: 500;
}

.ca-auth-steps {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

.ca-auth-status {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(25, 137, 250, 0.05);
  border-radius: 12px;
}

.ca-auth-loading {
  margin-bottom: 15px;
}

.ca-auth-verifying-text {
  color: #1989fa;
  font-size: 16px;
  font-weight: 500;
}

.ca-auth-button {
  height: 50px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 25px;
}
</style>
