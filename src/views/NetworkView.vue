<template>
  <div class="network-tools">
    <el-card class="tools-card">
      <template #header>
        <div class="page-header">
          <h2>网络工具</h2>
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
            <!-- Ping工具 -->
            <template v-if="currentTab === 'ping'">
              <div class="tool-section">
                <div class="input-area">
                  <el-input
                    v-model="host"
                    placeholder="输入主机名或IP地址"
                  >
                    <template #append>
                      <el-button 
                        type="primary"
                        @click="startPing"
                        :loading="isPinging"
                      >
                        Ping
                      </el-button>
                    </template>
                  </el-input>
                </div>
                <div class="result-area" v-if="pingResults.length">
                  <div class="result-header">
                    <span>Ping结果</span>
                    <el-button link @click="clearResults">清空</el-button>
                  </div>
                  <div class="result-list">
                    <div 
                      v-for="(result, index) in pingResults"
                      :key="index"
                      class="result-item"
                    >
                      <span class="timestamp">{{ result.time }}</span>
                      <span 
                        :class="['status', result.success ? 'success' : 'error']"
                      >
                        {{ result.message }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </template>

            <!-- DNS查询 -->
            <template v-if="currentTab === 'dns'">
              <div class="tool-section">
                <div class="input-area">
                  <el-input
                    v-model="domain"
                    placeholder="输入域名"
                  >
                    <template #append>
                      <el-button 
                        type="primary"
                        @click="queryDns"
                        :loading="isQuerying"
                      >
                        查询
                      </el-button>
                    </template>
                  </el-input>
                </div>
                <div class="result-area" v-if="dnsResults">
                  <div class="dns-records">
                    <div class="record-group" v-if="dnsResults.a">
                      <div class="record-type">A记录</div>
                      <div class="record-list">
                        <div 
                          v-for="(record, index) in dnsResults.a"
                          :key="'a-' + index"
                          class="record-item"
                        >
                          {{ record }}
                        </div>
                      </div>
                    </div>
                    <div class="record-group" v-if="dnsResults.aaaa">
                      <div class="record-type">AAAA记录</div>
                      <div class="record-list">
                        <div 
                          v-for="(record, index) in dnsResults.aaaa"
                          :key="'aaaa-' + index"
                          class="record-item"
                        >
                          {{ record }}
                        </div>
                      </div>
                    </div>
                    <div class="record-group" v-if="dnsResults.mx">
                      <div class="record-type">MX记录</div>
                      <div class="record-list">
                        <div 
                          v-for="(record, index) in dnsResults.mx"
                          :key="'mx-' + index"
                          class="record-item"
                        >
                          {{ record }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>

            <!-- 端口扫描 -->
            <template v-if="currentTab === 'port'">
              <div class="tool-section">
                <div class="input-area">
                  <el-form :model="portScanForm" label-width="100px">
                    <el-form-item label="主机">
                      <el-input v-model="portScanForm.host" placeholder="输入主机名或IP地址" />
                    </el-form-item>
                    <el-form-item label="端口范围">
                      <el-input-number v-model="portScanForm.startPort" :min="1" :max="65535" />
                      <span class="port-separator">至</span>
                      <el-input-number v-model="portScanForm.endPort" :min="1" :max="65535" />
                    </el-form-item>
                    <el-form-item>
                      <el-button 
                        type="primary"
                        @click="startPortScan"
                        :loading="isScanning"
                      >
                        开始扫描
                      </el-button>
                    </el-form-item>
                  </el-form>
                </div>
                <div class="result-area" v-if="portResults.length">
                  <div class="result-header">
                    <span>扫描结果</span>
                    <el-button link @click="clearPortResults">清空</el-button>
                  </div>
                  <el-table :data="portResults" style="width: 100%">
                    <el-table-column prop="port" label="端口" width="100" />
                    <el-table-column prop="status" label="状态">
                      <template #default="scope">
                        <el-tag
                          :type="scope.row.status === 'open' ? 'success' : 'danger'"
                        >
                          {{ scope.row.status }}
                        </el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column prop="service" label="可能的服务" />
                  </el-table>
                </div>
              </div>
            </template>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const currentTab = ref('ping')
const host = ref('')
const domain = ref('')
const isPinging = ref(false)
const isQuerying = ref(false)
const isScanning = ref(false)
const pingResults = ref([])
const dnsResults = ref(null)
const portResults = ref([])

const tabs = [
  { type: 'ping', name: 'Ping' },
  { type: 'dns', name: 'DNS查询' },
  { type: 'port', name: '端口扫描' }
]

const portScanForm = ref({
  host: '',
  startPort: 1,
  endPort: 100
})

// Ping功能
const startPing = async () => {
  if (!host.value) {
    ElMessage.warning('请输入主机名或IP地址')
    return
  }

  isPinging.value = true
  try {
    // 这里是模拟的Ping操作
    await new Promise(resolve => setTimeout(resolve, 1000))
    const time = new Date().toLocaleTimeString()
    const success = Math.random() > 0.2 // 模拟80%的成功率
    pingResults.value.unshift({
      time,
      success,
      message: success ? 'Reply from ' + host.value + ': time<1ms' : 'Request timed out'
    })
  } catch (err) {
    ElMessage.error('Ping失败')
  } finally {
    isPinging.value = false
  }
}

const clearResults = () => {
  pingResults.value = []
}

// DNS查询功能
const queryDns = async () => {
  if (!domain.value) {
    ElMessage.warning('请输入域名')
    return
  }

  isQuerying.value = true
  try {
    // 这里是模拟的DNS查询操作
    await new Promise(resolve => setTimeout(resolve, 1000))
    dnsResults.value = {
      a: ['192.168.1.1', '192.168.1.2'],
      aaaa: ['2001:db8::1'],
      mx: ['mail.example.com']
    }
  } catch (err) {
    ElMessage.error('DNS查询失败')
  } finally {
    isQuerying.value = false
  }
}

// 端口扫描功能
const startPortScan = async () => {
  if (!portScanForm.value.host) {
    ElMessage.warning('请输入主机名或IP地址')
    return
  }

  if (portScanForm.value.endPort < portScanForm.value.startPort) {
    ElMessage.warning('结束端口必须大于等于起始端口')
    return
  }

  isScanning.value = true
  try {
    // 这里是模拟的端口扫描操作
    await new Promise(resolve => setTimeout(resolve, 2000))
    portResults.value = [
      { port: 80, status: 'open', service: 'HTTP' },
      { port: 443, status: 'open', service: 'HTTPS' },
      { port: 22, status: 'closed', service: 'SSH' }
    ]
  } catch (err) {
    ElMessage.error('端口扫描失败')
  } finally {
    isScanning.value = false
  }
}

const clearPortResults = () => {
  portResults.value = []
}
</script>

<style scoped>
.network-tools {
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

.tool-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-area {
  max-width: 800px;
  margin: 0 auto;
}

.result-area {
  margin-top: 20px;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.result-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.result-item {
  display: flex;
  gap: 20px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 4px;
}

.timestamp {
  color: #909399;
  font-family: monospace;
}

.status {
  font-family: monospace;
}

.status.success {
  color: #67c23a;
}

.status.error {
  color: #f56c6c;
}

.dns-records {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.record-group {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 4px;
}

.record-type {
  font-weight: bold;
  margin-bottom: 10px;
  color: #409eff;
}

.record-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.record-item {
  font-family: monospace;
  padding: 5px 10px;
  background: white;
  border-radius: 3px;
}

.port-separator {
  margin: 0 10px;
}

:deep(.el-form-item__content) {
  flex-wrap: nowrap;
}
</style> 