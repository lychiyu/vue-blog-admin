<template>
  <section class="post-list">
    <!--列表-->
    <el-table :data="posts" highlight-current-row v-loading="listLoading" style="width: 100%;">
      <el-table-column type="selection">
      </el-table-column>
      <el-table-column type="index">
      </el-table-column>
      <el-table-column prop="title" label="标题" sortable>
      </el-table-column>
      <el-table-column prop="summary" label="摘要" sortable>
      </el-table-column>
      <el-table-column prop="big_pic" label="大图">
        <template slot-scope="scope">
          <img :src="scope.row.big_pic" alt="" style="width: 100px; height: 100px">
        </template>
      </el-table-column>
      <el-table-column prop="small_pic" label="小图">
        <template slot-scope="scope">
          <img :src="scope.row.small_pic" alt="" style="width: 50px; height: 50px">
        </template>
      </el-table-column>
      <el-table-column prop="cate.name" label="类别" sortable>
      </el-table-column>
      <el-table-column prop="tag" label="标签">
        <template slot-scope="scope">
          <p :key="item.id" v-for="item in scope.row.tags">
            <el-tag type="success">{{item.name}}</el-tag>
          </p>
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="添加时间" :formatter="formatDate" sortable>
      </el-table-column>
      <el-table-column prop="update_time" label="修改时间" :formatter="formatDate" sortable>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="200">
        <template scope="scope">
          <el-button size="small" @click="handleEdit(scope.row.id)">编辑</el-button>
          <el-button size="small" :type="scope.row.states === 1 ? 'danger' : 'success'" @click="handleOp(scope.row)">{{scope.row.states === 1 ? '删除' : '恢复'}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="this.posts.length" align="center" style="margin-top: 20px">
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
  </section>
</template>

<script>
import {articleList, articleDelete} from '../../api/apis'
import {formatDate, formatImgType} from '../../utils'

export default {
  data () {
    return {
      currStates: 1,
      filters: {
        name: ''
      },
      posts: [],
      listLoading: false,
      sels: [], // 列表选中列
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
    formatImgType (row, column, cellValue, index) {
      return formatImgType(cellValue)
    },
    getPosts () {
      articleList({params: this.queryParams}).then(res => {
        this.posts = res.data.results
        this.total = res.data.count
      }).catch(err => {
        console.log(err)
      })
    },
    // 跳转到编辑文章页面
    handleEdit (id) {
      if (id === undefined) {
        this.$router.push({path: `/add_post`})
      } else {
        this.$router.push({path: `/edit_post/${id}`})
      }
    },
    handleOp (row) {
      this.currStates = row.states
      this.$confirm('确认' + this.opDesc + '该文章吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        articleDelete(row.id).then((res) => {
          this.listLoading = false
          this.getPosts()
          this.$message({
            message: this.opDesc + '成功',
            type: 'success'
          })
        })
      }).catch(err => {
        console.log(err)
      })
    },
    // 每页显示数据量变更
    handleSizeChange (val) {
      this.limit = val
      this.queryParams.limit = this.limit
      this.queryParams.page = this.page
      console.log(this.queryParams)
      this.getPosts()
    },
    // 页码变更
    handleCurrentChange (val) {
      this.page = val
      this.queryParams.limit = this.limit
      this.queryParams.page = this.page
      console.log(this.queryParams)
      this.getPosts(this.currentPage, this.pageSize)
    }
  },
  mounted () {
    this.getPosts()
  }
}

</script>

<style lang="stylus" scoped>
</style>
