<template>
  <div class="app-container">
    <el-input v-model="filterText" placeholder="过滤" style="margin-bottom:30px;" />

    <!-- <el-button type="primary" size="mini" @click="showDepartmentDialog('add')">添加部门</el-button> -->
    <el-button type="primary" size="mini" @click="showDepartmentDialog('add')">添加</el-button>

    <el-dialog :title="dialogTitle" :visible.sync="showDialog">
      <el-form :model="form">
        <el-form-item label="名称" :label-width="'50px'">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="学院" :label-width="'50px'">
        <el-select
            v-model="form.parentId"
            placeholder="请选择">
            <el-option
            v-for="academy in academyList"
            :key="academy.id"
            :label="academy.name"
            :value="academy.id"/>
        </el-select>
        </el-form-item>
      </el-form>
      
      <div slot="footer" class="dialog-footer">
        <el-button @click="showDialog=false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateItem">确 定</el-button>
      </div>
    </el-dialog>

    <el-tree ref="departmentRef" :data="departments" :props="defaultProps" :filter-node-method="filterNode" class="department-tree" default-expand-all :expand-on-click-node="false" accordion>
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <!-- <el-button v-if="node.parent.parent == null || node.parent.parent.parent == null" 
          type="primary" size="text" @click="showMajorOrCLazzDialog(node, data)">
            <span v-if="node.parent.parent == null">添加专业</span>
            <span v-else>添加班级</span>
          </el-button> -->
          <el-button type="warning" size="text" @click="updateItem(node, data)">
            修改
          </el-button>
          <el-button type="danger" size="text" @click="deleteDepartment(node, data)">
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
      academyList:[],
      filterText: '',
      departments: [],
      defaultProps: {
        children: 'children',
        label: 'name',
      },
      showDialog: false,
      dialogTitle: '添加部门',
      form: {},
      action: '',
    }
  },
  watch: {
    filterText(val) {
      this.$refs.departmentRef.filter(val)
    },
  },
  created() {
    this.getDepartmentTree()
     this.getAcademyList()
    console.log(this.academyList)
  },
  methods: {
    getAcademyList(){
      department.getAllAcademy()
      .then(response=>{
        this.academyList=response.data.items
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    getDepartmentTree() {
      department.getTeacherDepartmentTree().then((res) => {
        this.departments = res.data.items
        // this.$message({
        //   type: 'success',
        //   message: '加载成功!',
        // })
      })
    },
    addOrUpdateItem() {
      if (this.action == 'add') {
        department.addDepartment(this.form).then((res) => {
          this.$message({
            type: 'success',
            message: '添加成功!',
          })
          this.showDialog = false
          this.getDepartmentTree()
        })
      } else if (this.action == 'update') {
        department.updateDepartment(this.form).then((res) => {
          this.$message({
            type: 'success',
            message: '修改成功!',
          })
          this.showDialog = false
          this.getDepartmentTree()
        })
      }
    },
    updateItem(node, data) {
      this.showDepartmentDialog('update', node, data)
    },
    showDepartmentDialog(action, node, data) {
      this.showDialog = true
      this.action = action
      this.form = action == 'update' ? data : {}
    },
    deleteDepartment(node, data) {
      this.$confirm('你确定要删除<' + data.name + '>, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          department.deleteDepartment(data.id).then((res) => {
            this.$message({
              type: 'success',
              message: '删除成功',
            })
            this.getDepartmentTree()
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

