<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { showToast } from 'vant'

// 暂存数据到localStorage
function saveToLocalStorage(key: string, data: any) {
  localStorage.setItem(`last-examine-${key}`, JSON.stringify(data))
  showToast('暂存成功')
}

// 从localStorage加载数据
function loadFromLocalStorage(key: string) {
  const data = localStorage.getItem(`last-examine-${key}`)
  return data ? JSON.parse(data) : null
}

// 暂存各模块数据
function saveCreditData() {
  saveToLocalStorage('credit', formData.value)
}

function saveWorkData() {
  saveToLocalStorage('work', workData.value)
}

function saveBonusData() {
  saveToLocalStorage('bonus', bonusData.value)
}

function saveSpecialData() {
  saveToLocalStorage('special', specialData.value)
}

// 从localStorage加载初始数据
const savedCreditData = loadFromLocalStorage('credit')
const savedWorkData = loadFromLocalStorage('work')
const savedBonusData = loadFromLocalStorage('bonus')
const savedSpecialData = loadFromLocalStorage('special')

// 特殊情况数据
const specialData = ref(savedSpecialData || {
  language: '', // 语言能力
  writing: '', // 写字能力
  physical: '', // 身体状况
})

// Mock数据
const mockQueryRecords = [
  { time: '2025-04-01', institution: '机构A', reason: '信用卡审批' },
  { time: '2025-04-28', institution: '机构B', reason: '信用卡审批' },
]

// 贷款类型选项
const loanTypes = ['装修贷', '车贷', '信贷', '其它']

// 审批状态选项
const approvalStatuses = [
  { value: 'approved_unpaid', label: '已批-未放款' },
  { value: 'approved_paid', label: '已批-已放款' },
  { value: 'rejected', label: '已拒' },
]

// 工作属性数据
const workData = ref(savedWorkData || {
  workType: '', // 工作性质
  canInspect: false, // 是否可考察
  inspectLocations: [], // 可考察地点
  // 社保信息
  hasSocialSecurity: false, // 是否有社保
  socialSecurity: {
    totalMonths: '', // 连续缴社保合计月数
    currentUnitMonths: '', // 当前单位月数
    medicalBase: '', // 近半年平均医疗基数
    pensionBase: '', // 近半年平均养老基数
    unitName: '', // 社保单位全称
    unitRemark: '', // 社保单位补充
  },
  // 公积金信息
  hasProvidentFund: false, // 是否有公积金
  providentFund: {
    totalMonths: '', // 连续缴公积金合计月数
    currentUnitMonths: '', // 当前单位月数
    averageBase: '', // 近半年平均公积金基数
    sameAsSocialSecurity: true, // 是否同社保单位
    unitRemark: '', // 公积金单位补充
  },
  // 个税信息
  hasIncomeTax: false, // 是否有个税
  incomeTax: {
    totalMonths: '', // 连续缴个税合计月数
    currentUnitMonths: '', // 当前单位月数
    averageSalary: '', // 近半年平均个税税前工资
    sameAsSocialSecurity: true, // 是否同社保单位
    unitRemark: '', // 个税单位补充
  },
  // 企业信息
  hasEnterprise: false, // 是否有企业
  enterprise: {
    name: '', // 企业全称
    businessInfo: [], // 工商信息：法人、股东、监事
    legalPersonMonths: '', // 法人名下月数
    shareholderMonths: '', // 股东名下月数
    shareholderPercentage: '', // 股东占股比例
    registeredCapital: '', // 注册资金
    registeredMonths: '', // 注册月数
    hasAbnormalOperation: false, // 是否经营异常
    hasEntity: false, // 是否实体
    industry: '', // 经营行业
    scale: {
      employees: '', // 企业规模-人数
      area: '', // 企业规模-面积
    },
  },
})

// 根据工作性质获取可选的考察地点
const availableInspectLocations = computed(() => {
  if (!workData.value.canInspect)
    return []
  if (workData.value.workType === 'business') {
    return [
      { value: 'home', label: '家里' },
      { value: 'business', label: '企业' },
    ]
  }
  else if (workData.value.workType === 'normal' || workData.value.workType === 'premium') {
    return [
      { value: 'home', label: '家里' },
      { value: 'company', label: '单位' },
    ]
  }
  return []
})

// 监听工作性质变化，重置考察地点
watch(() => workData.value.workType, () => {
  workData.value.inspectLocations = []
})

// 监听是否可考察变化
watch(() => workData.value.canInspect, (newValue) => {
  if (!newValue) {
    workData.value.inspectLocations = []
  }
})

