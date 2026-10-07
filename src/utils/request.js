import axios from 'axios'
import { ElMessage } from 'element-plus'

//创建一个axios实例，加默认请求头
const request = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 5000,
})

//请求拦截器：请求发出之前自动加token
request.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = 'Bearer ' + token
    }
    return config
})

//响应拦截器：响应回来之后检查是否401，跳登录
request.interceptors.response.use(
    res => res,
    err => {
        if (err.response?.status === 401) {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            ElMessage.warning('登录已过期，请重新登录')
            window.location.href = '/login'
        }
        return Promise.reject(err)
    }
)

//把axios实例作为默认导出
export default request