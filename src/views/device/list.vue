<template>
  <div class="app-container">
    <!--查询表单-->
    <!-- <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-select v-model="deviceQuery.type" clearable placeholder="设备种类">
          <div v-for="(item, index) in typeList" :key="index">
            <el-option :value="item.id" :label="item.name" />
          </div>
        </el-select>
      </el-form-item>
    </el-form> -->
    <el-button type="default" @click="showDialog = true">添加设备类型</el-button>
    <el-dialog title="添加设备类型" :visible.sync="showDialog">
      <el-form :model="form">
        <el-form-item label="名称" :label-width="'50px'">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="addDeviceType">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 表格 -->
    <el-tabs closable v-model="activeName" tab-position="top" style="height: 200px;" @tab-click="tabClick" @tab-remove="removeDeviceType">
      <div v-for="(item, index) in typeList" :key="index">
        <el-tab-pane :name="item.id" :label="item.name + `(${item.total})`">
          <el-table :data="deviceList" element-loading-text="数据加载中" border fit highlight-current-row>
            <el-table-column label="序号" width="70" align="center">
              <template slot-scope="scope">
                <!-- 获取序号的一种算法 -->
                {{ (page - 1) * limit + scope.$index + 1 }}
              </template>
            </el-table-column>

            <el-table-column prop="typeName" label="设备种类" width="140" align="center" />

            <el-table-column prop="labName" label="所属实验室" width="140" align="center" />

            <el-table-column prop="label" label="设备标签" width="160" align="center" />

            <el-table-column prop="maxUseTime" label="最大借用时间(小时）" width="120" align="center" />

            <el-table-column prop="batch" label="批次" width="100" align="center" />

            <el-table-column label="状态" width="120" align="center">
              <template slot-scope="scope">
                <el-switch v-model="scope.row.disabled" active-color="#13ce66" inactive-color="#ff4949" :active-value="0" :inactive-value="1" @change="handleStateChange(scope.row)">
                </el-switch>
              </template>
            </el-table-column>

            <el-table-column label="二维码" width="120" align="center">
              <template slot-scope="scope">
                <el-button type="default" size="mini" @click="genQrCode(scope.row)">生成二维码</el-button>
              </template>
            </el-table-column>

            <el-table-column label="操作" width="200" align="center">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="openUpdateDeviceDialog(scope.row)">修改</el-button>
                <el-button type="danger" size="mini" @click="deleteDeviceInfo(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </div>
      <!-- 二维码 -->
      <el-dialog title="二维码" :visible.sync="showQrCodeDialog" width="350px">
        <img :src="qrCodeImg" alt="图片未加载">
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeQrDialog">关闭</el-button>
          <el-button type="primary" @click="downloadQrcode">下载</el-button>
        </div>
      </el-dialog>

      <!-- 分页 -->
      <el-pagination :current-page="page" :page-size="limit" :total="total" style="padding: 30px 0; text-align: center;" layout="total, prev, pager, next, jumper" @current-change="getPageDeviceInfo" />
    </el-tabs>

          <!-- 修改设备 -->
      <el-dialog title="修改设备信息" :visible.sync="showUpdateDeviceDialog">
        <el-form :model="deviceInfoVo">
          <el-form-item label="设备种类" :label-width="'100px'">
            <el-select v-model="deviceInfoVo.type" clearable placeholder="设备种类">
              <div v-for="(item, index) in typeList" :key="index">
                <el-option :value="item.id" :label="item.name" />
              </div>
            </el-select>
          </el-form-item>
          <el-form-item label="设备标签" :label-width="'100px'">
            <el-input v-model="deviceInfoVo.label" placeholder="设备标签"></el-input>
          </el-form-item>
          <el-form-item label="最大借用时间(小时）" :label-width="'100px'">
            <el-input v-model="deviceInfoVo.maxUseTime" placeholder="最大借用时间(小时）"></el-input>
          </el-form-item>
          <!-- <el-form-item label="批次" :label-width="'100px'">
            <el-input v-model="deviceInfoVo.batch" placeholder="批次"></el-input>
          </el-form-item> -->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="showUpdateDeviceDialog = false">取 消</el-button>
          <el-button type="primary" @click="updateDeviceInfo">确 定</el-button>
        </div>
      </el-dialog>


  </div>
