<template>
  <div class="container">
    <div class="header">
      <h2>我的任务清单</h2>
      <button class="logout" @click="handleLogout">退出</button>
    </div>

    <div class="search-row">
      <input v-model="keyword" placeholder="搜索任务..." @keyup.enter="handleSearch" />
      <select v-model="finishedFilter" @change="handleSearch">
        <option :value="null">全部</option>
        <option :value="0">未完成</option>
        <option :value="1">已完成</option>
      </select>
      <button @click="handleSearch">搜索</button>
    </div>

    <div class="input-row">
      <input v-model="content" placeholder="输入任务内容，回车添加" @keyup.enter="handleAdd" />
      <button @click="handleAdd">添加</button>
    </div>

    <ul class="list">
      <li v-for="item in list" :key="item.id" :class="{ done: item.finished === 1 }">
        <input type="checkbox" :checked="item.finished === 1" @change="handleToggle(item.id)" />  <!--@change:值确定改变后触发-->
        <span class="text">{{ item.content }}</span>
        <button class="del" @click="handleDelete(item.id)">删除</button>
      </li>
    </ul>

    <p v-if="list.length === 0" class="empty">暂无任务</p>

    <div class="pagination">
      <button :disabled="pageNum <= 1" @click="changePage(pageNum - 1)">上一页</button>
      <span>第 {{ pageNum }} / {{ totalPages }} 页（共 {{ total }} 条）</span>
      <button :disabled="pageNum >= totalPages" @click="changePage(pageNum + 1)">下一页</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import request from '@/utils/request'
import { useRouter } from 'vue-router'

const list = ref([])
const content = ref('')
const keyword = ref('')
const finishedFilter = ref(null)
const pageNum = ref(1)
const pageSize = ref(5)
const total = ref(0)
const totalPages = ref(1)
const router = useRouter()

const API = '/api/todo'

async function loadList() {
  const params = {
    pageNum: pageNum.value,
    pageSize: pageSize.value,
  }
  if (keyword.value) params.keyword = keyword.value
  if (finishedFilter.value !== null) params.finished = finishedFilter.value

  const res = await request.get(`${API}/page`, { params })
  const data = res.data.data
  list.value = data.records
  total.value = data.total
  totalPages.value = data.pages
}

function handleSearch() {
  pageNum.value = 1
  loadList()
}

function changePage(newPage) {
  pageNum.value = newPage
  loadList()
}

async function handleAdd() {
  if (!content.value.trim()) return
  await request.post(API, { content: content.value })
  content.value = ''
  loadList()
}

async function handleToggle(id) {
  await request.put(`${API}/${id}`)
  loadList()
}

async function handleDelete(id) {
  await request.delete(`${API}/${id}`)
  loadList()
}

function handleLogout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/login')
}

onMounted(loadList)
</script>

<style scoped>
.container {
  max-width: 500px;
  margin: 50px auto;
  padding: 20px;
  font-family: sans-serif;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
h2 {
  margin: 0;
}
.logout {
  padding: 6px 12px;
  background: #ff5c5c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.search-row {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}
.search-row input { flex: 1; padding: 6px; }
.search-row select { padding: 6px; }
.search-row button {
  padding: 6px 12px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.input-row {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}
.input-row input {
  flex: 1;
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.input-row button {
  padding: 8px 16px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.list {
  list-style: none;
  padding: 0;
}
.list li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-bottom: 1px solid #eee;
}
.list li.done .text {
  text-decoration: line-through;
  color: #999;
}
.text {
  flex: 1;
}
.del {
  background: #ff5c5c;
  color: white;
  border: none;
  padding: 4px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}
.empty {
  text-align: center;
  color: #999;
}
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 20px;
}
.pagination button {
  padding: 6px 12px;
  cursor: pointer;
}
.pagination button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>