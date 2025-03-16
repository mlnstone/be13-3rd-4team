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
                팀 명
              </th>
              <th
                class="px-5 py-3 text-sm font-medium text-gray-100 uppercase bg-indigo-800"
              >
                간단 소개
              </th>
              <th
                class="px-5 py-3 text-sm font-medium text-gray-100 uppercase bg-indigo-800"
              >
                상태
              </th>
            </tr>
          </thead>
          <!-- 내용 -->
          <tbody>
            <tr
              v-for="(post, i) in paginatedPosts"
              :key="i"
              class="hover:bg-gray-200 cursor-pointer"
              @click="openModal(post)"
            >
              <td class="px-6 py-4 text-lg text-gray-500 border-b">
                {{ post.no }}
              </td>
              <td class="px-6 py-4 text-gray-700 border-b">
                {{ post.teamName }}
              </td>
              <td class="px-6 py-4 text-gray-500 border-b">
                {{ post.teamIntroduce }}
              </td>
              <td class="px-6 py-4 text-gray-500 border-b">
                {{ post.projectStatus }}
              </td>
            </tr>
            <ModalLayout
              v-if="isModalOpen"
              :title="selectedPost.teamName"
              @close="closeModal"
            >
              <TeamSingleView v-if="selectedTeam" :team="selectedTeam" />
            </ModalLayout>
          </tbody>
        </table>
        <!-- 페이징 버튼 -->
        <div
          class="flex flex-col items-center px-5 py-5 bg-white border-t xs:flex-row xs:justify-between"
        >
          <div class="flex mr-4 rounded">
            <a
              href="#"
              @click="prevPage"
              class="px-3 py-2 ml-0 leading-tight text-indigo-700 bg-white border border-r-0 border-gray-200 rounded-l hover:bg-indigo-500 hover:text-white"
              ><span>Previous</span></a
            >
            <a
              href="#"
              v-for="page in totalPages"
              :key="page"
              :class="
                page === currentPage
                  ? 'bg-indigo-500 text-white'
                  : 'text-indigo-700'
              "
              @click="setPage(page)"
              class="px-3 py-2 leading-tight bg-white border border-r-0 border-gray-200 hover:bg-indigo-500 hover:text-white"
              ><span>{{ page }}</span></a
            >
            <a
              href="#"
              @click="nextPage"
              class="px-3 py-2 leading-tight text-indigo-700 bg-white border border-gray-200 rounded-r hover:bg-indigo-500 hover:text-white"
              ><span>Next</span></a
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ModalLayout from "../ModalLayout.vue";
import TeamSingleView from "../team/TeamSingleView.vue";
export default {
  name: "TeamTable",
  components: {
    ModalLayout,
    TeamSingleView,
  },
  data() {
    return {
      isModalOpen: false,
      selectedTeam: {},
    };
  },
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
  emits: ["set-page", "team-selected"], // 이벤트 정의 (부모에게 값을 전달)
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
    prevPage() {
      if (this.currentPage > 1) {
        this.$emit("set-page", this.currentPage - 1);
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.$emit("set-page", this.currentPage + 1);
      }
    },
    openModal(post) {
      this.isModalOpen = true;
      this.selectedPost = post;
      this.$emit("team-selected", post); // 이벤트 발생
    },
    closeModal() {
      this.isModalOpen = false;
    },
  },
};
</script>
