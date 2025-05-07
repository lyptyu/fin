<script setup>
import { computed, nextTick, ref } from 'vue'
import Vue3Signature from 'vue3-signature'
import { fileUpload } from '@/api/utils'
import html2canvas from 'html2canvas'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

const showPad = ref(false)
const signatureImg = ref('')
const signatureRef = ref(null)
const authbookRef = ref(null)
const router = useRouter()

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

function dataURLtoFile(dataurl, filename = 'signature.png') {
  const arr = dataurl.split(',')
  const mime = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
}

async function submitAuthbook() {
  // 截图整个授权书区域为图片
  const el = authbookRef.value
  const canvas = await html2canvas(el, { useCORS: true, backgroundColor: '#fff' })
  const dataUrl = canvas.toDataURL('image/png')
  const file = dataURLtoFile(dataUrl, 'authbook.png')
  const res = await fileUpload({ file })
  showToast('提交成功！')
  // 提交成功后跳转到gama-bigdata页面
  router.push('/gama-bigdata')
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
  <div class="authbook-wrap">
    <div ref="authbookRef" class="authbook">
      <!-- 授权书内容，排版可继续优化 -->
      <div class="book-content">
        <h2>授权书</h2>
        <div class="book-main">
          <p>（甲方）   有限公司</p>
          <p>本人（姓名（最终用户）：                 、身份证号码：                     ）拟向贵司申请                业务，贵司需要了解本人相关状况，用于                  （举例：授信审批、风险管理、贷后管理等）及风险评估与控制，因此本人特同意并授权：</p>
          <p>（一）贵司有权收集并使用本人在办理上述业务时填写的个人信息，包括本人姓名、身份证号、手机号；车辆车架号；本人与常用联系人的关系及常用联系人的姓名、身份证号、手机号（本人已确认获得常用联系人授权且已明确告知该常用联系人其信息的用途）。</p>
          <p>（二）贵司向依法成立的第三方风控服务商（包括南京三百云信息科技有限公司及其关联方，下同）提供本人信息（包括：本人姓名、身份证号、手机号；车辆车架号；本人与常用联系人的关系及常用联系人的姓名、身份证号、手机号），同意贵司自行或者委托上述第三方风控服务商查询必要的相关数据。</p>
          <p>（三）依法成立的第三方风控服务商根据贵司提供的本人信息自行/向第三方（包括但不限于腾讯云计算(北京)有限责任公司）查询或核实、搜集、保存、共享、使用本人相关数据以及进行相关分析和评估并出具相关报告，且不再另行告知本人，但法律、法规、监管政策禁止的除外。</p>
          <p>本人在此声明已充分理解上述授权条款含义，知晓并自愿承担上述因收集、保存等本人数据可能会给本人产生不利影响，以及该等数据被使用者依法提供给第三方后被他人不当利用的风险，但本人仍同意上述授权。</p>
          <p>特别提示：</p>
          <p>为了保障您的合法权益，请您务必阅读并充分理解与遵守本授权书；若您不接受本授权书的任何条款，请您立即终止授权。</p>
          <p>贵司已经对上述事宜及其风险向本人做了充分说明，本人已知晓并同意。</p>
          <p>本授权书一经出具即生效，有效期自签署之日起至业务终止之日止。本授权书是本人真实意思表示，本人同意承担由此带来的一切法律后果。</p>
          <br>
          <p style="text-align:right">
            授权人（签字）：   （最终用户）
          </p>
          <div class="signature-area" @click="openPad">
            <img v-if="signatureImg" :src="signatureImg" alt="签名" style="max-width: 200px; max-height: 80px;">
            <span v-else class="sign-placeholder">点击此处签字</span>
          </div>
          <p style="text-align:right">
            出具日期：20   年   月   日
          </p>
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
    <button class="submit-btn" :disabled="!signatureImg" @click="submitAuthbook">
      提交
    </button>
  </div>
</template>

<style scoped>
.authbook-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
}
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

.submit-btn {
  margin-top: 28px;
  margin-bottom: 28px;
  width: 100%;
  max-width: 320px;
  padding: 12px 0;
  background: #3477f5;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}
.submit-btn:disabled {
  background: #b4c7f7;
  cursor: not-allowed;
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
