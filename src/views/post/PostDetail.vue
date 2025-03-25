<template>
    <div>
    <div class="max-w-7xl w-full mx-auto p-4 bg-white">
    
        <div class="flex items-center space-x-4 mb-6">
        <img src="https://cdn.startupful.io/img/app_logo/no_img.png" alt="Author Avatar" class="w-12 h-12 rounded-full" />
        <div>
            <h3 class="font-semibold">{{ post.userName }}</h3>
            <p class="text-gray-500 text-sm">
            {{ new Date(post.createdAt).toLocaleDateString() }}
            </p>
        </div>
        </div>

        <!-- Main Content -->
        <div class="space-y-6">
        <!-- 제목 -->
        <h1 class="text-3xl font-bold text-black">
            {{ post.title }}
        </h1>

        <!-- 내용 -->
        <div class="prose max-w-none text-black">
            <p class="text-gray-500 leading-relaxed">
            {{ post.content }}
            </p>
        </div>
        </div>

        <!-- 북마크 버튼 -->
        <div class="bookmark-section">

        {{ post.bookmarkCount }}
        <button
            @click="toggleBookmark"
        :class="{ 'bookmarked': post.bookmarked }"
        :disabled="post.postStatus === 'INACTIVE'"
        class="bookmark-btn"
        >

            북마크
        </button>

        </div>


        <!-- 수정 삭제 -->
        <div>
        <br />
        <button class="px-3 py-1 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none" @click="goToEditPage">수정</button>
        <button class="px-3 py-1 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none" @click="confirmDelete(post.postNo)">삭제</button>
        </div>
    </div>
    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import apiClient from '@/api';
    import { useAuthStore } from '@/stores/auth.js';

    const route = useRoute();
    const router = useRouter();
    const postNo = Number(route.params.postNo);
    const post = ref({});
    const authStore = useAuthStore();

    const fetchPostDetail = async () => {
    try {
        const response = await apiClient.get(`/posts/${postNo}/with-comments`);
        post.value = response.data;

        const bookmarkState = localStorage.getItem(`bookmark_${postNo}`);
        if (bookmarkState !== null) {
        post.value.bookmarked = bookmarkState === 'true';
        }
    } catch (error) {
        console.error('게시글 불러오기 실패:', error);
    }
    };

    const goToEditPage = () => {
    router.push({
        name: 'posts/add',
        query: {
        postNo: post.value.postNo,
        title: post.value.title,
        content: post.value.content,
        boardType: post.value.boardType,
        },
    });
    };

    const toggleBookmark = async () => {
    if (post.value.postStatus === 'INACTIVE') {
        alert('비활성화된 게시글은 북마크 추가가 불가능합니다.');
        return;
    }

    const previousState = post.value.bookmarked;
    post.value.bookmarked = !previousState;
    post.value.bookmarkCount += previousState ? -1 : 1;

    try {
        const response = await apiClient.post(`/posts/${postNo}/bookmark`, {}, {
        headers: {
            Authorization: `Bearer ${authStore.getUserInfo().accessToken}`
        }
        });

        localStorage.setItem(`bookmark_${postNo}`, post.value.bookmarked.toString());
    } catch (error) {
        post.value.bookmarked = previousState;
        post.value.bookmarkCount += previousState ? 1 : -1;
        alert('북마크 처리에 실패했습니다.');
    }
    };

    const confirmDelete = async (postNo) => {
    if (!confirm('정말로 삭제하시겠습니까?')) return;
    
    try {
        const response = await apiClient.delete(`/posts/${postNo}`, {
        headers: {
            Authorization: `Bearer ${authStore.getUserInfo().accessToken}`
        }
        });
        alert('삭제되었습니다.');
        router.push('/posts');
    } catch (error) {
        alert('게시글 삭제에 실패했습니다.');
    }
    };

    onMounted(fetchPostDetail);
</script>

<style scoped>
    /* Author Section */
    .flex {
        display: flex;
    }
    
    .items-center {
        align-items: center;
    }
    
    .space-x-4 > * + * {
        margin-left: 1rem;
    }
    
    .mb-6 {
        margin-bottom: 1.5rem;
    }
    
    .w-12,
    .h-12 {
        width: 3rem;
        height: 3rem;
    }
    
    .rounded-full {
        border-radius: 9999px;
    }
    
    .font-semibold {
        font-weight: 600;
    }
    
    .text-gray-500 {
        color: #6b7280;
    }
    
    .text-sm {
        font-size: 0.875rem;
    }
    
    /* Main Content */
    .space-y-6 > * + * {
        margin-top: 1.5rem;
    }
    
    .text-3xl {
        font-size: 1.875rem;
    }
    
    .font-bold {
        font-weight: 700;
    }
    
    .text-black {
        color: #000;
    }
    
    .prose p {
        color: #6b7280;
        line-height: 1.625;
    }
    
    .max-w-none {
        max-width: none;
    }
    
    /* 수정 삭제 버튼 */
    .mt-4 {
        margin-top: 1rem;
    }
    
    .px-3,
    .py-1 {
        padding: 0.25rem 0.75rem;
    }
    
    .text-white {
        color: #fff;
    }
    
    .bg-indigo-600 {
        background-color: #4f46e5;
    }
    
    .rounded-md {
        border-radius: 0.375rem;
    }
    
    .hover\:bg-indigo-500:hover {
        background-color: #4338ca;
    }
    
    .focus\:outline-none:focus {
        outline: none;
    }
    
    .text-gray-700 {
        color: #374151;
    }
    
    .bg-gray-200 {
        background-color: #e5e7eb;
    }
    
    .hover\:bg-gray-300:hover {
        background-color: #d1d5db;
    }
    
    
    /* 북마크 버튼 스타일 추가 */
    .bookmark-section {
        margin-top: 1rem;
        text-align: right;
    }
    
    .bookmark-btn {
        background-color: #e5e7eb;
        color: #fff;
        border: none;
        padding: 8px 12px;
        border-radius: 5px;
        cursor: pointer;
    }
    
    .bookmark-btn.bookmarked {
        color: #fff;
        background-color: #e6d44b;
    }
</style>