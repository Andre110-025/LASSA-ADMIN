import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "../stores/user";
import AuthView from "../views/Auth.vue";
import LoginView from "../components/auth/Login.vue";
import DashboardView from "../views/Dashboard.vue";
import OverView from "../components/dashboard/OverView.vue";
import RequestView from "../components/dashboard/RequestView.vue";
import AdvertCategory from "../components/dashboard/AdvertCategory.vue";
import ResetPassword from "../components/auth/ResetPassword.vue";
import AuthToken from "../components/auth/AuthToken.vue";
import ChangePassword from "../components/auth/ChangePassword.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    // always scroll to top
    return { top: 0 };
  },
  routes: [
    {
      path: "/",
      redirect: { name: "Login" },
    },
    {
      path: "/auth",
      redirect: { name: "Login" },
      name: "auth",
      component: AuthView,
      beforeEnter: (to, from, next) => {
        useUserStore().userDetails.accessToken &&
        useUserStore().userDetails.userInfo
          ? next("/dashboard")
          : next();
      },
      children: [
        {
          path: "login",
          name: "Login",
          component: LoginView,
        },
        {
          path: "resetPwd",
          name: "Reset Password",
          component: ResetPassword,
          beforeEnter: (to, from, next) => {
            from.name === "Login" ? next() : next("/auth/login");
          },
        },
        {
          path: "verify",
          name: "Verify Account",
          component: AuthToken,
          beforeEnter: (to, from, next) => {
            from.name === "Reset Password" ? next() : next("/auth/login");
          },
        },
        {
          path: "change-password",
          name: "Change Password",
          component: ChangePassword,
          beforeEnter: (to, from, next) => {
            from.name === "Verify Account" ? next() : next("/auth/login");
          },
        },
      ],
    },
    {
      path: "/dashboard",
      name: "Dashboard",
      redirect: { name: "Overview" },
      component: DashboardView,
      beforeEnter: async (to, from, next) => {
        await useUserStore().getUserData();
        const userDetails = useUserStore().userDetails;

        userDetails.accessToken && userDetails.userInfo
          ? next()
          : next("/auth/login");
      },
      children: [
        {
          path: "overview",
          name: "Overview",
          // redirect: { name: "RequestList" },
          component: OverView,
        },
        {
          path: "advertCategory",
          name: "Advert Category",
          component: AdvertCategory,
        },
        {
          path: "premiseAdvert",
          name: "Premise Advert",
          component: () => import("../components/dashboard/PremiseAdvert.vue"),
        },
        {
          path: "mobileAdvert",
          name: "Mobile Advert",
          component: () => import("../components/dashboard/MobileAdvert.vue"),
        },
        {
          path: "pavApplication",
          name: "Promotional Advert vehicles",
          component: () =>
            import("../components/dashboard/MobilePavAdvert.vue"),
        },
        {
          name: "streetApplication",
          path: "street-lamp-poles/application",
          component: () => import("../components/dashboard/StreetLamp.vue"),
        },
        {
          path: "temporaryAdvert/:app_type",
          name: "Temporary Advert",
          component: () =>
            import("../components/dashboard/TemporaryAdvert.vue"),
        },
        {
          path: "temporaryAdBlanket",
          name: "Temporary Advert Blanket",
          component: () =>
            import("../components/dashboard/TemporaryAdvertBlanket.vue"),
          redirect: { name: "Advert Category" },
        },
        {
          path: "small-format-app",
          name: "Small Format Application",
          component: () => import("../components/dashboard/SmallFormatApp.vue"),
        },
        {
          name: "OutDoorApplication",
          path: "outdoor-site-application",
          component: () => import("../components/dashboard/OutdoorSite.vue"),
        },
        {
          path: "requests",
          name: "Requests",
          component: RequestView,
          // beforeEnter: (to, from, next) => {
          //   const role = useUserStore().userDetails.userInfo.admin_role_id;

          //   !(role == 8 || role == 9) ? next() : role == 8 ? next({name: 'Fund Wallet'}) : next({name: 'PendingTask'});
          // },
          children: [
            {
              path: "",
              name: "RequestList",
              component: () => import("../components/dashboard/Requests.vue"),
            },
            {
              path: "premise-app-detail/:id",
              name: "Premise Application Detail",
              component: () =>
                import("../components/dashboard/PremiseApplicationDetail.vue"),
            },
            {
              path: "mobile-app-detail/:id",
              name: "Mobile Application Detail",
              component: () =>
                import("../components/dashboard/MobileApplicationDetail.vue"),
            },
            {
              path: "temporary-app-detail/:id",
              name: "Temporary Application Detail",
              component: () =>
                import("../components/dashboard/TemporaryDetail.vue"),
            },
            {
              path: "pav-app-detail/:id",
              name: "Promotional Vehicle Application Detail",
              component: () =>
                import("../components/dashboard/PavApplicationDetail.vue"),
            },
            {
              path: "street-app-detail/:id",
              name: "Street Lamp Application Detail",
              component: () =>
                import(
                  "../components/dashboard/StreetLampApplicationDetail.vue"
                ),
            },
            {
              path: "third-party-app-detail/:id",
              name: "Third Party Application Detail",
              component: () =>
                import("../components/dashboard/ThirdPartyAppDetail.vue"),
            },
            {
              path: "out-door-site-detail/:id",
              name: "Third Party Outdoor Detail",
              component: () =>
                import("../components/dashboard/OutDoorSiteDetail.vue"),
            },
            {
              path: "small-format-detail/:id",
              name: "Small Format Application Detail",
              component: () =>
                import("../components/dashboard/SmallFormatDetail.vue"),
            },
          ],
        },
        {
          path: "user-role",
          name: "Roles",
          component: () => import("../components/dashboard/RoleView.vue"),
          beforeEnter: (to, from, next) => {
            const role = useUserStore().userDetails.userInfo.admin_role_id;

            role == 6 ? next() : next({ name: "PendingTask" });
          },
        },
        {
          path: "Customers",
          name: "Clients",
          component: () => import("../components/dashboard/UsersView.vue"),
        },
        {
          path: "customers-details/:uid",
          name: "Clients Details",
          component: () => import("../components/dashboard/UserDetail.vue"),
        },
        {
          path: "fund-wallet",
          name: "Fund Wallet",
          component: () => import("../components/dashboard/FundWallet.vue"),
        },
        {
          path: "pending-tasks",
          name: "PendingTask",
          component: () => import("../components/dashboard/PendingTask.vue"),
        },
        {
          path: "pricing-rules",
          name: "PricingRules",
          component: () => import("../components/dashboard/PricingRules.vue"),
          beforeEnter: (to, from, next) => {
            const role = useUserStore().userDetails.userInfo.admin_role_id;

            role == 6 ? next() : next({ name: "PendingTask" });
          },
        },
        {
          path: "email-content",
          name: "EmailContent",
          component: () => import("../components/dashboard/EmailTemplates.vue"),
          beforeEnter: (to, from, next) => {
            const role = useUserStore().userDetails.userInfo.admin_role_id;

            role == 6 ? next() : next({ name: "PendingTask" });
          },
        },
      ],
    },
    { path: "/:pathMatch(.*)*", redirect: { name: "Login" } },
  ],
});

export default router;
