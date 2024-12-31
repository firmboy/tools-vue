<template>
  <div class="code-formatter">
    <el-card class="formatter-card">
      <template #header>
        <div class="page-header">
          <h2>代码格式化工具</h2>
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

      <div class="formatter-content">
        <JsonFormatter v-if="currentTab === 'json'" />
        <el-empty
          v-else
          :description="`${tabs.find(t => t.type === currentTab).name}格式化工具即将推出`"
        >
          <template #image>
            <el-icon :size="50" color="#909399"><Clock /></el-icon>
          </template>
        </el-empty>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Clock } from '@element-plus/icons-vue'
import JsonFormatter from '@/components/JsonFormatter.vue'

const currentTab = ref('json')
const tabs = [
  { type: 'json', name: 'JSON' },
  { type: 'html', name: 'HTML' },
  { type: 'css', name: 'CSS' },
  { type: 'js', name: 'JavaScript' }
]
</script>

<style scoped>
.code-formatter {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.formatter-card {
  min-height: calc(100vh - 100px);
}

.page-header h2 {
  color: #2c3e50;
  margin: 0 0 20px 0;
}

:deep(.el-card__body) {
  padding: 0;
}

.formatter-content {
  height: 100%;
}
</style> 