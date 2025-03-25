<template>
  <div class="row" v-if="!autoSendActive">
    <div class="col p-3">
      <h2>쪽지 전송</h2>
    </div>
  </div>
  <div class="row" v-if="!autoSendActive">
    <div class="col">
      <div class="form-group">
        <label for="receiverId">받는 사람 ID :</label>
        <input type="text" class="form-control" id="receiverId" v-model="messageItem.receiverUsername" />
      </div>
      <div class="form-group">
        <label for="content">쪽지 내용 :</label>
        <textarea class="form-control" rows="3" id="content" v-model="messageItem.content"></textarea>
      </div>
      <div class="form-group">
        <button type="button" class="btn btn-primary m-1" @click="sendMessage()">
          전송
        </button>
        <button type="button" class="btn btn-secondary m-1" @click="cancelMessage()">
          취소
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import apiClient from '@/api';

const router = useRouter();
const route = useRoute();

// 📦 쪽지 내용 저장
const messageItem = reactive({
  receiverUsername: '',
  content: ''
});

// 자동전송 활성 여부
const autoSendActive = ref(false);

// 📤 전송 함수
const sendMessage = async () => {
  console.log('[쪽지 전송 요청]', messageItem);
  try {
    const data = {
      receiverUsername: messageItem.receiverUsername,
      content: messageItem.content
    };

    console.log('쪽지 전송 요청:', data);

    const response = await apiClient.post('/messages', data);
    if (response.status === 200) {
      alert('쪽지가 전송되었습니다. 알림이 발송되었습니다.');
    } else {
      alert('쪽지 전송 실패');
    }
  } catch (error) {
    alert('전송 에러 발생: ' + error);
  }
};

// ❌ 취소
const cancelMessage = () => {
  router.back();
};

// 🚀 자동 전송 로직
onMounted(async () => {
  console.log('[자동 전송 시작]');
  const receiver = route.query.receiver;
  const content = route.query.content;
  const autoSend = route.query.autoSend;

  if (receiver) messageItem.receiverUsername = receiver;
  if (content) messageItem.content = content;

  if (receiver && content && autoSend === 'true') {
    autoSendActive.value = true;
    await sendMessage();
    router.back();
  }
});
</script>
