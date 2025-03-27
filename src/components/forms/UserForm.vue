<template>
    <form @submit.prevent="submitClick">
        <div class="mb-3">
            <label for="username" class="form-label">유저 아이디</label>
            <input type="text" class="form-control" id="username" v-model.trim="formData.username" readonly>
        </div>
        <div class="mb-3">
            <label for="email" class="form-label">유저 이메일</label>
            <input type="text" class="form-control" id="email" v-model.trim="formData.email" readonly>
        </div>
        <div class="mb-3">
            <label for="phoneNum" class="form-label">전화번호</label>
            <input type="text" class="form-control" id="phoneNum" v-model.trim="formData.phoneNum" readonly>
        </div>
        <div class="mb-3">
            <label for="status" class="form-label">상태</label>
            <select class="form-select" id="status" v-model="formData.status" disabled>
                <option value="ACTIVE">활성</option>
                <option value="INACTIVE">비활성</option>
                <option value="DELETED">삭제</option>
            </select>
        </div>
        <button @click="userStore.goToUserComments" @mouseover="hoverIn($event)" @mouseout="hoverOut($event)"
            style="background-color: white; color: #4c6ef5; border: 1px solid #4c6ef5; border-radius: 6px; padding: 8px 14px; margin-bottom: 10px; margin-right: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); cursor: pointer;">
            모든 댓글 가져오기
        </button>

        <button @click="userStore.goToUserPosts" @mouseover="hoverIn($event)" @mouseout="hoverOut($event)"
            style="background-color: white; color: #4c6ef5; border: 1px solid #4c6ef5; border-radius: 6px; padding: 8px 14px; margin-bottom: 10px; margin-right: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); cursor: pointer;">
            모든 게시글 가져오기
        </button>

        <button @click="userStore.goToUserProjects" @mouseover="hoverIn($event)" @mouseout="hoverOut($event)"
            style="background-color: white; color: #4c6ef5; border: 1px solid #4c6ef5; border-radius: 6px; padding: 8px 14px; margin-bottom: 10px; margin-right: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); cursor: pointer;">
            모든 프로젝트 가져오기
        </button>
        <!-- <button type="submit" class="btn btn-primary" v-text="submitButtonText"></button> -->
        <!-- <button type="submit" class="btn btn-danger">삭제</button> -->
        <hr>
        <div class="form-floating">
            <p id="isSentText" style="color: green;"></p>
        </div>
        <button class="btn btn-primary py-2" type="button" @click.stop="authEmailSend"
            style="background-color: green; margin-top: 5px;">인증코드 보내기</button>
        <div class="form-floating">
            <input type="text" class="form-control" id="floatingValidateCode" placeholder="ValidateCode"
                v-model.trim="formData.validateCode">
            <label for="floatingValidateCode">Validate Email</label>
            <p id="isValidText" style="color: red;">인증 실패</p>
        </div>
        <button type="button" class="btn btn-primary py-2" @click.stop="authEmailValidate"
            style="background-color: green; margin-top: 5px">인증코드 확인</button>
        <div class="mb-3">
            <label for="password" class="form-label">비밀번호 변경</label>
            <input type="password" class="form-control" id="password" v-model.trim="formData.password">
        </div>
        <div class="mb-3">
            <label for="confirmPassword" class="form-label">비밀번호 변경 확인</label>
            <input type="password" class="form-control" id="confirmPassword" v-model.trim="formData.confirmPassword">
        </div>
        <button type="submit" class="btn btn-primary" @click.stop="updatePassword">비밀번호 수정</button>

    </form>
</template>

<script setup>
import { reactive, toRaw, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useUserStore } from '@/stores/user';
import apiClient from '@/api';

const userStore = useUserStore();

const formData = reactive({

});

const props = defineProps({
    submitButtonText: String,
    initFormData: Object
});

const emit = defineEmits(['form-submit']);

const submitClick = () => {
    emit('form-submit', toRaw(formData));
};

watch(
    props.initFormData,
    (newFormData) => {
        // formData의 속성만 newFormData의 속성의 값으로 변경한다.
        Object.assign(formData, newFormData)
    },
    { immediate: true } // watch가 등록될 때 즉시 한 번 실행된다.
);

let isSentCode = false;

const authStore = useAuthStore();

const authEmailSend = () => {
    const valid_email = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/; // 이메일 정규 표현식
    if (formData.email === '' || valid_email.test(formData.email) === false) {

        alert('올바른 이메일을 입력해주세요');
        return;
    }

    isSentCode = true;

    document.getElementById('isSentText').innerText = '인증코드 전송 완료';

    authStore.authEmailSend(toRaw(formData));
};

const authEmailValidate = async () => {
    // 인증코드를 보냈는지 확인
    if (!isSentCode) {
        alert('이메일 인증코드를 먼저 보내주세요');
        return;
    }

    // 인증코드 확인
    await authStore.authEmailValidate(toRaw(formData));

    console.log(authStore.isCheckedEmail);
    if (authStore.isCheckedEmail) {
        document.getElementById('isValidText').style.color = 'green';
        document.getElementById('isValidText').innerText = '인증 성공';
    } else {
        document.getElementById('isValidText').style.color = 'red';
        document.getElementById('isValidText').innerText = '인증 실패';
    }
};
// ... 기존 코드 위에 추가
const hoverIn = (event) => {
  event.target.style.backgroundColor = '#4c6ef5';
  event.target.style.color = 'white';
};

const hoverOut = (event) => {
  event.target.style.backgroundColor = 'white';
  event.target.style.color = '#4c6ef5';
};

const updatePassword = async () => {
    if (!authStore.isCheckedEmail) {
        alert('이메일 인증을 해주세요');
        return;
    }

    try {
        const data = {
            newPassword: formData.password,
            confirmPassword: formData.confirmPassword
        }
        const response = await apiClient.post('/updatePassword', data);

        if (response.status === 200) {
            alert('비밀번호 변경이 성공적으로 이루어졌습니다. 재로그인이 필요합니다.');

            authStore.logout();
        } else {
            alert('비밀번호 변경 실패');
        }

    } catch (error) {
        console.log(error);
    }
}
</script>

<style scoped></style>