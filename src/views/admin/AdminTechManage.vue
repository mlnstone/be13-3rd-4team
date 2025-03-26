<template>
  <div class="tech-manager">
    <h2>기술 관리</h2>

    <button class="add-btn" @click="showForm = !showForm">
      {{ showForm ? '입력 취소' : '기술 추가하기' }}
    </button>

    <div v-if="showForm" class="form">
      <input v-model="newTechName" placeholder="기술명 입력" />
      <button @click="createTech">추가</button>
    </div>

    <table>
      <thead>
      <tr>
        <th>#</th>
        <th>기술명</th>
        <th>삭제</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(tech, index) in techs" :key="tech.no">
        <td>{{ index + 1 }}</td>
        <td>{{ tech.techName }}</td>
        <td>
          <button @click="deleteTech(tech.no)">삭제</button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import apiClient from "@/api";

const techs = ref([])
const newTechName = ref('')
const showForm = ref(false)

const fetchTechs = async () => {
  try {
    const res = await apiClient.get('/techs/get', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })
    techs.value = res.data
  } catch (err) {
    console.error('기술 조회 실패', err)
    alert('기술 목록을 불러오지 못했습니다.')
  }
}

const createTech = async () => {
  if (!newTechName.value.trim()) return alert('기술명을 입력해주세요.')
  try {
    await apiClient.post(
        '/techs/create',
        { techName: newTechName.value },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
    )
    alert('기술이 추가되었습니다.')
    newTechName.value = ''
    showForm.value = false
    fetchTechs()
  } catch (err) {
    console.error('기술 생성 실패', err)
    alert(err.response?.data?.message || '생성 실패')
  }
}

const deleteTech = async (techNo) => {
  if (!confirm('정말 삭제하시겠습니까?')) return
  try {
    await apiClient.delete(`/techs/${techNo}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })
    alert('삭제되었습니다.')
    fetchTechs()
  } catch (err) {
    console.error('삭제 실패', err)
    alert('삭제 실패')
  }
}

onMounted(fetchTechs)
</script>

<style scoped>
.tech-manager {
  max-width: 600px;
  margin: 40px auto;
  padding: 30px;
  background: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  font-family: 'Segoe UI', sans-serif;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
}

.add-btn {
  display: block;
  margin: 0 auto 20px;
  padding: 10px 20px;
  background-color: #1976d2;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.add-btn:hover {
  background-color: #125a9c;
}

.form {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 20px;
}

.form input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
  width: 60%;
}

.form button {
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.form button:hover {
  background-color: #3e8e41;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

th {
  background-color: #1976d2;
  color: white;
  padding: 12px;
  font-size: 15px;
}

td {
  padding: 12px;
  text-align: center;
  font-size: 14px;
  border-bottom: 1px solid #eee;
}

td button {
  padding: 6px 12px;
  background-color: #e53935;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s ease;
}

td button:hover {
  background-color: #c62828;
}
</style>