const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  roleName: state => state.user.roleName,
  name: state => state.user.name,
  routerTreeData: state => state.user.routerTreeData,
}
export default getters
