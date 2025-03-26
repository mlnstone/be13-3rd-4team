<template>
    <link rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&icon_names=arrow_back" />
    <button @click="goBack" class="back-button">
        <span class="material-symbols-outlined">
            arrow_back 뒤로가기
        </span>
    </button>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps({
  target: {
    type: String, // 이동할 경로 또는 페이지 이름
    default: null,
  },
});

const goBack = () => {
  if (props.target) {
    router.push(props.target); // 특정 경로로 이동
  } else {
    router.back(); // 이전 페이지로 이동
  }
};
</script>

<style scoped>
.back-button {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 0.25rem;
    transition: background-color 0.3s ease;
}

.back-button:hover {
    background-color: #f0f0f0;
}
</style>