<template>
    <div>
        <div class="mt-8">
            <div class="mt-4">
                <div class="p-6 bg-white rounded-md shadow-md">
                    <h2 class="text-lg font-semibold text-gray-700 capitalize">
                        {{ isEditMode ? "스케줄 수정" : "스케줄 생성" }}
                    </h2>

                    <form @submit.prevent="submitPostData">
                        <div class="grid grid-cols-1 gap-6 mt-4">
                            <div>
                                <label class="text-gray-700">제목</label>
                                <input class="w-full mt-2" type="text" v-model="title" />
                            </div>

                            <div>
                                <label class="text-gray-700">내용</label>
                                <textarea class="w-full mt-2" v-model="description"></textarea>
                            </div>

                            <div>
                                <label class="text-gray-700">상태</label>
                                <select v-model="status">
                                    <option value="PENDING">시작전</option>
                                    <option value="IN_PROGRESS">진행중</option>
                                    <option value="COMPLETED">완료</option>
                                </select>
                            </div>

                            <div>
                                <label class="text-gray-700">시작시간</label>
                                <input type="datetime-local" v-model="startDate" />
                            </div>

                            <div>
                                <label class="text-gray-700">마감시간</label>
                                <input type="datetime-local" v-model="endDate" />
                            </div>
                        </div>

                        <div class="flex justify-end mt-4">
                            <button type="submit" class="px-4 py-2 text-gray-200 bg-gray-800 rounded-md">
                                {{ isEditMode ? "수정" : "저장" }}
                            </button>
                            <button type="button" @click="router.back()" class="px-4 py-2 ml-2 text-gray-200 bg-gray-800 rounded-md">
                                취소
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import apiClient from '@/api';
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const scheduleNo = ref(route.query.scheduleNo || "");
const title = ref(route.query.title || "");
const description = ref(route.query.description || "");
const status = ref(route.query.status || "PENDING");
const isEditMode = ref(!!route.query.title);

const startDate = ref("");
const endDate = ref("");
const teamNo = route.params.teamNo;

onMounted(() => {
    if (isEditMode.value) {
        startDate.value = new Date(route.query.startDate).toISOString().slice(0, 16);
        endDate.value = new Date(route.query.endDate).toISOString().slice(0, 16);
    } else {
        const today = new Date();
        startDate.value = today.toISOString().slice(0, 16);
        endDate.value = today.toISOString().slice(0, 16);
    }
});

const submitPostData = async () => {
    const params = {
        teamNo,
        title: title.value,
        startDate: startDate.value + ":00.000Z",
        endDate: endDate.value + ":00.000Z",
        description: description.value,
        status: status.value,
    };

    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + authStore.getUserInfo().accessToken,
        }
    };

    try {
        if (isEditMode.value) {
            await apiClient.put(`/schedules/${scheduleNo.value}`, params, config);
            alert('스케줄이 수정되었습니다.');
            router.push(`/teams/${teamNo}/schedule/${scheduleNo.value}`);
        } else {
            const response = await apiClient.post('/schedules', params, config);
            alert('스케줄이 생성되었습니다.');
            router.push(`/teams/${teamNo}/schedule/${response.data.scheduleNo}`);
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
