<template>
  <div class="p-6 bg-white rounded-md shadow-md">
    <h2 class="text-lg font-semibold text-gray-700 capitalize">팀 목록</h2>
    <ul>
      <TeamListItem v-for="team in teams" :key="team.no" :team="team" />
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import TeamListItem from "./TeamListItem.vue";
import { defineEmits } from "vue";

const teams = ref([]);
const emit = defineEmits(["team-updated"]);

// 팀 목록 가져오기
const fetchTeams = async () => {
  try {
    const response = await axios.get("/teams", {
      params: {
        page: 0,
        size: 10,
      },
    });
    teams.value = response.data.content;
  } catch (error) {
    if (error.response) {
      console.error("Error data:", error.response.data);
      console.error("Error status:", error.response.status);
      console.error("Error headers:", error.response.headers);
    } else if (error.request) {
      console.error("Error request:", error.request);
    } else {
      console.error("Error message:", error.message);
    }
  }
};

// 컴포넌트 마운트 시 팀 목록을 가져옴
onMounted(() => {
  fetchTeams();
});

// 팀 목록이 변경되었을 때 부모 컴포넌트에 알림
const updateTeam = () => {
  emit("team-updated");
};
</script>
