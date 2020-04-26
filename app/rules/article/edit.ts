
module.exports = {

  title: [
    { required: true, message: '文章标题不能为空' },
  ],
  categoryId: [
    { required: true, message: '文章分类不能为空' },
  ],
  content: [
    { required: true, message: '文章内容不能为空' },
  ],
  status: [
    { required: true, message: '文章状态不正确' },
  ],
};