</template>

<script>
import device from '@/api/device/device.js'
export default {
  data() {
    // 定义变量和初始值
    return {
      showQrCodeDialog: false,
      qrCodeImg: '',
      qrCodeLabel: '',
      form: {},
      showDialog: false,
      showUpdateDeviceDialog: false,
      deviceInfoVo: {},
      activeName: '0',
      value: 1,
      deviceList: [], // 查询村之后接口返回集合
      id: 0,
      total: 0, // 总记录数
      page: 1, // 当前页
      limit: 10, // 每页记录数
      deviceQuery: {}, // 条件封装对象
      typeList: [],
    }
  },
  created() {
    // 页面渲染之前执行，一般调用methods定义的方法
    // 调用
    this.getAllDeviceType()
    this.getPageDeviceInfo()
  },
  methods: {
    tabClick(item) {
      this.deviceQuery.type = item.name == 0 ? '' : item.name
      this.getPageDeviceInfo()
    },
    addDeviceType() {
      device.addDeviceType(this.form).then((res) => {
        this.$message({
          type: 'success',
          message: '添加标签成功',
        })
        this.closeDialog()
        this.getAllDeviceType()
      })
    },
    closeDialog() {
      this.form = {}
      this.showDialog = false
    },
    removeDeviceType(typeId) {
      this.$confirm('关于这条设备其他信息也会被删除，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then((res) => {
          device.deleteDeviceType(typeId).then((ress) => {
            this.$message({
              type: 'success',
              message: '删除标签成功',
            })
            this.getAllDeviceType()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    deleteDeviceInfo(item) {
      this.$confirm('你确定要删除' + `<${item.label}>` + '(关于该设备的借用记录也会被删除), 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then((res) => {
          device.deleteDeviceInfo(item.id).then((res) => {
            this.$message({
              type: 'success',
              message: '删除设备成功',
            })
            this.getPageDeviceInfo()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    openUpdateDeviceDialog(item) {
      this.deviceInfoVo = {...item}
      this.showUpdateDeviceDialog = true
    },
    updateDeviceInfo() {
      device.updateDeviceInfo(this.deviceInfoVo).then((res) => {
        this.$message({
          type: 'success',
          message: '更新成功',
        })
      })
      this.showUpdateDeviceDialog = false
      this.getPageDeviceInfo()
    },   
    getPageDeviceInfo(page = 1) {
      this.page = page
      device.getPageDeviceInfo(this.page, this.limit, this.deviceQuery).then((res) => {
        this.total = res.data.total
        this.deviceList = res.data.records
        // console.log(this.deviceList)
      })
    },
    getAllDeviceType() {
      this.typeList = []
      let allDevice = {
        id: '0',
        name: '全部',
        total: 0,
      }
      this.typeList.push(allDevice)
      device.getAllDeviceType().then((res) => {
        res.data.items.forEach((item) => {
          allDevice.total += item.total
          this.typeList.push(item)
        })
      })
    },
    handleStateChange(item) {
      device.updateDeviceInfo(item).then((res) => {
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
    genQrCode(item) {
      this.showQrCodeDialog = true
      this.qrCodeImg = ''
      this.qrCodeLabel = item.label
      console.log(this.qrCodeLabel)
      device.genQrCode(item.id).then((res) => {
        this.qrCodeImg = res.data.qrCode
      })
    },
    closeQrDialog() {
      this.showQrCodeDialog = false
      this.qrCode = ''
    },
    downloadQrcode() {
      let a = document.createElement("a");
        a.href = this.qrCodeImg;
        a.setAttribute("download", this.qrCodeLabel);
        a.click();
        this.showQrCodeDialog = false
    },
  },
}
</script>