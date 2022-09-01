<template>
  <div class="app-container">
    <el-input v-model="filterText" placeholder="过滤" style="margin-bottom:30px;" />

    <el-button type="primary" size="mini" @click="showAcademyDialog">添加学院</el-button>
    <el-dialog :title="dialogTitle" :visible.sync="showDialog">
      <el-form :model="form">
        <el-form-item label="名称" :label-width="'50px'">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateItem">确 定</el-button>
      </div>
    </el-dialog>

    <el-tree ref="departmentRef" 
    :data="departments" :props="defaultProps" 
    :filter-node-method="filterNode" 
    class="department-tree" default-expand-all 
    :expand-on-click-node="false"
    accordion>
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button v-if="node.parent.parent == null || node.parent.parent.parent == null" 
          type="primary" size="text" @click="showMajorOrCLazzDialog(node, data)">
            <span v-if="node.parent.parent == null">添加专业</span>
            <span v-else>添加班级</span>
          </el-button>
          <el-button type="warning" size="text" @click="updateItem(node, data)">
            修改
          </el-button>
          <el-button type="danger" size="text" @click="showDeleteWarnning(node, data)">
            删除
          </el-button>
        </span>
      </span>
    </el-tree>

  </div>
</template>

<script>
import department from '@/api/ucenter/department'
export default {
  data() {
    return {
      filterText: '',
      departments: [],
      defaultProps: {
        children: 'children',
        label: 'name',
      },
      showDialog: false,
      dialogTitle: '',
      form: {},
      type: '',
      action: '',
    }
  },
  watch: {
    filterText(val) {
      this.$refs.departmentRef.filter(val)
    },
  },
  created() {
    this.getStudentDepartmentTree()
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    getStudentDepartmentTree() {
      department.getStudentDepartmentTree().then((res) => {
        this.departments = res.data.items
        //  this.$message({
        //   type: 'success',
        //   message: '加载成功!',
        // })
      })
    },
    closeDialog() {
      this.dialogTitle = ''
      this.showDialog = false
      this.form = {}
      this.type = ''
      this.action = ''
    },
    addOrUpdateItem() {
      if (this.action == 'update') {
        if (this.type === 'academy') {
          this.updateAcademy()
        } else if (this.type === 'major') {
          this.updateMajor()
        } else if (this.type === 'clazz') {
          this.updateClazz()
        }
      } else {
        if (this.type === 'academy') {
          this.addAcademy()
        } else if (this.type === 'major') {
          this.addMajor()
        } else if (this.type === 'clazz') {
          this.addClazz()
        }
      }
    },
    updateItem(node, data) {
      this.action = 'update'
      if (node.parent.parent == null) {
        // 一级部门-学院
        this.showAcademyDialog(data)
      } else if (node.parent.parent.parent == null) {
        // 二级部门-专业
        this.showMajorDialog(node.parent.data, data)
      } else if (node.parent.parent.parent.parent == null) {
        // 三级部门-班级
        this.showClazzDialog(node.parent.parent.data, node.parent.data, data)
      }
    },
    showMajorOrCLazzDialog(node, data) {
      if (node.parent.parent == null) {
        // 一级部门
        this.showMajorDialog(data)
      } else if (node.parent.parent.parent == null) {
        // 二级部门
        this.showClazzDialog(node.parent.data, data)
      }
    },
    showDeleteWarnning(node, data) {
      this.$confirm('你确定要删除<' + data.name + '>, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          if (node.parent.parent == null) {
            // 一级部门-学院
            this.deleteAcademy(data)
          } else if (node.parent.parent.parent == null) {
            // 二级部门-专业
            this.deleteMajor(data)
          } else if (node.parent.parent.parent.parent == null) {
            // 三级部门-班级
            this.deleteClazz(data)
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    // 学院
    showAcademyDialog(data) {
      this.dialogTitle = '添加学院'
      this.showDialog = true
      this.type = 'academy'
      this.form.name = data == null ? '' : data.name
      this.form.id = data == null? '': data.id
    },
    addAcademy() {
      department.addAcademy(this.form).then((res) => {
        this.getStudentDepartmentTree()
        this.closeDialog()
        this.$message({
          type: 'success',
          message: '添加成功!',
        })
      })
    },
    deleteAcademy(data) {
      department.deleteAcademy(data.id).then((res) => {
        this.$message({
          type: 'success',
          message: '删除成功!',
        })
        this.getStudentDepartmentTree()
      })
    },
    updateAcademy() {
      department.updateAcademy(this.form).then((res) => {
        this.getStudentDepartmentTree()
        this.closeDialog()
        this.$message({
          type: 'success',
          message: '修改成功!',
        })
      })
    },
    // 专业
    showMajorDialog(academy, data) {
      this.dialogTitle = '添加专业'
      this.showDialog = true
      this.type = 'major'
      this.form.academyId = academy.id
      this.form.name = data == null ? '' : data.name
      this.form.id = data == null? '': data.id
    },
    addMajor() {
      department.addMajor(this.form).then((res) => {
        this.getStudentDepartmentTree()
        this.closeDialog()
        this.$message({
          type: 'success',
          message: '添加成功!',
        })
      })
    },
    deleteMajor(data) {
      department.deleteMajor(data.id).then((res) => {
        this.$message({
          type: 'success',
          message: '删除成功!',
        })
        this.getStudentDepartmentTree()
      })
    },
    updateMajor() {
      department.updateMajor(this.form).then((res) => {
        this.getStudentDepartmentTree()
        this.closeDialog()
        this.$message({
          type: 'success',
          message: '修改成功!',
        })
      })
    },
    // 班级
    showClazzDialog(academy, major, data) {
      this.dialogTitle = '添加班级'
      this.showDialog = true
      this.type = 'clazz'
      this.form.academyId = academy.id
      this.form.majorId = major.id
      this.form.name = data == null ? '' : data.name
      this.form.id = data == null? '': data.id
    },
    addClazz() {
      department.addClazz(this.form).then((res) => {
        this.getStudentDepartmentTree()
        this.closeDialog()
        this.$message({
          type: 'success',
          message: '添加成功!',
        })
      })
    },
    deleteClazz(data) {
      department.deleteClazz(data.id).then((res) => {
        this.$message({
          type: 'success',
          message: '删除成功!',
        })
        this.getStudentDepartmentTree()
      })
    },
    updateClazz() {
      department.updateClazz(this.form).then((res) => {
        this.getStudentDepartmentTree()
        this.closeDialog()
        this.$message({
          type: 'success',
          message: '修改成功!',
        })
      })
    }
  },
}
</script>

