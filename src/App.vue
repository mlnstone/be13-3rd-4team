<template>
  <component :is="layout">
    <router-view />
  </component>
</template>
<script lang="ts" setup>
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const defaultLayout = "default";
const { currentRoute } = useRouter();
const layout = computed(
  () => `${currentRoute.value.meta.layout || defaultLayout}-layout`
);

onMounted(() => {
  // 요청 인터셉터 추가
  axios.interceptors.request.use(
    (config) => {
      // localStorage에서 토큰 가져오기
      const token = localStorage.getItem("token");
      // 토큰이 존재하면 헤더에 추가

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
});
</script>
