import axios from 'axios'

let host = 'http://127.0.0.1:8000/api'

// 登录
export const login = params => { return axios.post(`${host}/login/`, params) }

// 标签列表
export const tag = params => { return axios.get(`${host}/tag/`, params) }

// 删除标签
export const delTag = tagId => { return axios.delete(`${host}/tag/` + tagId + '/') }

// 更新标签
export const editTag = (tagId, params) => { return axios.put(`${host}/tag/` + tagId + '/', params) }

// 添加标签
export const addTag = params => { return axios.post(`${host}/tag/`, params) }

// 类别列表
export const cate = params => { return axios.get(`${host}/cate/`, params) }

// 删除类别
export const delCate = cateId => { return axios.delete(`${host}/cate/` + cateId + '/') }

// 更新类别
export const editCate = (cateId, params) => { return axios.put(`${host}/cate/` + cateId + '/', params) }

// 添加类别
export const addCate = params => { return axios.post(`${host}/cate/`, params) }

// 添加图片
export const upload = params => { return axios.post(`${host}/upload/`, params) }

// 图片列表
export const imgList = params => { return axios.get(`${host}/img/`, params) }

// 更新图片
export const editImg = (imgId, params) => { return axios.put(`${host}/img/` + imgId + '/', params) }
