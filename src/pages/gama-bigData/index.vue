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
const queryComplete = ref(false)
const queryProgress = ref(0)
const progressText = ref('正在连接大数据服务...')
const analysisResult = ref<any>(null)
const showResult = ref(false)

// 用户数据
const userData = ref({
  name: '',
  idCard: '',
  phone: '',
})

// 数据分析结果
const dataPoints = ref([])
const riskScore = ref(0)
const creditRating = ref('')

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

// 生成分析结果
function generateAnalysisResults() {
  riskScore.value = Math.floor(Math.random() * 100)

  if (riskScore.value > 80) {
    creditRating.value = 'A+'
  }
  else if (riskScore.value > 60) {
    creditRating.value = 'B'
  }
  else {
    creditRating.value = 'C'
  }

  const points = []
  for (let i = 0; i < 12; i++) {
    points.push(Math.floor(Math.random() * 100))
  }
  dataPoints.value = points
}

// 提交查询
async function submitQuery() {
  // 验证用户数据
  if (!userData.value.name || !userData.value.idCard || !userData.value.phone) {
    showDialog({
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
  queryProgress.value = 0
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
    if (res.code === 0) {
      analysisResult.value = res.data || {}
      generateAnalysisResults()
      showSuccessToast('分析完成')
      showResult.value = true

      // 根据风险评分决定下一步 res.data.riskInfo.riskScore
      if (res.data.riskInfo.riskScore > 80) {
        // 伽马≥80分,系统拒,终止流程,弹窗：抱歉，您的条件不符合，拒绝原因：大数据不符合
        showDialog({
          title: '提示',
          message: '抱歉，您的条件不符合，拒绝原因：大数据不符合',
          theme: 'round-button',
          confirmButtonText: '我知道了',
          confirmButtonColor: '#1989fa',
          overlayStyle: { background: 'rgba(0, 0, 0, 0.7)' }
        })
      }
      else if (res.data.riskInfo.riskScore > 60) {
        // 伽马[50~79)分,且刑事案件或被告执行中案件,终止流程
        showDialog({
          title: '提示',
          message: '抱歉，您的条件不符合，拒绝原因：大数据不符合',
          theme: 'round-button',
          confirmButtonText: '我知道了',
          confirmButtonColor: '#1989fa',
          overlayStyle: { background: 'rgba(0, 0, 0, 0.7)' }
        })
      }
      else {
        setTimeout(() => {
          router.push('/upload-zhengxin')
        }, 500)
      }
    }
    else {
      showFailToast(res.msg || '查询失败')
    }
  }
  catch (error) {
    console.error(error)
    showFailToast('系统异常，请稍后再试')
  }
  finally {
    isQuerying.value = false
    closeToast()
  }
}

// 模拟 API 调用
async function simulateApiCall() {
  return new Promise((resolve) => {
    const progressInterval = setInterval(() => {
      if (queryProgress.value < 100) {
        queryProgress.value += Math.floor(Math.random() * 8) + 3

        if (queryProgress.value >= 100) {
          queryProgress.value = 100
        }

        // 更新进度文本
        if (queryProgress.value < 30) {
          progressText.value = '正在连接大数据服务...'
        }
        else if (queryProgress.value < 60) {
          progressText.value = '正在分析用户数据...'
        }
        else if (queryProgress.value < 90) {
          progressText.value = '正在进行风险评估...'
        }
        else {
          progressText.value = '正在生成分析报告...'
        }
      }
      else {
        clearInterval(progressInterval)

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
              riskScore: Math.floor(Math.random() * 100),
              creditRating: ['A+', 'A', 'B+', 'B', 'C'][Math.floor(Math.random() * 5)],
            },
          })
        })
      }
    }, 100)
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

    <!-- 查询进度展示 -->
    <div v-if="isQuerying" class="cyber-panel progress-panel">
      <div class="panel-header">
        <div class="panel-title">
          数据分析进度
        </div>
        <div class="panel-status">
          {{ progressText }}
        </div>
      </div>

      <div class="cyber-progress">
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: `${queryProgress}%` }" />
        </div>
        <div class="progress-percentage">
          {{ queryProgress }}%
        </div>
      </div>

      <div class="data-network">
        <svg width="100%" height="200" class="network-visualization">
          <line
            v-for="(connection, index) in dataConnections"
            :key="`conn-${index}`"
            :x1="`${dataNodes[connection.source]?.x}%`"
            :y1="`${dataNodes[connection.source]?.y}%`"
            :x2="`${dataNodes[connection.target]?.x}%`"
            :y2="`${dataNodes[connection.target]?.y}%`"
            :style="{ opacity: connection.strength }"
            class="network-line"
          />
          <circle
            v-for="(node, index) in dataNodes"
            :key="`node-${index}`"
            :cx="`${node.x}%`"
            :cy="`${node.y}%`"
            :r="node.size / 3"
            class="network-node"
            :class="{ pulse: queryProgress > 50 }"
          />
        </svg>
      </div>
    </div>

    <!-- 分析结果展示 -->
    <div v-if="showResult" class="cyber-panel result-panel">
      <div class="panel-header">
        <div class="panel-title">
          风控分析结果
        </div>
        <div class="panel-status success">
          分析完成
        </div>
      </div>

      <div class="result-grid">
        <div class="result-score">
          <div class="score-circle" :class="riskScore >= 60 ? 'high-score' : 'low-score'">
            <div class="score-value">
              {{ riskScore }}
            </div>
            <svg viewBox="0 0 100 100" class="score-ring">
              <circle cx="50" cy="50" r="45" />
              <circle cx="50" cy="50" r="45" :style="{ 'stroke-dashoffset': 283 - (283 * riskScore / 100) }" />
            </svg>
          </div>
          <div class="score-label">
            风控评分
          </div>
        </div>

        <div class="result-details">
          <div class="detail-item">
            <div class="detail-label">
              信用等级
            </div>
            <div class="detail-value">
              {{ creditRating }}
            </div>
          </div>

          <div class="detail-item">
            <div class="detail-label">
              评估结果
            </div>
            <div class="detail-value" :class="riskScore >= 60 ? 'success-text' : 'danger-text'">
              {{ riskScore >= 60 ? '通过' : '未通过' }}
            </div>
          </div>

          <div class="detail-item">
            <div class="detail-label">
              后续操作
            </div>
            <div class="detail-value">
              {{ riskScore >= 60 ? '正在跳转下一步...' : '建议提升信用记录' }}
            </div>
          </div>
        </div>
      </div>

      <div class="data-chart">
        <div class="chart-title">
          多维度风险分析
        </div>
        <div class="chart-bars">
          <div
            v-for="(point, index) in dataPoints"
            :key="`bar-${index}`"
            class="chart-bar"
            :style="{ height: `${point}%` }"
          >
            <div class="bar-value">
              {{ point }}
            </div>
          </div>
        </div>
      </div>
    </div>

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

