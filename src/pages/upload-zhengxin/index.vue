<script setup lang="ts">
import { reactive, ref } from 'vue'
import { showDialog, showSuccessToast } from 'vant'
import { getCreditReportStatus, uploadCreditReport } from '@/api/utils'

// 报告类型
const reportType = ref('simple') // simple: 简版, detail: 详版

// 文件上传状态
const fileList = ref([])
const uploading = ref(false)

// 表单状态控制
const showAdditionalForm = ref(false) // 是否显示上传后的表单
const uploadComplete = ref(false) // 上传成功标志

// 日期选择器控制
const showDatePicker = ref(false)
const currentDatePickerIndex = ref(-1)
const currentDate = ref(['', '', ''])
const minDate = new Date(2020, 0, 1)
const maxDate = new Date(2025, 11, 31)

// 新增信息表单数据
const creditForm = reactive({
  hasNewInfo: '', // 征信后是否有新增

  // 01 新增查询
  hasNewQuery: '', // 是否有新增查询
  queryCount: '', // 新增查询次数
  queries: [] as any[], // 查询信息数组

  // 02 新增放款 (开发中)
  // 03 新增逾期 (开发中)
})

// 查询类型选项
const queryTypeOptions = [
  { text: '机构查询', value: '机构查询' },
  { text: '本人查询', value: '本人查询' },
]

// 机构查询的原因选项
const orgQueryReasonOptions = [
  { text: '贷款审批', value: '贷款审批' },
  { text: '融资审批', value: '融资审批' },
  { text: '额度审批', value: '额度审批' },
  { text: '信用卡审批', value: '信用卡审批' },
  { text: '特约商户查询', value: '特约商户查询' },
  { text: '法人代表、负责人、高管等资信审查', value: '法人代表、负责人、高管等资信审查' },
  { text: '担保资格审查', value: '担保资格审查' },
  { text: '保前审查', value: '保前审查' },
  { text: '客户准入资格查询', value: '客户准入资格查询' },
]

// 本人查询的原因选项
const selfQueryReasonOptions = [
  { text: '本人查询（自助机查询）', value: '本人查询（自助机查询）' },
  { text: '本人查询（商业银行网上银行）', value: '本人查询（商业银行网上银行）' },
]

// 征信机构列表 (模拟数据)
const creditInstitutions = [
  { text: '中国建设银行股份有限公司', value: '中国建设银行股份有限公司' },
  { text: '中国工商银行股份有限公司', value: '中国工商银行股份有限公司' },
  { text: '中国农业银行股份有限公司', value: '中国农业银行股份有限公司' },
  { text: '中国银行股份有限公司', value: '中国银行股份有限公司' },
  { text: '交通银行股份有限公司', value: '交通银行股份有限公司' },
  { text: '招商银行股份有限公司', value: '招商银行股份有限公司' },
  { text: '中信银行股份有限公司', value: '中信银行股份有限公司' },
  { text: '浦发银行股份有限公司', value: '浦发银行股份有限公司' },
]

// 选择器控制
const currentSelectingIndex = ref(-1)
const showQueryTypePicker = ref(false)
const showQueryReasonPicker = ref(false)
const showQueryInstitutionPicker = ref(false)
const filteredInstitutions = ref([...creditInstitutions])
const institutionSearchValue = ref('')

// 处理查询类型选择
function handleQueryTypeClick(index: number) {
  currentSelectingIndex.value = index
  showQueryTypePicker.value = true
}

function onQueryTypeConfirm(value: any) {
  const idx = currentSelectingIndex.value
  if (idx >= 0) {
    creditForm.queries[idx].type = value.selectedOptions[0].text
    // 重置其他相关字段
    creditForm.queries[idx].institution = ''
    creditForm.queries[idx].reason = ''
  }
  showQueryTypePicker.value = false
}

// 处理机构查询
function handleQueryInstitutionClick(index: number) {
  currentSelectingIndex.value = index
  filteredInstitutions.value = [...creditInstitutions]
  institutionSearchValue.value = ''
  showQueryInstitutionPicker.value = true
}

function onQueryInstitutionInput(value: string) {
  institutionSearchValue.value = value
  filteredInstitutions.value = creditInstitutions.filter(item =>
    item.text.includes(value),
  )
}

function onQueryInstitutionConfirm(value: any) {
  const idx = currentSelectingIndex.value
  if (idx >= 0) {
    creditForm.queries[idx].institution = value.selectedOptions[0].text
  }
  showQueryInstitutionPicker.value = false
}

// 处理查询原因选择
function handleQueryReasonClick(index: number) {
  currentSelectingIndex.value = index
  showQueryReasonPicker.value = true
}

function onQueryReasonConfirm(value: any) {
  const idx = currentSelectingIndex.value
  if (idx >= 0) {
    creditForm.queries[idx].reason = value.selectedOptions[0].text
  }
  showQueryReasonPicker.value = false
}

