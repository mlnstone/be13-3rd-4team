<template>
    <div>
        <div class="category-bar">
            <router-link to="/teams">
                <button class="category-button">팀</button>
            </router-link>
            <router-link to="/projects">
                <button class="category-button">프로젝트</button>
            </router-link>
            <router-link to="/teams/write">
                <button class="category-button">팀 생성</button>
            </router-link>
            <router-link to="/teams/write">
                <button class="category-button">내 팀</button>
            </router-link>
        </div>

        <SearchBar :size-options="sizeOptions" :post-sort-options="postSortOptions" :select-options="selectOptions" @search="handleSearch" />

        <div class="main-container">
            <div class="table-container">
                <div class="table-wrapper">
                    <table class="custom-table">
                        <thead class="table-header">
                            <tr>
                                <th>번호</th>
                                <th>제목</th>
                                <th>설명</th>
                                <th>상태</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="post in paginatedPosts" :key="post.no" @click="detailePage(post.no)" class="table-row">
                                <td>{{ post.no }}</td>
                                <td>{{ post.team.teamName }}</td>
                                <td>{{ post.team.teamIntroduce }}</td>
                                <td>{{ post.team.projectStatus }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- <PageNav v-if="postList.value.content.length > 0" :current-page="page.value" :items-per-page="parseInt(size.value)" :total-pages="postList.value.totalPages" @set-page="setPage" /> -->
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '@/api';
import PageNav from '@/components/common/PageNav.vue';
import SearchBar from '@/components/common/SearchBar.vue';

const router = useRouter();

const postList = ref({ content: [] });
const page = ref(1);
const size = ref(10);
const searchQuery = ref("");
const selectOption = ref("");
const boardType = ref("FREE");
const postSortOption = ref("LATEST");

const sizeOptions = ref([10, 20, 30]);
const postSortOptions = ref([{ value: "LATEST", label: "전체" }]);
const selectOptions = ref([
    { value: "", label: "전체" },
    { value: "teamName", label: "제목" },
    { value: "teamIntroduce", label: "설명" },
    { value: "projectStatus", label: "상태" }
]);

const paginatedPosts = computed(() => postList.value.content || []);

const fetchPostList = async () => {
    try {
        const params = {
            boardType: boardType.value,
            postSortOption: postSortOption.value,
            page: page.value - 1,
            size: size.value,
        };

        if (searchQuery.value && selectOption.value) {
            params[selectOption.value] = searchQuery.value;
        }

        const response = await apiClient.get("/team", { params });
        postList.value = response.data;
    } catch (error) {
        console.error("데이터를 불러오는 중 오류 발생", error);
        postList.value = { content: [] };
    }
};

const setPage = (newPage) => {
    page.value = newPage;
    fetchPostList();
};

const handleSearch = (searchParams) => {
    size.value = searchParams.size;
    postSortOption.value = searchParams.postSortOption;
    selectOption.value = searchParams.selectOption;
    searchQuery.value = searchParams.searchQuery;
    page.value = 1;
    fetchPostList();
};

const detailePage = (no) => {
    router.push(`/team/${no}`);
};

onMounted(fetchPostList);
</script>

<style scoped>
.category-bar {
    display: flex;
    padding: 1rem;
    gap: 1rem;
}

.category-button {
    padding: 0.5rem 1rem;
    background-color: #4f46e5;
    color: white;
    border-radius: 0.375rem;
}

.table-row:hover {
    background-color: #e5e7eb;
}
</style>
