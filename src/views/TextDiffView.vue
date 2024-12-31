<template>
  <div class="text-diff">
    <el-card class="diff-card">
      <template #header>
        <div class="page-header">
          <h2>文本对比工具</h2>
        </div>
      </template>

      <div class="diff-content">
        <el-row :gutter="20">
          <el-col :span="24">
            <div class="input-area">
              <div class="text-inputs">
                <div class="input-group">
                  <div class="group-header">
                    <span>原始文本</span>
                    <el-button 
                      type="primary" 
                      link 
                      @click="clearText('old')"
                    >
                      清空
                    </el-button>
                  </div>
                  <el-input
                    v-model="oldText"
                    type="textarea"
                    :rows="12"
                    placeholder="输入原始文本"
                    resize="none"
                  />
                </div>

                <div class="input-group">
                  <div class="group-header">
                    <span>新文本</span>
                    <el-button 
                      type="primary" 
                      link 
                      @click="clearText('new')"
                    >
                      清空
                    </el-button>
                  </div>
                  <el-input
                    v-model="newText"
                    type="textarea"
                    :rows="12"
                    placeholder="输入新文本"
                    resize="none"
                  />
                </div>
              </div>

              <div class="options">
                <el-radio-group v-model="diffMode">
                  <el-radio-button label="chars">字符对比</el-radio-button>
                  <el-radio-button label="words">单词对比</el-radio-button>
                  <el-radio-button label="lines">行对比</el-radio-button>
                </el-radio-group>

                <el-button 
                  type="primary"
                  @click="generateDiff"
                  :icon="Document"
                >
                  生成对比
                </el-button>
              </div>
            </div>

            <div class="diff-result" v-if="diffHtml">
              <div class="result-header">
                <h3>对比结果</h3>
                <div class="legend">
                  <span class="legend-item">
                    <span class="color-block added"></span>
                    <span>新增</span>
                  </span>
                  <span class="legend-item">
                    <span class="color-block removed"></span>
                    <span>删除</span>
                  </span>
                </div>
              </div>
              <div class="diff-html" v-html="diffHtml"></div>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Document } from '@element-plus/icons-vue'
import * as Diff from 'diff'
import { ElMessage } from 'element-plus'

const oldText = ref('')
const newText = ref('')
const diffMode = ref('chars')
const diffHtml = ref('')

const clearText = (type) => {
  if (type === 'old') {
    oldText.value = ''
  } else {
    newText.value = ''
  }
}

const generateDiff = () => {
  if (!oldText.value && !newText.value) {
    ElMessage.warning('请输入需要对比的文本')
    return
  }

  let diff
  switch (diffMode.value) {
    case 'chars':
      diff = Diff.diffChars(oldText.value, newText.value)
      break
    case 'words':
      diff = Diff.diffWords(oldText.value, newText.value)
      break
    case 'lines':
      diff = Diff.diffLines(oldText.value, newText.value)
      break
  }

  let html = ''
  diff.forEach((part) => {
    const color = part.added ? 'added' : part.removed ? 'removed' : 'normal'
    const value = part.value.replace(/\n/g, '↵\n')
    html += `<span class="${color}">${value}</span>`
  })

  diffHtml.value = html
}
</script>

<style scoped>
.text-diff {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.diff-card {
  min-height: calc(100vh - 100px);
}

.page-header h2 {
  color: #2c3e50;
  margin: 0;
}

.diff-content {
  padding: 20px;
}

.input-area {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.text-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #606266;
}

.options {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.diff-result {
  margin-top: 30px;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.result-header h3 {
  margin: 0;
  color: #2c3e50;
}

.legend {
  display: flex;
  gap: 20px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #606266;
}

.color-block {
  width: 16px;
  height: 16px;
  border-radius: 3px;
}

.color-block.added {
  background-color: #e6f6e6;
}

.color-block.removed {
  background-color: #ffe6e6;
}

.diff-html {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 4px;
  font-family: monospace;
  white-space: pre-wrap;
  line-height: 1.5;
}

:deep(.added) {
  background-color: #e6f6e6;
  color: #18a058;
}

:deep(.removed) {
  background-color: #ffe6e6;
  color: #d03050;
}

:deep(.normal) {
  color: #2c3e50;
}

@media (max-width: 768px) {
  .text-inputs {
    grid-template-columns: 1fr;
  }
}
</style> 