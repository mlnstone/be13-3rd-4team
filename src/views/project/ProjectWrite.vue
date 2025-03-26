<template>
    <div>
      <div class="mt-8 page-container">
        <div class="mt-4">
          <div class="p-6 bg-white rounded-md shadow-md">
            <h2 class="text-lg font-semibold text-gray-700 capitalize">
              {{ isEditMode ? "프로젝트 수정" : "프로젝트 생성" }}
            </h2>
  
            <form @submit.prevent="submitForm">
              <div class="grid grid-cols-1 gap-6 mt-4">
                <div>
                  <label class="text-gray-700" for="name">제목</label>
                  <input
                    type="text"
                    v-model="name"
                    class="w-full mt-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
                  />
                </div>
  
                <div>
                  <label class="text-gray-700" for="content">내용</label>
                  <textarea
                    v-model="content"
                    class="w-full mt-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
                  ></textarea>
                </div>
  
                <div class="form-group">
                  <label class="text-gray-700" for="projectStatus">프로젝트 타입</label>
                  <select
                    v-model="projectStatus"
                    class="w-full mt-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
                  >
                    <option value="OPEN">공개</option>
                    <option value="CLOSED">닫힘</option>
                    <option value="IN_PROGRESS">진행중</option>
                    <option value="COMPLETE">완료</option>
                  </select>
                </div>
  
                <div>
                  <ProjectTechList
                    :initialTechs="initialTechs"
                    @selectedTechs="handleSelectedTechs"
                  />
                </div>
              </div>
  
              <div class="flex justify-end mt-4">
                <button type="button" @click="router.back()"
                    class="px-4 py-2 ml-2 text-gray-200 bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus:bg-gray-700">
                    취소
                </button>
                <button
                  type="submit"
                  class="px-4 py-2 text-gray-200 bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
                >
                  {{ isEditMode ? "수정" : "저장" }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import apiClient from '@/api';
import { useAuthStore } from '@/stores/auth';
import ProjectTechList from '@/components/project/ProjectTechList.vue';

const route = useRoute();
const router = useRouter();

const name = ref(route.query.name || "");
const content = ref(route.query.content || "");
const projectStatus = ref(route.query.projectStatus || "OPEN");
const projectNo = ref(route.query.projectNo || null);
const teamNo = ref(route.query.teamNo || null);
const isEditMode = ref(!!route.query.name);
const initialTechs = ref(route.query.techsNo || []);
const selectedTechs = ref([]);

const handleSelectedTechs = (techs) => {
    selectedTechs.value = techs.map(item => item.no);
};

const submitForm = async () => {
    const params = {
        name: name.value,
        content: content.value,
        projectStatus: projectStatus.value,
        teamNo: teamNo.value,
        techsNo: selectedTechs.value,
    };

    try {
        if (isEditMode.value) {
            await apiClient.post(`/project/${projectNo.value}?projectStatus=${projectStatus.value}`, params);
            alert('프로젝트가 수정되었습니다.');
            router.push(`/projects/${projectNo.value}`);
        } else {
            const response = await apiClient.post('/project', params);
            alert('프로젝트가 생성되었습니다.');
            router.push(`/teams/${teamNo.value}`);
        }
    } catch (error) {
        alert(error.response?.data.message || '알 수 없는 오류 발생');
    }
};
</script>
<style scoped>
/* 중앙 정렬 및 화면 폭 제한 */
.page-container {
  max-width: 800px; /* 최대 폭을 지정해 게시판 느낌을 줌 */
  margin: 0 auto;   /* 중앙 정렬 */
}

/* 여백 설정 */
.mt-8 {
  margin-top: 2rem;
}
.mt-4 {
  margin-top: 1rem;
}
.justify-end {
    justify-content: flex-end;
    display: flex;
}

/* 카드 레이아웃과 배경, 테두리 등 */
.p-6 {
  padding: 1.5rem;
}
.bg-white {
  background-color: #ffffff; /* 흰색 배경 */
}
.rounded-md {
  border-radius: 0.375rem;
}
.shadow-md {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* 폼 요소 공통 스타일 */
input[type="text"],
textarea,
select {
  width: 100%;           /* 가로로 꽉 차도록 */
  border: 1px solid #d1d5db; /* 연한 회색 */
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}
textarea {
  min-height: 200px; /* 내용 칸의 최소 높이 */
}

/* 포커스 시 강조 */
input[type="text"]:focus,
textarea:focus,
select:focus {
  outline: none;
  border-color: #6366f1; /* 인디고 색상 */
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
}

/* 버튼 스타일 */
button[type="submit"] {
  padding: 0.5rem 1.5rem;
  background-color: #374151; /* 어두운 회색 */
  color: #f9fafb;         /* 흰색에 가까운 색 */
  border: none;
  border-radius: 0.375rem;
  transition: background-color 0.2s;
  cursor: pointer;
}
button[type="submit"]:hover {
  background-color: #1f2937;
}
button[type="submit"]:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(55, 65, 81, 0.3);
}
</style>