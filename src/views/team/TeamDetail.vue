<template>
    <div>
        <h2>팀 상세 보기</h2>

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

        <TeamForm :initTeamFormData="initTeamFormData" />
        <hr>
        <ProjectForm :initProjectFormData="initProjectFormData" submitButtonText="등록"/>
    </div>
</template>

<script setup>
    import {reactive, onMounted} from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import TeamForm from '@/components/forms/TeamForm.vue';
    import ProjectForm from '@/components/forms/ProjectForm.vue';
    import apiClient from '@/api';

    const currentRoute = useRoute(); 
    const router = useRouter();
    const initTeamFormData = reactive ({});
    const initProjectFormData = reactive ({});

    const fetchTeam = async (no) => {
        try {
            const response = await apiClient.get(`/team/${no}`);

            console.log('fetchTeam : ');
            console.log(response.data);
            Object.assign(initTeamFormData, response.data.team.team);
            Object.assign(initProjectFormData, response.data.team);
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
        fetchTeam(currentRoute.params.no);
    });
</script>

<style scoped>

</style>