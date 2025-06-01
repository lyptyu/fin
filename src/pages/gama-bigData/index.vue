<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { closeToast, showDialog, showFailToast, showLoadingToast, showSuccessToast } from 'vant'
import { useUserStore } from '@/stores'
import { bigDataQuery } from '@/api/utils'

const router = useRouter()
const userStore = useUserStore()

// 查询状态
const isQuerying = ref(false)
const showResult = ref(false)

// 用户数据
const userData = ref({
  name: '',
  idCard: '',
  phone: '',
})

// 动态数据可视化元素
const dataNodes = ref([])
const dataConnections = ref([])

// 生成随机数据节点
function generateDataNodes() {
  const categories = [
    '信用卡',
    '贷款记录',
    '消费模式',
    '社交关系',
    '资产状况',
    '还款能力',
    '退款记录',
    '退货率',
    '信用记录',
    '行为分析',
  ]

  const nodes = []
  for (let i = 0; i < 12; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)]
    const value = Math.floor(Math.random() * 100)
    nodes.push({
      id: i,
      category,
      value,
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
      size: Math.random() * 20 + 10,
    })
  }
  dataNodes.value = nodes

  // 生成连接
  const connections = []
  for (let i = 0; i < 15; i++) {
    const source = Math.floor(Math.random() * nodes.length)
    let target = Math.floor(Math.random() * nodes.length)
    while (target === source) {
      target = Math.floor(Math.random() * nodes.length)
    }
    connections.push({
      id: i,
      source,
      target,
      strength: Math.random(),
    })
  }
  dataConnections.value = connections
}

// 提交查询
async function submitQuery() {
  // 验证用户数据
  if (!userData.value.name || !userData.value.idCard || !userData.value.phone) {
    await showDialog({
      title: '提示',
      message: '无法获取完整的用户信息，请先完成身份验证',
      confirmButtonText: '确定',
      confirmButtonColor: '#3477f5',
    })
    return
  }

  // 开始查询流程
  startQuery()
}

// 开始查询
async function startQuery() {
  isQuerying.value = true
  showResult.value = false
  showLoadingToast({
    message: '查询中...',
    forbidClick: true,
    duration: 0,
  })

  // 生成数据可视化元素
  generateDataNodes()

  try {
    // 调用大数据查询接口
    const res = await simulateApiCall()

    // 处理查询结果
    if (true || res.code === 0) {
      showSuccessToast('分析完成')

      setTimeout(() => {
        router.push('/upload-zhengxin')
      }, 500)
    }
    else {
      console.log('fail123')
      showFailToast({
        message: res.msg || '查询失败',
        duration: 2000,
      })
    }
  }
  catch (error) {
    console.error(error)
    showFailToast({
      message: '系统异常，请稍后再试',
      duration: 2000,
    })
  }
  finally {
    isQuerying.value = false
    // 移除closeToast()调用，让Toast按照设定的duration自动关闭
  }
}

// 模拟 API 调用
async function simulateApiCall() {
  return new Promise((resolve) => {
    // 添加一个短暂停，模拟请求时间
    setTimeout(() => {
      // 实际调用 API
      bigDataQuery({
        name: userData.value.name,
        idCard: userData.value.idCard,
        phone: userData.value.phone,
      }).then((res) => {
        resolve(res)
      }).catch((err) => {
        console.error(err)
        // 失败时返回模拟数据
        resolve({
          code: 0,
          data: {
            riskInfo: {
              riskScore: Math.floor(Math.random() * 100),
            },
          },
        })
      })
    }, 1000) // 模拟1秒的请求时间
  })
}

// 在组件挂载时获取用户数据
onMounted(() => {
  // 从 store 中获取用户数据
  userData.value = {
    name: userStore.getName() || localStorage.getItem('userName') || '',
    idCard: userStore.getIdCard() || localStorage.getItem('userIdCard') || '',
    phone: userStore.getPhone() || localStorage.getItem('userPhone') || '',
  }

  console.log('用户数据:', userData.value)

  // 预生成数据可视化元素
  generateDataNodes()
})
</script>

<template>
  <div class="gama-bigdata-container">
    <div class="cyber-header">
      <div class="cyber-logo">
        <div class="cyber-logo-inner" />
      </div>
      <h1>GAMA 智能风控平台</h1>
      <div class="cyber-subtitle">
        <span>人工智能</span>
        <span class="divider" />
        <span>大数据分析</span>
        <span class="divider" />
        <span>量化风控</span>
      </div>
    </div>

    <div class="cyber-panel user-info-panel">
      <div class="panel-header">
        <div class="panel-title">
          用户信息
        </div>
        <div class="panel-subtitle">
          自动从系统获取
        </div>
      </div>

      <div class="user-info-grid">
        <div class="info-item">
          <div class="info-label">
            姓名
          </div>
          <div class="info-value">
            {{ userData.name || '未获取' }}
          </div>
        </div>

        <div class="info-item">
          <div class="info-label">
            手机号
          </div>
          <div class="info-value">
            {{ userData.phone || '未获取' }}
          </div>
        </div>

        <div class="info-item">
          <div class="info-label">
            身份证号
          </div>
          <div class="info-value">
            {{ userData.idCard ? (`${userData.idCard.substring(0, 6)}********${userData.idCard.substring(14)}`) : '未获取' }}
          </div>
        </div>
      </div>

      <button
        class="cyber-button"
        :disabled="isQuerying"
        @click="submitQuery"
      >
        <span class="button-text">{{ isQuerying ? '正在分析...' : '开始风控分析' }}</span>
        <span class="button-glitch" />
      </button>
    </div>

    <!-- 已删除查询进度展示 -->

    <div class="cyber-decoration">
      <div class="cyber-grid" />
      <div class="cyber-circle" />
      <div class="cyber-lines">
        <div class="cyber-line" />
        <div class="cyber-line" />
        <div class="cyber-line" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.gama-bigdata-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  position: relative;
  overflow: hidden;
  min-height: 100vh;
  background-color: #0a0e17;
  color: #e0e0e0;
  font-family: 'Roboto', sans-serif;
}

