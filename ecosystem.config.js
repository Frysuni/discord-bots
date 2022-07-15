module.exports = {
    apps : [{
      name   : 'hopabot',
      script : './system/bot.js',
      autorestart : true,
      restart_delay : 1000,
    }],
};