/** 插入自定义html模块 (可用于插入广告模块等)
 * {
 *   homeSidebarB: htmlString, 首页侧边栏底部
 *
 *   sidebarT: htmlString, 全局左侧边栏顶部
 *   sidebarB: htmlString, 全局左侧边栏底部
 *
 *   pageT: htmlString, 全局页面顶部
 *   pageB: htmlString, 全局页面底部
 *   pageTshowMode: string, 页面顶部-显示方式：未配置默认全局；'article' => 仅文章页①； 'custom' => 仅自定义页①
 *   pageBshowMode: string, 页面底部-显示方式：未配置默认全局；'article' => 仅文章页①； 'custom' => 仅自定义页①
 *
 *   windowLB: htmlString, 全局窗口左下角②
 *   windowRB: htmlString, 全局窗口右下角②
 * }
 *
 * ①注：在.md文件front matter配置`article: false`的页面是自定义页，未配置的默认是文章页（首页除外）。
 * ②注：windowLB 和 windowRB：1.展示区块宽高最大是200*200px。2.请给自定义元素定一个不超过200px的固定宽高。3.在屏宽小于960px时无论如何都不会显示。
 */

 module.exports = {
  // homeSidebarB:
  //   `<div style="padding: 0.95rem">
  //   <p style="
  //     color: var(--textColor);
  //     opacity: 0.9;
  //     font-size: 20px;
  //     font-weight: bold;
  //     margin: 0 0 8px 0;
  //   ">🎁 公众号</p>
  //   <img src="https://cs-wiki.oss-cn-shanghai.aliyuncs.com/img/20210915114831.png"  style="width:100%;" />
  //   <p>
  //   长风破浪会有时，各位小伙伴大家好呀，叫我小牛肉就行，目前在读东南大学硕士，豚厂实习的一只小蝼蚁，上方扫码关注公众号「飞天小牛肉」，与你分享我的成长历程与技术感悟~
  //   </p>
  //   </div>`,
  pageB:
    `<div style="padding: 0.00rem">
    <p style="
      color: var(--textColor);
      opacity: 0.9;
      font-size: 20px;
      font-weight: bold;
      margin: 0 0 8px 0;
    ">🎁 公众号</p>
    <img src="https://cs-wiki.oss-cn-shanghai.aliyuncs.com/img/20210915114831.png"  style="width:30%;" />
    <p>
    各位小伙伴大家好呀，叫我小牛肉就行，目前在读东南大学硕士，上方扫码关注公众号「飞天小牛肉」，与你分享我的成长历程与技术感悟~
    </p>
    </div>`,
}
