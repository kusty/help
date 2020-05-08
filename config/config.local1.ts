import { EggAppConfig, PowerPartial } from 'egg';

export default () => {
  const config: PowerPartial<EggAppConfig> = {};
  config.sequelize = {
    datasources: [
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
        timezone: '+08:00',
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
  return config;
};
