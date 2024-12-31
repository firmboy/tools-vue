<template>
  <div class="image-tools">
    <el-card class="tools-card">
      <template #header>
        <div class="page-header">
          <h2>图片工具</h2>
          <el-tabs v-model="currentTab">
            <el-tab-pane
              v-for="tab in tabs"
              :key="tab.type"
              :label="tab.name"
              :name="tab.type"
            />
          </el-tabs>
        </div>
      </template>

      <div class="tools-content">
        <el-row :gutter="20">
          <el-col :span="24">
            <div class="upload-area">
              <el-upload
                class="image-uploader"
                :show-file-list="false"
                :before-upload="beforeUpload"
                :auto-upload="false"
                drag
              >
                <template #trigger>
                  <div class="trigger-area">
                    <el-icon class="upload-icon"><Upload /></el-icon>
                    <div class="upload-text">
                      将文件拖到此处，或<em>点击上传</em>
                    </div>
                    <div class="upload-tip">
                      支持 jpg、png、gif 格式
                    </div>
                  </div>
                </template>
              </el-upload>

              <div class="preview-area" v-if="imageUrl">
                <img :src="imageUrl" class="preview-image" />
                <div class="image-info" v-if="imageInfo">
                  <div class="info-item">
                    <span class="label">原始大小：</span>
                    <span>{{ formatSize(imageInfo.originalSize) }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">处理后大小：</span>
                    <span>{{ formatSize(imageInfo.processedSize) }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">尺寸：</span>
                    <span>{{ imageInfo.width }} x {{ imageInfo.height }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="options-area" v-if="imageUrl">
              <template v-if="currentTab === 'compress'">
                <div class="option-group">
                  <span class="option-label">压缩质量：</span>
                  <el-slider
                    v-model="compressQuality"
                    :min="10"
                    :max="100"
                    :step="10"
                    show-stops
                  />
                </div>
              </template>

              <template v-if="currentTab === 'convert'">
                <div class="option-group">
                  <span class="option-label">目标格式：</span>
                  <el-radio-group v-model="targetFormat">
                    <el-radio-button label="jpeg">JPEG</el-radio-button>
                    <el-radio-button label="png">PNG</el-radio-button>
                    <el-radio-button label="webp">WebP</el-radio-button>
                  </el-radio-group>
                </div>
              </template>

              <div class="action-buttons">
                <el-button 
                  type="primary"
                  @click="processImage"
                  :icon="Picture"
                >
                  {{ processButtonText }}
                </el-button>
                <el-button 
                  type="success" 
                  @click="downloadImage" 
                  :icon="Download"
                  v-if="processedImageUrl"
                >
                  下载
                </el-button>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Upload, Picture, Download } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const currentTab = ref('compress')
const imageUrl = ref('')
const processedImageUrl = ref('')
const compressQuality = ref(80)
const targetFormat = ref('jpeg')
const imageInfo = ref(null)

const tabs = [
  { type: 'compress', name: '图片压缩' },
  { type: 'convert', name: '格式转换' },
  { type: 'base64', name: 'Base64' }
]

const processButtonText = computed(() => {
  const map = {
    compress: '压缩图片',
    convert: '转换格式',
    base64: '生成Base64'
  }
  return map[currentTab.value]
})

const beforeUpload = (file) => {
  const isImage = /^image\/(jpeg|png|gif)$/.test(file.type)
  if (!isImage) {
    ElMessage.error('只能上传jpg/png/gif格式的图片！')
    return false
  }
  
  const isLt5M = file.size / 1024 / 1024 < 5
  if (!isLt5M) {
    ElMessage.error('图片大小不能超过 5MB！')
    return false
  }

  // 读取并显示图片
  const reader = new FileReader()
  reader.onload = (e) => {
    imageUrl.value = e.target.result
    // 获取图片信息
    const img = new Image()
    img.onload = () => {
      imageInfo.value = {
        originalSize: file.size,
        processedSize: file.size,
        width: img.width,
        height: img.height
      }
    }
    img.src = e.target.result
  }
  reader.readAsDataURL(file)
  
  return false // 阻止自动上传
}

const processImage = () => {
  if (!imageUrl.value) {
    ElMessage.warning('请先上传图片')
    return
  }

  const img = new Image()
  img.onload = () => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = img.width
    canvas.height = img.height

    ctx.drawImage(img, 0, 0)

    let mimeType = 'image/jpeg'
    let quality = compressQuality.value / 100

    if (currentTab.value === 'convert') {
      mimeType = `image/${targetFormat.value}`
      quality = 1
    } else if (currentTab.value === 'base64') {
      processedImageUrl.value = canvas.toDataURL(mimeType, quality)
      ElMessage.success('Base64生成成功')
      return
    }

    canvas.toBlob((blob) => {
      processedImageUrl.value = URL.createObjectURL(blob)
      imageInfo.value = {
        ...imageInfo.value,
        processedSize: blob.size
      }
      ElMessage.success('处理成功')
    }, mimeType, quality)
  }
  img.src = imageUrl.value
}

const downloadImage = () => {
  const link = document.createElement('a')
  link.download = `processed_image.${targetFormat.value || 'jpg'}`
  link.href = processedImageUrl.value
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const formatSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i]
}
</script>

<style scoped>
.image-tools {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.tools-card {
  min-height: calc(100vh - 100px);
}

.page-header h2 {
  color: #2c3e50;
  margin: 0 0 20px 0;
}

.tools-content {
  padding: 20px;
}

.upload-area {
  margin-bottom: 20px;
}

.image-uploader {
  width: 100%;
}

.trigger-area {
  padding: 40px 0;
  text-align: center;
}

.upload-icon {
  font-size: 48px;
  color: #909399;
  margin-bottom: 10px;
}

.upload-text {
  color: #606266;
  font-size: 14px;
  margin-bottom: 5px;
}

.upload-text em {
  color: #409eff;
  font-style: normal;
}

.upload-tip {
  color: #909399;
  font-size: 12px;
}

.preview-area {
  margin-top: 20px;
  text-align: center;
}

.preview-image {
  max-width: 100%;
  max-height: 400px;
  border-radius: 4px;
}

.image-info {
  margin-top: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 4px;
  text-align: left;
}

.info-item {
  margin: 5px 0;
  display: flex;
  align-items: center;
}

.info-item .label {
  color: #666;
  width: 100px;
}

.options-area {
  margin-top: 30px;
}

.option-group {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.option-label {
  width: 100px;
  color: #666;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
}

:deep(.el-upload-dragger) {
  width: 100%;
}

:deep(.el-slider) {
  flex: 1;
  margin-right: 40px;
}
</style> 