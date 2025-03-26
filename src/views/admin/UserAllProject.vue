<template>
  <div class="user-project-list">
    <h2>{{ userName }} 님의 모든 프로젝트</h2>
    <table>
      <thead>
        <tr>
          <th>번호</th>
          <th>프로젝트명</th>
          <th>팀명</th>
          <th>내용</th>
          <th>상태</th>
          <th>조회수</th>
          <th>사용 기술</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(project, index) in projects" :key="project.no">
          <td>{{ currentPage * 10 + index + 1 }}</td>
          <td>
            <RouterLink :to="`/projects/${project.no}`" class="project-title-link">
              {{ project.name }}
            </RouterLink>
          </td>
          <td>{{ project.teamName }}</td>
          <td>{{ project.content }}</td>
          <td>{{ project.projectStatus }}</td>
          <td>{{ project.view }}</td>
          <td>{{ project.projectTeches.join(', ') }}</td>
        </tr>
      </tbody>
    </table>

    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 0">이전</button>
      <span>{{ currentPage + 1 }} / {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage >= totalPages - 1">다음</button>
    </div>

    <button @click="goBack" class="back-btn">뒤로가기</button>
  </div>
</template>

<script setup>
import apiClient from "@/api";
import { RouterLink } from "vue-router";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const userNo = route.params.userNo;

const projects = ref([]);
const userName = ref('');
const currentPage = ref(0);
const totalPages = ref(1);

const fetchUserName = async () => {
  try {
    const res = await apiClient.get(`/admin/user/${userNo}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    });
    userName.value = res.data.username;
  } catch (error) {
    console.error('유저 정보를 불러오는 중 오류 발생:', error);
  }
};

const fetchProjects = async () => {
  try {
    fetchUserName();
    const res = await apiClient.get(`/admin/user/${userNo}/projects`, {
      params: {
        page: currentPage.value,
        size: 10
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    });
    projects.value = res.data.content;
    totalPages.value = Math.max(1, res.data.totalPages);
  } catch (error) {
    console.error('프로젝트 정보를 불러오는 중 오류 발생:', error);
  }
};

const prevPage = () => {
  if (currentPage.value > 0) {
    currentPage.value--;
    fetchProjects();
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++;
    fetchProjects();
  }
};

const goBack = () => {
  router.back();
};

onMounted(fetchProjects);
</script>

<style scoped>
.user-project-list {
  max-width: 960px;
  margin: 3rem auto;
  padding: 2rem;
  background-color: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.user-project-list h2 {
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  color: #343a40;
  text-align: center;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
}

th,
td {
  padding: 1rem;
  text-align: center;
  border-bottom: 1px solid #dee2e6;
}

th {
  background-color: #e9ecef;
  color: #495057;
  font-weight: 600;
}

tr:hover {
  background-color: #f1f3f5;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
}

.pagination button {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  background-color: #4c6ef5;
  color: white;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.pagination button:hover {
  background-color: #3b5bdb;
}

.pagination button:disabled {
  background-color: #ced4da;
  color: #495057;
  cursor: not-allowed;
}

.back-btn {
  display: block;
  margin: 1.5rem auto 0;
  padding: 0.75rem 2rem;
  background-color: #adb5bd;
  border: none;
  border-radius: 6px;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.back-btn:hover {
  background-color: #868e96;
}

.project-title-link {
  color: #212529;
  text-decoration: none;
}

.project-title-link:hover {
  text-decoration: underline;
  font-weight: bold;
}
</style>
