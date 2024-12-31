<template>
  <div>
    <textarea v-model="jsonInput" placeholder="请输入JSON字符串"></textarea>
    <button @click="formatJsonString">格式化</button>
    <pre>{{ formattedJson }}</pre>
  </div>
</template>

<script>
import { ref, inject } from 'vue'

export default {
  name: 'HelloWorld',
  setup() {
    const jsonInput = ref('')
    const formattedJson = ref('')
    const formatJson = inject('formatJson')

    const formatJsonString = () => {
      formattedJson.value = formatJson(jsonInput.value)
    }

    return {
      jsonInput,
      formattedJson,
      formatJsonString
    }
  }
}
</script>

<style scoped>
textarea {
  width: 100%;
  min-height: 100px;
  margin-bottom: 10px;
}
pre {
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
