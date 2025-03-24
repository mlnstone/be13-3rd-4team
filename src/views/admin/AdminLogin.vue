<template>
  <div class="admin-login-container">
    <h2>관리자 로그인</h2>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="username">아이디</label>
        <input
            type="text"
            id="username"
            v-model="username"
            required
            placeholder="관리자 아이디 입력"
        />
      </div>

      <div class="form-group">
        <label for="password">비밀번호</label>
        <input
            type="password"
            id="password"
            v-model="password"
            required
            placeholder="비밀번호 입력"
        />
      </div>

      <button type="submit">로그인</button>
    </form>

    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const errorMessage = ref('')
const router = useRouter()

const handleLogin = async () => {
  try {
    const response = await axios.post(`http://localhost:8087/admin/login`, {
      username: username.value,
      password: password.value,
    });

    // 로그인 성공 시 토큰 저장 (예: localStorage)
    localStorage.setItem('accessToken', response.data.accessToken)
    localStorage.setItem('refreshToken', response.data.refreshToken)

    // 관리자 페이지로 이동
    router.push('/admin')
  } catch (error) {
    errorMessage.value = error.response?.data?.message || '로그인 실패'
  }
}
</script>

<style scoped>
.admin-login-container {
  max-width: 400px;
  margin: 80px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: #fafafa;
}
.form-group {
  margin-bottom: 15px;
}
input {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
}
button {
  width: 100%;
  padding: 10px;
  background-color: #2c3e50;
  color: white;
  border: none;
  cursor: pointer;
}
.error {
  color: red;
  margin-top: 10px;
}
</style>
