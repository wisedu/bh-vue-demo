webpackJsonp([32,34],{5:function(e,n){e.exports=' <div class="bh-card bh-card-lv{{level}}"> <slot></slot> </div> '},7:function(e,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default={props:{level:{default:1}}}},8:function(e,n,r){var t,o,i={};t=r(7),o=r(5),e.exports=t||{},e.exports.__esModule&&(e.exports=e.exports.default);var a="function"==typeof e.exports?e.exports.options||(e.exports.options={}):e.exports;o&&(a.template=o),a.computed||(a.computed={}),Object.keys(i).forEach(function(e){var n=i[e];a.computed[e]=function(){return n}})},239:function(e,n){e.exports=" <div v-pre> <bh-card class=bh-p-8> <h3>标签</h3> <code> <pre v-pre>\r\n&lt;bh-nav :source='navMenus' @trigger='navClick'&gt;&lt;/bh-nav&gt;\r\n</pre> </code> <h3>数据格式(navMenus)</h3> <code> <pre>\r\n[\r\n    {id: 1, name: '首页应用', icon: 'iconfont icon-home', type: 'link', url: '/nav', active: true},\r\n    {id: 2, name: '云端中心', icon: 'iconfont icon-cloud', expand: false, children: [\r\n        {id: 21, name: '收到的消息', type: 'link', url: '/nav/cloud/receive'},\r\n        {id: 22, name: '发出的消息', type: 'link', url: '/nav/cloud/send'},\r\n        {id: 23, name: '收藏的消息', type: 'link', url: '/nav/cloud/favorite'},\r\n    ]},\r\n    {id: 3, name: '运营数据中心', icon: 'icon-moon', expand: false, children: [\r\n        {id: 31, name: '收到的消息', type: 'link', url: '/nav/data/receive'},\r\n        {id: 32, name: '发出的消息', type: 'link', url: '/nav/data/send'},\r\n        {id: 33, name: '收藏的消息', type: 'link', url: '/nav/data/favorite'},\r\n    ]},\r\n    {id: 4, name: '打印模板', icon: 'iconfont icon-print', type: 'trigger', url: '/nav/print'},\r\n    {id: 5, name: '权限管理', icon: 'iconfont icon-lock', type: 'trigger', url: '/nav/permission'},\r\n    {id: 6, name: '用户角色', icon: 'icon-user', type: 'trigger', url: '/nav/user'},\r\n    {id: 7, name: '帮助与支持', icon: 'icon-question-sign', type: 'trigger', url: '/nav/help'},\r\n    {id: 8, name: '消息', icon: 'icon-envelope', type: 'link', url: '/nav/msg'}\r\n]\r\n</pre> </code> </bh-card> </div> "},352:function(e,n,r){"use strict";function t(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(n,"__esModule",{value:!0});var o=r(8),i=t(o);n.default={components:{BhCard:i.default}}},421:function(e,n,r){var t,o,i={};t=r(352),o=r(239),e.exports=t||{},e.exports.__esModule&&(e.exports=e.exports.default);var a="function"==typeof e.exports?e.exports.options||(e.exports.options={}):e.exports;o&&(a.template=o),a.computed||(a.computed={}),Object.keys(i).forEach(function(e){var n=i[e];a.computed[e]=function(){return n}})}});
//# sourceMappingURL=32.10a961f6a94d9c0824e0.js.map