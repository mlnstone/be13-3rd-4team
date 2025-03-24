<template>
    <table class="table table-striped table-hover text-center">
        <thead>
            <tr>
                <th>게시글 번호</th>
                <th>제목</th>
                <th>글쓴이</th>
                <th>작성일</th>
                <th>삭제</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="post in posts" :key="post.postNo"
                @click.stop="emit('item-click', post.postNo)">
                <td>{{ post.postNo }}</td>
                <td>{{ post.title }}</td>
                <td>{{ post.username }}</td>
                <td>{{ new Date(post.createdAt) }}</td>
                <td>
                    <button type="button" class="btn btn-outline-danger">삭제</button>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script setup>
    const props = defineProps({
        posts: {
            type: Array,
            required: true
        }
    });

    const emit = defineEmits(['item-click']);

</script>