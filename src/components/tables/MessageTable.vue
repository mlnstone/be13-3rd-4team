<template>
    <button type="button" class="btn btn-outline-danger"
        @click.stop="emit('fetch-message', 1, 'received')">받은</button>
    <button type="button" class="btn btn-outline-danger"
        @click.stop="emit('fetch-message', 1, 'sent')">보낸</button>
    <table class="table table-striped table-hover text-center">
        <thead>
            <tr>
                <th>쪽지 번호</th>
                <th>보낸 사람</th>
                <th>받는 사람</th>
                <th>보낸 날짜</th>
                <th>내용</th>
                <th>삭제</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="message in messages" :key="message.no"
                @click.stop="emit('item-click', message.no)">
                <td>{{ message.no }}</td>
                <td>{{ message.senderUsername }}</td>
                <td>{{ message.receiverUsername }}</td>
                <td>{{ message.sendAt }}</td>
                <td>{{ message.content }}</td>
                <td>
                    <button type="button" class="btn btn-outline-danger"
                        @click.stop="confirmDelete(message.no)">삭제</button>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script setup>
    const props = defineProps({
        messages: {
            type: Array,
            required: true
        }
    });

    const emit = defineEmits(['item-click', 'delete-message', 'fetch-message']);

    const confirmDelete = (no) => {
        if (confirm('정말로 삭제하시겠습니까?')) {
            emit('delete-message', no);
        }
    }
</script>

<style scoped>
th{
  color: #353535;
  font-weight: bold;
  

}
</style>