// 处理查询时间选择
function handleQueryTimeClick(index: number) {
  currentDatePickerIndex.value = index
  // 如果已有日期，则转换为数组格式
  if (creditForm.queries[index].time) {
    const dateparts = creditForm.queries[index].time.split('-')
    currentDate.value = [dateparts[0], dateparts[1], dateparts[2]]
  }
  else {
    // 默认当前日期
    const today = new Date()
    currentDate.value = [
      today.getFullYear().toString(),
      (today.getMonth() + 1).toString().padStart(2, '0'),
      today.getDate().toString().padStart(2, '0'),
    ]
  }
  showDatePicker.value = true
}

function onQueryTimeConfirm(value: string[]) {
  const idx = currentDatePickerIndex.value
  if (idx >= 0 && Array.isArray(value) && value.length >= 3) {
    // 将数组转换为日期字符串 YYYY-MM-DD
    const year = value[0] || ''
    const month = value[1] ? value[1].toString().padStart(2, '0') : '01'
    const day = value[2] ? value[2].toString().padStart(2, '0') : '01'
    creditForm.queries[idx].time = `${year}-${month}-${day}`
  }
  showDatePicker.value = false
}

// 监听查询次数变化，动态生成表单
function updateQueryForms() {
  const count = Number.parseInt(creditForm.queryCount) || 0

  // 保留现有数据
  const existingQueries = [...creditForm.queries]

  // 重置查询数组
  creditForm.queries = []

  // 创建指定数量的查询对象
  for (let i = 0; i < count; i++) {
    creditForm.queries.push(
      existingQueries[i] || {
        type: '', // 查询类型
        time: '', // 查询时间
        institution: '', // 查询机构 (仅机构查询)
        reason: '', // 查询原因
      },
    )
  }
}

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

  return showDialog(dialogConfig).then(() => {
    if (data.status === 'success') {
      // 显示额外表单
      showAdditionalForm.value = true
    }
  })
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
    
    // 等待弹窗关闭后再设置状态
    await showResultDialog(data)
    
    // 注意：不需要再设置uploadComplete，因为showResultDialog中已经处理了
    if (data.status === 'success') {
      uploadComplete.value = true
    }
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

// 提交表单
function submitForm() {
  // 验证表单
  if (!creditForm.hasNewInfo) {
    showDialog({ title: '提示', message: '请选择是否有新增信息' })
    return
  }

  if (creditForm.hasNewInfo === '是') {
    if (!creditForm.hasNewQuery) {
      showDialog({ title: '提示', message: '请选择是否有新增查询' })
      return
    }

    if (creditForm.hasNewQuery === '是') {
      if (!creditForm.queryCount) {
        showDialog({ title: '提示', message: '请填写新增查询次数' })
        return
      }

      // 检查每个查询的必填项
      for (let i = 0; i < creditForm.queries.length; i++) {
        const query = creditForm.queries[i]
        if (!query.type) {
          showDialog({ title: '提示', message: `请选择第${i + 1}次查询的查询类型` })
          return
        }
        if (!query.time) {
          showDialog({ title: '提示', message: `请选择第${i + 1}次查询的查询时间` })
          return
        }
        if (query.type === '机构查询' && !query.institution) {
          showDialog({ title: '提示', message: `请选择第${i + 1}次查询的查询机构` })
          return
        }
        if (!query.reason) {
          showDialog({ title: '提示', message: `请选择第${i + 1}次查询的查询原因` })
          return
        }
      }
    }
  }

  // 提交成功提示
  showSuccessToast('提交成功')

  // 重置表单
  resetForm()
}

// 重置表单
function resetForm() {
  creditForm.hasNewInfo = ''
  creditForm.hasNewQuery = ''
  creditForm.queryCount = ''
  creditForm.queries = []
  showAdditionalForm.value = false
  uploadComplete.value = false
  fileList.value = []
}
</script>

