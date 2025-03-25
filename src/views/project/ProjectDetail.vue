<template>
    <div>
        <div class="max-w-7xl w-full mx-auto p-4 bg-white">
            <div class="flex items-center space-x-4 mb-6">
                <img src="https://cdn.startupful.io/img/app_logo/no_img.png" alt="Author Avatar"
                    class="w-12 h-12 rounded-full" />
                <div>
                    <h3 class="font-semibold">팀 / {{ project.name }}</h3>
                    <p class="text-gray-500 text-sm">번호 {{ project.no }}, 상태 {{ project.projectStatus }}</p>
                </div>
            </div>

            <div>
                <ProjectInfo :project="project" :team="teamNo" v-if="project.name" />
            </div>

            <div v-if="leader">
                <br />
                <button @click="goToEditPage"
                    class="px-3 py-1 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none">수정</button>
                <button @click="confirmDelete(project.no)"
                    class="px-3 py-1 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none">삭제</button>
            </div>
            <span>조회수: {{ project.view }}</span>
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
const projectNo = Number(route.params.no);

const project = ref({});
const leader = ref(false);
const teamNo = ref(null);

const fetchProjectDetails = async () => {
    try {
        const response = await apiClient.get(`/project/${projectNo}`);
        if (response.status === 200) {
            project.value = response.data;
            console.log(response);
        }

        const config = {
            params: { projectNo }
        };

        const leaderResponse = await apiClient.get(`/team/leader-role` ,config);
        if (leaderResponse.data.isLeader) {
            leader.value = true;
        }
        teamNo.value = leaderResponse.data.teamNo;

    } catch (error) {
        console.error('오류 발생:', error.response?.data?.message || error.message);
    }
};

const goToEditPage = () => {
    router.push({
        name: 'projects/add',
        query: {
            teamNo: teamNo.value,
            projectNo,
            name: project.value.name,
            content: project.value.content,
            techsNo: project.value.projectTeches,
            status: project.value.projectStatus,
        }
    });
};

const confirmDelete = async () => {
    if (!confirm('정말로 삭제하시겠습니까?')) return;

    try {
        await apiClient.delete(`/project/${projectNo}`);
        alert('프로젝트가 삭제되었습니다.');
        router.push('/projects');
    } catch (error) {
        console.error('삭제 실패:', error.response?.data?.message || error.message);
    }
};

onMounted(fetchProjectDetails);
</script>

<style scoped>
.max-w-7xl {
    max-width: 80rem;
}

.w-full {
    width: 100%;
}

.mx-auto {
    margin: 0 auto;
}

.p-4 {
    padding: 1rem;
}

.bg-white {
    background-color: white;
}

.flex {
    display: flex;
}

.items-center {
    align-items: center;
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
    line-height: 1.25rem;
}

.text-black {
    color: black;
}
</style>
