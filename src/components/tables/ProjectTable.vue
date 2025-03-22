<template>
    <table class="table table-striped table-hover text-center">
        <thead>
            <tr>
                <th>프로젝트 번호</th>
                <th>프로젝트명</th>
                <th>팀명</th>
                <th>내용</th>
                <th>프로젝트 상태</th>
                <th>프로젝트 기술스택</th>
                <th>삭제</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="project in projects" :key="project.no">
                <td>{{ project.no }}</td>
                <td>{{ project.name }}</td>
                <td>{{ project.teamName }}</td>
                <td>{{ project.content }}</td>
                <td>{{ project.projectStatus }}</td>
                <td>{{ project.projectTeches }}</td>
                <td>
                    <button type="button" class="btn btn-outline-danger">삭제</button>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script setup>
    const props = defineProps({
        projects: {
            type: Array,
            required: true
        }
    });

    const emit = defineEmits(['item-click', 'delete-project']);

    const confirmDelete = (no) => {
        if (confirm('정말로 삭제하시겠습니까?')) {
            emit('delete-project', no);
        }
    }
</script>