<template>
  <div class="upload-zhengxin">
    <!-- 报告类型选择 -->
    <div v-if="!uploadComplete" class="report-type glass-card">
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
    <div v-if="!uploadComplete" class="upload-area glass-card">
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

    <!-- 上传后的额外表单 -->
    <div v-if="showAdditionalForm" class="additional-form glass-card">
      <h2>征信补充信息</h2>

      <!-- 征信后是否有新增 -->
      <div class="form-section">
        <div class="form-title">
          征信后是否有新增
        </div>
        <van-radio-group v-model="creditForm.hasNewInfo" direction="horizontal">
          <van-radio name="否">
            否
          </van-radio>
          <van-radio name="是">
            是
          </van-radio>
        </van-radio-group>
      </div>

      <!-- 新增信息详细内容 -->
      <div v-if="creditForm.hasNewInfo === '是'" class="form-details">
        <!-- 01 新增查询 -->
        <div class="form-section">
          <div class="form-subtitle">
            01 新增查询
          </div>
          <van-radio-group v-model="creditForm.hasNewQuery" direction="horizontal">
            <van-radio name="否">
              否
            </van-radio>
            <van-radio name="是">
              是
            </van-radio>
          </van-radio-group>

          <!-- 新增查询次数 -->
          <div v-if="creditForm.hasNewQuery === '是'" class="query-count">
            <van-field
              v-model="creditForm.queryCount"
              label="合计"
              type="digit"
              placeholder="请输入次数"
              input-align="right"
              @input="updateQueryForms"
            >
              <template #button>
                <span>次</span>
              </template>
            </van-field>
          </div>

          <!-- 查询信息表单 -->
          <div v-if="creditForm.hasNewQuery === '是' && creditForm.queries.length > 0" class="query-forms">
            <div v-for="(query, index) in creditForm.queries" :key="index" class="query-form">
              <div class="query-title">
                新增第 {{ index + 1 }} 次查询
              </div>

              <!-- 查询类型 -->
              <van-field
                readonly
                clickable
                label="查询类型"
                v-model="query.type"
                placeholder="请选择查询类型"
                @click="handleQueryTypeClick(index)"
              />

              <!-- 查询时间 -->
              <van-field
                readonly
                clickable
                label="查询时间"
                v-model="query.time"
                placeholder="请选择查询时间"
                @click="handleQueryTimeClick(index)"
              />

              <!-- 机构查询特有字段 -->
              <template v-if="query.type === '机构查询'">
                <van-field
                  readonly
                  clickable
                  label="查询机构"
                  v-model="query.institution"
                  placeholder="请选择查询机构"
                  @click="handleQueryInstitutionClick(index)"
                />
              </template>

              <!-- 查询原因 -->
              <van-field
                readonly
                clickable
                label="查询原因"
                v-model="query.reason"
                placeholder="请选择查询原因"
                @click="handleQueryReasonClick(index)"
              />
            </div>
          </div>
        </div>

        <!-- 02 新增放款 -->
        <div class="form-section">
          <div class="form-subtitle">
            02 新增放款
          </div>
          <div class="form-developing">
            开发中...
          </div>
        </div>

        <!-- 03 新增逾期 -->
        <div class="form-section">
          <div class="form-subtitle">
            03 新增逾期
          </div>
          <div class="form-developing">
            开发中...
          </div>
        </div>
      </div>

      <!-- 表单提交按钮 -->
      <div class="form-actions">
        <van-button type="primary" block :loading="uploading" @click="submitForm">
          提交
        </van-button>
      </div>
    </div>

    <!-- 选择器 -->
    <!-- 查询类型选择器 -->
    <van-popup v-model:show="showQueryTypePicker" position="bottom">
      <van-picker
        :columns="queryTypeOptions"
        show-toolbar
        title="选择查询类型"
        @confirm="onQueryTypeConfirm"
        @cancel="showQueryTypePicker = false"
      />
    </van-popup>

    <!-- 查询机构选择器 -->
    <van-popup v-model:show="showQueryInstitutionPicker" position="bottom" round>
      <div class="search-picker">
        <div class="search-header">
          <van-field
            v-model="institutionSearchValue"
            placeholder="输入机构名称关键字"
            clearable
            @input="onQueryInstitutionInput"
          >
            <template #button>
              <van-icon name="search" />
            </template>
          </van-field>
        </div>
        <van-picker
          :columns="filteredInstitutions"
          show-toolbar
          title="选择查询机构"
          @confirm="onQueryInstitutionConfirm"
          @cancel="showQueryInstitutionPicker = false"
        />
      </div>
    </van-popup>

    <!-- 查询原因选择器 -->
    <van-popup v-model:show="showQueryReasonPicker" position="bottom">
      <van-picker
        :columns="currentSelectingIndex >= 0 && creditForm.queries[currentSelectingIndex]?.type === '机构查询' ? orgQueryReasonOptions : selfQueryReasonOptions"
        show-toolbar
        title="选择查询原因"
        @confirm="onQueryReasonConfirm"
        @cancel="showQueryReasonPicker = false"
      />
    </van-popup>

    <!-- 日期选择器 -->
    <van-popup v-model:show="showDatePicker" position="bottom">
      <van-date-picker
        v-model="currentDate"
        title="选择查询时间"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="onQueryTimeConfirm"
        @cancel="showDatePicker = false"
      />
    </van-popup>
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

/* 额外表单样式 */
.additional-form {
  color: #fff;
}

.additional-form h2 {
  font-size: 1.5rem;
  margin-bottom: 20px;
  text-align: center;
}

.form-section {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.form-title {
  font-size: 1.2rem;
  margin-bottom: 15px;
  font-weight: bold;
}

.form-subtitle {
  font-size: 1.1rem;
  margin-bottom: 15px;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.9);
}

.query-count {
  margin-top: 15px;
}

.query-forms {
  margin-top: 20px;
}

.query-form {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 15px;
}

.query-title {
  font-size: 1rem;
  margin-bottom: 15px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: bold;
}

.form-developing {
  font-style: italic;
  opacity: 0.7;
  margin: 10px 0;
  background: rgba(0, 0, 0, 0.1);
  padding: 10px;
  border-radius: 5px;
}

.form-actions {
  margin-top: 30px;
}

/* 搜索选择器样式 */
.search-picker {
  background: #fff;
  height: 400px;
  display: flex;
  flex-direction: column;
}

.search-header {
  padding: 10px 15px;
  border-bottom: 1px solid #f0f0f0;
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
