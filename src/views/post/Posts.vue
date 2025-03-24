<template>
    <main>
        <PostTable :posts="posts"
            @item-click="itemClick" @delete-post="deletePost"/>
        <Pagination :pageInfo="pageInfo" 
            @change-page="changePage"/>
    </main>
</template>

<script setup>
    import apiClient from '@/api';
    import { onMounted, reactive, ref, watch } from 'vue';
    import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router';
    import PostTable from '@/components/tables/PostTable.vue';
    import Pagination from '@/components/common/Pagination.vue';

    const posts = ref([]);
    const currentRoute = useRoute();
    const router = useRouter();
    const pageInfo = reactive({
        // 값을 정수로 변환하고 실패하면 1을 기본값으로 사용
        currentPage: parseInt(currentRoute.query.page) || 1,
        totalCount: 0, // 전체 데이터 수
        pageLimit: 5, // 페이지네이션에 보이는 페이지의 수
        listLimit: 0 // 한 페이지에 표시될 리스트의 수
    });

    const fetchPosts = async (page) => {
        try {
            const params = {
                boardType: this.boardType
            }
            const response = await apiClient.get(`/posts?page=${page - 1}&size=10`);

            console.log(response);
            messages.value = response.data.content;
            pageInfo.totalCount = response.data.totalElements;
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

</style>