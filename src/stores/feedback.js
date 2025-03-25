import {defineStore} from "pinia";
import {ref, watch} from "vue";
import {useRoute} from "vue-router";
import apiClient from "@/api";

export const feedbackAuthStore = defineStore('feedback', () => {
  
  // feedback Create
  
  // project feedback list
  const route = useRoute()
  const projectNo = route.params.projectNo

  const feedbacks = ref([])
  const currentPage = ref(0)
  const totalPages = ref(1)
  const pageSize = 10
  const loading = ref(false)
  const error = ref('')
  const editingFeedback = ref(null)
  const showForm = ref(false)


  const isTeamMember = ref(false)

  const user = JSON.parse(localStorage.getItem('user'))
  const currentUserName = user?.username || ''

  
  const fetchProjectFeedbacks = async () => {
    loading.value = true
    error.value = ''
    try {
      const res = await apiClient.get(`/feedback/list/${projectNo}`, {
        params: { page: currentPage.value, size: pageSize },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      feedbacks.value = res.data.content
      totalPages.value = res.data.totalPages
      isTeamMember.value = true 
    } catch (err) {
      console.error('피드백 불러오기 실패:', err)
      error.value = '피드백을 불러올 수 없습니다.'
      isTeamMember.value = false
    } finally {
      loading.value = false
    }
  }

  const deleteFeedback = async (feedbackNo) => {
    if (!confirm('정말 삭제하시겠습니까?')) return
    try {
      await apiClient.delete(`/feedback/${feedbackNo}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      alert('삭제되었습니다.')
      fetchProjectFeedbacks()
    } catch (err) {
      console.error('삭제 실패:', err)
      alert('삭제에 실패했습니다.')
    }
  }

  const startEdit = (feedback) => {
    editingFeedback.value = feedback
  }

  const cancelEdit = () => {
    editingFeedback.value = null
  }

  const onEditSuccess = () => {
    editingFeedback.value = null
    fetchProjectFeedbacks()
  }

  const onCreateSuccess = () => {
    showForm.value = false
    fetchProjectFeedbacks()
  }

  const toggleForm = () => {
    showForm.value = !showForm.value
    editingFeedback.value = null
  }

  const changePage = (page) => {
    if (page >= 0 && page < totalPages.value) {
      currentPage.value = page
      fetchProjectFeedbacks()
    }
  };

  // feedback create
  


  return {
    feedbacks,
    currentPage,
    totalPages,
    pageSize,
    loading,
    error,
    editingFeedback,
    showForm,
    isTeamMember,
    currentUserName,

    fetchProjectFeedbacks,
    deleteFeedback,
    startEdit,
    cancelEdit,
    onEditSuccess,
    onCreateSuccess,
    toggleForm,
    changePage,
    onSubmit
  }







});