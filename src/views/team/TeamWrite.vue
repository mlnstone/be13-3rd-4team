<template>
    <div>
        <div class="mt-8">
            <div class="mt-4">
                <div class="p-6 bg-white rounded-md shadow-md">
                    <h2 class="text-lg font-semibold text-gray-700 capitalize">
                        {{ isEditMode ? "팀 정보 수정" : "팀 생성" }}
                    </h2>

                    <form @submit.prevent="submitPostData">
                        <div class="grid grid-cols-1 gap-6 mt-4">
                            <div>
                                <label class="text-gray-700" for="teamName">제목</label>
                                <input type="text" v-model="teamName"
                                    class="w-full mt-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500" />
                            </div>
                            <div>
                                <label class="text-gray-700" for="teamIntroduce">내용</label>
                                <textarea v-model="teamIntroduce"
                                    class="w-full mt-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"></textarea>
                            </div>
                            <div class="form-group">
                                <label class="text-gray-700">상태</label>
                                <select v-model="projectStatus"
                                    class="w-full mt-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500">
                                    <option value="OPEN">모집</option>
                                    <option value="CLOSED">모집종료</option>
                                </select>
                            </div>
                        </div>

                        <div class="flex justify-end mt-4">
                            <button type="submit"
                                class="px-4 py-2 text-gray-200 bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus:bg-gray-700">
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

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const teamName = ref(route.query.teamName || "");
const teamIntroduce = ref(route.query.teamIntroduce || "");
const projectStatus = ref(route.query.projectStatus || "OPEN");
const teamNo = ref(route.query.teamNo || null);
const isEditMode = ref(!!route.query.teamName);

const submitPostData = async () => {
    const params = {
        teamName: teamName.value,
        teamIntroduce: teamIntroduce.value,
        projectStatus: projectStatus.value,
    };

    try {
        if (isEditMode.value) {
            await apiClient.put(`/team/${teamNo.value}`, params);
            alert("게시글이 수정되었습니다.");
            router.push(`/teams/${teamNo.value}`);
        } else {
            const response = await apiClient.post("/team", params);
            alert("팀이 생성되었습니다.");
            teamNo.value = response.data.no;
            router.push(`/teams/${teamNo.value}`);
        }
    } catch (error) {
        alert(error.response?.data?.message || "오류가 발생했습니다.");
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
    background-color: #fff;
}

.rounded-md {
    border-radius: 0.375rem;
}

.shadow-md {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.text-lg {
    font-size: 1.125rem;
}

.font-semibold {
    font-weight: 600;
}

.text-gray-700 {
    color: #374151;
}

.capitalize {
    text-transform: capitalize;
}

.grid {
    display: grid;
}

.grid-cols-1 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
}

.gap-6 {
    gap: 1.5rem;
}

.w-full {
    width: 100%;
}

.flex {
    display: flex;
}

.justify-end {
    justify-content: flex-end;
}

.px-4,
.py-2 {
    padding: 0.5rem 1rem;
}

.text-gray-200 {
    color: #e5e7eb;
}

.bg-gray-800 {
    background-color: #1f2937;
}

.hover\:bg-gray-700:hover,
.focus\:bg-gray-700:focus {
    background-color: #374151;
}

.focus\:outline-none:focus {
    outline: none;
}
</style>
