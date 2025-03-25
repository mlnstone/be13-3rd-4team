<template>
    <div class="project-info-container">
        <h1 class="project-title">프로젝트 정보</h1>
        <div class="project-details">
            <div class="detail-item">
                <span class="detail-label">프로젝트 명:</span>
                <span class="detail-value">{{ project.name }}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">상태:</span>
                <span class="detail-value"
                    :class="[project.projectStatus === 'OPEN' ? 'status-open' : project.projectStatus === 'IN_PROGRESS' ? 'status-in-progress' : 'status-closed']">
                    {{ project.projectStatus }}
                </span>
            </div>
            <div class="detail-item content-item">
                <span class="detail-label">내용:</span>
                <p class="detail-value content-text">
                    {{ project.content }}
                </p>
            </div>
            <div>
                <span v-for="tech in project.projectTeches" :key="tech.no" class="tech">
                    {{ tech }}
                </span>
            </div>
        </div>
        <router-link :to="`/project/${project.teamNo}`" v-if="project.teamNo">
            <button class="view-more-button">프로젝트 자세히 보기</button>
        </router-link>
    </div>
</template>

<script setup>
// 부모로 부터 받아올 데이터
defineProps({
    // 받아올 데이터 명
    project: {
        type: Object,
        required: true,
    },
    team: {
        type: Object,
    },
});
</script>

<style scoped>
.project-info-container {
    background-color: #f9f8f7;
    /* Light background */
    border-radius: 12px;
    /* Rounded corners */
    padding: 24px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    /* Soft shadow */
    margin-bottom: 20px;
}

.project-title {
    font-size: 28px;
    font-weight: bold;
    color: #2c3e50;
    /* Darker title */
    margin-bottom: 24px;
    text-align: center;
}

.project-details {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 24px;
}

.detail-item {
    display: flex;
    align-items: flex-start;
    /* Align items to the start, especially for content */
    gap: 8px;
    width: 100%;
}

.detail-label {
    font-size: 18px;
    font-weight: 500;
    /* Medium font weight for labels */
    color: #7f8c8d;
    /* Muted label color */
    width: 120px;
    /* Fixed width for labels */
    flex-shrink: 0;
    /* Prevent label from shrinking */
    text-align: left;
}

.detail-value {
    font-size: 18px;
    color: #34495e;
    /* Darker value color */
    flex: 1;
    /* Allow value to take up remaining space */
    word-wrap: break-word;
    /* Handle long words */
}

.content-item {
    flex-direction: column;
    align-items: flex-start;
}

.content-text {
    margin-top: 8px;
    line-height: 1.7;
    /* Improved line height for readability */
}

.status-open {
    color: #2ecc71;
    /* Green for OPEN */
    font-weight: 600;
}

.status-in-progress {
    color: #f39c12;
    /* Orange for IN_PROGRESS */
    font-weight: 600;
}

.status-closed {
    color: #e74c3c;
    /* Red for CLOSED */
    font-weight: 600;
}

.view-more-button {
    padding: 12px 24px;
    font-size: 18px;
    color: white;
    background-color: #3498db;
    /* Blue button */
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    align-self: center;
    margin-top: 16px;
}

.view-more-button:hover {
    background-color: #2980b9;
    /* Darker blue on hover */
}

.tech {
    margin-right: 8px;
    /* 기술명 간 간격 */
    padding: 4px 8px;
    /* 기술명 내부 여백 */
    background-color: #e0e0e0;
    /* 기술명 배경색 */
    border-radius: 15px;
    /* 기술명 테두리 둥글게 */
}

.tech:last-child {
    margin-right: 0;
    /* 마지막 기술명 간 간격 제거 */
}
</style>
