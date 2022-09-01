<template>
  <div class="app-container">
    <el-form :model="laboratory" ref="laboratory" :rules="rules" label-width="120px">


      <el-form-item label="实验室名称" prop="name">
        <el-input v-model="laboratory.name" style="width: 300px;"/>
      </el-form-item>
      <el-form-item label="负责老师姓名" prop="teacherName">
        <el-input v-model="laboratory.teacherName" placeholder="老师姓名" style="width: 300px;" />
      </el-form-item>
      <el-form-item label="负责老师电话" prop="teacherPhone">
        <el-input v-model="laboratory.teacherPhone" placeholder="老师电话" style="width: 300px;"/> 
      </el-form-item>
      <el-form-item label="所属学院" prop="parentId">
          <el-select v-model="laboratory.parentId" placeholder="请选择学院">
            <el-option 
            v-for="academy in academyList"
            :key="academy.id"
            :label="academy.name" 
            :value="academy.id"/>
          </el-select>
      </el-form-item>

      <el-form-item label="实验室位置" prop="position">
        <el-input v-model="laboratory.position" placeholder="实验室位置" style="width: 400px;"/> 
      </el-form-item>


        <el-form-item label="实验室介绍">
            <tinymce :height="300" v-model="laboratory.details"/>
        </el-form-item>


        <el-form-item label="实验室规章">
            <tinymce :height="300" v-model="laboratory.rules"/>
        </el-form-item>


    <el-form-item label="实验室头像">
      <el-upload
        class="avatar-uploader"
        action="http://localhost:8003/file/image"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload">
        <img v-if="laboratory.avatar" :src="laboratory.avatar" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import laboratory from '@/api/ucenter/laboratory'
import academy from '@/api/ucenter/department'
export default {
  //声明组件
  components:{Tinymce},
   data(){
       return{
            BASE_API:process.env.BASE_API, //获取dev.env.js里面地址
            saveBtnDisabled: false, // 保存按钮是否禁用,
            laboratory:{
              name:'',
              teacherName:'',
              teacherPhone:'',
              academyId:'',
              avatar:''
            },
            academyList:[],
           rules: {
            name: [{ required: true, message: '请输入实验室名称', trigger: 'blur' }, ],
            teacherName: [{ required: true, message: '请输入教师姓名', trigger: 'blur' }, ],
            parentId: [{ required: true, message: '请选择学院', trigger: 'blur' }],
            teacherPhone: [{ required: true, message: '请输入电话', trigger: 'blur' },{ min: 8, max: 11, message: '请输入正确格式的电话号码', trigger: 'blur' }],
            position:[{ required: true, message: '请输入实验室位置', trigger: 'blur' },]
         },
       }
   },
   created(){
      this.init()
      this.getAcademyList()
   },
   //监听，路由变化时这个方法执行
     watch: {
    $route(to, from) {
      console.log('watch $route')
      this.init()
    }
  },
   methods:{

       saveOrUpdate(){
           if(this.laboratory.id){
               this.updateLaboratory()
           }else{
               this.addLaboratory()
           }
       },
       addLaboratory(){
           laboratory.addLaboratory(this.laboratory)
           .then(()=>{
               this.$message({
                   type:'success',
                   message:'添加成功'
               })
               this.$router.push({path:'/department/laboratory/list'})
           })
       },
       updateLaboratory(){
           laboratory.updateLaboratory(this.laboratory)
           .then(()=>{
               this.$message({
                   type:'success',
                   message:'更新成功'
               })
               this.$router.push({path:'/department/laboratory/list'})
           })
       },
       init(){
           if(this.$route.params&&this.$route.params.id){
               const id=this.$route.params.id
               laboratory.getLabById(id)
               .then(response=>{
                   this.laboratory=response.data.laboratory
               })
           }else{
               this.laboratory={
                  name:'',
                  teacherName:'',
                  teacherPhone:'',
                  academyId:'',
                  avatar:'',
                  avatar:'https://guli-edu-100701.oss-cn-qingdao.aliyuncs.com/default/defaultAvatar.png'
               }
           }
       },
       getAcademyList(){
           academy.getAllAcademy()
           .then(response=>{
               this.academyList=response.data.items
           })
       },

    onSubmit() {
      this.$refs['laboratory'].validate((valid) => {
          if (valid) {
            this.saveOrUpdate()
          } else {
            console.log('error submit!!');
            return false;
          }
        })
    },
      handleAvatarSuccess(res, file) {
        console.log(res)
        this.laboratory.avatar=res
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isPng = file.type === 'image/png'
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG&&!isPng) {
          this.$message.error('上传头像图片只能是 JPG 格式 和 PNG格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      }

   }
}
</script>
<style scoped>
.tinymce-container {
  line-height: 29px;
}
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>