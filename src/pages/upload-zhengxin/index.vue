<script setup lang="ts">
import { reactive, ref } from 'vue'
import { closeToast, showDialog, showLoadingToast, showSuccessToast } from 'vant'
import { creditAnalysis, fileUpload } from '@/api/utils'
import { selectDetailedLoanOverdue, selectSimpleLoanOverdue } from '@/api/user'
import { useUserStore } from '@/stores'

// 报告类型
const reportType = ref('simple') // simple: 简版, detail: 详版

// 文件上传状态
const fileList = ref([])
const uploading = ref(false)
const uploadFailed = ref(false) // 上传是否失败标志

// 表单状态控制
const showAdditionalForm = ref(false) // 是否显示上传后的表单
const analysisComplete = ref(false) // 征信解析完成标志

// 日期选择器控制
const showDatePicker = ref(false)
const currentDatePickerIndex = ref(-1)
const currentDate = ref(['', '', ''])
const currentSelectingType = ref('') // 'query' 或 'loan'
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
  loanOverdues: [] as any[], // 贷款类逾期数组
  loanOverdueDetails: {} as Record<string, any>, // 贷款类逾期详情

  // 贷记卡类逾期
  cardOverdues: [] as any[], // 贷记卡类逾期数组
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

// 逾期级别选项已移除

// 选择器控制
const currentSelectingIndex = ref(-1)
// 逾期类型和ID变量已移除

// 查询相关选择器
const showQueryTypePicker = ref(false)
const showQueryReasonPicker = ref(false)
const showQueryInstitutionPicker = ref(false)

// 放款相关选择器
const showLoanTypePicker = ref(false)
const showLoanInstitutionPicker = ref(false)

// 逾期相关选择器已移除

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
  // 标记当前是放款时间选择
  currentSelectingType.value = 'loan'
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

// 处理逾期项目选择
function toggleOverdueItem(type: string, id: string) {
  if (type === 'loan') {
    if (creditForm.loanOverdueDetails[id]) {
      // 如果已经存在，则删除
      delete creditForm.loanOverdueDetails[id]
    }
    else {
      // 如果不存在，则创建
      if (!creditForm.loanOverdueDetails[id]) {
        creditForm.loanOverdueDetails[id] = {
          amount: '',
          repaid: '否',
        }
      }
    }
  }
  else if (type === 'card') {
    if (creditForm.cardOverdueDetails[id]) {
      // 如果已经存在，则删除
      delete creditForm.cardOverdueDetails[id]
    }
    else {
      // 如果不存在，则创建
      if (!creditForm.cardOverdueDetails[id]) {
        creditForm.cardOverdueDetails[id] = {
          amount: '',
          repaid: '否',
        }
      }
    }
  }
}

