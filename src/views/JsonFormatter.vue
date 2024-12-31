<template>
  <div class="json-formatter">
    <h2 class="title">JSON格式化工具</h2>
    <div class="formatter-container">
      <div class="input-section">
        <div class="section-header">
          <h3>输入JSON</h3>
          <div class="buttons">
            <button class="btn" @click="formatJsonString">格式化</button>
            <button class="btn" @click="clearInput">清空</button>
          </div>
        </div>
        <textarea 
          v-model="jsonInput" 
          placeholder="请在此输入需要格式化的JSON字符串..."
          class="json-input"
        ></textarea>
      </div>
      
      <div class="output-section">
        <div class="section-header">
          <h3>格式化结果</h3>
          <button class="btn" @click="copyToClipboard" v-if="formattedJson">复制</button>
        </div>
        <pre class="json-output" v-if="formattedJson">{{ formattedJson }}</pre>
        <div class="empty-state" v-else>格式化后的JSON将显示在这里</div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, inject } from 'vue'

export default {
  name: 'JsonFormatter',
  setup() {
    const jsonInput = ref('')
    const formattedJson = ref('')
    const formatJson = inject('formatJson')

    const formatJsonString = () => {
      if (!jsonInput.value.trim()) {
        alert('请输入JSON字符串')
        return
      }
      formattedJson.value = formatJson(jsonInput.value)
    }

    const clearInput = () => {
      jsonInput.value = ''
      formattedJson.value = ''
    }

    const copyToClipboard = async () => {
      try {
        await navigator.clipboard.writeText(formattedJson.value)
        alert('已复制到剪贴板')
      } catch (err) {
        alert('复制失败')
      }
    }

    return {
      jsonInput,
      formattedJson,
      formatJsonString,
      clearInput,
      copyToClipboard
    }
  }
}
</script>

<style scoped>
.json-formatter {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.title {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
}

.formatter-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  height: calc(100vh - 200px);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.section-header h3 {
  margin: 0;
  color: #2c3e50;
}

.buttons {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: #42b983;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn:hover {
  background-color: #3aa876;
}

.input-section, .output-section {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.json-input, .json-output {
  flex: 1;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-family: monospace;
  font-size: 14px;
  line-height: 1.5;
  overflow: auto;
}

.json-input {
  resize: none;
  background-color: #f8f9fa;
}

.json-output {
  background-color: #f8f9fa;
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.empty-state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 8px;
  color: #666;
}

@media (max-width: 768px) {
  .formatter-container {
    grid-template-columns: 1fr;
    height: auto;
  }
  
  .json-input, .json-output {
    height: 300px;
  }
}
</style> 