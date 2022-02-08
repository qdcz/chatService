<template>
  <div class="custom-tree-container">

    <el-button class="mb20" type="primary" icon="el-icon-edit" size="mini" @click="addRootMenu('DialogForm')">添加根菜单
    </el-button>
    <div style="padding: 20px 0;">
      <el-tree :data="data" node-key="id" :default-expand-all='false' :expand-on-click-node="false" empty-text="暂无数据">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span>
            <el-button type="text" size="mini" @click="() => append(node,data)">
              添加
            </el-button>
            <el-button type="text" size="mini" @click="() => edit(node, data)">
              编辑
            </el-button>
            <el-button type="text" size="mini" @click="() => remove(node, data)">
              删除
            </el-button>
          </span>
        </span>
      </el-tree>
    </div>



    <!-- 弹窗 -->
    <el-dialog :title="DialogTitle" :visible.sync="isshowDialogs" width="60%" center @close="dialogClose('DialogForm')" customClass='cust_dialog'>
      <el-form ref="DialogForm" :model="DialogForm" class="el-form" :rules="rules" label-width="80px"
        label-position="left">
        <el-form-item label="路由名字" prop="routerName" label-width="100px">
          <el-input v-model="DialogForm.routerName" size="large" />
        </el-form-item>
        <el-form-item label="图标" prop="icon" label-width="100px">
          <el-input v-model="DialogForm.icon" size="large" />
        </el-form-item>
        <el-form-item label="路由路径" prop="routerSrc" label-width="100px">
          <el-input v-model="DialogForm.routerSrc" size="large" />
        </el-form-item>
        <el-form-item label="页面路径" prop="pageSrc" label-width="100px">
          <el-input v-model="DialogForm.pageSrc" size="large" />
        </el-form-item>
        <el-button type="primary" @click="submitDialogForm('DialogForm')">
          {{DialogTitle==='添加根路由' || DialogTitle==='添加子路由' ?'添加':'修改'}}
        </el-button>
        <el-button @click="dialogClose('DialogForm')">取消</el-button>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import {
    Loading
  } from 'element-ui';
  import {
    api_routerList,
    api_routerAdd,
    api_routerUpd,
    api_routerDel
  } from '@/api/adminRouter.js'
  let id = 1000;
  let loadingInstance = "加载中...";
  export default {
    data() {
      return {
        data: [],      // 树级结构数据
        pageNumber: 1, // 分页下标
        pageSize: 9999, // 分页大小
        DialogTitle: "添加路由信息",
        isshowDialogs: false,  // 弹窗
        DialogForm: {
          uuid:"",
          routerName: "",
          icon: "",
          parentId: "",
          rootId: "",
          routerFnId: "",
          routerSrc:"",
          pageSrc:"",
        },
        rules: {
          routerName: [{
            required: true,
            message: '路由名字不能为空',
            trigger: 'change'
          }],
          // icon: [{ required: true, message: '路由图标不能为空', trigger: 'change' }],
          // path: [{ required: true, message: '路由路径不能为空', trigger: 'change' }]
        },
        curSelectNodeData:[] // 当前选中的节点
      }
    },
    created() {
      this.init();
    },
    methods: {
      async init() {
        await this.getRouterList(this.pageSize, this.pageNumber);
      },
      /**
       * 添加子节点
       * @param {Object} node 节点属性
       * @param {Object} data 节点数据
       */
      append(node, data) {
        this.curSelectNodeData = data;
        this.isshowDialogs = true;
        this.DialogTitle = '添加子路由';
      },
      /**
       * 删除子节点
       * @param {Object} node 节点属性
       * @param {Object} data 节点数据
       */
      remove(node, data) {
        this.$confirm('是否删除该角色?', '提示！', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          this.delRouter(data.uuid);
        })
      },
      /**
       * 更新子节点
       * @param {Object} node 节点属性
       * @param {Object} data 节点数据
       */
      edit(node, data) {
        this.isshowDialogs = true
        this.DialogTitle = '修改路由信息'
        this.DialogForm = Object.assign(this.DialogForm,data)
      },
      /**
       * 添加根级节点信息
       */
      addRootMenu() {
        this.isshowDialogs = true
        this.DialogTitle = '添加根路由'
      },
      /**
       * 关闭弹窗
       * @param {Object} formName
       */
      dialogClose(formName) {
        this.isshowDialogs = false
        this.curSelectNodeData = null
        this.DialogForm = {
          uuid:"",
          routerName: "",
          icon: "",
          parentId: "",
          rootId: "",
          routerFnId: "",
          routerSrc:"",
          pageSrc:""
        }
        // this.$refs[formName].resetFields();
      },
      /**
       * 弹窗的确认按钮
       * @param {Object} e 校验参数
       */
      async submitDialogForm(e) {
        this.$refs['DialogForm'].validate(async (valid) => {
          if (valid) {
            loadingInstance = Loading.service({
              fullscreen: true
            })

            // 根级添加
            if (this.DialogTitle === '添加根路由') {
              this.addRouter(this.DialogForm)
              return
            }else if(this.DialogTitle === '添加子路由'){
              this.addRouter(Object.assign(this.DialogForm,{
                rootId:this.curSelectNodeData.uuid,
                parentId:this.curSelectNodeData.uuid
              }))
            }else if(this.DialogTitle === '修改路由信息'){
              this.updRouter(Object.assign(this.DialogForm,{}))
            }
          }
        });
      },
      /**
       * 将后端给出的格式转化为前端树组件需要的数据格式
       * @param {Object} data 需要处理的源数据
       */
      changeDataFormatForTree(data) {
        console.time("复用迭代法1")
        let delUuids = [];
        let delIndexs = [];
        let multiplexing = function(data) {
          for (let i = 0; i < data.length; i++) {
            let item1 = data[i];
            if (delUuids.findIndex(uuid => uuid == item1.uuid) != -1) continue
            if (!item1.parentId) {
              if(!item1['isComputer']){
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
        console.timeEnd("复用迭代法1")
        return data





        let rootMenus = data.filter(menuItem => !menuItem.parentId);
        let recursion = (list) => {
          list.forEach(menuItem => {
            menuItem.children = data.filter(i => i.parentId == menuItem.uuid)
            recursion(menuItem.children)
          })
        }
        console.time("递归法2")
        recursion(rootMenus)
        console.timeEnd("递归法2")
        return rootMenus
      },
      /*=====================接口相关================================*/
      /**
       * 查询路由信息列表
       * @param {Object} pageSize
       * @param {Object} pageNumber
       */
      async getRouterList(pageSize, pageNumber) {
        loadingInstance = Loading.service({
          fullscreen: true
        })
        try {
          let {
            code,
            data,
            msg
          } = await api_routerList({
            pageSize,
            pageNumber
          })
          this.$message.success("查询成功!")
          this.data = this.changeDataFormatForTree(data)
          return data
        } catch (e) {

        } finally {
          loadingInstance.close()
        }
      },
      /**
       * 添加路由信息
       * @param {Object} paramsObj
       */
      async addRouter(paramsObj) {
        loadingInstance = Loading.service({
          fullscreen: true
        })
        try {
          let {
            code,
            data,
            msg
          } = await api_routerAdd(paramsObj)
          this.$message.success("添加成功!")
          await this.getRouterList(this.pageSize, this.pageNumber);
        } catch (e) {

        } finally {
          loadingInstance.close()
          this.dialogClose()
        }
      },
      /**
       * 删除路由信息  删除后级联删除
       * @param {Object} uuid
       */
      async delRouter(uuid) {
        loadingInstance = Loading.service({
          fullscreen: true
        })
        try {
          let {
            code,
            data,
            msg
          } = await api_routerDel({
            uuid
          })
          this.$message.success("删除成功!")
          await this.getRouterList(this.pageSize, this.pageNumber);
        } catch (e) {

        } finally {
          loadingInstance.close()
          this.dialogClose()
        }
      },
      /**
       * 更新路由信息
       * TODO  要求能随意变换位置
       * @param {Object} uuid
       * @param {Object} icon
       * @param {Object} path
       */
      async updRouter(paramsObj) {
        loadingInstance = Loading.service({
          fullscreen: true
        })
        try {
          let {
            code,
            data,
            msg
          } = await api_routerUpd(paramsObj)
          this.$message.success("更新成功!")
          await this.getRouterList(this.pageSize, this.pageNumber);
        } catch (e) {

        } finally {
          loadingInstance.close()
          this.dialogClose()
        }
      }
    }
  };
</script>

<style lang="less" scoped>
  .custom-tree-container {
    padding: 20px;
  }

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }

  /deep/ .el-dialog,el-dialog--center,cust_dialog,.cust_dialog {
    border-radius:10px;
  }
</style>
