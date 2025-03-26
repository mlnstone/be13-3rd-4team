<template>
    <div>
        <h2>유저 정보 상세 보기</h2>

        <UserForm :initFormData="initFormData"  submit-button-text="수정"/>
    </div>
</template>

<script setup>
    import {reactive, onMounted} from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import UserForm from '@/components/forms/UserForm.vue';
    import apiClient from '@/api';
    import { useAuthStore } from '@/stores/auth';

    const currentRoute = useRoute(); 
    const router = useRouter();
    const initFormData = reactive ({});
    const initUserEmail = reactive({});

    const authStore = useAuthStore();
    const userInfo = authStore.userInfo;
    const username = userInfo.username;

    const fetchUser = async (username) => {
        try {
            const response = await apiClient.get(`/user/${username}`);

            console.log('fetchUser()');
            console.log(response);
            Object.assign(initFormData, response.data);

        } catch (error) {
            console.log('error : ');
            console.log(error);
            console.log('// error : ');
            if (error.response.status === 404) {
                alert(error.response.message);

                router.back();
            } else {
                alert('에러가 발생했습니다.');

                router.back();
            }
        }
    };

    onMounted(() => {
        fetchUser(username);
    });
</script>

<style scoped>
div {
  max-width: 700px;
  margin: 40px auto;
  padding: 30px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

h2 {
  text-align: center;
  font-size: 1.6rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 30px;
}
</style>