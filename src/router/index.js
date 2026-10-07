import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import Todo from '@/views/Todo.vue'
import NotFound from '@/views/NotFound.vue'

//定义路由表
const routes = [
    { path: '/', redirect: '/todo' },
    { path: '/login', component: Login },   //component：组件
    { path: '/todo', component: Todo, meta: { requiresAuth: true } },   //meta：附加信息
    { path: '/:pathMatch(.*)*', component: NotFound },
]

//创建路由实例
const router = createRouter({
    history: createWebHistory(),
    routes,
})

//路由守卫：未登录跳登录页
//to:即将要去的路由对象，from:当前所在的路由对象，next:放行/跳转的控制函数
//在跳转页面前调用beforeEach，传入三个参数
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token')
    if (to.meta.requiresAuth && !token) {
        next('/login')
    } else if (to.path === '/login' && token) {
        next('/todo')   //已登录访问登录页，跳任务页
    } else {
        next()
    }
})

//把路由实例作为默认导出
export default router