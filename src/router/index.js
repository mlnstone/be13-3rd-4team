import { useAuthStore } from "@/stores/auth";
import { onMounted } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import UserFeedbackList from "@/views/feedback/UserFeedbackList.vue";
import ProjectFeedbackList from "@/views/feedback/ProjectFeedbackList.vue";
import FeedbackCreate from "@/views/feedback/FeedbackCreate.vue";
import UpdatePasswordForm from "@/components/common/UpdatePasswordForm.vue";
import UserMyPostList from "@/views/user/UserMyPostList.vue";
import UserMyProjectList from "@/views/user/UserMyProjectList.vue";
import UserMyCommentList from "@/views/user/UserMyCommentList.vue";

// Auth
const AuthLayout = () => import("@/layout/AuthLayout.vue");
const Login = () => import("@/views/auth/Login.vue");
const SignUp = () => import("@/views/auth/SignUp.vue");

// 404 NotFound
const NotFound = () => import("@/views/common/NotFound.vue");

// Layout
const BaseLayout = () => import("@/layout/BaseLayout.vue");
const AdminLayout = () => import("@/layout/AdminLayout.vue");

// Home
const Home = () => import("@/views/Home.vue");

// Message
const AddMessage = () => import("@/views/message/AddMessage.vue");
const MessageDetail = () => import("@/views/message/MessageDetail.vue");
const Messages = () => import("@/views/message/Messages.vue");

// Project
const ProjectList = () => import("@/views/project/ProjectList.vue");
const ProjectDetail = () => import("@/views/project/ProjectDetail.vue");
const ProjectWrite = () => import("@/views/project/ProjectWrite.vue");

// Team
const TeamList = () => import("@/views/team/TeamList.vue");
const TeamDetail = () => import("@/views/team/TeamDeteil.vue");
const TeamWrite = () => import("@/views/team/TeamWrite.vue");
const TeamMembers = () => import("@/views/team/TeamMembers.vue");

// Schedule
const ScheduleList = () => import("@/views/schedule/ScheduleList.vue");
const ScheduleDetail = () => import("@/views/schedule/ScheduleDeteil.vue");
const ScheduleWrite = () => import("@/views/schedule/ScheduleWrite.vue");

// Report
const AddReport = () => import("@/views/report/AddReport.vue");
const ReportDetail = () => import("@/views/report/ReportDetail.vue");
const Reports = () => import("@/views/report/Reports.vue");

// MyPage
const MyPage = () => import("@/views/user/MyPage.vue");

// Post
const PostList = () => import("@/views/post/PostList.vue");
const PostDetail = () => import("@/views/post/PostDetail.vue");
const AddPost = () => import("@/views/post/AddPost.vue");

// Comment
const CommentList = () => import("@/views/post/comment/CommentList.vue");
const CommentCreate = () => import("@/views/post/comment/CommentCreate.vue");

