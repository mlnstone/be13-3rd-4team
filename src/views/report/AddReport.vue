<template>
    <div>
        <h2>신고 추가</h2>

        <ReportForm submitButtonText="등록" :init-form-data="initFormData"
            @form-submit="formSubmit"/>
    </div>
</template>

<script setup>
    import apiClient from '@/api';
    import ReportForm from '@/components/forms/ReportForm.vue';
    import { reactive } from 'vue';
    import { useRouter } from 'vue-router';

    const router = useRouter();
    const initFormData = reactive({
        reportedId: '',
        reportType: '',
        content: '',
        url: ''
    });

    const formSubmit = async (formData) => {
        try {
            const response = await apiClient.post(
                '/reports',
                formData
            );

            console.log(response);
            if (response.status === 200) {
                alert('정상적으로 등록되었습니다.');

                router.push({ name: 'reports' });
            }
        } catch (error) {
            if (error.response.status === 400) {
                alert('신고 정보를 모두 입력해 주세요');
            } else {
                alert('에러가 발생했습니다');
            }
        }
    }
</script>

<style scoped>

</style>