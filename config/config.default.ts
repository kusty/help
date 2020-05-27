import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1585658495992_2744';

  // add your egg config in here
  config.bodyParser = {
    enable: true,
    encoding: 'utf8',
    formLimit: '100kb',
    jsonLimit: '100kb',
    strict: true,
    queryString: {
      arrayLimit: 100,
      depth: 5,
      parameterLimit: 1000,
    },
    enableTypes: [
      'json',
      'form',
      'text',
    ],
    extendTypes: {
      text: [
        'text/xml',
        'application/xml',
      ],
    },
  };

  config.qiniu = {
    bucket: 'ezrpublic',
    accessKey: 'dWWQZ875ucSQsgvbIacIZAneADtLkrsnJgv819rm',
    secretKey: 'hs5OgUyJVPNlRlKxSrwRmG5t2dsKO8qwyv3w1VU5',
  };

  config.middleware = [
    'errorHandler',
  ];

  config.security = {
    csrf: {
      enable: false,
    },
    domainWhiteList: [
      'http://*:*/',
    ],
  };
  config.jsonp = {
    callback: 'callback', // 识别 query 中的 `callback` 参数
    limit: 100, // 函数名最长为 100 个字符
    whiteList: 'http://*:*/',
  };

  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
  };
  config.cluster = {
    listen: {
      path: '',
      port: 8001,
      hostname: '0.0.0.0',
    },
  };
  config.sequelize = {
    datasources: [
      // {
      //   delegate: 'model',
      //   baseDir: 'model',
      //   dialect: 'mysql',
      // dialectOptions: {
      //   dateStrings: true,
      //   typeCast: true,
      // },
      //   host: '192.168.12.117',
      //   username: 'root',
      //   password: '20150228',
      //   port: 3306,
      //   database: 'ezp-help',
      //   define: {
      //     charset: 'utf8',
      //     collate: 'utf8_general_ci',
      //     underscored: true,
      //   },
      //   timezone: '+08:00',
      //   logQueryParameters: false,
      // },
      // {
      //   delegate: 'baseModel',
      //   baseDir: 'base_model',
      //   dialect: 'mysql',
      //   host: '192.168.12.41',
      //   username: 'ezdev',
      //   password: 'WyIrnqdGliZtlQs8i1iY',
      //   port: 3306,
      //   database: 'ezp-base',
      //   define: {
      //     charset: 'utf8mb4',
      //     collate: 'utf8mb4_unicode_ci',
      //   },
      //   timezone: '+08:00',
      //   logQueryParameters: false,
      // },
      {
        delegate: 'model',
        baseDir: 'model',
        dialect: 'mysql',
        dialectOptions: {
          dateStrings: true,
          typeCast: true,
        },
        host: 'localhost',
        username: 'root',
        password: 'qhmall',
        port: 3306,
        database: 'ezp-help',
        define: {
          charset: 'utf8',
          collate: 'utf8_general_ci',
          underscored: true,
        },
        // timezone: '+08:00',
        logQueryParameters: false,
      },
      {
        delegate: 'baseModel',
        baseDir: 'base_model',
        dialect: 'mysql',
        dialectOptions: {
          dateStrings: true,
          typeCast: true,
        },
        host: 'localhost',
        username: 'root',
        password: 'qhmall',
        port: 3306,
        database: 'ezp-base',
        define: {
          charset: 'utf8mb4',
          collate: 'utf8mb4_unicode_ci',
        },
        timezone: '+08:00',
        logQueryParameters: false,
      }
    ],
  };
  config.validatePlus = {
    resolveError(ctx, errors) {
      if (errors.length) {
        ctx.type = 'json';
        ctx.status = 200;
        ctx.body = {
          code: 6001,
          message: errors[0].message,

        };
      }
    },
  };
  config.multipart = {
    mode: 'stream',
  };
  config.redis = {
    client: {
      port: 6379, // Redis port
      host: '127.0.0.1', // Redis host
      password: '',
      db: 0,
    },
  };

  // the return config will combines to EggAppConfig
  return {
    ...config,
  };
};
