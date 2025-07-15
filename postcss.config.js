// postcss.config.js
module.exports = {
  plugins: {
    'postcss-px-to-viewport': {
    // vw适配标准屏的宽度（iponeX的屏宽一倍图），下面可以改成要适配机型屏幕宽度的一倍图
    // 设计图 750 调成1倍 => 适配 375
    // 设计图 640 调成1倍 => 适配 320
      viewportWidth: 375
    }
  }
}
