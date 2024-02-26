import {createRouter, createWebHistory} from 'vue-router'
//Auth views
import Login from '@/views/auth/Login.vue'
import SignUpSuccess from '@/views/auth/SignUpSuccess.vue'
import SubmitFeedback from '@/views/dashboard/components/SubmitFeedback.vue'
import SignUp from '@/views/auth/SignUp.vue'
//Dashboard views
import DashboardIndex from '@/views/dashboard/DashboardIndex.vue'
import Dashboard from '@/views/dashboard/components/Dashboard.vue'
import FeedbackDetail from '@/views/dashboard/components/FeedbackDetail.vue'

const authPages = [
    {
        path: '/login',
        name: 'login',
        component: Login,
        beforeEnter: (to, from, next) => {
            if (window.localStorage.getItem("api_token")) {
                next({
                    name: "dashboard"
                })
            } else next()
        }
    },
    {
        path: '/register',
        name: 'signup',
        component: SignUp
    },
    {
        path: '/signup-success',
        name: 'signup-success',
        component: SignUpSuccess
    },
]
const dashboardPages = {
    path: '/',
    component: DashboardIndex,
    meta: { requiresAuth: true },
    children: [
        {
            path: '',
            name: 'dashboard',
            component: Dashboard,
        },
        {
            path: 'feedback',
            name: 'submit-feedback',
            component: SubmitFeedback
        },
        {
            path: 'feedback/:id',
            name: 'detail-feedback',
            component: FeedbackDetail
        },
    ]
}

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        ...authPages,
        dashboardPages,
    ],
})
router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth) {
        if (!window.localStorage.getItem("api_token")) {
            next({
                name: "login"
            })
        } else {
            next()
        }
    } else next()
})
export default router
