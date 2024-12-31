<template>
  <div class="crypto">
    <el-card class="crypto-card">
      <template #header>
        <div class="page-header">
          <h2>加密解密工具</h2>
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

      <div class="crypto-content">
        <el-row :gutter="20">
          <el-col :span="24">
            <div class="input-section">
              <el-input
                v-model="inputText"
                type="textarea"
                :rows="6"
                :placeholder="placeholder"
                resize="none"
              />
              
              <div class="options" v-if="currentTab === 'aes'">
                <el-input
                  v-model="aesKey"
                  placeholder="请输入密钥"
                  class="key-input"
                >
                  <template #prepend>密钥</template>
                </el-input>
                <el-select v-model="aesMode" placeholder="加密模式">
                  <el-option label="ECB" value="ECB" />
                  <el-option label="CBC" value="CBC" />
                </el-select>
              </div>

              <div class="action-buttons">
                <el-button-group v-if="showEncryptButtons">
                  <el-button 
                    type="primary" 
                    @click="encrypt"
                    :icon="Lock"
                  >
                    加密
                  </el-button>
                  <el-button 
                    type="success" 
                    @click="decrypt"
                    :icon="Unlock"
                  >
                    解密
                  </el-button>
                </el-button-group>
                <el-button 
                  v-else
                  type="primary" 
                  @click="hash"
                  :icon="Key"
                >
                  生成哈希
                </el-button>
                <el-button @click="clearAll" :icon="Delete">清空</el-button>
              </div>

              <el-input
                v-model="outputText"
                type="textarea"
                :rows="6"
                placeholder="结果将显示在这里"
                resize="none"
                readonly
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
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Lock, Unlock, Key, Delete, CopyDocument } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import CryptoJS from 'crypto-js'

const currentTab = ref('md5')
const inputText = ref('')
const outputText = ref('')
const aesKey = ref('')
const aesMode = ref('ECB')

const tabs = [
  { type: 'md5', name: 'MD5' },
  { type: 'sha1', name: 'SHA1' },
  { type: 'sha256', name: 'SHA256' },
  { type: 'aes', name: 'AES' }
]

const placeholder = computed(() => {
  const map = {
    md5: '请输入需要生成MD5的文本',
    sha1: '请输入需要生成SHA1的文本',
    sha256: '请输入需要生成SHA256的文本',
    aes: '请输入需要加密/解密的文本'
  }
  return map[currentTab.value]
})

const showEncryptButtons = computed(() => {
  return currentTab.value === 'aes'
})

const hash = () => {
  if (!inputText.value) {
    ElMessage.warning('请输入需要处理的文本')
    return
  }
  
  try {
    switch (currentTab.value) {
      case 'md5':
        outputText.value = CryptoJS.MD5(inputText.value).toString()
        break
      case 'sha1':
        outputText.value = CryptoJS.SHA1(inputText.value).toString()
        break
      case 'sha256':
        outputText.value = CryptoJS.SHA256(inputText.value).toString()
        break
    }
    ElMessage.success('哈希生成成功')
  } catch (err) {
    ElMessage.error('处理失败')
  }
}

const encrypt = () => {
  if (!inputText.value) {
    ElMessage.warning('请输入需要加密的文本')
    return
  }
  if (!aesKey.value) {
    ElMessage.warning('请输入加密密钥')
    return
  }

  try {
    const key = CryptoJS.enc.Utf8.parse(aesKey.value)
    let encrypted
    
    if (aesMode.value === 'ECB') {
      encrypted = CryptoJS.AES.encrypt(inputText.value, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      })
    } else {
      const iv = CryptoJS.enc.Utf8.parse(aesKey.value.slice(0, 16))
      encrypted = CryptoJS.AES.encrypt(inputText.value, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      })
    }
    
    outputText.value = encrypted.toString()
    ElMessage.success('加密成功')
  } catch (err) {
    ElMessage.error('加密失败')
  }
}

const decrypt = () => {
  if (!inputText.value) {
    ElMessage.warning('请输入需要解密的文本')
    return
  }
  if (!aesKey.value) {
    ElMessage.warning('请输入解密密钥')
    return
  }

  try {
    const key = CryptoJS.enc.Utf8.parse(aesKey.value)
    let decrypted
    
    if (aesMode.value === 'ECB') {
      decrypted = CryptoJS.AES.decrypt(inputText.value, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      })
    } else {
      const iv = CryptoJS.enc.Utf8.parse(aesKey.value.slice(0, 16))
      decrypted = CryptoJS.AES.decrypt(inputText.value, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      })
    }
    
    outputText.value = decrypted.toString(CryptoJS.enc.Utf8)
    ElMessage.success('解密成功')
  } catch (err) {
    ElMessage.error('解密失败')
  }
}

const clearAll = () => {
  inputText.value = ''
  outputText.value = ''
  if (currentTab.value === 'aes') {
    aesKey.value = ''
  }
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
.crypto {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.crypto-card {
  min-height: calc(100vh - 100px);
}

.page-header h2 {
  color: #2c3e50;
  margin: 0 0 20px 0;
}

.crypto-content {
  padding: 20px;
}

.input-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.options {
  display: flex;
  gap: 20px;
  align-items: center;
}

.key-input {
  flex: 1;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.result-actions {
  display: flex;
  justify-content: flex-end;
}

:deep(.el-textarea__inner) {
  font-family: monospace;
  font-size: 14px;
  line-height: 1.5;
}
</style> 