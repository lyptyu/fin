<script setup lang="ts">
import { reactive, ref } from 'vue'
import { showFailToast, showSuccessToast } from 'vant'
import { useRouter } from 'vue-router'

const router = useRouter()

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

  // 提交成功后的操作
  // showSuccessToast('提交成功')

  // 这里可以添加提交到后端的代码
  console.log('提交的表单数据:', formData)

  // 跳转到下一页，例如跳转到last-examine页面
  // router.push('/last-examine/')
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
        <div v-if="formData.realMaritalStatus && formData.realMaritalStatus !== '已婚'" class="section">
          <div class="section-header">
            <div class="section-title">
              驾驶证情况
            </div>
            <div class="section-line" />
          </div>

          <div class="form-group">
            <div class="form-item">
              <div class="form-label required">
                是否有驾驶证
              </div>
              <div class="form-input" @click="handleHasDrivingLicenseClick">
                <div class="selected-value" :class="{ placeholder: !formData.hasDrivingLicense }">
                  {{ formData.hasDrivingLicense || '请选择是否有驾驶证' }}
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
  background: linear-gradient(135deg, #1a2a6c 0%, #b21f1f 50%, #fdbb2d 100%);
  background-attachment: fixed;

  .custom-nav {
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(10px);

    :deep(.van-nav-bar__title) {
      color: #fff;
      font-weight: bold;
    }

    :deep(.van-icon) {
      color: #fff;
    }
  }

  .content {
    padding: 20px;
  }

  .form-container {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(15px);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .section {
    margin-bottom: 20px;
    padding: 20px;

    &:not(:last-child) {
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
  }

  .section-header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }

  .section-title {
    font-size: 18px;
    font-weight: bold;
    color: #fff;
    position: relative;
    padding-left: 15px;

    &:before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 5px;
      height: 20px;
      background: linear-gradient(to bottom, #00f2fe, #4facfe);
      border-radius: 3px;
    }
  }

  .section-line {
    flex: 1;
    height: 1px;
    background: linear-gradient(to right, rgba(255, 255, 255, 0.3), transparent);
    margin-left: 15px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .form-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .form-label {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.9);

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
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 12px 16px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: all 0.3s;

    &:active {
      background: rgba(255, 255, 255, 0.15);
    }
  }

  .selected-value {
    color: #fff;

    &.placeholder {
      color: rgba(255, 255, 255, 0.5);
    }
  }

  .arrow-icon {
    color: rgba(255, 255, 255, 0.7);
  }

  .tech-field {
    background: rgba(255, 255, 255, 0.1) !important;
    border-radius: 8px !important;
    overflow: hidden;

    :deep(.van-field__label) {
      color: rgba(255, 255, 255, 0.9);
    }

    :deep(.van-field__control) {
      color: #fff;
    }

    :deep(.van-field__control::placeholder) {
      color: rgba(255, 255, 255, 0.5);
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
    color: rgba(255, 255, 255, 0.7);
    font-size: 14px;
  }

  .submit-container {
    padding: 20px;
  }

  .submit-button {
    height: 44px;
    font-size: 16px;
    font-weight: bold;
    background: linear-gradient(to right, #00f2fe, #4facfe);
    border: none;
    box-shadow: 0 4px 15px rgba(0, 242, 254, 0.3);

    &:active {
      opacity: 0.9;
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
    color: #1989fa;
  }

  :deep(.van-picker-column__item) {
    color: #969799;
  }

  :deep(.van-picker-column__item--selected) {
    color: #323233;
    font-weight: bold;
  }
}
</style>
