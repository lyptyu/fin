<script setup lang="ts">
import { ref } from 'vue'
import { showToast } from 'vant'
import { useUserStore } from '@/stores'
import router from '@/router'

const userStore = useUserStore()
const phone = ref('')
const code = ref('')
const loading = ref(false)
const timer = ref<number | null>(null)
const countdown = ref(60)

async function sendCode() {
  if (!/^1[3-9]\d{9}$/.test(phone.value)) {
    showToast('请输入正确的手机号')
    return
  }

  // 这里添加发送验证码的接口调用
  try {
    // const res = await api.sendCode(phone.value)
    showToast('验证码发送成功')
    startCountdown()
  }
  catch (error) {
    console.warn(error) // 这里可以根据实际情况处理错误情况，比如显示错误提示等操作。F
    showToast('验证码发送失败')
  }
}

function startCountdown() {
  countdown.value = 60
  timer.value = window.setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      if (timer.value) {
        clearInterval(timer.value)
        timer.value = null
      }
    }
  }, 1000)
}

async function onSubmit() {
  loading.value = true
  try {
    // 这里添加登录接口调用
    // const res = await api.login({ phone: phone.value, code: code.value })
    await userStore.login({ username: phone.value, code: code.value })
    
    // 登录成功后存储手机号到store和localStorage
    userStore.setPhone(phone.value)
    localStorage.setItem('userPhone', phone.value)
    
    showToast('登录成功')
    // 登录成功后跳id-card-upload页面
    router.push({ name: '/id-card-upload/' })
  }
  catch (error) {
    console.warn(error) // 这里可以根据实际情况处理错误情况，比如显示错误提示等操作。
    showToast(error)
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="phone-login">
    <div class="login-container">
      <div class="login-header">
        <h2 class="title">
          手机验证码登录
        </h2>
        <p class="subtitle">
          安全便捷的登录方式
        </p>
      </div>

      <div class="login-form">
        <van-form @submit="onSubmit">
          <van-cell-group inset>
            <van-field
              v-model="phone" label-width="auto" type="tel" label="手机号" placeholder="请输入手机号"
              :rules="[{ required: true, message: '请输入手机号' }]"
            >
              <template #left-icon>
                <van-icon name="phone-o" class="field-icon" />
              </template>
            </van-field>

            <van-field
              v-model="code" label-width="auto" center label="验证码" placeholder="请输入验证码"
              :rules="[{ required: true, message: '请输入验证码' }]"
            >
              <template #left-icon>
                <van-icon name="shield-o" class="field-icon" />
              </template>
              <template #button>
                <van-button size="small" type="primary" :disabled="!!timer" @click="sendCode">
                  {{ timer ? `${countdown}秒后重试` : '获取验证码' }}
                </van-button>
              </template>
            </van-field>
          </van-cell-group>

          <div class="submit-btn">
            <van-button round block type="primary" native-type="submit" :loading="loading">
              登录
            </van-button>
          </div>
        </van-form>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.phone-login {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;

  .login-container {
    width: 100%;
    max-width: 400px;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    padding: 30px 20px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  }

  .login-header {
    text-align: center;
    margin-bottom: 30px;

    .title {
      font-size: 24px;
      color: #333;
      margin-bottom: 8px;
      font-weight: 600;
    }

    .subtitle {
      font-size: 14px;
      color: #666;
    }
  }

  .login-form {
    :deep(.van-cell-group--inset) {
      margin: 0;
    }

    :deep(.van-field) {
      background: transparent;
    }

    .field-icon {
      font-size: 20px;
      color: #666;
    }
  }

  .submit-btn {
    margin-top: 24px;
    padding: 0 12px;

    .van-button {
      height: 44px;
      font-size: 16px;
      background: linear-gradient(to right, #667eea, #764ba2);
      border: none;

      &:active {
        opacity: 0.9;
      }
    }
  }
}
</style>
