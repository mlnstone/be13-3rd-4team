# Moyobom - 팀 협업 플랫폼

![Moyobom 로고](https://github.com/user-attachments/assets/2073c21b-e64c-487f-8430-da96c69139fb)

Moyobom은 Vue 3로 구축된 종합적인 팀 협업 플랫폼으로, 사용자가 팀을 생성하고, 프로젝트를 관리하며, 활동을 스케줄링하고, 효과적으로 소통할 수 있도록 설계되었습니다. 이 플랫폼은 팀 구성, 프로젝트 관리 및 협업을 위한 원활한 경험을 제공합니다.

## 사용 기술

### 프론트엔드
- **Vue 3**: Composition API를 활용하여 코드 구성과 재사용성 향상
- **Vite**: 더 빠른 개발과 최적화된 빌드를 위한 차세대 프론트엔드 도구
- **Vue Router**: 단일 페이지 애플리케이션 탐색을 가능하게 하는 Vue.js 공식 라우터
- **Axios**: API 요청을 위한 Promise 기반 HTTP 클라이언트
- **Bootstrap 5**: 반응형 및 현대적인 UI 컴포넌트를 위한 CSS 프레임워크
- **JWT 인증**: JWT 토큰을 사용한 안전한 사용자 인증 및 갱신 메커니즘
- **EventBus (mitt)**: 컴포넌트 간 통신을 위한 경량 이벤트 버스
- **PapaParse**: 데이터 조작을 위한 CSV 파싱 라이브러리
- **day.js**: 경량 날짜 조작 라이브러리

### 주요 기능
- **실시간 알림**: 실시간 알림 전달을 위한 서버 전송 이벤트(SSE) 구현
- **JWT 토큰 갱신**: 원활한 사용자 경험을 위한 자동 토큰 갱신 메커니즘
- **반응형 디자인**: 다양한 화면 크기에 적응하는 모바일 친화적 UI

## 아키텍처

### 핵심 컴포넌트

#### 인증 시스템
- JWT를 사용한 토큰 기반 인증
- 자동 토큰 갱신 메커니즘
- 역할 기반 액세스 제어 (사용자, 관리자)
- 이메일 인증을 통한 계정 관리

#### 프로젝트 관리
- 프로젝트 생성 및 추적
- 팀 구성 및 관리
- 작업 일정 관리 및 진행 상황 추적
- 기술 스택 태그 시스템

#### 커뮤니케이션 도구
- 내부 메시징 시스템
- 게시물에 대한 댓글 시스템
- 콘텐츠 중재를 위한 신고 시스템
- 중요 업데이트(댓글, 신고, 팀)를 위한 알림 시스템

#### 사용자 관리
- 맞춤 정보를 제공하는 사용자 프로필
- 활동 추적 (게시물, 댓글, 프로젝트)
- 팀 내 역할 관리

## 프로젝트 구조

```
src/
├── api/                  # API 클라이언트 구성
├── assets/               # 정적 자산 (이미지, 글로벌 CSS)
├── components/           # 재사용 가능한 Vue 컴포넌트
│   ├── common/           # 앱 전체에서 사용되는 공유 컴포넌트
│   ├── forms/            # 데이터 입력을 위한 폼 컴포넌트
│   ├── project/          # 프로젝트 특정 컴포넌트
│   └── tables/           # 데이터 표시를 위한 테이블 컴포넌트
├── layout/               # 레이아웃 컴포넌트 (헤더, 푸터 등)
├── router/               # Vue Router 구성
├── stores/               # 상태 관리를 위한 Pinia 저장소
├── utils/                # 유틸리티 함수 및 헬퍼
├── views/                # 페이지 컴포넌트
│   ├── admin/            # 관리자 대시보드 및 기능
│   ├── auth/             # 인증 페이지 (로그인, 회원가입)
│   ├── post/             # 게시물 관련 페이지 및 컴포넌트
│   ├── project/          # 프로젝트 관리 뷰
│   ├── team/             # 팀 협업 뷰
│   └── user/             # 사용자 프로필 및 설정
└── App.vue               # 루트 컴포넌트
```

## 핵심 기능

### 팀 관리
- 팀 생성 및 가입
- 팀원 및 역할 관리
- 팀 활동 및 프로젝트 보기

### 프로젝트 작업 공간
- 상세 정보가 포함된 프로젝트 생성
- 관련 기술로 프로젝트 태그 지정
- 프로젝트 상태 및 진행 상황 추적
- 팀원과의 협업

### 일정 관리 시스템
- 일정 생성 및 관리
- 마감일 및 중요 날짜 추적
- 팀원에게 작업 할당
- 진행 상황 및 완료 상태 모니터링

### 커뮤니케이션
- 사용자 간 내부 메시징
- 중요 업데이트(댓글, 신고, 팀)를 위한 알림
- 게시물 및 프로젝트에 대한 댓글 시스템
- 부적절한 콘텐츠에 대한 신고 메커니즘

### 사용자 대시보드
- 개인 활동 보기 (게시물, 댓글, 프로젝트)
- 계정 설정 및 환경 설정 관리
- 알림 및 메시지 수신

## 보안 기능

- **JWT 인증**: 안전한 토큰 기반 인증
- **토큰 갱신**: 만료된 토큰 자동 갱신
- **이메일 인증**: 계정 보안을 위한 2단계 인증
- **입력 유효성 검사**: 클라이언트 측 및 서버 측 유효성 검사
- **역할 기반 액세스**: 사용자 역할에 따른 권한 제어

## 관리자 기능

- **사용자 관리**: 사용자 계정 보기 및 관리
- **콘텐츠 중재**: 신고된 콘텐츠 처리
- **프로젝트 감독**: 플랫폼의 모든 프로젝트 모니터링
- **기술 관리**: 사용 가능한 기술 태그 관리

<br>

### 회원
<details>
  <summary>로그인 구현</summary>
  
  ![Image](https://github.com/user-attachments/assets/4cc4516d-0639-4f9b-baf0-434ed190aea3)
</details>

<details>
  <summary>이메일 인증 성공/실패 구현</summary>
    
  ![Image](https://github.com/user-attachments/assets/775e6ee6-78f1-4efd-92e5-e0f2e6d89408)
</details>

<br>

### 게시판

<details>
  <summary>게시글 작성</summary>
    
  ![Image](https://github.com/user-attachments/assets/6c4f2f8a-9e94-41a5-afc4-eb09580c7d39)
</details>

<details>
  <summary>게시글 수정/삭제</summary>
    
  ![Image](https://github.com/user-attachments/assets/1540cf62-e9c3-4973-a988-3b42cc602e67)
</details>

<details>
  <summary>이메일 인증 성공/실패 구현</summary>
    
  ![Image](https://github.com/user-attachments/assets/775e6ee6-78f1-4efd-92e5-e0f2e6d89408)
</details>

<details>
  <summary>북마크</summary>
    
  ![Image](https://github.com/user-attachments/assets/3e2b7810-942e-407e-b251-4cbe385d9843)
</details>

<details>
  <summary>일반회원 공지사항 작성 불가</summary>
    
  ![Image](https://github.com/user-attachments/assets/12f09b33-b982-4455-b302-126eb2ddf85e)
</details>
<details>
  <summary>댓글 이벤트 발생 시 알림 전송, 댓글 렌더링, 좋아요 기능</summary>
    
   ![Image](https://github.com/user-attachments/assets/652a5ccc-b314-4246-8ed7-4367b93a9452)
</details>


<br>

### 쪽지 전송

<details>
  <summary>쪽지 송신</summary>
    
  ![Image](https://github.com/user-attachments/assets/3dfe94e0-8592-48b2-873a-ef3d114d8440)
</details>

<details>
  <summary>쪽지 수신</summary>
    
 ![Image](https://github.com/user-attachments/assets/96a4865d-e275-418c-bfdf-6d19b028ed59)
</details>

<br>

### 팀 

<details>
  <summary>팀 생성</summary>
    
 ![Image](https://github.com/user-attachments/assets/9ab6f8d9-be26-45a3-924b-70b190710b45)
</details>

<details>
  <summary>팀 신청</summary>
    

  ![Image](https://github.com/user-attachments/assets/e201aec3-1ef6-4259-997c-d29fc56516c7)
</details>

<details>
  <summary>팀원 목록 조회</summary>
  
  ![Image](https://github.com/user-attachments/assets/923ed858-aeec-4f39-8f03-3d9d10d2c158)
</details>

<details>
  <summary>팀원 역할명 변경</summary>
  
  ![Animation](https://github.com/user-attachments/assets/39d55b57-90ec-4aff-855a-e3153b88f1ee)
</details>

<details>
  <summary>팀장 권한 위임</summary>
  
  ![Animationjh](https://github.com/user-attachments/assets/734b261c-4066-4c3b-843a-6606c7fb7c8c)
</details>

<details>
  <summary>프로젝트 생성</summary>
    
  ![Image](https://github.com/user-attachments/assets/b57d7fc3-7879-4efa-82f5-a1ce6c1d0c74)
</details>

<details>
  <summary>프로젝트 내 스케줄 생성</summary>
   
  ![Image](https://github.com/user-attachments/assets/459b9586-6d94-4ab7-8c5e-773c06336ce4)
</details>



<br><br>


# 회고록

|   조원 이름	|  회고  	|
|---	|---	|
|   최건 	|   	|
|   송현준 	|   	|
|   홍도현 	|   	|
|   김민석  |   	|
|   홍재민	|   	|
|   임현조	|  처음으로 Vue.js를 사용해 REST API를 통해 서버와 데이터를 주고받는 과정이나 컴포넌트의 생명 주기를 고려해 메서드를 작성하는 데 어려움을 느꼈지만, 팀원들이 먼저 기반을 잘 마련해준 덕분에 맡은 부분을 무사히 완성할 수 있었습니다. 오류를 하나씩 해결할 때마다 큰 성취감을 느꼈고, 동시에 프론트엔드 기술에 대한 부족함도 많이 느껴 더 깊이 배우고 싶다는 열정을 갖게 되었습니다. 	|


<br><br><br><br><br><br>



