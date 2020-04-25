import Home from '../containers/Home.vue'
import About from '../containers/About.vue'
import Login from '../containers/Login.vue'

const routes = [{
    path: '/home',
    component: Home
  },
  {
    path: '/about',
    component: About
  },
  {
    path: '/login',
    component: Login
  },
]

export default routes;