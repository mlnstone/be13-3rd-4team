<template>
  <button @click="updateTeam">팀 수정</button>
</template>
<script setup lang="ts">
import { defineEmits } from "vue";
import axios from "axios";

const emit = defineEmits(["team-updated"]);

const updateTeam = async () => {
  try {
    // 팀 등록 API 호출
    await axios.put("/teams", {
      /* 팀 수정에 필요한 데이터 */
    });
    // 성공적으로 팀이 수정되면 부모 컴포넌트에 알림
    emit("team-updated");
  } catch (error) {
    // 에러 처리
  }
};
</script>
