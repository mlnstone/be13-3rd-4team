<template>
    <div>
        <div class="mt-8">
            <div class="mt-4">
                <div class="p-6 bg-white rounded-md shadow-md">
                    <h2 class="text-lg font-semibold text-gray-700 capitalize">
                        {{ isEditMode ? "프로젝트 수정" : "프로젝트 생성" }}
                    </h2>

                    <form @submit.prevent="submitForm">
                        <div class="grid grid-cols-1 gap-6 mt-4">
                            <div>
                                <label class="text-gray-700">제목</label>
                                <input type="text" v-model="name" class="w-full mt-2" />
                            </div>

                            <div>
                                <label class="text-gray-700">내용</label>
                                <textarea v-model="content" class="w-full mt-2"></textarea>
                            </div>

                            <div>
                                <label class="text-gray-700">프로젝트 타입</label>
                                <select v-model="projectStatus">
                                    <option value="OPEN">공개</option>
                                    <option value="CLOSED">닫힘</option>
                                    <option value="IN_PROGRESS">진행중</option>
                                    <option value="COMPLETE">완료</option>
                                </select>
                            </div>

                            <ProjectTechList :initialTechs="initialTechs" @selectedTechs="handleSelectedTechs" />
                            <p>선택된 기술 번호: {{ selectedTechs }}</p>
                        </div>

                        <div class="flex justify-end mt-4">
                            <button type="submit" class="px-4 py-2 text-gray-200 bg-gray-800 rounded-md">
                                {{ isEditMode ? "수정" : "저장" }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import apiClient from '@/api';
import { useAuthStore } from '@/stores/auth';
import ProjectTechList from '@/components/project/ProjectTechList.vue';

const route = useRoute();
const router = useRouter();

const name = ref(route.query.name || "");
const content = ref(route.query.content || "");
const projectStatus = ref(route.query.projectStatus || "OPEN");
const projectNo = ref(route.query.projectNo || null);
const teamNo = ref(route.query.teamNo || null);
const isEditMode = ref(!!route.query.name);
const initialTechs = ref(route.query.techsNo || []);
const selectedTechs = ref([]);

const handleSelectedTechs = (techs) => {
    selectedTechs.value = techs.map(item => item.no);
};

const submitForm = async () => {
    const params = {
        name: name.value,
        content: content.value,
        projectStatus: projectStatus.value,
        teamNo: teamNo.value,
        techsNo: selectedTechs.value,
    };

    try {
        if (isEditMode.value) {
            await apiClient.post(`/project/${projectNo.value}?projectStatus=${projectStatus.value}`, params);
            alert('프로젝트가 수정되었습니다.');
            router.push(`/projects/${projectNo.value}`);
        } else {
            const response = await apiClient.post('/project', params);
            alert('프로젝트가 생성되었습니다.');
            router.push(`/teams/${teamNo.value}`);
        }
    } catch (error) {
        alert(error.response?.data.message || '알 수 없는 오류 발생');
    }
};
</script>

<style scoped>
.mt-8 {
    margin-top: 2rem;
}

.mt-4 {
    margin-top: 1rem;
}

.p-6 {
    padding: 1.5rem;
}

.bg-white {
    background-color: white;
}

.rounded-md {
    border-radius: 0.375rem;
}

.shadow-md {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.flex {
    display: flex;
}

.justify-end {
    justify-content: flex-end;
}
</style>
