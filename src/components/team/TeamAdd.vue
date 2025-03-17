<template>
  <form @submit.prevent="handleSubmit">
    <div class="flex items-center border-8">
      <!-- <span>팀 명 : </span> -->
      <label for="name" class="w-[15%]">팀 명</label>
      <input
        type="text"
        id="name"
        v-model="name"
        class="w-[85%] px-2 py-2 border-transparent rounded-md appearance-none focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
      />
    </div>
    <div class="flex items-center border-8">
      <label for="introduce" class="w-[15%]">내용</label>
      <input
        type="text"
        id="introduce"
        v-model="introduce"
        class="w-[85%] px-2 py-2 border-transparent rounded-md appearance-none focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
        maxlength="255"
      />
    </div>
    <div class="relative">
      <select
        v-model="option"
        class="block w-full h-full px-4 py-2 pr-8 leading-tight rounded-md border-none text-gray-700 bg-white border-t border-b border-r border-gray-400 rounded-r appearance-none sm:rounded-r-none sm:border-r-0 focus:outline-none focus:border-l focus:border-r focus:bg-white focus:border-gray-500"
      >
        <option value="OPEN" selected>모집중</option>
        <option value="CLOSED">마감</option>
        <option value="IN_PROGRESS">진행중</option>
        <option value="COMPLETE">완료</option>
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

    <button type="submit" @click="handleSubmit">제출</button>
  </form>
</template>

<script>
export default {
  data() {
    return {
      name: "",
      introduce: "",
      option: "",
    };
  },
  methods: {
    handleSubmit() {
      // 폼 제출 시 이벤트 방출
      this.$emit("form-submitted", {
        name: this.name,
        introduce: this.introduce,
        option: this.option,
      });
      // 입력 필드 초기화
      this.name = "";
      this.introduce = "";
      this.option = "OPEN";
    },
    test() {
      console.log("test");
    },
  },
};
</script>
