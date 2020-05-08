/*
 * @Author: guwei ;
 * @Date: 2020-04-12 15:47:36 ;
 * @Last Modified by: guwei
 * @Last Modified time: 2020-05-07 15:21:58
 */
import { Service } from 'egg';
import moment = require('moment');
import fs = require('fs');
import path = require('path');
import qiniu = require('qiniu');
import { conf } from 'qiniu/index'
const awaitWriteStream = require('await-stream-ready').write;
import sendToWormhole = require('stream-wormhole');
import md5 = require('md5');



export default class Common extends Service {

  public async getPcMenu() {
    try {
      const result = await this.ctx.baseModel.Menu.findAll({
        raw: true,
      });
      const newResult = result.map(v => {
        return {
          id: v.Id,
          pid: v.TreePId,
          name: v.Name,
          title: v.Name,
        };
      });
      return this.ctx.helper.treeData(newResult, 'id', 'pid', 'children');
    } catch (error) {
      this.ctx.throw('服务器处理错误:' + error);
    }

  }

  public async getAppMenu() {
    try {
      const result = await this.ctx.baseModel.MenuApp.findAll({
        raw: true,
      });
      const newResult = result.map(v => {
        return {
          id: v.Id,
          pid: v.ParentId,
          name: v.Name,
          title: v.Name,
        };
      });
      return this.ctx.helper.treeData(newResult, 'id', 'pid', 'children');
    } catch (error) {
      this.ctx.throw('服务器处理错误:' + error);
    }

  }

  public async uploadImage() {
    const result = await this.uploadFiles();

    if (result) {
      const r1 = await this.ctx.model.File.create({
        ...result,
        store: 'oss',
        time: moment().locale('zh-cn').format('YYYY-MM-DD HH:mm:ss'),
      });
      if (r1) {
        return result;
      } return null;

    }
    return null;
  }

  public async uploadFiles() {
    const { ctx } = this;
    const stream = await ctx.getFileStream();
    const filename = stream.filename;

    const mac = new qiniu.auth.digest.Mac(this.app.config.qiniu.accessKey, this.app.config.qiniu.secretKey);
    const options = {
      scope: this.app.config.qiniu.bucket,
    };

    const putPolicy = new qiniu.rs.PutPolicy(options);
    const uploadToken = putPolicy.uploadToken(mac);
    const config: conf.ConfigOptions
      = new qiniu.conf.Config();

    config.zone = qiniu.zone.Zone_z0;
    const year = new Date().getFullYear();
    const month = new Date().getUTCMonth() + 1;
    const ossName =
      md5(stream.filename) + path.extname(stream.filename).toLocaleLowerCase();
    const localFilePath = path.join(__dirname, '../public/uploads', ossName);

    const writeStream = fs.createWriteStream(localFilePath);


    try {
      await awaitWriteStream(stream.pipe(writeStream));
      const formUploader = new qiniu.form_up.FormUploader(config);

      console.log('=============================12')
      console.log(config)
      console.log(formUploader);
      console.log('=============================')


      const putExtra = new qiniu.form_up.PutExtra();

      const fileInfo: {
        filename: string;
        mime: string;
        path: string;
      } = await new Promise((resolve, reject) => {
        formUploader.putFile(
          uploadToken,
          year + '/' + month + '/' + ossName,
          localFilePath,
          putExtra,
          (respErr, respBody, respInfo) => {
            if (respErr) {
              reject(null);
            }
            if (respInfo.statusCode === 200) {
              resolve({
                filename,
                mime: stream.mimeType,
                path: respBody.key
              });
            } else {
              reject(null);
            }
            // 上传之后删除本地文件
            fs.unlinkSync(localFilePath);
          },
        );
      });
      if (fileInfo) {
        return fileInfo;
      }
      return null;

    } catch (error) {

      console.log('=============================')
      console.log(error);
      console.log('=============================')

      // 如果出现错误，关闭管道
      await sendToWormhole(stream);
      return false;
    }
  }

  public async getFileList({ page, pageSize }) {
    const limit = parseInt(pageSize);
    const offset = limit * (parseInt(page) - 1);

    try {
      const result = await this.ctx.model.File.findAndCountAll({
        limit,
        offset,
      });
      return {
        list: result.rows,
        totalCount: result.count,
        current: parseInt(page),
      };

    } catch (error) {
      this.ctx.throw('服务器处理错误:' + error);
    }
  }

}
