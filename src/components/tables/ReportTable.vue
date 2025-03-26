<template>
    <table class="table table-striped table-hover text-center">
        <thead>
            <tr>
                <th>신고 번호</th>
                <th>신고자 아이디</th>
                <th>신고 대상 아이디</th>
                <th>신고 유형</th>
                <th>신고 내용</th>
                <th>관련 URL</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="report in reports" :key="report.no"
                @click.stop="emit('item-click', report.no)">
                <td>{{ report.no }}</td>
                <td>{{ report.reporterUsername }}</td>
                <td>{{ report.reportedUsername }}</td>
                <td>{{ report.reportType }}</td>
                <td>{{ report.content }}</td>
                <td>{{ report.url }}</td>
            </tr>
        </tbody>
    </table>
</template>

<script setup>
    const props = defineProps({
        reports: {
            type: Array,
            required: true
        }
    });

    const emit = defineEmits(['item-click']);

</script>