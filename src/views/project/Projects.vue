<template>
    <main>
        <ProjectTable :projects="projects"/>
        <Pagination :pageInfo="pageInfo" 
            @change-page="changePage"/>
    </main>
</template>

<script setup>
    import apiClient from '@/api';
    import { onMounted, reactive, ref, watch } from 'vue';
    import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router';
    import ProjectTable from '@/components/tables/ProjectTable.vue';
    import Pagination from '@/components/common/Pagination.vue';

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

    // axios 사용법
    // const fetchDepartments = (page) => {
    //     apiClient.get(`/api/v1/university-service/departments?page=${page}&numOfRows=10`)
    //             // 비동기 통신이 성공적으로 완료되었을 때 호출되는 함수를 지정한다.
    //             .then((response) => {
    //                 console.log(response);
    //             })
    //             // 비동기 통신이 실패했을 때 호출되는 함수를 지정한다.
    //             .catch((error) => {
    //                 console.log(error);
    //             });
    // }

    // async / await 사용
    //   - 자바스크립트에서 비동기 작업을 효과적으로 처리할 수 있다.
    //   - 직접 axios를 사용할 때와 비교해 예외 처리가 간결해진다.
    //   - async는 비동기 작업을 포함하는 함수의 앞부분에 작성한다.
    //   - await는 async 함수 내에서만 작성할 수 있고 비동기 작업의 완료를 기다린다.
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
    // 이미 마운트 된 컴포넌트는 URI가 변경되었다고 해서 다시 마운트 되지 않는다.
    // 관찰 속성을 사용해서 currentRoute 변경이 감지되면 하위 컴포넌트를 다시 렌더링하도록 한다.
    // watch(currentRoute, () => {
    //     pageInfo.currentPage = parseInt(currentRoute.query.page) || 1;

    //     fetchDepartments(pageInfo.currentPage);
    // });

    // 라우트가 변경될 때 특정 로직을 실행하는 훅(Hook)이다.
    onBeforeRouteUpdate((to, form) => {
        pageInfo.currentPage = parseInt(to.query.page) || 1;

        fetchProjects(pageInfo.currentPage);
    });

    onMounted(() => {
        fetchProjects(pageInfo.currentPage);
    });
</script>

<style scoped>

</style>