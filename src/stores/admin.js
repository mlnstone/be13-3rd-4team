import {defineStore} from "pinia";
import {computed, onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import axios from "axios";
import AdminUserList from "@/views/admin/UserList.vue";
import FeedbackList from "@/views/admin/FeedbackList.vue";
import AdminProjectList from "@/views/admin/AdminProjectList.vue";
import TechManager from "@/views/admin/AdminTechManage.vue";

export const adminAuthStore = defineStore('admin', () => {
  // AdminLogin

  const username = ref('')
  const password = ref('')
  const errorMessage = ref('')

  const handleLogin = async () => {
    try {
      const response = await axios.post(`http://localhost:8087/admin/login`, {
        username: username.value,
        password: password.value,
      });

      // 로그인 성공 시 토큰 저장 (예: localStorage)
      localStorage.setItem('accessToken', response.data.accessToken)
      localStorage.setItem('refreshToken', response.data.refreshToken)

      // 관리자 페이지로 이동
      router.push('/admin')
    } catch (error) {
      errorMessage.value = error.response?.data?.message || '로그인 실패'
    }
  }
  
  // AdminMain

  const tabs = [
    { name: 'AdminUserList', label: '회원 관리' },
    { name: 'FeedbackList', label: '피드백 관리' },
    { name: 'AdminProjectList', label: '프로젝트 관리' },
    { name: 'TechManager', label: '기술 관리' },
  ]

  const activeTab = ref('AdminUserList')

  const componentsMap = {
    AdminUserList,
    FeedbackList,
    AdminProjectList,
    TechManager,
  }

  const activeTabComponent = computed(() => componentsMap[activeTab.value])
  
  
  //AdminProjectList

  const projects = ref([])

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
  
  // AdminTechMAnage

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
  
  // AllUserComments


  const route = useRoute();
  const router = useRouter();
  const userNo = route.params.userNo;

  const comments = ref([]);
  const userName = ref('');
  const currentPage = ref(0);
  const totalPages = ref(1);

  const fetchUserName = async () => {
    try {
      const res = await axios.get(`http://localhost:8087/admin/user/${userNo}`, { // ✅ 올바른 경로로 수정
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      });
      userName.value = res.data.username;
    } catch (error) {
      console.error('유저 정보를 불러오는 중 오류 발생:', error);
    }
  };

  const fetchComments = async () => {
    try {
      await fetchUserName(); // ✅ 먼저 유저 정보를 가져옴

      const res = await axios.get(`http://localhost:8087/admin/user/${userNo}/comments?page=${currentPage.value}&size=10`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      });

      comments.value = res.data.content;
      totalPages.value = res.data.totalPages;



    } catch (error) {
      console.error("댓글을 불러오는 데 실패했습니다:", error);
    }
  };

  const deleteComment = async (commentNo) => {
    const confirmed = confirm("정말 이 댓글을 삭제하시겠습니까?");
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:8087/comments/${commentNo}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      });
      // 삭제 후 댓글 목록 다시 불러오기
      fetchComments();
    } catch (error) {
      console.error("댓글 삭제에 실패했습니다:", error);
      alert("댓글 삭제에 실패했습니다.");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const prevPage = () => {
    if (currentPage.value > 0) {
      currentPage.value--;
      fetchComments();
    }
  };

  const nextPage = () => {
    if (currentPage.value < totalPages.value - 1) {
      currentPage.value++;
      fetchComments();
    }
  };

  const goBack = () => {
    router.back();
  };

  // FeedbackList
  const feedbacks = ref([])

  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get(`http://localhost:8087/admin/feedbacks`, {
        params: { page: currentPage.value, size: 10 },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      feedbacks.value = res.data.content
      totalPages.value = res.data.totalPages
    } catch (err) {
      console.error('피드백 목록 불러오기 실패:', err)
    }
  }

  const changePage = (page) => {
    if (page >= 0 && page < totalPages.value) {
      currentPage.value = page
      fetchFeedbacks()
    }
  }

  const deleteFeedback = async (feedbackNo) => {
    if (!confirm('정말 삭제하시겠습니까?')) return
    try {
      await axios.delete(`http://localhost:8087/feedback/${feedbackNo}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      alert('삭제되었습니다')
      fetchFeedbacks()
    } catch (err) {
      console.error('삭제 실패:', err)
      alert('삭제 실패')
    }
  }

  const goToProject = (projectNo) => {
    if (projectNo) {
      router.push(`/project/${projectNo}`)
    }
  }
  
  // UserAllPost
  

  const posts = ref([]);
  const boardType = ref(localStorage.getItem("boardType") || 'FREE'); // 기본값 설정

  const fetchUserName = async () => {
    try {
      const res = await axios.get(`http://localhost:8087/admin/user/${userNo}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
      });
      userName.value = res.data.username;
    } catch (error) {
      console.error('유저 정보를 불러오는 중 오류 발생:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      await fetchUserName();
      const res = await axios.get(`http://localhost:8087/admin/user/${userNo}/posts`, {
        params: {
          boardType: boardType.value,
          page: currentPage.value,
        },
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
      });

      posts.value = res.data.content;
      totalPages.value = Math.max(1, res.data.totalPages);
    } catch (error) {
      console.error('게시글을 불러오는 중 오류 발생:', error);
    }
  };

  const deletePost = async (postNo) => {
    const confirmed = confirm("정말 이 게시글을 삭제하시겠습니까?");
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:8087/posts/${postNo}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      });

      fetchPosts();
    } catch (error) {
      console.error("게시글 삭제에 실패했습니다:", error);
      alert("게시글 삭제에 실패했습니다.");
    }
  };
  
  // UserDetail
  const goToUserComments = () => {
    router.push(`/admin/user/${userNo}/comments`);
  };

  const goToUserPosts = () => {
    router.push(`/admin/user/${userNo}/posts`);
  };

  const goToUserProjects = () => {
    router.push(`/admin/user/${userNo}/projects`);
  };

  const toggleBanUser = async () => {
    if (!user.value) return;

    console.log(user);

    const confirmAction = confirm(user.value.banned ? "이 사용자의 정지를 해제하시겠습니까?" : "이 사용자를 정지하시겠습니까?");
    if (!confirmAction) return;

    try {
      const res = await axios.post(
        `http://localhost:8087/${user.value.username}/ban`,
        { username: user.value.username, ban: !user.value.banned }, // 현재 반대 상태로 전송
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json"
          }
        }
      );

      alert(res.data.message); // "Successfully" 메시지 출력
      user.value.banned = !user.value.banned; // UI 업데이트

    } catch (error) {
      console.error("유저 정지 처리 중 오류 발생:", error);
      alert("유저 정지 처리에 실패했습니다.");
    }
  };
  const deleteUser = async () => {
    const confirmed = confirm("정말 이 유저를 삭제하시겠습니까?");
    if (!confirmed) return;

    try {
      const res = await axios.post(`http://localhost:8087/admin/delete/${userNo}`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      });

      alert(res.data.message || "삭제가 완료되었습니다.");
      router.push('/admin'); // 유저 리스트 페이지 등으로 이동

    } catch (error) {
      console.error("유저 삭제 중 오류 발생:", error);
      alert("유저 삭제에 실패했습니다.");
    }
  };

  
  // UserList
  const userList = ref([])
  const currentPage = ref(1)
  const totalPages = ref(1)
  const pageGroupStart = ref(1)
  const pageGroupSize = 10
  const sortOption = ref('LATEST')

  const pageGroupEnd = computed(() => {
    return Math.min(pageGroupStart.value + pageGroupSize - 1, totalPages.value)
  })

  const pageNumbers = computed(() => {
    return Array.from({ length: pageGroupEnd.value - pageGroupStart.value + 1 }, (_, i) => i + pageGroupStart.value)
  })

  const fetchUsers = async () => {
    try {
      const res = await fetch(`http://localhost:8087/admin/users?page=${currentPage.value - 1}&size=10&sortOption=${sortOption.value}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      const data = await res.json()
      userList.value = data.content
      totalPages.value = data.totalPages
    } catch (error) {
      console.error('유저 목록 가져오기 실패:', error)
    }
  }

  const moveToPage = (page) => {
    currentPage.value = page
    sessionStorage.setItem('userListPage', page)
    fetchUsers()
  }

  const prevPageGroup = () => {
    if (pageGroupStart.value > 1) {
      pageGroupStart.value -= pageGroupSize
      currentPage.value = pageGroupStart.value
      fetchUsers()
    }
  }

  const nextPageGroup = () => {
    if (pageGroupEnd.value < totalPages.value) {
      pageGroupStart.value += pageGroupSize
      currentPage.value = pageGroupStart.value
      fetchUsers()
    }
  }

  const goToUserDetail = (userNo) => {
    sessionStorage.setItem('fromUserList', 'true')
    router.push(`/admin/user/${userNo}`)
  }



});