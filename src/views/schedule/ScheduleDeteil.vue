<template>
    <div>
        <div class="max-w-7xl w-full mx-auto p-4 bg-white">
            <div class="flex items-center space-x-4 mb-6">
                <img src="https://cdn.startupful.io/img/app_logo/no_img.png" alt="Author Avatar"
                    class="w-12 h-12 rounded-full" />
                <div>
                    <h3 class="font-semibold">{{ schedules.createdBy }}</h3>
                </div>
            </div>
            <div class="space-y-6">
                <h1 class="text-3xl font-bold text-black">{{ schedules.title }}</h1>

                <div class="prose max-w-none text-black">
                    <p class="text-gray-500 leading-relaxed">{{ schedules.description }}</p>
                </div>
            </div>

            <div>
                상태 {{ schedules.status }} <br />
                시작 {{ schedules.startDate }} <br />
                끝 {{ schedules.endDate }} <br />
            </div>

            <div>
                <br />
                <button
                    class="px-3 py-1 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none"
                    @click="goToEditPage">
                    수정
                </button>
                <button
                    class="px-3 py-1 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none"
                    @click="confirmDelete">
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
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const router = useRouter();
const teamNo = route.params.teamNo;
const scheduleNo = route.params.scheduleNo;
const authStore = useAuthStore();

const schedules = ref({});

const fetchSchedule = async () => {
    try {
        const response = await apiClient.get(`/schedules/${scheduleNo}`);
        schedules.value = response.data;
    } catch (error) {
        alert(error.response.data.message);
        console.log(error);
    }
};

const goToEditPage = () => {
    router.push({
        name: 'ScheduleWrite',
        query: {
            scheduleNo: scheduleNo,
            title: schedules.value.title,
            startDate: schedules.value.startDate,
            endDate: schedules.value.endDate,
            description: schedules.value.description,
            status: schedules.value.status,
        }
    });
};

const confirmDelete = async () => {
    if (!confirm('정말로 삭제하시겠습니까?')) return;

    try {
        await apiClient.delete(`/schedules/${scheduleNo}`);
        alert('스케줄이 삭제되었습니다.');
        router.push(`/teams/${teamNo}/schedule`);
    } catch (error) {
        alert(error.response.data.message);
    }
};

onMounted(fetchSchedule);
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

.space-y-6>*+* {
    margin-top: 1.5rem;
}

.text-3xl {
    font-size: 1.875rem;
}

.font-bold {
    font-weight: 700;
}

.text-black {
    color: #000;
}
</style>
