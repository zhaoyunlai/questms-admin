<template>
  <div class="app-container">
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="实验室名称">
        <el-input v-model="laboratoryQuery.name" placeholder="实验室名称" />
      </el-form-item>

      <el-form-item label="负责老师姓名">
        <el-input v-model="laboratoryQuery.teacherName" placeholder="负责老师姓名" style="width:150px;"/>
      </el-form-item>

      <el-form-item label="学院">
        <el-select v-model="laboratoryQuery.parentId" placeholder="请选择学院" style="width: 200px;">
          <div v-for="(item, index) in academyList" :key="index">
            <el-option :label="item.name" :value="item.id"></el-option>
          </div>
        </el-select>
      </el-form-item>

      <el-form-item label="添加时间">
        <el-date-picker
          v-model="laboratoryQuery.begin"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="laboratoryQuery.end"
          type="datetime"
          placeholder="选择截止时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>



      <el-button type="primary" icon="el-icon-search" @click="getList()">查询</el-button>
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>
    <!-- 表格 -->
    <el-table :data="list" element-loading-text="数据加载中" border fit highlight-current-row>

      <el-table-column label="序号" width="70" align="center">
        <template slot-scope="scope">
          <!-- 获取序号的一种算法 -->
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="name" label="实验室名称"  align="center" />

      <el-table-column prop="departmentName" label="学院"  align="center" />

       <el-table-column prop="position" label="实验室位置"  align="center" />

      <el-table-column prop="teacherName" label="负责老师"  align="center" />

      <el-table-column prop="teacherPhone" label="负责老师电话" align="center" />

      <!-- <el-table-column prop="createTime" label="添加时间" width="200" align="center" /> -->


      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <router-link :to="'/department/laboratory/info/'+scope.row.id">
            <el-button type="primary" size="mini">查看</el-button>
          </router-link>
          <router-link :to="'/department/laboratory/edit/'+scope.row.id">
            <el-button type="primary" size="mini">修改</el-button>
          </router-link>
          <el-button type="danger" size="mini" @click="deleteData(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination :current-page="page" :page-size="limit" :total="total" style="padding: 30px 0; text-align: center;" layout="total, prev, pager, next, jumper" 
    @current-change="getList()" />

  </div>
</template>

<script>
import laboratory from '@/api/ucenter/laboratory'
import department from '@/api/ucenter/department'
export default {
    data(){
        return{
            list:null,
            laboratoryQuery:{},
            page:1,
            limit:10,
            total:0,
            academyList:[],//学院列表

        }
    },
    created(){
      this.getAcademyList()
      this.getList()
    },
    methods:{
      deleteData(item){
        this.$confirm('你确定要删除' + `<${item.name}>` + ', 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        .then(()=>{
          laboratory.deleteLaboratory(item.id)
          .then(()=>{
            this.$message({
              type:'success',
              message:'删除成功'
            })
            this.getList()
          })
        })
        .catch(()=>{
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
      },
      resetData(){
        this.laboratoryQuery={}
        this.getList()
      },
        getList(page=1){
            laboratory.getPageLab(this.page,this.limit,this.laboratoryQuery)
            .then(response=>{
              this.total=response.data.total
              this.list=response.data.items
            })
        },
        getAcademyList(){
          department.getAllAcademy()
          .then(response=>{
            this.academyList=response.data.items
          })
        }
    }
}
</script>