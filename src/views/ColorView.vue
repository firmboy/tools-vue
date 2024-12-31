<template>
  <div class="color-tools">
    <el-card class="tools-card">
      <template #header>
        <div class="page-header">
          <h2>颜色工具</h2>
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
            <div class="color-section">
              <!-- 颜色选择器 -->
              <template v-if="currentTab === 'picker'">
                <div class="picker-container">
                  <div class="color-preview" :style="{ backgroundColor: colorValue }">
                    <div class="color-value">{{ colorValue.toUpperCase() }}</div>
                  </div>
                  <el-color-picker
                    v-model="colorValue"
                    show-alpha
                    @change="handleColorChange"
                  />
                  <div class="color-formats">
                    <div class="format-item">
                      <span class="label">HEX:</span>
                      <el-input v-model="hexColor" readonly>
                        <template #append>
                          <el-button @click="copyColor('hex')">复制</el-button>
                        </template>
                      </el-input>
                    </div>
                    <div class="format-item">
                      <span class="label">RGB:</span>
                      <el-input v-model="rgbColor" readonly>
                        <template #append>
                          <el-button @click="copyColor('rgb')">复制</el-button>
                        </template>
                      </el-input>
                    </div>
                    <div class="format-item">
                      <span class="label">HSL:</span>
                      <el-input v-model="hslColor" readonly>
                        <template #append>
                          <el-button @click="copyColor('hsl')">复制</el-button>
                        </template>
                      </el-input>
                    </div>
                  </div>
                </div>
              </template>

              <!-- 调色板 -->
              <template v-if="currentTab === 'palette'">
                <div class="palette-container">
                  <div class="base-color">
                    <span class="section-title">基础颜色</span>
                    <el-color-picker
                      v-model="baseColor"
                      show-alpha
                      @change="generatePalette"
                    />
                  </div>
                  <div class="color-schemes">
                    <div class="scheme-group">
                      <div class="scheme-title">单色方案</div>
                      <div class="color-list">
                        <div
                          v-for="(color, index) in monochromatic"
                          :key="'mono-' + index"
                          class="color-item"
                          :style="{ backgroundColor: color }"
                          @click="copyColorValue(color)"
                        >
                          <span class="color-text">{{ color }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="scheme-group">
                      <div class="scheme-title">互补色方案</div>
                      <div class="color-list">
                        <div
                          v-for="(color, index) in complementary"
                          :key="'comp-' + index"
                          class="color-item"
                          :style="{ backgroundColor: color }"
                          @click="copyColorValue(color)"
                        >
                          <span class="color-text">{{ color }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>

              <!-- 颜色转换 -->
              <template v-if="currentTab === 'convert'">
                <div class="converter-container">
                  <div class="input-section">
                    <el-input
                      v-model="inputColor"
                      placeholder="输入颜色值 (例如: #FF0000, rgb(255,0,0), red)"
                    >
                      <template #append>
                        <el-button @click="convertColor">转换</el-button>
                      </template>
                    </el-input>
                  </div>
                  <div class="conversion-results" v-if="conversionResults">
                    <div class="result-preview" :style="{ backgroundColor: inputColor }"></div>
                    <div class="result-list">
                      <div class="result-item" v-for="(value, format) in conversionResults" :key="format">
                        <span class="format-label">{{ format }}:</span>
                        <el-input
                          v-model="conversionResults[format]"
                          readonly
                        >
                          <template #append>
                            <el-button @click="copyConversion(format)">复制</el-button>
                          </template>
                        </el-input>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import Color from 'color'

const currentTab = ref('picker')
const colorValue = ref('#409EFF')
const baseColor = ref('#409EFF')
const inputColor = ref('')
const conversionResults = ref(null)

const tabs = [
  { type: 'picker', name: '颜色选择器' },
  { type: 'palette', name: '调色板' },
  { type: 'convert', name: '颜色转换' }
]

// 颜色选择器相关计算属性
const hexColor = computed(() => colorValue.value)
const rgbColor = computed(() => {
  const color = Color(colorValue.value)
  return color.rgb().string()
})
const hslColor = computed(() => {
  const color = Color(colorValue.value)
  return color.hsl().string()
})

// 调色板相关数据
const monochromatic = ref([])
const complementary = ref([])

// 处理颜色变化
const handleColorChange = (value) => {
  colorValue.value = value
}

// 生成调色板
const generatePalette = () => {
  const color = Color(baseColor.value)
  
  // 生成单色方案
  monochromatic.value = [
    color.lighten(0.4).hex(),
    color.lighten(0.2).hex(),
    color.hex(),
    color.darken(0.2).hex(),
    color.darken(0.4).hex()
  ]
  
  // 生成互补色方案
  complementary.value = [
    color.hex(),
    color.rotate(180).hex(),
    color.rotate(180).lighten(0.2).hex(),
    color.rotate(180).darken(0.2).hex()
  ]
}

// 复制颜色值
const copyColor = async (type) => {
  let value = ''
  switch (type) {
    case 'hex':
      value = hexColor.value
      break
    case 'rgb':
      value = rgbColor.value
      break
    case 'hsl':
      value = hslColor.value
      break
  }
  
  try {
    await navigator.clipboard.writeText(value)
    ElMessage.success('颜色值已复制')
  } catch (err) {
    ElMessage.error('复制失败')
  }
}

const copyColorValue = async (color) => {
  try {
    await navigator.clipboard.writeText(color)
    ElMessage.success('颜色值已复制')
  } catch (err) {
    ElMessage.error('复制失败')
  }
}

// 转换颜色
const convertColor = () => {
  try {
    const color = Color(inputColor.value)
    conversionResults.value = {
      HEX: color.hex(),
      RGB: color.rgb().string(),
      HSL: color.hsl().string(),
      HSV: color.hsv().string()
    }
  } catch (err) {
    ElMessage.error('无效的颜色值')
  }
}

const copyConversion = async (format) => {
  try {
    await navigator.clipboard.writeText(conversionResults.value[format])
    ElMessage.success('颜色值已复制')
  } catch (err) {
    ElMessage.error('复制失败')
  }
}

// 初始化调色板
generatePalette()
</script>

<style scoped>
.color-tools {
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

/* 颜色选择器样式 */
.picker-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
}

.color-preview {
  width: 200px;
  height: 200px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.color-value {
  background: rgba(255, 255, 255, 0.9);
  padding: 8px 16px;
  border-radius: 4px;
  font-family: monospace;
}

.color-formats {
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.format-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.label {
  width: 50px;
  color: #606266;
}

/* 调色板样式 */
.palette-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.base-color {
  display: flex;
  align-items: center;
  gap: 20px;
}

.section-title {
  font-size: 16px;
  color: #606266;
}

.color-schemes {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.scheme-group {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.scheme-title {
  font-size: 16px;
  color: #606266;
}

.color-list {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.color-item {
  width: 120px;
  height: 80px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s;
}

.color-item:hover {
  transform: scale(1.05);
}

.color-text {
  background: rgba(255, 255, 255, 0.9);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-family: monospace;
}

/* 颜色转换样式 */
.converter-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.conversion-results {
  display: flex;
  gap: 20px;
}

.result-preview {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  flex-shrink: 0;
}

.result-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.format-label {
  width: 50px;
  color: #606266;
}

@media (max-width: 768px) {
  .conversion-results {
    flex-direction: column;
  }
  
  .result-preview {
    width: 100%;
    height: 100px;
  }
}
</style> 