
module.exports = {

  treeData(source, id, parentId, children) {
    const cloneData = JSON.parse(JSON.stringify(source));
    return cloneData.filter(father => {
      const branchArr = cloneData.filter(child => father[id] === child[parentId]);
      branchArr.length > 0 ? father[children] = branchArr : '';
      return father[parentId] === 0;
    });
  },

  successBody(data = {}) {
    this.ctx.body = {
      code: 200,
      message: 'ok',
      data,
    };
  },

  errorBody(code, message) {
    this.ctx.body = {
      code,
      message,
    };
  },

  throwErrorBody(code, message) {
    this.ctx.throw({ code, message });
  },

  getExtensionFileName(pathfilename) {
    const reg = /(\\+)/g;
    const pString = pathfilename.replace(reg, '#');
    const arr = pString.split('#');
    const lastString = arr[arr.length - 1];
    const arr2 = lastString.split('.');
    return arr2[arr2.length - 1];
  },


  createId() {
    let count = 0;
    let reslut;
    let randomId;
    while (count < 5) {
      randomId = parseInt((Math.random() * 10000).toString());
      reslut = this.app.model.User.findOne({
        where: {
          userId: randomId,
        },
      });
      if (reslut) {
        count++;
      } else {
        return randomId;
      }
    }
    return parseInt(randomId + (Math.random() * 10).toString());

  },

};
