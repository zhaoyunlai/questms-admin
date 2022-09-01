<template>
  <div class="app-container">
    <!--查询表单-->
    <!-- <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="studentQuery.name" placeholder="学生名" />
      </el-form-item>

      <el-form-item>
        <el-select v-model="studentQuery.level" clearable placeholder="讲师头衔">
          <el-option :value="1" label="高级讲师" />
          <el-option :value="2" label="首席讲师" />
        </el-select>
      </el-form-item>

      <el-form-item label="添加时间">
        <el-date-picker v-model="studentQuery.begin" type="datetime" placeholder="选择开始时间" value-format="yyyy-MM-dd HH:mm:ss" default-time="00:00:00" />
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="studentQuery.end" type="datetime" placeholder="选择截止时间" value-format="yyyy-MM-dd HH:mm:ss" default-time="00:00:00" />
      </el-form-item>

      <el-button type="primary" icon="el-icon-search" @click="getList()">查询</el-button>
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form> -->
    <!-- 表格 -->
    <el-table :data="recordList" element-loading-text="数据加载中" border fit highlight-current-row>

      <el-table-column label="序号" width="70" align="center">
        <template slot-scope="scope">
          <!-- 获取序号的一种算法 -->
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="deviceLabel" label="设备标签" width="100" align="center" />

      <el-table-column prop="userName" label="借用人" width="100" align="center" />

      <el-table-column prop="userNumber" label="学号/工号" width="120" align="center" />

      <el-table-column prop="userPhone" label="电话" width="120" align="center" />

      <el-table-column prop="departmentName" label="借用部门" width="120" align="center" />

      <el-table-column prop="startTime" label="开始时间" width="160" align="center" />

      <el-table-column prop="endTime" label="结束时间" width="160" align="center" />

      <el-table-column prop="realEndTime" label="归还时间" width="160" align="center">
        <template slot-scope="scope">
          {{scope.row.realEndTime}}
          <el-tag type="danger" v-if="isOverdue(scope.row)">超时</el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="purpose" label="用途" width="200" align="center" />

      <el-table-column label="归还描述" align="center" width="200">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="scope.row.description" placement="bottom">
            <div style="height: 40px; overflow: hidden;">{{scope.row.description}}</div>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="openImage(scope.row)">查看图片</el-button>
          <el-button v-if="scope.row.state != 2" type="primary" size="mini">{{scope.row.disabled == 1? '点击同意': '借用中'}}</el-button>
          <el-button v-else type="success" disabled size="mini">操作完成</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="查看图片" :visible.sync="showImage" width="60%">
      <el-form :model="currentRecord" style="display: flex;">
        <el-form-item label="借用时照片" :label-width="'100px'" v-if="currentRecord.startImg==null||currentRecord.startImg==''">
          <img style="width: 400px; height: 400px;" src="/static/images/notupload.png">
        </el-form-item>
       <el-form-item label="借用时照片" :label-width="'100px'" v-else>
          <img style="width: 400px; height: 400px;" :src="currentRecord.startImg">
        </el-form-item>
        <el-form-item label="归还时照片" :label-width="'100px'" v-if="currentRecord.endImg==null||currentRecord.endImg==''">
          <img style="width: 400px; height: 400px;" src="/static/images/notupload.png">
        </el-form-item>
        <el-form-item label="归还时照片" :label-width="'100px'" v-else>
          <img style="width: 400px; height: 400px;" :src="currentRecord.endImg">
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 分页 -->
    <el-pagination :current-page="page" :page-size="limit" :total="total" style="padding: 30px 0; text-align: center;" layout="total, prev, pager, next, jumper" @current-change="getPageRecord" />

  </div>
</template>

<script>
import device from '@/api/device/device.js'
export default {
  // 写核心代码的位置
  // data: {

  // },
  data() {
    // 定义变量和初始值
    return {
      value: 1,
      recordList: [], // 查询村之后接口返回集合
      id: 0,
      total: 0, // 总记录数
      page: 1, // 当前页
      limit: 10, // 每页记录数
      showImage: false,
      currentRecord: {},
      recordQuery: {}, // 条件封装对象
    }
  },
  created() {
    // 页面渲染之前执行，一般调用methods定义的方法
    // 调用
    this.getPageRecord()
  },
  methods: {
    getPageRecord(page = 1) {
      page = this.page
      device.getPageRecord(page, this.limit).then((res) => {
        this.recordList = res.data.records
        this.total = res.data.total
        // console.log(this.recordList)
      })
    },
    resetData() {
      this.studentQuery = {}
      this.getPageRecord()
    },
    removeDataById(id) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          return teacher.deleteTeacher(id)
        })
        .then(() => {
          this.getPageRecord()
          this.$message({
            type: 'success',
            message: '删除成功!',
          })
        })
        .catch((response) => {
          // 失败
          if (response === 'cancel') {
            this.$message({
              type: 'info',
              message: '已取消删除',
            })
          } else {
            this.$message({
              type: 'error',
              message: '删除失败',
            })
          }
        })
    },
    isOverdue(item) {
      if (item.state == 2) {
              let endTime = new Date(item.endTime.replace(new RegExp(/-/gm), '/')).getTime()
      let realEndTime = new Date(item.realEndTime.replace(new RegExp(/-/gm), '/')).getTime()
      if (endTime >= realEndTime) {
        return false
      }
      return true
      }
      return false

    },
    openImage(item) {
      this.currentRecord = item
      this.showImage = true
    },
  },
}
</script>