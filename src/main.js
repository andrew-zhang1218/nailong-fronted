import './assets/main.css'
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js';
import 'core-js/stable/promise';

const app = createApp(App);
app.use(ElementPlus);
app.use(router);

createApp(App).use(router).mount('#app')

router.beforeEach((to, from, next) => {
    document.title = to.meta.title;
    next();
});