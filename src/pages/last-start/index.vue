<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { showFailToast, showSuccessToast } from 'vant'
import { useRouter } from 'vue-router'

const router = useRouter()

// 存储键名
const LAST_START_STORAGE_KEY = 'financing_mes_data'

// 表单数据
const formData = reactive({
  // 融资基本信息
  financingAmount: '',
  financingPurpose: '',
  repaymentSource: '',
  specialNotes: '',

  // 婚姻状态
  realMaritalStatus: '',
  creditMaritalStatus: '',
  spouseAware: '',
  spouseCanSign: '',

  // 驾驶证情况
  hasDrivingLicense: '',
  spouseHasDrivingLicense: '',
})

// 婚姻状态选项
const maritalStatusOptions = [
  { text: '未婚', value: '未婚' },
  { text: '已婚', value: '已婚' },
  { text: '离异', value: '离异' },
  { text: '丧偶', value: '丧偶' },
]

// 是否选项
const yesNoOptions = [
  { text: '是', value: '是' },
  { text: '否', value: '否' },
]

// 资金用途选项
const purposeOptions = [
  { text: '购车', value: '购车' },
  { text: '装修', value: '装修' },
  { text: '教育', value: '教育' },
  { text: '旅游', value: '旅游' },
  { text: '医疗', value: '医疗' },
  { text: '其他', value: '其他' },
]

// 还款来源选项
const repaymentSourceOptions = [
  { text: '工资收入', value: '工资收入' },
  { text: '经营收入', value: '经营收入' },
  { text: '投资收益', value: '投资收益' },
  { text: '房租收入', value: '房租收入' },
  { text: '其他', value: '其他' },
]

// 选择器状态
const showRealMaritalPicker = ref(false)
const showCreditMaritalPicker = ref(false)
const showSpouseAwarePicker = ref(false)
const showSpouseCanSignPicker = ref(false)
const showHasDrivingLicensePicker = ref(false)
const showSpouseHasDrivingLicensePicker = ref(false)
const showPurposePicker = ref(false)
const showRepaymentSourcePicker = ref(false)

// 处理真实婚姻状态选择
function handleRealMaritalStatusClick() {
  showRealMaritalPicker.value = true
}

function onRealMaritalStatusConfirm(value: any) {
  formData.realMaritalStatus = value.selectedOptions[0].text
  showRealMaritalPicker.value = false
}

// 处理征信婚姻状态选择
function handleCreditMaritalStatusClick() {
  showCreditMaritalPicker.value = true
}

function onCreditMaritalStatusConfirm(value: any) {
  formData.creditMaritalStatus = value.selectedOptions[0].text
  showCreditMaritalPicker.value = false
}

// 处理配偶是否知情选择
function handleSpouseAwareClick() {
  showSpouseAwarePicker.value = true
}

function onSpouseAwareConfirm(value: any) {
  formData.spouseAware = value.selectedOptions[0].text
  showSpouseAwarePicker.value = false
}

// 处理配偶是否可共签选择
function handleSpouseCanSignClick() {
  showSpouseCanSignPicker.value = true
}

function onSpouseCanSignConfirm(value: any) {
  formData.spouseCanSign = value.selectedOptions[0].text
  showSpouseCanSignPicker.value = false
}

// 处理是否有驾驶证选择
function handleHasDrivingLicenseClick() {
  showHasDrivingLicensePicker.value = true
}

function onHasDrivingLicenseConfirm(value: any) {
  formData.hasDrivingLicense = value.selectedOptions[0].text
  showHasDrivingLicensePicker.value = false
}

// 处理配偶是否有驾驶证选择
function handleSpouseHasDrivingLicenseClick() {
  showSpouseHasDrivingLicensePicker.value = true
}

function onSpouseHasDrivingLicenseConfirm(value: any) {
  formData.spouseHasDrivingLicense = value.selectedOptions[0].text
  showSpouseHasDrivingLicensePicker.value = false
}

// 处理资金用途选择
function handlePurposeClick() {
  showPurposePicker.value = true
}

function onPurposeConfirm(value: any) {
  formData.financingPurpose = value.selectedOptions[0].text
  showPurposePicker.value = false
}

// 处理还款来源选择
function handleRepaymentSourceClick() {
  showRepaymentSourcePicker.value = true
}

function onRepaymentSourceConfirm(value: any) {
  formData.repaymentSource = value.selectedOptions[0].text
  showRepaymentSourcePicker.value = false
}