// 处理查询时间选择
function handleQueryTimeClick(index: number) {
  currentDatePickerIndex.value = index
  // 标记当前是查询时间选择
  currentSelectingType.value = 'query'
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

// 日期选择器确认函数，处理所有类型的日期选择
function onDateConfirm(value: { selectedValues: string[] }) {
  const idx = currentDatePickerIndex.value
  if (idx >= 0 && value && value.selectedValues && Array.isArray(value.selectedValues) && value.selectedValues.length >= 3) {
    // 将数组转换为日期字符串 YYYY-MM-DD
    const selectedValues = value.selectedValues
    const year = selectedValues[0] || ''
    const month = selectedValues[1] ? selectedValues[1].toString().padStart(2, '0') : '01'
    const day = selectedValues[2] ? selectedValues[2].toString().padStart(2, '0') : '01'
    const dateStr = `${year}-${month}-${day}`

    // 打印日期选择信息以便调试
    console.log('日期选择确认:', {
      type: currentSelectingType.value,
      idx,
      dateStr,
    })

    // 根据当前选择的类型设置时间
    if (currentSelectingType.value === 'query' && idx >= 0 && idx < creditForm.queries.length) {
      creditForm.queries[idx].time = dateStr
    }
    else if (currentSelectingType.value === 'loan' && idx >= 0 && idx < creditForm.loans.length) {
      creditForm.loans[idx].time = dateStr
    }
  }
  showDatePicker.value = false
}

// 为了兼容性，保留原来的函数名
function _onQueryTimeConfirm(value: { selectedValues: string[] }) {
  return onDateConfirm(value)
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

// 创建用户store实例
const userStore = useUserStore()

// 处理逾期信息并填充到表单
function fillOverdueInformation(data: any, reportType: string) {
  // 如果数据为null，则设置为没有新增逾期
  if (!data) {
    creditForm.hasOverdue = '否'
    return
  }

  // 设置是否有新增逾期
  creditForm.hasOverdue = '是'

  // 清空原有的逾期数据
  creditForm.loanOverdues = []
  creditForm.cardOverdues = []
  creditForm.loanOverdueDetails = {}
  creditForm.cardOverdueDetails = {}

  if (reportType === 'simple') {
    // 处理简版征信报告数据
    handleSimpleReportData(data)
  }
  else {
    // 处理详版征信报告数据
    handleDetailedReportData(data)
  }
}

// 处理简版征信报告数据
function handleSimpleReportData(data: any) {
  // 处理贷款逾期信息
  if (data.loanDetails && Array.isArray(data.loanDetails)) {
    // 过滤出有效的贷款，并且不包含“合计”项
    const validLoans = data.loanDetails.filter(loan =>
      loan.bank_name !== '合计'
      && (loan.current_status === '正常'
        || loan.current_status === '当前无逾期'
        || loan.current_status === '当前逾期'),
    )

    // 添加到逾期贷款列表
    validLoans.forEach((loan, index) => {
      const id = `loan${index + 1}`

      // 格式化日期
      const grantDate = loan.show_grant_date_format || loan.show_grant_date || loan.grant_date_format?.substring(0, 10) || loan.grant_date || ''
      const formattedDate = grantDate.replace(/\./g, '-').replace(/\u5E74/g, '-').replace(/\u6708/g, '-').replace(/\u65E5/g, '')

      // 生成标题格式：“日期-机构-总额-类型”
      const title = `${formattedDate}-${loan.bank_name}-总额${loan.grant_amount || 0}元-${loan.loan_type_complete || loan.loan_type || '个人贷款'}`

      // 添加到贷款类逾期列表
      creditForm.loanOverdues.push({
        id,
        institution: title, // 使用格式化后的标题
        type: loan.loan_type_complete || loan.loan_type || '个人贷款',
      })

      // 根据状态设置逾期详情
      let level = '0' // 简版征信默认0级
      let amount = '0' // 默认金额
      let repaid = '是' // 默认已还

      // 简版征信中，只有0和4级，如果有m4_overdue则为4级，否则为0级
      if (loan.m4_overdue) {
        level = '4'
        amount = loan.grant_amount ? Math.round(loan.grant_amount * 0.1).toString() : '1000'
        repaid = loan.current_status === '已结清' ? '是' : '否'
      }
      else if (loan.current_status === '当前逾期') {
        // 如果是当前逾期，即使没有m4_overdue，也设置为4级
        level = '4'
        amount = loan.grant_amount ? Math.round(loan.grant_amount * 0.05).toString() : '500'
        repaid = '否'
      }

      // 添加逾期详情
      creditForm.loanOverdueDetails[id] = {
        level,
        amount,
        repaid,
      }
    })
  }

  // 处理信用卡逾期信息
  if (data.creditCardDetails && Array.isArray(data.creditCardDetails)) {
    // 过滤出有效的信用卡，并且不包含“合计”项
    const validCards = data.creditCardDetails.filter(card =>
      card.bank_name !== '合计'
      && (card.current_status === '正常'
        || card.current_status === '当前无逾期'
        || card.current_status === '当前逾期'),
    )

    // 添加到逾期信用卡列表
    validCards.forEach((card, index) => {
      const id = `card${index + 1}`

      // 格式化日期
      const grantDate = card.grant_date_format?.substring(0, 10) || card.grant_date || ''
      const formattedDate = grantDate.replace(/\u5E74/g, '-').replace(/\u6708/g, '-').replace(/\u65E5/g, '')

      // 生成标题格式：“日期-机构-总额-信用卡”
      const title = `${formattedDate}-${card.bank_name}-总额${card.grant_amount || 0}元-信用卡`
      const maskedCardNo = `${card.bank_name}信用卡`

      // 添加到贷记卡类逾期列表
      creditForm.cardOverdues.push({
        id,
        institution: title, // 使用格式化后的标题
        cardNo: maskedCardNo,
      })

      // 根据状态设置逾期详情
      let level = '0' // 简版征信默认0级
      let amount = '0' // 默认金额
      let repaid = '是' // 默认已还

      // 简版征信中，只有0和4级，如果有m4_overdue则为4级，否则为0级
      if (card.m4_overdue) {
        level = '4'
        amount = card.grant_amount ? Math.round(card.grant_amount * 0.2).toString() : '500'
        repaid = card.current_status === '当前无逾期' || card.current_status === '正常' ? '是' : '否'
      }
      else if (card.current_status === '当前逾期') {
        // 如果是当前逾期，即使没有m4_overdue，也设置为4级
        level = '4'
        amount = card.grant_amount ? Math.round(card.grant_amount * 0.1).toString() : '200'
        repaid = '否'
      }

      // 添加逾期详情
      creditForm.cardOverdueDetails[id] = {
        level,
        amount,
        repaid,
      }
    })
  }
}

// 处理详版征信报告数据
function handleDetailedReportData(data: any) {
  // 详版征信报告的数据结构可能不同，这里做兼容处理
  // 如果数据结构与简版相同，直接调用简版处理函数
  if (data.loanDetails || data.creditCardDetails) {
    handleSimpleReportData(data)
    return
  }

  // 处理循环贷款信息（revolvingLoan）
  if (data.revolvingLoan && Array.isArray(data.revolvingLoan)) {
    // 只处理状态为正常的贷款，已结清的不处理
    const activeLoans = data.revolvingLoan
    activeLoans.forEach((loan, index) => {
      const id = `loan${index + 1}`

      // 获取数据
      const bankName = loan.managingInstitution || loan.cardIssuingInstitution || ''
      const loanType = loan.businessType || '个人贷款'
      const loanAmount = loan.loanAmount || loan.accountCreditLimit || 0
      // 不再使用status变量
      const date = loan.openingDate || ''

      // 生成标题
      const title = `${date}-${bankName}-总额${loanAmount}元-${loanType}`

      // 添加到贷款类逾期列表
      creditForm.loanOverdues.push({
        id,
        institution: title,
        type: loanType,
      })

      // 判断是否有逾期
      const hasOverdue = loan.currentOverduePeriods > 0 || loan.currentOverdueAmount > 0

      // 添加逾期详情
      if (hasOverdue) {
        creditForm.loanOverdueDetails[id] = {
          amount: loan.currentOverdueAmount ? loan.currentOverdueAmount.toString() : '0',
          repaid: '否',
        }
      }
    })
  }

  // 处理信用卡信息（creditCardAccount）
  if (data.creditCardAccount && Array.isArray(data.creditCardAccount)) {
    // 只处理状态为正常的信用卡，销户的不处理
    const activeCards = data.creditCardAccount.filter(card =>
      card.accountStatus === '正常'
      || card.accountStatus === '当前无逾期'
      || card.accountStatus === '当前逾期',
    )

    activeCards.forEach((card, index) => {
      const id = `card${index + 1}`

      // 获取数据
      const bankName = card.cardIssuingInstitution || card.managingInstitution || ''
      const cardAmount = card.creditLimit || card.accountCreditLimit || 0
      // 不再使用status变量
      const date = card.openingDate || ''

      // 生成标题
      const title = `${date}-${bankName}-总额${cardAmount}元-信用卡`
      const maskedCardNo = `${bankName}信用卡`

      // 添加到贷记卡类逾期列表
      creditForm.cardOverdues.push({
        id,
        institution: title,
        cardNo: maskedCardNo,
      })

      // 判断是否有逾期
      const hasOverdue = card.currentOverduePeriods > 0 || card.currentOverdueAmount > 0

      // 添加逾期详情
      if (hasOverdue) {
        creditForm.cardOverdueDetails[id] = {
          amount: card.currentOverdueAmount ? card.currentOverdueAmount.toString() : '0',
          repaid: '否',
        }
      }
    })
  }

  // 如果没有逾期记录，则设置为没有新增逾期
  if (Object.keys(creditForm.loanOverdueDetails).length === 0
    && Object.keys(creditForm.cardOverdueDetails).length === 0) {
    creditForm.hasOverdue = '否'
  }
}

// 上传文件
async function onUpload(file) {
  uploading.value = true

  // 一开始就显示正在解析的提示
  showLoadingToast({
    message: '征信报告正在解析中...',
    forbidClick: true,
    duration: 0,
  })

  try {
    // 先上传PDF文件
    const { data: uploadResult } = await fileUpload({ file: file.file })

    if (!uploadResult || !uploadResult.url) {
      throw new Error('文件上传失败')
    }

    // 调用征信解析接口
    const analysisType = reportType.value === 'simple' ? '简版征信' : '详版征信'
    const { code, msg } = await creditAnalysis({
      url: uploadResult.url,
      analysisType,
    })

    // 关闭正在解析的提示
    closeToast()

    // 只在解析失败时显示弹窗
    if (code !== 0) {
      // 解析失败后将PDF文件置为空
      fileList.value = []
      // 设置解析失败状态
      analysisComplete.value = false
      uploadFailed.value = true

      // 使用showDialog并等待用户确认
      showDialog({
        title: '解析失败',
        message: msg || '请稍后重试',
        confirmButtonText: '确定',
      }).then(() => {
        // 点击确定后重置表单
        resetForm()
        // 关闭加载提示，确保它被关闭
        closeToast()
      })
    }
    else { // 解析成功时显示轻提示
      // 根据报告类型调用不同的接口
      try {
        // 获取用户的agent_id
        const agentId = userStore.getAgentId()

        // 根据报告类型调用不同的接口
        let loanResult
        if (reportType.value === 'simple') {
          // 简版征信报告
          loanResult = await selectSimpleLoanOverdue(agentId)
        }
        else {
          // 详版征信报告
          loanResult = await selectDetailedLoanOverdue(agentId)
        }

        // 检查接口返回结果
        if (loanResult.code === 0) {
          // 贷款逾期信息查询成功

          // 填充逾期信息到表单，即使data为null也传入
          fillOverdueInformation(loanResult.data, reportType.value)
        }
        else {
          // 贷款逾期信息查询失败
          // 默认设置为没有新增逾期
          creditForm.hasOverdue = '否'
        }
      }
      catch (error) {
        // 贷款逾期信息查询异常
      }

      showSuccessToast({
        message: '解析成功',
        duration: 1500,
      })
      // 解析成功后显示新增信息表单
      showAdditionalForm.value = true
      // 设置解析成功状态
      analysisComplete.value = true
      uploadFailed.value = false
    }

    // 状态已在各自分支中设置，这里不需要重复设置
  }
  catch (error) {
    console.error('上传文件错误:', error)
    // 标记上传失败状态
    analysisComplete.value = false
    uploadFailed.value = true
    // 清空文件列表
    fileList.value = []

    // 关闭加载提示
    closeToast()

    // 显示上传失败弹窗
    showDialog({
      title: '上传失败',
      message: error.message || '请稍后重试',
      confirmButtonText: '确定',
      confirmButtonColor: '#f44336',
    }).then(() => {
      // 点击确定后重置表单
      resetForm()
    })
  }
  finally {
    uploading.value = false
  }
}

// 提交表单
function submitForm() {
  // 如果征信解析未完成，不允许提交
  if (!analysisComplete.value) {
    if (uploadFailed.value) {
      showDialog({
        title: '提示',
        message: '上传失败，请重新上传',
        confirmButtonText: '确定',
      })
      resetForm()
    }
    else {
      showDialog({
        title: '提示',
        message: '征信报告解析尚未完成，请稍候再试',
        confirmButtonText: '确定',
      })
    }
    return
  }
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

  // 表单数据已准备好可以提交

  // 提交成功提示
  showSuccessToast('提交成功')

  // 重置表单
  resetForm()
}

// 重置表单
function resetForm() {
  console.log('提交的表单数据:', JSON.stringify(creditForm, null, 2))
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
  analysisComplete.value = false
  uploadFailed.value = false
  fileList.value = []
}
</script>

<template>
  <div class="upload-zhengxin">
    <!-- 当未上传时显示报告类型选择和上传区域 -->
    <div v-if="!showAdditionalForm">
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
      <div class="glass-card upload-area">
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
    </div>

    <!-- 上传后的额外表单 -->
    <div v-if="showAdditionalForm" class="glass-card additional-form">
      <!-- 返回按钮 -->
      <div class="back-button-container">
        <van-button
          type="text"
          size="small"
          icon="arrow-left"
          class="harmony-back-button"
          @click="resetForm"
        >
          返回重新上传
        </van-button>
      </div>
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
                v-model="query.type"
                readonly
                clickable
                label="查询类型"
                placeholder="请选择查询类型"
                @click="handleQueryTypeClick(index)"
              />

              <!-- 查询时间 -->
              <van-field
                v-model="query.time"
                readonly
                clickable
                label="查询时间"
                placeholder="请选择查询时间"
                @click="handleQueryTimeClick(index)"
              />

              <!-- 机构查询特有字段 -->
              <template v-if="query.type === '机构查询'">
                <van-field
                  v-model="query.institution"
                  readonly
                  clickable
                  label="查询机构"
                  placeholder="请选择查询机构"
                  @click="handleQueryInstitutionClick(index)"
                />
              </template>

              <!-- 查询原因 -->
              <van-field
                v-model="query.reason"
                readonly
                clickable
                label="查询原因"
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
                v-model="loan.type"
                readonly
                clickable
                label="放款类型"
                placeholder="请选择放款类型"
                @click="handleLoanTypeClick(index)"
              />

              <!-- 放款时间/发卡时间 -->
              <van-field
                v-model="loan.time"
                readonly
                clickable
                :label="loan.type === '贷款' ? '放款时间' : '发卡时间'"
                :placeholder="loan.type === '贷款' ? '请选择放款时间' : '请选择发卡时间'"
                @click="handleLoanTimeClick(index)"
              />

              <!-- 放款机构/发卡机构 -->
              <van-field
                v-model="loan.institution"
                readonly
                clickable
                :label="loan.type === '贷款' ? '放款机构' : '发卡机构'"
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
                  <div class="empty-notice">
                    暂无贷款类逾期记录
                  </div>
                </template>
              </div>

              <!-- 贷款类逾期详情 -->
              <template v-for="(detail, id) in creditForm.loanOverdueDetails" :key="id">
                <div class="overdue-detail">
                  <div class="overdue-detail-title">
                    {{ creditForm.loanOverdues.find(item => item.id === id)?.institution }} -
                    {{ creditForm.loanOverdues.find(item => item.id === id)?.type }}
                  </div>

                  <!-- 逾期级别字段已移除 -->

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
                        <van-radio name="是">
                          是
                        </van-radio>
                        <van-radio name="否">
                          否
                        </van-radio>
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
                  <div class="empty-notice">
                    暂无贷记卡类逾期记录
                  </div>
                </template>
              </div>

              <!-- 贷记卡类逾期详情 -->
              <template v-for="(detail, id) in creditForm.cardOverdueDetails" :key="id">
                <div class="overdue-detail">
                  <div class="overdue-detail-title">
                    {{ creditForm.cardOverdues.find(item => item.id === id)?.institution }} -
                    {{ creditForm.cardOverdues.find(item => item.id === id)?.cardNo }}
                  </div>

                  <!-- 逾期级别字段已移除 -->

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
                        <van-radio name="是">
                          是
                        </van-radio>
                        <van-radio name="否">
                          否
                        </van-radio>
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
        <van-button
          block
          :loading="uploading"
          :disabled="uploadFailed ? false : !analysisComplete"
          class="submit-button"
          :type="uploadFailed ? 'danger' : 'primary'"
          @click="uploadFailed ? resetForm() : submitForm()"
        >
          <template v-if="uploadFailed">
            上传失败请重新上传
          </template>
          <template v-else>
            {{ analysisComplete ? '提交' : '等待征信解析完成...' }}
          </template>
        </van-button>
        <div v-if="!analysisComplete && !uploadFailed" class="submit-tip">
          征信报告正在解析中，请稍候...
        </div>
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
        @confirm="onDateConfirm"
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

    <!-- 逾期级别选择器已移除 -->
  </div>
</template>

<style scoped>
.submit-tip {
  margin-top: 8px;
  text-align: center;
  color: #ff9800;
  font-size: 14px;
}

.back-button-container {
  position: relative;
  margin-bottom: 15px;
}

.harmony-back-button {
  font-size: 12px;
  color: #1989fa;
  border: none;
  background-color: transparent;
  transition: all 0.3s ease;
  padding: 0;
}

.harmony-back-button:hover {
  color: #157af0;
}

.submit-button {
  width: 100%;
}

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
