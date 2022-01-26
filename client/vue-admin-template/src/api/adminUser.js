import request from '@/utils/request';


// 登录
export const api_login = (data) => {
    const R = Object.assign({}, data);
    return request({
      url: '/admin/login',
      method: 'post',
      data:R,
      headers:{'Content-Type': 'application/json;charset=utf-8'},
    })
  }

// 用户信息
export const api_getUserInfo = (data) => {
  const R = Object.assign({}, data)
  return request({
    url: '/admin/userInfo',
    method: 'post',
    data:R,
    headers:{'Content-Type': 'application/json;charset=utf-8'},
  })
}

// 更新用户信息(app)
export const API$UpdUser = (data) => {
  const R = Object.assign({ type: 'UpdUser' }, data)
  return request({
    url: '/YangPanAdmin',
    method: 'post',
    data: R
  })
}

// 删除用户信息(app)
export const c = (data) => {
  const R = Object.assign({ type: 'DelUser' }, data)
  return request({
    url: '/YangPanAdmin',
    method: 'post',
    data: R
  })
}

// 用户列表
export const api_UserList = (data) => {
  const R = Object.assign({}, data)
  return request({
    url: '/admin/userList',
    method: 'post',
    data:R,
    headers:{'Content-Type': 'application/json;charset=utf-8'},
  })
}
