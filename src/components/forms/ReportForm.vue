<template>
    <form @submit.prevent="submitClick">
        <div class="mb-3">
            <label for="reportedId" class="form-label">신고 대상 아이디</label>
            <input type="text" class="form-control" id="reportedId" v-model.trim ="formData.reportedId">
        </div>
        <div class="mb-3">
            <label for="reportType" class="form-label">신고 유형</label>
            <select class="form-select" id="reportType" v-model="formData.reportType">
                <option value="USER_REPORT">유저 신고</option>
                <option value="POST_REPORT">게시글 신고</option>
                <option value="MESSAGE_REPORT">쪽지 신고</option>
                <option value="OTHER">기타</option>
            </select>
        </div>
        <div class="mb-3">
            <label for="content" class="form-label">신고 내용</label>
            <input type="text" class="form-control" id="content" v-model.trim ="formData.content">
        </div>
        <div class="mb-3">
            <label for="url" class="form-label">관련 URL</label>
            <input type="text" class="form-control" id="url" v-model.trim ="formData.url">
        </div>
        <!-- <div class="mb-3">
            <label for="capacity" class="form-label">정원</label>
            <input type="number" class="form-control" id="capacity" v-model.number="formData.capacity">
        </div> -->
        <button type="submit" class="btn btn-primary" v-text="submitButtonText"></button>
        <!-- <button type="submit" class="btn btn-danger">삭제</button> -->
    </form>
</template>

<script setup>
import { reactive, toRaw, watch } from 'vue';

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
        {immediate: true} // watch가 등록될 때 즉시 한 번 실행된다.
    );
</script>

<style scoped>

</style>