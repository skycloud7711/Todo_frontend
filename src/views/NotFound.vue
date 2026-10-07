<template>
  <div class="not-found">
    <h1>404</h1>
    <p>页面不存在</p>
    <button @click="$router.push('/todo')">返回上一页面</button>
  </div>
</template>

<style scoped>
.not-found {
  text-align: center;
  margin-top: 100px;
}
h1 {
  font-size: 72px;
  color: #42b883;
}
button {
  padding: 10px 20px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>