// 加分选项数据
const bonusData = ref(savedBonusData || {
  // 学历情况
  education: {
    level: '', // 学历等级
    verifiable: false, // 是否学信网可查
    fullTime: false, // 是否全日制
  },
  // 房产情况
  house: {
    hasHouse: false, // 是否有房产
    houseFiles: [], // 房产明细文件
  },
  // 车产情况
  car: {
    hasCar: false, // 是否有车产
    carFiles: [], // 车产明细文件
  },
  // 金融资产情况
  financial: {
    hasFinancial: false, // 是否有金融资产
    financialFiles: [], // 金融资产明细文件
  },
  // 流水情况
  bankFlow: {
    hasFlow: false, // 是否有有效流水
    flowFiles: [], // 流水明细文件，最多2份
  },
})

// 学历等级选项
const educationLevels = [
  '从未上过学',
  '小学',
  '初中',
  '高中',
  '大专',
  '本科',
  '硕士',
  '博士',
]

const mockUnsettledRecords = [
  { time: '2023-01-01', institution: '机构A', amount: '30万', repaidAmount: '6万' },
]

const bankList = [
  { id: 'boc', name: '中行' },
  { id: 'abc', name: '农行' },
  { id: 'icbc', name: '工行' },
  { id: 'ccb', name: '建行' },
  { id: 'psbc', name: '邮储' },
  { id: 'gdb', name: '广发' },
  { id: 'cmb', name: '招行' },
  { id: 'ceb', name: '光大' },
  { id: 'citic', name: '中信' },
]

// 表单数据
const formData = ref(savedCreditData || {
  queryDetails: mockQueryRecords.map(record => ({
    ...record,
    loanType: '', // 目标贷款类型
    approvalStatus: '', // 审批状态
    rejectReason: '', // 拒绝原因（当状态为已拒时）
  })),
  unsettledDetails: mockUnsettledRecords.map(record => ({
    ...record,
    loanType: '', // 贷款类别
  })),
  greylistBanks: bankList.map(bank => ({
    id: bank.id,
    name: bank.name,
    checked: false,
    reason: '', // 黑灰名单原因
  })),
  rejectedBanks: bankList.map(bank => ({
    id: bank.id,
    name: bank.name,
    checked: false,
    rejectInfo: '', // 被拒时间及原因
  })),
})

// 展开面板的控制
const activeNames = ref(['1'])

