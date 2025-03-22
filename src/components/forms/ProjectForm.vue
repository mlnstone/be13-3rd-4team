<template>
    <form @submit.prevent="submitClick">
        <div class="mb-3">
            <label for="name" class="form-label">프로젝트명</label>
            <input type="text" class="form-control" id="name" v-model.trim ="formData.name">
        </div>
        <div class="mb-3">
            <label for="content" class="form-label">프로젝트 내용</label>
            <input type="text" class="form-control" id="content" v-model.trim="formData.content">
        </div>
        <div class="mb-3">
            <input type="hidden" class="form-control" id="teamNo" v-model.trim="formData.teamNo">
        </div>
        <div class="mb-3">
            <label for="projectStatus" class="form-label">프로젝트 상태</label>
            <select class="form-select" id="projectStatus" v-model="formData.projectStatus">
                <option value="OPEN">개설</option>
                <option value="IN_PROGRESS">진행중</option>
                <option value="COMPLETE">완료</option>
                <option value="CLOSED">중지</option>
            </select>
        </div>
        <!-- <div class="mb-3">
            <label for="openYn" class="form-label">개설 여부</label>
            <select class="form-select" id="openYn" v-model="formData.openYn">
                <option value="Y">예(Y)</option>
                <option value="N">아니오(N)</option>
            </select>
        </div> -->
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