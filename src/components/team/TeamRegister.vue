<template>
  <div class="mt-4">
    <div class="p-6 bg-white rounded-md shadow-md">
      <h2 class="text-lg font-semibold text-gray-700 capitalize">팀 생성</h2>

      <form @submit.prevent="register">
        <div class="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
          <div>
            <label class="text-gray-700" for="no">유저번호</label>
            <input
              class="w-full mt-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
              type="number"
              v-model.number="team.no"
              required
            />
          </div>

          <div>
            <label class="text-gray-700" for="teamName">팀 명</label>
            <input
              class="w-full mt-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
              type="text"
              v-model="team.teamName"
              required
            />
          </div>

          <div>
            <label class="text-gray-700" for="teamIntroduce">팀 설명</label>
            <input
              class="w-full mt-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
              type="text"
              v-model="team.teamIntroduce"
            />
          </div>

          <div>
            <label class="text-gray-700" for="projectStatus">모집 상태</label>
            <div class="flex">
              <div class="relative">
                <select
                  v-model="team.projectStatus"
                  class="block w-full h-full px-4 py-2 pr-8 leading-tight text-gray-700 bg-white border border-gray-400 rounded-l appearance-none focus:outline-none focus:bg-white focus:border-gray-500"
                >
                  <option value="OPEN">OPEN</option>
                  <option value="CLOSED">CLOSED</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                </select>
                <div
                  class="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 pointer-events-none"
                >
                  <svg
                    class="w-4 h-4 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end mt-4">
          <button
            class="px-4 py-2 text-gray-200 bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
          >
            생성
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import axios from "axios";
import { defineEmits } from "vue";
import { Team } from "@/types/team";

const emit = defineEmits(["team-registered"]);

const team = ref<Team>({
  no: 1,
  teamName: "",
  teamIntroduce: "",
  projectStatus: "",
});

const register = async () => {
  try {
    console.log(team.value);
    const response = await axios.post("/teams", team.value);
    console.log("Registered: ", response.data);
    // 팀 생성 성공 후, 부모 컴포넌트에 알림
    emit("team-registered");
    // 팀 생성 후 폼 초기화
    team.value = {
      no: 1,
      teamName: "",
      teamIntroduce: "",
      projectStatus: "",
    };
  } catch (error) {
    console.error("There was an error!", error);
  }
};
</script>
