<template>
    <div>
        <div class="max-w-7xl w-full mx-auto p-4 bg-white">

            <div class="flex items-center space-x-4 mb-6">
                <img src="https://cdn.startupful.io/img/app_logo/no_img.png" alt="Author Avatar"
                    class="w-12 h-12 rounded-full" />
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

                <ProjectInfo :project="project" v-if="post.boardType === 'PROJECT_RECRUIT'" />
            </div>

            <!-- 북마크 버튼 -->
            <div class="bookmark-section">
                {{ post.bookmarkCount }}
                <button @click="toggleBookmark" :class="{bookmarked: post.bookmarked}" :disabled="post.postStatus === 'INACTIVE'" class="bookmark-btn">
                    <i class="fi fi-ss-bookmark-slash" :class="{'bookmark-icon': post.bookmarked}"></i>
                </button>

            <!-- 수정 삭제 -->
            <div>
                <br />
                <button
                    class="px-3 py-1 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none"
                    @click="goToEditPage">수정</button>
                <button
                    class="px-3 py-1 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none"
                    @click="confirmDelete(post.postNo)">삭제</button>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import apiClient from '@/api';
    import { useAuthStore } from '@/stores/auth.js';
    import ProjectInfo from '@/components/project/ProjectInfo.vue';

    const route = useRoute();
    const router = useRouter();
    const postNo = Number(route.params.postNo);
    const post = ref({});
    const authStore = useAuthStore();
    const project = ref({}); // 프로젝트 정보

    const fetchPostDetail = async () => {
    try {
        const response = await apiClient.get(`/posts/${postNo}/with-comments`);
        post.value = response.data;
        console.log(response.data);

        const bookmarkState = localStorage.getItem(`bookmark_${postNo}`);
        if (bookmarkState !== null) {
        post.value.bookmarked = bookmarkState === 'true';
        }

        if(post.value.boardType === 'PROJECT_RECRUIT'){
            console.log("안녕");
            await projectInfo();
        }

    } catch (error) {
        console.error('게시글 불러오기 실패:', error);
    }
};
    const projectInfo = async () => {
        try{
            const response = await apiClient.get(`/project/37`);
            if (response.status === 200) {
                project.value = response.data;
            }

        }catch(error){
            console.error('프로젝트 정보 불러오기 실패',error);
        }
    }

    const goToEditPage = () => {
    router.push({
        name: 'PostWrite',
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

<style>

@import url('https://cdn-uicons.flaticon.com/2.6.0/uicons-solid-straight/css/uicons-solid-straight.css');

/* 작성자 섹션 */
.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.space-x-4 > * + * {
  margin-left: 1rem; /* 작성자 이름 간격 */
}

.mb-6 {
  margin-bottom: 1.5rem; /* 작성자 섹션 하단 여백 */
}

.w-12,
.h-12 {
  width: 3rem;
  height: 3rem; /* 프로필 이미지 크기 */
}

.rounded-full {
  border-radius: 50%; /* 이미지 둥근 처리 */
}

.font-semibold {
  font-weight: 600;
  color: #353535; /* 작성자 이름 색상 */
}

.text-sm {
  font-size: 0.875rem;
  color: #6b7280; /* 작성자 날짜 색상 */
}

/* 본문 섹션 */
.space-y-6 > * + * {
  margin-top: 1.5rem; /* 섹션 간 간격 */
}

.text-3xl {
  font-size: 1.875rem;
  font-weight: bold;
  color: #353535; /* 제목 색상 */
}

.prose p {
  color: #6b7280;
  line-height: 1.625; /* 본문 내용 간격 */
}

.max-w-none {
  max-width: none; /* 본문 폭 제한 제거 */
}

/* 북마크 버튼 */
.bookmark-section {
  
  margin-top: 1rem;
  text-align: right; /* 북마크 버튼 오른쪽 정렬 */
}

.bookmark-btn {
  color: #d9d9d9; /* 북마크 버튼 테마 색상 */
  background-color: white;
  border: none;
  padding: 0.5rem 1rem;
  font-size: 1.5rem;
  border-radius: 5px; /* 버튼 라운드 */
  cursor: pointer;
  transition: transform 0.2s ease;

}

/* 북마크 활성화 */
.bookmark-btn.bookmarked {
  color: #ffd60a; /* 북마크 활성화 시 색상 */
  animation: bookmark-bounce 0.4s ease;

}



@keyframes bookmark-bounce {
  0% {
    transform: scale(1);
  }
  30% {
    transform: scale(1.2);
  }
  50% {
    transform: scale(0.8);
  }
  70% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}


/* 수정 버튼 */
.bg-indigo-600 {
  background-color: #0077b6; /* 수정 버튼 테마 */
  color: white; /* 수정 버튼 글씨 */
  border-radius: 0.375rem; /* 버튼 둥근 처리 */
  padding: 0.6rem 1rem; /* 수정 버튼 여백 */
  font-size: 0.875rem;
  border: none;
}

.hover\:bg-indigo-500:hover {
  background-color: #005fa3; /* 수정 버튼 hover */
}

/* 삭제 버튼 */
.bg-gray-200 {
  background-color: #e5e7eb; /* 삭제 버튼 회색 */
  color: #353535; /* 삭제 버튼 텍스트 색상 */
  padding: 0.6rem 1rem; /* 삭제 버튼 여백 */
  font-size: 0.875rem;
  border-radius: 0.375rem; /* 덜 둥근 모양 */
  border: none;
}

.hover\:bg-gray-300:hover {
  background-color: #d1d5db; /* 삭제 버튼 hover 시 색상 */
}

/* 카드 배경 */
.bg-white {
  background-color: #ffffff; /* 흰색 카드 배경 */
  padding: 1.5rem;
  border-radius: 1rem; /* 부드러운 둥근 처리 */
}
</style>
