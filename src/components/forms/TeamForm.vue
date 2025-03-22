<template>
    <form @submit.prevent="submitClick">
        <div class="mb-3">
            <label for="teamName" class="form-label">팀명</label>
            <input type="text" class="form-control" id="teamName" v-model.trim ="formData.teamName">
        </div>
        <div class="mb-3">
            <label for="teamIntroduce" class="form-label">팀 설명</label>
            <input type="text" class="form-control" id="teamIntroduce" v-model.trim="formData.teamIntroduce">
        </div>
        <div class="mb-3">
            <label for="projectStatus" class="form-label">상태</label>
            <select class="form-select" id="projectStatus" v-model="formData.projectStatus">
                <option value="OPEN">개설</option>
                <option value="CLOSED">마감</option>
                <option value="IN_PROGRESS">모집중</option>
            </select>
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