/* 超现代头部样式 */
.cyber-header {
  text-align: center;
  margin-bottom: 40px;
  position: relative;
  z-index: 2;
  padding: 20px 0;
  border-bottom: 1px solid rgba(0, 195, 255, 0.2);
}

.cyber-logo {
  width: 60px;
  height: 60px;
  margin: 0 auto 15px;
  position: relative;
  background: linear-gradient(135deg, #00c3ff, #0070ff);
  border-radius: 50%;
  padding: 3px;
  box-shadow: 0 0 15px rgba(0, 195, 255, 0.7);
}

.cyber-logo-inner {
  width: 100%;
  height: 100%;
  background-color: #0a0e17;
  border-radius: 50%;
  position: relative;
}

.cyber-logo-inner::before,
.cyber-logo-inner::after {
  content: '';
  position: absolute;
  background: linear-gradient(135deg, #00c3ff, #0070ff);
}

.cyber-logo-inner::before {
  width: 60%;
  height: 2px;
  top: 50%;
  left: 20%;
  transform: translateY(-50%);
}

.cyber-logo-inner::after {
  width: 2px;
  height: 60%;
  left: 50%;
  top: 20%;
  transform: translateX(-50%);
}

.cyber-header h1 {
  font-size: 32px;
  margin-bottom: 10px;
  background: linear-gradient(90deg, #00c3ff, #0070ff);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.cyber-subtitle {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  color: #8a9bae;
  letter-spacing: 1.5px;
}

.cyber-subtitle .divider {
  width: 4px;
  height: 4px;
  background-color: #00c3ff;
  border-radius: 50%;
  margin: 0 10px;
}

/* 面板样式 */
.cyber-panel {
  background: rgba(16, 23, 34, 0.8);
  border-radius: 10px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 195, 255, 0.1);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.cyber-panel::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #00c3ff, transparent);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.panel-title {
  font-size: 18px;
  font-weight: 600;
  color: #00c3ff;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.panel-subtitle {
  font-size: 12px;
  color: #8a9bae;
}

.panel-status {
  font-size: 14px;
  color: #8a9bae;
  padding: 4px 10px;
  border-radius: 4px;
  background-color: rgba(0, 195, 255, 0.1);
}

.panel-status.success {
  background-color: rgba(0, 255, 128, 0.1);
  color: #00ff80;
}

/* 用户信息面板 */
.user-info-panel {
  background: linear-gradient(135deg, rgba(16, 23, 34, 0.9), rgba(10, 14, 23, 0.9));
}

.user-info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-bottom: 25px;
}

.info-item {
  padding: 15px;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  border: 1px solid rgba(0, 195, 255, 0.1);
}

.info-label {
  font-size: 12px;
  color: #8a9bae;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 16px;
  color: #e0e0e0;
  font-weight: 500;
  word-break: break-all;
}

/* 按钮样式 */
.cyber-button {
  width: 100%;
  padding: 14px;
  background: linear-gradient(90deg, #0070ff, #00c3ff);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.cyber-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: all 0.5s;
}

.cyber-button:hover::before {
  left: 100%;
}

.cyber-button:hover {
  box-shadow: 0 0 15px rgba(0, 195, 255, 0.5);
  transform: translateY(-2px);
}

.cyber-button:disabled {
  background: linear-gradient(90deg, #2a3a4a, #3a4a5a);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.button-text {
  position: relative;
  z-index: 2;
}

.button-glitch {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 195, 255, 0.1);
  display: none;
}

.cyber-button:hover .button-glitch {
  display: block;
  animation: glitch 0.3s linear;
}

@keyframes glitch {
  0% {
    transform: translate(0);
  }
  20% {
    transform: translate(-2px, 2px);
  }
  40% {
    transform: translate(-2px, -2px);
  }
  60% {
    transform: translate(2px, 2px);
  }
  80% {
    transform: translate(2px, -2px);
  }
  100% {
    transform: translate(0);
  }
}

/* 已删除进度条和数据可视化相关样式 */

/* 装饰元素 */
.cyber-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: -1;
  overflow: hidden;
}

.cyber-grid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    linear-gradient(rgba(0, 195, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 195, 255, 0.05) 1px, transparent 1px);
  background-size: 30px 30px;
  background-position: center center;
}

.cyber-circle {
  position: absolute;
  top: -250px;
  right: -250px;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  border: 1px solid rgba(0, 195, 255, 0.1);
  box-shadow: inset 0 0 50px rgba(0, 195, 255, 0.1);
  animation: rotate 60s linear infinite;
}

.cyber-lines {
  position: absolute;
  bottom: 50px;
  left: -100px;
  transform: rotate(-45deg);
}

.cyber-line {
  width: 300px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0, 195, 255, 0.2), transparent);
  margin: 50px 0;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 响应式调整 */
@media (max-width: 768px) {
  .cyber-header h1 {
    font-size: 24px;
  }

  .user-info-grid {
    grid-template-columns: 1fr;
  }

  .chart-bars {
    height: 80px;
  }

  .chart-bar {
    width: 6%;
  }
}
</style>
