<template>
  <!-- 폼 내용 -->
  <button @click="registerTeam">팀 등록</button>
</template>

<script setup lang="ts">
import { defineEmits } from "vue";
import api from "@/api";

const emit = defineEmits(["team-registered"]);

const registerTeam = async () => {
  try {
    // 팀 등록 API 호출
    await api.post("/teams", {
      /* 팀 등록에 필요한 데이터 */
    });
    // 성공적으로 팀이 등록되면 부모 컴포넌트에 알림
    emit("team-registered");
  } catch (error) {
    // 에러 처리
  }
};
</script>
