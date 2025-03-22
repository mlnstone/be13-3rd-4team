<template>
    <table class="table table-striped table-hover text-center">
        <thead>
            <tr>
                <th>팀 번호</th>
                <th>팀명</th>
                <th>팀 설명</th>
                <th>상태</th>
                <th>삭제</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="team in teams" :key="team.no"
                @click.stop="emit('item-click', team.no)">
                <td>{{ team.no }}</td>
                <td>{{ team.teamName }}</td>
                <td>{{ team.teamIntroduce }}</td>
                <td>{{ team.projectStatus }}</td>
                <td>
                    <button type="button" class="btn btn-outline-danger"
                        @click.stop="confirmDelete(team.no)">삭제</button>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script setup>
    const props = defineProps({
        teams: {
            type: Array,
            required: true
        }
    });

    const emit = defineEmits(['item-click', 'delete-team']);

    const confirmDelete = (no) => {
        if (confirm('정말로 삭제하시겠습니까?')) {
            emit('delete-team', no);
        }
    }
</script>