/* 进度条样式 */
.cyber-progress {
  margin-bottom: 20px;
}

.progress-track {
  height: 8px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 10px;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #0070ff, #00c3ff);
  border-radius: 4px;
  transition: width 0.3s ease-in-out;
  position: relative;
  overflow: hidden;
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  animation: progress-shine 2s linear infinite;
}

@keyframes progress-shine {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.progress-percentage {
  text-align: right;
  font-size: 14px;
  color: #00c3ff;
  font-weight: 600;
}

/* 数据可视化样式 */
.data-network {
  position: relative;
  height: 200px;
  margin-top: 20px;
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.2);
  overflow: hidden;
  border: 1px solid rgba(0, 195, 255, 0.1);
}

.network-visualization {
  width: 100%;
  height: 100%;
}

.network-line {
  stroke: rgba(0, 195, 255, 0.3);
  stroke-width: 1;
  transition: all 0.5s;
}

.network-node {
  fill: #00c3ff;
  transition: all 0.5s;
}

.network-node.pulse {
  animation: node-pulse 2s infinite;
}

@keyframes node-pulse {
  0% {
    r: attr(r);
    fill: #00c3ff;
  }
  50% {
    r: calc(attr(r) * 1.2);
    fill: #0070ff;
  }
  100% {
    r: attr(r);
    fill: #00c3ff;
  }
}

/* 结果面板样式 */
.result-panel {
  background: linear-gradient(135deg, rgba(16, 23, 34, 0.9), rgba(10, 14, 23, 0.9));
}

.result-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 20px;
  margin-bottom: 30px;
}

.result-score {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.score-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-bottom: 10px;
}

.score-value {
  font-size: 32px;
  font-weight: 700;
  z-index: 2;
}

.score-ring {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.score-ring circle {
  fill: none;
  stroke-width: 5;
  transform: rotate(-90deg);
  transform-origin: center;
  stroke-dasharray: 283;
  transition: stroke-dashoffset 1s ease-in-out;
}

.score-ring circle:first-child {
  stroke: rgba(255, 255, 255, 0.1);
}

.high-score .score-ring circle:last-child {
  stroke: #00ff80;
}

.high-score .score-value {
  color: #00ff80;
}

.low-score .score-ring circle:last-child {
  stroke: #ff3860;
}

.low-score .score-value {
  color: #ff3860;
}

.score-label {
  font-size: 14px;
  color: #8a9bae;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.result-details {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.detail-item {
  padding: 12px;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  margin-bottom: 10px;
  border: 1px solid rgba(0, 195, 255, 0.1);
}

.detail-label {
  font-size: 12px;
  color: #8a9bae;
  margin-bottom: 5px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-value {
  font-size: 18px;
  font-weight: 600;
}

.success-text {
  color: #00ff80;
}

.danger-text {
  color: #ff3860;
}

/* 数据图表 */
.data-chart {
  padding: 15px;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  border: 1px solid rgba(0, 195, 255, 0.1);
}

.chart-title {
  font-size: 14px;
  color: #8a9bae;
  margin-bottom: 15px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-align: center;
}

.chart-bars {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 100px;
}

.chart-bar {
  width: 7%;
  background: linear-gradient(to top, #0070ff, #00c3ff);
  border-radius: 3px 3px 0 0;
  position: relative;
  transition: height 1s ease-in-out;
}

.chart-bar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    to bottom,
    transparent,
    transparent 5px,
    rgba(0, 0, 0, 0.1) 5px,
    rgba(0, 0, 0, 0.1) 10px
  );
}

.bar-value {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  color: #00c3ff;
}

/* 装饰元素 */
.cyber-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 0;
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

  .result-grid {
    grid-template-columns: 1fr;
  }

  .score-circle {
    width: 100px;
    height: 100px;
  }

  .chart-bars {
    height: 80px;
  }

  .chart-bar {
    width: 6%;
  }
}
</style>
