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
import { ref, onMounted } from 'vue'
import axios from 'axios'

const techs = ref([])
const newTechName = ref('')
const showForm = ref(false)

const fetchTechs = async () => {
  try {
    const res = await axios.get('http://localhost:8087/techs/get', {
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
    await axios.post(
        'http://localhost:8087/techs/create',
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
    await axios.delete(`http://localhost:8087/techs/${techNo}`, {
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

</style>
