
module.exports = {
  id: [
    { required: true, message: '节点id不能为空' },
  ],
  type: [
    { required: true, message: '类型不能为空' },
  ],
  name: [
    { required: true, message: '名称不能为空' },
  ],
  displayIndex: [
    { required: true, message: '排序不能为空' },
  ],
};
