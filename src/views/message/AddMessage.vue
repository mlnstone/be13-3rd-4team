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
        receiverUsername: '',
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
/* 전체 페이지 배치 설정 */
.page-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f9f9f9; /* 연한 배경색 */
  border-radius: 8px; /* 부드러운 모서리 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 얕은 그림자 */
}

/* 페이지 제목 스타일 */
.page-title {
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  font-weight: bold;
  color: #353535; /* 텍스트 색상 */
  text-align: center;
}

/* MessageForm 내 스타일 공통 글씨 색상 */
form label,
form input,
form button {
  color: #353535; /* 폼 내 텍스트 색상 */
}

/* 버튼 스타일 기본 */
button {
  background-color: #0077b6; /* 버튼 배경색 */
  color: white; /* 버튼 글씨 색상 */
  border: none;
  border-radius: 4px; /* 부드러운 모서리 */
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

/* 버튼 hover */
button:hover {
  background-color: #005fa3; /* hover 시 어두운 음영 */
}

/* 버튼 focus */
button:focus {
  outline: none;
  box-shadow: 0 0 6px rgba(0, 119, 182, 0.6); /* 포커스 시 강조 */
}
</style>
