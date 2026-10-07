<template>
  <div class="login-container">
    <div class="login-box">
      <h2>登录</h2>

      <div v-if="errorMsg" class="error-msg">{{ errorMsg }}</div>
      <div v-if="successMsg" class="success-msg">{{ successMsg }}</div>

      <div class="form-item">
        <input v-model="username" placeholder="用户名" @keyup.enter="handleLogin" />
      </div>
      <div class="form-item">
        <input v-model="password" type="password" placeholder="密码" @keyup.enter="handleLogin" />
      </div>
      <button class="btn-login" @click="handleLogin">登录</button>
      <p class="tip">
        还没有账号？
        <a href="#" @click.prevent="isRegister = true">去注册</a>  <!--阻止跳转，只弹注册框，页面不动-->
      </p>
    </div>

    <!-- 注册弹窗 -->
    <div v-if="isRegister" class="modal-mask">
      <div class="modal-box">
        <h3>注册</h3>
        <div class="form-item">
          <input v-model="regForm.username" placeholder="用户名" />  <!--v-model：双向绑定-->
        </div>
        <div class="form-item">
          <input v-model="regForm.password" type="password" placeholder="密码（至少6位）" />
        </div>
        <div class="form-item">
          <input v-model="regForm.nickname" placeholder="昵称（可选）" />
        </div>
        <div class="modal-buttons">
          <button @click="isRegister = false">取消</button>
          <button class="btn-primary" @click="handleRegister">注册</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

//声明响应式变量，ref:返回对象
const username = ref('')
const password = ref('')
const isRegister = ref(false)
const regForm = ref({ username: '', password: '', nickname: '' })
const errorMsg = ref('')
const successMsg = ref('')

const API = 'http://localhost:8080/api/auth'

async function handleLogin() {
  //清空错误提示和成功提示
  errorMsg.value = ''
  successMsg.value = ''

  if (!username.value || !password.value) {
    errorMsg.value = '请输入用户名和密码'
    return
  }

  try {
    const res = await axios.post(`${API}/login`, {  //发请求
      username: username.value,
      password: password.value,
    })
    const data = res.data.data  //取数据
    localStorage.setItem('token', data.token)   //存token
    localStorage.setItem('user', JSON.stringify(data.user))   //存用户
    router.push('/todo')  //跳转页面
  } catch (e) {
    errorMsg.value = e.response?.data?.message || '登录失败，请检查用户名或密码'
  }
}

async function handleRegister() {
  errorMsg.value = ''
  successMsg.value = ''

  if (!regForm.value.username || regForm.value.password.length < 6) {
    errorMsg.value = '用户名不能为空，密码至少 6 位'
    return
  }
  try {
    await axios.post(`${API}/register`, regForm.value)
    successMsg.value = '注册成功，请登录'
    isRegister.value = false
    regForm.value = { username: '', password: '', nickname: '' }
    setTimeout(() => { successMsg.value = '' }, 3000)
  } catch (e) {
    errorMsg.value = e.response?.data?.message || '注册失败'
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f0f2f5;
}
.login-box {
  width: 320px;
  padding: 30px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}
.login-box h2 {
  text-align: center;
  margin-bottom: 24px;
}
.error-msg {
  color: #ff4d4f;
  background: #fff2f0;
  border: 1px solid #ffccc7;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 16px;
  font-size: 14px;
  text-align: center;
}
.success-msg {
  color: #52c41a;
  background: #f6ffed;
  border: 1px solid #b7eb8f;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 16px;
  font-size: 14px;
  text-align: center;
}
.form-item {
  margin-bottom: 12px;
}
.form-item input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 14px;
}
.btn-login {
  width: 100%;
  padding: 10px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 15px;
  cursor: pointer;
}
.btn-login:hover {
  background: #3aa876;
}
.tip {
  text-align: center;
  margin-top: 16px;
  font-size: 13px;
  color: #999;
}
.tip a {
  color: #42b883;
  text-decoration: none;
}
.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-box {
  width: 320px;
  padding: 24px;
  background: white;
  border-radius: 8px;
}
.modal-box h3 {
  text-align: center;
  margin-bottom: 16px;
}
.modal-buttons {
  display: flex;
  gap: 10px;
  margin-top: 16px;
}
.modal-buttons button {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
}
.modal-buttons .btn-primary {
  background: #42b883;
  color: white;
  border: none;
}
</style>