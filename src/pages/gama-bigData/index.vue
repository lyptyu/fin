<script setup lang="ts">
import { defineExpose, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { closeToast, showDialog, showLoadingToast } from 'vant'

const router = useRouter()

interface FormData {
  name: string
  idCard: string
  phone: string
  income: string
  creditScore: string
}

// 查询表单数据
const formData = reactive<FormData>({
  name: '',
  idCard: '',
  phone: '',
  income: '',
  creditScore: ''
})

// 查询状态
const isQuerying = ref(false)
const queryComplete = ref(false)
const queryProgress = ref(0)
const progressText = ref('正在连接大数据服务...')

// 提交查询
function submitQuery() {
  // 表单验证
  if (!formData.name || !formData.idCard || !formData.phone) {
    showDialog({
      title: '提示',
      message: '请填写完整的个人信息',
      confirmButtonText: '确定',
      confirmButtonColor: '#3477f5'
    })
    return
  }
  
  // 开始查询流程
  simulateQueryProgress()
}

// 查询进度模拟
function simulateQueryProgress() {
  isQuerying.value = true
  queryProgress.value = 0
  showLoadingToast({
    message: '查询中...',
    forbidClick: true,
    duration: 0
  })
  
  const progressInterval = setInterval(() => {
    if (queryProgress.value < 100) {
      queryProgress.value += Math.floor(Math.random() * 10) + 1
      
      if (queryProgress.value >= 100) {
        queryProgress.value = 100
      }
      
      // 更新进度文本
      if (queryProgress.value < 30) {
        progressText.value = '正在连接大数据服务...'
      } else if (queryProgress.value < 60) {
        progressText.value = '正在分析用户数据...'
      } else if (queryProgress.value < 90) {
        progressText.value = '正在进行风险评估...'
      } else {
        progressText.value = '正在生成分析报告...'
      }
    } else {
      clearInterval(progressInterval)
      closeToast()
      queryComplete.value = true
      processQueryResult()
    }
  }, 200)
}

// 处理查询结果
function processQueryResult() {
  // 模拟随机结果：70%概率拒绝，30%概率通过
  const isRejected = Math.random() < 0.7
  
  if (isRejected) {
    // 结果1：显示拒绝弹窗
    showDialog({
      title: '查询结果',
      message: '抱歉，您的条件不符合，拒绝原因：大数据不符合。',
      confirmButtonText: '我知道了',
      confirmButtonColor: '#3477f5'
    })
  } else {
    // 结果2：跳转到upload-zhengxin页面
    router.push('/upload-zhengxin')
  }
  
  // 重置查询状态
  setTimeout(() => {
    isQuerying.value = false
    queryComplete.value = false
  }, 1000)
}

// 暴露给模板使用的变量和函数
defineExpose({
  formData,
  isQuerying,
  queryProgress,
  progressText,
  submitQuery
})
</script>

<template>
  <div class="gama-bigdata-container">
    <div class="header">
      <h1>GAMA大数据风控查询</h1>
      <div class="header-subtitle">AI智能风控 · 实时数据分析 · 精准风险评估</div>
    </div>
    
    <div class="query-form">
      <div class="form-group">
        <label>姓名</label>
        <input 
          type="text" 
          v-model="formData.name" 
          placeholder="请输入您的真实姓名"
        >
      </div>
      
      <div class="form-group">
        <label>身份证号</label>
        <input 
          type="text" 
          v-model="formData.idCard" 
          placeholder="请输入18位身份证号码"
          maxlength="18"
        >
      </div>
      
      <div class="form-group">
        <label>手机号码</label>
        <input 
          type="tel" 
          v-model="formData.phone" 
          placeholder="请输入手机号码"
          maxlength="11"
        >
      </div>
      
      <div class="form-group">
        <label>月收入（选填）</label>
        <input 
          type="number" 
          v-model="formData.income" 
          placeholder="请输入月收入金额"
        >
      </div>
      
      <div class="form-group">
        <label>信用分（选填）</label>
        <input 
          type="number" 
          v-model="formData.creditScore" 
          placeholder="请输入您的信用分"
          min="300"
          max="900"
        >
      </div>
      
      <button 
        class="query-button" 
        @click="submitQuery" 
        :disabled="isQuerying"
      >
        {{ isQuerying ? '查询中...' : '开始查询' }}
      </button>
    </div>
    
    <!-- 查询进度展示 -->
    <div v-if="isQuerying" class="query-progress-container">
      <div class="progress-bar">
        <div 
          class="progress-fill" 
          :style="{ width: `${queryProgress}%` }"
        />
      </div>
      <div class="progress-text">
        <span>{{ progressText }}</span>
        <span>{{ queryProgress }}%</span>
      </div>
      
      <div class="data-visualization">
        <div 
          v-for="n in 20" 
          :key="n" 
          class="data-point" 
          :style="{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            opacity: Math.random() * 0.8 + 0.2
          }"
        />
      </div>
    </div>
    
    <div class="tech-decoration">
      <div class="tech-circle" />
      <div class="tech-lines">
        <div class="tech-line" />
        <div class="tech-line" />
        <div class="tech-line" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.gama-bigdata-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  position: relative;
  overflow: hidden;
  min-height: 100vh;
  background-color: #f8faff;
}

