<template>
    <div>
        <h2>학과 추가</h2>

        <DepartmentForm submitButtonText="등록" :init-form-data="initFormData"
            @form-submit="formSubmit"/>
    </div>
</template>

<script setup>
    import apiClient from '@/api';
import DepartmentForm from '@/components/forms/DepartmentForm.vue';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

    const router = useRouter();
    const initFormData = reactive({
        name: '',
        category: '',
        openYn: 'N',
        capacity: 30
    });

    const formSubmit = async (formData) => {
        try {
            const response = await apiClient.post(
                '/api/v1/university-service/departments',
                formData
            );

            if (response.data.code === 201) {
                alert('정상적으로 등록되었습니다.');

                router.push({ name: 'departments' });
            }
        } catch (error) {
            if (error.response.data.code === 400) {
                alert('학과 정보를 모두 입력해 주세요');
            } else {
                alert('에러가 발생했습니다');
            }
        }
    }
</script>

<style scoped>

</style>