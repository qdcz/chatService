<template>
  <div class="dialogs">
    <el-dialog title="修改个人信息" :visible.sync="isshowDialogs" width="60%" center @close="dialogClose">
      <el-form ref="form" :model="form" class="el-form" :rules="rules" label-width="80px" label-position="left">
        <el-form-item label="账号" prop="account">
          <el-input v-model="form.account" size="large" :disabled="dialogInfo._id?true:null" />
        </el-form-item>
        <el-form-item label="密码" prop="pwd">
          <div class="flex ali-cen hei-inh">
            <el-input v-model="form.pwd" size="large" :type="IsShowPwd" placeholder="请输入密码" />
            <el-button class="ml20  hei-inh" type="" icon="el-icon-thumb" @click='showHidePwd'>{{IsShowPwdTxt}}</el-button>
          </div>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="form.role" placeholder="选择角色" style="padding: 0;" clearable>
            <el-option :label="i.RoleName" :value="i.RoleName"  v-for="i in RoleList" :key='i._id'/>
          </el-select>
        </el-form-item>
        <el-form-item label="昵称" prop="Nickname">
          <el-input v-model="form.Nickname" size="large" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
          <el-upload ref="upload" action="" class="avatar-uploader" list-type="picture-card" :auto-upload="false"
            :limit="1" :file-list="fileList" :before-upload="beforeImgUpload" :on-exceed="cover_handleExceed"
            :on-success="ImgUploadSuccess" :before-remove="BeforeRemoveImgUpload" :on-preview="ImgPreview" :on-change="singleFileChange">
            <!-- <img  :src="fileList[0].url" class="avatar"> -->
            <i class="el-icon-plus avatar-uploader-icon" />
          </el-upload>

          <!-- 图片查看 -->
          <el-dialog :visible.sync="ImgDialog.Visible"><img width="100%" :src="ImgDialog.ImageUrl" alt=""></el-dialog>
        </el-form-item>
        <el-form-item label="生日" prop="birth">
          <el-col :span="11">
            <el-date-picker v-model="form.birth" placeholder="选择日期" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd"
              style="width: 100%;" />
          </el-col>
        </el-form-item>
        <el-form-item label="简介" prop="introduce">
          <el-input v-model="form.introduce" size="large" placeholder="简介" type="textarea" :autosize="{ minRows: 2, maxRows: 8 }" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="form.sex" placeholder="选择性别"  style="padding: 0;">
            <el-option label="男" value="男" />
            <el-option label="女" value="女" />
          </el-select>
        </el-form-item>
        <el-button class="submit-bth" type="primary" @click="onSubmit('form')">{{ dialogInfo._id ? '更新' : '发布' }}</el-button>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  // const OSS = require('ali-oss')
  // import { Register,UpdUser } from '../../../../api/user.js'
  // import {GetRoleInfo} from '../../../../api/YangPan/role.js'

  // import {API$DelOssFile} from '../../../../api/YangPan/OSS.js'
  // import { mapGetters } from 'vuex'
  export default {
    props: ['isshowDialogs', 'dialogInfo'],
    data() {
      // 自定义密码校验规则
      var validatePwd = (rule, value, callback) => {
        if (!value) {
          callback(new Error('密码不能为空'));
        } else if(!(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/.test(value))) {
          callback(new Error('密码不符合格式'));
        }else{
          callback();
        }
      };
      return {
        ali_oss: '',              // 阿里oss实例化对象
        RoleList:[],              // 角色列表

        licenseImageUrl: [],
        fileList: [],
        ImgDialog: {
          ImageUrl: '',
          Visible: false
        },
        form: {
          account: '',
          Nickname: '',
          role:"",
          birth: '',
          introduce: '',
          pwd: '',
          sex: ''
        },
        rules: {
          account: [{ required: true, message: '账号不能为空', trigger: 'change' }],
          pwd: [{ required: true, message: '密码不能为空', trigger: 'change' }],
          role: [{ required: true, message: '角色不能为空', trigger: 'change' }]
        },

        hidePwd:true // 是否隐藏密码
      }
    },
    watch: {
      dialogInfo() {
        console.log('触发监听')
        this.form.account = this.dialogInfo.account
        this.form.Nickname = this.dialogInfo.Nickname
        this.form.role = this.dialogInfo.role
        this.form.birth = this.dialogInfo.birth
        this.form.introduce = this.dialogInfo.introduce
        this.form.sex = this.dialogInfo.sex
        this.form.pwd = this.dialogInfo.pwd

        this.fileList = this.dialogInfo.avatar ?
          [{
            name: 'test',
            url: this.dialogInfo.avatar
          }] :
          []
      }
    },
    computed: {
      // 判断type
      IsShowPwd(){
        return this.hidePwd ? 'password' : null
      },
      // 判断输出文字
      IsShowPwdTxt(){
        return this.hidePwd ? '显示密码' : '隐藏密码'
      }
    },
    async mounted() {
      this.GetRoleList()
      this.GetOssSts()
    },
    methods: {
      // 是否显示密码
      showHidePwd(){
         this.hidePwd = !this.hidePwd
      },
      // 上传文件之前的钩子
      beforeImgUpload(file) {
        const isJPG = file.type === 'image/jpeg'
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isJPG) {
          this.$message.error('上传图片只能是 JPG 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!')
        }
        return isJPG && isLt2M
      },
      // 文件超出个数限制时的钩子
      cover_handleExceed() {
        this.$message.warning('最多上传1张图片')
      },
      // 删除文件
      BeforeRemoveImgUpload() {
        return new Promise((res, rej) => {
          this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
            .then(() => {
              // 只限于添加角色的时候会生效   因为如果换成编辑的话我没把name存储并带过来
              this.DelOssFile(this.fileList[0].name)
              res()
            })
            .catch(() => {
              rej()
            })
        })
      },
      // 图片上传成功~
      ImgUploadSuccess(file, fileList) {
        this.fileList[0].url = fileList.response.data
      },
      // 图片预览
      ImgPreview(file) {
        this.ImgDialog.ImageUrl = file.url
        this.ImgDialog.Visible = true
      },
      // 提交信息
      async onSubmit(formName) {
        this.$refs[formName].validate(async valid => {
          if (valid) {
            let loading = null
            try {
              loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
              })
              this.dialogInfo._id ? this.UpdAPI() : this.AddAPI()
            } catch (e) {
              this.$message.error(e)
            } finally {
              loading.close()
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      // 添加数据
      async AddAPI() {
        try {
          if(this.fileList.length>0){
            this.form.avatar = this.fileList[0].url
          }
          const {code,msg} = await Register(this.form)
          if (code === 200) {
            this.$message(msg)
            this.dialogClose()
            this.$emit('updateList')
          }
        } catch (err) {
          this.$message.error(err)
        } finally {
          this.clear_form()
        }
      },
      // 更新数据
      async UpdAPI() {
        const avatar = this.fileList.length > 0 ? this.fileList[0].url : ''
        const json = Object.assign({
          _id: this.dialogInfo._id,
          avatar
        }, this.form)
        console.warn(json)
        try {
          const {
            code,
            msg
          } = await UpdUser(json)
          if (code === 200) {
            this.$message({
              message: msg,
              type: 'success'
            })
            this.dialogClose()
            this.$emit('updateList')
          }
        } catch (err) {
          this.$message.error(err)
        } finally {
          this.clear_form()
        }
      },
      // 重写上传文件选择时回调 直接上传
      async singleFileChange(file, fileList) {
        const name = file.name.slice(0, file.name.match(/[^\.]\w*$/).index - 1)
        const type = file.name.match(/[^\.]\w*$/)[0]
        // if (!['apk', 'wgt'].includes(type)) {
        //   this.licenseImageUrl = []
        //   this.$message.error('上传文件格式不支持!,只支持apk和wgt文件')
        //   return
        // }

        if (!(file.size / 1024 / 1024 < 100)) {
          this.licenseImageUrl = []
          this.fileList = []
          return this.$message.error('上传文件大小不能超过 100MB!')
        }
        const copyFile = new File([file.raw], `${name}_${new Date().getTime()}.${type}`)
        this.up_filename = file.name
        const loading = this.$loading({
          lock: true,
          text: '上传中，请耐心等待',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.5)'
        })

        //  阿里云  文件上传api
        try {
          let uploadUrl = this.dialogInfo._id? `/admin-uploadImg/${this.form.account}/${name}_${new Date().getTime()}.${type}`:`/admin-uploadImg/linshi/${name}_${new Date().getTime()}.${type}`
          const res = await this.ali_oss.multipartUpload(
            uploadUrl, copyFile, {
              progress: (p, checkpoint) => {
                const progress_wid = (p * 100).toString().slice(0, 4) + '%'
                if (progress_wid === '100%') {
                  this.$message({
                    message: '上传成功~',
                    type: 'success'
                  })
                }
              },
              meta: {
                year: 2020,
                people: 'test'
              }
            })
          if (res.res.status === 200) {
            console.warn(res.res)
            this.fileList = [{
              name: res.name, //    /uploadImg/15892023483/05_1599731424799.jpg
              // url: res.res.requestUrls[0] //    "http://qdds666.oss-cn-hangzhou.aliyuncs.com/uploadImg//06_1599731490849.jpg"
              url: 'http://qdds666.oss-cn-hangzhou.aliyuncs.com/' + res.name
            }]
          }
        } catch (e) {
          console.log(e)
          this.$message.error('上传失败')
        } finally {
          loading.close()
        }
      },

      // 清空表单
      clear_form() {
        this.form = {
          account: '',
          Nickname: '',
          birth: '',
          introduce: '',
          pwd: '',
          sex: '',
          role:""
        }
        this.fileList = []
        this.hidePwd = true
      },
      dialogClose() {
        this.$emit('update:isshowDialogs', false)
        this.$emit('update:dialog-info', '')
        // this.$refs['form'].resetFields();
        this.clear_form()
      },
      /** *****************************************************************  接口处理部分****************************************************/
      async GetRoleList(){
        let {code,data,msg} = await GetRoleInfo()
        if(code===200){
          this.RoleList = data
        }
      },
      /** *****************************************************************  OSS处理部分****************************************************/
      // 初始化oss
      async GetOssSts() {
        this.ali_oss = new OSS({
          region: 'oss-cn-hangzhou',
          accessKeyId: this.STS.credentials.AccessKeyId,
          accessKeySecret: this.STS.credentials.AccessKeySecret,
          stsToken: this.STS.credentials.SecurityToken,
          bucket: 'qdds666'
        })
      },
      // 删除oss文件
      async DelOssFile(dir) {
        try {
          await API$DelOssFile({
            filePath: dir
          })
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.fileList = []
          this.$refs.upload.clearFiles()
        } catch (e) {
          this.$message.error(e)
        } finally {

        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .yp {
    padding: 20px;

    .el-row {
      // padding: 10px 0;
    }

    .submit-bth {
      width: 100%;
    }
  }

  .down-list {
    color: gray;
    font-size: 14px;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    .first-line {
      width: inherit;
      box-sizing: border-box;
      padding: 0 10px;
      display: flex;
      justify-content: space-between;
      margin: 10px 0 0 0;
    }

    .second-line {
      position: relative;
      background-color: #e4dfdf;
      width: 100%;
      height: 4px;
      border-radius: 50px;
      margin: 4px 0 10px 0;

      .progress {
        height: inherit;
        border-radius: 50px;
        position: absolute;
        background-color: skyblue;
      }
    }
  }
</style>
