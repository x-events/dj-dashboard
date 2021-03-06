<template>
  <router-view id="app" @login="loginDirect" @logout="logoutDirect" />
</template>

<script>
import Vue from 'vue';
import * as util from '@/common/assets/util.js';
import {store} from '@/store';
import {instance} from '@/api';
import * as user from "@/common/api/user";
import AllRoutesData from './main/index';

export default {
  methods: {
    setInterceptor: function(resourcePermission) {
      instance.interceptors.request.use(config => {
        // Get request path
        let perName = config.url.replace(config.baseURL, '').split('?')[0];
        if(config.url.charAt(config.url.length - 1)!=='/'){
          //RESTful type 1 /path/**
          let reg1 = perName.match(/^(\/[^\/]+\/)[^\/]+$/);
          if (reg1) {
            perName = reg1[1] + '*';
          }
          //RESTful type 2 /path/*/path
          let reg2 = perName.match(/^\/[^\/]+\/([^\/]+)\/[^\/]+$/);
          if (reg2) {
            perName = perName.replace(reg2[1], '*');
          }

        }
        
        // Check permissions
        
        if (!resourcePermission[config.method + ',' + perName]) {
          console.warn(config.method + ',' + perName)
          return Promise.reject({
            message: '无访问权限'
          });
        }
        return config;
      });
    },
    getResources: function(userPermissions) {
      let resourceHash = {};
      if (Array.isArray(userPermissions.resource)) {
        /*
        * Input like this:
        * [{
        *   id: "2c9180895e172348015e1740805d000d"
            method: "GET"
            url: "/some-url"
        * }]
        */
        userPermissions.resource.forEach(e => {
          let key = e.method.toLowerCase() + ',' + e.url;
          resourceHash[key] = true;
        });
      }
      // Get hash structure
      return resourceHash;
    },
    getRoutes: function(userPermissions) {
      let routeHash = {};
      let setMenu2Hash = function(array, base) {
        array.map(key => {
          if (key.route) {
            let hashKey = ((base ? base + '/' : '') + key.route).replace(/^\//, '');
            routeHash['/' + hashKey] = true;
            if (Array.isArray(key.children)) {
              setMenu2Hash(key.children, (base ? base + '/' : '') + key.route);
            }
          }
        });
      };
      if (Array.isArray(userPermissions.menu)) {
      /*
      * Input Like this: 
      * [{
      *   id: "2c9180895e13261e015e13469b7e0000",
      *   name: "账户管理",
      *   parent_id: "2c9180895e13261e015e13469b7e0000",
      *   route: "some-route"
      * }]
      */
        let arrayMenus = util.buildMenu(userPermissions.menu);
        setMenu2Hash(arrayMenus);
      }
      // Get hash structure
      return routeHash;
    },
    extendRoutes: function(routePermission) {

      // Filtering local routes, get actual routing
      
      let actualRouter = [];
      let findLocalRoute = function(array, base) {
        let replyResult = [];
        array.forEach(route => {
          let pathKey = (base ? base + '/' : '') + route.path;
          if (routePermission[pathKey]) {
            if (Array.isArray(route.children)) {
              route.children = findLocalRoute(route.children, (base ? base + '/' : '') + route.path);
            }
            replyResult.push(route);
          }
        });
        if (base) {
          return replyResult;
        } else {
          actualRouter = actualRouter.concat(replyResult);
        }
      }
      findLocalRoute(AllRoutesData[0].children);
      
      // If the user does not have any routing authority

      if (!actualRouter || !actualRouter.length) {
        // clear token, refresh page will jump to login screen.
        util.storage('auth','');
        // Interface hints
        return document.body.innerHTML = ('<h1>无访问权限！</h1>');
      }
      
      actualRouter = actualRouter.map(e => {

        // Copy 'children' to 'meta' for rendering menu.(This step is optional.)

        if (e.children) {
          if (!e.meta) {
            e.meta = {}
          }

          e.meta.children = e.children;
        }

        return e
      });

      // Add actual routing to application

      let originPath = util.deepcopy(AllRoutesData);
      originPath[0].children = actualRouter;
      this.$router.addRoutes(originPath.concat([{
        path: '*',
        redirect: '/404'
      }]));

      // Save information for rendering menu.(This step is optional.)
      
      store.set('menu', actualRouter)
    },
    signin: function(callback) {
      const getUrlParam = function(name, url) {
        let urlParamReg = new RegExp("(^|&)" + name + "=([^&#\/]*)(&|#\/|$)", "i");
        let s = (url ? url : window.location.href).split('?')[1] || '';
        let r = s.match(urlParamReg);
        if (r !== null) {
          return decodeURI(r[2]);
        }
        return null;
      };
      const urlToken = getUrlParam('access_token');
      
      if(urlToken){
        //return alert(urlToken)
        util.storage('auth', {
          access_token: urlToken
        })
        return window.location.href = '/'
      }
      
      let vm = this;
      /*
      * Step 1
      * Check whether the user has access
      */
      
      let localUser = util.storage('auth');
      if (!localUser || !localUser.access_token) {
        return vm.$router.push({ path: '/login', query: { from: vm.$router.currentRoute.fullPath } });
      }

      /*
      * Step 2
      * Set Authorization
      */

      instance.defaults.headers.common['Authorization'] = localUser.access_token;

      /*
      * Step 2-1(This step is optional.)
      * Get user`s permissions
      * You can also get permission information upon user login, it depends on the implementation of the backend interface
      */
      if(this.$root.AccessControl){
        user.permission.r().then((res) => {
          let userPermissions = res.data.data;
          //格式处理
          userPermissions.menu = userPermissions.menu.map(e => {
            return {
              name: e.name,
              route: e.url,
              id: e.id,
              pid: e.pid
            }
          })

          /*
          * Step 3
          * Get resourcePermission form user permissions
          * Like this:
          * { "get,/url1": true, "post,/url2": true, ... }
          */
          
          let resourcePermission = vm.getResources(userPermissions);
          
          /*
          * Step 4
          * Get routePermission form user permissions
          * Like this:
          * { "/route1": true, "/route2": true, ... }
          */
          
          let routePermission = vm.getRoutes(userPermissions);
          
          /*
          * Step 5
          * Setting request permission control through resourcePermission
          */

          vm.setInterceptor(resourcePermission);
          
          /*
          * Step 6
          * Adding routing privileges to users
          */

          vm.extendRoutes(routePermission);

          /*
          * Step 7
          * Implementing $_has function, support for the directive "has" (in /main.js)
          * Input: Array, like this: ['get,/some-uri']
          * Output: Boolean
          */
          
          Vue.prototype.$_has = function(rArray) {
            let RequiredPermissions = [];
            let permission = true;
            
            if (Array.isArray(rArray)) {
              rArray.forEach(e => {
                if(e && e.p){
                  RequiredPermissions = RequiredPermissions.concat(e.p);
                }
              });
            } else {
              if(rArray && rArray.p){
                RequiredPermissions = rArray.p;
              }
              
            }
            
            for(let i=0;i<RequiredPermissions.length;i++){
              let p = RequiredPermissions[i];
              if (!resourcePermission[p]) {
                permission = false;
                break;
              }
            }
            
            return permission;
          }

          typeof callback === 'function' && callback();
        })
      }else{
        //无权限控制
        this.$router.addRoutes(AllRoutesData.concat([{
          path: '*',
          redirect: '/404'
        }]));

        const currentUserMenu = AllRoutesData[0].children.map(e => {
            if (!e.meta) {
              e.meta = {}
            }
            return e
        });

        store.set('menu', currentUserMenu);

        typeof callback === 'function' && callback();
      }
    },
    loginDirect: function(res){
      /*
      * Monitor login events
      * Will trigger the events in views/login.vue
      */
      util.storage("auth", res.data);

      this.signin(() => {
        this.initUser()
        this.$router.replace({path: res.from || '/'});
      });
    },
    logoutDirect: function(){
      /*
      * Monitor logout events
      * Will trigger the events in views/index.vue
      */

      util.storage('auth','');
      
      window.location.href = '/'
    },
    initUser: function(){
      user.info.r().then(res => {
        store.set('user', res.data.data)
      })
    }
  },
  created: function() {
    /*
    * Start from here!
    */
    this.signin(this.initUser);
    this.$root.mapcenter = [116.508479,39.929238]
  }
}
</script>

<style>
  @import url(common/assets/style.css);
</style>
