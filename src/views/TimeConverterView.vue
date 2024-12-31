<template>
  <div class="time-converter">
    <el-card class="converter-card">
      <template #header>
        <div class="page-header">
          <h2>时间转换工具</h2>
        </div>
      </template>

      <div class="converter-content">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-card class="tool-section">
              <template #header>
                <div class="section-header">
                  时间戳转日期
                </div>
              </template>
              
              <el-input
                v-model="timestamp"
                placeholder="请输入时间戳（毫秒）"
                clearable
              >
                <template #append>
                  <el-button @click="getCurrentTimestamp">
                    当前时间戳
                  </el-button>
                </template>
              </el-input>

              <div class="result-box" v-if="formattedDate">
                <div class="result-item">
                  <span class="label">标准格式：</span>
                  <span class="value">{{ formattedDate }}</span>
                </div>
                <div class="result-item">
                  <span class="label">UTC格式：</span>
                  <span class="value">{{ utcDate }}</span>
                </div>
                <div class="result-item">
                  <span class="label">相对时间：</span>
                  <span class="value">{{ relativeTimeStr }}</span>
                </div>
              </div>
            </el-card>
          </el-col>

          <el-col :span="12">
            <el-card class="tool-section">
              <template #header>
                <div class="section-header">
                  日期转时间戳
                </div>
              </template>
              
              <el-date-picker
                v-model="dateValue"
                type="datetime"
                placeholder="选择日期时间"
                style="width: 100%"
                @change="updateTimestampFromDate"
              />

              <div class="result-box" v-if="dateValue">
                <div class="result-item">
                  <span class="label">毫秒级时间戳：</span>
                  <span class="value">{{ millisTimestamp }}</span>
                </div>
                <div class="result-item">
                  <span class="label">秒级时间戳：</span>
                  <span class="value">{{ secondsTimestamp }}</span>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'
import relativeTimePlugin from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTimePlugin)
dayjs.locale('zh-cn')

const timestamp = ref('')
const dateValue = ref(null)

// 计算属性
const formattedDate = computed(() => {
  if (!timestamp.value) return ''
  try {
    return dayjs(Number(timestamp.value)).format('YYYY-MM-DD HH:mm:ss')
  } catch (err) {
    return ''
  }
})

const utcDate = computed(() => {
  if (!timestamp.value) return ''
  try {
    return dayjs(Number(timestamp.value)).utc().format('YYYY-MM-DD HH:mm:ss UTC')
  } catch (err) {
    return ''
  }
})

const relativeTimeStr = computed(() => {
  if (!timestamp.value) return ''
  try {
    return dayjs(Number(timestamp.value)).fromNow()
  } catch (err) {
    return ''
  }
})

const millisTimestamp = computed(() => {
  if (!dateValue.value) return ''
  return dateValue.value.getTime()
})

const secondsTimestamp = computed(() => {
  if (!dateValue.value) return ''
  return Math.floor(dateValue.value.getTime() / 1000)
})

// 方法
const getCurrentTimestamp = () => {
  timestamp.value = Date.now().toString()
}

const updateTimestampFromDate = () => {
  if (dateValue.value) {
    ElMessage.success('时间戳已更新')
  }
}

// 监听时间戳输入
watch(timestamp, (newVal) => {
  if (newVal && !/^\d+$/.test(newVal)) {
    ElMessage.warning('请输入有效的时间戳数字')
  }
})
</script>

<style scoped>
.time-converter {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.converter-card {
  min-height: calc(100vh - 100px);
}

.page-header h2 {
  color: #2c3e50;
  margin: 0;
}

.converter-content {
  padding: 20px;
}

.tool-section {
  margin-bottom: 20px;
}

.section-header {
  font-size: 16px;
  font-weight: bold;
  color: #2c3e50;
}

.result-box {
  margin-top: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 4px;
}

.result-item {
  margin: 10px 0;
  display: flex;
  align-items: center;
}

.label {
  color: #666;
  width: 120px;
  flex-shrink: 0;
}

.value {
  color: #2c3e50;
  font-family: monospace;
  word-break: break-all;
}
</style> 