// 保存表单数据到本地存储
function saveFormDataToStorage() {
  try {
    // 将表单数据保存为 financingMes 格式
    const financingMes = {
      financingAmount: formData.financingAmount,
      financingPurpose: formData.financingPurpose,
      repaymentSource: formData.repaymentSource,
      specialNotes: formData.specialNotes,
      realMaritalStatus: formData.realMaritalStatus,
      creditMaritalStatus: formData.creditMaritalStatus,
      spouseAware: formData.spouseAware,
      spouseCanSign: formData.spouseCanSign,
      hasDrivingLicense: formData.hasDrivingLicense,
      spouseHasDrivingLicense: formData.spouseHasDrivingLicense
    }
    localStorage.setItem(LAST_START_STORAGE_KEY, JSON.stringify(financingMes))
  } catch (e) {
    console.error('保存表单数据失败:', e)
  }
}

// 从本地存储恢复表单数据
function restoreFormDataFromStorage() {
  try {
    const savedData = localStorage.getItem(LAST_START_STORAGE_KEY)
    if (savedData) {
      const parsedData = JSON.parse(savedData)
      Object.assign(formData, parsedData)
    }
  } catch (e) {
    console.error('恢复表单数据失败:', e)
  }
}

// 页面加载时不自动恢复数据，保持表单为空状态
onMounted(() => {
  // 表单保持空状态，让用户自己填写
})

// 提交表单
function submitForm() {
  // 表单验证
  if (!formData.financingAmount) {
    showFailToast('请输入期望融资金额')
    return
  }
  if (!formData.financingPurpose) {
    showFailToast('请选择资金用途')
    return
  }
  if (!formData.repaymentSource) {
    showFailToast('请选择还款来源')
    return
  }
  if (!formData.realMaritalStatus) {
    showFailToast('请选择真实婚姻状态')
    return
  }
  if (!formData.creditMaritalStatus) {
    showFailToast('请选择征信婚姻状态')
    return
  }

  // 已婚情况下的额外验证
  if (formData.realMaritalStatus === '已婚') {
    if (!formData.spouseAware) {
      showFailToast('请选择配偶是否知情')
      return
    }
    if (formData.spouseAware === '是' && !formData.spouseCanSign) {
      showFailToast('请选择配偶是否可共签')
      return
    }
  }

  // 非已婚情况下的驾驶证验证
  if (formData.realMaritalStatus !== '已婚') {
    if (!formData.hasDrivingLicense) {
      showFailToast('请选择是否有驾驶证')
      return
    }
  }

  // 保存表单数据到本地存储
  saveFormDataToStorage()
  
  showSuccessToast('保存成功')
  
  // 跳转到下一页
  router.push('/last-examine/')
}

// 返回上一页
function goBack() {
  router.back()
}
</script>

