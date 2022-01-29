<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddRole">添加角色</el-button>

    <el-table :data="rolesList" style="width: 100%;margin-top:6px;" border>
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
      <el-table-column align="center" label="关联路由">
        <template slot-scope="scope">
          {{  showRelationRouter(scope.row.routerId) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="配置" width="180">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加角色弹窗 -->
    <el-dialog :visible.sync="dialogVisible" :title="dialogType === 'edit' ? '编辑角色' : '新建角色'" @close="onCancel" customClass='cust_dialog'>
      <el-form ref='roleDialog' :model="role_formData" label-width="80px" label-position="left" :rules="roleRules">
        <el-form-item label="角色名字" prop="roleName">
          <el-input v-model="role_formData.roleName" placeholder="请输入角色名字" />
        </el-form-item>
        <el-form-item label="角色描述" prop="roleMark">
          <el-input v-model="role_formData.roleMark" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea"
            placeholder="请输入角色描述" />
        </el-form-item>
        <el-form-item label="权限分配">
          <el-tree ref="roleTree" :data="tree_data" show-checkbox node-key="id"
            class="permission-tree" :accordion="true" :check-strictly='tree_checkStrictly'>
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <div class="padd10">
                <div>{{ data.label }}</div>
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


    <!-- 分页器 -->
    <el-pagination 
      style="margin-top:10px;margin-left:-10px;" 
      background layout="sizes, total ,prev, pager, next, jumper" 
      :total="pageTotal"
      @size-change="pagination_sizeChange"
      @current-change="pagination_currentChange"
      @prev-click="pagination_prevNextClick"
      @next-click="pagination_prevNextClick"
    ></el-pagination>
  </div>
</template>

<script>
  import {
    Loading
  } from 'element-ui';
  import {
    api_routerList,
  } from '@/api/adminRouter.js'
  import {
    api_roleList,
    api_roleAdd,
    api_roleUpd,
    api_roleDel
  } from '@/api/adminRole.js';
  let loadingInstance = "加载中...";
  
  
  export default {
    data() {
      return {
        tree_data: [], // 树级结构数据
        routerList:[], // 路由表数据
        tree_checkStrictly: false, // 路由表树的check是否严格的遵循父子不互相关联的做法
        pageNumber: 1, // 分页下标(角色信息)
        pageSize: 10, // 分页大小(角色信息)
        pageTotal:0,  // 总数大小(角色信息)
        dialogType: 'new',   // dialog类型  new/edit
        role_formData:{  // dialog表单数据
          roleName:"",
          roleMark:""
        },
        roleRules: {  // 表单规则
          roleName: [{
            required: true,
            message: '角色名字不能为空',
            trigger: 'change'
          }],
          roleMark: [{
            required: true,
            message: '角色描述不能为空',
            trigger: 'change'
          }]
        },
        rolesList: [], // 角色信息列表
        dialogVisible: false // 编辑/添加的弹窗
      }
    },
    computed: {
      // 关联路由的id 将id转为对应的文字
      showRelationRouter(){
        return function(id){
          if(!id) return '-'
          let list = (id.toString()).split(",");
          let str = '';
          list.forEach(i=>{
            this.routerList.forEach(ii=>{
              if(i==ii.uuid){
                str += ii.routerName + "、"
              }
            })
          })
          return str.slice(0,-1)
        }
      }
    },
    created() {
      this.getRouterList()
      this.getRoleList(this.pageSize, this.pageNumber)
    },
    methods: {
      // 添加角色信息
      handleAddRole() {
        if (this.$refs.tree) {
          this.$refs.tree.setCheckedNodes([])
        }
        this.dialogType = 'new'
        this.dialogVisible = true
      },
      // 编辑按钮
      async handleEdit(scope) {
        this.dialogType = 'edit'
        this.dialogVisible = true
        // this.role_formData = Object.assign(this.role_formData,scope.row)
        this.role_formData.uuid = scope.row.uuid;
        this.role_formData.roleName = scope.row.roleName;
        this.role_formData.roleMark = scope.row.roleMark;
        this.$nextTick(() => scope.row.routerId ? this.$refs.roleTree.setCheckedKeys(scope.row.routerId.split(",")) :"")
      },
      // 删除按钮
      handleDelete({
        $index,
        row
      }) {
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
        this.$refs['roleDialog'].validate(async (valid) => {
          if (valid) {
            const isEdit = this.dialogType === 'edit';
            if (isEdit) {
              this.updRole(Object.assign(this.role_formData,{
                routerId:this.changeDataFormatForService()  // 包含了根级的目录和子级的目录
              }))
            } else {
              this.addRole(Object.assign(this.role_formData,{
                routerId:this.changeDataFormatForService()  // 包含了根级的目录和子级的目录
              }))
            }
          } else {
            return false
          }
        })
      },
      //  弹窗取消按钮
      onCancel() {
        this.dialogVisible = false
        this.role_formData = {
          roleName:"",
          roleMark:""
        }
        this.$refs.roleTree.setCheckedKeys([]);
      },
      // 页数大小改变
      pagination_sizeChange(e){
        this.pageSize = e
        this.getRoleList(this.pageSize,this.pageNumber)
      },
      pagination_currentChange(e){
        this.pageNumber = e
        this.getRoleList(this.pageSize,this.pageNumber)
      },
      pagination_prevNextClick(e){
        this.pageNumber = e
        this.getRoleList(this.pageSize,this.pageNumber)
      },
      /*===================================================工具函数===============================================*/
      /**
       * 将后端给出的格式转化为前端树组件需要的数据格式
       * @param {Object} data 需要处理的源数据
       */
      changeDataFormatForTree(data) {
        data = JSON.parse(JSON.stringify(data))
        let delUuids = [];
        let delIndexs = [];
        let multiplexing = function(data) {
          for (let i = 0; i < data.length; i++) {
            let item1 = data[i];
            if (delUuids.findIndex(uuid => uuid == item1.uuid) != -1) continue
            if (!item1.parentId) {
              if (!item1['isComputer']) {
                item1['isComputer'] = true
                item1.label = item1.routerName;
                item1.id = item1.uuid;
                item1.children = []
              }
            } else {
              for (let ii = 0; ii < data.length; ii++) {
                let item2 = data[ii];
                if (item2.uuid == item1.parentId) {
                  item1 = Object.assign(item1, {
                    id: item1.uuid,
                    label: item1.routerName
                  })
                  item2['children'] ? item2.children.push(item1) : item2.children = [item1];
                  delUuids.push(item1.uuid)
                  delIndexs.push(i)
                  break;
                } else if (item2.uuid != item1.parentId && item2['children'] && item2['children'].length > 0) {
                  multiplexing(item2.children)
                }
              }
            }
          }
          return data
        }
        data = multiplexing(data)
        delIndexs.forEach((i, j) => j == 0 ? data.splice(i, 1) : data.splice(i - j, 1))
        return data
      },
      /**
       * 将前端树组件给出的格式转化为后端需要的数据格式("id1,id2,id3")
       * @param {Object} data 需要处理的源数据
       */
      changeDataFormatForService(){
        let da = this.$refs.roleTree.getCheckedNodes();
        const recursion = function(data,str='',level=1){
          let res = "";
          data.forEach(i=>{
            if(i.children && i.children.length>0){
              recursion(i.children,i.uuid,level+1)
            }else{
              res += str + i.uuid + ","
            }
          })
          return res
        }
        return (recursion(da)).slice(0,-1);
      },
      /*===================================================接口相关===============================================*/
      /**
       * 查询路由信息列表
       */
      async getRouterList() {
        loadingInstance = Loading.service({
          fullscreen: true
        })
        try {
          let {
            data
          } = await api_routerList({
            pageSize: 10000,
            pageNumber: 1
          })
          this.$message.success("路由列表查询成功!")
          this.tree_data = this.changeDataFormatForTree(data)
          this.routerList = data;
          return data
        } catch (e) {

        } finally {
          loadingInstance.close()
        }
      },
      /**
       * 添加角色信息
       * @param {Object} paramsObj
       */
      async addRole(paramsObj) {
        loadingInstance = Loading.service({
          fullscreen: true
        })
        try {
          let {
            code,
            data,
            msg
          } = await api_roleAdd(paramsObj)
          this.$message.success("角色添加成功!")
          await this.getRoleList(this.pageSize, this.pageNumber);
        } catch (e) {

        } finally {
          loadingInstance.close()
          this.dialogVisible = false
        }
      },
      /**
       * 修改角色信息
       * @param {Object} paramsObj
       */
      async updRole(paramsObj) {
        loadingInstance = Loading.service({
          fullscreen: true
        })
        try {
          let {
            code,
            data,
            msg
          } = await api_roleUpd(paramsObj)
          this.$message.success("角色修改成功!")
          await this.getRoleList(this.pageSize, this.pageNumber);
        } catch (e) {

        } finally {
          loadingInstance.close()
          this.dialogVisible = false
        }
      },
      // 查询角色信息列表
      async getRoleList(pageSize, pageNumber) {
        loadingInstance = Loading.service({
          fullscreen: true
        })
        try {
          let {
            code,
            data,
            total
          } = await api_roleList({
            pageSize,
            pageNumber
          })
          this.rolesList = data
          this.pageTotal = total
          this.$message.success("角色信息查询成功!")
        } catch (e) {

        } finally {
          loadingInstance.close()
        }
      },
      // 删除角色信息
      async deleteRole(uuid) {
        loadingInstance = Loading.service({
          fullscreen: true
        })
        try {
          let {
            code,
            msg
          } = await api_roleDel({
            uuid: uuid
          })
          this.$message.success("删除成功!")
          this.getRoleList(this.pageSize, this.pageNumber)
        } catch (e) {

        } finally {
          loadingInstance.close()
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .app-container {
    .roles-table {
      margin-top: 30px;
    }

    .permission-tree {
      margin-bottom: 30px;
    }
  }


  /deep/ .el-dialog,el-dialog--center,cust_dialog,.cust_dialog {
    border-radius:10px;
  }
</style>
