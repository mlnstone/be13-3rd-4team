<template>
  <component :is="layout">
    <router-view />
  </component>
</template>
<script lang="ts" setup>
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "@/api";

const defaultLayout = "default";
const { currentRoute } = useRouter();
const layout = computed(
  () => `${currentRoute.value.meta.layout || defaultLayout}-layout`
);

onMounted(() => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (refreshToken) {
    refreshAccessToken(refreshToken);
  }
});

async function refreshAccessToken(refreshToken: string) {
  try {
    const response = await api.post(
      "/auth/refresh",
      { refreshToken },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("refreshToken")}`, // 기존 액세스 토큰 사용
        },
      }
    );
    const accessToken = response.data.accessToken;
    sessionStorage.setItem("accessToken", accessToken);
  } catch (error) {
    console.error("리프레시 토큰 오류: error");
    localStorage.removeItem("refreshToken");
    sessionStorage.removeItem("accessToken");
  }
}
</script>
