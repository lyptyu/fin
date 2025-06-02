<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { searchAssessmentReport } from '@/api/user'

const route = useRoute()
const reportData = ref(null)
const loading = ref(false)
const error = ref('')
const activeTab = ref('basic')

onMounted(async () => {
  try {
    loading.value = true
    // Get parameters from URL
    const phone = route.query.phone as string
    const agentId = route.query.agent_id as string
    const analysisType = '' // You can also get this from URL if needed

    if (!phone || !agentId) {
      error.value = 'Missing required parameters: phone or agent_id'
      return
    }

    // Call the API
    const res = await searchAssessmentReport(phone, agentId, analysisType)
    reportData.value = res
  }
  catch (err) {
    console.error('Failed to fetch assessment report:', err)
    error.value = 'Failed to fetch assessment report'
  }
  finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="pc-container">
    <div class="pc-header">
      <div class="header-logo">
        <div class="logo-inner" />
      </div>
      <h1>金融评估报告</h1>
      <div class="header-subtitle">
        <span>智能分析</span>
        <span class="divider" />
        <span>风险评估</span>
        <span class="divider" />
        <span>信用报告</span>
      </div>
    </div>

    <div class="pc-content">
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner" />
        <div class="loading-text">数据加载中，请稍候...</div>
      </div>
      
      <div v-else-if="error" class="error-container">
        <div class="error-icon">!</div>
        <div class="error-message">{{ error }}</div>
      </div>
      
      <div v-else-if="reportData" class="report-container">
        <div class="sidebar">
          <div 
            class="sidebar-item" 
            :class="{ active: activeTab === 'basic' }"
            @click="activeTab = 'basic'"
          >
            基本信息
          </div>
          <div 
            class="sidebar-item" 
            :class="{ active: activeTab === 'credit' }"
            @click="activeTab = 'credit'"
          >
            信用评估
          </div>
          <div 
            class="sidebar-item" 
            :class="{ active: activeTab === 'risk' }"
            @click="activeTab = 'risk'"
          >
            风险分析
          </div>
          <div 
            class="sidebar-item" 
            :class="{ active: activeTab === 'recommendation' }"
            @click="activeTab = 'recommendation'"
          >
            建议方案
          </div>
        </div>
        
        <div class="main-content">
          <div class="panel">
            <div class="panel-header">
              <div class="panel-title">
                {{ 
                  activeTab === 'basic' 
                    ? '基本信息' 
                    : activeTab === 'credit' 
                      ? '信用评估' 
                      : activeTab === 'risk' 
                        ? '风险分析' 
                        : '建议方案' 
                }}
              </div>
              <div class="panel-subtitle">
                {{ new Date().toLocaleDateString() }} 评估报告
              </div>
            </div>
            
            <div class="panel-content">
              <pre>{{ JSON.stringify(reportData, null, 2) }}</pre>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="no-data-container">
        <div class="no-data-icon">?</div>
        <div class="no-data-message">暂无数据</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* PC布局容器 */
.pc-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  background-color: #f5f7fa;
  color: #333;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

/* 头部样式 */
.pc-header {
  text-align: center;
  margin-bottom: 40px;
  padding: 20px 0;
  border-bottom: 1px solid rgba(0, 123, 255, 0.2);
}

.header-logo {
  width: 60px;
  height: 60px;
  margin: 0 auto 15px;
  position: relative;
  background: linear-gradient(135deg, #0070ff, #00c3ff);
  border-radius: 50%;
  padding: 3px;
  box-shadow: 0 0 15px rgba(0, 123, 255, 0.5);
}

.logo-inner {
  width: 100%;
  height: 100%;
  background-color: #fff;
  border-radius: 50%;
  position: relative;
}

.logo-inner::before,
.logo-inner::after {
  content: '';
  position: absolute;
  background: linear-gradient(135deg, #0070ff, #00c3ff);
}

.logo-inner::before {
  width: 60%;
  height: 2px;
  top: 50%;
  left: 20%;
  transform: translateY(-50%);
}

.logo-inner::after {
  width: 2px;
  height: 60%;
  left: 50%;
  top: 20%;
  transform: translateX(-50%);
}

.pc-header h1 {
  font-size: 32px;
  margin-bottom: 10px;
  background: linear-gradient(90deg, #0070ff, #00c3ff);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
}

.header-subtitle {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  color: #8a9bae;
  letter-spacing: 1.5px;
}

.header-subtitle .divider {
  width: 4px;
  height: 4px;
  background-color: #0070ff;
  border-radius: 50%;
  margin: 0 10px;
}

/* PC内容布局 */
.pc-content {
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 200px);
}

/* 加载中状态 */
.loading-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 3px solid rgba(0, 123, 255, 0.1);
  border-radius: 50%;
  border-top-color: #0070ff;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  font-size: 16px;
  color: #8a9bae;
}

/* 错误状态 */
.error-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.error-icon {
  width: 60px;
  height: 60px;
  background-color: #f56c6c;
  color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 20px;
}

.error-message {
  font-size: 16px;
  color: #f56c6c;
}

/* 无数据状态 */
.no-data-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.no-data-icon {
  width: 60px;
  height: 60px;
  background-color: #909399;
  color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 20px;
}

.no-data-message {
  font-size: 16px;
  color: #909399;
}

/* 报告容器 */
.report-container {
  display: flex;
  min-height: 600px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

/* 侧边栏 */
.sidebar {
  width: 200px;
  background-color: #fff;
  border-right: 1px solid #ebeef5;
  padding: 20px 0;
}

.sidebar-item {
  padding: 15px 20px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
  color: #606266;
  border-left: 3px solid transparent;
}

.sidebar-item:hover {
  background-color: #f5f7fa;
  color: #0070ff;
}

.sidebar-item.active {
  background-color: #ecf5ff;
  color: #0070ff;
  border-left-color: #0070ff;
}

/* 主内容区 */
.main-content {
  flex: 1;
  background-color: #fff;
  padding: 20px;
  overflow: auto;
}

/* 面板样式 */
.panel {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 15px;
  margin-bottom: 20px;
  border-bottom: 1px solid #ebeef5;
}

.panel-title {
  font-size: 18px;
  font-weight: 600;
  color: #0070ff;
}

.panel-subtitle {
  font-size: 12px;
  color: #8a9bae;
}

.panel-content {
  padding: 10px 0;
}

.panel-content pre {
  white-space: pre-wrap;
  word-break: break-word;
  overflow-x: auto;
  font-family: 'Consolas', monospace;
  font-size: 14px;
  line-height: 1.5;
  color: #333;
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 4px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .pc-container {
    padding: 10px;
  }
  
  .pc-header h1 {
    font-size: 24px;
  }
  
  .report-container {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #ebeef5;
    display: flex;
    overflow-x: auto;
    padding: 10px;
  }
  
  .sidebar-item {
    padding: 10px 15px;
    border-left: none;
    border-bottom: 3px solid transparent;
    white-space: nowrap;
  }
  
  .sidebar-item.active {
    border-left-color: transparent;
    border-bottom-color: #0070ff;
  }
}
</style>
