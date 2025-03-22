<template>
    <div>
        <h2>프로젝트 상세 보기</h2>

        <p>{{ currentRoute.fullPath }}</p>
        <p>{{ currentRoute.path }}</p>
        <p>{{ currentRoute.params }}</p>
        <p>{{ currentRoute.params.no }}</p>
        <p>{{ currentRoute.query }}</p>
        <p>{{ currentRoute.query.name }}</p>
        <p>{{ parseInt(currentRoute.query.age) }}</p>

        <!-- <button @click="(e) => router.push('/')">홈으로</button> -->
        <button @click="(e) => router.push({name: 'home'})">홈으로</button>
        <!-- <button @click="(e) => router.replace({name: 'home'})">홈으로</button> -->
        <button @click="(e) => router.back()">뒤로가기</button>
        <button @click="(e) => router.forward()">앞으로가기</button>
    </div>
</template>

<script setup>
    import { useRoute, useRouter } from 'vue-router';

    const currentRoute = useRoute(); 
    const router = useRouter();
</script>

<style scoped>

</style>