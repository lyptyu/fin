<script setup lang="ts">
import { ref } from 'vue'
import { showDialog } from 'vant'
import { getCreditReportStatus, uploadCreditReport } from '@/api/utils'

// 报告类型
const reportType = ref('simple') // simple: 简版, detail: 详版

// 文件上传状态
const fileList = ref([])
const uploading = ref(false)

// 显示结果弹窗
function showResultDialog(data) {
  const dialogConfig = {
    title: data.status === 'success' ? '审核结果' : '审核未通过',
    message: data.message,
    confirmButtonText: '确定',
    confirmButtonColor: data.status === 'success' ? '#4caf50' : '#f44336',
    className: `status-dialog ${data.status}`,
  }

  if (data.status === 'success' && data.amount) {
    dialogConfig.message += `\n可贷额度：${data.amount}元`
  }

  showDialog(dialogConfig)
}

// 上传文件
async function onUpload(file) {
  uploading.value = true
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', reportType.value)
    await uploadCreditReport(formData)

    // 获取状态 - 这里使用 1-3 来模拟不同状态
    const mockType = Math.floor(Math.random() * 3) + 1
    const { data } = await getCreditReportStatus(mockType)
    showResultDialog(data)
  }
  catch (error) {
    console.error(error)
    showDialog({
      title: '上传失败',
      message: '请稍后重试',
      confirmButtonText: '确定',
      confirmButtonColor: '#f44336',
    })
  }
  finally {
    uploading.value = false
  }
}
</script>

<template>
  <div class="upload-zhengxin">
    <!-- 报告类型选择 -->
    <div class="report-type glass-card">
      <h2>选择征信报告类型</h2>
      <div class="type-options">
        <div
          class="type-option"
          :class="{ active: reportType === 'simple' }"
          @click="reportType = 'simple'"
        >
          <div class="option-icon">
            📄
          </div>
          <div class="option-text">
            <h3>简版征信报告</h3>
            <p>适用于快速审核场景</p>
          </div>
        </div>
        <div
          class="type-option"
          :class="{ active: reportType === 'detail' }"
          @click="reportType = 'detail'"
        >
          <div class="option-icon">
            📑
          </div>
          <div class="option-text">
            <h3>详版征信报告</h3>
            <p>提供完整的征信信息</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 文件上传区域 -->
    <div class="upload-area glass-card">
      <van-uploader
        v-model="fileList"
        :max-count="1"
        :after-read="onUpload"
      >
        <div class="upload-trigger">
          <van-icon name="plus" size="32" />
          <p>点击上传征信报告</p>
        </div>
      </van-uploader>
    </div>
  </div>
</template>

<style scoped>
.upload-zhengxin {
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, #6e8efb, #a777e3);
}

.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.report-type h2 {
  color: #fff;
  margin-bottom: 20px;
  font-size: 1.5rem;
  text-align: center;
}

.type-options {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.type-option {
  padding: 16px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 15px;
  border: 2px solid transparent;
}

.type-option.active {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
}

.option-icon {
  font-size: 2rem;
}

.option-text {
  flex: 1;
  min-width: 0;
}

.option-text h3 {
  color: #fff;
  margin: 0;
  font-size: 1.1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.option-text p {
  color: rgba(255, 255, 255, 0.8);
  margin: 5px 0 0;
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.upload-area {
  text-align: center;
}

.upload-trigger {
  padding: 40px;
  border: 2px dashed rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  cursor: pointer;
}

.upload-trigger p {
  color: #fff;
  margin-top: 10px;
}

.status-display {
  display: flex;
  align-items: center;
  gap: 20px;
}

.status-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-icon.success {
  background: rgba(76, 175, 80, 0.2);
  color: #4caf50;
}

.status-icon.error {
  background: rgba(244, 67, 54, 0.2);
  color: #f44336;
}

.status-text h3 {
  color: #fff;
  margin: 0;
}

.status-text p {
  color: rgba(255, 255, 255, 0.8);
  margin: 5px 0 0;
}

/* 弹窗样式 */
:deep(.status-dialog) {
  border-radius: 16px;
  overflow: hidden;
}

:deep(.status-dialog .van-dialog__header) {
  padding: 20px 20px 0;
  font-weight: bold;
  font-size: 18px;
}

:deep(.status-dialog .van-dialog__message) {
  padding: 20px;
  white-space: pre-line;
  line-height: 1.6;
}

:deep(.status-dialog.success .van-dialog__header) {
  color: #4caf50;
}

:deep(.status-dialog.strong-reject .van-dialog__header),
:deep(.status-dialog.weak-reject .van-dialog__header) {
  color: #f44336;
}

:deep(.status-dialog .van-dialog__confirm) {
  margin: 0 20px 20px;
  border-radius: 8px;
  font-weight: bold;
}
</style>

<route lang="json5">
{
  name: 'upload-zhengxin',
  meta: {
    title: '征信报告上传',
    i18n: 'menus.uploadZhengxin'
  },
}
</route>