// 表单提交
function onSubmit() {
  // 验证必填项
  const hasEmptyRequired = formData.value.queryDetails.some(item => !item.supplement)
    || formData.value.unsettledDetails.some(item => !item.supplement)

  // 验证工作属性必填项
  if (!workData.value.workType) {
    showToast('请选择工作性质')
    return
  }

  if (workData.value.canInspect && workData.value.inspectLocations.length === 0) {
    showToast('请选择可考察地点')
    return
  }

  // 验证社保相关必填项
  if (workData.value.hasSocialSecurity) {
    const { socialSecurity } = workData.value
    if (!socialSecurity.totalMonths || !socialSecurity.currentUnitMonths
      || !socialSecurity.medicalBase || !socialSecurity.pensionBase
      || !socialSecurity.unitName) {
      showToast('请完善社保信息')
      return
    }
    // 验证数字输入
    if (!/^\d+$/.test(socialSecurity.totalMonths) || !/^\d+$/.test(socialSecurity.currentUnitMonths)
      || !/^\d+$/.test(socialSecurity.medicalBase) || !/^\d+$/.test(socialSecurity.pensionBase)) {
      showToast('社保相关数值必须为整数')
      return
    }
  }

  // 验证公积金相关必填项
  if (workData.value.hasProvidentFund) {
    const { providentFund } = workData.value
    if (!providentFund.totalMonths || !providentFund.currentUnitMonths
      || !providentFund.averageBase) {
      showToast('请完善公积金信息')
      return
    }
    // 验证数字输入
    if (!/^\d+$/.test(providentFund.totalMonths) || !/^\d+$/.test(providentFund.currentUnitMonths)
      || !/^\d+$/.test(providentFund.averageBase)) {
      showToast('公积金相关数值必须为整数')
      return
    }
  }

  // 验证个税相关必填项
  if (workData.value.hasIncomeTax) {
    const { incomeTax } = workData.value
    if (!incomeTax.totalMonths || !incomeTax.currentUnitMonths
      || !incomeTax.averageSalary) {
      showToast('请完善个税信息')
      return
    }
    // 验证数字输入
    if (!/^\d+$/.test(incomeTax.totalMonths) || !/^\d+$/.test(incomeTax.currentUnitMonths)
      || !/^\d+$/.test(incomeTax.averageSalary)) {
      showToast('个税相关数值必须为整数')
      return
    }
  }

  // 验证企业相关必填项
  if (workData.value.hasEnterprise) {
    const { enterprise } = workData.value
    if (!enterprise.name || enterprise.businessInfo.length === 0) {
      showToast('请完善企业基本信息')
      return
    }

    // 验证法人相关信息
    if (enterprise.businessInfo.includes('法人') && !enterprise.legalPersonMonths) {
      showToast('请填写法人名下月数')
      return
    }

    // 验证股东相关信息
    if (enterprise.businessInfo.includes('股东')) {
      if (!enterprise.shareholderMonths || !enterprise.shareholderPercentage) {
        showToast('请完善股东信息')
        return
      }
      // 验证股东占比
      const percentage = Number(enterprise.shareholderPercentage)
      if (isNaN(percentage) || percentage <= 0 || percentage > 100) {
        showToast('股东占比必须为1-100之间的数字')
        return
      }
    }

    // 验证注册信息
    if (!enterprise.registeredCapital || !enterprise.registeredMonths) {
      showToast('请完善企业注册信息')
      return
    }

    // 验证实体信息
    if (enterprise.hasEntity) {
      if (!enterprise.industry || !enterprise.scale.employees || !enterprise.scale.area) {
        showToast('请完善企业实体信息')
        return
      }
      // 验证数字输入
      if (!/^\d+$/.test(enterprise.scale.employees) || !/^\d+$/.test(enterprise.scale.area)) {
        showToast('企业规模相关数值必须为整数')
        return
      }
    }
  }

  // 验证加分选项必填项
  if (!bonusData.value.education.level) {
    showToast('请选择学历等级')
    return
  }

  // 验证房产相关必填项
  if (bonusData.value.house.hasHouse && bonusData.value.house.houseFiles.length === 0) {
    showToast('请上传房产明细')
    return
  }

  // 验证车产相关必填项
  if (bonusData.value.car.hasCar && bonusData.value.car.carFiles.length === 0) {
    showToast('请上传车产明细')
    return
  }

  // 验证金融资产相关必填项
  if (bonusData.value.financial.hasFinancial && bonusData.value.financial.financialFiles.length === 0) {
    showToast('请上传金融资产明细')
    return
  }

  // 验证流水相关必填项
  if (bonusData.value.bankFlow.hasFlow && bonusData.value.bankFlow.flowFiles.length === 0) {
    showToast('请上传流水明细')
    return
  }

  // 验证特殊情况必填项
  if (!specialData.value.language || !specialData.value.writing || !specialData.value.physical) {
    showToast('请完善特殊情况信息')
    return
  }

  if (hasEmptyRequired) {
    showToast('请填写所有必填项')
    return
  }

  console.log('结构化表单数据：', JSON.parse(JSON.stringify({
    formData: formData.value,
    workData: workData.value,
    bonusData: bonusData.value,
    specialData: specialData.value,
  })), null, 2)
  showToast('提交成功')
}
</script>

