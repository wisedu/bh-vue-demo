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
        this.element = $(element);
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
            });
        });
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
                element.closest('li.dropdown')
                    .addClass('bh-active')
                    .end()
                    .find('[data-toggle="bhTab"]')
                    .attr('aria-expanded', true);
            }
            callback && callback();
        }

        $active.length && transition ?
            $active
            .one('bsTransitionEnd', next)
            .emulateTransitionEnd(Tab.TRANSITION_DURATION) :
            next();

        $active.removeClass('bh-in');
    };


    // TAB PLUGIN DEFINITION
    // =====================

    function Plugin(option) {
        return this.each(function() {
            var $this = $(this);
            var data = $this.data('bs.tab');

            if (!data) {
                $this.data('bs.tab', (data = new Tab(this)));
            }
            if (typeof option == 'string') {
                data[option]();
            }
        });
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
        Plugin.call($(this), 'show');
    };

    $(document).on('click.bs.tab.data-api', '[data-toggle="bhTab"]', clickHandler);

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
    /***
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
                if (bodyIsOverflowing) {
                    bodyHtml.css('padding-right', bodyPad + scrollbarWidth);
                }
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
                var btn = $("<a style='cursor: pointer;' class='bh-btn'></a>");
                if (btnInfo && btnInfo.text) {
                    btn.text(btnInfo.text);
                }
                if (btnInfo && btnInfo.className) {
                    btn.addClass(btnInfo.className);
                }
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
        };
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
        var container = $item.parent();
        if (container.attr('multiple')) {
            $item.toggleClass("bh-active");
        } else {
            if ($item.hasClass('bh-active')) return;
            $item.closest(".bh-label-radio-group").find(".bh-label-radio").removeClass("bh-active");
            $item.addClass("bh-active");
        }
        container.trigger('change');
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

    $(document).on("click", function(e) {
        var $dropdown = null;
        var $target = $(e.target || e.srcElement);
        if ($target.attr('bh-dropdown-role') === 'bhDropdown') {
            $dropdown = $target;
        } else if ($target.closest('[bh-dropdown-role=bhDropdown]').length > 0) {
            $dropdown = $target.closest('[bh-dropdown-role=bhDropdown]');
        }
        if ($dropdown) {
            $dropdown.find("[bh-dropdown-role=bhDropdownMenu]").toggleClass("bh-dropdown-open");
        } else {
            $('body').find("[bh-dropdown-role=bhDropdownMenu]").removeClass("bh-dropdown-open");
        }
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
/**
 * @fileOverview 浮动组件
 * 页面滚动，使元素块变浮动
 * @example
 $.bhAffix({
    hostContainer: $('section'), //父容器
    fixedContainer: $('#affixContainer') //浮动元素
 });
 */
(function ($) {
    /**
     * 初始化
     * @module bhAffix
     * @prop data {object} 初始化参数
     * @prop data.hostContainer {jQuery} 浮动块所在的父容器
     * @prop data.fixedContainer {jQuery} 浮动块容器
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
    };
})(jQuery);
/**
 * @fileOverview 侧边菜单导航
 * @example
 $.bhAsideNav.init({
    title: "",//必填, 标题
    iconFont: "",//必填, 字体图标的总类名
    data: [//必填, 导航列表
        [
            {
                text: "",
                icon: "",
                href: "", //可选, 导航跳转的url
                children: [
                    {text: ""}
                ]
            }
        ]
    ],
    ready: function(){} //可选，初始化并渲染完成的回调
});
 */
(function($) {
    /**
     * 侧边菜单导航
     * @module bhAsideNav
     */
    $.bhAsideNav = {
        /**
          * 初始化侧边菜单导航
          * @method init
          * @param options {object} 初始化参数
          * @param options.title {string} 必填，菜单标题
          * @param options.iconFont {string} 必填, 字体图标的总类名
          * @param options.data {srting} 必填, 导航列表
          * @param options.text {string} 必填, 导航上展示的文字
          * @param options.icon {string} 可选, 导航前面的字体图标的类名
          * @param options.href {string} 可选, 导航跳转的url
          * @param options.children {string} 可选，导航二级列表
          * @param options.ready {callback} 可选，初始化并渲染完成的回调
          * @param options.hide {callback} 可选，点击关闭按钮的回调
          * @example
          $.bhAsideNav.init({
                title: "",//必填, 标题
                iconFont: "",//必填, 字体图标的总类名
                data: [//必填, 导航列表
                    [
                        {
                            text: "",
                            icon: "",
                            children: [
                                {text: ""}
                            ]
                        }
                    ]
                ],
                ready: function(){} //可选，初始化并渲染完成的回调
            });
          */
        "init": function(options) {
            var navDefaults = {
                title: "", //标题
                iconFont: "", //字体图标的总类名
                data: [], //导航列表
                hide: null, //可选，点击关闭按钮的回调
                ready: null //可选，初始化并渲染完成的回调
            };
            options = $.extend({}, navDefaults, options);
            _init(options);
        },
        /**
         * 显示侧边导航的方法
         * @method show
         * @example
                 $.bhAsideNav.show();
         */
        "show": function(options) {
            _show(); //显示侧边导航方法
        },
        /**
         * 隐藏侧边导航的方法
         * @method hide
         * @example
                 $.bhAsideNav.hide();
         */
        //隐藏侧边导航方法
        "hide": function(options) {
            var navDefaults = {
                hide: null //可选，点击关闭按钮的回调
            };
            options = $.extend({}, navDefaults, options);
            _hide(options);
        },
        /**
         * 销毁侧边导航的方法
         * @method destroy
         * @example
                 $.bhAsideNav.destroy();
         */
        //销毁侧边导航
        "destroy": function(options) {
            _destroy();
        }
    };

    //动画执行基本时间
    function getAnimateTime() {
        return 450;
    }
    //每个li的高度
    function getLiHeight() {
        return 42;
    }

    function _init(options) {
        //导航标题html
        var headerHtml = getNavHeaderHtml(options);
        //导航列表html
        var contentHtml = getNavContentHtml(options);
        //导航遮盖层html
        var backdropHtml = getNavModelBackdrop();
        //将导航添加到body
        $("body").append('<div class="bh-asideNav-container bh-animated bh-outLeft" style="display: none;" bh-aside-nav-role="bhAsideNav">' + headerHtml + contentHtml + '</div>' + backdropHtml);

        //导航事件监听
        navEventListen();
        //初始化完成的回调
        if (options && typeof options.ready != 'undefined' && options.ready instanceof Function) {
            options.ready();
        }
    }

    //导航遮盖层html
    function getNavModelBackdrop() {
        var _html = '<div class="bh-modal-backdrop bh-animated bh-asideNav-fadeOut" style="display: none;" bh-aside-nav-role="bhAsideNavBackdrop"></div>';
        return _html;
    }

    //导航标题html
    function getNavHeaderHtml(options) {
        var _html =
            '<div class="bh-asideNav-top">' +
            '<h1>' + options.title + '</h1>' +
            '<div class="bh-asideNav-top-close">' +
            '<i class="iconfont icon-close" bh-aside-nav-role="bhAsideNavCloseBtn"></i>' +
            '</div>' +
            '</div>';
        return _html;
    }

    //导航列表html
    function getNavContentHtml(options) {
        var data = options.data;
        var dataLen = data.length;
        var iconFont = options.iconFont;

        var navHtml = "";
        if (dataLen > 0) {
            for (var i = 0; i < dataLen; i++) {
                var dataGroup = data[i];
                var dataGroupLen = dataGroup.length;
                if (dataGroupLen > 0) {
                    //是否是组里的最末元素
                    var isLastItemInGroup = false;
                    for (var j = 0; j < dataGroupLen; j++) {
                        //最后一组不加分割线
                        if (i < dataLen - 1) {
                            if (j == dataGroupLen - 1) {
                                isLastItemInGroup = true;
                            } else {
                                isLastItemInGroup = false;
                            }
                        }
                        var dataItem = dataGroup[j];
                        var dataChild = dataItem.children;
                        //当存在子元素时，拼接子元素列表的html
                        if (dataChild && dataChild.length > 0) {
                            var childsHtml = "";
                            var childLen = dataChild.length;
                            if (childLen > 0) {
                                for (var k = 0; k < childLen; k++) {
                                    childsHtml += getNavLiHtml(dataChild[k], iconFont, "child", false);
                                }
                                childsHtml = '<ul class="bh-asideNav">' + childsHtml + '</ul>';
                            }
                            navHtml += getNavLiHtml(dataItem, iconFont, "", isLastItemInGroup).replace("@childContent", childsHtml);
                        } else {
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
    function getNavLiHtml(dataItem, iconFont, flag, isLastItemInGroup) {
        var text = dataItem.text;
        var icon = dataItem.icon;
        var href = dataItem.href;
        //li的class名
        var liClass = '';
        var hasChild = false;
        //当该节点是子元素时li的class为空
        if (flag === "child") {
            liClass = "";
        } else {
            //当该元素存在子元素的列名
            if (dataItem.children && dataItem.children.length > 0) {
                liClass = 'bh-asideNav-dropdown';
                hasChild = true;
            }
        }

        if (!href) {
            //当href没有的处理
            href = "javascript:void(0);";
        }
        if (isLastItemInGroup) {
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
        if (!hasChild) {
            _html = _html.replace("@childContent", "");
        }
        return _html;
    }

    function navEventListen(options) {
        var $nav = $("[bh-aside-nav-role=bhAsideNav]");
        //点击关闭按钮
        $nav.on("click", "[bh-aside-nav-role=bhAsideNavCloseBtn]", function() {
            _hide(options);
        });
        var $backdrop = $("[bh-aside-nav-role=bhAsideNavBackdrop]");
        $backdrop.on("click", function() {
            _hide(options);
        });

        //点击有子元素的节点的打开和关闭处理
        $nav.on("click", ".bh-asideNav-dropdown > a", function() {
            var $li = $(this).parent();
            //当该元素是未打开状态，将所有有子元素的节点的高都设为默认高，然后再计算当前元素的高
            if (!$li.hasClass("bh-asideNav-open")) {
                $nav.find(".bh-asideNav-dropdown").css({
                    "height": getLiHeight() + "px"
                });
                var $childNav = $li.find(".bh-asideNav");
                var $lis = $childNav.children("li");
                var liLen = $lis.length;
                var allLiLen = liLen + 1;
                var childNavHeight = getLiHeight() * allLiLen;
                $nav.find(".bh-asideNav-open").removeClass("bh-asideNav-open");
                $li.addClass("bh-asideNav-open").css({
                    "height": childNavHeight + "px"
                });
            } else {
                //在其他状态下都将节点的高设为默认高
                var liHeight = getLiHeight();
                $li.removeClass("bh-asideNav-open").css({
                    "height": liHeight + "px"
                });
            }
            setTimeout(function() {
                $(".bh-asideNav-container").getNiceScroll().resize();
            }, getAnimateTime());

        });

        //点击所有节点是否移除active的处理
        $nav.on("click", ".bh-asideNav li>a", function() {
            var $li = $(this).closest("li");
            $nav.find(".bh-asideNav-active").removeClass("bh-asideNav-active");
            $li.addClass("bh-asideNav-active");
            //当被点击的元素没有子元素时，将导航隐藏
            if (!$li.hasClass("bh-asideNav-dropdown")) {
                _hide(options);
            }
        });

        $(".bh-asideNav-container").niceScroll({
            cursorborder: "none",
            hidecursordelay: 10,
            autohidemode: "scroll"
        });
    }

    //显示导航栏
    function _show() {
        var $nav = $("[bh-aside-nav-role=bhAsideNav]");
        var $backdrop = $("[bh-aside-nav-role=bhAsideNavBackdrop]");
        $nav.removeClass("bh-outLeft").addClass("bh-intoLeft").show();
        $backdrop.removeClass("bh-asideNav-fadeOut").addClass("bh-asideNav-fadeIn").show();
        setTimeout(function() {
            $(".bh-asideNav-container").getNiceScroll().resize();
        }, getAnimateTime());

    }

    //隐藏导航栏，当有回调时只行回调
    function _hide(options) {
        var $nav = $("[bh-aside-nav-role=bhAsideNav]");
        var $backdrop = $("[bh-aside-nav-role=bhAsideNavBackdrop]");
        $nav.removeClass("bh-intoLeft").addClass("bh-outLeft");
        $backdrop.removeClass("bh-asideNav-fadeIn").addClass("bh-asideNav-fadeOut");
        setTimeout(function() {
            $backdrop.hide();
            $(".bh-asideNav-container").getNiceScroll().resize();
            if (options && typeof options.hide != 'undefined' && options.hide instanceof Function) {
                options.hide();
            }
        }, getAnimateTime());
    }

    //销毁导航栏
    function _destroy() {
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
            var activeItem = $.makeArray($('.bh-label-radio.bh-active', this.$element));
            var value;
            if (activeItem.length) {
                value = activeItem.map(function(item){
                    return $(item).data('id');
                }).join(',');
            }
            return (value == 'ALL' ? '' : value);
        };

        return Plugin;
    })();

    _init = function (element, options) {
        if (options.multiple) {
            element.attr('multiple', true);
        }

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
        if (options.allOption && !options.multiple) {
            itemHtml = '<div class="bh-active bh-label-radio" data-id="ALL">全部</div>';
        }
        $(arr).each(function () {
            itemHtml += '<div class="bh-label-radio" data-id="' + this.id + '" data-name="' + this.name + '">' + this.name + '</div>';
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
        if (options === true) {
            return instance;
        }
        if ($.type(options) === 'string') {
            return instance[options]();
        }
        return this;
    };

    $.fn.bhButtonGroup.defaults = {
        allOption: true,
        multiple: false
    };

}).call(this);
/**
 * @fileOverview 步骤条组件
 * @example
$control.bhCollapse({
    data: [{
        title: '默认只会展示一个面板节点1',
        content: [{
            title: 'Heading_4',
            content: 'Body_Area_Default，12px / 行距20px / Grey_Lv2 简称“金智教育”，（英语全称为 JiangSu Wisedu Information Technology Co., Ltd ）是中国最大的教育信息化服务提供商。金智教育专注于教育信息化领域，致力于成为中国教育信息化服务的领航者，成为业界最具吸引力的事业平台，以通过信息化促进教育公平。'
        }, {
            title: 'Heading_4',
            content: 'Body_Area_Default，12px / 行距20px / Grey_Lv2 简称“金智教育”，（英语全称为 JiangSu Wisedu Information Technology Co., Ltd ）是中国最大的教育信息化服务提供商。金智教育专注于教育信息化领域，致力于成为中国教育信息化服务的领航者，成为业界最具吸引力的事业平台，以通过信息化促进教育公平。'
        }],
        extend: true
    }, {
        title: '默认只会展示一个面板节点2',
        content: [{
            title: 'Heading_4_1',
            content: 'Body_Area_Default，12px / 行距20px / Grey_Lv2 简称“金智教育”，（英语全称为 JiangSu Wisedu Information Technology Co., Ltd ）是中国最大的教育信息化服务提供商。金智教育专注于教育信息化领域，致力于成为中国教育信息化服务的领航者，成为业界最具吸引力的事业平台，以通过信息化促进教育公平。'
        }, {
            title: 'Heading_4_1',
            content: 'Body_Area_Default，12px / 行距20px / Grey_Lv2 简称“金智教育”，（英语全称为 JiangSu Wisedu Information Technology Co., Ltd ）是中国最大的教育信息化服务提供商。金智教育专注于教育信息化领域，致力于成为中国教育信息化服务的领航者，成为业界最具吸引力的事业平台，以通过信息化促进教育公平。'
        }]
    }],
    // 展开节点的回调
    // data.node 被展开的节点
    nodeExtend: function(data) {},
    // 收缩节点的回调
    // data.node 被收缩的节点
    nodeCollapse: function(data) {},
    // 创建完成的回调
    ready: function() {}
});
 */

(function($) {
    var Plugin;

    $.fn.bhCollapse = function(options, params) {
        var instance;
        instance = this.data('bhCollapse');
        /***
         * 判断插件是否已经实例化过，如果已经实例化了则直接返回该实例化对象
         */
        if (!instance) {
            return this.each(function() {
                //将实例化后的插件缓存在dom结构里（内存里）
                return $(this).data('bhCollapse', new Plugin(this, options));
            });
        }
        if (options === true) return instance;
        /***
         * 优雅处： 如果插件的参数是一个字符串，则 调用 插件的 字符串方法。
         * 如 $('#id').plugin('doSomething') 则实际调用的是 $('#id).plugin.doSomething();
         * doSomething是刚才定义的接口。
         * 这种方法 在 juqery ui 的插件里 很常见。
         */
        if ($.type(options) === 'string') {
            return instance[options](params);
        }
        return this;
    };

    /**
     * @memberof module:bhCollapse
     * @description 内置默认值
     * @prop {object}  defaults
     * @prop {string}  defaults.model - 可选，设置展开面板节点的模式，single/multiple：只展示一个面板节点/可同时展开多个面板节点，默认为'single'
     * @prop {boolean}  defaults.extend - 可选，初始展开所有面板节点, 仅在multiple模式下生效, 默认false，
     * @prop {Array}  defaults.data - 必填，面板节点的配置数组
     * @prop {string}  defaults.data.title - 必填，面板节点的标题
     * @prop {Array}  defaults.data.content - 必填，面板节点展开项的配置数组
     * @prop {string}  defaults.data.content.title - 可选，面板节点展开项的标题
     * @prop {Array}  defaults.data.content.content - 可选，面板节点展开项的内容文本
     * @prop {boolean}  defaults.data.extend - 可选，设置展开该面板节点，默认false
     * @prop {boolean}  defaults.data.disabled - 可选，设置该面板节点为disabled状态，此时没有Hover效果、无法点击。
     * @prop {function}  defaults.nodeExtend - 可选，展开节点的回调
     * @prop {function}  defaults.nodeCollapse - 可选，收缩节点的回调
     * @prop {function}  defaults.ready - 可选，创建完成的回调
     */

    $.fn.bhCollapse.defaults = {
        model: 'single', //一组面板节点的展开模式，single/multiple 只展示一个面板节点/可同时展开多个面板节点
        extend: false, //默认展开所有面板节点, 仅在multiple模式下生效
        data: [],
        nodeExtend: null, // 展开节点的回调
        nodeCollapse: null, // 收缩节点的回调
        ready: null // 创建完成的回调
    };

    /**
     * 这里是一个自运行的单例模式。
     * @module bhCollapse
     */
    Plugin = (function() {

        /***
         * 插件实例化部分，初始化时调用的代码可以放这里
         */
        function Plugin(element, options) {
            //将插件的默认参数及用户定义的参数合并到一个新的obj里
            this.settings = $.extend({}, $.fn.bhCollapse.defaults, options);
            //将dom jquery对象赋值给插件，方便后续调用
            this.$element = $(element);
            init(this.settings, this.$element);
        }

        return Plugin;

    })();

    function init(options, dom) {
        //初始化头部
        var html = getCollapseHtml(options);
        dom.html(html);
        initPanelHeight(dom, options);
        addEventListener(dom, options);
    }

    /***
     * 获取折叠面板的HTML
     * @param {object} options
     * @returns {string}
     */
    function getCollapseHtml(options) {
        var data = options.data;
        //判断标志位
        var flag = false;
        if (data) {
            var collapseHtml = '';
            for (var index = 0; index < data.length; index++) {
                var dataItem = data[index];
                var collapseClass = "bh-collapse";
                if (dataItem.disabled) {
                    //disabled优先级最高
                    collapseClass += " bh-collapse-disabled";
                    dataItem.extend = false;
                }
                var blockHtml = getItemContentHtml(dataItem.content);
                var obj = getItemPanelState(options, dataItem.extend, flag);
                dataItem.extend = obj.extend;
                if (obj.flag) {
                    //第一次出现extend为true时，将标志位置为true
                    flag = obj.flag;
                }
                collapseHtml += getItemPanelHtml(collapseClass, dataItem, blockHtml);
            }
            return collapseHtml;
        }
    }

    /***
     * 获取折叠面板每个节点下的展开项HTML
     * @param {Array} contentArr
     * @returns {string}
     */
    function getItemContentHtml(contentArr) {
        var blockHtml = '';
        if (contentArr) {
            for (var index = 0; index < contentArr.length; index++) {
                // 变量缓存
                var contentItem = contentArr[index];
                var title = contentItem.title;
                var content = contentItem.content;
                var titleHtml = '';
                var contentHtml = '';
                if (typeof title !== 'undefined') {
                    titleHtml = '<div class="sc-title-borderLeft bh-mb-16">' + title + '</div>';
                }
                if (typeof content !== 'undefined') {
                    contentHtml = '<div class="bh-collapse-block-item-content">' + content + '</div>';
                }
                blockHtml += '<div class="bh-collapse-block-item">' + titleHtml + contentHtml + '</div>';
            }
        }
        return blockHtml;
    }

    /***
     * 获取折叠面板每个节点的HTML
     * @param {string} className
     * @param {object} item  每个节点
     * @param {string} blockHtml  该节点对应的展开项内容
     * @returns {string}
     */
    function getItemPanelHtml(className, item, blockHtml) {
        var collapseHtml = '<div class="' + className + '" bh-collapse-extend="' + item.extend + '">' +
            '<div class="bh-collapse-header">' +
            '<h3 class="bh-collapse-title">' + item.title + '</h3>' +
            '<div class="bh-collapse-toolbar bh-animate-transform-fast">' +
            '<i class="iconfont icon-keyboardarrowright bh-collapse-icon"></i>' +
            '</div>' +
            '</div>' +
            '<div class="bh-collapse-block bh-collapse-animate-fast">' + blockHtml + '</div>' +
            '</div>';
        return collapseHtml;
    }

    /***
     * 获取面板节点的显示状态
     * @param {object} options
     * @param {boolean/undefined} extend  用户传入的extend状态
     * @param {boolean} flag
     * @returns {object}
     */
    function getItemPanelState(options, extend, flag) {
        var isFlag = flag;
        var isExtend = extend;
        if (options.model === 'multiple') {
            if (typeof isExtend === 'undefined') {
                if (options.extend) {
                    isExtend = true;
                } else {
                    isExtend = false;
                }
            }
        } else {
            if (typeof isExtend === 'undefined') {
                isExtend = false;
            } else if (isExtend) {
                //model为single时，但面板下同时有多个节点extend设为true的情况
                if (!flag) {
                    //只默认展开第一个extend为true的节点
                    isFlag = true;
                } else {
                    //其余全部置为false
                    isExtend = false;
                }
            }
        }
        var data = {
            extend: isExtend,
            flag: isFlag
        };
        return data;
    }

    /***
     * 初始化面板节点的高度
     * @param {object} dom
     * @param {object} options
     */
    function initPanelHeight(dom, options) {
        dom.find(".bh-collapse-block").each(function() {
            var $item = $(this);
            var height = $item.outerHeight();
            var $icon = $item.closest('.bh-collapse').find('.bh-collapse-toolbar');
            var isExtend = $item.closest('.bh-collapse').attr('bh-collapse-extend');
            if (isExtend === 'true') {
                //设置展开节点的图标样式
                $icon.addClass('bh-collapse-rotate-90');
                $item.css({
                    "height": height
                }).data("height", height).closest('.bh-collapse').addClass('bh-card bh-card-lv2 active');

            } else {
                $item.css({
                    "height": 0
                }).data("height", height).hide();

            }
        });

        if (typeof options.ready !== 'undefined' && options.ready instanceof Function) {
            options.ready();
        }
    }

    /***
     * 点击面板的事件监听
     * @param {object} dom
     * @param {object} options
     */
    function addEventListener(dom, options) {
        dom.off("click", '.bh-collapse-header').on("click", '.bh-collapse-header', function(e) {
            e = e || window.event;
            var targetNode = e.target || e.srcElement;
            var $target = $(targetNode);
            var $block = $target.closest('.bh-collapse').find('.bh-collapse-block');
            if (!$target.closest('.bh-collapse-disabled').length) {
                if ($target.closest('.bh-collapse').attr('bh-collapse-extend') !== 'true') {
                    if (options.model === 'single') {
                        doExtendOption(dom, $block, options);
                    } else {
                        extendPanel($block, options)
                    }
                } else {
                    collapsePanel($block, options);
                }
            }
        });
    }

    /***
     * 展开或收缩的动作判断
     * @param {object} dom
     * @param {object} $block
     * @param {object} options
     */
    function doExtendOption(dom, $block, options) {
        var isOpen = isPanelActive(dom);
        //是否有展开项
        if (isOpen) {
            var $activeBlock = getExtendPanel(dom);
            collapsePanel($activeBlock, options);
            //等待已有展开项收起之后，再执行当前节点的展开动作
            setTimeout(function() {
                extendPanel($block, options);
            }, getAnimateTime());
        } else {
            extendPanel($block, options);
        }
    }

    /***
     * 判断同一级下是否存在展开项
     * @param {object} dom
     * @returns {boolean}
     */
    function isPanelActive(dom) {
        var result = false;
        var activeObj = dom.find(".active");
        if (activeObj.length > 0 && activeObj.find(".bh-collapse-block").is(':visible')) {
            result = true;
        }
        return result;
    }

    /***
     * 获取已存在的展开项
     * @param {object} dom
     * @returns {object}
     */
    function getExtendPanel(dom) {
        var $block;
        dom.find(".bh-collapse-block").each(function(index, item) {
            // 及时阻止循环
            if ($(item).is(':visible')) {
                $block = $(item);
                return false;
            }
        });
        return $block;
    }

    /***
     * 展开面板节点
     * @param {object} $block
     * @param {object} options
     */
    function extendPanel($block, options) {
        var $card = $block.closest(".bh-collapse");
        $card.addClass("bh-card bh-card-lv2 active").attr("bh-collapse-extend", 'true');
        $card.find('.bh-collapse-toolbar').removeClass('bh-collapse-rotate-0').addClass('bh-collapse-rotate-90');

        var height = $block.data("height");
        $block.show();
        //增加50ms延迟以实现展开的下滑效果
        setTimeout(function() {
            $block.css({
                "height": height
            });
        }, 50);

        var data = {
            node: $card
        };
        if (options && options.nodeExtend) {
            setTimeout(function() {
                options.nodeExtend(data);
            }, getAnimateTime());
        }
    }

    /***
     * 收起面板节点
     * @param {object} $block
     * @param {object} options
     */
    function collapsePanel($block, options) {
        var $card = $block.closest(".bh-collapse");
        $block.css({
            "height": 0
        });
        var data = {
            node: $card
        };
        $card.find('.bh-collapse-toolbar').removeClass('bh-collapse-rotate-90').addClass('bh-collapse-rotate-0');
        setTimeout(function() {
            $block.hide();
            $card.removeClass("bh-card bh-card-lv2 active").attr('bh-collapse-extend', 'false');
            if (options && options.nodeCollapse) {
                options.nodeCollapse(data);
            }
        }, getAnimateTime());
    }

    /**
     * 动画的执行的基础时间
     * @returns {number}
     */
    function getAnimateTime() {
        return 250;
    }

})(jQuery);
/**
 * @fileOverview 可折叠面板
 * @example
$control.bhCollapsiblePanel({
    title: "", //大标题内容，可以是传纯文本或html
    tag: "", //标签html
    caption: "", //小标题内容，可以是传纯文本或html
    toolbar: "", //工具栏的DOM的Html
    hasBorder: true, //是否显示边框
    beforeExpand: null, //展开面板前的回调
    afterExpand: null, //展开面板后的回调
    beforeCollapse: null, //收缩面板前的回调
    afterCollapse: null //收缩面板后的回调
});
 */
(function($) {
    /**
     * 定义一个插件
     */
    var Plugin;

    /**
     * 这里是一个自运行的单例模式。
     * @module bhCollapsiblePanel
     */
    Plugin = (function() {

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

        /**
         * 展开面板
         * @method expandPanel
         * @example
        $control.bhCollapsiblePanel("expandPanel");
         */
        Plugin.prototype.expandPanel = function() {
            var switchBtn = this.$element.find('[bh-collapsible-panel-flag="switch"]');
            expandPanel(switchBtn, this.settings);
        };
        /**
         * 收缩面板
         * @method collapsePanel
         * @example
        $control.bhCollapsiblePanel("collapsePanel");
         */
        Plugin.prototype.collapsePanel = function() {
            var switchBtn = this.$element.find('[bh-collapsible-panel-flag="switch"]');
            collapsePanel(switchBtn, this.settings);
        };

        return Plugin;

    })();

    function init(options, dom) {
        var content = dom.html();
        //初始化头部
        var _html = getPanelHtml(options);
        dom.html(_html);
        var $block = $(".bh-collapsible-panel-content", dom);
        $block.append(content);
        dom.show();
        $block.data("height", $block.outerHeight());
        $block.css("height", 0).hide();
        addEventListener(dom, options);
    }

    function addEventListener(dom, options) {
        dom.on("click", '.bh-collapsible-panel', function(e) {
            e = e || window.event;
            var targetNode = e.target || e.srcElement;
            if ($(targetNode).attr("bh-collapsible-panel-flag") == "switch") {
                if ($(targetNode).attr("bh-collapsible-panel-role") == "expand") {
                    expandPanel($(targetNode), options);
                } else {
                    collapsePanel($(targetNode), options);
                }
            } else if ($(targetNode).hasClass("bh-collapsible-panel")) {
                var switchBtn = $(this).find('[bh-collapsible-panel-flag="switch"]');
                if (switchBtn.attr("bh-collapsible-panel-role") == "expand") {
                    expandPanel(switchBtn, options);
                }
            } else if ($(targetNode).closest(".bh-collapsible-panel-toolbar").length == 0) {
                var $parent = $(targetNode).closest(".bh-collapsible-panel");
                var switchBtn = $parent.find('[bh-collapsible-panel-flag="switch"]');
                if (switchBtn.attr("bh-collapsible-panel-role") == "expand") {
                    expandPanel(switchBtn, options);
                }
            }
        });
    }

    function getPanelHtml(options) {
        var panelClass = "bh-collapsible-panel";
        if (options.hasBorder) {
            panelClass += " has-border";
        }
        var _html = '<div class="' + panelClass + '">' +
            '<h3 class="bh-collapsible-panel-title">' + options.title + '</h3>' +
            options.tag +
            '<div class="bh-text-caption bh-caption-default">' + options.caption + '</div>' +
            '<div class="bh-collapsible-panel-toolbar">' +
            options.toolbar +
            '<a href="javascript:void(0);" class="bh-btn-link" bh-collapsible-panel-flag="switch" bh-collapsible-panel-role="expand">展开</a>' +
            '</div>' +
            '<div class="bh-collapsible-panel-content bh-collapsible-panel-animate">' +
            '</div>' +
            '</div>';
        return _html;
    }

    function collapsePanel(target, options) {
        if (options && options.beforeCollapse) {
            options.beforeCollapse(target);
        }
        var $block = $(target).closest(".bh-collapsible-panel").find(".bh-collapsible-panel-content");
        $block.css({
            "height": 0
        });
        var $card = $block.parent();
        setTimeout(function() {
            $block.hide();
            $card.removeClass("bh-card bh-card-lv2");
        }, getAnimateTime());
        var switchBtn = $card.find("[bh-collapsible-panel-flag='switch']");
        switchBtn.text("展开");
        switchBtn.attr("bh-collapsible-panel-role", "expand");
        if (options && options.afterCollapse) {
            setTimeout(function() {
                options.afterCollapse(target);
            }, getAnimateTime());
        }
    }

    function expandPanel(target, options) {
        if (options && options.beforeExpand) {
            options.beforeExpand(target);
        }
        var $block = $(target).closest(".bh-collapsible-panel").find(".bh-collapsible-panel-content");
        var $card = $block.parent();
        //给自己加阴影
        $card.addClass("bh-card bh-card-lv2");

        var height = $block.data("height");
        $block.show();
        setTimeout(function() {
            $block.css({
                "height": height
            });
        }, 1);
        $(target).text("收起");
        $(target).attr("bh-collapsible-panel-role", "collapse");
        if (options && options.afterExpand) {
            setTimeout(function() {
                options.afterExpand(target);
            }, getAnimateTime());
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
     * 这里是关键
     * 定义一个插件 plugin
     */
    $.fn.bhCollapsiblePanel = function(options, params) {
        var instance;
        instance = this.data('bhCollapsiblePanel');
        /**
         * 判断插件是否已经实例化过，如果已经实例化了则直接返回该实例化对象
         */
        if (!instance) {
            return this.each(function() {
                //将实例化后的插件缓存在dom结构里（内存里）
                return $(this).data('bhCollapsiblePanel', new Plugin(this, options));
            });
        }
        if (options === true) {
            return instance;
        }
        /**
         * 优雅处： 如果插件的参数是一个字符串，则 调用 插件的 字符串方法。
         * 如 $('#id').plugin('doSomething') 则实际调用的是 $('#id).plugin.doSomething();
         * doSomething是刚才定义的接口。
         * 这种方法 在 juqery ui 的插件里 很常见。
         */
        if ($.type(options) === 'string') {
            instance[options](params);
        }
        return this;
    };

    /**
     * @memberof module:bhCollapsiblePanel
     * @description 内置默认值
     * @prop {object}  defaults
     * @prop {string}  defaults.title - 大标题内容，可以是传纯文本或html
     * @prop {string}  defaults.tag - 标签html
     * @prop {string}  defaults.caption - 小标题内容，可以是传纯文本或html
     * @prop {string}  defaults.toolbar - 工具栏的DOM的Html
     * @prop {boolean}  defaults.hasBorder - 是否显示边框
     * @prop {function}  defaults.beforeExpand - 展开面板前的回调
     * @prop {function}  defaults.afterExpand - 展开面板后的回调
     * @prop {function}  defaults.beforeCollapse - 收缩面板前的回调
     * @prop {function}  defaults.afterCollapse - 收缩面板后的回调
     */
    $.fn.bhCollapsiblePanel.defaults = {
        title: "", //大标题内容，可以是传纯文本或html
        tag: "", //标签html
        caption: "", //小标题内容，可以是传纯文本或html
        toolbar: "", //工具栏的DOM的Html
        hasBorder: true, //是否显示边框
        beforeExpand: null, //展开面板前的回调
        afterExpand: null, //展开面板后的回调
        beforeCollapse: null, //收缩面板前的回调
        afterCollapse: null //收缩面板后的回调
    };
})(jQuery);
/**
 * @fileOverview 字符截断组件
 * @example
$.bhCutStr({
    dom: { //可选，当要显示文本的dom结构已经存在，选用此方法
        selector: '', //必选，截断文本所在容器的jquery选择器
        line: 0, //必选，指定显示的文本行数
        content: '' //可选，传入的文本内容（若文本已经加载到dom里了，则此项可不加）
    },
    text: { //可选，纯粹的对字符串做截断处理,使用该方式显示更多的处理自能自己处理
        content: '', //必填，传入的文本内容
        number: 0 //要截断的字符个数
    },
    moreBtn: {
        content: '', //可选，更多按钮的文字
        url: '', //可选，超链接所指向的地址
        isOpenNewPage: true //可选，当url存在时，该选项才能生效，默认是打开新页面
    }
});
 */
(function($) {
  'use strict';
  /**
   * 这里是一个自运行的单例模式。
   * @module bhCutStr
   */
  $.bhCutStr = function(data) {
    /**
     * @memberof module:bhCutStr
     * @description 内置默认值
     * @prop {object}  data
     *
     * @prop {object}  data.dom - 可选，当要显示文本的dom结构已经存在，选用此方法
     * @prop {$}       data.dom.selector - 必选，截断文本所在容器的jquery选择器
     * @prop {number}  data.dom.line - 必选，指定显示的文本行数
     * @prop {string}  data.dom.content - 可选，传入的文本内容（若文本已经加载到dom里了，则此项可不加）
     *
     * @prop {object}  data.text - 可选，纯粹的对字符串做截断处理,使用该方式显示更多的处理
     * @prop {number}  data.text.line - 必选，要截断的字符个数
     * @prop {string}  data.text.content - 必填，传入的文本内容
     *
     * @prop {object}  data.moreBtn - 可选，设置更多按钮
     * @prop {string}  data.moreBtn.content - 可选，更多按钮的文字
     * @prop {string}  data.moreBtn.url - 可选，超链接所指向的地址
     * @prop {boolean} data.moreBtn.isOpenNewPage - 可选，当url存在时，该选项才能生效，默认是打开新页面
     *
     */
    var bhCutStrDefaults = {
      dom: { //可选，当要显示文本的dom结构已经存在，选用此方法
        selector: '', //必选，截断文本所在容器的jquery选择器
        line: 0, //必选，指定显示的文本行数
        content: '' //可选，传入的文本内容（若文本已经加载到dom里了，则此项可不加）
      },
      text: { //可选，纯粹的对字符串做截断处理,使用该方式显示更多的处理自能自己处理
        content: '', //必填，传入的文本内容
        number: 0 //要截断的字符个数
      },
      moreBtn: {
        content: '', //可选，更多按钮的文字
        url: '', //可选，超链接所指向的地址
        isOpenNewPage: true //可选，当url存在时，该选项才能生效，默认是打开新页面
      }
    };
    //将{}, bhCutStrDefaults, data进行合并，然后将合并结果返回给options
    var options = $.extend({}, bhCutStrDefaults, data);

    return init(options);
    /**
     * 初始化字符串截断函数
     * @param  options
     * @return string
     */
    function init(options) {
      var $objArr = options.dom ? options.dom.selector : "";
      if ($objArr.length > 0) {
        $objArr.each(function() {
          /*生成随机字符串*/
          var guid = BH_UTILS.NewGuid();
          var $obj = $(this);
          //在该dom下添加一个零时dom来获取这个块的font-size
          $obj.append(
            '<div id="' + guid + '">' +
            '<div id="chinese-' + guid + '" style="display: none;position: absolute;">是</div>' +
            '<div id="lower-english-' + guid + '" style="display: none;position: absolute;">w</div>' +
            '</div>');
          var tempObj = $obj.find('#' + guid);
          //中文字符和大写的英文的大小
          options.chineseFontSize = tempObj.find('#chinese-' + guid).width();
          //小写的英文和数字的大小
          options.lowerEnFontSize = tempObj.find('#lower-english-' + guid).width();
          tempObj.remove();

          //获取文本所在dom的宽度
          var objWidth = $obj.width();
          var objText = options.dom.content ? $.trim(options.dom.content) : $.trim($obj.text()); //获得字符串内容
          var textLen = objText.length; //实际字符个数

          //按所有文本都是中文字符计算出的文字个数
          var tempComputeTextLen = parseInt(objWidth * options.dom.line / options.chineseFontSize, 10);
          //当内容的字符数比计算出的字符数少，则不做任何处理
          if (textLen <= tempComputeTextLen) {
            return;
          }

          var url = 'javascript:void(0);';
          var target = 'target="blank"';
          var moreStr = '';
          var moreText = '';
          if (options.moreBtn) {
            url = !options.moreBtn.url || options.moreBtn.url.length === 0 ? 'javascript:void(0);' : options.moreBtn.url;
            target = !options.moreBtn.isOpenNewPage ? 'target="blank"' : '';
            moreText = options.moreBtn.content ? options.moreBtn.content : '';
            moreStr = '<a href="' + url + '" class="bh-cut-str-more" bh-cut-str-role="bhCutStr" ' + target + ' data-guid="' + guid + '" data-full-str="' + objText + '">' + moreText + '</a>';
          }

          //更多按钮的宽度
          var moreTextWidth = moreText ? getTextWidth(moreText) : 0;
          //省略号的宽度，按一个中文字符的宽度算
          var ellipsisWidth = options.chineseFontSize;
          //去掉更多按钮和省略号的剩余宽度和一个字符的偏差宽度
          var canUseWidth = objWidth * options.dom.line - moreTextWidth - ellipsisWidth - options.chineseFontSize;
          var computeTextLen = parseInt(canUseWidth / options.chineseFontSize, 10);
          var computeText = getCutText(canUseWidth, computeTextLen, objText);

          $obj.html(computeText + "..." + moreStr);

          if (moreStr) {
            moreTextEvent($obj.find('a[bh-cut-str-role="bhCutStr"]'));
          }
        });
      } else {
        var text = $.trim(options.text.content);
        var cutText = text;
        if (text.length > options.text.number) {
          cutText = text.substring(0, options.text.number) + '...';
        }

        var url = 'javascript:void(0);';
        var target = 'target="blank"';
        var moreStr = '';
        var moreText = '';
        if (options.moreBtn) {
          url = !options.moreBtn.url || options.moreBtn.url.length === 0 ? 'javascript:void(0);' : options.moreBtn.url;
          target = !options.moreBtn.isOpenNewPage ? 'target="blank"' : '';
          moreText = options.moreBtn.content ? options.moreBtn.content : '';
          moreStr = '<a href="' + url + '" class="bh-cut-str-more" bh-cut-str-role="bhCutStr" ' + target + ' data-full-str="' + text + '">' + moreText + '</a>';
        }

        cutText += moreStr;
        return cutText;
      }
    }
    /**
     * [getCutText 获取截断文本]
     * @param  {number} width   可以使用的宽度
     * @param  {number} textLen 计算后文本的字符数
     * @param  {string} text    字符串内容
     * @return {string}
     */
    function getCutText(width, textLen, text) {
      //按传入的长度截取字符
      var cutText = text.substring(0, textLen);
      //截取后剩余的字符
      var surplusText = text.substring(textLen, text.length);
      //获取该字符串的宽度
      var textWidth = getTextWidth(cutText);
      //当字符的宽度小于理论宽度，计算偏差字符
      var diffText = '';
      if (textWidth < width) {
        var diffWidth = width - textWidth;
        //当偏差的宽度大于1个中文字符时，继续截断
        if (diffWidth > options.chineseFontSize) {
          var diffTextLen = parseInt(diffWidth / options.chineseFontSize, 10);
          diffText = getCutText(diffWidth, diffTextLen, surplusText);
        }
      }
      return cutText + diffText;
    }
    /**
     * [getTextWidth 获取文本宽度]
     * @param  {type} text 目标文本
     * @return {type}
     */
    function getTextWidth(text) {
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
    /**
     * [moreTextEvent 查看更多文本]
     * @param  {$} $moreStr jquery选择器
     *
     */
    function moreTextEvent($moreStr) {
      $moreStr.on('mouseover', function() {
        var text = $moreStr.attr('data-full-str');
        var guid = $moreStr.attr('data-guid');

        var $textContainer = $moreStr.parent();
        var containerWidth = $textContainer.width();
        setAndShowPopBoxPosition($moreStr, containerWidth, text, guid);
      });
      $moreStr.on('mouseout', function() {
        var guid = $moreStr.attr('data-guid');
        var $box = $('#' + guid);
        moreBoxToHide($box);
      });
    }

    function moreBoxEvent($moreBox) {
      $moreBox.on('mouseover', function() {
        $moreBox.data('flag', 'show');
      });
      $moreBox.on('mouseout', function() {
        moreBoxToHide($moreBox);
      });
    }

    function moreBoxToHide($box) {
      $box.data('flag', 'hide');
      setTimeout(function() {
        if ($box.data('flag') === 'hide') {
          $box.removeClass('bh-active');
          setTimeout(function() {
            $box.remove();
          }, 250);
        }
      }, 150);
    }
    /**
     * [setAndShowPopBoxPosition 设置与展示气泡框的位置]
     * @param {$} $element
     * @param {number} boxWidth
     * @param {string} content
     *
     */
    function setAndShowPopBoxPosition($element, boxWidth, content, id) {
      var elementPosition = BH_UTILS.getElementPosition($element);
      var windowHeight = window.innerHeight;
      var halfWindowHeight = parseInt(windowHeight / 2, 10);
      var windowScrollTop = window.scrollY;
      var $content = '<div data-flag="content">' + content + '</div>';
      var frameHtml = '<div id="' + id + '" style="width: ' + boxWidth + 'px;" class="bh-cutStr-popBox bh-card bh-card-lv2 bh-animate-transform-fast bh-animate-scale">' + $content + '</div>';
      var $frameHtml = $(frameHtml);
      $('body').append($frameHtml);

      //默认展开的起点是右上角
      var boxStyle = {
        left: elementPosition.right - boxWidth + 'px',
        top: elementPosition.bottom + 'px'
      };
      var boxOriginClass = 'bh-animate-origin-TR';
      var contentHeight = $frameHtml.outerHeight();
      var maxHeight = 0; //更多展示框的最大高度
      //查看当前位置高度，辨别是上部还是下部的可用空间较多
      var canShowHeight = 0;
      var diff = 8; //留出弹框距离页面的边距
      if (elementPosition.top - windowScrollTop > halfWindowHeight) {
        //当上部有更多展示空间的处理
        canShowHeight = elementPosition.top - windowScrollTop - $('header[bh-header-role="bhHeader"]').outerHeight() - diff;
        boxOriginClass = 'bh-animate-origin-BR';
        maxHeight = canShowHeight > contentHeight ? contentHeight : canShowHeight;
        boxStyle.top = elementPosition.top - maxHeight + 'px';
      } else {
        //当下部有更多展示空间的处理
        canShowHeight = windowHeight + windowScrollTop - elementPosition.bottom - $('footer[class="bh-footer"]').outerHeight() - diff;
        maxHeight = canShowHeight > contentHeight ? contentHeight : canShowHeight;
      }

      boxStyle['max-height'] = maxHeight + 'px';

      $frameHtml.css(boxStyle).addClass(boxOriginClass);
      setTimeout(function() {
        $frameHtml.addClass('bh-active');
      }, 10);
      moreBoxEvent($frameHtml);
    }
  };
})(jQuery);
/**
 * @fileOverview 流程提示条
 * @example
$control.flowState({
    width: '100%',
    flowStateData: [{
        content: "提交成功",
        status: "success",
        statusDescription: "成功",
        popHtml: "<div class='bh-flowState-time'>审核时间：<span></span></div><div class='bh-flowState-suggestion'>审核意见：<span></span></div>",
        isShowPop: true
    }, {
        content: "审核中",
        status: "operation",
        statusDescription: "进行中"
    }, {
        content: "审核失败",
        status: "fail",
        statusDescription: "失败"
    }, {
        content: "审核未开始",
        status: "not started",
        statusDescription: "未开始"
    }]
});
 */
(function($) {
    /**
     * 这里是一个自运行的单例模式。
     * @module flowState
     */
    $.fn.flowState = flowState;

    /**
     * @memberof module:flowState
     * @description 内置默认值
     * @prop {object}  defaults
     * @prop {string}  defaults.width - 流程提示条的宽度
     * @prop {object}  defaults.flowStateData - 流程提示的步骤的参数的集合
     * @prop {string}  defaults.id - 流程提示的步骤的id号
     * @prop {string}  defaults.content - 流程提示的步骤的主要内容
     * @prop {string}  defaults.status - 流程提示的步骤的状态，成功：success; 失败：fail; 操作中：operation ; 未开始： not started
     * @prop {string}  defaults.statusDescription - 流程提示的步骤的状态的描述，成功，失败，审核中，还没开始（为空）
     * @prop {boolean}  defaults.isShowPop -流程提示的步骤是否展示气泡弹窗
     * @prop {string}  defaults.popHtml - 流程提示的步骤展示的气泡弹窗的dom元素,dom元素的样式需要自己写
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
        /**
         * 重置流程提示步骤的状态
         * @method resetFlowStatus
         * @param {object} 需要重置的步骤的参数集合
         * @prop {NaN}  options.index - 需要重置的步骤的id，从1开始
         * @prop {string}  options.resetStatus - 需要重置的步骤的状态
         * @prop {string}  options.resetStatusDecription - 需要重置的步骤的状态的描述，成功，失败，审核中，还没开始（为空）
         * @prop {boolean}  options.isShowPop -需要重置的步骤是否展示气泡弹窗
         * @prop {string}  options.popHtml - 需要重置的步骤展示的气泡弹窗的dom元素
         * @example
        $control.flowState("resetFlowStatus", {
            "index": 2,
            "resetStatus": "success",
            "resetStatusDecription": "审核成功",
            "isShowPop": true,
            "popHtml": "<div class='bh-flowState-time'>审核时间：<span></span></div><div class='bh-flowState-suggestion'>审核意见：<span></span></div>"
        });
         */
        resetFlowStatus: function(options) {
            options = $.extend({}, {
                index: NaN, //元素从1开始算起
                resetStatus: 'success', //状态为成功：success; 失败：fail; 操作中：operation ; 未开始： not started
                resetStatusDecription: '成功',
                isShowPop: true,
                popHtml: "<div class='bh-flowState-time'>审核时间：<span></span></div><div class='bh-flowState-suggestion'>审核意见：<span></span></div>"
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
    // 如果当前的元素的index为0的话就加一个96的做编剧，如果是最后一个话就加一个-96的做编剧
    function openToolTip(data, index, length) {

        var left = 0;
        var toolTipDiv = ($('.bh-flowState-box')[index]);

        if (index === 0) {
            left = 96;
        } else if (index === (length - 1)) {
            left = -96;
        }

        $(toolTipDiv).jqxTooltip('destroy');

        if (data.isShowPop) {
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
    // 除了成功的时候，横线有颜色，其他时候都没有颜色
    function getLineStatueClass(data) {
        var lineMap = {
            'success': 'bh-flowState-line-succes'
        };
        return lineMap[data.status || data.resetStatus];
    }
    // 获取reset之前的circle和状态说明文字的样式
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
    // 获取reset之前的横线的样式
    function getLinePreClass($circle) {
        var preLineClass = "";
        if ($circle.hasClass("bh-flowState-line-succes")) {
            preLineClass = "bh-flowState-line-succes";
        }
        return preLineClass;
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
        var linePreColor = getLinePreClass($(lineEle[index]));
        $(statusEle[index]).text(options.resetStatusDecription);
        if (options.resetStatus === 'success') {
            $(boxEle[index + 1]).addClass('bh-flowState-prev-success');
        } else {
            $(boxEle[index + 1]).removeClass('bh-flowState-prev-success');
        }
        $(circleEle[index]).removeClass(elePreColor);
        $(statusEle[index]).removeClass(elePreColor);
        $(lineEle[index]).removeClass(linePreColor);
        $(circleEle[index]).addClass(resetCircleColor);
        $(statusEle[index]).addClass(resetCircleColor);
        $(lineEle[index]).addClass(resetLineColor);
        openToolTip(options, index, circleEle.length);
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
        if (options === true) {
            return instance;
        }
        /**
         * 优雅处： 如果插件的参数是一个字符串，则 调用 插件的 字符串方法。
         * 如 $('#id').ProgressBar('doSomething') 则实际调用的是 $('#id).ProgressBar.doSomething();
         * doSomething是刚才定义的接口。
         * 这种方法 在 juqery ui 的插件里 很常见。
         */
        if ($.type(options) === 'string') {
            instance[options](params);
        }
        return this;
    }



})(jQuery);
/**
 * @fileOverview 页脚组件
 * @example
 $("#pageFooter").bhFooter({
    text: "版权信息：© 2015 江苏金智教育信息股份有限公司 苏ICP备10204514号"
 });
 */
(function ($) {
    /**
     * 定义一个插件
     */
    var Plugin;

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


    /**
     * 页头组件
     * @module bhFooter
     * @param options {object} 初始化参数
     * @param options.text {string} 页脚文字
     * @returns {*}
     */
    $.fn.bhFooter = function (options) {
        return this.each(function () {
            return new Plugin(this, options);
        });
    };

    /***
     * 插件的默认值
     */
    $.fn.bhFooter.defaults = {
        text: ""
    };

    function init(options, dom){
        var _html = getFooterHtml(options);
        dom.html(_html).attr("bh-footer-role", "footer").addClass("bh-footer");
    }

    function getFooterHtml(options){
        var _html = '<div class="bh-footer-content">'+options.text+'</div>';
        return _html;
    }

})(jQuery);
/**
 * @fileOverview 页脚浮动 使用的元素必须包含"bh-role='bhFooterAffix'"属性
 * @example
    $.bhFooterAffix();
 */
(function($) {

    /**
     * 这里是一个自运行的单例模式,使用的元素必须包含"bh-role='bhFooterAffix'"属性。
     * @module bhFooterAffix
     */

    // 页面滚动，使元素块变浮动，一定要在页面数据加载完成之后才能初始化页脚
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
    /**
     * 当页面的内容发生变化，重置页脚的位置
     * @method resetPosition
     * @example
        $.bhFooterAffix.resetPosition();
     */
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
            footerStyle = 'left:' + positionData.articleOffset.left + 'px;width:' + pageWidth + 'px;position:fixed;bottom:0;top:initial;display:block;z-index:1000;';
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
                        "display": "block",
                        "z-index": 1000,
                        "background-color": "#fff"
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
        if (positionAndHeight.windowHeight + positionAndHeight.scrollTop >= positionAndHeight.bodyHeight - 32) {
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

        // var bodyHeight = $body.get(0).scrollHeight;
        var bodyHeight = 0;
        var OsObject = window.navigator.userAgent;
        if (!!window.ActiveXObject || "ActiveXObject" in window) {
            // if (OsObject.indexOf("MSIE") > 0) {
            //     bodyHeight = document.documentElement.scrollHeight;
            // }
            bodyHeight = document.documentElement.scrollHeight;
        } else {
            bodyHeight = $body.get(0).scrollHeight;
        }
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
/**
 * @fileOverview 表单大纲
 * @example
$.bhFormOutline.show({
  insertContainer: $container, // 要插入的容器
  offset: { // 大纲的偏移量 { top, left, right, bottom}
    right: 16,
    top: 30
  },
  statistics: true, // 是否对表单输入进行统计
  affix:false // 大纲选中项是否随页面滚动改变
});
 */
(function($) {
  $.bhFormOutline = {
    /**
    * 初始化并显示表单大纲
    * @method show
    * @param options {object} 初始化参数
    * @param options.insertContainer {jQuery} 必选，要插入的容器
    * @param options.offset {Objec} 可选，大纲的偏移量 { top, left, right, bottom}
    * @param options.statistics {boolean} 可选，否对表单输入进行统计
    * @param options.affix {boolean} 可选，选中项是否随页面滚动改变
    * @example
    $.bhFormOutline.show({
        insertContainer: $container
    });
    */
    show: function(options) {
      var formOutlineDefaults = {
        insertContainer: "", //必填，要插入的容器
        width: 0,
        className: "",
        offset: {}, //可选，大纲的偏移量{ top, left, right, bottom}，默认是右对齐
        scrollOffsetTop: $('header[bh-header-role="bhHeader"]').outerHeight(), //可选，锚点定位的位置的top偏移量
        statistics: true, //可选，是否对表单输入进行统计， true默认进行统计,
        affix: false,
        bottom: null,
        customClass: ''
      };
      options = $.extend({}, formOutlineDefaults, options);
      formOutlineShow(options);
    },

    /**
    * 隐藏表单大纲
    * @method hide
    * @param options {object} 参数
    * @param options.insertContainer {jQuery} 可选，要插入的容器
    * @param options.destroy {boolean} 可选，，隐藏时是否要删除该大纲，默认删除
    * @example
    $.bhFormOutline.hide({
        destroy: true
    });
    */
    hide: function(options) {
      var formOutlineDefaults = {
        insertContainer: "", //可选，要插入的容器
        destroy: true //可选，隐藏时是否要删除该大纲，默认删除
      };
      options = $.extend({}, formOutlineDefaults, options);
      formOutlineHide(options);
    }
  };

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
    formOutlineHtml = formOutlineHtml.replace("@content", formOutlineContent).replace("@style", _style)
      .replace("@outlineGuid", formOutlineGuid).replace("@customClass", options.customClass);
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
      var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;

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
        if (offset && (offset.top - scrollTop > 0)) {
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
      'TOP_POSITION_TRIGGER_MOVE_DOWN_DISTANCE': 100

    };

    var maxOutlineTop, minOutlineTop;

    function resetOutlinePosition(outlineItem) {
      setOutlineToFixed();

      var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;

      //当前选择大纲项距离浏览器顶部的距离
      var currentItemToScreenTop = outlineItem.offset().top - scrollTop;

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
      setTimeout(function() {
        $(window).trigger('scroll');
      }, 30);
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
    var _html = '<div class="bh-form-outline bh-animated-doubleTime bh-fadeIn @customClass" bh-role-form-outline-fixed="bhFormOutline" bh-form-outline-role-outline-guid="@outlineGuid" style="@style">@content</div>';
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
    var Galleria;
    var DEFAULT = {
        width: 900,
        height: document.documentElement.clientHeight  // 轮播图片高度的自适应
    };

    var BhGallery = function(options) {
        this.options = $.extend({}, DEFAULT, options);
    };
    $.extend(BhGallery.prototype, {
        show: function() {
            var _this = this;
            var $template = $('<div class="bh-gallery"><div class="bh-gallery__backdrop"></div><div class="bh-gallery__main"><div class="bh-gallery__gallery"></div></div><div class="bh-gallery__close iconfont icon-close"></div></div>');

            $('body').append($template);
            var $main = $('.bh-gallery__gallery', $template).css({
                width: _this.options.width,
                height: _this.options.height
            });
            Galleria.run($main, this.options);

            this.resizeGallery($main);

            /**
             * niceScroll 会有一定的延迟,没有具体研究,感觉上是等页面重新渲染完成后 niceScroll 会重新进行一次绑定
             * 所以立即执行会不起效,延迟执行
             */
            setTimeout(function () {
                $('body').getNiceScroll().hide();
                // $('.bh-gallery__main', $template).niceScroll()
            }, 1000);

            $('.bh-gallery__close', $template).click(function() {
                $template.remove();
                $('body').getNiceScroll().show();
            });
        },
        /**
         * 因为如果图片查看器的尺寸超出了尺寸的话需要出滚动条, 吐过采用 css 居中的话无法根据情况显示位置
         * 并且因为是绝对定位居中,无法出滚动条,因此采用 css 计算来居中
         */
        resizeGallery: function($gallery) {
            var windowWidth = $(window).width();
            var windowHeight = $(window).height();
            var galleryWidth = this.options.width;
            var galleryHeight = this.options.height;

            if (galleryWidth < windowWidth) {
                $gallery.css({
                    marginLeft: (windowWidth - galleryWidth) / 2
                });
            }

            if (galleryHeight < windowHeight) {
                $gallery.css({
                    marginTop: (windowHeight - galleryHeight) / 2
                });
            }
        }
    });

    $.bhGallery = function(options) {
        Galleria = window.Galleria;
        if (Galleria === undefined) {
            $.getScript('http://res.wisedu.com/bower_components/galleria/src/galleria.js').done(function() {
                Galleria = window.Galleria;
                $.getScript('http://res.wisedu.com/fe_components/galleria/standard/galleria.wisedu.js').done(function() {
                    if (Galleria === undefined) {
                        console.error('please include Galleria lib');
                        return;
                    }
                    if (options.showType === 'page') {
                        Galleria.run(options.selector, options);
                    } else {
                        (new BhGallery(options)).show();
                    }
                });
            });
        } else {
            if (options.showType === 'page') {
                Galleria.run(options.selector, options);
            } else {
                (new BhGallery(options)).show();
            }
        }
    };

}(jQuery));

/**
 * @fileOverview 页头组件
 * @example
 $('#pageHeader').bhHeader({
        "logo": "http://res.wisedu.com/scenes/public/images/demo/logo.png"
    });
 */
(function ($) {
    var Plugin;
    //全局变量
    var space = {
        nav : [],//缓存菜单数据
        //默认用户头像的图片，用于当用户图片出错时的展示
        defaultUserImg: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAIAAABMXPacAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAFnFJREFUeNrsXQmUXFWZfve+rV5VdVXv3emk0xAJCZ0ACQmEBCIBgxgGIaARUVQE5zijOHMcnZkz5+iMjuegM8eFEUdHiQgqjjIgBySAwawCWYidQCfpTkIv6aV6qX1/673zv6rqSlV3JSTdVV3Vqbqnc5KuvHrL//3L9//3vv+iO/90kqmM4g1cEUEFgAoAlVEBoAJAZVQAqABQGRUAKgBURgWACgCVUQGgbAY35x+g5yB/bCfr6kZyCH6lLE8lJ6mdb8xbQmoXGPOvoPa6CgAzsNDACHb3se5+5BtGaswUsaXKlG/rVUbT+yw7/kfc84scX+t9K/k3tVVryzYq7/8MgFEB4LwHMVhXF3/ide7kmxhEL4dzHIOQ0fg+duzdc58JRQPCwWf5rl2xe76hL7mxBJ8VzdJ8AKUMJQxmz30UeBK+azfXtRcAyPP1eUv0wZ8YbSvK1wLEXVtJ82Kt/WZQ3iwnExzDYz1czwGu7y+m3AkpiKJpsvX5f4984ddUsJYlACB0QbI+/RWIikbzEnDNIBEU9WPPAPYPo3hoNsLJeB//9qvqtfeUqQWoK/9K/PNT7HAX/BTrafnD29TVd08ywXLJA4AOxjd//T3DQGHVbegoGFz5JmJa+4bop35A6lqL9ri6ij2nSwoAdsmnvzSrDLO+Tbvmw6SmBekqUKPcFLOgN9C8GDI1HBxlEGZKICCjIi5LsbzyKESFWb4o8FFEDMbQwCVqy26WN34RGEG5uKAs6W//kfj6r4qgcZoM0jf/EfEKB561PfUwigfLCwAU9lp/84/i7p+bqVnRXfDQMcsfHysjAPjO7fafPsAf/VPphEGh4w/Y3X/x5wFc7yHh9V/z3XtKrRgA1IjvfE255a8vIgCIASSHcgJSIjjkZvsPg8pzPQeZUh1c71sXGwCWF78NWQ+jxACAUvD17xEJxnuRHKEW+8USAzhBXfcJFPbh4FjpS9/kBbEACo1fVEHYaFkafegnkHCd/aHzeWlCiKYqiiLruj49k8Vhz8XGgoyWK6Kfe1xbetPkVEiwqtffmy97NwwjHo/xvLBo8RVXrri2vrFpejDMTkV2tlkQWEDs049yJ9/g336VHT1lTmO1Xqmu2YLksHDgmZnmtJQqcry6tv5Dt2xZu35jY3MLx/HRSGjfn3e8+sIzfp8nAY/O8Tx8fj5c6KKlofrlN8BP5idmBYLSGZ1T18DtrNvwwbvv/eyC1jZN10DrCTFsdsemu+5dtWY9ABAOBU51dXYcfMM1dFoQRMyeqxCLiH7RApDD8XkGpuHlMU45THAyDkf1vZ/+m/Uf2EQpicWiGR5JN+J6TV19fUMTwvjatTfdvvm+nX98Ydvzv1VVGTzVOQyqnAAAbnohrgb0vbqmLh6NAAzg8cHdf+7hf1p02VL4N80lOEPXDSal0Vab/SOfeOh9l7f/9L8eAZs4GwYUF0kUxeF9avQCHL0ib7j1jiXtV8ng8uMxUOqvfv0/2hYtBsWn56G2YBOxaGTF6rV/++WvWSwSBO2zUecyAgCd38x7IszKm+782P0PfWl48LQs6x/YtPmLX/23Kkc1fH5BVwQMrl51/eZ7H9C03MGWitYyAoCy52Xvcjy28fbNn/rc34VCQZ9nbPOW+x74/D8ghM8mxHOPeCy6cdPmpctWgEnlAsBWTgBIzrOp/Bl5gbdZt+GTDz5MKA34POCF7nvgC4Y5pklXIH4IomXTnVtYzE72XSxHJUcZAUAaL82ZUp2JEarS2rboM5//MstxkOI6nNW3fXgLiB6I5oxCjyIvX7G67dLFmqZlW6TAWKrKCAD90lWT1oaoirJk2dW33HYniB5UFbKn+x96uLauQVNV+NVZXQtk5qzx80KMQLLaV11/IzGyAGAEiQpSGQFgtK0gzqZMz8Pz/EfvexAYDkYIyM7Nt374ypVrIAakD6B54umGri2/erXFaicZRIBaHbSsWJD5tCyf6XCuuPKay9uvsjucosXaNG/+Hfd8Qs/2EnkzPl1valnQ2NSSaU+kuqW8aCiDMOUtmRaw8tq1kOiCrxctlo2b7q5raILkqyDhhxCb3TG/tc3IKNgZC5YxRRpFWxVhOJrSErFabZCpJsnlZZe3r33/RlWRC4g+Qi0L2gD31A1AtnHJqrIDAC++LumFKTEgxtbU1RNgOZoG0odfZx5vz+0CG5vnAxCm9A1DbFtOL7uuvACoYsn72y8DJwPOx0iQHIvFapIfjl+6fEWBnM8Z8RPqrK6BsJ+ocyirl7XfWquXFwCfrA5tubyhuWUBOGIKLshu5wWREMoLgihaaIELk4QSm80OwQayCoskrV+z5jMOXx1rlAsAAqLtfBTi7crV61RNBXGD2FmzWE8nJcOFsgBKRUnieEFV1MuWLFt02VKkK5fwarkAIGFiwwR0/4YNH6xyOEHxWXZW16wn0g4BLgqXhpAD8MMnzvKxAPN1MQYB52m7dPGaG26W5dnQ+kl3gDEL4XfeggUrr10HWYhZDWJouQAgUxw0cLL4c/td99bVV5mVfTKrq1cSJVVt7Y0fqKmtTzIujaJyAUClaEAz004wgpbWtjvuvi8cDEIwQLP35hDSNRWI7w0336Yl1B+G1yinGbH98dTshyzLt95xz9JlV0VCQYTwbKk/E49H19x4y7z5rckFLH6D7dHKqRRxRJbGdS5ByYkgWDZt/jgQUDpba+gg4bDbHetvvi1dbjoQt8YILiMAFIp2x1ILsyD/NVl54el/JgBVzmqHsyaZissUvRYtzmRAMUsRu6L2gMGmJTLLRAguly5HvxapGtO5sgMgTPAfIg6m2MOl88W9jWL2C9oZtZ9QxSLeAPCxx/21xfL+xQcAqPePfPUQkIuSAh2KW7/rbThVVA1git4xC/gfSOGN2GwvCTEoejJYc1yxFN0HlkTLsj2zDoDbYIvreUoLAPADQxo/m1fskK0qRRUAUkOnaO8sGgFkIRD/mdIYpdI18fWYLTRbPmFP1D6qcxUAskaIsDtmJR2FC71QAvlHyQEAY3ukylP4kuQLYUfQYCsA5M6NIS0yChkbuxTLjpLx/iUHAIxjiuWZkLNAJ48Q/PNArU5RBYBzjW0Rx64CKCkk2z/z15VO7C1dAGD8MlhzLN856m+CNR2yVIIPW4oAaBT92Fc3rOctNXsx7HglUsWU5CjR7ulBwj7qbfDng66A6J8JVTOlOkq3ff2Izj3mq5fp9O+QRcwrUcfTwRqmhEdJ7x9wUhW/7wUM0DRarRKEnvDXPB2oZkp7lDQAmDK9Cu/yB6mhI3zet4oQj8hej3A4YLFqhmAQtkhvwZ/PKC1a5sCIiasipSIhPKWYUBvVORoOGSGLvVaUrImlK5RJr+2nkyRv/qHEiATdcsDpjDuasLnoSkdIYXEEISKJfjigAkDOUcXiuxoc/mBs0B2QNZ3D2KDYwakSSzSNqH43HxUtVjvHC2ANKLG6P3MtFzWn2omhqbFIiGqxRl7k5JSosUEkQtqctram6o6YcjQiVwDIMVZVSVaOrWpw1lVJ/WOB8WBEBwvAGocMgwGJM5qqwA9KjJTss2ODudIhsdYBwHNgRUAG5L2EkipJvKSxpsFpBVe0ksW9cTVmkAoAWaOBMZbVOEG+OmirwLcvbGgK2U6MhWuoi2WIkYhVaX2nie0gaHaHk5RFJI6B/7Nj1WK2rLNdUl+9oN7BsayRwMbKstfXOne6/ZUgfGb4D+9TXnueNQeXEB81CK1zWK9Z1FzX2CIzFpZqk/09g1LynhiZ1gBxgGf0thrx6kXzLm2uAY9lTKwCkmxVpPvI8P9trVhAakROHj39xPdOhoNIjnzy4X9mOS75/iJgIGCqVi86ZW1oDB+vjQ8ghhD0HqkZHIOoEeNqRx3L6qRmAEU/422Q1W47sPOVx7/zNTkWYRCe/9EHi/74s909fdIIH36z74nvETmGWdx95K2Az7ti7U1gB+lla6DLhBWDUmuUrxX1CPwkuc5ZaKtuYGHU3u6quUYRauC7aR8FJmK12fa+8sLPHvkXRY5DJI/2djMsW7V4eZkCoJzq9D7/i6GXfmskFoiDgEAopzoPe8ZcK9dt4Hj+DAYMZMNE5asBBh0JkhbgqUJNPooyRA90kwakhYM114VsC5HpW0kGPUUWq23nC7974j//1TCMdM+m4PHDdXarrb7ZEKVyAuD0Cc/vnxh7+XfyuAsUFFwEmhATz/M9Xe+MDQ+uXHsTLwiZ3QTAt4DTiFiaQtI84KWSHkoDALKWeedw9Sq3ox3MBewAZSUHyCJZtz/39JPf/xZ8I7OBH8dx0d6u0IGdDjkkNTTrkv1iBgBRah3ti7z8dN9zT0VHhhJ0BQg9NnQjK4kVxN6uztGhgVXrb4F4MOnNGWzuMWYJWBfqhuFUx8AOMCUh1tlbv0ER6xKin5xmQdTd+YdnnvzeNyGJgxOe4ayUEQUgR1hVFPepLv/+nbWYWOYt1HnxIgRACnnkbb/q+t/HPf09IPp0+73kXzohmToLGPSfOOb3uK+58RaM8KT3BkyPhPBpnzyfuHgWcYh0yvWKo82Cc1B7yWbft+Plrd/5mvmoXBbjAGokCHySSsH96Lo+euxto6ujYcFCrbrxogLAOdjd9dg3h453wnMC05z0KpLJEaf0YIJ40HP8bTkWXbHuJsikJrU0hK90jUUaUKjFoikMtzPY7Kyps/J40hp30Wo9+U7Hf3/jK5oiQ1DJStkoNbuJcmymp4J7iwQDowf2LGxp1prbLhIAqt49/NYPv6XE4+Dfc74FBtIkhBoGzfzPREzmT7x9SLRYlq9am9k5RRCEU93Hf//U1iPH3t33Ts+rHQP7Dx93D/RcsfwqjjtTdgMz8o6NPPb1v/eOjwqiZUq9DolCjvsBFQFsXB37Fy2YrzYtnPN5gMP17l9+/B1iGOd4ExhEBsqo68ZUGYHgnt36WPPCS9Zs+FB8ojkoOPJTx4/2Hdk/bLUnUKOY6IHhvjvu2VJb38Ak+q+CHOGiT33/W4O9p8AL5dA7FuOzlFfN7xLy1tZHr/tqXaj1ijmcCVvkcPfW72qa9p7vYcMzQzScWjPG5rvU5Fc/eGRkoA80egIwMtTfJ1gsoMJWkZNEHv4NgTTo96VlKlik7c/9+tDeP+WUfhLyc0wxJDCgJ578oaRE5zAAxusve0dHOO69jQyZjJDNKREgo+7R4d/95Ltm8WfiCKfTaWSxI3qmTASPxAv+od5tTz/Oi+JZ5Gu6+3PPEcD9eEZG9DdfnasA2CK+k9tf5Pnzmlinpk9g04YyqT0Z5FD7dv3x2O4Xax12g1BwVp+9/2PzGhvSLdJlWVm1csXSpUsVVSOUWdpkP7jtN+7x8TTlpxktKMxNLfnzcrw8z/XueEkq8E5nhQJA79wfjUYxvoDzg0+RJNOziEAPTYKO08EAs/yzv9x6qRCtr7LEZOW6ZZfcv+WuWFxOVUYR+uzHN9skEaxk1QKHNTLy0kvbLJKU9ic8y4pmHxYBTi9J0vkYZfKLwUAA93TOPQBYQx89uPeCpJ+6GyA/HAfyNylTxtdBdse7T+7e/uraVtuiWgmS4gc+/pFFba2aroPWr1zevnH99VUsWdPqmF/FvbZrz8joeFrKCUKVOCfHgfO5oMll+K7n0BuokC8wFwQAi3/Uc7pvej1QwLGAS4nHZS17EwYIyM+9+BKIb0WLTUBMTU31xzbfDkdCkL/x+tUA2NIGS6Pd9Dlv7NufyS8NwzBPKCvT2NUBrNDd3SnGI3MMANLXpSjKNHo/gD+RQaUT3TPQZAcldhw+0tPTy0zMgzmr7HA8XMXt8aaPBzy6urr5KV7e3GjDREu/oJsCI47FYni0fy4BgCnxHT00vc4bCCNwFDlb+YM9+fz+nXv2pj8JhSOme2HZvsHhdIx1jYyOjI3l9PKJXBdf6AIJQE7pPzGXABDikfFTJ6bZg4ma3ONswQNkvWPX7vSv0VgcUGY5dnhkLBJNtXh1uVwBfyDn1QHaadwVwObv7ixcGMg/AKxnWI5Gpt17xiQtPJdTT0VRPPL2O8PDrhQAcRkl6qnBUHhkLLUJVW9//9l8feK0dBr3ExgaEKPBOQOA4eqH+DltAJJlMnPdSS4v5Ha739x/IPkreGez8RJCkUh00DWa/HBwcIhMkTJ8ANqf85znA0AkEubD3rkBAGJo8NSxaRDQSYmxYPaUzA3P7r1/TgEQjyen4wHv04OpjcqHXa5cbsT0P9NeHmdSg74TcwMAVo4GB/tn2PuKJioBEDBzBBhBONTRYeq+GQPk5HXgcj39qV2BRkbGJjn6VJo9E52gND58GhVmfWO+AYhHQl7PDC0gpbO5CgbA9wcGhjqPHmPMHR7iyfVxcLn+AdMCVFUdBQqUDQBKhN8ZyQjCTP+72NDmAgDjw/oMAkCW106UjKdyElmOv/7mPhMAOZVqwJGj425wRBAM/AH/pG8lZoEwnRkAIfeYKEfnAACqZyRfbZ+TRjDV7oF3Hjj4lqpqOlwIJYMzHnV7IC3w+rwxk5uiTCAzp72m/1yqynhH5gIAI4P5OlXSCKZGAlEQj3d39/T1EUKTpR3Q0Gg07hp1+7w+8EuZFpCsPM9YFRAk2Mg/XuoAQLYSdA3OPABkGoEARjCFjHq93jf3H8xYoYsUVR0Ydnm83swSyEzY52Qxsaz/5LFCAJDPKUlRjUe97jy2/wQJmstFMc6efmFA93ft2SsrZ1qNGsToPT3EG/GsFaKI4dg8vZxBacwzJhHDwGzpAmD4xrV4LL/9V1Eig9VB1tlcqOPwEc7RmLY2juV6+wc4LYwnmo8m1R/0Py/yh4Q7NuZqjIcNW3XpAsDpKrhgjsvnOZMsHozAXECHsrJTgbUilk9W7kDUPX2neS2UjhnJ5MsEMB8IQLAJB4OCpqil7IKwf7wQ3SeTdMgwsp+dGERT8MROQKDsQyMjTMyXngRNsU+ar3tAhBBj5DRT3VS6QTg0PJDHCDwpEkylQwBABtthw+Gw3+dLHkbPPss/7aGDDQbzXxHKp7z0WKRA/VdzJcaI6iqTrhKjxBa2Zh00QUzzGH4zwlF8qL90ATBXQgW8BXoBMWkEWeZlvg2pU5B4Ws8n1jcmDubywj6z6C/GweEBRIwSBQBpqhzw4YK1oE/SoazJMgpeWZ2Yi0TUBIBOhN/878cAYSDq94iaXKIAmO+HBgOF2wOAJqjOpH3h6ZkwQCmZ8D+JZYeFsEU9HmcC7hIFwIKoHIsWdBOGKdWhZBgwEtMQlCaqlWbxh+UKcRfJCXpOLVUL4GMhpsDbkEyuDiXDgKEn346nqWW5iMsf+5xyA5QZHShRANSAbxZaAKTmtjLCABgBmJ0JAyEp9okLFocQDo+6ShSASMDPZPcOKJQRcJnTW4joZhigZjSmCEKEYClcZw7zPfygm83rCom8AWAVOEVRmFkwAnOG68ye5GAB1HzBw9wVEfEWhpOYgm1IBf4tOjLE5pUI5Q0ADrIwZjZGws9wyXfqU97fUAEAc92VaKW4gK+cIIwDPr+NpaUIgBosYBIw1Rlz5qY/Ka9kKDGzoRArYF4q7EJahFRV5fz5ZKJ50xc1XKilSznKG5RyiNHMl8uIWSZTomYTA6sDYjFWwzSjn1DejU/VdBwLliIAUa976huQ+UpBc0YCQeCVZHkYCCjCvCDyehhyA6aQ+5HJqmKL5bMk9/8CDACwy99BIeOUywAAAABJRU5ErkJggg=='
    };

    /**
     * 页头组件
     * @module bhHeader
     */
    $.fn.bhHeader = function (options, params) {
        var instance;
        instance = this.data('bhHeader');
        /***
         * 判断插件是否已经实例化过，如果已经实例化了则直接返回该实例化对象
         */
        if (!instance) {
            return this.each(function () {
                //将实例化后的插件缓存在dom结构里（内存里）
                return $(this).data('bhHeader', new Plugin(this, options));
            });
        }
        if (options === true) {
            return instance;
        }
        /***
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
     * @memberof module:bhHeader
     * @description 内置默认值
     * @prop {boolean} openTheme  打开换肤功能，默认false是不打开
     * @prop {boolean} showAsideNav  显示左侧边栏导航按钮，默认false是不显示
     * @prop {string} logo  logo图片路径
     * @prop {string} title  页面名称
     * @prop {array} icons  右侧的icon列表， 需传入的是icon-xxx
     * @prop {string} img  右侧的小图片路径
     * @prop {boolean} isNavHide  隐藏头部菜单，默认false不隐藏
     * @prop {array} nav  头部菜单
     * @prop {string} nav.title 菜单名称
     * @prop {boolean} nav.active 该菜单高亮
     * @prop {string} nav.href 该菜单的链接地址
     * @prop {boolean} nav.isOpenNewPage 在新页签打开
     * @prop {string} nav.className 自定义样式类名
     * @prop {array} nav.attribute 给该项添加属性
     * @prop {string} nav.attribute.key 给该项添加的属性名
     * @prop {string} nav.attribute.value 给该项添加的属性值
     * @prop {boolean} dropMenu 头部的角色下拉菜单
     * @prop {string} dropMenu.text 下拉项名称
     * @prop {boolean} dropMenu.active 该项默认显示
     * @prop {string} dropMenu.href 该项的链接地址
     * @prop {string} dropMenu.id 该项添加id
     * @prop {object} userInfo 用户信息下拉框
     * @prop {string} userInfo.image 用户头像
     * @prop {array} userInfo.info 要显示的信息，一条信息一行
     * @prop {callback} ready 初始化完成回调
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

    Plugin = (function () {

        /***
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

        /**
         * 重置导航高亮位置
         * @method resetNavActive
         * @param options {object} 初始化参数
         * @param options.activeIndex {number} 高亮位置,从1开始算起
         * @example
         $('header').bhHeader('resetNavActive', {activeIndex: 2});
         */
        Plugin.prototype.resetNavActive = function (options) {
            options = $.extend({}, {
                activeIndex: NaN  //高亮位置从1开始算起
            }, options);
            resetNavActive(options, this.$element);
        };

        /**
         * 显示导航菜单
         * @method showNav
         * @example
         $('header').bhHeader('showNav');
         */
        Plugin.prototype.showNav = function () {
            showOrHideNav('show');
        };

        /**
         * 隐藏导航菜单
         * @method hideNav
         * @example
         $('header').bhHeader('hideNav');
         */
        Plugin.prototype.hideNav = function () {
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

        //监听头部图片加载完成，计算nav导航的可用宽度
        listenImgLoadComplete(dom, options);

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
        });
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
        var _html = '<a class="@itemClass" href="@href" @target bh-header-role="@guid"><div class="bh-headerBar-nav-item @active" @attribute>@title</div><b class="bh-headerBar-nav-item-tip"></b></a>';
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
        if(!url) {
            return false;
        }
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
    function listenImgLoadComplete($dom, options){
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
                            computeNavWidth($normalHead, $dom, options);
                        }
                    })
                    .fail(function(e, $imgDom){
                        if($imgDom.closest('.bh-headerBar-imgBlock').length > 0){
                            $imgDom.attr('src', space.defaultUserImg);
                        }
                        loadCount++;
                        if(loadCount === imgLen){
                            computeNavWidth($normalHead, $dom, options);
                        }
                    });
            });
        }else{
            computeNavWidth($normalHead, $dom, options);
        }
    }

    //计算nav的可用宽度
    function computeNavWidth($normalHead, $dom, options){
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


        if(typeof options.ready !='undefined' && options.ready instanceof Function){
            options.ready();
        }
    }

    /***
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
                    isMoreFlag = true;
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



})(jQuery);
/**
 * @fileOverview 纵向菜单导航
 * @example
var _source = [
    {
        id:"1",
        title:"摘要内容",
        url:"scenes_course_info"
    },
    {
        id:"2",
        title:"基本信息",
        url:"#"
    }
];
$(".sc-leftSide-courseMenu").bhMenu({
    source:_source,//必填, 菜单项的数据 id,title 如果是mode="link"需要传url
    activeIndex:0, //可选, 选中第几项, 默认为0
    contentContainer:$("body"), //可选, 内容所在的容器
    mode:"link" //可选, 支持页面跳转还是tab页切换 支持两个值link/tab 默认值tab
});
 */
(function($) {
    /**
     * 定义一个插件
     */
    var Plugin;

    var activeId, source, $linkContainer, $contentContainer, mode;
    /**
     * 这里是一个自运行的单例模式。
     * @module bhMenu
     */
    Plugin = (function() {

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
        /**
         * enable一项
         * @method enableItem
         * @example
        $control.bhMenu("enableItem",1);
         */
        Plugin.prototype.enableItem = function(index) {
            enableByIndex(index);
        };
        /**
         * disable一项
         * @method disableItem
         * @example
        $control.bhMenu("disableItem",1);
         */
        Plugin.prototype.disableItem = function(index) {
            disableByIndex(index);
        };
        return Plugin;

    })();

    function init(options, dom) {
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

    function initActive(_index) {
        var menuId = getIdByIndex(_index);
        setActive(menuId + '');
    }

    function setActive(menuId) {
        if (menuId == null) {
            return;
        }
        var $menuItem = $linkContainer.find(".bh-menu-link-item[menuId='" + menuId + "']");
        //qiyu 2016-6-22 当activeChange事件返回false时，不要跳转tab页，需求人：吴涛
        // $menuItem.addClass("bh-active");
        var text = $menuItem.text();
        var title = $menuItem.attr("data-title");

        //qiyu 2016-6-22 当activeChange事件返回false时，不要跳转tab页，需求人：吴涛
        var flag = $linkContainer.triggerHandler("activeChange", [menuId, text, title, $menuItem]);
        if (flag === false) {
            return false;
        }

        if (activeId) {
            $linkContainer.find(".bh-menu-link-item[menuId='" + activeId + "']").removeClass("bh-active");
            $contentContainer.find(".bh-menu-content[id='" + activeId + "']").hide();
        }
        activeId = menuId;

        $menuItem.addClass("bh-active");

        $contentContainer.find(".bh-menu-content[id='" + activeId + "']").show();
        //qiyu 2016-6-22 当activeChange事件返回false时，不要跳转tab页，需求人：吴涛
        //给菜单项绑定激活项改变事件，返回菜单id,text和该节点
        // $linkContainer.trigger("activeChange", [menuId, text, title, $menuItem]);
    }

    function getIdByIndex(_index) {
        var id = null;
        if (source) {
            id = source[_index]["id"];
        }
        return id;
    }

    function addEventListener() {
        $linkContainer.on("click", ".bh-menu-link-item", function() {
            if ($(this).hasClass("bh-disabled")) {
                return false;
            }
            if (mode == "link") {
                var _url = $(this).attr("menu-data-url");
                window.open(_url);
            } else {
                var menuId = $(this).attr("menuId");
                setActive(menuId);
            }
        });
    }

    function disableByIndex(_index) {
        var _id = getIdByIndex(_index);
        $linkContainer.find(".bh-menu-link-item[menuId='" + _id + "']").addClass("bh-disabled");
    }

    function enableByIndex(_index) {
        var _id = getIdByIndex(_index);
        $linkContainer.find(".bh-menu-link-item[menuId='" + _id + "']").removeClass("bh-disabled");
    }

    function getLinkDom(_data) {
        var _html = '';
        if (_data) {
            _html = '<div class="bh-menu-link">';
            for (var i = 0, len = _data.length; i < len; i++) {
                _html += getLinkItemDom(_data[i]);
            }
            _html += '</div>';
        }
        return _html;
    }

    function getLinkItemDom(_data) {
        var _html = '';
        if (_data) {
            //qiyu 2016-8-22 url属性在任何状态都应保留，需要作为附加属性使用
            /*if (mode == "link") {
                _html = '<div class="bh-menu-link-item" menuId="' + _data.id + '" menu-data-url="' + _data.url + '" data-title="' + _data.title + '">';
            } else {
                _html = '<div class="bh-menu-link-item" menuId="' + _data.id + '" data-title="' + _data.title + '">';
            }*/
            _html = '<div class="bh-menu-link-item" menuId="' + _data.id + '" menu-data-url="' + _data.url + '" data-title="' + _data.title + '">';
            _html += _data.title;
            _html += '</div>';
        }
        return _html;
    }
    $.fn.bhMenu = function(options, params) {
        var instance;
        instance = this.data('bhMenu');
        /**
         * 判断插件是否已经实例化过，如果已经实例化了则直接返回该实例化对象
         */
        if (!instance) {
            return this.each(function() {
                //将实例化后的插件缓存在dom结构里（内存里）
                return $(this).data('bhMenu', new Plugin(this, options));
            });
        }
        if (options === true) {
            return instance;
        }
        /**
         * 优雅处： 如果插件的参数是一个字符串，则 调用 插件的 字符串方法。
         * 如 $('#id').plugin('doSomething') 则实际调用的是 $('#id).plugin.doSomething();
         * doSomething是刚才定义的接口。
         * 这种方法 在 juqery ui 的插件里 很常见。
         */
        if ($.type(options) === 'string') {
            instance[options](params);
        }
        return this;
    };

    /**
     * @memberof module:bhMenu
     * @description 内置默认值
     * @prop {object}  defaults
     * @prop {Array}  defaults.source - 菜单项的数据
     * @prop {string}  defaults.activeIndex - 当前 active 项的index值
     * @prop {$}  defaults.contentContainer - 内容所在的容器
     * @prop {string}  defaults.mode - 页面跳转还是tab页切换
     */
    $.fn.bhMenu.defaults = {
        source: [], //菜单项的数据 id,title 如果是mode="link"需要传url
        activeIndex: 0, //默认选中第几项
        contentContainer: $("body"), //内容所在的容器
        mode: "tab" //支持页面跳转还是tab页切换 支持两个值link/tab
    };
})(jQuery);
'use strict';

/**
 * @fileOverview 分页组件
 * @example
 $control.pagination({
        mode: 'advanced', //可选， 分页的模式 advanced或者simple
        pagesize: pagesize, //可选， 一页展示的数据
        pageSizeOptions: [5, 10, 50, 100], //可选，下拉框里面的数据
        selectedIndex: 0, //可选，下拉框的默认显示的index
        pagenum: pagenum, //可选，当前的页码
        totalSize: 1000 //必填，总共多少条数据
    });
    $control.pagination({
        mode: 'simple', //可选， 分页的模式
        pagesize: pagesize, //可选， 一页展示的数据
        pagenum: pagenum, //可选，当前的页码
        totalSize: 1000, //必填，总共多少条数据
        pagerButtonsCount: 3
    });
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
        '<a href="javascript:void(0);" class="waves-effect bh-pager-simplePrev bh-pager-btn" pager-flag="simplePrev">' +
        '<i class="iconfont icon-keyboardarrowleft"></i>' +
        '</a>' +
        '<div class="bh-pageNum-con" pager-flag="pageNumEle"></div>' +
        '<a href="javascript:void(0);" class="waves-effect bh-pager-simpleNext bh-pager-btn" pager-flag="simpleNext">' +
        '<i class="iconfont icon-keyboardarrowright"></i>' +
        '</a>' +
        '</div>' +
        '<div class="bh-pull-right">' +
        '<label class="bh-pull-right bh-pager-label bh-mh-16">共<span id="bh-pager-simple-total"></span>条</label>' +
        '</div>' +
        '</div>';


    var Plugin;

    $.fn.pagination = function(options, params) {
        var instance = new Plugin(this, options);

        if (options === true) {
            return instance;
        }
        return this;
    };

    /**
     * @memberof module:pagination
     * @description 内置默认值
     * @prop {string}  mode  advanced或simple
     * @prop {number}  pagesize的组合 - 每页展示的条数
     * @prop {Array}  pageSizeOptions - advanced分页的pagesize的组合
     * @prop {number}  selectedIndex - advanced分页初始化时展示的第几页的数据
     * @prop {number}  pagenum - 当前的页码
     * @prop {number}  totalSize - 数据的总量
     * @prop {number}  pagerButtonsCount - 简单分页时，除了第一页和最后一页的页码，展示的其他的页码的数量
     */
    $.fn.pagination.defaults = {
        mode: 'advanced',
        pagesize: 10,
        pageSizeOptions: [10, 20, 50, 100],
        selectedIndex: 0,
        pagenum: 0,
        totalSize: 0,
        pagerButtonsCount: 0
    };

    /**
     * 这里是一个自运行的单例模式。
     * @module pagination
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
        if (this.settings.mode == 'advanced') {
            return this.$element.find('[pager-flag="pagerOptionSel"]').jqxDropDownList('val');
        } else if (this.settings.mode == 'simple') {
            return this.settings.pagesize;
        }
    };

    Plugin.prototype.getTotal = function() {
        return this.settings.totalSize;
    };

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
        var isLastNum = settings.pagenum + 1 == pageLen;
        if (pagerButtonsCount == 0 || pageLen == 1 || pageLen == 0) {
            if (pageLen != 0) {
                onlyNumText = 1;
            }
            $fixPageHtml = '<div class="bh-pager-simple-numHtml" pager-flag="addNumBtn">' +
                '<a href="javascript:void(0);" class="waves-effect bh-pager-btn bh-pager-simpleBtn bh-simplePager-active" pager-flag="simpleOnliOne">' + onlyNumText + '</a>' +
                '</div>';
            $element.find('[pager-flag="pageNumEle"]').append($fixPageHtml);
            $element.find('[pager-flag="simplePrev"]').addClass('bh-btn-disabled');
            if (isButtonDis || isLastNum) {
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
        var firstNum = '<a href="javascript:void(0);" class="waves-effect bh-pager-btn bh-pager-simpleBtn" pager-flag="simpleGotoPage">1</a>';
        var lastNum = '<a href="javascript:void(0);" class="waves-effect bh-pager-btn bh-pager-simpleBtn" pager-flag="simpleGotoPage">' + pageLen + '</a>';
        var rightEllipsis = '<a href="javascript:void(0);" class="waves-effect bh-pager-btn bh-pager-simpleBtn ellipsis" pager-flag="changeRightEllipsis">...</a>';
        var leftEllipsis = '<a href="javascript:void(0);" class="waves-effect bh-pager-btn bh-pager-simpleBtn ellipsis" pager-flag="changeLeftEllipsis">...</a>';
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
        var pageNumber = 0;
        var $pageNumEle = '';
        if (pageNumText) {
            pageNumber = pageNumText;
        }
        for (var i = 1; i < len; i++) {
            pageNumber = pageNumber + 1;
            if (pageNumber == pageLen) {
                break;
            }
            $pageNumEle += '<a href="javascript:void(0);" class="waves-effect bh-pager-btn bh-pager-simpleBtn" pager-flag="simpleGotoPage">' + pageNumber + '</a>';
        }
        return $pageNumEle;
    }
    // 获取中间展示的数字，只有数字没有省略号
    function _addOnlyNumBtnCircle($element, len, pageLen) {
        var pageNumText = 0;
        var $pageNumEle = '';
        for (var i = 1; i < len; i++) {
            pageNumText = i + 1;
            $pageNumEle += '<a href="javascript:void(0);" class="waves-effect bh-pager-btn bh-pager-simpleBtn" pager-flag="simpleGotoPage">' + pageNumText + '</a>';
        }
        var $totalNumEle = '<a href="javascript:void(0);" class="waves-effect bh-pager-btn bh-pager-simpleBtn" pager-flag="simpleGotoPage">1</a>' + $pageNumEle + '<a href="javascript:void(0);" class="waves-effect bh-pager-btn bh-pager-simpleBtn" pager-flag="simpleGotoPage">' + pageLen + '</a>';
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
            if (pagenum <= 1) {
                return;
            }
            _setPagenum(pagenum - 1, instance);
            _setCurrentPageRecordInfo(instance);
            _triggerEvent(instance, $(this));
        });
        //点击下一页
        $element.off('click', '[pager-flag="next"]').on('click', '[pager-flag="next"]', function() {
            var pagenum = instance.getPagenum();
            if (pagenum >= _getLastpagenum(instance)) {
                return;
            }
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
                var isRemoveNextDis = $element.find('[pager-flag="simpleNext"]').hasClass('bh-btn-disabled');
                var isRemovePreDis = $element.find('[pager-flag="simplePrev"]').hasClass('bh-btn-disabled');
                if (isRemovePreDis) {
                    return;
                }
                if (isRemoveNextDis) {
                    $element.find('[pager-flag="simpleNext"]').removeClass('bh-btn-disabled');
                }
                _clickPrev(settings, $element, pageLen);
                _triggerEvent(instance, $(this));
            });
            //点击下一页
            $element.off('click', '[pager-flag="simpleNext"]').on('click', '[pager-flag="simpleNext"]', function() {
                var isRemoveNextDis = $element.find('[pager-flag="simpleNext"]').hasClass('bh-btn-disabled');
                var isRemovePreDis = $element.find('[pager-flag="simplePrev"]').hasClass('bh-btn-disabled');
                if (isRemoveNextDis) {
                    return;
                }
                if (isRemovePreDis) {
                    $element.find('[pager-flag="simplePrev"]').removeClass('bh-btn-disabled');
                }
                _clickNext(settings, $element, pageLen);
                _triggerEvent(instance, $(this));
            });
            //点击数字，跳转
            $element.off('click', 'a[pager-flag="simpleGotoPage"]').on('click', 'a[pager-flag="simpleGotoPage"]', function() {
                var $pageItem = $(this);
                var pagenum = parseInt($pageItem.text());
                settings.pagenum = pagenum - 1;
                _addNumBtn(settings, $element, pageLen);
                var $eventEle = $element.find('a[pager-flag="simpleGotoPage"]').filter(function() {
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
                $element.find('[pager-flag="simplePrev"]').addClass('bh-btn-disabled');
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
                $element.find('[pager-flag="simpleNext"]').addClass('bh-btn-disabled');
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

}).call(undefined);
/**
 * @fileOverview 纸质弹框
 * @example
 $.bhPaperPileDialog.show({
    content: '' //html内容
 });
 */
(function($) {
    /**
     * 纸质弹框。
     * @module bhPaperPileDialog
     */
    $.bhPaperPileDialog = {
        /**
         * 初始化并显示弹框
         * @method show
         * @param options {object} 初始化参数
         * @param options.titleContainer {jQuery} 可选，弹框父层的title
         * @param options.insertContainer {jQuery} 可选，想要将弹框插入的容器
         * @param options.referenceContainer {jQuery} 可选，弹框要参考的容器，主要用于获取容器的宽度和位置
         * @param options.addDialogFlagClass {string} 可选，想要在弹出框中添加的样式类名
         * @param options.toHideContainer {jQuery} 可选，显示弹框时,要隐藏的容器
         * @param options.title {string} 可选，弹出框的title,可在content中添加,请参考example
         * @param options.content {string} 必填，在弹出框中显示的内容
         * @param options.footer {string} 可选，在弹出框页脚,可在content中添加,请参考example
         * @param options.aside {string} 可选，在弹出框页脚,可在content中添加,请参考example
         * @param options.close {callback} 可选，当关闭弹框的回调
         * @param options.closeBefore {callback} 可选，当关闭弹框前的回调,返回true不关闭弹框,返回false关闭弹框
         * @param options.ready {callback} 可选，初始化且动画执行完成的回调
         * @param options.render {callback} 可选，dom节点生成并插入页面时的回调，此时动画未完成
         * @example
         $.bhPaperPileDialog.show({
            content: '' //html内容
         });
         */
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

        /**
         * 当弹框高度发生变化时,重置页面页脚的位置
         * @method resetPageFooter
         * @param options {object} 参数
         * @param options.titleContainer {jQuery} 可选，弹框父层的title
         * @param options.insertContainer {jQuery} 可选，想要将弹框插入的容器
         * @param options.referenceContainer {jQuery} 可选，弹框要参考的容器，主要用于获取容器的宽度和位置
         * @param options.guid {string} 可选，该弹框动态生成出来的guid
         * @example
                 $.bhPaperPileDialog.resetPageFooter();
         */
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

        /**
         * 当弹框高度发生变化时,重置弹框页脚的位置
         * @method resetDialogFooter
         * @param options {object} 参数
         * @param options.titleContainer {jQuery} 可选，弹框父层的title
         * @param options.referenceContainer {jQuery} 可选，弹框要参考的容器，主要用于获取容器的宽度和位置
         * @example
         $.bhPaperPileDialog.resetDialogFooter();
         */
        resetDialogFooter: function(options) {
            var dialogDefaults = {
                titleContainer: "", //可选，与弹出框关联的title容器
                referenceContainer: "" //可选，与弹出框关联的内容容器
            };
            options = $.extend({}, dialogDefaults, options);
            resetDialogFooter(options);
        },

        /**
         * 关闭弹框
         * @method hide
         * @param options {object} 参数
         * @param options.titleContainer {jQuery} 可选，弹框父层的title
         * @param options.referenceContainer {jQuery} 可选，弹框要参考的容器，主要用于获取容器的宽度和位置
         * @param options.guid {string} 可选，该弹框动态生成出来的guid
         * @param options.isHideAll {boolean} 可选，true删除所有弹框,默认false
         * @param options.ignoreAllCallback {boolean} 可选，true忽略所有的回调方法,默认false
         * @param options.ignoreCloseCallback {boolean} 可选，true忽略close的回调方法,默认false
         * @param options.ignoreCloseBeforeCallback {boolean} 可选，true忽略closeBefore的回调方法,默认false
         * @example
         $.bhPaperPileDialog.hide();
         */
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

    /***
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
            var titleLeft = options.referenceContainer.offset().left;
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

                $.bhPaperPileDialog.resetPageFooter(); //改变页面的页脚位置
                $.bhPaperPileDialog.resetDialogFooter(); //改变弹框的页脚位置
            }, getAnimateTime() * 2 + 10);

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

    /***
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

    /***
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

    /***
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

    /***
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
            if($dialog.attr('hide-flag') === 'true'){
                return;
            }

            $dialog.attr('hide-flag', 'true');

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
                options.close = $dialog.data ? $dialog.data('closeFun') : null;
            }
            if (!options.ignoreCloseBeforeCallback) {
                options.closeBefore = $dialog.data ? $dialog.data('closeBeforeFun') : null;
            }
        }
        return options;
    }

    /***
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
            }else{
                $("[bh-paper-pile-dialog-role-guid=" + guid + "]").attr('hide-flag', 'false');
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

    /***
     * 动画的执行的基础时间
     * @returns {number}
     */
    function getAnimateTime() {
        return 450;
    }

    /***
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

    /***
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

    /***
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

    /***
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

    /***
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

        var bodyHeight = 0;
        var OsObject = window.navigator.userAgent;
        if (!!window.ActiveXObject || "ActiveXObject" in window) {
            // if (OsObject.indexOf("MSIE") > 0) {
            //     bodyHeight = document.documentElement.scrollHeight;
            // }
            bodyHeight = document.documentElement.scrollHeight;
        } else {
            bodyHeight = $body.get(0).scrollHeight;
        }
        // var bodyHeight = $body.get(0).scrollHeight;

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

    /***
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

    /***
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

    /***
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
                var itemHeight = $item.outerHeight();
                dialogBodyHeight += itemHeight;
            }
        });

        var dialogBodyMinHeight = parseInt($dialogBody.css("min-height"), 10);
        dialogBodyMinHeight = dialogBodyMinHeight ? dialogBodyMinHeight : 0;

        //当弹出框的内容高度比弹出框的最小高度还小的时候，让弹出框的页脚能自适应高度
        if ((dialogBodyHeight + dialogFooterHeight) < dialogBodyMinHeight) {
            $dialogFooter.removeAttr("style");
            /**
             * 24是对话框页脚距离内容的间距
             * dialogBodyMinHeight是页面页脚高度和对话框页脚高度的和
             * 页面页脚的高度是32，所以24是安全距离可以直接加
             */

            var dialogHeaderHeight = $dialogHeader.length > 0 ? $dialogHeader.outerHeight() : 0;
            dialogBodyHeight += dialogHeaderHeight;
            //40 是设计给出的页脚与内容的距离, 16 是footer的padding-top值,故真实的页脚与内容的间距是40 - 16
            dialogBodyHeight += 40 - 16;
            // dialogBodyHeight += 24;
            // dialogBodyHeight += $dialogHeader.outerHeight();

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

    /***
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
/*
 * jQuery placeholder, fix for IE6,7,8,9
 * @author JENA
 * @since 20131115.1504
 * @website ishere.cn
 */
var JPlaceHolder = {
    //检测
    _check : function(){
        return 'placeholder' in document.createElement('input');
    },
    //初始化
    init : function(){
        if(!this._check()){
            this.fix();  ele.tagName
        }
        //this.fix();
    },
    //修复
    fix : function(container){
        container = container || document;
        jQuery('input[placeholder], textarea[placeholder]', $(container)).each(function(index, element) {
            var self = $(this), txt = self.attr('placeholder');
            self.wrap($('<div role="bh-placeholder-wrap"></div>').css({position:'relative', zoom:'1', border:'none', background:'none', padding:'none', margin:'none'}));
            var pos = self.position(),
                    h = self.height(),
                    lineH = h,
                    paddingleft = parseInt(self.css('padding-left')),
                    paddingTop = parseInt(self.css("padding-top")),
                    marginLeft = parseInt(self.css("margin-left")),
                    marginTop = parseInt(self.css("margin-top"));
            if(self[0].tagName === "TEXTAREA"){
                lineH = 14;
            }
            var size = (self.css("font-size")) ? self.css("font-size") : "14px";
            var line_height = (self.css("line-height")) ? self.css("line-height") : lineH + "px";
            var holder = $('<span role="bh-placehoder"></span>').text(txt).css({
                "font-size":size,
                zIndex:'2',
                position:'absolute',
                left:pos.left + marginLeft +"px",
                top:pos.top + marginTop + paddingTop + "px",
                height:h+"px", lineHeight:line_height,
                paddingLeft:paddingleft + "px",
                color:'#aaa',
                overflow: "hidden",
                "text-overflow": "ellipsis",
                "white-space": "nowrap",
                "max-width": "100%"
            }).appendTo(self.parent());
            self.focusin(function(e) {
                holder.hide();
            }).focusout(function(e) {
                if(!self.val()){
                    holder.show();
                }else{
                    holder.hide();
                }
            }).keyup(function(e){
                if(!self.val()){
//                    holder.show();
                }else{
                    holder.hide();
                }
            });
            holder.click(function(e) {
                holder.hide();
                self.focus();
            });
        });
    },
    resize: function (container) {
        container = container || document;
        jQuery('input[placeholder], ', $(container)).each(function(index, element) {
            var wrap = $(this).parent('[role="bh-placeholder-wrap"]');
            if (wrap.length == 0) return;
            var lineH = $(this).height();
            $('[role="bh-placehoder"]', wrap).css({'line-height': lineH});
        });
    }

};

/**
 * @fileOverview 侧边栏弹框
 * @example
 $.bhPropertyDialog.show({
    content: '' //html内容
 });
 */
(function($) {
    /**
     * 纸质弹框。
     * @module bhPropertyDialog
     */
    $.bhPropertyDialog = {
        /**
         * 初始化并显示弹框
         * @method show
         * @param data {object} 初始化参数
         * @param data.insertContainer {jQuery} 可选，想要将弹框插入的容器
         * @param data.title {string} 可选，弹出框的title
         * @param data.content {string} 可选，在弹出框中显示的内容
         * @param data.footer {string} 可选，在弹出框页脚
         * @param data.selector {string} 可选，预置弹框的选择器
         * @param data.hideCover {Boolean} 可选，是否隐藏遮罩层,默认false不隐藏
         * @param data.ready {callback} 可选，初始化且动画执行完成的回调
         * @example
         $.bhPropertyDialog.show();
         */
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

        /**
         * 关闭弹框
         * @method hide
         * @param data {object} 初始化参数
         * @param data.close {callback} 可选，关闭弹框的回调
         * @example
         $.bhPropertyDialog.hide();
         */
        hide: function(data) {
            var dialogDefaults = {
                close: null, //可选，当关闭的回调
                destroy: true //可选，值为true或false； true则在隐藏的同时将弹出框remove
            };
            var options = $.extend({}, dialogDefaults, data);
            dialogHide(options);
        },

        /**
         * 隐藏弹框页脚
         * @method footerHide
         * @example
         $.bhPropertyDialog.footerHide();
         */
        footerHide: function() {
            dialogFooterHide();
        },

        /**
         * 显示弹框页脚
         * @method footerShow
         * @example
         $.bhPropertyDialog.footerShow();
         */
        footerShow: function() {
            dialogFooterShow();
        },
        destroy: function() {
            dialogDestroy();
        }
    };

    /***
     * 动画的执行的基础时间
     * @returns {number}
     */
    function getAnimateTime() {
        return 450;
    }

    /***
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

            //获取该弹框的header，section，footer的jquery对象
            var $dialogHeader = $dialog.find("[bh-property-dialog-role=header]").children();
            var $dialogBody = $dialog.find("[bh-property-dialog-role=body]").children();
            var $dialogFooter = $dialog.find("[bh-property-dialog-role=footer]").children();

            data.compile && data.compile($dialogHeader, $dialogBody, $dialogFooter);
            setTimeout(function() {
                //初始化结束后的回调
                if (typeof data.ready != 'undefined' && data.ready instanceof Function) {
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


    /***
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


    /***
     * 显示侧边框页脚
     * @param insertContainer 弹出框插入的容器
     */
    function dialogFooterHide() {
        $("div[bh-property-dialog-role=bhPropertyDialog]").find("div.bh-property-dialog-footer")
            .removeClass("bh-intoUp").addClass("bh-outDown");
        setDialogBodyHeight();
    }

    /***
     * 隐藏侧边框页脚
     * @param insertContainer 弹出框插入的容器
     */
    function dialogFooterShow() {
        var $dialogFooter = $("div[bh-property-dialog-role=bhPropertyDialog]").find("div.bh-property-dialog-footer");
        $dialogFooter.removeClass("bh-outDown").addClass("bh-intoUp").show();
        setDialogBodyHeight(true);
    }

    /***
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

    /***
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

        if(!space.options.readonly){
            eventListen($html);
        }
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
                $(this).removeClass('bh-active');
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
        if (options === true) {
            return instance;
        }
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
        starClass: '', //可选，给星星的父层添加样式类
        readonly: false //可选,只读样式
    };
})(jQuery);
/**
 * @fileOverview 步骤条组件
 * @example
$control.bhStepWizard({
    items: [
        { stepId: "step1", title: "步骤向导-1" },
        { stepId: "step2", title: "步骤向导-2" },
        { stepId: "step3", title: "步骤向导-3" }
    ],
    active: "step3",//可选, 当前激活项的stepId
    finished: ['step2'], //可选, 当前已完成项的stepId数组,默认值为[]
    change: function () { } //可选, 焦点项变化的回调,默认值为null
});
 */
(function($) {

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
        if (options === true) {
            return instance;
        }
        /**
         * 优雅处： 如果插件的参数是一个字符串，则 调用 插件的 字符串方法。
         * 如 $('#id').plugin('doSomething') 则实际调用的是 $('#id).plugin.doSomething();
         * doSomething是刚才定义的接口。这种方法 在 juqery ui 的插件里 很常见。
         */
        if ($.type(options) === 'string') {
            var result = instance[options](params);
            return result;
        }
        //return this;
    };

    /**
     * @memberof module:bhStepWizard
     * @description 内置默认值
     * @prop {object}  defaults
     * @prop {Array}  defaults.items - 步骤参数集合 title,stepId,active,finished
     * @prop {string}  defaults.active - 当前 active 项的stepId
     * @prop {Array}  defaults.finished - 当前 finished 项的stepId数组
     * @prop {boolean}  defaults.isAddClickEvent - 步骤条是否可点
     * @prop {$}  defaults.contentContainer - 正文的容器选择器
     * @prop {function}  defaults.change - 焦点项变化的回调事件
     */
    $.fn.bhStepWizard.defaults = {
        items: [],
        active: '',
        finished: [],
        isAddClickEvent: true,
        contentContainer: $("body"),
        change: null
    };

    var Plugin;

    var g = {};

    /**
     * 这里是一个自运行的单例模式。
     * @module bhStepWizard
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

        // Plugin.prototype.addItem = function(i, item, total) {
        //     addItem(i, item, total);
        // };

        // Plugin.prototype.resetActiveItem = function(stepId) {
        //     resetActiveItem(stepId);
        // };

        /**
         * 设置 finished 状态项
         * @method resetFinishedItems
         * @param {Array} stepIds - 需要改为 finished 状态的步骤ID
         * @example
        $control.bhStepWizard("resetFinishedItems", ["step1", "step2"]);
         */
        Plugin.prototype.resetFinishedItems = function(stepIds) {
            g.finishedItemStepIds = stepIds;
            for (var i = 0; i < g.finishedItemStepIds.length; i++) {
                var finishedStepId = g.finishedItemStepIds[i];
                var finishedIndex = getIndexByStepId(finishedStepId);
                refreshElementByIndex(finishedIndex);
            }
        };

        /**
         * active下一项
         * @method activeNextItem
         * @example
        $control.bhStepWizard("activeNextItem");
         */
        Plugin.prototype.activeNextItem = function() {
            activeNextItem();
        };

        /**
         * active上一项
         * @method activePrevItem
         * @example
        $control.bhStepWizard("activePrevItem");
         */
        Plugin.prototype.activePrevItem = function() {
            activePrevItem();
        };

        /**
         * 把指定的步骤变成active状态
         * @method changeToActive
         * @param {string} stepId 步骤ID
         * @example
        $control.bhStepWizard("changeToActive", "step1");
         */
        Plugin.prototype.changeToActive = function(stepId) {
            changeToActive(stepId);
        };

        /**
         * 把指定步骤变成finished状态
         * @method changeToFinished
         * @param {string} stepId 步骤ID
         * @example
        $control.bhStepWizard("changeToFinished", "step1");
         */
        Plugin.prototype.changeToFinished = function(finishedStepId) {
            if (finishedStepId == undefined || finishedStepId == null) {
                finishedStepId = g.activeItemStepId;
            }
            //1、设置指定的步骤为finished
            if (isExistInFinisheds(finishedStepId)) {
                return;
            }
            addToFinisheds(finishedStepId);
            var finishedIndex = getIndexByStepId(finishedStepId);
            refreshElementByIndex(finishedIndex);
        };

        /**
         * 重置步骤条宽度，当屏幕尺寸变化需要手动触发
         * @method resetWidth
         * @param {string} stepId 步骤ID
         * @example
        $control.bhStepWizard("resetWidth");
         */
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
            resizeWizard(stepId, function($item) {
                $item.remove();
            });
        };
        Plugin.prototype.showItem = function(stepId) {
            resizeWizard(stepId, function($item) {
                $item.show();
            });
        };
        Plugin.prototype.hideItem = function(stepId) {
            resizeWizard(stepId, function($item) {
                $item.hide();
            });
        };
        Plugin.prototype.getActiveItem = function() {
            return g.activeItemStepId;
        };

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

    function resetItemWidth() {
        var itemLen = g.wizardElement.length;
        if (itemLen > 0) {
            var $wizardContainer = g.wizardContainer;
            var sumWidth = $wizardContainer.width();
            var hiddenCount = $(".bh-wizard-item:hidden", $wizardContainer).length;
            var count = itemLen - hiddenCount;
            var itemWidth = Math.floor(sumWidth / count);
            //40是左右两个箭头的宽度
            g.wizardElement.find('.title').width(itemWidth - 40);
            //qiyu 2016-8-15 将余数宽度都补充到最后一个元素，让步骤条填满整个容器，张丹
            var sum_item_width = 0;
            g.wizardElement.each(function(){
                //qiyu 2016-8-29 隐藏项的宽度忽略计算，解决hide后宽度不正确的问题，报告者：唐羽
                if(!$(this).is(":hidden")){
                    sum_item_width += $(this).outerWidth();
                }
                //sum_item_width += $(this).outerWidth();
            });
            var remain_width = sumWidth - sum_item_width;
            var last_width = itemWidth - 40 + remain_width;
            g.wizardElement.find('.title').last().width(last_width);
        }
    }

    function resetActiveItem(stepId) {
        g.activeItemStepId = stepId;
    }

    function activePrevItem() {
        //重置上一个激活项的样式
        var prevActiveItemIndex = getActiveItemIndex();
        var stepId = getPrevVisiableStepId(prevActiveItemIndex);
        if (stepId != null) {
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
            if (g.wizardElement.parent().find("[stepid='" + stepId + "']").is(":hidden")) {
                result = getPrevVisiableStepId(newActiveItemIndex);

            } else {
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
            if (g.wizardElement.parent().find("[stepid='" + stepId + "']").is(":hidden")) {
                result = getNextVisiableStepId(newActiveItemIndex);
            } else {
                result = stepId;
            }
        }
        return result;
    }

    function activeNextItem() {
        //重置上一个激活项的样式
        var prevActiveItemIndex = getActiveItemIndex();
        var stepId = getNextVisiableStepId(prevActiveItemIndex);
        if (stepId != null) {
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
            g.change({
                "stepId": stepId
            });
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
            if (isActiveItem(stepId)) {
                return;
            }
            changeToActive(stepId);
        });
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
        if (stepId == null || stepId == undefined) {
            return;
        }
        var firstStepId = g.items[0]["stepId"];
        var lastStepId = g.items[g.items.length - 1]["stepId"];

        var $item = g.wizardContainer.find(".bh-wizard-item[stepid=" + stepId + "]");
        if ($item.length > 0) {
            callback($item);
        }
        g.wizardElement = $(g.wizardContainer).children(".bh-wizard-item");
        if (stepId == firstStepId) {
            g.wizardElement.eq(0).addClass("bh-wizard-item-first");
        } else if (stepId == lastStepId) {
            g.wizardElement.last().addClass("bh-wizard-item-last");
        }

        resetItemWidth();
    }

})(jQuery);
/**
 * @fileOverview 时间选择组件
 * @example
 $('#timePicker1').bhTimePicker();
 */
(function ($) {
    'use strict';

    var Plugin;

    /**
     * @module bhTimePicker
     */
    $.fn.bhTimePicker = function (options, params) {
        var instance;
        instance = this.data('bhTimePicker');
        /***
         * 判断插件是否已经实例化过，如果已经实例化了则直接返回该实例化对象
         */
        if (!instance) {
            return this.each(function () {
                //将实例化后的插件缓存在dom结构里（内存里）
                return $(this).data('bhTimePicker', new Plugin(this, options));
            });
        }
        if (options === true) {
            return instance;
        }
        /***
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
     * @memberof module:bhTimePicker
     * @description 内置默认值
     * @prop {string}  defaultType - 可选,显示类型 custom:自定义, all:全部, currentWeek:本周, lastWeek:上周,currentMonth:本月, lastMonth: 上月, currentQuarter:本季度, lastQuarter:上季度,currentYear:今年, lastYear:去年, last7Day:近7天, last30Day:近30天
     * @prop {string}  width - 可选,设置宽度
     * @prop {string}  format - 可选,设置时间显示格式,默认（年-月-日）
     * @prop {object}  range - 可选，设置时间的可选范围
     * @prop {string}  range.max - 可选，设置最大时间，‘today’最大时间就是今天，或传入时间字符串‘2016/4/22’
     * @prop {string}  range.min - 可选，设置最小时间，‘today’最小时间就是今天，或传入时间字符串‘2016/4/22’
     * @prop {object}  time - 设置初始化时间
     * @prop {string}  time.start - 开始时间
     * @prop {string}  time.end - 结束时间
     * @prop {boolean}  isDisable - 可选，该组件是否禁用，默认false不禁用
     * @prop {function}  selectedTime - 可选,选取时间后的回调，返回开始时间和结束时间字符串
     * @prop {function}  ready - 可选,初始化完成回调
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

    /**
     * 这里是一个自运行的单例模式。
     */
    Plugin = (function () {

        /***
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

        /**
         * 获取时间范围
         * @method getValue
         * @example
         var dateTime = $('#timePicker1').bhTimePicker('getValue');
         */
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

        /**
         * 设置时间范围
         * @method setValue
         * @prop {object}  data - 传入时间
         * @prop {object}  data.startTime - 可选,开始时间
         * @prop {object}  data.endTime - 可选,结束时间
         * @example
         $('#timePicker1').bhTimePicker('setValue',{
                startTime: '2016-8-24',
                endTime: '2017-9-24'
            });
         */
        Plugin.prototype.setValue = function(data) {
            var startTime = data.startTime ? timeStrToDate(data.startTime) : this.startTimeDom.jqxDateTimeInput('getDate');
            var endTime = data.endTime ? timeStrToDate(data.endTime) : this.endTimeDom.jqxDateTimeInput('getDate');
            setInputDateTime(this, startTime, endTime);
        };

        /**
         * 设置组件禁用
         * @method setDisable
         * @example
         $('#timePicker1').bhTimePicker('setDisable');
         */
        Plugin.prototype.setDisable = function() {
            this.$rootElement.children('div[bh-time-picker-role="rangeBox"]').append('<div class="bh-timePick-disable" bh-time-picker-role="disableBlock"></div>');
        };

        /**
         * 设置组件取消禁用
         * @method setEnable
         * @example
         $('#timePicker1').bhTimePicker('setEnable');
         */
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

    /***
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
        var startTimeStr = getLocalDateStr(startTime, options);
        var endTimeStr = getLocalDateStr(endTime, options);
        var timeStr = startTimeStr +'-'+ endTimeStr;

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

    /***
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
        var max =  (!options.settings.range.max || options.settings.range.max === 'today') ? nowYear : timeStrToDate(options.settings.range.max).getFullYear();
        var min =  (!options.settings.range.min || options.settings.range.min === 'today') ? nowYear : timeStrToDate(options.settings.range.min).getFullYear();
        var disableNext = options.settings.range.max && nowYear >= max;
        var disablePrev = options.settings.range.min && nowYear <= min;
        year = max;
        if(year > nowYear){
            year = nowYear;
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
                                    '<div class="bh-timePicker-rangeBox-selectIcon bh-left ' + (disablePrev ? 'bh-disabled' : '') + '" bh-time-picker-role="selectMonthPre">&lt;</div>'+
                                    '<div class="bh-timePicker-rangeBox-time" bh-time-picker-role="selectMonthYear">'+year+'年</div>'+
                                    '<div class="bh-timePicker-rangeBox-selectIcon bh-right '+ (disableNext ? 'bh-disabled' : '') + '" bh-time-picker-role="selectMonthNext">&gt;</div>'+
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

    /***
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
                var now = new Date();
                maxYear = now.getFullYear();
                maxMonth = now.getMonth();
            }
        }

        if(options.settings.range.min){
            if(options.settings.range.min !== 'today'){
                var minObj = timeStrToDate(options.settings.range.min);
                minYear = minObj.getFullYear();
                minMonth = minObj.getMonth();
            }else{
                var now = new Date();
                minYear = now.getFullYear();
                minMonth = now.getMonth();
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

    /***
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
        });
    }

    /***
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

    /***
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
            if(!$(this).hasClass('bh-disabled')){
                changeSelectMonthOfYear($(this).closest('div[bh-time-picker-role="selectMonthBlock"]'), 'pre', options);
            }
        });
        //按月选择下一年
        options.popupBoxDom.on('click', '[bh-time-picker-role="selectMonthNext"]', function(){
            if(!$(this).hasClass('bh-disabled')){
                changeSelectMonthOfYear($(this).closest('div[bh-time-picker-role="selectMonthBlock"]'), 'next', options);
            }
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

    /***
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

    /***
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
                var $rangeBoxSelectTime = options.$rootElement.find('div[bh-time-picker-role="rangeBoxSelectTime"]');
                var $selectType = options.popupBoxDom.find('div[bh-time-picker-role="selectCustom"] div[bh-time-picker-role="selectType"]');
                var selected = $selectType.jqxDropDownList('getSelectedItem');
                if('all' === selected.value){
                    $rangeBoxSelectTime.html(selected.label);
                    return;
                }
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
        var $prev = $selectMonthBlock.find('[bh-time-picker-role="selectMonthPre"]').removeClass('bh-disabled');
        var $next = $selectMonthBlock.find('[bh-time-picker-role="selectMonthNext"]').removeClass('bh-disabled');
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
            year--;
        }else{
            year++;
        }
        $selectMonthYear.html(year + '年');
        var monthHtml = getSelectMonthHtml(options, timeStrToDate(year+'/12/1'), type);
        $selectMonthBlock.find('div[bh-time-picker-role="selectMonthList"]').html(monthHtml);

        if(type === 'pre'){
            if(year === minYear){
                $prev.addClass('bh-disabled');
            }
        }else{
            if(year === maxYear){
                $next.addClass('bh-disabled');
            }
        }
    }

    /***
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
        var startTimeStr = getLocalDateStr(startTime, options);
        var endTimeStr = getLocalDateStr(endTime, options);
        $rangeBoxSelectTime.html(startTimeStr + '-' + endTimeStr);
    }

    function getLocalDateStr(time, options){
        if(/dd/i.test(options.format)){
            return time.getFullYear() + '年' + numberLessThan10AddPre0(time.getMonth()+1) + '月' + time.getDate() + '日';
        }else{
            return time.getFullYear() + '年' + numberLessThan10AddPre0(time.getMonth()+1) + '月';
        }
    }

    //将小于10的数字前面加上0，如01
    function numberLessThan10AddPre0(num){
        return num < 10 ? '0' + num : num;
    }

    /***
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

    /***
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

    /***
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


})(jQuery);
/**
 * @fileOverview 全局提示
 * @example
 $.bhTip({
    content: '评价成功！',
    state: 'success'
 });
 */
(function($) {
    'use strict';

    /**
     * 这里是一个自运行的单例模式。
     * @module bhTip
     */
    $.bhTip = function(data) {

        /**
         * @memberof module:bhTip
         * @description 内置默认值
         * @prop {object}  data
         *
         * @prop {string}  data.content - 必填，提示框的文本内容
         * @prop {string}  data.state - 必填，提示框类型，有3种类型可选：成功success，警告warning，失败danger
         * @prop {string}  data.iconClass - 可选，提示图标的样式类
         * @prop {Array}  data.options - 可选，提示框链接
         * @prop {string}  data.options.text - 可选，提示框链接文字
         * @prop {function}  data.options.callback - 可选，提示框链接的回调方法
         * @prop {number}  data.hideWaitTime - 可选，停留时间
         * @prop {function}  data.onClosed - 可选，提示框消失后的回调事件
         */
        var bhTipDefaults = {
            content: '', //必填，提示框的文本内容
            state: 'success', //必填，提示框类型，有3种类型可选：成功success，警告warning，失败danger
            iconClass: '', //可选，提示图标的样式类
            options: [{ //可选，提示框链接
                text: '', //可选，提示框链接文字
                callback: null //可选，提示框链接的回调方法
            }],
            hideWaitTime: 5000, //可选，停留时间
            onClosed: function() {} //可选，提示框消失后的回调事件
        };
        //将插件的默认参数及用户定义的参数合并到一个新的options里
        var options = $.extend({}, bhTipDefaults, data);
        //记录鼠标移入移出的状态
        var _leaving = true;
        init(options);

        /***
         * 初始化全局提示函数
         * @param {object} options
         */
        function init(options) {
            options = setDefaultIconClass(options);
            var tipHtml = getTipHtml(options);
            var $tipObj = $(tipHtml);
            setTipHtml($tipObj);
            //记录当前时间
            var initTime = +(new Date());
            var stayId = setTimeoutTohide($tipObj, options.hideWaitTime);
            mouseOverAndOut($tipObj, stayId, initTime, options.hideWaitTime);
            clickEventsListen($tipObj, options);
        }

        /***
         * 获取全局提示HTML
         * @param {object} options
         * @returns {string}
         */
        function getTipHtml(options) {
            var tipBtnHtml = '';
            var optionsArr = options.options;
            var optionsArrLen = optionsArr.length;
            if (optionsArrLen >= 1 && optionsArr[0].text !== '' && optionsArr[0].text !== null) { // 判断是否传参options，动态添加tip-btn
                for (var i = 0; i < optionsArrLen; i++) {
                    tipBtnHtml += '<a href="javascript:void(0);" class="bh-tip-btn" bh-tip-btn-role="tipBtn">' + optionsArr[i].text + '</a>';
                }
                tipBtnHtml = '<div class="bh-tip-btn-group">' + tipBtnHtml + '</div>';
            }
            var tipHtml =
                '<div class="bh-tip bh-tip-animate-top-opacity bh-tip-' + options.state + '" bh-tip-role="bhTip">' +
                '<div class="bh-tip-top-bar"></div>' +
                '<div class="bh-card bh-card-lv4">' +
                '<a class="bh-tip-closeIcon" bh-tip-btn-role="closeIcon">×</a>' +
                '<div class="bh-tip-content">' +
                '<i class="iconfont ' + options.iconClass + '" ></i> ' +
                '<span>' + options.content + '</span> ' +
                tipBtnHtml +
                '</div>' +
                '</div>' +
                '</div>';

            return tipHtml;
        }

        /***
         * 在浏览器顶部或者模态弹窗顶部显示
         * @param {object} $tipObj
         */
        function setTipHtml($tipObj) {
            var $body = $('body');
            var windowObj = $body.find('div.jqx-window');
            //不存在模态弹框时，提示在浏览器顶部显示
            if (windowObj.length == 0) {
                $body.append($tipObj);
                $tipObj.css({
                    "position": "fixed"
                });
            } else {
                var windowDialogDom = null;
                var dialogZindex = 0;
                windowObj.each(function() {
                    if (this.style.display !== 'none') {
                        var zIndex = parseInt(this.style.zIndex, 10);
                        if (zIndex > dialogZindex) {
                            dialogZindex = zIndex;
                            windowDialogDom = this;
                        }
                    }
                });
                if (windowDialogDom) {
                    //提示在模态弹框中显示
                    $(windowDialogDom).append($tipObj);
                    $tipObj.css({
                        "position": "absolute"
                    });
                } else {
                    $body.append($tipObj);
                    $tipObj.css({
                        "position": "fixed"
                    });
                }
            }

            //显示提示框，显示效果为向下滑动+渐隐渐现
            var tipWidth = $tipObj.outerWidth();
            $tipObj.css({
                top: '16px',
                left: 'calc(50% - ' + tipWidth / 2 + 'px)',
                opacity: 1
            });

            //计算内容宽度设置水平居中
            var contentObj = $tipObj.find(".bh-tip-content");
            //获得字符串内容
            var objText = $.trim(contentObj.text());
            //实际字符个数
            var textLen = objText.length;
            // 计算内容实际宽度：字符个数*每个字符宽度 + 图标宽 + 图标与文字的间距
            var textWidth = textLen * 12 + 16 + 8;
            contentObj.css({
                "width": textWidth + "px"
            });
            //192: 最小宽度240px下内容的最大宽度 (240px - 左右内边距 - 右侧跟关闭按钮间的距离);
            if (textWidth > 192) {
                contentObj.css({
                    "margin-right": "16px"
                });
            }

        }

        /**
         * 定时隐藏提示框
         * @param {object} $tipObj
         */
        function setTimeoutTohide($tipObj, hideWaitTime) {
            if (!_leaving) {
                return;
            } else {
                var stayId = setTimeout(function() {
                    if ($tipObj) {
                        hideDom($tipObj);
                    }
                }, hideWaitTime);
                return stayId;
            }
        }

        /**
         * 隐藏提示后，删除DOM节点
         * @param {object} $tipObj
         */
        function hideDom($tipObj) {
            $tipObj.css({
                opacity: 0,
                top: '-40px'
            });

            setTimeout(function() {
                $tipObj.remove();
                if (options.onClosed) {
                    options.onClosed();
                }
            }, getAnimateTime());
        }

        /**
         * 鼠标移入和移出的事件监听
         * @param  {object} $tipObj 事件监听的提示框对象
         * @param  {number} stayId  计时器ID
         * @param  {string} initTime  动画开始时间
         * @param {string} remainTime  鼠标移出后，剩余停留时间
         */
        function mouseOverAndOut($tipObj, stayId, initTime, remainTime) {
            var startTime = initTime; //动画开始时间
            var remainTime = remainTime; //鼠标移出后，剩余停留时间
            var stayId = stayId; //标记计时器
            var hoverTime; //鼠标移入时间
            var leaveTime; // 鼠标移出时间
            $tipObj.off('mouseenter').on("mouseenter", function() {
                _leaving = false;
                hoverTime = +(new Date()); //鼠标移入时间
                // 停止计时器
                clearTimeout(stayId);
                var timeDiff = hoverTime - startTime;
                console.log("remainTime: " + (timeDiff));
                if (timeDiff < remainTime) {
                    remainTime = remainTime - timeDiff;
                }

            });

            $tipObj.off('mouseleave').on("mouseleave", function() {
                _leaving = true;
                leaveTime = +(new Date()); //鼠标移出时间
                stayId = setTimeoutTohide($tipObj, remainTime); //从剩余时间继续执行动画
                mouseOverAndOut($tipObj, stayId, leaveTime, remainTime);
            });
        }

        /***
         * 点击事件监听
         * @param {object} $tipObj
         * @param {object} options
         */
        function clickEventsListen($tipObj, options) {
            //点击关闭按钮,隐藏提示
            $tipObj.off("click", "a[bh-tip-btn-role=closeIcon]").on("click", "a[bh-tip-btn-role=closeIcon]", function() {
                hideDom($tipObj, options);
            });

            //操作按钮的回调
            $tipObj.off("click", "a[bh-tip-btn-role=tipBtn]").on("click", "a[bh-tip-btn-role=tipBtn]", function(event) {
                //获取当前点击按钮的索引
                var btnIndex = $(event.target).index();
                var btnOptions = {};
                btnOptions = options.options[btnIndex];
                if (typeof btnOptions.callback != 'undefined' && btnOptions.callback instanceof Function) {
                    btnOptions.callback();
                }
            });
        }

        /***
         * 动画的执行的基础时间
         * @returns {number}
         */
        function getAnimateTime() {
            return 250;
        }


        /***
         * 设置不同状态下的默认图标样式
         * @param {object} options
         * @returns {object}
         */
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
                case 'primary':
                    iconClass = 'icon-info';
            }
            options.iconClass = options.iconClass ? options.iconClass : iconClass;

            return options;
        }
    };

})(jQuery);
/**
 * 步骤向导组件
 */

if (typeof(BhUIManagers) == "undefined") {
    BhUIManagers = {};
}
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
        if (this.length == 0) {
            return null;
        }
        if (this.length == 1) {
            return $(this[0]).bhGetWizardManager();
        }

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
        if (wizard.userWizard){
            return;
        }

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

            activePrevItem: function() {
                //重置上一个激活项的样式
                var prevActiveItemIndex = po.getActiveItemIndex();
                var newActiveItemIndex = prevActiveItemIndex - 1;
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
                if (po.isExistInFinisheds(finishedStepId)) {
                    return;
                }
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
                    if (po.isActiveItem(stepId)) {
                        return;
                    }
                    g.changeToActive(stepId);
                });
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
        };

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

        if (wizard.id == undefined) {
            wizard.id = "BhUI_" + new Date().getTime();
        }
        BhUIManagers[wizard.id + "_Wizard"] = g;

        wizard.userWizard = true;
    };
})(jQuery);
/***
 * @fileOverview 纸质弹框
 */

/***
  * @memberof module:bhChoose
  * @description 内置默认值
  * @prop {object}  defaults
  * @prop {string}  defaults.leftSourceUrl - 左侧表格数据源
  * @prop {string}  defaults.leftSourceAction - 左侧表格动作名称
  * @prop {string}  defaults.id - 左侧表格数据源的主键名称
  * @prop {Object}  defaults.params - 左侧表格带入参数
  * @prop {string}  defaults.type - 左侧表格ajax请求类型 post或get
  * @prop {boolean}  defaults.multiSelect - 是否需要多选 默认为true
  * @prop {boolean}  defaults.maxSelect - 支持多选时 最多选中的条数
  * @prop {string}  defaults.title - 窗口标题
  * @prop {string}  defaults.height - 窗口高度
  * @prop {string}  defaults.width - 窗口宽度
  * @prop {Array}  defaults.buttons - 自定义按钮
  * @prop {string}  defaults.searchKeyName - 搜索时传入后台的参数名称 默认值为SEARCHKEY
  * @prop {boolean}  defaults.showSelectedTip - 是否显示右侧已选中条数的提示
  * @prop {function}  defaults.callback - 点击确定按钮执行的回调 参数为选择的结果
  * @prop {function}  defaults.afterDelete - 右侧删除后执行的回调
  * @prop {function}  defaults.afterSelect - 左侧选中后执行的回调
  * @example
  var win = $.bh_choose({
    leftSourceUrl: 'http://res.wisedu.com/fe_components/mock/table.json',
    leftSourceAction: 'TABLE',
    placeholder: '搜索应用名称',
    id: 'XSBH',
    type: 'get',
    multiSelect: false,//是否支持多选
    maxSelect:3,//设置最多显示的条数
    title: '应用列表',//标题
    rightcellsRenderer: function(row, column, value, rowData) {
      var html = '<p class="gm-member-row bh-clearfix" >' +
        '<span class=" bh-col-md-9" row="' + row + '">' + rowData.XM +
        '</span>' +
        '</p>';
      return html;
    },
    leftcellsRenderer: function(row, column, value, rowData) {
      var html = '<p class="gm-member-row bh-clearfix" >' +
        '<span class=" bh-col-md-9" row="' + row + '">' + rowData.XM +
        '</span>' +
        '</p>';
      return html;
    },
    callback: function(result) {
      return false;
    }
  });

  win.show();
   */
(function($) {

  $.bh_choose = function(options) {
    return new chooseWidget(options);
  };


  $.bh_choose.default = {
    insertContainer: '',
    leftSourceUrl: '',
    leftSourceAction: '',
    leftLocalData: null,
    rightSourceUrl: '',
    rightSourceAction: '',
    rightLocalData: null,
    localSearchField: '',
    id: '',
    params: {},
    type: 'post',
    multiSelect: true,
    showOrder: false,
    title: '添加应用',
    showSelectedTip: true,
    placeholder: '输入关键字搜索',
    maxSelect: null,
    height: '500px',
    width: '900px',
    topHtml: '',
    bottomHtml: '',
    searchKeyName: 'SEARCHKEY',
    leftDataAdapter: null,
    /**设置右下角按钮**/
    buttons: null,
    // 默认改成不转换 靳亚莉和教务都提了这个需求
    searchKeyNeedConvert: false,
    callback: function() {},
    rightcellsRenderer: function() {},
    leftcellsRenderer: function() {},
    afterDelete: function() {},
    afterSelect: function() {}
  };

  function chooseWidget(options) {
    this.options = $.extend({}, $.bh_choose.default, options);
    this.$element = this.getChooseLayout();
    this.selectedRecords = [];
  }

  chooseWidget.prototype = {
    /***
     * 获取右侧选中的记录
     * @return {[array]} [选中记录]
     */
    getSelectedRecords: function() {
      return this.$rightGrid.jqxDataTable('getRows');
    },

    /**
     * 显示对话框
     * @method show
     * @example
        win.show();
     */
    show: function() {
      if (this.options.insertContainer) {
        $(this.options.insertContainer).html(this.$element);
      } else {
        this.showJqxWindow();
      }
      this.$leftGrid = this.$element.find('.leftGrid');
      this.$rightGrid = this.$element.find('.rightGrid');
      this.initSelectedRecords(this.options.rightLocalData);
      this.initLeftTable();
      this.initRightTable();
      this.bindSearchEvent();
    },

    /**
     * 关闭对话框
     * @method close
     * @example
        win.close();
     */
    close: function() {
      this.$element.jqxWindow('close');
    },

    showJqxWindow: function() {
      var self = this;
      $('body').append(this.$element);


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
        draggable: false,
        modalOpacity: 0.3,
        maxHeight: 3000,
        maxWidth: 3000,
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

    /***
     * *初始化selectedRecords
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    initSelectedRecords: function(data) {
      if (!data) {
        return;
      }

      this.selectedRecords = data;
      this.refreshSelectedCount();
    },

    /***
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

    /***
     * 初始化左侧表格
     * @return {[type]} [description]
     */
    initLeftTable: function() {
      var self = this;
      this.leftSource = this.getLeftSource();
      var dataAdapter = null;

      if (this.leftSource.url) {
        dataAdapter = new $.jqx.dataAdapter(this.leftSource, self.options.leftDataAdapter || {
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
        height: 308,
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

    /***
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
        pagerMode: 'advanced',
        localization: Globalize.culture('zh-CN'),
        pageSizeOptions: ['10', '20', '50', '100'],
        width: '100%',
        pagerHeight: 28
      };
    },

    /***
     * 获取左侧数据源
     * @return {[type]} [description]
     */
    getLeftSource: function() {
      var leftSource = null;
      if (this.options.leftLocalData) {
        leftSource = {
          localdata: this.options.leftLocalData,
          datatype: 'array',
          data: this.options.params
        };
      } else {
        leftSource = {
          id: 'id',
          datatype: 'json',
          url: this.options.leftSourceUrl,
          type: this.options.type,
          data: this.options.params,
          contentType: 'application/x-www-form-urlencoded; charset=utf-8'
        };
      }

      return leftSource;
    },

    /***
     * 左侧表格新增全选按钮
     * @return {[type]} [description]
     */
    addSelectAllButton: function() {
      var self = this;

      if (this.options.multiSelect === false || this.options.maxSelect !== null) {
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

    /***
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
            self.options.afterSelect(data);
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
          self.refreshSelectedCount();
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

    refreshSelectedCount: function() {
      this.options.showSelectedTip && this.$rightGrid.prev().html("已选中 " + this.selectedRecords.length);
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
        height: 315,
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
          self.refreshSelectedCount();
        }
      });
    },

    /**
     * 清除选择记录
     * @method clear
     * @example
        win.clear();
     */
    clear: function() {
      var self = this;
      var $leftGrid = self.$element.find('.leftGrid');
      var memberRows = self.leftGridRows;
      var selected = self.selectedRecords;
      var obj = $leftGrid.find('.gm-member-user');
      for (var i = 0; i < obj.length; i++) {
        var val = $(obj[i]).jqxCheckBox('val');
        if (val) {
          for (var j = 0; j < self.selectedRecords.length; j++) {
            if (self.selectedRecords[j][id] + '' == memberRows[i][id] + '') {
              $(obj[i]).jqxCheckBox('uncheck');
              self.resetSelectALLStatus();
            }
          }
        }
      }

      selected.splice(0, selected.length);

      self.refreshTable(self.$rightGrid);
      self.options.showSelectedTip && $rightGrid.prev().html("已选中 " + selected.length);
    },

    resetSelectALLStatus: function() {
      if (this.options.multiSelect === false || this.options.maxSelect !== null) {
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
      } else if (selectedLength == obj.length && selectedLength > 0) {
        leftPager.find('.leftgrid-select-all').jqxCheckBox('check');
      } else if (leftPager.find('.leftgrid-select-all').jqxCheckBox('val') === true) {
        leftPager.find('.leftgrid-select-all').jqxCheckBox('indeterminate');
      }
    },

    /**
    * 刷新左侧表格
    * @method reload
    * @param querySetting {object} 可选, 查询条件
    * @param params {object} 可选, 其他参数
    * @example
        win.reload(querySetting, params);
     */
    reload: function(querySetting, params) {
      this.querySetting = querySetting;
      this.params = params;
      if (querySetting.querySetting) {
        this.querySetting = querySetting.querySetting;
      }
      if (querySetting.params) {
        this.params = querySetting.params;
      }
      this.reloadLeftTable();
    },

    reloadLeftTable: function() {
      var self = this;
      var searchKey = $.trim(self.$element.find('.leftSearch').val());

      var localSearchField = this.options.localSearchField.split(',');
      var localData = this.options.leftLocalData;

      if (this.options.searchKeyNeedConvert) {
        searchKey = searchKey.toLowerCase();
      }
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
        if (searchKey) {
          self.leftSource.data[this.options.searchKeyName] = searchKey;
        } else {
          self.leftSource.data && delete self.leftSource.data[this.options.searchKeyName];
        }

        var mergeParams = $.extend({}, self.options.params, self.params, { querySetting: typeof(this.querySetting) === 'object' ? JSON.stringify(this.querySetting) : this.querySetting });
        _.each(_.keys(mergeParams), function(key) {
          self.leftSource.data[key] = mergeParams[key];
        });
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
      var $dom = $('<div>' +
        '<div class="head"></div>' +
        '<div>' +
        '<div class="content">' +
        '   <div class="content-top">' + this.options.topHtml + '</div>' +
        '   <div class="gm-add-block bh-clearfix">' +
        '        <div class="bh-col-md-6" style="background: #fff;padding-left:0px;padding-right:0px;">' +
        '            <div class="gm-add-search bh-mb-8" style="margin:7px 8px 0 8px">' +
        '                <input class="leftSearch" type="text" placeholder="' + this.options.placeholder + '">' +
        '                 <button style="border:0px;width:0px;height:0px;position: absolute;padding:0;top: 0px;"></button>' +
        '              <a href="javascript:void(0)"><i class="iconfont">&#xe895;</i></a>' +
        '          </div>' +
        '         <div class="noBorderGrid leftGrid leftgrid-container"></div>' +
        '      </div>' +
        '     <div class="bh-col-md-6 rightgrid-container">' +
        (this.options.showSelectedTip === false ? '<h3>已选择字段</h3>' : ('<h3>已选中 ' + selectedLength + '</h3>')) +
        '           <div class="noBorderGrid transparentGrid rightGrid"></div>' +
        '      </div>' +
        '</div>' +
        '<div class="content-bottom">' + this.options.bottomHtml + '</div>' +
        '<div id="buttons" style="position: absolute;bottom:32px;width: 100%;left: 0;float: right;padding: 0 24px;">' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>');

      if (this.options.insertContainer) {
        return $dom;
      }
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

      btns = this.options.buttons || btns;

      for (var i = btns.length - 1; i >= 0; i--) {
        var btn = $('<button class="bh-btn ' + btns[i].className + ' bh-pull-right">' + btns[i].text + '</button>');
        if (btns[i].callback) {
          var cb = btns[i].callback;
          btn.data("callback", cb);
          btn.click(function() {
            var cb = $(this).data("callback");
            var needClose = cb.apply($dom, [$dom]);
            if (needClose !== false){
              $dom.jqxWindow('close');
            }
          });
        }
        $("#buttons", $dom).append(btn);
      }

      return $dom;
    }
  };

})(jQuery);

//! moment.js
//! version : 2.8.4
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com

(function (undefined) {
    /************************************
     Constants
     ************************************/

    var moment,
        VERSION = '2.8.4',
    // the global-scope this is NOT the global object in Node.js
        globalScope = typeof global !== 'undefined' ? global : this,
        oldGlobalMoment,
        round = Math.round,
        hasOwnProperty = Object.prototype.hasOwnProperty,
        i,

        YEAR = 0,
        MONTH = 1,
        DATE = 2,
        HOUR = 3,
        MINUTE = 4,
        SECOND = 5,
        MILLISECOND = 6,

    // internal storage for locale config files
        locales = {},

    // extra moment internal properties (plugins register props here)
        momentProperties = [],

    // check for nodeJS
        hasModule = (typeof module !== 'undefined' && module && module.exports),

    // ASP.NET json date format regex
        aspNetJsonRegex = /^\/?Date\((\-?\d+)/i,
        aspNetTimeSpanJsonRegex = /(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/,

    // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
    // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
        isoDurationRegex = /^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/,

    // format tokens
        formattingTokens = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Q|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,4}|x|X|zz?|ZZ?|.)/g,
        localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g,

    // parsing token regexes
        parseTokenOneOrTwoDigits = /\d\d?/, // 0 - 99
        parseTokenOneToThreeDigits = /\d{1,3}/, // 0 - 999
        parseTokenOneToFourDigits = /\d{1,4}/, // 0 - 9999
        parseTokenOneToSixDigits = /[+\-]?\d{1,6}/, // -999,999 - 999,999
        parseTokenDigits = /\d+/, // nonzero number of digits
        parseTokenWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i, // any word (or two) characters or numbers including two/three word month in arabic.
        parseTokenTimezone = /Z|[\+\-]\d\d:?\d\d/gi, // +00:00 -00:00 +0000 -0000 or Z
        parseTokenT = /T/i, // T (ISO separator)
        parseTokenOffsetMs = /[\+\-]?\d+/, // 1234567890123
        parseTokenTimestampMs = /[\+\-]?\d+(\.\d{1,3})?/, // 123456789 123456789.123

    //strict parsing regexes
        parseTokenOneDigit = /\d/, // 0 - 9
        parseTokenTwoDigits = /\d\d/, // 00 - 99
        parseTokenThreeDigits = /\d{3}/, // 000 - 999
        parseTokenFourDigits = /\d{4}/, // 0000 - 9999
        parseTokenSixDigits = /[+-]?\d{6}/, // -999,999 - 999,999
        parseTokenSignedNumber = /[+-]?\d+/, // -inf - inf

    // iso 8601 regex
    // 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
        isoRegex = /^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/,

        isoFormat = 'YYYY-MM-DDTHH:mm:ssZ',

        isoDates = [
            ['YYYYYY-MM-DD', /[+-]\d{6}-\d{2}-\d{2}/],
            ['YYYY-MM-DD', /\d{4}-\d{2}-\d{2}/],
            ['GGGG-[W]WW-E', /\d{4}-W\d{2}-\d/],
            ['GGGG-[W]WW', /\d{4}-W\d{2}/],
            ['YYYY-DDD', /\d{4}-\d{3}/]
        ],

    // iso time formats and regexes
        isoTimes = [
            ['HH:mm:ss.SSSS', /(T| )\d\d:\d\d:\d\d\.\d+/],
            ['HH:mm:ss', /(T| )\d\d:\d\d:\d\d/],
            ['HH:mm', /(T| )\d\d:\d\d/],
            ['HH', /(T| )\d\d/]
        ],

    // timezone chunker '+10:00' > ['10', '00'] or '-1530' > ['-15', '30']
        parseTimezoneChunker = /([\+\-]|\d\d)/gi,

    // getter and setter names
        proxyGettersAndSetters = 'Date|Hours|Minutes|Seconds|Milliseconds'.split('|'),
        unitMillisecondFactors = {
            'Milliseconds': 1,
            'Seconds': 1e3,
            'Minutes': 6e4,
            'Hours': 36e5,
            'Days': 864e5,
            'Months': 2592e6,
            'Years': 31536e6
        },

        unitAliases = {
            ms: 'millisecond',
            s: 'second',
            m: 'minute',
            h: 'hour',
            d: 'day',
            D: 'date',
            w: 'week',
            W: 'isoWeek',
            M: 'month',
            Q: 'quarter',
            y: 'year',
            DDD: 'dayOfYear',
            e: 'weekday',
            E: 'isoWeekday',
            gg: 'weekYear',
            GG: 'isoWeekYear'
        },

        camelFunctions = {
            dayofyear: 'dayOfYear',
            isoweekday: 'isoWeekday',
            isoweek: 'isoWeek',
            weekyear: 'weekYear',
            isoweekyear: 'isoWeekYear'
        },

    // format function strings
        formatFunctions = {},

    // default relative time thresholds
        relativeTimeThresholds = {
            s: 45,  // seconds to minute
            m: 45,  // minutes to hour
            h: 22,  // hours to day
            d: 26,  // days to month
            M: 11   // months to year
        },

    // tokens to ordinalize and pad
        ordinalizeTokens = 'DDD w W M D d'.split(' '),
        paddedTokens = 'M D H h m s w W'.split(' '),

        formatTokenFunctions = {
            M: function () {
                return this.month() + 1;
            },
            MMM: function (format) {
                return this.localeData().monthsShort(this, format);
            },
            MMMM: function (format) {
                return this.localeData().months(this, format);
            },
            D: function () {
                return this.date();
            },
            DDD: function () {
                return this.dayOfYear();
            },
            d: function () {
                return this.day();
            },
            dd: function (format) {
                return this.localeData().weekdaysMin(this, format);
            },
            ddd: function (format) {
                return this.localeData().weekdaysShort(this, format);
            },
            dddd: function (format) {
                return this.localeData().weekdays(this, format);
            },
            w: function () {
                return this.week();
            },
            W: function () {
                return this.isoWeek();
            },
            YY: function () {
                return leftZeroFill(this.year() % 100, 2);
            },
            YYYY: function () {
                return leftZeroFill(this.year(), 4);
            },
            YYYYY: function () {
                return leftZeroFill(this.year(), 5);
            },
            YYYYYY: function () {
                var y = this.year(), sign = y >= 0 ? '+' : '-';
                return sign + leftZeroFill(Math.abs(y), 6);
            },
            gg: function () {
                return leftZeroFill(this.weekYear() % 100, 2);
            },
            gggg: function () {
                return leftZeroFill(this.weekYear(), 4);
            },
            ggggg: function () {
                return leftZeroFill(this.weekYear(), 5);
            },
            GG: function () {
                return leftZeroFill(this.isoWeekYear() % 100, 2);
            },
            GGGG: function () {
                return leftZeroFill(this.isoWeekYear(), 4);
            },
            GGGGG: function () {
                return leftZeroFill(this.isoWeekYear(), 5);
            },
            e: function () {
                return this.weekday();
            },
            E: function () {
                return this.isoWeekday();
            },
            a: function () {
                return this.localeData().meridiem(this.hours(), this.minutes(), true);
            },
            A: function () {
                return this.localeData().meridiem(this.hours(), this.minutes(), false);
            },
            H: function () {
                return this.hours();
            },
            h: function () {
                return this.hours() % 12 || 12;
            },
            m: function () {
                return this.minutes();
            },
            s: function () {
                return this.seconds();
            },
            S: function () {
                return toInt(this.milliseconds() / 100);
            },
            SS: function () {
                return leftZeroFill(toInt(this.milliseconds() / 10), 2);
            },
            SSS: function () {
                return leftZeroFill(this.milliseconds(), 3);
            },
            SSSS: function () {
                return leftZeroFill(this.milliseconds(), 3);
            },
            Z: function () {
                var a = -this.zone(),
                    b = '+';
                if (a < 0) {
                    a = -a;
                    b = '-';
                }
                return b + leftZeroFill(toInt(a / 60), 2) + ':' + leftZeroFill(toInt(a) % 60, 2);
            },
            ZZ: function () {
                var a = -this.zone(),
                    b = '+';
                if (a < 0) {
                    a = -a;
                    b = '-';
                }
                return b + leftZeroFill(toInt(a / 60), 2) + leftZeroFill(toInt(a) % 60, 2);
            },
            z: function () {
                return this.zoneAbbr();
            },
            zz: function () {
                return this.zoneName();
            },
            x: function () {
                return this.valueOf();
            },
            X: function () {
                return this.unix();
            },
            Q: function () {
                return this.quarter();
            }
        },

        deprecations = {},

        lists = ['months', 'monthsShort', 'weekdays', 'weekdaysShort', 'weekdaysMin'];

    // Pick the first defined of two or three arguments. dfl comes from
    // default.
    function dfl(a, b, c) {
        switch (arguments.length) {
            case 2:
                return a != null ? a : b;
            case 3:
                return a != null ? a : b != null ? b : c;
            default:
                throw new Error('Implement me');
        }
    }

    function hasOwnProp(a, b) {
        return hasOwnProperty.call(a, b);
    }

    function defaultParsingFlags() {
        // We need to deep clone this object, and es5 standard is not very
        // helpful.
        return {
            empty: false,
            unusedTokens: [],
            unusedInput: [],
            overflow: -2,
            charsLeftOver: 0,
            nullInput: false,
            invalidMonth: null,
            invalidFormat: false,
            userInvalidated: false,
            iso: false
        };
    }

    function printMsg(msg) {
        if (moment.suppressDeprecationWarnings === false &&
            typeof console !== 'undefined' && console.warn) {
            console.warn('Deprecation warning: ' + msg);
        }
    }

    function deprecate(msg, fn) {
        var firstTime = true;
        return extend(function () {
            if (firstTime) {
                printMsg(msg);
                firstTime = false;
            }
            return fn.apply(this, arguments);
        }, fn);
    }

    function deprecateSimple(name, msg) {
        if (!deprecations[name]) {
            printMsg(msg);
            deprecations[name] = true;
        }
    }

    function padToken(func, count) {
        return function (a) {
            return leftZeroFill(func.call(this, a), count);
        };
    }

    function ordinalizeToken(func, period) {
        return function (a) {
            return this.localeData().ordinal(func.call(this, a), period);
        };
    }

    while (ordinalizeTokens.length) {
        i = ordinalizeTokens.pop();
        formatTokenFunctions[i + 'o'] = ordinalizeToken(formatTokenFunctions[i], i);
    }
    while (paddedTokens.length) {
        i = paddedTokens.pop();
        formatTokenFunctions[i + i] = padToken(formatTokenFunctions[i], 2);
    }
    formatTokenFunctions.DDDD = padToken(formatTokenFunctions.DDD, 3);


    /************************************
     Constructors
     ************************************/

    function Locale() {
    }

    // Moment prototype object
    function Moment(config, skipOverflow) {
        if (skipOverflow !== false) {
            checkOverflow(config);
        }
        copyConfig(this, config);
        this._d = new Date(+config._d);
    }

    // Duration Constructor
    function Duration(duration) {
        var normalizedInput = normalizeObjectUnits(duration),
            years = normalizedInput.year || 0,
            quarters = normalizedInput.quarter || 0,
            months = normalizedInput.month || 0,
            weeks = normalizedInput.week || 0,
            days = normalizedInput.day || 0,
            hours = normalizedInput.hour || 0,
            minutes = normalizedInput.minute || 0,
            seconds = normalizedInput.second || 0,
            milliseconds = normalizedInput.millisecond || 0;

        // representation for dateAddRemove
        this._milliseconds = +milliseconds +
            seconds * 1e3 + // 1000
            minutes * 6e4 + // 1000 * 60
            hours * 36e5; // 1000 * 60 * 60
        // Because of dateAddRemove treats 24 hours as different from a
        // day when working around DST, we need to store them separately
        this._days = +days +
            weeks * 7;
        // It is impossible translate months into days without knowing
        // which months you are are talking about, so we have to store
        // it separately.
        this._months = +months +
            quarters * 3 +
            years * 12;

        this._data = {};

        this._locale = moment.localeData();

        this._bubble();
    }

    /************************************
     Helpers
     ************************************/


    function extend(a, b) {
        for (var i in b) {
            if (hasOwnProp(b, i)) {
                a[i] = b[i];
            }
        }

        if (hasOwnProp(b, 'toString')) {
            a.toString = b.toString;
        }

        if (hasOwnProp(b, 'valueOf')) {
            a.valueOf = b.valueOf;
        }

        return a;
    }

    function copyConfig(to, from) {
        var i, prop, val;

        if (typeof from._isAMomentObject !== 'undefined') {
            to._isAMomentObject = from._isAMomentObject;
        }
        if (typeof from._i !== 'undefined') {
            to._i = from._i;
        }
        if (typeof from._f !== 'undefined') {
            to._f = from._f;
        }
        if (typeof from._l !== 'undefined') {
            to._l = from._l;
        }
        if (typeof from._strict !== 'undefined') {
            to._strict = from._strict;
        }
        if (typeof from._tzm !== 'undefined') {
            to._tzm = from._tzm;
        }
        if (typeof from._isUTC !== 'undefined') {
            to._isUTC = from._isUTC;
        }
        if (typeof from._offset !== 'undefined') {
            to._offset = from._offset;
        }
        if (typeof from._pf !== 'undefined') {
            to._pf = from._pf;
        }
        if (typeof from._locale !== 'undefined') {
            to._locale = from._locale;
        }

        if (momentProperties.length > 0) {
            for (i in momentProperties) {
                prop = momentProperties[i];
                val = from[prop];
                if (typeof val !== 'undefined') {
                    to[prop] = val;
                }
            }
        }

        return to;
    }

    function absRound(number) {
        if (number < 0) {
            return Math.ceil(number);
        } else {
            return Math.floor(number);
        }
    }

    // left zero fill a number
    // see http://jsperf.com/left-zero-filling for performance comparison
    function leftZeroFill(number, targetLength, forceSign) {
        var output = '' + Math.abs(number),
            sign = number >= 0;

        while (output.length < targetLength) {
            output = '0' + output;
        }
        return (sign ? (forceSign ? '+' : '') : '-') + output;
    }

    function positiveMomentsDifference(base, other) {
        var res = {milliseconds: 0, months: 0};

        res.months = other.month() - base.month() +
            (other.year() - base.year()) * 12;
        if (base.clone().add(res.months, 'M').isAfter(other)) {
            --res.months;
        }

        res.milliseconds = +other - +(base.clone().add(res.months, 'M'));

        return res;
    }

    function momentsDifference(base, other) {
        var res;
        other = makeAs(other, base);
        if (base.isBefore(other)) {
            res = positiveMomentsDifference(base, other);
        } else {
            res = positiveMomentsDifference(other, base);
            res.milliseconds = -res.milliseconds;
            res.months = -res.months;
        }

        return res;
    }

    // TODO: remove 'name' arg after deprecation is removed
    function createAdder(direction, name) {
        return function (val, period) {
            var dur, tmp;
            //invert the arguments, but complain about it
            if (period !== null && !isNaN(+period)) {
                deprecateSimple(name, 'moment().' + name + '(period, number) is deprecated. Please use moment().' + name + '(number, period).');
                tmp = val;
                val = period;
                period = tmp;
            }

            val = typeof val === 'string' ? +val : val;
            dur = moment.duration(val, period);
            addOrSubtractDurationFromMoment(this, dur, direction);
            return this;
        };
    }

    function addOrSubtractDurationFromMoment(mom, duration, isAdding, updateOffset) {
        var milliseconds = duration._milliseconds,
            days = duration._days,
            months = duration._months;
        updateOffset = updateOffset == null ? true : updateOffset;

        if (milliseconds) {
            mom._d.setTime(+mom._d + milliseconds * isAdding);
        }
        if (days) {
            rawSetter(mom, 'Date', rawGetter(mom, 'Date') + days * isAdding);
        }
        if (months) {
            rawMonthSetter(mom, rawGetter(mom, 'Month') + months * isAdding);
        }
        if (updateOffset) {
            moment.updateOffset(mom, days || months);
        }
    }

    // check if is an array
    function isArray(input) {
        return Object.prototype.toString.call(input) === '[object Array]';
    }

    function isDate(input) {
        return Object.prototype.toString.call(input) === '[object Date]' ||
            input instanceof Date;
    }

    // compare two arrays, return the number of differences
    function compareArrays(array1, array2, dontConvert) {
        var len = Math.min(array1.length, array2.length),
            lengthDiff = Math.abs(array1.length - array2.length),
            diffs = 0,
            i;
        for (i = 0; i < len; i++) {
            if ((dontConvert && array1[i] !== array2[i]) ||
                (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
                diffs++;
            }
        }
        return diffs + lengthDiff;
    }

    function normalizeUnits(units) {
        if (units) {
            var lowered = units.toLowerCase().replace(/(.)s$/, '$1');
            units = unitAliases[units] || camelFunctions[lowered] || lowered;
        }
        return units;
    }

    function normalizeObjectUnits(inputObject) {
        var normalizedInput = {},
            normalizedProp,
            prop;

        for (prop in inputObject) {
            if (hasOwnProp(inputObject, prop)) {
                normalizedProp = normalizeUnits(prop);
                if (normalizedProp) {
                    normalizedInput[normalizedProp] = inputObject[prop];
                }
            }
        }

        return normalizedInput;
    }

    function makeList(field) {
        var count, setter;

        if (field.indexOf('week') === 0) {
            count = 7;
            setter = 'day';
        }
        else if (field.indexOf('month') === 0) {
            count = 12;
            setter = 'month';
        }
        else {
            return;
        }

        moment[field] = function (format, index) {
            var i, getter,
                method = moment._locale[field],
                results = [];

            if (typeof format === 'number') {
                index = format;
                format = undefined;
            }

            getter = function (i) {
                var m = moment().utc().set(setter, i);
                return method.call(moment._locale, m, format || '');
            };

            if (index != null) {
                return getter(index);
            }
            else {
                for (i = 0; i < count; i++) {
                    results.push(getter(i));
                }
                return results;
            }
        };
    }

    function toInt(argumentForCoercion) {
        var coercedNumber = +argumentForCoercion,
            value = 0;

        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
            if (coercedNumber >= 0) {
                value = Math.floor(coercedNumber);
            } else {
                value = Math.ceil(coercedNumber);
            }
        }

        return value;
    }

    function daysInMonth(year, month) {
        return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    }

    function weeksInYear(year, dow, doy) {
        return weekOfYear(moment([year, 11, 31 + dow - doy]), dow, doy).week;
    }

    function daysInYear(year) {
        return isLeapYear(year) ? 366 : 365;
    }

    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    function checkOverflow(m) {
        var overflow;
        if (m._a && m._pf.overflow === -2) {
            overflow =
                m._a[MONTH] < 0 || m._a[MONTH] > 11 ? MONTH :
                    m._a[DATE] < 1 || m._a[DATE] > daysInMonth(m._a[YEAR], m._a[MONTH]) ? DATE :
                        m._a[HOUR] < 0 || m._a[HOUR] > 24 ||
                        (m._a[HOUR] === 24 && (m._a[MINUTE] !== 0 ||
                        m._a[SECOND] !== 0 ||
                        m._a[MILLISECOND] !== 0)) ? HOUR :
                            m._a[MINUTE] < 0 || m._a[MINUTE] > 59 ? MINUTE :
                                m._a[SECOND] < 0 || m._a[SECOND] > 59 ? SECOND :
                                    m._a[MILLISECOND] < 0 || m._a[MILLISECOND] > 999 ? MILLISECOND :
                                        -1;

            if (m._pf._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
                overflow = DATE;
            }

            m._pf.overflow = overflow;
        }
    }

    function isValid(m) {
        if (m._isValid == null) {
            m._isValid = !isNaN(m._d.getTime()) &&
                m._pf.overflow < 0 && !m._pf.empty && !m._pf.invalidMonth && !m._pf.nullInput && !m._pf.invalidFormat && !m._pf.userInvalidated;

            if (m._strict) {
                m._isValid = m._isValid &&
                    m._pf.charsLeftOver === 0 &&
                    m._pf.unusedTokens.length === 0 &&
                    m._pf.bigHour === undefined;
            }
        }
        return m._isValid;
    }

    function normalizeLocale(key) {
        return key ? key.toLowerCase().replace('_', '-') : key;
    }

    // pick the locale from the array
    // try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
    // substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
    function chooseLocale(names) {
        var i = 0, j, next, locale, split;

        while (i < names.length) {
            split = normalizeLocale(names[i]).split('-');
            j = split.length;
            next = normalizeLocale(names[i + 1]);
            next = next ? next.split('-') : null;
            while (j > 0) {
                locale = loadLocale(split.slice(0, j).join('-'));
                if (locale) {
                    return locale;
                }
                if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
                    //the next array item is better than a shallower substring of this one
                    break;
                }
                j--;
            }
            i++;
        }
        return null;
    }

    function loadLocale(name) {
        var oldLocale = null;
        if (!locales[name] && hasModule) {
            try {
                oldLocale = moment.locale();
                require('./locale/' + name);
                // because defineLocale currently also sets the global locale, we want to undo that for lazy loaded locales
                moment.locale(oldLocale);
            } catch (e) {
            }
        }
        return locales[name];
    }

    // Return a moment from input, that is local/utc/zone equivalent to model.
    function makeAs(input, model) {
        var res, diff;
        if (model._isUTC) {
            res = model.clone();
            diff = (moment.isMoment(input) || isDate(input) ?
                    +input : +moment(input)) - (+res);
            // Use low-level api, because this fn is low-level api.
            res._d.setTime(+res._d + diff);
            moment.updateOffset(res, false);
            return res;
        } else {
            return moment(input).local();
        }
    }

    /************************************
     Locale
     ************************************/


    extend(Locale.prototype, {

        set: function (config) {
            var prop, i;
            for (i in config) {
                prop = config[i];
                if (typeof prop === 'function') {
                    this[i] = prop;
                } else {
                    this['_' + i] = prop;
                }
            }
            // Lenient ordinal parsing accepts just a number in addition to
            // number + (possibly) stuff coming from _ordinalParseLenient.
            this._ordinalParseLenient = new RegExp(this._ordinalParse.source + '|' + /\d{1,2}/.source);
        },

        _months: 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
        months: function (m) {
            return this._months[m.month()];
        },

        _monthsShort: 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
        monthsShort: function (m) {
            return this._monthsShort[m.month()];
        },

        monthsParse: function (monthName, format, strict) {
            var i, mom, regex;

            if (!this._monthsParse) {
                this._monthsParse = [];
                this._longMonthsParse = [];
                this._shortMonthsParse = [];
            }

            for (i = 0; i < 12; i++) {
                // make the regex if we don't have it already
                mom = moment.utc([2000, i]);
                if (strict && !this._longMonthsParse[i]) {
                    this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
                    this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');
                }
                if (!strict && !this._monthsParse[i]) {
                    regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
                    this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
                }
                // test the regex
                if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
                    return i;
                } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
                    return i;
                } else if (!strict && this._monthsParse[i].test(monthName)) {
                    return i;
                }
            }
        },

        _weekdays: 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
        weekdays: function (m) {
            return this._weekdays[m.day()];
        },

        _weekdaysShort: 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
        weekdaysShort: function (m) {
            return this._weekdaysShort[m.day()];
        },

        _weekdaysMin: 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
        weekdaysMin: function (m) {
            return this._weekdaysMin[m.day()];
        },

        weekdaysParse: function (weekdayName) {
            var i, mom, regex;

            if (!this._weekdaysParse) {
                this._weekdaysParse = [];
            }

            for (i = 0; i < 7; i++) {
                // make the regex if we don't have it already
                if (!this._weekdaysParse[i]) {
                    mom = moment([2000, 1]).day(i);
                    regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
                    this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
                }
                // test the regex
                if (this._weekdaysParse[i].test(weekdayName)) {
                    return i;
                }
            }
        },

        _longDateFormat: {
            LTS: 'h:mm:ss A',
            LT: 'h:mm A',
            L: 'MM/DD/YYYY',
            LL: 'MMMM D, YYYY',
            LLL: 'MMMM D, YYYY LT',
            LLLL: 'dddd, MMMM D, YYYY LT'
        },
        longDateFormat: function (key) {
            var output = this._longDateFormat[key];
            if (!output && this._longDateFormat[key.toUpperCase()]) {
                output = this._longDateFormat[key.toUpperCase()].replace(/MMMM|MM|DD|dddd/g, function (val) {
                    return val.slice(1);
                });
                this._longDateFormat[key] = output;
            }
            return output;
        },

        isPM: function (input) {
            // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
            // Using charAt should be more compatible.
            return ((input + '').toLowerCase().charAt(0) === 'p');
        },

        _meridiemParse: /[ap]\.?m?\.?/i,
        meridiem: function (hours, minutes, isLower) {
            if (hours > 11) {
                return isLower ? 'pm' : 'PM';
            } else {
                return isLower ? 'am' : 'AM';
            }
        },

        _calendar: {
            sameDay: '[Today at] LT',
            nextDay: '[Tomorrow at] LT',
            nextWeek: 'dddd [at] LT',
            lastDay: '[Yesterday at] LT',
            lastWeek: '[Last] dddd [at] LT',
            sameElse: 'L'
        },
        calendar: function (key, mom, now) {
            var output = this._calendar[key];
            return typeof output === 'function' ? output.apply(mom, [now]) : output;
        },

        _relativeTime: {
            future: 'in %s',
            past: '%s ago',
            s: 'a few seconds',
            m: 'a minute',
            mm: '%d minutes',
            h: 'an hour',
            hh: '%d hours',
            d: 'a day',
            dd: '%d days',
            M: 'a month',
            MM: '%d months',
            y: 'a year',
            yy: '%d years'
        },

        relativeTime: function (number, withoutSuffix, string, isFuture) {
            var output = this._relativeTime[string];
            return (typeof output === 'function') ?
                output(number, withoutSuffix, string, isFuture) :
                output.replace(/%d/i, number);
        },

        pastFuture: function (diff, output) {
            var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
            return typeof format === 'function' ? format(output) : format.replace(/%s/i, output);
        },

        ordinal: function (number) {
            return this._ordinal.replace('%d', number);
        },
        _ordinal: '%d',
        _ordinalParse: /\d{1,2}/,

        preparse: function (string) {
            return string;
        },

        postformat: function (string) {
            return string;
        },

        week: function (mom) {
            return weekOfYear(mom, this._week.dow, this._week.doy).week;
        },

        _week: {
            dow: 0, // Sunday is the first day of the week.
            doy: 6  // The week that contains Jan 1st is the first week of the year.
        },

        _invalidDate: 'Invalid date',
        invalidDate: function () {
            return this._invalidDate;
        }
    });

    /************************************
     Formatting
     ************************************/


    function removeFormattingTokens(input) {
        if (input.match(/\[[\s\S]/)) {
            return input.replace(/^\[|\]$/g, '');
        }
        return input.replace(/\\/g, '');
    }

    function makeFormatFunction(format) {
        var array = format.match(formattingTokens), i, length;

        for (i = 0, length = array.length; i < length; i++) {
            if (formatTokenFunctions[array[i]]) {
                array[i] = formatTokenFunctions[array[i]];
            } else {
                array[i] = removeFormattingTokens(array[i]);
            }
        }

        return function (mom) {
            var output = '';
            for (i = 0; i < length; i++) {
                output += array[i] instanceof Function ? array[i].call(mom, format) : array[i];
            }
            return output;
        };
    }

    // format date using native date object
    function formatMoment(m, format) {
        if (!m.isValid()) {
            return m.localeData().invalidDate();
        }

        format = expandFormat(format, m.localeData());

        if (!formatFunctions[format]) {
            formatFunctions[format] = makeFormatFunction(format);
        }

        return formatFunctions[format](m);
    }

    function expandFormat(format, locale) {
        var i = 5;

        function replaceLongDateFormatTokens(input) {
            return locale.longDateFormat(input) || input;
        }

        localFormattingTokens.lastIndex = 0;
        while (i >= 0 && localFormattingTokens.test(format)) {
            format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
            localFormattingTokens.lastIndex = 0;
            i -= 1;
        }

        return format;
    }


    /************************************
     Parsing
     ************************************/


    // get the regex to find the next token
    function getParseRegexForToken(token, config) {
        var a, strict = config._strict;
        switch (token) {
            case 'Q':
                return parseTokenOneDigit;
            case 'DDDD':
                return parseTokenThreeDigits;
            case 'YYYY':
            case 'GGGG':
            case 'gggg':
                return strict ? parseTokenFourDigits : parseTokenOneToFourDigits;
            case 'Y':
            case 'G':
            case 'g':
                return parseTokenSignedNumber;
            case 'YYYYYY':
            case 'YYYYY':
            case 'GGGGG':
            case 'ggggg':
                return strict ? parseTokenSixDigits : parseTokenOneToSixDigits;
            case 'S':
                if (strict) {
                    return parseTokenOneDigit;
                }
            /* falls through */
            case 'SS':
                if (strict) {
                    return parseTokenTwoDigits;
                }
            /* falls through */
            case 'SSS':
                if (strict) {
                    return parseTokenThreeDigits;
                }
            /* falls through */
            case 'DDD':
                return parseTokenOneToThreeDigits;
            case 'MMM':
            case 'MMMM':
            case 'dd':
            case 'ddd':
            case 'dddd':
                return parseTokenWord;
            case 'a':
            case 'A':
                return config._locale._meridiemParse;
            case 'x':
                return parseTokenOffsetMs;
            case 'X':
                return parseTokenTimestampMs;
            case 'Z':
            case 'ZZ':
                return parseTokenTimezone;
            case 'T':
                return parseTokenT;
            case 'SSSS':
                return parseTokenDigits;
            case 'MM':
            case 'DD':
            case 'YY':
            case 'GG':
            case 'gg':
            case 'HH':
            case 'hh':
            case 'mm':
            case 'ss':
            case 'ww':
            case 'WW':
                return strict ? parseTokenTwoDigits : parseTokenOneOrTwoDigits;
            case 'M':
            case 'D':
            case 'd':
            case 'H':
            case 'h':
            case 'm':
            case 's':
            case 'w':
            case 'W':
            case 'e':
            case 'E':
                return parseTokenOneOrTwoDigits;
            case 'Do':
                return strict ? config._locale._ordinalParse : config._locale._ordinalParseLenient;
            default :
                a = new RegExp(regexpEscape(unescapeFormat(token.replace('\\', '')), 'i'));
                return a;
        }
    }

    function timezoneMinutesFromString(string) {
        string = string || '';
        var possibleTzMatches = (string.match(parseTokenTimezone) || []),
            tzChunk = possibleTzMatches[possibleTzMatches.length - 1] || [],
            parts = (tzChunk + '').match(parseTimezoneChunker) || ['-', 0, 0],
            minutes = +(parts[1] * 60) + toInt(parts[2]);

        return parts[0] === '+' ? -minutes : minutes;
    }

    // function to convert string input to date
    function addTimeToArrayFromToken(token, input, config) {
        var a, datePartArray = config._a;

        switch (token) {
            // QUARTER
            case 'Q':
                if (input != null) {
                    datePartArray[MONTH] = (toInt(input) - 1) * 3;
                }
                break;
            // MONTH
            case 'M' : // fall through to MM
            case 'MM' :
                if (input != null) {
                    datePartArray[MONTH] = toInt(input) - 1;
                }
                break;
            case 'MMM' : // fall through to MMMM
            case 'MMMM' :
                a = config._locale.monthsParse(input, token, config._strict);
                // if we didn't find a month name, mark the date as invalid.
                if (a != null) {
                    datePartArray[MONTH] = a;
                } else {
                    config._pf.invalidMonth = input;
                }
                break;
            // DAY OF MONTH
            case 'D' : // fall through to DD
            case 'DD' :
                if (input != null) {
                    datePartArray[DATE] = toInt(input);
                }
                break;
            case 'Do' :
                if (input != null) {
                    datePartArray[DATE] = toInt(parseInt(
                        input.match(/\d{1,2}/)[0], 10));
                }
                break;
            // DAY OF YEAR
            case 'DDD' : // fall through to DDDD
            case 'DDDD' :
                if (input != null) {
                    config._dayOfYear = toInt(input);
                }

                break;
            // YEAR
            case 'YY' :
                datePartArray[YEAR] = moment.parseTwoDigitYear(input);
                break;
            case 'YYYY' :
            case 'YYYYY' :
            case 'YYYYYY' :
                datePartArray[YEAR] = toInt(input);
                break;
            // AM / PM
            case 'a' : // fall through to A
            case 'A' :
                config._isPm = config._locale.isPM(input);
                break;
            // HOUR
            case 'h' : // fall through to hh
            case 'hh' :
                config._pf.bigHour = true;
            /* falls through */
            case 'H' : // fall through to HH
            case 'HH' :
                datePartArray[HOUR] = toInt(input);
                break;
            // MINUTE
            case 'm' : // fall through to mm
            case 'mm' :
                datePartArray[MINUTE] = toInt(input);
                break;
            // SECOND
            case 's' : // fall through to ss
            case 'ss' :
                datePartArray[SECOND] = toInt(input);
                break;
            // MILLISECOND
            case 'S' :
            case 'SS' :
            case 'SSS' :
            case 'SSSS' :
                datePartArray[MILLISECOND] = toInt(('0.' + input) * 1000);
                break;
            // UNIX OFFSET (MILLISECONDS)
            case 'x':
                config._d = new Date(toInt(input));
                break;
            // UNIX TIMESTAMP WITH MS
            case 'X':
                config._d = new Date(parseFloat(input) * 1000);
                break;
            // TIMEZONE
            case 'Z' : // fall through to ZZ
            case 'ZZ' :
                config._useUTC = true;
                config._tzm = timezoneMinutesFromString(input);
                break;
            // WEEKDAY - human
            case 'dd':
            case 'ddd':
            case 'dddd':
                a = config._locale.weekdaysParse(input);
                // if we didn't get a weekday name, mark the date as invalid
                if (a != null) {
                    config._w = config._w || {};
                    config._w['d'] = a;
                } else {
                    config._pf.invalidWeekday = input;
                }
                break;
            // WEEK, WEEK DAY - numeric
            case 'w':
            case 'ww':
            case 'W':
            case 'WW':
            case 'd':
            case 'e':
            case 'E':
                token = token.substr(0, 1);
            /* falls through */
            case 'gggg':
            case 'GGGG':
            case 'GGGGG':
                token = token.substr(0, 2);
                if (input) {
                    config._w = config._w || {};
                    config._w[token] = toInt(input);
                }
                break;
            case 'gg':
            case 'GG':
                config._w = config._w || {};
                config._w[token] = moment.parseTwoDigitYear(input);
        }
    }

    function dayOfYearFromWeekInfo(config) {
        var w, weekYear, week, weekday, dow, doy, temp;

        w = config._w;
        if (w.GG != null || w.W != null || w.E != null) {
            dow = 1;
            doy = 4;

            // TODO: We need to take the current isoWeekYear, but that depends on
            // how we interpret now (local, utc, fixed offset). So create
            // a now version of current config (take local/utc/offset flags, and
            // create now).
            weekYear = dfl(w.GG, config._a[YEAR], weekOfYear(moment(), 1, 4).year);
            week = dfl(w.W, 1);
            weekday = dfl(w.E, 1);
        } else {
            dow = config._locale._week.dow;
            doy = config._locale._week.doy;

            weekYear = dfl(w.gg, config._a[YEAR], weekOfYear(moment(), dow, doy).year);
            week = dfl(w.w, 1);

            if (w.d != null) {
                // weekday -- low day numbers are considered next week
                weekday = w.d;
                if (weekday < dow) {
                    ++week;
                }
            } else if (w.e != null) {
                // local weekday -- counting starts from begining of week
                weekday = w.e + dow;
            } else {
                // default to begining of week
                weekday = dow;
            }
        }
        temp = dayOfYearFromWeeks(weekYear, week, weekday, doy, dow);

        config._a[YEAR] = temp.year;
        config._dayOfYear = temp.dayOfYear;
    }

    // convert an array to a date.
    // the array should mirror the parameters below
    // note: all values past the year are optional and will default to the lowest possible value.
    // [year, month, day , hour, minute, second, millisecond]
    function dateFromConfig(config) {
        var i, date, input = [], currentDate, yearToUse;

        if (config._d) {
            return;
        }

        currentDate = currentDateArray(config);

        //compute day of the year from weeks and weekdays
        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
            dayOfYearFromWeekInfo(config);
        }

        //if the day of the year is set, figure out what it is
        if (config._dayOfYear) {
            yearToUse = dfl(config._a[YEAR], currentDate[YEAR]);

            if (config._dayOfYear > daysInYear(yearToUse)) {
                config._pf._overflowDayOfYear = true;
            }

            date = makeUTCDate(yearToUse, 0, config._dayOfYear);
            config._a[MONTH] = date.getUTCMonth();
            config._a[DATE] = date.getUTCDate();
        }

        // Default to current date.
        // * if no year, month, day of month are given, default to today
        // * if day of month is given, default month and year
        // * if month is given, default only year
        // * if year is given, don't default anything
        for (i = 0; i < 3 && config._a[i] == null; ++i) {
            config._a[i] = input[i] = currentDate[i];
        }

        // Zero out whatever was not defaulted, including time
        for (; i < 7; i++) {
            config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
        }

        // Check for 24:00:00.000
        if (config._a[HOUR] === 24 &&
            config._a[MINUTE] === 0 &&
            config._a[SECOND] === 0 &&
            config._a[MILLISECOND] === 0) {
            config._nextDay = true;
            config._a[HOUR] = 0;
        }

        config._d = (config._useUTC ? makeUTCDate : makeDate).apply(null, input);
        // Apply timezone offset from input. The actual zone can be changed
        // with parseZone.
        if (config._tzm != null) {
            config._d.setUTCMinutes(config._d.getUTCMinutes() + config._tzm);
        }

        if (config._nextDay) {
            config._a[HOUR] = 24;
        }
    }

    function dateFromObject(config) {
        var normalizedInput;

        if (config._d) {
            return;
        }

        normalizedInput = normalizeObjectUnits(config._i);
        config._a = [
            normalizedInput.year,
            normalizedInput.month,
            normalizedInput.day || normalizedInput.date,
            normalizedInput.hour,
            normalizedInput.minute,
            normalizedInput.second,
            normalizedInput.millisecond
        ];

        dateFromConfig(config);
    }

    function currentDateArray(config) {
        var now = new Date();
        if (config._useUTC) {
            return [
                now.getUTCFullYear(),
                now.getUTCMonth(),
                now.getUTCDate()
            ];
        } else {
            return [now.getFullYear(), now.getMonth(), now.getDate()];
        }
    }

    // date from string and format string
    function makeDateFromStringAndFormat(config) {
        if (config._f === moment.ISO_8601) {
            parseISO(config);
            return;
        }

        config._a = [];
        config._pf.empty = true;

        // This array is used to make a Date, either with `new Date` or `Date.UTC`
        var string = '' + config._i,
            i, parsedInput, tokens, token, skipped,
            stringLength = string.length,
            totalParsedInputLength = 0;

        tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];

        for (i = 0; i < tokens.length; i++) {
            token = tokens[i];
            parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
            if (parsedInput) {
                skipped = string.substr(0, string.indexOf(parsedInput));
                if (skipped.length > 0) {
                    config._pf.unusedInput.push(skipped);
                }
                string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
                totalParsedInputLength += parsedInput.length;
            }
            // don't parse if it's not a known token
            if (formatTokenFunctions[token]) {
                if (parsedInput) {
                    config._pf.empty = false;
                }
                else {
                    config._pf.unusedTokens.push(token);
                }
                addTimeToArrayFromToken(token, parsedInput, config);
            }
            else if (config._strict && !parsedInput) {
                config._pf.unusedTokens.push(token);
            }
        }

        // add remaining unparsed input length to the string
        config._pf.charsLeftOver = stringLength - totalParsedInputLength;
        if (string.length > 0) {
            config._pf.unusedInput.push(string);
        }

        // clear _12h flag if hour is <= 12
        if (config._pf.bigHour === true && config._a[HOUR] <= 12) {
            config._pf.bigHour = undefined;
        }
        // handle am pm
        if (config._isPm && config._a[HOUR] < 12) {
            config._a[HOUR] += 12;
        }
        // if is 12 am, change hours to 0
        if (config._isPm === false && config._a[HOUR] === 12) {
            config._a[HOUR] = 0;
        }
        dateFromConfig(config);
        checkOverflow(config);
    }

    function unescapeFormat(s) {
        return s.replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
            return p1 || p2 || p3 || p4;
        });
    }

    // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
    function regexpEscape(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    // date from string and array of format strings
    function makeDateFromStringAndArray(config) {
        var tempConfig,
            bestMoment,

            scoreToBeat,
            i,
            currentScore;

        if (config._f.length === 0) {
            config._pf.invalidFormat = true;
            config._d = new Date(NaN);
            return;
        }

        for (i = 0; i < config._f.length; i++) {
            currentScore = 0;
            tempConfig = copyConfig({}, config);
            if (config._useUTC != null) {
                tempConfig._useUTC = config._useUTC;
            }
            tempConfig._pf = defaultParsingFlags();
            tempConfig._f = config._f[i];
            makeDateFromStringAndFormat(tempConfig);

            if (!isValid(tempConfig)) {
                continue;
            }

            // if there is any input that was not parsed add a penalty for that format
            currentScore += tempConfig._pf.charsLeftOver;

            //or tokens
            currentScore += tempConfig._pf.unusedTokens.length * 10;

            tempConfig._pf.score = currentScore;

            if (scoreToBeat == null || currentScore < scoreToBeat) {
                scoreToBeat = currentScore;
                bestMoment = tempConfig;
            }
        }

        extend(config, bestMoment || tempConfig);
    }

    // date from iso format
    function parseISO(config) {
        var i, l,
            string = config._i,
            match = isoRegex.exec(string);

        if (match) {
            config._pf.iso = true;
            for (i = 0, l = isoDates.length; i < l; i++) {
                if (isoDates[i][1].exec(string)) {
                    // match[5] should be 'T' or undefined
                    config._f = isoDates[i][0] + (match[6] || ' ');
                    break;
                }
            }
            for (i = 0, l = isoTimes.length; i < l; i++) {
                if (isoTimes[i][1].exec(string)) {
                    config._f += isoTimes[i][0];
                    break;
                }
            }
            if (string.match(parseTokenTimezone)) {
                config._f += 'Z';
            }
            makeDateFromStringAndFormat(config);
        } else {
            config._isValid = false;
        }
    }

    // date from iso format or fallback
    function makeDateFromString(config) {
        parseISO(config);
        if (config._isValid === false) {
            delete config._isValid;
            moment.createFromInputFallback(config);
        }
    }

    function map(arr, fn) {
        var res = [], i;
        for (i = 0; i < arr.length; ++i) {
            res.push(fn(arr[i], i));
        }
        return res;
    }

    function makeDateFromInput(config) {
        var input = config._i, matched;
        if (input === undefined) {
            config._d = new Date();
        } else if (isDate(input)) {
            config._d = new Date(+input);
        } else if ((matched = aspNetJsonRegex.exec(input)) !== null) {
            config._d = new Date(+matched[1]);
        } else if (typeof input === 'string') {
            makeDateFromString(config);
        } else if (isArray(input)) {
            config._a = map(input.slice(0), function (obj) {
                return parseInt(obj, 10);
            });
            dateFromConfig(config);
        } else if (typeof(input) === 'object') {
            dateFromObject(config);
        } else if (typeof(input) === 'number') {
            // from milliseconds
            config._d = new Date(input);
        } else {
            moment.createFromInputFallback(config);
        }
    }

    function makeDate(y, m, d, h, M, s, ms) {
        //can't just apply() to create a date:
        //http://stackoverflow.com/questions/181348/instantiating-a-javascript-object-by-calling-prototype-constructor-apply
        var date = new Date(y, m, d, h, M, s, ms);

        //the date constructor doesn't accept years < 1970
        if (y < 1970) {
            date.setFullYear(y);
        }
        return date;
    }

    function makeUTCDate(y) {
        var date = new Date(Date.UTC.apply(null, arguments));
        if (y < 1970) {
            date.setUTCFullYear(y);
        }
        return date;
    }

    function parseWeekday(input, locale) {
        if (typeof input === 'string') {
            if (!isNaN(input)) {
                input = parseInt(input, 10);
            }
            else {
                input = locale.weekdaysParse(input);
                if (typeof input !== 'number') {
                    return null;
                }
            }
        }
        return input;
    }

    /************************************
     Relative Time
     ************************************/


    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
        return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
    }

    function relativeTime(posNegDuration, withoutSuffix, locale) {
        var duration = moment.duration(posNegDuration).abs(),
            seconds = round(duration.as('s')),
            minutes = round(duration.as('m')),
            hours = round(duration.as('h')),
            days = round(duration.as('d')),
            months = round(duration.as('M')),
            years = round(duration.as('y')),

            args = seconds < relativeTimeThresholds.s && ['s', seconds] ||
                minutes === 1 && ['m'] ||
                minutes < relativeTimeThresholds.m && ['mm', minutes] ||
                hours === 1 && ['h'] ||
                hours < relativeTimeThresholds.h && ['hh', hours] ||
                days === 1 && ['d'] ||
                days < relativeTimeThresholds.d && ['dd', days] ||
                months === 1 && ['M'] ||
                months < relativeTimeThresholds.M && ['MM', months] ||
                years === 1 && ['y'] || ['yy', years];

        args[2] = withoutSuffix;
        args[3] = +posNegDuration > 0;
        args[4] = locale;
        return substituteTimeAgo.apply({}, args);
    }


    /************************************
     Week of Year
     ************************************/


    // firstDayOfWeek       0 = sun, 6 = sat
    //                      the day of the week that starts the week
    //                      (usually sunday or monday)
    // firstDayOfWeekOfYear 0 = sun, 6 = sat
    //                      the first week is the week that contains the first
    //                      of this day of the week
    //                      (eg. ISO weeks use thursday (4))
    function weekOfYear(mom, firstDayOfWeek, firstDayOfWeekOfYear) {
        var end = firstDayOfWeekOfYear - firstDayOfWeek,
            daysToDayOfWeek = firstDayOfWeekOfYear - mom.day(),
            adjustedMoment;


        if (daysToDayOfWeek > end) {
            daysToDayOfWeek -= 7;
        }

        if (daysToDayOfWeek < end - 7) {
            daysToDayOfWeek += 7;
        }

        adjustedMoment = moment(mom).add(daysToDayOfWeek, 'd');
        return {
            week: Math.ceil(adjustedMoment.dayOfYear() / 7),
            year: adjustedMoment.year()
        };
    }

    //http://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
    function dayOfYearFromWeeks(year, week, weekday, firstDayOfWeekOfYear, firstDayOfWeek) {
        var d = makeUTCDate(year, 0, 1).getUTCDay(), daysToAdd, dayOfYear;

        d = d === 0 ? 7 : d;
        weekday = weekday != null ? weekday : firstDayOfWeek;
        daysToAdd = firstDayOfWeek - d + (d > firstDayOfWeekOfYear ? 7 : 0) - (d < firstDayOfWeek ? 7 : 0);
        dayOfYear = 7 * (week - 1) + (weekday - firstDayOfWeek) + daysToAdd + 1;

        return {
            year: dayOfYear > 0 ? year : year - 1,
            dayOfYear: dayOfYear > 0 ? dayOfYear : daysInYear(year - 1) + dayOfYear
        };
    }

    /************************************
     Top Level Functions
     ************************************/

    function makeMoment(config) {
        var input = config._i,
            format = config._f,
            res;

        config._locale = config._locale || moment.localeData(config._l);

        if (input === null || (format === undefined && input === '')) {
            return moment.invalid({nullInput: true});
        }

        if (typeof input === 'string') {
            config._i = input = config._locale.preparse(input);
        }

        if (moment.isMoment(input)) {
            return new Moment(input, true);
        } else if (format) {
            if (isArray(format)) {
                makeDateFromStringAndArray(config);
            } else {
                makeDateFromStringAndFormat(config);
            }
        } else {
            makeDateFromInput(config);
        }

        res = new Moment(config);
        if (res._nextDay) {
            // Adding is smart enough around DST
            res.add(1, 'd');
            res._nextDay = undefined;
        }

        return res;
    }

    moment = function (input, format, locale, strict) {
        var c;

        if (typeof(locale) === 'boolean') {
            strict = locale;
            locale = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c = {};
        c._isAMomentObject = true;
        c._i = input;
        c._f = format;
        c._l = locale;
        c._strict = strict;
        c._isUTC = false;
        c._pf = defaultParsingFlags();

        return makeMoment(c);
    };

    moment.suppressDeprecationWarnings = false;

    moment.createFromInputFallback = deprecate(
        'moment construction falls back to js Date. This is ' +
        'discouraged and will be removed in upcoming major ' +
        'release. Please refer to ' +
        'https://github.com/moment/moment/issues/1407 for more info.',
        function (config) {
            config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
        }
    );

    // Pick a moment m from moments so that m[fn](other) is true for all
    // other. This relies on the function fn to be transitive.
    //
    // moments should either be an array of moment objects or an array, whose
    // first element is an array of moment objects.
    function pickBy(fn, moments) {
        var res, i;
        if (moments.length === 1 && isArray(moments[0])) {
            moments = moments[0];
        }
        if (!moments.length) {
            return moment();
        }
        res = moments[0];
        for (i = 1; i < moments.length; ++i) {
            if (moments[i][fn](res)) {
                res = moments[i];
            }
        }
        return res;
    }

    moment.min = function () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isBefore', args);
    };

    moment.max = function () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isAfter', args);
    };

    // creating with utc
    moment.utc = function (input, format, locale, strict) {
        var c;

        if (typeof(locale) === 'boolean') {
            strict = locale;
            locale = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c = {};
        c._isAMomentObject = true;
        c._useUTC = true;
        c._isUTC = true;
        c._l = locale;
        c._i = input;
        c._f = format;
        c._strict = strict;
        c._pf = defaultParsingFlags();

        return makeMoment(c).utc();
    };

    // creating with unix timestamp (in seconds)
    moment.unix = function (input) {
        return moment(input * 1000);
    };

    // duration
    moment.duration = function (input, key) {
        var duration = input,
        // matching against regexp is expensive, do it on demand
            match = null,
            sign,
            ret,
            parseIso,
            diffRes;

        if (moment.isDuration(input)) {
            duration = {
                ms: input._milliseconds,
                d: input._days,
                M: input._months
            };
        } else if (typeof input === 'number') {
            duration = {};
            if (key) {
                duration[key] = input;
            } else {
                duration.milliseconds = input;
            }
        } else if (!!(match = aspNetTimeSpanJsonRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            duration = {
                y: 0,
                d: toInt(match[DATE]) * sign,
                h: toInt(match[HOUR]) * sign,
                m: toInt(match[MINUTE]) * sign,
                s: toInt(match[SECOND]) * sign,
                ms: toInt(match[MILLISECOND]) * sign
            };
        } else if (!!(match = isoDurationRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            parseIso = function (inp) {
                // We'd normally use ~~inp for this, but unfortunately it also
                // converts floats to ints.
                // inp may be undefined, so careful calling replace on it.
                var res = inp && parseFloat(inp.replace(',', '.'));
                // apply sign while we're at it
                return (isNaN(res) ? 0 : res) * sign;
            };
            duration = {
                y: parseIso(match[2]),
                M: parseIso(match[3]),
                d: parseIso(match[4]),
                h: parseIso(match[5]),
                m: parseIso(match[6]),
                s: parseIso(match[7]),
                w: parseIso(match[8])
            };
        } else if (typeof duration === 'object' &&
            ('from' in duration || 'to' in duration)) {
            diffRes = momentsDifference(moment(duration.from), moment(duration.to));

            duration = {};
            duration.ms = diffRes.milliseconds;
            duration.M = diffRes.months;
        }

        ret = new Duration(duration);

        if (moment.isDuration(input) && hasOwnProp(input, '_locale')) {
            ret._locale = input._locale;
        }

        return ret;
    };

    // version number
    moment.version = VERSION;

    // default format
    moment.defaultFormat = isoFormat;

    // constant that refers to the ISO standard
    moment.ISO_8601 = function () {
    };

    // Plugins that add properties should also add the key here (null value),
    // so we can properly clone ourselves.
    moment.momentProperties = momentProperties;

    // This function will be called whenever a moment is mutated.
    // It is intended to keep the offset in sync with the timezone.
    moment.updateOffset = function () {
    };

    // This function allows you to set a threshold for relative time strings
    moment.relativeTimeThreshold = function (threshold, limit) {
        if (relativeTimeThresholds[threshold] === undefined) {
            return false;
        }
        if (limit === undefined) {
            return relativeTimeThresholds[threshold];
        }
        relativeTimeThresholds[threshold] = limit;
        return true;
    };

    moment.lang = deprecate(
        'moment.lang is deprecated. Use moment.locale instead.',
        function (key, value) {
            return moment.locale(key, value);
        }
    );

    // This function will load locale and then set the global locale.  If
    // no arguments are passed in, it will simply return the current global
    // locale key.
    moment.locale = function (key, values) {
        var data;
        if (key) {
            if (typeof(values) !== 'undefined') {
                data = moment.defineLocale(key, values);
            }
            else {
                data = moment.localeData(key);
            }

            if (data) {
                moment.duration._locale = moment._locale = data;
            }
        }

        return moment._locale._abbr;
    };

    moment.defineLocale = function (name, values) {
        if (values !== null) {
            values.abbr = name;
            if (!locales[name]) {
                locales[name] = new Locale();
            }
            locales[name].set(values);

            // backwards compat for now: also set the locale
            moment.locale(name);

            return locales[name];
        } else {
            // useful for testing
            delete locales[name];
            return null;
        }
    };

    moment.langData = deprecate(
        'moment.langData is deprecated. Use moment.localeData instead.',
        function (key) {
            return moment.localeData(key);
        }
    );

    // returns locale data
    moment.localeData = function (key) {
        var locale;

        if (key && key._locale && key._locale._abbr) {
            key = key._locale._abbr;
        }

        if (!key) {
            return moment._locale;
        }

        if (!isArray(key)) {
            //short-circuit everything else
            locale = loadLocale(key);
            if (locale) {
                return locale;
            }
            key = [key];
        }

        return chooseLocale(key);
    };

    // compare moment object
    moment.isMoment = function (obj) {
        return obj instanceof Moment ||
            (obj != null && hasOwnProp(obj, '_isAMomentObject'));
    };

    // for typechecking Duration objects
    moment.isDuration = function (obj) {
        return obj instanceof Duration;
    };

    for (i = lists.length - 1; i >= 0; --i) {
        makeList(lists[i]);
    }

    moment.normalizeUnits = function (units) {
        return normalizeUnits(units);
    };

    moment.invalid = function (flags) {
        var m = moment.utc(NaN);
        if (flags != null) {
            extend(m._pf, flags);
        }
        else {
            m._pf.userInvalidated = true;
        }

        return m;
    };

    moment.parseZone = function () {
        return moment.apply(null, arguments).parseZone();
    };

    moment.parseTwoDigitYear = function (input) {
        return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
    };

    /************************************
     Moment Prototype
     ************************************/


    extend(moment.fn = Moment.prototype, {

        clone: function () {
            return moment(this);
        },

        valueOf: function () {
            return +this._d + ((this._offset || 0) * 60000);
        },

        unix: function () {
            return Math.floor(+this / 1000);
        },

        toString: function () {
            return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
        },

        toDate: function () {
            return this._offset ? new Date(+this) : this._d;
        },

        toISOString: function () {
            var m = moment(this).utc();
            if (0 < m.year() && m.year() <= 9999) {
                if ('function' === typeof Date.prototype.toISOString) {
                    // native implementation is ~50x faster, use it when we can
                    return this.toDate().toISOString();
                } else {
                    return formatMoment(m, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
                }
            } else {
                return formatMoment(m, 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
            }
        },

        toArray: function () {
            var m = this;
            return [
                m.year(),
                m.month(),
                m.date(),
                m.hours(),
                m.minutes(),
                m.seconds(),
                m.milliseconds()
            ];
        },

        isValid: function () {
            return isValid(this);
        },

        isDSTShifted: function () {
            if (this._a) {
                return this.isValid() && compareArrays(this._a, (this._isUTC ? moment.utc(this._a) : moment(this._a)).toArray()) > 0;
            }

            return false;
        },

        parsingFlags: function () {
            return extend({}, this._pf);
        },

        invalidAt: function () {
            return this._pf.overflow;
        },

        utc: function (keepLocalTime) {
            return this.zone(0, keepLocalTime);
        },

        local: function (keepLocalTime) {
            if (this._isUTC) {
                this.zone(0, keepLocalTime);
                this._isUTC = false;

                if (keepLocalTime) {
                    this.add(this._dateTzOffset(), 'm');
                }
            }
            return this;
        },

        format: function (inputString) {
            var output = formatMoment(this, inputString || moment.defaultFormat);
            return this.localeData().postformat(output);
        },

        add: createAdder(1, 'add'),

        subtract: createAdder(-1, 'subtract'),

        diff: function (input, units, asFloat) {
            var that = makeAs(input, this),
                zoneDiff = (this.zone() - that.zone()) * 6e4,
                diff, output, daysAdjust;

            units = normalizeUnits(units);

            if (units === 'year' || units === 'month') {
                // average number of days in the months in the given dates
                diff = (this.daysInMonth() + that.daysInMonth()) * 432e5; // 24 * 60 * 60 * 1000 / 2
                // difference in months
                output = ((this.year() - that.year()) * 12) + (this.month() - that.month());
                // adjust by taking difference in days, average number of days
                // and dst in the given months.
                daysAdjust = (this - moment(this).startOf('month')) -
                    (that - moment(that).startOf('month'));
                // same as above but with zones, to negate all dst
                daysAdjust -= ((this.zone() - moment(this).startOf('month').zone()) -
                    (that.zone() - moment(that).startOf('month').zone())) * 6e4;
                output += daysAdjust / diff;
                if (units === 'year') {
                    output = output / 12;
                }
            } else {
                diff = (this - that);
                output = units === 'second' ? diff / 1e3 : // 1000
                    units === 'minute' ? diff / 6e4 : // 1000 * 60
                        units === 'hour' ? diff / 36e5 : // 1000 * 60 * 60
                            units === 'day' ? (diff - zoneDiff) / 864e5 : // 1000 * 60 * 60 * 24, negate dst
                                units === 'week' ? (diff - zoneDiff) / 6048e5 : // 1000 * 60 * 60 * 24 * 7, negate dst
                                    diff;
            }
            return asFloat ? output : absRound(output);
        },

        from: function (time, withoutSuffix) {
            return moment.duration({to: this, from: time}).locale(this.locale()).humanize(!withoutSuffix);
        },

        fromNow: function (withoutSuffix) {
            return this.from(moment(), withoutSuffix);
        },

        calendar: function (time) {
            // We want to compare the start of today, vs this.
            // Getting start-of-today depends on whether we're zone'd or not.
            var now = time || moment(),
                sod = makeAs(now, this).startOf('day'),
                diff = this.diff(sod, 'days', true),
                format = diff < -6 ? 'sameElse' :
                    diff < -1 ? 'lastWeek' :
                        diff < 0 ? 'lastDay' :
                            diff < 1 ? 'sameDay' :
                                diff < 2 ? 'nextDay' :
                                    diff < 7 ? 'nextWeek' : 'sameElse';
            return this.format(this.localeData().calendar(format, this, moment(now)));
        },

        isLeapYear: function () {
            return isLeapYear(this.year());
        },

        isDST: function () {
            return (this.zone() < this.clone().month(0).zone() ||
            this.zone() < this.clone().month(5).zone());
        },

        day: function (input) {
            var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
            if (input != null) {
                input = parseWeekday(input, this.localeData());
                return this.add(input - day, 'd');
            } else {
                return day;
            }
        },

        month: makeAccessor('Month', true),

        startOf: function (units) {
            units = normalizeUnits(units);
            // the following switch intentionally omits break keywords
            // to utilize falling through the cases.
            switch (units) {
                case 'year':
                    this.month(0);
                /* falls through */
                case 'quarter':
                case 'month':
                    this.date(1);
                /* falls through */
                case 'week':
                case 'isoWeek':
                case 'day':
                    this.hours(0);
                /* falls through */
                case 'hour':
                    this.minutes(0);
                /* falls through */
                case 'minute':
                    this.seconds(0);
                /* falls through */
                case 'second':
                    this.milliseconds(0);
                /* falls through */
            }

            // weeks are a special case
            if (units === 'week') {
                this.weekday(0);
            } else if (units === 'isoWeek') {
                this.isoWeekday(1);
            }

            // quarters are also special
            if (units === 'quarter') {
                this.month(Math.floor(this.month() / 3) * 3);
            }

            return this;
        },

        endOf: function (units) {
            units = normalizeUnits(units);
            if (units === undefined || units === 'millisecond') {
                return this;
            }
            return this.startOf(units).add(1, (units === 'isoWeek' ? 'week' : units)).subtract(1, 'ms');
        },

        isAfter: function (input, units) {
            var inputMs;
            units = normalizeUnits(typeof units !== 'undefined' ? units : 'millisecond');
            if (units === 'millisecond') {
                input = moment.isMoment(input) ? input : moment(input);
                return +this > +input;
            } else {
                inputMs = moment.isMoment(input) ? +input : +moment(input);
                return inputMs < +this.clone().startOf(units);
            }
        },

        isBefore: function (input, units) {
            var inputMs;
            units = normalizeUnits(typeof units !== 'undefined' ? units : 'millisecond');
            if (units === 'millisecond') {
                input = moment.isMoment(input) ? input : moment(input);
                return +this < +input;
            } else {
                inputMs = moment.isMoment(input) ? +input : +moment(input);
                return +this.clone().endOf(units) < inputMs;
            }
        },

        isSame: function (input, units) {
            var inputMs;
            units = normalizeUnits(units || 'millisecond');
            if (units === 'millisecond') {
                input = moment.isMoment(input) ? input : moment(input);
                return +this === +input;
            } else {
                inputMs = +moment(input);
                return +(this.clone().startOf(units)) <= inputMs && inputMs <= +(this.clone().endOf(units));
            }
        },

        min: deprecate(
            'moment().min is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548',
            function (other) {
                other = moment.apply(null, arguments);
                return other < this ? this : other;
            }
        ),

        max: deprecate(
            'moment().max is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548',
            function (other) {
                other = moment.apply(null, arguments);
                return other > this ? this : other;
            }
        ),

        // keepLocalTime = true means only change the timezone, without
        // affecting the local hour. So 5:31:26 +0300 --[zone(2, true)]-->
        // 5:31:26 +0200 It is possible that 5:31:26 doesn't exist int zone
        // +0200, so we adjust the time as needed, to be valid.
        //
        // Keeping the time actually adds/subtracts (one hour)
        // from the actual represented time. That is why we call updateOffset
        // a second time. In case it wants us to change the offset again
        // _changeInProgress == true case, then we have to adjust, because
        // there is no such time in the given timezone.
        zone: function (input, keepLocalTime) {
            var offset = this._offset || 0,
                localAdjust;
            if (input != null) {
                if (typeof input === 'string') {
                    input = timezoneMinutesFromString(input);
                }
                if (Math.abs(input) < 16) {
                    input = input * 60;
                }
                if (!this._isUTC && keepLocalTime) {
                    localAdjust = this._dateTzOffset();
                }
                this._offset = input;
                this._isUTC = true;
                if (localAdjust != null) {
                    this.subtract(localAdjust, 'm');
                }
                if (offset !== input) {
                    if (!keepLocalTime || this._changeInProgress) {
                        addOrSubtractDurationFromMoment(this,
                            moment.duration(offset - input, 'm'), 1, false);
                    } else if (!this._changeInProgress) {
                        this._changeInProgress = true;
                        moment.updateOffset(this, true);
                        this._changeInProgress = null;
                    }
                }
            } else {
                return this._isUTC ? offset : this._dateTzOffset();
            }
            return this;
        },

        zoneAbbr: function () {
            return this._isUTC ? 'UTC' : '';
        },

        zoneName: function () {
            return this._isUTC ? 'Coordinated Universal Time' : '';
        },

        parseZone: function () {
            if (this._tzm) {
                this.zone(this._tzm);
            } else if (typeof this._i === 'string') {
                this.zone(this._i);
            }
            return this;
        },

        hasAlignedHourOffset: function (input) {
            if (!input) {
                input = 0;
            }
            else {
                input = moment(input).zone();
            }

            return (this.zone() - input) % 60 === 0;
        },

        daysInMonth: function () {
            return daysInMonth(this.year(), this.month());
        },

        dayOfYear: function (input) {
            var dayOfYear = round((moment(this).startOf('day') - moment(this).startOf('year')) / 864e5) + 1;
            return input == null ? dayOfYear : this.add((input - dayOfYear), 'd');
        },

        quarter: function (input) {
            return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
        },

        weekYear: function (input) {
            var year = weekOfYear(this, this.localeData()._week.dow, this.localeData()._week.doy).year;
            return input == null ? year : this.add((input - year), 'y');
        },

        isoWeekYear: function (input) {
            var year = weekOfYear(this, 1, 4).year;
            return input == null ? year : this.add((input - year), 'y');
        },

        week: function (input) {
            var week = this.localeData().week(this);
            return input == null ? week : this.add((input - week) * 7, 'd');
        },

        isoWeek: function (input) {
            var week = weekOfYear(this, 1, 4).week;
            return input == null ? week : this.add((input - week) * 7, 'd');
        },

        weekday: function (input) {
            var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
            return input == null ? weekday : this.add(input - weekday, 'd');
        },

        isoWeekday: function (input) {
            // behaves the same as moment#day except
            // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
            // as a setter, sunday should belong to the previous week.
            return input == null ? this.day() || 7 : this.day(this.day() % 7 ? input : input - 7);
        },

        isoWeeksInYear: function () {
            return weeksInYear(this.year(), 1, 4);
        },

        weeksInYear: function () {
            var weekInfo = this.localeData()._week;
            return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
        },

        get: function (units) {
            units = normalizeUnits(units);
            return this[units]();
        },

        set: function (units, value) {
            units = normalizeUnits(units);
            if (typeof this[units] === 'function') {
                this[units](value);
            }
            return this;
        },

        // If passed a locale key, it will set the locale for this
        // instance.  Otherwise, it will return the locale configuration
        // variables for this instance.
        locale: function (key) {
            var newLocaleData;

            if (key === undefined) {
                return this._locale._abbr;
            } else {
                newLocaleData = moment.localeData(key);
                if (newLocaleData != null) {
                    this._locale = newLocaleData;
                }
                return this;
            }
        },

        lang: deprecate(
            'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
            function (key) {
                if (key === undefined) {
                    return this.localeData();
                } else {
                    return this.locale(key);
                }
            }
        ),

        localeData: function () {
            return this._locale;
        },

        _dateTzOffset: function () {
            // On Firefox.24 Date#getTimezoneOffset returns a floating point.
            // https://github.com/moment/moment/pull/1871
            return Math.round(this._d.getTimezoneOffset() / 15) * 15;
        }
    });

    function rawMonthSetter(mom, value) {
        var dayOfMonth;

        // TODO: Move this out of here!
        if (typeof value === 'string') {
            value = mom.localeData().monthsParse(value);
            // TODO: Another silent failure?
            if (typeof value !== 'number') {
                return mom;
            }
        }

        dayOfMonth = Math.min(mom.date(),
            daysInMonth(mom.year(), value));
        mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
        return mom;
    }

    function rawGetter(mom, unit) {
        return mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]();
    }

    function rawSetter(mom, unit, value) {
        if (unit === 'Month') {
            return rawMonthSetter(mom, value);
        } else {
            return mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
        }
    }

    function makeAccessor(unit, keepTime) {
        return function (value) {
            if (value != null) {
                rawSetter(this, unit, value);
                moment.updateOffset(this, keepTime);
                return this;
            } else {
                return rawGetter(this, unit);
            }
        };
    }

    moment.fn.millisecond = moment.fn.milliseconds = makeAccessor('Milliseconds', false);
    moment.fn.second = moment.fn.seconds = makeAccessor('Seconds', false);
    moment.fn.minute = moment.fn.minutes = makeAccessor('Minutes', false);
    // Setting the hour should keep the time, because the user explicitly
    // specified which hour he wants. So trying to maintain the same hour (in
    // a new timezone) makes sense. Adding/subtracting hours does not follow
    // this rule.
    moment.fn.hour = moment.fn.hours = makeAccessor('Hours', true);
    // moment.fn.month is defined separately
    moment.fn.date = makeAccessor('Date', true);
    moment.fn.dates = deprecate('dates accessor is deprecated. Use date instead.', makeAccessor('Date', true));
    moment.fn.year = makeAccessor('FullYear', true);
    moment.fn.years = deprecate('years accessor is deprecated. Use year instead.', makeAccessor('FullYear', true));

    // add plural methods
    moment.fn.days = moment.fn.day;
    moment.fn.months = moment.fn.month;
    moment.fn.weeks = moment.fn.week;
    moment.fn.isoWeeks = moment.fn.isoWeek;
    moment.fn.quarters = moment.fn.quarter;

    // add aliased format methods
    moment.fn.toJSON = moment.fn.toISOString;

    /************************************
     Duration Prototype
     ************************************/


    function daysToYears(days) {
        // 400 years have 146097 days (taking into account leap year rules)
        return days * 400 / 146097;
    }

    function yearsToDays(years) {
        // years * 365 + absRound(years / 4) -
        //     absRound(years / 100) + absRound(years / 400);
        return years * 146097 / 400;
    }

    extend(moment.duration.fn = Duration.prototype, {

        _bubble: function () {
            var milliseconds = this._milliseconds,
                days = this._days,
                months = this._months,
                data = this._data,
                seconds, minutes, hours, years = 0;

            // The following code bubbles up values, see the tests for
            // examples of what that means.
            data.milliseconds = milliseconds % 1000;

            seconds = absRound(milliseconds / 1000);
            data.seconds = seconds % 60;

            minutes = absRound(seconds / 60);
            data.minutes = minutes % 60;

            hours = absRound(minutes / 60);
            data.hours = hours % 24;

            days += absRound(hours / 24);

            // Accurately convert days to years, assume start from year 0.
            years = absRound(daysToYears(days));
            days -= absRound(yearsToDays(years));

            // 30 days to a month
            // TODO (iskren): Use anchor date (like 1st Jan) to compute this.
            months += absRound(days / 30);
            days %= 30;

            // 12 months -> 1 year
            years += absRound(months / 12);
            months %= 12;

            data.days = days;
            data.months = months;
            data.years = years;
        },

        abs: function () {
            this._milliseconds = Math.abs(this._milliseconds);
            this._days = Math.abs(this._days);
            this._months = Math.abs(this._months);

            this._data.milliseconds = Math.abs(this._data.milliseconds);
            this._data.seconds = Math.abs(this._data.seconds);
            this._data.minutes = Math.abs(this._data.minutes);
            this._data.hours = Math.abs(this._data.hours);
            this._data.months = Math.abs(this._data.months);
            this._data.years = Math.abs(this._data.years);

            return this;
        },

        weeks: function () {
            return absRound(this.days() / 7);
        },

        valueOf: function () {
            return this._milliseconds +
                this._days * 864e5 +
                (this._months % 12) * 2592e6 +
                toInt(this._months / 12) * 31536e6;
        },

        humanize: function (withSuffix) {
            var output = relativeTime(this, !withSuffix, this.localeData());

            if (withSuffix) {
                output = this.localeData().pastFuture(+this, output);
            }

            return this.localeData().postformat(output);
        },

        add: function (input, val) {
            // supports only 2.0-style add(1, 's') or add(moment)
            var dur = moment.duration(input, val);

            this._milliseconds += dur._milliseconds;
            this._days += dur._days;
            this._months += dur._months;

            this._bubble();

            return this;
        },

        subtract: function (input, val) {
            var dur = moment.duration(input, val);

            this._milliseconds -= dur._milliseconds;
            this._days -= dur._days;
            this._months -= dur._months;

            this._bubble();

            return this;
        },

        get: function (units) {
            units = normalizeUnits(units);
            return this[units.toLowerCase() + 's']();
        },

        as: function (units) {
            var days, months;
            units = normalizeUnits(units);

            if (units === 'month' || units === 'year') {
                days = this._days + this._milliseconds / 864e5;
                months = this._months + daysToYears(days) * 12;
                return units === 'month' ? months : months / 12;
            } else {
                // handle milliseconds separately because of floating point math errors (issue #1867)
                days = this._days + Math.round(yearsToDays(this._months / 12));
                switch (units) {
                    case 'week':
                        return days / 7 + this._milliseconds / 6048e5;
                    case 'day':
                        return days + this._milliseconds / 864e5;
                    case 'hour':
                        return days * 24 + this._milliseconds / 36e5;
                    case 'minute':
                        return days * 24 * 60 + this._milliseconds / 6e4;
                    case 'second':
                        return days * 24 * 60 * 60 + this._milliseconds / 1000;
                    // Math.floor prevents floating point math errors here
                    case 'millisecond':
                        return Math.floor(days * 24 * 60 * 60 * 1000) + this._milliseconds;
                    default:
                        throw new Error('Unknown unit ' + units);
                }
            }
        },

        lang: moment.fn.lang,
        locale: moment.fn.locale,

        toIsoString: deprecate(
            'toIsoString() is deprecated. Please use toISOString() instead ' +
            '(notice the capitals)',
            function () {
                return this.toISOString();
            }
        ),

        toISOString: function () {
            // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
            var years = Math.abs(this.years()),
                months = Math.abs(this.months()),
                days = Math.abs(this.days()),
                hours = Math.abs(this.hours()),
                minutes = Math.abs(this.minutes()),
                seconds = Math.abs(this.seconds() + this.milliseconds() / 1000);

            if (!this.asSeconds()) {
                // this is the same as C#'s (Noda) and python (isodate)...
                // but not other JS (goog.date)
                return 'P0D';
            }

            return (this.asSeconds() < 0 ? '-' : '') +
                'P' +
                (years ? years + 'Y' : '') +
                (months ? months + 'M' : '') +
                (days ? days + 'D' : '') +
                ((hours || minutes || seconds) ? 'T' : '') +
                (hours ? hours + 'H' : '') +
                (minutes ? minutes + 'M' : '') +
                (seconds ? seconds + 'S' : '');
        },

        localeData: function () {
            return this._locale;
        }
    });

    moment.duration.fn.toString = moment.duration.fn.toISOString;

    function makeDurationGetter(name) {
        moment.duration.fn[name] = function () {
            return this._data[name];
        };
    }

    for (i in unitMillisecondFactors) {
        if (hasOwnProp(unitMillisecondFactors, i)) {
            makeDurationGetter(i.toLowerCase());
        }
    }

    moment.duration.fn.asMilliseconds = function () {
        return this.as('ms');
    };
    moment.duration.fn.asSeconds = function () {
        return this.as('s');
    };
    moment.duration.fn.asMinutes = function () {
        return this.as('m');
    };
    moment.duration.fn.asHours = function () {
        return this.as('h');
    };
    moment.duration.fn.asDays = function () {
        return this.as('d');
    };
    moment.duration.fn.asWeeks = function () {
        return this.as('weeks');
    };
    moment.duration.fn.asMonths = function () {
        return this.as('M');
    };
    moment.duration.fn.asYears = function () {
        return this.as('y');
    };

    /************************************
     Default Locale
     ************************************/


    // Set default locale, other locale will inherit from English.
    moment.locale('en', {
        ordinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal: function (number) {
            var b = number % 10,
                output = (toInt(number % 100 / 10) === 1) ? 'th' :
                    (b === 1) ? 'st' :
                        (b === 2) ? 'nd' :
                            (b === 3) ? 'rd' : 'th';
            return number + output;
        }
    });

// moment.js locale configuration
// locale : great britain english (en-gb)
// author : Chris Gedrim : https://github.com/chrisgedrim

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('en-gb', {
            months: 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
            monthsShort: 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
            weekdays: 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
            weekdaysShort: 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
            weekdaysMin: 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
            longDateFormat: {
                LT: 'HH:mm',
                LTS: 'HH:mm:ss',
                L: 'DD/MM/YYYY',
                LL: 'D MMMM YYYY',
                LLL: 'D MMMM YYYY LT',
                LLLL: 'dddd, D MMMM YYYY LT'
            },
            calendar: {
                sameDay: '[Today at] LT',
                nextDay: '[Tomorrow at] LT',
                nextWeek: 'dddd [at] LT',
                lastDay: '[Yesterday at] LT',
                lastWeek: '[Last] dddd [at] LT',
                sameElse: 'L'
            },
            relativeTime: {
                future: 'in %s',
                past: '%s ago',
                s: 'a few seconds',
                m: 'a minute',
                mm: '%d minutes',
                h: 'an hour',
                hh: '%d hours',
                d: 'a day',
                dd: '%d days',
                M: 'a month',
                MM: '%d months',
                y: 'a year',
                yy: '%d years'
            },
            ordinalParse: /\d{1,2}(st|nd|rd|th)/,
            ordinal: function (number) {
                var b = number % 10,
                    output = (~~(number % 100 / 10) === 1) ? 'th' :
                        (b === 1) ? 'st' :
                            (b === 2) ? 'nd' :
                                (b === 3) ? 'rd' : 'th';
                return number + output;
            },
            week: {
                dow: 1, // Monday is the first day of the week.
                doy: 4  // The week that contains Jan 4th is the first week of the year.
            }
        });
    }));

// moment.js locale configuration
// locale : chinese (zh-cn)
// author : suupic : https://github.com/suupic
// author : Zeno Zeng : https://github.com/zenozeng

    (function (factory) {
        factory(moment);
    }(function (moment) {
        return moment.defineLocale('zh-cn', {
            months: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
            monthsShort: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
            weekdays: '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
            weekdaysShort: '周日_周一_周二_周三_周四_周五_周六'.split('_'),
            weekdaysMin: '日_一_二_三_四_五_六'.split('_'),
            longDateFormat: {
                LT: 'Ah点mm',
                LTS: 'Ah点m分s秒',
                L: 'YYYY-MM-DD',
                LL: 'YYYY年MMMD日',
                LLL: 'YYYY年MMMD日LT',
                LLLL: 'YYYY年MMMD日ddddLT',
                l: 'YYYY-MM-DD',
                ll: 'YYYY年MMMD日',
                lll: 'YYYY年MMMD日LT',
                llll: 'YYYY年MMMD日ddddLT'
            },
            meridiem: function (hour, minute, isLower) {
                var hm = hour * 100 + minute;
                if (hm < 600) {
                    return '凌晨';
                } else if (hm < 900) {
                    return '早上';
                } else if (hm < 1130) {
                    return '上午';
                } else if (hm < 1230) {
                    return '中午';
                } else if (hm < 1800) {
                    return '下午';
                } else {
                    return '晚上';
                }
            },
            calendar: {
                sameDay: function () {
                    return this.minutes() === 0 ? '[今天]Ah[点整]' : '[今天]LT';
                },
                nextDay: function () {
                    return this.minutes() === 0 ? '[明天]Ah[点整]' : '[明天]LT';
                },
                lastDay: function () {
                    return this.minutes() === 0 ? '[昨天]Ah[点整]' : '[昨天]LT';
                },
                nextWeek: function () {
                    var startOfWeek, prefix;
                    startOfWeek = moment().startOf('week');
                    prefix = this.unix() - startOfWeek.unix() >= 7 * 24 * 3600 ? '[下]' : '[本]';
                    return this.minutes() === 0 ? prefix + 'dddAh点整' : prefix + 'dddAh点mm';
                },
                lastWeek: function () {
                    var startOfWeek, prefix;
                    startOfWeek = moment().startOf('week');
                    prefix = this.unix() < startOfWeek.unix() ? '[上]' : '[本]';
                    return this.minutes() === 0 ? prefix + 'dddAh点整' : prefix + 'dddAh点mm';
                },
                sameElse: 'LL'
            },
            ordinalParse: /\d{1,2}(日|月|周)/,
            ordinal: function (number, period) {
                switch (period) {
                    case 'd':
                    case 'D':
                    case 'DDD':
                        return number + '日';
                    case 'M':
                        return number + '月';
                    case 'w':
                    case 'W':
                        return number + '周';
                    default:
                        return number;
                }
            },
            relativeTime: {
                future: '%s内',
                past: '%s前',
                s: '几秒',
                m: '1分钟',
                mm: '%d分钟',
                h: '1小时',
                hh: '%d小时',
                d: '1天',
                dd: '%d天',
                M: '1个月',
                MM: '%d个月',
                y: '1年',
                yy: '%d年'
            },
            week: {
                // GB/T 7408-1994《数据元和交换格式·信息交换·日期和时间表示法》与ISO 8601:1988等效
                dow: 1, // Monday is the first day of the week.
                doy: 4  // The week that contains Jan 4th is the first week of the year.
            }
        });
    }));

    moment.locale('en');


    /************************************
     Exposing Moment
     ************************************/

    function makeGlobal(shouldDeprecate) {
        /*global ender:false */
        if (typeof ender !== 'undefined') {
            return;
        }
        oldGlobalMoment = globalScope.moment;
        if (shouldDeprecate) {
            globalScope.moment = deprecate(
                'Accessing Moment through the global scope is ' +
                'deprecated, and will be removed in an upcoming ' +
                'release.',
                moment);
        } else {
            globalScope.moment = moment;
        }
    }

    // CommonJS module is defined
    if (hasModule) {
        module.exports = moment;
    } else if (typeof define === 'function' && define.amd) {
        define('moment', function (require, exports, module) {
            if (module.config && module.config() && module.config().noGlobal === true) {
                // release the global variable
                globalScope.moment = oldGlobalMoment;
            }

            return moment;
        });
        makeGlobal(true);
    } else {
        makeGlobal();
    }
}).call(this);
/**
 * bhCustomizeColumn插件
 */
(function () {
    /**
     * [bhCustomizeColumn description]
     * @param  {[type]} options [description]
     * options:{
     *     model:[],
     *     alwaysHide:[],
     *     title:'', 弹框标题，默认是'添加/删除字段',
     *     columns:[{
     *          name: xxxx,
     *          hidden: true
     *     }],//目标空间所有列
     *     colNum:Int,//一行显示多少列，默认为6
     *     callback: function,确认按钮回调
     *     modelType: '', 可选 grid(默认) form search
     *     params：同BH_UTILS.bhWindow
     * }
     *
     *
     *
     *
     * @return {[type]}         [description]
     */
    $.bhCustomizeColumn = function (options) {
        var opt = $.extend({}, $.bhCustomizeColumn.default, options);
        return new bhCustomizeColumn(opt);
    };

    $.bhCustomizeColumn.default = {
        modelType: 'grid'
    };

    function bhCustomizeColumn(options) {
        this.options = options;
        this.$element = _init(options);
        bindEvent(this.$element, options);
    }

    function _init(options) {
        var model = WIS_EMAP_SERV._sortModel(options.model);
        var columns = options.columns;
        var query = '<div class="bh-customize-column-search bh-mb-16"><input type="text" class="bh-form-control" placeholder="搜索字段"><i class="iconfont icon-search bh-import-step" style="position: absolute;left: 6px;top: 6px;"></i><span class="bh-color-caption"></span></div>';
        var fieldContent = '';
        $(model).each(function () {
            var fieldList = [];
            var showNum = 0;
            var selectedNum = 0;
            var colNum = options.colNum || 6;
            var colWidth = 100 / colNum + '%';
            $.each(columns, function (i, col) {
                if (col.datafield === undefined && col.name) {
                    col.datafield = col.name;
                }
                col.text = options.model[i]['caption'] || col.text; // 自定义显示列 没有caption 会在城text为undefined的情况  zhuhui 2016-9-9
                var name = col.datafield && col.datafield.replace('_DISPLAY', '');
                if ($.type(name) === 'undefined') {
                    return;
                }
                var flag = false;
                options.alwaysHide && options.alwaysHide.length && (flag = $.inArray(name, options.alwaysHide) > -1);

                // 隐藏且固定的字段 不展示
                var hidden = options.model[i]['grid.hidden'] !== undefined ? options.model[i]['grid.hidden'] : options.model[i].hidden;
                var fixed = options.model[i]['grid.fixed'] !== undefined ? options.model[i]['grid.fixed'] : options.model[i].fixed;
                if (hidden && fixed) {
                    flag = true;
                }

                fieldList.push(' <li class="cell bh-bColor-info-3" style="width:' + colWidth + ';' + (flag ? 'display: none;' : '') + '">' +
                        '<div class="bh-checkbox bh-str-cut" title="' + col.text + '"><label><input type="checkbox" name="' + name + '" ' + (col.hidden ? '' : 'checked') + '>' +
                        '<i class="bh-choice-helper"></i>' + '<span class="filed-name">' + col.text + '</span>' +
                        '</label></div>' +
                        '</li>');
                if (!col.hidden) {
                    selectedNum++;
                }
                if (!flag) {
                    showNum++;
                }

            });
            var remainder = showNum % colNum;
            if (remainder) {
                for (var i = 0; i < (colNum - remainder); i++) {
                    fieldList.push('<li class="cell bh-bColor-info-3" style="width:' + colWidth + '">');
                }
            }
            if (this.groupName) {
                fieldContent += '<div class="group-select bh-mb-8"><div class="bh-checkbox"><label><input type="checkbox" name="' + this.groupName + '" title="' + this.groupName + '">' +
                        '<i class="bh-choice-helper"></i><b>' + this.groupName + '</b>' +
                        '</label><span class="bh-text-caption bh-color-caption">已选择：<span class="bh-color-warning">' + selectedNum + '</span></span></div></div>';
            }
            fieldContent += '<div class="bh-customize-column-grid bh-bColor-info-3">' + '<ul class="bh-clearfix" style="list-style:none">' + fieldList.join('') + '</ul></div>';
        });
        var content = query + fieldContent;
        var title = options.title || '添加/删除字段';
        var btns = [{
            text: '保存',
            className: 'bh-btn-primary',
            callback: function () {
                okEvent.call(this, options);
            }
        }, {
            text: '取消',
            className: 'bh-btn-default',
            callback: $.noop
        }];
        var params = $.extend({width: '944px'}, options.params);
        return BH_UTILS.bhWindow(content, title, btns, params);
    }

    function bindEvent($element) {
        bindSearchEvent($element);
        bindSelectAllEvent($element);
    }

    function bindSearchEvent($element) {
        $element.find('.bh-customize-column-search input').on('input', function () {
            var val = $(this).val();
            var num = 0;
            var $content = $(this).closest('.content');
            $content.find('li .bh-checkbox').each(function () {
                var $box = $(this);
                var title = $box.attr('title');
                if (val && title.indexOf(val) > -1) {
                    title = title.replace(val, '<i class="bh-bg-warning-3">' + val + '</i>');
                    num++;
                }
                $box.find('.filed-name').html(title);
            });
            if (val) {
                $(this).nextAll('span').text('共' + num + '条');
            } else {
                $(this).nextAll('span').text('');
            }
        });
    }

    function bindSelectAllEvent($element) {
        $element.find('.group-select input').on('change', function () {
            var isChecked = $(this).prop('checked');
            $(this).closest('.group-select').next().find('input').prop('checked', isChecked);
        });
    }

    function okEvent(options) {
        // var value = {};
        // $(this).find('li input[type="checkbox"]').each(function() {
        //     value[$(this).attr('name')] = {
        //         hidden: !$(this).prop('checked')
        //     };
        // });

        var value = [];
        $(this).find('li input[type="checkbox"]').each(function () {
            value.push({
                name: $(this).attr('name'),
                hidden: !$(this).prop('checked')
            });
            // value[$(this).attr('name')] = {
            //     hidden: !$(this).prop('checked')
            // };
        });
        options.callback && options.callback.call(this, value);
    }

    var proto = bhCustomizeColumn.prototype;

    /**
     * [getValue description]
     * @return {}
     * {
     *     key:{
     *        hidden:Boolean
     *     }
     * }
     */
    proto.getValue = function () {
        var value = {};
        this.$element.find('li input[type="checkbox"]').each(function () {
            value[$(this).attr('name')] = {
                hidden: !$(this).prop('checked')
            };
        });
        return value;
    };

}).call(this);

//下载
(function () {
    var  _init, _isImage;

    // Plugin = (function () {
    var Plugin = function (element, options) {
            if (options.mode) {options.model = options.mode;}
            this.options = $.extend({}, $.fn.bhDateTimePicker.defaults, options);
            this.$element = $(element);
            _init(this.$element, this.options);
            return this;
        };

        Plugin.prototype.val = function(value) {
            if (value === undefined) {
                // get
                return this.$element.bhDateTimePicker('getValue');
            } else {
                // set
                return this.$element.bhDateTimePicker('setValue');
            }
        };

        Plugin.prototype.setValue = function (value) {
            $('[bh-form-role="dateTimeInput"]', this.$element).val(value);
            return this.$element;
        };

        Plugin.prototype.getValue = function () {
            return $('[bh-form-role="dateTimeInput"]', this.$element).val();
        };

        Plugin.prototype.disabled = function (params) {
            var element = this.$element;
            if (params === true) {
                element.addClass('bh-disabled');
                $('[bh-form-role="dateTimeInput"]', element).attr('disabled', true);
            } else if (params === false) {
                element.removeClass('bh-disabled');
                $('[bh-form-role="dateTimeInput"]', element).attr('disabled', false);
            }
            return element;
        };

        // return Plugin;
    // })();

    _init = function (element, options) {
        element.html('<input bh-form-role="dateTimeInput" type="text" class="bh-form-control"/>' +
        '<span class="bhtc-input-group-addon">' +
        '<i class="iconfont icon-daterange"></i>' +
        '</span>').addClass('bhtc-input-group');
        $('[bh-form-role=dateTimeInput]', element).datetimepicker(options);

        $('[bh-form-role=dateTimeInput]', element).on('blur', function () {
            element.trigger('dateInputBlur');
        });
    };


    $.fn.bhDateTimePicker = function (options, params) {
        var instance;
        instance = this.data('bhdatetimepicker');
        if (!instance) {
            return this.each(function () {
                return $(this).data('bhdatetimepicker', new Plugin(this, options));
            });
        }
        if (options === true) {
            return instance;
        }
        if ($.type(options) === 'string') {
            return instance[options](params);
        }
        return this;
    };

    $.fn.bhDateTimePicker.defaults = {
        format: 'yyyy-mm-dd'
    };

    $.fn.bhDateTimePicker.prototype.constructor = Plugin;

}).call(this);
/**
 * bhDialog插件
 */
(function() {
    $.bhDefaults = $.bhDefaults || {};
    $.bhDefaults.Dialog = {
        type: '', //可以传三个值，success/warning/danger
        title: '',
        content: '',
        buttons: [],
        width: "auto",
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

                if (params.className) {
                    dialogWin.addClass(params.className);
                }

                //根据iconType添加icon相应的dom
                po._createDialogIcon(dialogWin);

                //根据内容和按钮，添加对话框正文相应的dom
                po._createDialogBody(dialogWin, dialogId);
                // 添加按钮
                po._createDialogBtn(dialogWin, dialogId);

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
                if (bodyIsOverflowing) {
                    bodyHtml.css('padding-right', bodyPad + scrollbarWidth);
                }
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

                dialogWin.find('#bh-dialog-exceptBtn-chilid').append(dialogBody);

            },

            _createDialogBtn: function(dialogWin, dialogId) {
                var dialogBtnContainer = $('<div class="bh-dialog-center"></div>');
                if (params.buttons && params.buttons.length > 0) {
                    var btnLen = params.buttons.length;
                    for (var i = 0; i < btnLen; i++) {
                        var btn = po._createBtn(params.buttons[i], dialogId);
                        dialogBtnContainer.append(btn);
                    }
                } else {
                    //页面必须有按钮
                    po._getDefalutDialog(dialogId, dialogBtnContainer);
                }
                po._setDialogClass(dialogBtnContainer);
                dialogWin.append(dialogBtnContainer);
            },
            // 根据btn的个数和type，给btn加载不同的样式
            _setDialogClass: function(dialogBtnContainer) {
                var $textColorEle = '';
                var dialogBtnCon = dialogBtnContainer.find('.bh-dialog-btn');
                if (dialogBtnCon.length == 1) {
                    dialogBtnCon.css('width', '100%');
                } else {
                    $textColorEle = dialogBtnCon[0];
                    if (params.type == "success") {
                        $($textColorEle).addClass('bh-dialog-success-btn');
                    } else if (params.type == "warning") {
                        $($textColorEle).addClass('bh-dialog-warning-btn');
                    } else if (params.type == "danger") {
                        $($textColorEle).addClass('bh-dialog-danger-btn');
                    }
                }
            },
            /**
             * 单个按钮的创建方法
             * @param btnInfo
             * @param dialogId
             * @returns {*|jQuery|HTMLElement}
             * @private
             */
            _createBtn: function(btnInfo, dialogId) {
                var btn = $("<a href='javascript:void(0);' class='bh-dialog-btn'></a>");
                if (btnInfo && btnInfo.text) {
                    btn.text(btnInfo.text);
                }
                if (btnInfo && btnInfo.className) {
                    btn.addClass(btnInfo.className);
                }
                btn.click(function() {
                    po._removeDialog(dialogId);
                    btnInfo.callback && btnInfo.callback();
                });
                return btn;
            },
            /**
             * 根据type,获取不同的默认的dialog
             * @param
             * @private
             */
            _getDefalutDialog: function(dialogId, dialogBtnContainer) {
                var defaultBtn = [];
                var btnObject = [];
                if (params.type == 'success') {
                    defaultBtn = po._createBtn({
                        text: "关闭"
                    }, dialogId);
                    dialogBtnContainer.append(defaultBtn);
                } else if (params.type == 'warning') {
                    btnObject = [{
                        text: '确定',
                        callback: null
                    }, {
                        text: '取消',
                        callback: null
                    }];
                    po._appendDefaultDialog(btnObject, dialogBtnContainer, dialogId);
                } else if (params.type == 'danger') {
                    btnObject = [{
                        text: '重试',
                        callback: null
                    }, {
                        text: '取消',
                        callback: null
                    }];
                    po._appendDefaultDialog(btnObject, dialogBtnContainer, dialogId);
                }
                return defaultBtn;
            },
            _appendDefaultDialog: function(btnObject, dialogBtnContainer, dialogId) {
                var twoDefalutBtn = [];
                for (var i = 0; i < btnObject.length; i++) {
                    twoDefalutBtn = po._createBtn(btnObject[i], dialogId);
                    dialogBtnContainer.append(twoDefalutBtn);
                }
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
                    iconClass = 'info';
                } else if (type == 'danger') {
                    iconClass = 'cancel';
                }
                var iconDomString = '<div class="bh-dialog-exceptBtn-con bh-dialog-icon-color' + type + '" id="bh-dialog-exceptBtn-con">' +
                    '<div class="bh-dialog-exceptBtn-chilid" id="bh-dialog-exceptBtn-chilid">' +
                    '<div class="bh-dialog-img-con bh-mb-16">' +
                    '<i class="iconfont icon-setstyle icon-' + iconClass + '"></i>' +
                    '</div>' +
                    '<h2 class="bh-dialog-title-text bh-mb-16">' + params.title + '</h2>' +
                    '</div>' +
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
        };
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
 * @fileOverview bhPopOver 气泡弹窗
 * @example
   $()
 */
(function () {
    /**
     * @module bhPopOver
     */
    $.bhPopOver = function(options){
        if ($('#bhPopover').length){
            $('#bhPopover').remove();
        }
        options = $.extend({}, $.bhPopOver.prototype.dafaults, options);
        if (typeof options.selector == 'string') {
            options.selector = $(options.selector);
        }

        var pop = $('<div style="display: none" id="bhPopover"><div>' + options.content + '</div></div>');
        $('body').append(pop);

        // 计算popover 水平位置
        var docWidth = document.documentElement.clientWidth;
        var selectLeft = $(options.selector).offset().left;
        var popWidth = options.width || 300;
        var offsetLeft = 0;
        if (selectLeft - popWidth / 2 < 24) {
            offsetLeft = Math.abs(selectLeft - popWidth / 2 - 24);
        }
        if (selectLeft + popWidth / 2 > docWidth - 24) {
            offsetLeft = docWidth - 100 - selectLeft - popWidth / 2;
        }

        // 计算垂直位置
        var eleTop = $(options.selector).offset().top;
        var offsetTop = 0;
        var position = 'bottom';
        if (window.scrollY + document.documentElement.clientHeight - eleTop < 200) {
            position = 'top';
            offsetTop = 30;
        }

        pop.jqxPopover({
            offset: {left: offsetLeft, top: offsetTop},
            arrowOffsetValue: -offsetLeft,
            showArrow: options.showArrow,
            autoClose: options.autoClose,
            isModal: options.isModal,
            title: options.title,
            selector: options.selector,
            width: options.width,
            height: options.height,
            showCloseButton: options.showCloseButton,
            position: position
        });

        setTimeout(function () {  // 自动打开
            pop.jqxPopover('open');
            var popWindow = $('#bhPopover');
            if (options.title == null || options.title == "") { // 标题为空时自动隐藏
                $('.jqx-popover-title h4', popWindow).hide();
                $('.jqx-popover-title', popWindow).css('padding-top', '6px');
            }
            popWindow.on('close', function () {  // 气泡弹窗关闭时 自动销毁
                options.beforeClose && options.beforeClose(popWindow);
                // 销毁popover
                $(this).jqxPopover('destroy');
                options.close && options.close(popWindow);
            });
            options.ready && options.ready(popWindow);
        }, 0);

    };

    $.bhPopOver.close = function () {
        var popWindow = $('#bhPopover');
        if (popWindow.length) {
            popWindow.jqxPopover('close');
        }
    };

    /**
     * @memberof module:bhPopOver
     * @prop {Int} [width=300] - 弹窗宽度
     * @prop {Int} [height=null] - 弹窗高度
     * @prop {Boolean} [autoClose=true] - 点击页面其他区域popover是否自动关闭
     * @prop {Boolean} [showCloseButton= true] - 是否显示关闭按钮
     * @prop {Boolean} [isModal=false] - 是否有模态遮罩层
     * @prop {Function} [ready] - 弹出成功回调
     * @prop {Function} [beforeClose] - 关闭之前的回调
     * @prop {Function} [close] - 关闭的回调
     */
    $.bhPopOver.prototype.dafaults = {
        width: 300,
        height: null,
        autoClose: true,
        showCloseButton: true,
        isModal: false,
        ready: null,
        beforeClose: null,
        close: null
    };
})();
/**
 * @fileOverview 滑动输入条
 * @example
 $control.bhSlider({
    type: 'default', //default,range,node
    width: '100%',
    min: 0, //起始值
    max: 100, //结束值
    step: 1, //间隔
    value: 50, //当前取值
    disabled: false
 });
 */
(function($) {

    $.fn.bhSlider = function(options, params) {
        var instance;
        instance = this.data('bhSlider');
        /**
         * 判断插件是否已经实例化过，如果已经实例化了则直接返回该实例化对象
         */
        if (!instance) {
            return this.each(function() {
                //将实例化后的插件缓存在dom结构里（内存里）
                return $(this).data('bhSlider', new Plugin(this, options));
            });
        }
        if (options === true) return instance;
        /**
         * 优雅处： 如果插件的参数是一个字符串，则 调用 插件的 字符串方法。
         * 如 $('#id').plugin('doSomething') 则实际调用的是 $('#id).plugin.doSomething();
         * doSomething是刚才定义的接口。这种方法 在 juqery ui 的插件里 很常见。
         */
        if ($.type(options) === 'string') {
            var result = instance[options](params);
            return result;
        }
        //return this;
    };

    /**
     * @memberof module:bhSlider
     * @description 内置默认值
     * @prop {object}  defaults
     * @prop {string}  defaults.type - 滑动输入条的类型,default,range,node
     * @prop {string}  defaults.width - 滑动输入条的宽度
     * @prop {Nan}     default.min-滑动输入条的最小值
     * @prop {Nan}     default.max-滑动输入条的最大值
     * @prop {Nan}     default.step-滑动输入条的间隔值
     * @prop {Nan}     default.value-滑动输入条的当前的value值,可以是数字(default类型)或者两个数字的数组(range类型)
     * @prop {boolean} default.disabled-滑动输入条是否是disable
     */
    $.fn.bhSlider.defaults = {
        type: 'default', //default,range,node
        width: '100%',
        min: 0, //起始值
        max: 100, //结束值
        step: 1, //间隔
        value: 50, //当前取值
        disabled: false
    };

    var Plugin;

    var _slider = {};

    var _is_move = false;

    var LEFTDIF = 16; //为tip的宽度的三分之一
    var TOPDIF = 35; //为tip的高度加上tip和滑块之前的间距7

    /**
     * 这里是一个自运行的单例模式。
     * @module bhSlider
     */
    Plugin = (function() {
        /**
         * 插件实例化部分，初始化时调用的代码可以放这里
         */
        function Plugin(element, options) {
            //将插件的默认参数及用户定义的参数合并到一个新的obj里
            this.settings = $.extend({}, $.fn.bhSlider.defaults, options);
            //将dom jquery对象赋值给插件，方便后续调用
            this.$element = $(element);
            init(this.settings, this.$element);
        }

        // Plugin.prototype.getDotValue = function() {
        //  getDotValue();
        // };

        // Plugin.prototype.resetActiveItem = function(stepId) {
        //     resetActiveItem(stepId);
        // };

        return Plugin;

    })();

    function init(options, $element) {
        _slider.ele = $element;
        _slider.width = options.width;
        _slider.type = options.type;
        _slider.max = options.max;
        _slider.min = options.min;
        _slider.value = options.value;
        _slider.step = options.step;
        _slider.disabled = options.disabled;
        _slider.rangeNum = _slider.max - _slider.min; //当前模式的value值为多大
        _slider.fraction = _slider.rangeNum / _slider.step; //该模块里面有多少份
        _slider.isRange = options.type === 'range';

        appendNomalDom();
        setDomStyle();
        appendDotTip();
        dragEvent();
    }

    // 加载模板
    function appendNomalDom() {
        _slider.guid = NewGuid();
        var $nomalEle = '<div class="bh-slider-base"></div>' +
            '<div class="bh-slider-value"></div>' +
            '<div class="bh-slider-dot" flag="unactive"></div>';
        _slider.ele.html($nomalEle);
        _slider.ele.attr('bh-slider-guid', _slider.guid);
        _slider.baseEle = _slider.ele.find('.bh-slider-base');
        _slider.valueEle = _slider.ele.find('.bh-slider-value');
        if (_slider.isRange) {
            appendDot();
        }
        _slider.dot = _slider.ele.find('.bh-slider-dot');
    }

    function appendDot() {
        var $leftDot = '<div class="bh-slider-dot" flag="unactive"></div>';
        _slider.valueEle.before($leftDot);
    }

    function setDomStyle() {
        _slider.baseEle.parent().addClass('bh-slider-container');
        _slider.baseEle.css('width', _slider.width);
        _slider.baseWidth = _slider.baseEle.width();
        _slider.stepEDis = _slider.baseWidth / _slider.fraction; //每一份表示的宽度
        _slider.tipTop = _slider.valueEle.offset().top;
        _slider.nomalLeft = _slider.ele.offset().left;
        initEleStyle();
        switchColor();
    }
    // 初始化高亮条以及圆点的样式
    function initEleStyle() {
        if (_slider.isRange) {
            initRangeEleStyle();
        } else {
            initSimpleEleStyle();
        }

    }

    function initSimpleEleStyle() {
        var initialize_simple_dis = getCopiesSpace(_slider.value);
        _slider.dot.css('left', initialize_simple_dis + 'px');
        _slider.valueEle.css('width', initialize_simple_dis + 'px');
    }

    function initRangeEleStyle() {
        var range_value = _slider.value[1] - _slider.value[0];
        var leftDot_dis = getCopiesSpace(_slider.value[0]);
        var rightDot_dis = getCopiesSpace(_slider.value[1]);
        var initialize_range_dis = getCopiesSpace(range_value);
        $(_slider.dot[0]).css('left', leftDot_dis + 'px');
        $(_slider.dot[1]).css('left', rightDot_dis + 'px');
        _slider.valueEle.css('width', initialize_range_dis);
        //8px是圆点的宽度的一般，让高亮条的起始点在最左侧的圆点的中间位置
        _slider.valueEle.css('left', leftDot_dis + 8 + 'px');
    }

    function switchColor() {
        if (_slider.disabled) {
            switchToDisabled();
        } else {
            switchToActive();
        }
    }

    function switchToDisabled() {
        _slider.baseEle.addClass('bh-slider-disable-base');
        _slider.valueEle.addClass('bh-slider-disable-variety');
        _slider.dot.each(function(index) {
            var $dotEle = $(_slider.dot[index]);
            $dotEle.addClass('bh-slider-disable-dot');
        });
    }

    function switchToActive() {
        _slider.baseEle.addClass('bh-slider-active-base');
        _slider.valueEle.addClass('bh-slider-active-variety');
        _slider.dot.each(function(index) {
            var $dotEle = $(_slider.dot[index]);
            $dotEle.addClass('bh-slider-active-dot');
        });
    }

    // 创建圆点的tip并展示value
    function appendDotTip() {
        var tip = '<div class="bh-slider-tip bh-animate-opacity" bh-slider-guid="' + _slider.guid + '"></div>';
        $('body').append(tip);
        var $guidEle = $('[bh-slider-guid="' + _slider.guid + '"]');
        _slider.tip = $guidEle.filter(function(index) {
            return $($guidEle[index]).hasClass('bh-slider-tip') ? $($guidEle[index]) : '';
        });
    }

    // 刷新右侧toolTip的值，
    function refreshDotValue() {
        var $activeDot = _slider.ele.find('.bh-slider-dot[flag="active"]');
        var value = getDotValue($activeDot);
        var tip_position = getTipPosition($activeDot);
        _slider.tip.text(value)
            .css({
                left: tip_position.left + 'px',
                top: tip_position.top + 'px'
            });
    }

    // 获取右侧滑块当前位置所表示的值，用当前value的宽度除以每份所占的宽度，商乘以当前的四舍五入的值
    function getDotValue($activeDot) {
        var now_value = 0;
        var dot_left = $activeDot.offset().left - _slider.nomalLeft;
        var quotient = Math.round(dot_left / _slider.stepEDis);
        now_value = quotient * _slider.step;
        return now_value;
    }

    function getTipPosition($activeDot) {
        var dot_half_width = parseInt($activeDot.width() / 2, 10);
        var dot_offset = $activeDot.offset();
        var dot_center_left = dot_offset.left + dot_half_width;

        var tip_half_width = parseInt(_slider.tip.width() / 2, 10);
        var tip_height = _slider.tip.height();
        var tip_left = dot_center_left - tip_half_width;
        // 8是倒三角的高度，2是tip和点的间距
        var tip_top = dot_offset.top - tip_height - 8 - 2;
        return {
            top: tip_top,
            left: tip_left
        };
    }

    function dragDownEvent() {
        if (_slider.disabled) {
            return;
        }
        _is_move = true;
    }


    function refreshDomStyle(dis) {
        var old_width = _slider.valueEle.width();
        var $activeDot = _slider.ele.find('.bh-slider-dot[flag="active"]');
        var activeDot_left = $activeDot.offset().left - _slider.nomalLeft;
        var new_dis = getCopiesSpace(dis, true);
        if (new_dis < 0 || new_dis > _slider.baseWidth) {
            return;
        }
        var active_left = new_dis;
        var notActive_dotLeft = 0;
        if (_slider.isRange) {
            var $unactiveDot = _slider.ele.find('.bh-slider-dot[flag="unactive"]');
            unactiveDot_left = $unactiveDot.offset().left - _slider.nomalLeft;
            new_dis = new_dis - unactiveDot_left;
            if (new_dis < 0) {
                new_dis = (-new_dis);
            }
            if (activeDot_left < unactiveDot_left) {
                //8px是圆点的宽度的一般，让高亮条的起始点在最左侧的圆点的中间位置
                _slider.valueEle.css('left', activeDot_left + 8 + 'px');
            } else if (activeDot_left > unactiveDot_left) {
                //8px是圆点的宽度的一般，让高亮条的起始点在最左侧的圆点的中间位置
                _slider.valueEle.css('left', unactiveDot_left + 8 + 'px');
            }
        }

        console.log('left=' + (activeDot_left - active_left));
        console.log('width=' + (new_dis - old_width));
        $activeDot.css('left', active_left);
        _slider.valueEle.css('width', new_dis);

        // divideAddWidth(new_dis, old_width, active_left, activeDot_left, $activeDot);
    }

    function divideAddWidth(new_width, old_width, new_left, old_left, $activeDoc) {
        var move_flag = 'big';
        var diff_width = 0;
        if (new_width - old_width > 0) {
            diff_width = new_width - old_width;
        } else {
            diff_width = old_width - new_width;
            move_flag = 'small';
        }
        if (diff_width > 8) {
            console.log("11111")
            var part_count = diff_width / 8;
            var end_width = diff_width % 8;
            var current_width = old_width;
            var current_left = old_left;
            for (var i = 0; i < part_count; i++) {
                console.log("3333")
                if (move_flag === 'big') {
                    current_width += 8;
                    current_left += 8;
                } else {
                    current_width -= 8;
                    current_left -= 8;
                }
                $activeDoc.css('left', current_width + 'px');
                _slider.valueEle.css('width', current_width + 'px');
            }
            if (move_flag === 'big') {
                current_width += end_width;
                current_left += end_width;
            } else {
                current_width -= end_width;
                current_left -= end_width;
            }

            $activeDoc.css('left', current_left + 'px');
            _slider.valueEle.css('width', current_width + 'px');
        } else {
            console.log("2222")
            $activeDoc.css('left', new_left + 'px');
            _slider.valueEle.css('width', new_width + 'px');

        }
    }

    //获取份数所代表的距离，
    //num可以是距离，也可以是value
    function getCopiesSpace(num, isWidth) {
        var copies = num / _slider.step;
        if (isWidth) {
            copies = num / _slider.stepEDis;
        }
        return Math.round(copies * _slider.stepEDis);
    }

    function dragEvent() {
        var old_left = 0;
        var old_valueWidth = _slider.valueEle.width();
        var $body = $('body');

        _slider.dot.on('mouseover', function(e) {
            if (!_is_move) {
                _slider.tip.css('opacity', '1');
                $(e.target).attr('flag', 'active');
            }
            refreshDotValue();
        });

        _slider.dot.on('mouseout', function(e) {
            if (!_is_move) {
                $(e.target).attr('flag', 'unactive');
                _slider.tip.css('opacity', '0');
            }

        });

        _slider.dot.on('mousedown', function(e) {
            $(e.target).attr('flag', 'active');
            dragDownEvent();

        });
        $body.on('mouseup', function() {
            _slider.dot.each(function(index) {
                var $dotEle = $(_slider.dot[index]);
                $dotEle.attr('flag', 'unactive');
            });
            _is_move = false;
            _slider.tip.css('opacity', '0');
        });
        $body.on('mousemove', function(e) {
            if (_is_move) {
                refreshDomStyle(e.pageX - _slider.nomalLeft);
                refreshDotValue();
            }
        });
        // 如若不能拖动时，鼠标移动，滑块也会移动，故用ondragstart规避
        _slider.dot[0].ondragstart = function(e) {
            _is_move = false;
        }
        _slider.valueEle[0].ondragstart = function(e) {
            _is_move = false;
        }
        _slider.baseEle[0].ondragstart = function(e) {
            _is_move = false;
        }
    }

    function NewGuid() {
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }

    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }

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

        /***
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
            var $startTimeDom = this.startTimeDom.children('input');
            var $endTimeDom = this.endTimeDom.children('input');
            if(!$startTimeDom.attr('disabled')){
                startTime = $startTimeDom.data("DateTimePicker").date()._d;
            }
            if(!$endTimeDom.attr('disabled')){
                endTime = $endTimeDom.data("DateTimePicker").date()._d;
            }
            return {startTime: moment(startTime).format(this.settings.format), endTime: moment(endTime).format(this.settings.format)};
        };

        //外部设置时间数据
        Plugin.prototype.setValue = function(data) {
            var startTime = data.startTime ? timeStrToDate(data.startTime) : this.startTimeDom.children('input').data("DateTimePicker").date()._d;
            var endTime = data.endTime ? timeStrToDate(data.endTime) : this.endTimeDom.children('input').data("DateTimePicker").date()._d;
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
        var startTimeStr = getLocalDateStr(startTime, options);
        var endTimeStr = getLocalDateStr(endTime, options);
        var timeStr = startTimeStr +'-'+ endTimeStr;

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
        var max =  (!options.settings.range.max || options.settings.range.max === 'today') ? nowYear : timeStrToDate(options.settings.range.max).getFullYear();
        var min =  (!options.settings.range.min || options.settings.range.min === 'today') ? nowYear : timeStrToDate(options.settings.range.min).getFullYear();
        var disableNext = options.settings.range.max && nowYear >= max;
        var disablePrev = options.settings.range.min && nowYear <= min;
        year = max;
        if(year > nowYear){
            year = nowYear;
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
                                    '<div class="bhtc-input-group" bh-time-picker-role="selectStart">' +
                                        getTimeGroupHtml() +
                                    '</div>' +
                                    '<div class="bh-timePick-selectConnect"></div>' +
                                    '<div class="bhtc-input-group" bh-time-picker-role="selectEnd">' +
                                        getTimeGroupHtml() +
                                    '</div>' +
                                '</div>' +
                                '<a class="bh-btn bh-btn-primary bh-btn-block" bh-time-picker-role="selectOk" href="javascript:void(0);">确定</a>' +
                            '</div>' +
                            '<div class="bh-timePick-selectMonthCont" bh-time-picker-role="selectMonthBlock">' +
                                '<div class="bh-timePick-selectMonth bh-timePicker-rangeBox bh-clearfix">' +
                                    '<div class="bh-timePicker-rangeBox-selectIcon bh-left ' + (disablePrev ? 'bh-disabled' : '') + '" bh-time-picker-role="selectMonthPre">&lt;</div>'+
                                    '<div class="bh-timePicker-rangeBox-time" bh-time-picker-role="selectMonthYear">'+year+'年</div>'+
                                    '<div class="bh-timePicker-rangeBox-selectIcon bh-right '+ (disableNext ? 'bh-disabled' : '') + '" bh-time-picker-role="selectMonthNext">&gt;</div>'+
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

    function getTimeGroupHtml() {
        var html = '<input type="text" class="bh-form-control"/>' +
                    '<span class="bhtc-input-group-addon">' +
                        '<i class="iconfont icon-daterange"></i>' +
                    '</span>';
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
                var now = new Date();
                maxYear = now.getFullYear();
                maxMonth = now.getMonth();
            }
        }

        if(options.settings.range.min){
            if(options.settings.range.min !== 'today'){
                var minObj = timeStrToDate(options.settings.range.min);
                minYear = minObj.getFullYear();
                minMonth = minObj.getMonth();
            }else{
                var now = new Date();
                minYear = now.getFullYear();
                minMonth = now.getMonth();
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

    /***
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

    /***
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

    /***
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
        var $selectStart = $selectCustom.children('div[bh-time-picker-role="selectStart"]').children('input');
        var $selectEnd = $selectCustom.children('div[bh-time-picker-role="selectEnd"]').children('input');
        var $selectType = $selectCustom.find('div[bh-time-picker-role="selectType"]');
        //开始时间变化事件
        $selectStart.on('dp.change', function (event){
            //判断是否要切换选择类型为自定义
            changeFixedSelectType(options, $selectCustom);
            //验证开始时间是否大于结束时间
            checkTimeOrder($selectCustom, 'start', options);
        });
        //结束事件变化事件
        $selectEnd.on('dp.change', function (event){
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
            var startTime = $selectStart.data("DateTimePicker").date()._d;
            var endTime = $selectEnd.data("DateTimePicker").date()._d;
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
            if(!$(this).hasClass('bh-disabled')){
                changeSelectMonthOfYear($(this).closest('div[bh-time-picker-role="selectMonthBlock"]'), 'pre', options);
            }
        });
        //按月选择下一年
        options.popupBoxDom.on('click', '[bh-time-picker-role="selectMonthNext"]', function(){
            if(!$(this).hasClass('bh-disabled')){
                changeSelectMonthOfYear($(this).closest('div[bh-time-picker-role="selectMonthBlock"]'), 'next', options);
            }
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

        $timeDom.children('input').datetimepicker({
            format: options.settings.format,
            defaultDate: setValue
        });
    }

    /***
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
        var $startTime = $selectCustom.children('div[bh-time-picker-role="selectStart"]').children('input');
        var $endTime = $selectCustom.children('div[bh-time-picker-role="selectEnd"]').children('input');
        var currentEndTime = $endTime.data("DateTimePicker").date()._d;
        if(!startTime || !endTime){
            if(startTime === null){
                $startTime.attr('disabled', true);
                $startTime.data("DateTimePicker").disable();
            }else{
                $startTime.removeAttr('disabled');
                $startTime.data("DateTimePicker").enable();
            }
            if(endTime === null){
                $endTime.attr('disabled', true);
                $endTime.data("DateTimePicker").disable();
            }else{
                $endTime.removeAttr('disabled');
                $endTime.data("DateTimePicker").enable();
            }
            if(!startTime && !endTime){
                var $rangeBoxSelectTime = options.$rootElement.find('div[bh-time-picker-role="rangeBoxSelectTime"]');
                var $selectType = options.popupBoxDom.find('div[bh-time-picker-role="selectCustom"] div[bh-time-picker-role="selectType"]');
                var selected = $selectType.jqxDropDownList('getSelectedItem');
                if('all' === selected.value){
                    $rangeBoxSelectTime.html(selected.label);
                    return;
                }
            }
        }
        if($startTime.attr('disabled')){
            $startTime.removeAttr('disabled');
            $startTime.data("DateTimePicker").enable();
        }
        if($endTime.attr('disabled')){
            $endTime.removeAttr('disabled');
            $endTime.data("DateTimePicker").enable();
        }
        //这个判断是为了避免校验开始时间大于结束时间导致的时间重置
        if(startTime > currentEndTime){
            endTime = endTime ? endTime : new Date();
            startTime = startTime ? startTime : new Date();
            $startTime.data("DateTimePicker").date(startTime);
        }else{
            endTime = endTime ? endTime : new Date();
            startTime = startTime ? startTime : new Date();
            $startTime.data("DateTimePicker").date(startTime);
            $endTime.data("DateTimePicker").date(endTime);
        }

        var startTimeObj = $startTime.data("DateTimePicker").date()._d;
        var endTimeObj = $endTime.data("DateTimePicker").date()._d;
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
        var $prev = $selectMonthBlock.find('[bh-time-picker-role="selectMonthPre"]').removeClass('bh-disabled');
        var $next = $selectMonthBlock.find('[bh-time-picker-role="selectMonthNext"]').removeClass('bh-disabled');
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
            year--;
        }else{
            year++;
        }
        $selectMonthYear.html(year + '年');
        var monthHtml = getSelectMonthHtml(options, timeStrToDate(year+'/12/1'), type);
        $selectMonthBlock.find('div[bh-time-picker-role="selectMonthList"]').html(monthHtml);

        if(type === 'pre'){
            if(year === minYear){
                $prev.addClass('bh-disabled');
            }
        }else{
            if(year === maxYear){
                $next.addClass('bh-disabled');
            }
        }
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
        var startTimeStr = getLocalDateStr(startTime, options);
        var endTimeStr = getLocalDateStr(endTime, options);
        $rangeBoxSelectTime.html(startTimeStr + '-' + endTimeStr);
    }

    function getLocalDateStr(time, options){
        if(/dd/i.test(options.format)){
            return time.getFullYear() + '年' + numberLessThan10AddPre0(time.getMonth()+1) + '月' + time.getDate() + '日';
        }else{
            return time.getFullYear() + '年' + numberLessThan10AddPre0(time.getMonth()+1) + '月';
        }
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
        var $selectStart = $selectCustom.children('div[bh-time-picker-role="selectStart"]').children('input');
        var $selectEnd = $selectCustom.children('div[bh-time-picker-role="selectEnd"]').children('input');
        var startTime = $selectStart.data("DateTimePicker").date()._d;
        var endTime = $selectEnd.data("DateTimePicker").date()._d;
        if(startTime > endTime){
            //当选取的是结束时间，将结束时间设成和开始时间一样
            if(type === 'end'){
                var startDate = getDateObj(startTime);
                $selectEnd.data("DateTimePicker").date(new Date(startDate.year, startDate.month, startDate.day));
            }else{
                //当选取的是开始时间，将开始时间设成和结束时间一样
                var endDate = getDateObj(endTime);
                $selectStart.data("DateTimePicker").date(new Date(endDate.year, endDate.month, endDate.day))
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
                    $selectStart.data("DateTimePicker").date(minTime);
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
                    $selectEnd.data("DateTimePicker").date(maxTime);
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
            time = $selectBox.find('div[bh-time-picker-role="selectStart"]').children('input').data("DateTimePicker").date()._d;
        }else{
            //当点击的是下一个按钮，则以结束时间为基准
            time = $selectBox.find('div[bh-time-picker-role="selectEnd"]').children('input').data("DateTimePicker").date()._d;
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
        format: 'YYYY-MM-DD',//可选，时间格式，默认yyyy-MM-dd（年-月-日）
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
/*! version : 4.17.37
 =========================================================
 bootstrap-datetimejs
 https://github.com/Eonasdan/bootstrap-datetimepicker
 Copyright (c) 2015 Jonathan Peterson
 =========================================================
 */
/*
 The MIT License (MIT)

 Copyright (c) 2015 Jonathan Peterson

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */
/*global define:false */
/*global exports:false */
/*global require:false */
/*global jQuery:false */
/*global moment:false */
(function ($, moment) {
    'use strict';
    if (!moment) {
        throw new Error('bootstrap-datetimepicker requires Moment.js to be loaded first');
    }

    var dateTimePicker = function (element, options) {
        var picker = {},
            date,
            viewDate,
            unset = true,
            input,
            component = false,
            widget = false,
            use24Hours,
            minViewModeNumber = 0,
            actualFormat,
            parseFormats,
            currentViewMode,
            datePickerModes = [
                {
                    clsName: 'days',
                    navFnc: 'M',
                    navStep: 1
                },
                {
                    clsName: 'months',
                    navFnc: 'y',
                    navStep: 1
                },
                {
                    clsName: 'years',
                    navFnc: 'y',
                    navStep: 10
                },
                {
                    clsName: 'decades',
                    navFnc: 'y',
                    navStep: 100
                }
            ],
            viewModes = ['days', 'months', 'years', 'decades'],
            verticalModes = ['top', 'bottom', 'auto'],
            horizontalModes = ['left', 'right', 'auto'],
            toolbarPlacements = ['default', 'top', 'bottom'],
            keyMap = {
                'up': 38,
                38: 'up',
                'down': 40,
                40: 'down',
                'left': 37,
                37: 'left',
                'right': 39,
                39: 'right',
                'tab': 9,
                9: 'tab',
                'escape': 27,
                27: 'escape',
                'enter': 13,
                13: 'enter',
                'pageUp': 33,
                33: 'pageUp',
                'pageDown': 34,
                34: 'pageDown',
                'shift': 16,
                16: 'shift',
                'control': 17,
                17: 'control',
                'space': 32,
                32: 'space',
                't': 84,
                84: 't',
                'delete': 46,
                46: 'delete'
            },
            keyState = {},

            /********************************************************************************
             *
             * Private functions
             *
             ********************************************************************************/
            getMoment = function (d) {
                var tzEnabled = false,
                    returnMoment,
                    currentZoneOffset,
                    incomingZoneOffset,
                    timeZoneIndicator,
                    dateWithTimeZoneInfo;

                if (moment.tz !== undefined && options.timeZone !== undefined && options.timeZone !== null && options.timeZone !== '') {
                    tzEnabled = true;
                }
                if (d === undefined || d === null) {
                    if (tzEnabled) {
                        returnMoment = moment().tz(options.timeZone).startOf('d');
                    } else {
                        returnMoment = moment().startOf('d');
                    }
                } else {
                    if (tzEnabled) {
                        currentZoneOffset = moment().tz(options.timeZone).utcOffset();
                        incomingZoneOffset = moment(d, parseFormats, options.useStrict).utcOffset();
                        if (incomingZoneOffset !== currentZoneOffset) {
                            timeZoneIndicator = moment().tz(options.timeZone).format('Z');
                            dateWithTimeZoneInfo = moment(d, parseFormats, options.useStrict).format('YYYY-MM-DD[T]HH:mm:ss') + timeZoneIndicator;
                            returnMoment = moment(dateWithTimeZoneInfo, parseFormats, options.useStrict).tz(options.timeZone);
                        } else {
                            returnMoment = moment(d, parseFormats, options.useStrict).tz(options.timeZone);
                        }
                    } else {
                        returnMoment = moment(d, parseFormats, options.useStrict);
                    }
                }
                return returnMoment;
            },
            isEnabled = function (granularity) {
                if (typeof granularity !== 'string' || granularity.length > 1) {
                    throw new TypeError('isEnabled expects a single character string parameter');
                }
                switch (granularity) {
                    case 'y':
                        return actualFormat.indexOf('Y') !== -1;
                    case 'M':
                        return actualFormat.indexOf('M') !== -1;
                    case 'd':
                        return actualFormat.toLowerCase().indexOf('d') !== -1;
                    case 'h':
                    case 'H':
                        return actualFormat.toLowerCase().indexOf('h') !== -1;
                    case 'm':
                        return actualFormat.indexOf('m') !== -1;
                    case 's':
                        return actualFormat.indexOf('s') !== -1;
                    default:
                        return false;
                }
            },
            hasTime = function () {
                return (isEnabled('h') || isEnabled('m') || isEnabled('s'));
            },

            hasDate = function () {
                return (isEnabled('y') || isEnabled('M') || isEnabled('d'));
            },

            getDatePickerTemplate = function () {
                var headTemplate = $('<thead>')
                        .append($('<tr>')
                            .append($('<th>').addClass('bhtc-prev').attr('data-action', 'previous')
                                .append($('<span>').addClass(options.icons.previous))
                                )
                            .append($('<th>').addClass('bhtc-picker-switch').attr('data-action', 'pickerSwitch').attr('colspan', (options.calendarWeeks ? '6' : '5')))
                            .append($('<th>').addClass('bhtc-next').attr('data-action', 'next')
                                .append($('<span>').addClass(options.icons.next))
                                )
                            ),
                    contTemplate = $('<tbody>')
                        .append($('<tr>')
                            .append($('<td>').attr('colspan', (options.calendarWeeks ? '8' : '7')))
                            );

                return [
                    $('<div>').addClass('bhtc-datepicker-days')
                        .append($('<table>').addClass('table-condensed')
                            .append(headTemplate)
                            .append($('<tbody>'))
                            ),
                    $('<div>').addClass('bhtc-datepicker-months')
                        .append($('<table>').addClass('table-condensed')
                            .append(headTemplate.clone())
                            .append(contTemplate.clone())
                            ),
                    $('<div>').addClass('bhtc-datepicker-years')
                        .append($('<table>').addClass('table-condensed')
                            .append(headTemplate.clone())
                            .append(contTemplate.clone())
                            ),
                    $('<div>').addClass('bhtc-datepicker-decades')
                        .append($('<table>').addClass('table-condensed')
                            .append(headTemplate.clone())
                            .append(contTemplate.clone())
                            )
                ];
            },

            getTimePickerMainTemplate = function () {
                var topRow = $('<tr>'),
                    middleRow = $('<tr>'),
                    bottomRow = $('<tr>');

                if (isEnabled('h')) {
                    topRow.append($('<td>')
                        .append($('<a>').attr({href: '#', tabindex: '-1', 'title': options.tooltips.incrementHour}).addClass('bhtc-btn').attr('data-action', 'incrementHours')
                            .append($('<span>').addClass(options.icons.up))));
                    middleRow.append($('<td>')
                        .append($('<span>').addClass('bhtc-timepicker-hour').attr({'data-time-component':'hours', 'title': options.tooltips.pickHour}).attr('data-action', 'showHours')));
                    bottomRow.append($('<td>')
                        .append($('<a>').attr({href: '#', tabindex: '-1', 'title': options.tooltips.decrementHour}).addClass('bhtc-btn').attr('data-action', 'decrementHours')
                            .append($('<span>').addClass(options.icons.down))));
                }
                if (isEnabled('m')) {
                    if (isEnabled('h')) {
                        topRow.append($('<td>').addClass('separator'));
                        middleRow.append($('<td>').addClass('separator').html(':'));
                        bottomRow.append($('<td>').addClass('separator'));
                    }
                    topRow.append($('<td>')
                        .append($('<a>').attr({href: '#', tabindex: '-1', 'title': options.tooltips.incrementMinute}).addClass('bhtc-btn').attr('data-action', 'incrementMinutes')
                            .append($('<span>').addClass(options.icons.up))));
                    middleRow.append($('<td>')
                        .append($('<span>').addClass('bhtc-timepicker-minute').attr({'data-time-component': 'minutes', 'title': options.tooltips.pickMinute}).attr('data-action', 'showMinutes')));
                    bottomRow.append($('<td>')
                        .append($('<a>').attr({href: '#', tabindex: '-1', 'title': options.tooltips.decrementMinute}).addClass('bhtc-btn').attr('data-action', 'decrementMinutes')
                            .append($('<span>').addClass(options.icons.down))));
                }
                if (isEnabled('s')) {
                    if (isEnabled('m')) {
                        topRow.append($('<td>').addClass('separator'));
                        middleRow.append($('<td>').addClass('separator').html(':'));
                        bottomRow.append($('<td>').addClass('separator'));
                    }
                    topRow.append($('<td>')
                        .append($('<a>').attr({href: '#', tabindex: '-1', 'title': options.tooltips.incrementSecond}).addClass('bhtc-btn').attr('data-action', 'incrementSeconds')
                            .append($('<span>').addClass(options.icons.up))));
                    middleRow.append($('<td>')
                        .append($('<span>').addClass('bhtc-timepicker-second').attr({'data-time-component': 'seconds', 'title': options.tooltips.pickSecond}).attr('data-action', 'showSeconds')));
                    bottomRow.append($('<td>')
                        .append($('<a>').attr({href: '#', tabindex: '-1', 'title': options.tooltips.decrementSecond}).addClass('bhtc-btn').attr('data-action', 'decrementSeconds')
                            .append($('<span>').addClass(options.icons.down))));
                }

                if (!use24Hours) {
                    // topRow.append($('<td>').addClass('separator'));
                    // middleRow.append($('<td>')
                    //     .append($('<button>').addClass('btn btn-primary').attr({'data-action': 'togglePeriod', tabindex: '-1', 'title': options.tooltips.togglePeriod})));
                    // bottomRow.append($('<td>').addClass('separator'));
                }

                return $('<div>').addClass('bhtc-timepicker-picker')
                    .append($('<table>').addClass('table-condensed')
                        .append([topRow, middleRow, bottomRow]))
                    .append($('<div>').addClass('bhtc-toggle-period').append($('<button>').addClass('bh-btn bh-btn-primary').attr({'data-action': 'togglePeriod', tabindex: '-1', 'title': options.tooltips.togglePeriod})));
            },

            getTimePickerTemplate = function () {
                var hoursView = $('<div>').addClass('bhtc-timepicker-hours')
                        .append($('<table>').addClass('table-condensed')),
                    minutesView = $('<div>').addClass('bhtc-timepicker-minutes')
                        .append($('<table>').addClass('table-condensed')),
                    secondsView = $('<div>').addClass('bhtc-timepicker-seconds')
                        .append($('<table>').addClass('table-condensed')),
                    ret = [getTimePickerMainTemplate()];

                if (isEnabled('h')) {
                    ret.push(hoursView);
                }
                if (isEnabled('m')) {
                    ret.push(minutesView);
                }
                if (isEnabled('s')) {
                    ret.push(secondsView);
                }

                return ret;
            },

            getToolbar = function () {
                var row = [];
                if (options.showTodayButton) {
                    row.push($('<td>').append($('<a>').attr({'data-action':'today', 'title': options.tooltips.today}).append($('<span>').addClass(options.icons.today))));
                }
                if (!options.sideBySide && hasDate() && hasTime()) {
                    row.push($('<td>').append($('<a>').attr({'data-action':'togglePicker', 'title': options.tooltips.selectTime}).append($('<span>').addClass(options.icons.time))));
                }
                if (options.showClear) {
                    row.push($('<td>').append($('<a>').attr({'data-action':'clear', 'title': options.tooltips.clear}).append($('<span>').addClass(options.icons.clear))));
                }
                if (options.showClose) {
                    row.push($('<td>').append($('<a>').attr({'data-action':'close', 'title': options.tooltips.close}).append($('<span>').addClass(options.icons.close))));
                }
                return $('<table>').addClass('table-condensed').append($('<tbody>').append($('<tr>').append(row)));
            },

            getTemplate = function () {
                var template = $('<div>').addClass('bhtc-datetimepicker-widget bhtc-dropdown-menu'),
                    dateView = $('<div>').addClass('bhtc-datepicker').append(getDatePickerTemplate()),
                    timeView = $('<div>').addClass('bhtc-timepicker').append(getTimePickerTemplate()),
                    content = $('<ul>').addClass('bhtc-list-unstyled'),
                    toolbar = $('<li>').addClass('bhtc-picker-switch' + (options.collapse ? ' accordion-toggle' : '')).append(getToolbar());

                if (options.inline) {
                    template.removeClass('bhtc-dropdown-menu');
                }

                if (use24Hours) {
                    template.addClass('bhtc-usetwentyfour');
                }
                if (isEnabled('s') && !use24Hours) {
                    template.addClass('wider');
                }

                if (options.sideBySide && hasDate() && hasTime()) {
                    template.addClass('bhtc-timepicker-sbs');
                    if (options.toolbarPlacement === 'top') {
                        template.append(toolbar);
                    }
                    template.append(
                        $('<div>').addClass('row')
                            .append(dateView.addClass('col-md-6'))
                            .append(timeView.addClass('col-md-6'))
                    );
                    if (options.toolbarPlacement === 'bottom') {
                        template.append(toolbar);
                    }
                    return template;
                }

                if (options.toolbarPlacement === 'top') {
                    content.append(toolbar);
                }
                if (hasDate()) {
                    content.append($('<li>').addClass((options.collapse && hasTime() ? 'bhtc-collapse in' : '')).append(dateView));
                }
                if (options.toolbarPlacement === 'default') {
                    content.append(toolbar);
                }
                if (hasTime()) {
                    content.append($('<li>').addClass((options.collapse && hasDate() ? 'bhtc-collapse' : '')).append(timeView));
                }
                if (options.toolbarPlacement === 'bottom') {
                    content.append(toolbar);
                }
                return template.append(content);
            },

            dataToOptions = function () {
                var eData,
                    dataOptions = {};

                if (element.is('input') || options.inline) {
                    eData = element.data();
                } else {
                    eData = element.find('input').data();
                }

                if (eData.dateOptions && eData.dateOptions instanceof Object) {
                    dataOptions = $.extend(true, dataOptions, eData.dateOptions);
                }

                $.each(options, function (key) {
                    var attributeName = 'date' + key.charAt(0).toUpperCase() + key.slice(1);
                    if (eData[attributeName] !== undefined) {
                        dataOptions[key] = eData[attributeName];
                    }
                });
                return dataOptions;
            },

            place = function () {
                // var position = (component || element).position(),
                //     offset = (component || element).offset(),
                var position = element.position(),
                    offset = element.offset(),
                    vertical = options.widgetPositioning.vertical,
                    horizontal = options.widgetPositioning.horizontal,
                    parent;

                if (options.widgetParent) {
                    // parent = options.widgetParent.append(widget);
                    parent = options.widgetParent;
                } else if (element.is('input')) {
                    // parent = element.after(widget).parent();
                    parent = element.parent();
                } else if (options.inline) {
                    // parent = element.append(widget);
                    parent = element;
                    return;
                } else {
                    parent = element;
                    // element.children().first().after(widget);
                }

                $('body').append(widget);

                // Top and bottom logic
                if (vertical === 'auto') {
                    if (offset.top + widget.height() * 1.5 >= $(window).height() + $(window).scrollTop() &&
                        widget.height() + element.outerHeight() < offset.top) {
                        vertical = 'top';
                    } else {
                        vertical = 'bottom';
                    }
                }

                // Left and right logic
                if (horizontal === 'auto') {
                    if (parent.width() < offset.left + widget.outerWidth() / 2 &&
                        offset.left + widget.outerWidth() > $(window).width()) {
                        horizontal = 'right';
                    } else {
                        horizontal = 'left';
                    }
                }

                if (vertical === 'top') {
                    widget.addClass('bhtc-top').removeClass('bhtc-bottom');
                } else {
                    widget.addClass('bhtc-bottom').removeClass('bhtc-top');
                }

                if (horizontal === 'right') {
                    widget.addClass('bhtc-pull-right');
                } else {
                    widget.removeClass('bhtc-pull-right');
                }

                // find the first parent element that has a relative css positioning
                if (parent.css('position') !== 'relative') {
                    parent = parent.parents().filter(function () {
                        return $(this).css('position') === 'relative';
                    }).first();
                }

                if (parent.length === 0) {
                    throw new Error('datetimepicker component should be placed within a relative positioned container');
                }

                // widget.css({
                //     top: vertical === 'top' ? 'auto' : position.top + element.outerHeight() + 8,
                //     bottom: vertical === 'top' ? position.top + element.outerHeight() : 'auto',
                //     left: horizontal === 'left' ? (parent === element ? 0 : position.left) : 'auto',
                //     right: horizontal === 'left' ? 'auto' : parent.outerWidth() - element.outerWidth() - (parent === element ? 0 : position.left)
                // });
                //widget插入点改为body的调整
                widget.css({
                    top: vertical === 'top' ? offset.top - widget.outerHeight() - 8 : offset.top + element.outerHeight() + 8,
                    // bottom: vertical === 'top' ? position.top + element.outerHeight() : 'auto',
                    left: horizontal === 'left' ? (parent === element ? 0 : offset.left) : 'auto',
                    right: horizontal === 'left' ? 'auto' : parent.outerWidth() - element.outerWidth() - (parent === element ? 0 : offset.left)
                });
            },

            notifyEvent = function (e) {
                if (e.type === 'dp.change' && ((e.date && e.date.isSame(e.oldDate)) || (!e.date && !e.oldDate))) {
                    return;
                }
                element.trigger(e);
            },

            viewUpdate = function (e) {
                if (e === 'y') {
                    e = 'YYYY';
                }
                notifyEvent({
                    type: 'dp.update',
                    change: e,
                    viewDate: viewDate.clone()
                });
            },

            showMode = function (dir) {
                if (!widget) {
                    return;
                }
                if (dir) {
                    currentViewMode = Math.max(minViewModeNumber, Math.min(3, currentViewMode + dir));
                }
                widget.find('.bhtc-datepicker > div').hide().filter('.bhtc-datepicker-' + datePickerModes[currentViewMode].clsName).show();
            },

            fillDow = function () {
                var row = $('<tr>'),
                    currentDate = viewDate.clone().startOf('w').startOf('d');

                if (options.calendarWeeks === true) {
                    row.append($('<th>').addClass('bhtc-cw').text('#'));
                }

                while (currentDate.isBefore(viewDate.clone().endOf('w'))) {
                    row.append($('<th>').addClass('dow').text(currentDate.format('dd')));
                    currentDate.add(1, 'd');
                }
                widget.find('.bhtc-datepicker-days thead').append(row);
            },

            isInDisabledDates = function (testDate) {
                return options.disabledDates[testDate.format('YYYY-MM-DD')] === true;
            },

            isInEnabledDates = function (testDate) {
                return options.enabledDates[testDate.format('YYYY-MM-DD')] === true;
            },

            isInDisabledHours = function (testDate) {
                return options.disabledHours[testDate.format('H')] === true;
            },

            isInEnabledHours = function (testDate) {
                return options.enabledHours[testDate.format('H')] === true;
            },

            isValid = function (targetMoment, granularity) {
                if (!targetMoment.isValid()) {
                    return false;
                }
                if (options.disabledDates && granularity === 'd' && isInDisabledDates(targetMoment)) {
                    return false;
                }
                if (options.enabledDates && granularity === 'd' && !isInEnabledDates(targetMoment)) {
                    return false;
                }
                if (options.minDate && targetMoment.isBefore(options.minDate, granularity)) {
                    return false;
                }
                if (options.maxDate && targetMoment.isAfter(options.maxDate, granularity)) {
                    return false;
                }
                if (options.daysOfWeekDisabled && granularity === 'd' && options.daysOfWeekDisabled.indexOf(targetMoment.day()) !== -1) {
                    return false;
                }
                if (options.disabledHours && (granularity === 'h' || granularity === 'm' || granularity === 's') && isInDisabledHours(targetMoment)) {
                    return false;
                }
                if (options.enabledHours && (granularity === 'h' || granularity === 'm' || granularity === 's') && !isInEnabledHours(targetMoment)) {
                    return false;
                }
                if (options.disabledTimeIntervals && (granularity === 'h' || granularity === 'm' || granularity === 's')) {
                    var found = false;
                    $.each(options.disabledTimeIntervals, function () {
                        if (targetMoment.isBetween(this[0], this[1])) {
                            found = true;
                            return false;
                        }
                    });
                    if (found) {
                        return false;
                    }
                }
                return true;
            },

            fillMonths = function () {
                var spans = [],
                    monthsShort = viewDate.clone().startOf('y').startOf('d');
                while (monthsShort.isSame(viewDate, 'y')) {
                    spans.push($('<span>').attr('data-action', 'selectMonth').addClass('month').text(monthsShort.format('MMM')));
                    monthsShort.add(1, 'M');
                }
                widget.find('.bhtc-datepicker-months td').empty().append(spans);
            },

            updateMonths = function () {
                var monthsView = widget.find('.bhtc-datepicker-months'),
                    monthsViewHeader = monthsView.find('th'),
                    months = monthsView.find('tbody').find('span');

                monthsViewHeader.eq(0).find('span').attr('title', options.tooltips.prevYear);
                monthsViewHeader.eq(1).attr('title', options.tooltips.selectYear);
                monthsViewHeader.eq(2).find('span').attr('title', options.tooltips.nextYear);

                monthsView.find('.bhtc-disabled').removeClass('bhtc-disabled');

                if (!isValid(viewDate.clone().subtract(1, 'y'), 'y')) {
                    monthsViewHeader.eq(0).addClass('bhtc-disabled');
                }

                monthsViewHeader.eq(1).text(viewDate.year());

                if (!isValid(viewDate.clone().add(1, 'y'), 'y')) {
                    monthsViewHeader.eq(2).addClass('bhtc-disabled');
                }

                months.removeClass('bhtc-active');
                if (date.isSame(viewDate, 'y') && !unset) {
                    months.eq(date.month()).addClass('bhtc-active');
                }

                months.each(function (index) {
                    if (!isValid(viewDate.clone().month(index), 'M')) {
                        $(this).addClass('bhtc-disabled');
                    }
                });
            },

            updateYears = function () {
                var yearsView = widget.find('.bhtc-datepicker-years'),
                    yearsViewHeader = yearsView.find('th'),
                    startYear = viewDate.clone().subtract(5, 'y'),
                    endYear = viewDate.clone().add(6, 'y'),
                    html = '';

                yearsViewHeader.eq(0).find('span').attr('title', options.tooltips.prevDecade);
                yearsViewHeader.eq(1).attr('title', options.tooltips.selectDecade);
                yearsViewHeader.eq(2).find('span').attr('title', options.tooltips.nextDecade);

                yearsView.find('.bhtc-disabled').removeClass('bhtc-disabled');

                if (options.minDate && options.minDate.isAfter(startYear, 'y')) {
                    yearsViewHeader.eq(0).addClass('bhtc-disabled');
                }

                yearsViewHeader.eq(1).text(startYear.year() + '-' + endYear.year());

                if (options.maxDate && options.maxDate.isBefore(endYear, 'y')) {
                    yearsViewHeader.eq(2).addClass('bhtc-disabled');
                }

                while (!startYear.isAfter(endYear, 'y')) {
                    html += '<span data-action="selectYear" class="year' + (startYear.isSame(date, 'y') && !unset ? ' bhtc-active' : '') + (!isValid(startYear, 'y') ? ' bhtc-disabled' : '') + '">' + startYear.year() + '</span>';
                    startYear.add(1, 'y');
                }

                yearsView.find('td').html(html);
            },

            updateDecades = function () {
                var decadesView = widget.find('.bhtc-datepicker-decades'),
                    decadesViewHeader = decadesView.find('th'),
                    startDecade = moment({y: viewDate.year() - (viewDate.year() % 100) - 1}),
                    endDecade = startDecade.clone().add(100, 'y'),
                    startedAt = startDecade.clone(),
                    html = '';

                decadesViewHeader.eq(0).find('span').attr('title', options.tooltips.prevCentury);
                decadesViewHeader.eq(2).find('span').attr('title', options.tooltips.nextCentury);

                decadesView.find('.bhtc-disabled').removeClass('bhtc-disabled');

                if (startDecade.isSame(moment({y: 1900})) || (options.minDate && options.minDate.isAfter(startDecade, 'y'))) {
                    decadesViewHeader.eq(0).addClass('bhtc-disabled');
                }

                decadesViewHeader.eq(1).text(startDecade.year() + '-' + endDecade.year());

                if (startDecade.isSame(moment({y: 2000})) || (options.maxDate && options.maxDate.isBefore(endDecade, 'y'))) {
                    decadesViewHeader.eq(2).addClass('bhtc-disabled');
                }

                while (!startDecade.isAfter(endDecade, 'y')) {
                    html += '<span data-action="selectDecade" class="decade' + (startDecade.isSame(date, 'y') ? ' bhtc-active' : '') +
                        (!isValid(startDecade, 'y') ? ' bhtc-disabled' : '') + '" data-selection="' + (startDecade.year() + 6) + '">' + (startDecade.year() + 1) + ' - ' + (startDecade.year() + 12) + '</span>';
                    startDecade.add(12, 'y');
                }
                html += '<span></span><span></span><span></span>'; //push the dangling block over, at least this way it's even

                decadesView.find('td').html(html);
                decadesViewHeader.eq(1).text((startedAt.year() + 1) + '-' + (startDecade.year()));
            },

            fillDate = function () {
                var daysView = widget.find('.bhtc-datepicker-days'),
                    daysViewHeader = daysView.find('th'),
                    currentDate,
                    html = [],
                    row,
                    clsName,
                    i;

                if (!hasDate()) {
                    return;
                }

                daysViewHeader.eq(0).find('span').attr('title', options.tooltips.prevMonth);
                daysViewHeader.eq(1).attr('title', options.tooltips.selectMonth);
                daysViewHeader.eq(2).find('span').attr('title', options.tooltips.nextMonth);

                daysView.find('.bhtc-disabled').removeClass('bhtc-disabled');
                daysViewHeader.eq(1).text(viewDate.format(options.dayViewHeaderFormat));

                if (!isValid(viewDate.clone().subtract(1, 'M'), 'M')) {
                    daysViewHeader.eq(0).addClass('bhtc-disabled');
                }
                if (!isValid(viewDate.clone().add(1, 'M'), 'M')) {
                    daysViewHeader.eq(2).addClass('bhtc-disabled');
                }

                currentDate = viewDate.clone().startOf('M').startOf('w').startOf('d');

                for (i = 0; i < 42; i++) { //always display 42 days (should show 6 weeks)
                    if (currentDate.weekday() === 0) {
                        row = $('<tr>');
                        if (options.calendarWeeks) {
                            row.append('<td class="bhtc-cw">' + currentDate.week() + '</td>');
                        }
                        html.push(row);
                    }
                    clsName = '';
                    if (currentDate.isBefore(viewDate, 'M')) {
                        clsName += ' bhtc-old';
                    }
                    if (currentDate.isAfter(viewDate, 'M')) {
                        clsName += ' bhtc-new';
                    }
                    if (currentDate.isSame(date, 'd') && !unset) {
                        clsName += ' bhtc-active';
                    }
                    if (!isValid(currentDate, 'd')) {
                        clsName += ' bhtc-disabled';
                    }
                    if (currentDate.isSame(getMoment(), 'd')) {
                        clsName += ' today';
                    }
                    if (currentDate.day() === 0 || currentDate.day() === 6) {
                        clsName += ' weekend';
                    }
                    row.append('<td data-action="selectDay" data-day="' + currentDate.format('L') + '" class="day' + clsName + '">' + currentDate.date() + '</td>');
                    currentDate.add(1, 'd');
                }

                daysView.find('tbody').empty().append(html);

                updateMonths();

                updateYears();

                updateDecades();
            },

            fillHours = function () {
                var table = widget.find('.bhtc-timepicker-hours table'),
                    currentHour = viewDate.clone().startOf('d'),
                    html = [],
                    row = $('<tr>');

                if (viewDate.hour() > 11 && !use24Hours) {
                    currentHour.hour(12);
                }
                while (currentHour.isSame(viewDate, 'd') && (use24Hours || (viewDate.hour() < 12 && currentHour.hour() < 12) || viewDate.hour() > 11)) {
                    if (currentHour.hour() % 4 === 0) {
                        row = $('<tr>');
                        html.push(row);
                    }
                    row.append('<td data-action="selectHour" class="hour' + (!isValid(currentHour, 'h') ? ' bhtc-disabled' : '') + '">' + currentHour.format(use24Hours ? 'HH' : 'hh') + '</td>');
                    currentHour.add(1, 'h');
                }
                table.empty().append(html);
            },

            fillMinutes = function () {
                var table = widget.find('.bhtc-timepicker-minutes table'),
                    currentMinute = viewDate.clone().startOf('h'),
                    html = [],
                    row = $('<tr>'),
                    step = options.stepping === 1 ? 5 : options.stepping;

                while (viewDate.isSame(currentMinute, 'h')) {
                    if (currentMinute.minute() % (step * 4) === 0) {
                        row = $('<tr>');
                        html.push(row);
                    }
                    row.append('<td data-action="selectMinute" class="minute' + (!isValid(currentMinute, 'm') ? ' bhtc-disabled' : '') + '">' + currentMinute.format('mm') + '</td>');
                    currentMinute.add(step, 'm');
                }
                table.empty().append(html);
            },

            fillSeconds = function () {
                var table = widget.find('.bhtc-timepicker-seconds table'),
                    currentSecond = viewDate.clone().startOf('m'),
                    html = [],
                    row = $('<tr>');

                while (viewDate.isSame(currentSecond, 'm')) {
                    if (currentSecond.second() % 20 === 0) {
                        row = $('<tr>');
                        html.push(row);
                    }
                    row.append('<td data-action="selectSecond" class="second' + (!isValid(currentSecond, 's') ? ' bhtc-disabled' : '') + '">' + currentSecond.format('ss') + '</td>');
                    currentSecond.add(5, 's');
                }

                table.empty().append(html);
            },

            fillTime = function () {
                var toggle, newDate, timeComponents = widget.find('.bhtc-timepicker span[data-time-component]');

                if (!use24Hours) {
                    toggle = widget.find('.bhtc-timepicker [data-action=togglePeriod]');
                    newDate = date.clone().add((date.hours() >= 12) ? -12 : 12, 'h');

                    toggle.text(date.format('A'));

                    if (isValid(newDate, 'h')) {
                        toggle.removeClass('bhtc-disabled');
                    } else {
                        toggle.addClass('bhtc-disabled');
                    }
                }
                timeComponents.filter('[data-time-component=hours]').text(date.format(use24Hours ? 'HH' : 'hh'));
                timeComponents.filter('[data-time-component=minutes]').text(date.format('mm'));
                timeComponents.filter('[data-time-component=seconds]').text(date.format('ss'));

                fillHours();
                fillMinutes();
                fillSeconds();
            },

            update = function () {
                if (!widget) {
                    return;
                }
                fillDate();
                fillTime();
            },

            setValue = function (targetMoment) {
                var oldDate = unset ? null : date;

                // case of calling setValue(null or false)
                if (!targetMoment) {
                    unset = true;
                    input.val('');
                    element.data('date', '');
                    notifyEvent({
                        type: 'dp.change',
                        date: false,
                        oldDate: oldDate
                    });
                    update();
                    return;
                }

                targetMoment = targetMoment.clone().locale(options.locale);

                if (options.stepping !== 1) {
                    targetMoment.minutes((Math.round(targetMoment.minutes() / options.stepping) * options.stepping) % 60).seconds(0);
                }

                if (isValid(targetMoment)) {
                    date = targetMoment;
                    viewDate = date.clone();
                    input.val(date.format(actualFormat));
                    element.data('date', date.format(actualFormat));
                    unset = false;
                    update();
                    notifyEvent({
                        type: 'dp.change',
                        date: date.clone(),
                        oldDate: oldDate
                    });
                } else {
                    if (!options.keepInvalid) {
                        input.val(unset ? '' : date.format(actualFormat));
                    }
                    notifyEvent({
                        type: 'dp.error',
                        date: targetMoment
                    });
                }
            },

            hide = function () {
                ///<summary>Hides the widget. Possibly will emit dp.hide</summary>
                var transitioning = false;
                if (!widget) {
                    return picker;
                }
                // Ignore event if in the middle of a picker transition
                widget.find('.bhtc-collapse').each(function () {
                    var collapseData = $(this).data('collapse');
                    if (collapseData && collapseData.transitioning) {
                        transitioning = true;
                        return false;
                    }
                    return true;
                });
                if (transitioning) {
                    return picker;
                }
                if (component && component.hasClass('bhtc-btn')) {
                    component.toggleClass('bhtc-active');
                }
                widget.hide();

                $(window).off('resize', place);
                widget.off('click', '[data-action]');
                widget.off('mousedown', false);

                widget.remove();
                widget = false;

                notifyEvent({
                    type: 'dp.hide',
                    date: date.clone()
                });

                input.blur();

                return picker;
            },

            clear = function () {
                setValue(null);
            },

            /********************************************************************************
             *
             * Widget UI interaction functions
             *
             ********************************************************************************/
            actions = {
                next: function () {
                    var navFnc = datePickerModes[currentViewMode].navFnc;
                    viewDate.add(datePickerModes[currentViewMode].navStep, navFnc);
                    fillDate();
                    viewUpdate(navFnc);
                },

                previous: function () {
                    var navFnc = datePickerModes[currentViewMode].navFnc;
                    viewDate.subtract(datePickerModes[currentViewMode].navStep, navFnc);
                    fillDate();
                    viewUpdate(navFnc);
                },

                pickerSwitch: function () {
                    showMode(1);
                },

                selectMonth: function (e) {
                    var month = $(e.target).closest('tbody').find('span').index($(e.target));
                    viewDate.month(month);
                    if (currentViewMode === minViewModeNumber) {
                        setValue(date.clone().year(viewDate.year()).month(viewDate.month()));
                        if (!options.inline) {
                            hide();
                        }
                    } else {
                        showMode(-1);
                        fillDate();
                    }
                    viewUpdate('M');
                },

                selectYear: function (e) {
                    var year = parseInt($(e.target).text(), 10) || 0;
                    viewDate.year(year);
                    if (currentViewMode === minViewModeNumber) {
                        setValue(date.clone().year(viewDate.year()));
                        if (!options.inline) {
                            hide();
                        }
                    } else {
                        showMode(-1);
                        fillDate();
                    }
                    viewUpdate('YYYY');
                },

                selectDecade: function (e) {
                    var year = parseInt($(e.target).data('selection'), 10) || 0;
                    viewDate.year(year);
                    if (currentViewMode === minViewModeNumber) {
                        setValue(date.clone().year(viewDate.year()));
                        if (!options.inline) {
                            hide();
                        }
                    } else {
                        showMode(-1);
                        fillDate();
                    }
                    viewUpdate('YYYY');
                },

                selectDay: function (e) {
                    var day = viewDate.clone();
                    if ($(e.target).is('.bhtc-old')) {
                        day.subtract(1, 'M');
                    }
                    if ($(e.target).is('.bhtc-new')) {
                        day.add(1, 'M');
                    }
                    setValue(day.date(parseInt($(e.target).text(), 10)));
                    if (!hasTime() && !options.keepOpen && !options.inline) {
                        hide();
                    }
                },

                incrementHours: function () {
                    var newDate = date.clone().add(1, 'h');
                    if (isValid(newDate, 'h')) {
                        setValue(newDate);
                    }
                },

                incrementMinutes: function () {
                    var newDate = date.clone().add(options.stepping, 'm');
                    if (isValid(newDate, 'm')) {
                        setValue(newDate);
                    }
                },

                incrementSeconds: function () {
                    var newDate = date.clone().add(1, 's');
                    if (isValid(newDate, 's')) {
                        setValue(newDate);
                    }
                },

                decrementHours: function () {
                    var newDate = date.clone().subtract(1, 'h');
                    if (isValid(newDate, 'h')) {
                        setValue(newDate);
                    }
                },

                decrementMinutes: function () {
                    var newDate = date.clone().subtract(options.stepping, 'm');
                    if (isValid(newDate, 'm')) {
                        setValue(newDate);
                    }
                },

                decrementSeconds: function () {
                    var newDate = date.clone().subtract(1, 's');
                    if (isValid(newDate, 's')) {
                        setValue(newDate);
                    }
                },

                togglePeriod: function () {
                    setValue(date.clone().add((date.hours() >= 12) ? -12 : 12, 'h'));
                },

                togglePicker: function (e) {
                    var $this = $(e.target),
                        $parent = $this.closest('ul'),
                        expanded = $parent.find('.in'),
                        closed = $parent.find('.bhtc-collapse:not(.in)'),
                        collapseData;

                    if (expanded && expanded.length) {
                        collapseData = expanded.data('collapse');
                        if (collapseData && collapseData.transitioning) {
                            return;
                        }
                        if (expanded.collapse) { // if collapse plugin is available through bootstrap.js then use it
                            expanded.collapse('hide');
                            closed.collapse('show');
                        } else { // otherwise just toggle in class on the two views
                            expanded.removeClass('in');
                            closed.addClass('in');
                        }
                        if ($this.is('span')) {
                            $this.toggleClass(options.icons.time + ' ' + options.icons.date);
                        } else {
                            $this.find('span').toggleClass(options.icons.time + ' ' + options.icons.date);
                        }

                        // NOTE: uncomment if toggled state will be restored in show()
                        //if (component) {
                        //    component.find('span').toggleClass(options.icons.time + ' ' + options.icons.date);
                        //}
                    }
                },

                showPicker: function () {
                    widget.find('.bhtc-timepicker > div:not(.bhtc-timepicker-picker)').hide();
                    widget.find('.bhtc-timepicker .bhtc-timepicker-picker').show();
                },

                showHours: function () {
                    widget.find('.bhtc-timepicker .bhtc-timepicker-picker').hide();
                    widget.find('.bhtc-timepicker .bhtc-timepicker-hours').show();
                },

                showMinutes: function () {
                    widget.find('.bhtc-timepicker .bhtc-timepicker-picker').hide();
                    widget.find('.bhtc-timepicker .bhtc-timepicker-minutes').show();
                },

                showSeconds: function () {
                    widget.find('.bhtc-timepicker .bhtc-timepicker-picker').hide();
                    widget.find('.bhtc-timepicker .bhtc-timepicker-seconds').show();
                },

                selectHour: function (e) {
                    var hour = parseInt($(e.target).text(), 10);

                    if (!use24Hours) {
                        if (date.hours() >= 12) {
                            if (hour !== 12) {
                                hour += 12;
                            }
                        } else {
                            if (hour === 12) {
                                hour = 0;
                            }
                        }
                    }
                    setValue(date.clone().hours(hour));
                    actions.showPicker.call(picker);
                },

                selectMinute: function (e) {
                    setValue(date.clone().minutes(parseInt($(e.target).text(), 10)));
                    actions.showPicker.call(picker);
                },

                selectSecond: function (e) {
                    setValue(date.clone().seconds(parseInt($(e.target).text(), 10)));
                    actions.showPicker.call(picker);
                },

                clear: clear,

                today: function () {
                    var todaysDate = getMoment();
                    if (isValid(todaysDate, 'd')) {
                        setValue(todaysDate);
                    }
                },

                close: hide
            },

            doAction = function (e) {
                if ($(e.currentTarget).is('.bhtc-disabled')) {
                    return false;
                }
                actions[$(e.currentTarget).data('action')].apply(picker, arguments);
                return false;
            },

            show = function () {
                ///<summary>Shows the widget. Possibly will emit dp.show and dp.change</summary>
                var currentMoment,
                    useCurrentGranularity = {
                        'year': function (m) {
                            return m.month(0).date(1).hours(0).seconds(0).minutes(0);
                        },
                        'month': function (m) {
                            return m.date(1).hours(0).seconds(0).minutes(0);
                        },
                        'day': function (m) {
                            return m.hours(0).seconds(0).minutes(0);
                        },
                        'hour': function (m) {
                            return m.seconds(0).minutes(0);
                        },
                        'minute': function (m) {
                            return m.seconds(0);
                        }
                    };

                if (input.prop('bhtc-disabled') || (!options.ignoreReadonly && input.prop('readonly')) || widget) {
                    return picker;
                }
                if (input.val() !== undefined && input.val().trim().length !== 0) {
                    setValue(parseInputDate(input.val().trim()));
                } else if (options.useCurrent && unset && ((input.is('input') && input.val().trim().length === 0) || options.inline)) {
                    currentMoment = getMoment();
                    if (typeof options.useCurrent === 'string') {
                        currentMoment = useCurrentGranularity[options.useCurrent](currentMoment);
                    }
                    setValue(currentMoment);
                }

                widget = getTemplate();

                fillDow();
                fillMonths();

                widget.find('.bhtc-timepicker-hours').hide();
                widget.find('.bhtc-timepicker-minutes').hide();
                widget.find('.bhtc-timepicker-seconds').hide();

                update();
                showMode();

                $(window).on('resize', place);
                widget.on('click', '[data-action]', doAction); // this handles clicks on the widget
                widget.on('mousedown', false);

                if (component && component.hasClass('bhtc-btn')) {
                    component.toggleClass('bhtc-active');
                }
                widget.show();
                place();

                if (options.focusOnShow && !input.is(':focus')) {
                    input.focus();
                }

                notifyEvent({
                    type: 'dp.show'
                });
                return picker;
            },

            toggle = function () {
                /// <summary>Shows or hides the widget</summary>
                return (widget ? hide() : show());
            },

            parseInputDate = function (inputDate) {
                if (options.parseInputDate === undefined) {
                    if (moment.isMoment(inputDate) || inputDate instanceof Date) {
                        inputDate = moment(inputDate);
                    } else {
                        inputDate = getMoment(inputDate);
                    }
                } else {
                    inputDate = options.parseInputDate(inputDate);
                }
                inputDate.locale(options.locale);
                return inputDate;
            },

            keydown = function (e) {
                var handler = null,
                    index,
                    index2,
                    pressedKeys = [],
                    pressedModifiers = {},
                    currentKey = e.which,
                    keyBindKeys,
                    allModifiersPressed,
                    pressed = 'p';

                keyState[currentKey] = pressed;

                for (index in keyState) {
                    if (keyState.hasOwnProperty(index) && keyState[index] === pressed) {
                        pressedKeys.push(index);
                        if (parseInt(index, 10) !== currentKey) {
                            pressedModifiers[index] = true;
                        }
                    }
                }

                for (index in options.keyBinds) {
                    if (options.keyBinds.hasOwnProperty(index) && typeof (options.keyBinds[index]) === 'function') {
                        keyBindKeys = index.split(' ');
                        if (keyBindKeys.length === pressedKeys.length && keyMap[currentKey] === keyBindKeys[keyBindKeys.length - 1]) {
                            allModifiersPressed = true;
                            for (index2 = keyBindKeys.length - 2; index2 >= 0; index2--) {
                                if (!(keyMap[keyBindKeys[index2]] in pressedModifiers)) {
                                    allModifiersPressed = false;
                                    break;
                                }
                            }
                            if (allModifiersPressed) {
                                handler = options.keyBinds[index];
                                break;
                            }
                        }
                    }
                }

                if (handler) {
                    handler.call(picker, widget);
                    e.stopPropagation();
                    e.preventDefault();
                }
            },

            keyup = function (e) {
                keyState[e.which] = 'r';
                e.stopPropagation();
                e.preventDefault();
            },

            change = function (e) {
                var val = $(e.target).val().trim(),
                    parsedDate = val ? parseInputDate(val) : null;
                setValue(parsedDate);
                e.stopImmediatePropagation();
                return false;
            },

            attachDatePickerElementEvents = function () {
                input.on({
                    'change': change,
                    'blur': options.debug ? '' : hide,
                    'keydown': keydown,
                    'keyup': keyup,
                    'focus': options.allowInputToggle ? show : ''
                });

                if (element.is('input')) {
                    input.on({
                        'focus': show
                    });

                    //解决IE9下点击图标不能弹出选择日期组件的问题 2016-9-7 ghlong
                    var $time_icon = input.closest('.bhtc-input-group').children('.bhtc-input-group-addon');
                    if($time_icon.length > 0){
                        $time_icon.on('click', function () {
                            input.focus();
                        });
                    }
                } else if (component) {
                    component.on('click', toggle);
                    component.on('mousedown', false);
                }
            },

            detachDatePickerElementEvents = function () {
                input.off({
                    'change': change,
                    'blur': blur,
                    'keydown': keydown,
                    'keyup': keyup,
                    'focus': options.allowInputToggle ? hide : ''
                });

                if (element.is('input')) {
                    input.off({
                        'focus': show
                    });

                    var $time_icon = input.closest('.bhtc-input-group').children('.bhtc-input-group-addon');
                    if($time_icon.length > 0){
                        $time_icon.off('click', function () {
                            input.focus();
                        });
                    }
                } else if (component) {
                    component.off('click', toggle);
                    component.off('mousedown', false);
                }
            },

            indexGivenDates = function (givenDatesArray) {
                // Store given enabledDates and disabledDates as keys.
                // This way we can check their existence in O(1) time instead of looping through whole array.
                // (for example: options.enabledDates['2014-02-27'] === true)
                var givenDatesIndexed = {};
                $.each(givenDatesArray, function () {
                    var dDate = parseInputDate(this);
                    if (dDate.isValid()) {
                        givenDatesIndexed[dDate.format('YYYY-MM-DD')] = true;
                    }
                });
                return (Object.keys(givenDatesIndexed).length) ? givenDatesIndexed : false;
            },

            indexGivenHours = function (givenHoursArray) {
                // Store given enabledHours and disabledHours as keys.
                // This way we can check their existence in O(1) time instead of looping through whole array.
                // (for example: options.enabledHours['2014-02-27'] === true)
                var givenHoursIndexed = {};
                $.each(givenHoursArray, function () {
                    givenHoursIndexed[this] = true;
                });
                return (Object.keys(givenHoursIndexed).length) ? givenHoursIndexed : false;
            },

            initFormatting = function () {
                var format = options.format || 'L LT';

                actualFormat = format.replace(/(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g, function (formatInput) {
                    var newinput = date.localeData().longDateFormat(formatInput) || formatInput;
                    return newinput.replace(/(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g, function (formatInput2) { //temp fix for #740
                        return date.localeData().longDateFormat(formatInput2) || formatInput2;
                    });
                });


                parseFormats = options.extraFormats ? options.extraFormats.slice() : [];
                if (parseFormats.indexOf(format) < 0 && parseFormats.indexOf(actualFormat) < 0) {
                    parseFormats.push(actualFormat);
                }

                use24Hours = (actualFormat.toLowerCase().indexOf('a') < 1 && actualFormat.replace(/\[.*?\]/g, '').indexOf('h') < 1);

                if (isEnabled('y')) {
                    minViewModeNumber = 2;
                }
                if (isEnabled('M')) {
                    minViewModeNumber = 1;
                }
                if (isEnabled('d')) {
                    minViewModeNumber = 0;
                }

                currentViewMode = Math.max(minViewModeNumber, currentViewMode);

                if (!unset) {
                    setValue(date);
                }
            };

        /********************************************************************************
         *
         * Public API functions
         * =====================
         *
         * Important: Do not expose direct references to private objects or the options
         * object to the outer world. Always return a clone when returning values or make
         * a clone when setting a private variable.
         *
         ********************************************************************************/
        picker.destroy = function () {
            ///<summary>Destroys the widget and removes all attached event listeners</summary>
            hide();
            detachDatePickerElementEvents();
            element.removeData('DateTimePicker');
            element.removeData('date');
        };

        picker.toggle = toggle;

        picker.show = show;

        picker.hide = hide;

        picker.disable = function () {
            ///<summary>Disables the input element, the component is attached to, by adding a disabled="true" attribute to it.
            ///If the widget was visible before that call it is hidden. Possibly emits dp.hide</summary>
            hide();
            if (component && component.hasClass('bhtc-btn')) {
                component.addClass('bhtc-disabled');
            }
            input.prop('bhtc-disabled', true);
            return picker;
        };

        picker.enable = function () {
            ///<summary>Enables the input element, the component is attached to, by removing disabled attribute from it.</summary>
            if (component && component.hasClass('bhtc-btn')) {
                component.removeClass('bhtc-disabled');
            }
            input.prop('bhtc-disabled', false);
            return picker;
        };

        picker.ignoreReadonly = function (ignoreReadonly) {
            if (arguments.length === 0) {
                return options.ignoreReadonly;
            }
            if (typeof ignoreReadonly !== 'boolean') {
                throw new TypeError('ignoreReadonly () expects a boolean parameter');
            }
            options.ignoreReadonly = ignoreReadonly;
            return picker;
        };

        picker.options = function (newOptions) {
            if (arguments.length === 0) {
                return $.extend(true, {}, options);
            }

            if (!(newOptions instanceof Object)) {
                throw new TypeError('options() options parameter should be an object');
            }
            $.extend(true, options, newOptions);
            $.each(options, function (key, value) {
                if (picker[key] !== undefined) {
                    picker[key](value);
                } else {
                    throw new TypeError('option ' + key + ' is not recognized!');
                }
            });
            return picker;
        };

        picker.date = function (newDate) {
            ///<signature helpKeyword="$.fn.datetimepicker.date">
            ///<summary>Returns the component's model current date, a moment object or null if not set.</summary>
            ///<returns type="Moment">date.clone()</returns>
            ///</signature>
            ///<signature>
            ///<summary>Sets the components model current moment to it. Passing a null value unsets the components model current moment. Parsing of the newDate parameter is made using moment library with the options.format and options.useStrict components configuration.</summary>
            ///<param name="newDate" locid="$.fn.datetimepicker.date_p:newDate">Takes string, Date, moment, null parameter.</param>
            ///</signature>
            if (arguments.length === 0) {
                if (unset) {
                    return null;
                }
                return date.clone();
            }

            if (newDate !== null && typeof newDate !== 'string' && !moment.isMoment(newDate) && !(newDate instanceof Date)) {
                throw new TypeError('date() parameter must be one of [null, string, moment or Date]');
            }

            setValue(newDate === null ? null : parseInputDate(newDate));
            return picker;
        };

        picker.format = function (newFormat) {
            ///<summary>test su</summary>
            ///<param name="newFormat">info about para</param>
            ///<returns type="string|boolean">returns foo</returns>
            if (arguments.length === 0) {
                return options.format;
            }

            if ((typeof newFormat !== 'string') && ((typeof newFormat !== 'boolean') || (newFormat !== false))) {
                throw new TypeError('format() expects a sting or boolean:false parameter ' + newFormat);
            }

            options.format = newFormat;
            if (actualFormat) {
                initFormatting(); // reinit formatting
            }
            return picker;
        };

        picker.timeZone = function (newZone) {
            if (arguments.length === 0) {
                return options.timeZone;
            }

            options.timeZone = newZone;

            return picker;
        };

        picker.dayViewHeaderFormat = function (newFormat) {
            if (arguments.length === 0) {
                return options.dayViewHeaderFormat;
            }

            if (typeof newFormat !== 'string') {
                throw new TypeError('dayViewHeaderFormat() expects a string parameter');
            }

            options.dayViewHeaderFormat = newFormat;
            return picker;
        };

        picker.extraFormats = function (formats) {
            if (arguments.length === 0) {
                return options.extraFormats;
            }

            if (formats !== false && !(formats instanceof Array)) {
                throw new TypeError('extraFormats() expects an array or false parameter');
            }

            options.extraFormats = formats;
            if (parseFormats) {
                initFormatting(); // reinit formatting
            }
            return picker;
        };

        picker.disabledDates = function (dates) {
            ///<signature helpKeyword="$.fn.datetimepicker.disabledDates">
            ///<summary>Returns an array with the currently set disabled dates on the component.</summary>
            ///<returns type="array">options.disabledDates</returns>
            ///</signature>
            ///<signature>
            ///<summary>Setting this takes precedence over options.minDate, options.maxDate configuration. Also calling this function removes the configuration of
            ///options.enabledDates if such exist.</summary>
            ///<param name="dates" locid="$.fn.datetimepicker.disabledDates_p:dates">Takes an [ string or Date or moment ] of values and allows the user to select only from those days.</param>
            ///</signature>
            if (arguments.length === 0) {
                return (options.disabledDates ? $.extend({}, options.disabledDates) : options.disabledDates);
            }

            if (!dates) {
                options.disabledDates = false;
                update();
                return picker;
            }
            if (!(dates instanceof Array)) {
                throw new TypeError('disabledDates() expects an array parameter');
            }
            options.disabledDates = indexGivenDates(dates);
            options.enabledDates = false;
            update();
            return picker;
        };

        picker.enabledDates = function (dates) {
            ///<signature helpKeyword="$.fn.datetimepicker.enabledDates">
            ///<summary>Returns an array with the currently set enabled dates on the component.</summary>
            ///<returns type="array">options.enabledDates</returns>
            ///</signature>
            ///<signature>
            ///<summary>Setting this takes precedence over options.minDate, options.maxDate configuration. Also calling this function removes the configuration of options.disabledDates if such exist.</summary>
            ///<param name="dates" locid="$.fn.datetimepicker.enabledDates_p:dates">Takes an [ string or Date or moment ] of values and allows the user to select only from those days.</param>
            ///</signature>
            if (arguments.length === 0) {
                return (options.enabledDates ? $.extend({}, options.enabledDates) : options.enabledDates);
            }

            if (!dates) {
                options.enabledDates = false;
                update();
                return picker;
            }
            if (!(dates instanceof Array)) {
                throw new TypeError('enabledDates() expects an array parameter');
            }
            options.enabledDates = indexGivenDates(dates);
            options.disabledDates = false;
            update();
            return picker;
        };

        picker.daysOfWeekDisabled = function (daysOfWeekDisabled) {
            if (arguments.length === 0) {
                return options.daysOfWeekDisabled.splice(0);
            }

            if ((typeof daysOfWeekDisabled === 'boolean') && !daysOfWeekDisabled) {
                options.daysOfWeekDisabled = false;
                update();
                return picker;
            }

            if (!(daysOfWeekDisabled instanceof Array)) {
                throw new TypeError('daysOfWeekDisabled() expects an array parameter');
            }
            options.daysOfWeekDisabled = daysOfWeekDisabled.reduce(function (previousValue, currentValue) {
                currentValue = parseInt(currentValue, 10);
                if (currentValue > 6 || currentValue < 0 || isNaN(currentValue)) {
                    return previousValue;
                }
                if (previousValue.indexOf(currentValue) === -1) {
                    previousValue.push(currentValue);
                }
                return previousValue;
            }, []).sort();
            if (options.useCurrent && !options.keepInvalid) {
                var tries = 0;
                while (!isValid(date, 'd')) {
                    date.add(1, 'd');
                    if (tries === 7) {
                        throw 'Tried 7 times to find a valid date';
                    }
                    tries++;
                }
                setValue(date);
            }
            update();
            return picker;
        };

        picker.maxDate = function (maxDate) {
            if (arguments.length === 0) {
                return options.maxDate ? options.maxDate.clone() : options.maxDate;
            }

            if ((typeof maxDate === 'boolean') && maxDate === false) {
                options.maxDate = false;
                update();
                return picker;
            }

            if (typeof maxDate === 'string') {
                if (maxDate === 'now' || maxDate === 'moment') {
                    maxDate = getMoment();
                }
            }

            var parsedDate = parseInputDate(maxDate);

            if (!parsedDate.isValid()) {
                throw new TypeError('maxDate() Could not parse date parameter: ' + maxDate);
            }
            if (options.minDate && parsedDate.isBefore(options.minDate)) {
                throw new TypeError('maxDate() date parameter is before options.minDate: ' + parsedDate.format(actualFormat));
            }
            options.maxDate = parsedDate;
            if (options.useCurrent && !options.keepInvalid && date.isAfter(maxDate)) {
                setValue(options.maxDate);
            }
            if (viewDate.isAfter(parsedDate)) {
                viewDate = parsedDate.clone().subtract(options.stepping, 'm');
            }
            update();
            return picker;
        };

        picker.minDate = function (minDate) {
            if (arguments.length === 0) {
                return options.minDate ? options.minDate.clone() : options.minDate;
            }

            if ((typeof minDate === 'boolean') && minDate === false) {
                options.minDate = false;
                update();
                return picker;
            }

            if (typeof minDate === 'string') {
                if (minDate === 'now' || minDate === 'moment') {
                    minDate = getMoment();
                }
            }

            var parsedDate = parseInputDate(minDate);

            if (!parsedDate.isValid()) {
                throw new TypeError('minDate() Could not parse date parameter: ' + minDate);
            }
            if (options.maxDate && parsedDate.isAfter(options.maxDate)) {
                throw new TypeError('minDate() date parameter is after options.maxDate: ' + parsedDate.format(actualFormat));
            }
            options.minDate = parsedDate;
            if (options.useCurrent && !options.keepInvalid && date.isBefore(minDate)) {
                setValue(options.minDate);
            }
            if (viewDate.isBefore(parsedDate)) {
                viewDate = parsedDate.clone().add(options.stepping, 'm');
            }
            update();
            return picker;
        };

        picker.defaultDate = function (defaultDate) {
            ///<signature helpKeyword="$.fn.datetimepicker.defaultDate">
            ///<summary>Returns a moment with the options.defaultDate option configuration or false if not set</summary>
            ///<returns type="Moment">date.clone()</returns>
            ///</signature>
            ///<signature>
            ///<summary>Will set the picker's inital date. If a boolean:false value is passed the options.defaultDate parameter is cleared.</summary>
            ///<param name="defaultDate" locid="$.fn.datetimepicker.defaultDate_p:defaultDate">Takes a string, Date, moment, boolean:false</param>
            ///</signature>
            if (arguments.length === 0) {
                return options.defaultDate ? options.defaultDate.clone() : options.defaultDate;
            }
            if (!defaultDate) {
                options.defaultDate = false;
                return picker;
            }

            if (typeof defaultDate === 'string') {
                if (defaultDate === 'now' || defaultDate === 'moment') {
                    defaultDate = getMoment();
                }
            }

            var parsedDate = parseInputDate(defaultDate);
            if (!parsedDate.isValid()) {
                throw new TypeError('defaultDate() Could not parse date parameter: ' + defaultDate);
            }
            if (!isValid(parsedDate)) {
                throw new TypeError('defaultDate() date passed is invalid according to component setup validations');
            }

            options.defaultDate = parsedDate;

            if ((options.defaultDate && options.inline) || input.val().trim() === '') {
                setValue(options.defaultDate);
            }
            return picker;
        };

        picker.locale = function (locale) {
            if (arguments.length === 0) {
                return options.locale;
            }

            if (!moment.localeData(locale)) {
                throw new TypeError('locale() locale ' + locale + ' is not loaded from moment locales!');
            }

            options.locale = locale;
            date.locale(options.locale);
            viewDate.locale(options.locale);

            if (actualFormat) {
                initFormatting(); // reinit formatting
            }
            if (widget) {
                hide();
                show();
            }
            return picker;
        };

        picker.stepping = function (stepping) {
            if (arguments.length === 0) {
                return options.stepping;
            }

            stepping = parseInt(stepping, 10);
            if (isNaN(stepping) || stepping < 1) {
                stepping = 1;
            }
            options.stepping = stepping;
            return picker;
        };

        picker.useCurrent = function (useCurrent) {
            var useCurrentOptions = ['year', 'month', 'day', 'hour', 'minute'];
            if (arguments.length === 0) {
                return options.useCurrent;
            }

            if ((typeof useCurrent !== 'boolean') && (typeof useCurrent !== 'string')) {
                throw new TypeError('useCurrent() expects a boolean or string parameter');
            }
            if (typeof useCurrent === 'string' && useCurrentOptions.indexOf(useCurrent.toLowerCase()) === -1) {
                throw new TypeError('useCurrent() expects a string parameter of ' + useCurrentOptions.join(', '));
            }
            options.useCurrent = useCurrent;
            return picker;
        };

        picker.collapse = function (collapse) {
            if (arguments.length === 0) {
                return options.collapse;
            }

            if (typeof collapse !== 'boolean') {
                throw new TypeError('collapse() expects a boolean parameter');
            }
            if (options.collapse === collapse) {
                return picker;
            }
            options.collapse = collapse;
            if (widget) {
                hide();
                show();
            }
            return picker;
        };

        picker.icons = function (icons) {
            if (arguments.length === 0) {
                return $.extend({}, options.icons);
            }

            if (!(icons instanceof Object)) {
                throw new TypeError('icons() expects parameter to be an Object');
            }
            $.extend(options.icons, icons);
            if (widget) {
                hide();
                show();
            }
            return picker;
        };

        picker.tooltips = function (tooltips) {
            if (arguments.length === 0) {
                return $.extend({}, options.tooltips);
            }

            if (!(tooltips instanceof Object)) {
                throw new TypeError('tooltips() expects parameter to be an Object');
            }
            $.extend(options.tooltips, tooltips);
            if (widget) {
                hide();
                show();
            }
            return picker;
        };

        picker.useStrict = function (useStrict) {
            if (arguments.length === 0) {
                return options.useStrict;
            }

            if (typeof useStrict !== 'boolean') {
                throw new TypeError('useStrict() expects a boolean parameter');
            }
            options.useStrict = useStrict;
            return picker;
        };

        picker.sideBySide = function (sideBySide) {
            if (arguments.length === 0) {
                return options.sideBySide;
            }

            if (typeof sideBySide !== 'boolean') {
                throw new TypeError('sideBySide() expects a boolean parameter');
            }
            options.sideBySide = sideBySide;
            if (widget) {
                hide();
                show();
            }
            return picker;
        };

        picker.viewMode = function (viewMode) {
            if (arguments.length === 0) {
                return options.viewMode;
            }

            if (typeof viewMode !== 'string') {
                throw new TypeError('viewMode() expects a string parameter');
            }

            if (viewModes.indexOf(viewMode) === -1) {
                throw new TypeError('viewMode() parameter must be one of (' + viewModes.join(', ') + ') value');
            }

            options.viewMode = viewMode;
            currentViewMode = Math.max(viewModes.indexOf(viewMode), minViewModeNumber);

            showMode();
            return picker;
        };

        picker.toolbarPlacement = function (toolbarPlacement) {
            if (arguments.length === 0) {
                return options.toolbarPlacement;
            }

            if (typeof toolbarPlacement !== 'string') {
                throw new TypeError('toolbarPlacement() expects a string parameter');
            }
            if (toolbarPlacements.indexOf(toolbarPlacement) === -1) {
                throw new TypeError('toolbarPlacement() parameter must be one of (' + toolbarPlacements.join(', ') + ') value');
            }
            options.toolbarPlacement = toolbarPlacement;

            if (widget) {
                hide();
                show();
            }
            return picker;
        };

        picker.widgetPositioning = function (widgetPositioning) {
            if (arguments.length === 0) {
                return $.extend({}, options.widgetPositioning);
            }

            if (({}).toString.call(widgetPositioning) !== '[object Object]') {
                throw new TypeError('widgetPositioning() expects an object variable');
            }
            if (widgetPositioning.horizontal) {
                if (typeof widgetPositioning.horizontal !== 'string') {
                    throw new TypeError('widgetPositioning() horizontal variable must be a string');
                }
                widgetPositioning.horizontal = widgetPositioning.horizontal.toLowerCase();
                if (horizontalModes.indexOf(widgetPositioning.horizontal) === -1) {
                    throw new TypeError('widgetPositioning() expects horizontal parameter to be one of (' + horizontalModes.join(', ') + ')');
                }
                options.widgetPositioning.horizontal = widgetPositioning.horizontal;
            }
            if (widgetPositioning.vertical) {
                if (typeof widgetPositioning.vertical !== 'string') {
                    throw new TypeError('widgetPositioning() vertical variable must be a string');
                }
                widgetPositioning.vertical = widgetPositioning.vertical.toLowerCase();
                if (verticalModes.indexOf(widgetPositioning.vertical) === -1) {
                    throw new TypeError('widgetPositioning() expects vertical parameter to be one of (' + verticalModes.join(', ') + ')');
                }
                options.widgetPositioning.vertical = widgetPositioning.vertical;
            }
            update();
            return picker;
        };

        picker.calendarWeeks = function (calendarWeeks) {
            if (arguments.length === 0) {
                return options.calendarWeeks;
            }

            if (typeof calendarWeeks !== 'boolean') {
                throw new TypeError('calendarWeeks() expects parameter to be a boolean value');
            }

            options.calendarWeeks = calendarWeeks;
            update();
            return picker;
        };

        picker.showTodayButton = function (showTodayButton) {
            if (arguments.length === 0) {
                return options.showTodayButton;
            }

            if (typeof showTodayButton !== 'boolean') {
                throw new TypeError('showTodayButton() expects a boolean parameter');
            }

            options.showTodayButton = showTodayButton;
            if (widget) {
                hide();
                show();
            }
            return picker;
        };

        picker.showClear = function (showClear) {
            if (arguments.length === 0) {
                return options.showClear;
            }

            if (typeof showClear !== 'boolean') {
                throw new TypeError('showClear() expects a boolean parameter');
            }

            options.showClear = showClear;
            if (widget) {
                hide();
                show();
            }
            return picker;
        };

        picker.widgetParent = function (widgetParent) {
            if (arguments.length === 0) {
                return options.widgetParent;
            }

            if (typeof widgetParent === 'string') {
                widgetParent = $(widgetParent);
            }

            if (widgetParent !== null && (typeof widgetParent !== 'string' && !(widgetParent instanceof $))) {
                throw new TypeError('widgetParent() expects a string or a jQuery object parameter');
            }

            options.widgetParent = widgetParent;
            if (widget) {
                hide();
                show();
            }
            return picker;
        };

        picker.keepOpen = function (keepOpen) {
            if (arguments.length === 0) {
                return options.keepOpen;
            }

            if (typeof keepOpen !== 'boolean') {
                throw new TypeError('keepOpen() expects a boolean parameter');
            }

            options.keepOpen = keepOpen;
            return picker;
        };

        picker.focusOnShow = function (focusOnShow) {
            if (arguments.length === 0) {
                return options.focusOnShow;
            }

            if (typeof focusOnShow !== 'boolean') {
                throw new TypeError('focusOnShow() expects a boolean parameter');
            }

            options.focusOnShow = focusOnShow;
            return picker;
        };

        picker.inline = function (inline) {
            if (arguments.length === 0) {
                return options.inline;
            }

            if (typeof inline !== 'boolean') {
                throw new TypeError('inline() expects a boolean parameter');
            }

            options.inline = inline;
            return picker;
        };

        picker.clear = function () {
            clear();
            return picker;
        };

        picker.keyBinds = function (keyBinds) {
            options.keyBinds = keyBinds;
            return picker;
        };

        picker.getMoment = function (d) {
            return getMoment(d);
        };

        picker.debug = function (debug) {
            if (typeof debug !== 'boolean') {
                throw new TypeError('debug() expects a boolean parameter');
            }

            options.debug = debug;
            return picker;
        };

        picker.allowInputToggle = function (allowInputToggle) {
            if (arguments.length === 0) {
                return options.allowInputToggle;
            }

            if (typeof allowInputToggle !== 'boolean') {
                throw new TypeError('allowInputToggle() expects a boolean parameter');
            }

            options.allowInputToggle = allowInputToggle;
            return picker;
        };

        picker.showClose = function (showClose) {
            if (arguments.length === 0) {
                return options.showClose;
            }

            if (typeof showClose !== 'boolean') {
                throw new TypeError('showClose() expects a boolean parameter');
            }

            options.showClose = showClose;
            return picker;
        };

        picker.keepInvalid = function (keepInvalid) {
            if (arguments.length === 0) {
                return options.keepInvalid;
            }

            if (typeof keepInvalid !== 'boolean') {
                throw new TypeError('keepInvalid() expects a boolean parameter');
            }
            options.keepInvalid = keepInvalid;
            return picker;
        };

        picker.datepickerInput = function (datepickerInput) {
            if (arguments.length === 0) {
                return options.datepickerInput;
            }

            if (typeof datepickerInput !== 'string') {
                throw new TypeError('datepickerInput() expects a string parameter');
            }

            options.datepickerInput = datepickerInput;
            return picker;
        };

        picker.parseInputDate = function (parseInputDate) {
            if (arguments.length === 0) {
                return options.parseInputDate;
            }

            if (typeof parseInputDate !== 'function') {
                throw new TypeError('parseInputDate() sholud be as function');
            }

            options.parseInputDate = parseInputDate;

            return picker;
        };

        picker.disabledTimeIntervals = function (disabledTimeIntervals) {
            ///<signature helpKeyword="$.fn.datetimepicker.disabledTimeIntervals">
            ///<summary>Returns an array with the currently set disabled dates on the component.</summary>
            ///<returns type="array">options.disabledTimeIntervals</returns>
            ///</signature>
            ///<signature>
            ///<summary>Setting this takes precedence over options.minDate, options.maxDate configuration. Also calling this function removes the configuration of
            ///options.enabledDates if such exist.</summary>
            ///<param name="dates" locid="$.fn.datetimepicker.disabledTimeIntervals_p:dates">Takes an [ string or Date or moment ] of values and allows the user to select only from those days.</param>
            ///</signature>
            if (arguments.length === 0) {
                return (options.disabledTimeIntervals ? $.extend({}, options.disabledTimeIntervals) : options.disabledTimeIntervals);
            }

            if (!disabledTimeIntervals) {
                options.disabledTimeIntervals = false;
                update();
                return picker;
            }
            if (!(disabledTimeIntervals instanceof Array)) {
                throw new TypeError('disabledTimeIntervals() expects an array parameter');
            }
            options.disabledTimeIntervals = disabledTimeIntervals;
            update();
            return picker;
        };

        picker.disabledHours = function (hours) {
            ///<signature helpKeyword="$.fn.datetimepicker.disabledHours">
            ///<summary>Returns an array with the currently set disabled hours on the component.</summary>
            ///<returns type="array">options.disabledHours</returns>
            ///</signature>
            ///<signature>
            ///<summary>Setting this takes precedence over options.minDate, options.maxDate configuration. Also calling this function removes the configuration of
            ///options.enabledHours if such exist.</summary>
            ///<param name="hours" locid="$.fn.datetimepicker.disabledHours_p:hours">Takes an [ int ] of values and disallows the user to select only from those hours.</param>
            ///</signature>
            if (arguments.length === 0) {
                return (options.disabledHours ? $.extend({}, options.disabledHours) : options.disabledHours);
            }

            if (!hours) {
                options.disabledHours = false;
                update();
                return picker;
            }
            if (!(hours instanceof Array)) {
                throw new TypeError('disabledHours() expects an array parameter');
            }
            options.disabledHours = indexGivenHours(hours);
            options.enabledHours = false;
            if (options.useCurrent && !options.keepInvalid) {
                var tries = 0;
                while (!isValid(date, 'h')) {
                    date.add(1, 'h');
                    if (tries === 24) {
                        throw 'Tried 24 times to find a valid date';
                    }
                    tries++;
                }
                setValue(date);
            }
            update();
            return picker;
        };

        picker.enabledHours = function (hours) {
            ///<signature helpKeyword="$.fn.datetimepicker.enabledHours">
            ///<summary>Returns an array with the currently set enabled hours on the component.</summary>
            ///<returns type="array">options.enabledHours</returns>
            ///</signature>
            ///<signature>
            ///<summary>Setting this takes precedence over options.minDate, options.maxDate configuration. Also calling this function removes the configuration of options.disabledHours if such exist.</summary>
            ///<param name="hours" locid="$.fn.datetimepicker.enabledHours_p:hours">Takes an [ int ] of values and allows the user to select only from those hours.</param>
            ///</signature>
            if (arguments.length === 0) {
                return (options.enabledHours ? $.extend({}, options.enabledHours) : options.enabledHours);
            }

            if (!hours) {
                options.enabledHours = false;
                update();
                return picker;
            }
            if (!(hours instanceof Array)) {
                throw new TypeError('enabledHours() expects an array parameter');
            }
            options.enabledHours = indexGivenHours(hours);
            options.disabledHours = false;
            if (options.useCurrent && !options.keepInvalid) {
                var tries = 0;
                while (!isValid(date, 'h')) {
                    date.add(1, 'h');
                    if (tries === 24) {
                        throw 'Tried 24 times to find a valid date';
                    }
                    tries++;
                }
                setValue(date);
            }
            update();
            return picker;
        };

        picker.viewDate = function (newDate) {
            ///<signature helpKeyword="$.fn.datetimepicker.viewDate">
            ///<summary>Returns the component's model current viewDate, a moment object or null if not set.</summary>
            ///<returns type="Moment">viewDate.clone()</returns>
            ///</signature>
            ///<signature>
            ///<summary>Sets the components model current moment to it. Passing a null value unsets the components model current moment. Parsing of the newDate parameter is made using moment library with the options.format and options.useStrict components configuration.</summary>
            ///<param name="newDate" locid="$.fn.datetimepicker.date_p:newDate">Takes string, viewDate, moment, null parameter.</param>
            ///</signature>
            if (arguments.length === 0) {
                return viewDate.clone();
            }

            if (!newDate) {
                viewDate = date.clone();
                return picker;
            }

            if (typeof newDate !== 'string' && !moment.isMoment(newDate) && !(newDate instanceof Date)) {
                throw new TypeError('viewDate() parameter must be one of [string, moment or Date]');
            }

            viewDate = parseInputDate(newDate);
            viewUpdate();
            return picker;
        };

        // initializing element and component attributes
        if (element.is('input')) {
            input = element;
        } else {
            input = element.find(options.datepickerInput);
            if (input.size() === 0) {
                input = element.find('input');
            } else if (!input.is('input')) {
                throw new Error('CSS class "' + options.datepickerInput + '" cannot be applied to non input element');
            }
        }

        if (element.hasClass('bhtc-input-group')) {
            // in case there is more then one 'input-group-addon' Issue #48
            if (element.find('.bhtc-datepickerbutton').size() === 0) {
                component = element.find('.bhtc-input-group-addon');
            } else {
                component = element.find('.bhtc-datepickerbutton');
            }
        }

        if (!options.inline && !input.is('input')) {
            throw new Error('Could not initialize DateTimePicker without an input element');
        }

        // Set defaults for date here now instead of in var declaration
        date = getMoment();
        viewDate = date.clone();

        $.extend(true, options, dataToOptions());

        picker.options(options);

        initFormatting();

        attachDatePickerElementEvents();

        if (input.prop('bhtc-disabled')) {
            picker.disable();
        }
        if (input.is('input') && input.val().trim().length !== 0) {
            setValue(parseInputDate(input.val().trim()));
        }
        else if (options.defaultDate && input.attr('placeholder') === undefined) {
            setValue(options.defaultDate);
        }
        if (options.inline) {
            show();
        }
        return picker;
    };

    /********************************************************************************
     *
     * jQuery plugin constructor and defaults object
     *
     ********************************************************************************/

    $.fn.datetimepicker = function (options) {
        return this.each(function () {
            var $this = $(this);
            if (!$this.data('DateTimePicker')) {
                // create a private copy of the defaults object
                options = $.extend(true, {}, $.fn.datetimepicker.defaults, options);
                $this.data('DateTimePicker', dateTimePicker($this, options));
            }
        });
    };

    $.fn.datetimepicker.defaults = {
        timeZone: 'Etc/UTC',
        format: false,
        dayViewHeaderFormat: 'YYYY MMMM',
        extraFormats: false,
        stepping: 1,
        minDate: false,
        maxDate: false,
        useCurrent: true,
        collapse: true,
        locale: 'zh-cn',
        defaultDate: false,
        disabledDates: false,
        enabledDates: false,
        icons: {
            time: 'iconfont icon-accesstime',
            date: 'iconfont icon-daterange',
            up: 'iconfont icon-keyboardarrowup',
            down: 'iconfont icon-keyboardarrowdown',
            previous: 'iconfont icon-keyboardarrowleft',
            next: 'iconfont icon-keyboardarrowright',
            today: 'glyphicon glyphicon-screenshot',
            clear: 'glyphicon glyphicon-trash',
            close: 'glyphicon glyphicon-remove'
        },
        tooltips: {
            today: 'Go to today',
            clear: 'Clear selection',
            close: 'Close the picker',
            selectMonth: 'Select Month',
            prevMonth: 'Previous Month',
            nextMonth: 'Next Month',
            selectYear: 'Select Year',
            prevYear: 'Previous Year',
            nextYear: 'Next Year',
            selectDecade: 'Select Decade',
            prevDecade: 'Previous Decade',
            nextDecade: 'Next Decade',
            prevCentury: 'Previous Century',
            nextCentury: 'Next Century',
            pickHour: 'Pick Hour',
            incrementHour: 'Increment Hour',
            decrementHour: 'Decrement Hour',
            pickMinute: 'Pick Minute',
            incrementMinute: 'Increment Minute',
            decrementMinute: 'Decrement Minute',
            pickSecond: 'Pick Second',
            incrementSecond: 'Increment Second',
            decrementSecond: 'Decrement Second',
            togglePeriod: 'Toggle Period',
            selectTime: 'Select Time'
        },
        useStrict: false,
        sideBySide: false,
        daysOfWeekDisabled: false,
        calendarWeeks: false,
        viewMode: 'days',
        toolbarPlacement: 'default',
        showTodayButton: false,
        showClear: false,
        showClose: false,
        widgetPositioning: {
            horizontal: 'auto',
            vertical: 'auto'
        },
        widgetParent: null,
        ignoreReadonly: false,
        keepOpen: false,
        focusOnShow: true,
        inline: false,
        keepInvalid: false,
        datepickerInput: '.bhtc-datepickerinput',
        keyBinds: {
            up: function (widget) {
                if (!widget) {
                    return;
                }
                var d = this.date() || this.getMoment();
                if (widget.find('.bhtc-datepicker').is(':visible')) {
                    this.date(d.clone().subtract(7, 'd'));
                } else {
                    this.date(d.clone().add(this.stepping(), 'm'));
                }
            },
            down: function (widget) {
                if (!widget) {
                    this.show();
                    return;
                }
                var d = this.date() || this.getMoment();
                if (widget.find('.bhtc-datepicker').is(':visible')) {
                    this.date(d.clone().add(7, 'd'));
                } else {
                    this.date(d.clone().subtract(this.stepping(), 'm'));
                }
            },
            'control up': function (widget) {
                if (!widget) {
                    return;
                }
                var d = this.date() || this.getMoment();
                if (widget.find('.bhtc-datepicker').is(':visible')) {
                    this.date(d.clone().subtract(1, 'y'));
                } else {
                    this.date(d.clone().add(1, 'h'));
                }
            },
            'control down': function (widget) {
                if (!widget) {
                    return;
                }
                var d = this.date() || this.getMoment();
                if (widget.find('.bhtc-datepicker').is(':visible')) {
                    this.date(d.clone().add(1, 'y'));
                } else {
                    this.date(d.clone().subtract(1, 'h'));
                }
            },
            left: function (widget) {
                if (!widget) {
                    return;
                }
                var d = this.date() || this.getMoment();
                if (widget.find('.bhtc-datepicker').is(':visible')) {
                    this.date(d.clone().subtract(1, 'd'));
                }
            },
            right: function (widget) {
                if (!widget) {
                    return;
                }
                var d = this.date() || this.getMoment();
                if (widget.find('.bhtc-datepicker').is(':visible')) {
                    this.date(d.clone().add(1, 'd'));
                }
            },
            pageUp: function (widget) {
                if (!widget) {
                    return;
                }
                var d = this.date() || this.getMoment();
                if (widget.find('.bhtc-datepicker').is(':visible')) {
                    this.date(d.clone().subtract(1, 'M'));
                }
            },
            pageDown: function (widget) {
                if (!widget) {
                    return;
                }
                var d = this.date() || this.getMoment();
                if (widget.find('.bhtc-datepicker').is(':visible')) {
                    this.date(d.clone().add(1, 'M'));
                }
            },
            enter: function () {
                this.hide();
            },
            escape: function () {
                this.hide();
            },
            //tab: function (widget) { //this break the flow of the form. disabling for now
            //    var toggle = widget.find('.picker-switch a[data-action="togglePicker"]');
            //    if(toggle.length > 0) toggle.click();
            //},
            'control space': function (widget) {
                if (widget.find('.bhtc-timepicker').is(':visible')) {
                    widget.find('.bhtc-btn[data-action="togglePeriod"]').click();
                }
            },
            t: function () {
                this.date(this.getMoment());
            },
            'delete': function () {
                this.clear();
            }
        },
        debug: false,
        allowInputToggle: false,
        disabledTimeIntervals: false,
        disabledHours: false,
        enabledHours: false,
        viewDate: false
    };
})(jQuery, moment);
