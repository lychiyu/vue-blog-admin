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
    <el-table :data="posts" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
      <el-table-column type="selection">
      </el-table-column>
      <el-table-column type="index">
      </el-table-column>
      <el-table-column prop="title" label="标题" :formatter="formatImgType" sortable>
      </el-table-column>
      <el-table-column prop="title" label="摘要" :formatter="formatImgType" sortable>
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
      <el-table-column prop="create_time" label="修改时间" :formatter="formatDate" sortable>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="200">
        <template scope="scope">
          <el-button size="small" @click="handleEdit(scope.row.id)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleOp(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </section>
</template>

<script>
import {articleList} from '../../api/apis'
import {formatDate, formatImgType} from "../../utils"

export default {
  data () {
    return {
      filters: {
        name: ''
      },
      posts: [],
      total: 0,
      page: 1,
      listLoading: false,
      sels: [] // 列表选中列
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
      articleList().then(res => {
        this.posts = res.data.results
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
    }
  },
  mounted () {
    this.getPosts()
  }
}

</script>

<style lang="stylus" scoped>
</style>