<template>
  <div class="last-examine">
    <van-collapse v-model="activeNames">
      <!-- 征信细节补充 -->
      <van-collapse-item title="本人征信细节补充" name="1">
        <template #value>
          <van-button size="small" type="primary" @click.stop="saveCreditData">
            暂存
          </van-button>
        </template>
        <div class="section-content">
          <!-- 近半年查询原因 -->
          <div class="sub-section">
            <h3>01）近半年以下查询原因及细节</h3>
            <div v-for="(item, index) in formData.queryDetails" :key="index" class="record-item">
              <div class="record-info">
                {{ item.time }} - {{ item.institution }} - {{ item.reason }}
              </div>
              <div class="form-item">
                <div class="form-label">
                  <span style="color:red">*</span>申请贷款类型
                </div>
                <van-radio-group v-model="item.loanType" direction="horizontal">
                  <van-radio v-for="type in loanTypes" :key="type" :name="type">
                    {{ type }}
                  </van-radio>
                </van-radio-group>
              </div>
              <div class="form-item">
                <div class="form-label">
                  <span style="color:red">*</span>后续状态
                </div>
                <van-radio-group v-model="item.approvalStatus" direction="horizontal">
                  <van-radio v-for="status in approvalStatuses" :key="status.value" :name="status.value">
                    {{ status.label }}
                  </van-radio>
                </van-radio-group>
                <van-field
                  v-if="item.approvalStatus === 'rejected'"
                  v-model="item.rejectReason"
                  label="拒绝原因"
                  placeholder="请输入拒绝原因"
                />
              </div>
            </div>
          </div>

          <!-- 近五年未结清 -->
          <div class="sub-section">
            <h3>02）近五年未结清的以下机构的补充</h3>
            <div v-for="(item, index) in formData.unsettledDetails" :key="index" class="record-item">
              <div class="record-info">
                {{ item.time }} - {{ item.institution }} - 总金额：{{ item.amount }} - 已还：{{ item.repaidAmount }}
              </div>
              <div class="form-item">
                <div class="form-label">
                  <span style="color:red">*</span>贷款类别
                </div>
                <van-radio-group v-model="item.loanType" direction="horizontal">
                  <van-radio v-for="type in loanTypes" :key="type" :name="type">
                    {{ type }}
                  </van-radio>
                </van-radio-group>
              </div>
            </div>
          </div>

          <!-- 灰名单情况 -->
          <div class="sub-section">
            <h3>03）历史(含五年外)以下机构灰名单情况</h3>
            <div class="bank-list">
              <div class="bank-checkboxes">
                <van-checkbox
                  v-for="(bank, index) in formData.greylistBanks"
                  :key="index"
                  v-model="bank.checked"
                  class="bank-checkbox"
                >
                  {{ bank.name }}
                </van-checkbox>
              </div>
              <div v-for="bank in formData.greylistBanks.filter(b => b.checked)" :key="bank.id" class="bank-reason">
                <div class="form-label">
                  {{ bank.name }}黑灰名单原因：
                </div>
                <van-field v-model="bank.reason" placeholder="示例：2026年06月，储蓄卡洗钱记录" />
              </div>
            </div>
          </div>

          <!-- 被拒情况 -->
          <div class="sub-section">
            <h3>04）历史(含五年外)以下机构被拒情况</h3>
            <div class="bank-list">
              <div class="bank-checkboxes">
                <van-checkbox
                  v-for="(bank, index) in formData.rejectedBanks"
                  :key="index"
                  v-model="bank.checked"
                  class="bank-checkbox"
                >
                  {{ bank.name }}
                </van-checkbox>
              </div>
              <div v-for="bank in formData.rejectedBanks.filter(b => b.checked)" :key="bank.id" class="bank-reason">
                <div class="form-label">
                  {{ bank.name }}被拒时间及原因：
                </div>
                <van-field v-model="bank.rejectInfo" placeholder="示例：2026年06月，虚假资料" />
              </div>
            </div>
          </div>
        </div>
      </van-collapse-item>

      <!-- 工作属性 -->
      <van-collapse-item title="本人工作属性" name="2">
        <template #value>
          <van-button size="small" type="primary" @click.stop="saveWorkData">
            暂存
          </van-button>
        </template>
        <div class="section-content">
          <!-- 考察情况 -->
          <div class="sub-section">
            <h3>01）考察情况</h3>
            <div class="form-item">
              <div class="form-label">
                <span style="color:red">*</span>工作性质
              </div>
              <van-radio-group v-model="workData.workType" direction="horizontal">
                <van-radio name="normal">
                  普通单位上班族
                </van-radio>
                <van-radio name="premium">
                  优质单位上班族
                </van-radio>
                <van-radio name="business">
                  企业主
                </van-radio>
              </van-radio-group>
            </div>
            <div class="form-item">
              <div class="form-label">
                <span style="color:red">*</span>是否可考察
              </div>
              <van-radio-group v-model="workData.canInspect" direction="horizontal">
                <van-radio :name="false">
                  否
                </van-radio>
                <van-radio :name="true">
                  是
                </van-radio>
              </van-radio-group>
            </div>
            <div v-if="workData.canInspect" class="form-item">
              <div class="form-label">
                <span style="color:red">*</span>可考察地点
              </div>
              <van-checkbox-group v-model="workData.inspectLocations" direction="horizontal">
                <van-checkbox
                  v-for="location in availableInspectLocations"
                  :key="location.value"
                  :name="location.value"
                >
                  {{ location.label }}
                </van-checkbox>
              </van-checkbox-group>
            </div>
          </div>

          <!-- 社保情况 -->
          <div class="sub-section">
            <h3>02）社保/公积金/个税情况</h3>
            <div class="form-item">
              <div class="form-label">
                <span style="color:red">*</span>是否有社保
              </div>
              <van-radio-group v-model="workData.hasSocialSecurity" direction="horizontal">
                <van-radio :name="false">
                  否
                </van-radio>
                <van-radio :name="true">
                  是
                </van-radio>
              </van-radio-group>
            </div>
            <div v-if="workData.hasSocialSecurity" class="form-item">
              <van-field
                v-model="workData.socialSecurity.totalMonths"
                label="连续缴社保合计"
                type="digit"
                placeholder="请输入月数"
                :rules="[{ pattern: /^\d+$/, message: '请输入整数' }]"
              >
                <template #button>
                  <span>个月</span>
                </template>
              </van-field>
              <van-field
                v-model="workData.socialSecurity.currentUnitMonths"
                label="当前单位"
                type="digit"
                placeholder="请输入月数"
                :rules="[{ pattern: /^\d+$/, message: '请输入整数' }]"
              >
                <template #button>
                  <span>个月</span>
                </template>
              </van-field>
              <van-field
                v-model="workData.socialSecurity.medicalBase"
                label="近半年平均医疗基数"
                type="digit"
                placeholder="请输入金额"
                :rules="[{ pattern: /^\d+$/, message: '请输入整数' }]"
              >
                <template #button>
                  <span>元</span>
                </template>
              </van-field>
              <van-field
                v-model="workData.socialSecurity.pensionBase"
                label="近半年平均养老基数"
                type="digit"
                placeholder="请输入金额"
                :rules="[{ pattern: /^\d+$/, message: '请输入整数' }]"
              >
                <template #button>
                  <span>元</span>
                </template>
              </van-field>
              <van-field
                v-model="workData.socialSecurity.unitName"
                label="社保单位全称"
                placeholder="请输入单位名称"
              />
              <van-field
                v-model="workData.socialSecurity.unitRemark"
                label="社保单位补充"
                placeholder="是否敏感行业(律师|公检法|租车等)或断缴等情况"
              />
            </div>
          </div>

          <!-- 公积金情况 -->
          <div class="sub-section">
            <div class="form-item">
              <div class="form-label">
                <span style="color:red">*</span>是否有公积金
              </div>
              <van-radio-group v-model="workData.hasProvidentFund" direction="horizontal">
                <van-radio :name="false">
                  否
                </van-radio>
                <van-radio :name="true">
                  是
                </van-radio>
              </van-radio-group>
            </div>
            <div v-if="workData.hasProvidentFund" class="form-item">
              <van-field
                v-model="workData.providentFund.totalMonths"
                label="连续缴公积金合计"
                type="digit"
                placeholder="请输入月数"
                :rules="[{ pattern: /^\d+$/, message: '请输入整数' }]"
              >
                <template #button>
                  <span>个月</span>
                </template>
              </van-field>
              <van-field
                v-model="workData.providentFund.currentUnitMonths"
                label="当前单位"
                type="digit"
                placeholder="请输入月数"
                :rules="[{ pattern: /^\d+$/, message: '请输入整数' }]"
              >
                <template #button>
                  <span>个月</span>
                </template>
              </van-field>
              <van-field
                v-model="workData.providentFund.averageBase"
                label="近半年平均公积金基数"
                type="digit"
                placeholder="请输入金额"
                :rules="[{ pattern: /^\d+$/, message: '请输入整数' }]"
              >
                <template #button>
                  <span>元</span>
                </template>
              </van-field>
              <div class="form-item">
                <div class="form-label">
                  公积金单位名称
                </div>
                <van-radio-group v-model="workData.providentFund.sameAsSocialSecurity" direction="horizontal">
                  <van-radio :name="true">
                    同社保单位
                  </van-radio>
                  <van-radio :name="false">
                    不同于社保单位
                  </van-radio>
                </van-radio-group>
              </div>
              <van-field
                v-model="workData.providentFund.unitRemark"
                label="公积金单位补充"
                placeholder="是否断缴等情况"
              />
            </div>
          </div>

          <!-- 个税情况 -->
          <div class="sub-section">
            <div class="form-item">
              <div class="form-label">
                <span style="color:red">*</span>是否有个税
              </div>
              <van-radio-group v-model="workData.hasIncomeTax" direction="horizontal">
                <van-radio :name="false">
                  否
                </van-radio>
                <van-radio :name="true">
                  是
                </van-radio>
              </van-radio-group>
            </div>
            <div v-if="workData.hasIncomeTax" class="form-item">
              <van-field
                v-model="workData.incomeTax.totalMonths"
                label="连续缴个税合计"
                type="digit"
                placeholder="请输入月数"
                :rules="[{ pattern: /^\d+$/, message: '请输入整数' }]"
              >
                <template #button>
                  <span>个月</span>
                </template>
              </van-field>
              <van-field
                v-model="workData.incomeTax.currentUnitMonths"
                label="当前单位"
                type="digit"
                placeholder="请输入月数"
                :rules="[{ pattern: /^\d+$/, message: '请输入整数' }]"
              >
                <template #button>
                  <span>个月</span>
                </template>
              </van-field>
              <van-field
                v-model="workData.incomeTax.averageSalary"
                label="近半年平均个税税前工资"
                type="digit"
                placeholder="请输入金额"
                :rules="[{ pattern: /^\d+$/, message: '请输入整数' }]"
              >
                <template #button>
                  <span>元</span>
                </template>
              </van-field>
              <div class="form-item">
                <div class="form-label">
                  个税单位名称
                </div>
                <van-radio-group v-model="workData.incomeTax.sameAsSocialSecurity" direction="horizontal">
                  <van-radio :name="true">
                    同社保单位
                  </van-radio>
                  <van-radio :name="false">
                    不同于社保单位
                  </van-radio>
                </van-radio-group>
              </div>
              <van-field
                v-model="workData.incomeTax.unitRemark"
                label="个税单位补充"
                placeholder="是否断缴等情况"
              />
            </div>
          </div>

          <!-- 企业情况 -->
          <div class="sub-section">
            <h3>03）企业情况</h3>
            <div class="form-item">
              <div class="form-label">
                <span style="color:red">*</span>是否有企业
              </div>
              <van-radio-group v-model="workData.hasEnterprise" direction="horizontal">
                <van-radio :name="false">
                  否
                </van-radio>
                <van-radio :name="true">
                  是
                </van-radio>
              </van-radio-group>
            </div>
            <div v-if="workData.hasEnterprise" class="form-item">
              <van-field
                v-model="workData.enterprise.name"
                label="企业全称"
                placeholder="请输入企业全称"
              />
              <div class="form-item">
                <div class="form-label">
                  <span style="color:red">*</span>工商信息
                </div>
                <van-checkbox-group v-model="workData.enterprise.businessInfo" direction="horizontal">
                  <van-checkbox name="法人">
                    法人
                  </van-checkbox>
                  <van-checkbox name="股东">
                    股东
                  </van-checkbox>
                  <van-checkbox name="监事">
                    监事
                  </van-checkbox>
                </van-checkbox-group>
              </div>
              <template v-if="workData.enterprise.businessInfo.includes('法人')">
                <van-field
                  v-model="workData.enterprise.legalPersonMonths"
                  label="法人名下"
                  type="digit"
                  placeholder="请输入月数"
                  :rules="[{ pattern: /^\d+$/, message: '请输入整数' }]"
                >
                  <template #button>
                    <span>个月</span>
                  </template>
                </van-field>
              </template>
              <template v-if="workData.enterprise.businessInfo.includes('股东')">
                <van-field
                  v-model="workData.enterprise.shareholderMonths"
                  label="股东名下"
                  type="digit"
                  placeholder="请输入月数"
                  :rules="[{ pattern: /^\d+$/, message: '请输入整数' }]"
                >
                  <template #button>
                    <span>个月</span>
                  </template>
                </van-field>
                <van-field
                  v-model="workData.enterprise.shareholderPercentage"
                  label="占股"
                  type="digit"
                  placeholder="请输入占股比例"
                  :rules="[{ pattern: /^\d+$/, message: '请输入整数' }]"
                >
                  <template #button>
                    <span>%</span>
                  </template>
                </van-field>
              </template>
              <van-field
                v-model="workData.enterprise.registeredCapital"
                label="注册资金"
                type="digit"
                placeholder="请输入金额"
                :rules="[{ pattern: /^\d+$/, message: '请输入整数' }]"
              >
                <template #button>
                  <span>万</span>
                </template>
              </van-field>
              <van-field
                v-model="workData.enterprise.registeredMonths"
                label="注册"
                type="digit"
                placeholder="请输入月数"
                :rules="[{ pattern: /^\d+$/, message: '请输入整数' }]"
              >
                <template #button>
                  <span>个月</span>
                </template>
              </van-field>
              <div class="form-item">
                <div class="form-label">
                  工商是否经营异常
                </div>
                <van-radio-group v-model="workData.enterprise.hasAbnormalOperation" direction="horizontal">
                  <van-radio :name="false">
                    否
                  </van-radio>
                  <van-radio :name="true">
                    是
                  </van-radio>
                </van-radio-group>
              </div>
              <div class="form-item">
                <div class="form-label">
                  <span style="color:red">*</span>是否实体
                </div>
                <van-radio-group v-model="workData.enterprise.hasEntity" direction="horizontal">
                  <van-radio :name="false">
                    否
                  </van-radio>
                  <van-radio :name="true">
                    是
                  </van-radio>
                </van-radio-group>
              </div>
              <template v-if="workData.enterprise.hasEntity">
                <van-field
                  v-model="workData.enterprise.industry"
                  label="经营行业"
                  placeholder="请输入经营行业"
                />
                <van-field
                  v-model="workData.enterprise.scale.employees"
                  label="企业规模-人数"
                  type="digit"
                  placeholder="请输入人数"
                  :rules="[{ pattern: /^\d+$/, message: '请输入整数' }]"
                >
                  <template #button>
                    <span>人</span>
                  </template>
                </van-field>
                <van-field
                  v-model="workData.enterprise.scale.area"
                  label="企业规模-面积"
                  type="digit"
                  placeholder="请输入面积"
                  :rules="[{ pattern: /^\d+$/, message: '请输入整数' }]"
                >
                  <template #button>
                    <span>㎡</span>
                  </template>
                </van-field>
              </template>
            </div>
          </div>
        </div>
      </van-collapse-item>

      <!-- 加分选项 -->
      <van-collapse-item title="本人加分选项" name="3">
        <template #value>
          <van-button size="small" type="primary" @click.stop="saveBonusData">
            暂存
          </van-button>
        </template>
        <div class="section-content">
          <!-- 学历情况 -->
          <div class="sub-section">
            <h3><span style="color:red">*</span>01）学历情况</h3>
            <div class="form-item">
              <van-radio-group v-model="bonusData.education.level" direction="horizontal">
                <van-radio v-for="level in educationLevels" :key="level" :name="level">
                  {{ level }}
                </van-radio>
              </van-radio-group>
            </div>
            <div v-if="['大专', '本科', '硕士', '博士'].includes(bonusData.education.level)" class="form-item">
              <div class="form-label">
                是否学信网可查
              </div>
              <van-radio-group v-model="bonusData.education.verifiable" direction="horizontal">
                <van-radio :name="true">
                  是
                </van-radio>
                <van-radio :name="false">
                  否
                </van-radio>
              </van-radio-group>
            </div>
            <div v-if="bonusData.education.verifiable" class="form-item">
              <div class="form-label">
                是否全日制
              </div>
              <van-radio-group v-model="bonusData.education.fullTime" direction="horizontal">
                <van-radio :name="true">
                  是
                </van-radio>
                <van-radio :name="false">
                  否
                </van-radio>
              </van-radio-group>
            </div>
          </div>

          <!-- 房产情况 -->
          <div class="sub-section">
            <h3>02）房产情况</h3>
            <div class="form-item">
              <div class="form-label">
                <span style="color:red">*</span>是否有房产
              </div>
              <van-radio-group v-model="bonusData.house.hasHouse" direction="horizontal">
                <van-radio :name="true">
                  是
                </van-radio>
                <van-radio :name="false">
                  否
                </van-radio>
              </van-radio-group>
            </div>
            <div v-if="bonusData.house.hasHouse" class="upload-section">
              <van-uploader v-model="bonusData.house.houseFiles" multiple upload-text="添加房产明细(有则必需添加)" />
            </div>
          </div>

          <!-- 车产情况 -->
          <div class="sub-section">
            <h3>03）车产情况</h3>
            <div class="form-item">
              <div class="form-label">
                <span style="color:red">*</span>是否有车产
              </div>
              <van-radio-group v-model="bonusData.car.hasCar" direction="horizontal">
                <van-radio :name="true">
                  是
                </van-radio>
                <van-radio :name="false">
                  否
                </van-radio>
              </van-radio-group>
            </div>
            <div v-if="bonusData.car.hasCar" class="upload-section">
              <van-uploader
                v-model="bonusData.car.carFiles" :max-count="1"
                upload-text="添加车产明细(有则必需添加)"
              />
              <div class="upload-tip">
                只上传一量，优先级别：广东省内牌＞广东省外牌
              </div>
            </div>
          </div>

          <!-- 金融资产情况 -->
          <div class="sub-section">
            <h3>04）金融资产情况</h3>
            <div class="form-item">
              <div class="form-label">
                <span style="color:red">*</span>是否有金融资产
              </div>
              <van-radio-group v-model="bonusData.financial.hasFinancial" direction="horizontal">
                <van-radio :name="true">
                  是
                </van-radio>
                <van-radio :name="false">
                  否
                </van-radio>
              </van-radio-group>
            </div>
            <div v-if="bonusData.financial.hasFinancial" class="upload-section">
              <van-uploader
                v-model="bonusData.financial.financialFiles" :max-count="1"
                upload-text="添加金融资产明细(有则必需添加)"
              />
            </div>
          </div>

          <!-- 流水情况 -->
          <div class="sub-section">
            <h3>05）流水情况</h3>
            <div class="form-item">
              <div class="form-label">
                <span style="color:red">*</span>是否有有效流水
              </div>
              <van-radio-group v-model="bonusData.bankFlow.hasFlow" direction="horizontal">
                <van-radio :name="true">
                  有
                </van-radio>
                <van-radio :name="false">
                  无
                </van-radio>
              </van-radio-group>
            </div>
            <div v-if="bonusData.bankFlow.hasFlow" class="upload-section">
              <van-uploader
                v-model="bonusData.bankFlow.flowFiles" :max-count="2"
                upload-text="添加流水明细(有则必需添加)"
              />
            </div>
          </div>
        </div>
      </van-collapse-item>

      <!-- 特殊情况（预留） -->
      <van-collapse-item title="本人特殊情况补充" name="4">
        <template #value>
          <van-button size="small" type="primary" @click.stop="saveSpecialData">
            暂存
          </van-button>
        </template>
        <div class="section-content">
          <!-- 语言能力 -->
          <div class="sub-section">
            <h3><span style="color:red">*</span>01）普通话/粤语（必填）</h3>
            <div class="form-item">
              <van-radio-group v-model="specialData.language" direction="horizontal">
                <van-radio name="both">
                  普通话和粤语都会
                </van-radio>
                <van-radio name="mandarin">
                  只会普通话
                </van-radio>
                <van-radio name="cantonese">
                  只会粤语
                </van-radio>
                <van-radio name="none">
                  普通话和粤语都不会
                </van-radio>
              </van-radio-group>
            </div>
          </div>

          <!-- 写字能力 -->
          <div class="sub-section">
            <h3><span style="color:red">*</span>02）写字能力（必填）</h3>
            <div class="form-item">
              <van-radio-group v-model="specialData.writing" direction="horizontal">
                <van-radio name="normal">
                  写字正常
                </van-radio>
                <van-radio name="slow">
                  写字很慢
                </van-radio>
                <van-radio name="unable">
                  不会写字
                </van-radio>
              </van-radio-group>
            </div>
          </div>

          <!-- 身体状况 -->
          <div class="sub-section">
            <h3><span style="color:red">*</span>03）身体缺陷（必填）</h3>
            <div class="form-item">
              <van-radio-group v-model="specialData.physical" direction="horizontal">
                <van-radio name="normal">
                  身体正常
                </van-radio>
                <van-radio name="disabled">
                  身体有明显残疾
                </van-radio>
              </van-radio-group>
            </div>
          </div>
        </div>
      </van-collapse-item>
    </van-collapse>

    <div class="submit-btn">
      <van-button type="primary" round block @click="onSubmit">
        提交
      </van-button>
    </div>
  </div>
