<template>
  <div class="app-container">
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="studentQuery.name" placeholder="学生名" />
      </el-form-item>

      <el-form-item>
        <el-input v-model="studentQuery.phone" placeholder="电话" />
      </el-form-item>

      <el-form-item label="学院">
        <el-select v-model="studentQuery.academyId" placeholder="请选择学院" style="width: 200px;">
          <div v-for="(item, index) in academyList" :key="index">
            <el-option :label="item.name" :value="item.id"></el-option>
          </div>
        </el-select>
      </el-form-item>
      <el-form-item label="专业">
        <el-select v-model="studentQuery.majorId" placeholder="请选择专业" style="width: 200px;">
          <div v-for="(item, index) in majorList" :key="index">
            <el-option :label="item.name" :value="item.id"></el-option>
          </div>
        </el-select>
      </el-form-item>
      <el-form-item label="班级">
        <el-select v-model="studentQuery.clazzId" placeholder="请选择班级" style="width: 160px;">
          <div v-for="(item, index) in clazzList" :key="index">
            <el-option :label="item.name" :value="item.id"></el-option>
          </div>
        </el-select>
      </el-form-item>

      <el-form-item label="状态">
        <el-select style="width: 100px;" v-model="studentQuery.disabled" placeholder="状态">
          <el-option label="启用" :value="0"></el-option>
          <el-option label="禁用" :value="1"></el-option>
        </el-select>
      </el-form-item>

      <el-button type="primary" icon="el-icon-search" @click="getPageStudent()">查询</el-button>
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>
    <!-- 表格 -->
    <el-table :data="studentList" element-loading-text="数据加载中" border fit highlight-current-row>

      <el-table-column label="序号" width="70" align="center">
        <template slot-scope="scope">
          <!-- 获取序号的一种算法 -->
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="name" label="姓名" width="80" align="center" />

      <el-table-column prop="number" label="学号" width="140" align="center" />

      <el-table-column prop="academyName" label="学院" width="160" align="center" />

      <el-table-column prop="majorName" label="专业" width="200" align="center" />

      <el-table-column prop="clazzName" label="班级" width="160" align="center" />

      <el-table-column prop="phone" label="电话" width="140" align="center" />

      <el-table-column prop="qq" label="QQ" width="140" align="center" />

      <el-table-column prop="email" label="邮箱" width="200" align="center" />

      <el-table-column label="状态" width="100" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.disabled" active-color="#13ce66" inactive-color="#ff4949" :active-value="0" :inactive-value="1" @change="handleStateChange(scope.row)">
          </el-switch>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="openUpdateStudentDialog(scope.row)">修改</el-button>
          <el-button type="danger" size="mini" @click="deleteStudent(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 修改学生信息 -->
    <el-dialog title="修改学生信息" :visible.sync="showUpdateStudentDialog">
      <el-form :model="studentVo">
        <el-form-item label="名字" :label-width="'100px'">
          <el-input v-model="studentVo.name" placeholder="学生名" />
        </el-form-item>
        <el-form-item label="学号" :label-width="'100px'">
          <el-input v-model="studentVo.number" placeholder="学生名" />
        </el-form-item>
        <el-form-item label="学院" prop="academy" :label-width="'100px'">
          <el-select v-model="studentVo.academyId" placeholder="请选择学院" @change="getAllMajor">
            <div v-for="(item, index) in academyList1" :key="index">
              <el-option :label="item.name" :value="item.id"></el-option>
            </div>
          </el-select>
        </el-form-item>
        <el-form-item label="专业" prop="major" :label-width="'100px'">
          <el-select v-model="studentVo.majorId" placeholder="请选择专业" @change="getAllClazz">
            <div v-for="(item, index) in majorList1" :key="index">
              <el-option :label="item.name" :value="item.id"></el-option>
            </div>
          </el-select>
        </el-form-item>
        <el-form-item label="班级" prop="clazz" :label-width="'100px'">
          <el-select v-model="studentVo.clazzId" placeholder="请选择班级">
            <div v-for="(item, index) in clazzList1" :key="index">
              <el-option :label="item.name" :value="item.id"></el-option>
            </div>
          </el-select>
        </el-form-item>
        <el-form-item label="电话" :label-width="'100px'">
          <el-input v-model="studentVo.phone" placeholder="电话" />
        </el-form-item>
        <el-form-item label="QQ" :label-width="'100px'">
          <el-input v-model="studentVo.qq" placeholder="QQ" />
        </el-form-item>
        <el-form-item label="邮箱" :label-width="'100px'">
          <el-input v-model="studentVo.email" placeholder="邮箱" />
        </el-form-item>
        <el-form-item label="密码" :label-width="'100px'">
          <el-input v-model="studentVo.password" placeholder="不填写则不修改" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showUpdateStudentDialog = false">取 消</el-button>
        <el-button type="primary" @click="updateStudent">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分页 -->
    <el-pagination :current-page="page" :page-size="limit" :total="total" style="padding: 30px 0; text-align: center;" layout="total, prev, pager, next, jumper" @current-change="getPageStudent" />

  </div>
