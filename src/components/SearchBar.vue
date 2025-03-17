<template>
  <div>
    <div class="flex flex-col mt-3 sm:flex-row">
      <div class="flex">
        <!-- 표시할 항목 수 -->
        <div class="relative">
          <select
            v-model="size"
            @change="fetchPostData"
            class="block w-full h-full px-4 py-2 pr-8 leading-tight text-gray-700 bg-white border border-gray-400 rounded-l appearance-none focus:outline-none focus:bg-white focus:border-gray-500"
          >
            <option>10</option>
            <option>20</option>
            <option>30</option>
          </select>

          <div
            class="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 pointer-events-none"
          >
            <svg
              class="w-4 h-4 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path
                d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
              />
            </svg>
          </div>
        </div>
        <!-- 정렬 옵션 -->
        <div class="relative">
          <select
            v-model="postSortOption"
            @change="fetchPostData"
            class="block w-full h-full px-4 py-2 pr-8 leading-tight text-gray-700 bg-white border-t border-b border-r border-gray-400 rounded-r appearance-none sm:rounded-r-none sm:border-r-0 focus:outline-none focus:border-l focus:border-r focus:bg-white focus:border-gray-500"
          >
            <option value="LATEST">최신순</option>
            <option value="BOOKMARK">북마크</option>
            <option value="VIEW">조회수</option>
            <option value="COMMENT">댓글</option>
          </select>

          <div
            class="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 pointer-events-none"
          >
            <svg
              class="w-4 h-4 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path
                d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
              />
            </svg>
          </div>
        </div>
        <!-- 검색 옵션 -->
        <div class="relative">
          <select
            v-model="selectOption"
            class="block w-full h-full px-4 py-2 pr-8 leading-tight text-gray-700 bg-white border-t border-b border-r border-gray-400 rounded-r appearance-none sm:rounded-r-none sm:border-r-0 focus:outline-none focus:border-l focus:border-r focus:bg-white focus:border-gray-500"
          >
            <option value="">전체</option>
            <option value="TITLE">제목</option>
            <option value="CONTENT">내용</option>
            <option value="USERNAME">유저이름</option>
          </select>

          <div
            class="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 pointer-events-none"
          >
            <svg
              class="w-4 h-4 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path
                d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
              />
            </svg>
          </div>
        </div>
      </div>
      <!-- 검색 창 -->
      <div class="relative block mt-2 sm:mt-0">
        <span class="absolute inset-y-0 left-0 flex items-center pl-2">
          <svg viewBox="0 0 24 24" class="w-4 h-4 text-gray-500 fill-current">
            <path
              d="M10 4a6 6 0 100 12 6 6 0 000-12zm-8 6a8 8 0 1114.32 4.906l5.387 5.387a1 1 0 01-1.414 1.414l-5.387-5.387A8 8 0 012 10z"
            />
          </svg>
        </span>

        <input
          v-model="searchQuery"
          @keydown.enter="fetchPostData"
          placeholder="검색어를 입력해주세요"
          class="block w-full py-2 pl-8 pr-6 text-sm text-gray-700 placeholder-gray-400 bg-white border border-b border-gray-400 rounded-l rounded-r appearance-none sm:rounded-l-none focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SearchBar",
  props: ["sortOption", "selectOption"],
};
</script>
