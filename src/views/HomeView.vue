<template>
  <div class="home">
    <header class="header">
      <h1>程序员工具箱</h1>
      <p class="subtitle">提供各种实用的开发辅助工具，提升开发效率</p>
    </header>

    <div class="tools-container">
      <!-- 编码工具 -->
      <div class="tool-card" @click="$router.push('/encoder')">
        <div class="tool-icon">
          <i class="fas fa-exchange-alt"></i>
        </div>
        <h3>编码转换</h3>
        <p>Base64、URL编码、Unicode转换等</p>
        <div class="card-footer">
          <button class="try-btn">立即使用</button>
        </div>
      </div>

      <!-- 时间工具 -->
      <div class="tool-card" @click="$router.push('/time-converter')">
        <div class="tool-icon">
          <i class="fas fa-clock"></i>
        </div>
        <h3>时间转换</h3>
        <p>时间戳转换、日期计算工具</p>
        <div class="card-footer">
          <button class="try-btn">立即使用</button>
        </div>
      </div>

      <!-- 加密解密 -->
      <div class="tool-card" @click="$router.push('/crypto')">
        <div class="tool-icon">
          <i class="fas fa-lock"></i>
        </div>
        <h3>加密解密</h3>
        <p>MD5、SHA、AES等加密解密工具</p>
        <div class="card-footer">
          <button class="try-btn">立即使用</button>
        </div>
      </div>

      <!-- 图片处理 -->
      <div class="tool-card" @click="$router.push('/image-tools')">
        <div class="tool-icon">
          <i class="fas fa-image"></i>
        </div>
        <h3>图片工具</h3>
        <p>图片压缩、格式转换、Base64</p>
        <div class="card-footer">
          <button class="try-btn">立即使用</button>
        </div>
      </div>

      <!-- 代码格式化 -->
      <div class="tool-card" @click="$router.push('/code-formatter')">
        <div class="tool-icon">
          <i class="fas fa-code"></i>
        </div>
        <h3>代码格式化</h3>
        <p>HTML、CSS、JS、JSON等格式化工具</p>
        <div class="card-footer">
          <button class="try-btn">立即使用</button>
        </div>
      </div>

      <!-- 正则工具 -->
      <div class="tool-card" @click="$router.push('/regex')">
        <div class="tool-icon">
          <i class="fas fa-asterisk"></i>
        </div>
        <h3>正则测试</h3>
        <p>正则表达式在线测试工具</p>
        <div class="card-footer">
          <button class="try-btn">立即使用</button>
        </div>
      </div>

      <!-- 颜色工具 -->
      <div class="tool-card" @click="$router.push('/color')">
        <div class="tool-icon">
          <i class="fas fa-palette"></i>
        </div>
        <h3>颜色工具</h3>
        <p>颜色选择器、调色板、转换工具</p>
        <div class="card-footer">
          <button class="try-btn">立即使用</button>
        </div>
      </div>

      <!-- 网络工具 -->
      <div class="tool-card" @click="$router.push('/network')">
        <div class="tool-icon">
          <i class="fas fa-network-wired"></i>
        </div>
        <h3>网络工具</h3>
        <p>Ping、端口扫描、DNS查询等</p>
        <div class="card-footer">
          <button class="try-btn">立即使用</button>
        </div>
      </div>

      <!-- 文本对比 -->
      <div class="tool-card" @click="$router.push('/text-diff')">
        <div class="tool-icon">
          <i class="fas fa-columns"></i>
        </div>
        <h3>文本对比</h3>
        <p>文本、代码差异对比工具</p>
        <div class="card-footer">
          <button class="try-btn">立即使用</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeView'
}
</script>

<style scoped>
.home {
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.header {
  text-align: center;
  margin-bottom: 50px;
  padding: 20px;
  background: linear-gradient(135deg, #42b983 0%, #3aa876 100%);
  border-radius: 12px;
  color: white;
}

.header h1 {
  font-size: 2.5em;
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
}

.subtitle {
  font-size: 1.2em;
  opacity: 0.9;
}

.tools-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
  padding: 20px;
}

.tool-card {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(0,0,0,0.05);
}

.tool-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

.tool-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #42b983 0%, #3aa876 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.tool-icon i {
  font-size: 20px;
  color: white;
}

.tool-card h3 {
  font-size: 1.3em;
  color: #2c3e50;
  margin-bottom: 10px;
  font-weight: 600;
}

.tool-card p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 20px;
  font-size: 0.95em;
}

.card-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: auto;
}

.status {
  color: #95a5a6;
  font-size: 0.9em;
  padding: 4px 12px;
  background-color: #f8f9fa;
  border-radius: 20px;
}

.coming-soon {
  opacity: 0.8;
  cursor: not-allowed;
}

.coming-soon .tool-icon {
  background: linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%);
}

@media (max-width: 768px) {
  .header h1 {
    font-size: 2em;
  }
  
  .header {
    margin: 0 -20px 30px -20px;
    border-radius: 0;
  }
  
  .tools-container {
    padding: 0;
  }
}

.try-btn {
  background: #42b983;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  transition: background 0.3s;
}

.try-btn:hover {
  background: #3aa876;
}
</style> 