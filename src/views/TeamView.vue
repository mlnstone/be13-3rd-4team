<template>
  <div>
    <Breadcrumb breadcrumb="Team" />
    <div class="p-6 bg-white rounded-md shadow-md">
      <h2 class="text-lg font-semibold text-gray-700 capitalize">팀 목록</h2>
      <div class="flex flex-col mt-6">
        <div
          class="py-2 -my-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
        >
          <div
            class="inline-block min-w-full overflow-hidden align-middle border-b border-gray-200 shadow sm:rounded-lg"
          >
            <table class="min-w-full">
              <thead>
                <tr>
                  <th
                    class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase bg-gray-100 border-b border-gray-200"
                  >
                    Name
                  </th>
                  <th
                    class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase bg-gray-100 border-b border-gray-200"
                  >
                    Title
                  </th>
                  <th
                    class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase bg-gray-100 border-b border-gray-200"
                  >
                    Status
                  </th>
                  <th
                    class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase bg-gray-100 border-b border-gray-200"
                  >
                    Role
                  </th>
                  <th
                    class="px-6 py-3 bg-gray-100 border-b border-gray-200"
                  ></th>
                </tr>
              </thead>
              <tbody class="bg-white">
                <TeamListItem
                  v-for="team in teams"
                  :key="team.no"
                  :team="team"
                />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <TeamRegister @team-registered="fetchTeams" />
    <TeamUpdate @team-updated="fetchTeams" />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import Breadcrumb from "../partials/AppBreadcrumb.vue";
import TeamListItem from "../components/team/TeamListItem.vue";
import TeamRegister from "../components/team/TeamRegister.vue";
import TeamUpdate from "../components/team/TeamUpdate.vue";
import axios from "axios";

const teams = ref([]);

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
</script>
