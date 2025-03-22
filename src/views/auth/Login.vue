<template>
    <main class="form-signin w-100 m-auto">
        <LoginForm @form-submit="formSubmit"></LoginForm>
    </main>
</template>

<script setup>
    import '@/assets/css/auth/sign-in.css';
    import LoginForm from '@/components/forms/LoginForm.vue';
    import { useAuthStore } from '@/stores/auth';

    const formSubmit = (formData) => {
        const authStore = useAuthStore();

        authStore.login(formData);
    };
</script>