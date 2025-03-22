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
    </div>
</template>

<script setup>
    import { reactive, onMounted } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import TeamForm from '@/components/forms/TeamForm.vue';
    import apiClient from '@/api';

    const currentRoute = useRoute();
    const router = useRouter();
    const initFormData = reactive({});

    const fetchTeam = async (no) => {
        try {
            const response = await apiClient(
                `/api/v1/university-service/departments/${no}`
            );

            Object.assign(initFormData, response.data.items[0]);
        } catch (error) {
            if (error.response.data.code === 404) {
                alert(error.response.data.message);

                router.push({name: 'departments'});
            } else {
                alert('에러가 발생했습니다.');
            }
        }
    };

    const formSubmit = async (formData) => {
        try {
            const response = await apiClient.put(
                `/api/v1/university-service/departments/${formData.no}`,
                formData
            );

            if (response.data.code === 200) {
                alert('정상적으로 수정되었습니다.');

                router.push({name: 'departments/no', params: {no: response.data.items[0].no}});
            }
        } catch (error) {
            if (error.response.data.code === 400) {
                alert('학과 정보를 모두 입력해 주세요')
            } else if (error.response.data.code === 404) {
                alert('error.response.data.message');
            } else {
                alert('에러가 발생했습니다.');
            }


        }
    };

    onMounted(() => {
        fetchDepartment(currentRoute.params.no);
    });
</script>

<style scoped>

</style>