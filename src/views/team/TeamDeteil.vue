<template>
    <div>
        <div class="max-w-7xl w-full mx-auto p-4 bg-white">
            <div class="flex items-center space-x-4 mb-6">
                <img src="https://cdn.startupful.io/img/app_logo/no_img.png" alt="Author Avatar"
                    class="w-12 h-12 rounded-full" />
                <div>
                    <h3 class="font-semibold">{{ team.name }}</h3>
                    <p class="text-gray-500 text-sm">
                        {{ team.info }} {{ team.status }}
                    </p>
                    <h3>팀장: {{ leaderUsername }}</h3>
                </div>
            </div>

            <div>
                <ProjectInfo :project="project" v-if="project.name" />
                <div class="space-y-6" v-else>
                    <h2>아직 프로젝트가 생성되지 않았습니다.</h2>
                    <div v-if="isLeader">
                        <router-link
                            :to="{ name: 'projects/add', query: { teamNo: team.no, projectNo: project && project.no } }">
                            <button class="category-button active:scale-95 transition-transform duration-100">
                                프로젝트 생성
                            </button>
                        </router-link>
                    </div>
                </div>
            </div>

            <div v-if="(team.status === 'OPEN') && !isLeader || (team.status === 'OPEN') && !isMember">
                <button
                    class="px-3 py-1 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none active:scale-95 transition-transform duration-100"
                    @click="confirmJoin(team.no)">
                    가입 신청
                </button>
            </div>

            <div v-if="isMember">
                <router-link :to="{ name: 'ScheduleList', params: { teamNo: team.no } }">
                    <button
                        class="px-3 py-1 text-sm text-white bg-orange-500 rounded-md hover:bg-orange-600 focus:outline-none active:scale-95 transition-transform duration-100">
                        팀 스케줄
                    </button>
                </router-link>
            </div>

            <div v-if="isLeader">
                <br />
                <button
                    class="px-3 py-1 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none active:scale-95 transition-transform duration-100"
                    @click="goToEditPage">
                    수정
                </button>
                <button
                    class="px-3 py-1 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none active:scale-95 transition-transform duration-100"
                    @click="confirmDelete(team.no)">
                    삭제
                </button>
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
const leaderUsername = ref('');
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

        const config = { params: { teamNo } };

        const roleResponse = await apiClient.get(`/team/leader-role`, config);
        if (roleResponse.data.isLeader) {
            isLeader.value = true;
            isMember.value = true;
        } else if (roleResponse.data.isMember) {
            isMember.value = true;
        }

        const leaderRes = await apiClient.get(`/team/${teamNo}/leader-username`, config);
        leaderUsername.value = leaderRes.data;
    } catch (error) {
        console.error('데이터를 불러오는 중 오류 발생', error);
    }
};

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

const confirmJoin = async (teamNo) => {
    if (confirm('해당 팀에 가입을 신청하시겠습니까?')) {
        try {
            await apiClient.post(`/team/${teamNo}/join-request`, teamNo);
            alert('가입 신청이 완료되었습니다!');

            const messageData = {
                receiverUsername: leaderUsername.value,
                content: `${team.value.no} 팀에 가입 신청했습니다. 검토 부탁드립니다.`,
            };
            await apiClient.post('/messages', messageData);
            alert('쪽지가 자동으로 전송되었습니다!');
        } catch (err) {
            alert(err.response?.data?.message || err.message);
        }
    }
};

onMounted(fetchTeamDetails);

defineExpose({
    team,
    project,
    isLeader,
    isMember,
    leaderUsername,
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

.space-x-4 > * + * {
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

.category-button {
  @apply px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-500 active:scale-95 transition-transform duration-100 focus:outline-none hover:shadow-md;
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

.bg-indigo-500 {
  background-color: orangered;
}

/* 팀스케줄 버튼용 주황색 클래스 추가 */
.bg-orange-500 {
  background-color: #f97316;
}

/* 팀스케줄 버튼 hover용 (좀 더 진한 주황색) */
.hover\:bg-orange-600:hover {
  background-color: #ea580c;
}

.rounded-md {
  border-radius: 0.375rem;
}

/* 가입 신청 등 인디고 계열 버튼 hover 색상 */
.hover\:bg-indigo-500:hover {
  background-color: #4338ca;
}

/* 모든 버튼 hover 시 그림자 효과 추가 */
button:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

/* 클릭 효과 유지 */
.active\:scale-95:active {
  transform: scale(0.95);
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