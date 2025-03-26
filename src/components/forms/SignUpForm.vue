<template>
    <form @submit.prevent="submitClick">
        <h1 class="h3 mb-3 fw-normal">회원가입 페이지</h1>

        <div class="form-floating">
            <input type="text" class="form-control" id="floatingUsername" placeholder="Username"
                v-model.trim="formData.username" required>
            <label for="floatingUsername">Username</label>
        </div>
        <div class="form-floating">
            <input type="password" class="form-control" id="floatingPassword" placeholder="Password"
                v-model.trim="formData.password" required>
            <label for="floatingPassword">Password</label>
        </div>
        <div class="form-floating">
            <input type="password" class="form-control" id="floatingConfirmPassword" placeholder="ConfirmPassword"
                v-model.trim="formData.confirmPassword" required>
            <label for="floatingConfirmPassword">Re:Password</label>
        </div>
        <div class="form-floating">
            <input type="text" class="form-control" id="floatingEmail" placeholder="Email"
                v-model.trim="formData.email" required>
            <label for="floatingEmail">Email</label>
            <p id="isSentText" style="color: green;"></p>
        <button class="btn btn-primary w-100 py-2" type="button" @click.stop="authEmailSend" style="background-color: green; margin-top: 5px">인증코드 보내기</button>
        </div>
        <div class="form-floating">
            <input type="text" class="form-control" id="floatingValidateCode" placeholder="ValidateCode"
                v-model.trim="formData.validateCode">
            <label for="floatingValidateCode">Validate Email</label>
            <p id="isValidText" style="color: red;">인증 실패</p>
        </div>
        <button class="btn btn-primary w-100 py-2" type="button" @click.stop="authEmailValidate" style="background-color: green; margin-top: 5px">인증코드 확인</button>
        <div class="form-floating">
            <input type="text" class="form-control" id="floatingPhoneNum" placeholder="PhoneNum"
                v-model.trim="formData.phoneNum">
            <label for="floatingPhoneNum">PhoneNum</label>
        </div>
        <button class="btn btn-primary w-100 py-2" type="submit" style="background-color: green; margin-top: 5px">Sign up</button>
        <p class="mt-5 mb-3 text-body-secondary">&copy; 2024–2025</p>
    </form>
</template>

<script setup>
    import { reactive, toRaw } from 'vue';
    import { useAuthStore } from '@/stores/auth';

    const formData = reactive({
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
        validateCode: '',
        phoneNum: ''
    });

    const emit = defineEmits(['form-submit']);

    const submitClick = () => {
        if (isSentCode){
            if (formData.password !== formData.confirmPassword) {
                alert('비밀번호 확인이 일치하지 않습니다');
                return;
            } else {
                emit('form-submit', toRaw(formData));
            }
        } else {
            alert('이메일 인증을 해주세요');
        }
    };

    let isSentCode = false;

    const authEmailSend = () => {
        const valid_email = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/; // 이메일 정규 표현식
        if (formData.email === '' || valid_email.test(formData.email) === false) {

            alert('올바른 이메일을 입력해주세요');
            return;
        }

        isSentCode = true;
        const authStore = useAuthStore();

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
        const authStore = useAuthStore();

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
</script>