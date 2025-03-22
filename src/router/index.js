
import { useAuthStore } from '@/stores/auth'
import { onMounted } from 'vue';
import { createRouter, createWebHistory } from 'vue-router'

// import AuthLayout from '@/layout/AuthLayout.vue'
// import BaseLayout from '@/layout/BaseLayout.vue'
// import Login from '@/views/auth/Login.vue'
// import NotFound from '@/views/common/NotFound.vue'
// import AddDepartment from '@/views/department/AddDepartment.vue'
// import DepartmentDetail from '@/views/department/DepartmentDetail.vue'
// import Departments from '@/views/department/Departments.vue'
// import Home from '@/views/Home.vue'

// 지연 로딩(Lazy Loading) 적용
// 지연 로딩은 컴포넌트가 이용되는 시점에 컴포넌트 및 관련된 모듈을 웹 서버로부터 로딩하는 방법이다.
const AuthLayout = () => import('@/layout/AuthLayout.vue');
const Login = () => import('@/views/auth/Login.vue');
// 404 NotFound
const NotFound = () => import('@/views/common/NotFound.vue');
// Layout
const BaseLayout = () => import('@/layout/BaseLayout.vue');

// Home
const Home = () => import('@/views/Home.vue');

// Department
const AddDepartment = () => import('@/views/department/AddDepartment.vue');
const DepartmentDetail = () => import('@/views/department/DepartmentDetail.vue');
const Departments = () => import('@/views/department/Departments.vue');

// Message
const AddMessage = () => import('@/views/message/AddMessage.vue');
const MessageDetail = () => import('@/views/message/MessageDetail.vue');
const Messages = () => import('@/views/message/Messages.vue');

// Project
const AddProject = () => import('@/views/project/AddProject.vue');
const ProjectDetail = () => import('@/views/project/ProjectDetail.vue');
const Projects = () => import('@/views/project/Projects.vue');

// Team
const AddTeam = () => import('@/views/team/AddTeam.vue');
const TeamDetail = () => import('@/views/team/TeamDetail.vue');
const Teams = () => import('@/views/team/Teams.vue');

const router = createRouter({
  // 라우터가 사용할 라우팅 모드 지정 (HTML 5 모드)
  history: createWebHistory(import.meta.env.BASE_URL),
  // 요청 경로에 따라 렌더링 할 컴포넌트 배열로 지정
  // 명명된 라우트
  // routes: [
  //   { path: '/', name: 'home', component: Home },
  //   { path: '/departments', name: 'departments', component: Departments },
  //   // 동적 라우트는 일정한 패턴의 URI 경로를 하나의 라우트에 연결하는 방법이다.
  //   { path: '/departments/:no', name: 'departments/no', component: DepartmentDetail },
  //   { path: '/departments/add', name: 'departments/add', component: AddDepartment },
  //   // 404 라우트
  //   { path: '/:paths(.*)*', name: 'notfound', component: NotFound}
  // ],

  // 중첩된 라우트
  // RouterView에 의해서 렌더링된 컴포넌트가 다시 RouterView를 이용해 자식 라우트에 매칭된 컴포넌트를 렌더링한다. 
  routes: [
    {
      path: '/',
      name: 'base',
      component: BaseLayout,
      children: [
        { 
          path: '', 
          name: 'home', 
          component: Home 
        },
        // departments
        { 
          path: 'departments', 
          name: 'departments', 
          component: Departments 
        },
        { 
          path: 'departments/:no', 
          name: 'departments/no', 
          component: DepartmentDetail 
        },
        { 
          path: 'departments/add', 
          name: 'departments/add', 
          component: AddDepartment 
        },
        // messages
        {
          path: 'messages',
          name: 'messages',
          component: Messages
        },
        {
          path: 'messages/:no',
          name: 'messages/no',
          component: MessageDetail
        },
        {
          path: 'messages/add',
          name: 'messages/add',
          component: AddMessage
        },
        // projects
        {
          path: 'projects',
          name: 'projects',
          component: Projects
        },
        {
          path: 'projects/:no',
          name: 'projects/no',
          component: ProjectDetail
        },
        {
          path: 'projects/add',
          name: 'projects/add',
          component: AddProject
        },
        // teams
        {
          path: 'teams',
          name: 'teams',
          component: Teams
        },
        {
          path: 'teams/:no',
          name: 'teams/no',
          component: TeamDetail
        },
        {
          path: 'teams/add',
          name: 'teams/add',
          component: AddTeam
        },
      ]
    },
    {
      path: '/auth',
      name: 'auth',
      component: AuthLayout,
      children: [
        {
          path: 'login',
          name: 'login',
          component: Login
        }
      ]
    },
    // 404 라우트
    { 
      path: '/:paths(.*)*', 
      name: 'notfound', 
      component: NotFound
    }
  ],
});

// 네비게이션 가드
//  - 라우팅이 일어날 때 프로그래밍 방식으로 네비게이션을 안전하게 보호하는 기능을 수행한다.
//  - 네비게이션 가드는 라우트하는 경로가 바뀔 때 반응한다.
router.beforeEach((to, form, next) => {
  const authStore = useAuthStore();

  // 로그인 페이지가 아니고, 로그인 상태가 아니면 로그인 페이지로 리다이렉트한다.
  if(to.name !== 'login' && !authStore.isLoggedIn) {
    next({name: 'login'});
  } else {
    next();
  }
});

export default router
