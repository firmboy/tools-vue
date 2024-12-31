<template>
  <div class="regex">
    <el-card class="regex-card">
      <template #header>
        <div class="page-header">
          <h2>正则表达式测试工具</h2>
        </div>
      </template>

      <div class="regex-content">
        <el-row :gutter="20">
          <el-col :span="24">
            <div class="regex-input">
              <div class="input-group">
                <div class="group-header">
                  <span>正则表达式</span>
                  <el-tooltip content="正则表达式语法帮助" placement="top">
                    <el-link 
                      type="primary" 
                      href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Regular_Expressions" 
                      target="_blank"
                    >
                      <el-icon><QuestionFilled /></el-icon>
                    </el-link>
                  </el-tooltip>
                </div>
                <el-input
                  v-model="pattern"
                  placeholder="输入正则表达式，如：\d+"
                >
                  <template #prepend>/</template>
                  <template #append>/{{ flags }}</template>
                </el-input>
                <div class="flags">
                  <el-checkbox-group v-model="flagsList">
                    <el-checkbox label="g">全局匹配(g)</el-checkbox>
                    <el-checkbox label="i">忽略大小写(i)</el-checkbox>
                    <el-checkbox label="m">多行匹配(m)</el-checkbox>
                  </el-checkbox-group>
                </div>
              </div>

              <div class="input-group">
                <div class="group-header">
                  <span>测试文本</span>
                  <el-button 
                    type="primary" 
                    link 
                    @click="clearText"
                  >
                    清空
                  </el-button>
                </div>
                <el-input
                  v-model="testText"
                  type="textarea"
                  :rows="8"
                  placeholder="输入需要测试的文本"
                  resize="none"
                />
              </div>
            </div>

            <div class="match-results" v-if="testText">
              <div class="result-header">
                <h3>匹配结果</h3>
                <div class="result-info">
                  找到 {{ matches.length }} 个匹配
                </div>
              </div>

              <template v-if="isValidRegex">
                <div v-if="matches.length" class="matches-list">
                  <div 
                    v-for="(match, index) in matches" 
                    :key="index"
                    class="match-item"
                  >
                    <div class="match-index">#{{ index + 1 }}</div>
                    <div class="match-content">
                      <div class="full-match">
                        <span class="label">完整匹配：</span>
                        <span class="value">{{ match[0] }}</span>
                      </div>
                      <template v-if="match.length > 1">
                        <div 
                          v-for="(group, groupIndex) in match.slice(1)" 
                          :key="groupIndex"
                          class="group-match"
                        >
                          <span class="label">分组{{ groupIndex + 1 }}：</span>
                          <span class="value">{{ group }}</span>
                        </div>
                      </template>
                      <div class="match-position">
                        <span class="label">位置：</span>
                        <span class="value">{{ match.index }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <el-empty v-else description="没有找到匹配项" />
              </template>
              <el-alert
                v-else
                :title="regexError"
                type="error"
                show-icon
              />
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { QuestionFilled } from '@element-plus/icons-vue'

const pattern = ref('')
const flagsList = ref(['g'])
const testText = ref('')
const regexError = ref('')

const flags = computed(() => flagsList.value.join(''))

// 将副作用移到 watch 中
watch([pattern, flagsList], () => {
  try {
    if (pattern.value) {
      new RegExp(pattern.value, flags.value)
      regexError.value = ''
    }
  } catch (err) {
    regexError.value = err.message
  }
})

const isValidRegex = computed(() => {
  if (!pattern.value) return false
  try {
    new RegExp(pattern.value, flags.value)
    return true
  } catch (err) {
    return false
  }
})

const matches = computed(() => {
  if (!isValidRegex.value || !testText.value) return []
  
  const regex = new RegExp(pattern.value, flags.value)
  const results = []
  let match

  if (flags.value.includes('g')) {
    while ((match = regex.exec(testText.value)) !== null) {
      results.push({
        ...match,
        index: match.index
      })
    }
  } else {
    match = regex.exec(testText.value)
    if (match) {
      results.push({
        ...match,
        index: match.index
      })
    }
  }

  return results
})

const clearText = () => {
  testText.value = ''
}
</script>

<style scoped>
.regex {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.regex-card {
  min-height: calc(100vh - 100px);
}

.page-header h2 {
  color: #2c3e50;
  margin: 0;
}

.regex-content {
  padding: 20px;
}

.regex-input {
  display: flex;
  flex-direction: column;
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

.flags {
  margin-top: 10px;
}

.match-results {
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

.result-info {
  color: #909399;
}

.matches-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.match-item {
  display: flex;
  gap: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 4px;
}

.match-index {
  font-weight: bold;
  color: #409eff;
  min-width: 40px;
}

.match-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.full-match, .group-match, .match-position {
  display: flex;
  gap: 10px;
}

.label {
  color: #606266;
  min-width: 80px;
}

.value {
  color: #2c3e50;
  font-family: monospace;
  background: #fff;
  padding: 2px 6px;
  border-radius: 3px;
  border: 1px solid #dcdfe6;
}

:deep(.el-input-group__prepend),
:deep(.el-input-group__append) {
  background-color: #409eff;
  color: white;
  font-family: monospace;
}
</style> 