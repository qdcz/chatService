<template>
  <div class="wrapper">
    <!-- 查询条件 -->
    <div class="filter-container">
      <el-form :inline="true" :model="QuerySelect" size="mini">
        <el-form-item label="昵称" prop="Nickname"><el-input v-model="QuerySelect.Nickname" size="mini" clearable placeholder="请输入昵称" /></el-form-item>
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
        <!-- <el-form-item style="display:block;margin:0"><el-button class="filter-item" type="primary" @click="onAddUser">新增用户</el-button></el-form-item> -->
      </el-form>
    </div>

    <!-- 添加编辑的dialog -->
    <add-dialog :isshow-dialogs.sync="isshowDialogs" :dialog-info.sync="DialogInfo" @updateList="getLists" />

    <el-button type="primary" icon="el-icon-plus" @click="isshowDialogs=true">添加新用户</el-button>
    <!-- 表格内容 -->
    <tables class="mt20" :list="DataList" :list-loading.sync="listLoading" :isshow-dialogs.sync="isshowDialogs" :dialog-info.sync="DialogInfo" @updateList="getLists" />


    <!-- 分页器 -->
    <div class=" mt20">
      <el-pagination
        :current-page="QuerySelect.pageNum + 1"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="QuerySelect.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
// import { GetUserList } from '../../../api/user.js'
import tables from './comonents/Tables.vue'
import addDialog from './comonents/dialogs.vue'
import CitySelect from '@/components/CitySelect/CitySelect'
export default {
  name: 'Tables',
  components: { tables, addDialog, CitySelect },
  data() {
    return {
      QuerySelect: {
        // 条件查询参数
        pageNum: 0,
        pageSize: 10,
        Nickname: '',
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
      },

      listLoading: false,
      DataList: [], // 表格数据
      isshowDialogs: false, // 是否显示发布弹窗
      DialogInfo: '', // 表格内查看编辑带给dialog的数据
      total: 0 // 分页器总数
    }
  },
  created() {
    // this.getLists()
  },
  methods: {
    onAddUser() {
      this.isshowDialogs = true
    },
    CitySelectOnchange(e){
      this.QuerySelect.provinceId = e.provinceId
      this.QuerySelect.cityId = e.cityId
      this.QuerySelect.areaId = e.areaId
      let arr = [e.provinceName,e.cityName,e.areaName]
      this.QuerySelect.Region = arr[0]? arr[0] + (arr[1]? '-'+arr[1]: "") + (arr[2]? '-'+arr[2]: "") : ""
    },
    onSelect() {
      const json = JSON.parse(JSON.stringify(this.QuerySelect))
      // console.log(new Date(`${this.QuerySelect['registerTimeBeginTime'].getTime()}`))
      // json['registerTimeBeginTime'] = this.QuerySelect['registerTimeBeginTime'].getTime() || ''
      // json['registerTimeEndTime'] = this.QuerySelect['registerTimeEndTime'].getTime() || ''
      this.getLists(json)
    },
    // 分页器 条数发生变化
    handleSizeChange(val) {
      this.QuerySelect.pageSize = val
      this.QuerySelect.pageNum = 0
      const json = JSON.parse(JSON.stringify(this.QuerySelect))
      this.getLists(json)
    },
    // 分页器 页数发生变化
    handleCurrentChange(val) {
      this.QuerySelect.pageNum = val - 1
      const json = JSON.parse(JSON.stringify(this.QuerySelect))
      this.getLists(json)
    },
    onReset() {
      this.QuerySelect = {
        pageNum: 0,
        pageSize: 10,
        Nickname: '',
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
      }
    },
    async getLists(json) {
      json = json || { pageNum: this.QuerySelect.pageNum, pageSize: this.QuerySelect.pageSize }
      try {
        this.listLoading = true
        const { code, msg, total, data } = await GetUserList(json)
        if (code === 200) {
          this.$message({
            message: msg,
            type: 'success'
          })
          for (let i = 0, item; (item = data[i]); i++) {
            item['i'] = i + 1
          }
          this.total = total
          this.DataList = data
        }
      } catch (e) {
        console.log(e)
      } finally {
        this.listLoading = false
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
