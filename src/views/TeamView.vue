<template>
  <Breadcrumb breadcrumb="Team" />
  <div>
    <TeamList @team-updated="fetchTeams" />
    <TeamRegister @team-registered="fetchTeams" />
    <TeamUpdate />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import Breadcrumb from "../partials/AppBreadcrumb.vue";
import TeamList from "../components/team/TeamList.vue";
import TeamRegister from "../components/team/TeamRegister.vue";
import TeamUpdate from "../components/team/TeamUpdate.vue";
import axios from "axios";

const teams = ref([]);

// 팀 목록 가져오기 (자식 컴포넌트의 변경을 감지하여 업데이트합니다.)
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
</script>
