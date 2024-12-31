<template>
  <div class="json-formatter">
    <el-row :gutter="20" class="formatter-container">
      <el-col :span="12">
        <el-card class="input-card">
          <template #header>
            <div class="card-header">
              <span>输入JSON</span>
              <div class="buttons">
                <el-button type="primary" @click="formatJsonString" :icon="Document">
                  格式化
                </el-button>
                <el-button @click="clearInput" :icon="Delete">
                  清空
                </el-button>
              </div>
            </div>
          </template>
          <el-input
            v-model="jsonInput"
            type="textarea"
            :rows="15"
            placeholder="请在此输入需要格式化的JSON字符串..."
            resize="none"
          />
        </el-card>
      </el-col>
      
      <el-col :span="12">
        <el-card class="output-card">
          <template #header>
            <div class="card-header">
              <span>格式化结果</span>
              <el-button 
                v-if="formattedJson"
                @click="copyToClipboard"
                :icon="CopyDocument"
              >
                复制
              </el-button>
            </div>
          </template>
          <div v-if="formattedJson" class="json-output">
            <pre>{{ formattedJson }}</pre>
          </div>
          <el-empty
            v-else
            description="格式化后的JSON将显示在这里"
          />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'
import { Document, Delete, CopyDocument } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const jsonInput = ref('')
const formattedJson = ref('')
const formatJson = inject('formatJson')

const formatJsonString = () => {
  if (!jsonInput.value.trim()) {
    ElMessage.warning('请输入JSON字符串')
    return
  }
  try {
    formattedJson.value = formatJson(jsonInput.value)
    ElMessage.success('格式化成功')
  } catch (err) {
    ElMessage.error('JSON格式化失败')
  }
}

const clearInput = () => {
  jsonInput.value = ''
  formattedJson.value = ''
  ElMessage.success('已清空')
}

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(formattedJson.value)
    ElMessage.success('已复制到剪贴板')
  } catch (err) {
    ElMessage.error('复制失败')
  }
}
</script>

<style scoped>
.json-formatter {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.buttons {
  display: flex;
  gap: 10px;
}

.json-output {
  height: 100%;
  overflow: auto;
}

.json-output pre {
  margin: 0;
  padding: 0;
  font-family: monospace;
  font-size: 14px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-wrap: break-word;
}

:deep(.el-card__body) {
  height: calc(100% - 60px);
  padding: 15px;
}

.input-card, .output-card {
  height: 100%;
}

:deep(.el-textarea__inner) {
  font-family: monospace;
  font-size: 14px;
  line-height: 1.5;
}
</style> 