</template>

<style scoped>
.reject-info-row {
  display: flex;
  gap: 10px;
}

.reject-info-row .reject-time {
  width: 140px;
  flex-shrink: 0;
}

.reject-info-row .reject-reason {
  flex: 1;
}
</style>

<style scoped>
.last-examine {
  min-height: 100vh;
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  padding: 16px;
}

.form-item {
  margin: 12px 0;
}

.form-label {
  margin-bottom: 8px;
  font-weight: 500;
}

.bank-checkboxes {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
}

.bank-checkbox {
  min-width: 80px;
}

.bank-reason {
  margin: 3px 0;
  padding: 8px;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 8px;
}

:deep(.van-radio-group) {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

:deep(.van-radio) {
  margin-right: 0;
}

:deep(.van-collapse) {
  border-radius: 12px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

:deep(.van-collapse-item__title) {
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
  align-items: center;
}

:deep(.van-collapse-item__content) {
  background: rgba(255, 255, 255, 0.8);
  padding: 16px;
}

:deep(.van-field) {
  width: 100%;
  padding: 8px 12px;
}

:deep(.van-field__control) {
  font-size: 14px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.section-content {
  padding: 8px;
}

.sub-section {
  margin-bottom: 24px;
}

.sub-section h3 {
  font-size: 16px;
  color: #333;
  margin-bottom: 16px;
}

.record-item {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.record-info {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.bank-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
}

.bank-item {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  padding: 12px;
}

.placeholder-text {
  color: #999;
  text-align: center;
  padding: 20px;
}

.form-item {
  margin-bottom: 16px;
}

.form-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.upload-section {
  margin-top: 12px;

  :deep(.van-uploader) {
    margin-bottom: 12px;
  }
}

.submit-btn {
  margin-top: 24px;
  padding: 0 16px;
}

:deep(.van-field) {
  background: transparent;
}

:deep(.van-checkbox__label) {
  color: #333;
}

:deep(.van-radio-group) {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.upload-tip {
  font-size: 12px;
  color: #666;
  margin-top: 8px;
  padding-left: 12px;
  border-left: 2px solid #4caf50;
  background-color: rgba(76, 175, 80, 0.1);
  padding: 8px 12px;
  border-radius: 4px;
}
</style>
