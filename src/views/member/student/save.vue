<template>
  <div class="app-container">
    <el-form :rules="rules" ref="ruleForm" :model="student" label-width="80px">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="student.name" style="width: 300px;"></el-input>
      </el-form-item>
      <el-form-item label="学号" prop="snumber">
        <el-input v-model="student.number" style="width: 300px;"></el-input>
      </el-form-item>
      <!-- <el-form-item label="密码" prop="password">
        <el-input v-model="student.password"></el-input>
      </el-form-item> -->
      <el-form-item label="学院" prop="academy">
        <el-select v-model="student.academyId" placeholder="请选择学院" @change="getAllMajor" style="width: 300px;">
          <div v-for="(item, index) in academyList" :key="index">
            <el-option :label="item.name" :value="item.id"></el-option>
          </div>
        </el-select>
      </el-form-item>
      <el-form-item label="专业" prop="major">
        <el-select v-model="student.majorId" placeholder="请选择专业" @change="getAllClazz" style="width: 300px;">
          <div v-for="(item, index) in majorList" :key="index">
            <el-option :label="item.name" :value="item.id"></el-option>
          </div>
        </el-select>
      </el-form-item>
      <el-form-item label="班级" prop="clazz">
        <el-select v-model="student.clazzId" placeholder="请选择班级" style="width: 300px;">
          <div v-for="(item, index) in clazzList" :key="index">
            <el-option :label="item.name" :value="item.id"></el-option>
          </div>
        </el-select>
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input v-model="student.phone" style="width: 300px;"></el-input>
      </el-form-item>
      <el-form-item label="QQ" prop="qq">
        <el-input v-model="student.qq" style="width: 300px;"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="student.email" style="width: 300px;"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import student from '@/api/ucenter/student.js'
import department from '@/api/ucenter/department.js'
export default {
  data() {
    return {
      student: {
        name: '',
        snumber: '',
        password: '',
        academyId: '',
        majorId: '',
        clazzId: '',
        phone: '',
        qq: '',
        email: '',
      },
      rules: {
        name: [
          { required: true, message: '请输入学生姓名', trigger: 'blur' },
        ],
        number: [{ required: true, message: '请输入学号', trigger: 'blur' },
         { min: 12, max: 12, message: '学号长度应为12个字符', trigger: 'blur' }],
        password: [{ min: 6, max: 16, message: '密码在6-16位之间', trigger: 'blur' }],
        academyId: [{ required: true, message: '请选择学院', trigger: 'blur' }],
        majorId: [{ required: true, message: '请选择专业', trigger: 'blur' }],
        clazzId: [{ required: true, message: '请选择班级', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入电话', trigger: 'blur' },{ min: 8, max: 11, message: '请输入正确格式的电话号码', trigger: 'blur' }],
        qq: [{ required: false, message: '请输入QQ', trigger: 'blur' },{ min: 6, max: 11, message: '请输入正确格式的QQ号码', trigger: 'blur' }],
        email: [{}],
      },
      departments: [],
      academyList: [],
      majorList: [],
      clazzList: [],
    }
  },
  created() {
    this.getDepartmentTree()
  },
  methods: {
    getDepartmentTree() {
      department.getStudentDepartmentTree().then((res) => {
        this.departments = res.data.items
        this.getAllAcademy()
      })
    },
    getAllAcademy() {
      this.departments.forEach((item) => {
        this.academyList.push({
          id: item.id,
          name: item.name,
        })
      })
    },
    getAllMajor() {
      this.departments.forEach((item) => {
        if (item.id == this.student.academyId) {
          item.children.forEach((item1) => {
            this.majorList.push({
              id: item1.id,
              name: item1.name,
            })
          })
        }
      })
    },
    getAllClazz() {
      this.departments.forEach((item) => {
        if (item.id == this.student.academyId) {
          item.children.forEach((item1) => {
            if (item1.id == this.student.majorId) {
              item1.children.forEach((item2) => {
                this.clazzList.push({
                  id: item2.id,
                  name: item2.name,
                })
              })
            }
          })
        }
      })
    },
    addStudent() {
      student.addStudent(this.student).then(res => {
        this.$message({
          type: 'success',
          message: '添加成功!',
        })
         this.$router.push({ path: '/member/student/list' })
      })
    },
    onSubmit() {
      this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            this.addStudent()
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