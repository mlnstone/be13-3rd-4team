<template>
    <div>
        <h2>쪽지 추가</h2>

        <MessageForm submitButtonText="등록" :init-form-data="initFormData"
            @form-submit="formSubmit"/>
    </div>
</template>

<script setup>
    import apiClient from '@/api';
    import MessageForm from '@/components/forms/MessageForm.vue';
    import { reactive } from 'vue';
    import { useRouter } from 'vue-router';

    const router = useRouter();
    const initFormData = reactive({
        receiverId: '',
        content: ''
    });

    const formSubmit = async (formData) => {
        try {
            const response = await apiClient.post(
                '/messages',
                formData
            );

            console.log(response);
            if (response.status === 200) {
                alert('정상적으로 등록되었습니다.');

                router.push({ name: 'messages' });
            }
        } catch (error) {
            if (error.response.status === 400) {
                alert('쪽지 정보를 모두 입력해 주세요');
            } else {
                alert('에러가 발생했습니다');
            }
        }
    }
</script>

<style scoped>

</style>