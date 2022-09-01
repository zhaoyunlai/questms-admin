<template>
  <div class="app-container">
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="teacherQuery.name" placeholder="教师名" />
      </el-form-item>

      <el-form-item>
        <el-input v-model="teacherQuery.number" placeholder="教工号" />
      </el-form-item>

      <el-form-item>
        <el-input v-model="teacherQuery.phone" placeholder="电话" />
      </el-form-item>

      <el-form-item label="部门">
        <el-select v-model="teacherQuery.departmentId" placeholder="请选择部门" style="width: 200px;">
          <div v-for="(item, index) in departments" :key="index">
            <el-option :label="item.name" :value="item.id"></el-option>
          </div>
        </el-select>
      </el-form-item>

      <el-form-item label="状态">
        <el-select style="width: 100px;" v-model="teacherQuery.disabled" placeholder="状态">
          <el-option label="启用" :value="0"></el-option>
          <el-option label="禁用" :value="1"></el-option>
        </el-select>
      </el-form-item>

      <el-button type="primary" icon="el-icon-search" @click="getPageTeacher()">查询</el-button>
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>


    <!-- 表格 -->
    <el-table :data="teacherList" element-loading-text="数据加载中" border fit highlight-current-row>

      <el-table-column label="序号" width="70" align="center">
        <template slot-scope="scope">
          <!-- 获取序号的一种算法 -->
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="name" label="姓名" width="80" align="center" />

      <el-table-column prop="number" label="教工号" width="140" align="center" />

      <el-table-column prop="academyName" label="学院" width="160" align="center" />

      <el-table-column prop="departmentName" label="部门" width="160" align="center" />

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
          <el-button type="primary" size="mini" @click="openUpdateTeacherDialog(scope.row)">修改</el-button>
          <el-button type="danger" size="mini" @click="deleteTeacher(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 修改教师信息 -->
    <el-dialog title="修改教师信息" :visible.sync="showUpdateTeacherDialog">
      <el-form :model="teacherVo">
        <el-form-item label="名字" :label-width="'100px'">
          <el-input v-model="teacherVo.name" placeholder="教师名" />
        </el-form-item>
        <el-form-item label="教工号" :label-width="'100px'">
          <el-input v-model="teacherVo.number" placeholder="教工号" />
        </el-form-item>
        <el-form-item label="部门" prop="department" :label-width="'100px'">
          <el-select v-model="teacherVo.departmentId" placeholder="请选择部门">
            <div v-for="(item, index) in departments" :key="index">
              <el-option :label="item.name" :value="item.id"></el-option>
            </div>
          </el-select>
        </el-form-item>
        <el-form-item label="电话" :label-width="'100px'">
          <el-input v-model="teacherVo.phone" placeholder="电话" />
        </el-form-item>
        <el-form-item label="QQ" :label-width="'100px'">
          <el-input v-model="teacherVo.qq" placeholder="QQ" />
        </el-form-item>
        <el-form-item label="邮箱" :label-width="'100px'">
          <el-input v-model="teacherVo.email" placeholder="邮箱" />
        </el-form-item>
        <el-form-item label="密码" :label-width="'100px'">
          <el-input v-model="teacherVo.password" placeholder="不填写则不修改" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelUpdate">取 消</el-button>
        <el-button type="primary" @click="updateTeacher">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分页 -->
    <el-pagination :current-page="page" :page-size="limit" :total="total" style="padding: 30px 0; text-align: center;" layout="total, prev, pager, next, jumper" @current-change="getPageTeacher" />

  </div>
</template>

<script>
import teacher from '@/api/ucenter/teacher.js'
import department from '@/api/ucenter/department.js'
export default {

  data() {
    // 定义变量和初始值
    return {
      value: 1,
      teacherVo:{},
      teacherList: [], // 查询村之后接口返回集合
      id: 0,
      total: 0, // 总记录数
      page: 1, // 当前页
      limit: 10, // 每页记录数
      teacherQuery: {
      }, 
      showUpdateTeacherDialog: false,
      departments: []
    }
  },
  created() {
      this.getPageTeacher()
      this.getAllDepartMents()
  },
  methods: {
      //得到所有部门的信息
      getAllDepartMents(){
          department.getAllDepartment()
          .then(response=>{
              this.departments=response.data.items
          })
      },
    //分页查询
    getPageTeacher(page = 1) {
      this.page = page
      teacher.pageTeacher(this.page, this.limit, this.teacherQuery).then((res) => {
        this.teacherList = res.data.records
        this.total = res.data.total
        console.log(res.data.records)
      })
    },

    //清空查询表单
     resetData(page=1) {
      this.teacherQuery = {}
      this.getPageTeacher(page=1)
    },

    //修改禁用与启用状态
    handleStateChange(item) {
      teacher.updateTeacher(item).then((res) => {
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

   //弹框出现
    openUpdateTeacherDialog(item) {
      this.showUpdateTeacherDialog = true
      this.teacherVo = {...item}
    },
    // //根据id查询教师
    // getTeacherById(id){
    //     teacher.getTeacherById(id)
    //     .then(response=>{
    //         this.teacherVo=response.data.teacher
    //     })
    // },

    //取消修改
    cancelUpdate(){
        this.showUpdateTeacherDialog = false
    },
    //修改
    updateTeacher() {
      teacher.updateTeacher(this.teacherVo).then((res) => {
        this.$message({
          type: 'success',
          message: '修改成功',
        })
        this.showUpdateTeacherDialog = false
        this.getPageTeacher()
      })
    },
    //删除
    deleteTeacher(item) {
      this.$confirm('你确定要删除' + `<${item.name}>` + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then((res) => {
          teacher.deleteTeacher(item.id).then((res) => {
            this.$message({
              type: 'success',
              message: '删除教师成功',
            })
            this.getPageTeacher()
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