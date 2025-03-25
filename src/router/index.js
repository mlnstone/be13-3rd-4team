
import { useAuthStore } from '@/stores/auth'
import { onMounted } from 'vue';
import { createRouter, createWebHistory } from 'vue-router'
import UserFeedbackList from "@/views/feedback/UserFeedbackList.vue";
import ProjectFeedbackList from "@/views/feedback/ProjectFeedbackList.vue";
import FeedbackCreate from "@/views/feedback/FeedbackCreate.vue";


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
// Auth
const AuthLayout = () => import('@/layout/AuthLayout.vue');
const Login = () => import('@/views/auth/Login.vue');
const SignUp = () => import('@/views/auth/SignUp.vue');

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

// Report
const AddReport = () => import('@/views/report/AddReport.vue');
const ReportDetail = () => import('@/views/report/ReportDetail.vue');
const Reports = () => import('@/views/report/Reports.vue');

// Post
const AddPost = () => import('@/views/post/AddPost.vue');
// const PostDetail = () => import('@/views/post/PostDetail.vue');
const Posts = () => import('@/views/post/Posts.vue');

// MyPage
const MyPage = () => import('@/views/user/MyPage.vue');

// Post
const PostList = () => import('@/views/post/PostList.vue');
const PostDetail = () => import('@/views/post/PostDetail.vue');
const PostWrite = () => import('@/views/post/PostWrite.vue');

// Comment
const CommentList = () => import('@/views/post/comment/CommentList.vue');
const CommentCreate = () => import('@/views/post/comment/CommentCreate.vue');

// Admin
const AdminMain = () => import('@/views/admin/AdminMain.vue')
const AdminLogin = () => import('@/views/admin/AdminLogin.vue')
const AdminProjectList = () => import('@/views/admin/AdminProjectList.vue')
const AllUserComments = () => import('@/views/admin/AllUserComments.vue')
const AdminTechManage = () => import('@/views/admin/AdminTechManage.vue')
const FeedbackList = () => import('@/views/admin/FeedbackList.vue')
const UserAllPost = () => import('@/views/admin/UserAllPost.vue')
const UserDetail = () => import('@/views/admin/UserDetail.vue')
const UserAllProject = () => import('@/views/admin/UserAllProject.vue')
const UserList = () => import('@/views/admin/UserList.vue')


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
        // post
        { 
          path: 'post', 
          name: 'post',
          component: PostList 
        },
        { 
          path: 'post/:postNo',
          name: 'postDetail',
          component: PostDetail 
        },
        { 
          path: 'post/write', 
          name: 'PostWrite', 
          component: PostWrite 
        },
        // comment
        {
          path: 'posts/:postNo/comments', 
          name: 'CommentList', 
          component: CommentList
        },
        { 
          path: 'posts/:postNo/comments/create', 
          name: 'CommentCreate', 
          component: CommentCreate 
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
        // feedbacks
        {path: "/my-feedbacks", 
          name: 'MyFeedbackList', 
          component: UserFeedbackList 
        },
        {
          path: '/project/:projectNo/feedbacks',
          name: 'ProjectFeedbackList',
          component: ProjectFeedbackList
        },
        {
          path: '/project/:projectNo/feedbacks/create',
          name: 'FeedbackCreate',
          component: FeedbackCreate
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
        // reports
        {
          path: 'reports',
          name: 'reports',
          component: Reports
        },
        {
          path: 'reports/:no',
          name: 'reports/no',
          component: ReportDetail
        },
        {
          path: 'reports/add',
          name: 'reports/add',
          component: AddReport
        },
        // posts
        {
          path: 'posts',
          name: 'posts',
          component: Posts
        },
        {
          path: 'posts/:no',
          name: 'posts/no',
          component: PostDetail
        },
        {
          path: 'posts/add',
          name: 'posts/add',
          component: AddPost
        },
        // mypage
        {
          path: 'mypage',
          name: 'mypage',
          component: MyPage
        },

        // admin
        {
          path: 'admin',
          name: 'admin',
          component: AdminMain
        },
        {
          path: 'admin/login',
          name: 'admin-login',
          component: AdminLogin
        },
        {
          path: 'admin/projects',
          name: 'admin-projects',
          component: AdminProjectList
        },
        {
          path: 'admin/user/:userNo/comments',
          name: 'admin-user-comments',
          component: AllUserComments
        },

        {
          path: 'admin/tech',
          name: 'admin-tech',
          component: AdminTechManage
        },
        {
          path: 'admin/feedbacks',
          name: 'admin-feedbacks',
          component: FeedbackList
        },
        {
          path: 'admin/user/:userNo/posts',
          name: 'admin-user-posts',
          component: UserAllPost
        },
        {
          path: 'admin/user/:userNo/projects',
          name: 'admin-user-projects',
          component: UserAllProject
        },
        {
          path: 'admin/user/:userNo',
          name: 'admin-user-detail',
          component: UserDetail
        },
        {
          path: 'admin/users',
          name: 'admin-users',
          component: UserList
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
        },
        {
          path: 'signup',
          name: 'signup',
          component: SignUp
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

  console.log('to: ', to);
  console.log('from: ', form);

  // 로그인 페이지에서 회원가입 페이지로 이동할 때는 그대로 이동한다. => 무한 리다이렉트 방지
  if (to.name === 'signup') {
    next();
  }

  // 로그인 페이지가 아니고, 로그인 상태가 아니면 로그인 페이지로 리다이렉트한다.
  if(to.name !== 'login' && !authStore.isLoggedIn) {
    next({name: 'login'});
  } 
  //
  // if (to.path.startsWith('/admin') && authStore.user?.role !== 'ADMIN') {
  //   alert('관리자 권한이 필요합니다.')
  //   return next({ name: 'home' });
  // }
  
  next();
});


export default router
