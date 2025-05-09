<script setup lang="ts">
import { reactive, ref } from 'vue'
import { showDialog, showSuccessToast } from 'vant'
import { creditAnalysis, fileUpload } from '@/api/utils'

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

  // 02 新增放款
  hasNewLoan: '', // 是否有新增放款
  loanCount: '', // 新增放款家数
  loans: [] as any[], // 放款信息数组

  // 03 新增逾期
  hasOverdue: '', // 是否有新增逾期
  
  // 贷款类逾期
  loanOverdues: [
    { id: 'loan1', institution: '中国建设银行', type: '个人住房贷款' }
  ] as any[], // 贷款类逾期数组
  loanOverdueDetails: {} as Record<string, any>, // 贷款类逾期详情
  
  // 贷记卡类逾期
  cardOverdues: [
    { id: 'card1', institution: '中国工商银行', cardNo: '6222 **** **** 1234' }
  ] as any[], // 贷记卡类逾期数组
  cardOverdueDetails: {} as Record<string, any>, // 贷记卡类逾期详情
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

// 放款类型选项
const loanTypeOptions = [
  { text: '贷款', value: '贷款' },
  { text: '信用卡', value: '信用卡' },
]

// 逾期级别选项
const overdueLevelOptions = [
  { text: '1级', value: '1' },
  { text: '2级', value: '2' },
  { text: '3级', value: '3' },
  { text: '4级', value: '4' },
  { text: '5级', value: '5' },
]

// 选择器控制
const currentSelectingIndex = ref(-1)
const currentOverdueType = ref('') // loan 或 card
const currentOverdueId = ref('') // 逾期项目的ID

// 查询相关选择器
const showQueryTypePicker = ref(false)
const showQueryReasonPicker = ref(false)
const showQueryInstitutionPicker = ref(false)

// 放款相关选择器
const showLoanTypePicker = ref(false)
const showLoanInstitutionPicker = ref(false)

// 逃期相关选择器
const showOverdueLevelPicker = ref(false)

// 机构搜索相关
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

// 处理放款类型选择
function handleLoanTypeClick(index: number) {
  currentSelectingIndex.value = index
  showLoanTypePicker.value = true
}

function onLoanTypeConfirm(value: any) {
  const idx = currentSelectingIndex.value
  if (idx >= 0) {
    creditForm.loans[idx].type = value.selectedOptions[0].text
  }
  showLoanTypePicker.value = false
}

// 处理放款机构选择
function handleLoanInstitutionClick(index: number) {
  currentSelectingIndex.value = index
  filteredInstitutions.value = [...creditInstitutions]
  institutionSearchValue.value = ''
  showLoanInstitutionPicker.value = true
}

function onLoanInstitutionConfirm(value: any) {
  const idx = currentSelectingIndex.value
  if (idx >= 0) {
    creditForm.loans[idx].institution = value.selectedOptions[0].text
  }
  showLoanInstitutionPicker.value = false
}

