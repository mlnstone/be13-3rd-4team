<template>
  <div class="mt-4">
    <h4 class="text-gray-600">Simple Table</h4>
    <div class="mt-6">
      <div class="my-6 overflow-hidden bg-white rounded-md shadow">
        <table class="w-full text-left border-collapse">
          <!-- 제목 -->
          <thead class="border-b">
            <tr>
              <th
                class="px-5 py-3 text-sm font-medium text-gray-100 uppercase bg-indigo-800"
              >
                번호
              </th>
              <th
                class="px-5 py-3 text-sm font-medium text-gray-100 uppercase bg-indigo-800"
              >
                제목
              </th>
              <th
                class="px-5 py-3 text-sm font-medium text-gray-100 uppercase bg-indigo-800"
              >
                글쓴이
              </th>
              <th
                class="px-5 py-3 text-sm font-medium text-gray-100 uppercase bg-indigo-800"
              >
                작성일
              </th>
            </tr>
          </thead>
          <!-- 내용 -->
          <tbody>
            <tr
              v-for="(post, i) in paginatedPosts"
              :key="i"
              class="hover:bg-gray-200"
            >
              <td class="px-6 py-4 text-lg text-gray-500 border-b">
                {{ post.postNo }}
              </td>
              <td class="px-6 py-4 text-gray-700 border-b">
                {{ post.title }}
              </td>
              <td class="px-6 py-4 text-gray-500 border-b">
                {{ post.userName }}
              </td>
              <td class="px-6 py-4 text-gray-500 border-b">
                {{ new Date(post.createdAt).toLocaleDateString() }}
              </td>
            </tr>
          </tbody>
        </table>
        <!-- 페이징 버튼 -->
        <div
          class="flex flex-col items-center px-5 py-5 bg-white border-t xs:flex-row xs:justify-between"
        >
          <div class="flex mr-4 rounded">
            <a
              v-for="page in totalPages"
              :key="page"
              @click="setPage(page)"
              class="px-3 py-2 leading-tight text-indigo-700 bg-white border border-r-0 border-gray-200 hover:bg-indigo-500 hover:text-white"
              ><span>{{ page }}</span></a
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AppTable",
  props: {
    // 부모로 부터 받아오는 값들
    posts: {
      type: Array,
      default: () => [], // 기본값을 빈 배열로 설정
      required: true,
    },
    currentPage: {
      type: Number,
      default: 1,
    },
    itemsPerPage: {
      type: Number,
      default: 10,
    },
    totalPages: {
      type: Number,
      required: true,
    },
  },
  emits: ["set-page"], // 이벤트 정의 (부모에게 값을 전달)
  // data() {
  //   return {
  //     // 컴포넌트 내부 변수
  //   };
  // },
  computed: {
    paginatedPosts() {
      return this.posts; // posts 배열 직접 반환
    },
  },
  methods: {
    setPage(page) {
      this.$emit("set-page", page);
    },
  },
};
</script>
