<template>
<el-container>

<el-header>实验室详细信息</el-header>

  <el-main>
    <div class="ccInfo">
      <img :src="laboratory.avatar">
      <div class="main">
        <h2>{{ laboratory.name }}</h2>
        <!-- <p class="gray"><span>共{{ coursePublish.lessonNum }}课时</span></p>
        <p><span>所属分类：{{ coursePublish.subjectLevelOne }} — {{ coursePublish.subjectLevelTwo }}</span></p> -->
        <p>负责老师：{{ laboratory.teacherName }}</p>
        <p>联系电话：{{ laboratory.teacherPhone }}</p>
        <p>位置：{{laboratory.position}}</p>
      </div>
    </div>
  </el-main>

  <div>
      <el-button type="primary" @click="addTeacherDialog=true">添加教师</el-button>
  </div>
  
  <el-container>
    <el-aside width="350px">
        <el-table :data="list"  border style="width: 100%" height="450">
          <el-table-column prop = "teacherName" label="教师名称"></el-table-column>
            <el-table-column
            fixed="right"
            label="操作"
            width="230">
            <template slot-scope="scope">
                <el-button @click="getAchievement(scope.row.teacherId)" type="success" round size="small ">查看贡献</el-button>
                <el-button @click="openAddDialog(scope.row)" type="primary" round size="small ">添加贡献</el-button>
            </template>
            </el-table-column>
        </el-table>
    </el-aside>
    <el-main>
        <el-tag
            type="success"
            effect="dark">
            {{ this.teacherName }}
        </el-tag>
      <el-table :data="teacherAchievementList"  border style="width: 100%" height="450">
          <el-table-column prop = "achievement" label="贡献"></el-table-column>
          <el-table-column prop = "awardTime" label="贡献时间"></el-table-column>
            <el-table-column
            fixed="right"
            label="操作"
            width="150">
            <template slot-scope="scope">
               <el-button @click="openUpdateDialog(scope.row)" type="primary" icon="el-icon-edit" circle></el-button>
               <el-button @click="deleteAchievement(scope.row.id)" type="danger" icon="el-icon-delete" circle></el-button>
            </template>
            </el-table-column>
        </el-table>
    </el-main>
  </el-container>

      <!-- 修改和添加贡献的表单 -->
  <el-dialog title="教师贡献" :visible.sync="dialogFormVisible">
        <el-form :model="achievementFrom">
            <el-form-item label="贡献">
                <el-input type="textarea" 
                :autosize="{ minRows: 2, maxRows: 4}"
                v-model="achievementFrom.achievement" placeholder="填写贡献的内容"></el-input>
            </el-form-item>
            <el-form-item label="贡献时间">
                    <el-date-picker
                    v-model="achievementFrom.awardTime"
                    type="date"
                    placeholder="选择贡献时间"
                    format="yyyy 年 MM 月 dd 日"
                    value-format="yyyy-MM-dd">
                  </el-date-picker>
            </el-form-item>
            <el-form-item label="排序">
                <el-input-number v-model="achievementFrom.sort" :min="0"></el-input-number>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveOrUpdate()">确 定</el-button>
        </div>
 </el-dialog>

<!-- 添加教师的弹框 -->
    <el-dialog title="添加教师" :visible.sync="addTeacherDialog"  :before-close="handleClose">
<!--  -->
        <el-form :model="labTeacherForm" :rules="rules" ref="labTeacherForm">
         <el-form-item label="教师工号">
            <el-input v-model="teacherNumber"></el-input>
            <el-button type="primary" @click="searchTeacher()">点击进行查询</el-button>
         </el-form-item>
            <el-form-item label="教师姓名" >
                <el-input v-model="labTeacherInfo.name" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="加入时间" prop="attendTime">
                    <el-date-picker
                    v-model="labTeacherForm.attendTime"
                    type="date"
                    placeholder="选择加入时间"
                    format="yyyy 年 MM 月 dd 日"
                    value-format="yyyy-MM-dd">
                  </el-date-picker>
            </el-form-item>

        <el-form-item>
            <el-button @click="closeTeacherDialog()">取 消</el-button>
            <el-button type="primary" @click="addTeacher('labTeacherForm')">确 定</el-button>
        </el-form-item>

        </el-form> 

    </el-dialog>


</el-container>
</template>

<script>

