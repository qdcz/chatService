import { createRouter, createWebHashHistory } from "vue-router";
import Layout from '../layout/index.vue'
const routes = [
    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        children: [{
            path: 'dashboard',
            name: 'dashboard',
            component: () => import('../views/dashboard/index.vue'),
            meta: { title: 'dashboard', icon: 'dashboard' }
        }]
    },
    {
        path: '/error',
        component: Layout,
        redirect: '/error/404',
        children: [{
            path: '404',
            name: '404',
            component: () => import('../views/404/index.vue'),
            meta: { title: '404', icon: '404' }
        }]
    },
]

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = createRouter({
    // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
    history: createWebHashHistory(),
    routes, // short for `routes: routes`
})
export default router
