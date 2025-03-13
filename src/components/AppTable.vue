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
    posts: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      currentPage: 1,
      itemsPerPage: 10,
    };
  },
  computed: {
    paginatedPosts() {
      // 현재 페이지 번호에 따라 시작 인덱스를 계산합니다.
      const start = (this.currentPage - 1) * this.itemsPerPage;
      // posts 배열에서 해당 범위의 게시물을 추출합니다.
      return this.posts.slice(start, start + this.itemsPerPage);
    },
    totalPages() {
      // 전체 게시물 수에 따라 총 페이지 수를 계산합니다.
      return Math.ceil(this.posts.length / this.itemsPerPage);
    },
  },
  methods: {
    setPage(page) {
      this.currentPage = page;
    },
  },
};
</script>
