<template>
  <div class="wrapper">
    <!-- 查询条件 -->
    <div class="filter-container">
      <el-form :inline="true" :model="QuerySelect" size="mini">
        <el-form-item label="昵称" prop="name"><el-input v-model="QuerySelect.name" size="mini" clearable placeholder="请输入昵称" /></el-form-item>
        <el-form-item label="账号" prop="account"><el-input v-model="QuerySelect.account" clearable size="mini" placeholder="请输入账号" /></el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="QuerySelect.sex" clearable style="width:150px" placeholder="请选择性别">
            <el-option value="男" label="男" />
            <el-option value="女" label="女" />
          </el-select>
        </el-form-item>
        <el-form-item label="城市" prop="Region">
          <city-select @change="CitySelectOnchange" :_provinceId='QuerySelect.provinceId' :_cityId='QuerySelect.cityId' :_areaId='QuerySelect.areaId'/>
        </el-form-item>
        <el-form-item label="使用状态">
          <el-select v-model="QuerySelect.IsCurrentUse" clearable style="width:150px" placeholder="选择使用状态">
            <el-option :value="true" label="使用中" />
            <el-option :value="false" label="停用中" />
          </el-select>
        </el-form-item>
        <!--        <el-form-item label="生日">
          <el-date-picker v-model="QuerySelect.birthBeginTime" style="width: 150px;" clearable type="date" placeholder="选择起始日期" />
          -
          <el-date-picker v-model="QuerySelect.birthEndTime" style="width: 150px;" clearable type="date" placeholder="选择结束日期" />
        </el-form-item> -->
        <el-form-item label="注册时间">
          <el-date-picker v-model="QuerySelect.registerTimeBeginTime" style="width: 180px;" clearable type="date" placeholder="选择起始日期" format="yyyy-MM-dd HH:mm:ss" />
          -
          <el-date-picker v-model="QuerySelect.registerTimeEndTime" style="width: 180px;" clearable type="date" placeholder="选择结束日期" format="yyyy-MM-dd HH:mm:ss" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSelect">查询</el-button>
          <el-button type="default" icon="el-icon-reset" @click="onReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>



    <el-button type="primary" icon="el-icon-plus" @click="isShowDialog=true">添加新用户</el-button>

    <!-- 添加编辑的dialog -->
    <add-dialog
      :isShowDialog.sync="isShowDialog"
      :dialog-info.sync="DialogInfo"
      :RoleList.sync = "roleList"
      @updateList="getUserList"
    />

    <!-- 表格内容 -->
    <tables class="mt20"
      :list="userList"
      :list-loading.sync="listLoading"
      :isShowDialog.sync="isShowDialog"
      :dialog-info.sync="DialogInfo"
      @updateList="getUserList"
    />

    <!-- 分页器 -->
    <el-pagination
      style="margin-top:10px;margin-left:-10px;"
      :current-page="QuerySelect.pageNumber"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="QuerySelect.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="QuerySelect.pageTotal"
      @size-change="pagination_sizeChange"
      @current-change="pagination_currentChange"
      @prev-click="pagination_prevNextClick"
      @next-click="pagination_prevNextClick"
    />
  </div>
</template>

<script>
import {
  Loading
} from 'element-ui';
import tables from './comonents/Tables.vue';
import addDialog from './comonents/dialogs.vue';
import CitySelect from '@/components/CitySelect/CitySelect';
import {
  api_UserList
} from '@/api/adminUser.js';
import {
  api_roleList
} from '@/api/adminRole.js';


let loadingInstance = "加载中...";
export default {
  name: 'Tables',
  components: { tables, addDialog, CitySelect },
  data() {
    return {
      QuerySelect:{}, // 条件查询参数
      listLoading: false,
      userList: [], // 用户列表
      roleList:[],  // 角色列表
      isShowDialog: false, // 是否显示添加/需改弹窗
      DialogInfo: null, // 表格内查看编辑带给dialog的数据
    }
  },
  created() {
    this.onReset();
    this.getUserList(this.QuerySelect);
    this.getRoleList(10000,1);
  },
  methods: {
    CitySelectOnchange(e){
      this.QuerySelect.provinceId = e.provinceId
      this.QuerySelect.cityId = e.cityId
      this.QuerySelect.areaId = e.areaId
      let arr = [e.provinceName,e.cityName,e.areaName]
      this.QuerySelect.Region = arr[0]? arr[0] + (arr[1]? '-'+arr[1]: "") + (arr[2]? '-'+arr[2]: "") : ""
    },
    onSelect() {
      this.getUserList(this.QuerySelect)
    },
    // 页数大小改变
    pagination_sizeChange(e) {
      this.QuerySelect.pageSize = e;
      this.getUserList(this.QuerySelect);
    },
    pagination_currentChange(e) {
      this.QuerySelect.pageNumber = e
      this.getUserList(this.QuerySelect)
    },
    pagination_prevNextClick(e){
      this.pageNumber = e
      this.getRoleList(this.pageSize,this.pageNumber)
    },
    /*===================================================工具函数相关===============================================*/
    GetQuerySelectDefault(){
      return {
        pageNumber: 1, // 分页下标(用户信息)
        pageSize: 10, // 分页大小(用户信息)
        pageTotal:0,   // 总数大小(用户信息)
        name: '',
        account: '',
        sex: '',
        Region: '',
        IsCurrentUse: '',
        birthBeginTime: '',
        birthEndTime: '',
        registerTimeBeginTime: '',
        registerTimeEndTime: '',
        provinceId:"",
        cityId:"",
        areaId:""
      };
    },
    onReset() {
      this.QuerySelect = this.GetQuerySelectDefault();
    },
    /*===================================================接口相关===============================================*/
    // 查询用户信息列表
    async getUserList(params) {
      params = params || this.QuerySelect
      loadingInstance = Loading.service({
        fullscreen: true
      })
      try {
        let {
          code,
          data,
          total
        } = await api_UserList(params)
        this.userList = data.map((i,index)=>{i.orderNumber = index+1;return i})
        this.QuerySelect.pageTotal = total
        this.$message.success("用户列表查询成功!")
      } catch (e) {

      } finally {
        loadingInstance.close()
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
        } = await api_roleList({
          pageSize,
          pageNumber
        })
        this.roleList = data
        this.$message.success("角色列表查询成功!")
      } catch (e) {

      } finally {
        loadingInstance.close()
      }
    }
  }
}
</script>

<style lang="less" scoped="scoped">
/deep/ .el-select {
  padding: 0 10px;
}
.wrapper{
  padding: 20px;
}
</style>
