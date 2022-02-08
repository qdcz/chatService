import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
/* Layout */
import Layout from '@/layout';
NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()
  console.log("token数据",hasToken)
  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      console.log("stage的数据",store.getters)
      const hasGetUserInfo = store.getters.name;
      const hasGetRouterInfo = store.getters.routerTreeData;
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          // get user info
          let res = await store.dispatch('user/getInfo')
          let routerTreeData = res.routerTreeData;

          let recur = function(list){
            list.forEach(i=>{
              i.component = resolve => {
                if(!i.pageSrc){
                  require([`./layout/index.vue`], resolve)
                }else{
                  require([i.pageSrc+'.vue'], resolve)
                }
              }
              recur(i.children)
            })
          }
          recur(routerTreeData)
          router.addRoutes(routerTreeData.slice(0,-1))
          router.options.routes = router.options.routes.concat(routerTreeData.slice(0,-1))
          
          // 页面手动刷新触发
          if(from.name===null){
            // 解决刷新动态路由页面的404问题
            next({path:to.redirectedFrom})
            return
          }else{
            next()
          }
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
