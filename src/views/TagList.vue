<template>
  <section class="post-list">
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px; padding-top: 20px">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table :data="tags" highlight-current-row v-loading="listLoading" style="width: 100%;">
      <el-table-column type="selection">
      </el-table-column>
      <el-table-column type="index">
      </el-table-column>
      <el-table-column prop="name" label="标签名">
      </el-table-column>
      <el-table-column prop="states" label="状态" :formatter="formatStates" sortable>
      </el-table-column>
      <el-table-column prop="create_time" label="添加时间" :formatter="formatDate" sortable>
      </el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button :type="scope.row.states === 1 ? 'danger' : 'success'" size="small" @click="handleDel(scope.$index, scope.row)">{{scope.row.states === 1 ? '删除' : '恢复'}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <div v-if="this.tags.length" align="center" style="margin-top: 20px">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="limit"
        layout="total, sizes, prev, pager, next"
        :total="total">
      </el-pagination>
    </div>
    <!--编辑界面-->
    <el-dialog title="编辑" :visible="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="标签名" prop="name">
          <el-input v-model="editForm.name" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>
    <!--新增界面-->
    <el-dialog title="新增" :visible="addFormVisible" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
        <el-form-item label="标签名" prop="name">
          <el-input v-model="addForm.name" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import {tag, delTag, editTag, addTag} from '../api/apis'
import {formatDate, formatStates} from '../utils'

export default {
  data () {
    return {
      currStates: 1,
      filters: {
        name: ''
      },
      tags: [],
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
        name: ''
      },
      addFormVisible: false, // 新增界面是否显示
      addLoading: false,
      addFormRules: {
        name: [
          { required: true, message: '请输入标签名', trigger: 'blur' }
        ]
      },
      // 新增界面数据
      addForm: {
        name: ''
      },
      queryParams: {},
      page: 1,
      limit: 10,
      total: 0
    }
  },
  computed: {
    opDesc () {
      return this.currStates === 1 ? '删除' : '恢复'
    }
  },
  methods: {
    formatDate (row, column, cellValue, index) {
      return formatDate(cellValue)
    },
    formatStates (row, column, cellValue, index) {
      return formatStates(cellValue)
    },
    getTags () {
      tag({params: this.queryParams}).then(res => {
        this.tags = res.data.results
        this.total = res.data.count
      }).catch(err => {
        console.log(err)
      })
    },
    handleDel (index, row) {
      this.currStates = row.states
      this.$confirm('确认' + this.opDesc + '该记录吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        let tagId = row.id
        delTag(tagId).then((res) => {
          this.listLoading = false
          this.$message({
            message: this.opDesc + '成功',
            type: 'success'
          })
          this.getTags()
        })
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
            editTag(params.id, {name: params.name}).then((res) => {
              this.editLoading = false
              this.$message({
                message: '提交成功',
                type: 'success'
              })
              this.$refs['editForm'].resetFields()
              this.editFormVisible = false
              this.getTags()
            }).catch(err => {
              console.log(err)
            })
          })
        }
      })
    },
    handleAdd () {
      this.addFormVisible = true
      this.addForm = {
        name: ''
      }
    },
    addSubmit () {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.addLoading = true
            let params = Object.assign({}, this.addForm)
            addTag({name: params.name}).then((res) => {
              this.addLoading = false
              this.$message({
                message: '提交成功',
                type: 'success'
              })
              this.$refs['addForm'].resetFields()
              this.addFormVisible = false
              this.getTags()
            }).catch(err => {
              console.log(err)
            })
          })
        }
      })
    },
    // 每页显示数据量变更
    handleSizeChange (val) {
      this.limit = val
      this.queryParams.limit = this.limit
      this.queryParams.page = this.page
      this.getTags()
    },
    // 页码变更
    handleCurrentChange (val) {
      this.page = val
      this.queryParams.limit = this.limit
      this.queryParams.page = this.page
      this.getTags()
    }
  },
  mounted () {
    this.getTags()
  }
}

</script>

<style lang="stylus" scoped>
</style>
