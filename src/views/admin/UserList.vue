<template>
  <div class="user-list-container">
    <h2> 유저 관리 페이지</h2>

    <!-- 🔽 정렬 기준 드롭다운 -->
    <div>
      <label for="sortOption">정렬 기준:</label>

      <select id="sortOption" v-model="sortOption" @change="fetchUsers">
        <option value="LATEST">최신 가입순</option>
        <option value="USERNAME">이름순</option>
        <option value="ROLE">권한순</option>
      </select>
    </div>

    <table>
      <thead>
      <tr>
        <th>사용자명</th>
        <th>이메일</th>
        <th>역할</th>
        <th>ban 여부</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="user in userList" :key="user.username" @click="goToUserDetail(user.userNo)">
        <td>{{ user.username }}</td>
        <td>{{ user.email }}</td>
        <td><span :class="['role-badge', user.role.toLowerCase()]">{{ user.role }}</span></td>
        <td>{{ user.banned }}</td>
      </tr>
      </tbody>
    </table>

    <div class="pagination">
      <button @click="prevPageGroup" :disabled="pageGroupStart === 1">«</button>
      <button v-for="page in pageNumbers"
              :key="page"
              @click="moveToPage(page)"
              :class="{ active: currentPage === page }">
        {{ page }}
      </button>
      <button @click="nextPageGroup" :disabled="pageGroupEnd >= totalPages">»</button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      userList: [],
      currentPage: 1,
      totalPages: 1,
      pageGroupStart: 1,
      pageGroupSize: 10,
      sortOption: 'LATEST', // 🔥 정렬 기준 추가
    };
  },
  computed: {
    pageGroupEnd() {
      return Math.min(this.pageGroupStart + this.pageGroupSize - 1, this.totalPages);
    },
    pageNumbers() {
      return Array.from({ length: this.pageGroupEnd - this.pageGroupStart + 1 }, (_, i) => i + this.pageGroupStart);
    }
  },
  mounted() {
    const fromUserList = sessionStorage.getItem('fromUserList') === 'true';
    const fromHistoryBack = performance.getEntriesByType("navigation")[0]?.type === 'back_forward';

    if (fromUserList && fromHistoryBack) {
      const savedPage = sessionStorage.getItem('userListPage');
      this.currentPage = savedPage ? parseInt(savedPage) : 1;
      sessionStorage.removeItem('fromUserList');
    } else {
      this.currentPage = 1;
      sessionStorage.removeItem('userListPage');
    }

    this.fetchUsers();
  },
  watch: {
    sortOption() {
      this.currentPage = 1;
      this.pageGroupStart = 1;
      this.fetchUsers();
    }
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await fetch(`http://localhost:8087/admin/users?page=${this.currentPage - 1}&size=10&sortOption=${this.sortOption}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`
          }
        });
        const data = await response.json();
        this.userList = data.content;
        this.totalPages = data.totalPages;

      } catch (error) {
        console.error("🚨 유저 목록 가져오기 실패:", error);
      }
    },
    moveToPage(page) {
      this.currentPage = page;
      sessionStorage.setItem('userListPage', page);
      this.fetchUsers();
    },
    prevPageGroup() {
      if (this.pageGroupStart > 1) {
        this.pageGroupStart -= this.pageGroupSize;
        this.currentPage = this.pageGroupStart;
        this.fetchUsers();
      }
    },
    nextPageGroup() {
      if (this.pageGroupEnd < this.totalPages) {
        this.pageGroupStart += this.pageGroupSize;
        this.currentPage = this.pageGroupStart;
        this.fetchUsers();
      }
    },
    goToUserDetail(userNo) {
      sessionStorage.setItem('fromUserList', 'true');
      this.$router.push(`/admin/user/${userNo}`);
    }
  }
};
</script>

<style scoped>


label {
  font-weight: bold;
  margin-right: 10px;
}

select {
  padding: 5px;
  margin-bottom: 15px;
}

h2 {
  text-align: center;
  margin-top: 25px;
  margin-bottom: 25px;
  font-weight: 700;
  color: #343a40;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: #fafbfc;
  overflow: hidden;
  border-radius: 8px;
  table-layout: fixed;
}

th, td {
  padding: 15px;
  text-align: center;
}

th {
  background-color: grey;
  color: #ffffff;
  font-weight: 600;
  position: sticky; /* 헤더 고정 */
}

tbody tr {
  border-bottom: 1px solid #dee2e6;
  transition: background-color 0.3s;
}

tbody tr:hover {
  background-color: #edf2ff;
}

.role-badge {
  padding: 4px 8px;
  border-radius: 12px;
  color: white;
  font-size: 12px;
}

.role-badge.admin {
  background-color: #ff6b6b;
}

.role-badge.user {
  background-color: #15aabf;
}

.pagination {
  display: flex;
  justify-content: center;  /* 페이징 버튼을 정확히 중앙에 배치 */
  align-items: center;
  margin-top: 25px;
}

.pagination button {
  padding: 6px 12px;
  margin: 4px;
  border: none;
  background-color: #e9ecef;
  position: sticky; /* 페이지네이션 고정 */
  color: #495057;
  cursor: pointer;
  border-radius: 5px;
  transition: all 0.3s;
}

.pagination button.active,
.pagination button:hover:not(:disabled) {
  background-color: #4c6ef5;
  color: #ffffff;
}

.pagination button:disabled {
  background-color: #ced4da;
  cursor: not-allowed;
  color: #868e96;
}
</style>
