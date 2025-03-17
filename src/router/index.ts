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
import Login from "@/views/AppLogin.vue";
import Team from "@/views/TeamView.vue";
import Post from "@/views/post/PostView.vue";
import PostWrite from "@/views/post/PostWrite.vue";
import PostDiteil from "@/views/post/PostDiteil.vue";
import SignUp from "@/views/SignUp.vue";

const routes: Array<RouteRecordRaw> = [
  { path: "/", name: "Login", component: Login, meta: { layout: "empty" } },
  { path: "/dashboard", name: "Dashboard", component: Dashboard },
  { path: "/forms", name: "Forms", component: Forms },
  { path: "/cards", name: "Cards", component: Card },
  { path: "/tables", name: "Tables", component: Tables },
  { path: "/ui-elements", name: "UIElements", component: UIElements },
  { path: "/modal", name: "Modal", component: Modal },
  { path: "/charts", name: "Chart", component: Chart },
  { path: "/blank", name: "Blank", component: Blank },
  //----------------------------
  {
    path: "/sign-up",
    name: "SignUp",
    component: SignUp,
    meta: { layout: "empty" },
  },

  // 팀
  { path: "/team", name: "Team", component: Team },

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
