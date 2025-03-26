<template>
    <main class="home-container">
        <section class="intro">
            <h1>당신의 프로젝트, 여기서 시작하세요!</h1>
            <p>팀원을 모집하고, 프로젝트를 효율적으로 관리하세요.</p>
        </section>

        <section class="features">
            <div class="feature-card">
                <h2>👥 <br>프로젝트 구인</h2>
                <p>함께할 팀원을 찾고, <br> 최고의 팀을 구성하세요.</p>
                <router-link to="/teams" class="btn">팀원 모집</router-link>
            </div>
            <div class="feature-card">
                <h2>📋 <br>프로젝트 관리</h2>
                <p>진행 중인 프로젝트를 <br> 체계적으로 관리하세요.</p>
                <router-link to="/projects" class="btn">프로젝트 관리</router-link>
            </div>
        </section>
    </main>
</template>

<style scoped>
.home-container {
    text-align: center;
    padding: 40px;
}

.intro h1 {
    font-size: 2rem;
    margin-bottom: 10px;
}

.features {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 30px;
}

.feature-card {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 10px;
    width: 250px;
    text-align: center;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
}

.feature-card h2 {
    margin-bottom: 10px;
}

.btn {
    display: inline-block;
    margin-top: 10px;
    padding: 10px 15px;
    background: #007bff;
    color: white;
    border-radius: 5px;
    text-decoration: none;
}
</style>
