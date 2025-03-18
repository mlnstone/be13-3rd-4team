import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Dashboard from "@/views/sample/AppDashboard.vue";
import Forms from "@/views/sample/AppForms.vue";
import Tables from "@/views/sample/AppTables.vue";
import UIElements from "@/views/sample/UIElements.vue";
import Modal from "@/views/sample/AppModal.vue";
import Chart from "@/views/sample/ChartView.vue";
import Card from "@/views/sample/CardView.vue";
//----------------------------
import NotFound from "@/views/sample/NotFound.vue";
import Blank from "@/views/BlankView.vue";

import Login from "@/views/auth/AppLogin.vue";
import SignUp from "@/views/auth/SignUp.vue";

import Team from "@/views/team/TeamView.vue";

import Message from "@/views/message/MessageView.vue";

import Post from "@/views/post/PostView.vue";
import PostWrite from "@/views/post/PostWrite.vue";
import PostDiteil from "@/views/post/PostDiteil.vue";

import Project from "@/views/project/ProjectView.vue";

import User from "@/views/user/UserView.vue";

const routes: Array<RouteRecordRaw> = [
  // auth
  { path: "/", name: "Login", component: Login, meta: { layout: "empty" } },
  { path: "/sign-up",name: "SignUp",component: SignUp,meta: { layout: "empty" },},
  
  // 메인 페이지
  { path: "/dashboard", name: "Dashboard", component: Dashboard },

  // 샘플
  { path: "/forms", name: "Forms", component: Forms },
  { path: "/cards", name: "Cards", component: Card },
  { path: "/tables", name: "Tables", component: Tables },
  { path: "/ui-elements", name: "UIElements", component: UIElements },
  { path: "/modal", name: "Modal", component: Modal },
  { path: "/charts", name: "Chart", component: Chart },
  { path: "/blank", name: "Blank", component: Blank },
  //----------------------------

  // 팀
  { path: "/team", name: "Team", component: Team },

  // 유저
  { path: "/user", name: "User", component: User },

  // 프로젝트
  { path: "/project", name: "Project", component: Project },

  // 쪽지
  { path: "/message", name: "Message", component: Message },

  // 게시글
  { path: "/post", name: "Post", component: Post },
  { path: "/post/write", name: "PostWrite", component: PostWrite },
  { path: "/post/:postNo", name: "PostDiteil", component: PostDiteil },

  { path: "/:pathMatch(.*)*", component: NotFound },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
