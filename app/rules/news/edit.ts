
module.exports = {

  title: [
    { required: true, message: '新闻标题不能为空' },
  ],
  type: [
    { required: true, message: '新闻类型不能为空' },
  ],
  content: [
    { required: true, message: '新闻内容不能为空' },
  ],
  status: [
    { required: true, message: '新闻状态不正确' },
  ],
};
