// import { login, logout, getInfo } from '@/api/user'
import { api_login,api_getUserInfo,api_logout} from '@/api/adminUser'
import { api_roleInfo } from '@/api/adminRole'

import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    roleName:'',
    routerTreeData:''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
    setToken(token)
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLENAME: (state, roleName) => {
    state.roleName = roleName
  },
  SET_routerTreeData: (state, routerTreeData) => {
    state.routerTreeData = routerTreeData
  }

}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { account, password } = userInfo
    return new Promise((resolve, reject) => {
      api_login({ account: account.trim(), password: password }).then(response => {
        const { token } = response
        commit('SET_TOKEN',token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      api_getUserInfo().then(response => {
        const { data } = response
        if (!data) {
          return reject('Verification failed, please Login again.')
        }
        const { name, avatar,roleId,routerTreeData } = data
        api_roleInfo({uuid:roleId}).then(res=>{
          commit('SET_NAME', name)
          commit('SET_AVATAR', avatar)
          commit('SET_routerTreeData', routerTreeData)
          commit('SET_ROLENAME', res.data[0]?.roleName)
          // data = Object.assign(data,{roleName:res.data.roleName})
          resolve(data)
        })
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      api_logout().then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
