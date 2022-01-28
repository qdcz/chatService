<template>
  <div class="yz">
    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading..." border fit highlight-current-row
      style="width: 100%">
      <el-table-column width="80" align="center" label="序号" sortable prop="orderNumber">
        <template slot-scope="scope">
          <span>{{ scope.row.orderNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column width="100" align="center" label="昵称" show-overflow-tooltip sortable prop="name">
        <template slot-scope="scope">
          <span>{{ scope.row.name || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column width="140" align="center" label="账号" show-overflow-tooltip sortable prop="uuid">
        <template slot-scope="scope">
          <span>{{ scope.row.uuid || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="160" align="center" label="性别" show-overflow-tooltip sortable prop="sex">
        <template slot-scope="scope">
          <span>{{ scope.row.sex || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="160" align="center" label="移动电话" show-overflow-tooltip sortable prop="phone">
        <template slot-scope="scope">
          <span>{{ scope.row.phone || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200" align="center" label="地区" show-overflow-tooltip sortable prop="address">
        <template slot-scope="scope">
          <span>{{ scope.row.address || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="160" align="center" label="简介" show-overflow-tooltip sortable prop="introduction">
        <template slot-scope="scope">
          <span>{{ scope.row.introduction || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="注册时间" align="center" prop="registerTime" :formatter="formatDate" width="200" />
      <el-table-column width="100" align="center" label="状态" sortable prop="auditState">
        <template slot-scope="scope">
          <span>{{ !scope.row.IsCurrentUse ? '使用中' : '禁用中' }}</span>
        </template>
      </el-table-column>


      <el-table-column width="260" align="center" label="操作" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button class="filter-item" size="mini" :type="scope.row.IsCurrentUse?'success':''"
            @click="tableItemUse(scope.row)">禁用账号</el-button>
          <el-button class="filter-item" size="mini" type="primary" @click="tableItemDetail(scope.row)">查看</el-button>
          <el-button class="filter-item" size="mini" type="danger" @click="tableItemDel(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import {
    api_delUser
  } from '@/api/adminUser.js';
  export default {
    name: 'Tables',
    props: {
      listLoading: {
        type: Boolean,
        default: false
      },
      list: {
        type: Array,
        default: function() {
          return []
        }
      },
      isShowDialog: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {}
    },
    methods: {
      // 删除按钮
      tableItemDel(e) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.DelUser(e.uuid)
        })
      },
      // 查看按钮
      tableItemDetail(e) {
        this.$emit('update:isShowDialog', true)
        this.$emit('update:dialogInfo', e)
      },
      // 启用/禁用按钮
      async tableItemUse(e) {
        let loading = null
        try {
          loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
        } catch (e) {
          console.log(e)
        } finally {
          loading.close()
        }
      },
      formatDate(row, column) {
        const data = row[column.property]
        const dt = new Date(data)
        return dt.getFullYear() 
          + '-' + (dt.getMonth() + 1 >10 ? dt.getMonth() + 1 :"0"+ (dt.getMonth() + 1))
          + '-' + (dt.getDate() >=10 ? dt.getDate() :"0"+ dt.getDate())
          + ' ' + (dt.getHours() >=10 ? dt.getHours() :"0"+ dt.getHours())
          + ':' + (dt.getMinutes() >=10 ? dt.getMinutes() :"0"+ dt.getMinutes())
          + ':' + (dt.getSeconds() >=10 ? dt.getSeconds() :"0"+ dt.getSeconds())
      },

      /*===================================================接口相关===============================================*/
      // 删除用户信息
      async DelUser(uuid) {
        let loading = null
        try {
          loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          const {
            code,
            msg
          } = await api_delUser({uuid})
          if (code === 'M200') {
            this.$message({
              message: msg,
              type: 'success'
            })
            this.$emit('updateList')
          }
        } catch (e) {
          console.log(e)
        } finally {
          loading.close()
        }
      }
    }
  }
</script>

<style></style>