.header {
  text-align: center;
  margin-bottom: 40px;
  position: relative;
  z-index: 2;
}

.header h1 {
  font-size: 28px;
  color: #2c3e50;
  margin-bottom: 8px;
  background: linear-gradient(90deg, #3477f5, #34c4f5);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: bold;
}

.header-subtitle {
  font-size: 14px;
  color: #7f8c8d;
  letter-spacing: 1px;
}

.query-form {
  background: white;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 2;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 14px;
  color: #34495e;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 16px;
  transition: all 0.3s;
  background-color: #f9fafc;
}

.form-group input:focus {
  border-color: #3477f5;
  box-shadow: 0 0 0 2px rgba(52, 119, 245, 0.2);
  outline: none;
}

.query-button {
  width: 100%;
  padding: 14px;
  background: linear-gradient(90deg, #3477f5, #34c4f5);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 10px;
}

.query-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(52, 119, 245, 0.3);
}

.query-button:disabled {
  background: #a0b4d8;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* 查询进度样式 */
.query-progress-container {
  margin-top: 30px;
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 2;
  height: 200px;
}

.progress-bar {
  height: 8px;
  background-color: #eef2f7;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 10px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3477f5, #34c4f5);
  border-radius: 4px;
  transition: width 0.2s ease-in-out;
}

.progress-text {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #7f8c8d;
  margin-bottom: 20px;
}

/* 数据可视化效果 */
.data-visualization {
  position: relative;
  height: 120px;
  margin-top: 20px;
  border-radius: 6px;
  background-color: #f0f5ff;
  overflow: hidden;
}

.data-point {
  position: absolute;
  width: 6px;
  height: 6px;
  background-color: #3477f5;
  border-radius: 50%;
  animation: pulse 3s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.5;
  }
  100% {
    transform: scale(1);
    opacity: 0.7;
  }
}

/* 科技感装饰 */
.tech-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
}

.tech-circle {
  position: absolute;
  top: -150px;
  right: -150px;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  border: 2px dashed rgba(52, 119, 245, 0.1);
  animation: rotate 30s linear infinite;
}

.tech-lines {
  position: absolute;
  bottom: 50px;
  left: -100px;
  transform: rotate(-45deg);
}

.tech-line {
  width: 200px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(52, 119, 245, 0.2), transparent);
  margin: 30px 0;
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
  .header h1 {
    font-size: 24px;
  }
  
  .query-form {
    padding: 20px;
  }
  
  .form-group input {
    padding: 10px 12px;
  }
}
</style>
