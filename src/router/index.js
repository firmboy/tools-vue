import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CodeFormatter from '../views/CodeFormatter.vue'
import EncoderView from '../views/EncoderView.vue'
import TimeConverterView from '../views/TimeConverterView.vue'
import CryptoView from '../views/CryptoView.vue'
import ImageToolsView from '../views/ImageToolsView.vue'
import RegexView from '../views/RegexView.vue'
import TextDiffView from '../views/TextDiffView.vue'
import ColorView from '../views/ColorView.vue'
import NetworkView from '../views/NetworkView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/code-formatter',
    name: 'codeFormatter',
    component: CodeFormatter
  },
  {
    path: '/encoder',
    name: 'encoder',
    component: EncoderView
  },
  {
    path: '/time-converter',
    name: 'timeConverter',
    component: TimeConverterView
  },
  {
    path: '/crypto',
    name: 'crypto',
    component: CryptoView
  },
  {
    path: '/image-tools',
    name: 'imageTools',
    component: ImageToolsView
  },
  {
    path: '/regex',
    name: 'regex',
    component: RegexView
  },
  {
    path: '/text-diff',
    name: 'textDiff',
    component: TextDiffView
  },
  {
    path: '/color',
    name: 'color',
    component: ColorView
  },
  {
    path: '/network',
    name: 'network',
    component: NetworkView
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router 