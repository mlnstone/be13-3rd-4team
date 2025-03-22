<template>
    <div>
        <h2>팀 추가</h2>

        <TeamForm submitButtonText="등록" :init-form-data="initFormData"
            @form-submit="formSubmit"/>
    </div>
</template>

<script setup>
    import apiClient from '@/api';
import TeamForm from '@/components/forms/TeamForm.vue';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

    const router = useRouter();
    const initFormData = reactive({
        teamName: '',
        teamIntroduce: '',
        projectStatus: 'OPEN'
    });

    const formSubmit = async (formData) => {
        try {
            console.log(formData);

            const response = await apiClient.post(
                '/team',
                formData
            );

            console.log(response);
            if (response.data.code === 200) {
                alert('정상적으로 등록되었습니다.');

                router.push({ name: 'teams' });
            }
        } catch (error) {
            if (error.response.data.code === 400) {
                alert('팀 정보를 모두 입력해 주세요');
            } else {
                alert('에러가 발생했습니다');
            }
        }
    }
</script>

<style scoped>

</style>