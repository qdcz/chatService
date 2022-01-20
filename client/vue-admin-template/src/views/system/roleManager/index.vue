<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddRole">添加角色</el-button>

    <el-table :data="rolesList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="uuid" width="200">
        <template slot-scope="scope">
          {{ scope.row.uuid }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色" width="150">
        <template slot-scope="scope">
          {{ scope.row.roleName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="描述">
        <template slot-scope="scope">
          {{ scope.row.roleMark }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="关联路由">
        <template slot-scope="scope">
          {{ scope.row.routerId }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="配置"  width="220">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">编辑权限</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加角色弹窗 -->
    <el-dialog :visible.sync="dialogVisible" :title="dialogType === 'edit' ? '编辑角色' : '新建角色'" @close="onCancel">
      <el-form ref='roleDialog' :model="role" label-width="80px" label-position="left" :rules="rules">
        <el-form-item label="角色名字" prop="name">
          <el-input v-model="role.name" placeholder="请输入角色名字" />
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="role.description" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea" placeholder="请输入角色描述" />
        </el-form-item>
        <el-form-item label="权限分配" prop="routesData">
          <el-tree ref="tree" :data="routesData" :props="defaultProps" show-checkbox
            node-key="path" class="permission-tree" :accordion="true" :check-strictly='checkStrictly'>
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <div class="padd10">
                <div>{{ data.meta.title }}</div>
              </div>
            </span>
          </el-tree>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="onCancel">取消</el-button>
        <el-button type="primary" @click="confirmRole">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import path from 'path'
  import { Loading } from 'element-ui';
  import { api_roleList,api_roleAdd,api_roleUpd,api_roleDel} from '@/api/adminRole.js'

  const defaultRole = {
    key: '',
    name: '',
    description: '',
    routes: []
  }
  let loadingInstance = "加载中...";
  export default {
    data() {
      return {
        pageNumber:1,    // 分页下标
        pageSize:10,     // 分页大小





        role: Object.assign({}, defaultRole),   // 添加角色的表单
        rules: {
          name: [{ required: true, message: '角色名字不能为空', trigger: 'change' }],
          description: [{ required: true, message: '角色描述不能为空', trigger: 'change' }]
        },

        checkStrictly:true,     // 路由表树的check是否严格的遵循父子不互相关联的做法
        routes: [],             // 路由表数据
        rolesList: [],          // 表格的角色列表
        dialogVisible: false,   // 编辑/添加的弹窗
        dialogType: 'new',
        defaultProps: {
          children: 'children',
          label: 'name',
          title:'mate'
        }
      }
    },
    computed: {
      routesData() {
        return this.routes
      }
    },
    created() {
      // this.onSelRouter()
      this.getRoleList(this.pageSize,this.pageNumber)
    },
    methods: {
      // 查询所有的路由信息
      async onSelRouter(){
        loadingInstance = Loading.service({ fullscreen: true })
        let {code,data,msg} = await SelRouter()
        if(code!==200) return this.$message.error(msg)
        this.routes = data
        loadingInstance.close()
      },

      // 添加角色
      handleAddRole() {
        this.role = Object.assign({}, defaultRole)
        if (this.$refs.tree) {
          this.$refs.tree.setCheckedNodes([])
        }
        this.dialogType = 'new'
        this.dialogVisible = true
        this.checkStrictly = false
      },
      // 表格编辑按钮
      async handleEdit(scope) {
        loadingInstance = Loading.service({ fullscreen: true })
        let {code,data,msg} = await GetRoleInfo({_id:scope.row._id})
        this.dialogType = 'edit'
        this.dialogVisible = true

        if(code!==200) return this.$message.error(msg)
        loadingInstance.close()
        this.role.key = scope.row._id
        this.role.name = data.RoleName
        this.role.description = data.RoleDescript
        this.$nextTick(() => {
          this.checkStrictly = true  // 编辑的时候不关联
          this.$refs.tree.setCheckedNodes(data.RouterList)
        })
      },
      // 删除按钮
      handleDelete({$index,row}) {
        this.$confirm('是否删除该角色?', '提示！', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async () => {
            this.deleteRole(row.uuid);
          })
      },
      // 弹窗确认按钮
      async confirmRole() {
        this.$refs['roleDialog'].validate(async(valid) => {
          if (valid) {
            const isEdit = this.dialogType === 'edit'
            if (isEdit) {
              let {code,msg} = await UpdRole({
                _id:this.role.key,
                RoleName:this.role.name,
                RoleDescript:this.role.description,
                RouterList:this.$refs.tree.getCheckedNodes()   // 注意这边存的是选中的节点 要和节点树区别开来，就是取出来的时候要数据处理成节点树
              })
              if(code!==200) return this.$message.error(msg)
              this.$message({message: msg,type: 'success'});
              this.getRoleList()
              this.dialogVisible = false
              this.checkStrictly = true
            } else {
              let {code,msg} = await AddRole({
                RoleName:this.role.name,
                RoleDescript:this.role.description,
                RouterList:this.$refs.tree.getCheckedNodes()  // 注意这边存的是选中的节点 要和节点树区别开来，就是取出来的时候要数据处理成节点树
              })
              if(code!==200) return this.$message.error(msg)
              this.$message({message: msg,type: 'success'});
              this.getRoleList()
              this.dialogVisible = false
              this.checkStrictly = true
            }
          }else{
            return false
          }
        })
      },
      //  弹窗取消按钮
      onCancel(){
        this.dialogVisible = false
        this.checkStrictly = true
      },
      /*=====================接口相关================================*/
      // 查询角色信息列表
      async getRoleList(pageSize,pageNumber){
        loadingInstance = Loading.service({ fullscreen: true })
        try{
          let {code,data,msg} = await api_roleList({pageSize,pageNumber})
          this.rolesList = data
          this.$message.success("查询成功!")
        }catch(e){

        }finally{
          loadingInstance.close()
        }
      },
      // 删除角色信息
      async deleteRole(uuid){
        loadingInstance = Loading.service({ fullscreen: true })
        try{
          let {code,msg} = await api_roleDel({uuid:uuid})
          this.$message.success("删除成功!")
          this.getRoleList(this.pageSize,this.pageNumber)
        }catch(e){

        }finally{
          loadingInstance.close()
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .app-container {
    .roles-table {
      margin-top: 30px;
    }

    .permission-tree {
      margin-bottom: 30px;
    }
  }
</style>
