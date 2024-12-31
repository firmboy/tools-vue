import { createApp } from 'vue'
import App from './App.vue'
import { formatJson } from './utils/formatJson'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 注册全局属性
app.config.globalProperties.$formatJson = formatJson

// 添加全局方法
app.provide('formatJson', formatJson)

// 使用 Element Plus
app.use(ElementPlus)
// 使用路由
app.use(router)

app.mount('#app')