<template>
  <div class="last-start">
    <van-nav-bar
      title="融资基本调查"
      left-arrow
      class="custom-nav"
      @click-left="goBack"
    />

    <div class="content">
      <div class="form-container">
        <!-- 融资基本信息 -->
        <div class="section">
          <div class="section-header">
            <div class="section-title">
              融资基本信息
            </div>
            <div class="section-line" />
          </div>

          <div class="form-group">
            <van-field
              v-model="formData.financingAmount"
              label="期望融资额度"
              placeholder="请输入金额"
              type="number"
              class="tech-field"
              required
              label-width="150px"
            >
              <template #right-icon>
                <span class="unit">元</span>
              </template>
            </van-field>

            <div class="form-item">
              <div class="form-label required">
                资金用途
              </div>
              <div class="form-input" @click="handlePurposeClick">
                <div class="selected-value" :class="{ placeholder: !formData.financingPurpose }">
                  {{ formData.financingPurpose || '请选择资金用途' }}
                </div>
                <van-icon name="arrow" class="arrow-icon" />
              </div>
            </div>

            <div class="form-item">
              <div class="form-label required">
                还款来源
              </div>
              <div class="form-input" @click="handleRepaymentSourceClick">
                <div class="selected-value" :class="{ placeholder: !formData.repaymentSource }">
                  {{ formData.repaymentSource || '请选择还款来源' }}
                </div>
                <van-icon name="arrow" class="arrow-icon" />
              </div>
            </div>

            <van-field
              v-model="formData.specialNotes"
              label="特别说明"
              type="textarea"
              placeholder="请输入特别说明"
              rows="3"
              autosize
              class="tech-field"
            />
          </div>
        </div>

        <!-- 婚姻状态 -->
        <div class="section">
          <div class="section-header">
            <div class="section-title">
              婚姻状态
            </div>
            <div class="section-line" />
          </div>

          <div class="form-group">
            <div class="form-item">
              <div class="form-label required">
                真实婚姻状态
              </div>
              <div class="form-input" @click="handleRealMaritalStatusClick">
                <div class="selected-value" :class="{ placeholder: !formData.realMaritalStatus }">
                  {{ formData.realMaritalStatus || '请选择真实婚姻状态' }}
                </div>
                <van-icon name="arrow" class="arrow-icon" />
              </div>
            </div>

            <div class="form-item">
              <div class="form-label required">
                征信婚姻状态
              </div>
              <div class="form-input" @click="handleCreditMaritalStatusClick">
                <div class="selected-value" :class="{ placeholder: !formData.creditMaritalStatus }">
                  {{ formData.creditMaritalStatus || '请选择征信婚姻状态' }}
                </div>
                <van-icon name="arrow" class="arrow-icon" />
              </div>
            </div>

            <template v-if="formData.realMaritalStatus === '已婚'">
              <div class="form-item">
                <div class="form-label required">
                  配偶是否知情
                </div>
                <div class="form-input" @click="handleSpouseAwareClick">
                  <div class="selected-value" :class="{ placeholder: !formData.spouseAware }">
                    {{ formData.spouseAware || '请选择配偶是否知情' }}
                  </div>
                  <van-icon name="arrow" class="arrow-icon" />
                </div>
              </div>

              <div v-if="formData.spouseAware === '是'" class="form-item">
                <div class="form-label required">
                  配偶是否可共签
                </div>
                <div class="form-input" @click="handleSpouseCanSignClick">
                  <div class="selected-value" :class="{ placeholder: !formData.spouseCanSign }">
                    {{ formData.spouseCanSign || '请选择配偶是否可共签' }}
                  </div>
                  <van-icon name="arrow" class="arrow-icon" />
                </div>
              </div>
            </template>
          </div>
        </div>

        <!-- 驾驶证情况 -->
        <div class="section">
          <div class="section-header">
            <div class="section-title">
              驾驶证情况
            </div>
            <div class="section-line" />
          </div>

          <div class="form-group">
            <div class="form-item">
              <div class="form-label required">
                本人驾驶证情况
              </div>
              <div class="form-input" @click="handleHasDrivingLicenseClick">
                <div class="selected-value" :class="{ placeholder: !formData.hasDrivingLicense }">
                  {{ formData.hasDrivingLicense || '请选择是否有驾驶证' }}
                </div>
                <van-icon name="arrow" class="arrow-icon" />
              </div>
            </div>
            
            <div v-if="formData.realMaritalStatus === '已婚'" class="form-item">
              <div class="form-label required">
                配偶驾驶证情况
              </div>
              <div class="form-input" @click="handleSpouseHasDrivingLicenseClick">
                <div class="selected-value" :class="{ placeholder: !formData.spouseHasDrivingLicense }">
                  {{ formData.spouseHasDrivingLicense || '请选择配偶是否有驾驶证' }}
                </div>
                <van-icon name="arrow" class="arrow-icon" />
              </div>
            </div>
          </div>
        </div>

        <!-- 提交按钮 -->
        <div class="submit-container">
          <van-button type="primary" round block class="submit-button" @click="submitForm">
            提交
          </van-button>
        </div>
      </div>
    </div>

    <!-- 选择器弹窗 -->
    <van-popup v-model:show="showRealMaritalPicker" position="bottom" round>
      <van-picker
        :columns="maritalStatusOptions"
        title="选择真实婚姻状态"
        @confirm="onRealMaritalStatusConfirm"
        @cancel="showRealMaritalPicker = false"
      />
    </van-popup>

    <van-popup v-model:show="showCreditMaritalPicker" position="bottom" round>
      <van-picker
        :columns="maritalStatusOptions"
        title="选择征信婚姻状态"
        @confirm="onCreditMaritalStatusConfirm"
        @cancel="showCreditMaritalPicker = false"
      />
    </van-popup>

    <van-popup v-model:show="showSpouseAwarePicker" position="bottom" round>
      <van-picker
        :columns="yesNoOptions"
        title="选择配偶是否知情"
        @confirm="onSpouseAwareConfirm"
        @cancel="showSpouseAwarePicker = false"
      />
    </van-popup>

    <van-popup v-model:show="showSpouseCanSignPicker" position="bottom" round>
      <van-picker
        :columns="yesNoOptions"
        title="选择配偶是否可共签"
        @confirm="onSpouseCanSignConfirm"
        @cancel="showSpouseCanSignPicker = false"
      />
    </van-popup>

    <van-popup v-model:show="showHasDrivingLicensePicker" position="bottom" round>
      <van-picker
        :columns="yesNoOptions"
        title="选择是否有驾驶证"
        @confirm="onHasDrivingLicenseConfirm"
        @cancel="showHasDrivingLicensePicker = false"
      />
    </van-popup>

    <van-popup v-model:show="showSpouseHasDrivingLicensePicker" position="bottom" round>
      <van-picker
        :columns="yesNoOptions"
        title="选择配偶是否有驾驶证"
        @confirm="onSpouseHasDrivingLicenseConfirm"
        @cancel="showSpouseHasDrivingLicensePicker = false"
      />
    </van-popup>

    <van-popup v-model:show="showPurposePicker" position="bottom" round>
      <van-picker
        :columns="purposeOptions"
        title="选择资金用途"
        @confirm="onPurposeConfirm"
        @cancel="showPurposePicker = false"
      />
    </van-popup>

    <van-popup v-model:show="showRepaymentSourcePicker" position="bottom" round>
      <van-picker
        :columns="repaymentSourceOptions"
        title="选择还款来源"
        @confirm="onRepaymentSourceConfirm"
        @cancel="showRepaymentSourcePicker = false"
      />
    </van-popup>
  </div>