</template>

<script>
import student from '@/api/ucenter/student.js'
import department from '@/api/ucenter/department.js'
export default {
  // 写核心代码的位置
  // data: {

  // },
  data() {
    // 定义变量和初始值
    return {
      value: 1,
      studentList: [], // 查询村之后接口返回集合
      id: 0,
      total: 0, // 总记录数
      page: 1, // 当前页
      limit: 10, // 每页记录数
      studentQuery: {
        name: '',
        phone: '',
        academyId: '',
        majorId: '',
        clazzId: '',
        disabled: '',
      }, // 条件封装对象
      academyList: [],
      majorList: [],
      clazzList: [],
      showUpdateStudentDialog: false,
      studentVo: {},
      departments: [],
      academyList1: [],
      majorList1: [],
      clazzList1: [],
    }
  },
  created() {
    // 页面渲染之前执行，一般调用methods定义的方法
    // 调用
    this.getPageStudent()
    this.getAcademyList()
    this.getMajorList()
    this.getClazzList()
    this.getDepartmentTree()
  },
  methods: {
    // 创建具体的方法，调用teacher.js定义的方法
    // 讲师列表
    getDepartmentTree() {
      department.getStudentDepartmentTree().then((res) => {
        this.departments = res.data.items
        this.getAllAcademy()
      })
    },
    getAllAcademy() {
      this.departments.forEach((item) => {
        this.academyList1.push({
          id: item.id,
          name: item.name,
        })
      })
    },
    getAllMajor() {
      this.departments.forEach((item) => {
        if (item.id == this.studentVo.academyId) {
          item.children.forEach((item1) => {
            this.majorList1.push({
              id: item1.id,
              name: item1.name,
            })
          })
        }
      })
    },
    getAllClazz() {
      this.departments.forEach((item) => {
        if (item.id == this.studentVo.academyId) {
          item.children.forEach((item1) => {
            if (item1.id == this.studentVo.majorId) {
              item1.children.forEach((item2) => {
                this.clazzList1.push({
                  id: item2.id,
                  name: item2.name,
                })
              })
            }
          })
        }
      })
    },
    getAcademyList() {
      department.getAllAcademy().then((res) => {
        this.academyList = res.data.items
      })
    },
    getMajorList() {
      department.getAllMajor().then((res) => {
        this.majorList = res.data.items
      })
    },
    getClazzList() {
      department.getAllClazz().then((res) => {
        this.clazzList = res.data.items
      })
    },
    getPageStudent(page = 1) {
      this.page = page
      student.getPageStudent(this.page, this.limit, this.studentQuery).then((res) => {
        this.studentList = res.data.records
        this.total = res.data.total
      })
    },
    handleStateChange(item) {
      student.updateStudent(item).then((res) => {
        if (item.disabled == 1) {
          this.$message({
            type: 'success',
            message: '禁用成功',
          })
        } else {
          this.$message({
            type: 'success',
            message: '解锁成功',
          })
        }
      })
    },
    resetData() {
      this.studentQuery = {}
    },
    openUpdateStudentDialog(item) {
      this.showUpdateStudentDialog = true
      this.studentVo = {...item}
      this.getAllMajor()
      this.getAllClazz()
    },
    updateStudent() {
      student.updateStudent(this.studentVo).then((res) => {
        this.$message({
          type: 'success',
          message: '修改成功',
        })
        this.showUpdateStudentDialog = false
        this.getPageStudent()
      })
    },
    deleteStudent(item) {
      this.$confirm('你确定要删除' + `<${item.name}>` + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then((res) => {
          student.deleteStudent(item.id).then((res) => {
            this.$message({
              type: 'success',
              message: '删除成功',
            })
            this.getPageStudent()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
  },
}
</script>