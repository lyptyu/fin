<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { showToast } from 'vant'
import { useUserStore } from '@/stores'
import router from '@/router'
import { useRoute } from 'vue-router'
import { sendCode as apiSendCode } from '@/api/utils'
import { loginStatus } from '@/api/user'

const route = useRoute()
const userStore = useUserStore()
const phone = ref('')
const code = ref('')
const loading = ref(false)
const timer = ref<number | null>(null)
const countdown = ref(60)
const hasRequestedCode = ref(false)
const agreedToTerms = ref(false)

// 在组件挂载时获取URL参数agent_id并保存到store
onMounted(() => {
  const agentId = route.query.agent_id as string
  if (agentId) {
    userStore.setAgentId(agentId)
  }
})

async function sendCode() {
  if (!/^1[3-9]\d{9}$/.test(phone.value)) {
    showToast('请输入正确的本人实名认证手机号码')
    return
  }

  // 调用发送验证码接口
  try {
    // 由于可能是模拟环境，我们直接设置为成功状态
    // 实际环境下应使用以下代码：
    const res = await apiSendCode({ phone: phone.value })
    if (res.code === 0) {
      showToast('验证码发送成功')
      hasRequestedCode.value = true
      startCountdown()
    }
    else {
      showToast(res.message || '验证码发送失败')
    }
  }
  catch (error) {
    console.warn(error)
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
  // 验证是否已获取验证码
  if (!hasRequestedCode.value) {
    showToast('请先获取验证码')
    return
  }

  loading.value = true
  try {
    // 构建登录参数，包含agentId
    const loginParams: {
      phone: string
      code: string
      agentId?: string
    } = {
      phone: phone.value,
      code: code.value,
    }

    // 如果有agentId，添加到登录参数中
    const agentId = userStore.getAgentId()
    if (agentId) {
      loginParams.agentId = agentId
    }

    // 调用登录接口
    await userStore.login(loginParams)

    // 登录成功后存储手机号到store和localStorage
    userStore.setPhone(phone.value)
    localStorage.setItem('userPhone', phone.value)

    showToast('登录成功')
    // 登录成功后跳id-card-upload页面
    const statusRes = await loginStatus()
    if (statusRes.code === 0) {
      if (statusRes.data.status === '-1') {
        router.push({ name: '/id-card-upload/' })
      }
      else if (statusRes.data.approvalstatus == '1' && statusRes.data.status == '0') {
        showToast(statusRes.data.message)
      }
      else if (statusRes.data.approvalstatus == '1' && statusRes.data.status == '1') {
        router.push({ name: 'upload-zhengxin' })
      }
      else if (statusRes.data.approvalstatus == '2') {
        router.push({ name: '/last-start/' })
      }
      else if (statusRes.data.approvalstatus == '3' && statusRes.data.status == '0') {

        router.push({ name: '/submit-success/' })
      }
      else if (statusRes.data.approvalstatus == '3' && statusRes.data.status == '1') {
        router.push({ name: '/last-start/' })
      }
    }
    else {
      showToast(statusRes.msg)
    }
  }
  catch (error) {
    console.warn(error)
    if (typeof error === 'string') {
      showToast(error)
    }
    else if (error && typeof error === 'object' && 'message' in error) {
      showToast(error.message as string)
    }
    else {
      showToast('登录失败，请重试')
    }
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
          安全便捷的登录方式v1.0
        </p>
      </div>

      <div class="login-form">
        <van-form @submit="onSubmit">
          <van-cell-group inset>
            <van-field
              v-model="phone" label-width="auto" type="tel" label="手机号" placeholder="请输入本人实名认证手机号码"
              :rules="[{ required: true, message: '请输入本人实名认证手机号码' }]"
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

          <div class="agreement-section">
            <van-checkbox v-model="agreedToTerms" icon-size="16px"></van-checkbox>
            <span>
              已阅读并同意
              <router-link to="/agreement1" class="agreement-link">《用户协议及隐私政策》</router-link>、
              <router-link to="/agreement2" class="agreement-link">《征信查询授权书》</router-link>、
              <router-link to="/agreement3" class="agreement-link">《个人信息查询及使用授权书》</router-link>
              及
              <router-link to="/agreement4" class="agreement-link">《个人信息对外提供授权书》</router-link>
              的内容
            </span>
          </div>

          <div class="submit-btn">
            <van-button
              round block type="primary" native-type="submit" :loading="loading"
              :disabled="!hasRequestedCode || !code || !agreedToTerms"
            >
              {{ !hasRequestedCode ? '请先获取验证码' : !code ? '请输入验证码' : !agreedToTerms ? '请勾选同意协议' : '登录' }}
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

  .agreement-section {
    margin-top: 16px;
    padding: 0 12px;
    font-size: 12px;
    color: #666;
    display: flex;
    align-items: flex-start; // Align checkbox with the top of the text line
    text-align: left;
  }

  .agreement-section .van-checkbox {
    margin-right: 8px;
    // Adjust to better align with the first line of text
    margin-top: 1px;
  }

  .agreement-section span {
    flex: 1;
    line-height: 1.5; // Improve readability for wrapped text
  }

  .agreement-link {
    color: #667eea;
    text-decoration: none;
  }

  .agreement-link:hover {
    text-decoration: underline;
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
