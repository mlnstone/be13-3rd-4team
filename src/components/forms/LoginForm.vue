<template>
    <form @submit.prevent="submitClick">
        <h1 class="h3 mb-3 fw-normal">로그인 페이지</h1>

        <div class="form-floating">
            <input type="text" class="form-control" id="floatingInput" placeholder="Username"
                v-model.trim="formData.username">
            <label for="floatingInput">Username</label>
        </div>
        <div class="form-floating">
            <input type="password" class="form-control" id="floatingPassword" placeholder="Password"
                v-model.trim="formData.password">
            <label for="floatingPassword">Password</label>
        </div>
        <button class="btn btn-primary w-100 py-2" type="submit">Sign in</button>
        <button class="btn btn-primary w-100 py-2" type="button" @click.stop="signup" style="background-color: green; margin-top: 5px">Sign up</button>
        <p class="mt-5 mb-3 text-body-secondary">&copy; 2024–2025</p>
    </form>
</template>

<script setup>
    import { reactive, toRaw } from 'vue';
    import { useRouter } from 'vue-router';

    const router = useRouter();

    const signup = () => {
        router.push({name: 'signup'});
    };

    const formData = reactive({
        username: '',
        password: ''
    });

    const emit = defineEmits(['form-submit']);

    const submitClick = () => {
        emit('form-submit', toRaw(formData));
    };
</script>