<template>
    <section class="post-edit">
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px; padding-top: 20px">
        <el-form :inline="true" :model="filters">
          <el-form-item label="文章标题:">
            <el-input v-model="title" size="medium" placeholder="请输入文章标题" style="width: 220px"></el-input>
          </el-form-item>
          <el-form-item label="文章摘要:" size="large">
            <el-input  style="width: 220px" type="textarea" v-model="summary" placeholder="请输入文章摘要"></el-input>
          </el-form-item>
          <el-form-item label="文章大图:">
            <el-select size="medium" v-model="currBig" placeholder="大图">
              <el-option v-for="item in bigImgs"
                :key="item.id"
                :label="item.desc"
                :value="item.id">
                <img :src="item.url" alt="" style="width: 50px; height: 50px">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="文章小图:">
            <el-select style="width: 100px;" v-model="currSmall" placeholder="小图">
              <el-option v-for="item in smallImgs"
                :key="item.id"
                :label="item.desc"
                :value="item.id">
                <div>
                  <img :src="item.url" alt="" style="width: 50px; height: 50px">
                </div>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="类别:">
            <el-select v-model="currCate" placeholder="选择文章类别">
              <el-option v-for="item in cates"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="标签:">
            <el-select v-model="currTags" multiple placeholder="选择文章标签">
              <el-option
                v-for="item in tags"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="margin-left: 100px" label="About?">
            <el-switch
              v-model="isAbout"
              active-text="Yes"
              inactive-text="No">
            </el-switch>
          </el-form-item>
          <el-form-item style="margin-left: 100px">
            <el-button type="success" @click="pubSubmit">立即发布</el-button>
          </el-form-item>
          <el-form-item class="editor" style="width: 100%">
            <mavon-editor ref=md @imgAdd="mdImgAdd"
             style="width: 100%; min-height: 500px;" v-model="mdContent"/>
          </el-form-item>
        </el-form>
      </el-col>
    </section>
</template>

<script>
import {imgList, tag, cate, upload, article, articleDetail} from '../../api/apis'

export default {
  name: 'PostEdit',
  data () {
    return {
      title: '',
      summary: '',
      bigImgs: [],
      smallImgs: [],
      cates: [],
      tags: [],
      currBig: '',
      currSmall: '',
      currCate: '',
      currTags: [],
      isAbout: false,
      mdContent: ''
    }
  },
  methods: {
    getImgs (type) {
      let params = {type: type}
      imgList({params: params}).then(res => {
        let ret = res.data.results
        if (type === 1) {
          this.bigImgs = ret
        } else {
          this.smallImgs = ret
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getTags () {
      tag().then(res => {
        this.tags = res.data.results
      }).catch(err => {
        console.log(err)
      })
    },
    getCates () {
      cate().then(res => {
        this.cates = res.data.results
      }).catch(err => {
        console.log(err)
      })
    },
    mdImgAdd (pos, file) {
      var formdata = new FormData()
      formdata.append('file', file)
      formdata.append('type', 3)
      upload(formdata).then(res => {
        if (res.status !== 200) {
          this.$message({
            message: 'upload error',
            type: 'error'
          })
          this.$refs.md.$img2Url(pos, 'error')
        } else {
          this.$refs.md.$img2Url(pos, res.data.url)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    pubSubmit () {
      let params = {
        title: this.title,
        summary: this.summary,
        big_img: this.currBig,
        small_img: this.currSmall,
        cate: this.currCate,
        tags: this.currTags,
        is_about: this.isAbout,
        md_content: this.mdContent
      }
      article(params).then(res => {
        if (res.status !== 201) {
          this.$message({
            message: 'publish fail',
            type: 'error'
          })
        } else {
          this.$message({
            message: 'publish success',
            type: 'success'
          })
          this.$router.replace('/post')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    isEdit () {
      this.postDetail = {}
      let id = this.$route.params.id
      if (id !== undefined) {
        articleDetail({params: {id: id}}).then(res => {
          if (res.code !== 0) {
            this.$message({
              message: 'get post detail fail',
              type: 'error'
            })
          } else {
            this.title = res.data.title
            this.logo = res.data.logo
            this.abstract = res.data.abstract
            this.cate_id = res.data.cate_id
            this.md_content = res.data.md_content
            for (let i = 0; i < res.data.tags.length; i++) {
              this.tags.push(res.data.tags[i].tag_id)
            }
          }
        }).catch(err => {
          console.log(err)
        })
      }
    }
  },
  mounted () {
    this.getImgs(1)
    this.getImgs(2)
    this.getCates()
    this.getTags()
    this.isEdit()
  }
}
</script>

<style lang="stylus">
  .editor .el-form-item__content
    width 100%
</style>
