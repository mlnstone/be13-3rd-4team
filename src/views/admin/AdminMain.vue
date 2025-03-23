<template>
  <div class="admin-page">
    <h2>관리자 페이지</h2>

    <!-- 상단 탭 메뉴 -->
    <div class="tab-menu">
      <button
        v-for="tab in tabs"
        :key="tab.name"
        @click="activeTab = tab.name"
        :class="{ active: activeTab === tab.name }"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- 탭 내용 -->
    <div class="tab-content">
      <component :is="activeTabComponent" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 각 탭과 연결될 컴포넌트 import
import AdminUserList from './UserList.vue'
import FeedbackList from './FeedbackList.vue'
import AdminProjectList from './AdminProjectList.vue'
import TechManager from './AdminTechManage.vue'

const tabs = [
  { name: 'AdminUserList', label: '회원 관리' },
  { name: 'FeedbackList', label: '피드백 관리' },
  { name: 'AdminProjectList', label: '프로젝트 관리' },
  { name: 'TechManager', label: '기술 관리' },
]

const activeTab = ref('AdminUserList')

const componentsMap = {
  AdminUserList,
  FeedbackList,
  AdminProjectList,
  TechManager,
}

const activeTabComponent = computed(() => componentsMap[activeTab.value])
</script>

<style scoped>
.admin-page {
  padding: 20px;
}

.tab-menu {
  display: flex;
  gap: 10px;
  border-bottom: 2px solid #ccc;
  margin-bottom: 1rem;
}

.tab-menu button {
  padding: 10px 20px;
  border: none;
  background: none;
  font-size: 1rem;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: 0.2s;
}

.tab-menu button.active {
  font-weight: bold;
  border-color: #007bff;
  color: #007bff;
}

.tab-menu button:hover {
  color: #0056b3;
}

.tab-content {
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
}
</style>