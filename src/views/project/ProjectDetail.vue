<template>
  <div class="container py-4">
    <BackButton />
    <div class="card border-0 shadow-sm">
      <!-- 헤더 섹션 -->
      <div class="card-header border-0 bg-gradient">
        <div class="d-flex align-items-center gap-3 p-2">
          <img src="https://cdn.startupful.io/img/app_logo/no_img.png" alt="Author Avatar"
            class="rounded-circle border border-2 border-light" style="width: 64px; height: 64px; object-fit: cover;" />
          <div class="flex-grow-1">
            <h3 class="h5 mb-1">
              <span class=" me-2">팀</span>
              {{ project.teamName }}
            </h3>
            <div class="d-flex align-items-center small gap-3">
              <span class="opacity-75">번호 {{ project.no }}</span>
              <span class="custom-badge-secondary">
                {{ project.projectStatus }}
              </span>
              <span class="opacity-75">
                <i class="bi bi-eye me-1"></i>{{ project.view }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 본문 섹션 -->
      <div class="card-body bg-light-blue">
        <ProjectInfo :project="project" :team="teamNo" v-if="project.name" />

      </div>

      <!-- 푸터 섹션 -->
      <div class="card-footer border-0 bg-white" v-if="leader">
        <div class="d-flex gap-2 justify-content-end">
          <button @click="confirmDelete" class="common-button-gray">
            <i class="bi bi-trash me-1"></i>삭제
          </button>
          <button @click="goToEditPage" class="common-button">
            <i class="bi bi-pencil-square me-1"></i>수정
          </button>
          
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import BackButton from '@/components/common/BackButton.vue';
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
        console.log('fetchProjectDetails : ');
        console.log(response);
        if (response.status === 200) {
            project.value = response.data;
            teamNo.value = response.data.teamNo;
        }

        const leaderResponse = await apiClient.get(`/team/leader-role`, {params: { projectNo }});
        if (leaderResponse.data.isLeader) {
            leader.value = true;
        }
        teamNo.value = leaderResponse.data.teamNo;
        console.log('project : ');
        console.log(project.value);

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
:root {
  --primary-dark: #03045e;
  --primary: #0077b6;
  --secondary: #00b4d8;
  --light-blue: #90e0ef;
  --pale-blue: #caf0f8;
}

/* 배경 그라데이션 */
.bg-gradient {
  background: linear-gradient(135deg, var(--primary-dark), var(--primary));
}

.bg-light-blue {
  background-color: var(--pale-blue);
}

/* 커스텀 버튼 스타일 */
.custom-btn-primary {
  background-color: var(--primary);
  color: white;
  border: none;
  padding: 0.5rem 1.25rem;
  border-radius: 0.375rem;
  transition: all 0.2s ease-in-out;
}

.custom-btn-primary:hover {
  background-color: var(--primary-dark);
  transform: translateY(-1px);
}

.custom-btn-outline {
  background-color: transparent;
  color: var(--primary);
  border: 1px solid var(--primary);
  padding: 0.5rem 1.25rem;
  border-radius: 0.375rem;
  transition: all 0.2s ease-in-out;
}

.custom-btn-outline:hover {
  background-color: var(--primary);
  color: white;
  transform: translateY(-1px);
}

/* 커스텀 뱃지 스타일 */
.custom-badge-primary {
  background-color: var(--secondary);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
}

.custom-badge-secondary {
  background-color: var(--light-blue);
  color: var(--primary-dark);
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
}

/* 카드 스타일 */
.card {
  border-radius: 1rem;
  overflow: hidden;
  transition: box-shadow 0.3s ease-in-out;
}

.card:hover {
  box-shadow: 0 .5rem 1.5rem rgba(0, 0, 0, .15) !important;
}

/* 반응형 스타일 */
@media (max-width: 768px) {
  .card-header {
    padding: 1rem;
  }

  .card-body {
    padding: 1rem;
  }

  h3 {
    font-size: 1rem;
  }

  .custom-btn-primary,
  .custom-btn-outline {
    padding: 0.375rem 0.75rem;
    font-size: 0.875rem;
  }

  .custom-badge-primary,
  .custom-badge-secondary {
    padding: 0.2rem 0.5rem;
    font-size: 0.75rem;
  }
}

/* 애니메이션 효과 */
.card-header,
.custom-btn-primary,
.custom-btn-outline,
.custom-badge-primary,
.custom-badge-secondary {
  transition: all 0.2s ease-in-out;
}

/* common-button.css */

.common-button {
  padding: 0.5rem 1rem; /* px-4 py-2 */
  margin-left: 0.5rem; /* ml-2 */
  color: #e5e7eb; /* text-gray-200 */
  background-color: #1f2937; /* bg-gray-800 */
  border-radius: 0.375rem; /* rounded-md */
  transition: background-color 0.2s; /* hover transition */
  cursor: pointer;
}
.common-button:hover {
  background-color: #374151; /* hover:bg-gray-700 */
}

.common-button-gray:focus,
.common-button:focus {
  outline: none;
  background-color: #374151; /* focus:bg-gray-700 */
}

/* common-button-gray.css */

.common-button-gray {
  padding: 0.5rem 1rem; /* px-4 py-2 */
  margin-left: 0.5rem; /* ml-2 */
  background-color: #e9ecef; /* bg-gray-800 */
  border-radius: 0.375rem; /* rounded-md */
  transition: background-color 0.2s;
  cursor: pointer;
}

</style>
