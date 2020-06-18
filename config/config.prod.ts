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
        host: '10.10.150.117',
        username: 'ezwrite',
        password: 'tmRSVkrSoyPn3Zln',
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
        host: '10.10.96.32',
        username: 'ezblog',
        password: 't19M2VwabaALYC3N',
        port: 3306,
        database: 'ezp-base',
        define: {
          charset: 'utf8mb4',
          collate: 'utf8mb4_unicode_ci',
        },
        timezone: '+08:00',
        logQueryParameters: false,
      },
    ],
  };
  return config;
};
