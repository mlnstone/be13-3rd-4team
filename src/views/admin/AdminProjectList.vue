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
          <RouterLink :to="`/projects/${project.no}`" class="project-title-link">
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
import apiClient from "@/api";

const projects = ref([])
const currentPage = ref(0)
const totalPages = ref(1)
const sortOption = ref('LATEST')

const fetchProjects = async () => {
  try {
    const res = await apiClient.get(`/admin/projects`, {
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
    await apiClient.delete(`/project/${projectNo}`, {
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

<style scoped>.project-list-container {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
}

h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
  font-weight: bold;
  font-size: 1.5rem;
}

.sort-container {
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.95rem;
  color: #444;
}

label {
  font-weight: 600;
  color: #555;
}

select {
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  background-color: white;
  font-size: 0.9rem;
}

/* 테이블 디자인 */
table {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  margin-top: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

th, td {
  padding: 12px 15px;
  text-align: center;
  border-bottom: 1px solid #ddd;
  font-size: 0.9rem;
  color: #444;
}

th {
  background-color: #4c6ef5;
  color: white;
  font-weight: bold;
}

tr:hover {
  background-color: #f7faff;
}

/* 삭제 버튼 */
button {
  padding: 6px 14px;
  background-color: #ff5c5c;
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-size: 0.85rem;
}

button:hover {
  background-color: #ff3b3b;
}

/* 페이징 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 25px;
  gap: 10px;
}

.pagination button {
  background-color: #4a90e2;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.85rem;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.pagination button:disabled {
  background-color: #bbb;
  cursor: not-allowed;
}

.pagination span {
  font-size: 0.9rem;
  color: #333;
}

/* 프로젝트 제목 링크 */
.project-title-link {
  color: #4c6ef5;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
}

.project-title-link:hover {
  text-decoration: underline;
  font-weight: bold;
}
</style>
