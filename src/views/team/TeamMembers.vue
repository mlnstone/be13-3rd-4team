<template>
    <div>
        <!-- 분류바 -->
        <div class="category-bar">
            <button class="category-button" @click="writePage()">스케줄 목록</button>
            <button class="category-button" @click="memberPage()">팀원 목록</button>
        </div>

        <!-- 검색바 -->
        <SearchBar :size-options="sizeOptions" :post-sort-options="postSortOptions" :select-options="selectOptions"
            @search="handleSearch" />
        <!-- 테이블 -->
        <div class="main-container">
            <div class="table-container">
                <div class="table-wrapper">
                    <table class="custom-table">
                        <!-- 제목 -->
                        <thead class="table-header">
                            <tr>
                                <th class="header-cell width-80">번호</th>
                                <th class="header-cell width-350">이름</th>
                                <th class="header-cell">권한</th>
                                <th class="header-cell">상태</th>
                            </tr>
                        </thead>
                        <!-- 내용 -->
                        <tbody>
                            <tr v-for="(post, index) in postList" :key="post.no" class="table-row">
                                <td class="body-cell">{{ index + 1 }}</td>
                                <td class="body-cell"> {{ post.username }}</td>
                                <td class="body-cell">{{ post.isLeader ? '팀장' : '팀원' }}</td>
                                <td class="body-cell">{{ post.status }}</td>

                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import apiClient from '@/api';
import SearchBar from '@/components/common/SearchBar.vue';

const route = useRoute();
const router = useRouter();

// postList 초기값을 빈 객체로 설정
const postList = ref({ content: [] });
const selectOption = ref('Approved');
const teamNo = route.params.teamNo;
const leader = ref(false);
const sizeOptions = ref([10, 20, 30]);
const postSortOptions = ref([
  { value: 'LATEST', label: '최신순' },
]);
const selectOptions = ref([
    { value: 'Approved', label: '승인' },
    { value: 'Rejected', label: '거절' },
    { value: 'Pending', label: '대기' },
]);

  
  const fetchPostList = async () => {
    const leaderResponse = await apiClient.get(`/team/leader-role`, {params: { teamNo }});
        if (leaderResponse.data.isLeader) {
            leader.value = true;
            console.log('리더');
        }
    const params = {
        status: selectOption.value
    };

    try {
        // 팀장이면 모든 팀원 조회가능
        if(leader){
            const response = await apiClient.get(`/team/${teamNo}/setting/members`, { params });
            if (response.status === 200) {
                postList.value = response.data;
                
            } else {
                alert('데이터 조회 실패');
            }
        }else{
            const response = await apiClient.get(`/team/${teamNo}/setting/members/find`);
            if (response.status === 200) {
                postList.value = response.data;
                console.log(postList.value);
            } else {
                alert('데이터 조회 실패');
            }
        }
        console.log(selectOptions.value);

    } catch (error) {
    console.error('데이터를 불러오는 중 오류 발생', error);
    postList.value = [];

    }
};

const handleSearch = (searchParams) => {
    console.log(searchParams);
    selectOption.value = searchParams.selectOption;
    searchQuery.value = searchParams.searchQuery;
    fetchPostList();
};

onMounted(() => {
fetchPostList();
});

  const writePage = () => {
  router.push({
    name: 'ScheduleList',
    params: { teamNo }
  });
};

const memberPage = () => {
  router.push({
    name: 'TeamMembers',
    params: { teamNo }
  });
};
</script>

<style scoped>
.category-bar {

    display: flex;
    padding: 1rem;
    gap: 1rem;
    overflow-x: auto;
}

.category-button {
    border: none;
    padding: 0.5rem 1rem;
    font-weight: 500;
    text-transform: capitalize;
    color: white;
    background-color: #0077b6;
    /* 적용된 색상 */
    border-radius: 0.375rem;
    transition: background-color 0.2s ease;
}

.category-button:hover {
    background-color: #005fa3;
    /* 조금 더 어두운 음영 */
}

.select-box {
    width: 100%;
    padding: 0.5rem 1rem;
    border: 1px solid #0077b6;
    /* 테두리에 색상 적용 */
    border-radius: 0.375rem;
    background-color: white;
}

.search-input {
    width: 100%;
    padding: 0.5rem 2rem 0.5rem 2.5rem;
    border: 1px solid #0077b6;
    /* 테두리에 색상 적용 */
    border-radius: 0.375rem;
}

.main-container {
    margin-top: 1rem;
}

.table-container {
    margin-top: 1.5rem;
}

.table-wrapper {
    margin: 1.5rem 0;
    overflow: hidden;
    background-color: #ffffff;
    border-radius: 0.375rem;
    /* rounded-md */
    box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);
    /* shadow */
}

.custom-table {
    width: 100%;
    text-align: left;
    border-collapse: collapse;
}

.table-header {
    border-bottom: 1px solid #0077b6;
    /* 테두리에 색상 적용 */
}

.width-350 {
    width: 350px;
    text-align: left;
}

.width-80 {
    width: 80px;
}

.header-cell {
    padding: 0.75rem 1.25rem;
    /* px-5 py-3 */
    font-size: 0.875rem;
    /* text-sm */
    font-weight: 500;
    /* font-medium */
    text-transform: uppercase;
    color: white;
    background-color: #0077b6;
    /* 적용된 색상 */
}

.table-row {
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;
}

.table-row:hover {
    background-color: #e0f3ff;
    /* 연한 파랑 음영 */
}

.body-cell {
    padding: 1rem 1.5rem;
    /* px-6 py-4 */
    font-size: 1.125rem;
    /* text-lg */
    color: #353535;
    /* 텍스트에 색상 적용 */
    border-bottom: 1px solid #0077b6;
    /* 테두리에 색상 적용 */
}

.body-cell:first-child {
    font-weight: 500;
    /* 강조를 위해 font 추가 */
    color: #353535;
    /* 어두운 음영 */
}

.body-cell:hover {
    color: #353535;
    /* 텍스트에 어두운 음영 적용 */
}
</style>
