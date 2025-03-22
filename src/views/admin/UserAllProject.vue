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
          <RouterLink :to="`/project/${project.no}`" class="project-title-link">
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
import axios from "axios";
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
    const res = await axios.get(`http://localhost:8087/admin/user/${userNo}`, {
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
    const res = await axios.get(`http://localhost:8087/admin/user/${userNo}/projects`, {
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
  padding: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f4f4f4;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.pagination button {
  margin: 0 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}

.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.back-btn {
  display: block;
  margin: 1rem auto;
  padding: 0.75rem 1.5rem;
  border: none;
  background-color: #6c757d;
  color: white;
  cursor: pointer;
}

.back-btn:hover {
  background-color: #545b62;
}

.project-title-link {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

.project-title-link:hover {
  text-decoration: underline;
  font-weight: bold;
}
</style>
