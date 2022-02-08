import request from '@/utils/request';


// 路由列表
export const api_routerList = (data) => {
  const R = Object.assign({}, data);
  return request({
    url: '/admin/routerList',
    method: 'post',
    data: R,
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
  })
}


// 添加路由信息
export const api_routerAdd = (data) => {
  const R = Object.assign({}, data);
  return request({
    url: '/admin/router',
    method: 'post',
    data: R,
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
  })
}

// 更新路由信息
export const api_routerUpd = (data) => {
  const R = Object.assign({}, data);
  return request({
    url: '/admin/router',
    method: 'put',
    data: R,
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
  })
}

// 删除路由信息
export const api_routerDel = (data) => {
  const R = Object.assign({}, data);
  return request({
    url: '/admin/router',
    method: 'delete',
    data: R,
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
  })
}
