<script setup>
import { computed, nextTick, ref } from 'vue'
import Vue3Signature from 'vue3-signature'

const showPad = ref(false)
const signatureImg = ref('')
const signatureRef = ref(null)

// 响应式签名板宽高，移动端适配
function getPadWidth() {
  if (window.innerWidth < 600)
    return window.innerWidth * 0.92
  if (window.innerWidth < 900)
    return window.innerWidth * 0.7
  return 540
}
function getPadHeight() {
  if (window.innerWidth < 600)
    return 320
  return 260
}
const signaturePadWidth = computed(() => getPadWidth())
const signaturePadHeight = computed(() => getPadHeight())

function clearSign() {
  signatureRef.value.clear()
}

function saveSign() {
  signatureImg.value = signatureRef.value.save()
  showPad.value = false
}

function openPad() {
  showPad.value = true
  nextTick(() => {
    // vue3-signature 没有resize方法，用clear触发重绘
    signatureRef.value.clear()
  })
}

// 监听窗口变化，动态调整签名板大小
if (typeof window !== 'undefined') {
  window.addEventListener('resize', () => {
    signaturePadWidth.value = getPadWidth()
    signaturePadHeight.value = getPadHeight()
  })
}
</script>

<template>
  <div class="authbook">
    <!-- 授权书内容，排版可继续优化 -->
    <div class="book-content">
      <h2>授权书</h2>
      <div class="book-main">
        <p>（甲方）__________有限公司</p>
        <p>本人（姓名（最终用户）：__________，身份证号：__________），授权贵司申请：__________业务，审批需要的相关情况，用于（学籍、经营信息、风险管理、贷后管理等）及风控评估与控制，因此本人特同意并授权：</p>
        <ol>
          <li>贵司有权收集并使用本人在贵司主办理业务时填写的个人信息，包括本人姓名、身份证号码、手机号、车辆号牌等（本人已确认该等需常用联系人授权已取得各等填写用联系人的本人书面同意）。</li>
          <li>贵司可依法或应政府第三方及提供服务者（包括前述百百云等相关存储公司及其关联方，下同）要求向本人信息、手机号、车辆号牌等（本人与常用联系人的关系及常用联系人手机号等）等自动自有系统上传或第三方云存储的各等填写用联系人信息。</li>
        </ol>
        <p>本人在此声明已充分理解上述授权条款含义，如贵方自愿再上诉同收集、保存等本人数据或信息本人产生不利影响，以及该数据或信息在未获提供给第三方的情况下当利用时风险，但本人仍同意上述授权。</p>
        <p>授权人（签字）：</p>
        <div class="signature-area" @click="openPad">
          <img v-if="signatureImg" :src="signatureImg" alt="签名" style="max-width: 200px; max-height: 80px;">
          <span v-else class="sign-placeholder">点击此处签字</span>
        </div>
        <p>出具日期：20　　年　　月　　日</p>
      </div>
    </div>
    <!-- 签名弹窗 -->
    <div v-if="showPad" class="signature-modal">
      <div class="signature-modal-bg" @click="showPad = false" />
      <div class="signature-modal-content">
        <Vue3Signature
          ref="signatureRef"
          :width="signaturePadWidth"
          :height="signaturePadHeight"
          pen-color="#000"
          background-color="#fff"
        />
        <div class="signature-modal-actions">
          <button @click="clearSign">
            重写
          </button>
          <button @click="saveSign">
            确定
          </button>
          <button @click="showPad = false">
            取消
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

  <style scoped>
  .authbook {
  max-width: 700px;
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px #eee;
  font-family: 'Microsoft YaHei', Arial, sans-serif;
}
.book-content {
  font-size: 16px;
  color: #222;
}
.book-main {
  margin-top: 16px;
}
.signature-area {
  border: 3px dashed #3477f5;
  min-height: 140px;
  width: 50vw;
  margin: 26px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: #f5f8ff;
  border-radius: 10px;
  transition: box-shadow 0.2s;
  box-shadow: 0 2px 8px #e3eafd;
}
.signature-area:hover {
  box-shadow: 0 4px 16px #b1c9f7;
  background: #eaf2ff;
}
.sign-placeholder {
  color: #888;
}
.signature-modal {
  position: fixed;
  z-index: 9999;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}
.signature-modal-bg {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
}
.signature-modal-content {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  padding: 8px 6px 20px 6px;
  border-radius: 10px;
  box-shadow: 0 2px 12px #aaa;
  min-width: 260px;
  max-width: 96vw;
  height: 224px;
  width: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}
@media (max-width: 600px) {
  .signature-modal-content {
    min-width: 0;
    max-width: 98vw;
    width: 100vw;
    padding: 4px 2vw 16px 2vw;
    border-radius: 6px;
  }
}

.signature-modal-actions {
  margin-top: 12px;
  text-align: right;
}
.signature-modal-actions button {
  margin-left: 8px;
  padding: 6px 16px;
  border: none;
  background: #3477f5;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
}
.signature-modal-actions button:first-child {
  background: #aaa;
}

/* 强制签名弹窗canvas宽高生效 */
.signature-modal-content canvas {
  width: 100% !important;
  height: 100% !important;
  min-height: 180px;
  max-width: 100vw;
  display: block;
  background: #fff;
  border-radius: 6px;
}
</style>
