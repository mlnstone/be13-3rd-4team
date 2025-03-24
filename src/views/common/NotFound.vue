<template>
  <div class="not-found-container">
    <div class="nav-links">
      <router-link to="/" class="small-link">Home</router-link> /
      <button @click="goBack" class="small-link back-button">이전페이지로</button>
    </div>

    <h1>페이지를 찾을 수 없습니다.</h1>
  </div>
</template>

<script setup>
import {useRoute, useRouter} from 'vue-router';

const router = useRouter();
const route = useRoute();

const goBack = () => {
  router.back();
};
</script>

<style scoped>
.not-found-container {
  text-align: center;
  margin-top: 10%;
}

.nav-links {
  font-size: 0.9rem;
  margin-bottom: 10px;
}

.small-link {
  color: #007bff;
  text-decoration: none;
  font-size: 0.9rem;
}

.small-link:hover {
  text-decoration: underline;
}

.back-button {
  border: none;
  background: none;
  color: #007bff;
  cursor: pointer;
}

.back-button:hover {
  text-decoration: underline;
}

h1 {
  font-size: 2rem;
  color: #333;
}
</style>
