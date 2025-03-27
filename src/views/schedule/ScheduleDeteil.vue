<template>
    <div>
        <BackButton />
        <div class="max-w-7xl w-full mx-auto p-4 bg-white">
            <div class="flex items-center space-x-4 mb-6">
                <img src="https://cdn.startupful.io/img/app_logo/no_img.png" alt="Author Avatar"
                    class="w-12 h-12 rounded-full" />
                <div>
                    <h3 class="font-semibold">{{ schedules.createdBy }}</h3>
                    <p class="project-tags">
                        <span class="tag">{{ getStatusText(schedules.status) }}</span>
                    </p>
                </div>
            </div>
            <div class="space-y-6">
                <h1 class="text-3xl font-bold text-black">{{ schedules.title }}</h1>
                <div class="prose max-w-none text-black">
                    <p class="text-gray-500 leading-relaxed">
                        {{ schedules.description }}
                    </p>
                </div>
            </div>
            <div class="schedule-dates">
                <p class="text-gray-500 text-sm">
                    시작 시간: {{ formatDate(schedules.startDate)}}
                </p>
                <p class="text-gray-500 text-sm">
                    마감 시간: {{ formatDate(schedules.endDate)}}
                </p>
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
import { ref, onMounted} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import apiClient from '@/api';
import { useAuthStore } from '@/stores/auth';
import BackButton from '@/components/common/BackButton.vue';
import dayjs from "dayjs";

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

const getStatusText = (status) => {
  switch (status) {
    case 'PENDING':
      return '시작 전';
    case 'IN_PROGRESS':
      return '진행 중';
    case 'COMPLETED':
      return '완료됨';
    default:
      return status; // 알 수 없는 상태는 그대로 표시
  }
};

onMounted(fetchSchedule);

const formatDate = (dateString) => {
  return dayjs(dateString).format('YYYY-MM-DD HH:mm:ss');
};
</script>

<style>
@import url('https://cdn-uicons.flaticon.com/2.6.0/uicons-solid-straight/css/uicons-solid-straight.css');

/* 작성자 섹션 */
.flex {
    display: flex;
}

.items-center {
    align-items: center;
}

.space-x-4>*+* {
    margin-left: 1rem;
    /* 작성자 이름 간격 */
}

.mb-6 {
    margin-bottom: 1.5rem;
    /* 작성자 섹션 하단 여백 */
}

.w-12,
.h-12 {
    width: 3rem;
    height: 3rem;
    /* 프로필 이미지 크기 */
}

.rounded-full {
    border-radius: 50%;
    /* 이미지 둥근 처리 */
}

.font-semibold {
    font-weight: 600;
    color: #353535;
    /* 작성자 이름 색상 */
}

.text-sm {
    font-size: 0.875rem;
    color: #6b7280;
    /* 작성자 날짜 색상 */
}

/* 본문 섹션 */
.space-y-6>*+* {
    margin-top: 1.5rem;
    /* 섹션 간 간격 */
}

.text-3xl {
    font-size: 1.875rem;
    font-weight: bold;
    color: #353535;
    /* 제목 색상 */
}

.prose p {
    color: #6b7280;
    line-height: 1.625;
    /* 본문 내용 간격 */
}

.max-w-none {
    max-width: none;
    /* 본문 폭 제한 제거 */
}

/* 수정 버튼 */
.bg-indigo-600 {
    background-color: #0077b6;
    /* 수정 버튼 테마 */
    color: white;
    /* 수정 버튼 글씨 */
    border-radius: 0.375rem;
    /* 버튼 둥근 처리 */
    padding: 0.6rem 1rem;
    /* 수정 버튼 여백 */
    font-size: 0.875rem;
    border: none;
}

.hover\:bg-indigo-500:hover {
    background-color: #005fa3;
    /* 수정 버튼 hover */
}

/* 삭제 버튼 */
.bg-gray-200 {
    background-color: #e5e7eb;
    /* 삭제 버튼 회색 */
    color: #353535;
    /* 삭제 버튼 텍스트 색상 */
    padding: 0.6rem 1rem;
    /* 삭제 버튼 여백 */
    font-size: 0.875rem;
    border-radius: 0.375rem;
    /* 덜 둥근 모양 */
    border: none;
}

.hover\:bg-gray-300:hover {
    background-color: #d1d5db;
    /* 삭제 버튼 hover 시 색상 */
}

/* 카드 배경 */
.bg-white {
    background-color: #ffffff;
    /* 흰색 카드 배경 */
    padding: 1.5rem;
    border-radius: 1rem;
    /* 부드러운 둥근 처리 */
}

/*  */
.project-tags {
    top: 1rem;
    right: 1rem;
}

.project-tags .tag {
    display: inline-block;
    font-size: 0.75rem;
    background-color: #0077b6;
    color: #ffffff;
    padding: 0.3rem 0.7rem;
    border-radius: 9999px;
    background-color: #2196f3;
    /* 더 밝은 색상으로 변경 */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    /* 그림자 효과 추가 */
    font-size: 0.875rem;
    /* 폰트 크기 약간 증가 */
    font-weight: 600;
    /* 폰트 굵게 */
}

.schedule-dates {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    /* 시작/마감 시간 사이 간격 */
    margin-top: 1rem;
    /* 상단 여백 */
}

.schedule-dates p {
    font-size: 1rem;
    /* 날짜 폰트 크기 증가 */
    font-weight: 600;
    /* 날짜 폰트 굵게 */
    background-color: #f0f4f8;
    /* 배경색 추가 */
    padding: 0.5rem 1rem;
    /* 패딩 추가 */
    border-radius: 0.375rem;
    /* 둥근 테두리 */
}

.schedule-dates p::before {
    content: "⏰";
    /* 아이콘 추가 */
    margin-right: 0.5rem;
}
</style>
