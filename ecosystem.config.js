module.exports = {
    apps : [{
      name   : 'Bot',
      script : './system/bot.js',
      autorestart : true,
      restart_delay : 1000
    }]
};