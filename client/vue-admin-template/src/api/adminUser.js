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

// 查询用户信息
export const api_getUserInfo = (data) => {
  const R = Object.assign({}, data)
  return request({
    url: '/admin/userInfo',
    method: 'post',
    data:R,
    headers:{'Content-Type': 'application/json;charset=utf-8'},
  })
}

// 查询用户列表
export const api_UserList = (data) => {
  const R = Object.assign({}, data)
  return request({
    url: '/admin/userList',
    method: 'post',
    data:R,
    headers:{'Content-Type': 'application/json;charset=utf-8'},
  })
}

// 添加用户
export const api_addUser = (data) => {
  const R = Object.assign({}, data)
  return request({
    url: '/admin/user',
    method: 'post',
    data:R,
    headers:{'Content-Type': 'application/json;charset=utf-8'},
  })
}

// 删除用户
export const api_delUser = (data) => {
  const R = Object.assign({}, data)
  return request({
    url: '/admin/user',
    method: 'delete',
    data:R,
    headers:{'Content-Type': 'application/json;charset=utf-8'},
  })
}

// 更新用户
export const api_updUser = (data) => {
  const R = Object.assign({}, data)
  return request({
    url: '/admin/userInfo',
    method: 'put',
    data:R,
    headers:{'Content-Type': 'application/json;charset=utf-8'},
  })
}
