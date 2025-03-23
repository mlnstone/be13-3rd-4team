<template>
  <div v-if="user" class="user-detail-container">
    <h1>{{ user.username }}님의 정보</h1>
    <button @click="toggleBanUser" class="ban-btn" :class="{ 'banned': user.banned }">
      {{ user.banned ? '정지 해제' : '정지' }}
    </button>
    <button @click="deleteUser" class="delete-btn">유저 삭제</button>
    <table class="user-detail-table">
      <tbody>
      <tr>
        <th>권한</th>
        <td>{{ user.role }}</td>
      </tr>
      <tr>
        <th>이메일</th>
        <td>{{ user.email }}</td>
      </tr>
      <tr>
        <th>전화번호</th>
        <td>{{ user.phoneNum }}</td>
      </tr>
      <tr>
        <th>정지 여부</th>
        <td>{{ user.banned ? '정지됨' : '활성' }}</td>
      </tr>
      <tr>
        <th>비밀번호 오류 횟수</th>
        <td>{{ user.passwordErrorCount }}</td>
      </tr>
      <tr>
        <th>생성일</th>
        <td>{{ user.createdAt }}</td>
      </tr>
      <tr>
        <th>수정일</th>
        <td>{{ user.updateAt }}</td>
      </tr>
      <tr>
        <th>상태</th>
        <td>{{ user.status }}</td>
      </tr>
      </tbody>
    </table>
  </div>


  <button @click="goToUserComments" class="comment-btn">모든 댓글 가져오기</button>
  <button @click="goToUserPosts" class="comment-btn">모든 게시글 가져오기</button>
  <button @click="goToUserProjects" class="comment-btn">모든 프로젝트 가져오기</button>


</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const userNo = route.params.userNo;
const user = ref(null);

onMounted(async () => {
  try {
    const res = await axios.get(`http://localhost:8087/admin/user/${userNo}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    });
    user.value = res.data;
  } catch (error) {
    console.error('유저 정보를 불러오는 데 실패했습니다:', error);
  }
});

const goToUserComments = () => {
  router.push(`/admin/user/${userNo}/comments`);
};

const goToUserPosts = () => {
  router.push(`/admin/user/${userNo}/post`);
};

const goToUserProjects = () => {
  router.push(`/admin/user/${userNo}/projects`);
};

const toggleBanUser = async () => {
  if (!user.value) return;

  console.log(user);

  const confirmAction = confirm(user.value.banned ? "이 사용자의 정지를 해제하시겠습니까?" : "이 사용자를 정지하시겠습니까?");
  if (!confirmAction) return;

  try {
    const res = await axios.post(
        `http://localhost:8087/${user.value.username}/ban`,
        { username: user.value.username, ban: !user.value.banned }, // 현재 반대 상태로 전송
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json"
          }
        }
    );

    alert(res.data.message); // "Successfully" 메시지 출력
    user.value.banned = !user.value.banned; // UI 업데이트

  } catch (error) {
    console.error("유저 정지 처리 중 오류 발생:", error);
    alert("유저 정지 처리에 실패했습니다.");
  }
};
const deleteUser = async () => {
  const confirmed = confirm("정말 이 유저를 삭제하시겠습니까?");
  if (!confirmed) return;

  try {
    const res = await axios.post(`http://localhost:8087/admin/delete/${userNo}`, null, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    });

    alert(res.data.message || "삭제가 완료되었습니다.");
    router.push('/admin'); // 유저 리스트 페이지 등으로 이동

  } catch (error) {
    console.error("유저 삭제 중 오류 발생:", error);
    alert("유저 삭제에 실패했습니다.");
  }
};

</script>

<style>
.delete-btn {
  display: inline-block;
  margin: 1rem 0.5rem;
  padding: 10px 15px;
  font-size: 14px;
  font-weight: bold;
  color: white;
  background-color: #dc3545;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s ease-in-out;
}

.delete-btn:hover {
  background-color: #c82333;
}

.ban-btn {
  display: inline-block;
  margin: 1rem 0.5rem;
  padding: 10px 15px;
  font-size: 14px;
  font-weight: bold;
  color: white;
  background-color: #6c757d;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s ease-in-out;
}


.ban-btn:hover {
  opacity: 0.85;
}


.user-detail-container {
  margin: 2rem auto;
  padding: 1.5rem;
  background-color: #ffffff;
  border-radius: 8px;
}

.user-detail-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  border-radius: 8px;
  overflow: hidden;
}

.user-detail-table th,
.user-detail-table td {
  border: 1px solid #e0e0e0;
  padding: 12px;
  text-align: left;
  vertical-align: middle;
  font-size: 16px;
}

.user-detail-table th {
  background-color: #f8f9fa;
  font-weight: bold;
  text-transform: uppercase;
  color: #333;
  width: 25%;
}

.user-detail-table td {
  background-color: #ffffff;
  color: #555;
}

.comment-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 1rem 0.5rem;
  padding: 10px 15px;
  font-size: 14px;
  font-weight: bold;
  color: white;
  background-color: grey;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s ease-in-out;
}


</style>
