import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/home.vue';
import CartPage from "../pages/CartPage.vue";
import WarehousePage from "../pages/WarehousePage.vue";

const routes = [
    {
        path: '/home',
        name: 'home',
        component: () => import('@/pages/home.vue'),
        meta: { showNav: true,
                title: '奶龙书城',
                requiresAuth: true
        }
    },
    {
        path: '/cart',
        name: 'cart',
        component: () => import('@/pages/CartPage.vue'),
        meta: { showNav: true,
                title: '购物车',
                requiresAuth: true
        }
    },
    {
        path: '/warehouse',
        name: 'warehouse',
        component: () => import('@/pages/WarehousePage.vue'),
        meta: { showNav: true,
                title: '库存管理',
                requiresAuth: true
        }
    },
    //其他路由配置
    {
        path: '/login',
        name: 'login',
        component: () => import('@/pages/User/login.vue'),
        meta: { showNav: false,
                title: '登录'
        }
    },
    // 将根路径重定向到登录页
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('@/pages/User/register.vue'),
        meta: { showNav: false,
                title: '注册'
        }
    }
];


const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
