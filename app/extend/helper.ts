/* eslint-disable no-self-assign */
/* eslint-disable @typescript-eslint/no-this-alias */
import Excel = require('exceljs');

module.exports = {

  treeData(source, id, parentId, children) {
    const cloneData = JSON.parse(JSON.stringify(source));
    return cloneData.filter(father => {
      const branchArr = cloneData.filter(child => father[id] === child[parentId]);
      branchArr.length > 0 ? father[children] = branchArr : '';
      return father[parentId] === 0;
    });
  },

  findParentById(id, source) {
    const cloneData = JSON.parse(JSON.stringify(source));
    const data = cloneData.filter(() => {
      const son = cloneData.filter(v => v.id === id);
      console.log(son)
    })
    console.log(data)
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

  async excelNew(result, headers, name) {
    const columns: any[] = []; // exceljs要求的columns
    const titleRows = headers.length; // 标题栏行数

    // 处理表头
    for (let i = 0; i < titleRows; i++) {
      const row = headers[i];
      for (let j = 0, rlen = row.length; j < rlen; j++) {
        const col: any = row[j];
        const { k, t, w = 15 } = col;
        if (!k) continue; // 不存在k则跳过
        col.style = { alignment: { vertical: 'middle', horizontal: 'center' } };
        col.header = t;
        col.key = k;
        col.width = w;
        columns.push(col);
      }
    }

    const workbook = new Excel.Workbook();
    const sheet = workbook.addWorksheet('订单列表', { views: [{ xSplit: 1, ySplit: 1 }] });
    sheet.columns = columns;
    sheet.addRows(result);

    // 处理样式、日期、字典项
    const that = this;
    sheet.eachRow((row, rowNumber) => {
      // 设置行高
      row.height = 25;

      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {


        // 设置标题部分为粗体
        if (rowNumber <= titleRows) { cell.font = { bold: true }; return; }

        // 处理数据项里面的日期和字典
        const { type, dict } = columns[colNumber - 1];
        if (type && (cell.value || cell.value === 0)) return; // 非日期、字典或值为空的直接返回
        switch (type) {
          case 'date': cell.value = that.parseDate(cell.value); break;
          case 'dict': cell.value = that.parseDict((cell.value || '').toString(), dict); break;
          default: cell.value = cell.value;
        }

      });
    });

    this.ctx.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    this.ctx.set('Content-Disposition', 'attachment;filename=' + name + '.xlsx');
    this.ctx.body = await workbook.xlsx.writeBuffer();
  },

};
