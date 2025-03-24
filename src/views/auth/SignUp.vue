<template>
    <main class="form-signin w-100 m-auto">
        <SignUpForm @form-submit="formSubmit"></SignUpForm>
    </main>
</template>

<script setup>
    import '@/assets/css/auth/sign-in.css';
    import SignUpForm from '@/components/forms/SignUpForm.vue';
    import { useAuthStore } from '@/stores/auth';

    const formSubmit = (formData) => {
        const authStore = useAuthStore();

        authStore.signup(formData);
    };
</script>