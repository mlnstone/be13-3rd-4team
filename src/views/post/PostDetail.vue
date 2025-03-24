<template>
    <div>
        <h2>쪽지 상세 보기</h2>

        <!-- <p>{{ currentRoute.fullPath }}</p>
        <p>{{ currentRoute.path }}</p>
        <p>{{ currentRoute.params }}</p>
        <p>{{ currentRoute.params.no }}</p>
        <p>{{ currentRoute.query }}</p>
        <p>{{ currentRoute.query.name }}</p>
        <p>{{ parseInt(currentRoute.query.age) }}</p> -->



        <!-- <button @click="(e) => router.push('/')">홈으로</button> -->
        <!-- <button @click="(e) => router.push({name: 'home'})">홈으로</button> -->
        <!-- <button @click="(e) => router.replace({name: 'home'})">홈으로</button> -->
        <!-- <button @click="(e) => router.back()">뒤로가기</button> -->
        <!-- <button @click="(e) => router.forward()">앞으로가기</button> -->

        <MessageForm :initFormData="initFormData" />
    </div>
</template>

<script setup>
    import {reactive, onMounted} from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import MessageForm from '@/components/forms/MessageForm.vue';
    import apiClient from '@/api';

    const currentRoute = useRoute(); 
    const router = useRouter();
    const initFormData = reactive ({});

    const fetchMessage = async (no) => {
        try {
            const response = await apiClient.get(`/messages/${no}`);

            Object.assign(initFormData, response.data);
        } catch (error) {
            if (error.response.status === 404) {
                alert(error.response.message);

                router.push({name: 'messages'});
            } else {
                alert('에러가 발생했습니다.');
            }
        }
    };

    onMounted(() => {
        fetchMessage(currentRoute.params.no);
    });
</script>

<style scoped>

</style>