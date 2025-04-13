import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
        path: '/home',
        name: 'home',
        component: () => import('@/pages/home.vue'),
        meta: {
            showNav: true,
            title: '奶龙书城',
            requiresAuth: true
        }
    },
    {
        path: '/cart',
        name: 'cart',
        component: () => import('@/pages/CartPage.vue'),
        meta: {
            showNav: true,
            title: '购物车',
            requiresAuth: true
        }
    },
    {
        path: '/warehouse',
        name: 'warehouse',
        component: () => import('@/pages/WarehousePage.vue'),
        meta: {
            showNav: true,
            title: '库存管理',
            requiresAuth: true,
            requiresAdmin: true  // 需要管理员权限
        }
    },
    {
        path: '/productupdate/:id',  // 商品详情修改
        name: 'productupdate',
        component: () => import('@/pages/Product/productupdate.vue'),
        meta: {
            showNav: true,
            title: '修改商品信息',
            requiresAuth: true,
            requiresAdmin: true  // 需要管理员权限
        }
    },
    {
        path: '/product/:id',  // 商品详情页
        name: 'productdetail',
        component: () => import('@/pages/Product/productdetail.vue'),
        meta: {
            showNav: true,
            title: '商品详情',
            requiresAuth: true,

        }
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/pages/User/login.vue'),
        meta: {
            showNav: false,
            title: '登录'
        }
    },
    {
        path: '/addproduct',
        name: 'addproduct',
        component: () => import('@/pages/product/addproduct.vue'),
        meta: {
            showNav: true,
            title: '增加商品',
            requiresAuth: true,
            requiresAdmin: true  // 需要管理员权限
        }
    },
    {
        path: '/',
        redirect: '/login'  // 重定向到登录页
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('@/pages/User/register.vue'),
        meta: {
            showNav: false,
            title: '注册'
        }
    },
    {
        path: '/userinfo',
        name: 'userinfo',
        component: () => import('@/pages/User/userinfo.vue'),
        meta: {
            showNav: true,
            title: '个人信息',
            requiresAuth: true
        }
    }
];

// 创建路由实例
const router = createRouter({
    history: createWebHistory(),
    routes
});

// 路由前置守卫：控制管理员访问权限
router.beforeEach((to, from, next) => {
    // 检查是否需要管理员权限
    if (to.meta.requiresAdmin) {
        const role = sessionStorage.getItem('role');  // 获取存储的用户角色
        if (role === 'admin') {
            next();  // 如果是管理员，允许访问
        }
    } else if (to.meta.requiresAuth) {
        // 检查是否需要登录权限
        const isAuthenticated = sessionStorage.getItem('token');  // 假设token代表用户已登录
        if (isAuthenticated) {
            next();  // 已登录，允许访问
        } else {
            next({ name: 'login' });  // 如果没有登录，重定向到登录页
        }
    } else {
        next();  // 如果不需要权限限制，放行
    }
});

export default router;


