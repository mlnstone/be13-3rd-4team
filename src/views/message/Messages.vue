<template>
    <main>
        <MessageTable :messages="messages"
            @item-click="itemClick" @delete-message="deleteMessage" @fetch-message="fetchMessages"/>
        <Pagination :pageInfo="pageInfo" 
            @change-page="changePage"/>
    </main>
</template>

<script setup>
    import apiClient from '@/api';
    import { onMounted, reactive, ref, watch } from 'vue';
    import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router';
    import MessageTable from '@/components/tables/MessageTable.vue';
    import Pagination from '@/components/common/Pagination.vue';

    const messages = ref([]);
    const currentRoute = useRoute();
    const router = useRouter();
    const pageInfo = reactive({
        // 값을 정수로 변환하고 실패하면 1을 기본값으로 사용
        currentPage: parseInt(currentRoute.query.page) || 1,
        currentTab: 'received',  // 기본적으로 받은 쪽지 목록
        totalCount: 0, // 전체 데이터 수
        pageLimit: 5, // 페이지네이션에 보이는 페이지의 수
        listLimit: 0 // 한 페이지에 표시될 리스트의 수
    });

    const fetchMessages = async (page, tab) => {
        console.log('fetchMessages');
        console.log(page);
        console.log(tab);
        
        try {
            const response = await apiClient.get(`/messages?page=${page - 1}&size=10&sort=no,desc&type=${tab}`);

            console.log(response);
            messages.value = response.data.content;
            pageInfo.totalCount = response.data.totalElements;
            pageInfo.currentTab = tab;
            pageInfo.listLimit = 10;
        } catch (error) {
            if (error.response.data.code === 404) {
                alert(error.response.data.message);

                router.push({name: 'messages'});
            } else {
                alert('쪽지 목록을 불러오는 중에 오류가 발생했습니다.');
            }
        }
    }

    const changePage = ({page, totalPages}) => {
        if (page >= 1 && page <= totalPages) {
            router.push({name: 'messages', query: {page}});
        }
    };

    const itemClick = (no) => {
        console.log(no);
        router.push({name: 'messages/no', params: {no}});
    };

    // 쪽지 삭제
    const deleteMessage = async (no) => {
        try {
            const response = await apiClient.delete(`/messages/${no}`);

            if (response.status === 200) {
                alert('정상적으로 삭제되었습니다.');

                fetchMessages(pageInfo.currentPage, pageInfo.currentTab);
            }
        } catch (error)  {

        }
    }

    // 이미 마운트 된 컴포넌트는 URI가 변경되었다고 해서 다시 마운트 되지 않는다.
    // 관찰 속성을 사용해서 currentRoute 변경이 감지되면 하위 컴포넌트를 다시 렌더링하도록 한다.
    // watch(currentRoute, () => {
    //     pageInfo.currentPage = parseInt(currentRoute.query.page) || 1;

    //     fetchDepartments(pageInfo.currentPage);
    // });

    // 라우트가 변경될 때 특정 로직을 실행하는 훅(Hook)이다.
    onBeforeRouteUpdate((to, form) => {
        pageInfo.currentPage = parseInt(to.query.page) || 1;

        fetchMessages(pageInfo.currentPage, pageInfo.currentTab);
    });

    onMounted(() => {
        fetchMessages(pageInfo.currentPage, pageInfo.currentTab);
    });
</script>

<style scoped>
/* 메인 컨테이너 */
.main-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f9f9f9; /* 연한 배경 */
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1); /* 부드러운 그림자 */
}

/* 공통 텍스트 색상 */
h2, p, th, td, a {
  color: #353535; /* 글씨 색상 */
}

/* 테이블 스타일 */
table {
  width: 100%;
  border-collapse: collapse;
}

th {
  background-color: #0077b6; /* 테이블 헤더 배경 */
  color: white; /* 테이블 헤더 글씨 */
  padding: 1rem;
  font-size: 1rem;
  text-align: left;
}

td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #ddd;
  color: #353535; /* 셀 텍스트 색상 */
}

/* 테이블 행 hover 효과 */
tr:hover {
  background-color: #e0f4ff; /* 연한 파랑 음영 */
}

/* 버튼 스타일 */
button {
  background-color: #0077b6; /* 주요 버튼 배경 */
  color: white; /* 버튼 텍스트 */
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out, transform 0.2s;
}

button:hover {
  background-color: #005fa3; /* hover 버튼 음영 */
  transform: translateY(-2px); /* 가벼운 부각 효과 */
}

button:active {
  transform: translateY(0); /* 클릭하면 원래 위치로 */
}

/* 페이지네이션 스타일 */
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.pagination-container button {
  margin: 0 0.25rem;
  background-color: #0077b6; /* 페이지 버튼 색상 */
  color: white;
  padding: 0.5rem 0.75rem;
  font-size: 0.9rem;
  border-radius: 4px;
}

.pagination-container button:hover {
  background-color: #005fa3;
}

/* 비활성화 버튼 */
.pagination-container button:disabled {
  background-color: #ccc;
  color: #666;
  cursor: not-allowed;
}
</style>
