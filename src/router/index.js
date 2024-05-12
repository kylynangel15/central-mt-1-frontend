import { accessToken } from "@/composables/local_storage";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
	{
		path: "/login",
		name: "Login",
		component: () => import("../views/LoginPage.vue"),
		beforeEnter: (to, from, next) => {
			if (accessToken()) {
				next("/");
			}

			next();
		},
	},
	{
		path: "/forgot-password",
		name: "Forgot Password",
		component: () => import("../views/ForgotPasswordPage.vue"),
		beforeEnter: (to, from, next) => {
			if (accessToken()) {
				next("/");
			}

			next();
		},
	},
	{
		path: "/check-email",
		name: "Check Email",
		component: () => import("../views/CheckEmailCodePage.vue"),
		props: true,
		beforeEnter: (to, from, next) => {
			if (accessToken()) {
				next("/");
			}

			next();
		},
	},
	{
		path: "/new-password",
		name: "New Password",
		component: () => import("../views/NewPasswordPage.vue"),
		props: true,
		beforeEnter: (to, from, next) => {
			if (accessToken()) {
				next("/");
			}

			next();
		},
	},
	{
		path: "/successfully-reset",
		name: "Success Reset",
		component: () => import("../views/SuccessChangePassword.vue"),
		props: true,
		beforeEnter: (to, from, next) => {
			if (accessToken()) {
				next("/");
			}

			next();
		},
	},
	{
		path: "/account-under-review",
		name: "Account Under Review",
		component: () => import("../views/UnderReviewPage.vue"),
		props: true,
		beforeEnter: (to, from, next) => {
			if (accessToken()) {
				next("/");
			}

			next();
		},
	},
	{
		path: "/company-sign-up",
		name: "Company Sign Up",
		component: () => import("../views/CompanySignupPage.vue"),
		props: true,
		beforeEnter: (to, from, next) => {
			if (accessToken()) {
				next("/");
			}

			next();
		},
	},
	{
		path: "/",
		name: "layout",
		component: () => import("../views/LayoutPage.vue"),
	},
	{
		path: '/401',
		name: 'Unauthorize',
		component: () => import('../views/error/UnauthorizePage.vue'),
	},
  {
		path: '/:pathMatch(.*)',
		name: 'Not Found',
		component: () => import('../views/error/NotFoundPage.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  base: ['staging', 'production'].includes(process.env.NODE_ENV)
      ? '/'
      : process.env.BASE_URL,
  routes
})

export default router;
