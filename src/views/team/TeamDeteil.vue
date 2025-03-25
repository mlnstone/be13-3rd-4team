<template>
    <div>
        <div class="max-w-7xl w-full mx-auto p-4 bg-white">
            <div class="flex items-center space-x-4 mb-6">
                <img src="https://cdn.startupful.io/img/app_logo/no_img.png" alt="Author Avatar"
                    class="w-12 h-12 rounded-full" />
                <div>
                    <h3 class="font-semibold">{{ team.name }}</h3>
                    <p class="text-gray-500 text-sm">
                        {{ team.info }}
                        {{ team.status }}
                    </p>
                </div>
            </div>

            <div>
                <ProjectInfo :project="project" v-if="project.name" />
                <div class="space-y-6" v-else>
                    <h2>아직 프로젝트가 생성되지 않았습니다.</h2>
                    <div v-if="isLeader">
                        <router-link
                            :to="{ name: 'projects/add', query: { teamNo: team.no, projectNo: project && project.no } }">
                            <button class="category-button">프로젝트 생성</button>
                        </router-link>
                    </div>
                </div>
            </div>

            <div v-if="(team.status === 'OPEN') && !isLeader && !isMember">
                <button
                    class="px-3 py-1 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none"
                    @click="confirmJoin(team.no)">가입 신청</button>
            </div>

            <!-- <div v-if="isMember">
                <router-link :to="{ name: 'ScheduleList' }">
                    <button class="category-button">팀 스케줄</button>
                </router-link>
            </div> -->

            <div v-if="isLeader">
                <br />
                <button
                    class="px-3 py-1 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none"
                    @click="goToEditPage">수정</button>
                <button
                    class="px-3 py-1 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none"
                    @click="confirmDelete(team.no)">삭제</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import apiClient from '@/api';
import ProjectInfo from '@/components/project/ProjectInfo.vue';
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const router = useRouter();
const teamNo = route.params.no;
const team = ref({});
const project = ref({});
const isLeader = ref(false);
const isMember = ref(false);
const authStore = useAuthStore();

const fetchTeamDetails = async () => {
    try {
        const teamResponse = await apiClient.get(`/team/${teamNo}`);
        team.value = {
            no: teamResponse.data.team.no,
            name: teamResponse.data.team.team.teamName,
            info: teamResponse.data.team.team.teamIntroduce,
            status: teamResponse.data.team.team.projectStatus,
        };
        project.value = teamResponse.data.project;

        const config = {
            params: { teamNo }
        };

        const roleResponse = await apiClient.get(`/team/leader-role`, config);
        if (roleResponse.data.isLeader) {
            isLeader.value = true;
            isMember.value = true;
        } else if (roleResponse.data.isMember) {
            isMember.value = true;
        }
    } catch (error) {
        console.error('데이터를 불러오는 중 오류 발생', error);
    }
};

// 팀 수정 페이지 이동
const goToEditPage = () => {
  router.push({
    name: 'teams/add',
    query: {
      teamNo: team.value.no,
      teamName: team.value.name,
      teamIntroduce: team.value.info,
      projectStatus: team.value.status,
    },
  });
};

// 팀 삭제 확인 및 삭제
const confirmDelete = async (teamNo) => {
  if (confirm('정말로 삭제하시겠습니까?')) {
    try {
      await apiClient.delete(`/team/${teamNo}`);
      alert('팀이 삭제되었습니다.');
      router.push('/teams');
    } catch (error) {
      alert(error.response?.data?.message || '팀 삭제 중 오류가 발생했습니다.');
    }
  }
};

// 팀 가입 신청
const confirmJoin = async (teamNo) => {
  if (confirm('해당 팀에 가입을 신청하시겠습니까?')) {
    try {
      await apiClient.post(`/team/${teamNo}/join-request`);
      alert('가입 신청이 완료되었습니다!');
    } catch (error) {
      alert(error.response?.data?.message || '가입 신청 중 오류가 발생했습니다.');
    }
  }
};

onMounted(fetchTeamDetails);

defineExpose({
  team,
  project,
  isLeader,
  isMember,
  goToEditPage,
  confirmDelete,
  confirmJoin,
});
</script>

<style scoped>
.flex {
    display: flex;
}

.items-center {
    align-items: center;
}

.space-x-4>*+* {
    margin-left: 1rem;
}

.mb-6 {
    margin-bottom: 1.5rem;
}

.w-12,
.h-12 {
    width: 3rem;
    height: 3rem;
}

.rounded-full {
    border-radius: 9999px;
}

.font-semibold {
    font-weight: 600;
}

.text-gray-500 {
    color: #6b7280;
}

.text-sm {
    font-size: 0.875rem;
}

.mt-4 {
    margin-top: 1rem;
}

.px-3,
.py-1 {
    padding: 0.25rem 0.75rem;
}

.text-white {
    color: #fff;
}

.bg-indigo-600 {
    background-color: #4f46e5;
}

.rounded-md {
    border-radius: 0.375rem;
}

.hover\:bg-indigo-500:hover {
    background-color: #4338ca;
}

.focus\:outline-none:focus {
    outline: none;
}

.text-gray-700 {
    color: #374151;
}

.bg-gray-200 {
    background-color: #e5e7eb;
}

.hover\:bg-gray-300:hover {
    background-color: #d1d5db;
}
</style>
