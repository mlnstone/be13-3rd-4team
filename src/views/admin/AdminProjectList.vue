<template>
  <div class="project-list-container">
    <h2>모든 프로젝트 목록</h2>

    <div class="sort-container">
      <label for="sortOption">정렬 기준:</label>
      <select id="sortOption" v-model="sortOption" @change="fetchProjects">
        <option value="LATEST">최신순</option>
        <option value="VIEW">조회수순</option>
      </select>
    </div>

    <table>
      <thead>
      <tr>
        <th>번호</th>
        <th>프로젝트명</th>
        <th>팀명</th>
        <th>상태</th>
        <th>조회수</th>
        <th>삭제</th>
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
        <td>{{ project.projectStatus }}</td>
        <td>{{ project.view }}</td>
        <td>
          <button @click="deleteProject(project.no)">삭제</button>
        </td>
      </tr>
      </tbody>
    </table>

    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 0">이전</button>
      <span>{{ currentPage + 1 }} / {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage >= totalPages - 1">다음</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const projects = ref([])
const currentPage = ref(0)
const totalPages = ref(1)
const sortOption = ref('LATEST')

const fetchProjects = async () => {
  try {
    const res = await axios.get(`http://localhost:8087/admin/projects`, {
      params: {
        page: currentPage.value,
        size: 10,
        projectSortOption: sortOption.value
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    })
    projects.value = res.data.content
    totalPages.value = res.data.totalPages
  } catch (err) {
    console.error('프로젝트 목록 불러오기 실패:', err)
  }
}

const deleteProject = async (projectNo) => {
  if (!confirm('정말 삭제하시겠습니까?')) return
  try {
    await axios.delete(`http://localhost:8087/project/${projectNo}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    })
    alert('삭제되었습니다.')
    fetchProjects()
  } catch (err) {
    console.error('삭제 실패:', err)
    alert('삭제 실패')
  }
}

const prevPage = () => {
  if (currentPage.value > 0) {
    currentPage.value--
    fetchProjects()
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++
    fetchProjects()
  }
}

onMounted(() => {
  fetchProjects()
})
</script>

<style scoped>
.project-list-container {
  padding: 20px;
}

.sort-container {
  margin-bottom: 1rem;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
}

th, td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: center;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}
.project-title-link {
  color: inherit;           /* 상위 글자 색상 그대로 */
  text-decoration: none;    /* 밑줄 제거 */
  font-weight: normal;      /* 기본 굵기 */
  transition: all 0.2s ease;
}

.project-title-link:hover {
  text-decoration: underline; /* 마우스 올리면 밑줄 생김 */
  font-weight: bold;          /* 글씨 굵어짐 */
}
</style>
