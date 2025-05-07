<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { fileUpload, ocrIdCard } from '@/api/utils'
import { useUserStore } from '@/stores'

const router = useRouter()
const userStore = useUserStore()

const fileInput = ref<HTMLInputElement | null>(null)
const frontImage = ref<string>('')
const backImage = ref<string>('')
const frontFile = ref<File | null>(null)
const backFile = ref<File | null>(null)
const currentUploadType = ref<'front' | 'back'>('front')
// Define loading state for submission
const isLoading = ref<boolean>(false)

// 判断是否完成上传
const isComplete = computed(() => {
  return frontImage.value && backImage.value
})

// 处理上传点击
function handleUpload(type: 'front' | 'back') {
  currentUploadType.value = type
  fileInput.value?.click()
}

// 处理文件改变
function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]

    // 检查文件大小（最大 5MB）
    if (file.size > 5 * 1024 * 1024) {
      showToast('图片大小不能超过5MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      if (currentUploadType.value === 'front') {
        frontImage.value = e.target?.result as string
        frontFile.value = file
      }
      else {
        backImage.value = e.target?.result as string
        backFile.value = file
      }
    }
    reader.readAsDataURL(file)
  }
  // 重置 input
  input.value = ''
}

// 处理提交
async function handleSubmit() {
  if (!isComplete.value) {
    showToast('请上传完整的身份证正反面照片')
    return
  }
  if (!frontFile.value || !backFile.value) {
    showToast('请重新选择身份证照片')
    return
  }
  try {
    isLoading.value = true
    console.log('上传文件', frontFile.value, backFile.value)

    // 使用Promise.all同时上传两个文件
    const [res1, res2] = await Promise.all([
      fileUpload({ file: frontFile.value }),
      fileUpload({ file: backFile.value }),
    ])

    const res = await ocrIdCard({
      frontImageUrl: res1.data.url,
      backImageUrl: res2.data.url,
    })
    console.log('res', res)
    if (res.code === 0) {
      // 存储身份证信息到store和localStorage
      if (res.data && res.data.name && res.data.idNumber) {
        // 存储到store
        userStore.setName(res.data.name)
        userStore.setIdCard(res.data.idNumber)
        
        // 存储到localStorage
        localStorage.setItem('userName', res.data.name)
        localStorage.setItem('userIdCard', res.data.idNumber)
      }
      
      // 接下来的步骤:进入支付页面
      router.push('/pay')
    }
    else {
      showToast(res.msg)
    }
  }
  catch {
    showToast('上传失败，请重试')
  }
  finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="id-card-upload">
    <!-- 页面标题 -->
    <div class="title-section">
      <h1 class="bg-gradient-to-r text-2xl text-transparent font-bold mb-8 text-center from-blue-500 to-cyan-500 bg-clip-text">
        身份证信息上传
      </h1>
    </div>

    <!-- 上传区域容器 -->
    <div class="upload-container">
      <!-- 正面上传 -->
      <div class="upload-box" :class="{ 'has-image': frontImage }" @click="handleUpload('front')">
        <div v-if="!frontImage" class="upload-content">
          <van-icon name="photograph" class="upload-icon" />
          <p class="upload-text">
            点击上传身份证正面
          </p>
          <p class="upload-desc">
            请确保证件清晰完整
          </p>
        </div>
        <img v-else :src="frontImage" class="preview-image" alt="身份证正面">
        <div v-if="frontImage" class="upload-mask">
          <van-icon name="replay" class="reupload-icon" />
          <span>重新上传</span>
        </div>
      </div>

      <!-- 反面上传 -->
      <div class="upload-box" :class="{ 'has-image': backImage }" @click="handleUpload('back')">
        <div v-if="!backImage" class="upload-content">
          <van-icon name="photograph" class="upload-icon" />
          <p class="upload-text">
            点击上传身份证反面
          </p>
          <p class="upload-desc">
            请确保证件清晰完整
          </p>
        </div>
        <img v-else :src="backImage" class="preview-image" alt="身份证反面">
        <div v-if="backImage" class="upload-mask">
          <van-icon name="replay" class="reupload-icon" />
          <span>重新上传</span>
        </div>
      </div>
    </div>

    <!-- 提交按钮 -->
    <div class="submit-section">
      <van-button
        type="primary"
        block
        :disabled="!isComplete"
        class="submit-btn"
        :loading="isLoading"
        loading-text="提交中..."
        @click="handleSubmit"
      >
        确认提交
      </van-button>
    </div>

    <!-- 隐藏的文件输入框 -->
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      style="display: none"
      @change="onFileChange"
    >
  </div>
</template>

<style scoped>
.id-card-upload {
  padding: 20px;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.upload-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 30px;
}

.upload-box {
  position: relative;
  width: 100%;
  height: 200px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.upload-box:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.upload-icon {
  font-size: 40px;
  color: #4a90e2;
  margin-bottom: 12px;
}

.upload-text {
  font-size: 16px;
  color: #333;
  margin-bottom: 8px;
}

.upload-desc {
  font-size: 12px;
  color: #666;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.has-image:hover .upload-mask {
  opacity: 1;
}

.reupload-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.submit-btn {
  height: 44px;
  font-size: 16px;
  border-radius: 22px;
  background: linear-gradient(45deg, #4a90e2, #63b3ed);
  border: none;
}

.submit-btn:not(:disabled) {
  background: linear-gradient(45deg, #4a90e2, #63b3ed);
}

.submit-btn:disabled {
  opacity: 0.6;
  background: #ccc;
}
</style>
