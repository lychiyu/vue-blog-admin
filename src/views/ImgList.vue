<template>
  <section class="post-list">
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px; padding-top: 20px">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-button type="primary" @click="handleUpload">上传图片</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table :data="imgs" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
      <el-table-column type="selection">
      </el-table-column>
      <el-table-column type="index">
      </el-table-column>
      <el-table-column prop="url" label="图片">
        <template slot-scope="scope">
          <img :src="scope.row.url" alt="" style="width: 100px; height: 100px">
        </template>
      </el-table-column>
      <el-table-column prop="type" label="类别" :formatter="formatImgType" sortable>
      </el-table-column>
      <el-table-column prop="create_time" label="添加时间" :formatter="formatDate" sortable>
      </el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--编辑界面-->
    <el-dialog title="编辑" :visible="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="类别" prop="type">
          <el-select v-model="editForm.type" placeholder="请选择活动区域" auto-complete="off">
            <el-option label="文章列表大图" :value="1"></el-option>
            <el-option label="文章列表小图" :value="2"></el-option>
            <el-option label="文章内容插图" :value="3"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>
    <!--上传界面-->
    <el-dialog title="上传图片" :visible="uploadFormVisible" :close-on-click-modal="false">
      <el-form :model="uploadForm" label-width="80px" :rules="uploadFormRules" ref="uploadForm">
        <el-form-item label="类别" prop="name">
          <el-select v-model="uploadForm.type" placeholder="请选择活动区域" auto-complete="off">
            <el-option label="文章列表大图" :value="1"></el-option>
            <el-option label="文章列表小图" :value="2"></el-option>
            <el-option label="文章内容插图" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图片" prop="file">
          <el-upload
            class="upload-img"
            :auto-upload="false"
            action=" "
            drag
            :before-upload="beforeUpload"
            multiple
            list-type="picture"
            ref="uploadElm">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="uploadFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="uploadSubmit" :loading="uploadLoading">上传</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import {imgList, editImg, upload} from '../api/apis'
import {formatDate, formatImgType} from "../utils"

export default {
  data () {
    return {
      filters: {
        name: ''
      },
      imgs: [],
      total: 0,
      page: 1,
      listLoading: false,
      sels: [], // 列表选中列
      editFormVisible: false, // 编辑界面是否显示
      editLoading: false,
      editFormRules: {
        name: [
          { required: true, message: '请输入标签名', trigger: 'blur' }
        ]
      },
      // 编辑界面数据
      editForm: {
        id: 0,
        type: ''
      },
      uploadFormVisible: false, // 新增界面是否显示
      uploadLoading: false,
      uploadFormRules: {
        name: [
          { required: true, message: '请输入标签名', trigger: 'blur' }
        ]
      },
      // 新增界面数据
      uploadForm: {
        type: 3,
        file: ''
      }
    }
  },
  methods: {
    formatDate (row, column, cellValue, index) {
      return formatDate(cellValue)
    },
    formatImgType (row, column, cellValue, index) {
      return formatImgType(cellValue)
    },
    getImgs () {
      imgList().then(res => {
        this.imgs = res.data.results
        // this.
      }).catch(err => {
        console.log(err)
      })
    },
    handleEdit (index, row) {
      this.editFormVisible = true
      this.editForm = Object.assign({}, row)
    },
    editSubmit () {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.editLoading = true
            let params = Object.assign({}, this.editForm)
            editImg(params.id, {type: params.type}).then((res) => {
              this.editLoading = false
              this.$message({
                message: '提交成功',
                type: 'success'
              })
              this.$refs['editForm'].resetFields()
              this.editFormVisible = false
              this.getImgs()
            }).catch(err => {
              console.log(err)
            })
          })
        }
      })
    },
    handleUpload () {
      this.uploadFormVisible = true
      this.uploadForm = {
        type: 3,
        file: ''
      }
    },
    beforeUpload (file) {
      console.log(file)
      let fd = new FormData()
      fd.append('file', file)
      fd.append('type', this.uploadForm.type)
      upload(fd).then(res => {
        let url = res.data.url
        this.$prompt('图片url', '上传成功', {
          confirmButtonText: '确定',
          inputValue: url
        })
        this.uploadFormVisible = false
        this.getImgs()
      }).catch(err => {
        console.log(err)
      })
      return true
    },
    uploadSubmit () {
      this.$refs.uploadElm.submit()
    }
  },
  mounted () {
    this.getImgs()
  }
}

</script>

<style lang="stylus" scoped>
</style>
