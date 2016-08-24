+(function() {
    if (typeof(Waves) !== "undefined") {
        Waves.attach('.bh-btn:not(.bh-disabled):not([disabled])');
        Waves.init();
    }

    var $body = $('body');
    //选择按钮组点击事件监听
    $body.on('click', '[bh-btn-role="bhSelectBtnGroup"]', function(e) {
        var $targetObj = $(e.target || e.srcElement);
        if ($targetObj.hasClass('bh-btn')) {
            var $group = $(this);
            $group.find('.bh-btn').removeClass('bh-active');
            $targetObj.addClass('bh-active');
        }
    });
})();


/* ========================================================================
 * Bootstrap: tab.js v3.3.4
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */
+ function($) {
    'use strict';

    // TAB CLASS DEFINITION
    // ====================

    var Tab = function(element) {
        this.element = $(element)
    };

    Tab.VERSION = '3.3.4';

    Tab.TRANSITION_DURATION = 150;

    Tab.prototype.show = function() {
        var $this = this.element;
        var $ul = $this.closest('ul:not(.dropdown-menu)');
        var selector = $this.data('target');

        if (!selector) {
            selector = $this.attr('href');
            selector = selector && selector.replace(/.*(?=#[^\s]*$)/, ''); // strip for ie7
        }

        if ($this.parent('li').hasClass('bh-active')) {
            return;
        }

        var $previous = $ul.find('.bh-active:last a');
        var hideEvent = $.Event('hide.bs.tab', {
            relatedTarget: $this[0]
        });
        var showEvent = $.Event('show.bs.tab', {
            relatedTarget: $previous[0]
        });

        $previous.trigger(hideEvent);
        $this.trigger(showEvent);

        if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) {
            return;
        }

        var $target = $(selector);

        this.activate($this.closest('li'), $ul);
        this.activate($target, $target.parent(), function() {
            $previous.trigger({
                type: 'hidden.bs.tab',
                relatedTarget: $this[0]
            });
            $this.trigger({
                type: 'shown.bs.tab',
                relatedTarget: $previous[0]
            })
        })
    };

    Tab.prototype.activate = function(element, container, callback) {
        var $active = container.find('> .bh-active');
        var transition = callback && $.support.transition && (($active.length && $active.hasClass('bh-fade')) || !!container.find('> .bh-fade').length);

        function next() {
            $active
                .removeClass('bh-active')
                .find('> .dropdown-menu > .bh-active')
                .removeClass('bh-active')
                .end()
                .find('[data-toggle="bhTab"]')
                .attr('aria-expanded', false);

            element
                .addClass('bh-active')
                .find('[data-toggle="bhTab"]')
                .attr('aria-expanded', true);

            if (transition) {
                element[0].offsetWidth; // reflow for transition
                element.addClass('bh-in');
            } else {
                element.removeClass('bh-fade');
            }

            if (element.parent('.dropdown-menu').length) {
                element
                    .closest('li.dropdown')
                    .addClass('bh-active')
                    .end()
                    .find('[data-toggle="bhTab"]')
                    .attr('aria-expanded', true)
            }

            callback && callback()
        }

        $active.length && transition ?
            $active
            .one('bsTransitionEnd', next)
            .emulateTransitionEnd(Tab.TRANSITION_DURATION) :
            next();

        $active.removeClass('bh-in')
    };


    // TAB PLUGIN DEFINITION
    // =====================

    function Plugin(option) {
        return this.each(function() {
            var $this = $(this);
            var data = $this.data('bs.tab');

            if (!data) $this.data('bs.tab', (data = new Tab(this)));
            if (typeof option == 'string') data[option]();
        })
    }

    var old = $.fn.tab;

    $.fn.tab = Plugin;
    $.fn.tab.Constructor = Tab;


    // TAB NO CONFLICT
    // ===============

    $.fn.tab.noConflict = function() {
        $.fn.tab = old;
        return this;
    };


    // TAB DATA-API
    // ============

    var clickHandler = function(e) {
        e.preventDefault();
        Plugin.call($(this), 'show')
    };

    $(document)
        .on('click.bs.tab.data-api', '[data-toggle="bhTab"]', clickHandler);

}(jQuery);


+ function($) {
    'use strict';

    $(document).on("click", ".bh-table tr", function(e) {
        if (e.target.nodeName == "INPUT") {
            return;
        }
        var _self = $(this);
        var table = _self.closest("table.bh-table");
        var tbody = table.children("tbody");

        if (_self.hasClass("bh-ch-active")) {
            _self.removeClass("bh-ch-active");
            ampTableGetColTds(_self, 0, "bh-ch-active");
        } else {
            table.find("tr.bh-ch-active, td.bh-ch-active").removeClass("bh-ch-active");
            _self.addClass("bh-ch-active");
            ampTableGetColTds(_self, 1, "bh-ch-active");
        }
    }).on("mouseover", ".bh-table td", function() {
        var _self = $(this);
        _self.parent("tr").addClass("bh-ch-hover");
        ampTableGetColTds(_self, 1, "bh-ch-hover");

    }).on("mouseout", ".bh-table td", function() {
        var _self = $(this);
        _self.parent("tr").removeClass("bh-ch-hover");
        ampTableGetColTds(_self, 0, "bh-ch-hover");
    });

    function ampTableGetColTds($ele, type, className) {
        /*var table = $ele.closest("table.bh-table-cross-highlight");
        var index = $ele.index();
        table.find("tr").each(function(){
            var td = $(this).children("td:eq(" + index + ")");
            if (type) {
                td.addClass(className);
            }else {
                td.removeClass(className);
            }
        });*/
    }

}(jQuery);

/**
 * bhDialog插件
 */
(function() {
    $.bhDefaults = $.bhDefaults || {};
    $.bhDefaults.Dialog = {
        type: '', //可以传三个值，success/warning/danger
        title: '',
        content: '',
        className: '',
        buttons: [{
            text: '确定',
            className: 'bh-btn-primary',
            callback: null
        }],
        width: 370,
        height: "auto"
    };
    /**
     *
     * @param options
     * options.iconType: '',
     * options.title:'标题',
     * options.content:'内容',
     * options.buttons:[{text:'确定',className:'bh-btn-primary'}]
     */
    $.bhDialog = function(options) {
        var bodyHtml = $("body");
        var params = $.extend({}, $.bhDefaults.Dialog, options || {});
        var g = {};
        var po = {
            _init: function() {
                var dialog = $("<div></div>");
                var dialogId = po.NewGuid();
                dialog.attr("id", "dialog" + dialogId);

                var dialogModal = $("<div class='bh-modal'></div>");

                var dialogWin = $("<div class='bh-pop bh-card bh-card-lv4 bh-dialog-con'></div>");
                if (params.width) {
                    dialogWin.width(params.width);
                }
                if (params.className) {
                    dialogWin.addClass(params.className);
                }

                //根据iconType添加icon相应的dom
                po._createDialogIcon(dialogWin);

                //根据内容和按钮，添加对话框正文相应的dom
                po._createDialogBody(dialogWin, dialogId);

                dialogModal.append(dialogWin);

                dialog.append(dialogModal);

                //灰色的蒙版层
                dialog.append($('<div class="bh-modal-backdrop"></div>'));
                bodyHtml.append(dialog);
                po._resetPos(dialogWin);
                po._checkScrollbar();
                bodyHtml.addClass("bh-has-modal-body");
            },
            _resetPos: function(dialogWin) {
                //重新计算dialogWin的位置，让其垂直方向居中
                var _clientHeight = document.documentElement.clientHeight; //可视区域的高度
                var _contentHeight = dialogWin.height();

                dialogWin.css("margin-top", (_clientHeight - _contentHeight) / 2);
            },
            _checkScrollbar: function() {
                var fullWindowWidth = window.innerWidth;
                if (!fullWindowWidth) { // workaround for missing window.innerWidth in IE8
                    var documentElementRect = document.documentElement.getBoundingClientRect();
                    fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left);
                }
                var bodyIsOverflowing = document.body.clientWidth < fullWindowWidth;
                var scrollbarWidth = po._measureScrollbar();
                po._setScrollbar(bodyIsOverflowing, scrollbarWidth);
            },
            _setScrollbar: function(bodyIsOverflowing, scrollbarWidth) {
                var bodyPad = parseInt((bodyHtml.css('padding-right') || 0), 10);
                g.originalBodyPad = document.body.style.paddingRight || '';
                if (bodyIsOverflowing) bodyHtml.css('padding-right', bodyPad + scrollbarWidth);
            },
            _resetScrollbar: function() {
                bodyHtml.css('padding-right', g.originalBodyPad);
            },
            _measureScrollbar: function() { // thx walsh
                var scrollDiv = document.createElement('div');
                scrollDiv.className = 'bh-modal-scrollbar-measure';
                bodyHtml.append(scrollDiv);
                var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
                bodyHtml[0].removeChild(scrollDiv);
                return scrollbarWidth;
            },
            _removeDialog: function(dialogId) {
                $("#dialog" + dialogId).remove();
                po._resetScrollbar();
                bodyHtml.removeClass("bh-has-modal-body");
            },
            _createDialogBody: function(dialogWin, dialogId) {
                //组装body
                var dialogBody = $("<div class='bh-dialog-content'></div>");

                //设置对话框的正文
                var dialogContent = $('<div class="content"></div>');
                dialogContent.html(params.content);

                dialogBody.append(dialogContent);

                po._createDialogBtn(dialogBody, dialogId);

                dialogWin.append(dialogBody);

                if (params.content == '') {
                    dialogWin.find('.content').css('height', '80px');
                    dialogWin.addClass('bh-dialog-minHeight');
                }
            },

            _createDialogBtn: function(dialogBody, dialogId) {
                var dialogBtnContainer = $('<div class="bh-dialog-center"></div>');
                if (params.buttons && params.buttons.length > 0) {
                    var btnLen = params.buttons.length;
                    for (var i = 0; i < btnLen; i++) {
                        var btn = po._createBtn(params.buttons[i], dialogId);
                        dialogBtnContainer.append(btn);
                    }
                } else {
                    //页面必须有一个按钮
                    var btn = po._createBtn({
                        text: "确定",
                        className: "bh-btn-primary"
                    }, dialogId);
                    dialogBtnContainer.append(btn);
                }

                dialogBody.append(dialogBtnContainer);
            },
            /**
             * 单个按钮的创建方法
             * @param btnInfo
             * @param dialogId
             * @returns {*|jQuery|HTMLElement}
             * @private
             */
            _createBtn: function(btnInfo, dialogId) {
                var btn = $("<a href='javascript:void(0);' class='bh-btn'></a>");
                if (btnInfo && btnInfo.text) btn.text(btnInfo.text);
                if (btnInfo && btnInfo.className) btn.addClass(btnInfo.className);
                btn.click(function() {
                    po._removeDialog(dialogId);
                    btnInfo.callback && btnInfo.callback();
                });
                return btn;
            },
            /**
             * 根据iconType，把icon相应的dom加到dialogWin中
             * @param dialogWin
             * @private
             */
            _createDialogIcon: function(dialogWin) {
                if (params.type != '') {
                    var dialogHtml = po._getDialogIconDom(params.type);
                    dialogWin.append(dialogHtml);
                }
            },
            /**
             * 根据icon类型，返回构造成icon的dom字符串
             * @param iconType
             * @returns {string}
             * @private
             */
            _getDialogIconDom: function(type) {
                var iconClass = '';
                if (type == 'success') {
                    iconClass = 'checkcircle';
                } else if (type == 'warning') {
                    iconClass = 'error';
                } else if (type == 'danger') {
                    iconClass = 'cancel';
                }
                var iconDomString = '<div class="bh-dialog-title-con">' +
                    '<i class="iconfont icon-setstyle icon-' + iconClass + ' bh-dialog-icon-color' + type + '"></i>' +
                    '<h2 class="bh-dialog-title-text">' + params.title + '</h2>' +
                    '</div>';

                return iconDomString;
            },
            /**
             * 生成随机字符串
             * @returns {string}
             * @constructor
             */
            NewGuid: function() {
                return (po.S4() + po.S4() + "-" + po.S4() + "-" + po.S4() + "-" + po.S4() + "-" + po.S4() + po.S4() + po.S4());
            },
            S4: function() {
                return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            }
        }
        if (params.type == "" && params.iconType) {
            params.type = params.iconType;
        }

        // 兼容 content为空的处理
        if (params.content === '' || params.content === undefined) {
            params.content = params.title;
            params.title = "提示";
            // if (params.type == 'success') {
            //     params.title = "提示";
            // } else if (params.type == 'warning') {
            //     params.title = "警告";
            // } else if (params.type == 'danger') {
            //     params.title = "提示";
            // }
        }
        po._init();
    };
}).call(this);

/**
 * radio型的label的点击样式切换
 */
+ function($) {
    'use strict';
    $(document).on("click", ".bh-label-radio", function(e) {
        var $item = $(this);
        $item.closest(".bh-label-radio-group").find(".bh-label-radio").removeClass("bh-active");
        $item.addClass("bh-active");
    });
}(jQuery);

/**
 * 给单列的表单的行添加背景
 */
+ function($) {
    'use strict';
    $(document).on("click", "input.bh-form-control", function(e) {
        changeFormLineBgColor($(this));
    });
    $(document).on("click", "textarea.bh-form-control", function(e) {
        changeFormLineBgColor($(this));
    });
    $(document).on("click", "input[type='radio']", function(e) {
        changeFormLineBgColor($(this));
    });
    $(document).on("click", "input[type='checkbox']", function(e) {
        changeFormLineBgColor($(this));
    });


    function changeFormLineBgColor($item) {
        var $form = $item.closest("[bh-form-role=bhForm]");
        if ($form.length > 0 && !$form.hasClass('bh-form-S')) { // 竖直表单不添加行高亮样式
            $form.find(".bh-row").removeClass("bh-active");
            $item.closest(".bh-row").addClass("bh-active");
        }
    }
}(jQuery);


/**
 * 下拉按钮点击事件
 */
+ (function($) {
    'use strict';

    $(document).on("click", "[bh-dropdown-role=bhDropdownBtn]", function() {
        var $dropdown = $(this).closest("[bh-dropdown-role=bhDropdown]");
        $dropdown.find("[bh-dropdown-role=bhDropdownMenu]").toggleClass("bh-dropdown-open");
    });
})(jQuery);
/**
 * 该代码暂不删除
 * 该代码暂不删除
 * 该代码暂不删除
 * 下拉按user卡片
 */
//+(function($){
//    'use strict';
//
//    $(document).on("mouseenter","[sc-panel-user-1-role=openDown]",function(){
//        var $item = $(this);
//        var $container = $item.find(".sc-panel-user-1-container");
//        var _height = $container.outerHeight();
//        var _minHeight = _height + 28;
//        var existStyle = $container.attr("sc-panel-user-1-role-exist-style");
//        if(!existStyle){
//            var _style = $container.attr("style");
//            if(!_style){
//                _style = " ";
//            }
//            $container.attr("sc-panel-user-1-role-exist-style", _style);
//        }
//        $container.css({"min-height": _minHeight + "px"});
//    });
//    $(document).on("mouseleave","[sc-panel-user-1-role=openDown]",function(){
//        var $item = $(this);
//        var $container = $item.find(".sc-panel-user-1-container");
//        var existStyle = $container.attr("sc-panel-user-1-role-exist-style");
//        $container.attr("style", existStyle);
//    });
//})(jQuery);
(function ($) {
    /**
     * 页面滚动，使元素块变浮动
     * @param data
     */
    $.bhAffix = function(data){
        var bhAffixDefaults = {
            hostContainer: "", //期望浮动元素在页面滚动到达该容器的top值时变成浮动的容器, 后面简称“父容器”
            header: $("header.sc-head"), //普通头部
            miniHeader: $("header.sc-head-mini"), //迷你头部
            fixedContainer: "", //浮动元素
            offset: {} //自己调节浮动块的偏移，top和left
        };
        var options = $.extend({}, bhAffixDefaults, data);

        if(options.fixedContainer.length > 0){
            if(options.fixedContainer.attr("bh-affix-role") !== "bhAffix"){
                $(window).on("scroll.bhAffix", function(){
                    setBlockPosition();
                });

                options.fixedContainer.attr("bh-affix-role", "bhAffix");
            }
        }

        function setBlockPosition(){
            if(options.fixedContainer.length > 0){
                var $window = $(window);
                var scrollTop = $window.scrollTop();

                var hostOffset = options.hostContainer.offset();
                //父容器的top
                var hostTop = hostOffset.top;
                //父容器的left
                var hostLeft = hostOffset.left;
                //普通头部的高
                var headHeight = options.header ? options.header.outerHeight() : 0;
                var fixedContOffset = options.fixedContainer.offset();
                //浮动元素的top
                var fixedContTop = fixedContOffset.top;
                //浮动元素的left
                var fixedLeft = fixedContOffset.left;
                //浮动元素距离父容器的距离
                var diffHeight = fixedContTop - hostTop;
                //自定义偏移的top值
                var offsetTop = options.offset.top ? parseInt(options.offset.top, 10) : 0;
                //浮动元素距离顶部的距离
                diffHeight = diffHeight + offsetTop;

                //当滚动高度大于期望高度的处理
                if(scrollTop >= hostTop - offsetTop - headHeight){
                    //获取之前存放在浮动元素上的style（是已经计算好的style，避免重复计算）
                    var fixedStyleData = options.fixedContainer.data("bhAffixStyleData");
                    if(!fixedStyleData){
                        if(options.offset.left){
                            fixedLeft = fixedLeft + parseInt(options.offset.left, 10);
                        }
                        var toFixedTop = diffHeight;
                        if(options.miniHeader){
                            toFixedTop += options.miniHeader.outerHeight();
                        }else{
                            toFixedTop += headHeight;
                        }
                        //计算后的浮动style
                        fixedStyleData = {"left": fixedLeft+"px", "position":"fixed", "top": toFixedTop};
                        //浮动元素初始的style（用户自己设定的style，将其缓存起来，避免清除浮动style时将用户的style清掉）
                        var _style = options.fixedContainer.attr("style");
                        //将计算的和元素的style存入浮动元素中
                        options.fixedContainer.data("beforeBhAffixStyle", _style).data("bhAffixStyleData", fixedStyleData);
                    }

                    options.fixedContainer.css(fixedStyleData).data("bhAffixFlag",true).addClass('bh-affix-fixedFlag');
                }else{
                    //取消元素浮动的处理，替换style为用户自己设定的style
                    var _style = options.fixedContainer.data("beforeBhAffixStyle");
                    var fixedFlag = options.fixedContainer.data("bhAffixFlag");
                    if(!_style){
                        _style = "";
                    }
                    if(fixedFlag){
                        options.fixedContainer.attr("style", _style);
                        options.fixedContainer.data("bhAffixFlag", false).removeClass('bh-affix-fixedFlag');
                    }
                }
            }
        }


    }
})(jQuery);
(function ($) {
    $.bhAsideNav = {
        //初始化方法
        /**
         * data数据格式
         {
             text: "应用管理",
             icon: "icon-viewmodule",
             href: " "
             children: [
                 {text: "收到的消息"}
             ]
         }
         */
        "init": function(options){
            var navDefaults = {
                title: "",  //标题
                iconFont: "", //字体图标的总类名
                data: [], //导航列表
                hide: null, //可选，点击关闭按钮的回调
                ready: null //可选，初始化并渲染完成的回调
            };
            options = $.extend({}, navDefaults, options);
            _init(options);
        },
        //显示侧边导航方法
        "show": function(options){
            _show();
        },
        //隐藏侧边导航方法
        "hide": function(options){
            var navDefaults = {
                hide: null //可选，点击关闭按钮的回调
            };
            options = $.extend({}, navDefaults, options);
            _hide(options);
        },
        //销毁侧边导航
        "destroy": function(options){
            _destroy();
        }
    };

    //动画执行基本时间
    function getAnimateTime(){
        return 450;
    }
    //每个li的高度
    function getLiHeight(){
        return 42;
    }

    function _init(options){
        //导航标题html
        var headerHtml = getNavHeaderHtml(options);
        //导航列表html
        var contentHtml = getNavContentHtml(options);
        //导航遮盖层html
        var backdropHtml = getNavModelBackdrop();
        //将导航添加到body
        $("body").append('<div class="bh-asideNav-container bh-animated bh-outLeft" style="display: none;" bh-aside-nav-role="bhAsideNav">' + headerHtml + contentHtml + '</div>'+backdropHtml);

        //导航事件监听
        navEventListen();
        //初始化完成的回调
        if(options && typeof options.ready !='undefined' && options.ready instanceof Function){
            options.ready();
        }
    }

    //导航遮盖层html
    function getNavModelBackdrop(){
        var _html = '<div class="bh-modal-backdrop bh-animated bh-asideNav-fadeOut" style="display: none;" bh-aside-nav-role="bhAsideNavBackdrop"></div>';
        return _html;
    }

    //导航标题html
    function getNavHeaderHtml(options){
        var _html =
            '<div class="bh-asideNav-top">' +
                '<h1>'+options.title+'</h1>' +
                '<div class="bh-asideNav-top-close">' +
                    '<i class="iconfont icon-close" bh-aside-nav-role="bhAsideNavCloseBtn"></i>' +
                '</div>' +
            '</div>';
        return _html;
    }

    //导航列表html
    function getNavContentHtml(options){
        var data = options.data;
        var dataLen = data.length;
        var iconFont = options.iconFont;

        var navHtml = "";
        if(dataLen > 0){
            for(var i=0; i<dataLen; i++){
                var dataGroup = data[i];
                var dataGroupLen = dataGroup.length;
                if(dataGroupLen>0){
                    //是否是组里的最末元素
                    var isLastItemInGroup = false;
                    for(var j=0;j<dataGroupLen;j++){
                        //最后一组不加分割线
                        if(i < dataLen-1){
                            if(j==dataGroupLen-1){
                                isLastItemInGroup = true;
                            }else{
                                isLastItemInGroup = false;
                            }
                        }
                        var dataItem = dataGroup[j];
                        var dataChild = dataItem.children;
                        //当存在子元素时，拼接子元素列表的html
                        if(dataChild && dataChild.length > 0){
                            var childsHtml = "";
                            var childLen = dataChild.length;
                            if(childLen > 0){
                                for(var k=0; k<childLen; k++){
                                    childsHtml += getNavLiHtml(dataChild[k], iconFont, "child", false);
                                }
                                childsHtml = '<ul class="bh-asideNav">' + childsHtml + '</ul>';
                            }
                            navHtml += getNavLiHtml(dataItem, iconFont, "", isLastItemInGroup).replace("@childContent", childsHtml);
                        }else{
                            navHtml += getNavLiHtml(dataItem, iconFont, "", isLastItemInGroup);
                        }
                    }
                }

            }
        }
        navHtml = '<div class="bh-asideNav-list"><ul class="bh-asideNav">' + navHtml + '</ul></div>';
        return navHtml;
    }

    //获取单个li的html
    function getNavLiHtml(dataItem, iconFont, flag, isLastItemInGroup){
        var text = dataItem.text;
        var icon = dataItem.icon;
        var href = dataItem.href;
        //li的class名
        var liClass = '';
        var hasChild = false;
        //当该节点是子元素时li的class为空
        if(flag === "child"){
            liClass = "";
        }else{
            //当该元素存在子元素的列名
            if(dataItem.children && dataItem.children.length > 0){
                liClass = 'bh-asideNav-dropdown';
                hasChild = true;
            }
        }

        if(!href){
            //当href没有的处理
            href = "javascript:void(0);"
        }
        if(isLastItemInGroup){
            liClass += " bh-asideNav-splite";
        }
        var _html =
            '<li class="@liClass">' +
                '<a href="@href">' +
                    '<div><i class="@iconFont @iconName"></i>@text</div>' +
                '</a>' +
                '@childContent' +
            '</li>';

        _html = _html.replace("@liClass", liClass).replace("@href", href).replace("@iconFont", iconFont)
            .replace("@iconName", icon).replace("@text", text);
        //当该节点没有子元素时，将子元素的占位符删掉
        if(!hasChild){
            _html = _html.replace("@childContent", "");
        }
        return _html;
    }

    function navEventListen(options){
        var $nav = $("[bh-aside-nav-role=bhAsideNav]");
        //点击关闭按钮
        $nav.on("click", "[bh-aside-nav-role=bhAsideNavCloseBtn]", function(){
            _hide(options);
        });
        var $backdrop = $("[bh-aside-nav-role=bhAsideNavBackdrop]");
        $backdrop.on("click", function(){
            _hide(options);
        });

        //点击有子元素的节点的打开和关闭处理
        $nav.on("click", ".bh-asideNav-dropdown > a", function () {
            var $li = $(this).parent();
            //当该元素是未打开状态，将所有有子元素的节点的高都设为默认高，然后再计算当前元素的高
            if (!$li.hasClass("bh-asideNav-open")) {
                $nav.find(".bh-asideNav-dropdown").css({"height": getLiHeight()+"px"});
                var $childNav = $li.find(".bh-asideNav");
                var $lis = $childNav.children("li");
                var liLen = $lis.length;
                var allLiLen = liLen + 1;
                var childNavHeight = getLiHeight() * allLiLen;
                $nav.find(".bh-asideNav-open").removeClass("bh-asideNav-open");
                $li.addClass("bh-asideNav-open").css({"height": childNavHeight+"px"});
            }else{
                //在其他状态下都将节点的高设为默认高
                var liHeight = getLiHeight();
                $li.removeClass("bh-asideNav-open").css({"height": liHeight+"px"});
            }
            setTimeout(function(){
                $(".bh-asideNav-container").getNiceScroll().resize();
            }, getAnimateTime());

        });

        //点击所有节点是否移除active的处理
        $nav.on("click", ".bh-asideNav li>a", function () {
            var $li = $(this).closest("li");
            $nav.find(".bh-asideNav-active").removeClass("bh-asideNav-active");
            $li.addClass("bh-asideNav-active");
            //当被点击的元素没有子元素时，将导航隐藏
            if(!$li.hasClass("bh-asideNav-dropdown")){
                _hide(options);
            }
        });

        $(".bh-asideNav-container").niceScroll({cursorborder:"none",hidecursordelay:10,autohidemode:"scroll"});
    }

    //显示导航栏
    function _show(){
        var $nav = $("[bh-aside-nav-role=bhAsideNav]");
        var $backdrop = $("[bh-aside-nav-role=bhAsideNavBackdrop]");
        $nav.removeClass("bh-outLeft").addClass("bh-intoLeft").show();
        $backdrop.removeClass("bh-asideNav-fadeOut").addClass("bh-asideNav-fadeIn").show();
        setTimeout(function(){
            $(".bh-asideNav-container").getNiceScroll().resize();
        }, getAnimateTime());

    }

    //隐藏导航栏，当有回调时只行回调
    function _hide(options){
        var $nav = $("[bh-aside-nav-role=bhAsideNav]");
        var $backdrop = $("[bh-aside-nav-role=bhAsideNavBackdrop]");
        $nav.removeClass("bh-intoLeft").addClass("bh-outLeft");
        $backdrop.removeClass("bh-asideNav-fadeIn").addClass("bh-asideNav-fadeOut");
        setTimeout(function(){
            $backdrop.hide();
            $(".bh-asideNav-container").getNiceScroll().resize();
            if(options && typeof options.hide !='undefined' && options.hide instanceof Function){
                options.hide();
            }
        }, getAnimateTime());
    }

    //销毁导航栏
    function _destroy(){
        $("[bh-aside-nav-role=bhAsideNav]").remove();
        $("[bh-aside-nav-role=bhAsideNavBackdrop]").remove();
    }
})(jQuery);


(function () {
    var Plugin, _init,_renderItem;
    Plugin = (function () {
        function Plugin(element, options) {
            this.options = $.extend({}, $.fn.bhButtonGroup.defaults, options);
            this.$element = $(element);
            _init(this.$element, this.options);
        }

        Plugin.prototype.setValue = function (val) {
            var value;
            if (!val || val == null || val == '') {
                value = 'ALL';
            }
            $('.bh-label-radio.bh-active', this.$element).removeClass('bh-active');
            $('.bh-label-radio[data-id=' + value + ']').addClass('bh-active');
        };

        Plugin.prototype.getValue = function () {
            var value = $('.bh-label-radio.bh-active', this.$element).data('id');
            return (value == 'ALL' ? '' : value);
        };

        return Plugin;
    })();

    _init = function (element, options) {

        if (options.data && options.data != null && options.data.length > 0) {
            _renderItem(options.data, element, options);
        } else if (options.url) {
            var source =
            {
                datatype: "json",
                root: "datas>code>rows",
                datafields: [
                    {name: 'id'},
                    {name: 'name'}
                ],
                id: 'id',
                url: options.url
            };
            var dataAdapter = new $.jqx.dataAdapter(source, {
                loadComplete: function (Array) {
                    var buttonGroupData = Array.datas.code.rows;
                    _renderItem(buttonGroupData, element, options);
                    element.trigger('bhInputInitComplete', element);
                }
            });
            dataAdapter.dataBind();
        }

    };

    _renderItem = function(arr, element, options) {
        var itemHtml = '';
        if (options.allOption) {
            itemHtml = '<div class="bh-active bh-label-radio" data-id="ALL">全部</div>';
        }
        $(arr).each(function () {
            itemHtml += '<div class="bh-label-radio" data-id="' + this.id + '">' + this.name + '</div>';
        });
        element.html(itemHtml);
    };

    $.fn.bhButtonGroup = function (options) {
        var instance;
        instance = this.data('plugin');
        if (!instance) {
            return this.each(function () {
                return $(this).data('plugin', new Plugin(this, options));
            });
        }
        if (options === true) return instance;
        if ($.type(options) === 'string') return instance[options]();
        return this;
    };

    $.fn.bhButtonGroup.defaults = {
        allOption: true
    };

}).call(this);
;
(function($) {

    $.bh_choose = function(options) {
        return new chooseWidget(options);
    };

    $.bh_choose.default = {
        leftSourceUrl: '',
        leftSourceAction: '',
        leftLocalData: null,
        rightSourceUrl: '',
        rightSourceAction: '',
        rightLocalData: null,
        localSearchField: '',
        id: '',
        type: 'post',
        multiSelect: true,
        showOrder: false,
        title: '添加应用',
        showSelectedTip: true,
        placeholder: '输入关键字搜索',
        maxSelect: null,
        callback: function() {},
        rightcellsRenderer: function() {},
        leftcellsRenderer: function() {},
        afterDelete: function() {}
    };

    function chooseWidget(options) {
        this.options = $.extend({}, $.bh_choose.default, options);
        this.$element = this.getChooseLayout();
        this.selectedRecords = [];
    }

    chooseWidget.prototype = {
        /**
         * 获取右侧选中的记录
         * @return {[array]} [选中记录]
         */
        getSelectedRecords: function() {
            return this.$rightGrid.jqxDataTable('getRows');
        },

        /**
         * 显示choose弹框
         * @return {[null]} [null]
         */
        show: function() {
            this.showJqxWindow();
            this.initSelectedRecords(this.options.rightLocalData);
            this.initLeftTable();
            this.initRightTable();
            this.bindSearchEvent();
        },

        showJqxWindow: function() {
            var self = this;
            $('body').append(this.$element);
            this.$leftGrid = this.$element.find('.leftGrid');
            this.$rightGrid = this.$element.find('.rightGrid');

            this.$element.on("open", function() {
                $('body').getNiceScroll().remove();
                $('body').css({
                    overflow: 'hidden',
                    'overflow-x': 'hidden',
                    'overflow-y': 'hidden'
                });
            });

            var height = self.options.height || '500px';

            height = parseInt(height.replace('px', '')) / 2 + 'px';

            this.$element.jqxWindow($.extend({
                resizable: false,
                isModal: true,
                modalOpacity: 0.3,
                height: self.options.height || '500px',
                width: self.options.width || '900px',
                autoOpen: false
            }, {})).jqxWindow('open');

            this.$element.css({
                position: 'fixed',
                top: '50%',
                'margin-top': '-' + height

            });

            this.$element.on('close', function() {
                self.$element.jqxWindow('destroy');
                $('body').niceScroll();
            });
        },

        /**
         * *初始化selectedRecords
         * @param  {[type]} data [description]
         * @return {[type]}      [description]
         */
        initSelectedRecords: function(data) {
            if (!data) {
                return;
            }

            this.selectedRecords = data;
        },

        /**
         * 绑定左侧搜索事件
         * @return {[type]} [description]
         */
        bindSearchEvent: function() {
            var self = this;
            var debounced = window._ && _.debounce(function() {
                self.reloadLeftTable();
            }, 500);
            this.$element.find('.leftSearch').on('keyup', function(e) {
                if (e.keyCode == 13) {
                    self.reloadLeftTable();
                    window._ && debounced.cancel();
                } else {
                    window._ && debounced();
                }
            });
        },

        /**
         * 初始化左侧表格
         * @return {[type]} [description]
         */
        initLeftTable: function() {
            var self = this;
            this.leftSource = this.getLeftSource();
            var dataAdapter = null;

            if (this.leftSource.url) {
                dataAdapter = new $.jqx.dataAdapter(this.leftSource, {
                    formatData: function(data) {
                        data.pageSize = data.pagesize;
                        data.pageNumber = data.pagenum + 1;
                        $.extend(data, self.options.leftSourceParams);
                        delete data.pagesize;
                        delete data.pagenum;
                        delete data.filterslength;
                        return data;
                    },
                    downloadComplete: function(data) {
                        var action = self.options.leftSourceAction;
                        var sourceDatas = action ? data.datas[action] : data.datas;

                        self.leftSource.totalRecords = sourceDatas.totalSize;
                        data.recordsTotal = sourceDatas.totalSize;
                        data.data = sourceDatas.rows;
                        delete data.datas;
                        delete data.code;
                        return data;
                    }
                });
            } else if (this.leftSource.localdata) {
                dataAdapter = new $.jqx.dataAdapter(this.leftSource);
            }

            var options = $.extend({}, this.getNormalWindowOptions(), {
                source: dataAdapter,
                pageable: this.leftSource.localdata ? false : true,
                height: 298,
                columns: self.options.leftColumns || [{
                    dataField: 'onlineDate',
                    cellsRenderer: function(row, column, value, rowData) {
                        var html = $(self.options.leftcellsRenderer(row, column, value, rowData));
                        $(html.children()[0]).addClass('gm-member-user');
                        return html.prop('outerHTML');
                    }
                }],
                rendered: function() {
                    self.leftRenderEventListener();
                }
            });

            self.$element.find('.leftGrid').jqxDataTable(options);
        },

        /**
         * 获取左右表格公共配置
         * @return {[type]} [description]
         */
        getNormalWindowOptions: function() {
            return {
                showHeader: false,
                pagerButtonsCount: 3,
                serverProcessing: true,
                showStatusbar: false,
                showToolbar: false,
                pagerMode: 'default',
                localization: Globalize.culture('zh-CN'),
                pageSizeOptions: ['10', '20', '50', '100'],
                width: '100%',
                pagerHeight: 28
            };
        },

        /**
         * 获取左侧数据源
         * @return {[type]} [description]
         */
        getLeftSource: function() {
            var leftSource = null;
            if (this.options.leftLocalData) {
                leftSource = {
                    localdata: this.options.leftLocalData,
                    datatype: 'array'
                };
            } else {
                leftSource = {
                    id: 'id',
                    datatype: 'json',
                    url: this.options.leftSourceUrl,
                    type: this.options.type
                };
            }

            return leftSource;
        },

        /**
         * 左侧表格新增全选按钮
         * @return {[type]} [description]
         */
        addSelectAllButton: function() {
            var self = this;

            if (this.options.multiSelect === false) {
                return;
            }
            var leftPager = this.$element.find('.leftGrid').find('.jqx-grid-pager');
            if (leftPager.find('.leftgrid-select-all').length > 0) {
                return;
            }
            leftPager.append('<div class="select-all-wrap"><div class="leftgrid-select-all" style="display:inline-block"></div><div class="select-all-text">全选</div></div>');
            leftPager.find('.leftgrid-select-all').jqxCheckBox().on('change', function(e) {
                var val = e.args.checked;
                var obj = self.$element.find('.leftGrid .gm-member-user');
                if (val) {
                    obj.jqxCheckBox('check');
                } else if (val === false) {
                    obj.jqxCheckBox('uncheck');
                }
            });
        },

        /**
         * 左侧渲染结束后添加事件监听
         * @return {[type]} [description]
         */
        leftRenderEventListener: function() {
            //return;
            var self = this,
                id = this.options.id,
                $leftGrid = this.$leftGrid,
                $rightGrid = this.$rightGrid,
                selected = self.selectedRecords,
                obj = self.$element.find('.leftGrid .gm-member-user');

            $leftGrid.find('tr').removeAttr('data-key');

            this.addSelectAllButton();
            this.leftGridRows = $leftGrid.jqxDataTable('getRows');
            this.rightGridRows = $rightGrid.jqxDataTable('getRows');

            if (obj.length > 0) {
                obj.jqxCheckBox().on('change', function(e) {
                    var selected = self.selectedRecords;
                    var val = e.args.checked,
                        index = e.target.getAttribute('row'),
                        currentId = self.leftGridRows[index][id],
                        hasSelected = false,
                        data = self.leftGridRows[index];

                    if (val) {
                        _.each(selected, function(item) {
                            if (item[id] + '' == data[id] + '') {
                                hasSelected = true;
                                return false;
                            }
                        });

                        if (hasSelected) {
                            return;
                        }

                        if (self.options.multiSelect === false) {
                            self.$element.find('.rightgrid-delete').trigger('click');
                            //selected.pop();
                        }
                        if (self.options.maxSelect !== null && self.options.maxSelect <= selected.length) {
                            $.bhTip({
                                content: '最多只能选中' + self.options.maxSelect + "条记录"
                            });
                            $(this).jqxCheckBox('uncheck');
                            return;
                        }
                        selected.push(data);
                        $rightGrid.jqxDataTable('addRow', null, data);

                    } else {

                        _.each(selected, function(item, index) {
                            if (item[id] + '' == currentId + '') {
                                selected.splice(index, 1);
                                return false;
                            }
                        });

                        /*_.each($rightGrid.jqxDataTable('getRows'), function(item, index) {
                            if (item[id] == currentId) {
                                $rightGrid.jqxDataTable('deleteRow', index);
                                return false;
                            }
                        });*/

                        self.refreshTable($rightGrid);

                        self.resetSelectALLStatus();
                    }
                    self.options.showSelectedTip && $rightGrid.prev().html("已选中 " + selected.length);
                });
            }
            for (var j = 0; j < selected.length; j++) {
                for (var i = 0; i < this.leftGridRows.length; i++) {
                    if (self.selectedRecords[j][id] + '' == this.leftGridRows[i][id] + '') {
                        $(obj[i]).jqxCheckBox("check");
                    }
                }
            }
            self.resetSelectALLStatus();
        },

        getRightSource: function() {
            var rightSource = null;
            if (this.options.rightLocalData) {
                rightSource = {
                    localdata: this.options.rightLocalData,
                    datatype: 'array'
                };
            } else if (this.options.rightSourceUrl) {
                rightSource = {
                    id: 'id',
                    datatype: 'json',
                    url: this.options.rightSourceUrl,
                    type: this.options.type
                };
            } else {
                rightSource = {
                    localdata: this.selectedRecords,
                    datatype: 'array'
                };
            }

            return rightSource;
        },

        initRightTable: function() {
            var self = this;
            var id = this.options.id;
            var rightSource = this.getRightSource();

            var dataAdapter = [];
            if (rightSource.url) {
                dataAdapter = new $.jqx.dataAdapter(rightSource, {
                    formatData: function(data) {
                        data.pageSize = data.pagesize;
                        data.pageNumber = data.pagenum + 1;
                        delete data.pagesize;
                        delete data.pagenum;
                        delete data.filterslength;
                        return data;
                    },
                    downloadComplete: function(data) {
                        var action = self.options.rightSourceAction;
                        var sourceData = action ? data.datas[action] : data.datas;

                        rightSource.totalRecords = sourceData.totalSize;
                        $.extend(data, self.options.leftSourceParams);
                        data.recordsTotal = sourceData.totalSize;
                        data.data = sourceData.rows;
                        self.initSelectedRecords(sourceData.rows);
                        delete data.datas;
                        delete data.code;
                        return data;
                    }
                });
            } else if (rightSource.localdata) {
                dataAdapter = new $.jqx.dataAdapter(rightSource);
            }

            var options = $.extend({}, this.getNormalWindowOptions(), {
                source: dataAdapter,
                pagerMode: 'advanced',
                height: 298,
                pageable: false,
                columns: self.options.rightColumns || [{
                    dataField: 'onlineDate',
                    cellsRenderer: function(row, column, value, rowData) {
                        var html = $(self.options.rightcellsRenderer(row, column, value, rowData));
                        var orderhtml = self.options.showOrder ? '<i class="iconfont icon-keyboardarrowup rightgrid-up"></i><i class="iconfont icon-keyboardarrowdown rightgrid-down"></i>' : '';

                        var deleteHtml = html.append('<a class="gm-member-delete" data-x-id="' + rowData[id] + '" href="javascript:void(0)">' + orderhtml + '<i class="iconfont icon-delete rightgrid-delete"></i></a>');
                        return deleteHtml.prop('outerHTML');
                    }
                }],
                rendered: function() {
                    self.rightRenderEventListener();
                }
            });

            self.$element.find('.rightGrid').jqxDataTable(options);
        },

        rightRenderEventListener: function() {
            var self = this;
            var id = this.options.id;
            var $rightGrid = self.$element.find('.rightGrid');
            $rightGrid.find('tr').removeAttr('data-key');
            self.$element.find('.rightgrid-down').on('click', function() {
                var row = $(this).parent();
                var currentId = row.attr('data-x-id');
                for (var i = 0; i < self.selectedRecords.length; i++) {
                    if (self.selectedRecords[i][id] + '' == currentId + '') {
                        if (i < self.selectedRecords.length - 1) {
                            var temp = self.selectedRecords[i];
                            self.selectedRecords[i] = self.selectedRecords[i + 1];
                            self.selectedRecords[i + 1] = temp;
                            break;
                        }
                    }
                }
                self.refreshTable(self.$element.find('.rightGrid'));
            });
            self.$element.find('.rightgrid-up').on('click', function() {
                var row = $(this).parent();
                var currentId = row.attr('data-x-id');
                for (var i = 0; i < self.selectedRecords.length; i++) {
                    if (self.selectedRecords[i][id] + '' == currentId + '') {
                        if (i > 0) {
                            var temp = self.selectedRecords[i];
                            self.selectedRecords[i] = self.selectedRecords[i - 1];
                            self.selectedRecords[i - 1] = temp;
                            break;
                        }
                    }
                }
                self.refreshTable(self.$element.find('.rightGrid'));
            });
            self.$element.find('.rightgrid-delete').on('click', function() {
                var $leftGrid = self.$element.find('.leftGrid');
                var row = $(this).parent();
                var currentId = row.attr('data-x-id');
                var memberRows = self.leftGridRows;
                var existInLeft = false;
                var selected = self.selectedRecords;
                var obj = $leftGrid.find('.gm-member-user');
                for (var i = 0; i < obj.length; i++) {
                    var val = $(obj[i]).jqxCheckBox('val');
                    if (val && memberRows[i][id] + '' == currentId + '') {
                        self.options.afterDelete(memberRows[i]);
                        for (var j = 0; j < self.selectedRecords.length; j++) {
                            if (self.selectedRecords[j][id] + '' == currentId) {
                                $(obj[i]).jqxCheckBox('uncheck');
                                self.resetSelectALLStatus();
                                existInLeft = true;
                            }
                        }
                    }
                }

                if (!existInLeft) {
                    _.each(selected, function(item, index) {
                        if (item[id] + '' == currentId + '') {
                            selected.splice(index, 1);
                            return false;
                        }
                    });

                    self.refreshTable(self.$rightGrid);
                    self.options.showSelectedTip && $rightGrid.prev().html("已选中 " + selected.length);
                }
            });
        },

        resetSelectALLStatus: function() {
            if (this.options.multiSelect === false) {
                return;
            }
            var leftPager = this.$element.find('.leftGrid').find('.jqx-grid-pager');
            var $leftGrid = this.$element.find('.leftGrid');
            var obj = $leftGrid.find('.gm-member-user');

            var selectedLength = 0;
            for (var i = 0; i < obj.length; i++) {
                if ($(obj[i]).jqxCheckBox("val")) {
                    selectedLength++;
                }
            }

            if (selectedLength == 0 && leftPager.find('.leftgrid-select-all').jqxCheckBox('val') !== false) {
                leftPager.find('.leftgrid-select-all').jqxCheckBox('uncheck');
            } else if (selectedLength == obj.length) {
                leftPager.find('.leftgrid-select-all').jqxCheckBox('check');
            } else if (leftPager.find('.leftgrid-select-all').jqxCheckBox('val') === true) {
                leftPager.find('.leftgrid-select-all').jqxCheckBox('indeterminate');
            }
        },

        reloadLeftTable: function() {
            var self = this;
            var searchKey = $.trim(self.$element.find('.leftSearch').val()).toLowerCase();
            var localSearchField = this.options.localSearchField.split(',');
            var localData = this.options.leftLocalData;

            if (localData) {
                var newArray = [];
                for (var i = 0; i < localData.length; i++) {
                    for (var j = 0; j < localSearchField.length; j++) {
                        var field = localData[i][localSearchField[j]];
                        if (!field) {
                            continue;
                        }
                        field = field.toLowerCase();
                        if (field.indexOf(searchKey) >= 0) {
                            newArray.push(localData[i]);
                            break;
                        }
                    }
                }
                self.leftSource.localdata = newArray;
            } else {
                self.leftSource.data = {
                    SEARCHKEY: searchKey
                };
            }

            self.refreshTable(self.$element.find('.leftGrid'));
        },

        refreshTable: function($table) {
            if (!$table.jqxDataTable('goToPage', 0)) {
                $table.jqxDataTable('updateBoundData');
            }
        },

        getChooseLayout: function() {
            var self = this;
            var selectedLength = this.options.rightLocalData ? this.options.rightLocalData.length : 0;
            var $dom = $('<div style="padding-bottom:72px;">' +
                '<div class="head"></div>' +
                '<div>' +
                '<div class="content">' +
                '   <div class="content-top"></div>' +
                '   <div class="gm-add-block bh-clearfix">' +
                '        <div class="bh-col-md-6" style="background: #fff;padding-left:0px;padding-right:0px;">' +
                '            <div class="gm-add-search bh-mb-8" style="margin:7px 8px 0 8px">' +
                '                <input class="leftSearch" type="text" placeholder="' + this.options.placeholder + '">' +
                '              <a href="javascript:void(0)"><i class="iconfont">&#xe895;</i></a>' +
                '          </div>' +
                '         <div class="noBorderGrid leftGrid leftgrid-container"></div>' +
                '      </div>' +
                '     <div class="bh-col-md-6 rightgrid-container">' +
                (this.options.showSelectedTip === false ? '<h3>已选择字段</h3>' : ('<h3>已选中 ' + selectedLength + '</h3>')) +
                '           <div class="noBorderGrid transparentGrid rightGrid"></div>' +
                '      </div>' +
                '</div>' +
                '<div class="content-bottom"></div>' +
                '<div id="buttons" style="position: absolute;bottom:32px;width: 100%;left: 0;float: right;padding: 0 24px;">' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>');


            $(".head", $dom).append($("<h2></h2>").append(this.options.title));

            var btns = [{
                text: '确定',
                className: 'bh-btn-primary',
                callback: function() {
                    return self.options.callback(self.getSelectedRecords());
                }

            }, {
                text: '取消',
                className: 'bh-btn-default',
                callback: function() {
                    $dom.jqxWindow('close');
                }
            }];

            for (var i = btns.length - 1; i >= 0; i--) {
                var btn = $('<button class="bh-btn ' + btns[i].className + ' bh-pull-right">' + btns[i].text + '</button>');
                if (btns[i].callback) {
                    var cb = btns[i].callback;
                    btn.data("callback", cb);
                    btn.click(function() {
                        var cb = $(this).data("callback");
                        var needClose = cb.apply($dom, [$dom]);
                        if (needClose !== false)
                            $dom.jqxWindow('close');
                    });
                }
                $("#buttons", $dom).append(btn);
            }

            return $dom;
        }
    };

})(jQuery);
/**
 * 可折叠面板
 *
 */
(function ($) {
    /**
     * 定义一个插件
     */
    var Plugin;

    /**
     * 这里是一个自运行的单例模式。
     */
    Plugin = (function () {

        /**
         * 插件实例化部分，初始化时调用的代码可以放这里
         */
        function Plugin(element, options) {
            //将插件的默认参数及用户定义的参数合并到一个新的obj里
            this.settings = $.extend({}, $.fn.bhCollapsiblePanel.defaults, options);
            //将dom jquery对象赋值给插件，方便后续调用
            this.$element = $(element);
            init(this.settings, this.$element);
        }

        //展开面板
        Plugin.prototype.expandPanel = function () {
            var switchBtn = this.$element.find('[bh-collapsible-panel-flag="switch"]');
            expandPanel(switchBtn,this.settings);
        };
        //收缩面板
        Plugin.prototype.collapsePanel = function () {
            var switchBtn = this.$element.find('[bh-collapsible-panel-flag="switch"]');
            collapsePanel(switchBtn,this.settings);
        };

        return Plugin;

    })();

    function init(options, dom){
        var content = dom.html();
        //初始化头部
        var _html = getPanelHtml(options);
        dom.html(_html);
        var $block = $(".bh-collapsible-panel-content",dom);
        $block.append(content);
        dom.show();
        $block.data("height",$block.outerHeight());
        $block.css("height",0).hide();
        addEventListener(dom,options);
    }

    function addEventListener(dom,options){
        dom.on("click",'.bh-collapsible-panel',function(e){
            e = e || window.event;
            var targetNode = e.target || e.srcElement;
            if($(targetNode).attr("bh-collapsible-panel-flag") == "switch"){
                if($(targetNode).attr("bh-collapsible-panel-role") == "expand"){
                    expandPanel($(targetNode),options);
                }else{
                    collapsePanel($(targetNode),options);
                }
            }else if($(targetNode).hasClass("bh-collapsible-panel")) {
                var switchBtn = $(this).find('[bh-collapsible-panel-flag="switch"]');
                if(switchBtn.attr("bh-collapsible-panel-role") == "expand"){
                    expandPanel(switchBtn,options);
                }
            }else if($(targetNode).closest(".bh-collapsible-panel-toolbar").length == 0){
                var $parent = $(targetNode).closest(".bh-collapsible-panel");
                var switchBtn = $parent.find('[bh-collapsible-panel-flag="switch"]');
                if(switchBtn.attr("bh-collapsible-panel-role") == "expand"){
                    expandPanel(switchBtn,options);
                }
            }
        });
    }

    function getPanelHtml(options){
        var panelClass = "bh-collapsible-panel";
        if(options.hasBorder){
            panelClass+=" has-border";
        }
        var _html ='<div class="'+panelClass+'">'+
            '<h3 class="bh-collapsible-panel-title">'+options.title+'</h3>'+
            options.tag+
            '<div class="bh-text-caption bh-caption-default">'+options.caption+'</div>'+
            '<div class="bh-collapsible-panel-toolbar">'+
            options.toolbar +
            '<a href="javascript:void(0);" class="bh-btn-link" bh-collapsible-panel-flag="switch" bh-collapsible-panel-role="expand">展开</a>'+
            '</div>'+
            '<div class="bh-collapsible-panel-content bh-collapsible-panel-animate">'+
            '</div>'+
            '</div>';
        return _html;
    }

    function collapsePanel(target,options){
        if(options && options.beforeCollapse){
            options.beforeCollapse(target);
        }
        var $block = $(target).closest(".bh-collapsible-panel").find(".bh-collapsible-panel-content");
        $block.css({"height": 0});
        var $card = $block.parent();
        setTimeout(function(){
            $block.hide();
            $card.removeClass("bh-card bh-card-lv2");
        }, getAnimateTime());
        var switchBtn = $card.find("[bh-collapsible-panel-flag='switch']");
        switchBtn.text("展开");
        switchBtn.attr("bh-collapsible-panel-role","expand");
        if(options && options.afterCollapse){
            setTimeout(function(){
                options.afterCollapse(target);
            }, getAnimateTime());
        }
    }
    function expandPanel(target,options){
        if(options && options.beforeExpand){
            options.beforeExpand(target);
        }
        var $block = $(target).closest(".bh-collapsible-panel").find(".bh-collapsible-panel-content");
        var $card = $block.parent();
        //给自己加阴影
        $card.addClass("bh-card bh-card-lv2");

        var height = $block.data("height");
        $block.show();
        setTimeout(function(){
            $block.css({"height": height});
        }, 1);
        $(target).text("收起");
        $(target).attr("bh-collapsible-panel-role","collapse");
        if(options && options.afterExpand){
            setTimeout(function(){
                options.afterExpand(target);
            }, getAnimateTime());
        }
    }
    /**
     * 动画的执行的基础时间
     * @returns {number}
     */
    function getAnimateTime(){
        return 450;
    }
    /**
     * 这里是关键
     * 定义一个插件 plugin
     */
    $.fn.bhCollapsiblePanel = function (options, params) {
        var instance;
        instance = this.data('bhCollapsiblePanel');
        /**
         * 判断插件是否已经实例化过，如果已经实例化了则直接返回该实例化对象
         */
        if (!instance) {
            return this.each(function () {
                //将实例化后的插件缓存在dom结构里（内存里）
                return $(this).data('bhCollapsiblePanel', new Plugin(this, options));
            });
        }
        if (options === true) return instance;
        /**
         * 优雅处： 如果插件的参数是一个字符串，则 调用 插件的 字符串方法。
         * 如 $('#id').plugin('doSomething') 则实际调用的是 $('#id).plugin.doSomething();
         * doSomething是刚才定义的接口。
         * 这种方法 在 juqery ui 的插件里 很常见。
         */
        if ($.type(options) === 'string') instance[options](params);
        return this;
    };

    /**
     * 插件的默认值
     */
    $.fn.bhCollapsiblePanel.defaults = {
        title:"", //大标题内容，可以是传纯文本或html
        tag:"", //标签html
        caption:"", //小标题内容，可以是传纯文本或html
        toolbar:"", //工具栏的DOM的Html
        hasBorder:true, //是否显示边框
        beforeExpand:null, //展开面板前的回调
        afterExpand:null, //展开面板后的回调
        beforeCollapse:null, //收缩面板前的回调
        afterCollapse:null //收缩面板后的回调
    };
})(jQuery);
(function($) {
    'use strict';

    $.bhCutStr = function(data) {
        var bhCutStrDefaults = {
            dom: {//可选，当要显示文本的dom结构已经存在，选用此方法
                selector: '', //必选，截断文本所在容器的jquery选择器
                line: 0, //必选，指定显示的文本行数
                content: '' //可选，传入的文本内容（若文本已经加载到dom里了，则此项可不加）
            },
            text: {//可选，纯粹的对字符串做截断处理,使用该方式显示更多的处理自能自己处理
                content: '',//必填，传入的文本内容
                number: 0 //要截断的字符个数
            },
            moreBtn: {
                content: '', //可选，更多按钮的文字
                url: '', //可选，超链接所指向的地址
                isOpenNewPage: true //可选，当url存在时，该选项才能生效，默认是打开新页面
            }
        };
        var options = $.extend({}, bhCutStrDefaults, data);

        return init(options);

        function init(options) {
            var $objArr = options.dom ? options.dom.selector : "";
            if($objArr.length > 0){
                $objArr.each(function() {
                    var guid = BH_UTILS.NewGuid();
                    var $obj = $(this);
                    //在该dom下添加一个零时dom来获取这个块的font-size
                    $obj.append(
                            '<div id="'+guid+'">' +
                                '<div id="chinese-'+guid+'" style="display: none;position: absolute;">是</div>' +
                                '<div id="lower-english-'+guid+'" style="display: none;position: absolute;">w</div>' +
                            '</div>');
                    var tempObj = $obj.find('#'+guid);
                    //中文字符和大写的英文的大小
                    options.chineseFontSize = tempObj.find('#chinese-'+guid).width();
                    //小写的英文和数字的大小
                    options.lowerEnFontSize = tempObj.find('#lower-english-'+guid).width();
                    tempObj.remove();

                    //获取文本所在dom的宽度
                    var objWidth = $obj.width();
                    var objText = options.dom.content ? $.trim(options.dom.content) : $.trim($obj.text()); //获得字符串内容
                    var textLen = objText.length; //实际字符个数

                    //按所有文本都是中文字符计算出的文字个数
                    var tempComputeTextLen = parseInt(objWidth * options.dom.line / options.chineseFontSize,10);
                    //当内容的字符数比计算出的字符数少，则不做任何处理
                    if(textLen <= tempComputeTextLen){
                        return;
                    }

                    var url = 'javascript:void(0);';
                    var target = 'target="blank"';
                    var moreStr = '';
                    var moreText = '';
                    if(options.moreBtn){
                        url = !options.moreBtn.url || options.moreBtn.url.length === 0 ? 'javascript:void(0);' : options.moreBtn.url;
                        target = !options.moreBtn.isOpenNewPage ? 'target="blank"' : '';
                        moreText = options.moreBtn.content ? options.moreBtn.content : '';
                        moreStr = '<a href="' + url + '" class="bh-cut-str-more" bh-cut-str-role="bhCutStr" '+target+' data-guid="'+guid+'" data-full-str="'+objText+'">' + moreText + '</a>';
                    }

                    //更多按钮的宽度
                    var moreTextWidth = moreText ? getTextWidth(moreText) : 0;
                    //省略号的宽度，按一个中文字符的宽度算
                    var ellipsisWidth = options.chineseFontSize;
                    //去掉更多按钮和省略号的剩余宽度和一个字符的偏差宽度
                    var canUseWidth = objWidth * options.dom.line - moreTextWidth - ellipsisWidth - options.chineseFontSize;
                    var computeTextLen = parseInt(canUseWidth / options.chineseFontSize,10);
                    var computeText = getCutText(canUseWidth, computeTextLen, objText);

                    $obj.html(computeText + "..." + moreStr);

                    if(moreStr){
                        moreTextEvent($obj.find('a[bh-cut-str-role="bhCutStr"]'));
                    }
                });
            }else{
                var text = $.trim(options.text.content);
                var cutText = text;
                if(text.length > options.text.number){
                    cutText = text.substring(0, options.text.number) + '...';
                }

                var url = 'javascript:void(0);';
                var target = 'target="blank"';
                var moreStr = '';
                var moreText = '';
                if(options.moreBtn){
                    url = !options.moreBtn.url || options.moreBtn.url.length === 0 ? 'javascript:void(0);' : options.moreBtn.url;
                    target = !options.moreBtn.isOpenNewPage ? 'target="blank"' : '';
                    moreText = options.moreBtn.content ? options.moreBtn.content : '';
                    moreStr = '<a href="' + url + '" class="bh-cut-str-more" bh-cut-str-role="bhCutStr" '+target+' data-full-str="'+text+'">' + moreText + '</a>';
                }

                cutText += moreStr;
                return cutText;
            }
        }

        function getCutText(width, textLen, text){
            //按传入的长度截取字符
            var cutText = text.substring(0, textLen);
            //截取后剩余的字符
            var surplusText = text.substring(textLen, text.length);
            //获取该字符串的宽度
            var textWidth = getTextWidth(cutText);
            //当字符的宽度小于理论宽度，计算偏差字符
            var diffText = '';
            if(textWidth < width){
                var diffWidth = width - textWidth;
                //当偏差的宽度大于1个中文字符时，继续截断
                if(diffWidth > options.chineseFontSize){
                    var diffTextLen = parseInt(diffWidth / options.chineseFontSize, 10);
                    diffText = getCutText(diffWidth, diffTextLen, surplusText);
                }
            }
            return cutText + diffText;
        }

        function getTextWidth(text){
            //匹配中文
            var chinese = text.match(/[^\x00-\xff]/g);
            var chineseLen = chinese ? chinese.length : 0;
            //大写字母和@
            var capitalEn = text.match(/[A-Z@]/g);
            var capitalEnLen = capitalEn ? capitalEn.length : 0;
            var lowerEnLen = text.length - chineseLen - capitalEnLen;
            //大写字母按中文字符的宽度算
            var width = (chineseLen + capitalEnLen) * options.chineseFontSize + lowerEnLen * options.lowerEnFontSize;
            return width;
        }

        function moreTextEvent($moreStr){
            $moreStr.on('mouseover', function(){
                var text = $moreStr.attr('data-full-str');
                var guid = $moreStr.attr('data-guid');

                var $textContainer = $moreStr.parent();
                var containerWidth = $textContainer.width();
                setAndShowPopBoxPosition($moreStr, containerWidth, text, guid);
            });
            $moreStr.on('mouseout', function(){
                var guid = $moreStr.attr('data-guid');
                var $box = $('#'+guid);
                moreBoxToHide($box);
            });
        }

        function moreBoxEvent($moreBox){
            $moreBox.on('mouseover', function(){
                $moreBox.data('flag', 'show');
            });
            $moreBox.on('mouseout', function(){
                moreBoxToHide($moreBox);
            });
        }

        function moreBoxToHide($box){
            $box.data('flag', 'hide');
            setTimeout(function(){
                if($box.data('flag') === 'hide'){
                    $box.removeClass('bh-active');
                    setTimeout(function(){
                        $box.remove();
                    }, 250);
                }
            }, 150);
        }

        function setAndShowPopBoxPosition($element, boxWidth, content, id){
            var elementPosition = BH_UTILS.getElementPosition($element);
            var windowHeight = window.innerHeight;
            var halfWindowHeight = parseInt(windowHeight/2, 10);
            var windowScrollTop = window.scrollY;
            var $content = '<div data-flag="content">'+content+'</div>';
            var frameHtml = '<div id="'+id+'" style="width: '+boxWidth+'px;" class="bh-cutStr-popBox bh-card bh-card-lv2 bh-animate-transform-base bh-animate-scale">'+$content+'</div>';
            var $frameHtml = $(frameHtml);
            $('body').append($frameHtml);

            //默认展开的起点是右上角
            var boxStyle = {left: elementPosition.right - boxWidth +'px', top: elementPosition.bottom+'px'};
            var boxOriginClass = 'bh-animate-origin-TR';
            var contentHeight = $frameHtml.outerHeight();
            var maxHeight = 0; //更多展示框的最大高度
            //查看当前位置高度，辨别是上部还是下部的可用空间较多
            var canShowHeight = 0;
            var diff = 8; //留出弹框距离页面的边距
            if(elementPosition.top - windowScrollTop > halfWindowHeight){
                //当上部有更多展示空间的处理
                canShowHeight = elementPosition.top - windowScrollTop - $('header[bh-header-role="bhHeader"]').outerHeight() - diff;
                boxOriginClass = 'bh-animate-origin-BR';
                maxHeight = canShowHeight > contentHeight ? contentHeight : canShowHeight;
                boxStyle.top = elementPosition.top - maxHeight+'px';
            }else{
                //当下部有更多展示空间的处理
                canShowHeight = windowHeight + windowScrollTop - elementPosition.bottom - $('footer[class="bh-footer"]').outerHeight() - diff;
                maxHeight = canShowHeight > contentHeight ? contentHeight : canShowHeight;
            }

            boxStyle['max-height'] = maxHeight+'px';

            $frameHtml.css(boxStyle).addClass(boxOriginClass);
            setTimeout(function(){
                $frameHtml.addClass('bh-active');
            },10);
            moreBoxEvent($frameHtml);
        }
    }
})(jQuery);
;
(function($) {

    /*初始化flowState**/

    function ProgressBar(element, options) {
        this.options = $.extend({}, $.fn.flowState.defaultOptions, options);
        //将dom jquery对象赋值给插件，方便后续调用
        this.$element = $(element);
        appendHtml(this.options, this.$element);
        settingWidth(this.options, this.$element);
        openPopover(this.options);
    }

    ProgressBar.prototype = {

        resetFlowStatus: function(options) {
            options = $.extend({}, {
                index: NaN, //元素从1开始算起
                resetStatus: 'success', //状态为成功：success; 失败：fail; 操作中：operation ; 未开始： not started
                resetStatusDecription: '成功'
            }, options);
            resetFlowStatus(options, this);
        }

    };

    function openPopover(options) {
        //鼠标悬浮
        var length = options.flowStateData.length;
        for (var i = 0; i < length; i++) {
            openToolTip(options.flowStateData[i], i, length);
        }
    }

    function openToolTip(data, index, length) {

        var left = 0;
        if (index === 0) {
            left = 96;
        } else if (index === (length - 1)) {
            left = -96;
        }

        if (data.isShowPop) {
            var toolTipDiv = ($('.bh-flowState-box')[index]);
            $(toolTipDiv).jqxTooltip({
                position: 'bottom',
                autoHide: false,
                top: 10,
                left: left,
                showArrow: false,
                closeOnClick: false,
                content: data.popHtml
            });
            $('.jqx-tooltip-main').css({
                'background-color': '#ffffff',
                'box-shadow': '0 4px 20px #bbb'

            });
            $(toolTipDiv).on('mouseout', function() {
                $(toolTipDiv).jqxTooltip('close');
            });
        }
    }

    function appendHtml(options, $element) {
        var stateData = getData(options);
        var boxHtml = addBoxContainer(stateData);
        var flowStateHtml = '<div class="bh-flowState bh-clearfix">' + boxHtml + '</div>';
        $element.html(flowStateHtml);
    }

    function addBoxContainer(stateData) {
        if (stateData) {
            var stateDataLen = stateData.length;
            var containerHtml = "";
            if (stateDataLen !== 0) {
                for (var i = 0; i < stateDataLen; i++) {
                    containerHtml += getContentFromData(stateData, i + 1, stateDataLen);
                }
            }
            return containerHtml;
        }
    }
    //根据数据加载模板以及样式
    function getContentFromData(data, index, num) {
        var currentData = data[index - 1];
        var prevData = data[index - 2];
        var lineNum = num - 1;
        var circleStatus = getCircleStatusClass(currentData);
        var lineStatus = getLineStatueClass(currentData);
        var cls = [];
        //去掉第一个的before和最后一个的after
        if (index === 1) {
            cls.push('bh-flowState-hideLeft');
        } else if (index === num) {
            cls.push('bh-flowState-hideRight');
        }
        if (prevData && prevData.status === 'success') {
            cls.push('bh-flowState-prev-success');
        }
        var html = '<div class="bh-flowState-box ' + cls.join(' ') + '">' +
            '<div class="bh-flowState-num-circle ' + circleStatus + '">' + index + '</div>' +
            '<div class="bh-flowState-word">' +
            '<div class="bh-flowState-detail">' + currentData.content + '</div>' +
            '<a class="bh-flowState-status ' + circleStatus + '">' + currentData.statusDescription + '</a>' +
            '</div>' +
            '</div>' +
            '<div class="bh-flowState-line ' + lineStatus + ' " style="width:calc((100% - 96*' + num + 'px) / ' + lineNum + ')">' +
            '</div>';
        return html;

    }

    function getCircleStatusClass(data) {
        var map = {
            'success': 'bh-flowState-success',
            'fail': 'bh-flowState-fail',
            'operation': 'bh-flowState-operation'
        };
        return map[data.status || data.resetStatus];
    }

    function getLineStatueClass(data) {
        var lineMap = {
            'success': 'bh-flowState-line-succes'
        };
        return lineMap[data.status || data.resetStatus];
    }

    function getElePreClass($circle) {
        var preClass = "";
        if ($circle.hasClass("bh-flowState-success")) {
            preClass = "bh-flowState-success";
        } else if ($circle.hasClass("bh-flowState-fail")) {
            preClass = "bh-flowState-fail";
        } else if ($circle.hasClass("bh-flowState-operation")) {
            preClass = "bh-flowState-operation";
        }
        return preClass;
    }

    function getData(options) {
        return options.flowStateData;
    }

    function settingWidth(options, $element) {
        $element.css('width', options.width);
        $element.find('.bh-flowState-line:last').css('width', '0');
    }

    function resetFlowStatus(options, progrossBar) {
        var index = options.index - 1;
        var boxEle = progrossBar.$element.find('.bh-flowState-box');
        var circleEle = progrossBar.$element.find('.bh-flowState-num-circle');
        var statusEle = progrossBar.$element.find('.bh-flowState-status');
        var lineEle = progrossBar.$element.find('.bh-flowState-line');
        var resetCircleColor = getCircleStatusClass(options);
        var resetLineColor = getLineStatueClass(options);
        var elePreColor = getElePreClass($(circleEle[index])); //因为circle和status用同一种颜色，所以如果获取到circle以前的颜色就能获取到staus以前的颜色
        $(statusEle[index]).text(options.resetStatusDecription);
        if (options.resetStatus === 'success') {
            $(boxEle[index + 1]).addClass('bh-flowState-prev-success');
        }
        $(circleEle[index]).removeClass(elePreColor);
        $(statusEle[index]).removeClass(elePreColor);
        $(circleEle[index]).addClass(resetCircleColor);
        $(statusEle[index]).addClass(resetCircleColor);
        $(lineEle[index]).addClass(resetLineColor);
        openToolTip(options, index - 1, circleEle.length);
    }

    function flowState(options, params) {
        var instance;
        instance = this.data('flowState');
        /**
         * 判断插件是否已经实例化过，如果已经实例化了则直接返回该实例化对象
         */
        if (!instance) {
            return this.each(function() {
                //将实例化后的插件缓存在dom结构里（内存里）
                return $(this).data('flowState', new ProgressBar(this, options));
            });
        }
        if (options === true) return instance;
        /**
         * 优雅处： 如果插件的参数是一个字符串，则 调用 插件的 字符串方法。
         * 如 $('#id').ProgressBar('doSomething') 则实际调用的是 $('#id).ProgressBar.doSomething();
         * doSomething是刚才定义的接口。
         * 这种方法 在 juqery ui 的插件里 很常见。
         */
        if ($.type(options) === 'string') instance[options](params);
        return this;
    }

    $.fn.flowState = flowState;
    /** status: 成功：success; 失败：fail; 操作中：operation ; 未开始： not started
        statusDescription：成功，失败，审核中，还没开始（为空）
    */
    $.fn.flowState.defaultOptions = {
        width: '100%',
        flowStateData: [{
            id: "1",
            content: "个人提交",
            status: "success",
            statusDescription: "提交成功",
            popHtml: "<div class='bh-flowState-time'>审核时间：<span></span></div><div class='bh-flowState-suggestion'>审核意见：<span></span></div>",
            isShowPop: true
        }]
    };


})(jQuery);
(function ($) {
    /**
     * 定义一个插件
     */
    var Plugin;

    /**
     * 这里是一个自运行的单例模式。
     */
    Plugin = (function () {

        /**
         * 插件实例化部分，初始化时调用的代码可以放这里
         */
        function Plugin(element, options) {
            //将插件的默认参数及用户定义的参数合并到一个新的obj里
            this.settings = $.extend({}, $.fn.bhHeader.defaults, options);
            //将dom jquery对象赋值给插件，方便后续调用
            this.$element = $(element);
            init(this.settings, this.$element);
        }
        return Plugin;

    })();

    function init(options, dom){
        var _html = getFooterHtml(options);
        dom.html(_html).attr("bh-footer-role", "footer").addClass("bh-footer");
    }

    function getFooterHtml(options){
        var _html = '<div class="bh-footer-content">'+options.text+'</div>';
        return _html;
    }

    function setFooterOnBottom(dom, options){

    }


    /**
     * 这里是关键
     * 定义一个插件 plugin
     */
    $.fn.bhFooter = function (options) {
        return this.each(function () {
            return new Plugin(this, options);
        });
    };

    /**
     * 插件的默认值
     */
    $.fn.bhFooter.defaults = {
        text: ""
    };
})(jQuery);
(function($) {
    /**
     * 页面滚动，使元素块变浮动，一定要在页面数据加载完成之后才能初始化页脚
     * @param data
     */
    $.bhFooterAffix = function() {
        var $footer = $('body main [bh-role=bhFooterAffix]').first();
        if ($footer[0]) {
            var $parent = $footer.parent();
            if ($parent.attr('bh-footer-affix-role') === "bhFooterAffix") {
                return;
            }
            var footerEle = '<div bh-footer-affix-role="bhFooterAffix" class="bh-footer-affix bh-card bh-card-lv1"></div>';
            $footer.wrap(footerEle);

            var hasPaperPile = $('[bh-paper-pile-dialog-role=bhPaperPileDialog]')[0];
            var hasPropertyDialog = $('[bh-property-dialog-role=bhPropertyDialog]')[0];
            var hasBhWindow = $('[role=dialog]').filter(function() {
                return $(this).hasClass('.jqx-window') && $(this).css('display') !== 'none';
            })[0];

            $(window).scroll(function(e) {
                if (hasPaperPile || hasPropertyDialog || hasBhWindow) {
                    return;
                } else {
                    scrollToSetFooterPlace($parent);
                }
            });
            initFooterAffixPosition($parent);
        }
    };

    $.bhFooterAffix.resetPosition = function() {
        resetFooterAffix();
    };

    //当页面的内容发生变化，重置页脚的位置
    function resetFooterAffix() {
        setTimeout(function() {
            var $page = $("[bh-footer-affix-role=bhFooterAffix]").parent();
            var positionAndHeight = getHeightAndOffset($page);
            var pageShowHeight = positionAndHeight.articleHeight + positionAndHeight.articleOffset.top;
            //article高度小于浏览器高度，则让article的footer取消浮动
            if (pageShowHeight <= positionAndHeight.windowHeight) {
                setDivFooterPosition($page);
            } else {
                //给article的footer添加浮动属性
                footerAffixToFixed($page);
            }
        }, 50);
    }

    // 初始化页面的时候初始化页脚的位置
    function initFooterAffixPosition($page) {
        footerAffixToFixed($page);
        setDivFooterPosition($page);
    }

    //设置footer的位置
    function setDivFooterPosition($page) {
        var positionAndHeight = getHeightAndOffset($page);
        var $divFooter = $page.find("div[bh-footer-affix-role=bhFooterAffix]");
        var dialogFooterFixedStyle = footerAffixToFixed($page, 'get');
        $divFooter.attr("bh-footer-affix-fixed", dialogFooterFixedStyle);

        //页面高度小于浏览器高度，则让页脚取消浮动
        var pageShowHeight = positionAndHeight.articleHeight + positionAndHeight.articleOffset.top;
        if (pageShowHeight <= positionAndHeight.windowHeight) {
            setDivFooterRelative($divFooter);
        }
    }
    // 设置footer的位置
    function setDivFooterRelative($divFooter) {
        //当首页的div的页脚没有任何内容时，不做任何处理
        if ($divFooter.contents().length === 0) {
            return;
        }

        var $page = $divFooter.parent();
        var layoutType = '';
        var pageContentHeight = 0;
        $page.children().each(function() {
            var $item = $(this);
            //先判断该布局是不是左右布局，是左右布局则继续读取它里面的子结构然后取高度大的nav或page的高度做页面高度
            if ($item[0].localName === "nav") {
                layoutType = 'navLeft';
            }

            if (layoutType === 'navLeft') {
                var navContentHeight = 0;
                $item.children().each(function() {
                    navContentHeight += $(this).outerHeight();
                });
                if (navContentHeight > pageContentHeight) {
                    pageContentHeight = navContentHeight;
                }
            } else {
                var itemHeight = $item.outerHeight();
                if ($item.attr('bh-footer-affix-role') == "bhFooterAffix") {
                    itemHeight = 0;
                }
                pageContentHeight += itemHeight;
            }
        });
        var pagePaddingBottom = parseInt($page.css("padding-bottom"), 10);
        pagePaddingBottom = pagePaddingBottom ? pagePaddingBottom : 0;

        var pageMinHeight = parseInt($page.css("min-height"), 10);
        pageMinHeight = pageMinHeight ? pageMinHeight : 0;

        //当内容高度比首页最小高度还小的时候，让页脚能自适应高度
        if ((pageContentHeight + pagePaddingBottom) < pageMinHeight) {
            $divFooter.removeAttr("style");
            $divFooter.css({
                "top": pageContentHeight + "px",
                "bottom": "initial",
                "background-color": "transparent"
            }).removeClass('bh-card bh-card-lv1');
        } else {
            $divFooter.css({
                "left": 0,
                "bottom": 0,
                "position": "absolute"
            });
        }
        $divFooter.show();
    }
    //给首页添加的footer添加浮动属性，
    //当可视区域和window的高度一致，将页脚设置为绝对定位
    function footerAffixToFixed($page, flag) {
        var footerStyle = '';
        var $pageDivFooter = $page.find("div[bh-footer-affix-role=bhFooterAffix]");

        if ($pageDivFooter[0]) {
            var pageWidth = $page.outerWidth();
            var positionData = getHeightAndOffset($page);
            var articleShowHeight = positionData.articleHeight + positionData.footerHeight + positionData.bodyHeaderHeight;
            initPagePadding($pageDivFooter, positionData.divFooterHeight);
            footerStyle = 'left:' + positionData.articleOffset.left + 'px;width:' + pageWidth + 'px;position:fixed;bottom:0;top:initial;display:block;';
            if (flag !== 'get') {
                if (articleShowHeight <= positionData.windowHeight) {
                    $pageDivFooter.css({
                        "left": positionData.articleOffset.left + "px",
                        "bottom": 0,
                        "position": "absolute",
                        "background-color": "transparent"
                    }).removeClass('bh-card bh-card-lv1');
                } else {
                    $pageDivFooter.css({
                        "left": positionData.articleOffset.left + "px",
                        "width": pageWidth + "px",
                        "position": "fixed",
                        "bottom": 0,
                        "top": "initial",
                        "display": "block"
                    });
                }
            }
        }
        return footerStyle;
    }

    /**
     * 滚动条滚动时，设置页脚样式,
     * 当可视区域和window的高度一致，将页脚设置为绝对定位
     * @param $dialog
     */
    function scrollToSetFooterPlace($page) {
        var positionAndHeight = getHeightAndOffset($page);

        var $divFooter = $page.find("div[bh-footer-affix-role=bhFooterAffix]");
        // 滚动到底的时候，将footer设置为绝对定位
        if (positionAndHeight.windowHeight + positionAndHeight.scrollTop >= positionAndHeight.bodyHeight) {
            setDivFooterRelative($divFooter);
        } else {
            var pageFooterFixedStyle = $divFooter.attr("bh-footer-affix-fixed");
            var articleShowHeight = positionAndHeight.articleHeight + positionAndHeight.footerHeight + positionAndHeight.bodyHeaderHeight;
            if (articleShowHeight <= positionAndHeight.windowHeight) {
                $divFooter.css({
                    "left": 0,
                    "bottom": 0,
                    "position": "absolute",
                    "background-color": "transparent"
                }).removeClass('bh-card bh-card-lv1');
            } else {
                $divFooter.attr("style", pageFooterFixedStyle);
            }
        }
    }

    //获取window，article，footer的高度以及offset
    function getHeightAndOffset($page) {
        var data = {};
        var $window = $(window);
        var $body = $("body");
        var scrollTop = $window.scrollTop();
        var windowHeight = $window.height();

        var bodyHeight = $body.get(0).scrollHeight;
        var footerHeight = $("[bh-footer-role=footer]").outerHeight();
        var bodyHeaderHeight = $('body header header').outerHeight();

        if ($page) {
            var articleHeight = $page.outerHeight();
            var articleOffset = $page.offset();
            var divFooterHeight = 0;
            var $divFooter = $page.find('div[bh-footer-affix-role=bhFooterAffix]');
            if ($divFooter.length > 0) {
                divFooterHeight = $divFooter.outerHeight(true);
            }

            data.articleHeight = articleHeight;
            data.articleOffset = articleOffset;
            data.divFooterHeight = divFooterHeight;
        }

        data.windowHeight = windowHeight;
        data.scrollTop = scrollTop;
        data.bodyHeight = bodyHeight;
        data.footerHeight = footerHeight;
        data.bodyHeaderHeight = bodyHeaderHeight;
        return data;
    }

    // 添加article的paddingbottom
    function initPagePadding($pageDivFooter, divFooterHeigth) {
        $pageDivFooter.parent().css({
            "padding-bottom": divFooterHeigth
        });
    }

})(jQuery);

(function($) {
    $.bhFormOutline = {
        show: function(options) {
            var formOutlineDefaults = {
                insertContainer: "", //必填，要插入的容器
                width: 0,
                className: "",
                offset: {}, //可选，大纲的偏移量{ top, left, right, bottom}，默认是右对齐
                scrollOffsetTop: $('header[bh-header-role="bhHeader"]').outerHeight(), //可选，锚点定位的位置的top偏移量
                statistics: true, //可选，是否对表单输入进行统计， true默认进行统计,
                affix: false,
                bottom: null
            };
            options = $.extend({}, formOutlineDefaults, options);
            formOutlineShow(options);
        },
        hide: function(options) {
            var formOutlineDefaults = {
                insertContainer: "", //可选，要插入的容器
                destroy: true //可选，隐藏时是否要删除该大纲，默认删除
            };
            options = $.extend({}, formOutlineDefaults, options);
            formOutlineHide(options);
        }
    };

    /**
     * 表单填写大纲
     * @param insertContainer 要插入的容器
     * @param offset 大纲的偏移量{ top, left, right, bottom}，默认是右对齐
     * @param scrollOffsetTop 锚点定位的位置偏移量
     * @param statistics 是否对表单输入进行统计， true默认进行统计
     */
    function formOutlineShow(options) {
        var formOutlineGuid = options.insertContainer ? options.insertContainer.attr("bh-form-outline-role-form-guid") : "";
        if (formOutlineGuid) {
            $("div[bh-form-outline-role-outline-guid=" + formOutlineGuid + "]")
                .removeClass("bh-fadeOut").addClass("bh-fadeIn").show();
            return;
        }

        //目前对左侧表单新增了滚动的事件监听，如果是点击outline引起的滚动，则跳过相应的事件处理
        var outlineItemClickAnimate = false;

        var outlineItemClickTimeout = null;

        //为内容块和大纲创建guid
        formOutlineGuid = NewGuid();
        //大纲外框html
        var formOutlineHtml = getFormOutlineHtml();
        //大纲子元素html
        var formOutlineItemHtml = getFormOutlineItemHtml();
        var outlineList = [];
        //获取生成大纲的title
        options.insertContainer.find("[bh-role-form-outline=title]").each(function() {
            var guid = NewGuid();
            var $item = $(this);
            var title = $item.text();
            $item.attr("bh-role-form-outline-item-title-guid", guid);
            outlineList.push({
                "title": title,
                "guid": guid
            });
        });

        //获取生成大纲的表单块
        options.insertContainer.find("[bh-role-form-outline=container]").each(function(index) {
            var guid = outlineList[index].guid;
            var $item = $(this);
            $item.attr("bh-role-form-outline-item-guid", guid);

            var statisticsData = {};
            statisticsData.editBoxCount = 0;
            statisticsData.enterEditBoxCount = 0;
            statisticsData = statisticsEditBox($item, "input", statisticsData);
            statisticsData = statisticsEditBox($item, "textarea", statisticsData);
            statisticsData = statisticsEditBox($item, "select", statisticsData);

            outlineList[index].statistics = statisticsData;
        });

        //生成大纲展示html
        var formOutlineContent = "";
        var outlineLength = outlineList.length;
        if (outlineLength > 0) {
            for (var i = 0; i < outlineLength; i++) {
                var outlineItem = outlineList[i];
                var active = "";
                if (i === 0) {
                    active = "bh-active";
                }
                var statistics = outlineItem.statistics;
                var count = "";
                var success = "";
                if (statistics) {
                    if (statistics.editBoxCount) {
                        if (options.statistics) {
                            count = statistics.enterEditBoxCount + "/" + statistics.editBoxCount;
                            success = statistics.enterEditBoxCount === statistics.editBoxCount ? "bh-success" : "";
                        }
                    }
                }

                formOutlineContent += formOutlineItemHtml.replace("@active", active).replace("@index", i + 1).replace("@text", outlineItem.title)
                    .replace("@success", success).replace("@count", count).replace("@guid", outlineItem.guid);
            }
        }

        //设置大纲位置
        var _style = "";
        if (options.offset) {
            var offset = options.offset;
            if (offset.left === 0 || offset.left) {
                _style += "left:" + offset.left + "px;";
            }
            if (offset.right === 0 || offset.right) {
                _style += "right:" + offset.right + "px;";
            }
            if (offset.top === 0 || offset.top) {
                _style += "top:" + offset.top + "px;";
            }
            if (offset.bottom === 0 || offset.bottom) {
                _style += "bottom:" + offset.bottom + "px;";
            }
        }

        //将大纲插入页面
        formOutlineHtml = formOutlineHtml.replace("@content", formOutlineContent).replace("@style", _style).replace("@outlineGuid", formOutlineGuid);
        var hideBlockId = "bhFormOutline_hide_" + NewGuid();
        var $formOutline = $(formOutlineHtml);
        //添加一个隐藏块，用来计算文本是否超出div的宽度，超出则加上title
        $formOutline.append('<div id="' + hideBlockId + '" style="display: none;" class="bh-form-outline-itemText"></div>');

        if (options.width) {
            $formOutline.css({
                'width': options.width
            });
        }

        if (options.className) {
            $formOutline.addClass(options.className);
        }

        options.insertContainer.append($formOutline).attr("bh-form-outline-role-form-guid", formOutlineGuid);

        //计算和判断是否要添加title属性
        var hideBlock = $('#' + hideBlockId);
        $formOutline.find('.bh-form-outline-itemText').each(function() {
            var $item = $(this);
            var itemWidth = $item.width();
            var itemText = $item.text();
            hideBlock.html(itemText);
            var hideWidth = hideBlock.width();
            if (hideWidth > itemWidth) {
                $item.attr('title', itemText);
            }
        });

        //大纲表单输入事件监听
        if (options.statistics) {
            //对输入框进行输入或点击（针对非输入项的，如radio，checkbox）的事件监听
            options.insertContainer.on({
                "keydown": function(e) {
                    setTimeout(function() {
                        getEnterTagObj(e);
                    }, 50);
                },
                "click": function(e) {
                    getEnterTagObj(e);
                }
            });

            //监听 下拉列表 dropdownlist
            options.insertContainer.find(".jqx-dropdownlist-state-normal").each(function() {
                var $item = $(this);
                $item.on('select', function(event) {
                    var $parentBlock = $item.closest("[bh-role-form-outline=container]");
                    checkAndRefreshCount($parentBlock);
                });
            });

            //监听 时间 datetimeinput
            options.insertContainer.find(".jqx-datetimeinput").each(function() {
                var $item = $(this);
                $item.on('valueChanged', function(event) {
                    var $parentBlock = $item.closest("[bh-role-form-outline=container]");
                    checkAndRefreshCount($parentBlock);
                });
            });

            //监听 combobox
            options.insertContainer.find(".jqx-combobox").each(function() {
                var $item = $(this);
                $item.on('change', function(event) {
                    setTimeout(function() {
                        var $parentBlock = $item.closest("[bh-role-form-outline=container]");
                        checkAndRefreshCount($parentBlock);
                    }, 50);
                });
            });

            //监听 文件上传
            options.insertContainer.find("[xtype=uploadfile],[xtype='uploadsingleimage'],[xtype='uploadmuiltimage']").each(function() {
                var $item = $(this);
                $item.on('bh.file.upload.done', function(event) {
                    setTimeout(function() {
                        var $parentBlock = $item.closest("[bh-role-form-outline=container]");
                        checkAndRefreshCount($parentBlock);
                    }, 50);
                });

                $item.on('bh.file.upload.delete', function(event) {
                    setTimeout(function() {
                        var $parentBlock = $item.closest("[bh-role-form-outline=container]");
                        checkAndRefreshCount($parentBlock);
                    }, 50);
                });
            });
        }

        //浮动块的监听
        $formOutline.on("click", "div.bh-form-outline-item", function() {
            var $item = $(this);
            var $formOutline = $item.closest("div[bh-role-form-outline-fixed=bhFormOutline]");
            var guid = $item.attr("bh-role-form-outline-fixed-item-guid");
            var $title = options.insertContainer.find("[bh-role-form-outline-item-title-guid=" + guid + "]");
            var fixedTop = $title.offset().top;
            if (options.scrollOffsetTop) {
                fixedTop = fixedTop - parseInt(options.scrollOffsetTop, 10);
            }

            $("html, html body").animate({
                scrollTop: (fixedTop)
            }, 450);

            $formOutline.find("div.bh-form-outline-item").removeClass("bh-active");
            $item.addClass("bh-active");

            //outlineItemClickAnimate = true目的是让点击右侧outline切换时，跳过window上的scroll事件处理，配合
            //outlineItemClickTimeout使用，保证在快速切换时，中间也跳过window上的scroll事件处理；
            clearTimeout(outlineItemClickTimeout);
            outlineItemClickAnimate = true;
            outlineItemClickTimeout = setTimeout(function() {
                outlineItemClickAnimate = false;
            }, 700);
            if (options.affix) {
                resetOutlinePosition($item);
            }
        });

        var _style = $formOutline.attr("style");

        function scrollEvent() {
            var $window = $(window);
            var hostOffset = options.insertContainer.offset();
            var hostTop = hostOffset.top;
            var scrollTop = $window.scrollTop();

            setOutlineToFixed();

            //insertContainer在dom节点中销毁后，在内存中依然存在，如果滚动的时候为隐藏状态，则认为已经销毁
            if ($(options.insertContainer[0]).css('display') == 'none') {
                $(window).unbind('scroll', scrollEvent);
            }

            if (outlineItemClickAnimate || outlineList.length == 0) {
                return;
            }

            if (options.insertContainer.find('[bh-role-form-outline-item-title-guid="' + outlineList[0].guid + '"]').css('display') == 'none') {
                return;
            }

            for (var i = 0; i < outlineList.length; i++) {
                var offset = options.insertContainer.find('[bh-role-form-outline-item-title-guid="' + outlineList[i].guid + '"]').offset();
                if (offset && (offset.top - document.body.scrollTop > 0)) {
                    $formOutline.find("div.bh-form-outline-item").removeClass("bh-active");
                    $('[bh-role-form-outline-fixed-item-guid="' + outlineList[i].guid + '"]').addClass("bh-active");
                    resetOutlinePosition($('[bh-role-form-outline-fixed-item-guid="' + outlineList[i].guid + '"]'));
                    break;
                }
            }
        }

        function setOutlineToFixed() {
            var hostOffset = options.insertContainer.offset();
            var hostTop = hostOffset.top;
            var fixedContOffset = $formOutline.offset();
            var fixedLeft = fixedContOffset.left;
            var fixedContTop = fixedContOffset.top;
            var diffHeight = fixedContTop - hostTop;
            var scrollTop = $(window).scrollTop();

            if (scrollTop >= hostTop || $formOutline.data('bhAffixFlag') === undefined) {
                if ($formOutline.data('bhAffixFlag') !== true) {

                    var fixedStyleData = {
                        "left": fixedLeft + "px",
                        "position": "fixed",
                        "top": diffHeight
                    };

                    $formOutline.css(fixedStyleData).data("bhAffixFlag", true).data('bhfixedStyle', fixedStyleData);
                }
            } else {
                $formOutline.attr("style", _style).data("bhAffixFlag", false);
            }
        }

        function max(a, b) {
            return a < b ? b : a;
        }

        function min(a, b) {
            return a > b ? b : a;
        }

        var constant = {
            //outlineList 底部距离浏览器底部的最小距离（当移动到最底部的时候）
            'OUTLINE_BOTTOM_TO_BROWER_BOTTOM': options.bottom || 100,

            //outline大纲 可视区域的下方 点击何处触发outline上移（相对于浏览器底部的距离）
            'BOTTOM_POSITION_TRIGGER_MOVE_UP': 100,

            //outline大纲 可视区域的上方 点击何处触发outline下移（相对于浏览器顶部的距离）
            'TOP_POSITION_TRIGGER_MOVE_DOWN': 100,

            //outline大纲往下移动时每次移动的距离
            'TOP_POSITION_TRIGGER_MOVE_DOWN_DISTANCE': 100,

        };

        var maxOutlineTop, minOutlineTop;

        function resetOutlinePosition(outlineItem) {
            setOutlineToFixed();

            //当前选择大纲项距离浏览器顶部的距离
            var currentItemToScreenTop = outlineItem.offset().top - document.body.scrollTop;

            //当前选择大纲项距离浏览器底部的距离
            var currentItemToScreenBottom = $(window).height() - currentItemToScreenTop;

            //outline top的最小值
            minOutlineTop = ($(window).height() - $formOutline.height() - constant['OUTLINE_BOTTOM_TO_BROWER_BOTTOM']);

            //outline top的最大值
            maxOutlineTop = maxOutlineTop === undefined ? $formOutline.data('bhfixedStyle').top : maxOutlineTop;

            //当前outline的top值
            var currentOutlineTop = +$formOutline.css('top').replace('px', '');

            if (currentItemToScreenBottom < constant['BOTTOM_POSITION_TRIGGER_MOVE_UP']) {
                var realOutlineTop = currentOutlineTop - currentItemToScreenBottom;
                $formOutline.css('top', max(realOutlineTop, minOutlineTop));
            }

            if (currentItemToScreenTop < constant['TOP_POSITION_TRIGGER_MOVE_DOWN']) {
                var realOutlineTop = currentOutlineTop + currentItemToScreenTop + constant['TOP_POSITION_TRIGGER_MOVE_DOWN_DISTANCE'];
                $formOutline.css('top', min(realOutlineTop, maxOutlineTop));
            }

            if ($(document).scrollTop() + $(window).height() >= $(document).height() && ($formOutline.height() + constant['OUTLINE_BOTTOM_TO_BROWER_BOTTOM'] >= $(window).height())) {
                $formOutline.css('top', minOutlineTop);
            }
        }

        if (options.affix) {
            $(window).bind('scroll', scrollEvent);
            $(window).trigger('scroll');
        }

    }

    function formOutlineHide(options) {
        var $formOutline = "";
        var guid = "";
        if (options.insertContainer) {
            guid = options.insertContainer.attr("bh-form-outline-role-form-guid");
            $formOutline = options.insertContainer.find("div[bh-form-outline-role-outline-guid=" + guid + "]");
        } else {
            $formOutline = $("[bh-role-form-outline-fixed=bhFormOutline]");
            guid = $formOutline.attr("bh-form-outline-role-outline-guid");
        }
        $formOutline.removeClass("bh-fadeIn").addClass("bh-fadeOut");
        if (options.destroy) {
            //当大纲被销毁时，将绑定的guid也一并销毁
            var $insertContainer = options.insertContainer ? options.insertContainer : $("[bh-form-outline-role-form-guid=" + guid + "]");
            $insertContainer.removeAttr("bh-form-outline-role-form-guid");
            $formOutline.remove();
        }
    }

    function getFormOutlineHtml() {
        var _html = '<div class="bh-form-outline bh-animated-doubleTime bh-fadeIn" bh-role-form-outline-fixed="bhFormOutline" bh-form-outline-role-outline-guid="@outlineGuid" style="@style">@content</div>';
        return _html;
    }

    function getFormOutlineItemHtml() {
        var _html =
            '<div class="bh-form-outline-item @active" bh-role-form-outline-fixed-item-guid="@guid">' +
            '<div class="bh-form-outline-itemIndex">@index</div>' +
            '<div class="bh-form-outline-itemText bh-str-cut">@text</div>' +
            '<div class="bh-form-outline-itemCount @success">@count</div>' +
            '</div>';
        return _html;
    }

    function getEnterTagObj(e) {
        var $target = $(e.target || e.srcElement);
        var tagName = $target[0].localName;
        var $parentBlock = $target.closest("[bh-role-form-outline=container]");

        if (e.type === "click") {
            if (tagName === "input") {
                if ($target.attr("type") === "radio" || $target.attr("type") === "checkbox") {
                    checkAndRefreshCount($parentBlock);
                }
            }
        } else {
            if (tagName === "input" || tagName === "textarea" || tagName === "select") {
                checkAndRefreshCount($parentBlock);
            }
        }

    }

    function checkAndRefreshCount($editBox) {
        var statisticsData = {};
        statisticsData.editBoxCount = 0;
        statisticsData.enterEditBoxCount = 0;
        statisticsData = statisticsEditBox($editBox, "input", statisticsData);
        statisticsData = statisticsEditBox($editBox, "textarea", statisticsData);
        statisticsData = statisticsEditBox($editBox, "select", statisticsData);

        var $count = $("div[bh-role-form-outline-fixed=bhFormOutline]").find("div[bh-role-form-outline-fixed-item-guid=" + $editBox.attr("bh-role-form-outline-item-guid") + "]")
            .find(".bh-form-outline-itemCount");
        var countText = $.trim($count.text());
        var newCount = statisticsData.enterEditBoxCount + "/" + statisticsData.editBoxCount;
        if (countText != newCount) {
            if (statisticsData.enterEditBoxCount === statisticsData.editBoxCount) {
                $count.addClass("bh-success");
            } else {
                $count.removeClass("bh-success");
            }
            $count.html(newCount);
        }

        $editBox.data("formOutlineKeyUpCount", 0);
    }

    //统计输入框和已编辑的项
    function statisticsEditBox($container, tagName, statisticsData) {
        if (tagName === "input") {
            //存放radio和checkbox，一组radio或checkbox是一个输入项
            var radioCheckboxGroupData = {};
            //存放其他的input
            var inputData = [];
            $container.find(tagName).each(function() {
                var $item = $(this);
                if (!$item.closest(".bh-row").attr("hidden")) {
                    var type = this.type;
                    //radio和checkbox时，将name放入json对象中
                    if (type === "radio" || type === "checkbox") {
                        var name = this.name;
                        radioCheckboxGroupData[name] = name;
                    } else {
                        if (type !== 'hidden') {
                            inputData.push($item);
                        } else {
                            if ($item.parent().attr('xtype') === 'select') {
                                return;
                            }
                            if ($item.closest('.jqx-dropdownlist-state-normal').length > 0) {
                                inputData.push($item);
                            }
                        }
                    }
                }
            });

            //统计其他input的输入项
            var inputDataLen = inputData.length;
            if (inputDataLen > 0) {
                for (var i = 0; i < inputDataLen; i++) {
                    statisticsData.editBoxCount++;
                    var $item = inputData[i];
                    if ($.trim($item.val()).length != 0) {
                        statisticsData.enterEditBoxCount++;
                    } else if ($item.attr('type') === 'file' && $item.closest('.bh-file-img-container').length > 0) {
                        if ($item.closest('.bh-file-img-container').hasClass('saved') || $item.closest('.bh-file-img-container').hasClass('success')) {
                            statisticsData.enterEditBoxCount++;
                        }
                    } else {
                        //文件上传统计
                        var $uploadFile = $item.closest('[xtype=uploadfile]');
                        if ($uploadFile.length > 0) {
                            if ($uploadFile.find('a.bh-file-upload-name-a').length > 0) {
                                statisticsData.enterEditBoxCount++;
                            }
                        }
                    }
                }
            }

            //统计radio和checkbox的输入项
            for (var key in radioCheckboxGroupData) {
                statisticsData.editBoxCount++;
                var value = $container.find("input[name='" + key + "']:checked").val();
                if (value) {
                    statisticsData.enterEditBoxCount++;
                }
            }
        } else if (tagName == 'select') {
            // 如果是表单的select的话，没有select标签的
            $container.find('[xtype=select]').each(function() {
                var $item = $(this);
                if (!$item.closest(".bh-row").attr("hidden")) {
                    statisticsData.editBoxCount++;
                    var selectValue = $item.jqxDropDownList('getSelectedItem');
                    if (selectValue && selectValue.value != '') {
                        statisticsData.enterEditBoxCount++;
                    }
                }
            });
        } else {
            $container.find(tagName).each(function() {
                var $item = $(this);
                if (!$item.closest(".bh-row").attr("hidden")) {
                    statisticsData.editBoxCount++;
                    if ($.trim($item.val()).length != 0) {
                        statisticsData.enterEditBoxCount++;
                    }
                }
            });
        }

        return statisticsData;
    }


    function NewGuid() {
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }

    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }

})(jQuery);
/**
 * 图片查看器的插件
 * 使用此插件前请添加资源服务器上的相关的依赖
 * 依赖:
 * 1. galleria 基本库
 * 2. 相应的 theme (可以使用多个 theme)
 */

;(function($) {
    var Galleria
    var DEFAULT = {
        width: 900,
        height: 700
    }

    var BhGallery = function(options) {
        this.options = $.extend({}, DEFAULT, options)
    }
    $.extend(BhGallery.prototype, {
        show: function() {
            var _this = this
            var $template = $('<div class="bh-gallery"><div class="bh-gallery__backdrop"></div><div class="bh-gallery__main"><div class="bh-gallery__gallery"></div></div><div class="bh-gallery__close iconfont icon-close"></div></div>')

            $('body').append($template)
            var $main = $('.bh-gallery__gallery', $template).css({
                width: _this.options.width,
                height: _this.options.height
            })
            Galleria.run($main, this.options)

            this.resizeGallery($main)

            /**
             * niceScroll 会有一定的延迟,没有具体研究,感觉上是等页面重新渲染完成后 niceScroll 会重新进行一次绑定
             * 所以立即执行会不起效,延迟执行
             */
            setTimeout(function () {
                $('body').getNiceScroll().hide()
                // $('.bh-gallery__main', $template).niceScroll()
            }, 1000)

            $('.bh-gallery__close', $template).click(function() {
                $template.remove()
                $('body').getNiceScroll().show()
            })
        },
        /**
         * 因为如果图片查看器的尺寸超出了尺寸的话需要出滚动条, 吐过采用 css 居中的话无法根据情况显示位置
         * 并且因为是绝对定位居中,无法出滚动条,因此采用 css 计算来居中
         */
        resizeGallery: function($gallery) {
            var windowWidth = $(window).width()
            var windowHeight = $(window).height()
            var galleryWidth = this.options.width
            var galleryHeight = this.options.height

            if (galleryWidth < windowWidth) {
                $gallery.css({
                    marginLeft: (windowWidth - galleryWidth) / 2
                })
            }

            if (galleryHeight < windowHeight) {
                $gallery.css({
                    marginTop: (windowHeight - galleryHeight) / 2
                })
            }
        }
    })

    $.bhGallery = function(options) {
        Galleria = window.Galleria
        if (Galleria === undefined) {
            $.getScript('http://res.wisedu.com/bower_components/galleria/src/galleria.js').done(function() {
                Galleria = window.Galleria
                $.getScript('http://res.wisedu.com/fe_components/galleria/standard/galleria.wisedu.js').done(function() {
                    if (Galleria === undefined) {
                        console.error('please include Galleria lib');
                        return
                    }
                    if (options.showType === 'page') {
                        Galleria.run(options.selector, options)
                    } else {
                        (new BhGallery(options)).show()
                    }
                })
            })
        } else {
            if (options.showType === 'page') {
                Galleria.run(options.selector, options)
            } else {
                (new BhGallery(options)).show()
            }
        }
    }

}(jQuery));

(function ($) {
    /**
     * 定义一个插件
     */
    var Plugin;
    //全局变量
    var space = {
        nav : [],//缓存菜单数据
        //默认用户头像的图片，用于当用户图片出错时的展示
        defaultUserImg: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAIAAABMXPacAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAFnFJREFUeNrsXQmUXFWZfve+rV5VdVXv3emk0xAJCZ0ACQmEBCIBgxgGIaARUVQE5zijOHMcnZkz5+iMjuegM8eFEUdHiQgqjjIgBySAwawCWYidQCfpTkIv6aV6qX1/673zv6rqSlV3JSTdVV3Vqbqnc5KuvHrL//3L9//3vv+iO/90kqmM4g1cEUEFgAoAlVEBoAJAZVQAqABQGRUAKgBURgWACgCVUQGgbAY35x+g5yB/bCfr6kZyCH6lLE8lJ6mdb8xbQmoXGPOvoPa6CgAzsNDACHb3se5+5BtGaswUsaXKlG/rVUbT+yw7/kfc84scX+t9K/k3tVVryzYq7/8MgFEB4LwHMVhXF3/ide7kmxhEL4dzHIOQ0fg+duzdc58JRQPCwWf5rl2xe76hL7mxBJ8VzdJ8AKUMJQxmz30UeBK+azfXtRcAyPP1eUv0wZ8YbSvK1wLEXVtJ82Kt/WZQ3iwnExzDYz1czwGu7y+m3AkpiKJpsvX5f4984ddUsJYlACB0QbI+/RWIikbzEnDNIBEU9WPPAPYPo3hoNsLJeB//9qvqtfeUqQWoK/9K/PNT7HAX/BTrafnD29TVd08ywXLJA4AOxjd//T3DQGHVbegoGFz5JmJa+4bop35A6lqL9ri6ij2nSwoAdsmnvzSrDLO+Tbvmw6SmBekqUKPcFLOgN9C8GDI1HBxlEGZKICCjIi5LsbzyKESFWb4o8FFEDMbQwCVqy26WN34RGEG5uKAs6W//kfj6r4qgcZoM0jf/EfEKB561PfUwigfLCwAU9lp/84/i7p+bqVnRXfDQMcsfHysjAPjO7fafPsAf/VPphEGh4w/Y3X/x5wFc7yHh9V/z3XtKrRgA1IjvfE255a8vIgCIASSHcgJSIjjkZvsPg8pzPQeZUh1c71sXGwCWF78NWQ+jxACAUvD17xEJxnuRHKEW+8USAzhBXfcJFPbh4FjpS9/kBbEACo1fVEHYaFkafegnkHCd/aHzeWlCiKYqiiLruj49k8Vhz8XGgoyWK6Kfe1xbetPkVEiwqtffmy97NwwjHo/xvLBo8RVXrri2vrFpejDMTkV2tlkQWEDs049yJ9/g336VHT1lTmO1Xqmu2YLksHDgmZnmtJQqcry6tv5Dt2xZu35jY3MLx/HRSGjfn3e8+sIzfp8nAY/O8Tx8fj5c6KKlofrlN8BP5idmBYLSGZ1T18DtrNvwwbvv/eyC1jZN10DrCTFsdsemu+5dtWY9ABAOBU51dXYcfMM1dFoQRMyeqxCLiH7RApDD8XkGpuHlMU45THAyDkf1vZ/+m/Uf2EQpicWiGR5JN+J6TV19fUMTwvjatTfdvvm+nX98Ydvzv1VVGTzVOQyqnAAAbnohrgb0vbqmLh6NAAzg8cHdf+7hf1p02VL4N80lOEPXDSal0Vab/SOfeOh9l7f/9L8eAZs4GwYUF0kUxeF9avQCHL0ib7j1jiXtV8ng8uMxUOqvfv0/2hYtBsWn56G2YBOxaGTF6rV/++WvWSwSBO2zUecyAgCd38x7IszKm+782P0PfWl48LQs6x/YtPmLX/23Kkc1fH5BVwQMrl51/eZ7H9C03MGWitYyAoCy52Xvcjy28fbNn/rc34VCQZ9nbPOW+x74/D8ghM8mxHOPeCy6cdPmpctWgEnlAsBWTgBIzrOp/Bl5gbdZt+GTDz5MKA34POCF7nvgC4Y5pklXIH4IomXTnVtYzE72XSxHJUcZAUAaL82ZUp2JEarS2rboM5//MstxkOI6nNW3fXgLiB6I5oxCjyIvX7G67dLFmqZlW6TAWKrKCAD90lWT1oaoirJk2dW33HYniB5UFbKn+x96uLauQVNV+NVZXQtk5qzx80KMQLLaV11/IzGyAGAEiQpSGQFgtK0gzqZMz8Pz/EfvexAYDkYIyM7Nt374ypVrIAakD6B54umGri2/erXFaicZRIBaHbSsWJD5tCyf6XCuuPKay9uvsjucosXaNG/+Hfd8Qs/2EnkzPl1valnQ2NSSaU+kuqW8aCiDMOUtmRaw8tq1kOiCrxctlo2b7q5raILkqyDhhxCb3TG/tc3IKNgZC5YxRRpFWxVhOJrSErFabZCpJsnlZZe3r33/RlWRC4g+Qi0L2gD31A1AtnHJqrIDAC++LumFKTEgxtbU1RNgOZoG0odfZx5vz+0CG5vnAxCm9A1DbFtOL7uuvACoYsn72y8DJwPOx0iQHIvFapIfjl+6fEWBnM8Z8RPqrK6BsJ+ocyirl7XfWquXFwCfrA5tubyhuWUBOGIKLshu5wWREMoLgihaaIELk4QSm80OwQayCoskrV+z5jMOXx1rlAsAAqLtfBTi7crV61RNBXGD2FmzWE8nJcOFsgBKRUnieEFV1MuWLFt02VKkK5fwarkAIGFiwwR0/4YNH6xyOEHxWXZW16wn0g4BLgqXhpAD8MMnzvKxAPN1MQYB52m7dPGaG26W5dnQ+kl3gDEL4XfeggUrr10HWYhZDWJouQAgUxw0cLL4c/td99bVV5mVfTKrq1cSJVVt7Y0fqKmtTzIujaJyAUClaEAz004wgpbWtjvuvi8cDEIwQLP35hDSNRWI7w0336Yl1B+G1yinGbH98dTshyzLt95xz9JlV0VCQYTwbKk/E49H19x4y7z5rckFLH6D7dHKqRRxRJbGdS5ByYkgWDZt/jgQUDpba+gg4bDbHetvvi1dbjoQt8YILiMAFIp2x1ILsyD/NVl54el/JgBVzmqHsyaZissUvRYtzmRAMUsRu6L2gMGmJTLLRAguly5HvxapGtO5sgMgTPAfIg6m2MOl88W9jWL2C9oZtZ9QxSLeAPCxx/21xfL+xQcAqPePfPUQkIuSAh2KW7/rbThVVA1git4xC/gfSOGN2GwvCTEoejJYc1yxFN0HlkTLsj2zDoDbYIvreUoLAPADQxo/m1fskK0qRRUAUkOnaO8sGgFkIRD/mdIYpdI18fWYLTRbPmFP1D6qcxUAskaIsDtmJR2FC71QAvlHyQEAY3ukylP4kuQLYUfQYCsA5M6NIS0yChkbuxTLjpLx/iUHAIxjiuWZkLNAJ48Q/PNArU5RBYBzjW0Rx64CKCkk2z/z15VO7C1dAGD8MlhzLN856m+CNR2yVIIPW4oAaBT92Fc3rOctNXsx7HglUsWU5CjR7ulBwj7qbfDng66A6J8JVTOlOkq3ff2Izj3mq5fp9O+QRcwrUcfTwRqmhEdJ7x9wUhW/7wUM0DRarRKEnvDXPB2oZkp7lDQAmDK9Cu/yB6mhI3zet4oQj8hej3A4YLFqhmAQtkhvwZ/PKC1a5sCIiasipSIhPKWYUBvVORoOGSGLvVaUrImlK5RJr+2nkyRv/qHEiATdcsDpjDuasLnoSkdIYXEEISKJfjigAkDOUcXiuxoc/mBs0B2QNZ3D2KDYwakSSzSNqH43HxUtVjvHC2ANKLG6P3MtFzWn2omhqbFIiGqxRl7k5JSosUEkQtqctram6o6YcjQiVwDIMVZVSVaOrWpw1lVJ/WOB8WBEBwvAGocMgwGJM5qqwA9KjJTss2ODudIhsdYBwHNgRUAG5L2EkipJvKSxpsFpBVe0ksW9cTVmkAoAWaOBMZbVOEG+OmirwLcvbGgK2U6MhWuoi2WIkYhVaX2nie0gaHaHk5RFJI6B/7Nj1WK2rLNdUl+9oN7BsayRwMbKstfXOne6/ZUgfGb4D+9TXnueNQeXEB81CK1zWK9Z1FzX2CIzFpZqk/09g1LynhiZ1gBxgGf0thrx6kXzLm2uAY9lTKwCkmxVpPvI8P9trVhAakROHj39xPdOhoNIjnzy4X9mOS75/iJgIGCqVi86ZW1oDB+vjQ8ghhD0HqkZHIOoEeNqRx3L6qRmAEU/422Q1W47sPOVx7/zNTkWYRCe/9EHi/74s909fdIIH36z74nvETmGWdx95K2Az7ti7U1gB+lla6DLhBWDUmuUrxX1CPwkuc5ZaKtuYGHU3u6quUYRauC7aR8FJmK12fa+8sLPHvkXRY5DJI/2djMsW7V4eZkCoJzq9D7/i6GXfmskFoiDgEAopzoPe8ZcK9dt4Hj+DAYMZMNE5asBBh0JkhbgqUJNPooyRA90kwakhYM114VsC5HpW0kGPUUWq23nC7974j//1TCMdM+m4PHDdXarrb7ZEKVyAuD0Cc/vnxh7+XfyuAsUFFwEmhATz/M9Xe+MDQ+uXHsTLwiZ3QTAt4DTiFiaQtI84KWSHkoDALKWeedw9Sq3ox3MBewAZSUHyCJZtz/39JPf/xZ8I7OBH8dx0d6u0IGdDjkkNTTrkv1iBgBRah3ti7z8dN9zT0VHhhJ0BQg9NnQjK4kVxN6uztGhgVXrb4F4MOnNGWzuMWYJWBfqhuFUx8AOMCUh1tlbv0ER6xKin5xmQdTd+YdnnvzeNyGJgxOe4ayUEQUgR1hVFPepLv/+nbWYWOYt1HnxIgRACnnkbb/q+t/HPf09IPp0+73kXzohmToLGPSfOOb3uK+58RaM8KT3BkyPhPBpnzyfuHgWcYh0yvWKo82Cc1B7yWbft+Plrd/5mvmoXBbjAGokCHySSsH96Lo+euxto6ujYcFCrbrxogLAOdjd9dg3h453wnMC05z0KpLJEaf0YIJ40HP8bTkWXbHuJsikJrU0hK90jUUaUKjFoikMtzPY7Kyps/J40hp30Wo9+U7Hf3/jK5oiQ1DJStkoNbuJcmymp4J7iwQDowf2LGxp1prbLhIAqt49/NYPv6XE4+Dfc74FBtIkhBoGzfzPREzmT7x9SLRYlq9am9k5RRCEU93Hf//U1iPH3t33Ts+rHQP7Dx93D/RcsfwqjjtTdgMz8o6NPPb1v/eOjwqiZUq9DolCjvsBFQFsXB37Fy2YrzYtnPN5gMP17l9+/B1iGOd4ExhEBsqo68ZUGYHgnt36WPPCS9Zs+FB8ojkoOPJTx4/2Hdk/bLUnUKOY6IHhvjvu2VJb38Ak+q+CHOGiT33/W4O9p8AL5dA7FuOzlFfN7xLy1tZHr/tqXaj1ijmcCVvkcPfW72qa9p7vYcMzQzScWjPG5rvU5Fc/eGRkoA80egIwMtTfJ1gsoMJWkZNEHv4NgTTo96VlKlik7c/9+tDeP+WUfhLyc0wxJDCgJ578oaRE5zAAxusve0dHOO69jQyZjJDNKREgo+7R4d/95Ltm8WfiCKfTaWSxI3qmTASPxAv+od5tTz/Oi+JZ5Gu6+3PPEcD9eEZG9DdfnasA2CK+k9tf5Pnzmlinpk9g04YyqT0Z5FD7dv3x2O4Xax12g1BwVp+9/2PzGhvSLdJlWVm1csXSpUsVVSOUWdpkP7jtN+7x8TTlpxktKMxNLfnzcrw8z/XueEkq8E5nhQJA79wfjUYxvoDzg0+RJNOziEAPTYKO08EAs/yzv9x6qRCtr7LEZOW6ZZfcv+WuWFxOVUYR+uzHN9skEaxk1QKHNTLy0kvbLJKU9ic8y4pmHxYBTi9J0vkYZfKLwUAA93TOPQBYQx89uPeCpJ+6GyA/HAfyNylTxtdBdse7T+7e/uraVtuiWgmS4gc+/pFFba2aroPWr1zevnH99VUsWdPqmF/FvbZrz8joeFrKCUKVOCfHgfO5oMll+K7n0BuokC8wFwQAi3/Uc7pvej1QwLGAS4nHZS17EwYIyM+9+BKIb0WLTUBMTU31xzbfDkdCkL/x+tUA2NIGS6Pd9Dlv7NufyS8NwzBPKCvT2NUBrNDd3SnGI3MMANLXpSjKNHo/gD+RQaUT3TPQZAcldhw+0tPTy0zMgzmr7HA8XMXt8aaPBzy6urr5KV7e3GjDREu/oJsCI47FYni0fy4BgCnxHT00vc4bCCNwFDlb+YM9+fz+nXv2pj8JhSOme2HZvsHhdIx1jYyOjI3l9PKJXBdf6AIJQE7pPzGXABDikfFTJ6bZg4ma3ONswQNkvWPX7vSv0VgcUGY5dnhkLBJNtXh1uVwBfyDn1QHaadwVwObv7ixcGMg/AKxnWI5Gpt17xiQtPJdTT0VRPPL2O8PDrhQAcRkl6qnBUHhkLLUJVW9//9l8feK0dBr3ExgaEKPBOQOA4eqH+DltAJJlMnPdSS4v5Ha739x/IPkreGez8RJCkUh00DWa/HBwcIhMkTJ8ANqf85znA0AkEubD3rkBAGJo8NSxaRDQSYmxYPaUzA3P7r1/TgEQjyen4wHv04OpjcqHXa5cbsT0P9NeHmdSg74TcwMAVo4GB/tn2PuKJioBEDBzBBhBONTRYeq+GQPk5HXgcj39qV2BRkbGJjn6VJo9E52gND58GhVmfWO+AYhHQl7PDC0gpbO5CgbA9wcGhjqPHmPMHR7iyfVxcLn+AdMCVFUdBQqUDQBKhN8ZyQjCTP+72NDmAgDjw/oMAkCW106UjKdyElmOv/7mPhMAOZVqwJGj425wRBAM/AH/pG8lZoEwnRkAIfeYKEfnAACqZyRfbZ+TRjDV7oF3Hjj4lqpqOlwIJYMzHnV7IC3w+rwxk5uiTCAzp72m/1yqynhH5gIAI4P5OlXSCKZGAlEQj3d39/T1EUKTpR3Q0Gg07hp1+7w+8EuZFpCsPM9YFRAk2Mg/XuoAQLYSdA3OPABkGoEARjCFjHq93jf3H8xYoYsUVR0Ydnm83swSyEzY52Qxsaz/5LFCAJDPKUlRjUe97jy2/wQJmstFMc6efmFA93ft2SsrZ1qNGsToPT3EG/GsFaKI4dg8vZxBacwzJhHDwGzpAmD4xrV4LL/9V1Eig9VB1tlcqOPwEc7RmLY2juV6+wc4LYwnmo8m1R/0Py/yh4Q7NuZqjIcNW3XpAsDpKrhgjsvnOZMsHozAXECHsrJTgbUilk9W7kDUPX2neS2UjhnJ5MsEMB8IQLAJB4OCpqil7IKwf7wQ3SeTdMgwsp+dGERT8MROQKDsQyMjTMyXngRNsU+ar3tAhBBj5DRT3VS6QTg0PJDHCDwpEkylQwBABtthw+Gw3+dLHkbPPss/7aGDDQbzXxHKp7z0WKRA/VdzJcaI6iqTrhKjxBa2Zh00QUzzGH4zwlF8qL90ATBXQgW8BXoBMWkEWeZlvg2pU5B4Ws8n1jcmDubywj6z6C/GweEBRIwSBQBpqhzw4YK1oE/SoazJMgpeWZ2Yi0TUBIBOhN/878cAYSDq94iaXKIAmO+HBgOF2wOAJqjOpH3h6ZkwQCmZ8D+JZYeFsEU9HmcC7hIFwIKoHIsWdBOGKdWhZBgwEtMQlCaqlWbxh+UKcRfJCXpOLVUL4GMhpsDbkEyuDiXDgKEn346nqWW5iMsf+5xyA5QZHShRANSAbxZaAKTmtjLCABgBmJ0JAyEp9okLFocQDo+6ShSASMDPZPcOKJQRcJnTW4joZhigZjSmCEKEYClcZw7zPfygm83rCom8AWAVOEVRmFkwAnOG68ye5GAB1HzBw9wVEfEWhpOYgm1IBf4tOjLE5pUI5Q0ADrIwZjZGws9wyXfqU97fUAEAc92VaKW4gK+cIIwDPr+NpaUIgBosYBIw1Rlz5qY/Ka9kKDGzoRArYF4q7EJahFRV5fz5ZKJ50xc1XKilSznKG5RyiNHMl8uIWSZTomYTA6sDYjFWwzSjn1DejU/VdBwLliIAUa976huQ+UpBc0YCQeCVZHkYCCjCvCDyehhyA6aQ+5HJqmKL5bMk9/8CDACwy99BIeOUywAAAABJRU5ErkJggg=='
    };

    /**
     * 这里是一个自运行的单例模式。
     */
    Plugin = (function () {

        /**
         * 插件实例化部分，初始化时调用的代码可以放这里
         */
        function Plugin(element, options) {
            //将插件的默认参数及用户定义的参数合并到一个新的obj里
            this.settings = $.extend({}, $.fn.bhHeader.defaults, options);
            space.nav = this.settings.nav;
            space.isNavHide = this.settings.isNavHide;
            //将dom jquery对象赋值给插件，方便后续调用
            this.$element = $(element);
            space.$dom = this.$element;
            init(this.settings, this.$element);
        }

        //重置导航高亮位置
        Plugin.prototype.resetNavActive = function (options) {
            options = $.extend({}, {
                activeIndex: NaN  //高亮位置从1开始算起
            }, options);
            resetNavActive(options, this.$element);
        };

        //显示导航菜单
        Plugin.prototype.showNav = function (options) {
            showOrHideNav('show');
        };
        //隐藏导航菜单
        Plugin.prototype.hideNav = function (options) {
            showOrHideNav('hide');
        };

        return Plugin;

    })();

    function init(options, dom){
        //初始化头部
        var _html = getHeaderHtml(options);
        dom.html(_html);

        //初始化用户详情
        userInfoInit(options);
        //头部事件监听
        headerEventInit(dom, options);

        if(typeof options.ready !='undefined' && options.ready instanceof Function){
            options.ready();
        }

        //监听头部图片加载完成，计算nav导航的可用宽度
        listenImgLoadComplete(dom);

        $('html').on('click', function(e){
            var $targetObj = $(e.target || e.srcElement);
            //隐藏角色选择
            if($targetObj.closest('div[bh-header-role="roleBox"]').length > 0 || $targetObj.closest('div[bh-header-role="roleSwitch"]').length > 0 ){

            }else{
                $("[bh-header-role=roleBox]").removeClass("bh-active");
            }

            //隐藏个人信息
            if($targetObj.closest('div[bh-header-role="bhHeaderBarInfoBox"]').length > 0 || $targetObj.closest('img[bh-header-role="bhHeaderUserInfoIcon"]').length > 0 ){

            }else{
                $("[bh-header-role=bhHeaderBarInfoBox]").removeClass("bh-active");
            }
        })
    }

    function getHeaderHtml(data){
        var headerContent = getHeaderContentHtml(data);
        var _html = '<header class="bh-header sc-animated" bh-header-role="bhHeader">'+headerContent+'</header>';
        _html += '<header class="bh-header-mini sc-animated" bh-header-role="bhHeaderMini">'+headerContent+'</header>';
        _html += '<header class="bh-header-bg sc-animated"></header>';
        if(data.openTheme){
            _html += getThemePopUpBoxHtml();
        }
        return _html;
    }

    function getHeaderContentHtml(data){
        var _html =
            '<div class="bh-headerBar">' +
                '<div class="bh-headerBar-content bh-clearfix">' +
                    '@asideNavIcon'+
                    '@logo' +
                    '@title' +
                    '<div class="bh-headerBar-menu">' +
                        '@userImage' +
                        '@dropMenu' +
                        '@themeIcon'+
                        '@icons' +
                        '@navigate' +
                    '</div>'+
                '</div>'+
            '</div>';

        return _html.replace("@logo", getHeaderLogoHtml(data)).replace("@title", getHeaderTitleHtml(data)).replace("@navigate", getHeaderNavigateHtml(data))
            .replace("@icons", getIconHtml(data)).replace("@userImage", getImageHtml(data)).replace("@dropMenu", getAndAddDropMenuBox(data))
            .replace("@asideNavIcon", getAsideNavIcon(data)).replace("@themeIcon", getThemeIcon(data));
    }

    function getAsideNavIcon(data){
        var isShowAsideNav = data.showAsideNav ? 'display: block;' : 'display: none;';
        var _html = '<div style="'+isShowAsideNav+'" class="bh-headerBar-asideMenu" bh-header-role="bhAsideNavIcon"><i class="iconfont icon-menu"></i></div>';

        return _html;
    }

    function getThemeIcon(data){
        var _html = '';
        if(data.openTheme){
            _html = '<div class="bh-headerBar-iconBlock" bh-theme-role="themeIcon"><i class="iconfont icon-pifu"></i></div>';
        }
        return _html;
    }

    function getHeaderLogoHtml(data){
        var _html = '';
        if(data.logo){
            _html =
                '<div class="bh-headerBar-logo">' +
                    '<img src="'+data.logo+'" />' +
                '</div>';
        }
        return _html;
    }

    function getHeaderTitleHtml(data){
        var _html = '';
        if(data.title){
            _html =
                '<div class="bh-headerBar-title">'+data.title+'</div>';
        }
        return _html;
    }

    function getHeaderNavigateHtml(data){
        var _html = '';
        var nav = data.nav;
        if(nav){
            _html =
                '<div class="bh-headerBar-nav-more"><i class="iconfont icon-keyboardcontrol"></i></div>'+
                '<div class="bh-headerBar-navigate @isHideClass">' +
                    '@content' +
                    '<div class="bh-headerBar-nav-bar bh-single-animate"></div>' +
                    '<div class="bh-headerBar-navBar-cover"></div>'+
                '</div>';

            var navContentHtml = "";
            var navLen = nav.length;
            for(var i = navLen-1; i>=0; i--){
                var guid = BH_UTILS.NewGuid();
                var navItem = nav[i];
                navItem.guid = guid;
                //当导航菜单只有一项的时候，默认让该项隐藏
                if(navLen === 1){
                    if(typeof navItem.hide !== "boolean"){
                        navItem.hide = true;
                    }
                }
                navContentHtml += getHeaderNavigateItemHtml(navItem);
            }

            var isHideClass = data.isNavHide ? 'bh-nav-hide' : '';
            _html = _html.replace("@content", navContentHtml).replace("@isHideClass", isHideClass);
        }
        return _html;
    }

    function getHeaderNavigateItemHtml(data){
        var _html = '<a class="@itemClass" href="@href" @target bh-header-role="@guid"><div class="bh-headerBar-nav-item @active" @attribute>@title</div></a>';
        var active = "";
        var attribute = "";
        var href = "javascript:void(0);";
        var target = '';
        var guid = 'nav-'+data.guid;
        if(data.active){
            active = "bh-active";
        }
        if(data.className){
            active += " "+data.className;
        }
        var attributeData = data.attribute;
        if(attributeData){
            var attrLen = attributeData.length;
            if(attrLen > 0){
                for(var i=0; i<attrLen; i++){
                    var key = attributeData[i].key;
                    var value = attributeData[i].value;
                    if(key && value){
                        attribute += key+'="'+value+'" ';
                    }
                }
            }
        }
        if(data.href){
            href = data.href;
            if(typeof data.isOpenNewPage === "boolean"){
                target = data.isOpenNewPage ? 'target="_blank"' : '';
            }else if(typeof data.isOpenNewPage === "string"){
                target = $.trim(data.isOpenNewPage) === 'true' ? 'target="_blank"' : '';
            }
        }
        var itemClass = '';
        if(data.hide){
            itemClass = 'bh-hide';
        }
        var title = data.title ? data.title : '';
        return _html.replace("@active", active).replace("@title", title).replace("@href", href)
            .replace("@attribute", attribute).replace("@itemClass", itemClass).replace("@target", target)
            .replace("@guid", guid);
    }

    function getIconHtml(data){
        var _html = '';
        var icons = data.icons;
        //添加问题反馈，应用说明
        if(data.feedback || data.appDetail){
            if(icons){
                icons.unshift({
                    "className": "icon-erroroutline",
                    "attrs": {"bh-header-role": "ampSwitch"}
                });
            }

            addAmpItemToBox(data);
        }
        //if(data.appDetail){
        //    if(icons){
        //        icons.unshift({
        //            "className": "icon-helpoutline",
        //            "attrs": {"bh-header-role": "appDetail"}
        //        });
        //    }
        //}
        if(icons){
            for(var i= 0, iconLen=icons.length; i<iconLen; i++){
                var iconData = icons[i];
                var iconClass = iconData.className;
                if(iconClass){
                    var iconAttr = iconData.attrs;
                    var attrStr = '';
                    var href = iconData.href ? iconData.href : 'javascript:void(0);';
                    if(iconAttr){
                        for(var key in iconAttr){
                            var value = iconAttr[key];
                            attrStr += key + '=' + value + ' ';
                        }
                    }
                    _html += '<div class="bh-headerBar-iconBlock" '+attrStr+'><a href="'+href+'"><i class="iconfont '+iconClass+'"></i></a></div>';
                }
            }
        }
        return _html;
    }

    function addAmpItemToBox(options){
        var ampItemsHtml = '';
        if(options.feedback){
            ampItemsHtml += '<div class="bh-headerBar-roleBox-title" bh-header-role="feedbackBox"><a href="javascript:void(0);"><i class="iconfont icon-assignmentlate"></i>问题反馈</a></div>';
        }
        if(options.appDetail){
            ampItemsHtml += '<div class="bh-headerBar-roleBox-title" bh-header-role="appDetailBox"><a href="javascript:void(0);"><i class="iconfont icon-helpoutline"></i>应用说明</a></div>';
        }
        var _html =
            '<div class="bh-headerBar-roleBox bh-card bh-card-lv3 bh-headerBar-popupBox-animate" bh-header-role="ampBox">' +
                ampItemsHtml +
            '</div>';

        $("body").append(_html);
    }

    function getImageHtml(data){
        var _html = '';
        var image = data.userImage;
        if(image){
            _html = '<div class="bh-headerBar-imgBlock"><img src="'+image+'" bh-header-role="bhHeaderUserInfoIcon" /></div>';
        }
        return _html;
    }

    function getThemePopUpBoxHtml(){
        var _html =
            '<div class="bh-header-themelist jqx-dropdownbutton-popup">' +
                '<ul>' +
                    '<li class="selected" title="blue">' +
                        '<span class="bh-header-colorCard-text">蓝色皮肤</span>' +
                        '<span class="bh-header-colorCard-blueTheme"></span>' +
                        '<span class="bh-header-colorCard-bluePrimary"></span>' +
                        '<span class="bh-header-colorCard-blueSuccess"></span>' +
                        '<span class="bh-header-colorCard-blueWarning"></span>' +
                        '<span class="bh-header-colorCard-blueDanger"></span>' +
                    '</li>' +
                    '<li title="purple">' +
                        '<span class="bh-header-colorCard-text">紫色皮肤</span>' +
                        '<span class="bh-header-colorCard-purpleTheme"></span>' +
                        '<span class="bh-header-colorCard-purplePrimary"></span>' +
                        '<span class="bh-header-colorCard-purpleSuccess"></span>' +
                        '<span class="bh-header-colorCard-purpleWarning"></span>' +
                        '<span class="bh-header-colorCard-purpleDanger"></span>' +
                    '</li>' +
                    '<li title="lightBlue">' +
                        '<span class="bh-header-colorCard-text">淡蓝色皮肤</span>' +
                        '<span class="bh-header-colorCard-lightBlueTheme"></span>' +
                        '<span class="bh-header-colorCard-lightBluePrimary"></span>' +
                        '<span class="bh-header-colorCard-lightBlueSuccess"></span>' +
                        '<span class="bh-header-colorCard-lightBlueWarning"></span>' +
                        '<span class="bh-header-colorCard-lightBlueDanger"></span>' +
                    '</li>' +
                    '<li title="green">' +
                        '<span class="bh-header-colorCard-text">绿色皮肤</span>' +
                        '<span class="bh-header-colorCard-greenTheme"></span>' +
                        '<span class="bh-header-colorCard-greenPrimary"></span>' +
                        '<span class="bh-header-colorCard-greenSuccess"></span>' +
                        '<span class="bh-header-colorCard-greenWarning"></span>' +
                        '<span class="bh-header-colorCard-greenDanger"></span>' +
                    '</li>' +
                '</ul>' +
            '</div>';
        return _html;
    }

    function userRoleBoxHtml(menuList){
        var _html = "";
        var dropItemsHtml = "";
        var activeData = "";
        if(menuList){
            var menuLen = menuList.length;
            if(menuLen > 0){
                for(var i=0; i<menuLen; i++){
                    var menuItem = menuList[i];
                    var text = menuItem.text ? menuItem.text : '';
                    var href = menuItem.href;
                    var id = menuItem.id ? menuItem.id : '';
                    if(!href){
                        href = "javascript:void(0);";
                    }
                    if(menuItem.active){
                        activeData = menuItem;
                    }
                    dropItemsHtml += '<div class="bh-headerBar-roleBox-title"><a id="'+id+'" href="'+href+'">'+text+'</a></div>';
                }

                _html =
                    '<div class="bh-headerBar-roleBox bh-card bh-card-lv3 bh-headerBar-popupBox-animate" bh-header-role="roleBox">' +
                        '<div class="bh-headerBar-roleBox-explain bh-headerBar-roleBox-title">选择角色</div>' +
                        dropItemsHtml +
                    '</div>';
            }
        }

        return {"html": _html, "active": activeData};
    }

    function getAndAddDropMenuBox(options){
        var headerRoleHtml = "";
        var menuList = options.dropMenu;
        if(menuList && menuList.length > 0){
            var dropMenuData = userRoleBoxHtml(menuList);
            $("body").append(dropMenuData.html);

            headerRoleHtml =
                '<div class="bh-headerBar-roleSwitch" bh-header-role="roleSwitch">' +
                    dropMenuData.active.text +
                '</div>';
        }

        return headerRoleHtml;
    }

    function headerEventInit(dom, options){
        //页面滚动时切换头部的normal和mini头
        scrollEvent(dom);
        //头部菜单事件监听
        navigateEvent(dom);
        //主题切换事件
        if(options.openTheme){
            themePopUpBoxInit(dom);
        }
        //角色切换事件
        roleSwitchEvent(dom, options);
        //平台组件绑定
        ampSwitchEvent(dom, options);
        //用户详情事件
        userInfoIconEvent(dom);
        //侧边栏导航事件
        asideNavEvent(dom);

        //nav菜单more的事件
        //moreEvent(dom);
    }

    function scrollEvent(dom){
        $(window).scroll(function (e) {
            var $window = $(window);
            var scrollTop = $window.scrollTop();
            var $headerBg = dom.find("header.bh-header-bg");
            var $miniHeader = dom.find("header.bh-header-mini");
            var $normalHeader = dom.find("header.bh-header");
            var operateHeight = 44;
            //使头部的底色高度变化
            if(scrollTop < operateHeight){
                $headerBg.addClass("bh-headerBg-show").removeClass("bh-headerBg-hide");
                $normalHeader.addClass("bh-normalHeader-show").removeClass("bh-normalHeader-hide");
                $miniHeader.addClass("bh-miniHeader-hide").removeClass("bh-miniHeader-show");
            }else if(scrollTop == operateHeight){
                $normalHeader.addClass("bh-normalHeader-show").removeClass("bh-normalHeader-hide");
                $miniHeader.addClass("bh-miniHeader-hide").removeClass("bh-miniHeader-show");
            }else{
                $headerBg.addClass("bh-headerBg-hide").removeClass("bh-headerBg-show");
                $normalHeader.addClass("bh-normalHeader-hide").removeClass("bh-normalHeader-show");
                $miniHeader.addClass("bh-miniHeader-show").removeClass("bh-miniHeader-hide");
            }
        });
    }

    function navigateBarInit(dom){
        var $navigate = dom.find(".bh-headerBar-navigate");
        var $activeItem = $navigate.find(".bh-active");
        if($activeItem.length > 0){
            var index = $activeItem.closest('a').index();
            //重置头部的高亮位置，避免路由跳转导致数据不对称
            dom.find(".bh-headerBar-navigate").data("nav-init-active-index", index);
            //设置菜单active条位置
            setHeadNavBarPosition($activeItem, $navigate);
        }
    }

    function navigateEvent(dom){
        var $navigate = dom.find(".bh-headerBar-navigate");
        var $navItems = $navigate.find(".bh-headerBar-nav-item");
        if($navItems.length > 0){
            //鼠标移入菜单单个节点的active条的处理
            $navigate.on("mouseenter", ".bh-headerBar-nav-item", function(){
                //鼠标移入时，记录当前nav是否处于不活动状态，若是则将状态缓存，并暂时将nav的bh-unActive去掉,让高亮条能显示出来
                if($navigate.hasClass('bh-unActive')){
                    $navigate.data('activeType', 'bh-unActive').removeClass('bh-unActive');
                }
                var $item = $(this);

                //记录移入前的active所在位置
                var activeIndex = $navigate.data("nav-init-active-index");
                if(!activeIndex){
                    if(activeIndex !== 0){
                        var index = $navigate.find(".bh-active").closest("a").index();
                        $navigate.data("nav-init-active-index", index);
                    }
                }

                setHeadNavBarPosition($item, $navigate);
            });
            //点击菜单active条的处理
            $navigate.on("click", ".bh-headerBar-nav-item", function(){
                //将缓存的nav状态去掉
                $navigate.removeData('activeType');
                var $item = $(this).closest("a");
                var index = $item.index();
                $navigate.find('.bh-active').removeClass('bh-active');
                $item.children().addClass('bh-active');
                $navigate.data("nav-init-active-index", index).removeClass('bh-unActive');
                //移除nav more菜单的高亮
                var $moreIcon = dom.find('div.bh-headerBar-nav-more');
                if($moreIcon.hasClass('bh-active')){
                    $moreIcon.removeClass('bh-active');
                    var $navMoreBox = $('div[bh-header-role="navMoreBox"]');
                    $navMoreBox.children('.bh-active').removeClass('bh-active');
                    $navMoreBox.children('div.bh-header-navMoreBox-bar').css({top: '-43px'});
                }
            });

            //鼠标移出菜单块，还原active条的位置
            $navigate.on("mouseleave", function(){
                //鼠标移除前判断nav是否处于不激活状态，是的话则还原状态
                if($navigate.data('activeType')){
                    $navigate.removeData('activeType').addClass('bh-unActive');
                }
                var index = $navigate.data("nav-init-active-index");
                var $itemList = $navigate.find(".bh-headerBar-nav-item");
                var $activeA = $itemList.closest("a").eq(index);
                var $activeItem = $activeA.find(".bh-headerBar-nav-item");

                setHeadNavBarPosition($activeItem, $navigate);
            });
        }
    }
    //侧边栏导航栏icon事件监听
    function asideNavEvent(dom){
        dom.on("click", "[bh-header-role=bhAsideNavIcon]", function(){
            $.bhAsideNav.show();
        });
    }

    //更多的事件绑定，在计算完宽度后才添加的
    function moreEvent($dom, $navMoreBox){
        //鼠标移入导航菜单的更多按钮的处理
        $dom.on('mouseover', 'div.bh-headerBar-nav-more', function(){
            var $more = $(this);
            //获取按钮的位置信息
            var morePosition = BH_UTILS.getElementPosition($more);
            var $navMoreBox = $('div[bh-header-role="navMoreBox"]');
            var navMoreBoxWidth = $navMoreBox.outerWidth();
            //获取缓存下来的更多菜单的高度
            var navHeight = 0;
            if($more.closest('header[bh-header-role="bhHeaderMini"]').length > 0){
                $navMoreBox.addClass('bh-header-navMoreBox-mini');
                navHeight = $navMoreBox.data('miniHeight');
            }else{
                $navMoreBox.removeClass('bh-header-navMoreBox-mini');
                navHeight = $navMoreBox.data('height');
            }

            //设置更多菜单的显示位置，并添加active属性（用于鼠标移走的处理）
            $navMoreBox.css({top: morePosition.bottom+'px', left: parseInt(morePosition.right - navMoreBoxWidth,10)+'px', height: navHeight+'px'})
                .data('active', true);
        });
        //鼠标移出导航菜单的更多按钮的处理
        $dom.on('mouseout', 'div.bh-headerBar-nav-more', function(){
            leaveMoreBox($dom);
        });

        //鼠标移入更多导航菜单块的处理
        $navMoreBox.on('mouseover', function(e){
            var $moreBox = $(this);
            //添加active属性（用于鼠标移走的处理）
            $moreBox.data('active', true);
            //设置更多菜单高亮条的位置
            setMoreBoxBarPosition($(e.target || e.srcElement), $moreBox, $dom);
        });
        //鼠标移出更多导航菜单的处理
        $navMoreBox.on('mouseout', function(){
            leaveMoreBox($dom);
        });

        //点击更多菜单项的处理
        $navMoreBox.on('click', function(e){
            var $moreBox = $(this);
            var $target = $(e.target || e.srcElement).closest('a');
            setMoreBoxActive($target, $moreBox, $dom);
        });
    }

    function setMoreBoxActive($navItem, $moreBox, $dom){
        if($navItem.length > 0){
            //给被点击的菜单添加高亮class
            $moreBox.children('a').removeClass('bh-active');
            $navItem.addClass('bh-active');
            //将更多菜单隐藏
            $moreBox.css({height: 0});
            //给更多按钮添加高亮
            $dom.find('div.bh-headerBar-nav-more').addClass('bh-active');
            $dom.find('div.bh-headerBar-navigate').find('div.bh-active').removeClass('bh-active');
        }
    }

    //鼠标移出更多导航菜单的处理
    function leaveMoreBox($dom){
        var $navMoreBox = $('div[bh-header-role="navMoreBox"]');
        //移除缓存的active属性，延迟判断这个属性是否还存在，当不存在时在隐藏更多菜单
        $navMoreBox.removeData('active');
        //鼠标移除时，设置更多菜单的高亮条位置
        setMoreBoxBarPosition($navMoreBox.children('.bh-active'), $navMoreBox, $dom);
        setTimeout(function(){
            if(!$navMoreBox.data('active')){
                $navMoreBox.css({height: 0});
            }
        },200);
    }

    //设置更多高亮条的位置
    function setMoreBoxBarPosition($item, $moreBox, $dom){
        var $activeItem = $item.length > 0 ? $item.closest('a') : [];
        var $moreActiveBar = $moreBox.children('div.bh-header-navMoreBox-bar');
        var $navBlock = $dom.find('div.bh-headerBar-navigate');
        var itemHeight = $moreBox.hasClass('bh-header-navMoreBox-mini') ? 24 : 43;
        if($activeItem.length > 0){
            //当该菜单不是隐藏项，则计算高亮条的top值，否则直接将高亮条设为负值，使其隐藏
            if(!$activeItem.hasClass('bh-hide')){
                var index = $activeItem.index();
                //找出该菜单前的隐藏项，将隐藏项排除后再计算top值
                $moreBox.children('a').each(function(itemIndex, item){
                    if(itemIndex < index){
                        var $item = $(item);
                        if($item.hasClass('bh-hide')){
                            index--;
                        }
                    }
                });
                var top = index * itemHeight + 1;
                $moreActiveBar.css({top: top + 'px'});
            }else{
                $moreActiveBar.css({top: '-'+itemHeight+'px'});
            }

            //将头部的高亮去掉
            $navBlock.addClass('bh-unActive');
        }else{
            $navBlock.removeClass('bh-unActive');
            $moreActiveBar.css({top: '-'+itemHeight+'px'});
        }
    }

    function setHeadNavBarPosition($item, $navigate){
        var index = $item.closest('a').index();
        $navigate.each(function(){
            var $navContent = $(this);
            var $navItem = $navContent.children('a').eq(index);
            var _width = $navItem.outerWidth();
            var _left = $navItem.offset().left;
            var navLeft = $navContent.offset().left;
            var barLeft = _left - navLeft;

            $navContent.find(".bh-headerBar-nav-bar").css({"left": barLeft+"px", "width": _width+"px"});
        });
    }
    //角色切换块事件监听
    function roleSwitchEvent(dom, options){
        dom.on("click", "[bh-header-role=roleSwitch]", function(){
            var $switch = $(this);
            var switchOffset = $switch.offset();
            var switchWidth = $switch.outerWidth();
            var switchHeight = $switch.outerHeight();
            var $roleBox = $("[bh-header-role=roleBox]");
            var roleBoxWidth = $roleBox.outerWidth();
            var roleBoxLeft = switchOffset.left + switchWidth - roleBoxWidth;
            var roleBoxTop = switchOffset.top + switchHeight + 8;
            $roleBox.css({"left": roleBoxLeft, "top": roleBoxTop}).toggleClass("bh-active");
        });

        $("[bh-header-role=roleBox]").on("click", ".bh-headerBar-roleBox-title", function(){
            var $item = $(this);
            if($item.hasClass("bh-headerBar-roleBox-explain")){
                return;
            }
            var text = $.trim($item.text());
            var id = $item.children('a').attr('id');
            dom.find("[bh-header-role=roleSwitch]").text(text);
            $item.closest("[bh-header-role=roleBox]").removeClass("bh-active");
            //给头部绑定change事件，返回text和该节点
            dom.trigger("headerRoleChange", [text, $item]);

            if(typeof options.dropMenuCallback !='undefined' && options.dropMenuCallback instanceof Function){
                var backItem = {"id": id, "text": text, "JDom": $item};
                options.dropMenuCallback(backItem);
            }
        });
    }

    function ampSwitchEvent(dom, options){
        //若AppDetail存在则先对应用详情进行初始化
        if(options.appDetail){
            $.ampAppDetail.init({
                appId: options.appDetailData.appId,
                rootPath: options.appDetailData.rootPath});
        }

        dom.on("click", "[bh-header-role=ampSwitch]", function(){
            var $switch = $(this);
            var switchOffset = $switch.offset();
            var switchWidth = $switch.outerWidth();
            var switchHeight = $switch.outerHeight();
            var $roleBox = $("[bh-header-role=ampBox]");
            var roleBoxWidth = $roleBox.outerWidth();
            var roleBoxLeft = switchOffset.left + switchWidth - roleBoxWidth;
            var roleBoxTop = switchOffset.top + switchHeight + 8;
            $roleBox.css({"left": roleBoxLeft, "top": roleBoxTop}).toggleClass("bh-active");
        });

        $("[bh-header-role=ampBox]").on("click", ".bh-headerBar-roleBox-title", function(){
            var $item = $(this);
            var flag = $item.attr('bh-header-role');
            if(flag === 'feedbackBox'){
                AmpFeedback.window(options.feedbackData);
            }else if(flag === 'appDetailBox'){
                $.ampAppDetail.show();
            }
        });
    }

    function userInfoIconEvent(dom){
        dom.on("click", "[bh-header-role=bhHeaderUserInfoIcon]", function(){
            var $box = $("[bh-header-role=bhHeaderBarInfoBox]");
            if($box.length === 0){
                return;
            }
            var $item = $(this);
            var itemOffset = $item.offset();
            var itemWidth = $item.outerWidth();
            var itemHeight = $item.outerHeight();
            var boxWidth = $box.outerWidth();
            var boxLeft = itemOffset.left + itemWidth - boxWidth;
            var boxTop = itemOffset.top + itemHeight + 8;
            $box.css({"left": boxLeft, "top": boxTop}).toggleClass("bh-active");
        });
    }

    function themePopUpBoxInit(dom){
        var $icon = dom.find("div[bh-theme-role=themeIcon]");
        var iconWidth = $icon.outerWidth();
        var iconHeight = $icon.outerHeight();
        var iconOffset = $icon.offset();
        var $themeList = dom.find(".bh-header-themelist");
        var themeTop = iconOffset.top + iconHeight;
        var themeLeft = iconOffset.left + iconWidth - 150;
        $themeList.css({"top": themeTop, "left": themeLeft});

        themePopUpBoxEvent($icon, $themeList);
    }

    function themePopUpBoxEvent($icon, $themeList){
        $icon.on("click",function(){
            $themeList.toggle();
        });

        //绑定点击事件,切换皮肤
        $themeList.on("click", "li",function(){
            $themeList.find(".bh-selected").removeClass("bh-selected");
            $(this).addClass("bh-selected");
            changeThemes({themesName:$(this).attr("title"),themesLink:$("#bhThemes")});
            changeThemes({themesName:$(this).attr("title"),themesLink:$("#bhScenceThemes")});
            $themeList.hide();
        });

        $themeList.find("li").hover(function(){
            $(this).addClass("bh-active");
        },function(){
            $(this).removeClass("bh-active");
        });
    }

    function changeThemes(options) {
        var _wisThemes = options.themesLink;
        var newUrl = getUrlByThemesName(options);
        if(newUrl != ""){
            _wisThemes.removeAttr('type');
            _wisThemes.attr('href', newUrl);
            _wisThemes.attr('type','text/css');
        }
    }
    function getUrlByThemesName(options){
        var _wisThemes = options.themesLink;
        var url = _wisThemes.attr('href');
        if(!url) return false;
        var urlArr = url.split("/");
        var newUrl = "";

        if(urlArr && urlArr.length>1){
            urlArr[urlArr.length - 2] = options.themesName;
            newUrl = urlArr.join("/");
        }
        return newUrl;
    }

    //添加用户详情
    function userInfoInit(options){
        var userInfo = options.userInfo;
        //当用户详情不存在时，不予添加
        if($.isEmptyObject(userInfo)){
            return;
        }
        //用户图片
        var image = userInfo.image;
        //显示详情，每条数据显示一行
        var info = userInfo.info;
        //退出登录的链接
        var logoutHtml = userInfo.logoutHref ? '<a class="bh-btn bh-btn-default bh-btn-small bh-btn-danger" href="'+userInfo.logoutHref+'">退出登录</a>' : '';
        var _html =
            '<div class="bh-headerBar-userIfon bh-headerBar-popupBox-animate bh-card bh-card-lv3" bh-header-role="bhHeaderBarInfoBox">' +
                '<div class="bh-headerBar-userInfo-img">' +
                    '<img src="@image" />' +
                '</div>' +
                '<div class="bh-headerBar-userInfo-detail">' +
                    '@detail' +
                '</div>' +
                    '@logoutHtml'+
            '</div>';

        var detailHtml = "";
        if(info){
            var infoLen = info.length;
            for(var i=0; i<infoLen; i++){
                if(i === 0){
                    detailHtml += '<div class="bh-headerBar-userIfon-name">'+info[i]+'</div>';
                }else{
                    if(info[i]){
                        detailHtml += '<div>'+info[i]+'</div>';
                    }
                }
            }
        }
        _html = _html.replace("@image", image).replace("@detail", detailHtml).replace("@logoutHtml", logoutHtml);
        $("body").append(_html);

        var $userImg = $('div[bh-header-role="bhHeaderBarInfoBox"]').find('img');
        BH_UTILS.checkImageLoadComplete($userImg)
            .fail(function(e, $imgDom){
                $imgDom.attr('src', space.defaultUserImg);
            });
    }

    function resetNavActive(options, $dom){
        if(options){
            var index = parseInt(options.activeIndex, 10);
            if(index){
                index = index - 1;
                var guid = space.nav[index].guid;
                var $nav = $dom.find(".bh-headerBar-navigate");
                $nav.find(".bh-active").removeClass("bh-active");
                var $navMoreBox = $('div[bh-header-role="navMoreBox"]');
                var activeIndex = $nav.children('a[bh-header-role="nav-'+guid+'"]').index();
                if(activeIndex >= 0){
                    var $activeItem = $nav.children("a").eq(activeIndex).find(".bh-headerBar-nav-item");
                    $activeItem.addClass("bh-active");
                    $nav.data("nav-init-active-index", activeIndex).removeClass('bh-unActive');
                    $dom.find('div.bh-headerBar-nav-more').removeClass('bh-active');

                    setHeadNavBarPosition($activeItem, $nav);
                    $navMoreBox.find('.bh-active').removeClass('bh-active');
                    setMoreBoxBarPosition([], $navMoreBox, $dom);
                }else{
                    var $moreActiveItem = $navMoreBox.children('a[bh-header-role="nav-'+guid+'"]');
                    $navMoreBox.find('.bh-active').removeClass('bh-active');
                    $moreActiveItem.addClass('bh-active');
                    setMoreBoxActive($moreActiveItem, $navMoreBox, $dom);
                    setMoreBoxBarPosition($moreActiveItem, $navMoreBox, $dom);
                }
            }
        }
    }

    function showOrHideNav(flag){
        var $nav = space.$dom.find('div.bh-headerBar-navigate');
        var $moreBtn = space.$dom.find('div.bh-headerBar-nav-more');
        if(flag === 'show'){
            $nav.removeClass('bh-nav-hide');
            if($('div[bh-header-role="navMoreBox"]').find('a').length > 0){
                $moreBtn.show();
            }
        }else{
            $nav.addClass('bh-nav-hide');
            $moreBtn.hide();
        }
    }

    //监听头部图片加载完成，计算nav导航的可用宽度
    function listenImgLoadComplete($dom){
        var $normalHead = $dom.find('header[bh-header-role="bhHeader"]');
        var imgs = $normalHead.find('img');
        var imgLen = imgs.length;
        if(imgLen > 0){
            var loadCount = 0;
            imgs.each(function(index, imgDom){
                BH_UTILS.checkImageLoadComplete($(imgDom))
                    .done(function(){
                        loadCount++;
                        if(loadCount === imgLen){
                            computeNavWidth($normalHead, $dom);
                        }
                    })
                    .fail(function(e, $imgDom){
                        if($imgDom.closest('.bh-headerBar-imgBlock').length > 0){
                            $imgDom.attr('src', space.defaultUserImg);
                        }
                        loadCount++;
                        if(loadCount === imgLen){
                            computeNavWidth($normalHead, $dom);
                        }
                    });
            });
        }else{
            computeNavWidth($normalHead, $dom);
        }
    }

    //计算nav的可用宽度
    function computeNavWidth($normalHead, $dom){
        var $headContent = $normalHead.find('div.bh-headerBar-content');
        //整个头部的宽度
        //右侧菜单的容器
        var $menuItem = null;
        //头部除了右侧菜单的所有节点的宽度
        var itemsWidth = 0;
        $headContent.children().each(function(){
            var $item = $(this);
            if(!$item.hasClass('bh-headerBar-menu')){
                itemsWidth += $item.outerWidth(true);
            }else{
                $menuItem = $item;
            }
        });
        //nav的容器
        var $nav = null;
        var navItemsWidth = 0;
        $menuItem.children().each(function(){
            var $item = $(this);
            if(!$item.hasClass('bh-headerBar-navigate')){
                navItemsWidth += $item.outerWidth(true);
            }else{
                $nav = $item;
            }
        });

        var navMarginRight = 16;
        //预设一个偏差距离
        var navWidthDiff = 148;
        var menuItemsWidth = 'calc(100% - '+parseInt(itemsWidth + navWidthDiff, 10)+'px)';
        var navBlockWidth = 'calc(100% - '+parseInt(navItemsWidth + navMarginRight, 10)+'px)';
        $menuItem.css({width: menuItemsWidth});
        $normalHead.find('div.bh-headerBar-navigate').css({width: navBlockWidth});

        var $miniHeader = $dom.children('header[bh-header-role="bhHeaderMini"]');
        $miniHeader.find('div.bh-headerBar-menu').css({width: menuItemsWidth});
        $miniHeader.find('div.bh-headerBar-navigate').css({width: navBlockWidth});

        //检查头部的nav项是否过多，过多则将超出的项放入more容器中
        checkNavItemIsMore($dom);
    }

    /**
     * 检查头部的nav项是否过多，过多则将超出的项放入more容器中
     * @param $dom
     */
    function checkNavItemIsMore($dom){
        var $normalNav = $dom.children('header[bh-header-role="bhHeader"]').find('div.bh-headerBar-navigate');
        var $miniNav = $dom.children('header[bh-header-role="bhHeaderMini"]').find('div.bh-headerBar-navigate');
        var navWidth = $normalNav.width();
        var navItemsWidth = 0;
        var $navItems = $normalNav.children('a');
        var $miniNavItems = $miniNav.children('a');
        var navItemsLen = $navItems.length;
        var moreIndex = 0;
        var isMoreFlag = false;
        var moreHtml = '';
        var moreItemsCount = 0;
        for(var i=navItemsLen-1; i>=0; i--){
            var item = $navItems[i];
            navItemsWidth += item.offsetWidth;
            if(navItemsWidth > navWidth){
                if(!isMoreFlag){
                    moreIndex = i;
                    isMoreFlag = true
                }
                moreHtml += item.outerHTML;
                $navItems.eq(i).remove();
                $miniNavItems.eq(i).remove();
                moreItemsCount++;
            }
        }

        $('body').append(
            '<div class="bh-header-navMoreBox" bh-header-role="navMoreBox">' +
                moreHtml+
                '<div class="bh-header-navMoreBox-bar bh-animate-fast bh-animate-top"></div>'+
            '</div>');
        //读取more的高度并保存起来，方便做动画
        var $navMoreBox = $('div[bh-header-role="navMoreBox"]');
        var navMoreBoxHeight = $navMoreBox.outerHeight();
        var navMoreBoxMiniHeight = moreItemsCount * 24;
        $navMoreBox.data('height', navMoreBoxHeight).data('miniHeight', navMoreBoxMiniHeight).css({height: 0, display: 'block'});
        if(moreItemsCount > 0){
            if(!space.isNavHide){
                $dom.find('div.bh-headerBar-nav-more').show();
            }
            //nav菜单more的事件
            moreEvent($dom, $navMoreBox);
        }

        var $moreActiveItem =  $navMoreBox.find('.bh-active').closest('a');
        if($moreActiveItem.length === 0){
            //设置头部菜单
            navigateBarInit($dom);
        }else{
            setMoreBoxActive($moreActiveItem, $navMoreBox, $dom);
            setMoreBoxBarPosition($moreActiveItem, $navMoreBox, $dom);
        }
    }



    /**
     * 这里是关键
     * 定义一个插件 plugin
     */
    $.fn.bhHeader = function (options, params) {
        var instance;
        instance = this.data('bhHeader');
        /**
         * 判断插件是否已经实例化过，如果已经实例化了则直接返回该实例化对象
         */
        if (!instance) {
            return this.each(function () {
                //将实例化后的插件缓存在dom结构里（内存里）
                return $(this).data('bhHeader', new Plugin(this, options));
            });
        }
        if (options === true) return instance;
        /**
         * 优雅处： 如果插件的参数是一个字符串，则 调用 插件的 字符串方法。
         * 如 $('#id').plugin('doSomething') 则实际调用的是 $('#id).plugin.doSomething();
         * doSomething是刚才定义的接口。
         * 这种方法 在 juqery ui 的插件里 很常见。
         */
        if ($.type(options) === 'string'){
            return instance[options](params);
        }
        return this;
    };

    /**
     * 插件的默认值
     */
    $.fn.bhHeader.defaults = {
        openTheme: false, //是否打开换肤功能，false是不打开
        showAsideNav: false, //是否显示左侧边导航
        logo: "", //logo路径
        title: "", //页面名称
        icons: [], //右侧的icon， 需传入的是icon-xxx
        img: "", //右侧的小图片
        isNavHide: false, //头部菜单是否隐藏，默认false不隐藏
        nav: [], //头部菜单 [{"title":"填写申请表", "active":true}]， active是表示该菜单高亮
        dropMenu: [], //头部的角色下拉菜单
        userInfo: {}, //用户详情 {"image": "", "info": ["xx", "xx"]},image:显示的图片， info：要显示的信息，一条信息一行
        feedback: false, //问题反馈是否打开的标志，true是打开
        feedbackData: {
            "sourceId": "", //应用的id
            "sourceName": "", //应用的名称
            "uploadImageUrl": "", //
            "submitUrl": ""
        },
        appDetail: false, //应用详情是否打开的标志，true是打开
        appDetailData: {
            "appId": "", //应用的id
            "rootPath": "" //应用所在的根路径
        },
        ready: null //初始化完成回调
    };
})(jQuery);
/**
 * 类似于纵向tab页签
 */
(function ($) {
    /**
     * 定义一个插件
     */
    var Plugin;

    var activeId,source,$linkContainer,$contentContainer,mode;
    /**
     * 这里是一个自运行的单例模式。
     */
    Plugin = (function () {

        /**
         * 插件实例化部分，初始化时调用的代码可以放这里
         */
        function Plugin(element, options) {
            //将插件的默认参数及用户定义的参数合并到一个新的obj里
            this.settings = $.extend({}, $.fn.bhMenu.defaults, options);
            //将dom jquery对象赋值给插件，方便后续调用
            this.$element = $(element);
            init(this.settings, this.$element);
        }
        Plugin.prototype.enableItem = function(index) {
            enableByIndex(index);
        };
        Plugin.prototype.disableItem = function(index) {
            disableByIndex(index);
        };
        return Plugin;

    })();

    function init(options, dom){
        //初始化头部
        source = options.source;
        $linkContainer = dom;
        $contentContainer = options.contentContainer;
        mode = options.mode;
        var _html = getLinkDom(options.source);
        $linkContainer.html(_html);
        initActive(options.activeIndex);
        addEventListener(options);
    }

    function initActive(_index){
        var menuId = getIdByIndex(_index);
        setActive(menuId);
    }

    function setActive(menuId){
        if(menuId == null) return;
        if(activeId){
            $linkContainer.find(".bh-menu-link-item[menuId='"+activeId+"']").removeClass("bh-active");
            $contentContainer.find(".bh-menu-content[id='"+activeId+"']").hide();
        }
        activeId = menuId;
        var $menuItem = $linkContainer.find(".bh-menu-link-item[menuId='"+activeId+"']");
        $menuItem.addClass("bh-active");
        var text = $menuItem.text();
        var title = $menuItem.attr("data-title");
        $contentContainer.find(".bh-menu-content[id='"+activeId+"']").show();
        //给菜单项绑定激活项改变事件，返回菜单id,text和该节点
        $linkContainer.trigger("activeChange", [menuId, text, title, $menuItem]);
    }

    function getIdByIndex(_index){
        var id = null;
        if(source){
            id = source[_index]["id"];
        }
        return id;
    }
    function addEventListener(){
        $linkContainer.on("click",".bh-menu-link-item",function(){
            if($(this).hasClass("bh-disabled")) return false;
            if(mode == "link"){
                var _url = $(this).attr("menu-data-url");
                window.open(_url);
            }else{
                var menuId = $(this).attr("menuId");
                setActive(menuId);
            }
        });
    }
    function disableByIndex(_index){
        var _id = getIdByIndex(_index);
        $linkContainer.find(".bh-menu-link-item[menuId='"+_id+"']").addClass("bh-disabled");
    }
    function enableByIndex(_index){
        var _id = getIdByIndex(_index);
        $linkContainer.find(".bh-menu-link-item[menuId='"+_id+"']").removeClass("bh-disabled");
    }
    function getLinkDom(_data){
        var _html = '';
        if(_data){
            _html = '<div class="bh-menu-link">';
            for(var i=0,len=_data.length;i<len;i++){
                _html+=getLinkItemDom(_data[i]);
            }
            _html += '</div>';
        }
        return _html;
    }
    function getLinkItemDom(_data){
        var _html = '';
        if(_data){
            if(mode == "link"){
                _html = '<div class="bh-menu-link-item" menuId="'+_data.id+'" menu-data-url="'+_data.url+'" data-title="'+_data.title+'">';
            }else{
                _html = '<div class="bh-menu-link-item" menuId="'+_data.id+'" data-title="'+_data.title+'">';
            }
            _html += _data.title;
            _html += '</div>';
        }
        return _html;
    }
    /**
     * 这里是关键
     * 定义一个插件 plugin
     */
    $.fn.bhMenu = function (options, params) {
        var instance;
        instance = this.data('bhMenu');
        /**
         * 判断插件是否已经实例化过，如果已经实例化了则直接返回该实例化对象
         */
        if (!instance) {
            return this.each(function () {
                //将实例化后的插件缓存在dom结构里（内存里）
                return $(this).data('bhMenu', new Plugin(this, options));
            });
        }
        if (options === true) return instance;
        /**
         * 优雅处： 如果插件的参数是一个字符串，则 调用 插件的 字符串方法。
         * 如 $('#id').plugin('doSomething') 则实际调用的是 $('#id).plugin.doSomething();
         * doSomething是刚才定义的接口。
         * 这种方法 在 juqery ui 的插件里 很常见。
         */
        if ($.type(options) === 'string') instance[options](params);
        return this;
    };

    /**
     * 插件的默认值
     */
    $.fn.bhMenu.defaults = {
        source:[], //菜单项的数据 id,title 如果是mode="link"需要传url
        activeIndex:0, //默认选中第几项
        contentContainer:$("body"), //内容所在的容器
        mode:"tab" //支持页面跳转还是tab页切换 支持两个值link/tab
    };
})(jQuery);
'use strict';

/**
 * 将插件封装在一个闭包里面，防止外部代码污染  冲突
 */
(function() {
    var html_advanced = '<div class="bh-pager bh-hide">' +
        '<div class="bh-pull-left">' +
        '<a href="javascript:void(0);" class="bh-pager-btn waves-effect" pager-flag="prev">' +
        '<i class="iconfont icon-keyboardarrowleft bh-pager-left-arrow"></i>' +
        '</a>' +
        '<a href="javascript:void(0);" class="bh-pager-btn waves-effect" pager-flag="next">' +
        '<i class="iconfont icon-keyboardarrowright bh-pager-right-arrow"></i>' +
        '</a>' +
        '<span class="bh-pager-num" pager-flag="pageInfo"></span>' +
        '<label class="bh-pager-label">跳转至</label>' +
        '<input type="text" class="bh-form-control bh-pager-input" pager-flag="gotoPage"/>' +
        '<span>页</span>' +
        '</div>' +
        '<div class="bh-pull-right">' +
        '<div pager-flag="pagerOptionSel" class="bh-pull-right"></div>' +
        '<label class="bh-pull-right bh-pager-label bh-pager-right-text">每页显示</label>' +
        '</div>' +
        '</div>';

    var html_simple = '<div class="bh-pager bh-hide">' +
        '<div class="bh-pull-left">' +
        '<a href="javascript:void(0);" class="waves-effect bh-pager-simplePrev" pager-flag="simplePrev">' +
        '<i class="iconfont icon-keyboardarrowleft"></i>' +
        '</a>' +
        '<div class="bh-pageNum-con" pager-flag="pageNumEle"></div>' +
        '<a href="javascript:void(0);" class="waves-effect bh-pager-simpleNext" pager-flag="simpleNext">' +
        '<i class="iconfont icon-keyboardarrowright"></i>' +
        '</a>' +
        '</div>' +
        '<div class="bh-pull-right">' +
        '<label class="bh-pull-right bh-pager-label bh-mh-16">共<span id="bh-pager-simple-total"></span>条</label>' +
        '</div>' +
        '</div>';


    /**
     * 定义一个插件
     */
    var Plugin;

    /**
     * 这里是一个自运行的单例模式。
     */
    Plugin = (function() {

        /**
         * 插件实例化部分，初始化时调用的代码可以放这里
         */
        function Plugin(element, options) {
            //将插件的默认参数及用户定义的参数合并到一个新的obj里
            this.settings = $.extend({}, $.fn.pagination.defaults, options);
            //定位pageSizeOptions的selectedIndex
            var pagesize = options.pagesize;
            var pageSizeOptions = this.settings.pageSizeOptions;
            for (var i = 0; i < pageSizeOptions.length; i++) {
                if (pageSizeOptions[i] == pagesize) {
                    this.settings.selectedIndex = i;
                }
            }
            //将dom jquery对象赋值给插件，方便后续调用
            this.$element = $(element);
            _create(this);
        }

        return Plugin;
    })();

    Plugin.prototype.getPagenum = function() {
        /**
         * 方法内容
         */
        if (this.settings.mode == 'advanced') {
            return parseInt(this.$element.find('[pager-flag="gotoPage"]').val());
        } else if (this.settings.mode == 'simple') {
            if (this.pageSizeOptions == 0) {
                return parseInt(this.$element.find('[pager-flag="simpleOnliOne"]')[0].innerText);
            } else {
                return parseInt(this.$element.find('.bh-simplePager-active').text());
            }

        }
    };
    Plugin.prototype.getPagesize = function() {
        /**
         * 方法内容
         */
        if (this.settings.mode == 'advanced') {
            return this.$element.find('[pager-flag="pagerOptionSel"]').jqxDropDownList('val');
        } else if (this.settings.mode == 'simple') {
            return this.settings.pagesize;
        }
    };

    Plugin.prototype.getTotal = function() {
        /**
         * 方法内容
         */
        return this.settings.totalSize;
    };

    /**
     * 插件的私有方法
     */

    //生成dom
    function _create(instance) {
        var $element = instance.$element;
        var settings = instance.settings;
        switch (settings.mode) {
            case 'simple':
                $element.html(html_simple);
                _simpleAppend(instance);
                if (settings.pagerButtonsCount == 0) {
                    $element.find('[pager-flag="simpleOnliOne"]').text(settings.pagenum + 1);
                    if (settings.pagenum > 0) {
                        $element.find('[pager-flag="simplePrev"]').removeClass('bh-btn-disabled');
                    }
                }
                break;
            case 'advanced':
                $element.html(html_advanced);
                _advancedAppend($element, settings);

                break;
        }
        //跳转到第几页赋值
        $element.find('[pager-flag="gotoPage"]').val(settings.pagenum + 1);
        //当前分页条数及总条数
        _setCurrentPageRecordInfo(instance);
        $element.children('.bh-pager').removeClass('bh-hide');
        _eventListener(instance);
    }

    //生成具体的页码和填充具体的总数
    function _simpleAppend(instance) {
        var settings = instance.settings;
        var $element = instance.$element;
        var pagesize = settings.pagesize;
        var totalNum = instance.getTotal();
        var pagerButtonsCount = settings.pagerButtonsCount;
        var pageLen = Math.ceil(totalNum / pagesize);
        var $fixPageHtml = '';
        var onlyNumText = 0;
        var isButtonDis = pageLen == 1 || pageLen == 0;
        if (pagerButtonsCount == 0 || pageLen == 1 || pageLen == 0) {
            if (pageLen != 0) {
                onlyNumText = 1;
            }
            $fixPageHtml = '<div class="bh-pager-simple-numHtml" pager-flag="addNumBtn">' +
                '<a href="javascript:void(0);" class="waves-effect bh-pager-simpleBtn bh-simplePager-active" pager-flag="simpleOnliOne">' + onlyNumText + '</a>' +
                '</div>';
            $element.find('[pager-flag="pageNumEle"]').append($fixPageHtml);
            $element.find('[pager-flag="simplePrev"]').addClass('bh-btn-disabled');
            if (isButtonDis) {
                $element.find('[pager-flag="simpleNext"]').addClass('bh-btn-disabled');
            }

        } else {
            $fixPageHtml = '<div class="bh-pager-simple-numHtml" pager-flag="addNumBtn"></div>';
            $element.find('[pager-flag="pageNumEle"]').append($fixPageHtml);
            _addNumBtn(settings, $element, pageLen);
        }
        $element.find('#bh-pager-simple-total').text(totalNum);
    }
    //添加数字
    function _addNumBtn(settings, $element, pageLen) {
        var showEllipsisNum = pageLen - settings.pagerButtonsCount;
        var $totalElement;
        var pageNumText = 0;
        var $pageNumEle = '';
        if (showEllipsisNum > 2) {
            $totalElement = _getTotalElement(settings, $element, pageLen);
            $element.find('[pager-flag="addNumBtn"]').html($totalElement);
        } else {
            _addOnlyNumBtnCircle($element, pageLen - 1, pageLen);
        }
        var $numEle = $($element.find('[pager-flag=simpleGotoPage]'));
        var $activeEle = $numEle.filter(function(index) {
            return parseInt($numEle[index].innerText) == settings.pagenum + 1;
        });
        $activeEle.addClass('bh-simplePager-active');
        var activeNum = parseInt($activeEle.text());
        if (activeNum == 1) {
            $element.find('[pager-flag=simplePrev]').addClass('bh-btn-disabled');
        }
        if (activeNum == pageLen) {
            $element.find('[pager-flag=simpleNext]').addClass('bh-btn-disabled');
        }
    }
    // 获取有省略号的元素
    function _getTotalElement(settings, $element, pageLen) {
        var totalNumElement = '';
        var pageNumText = _getCircleFirstPageNum(settings);
        var pagerButtonsCount = settings.pagerButtonsCount;
        var currentPageNum = settings.pagenum;
        var showRightEll = pagerButtonsCount + currentPageNum < pageLen - 1;
        var showLeftEll = currentPageNum - 1 > 2;
        var firstNum = '<a href="javascript:void(0);" class="waves-effect bh-pager-simpleBtn" pager-flag="simpleGotoPage">1</a>';
        var lastNum = '<a href="javascript:void(0);" class="waves-effect bh-pager-simpleBtn" pager-flag="simpleGotoPage">' + pageLen + '</a>';
        var rightEllipsis = '<a href="javascript:void(0);" class="waves-effect bh-pager-simpleBtn ellipsis" pager-flag="changeRightEllipsis">...</a>';
        var leftEllipsis = '<a href="javascript:void(0);" class="waves-effect bh-pager-simpleBtn ellipsis" pager-flag="changeLeftEllipsis">...</a>';
        if (currentPageNum == 0 || currentPageNum <= pagerButtonsCount) {
            totalNumElement = firstNum + _addNumBtnCircle($element, settings.pagerButtonsCount + 1, pageLen) + rightEllipsis + lastNum;
        } else {
            var numberEle = _addNumBtnCircle($element, settings.pagerButtonsCount + 1, pageLen, pageNumText - 1);
            if (showLeftEll && showRightEll) {
                totalNumElement = firstNum + leftEllipsis + numberEle + rightEllipsis + lastNum;
            } else if (showLeftEll) {
                totalNumElement = firstNum + leftEllipsis + numberEle + lastNum;
            } else if (showRightEll) {
                totalNumElement = firstNum + numberEle + rightEllipsis + lastNum;
            }
        }
        return totalNumElement;
    }
    // 获取循环的第一个数字，根据不同的当前页码和pagerButtonCount的余数的不同，循环的第一个数字不一样
    function _getCircleFirstPageNum(settings) {
        var circleFirstText = 0;
        var pagerButtonsCount = settings.pagerButtonsCount;
        var currentPageNum = settings.pagenum + 1;
        var remainderNum = currentPageNum % pagerButtonsCount;
        var timeNum = parseInt(currentPageNum / pagerButtonsCount);
        if (remainderNum == 0) {
            circleFirstText = currentPageNum - Math.floor(pagerButtonsCount / 2);
        } else if (remainderNum == 1) {
            if (timeNum == 1) {
                circleFirstText = currentPageNum;
            } else {
                circleFirstText = currentPageNum - (pagerButtonsCount - 1);
            }
        } else if (remainderNum == 2) {
            circleFirstText = currentPageNum;
        } else if (remainderNum > 2) {

            circleFirstText = pagerButtonsCount * timeNum + 2;
        }
        return circleFirstText;
    }
    // 添加数字
    function _addNumBtnCircle($element, len, pageLen, pageNumText) {
        var pageNumber = 1;
        var $pageNumEle = '';
        if (pageNumText) {
            pageNumber = pageNumText;
        }
        for (var i = 1; i < len; i++) {
            pageNumber = pageNumber + 1;
            if (pageNumber == pageLen) {
                break;
            }
            $pageNumEle += '<a href="javascript:void(0);" class="waves-effect bh-pager-simpleBtn" pager-flag="simpleGotoPage">' + pageNumber + '</a>';
        }
        return $pageNumEle;
    }
    // 获取中间展示的数字，只有数字没有省略号
    function _addOnlyNumBtnCircle($element, len, pageLen) {
        var pageNumText = 0;
        var $pageNumEle = '';
        for (var i = 1; i < len; i++) {
            pageNumText = i + 1;
            $pageNumEle += '<a href="javascript:void(0);" class="waves-effect bh-pager-simpleBtn" pager-flag="simpleGotoPage">' + pageNumText + '</a>';
        }
        var $totalNumEle = '<a href="javascript:void(0);" class="waves-effect bh-pager-simpleBtn" pager-flag="simpleGotoPage">1</a>' + $pageNumEle + '<a href="javascript:void(0);" class="waves-effect bh-pager-simpleBtn" pager-flag="simpleGotoPage">' + pageLen + '</a>';
        $element.find('[pager-flag="addNumBtn"]').html($totalNumEle);
    }
    //生成每页显示条数下拉选择
    function _advancedAppend($element, settings) {
        $element.find('[pager-flag="pagerOptionSel"]').jqxDropDownList({
            source: settings.pageSizeOptions,
            selectedIndex: settings.selectedIndex,
            width: '60',
            height: '26',
            dropDownHeight: "100",
            enableBrowserBoundsDetection: true
        });
    }

    //事件监听
    function _eventListener(instance) {
        var $element = instance.$element;
        var settings = instance.settings;
        var mode = instance.settings.mode;
        //点击上一页
        $element.off('click', '[pager-flag="prev"]').on('click', '[pager-flag="prev"]', function() {
            var pagenum = instance.getPagenum();
            if (pagenum <= 1) return;
            _setPagenum(pagenum - 1, instance);
            _setCurrentPageRecordInfo(instance);
            _triggerEvent(instance, $(this));
        });
        //点击下一页
        $element.off('click', '[pager-flag="next"]').on('click', '[pager-flag="next"]', function() {
            var pagenum = instance.getPagenum();
            if (pagenum >= _getLastpagenum(instance)) return;
            _setPagenum(pagenum + 1, instance);
            _setCurrentPageRecordInfo(instance);
            _triggerEvent(instance, $(this));
        });
        //跳转第几页
        $element.off('keyup', '[pager-flag="gotoPage"]').on('keyup', '[pager-flag="gotoPage"]', function(e) {
            if (e.keyCode != 13) {
                return;
            }
            var pagenum = instance.getPagenum();
            if (pagenum < 1 || pagenum > _getLastpagenum(instance)) {
                _setPagenum(1, instance);
                return;
            }
            _setPagenum(pagenum, instance);
            _setCurrentPageRecordInfo(instance);
            _triggerEvent(instance, $(this));

        });
        //每页显示条数下拉选择框
        if (mode == 'advanced') {
            $element.off('select', '[pager-flag="pagerOptionSel"]').on('select', '[pager-flag="pagerOptionSel"]', function(e) {
                // var pagenum = instance.getPagenum();
                // if(pagenum < 1 || pagenum > _getLastpagenum(instance)) return;
                _setPagenum(0, instance);
                _setCurrentPageRecordInfo(instance);
                _triggerEvent(instance, $(this));
            });
        }
        //点击省略号，显示省略号代表的数字
        if (mode == 'simple') {
            var pageLen = Math.ceil(instance.getTotal() / settings.pagesize);
            var isNotOnlyOne = settings.pagerButtonsCount != 0;
            $element.off('click', '[pager-flag="changeRightEllipsis"]').on('click', '[pager-flag="changeRightEllipsis"]', function() {
                $element.find('.bh-simplePager-active').removeClass('bh-simplePager-active');
                var $numEle = $element.find('[pager-flag="changeRightEllipsis"]').prev();
                settings.pagenum = parseInt($numEle.text());
                _addNumBtn(settings, $element, pageLen);
                _triggerEvent(instance, $('[pager-flag="changeRightEllipsis"]', $element));
            });
            $element.off('click', '[pager-flag="changeLeftEllipsis"]').on('click', '[pager-flag="changeLeftEllipsis"]', function() {
                var $numEle = $element.find('[pager-flag="changeLeftEllipsis"]').next();
                var currentNum = parseInt($numEle.text());
                settings.pagenum = currentNum - settings.pagerButtonsCount;
                _addNumBtn(settings, $element, pageLen);
                $element.find('.bh-simplePager-active').removeClass('bh-simplePager-active');
                var $nextActiveEle = $element.find('[pager-flag=simpleGotoPage]')[settings.pagerButtonsCount];
                $($nextActiveEle).addClass('bh-simplePager-active');
                _triggerEvent(instance, $('[pager-flag="changeLeftEllipsis"]', $element));
            });
            //点击上一页
            $element.off('click', '[pager-flag="simplePrev"]').on('click', '[pager-flag="simplePrev"]', function() {
                var isRemoveNextDis = $('[pager-flag="simpleNext"]').hasClass('bh-btn-disabled');
                var isRemovePreDis = $('[pager-flag="simplePrev"]').hasClass('bh-btn-disabled');
                if (isRemovePreDis) {
                    return;
                }
                if (isRemoveNextDis) {
                    $('[pager-flag="simpleNext"]').removeClass('bh-btn-disabled');
                }
                _clickPrev(settings, $element, pageLen);
                _triggerEvent(instance, $(this));
            });
            //点击下一页
            $element.off('click', '[pager-flag="simpleNext"]').on('click', '[pager-flag="simpleNext"]', function() {
                var isRemoveNextDis = $('[pager-flag="simpleNext"]').hasClass('bh-btn-disabled');
                var isRemovePreDis = $('[pager-flag="simplePrev"]').hasClass('bh-btn-disabled');
                if (isRemoveNextDis) {
                    return;
                }
                if (isRemovePreDis) {
                    $('[pager-flag="simplePrev"]').removeClass('bh-btn-disabled');
                }
                _clickNext(settings, $element, pageLen);


                _triggerEvent(instance, $(this));
            });
            //点击数字，跳转
            $element.off('click', '[pager-flag="simpleGotoPage"]').on('click', 'a[pager-flag="simpleGotoPage"]', function() {
                var $pageItem = $(this);
                var pagenum = parseInt($pageItem.text());
                settings.pagenum = pagenum - 1;
                _addNumBtn(settings, $element, pageLen);
                var $eventEle = $('[pager-flag="simpleGotoPage"]').filter(function() {
                    return $(this).text() == pagenum;
                });
                _triggerEvent(instance, $eventEle);
            });

        }
    }
    //生成当前页条数信息
    function _genCurrentPageRecordInfo(instance) {
        var start = 1;
        var end = 1;
        var pagenum = instance.getPagenum();
        var total = instance.getTotal();
        var pagesize = instance.getPagesize();
        if (pagenum * pagesize < total) {
            end = pagenum * pagesize;
        } else {
            end = total;
        }
        start = pagesize * (pagenum - 1) + 1;
        if (total == 0) {
            start = 0;
            end = 0;
        }
        return start + '-' + end;
    }

    //设置当前分页条数和总条数信息
    function _setCurrentPageRecordInfo(instance) {
        //当前分页条数及总条数
        var currPageInfo = _genCurrentPageRecordInfo(instance);
        instance.$element.find('[pager-flag="pageInfo"]').html(currPageInfo + ' 总记录数 ' + instance.settings.totalSize);
    }

    //设置当前页码
    function _setPagenum(pagenum, instance) {
        if (isNaN(pagenum) || pagenum < 1) {
            pagenum = 1;
        }
        var lastPagenum = _getLastpagenum(instance);
        if (pagenum > lastPagenum) {
            pagenum = lastPagenum;
        }
        instance.$element.find('[pager-flag="gotoPage"]').val(pagenum);
    }

    //获取最后一页页码
    function _getLastpagenum(instance) {
        var total = instance.getTotal();
        var pagesize = instance.getPagesize();
        return Math.ceil(total / pagesize);
    }

    //点击上一页
    function _clickPrev(settings, $element, pageLen) {
        if (settings.pagerButtonsCount == 0) {
            var pagenum = parseInt($element.find('[pager-flag="simpleOnliOne"]')[0].innerText) - 1;
            $element.find('[pager-flag="simpleOnliOne"]').text(pagenum);
            if (pagenum == 1) {
                $('[pager-flag="simplePrev"]').addClass('bh-btn-disabled');
            }
        } else {
            var $nowActiveEle = $element.find('.bh-simplePager-active');
            if ($nowActiveEle.prev().prev().hasClass('ellipsis')) {
                settings.pagenum = parseInt($nowActiveEle.text()) - Math.floor(settings.pagerButtonsCount / 2);
            } else {
                settings.pagenum = parseInt($nowActiveEle.text()) - settings.pagerButtonsCount + 1;
            }

            _addNumBtn(settings, $element, pageLen);
            $element.find('.bh-simplePager-active').removeClass('bh-simplePager-active');
            var $numEle = $element.find('[pager-flag=simpleGotoPage]');
            var $activeEle = $numEle.filter(function(index) {
                return parseInt($numEle[index].innerText) == parseInt($nowActiveEle.text()) - 1;
            });
            $activeEle.addClass('bh-simplePager-active');
            if (parseInt($activeEle.text()) == 1) {
                $element.find('[pager-flag=simplePrev]').addClass('bh-btn-disabled');
            }
        }
    }

    // 点击下一页
    function _clickNext(settings, $element, pageLen) {
        if (settings.pagerButtonsCount == 0) {
            var pagenum = parseInt($element.find('[pager-flag="simpleOnliOne"]')[0].innerText) + 1;
            $element.find('[pager-flag="simpleOnliOne"]').text(pagenum);
            if (pagenum == pageLen) {
                $('[pager-flag="simpleNext"]').addClass('bh-btn-disabled');
            }
        } else {
            var nowActiveNum = $element.find('.bh-simplePager-active').text();
            settings.pagenum = parseInt(nowActiveNum);
            _addNumBtn(settings, $element, pageLen);
        }
    }

    //触发事件
    function _triggerEvent(instance, $selector) {
        var pagenum = instance.getPagenum() - 1;
        var pagesize = instance.getPagesize();
        var total = instance.getTotal();
        $selector.trigger('pagersearch', [pagenum, pagesize, total]);
    }

    /**
     * 这里是关键
     * 定义一个插件 plugin
     */
    $.fn.pagination = function(options, params) {
        var instance = new Plugin(this, options);

        if (options === true) return instance;
        return this;
    };

    /**
     * 插件的默认值
     */
    $.fn.pagination.defaults = {
        mode: 'advanced',
        pagesize: 10,
        pageSizeOptions: [10, 20, 50, 100],
        selectedIndex: 0,
        pagenum: 0,
        totalSize: 0,
        pagerButtonsCount: 0,
    };
}).call(undefined);
/**
 * 堆叠对话框
 * 页面结构要求
 *      页面的最外层不能设置背景色，不能设置边框
 *      变化的title要设置成绝对定位，避免title缩小时其对应的内容跟着上移
 */
(function($) {
    $.bhPaperPileDialog = {
        show: function(options) {
            var dialogDefaults = {
                titleContainer: "", //必填，父层的title
                insertContainer: $("#levityPlaceholder"), //可选，想要将dialog插入的容器
                referenceContainer: "", //必填，dialog要参考的容器，主要用于获取容器的宽度和位置
                addDialogFlagClass: "", //可选，想要在弹出框中添加的类名，一般用在有多个弹出框时能做操作，
                toHideContainer: "", //可选，要隐藏的容器，主要用于当弹框内容过少，无法完全遮盖已经存在的内容
                hideCloseIcon: false, //可选，隐藏关闭按钮，false不隐藏
                title: "", //必填，弹出框的title
                content: "", //必填，在弹出框中显示的内容，一般是html标签
                footer: "", //可选，在弹出框页脚中显示的按钮，html标签
                aside: "", //隐藏字段，在固定html结构中存放侧边栏弹框用
                close: null, //可选，当关闭的回调，关闭时自动将弹框销毁
                autoDestroy: true, //可选, 隐藏时自动销毁，默认销毁
                closeBefore: null, //可选，当关闭前的回调
                open: null, //可选，每次打开弹出框后的回调，不包括第一次的初始化
                openBefore: null, //可选，每次打开弹出框前的回调，不包括第一次的初始化
                ready: null, //可选，初始化并渲染完成的回调
                render: null //dom节点生成并插入页面时就调用，此时动画未完成
            };
            options = $.extend({}, dialogDefaults, options);
            showDialog(options);
        },
        resetPageFooter: function(options) {
            //当弹出框的高度发生变化时，重设页脚高度
            var dialogDefaults = {
                titleContainer: "", //可选，父层的title
                referenceContainer: "", //可选，想要将dialog插入的容器
                dialogContainer: "", //可选，弹出框容器
                guid: "" //可选，弹出框的guid
            };
            options = $.extend({}, dialogDefaults, options);
            resetPageFooter(options);
        },
        //重设弹框的最小高度
        resetMinHeight: function(options) {
            var dialogDefaults = {
                titleContainer: "", //可选，与弹出框关联的title容器
                referenceContainer: "", //可选，与弹出框关联的内容容器
                guid: "" //可选，弹出框的guid
            };
            options = $.extend({}, dialogDefaults, options);
            resetDialogMinHeight(options);
        },
        //重新设置弹框页脚的位置
        resetDialogFooter: function(options) {
            var dialogDefaults = {
                titleContainer: "", //可选，与弹出框关联的title容器
                referenceContainer: "" //可选，与弹出框关联的内容容器
            };
            options = $.extend({}, dialogDefaults, options);
            resetDialogFooter(options);
        },
        hide: function(options) {
            var dialogDefaults = {
                titleContainer: "", //可选，与弹出框关联的title容器
                referenceContainer: "", //可选，与弹出框关联的内容容器
                guid: "", //可选，弹出框的guid
                isHideAll: false, //可选，true删除所有弹框
                ignoreAllCallback: false, //忽略所有的回调方法
                ignoreCloseCallback: false, //忽略close的回调方法
                ignoreCloseBeforeCallback: false, //忽略closeBefore的回调方法
                destroy: true //可选，值为true或false； true则在隐藏的同时将弹出框remove
            };
            options = $.extend({}, dialogDefaults, options);
            dialogHide(options);
        },
        destroy: function(options) {
            var dialogDefaults = {
                titleContainer: "", //可选，与弹出框关联的title容器
                referenceContainer: "", //可选，与弹出框关联的内容容器
                guid: "" //可选，弹出框的guid
            };
            options = $.extend({}, dialogDefaults, options);
            dialogDestroy(options);
        }
    };

    /**
     * titleContainer 必填，父层的title
     * referenceContainer 必填，想要将dialog插入的容器
     * addDialogFlagClass 可选，想要在弹出框中添加的类名，一般用在有多个弹出框时能做操作
     * title 必填，弹出框的title
     * content 必填，在弹出框中显示的内容，一般是html标签
     * footer 可选，在弹出框页脚中显示的按钮，html标签
     * close 可选，当关闭的回调
     * show 可选，每次打开弹出框后的回调，不包括第一次的初始化
     * ready 可选，初始化并渲染完成的回调
     */
    function showDialog(options) {
        var $body = $("body");
        $body.scrollTop(0);
        var $dialog = "";
        var $insertToDialog = getTheNewestOpenDialog();

        //重置titleContainer,referenceContainer,toHideContainer，使其兼容固定的html结构
        options = resetOptionContainer(options, $insertToDialog);

        if ($insertToDialog.length > 0) {
            //如果要加入的父层是paper对话框，将父层弹出框的边框去掉，对于多层弹框有用
            $insertToDialog.find(".bh-paper-pile-closeIcon").hide();
            $insertToDialog.find(".bh-paper-pile-dialog-container").addClass("bh-bg-transparent");
        }

        setTimeout(function() {
            //隐藏父层弹框的内容，避免子级弹框的内容过少，会看到父级的内容
            if ($insertToDialog.length > 0) {
                $insertToDialog.find("div[bh-paper-pile-dialog-role=bhPaperPileDialogBody]").hide();
            } else {
                //将内容的border去掉
                var $layoutContainer = "";
                var fixedArticle = getFixedArticle();
                if (fixedArticle) {
                    $layoutContainer = fixedArticle;
                } else {
                    $layoutContainer = $("[bh-container-role=container]");
                }
                if ($layoutContainer && $layoutContainer.length > 0) {
                    $layoutContainer.addClass("bh-border-transparent").addClass("bh-bg-transparent");
                }
            }
        }, getAnimateTime());

        //给要遮盖的dom添加缩小动画，动画时间是基础时间的两倍
        options.titleContainer.addClass("bh-animated-doubleTime")
            .removeClass("bh-paper-pile-dialog-parentTitle-toRestore").addClass("bh-paper-pile-dialog-parentTitle-toSmall");

        setTimeout(function() {
            //动画即将结束时给父层弹出框的title加阴影
            options.titleContainer.addClass("bh-paper-pile-dialog-parentTitle-change");
        }, getAnimateTime() * 2 * 0.8);

        //若弹框之前创建过且没有remove，则直接显示，否则新建一个
        var existGuid = options.titleContainer.attr("bh-paper-pile-dialog-role-title-guid");
        if (existGuid) {
            $dialog = $("div[bh-paper-pile-dialog-role-guid=" + existGuid + "]");
            $dialog.removeClass("bh-negative-zIndex").show();
            $dialog.find("div.bh-paper-pile-dialog-container").removeClass("bh-paper-pile-dialog-outDown").addClass("bh-paper-pile-dialog-intoUp");

            setTimeout(function() {
                if (typeof options.open != 'undefined' && options.open instanceof Function) {
                    //执行再次打开的回调
                    options.open();
                }
            }, getAnimateTime() * 2);

            if (typeof options.openBefore != 'undefined' && options.openBefore instanceof Function) {
                //执行再次打开的回调
                options.openBefore();
            }
        } else {
            //创建guid与绑定的title容器和内容容器关联
            var guid = NewGuid();
            var dialogHtml = getDialogHtml();
            options = getContentHtml(options);
            var footerContentHtml = options.footer ? options.footer : "";
            var layoutRole = options.layoutRole ? options.layoutRole : "";
            var layoutClass = options.layoutClass ? options.layoutClass : "";

            //计算弹出框要显示的width、top、left
            var insertContWidth = options.referenceContainer.outerWidth();
            var titleOffset = options.titleContainer.offset();
            var titleTop = titleOffset.top;
            var titleLeft = titleOffset.left;
            //32是迷你头的高度
            var dialogTop = titleTop + 32;
            //设置弹框的位置和宽度
            var dialogStyle = "";
            dialogStyle += 'left:' + titleLeft + 'px;';
            dialogStyle += 'top:' + dialogTop + 'px;';
            dialogStyle += 'width:' + insertContWidth + 'px;';

            var heightData = getFrameHeight();

            dialogStyle += 'height:' + '-moz-calc(100% - ' + parseInt(dialogTop + heightData.footerHeight) + 'px);';
            dialogStyle += 'height:' + '-webkit-calc(100% - ' + parseInt(dialogTop + heightData.footerHeight) + 'px);';
            dialogStyle += 'height:' + 'calc(100% - ' + parseInt(dialogTop + heightData.footerHeight) + 'px);';

            //68是弹框的头部高度
            var dialogHeadHeight = options.title ? 68 : 0;
            var dialogBodyMinHeight = heightData.windowHeight - heightData.footerHeight - dialogTop - dialogHeadHeight;

            dialogHtml = dialogHtml.replace("@title", options.title).replace("@footer", footerContentHtml)
                .replace("@content", options.content).replace("@guid", guid).replace("@style", dialogStyle)
                .replace("@bodyStyle", 'min-height:' + dialogBodyMinHeight + 'px')
                .replace(/@layoutRole/g, layoutRole).replace("@layoutClass", layoutClass);

            //将弹框添加到body
            $dialog = $(dialogHtml);
            if (options.insertContainer.length === 0) {
                options.insertContainer = $body;
            }

            //当title没有的时候，隐藏title的div
            if (!options.title) {
                $dialog.find("div[bh-paper-pile-dialog-role=bhPaperPileDialogHeader]").hide();
                if (!options.layoutRole || options.layoutRole.indexOf('navLeft') === -1) {
                    $dialog.find("div[bh-paper-pile-dialog-role=bhPaperPileDialogBody]").css("margin-top", "24px");
                }
            }

            //隐藏关闭按钮
            if (options.hideCloseIcon) {
                $dialog.find("[bh-paper-pile-dialog-role=bhPaperPileDialogCloseIcon]").hide();
            }

            //将aside加入弹框结构中
            if (options.aside) {
                $dialog.find("[bh-paper-pile-dialog-role=bhPaperPileDialogFooter]").before(options.aside);
            } else {
                $dialog.find("[bh-paper-pile-dialog-role=bhPaperPileDialogFooter]").before('<aside bh-paper-pile-dialog-role="aside"></aside>');
            }

            options.insertContainer.append($dialog);

            //当出现多重弹框时，将已存在的弹框信息放到body上
            var dialogIndex = 1;
            var existDialogData = $body.data("bh-paper-pile-dialog");
            if (existDialogData) {
                dialogIndex = existDialogData.length + 1;
                existDialogData.push({
                    "guid": guid,
                    "index": dialogIndex
                });
            } else {
                existDialogData = [{
                    "guid": guid,
                    "index": dialogIndex
                }];
            }
            $body.data("bh-paper-pile-dialog", existDialogData);
            //设置当前弹框的index和高度
            $dialog.attr("bh-paper-pile-dialog-role-index", dialogIndex);

            //给title和内容容器添加guid
            options.titleContainer.attr("bh-paper-pile-dialog-role-title-guid", guid);
            options.referenceContainer.attr("bh-paper-pile-dialog-role-container-guid", guid);
            //给要隐藏的容器加guid
            if (options.toHideContainer) {
                var hideContLen = options.toHideContainer.length;
                if (hideContLen > 1) {
                    for (var i = 0; i < hideContLen; i++) {
                        options.toHideContainer[i].attr("bh-paper-pile-dialog-role-hide-container-guid", guid);
                    }
                } else {
                    options.toHideContainer.attr("bh-paper-pile-dialog-role-hide-container-guid", guid);
                }
            }

            //若用户有要添加的样式类，则加入到弹框中
            if (options.addDialogFlagClass) {
                $dialog.addClass(options.addDialogFlagClass);
            }

            if (options.footer) {
                //当有页脚时，添加页脚距离，避免页脚覆盖内容
                var dialogFooterHeigth = $dialog.find("[bh-paper-pile-dialog-role=bhPaperPileDialogFooter]").outerHeight();
                var pageFooterHeight = $("[bh-footer-role=footer]").outerHeight();
                var dialogPaddingBottom = dialogFooterHeigth + pageFooterHeight;
                $dialog.find("div[bh-paper-pile-dialog-role=bhPaperPileDialogBody]").css({
                    "padding-bottom": dialogPaddingBottom
                });
            }

            $dialog.data("closeFun", options.close);
            $dialog.data("closeBeforeFun", options.closeBefore);

            setTimeout(function() {
                //动画结束后再进行事件绑定，避免动画未结束时点击关闭，导致显示错误
                //弹出框事件绑定
                dialogEventListen($dialog, options);

                if (typeof options.ready != 'undefined' && options.ready instanceof Function) {
                    //获取该弹框的header，section，footer，aside的jquery对象
                    var dialogParts = getDialogPartDom($dialog);
                    //执行初始化完成事件，并将对应节点的jquery对象返回
                    options.ready(dialogParts.dialogHeader, dialogParts.dialogSection, dialogParts.dialogFooter, dialogParts.dialogAside);
                }
            }, getAnimateTime() * 2);

            if (typeof options.render != 'undefined' && options.render instanceof Function) {
                var dialogParts = getDialogPartDom($dialog);
                //执行初始化完成事件，并将对应节点的jquery对象返回
                options.render(dialogParts.dialogHeader, dialogParts.dialogSection, dialogParts.dialogFooter, dialogParts.dialogAside);
            }
        }

        //将要隐藏的容器隐藏
        if (options.toHideContainer) {
            var hideContLen = options.toHideContainer.length;
            if (hideContLen > 1) {
                for (var i = 0; i < hideContLen; i++) {
                    options.toHideContainer[i].hide();
                }
            } else {
                options.toHideContainer.hide();
            }
        }

        setTimeout(function() {
            //给弹出框的页脚添加浮动属性
            dialogFooterToFixed($dialog, options);

            //移除弹框动画，避免fixed属性不可用
            $dialog.find("div.bh-paper-pile-dialog-container").removeClass("bh-paper-pile-dialog-intoUp");

            setCurrentFooterPosition($dialog);

            //给按钮添加水波纹效果
            BH_UTILS && BH_UTILS.wavesInit();

        }, getAnimateTime() * 2);
    }

    //获取该弹框的header，section，footer，aside的jquery对象
    function getDialogPartDom($dialog) {
        var $dialogHeader = $dialog.find("[bh-paper-pile-dialog-role=bhPaperPileDialogHeader]");
        var $dialogBody = $dialog.find("[bh-paper-pile-dialog-role=bhPaperPileDialogBody]");
        var $dialogSection = $dialogBody.children("section");
        var $dialogAside = $dialog.find("[bh-paper-pile-dialog-role=aside]");
        var $dialogFooter = $dialog.find("[bh-paper-pile-dialog-role=bhPaperPileDialogFooter]").children("footer");
        return {
            dialogHeader: $dialogHeader,
            dialogSection: $dialogSection,
            dialogFooter: $dialogFooter,
            dialogAside: $dialogAside
        };
    }

    /**
     * 重新设置option的container数据
     * @param options
     * @param $insertToDialog 当存在多层弹框时，该值是最新弹出的弹框层
     * @returns {*}
     */
    function resetOptionContainer(options, $insertToDialog) {
        if ($insertToDialog) {
            options = resetContainerHandle(options, $insertToDialog, true);
        } else {
            var fixedArticle = getFixedArticle();
            if (fixedArticle && fixedArticle.length > 0) {
                options = resetContainerHandle(options, fixedArticle, false);
            }
        }
        return options;
    }

    /**
     * 对option进行赋值
     * @param options
     * @param $dom
     * @param isDialogFlag true是存在多层弹框
     * @returns {*}
     */
    function resetContainerHandle(options, $dom, isDialogFlag) {
        if ($dom && $dom.length > 0) {
            if (!options.titleContainer) {
                if (isDialogFlag) {
                    options.titleContainer = $dom.find("[bh-paper-pile-dialog-role=bhPaperPileDialogHeader]");
                } else {
                    if ($dom.children("h2").length > 0) {
                        options.titleContainer = $dom.children("h2");
                    } else {
                        options.titleContainer = $dom.children("hgroup");
                    }
                }
            }
            if (!options.referenceContainer) {
                options.referenceContainer = isDialogFlag ? $dom.find("[bh-paper-pile-dialog-role=bhPaperPileDialogBody]") : $dom;
            }
            if (!options.toHideContainer) {
                if (isDialogFlag) {
                    var $referenceDialog = options.referenceContainer.closest("[bh-paper-pile-dialog-role=bhPaperPileDialog]");
                    options.toHideContainer = $referenceDialog.find("[bh-paper-pile-dialog-role=bhPaperPileDialogBody]");
                } else {
                    var layoutType = $dom.attr("bh-layout-role");
                    if (layoutType === "navLeft") {
                        options.toHideContainer = [$dom.children('section'), $dom.children('nav')];
                    } else {
                        options.toHideContainer = $dom.children('section');
                    }
                }
            }
        }

        return options;
    }

    //获取固定结构的article
    function getFixedArticle() {
        var fixedArticle = null;
        var $body = $("body");
        if ($body.children("main").length > 0) {
            var tempFixedArticle = $body.children("main").children("article");
            if (tempFixedArticle.length > 0) {
                fixedArticle = tempFixedArticle;
            }
        }
        return fixedArticle;
    }

    //获取传入的content，若传入的content的article下的第一级子节点有h2，则将其移除
    function getContentHtml(options) {
        var contentHtml = options.content;
        var $contentHtml = $(contentHtml);
        var $title = $contentHtml.children("h2");
        var $footer = $contentHtml.children("footer");
        //判断是否是固定结构的dom
        var isFixedDom = false;
        if ($contentHtml[0].localName === "article" && $contentHtml.children("section").length > 0) {
            isFixedDom = true;
        }

        if (!options.title) {
            if ($title.length > 0) {
                $title.addClass("bh-paper-pile-dialog-headerTitle").attr("bh-paper-pile-dialog-role", "bhPaperPileDialogHeader");
                options.title = $title[0].outerHTML;
                $title.remove();
            }
        } else {
            //当通过属性传入的title时，默认在外面套上h2标签
            options.title = '<h2 class="bh-paper-pile-dialog-headerTitle" bh-paper-pile-dialog-role="bhPaperPileDialogHeader">' + options.title + '</h2>';
            if (isFixedDom) {
                $title.remove();
            }
        }

        if (!options.footer) {
            if ($footer.length > 0) {
                $footer.addClass('bh-clearfix');
                options.footer = $footer[0].outerHTML;
                $footer.remove();
            }
        } else {
            //当通过属性传入的footer时，默认在外面套上footer标签
            options.footer = '<footer class="bh-clearfix">' + options.footer + '</footer>';
            if (isFixedDom) {
                $footer.remove();
            }
        }

        if (isFixedDom) {
            var $dialogAside = $contentHtml.children("aside");
            if ($dialogAside.length > 0) {
                options.aside = $dialogAside[0].outerHTML;
                $dialogAside.remove();
            }
            options.layoutRole = $contentHtml.attr('bh-layout-role');
            options.layoutClass = $contentHtml.attr('class');
            options.content = $contentHtml[0].innerHTML;
        } else {
            options.content = '<section>' + options.content + '</section>';
            if (isFixedDom) {
                var $dialogAside = $contentHtml.children("aside");
                if ($dialogAside.length > 0) {
                    $dialogAside.attr('bh-paper-pile-dialog-role', 'aside');
                    options.aside = $dialogAside[0].outerHTML;
                    $dialogAside.remove();
                }
            }
        }

        return options;
    }

    /**
     * 给容器设定最小高度
     * @param $setContainer 要设置最小高度的容器
     * @param diff 去掉页头和页脚的偏移量
     * @param type type === "resetDialogMinHeight"是手动重设弹框高度时的处理
     */
    function setDialogContentMinHeight($dialogBody) {
        var heightData = getFrameHeight();
        var diffTop = $dialogBody.offset().top;
        var minHeight = heightData.windowHeight - heightData.footerHeight - diffTop;
        $dialogBody.css("min-height", minHeight + "px");
    }

    function getFrameHeight() {
        var windowHeight = $(window).height();
        var footerHeight = $("[bh-footer-role=footer]").outerHeight();
        var headerHeight = $("[bh-header-role=bhHeader]").outerHeight();
        return {
            "windowHeight": windowHeight,
            "footerHeight": footerHeight,
            "headerHeight": headerHeight
        };
    }

    /**
     * 隐藏弹出框
     * titleContainer 可选，与弹出框关联的title容器
     * referenceContainer 可选，与弹出框关联的内容容器
     * guid 可选，弹出框的guid
     * destroy 可选，值为true或false； true则在隐藏的同时将弹出框remove
     */
    function dialogHide(options) {
        var $dialog = "";
        var $titleContainer = "";
        var $referenceContainer = "";
        var guid = "";

        if (options.titleContainer) {
            $titleContainer = options.titleContainer;
            guid = $titleContainer.attr("bh-paper-pile-dialog-role-title-guid");
        } else if (options.referenceContainer) {
            $referenceContainer = options.titleContainer;
            guid = $referenceContainer.attr("bh-paper-pile-dialog-role-container-guid");
        } else if (options.guid) {
            guid = options.guid;
        }

        if (!guid) {
            var $newestDialog = getTheNewestOpenDialog();
            if ($newestDialog) {
                $dialog = $newestDialog;
            } else {
                $dialog = $("div[bh-paper-pile-dialog-role=bhPaperPileDialog]");
            }
            guid = $dialog.attr("bh-paper-pile-dialog-role-guid");
        }
        if (!$dialog) {
            $dialog = $("div[bh-paper-pile-dialog-role-guid=" + guid + "]");
        }

        if ($dialog.length > 0) {
            var dialogIndex = $dialog.attr("bh-paper-pile-dialog-role-index");
            dialogIndex = parseInt(dialogIndex, 10);
            var existDialogData = $("body").data("bh-paper-pile-dialog");
            var existDialogLen = existDialogData.length;
            //当传入关闭所有弹框时，将对话框指向最低一层
            if (options.isHideAll) {
                dialogIndex = 1;
            }
            //当点击父级弹框时，由高到低依次隐藏弹框
            if (dialogIndex < existDialogLen) {
                for (var i = existDialogLen; i >= dialogIndex; i--) {
                    var existItem = existDialogData[i - 1];
                    if (existItem) {
                        options = getCallbackFun(options, existItem);
                        var existGuid = existItem.guid;
                        guid = existGuid;
                        dialogToHide(existGuid, options);
                    }
                }
            } else {
                options = getCallbackFun(options, $dialog);
                dialogToHide(guid, options);
            }
        }

        if (options.toShowContainer) {
            options.toShowContainer.show();
        } else {
            $('body').find("[bh-paper-pile-dialog-role-hide-container-guid=" + guid + "]").show();
        }

        //三层纸质弹框关闭返回上次纸质弹框时  页脚位置不对
        if ($dialog.length > 0) {
            setTimeout(function() {
                $.bhPaperPileDialog.resetPageFooter(); //改变页面的页脚位置
                $.bhPaperPileDialog.resetDialogFooter(); //改变弹框的页脚位置
            }, 1000);
        }
    }

    function getCallbackFun(options, $dialog) {
        if (!options.ignoreAllCallback) {
            if (!options.ignoreCloseCallback) {
                options.close = $dialog.data('closeFun');
            }
            if (!options.ignoreCloseBeforeCallback) {
                options.closeBefore = $dialog.data('closeBeforeFun');
            }
        }
        return options;
    }

    /**
     * 执行隐藏操作
     * @param guid
     * @param options
     */
    function dialogToHide(guid, options) {
        options.guid = guid;

        if (options.closeBefore && options.closeBefore instanceof Function) {
            var closeFlag = options.closeBefore();
            if (closeFlag) {
                doDialogHideHandle(guid, options);
            }
        } else {
            doDialogHideHandle(guid, options);
        }
    }

    function doDialogHideHandle(guid, options) {
        var $dialog = $("[bh-paper-pile-dialog-role-guid=" + guid + "]");
        var $titleContainer = $("[bh-paper-pile-dialog-role-title-guid=" + guid + "]");
        var $dialogContainer = $dialog.find("div.bh-paper-pile-dialog-container");
        $dialog.find('div[bh-paper-pile-dialog-role="bhPaperPileDialogFooter"]').remove();
        $dialogContainer.removeClass("bh-paper-pile-dialog-intoUp").addClass("bh-paper-pile-dialog-outDown");
        $titleContainer.removeClass("bh-paper-pile-dialog-parentTitle-toSmall").removeClass("bh-paper-pile-dialog-parentTitle-change").addClass("bh-paper-pile-dialog-parentTitle-toRestore");

        var $insertToDialog = $titleContainer.closest("[bh-paper-pile-dialog-role=bhPaperPileDialog]");

        setTimeout(function() {
            //将父级弹框的内容显示出来
            if ($insertToDialog.length > 0) {
                $insertToDialog.find("[bh-paper-pile-dialog-role=bhPaperPileDialogBody]").show();
            } else {
                //将内容的border去掉
                var fixedArticle = getFixedArticle();
                var $layoutContainer = "";
                if (fixedArticle) {
                    $layoutContainer = fixedArticle;
                } else {
                    $layoutContainer = $("[bh-container-role=container]");
                }
                if ($layoutContainer && $layoutContainer.length > 0) {
                    $layoutContainer.removeClass("bh-border-transparent").removeClass("bh-bg-transparent");
                }
            }

            $dialogContainer.removeClass("bh-bg-transparent");
            //隐藏弹框时重置一下页脚
            resetPageFooter({
                titleContainer: "", //可选，父层的title
                referenceContainer: "", //可选，想要将dialog插入的容器
                dialogContainer: "", //可选，弹出框容器
                guid: "" //可选，弹出框的guid
            });
            resetDialogFooter({
                titleContainer: "", //可选，与弹出框关联的title容器
                referenceContainer: "" //可选，与弹出框关联的内容容器
            });
        }, getAnimateTime());

        //弹出框的头部透明度变成0时，使其隐藏起来，避免出现文字重叠
        setTimeout(function() {
            if ($insertToDialog.length > 0) {
                $insertToDialog.find(".bh-paper-pile-closeIcon").show();
            }
            $dialog.addClass("bh-negative-zIndex").hide();

            setPageFooterToRelative();
            //if(!isHasParent){
            //    setPageFooterToRelative();
            //}else{
            //    resetPageFooter({guid: parentGuid});
            //}

            if (options.close && options.close instanceof Function) {
                //获取该弹框的header，section，footer，aside的jquery对象
                var dialogParts = getDialogPartDom($dialog);
                //执行初始化完成事件，并将对应节点的jquery对象返回
                options.close(dialogParts.dialogHeader, dialogParts.dialogSection, dialogParts.dialogFooter, dialogParts.dialogAside);
            }

            //当传入destroy是true，或autoDestroy是false时，将弹框移除
            if ((options && options.destroy) || (options && options.autoDestroy)) {
                dialogDestroy(options);
            }
        }, getAnimateTime() * 2);
    }

    //获取最新打开的弹框对象
    function getTheNewestOpenDialog() {
        var $newestDialog = "";
        var insertToDialogIndex = 0;
        var hasOpenDialogs = $("body").find("div[bh-paper-pile-dialog-role=bhPaperPileDialog]");
        if (hasOpenDialogs.length > 0) {
            hasOpenDialogs.each(function() {
                var $itemDialog = $(this);
                var dialogIndex = parseInt($itemDialog.attr("bh-paper-pile-dialog-role-index"), 10);
                if (dialogIndex > insertToDialogIndex) {
                    $newestDialog = $itemDialog;
                }
            });
        }
        return $newestDialog;
    }

    function setPageFooterToRelative() {
        var $footer = $("[bh-footer-role=footer]");
        var footerNormalStyle = $footer.attr("bh-footer-role-normal-style");
        $footer.attr("style", footerNormalStyle);
    }

    function resetPageFooter(options) {
        $("[bh-footer-role=footer]").css("top", 0);
        var guid = "";
        if (options.titleContainer) {
            guid = options.titleContainer.attr("bh-paper-pile-dialog-role-title-guid");
        } else if (options.referenceContainer) {
            guid = options.referenceContainer.attr("bh-paper-pile-dialog-role-container-guid");
        } else if (options.guid) {
            guid = options.guid;
        }
        var $dialog = "";
        if (!guid) {
            if (options.dialogContainer) {
                $dialog = options.dialogContainer;
            } else {
                $dialog = getTheNewestOpenDialog();
                //$dialog = $("[bh-paper-pile-dialog-role=bhPaperPileDialog]");
            }
        } else {
            $dialog = $("[bh-paper-pile-dialog-role-guid=" + guid + "]");
        }
        //当弹框存在时才执行
        if ($dialog) {
            var positionAndHeight = getPositionAndHeight($dialog);
            //设置页面页脚style，使其绝对定位到页面底部
            setPageFooterToAbsolute(positionAndHeight);
        }
    }

    /**
     * 动画的执行的基础时间
     * @returns {number}
     */
    function getAnimateTime() {
        return 450;
    }

    /**
     * 将弹框销毁，不传任何值，则将所有的弹出框删除
     * titleContainer 可选，与弹出框关联的title容器
     * referenceContainer 可选，与弹出框关联的内容容器
     * guid 可选，弹出框的guid
     */
    function dialogDestroy(options) {
        var guid = getDialogGuid(options);

        if (guid) {
            removeDialogAttr(guid);
        } else {
            var $dialogs = $("body").find("div[bh-paper-pile-dialog-role=bhPaperPileDialog]");
            $dialogs.each(function() {
                var guid = $(this).attr("bh-paper-pile-dialog-role-guid");
                removeDialogAttr(guid);
            });
        }
    }

    /**
     * 移除对话框及与其关联的容器属性
     * @param guid
     */
    function removeDialogAttr(guid) {
        var $dialog = $("div[bh-paper-pile-dialog-role-guid=" + guid + "]");
        if ($dialog.length === 0) {
            return;
        }
        var dialogIndex = $dialog.attr("bh-paper-pile-dialog-role-index");
        dialogIndex = parseInt(dialogIndex, 10);
        $("[bh-paper-pile-dialog-role-title-guid=" + guid + "]").removeAttr("bh-paper-pile-dialog-role-title-guid").off("click");
        $("[bh-paper-pile-dialog-role-container-guid=" + guid + "]").removeAttr("bh-paper-pile-dialog-role-container-guid");
        $dialog.remove();

        var existDialogData = $("body").data("bh-paper-pile-dialog");
        var existDialogLen = existDialogData.length;
        if (existDialogLen === 1) {
            $("body").removeData("bh-paper-pile-dialog");
        } else {
            var newDialogData = [];
            for (var i = 0; i < existDialogLen; i++) {
                var existItem = existDialogData[i];
                var existIndex = existItem.index;
                if (existIndex != dialogIndex) {
                    if (existIndex > dialogIndex) {
                        existItem.index = existIndex - 1;
                        newDialogData.push(existItem);
                    } else {
                        newDialogData.push(existItem);
                    }
                }
            }
            $("body").data("bh-paper-pile-dialog", newDialogData);
        }
    }

    /**
     * 弹出框的结构html
     * @returns {string}
     */
    function getDialogHtml() {
        var _html =
            '<div class="bh-paper-pile-dialog @layoutRole" style="@style" bh-paper-pile-dialog-role="bhPaperPileDialog" bh-paper-pile-dialog-role-guid="@guid">' +
            '<div class="bh-paper-pile-dialog-container bh-animated-doubleTime bh-paper-pile-dialog-intoUp">' +
            '<i class="iconfont icon-close bh-pull-right bh-paper-pile-closeIcon" bh-paper-pile-dialog-role="bhPaperPileDialogCloseIcon"></i>' +
            //'<div class="bh-paper-pile-dialog-headerTitle" bh-paper-pile-dialog-role="bhPaperPileDialogHeader">' +
            '@title' +
            //'</div>' +
            '<div class="bh-paper-pile-body bh-card bh-card-lv1 @layoutClass" bh-paper-pile-dialog-role="bhPaperPileDialogBody" bh-layout-role="@layoutRole" style="@bodyStyle">' +
            '@content' +
            '</div>' +
            '<div class="bh-paper-pile-dialog-footer bh-border-v" bh-paper-pile-dialog-role="bhPaperPileDialogFooter">@footer</div>' +
            '</div>' +
            '</div>';
        return _html;
    }

    /**
     * 判断弹出框是否有页脚，有则显示页脚
     * @param $dialog
     * @param data
     * @param flag flag=get那就直接返回样式
     */
    function dialogFooterToFixed($dialog, data, flag) {
        var footerStyle = '';
        if (data.footer) {
            var dialogWidth = $dialog.outerWidth();
            var dialogLeft = $dialog.offset().left;
            footerStyle = 'left:' + dialogLeft + 'px;width:' + dialogWidth + 'px;position:fixed;bottom:0;top:auto;display:block;';
            if (flag !== 'get') {
                $dialog.find("div[bh-paper-pile-dialog-role=bhPaperPileDialogFooter]")
                    .css({
                        "left": dialogLeft + "px",
                        "width": dialogWidth + "px",
                        "position": "fixed",
                        "bottom": "0",
                        "top": "auto",
                        "display": "block"
                    })
                    .removeClass('bh-paper-pile-dialog-footer-relative');
            }
        }
        return footerStyle;
    }

    /**
     * 获取浏览器和对话框的相关位置和高度等
     * @param $dialog
     * @returns {{}}
     */
    function getPositionAndHeight($dialog) {
        var data = {};
        var $window = $(window);
        var $body = $("body");
        var scrollTop = $window.scrollTop();
        var windowHeight = $window.height();

        var bodyHeight = $body.get(0).scrollHeight;

        var footerHeight = $("[bh-footer-role=footer]").outerHeight();

        if ($dialog) {
            var $dialogBody = $dialog.find("div[bh-paper-pile-dialog-role=bhPaperPileDialogBody]");
            var dialogBodyHeight = $dialogBody.outerHeight(true);
            var dialogHeight = $dialog.outerHeight();
            var dialogOffset = $dialog.offset();
            var dialogBodyOffset = $dialogBody.offset();
            var dialogFooterHeight = 0;
            var $dialogFooter = $dialog.find('div[bh-paper-pile-dialog-role="bhPaperPileDialogFooter"]');
            if ($dialogFooter.length > 0) {
                dialogFooterHeight = $dialogFooter.outerHeight(true);
            }

            data.dialogBodyHeight = dialogBodyHeight;
            data.dialogBodyOffset = dialogBodyOffset;
            data.dialogOffset = dialogOffset;
            data.dialogHeight = dialogHeight;
            data.dialogFooterHeight = dialogFooterHeight;
        }

        data.windowHeight = windowHeight;
        data.scrollTop = scrollTop;
        data.bodyHeight = bodyHeight;
        data.footerHeight = footerHeight;
        return data;
    }

    /**
     * 设置页面和对话框页脚style
     * @param $dialog
     */
    function setCurrentFooterPosition($dialog) {
        //重置页脚前，将页面的页脚top清零，否则有子级弹框时，重设高度无效
        $("[bh-footer-role=footer]").css({
            "top": 0,
            "z-index": -1
        });
        var positionAndHeight = getPositionAndHeight($dialog);

        var $dialogFooter = $dialog.find("div[bh-paper-pile-dialog-role=bhPaperPileDialogFooter]");
        //var dialogFooterFixedStyle = $dialogFooter.attr("style");
        var dialogFooterFixedStyle = dialogFooterToFixed($dialog, {
            footer: true
        }, 'get');
        $dialogFooter.attr("bh-paper-pile-dialog-role-footer-fixed", dialogFooterFixedStyle);

        //设置页面页脚style，使其绝对定位到页面底部
        setPageFooterToAbsolute(positionAndHeight);
        var footerPositionTop = positionAndHeight.bodyHeight - positionAndHeight.footerHeight;

        //对话框高度小于浏览器高度，则让对话框页脚取消浮动
        var dialogShowHeight = positionAndHeight.dialogBodyHeight + positionAndHeight.dialogOffset.top;
        if (dialogShowHeight < positionAndHeight.windowHeight) {
            //如果弹出框的显示高度达不到页脚的top，则将页脚的位置下移，避免出现超出的侧边框线
            if (dialogShowHeight < footerPositionTop) {
                setDialogFooterRelative($dialogFooter, "low");
            } else {
                setDialogFooterRelative($dialogFooter);
            }
        }
    }

    function setPageFooterToAbsolute(positionAndHeight) {
        //设置页面页脚style，使其绝对定位到页面底部
        var $pageFooter = $("[bh-footer-role=footer]");
        if (!$pageFooter.attr("bh-footer-role-normal-style")) {
            var pageFooterNormalStyle = $pageFooter.attr("style");
            if (!pageFooterNormalStyle) {
                pageFooterNormalStyle = " ";
            }
            $pageFooter.attr("bh-footer-role-normal-style", pageFooterNormalStyle);
        }
        //当弹出框的高度大于浏览器的高度时，让body的高度再额外增加页脚高度。因为在弹框出现时页脚已经变成了绝对定位，且重设页脚前将页脚的top变为了0
        var footerPositionTop = positionAndHeight.bodyHeight;
        if (positionAndHeight.dialogBodyHeight + positionAndHeight.dialogBodyOffset.top > positionAndHeight.windowHeight) {
            footerPositionTop = positionAndHeight.dialogOffset.top + positionAndHeight.dialogBodyHeight;
        } else {
            footerPositionTop = positionAndHeight.windowHeight - positionAndHeight.footerHeight;
        }
        var footerPositionLeft = $("header[bh-header-role=bhHeader]").find("div.bh-headerBar-content").offset().left;
        $pageFooter.css({
            "top": footerPositionTop,
            "left": footerPositionLeft,
            "width": "100%",
            "position": "absolute",
            "z-index": "9999"
        });
    }

    /**
     * 滚动条滚动时，设置页脚样式
     * @param $dialog
     */
    function scrollToSetFooterPosition($dialog) {
        var positionAndHeight = getPositionAndHeight($dialog);

        var $dialogFooter = $dialog.find("div[bh-paper-pile-dialog-role=bhPaperPileDialogFooter]");
        if (positionAndHeight.windowHeight + positionAndHeight.scrollTop + positionAndHeight.footerHeight >= positionAndHeight.bodyHeight) {
            setDialogFooterRelative($dialogFooter, "low");
        } else {
            var dialogFooterFixedStyle = $dialogFooter.attr("bh-paper-pile-dialog-role-footer-fixed");
            $dialogFooter.attr("style", dialogFooterFixedStyle);
        }
    }

    /**
     * 将对话框页脚设成相对定位
     * @param $dialogFooter
     * @param flag  low
     */
    function setDialogFooterRelative($dialogFooter, flag) {
        //当弹出框的页脚没有任何内容时，不做任何处理
        if ($dialogFooter.contents().length === 0) {
            return;
        }

        var footerHeight = $("[bh-footer-role=footer]").outerHeight();
        var $dialog = $dialogFooter.closest('div[bh-paper-pile-dialog-role="bhPaperPileDialog"]');
        var $dialogBody = $dialog.find("[bh-paper-pile-dialog-role=bhPaperPileDialogBody]");
        var $dialogHeader = $dialog.find("[bh-paper-pile-dialog-role=bhPaperPileDialogHeader]");
        var dialogFooterHeight = $dialogFooter.outerHeight();
        var dialogFooterBottom = dialogFooterHeight + footerHeight;
        if (flag === "low") {
            dialogFooterBottom = dialogFooterHeight;
        }

        var dialogBodyHeight = 0;
        var layoutType = '';
        $dialogBody.children().each(function() {
            var $item = $(this);
            //先判断该布局是不是左右布局，是左右布局则继续读取它里面的子结构然后取高度大的nav或section的高度做dialogBodyHeight高度
            if ($item[0].localName === "nav") {
                layoutType = 'navLeft';
            }

            if (layoutType === 'navLeft') {
                var navContentHeight = 0;
                $item.children().each(function() {
                    navContentHeight += $(this).outerHeight();
                });
                if (navContentHeight > dialogBodyHeight) {
                    dialogBodyHeight = navContentHeight;
                }
            } else {
                var itemHeight = $item.outerHeight(true);
                dialogBodyHeight += itemHeight;
            }
        });
        var dialogBodyPaddingBottom = parseInt($dialogBody.css("padding-bottom"), 10);
        dialogBodyPaddingBottom = dialogBodyPaddingBottom ? dialogBodyPaddingBottom : 0;

        var dialogBodyMinHeight = parseInt($dialogBody.css("min-height"), 10);
        dialogBodyMinHeight = dialogBodyMinHeight ? dialogBodyMinHeight : 0;

        //当弹出框的内容高度比弹出框的最小高度还小的时候，让弹出框的页脚能自适应高度
        if ((dialogBodyHeight + dialogBodyPaddingBottom) < dialogBodyMinHeight) {
            $dialogFooter.removeAttr("style");
            /**
             * 24是对话框页脚距离内容的间距
             * dialogBodyMinHeight是页面页脚高度和对话框页脚高度的和
             * 页面页脚的高度是32，所以24是安全距离可以直接加
             */
            dialogBodyHeight += 24;
            dialogBodyHeight += $dialogHeader.outerHeight();

            $dialogFooter.css({
                "top": dialogBodyHeight + "px",
                "bottom": "auto"
            }).addClass('bh-paper-pile-dialog-footer-relative');
        } else {
            if ($dialogFooter.css('position') !== 'absolute') {
                $dialogFooter.css({
                    "left": 0,
                    "bottom": dialogFooterBottom + "px",
                    "position": "relative"
                });
            } else {
                $dialogFooter.css({
                    "top": "auto",
                    "bottom": "0"
                });
            }
        }
        $dialogFooter.show();
    }

    /**
     * 弹出框的关闭事件监听
     * @param $dialog
     * @param data
     */
    function dialogEventListen($dialog, data) {
        //点击关闭按钮
        $dialog.on("click", "i[bh-paper-pile-dialog-role=bhPaperPileDialogCloseIcon]", function() {
            var guid = $(this).closest("[bh-paper-pile-dialog-role=bhPaperPileDialog]").attr("bh-paper-pile-dialog-role-guid");
            data.guid = guid;
            dialogHide(data);
        });

        //当关闭按钮不隐藏时，给头部title添加点击事件
        if (!data.hideCloseIcon) {
            //点击弹框头部条隐藏弹框
            data.titleContainer.on("click", function() {
                var guid = $(this).attr("bh-paper-pile-dialog-role-title-guid");
                data.guid = guid;
                dialogHide(data);
            });
        } else {
            data.titleContainer.css({
                "cursor": "default"
            });
        }

        //监听浏览器滚动事件，设置页脚样式
        if (data.footer) {
            $(window).scroll(function(e) {
                scrollToSetFooterPosition($dialog);
            });
        }
    }

    //重新设置弹框页脚的位置
    function resetDialogFooter(options) {
        var guid = getDialogGuid(options);
        if (guid) {
            setTimeout(function() {
                var $dialog = $("div[bh-paper-pile-dialog-role-guid=" + guid + "]");
                if (!$dialog.find('[bh-paper-pile-dialog-role="bhPaperPileDialogFooter"]').html()) {
                    return;
                }
                var positionAndHeight = getPositionAndHeight($dialog);
                var dialogShowHeight = positionAndHeight.dialogBodyHeight + positionAndHeight.dialogOffset.top;
                //对话框高度小于浏览器高度，则让对话框页脚取消浮动
                if (dialogShowHeight < positionAndHeight.windowHeight) {
                    setCurrentFooterPosition($dialog);
                } else {
                    //给弹出框的页脚添加浮动属性
                    dialogFooterToFixed($dialog, {
                        "footer": true
                    });
                }
            }, 50);
        }
    }

    function NewGuid() {
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }

    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }

    //重设弹框的最小高度
    function resetDialogMinHeight(options) {
        var guid = getDialogGuid(options);
        if (guid) {
            var $dialog = $("div[bh-paper-pile-dialog-role-guid=" + guid + "]");
            var $dialogBody = $dialog.find("div[bh-paper-pile-dialog-role=bhPaperPileDialogBody]");
            setDialogContentMinHeight($dialogBody);
        }
    }

    //获取弹框的guid
    function getDialogGuid(options) {
        var guid = "";
        if (options.titleContainer) {
            guid = options.titleContainer.attr("bh-paper-pile-dialog-role-title-guid");
        } else if (options.referenceContainer) {
            guid = options.referenceContainer.attr("bh-paper-pile-dialog-role-container-guid");
        } else if (options.guid) {
            guid = options.guid;
        } else {
            var $insertToDialog = getTheNewestOpenDialog();
            if ($insertToDialog.length > 0) {
                guid = $insertToDialog.attr('bh-paper-pile-dialog-role-guid');
            }
        }
        return guid;
    }
})(jQuery);
(function($) {
    $.bhPropertyDialog = {
        show: function(data) {
            var dialogDefaults = {
                insertContainer: "", //必填，弹出框要插入的容器
                title: "", //必填，弹出框的title
                content: "", //必填，弹出框的内容html
                footer: "", //可选，弹出框的页脚按钮html，可传入html片段，或default（使用默认的页脚），或空（无页脚）
                selector: "",
                hideCover: false, //可选，是否隐藏遮罩层，默认不隐藏
                autoDestroy: true, //可选, 隐藏时自动销毁，默认销毁
                ok: null,
                cancel: null,
                open: null, //可选，每次打开弹出框后的回调，不包括第一次的初始化
                hide: null, //可选，每次隐藏弹出框后的回调
                ready: null //可选，初始化并渲染完成的回调
            };
            var options = $.extend({}, dialogDefaults, data);
            showDialog(options);
        },
        hide: function(data) {
            var dialogDefaults = {
                close: null, //可选，当关闭的回调
                destroy: true //可选，值为true或false； true则在隐藏的同时将弹出框remove
            };
            var options = $.extend({}, dialogDefaults, data);
            dialogHide(options);
        },
        footerHide: function() {
            dialogFooterHide();
        },
        footerShow: function() {
            dialogFooterShow();
        },
        destroy: function() {
            dialogDestroy();
        }
    };

    /**
     * 动画的执行的基础时间
     * @returns {number}
     */
    function getAnimateTime() {
        return 450;
    }

    /**
     * 弹出侧边框
     * @param insertContainer 弹出框要插入的容器
     * @param title 弹出框的title
     * @param content 弹出框的内容html
     * @param footer 弹出框的按钮html
     */
    function showDialog(data) {
        //当输入的插入容器不存在时，会导致死循环
        if (data.insertContainer) {
            if (data.insertContainer.length === 0) {
                if (typeof window.console !== 'undefined') {
                    window.console.error('insertContainer 要插入的容器不存在');
                }
                return;
            }
        }
        var $dialog = $("div[bh-property-dialog-role=bhPropertyDialog]");
        data = resetOptionContainer(data);
        //给传入的title，content，footer添加标签
        data = addTagToOption(data);
        //若不存在则新建一个
        if ($dialog.length === 0) {
            //获取弹框框架
            var dialogHtml = getDialogHtml();
            //获取页脚html
            var footerHtml = "";
            if (data.footer) {
                if (data.footer === "default") {
                    //使用默认页脚
                    footerHtml = getDefaultFooterHtml();
                } else {
                    //使用传入的页脚
                    footerHtml = data.footer;
                }
            }
            dialogHtml = dialogHtml.replace("@title", data.title).replace("@content", data.content).replace("@footer", data.footer);
            $dialog = $(dialogHtml);
            //无页脚时，隐藏页脚
            if (!footerHtml) {
                $dialog.find("[bh-property-dialog-role=footer]").hide();
            }

            data.insertContainer.append($dialog);
            //给弹框的body设置高度,当内容过多时使其能出滚动条
            setDialogBodyHeight();
            //弹框事件监听
            dialogEventListen($dialog, data);

            setTimeout(function() {
                //初始化结束后的回调
                if (typeof data.ready != 'undefined' && data.ready instanceof Function) {
                    //获取该弹框的header，section，footer的jquery对象
                    var $dialogHeader = $dialog.find("[bh-property-dialog-role=header]").children();
                    var $dialogBody = $dialog.find("[bh-property-dialog-role=body]").children();
                    var $dialogFooter = $dialog.find("[bh-property-dialog-role=footer]").children();

                    data.ready($dialogHeader, $dialogBody, $dialogFooter);
                }

                //给按钮添加水波纹效果
                BH_UTILS && BH_UTILS.wavesInit();
                $dialog.find("[bh-property-dialog-role=body]").niceScroll({
                    zindex: 99999,
                    horizrailenabled: false
                });
            }, getAnimateTime());
        } else {
            setTimeout(function() {
                //每次打开的回调
                if (typeof data.open != 'undefined' && data.open instanceof Function) {
                    data.open();
                }
            }, getAnimateTime());
        }

        //当hideCover为false时显示遮罩层
        if (!data.hideCover) {
            $dialog.find(".bh-property-dialog-cover").show()
                .removeClass("bh-property-dialog-cover-fadeOut").addClass("bh-property-dialog-cover-fadeIn");
        }

        setDialogPosition($dialog, data);

        $dialog.show();
        //移除动画
        $dialog.find("div.bh-property-dialog-container").removeClass("bh-outRight").addClass("bh-intoRight");

        //当弹框出现时，将页面的滚动条隐藏
        setTimeout(function() {
            $("body").addClass('sc-overflow-hide').getNiceScroll().remove();
        }, getAnimateTime() + 50);
    }

    //给传入的title，content，footer添加标签
    function addTagToOption(options) {
        var $asideContent = null;
        if (options.content) {
            var contentObj = $(options.content)[0];
            if (contentObj && contentObj.localName !== "section") {
                $asideContent = $('<section>' + options.content + '</section>');
            }
        } else {
            var $aside = options.insertContainer;
            if ($aside && $aside[0] && $aside[0].localName === "aside") {
                //当传入要显示的内容的选择器时则使用传入的，不传入则默认使用第一个script标签的
                if (options.selector) {
                    $asideContent = $('<div>' + $aside.find(options.selector).html() + '</div>');
                } else {
                    $asideContent = $('<div>' + $aside.find('script').html() + '</div>');
                }
            }
        }


        if (!options.title) {
            var $asideHeader = $asideContent.children("h3");
            if ($asideHeader.length > 0) {
                options.title = $asideHeader[0].outerHTML;
            }
        } else {
            var $title = $('<h3>' + options.title + '</h3>');
            var $titleChild = $title.children();
            if ($titleChild.length === 0 || $titleChild.length > 1) {
                options.title = $title[0].outerHTML;
            } else if ($titleChild.length === 1 && $titleChild[0].localName !== "h3") {
                options.title = $title[0].outerHTML;
            }
            //if($titleChild.length === 0 || ($titleChild.length === 0 && $title[0] && $title[0].localName !== "h3")){
            //    options.title = '<h3>'+options.title+'</h3>';
            //}
        }

        var $asideSection = $asideContent.children("section");
        if ($asideSection.length > 0) {
            options.content = $asideSection[0].outerHTML;
        }

        if (!options.footer) {
            var $asideFooter = $asideContent.children("footer");
            if ($asideFooter.length > 0) {
                //当footer有内容时使用传入的，有footer标签但是没有内容则使用默认页脚
                if ($asideFooter.children().length > 0) {
                    options.footer = $asideFooter[0].outerHTML;
                } else {
                    options.footer = getDefaultFooterHtml();
                }
            }
        } else {
            if (options.footer === "default") {
                options.footer = getDefaultFooterHtml();
            }
        }

        return options;
    }

    function getDefaultFooterHtml() {
        var _html =
            '<footer>' +
            '<a class="bh-btn bh-btn-primary bh-btn-large" bh-property-dialog-role="okBtn">确定</a>' +
            '<a class="bh-btn bh-btn-default bh-btn-large" bh-property-dialog-role="cancelBtn">取消</a>' +
            '</footer>';
        return _html;
    }

    function getDialogHtml() {
        var _html =
            '<div class="bh-property-dialog" bh-property-dialog-role="bhPropertyDialog">' +
            '<div class="bh-property-dialog-container bh-animated bh-outRight bh-card bh-card-lv2">' +
            '<i class="iconfont icon-close bh-pull-right bh-cursor-point" bh-property-dialog-role="closeIcon"></i>' +
            '<div class="bh-mb-16" bh-property-dialog-role="header">' +
            '@title' +
            '</div>' +
            '<div bh-property-dialog-role="body">' +
            '@content' +
            '</div>' +
            '<div class="bh-property-dialog-footer bh-animated bh-outDown" bh-property-dialog-role="footer">' +
            '@footer' +
            '</div>' +
            '</div>' +
            '<div class="bh-property-dialog-cover bh-animated bh-property-dialog-cover-fadeIn"></div>' +
            '</div>';
        return _html;
    }


    /**
     * 隐藏侧边框
     * @param flag 默认弹框不销毁，"destroy"将弹框销毁
     */
    function dialogHide(options) {
        if (typeof options.close != 'undefined' && options.close instanceof Function) {
            //当关闭回调返回false时，阻止弹框关闭
            var optionFlag = options.close();
            if (typeof optionFlag === "boolean" && !optionFlag) {
                return;
            }
        }
        var $dialog = $("div[bh-property-dialog-role=bhPropertyDialog]");
        if ($dialog.length > 0) {
            $dialog.find("div.bh-property-dialog-container").removeClass("bh-intoRight").addClass("bh-outRight");
            $dialog.find("div.bh-property-dialog-cover").removeClass("bh-property-dialog-cover-fadeIn")
                .addClass("bh-property-dialog-cover-fadeOut");

            setTimeout(function() {
                $dialog.hide();
                $dialog.find("div.bh-property-dialog-footer").hide().removeClass("bh-intoUp").addClass("bh-outDown");
                if (options.destroy || options.autoDestroy) {
                    $dialog.remove();
                }

                setTimeout(function() {
                    $("body").removeClass('sc-overflow-hide').niceScroll({
                        zindex: 99999,
                        horizrailenabled: false
                    });
                }, 50);
            }, getAnimateTime());
        }
    }


    /**
     * 显示侧边框页脚
     * @param insertContainer 弹出框插入的容器
     */
    function dialogFooterHide() {
        $("div[bh-property-dialog-role=bhPropertyDialog]").find("div.bh-property-dialog-footer")
            .removeClass("bh-intoUp").addClass("bh-outDown");
        setDialogBodyHeight();
    }

    /**
     * 隐藏侧边框页脚
     * @param insertContainer 弹出框插入的容器
     */
    function dialogFooterShow() {
        var $dialogFooter = $("div[bh-property-dialog-role=bhPropertyDialog]").find("div.bh-property-dialog-footer");
        $dialogFooter.removeClass("bh-outDown").addClass("bh-intoUp").show();
        setDialogBodyHeight(true);
    }

    /**
     * 给弹框的body设置高度,当内容过多时使其能出滚动条
     * @param isFooterShow 页脚是否有显示
     */
    function setDialogBodyHeight(isFooterShow) {
        var heightStr = '100% - 56px';
        if (isFooterShow) {
            heightStr = '100% - 56px - 52px';
        }
        $("div[bh-property-dialog-role=bhPropertyDialog]").find("[bh-property-dialog-role=body]")
            .attr('style', 'height: -moz-calc(' + heightStr + ');height: -webkit-calc(' + heightStr + ');height: calc(' + heightStr + ');overflow: hidden;');

        setTimeout(function() {
            $("body").addClass('sc-overflow-hide').getNiceScroll().remove();
        }, getAnimateTime() + 50);
    }

    /**
     * 将弹框销毁
     */
    function dialogDestroy() {
        var $dialog = $("div[bh-property-dialog-role=bhPropertyDialog]");
        if ($dialog.length > 0) {
            dialogEventOff($dialog);
            $dialog.remove();
        }
    }

    function dialogEventListen($dialog, data) {
        $dialog.on("click", "i[bh-property-dialog-role=closeIcon]", function() {
            data.close = data.hide;
            $.bhPropertyDialog.hide(data);
        });

        $dialog.on("click", "[bh-property-dialog-role=okBtn]", function() {
            data.close = data.ok;
            $.bhPropertyDialog.hide(data);
        });

        $dialog.on("click", "[bh-property-dialog-role=cancelBtn]", function() {
            data.close = data.cancel;
            $.bhPropertyDialog.hide(data);
        });
    }

    function dialogEventOff($dialog) {
        $dialog.off("click");
    }

    //当没有传入insertContainer，title等字段时，从固定结构中查找元素
    function resetOptionContainer(data) {
        var $body = $("body");
        //当不传入insertContainer时，去查找固定结构并设置
        if (!data.insertContainer) {
            var $paperDialogs = $body.find("[bh-paper-pile-dialog-role=bhPaperPileDialog]");
            if ($paperDialogs.length > 0) {
                //当存在paper弹出框是的处理
                var $insertToDialog = "";
                var insertToDialogIndex = 0;
                var hasOpenDialogs = $body.find("div[bh-paper-pile-dialog-role=bhPaperPileDialog]");
                if (hasOpenDialogs.length > 0) {
                    hasOpenDialogs.each(function() {
                        var $itemDialog = $(this);
                        var dialogIndex = parseInt($itemDialog.attr("bh-paper-pile-dialog-role-index"), 10);
                        if (dialogIndex > insertToDialogIndex) {
                            $insertToDialog = $itemDialog;
                        }
                    });
                }
                if ($insertToDialog.length > 0) {
                    data.insertContainer = $insertToDialog.children().children("aside");
                }
            } else {
                //当没有paper弹出框的处理
                if ($body.children("main").length > 0) {
                    var tempFixedArticle = $body.children("main").children("article");
                    if (tempFixedArticle.length > 0) {
                        var $aside = tempFixedArticle.children("aside");
                        if ($aside.length > 0) {
                            data.insertContainer = $aside;
                        } else {
                            data.insertContainer = $('<aside></aside>');
                            tempFixedArticle.append(data.insertContainer);
                        }
                    }
                }
            }
        }

        return data;
    }

    //设置弹框的位置
    function setDialogPosition($dialog, options) {
        var $window = $(window);
        var windowHeight = $window.height();
        var scrollTop = $window.scrollTop();
        var insertContData = getInsertContainerTop(options.insertContainer);
        var $normalHeader = $('header[bh-header-role="bhHeader"]');
        var normalHeaderHeight = $normalHeader.outerHeight();
        var $miniHeader = $('header[bh-header-role="bhHeaderMini"]');
        var miniHeaderHeight = $miniHeader.outerHeight();
        var isMiniHeaderShow = $normalHeader.hasClass("bh-normalHeader-hide") ? true : false;
        var headerHeight = isMiniHeaderShow ? miniHeaderHeight : normalHeaderHeight;
        var bodyHeight = $('body').get(0).scrollHeight;
        var $footer = $('[bh-footer-role="footer"]');
        var footerTop = $footer.offset().top;
        var footerHeight = $footer.outerHeight();
        var dialogTop = 0;
        var topDiff = 4; //高度偏移量
        var headerDiff = normalHeaderHeight - miniHeaderHeight; //大小头部高度差
        if (scrollTop > insertContData.top) {
            dialogTop = scrollTop - insertContData.top + headerHeight;
        }
        var dialogHeight = insertContData.height;
        //出现小头部的处理
        if (isMiniHeaderShow) {
            //滚动条滚到页脚的处理
            if (windowHeight + scrollTop + footerHeight >= bodyHeight) {
                dialogHeight = bodyHeight - scrollTop - footerHeight - topDiff - headerDiff;
            } else {
                //滚动条没有滚到页脚的处理
                dialogHeight = windowHeight - miniHeaderHeight;
            }
        } else {
            //当页面内容大于屏幕高度的处理
            if (footerTop > windowHeight) {
                dialogHeight = windowHeight - insertContData.top;
            }
        }

        $dialog.css({
            top: dialogTop,
            height: dialogHeight
        });
    }

    //获取弹框插入节点的高度和top值
    function getInsertContainerTop($dom) {
        var height = $dom.outerHeight();
        if (height) {
            return {
                top: $dom.offset().top,
                height: height
            };
        } else {
            return getInsertContainerTop($dom.parent());
        }
    }
})(jQuery);
/**
 * 类似于纵向tab页签
 */
(function ($) {
    /**
     * 定义一个插件
     */
    var Plugin;

    var space = {
        options: null,
        dom: null
    };
    /**
     * 这里是一个自运行的单例模式。
     */
    Plugin = (function () {

        /**
         * 插件实例化部分，初始化时调用的代码可以放这里
         */
        function Plugin(element, setting) {
            //将插件的默认参数及用户定义的参数合并到一个新的obj里
            this.settings = $.extend({}, $.fn.bhStar.defaults, setting);
            space.options = this.settings;
            //将dom jquery对象赋值给插件，方便后续调用
            this.$element = $(element);
            space.dom = this.$element;
            init();
        }
        //获取评分方法
        Plugin.prototype.getScore = function() {
            return space.options.score;
        };
        return Plugin;

    })();

    function init(){
        var html = getStarHtml();
        var $html = $(html);
        space.dom.append($html);

        eventListen($html);
    }

    function getStarHtml(){
        var score = parseInt(space.options.score, 10);
        var starItemStyle = '';
        if(space.options.size){
            starItemStyle = 'font-size: '+space.options.size+'px';
        }
        var starHtml = '<i class="iconfont icon-star" style="'+starItemStyle+'"></i><i class="iconfont icon-staroutline" style="'+starItemStyle+'"></i>';
        var html = '';
        for(var i=0; i<5; i++){
            if(i + 1 <= score){
                html += '<div class="bh-star-item bh-active">'+starHtml+'</div>';
            }else{
                html += '<div class="bh-star-item">'+starHtml+'</div>';
            }
        }

        html = '<div class="bh-star-list '+space.options.starClass+'">'+html+'</div>';

        var scoreNumHtml = '';
        if(space.options.isShowNum){
            scoreNumHtml = '<div class="bh-star-num '+space.options.textClass+'"><span bh-star-role="number">'+score+'</span><span>'+space.options.text+'</span></div>';
        }
        return '<div class="bh-star" bh-star-role="bhStar">'+ html + scoreNumHtml +'</div>';
    }

    function eventListen($starDom){
        //点击星星的处理
        $starDom.on('click', '.bh-star-item', function(){
            var index = $(this).index() + 1;
            space.options.score = index;
            setStar4Hover($starDom, index);
        });
        //鼠标hover到星星的处理
        $starDom.on('mouseover', '.bh-star-item', function(){
            var index = $(this).index() + 1;
            setStar4Hover($starDom, index);
        });
        //鼠标离开星星的处理
        $starDom.on('mouseout','.bh-star-list' ,function(){
            var index = parseInt(space.options.score, 10);
            setStar4Hover($starDom, index);
        });
    }

    /**
     * 设置我的评分
     * @param $dom
     * @param index 选中星级的序号
     */
    function setStar4Hover($dom, index){
        $dom.find('div.bh-star-item').each(function(i){
            if(i < index){
                $(this).addClass('bh-active');
            }else{
                $(this).removeClass('bh-active')
            }
        });
        if(space.options.isShowNum){
            $dom.find('span[bh-star-role="number"]').html(index);
        }
    }

    /**
     * 这里是关键
     * 定义一个插件 plugin
     */
    $.fn.bhStar = function (options, params) {
        var instance;
        instance = this.data('bhStar');
        /**
         * 判断插件是否已经实例化过，如果已经实例化了则直接返回该实例化对象
         */
        if (!instance) {
            return this.each(function () {
                //将实例化后的插件缓存在dom结构里（内存里）
                return $(this).data('bhStar', new Plugin(this, options));
            });
        }
        if (options === true) return instance;
        /**
         * 优雅处： 如果插件的参数是一个字符串，则 调用 插件的 字符串方法。
         * 如 $('#id').plugin('doSomething') 则实际调用的是 $('#id).plugin.doSomething();
         * doSomething是刚才定义的接口。
         * 这种方法 在 juqery ui 的插件里 很常见。
         */
        if ($.type(options) === 'string'){
            return instance[options](params);
        }
        return this;
    };

    /**
     * 插件的默认值
     */
    $.fn.bhStar.defaults = {
        score: 0, //可选，设置初始化分数，默认是0
        size: 0, //可选，设置星的大小，单位按像素计算
        isShowNum: true,//可选，是否显示数字，默认显示
        text: '分',//可选，在分数后面显示的文字，默认是“分”
        textClass: '',//可选，给分数的父层添加样式类
        starClass: '' //可选，给星星的父层添加样式类
    };
})(jQuery);
/**
 * 可折叠面板
 *
 */
(function($) {
    /**
     * 定义一个插件
     */
    var Plugin;

    var g = {};

    /**
     * 这里是一个自运行的单例模式。
     */
    Plugin = (function() {
        /**
         * 插件实例化部分，初始化时调用的代码可以放这里
         */
        function Plugin(element, options) {
            //将插件的默认参数及用户定义的参数合并到一个新的obj里
            this.settings = $.extend({}, $.fn.bhStepWizard.defaults, options);
            //将dom jquery对象赋值给插件，方便后续调用
            this.$element = $(element);
            init(this.settings, this.$element);
        }

        Plugin.prototype.addItem = function(i, item, total) {
            addItem(i, item, total);
        };
        Plugin.prototype.resetActiveItem = function(stepId) {
            resetActiveItem(stepId);
        };
        Plugin.prototype.resetFinishedItems = function(stepIds) {
            g.finishedItemStepIds = stepIds;
            for (var i = 0; i < g.finishedItemStepIds.length; i++) {
                var finishedStepId = g.finishedItemStepIds[i];
                var finishedIndex = getIndexByStepId(finishedStepId);
                refreshElementByIndex(finishedIndex);
            }
        };
        Plugin.prototype.activeNextItem = function() {
            activeNextItem();
        };
        Plugin.prototype.activePrevItem = function() {
            activePrevItem();
        };

        /**
         * 把指定的步骤切成active状态
         * @param stepId
         */
        Plugin.prototype.changeToActive = function(stepId) {
            changeToActive(stepId);
        };
        Plugin.prototype.changeToFinished = function(finishedStepId) {
            if (finishedStepId == undefined || finishedStepId == null) {
                finishedStepId = g.activeItemStepId;
            }
            //1、设置指定的步骤为finished
            if (isExistInFinisheds(finishedStepId)) return;
            addToFinisheds(finishedStepId);
            var finishedIndex = getIndexByStepId(finishedStepId);
            refreshElementByIndex(finishedIndex);
        };

        Plugin.prototype.resetWidth = function() {
            resetItemWidth();
        };

        Plugin.prototype.isLastStep = function() {
            var lastStepId = g.items[g.items.length - 1]["stepId"];
            var result = false;
            if (g.activeItemStepId == lastStepId) {
                result = true;
            } else {
                result = false;
            }
            return result;
        };
        Plugin.prototype.getFinishedIndexs = function() {
            var result = [];
            if (g.finishedItemStepIds && g.finishedItemStepIds.length > 0) {
                for (var i = 0; i < g.finishedItemStepIds.length; i++) {
                    result.push(getIndexByStepId(g.finishedItemStepIds[i]));
                }
            }
            return result;

        };
        Plugin.prototype.getStepIdByIndex = function(index) {
            var result = -1;
            if (g.items && g.items.length > 0 && g.items[index]) {
                result = g.items[index]["stepId"];
            }
            return result;
        };
        Plugin.prototype.deleteItem = function(stepId) {
            resizeWizard(function($item){
                $item.remove();
            });
        };
        Plugin.prototype.showItem = function(stepId) {
            resizeWizard(stepId, function($item){
                $item.show();
            });
        };
        Plugin.prototype.hideItem = function(stepId) {
            resizeWizard(stepId, function($item){
                $item.hide();
            });
        }

        return Plugin;

    })();

    function init(options, dom) {
        g.items = options.items;
        g.activeItemStepId = options.active;
        g.finishedItemStepIds = options.finished;
        g.wizardContainer = dom;
        g.contentContainer = options.contentContainer;
        g.change = options.change;

        $(options.items).each(function(i, item) {
            addItem(i, item, options.items.length);
        });

        g.wizardElement = $(g.wizardContainer).children(".bh-wizard-item");

        $(options.items).each(function(i, item) {
            refreshElementByIndex(i);
        });

        if (options.isAddClickEvent) {
            //绑定点击事件
            addClickEvent();
        }

        resetItemWidth();

        g.wizardElement.each(function(index, m) {
            if (g.wizardElement && g.wizardElement.length > 0) {
                if ($(m).hasClass("active")) {
                    //打开对应的step的信息区域
                    $("#" + $(m).attr("stepid")).removeClass("bh-hide");
                } else {
                    $("#" + $(m).attr("stepid")).addClass("bh-hide");
                }

            }
        });

    }

    function resetItemWidth(){
        var itemLen = g.wizardElement.length;
        if(itemLen > 0){
            var $wizardContainer = g.wizardContainer;
            var sumWidth = $wizardContainer.width();
            var hiddenCount = $(".bh-wizard-item:hidden", $wizardContainer).length;
            var count = itemLen - hiddenCount;
            var itemWidth = Math.floor(sumWidth / count);
            //40是左右两个箭头的宽度
            g.wizardElement.find('.title').width(itemWidth - 40);
        }
    }

    function resetActiveItem(stepId) {
        g.activeItemStepId = stepId;
    }

    function activePrevItem() {
        //重置上一个激活项的样式
        var prevActiveItemIndex = getActiveItemIndex();
        var stepId = getPrevVisiableStepId(prevActiveItemIndex);
        if(stepId != null){
            changeToActive(stepId);
        }
    }

    /**
     * 获取上一个显示的步骤ID
     */
    function getPrevVisiableStepId(_index) {
        var result = null;
        var newActiveItemIndex = _index - 1;
        if (g.items[newActiveItemIndex] != null) {
            var stepId = g.items[newActiveItemIndex]["stepId"];
            if(g.wizardElement.parent().find("[stepid='"+stepId+"']").is(":hidden")){
                result = getPrevVisiableStepId(newActiveItemIndex);

            }else{
                result = stepId;
            }
        }
        return result;
    }
    /**
     * 获取上一个显示的步骤ID
     */
    function getNextVisiableStepId(_index) {
        var result = null;
        var newActiveItemIndex = _index + 1;
        if (g.items[newActiveItemIndex] != null) {
            var stepId = g.items[newActiveItemIndex]["stepId"];
            if(g.wizardElement.parent().find("[stepid='"+stepId+"']").is(":hidden")){
                result = getNextVisiableStepId(newActiveItemIndex);
            }else{
                result = stepId;
            }
        }
        return result;
    }

    function activeNextItem() {
        //重置上一个激活项的样式
        var prevActiveItemIndex = getActiveItemIndex();
        var stepId = getNextVisiableStepId(prevActiveItemIndex);
        if(stepId != null){
            changeToActive(stepId);
        }
    }

    function changeToActive(stepId) {
        //1、取消上一个步骤处于激活状态
        var prevActiveItemStepId = g.activeItemStepId;
        var prevActiveItemIndex = getActiveItemIndex();

        resetActiveItem(stepId);

        refreshElementByIndex(prevActiveItemIndex);
        g.contentContainer.find("#" + prevActiveItemStepId).addClass("bh-hide");

        //2、设置指定的步骤的项为激活状态
        var newActiveItemIndex = getActiveItemIndex();
        refreshElementByIndex(newActiveItemIndex);
        g.contentContainer.find("#" + g.activeItemStepId).removeClass("bh-hide");

        if (typeof g.change != 'undefined' && g.change instanceof Function) {
            g.change({ "stepId": stepId });
        }
    }

    function addItem(i, item, total) {
        var newItem = $('<div class="bh-wizard-item" stepid="' + item.stepId + '">' +
            '<div class="left-arrow"></div>' +
            '<div class="title bh-str-cut" title="' + item.title + '"><i></i>' + item.title + '</div>' +
            '<div class="right-arrow"></div>' +
            '</div>');
        if (i == 0) {
            $(newItem).addClass("bh-wizard-item-first");
        } else if (i == (total - 1)) {
            $(newItem).addClass("bh-wizard-item-last");
        }
        g.wizardContainer.append(newItem);
    }
    /**
     * 判断步骤项是否在已完成列表中
     * @param stepId
     * @returns {boolean}
     */
    function isExistInFinisheds(stepId) {
        var isExist = false;
        for (var i = 0; i < g.finishedItemStepIds.length; i++) {
            if (g.finishedItemStepIds[i] == stepId) {
                isExist = true;
                break;
            }
        }
        return isExist;
    }

    function addToFinisheds(finishedStepId) {
        if (g.finishedItemStepIds) {
            var maxLen = g.finishedItemStepIds.length;
            if (maxLen > 0) {
                g.finishedItemStepIds[maxLen] = finishedStepId;
            } else {
                g.finishedItemStepIds[0] = finishedStepId;
            }
        }
    }

    function isActive(index) {
        var activeIndex = getIndexByStepId(g.activeItemStepId);
        if (activeIndex == index) {
            return true;
        }
        return false;
    }

    function isFinished(index) {
        var finishedCount = g.finishedItemStepIds.length;
        var result = false;
        if (finishedCount > 0) {
            for (var i = 0; i < finishedCount; i++) {
                if (index == getIndexByStepId(g.finishedItemStepIds[i])) {
                    result = true;
                    break;
                }
            }
        }
        return result;
    }

    function refreshElementByIndex(index) {
        var targetElement = g.wizardElement[index];
        var icon = $("i", $(targetElement));
        icon.removeClass();
        if (isFinished(index)) {
            $(targetElement).addClass("finished");
            icon.addClass("iconfont icon-checkcircle");
        } else {
            $(targetElement).removeClass("finished");
        }
        if (isActive(index)) {
            $(targetElement).addClass("active");
            icon.addClass("iconfont icon-edit");
        } else {
            $(targetElement).removeClass("active");
        }
    }

    function isActiveItem(stepId) {
        if (stepId == g.activeItemStepId) {
            return true;
        } else {
            return false;
        }
    }

    function addClickEvent() {
        g.wizardElement.unbind("click").click(function() {
            var thisElement = $(this);
            var stepId = thisElement.attr("stepid");
            if (isActiveItem(stepId)) return;
            changeToActive(stepId);
        })
    }

    function getIndexByStepId(stepId) {
        var index = -1;
        for (var i = 0; i < g.items.length; i++) {
            if (g.items[i]["stepId"] == stepId) {
                index = i;
                break;
            }
        }
        return index;
    }

    function getActiveItemIndex() {
        var index = 0;
        for (var i = 0; i < g.items.length; i++) {
            if (g.items[i]["stepId"] == g.activeItemStepId) {
                index = i;
                break;
            }
        }
        return index;
    }

    function resizeWizard(stepId, callback) {
        if (stepId == null || stepId == undefined) return;
        var firstStepId = g.items[0]["stepId"];
        var lastStepId = g.items[g.items.length - 1]["stepId"];

        var $item = g.wizardContainer.find(".bh-wizard-item[stepid=" + stepId + "]");
        if ($item.length > 0) {
            callback($item);
        }
        g.wizardElement = $(g.wizardContainer).children(".bh-wizard-item");
        if (stepId == firstStepId) {
            g.wizardElement.eq(0).addClass("bh-wizard-item-first")
        } else if (stepId == lastStepId) {
            g.wizardElement.last().addClass("bh-wizard-item-last");
        }

        resetItemWidth();
    }
    /**
     * 这里是关键
     * 定义一个插件 plugin
     */
    $.fn.bhStepWizard = function(options, params) {
        var instance;
        instance = this.data('bhStepWizard');
        /**
         * 判断插件是否已经实例化过，如果已经实例化了则直接返回该实例化对象
         */
        if (!instance) {
            return this.each(function() {
                //将实例化后的插件缓存在dom结构里（内存里）
                return $(this).data('bhStepWizard', new Plugin(this, options));
            });
        }
        if (options === true) return instance;
        /**
         * 优雅处： 如果插件的参数是一个字符串，则 调用 插件的 字符串方法。
         * 如 $('#id').plugin('doSomething') 则实际调用的是 $('#id).plugin.doSomething();
         * doSomething是刚才定义的接口。
         * 这种方法 在 juqery ui 的插件里 很常见。
         */
        if ($.type(options) === 'string') {
            var result = instance[options](params);
            return result;
        }
        //return this;
    };

    /**
     * 插件的默认值
     */
    $.fn.bhStepWizard.defaults = {
        items: [], //步骤参数集合 title,stepId,active,finished
        active: '', //当前激活项的stepId
        finished: [], //当前已完成项的stepId数组
        isAddClickEvent: true, //步骤条是否可点
        contentContainer: $("body"), //正文的容器选择器
        change: null
    };
})(jQuery);

(function ($) {
    'use strict';

    /**
     * 定义一个插件
     */
    var Plugin;

    /**
     * 这里是一个自运行的单例模式。
     */
    Plugin = (function () {

        /**
         * 插件实例化部分，初始化时调用的代码可以放这里
         */
        function Plugin(element, options) {
            //将插件的默认参数及用户定义的参数合并到一个新的obj里
            this.settings = $.extend({}, $.fn.bhTimePicker.defaults, options);
            this.settings.format = this.settings.format.replace(/mm/g, 'MM');
            //将dom jquery对象赋值给插件，方便后续调用
            this.$rootElement = $(element);
            init(this);
        }

        //外部获取时间数据
        Plugin.prototype.getValue = function() {
            var startTime = null;
            var endTime = null;
            if(!this.startTimeDom.jqxDateTimeInput('disabled')){
                startTime = this.startTimeDom.jqxDateTimeInput('getText');
            }
            if(!this.endTimeDom.jqxDateTimeInput('disabled')){
                endTime = this.endTimeDom.jqxDateTimeInput('getText');
            }
            return {startTime: startTime, endTime: endTime};
        };

        //外部设置时间数据
        Plugin.prototype.setValue = function(data) {
            var startTime = data.startTime ? timeStrToDate(data.startTime) : this.startTimeDom.jqxDateTimeInput('getDate');
            var endTime = data.endTime ? timeStrToDate(data.endTime) : this.endTimeDom.jqxDateTimeInput('getDate');
            setInputDateTime(this, startTime, endTime);
        };

        //外部设置组件禁用
        Plugin.prototype.setDisable = function() {
            this.$rootElement.children('div[bh-time-picker-role="rangeBox"]').append('<div class="bh-timePick-disable" bh-time-picker-role="disableBlock"></div>');
        };
        //外部设置组件启用
        Plugin.prototype.setEnable = function() {
            this.$rootElement.find('div[bh-time-picker-role="disableBlock"]').remove();
        };

        return Plugin;

    })();

    function init(options){
        var nowDate = new Date();
        //时间选择框html
        var rangeBoxHtml = drawRangeBox(options, nowDate);
        var $rangeBox = $(rangeBoxHtml);
        options.rangeBoxDom = $rangeBox;
        options.$rootElement.html($rangeBox);

        //时间选择框添加事件监听
        rangeBoxEventListen($rangeBox, options);

        //画弹框
        var selectBoxHtml = drawSelectBox(options, nowDate);
        var $selectBox = $(selectBoxHtml);
        options.popupBoxDom = $selectBox;
        var $body = $('body');
        $body.append($selectBox);
        //$selectBox.children('div[bh-time-picker-role="selectBoxTab"]').jqxTabs({ position: 'top'});
        //弹框的jqx组件初始化
        selectBoxJqxInit(options, nowDate);
        //弹框事件监听
        selectBoxEventListen(options);

        //点击body时，将弹出框隐藏
        $body.on('click', function(e){
            var $targetObj = $(e.target || e.srcElement);
            if($targetObj.closest('div[bh-time-picker-role="rangeBox"]').length > 0
                || $targetObj.closest('div[bh-time-picker-role="selectBoxCont"]').length > 0
                || $targetObj.closest('div.jqx-calendar').length > 0
                || $targetObj.closest('div.jqx-listbox').length > 0){
                //清除自己选择时间的标志
                $body.removeData('bhTimePick');
                return;
            }
            //var $rangeBox = $('div[bh-time-picker-role="rangeBox"]');
            var $rangeBox = options.rangeBoxDom;
            if($rangeBox.hasClass('bh-active')){
                //用于处理body被重复点击造成弹框被隐藏的问题
                if($body.data('bhTimePick')){
                    $body.removeData('bhTimePick');
                    return;
                }
                $rangeBox.find('div[bh-time-picker-role="rangeBoxSelectTime"]').click();
            }
        });
    }

    /**
     * 时间选择框
     * @param options
     * @param nowDate 当前时间对象
     * @returns {string}
     */
    function drawRangeBox(options, nowDate){
        var startTime, endTime;
        if(!options.settings.time.start || options.settings.time.start === 'today'){
            startTime = nowDate;
        }else{
            startTime = timeStrToDate(options.settings.time.start);
        }
        if(!options.settings.time.end || options.settings.time.end === 'today'){
            endTime = nowDate;
        }else{
            endTime = timeStrToDate(options.settings.time.end);
        }
        //拼接时间
        var timeStr = startTime.getFullYear() + '年' + numberLessThan10AddPre0(startTime.getMonth()+1) + '月'+ numberLessThan10AddPre0(startTime.getDate()) +'日' +
            '-' +
            endTime.getFullYear() + '年' + numberLessThan10AddPre0(endTime.getMonth()+1) + '月' + numberLessThan10AddPre0(endTime.getDate()) + '日';

        var _style = '';
        if(options.settings.width){
            _style = 'width: '+parseInt(options.settings.width,10)+'px;';
        }

        var disableHtml = '';
        if(options.settings.isDisable){
            disableHtml = '<div class="bh-timePick-disable" bh-time-picker-role="disableBlock"></div>';
        }

        var html =
            '<div class="bh-timePicker-rangeBox bh-clearfix" bh-time-picker-role="rangeBox" style="'+_style+'">' +
                '<div class="bh-timePicker-rangeBox-selectIcon bh-left" bh-time-picker-role="rangeBoxPre">&lt;</div>'+
                '<div class="bh-timePicker-rangeBox-time" bh-time-picker-role="rangeBoxSelectTime">'+timeStr+'</div>'+
                '<div class="bh-timePicker-rangeBox-selectIcon bh-right" bh-time-picker-role="rangeBoxNext">&gt;</div>'+
                disableHtml +
            '</div>' +
            '<div class="bh-clearfix"></div>';

        return html;
    }

    /**
     * 画弹出框
     * @param options
     * @param nowDate 当前时间对象
     * @returns {string}
     */
    function drawSelectBox(options, nowDate){
        //按月选择的月份html
        var monthHtml = getSelectMonthHtml(options, nowDate);
        /**
         * 设置按月选择的年份，
         * 当设置了最大选择范围，若最大的选择范围大于今年，则选用今年
         * 若小于今年，则使用最大范围的这一年
         * @type {number}
         */
        var year = 0;
        var nowYear = nowDate.getFullYear();
        if(!options.settings.range.max || options.settings.range.max === 'today'){
            year = nowYear;
        }else{
            year = timeStrToDate(options.settings.range.max).getFullYear();
            if(year > nowYear){
                year = nowYear;
            }
        }
        var html =
                '<div class="bh-timePick-selectBoxCont" bh-time-picker-role="selectBoxCont">' +
                    '<div class="bh-timePick-selectBox bh-card bh-card-lv2" bh-time-picker-role="selectBox">' +
                        '<ul class="bh-timePick-tab" bh-time-picker-role="selectTab">' +
                            '<li class="bh-timePick-tabItem bh-active">自定义选择</li>' +
                            '<li class="bh-timePick-tabItem">按月选择</li>' +
                        '</ul>' +
                        '<div class="bh-timePick-tabContent" bh-time-picker-role="selectTabContent">' +
                            '<div class="bh-timePick-custom bh-active">' +
                                '<div class="bh-timePick-customTime bh-clearfix" bh-time-picker-role="selectCustom">' +
                                    '<div class="bh-timePick-selectType" bh-time-picker-role="selectType"></div>' +
                                    '<div class="bh-timePick-selectStart" bh-time-picker-role="selectStart"></div>' +
                                    '<div class="bh-timePick-selectConnect"></div>' +
                                    '<div class="bh-timePick-selectEnd" bh-time-picker-role="selectEnd"></div>' +
                                '</div>' +
                                '<a class="bh-btn bh-btn-primary bh-btn-block" bh-time-picker-role="selectOk" href="javascript:void(0);">确定</a>' +
                            '</div>' +
                            '<div class="bh-timePick-selectMonthCont" bh-time-picker-role="selectMonthBlock">' +
                                '<div class="bh-timePick-selectMonth bh-timePicker-rangeBox bh-clearfix">' +
                                    '<div class="bh-timePicker-rangeBox-selectIcon bh-left" bh-time-picker-role="selectMonthPre">&lt;</div>'+
                                    '<div class="bh-timePicker-rangeBox-time" bh-time-picker-role="selectMonthYear">'+year+'年</div>'+
                                    '<div class="bh-timePicker-rangeBox-selectIcon bh-right" bh-time-picker-role="selectMonthNext">&gt;</div>'+
                                '</div>' +
                                '<div class="bh-timePicker-selectMonthList bh-clearfix" bh-time-picker-role="selectMonthList">' +
                                    monthHtml +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>';

        return html;
    }

    /**
     * 按月选择的月份html
     * @param options
     * @param nowDate 当前时间对象
     * @param type 选择上一年或下一年
     * @returns {string}
     */
    function getSelectMonthHtml(options, nowDate, type){
        var html = '';
        var nowYear = nowDate.getFullYear();
        var maxYear = 0;
        var maxMonth = 0;
        var minYear = 0;
        var minMonth = 0;
        if(options.settings.range.max){
            if(options.settings.range.max !== 'today'){
                var maxObj = timeStrToDate(options.settings.range.max);
                maxYear = maxObj.getFullYear();
                maxMonth = maxObj.getMonth();
            }else{
                maxYear = nowDate.getFullYear();
                maxMonth = nowDate.getMonth();
            }
        }

        if(options.settings.range.min){
            if(options.settings.range.min !== 'today'){
                var minObj = timeStrToDate(options.settings.range.min);
                minYear = minObj.getFullYear();
                minMonth = minObj.getMonth();
            }else{
                minYear = nowDate.getFullYear();
                minMonth = nowDate.getMonth();
            }
        }

        for(var i=0; i<12; i++){
            var month = i + 1;
            var typeClass = '';
            //当没有设置最大范围，则设置所有月份可点击
            if(maxYear && minYear){
                if(minYear !== maxYear){
                    if(minYear < nowYear && nowYear < maxYear){
                        typeClass = 'bh-pre';
                    }else if(minYear === nowYear){
                        if(i >= minMonth){
                            typeClass = 'bh-pre';
                        }
                    }else if(nowYear === maxYear){
                        if(i <= maxMonth){
                            typeClass = 'bh-pre';
                        }
                    }
                }else{
                    if(minMonth <= i && i <= maxMonth){
                        typeClass = 'bh-pre';
                    }
                }
            }else if(maxYear){
                /**
                 * 当设置了最大范围
                 * 若最大范围大于今年，则所有月份可点
                 * 若最大范围小于或等于今年，则大于最大范围的月份不可点
                 */
                if(maxYear > nowYear){
                    typeClass = 'bh-pre';
                }else{
                    if(i <= maxMonth){
                        typeClass = 'bh-pre';
                    }
                }
            }else if(minYear){
                if(minYear < nowYear){
                    typeClass = 'bh-pre';
                }else{
                    if(i >= minMonth){
                        typeClass = 'bh-pre';
                    }
                }
            }else{
                typeClass = 'bh-pre';
            }

            html += '<div class="bh-timePick-monthItem '+typeClass+'" data-month="'+month+'" bh-time-picker-role="selectMonthItem">'+month+'月</div>';
        }
        return html;
    }

    /**
     * 范围显示框的事件监听
     * @param $rangeBox
     */
    function rangeBoxEventListen($rangeBox, options){
        $rangeBox.on('click', function(e){
            options.$rootElement.removeData('selectType');
            var $targetObj = $(e.target || e.srcElement);
            var role = $targetObj.attr('bh-time-picker-role');
            switch (role){
                //上一个区域
                case 'rangeBoxPre':
                    selectRangeBox('pre', options);
                    break;
                //下一个区域
                case 'rangeBoxNext':
                    selectRangeBox('next', options);
                    break;
                //选择时间
                case 'rangeBoxSelectTime':
                    showTimePickerBox(options, $rangeBox);
                    break;
            }
        })
    }

    /**
     * 显示弹框
     * @param $rangeBox
     */
    function showTimePickerBox(options, $rangeBox){
        var $selectBoxCont = options.popupBoxDom;
        var $selectBox = $selectBoxCont.children('div[bh-time-picker-role="selectBox"]');
        if($rangeBox.hasClass('bh-active')){
            timePickerBoxToHide(options);
        }else{
            //获取当前显示框的位置
            var rangeBoxPosition = BH_UTILS.getElementPosition($rangeBox);
            //设置弹框的位置
            var defaultZindex = 9999;
            var boxCss = {"top": rangeBoxPosition.bottom, "left": rangeBoxPosition.left + 20, "display": "block"};
            var jqxWindowZindex = 0;
            $('body').find('.jqx-window').each(function(){
                var itemZindex = parseInt($(this).css('z-index'), 10);
                if(itemZindex > jqxWindowZindex){
                    jqxWindowZindex = itemZindex;
                }
            });
            if(jqxWindowZindex > defaultZindex){
                boxCss['z-index'] = jqxWindowZindex;
            }
            $selectBoxCont.css(boxCss);
            $rangeBox.addClass('bh-active');
            setTimeout(function(){
                $selectBox.addClass('bh-active');
            },10);
        }
    }

    function timePickerBoxToHide(options){
        var $selectBoxCont = options.popupBoxDom;
        var $selectBox = $selectBoxCont.children('div[bh-time-picker-role="selectBox"]');
        $selectBox.find('div[bh-time-picker-role="rangeBoxSelectTime"]').click();
        $selectBox.removeClass('bh-active');
        setTimeout(function(){
            $selectBoxCont.hide();
        }, 450);
        options.rangeBoxDom.removeClass('bh-active');
    }

    /**
     * 弹框的事件监听
     * @param $selectBox
     * @param options
     */
    function selectBoxEventListen(options){
        //tab切换
        options.popupBoxDom.on('click', '.bh-timePick-tabItem', function(){
            var $li = $(this);
            if(!$li.hasClass('bh-active')){
                var liIndex = $li.index();
                var $ul = $li.closest('ul');
                $ul.find('li').removeClass('bh-active');
                $li.addClass('bh-active');

                var $tabContents = options.popupBoxDom.children('div[bh-time-picker-role="selectBox"]').children('div[bh-time-picker-role="selectTabContent"]').children();
                $tabContents.removeClass('bh-active');
                $tabContents.eq(liIndex).addClass('bh-active');
            }
        });

        var $selectCustom = options.popupBoxDom.find('div[bh-time-picker-role="selectCustom"]');
        var $selectStart = $selectCustom.children('div[bh-time-picker-role="selectStart"]');
        var $selectEnd = $selectCustom.children('div[bh-time-picker-role="selectEnd"]');
        var $selectType = $selectCustom.find('div[bh-time-picker-role="selectType"]');
        //开始时间变化事件
        $selectStart.on('change', function (event){
            //判断是否要切换选择类型为自定义
            changeFixedSelectType(options, $selectCustom);
            //验证开始时间是否大于结束时间
            checkTimeOrder($selectCustom, 'start', options);
        });
        //结束事件变化事件
        $selectEnd.on('change', function (event){
            changeFixedSelectType(options, $selectCustom);
            checkTimeOrder($selectCustom, 'end', options);
        });

        //鼠标滑过时间组件时，清除选择类型的状态
        $selectStart.on('mouseover', function (event){
            options.$rootElement.removeData('selectType');
        });
        //鼠标滑过时间组件时，清除选择类型的状态
        $selectEnd.on('mouseover', function (event){
            options.$rootElement.removeData('selectType');
        });

        $selectType.on('change', function (event){
            var args = event.args;
            if (args) {
                var value = args.item.value;
                //添加选择类型状态，用于自己选择时间或按月选择时，将状态类型换成自定义
                options.$rootElement.data('selectType', 'fixed');
                setSelectTime({
                    value: value
                },options);
            }
        });

        //点击确定按钮
        options.popupBoxDom.on('click', '[bh-time-picker-role="selectOk"]', function(){
            //获取时间
            var startTime = $selectStart.jqxDateTimeInput('getDate');
            var endTime = $selectEnd.jqxDateTimeInput('getDate');
            var timeObj = options.getValue();
            var startTimeStr = timeObj.startTime;
            var endTimeStr = timeObj.endTime;
            //设置选择好的时间范围
            resetRangeBoxTime(options, startTime, endTime);
            //隐藏弹框
            timePickerBoxToHide(options);

            //事件回调
            options.$rootElement.trigger("selectedTime", [startTimeStr, endTimeStr]);
            if(typeof options.settings.selectedTime !='undefined' && options.settings.selectedTime instanceof Function){
                options.settings.selectedTime(startTimeStr, endTimeStr);
            }
        });

        //按月选择上一年
        options.popupBoxDom.on('click', '[bh-time-picker-role="selectMonthPre"]', function(){
            changeSelectMonthOfYear($(this).closest('div[bh-time-picker-role="selectMonthBlock"]'), 'pre', options);
        });
        //按月选择下一年
        options.popupBoxDom.on('click', '[bh-time-picker-role="selectMonthNext"]', function(){
            changeSelectMonthOfYear($(this).closest('div[bh-time-picker-role="selectMonthBlock"]'), 'next', options);
        });
        //按月选择选取了某一个月份
        options.popupBoxDom.on('click', '[bh-time-picker-role="selectMonthItem"]', function(){
            changeSelectMonth($(this), options);
        });
    }

    //初始化时间和下拉框组件
    function selectBoxJqxInit(options, nowDate){
        var $selectCustom = options.popupBoxDom.find('div[bh-time-picker-role="selectCustom"]');
        var $selectType = $selectCustom.find('div[bh-time-picker-role="selectType"]');
        var $selectStart = $selectCustom.find('div[bh-time-picker-role="selectStart"]');
        var $selectEnd = $selectCustom.find('div[bh-time-picker-role="selectEnd"]');
        options.startTimeDom = $selectStart;
        options.endTimeDom = $selectEnd;
        initSelectType($selectType, options);
        initSelectTime($selectStart, nowDate, 'start', options);
        initSelectTime($selectEnd, nowDate, 'end', options);
        setSelectTime({value: options.settings.defaultType}, options);
    }

    //初始化下拉框组件
    function initSelectType($selectType, options){
        var source = [
            {name: '自定义',value: 'custom'},
            {name: '全部',value: 'all'},
            {name: '本周',value: 'currentWeek'},
            {name: '上周',value: 'lastWeek'},
            {name: '本月',value: 'currentMonth'},
            {name: '上月',value: 'lastMonth'},
            {name: '本季度',value: 'currentQuarter'},
            {name: '上季度',value: 'lastQuarter'},
            {name: '今年',value: 'currentYear'},
            {name: '去年',value: 'lastYear'},
            {name: '近7天',value: 'last7Day'},
            {name: '近30天',value: 'last30Day'}
        ];
        var selectedIndex = 0;
        $.grep(source,function(item,i){
            if(options.settings.defaultType === item.value){
                selectedIndex = i;
                return true;
            }
        });
        $selectType.jqxDropDownList({width: '80px', source: source, selectedIndex: selectedIndex, autoDropDownHeight: true,valueMember: 'value', displayMember: 'name'});
    }

    //初始化时间组件
    function initSelectTime($timeDom, nowDate, type, options){
        var setValue;
        if(type === 'start'){
            //设置开始时间, 若未设置开始时间或时间是今天，则使用当前时间，否则用传入的时间
            if(!options.settings.time.start || options.settings.time.start === 'today'){
                setValue = nowDate;
            }else{
                setValue = timeStrToDate(options.settings.time.start);
            }
        }else{
            //设置结束时间
            if(!options.settings.time.end || options.settings.time.end === 'today'){
                setValue = nowDate;
            }else{
                setValue = timeStrToDate(options.settings.time.end);
            }
        }
        $timeDom.jqxDateTimeInput({value: setValue, width: '124px', culture: 'zh-CN', formatString: options.settings.format});
    }

    /**
     * 按类型选择时间的处理
     * @param data {type    index}
     */
    function setSelectTime(data, options){
        //24小时 * 60分 * 60秒 * 1000毫秒
        var oneDayTime = 24 * 60 * 60 * 1000;
        var nowDate = new Date();
        var nowDateObj = getDateObj(nowDate);
        var startTime = 0;
        var endTime = 0;
        var value = data.value;
        switch (value){
            //自定义 用于激活时间输入框
            case 'custom':
            break;
            //全部
            case 'all':
                startTime = null;
                endTime = null;
                break;
            //本周
            case 'currentWeek':
                //定位到星期一 = 当前时间戳 - （当前星期 - 1天）* 一天的毫秒数
                startTime = new Date(nowDateObj.time - (nowDateObj.week - 1) * oneDayTime);
                endTime = nowDate;
                break;
            //上周
            case 'lastWeek':
                //定位到这周的星期一
                var currentMondayTime = nowDateObj.time - (nowDateObj.week - 1) * oneDayTime;
                //再定位到上周一 = 本周一 减 7天的时间
                startTime = new Date(currentMondayTime - 7 * oneDayTime);
                //定位到上周末 = 本周一 减 1天的时间
                endTime = new Date(currentMondayTime - 1 * oneDayTime);
                break;
            //本月
            case 'currentMonth':
                //定位到本月1号 = 当前时间戳 - （当前日期 - 1天）* 一天的毫秒数
                startTime = new Date(nowDateObj.time - (nowDateObj.day - 1) * oneDayTime);
                endTime = nowDate;
                break;
            //上月
            case 'lastMonth':
                var preMonthData = getPreMonthData(nowDateObj);
                startTime = preMonthData.startTime;
                endTime = preMonthData.endTime;
                break;
            //本季度
            case 'currentQuarter':
                var currentQuarterData = getCurrentQuarterData(nowDateObj);
                startTime = currentQuarterData.startTime;
                endTime = nowDate;
                break;
            //上季度
            case 'lastQuarter':
                var preQuarterData = getPreQuarterData(nowDateObj);
                startTime = preQuarterData.startTime;
                endTime = preQuarterData.endTime;
                break;
            //今年
            case 'currentYear':
                startTime = timeStrToDate(nowDateObj.year+'/'+'1/1');
                endTime = nowDate;
                break;
            //去年
            case 'lastYear':
                startTime = timeStrToDate(parseInt(nowDateObj.year - 1)+'/'+'1/1');
                endTime = timeStrToDate(parseInt(nowDateObj.year - 1)+'/'+'12/31');
                break;
            //近7天
            case 'last7Day':
                startTime = new Date(nowDateObj.time - 7 * oneDayTime);
                endTime = nowDate;
                break;
            //近30天
            case 'last30Day':
                startTime = new Date(nowDateObj.time - 30 * oneDayTime);
                endTime = nowDate;
                break;
        }
        //设置开始和结束时间
        setInputDateTime(options, startTime, endTime);
    }

    /**
     * 设置开始和结束时间
     * 时间类型可能是对象，也可能是时间戳
     * @param startTime
     * @param endTime
     * @param isCallback 是否要执行回调
     */
    function setInputDateTime(options, startTime, endTime, isCallback){
        var $selectCustom = options.popupBoxDom.find('div[bh-time-picker-role="selectCustom"]');
        var $startTime = $selectCustom.children('div[bh-time-picker-role="selectStart"]');
        var $endTime = $selectCustom.children('div[bh-time-picker-role="selectEnd"]');
        var currentEndTime = $endTime.jqxDateTimeInput('getDate');
        if(!startTime || !endTime){
            if(startTime === null){
                $startTime.jqxDateTimeInput({disabled: true});
            }else{
                $startTime.jqxDateTimeInput({disabled: false});
            }
            if(endTime === null){
                $endTime.jqxDateTimeInput({disabled: true});
            }else{
                $endTime.jqxDateTimeInput({disabled: false});
            }
            if(!startTime && !endTime){
                return;
            }
        }
        if($startTime.jqxDateTimeInput('disabled')){
            $startTime.jqxDateTimeInput({disabled: false});
        }
        if($endTime.jqxDateTimeInput('disabled')){
            $endTime.jqxDateTimeInput({disabled: false});
        }
        //这个判断是为了避免校验开始时间大于结束时间导致的时间重置
        if(startTime > currentEndTime){
            $endTime.jqxDateTimeInput('setDate', endTime);
            $startTime.jqxDateTimeInput('setDate', startTime);
        }else{
            $startTime.jqxDateTimeInput('setDate', startTime);
            $endTime.jqxDateTimeInput('setDate', endTime);
        }

        var startTimeObj = $startTime.jqxDateTimeInput('getDate');
        var endTimeObj = $endTime.jqxDateTimeInput('getDate');
        var timeObj = options.getValue();
        var startTimeStr = timeObj.startTime;
        var endTimeStr = timeObj.endTime;
        resetRangeBoxTime(options, startTimeObj, endTimeObj);
        if(isCallback){
            //事件回调
            options.$rootElement.trigger("selectedTime", [startTimeStr, endTimeStr]);
            if(typeof options.settings.selectedTime !='undefined' && options.settings.selectedTime instanceof Function){
                options.settings.selectedTime(startTimeStr, endTimeStr);
            }
        }
    }

    //把日期分割成对象
    function getDateObj(time){
        var myDate = new Date(time);
        var dateObj = {};
        dateObj.year = myDate.getFullYear();
        dateObj.month = myDate.getMonth();
        dateObj.day = myDate.getDate();
        dateObj.hour = myDate.getHours();
        dateObj.minute = myDate.getMinutes();
        dateObj.second = myDate.getSeconds();
        dateObj.week = myDate.getDay();
        dateObj.time = myDate.getTime();
        return dateObj;
    }

    //判断是否闰年
    function isLeapYear(year){
        return (0 == year % 4 && ((year % 100 != 0) || (year % 400 == 0)));
    }

    //获取上个月的数据
    function getPreMonthData(nowDateObj){
        //月份是从0开始的
        var currentMonth = nowDateObj.month;
        var year = nowDateObj.year;
        var month = currentMonth - 1;
        if(currentMonth === 0){
            year = year - 1;
            month = 11;
        }
        var preMonthDays = getOneMonthDays(year, month + 1);
        var startTime = new Date(changeTimeObjToStr({year: year, month: month+1, day: 1}));
        var endTime = new Date(changeTimeObjToStr({year: year, month: month+1, day: preMonthDays}));
        return {startTime: startTime, endTime: endTime};
    }

    //把时间对象转换成字符串
    function changeTimeObjToStr(timeObj){
        return timeObj.year+'/'+timeObj.month+'/'+timeObj.day;
    }

    //获取该月份的天数
    function getOneMonthDays(year, month){
        var days = 0;
        if(month === 1 || month === 3 || month === 5 || month === 7 || month === 8 || month === 10 || month === 12){
            days = 31;
        }else if(month === 4 || month === 6 || month === 9 || month === 11){
            days = 30;
        }else{
            if(isLeapYear(year)){
                days = 29;
            }else{
                days = 28;
            }
        }
        return days;
    }

    //获取该季度的时间对象
    function getCurrentQuarterData(nowDateObj){
        var monthData = getStartAndEndMonthOfQuarter(nowDateObj.month);
        var startTime = new Date(changeTimeObjToStr({year: nowDateObj.year, month: monthData.startMonth+1, day: 1}));
        return {startTime: startTime};
    }

    //获取上个季度的时间对象
    function getPreQuarterData(nowDateObj){
        var nowQuarterStartMonth = getStartAndEndMonthOfQuarter(nowDateObj.month).startMonth;
        var preQuarterMonth = nowQuarterStartMonth - 1;
        var year = nowDateObj.year;
        if(nowQuarterStartMonth === 0){
            preQuarterMonth = 11;
            year = year - 1;
        }
        var preQuarterData = getStartAndEndMonthOfQuarter(preQuarterMonth);
        var endTimeDay = getOneMonthDays(year, preQuarterData.endMonth + 1);
        var startTime = new Date(changeTimeObjToStr({year: year, month: preQuarterData.startMonth+1, day: 1}));
        var endTime = new Date(changeTimeObjToStr({year: year, month: preQuarterData.endMonth+1, day: endTimeDay}));;
        return {startTime: startTime, endTime: endTime};
    }

    //根据月份得到该月所在季度的起始月份和结束月份，月份从0开始
    function getStartAndEndMonthOfQuarter(month){
        var startMonth = 0;
        var endMonth = 2;
        if(month >= 9){
            startMonth = 9;
            endMonth = 11;
        }else if(month >= 6){
            startMonth = 6;
            endMonth = 8;
        }else if(month >= 3){
            startMonth = 3;
            endMonth = 5;
        }
        return {startMonth: startMonth, endMonth: endMonth};
    }

    //按月选择里的切换时间
    function changeSelectMonthOfYear($selectMonthBlock, type, options){
        var $selectMonthYear = $selectMonthBlock.find('div[bh-time-picker-role="selectMonthYear"]');
        var year = parseInt($selectMonthYear.text(), 10);
        var maxYear = 0;
        if(options.settings.range.max){
            maxYear = options.settings.range.max === 'today' ? new Date().getFullYear() : new Date(options.settings.range.max).getFullYear();
        }
        var minYear = 0;
        if(options.settings.range.min){
            minYear = options.settings.range.min === 'today' ? new Date().getFullYear() : new Date(options.settings.range.min).getFullYear();
        }
        //上一年
        if(type === 'pre'){
            if(year === minYear){
                return;
            }
            year--;
        }else{
            //下一年，若下一年比当前年大，则不做处理
            if(year === maxYear){
                return;
            }
            year++;
        }
        $selectMonthYear.html(year + '年');
        var monthHtml = getSelectMonthHtml(options, timeStrToDate(year+'/12/1'), type);
        $selectMonthBlock.find('div[bh-time-picker-role="selectMonthList"]').html(monthHtml);
    }

    /**
     * 切换选择的月份
     * @param $month
     * @param options
     */
    function changeSelectMonth($month, options){
        //若该月份比当前月份大，则点击无效
        if(!$month.hasClass('bh-pre')){
            return;
        }
        var $selectMonthBlock = $month.closest('div[bh-time-picker-role="selectMonthBlock"]');
        var year = parseInt($selectMonthBlock.find('div[bh-time-picker-role="selectMonthYear"]').text(), 10);
        var month = parseInt($month.attr('data-month'), 10);
        var endDay = getOneMonthDays(year, month);
        //移除状态标识
        options.$rootElement.removeData('selectType');
        //隐藏弹框
        options.rangeBoxDom.find('div[bh-time-picker-role="rangeBoxSelectTime"]').click();
        //设置开始和结束时间组件的时间
        setInputDateTime(options, new Date(year+'/'+month+'/1'), new Date(year+'/'+month+'/'+endDay), true);
    }

    //设置显示的时间范围
    function resetRangeBoxTime(options, startTime, endTime){
        var $rangeBoxSelectTime = options.$rootElement.find('div[bh-time-picker-role="rangeBoxSelectTime"]');
        var $selectType = options.popupBoxDom.find('div[bh-time-picker-role="selectCustom"] div[bh-time-picker-role="selectType"]');
        var selected = $selectType.jqxDropDownList('getSelectedItem');
        if('all' === selected.value){
            $rangeBoxSelectTime.html(selected.label);
            return;
        }
        var startTimeStr = getLocalDateStr(startTime);
        var endTimeStr = getLocalDateStr(endTime);
        $rangeBoxSelectTime.html(startTimeStr + '-' + endTimeStr);
    }

    function getLocalDateStr(time){
        return time.getFullYear() + '年' + numberLessThan10AddPre0(time.getMonth()+1) + '月' + time.getDate() + '日';
    }

    //将小于10的数字前面加上0，如01
    function numberLessThan10AddPre0(num){
        return num < 10 ? '0' + num : num;
    }

    /**
     * 判断选择状态是否要切换成自定义
     * 当selectType属性不存在时，切换成自定义
     * @param $selectCustom
     */
    function changeFixedSelectType(options, $selectCustom){
        var selectType = options.$rootElement.data('selectType');
        if(typeof selectType !== 'undefined' && selectType === 'fixed'){
            return;
        }
        $selectCustom.find('div[bh-time-picker-role="selectType"]').jqxDropDownList('selectIndex', 0 );
    }

    /**
     * 自己手动改变时间时，判断开始时间是否大于结束时间
     * 若大于则将两个时间设为相同的时间
     * 同时验证选取的时间是否在传入的范围内
     * 若不在，则开始时间以传入范围的最小时间算，结束时间按传入的最大时间算
     * @param $selectCustom
     * @param type
     */
    function checkTimeOrder($selectCustom, type, options){
        //设置自己选择时间的标志，用于处理body被重复点击造成弹框被隐藏的问题
        $('body').data('bhTimePick', 'selectTime');
        var $selectStart = $selectCustom.children('div[bh-time-picker-role="selectStart"]');
        var $selectEnd = $selectCustom.children('div[bh-time-picker-role="selectEnd"]');
        var startTime = $selectStart.jqxDateTimeInput('getDate');
        var endTime = $selectEnd.jqxDateTimeInput('getDate');
        if(startTime > endTime){
            //当选取的是结束时间，将结束时间设成和开始时间一样
            if(type === 'end'){
                var startDate = getDateObj(startTime);
                $selectEnd.jqxDateTimeInput('setDate', new Date(startDate.year, startDate.month, startDate.day));
            }else{
                //当选取的是开始时间，将开始时间设成和结束时间一样
                var endDate = getDateObj(endTime);
                $selectStart.jqxDateTimeInput('setDate', new Date(endDate.year, endDate.month, endDate.day));
            }
            return;
        }

        //判断开始时间是否在传入的时间范围内
        if(type === 'start'){
            if(options.settings.range.min){
                var minTime;
                if(options.settings.range.min !== 'today'){
                    minTime = new Date(options.settings.range.min);
                }else{
                    minTime = new Date();
                }

                if(startTime < minTime){
                    $selectStart.jqxDateTimeInput('setDate', minTime);
                }
            }
        }else{
            if(options.settings.range.max){
                var maxTime;
                if(options.settings.range.max !== 'today'){
                    maxTime = new Date(options.settings.range.max);
                }else{
                    maxTime = new Date();
                }

                if(endTime > maxTime){
                    $selectEnd.jqxDateTimeInput('setDate', maxTime);
                }
            }
        }
    }

    /**
     * 点击左右切换显示时间的处理
     * @param type pre或next
     */
    function selectRangeBox(type, options){
        var $selectBox = options.popupBoxDom.find('div[bh-time-picker-role="selectBox"]');
        var $rangeBox = options.$rootElement.find('div[bh-time-picker-role="rangeBox"]');
        if($rangeBox.hasClass('bh-active')){
            $rangeBox.find('div[bh-time-picker-role="rangeBoxSelectTime"]').click();
        }
        var time;
        //当点击的是上一个按钮，则以开始时间为基准
        if(type === "pre"){
            time = $selectBox.find('div[bh-time-picker-role="selectStart"]').jqxDateTimeInput('getDate');
        }else{
            //当点击的是下一个按钮，则以结束时间为基准
            time = $selectBox.find('div[bh-time-picker-role="selectEnd"]').jqxDateTimeInput('getDate');
        }
        var dateObj = getDateObj(time);
        var rangeDate;
        var oneDayTime = 24 * 60 * 60 * 1000;
        if(type === 'pre'){
            //点击上一个按钮，若开始时间是1月份，则调整为上一年的12月份，否则调整为上一个月
            if(dateObj.month === 0){
                dateObj.month = 11;
                dateObj.year = dateObj.year - 1;
            }else{
                dateObj.month = dateObj.month - 1;
            }
            //当有最小的时间范围时，判断选择的时间是否不在这个范围，不在则设置为这个最小时间
            if(options.settings.range.min){
                var minTime = options.settings.range.min === 'today' ? new Date() : timeStrToDate(options.settings.range.min);
                rangeDate = getDateObj(minTime);
                if(minTime > new Date(time.getTime() - (30 * oneDayTime))){
                    dateObj = rangeDate;
                }
            }
        }else{
            //点击的是下一个按钮
            //若不是今年的话，若选择的月是12月，则调整为下一年的1月份，否则调整为下个月
            if(dateObj.month === 11){
                dateObj.month = 0;
                dateObj.year = dateObj.year + 1;
            }else{
                dateObj.month = dateObj.month + 1;
            }

            //当有最大的时间范围时，判断选择的时间是否不在这个范围，不在则设置为这个最大时间
            if(options.settings.range.max){
                var maxTime = options.settings.range.max === 'today' ? new Date() : timeStrToDate(options.settings.range.max);
                rangeDate = getDateObj(maxTime);
                if(maxTime < new Date(time.getTime() + (30 * oneDayTime))){
                    dateObj = rangeDate;
                }
            }
        }

        var startTime = {};
        var endTime = {};
        //若年份不一致，则直接使用选取的时间
        if(!rangeDate || dateObj.year !== rangeDate.year){
            startTime = {year: dateObj.year, month: dateObj.month, day: 1};
            endTime = {year: dateObj.year, month: dateObj.month, day: getOneMonthDays(dateObj.year, dateObj.month + 1)};
        }else{
            //若选择的年份一致，若选取的月份不是当前月，则直接使用选取的时间，若是当前月则最后的日期使用今天的
            if(dateObj.month !== rangeDate.month){
                startTime = {year: dateObj.year, month: dateObj.month, day: 1};
                endTime = {year: dateObj.year, month: dateObj.month, day: getOneMonthDays(dateObj.year, dateObj.month + 1)};
            }else{
                if(type === 'pre'){
                    startTime = {year: dateObj.year, month: dateObj.month, day: rangeDate.day};
                    endTime = {year: dateObj.year, month: dateObj.month, day: getOneMonthDays(dateObj.year, dateObj.month + 1)};
                }else{
                    startTime = {year: dateObj.year, month: dateObj.month, day: 1};
                    endTime = {year: dateObj.year, month: dateObj.month, day: rangeDate.day};
                }
            }
        }

        var monthStr = dateObj.month + 1 < 10 ? '0' + parseInt(dateObj.month + 1, 10) : dateObj.month + 1;
        var startTimeStr = startTime.year + '/' + monthStr + '/' + numberLessThan10AddPre0(startTime.day);
        var endTimeStr = endTime.year + '/' + monthStr + '/' + endTime.day;
        setInputDateTime(options, timeStrToDate(startTimeStr), timeStrToDate(endTimeStr), true);
    }

    //时间字符串转成时间对象
    function timeStrToDate(DateStr){
        var converted = Date.parse(DateStr);
        var myDate = new Date(converted);
        if (isNaN(myDate)){
            //var delimCahar = DateStr.indexOf('/')!=-1?'/':'-';
            var arys= DateStr.split('-');
            myDate = new Date(arys[0],--arys[1],arys[2]);
        }
        return myDate;
    }

    /**
     * 这里是关键
     * 定义一个插件 plugin
     */
    $.fn.bhTimePicker = function (options, params) {
        var instance;
        instance = this.data('bhTimePicker');
        /**
         * 判断插件是否已经实例化过，如果已经实例化了则直接返回该实例化对象
         */
        if (!instance) {
            return this.each(function () {
                //将实例化后的插件缓存在dom结构里（内存里）
                return $(this).data('bhTimePicker', new Plugin(this, options));
            });
        }
        if (options === true) return instance;
        /**
         * 优雅处： 如果插件的参数是一个字符串，则 调用 插件的 字符串方法。
         * 如 $('#id').plugin('doSomething') 则实际调用的是 $('#id).plugin.doSomething();
         * doSomething是刚才定义的接口。
         * 这种方法 在 juqery ui 的插件里 很常见。
         */
        if ($.type(options) === 'string'){
            return instance[options](params);
        }
        return this;
    };

    /**
     * 插件的默认值
     */
    $.fn.bhTimePicker.defaults = {
        defaultType: '',
        width: '',
        format: 'yyyy-MM-dd',//可选，时间格式，默认yyyy-MM-dd（年-月-日）
        range: { //可选，设置时间的可选范围
            max: '', //可选，设置最大时间，‘today’最大时间就是今天，或传入时间字符串‘2016/4/22’
            min: '' //可选，设置最小时间，‘today’最小时间就是今天，或传入时间字符串‘2016/4/22’
        },
        time: { //可选，设置初始化时间
            start: '', //可选，开始时间
            end: '' //可选，结束时间
        },
        isDisable: false, //可选，该组件是否禁用，默认false，不禁用
        selectedTime: null, //选取时间后的回调，返回开始时间和结束时间字符串
        ready: null //初始化完成回调
    };
})(jQuery);
(function($) {
    'use strict';

    $.bhTip = function(data) {
        var bhTipDefaults = {
            content: '', // 必填，提示框的内容
            state: 'success', //必填，3种状态：成功success，警告warning，失败danger
            iconClass: '', //必填，提示图标的样式类
            options: [{ // 可选
                text: '', //a标签名称
                callback: null // 可选，点击按钮后的回调
            }],
            onClosed: function() {}
        };
        var options = $.extend({}, bhTipDefaults, data);

        init(options);

        function init(options) {
            options = setDefaultIconClass(options);
            var $body = $('body');
            var tipCont = $body.find('div[bh-tip-role="bhTip"]');
            if (tipCont.length == 0) { // 判断当前是否已存在提示，已存在则点击按钮无作用
                var tipBtnHtml = '';
                var optionsArr = [];
                optionsArr = options.options;
                var optionsArrLen = optionsArr.length;
                if (optionsArrLen > 1) { // 判断是否传参options，动态添加tip-btn
                    for (var i = 0; i < optionsArrLen; i++) {
                        tipBtnHtml += '<a href="javascript:void(0);" class="bh-tip-btn" bh-tip-btn-role="tipBtn">' + optionsArr[i].text + '</a>';
                    }
                    tipBtnHtml = '<div class="bh-tip-btn-group">' + tipBtnHtml + '</div>';
                }
                var tipHtml =
                    '<div class="bh-tip bh-tip-animated" bh-tip-role="bhTip">' +
                    '<div class="bh-tip-top-bar bh-tip-' + options.state + '" ></div>' +
                    '<div class="bh-card bh-card-lv4">' +
                    '<a class="bh-tip-closeIcon" bh-tip-btn-role="closeIcon">×</a>' +
                    '<div class="bh-tip-content">' +
                    '<i class="iconfont ' + options.iconClass + '" ></i> ' +
                    '<span>' + options.content + '</span> ' +
                    tipBtnHtml +
                    '</div>' +
                    '</div>' +
                    '</div>';
                var $tipObj = $(tipHtml);
                var windowObj = $body.find('div.jqx-window');
                if (windowObj.length == 0) { // 不存在模态弹框时，提示在浏览器顶部显示
                    $body.append($tipObj);
                    $tipObj.css({
                        "position": "fixed"
                    });
                } else {
                    var windowDialogDom = null;
                    var dialogZindex = 0;
                    windowObj.each(function() {
                        if(this.style.display !== 'none') {
                            var zIndex = parseInt(this.style.zIndex,10);
                            if(zIndex > dialogZindex){
                                dialogZindex = zIndex;
                                windowDialogDom = this;
                            }
                        }
                    });

                    if(windowDialogDom){
                        $(windowDialogDom).append($tipObj); // 提示在模态弹框中显示
                        $tipObj.css({
                            "position": "absolute"
                        });
                    }else{
                        $body.append($tipObj);
                        $tipObj.css({
                            "position": "fixed"
                        });
                    }
                }

                // 设置提示条水平居中显示
                var tipWidth = $tipObj.width();
                var tipLeft = 'calc(50% - ' + tipWidth / 2 + 'px)';
                $tipObj.css({
                    "left": tipLeft
                });

                // 动态控制文本居中
                setTipContentWidth($tipObj);
                $tipObj.prop('leaving', true);
                $tipObj.addClass("bh-tip-outDown");
                var initTime = +(new Date()); // 定义全局变量记录当前时间
                //  下滑后停留5000ms,再收起
                var stayId = setUpwardFold($tipObj, 5000);
                //  收起后删除该DOM节点
                var removeId = removeNode($tipObj, 5450, options);
                //  点击关闭按钮
                closeIconClick($tipObj);
                // 点击按钮后的回调
                callbackListen($tipObj, options);

                mouseOverAndOut($tipObj, stayId, removeId, initTime, 5000, options);
            }
        }

        // 鼠标移入和移出的动作
        function mouseOverAndOut(obj, stayId, removeId, initTime, remainTime, opt) {
            var startTime = initTime; // 记录动画开始时间
            var hoverTime; //记录鼠标移入时间
            var leaveTime; // 记录鼠标移出时间
            var remainTime; //记录鼠标移出后，剩余停留时间
            obj.off('mouseenter').on("mouseenter", function() {
                obj.prop('leaving', false); // 记录鼠标移入移出的状态
                hoverTime = +(new Date()); // 定义变量记录鼠标移入的时间
                // 停止收起动画和删除节点操作
                clearTimeout(stayId);
                clearTimeout(removeId);
                var timeDiff = hoverTime - startTime;
                if (timeDiff < remainTime) {
                    remainTime = remainTime - timeDiff;
                }
            });

            obj.off('mouseleave').on("mouseleave", function() {
                obj.prop('leaving', true);
                leaveTime = +(new Date()); // 定义变量记录鼠标移出的时间
                setUpwardFold(obj, remainTime); //从剩余时间继续执行动画
                var removeTime = remainTime + 450; //等待收起动画经历450ms, 之后删除节点
                removeNode(obj, removeTime, opt);
                mouseOverAndOut(obj, stayId, removeId, leaveTime, remainTime, opt)
            });
        }

        // 设置不同状态下的默认图标样式
        function setDefaultIconClass(options) {
            var iconClass = '';
            switch (options.state) {
                case 'success':
                    iconClass = 'icon-checkcircle';
                    break;
                case 'warning':
                    iconClass = 'icon-erroroutline';
                    break;
                case 'danger':
                    iconClass = 'icon-error';
                    break;
            }
            options.iconClass = options.iconClass ? options.iconClass : iconClass;

            return options;
        }

        // 下滑后停留一定时间,再收起
        function setUpwardFold(obj, time) {
            var stayId = setTimeout(function() {
                if (!obj.prop('leaving')) {
                    return;
                }
                obj.removeClass("bh-tip-outDown").addClass("bh-tip-inUp");
            }, time);
            return stayId;
        }

        // 收起后删除该DOM节点
        function removeNode(obj, time, options) {
            var removeId = setTimeout(function() {
                if (!obj.prop('leaving')) {
                    return;
                }
                obj.remove();
                if (options.onClosed)
                    options.onClosed();
            }, time);
            return removeId;
        }

        // 计算文本宽度设置水平居中
        function setTipContentWidth(obj) {
            var contentObj = obj.find(".bh-tip-content");
            var cardObj = obj.find(".bh-card");
            var objText = $.trim(contentObj.text()); //获得字符串内容
            var textLen = objText.length; //实际字符个数
            var textWidth = textLen * 12 + 16 + 8; // 计算内容实际宽度：字符个数*每个字符宽度 + 图标宽 + 图标与文字的间距
            if (textWidth > 184) { // 184: 最小宽度240px下内容的最大宽度
                cardObj.css({
                    "padding-right": "40px"
                });
            }
        }

        // 点击关闭按钮，立即收起，450ms
        function closeIconClick(obj) {
            obj.on("click", "a[bh-tip-btn-role=closeIcon]", function() {
                obj.removeClass("bh-tip-outDown").addClass("bh-tip-inUp");
                setTimeout(function() {
                    obj.remove();
                    if (options.onClosed)
                        options.onClosed();
                }, 450);
            });
        }

        // 点击操作按钮后的回调
        function callbackListen(obj, option) {
            obj.on("click", "a[bh-tip-btn-role=tipBtn]", function(event) {
                var btnIndex = $(event.target).index(); // 获取当前点击按钮的索引
                var btnOptions = {};
                btnOptions = option.options[btnIndex];
                if (typeof btnOptions.callback != 'undefined' && btnOptions.callback instanceof Function) {
                    btnOptions.callback();
                }
            });
        }
    }

})(jQuery);
/**
 * 步骤向导组件
 */

if (typeof(BhUIManagers) == "undefined") BhUIManagers = {};
(function($) {
    $.fn.bhGetWizardManager = function() {
        return BhUIManagers[this[0].id + "_Wizard"];
    };

    //参数命名空间定义
    $.bhDefaults = $.bhDefaults || {};

    //组件参数集合定义
    $.bhDefaults.wizard = {
        items: [], //步骤参数集合 title,stepId,active,finished
        active: '', //当前激活项的stepId
        active2: null, //当前激活项的stepId 并调用change事件
        finished: [], //当前已完成项的stepId数组
        isAddClickEvent: true, //步骤条是否可点
        contentContainer: $("body"), //正文的容器选择器
        change: null
    };

    //函数命名空间
    $.bhWizard = $.bhWizard || {};

    /**
     * 构造一个Jquery的对象级别插件,委托页面的id元素初始化
     * @param options 参数集合
     * @return {*}
     */
    $.fn.bhWizard = function(options) {
        var p = $.extend({}, $.bhDefaults.wizard, options || {});

        this.each(function() {
            $.bhWizard.bhAddWizard(this, p);
        });

        //返回管理器
        if (this.length == 0) return null;
        if (this.length == 1) return $(this[0]).bhGetWizardManager();

        //如果初始化的是个数组，返回管理器的集合
        var managers = [];
        this.each(function() {
            managers.push($(this).bhGetWizardManager());
        });
        return managers;
    };

    /**
     * 构造一个类级别插件
     * @param wizard 初始化的元素对象
     * @param options 参数集合
     */
    $.bhWizard.bhAddWizard = function(wizard, options) {
        //如果已经初始化或者步骤为空则返回
        if (wizard.userWizard) return;

        /**
         * 构造li元素集合
         * @type {Array}
         */
        var wizardHtml = [];

        var g = {
            addItem: function(i, item, total) {
                var newItem = $('<div class="bh-wizard-item" stepid="' + item.stepId + '">' +
                    '<div class="left-arrow"></div>' +
                    '<div class="title bh-str-cut" title="' + item.title + '"><i></i>' + item.title + '</div>' +
                    '<div class="right-arrow"></div>' +
                    '</div>');
                var itemStatus = {
                    item: newItem,
                    isActive: false,
                    isFinished: false
                };
                if (i == 0) {
                    $(newItem).addClass("bh-wizard-item-first");
                } else if (i == (total - 1)) {
                    $(newItem).addClass("bh-wizard-item-last");
                }
                g.wizardContainer.append(newItem);
            },
            resetActiveItem: function(stepId) {
                g.activeItemStepId = stepId;
            },
            resetFinishedItems: function(stepIds) {
                g.finishedItemStepIds = stepIds;
                for (var i = 0; i < g.finishedItemStepIds.length; i++) {
                    var finishedStepId = g.finishedItemStepIds[i];
                    var finishedIndex = po.getIndexByStepId(finishedStepId);
                    po.refreshElementByIndex(finishedIndex);
                }
            },
            activeNextItem: function() {
                //重置上一个激活项的样式
                var prevActiveItemIndex = po.getActiveItemIndex();
                var newActiveItemIndex = prevActiveItemIndex + 1;
                var stepId = g.items[newActiveItemIndex]["stepId"];
                g.changeToActive(stepId);
            },
            /**
             * 把指定的步骤切成active状态
             * @param stepId
             */
            changeToActive: function(stepId) {
                //1、取消上一个步骤处于激活状态
                var prevActiveItemStepId = g.activeItemStepId;
                var prevActiveItemIndex = po.getActiveItemIndex();

                g.resetActiveItem(stepId);

                po.refreshElementByIndex(prevActiveItemIndex);
                g.contentContainer.find("#" + prevActiveItemStepId).addClass("bh-hide");

                //2、设置指定的步骤的项为激活状态
                var newActiveItemIndex = po.getActiveItemIndex();
                po.refreshElementByIndex(newActiveItemIndex);
                g.contentContainer.find("#" + g.activeItemStepId).removeClass("bh-hide");

                if (options && typeof options.change != 'undefined' && options.change instanceof Function) {
                    options.change({
                        "stepId": stepId
                    });
                }
            },
            changeToFinished: function(finishedStepId) {
                //1、设置指定的步骤为finished
                if (po.isExistInFinisheds(finishedStepId)) return;
                po.addToFinisheds(finishedStepId);
                var finishedIndex = po.getIndexByStepId(finishedStepId);
                po.refreshElementByIndex(finishedIndex);
            }
        };

        var po = {
            /**
             * 判断步骤项是否在已完成列表中
             * @param stepId
             * @returns {boolean}
             */
            isExistInFinisheds: function(stepId) {
                var isExist = false;
                for (var i = 0; i < g.finishedItemStepIds.length; i++) {
                    if (g.finishedItemStepIds[i] == stepId) {
                        isExist = true;
                        break;
                    }
                }
                return isExist;
            },
            addToFinisheds: function(finishedStepId) {
                if (g.finishedItemStepIds) {
                    var maxLen = g.finishedItemStepIds.length;
                    if (maxLen > 0) {
                        g.finishedItemStepIds[maxLen] = finishedStepId;
                    } else {
                        g.finishedItemStepIds[0] = finishedStepId;
                    }
                }
            },
            init: function() {
                //激活的区域需要打开区域信息
                g.wizardElement.each(function(i, item) {
                    if ($(item).hasClass("active")) {
                        //打开对应的step的信息区域
                        $("#" + $(item).attr("stepid")).removeClass("bh-hide");
                    } else {
                        $("#" + $(item).attr("stepid")).addClass("bh-hide");
                    }
                });
            },
            isActive: function(index) {
                var activeIndex = po.getIndexByStepId(g.activeItemStepId);
                if (activeIndex == index) {
                    return true;
                }
                return false;
            },
            isFinished: function(index) {
                var finishedCount = g.finishedItemStepIds.length;
                var result = false;
                if (finishedCount > 0) {
                    for (var i = 0; i < finishedCount; i++) {
                        if (index == po.getIndexByStepId(g.finishedItemStepIds[i])) {
                            result = true;
                            break;
                        }
                    }
                }
                return result;
            },
            refreshElementByIndex: function(index) {
                var targetElement = g.wizardElement[index];
                var icon = $("i", $(targetElement));
                icon.removeClass();
                if (po.isFinished(index)) {
                    $(targetElement).addClass("finished");
                    icon.addClass("iconfont icon-checkcircle");
                } else {
                    $(targetElement).removeClass("finished");
                }
                if (po.isActive(index)) {
                    $(targetElement).addClass("active");
                    icon.addClass("iconfont icon-edit");
                } else {
                    $(targetElement).removeClass("active");
                }
            },
            isActiveItem: function(stepId) {
                if (stepId == g.activeItemStepId) {
                    return true;
                } else {
                    return false;
                }
            },
            addClickEvent: function() {
                g.wizardElement.unbind("click").click(function() {
                    var thisElement = $(this);
                    var stepId = thisElement.attr("stepid");
                    if (po.isActiveItem(stepId)) return;
                    g.changeToActive(stepId);
                })
            },
            getIndexByStepId: function(stepId) {
                var index = 0;
                for (var i = 0; i < g.items.length; i++) {
                    if (g.items[i]["stepId"] == stepId) {
                        index = i;
                        break;
                    }
                }
                return index;
            },
            getActiveItemIndex: function() {
                var index = 0;
                for (var i = 0; i < g.items.length; i++) {
                    if (g.items[i]["stepId"] == g.activeItemStepId) {
                        index = i;
                        break;
                    }
                }
                return index;
            }
        }

        g.items = options.items;
        g.activeItemStepId = options.active || options.active2;
        g.finishedItemStepIds = options.finished;
        g.wizardContainer = $(wizard);
        g.contentContainer = options.contentContainer;
        g.wizardContainer.addClass('bh-wizard-container');

        $(options.items).each(function(i, item) {
            g.addItem(i, item, options.items.length);
        });

        g.wizardElement = $(g.wizardContainer).children(".bh-wizard-item");

        $(options.items).each(function(i, item) {
            po.refreshElementByIndex(i);
        });

        po.init();

        if (options.isAddClickEvent) {
            //绑定点击事件
            po.addClickEvent();
        }

        if (options.active2) {
            g.changeToActive(options.active2);
        }

        var itemLen = g.wizardElement.length;
        if (itemLen > 0) {
            var $wizardContainer = g.wizardContainer;
            var sumWidth = $wizardContainer.width();
            var hiddenCount = $(".bh-wizard-item:hidden", $wizardContainer).length;
            var count = itemLen - hiddenCount;
            var itemWidth = Math.floor(sumWidth / count);
            //40是左右两个箭头的宽度
            g.wizardElement.find('.title').width(itemWidth - 40);
        }

        //g.wizardElement.each(function(index, m) {
        //    if (g.wizardElement && g.wizardElement.length > 0) {
        //        var leftWidth = $(m).find(".left-arrow").outerWidth();
        //        var rightWidth = $(m).find(".right-arrow").outerWidth();
        //        var marginLeft = -8;
        //        var sumWidth = $(m).parent("div").width();
        //        var count = g.wizardElement.length;
        //        var itemWidth = Math.floor((sumWidth + 10) / count);
        //        $(".title", $(m)).width(itemWidth - (leftWidth + rightWidth + marginLeft));
        //    }
        //});

        if (wizard.id == undefined) wizard.id = "BhUI_" + new Date().getTime();
        BhUIManagers[wizard.id + "_Wizard"] = g;

        wizard.userWizard = true;
    }
})
(jQuery);
