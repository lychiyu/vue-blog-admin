import moment from 'moment/moment'

export const formatDate = (date, formatStr = 'YYYY-MM-DD HH:mm:ss') => {
  return moment(date).format(formatStr)
}

export const formatStates = states => {
  return (states === 1) ? '正常' : '删除'
}

export const formatImgType = type => {
  return (type === 1) ? '文章列表大图' : (type === 2) ? '文章列表小图' : '文章内容插图'
}
