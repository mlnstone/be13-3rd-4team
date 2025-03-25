import {defineStore} from "pinia";
import apiClient from "@/api/index.js";
import {reactive, ref} from "vue";
import {useRoute, useRouter} from "vue-router";

export const projectAuthStore = defineStore('project', ()=>{ 
  
  // projects 
  const projects = ref([]);
  const currentRoute = useRoute();
  const router = useRouter();
  const pageInfo = reactive({
    // 값을 정수로 변환하고 실패하면 1을 기본값으로 사용
    currentPage: parseInt(currentRoute.query.page) || 1,
    totalCount: 0, // 전체 데이터 수
    pageLimit: 5, // 페이지네이션에 보이는 페이지의 수
    listLimit: 0 // 한 페이지에 표시될 리스트의 수
  });

  const fetchProjects = async (page) => {
    try {
      const response = await apiClient.get(`/project/search?page=${page - 1}&size=10`);

      projects.value = response.data.content;
      pageInfo.totalCount = response.data.totalElements;
      pageInfo.listLimit = 10;
    } catch (error) {

      console.log(error);
    }
  }

  const changePage = ({page, totalPages}) => {
    if (page >= 1 && page <= totalPages) {
      router.push({name: 'projects', query: {page}});
    }
  };

  const itemClick = (no) => {
    router.push({name: 'project/no', params: {no}})
  };

  const deleteProject = async (no) => {
    console.log(no);

    try {
      const response = await apiClient.delete(
        `/project/${no}`
      );

      if (response.data.code === 200) {
        alert('정상적으로 삭제되었습니다.');

        fetchProjects(pageInfo.currentPage);
      }
    } catch (error) {
    
    }
    }
    
    
    // AddProject
    const initFormData = reactive({
      name: '',
      content: '',
      teamNo: '',
      projectStatus: 'OPEN'
    });

  const formSubmit = async (formData) => {
      try {
        const response = await apiClient.post(
          '/project',
          formData
        );
  
        if (response.data.code === 201) {
          alert('정상적으로 등록되었습니다.');
  
          router.push({ name: 'projects' });
        }
      } catch (error) {
        if (error.response.data.code === 400) {
          alert('프로젝트 정보를 모두 입력해 주세요');
        } else {
          alert('에러가 발생했습니다');
        }
      }
    }


    return { projects, pageInfo, initFormData, fetchProjects, changePage, itemClick, deleteProject,  formSubmit};


  });