</template>

<style lang="less" scoped>
.last-start {
  min-height: 100vh;
  background: linear-gradient(180deg, #f0f2f5 0%, #ffffff 100%);

  .custom-nav {
    background: linear-gradient(90deg, #1976d2 0%, #2196f3 100%);

    :deep(.van-nav-bar__title) {
      color: #fff;
      font-size: 18px;
      font-weight: 500;
    }

    :deep(.van-icon) {
      color: #fff;
    }
  }

  .content {
    padding: 16px;
  }

  .form-container {
    margin-bottom: 16px;
    border-radius: 12px;
    overflow: hidden;
    background: #fff;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    }
  }

  .section {
    margin-bottom: 24px;
    padding: 16px;
    background: #f8f9fa;
    border-radius: 8px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .section-header {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
  }

  .section-title {
    font-size: 16px;
    font-weight: 600;
    color: #1a1a1a;
    position: relative;
    padding-left: 12px;

    &:before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 4px;
      height: 16px;
      background: #1976d2;
      border-radius: 2px;
    }
  }

  .section-line {
    flex: 1;
    height: 1px;
    background: #f0f0f0;
    margin-left: 12px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .form-item {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 12px;
  }

  .form-label {
    font-size: 14px;
    color: #333;

    &.required:after {
      content: '*';
      color: #ff4d4f;
      margin-left: 4px;
    }
  }

  .form-input {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #f8f9fa;
    border-radius: 8px;
    padding: 12px 16px;
    border: 1px solid #e8e8e8;
    transition: all 0.3s;

    &:active {
      background: #f0f0f0;
    }
  }

  .selected-value {
    color: #333;

    &.placeholder {
      color: #999;
    }
  }

  .arrow-icon {
    color: #999;
  }

  .tech-field {
    background: #f8f9fa !important;
    border-radius: 8px !important;
    overflow: hidden;

    :deep(.van-field__label) {
      color: #333;
    }

    :deep(.van-field__control) {
      color: #333;
    }

    :deep(.van-field__control::placeholder) {
      color: #999;
    }

    :deep(.van-cell) {
      background: transparent;
      padding: 12px 16px;
    }

    :deep(.van-field__right-icon) {
      margin-right: 0;
    }
  }

  .unit {
    color: #666;
    font-size: 14px;
  }

  .submit-container {
    margin-top: 32px;
    padding: 0 16px 20px;
  }

  .submit-button {
    height: 44px;
    font-size: 16px;
    font-weight: 500;
    border-radius: 22px;
    background: linear-gradient(90deg, #1976d2 0%, #2196f3 100%);
    box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);

    &:active {
      transform: scale(0.98);
    }
  }

  // 添加动画效果
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .section {
    animation: fadeIn 0.5s ease-out forwards;

    &:nth-child(1) {
      animation-delay: 0.1s;
    }

    &:nth-child(2) {
      animation-delay: 0.2s;
    }

    &:nth-child(3) {
      animation-delay: 0.3s;
    }
  }

  :deep(.van-popup) {
    background: #fff;
  }

  :deep(.van-picker) {
    background: #fff;
  }

  :deep(.van-picker__toolbar) {
    border-bottom: 1px solid #ebedf0;
  }

  :deep(.van-picker__title) {
    color: #323233;
  }

  :deep(.van-picker__cancel, .van-picker__confirm) {
    color: #1976d2;
  }

  :deep(.van-picker-column__item) {
    color: #969799;
  }

  :deep(.van-picker-column__item--selected) {
    color: #323233;
    font-weight: 500;
  }
}
</style>
