webpackJsonp([0,34],{129:function(t,e,n){var o,a,r={};o=n(364),a=n(241),t.exports=o||{},t.exports.__esModule&&(t.exports=t.exports.default);var i="function"==typeof t.exports?t.exports.options||(t.exports.options={}):t.exports;a&&(i.template=a),i.computed||(i.computed={}),Object.keys(r).forEach(function(t){var e=r[t];i.computed[t]=function(){return e}})},241:function(t,e){t.exports=" <div> <component :is=app :context-path=path @widget-active=widgetActive></component> </div> "},364:function(t,e,n){"use strict";function o(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var a=n(79),r=o(a),i=n(124),u=o(i),p=r.default.util,c=[],s=function(t,e){var n=document.getElementsByTagName("head")[0],o=document.createElement("script");o.type="text/javascript",o.onreadystatechange=function(){"complete"===this.readyState&&e()},o.onload=function(){e()},o.src=t,n.appendChild(o)},d=function(t,e){var n=$.Deferred();if(c.indexOf(e)>-1)return t.app=e,n.resolve(),n.promise();var o="/apps/"+e+".js";return s(o,function(){t.app=e,c.push(e),n.resolve()}),n.promise()};e.default={data:function(){return{fullPath:"",path:"",app:null}},methods:{widgetActive:function(t){console.log(this.$router);for(var e=this.$router._currentTransition.to.matched,n=e.length,o=[],a=0;a<n;a++)o.push({path:e[a].handler.path,handler:e[a].handler});for(var r in t){var i=t[r];u.default.addSubRouter(r,i,p.extend([],o))}}},route:{activate:function(t){var e=t.to.matched;this.fullPath=e[e.length-1].handler.fullPath,t.next()},data:function(t){var e=t.to.params.id,n=e;this.path=this.fullPath.replace(":id",e),d(this,n).done(function(){t.next()})}}}}});
//# sourceMappingURL=0.8442de7ad483641b14db.js.map