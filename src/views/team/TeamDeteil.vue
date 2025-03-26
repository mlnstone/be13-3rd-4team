<template>
    <div>
        <BackButton />
        <div class="max-w-7xl w-full mx-auto p-4 bg-white">
            <div class="flex items-center space-x-4 mb-6">
                <img src="https://cdn.startupful.io/img/app_logo/no_img.png" alt="Author Avatar"
                    class="w-12 h-12 rounded-full" />
                <div>
                    <h3 class="font-semibold">{{ team.name }}</h3>
                    <p class="project-tags">
                        <span class="tag">{{ getStatusText(team.status) }}</span>
                        <span class="d"> 팀장 {{ leaderUsername }}</span>
                    </p>
                </div>
            </div>
            <!-- 내용 -->
            <div>
                <h4>{{ team.info }}</h4>
            </div>
            <!-- 프로젝트 -->
            <div class="space-y-6 center">
                <div v-if="project && project.name">
                    <router-link :to="{ name: 'projects/no', params: { no: project.teamNo } }">
                        <button class="view-more-button">프로젝트</button>
                    </router-link>
                </div>

                <div v-else>
                    <h2>아직 프로젝트가 생성되지 않았습니다.</h2>
                    <div class="center" v-if="isLeader">
                        <router-link :to="{ name: 'projects/add', query: { teamNo: team.no } }">
                            <button class="view-more-button">프로젝트 생성</button>
                        </router-link>
                    </div>
                </div>
            </div>
            <br><br>
            <!-- 팀 스케줄 -->
            <div class="space-y-6" v-if="isMember">
                        <router-link :to="{ name: 'ScheduleList', params: { teamNo: team.no } }">
                            <button class="px-3 py-1 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none">팀 스케줄</button>
                        </router-link>
                    </div>
                <!-- 가입 신청 -->
                <div class="space-y-6" v-if="(team.status === 'OPEN') && !isLeader || (team.status === 'OPEN') && !isMember">
                    <button
                        class="px-3 py-1 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none"
                        @click="confirmJoin(team.no)">가입 신청</button>
                </div>

            <div class="right" v-if="isLeader">
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
import BackButton from '@/components/common/BackButton.vue';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import apiClient from '@/api';
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const router = useRouter();
const teamNo = route.params.no;
const team = ref({});
const project = ref({});
const isLeader = ref(false);
const isMember = ref(false);
const leaderUsername = ref("");
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

        const leaderRes = await apiClient.get(`/team/${teamNo}/leader-username`, config);
            leaderUsername.value = leaderRes.data;
            console.log(leaderUsername.value);
        }
    catch (error) {
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

const confirmJoin = async (teamNo) => {
  if (confirm("해당 팀에 가입을 신청하시겠습니까?")) {
    try {
      await apiClient.post(`/team/${teamNo}/join-request`, teamNo);
      alert("가입 신청이 완료되었습니다!");

      const messageData = {
        receiverUsername: leaderUsername.value,
        content: `${team.value.no} 팀에 가입 신청했습니다. 검토 부탁드립니다.`,
      };
      await apiClient.post("/messages", messageData);
      alert("쪽지가 자동으로 전송되었습니다!");
    } catch (err) {
        alert(err.response?.data?.message || err.message);
    }
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 'OPEN':
      return '모집중';
    case 'CLOSED':
      return '모집마감';
    default:
      return status; // 알 수 없는 상태는 그대로 표시
  }
};

onMounted(fetchTeamDetails);

defineExpose({
  team,
  isLeader,
  isMember,
  leaderUsername,
  project,
  goToEditPage,
  confirmDelete,
  confirmJoin,
});
</script>

<style scoped>

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

/* 북마크 버튼 */
.bookmark-section {

  margin-top: 1rem;
  text-align: right;
  /* 북마크 버튼 오른쪽 정렬 */
}

.bookmark-btn {
  color: #d9d9d9;
  /* 북마크 버튼 테마 색상 */
  background-color: white;
  border: none;
  padding: 0.5rem 1rem;
  font-size: 1.5rem;
  border-radius: 5px;
  /* 버튼 라운드 */
  cursor: pointer;
  transition: transform 0.2s ease;

}

/* 북마크 활성화 */
.bookmark-btn.bookmarked {
  color: #ffd60a;
  /* 북마크 활성화 시 색상 */
  animation: bookmark-bounce 0.4s ease;

}



@keyframes bookmark-bounce {
  0% {
    transform: scale(1);
  }

  30% {
    transform: scale(1.2);
  }

  50% {
    transform: scale(0.8);
  }

  70% {
    transform: scale(1.1);
  }

  100% {
    transform: scale(1);
  }
}

/* 오른쪽 정렬 */
.right{
    text-align: right;
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

.center{
    justify-self: center;
}

.view-more-button {
    padding: 12px 24px;
    font-size: 18px;
    color: white;
    background-color: #3498db;
    /* Blue button */
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    align-self: center;
    margin-top: 16px;
}
</style>
