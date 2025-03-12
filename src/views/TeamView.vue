<template>
  <div>
    <TeamList ref="teamList" />
    <TeamRegister @team-registered="handleTeamRegistered" />
    <TeamUpdate />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import Breadcrumb from "../partials/AppBreadcrumb.vue";
import TeamListItem from "../components/team/TeamListItem.vue";
import TeamRegister from "../components/team/TeamRegister.vue";
import TeamUpdate from "../components/team/TeamUpdate.vue";

const teamList = ref();

const handleTeamRegistered = () => {
  console.log("Team registered event received.");
  if (teamList.value) {
    teamList.value.fetchTeams(); // 이 부분은 TeamList 컴포넌트가 가지고 있는 데이터 갱신 메서드를 호출하는 예시입니다.
  }
};

// 컴포넌트 마운트 시 팀 목록을 가져옴
onMounted(() => {
  teamList.value.fetchTeams();
});
</script>
