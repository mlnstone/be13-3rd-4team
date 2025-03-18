<template>
  <div>
    <Breadcrumb breadcrumb="Post" />
    <div class="mt-8">
      <div class="mt-4">
        <div class="p-6 bg-white rounded-md shadow-md">
          <h2 class="text-lg font-semibold text-gray-700 capitalize">
            {{ isEditMode ? "게시글 수정" : "게시글 작성" }}
          </h2>

          <form @submit.prevent="submitPostData">
            <div class="grid grid-cols-1 gap-6 mt-4">
              <div>
                <label class="text-gray-700" for="username">제목</label>
                <input
                  class="w-full mt-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
                  type="text"
                  v-model="title"
                />
              </div>

              <div>
                <label class="text-gray-700" for="emailAddress">내용</label>
                <textarea
                  class="w-full mt-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
                  v-model="content"
                ></textarea>
              </div>

              <div>
                <label class="text-gray-700" for="password">게시글 타입</label>
                <input
                  class="w-full mt-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
                  type="text"
                  v-model="boardType"
                />
              </div>
            </div>

            <div class="flex justify-end mt-4">
              <button
                type="submit"
                class="px-4 py-2 text-gray-200 bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
              >
                {{ isEditMode ? "수정" : "저장" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "@/api/index";
import Breadcrumb from "@/partials/AppBreadcrumb.vue";
import { useRoute, useRouter } from "vue-router";
import { ref } from "vue";

export default {
  name: "PostWrite",
  components: {
    Breadcrumb,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const title = ref(route.query.title || "");
    const content = ref(route.query.content || "");
    const boardType = ref(route.query.boardType || "FREE");
    const postNo = ref(route.query.postNo || null);
    const isEditMode = ref(!!route.query.title); // 수정모드 확인용 (!!은 강제로 Boolean 타입변경)
    const postStatus = ref("ACTIVE");

    const submitPostData = () => {
      const params = {
        title: title.value,
        content: content.value,
        boardType: boardType.value,
        postStatus: postStatus.value,
      };

      if (isEditMode.value) {
        axios
          .post(
            `/posts/${postNo.value}?boardType=FREE&postStatus=ACTIVE`,
            params
          )
          .then(() => {
            alert("게시글이 수정되었습니다.");
            router.push(`/post/${postNo.value}`); // 수정 후 상세 페이지로 이동
          })
          .catch((error) => {
            console.error("게시글 수정 실패", error);
          });
      } else {
        axios
          .post("/posts?boardType=FREE", params)
          .then(() => {
            alert("게시글이 작성되었습니다.");
            router.push("/post"); // 작성 후 목록 페이지로 이동
          })
          .catch((error) => {
            console.error("게시글 작성 실패", error);
          });
      }
    };

    return {
      title,
      content,
      boardType,
      postNo,
      isEditMode,
      submitPostData,
    };
  },
};
</script>
