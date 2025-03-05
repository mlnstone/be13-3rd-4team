<template>
  <!-- Breadcrumb -->
  <Breadcrumb breadcrumb="Blank" />

  <div class="flex px-4 py-4 space-x-4 overflow-x-auto bg-white rounded-md">
    <RouterLink to="/team">
      <button
        class="px-4 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none focus:bg-indigo-500"
      >
        팀
      </button>
    </RouterLink>

    <a href="/user">
      <button
        class="px-4 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none focus:bg-indigo-500"
      >
        유저
      </button>
    </a>

    <a href="/project">
      <button
        class="px-4 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none focus:bg-indigo-500"
      >
        프로젝트
      </button>
    </a>

    <a href="/message">
      <button
        class="px-4 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none focus:bg-indigo-500"
      >
        쪽지
      </button>
    </a>

    <a href="/post">
      <button
        class="px-4 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none focus:bg-indigo-500"
      >
        게시판
      </button>
    </a>
  </div>
</template>
<script lang="ts" setup>
import { RouterLink } from "vue-router";
import Breadcrumb from "../partials/AppBreadcrumb.vue";
</script>