// Admin
const AdminMain = () => import("@/views/admin/AdminMain.vue");
const AdminLogin = () => import("@/views/admin/AdminLogin.vue");
const AdminProjectList = () => import("@/views/admin/AdminProjectList.vue");
const AllUserComments = () => import("@/views/admin/AllUserComments.vue");
const AdminTechManage = () => import("@/views/admin/AdminTechManage.vue");
const FeedbackList = () => import("@/views/admin/FeedbackList.vue");
const UserAllPost = () => import("@/views/admin/UserAllPost.vue");
const UserDetail = () => import("@/views/admin/UserDetail.vue");
const UserAllProject = () => import("@/views/admin/UserAllProject.vue");
const UserList = () => import("@/views/admin/UserList.vue");

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "base",
      component: BaseLayout,
      children: [
        {
          path: "",
          name: "home",
          component: Home,
        },
        
        // user

        {
          path: "/my/posts",
          name: "my-posts",
          component: UserMyPostList,
          meta: { requiresAuth: true }
        },
        {
          path: "/my/projects",
          name: "my-projects",
          component: UserMyProjectList,
          meta: { requiresAuth: true }
        },
        {
          path: "/my/comments",
          name: "my-comments",
          component: UserMyCommentList,
          meta: { requiresAuth: true }
        },



        // post
        {
          path: "posts",
          name: "posts",
          component: PostList,
        },
        {
          path: "posts/:postNo",
          name: "postDetail",
          component: PostDetail,
        },
        {
          path: "posts/add",
          name: "posts/add",
          component: AddPost,
        },
        // comment
        {
          path: "posts/:postNo/comments",
          name: "CommentList",
          component: CommentList,
        },
        {
          path: "posts/:postNo/comments/create",
          name: "CommentCreate",
          component: CommentCreate,
        },
        // messages
        {
          path: "messages",
          name: "messages",
          component: Messages,
        },
        {
          path: "messages/:no",
          name: "messages/no",
          component: MessageDetail,
        },
        {
          path: "messages/add",
          name: "messages/add",
          component: AddMessage,
        },
        // projects
        {
          path: "projects",
          name: "projects",
          component: ProjectList,
        },
        {
          path: "projects/:no",
          name: "projects/no",
          component: ProjectDetail,
        },
        {
          path: "projects/add",
          name: "projects/add",
          component: ProjectWrite,
        },
        // feedbacks
        {
          path: "/my-feedbacks",
          name: "MyFeedbackList",
          component: UserFeedbackList,
        },
        {
          path: "/project/:projectNo/feedbacks",
          name: "ProjectFeedbackList",
          component: ProjectFeedbackList,
        },
        {
          path: "/project/:projectNo/feedbacks/create",
          name: "FeedbackCreate",
          component: FeedbackCreate,
        },
        // teams
        {
          path: "teams",
          name: "teams",
          component: TeamList,
        },
        {
          path: "teams/:no",
          name: "teams/no",
          component: TeamDetail,
        },
        {
          path: "teams/add",
          name: "teams/add",
          component: TeamWrite,
        },
        {
          path: "teams/:teamNo/members",
          name: "TeamMembers",
          component: TeamMembers,
        },
        // schedule
        {
          path: "teams/:teamNo/schedule/",
          name: "ScheduleList",
          component: ScheduleList,
        },
        {
          path: "teams/:teamNo/schedule/:scheduleNo",
          name: "ScheduleDetail",
          component: ScheduleDetail,
        },
        {
          path: "teams/:teamNo/schedule/add",
          name: "ScheduleWrite",
          component: ScheduleWrite,
        },
        // reports
        {
          path: "reports/add",
          name: "reports/add",
          component: AddReport,
        },
        // mypage
        {
          path: "mypage",
          name: "mypage",
          component: MyPage,
        },
      ],
    },
    {
      path: "/auth",
      name: "auth",
      component: AuthLayout,
      children: [
        {
          path: "login",
          name: "login",
          component: Login,
        },
        {
          path: "signup",
          name: "signup",
          component: SignUp,
        },
      ],
    },
    {
      path: "/admin",
      component: AdminLayout,
      children: [
        // admin
        {
          path: "",
          name: "admin-home",
          component: AdminMain,
        },
        {
          path: "login",
          name: "admin-login",
          component: AdminLogin,
        },
        {
          path: "projects",
          name: "admin-projects",
          component: AdminProjectList,
        },
        {
          path: "user/:userNo/comments",
          name: "admin-user-comments",
          component: AllUserComments,
        },

        {
          path: "tech",
          name: "admin-tech",
          component: AdminTechManage,
        },
        {
          path: "feedbacks",
          name: "admin-feedbacks",
          component: FeedbackList,
        },
        {
          path: "user/:userNo/posts",
          name: "admin-user-posts",
          component: UserAllPost,
        },
        {
          path: "user/:userNo/projects",
          name: "admin-user-projects",
          component: UserAllProject,
        },
        {
          path: "user/:userNo",
          name: "admin-user-detail",
          component: UserDetail,
        },
        {
          path: "users",
          name: "admin-users",
          component: UserList,
        },
        {
          path: "reports/:no",
          name: "admin-reports-detail",
          component: ReportDetail,
        },
        {
          path: "reports",
          name: "admin-reports",
          component: Reports,
        },
      ],
    },
    // updatePassword
    {
      path: "/updatePassword",
      name: "updatePassword",
      component: UpdatePasswordForm,
    },
    // 404 라우트
    {
      path: "/:paths(.*)*",
      name: "notfound",
      component: NotFound,
    },
  ],
});

// 네비게이션 가드
//  - 라우팅이 일어날 때 프로그래밍 방식으로 네비게이션을 안전하게 보호하는 기능을 수행한다.
//  - 네비게이션 가드는 라우트하는 경로가 바뀔 때 반응한다.
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const userInfo = authStore.userInfo;

  // 인증이 필요없는 페이지 목록
  const publicPages = ["login", "signup", "updatePassword", "admin-login"];
  const isPublicPage = publicPages.includes(to.name);

  // 1. 공개 페이지(로그인, 회원가입, 비밀번호 변경, 관리자 로그인)는 모두 접근 가능
  if (isPublicPage) {
    return next();
  }

  // 2. 비공개 페이지에 대한 로그인 검증
  if (!authStore.isLoggedIn) {
    if (to.name === "admin-home" && from.name === "admin-login") {
      console.log('here');
      return next();
    }

    // 관리자 페이지에 접근하려는 경우 관리자 로그인으로 리다이렉트
    if (to.path.startsWith("/admin")) {
      return next({ name: "admin-login" });
    }
    // 일반 페이지에 접근하려는 경우 일반 로그인으로 리다이렉트
    return next({ name: "login" });
  }

  // 3. 관리자 페이지에 대한 권한 검증 
  if (to.path.startsWith("/admin") && !isPublicPage) {
    if (userInfo.role !== "ADMIN") {
      alert("관리자 권한이 필요합니다.");
      return next({ name: "home" });
    }
  }

  // 4. 기타 인증 필요 페이지는 requiresAuth 메타 데이터로 관리
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    alert("로그인이 필요한 페이지입니다.");
    return next({ name: "login" });
  }

  // 모든 검증을 통과한 경우 요청한 페이지로 이동
  next();
});

export default router;
