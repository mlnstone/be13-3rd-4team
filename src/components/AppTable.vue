<template>
  <div class="mt-4">
    <h4 class="text-gray-600">Simple Table</h4>
    <div class="mt-6">
      <div class="my-6 overflow-hidden bg-white rounded-md shadow">
        <table class="w-full text-left border-collapse">
          <thead class="border-b">
            <tr>
              <th
                class="px-5 py-3 text-sm font-medium text-gray-100 uppercase bg-indigo-800"
              >
                번호
              </th>
              <th
                class="px-5 py-3 text-sm font-medium text-gray-100 uppercase bg-indigo-800"
              >
                제목
              </th>
              <th
                class="px-5 py-3 text-sm font-medium text-gray-100 uppercase bg-indigo-800"
              >
                글쓴이
              </th>
              <th
                class="px-5 py-3 text-sm font-medium text-gray-100 uppercase bg-indigo-800"
              >
                작성일
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(post, i) in posts" :key="i" class="hover:bg-gray-200">
              <td class="px-6 py-4 text-lg text-gray-500 border-b">
                {{ post.postNo }}
              </td>
              <td class="px-6 py-4 text-gray-700 border-b">
                {{ post.title }}
              </td>
              <td class="px-6 py-4 text-gray-500 border-b">
                {{ post.userName }}
              </td>
              <td class="px-6 py-4 text-gray-500 border-b">
                {{ new Date(post.createdAt).toLocaleDateString() }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AppTable",
  props: {
    posts: {
      type: Array,
      required: true,
    },
  },
};
</script>
