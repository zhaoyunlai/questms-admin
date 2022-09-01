<template>
  <div class="app-container">
    <el-form ref="ruleForm" :rules="rules" :model="addDeviceVo" label-width="120px">
      <el-form-item label="设备种类" prop="type">
        <el-select v-model="addDeviceVo.type" placeholder="请选择设备种类">
          <div v-for="(item, index) in typeList" :key="index">
            <el-option :label="item.name" :value="item.id"></el-option>
          </div>
        </el-select>
      </el-form-item>
      
      <el-form-item label="所属实验室" prop="labId">

          <el-select v-model="academyId" placeholder="请选择学院"  @change="labLevelChange">
            <el-option
              v-for="item in academyList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>

          <el-select v-model="addDeviceVo.labId" placeholder="请选择实验室">
            <el-option
              v-for="item in labList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
      </el-form-item>
      <el-form-item label="最大借用时间(小时）" prop="maxUseTime" style="width: 300px;">
        <el-input v-model="addDeviceVo.maxUseTime" placeholder="最大借用时间(小时）"></el-input>
      </el-form-item>
      <el-form-item label="总量" prop="total" style="width: 300px;">
        <el-input v-model="addDeviceVo.total" placeholder="总量"></el-input>
      </el-form-item>
      <el-form-item label="批次" prop="batch" style="width: 300px;">
        <el-input v-model="addDeviceVo.batch" placeholder="批次"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import device from '@/api/device/device.js'
import laboratory from '@/api/ucenter/laboratory'
import department from '@/api/ucenter/department'
export default {
  data() {
    return {
      addDeviceVo: {
        labId:''
      },
      rules: {
        type: { required: true, message: '请选择设备类型', trigger: 'blur'},
        labId: { required: true, message: '请选择实验室', trigger: 'blur'},
        maxUseTime: { required: true, message: '请输入最大借用时间(小时）', trigger: 'blur' },
        total: { required: true, message: '请输入总量', trigger: 'blur' },
      },
      typeList: [],
      allLabList:[],
      labList:[],
      academyList:[],
      academyId:''
    }
  },
  created() {
    this.getAllDeviceType()
    this.getAllLaboratory()
    this.getAllAcademy()
  },
  methods: {
    labLevelChange(value){

      this.labList=[]
      this.addDeviceVo.labId=''
      for(let i=0;i<this.allLabList.length;i++){
        var lab = this.allLabList[i]
        if(lab.parentId===value){
          this.labList.push(lab)
          
        }
      }
      
    },
    getAllAcademy(){
      department.getAllAcademy().then((response=>{
        this.academyList=response.data.items
      }))
    },
    getAllLaboratory(){

      laboratory.getAllLab().then((response=>{
        this.allLabList=response.data.records
      }))
    },
    getAllDeviceType() {
      device.getAllDeviceType().then((res) => {
        this.typeList = res.data.items
        // console.log(this.typeList)
      })
    },
    addDeviceInfo() {
      device.addDeviceInfo(this.addDeviceVo).then((res) => {
        this.$message({
          type: 'success',
          message: '添加成功!',
        })
        this.$router.push({ path: '/device/list' })
      })
    },
    onSubmit() {
      this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            this.addDeviceInfo()
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