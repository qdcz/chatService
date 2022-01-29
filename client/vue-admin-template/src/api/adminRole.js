import request from '@/utils/request';


// 角色列表
export const api_roleList = (data) => {
  const R = Object.assign({}, data);
  return request({
    url: '/admin/roleList',
    method: 'post',
    data: R,
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
  })
}


// 添加角色信息
export const api_roleAdd = (data) => {
  const R = Object.assign({}, data);
  return request({
    url: '/admin/role',
    method: 'post',
    data: R,
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
  })
}

// 更新角色信息
export const api_roleUpd = (data) => {
  const R = Object.assign({}, data);
  return request({
    url: '/admin/role',
    method: 'put',
    data: R,
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
  })
}

// 删除角色信息
export const api_roleDel = (data) => {
  const R = Object.assign({}, data);
  return request({
    url: '/admin/role',
    method: 'delete',
    data: R,
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
  })
}

// 查询角色信息
export const api_roleInfo = (data) => {
  const R = Object.assign({}, data);
  return request({
    url: '/admin/roleInfo',
    method: 'post',
    data: R,
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
  })
}