// 处理放款时间选择
function handleLoanTimeClick(index: number) {
  currentDatePickerIndex.value = index
  // 如果已有日期，则转换为数组格式
  if (creditForm.loans[index].time) {
    const dateparts = creditForm.loans[index].time.split('-')
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

// 处理逃期级别选择
function handleOverdueLevelClick(type: string, id: string) {
  currentOverdueType.value = type // loan 或 card
  currentOverdueId.value = id
  showOverdueLevelPicker.value = true
}

function onOverdueLevelConfirm(value: any) {
  if (currentOverdueType.value && currentOverdueId.value) {
    const type = currentOverdueType.value
    const id = currentOverdueId.value
    
    // 设置逾期级别
    if (type === 'loan') {
      if (!creditForm.loanOverdueDetails[id]) {
        creditForm.loanOverdueDetails[id] = {
          level: '',
          amount: '',
          repaid: '否'
        }
      }
      creditForm.loanOverdueDetails[id].level = value.selectedValues[0]
    } else if (type === 'card') {
      if (!creditForm.cardOverdueDetails[id]) {
        creditForm.cardOverdueDetails[id] = {
          level: '',
          amount: '',
          repaid: '否'
        }
      }
      creditForm.cardOverdueDetails[id].level = value.selectedValues[0]
    }
  }
  showOverdueLevelPicker.value = false
}

// 处理逾期项目选择
function toggleOverdueItem(type: string, id: string) {
  // 检查当前状态并切换
  const isChecked = type === 'loan' 
    ? !!creditForm.loanOverdueDetails[id] 
    : !!creditForm.cardOverdueDetails[id]
  
  if (!isChecked) {
    // 初始化逾期详情
    if (type === 'loan') {
      creditForm.loanOverdueDetails[id] = {
        level: '',
        amount: '',
        repaid: '否'
      }
    } else if (type === 'card') {
      creditForm.cardOverdueDetails[id] = {
        level: '',
        amount: '',
        repaid: '否'
      }
    }
  } else {
    // 移除逾期详情
    if (type === 'loan') {
      delete creditForm.loanOverdueDetails[id]
    } else if (type === 'card') {
      delete creditForm.cardOverdueDetails[id]
    }
  }
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

function onQueryTimeConfirm(value: { selectedValues: string[] }) {
  const idx = currentDatePickerIndex.value
  if (idx >= 0 && value && value.selectedValues && Array.isArray(value.selectedValues) && value.selectedValues.length >= 3) {
    // 将数组转换为日期字符串 YYYY-MM-DD
    const selectedValues = value.selectedValues
    const year = selectedValues[0] || ''
    const month = selectedValues[1] ? selectedValues[1].toString().padStart(2, '0') : '01'
    const day = selectedValues[2] ? selectedValues[2].toString().padStart(2, '0') : '01'
    
    // 判断是查询时间还是放款时间
    if (currentSelectingIndex.value >= 0 && creditForm.queries[currentSelectingIndex.value]) {
      creditForm.queries[idx].time = `${year}-${month}-${day}`
    } else if (currentSelectingIndex.value >= 0 && creditForm.loans[currentSelectingIndex.value]) {
      creditForm.loans[idx].time = `${year}-${month}-${day}`
    }
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

// 监听放款家数变化，动态生成表单
function updateLoanForms() {
  const count = Number.parseInt(creditForm.loanCount) || 0

  // 保留现有数据
  const existingLoans = [...creditForm.loans]

  // 重置放款数组
  creditForm.loans = []

  // 创建指定数量的放款对象
  for (let i = 0; i < count; i++) {
    creditForm.loans.push(
      existingLoans[i] || {
        type: '', // 放款类型：贷款/信用卡
        time: '', // 放款时间/发卡时间
        institution: '', // 放款机构/发卡机构
        amount: '', // 放款额度/信用卡额度
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
    // 先上传PDF文件
    const { data: uploadResult } = await fileUpload({ file: file.file })
    
    if (!uploadResult || !uploadResult.url) {
      throw new Error('文件上传失败')
    }
    
    // 调用征信解析接口
    const analysisType = reportType.value === 'simple' ? '简版征信' : '详版征信'
    const { data } = await creditAnalysis({
      url: uploadResult.url,
      analysisType
    })
    
    // 等待弹窗关闭后再设置状态
    await showResultDialog(data)
    
    if (data.status === 'success') {
      uploadComplete.value = true
    }
  }
  catch (error) {
    console.error(error)
    showDialog({
      title: '上传失败',
      message: error.message || '请稍后重试',
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
    // 验证新增查询
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
    
    // 验证新增放款
    if (!creditForm.hasNewLoan) {
      showDialog({ title: '提示', message: '请选择是否有新增放款' })
      return
    }
    
    if (creditForm.hasNewLoan === '是') {
      if (!creditForm.loanCount) {
        showDialog({ title: '提示', message: '请填写新增放款家数' })
        return
      }
      
      // 检查每个放款的必填项
      for (let i = 0; i < creditForm.loans.length; i++) {
        const loan = creditForm.loans[i]
        if (!loan.type) {
          showDialog({ title: '提示', message: `请选择第${i + 1}家放款的放款类型` })
          return
        }
        if (!loan.time) {
          const timeType = loan.type === '贷款' ? '放款时间' : '发卡时间'
          showDialog({ title: '提示', message: `请选择第${i + 1}家放款的${timeType}` })
          return
        }
        if (!loan.institution) {
          const instType = loan.type === '贷款' ? '放款机构' : '发卡机构'
          showDialog({ title: '提示', message: `请选择第${i + 1}家放款的${instType}` })
          return
        }
        if (!loan.amount) {
          const amountType = loan.type === '贷款' ? '放款额度' : '信用卡额度'
          showDialog({ title: '提示', message: `请填写第${i + 1}家放款的${amountType}` })
          return
        }
      }
    }
    
    // 验证新增逃期
    if (!creditForm.hasOverdue) {
      showDialog({ title: '提示', message: '请选择是否有新增逃期' })
      return
    }
    
    if (creditForm.hasOverdue === '是') {
      // 检查是否选择了逃期项目
      const loanOverdueIds = Object.keys(creditForm.loanOverdueDetails)
      const cardOverdueIds = Object.keys(creditForm.cardOverdueDetails)
      
      if (loanOverdueIds.length === 0 && cardOverdueIds.length === 0) {
        showDialog({ title: '提示', message: '请至少选择一项逃期记录' })
        return
      }
      
      // 检查每个贷款类逃期详情
      for (const id of loanOverdueIds) {
        const detail = creditForm.loanOverdueDetails[id]
        if (!detail.level) {
          showDialog({ title: '提示', message: '请选择贷款类逃期级别' })
          return
        }
        if (!detail.amount) {
          showDialog({ title: '提示', message: '请填写贷款类逃期金额' })
          return
        }
        if (!detail.repaid) {
          showDialog({ title: '提示', message: '请选择贷款类逃期是否已还' })
          return
        }
      }
      
      // 检查每个贷记卡类逃期详情
      for (const id of cardOverdueIds) {
        const detail = creditForm.cardOverdueDetails[id]
        if (!detail.level) {
          showDialog({ title: '提示', message: '请选择贷记卡类逃期级别' })
          return
        }
        if (!detail.amount) {
          showDialog({ title: '提示', message: '请填写贷记卡类逃期金额' })
          return
        }
        if (!detail.repaid) {
          showDialog({ title: '提示', message: '请选择贷记卡类逃期是否已还' })
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
  creditForm.hasNewLoan = ''
  creditForm.loanCount = ''
  creditForm.loans = []
  creditForm.hasOverdue = ''
  creditForm.loanOverdues = []
  creditForm.loanOverdueDetails = {}
  creditForm.cardOverdues = []
  creditForm.cardOverdueDetails = {}
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
        accept=".pdf"
      >
        <div class="upload-trigger">
          <van-icon name="description" size="32" />
          <p>点击上传征信报告PDF文件</p>
          <span class="upload-tip">支持PDF格式文件</span>
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
          <van-radio-group v-model="creditForm.hasNewLoan" direction="horizontal">
            <van-radio name="否">
              否
            </van-radio>
            <van-radio name="是">
              是
            </van-radio>
          </van-radio-group>

          <!-- 新增放款家数 -->
          <div v-if="creditForm.hasNewLoan === '是'" class="query-count">
            <van-field
              v-model="creditForm.loanCount"
              label="合计"
              type="digit"
              placeholder="请输入家数"
              input-align="right"
              @input="updateLoanForms"
            >
              <template #button>
                <span>家</span>
              </template>
            </van-field>
          </div>

          <!-- 放款信息表单 -->
          <div v-if="creditForm.hasNewLoan === '是' && creditForm.loans.length > 0" class="query-forms">
            <div v-for="(loan, index) in creditForm.loans" :key="index" class="query-form">
              <div class="query-title">
                新增第 {{ index + 1 }} 家机构放款
              </div>

              <!-- 放款类型 -->
              <van-field
                readonly
                clickable
                label="放款类型"
                v-model="loan.type"
                placeholder="请选择放款类型"
                @click="handleLoanTypeClick(index)"
              />

              <!-- 放款时间/发卡时间 -->
              <van-field
                readonly
                clickable
                :label="loan.type === '贷款' ? '放款时间' : '发卡时间'"
                v-model="loan.time"
                :placeholder="loan.type === '贷款' ? '请选择放款时间' : '请选择发卡时间'"
                @click="handleLoanTimeClick(index)"
              />

              <!-- 放款机构/发卡机构 -->
              <van-field
                readonly
                clickable
                :label="loan.type === '贷款' ? '放款机构' : '发卡机构'"
                v-model="loan.institution"
                placeholder="请选择机构"
                @click="handleLoanInstitutionClick(index)"
              />

              <!-- 放款额度/信用卡额度 -->
              <van-field
                v-model="loan.amount"
                :label="loan.type === '贷款' ? '放款额度' : '信用卡额度'"
                type="digit"
                placeholder="请输入额度"
                input-align="right"
              >
                <template #button>
                  <span>元</span>
                </template>
              </van-field>
            </div>
          </div>
        </div>

        <!-- 03 新增逾期 -->
        <div class="form-section">
          <div class="form-subtitle">
            03 新增逾期
          </div>
          <van-radio-group v-model="creditForm.hasOverdue" direction="horizontal">
            <van-radio name="否">
              否
            </van-radio>
            <van-radio name="是">
              是
            </van-radio>
          </van-radio-group>
          
          <template v-if="creditForm.hasOverdue === '是'">
            <!-- 贷款类逾期 -->
            <div class="sub-section">
              <div class="sub-section-title">
                贷款类逾期
              </div>
              
              <!-- 贷款类逾期选择 -->
              <div class="overdue-selection">
                <template v-for="(item, index) in creditForm.loanOverdues" :key="index">
                  <van-checkbox
                    :name="item.id"
                    :checked="!!creditForm.loanOverdueDetails[item.id]"
                    @click="toggleOverdueItem('loan', item.id)"
                  >
                    {{ item.institution }} - {{ item.type }}
                  </van-checkbox>
                </template>
                
                <template v-if="creditForm.loanOverdues.length === 0">
                  <div class="empty-notice">暂无贷款类逾期记录</div>
                </template>
              </div>
              
              <!-- 贷款类逾期详情 -->
              <template v-for="(detail, id) in creditForm.loanOverdueDetails" :key="id">
                <div class="overdue-detail">
                  <div class="overdue-detail-title">
                    {{ creditForm.loanOverdues.find(item => item.id === id)?.institution }} - 
                    {{ creditForm.loanOverdues.find(item => item.id === id)?.type }}
                  </div>
                  
                  <van-field
                    readonly
                    clickable
                    v-model="detail.level"
                    label="逾期级别"
                    placeholder="请选择逾期级别"
                    @click="handleOverdueLevelClick('loan', id)"
                  />
                  
                  <van-field
                    v-model="detail.amount"
                    label="逾期金额"
                    type="digit"
                    placeholder="请输入逾期金额"
                    input-align="right"
                  >
                    <template #button>
                      <span>元</span>
                    </template>
                  </van-field>
                  
                  <van-field
                    label="是否已还"
                  >
                    <template #input>
                      <van-radio-group v-model="detail.repaid" direction="horizontal">
                        <van-radio name="是">是</van-radio>
                        <van-radio name="否">否</van-radio>
                      </van-radio-group>
                    </template>
                  </van-field>
                </div>
              </template>
            </div>
            
            <!-- 贷记卡类逾期 -->
            <div class="sub-section">
              <div class="sub-section-title">
                贷记卡类逾期
              </div>
              
              <!-- 贷记卡类逾期选择 -->
              <div class="overdue-selection">
                <template v-for="(item, index) in creditForm.cardOverdues" :key="index">
                  <van-checkbox
                    :name="item.id"
                    :checked="!!creditForm.cardOverdueDetails[item.id]"
                    @click="toggleOverdueItem('card', item.id)"
                  >
                    {{ item.institution }} - {{ item.cardNo }}
                  </van-checkbox>
                </template>
                
                <template v-if="creditForm.cardOverdues.length === 0">
                  <div class="empty-notice">暂无贷记卡类逾期记录</div>
                </template>
              </div>
              
              <!-- 贷记卡类逾期详情 -->
              <template v-for="(detail, id) in creditForm.cardOverdueDetails" :key="id">
                <div class="overdue-detail">
                  <div class="overdue-detail-title">
                    {{ creditForm.cardOverdues.find(item => item.id === id)?.institution }} - 
                    {{ creditForm.cardOverdues.find(item => item.id === id)?.cardNo }}
                  </div>
                  
                  <van-field
                    readonly
                    clickable
                    v-model="detail.level"
                    label="逾期级别"
                    placeholder="请选择逾期级别"
                    @click="handleOverdueLevelClick('card', id)"
                  />
                  
                  <van-field
                    v-model="detail.amount"
                    label="逾期金额"
                    type="digit"
                    placeholder="请输入逾期金额"
                    input-align="right"
                  >
                    <template #button>
                      <span>元</span>
                    </template>
                  </van-field>
                  
                  <van-field
                    label="是否已还"
                  >
                    <template #input>
                      <van-radio-group v-model="detail.repaid" direction="horizontal">
                        <van-radio name="是">是</van-radio>
                        <van-radio name="否">否</van-radio>
                      </van-radio-group>
                    </template>
                  </van-field>
                </div>
              </template>
            </div>
          </template>
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
        title="选择时间"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="onQueryTimeConfirm"
        @cancel="showDatePicker = false"
      />
    </van-popup>
    
    <!-- 放款类型选择器 -->
    <van-popup v-model:show="showLoanTypePicker" position="bottom">
      <van-picker
        :columns="loanTypeOptions"
        show-toolbar
        title="选择放款类型"
        @confirm="onLoanTypeConfirm"
        @cancel="showLoanTypePicker = false"
      />
    </van-popup>
    
    <!-- 放款机构选择器 -->
    <van-popup v-model:show="showLoanInstitutionPicker" position="bottom" round>
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
        <div class="search-body">
          <van-picker
            :columns="filteredInstitutions"
            show-toolbar
            title="选择机构"
            @confirm="onLoanInstitutionConfirm"
            @cancel="showLoanInstitutionPicker = false"
          />
        </div>
      </div>
    </van-popup>
    
    <!-- 逾期级别选择器 -->
    <van-popup v-model:show="showOverdueLevelPicker" position="bottom">
      <van-picker
        :columns="overdueLevelOptions"
        show-toolbar
        title="选择逾期级别"
        @confirm="onOverdueLevelConfirm"
        @cancel="showOverdueLevelPicker = false"
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

/* 逾期模块样式 */
.sub-section {
  margin-top: 20px;
  margin-bottom: 25px;
}

.sub-section-title {
  font-size: 1rem;
  margin-bottom: 15px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: bold;
}

.overdue-selection {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;
  margin-top: 15px;
}

.overdue-detail {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 20px;
  margin-top: 15px;
}

.overdue-detail-title {
  font-size: 0.95rem;
  margin-bottom: 15px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: bold;
}

.empty-notice {
  color: rgba(255, 255, 255, 0.6);
  font-style: italic;
  padding: 10px 0;
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
