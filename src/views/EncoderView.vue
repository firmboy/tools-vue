<template>
  <div class="encoder">
    <el-card class="encoder-card">
      <template #header>
        <div class="page-header">
          <h2>编码转换工具</h2>
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

      <div class="encoder-content">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-input
              v-model="inputText"
              type="textarea"
              :rows="6"
              :placeholder="placeholder"
              resize="none"
            />
            
            <div class="action-buttons">
              <el-button-group>
                <el-button 
                  type="primary" 
                  @click="encode"
                  :icon="ArrowDown"
                >
                  编码
                </el-button>
                <el-button 
                  type="success" 
                  @click="decode"
                  :icon="ArrowUp"
                >
                  解码
                </el-button>
              </el-button-group>
              <el-button @click="clearAll" :icon="Delete">清空</el-button>
            </div>

            <el-input
              v-model="outputText"
              type="textarea"
              :rows="6"
              placeholder="转换结果将显示在这里"
              resize="none"
            />
            
            <div class="result-actions" v-if="outputText">
              <el-button 
                type="primary" 
                @click="copyResult" 
                :icon="CopyDocument"
              >
                复制结果
              </el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ArrowDown, ArrowUp, Delete, CopyDocument } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const currentTab = ref('base64')
const inputText = ref('')
const outputText = ref('')

const tabs = [
  { type: 'base64', name: 'Base64' },
  { type: 'url', name: 'URL编码' },
  { type: 'unicode', name: 'Unicode' }
]

const placeholder = computed(() => {
  const map = {
    base64: '请输入需要进行Base64编码/解码的文本',
    url: '请输入需要进行URL编码/解码的文本',
    unicode: '请输入需要进行Unicode编码/解码的文本'
  }
  return map[currentTab.value]
})

const encode = () => {
  if (!inputText.value) {
    ElMessage.warning('请输入需要编码的文本')
    return
  }
  
  try {
    switch (currentTab.value) {
      case 'base64':
        outputText.value = btoa(inputText.value)
        break
      case 'url':
        outputText.value = encodeURIComponent(inputText.value)
        break
      case 'unicode':
        outputText.value = inputText.value.split('').map(char => `\\u${char.charCodeAt(0).toString(16).padStart(4, '0')}`).join('')
        break
    }
    ElMessage.success('编码成功')
  } catch (err) {
    ElMessage.error('编码失败')
  }
}

const decode = () => {
  if (!inputText.value) {
    ElMessage.warning('请输入需要解码的文本')
    return
  }
  
  try {
    switch (currentTab.value) {
      case 'base64':
        outputText.value = atob(inputText.value)
        break
      case 'url':
        outputText.value = decodeURIComponent(inputText.value)
        break
      case 'unicode':
        outputText.value = inputText.value.replace(/\\u[\dA-F]{4}/gi, match => 
          String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16))
        )
        break
    }
    ElMessage.success('解码成功')
  } catch (err) {
    ElMessage.error('解码失败')
  }
}

const clearAll = () => {
  inputText.value = ''
  outputText.value = ''
  ElMessage.success('已清空')
}

const copyResult = async () => {
  try {
    await navigator.clipboard.writeText(outputText.value)
    ElMessage.success('已复制到剪贴板')
  } catch (err) {
    ElMessage.error('复制失败')
  }
}
</script>

<style scoped>
.encoder {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.encoder-card {
  min-height: calc(100vh - 100px);
}

.page-header h2 {
  color: #2c3e50;
  margin: 0 0 20px 0;
}

.encoder-content {
  padding: 20px;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 20px 0;
}

.result-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

:deep(.el-textarea__inner) {
  font-family: monospace;
  font-size: 14px;
  line-height: 1.5;
}
</style> 