import laboratory from '@/api/ucenter/laboratory'
import teacher from '@/api/ucenter/teacher'
  export default {
    data() {
      return {
        dialogFormVisible:false,
        addTeacherDialog:false,
        list:[],
        teacherAchievementList:[],
        laboratory:{},
        labId:'',
        teacherId:'',//刷新教师贡献使用
        teacherName:'',
        achievementFrom:{},//
        labTeacherForm:{
            labId:'',
            teacherId:'',
            attendTime:''
        },
        teacherNumber:'',//教工号
        labTeacherInfo:{},//实验室添加教师时教师信息
         rules: {
          attendTime: [
            {  required: true, message: '请选择加入时间', trigger: 'change' }
          ]
        }
      }
    },
      created(){
          this.init()
    },
    methods:{
        //======添加教师===============
        addTeacher(){
        this.$refs['labTeacherForm'].validate((valid) => {
          if (valid) {
            if(this.labTeacherInfo==null){
                this.$message({
                    type:'error',
                    message:'未选择教师！！'
                })
            }else{
                laboratory.addTeacherForLab(this.labTeacherForm).then((response=>{
                    this.$message({
                        type:'success',
                        message:'添加成功'
                    })
                    this.closeTeacherDialog()
                    this.getList()
                }))
            }

          } else {
            console.log('error submit!!');
            return false;
          }
        });

        },
        searchTeacher(){
            teacher.getTeacherByNumber(this.teacherNumber)
            .then((response=>{
                this.labTeacherInfo=response.data.teacher

                if(this.labTeacherInfo==null){
                     this.$message({
                        message: '未查到该工号的教师信息',
                        type: 'error'
                     });
                     
                }else{
                    console.log(this.labTeacherInfo)
                    this.labTeacherForm.teacherId=this.labTeacherInfo.id

                }
            }))
        },
        closeTeacherDialog(){
            this.addTeacherDialog=false
            this.labTeacherInfo={}
            this.teacherNumber=''
            this.labTeacherForm={}
        },
        handleClose(done) {
           this.labTeacherInfo={}
            this.teacherNumber=''
            this.labTeacherForm={}
            done()
        },
        
        // ===============贡献===============
        openAddDialog(item){
            this.teacherId=item.teacherId
            this.achievementFrom={
                labTeacherId:'',//添加教师贡献使用
                sort:0
            }
            this.dialogFormVisible=true
        },
        saveOrUpdate(){
            if(this.achievementFrom.id){
                this.updateAchievement()
            }else{
                this.addAchievement()
            }
            this.dialogFormVisible=false
        },
        updateAchievement(){
            laboratory.updateLabTeacherDetails(this.achievementFrom)
            .then(()=>{
                this.$message({
                    type:'success',
                    message:'更新成功'
                })
                //刷新
                this.getList()
            })
        },
        addAchievement(){
            //拿到labTeacherId
            laboratory.getLabTeacherId(this.labId,this.teacherId)
            .then((response)=>{
                this.achievementFrom.labTeacherId=response.data.labTeacherId
                //添加
                laboratory.addLabTeacherDetails(this.achievementFrom)
                .then(()=>{
                    this.$message({
                        type:'success',
                        message:'添加成功'
                    })
                    //刷新
                    this.getList()
                })

            })
        },
        deleteAchievement(id){
          this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            })
            .then(()=>{
                laboratory.deleteLabTeacherDetails(id)
                .then(()=>{
                    this.$message({
                        type:'success',
                        message:'删除成功'
                    })
                    //刷新
                    //刷新所有数据
                    this.getList()
                })
            })
            .catch(()=>{
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                })
            })
        },
        openUpdateDialog(item){
            
            this.achievementFrom={...item}
            this.dialogFormVisible=true
        },
        init(){
            if(this.$route.params&&this.$route.params.id){
              this.labId=this.$route.params.id
              this.getList()
              laboratory.getLabById(this.labId)
              .then(response=>{
                  this.laboratory=response.data.laboratory
              })
              this.labTeacherForm.labId=this.labId
            }
        },
        getList(){
            laboratory.getTeacherDetailsByLabId(this.labId)
            .then(response=>{
                this.list=response.data.items
                if(this.teacherId){
                    this.getAchievement(this.teacherId)
                }
            })
        },
        getAchievement(teacherId){
            this.teacherId=teacherId
            for(let i=0;i<this.list.length;i++){
                var teacherVo = this.list[i];
                if(teacherId===teacherVo.teacherId){
                    this.teacherAchievementList=teacherVo.achievementList
                    this.teacherName=teacherVo.teacherName
                }
            }
        }
    }
  };
</script>
  
<style>
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }
  
  .el-aside {
    color: #333;
  }
  .ccInfo {
    background: #6193dd;
    padding: 20px;
    overflow: hidden;
    border: 1px dashed #DDD;
    margin-bottom: 40px;
    position: relative;
}
.ccInfo img {
    background: #d6d6d6;
    width: 300px;
    height: 278px;
    display: block;
    float: left;
    border: none;
}
.ccInfo .main {
    margin-left: 320px;
}

.ccInfo .main h2 {
    font-size: 28px;
    margin-bottom: 30px;
    line-height: 1;
    font-weight: normal;
}
.ccInfo .main p {
    margin-bottom: 10px;
    word-wrap: break-word;
    line-height: 24px;
    max-height: 48px;
    overflow: hidden;
}

.ccInfo .main p {
    margin-bottom: 10px;
    word-wrap: break-word;
    line-height: 24px;
    max-height: 48px;
    overflow: hidden;
}
.ccInfo .main h3 {
    left: 540px;
    bottom: 20px;
    line-height: 1;
    font-size: 28px;
    color: #d32f24;
    font-weight: normal;
    position: absolute;
}
</style>