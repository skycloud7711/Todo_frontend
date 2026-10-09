import { createApp } from 'vue'
// @ts-ignore
import App from './App.vue'
// @ts-ignore
import router from './router'
//创建vue应用实例，传入根组件App;安装路由插件;把vue应用挂载到index.html的<div id="app">里
createApp(App).use(router).mount('#app')
