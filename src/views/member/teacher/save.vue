<template>
  <div class="app-container">
    <el-form ref="ruleForm" :rules="rules" :model="teacher" label-width="80px">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="teacher.name" style="width: 300px;"></el-input>
      </el-form-item>
      <el-form-item label="教工号" prop="number">
        <el-input v-model="teacher.number" style="width: 300px;"></el-input>
      </el-form-item>
      <!-- <el-form-item label="密码" prop="password">
        <el-input v-model="teacher.password"></el-input>
      </el-form-item> -->
      <el-form-item label="部门" prop="department">

        <el-select
            v-model="academyId"
            @change="departmentLevel"
            placeholder="请选择">
            <el-option
            v-for="academy in academyList"
            :key="academy.id"
            :label="academy.name"
            :value="academy.id"/>
        </el-select>

        <el-select v-model="teacher.departmentId" placeholder="请选择">
        <el-option
            v-for="department in departmentList"
            :key="department.id"
            :label="department.name"
            :value="department.id"/>
        </el-select>
      </el-form-item>

      <el-form-item label="电话" prop="phone">
        <el-input v-model="teacher.phone" style="width: 300px;"></el-input>
      </el-form-item>
      <el-form-item label="QQ" prop="qq">
        <el-input v-model="teacher.qq" style="width: 300px;"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="teacher.email" style="width: 300px;"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import teacher from '@/api/ucenter/teacher.js'
import department from '@/api/ucenter/department.js'
export default {
  data() {
    return {
      academys:[],
      teacher: {
        departmentId:''
      },
      rules: {
        name: [
          { required: true, message: '请输入教师姓名', trigger: 'blur' },
        ],
        number: [{ required: true, message: '请输入教工号', trigger: 'blur' },
         { min: 10, max: 20, message: '学号长度应为10~20个字符', trigger: 'blur' }],
        // password: [{ min: 6, max: 16, message: '密码在6-16位之间', trigger: 'blur' }],
        departmentId: [{ required: true, message: '请选择部门', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入电话', trigger: 'blur' },{ min: 8, max: 11, message: '请输入正确格式的电话号码', trigger: 'blur' }],
        qq: [{ required: false, message: '请输入QQ', trigger: 'blur' },{ min: 6, max: 11, message: '请输入正确格式的QQ号码', trigger: 'blur' }],
        email: [{}],
      },
      academyList:[],
      departmentList:[],
      academyId:''
    }
  },
  created() {
    this.getDepTree()
  },
  methods: {
    departmentLevel(value){//一级分类触发
       for(let i=0;i<this.academyList.length;i++){
         var academy = this.academyList[i]
         if(value===academy.id){
           this.departmentList=academy.children
           this.teacher.departmentId=''//清空数据，清除显示
         }
       }
    },
    getDepTree(){
      department.getTeacherDepTree()
      .then(response=>{
        this.academyList=response.data.items
      })
    },
    addTeacher() {
      teacher.addTeacher(this.teacher)
      .then(response=>{
          this.$message({
              type:'success',
              message:'添加成功'
          })
          this.$router.push({path:'/teacher/list'})
      })
    },
    onSubmit() {
      this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            this.addTeacher()
          } else {
            console.log('error submit!!');
            return false;
          }
        })
    },
  },
}
</script>

<style>
</style>