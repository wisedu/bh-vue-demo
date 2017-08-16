$.fn.emapFormInputInit = function (opt) {
    WIS_EMAP_INPUT.init($(this), opt);
};

/**
 * @fileOverview emapInput 功能模块
 */

(function (WIS_EMAP_INPUT, undefined) {
    /**
     * @module WIS_EMAP_INPUT
     * @example
     WIS_EMAP_INPUT.init($form, {root: '/emap'})
     */


    /**
     * @method init
     * @description 表单控件初始化
     * @param {Object} element - 要实例化的控件占位DOM, 可以是单个控件占位或者表单外框
     * @param {Object=} opt - 表单控件options 对象
     */
    WIS_EMAP_INPUT.init = function (element, opt) {
        //控件初始化
        opt = opt || {};
        var options = $.extend({}, {
            'root': ''
        }, opt);

        if ($(element).attr('xtype')) {
            if ($(element).hasClass('bh-form-static')) return; // 静态展示字段不做实例化
            inputInit(element, options);
        } else {
            opt._inputInitCount = 0;
            opt._inputInitCounter = 0;
            $(element).find('[xtype]:not(.bh-form-static)').each(function () {
                if (this.nodeName == 'TEXTAREA' && this.hasAttribute('readOnly')) {
                    return;
                }
                if ($.inArray($(this).attr('xtype'), ['checkboxlist', 'radiolist', 'buttonlist', 'multi-buttonlist', 'uploadfile', 'uploadsingleimage', 'uploadmuiltimage']) > -1) {
                    opt._inputInitCount++;
                }
                inputInit(this, options);
            });
            $(element).on('bhInputInitComplete', function () {
                opt._inputInitCounter++;
                if (opt._inputInitCounter == opt._inputInitCount) {
                    $(this).trigger('_init');
                }
            });

        }

        function inputInit(ele, options) {
            var _this = $(ele);
            var jsonParam = _this.data('jsonparam');
            if (typeof jsonParam == 'string') {
                try {
                    jsonParam = JSON.parse(jsonParam.replace(/'/g, '"'));
                } catch (e) {
                    console && console.warn('无效的json param格式!');
                    jsonParam = {};
                }
            }

            var inputParam = options.defaultOptions ? (options.defaultOptions[_this.attr('xtype')] || {}) : {};
            var params = $.extend({}, inputParam, jsonParam);
            var xtype = _this.attr('xtype') || 'text';

            WIS_EMAP_INPUT.component[xtype].init(_this, params, options);
        }
    };

    /**
     * @method setValue
     * @description 表单控件赋值
     * @param {Object} element - 需要初始化的控件DOM
     * @param {String} name - 字段的name
     * @param {String} xtype - 控件类型
     * @param {Object} val - 数据对象 如 {WID: 123}
     * @param {String} root - emap跟路径, 上传控件时必传
     */
    WIS_EMAP_INPUT.setValue = function (element, name, xtype, val, root) {
        var _this = $(element);
        if (!name) {
            name = _this.data('name');
        }

        if (xtype == "undefined") xtype = "text";
        xtype = xtype || 'text';
        WIS_EMAP_INPUT.component[xtype].setValue(element, name, val, root);
    };

    /**
     * @method formSetValue
     * @description 表单赋值
     * @param {Object} element - 表单容器
     * @param {Object} val - 数据对象  如 {WID: 123}
     * @param {Object} options - 表单的options对象
     */
    WIS_EMAP_INPUT.formSetValue = function (element, val, options) {
        var $element = $(element);
        if (options && options.readonly) {
            // 只读表单
            options.formValue = val;
            $element.find('[xtype]').each(function () {
                var name = $(this).data('name');
                var _this = $(this);
                var nameDisplay = null;
                if (val[name] !== undefined && val[name] !== null) {
                    switch ($(this).attr('xtype')) {
                        case 'multi-select':
                        case 'select':
                        case 'multi-select2':
                            if (val[name + '_DISPLAY']) {
                                setItemVal(val[name + '_DISPLAY'], val[name]);
                            } else {
                                WIS_EMAP_INPUT.getInputOptions(_this.data("url"), function (res) {
                                    _this.data('model', res);
                                    var valueArr = val[name].split(',');
                                    var nameArr = [];
                                    $(res).each(function () {
                                        if ($.inArray(this.id, valueArr) > -1) {
                                            nameArr.push(this.name);
                                        }
                                    });
                                    setItemVal(nameArr.join(','), val[name]);
                                });
                            }
                            break;
                        case 'radiolist':
                            if (val[name + '_DISPLAY']) {
                                setItemVal(val[name + '_DISPLAY'], val[name]);
                            } else {
                                WIS_EMAP_INPUT.getInputOptions(_this.data("url"), function (res) {
                                    _this.data('model', res);
                                    $(res).each(function () {
                                        if (this.id == val[name]) {
                                            nameDisplay = this.name;
                                            return false;
                                        }
                                    });
                                });
                            }
                            break;

                        case 'checkboxlist':
                            if (val[name + '_DISPLAY']) {
                                setItemVal(val[name + '_DISPLAY'], val[name]);
                            } else {
                                WIS_EMAP_INPUT.getInputOptions(_this.data("url"), function (res) {
                                    _this.data('model', res);
                                    var valueArr = val[name].split(',');
                                    var nameArr = [];
                                    $(res).each(function () {
                                        if ($.inArray(this.id, valueArr) > -1) {
                                            nameArr.push(this.name);
                                        }
                                    });
                                    setItemVal(nameArr.join(','), val[name]);
                                });
                            }

                            break;
                        case 'tree':
                            if (val[name + '_DISPLAY']) {
                                setItemVal(val[name + '_DISPLAY'], val[name]);
                            } else {
                                WIS_EMAP_INPUT.getInputOptions(_this.data("url"), function (res) {
                                    _this.data('model', res);
                                    var valueArr = val[name].split(',');
                                    var nameArr = [];
                                    $(res).each(function () {
                                        if ($.inArray(this.id, valueArr) > -1) {
                                            nameArr.push(this.name);
                                        }
                                    });
                                    setItemVal(nameArr.join(','), val[name]);
                                });
                            }
                            break;
                        case 'uploadfile':
                            $(this).emapFileDownload($.extend({}, {
                                contextPath: options.root,
                                token: val[name]
                            }, JSON.parse(decodeURI($(this).data('jsonparam')))));
                            break;
                        case 'uploadsingleimage':
                        case 'uploadmuiltimage':
                            $(this).emapFileDownload($.extend({}, {
                                model: 'image',
                                contextPath: options.root,
                                token: val[name]
                            }, JSON.parse(decodeURI($(this).data('jsonparam')))));
                            break;
                        case 'uploadphoto':
                            $(this).emapFilePhoto('destroy');
                            $(this).emapFilePhoto($.extend({}, {
                                token: val[name],
                                contextPath: options.root
                            }, JSON.parse(decodeURI($(this).data('jsonparam')))));
                            $('a', this).hide();
                            break;
                        case 'switcher':
                            val[name + 'DISPLAY'] = parseInt(val[name]) ? '是' : '否';
                            setItemVal(val[name + 'DISPLAY'], val[name]);
                            break;
                        default:
                            setItemVal(val[name]);
                    }
                }

                function setItemVal(val_dis, val) {
                    if (val_dis != null) {
                        _this.text(val_dis).attr('title', val_dis).data('value', val);
                    }
                }
            });
        } else {
            // 编辑表单
            $element.find('[xtype]').each(function () {
                var name = $(this).data('name');
                var _this = $(this);
                var xtype = _this.attr('xtype');
                //qiyu 2016-1-2 清空表单时，传入字段值为空，需要重置该控件
                //qiyu 2016-3-17 清空表单请使用clear方法，以下这句话将被注释掉
                //if (val[name] == null) {val[name] = ""}

                // 为表格表单中的 只读字段赋值 & 只读的textarea赋值
                if (options && options.model == 't') {
                    if (_this.hasClass('bh-form-static')) {
                        if (val[name] != null) {
                            if (val[name + '_DISPLAY'] !== undefined && val[name + '_DISPLAY'] !== null) {
                                _this.text(val[name + '_DISPLAY']).attr('title', val[name + '_DISPLAY']).data('value', val[name]);
                            } else {
                                _this.text(val[name]).attr('title', val[name]).data('value', val[name]);
                            }
                        }
                        return;
                    } else if (_this.attr('xtype') == 'textarea' && _this.attr('readonly')) {
                        if (val[name] != null) {
                            _this.val(val[name]);
                        }
                        return;
                    }

                }


                if (val === undefined) {

                } else if (val[name] !== undefined && val[name] !== null) {
                    WIS_EMAP_INPUT.setValue(_this, name, xtype, val, options.root || "");
                }
            });
        }
    };

    /**
     * @method getInputOptions
     * @description 获取表单选项数据
     * @param {String} url - 请求地址
     * @param {function} callback - 请求成功的回调函数
     */
    WIS_EMAP_INPUT.getInputOptions = function (url, callback) {
        // var dataAdapter = new $.jqx.dataAdapter({
        //     url: url,
        //     datatype: "json",
        //     //async: false,
        //     root: "datas>code>rows"
        // }, {
        //     loadComplete: function(records) {
        //         callback(records.datas.code.rows);
        //     }
        // });

        //qiyu 2016-11-19 将获取mock的url提取函数，在mock文件中重新定义
        var source = {
            url: url,
            datatype: "json",
            //async: false,
            root: "datas>code>rows"
        }
        if (typeof window.MOCK_CONFIG != 'undefined') {
            source = getSourceMock(source);
        }
        var dataAdapter = new $.jqx.dataAdapter(source, {
            loadComplete: function (records) {
                callback(records.datas.code.rows);
            }
        });

        dataAdapter.dataBind();
    };

    /**
     * @method formClear
     * @description 表单附件清空,如果不传参数val，则清空表单中所有值; 如果传入参数是个数组，则清空该数组中为字段名称的控件值
     * @param {Object} element - 表单容器DOM
     * @param {String | Obj} [val] - 需要清空的字段name
     * @param {Object} [options] - 表单options参数
     */
    WIS_EMAP_INPUT.formClear = function (element, val, options) {
        var $element = $(element);
        options = options || {};
        if (options && options.readonly) { // clear只读表单
            if (val == undefined) {
                $element.find('[xtype]').each(function () {
                    $(this).html("");
                });
                options.formValue = {};

            } else {
                for (var i = 0; i < val.length; i++) {
                    $element.find('[data-name=' + val[i] + '][xtype]').html("");
                    options.formValue[val[i]] = "";
                }
            }
        } else {
            if (val === undefined) {
                $element.find('[xtype]').each(function () {
                    var name = $(this).data('name');
                    var xtype = $(this).attr('xtype');
                    var _this = $(this);
                    WIS_EMAP_INPUT.setValue(_this, name, xtype, "", options.root);
                });
            } else {
                for (var i = 0; i < val.length; i++) {
                    var name = val[i];
                    var _this = $element.find('[data-name=' + name + '][xtype]');
                    var xtype = _this.attr('xtype');
                    var val = {};
                    val[name] = "";
                    WIS_EMAP_INPUT.setValue(_this, name, xtype, val, options.root);
                }
            }
        }
    };

    /**
     * @method formGetValue
     * @description 表单取值
     * @param {Object} element - 表单容器DOM
     * @param {Object} [options] - 表单options对象
     * @returns {Object} 表单数据JSON对象
     */
    WIS_EMAP_INPUT.formGetValue = function (element, options) {
        var $element = $(element);
        var formData;
        if (options && options.readonly) {
            formData = options.formValue || {};
            options.data.map(function (item) {
                if (formData[item.name] === undefined) {
                    formData[item.name] = '';
                }
            });
            return formData;
        } else {
            formData = {};
            $element.find('[xtype]').each(function () {
                var itemVal = "";

                // 表格表单静态展示项
                if ($(this).hasClass('bh-form-static') || ($(this).attr('readOnly') && $(this).attr('xtype') === 'textarea')) {

                    if ($.inArray($(this).attr('xtype'), ['radiolist', 'checkboxlist', 'tree', 'multi-select', 'select']) > -1) {
                        formData[$(this).data('name') + "_DISPLAY"] = $(this).text();
                        itemVal = $(this).data('value');
                    } else {
                        itemVal = $(this).data('value');
                    }
                } else {
                    itemVal = WIS_EMAP_INPUT.component[$(this).attr('xtype')].getValue($(this), formData);
                }

                formData[$(this).data('name')] = itemVal;
            });
            return formData;
        }
    };

    /**
     * @method disable
     * @description 表单控件 disable
     * @param {Object} element - 控件DOM
     */
    WIS_EMAP_INPUT.disable = function (element) {
        if (!element || $(element).length == 0) {
            console && console.error('Can not find field ');
            return;
        }
        var item = $(element);
        WIS_EMAP_INPUT.component[item.attr('xtype')].disable(item);
        var formGroup = item.closest('.bh-form-group');
        if (formGroup.length) {
            formGroup.addClass('bh-disabled');
        }
    };

    /**
     * @method formDisable
     * @description 表单disable
     * @param {Object} element - 表单DOM
     * @param {String | Array} [names] - 需要disable的字段name, 若不传则禁用表单中所有字段
     */
    WIS_EMAP_INPUT.formDisable = function (element, names) {
        if (!names) {
            // 禁用整个表单
            $('[xtype]', $(element)).each(function () {
                WIS_EMAP_INPUT.disable(this);
            });
        } else if (names instanceof Array) {
            // 多字段禁用
            names.map(function (item) {
                var inputElement = $('[data-name=' + item + ']', $(element));
                if (inputElement.length == 0) {
                    console && console.error('Can not find field ' + item);
                    return;
                }
                WIS_EMAP_INPUT.disable(inputElement);
            });
        } else {
            // 单字段禁用
            var inputElements = $('[data-name=' + names + ']', $(element));
            if (inputElements.length == 0) {
                console && console.error('Can not find field ' + names);
                return;
            }
            inputElements.each(function () {
                WIS_EMAP_INPUT.disable(this);
            });
        }
    };

    /**
     * @method enable
     * @description 表单控件enable
     * @param {Object} element - 控件DOM
     */
    WIS_EMAP_INPUT.enable = function (element) {
        if (!element || $(element).length == 0) {
            console && console.error('Can not find field ');
            return;
        }
        var item = $(element);
        WIS_EMAP_INPUT.component[item.attr('xtype')].enable(item);
        var formGroup = item.closest('.bh-form-group');
        if (formGroup.length) {
            formGroup.removeClass('bh-disabled');
        }
    };

    /**
     * @method formEnable
     * @description 表单enable
     * @param {Object} element - 表单DOM
     * @param {String | Array} [names] - 需要enable的字段name, 若不传则启用表单中所有字段
     */
    WIS_EMAP_INPUT.formEnable = function (element, names) {
        if (!names) {
            // 启用整个表单
            $('[xtype]', $(element)).each(function () {
                WIS_EMAP_INPUT.enable(this);
            });
        } else if (names instanceof Array) {
            // 多字段启用
            names.map(function (item) {
                var inputElement = $('[data-name=' + item + ']', $(element));
                if (inputElement.length == 0) {
                    console && console.error('Can not find field ' + item);
                    return;
                }
                WIS_EMAP_INPUT.enable(inputElement);
            });
        } else {
            // 单字段启用
            var inputElements = $('[data-name=' + names + ']', $(element));
            if (inputElements.length == 0) {
                console && console.error('Can not find field ' + names);
                return;
            }
            inputElements.each(function () {
                WIS_EMAP_INPUT.enable(this);
            });
        }
    };

    /**
     * @method renderPlaceHolder
     * @description 根据数据模型项渲染单个字段的placeholder
     * @param item
     * @returns {string}
     */
    WIS_EMAP_INPUT.renderPlaceHolder = function (item) {
        var attr = WIS_EMAP_SERV.getAttr(item);
        if (attr.inputReadonly) {
            attr.xtype = "static";
        }
        var controlHtml = "";
        switch (attr.xtype) {
            case undefined:
            case "text":
                attr.xtype = "text";
                controlHtml = '<input class="bh-form-control" data-caption="{{caption}}" data-type="{{dataType}}" data-name="{{name}}" name="{{name}}" xtype="{{xtype}}" type="{{xtype}}" {{checkType}} {{JSONParam}}  {{dataSize}} {{checkSize}} {{checkExp}} ' + (attr.inputReadonly ? 'readOnly' : '') + '  />';
                break;
            case "textarea":
                controlHtml = '<div xtype="{{xtype}}" data-caption="{{caption}}" data-type="{{dataType}}" data-name="{{name}}" {{checkType}} {{dataSize}} {{checkSize}} {{checkExp}} {{JSONParam}} ' + (attr.inputReadonly ? 'readOnly' : '') + ' ></div>';
                break;
            case "radiolist":
                controlHtml = '<div xtype="{{xtype}}" data-caption="{{caption}}" data-type="{{dataType}}" class="bh-radio jqx-radio-group" data-name="{{name}}" {{url}} {{checkSize}} data-disabled={{inputReadonly}}></div>';
                break;
            case "checkboxlist":
                controlHtml = '<div xtype="{{xtype}}" data-caption="{{caption}}" data-type="{{dataType}}" class="bh-checkbox" data-name="{{name}}" {{checkType}} {{url}} {{checkSize}} data-disabled={{inputReadonly}}></div>';
                break;
            case "selecttable":
            case "select":
            case "multi-select2":
            case "tree":
            case "multi-tree":
            case "date-local":
            case "date-ym":
            case "date-full":
            case "date-range":
            case "date-area":
            case "switcher":
            case "uploadfile":
            case "uploadphoto":
            case "uploadsingleimage":
            case "uploadmuiltimage":
            case "buttonlist":
            case "multi-buttonlist":
            case "multi-select":
            case "div":
            case "static":
            case "number":
            case "number-range":
            default:
                controlHtml = '<div xtype="{{xtype}}" data-caption="{{caption}}" data-type="{{dataType}}" data-name="{{name}}" {{url}} {{format}} {{checkType}} {{JSONParam}} {{checkSize}} data-disabled={{inputReadonly}}></div>';
                break;

        }
        controlHtml = controlHtml.replace(/\{\{xtype\}\}/g, attr.xtype)
            .replace(/\{\{name\}\}/g, attr.name)
            .replace(/\{\{dataType\}\}/g, attr.dataType)
            .replace(/\{\{inputReadonly\}\}/g, attr.inputReadonly)
            .replace(/\{\{caption\}\}/g, attr.caption);

        // 解决 $$ 在replace中被 转义为$ 的问题
        controlHtml = controlHtml.replace(/\{\{url\}\}/g, function () {
            return attr.url ? ('data-url="' + attr.url + '"') : '';
        });
        controlHtml = controlHtml.replace(/\{\{format\}\}/g, attr.format ? ('data-format="' + attr.format + '"') : '');
        controlHtml = controlHtml.replace(/\{\{checkType\}\}/g, attr.checkType ? ('data-checktype="' + encodeURI(attr.checkType) + '"') : '');
        controlHtml = controlHtml.replace(/\{\{dataSize\}\}/g, attr.dataSize ? ('data-size="' + attr.dataSize + '"') : '');
        controlHtml = controlHtml.replace(/\{\{checkSize\}\}/g, attr.checkSize ? ('data-checksize="' + attr.checkSize + '"') : '');
        controlHtml = controlHtml.replace(/\{\{checkExp\}\}/g, attr.checkExp ? ('data-checkexp=' + encodeURI(attr.checkExp)) : '');

        controlHtml = $(controlHtml);
        if (attr.optionData) { // optionData 为下拉项数据
            controlHtml.data('optiondata', attr.optionData);
        }
        if (attr.xtype == 'buttonlist' || attr.xtype == 'multi-buttonlist') {
            controlHtml.addClass('bh-label-radio-group');
        }

        controlHtml.data('jsonparam', attr.JSONParam);
        return controlHtml;
    };


    /**
     * @method placeHolder
     * @description ie9下为文本框/文本域添加placeholder
     * @param {object} ele 包含文本框的DOM容器 或者 文本框DOM
     * @method {String} [method=] 执行的方法， 默认为fix， 可选值 resize 用于重新定位 placeHolder
     */
    WIS_EMAP_INPUT.placeHolder = function (ele, method) {
        if (document.documentMode == 9) {
            if (!ele) return;

            if (method == 'resize') {
                if ($(ele)[0].nodeName == 'INPUT') {
                    JPlaceHolder.resize($(ele).parent());
                } else {
                    JPlaceHolder.resize(ele);
                }
                return
            }
            if ($(ele)[0].nodeName == 'INPUT' || $(ele)[0].nodeName == 'TEXTAREA') {
                JPlaceHolder.fix($(ele).parent());
            } else {
                JPlaceHolder.fix(ele);
            }
        }
    };

    /**
     * @method extend
     * @description 表单控件扩展方法
     * @param {Object} component - 需要注册的表单控件方法对象
     * @param {String} component.xtype - 表单控件的xtype
     * @param {String} component.init - 表单控件的实例化方法 function默认参数  ele, params
     * @param {String} component.setValue - 表单控件的赋值方法 function默认参数  ele, name, val, root
     * @param {String} component.getValue - 表单控件的取值方法 function默认参数  ele, formData
     * @param {String} component.disable - 表单控件的禁用方法 function默认参数  ele
     * @param {String} component.enable - 表单控件的启用方法 function默认参数  ele
     * @example
     * WIS_EMAP_INPUT.extend({
     *  xtype: 'xxx',
     *  init: function(ele, params) {},
     *  setValue: function(ele, name, val, root) {},
     *  getValue: function(ele, formData) {},
     *  disable: function(ele) {},
     *  enable: function(ele) {}
     * })
     */
    WIS_EMAP_INPUT.extend = function (component) {
        if (!component.xtype) return console && console.error('未指定自定义表单控件的xtype！');
        if (WIS_EMAP_INPUT.core[component.xtype]) return console && console.error('不能覆写表单默认控件类型' + compponent.xtype);
        WIS_EMAP_INPUT.component[component.xtype] = component;
    };

    /**
     * @memberof module:WIS_EMAP_INPUT
     * @description 表单控件注册对象
     * @prop {Object} select - 单选下拉，基于jqxDropdownList 封装
     * @prop {Object} multi-select2 - 多选下拉， 基于jqxDropdownList封装
     * @prop {Object} multi-select - 旧版多选下拉， 基于jqxCombobox封装，不推荐使用
     * @prop {Object} selecttable - 下拉表格/模糊搜索， 基于jqxCombobox封装
     * @prop {Object} date-ym - 年月选择框,基于jqxDateTimeInput封装， 默认 yyyy-MM
     * @prop {Object} date-local - 日期选择框,基于jqxDateTimeInput封装， 默认 yyyy-MM-dd
     * @prop {Object} date-full - 日期时间选择框,基于jqxDateTimeInput封装， 默认 yyyy-MM-dd HH:mm
     * @prop {Object} date-range - 日期范围选择, 只能在高级搜索中使用，基于jqxDateTimeInput封装， 默认 yyyy-MM-dd
     * @prop {Object} radiolist - 单选按钮组
     * @prop {Object} checkboxlist - 多选按钮组
     * @prop {Object} tree - 单选下拉树
     * @prop {Object} multi-tree - 多选下拉树
     * @prop {Object} switcher - 开关， 基于jqxSwitcheButton封装
     * @prop {Object} buttonlist - 单选按钮组
     * @prop {Object} multi-buttonlist - 多选按钮组
     * @prop {Object} textarea - 计数文本域，基于bhTxtInput封装
     * @prop {Object} number - 数字文本框，基于jqxNumberInput封装
     * @prop {Object} number-range - 数字区间，基于jqxNumberInput封装
     * @prop {Object} uploadfile - 文件上传，基于emapFileUpload封装
     * @prop {Object} uploadsingleimage - 单图片上传，基于emapSingleFileUpload封装
     * @prop {Object} uploadmuiltimage - 多图片上传，基于emapFileUpload封装
     * @prop {Object} text - 文本
     * @prop {Object} div - div占位
     * @prop {Object} static - 表单静态字段
     */
    WIS_EMAP_INPUT.core = {
        // 下拉框
        "select": {
            "init": _initSelect,
            "setValue": function (ele, name, val, root) {
                if (val[name] === undefined || val[name] === null) {
                    // 清空字段
                    ele.jqxDropDownList('clearSelection');
                    return;
                }

                if (ele.jqxDropDownList('getItemByValue', val[name])) {
                    _setSelectValue(ele, val[name]);
                } else {
                    if (val[name + '_DISPLAY']) {
                        ele.jqxDropDownList('addItem', {
                            id: val[name],
                            name: val[name + '_DISPLAY']
                        });
                        _setSelectValue(ele, val[name]);
                    } else {
                        WIS_EMAP_INPUT.getInputOptions(ele.data("url"), function (res) {
                            $(res).each(function () {
                                ele.jqxDropDownList('addItem', this);
                            });
                            _setSelectValue(ele, val[name]);
                            ele.data('loaded', true);
                        });
                    }
                }
            },
            "getValue": function (ele, formData) {
                var item = ele.jqxDropDownList('getSelectedItem');
                if (item) {
                    formData[ele.data('name') + "_DISPLAY"] = item.label;
                }
                return ele.val();
            },
            "disable": function (ele) {
                ele.jqxDropDownList({
                    disabled: true
                });
            },
            "enable": function (ele) {
                ele.jqxDropDownList({
                    disabled: false
                });
            }
        },

        "multi-select2": {
            "init": _initSelect,
            "setValue": function (ele, name, val, root) {
                if (val[name] === undefined || val[name] === null) {
                    // 清空字段
                    ele.jqxDropDownList('uncheckAll');
                    return;
                }
                var select2ValueArr = val[name].split(',');
                if (val[name + '_DISPLAY'] === undefined || val[name + '_DISPLAY'] === null) {
                    WIS_EMAP_INPUT.getInputOptions(ele.data("url"), function (res) {
                        if (!ele.data('loaded')) {
                            $(res).each(function () {
                                ele.jqxDropDownList('addItem', this);
                            });
                            ele.data('loaded', true);
                        }

                        select2ValueArr.map(function (val) {
                            ele.jqxDropDownList('checkItem', val);
                        })
                    });
                    return;
                }

                var select2DisplayArr = val[name + '_DISPLAY'].split(',');

                $(select2ValueArr).each(function (i) {
                    if (ele.jqxDropDownList('getItemByValue', select2ValueArr[i])) {
                        ele.jqxDropDownList('checkItem', select2ValueArr[i]);
                    } else {
                        ele.jqxDropDownList('addItem', {
                            id: select2ValueArr[i],
                            name: select2DisplayArr[i]
                        });
                        ele.jqxDropDownList('checkItem', select2ValueArr[i]);
                    }
                });
            },
            "getValue": function (ele, formData) {
                var items = ele.jqxDropDownList('getCheckedItems');
                if (items.length > 0) {
                    formData[ele.data('name') + "_DISPLAY"] = items.map(function (val) {
                        return val.label;
                    }).join(',');
                }
                return ele.val();
            },
            "disable": function (ele) {
                ele.jqxDropDownList({
                    disabled: true
                });
            },
            "enable": function (ele) {
                ele.jqxDropDownList({
                    disabled: false
                });
            }
        },

        "multi-select": {
            "init": function (ele, params) {
                var _this = ele;
                //qiyu 2016-11-19 将获取mock的url提取函数，在mock文件中重新定义
                var source = {
                    url: _this.data("url"),
                    datatype: "json",
                    root: "datas>code>rows",
                    beforeLoadComplete: function (records) {
                        if (!_this.data('initdata')) {
                            _this.data('initdata', records);
                        }
                        return records;
                    },
                    formatData: function (data) {
                        data.pageSize = 10;
                        data.pageNumber = 1;
                        data.queryopt = JSON.stringify({
                            "name": "name",
                            "value": _this.jqxComboBox('searchString'),
                            "builder": "include",
                            "linkOpt": "AND"
                        });
                        return data;
                    }
                };
                if (typeof window.MOCK_CONFIG != 'undefined') {
                    source = getSourceMock(source);
                }
                var dataAdapter = new $.jqx.dataAdapter(source);

                // var dataAdapter = new $.jqx.dataAdapter({
                //     url: _this.data("url"),
                //     datatype: "json",
                //     root: "datas>code>rows",
                //     beforeLoadComplete: function(records) {
                //         if (!_this.data('initdata')) {
                //             _this.data('initdata', records);
                //         }
                //         return records;
                //     },
                //     formatData: function(data) {
                //         data.pageSize = 10;
                //         data.pageNumber = 1;
                //         data.queryopt = JSON.stringify({
                //             "name": "name",
                //             "value": _this.jqxComboBox('searchString'),
                //             "builder": "include",
                //             "linkOpt": "AND"
                //         });
                //         return data;
                //     }

                // });
                var inputOptions = $.extend({}, {
                    placeHolder: '请选择...',
                    source: dataAdapter,
                    displayMember: "name",
                    multiSelect: true,
                    remoteAutoComplete: true,
                    // autoDropDownHeight: true,
                    enableBrowserBoundsDetection: true,
                    valueMember: "id",
                    minLength: 1,
                    width: "100%",
                    height: "26px",
                    disabled: _this.data('disabled') ? true : false,
                    search: function (searchString) {
                        dataAdapter.dataBind();
                    }
                }, params);
                _this.jqxComboBox(inputOptions)
                    .on('keyup open', 'input.jqx-combobox-input', function () {
                        // .on('keyup', 'input.jqx-combobox-input', function () {
                        var value = $(this).val();
                        var items = _this.jqxComboBox('getItems');
                        if (value == "" && (!items || items.length == 0)) {
                            // if (value == "" && _this.jqxComboBox('getItems').length == 0) {
                            var initData = _this.data('initdata');
                            $(initData).each(function () {
                                _this.jqxComboBox('addItem', this);
                            });
                        }
                    });
                _triggerFormChange(_this, 'select');
                dataAdapter.dataBind();
            },
            "setValue": function (ele, name, val, root) {
                if (val[name] === undefined || val[name] === null) {
                    // 清空字段
                    ele.jqxComboBox('clearSelection');
                    return;
                }

                if (val[name + '_DISPLAY'] !== undefined && val[name + '_DISPLAY'] !== null) {
                    var currentArr = ele.jqxComboBox('getItems').map(function (value) {
                        return value.value;
                    });
                    var displayVal = val[name + '_DISPLAY'].split(',');
                    val[name].split(',').map(function (v, i) {
                        if ($.inArray(v, currentArr) < 0) {
                            ele.jqxComboBox('addItem', {
                                id: v,
                                name: displayVal[i]
                            });
                        }
                        ele.jqxComboBox('selectItem', v);
                    });
                } else {
                    if (val[name] === undefined || val[name] === null) {
                        // 清空表单的情况
                        ele.jqxComboBox('clearSelection');
                    } else {
                        WIS_EMAP_INPUT.getInputOptions(ele.data("url"), function (res) {
                            ele.data('model', res);
                            var valueArr = val[name].split(',');
                            var currentArr = ele.jqxComboBox('getItems').map(function (val) {
                                return val.value;
                            });
                            $(res).each(function () {
                                if ($.inArray(this.id, valueArr) > -1) {
                                    if ($.inArray(this.id, currentArr) < 0) {
                                        ele.jqxComboBox('addItem', this);
                                    }
                                    ele.jqxComboBox('selectItem', this.id);
                                }
                            });
                        });
                    }
                }
            },
            "getValue": function (ele, formData) {
                var valueArray = [],
                    displayArray = [];
                $(ele.jqxComboBox('getSelectedItems')).each(function () {
                    valueArray.push(this.value);
                    displayArray.push(this.label);
                });
                formData[ele.data('name') + "_DISPLAY"] = displayArray.join(',');
                return valueArray.join(',');
            },
            "disable": function (ele) {
                ele.jqxComboBox({
                    disabled: true
                });
            },
            "enable": function (ele) {
                ele.jqxComboBox({
                    disabled: false
                });
            }
        },

        "selecttable": {
            "init": function (ele, params) {
                var inputOptions = $.extend({}, {
                    url: ele.data('url'),
                    width: '100%'
                }, params);
                ele.emapDropdownTable(inputOptions);
                _triggerFormChange(ele, 'select');
            },
            "setValue": function (ele, name, val, root) {
                ele.emapDropdownTable('setValue', [val[name], val[name + '_DISPLAY']]);
            },
            "getValue": function (ele, formData) {
                return ele.emapDropdownTable('getValue');
                // return ele.val();
            },
            "disable": function (ele) {
                ele.jqxComboBox({
                    disabled: true
                });
            },
            "enable": function (ele) {
                ele.jqxComboBox({
                    disabled: false
                });
            }
        },

        "date-ym": {
            "init": _initDateInput,
            "setValue": _setTextValue,
            "getValue": function (ele, formData) {
                return ele.val();
            },
            "disable": function (ele) {
                ele.jqxDateTimeInput({
                    disabled: true
                });
            },
            "enable": function (ele) {
                ele.jqxDateTimeInput({
                    disabled: false
                });
            }
        },

        "date-local": {
            "init": _initDateInput,
            "setValue": _setTextValue,
            "disable": function (ele) {
                ele.jqxDateTimeInput({
                    disabled: true
                });
            },
            "getValue": function (ele, formData) {
                return ele.val();
            },
            "enable": function (ele) {
                ele.jqxDateTimeInput({
                    disabled: false
                });
            }
        },

        "date-full": {
            "init": _initDateInput,
            "setValue": _setTextValue,
            "getValue": function (ele, formData) {
                return ele.val();
            },
            "disable": function (ele) {
                ele.jqxDateTimeInput({
                    disabled: true
                });
            },
            "enable": function (ele) {
                ele.jqxDateTimeInput({
                    disabled: false
                });
            }
        },

        "date-range": {
            "init": function (ele, params) {
                // range: {//可选，设置时间可选的范围
                //     max: 'today',  //可选，设置时间的最大可选范围，可传入'today'表示今天，或传入时间字符串，格式如'2015/02/05'
                //     min: '2015/02/05' //可选，设置时间的最小可选范围，可传入'today'表示今天，或传入时间字符串，格式如'2015/02/05'
                // },
                // time:{//可选，初始化时显示的时间范围
                //     start: '2015/01/05', //必填，时间字符串，格式如'2015/02/05'
                //     end: '2015/06/01'//必填，时间字符串，格式如'2015/02/05'
                // },
                // selected: function(startTime, endTime){ //可选，选择时间后的回调，返回的参数startTime是选择的开始时间，endTime是选择的结束时间，返回的是时间字符串格式如'2015/02/05'
                // }
                var inputOptions = $.extend({}, {
                    format: ele.data('format')
                }, params);

                ele.bhTimePicker(inputOptions);

                // TODO 需要 _formChange 事件触发
            },
            "setValue": function (ele, name, val, root) {
                if (val === '' || val === undefined || val[name] === "") {
                    ele.bhTimePicker('setType', 'all');
                } else {
                    var val_arr = val[name].split(',');
                    if (val_arr.length == 2) {
                        ele.bhTimePicker('setType', 'custom');
                        ele.bhTimePicker('setValue', {
                            startTime: val_arr[0],
                            endTime: val_arr[1]
                        });
                    }
                }
            },
            "getValue": function (ele, formData) {
                var rangeValue = ele.bhTimePicker('getValue');
                return rangeValue.startTime + ',' + rangeValue.endTime;
            },
            "disable": _defaultDisabled,
            "enable": _defaultEnable
        },

        "radiolist": {
            "init": function (ele, params) {
                if (ele.data('init')) {
                    return;
                }

                if (ele.data('optiondata')) {
                    var option_data = ele.data('optiondata');
                    if (typeof option_data == 'string') {
                        try {
                            option_data = JSON.parse(option_data);
                        } catch (e) {
                            console && console.error(_this.data('name') + 'optionData 格式错误, 必须是json格式');
                        }
                    }
                    _renderHtml(option_data, ele);
                    return
                }

                //qiyu 2016-11-19 将获取mock的url提取函数，在mock文件中重新定义
                var source = {
                    url: ele.data("url"),
                    datatype: "json",
                    async: false,
                    root: "datas>code>rows"
                };
                if (typeof window.MOCK_CONFIG != 'undefined') {
                    source = getSourceMock(source);
                }
                var dataAdapter = new $.jqx.dataAdapter(source, {
                    loadComplete: function (records) {
                        var random = '_' + parseInt(Math.random() * 100000);
                        _renderHtml(records.datas.code.rows, ele);
                    }
                });

                // var dataAdapter = new $.jqx.dataAdapter({
                //     url: ele.data("url"),
                //     datatype: "json",
                //     async: false,
                //     root: "datas>code>rows"
                // }, {
                //     loadComplete: function(records) {
                //         var random = '_' + parseInt(Math.random() * 100000);
                //         _renderHtml(records.datas.code.rows, ele);
                //     }
                // });
                dataAdapter.dataBind();
                _triggerFormChange(ele, 'change');

                function _renderHtml(data, ele) {
                    var listHtml = '';
                    $(data).each(function () {
                        listHtml += '<label>' +
                            '<input type="radio" name="' + ele.data('name') + '" value="' + this.id + '" data-caption="' + this.name + '" />' +
                            '<i class="bh-choice-helper"></i>' + this.name +
                            '</label>';
                    });
                    ele.html(listHtml).data('init', true).trigger('bhInputInitComplete');
                }
            },
            "setValue": function (ele, name, val, root) {
                if (val[name] !== undefined && val[name] !== null && val[name] !== "") {
                    $('input[type=radio][value=' + val[name] + ']', ele).prop('checked', true);
                } else {
                    $('input[type=radio]', ele).prop('checked', false);
                }
            },
            "getValue": function (ele, formData) {
                var itemText = ele.find('input[type=radio]:checked').map(function () {
                    return $(this).data('caption');
                }).get().join(',');
                formData[ele.data('name') + "_DISPLAY"] = itemText;
                return ele.find('input[type=radio]:checked').map(function () {
                    return $(this).val();
                }).get().join(',');
            },
            "disable": function (ele) {
                $('input[type=radio]', ele).prop('disabled', true);
            },
            "enable": function (ele) {
                $('input[type=radio]', ele).prop('disabled', false);
            }
        },

        "checkboxlist": {
            "init": function (ele, params) {
                if (ele.data('init')) {
                    return;
                }

                if (ele.data('optiondata')) {
                    var option_data = ele.data('optiondata');
                    if (typeof option_data == 'string') {
                        try {
                            option_data = JSON.parse(option_data);
                        } catch (e) {
                            console && console.error(_this.data('name') + 'optionData 格式错误, 必须是json格式');
                        }
                    }
                    _renderHtml(option_data, ele);
                    return
                }

                //qiyu 2016-11-19 将获取mock的url提取函数，在mock文件中重新定义
                var source = {
                    url: ele.data("url"),
                    datatype: "json",
                    async: false,
                    root: "datas>code>rows"
                };
                if (typeof window.MOCK_CONFIG != 'undefined') {
                    source = getSourceMock(source);
                }
                var dataAdapter = new $.jqx.dataAdapter(source, {
                    loadComplete: function (records) {
                        var random = '_' + parseInt(Math.random() * 1000);
                        _renderHtml(records.datas.code.rows, ele);
                        // $(records.datas.code.rows).each(function () {
                        //  listHtml += '<label>' +
                        //          '<input type="checkbox" name="' + ele.data('name') + '" value="' + this.id + '" data-caption="' + this.name + '" />' +
                        //          '<i class="bh-choice-helper"></i>' + this.name +
                        //          '</label>';
                        // });
                        // ele.html(listHtml).data('init', true);
                    }
                });

                // var dataAdapter = new $.jqx.dataAdapter({
                //     url: ele.data("url"),
                //     datatype: "json",
                //     async: false,
                //     root: "datas>code>rows"
                // }, {
                //     loadComplete: function(records) {
                //         var random = '_' + parseInt(Math.random() * 1000);
                //         _renderHtml(records.datas.code.rows, ele);
                //         // $(records.datas.code.rows).each(function () {
                //         //  listHtml += '<label>' +
                //         //          '<input type="checkbox" name="' + ele.data('name') + '" value="' + this.id + '" data-caption="' + this.name + '" />' +
                //         //          '<i class="bh-choice-helper"></i>' + this.name +
                //         //          '</label>';
                //         // });
                //         // ele.html(listHtml).data('init', true);
                //     }
                // });
                dataAdapter.dataBind();
                _triggerFormChange(ele, 'change');

                function _renderHtml(data, ele) {
                    var listHtml = '';
                    $(data).each(function () {
                        listHtml += '<label>' +
                            '<input type="checkbox" name="' + ele.data('name') + '" value="' + this.id + '" data-caption="' + this.name + '" />' +
                            '<i class="bh-choice-helper"></i>' + this.name +
                            '</label>';
                    });
                    ele.html(listHtml).data('init', true).trigger('bhInputInitComplete');
                }
            },
            "setValue": function (ele, name, val, root) {
                if (val[name] !== undefined && val[name] !== null && val[name] !== "") {
                    $(val[name].toString().split(',')).each(function () {
                        $('input[type=checkbox][value="' + this + '"]', ele).prop('checked', true);
                    });
                } else {
                    $('input[type=checkbox]', ele).prop('checked', false);
                }
                ele.emapRepeater('setValue', val[name]);
            },
            "getValue": function (ele, formData) {
                var itemText = ele.find('input[type=checkbox]:checked').map(function () {
                    return $(this).data('caption');
                }).get().join(',');
                formData[ele.data('name') + "_DISPLAY"] = itemText;
                return ele.find('input[type=checkbox]:checked').map(function () {
                    return $(this).val();
                }).get().join(',');
            },
            "disable": function (ele) {
                $('input[type=checkbox]', ele).prop('disabled', true);
            },
            "enable": function (ele) {
                $('input[type=checkbox]', ele).prop('disabled', false);
            }
        },

        "tree": {
            "init": _initTree,
            "setValue": function (ele, name, val, root) {
                //qiyu 2016-1-16
                if (val[name] === undefined || val[name] === null) {
                    // 清空下拉树 zhuhui 5-24
                    ele.emapDropdownTree("setValue", ['', '请选择...']);
                    return;
                }

                if (val[name + '_DISPLAY']) {
                    ele.emapDropdownTree("setValue", [val[name], val[name + "_DISPLAY"]]);
                } else {
                    WIS_EMAP_INPUT.getInputOptions(ele.data("url"), function (res) {
                        ele.data('model', res);
                        $(res).each(function () {
                            if (this.id == val[name]) {
                                ele.emapDropdownTree("setValue", [this.id, this.name]);
                                return false;
                            }
                        });
                    });
                }
            },
            "getValue": function (ele, formData) {
                formData[ele.data('name') + "_DISPLAY"] = ele.emapDropdownTree('getText');
                return ele.emapDropdownTree('getValue');
            },
            "disable": function (ele) {
                ele.emapDropdownTree('disable');
            },
            "enable": function (ele) {
                ele.emapDropdownTree('enable');
            }
        },

        "multi-tree": {
            "init": _initTree,
            "setValue": function (ele, name, val, root) {
                //qiyu 2016-1-16
                if (val[name] === undefined || val[name] === null) {
                    // 清空下拉树 zhuhui 5-24
                    ele.emapDropdownTree("setValue", ['', '请选择...']);
                    return;
                }
                ele.emapDropdownTree("setValue", [val[name], val[name + "_DISPLAY"]]);

            },
            "getValue": function (ele, formData) {
                formData[ele.data('name') + "_DISPLAY"] = ele.emapDropdownTree('getText');
                return ele.emapDropdownTree('getValue');
            },
            "disable": _defaultDisabled,
            "enable": _defaultEnable
        },

        "switcher": {
            "init": function (ele, params) {
                var inputOptions = $.extend({}, {
                    checked: false,
                    onLabel: '是',
                    offLabel: '否'
                }, params);
                ele.jqxSwitchButton(inputOptions);
                _triggerFormChange(ele, 'change');
            },
            "setValue": function (ele, name, val, root) {
                ele.jqxSwitchButton({
                    checked: val[name] * 1
                });
            },
            "getValue": function (ele, formData) {
                var itemVal = (ele.val() ? 1 : 0);
                formData[ele.data('name') + "_DISPLAY"] = (itemVal ? "是" : "否");
                return itemVal;
            },
            "disable": function (ele) {
                ele.jqxSwitchButton('disable');
            },
            "enable": function (ele) {
                ele.jqxSwitchButton('enable');
            }
        },

        "uploadfile": {
            "init": _initFileUpload,
            "setValue": function (ele, name, val, root) {
                var opt = $.extend({}, ele.data('defaultoptions'), {
                    contextPath: root,
                    token: val[name]
                });
                if (ele.data('disable') == true || ele.data('disable') == 'true') {
                    ele.emapFileDownload('destroy');
                    ele.emapFileDownload(opt);
                    return;
                }
                ele.emapFileUpload('destroy');
                ele.emapFileUpload(opt);
            },
            "getValue": function (ele, formData) {
                // 取值前 保存
                if (ele.data('disable') == true || ele.data('disable') == 'true') {
                    return ele.emapFileDownload('getValue');
                }
                return ele.emapFileUpload('getFileToken');
            },
            "disable": _disabledFileUpload,
            "enable": _enableFileUpload
        },

        "uploadphoto": {
            "init": _initFileUpload,
            "setValue": function (ele, name, val, root) {
                ele.emapFilePhoto('destroy');
                ele.emapFilePhoto($.extend({}, ele.data('defaultoptions'), {
                    contextPath: root,
                    token: val[name]
                }));
            },
            "getValue": function (ele, formData) {
                return ele.emapFilePhoto('getFileToken');
            },
            "disable": _disabledFileUpload,
            "enable": _enableFileUpload
        },
        "uploadsingleimage": {
            "init": _initFileUpload,
            "setValue": function (ele, name, val, root) {
                ele.emapSingleImageUpload('destroy');
                ele.emapSingleImageUpload($.extend({}, ele.data('defaultoptions'), {
                    contextPath: root,
                    token: val[name]
                }));
            },
            "getValue": function (ele, formData) {
                return ele.emapSingleImageUpload('getFileToken');
            },
            "disable": _disabledFileUpload,
            "enable": _enableFileUpload
        },
        "uploadmuiltimage": {
            "init": _initFileUpload,
            "setValue": function (ele, name, val, root) {
                ele.emapImageUpload('destroy');
                ele.emapImageUpload($.extend({}, ele.data('defaultoptions'), {
                    contextPath: root,
                    token: val[name]
                }));
            },
            "getValue": function (ele, formData) {
                return ele.emapImageUpload('getFileToken');
            },
            "disable": _disabledFileUpload,
            "enable": _enableFileUpload
        },

        "buttonlist": {
            "init": _initButtonList,
            "setValue": function (ele, name, val, root) {
                $('.bh-label-radio.bh-active', ele).removeClass('bh-active');
                if (val[name] === undefined || val[name] === null || val[name] === '') {
                    var allBtn = $('.bh-label-radio[data-id=ALL]', ele);
                    if (allBtn.length > 0) {
                        allBtn.addClass('bh-active');
                    }
                } else {
                    var selectBtn = $('.bh-label-radio[data-id=' + val[name] + ']', ele);
                    if (selectBtn.length > 0) {
                        selectBtn.addClass('bh-active');
                    }
                }
            },
            "getValue": function (ele, formData) {
                var selectedItems = $('.bh-label-radio.bh-active', ele);
                if (selectedItems.length) {
                    formData[ele.data('name') + "_DISPLAY"] = selectedItems.map(function (i, item) {
                        return $(item).data('name');
                    }).get().join(',');
                }
                return ele.bhButtonGroup('getValue');
            },
            "disable": _defaultDisabled,
            "enable": _defaultEnable
        },
        "multi-buttonlist": {
            "init": _initButtonList,
            "setValue": function () {
                // TODO
            },
            "getValue": function (ele, formData) {
                var selectedItems = $('.bh-label-radio.bh-active', ele);
                if (selectedItems.length) {
                    formData[ele.data('name') + "_DISPLAY"] = selectedItems.map(function (item) {
                        return $(item).data('name');
                    }).join(',');
                }
                return ele.bhButtonGroup('getValue');
            },
            "disable": _defaultDisabled,
            "enable": _defaultEnable
        },

        "div": {
            "init": function (ele, params, options) {},
            "setValue": function () {},
            "getValue": function (ele, formData) {
                return ele.val();
            },
            "disable": _defaultDisabled,
            "enable": _defaultEnable
        },

        "textarea": {
            "init": function (ele, params, options) {
                var inputOptions = $.extend({}, {
                    checkSize: ele.data('checksize'),
                    dataSize: ele.data('size'),
                    name: ele.data('name'),
                    textareaEasyCheck: options.textareaEasyCheck
                }, params);
                if (!options || options.textareaEasyCheck) {
                    inputOptions.limit = ele.data('checksize') ? ele.data('checksize') : parseInt(ele.data('size') / 3);
                } else {
                    inputOptions.limit = ele.data('checksize') ? ele.data('checksize') : ele.data('size');
                }
                ele.bhTxtInput(inputOptions);
                _triggerFormChange(ele, 'change');
            },
            "setValue": function (ele, name, val, root) {
                ele.bhTxtInput('setValue', (val[name] !== null && val[name] !== undefined) ? val[name] : "");
            },
            "getValue": function (ele, formData) {
                return ele.bhTxtInput('getValue');
            },
            "disable": function (ele) {
                ele.bhTxtInput('disabled', true);
            },
            "enable": function (ele) {
                ele.bhTxtInput('disabled', false);
            }
        },

        "static": {
            "init": function () {},
            "setValue": function (ele, name, val, root) {
                if (val[name + "_DISPLAY"] !== undefined) {
                    ele.text(val[name + "_DISPLAY"])
                    ele.data('valuedisplay', val[name + '_DISPLAY'])
                } else {
                    ele.text(val[name])
                }
                ele.data('value', val[name]);
            },
            "getValue": function (ele, formData) {
                if (ele.data('valuedisplay') !== undefined) {
                    formData[ele.data('name') + "_DISPLAY"] = ele.data('valuedisplay')
                }
                return ele.data('value');
            },
            "disable": function (ele, formData) {
                if (ele.data('valuedisplay') !== undefined) {
                    formData[ele.data('name') + "_DISPLAY"] = ele.data('valuedisplay')
                }
                return ele.data('value');
            },
            "disable": _defaultDisabled,
            "enable": _defaultEnable
        },

        "number": {
            "init": function (ele, params) {
                var inputOptions = $.extend({}, {
                    inputMode: 'simple',
                    spinButtons: true,
                    decimal: null,
                    decimalDigits: 0,
                    promptChar: ''
                }, params);
                ele.jqxNumberInput(inputOptions);
                _triggerFormChange(ele, 'change');
            },
            "setValue": function (ele, name, val, root) {
                var value = '';
                if ($.isPlainObject(val)) {
                    value = (val[name] !== null && val[name] !== undefined) ? val[name] : "";
                } else {
                    value = val;
                }
                if (value === '') {
                    ele.val(null);
                } else {
                    _setTextValue(ele, name, val, root);
                }
            },
            "getValue": function (ele, formData) {
                return ele.val() || ele.find('input').val();
            },
            "disable": _defaultDisabled,
            "enable": _defaultEnable
        },

        "number-range": {
            "init": function (ele, params) {
                ele.bhNumRange(params);
            },
            "setValue": function (ele, name, val, root) {
                if (val[name] === undefined || val[name] === null || val[name] === '') {
                    ele.bhNumRange('setValue', {
                        input1: null,
                        input2: null
                    });
                } else {
                    var valArr = val[name].toString().split(',');
                    if (valArr.length == 1) valArr[1] = valArr[0];
                    ele.bhNumRange('setValue', {
                        input1: valArr[0],
                        input2: valArr[1]
                    });
                }
            },
            "getValue": function (ele, formData) {
                return ele.bhNumRange('getValue');
            },
            "disable": function (ele) {
                ele.bhNumRange('disabled', true);
            },
            "enable": function (ele) {
                ele.bhNumRange('disabled', false);
            }
        },

        "text": {
            "init": function (ele, params) {
                ele.jqxInput({
                    width: '100%'
                });
                _triggerFormChange(ele, 'change');
            },
            "setValue": _setTextValue,
            "getValue": function (ele, formData) {
                return ele.val();
            },
            "disable": _defaultDisabled,
            "enable": _defaultEnable
        }

    };

    WIS_EMAP_INPUT.component = (function () {
        return $.extend({}, WIS_EMAP_INPUT.core, {});
    })();

    function _initSelect(ele, params) {
        var _this = $(ele);
        var xtype = _this.attr('xtype');
        var inputOptions = $.extend({}, {
            placeHolder: '请选择...',
            source: [{
                id: '',
                name: '请选择...',
                uid: ''
            }],
            displayMember: "name",
            valueMember: "id",
            itemHeight: 28,
            enableBrowserBoundsDetection: true,
            filterable: true,
            width: "100%",
            filterPlaceHolder: "请查找",
            searchMode: 'containsignorecase',
            disabled: _this.data('disabled') ? true : false
        }, params);
        var changeEvent = 'change';

        if (xtype === 'multi-select2') {
            inputOptions.source = [];
            inputOptions.checkboxes = true;
            changeEvent = 'close';
        }

        if (_this.data('optiondata')) {
            var option_data = _this.data('optiondata');
            if (typeof option_data == 'string') {
                try {
                    option_data = JSON.parse(option_data);
                } catch (e) {
                    console && console.error(_this.data('name') + 'optionData 格式错误, 必须是json格式');
                }
            }
            _this.jqxDropDownList(inputOptions);
            _this.jqxDropDownList({
                source: option_data
            });
            return;
        }

        _this.jqxDropDownList(inputOptions).on('open', function (e) {
            var _this = $(this);

            var $filterInput = _this.jqxDropDownList('listBoxContainer').jqxListBox('filter');
            $filterInput.css('position', 'relative');
            if (!$filterInput.find('[role="bh-placeholder-wrap"]').length) {
                WIS_EMAP_INPUT.placeHolder($filterInput);
            }

            if (!_this.data('loaded')) {
                e.stopPropagation();
                var curVal = _this.val().split(',');
                //2016-5-6 qiyu 增加下拉后，仍然能选中值; 提出人：吴涛
                var curSelectIndex = [];

                //qiyu 2016-11-19 将获取mock的url提取函数，在mock文件中重新定义
                var source = {
                    url: _this.data("url"),
                    datatype: "json",
                    async: false,
                    type: WIS_EMAP_CONFIG.getOptionType,
                    root: "datas>code>rows",
                    formatData: function (data) {
                        if (_this.data('jsonparam')) {
                            data = _this.data('jsonparam');
                        }
                        return data;
                    }
                };
                if (typeof window.MOCK_CONFIG != 'undefined') {
                    source = getSourceMock(source);
                }
                var selectDataAdapter = new $.jqx.dataAdapter(source, {
                    beforeLoadComplete: function (records) {
                        if (xtype === 'select') {
                            records.unshift({
                                id: '',
                                name: '请选择...',
                                uid: ''
                            });
                        }

                        //2016-5-6 qiyu 增加下拉后，仍然能选中值; 提出人：吴涛
                        for (var i = 0; i < records.length; i++) {
                            if ($.inArray(records[i].id, curVal) > -1 && records[i].id !== "") // 避免将空值放入数组 zhuhui 0815
                                curSelectIndex.push(i);
                        }
                    },
                    loadComplete: function (data) {
                        _this.data('loaded', true);

                        var selectMethod = xtype == 'select' ? 'selectIndex' : 'checkIndex';
                        //2016-5-6 qiyu 增加下拉后，仍然能选中值; 提出人：吴涛
                        if (curSelectIndex.length > 0) {
                            $(curSelectIndex).each(function () {
                                _this.jqxDropDownList(selectMethod, this);
                            });
                        } else {
                            _this.jqxDropDownList(selectMethod, -1);
                        }
                    }
                });
                _this.jqxDropDownList({
                    source: selectDataAdapter
                });
                //2016-3-31 qiyu，重复加载数据了
                //selectDataAdapter.dataBind();
            }
        });

        // 下拉框收起时，将下拉框的搜索框中内容清空， 否则会对select取值造成影响
        _this.on('close', function () {
            var items = $(this).jqxDropDownList('getItems');
            if (items && items.length > 0) {
                // 通过items 找到 下拉框dom对象
                var dropdown_dom = $(items[0].element).closest('.jqx-listbox');
                if (dropdown_dom.length) {
                    $('.jqx-listbox-filter-input', dropdown_dom).val('').trigger('keyup');
                }
            }
        });

        _triggerFormChange(_this, changeEvent);
    }

    function _initDateInput(ele, params) {
        var _this = ele;
        var xtype = _this.attr('xtype');
        var inputOptions = $.extend({}, {
            width: "100%",
            disabled: _this.data('disabled'),
            value: null,
            formatString: 'yyyy-MM',
            culture: 'zh-CN',
            showFooter: true,
            clearString: '清除',
            enableBrowserBoundsDetection: true,
            todayString: '今天'
        }, params);
        if (xtype == 'date-local') {
            inputOptions.formatString = 'yyyy-MM-dd';
        } else if (xtype == 'date-full') {
            inputOptions.formatString = _this.data('format') ? _this.data('format') : 'yyyy-MM-dd HH:mm';
            inputOptions.showTimeButton = true;
        }
        inputOptions.formatString = _this.data('format') || inputOptions.formatString;
        _this.jqxDateTimeInput(inputOptions);
        // 不为date-full时， 点击文本框也会弹出下拉
        // 为date-full 时， 则不做处理，因为可能会出现 HH : mm 的情况
        if (xtype != 'date-full') {
            _this.on("click", function (e) {
                e.stopPropagation();
                var disabled = $(this).jqxDateTimeInput('disabled');
                if (!disabled) $(this).jqxDateTimeInput('open');

            });

            // 清除输入的 非数字
            _this.on('input', function () {
                if (isNaN(parseInt(_this.val()))) {
                    _this.val('');
                }
            });
        }
        _triggerFormChange(_this, 'change');
    }

    function _initTree(ele, params) {
        var xtype = ele.attr('xtype');
        var inputOptions = $.extend({}, {
            url: ele.data('url'),
            checkboxes: false,
            search: true
        }, params);
        if (xtype === 'multi-tree') {
            inputOptions.checkboxes = true;
        }
        ele.emapDropdownTree(inputOptions);
        if (ele.data('disabled')) {
            ele.emapDropdownTree('disable');
            var formGroup = ele.closest('.bh-form-group');
            if (formGroup.length > 0) {
                formGroup.addClass('disabled');
            }
        }
        var changeEvent = 'change';
        if (xtype == 'multi-tree') {
            changeEvent = 'close';
        }
        _triggerFormChange(ele, changeEvent);
    }

    function _initFileUpload(ele, params, options) {
        var _this = ele;
        var xtype = _this.attr('xtype');
        var readonly = (_this.data('disable') == 'true' || _this.data('disable') == true);
        var inputOptions = $.extend({}, {
            contextPath: options.root
        }, params);
        _this.data('defaultoptions', inputOptions);
        if (xtype == 'uploadfile') {
            if (readonly) {
                _this.emapFileDownload(inputOptions);
                return;
            }
            _this.emapFileUpload(inputOptions);
        } else if (xtype == 'uploadphoto') {
            _this.emapFilePhoto(inputOptions);
        } else if (xtype == 'uploadsingleimage') {
            _this.emapSingleImageUpload(inputOptions);
        } else if (xtype == 'uploadmuiltimage') {
            _this.emapImageUpload(inputOptions);
        }
        if (_this.data('disabled') == true) {
            $('input[type=file]', _this).attr('disabled', true);
        }
    }

    function _initButtonList(ele, params) {
        var xtype = ele.attr('xtype');
        var inputOptions = $.extend({}, {
            url: ele.data('url'),
            allOption: ele.data('alloption')
        }, params);
        if (xtype == 'multi-buttonlist') {
            inputOptions.multiple = true;
            inputOptions.allOption = false;
        }
        ele.bhButtonGroup(inputOptions);
        _triggerFormChange(ele, 'change');
    }

    function _setSelectValue(ele, val) {
        if (typeof val == "object") {
            ele.jqxDropDownList('addItem', val[0])
            ele.jqxDropDownList('checkAll');
        } else {
            //qiyu 2016-1-2 判断为空时，清空所有选项
            if (val === "" || val === undefined) {
                ele.jqxDropDownList('clearSelection');
            } else {
                ele.val(val);
            }
        }
    }

    function _setTextValue(ele, name, val, root) {
        ele.val((val[name] !== null && val[name] !== undefined) ? val[name] : "");
    }

    function _triggerFormChange(ele, eventName) {
        ele.on(eventName, function () {
            ele.trigger('_formChange');
        });
    }

    function _disabledFileUpload(ele) {
        $('input[type=file]', ele).attr('disabled', true);
        var editBar = $('.bh-file-img-single-edit', ele);
        if (editBar.length > 0) {
            editBar.hide();
        }
        var infoP = $('.bh-file-img-info', ele);
        if (infoP.length > 0) {
            infoP.hide();
        }
    }

    function _enableFileUpload(ele) {
        $('input[type=file]', ele).attr('disabled', false);
        var editBar = $('.bh-file-img-single-edit', ele);
        if (editBar.length > 0) {
            $('.bh-file-img-single-edit', ele).show();
        }
        var infoP = $('.bh-file-img-info', ele);
        if (infoP.length > 0) {
            infoP.show();
        }
    }

    function _defaultDisabled(ele) {
        ele.attr('disabled', true);
    }

    function _defaultEnable(ele) {
        ele.attr('disabled', false);
    }

})(window.WIS_EMAP_INPUT = window.WIS_EMAP_INPUT || {});

(function(WIS_EMAP_INPUT, undefined) {
    WIS_EMAP_INPUT.validateRules = {
        "dateRange": {
            "regex": "none",
            "alertText": "* 无效的 ",
            "alertText2": " 日期范围"
        },
        "dateTimeRange": {
            "regex": "none",
            "alertText": "* 无效的 ",
            "alertText2": " 时间范围"
        },
        "minSize": {
            "regex": "none",
            "alertText": "最少 ",
            "alertText2": " 个字符"
        },
        "maxSize": {
            "regex": "none",
            "alertText": "最多 ",
            "alertText2": " 个字符"
        },
        "groupRequired": {
            "regex": "none",
            "alertText": "* 至少填写其中一项"
        },
        "min": {
            "regex": "none",
            "alertText": "* 最小值为 "
        },
        "max": {
            "regex": "none",
            "alertText": "* 最大值为 "
        },
        "past": {
            "regex": "none",
            "alertText": "* 日期需在 ",
            "alertText2": " 之前"
        },
        "future": {
            "regex": "none",
            "alertText": "* 日期需在 ",
            "alertText2": " 之后"
        },
        "maxCheckbox": {
            "regex": "none",
            "alertText": "* 最多选择 ",
            "alertText2": " 个项目"
        },
        "minCheckbox": {
            "regex": "none",
            "alertText": "* 最少选择 ",
            "alertText2": " 个项目"
        },
        "equals": {
            "regex": "none",
            "alertText": "* 两次输入的密码不一致"
        },
        "creditCard": {
            "regex": "none",
            "alertText": "无效的信用卡号码"
        },
        "tele": {
            "regex": /^([\+][0-9]{1,3}[ \.\-])?([\(]{1}[0-9]{2,6}[\)])?([0-9 \.\-\/]{3,20})((x|ext|extension)[ ]?[0-9]{1,4})?$/,
            "alertText": "无效的电话号码"
        },
        "tel": {
            "regex": /^([\+][0-9]{1,3}[ \.\-])?([\(]{1}[0-9]{2,6}[\)])?([0-9 \.\-\/]{3,20})((x|ext|extension)[ ]?[0-9]{1,4})?$/,
            "alertText": "无效的电话号码"
        },
        "phone": {
            // credit:jquery.h5validate.js / orefalo
            "regex": /^(0|86|17951)?(13[0-9]|15[012356789]|17[0678]|18[0-9]|14[57])[0-9]{8}$/,
            "alertText": "无效的手机号码"
        },
        "email": {
            // Shamelessly lifted from Scott Gonzalez via the Bassistance Validation plugin http://projects.scottsplayground.com/email_address_validation/
            "regex": /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i,
            "alertText": "无效的邮件地址"
        },
        "mail": {
            // Shamelessly lifted from Scott Gonzalez via the Bassistance Validation plugin http://projects.scottsplayground.com/email_address_validation/
            "regex": /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i,
            "alertText": "无效的邮件地址"
        },
        "integer": {
            "regex": /^[\-\+]?\d+$/,
            "alertText": "只能填写整数"
        },
        "integer+0": {
            "regex": /^\d+$/,
            "alertText": "只能填写非负整数"
        },
        "integer+": {
            "regex": /^[1-9](\d+)?$/,
            "alertText": "只能填大于零的整数"
        },
        "money": {
            "regex": /^\d+(\.\d{1,2})?$/,
            "alertText": "无效的金额"
        },
        //qiyu 2016-9-1 XQGL-25
        "score": {
            "regex": /^\d+(\.\d{1,2})?$/,
            "alertText": "无效的分数"
        },
        "number": {
            // Number, including positive, negative, and floating decimal. credit:orefalo
            "regex": /^[\-\+]?((([0-9]{1,3})([,][0-9]{3})*)|([0-9]+))?([\.]([0-9]+))?$/,
            "alertText": "只能填写数字"
        },
        "date": {
            "regex": /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/,
            "alertText": "无效的日期，格式必需为 YYYY-MM-DD"
        },
        "ipv4": {
            "regex": /^((([01]?[0-9]{1,2})|(2[0-4][0-9])|(25[0-5]))[.]){3}(([0-1]?[0-9]{1,2})|(2[0-4][0-9])|(25[0-5]))$/,
            "alertText": "无效的 IP 地址"
        },
        "url": {
            "regex": /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i,
            "alertText": "无效的网址"
        },
        "onlyNumberSp": {
            "regex": /^[0-9\ ]+$/,
            "alertText": "只能填写数字"
        },
        "onlyLetterSp": {
            "regex": /^[a-zA-Z\ \']+$/,
            "alertText": "只能填写英文字母"
        },
        "onlyLetterNumber": {
            "regex": /^[0-9a-zA-Z]+$/,
            "alertText": "只能填写数字与英文字母"
        },
        //tls warning:homegrown not fielded
        "dateFormat": {
            "regex": /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$|^(?:(?:(?:0?[13578]|1[02])(\/|-)31)|(?:(?:0?[1,3-9]|1[0-2])(\/|-)(?:29|30)))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^(?:(?:0?[1-9]|1[0-2])(\/|-)(?:0?[1-9]|1\d|2[0-8]))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^(0?2(\/|-)29)(\/|-)(?:(?:0[48]00|[13579][26]00|[2468][048]00)|(?:\d\d)?(?:0[48]|[2468][048]|[13579][26]))$/,
            "alertText": "无效的日期格式"
        },
        //tls warning:homegrown not fielded
        "dateTimeFormat": {
            "regex": /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])\s+(1[012]|0?[1-9]){1}:(0?[1-5]|[0-6][0-9]){1}:(0?[0-6]|[0-6][0-9]){1}\s+(am|pm|AM|PM){1}$|^(?:(?:(?:0?[13578]|1[02])(\/|-)31)|(?:(?:0?[1,3-9]|1[0-2])(\/|-)(?:29|30)))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^((1[012]|0?[1-9]){1}\/(0?[1-9]|[12][0-9]|3[01]){1}\/\d{2,4}\s+(1[012]|0?[1-9]){1}:(0?[1-5]|[0-6][0-9]){1}:(0?[0-6]|[0-6][0-9]){1}\s+(am|pm|AM|PM){1})$/,
            "alertText": "无效的日期或时间格式",
            "alertText2": "可接受的格式： ",
            "alertText3": "mm/dd/yyyy hh:mm:ss AM|PM 或 ",
            "alertText4": "yyyy-mm-dd hh:mm:ss AM|PM"
        },

        /**
         * 正则验证规则补充
         * Author: ciaoca@gmail.com
         * Date: 2013-10-12
         */
        "chinese": {
            "regex": /^[\u4E00-\u9FA5]+$/,
            "alertText": "只能填写中文汉字"
        },
        "chinaId": {
            /**
             * 2013年1月1日起第一代身份证已停用，此处仅验证 18 位的身份证号码
             * 如需兼容 15 位的身份证号码，请使用宽松的 chinaIdLoose 规则
             * /^[1-9]\d{5}[1-9]\d{3}(
             *    (
             *        (0[13578]|1[02])
             *        (0[1-9]|[12]\d|3[01])
             *    )|(
             *        (0[469]|11)
             *        (0[1-9]|[12]\d|30)
             *    )|(
             *        02
             *        (0[1-9]|[12]\d)
             *    )
             * )(\d{4}|\d{3}[xX])$/i
             */
            "regex": /^[1-9]\d{5}[1-9]\d{3}(((0[13578]|1[02])(0[1-9]|[12]\d|3[0-1]))|((0[469]|11)(0[1-9]|[12]\d|30))|(02(0[1-9]|[12]\d)))(\d{4}|\d{3}[xX])$/,
            "alertText": "无效的身份证号码"
        },
        "chinaIdLoose": {
            "regex": /^(\d{18}|\d{15}|\d{17}[xX])$/,
            "alertText": "无效的身份证号码"
        },
        "chinaZip": {
            "regex": /^\d{6}$/,
            "alertText": "无效的邮政编码"
        },
        "qq": {
            "regex": /^[1-9]\d{4,10}$/,
            "alertText": "无效的 QQ 号码"
        },
        "maxLength": {
            func: function (field, rules, i, options) {
                var max = rules[i + 2];
                var val = field.val();
                var len = 0;
                for (var index = 0; index < val.length; index++) {
                    if (val[index].match(/[^\x00-\xff]/ig) != null) {
                        len += 3;
                    } else {
                        len++;
                    }
                }
                options.allrules.maxLength.alertText = "内容过长，超过 " + (len - max) + " 个字符";
                return max >= len;
            }//,
            // "alertText":"* 内容过长"
        },
        "before": {
            func: function (val, field, ele) {
                var valStp = WIS_EMAP_SERV.toDateStp(val);
                var nStp;
                if (field == 'now') {
                    // 小于当前时间
                    nStp = parseInt(new Date().getTime()/1000);
                } else {
                    // 小于给定字段时间
                    (!ele) && (ele = $(document));
                    var tarVal = $('[data-name=' + field + ']', ele).val();
                    if (!tarVal) return true;
                    nStp = WIS_EMAP_SERV.toDateStp(tarVal);
                }
                return valStp < nStp
            },
            alertText: "*1不能晚于*2"
        },
        "before=": {
            func: function (val, field, ele) {
                var valStp = WIS_EMAP_SERV.toDateStp(val);
                var nStp;
                if (field == 'now') {
                    // 小于当前时间
                    nStp = parseInt(new Date().getTime()/1000);
                } else {
                    // 小于给定字段时间
                    (!ele) && (ele = $(document));
                    var tarVal = $('[data-name=' + field + ']', ele).val();
                    if (!tarVal) return true;
                    nStp = WIS_EMAP_SERV.toDateStp(tarVal);
                }
                return valStp <= nStp
            },
            alertText: "*1不能晚于*2"
        },
        "after": {
            func: function (val, field, ele) {
                var valStp = WIS_EMAP_SERV.toDateStp(val);
                var nStp;
                if (field == 'now') {
                    // 大于当前时间
                    nStp = parseInt(new Date().getTime()/1000);
                } else {
                    // 大于给定字段时间
                    (!ele) && (ele = $(document));
                    var tarVal = $('[data-name=' + field + ']', ele).val();
                    if (!tarVal) return true;
                    nStp = WIS_EMAP_SERV.toDateStp(tarVal);
                }
                return valStp > nStp
            },
            alertText: "*1不能早于*2"
        },
        "after=": {
            func: function (val, field, ele) {
                var valStp = WIS_EMAP_SERV.toDateStp(val);
                var nStp;
                if (field == 'now') {
                    // 大于当前时间
                    nStp = parseInt(new Date().getTime()/1000);
                } else {
                    // 大于给定字段时间
                    (!ele) && (ele = $(document));
                    var tarVal = $('[data-name=' + field + ']', ele).val();
                    if (!tarVal) return true;
                    nStp = WIS_EMAP_SERV.toDateStp(tarVal);
                }
                return valStp >= nStp
            },
            alertText: "*1不能早于*2"
        }
    }

})(window.WIS_EMAP_INPUT = window.WIS_EMAP_INPUT || {});

//下载
(function () {
    var Plugin, _init;
    /**
     * @module emapFileDownload
     * @description 预览下载组件，用于浏览已上传的数据，不可编辑
     */
    Plugin = (function () {
        function Plugin(element, options) {
            if (options.mode) {
                options.model = options.mode;
            }
            this.options = $.extend({}, $.fn.emapFileDownload.defaults, options);
            this.$element = $(element);
            _init(this.$element, this.options);
        }

        /**
         * @method destroy
         * @description 销毁实例
         */
        Plugin.prototype.destroy = function () {
            this.$element.html('').removeClass('bh-clearfix').off('click');
            this.options = null;
            this.$element.data('emapfiledownload', false).empty();
        };

        /**
         * @method reload
         * @description 重新渲染 组件内的文件数据
         */
        Plugin.prototype.reload = function () {
            this.$element.html('');
            _initDownload(this.$element, this.options);
        };

        /**
         * @method getValue
         * @description 获取组件当前的token
         */
        Plugin.prototype.getValue = function () {
            return this.options.token;
        };

        return Plugin;
    })();

    _init = function (element, options) {
        _initDownload(element, options);

        // 文件模式下 点击文件名 预览图片或者 下载文件
        $(element).on('click', '.bh-file-upload-filename, .bh-file-upload-file-icon', function () {
            var block = $(this).closest('.bh-file-upload-file');
            var fileName = $('.bh-file-upload-filename', block).attr('title');
            var fileUrl = $('.bh-file-upload-download', block).attr('href');

            if (new RegExp(/\.jpg|\.png|\.jpeg/g).test(fileName.toLowerCase())) {
                // 预览图片
                if (!$.bhGallery) {
                    console && console.warn('图片轮播插件Gallery未引入');
                    return;
                }
                var imgUrlArr = [];
                var imgSource = [];
                var show = 0;
                $(element).find('.bh-file-upload-file').each(function () {
                    var name = $('.bh-file-upload-filename', $(this)).attr('title');
                    if (new RegExp(/\.jpg|\.png|\.jpeg/g).test(name.toLowerCase())) {
                        var Url = $('.bh-file-upload-download', $(this)).attr('href')
                        imgUrlArr.push(Url)
                    }
                });

                $(imgUrlArr).each(function (i) {
                    if (fileUrl == this) {
                        show = i;
                    }
                    imgSource.push({
                        image: this
                    })
                });

                $.bhGallery({
                    dataSource: imgSource,
                    show: show
                });

            } else {
                // pdf
                if (/\.pdf$/g.test(fileName.toLowerCase())) {
                    block.trigger('bh.file.click.pdf', [fileName, fileUrl]);
                    if (options.canPreviewPDF) {
                        $.emapPDFViewer({
                            url: fileUrl
                        })
                    }
                    return;
                }
                // 下载文件
                location.href = $('.bh-file-upload-download', block).attr('href');
            }
        });

        // 图片模式下
        $(element).on('click', '.bh-file-img-table img', function () {
            if (!$.bhGallery) {
                console && console.warn('图片轮播插件Gallery未引入');
                return;
            }
            var curUrl = $(this).attr('src');
            var imgs = $(element).find('.bh-file-img-table img');
            var imgSource = [];
            var show = 0;
            if (imgs.length > 0) {
                imgs.each(function (i) {
                    if (!new RegExp(/\.jpg|\.png|\.jpeg/g).test($(this).attr('alt').toLowerCase())) {
                        return true;
                    }

                    if (curUrl == $(this).attr('src')) {
                        show = i;
                    }
                    imgSource.push({
                        image: $(this).attr('src')
                    })
                });

                $.bhGallery({
                    dataSource: imgSource,
                    show: show
                });
            }

        });

        // 点击批量下载
        $(element).on('click', '.bh-file-batch-download', function () {
            window.location.href = options.contextPath + '/sys/emapcomponent/file/getFileBatchByToken/' + options.token + '.do';
        })

    };

    function _initDownload(element, options) {
        $(element).addClass('bh-clearfix').css({
            'overflow': 'visible',
            'clear': 'none'
        });
        if (options.token === undefined || options.token === null) {
            $(element).append(' 无');
            return;
        }

        if (options.token instanceof Array) {
            options.batchTokens = true;
            options.token.map(function (token) {
                getTokenData(element, token, options);
            })
        } else {
            options.batchTokens = false;
            getTokenData(element, options.token, options);
        }
    }

    function getTokenData(element, token, options) {
        $.ajax({
            type: "post",
            url: options.contextPath + '/sys/emapcomponent/file/getUploadedAttachment/' + token + '.do',
            dataType: "json",
            success: function (res) {
                if (res.success) {
                    renderDownload(element, res.items, options);
                }
            }
        });
    }

    function renderDownload(element, items, options) {
        var fileHtml = '';
        if (!items || items.length == 0) {
            if (options.batchTokens) {
                if ($.trim($(element).html()) == "") {
                    fileHtml += ' 无';
                } else {
                    return;
                }
            } else {
                fileHtml += ' 无';
            }
            $(element).html(fileHtml).trigger('bh.file.download.done', [items]);
            return;
        }
        if (options.model == 'file') {
            if ($(element).html() == ' 无') {
                $(element).html('');
            }
            fileHtml += renderFile(items);
            $(element).append(fileHtml);
        } else if (options.model == 'image') {

            fileHtml += renderImage(items, options);
            $(element).css('overflow', 'hidden').append(fileHtml);
        }
        $(element).trigger('bh.file.download.done', [items]);

        if (options.batchDownload) {
            $(element).append('<p style="clear: both;"><a class="bh-file-batch-download" href="javascript:void(0)">批量下载</a></p>');
        }
    }

    function renderFile(items) {
        var renderHtml = '';
        $(items).each(function () {
            renderHtml += '<div class="bh-pull-left bh-file-upload-file" data-fileId="' + this.id + '" data-fileurl="' + this.fileUrl + '">' +
                '<div class="bh-file-upload-file-icon bh-pull-left"><i class="iconfont ' + WIS_EMAP_SERV._getIconImgClass(this.name) + '"></i></div>' +
                '<div class="bh-file-upload-file-info bh-pull-left">' +
                '<span class="bh-file-upload-filename"  title="' + this.name + '" style="cursor: pointer;">' + this.name + '</span>' +
                '<p><a class="bh-file-upload-download" target="_blank" href="' + this.fileUrl + '">下载</a></p>' +
                '</div>' +
                '</div>';
        });
        return renderHtml;
    }

    function renderImage(items, options) {
        var imgWidth = parseInt(options.width) - 6;
        var imgHeight = parseInt(options.height) - 6;
        var renderHtml = '';
        $(items).each(function () {
            renderHtml += '<div data-fileid="' + this.id + '" data-name="' + this.name + '" class="bh-file-img-block success" style="width: ' + options.width + 'px;height: ' + options.height + 'px;">' +
                '<div class="bh-file-img-table" style="width: ' + imgWidth + 'px;height: ' + imgHeight + 'px;">' +
                '<span style="width: ' + imgWidth + 'px;height: ' + imgHeight + 'px;">' +
                '<img style="max-width: ' + imgWidth + 'px;max-height: ' + imgHeight + 'px;" src="' + this.fileUrl + '" alt="' + this.name + '" />' +
                '</span>' +
                '</div>' +
                '</div>';
        });
        return renderHtml;
    }

    $.fn.emapFileDownload = function (options) {
        var instance;
        instance = this.data('emapfiledownload');
        if (!instance) {
            return this.each(function () {
                return $(this).data('emapfiledownload', new Plugin(this, options));
            });
        }
        if (options === true) return instance;
        if ($.type(options) === 'string') return instance[options]();
        return this;
    };

    /**
     * @memberof module:emapFileDownload
     * @prop {String|Array} token - 文件token(可以为多token)
     * @prop {String} [model=file] - 展示模式可选值 'file' 文件模式  'image' 图片模式（文件必须全部为图片类型）
     * @prop {Boolean} [canPreviewPDF=true] - 是否可预览pdf文件
     * @prop {Boolean} [batchDownload=false] - 是否显示批量下载按钮
     * @prop {Int} [width=200] - 图片模式下，文件容器的宽度
     * @prop {Int} [height=150] - 图片模式下，文件容器的高度
     */
    $.fn.emapFileDownload.defaults = {
        model: 'file',
        canPreviewPDF: true,
        batchDownload: false,
        width: 200,
        height: 150
    };

}).call(this);
/****************************
 *
 *
 * 废弃
 *
 *
 *
 ****************************/


//上传头像
(function () {
    var Plugin, _init, defaultPhoto;
    var _imgLoad;
    var fileReader = 'FileReader' in window;
    defaultPhoto = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFgAAABYCAMAAABGS8AGAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAMAUExURQAAACagliejmSWnmyeimCqkmSilnECmiCmlmSikmiilmyinnCeimCekmieilyimmiagliiimCimmyikmiikmiikmieglielnCimnCilmyehlyekmSijmSalnCimmyikmyilmiaglvanL9ymUCeglt2pWuejQOqXMvaRItytXuOoTO+lO96pVnmmcPaVKPOcK+6pOd6hSeaeSO6oPYmqd2qgdu6rQd+rTtyeRuaZOueVMeesRieglimmnEgrG/aOH/qiHOrAp/LXvOvIrezBqPbZviWnnj8hEkkmFkgrHP2hFujLseK5oCapnx6mov+NGEgoGCWlm/qjHCaupUcqGkoiEf+hGR+kmyqmnPHXvRuhnfeOHv+iEiesoh6flUksHPbKtPmeHUsgD/HUue/Fq+nIrUBIOiehlym2SUYvIPTZvvrfw0ojEzCEeOnAp//bv/rDqTweD0YoGPmNG/LIr/WOH/yNGzB/cxqimhielfLWu/vMryKgmOq/puK/pyajmkynmS+hlem9oiqUif359P///+/KsTO0RkU2JySflfTCqCaxqC2Og0M7LKiDbVCwo/zZvkElFTCJfT2nmNK8o/uiGle0Sz21SDR0aCqbkZx9aGWqm49xXTGonb65pDN5bezEq+vWuyOmnv/ny3q1pfWlJs2VM/qNHeqkIdbDlimjmreaTWugdf+QGzpfUnZXRFehg2BCMPORJeTSuGxOPPXj0bepWfv18HqyoImzoJ26cEm0Qx22RsOnKManSlU3JjtaTNLQt6rFsJ+0ocLMtd61nLqXgOzPtVo8K8Kiij+ija6aUzxWSF+pit3Dp+rEqOmSJ/mOHYmnOGu1XnutOzdqXf+lIdGnP2ipgpepaummMFCqkZbBrveUJ4Cda7ONd2a2psGbhFmypGK1pfTax//9/NuUKUSqdpyiOuPDm4S3YGquP72bLLO/gn+baf6mKYVqVWxhUfLo2nNuXIyuRqaqL+bHoV6sX/qeHUo8LW+qis3LsIiob0QlFfieIdrSudHUgI4AAAA8dFJOUwDtjRAiCvsDGoPPFpni2DzeT+t5a6PGuvavuFYwyEVgc/zoIfczmdfsVYN3FPzn7NtfCsN1f+K4yIiAzsFKH5gAAAhNSURBVFjDpdn3XxPZGgfgkAAhVGmiItLsuvX2ezOTEDGF3RQkCSXEZCkhkICGEhAXkKIgAhqpIiqKiuva69pXd63rqqvu3bu93O3l9vbjnZn0nDMzwf3+AU/ez3vec2ZyhsGgS1BYVDInPiE0IiYmICAgInIWMyUxkMVm/KywQ6JSZkYEI3ikWq1Q2MIlEjCdEx0Y9MRs2BxmqB1FEGGOtH1rZU+ZtMxOc8umhSeGPBEbGJcwA3FGmtNzt7e8vPfuVmfReKZzZk+d5YQi7ki1u8qLVGKxuah8JLvMLXMjmVOjg1IiEc9oK1GVUoKiEqVKUu8lc6dxptCQOUnBXq70oKEIY/FIigzbWrheiUz2d82YMxDvaLeiCtQRhbIy2xvmpsYH+uNGJSG+0Y6oUFdUI0KubyKjaeeanRwDuptGnJ3AezGSkw3Ic2NppjqIE+zLSjcdrDSI3bDYUL9R2gLQ4WFULiseKDdHW29AxahHxKihPhtsxyyKRofNBN1tr0tUXi4mm9G77VJAnk4qsyDu1l5f1k73VgrL/JWDwD5oK7vMShQWc7nPRiG6Ae0zmwNxy8UoScTl9WCfw2GzEZcH9KGni9TF5K4eUI6F7AtgfrUHDWYJOSwxGzYCUzc3GhgIcL9tetesQCmiEL8rBdo8zXcBmeBAtFM1grQZ8T7n2Qxgw+UcIRkId8nmI+DMpXqddUFJkJ3Ra4Z71a7fM/e2Qw4kz/M5Nhjs8C4FvBNKnc4pixW7wA3IZbrdkEjAlUqPqOAFi8aO2py/oXq9BTyOprmfVpw8cG+UGYpgs6azHG/71AlLVIZt4BHKDXcVHIqAcHsXbIh1IuUN/fXjNp1jlGFz4S45DuwwdvrAdrNOZOurLakdtbj2dSUE5nIceyMBgcCVqOfu0OkkqA6ttqCYm1Fy/ZbIXrJCUQ+Dp4eQzDABK1ywstomIoKe+hxzMzJr+0TVjs0HhVMTiVONiVDCSpvtytGx0bG/jY3eaKrNzMBS0nbUoqSo2H7KwZYOf+Lbe6xTiq6M3hOYTKblpsYmgsVSe/uKhaLH9hNjTjAUbndsPMvxgQlThaBRIKh44UUnnKn/VCnCt15XTzYM5mKHHDsFgcJc+xyLbg1M4KrAC24a14/aRDqSOcbngs0ImgmFpdojRVgbq219ExX5Al84o6mktk9nge88Yi5YjJAIKIydFSJLNWq7dW+iWADCuPz5KYsIdlYQb+aBjKhgOKxt/2ffcZvoVKOpEQZnVI3XXu/7ezu8E1xuIiMZ7iINf949cVtnOSow5UNhbAVLVjdvX0MCpzA4cDd3x5urKkw3lFjFZDCW1TtbV8JhJiOeBP5i95Z8gen22E0KuKq7eR0JPIuRQAJ/tmU5hpnynUsHrTizezsJHMkIpYQFywU0MEmTIxgk05a7GW+FV6bUigBGDPni0cPki0cKIw2f5a+qoIYzu6tIx40czs7de3U3JVzVPLB95cYpw5i8Y/PV5eRw987+VlIXgyMQ0mQ3fOTZZ58t3X1uzUoulxwOJYfzsjfnV+TD4arM5nUbyV1s3BIQimRfc5Xc2Cg42dzU1OQaiDeoXGyDhFPB7mmuwHKyeXx8nHaCnVuaQ1lx7kf2mSs+3dHRcRZLR34bMWmrz1G62CGUjFCWjO0TAv6yYz2RszfbqI81R+JID3rnPtl8cpWj5K/Wr//qbHEb3uXVA+vWULrY0zQsAqGWvzhJdKO44vQ/Tn853kb0gdbFHk0kD1PPmq+uwvdJY/ELL7bZ3Z10Lv4wJXn8u4cZaei/Rixgxc1mYo4z3+inc/HHPyNqBk3JSG7etS1En50DvJLOxV9YGCFJdDDSsHdtsRO+v/Y12nodf8o4tHDu3rWlN4tx+H5p6drX6AsOZ5O+xgJwaemyDePjpX7BqdFktwk+y1dAwI740QrHizf0r4Kb3SMT5p3zhM+1thS8TAnHUvy5cbJCmaz/m0f3Nrjh2oH/fnOngIp2/5+ODSZrgkz29pl/DQ/9xwPe8MqFC9++dayggOIAcv31JykZZw8UXurs/EnvhvXnjcNfyx9gdANdwfAuY8398Mw+tVp9YMj4qMRVsv67IeMPGqtVfuKtO9B+pHI8/6RDniOyHe/vK1QP8vnqfxs7z+s3LMPZZfqS743DP8rreJpJ+YNPDkL6Ecryul8BZlnWf7kwi49HzX+Myff1RL77vtP40Krh4bEefrW1gO6OhQO47xUO8u1RH/jBaHz00ytYzg9dND6um+TZ844clMN979y8Twyh7H1HvXb5YedF4/DQ0PDFi8Pf8uQOl1dnlX9SQHFbQWS214G/J+9yId8d9eClxxc6jcbOCw/3y608V+rkr5Z5LWDAHPAaK9GzzbIPP/CE+Wo1/8ClSz/ufzApn6zzhPe3vuz9qINc6MV6wn/6Yxaf702r1Yfl1kmeV6wfH/PsBRN6jcz2eMWQPeVaOldW/E+j4flEc/iQBzyTRXu5KT1TyAfgl3hANPK/5LpfUkg/AwQ5axYil/2D8dWjdzHZccUgzHvPX3i/cyziKa+82bHEbOxZ94HfMNcOM1k0t/+J+DzL3v5rlp/w13dwOCCO/nPZ7ARi2gb9gnk1Hx/DTs/QKH8+hLA4MbJDar5/MD5vc8P9/SoUlQAZYzjMkx9Kip7CB8Jfpq3IyqKHNTW8p3/FmtL3sXnzn/WlARhjF8yfN+UvevMW/2JflqftDdfU1JxYsHjqLJ70RfOfxe3BQR9Yo6mxnlgw/7n0J/5q+nz6osV/SNu3YrAQ0+1wTc07dScWLvjdovTnf+aH3qVLFy1Z8ptfp6WlPbNw4cKnn/nt75c8l76Udj/8H1/k4P/j+w/zAAAAAElFTkSuQmCC';
    Plugin = (function () {
        function Plugin(element, options) {
            this.settings = $.extend({}, $.fn.emapFilePhoto.defaults, options);
            this.$element = $(element);
            _init(this.$element, this.settings);
        }

        return Plugin;
    })();

    _init = function (element, options) {

        if (options.token && options.token != "" && options.token != null) {
            options.defaultPhoto = options.contextPath + '/sys/emapcomponent/file/getFileByToken/' + options.token + '.do?date=' + new Date().getTime();
            options.scope = options.token.substring(0, options.token.length - 1);
            options.newToken = false;
        } else {
            options.scope = new Date().getTime() + "" + parseInt(Math.random() * 100).toString();
            options.token = options.scope + 1;
            options.newToken = true;
        }
        options.uploadUrl = options.contextPath + '/sys/emapcomponent/file/uploadTempFile/' + options.scope + '/' + options.token + '.do';


        $(element).addClass('bh-file-photo').append('<div class="bh-file-photo-block"></div>' +
            '<p class="bh-file-photo-info">' +
            '<span class="icon icon-spinner icon-pulse bh-file-photo-loading"></span>' +
            '<span class="bh-file-photo-error"></span>' +
            '<span class="bh-file-photo-success">上传成功</span>' +
            '</p>' +
            '<a class="bh-file-upload" href="javascript:void(0)"><input name="bhFile" type="file">上传</a>');

        _imgLoad((options.defaultPhoto ? options.defaultPhoto : defaultPhoto), function (img) {
            var w = img.width, h = img.height;
            if (w > h) {
                $(img).css({
                    'position': 'absolute',
                    'height': '88px',
                    'top': 0,
                    'left': '50%',
                    'margin-left': '-' + w / 2 / h * 88 + 'px'
                });
            } else {
                $(img).css({
                    'position': 'absolute',
                    'width': '88px',
                    'left': 0,
                    'top': '50%',
                    'margin-top': '-' + h / 2 / w * 88 + 'px'
                });
            }

            $(element).find('.bh-file-photo-block').html(img);
        });

        $(element).find('input[type=file][name=bhFile]').fileupload({
            url: options.uploadUrl,
            autoUpload: true,
            dataType: 'json',
            formData: {storeId: 'image'},
            submit: function (e, data) {
                var file = data.files[0];

                $(element).addClass('loading');
                // 文件的大小 和类型校验
                if (options.type && options.type.length > 0) {
                    if (!new RegExp(options.type.join('|').toUpperCase()).test(file.name.toUpperCase())) {
                        $(element).removeClass('loading').addClass('error').find('.bh-file-photo-error').html('文件类型不正确');
                        return false;
                    }
                }

                if (fileReader && options.size) {
                    if (file.size / 1024 > options.size) {
                        $(element).removeClass('loading').addClass('error').find('.bh-file-photo-error').html('文件大小超出限制');
                        return false;
                    }
                }

                if (options.submit) {
                    options.submit(e, data);
                }
            },
            done: function (e, data) {
                if (data.result.success) {



                    // 上传成功
                    $(element).removeClass('loading').addClass('success')
                    //.find('.bh-file-photo-block img').attr('src', data.result.tempFileUrl);
                    options.tempUrl = data.result.tempFileUrl;
                    options.fileUrl = data.result.fileUrl;

                    _imgLoad(data.result.tempFileUrl, function (img) {
                        var w = img.width, h = img.height;
                        if (w > h) {
                            $(img).css({
                                'position': 'absolute',
                                'height': '88px',
                                'top': 0,
                                'left': '50%',
                                'margin-left': '-' + w / 2 / h * 88 + 'px'
                            });
                        } else {
                            $(img).css({
                                'position': 'absolute',
                                'width': '88px',
                                'left': 0,
                                'top': '50%',
                                'margin-top': '-' + h / 2 / w * 88 + 'px'
                            });
                        }

                        $(element).find('.bh-file-photo-block').html(img);
                        if (options.done) {
                            options.done(e, data);
                        }
                    })

                } else {
                    // 上传失败
                    $(element).removeClass('loading').addClass('error').find('.bh-file-photo-error').html((data.result.error ? data.result.error : '上传失败'));
                    if (options.fail) {
                        options.fail(e, data);
                    }
                }


            },
            fail: function (e, data) {
                $(element).removeClass('loading').addClass('error').find('.bh-file-photo-error').html('上传失败');
                if (options.fail) {
                    options.fail(e, data);
                }
            }
        });

        options.attachmentParams = {
            storeId: "image",
            scope: options.scope,
            fileToken: options.token
        };
    };

    _imgLoad = function (url, cb) {
        var img = new Image();
        img.src = url;
        if (img.conplete) {
            cb(img.width, img.height);
        } else {
            img.onload = function () {
                cb(img);
                img.onload = null;
            }
        }
    };
    // 公共方法

    // 保存临时文件
    Plugin.prototype.saveTempFile = function () {
        var resultFlag = false, self = this;
        if (!this.settings.tempUrl || this.settings.tempUrl.length < 1) {
            return resultFlag;
        }
        $.ajax({
            type: "post",
            url: this.settings.contextPath + '/sys/emapcomponent/file/deleteFileByToken/' + this.settings.token + '.do',
            async: false,
            dataType: "json",
            success: function (data) {
            }
        });
        $.ajax({
            type: "post",
            async: false,
            url: this.settings.contextPath
            + "/sys/emapcomponent/file/saveAttachment/"
            + this.settings.scope + "/" + this.settings.token + ".do",
            data: {
                attachmentParam: JSON.stringify(this.settings.attachmentParams)
            },
            dataType: "json",
            success: function (data) {
                self.settings.tempFileSaved = true;
                resultFlag = data;
            }
        });
        return resultFlag;
    };
    // 获取文件地址
    Plugin.prototype.getFileToken = function () {
        if (this.settings.newToken && (!this.settings.tempUrl || this.settings.tempUrl.length == 0)) {
            return null;
        } else {
            return this.settings.token;
        }
    };

    // 销毁实例
    Plugin.prototype.destroy = function () {
        this.settings = null;
        $(this.$element).data('plugin', false).removeClass('success error loading').empty().attr('class', 'bh-file-photo');
    };


    // 插件
    $.fn.emapFilePhoto = function (options) {
        var instance;
        instance = this.data('plugin');

        if (!instance) {
            return this.each(function () {
                if (options == 'destroy') {
                    return this;
                }
                return $(this).data('plugin', new Plugin(this, options));
            });
        }

        if (options === true) return instance;

        if ($.type(options) === 'string') return instance[options]();
        return this;

    };

    $.fn.emapFilePhoto.defaults = {
        storeId: 'image',
        type: ['jpg', 'png', 'bmp'],
        size: 2048
    };

}).call(this);
(function() {
    var EmapFileUpload, _eventBind;
    var fileReader = 'FileReader' in window;
    var _init, _getLimitInfo;
    /**
     * @module emapFileUpload
     * @description 文件上传组件
     */
    EmapFileUpload = (function() {
        function EmapFileUpload(element, options) {
            this.options = $.extend({}, $.fn.emapFileUpload.defaults, options);
            this.$element = $(element);

            if (this.options.token && this.options.token != '') {
                this.options.newToken = options.newToken = false;
            } else {
                this.options.newToken = options.newToken = true;
            }

            _init(this.$element, this.options);
            _eventBind(this.$element, this.options);
        }

        /**
         * @method getFileToken
         * @description 获取token
         * @return {String} token,若无上传文件返回""
         */
        EmapFileUpload.prototype.getFileToken = function() {
            if (this.$element.emapFileUpload('getFileNum') == 0) {
                return "";
            }
            return this.options.fileInput.emapUploadCore('getFileToken');
        };

        /**
         * @method getFileUrl
         * @description 返回token下已有的正式文件的url数组
         * @return {Array} url数组
         */
        EmapFileUpload.prototype.getFileUrl = function() {
            return this.options.fileInput.emapUploadCore('getFileUrl');
        };

        /**
         * @method getFileData
         * @description 返回token下已有的正式文件的信息
         * @return {Array} 文件信息对象数组
         */
        EmapFileUpload.prototype.getFileData = function() {
            return this.options.fileInput.emapUploadCore('getFileData');
        };

        /**
         * @method saveTempFile
         * @param {Object} params - 保存请求附带参数
         * @description 保存token, 不建议使用, 用saveUpload方法替代
         */
        EmapFileUpload.prototype.saveTempFile = function(params) {
            // 先判断没有没正在上传的文件, 如果有弹出提示框
            var options = this.options;
            var result;
            result = saveAction(options, params);
            return result;

            function saveAction(options, params) {
                var result = options.fileInput.emapUploadCore('saveTempFile', params);
                // 将临时文件下载地址替换为正式文件下载地址
                $('.bh-file-upload-download', options.loadedCon).each(function() {
                    var href = $(this).attr('href');
                    if (new RegExp('getTempFile').test(href)) {
                        var fileBlock = $(this).closest('.bh-file-upload-file').data('save', true);
                        var fileId = fileBlock.data('fileid');
                        $(this).attr('href', options.contextPath + '/sys/emapcomponent/file/getAttachmentFile/' + fileId + '.do');
                    }
                });
                return result;
            }
        };

        /**
         * @method saveUpload
         * @description 该方法为异步的 保存方法, 会在 有文件正在上传时弹出确认框, 该方法返回一个defer对象
         * @param {Object} params - 保存请求附带参数
         * @return {Object} 异步方法的Defer对象，resolve带参格式 为
         * {
         *   success: true,
         *   token: "xxx",
         * }
         */
        EmapFileUpload.prototype.saveUpload = function(params) {
            var deferred = $.Deferred();
            // 先判断没有没正在上传的文件, 如果有弹出提示框
            var options = this.options;
            if ($('.bh-file-upload-file:not(.bh-error)', this.options.loadingCon).length > 0) {
                BH_UTILS.bhDialogWarning({
                    title: "警告",
                    content: "有文件正在上传中, 操作可能会造成文件丢失, 是否继续?",
                    buttons: [{
                        text: '确认并提交',
                        className: 'bh-btn-warning',
                        callback: function() {
                            saveAction(options, deferred, params);
                        }
                    }, {
                        text: '取消',
                        className: 'bh-btn-default',
                        callback: function() {
                            deferred.reject();
                        }
                    }]
                })
            } else {
                saveAction(options, deferred, params);
            }
            return deferred;

            function saveAction(options, defer, params) {
                var resultObj = {};
                options.fileInput.emapUploadCore('saveUpload', params).done(function(res) {
                    resultObj.success = true;
                    resultObj.token = res.token;
                    defer.resolve(resultObj);
                    // 将临时文件下载地址替换为正式文件下载地址
                    $('.bh-file-upload-download', options.loadedCon).each(function() {
                        var href = $(this).attr('href');
                        if (new RegExp('getTempFile').test(href)) {
                            var fileBlock = $(this).closest('.bh-file-upload-file').data('save', true);
                            var fileId = fileBlock.data('fileid');
                            $(this).attr('href', options.contextPath + '/sys/emapcomponent/file/getAttachmentFile/' + fileId + '.do');
                        }
                    });
                }).fail(function(error) {
                    resultObj.success = false;
                    resultObj.msg = error.msg || '保存失败';
                    defer.resolve(resultObj);
                });
            }
        };

        /**
         * @method getFileNum
         * @description 获取已上传的文件数量
         * @return {Int} 文件数量
         */
        EmapFileUpload.prototype.getFileNum = function() {
            return this.options.loadedCon.getFileNum();
        };

        /**
         * @method destroy
         * @description 销毁组件实例
         */
        EmapFileUpload.prototype.destroy = function() {
            this.options = null;
            $(this.$element).data('plugin', false).empty();
        };

        // 私有方法
        _init = function(element, options) {
            // contextPath 兼容
            if (!options.contextPath) {
                options.contextPath = WIS_EMAP_SERV.getContextPath();
            }

            // 未限制上传数量为1时,若传了fileName参数  则删除
            if (options.fileName && options.limit != 1) {
                delete options.fileName;
            }

            $(element).css('line-height', '28px').append('<a class="bh-file-upload" href="javascript:void(0)">' +
                '<input style="cursor: pointer;" name="bhFile" type="file" ' + (options.multiple ? 'multiple' : '') + ' />上传' +
                '</a>' +
                '<span class="bh-text-caption bh-color-caption bh-mh-8 bh-file-upload-info">(' + _getLimitInfo(options) + ')</span>' +
                '<div class="bh-file-upload-loading-wrap bh-clearfix"></div>' +
                '<div class="bh-file-upload-loaded-wrap bh-clearfix"></div>' +
                '<input type="hidden" class="file-array" value="" />');

            options.fileInput = $('input[type=file]', element).parent();
            options.loadingCon = $(element).find('.bh-file-upload-loading-wrap').bhFileUploadingList({
                onDelete: function(item) {
                    if (item.hasClass('bh-error')) {
                        // 删除上传失败的文件
                        item.remove();
                    } else {
                        // 删除正在上传的文件
                        item.data('xhr').abort();
                        item.remove();
                    }
                }
            });
            options.loadedCon = $(element).find('.bh-file-upload-loaded-wrap').bhFileUploadedList({
                // 删除已上传文件
                onDelete: function(item) {
                    var fileBlock = $(item).closest('.bh-file-upload-file');

                    if (fileBlock.data('save')) {
                        // 删除正式文件
                        options.fileInput.emapUploadCore('deleteArrAdd', fileBlock.data('fileid'))
                        fileBlock.remove();
                    } else {
                        // 删除临时文件
                        options.fileInput.emapUploadCore('deleteTempFile', fileBlock.data('fileid'))
                            .done(function(res) {
                                if (res.success) {
                                    fileBlock.remove();
                                }
                            })
                    }
                    element.trigger('bh.file.upload.delete', fileBlock);
                },
                canPreviewPDF: options.canPreviewPDF
            });


            options.fileInput.emapUploadCore($.extend({}, options, {
                add: function(e, data) {
                    var files = data.files;
                    var tmp = new Date().getTime();
                    $(files).each(function(i) {
                        data.files[i].bhId = tmp + i;
                        options.loadingCon.add(this.name, tmp + i);
                    });

                    if (options.add) {
                        options.add(e, data);
                    }
                },
                submit: function(e, data) {
                    var file = data.files[0];

                    // 文件数量限制的校验
                    if (options.limit) {
                        var currentCount = options.loadingCon.getFileNum() + options.loadedCon.getFileNum();
                        if (currentCount > options.limit) {
                            options.loadingCon.error('文件数量超出限制', file.bhId);
                            WIS_EMAP_SERV && WIS_EMAP_SERV._resetPageFooter();
                            return false;
                        }
                    }

                    // 文件的大小 和类型校验
                    if (options.type && options.type.length > 0) {
                        if (!new RegExp((options.type.join('|') + '$').toUpperCase()).test(file.name.toUpperCase())) {
                            options.loadingCon.error('文件类型不正确', file.bhId);
                            WIS_EMAP_SERV && WIS_EMAP_SERV._resetPageFooter();
                            return false;
                        }
                    }

                    if (fileReader && options.size) {
                        if (file.size / 1024 > options.size) {
                            options.loadingCon.error('文件大小超出限制', file.bhId);
                            WIS_EMAP_SERV && WIS_EMAP_SERV._resetPageFooter();
                            return false;
                        }
                    }

                    options.loadingCon._findFile(file.bhId).data('xhr', data);
                    if (options.submit) {
                        options.submit(e, data);
                    }
                },
                done: function(e, data) {
                    var file = data.files[0];
                    // 上传成功
                    options.loadingCon.remove(file.bhId);
                    if (options.storeId == 'image') {
                        options.loadedCon.addImage(data.result.name, file.bhId, data.result.id, data.result.tempFileUrl, function(item) {
                            item.data('deleteurl', data.result.deleteUrl);
                        });
                    } else {
                        options.loadedCon.add(data.result.name, file.bhId, data.result.id, data.result.tempFileUrl, function(item) {
                            item.data('deleteurl', data.result.deleteUrl);
                        });
                    }
                    if (options.done) {
                        options.done(e, data);
                    }

                    WIS_EMAP_SERV && WIS_EMAP_SERV._resetPageFooter();
                },
                fail: function(e, data) {
                    // 上传失败
                    var file = data.files[0];
                    var errorMsg = '上传失败';
                    if (data.result && data.result.error) {
                        errorMsg = data.result.error;
                    }
                    options.loadingCon.error(errorMsg, file.bhId);
                    if (options.fail) {
                        options.fail(e, data)
                    }

                    WIS_EMAP_SERV && WIS_EMAP_SERV._resetPageFooter();
                }
            }));

            // 获取token下已有的文件
            if (!options.newToken) {
                $.ajax({
                    type: "post",
                    url: options.contextPath + '/sys/emapcomponent/file/getUploadedAttachment/' + options.token + '.do',
                    dataType: "json",
                    success: function(res) {
                        if (res.success) {
                            if (!res.items || res.items.length == 0) return;
                            if (options.storeId == 'image') {
                                $(res.items).each(function() {
                                    options.loadedCon.addImage(this.name, '', this.id, this.fileUrl, function(item) {
                                        item.data('save', true);
                                    });
                                });
                            } else {
                                $(res.items).each(function() {
                                    options.loadedCon.add(this.name, '', this.id, this.fileUrl, function(item) {
                                        item.data('save', true);
                                    });
                                });
                            }
                            element.trigger('bh.file.upload.done', res);
                        }
                    }
                });
            }
        };


        // 生成描述信息
        _getLimitInfo = function(options) {
            var infoHtml = '请上传附件';
            if (options.size) {
                infoHtml += ',文件最大为' + (options.size < 1024 ? options.size + 'K' : options.size / 1024 + 'M');
            }
            if (options.type && options.type.length > 0) {
                infoHtml += ',格式限制为' + options.type.join(",").toUpperCase();
            }
            return infoHtml;
        };

        _eventBind = function(element, options) {};

        // 定义插件
        $.fn.emapFileUpload = function(options, params) {
            var instance;
            instance = this.data('plugin');

            // 判断是否已经实例化
            if (!instance) {
                return this.each(function() {
                    if (options == 'destroy') {
                        return this;
                    }
                    return $(this).data('plugin', new EmapFileUpload(this, options));
                });
            }
            if (options === true) {
                return instance;
            }
            if ($.type(options) === 'string') {
                return instance[options](params);
            }
        };

        /**
         * @memberof module:emapFileUpload
         * @prop {String} [contextPath] - 根路径
         * @prop {String} [token] - 文件token,不传则组件生成随机的新token， 传token则组件自动请求token下已有的文件信息并渲染到页面上
         * @prop {Boolean} [multiple=false] - 上传控件是否支持一次性选择多个
         * @prop {String} [storeId=file] - emap文件类型
         * @prop {Array} [type=[]] - 上传文件的格式要求
         * @prop {Int} [size=0] - 上传文件的大小要求，单位为KB
         * @prop {Int} [limit] - 上传文件的数量限制
         * @prop {Function} [add] - 添加文件的回调
         * @prop {Function} [submit] - 开始上传文件的回调
         * @prop {Function} [done] - 文件上传成功的回调
         * @prop {Function} [fail] - 文件上传失败的回调
         */
        $.fn.emapFileUpload.defaults = {
            multiple: false,
            storeId: 'file',
            type: [],
            size: 0,
            canPreviewPDF: true
        };


    })();

}).call(this);

// 上传中列表
$.fn.bhFileUploadingList = function(opt) {
    // 删除按钮的点击事件
    $(this).on("click", "a.bh-file-upload-delete", function() {
        if (opt.onDelete) {
            opt.onDelete($(this).closest('.bh-file-upload-file'));
        }
    });
    this.add = function(fileName, bhId, fileId) {
        $(this).append('<div class="bh-pull-left bh-file-upload-file" data-bhid="' + bhId + '" data-fileid="' + (fileId ? fileId : 0) + '">' +
            '<span class="bh-file-upload-filename" title="' + fileName + '">' + fileName + '</span>' +
            '<span class="bh-file-upload-error-msg"></span>' +
            '<i class="icon icon-spinner icon-pulse bh-file-uploading-icon">' +
            '<img style="vertical-align: top;width: 100%;" src="data:image/gif;base64,R0lGODlhIAAgAPYAAP///4qEhPz8/PHw8Ono6Orp6fb29v39/fr6+t7c3Lu3t6mkpK2pqcjFxevq6vn5+eTj46yoqIuFhZeSkvDv7/T09NLPz9XT0/j4+MnGxpWQkKKdnd7d3e/u7u3s7MG+vqWgoJyXl56ZmdbU1L+8vJCKipmUlNfV1bGtrfX19cfExJiTk4+JidjW1paRkeXk5JSOjo6IiJuWlsbDw+Lh4aahoZKMjL67u8zKysvJyZSPj8nHx93b25+bm9/e3s3Ly6ijo+zr69TS0uHg4Obl5efl5bOvr5qVlcrIyMPAwL66usTBwY2Hh+Df39nX18K/v87MzLm1tbq2ttza2u7t7bWystvZ2drY2MC9vejm5sXCwrKurqCcnOPi4vLx8fv7+/f39/Py8p2YmLazs7SxsfPz8725uQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAIAAgAAAH/4AAgoOEhYaHiImKi4yNjQeGCCkCjoYpBDQFKYMCHDMElYQeKgw1DA1BkAg5QAmhghUfKxK0Jh8VBwcOPBWFFR0PiQIJILTGGwmQALmEKUtGTgiIDxYhxrUW0ocEGyUKBogIFyLXEiEnlIcVz9GIBwQMLNcMRMrqHsGJBiMLGjYuC4RgeFXoAAYPLVSQ2OEDHMFBCCBkIJGBwwAD6Rwx45QggoYSAF+8cmDBAoVBAxSUu5GvUYUnE0zscEhgQbkFvRxRMEJLQc4CDMoxyNkIA5QaC0YMBGCgwQRjLnBkbGSACBGHyxwo2GBiA4mTDwtS4HAigQOMYQ89eGEhBy97iZg2uoOAQsYEED82xSVigcZSdSRgGAMyJC6HGi42ZEPUAUUMYyFGKEOAQRtTEiVoRaGCqIKCzLRA+AAgoAiSJCdyYlABg0kJKUQLdtSgo8eMAbqMwCjRwwK4d0ZqGJkytdCDBDM+WOhwQJwMY0Y8CDrgoUkBy4gEVKiQD4GQI7RKRCcENxQB3bwt/E1LmsYMJSbZFxJggLujQAAh+QQJCgAAACwAAAAAIAAgAAAH/4AAgoOEgwcVVFQpB4WNjo4PEEkoKEsvD4+ZjQI0RhoSEhpGEAKapgAVSxOgoBNJFaeFBg4EFQJBRkysoEZBsYIHDg0oDFhNREa7EiW9vwADJKsSOihOSdKgLq+CFRWMjwI8G7sTGTwoMKA2W0OlqUkDmQhCIcokFUVaDAwzBAjcUaI4yCTAyjhWK3JgQpAiBYJvAG4FKZWJgpJPEmAwgOBM3osnDCIoSIChYyMMBYYQCUKg1j+ThDA4MbIAhQVbMAsdGBKhBKgNJyDGQgDBAgGKD35gK0ECk7MORkIogAXgAY6lTTt6iCKDRDwAB5r0lMBiQwuhpxB0MUoRgAEnVZxq3syJFgDKIQQM5NQk4IAADA/q7nXLAQkUf6ceOOR7ZcGKI1GyCB6UwgKJESUfVVCQTsIRKE4dHbDSo0SNJhWjsJqAJHPEtmBHmJDAZUomDDhEMIGxIEGpAwWECCnQtoOSCEu+asYRRcoVvQA8SDGxIgoVQhVqmTqAgQJOsDx6gOrBY7LJISBAgRhivmOFHCFzUB2MvUiR+fQHBwIAIfkECQoAAAAsAAAAACAAIAAAB/+AAIKDhIUAB4aJiokHFUVdQQ+Lk4YHDksLNUYjFZSeABRPKxISJUAtkgcPGAieDwMFAwgCPkBMpBI6HwMYRBY4Jw4CixhOClsKPBUtXLilUQQnWyImGwovX4m0CyUlOgwJTRHOLk8XESW4LgpUiQYNOrgmOUEqR6QsEU4ZJs4SCxwQFUqRBAYuDRkMVLBghMGHLhWWxHO2ocWwQghOcIkhgQkIJ4gOKMQA4AGUe7hYAPFxsVAFFQt6RMgxQFEXFDbkfeigCEGFJi2GVBBoCMMVIz1CbLhBpJUhBBhCEu1ZwIkQHhSmCsJAQIiQAi09IZilrcmWEDKMQPhUSFW2QQa1VGggpUGLU7YAPEBxYmBQBRLpSim4y5YGil2DEFjg0m2DhbCfKnBoSqgCDiNGLNTEO+lACg8OOnEeTdoTBgNaSw86QADJEh+SKKUg4CU1oQ5RNMAACLnQgxw1lFCYBGEDKRNQYitKoQBGhCKTgmyBUeLj3QcUhg4ScEUKFNGKHjiJknkzAAwjoiQhQNQnSUoIKATpO8jBuCM53qsmVIBBiSM46LefIAZcoB57AxaCQXaEJUhaIAAh+QQJCgAAACwAAAAAIAAgAAAH/4AAgoOEhQcCB4WKi4yCBgRTTRSJjZWFDxdbG0BLBJSWlQdEDCUSEmIZFaCKCGAIgggtYqYSJVEOAhVFEEEPlgMtGRdBAghOIrS2BQQqDAtRLSmNFSobGj1JHQceYzC1GxYvWEemJRFTr4tFC7Q1CQAITQoLDBYePDW0EhpJqosvNZiY2mBF0IEKHSg8ENCihz5bHhhVUGCihIkoBBg1WVDKlIkZ/hQdeKHCyJImvhYN0NIjhgQYKDikW3TQQYWZigQ4yGGEgQIhQVLgXLUIQ5AuV3AsyXBlwCcwHQYMtXQAgoIeLkwAQeJvAI4tRloYIAqgAgkX+jZcACBgCoiXDLUyEiWQTx8MBfAshBjogywBhw/JADhAA8WEIwqCkA0SgYU+HUkEpeDRAAeRqY0e5GhpCgaDIYMQpDDwiaiHHQt6bIhyZSxZRge7OJlCAMNrUAdKK6pQIIxuRohAdViyQIEnS0GQJMA86MAVLqcspGyUYIEK17B9RNAB5MpMASlsEwJGRIClFC1ICAkp4EUDCyEFBQeFoMKDTwZUHInQ5fftQQ9YUANG/1VCAQcviFcgcP4tWGAgACH5BAkKAAAALAAAAAAgACAAAAf/gACCg4SFhoeIiQAYQURBD4qRhQ88UREKPBiSkgcFRjASMFFFB4OlmwgPpwc+GxKvQDwCAAgdRUGaiQcOFxZEkAcvESUSJQxdAgYJCgxRIxWJHVg9MlEQpRU/QGILFhUIQ1s6oQtWkIdDNa89FucVHBZN0Bg/Mq8SKzPQhgdEwxIbTpwTdAqAgRxH7rl4MgBRCgsoIjToULAQAh4LSjApAUJILn4ViNAYUNFQBQsMNkTYQVHRgZKHBFR4YYUHgQEYYG4CmWDHEgsEEBR6uXMQghYoTGgQoYDAqQdELFjZt7ODEWKvTGRIAWCXAjEgLgyUBKHHvWJGOnSFsECCCxVcyHcScXWvRBQqgjwkqcFgitCdA6KMeyUGSS4BHXy8MFCUVoIqXEKASFKg4AEBOhEdMBAEQgsoP1oEmdWYEAICOaKgUGDBQc7ShYJgEfEKxgIhcQ8d6PDCS2YEFjYwuSeKAGlDHT4sQEK1kAEtg++BsHK8EIEtExSoPZRiSfRXNaZUJ1Thwo1MhAS8Bs7lrA4jpBI9+Jb+BVBBQZ70sFFCQwTcpT0AkROlCFAADlEYocAJze0kgH0OmFKBAwVQ8FFpAqgC24YcdhgIACH5BAkKAAAALAAAAAAgACAAAAf/gACCg4SFhoeIiYIHD1+Kj4cYL0JTFAKQmAddRj1AOQOYkA9QJhIlW0QHgweqkAeXgw8WMqZGBKoHFC9EFa2IBl1XQbACRWYgDBYVAAcESgsRM0G+hQIJWyBJHoMIDlMQvQApSLQSG0IYiBgNExILPtSFFAolEhIrWsuHCC0RPQq3ElVoUIoFF2UCr1jo8kARAghSNtTAQgDWoQMIMFhM9IDAFR4OGobKxOrBg40jESEIcuXECwOEDmCogCAlAAEQonDpkQwmswpCZjQRGWrAk3amUEAQhGAIChkfQI0kgKKevR4nBhFQEAGKvlBBolhlAoIHtwJdpI5MIQSIDhgiyT50KBTP1QMPFqJE2VGkps1BAgb4GNGiCwECFVCmPBAkw4IeIG4wfFS3UAoLG+xJCJFkrkAeBPwCAFNg14AvBaLA0CwhwpDKN4cwyFCGGYUfDLiAUJCgSVXWC5rAZoxkCoYDFTBrnmDkwo0VmmFEIaDoQIqGOH9rlpGhRZUjOiZEuJAilAAeNVhLgIHFwZAdCpJM+QpJQJMITFjrmEGzQocK6aQUhBIuaBYDCC0Q9RcADzRhhAklwACCCp4tGMsLGUShxAUdKFZIIAAh+QQJCgAAACwAAAAAIAAgAAAH/4AAgoOEhYaHiImKi4wCFR0pB4yTggUZChYVlIwIFhsaKBCSm4mdIiULNKMAGBQUD4wYYbCDBElGUJqCFRZSCk4pigZXWjwYgwgUBRUCggddDDAuRkTNiARGRwpBig8jIRISNTwIiQMqEUgDis8MLiZRRauGAg4cQdaJBk4kT8aLBwTMS/SAwgBapBIq7DaAgoGBACBOqiAkSpQfHlY9cABB16YHToDAkLABioFBA3ZEaSIxUYUMLsKViEJlUIoTOwi0RGTgBzgJLpR4ZFWhHKkDL6L0EIGixTFDAXcaegDhRw4eQwUJoOBjxBUCJxcJEIAgRQWEg+qpWMBlQ5QrYdEPpSiSoGPLCkh6lAinwQiNfIQqjDBSg0GODhAP0EARrnGIHBUOgPFSFAACDhFGlthgIVghBFNqxGgsQQMWBzRUGMEUpAKUnxJ0KOkAdQgD0hJWLJlixESJElxUELHQo/GED7QNeXhigonMBRYyyCC9oAUHIy5KwAAyIi4hBEOicJkQIgKUISR0kBZhYcAUKSiMWKCQCMPwGTmmuJqxgvSGFghgQEAXBETGDgYVpFDOAzwssFduUhAwSEALpWDBFhvUoMAQaC0kiH1XcNCBUYoEAgAh+QQJCgAAACwAAAAAIAAgAAAH/4AAgoOEhYaHiImKi4wAB18HjZIADwQ+HZGTi0FPKFAVmotEKCEfA4QPBg+Nj5mCFRZPPBiDFS0NLaCKAh0+A64CKRS0ggJDDCYMCQiKBhZbLcSICE5cEhsXq4kPTTtEzIkHBQoRJASuiBgV2ooIlgTshQcCCAIH6Lv26Q4+Vl0UAkIdejAESwQgKHZ4wLfoAAYMAQEIIBJlhQQJJUTk0NXInYUcPkClsNDjoskIRBgiCoJFxJEtHBAM+ODC5EUuHFQaOjBkwUUxPwxUaGDCpgQQTSI2JGBERwkQQh48uBKhhEkYChaySjEiCooMDu51QFJjAgwZDKZIa1SBSJcO4OB4nVCBRYUFHwUqKGV0z9CDCgVOfNgSBQeBvYUEVOigNxGCF1GOlIDBRUuHaUR2KMjwDVEKHEdsApkCjtABB1gkH1FQQGWFJzpsirBQIUUQAlRWCfDh8+ICHqUJVchQ9CKTDSOCXJCC4kMTDAiGVMW4wEfwQQg4MNDBRMLqJiMWwJBgIsqLBx1UbDCxYYnWQ7aiRGBAggMBmia5WDCAoICFJRYQcJ1pFRDAQRMO2KZEbBf1AIUBACBQAQWNLSLAhZHA0kN3JUTAQzwCRVjAEkBwwYAFFIRoCC9XXBCSToQEAgA7AAAAAAAAAAAA">' +
            '</i>' +
            '<a class="bh-file-upload-delete" href="javascript:void(0)">删除</a>' +
            '</div>');
        $(this).trigger('bh-file-upload-validate');
    };

    this._findFile = function(bhId, fileId) {
        var id = fileId ? fileId : bhId;
        var selector = fileId ? 'fileid' : 'bhid';
        return $(this).find(".bh-file-upload-file[data-" + selector + "=" + id + "]");

    };

    this.error = function(errorMsg, bhId, fileId) {
        var block = this._findFile(bhId, fileId);
        if (block.length > 0) {
            block.addClass('bh-error').find('.bh-file-upload-error-msg').text(errorMsg);
            $(this).trigger('bh-file-upload-validate');
        }
    };

    this.remove = function(bhId, fileId) {
        var block = this._findFile(bhId, fileId);
        if (block.length > 0) {
            block.remove();
            $(this).trigger('bh-file-upload-validate');
        }
    };

    // 获取文件个数
    this.getFileNum = function() {
        return $(this).find(".bh-file-upload-file:not(.bh-error)").length;
    };

    return this;
};

//已上传列表
/**
 *
 *  delete
 * 点击删除 的回调
 * func
 */
$.fn.bhFileUploadedList = function(opt) {
    //删除按钮的点击事件
    $(this).on("click", "a.bh-file-upload-delete", function() {
        if (opt.onDelete) {
            opt.onDelete($(this).closest('.bh-file-upload-file'));
        }
    });

    // 点击文件名预览图片 或者下载文件
    $(this).on('click', 'a.bh-file-upload-name-a, .bh-file-upload-file-icon', function() {
        var block = $(this).closest('.bh-file-upload-file');
        var fileName = $('.bh-file-upload-filename', block).attr('title');
        var fileUrl = $('.bh-file-upload-download', block).attr('href');

        if (new RegExp(/\.jpg|\.png|\.jpeg/g).test(fileName.toLowerCase())) {
            // 预览图片
            if (!$.bhGallery) {
                console && console.warn('图片轮播插件Gallery未引入');
                return;
            }
            var imgUrlArr = [];
            var imgSource = [];
            var show = 0;
            $(this).closest('.bh-file-upload-loaded-wrap').find('.bh-file-upload-file').each(function() {
                var name = $('.bh-file-upload-filename', $(this)).attr('title');
                if (new RegExp(/\.jpg|\.png|\.jpeg/g).test(name.toLowerCase())) {
                    var Url = $('.bh-file-upload-download', $(this)).attr('href')
                    imgUrlArr.push(Url)
                }
            });

            $(imgUrlArr).each(function(i) {
                if (fileUrl == this) {
                    show = i;
                }
                imgSource.push({
                    image: this
                })
            });

            $.bhGallery({
                dataSource: imgSource,
                show: show
            });

        } else {
            if (/\.pdf$/g.test(fileName.toLowerCase())) {
                if (opt.canPreviewPDF) {
                    $.emapPDFViewer({
                        url: fileUrl
                    })
                }

                // block.trigger('bh.file.click.pdf', [fileName, fileUrl]);
                return;
            }

            // 下载文件
            location.href = $('.bh-file-upload-download', block).attr('href');
        }
    });

    this.add = function(fileName, bhId, fileId, fileSrc, cb) {
        var iconClass = WIS_EMAP_SERV._getIconImgClass(fileName);
        var item = $('<div class="bh-pull-left bh-file-upload-file" data-bhid="' + bhId + '" data-fileId="' + (fileId ? fileId : 0) + '">' +
            '<div class="bh-file-upload-file-icon bh-pull-left"><i class="iconfont icon-insertdrivefile icon-setstyle ' + iconClass + '"></i></div>' +
            '<div class="bh-file-upload-file-info bh-pull-left">' +
            '<a class="bh-file-upload-name-a" href="javascript:void(0)" style="color:#333;"><span class="bh-file-upload-filename" title="' + fileName + '">' + fileName + '</span></a>' +
            '<p style="white-space: nowrap">' +
            // '<span class="bh-file-upload-success-info">上传成功</span> ' +
            '<a class="bh-file-upload-download bh-mr-8" href="' + fileSrc + '">下载</a>' +
            '<a class="bh-file-upload-delete" href="javascript:void(0)">删除</a></p>' +
            '</div>' +
            '</div>');
        $(this).append(item);
        if (cb) {
            cb(item);
        }
    };

    this.addImage = function(fileName, bhId, fileId, fileSrc, cb) {
        var item = $('<div class="bh-pull-left bh-file-upload-file bh-file-upload-img" data-bhid="' + bhId + '" data-fileId="' + (fileId ? fileId : 0) + '">' +
            '<div class="bh-file-upload-img-block"><span><img src="' + fileSrc + '" /></span></div>' +
            '<div class="bh-file-upload-file-info">' +
            '<span class="bh-file-upload-filename" title="' + fileName + '">' + fileName + '</span>' +
            '<p><span class="bh-file-upload-success-info">上传成功</span> <a class="bh-file-upload-delete" href="javascript:void(0)">删除</a></p>' +
            '</div>' +
            '</div>');
        $(this).append(item);
        if (cb) {
            cb(item)
        }
    };

    this._findFile = function(bhId, fileId) {
        var id = fileId ? fileId : bhId;
        var selector = fileId ? 'fileid' : 'bhid';
        return $(this).find(".bh-file-upload-file[data-" + selector + "=" + id + "]");

    };

    this.remove = function(bhId, fileId) {
        var block = this._findFile(bhId, fileId);
        if (block.length > 0) {
            block.remove();
        }
    };

    // 获取文件个数
    this.getFileNum = function() {
        return $(this).find(".bh-file-upload-file").length;
    };

    return this;
};
(function () {
    var Plugin;
    var fileReader = 'FileReader' in window;
    var _init, _getLimitInfo, _refreshFileInput; //私有方法

    /**
     * @module emapImageUpload
     * @description 多图片上传
     */
    Plugin = (function () {
        function Plugin(element, options) {
            this.options = $.extend({}, $.fn.emapImageUpload.defaults, options);
            this.$element = $(element);

            _init(this.$element, this.options);

        }

        /**
         * @method getFileToken
         * @description 获取token
         * @return {String} token,若无上传文件返回""
         */
        Plugin.prototype.getFileToken = function () {
            if (this.$element.emapImageUpload('getFileNum') == 0) {
                return "";
            }
            return this.options.fileInput.emapUploadCore('getFileToken');
        };

        /**
         * @method getFileUrl
         * @description 返回token下已有的正式文件的url数组
         * @return {Array} url数组
         */
        Plugin.prototype.getFileUrl = function () {
            return  this.options.fileInput.emapUploadCore('getFileUrl');
        };

        /**
         * @method saveTempFile
         * @param {Object} params - 保存请求附带参数
         * @description 保存token, 不建议使用, 用saveUpload方法替代
         */
        Plugin.prototype.saveTempFile = function (params) {
            var options = this.options;
            var result = this.options.fileInput.emapUploadCore('saveTempFile', params);
            // 将临时文件下载地址替换为正式文件下载地址
            $('.bh-file-img-block img', this.$element).each(function(){
                var src = $(this).attr('src');
                var imgBlock = $(this).closest('.bh-file-img-block');
                if (new RegExp('getTempFile').test(src)) {
                    var fileId = imgBlock.data('fileid');
                    $(this).attr('src', options.contextPath + '/sys/emapcomponent/file/getAttachmentFile/' + fileId + '.do');
                }
            });
            return result;
        };

        /**
         * @method saveUpload
         * @description 该方法为异步的 保存方法, 会在 有文件正在上传时弹出确认框, 该方法返回一个defer对象
         * @param {Object} params - 保存请求附带参数
         * @return {Object} 异步方法的Defer对象，resolve带参格式 为
         * {
         *   success: true,
         *   token: "xxx",
         * }
         */
        Plugin.prototype.saveUpload = function (params) {
            var deferred = $.Deferred();
            // 先判断没有没正在上传的文件, 如果有弹出提示框
            var options = this.options;
            if ($('.bh-file-img-container .loading', this.$element).length > 0) {
                BH_UTILS.bhDialogWarning({
                    title: "警告",
                    content:"有文件正在上传中, 操作可能会造成文件丢失, 是否继续?",
                    buttons: [{
                        text: '确认并提交',
                        className: 'bh-btn-warning',
                        callback: function () {
                            saveAction(options, deferred, params);
                        }
                    }, {
                        text: '取消',
                        className: 'bh-btn-default',
                        callback: function () {
                            deferred.reject();
                        }
                    }]
                })
            } else {
                saveAction(options, deferred, params);
            }
            return deferred;

            function saveAction(options, defer, params) {
                var resultObj = {};
                options.fileInput.emapUploadCore('saveUpload', params).done(function (res) {
                    resultObj.success = true;
                    resultObj.token = res.token;
                    defer.resolve(resultObj);
                    // 将临时文件下载地址替换为正式文件下载地址
                    $('.bh-file-img-block.success img', options.listConteiner).each(function() {
                        var src = $(this).attr('src');
                        if (new RegExp('getTempFile').test(src)) {
                            var fileBlock = $(this).closest('.bh-file-img-block');
                            var fileId = fileBlock.data('fileid');
                            $(this).attr('src', options.contextPath + '/sys/emapcomponent/file/getAttachmentFile/' + fileId + '.do');
                        }
                    });
                }).fail(function (error) {
                    resultObj.success = false;
                    resultObj.msg = error.msg || '保存失败';
                    defer.resolve(resultObj);
                });
            }
        };

        /**
         * @method getFileNum
         * @description 获取已上传的文件数量
         * @return {Int} 文件数量
         */
        Plugin.prototype.getFileNum = function () {
            return $('.bh-file-img-container .saved, .bh-file-img-container .success', this.$element).length;
        };

        /**
         * @method destroy
         * @description 销毁组件实例
         */
        Plugin.prototype.destroy = function () {
            this.options = null;
            $(this.$element).data('plugin', false).empty();
        };

        // 私有方法
        _init = function (element, options) {
            var imgWidth = parseInt(options.width) - 6;
            var imgHeight = parseInt(options.height) - 6;

            // 未限制上传数量为1时,若传了fileName参数  则删除
            if (options.fileName && options.limit != 1) {
                delete options.fileName;
            }

            $(element).addClass('bh-clearfix').append('<p class="bh-file-img-info"></p>' +
                '<div class="bh-file-img-container">' +
                '<div class="bh-file-img-input bh-file-img-block" style="width: ' + options.width + 'px;height: ' + options.height + 'px;">' +
                '<span>' +
                '<span class="bh-file-img-plus">+</span>' +
                '<span class="bh-file-img-text">点击上传</span>' +
                '</span>' +
                '<input type="file" ' + (options.multiple ? 'multiple' : '') + '>' +
                '</div>' +
                '</div>');

            options.fileInput = $('input[type=file]', element).parent();
            options.listConteiner = $('.bh-file-img-container', element); // 上传列表容器
            // 生成描述信息
            var introText = '请上传图片';
            if (options.type && options.type.length > 0) {
                introText += ', 支持' + options.type.join(',').toUpperCase() + '类型';
            }

            if(options.size && options.size > 0) {
                introText += ',大小在' + (options.size < 1024 ? options.size + 'K' : options.size / 1024 + 'M') + '以内';
            }

            if(options.limit && options.limit > 0) {
                introText += ',数量在' + options.limit + '以内';
            }


            $('.bh-file-img-info', element).html(introText);

            if (options.height <= 100) {
                $('.bh-file-img-text', element).hide();
            }


            // 获取token下已有的文件
            if (!options.newToken) {
                $.ajax({
                    type: "post",
                    url: options.contextPath + '/sys/emapcomponent/file/getUploadedAttachment/' + options.token + '.do',
                    dataType: "json",
                    success: function (res) {
                        if (res.success) {
                            // console.log(res)
                            var itemHtml = '';
                            $(res.items).each(function(){
                                itemHtml += '<div class="bh-file-img-block saved" data-fileid="' + this.id + '" style="width: ' + options.width + 'px;height: ' + options.height + 'px;">' +
                                    '<div class="bh-file-img-loading" style="line-height: ' + imgHeight + 'px;">上传中...</div>' +
                                    '<div class="bh-file-img-fail"></div>' +
                                    '<div class="bh-file-img-table" style="width: ' + imgWidth + 'px;height: ' + imgHeight + 'px;">' +
                                    '<span style="width: ' + imgWidth + 'px;height: ' + imgHeight + 'px;">' +
                                    '<img src="' + this.fileUrl + '" style="max-width: ' + imgWidth + 'px;max-height: ' + imgHeight + 'px;" />' +
                                    '</span>' +
                                    '</div>' +
                                    '<a href="javascript:void(0)" class="bh-file-img-delete">删除</a>' +
                                    '</div>';
                            });
                            $('.bh-file-img-input', element).before(itemHtml);
                        }
                    }
                });
            }


            options.fileInput.emapUploadCore($.extend({}, options, {
                add: function (e, data) {
                    var files = data.files;
                    var tmp = new Date().getTime();

                    $(files).each(function (i) {
                        data.files[i].bhId = tmp + i;

                        $('.bh-file-img-input', element).before('<div class="bh-file-img-block loading" data-bhid="' + data.files[i].bhId + '" style="width: ' + options.width + 'px;height: ' + options.height + 'px;">' +
                            '<div class="bh-file-img-loading" style="line-height: ' + imgHeight + 'px;">上传中...</div>' +
                            '<div class="bh-file-img-fail"></div>' +
                            '<div class="bh-file-img-table" style="width: ' + imgWidth + 'px;height: ' + imgHeight + 'px;">' +
                            '<span style="width: ' + imgWidth + 'px;height: ' + imgHeight + 'px;">' +
                            '<img style="max-width: ' + imgWidth + 'px;max-height: ' + imgHeight + 'px;" />' +
                            '</span>' +
                            '</div>' +
                            '<a href="javascript:void(0)" class="bh-file-img-delete">删除</a>' +
                            '</div>');
                    });

                    if (options.add) {
                        options.add(e, data);
                    }
                    data.submit();

                },
                submit: function (e, data) {
                    var file = data.files[0];
                    var imgBlock = $('.bh-file-img-block[data-bhid=' + file.bhId + ']', element);

                    // 文件数量限制的校验
                    if (options.limit) {
                        var currentCount = $('.bh-file-img-block', element).length - 1;
                        if (currentCount > options.limit) {
                            imgBlock.removeClass('loading').addClass('error').find('.bh-file-img-fail').html('文件数量超出限制');
                            return false;
                        }
                    }

                    // 文件的大小 和类型校验
                    if (options.type && options.type.length > 0) {
                        if (!new RegExp((options.type.join('|') + '$').toUpperCase()).test(file.name.toUpperCase())) {
                            imgBlock.removeClass('loading').addClass('error').find('.bh-file-img-fail').html('文件类型不正确');
                            return false;
                        }
                    }

                    if (fileReader && options.size) {
                        if (file.size / 1024 > options.size) {
                            imgBlock.removeClass('loading').addClass('error').find('.bh-file-img-fail').html('文件大小超出限制');
                            return false;
                        }
                    }
                    imgBlock.data('xhr', data);

                    if (options.submit) {
                        options.submit(e, data);
                    }
                },
                done: function (e, data) {
                    var file = data.files[0];
                    var imgBlock = $('.bh-file-img-block[data-bhid=' + file.bhId + ']', element);

                        // 上传成功
                        imgBlock.removeClass('loading').addClass('success');

                        $('img', imgBlock).attr('src', data.result.tempFileUrl);
                        imgBlock.data({
                            'fileid' : data.result.id,
                            'deleteurl' : data.result.deleteUrl
                        });
                    if (options.done) {
                        options.done(e, data)
                    }

                    if($.bhPaperPileDialog) {
                        $.bhPaperPileDialog.resetPageFooter(); //改变页面的页脚位置
                        $.bhPaperPileDialog.resetDialogFooter(); //改变弹框的页脚位置
                    }

                },
                fail: function (e, data) {
                    var file = data.files[0];
                    var imgBlock = $('.bh-file-img-block[data-bhid=' + file.bhId + ']', element);
                    imgBlock.removeClass('loading').addClass('error').find('.bh-file-img-fail').html(data.result.error ? data.result.error : '上传失败');
                    if (options.fail) {
                        options.fail(e, data)
                    }

                    if($.bhPaperPileDialog) {
                        $.bhPaperPileDialog.resetPageFooter(); //改变页面的页脚位置
                        $.bhPaperPileDialog.resetDialogFooter(); //改变弹框的页脚位置
                    }
                }
            }));


            // 删除事件绑定
            $(element).on('click', '.bh-file-img-delete', function(){
                var imgBlock = $(this).closest('.bh-file-img-block');
                if (imgBlock.hasClass('success')) {
                    // 删除临时文件
                    options.fileInput.emapUploadCore('deleteTempFile', imgBlock.data('fileid'))
                    .done(function (res) {
                        if (res.success) {
                            imgBlock.remove();
                        }
                    })

                } else if(imgBlock.hasClass('error')) {
                    // 错误文件直接删除
                    imgBlock.remove();
                } else if(imgBlock.hasClass('loading')) {
                    //  删除正在上传的文件
                    imgBlock.data('xhr').abort();
                    imgBlock.remove();
                } else if(imgBlock.hasClass('saved')){
                    // 删除正式文件
                    options.fileInput.emapUploadCore('deleteArrAdd', imgBlock.data('fileid'));

                    imgBlock.remove();
                }

            });

            // 图片预览  事件绑定
            $(element).on('click', '.bh-file-img-table img', function () {
                if (!$.bhGallery) {
                    console && console.warn('图片轮播插件Gallery未引入');
                    return;
                }
                var curUrl = $(this).attr('src');
                var imgs = $(this).closest('.bh-file-img-container').find('.bh-file-img-table img');
                var imgSource = [];
                var show = 0;
                if (imgs.length > 0) {
                    imgs.each(function (i) {
                        if (curUrl == $(this).attr('src')) {
                            show = i;
                        }
                        imgSource.push({
                            image: $(this).attr('src')
                        })
                    });

                    $.bhGallery({
                        dataSource: imgSource,
                        show: show
                    });
                }

            })
        };

        // 刷新上传控件的显示或隐藏
        _refreshFileInput = function(element, options) {
            var currentCount = $('.bh-file-img-block', element).length - 1;
            var fileInput = $('.bh-file-img-input', element);
            if (currentCount >= options.limit) {
                // 数量达到上限 上传控件隐藏
                fileInput.hide();
            } else {
                // 数量未达到上限 上传控件显示
                fileInput.show();
            }
        };

        // 定义插件
        $.fn.emapImageUpload = function (options, params) {
            var instance;
            instance = this.data('plugin');

            // 判断是否已经实例化
            if (!instance) {
                return this.each(function () {
                    if (options == 'destroy') {
                        return this;
                    }
                    return $(this).data('plugin', new Plugin(this, options));
                });
            }
            if (options === true) {
                return instance;
            }
            if ($.type(options) === 'string') {
                return instance[options](params);
            }
        };
        /**
         * @memberof module:emapImageUpload
         * @prop {String} [contextPath] - 根路径
         * @prop {String} [token] - 文件token,不传则组件生成随机的新token， 传token则组件自动请求token下已有的文件信息并渲染到页面上
         * @prop {Boolean} [multiple=false] - 上传控件是否支持一次性选择多个
         * @prop {String} [storeId=image] - emap文件类型
         * @prop {Array} [type=['jpg', 'jpeg', 'png']] - 上传文件的格式要求
         * @prop {Int} [size=0] - 上传文件的大小要求，单位为KB
         * @prop {Int} [limit] - 上传文件的数量限制
         * @prop {Function} [add] - 添加文件的回调
         * @prop {Function} [submit] - 开始上传文件的回调
         * @prop {Function} [done] - 文件上传成功的回调
         * @prop {Function} [fail] - 文件上传失败的回调
         */
        $.fn.emapImageUpload.defaults = {
            multiple: false,
            storeId: 'image',
            width: 200,
            height: 150,
            type: ['jpg', 'jpeg', 'png'],
            size: 0
        };
    })();
}).call(this);
/**
 * @module emapImport
 * @description emap导入组件
 * @example
   $.emapImport({
       app: "xxx",
       module: "xxx",
       page: "xxx",
       action： "xxxx"
   })
 */

/**
 * @memberof module:emapImport
 * @prop {String} app - 应用名称
 * @prop {String} module - 模块名称
 * @prop {String} page - 页面名称
 * @prop {String} action - 动作名称
 * @prop {String} [storeId=imexport] - emap文件类型
 * @prop {Function} [preCallback] - 导入数据弹窗弹出后的回调
 * @prop {Function} [importCallback] - 导入数据成功的回调
 * @prop {Function} [closeCallback] - 导入弹窗关闭的回调
 * @prop {Boolean} [autoClose=false] - 导入成功后是否自动关闭弹窗
 * @prop {String} [tplUrl] - 自定义导入模板的下载地址
 * @prop {Object} [params] - 额外参数
 * @prop {String} [params.colnames] - 需要导出的字段的name，多个用逗号分隔，选填
 * @prop {String} [params.filename] - 模板文件的名称，不填则默认取模型的名称，选填
 * @prop {String} [params.readTemplate] - 下载导入模板请求-自定义的导入读文件服务，实现IImportRead，选填
 * @prop {String} [params.readImport] - 获取导入行数和导入请求-自定义的导入读文件服务，实现IImportRead，选填
 * @prop {String} [params.consts] - 导入请求-常量字段，多个用逗号分隔，内容为key:value，选填
 * @prop {String} [params.guids] - 导入请求-GUID字段，多个用逗号分隔，选填
 * @prop {String} [params.analyse] - 导入请求-自定义的导出过程分析服务，实现IImportAnalyse，选填
 * @prop {String} [params.save] - 导入请求-自定义的写入保存服务，实现IImportSave，选填
 * @prop {Boolean} [params.ignoreEmptyRow] - 是否忽略空行（空格也算空行），true表示读取忽略空行，false表示将空行当成正常记录读取，选填，默认为true
 */
$.emapImport = function (opt) {
    // 区分 下载模板和导入数据的read
    if (opt.params && opt.params.read) {
        opt.params.readTemplate = opt.params.readImport = opt.params.read;
        delete opt.params.read;
    } else if (opt.params && opt.params.readTemplate && opt.params.readImport) {
        if (opt.params.readTemplate == opt.params.readImport) {
            console && console.error('readTemplate 与 readImport不能相同!');
        }
    }


    opt.content = '<div class="bh-import-content">' +
        '<div class="bh-import-step active">' +
        '<h5 class="bh-import-step-title">' +

        '<span>1</span>' +
        '上传文件' +
        '<i class="bh-color-caption bh-import-p bh-import-step1-intro">如果您是初次使用，建议您<a role="downTplBtn" href="javascript:void(0)">下载导入模板</a>进行查看。</i>' +
        // '<a href="javascript:void(0)" class="bh-btn bh-btn-small bh-btn-primary bh-import-input-a bh-mh-8">' +
        // '开始上传' +
        // '<input type="file" role="fileInput"/>' +
        // '</a>' +
        '</h5>' +

        '<div class="bh-import-step-content bh-import-step1-content">' +
        '<a href="javascript:void(0)" class="bh-btn bh-btn-primary bh-btn-small bh-import-input-a">' +
        '开始上传' +
        '<input type="file" role="fileInput"/>' +
        '</a>' +

        // '<p class="bh-color-caption bh-import-p bh-import-step1-intro">如果您是初次使用，建议您<a role="downTplBtn" href="javascript:void(0)">下载导入模板</a>进行查看。' +
        '</p>' +
        '</div>' +
        '<div class="bh-import-step-content bh-import-step1-content" style="display: none;">' +
        '<p class="bh-color-caption bh-import-p  bh-import-step1-file">' +
        '<span class="bh-import-file-name"></span>' +
        '<span class="bh-import-file-size"></span>' +
        '</p>' +
        '<a href="javascript:void(0)" class="bh-import-reload-a bh-mh-8" role="reImportBtn">重新上传</a>' +
        '<a href="javascript:void(0)" role="importConfirmBtn" class="bh-btn bh-btn-primary bh-btn-small">' +
        '确认上传' +
        '</a>' +


        '</div>' +
        '</div>' +
        '<div class="bh-import-step ">' +
        '<h5 class="bh-import-step-title">' +
        '<span>2</span>' +
        '导入数据' +
        '</h5>' +

        '<div class="bh-import-step-content">' +
        '<p class="bh-import-step2-intro">等待文件上传完毕后自动导入数据</p>' +

        '<div class="bh-import-step2-content">' +
        '<div class="bh-import-loading-bar">' +
        '<div></div>' +
        '</div>' +
        '<p class="bh-import-step2-count"></p>' +
        '</div>' +
        '</div>' +
        '</div>' +

        '<div class="bh-import-step ">' +
        '<h5 class="bh-import-step-title">' +
        '<span>3</span>' +
        '完成' +
        '</h5>' +

        '<div class="bh-import-step-content bh-import-step3-content">' +

        '<p class="bh-import-result-detail">该文件全部导入数据10000条，其中失败导入2条</p>' +
        '<p>具体结果可查看<a class="bh-import-export" href="javascript:void(0)">下载导入结果</a>查看明细。</p>' +
        '<button role="closeConfirmBtn" class="bh-btn bh-btn-default bh-btn-small bh-pull-right bh-mh-8 bh-mb-8">确定关闭</button>' +
        '</div>' +
        '</div>' +
        '</div>';

    BH_UTILS.bhWindow(opt.content, '导入数据', {}, {
        height: 450,
        close: function () {
            if (opt.closeCallback && opt.closeCallback != "") {
                opt.closeCallback();
            }
        }
    });
    if (opt.preCallback && opt.preCallback != "") {
        opt.preCallback();
    }
    $("[role=fileInput]").emapImportData(opt);
};


$.fn.emapImportData = function (opt) {
    // 下载导入模板参数
    var $element = $(this).closest('.bh-import-content');
    var fileReader = 'FileReader' in window;
    var downTplData = {
        "app": opt.app, // *
        "module": opt.module, // *
        "page": opt.page, // *
        "action": opt.action, // *
        "storeId": opt.storeId ? opt.storeId : 'imexport'
    };
    var contextPath = opt.contextPath;
    var scope, token;

    if (opt.params) {
        $.extend(downTplData, opt.params);
    }
    scope = Date.parse(new Date());
    token = scope + 1;
    $(this).fileupload({
        autoUpload: false, //是否自动上传
        url: contextPath + '/sys/emapcomponent/file/uploadTempFile/' + scope + '/' + token + '.do', //上传地址
        dataType: 'json',
        formData: {
            storeId: (opt.storeId ? opt.storeId : 'file')
        },
        add: function (e, data) {
            var file = data.files;
            var step1Contents = $(this).closest(".bh-import-step").find(".bh-import-step-content");
            // if (e.target.files) {
            step1Contents.eq(0).hide();
            step1Contents.eq(1).show();
            //类型校验  必须为excel文件
            var fileType = file[0].name.split('.');
            if (!new RegExp('xlsx|xlsm|xltx|xltm|xlsb|xlam|xls').test(fileType[fileType.length - 1].toLowerCase())) {
                step1Contents.eq(1).find("span.bh-import-file-name").html('<span class="bh-color-danger">请上传正确的Excel文件</span>').attr("title", file[0].name);
                $("[role=importConfirmBtn]", $element).attr('disabled', true);
                return false;
            }
            step1Contents.eq(1).find("span.bh-import-file-name").text(file[0].name).attr("title", file[0].name);
            if (fileReader) {
                step1Contents.eq(1).find("span.bh-import-file-size").text("(" + parseInt(file[0].size / 1024) + "k)");
            } else {
                step1Contents.eq(1).find("span.bh-import-file-size").hide();
            }
            $("[role=importConfirmBtn]", $element).attr('disabled', false);
            // }

            $("[role=importConfirmBtn]", $element).unbind("click").bind("click", function () {
                $("[role=fileInput]", $element).data("loading", true);
                var stepContent = $(this).closest(".bh-import-step-content");
                stepContent.children("a").hide();
                stepContent.prepend('<div class="bh-import-step1-loading-block bh-pull-right"><div class="sk-spinner sk-spinner-fading-circle bh-pull-right" style="height: 28px; width: 28px;">' +
                    '<div class="sk-circle1 sk-circle"></div>' +
                    '<div class="sk-circle2 sk-circle"></div>' +
                    '<div class="sk-circle3 sk-circle"></div>' +
                    '<div class="sk-circle4 sk-circle"></div>' +
                    '<div class="sk-circle5 sk-circle"></div>' +
                    '<div class="sk-circle6 sk-circle"></div>' +
                    '<div class="sk-circle7 sk-circle"></div>' +
                    '<div class="sk-circle8 sk-circle"></div>' +
                    '<div class="sk-circle9 sk-circle"></div>' +
                    '<div class="sk-circle10 sk-circle"></div>' +
                    '<div class="sk-circle11 sk-circle"></div>' +
                    '<div class="sk-circle12 sk-circle"></div>' +
                    '</div>' +
                    '<p class="bh-pull-right" style="margin-right: 12px;line-height:28px;">上传中……</p></div>');
                data.submit();
            });
        },
        done: function (e, data) { //设置文件上传完毕事件的回调函数
            if (data.result.success) {
                var mid = data.result.id;
                downTplData.attachment = data.result.id;
                $.ajax({
                    type: "post",
                    url: contextPath + '/sys/emapcomponent/file/saveAttachment/' + scope + '/' + token + '.do',
                    data: {
                        attachmentParam: JSON.stringify({
                            scope: scope,
                            fileToken: token,
                            attachmentParam: {
                                storeId: downTplData.storeId
                            }
                        })
                    },
                    success: function (json) {
                        $.ajax({
                            type: "post",
                            dataType: 'json',
                            url: contextPath + '/sys/emapcomponent/imexport/importRownum.do',
                            data: $.extend(downTplData, {
                                "app": downTplData.app,
                                "attachment": mid
                            }),
                            success: function (json) {
                                if (json.code == '500') {
                                    _handleimportRownumFailed(json);
                                    return;
                                }

                                $(".bh-import-step2-count", $element).html('本次共导入数据' + json.rowNumber + '条');
                                $(".bh-import-step1-content", $element).find("div.bh-import-step1-loading-block").remove();
                                $("div.bh-import-step:eq(1)", $element).addClass("active");
                                $(".bh-import-loading-bar div", $element).animate({
                                    "width": "87%"
                                }, 3000);
                                // 区分 下载模板和导入数据的read
                                downTplData.read && delete downTplData.read;
                                if (downTplData.readImport) {
                                    downTplData.read = downTplData.readImport;
                                }

                                downTplData.action = opt.action;
                                downTplData.actionImport && (downTplData.action = downTplData.actionImport);

                                $.ajax({
                                    type: "post",
                                    dataType: "json",
                                    url: contextPath + '/sys/emapcomponent/imexport/import.do',
                                    data: downTplData,
                                    success: function (json) {
                                        if (json.status == 1) {
                                            $(".bh-import-loading-bar div", $element).stop().animate({
                                                "width": "100%"
                                            }, 500, function () {
                                                if (opt.importCallback && opt.importCallback != "") {
                                                    var data = $.extend({
                                                        "total": json.total,
                                                        "success": json.success,
                                                        "callback": null
                                                    }, opt.importCallback(json.total, json.success));
                                                    importSuccess(data.total, data.success, data.callback);

                                                } else {
                                                    importSuccess(json.total, json.success, function (a) {
                                                        //a.attr("href", contextPath + "/sys/emapcomponent/file/getAttachmentFile/" + json.attachment + ".do");
                                                    });
                                                }
                                                $("div.bh-import-step:eq(2)", $element).find(".bh-import-export").attr("href", contextPath + "/sys/emapcomponent/file/getAttachmentFile/" + json.attachment + ".do").parent().show();
                                                if (opt.autoClose == true) {
                                                    BH_UTILS.bhWindow.close();
                                                }
                                            });
                                        } else {
                                            $("[role=fileInput]", $element).data("loading", false);
                                            $("div.bh-import-step-content:eq(2)", $element).html('<p></p>');
                                            $("div.bh-import-step:eq(2)", $element).addClass("active").find(".bh-import-result-detail").html('<span style="color: red">导入失败' + (json.msg || '') + '</span>');
                                            if (!json.attachment) {
                                                $("div.bh-import-step:eq(2)", $element).find(".bh-import-export").parent().hide();
                                            }
                                        }
                                    }
                                });
                            },
                            error: function (e) {
                                _handleimportRownumFailed(e);
                            }
                        });
                    }
                });
            }
        }
    });
    // 点击重新上传
    $("[role=reImportBtn]", $element).on("click", function () {
        if (document.documentMode == 9) {
            var contents = $('.bh-import-step1-content');
            contents.eq(0).show();
            contents.eq(1).hide();
        } else {
            $("[role=fileInput]", $element).trigger('click');
        }

    });

    // 点击确定关闭
    $("[role=closeConfirmBtn]", $element).on("click", function () {
        //  这句是谁注释掉的? 导致关闭的回调失效了  6-7 zhuhui
        if (opt.closeCallback && opt.closeCallback != "") {
            opt.closeCallback();
        }
        BH_UTILS.bhWindow.close();
    });

    // 点击下载模板
    $("[role=downTplBtn]", $element).on("click", function () {
        if (opt.tplUrl && opt.Url != "") {
            location.href = opt.tplUrl;
        } else {
            // 区分 下载模板和导入数据的read
            downTplData.read && delete downTplData.read;
            if (downTplData.readTemplate) {
                downTplData.read = downTplData.readTemplate;
            }

            downTplData.actionTemplate && (downTplData.action = downTplData.actionTemplate);

            $.ajax({
                type: "post",
                url: contextPath + '/sys/emapcomponent/imexport/importTemplate.do',
                data: downTplData,
                success: function (json) {
                    location.href = (contextPath + '/sys/emapcomponent/file/getAttachmentFile/' + JSON.parse(json).attachment + '.do');
                },
                error: function (e) {
                    console && console.log(e)
                }
            });
        }

    });

    function _handleimportRownumFailed(res) {
        $("[role=fileInput]", $element).data("loading", false);
        $("div.bh-import-step-content:eq(2)", $element).html('<p></p>');
        $("div.bh-import-step:eq(2)", $element).addClass("active").find(".bh-import-result-detail").html('<span style="color: red">' + (res.msg || '导入失败') + '</span>');
    }

    function importSuccess(totalNum, successNum, callback) {
        $("[role=fileInput]", $element).data("loading", false);
        $("div.bh-import-step-content:eq(2)", $element).html('<p class="bh-color-success">数据导入完成</p>');
        $("div.bh-import-step:eq(2)", $element).addClass("active").find(".bh-import-result-detail").html("导入已完成， 其中导入成功" + successNum + "条，导入失败" + (totalNum - successNum) + "条");
        if (callback && callback != "") {
            callback($("div.bh-import-step:eq(2)", $element).find(".bh-import-export"));
        }
    }
};
(function () {
    var Plugin;
    var fileReader = 'FileReader' in window;
    var _init, _renderSize;

    /**
     * @module emapSingleImageUpload
     * @description 单张图片上传
     */
    Plugin = (function () {
        function Plugin(element, options) {
            this.options = $.extend({}, $.fn.emapSingleImageUpload.defaults, options);
            this.$element = $(element);

            _init(this.$element, this.options);

        }

        /**
         * @method getFileToken
         * @description 获取token
         * @return {String} token,若无上传文件返回""
         */
        Plugin.prototype.getFileToken = function () {
            if (this.$element.emapSingleImageUpload('getFileNum') == 0) {
                return "";
            }
            return this.options.fileInput.emapUploadCore('getFileToken');
        };

        /**
         * @method getFileUrl
         * @description 返回token下已有的正式文件的url数组
         * @return {Array} url数组
         */
        Plugin.prototype.getFileUrl = function () {
            return this.options.fileInput.emapUploadCore('getFileToken');

        };

         /**
         * @method saveTempFile
         * @param {Object} params - 保存请求附带参数
         * @description 保存token, 不建议使用, 用saveUpload方法替代
         */
        Plugin.prototype.saveTempFile = function (params) {
            var result = this.options.fileInput.emapUploadCore('saveTempFile', params);
            $('.bh-file-img-container', this.$element).removeClass('success').addClass('saved');
            return result;
        };

        /**
         * @method saveUpload
         * @description 该方法为异步的 保存方法, 会在 有文件正在上传时弹出确认框, 该方法返回一个defer对象
         * @param {Object} params - 保存请求附带参数
         * @return {Object} 异步方法的Defer对象，resolve带参格式 为
         * {
         *   success: true,
         *   token: "xxx",
         * }
         */
        Plugin.prototype.saveUpload = function (params) {
            var deferred = $.Deferred();
            // 先判断没有没正在上传的文件, 如果有弹出提示框
            var options = this.options;
            if ($('.bh-file-img-container.loading', this.$element).length > 0) {
                BH_UTILS.bhDialogWarning({
                    title: "警告",
                    content: "有文件正在上传中, 操作可能会造成文件丢失, 是否继续?",
                    buttons: [{
                        text: '确认并提交',
                        className: 'bh-btn-warning',
                        callback: function () {
                            saveAction(options, deferred, params);
                        }
                    }, {
                        text: '取消',
                        className: 'bh-btn-default',
                        callback: function () {
                            deferred.reject();
                        }
                    }]
                })
            } else {
                saveAction(options, deferred, params);
            }
            return deferred;

            function saveAction(options, defer, params) {
                var resultObj = {};
                options.fileInput.emapUploadCore('saveUpload', params).done(function (res) {
                    resultObj.success = true;
                    resultObj.token = res.token;
                    defer.resolve(resultObj);
                    // 将临时文件下载地址替换为正式文件下载地址
                    $('.bh-file-img-table img', options.listConteiner).each(function () {
                        var src = $(this).attr('src');
                        if (new RegExp('getTempFile').test(src)) {
                            var fileBlock = $(this).closest('.bh-file-img-container').removeClass('success').addClass('saved');
                            var fileId = fileBlock.data('fileid');
                            $(this).attr('src', options.contextPath + '/sys/emapcomponent/file/getAttachmentFile/' + fileId + '.do');
                        }
                    });
                }).fail(function (error) {
                    resultObj.success = false;
                    resultObj.msg = error.msg || '保存失败';
                    defer.resolve(resultObj);
                });
            }
        };


        Plugin.prototype.getFileNum = function () {
            return $('.bh-file-img-container.saved, .bh-file-img-container.success', this.$element).length;
        };

        /**
         * @method destroy
         * @description 销毁组件实例
         */
        Plugin.prototype.destroy = function () {
            $(this.$element).off('click');
            this.options = null;
            $(this.$element).data('plugin', false).empty();
        };

        _renderSize = function (options) {
            if (options.size < 1024) {
                return options.size + 'K';
            } else {
                return parseInt(options.size / 1024 * 100) / 100 + 'M';
            }
        };

        // 私有方法
        _init = function (element, options) {
            if (!options.contextPath) {
                options.contextPath = WIS_EMAP_SERV.getContextPath();
            }
            var imgWidth = parseInt(options.width) - 6;
            var imgHeight = parseInt(options.height) - 6;

            $(element).addClass('bh-clearfix').append('<p class="bh-file-img-info"></p>' +
                '<div class="bh-file-img-container" style="width: ' + options.width + 'px;">' +
                '<div class="bh-file-img-input bh-file-img-block bh-file-img-single-block" style="width: ' + options.width + 'px;height: ' + options.height + 'px;">' +
                '<span class="bh-file-img-single-info">' +
                '<span class="bh-file-img-plus">+</span>' +
                '<span class="bh-file-img-text">点击上传</span>' +
                '</span>' +
                '<input type="file">' +
                '<div class="bh-file-img-loading" style="line-height: ' + imgHeight + 'px;">上传中...</div>' +
                '<div class="bh-file-img-fail"></div>' +
                '<div class="bh-file-img-table" style="width: ' + imgWidth + 'px;height: ' + imgHeight + 'px;">' +
                '<span style="width: ' + imgWidth + 'px;height: ' + imgHeight + 'px;">' +
                '<img style="max-width: ' + imgWidth + 'px;max-height: ' + imgHeight + 'px;" />' +
                '</span>' +
                '</div>' +
                '</div>' +
                '<div class="bh-file-img-single-edit">' +
                '<a href="javascript:void(0)" class="bh-file-img-retry">重新上传</a>' +
                '<a href="javascript:void(0)" class="bh-file-img-delete">删除</a>' +
                '</div>' +
                '</div>');

            // ie9 下隐藏 重新上传按钮
            if (document.documentMode == 9) {
                $('.bh-file-img-retry', element).hide();
            }

            // 生成描述信息
            var introText = '请上传图片';
            if (options.type && options.type.length > 0) {
                introText += ', 支持' + options.type.join(',').toUpperCase() + '类型';
            }

            if (options.size && options.size > 0) {
                introText += ',大小在' + _renderSize(options) + '以内';
            }

            $('.bh-file-img-info', element).html(introText);

            if (options.height <= 100) {
                $('.bh-file-img-text', element).hide();
            }

            // 获取token下已有的文件
            if (!options.newToken) {
                $.ajax({
                    type: "post",
                    url: options.contextPath + '/sys/emapcomponent/file/getUploadedAttachment/' + options.token + '.do',
                    dataType: "json",
                    success: function (res) {
                        if (res.success && res.items && res.items.length > 0) {
                            // console.log(res)
                            var imgBlock = $('.bh-file-img-container', element);
                            $('.bh-file-img-table img', imgBlock).attr('src', res.items[0].fileUrl);
                            imgBlock.addClass('saved').data({
                                'fileid': res.items[0].id
                            });


                        }
                        element.trigger('bh.file.upload.done', res);
                    }
                });
            }

            options.fileInput = $('input[type=file]', element).parent();

            options.fileInput.emapUploadCore($.extend({}, options, {
                isSingle: "1",
                add: function (e, data) {
                    var file = data.files[0];
                    var block = $('.bh-file-img-container', element);
                    if (block.hasClass('success') || block.hasClass('saved')) { // 文件重新上传
                        deleteFile(block, options);
                    }
                    block.addClass('loading');
                    if (options.add) {
                        options.add(e, data);
                    }
                    data.submit();

                },
                submit: function (e, data) {
                    var file = data.files[0];
                    var imgBlock = $('.bh-file-img-container', element);
                    // 文件的大小 和类型校验
                    if (options.type && options.type.length > 0) {
                        if (!new RegExp((options.type.join('|') + '$').toUpperCase()).test(file.name.toUpperCase())) {
                            imgBlock.removeClass('loading').addClass('error').find('.bh-file-img-fail').html('文件类型不正确');
                            return false;
                        }
                    }

                    if (fileReader && options.size) {
                        if (file.size / 1024 > options.size) {
                            imgBlock.removeClass('loading').addClass('error').find('.bh-file-img-fail').html('文件大小超出限制');
                            return false;
                        }
                    }
                    imgBlock.data('xhr', data);
                    if (options.submit) {
                        options.submit(e, data);
                    }
                },
                done: function (e, data) {
                    var file = data.files[0];
                    var imgBlock = $('.bh-file-img-container', element);

                    // 上传成功
                    imgBlock.removeClass('loading').addClass('success');
                    options.tempUpload = true;
                    $('img', imgBlock).attr('src', data.result.tempFileUrl);
                    imgBlock.data({
                        'fileid': data.result.id,
                        'deleteurl': data.result.deleteUrl
                    });
                    if (options.done) {
                        options.done(e, data)
                    }
                    element.trigger('bh.file.upload.done', data);
                },
                fail: function (e, data) {
                    var file = data.files[0];
                    var imgBlock = $('.bh-file-img-container', element);
                    imgBlock.removeClass('loading').addClass('error').find('.bh-file-img-fail').html(data.result.error ? data.result.error : '上传失败');
                    if (options.fail) {
                        options.fail(e, data)
                    }
                }
            }));


            // 删除事件绑定
            $(element).on('click', '.bh-file-img-delete', function () {
                var imgBlock = $(this).closest('.bh-file-img-container');
                deleteFile(imgBlock, options);
            });

            // 重新上传事件绑定
            $(element).on('click', '.bh-file-img-retry', function () {
                var imgBlock = $('.bh-file-img-container', element);

                // if (imgBlock.hasClass('saved')) {
                //     // 正式文件
                //     options.fileInput.emapUploadCore('deleteArrAdd', imgBlock.data('fileid'));
                // } else if (imgBlock.hasClass('success')) {
                //     // 临时文件
                //     options.fileInput.emapUploadCore('deleteTempFile', imgBlock.data('fileid'));
                // }

                // imgBlock.removeClass('saved success fail loading error');
                // $('.bh-file-img-table img', imgBlock).attr('src', '');
                if (document.documentMode != 9) {
                    $('input[type=file]', imgBlock).click();
                }

            });

            // 图片预览  事件绑定
            $(element).on('click', '.bh-file-img-table img', function () {
                if (!$.bhGallery) {
                    console && console.warn('图片轮播插件Gallery未引入');
                    return;
                }
                $.bhGallery({
                    dataSource: [{
                        image: $(this).attr('src')
                    }]
                });

            })

        };

        function deleteFile(ele, options) {
            var imgBlock = $(ele);
            if (imgBlock.hasClass('success')) {
                // 删除临时文件
                options.fileInput.emapUploadCore('deleteTempFile', imgBlock.data('fileid')).done(function (res) {
                    if (res.success) {
                        imgBlock.removeClass('success');
                        $('.bh-file-img-table img', imgBlock).attr('src', '');
                    }

                })

            } else if (imgBlock.hasClass('error')) {
                // 错误文件直接删除
                imgBlock.removeClass('error');
            } else if (imgBlock.hasClass('loading')) {
                //  删除正在上传的文件
                imgBlock.data('xhr').abort();
                imgBlock.removeClass('loading');
            } else if (imgBlock.hasClass('saved')) {
                // 删除正式文件
                // 在保存时  正式图片才被删除
                options.fileInput.emapUploadCore('deleteArrAdd', imgBlock.data('fileid'));
                imgBlock.removeClass('saved');
                $('.bh-file-img-table img', imgBlock).attr('src', '');
                options.tempUpload = true;
            }
        }

        // 定义插件
        $.fn.emapSingleImageUpload = function (options, params) {
            var instance;
            instance = this.data('plugin');

            // 判断是否已经实例化
            if (!instance) {
                return this.each(function () {
                    if (options == 'destroy') {
                        return this;
                    }
                    return $(this).data('plugin', new Plugin(this, options));
                });
            }
            if (options === true) {
                return instance;
            }
            if ($.type(options) === 'string') {
                return instance[options](params);
            }
        };

        /**
         * @memberof module:emapSingleImageUpload
         * @prop {String} [contextPath] - 根路径
         * @prop {String} [token] - 文件token,不传则组件生成随机的新token， 传token则组件自动请求token下已有的文件信息并渲染到页面上
         * @prop {String} [storeId=image] - emap文件类型
         * @prop {Array} [type=['jpg', 'jpeg', 'png']] - 上传文件的格式要求
         * @prop {Int} [size=0] - 上传文件的大小要求，单位为KB
         * @prop {Function} [add] - 添加文件的回调
         * @prop {Function} [submit] - 开始上传文件的回调
         * @prop {Function} [done] - 文件上传成功的回调
         * @prop {Function} [fail] - 文件上传失败的回调
         */
        $.fn.emapSingleImageUpload.defaults = {
            tempUpload: false,
            multiple: false,
            storeId: 'image',
            width: 200,
            height: 150,
            type: ['jpg', 'jpeg', 'png'],
            size: 0
        };

    })();

}).call(this);
(function () {
    var Plugin;
    var fileReader = 'FileReader' in window;
    var _init;

    Plugin = (function () {
        /**
         * @module emapUploadCore
         * @description 上传核心模块，此模块等装了emap上传相关的各项请求方法，被 文件上传、图片上传、单图片上传等组件复用，也可单独使用
         */
        function Plugin(element, options) {
            this.options = $.extend({}, $.fn.emapUploadCore.defaults, options);
            this.$element = $(element);

            this.options.contextPath = options.contextPath || WIS_EMAP_SERV.getContextPath();

            if (this.options.token && this.options.token != '') {
                this.options.scope = this.options.token.substring(0, this.options.token.length - 1);
                this.options.newToken = options.newToken = false;
            } else {
                this.options.scope = new Date().getTime() + "" + parseInt(Math.random() * 100).toString();
                this.options.token = this.options.scope + 1;
                this.options.newToken = options.newToken = true;
            }
            this.options.arrToDelete = [];
            this.options.tempArrToDelete = [];

            // 对于有传参uploadUrl的情况， 直接使用uploadUrl作为上传地址
            if (!options.uploadUrl) {
                //在outform情况下，上传路径的地址由外部outformUploadUrl穿入  --added for outform by zsl
                if (options.outForm === true) {
                    if (this.options.outFormUploadUrl) {
                        this.options.uploadUrl = this.options.contextPath + this.options.outFormUploadUrl.replace('{scope}', this.options.scope).replace('{scope}', this.options.token);
                    } else {
                        console && console.error('使用表单外fileupload组件时，必须指定outFormUploadUrl');
                    }

                } else {
                    this.options.uploadUrl = this.options.contextPath + '/sys/emapcomponent/file/uploadTempFile.do';
                }
            }
            _init(this.$element, this.options);
        }
        /**
         * @method getFileToken
         * @description 获取token
         * @return {string} token
         */
        Plugin.prototype.getFileToken = function () {
            return this.options.token;
        };

        /**
         * @method getFileUrl
         * @description 返回token下已有的正式文件的url数组
         * @return {Array} url数组
         */
        Plugin.prototype.getFileUrl = function () {
            var options = this.options;
            var fileArr;
            $.ajax({
                type: "post",
                url: options.contextPath + '/sys/emapcomponent/file/getUploadedAttachment/' + options.token + '.do',
                dataType: "json",
                async: false,
                success: function (res) {
                    if (res.success) {
                        fileArr = $(res.items).map(function () {
                            return this.fileUrl;
                        }).get();
                    }
                }
            });
            return fileArr;
        };

        /**
         * @method getFileData
         * @description 返回token下已有的正式文件的信息
         * @return {Array} 文件信息对象数组
         */
        Plugin.prototype.getFileData = function () {
            var options = this.options;
            var fileArr;
            $.ajax({
                type: "post",
                url: options.contextPath + '/sys/emapcomponent/file/getUploadedAttachment/' + options.token + '.do',
                dataType: "json",
                async: false,
                success: function (res) {
                    if (res.success) {
                        fileArr = res.items;
                    }
                }
            });
            return fileArr;
        };

        /**
         * @method deleteArrAdd
         * @param {String} id - 文件id
         * @description 将正式文件添加到待删除 数组中
         */
        Plugin.prototype.deleteArrAdd = function (id) {
            var defer = $.Deferred();
            if (this.options.arrToDelete.indexOf(id) == -1) {
                this.options.arrToDelete.push(id);
            }
            defer.resolve();
        };

        /**
         * @method deleteArrRemove
         * @param {String} id - 文件id
         * @description 将正式文件从待删除数组中  剔除
         */
        Plugin.prototype.deleteArrRemove = function (id) {
            var defer = $.Deferred();
            var index = this.options.arrToDelete.indexOf(id);
            if (index > -1) {
                this.options.arrToDelete.splice(index, 1);
            }
            defer.resolve();
        };

        /**
         * @method tempDeleteArrAdd
         * @param {String} id - 文件id
         * @description 将临时文件添加到 临时文件待删除数组中
         */
        Plugin.prototype.tempDeleteArrAdd = function (id) {
            var defer = $.Deferred();
            if (this.options.tempArrToDelete.indexOf(id) == -1) {
                this.options.tempArrToDelete.push(id);
            }
            defer.resolve();
        };

        /**
         * @method tempDeleteArrRemove
         * @param {String} id - 文件id
         * @description 将临时文件从  临时文件待删除数组中剔除
         */
        Plugin.prototype.tempDeleteArrRemove = function (id) {
            var defer = $.Deferred();
            var index = this.options.tempArrToDelete.indexOf(id);
            if (index > -1) {
                this.options.tempArrToDelete.splice(index, 1);
            }
            defer.resolve
        };

        /**
         * @method saveTempFile
         * @param {Object} [params] - 保存请求参数
         * @description 保存token, 不建议使用, 用saveUpload方法替代
         */
        Plugin.prototype.saveTempFile = function (params) {
            // 删除 已经删除的正式文件
            var options = this.options;
            var element = this.$element;
            var param_data = params || {};
            if (!this.$element.emapUploadCore('deleteFormalFile')) {
                console && console.error('删除临时文件失败');
                $.bhTip && $.bhTip({
                    content: '请求失败',
                    state: 'danger',
                    iconClass: 'icon-close'
                });
                return;
            }

            // 删除 待删除临时文件
            if (options.tempArrToDelete && options.tempArrToDelete.length > 0) {
                options.tempArrToDelete.map(function (item) {
                    element.emapUploadCore('deleteTempFile', item).done(function (res) {});
                })
            }
            if (param_data) {
                param_data.attachmentParam = $.extend({}, this.options.attachmentParam, param_data.attachmentParam);
                param_data.attachmentParam = JSON.stringify(param_data.attachmentParam);
            }

            var result = false;
            var saveOpt = {
                type: "post",
                async: false,
                url: options.contextPath +
                    "/sys/emapcomponent/file/saveAttachment/" +
                    options.scope + "/" + options.token + ".do",
                data: param_data,
                dataType: "json",
                success: function (data) {
                    if (data.success) {
                        options.arrToDelete = [];
                        // token下没有文件时, 返回的token为空
                        if (element.emapUploadCore('getFileUrl').length > 0) {
                            result = options.token;
                        } else {
                            result = "";
                        }
                    }
                }
            };
            if (options.arrToDelete.length) {
                var widArray = [];
                options.arrToDelete.map(function (item) {
                    var wid = item.replace(/_[1|2]$/g, "");
                    widArray.push(wid);
                    widArray.push(wid + '_1');
                    widArray.push(wid + '_2');
                });
                saveOpt.data.widsOfAttsToDelete = widArray.join(',');
            }
            $.ajax(saveOpt);
            return result;
        };

        /**
         * @method saveUpload
         * @param {Object} [params] - 保存请求参数
         * @description 该方法为异步的 保存方法, 会在 有文件正在上传时弹出确认框, 该方法返回一个defer对象
         * @return {Object} 异步方法的Defer对象，resolve带参格式 为
         * {
         *   success: true,
         *   token: "xxx",
         * }
         */
        Plugin.prototype.saveUpload = function (params) {
            // 删除 已经删除的正式文件
            var options = this.options;
            var element = this.$element;
            var param_data = params || {};
            if (!this.$element.emapUploadCore('deleteFormalFile')) {
                console && console.error('删除临时文件失败');
                $.bhTip && $.bhTip({
                    content: '请求失败',
                    state: 'danger',
                    iconClass: 'icon-close'
                });
                return;
            }

            // 删除 待删除临时文件
            if (options.tempArrToDelete && options.tempArrToDelete.length > 0) {
                options.tempArrToDelete.map(function (item) {
                    element.emapUploadCore('deleteTempFile', item).done(function (res) {});
                })
            }
            if (param_data) {
                param_data.attachmentParam = $.extend({}, this.options.attachmentParam, param_data.attachmentParam);
                param_data.attachmentParam = JSON.stringify(param_data.attachmentParam);
            }

            var result = $.Deferred();
            var saveOpt = {
                type: "post",
                url: options.contextPath +
                    "/sys/emapcomponent/file/saveAttachment/" +
                    options.scope + "/" + options.token + ".do",
                data: param_data,
                dataType: "json",
                success: function (data) {
                    if (data.success) {
                        options.arrToDelete = [];
                        // token下没有文件时, 返回的token为空
                        if (element.emapUploadCore('getFileUrl').length > 0) {
                            data.token = options.token;
                        } else {
                            data.token = "";
                        }
                        result.resolve(data);
                    } else {
                        result.reject(data);
                        $.bhTip && $.bhTip({
                            content: data.msg || '保存失败',
                            state: 'danger',
                            iconClass: 'icon-close'
                        });
                    }
                },
                error: function (error) {
                    result.reject(error);
                    $.bhTip && $.bhTip({
                        content: '保存失败',
                        state: 'danger',
                        iconClass: 'icon-close'
                    });
                }
            };
            if (options.arrToDelete.length) {
                var widArray = [];
                options.arrToDelete.map(function (item) {
                    var wid = item.replace(/_[1|2]$/g, "");
                    widArray.push(wid);
                    widArray.push(wid + '_1');
                    widArray.push(wid + '_2');
                });
                saveOpt.data.widsOfAttsToDelete = widArray.join(',');
            }
            $.ajax(saveOpt);
            return result;

        };

        /**
         * @method deleteFormalFile
         * @param {String} id - 文件id
         * @description 删除正式文件
         */
        Plugin.prototype.deleteFormalFile = function (id) {
            var result = true;
            var options = this.options;
            if (id) {
                deleteAjax(id);
            } else {
                var delArr = this.options.arrToDelete;
                if (delArr.length > 0) {
                    for (var i = 0; i < delArr.length; i++) {
                        deleteAjax(delArr[i]);
                    }
                }
            }
            return result;

            function deleteAjax(id) {

                id = id.replace(/_[1|2]$/g, "");
                var idArr = [id, id + '_1', id + '_2'];
                idArr.map(function (val) {
                    var ajaxOpt = {
                        type: "post",
                        url: options.contextPath + '/sys/emapcomponent/file/deleteFileByWid/' + val + '.do',
                        dataType: "json",
                        success: function (data) {}
                    };
                    if (val == id) {
                        ajaxOpt.async = false;
                        ajaxOpt.success = function (res) {
                            console.log(res)
                            if (res.success && res.count) {

                            } else {
                                result = false;
                            }
                        }
                    }
                    $.ajax(ajaxOpt);
                })

            }

        };

        /**
         * @method deleteTempFile
         * @param {String} id - 文件id
         * @description 删除临时文件
         */
        Plugin.prototype.deleteTempFile = function (id) {
            var options = this.options;
            var url = options.contextPath + '/sys/emapcomponent/file/deleteTempFile.do';
            return $.ajax({
                type: "post",
                url: url,
                dataType: "json",
                async: false,
                data: {
                    scope: options.scope,
                    fileToken: options.token,
                    // attachId: id,
                    fileWid: id,
                    attachmentParam: JSON.stringify({
                        storeId: options.storeId,
                        scope: options.scope,
                        fileToken: options.token
                    })
                }
            });
        };

        /**
         * @method deleteFileByToken
         * @description 删除token下的所有正式文件
         */
        Plugin.prototype.deleteFileByToken = function () {
            var options = this.options;

            return $.ajax({
                type: "post",
                url: options.contextPath + '/sys/emapcomponent/file/deleteFileByToken/' + options.token + '.do',
                async: false,
                dataType: "json"
            });
        };

        /**
         * @method destroy
         * @description 销毁
         */
        Plugin.prototype.destroy = function () {
            this.options = null;
            $(this.$element).data('plugin', false).empty();
        };

        /**
         * @method reload
         * @description 刷新实例的token
         */
        Plugin.prototype.reload = function () {
            var options = this.options;
            options.newToken = true;
            options.scope = new Date().getTime() + "" + parseInt(Math.random() * 100).toString();
            options.token = this.options.scope + 1;
            options.uploadUrl = this.options.contextPath + '/sys/emapcomponent/file/uploadTempFile/' + this.options.scope + '/' + this.options.token + '.do';
            options.arrToDelete = [];
            options.tempArrToDelete = [];

            options.attachmentParam = {
                storeId: options.storeId,
                scope: options.scope,
                fileToken: options.token,
                params: options.params
            };
            $('input[type=file]', this.$element).fileupload({
                url: options.uploadUrl
            })
        };

        /**
         * @method getFileBatch
         * @description 批量下载
         */
        Plugin.prototype.getFileBatch = function () {
            window.location.href = options.contextPath + '/sys/emapcomponent/file/getFileBatchByToken/' + options.token + '.do';
            // $.ajax({
            //     type: "post",
            //     url: options.contextPath + '/sys/emapcomponent/file/getFileBatchByToken/' + options.token + '.do',
            //     async: false,
            //     dataType: "json"
            // }).done(function(res){console.log(res)});
        };

        // 私有方法
        _init = function (element, options) {
            // 处理config配置
            options.config = options.config || {};

            // 初始化时 先删除 原有token下的所有临时文件
            if (!options.newToken) {
                $.ajax({
                    type: 'post',
                    url: options.contextPath + '/sys/emapcomponent/file/deleteTempFile.do',
                    async: false,
                    data: {
                        scope: options.scope,
                        fileToken: options.token
                    },
                    success: function () {}
                });
            }


            options.attachmentParam = {
                storeId: options.storeId,
                scope: options.scope,
                fileToken: options.token,
                params: options.params
            };

            var fileInput;
            if (element[0].nodeName == 'INPUT' && element[0].getAttribute('type') == 'file') {
                fileInput = element;
            } else {
                if ($('input[type=file]', element).length == 0) {
                    element.append('<input type="file" name="bhFile" />')
                }

                fileInput = $('input[type=file]', element);
            }

            var formData = $.extend({}, {
                scope: options.scope,
                fileToken: options.token,
                size: options.size,
                type: options.type,
                storeId: options.storeId,
                isSingle: options.isSingle == "1" ? "1" : "0",
                fileName: options.fileName ? options.fileName : ""
            }, options.config.params);

            fileInput.fileupload({
                url: options.uploadUrl,
                autoUpload: true,
                multiple: true,
                dataType: 'json',
                limitMultiFileUploads: 10,
                formData: formData,
                add: function (e, data) {
                    var addResult = true;
                    if (options.add) {
                        addResult = options.add(e, data);
                    }
                    if (addResult === false) {
                        return false
                    }
                    data.submit();
                },
                submit: function (e, data) {
                    var submitResult = true;
                    if (options.submit) {
                        submitResult = options.submit(e, data);
                    }
                    if (submitResult === false) {
                        element.trigger('bh.file.upload.done', data);
                        return false;
                    }
                },
                done: function (e, data) {
                    var file = data.files[0];
                    if (data.result.success) {
                        // 上传成功
                        if (options.done) {
                            options.done(e, data)
                        }
                        element.trigger('bh.file.upload.done', data);
                    } else {
                        // 上传失败
                        if (options.fail) {
                            options.fail(e, data)
                        }
                    }
                },
                fail: function (e, data) {
                    if (options.fail) {
                        options.fail(e, data)
                    }
                }
            });
        };

        // 定义插件
        $.fn.emapUploadCore = function (options, params) {
            var instance;
            instance = this.data('emapuploadcore');

            // 判断是否已经实例化
            if (!instance) {
                return this.each(function () {
                    if (options == 'destroy') {
                        return this;
                    }
                    return $(this).data('emapuploadcore', new Plugin(this, options));
                });
            }
            if (options === true) {
                return instance;
            }
            if ($.type(options) === 'string') {
                return instance[options](params);
            }
        };

        /**
         * @memberof module:emapFileUpload
         * @prop {String} [contextPath] - 根路径
         * @prop {String} [token] - 文件token,不传则组件生成随机的新token， 传token则组件自动请求token下已有的文件信息并渲染到页面上
         * @prop {Boolean} [multiple=false] - 上传控件是否支持一次性选择多个
         * @prop {String} [storeId=file] - emap文件类型
         * @prop {Array} [type=[]] - 上传文件的格式要求
         * @prop {Int} [size=0] - 上传文件的大小要求，单位为KB
         * @prop {Function} [add] - 添加文件的回调
         * @prop {Function} [submit] - 开始上传文件的回调
         * @prop {Function} [done] - 文件上传成功的回调
         * @prop {Function} [fail] - 文件上传失败的回调
         */
        $.fn.emapUploadCore.defaults = {
            multiple: false,
            storeId: 'file',
            type: [],
            size: 0
        };


    })();

}).call(this);
/*! jQuery UI - v1.11.4+CommonJS - 2015-08-28
 * http://jqueryui.com
 * Includes: widget.js
 * Copyright 2015 jQuery Foundation and other contributors; Licensed MIT */
(function (c) {
    /*!
     * jQuery UI Widget 1.11.4
     * http://jqueryui.com
     *
     * Copyright jQuery Foundation and other contributors
     * Released under the MIT license.
     * http://jquery.org/license
     *
     * http://api.jqueryui.com/jQuery.widget/
     */
    var d = 0, a = Array.prototype.slice;
    c.cleanData = (function (e) {
        return function (f) {
            var h, j, g;
            for (g = 0; (j = f[g]) != null; g++) {
                try {
                    h = c._data(j, "events");
                    if (h && h.remove) {
                        c(j).triggerHandler("remove")
                    }
                } catch (k) {
                }
            }
            e(f)
        }
    })(c.cleanData);
    c.widget = function (e, f, m) {
        var j, k, h, l, g = {}, i = e.split(".")[0];
        e = e.split(".")[1];
        j = i + "-" + e;
        if (!m) {
            m = f;
            f = c.Widget
        }
        c.expr[":"][j.toLowerCase()] = function (n) {
            return !!c.data(n, j)
        };
        c[i] = c[i] || {};
        k = c[i][e];
        h = c[i][e] = function (n, o) {
            if (!this._createWidget) {
                return new h(n, o)
            }
            if (arguments.length) {
                this._createWidget(n, o)
            }
        };
        c.extend(h, k, {version: m.version, _proto: c.extend({}, m), _childConstructors: []});
        l = new f();
        l.options = c.widget.extend({}, l.options);
        c.each(m, function (o, n) {
            if (!c.isFunction(n)) {
                g[o] = n;
                return
            }
            g[o] = (function () {
                var p = function () {
                    return f.prototype[o].apply(this, arguments)
                }, q = function (r) {
                    return f.prototype[o].apply(this, r)
                };
                return function () {
                    var t = this._super, r = this._superApply, s;
                    this._super = p;
                    this._superApply = q;
                    s = n.apply(this, arguments);
                    this._super = t;
                    this._superApply = r;
                    return s
                }
            })()
        });
        h.prototype = c.widget.extend(l, {widgetEventPrefix: k ? (l.widgetEventPrefix || e) : e}, g, {
            constructor: h,
            namespace: i,
            widgetName: e,
            widgetFullName: j
        });
        if (k) {
            c.each(k._childConstructors, function (o, p) {
                var n = p.prototype;
                c.widget(n.namespace + "." + n.widgetName, h, p._proto)
            });
            delete k._childConstructors
        } else {
            f._childConstructors.push(h)
        }
        c.widget.bridge(e, h);
        return h
    };
    c.widget.extend = function (j) {
        var f = a.call(arguments, 1), i = 0, e = f.length, g, h;
        for (; i < e; i++) {
            for (g in f[i]) {
                h = f[i][g];
                if (f[i].hasOwnProperty(g) && h !== undefined) {
                    if (c.isPlainObject(h)) {
                        j[g] = c.isPlainObject(j[g]) ? c.widget.extend({}, j[g], h) : c.widget.extend({}, h)
                    } else {
                        j[g] = h
                    }
                }
            }
        }
        return j
    };
    c.widget.bridge = function (f, e) {
        var g = e.prototype.widgetFullName || f;
        c.fn[f] = function (j) {
            var h = typeof j === "string", i = a.call(arguments, 1), k = this;
            if (h) {
                this.each(function () {
                    var m, l = c.data(this, g);
                    if (j === "instance") {
                        k = l;
                        return false
                    }
                    if (!l) {
                        return c.error("cannot call methods on " + f + " prior to initialization; " + "attempted to call method '" + j + "'")
                    }
                    if (!c.isFunction(l[j]) || j.charAt(0) === "_") {
                        return c.error("no such method '" + j + "' for " + f + " widget instance")
                    }
                    m = l[j].apply(l, i);
                    if (m !== l && m !== undefined) {
                        k = m && m.jquery ? k.pushStack(m.get()) : m;
                        return false
                    }
                })
            } else {
                if (i.length) {
                    j = c.widget.extend.apply(null, [j].concat(i))
                }
                this.each(function () {
                    var l = c.data(this, g);
                    if (l) {
                        l.option(j || {});
                        if (l._init) {
                            l._init()
                        }
                    } else {
                        c.data(this, g, new e(j, this))
                    }
                })
            }
            return k
        }
    };
    c.Widget = function () {
    };
    c.Widget._childConstructors = [];
    c.Widget.prototype = {
        widgetName: "widget",
        widgetEventPrefix: "",
        defaultElement: "<div>",
        options: {disabled: false, create: null},
        _createWidget: function (e, f) {
            f = c(f || this.defaultElement || this)[0];
            this.element = c(f);
            this.uuid = d++;
            this.eventNamespace = "." + this.widgetName + this.uuid;
            this.bindings = c();
            this.hoverable = c();
            this.focusable = c();
            if (f !== this) {
                c.data(f, this.widgetFullName, this);
                this._on(true, this.element, {
                    remove: function (g) {
                        if (g.target === f) {
                            this.destroy()
                        }
                    }
                });
                this.document = c(f.style ? f.ownerDocument : f.document || f);
                this.window = c(this.document[0].defaultView || this.document[0].parentWindow)
            }
            this.options = c.widget.extend({}, this.options, this._getCreateOptions(), e);
            this._create();
            this._trigger("create", null, this._getCreateEventData());
            this._init()
        },
        _getCreateOptions: c.noop,
        _getCreateEventData: c.noop,
        _create: c.noop,
        _init: c.noop,
        destroy: function () {
            this._destroy();
            this.element.unbind(this.eventNamespace).removeData(this.widgetFullName).removeData(c.camelCase(this.widgetFullName));
            this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName + "-disabled " + "ui-state-disabled");
            this.bindings.unbind(this.eventNamespace);
            this.hoverable.removeClass("ui-state-hover");
            this.focusable.removeClass("ui-state-focus")
        },
        _destroy: c.noop,
        widget: function () {
            return this.element
        },
        option: function (h, j) {
            var e = h, k, g, f;
            if (arguments.length === 0) {
                return c.widget.extend({}, this.options)
            }
            if (typeof h === "string") {
                e = {};
                k = h.split(".");
                h = k.shift();
                if (k.length) {
                    g = e[h] = c.widget.extend({}, this.options[h]);
                    for (f = 0; f < k.length - 1; f++) {
                        g[k[f]] = g[k[f]] || {};
                        g = g[k[f]]
                    }
                    h = k.pop();
                    if (arguments.length === 1) {
                        return g[h] === undefined ? null : g[h]
                    }
                    g[h] = j
                } else {
                    if (arguments.length === 1) {
                        return this.options[h] === undefined ? null : this.options[h]
                    }
                    e[h] = j
                }
            }
            this._setOptions(e);
            return this
        },
        _setOptions: function (e) {
            var f;
            for (f in e) {
                this._setOption(f, e[f])
            }
            return this
        },
        _setOption: function (e, f) {
            this.options[e] = f;
            if (e === "disabled") {
                this.widget().toggleClass(this.widgetFullName + "-disabled", !!f);
                if (f) {
                    this.hoverable.removeClass("ui-state-hover");
                    this.focusable.removeClass("ui-state-focus")
                }
            }
            return this
        },
        enable: function () {
            return this._setOptions({disabled: false})
        },
        disable: function () {
            return this._setOptions({disabled: true})
        },
        _on: function (h, g, f) {
            var i, e = this;
            if (typeof h !== "boolean") {
                f = g;
                g = h;
                h = false
            }
            if (!f) {
                f = g;
                g = this.element;
                i = this.widget()
            } else {
                g = i = c(g);
                this.bindings = this.bindings.add(g)
            }
            c.each(f, function (o, n) {
                function l() {
                    if (!h && (e.options.disabled === true || c(this).hasClass("ui-state-disabled"))) {
                        return
                    }
                    return (typeof n === "string" ? e[n] : n).apply(e, arguments)
                }

                if (typeof n !== "string") {
                    l.guid = n.guid = n.guid || l.guid || c.guid++
                }
                var m = o.match(/^([\w:-]*)\s*(.*)$/), k = m[1] + e.eventNamespace, j = m[2];
                if (j) {
                    i.delegate(j, k, l)
                } else {
                    g.bind(k, l)
                }
            })
        },
        _off: function (f, e) {
            e = (e || "").split(" ").join(this.eventNamespace + " ") + this.eventNamespace;
            f.unbind(e).undelegate(e);
            this.bindings = c(this.bindings.not(f).get());
            this.focusable = c(this.focusable.not(f).get());
            this.hoverable = c(this.hoverable.not(f).get())
        },
        _delay: function (h, g) {
            function f() {
                return (typeof h === "string" ? e[h] : h).apply(e, arguments)
            }

            var e = this;
            return setTimeout(f, g || 0)
        },
        _hoverable: function (e) {
            this.hoverable = this.hoverable.add(e);
            this._on(e, {
                mouseenter: function (f) {
                    c(f.currentTarget).addClass("ui-state-hover")
                }, mouseleave: function (f) {
                    c(f.currentTarget).removeClass("ui-state-hover")
                }
            })
        },
        _focusable: function (e) {
            this.focusable = this.focusable.add(e);
            this._on(e, {
                focusin: function (f) {
                    c(f.currentTarget).addClass("ui-state-focus")
                }, focusout: function (f) {
                    c(f.currentTarget).removeClass("ui-state-focus")
                }
            })
        },
        _trigger: function (e, f, g) {
            var j, i, h = this.options[e];
            g = g || {};
            f = c.Event(f);
            f.type = (e === this.widgetEventPrefix ? e : this.widgetEventPrefix + e).toLowerCase();
            f.target = this.element[0];
            i = f.originalEvent;
            if (i) {
                for (j in i) {
                    if (!(j in f)) {
                        f[j] = i[j]
                    }
                }
            }
            this.element.trigger(f, g);
            return !(c.isFunction(h) && h.apply(this.element[0], [f].concat(g)) === false || f.isDefaultPrevented())
        }
    };
    c.each({show: "fadeIn", hide: "fadeOut"}, function (f, e) {
        c.Widget.prototype["_" + f] = function (i, h, k) {
            if (typeof h === "string") {
                h = {effect: h}
            }
            var j, g = !h ? f : h === true || typeof h === "number" ? e : h.effect || e;
            h = h || {};
            if (typeof h === "number") {
                h = {duration: h}
            }
            j = !c.isEmptyObject(h);
            h.complete = k;
            if (h.delay) {
                i.delay(h.delay)
            }
            if (j && c.effects && c.effects.effect[g]) {
                i[f](h)
            } else {
                if (g !== f && i[g]) {
                    i[g](h.duration, h.easing, k)
                } else {
                    i.queue(function (l) {
                        c(this)[f]();
                        if (k) {
                            k.call(i[0])
                        }
                        l()
                    })
                }
            }
        }
    });
    var b = c.widget
})(jQuery);

(function (b) {
    var a = 0;
    b.ajaxTransport("iframe", function (d) {
        if (d.async) {
            var c = d.initialIframeSrc || "javascript:false;", f, e, g;
            return {
                send: function (h, i) {
                    f = b('<form style="display:none;"></form>');
                    f.attr("accept-charset", d.formAcceptCharset);
                    g = /\?/.test(d.url) ? "&" : "?";
                    if (d.type === "DELETE") {
                        d.url = d.url + g + "_method=DELETE";
                        d.type = "POST"
                    } else {
                        if (d.type === "PUT") {
                            d.url = d.url + g + "_method=PUT";
                            d.type = "POST"
                        } else {
                            if (d.type === "PATCH") {
                                d.url = d.url + g + "_method=PATCH";
                                d.type = "POST"
                            }
                        }
                    }
                    a += 1;
                    e = b('<iframe src="' + c + '" name="iframe-transport-' + a + '"></iframe>').bind("load", function () {
                        var j, k = b.isArray(d.paramName) ? d.paramName : [d.paramName];
                        e.unbind("load").bind("load", function () {
                            var l;
                            try {
                                l = e.contents();
                                if (!l.length || !l[0].firstChild) {
                                    throw new Error()
                                }
                            } catch (m) {
                                l = undefined
                            }
                            i(200, "success", {"iframe": l});
                            b('<iframe src="' + c + '"></iframe>').appendTo(f);
                            window.setTimeout(function () {
                                f.remove()
                            }, 0)
                        });
                        f.prop("target", e.prop("name")).prop("action", d.url).prop("method", d.type);
                        if (d.formData) {
                            b.each(d.formData, function (l, m) {
                                b('<input type="hidden"/>').prop("name", m.name).val(m.value).appendTo(f)
                            })
                        }
                        if (d.fileInput && d.fileInput.length && d.type === "POST") {
                            j = d.fileInput.clone();
                            d.fileInput.after(function (l) {
                                return j[l]
                            });
                            if (d.paramName) {
                                d.fileInput.each(function (l) {
                                    b(this).prop("name", k[l] || d.paramName)
                                })
                            }
                            f.append(d.fileInput).prop("enctype", "multipart/form-data").prop("encoding", "multipart/form-data");
                            d.fileInput.removeAttr("form")
                        }
                        f.submit();
                        if (j && j.length) {
                            d.fileInput.each(function (m, l) {
                                var n = b(j[m]);
                                b(l).prop("name", n.prop("name")).attr("form", n.attr("form"));
                                n.replaceWith(l)
                            })
                        }
                    });
                    f.append(e).appendTo(document.body)
                }, abort: function () {
                    if (e) {
                        e.unbind("load").prop("src", c)
                    }
                    if (f) {
                        f.remove()
                    }
                }
            }
        }
    });
    b.ajaxSetup({
        converters: {
            "iframe text": function (c) {
                return c && b(c[0].body).text()
            }, "iframe json": function (c) {
                return c && b.parseJSON(b(c[0].body).text())
            }, "iframe html": function (c) {
                return c && b(c[0].body).html()
            }, "iframe xml": function (c) {
                var d = c && c[0];
                return d && b.isXMLDoc(d) ? d : b.parseXML((d.XMLDocument && d.XMLDocument.xml) || b(d.body).html())
            }, "iframe script": function (c) {
                return c && b.globalEval(b(c[0].body).text())
            }
        }
    })
})(jQuery);
(function (b) {
    b.support.fileInput = !(new RegExp("(Android (1\\.[0156]|2\\.[01]))" + "|(Windows Phone (OS 7|8\\.0))|(XBLWP)|(ZuneWP)|(WPDesktop)" + "|(w(eb)?OSBrowser)|(webOS)" + "|(Kindle/(1\\.0|2\\.[05]|3\\.0))").test(window.navigator.userAgent) || b('<input type="file">').prop("disabled"));
    b.support.xhrFileUpload = !!(window.ProgressEvent && window.FileReader);
    b.support.xhrFormDataFileUpload = !!window.FormData;
    b.support.blobSlice = window.Blob && (Blob.prototype.slice || Blob.prototype.webkitSlice || Blob.prototype.mozSlice);
    function a(c) {
        var d = c === "dragover";
        return function (g) {
            g.dataTransfer = g.originalEvent && g.originalEvent.dataTransfer;
            var f = g.dataTransfer;
            if (f && b.inArray("Files", f.types) !== -1 && this._trigger(c, b.Event(c, {delegatedEvent: g})) !== false) {
                g.preventDefault();
                if (d) {
                    f.dropEffect = "copy"
                }
            }
        }
    }

    b.widget("blueimp.fileupload", {
        options: {
            dropZone: b(document),
            pasteZone: undefined,
            fileInput: undefined,
            replaceFileInput: true,
            paramName: undefined,
            singleFileUploads: true,
            limitMultiFileUploads: undefined,
            limitMultiFileUploadSize: undefined,
            limitMultiFileUploadSizeOverhead: 512,
            sequentialUploads: false,
            limitConcurrentUploads: undefined,
            forceIframeTransport: false,
            redirect: undefined,
            redirectParamName: undefined,
            postMessage: undefined,
            multipart: true,
            maxChunkSize: undefined,
            uploadedBytes: undefined,
            recalculateProgress: true,
            progressInterval: 100,
            bitrateInterval: 500,
            autoUpload: true,
            messages: {uploadedBytes: "Uploaded bytes exceed file size"},
            i18n: function (d, c) {
                d = this.messages[d] || d.toString();
                if (c) {
                    b.each(c, function (e, f) {
                        d = d.replace("{" + e + "}", f)
                    })
                }
                return d
            },
            formData: function (c) {
                return c.serializeArray()
            },
            add: function (d, c) {
                if (d.isDefaultPrevented()) {
                    return false
                }
                if (c.autoUpload || (c.autoUpload !== false && b(this).fileupload("option", "autoUpload"))) {
                    c.process().done(function () {
                        c.submit()
                    })
                }
            },
            processData: false,
            contentType: false,
            cache: false,
            timeout: 0
        },
        _specialOptions: ["fileInput", "dropZone", "pasteZone", "multipart", "forceIframeTransport"],
        _blobSlice: b.support.blobSlice && function () {
            var c = this.slice || this.webkitSlice || this.mozSlice;
            return c.apply(this, arguments)
        },
        _BitrateTimer: function () {
            this.timestamp = ((Date.now) ? Date.now() : (new Date()).getTime());
            this.loaded = 0;
            this.bitrate = 0;
            this.getBitrate = function (e, d, c) {
                var f = e - this.timestamp;
                if (!this.bitrate || !c || f > c) {
                    this.bitrate = (d - this.loaded) * (1000 / f) * 8;
                    this.loaded = d;
                    this.timestamp = e
                }
                return this.bitrate
            }
        },
        _isXHRUpload: function (c) {
            return !c.forceIframeTransport && ((!c.multipart && b.support.xhrFileUpload) || b.support.xhrFormDataFileUpload)
        },
        _getFormData: function (c) {
            var d;
            if (b.type(c.formData) === "function") {
                return c.formData(c.form)
            }
            if (b.isArray(c.formData)) {
                return c.formData
            }
            if (b.type(c.formData) === "object") {
                d = [];
                b.each(c.formData, function (e, f) {
                    d.push({name: e, value: f})
                });
                return d
            }
            return []
        },
        _getTotal: function (d) {
            var c = 0;
            b.each(d, function (e, f) {
                c += f.size || 1
            });
            return c
        },
        _initProgressObject: function (d) {
            var c = {loaded: 0, total: 0, bitrate: 0};
            if (d._progress) {
                b.extend(d._progress, c)
            } else {
                d._progress = c
            }
        },
        _initResponseObject: function (c) {
            var d;
            if (c._response) {
                for (d in c._response) {
                    if (c._response.hasOwnProperty(d)) {
                        delete c._response[d]
                    }
                }
            } else {
                c._response = {}
            }
        },
        _onProgress: function (g, f) {
            if (g.lengthComputable) {
                var d = ((Date.now) ? Date.now() : (new Date()).getTime()), c;
                if (f._time && f.progressInterval && (d - f._time < f.progressInterval) && g.loaded !== g.total) {
                    return
                }
                f._time = d;
                c = Math.floor(g.loaded / g.total * (f.chunkSize || f._progress.total)) + (f.uploadedBytes || 0);
                this._progress.loaded += (c - f._progress.loaded);
                this._progress.bitrate = this._bitrateTimer.getBitrate(d, this._progress.loaded, f.bitrateInterval);
                f._progress.loaded = f.loaded = c;
                f._progress.bitrate = f.bitrate = f._bitrateTimer.getBitrate(d, c, f.bitrateInterval);
                this._trigger("progress", b.Event("progress", {delegatedEvent: g}), f);
                this._trigger("progressall", b.Event("progressall", {delegatedEvent: g}), this._progress)
            }
        },
        _initProgressListener: function (c) {
            var d = this, e = c.xhr ? c.xhr() : b.ajaxSettings.xhr();
            if (e.upload) {
                b(e.upload).bind("progress", function (f) {
                    var g = f.originalEvent;
                    f.lengthComputable = g.lengthComputable;
                    f.loaded = g.loaded;
                    f.total = g.total;
                    d._onProgress(f, c)
                });
                c.xhr = function () {
                    return e
                }
            }
        },
        _isInstanceOf: function (c, d) {
            return Object.prototype.toString.call(d) === "[object " + c + "]"
        },
        _initXHRData: function (d) {
            var f = this, h, e = d.files[0], c = d.multipart || !b.support.xhrFileUpload, g = b.type(d.paramName) === "array" ? d.paramName[0] : d.paramName;
            d.headers = b.extend({}, d.headers);
            if (d.contentRange) {
                d.headers["Content-Range"] = d.contentRange
            }
            if (!c || d.blob || !this._isInstanceOf("File", e)) {
                d.headers["Content-Disposition"] = 'attachment; filename="' + encodeURI(e.name) + '"'
            }
            if (!c) {
                d.contentType = e.type || "application/octet-stream";
                d.data = d.blob || e
            } else {
                if (b.support.xhrFormDataFileUpload) {
                    if (d.postMessage) {
                        h = this._getFormData(d);
                        if (d.blob) {
                            h.push({name: g, value: d.blob})
                        } else {
                            b.each(d.files, function (i, j) {
                                h.push({name: (b.type(d.paramName) === "array" && d.paramName[i]) || g, value: j})
                            })
                        }
                    } else {
                        if (f._isInstanceOf("FormData", d.formData)) {
                            h = d.formData
                        } else {
                            h = new FormData();
                            b.each(this._getFormData(d), function (i, j) {
                                h.append(j.name, j.value)
                            })
                        }
                        if (d.blob) {
                            h.append(g, d.blob, e.name)
                        } else {
                            b.each(d.files, function (i, j) {
                                if (f._isInstanceOf("File", j) || f._isInstanceOf("Blob", j)) {
                                    h.append((b.type(d.paramName) === "array" && d.paramName[i]) || g, j, j.uploadName || j.name)
                                }
                            })
                        }
                    }
                    d.data = h
                }
            }
            d.blob = null
        },
        _initIframeSettings: function (c) {
            var d = b("<a></a>").prop("href", c.url).prop("host");
            c.dataType = "iframe " + (c.dataType || "");
            c.formData = this._getFormData(c);
            if (c.redirect && d && d !== location.host) {
                c.formData.push({name: c.redirectParamName || "redirect", value: c.redirect})
            }
        },
        _initDataSettings: function (c) {
            if (this._isXHRUpload(c)) {
                if (!this._chunkedUpload(c, true)) {
                    if (!c.data) {
                        this._initXHRData(c)
                    }
                    this._initProgressListener(c)
                }
                if (c.postMessage) {
                    c.dataType = "postmessage " + (c.dataType || "")
                }
            } else {
                this._initIframeSettings(c)
            }
        },
        _getParamName: function (c) {
            var d = b(c.fileInput), e = c.paramName;
            if (!e) {
                e = [];
                d.each(function () {
                    var f = b(this), g = f.prop("name") || "files[]", h = (f.prop("files") || [1]).length;
                    while (h) {
                        e.push(g);
                        h -= 1
                    }
                });
                if (!e.length) {
                    e = [d.prop("name") || "files[]"]
                }
            } else {
                if (!b.isArray(e)) {
                    e = [e]
                }
            }
            return e
        },
        _initFormSettings: function (c) {
            if (!c.form || !c.form.length) {
                c.form = b(c.fileInput.prop("form"));
                if (!c.form.length) {
                    c.form = b(this.options.fileInput.prop("form"))
                }
            }
            c.paramName = this._getParamName(c);
            if (!c.url) {
                c.url = c.form.prop("action") || location.href
            }
            c.type = (c.type || (b.type(c.form.prop("method")) === "string" && c.form.prop("method")) || "").toUpperCase();
            if (c.type !== "POST" && c.type !== "PUT" && c.type !== "PATCH") {
                c.type = "POST"
            }
            if (!c.formAcceptCharset) {
                c.formAcceptCharset = c.form.attr("accept-charset")
            }
        },
        _getAJAXSettings: function (d) {
            var c = b.extend({}, this.options, d);
            this._initFormSettings(c);
            this._initDataSettings(c);
            return c
        },
        _getDeferredState: function (c) {
            if (c.state) {
                return c.state()
            }
            if (c.isResolved()) {
                return "resolved"
            }
            if (c.isRejected()) {
                return "rejected"
            }
            return "pending"
        },
        _enhancePromise: function (c) {
            c.success = c.done;
            c.error = c.fail;
            c.complete = c.always;
            return c
        },
        _getXHRPromise: function (f, e, d) {
            var c = b.Deferred(), g = c.promise();
            e = e || this.options.context || g;
            if (f === true) {
                c.resolveWith(e, d)
            } else {
                if (f === false) {
                    c.rejectWith(e, d)
                }
            }
            g.abort = c.promise;
            return this._enhancePromise(g)
        },
        _addConvenienceMethods: function (g, f) {
            var d = this, c = function (e) {
                return b.Deferred().resolveWith(d, e).promise()
            };
            f.process = function (h, e) {
                if (h || e) {
                    f._processQueue = this._processQueue = (this._processQueue || c([this])).pipe(function () {
                        if (f.errorThrown) {
                            return b.Deferred().rejectWith(d, [f]).promise()
                        }
                        return c(arguments)
                    }).pipe(h, e)
                }
                return this._processQueue || c([this])
            };
            f.submit = function () {
                if (this.state() !== "pending") {
                    f.jqXHR = this.jqXHR = (d._trigger("submit", b.Event("submit", {delegatedEvent: g}), this) !== false) && d._onSend(g, this)
                }
                return this.jqXHR || d._getXHRPromise()
            };
            f.abort = function () {
                if (this.jqXHR) {
                    return this.jqXHR.abort()
                }
                this.errorThrown = "abort";
                d._trigger("fail", null, this);
                return d._getXHRPromise(false)
            };
            f.state = function () {
                if (this.jqXHR) {
                    return d._getDeferredState(this.jqXHR)
                }
                if (this._processQueue) {
                    return d._getDeferredState(this._processQueue)
                }
            };
            f.processing = function () {
                return !this.jqXHR && this._processQueue && d._getDeferredState(this._processQueue) === "pending"
            };
            f.progress = function () {
                return this._progress
            };
            f.response = function () {
                return this._response
            }
        },
        _getUploadedBytes: function (e) {
            var c = e.getResponseHeader("Range"), f = c && c.split("-"), d = f && f.length > 1 && parseInt(f[1], 10);
            return d && d + 1
        },
        _chunkedUpload: function (n, h) {
            n.uploadedBytes = n.uploadedBytes || 0;
            var g = this, e = n.files[0], f = e.size, c = n.uploadedBytes, d = n.maxChunkSize || f, j = this._blobSlice, k = b.Deferred(), m = k.promise(), i, l;
            if (!(this._isXHRUpload(n) && j && (c || d < f)) || n.data) {
                return false
            }
            if (h) {
                return true
            }
            if (c >= f) {
                e.error = n.i18n("uploadedBytes");
                return this._getXHRPromise(false, n.context, [null, "error", e.error])
            }
            l = function () {
                var q = b.extend({}, n), p = q._progress.loaded;
                q.blob = j.call(e, c, c + d, e.type);
                q.chunkSize = q.blob.size;
                q.contentRange = "bytes " + c + "-" + (c + q.chunkSize - 1) + "/" + f;
                g._initXHRData(q);
                g._initProgressListener(q);
                i = ((g._trigger("chunksend", null, q) !== false && b.ajax(q)) || g._getXHRPromise(false, q.context)).done(function (o, s, r) {
                    c = g._getUploadedBytes(r) || (c + q.chunkSize);
                    if (p + q.chunkSize - q._progress.loaded) {
                        g._onProgress(b.Event("progress", {
                            lengthComputable: true,
                            loaded: c - q.uploadedBytes,
                            total: c - q.uploadedBytes
                        }), q)
                    }
                    n.uploadedBytes = q.uploadedBytes = c;
                    q.result = o;
                    q.textStatus = s;
                    q.jqXHR = r;
                    g._trigger("chunkdone", null, q);
                    g._trigger("chunkalways", null, q);
                    if (c < f) {
                        l()
                    } else {
                        k.resolveWith(q.context, [o, s, r])
                    }
                }).fail(function (o, s, r) {
                    q.jqXHR = o;
                    q.textStatus = s;
                    q.errorThrown = r;
                    g._trigger("chunkfail", null, q);
                    g._trigger("chunkalways", null, q);
                    k.rejectWith(q.context, [o, s, r])
                })
            };
            this._enhancePromise(m);
            m.abort = function () {
                return i.abort()
            };
            l();
            return m
        },
        _beforeSend: function (d, c) {
            if (this._active === 0) {
                this._trigger("start");
                this._bitrateTimer = new this._BitrateTimer();
                this._progress.loaded = this._progress.total = 0;
                this._progress.bitrate = 0
            }
            this._initResponseObject(c);
            this._initProgressObject(c);
            c._progress.loaded = c.loaded = c.uploadedBytes || 0;
            c._progress.total = c.total = this._getTotal(c.files) || 1;
            c._progress.bitrate = c.bitrate = 0;
            this._active += 1;
            this._progress.loaded += c.loaded;
            this._progress.total += c.total
        },
        _onDone: function (c, h, g, e) {
            var f = e._progress.total, d = e._response;
            if (e._progress.loaded < f) {
                this._onProgress(b.Event("progress", {lengthComputable: true, loaded: f, total: f}), e)
            }
            d.result = e.result = c;
            d.textStatus = e.textStatus = h;
            d.jqXHR = e.jqXHR = g;
            this._trigger("done", null, e)
        },
        _onFail: function (e, g, f, d) {
            var c = d._response;
            if (d.recalculateProgress) {
                this._progress.loaded -= d._progress.loaded;
                this._progress.total -= d._progress.total
            }
            c.jqXHR = d.jqXHR = e;
            c.textStatus = d.textStatus = g;
            c.errorThrown = d.errorThrown = f;
            this._trigger("fail", null, d)
        },
        _onAlways: function (e, f, d, c) {
            this._trigger("always", null, c)
        },
        _onSend: function (i, g) {
            if (!g.submit) {
                this._addConvenienceMethods(i, g)
            }
            var h = this, k, c, j, d, l = h._getAJAXSettings(g), f = function () {
                h._sending += 1;
                l._bitrateTimer = new h._BitrateTimer();
                k = k || (((c || h._trigger("send", b.Event("send", {delegatedEvent: i}), l) === false) && h._getXHRPromise(false, l.context, c)) || h._chunkedUpload(l) || b.ajax(l)).done(function (e, n, m) {
                            h._onDone(e, n, m, l)
                        }).fail(function (e, n, m) {
                            h._onFail(e, n, m, l)
                        }).always(function (n, o, m) {
                            h._onAlways(n, o, m, l);
                            h._sending -= 1;
                            h._active -= 1;
                            if (l.limitConcurrentUploads && l.limitConcurrentUploads > h._sending) {
                                var e = h._slots.shift();
                                while (e) {
                                    if (h._getDeferredState(e) === "pending") {
                                        e.resolve();
                                        break
                                    }
                                    e = h._slots.shift()
                                }
                            }
                            if (h._active === 0) {
                                h._trigger("stop")
                            }
                        });
                return k
            };
            this._beforeSend(i, l);
            if (this.options.sequentialUploads || (this.options.limitConcurrentUploads && this.options.limitConcurrentUploads <= this._sending)) {
                if (this.options.limitConcurrentUploads > 1) {
                    j = b.Deferred();
                    this._slots.push(j);
                    d = j.pipe(f)
                } else {
                    this._sequence = this._sequence.pipe(f, f);
                    d = this._sequence
                }
                d.abort = function () {
                    c = [undefined, "abort", "abort"];
                    if (!k) {
                        if (j) {
                            j.rejectWith(l.context, c)
                        }
                        return f()
                    }
                    return k.abort()
                };
                return this._enhancePromise(d)
            }
            return f()
        },
        _onAdd: function (q, m) {
            var p = this, v = true, u = b.extend({}, this.options, m), f = m.files, s = f.length, g = u.limitMultiFileUploads, k = u.limitMultiFileUploadSize, t = u.limitMultiFileUploadSizeOverhead, o = 0, n = this._getParamName(u), d, c, r, l, h = 0;
            if (!s) {
                return false
            }
            if (k && f[0].size === undefined) {
                k = undefined
            }
            if (!(u.singleFileUploads || g || k) || !this._isXHRUpload(u)) {
                r = [f];
                d = [n]
            } else {
                if (!(u.singleFileUploads || k) && g) {
                    r = [];
                    d = [];
                    for (l = 0; l < s; l += g) {
                        r.push(f.slice(l, l + g));
                        c = n.slice(l, l + g);
                        if (!c.length) {
                            c = n
                        }
                        d.push(c)
                    }
                } else {
                    if (!u.singleFileUploads && k) {
                        r = [];
                        d = [];
                        for (l = 0; l < s; l = l + 1) {
                            o += f[l].size + t;
                            if (l + 1 === s || ((o + f[l + 1].size + t) > k) || (g && l + 1 - h >= g)) {
                                r.push(f.slice(h, l + 1));
                                c = n.slice(h, l + 1);
                                if (!c.length) {
                                    c = n
                                }
                                d.push(c);
                                h = l + 1;
                                o = 0
                            }
                        }
                    } else {
                        d = n
                    }
                }
            }
            m.originalFiles = f;
            b.each(r || f, function (e, i) {
                var j = b.extend({}, m);
                j.files = r ? i : [i];
                j.paramName = d[e];
                p._initResponseObject(j);
                p._initProgressObject(j);
                p._addConvenienceMethods(q, j);
                v = p._trigger("add", b.Event("add", {delegatedEvent: q}), j);
                return v
            });
            return v
        },
        _replaceFileInput: function (f) {
            var c = f.fileInput, d = c.clone(true), e = c.is(document.activeElement);
            f.fileInputClone = d;
            b("<form></form>").append(d)[0].reset();
            c.after(d).detach();
            if (e) {
                d.focus()
            }
            b.cleanData(c.unbind("remove"));
            this.options.fileInput = this.options.fileInput.map(function (g, h) {
                if (h === c[0]) {
                    return d[0]
                }
                return h
            });
            if (c[0] === this.element[0]) {
                this.element = d
            }
        },
        _handleFileTreeEntry: function (h, j) {
            var e = this, i = b.Deferred(), d = function (l) {
                if (l && !l.entry) {
                    l.entry = h
                }
                i.resolve([l])
            }, f = function (l) {
                e._handleFileTreeEntries(l, j + h.name + "/").done(function (m) {
                    i.resolve(m)
                }).fail(d)
            }, g = function () {
                k.readEntries(function (l) {
                    if (!l.length) {
                        f(c)
                    } else {
                        c = c.concat(l);
                        g()
                    }
                }, d)
            }, k, c = [];
            j = j || "";
            if (h.isFile) {
                if (h._file) {
                    h._file.relativePath = j;
                    i.resolve(h._file)
                } else {
                    h.file(function (l) {
                        l.relativePath = j;
                        i.resolve(l)
                    }, d)
                }
            } else {
                if (h.isDirectory) {
                    k = h.createReader();
                    g()
                } else {
                    i.resolve([])
                }
            }
            return i.promise()
        },
        _handleFileTreeEntries: function (c, e) {
            var d = this;
            return b.when.apply(b, b.map(c, function (f) {
                return d._handleFileTreeEntry(f, e)
            })).pipe(function () {
                return Array.prototype.concat.apply([], arguments)
            })
        },
        _getDroppedFiles: function (d) {
            d = d || {};
            var c = d.items;
            if (c && c.length && (c[0].webkitGetAsEntry || c[0].getAsEntry)) {
                return this._handleFileTreeEntries(b.map(c, function (f) {
                    var e;
                    if (f.webkitGetAsEntry) {
                        e = f.webkitGetAsEntry();
                        if (e) {
                            e._file = f.getAsFile()
                        }
                        return e
                    }
                    return f.getAsEntry()
                }))
            }
            return b.Deferred().resolve(b.makeArray(d.files)).promise()
        },
        _getSingleFileInputFiles: function (e) {
            e = b(e);
            var c = e.prop("webkitEntries") || e.prop("entries"), d, f;
            if (c && c.length) {
                return this._handleFileTreeEntries(c)
            }
            d = b.makeArray(e.prop("files"));
            if (!d.length) {
                f = e.prop("value");
                if (!f) {
                    return b.Deferred().resolve([]).promise()
                }
                d = [{name: f.replace(/^.*\\/, "")}]
            } else {
                if (d[0].name === undefined && d[0].fileName) {
                    b.each(d, function (g, h) {
                        h.name = h.fileName;
                        h.size = h.fileSize
                    })
                }
            }
            return b.Deferred().resolve(d).promise()
        },
        _getFileInputFiles: function (c) {
            if (!(c instanceof b) || c.length === 1) {
                return this._getSingleFileInputFiles(c)
            }
            return b.when.apply(b, b.map(c, this._getSingleFileInputFiles)).pipe(function () {
                return Array.prototype.concat.apply([], arguments)
            })
        },
        _onChange: function (f) {
            var c = this, d = {fileInput: b(f.target), form: b(f.target.form)};
            this._getFileInputFiles(d.fileInput).always(function (e) {
                d.files = e;
                if (c.options.replaceFileInput) {
                    c._replaceFileInput(d)
                }
                if (c._trigger("change", b.Event("change", {delegatedEvent: f}), d) !== false) {
                    c._onAdd(f, d)
                }
            })
        },
        _onPaste: function (f) {
            var c = f.originalEvent && f.originalEvent.clipboardData && f.originalEvent.clipboardData.items, d = {files: []};
            if (c && c.length) {
                b.each(c, function (e, h) {
                    var g = h.getAsFile && h.getAsFile();
                    if (g) {
                        d.files.push(g)
                    }
                });
                if (this._trigger("paste", b.Event("paste", {delegatedEvent: f}), d) !== false) {
                    this._onAdd(f, d)
                }
            }
        },
        _onDrop: function (g) {
            g.dataTransfer = g.originalEvent && g.originalEvent.dataTransfer;
            var c = this, f = g.dataTransfer, d = {};
            if (f && f.files && f.files.length) {
                g.preventDefault();
                this._getDroppedFiles(f).always(function (e) {
                    d.files = e;
                    if (c._trigger("drop", b.Event("drop", {delegatedEvent: g}), d) !== false) {
                        c._onAdd(g, d)
                    }
                })
            }
        },
        _onDragOver: a("dragover"),
        _onDragEnter: a("dragenter"),
        _onDragLeave: a("dragleave"),
        _initEventHandlers: function () {
            if (this._isXHRUpload(this.options)) {
                this._on(this.options.dropZone, {
                    dragover: this._onDragOver,
                    drop: this._onDrop,
                    dragenter: this._onDragEnter,
                    dragleave: this._onDragLeave
                });
                this._on(this.options.pasteZone, {paste: this._onPaste})
            }
            if (b.support.fileInput) {
                this._on(this.options.fileInput, {change: this._onChange})
            }
        },
        _destroyEventHandlers: function () {
            this._off(this.options.dropZone, "dragenter dragleave dragover drop");
            this._off(this.options.pasteZone, "paste");
            this._off(this.options.fileInput, "change")
        },
        _setOption: function (c, d) {
            var e = b.inArray(c, this._specialOptions) !== -1;
            if (e) {
                this._destroyEventHandlers()
            }
            this._super(c, d);
            if (e) {
                this._initSpecialOptions();
                this._initEventHandlers()
            }
        },
        _initSpecialOptions: function () {
            var c = this.options;
            if (c.fileInput === undefined) {
                c.fileInput = this.element.is('input[type="file"]') ? this.element : this.element.find('input[type="file"]')
            } else {
                if (!(c.fileInput instanceof b)) {
                    c.fileInput = b(c.fileInput)
                }
            }
            if (!(c.dropZone instanceof b)) {
                c.dropZone = b(c.dropZone)
            }
            if (!(c.pasteZone instanceof b)) {
                c.pasteZone = b(c.pasteZone)
            }
        },
        _getRegExp: function (e) {
            var d = e.split("/"), c = d.pop();
            d.shift();
            return new RegExp(d.join("/"), c)
        },
        _isRegExpOption: function (c, d) {
            return c !== "url" && b.type(d) === "string" && /^\/.*\/[igm]{0,3}$/.test(d)
        },
        _initDataAttributes: function () {
            var d = this, c = this.options, e = this.element.data();
            b.each(this.element[0].attributes, function (g, f) {
                var h = f.name.toLowerCase(), i;
                if (/^data-/.test(h)) {
                    h = h.slice(5).replace(/-[a-z]/g, function (j) {
                        return j.charAt(1).toUpperCase()
                    });
                    i = e[h];
                    if (d._isRegExpOption(h, i)) {
                        i = d._getRegExp(i)
                    }
                    c[h] = i
                }
            })
        },
        _create: function () {
            this._initDataAttributes();
            this._initSpecialOptions();
            this._slots = [];
            this._sequence = this._getXHRPromise(true);
            this._sending = this._active = 0;
            this._initProgressObject(this);
            this._initEventHandlers()
        },
        active: function () {
            return this._active
        },
        progress: function () {
            return this._progress
        },
        add: function (d) {
            var c = this;
            if (!d || this.options.disabled) {
                return
            }
            if (d.fileInput && !d.files) {
                this._getFileInputFiles(d.fileInput).always(function (e) {
                    d.files = e;
                    c._onAdd(null, d)
                })
            } else {
                d.files = b.makeArray(d.files);
                this._onAdd(null, d)
            }
        },
        send: function (g) {
            if (g && !this.options.disabled) {
                if (g.fileInput && !g.files) {
                    var e = this, c = b.Deferred(), h = c.promise(), d, f;
                    h.abort = function () {
                        f = true;
                        if (d) {
                            return d.abort()
                        }
                        c.reject(null, "abort", "abort");
                        return h
                    };
                    this._getFileInputFiles(g.fileInput).always(function (i) {
                        if (f) {
                            return
                        }
                        if (!i.length) {
                            c.reject();
                            return
                        }
                        g.files = i;
                        d = e._onSend(null, g);
                        d.then(function (j, l, k) {
                            c.resolve(j, l, k)
                        }, function (j, l, k) {
                            c.reject(j, l, k)
                        })
                    });
                    return this._enhancePromise(h)
                }
                g.files = b.makeArray(g.files);
                if (g.files.length) {
                    return this._onSend(null, g)
                }
            }
            return this._getXHRPromise(false, g && g.context)
        }
    })
})(jQuery);

(function () {
    var Plugin, _init;
    var _animateTime, _eventBind, _addTime, _cancelAddTime, _renderEasySearch, _renderQuickSearch,
        _renderInputPlace, _renderConditionList, _addToConditionList, _removeFromConditionList,
        _refreshConditionNum, _getSelectedConditionFromForm, _renderAdvanceSearchForm, _getSelectedConditionFromModal,
        _getSearchCondition, _findModel, _getConditionFromForm, _initSchema, _closeSchema, _renderFixedSchema, _schemaDialogEventBind,
        _refreshUnfixNum;

    /**
     * @module emapAdvancedQuery
     * @description 高级搜索, 通过监听search事件，进行搜索操作
     * @example
     $('#advancedQueryPlaceholder').emapAdvancedQuery({
        data: searchData
    });
    $('#advancedQueryPlaceholder').on('search', function(e, data, opts){
        // data 为序列化的搜索条件
        console.log(data);
        //调用表格reload方法
        $("#retirementInfoTable").emapdatatable('reload', {querySetting: JSON.stringify(data)});
    });
     */
    Plugin = (function () {
        function Plugin(element, options) {
            this.options = $.extend({}, $.fn.emapAdvancedQuery.defaults, options);
            this.$element = $(element);
            this.$element.attr("emap-role", "advancedQuery").attr("emap-pagePath", "").attr("emap-action", this.options.data.name);
            this.options._initCount = 0; // 需要初始化的控件的总数
            this.options._initCounter = 0; // 控件初始化计数器
            _init(this.$element, this.options);
        }

        /**
         * @method getValue
         * @description 获取高级搜索当前的搜索条件
         * @return {Stirng} 搜索条件Json字符串
         */
        Plugin.prototype.getValue = function () {
            return _getSearchCondition(this.options);
        };
        /**
         * @method setValue
         * @description 高级搜索赋值
         * @param {Object|String} 搜索条件
         */
        Plugin.prototype.setValue = function (condition) {
            var element = this.$element;
            this.$element.emapAdvancedQuery('clear');
            var value = (typeof condition == "string") ? JSON.parse(condition) : condition;
            if (value.length > 0) {
                var formValue = {};
                $(value).each(function () {
                    if ($.isArray(this)) {
                        // 数组
                        $('[bh-advanced-query-role=advancedInput]', element).val(this[0].value);
                    } else {
                        if (formValue.hasOwnProperty(this.name)) {
                            if (this.builder === 'moreEqual') {
                                formValue[this.name] = this.value + ',' + formValue[this.name];
                                if (this.value_display) {
                                    formValue[this.name + '_DISPLAY'] =  this.value_displayformValue+ ',' + [this.name + '_DISPLAY'];
                                }
                            }
                            if (this.builder === 'lessEqual') {
                                formValue[this.name] = formValue[this.name]+ ',' +  this.value ;
                                if (this.value_display) {
                                    formValue[this.name + '_DISPLAY'] = formValue[this.name + '_DISPLAY'] + ',' + this.value_display;
                                }
                            }
                        } else {
                            formValue[this.name] = this.value;
                            if (this.value_display) {
                                formValue[this.name + '_DISPLAY'] = this.value_display;
                            }
                        }
                    }
                });
                _renderAdvanceSearchForm(this.options, formValue);
                WIS_EMAP_INPUT.formSetValue(element, formValue, this.options);
            }
        };

        /**
         * @method clear
         * @description 清空高级搜索条件
         */
        Plugin.prototype.clear = function () {
            var element = this.$element;
            var options = this.options;
            // 清空高级搜索
            $('[bh-advanced-query-role=advancedInput]', element).val('');
            $('[bh-advanced-query-role=advanceSearchForm] [xtype]', element).each(function () {
                var _this = $(this);
                var name = _this.data('name');
                var xtype = _this.attr('xtype');
                WIS_EMAP_INPUT.setValue(_this, name, xtype, "", options.contextPath);
            });
            // 清空简单搜索
            $('.bh-advancedQuery-quick-search-wrap input[type=text]', element).val('');
            $('[bh-advanced-query-role="quickSearchForm"] [xtype]', element).each(function () {
                var _this = $(this);
                var name = _this.data('name');
                var xtype = _this.attr('xtype');
                WIS_EMAP_INPUT.setValue(_this, name, xtype, "", options.contextPath);
            });
        };

        /**
         * @method updateTotalNum
         * @description 刷新全部数据条数
         */
        Plugin.prototype.updateTotalNum = function (num) {
            if (!this.options.showTotalNum) return;
            var numWrap = $('.bh-advancedQuery-totalNum-wrap', this.$element);
            if (numWrap.css('display') == 'none') {
                numWrap.show();
            }
            $('.bh-advancedQuery-totalNum span', numWrap).text(num);
        };

        return Plugin;
    })();

    _init = function (element, options) {
        element.attr("emap", JSON.stringify({
            "emap-url": WIS_EMAP_SERV.url,
            "emap-name": WIS_EMAP_SERV.name,
            "emap-app-name": WIS_EMAP_SERV.appName,
            "emap-model-name": WIS_EMAP_SERV.modelName
        }));
        delete WIS_EMAP_SERV.url;
        delete WIS_EMAP_SERV.name;
        delete WIS_EMAP_SERV.appName;
        delete WIS_EMAP_SERV.modelName;
        // contextPath 兼容
        options.contextPath = options.contextPath || WIS_EMAP_SERV.getContextPath();
        var modalData = options.data.controls;
        var easyArray = [];
        var quickArray = [];
        var guid = BH_UTILS.NewGuid();

        _animateTime = function () {
            return 450;
        };

        _eventBind = function (options, element) {
            var $advanced = options.$advanced;
            var $advancedModal = options.$advancedModal;
            $advanced.on("click", "[bh-advanced-query-role=addTime]", function () {
                _addTime($(this));
            });

            $advanced.on("click", "[bh-advanced-query-role=cancelAddTime]", function () {
                _cancelAddTime($(this));
            });

            // 展开高级搜索
            $advanced.on("click", "[bh-advanced-query-role=advancedOpen]", function () {
                $($advanced).addClass('bh-active');
                options.searchModel = 'advanced';
                if (document.documentMode == 9 && $.fn.placeholder) {
                    setTimeout(function () {
                        WIS_EMAP_INPUT.placeHolder();
                    }, 300);
                }
                WIS_EMAP_SERV && WIS_EMAP_SERV._resetPageFooter();
            });

            // 关闭高级搜索
            $advanced.on("click", "[bh-advanced-query-role=advancedClose]", function (event) {
                $($advanced).removeClass('bh-active');
                options.searchModel = 'easy';
                // 关闭高级搜索时, 清空高级搜索  6-1 zhuhui
                element.emapAdvancedQuery('clear');
                // 关闭高级搜索时, 触发一次简单搜索 5-13 zhuhui
                element.trigger('search', [_getSearchCondition(options, $(this).data('name')), options, event]);
                WIS_EMAP_SERV && WIS_EMAP_SERV._resetPageFooter();
            });

            // 删除搜索条件
            $advanced.on("click", "[bh-advanced-query-role=conditionDismiss]", function () {
                // 针对日期范围选择组件，删除时连同 范围选择的弹出框一同清除
                var inputRow = $(this).closest('.bh-advancedQuery-form-row');
                var inputItem = $('[xtype]', inputRow);
                if (inputItem.length && inputItem.attr('xtype') == 'date-range') {
                    inputItem.bhTimePicker('remove');
                }
                inputRow.remove();

            });

            // 弹出  添加搜索条件 弹框
            $advanced.on("click", "[bh-advanced-query-role=addCondition]", function () {
                _renderConditionList(options);
                var win = $("[bh-advanced-query-role=addDialog][data-guid=" + options.guid + "]");
                win.jqxWindow({
                    position: [window.innerWidth / 2 - 800 / 2, window.innerHeight / 2 + $(window).scrollTop() - 200]
                });
                win.jqxWindow('open');
                var addList = win.find('[bh-advanced-query-role=addList]');
                addList.prev().find('input').prop('checked', addList.find('li:visible input:not(:disabled):not(:checked)').length === 0);
            });

            // 添加完成 添加搜索条件 弹框
            $advancedModal.on("click", "[bh-advanced-query-role=addDialogConfirm]", function () {
                //获取已选字段
                _renderAdvanceSearchForm(options, _getSelectedConditionFromModal(options));
                $("[bh-advanced-query-role=addDialog]").jqxWindow('close');
                setTimeout(function () {
                    // 若表单字段有变动则 弹出tip 弹窗
                    if (options._changeCounter > 0) {
                        $.bhTip && $.bhTip({
                            content: '添加成功',
                            state: 'success',
                            iconClass: 'icon-checkcircle'
                        });
                    }
                }, 300);
            });

            //添加搜索条件，全选功能
            $advancedModal.on('change', 'input[bh-advanced-query-rol="selectAllField"]', function () {
                $(this).closest('.bh-checkbox').next().find('li:visible input:not(:disabled)').prop('checked', $(this).prop('checked'));
            });

            $advancedModal.on('change', 'li:visible input:not(:disabled)', function () {
                var $list = $(this).closest('.bh-advancedQuery-dialog-list');
                if (!$(this).prop('checked')) {
                    $list.prev().find('input').prop('checked', false);
                } else {
                    var isAllChecked = true;
                    $list.find('li:visible input:not(:disabled)').each(function () {
                        if (!$(this).prop('checked')) {
                            isAllChecked = false;
                            return false;
                        }
                    });
                    $list.prev().find('input').prop('checked', isAllChecked);
                }
            });

            // 关闭 添加搜索条件弹框
            $advancedModal.on("click", "[bh-advanced-query-role=addDialogCancel]", function () {
                $("[bh-advanced-query-role=addDialog]").jqxWindow('close');
            });

            // 选择添加字段 向右添加按钮
            $advancedModal.on('click', '[bh-advanced-query-role=modalListRightBtn]', function () {
                _addToConditionList();
            });

            // 选择添加字段 向左添加按钮
            $advancedModal.on('click', '[bh-advanced-query-role=modalListLeftBtn]', function () {
                _removeFromConditionList();
            });

            // easy搜索 监听 按键输入
            $advanced.on('keyup', '.bh-advancedQuery-quick-search-wrap input[type=text]', function (e) {
                var easySelectH = $advanced.data('easyarray').length * 28 + 1; // 下拉框高度
                var easySelectW = $(this).outerWidth(); // 下拉框宽度
                var searchValue = $(this).val();
                var pos = $(this).offset();
                var selectDiv = $('.bh-advancedQuery-quick-select[data-guid=' + options.guid + ']');
                pos.top += 28;
                // 回车快速搜索
                if (e.keyCode == 13) {
                    selectDiv.css({
                        'height': 0,
                        'border-width': '0'
                    });
                    element.trigger('search', [_getSearchCondition(options), options, e]);
                    return;
                }
                if (searchValue == '') {
                    selectDiv.css({
                        'height': 0,
                        'border-width': '0'
                    });
                } else {
                    $('.bh-advancedQuery-easy-query', selectDiv).html(searchValue);
                    selectDiv.css({
                        'height': easySelectH + 'px',
                        'width': easySelectW + 'px',
                        'border-width': '1px',
                        'top': pos.top,
                        'left': pos.left
                    });
                }
            });

            // 点击下拉快速搜索
            $('[bh-advanced-query-role=advancedEasySelect][data-guid=' + options.guid + ']').on('click', 'p', function (event) {
                var selectDiv = $(this).closest('[bh-advanced-query-role=advancedEasySelect]');
                if (selectDiv.height() > 0) {
                    selectDiv.css({
                        'height': 0,
                        'border-width': '0'
                    });
                }
                element.trigger('search', [_getSearchCondition(options, $(this).data('name')), options, event]);
            });

            // 点击搜索按钮  easy search
            $advanced.on('click', '[bh-advanced-query-role=easySearchBtn]', function (event) {
                element.trigger('search', [_getSearchCondition(options), options, event]);
            });

            // 点击筛选条件  quick search
            $advanced.on('click', '[bh-advanced-query-role=quickSearchForm] .bh-label-radio', function (event) {
                // radio 的事件冒泡问题
                setTimeout(function () {
                    element.trigger('search', [_getSearchCondition(options), options, event]);
                }, 200);
            });

            //监听普通搜索里时间选择框selected事件
            $advanced.on('selectedTime', '.bh-advancedQuery-quick div[xtype="date-range"]', function (event) {
                var searchCondition = _getSearchCondition(options);
                element.trigger('search', [searchCondition, options, event]);
            });

            // 执行高级搜索
            $advanced.on('click', '[bh-advanced-query-role=advancedSearchBtn]', function (event) {
                _getSearchCondition(options);
                element.trigger('search', [_getSearchCondition(options), options, event]);
            });

            $advancedModal.on('click', function (e) {
                var target = e.target;
                if ($(target).closest('.bh-advancedQuery-quick-search-wrap').length == 0) {
                    $('.bh-advancedQuery-quick-select').css({
                        'height': 0,
                        'border-width': '0'
                    });
                }
            });

            // 监听 控件初始化事件  bhInputInitComplete, 根据计数器options._initCounter 判断出发高级搜索组件的 初始化回调
            element.one('_init', function () {
                element.trigger('init', [options]);
                options.initComplete && options.initComplete();
            });

            // easySearch 下拉框的关闭
            $(document).on('click', function (e) {
                var target = e.target;
                if ($(target).closest('[bh-advanced-query-role=advancedEasySelect]').length == 0) {
                    var selectDiv = $('.bh-advancedQuery-quick-select');
                    selectDiv.css({
                        'height': 0,
                        'border-width': '0'
                    })
                }
            });

            // 点击保存为搜索方案
            $advanced.on('click', '[bh-advanced-query-role=saveSchema]', function () {
                $(this).closest('.bh-schema-btn-wrap').addClass('active');
            });

            // 点击取消保存搜索方案
            $advanced.on('click', '[bh-advanced-query-role=saveSchemaCancel]', function () {
                _closeSchema(options);
            });

            // 点击确认保存搜索方案
            $advanced.on('click', '[bh-advanced-query-role=saveSchemaConfirm]', function () {
                var name = $('.bh-schema-name-input', $advanced).val();
                var conditionData = _getSearchCondition(options, undefined, true);
                var fixed = $('[bh-schema-role=fixCheckbox]', $advanced).prop('checked') ? 1 : 0;
                var programContainer = $('.bh-rules-program', $advanced);
                element.emapSchema('saveSchema', [name, conditionData, fixed]).done(function () {
                    _closeSchema(options);
                    var schInfo = options.schemaList.filter(function (val) {
                        return val.SCHEMA_NAME == name;
                    })
                    var sameSch = false;
                    if (schInfo.length > 0) {
                        sameSch = true;
                    }
                    // 判断是否有重名的方案  如果有  直接覆盖
                    if (sameSch) {
                        // 重名方案
                        options.schemaList.filter(function (val) {
                            if (val.SCHEMA_NAME == name) {
                                val.CONTENT = conditionData;
                                val.FIXED = fixed;
                            }
                        })
                    } else {
                        schInfo = {
                            "CONTENT": conditionData,
                            "SCHEMA_NAME": name,
                            "FIXED": fixed
                        };
                        options.schemaList.push(schInfo);
                    }
                    if (fixed == 1) {
                        if (sameSch) {
                            // 固定方案中的重名方案
                            $('.bh-rules-program a[data-name=' + name + ']', element).data('info', {
                                "CONTENT": conditionData,
                                "SCHEMA_NAME": name,
                                "FIXED": fixed
                            });
                        } else {
                            var sch = $('<a  data-name="' + name + '" href="javascript:void(0)">' + name + '</a>');
                            sch.data('info', schInfo);
                            $('.bh-rules-program [bh-schema-role=more]', element).before(sch);

                        }
                    } else {
                        var sch = $('.bh-rules-program', element).find('a[data-name=' + name + ']');
                        if (sch.length > 0) {
                            sch.remove()
                        }
                    }
                    programContainer.show();
                }).fail(function (res) {
                    console && console.log(res)
                });
            });

            // 点击方案的 更多按钮 呼出方案列表侧边弹窗
            $advanced.on('click', '[bh-schema-role=more]', function () {
                if ($('main > article aside').length == 0) {
                    $('main > article').append('<aside></aside>');
                }
                $.bhPropertyDialog.show({
                    // "title": "高级搜索方案", //侧边栏的标题
                    "content": '<h3>高级搜索方案</h3>' +
                        '<section>' +
                        '<div id="schemaDialog" style="display: none;">' +
                        '<p class="bh-color-caption">置顶方案(将直接出现在搜索栏上)</p>' +
                        '<ul class="bh-schema-list" bh-schema-role="fixedUl">' +
                        '</ul>' +
                        '<p class="bh-color-caption">其他方案(<span>4</span>)</p>' +
                        '<ul class="bh-schema-list" bh-schema-role="unFixedUl"></ul>' +
                        '</div>' +
                        '</section>', //侧边栏的内容html
                    "footer": '', //侧边栏的页脚按钮
                    ready: function () { //初始化完成后的处理
                        var fixedUl = $('[bh-schema-role=fixedUl]');
                        var unFixedUl = $('[bh-schema-role=unFixedUl]');
                        $(options.schemaList).each(function () {
                                var liHtml;
                                liHtml = $('<li data-name="' + this.SCHEMA_NAME + '">' +
                                    '<a href="javascript:void(0)" class="bh-pull-right" bh-schema-role="delete">删除</a>' +
                                    '<a href="javascript:void(0)" class="bh-pull-right" bh-schema-role="unfixed">取消置顶</a>' +
                                    '<a href="javascript:void(0)" class="bh-pull-right" bh-schema-role="fixed">置顶</a>' +
                                    this.SCHEMA_NAME +
                                    '</li>').data('info', this);
                                if (this.FIXED == 1) {
                                    fixedUl.append(liHtml);
                                } else {
                                    unFixedUl.append(liHtml);
                                }
                                _refreshUnfixNum(unFixedUl);
                            })
                            // 处理保存方案的排序
                        var fixedSchema = $('.bh-rules-program a:not([bh-schema-role="more"])', options.$advanced);
                        if (fixedSchema.length > 0) {
                            fixedSchema.each(function () {
                                var condition
                                var schemaName = $(this).data('info').SCHEMA_NAME;
                                fixedUl.append($('li[data-name=' + schemaName + ']'));
                            });
                        }
                        if (options.schemaList.length == 0) {
                            $('#schemaDialog').length > 0 && $('#schemaDialog').hide()
                        } else {
                            $('#schemaDialog').length > 0 && $('#schemaDialog').show()
                        }
                        _schemaDialogEventBind(element, options);
                    }
                });
            })

            // 点击快速方案
            $advanced.on('click', '.bh-rules-program a:not([bh-schema-role=more])', function (event) {
                var condition = $(this).data('info');
                element.emapAdvancedQuery('setValue', condition.CONTENT);
                element.trigger('search', [JSON.stringify(filterCondition(condition.CONTENT)), options, event]);
                $.bhTip && $.bhTip({
                    content: condition.SCHEMA_NAME + ' 方案执行成功',
                    state: 'success',
                    iconClass: 'icon-checkcircle'
                });
            });

            // 点击清空按钮
            $advanced.on('click', '[bh-advanced-query-role=clearBtn]', function (event) {
                $(element).emapAdvancedQuery('clear');
                element.trigger('search', [_getSearchCondition(options), options, event]);
            });
        };

        // 更新未置顶的方案个数
        _refreshUnfixNum = function (ul) {
            var count = $('li', ul).length;
            ul.prev('p').find('span').html(count);
            if (count == 0) {
                ul.hide().prev('p').hide()
            } else {
                ul.show().prev('p').show()
            }
            var fixedUl = $(ul).siblings('[bh-schema-role=fixedUl]');
            if ($('li', fixedUl).length == 0) {
                fixedUl.hide().prev('p').hide();
            } else {
                fixedUl.show().prev('p').show();
            }
        };

        _addTime = function ($item) {
            var $groupParent = $item.closest(".bh-advancedQuery-addBlock");
            $groupParent.addClass("bh-active");
            var $addTime = $groupParent.children("div[bh-advanced-query-role=addTime]");
            $groupParent.children("div[bh-advanced-query-role=addTimeGroup]").show();
            $addTime.hide();
        };

        _cancelAddTime = function ($item) {
            var $groupParent = $item.closest(".bh-advancedQuery-addBlock");
            $groupParent.removeClass("bh-active");
            var $addTimeGroup = $groupParent.children("div[bh-advanced-query-role=addTimeGroup]");
            $addTimeGroup.removeClass("bh-entryLeft").addClass("bh-outLeft");
            $groupParent.children("div[bh-advanced-query-role=addTime]").addClass("bh-entryRight").show();
            setTimeout(function () {
                $addTimeGroup.removeClass("bh-outLeft").addClass("bh-entryLeft").hide();
            }, _animateTime());
        };

        _renderEasySearch = function (easyArray, options) {
            var easySearch = '';
            var easySearchPlaceholder = ''; // easySearch 文本框placeholder
            if (easyArray.length && easyArray.length > 0) {
                easySearchPlaceholder += '请输入';
                $(easyArray).each(function () {
                    easySearchPlaceholder += this.caption + '/';
                    easySearch += '<p data-name="' + this.name + '">搜索 <span class="bh-advancedQuery-easy-caption">' + this.caption + '</span> : <span class="bh-advancedQuery-easy-query"></span></p>';
                });
                $('.bh-advancedQuery-quick-select[data-guid=' + options.guid + ']').html(easySearch);
                easySearchPlaceholder = easySearchPlaceholder.substring(0, easySearchPlaceholder.length - 1);
                $('.bh-advancedQuery-quick-search-wrap input[type=text]', options.$advanced).attr('placeholder', easySearchPlaceholder);
            } else {
                $('.bh-advancedQuery-inputGroup', options.$advanced).hide();
            }
        };

        _renderQuickSearch = function (quickArray) {
            var quickSearchHtml = $('<div></div>');
            $(quickArray).each(function (i) {
                // 应业务线需求将快速搜索中的多选下拉放出  不做类型转换  zhuhui 0722
                if (this.xtype == 'select' || this.xtype == 'radiolist' || this.xtype == 'checkboxlist' || this.xtype == 'multi-select2') {
                    this.xtype = 'buttonlist';
                }
                // 添加 quickSearchXtype属性, 表示字段在 快速搜索中展示的类型 zhuhui 0725
                if (this['search.quickSearchXtype']) {
                    this.xtype = this['search.quickSearchXtype'];
                }
                quickSearchHtml.append(_renderInputPlace(this));
            });
            return quickSearchHtml;
        };

        _renderInputPlace = function (item, showClose) {
            //showClose  是否显示 关闭按钮
            var _this = item;
            _this.get = function (attr) {
                if (_this['search.' + attr] !== undefined) {
                    return _this['search.' + attr];
                } else {
                    return _this[attr];
                }
            };
            var xtype = _this.get("xtype");
            var caption = _this.get("caption");
            var builder = _this.get("defaultBuilder");
            var url = _this.get("url");
            var name = _this.get("name");
            var hidden = _this.get("hidden") ? "hidden" : "";
            var placeholder = _this.get("placeholder") ? _this.get("placeholder") : "";
            var checkType = _this.get("checkType");
            var checkSize = _this.get("checkSize");
            var dataSize = _this.get("dataSize");
            var checkExp = _this.get("checkExp");
            var JSONParam = _this.get("JSONParam");
            var format = _this.get("format") ? _this.get("format") : 'yyyy-MM-dd';
            var controlHtml = $(' <div class="bh-advancedQuery-form-row bh-advancedQuery-h-28">' +
                '<div class="bh-advancedQuery-groupName">' + caption + '：</div>' +
                '<div class="bh-advancedQuery-groupList bh-label-radio-group">' +
                '</div>' +
                '</div>');

            if (showClose) {
                controlHtml.append('<a class="bh-bh-advancedQuery-group-dismiss" bh-advanced-query-role="conditionDismiss"> ' +
                    '<i class="icon-close iconfont"></i>' +
                    '</a>');
            }
            var inputHtml = '';
            switch (xtype) {

                case "tree":
                case "multi-tree":
                    inputHtml += '<div xtype="{{xtype}}" data-name="{{name}}" data-builder="{{builder}}" data-caption="{{caption}}" data-url="{{url}}" {{hidden}} style="max-width: 300px;"></div>';
                    break;
                case "date-local":
                case "date-range":
                    inputHtml += '<div xtype="{{xtype}}" data-builder="{{builder}}" data-caption="{{caption}}" data-name="{{name}}" data-format="{{format}}" {{hidden}} style="max-width: 300px;"></div>';
                    break;
                case "date-ym":
                    inputHtml += '<div xtype="{{xtype}}" data-builder="{{builder}}" data-caption="{{caption}}" data-name="{{name}}" data-format="yyyy-MM" {{hidden}}></div>';
                    break;
                case "date-full":
                    inputHtml += '<div xtype="{{xtype}}" data-builder="{{builder}}" data-caption="{{caption}}" data-name="{{name}}" data-format="yyyy-MM-dd HH:mm" {{hidden}}></div>';
                    break;
                case "switcher":
                    inputHtml += '<div xtype="{{xtype}}"  data-builder="{{builder}}" data-caption="{{caption}}" data-name="{{name}}" {{hidden}}></div>';
                    break;
                case "radiolist":
                    inputHtml += '<div xtype="{{xtype}}" data-name="{{name}}" class="bh-radio" data-url="{{url}}" data-builder="{{builder}}" data-caption="{{caption}}" {{hidden}}></div>';
                    break;
                case "checkboxlist":
                    inputHtml += '<div xtype="{{xtype}}" data-name="{{name}}" class="bh-checkbox" data-url="{{url}}" data-builder="{{builder}}" data-caption="{{caption}}" {{hidden}}></div>';
                    break;
                case "buttonlist":
                case "multi-buttonlist":
                    inputHtml += '<div xtype="{{xtype}}" data-name="{{name}}" data-url="{{url}}" data-builder="{{builder}}" data-alloption={{allOption}} data-caption="{{caption}}" {{hidden}} ></div>';
                    break;
                case "select":
                case "multi-select":
                case "multi-select2":
                    inputHtml += '<div xtype="{{xtype}}" data-name="{{name}}" data-url="{{url}}" data-builder="{{builder}}" data-alloption={{allOption}} data-caption="{{caption}}" {{hidden}} style="max-width: 300px;"></div>';
                    break;
                case 'number':
                case 'number-range':
                    inputHtml += '<div xtype="{{xtype}}" data-name="{{name}}" data-url="{{url}}" data-builder="{{builder}}" data-caption="{{caption}}" {{hidden}} style="max-width: 300px;"></div>';
                    break;
                default:
                    inputHtml += '<input class="bh-form-control" data-name="{{name}}" name="{{name}}" data-builder="{{builder}}" data-caption="{{caption}}" xtype="text" type="text" {{hidden}} />';
                    break;
            }
            inputHtml = inputHtml.replace(/\{\{xtype\}\}/g, xtype)
                .replace(/\{\{name\}\}/g, name)
                .replace(/\{\{builder\}\}/g, builder)
                .replace(/\{\{caption\}\}/g, caption)
                .replace(/\{\{url\}\}/g, url)
                .replace(/\{\{hidden\}\}/g, (hidden ? 'style="display:none;"' : ''))
                .replace(/\{\{allOption\}\}/g, options.allowAllOption)
                .replace(/\{\{format\}\}/g, format);
            inputHtml = $(inputHtml);
            if (JSONParam) {
                inputHtml.data('jsonparam', JSONParam);
            }
            $('.bh-advancedQuery-groupList', controlHtml).html(inputHtml);
            return controlHtml;
        };

        _getSelectedConditionFromForm = function (options) {
            var selectedForm = $('[bh-advanced-query-role=advanceSearchForm]', options.$advanced);
            var selectedArr = [];
            $('[xtype][data-name]', selectedForm).each(function () {
                selectedArr.push($(this).data('name'));
            });
            return selectedArr;
        };

        _renderConditionList = function (options) {
            var modalArray = options.$advanced.data('modalarray');
            // 获取已选condition 数据
            var selectedArr = _getSelectedConditionFromForm(options);
            if (modalArray.length && modalArray.length > 0) {
                var addList = $('[bh-advanced-query-role=addList]', options.$advancedModal);
                var itemHtml = '';
                $(modalArray).each(function () {
                    if ($.inArray(this.name, selectedArr) > -1) {
                        //已添加字段
                        itemHtml += ' <li>' +
                            '<div class="bh-checkbox"><label><input type="checkbox" name="' + this.name + '" data-caption="' + this.caption + '" checked>' +
                            '<i class="bh-choice-helper"></i>' + this.caption +
                            '</label></div>' +
                            '</li>';
                    } else {
                        //未添加字段
                        itemHtml += ' <li>' +
                            '<div class="bh-checkbox"><label><input type="checkbox" name="' + this.name + '" data-caption="' + this.caption + '">' +
                            '<i class="bh-choice-helper"></i>' + this.caption +
                            '</label></div>' +
                            '</li>';
                    }
                });
                var remainder = modalArray.length % 6;
                if (remainder) {
                    var num = 6 - remainder;
                    for (var i = 0; i < num; i++) {
                        itemHtml += '<li></li>';
                    }
                }
                addList.html(itemHtml);
                _refreshConditionNum();
            }
        };

        // 添加搜索字段
        _addToConditionList = function () {
            var addList = $('[bh-advanced-query-role=addList]', options.$advancedModal);
            var addedList = $('[bh-advanced-query-role=addedList]', options.$advancedModal);
            var itemHtml = '';
            var inputArr = $('input[type=checkbox]:checked', addList);
            if (inputArr.length > 0) {
                inputArr.each(function () {
                    var name = $(this).attr('name');
                    var caption = $(this).data('caption');
                    itemHtml += ' <li>' +
                        '<div class="bh-checkbox"><label><input type="checkbox" name="' + name + '" data-caption="' + caption + '">' +
                        '<i class="bh-choice-helper"></i>' + caption +
                        '</label></div>' +
                        '</li>';
                    $(this).closest('li').remove();
                });
                addedList.append(itemHtml);
                _refreshConditionNum();
            }
        };

        // 移除已选字段
        _removeFromConditionList = function () {
            var addList = $('[bh-advanced-query-role=addList]', options.$advancedModal);
            var addedList = $('[bh-advanced-query-role=addedList]', options.$advancedModal);
            var itemHtml = '';
            var inputArr = $('input[type=checkbox]:checked', addedList);
            if (inputArr.length > 0) {
                inputArr.each(function () {
                    var name = $(this).attr('name');
                    var caption = $(this).data('caption');
                    itemHtml += ' <li>' +
                        '<div class="bh-checkbox"><label><input type="checkbox" name="' + name + '" data-caption="' + caption + '">' +
                        '<i class="bh-choice-helper"></i>' + caption +
                        '</label></div>' +
                        '</li>';
                    $(this).closest('li').remove();
                });
                addList.append(itemHtml);
                _refreshConditionNum();
            }
        };

        // 刷新弹框内字段数量展示
        _refreshConditionNum = function () {
            var addList = $('[bh-advanced-query-role=addList]', options.$advancedModal);
            var addedList = $('[bh-advanced-query-role=addedList]', options.$advancedModal);
            var addCount = $('input[type=checkbox]', addList).length;
            var addedCount = $('input[type=checkbox]', addedList).length;
            $('.bh-advancedQuery-dialog-list-head span', addList).html(addCount);
            $('.bh-advancedQuery-dialog-list-head span', addedList).html(addedCount);
        };

        _getSelectedConditionFromModal = function (options) {
            var itemList = $('[bh-advanced-query-role=addList]', options.$advancedModal);
            var inputArr = $('input[type=checkbox]:checked', itemList);
            var item = {};
            $(inputArr).each(function () {
                var name = $(this).attr('name');
                item[name] = "";
            });
            return item;
        };

        // 渲染高级搜索表单
        _renderAdvanceSearchForm = function (options, selectedObj) {
            var advanceForm = $('[bh-advanced-query-role=advanceSearchForm]', options.$advanced);
            var btnWrap = $('[bh-advanced-query-role=dropDownBtnWrap]', advanceForm);
            options._changeCounter = 0; // 记录改变的字段的数量，如果有改动，则在渲染完成后弹出 成功的 tip
            $(options.$advanced.data('modalarray')).each(function () {
                var _this = this;
                var formItem = $('[data-name=' + this.name + ']', advanceForm);
                if (selectedObj[this.name] !== undefined && selectedObj[this.name] != null) {
                    if (formItem.length > 0) {
                        // 表单已有字段
                        return true;
                    } else {
                        // 表单添加字段
                        options._changeCounter++;
                        btnWrap.before(_renderInputPlace(this, true));
                    }
                } else {
                    if (formItem.length > 0) {
                        // 表单删除字段
                        options._changeCounter++;
                        formItem.closest('.bh-advancedQuery-form-row').remove();
                    }
                }
            });
            advanceForm.emapFormInputInit({
                defaultOptions: {
                    tree: {
                        unblind: '/',
                        search: true
                    },
                    "multi-tree": {
                        unblind: '/',
                        search: true
                    },
                    switcher: {
                        checked: true
                    },
                    "multi-select2": {
                        width: 300
                    },
                    "date-range": {
                        defaultType: 'all'
                    }
                }
            });

            // 表单塞值
            for (var v in selectedObj) {
                if (selectedObj[v] === undefined || selectedObj[v] === null) return true;
                var ele = $('[data-name=' + v + ']', advanceForm);
                var xtype = ele.attr('xtype');
                if (xtype == 'switcher') {
                    if (selectedObj[v] === "") selectedObj[v] = "1";
                } // 高级搜索的开关 默认选中
                if (xtype == 'date-range' && selectedObj[v] === "") selectedObj[v] = "all"; // 高级搜索的开关 默认选中
                if (selectedObj[v] !== "") {
                    WIS_EMAP_INPUT.setValue(ele, v, xtype, selectedObj, "");
                }
            }
            WIS_EMAP_SERV && WIS_EMAP_SERV._resetPageFooter();
        };

        // 生成搜索条件
        // blank_condition 是否允许搜索条件中存在空值
        _getSearchCondition = function (options, name, blank_condition) {
            var conditionResult = [];
            var easyArray = options.$advanced.data('easyarray');
            var modalarray = options.$advanced.data('modalarray')
            var orCondition = [];
            if (options.searchModel == 'easy') {
                var searchKey = $.trim($('.bh-advancedQuery-quick-search-wrap input', options.$advanced).val());
                // 简单搜索
                if (searchKey != "") {
                    if (name) {
                        //简单搜索的下拉框搜索
                        var searchItem = _findModel(name, easyArray);
                        var conditionData = {
                            "caption": searchItem.caption,
                            "name": searchItem.name,
                            "value": searchKey,
                            "builder": (searchItem.defaultBuilder == "equal" ? "include" : searchItem.defaultBuilder), // equal时强制转换为include
                            "linkOpt": "AND"
                        };
                        conditionResult.push(conditionData);
                    } else {
                        for (var i = 0; i < easyArray.length; i++) {
                            var conditionData = {
                                "caption": easyArray[i].caption,
                                "name": easyArray[i].name,
                                "value": searchKey,
                                "builder": (easyArray[i].defaultBuilder == "equal" ? "include" : easyArray[i].defaultBuilder), // equal时强制转换为include
                                "linkOpt": "OR"
                            };
                            orCondition.push(conditionData);
                        }
                        conditionResult.push(orCondition);
                    }
                }
                conditionResult = conditionResult.concat(_getConditionFromForm($('[bh-advanced-query-role=quickSearchForm]', options.$advanced), options));
            } else if (options.searchModel == 'advanced') {
                var advancedKeyWord = $.trim($('[bh-advanced-query-role=advancedInput]', options.$advanced).val());
                // 高级搜索
                if (advancedKeyWord != '') {
                    for (var i = 0; i < easyArray.length; i++) {
                        if (!easyArray[i].xtype || easyArray[i].xtype == 'text') {
                            orCondition.push({
                                "caption": easyArray[i].caption,
                                "name": easyArray[i].name,
                                "value": advancedKeyWord,
                                "builder": (easyArray[i].defaultBuilder == "equal" ? "include" : easyArray[i].defaultBuilder), // equal时强制转换为include,
                                "linkOpt": "OR"
                            });
                        }
                    }
                    conditionResult.push(orCondition);
                }
                conditionResult = conditionResult.concat(_getConditionFromForm($('[bh-advanced-query-role=advanceSearchForm]', options.$advanced), options));
            }
            if (blank_condition !== true) {
                conditionResult = filterCondition(conditionResult);
            }
            return JSON.stringify(conditionResult);
        };

        _getConditionFromForm = function (form, options) {
            var model = options.$advanced.data('modalarray');
            var conditionArray = [];
            var formElement = $('[xtype]', form);
            for (var i = 0; i < formElement.length; i++) {
                var conditionItem = {};
                var xtype = $(formElement[i]).attr('xtype');
                conditionItem.name = $(formElement[i]).data('name');
                conditionItem.caption = $(formElement[i]).data('caption');
                conditionItem.builder = $(formElement[i]).data('builder');
                conditionItem.linkOpt = 'AND';
                var curModelItem = model.filter(function (item) {
                    return item.name === conditionItem.name
                })[0];
                switch (xtype) {
                    case 'radiolist':
                        conditionItem.value = $('input[type=radio]:checked', formElement[i]).map(function () {
                            return $(this).val();
                        }).get().join(',');
                        break;
                    case 'checkboxlist':
                        conditionItem.value = $('input[type=checkbox]:checked', formElement[i]).map(function () {
                            return $(this).val();
                        }).get().join(',');
                        break;
                    case 'tree':
                        conditionItem.value = $(formElement[i]).emapDropdownTree('getValue');
                        conditionItem['value_display'] = $(formElement[i]).emapDropdownTree('getText');
                        break;
                    case 'multi-tree':
                        conditionItem.value = $(formElement[i]).emapDropdownTree('getValue');
                        conditionItem['value_display'] = $(formElement[i]).emapDropdownTree('getText');
                        break;
                    case 'buttonlist':
                        conditionItem.value = $('.bh-label-radio.bh-active', formElement[i]).data('id');
                        if (conditionItem.value !== undefined && conditionItem.value !== null) {
                            conditionItem.value = conditionItem.value + '';
                        }
                        break;
                    case 'multi-buttonlist':
                        conditionItem.value = $(formElement[i]).bhButtonGroup('getValue');
                        if (conditionItem.value !== undefined && conditionItem.value !== null) {
                            conditionItem.value = conditionItem.value + '';
                        }
                        break;
                    case 'date-range':
                        conditionItem.value = $(formElement[i]).bhTimePicker('getValue');
                        break;
                    case 'switcher':
                        conditionItem.value = ($(formElement[i]).val() ? 1 : 0);
                        break;
                    case 'number':
                        var numVal = $(formElement[i]).jqxNumberInput('value');
                        if (numVal) {
                            numVal = numVal.toString().replace(/\D/g, '')
                        }
                        conditionItem.value = numVal === null ? '' : numVal * 1;
                        break;
                    case 'multi-select':
                        var items = $(formElement[i]).jqxComboBox('getSelectedItems');
                        if (items.length > 0) {
                            conditionItem.value = items.map(function (val) {
                                return val.value;
                            }).join(',');
                        } else {
                            conditionItem.value = "";
                        }
                        break;
                    case 'multi-select2':
                        var items = $(formElement[i]).jqxDropDownList('getCheckedItems');
                        if (items.length > 0) {
                            conditionItem.value = items.map(function (val) {
                                return val.value;
                            }).join(',');
                        } else {
                            conditionItem.value = "";
                        }
                        break;
                    default:
                        conditionItem.value = $.trim($(formElement[i]).val());
                        break;
                }
                if (xtype === 'date-range') { // 日期区间控件
                    var vauleObj = conditionItem.value;
                    if (vauleObj) {
                        if (vauleObj.startTime) {
                            conditionItem.value = vauleObj.startTime;
                            conditionItem.builder = 'moreEqual';
                            conditionArray.push(conditionItem);
                        }
                        if (vauleObj.endTime) {
                            var newItem = $.extend({}, conditionItem);
                            newItem.value = vauleObj.endTime;
                            newItem.builder = 'lessEqual';
                            conditionArray.push(newItem);
                        }
                    } else {
                        continue;
                    }
                } else if (xtype == 'number-range') { // 数字区间控件
                    var numRange = $(formElement[i]).bhNumRange('getValue');
                    if (numRange !== undefined && numRange !== null) {
                        var numRangeArr = numRange.split(',');
                        if (numRangeArr[0] !== "") {
                            conditionItem.value = numRangeArr[0];
                            conditionItem.builder = 'moreEqual';
                            conditionArray.push(conditionItem);
                        }
                        if (numRangeArr[1] !== "") {
                            var newItem = $.extend({}, conditionItem);
                            newItem.value = numRangeArr[1];
                            newItem.builder = 'lessEqual';
                            conditionArray.push(newItem);
                        }
                    }

                }
                // else if (xtype == 'multi-buttonlist') {
                //  var itemValue = $(formElement[i]).bhButtonGroup('getValue');
                //  if (!itemValue) continue;
                //  var buttonlistCondition = [];
                //  itemValue.split(',').map(function(val){
                //      buttonlistCondition.push({
                //          name: $(formElement[i]).data('name'),
                //          caption: $(formElement[i]).data('caption'),
                //          builder: $(formElement[i]).data('builder'),
                //          linkOpt: 'OR',
                //          value: val
                //      })
                //  });
                //  conditionArray.push(buttonlistCondition);
                // }
                else {
                    if (conditionItem.value === undefined) {
                        continue;
                    }
                    if (conditionItem.value == 'ALL') {
                        conditionItem.value = ''
                    }
                    // 当文本框控件的value包含,时
                    if (conditionItem.value.toString().indexOf(',') > -1) { // mengbin:多选下拉树 的builder 使用模型配置, 因为要做递归查询 --- zhuhui 6-7
                        if (xtype == 'multi-tree') {}
                        if (xtype == 'text') {
                            conditionItem.builder = 'm_value_include';
                        }
                        if (xtype == 'multi-select' || xtype == 'multi-select2' || xtype == 'multi-buttonlist') {
                            conditionItem.builder = 'm_value_equal';
                        }
                    }
                    conditionArray.push(conditionItem);
                }
                // 对于dataType 为init 或者double的字段，尝试将value转化为 number类型
                if (curModelItem && conditionItem.value !== '' && (curModelItem.dataType == 'int' || curModelItem.dataType == 'double')) {
                    var v = conditionItem.value * 1;
                    if (!isNaN(v)) {
                        conditionItem.value = v;
                    }
                }
            }
            return conditionArray;
        };

        _findModel = function (name, modelArray) {
            for (var i = 0; i < modelArray.length; i++) {
                if (modelArray[i].name == name) {
                    return modelArray[i];
                }
            }
        };

        // 初始化方案
        _initSchema = function (element, options) {
            options = $.extend(options, {
                schemaType: "aq"
            });
            $.fn.emapSchema && $(element).emapSchema(options);
            _renderFixedSchema(element, options);
        };

        // 关闭搜索方案
        _closeSchema = function (options) {
            var wrap = $('.bh-schema-btn-wrap', options.$advanced);
            wrap.removeClass('active');
            $('.bh-schema-name-input', wrap).val('');
            $('[bh-schema-role=fixCheckbox]', wrap).prop('checked', false);
        };

        // 渲染固定的搜索方案
        _renderFixedSchema = function (element, options) {
            options.schemaList = element.emapSchema('getSchemaList');
            options.schemaList = options.schemaList ? options.schemaList : [];
            var $advanced = options.$advanced;
            var programContainer = $('.bh-rules-program', $advanced);
            if (options.schemaList.length > 0) {
                var fixedSchema = options.schemaList.filter(function (val) {
                    return val.FIXED == 1;
                })
                if (fixedSchema.length == 0) {
                    programContainer.html('<div class="bh-advancedQuery-groupName">常用方案：</div>' +
                        '<div class="bh-advancedQuery-groupList">' +
                        '<a bh-schema-role="more" href="javascript:void(0)">更多 ></a>' +
                        '</div>');
                } else {
                    $(fixedSchema).each(function () {
                        var sch = $('<a  data-name="' + this.SCHEMA_NAME + '" href="javascript:void(0)">' + this.SCHEMA_NAME + '</a>');
                        sch.data('info', this);
                        $('[bh-schema-role=more]', programContainer).before(sch);
                    });
                    programContainer.show()
                }
            } else {
                programContainer.hide();
            }
        };

        // 方案侧边弹窗事件绑定
        _schemaDialogEventBind = function (element, options) {
            var dialog = $('#schemaDialog');
            // 删除
            dialog.on('click', '[bh-schema-role=delete]', function (e) {
                e.stopPropagation();
                var li = $(this).parent();
                var name = li.data('info').SCHEMA_NAME;
                if (element.emapSchema('deleteSchema', name)) {
                    li.remove();
                    $('.bh-rules-program', element).find('[data-name=' + name + ']').remove();
                    $(options.schemaList).each(function (i) {
                        if (this.SCHEMA_NAME == name) {
                            options.schemaList.splice(i, 1);
                        }
                    })
                    _refreshUnfixNum($('[bh-schema-role=unFixedUl]', dialog));
                }
            });

            // 点击选择方案
            dialog.on('click', 'li', function (event) {
                var condition = $(this).data('info');
                element.emapAdvancedQuery('setValue', condition.CONTENT);
                element.trigger('search', [condition.CONTENT, options, event]);
                $.bhPropertyDialog.hide();
                $.bhTip && $.bhTip({
                    content: condition.SCHEMA_NAME + ' 方案执行成功',
                    state: 'success',
                    iconClass: 'icon-checkcircle'
                });
            });

            // 置顶
            dialog.on('click', '[bh-schema-role=fixed]', function (e) {
                    e.stopPropagation();
                    var li = $(this).closest('li');
                    var info = li.data('info');
                    var name = info.SCHEMA_NAME;
                    var conditionData = info.CONTENT;
                    element.emapSchema('saveSchema', [name, conditionData, 1]).done(function () {
                        _closeSchema(options);
                        var infoData = {
                            "CONTENT": conditionData,
                            "SCHEMA_NAME": name,
                            "FIXED": 1
                        }
                        options.schemaList.filter(function (val) {
                            return val.SCHEMA_NAME == name;
                        })[0].FIXED = 1;
                        $('[bh-schema-role=fixedUl]', dialog).append(li);
                        var sch = $('<a  data-name="' + name + '" href="javascript:void(0)">' + name + '</a>');
                        sch.data('info', infoData);
                        $('.bh-rules-program [bh-schema-role=more]', element).before(sch);
                        _refreshUnfixNum($('[bh-schema-role=unFixedUl]', dialog));
                    }).fail(function (res) {
                        console && console.log(res)
                    });
                })
                // 取消置顶
            dialog.on('click', '[bh-schema-role=unfixed]', function (e) {
                e.stopPropagation();
                var li = $(this).closest('li');
                var info = li.data('info');
                var name = info.SCHEMA_NAME;
                var conditionData = info.CONTENT;
                element.emapSchema('saveSchema', [name, conditionData, 0]).done(function () {
                    _closeSchema(options);
                    options.schemaList.filter(function (val) {
                        return val.SCHEMA_NAME == name;
                    })[0].FIXED = 0;
                    $('[bh-schema-role=unFixedUl]', dialog).append(li);
                    $('.bh-rules-program', element).find('[data-name=' + name + ']').remove()
                    _refreshUnfixNum($('[bh-schema-role=unFixedUl]', dialog));
                }).fail(function (res) {
                    console && console.log(res)
                });
            })
        };

        function filterCondition(condition) {
            var con = condition;
            var result = [];
            if (typeof condition == 'string') {
                con = JSON.parse(con);
            }
            con.map(function (item, i) {
                if (item instanceof Array) {
                    result.push(filterCondition(item));
                } else {
                    if (item.value !== '') {
                        result.push(item);
                    }
                }
            })
            return result;
        }

        element.css({
            "position": "relative",
            "z-index": 358
        }).html('<div class="bh-advancedQuery bh-mb-16" bh-advanced-query-role="advancedQuery">' +
            '<div class="bh-advancedQuery-dropDown ">' +
            '<div class="" style="display: table-cell">' +
            '<div class="bh-rules-header bh-clearfix">' +
            '<h4><i class="iconfont icon-search"></i>高级搜索</h4>' +
            // '<p class="bh-rules-program">' +
            // '<label>常用方案: </label>' +
            // '<a bh-schema-role="more" href="javascript:void(0)">更多 ></a>' +
            // '</p>' +
            '</div>' +
            '<div class="bh-advancedQuery-form" bh-advanced-query-role="advanceSearchForm" >' +

            '<div class="bh-advancedQuery-form-row bh-advancedQuery-h-28 bh-rules-program" style="float: none;">' +
            '<div class="bh-advancedQuery-groupName">常用方案：</div>' +
            '<div class="bh-advancedQuery-groupList">' +
            '<a bh-schema-role="more" href="javascript:void(0)">更多 ></a>' +
            '</div>' +
            '</div>' +

            '<div class="bh-advancedQuery-form-row bh-advancedQuery-h-28">' +
            '<div class="bh-advancedQuery-groupName">关键词：</div>' +
            '<div class="bh-advancedQuery-groupList">' +
            '<input type="text" bh-advanced-query-role="advancedInput" class="bh-form-control">' +
            '</div>' +
            '</div>' +
            '<div class="bh-advancedQuery-form-row bh-advancedQuery-form-btn-row bh-advancedQuery-h-28" bh-advanced-query-role="dropDownBtnWrap"> ' +
            '<div class="bh-advancedQuery-groupName"></div>' +
            '<div class="bh-advancedQuery-groupList">' +
            '<a class="bh-btn bh-btn-primary bh-btn-small" bh-advanced-query-role="advancedSearchBtn" >执行高级搜索</a>' +
            '<a class="bh-btn bh-btn-default bh-btn-small" bh-advanced-query-role="addCondition" >添加搜索字段</a>' +
            '<div class="bh-schema-btn-wrap">' +
            '<div class="bh-schema-edit-div">' +
            '<input type="text" placeholder="请输入方案名称" maxlength="20" class="bh-form-control bh-schema-name-input" />' +
            '<a  class="bh-btn bh-btn-success bh-btn-small"  bh-advanced-query-role="saveSchemaConfirm">保存</a>' +
            '<a class="bh-btn bh-btn-default bh-btn-small" bh-advanced-query-role="saveSchemaCancel">取消</a>' +
            '<span class="bh-checkbox" style="display:inline-block;vertical-align:middle;margin-left:8px;padding-top: 0;"><label>' +
            '<input type="checkbox" bh-schema-role="fixCheckbox"><i class="bh-choice-helper"></i> 固定至搜索栏' +
            '</label></span>' +
            '</div>' +
            '<a class="bh-btn bh-btn-default bh-btn-small " bh-advanced-query-role="saveSchema" href="javascript:void(0)">保存为方案</a>' +
            '</div>' +
            '<a class="bh-mh-4" bh-advanced-query-role="advancedClose" href="javascript:void(0)">[关闭高级搜索]</a>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="bh-advancedQuery-quick">' +
            '<div class="bh-advancedQuery-inputGroup bh-clearfix" style="padding-bottom: 8px;background: #fff;">' +
            '<div class="bh-advancedQuery-quick-search-wrap" >' +
            '<input type="text" class="bh-form-control"/>' +
            '<i class="iconfont icon-search" style="position: absolute;left: 6px;top: 6px;"></i>' +
            //'<div class="bh-advancedQuery-quick-select" bh-advanced-query-role="advancedEasySelect">' +
            //'</div>' +
            '</div>' +
            '<a class="bh-btn bh-btn bh-btn-primary bh-btn-small" bh-advanced-query-role="easySearchBtn" >搜索</a>' +
            '<a href="javascript:void(0);" class="bh-mh-8" bh-advanced-query-role="advancedOpen">[高级搜索]</a>' +
            '</div>' +
            '<div class="bh-advancedQuery-form" bh-advanced-query-role="quickSearchForm">' +
            '</div>' +
            '</div>' +
            '<div class="bh-advancedQuery-dialog" bh-advanced-query-role="addDialog" data-guid="' + guid + '">' +
            '<div class="bh-advancedQuery-dialog-head">添加搜索字段</div>' +
            '<div class="bh-advancedQuery-dialog-content">' +
            '<div class="bh-checkbox bh-mb-8" style="padding-left: 11px;"><label><input type="checkbox" bh-advanced-query-rol="selectAllField">' +
            '<i class="bh-choice-helper"></i><b>全选</b>' +
            '</label></div>' +
            '<ul class="bh-advancedQuery-dialog-list" bh-advanced-query-role="addList"></ul>' +
            '</div>' +
            '<a href="javascript:void(0)" bh-advanced-query-role="addDialogCancel" class="bh-btn bh-btn-default bh-pull-right" >取消</a>' +
            '<a href="javascript:void(0)" bh-advanced-query-role="addDialogConfirm" class="bh-btn bh-btn-primary bh-pull-right" >添加完成</a>' +
            '</div>' +
            '<div class="bh-clearfix bh-advancedQuery-totalNum-wrap">' +
            '<p class="bh-advancedQuery-totalNum bh-pull-left">共<span></span>条数据 <a href="javascript:void(0)" bh-advanced-query-role="clearBtn">[清空搜索]</a></p>' +
            '<div class="bh-advancedQuery-totalNum-line"></div>' +
            '</div>' +
            '</div>');
        options.$advanced = $('div[bh-advanced-query-role=advancedQuery]', element).css({
            'overflow': 'hidden'
        });
        options.guid = guid;
        $('body').append('<div class="bh-advancedQuery-quick-select" bh-advanced-query-role="advancedEasySelect" data-guid="' + guid + '" ></div>');
        // 添加搜索条件弹框 初始化
        $('[bh-advanced-query-role=addDialog]', options.$advanced).jqxWindow({
                resizable: false,
                draggable: false,
                isModal: true,
                modalOpacity: 0.3,
                width: 800,
                height: 400,
                autoOpen: false,
                position: [window.innerWidth / 2 - 800 / 2, window.innerHeight / 2 + $(window).scrollTop() - 200]
            })
            .on('close', function () {
                $('body').niceScroll();
            })
            .on("open", function () {
                $('body').getNiceScroll().remove(); // 弹框弹出式页面居中并 禁止页面滚动
                $('body').css({
                    overflow: 'hidden',
                    'overflow-x': 'hidden',
                    'overflow-y': 'hidden'
                });
            });
        options.$advancedModal = $('[bh-advanced-query-role=addDialog][data-guid=' + options.guid + ']');
        _eventBind(options, element);

        var easySearchPlaceholder = '请输入';
        $(modalData).each(function (i) {
            //移除 hidden 项
            var index = modalData.indexOf(this);
            if (this.get('hidden')) {
                modalData.splice(index, 1);
                return true;
            }
            if (!this.xtype || this.xtype == 'text') {
                // easySearchPlaceholder += this.caption + '/'; // 高级搜索关键词输入框placeholder
            } else if ($.inArray(this.xtype, ["radiolist", "checkboxlist", "buttonlist", "multi-buttonlist"]) > -1) {
                options._initCount++;
            }
            if (this.quickSearch) {
                if (!this.xtype || this.xtype == 'text') {
                    easySearchPlaceholder += this.caption + '/';
                    easyArray.push(this);
                } else {
                    quickArray.push(this);
                }
            }
        });
        // 高级搜索关键词字段添加placeholder
        $('[bh-advanced-query-role=advancedInput]', element).attr('placeholder', easySearchPlaceholder.substr(0, easySearchPlaceholder.length - 1));
        options.$advanced.data('modalarray', modalData);
        options.$advanced.data('easyarray', easyArray);
        options.$advanced.data('quickarray', quickArray);
        if (options.searchModel !== 'easy') {
            options._initCount = quickArray.length;
        }
        if (easyArray.length == 0 && quickArray.length == 0) {
            console && console.warn("没有配置快速搜索字段,所以高级搜索控件无法展示!");
        }

        // 简单搜索 条件渲染
        _renderEasySearch(easyArray, options);

        // 快速搜索条件渲染
        quickArray = JSON.parse(JSON.stringify(quickArray));
        $('[bh-advanced-query-role=quickSearchForm]', options.$advanced).html(_renderQuickSearch(quickArray))
            .emapFormInputInit({
                root: '',
                defaultOptions: {
                    tree: {
                        // checkboxes: true,
                        width: 300,
                        unblind: '/',
                        search: true // 高级搜索下拉树默认开启 搜索
                    },
                    "multi-tree": {
                        width: "300px",
                        unblind: '/',
                        search: true // 高级搜索下拉树默认开启 搜索
                    },
                    switcher: {
                        checked: true
                    },
                    "date-range": {
                        defaultType: 'all'
                    },
                    "select": {
                        width: "300"
                    },
                    "multi-select": {
                        width: "300px"
                    },
                    "multi-select2": {
                        width: "300px"
                    },
                    "date-local": {
                        width: "300px"
                    },
                    "date-ym": {
                        width: "300px"
                    },
                    "date-full": {
                        width: "300px"
                    }
                }
            });

        _renderAdvanceSearchForm(options, options.defaultItem);
        // 初始化 方案 模块
        if (options.schema) {
            $.fn.emapSchema && _initSchema(element, options);
        } else {
            $('.bh-rules-program, .bh-schema-btn-wrap', options.$advanced).hide();

        }
        if (document.documentMode == 9 && JPlaceHolder) {
            // WIS_EMAP_INPUT.placeHolder();
            JPlaceHolder.fix(element);
        }
    };


    $.fn.emapAdvancedQuery = function (options, params) {
        var instance;
        instance = this.data('plugin');
        if (!instance) {
            return this.each(function () {
                return $(this).data('plugin', new Plugin(this, options));
            });
        }
        if (options === true) return instance;
        if ($.type(options) === 'string') return instance[options](params);
        return this;
    };

    /**
     * @memberof module:emapAdvancedQuery
     * @prop {Object} data - 搜索数据模型
     * @prop {Boolean} [allowAllOption=true] - 快速搜索的按钮组是否显示[全部]选项
     * @prop {Boolean} [contextPath] - 快速搜索的按钮组是否显示[全部]选项
     * @prop {Object} [defaultItem=[]] - 高级搜索模式默认展示的字段 [{name: "xxx"}]
     * @prop {String} [searchModel=easy] - 默认搜索模式 可选值： 'easy' 简单模式  'advanced' 高级模式
     * @prop {Boolean} [schema=true] - 是否开启保存搜索方案功能
     * @prop {Boolean} [showTotalNum=false] - 是否展示表格数据联动显示
     * @prop {Function} [initComplete] - 初始化成功的回调函数
     */
    $.fn.emapAdvancedQuery.defaults = {
        allowAllOption: true,
        defaultItem: [],
        searchModel: 'easy',
        schema: true,
        showTotalNum: false
    };

}).call(this);
(function () {
    var Plugin, _eventBind;
    /**
     * @module emapAvatarUpload
     * @description 头像裁剪
     */
    Plugin = (function () {
        function Plugin(element, options) {
            this.options = $.extend({}, $.fn.emapAvatarUpload.defaults, options);
            this.$element = $(element);
            _init(this.$element, this.options);
        }

        /**
         * @method destroy
         * @description 销毁
         */
        Plugin.prototype.destroy = function () {
            this.options = null;
            $(this.$element).data('emapAvatarUpload', false).empty();
        };
        Plugin.prototype.getValue = function () {};

        /**
         * @method disable
         * @description 禁用
         */
        Plugin.prototype.disable = function () {
            $('.bh-emapAvartar-btn', this.$element).hide()
        };

        /**
         * @method disable
         * @description 启用
         */
        Plugin.prototype.enable = function () {
            $('.bh-emapAvartar-btn', this.$element).show()
        };
        return Plugin;
    })();


    //生成dom
    function _init(element, options) {
        // contextPath 兼容
        options.contextPath = options.contextPath || WIS_EMAP_SERV.getContextPath();
        if (options.token && options.token != null) {
            // 已有图片
            options.scope = options.token.substring(0, options.token.length - 1);
            // options.displayAvatar = options.contextPath + '/sys/emapcomponent/file/getFileByToken/' + options.token + '.do?date=' + new Date().getTime();
            options.displayAvatar = options.contextPath + '/sys/emapcomponent/file/getSingleImageByToken.do?fileToken=' + options.token + '&date=' + new Date().getTime();
            options.newToken = false;
        } else {
            // 新上传
            options.scope = new Date().getTime() + "" + parseInt(Math.random() * 100).toString();
            options.token = options.scope + 1;
            options.displayAvatar = options.defaultAvatar;
            options.newToken = true;
        }

        options.$wrap = $('<div class="bh-emapAvatar-wrap"><img class="bh-emapAvatar-avatar" src="' + options.displayAvatar + '"><a class="bh-emapAvartar-btn" href="javascript:void(0)">修改头像</a></div>')
            .css({
                'height': options.width / options.ratio,
                'width': options.width
            });

        if (options.disabled) $('.bh-emapAvartar-btn', options.$wrap).hide();
        element.append(options.$wrap);

        _eventBind(element, options);

    }

    _eventBind = function (element, options) {
        var $wrap = options.$wrap;
        // 点击修改头像
        $wrap.on('click', '.bh-emapAvartar-btn', function () {
            $.emapAvatarUploadWindow(element, options);
        });

        $('.bh-emapAvatar-avatar', element).one('error', function () {
            $(this).attr('src', options.defaultAvatar);
        });
    };


    $.fn.emapAvatarUpload = function (options, params) {
        var instance;
        instance = $(this).data('emapAvatarUpload');
        if (!instance) {
            return this.each(function () {
                if (options == 'destroy') {
                    return this;
                }
                return $(this).data('emapAvatarUpload', new Plugin(this, options));
            });
        }
        if (options === true) return instance;
        if ($.type(options) === 'string') return instance[options](params);
        return this;
    };


    /**
     * @memberof module:emapAvatarUpload
     * @prop {String} [contextPath] - 根路径
     * @prop {Number} [ratio=1] - 图片宽高比
     * @prop {Int} [width=100] - 图片显示宽度
     * @prop {Int} [actualWidth] - 裁剪出图片的实际宽度
     * @prop {String} [token] - 文件token,不传则组件生成随机的新token， 传token则组件自动请求token下已有的文件信息并渲染到页面上
     * @prop {String} [storeId=image] - emap文件类型
     * @prop {Array} [type=['jpg', 'png', 'jpeg']] - 上传文件的格式要求
     * @prop {Int} [size=5120] - 上传文件的大小要求，单位为KB
     * @prop {Int} [disabled=false] - 是否禁用
     * @prop {Function} [onSubmit] - 头像裁剪成功的回调 参数为token
     */
    $.fn.emapAvatarUpload.defaults = {
        storeId: 'image',
        contextPath: "",
        ratio: 1,
        width: 100,
        actualWidth: null, // 需要图片的实际尺寸
        type: ['jpg', 'png', 'jpeg'],
        size: 5120,
        disabled: false

    };

    $.emapAvatarUploadWindow = function (element, options) {
        options.winContent = $('<div id="emapAvatarUploadWindow">' +
            '<ul style="display: none;">' +
            '<li>本地上传</li>' +
            '<li>推荐头像</li>' +
            '</ul>' +
            '<div>' +
            '<div class="bh-emapAvatar-local"></div>' +
            '<div class="bh-emapAcatar-error-msg bh-text-center" style="color: red;"></div>' +
            '</div>' +
            '<div>' +
            '</div>');

        var initUpload = function (input, options) {
            /***
             * emap 相关逻辑代码
             *
             */
            var fileReader = 'FileReader' in window;
            input.fileupload({
                url: options.uploadUrl,
                autoUpload: true,
                multiple: false,
                dataType: 'json',
                limitMultiFileUploads: 1,
                formData: {
                    size: options.size,
                    type: options.type,
                    storeId: options.storeId
                },
                submit: function (e, data) {
                    $('.bh-emapAcatar-error-msg', options.winContent).html('').hide();
                    var file = data.files[0];
                    $('.bh-emapAvatar-text-info', options.winContent).show();
                    $('.bh-emapAvatar-text-error', options.winContent).hide();

                    // 文件的大小 和类型校验
                    if (options.type && options.type.length > 0) {
                        if (!new RegExp(options.type.join('|').toUpperCase()).test(file.name.toUpperCase())) {
                            $('.bh-emapAvatar-text-info', options.winContent).hide();
                            $('.bh-emapAvatar-text-error', options.winContent).html('文件类型不正确').show();
                            return false;
                        }
                    }

                    if (fileReader && options.size) {
                        if (file.size / 1024 > options.size) {
                            $('.bh-emapAvatar-text-info', options.winContent).hide();
                            $('.bh-emapAvatar-text-error', options.winContent).html('文件大小超出限制').show();
                            return false;
                        }
                    }
                    $('.bh-emapAvatar-loader', options.winContent).jqxLoader('open');

                },
                done: function (e, data) {
                    var file = data.files[0];
                    if (data.result.success) {
                        // 上传成功
                        $('.bh-avatar-img', options.winContent).attr('src', data.result.tempFileUrl).cropper('destroy');
                        initCrop($('.bh-avatar-img', options.winContent), options);
                        $('.bh-avatar-img-block', options.winContent).show();
                        // 上传成功后删除原有的 临时文件图片
                        deleteTempFile(options);

                        options.fileId = data.result.id;
                    } else {
                        // 上传失败
                        $('.bh-emapAcatar-error-msg', options.winContent).html('图片上传失败').show();
                    }
                    $('.bh-emapAvatar-loader', options.winContent).jqxLoader('close');
                },
                fail: function (e, data) {
                    var file = data.files[0];
                    $('.bh-emapAvatar-loader', options.winContent).jqxLoader('open');
                    $('.bh-emapAcatar-error-msg', options.winContent).html('图片上传失败').show();
                }
            });
        };

        options.uploadUrl = options.contextPath + '/sys/emapcomponent/file/uploadTempFile/' + options.scope + '/' + options.token + '.do';


        $('.bh-emapAvatar-local', options.winContent).html('<div class="bh-emapAvatar-editArea" bh-avatar-role="editArea">' +
            '<div class="bh-emapAvatar-upload-block">' +
            '<a href="javascript:void(0)" class="bh-btn bh-btn-default bh-emapAvatar-upload">' +
            '<i class="iconfont icon-add"></i>选择图片' +
            '<input type="file">' +
            '</a>' +
            '<p class="bh-text-caption bh-color-caption bh-text-center bh-emapAvatar-text-info"></p>' +
            '<p class="bh-text-caption bh-color-danger bh-text-center bh-emapAvatar-text-error"></p>' +
            '</div>' +
            '<div class="bh-avatar-img-block">' +
            '<img class="bh-avatar-img" src="' + options.displayAvatar + '" style="display: none;">' +
            '<p ><a href="javascript:void(0)" class="bh-emapAvatar-reUpload">重新上传</a> ' +
            //  旋转功能暂未提供
            //'| <a href="javascript:void(0)"><i class="iconfont icon-refresh"></i>90°旋转</a>' +
            '</p>' +
            '</div>' +
            '<div class="bh-emapAvatar-loader"></div>' +
            '</div>' +
            '<div class="bh-emapAvatar-display">' +
            '<div class="bh-emapAvatar-preview-100 bh-emapAvatar-preview"><div class="bh-emapAvatar-preview-div"></div></div>' +
            '<p class="bh-mb-8"></p>' +
            '<div>' +
            '<div class="bh-emapAvatar-preview-40 bh-pull-left bh-emapAvatar-preview" style="margin-right: 8px;"><div class="bh-emapAvatar-preview-div"></div></div>' +
            '<div class="bh-emapAvatar-preview-40 bh-pull-left bh-emapAvatar-preview" style="border-radius: 50%;"><div class="bh-emapAvatar-preview-div"></div></div>' +
            '<p class="bh-clearfix bh-mb-8"></p>' +
            '<div class="bh-emapAvatar-preview-28 bh-pull-left bh-emapAvatar-preview" style="margin-right: 8px;"><div class="bh-emapAvatar-preview-div"></div></div>' +
            '<div class="bh-emapAvatar-preview-28 bh-pull-left bh-emapAvatar-preview" style="border-radius: 50%;"><div class="bh-emapAvatar-preview-div"></div></div>' +
            '<p class="bh-clearfix bh-mb-8"></p>' +
            '</div>' +
            '</div>' +
            '');

        $('.bh-avatar-img', options.winContent).one('error', function () {
                $(this).attr('src', options.defaultAvatar);
            })
            .on('load', function () {
                initCrop($(this), options);
            }); // 初始化裁剪插件

        BH_UTILS.bhWindow(options.winContent, '头像上传', undefined, {
            width: '560px',
            close: function () {
                $('.bh-avatar-img', options.winContent).cropper('destroy');
            }
        }, function () {
            return submitEdit(options);
        });
        // 预览窗口 尺寸和文字渲染
        $('.bh-emapAvatar-preview', options.winContent).each(function () {
            var width = $(this).width();
            var height = parseInt($(this).width() / options.ratio);
            var p = $(this).next('p');
            $(this).css({
                height: height
            });
            if (p.length > 0) {
                p.html(width + ' * ' + height + 'px');
            }
        });

        // 上传说明渲染
        var typeStr = options.type.join('、').toUpperCase();
        var sizeStr = (options.size > 1024) ? options.size / 1024 + 'M' : options.size + 'K';
        $('.bh-emapAvatar-text-info', options.winContent).html('只支持' + typeStr + '，大小不超过' + sizeStr);

        // 初始化tab  添加推荐头像功能时放开注释
        //$('#emapAvatarUploadWindow').jqxTabs({ width: '100%', height: 200, position: 'top'});

        //初始化loader
        $('.bh-emapAvatar-loader', options.winContent).jqxLoader({});

        // 初始化 上传控件
        initUpload($('input[type=file]', options.winContent), options)

        // 重新上传事件绑定
        $('.bh-emapAvatar-reUpload', options.winContent).on('click', function () {
            $('input[type=file]', options.winContent).click();
        });

        function initCrop(ele, options) {
            ele.cropper({
                aspectRatio: options.ratio,
                viewMode: 1,
                movable: false,
                zoomOnWheel: false,
                preview: '.bh-emapAvatar-preview'
            });
        }

        function submitEdit(options) {
            if (options.fileId) {
                var cutResult = cutTempFile(options);

                if (cutResult.success && deleteTempFile(options).success && deleteFileByToken(options).success && saveAttachment(options).success) {
                    options.onSubmit && options.onSubmit(options.token);
                    // $('.bh-emapAvatar-avatar', element).attr('src', options.contextPath + '/sys/emapcomponent/file/getFileByToken/' + options.token + '.do?date=' + new Date().getTime());
                    // options.displayAvatar = options.contextPath + '/sys/emapcomponent/file/getFileByToken/' + options.token + '.do?date=' + new Date().getTime();
                    $('.bh-emapAvatar-avatar', element).attr('src', options.contextPath + '/sys/emapcomponent/file/getSingleImageByToken.do?fileToken=' + options.token + '&date=' + new Date().getTime());
                    options.displayAvatar = options.contextPath + '/sys/emapcomponent/file/getSingleImageByToken.do?fileToken=' + options.token + '&date=' + new Date().getTime();
                    return true;
                } else {
                    if (!cutResult.success) {
                        $('.bh-emapAcatar-error-msg', options.winContent).html(cutResult.error ? cutResult.error : '裁剪失败').show();
                        return false;
                    }
                }
            } else {
                if (options.newToken) {
                    options.onSubmit && options.onSubmit();
                } else {
                    options.onSubmit && options.onSubmit(options.token);
                }
            }
        }

        // 裁剪图片
        function cutTempFile(options) {
            var cutData = $('.bh-avatar-img', options.winContent).cropper('getData', true);
            if (options.actualWidth) {
                cutData.actualWidth = options.actualWidth;
                cutData.actualHeight = options.actualWidth / options.ratio;
            }
            return doRequest(
                options.contextPath + '/sys/emapcomponent/file/cutTempFile/' + options.scope + '/' + options.token + '/' + options.fileId + '.do',
                cutData
            );
        }

        // 删除原有的临时文件
        function deleteTempFile(options) {
            if (options.fileId) {
                return doRequest(
                    options.contextPath + '/sys/emapcomponent/file/deleteTempFile/' + options.scope + '/' + options.token + '/' + options.fileId + '.do', {}
                );
            }
            return {
                success: true
            };
        }

        function deleteFileByToken(options) {
            return doRequest(
                options.contextPath + '/sys/emapcomponent/file/deleteFileByToken/' + options.token + '.do', {}
            );
        }

        function saveAttachment(options) {
            return doRequest(
                options.contextPath + '/sys/emapcomponent/file/saveAttachment/' + options.scope + '/' + options.token + '.do', {
                    attachmentParam: JSON.stringify({
                        storeId: options.storeId
                    })
                }
            );
        }

        function doRequest(url, param) {
            var result;
            $.ajax({
                type: 'post',
                data: param,
                url: url,
                dataType: 'json',
                async: false
            }).done(function (res) {
                result = res;
            }).fail(function (res) {
                $('.bh-emapAcatar-error-msg').html('请求失败').show();
                result = res;
            });
            return result;
        }
    }
}).call(undefined);


function getUploadedAttachment() {

}
/**
 * 类似于纵向tab页签
 */
(function($) {
  /**
   * 定义一个插件
   */
  var Plugin;

  var gPageNumber = null,
    gPageSize = null,
    gTotal = 0,
    gResult = {},
    gParams = {};

  /**
   * 这里是一个自运行的单例模式。
   */
  Plugin = (function() {

    /**
     * 插件实例化部分，初始化时调用的代码可以放这里
     */
    function Plugin(element, options) {
      resetGlobalVar();
      //将插件的默认参数及用户定义的参数合并到一个新的obj里
      this.settings = $.extend({}, $.fn.emapCard.defaults, options);
      //将dom jquery对象赋值给插件，方便后续调用
      this.$element = $(element);
      init(this.settings, this.$element);
    }

    return Plugin;

  })();

  Plugin.prototype = {
    /**
     * 重新加载数据
     */
    reload: function(params, gotoFirstPage) {
      gParams = params || gParams;
      //刷新回到首页
      if (gParams.pageNumber === undefined || gotoFirstPage) {
        gParams.pageNumber = "0";
      }
      render(this.settings, this.$element, null, null, gParams);
    },

    reloadFirstPage: function(params) {
      this.reload(params, true);
    },

    /**
     * 获取卡片记录总条数
     * [getTotalRecords description]
     * @return {Number} 卡片记录总条数
     */
    getTotalRecords: function() {
      return gTotal;
    },

    getResult: function() {
      return gResult;
    }

  };

  function resetGlobalVar() {
    gPageNumber = null;
    gPageSize = null;
    gTotal = 0;
    gParams = {};
  }

  function init(settings, $element) {
    layout($element);
    settings._init = true;
    render(settings, $element);
  }

  function layout($element) {

    var _html =
      '<div>' +
      ' <div class="bh-emapCard-card-list"></div>' +
      ' <div class="bh-emapCard-card-pagination" style="clear:both;"></div>' +
      '</div>';

    $element.html(_html);
  }

  function render(settings, $element, pageNumber, pageSize) {
    var pageSize = parseInt(pageSize || gPageSize || gParams.pageSize || settings.pageSize || 12);
    var pageNumber = parseInt(pageNumber || gParams.pageNumber || gPageNumber || settings.pageNumber || 0);
    if (!gParams.querySetting && !settings._init && !settings.params) {
      gParams.querySetting = "[]";
    }

    gPageNumber = pageNumber;
    gPageSize = pageSize;

    var params = $.extend({}, settings.params, gParams, {
      pageSize: pageSize,
      pageNumber: pageNumber + 1,
      querySetting: gParams.querySetting
    });

    if (!settings.pageable) {
      delete params.pageSize;
      delete params.pageNumber;
    }

    settings._init = false;
    var type = 'post';
    var url = WIS_EMAP_SERV.getAbsPath(settings.pagePath).replace('.do', '/' + settings.action + '.do');

    //mock模式
    if (settings.pagePath.indexOf('.do') == -1) {
      type = settings.url ? 'post' : 'get';
      url = getMockDataUrl(settings.pagePath, settings.action, settings);
    }

    $.ajax({
      url: settings.url || url,
      data: params,
      type: type
    }).done(function(res) {
      gResult = res;
      var total = settings.url ? res.datas.totalSize : res.datas[settings.action].totalSize;
      gTotal = total;
      var rows = settings.url ? res.datas.rows : res.datas[settings.action].rows;
      var pagenum = 1;

      var $cardContainer = $('<div class="bh-clearfix"></div>');
      var rLen = rows.length;
      if (rLen) {
        for (var i = 0; i < rLen; i++) {
          var newRow = settings.cardBeforeRender ? (settings.cardBeforeRender(rows[i]) || rows[i]) : rows[i];
          if (window.Hogan) {
            $cardContainer.append(compile(settings.template, newRow));
          } else if (Vue) {
            var tempDom = $(settings.template);
            new Vue({
              el: tempDom[0],
              data: { row: newRow }
            });
            tempDom.find('.card-opt-button').data('row', newRow);
            $cardContainer.append(tempDom);
          }
        }
      } else {
        var emptyHtml = '<div style="display:table;width:100%;height:100%;padding:22px 0 16px 0"><div class="bh-color-info-3" style="text-align:center;vertical-align:middle;display:table-cell;"><i class="iconfont" style="font-size:48px;">&#xe62a;</i><h3 style="color:#999;margin-top: 12px;">暂无数据</h3></div></div>';
        $cardContainer.html(settings.emptyHtml || emptyHtml);
      }

      $element.find('.bh-emapCard-card-list').html($cardContainer, true);

      if (settings.pageable) {
        $element.find('.bh-emapCard-card-pagination').empty();
        if(rLen){
          $element.find('.bh-emapCard-card-pagination').pagination({
            pagenum: pageNumber,
            pagesize: pageSize,
            totalSize: total,
            mode: settings.pageMode,
            pageSizeOptions: settings.pageSizeOptions
          });

          $element.find('.bh-emapCard-card-pagination').off('pagersearch').on('pagersearch', function(e, pagenum, pagesize, total) {
            pagesize = parseInt(pagesize);
            render(settings, $element, pagenum + '', pagesize);
            settings.pageSizeOptionsChange && settings.pageSizeOptionsChange(pagesize, pagenum);
          });
        }
      }

      settings.cardAfterRender && settings.cardAfterRender();
      _resetPageFooter($element);
    });
  }

  function _resetPageFooter(instance) {
    //当弹框内容的高度出现变化的时候调用以下两个方法
    if (instance.closest(".bh-paper-pile-dialog").length > 0) {
      $.bhPaperPileDialog.resetPageFooter(); //改变页面的页脚位置
      $.bhPaperPileDialog.resetDialogFooter(); //改变弹框的页脚位置
    }
  }

  function getMockDataUrl(modelPath, action) {
    var model = null;
    var currentModel = null;

    $.ajax({
      url: modelPath,
      async: false
    }).done(function(res) {
      model = res;
    });

    for (var i = 0; i < model.models.length; i++) {
      if (model.models[i]['name'] == action) {
        currentModel = model.models[i];
        break;
      }
    }

    return currentModel.url;
  }

  function compile(template, data) {

    var compileTemplate = null;

    if (typeof(template) === 'object') {
      compileTemplate = template;
    } else {
      compileTemplate = Hogan.compile(template);
    }

    return compileTemplate.render(data);
  }



  /**
   * 这里是关键
   * 定义一个插件 plugin
   */
  $.fn.emapCard = function(options, params) {
    var instance;
    instance = this.data('emapCard');
    /**
     * 判断插件是否已经实例化过，如果已经实例化了则直接返回该实例化对象
     */
    if (!instance) {
      return this.each(function() {
        //将实例化后的插件缓存在dom结构里（内存里）
        return $(this).data('emapCard', new Plugin(this, options));
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
      return instance[options](params);
    }
    return this;
  };

  /**
   * 插件的默认值
   */
  $.fn.emapCard.defaults = {
    template: 'no template!', //渲染卡片的模板
    pagePath: null, //页面模型
    action: null, //页面动作
    pageMode: 'advanced', //advanced simple
    pageable: true,
    pageSizeOptions: [12, 24, 48, 96],
    pageSize: 12,
    params: {}
  };
})(jQuery);

(function (WIS_EMAP_CONFIG, undefined) {
    WIS_EMAP_CONFIG.getOptionType = 'POST';
})(window.WIS_EMAP_CONFIG = window.WIS_EMAP_CONFIG || {});
(function () {
    var Plugin;

    /**
     * @module emapdatatable
     * @description 数据表格
     */
    Plugin = (function () {
        function Plugin(element, options) {
            //将插件的默认参数及用户定义的参数合并到一个新的obj里
            this.settings = $.extend({}, $.fn.emapdatatable.defaults, options);
            //将dom jquery对象赋值给插件，方便后续调用
            this.$element = $(element);
            this.$element.attr("emap-role", "datatable").attr("emap-pagePath", this.settings.pagePath).attr("emap-action", this.settings.action);

            //拼接请求地址
            var url = this.settings.url || WIS_EMAP_SERV.getAbsPath(this.settings.pagePath).replace('.do', '/' + this.settings.action + '.do');

            //前端模拟数据开发时type使用get方式
            var ajaxMethod = this.settings.method || 'POST';
            if (typeof window.MOCK_CONFIG != 'undefined') {
                //qiyu 2016-7-21 将emapdatatable中的获取mock的url提取函数，在mock文件中重新定义
                ajaxMethod = this.settings.method || getMethodMock();
                if (typeof this.settings.url == 'undefined') {
                    url = getURLMock(url, this.settings);
                }
                // ajaxMethod = this.settings.method || 'GET';
                // if (typeof this.settings.url == 'undefined') {
                //     var models = BH_UTILS.doSyncAjax(url, {}, ajaxMethod).models;
                //     for (var i = 0; i < models.length; i++) {
                //         if (models[i].name == this.settings.action) {
                //             url = models[i].url;
                //             break;
                //         }
                //     }
                // }
            }
            var params = $.extend({}, this.settings.params, this.settings.onceParams);
            //数据源
            this.source = {
                root: 'datas>' + this.settings.action + '>rows',
                id: this.settings.pk || 'WID', // id: "WID", 主键字段可配置  //qiyu 2016-1-16
                datatype: 'json',
                url: url,
                data: params || {},
                type: ajaxMethod,
                datafields: []
            };

            //qiyu 2016-7-21 将emapdatatable中的获取mock的url提取函数，在mock文件中重新定义
            if (typeof window.MOCK_CONFIG != 'undefined') {
                this.source = getSourceMock(this.source);
            }

            _create(this);
        }

        /**
         * @method reload
         * @description 刷新表格数据
         * @param {Object} params - 附带参数
         * @param {Object} params._gotoFirstPage -
         * callback 可以是function 或者是 true，true的话意味着强制跳回第一页
         * _gotoFirstPage 如果callback为回调函数，此时需要调回第一页 则可以设置params._gotoFirstPage为true
         *
         */
        Plugin.prototype.reload = function (params, callback) {
            /**
             * 方法内容
             */
            var gotoFirstPage = params._gotoFirstPage;
            gotoFirstPage && delete params._gotoFirstPage;
            this.source.data = params;
            if (callback === true || gotoFirstPage === true) {
                if (!this.$element.jqxDataTable('goToPage', 0)) {
                    this.$element.jqxDataTable('updateBoundData');
                }
            } else {
                this.$element.jqxDataTable('updateBoundData');
            }

            var that = this;
            if (typeof callback == 'function') {
                var intervalId = setInterval(function () {
                    if (that.$element.jqxDataTable('isBindingCompleted')) {
                        clearInterval(intervalId);
                        // 将callback放在 refresh后面， 避免callback中的dom操作被refresh刷新掉 zhuhui 2016-10-21
                        that.$element.jqxDataTable('refresh');
                        callback();
                    }
                }, 10);
            }
        };

        /**
         * @method reloadFirstPage
         * @description 默认刷新表格回到首页
         * @param {Object} params - 附带参数
         * @param {Function} callback - 回调函数
         */
        Plugin.prototype.reloadFirstPage = function (params, callback) {
            this.reload($.extend({}, params, {
                _gotoFirstPage: true
            }), callback);
        };

        /**
         * @method checkedRecords
         * @description 获取选中的数据
         */
        Plugin.prototype.checkedRecords = function () {
            var selectedArr = [];
            var rowsData = this.$element.jqxDataTable('getRows');
            var $checkedSelector = this.$element.find('table:not([id^="pinnedtable"]) tr');
            if (this.$element.find('table[id^="pinnedtable"]').length > 0) {
                $checkedSelector = this.$element.find('table[id^="pinnedtable"] tr');
            }
            $checkedSelector.each(function (index) {
                var ischecked = $(this).find('input[type="checkbox"]').prop('checked');
                if (ischecked) {
                    selectedArr.push(rowsData[index]);
                }
            });
            return selectedArr;
        };

        /**
         * @method getTotalRecords
         * @description 获取数据总条数
         */
        Plugin.prototype.getTotalRecords = function () {
            return this.source.totalRecords;
        };

        /**
         * @method getResult
         * @description 获取当前表格内数据
         */
        Plugin.prototype.getResult = function () {
            return this.$element.data('tableResult');
        };

        /**
         * @method getSort
         * @description 获取表格排序
         */
        Plugin.prototype.getSort = function () {
            var args = this.$element.data("sortfield");

            if (args === undefined)
                return;

            var sortObj = {
                direction: args.sortdirection,
                field: args.sortcolumn,
                exp: ""
            };
            var exp = "";
            if (args.sortdirection.ascending == true) {
                sortObj.exp = "+" + args.sortcolumn;
            } else if (args.sortdirection.descending == true) {
                sortObj.exp = "-" + args.sortcolumn;
            }

            return sortObj;
        };

        /**
         * @method getModel
         * @description 获取表格数据
         */
        Plugin.prototype.getModel = function () {
            return this.$element.data('tableDataModel');
        };

        /**
         * @method selectColumnsExport
         * @description 导出 表格数据， 列为选择列
         *
         * @param  {object} params
         *
         *  【url】：
            /[root]/sys/emapcomponent/imexport/export.do

           【参数 params】：
            root:
            app：调用导出的应用名称，必填
            module：调用导出的模块名，必填
            page：调用导出的页面，必填
            action：调用导出的动作，必填
            colnames：导出时自定义的字段，多个用逗号分隔，选填  toUpperCase
            analyse：自定义的导出过程分析服务，实现IImportAnalyse，选填
            write：自定义的导出写文件服务，实现IExportWrite，选填
            filename：自定义的导出文件名，选填
         *
         */
        Plugin.prototype.selectColumnsExport = function (params) {
            this.selectToShowColumns({
                type: 'export',
                params: params
            });
        };

        /**
         * @method selectToShowColumns
         * @description 展开选择列窗口
         * @param  {object} action 动作
         *    {
         *        type: //action type, 内置动作有 toggle(默认),export
         *        handler: //action handler
         *        param:  //action hander 的参数
         *    }
         *    'toggle'  显示选择的列，隐藏未选择的列,默认值
         *    'export'  导出表单， 支持选择列
         * @param {object} params  action 动作 所需的参数
         */
        Plugin.prototype.selectToShowColumns = function (action) {
            var self = this;
            action.type = action.type || 'toggle';

            //默认动作
            // if(action.type === 'toggle')
            // {
            //
            //     action['name'] = '显示/隐藏字段';
            //     action['handler'] = function(columns) {
            //             self.$element.jqxDataTable({
            //                 columns: columns
            //             });
            //
            //             if (self.settings.schema && self.settings.contextPath) { // if rememberCustomColumn , save columns
            //                 _saveSchema(self, columns);
            //             }
            //
            //         };
            //
            // }
            // else

            // 表格传参时,为了方便高级搜索会将其他参数合并进来,  其中有可能含有type 所以 此处默认走 隐藏显示列
            // zhuhui 6-8
            if (action.type === 'export') {
                action['name'] = '导出选择字段';
                action['handler'] = function (columns) {
                    var config, selectedCols;

                    selectedCols = [];
                    columns.forEach(function (col) {
                        if (col.hidden === false && col.hasOwnProperty('datafield')) {
                            selectedCols.push(col.datafield);
                        }
                    });

                    config = $.extend({}, action.params, {
                        colnames: selectedCols.join(',').replace(/_DISPLAY/g, '').toUpperCase()
                    });
                    self.export(config);
                };
            } else {
                action['name'] = '显示/隐藏字段';
                action['handler'] = function (columns) {
                    if (self.settings.fastRender) {
                        columns = columns.filter(function (item) {
                            return !item.hidden;
                        })
                    }

                    self.$element.jqxDataTable({
                        columns: columns
                    });
                    // self.$element.data('columns', columns)
                    if (self.settings.schema && self.settings.contextPath) { // if rememberCustomColumn , save columns
                        _saveSchema(self, columns);
                    }

                };
            }


            var columns = this.$element.data('columns');
            var newmodel = this.$element.data('newmodel');
            _initSelectColumnsWindow(this, newmodel, columns, action);
        };

        /**
         * @method export
         * @description 导出表格数据
         * @param {Object} config - 配置参数，导出请求参数
         * @param {String} config.root - 根路径
         */
        Plugin.prototype.export = function (config) {
            var root = config.root;
            delete config.root;
            $.ajax({
                    url: root + '/sys/emapcomponent/imexport/export.do',
                    data: config,
                    type: 'POST'
                })
                .done(function (res) {
                    res = JSON.parse(res);
                    window.location = location.protocol + '//' + location.host + root + '/sys/emapcomponent/file/getAttachmentFile/' + res.attachment + '.do';
                });
        };

        /**
         * @method  getVisibleColumns
         * @description 获取当前表格内所有现实的列
         * @return {Array} 可视的列
         */
        Plugin.prototype.getVisibleColumns = function () {
            var columns = this.$element.data('columns');
            if (columns && columns.length) {
                return columns.filter(function (item) {
                    return item.hidden === false;
                });
            }
            return [];
        };

        return Plugin;

    })();

    /**
     * 插件的私有方法
     */
    //生成表格
    function _create(instance) {
        if (!instance.settings.contextPath) {
            instance.settings.contextPath = WIS_EMAP_SERV.getContextPath();
        }
        var jqxOptions = $.extend({}, instance.settings);
        try {
            delete jqxOptions.pk; //qiyu 2016-1-16
            delete jqxOptions.url;
            delete jqxOptions.pagePath;
            delete jqxOptions.params;
            delete jqxOptions.datamodel;
            delete jqxOptions.method;
            delete jqxOptions.action;
            delete jqxOptions.customColumns;
            delete jqxOptions.colHasMinWidth;
            delete jqxOptions.beforeSend;
            delete jqxOptions.downloadComplete;
            delete jqxOptions.schema;
            delete jqxOptions.contextPath;
            delete jqxOptions.searchElement;
            delete jqxOptions.minLineNum;
            delete jqxOptions.onceParams;
            delete jqxOptions.alwaysHide;
            delete jqxOptions.customModelName;
            delete jqxOptions.formatData;
            delete jqxOptions.fastRender;
        } catch (e) {

        }


        var dataAdapter = new $.jqx.dataAdapter(instance.source, {
            // contentType: 'application/json',
            formatData: function (data) {
                if (jqxOptions.pageable) {
                    data.pageSize = data.pagesize;
                    data.pageNumber = data.pagenum + 1;
                }

                var sortorder = '+';
                if (jqxOptions.sortable && data.sortdatafield && data.sortorder) {
                    if (data.sortorder == 'asc') {
                        sortorder = '+';
                    } else if (data.sortorder == 'desc') {
                        sortorder = '-';
                    }
                    data['*order'] = sortorder + data.sortdatafield.split('_DISPLAY')[0];
                }

                if (instance.settings.formatData && typeof instance.settings.formatData == 'function') {
                    data = instance.settings.formatData(data);
                }
                try {
                    delete data.pagesize;
                    delete data.pagenum;
                    delete data.filterslength;
                    delete data.sortdatafield;
                    delete data.sortorder;
                } catch (e) {}
                return data;
            },
            processData: function (data) {
                console.log('processData', data);
            },
            beforeSend: function (xhr) {
                if (typeof instance.settings.beforeSend === 'function') {
                    instance.settings.beforeSend.call(this, arguments);
                }
            },
            downloadComplete: function (data, status, xhr) {
                // 添加downloadComplete 回调  zhuhui 0726
                if (typeof instance.settings.downloadComplete === 'function') {
                    instance.settings.downloadComplete(data, status, xhr);
                }
                //如果未登录则跳转至登录地址
                // console.log("emapdatatable:------------");
                // console.log(data);
                // console.log(xhr);
                // console.log(status);
                // console.log("-----------:emapdatatable");
                if (typeof data.loginURL != 'undefined' && data.loginURL != '') {
                    window.location.href = data.loginURL;
                    return;
                }

                //qiyu 2016-7-21 将emapdatatable中的获取mock的url提取函数，在mock文件中重新定义
                if (typeof window.MOCK_CONFIG != 'undefined') {
                    instance.source.totalRecords = getTotalRecordsMock(data, instance.settings.action);
                } else {
                    instance.source.totalRecords = data.datas[instance.settings.action].totalSize || data.datas[instance.settings.action].total_size;
                }
                // instance.source.totalRecords = data.datas[instance.settings.action].totalSize || data.datas[instance.settings.action].total_size;


                //qiyu 2016-6-8 解决翻页总数刷新问题
                //instance.source.totalrecords = instance.source.totalRecords;

                instance.$element.data('tableResult', data);

                // 联动高级搜索的
                if (instance.settings.searchElement && instance.settings.searchElement.length > 0) {
                    instance.settings.searchElement.emapAdvancedQuery('updateTotalNum', (instance.source.totalRecords ? instance.source.totalRecords : 0));
                }
            }
        });

        //保存调用组件时传进来的ready和rendered函数。因为后面checkbox会复写此函数
        var custom_ready = jqxOptions.ready;
        var custom_rendered_tmp = jqxOptions.rendered;

        var custom_rendered = jqxOptions.rendered = function () {
            //处理无排序时表格列背景色及排序按钮背景色问题
            _handleSortStyle(instance);
            if (typeof custom_rendered_tmp === 'function') {
                custom_rendered_tmp();
            }
        };

        jqxOptions.columns = _genColums(instance, jqxOptions, custom_ready, custom_rendered);
        jqxOptions.source = dataAdapter;

        instance.$element.jqxDataTable(jqxOptions);

        instance.$element.on('sort', function (event) {
            var args = event.args;
            // column's data field.
            //var sortcolumn = args.sortcolumn;
            instance.$element.data("sortfield", args);
        });

        instance.$element.on('bindingComplete', function (event) {
            //qiyu 2016-8-12 RS-1148 列表中当数据量不到分页数的时候不显示分页，戴秀月
            var pager = instance.$element.jqxDataTable("getPageInformation");
            /*var pageable = instance.$element.jqxDataTable("pageable");
            if(pageable){
                if(pager.totalrecords <= pager.pagesize){
                    var without_pager_height = instance.$element.jqxDataTable("height") - 37;
                    if (without_pager_height < 0)without_pager_height = null;
                    instance.$element.jqxDataTable({ pageable:false, height: without_pager_height});
                }
            }else{
                if(pager.totalrecords > pager.pagesize){
                    var with_pager_height = instance.$element.jqxDataTable("height");
                    if(with_pager_height != null)with_pager_height = with_pager_height + 37;
                    instance.$element.jqxDataTable({ pageable:true, height: with_pager_height});
                }
            }*/

            _handleSortStyle(instance);
            _handleMinHeight(instance);
            _handleHorizontalScrollBar(instance);
            _handleVerticalScrollBar(instance);
            _resetPageFooter(instance);

        });

        //qiyu 2016-6-7 增加创建时事件，用于提供给产品线，创建后的行为。需求人：孟斌。如：表格默认增加右侧自定义显示列
        instance.$element.trigger("emapdatatable.created", [instance]);
    }

    //在纸质弹窗中的页面，改变分页大小，需要重置页脚
    function _resetPageFooter(instance) {
        //当弹框内容的高度出现变化的时候调用以下两个方法
        if (instance.$element.closest(".bh-paper-pile-dialog").length > 0) {
            $.bhPaperPileDialog.resetPageFooter(); //改变页面的页脚位置
            $.bhPaperPileDialog.resetDialogFooter(); //改变弹框的页脚位置
        }
    }

    /**
     * 处理出现横向滚动条后导致的纵向滚动条
     */
    function _handleHorizontalScrollBar(instance) {
        var id = instance.$element.attr('id');
        //qiyu 2016-9-21 希望永远不显示纵向滚动条，判断依此调整，处理出现横向滚动条后导致的纵向滚动条
        // var $selector = $('#horizontalScrollBar' + id);
        var $selector = $('#verticalScrollBar' + id);
        if ($selector.css('visibility') != 'hidden') {
            var height = instance.$element.jqxDataTable('height');
            if (height != null) {
                //qiyu 2016-9-14 解决刷新会不断增高的问题，之前的临时方案是设置表格的height=null
                //instance.$element.jqxDataTable('height', height + 17);
                //qiyu 2016-9-21 调整行高为10px
                instance.$element.jqxDataTable('height', height + 10);
            }
        }
    }

    /**
     * 处理表格行高因自定义内容被撑大后，出现纵向滚动条问题
     */
    function _handleVerticalScrollBar(instance) {
        var id = instance.$element.attr('id');
        var $selector = $('#verticalScrollBar' + id);
        var rowsData = instance.$element.jqxDataTable('getRows');
        var minLineNum = instance.settings.minLineNum;
        if (minLineNum == null || isNaN(minLineNum)) {
            return;
        }
        if ($selector.css('visibility') != 'hidden' && rowsData.length <= minLineNum) {
            instance.$element.jqxDataTable('height', null);
        }
    }
    /**
     * 处理表格最小高度
     */
    function _handleMinHeight(instance) {
        var rowsData = instance.$element.jqxDataTable('getRows');
        var minLineNum = instance.settings.minLineNum;

        if (minLineNum == null || isNaN(minLineNum)) {
            return;
        }

        if (rowsData.length < minLineNum) {
            instance.$element.jqxDataTable('height', BH_UTILS.getTableHeight(parseInt(minLineNum)));
        } else {
            instance.$element.jqxDataTable('height', null);
        }

    }

    /**
     * 初始化 schema, 如果启用schema， 则返回 schema 的数据
     * @param  {object} instance
     * @param  {string} modelName
     */
    function _initSchema(instance, modelName, contextPath) {
        var $elem = instance.$element;
        var res;
        if (!instance.settings.schema || !instance.settings.contextPath) { //disable schema
            return false;
        }
        //TODO: enable schema
        $elem.emapSchema({
            schemaType: 'col',
            contextPath: contextPath,
            data: {
                modelName: modelName
            }
        });

        res = $elem.emapSchema('getSchemaList')
        if (res && res[0] && res[0].CONTENT) {
            return res[0].CONTENT.split(',')
        }
        return []
    }

    function _handleSortStyle(instance) {
        //处理无排序时表格列背景色问题
        var sortObj = instance.$element.data("sortfield");
        if (typeof sortObj == 'undefined' || (sortObj.sortdirection.ascending == false && sortObj.sortdirection.descending == false)) {
            instance.$element.find('td.jqx-grid-cell-sort').removeClass('jqx-grid-cell-sort');
        }

        //处理表格排序按钮背景色问题
        instance.$element.find('div.sortasc, div.sortdesc').css('background', 'none');
    }

    /**
     * 生成表格列
     * @param  {any} instance
     * @param  {any} jqxOptions
     * @param  {any} custom_ready
     * @param  {any} custom_rendered
     */
    function _genColums(instance, jqxOptions, custom_ready, custom_rendered) {
        var columns = [],
            schemaList;

        var datamodel = instance.settings.datamodel ||
            WIS_EMAP_SERV.getModel(instance.settings.pagePath, instance.settings.action, "grid", instance.settings.params);
        //保存datamodel
        instance.$element.data('tableDataModel', datamodel);

        instance.$element.attr("emap", JSON.stringify({
            "emap-pagePath": instance.settings.pagePath,
            "emap-action": instance.settings.action,
            "emap-url": WIS_EMAP_SERV.url,
            "emap-name": WIS_EMAP_SERV.name,
            "emap-app-name": WIS_EMAP_SERV.appName,
            "emap-model-name": WIS_EMAP_SERV.modelName
        }));
        schemaList = _initSchema(instance, WIS_EMAP_SERV.modelName || instance.settings.customModelName, instance.settings.contextPath);
        delete WIS_EMAP_SERV.url;
        delete WIS_EMAP_SERV.name;
        delete WIS_EMAP_SERV.appName;
        delete WIS_EMAP_SERV.modelName;

        var cusColLen = 0;
        var customColumns = instance.settings.customColumns;
        if (typeof customColumns != 'undefined' && customColumns != null) {
            cusColLen = customColumns.length;
        }

        //重新组织datamodel
        //type为link时只能为某列快速设置为链接类型，该列必须是模型中已经存在的数据列（此设定为兼容上一版本）
        var newmodel = [];
        var lastcolumn = null;
        var linkCol = [];
        for (var i = 0; i < cusColLen; i++) {
            var colIndex = customColumns[i].colIndex;
            var colField = customColumns[i].colField;
            var type = customColumns[i].type;
            if (colIndex > 40) {
                colIndex = 'last';
            }
            if (colIndex == 'last') {
                lastcolumn = customColumns[i];
            } else if (typeof colField != 'undefined' && colField != '') {
                for (var j = 0; j < datamodel.length; j++) {
                    if (datamodel[j].name == colField) {
                        datamodel[j].custom = customColumns[i];
                    }
                }
            } else if (colIndex != 'undefined') {
                colIndex = colIndex < 0 ? 0 : colIndex;

                //兼容上一版本设定
                if (type != 'link') {
                    newmodel[colIndex] = {
                        custom: customColumns[i]
                    }
                } else {
                    linkCol.push({
                        colIndex: colIndex,
                        column: customColumns[i]
                    });
                }

            }
        }
        //datamodel保存至source的datafields数组中
        for (var m = 0; m < datamodel.length; m++) {
            if (typeof datamodel[m].get == 'function') {
                instance.source.datafields.push({
                    name: datamodel[m].name,
                    type: 'string'
                });
                if (typeof datamodel[m].url != 'undefined') {
                    instance.source.datafields.push({
                        name: datamodel[m].name + '_DISPLAY',
                        type: 'string'
                    });
                }
            }
        }
        for (var k = 0; k < newmodel.length; k++) {
            if (newmodel[k] == undefined) {
                if (datamodel.length > 0) {
                    newmodel[k] = datamodel.shift();
                } else {
                    newmodel.splice(k, 1);
                    k--;
                }
            }
        }

        if (datamodel.length > 0) {
            newmodel = newmodel.concat(datamodel);
        }

        if (lastcolumn != null) {
            newmodel.push({
                custom: lastcolumn
            });
        }

        var datafield;
        var _col;
        var thiner_columns = [];
        var isFastRender = instance.settings.fastRender;
        for (var n = 0; n < newmodel.length; n++) {
            //设置自定义列类型为link，且指定了colIndex的项
            for (var t = 0; t < linkCol.length; t++) {
                if (n == linkCol[t].colIndex) {
                    newmodel[n].custom = linkCol[t].column;
                }
            }
            //设置数据类型全部是string
            if (typeof newmodel[n].name != 'undefined') {
                instance.source.datafields.push({
                    name: newmodel[n].name,
                    type: 'string'
                });
            }
            if (typeof newmodel[n].url != 'undefined') {
                datafield = newmodel[n].name + '_DISPLAY';
                instance.source.datafields.push({
                    name: datafield,
                    type: 'string'
                });
            } else {
                datafield = newmodel[n].name
            }

            var width = null;
            var widthObj = {};
            var isHidden = newmodel[n].hidden === true || newmodel[n]['grid.hidden'] === true;
            if (typeof newmodel[n].get == 'function') {
                isHidden = isHidden || newmodel[n].get('hidden') === true;
            }

            //schema: schema 权重高于 hidden属性， 如果不在schemaList中，则隐藏该列
            if (instance.settings.schema && schemaList && schemaList.length && newmodel[n].name && newmodel[n]['grid.fixed'] !== true) {
                _col = newmodel[n].name
                    // _col.replace('_DISPLAY', '');
                    // isHidden = $.inArray(_col, schemaList) === -1

                var arrNoDisplay = schemaList.map(function (val) {
                    return val.replace('_DISPLAY', '');
                })
                isHidden = $.inArray(_col, arrNoDisplay) === -1
            }

            //固定列属性pinned 默认值
            var pinned = false;
            //从后台模型中读取固定列属性pinned
            pinned = newmodel[n].pinned;
            if (pinned !== true) {
                pinned = false;
            }
            // 默认列宽为100px
            if (newmodel[n].custom == undefined) {
                width = newmodel[n]['grid.width'] == undefined ? null : newmodel[n]['grid.width'];
                widthObj = _genWidthObj(width, instance.settings.colHasMinWidth);
                var dCol = $.extend({}, {
                    text: newmodel[n].caption,
                    datafield: datafield,
                    hidden: isHidden,
                    pinned: pinned,
                    cellsRenderer: function (row, column, value, rowData) {
                        return '<span title="' + $("<div>" + value + "</div>").text() + '">' + value + '</span>';
                    }
                }, widthObj);
                columns.push(dCol);
                if (isFastRender && _canColFastRender(dCol)) {
                    thiner_columns.push(dCol);
                }
            } else {
                var type = newmodel[n].custom.type;
                var showCheckAll = newmodel[n].custom.showCheckAll;
                width = newmodel[n].custom.width;
                if (width == undefined) {
                    width = newmodel[n]['grid.width'] == undefined ? null : newmodel[n]['grid.width'];
                }
                widthObj = _genWidthObj(width, instance.settings.colHasMinWidth);
                var col = _genCustomColumns(type, instance, jqxOptions, showCheckAll, widthObj, newmodel[n], datafield, custom_ready, custom_rendered);
                var cCol = $.extend({
                    hidden: isHidden,
                    pinned: pinned
                }, col);
                columns.push(cCol);
                if (isFastRender) {
                    thiner_columns.push(cCol);
                }
            }
        }

        if (isFastRender) {
            instance.$element.data('newmodel', newmodel);
            instance.$element.data('columns', columns);
            return thiner_columns;
        } else {
            instance.$element.data('newmodel', newmodel);
            instance.$element.data('columns', columns);
            return columns;
        }
    }

    function _canColFastRender(col) {
        if (col['grid.hidden'] === true) {
            return false;
        } else if (col['grid.hidden'] === undefined && col['hidden'] === true) {
            return false;
        }
        return true;
    }

    function _genWidthObj(width, colHasMinWidth) {
        var widthStr = width == null ? '' : width.toString();
        widthStr = widthStr.replace('px', '').replace('PX', '').replace('%', '');
        widthStr = $.trim(widthStr);
        if (!colHasMinWidth) {
            if (width && widthStr != '' && !isNaN(widthStr)) {
                return {
                    width: width
                };
            }
            return {};
        } else {
            if (width != null && widthStr != '' && !isNaN(widthStr)) {
                width = width.toString();
                width.replace('px', '').replace('PX', '');
                if (width.indexOf("%") == -1 && parseInt(width) < 100) {
                    width = 100;
                }

                return {
                    width: width,
                    minWidth: 100
                };
            }
            return {
                minWidth: 100
            };
        }

    }

    function _saveSchema(instance, columns) {
        var $elem = instance.$element;
        //1. 获取 含有 name的 显示列
        var data = [];
        columns.forEach(function (column) {
            if (column.hasOwnProperty('datafield') && !column.hidden) {
                data.push(column.datafield)
            }
        });
        //2. 保存 显示列 到 schema
        $elem.emapSchema('saveSchema', [
            'emap.table',
            data.join(',')
        ]);
    }
    /*
     *   列表字段的显示隐藏策略
     *   fixed > 保存方案 > 模型配置
     *   保存方案的优先级高于模型中的显示隐藏配置
     *   模型中配置了固定的字段的显示隐藏以模型中的配置为准，优先级高于保存方案
     *
     */
    function _initSelectColumnsWindow(instance, newmodel, columns, action) {
        var itemHtml = '';
        var commonList = [];
        var availableList = [];
        var showNum = 0;
        $.each(columns, function (i, col) {
            // 排除自定义列和checkbox列
            if (!col.datafield || col.datafield == 'field_checkbox' || col.datafield == 'field_radio') {
                return;
            }
            // 固定字段的处理
            var fixed = newmodel[i].fixed || newmodel[i]['grid.fixed'];
            var colHidden = col.hidden;

            if (fixed) {
                if (newmodel[i]['grid.hidden'] !== undefined) {
                    colHidden = newmodel[i]['grid.hidden'];
                } else {
                    colHidden = newmodel[i]['hidden'];
                }
            }
            if (instance.settings.alwaysHide.length && $.inArray(col.datafield.replace('_DISPLAY', ''), instance.settings.alwaysHide) > -1) {
                fixed = true;
                colHidden = true;
            }
            if (colHidden) {
                // 模型里的参数里的alwaysHide 字段不展示 6-6  zhuhui
                // 模型里 hidden 并且 fixed 的字段不展示
                // 已隐藏字段

                itemHtml = ' <li class="bh-col-md-3" ' + (fixed ? 'style="display: none;line-height: 32px;"' : '') + '>' +
                    '<div class="bh-checkbox bh-str-cut" title="' + col.text + '"><label><input type="checkbox" name="' + col.datafield + '" data-caption="' + col.text + '">' +
                    '<i class="bh-choice-helper"></i>' + col.text +
                    '</label></div>' +
                    '</li>';
                availableList.push(itemHtml);
                if (!fixed) {
                    showNum++;
                }
            } else {
                //已显示字段
                itemHtml = ' <li class="bh-col-md-3" style="line-height: 32px;">' +
                    '<div class="bh-checkbox bh-str-cut" title="' + col.text + '"><label><input type="checkbox" ' + (fixed ? 'disabled' : '') + ' name="' + col.datafield + '" data-caption="' + col.text + '" checked>' +
                    '<i class="bh-choice-helper"></i>' + col.text +
                    '</label></div>' +
                    '</li>';
                availableList.push(itemHtml);
                showNum++;
            }
            if (newmodel[i].common) {
                commonList.push(itemHtml);
            }
        });
        var remainder = showNum % 6;
        if (remainder) {
            for (var i = 0; i < (6 - remainder); i++) {
                availableList.push('<li class="bh-col-md-3">');
            }
        }
        if (commonList.length % 6) {
            var remaind = commonList.length % 6;
            for (var j = 0; j < (6 - remaind); j++) {
                commonList.push('<li class="bh-col-md-3" style="line-height: 32px;">');
            }
        }
        var dialog = '<div class="bh-emapdatatable-dialog">' +
            '<div><h2>' + action.name + '</h2></div>' +
            '<div class="bh-emapdatatable-dialog-content">' +
            '<div>' +
            (commonList.length ?
                '<div class="bh-clearfix">' +
                '<div class="bh-checkbox bh-mb-8"><label><input type="checkbox" bh-emapdatatable-role="selectAllField">' +
                '<i class="bh-choice-helper"></i><b>全选</b>' +
                '</label></div>' +
                '<ul class="bh-emapdatatable-dialog-list" bh-emapdatatable-role="commonList" style="list-style:none">' + commonList.join('') + '</ul>' +
                '</div>' : '') +
            '<div class="bh-text-caption bh-color-caption">可用字段（' + showNum + '）</div>' +
            '<div class="bh-clearfix">' +
            '<div class="bh-checkbox bh-mb-8" style="padding-left: 12px;"><label><input type="checkbox" bh-emapdatatable-role="selectAllField">' +
            '<i class="bh-choice-helper"></i><b>全选</b>' +
            '</label></div>' +
            '<div style="height:206px; overflow-y: auto;overflow-x: hidden;">' +
            '<ul class="bh-emapdatatable-dialog-list bh-bColor-info-3 bh-clearfix" bh-emapdatatable-role="availableList" style="list-style:none;">' + availableList.join('') + '</ul>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="bh-mt-16 bh-mr-4 bh-text-right">' +
            '<button bh-emapdatatable-role="confirmSelecte" class="bh-btn bh-btn-primary">确认</button>' +
            '<button bh-emapdatatable-role="cancel" class="bh-btn bh-btn-default">取消</button>' +
            '</div>' +
            '</div>';
        instance.$element.after(dialog);
        var $dialog = instance.$element.next();
        $dialog.jqxWindow({
                resizable: false,
                draggable: true,
                isModal: true,
                modalOpacity: 0.3,
                width: 800,
                height: 400,
                autoOpen: false,
                position: [window.innerWidth / 2 - 800 / 2, window.innerHeight / 2 + $(window).scrollTop() - 200]
            })
            .on('close', function () {
                $('body').niceScroll();
            })
            .on("open", function () {
                $('body').getNiceScroll().remove(); // 弹框弹出式页面居中并 禁止页面滚动
                $('body').css({
                    overflow: 'hidden',
                    'overflow-x': 'hidden',
                    'overflow-y': 'hidden'
                });
            });

        _bindEvent(instance, $dialog, columns, action);
        $dialog.jqxWindow('open');
    }

    /**
     * 选择列 窗口的 事件绑定
     * @param  {object} instance this
     * @param  {object} $dialog  jqxWindow
     * @param  {object} columns  窗口的列
     * @param  {function} action   确定按钮的回调动作, 在打开窗口selectToShowColumns 中就已确定
     */
    function _bindEvent(instance, $dialog, columns, action) {
        var _$dialog = $dialog;
        var _columns = columns;
        _$dialog.on('click', '[bh-emapdatatable-role="confirmSelecte"]', function () {
            if ($(this).attr('disabled')) {
                return;
            }
            _$dialog.find('input[type="checkbox"]:not([bh-emapdatatable-role="selectAllField"])').each(function () {
                var name = $(this).attr('name');
                var targetCol = {};
                for (var i = 0; i < _columns.length; i++) {
                    if (_columns[i].datafield == name) {
                        targetCol = _columns[i];
                        break;
                    }
                }
                if ($(this).prop('checked')) {
                    targetCol.hidden = false;
                } else {
                    targetCol.hidden = true;
                }
            });

            action.handler(_columns);

            _$dialog.jqxWindow('close');
        });

        _$dialog.on('click', '[bh-emapdatatable-role="cancel"]', function () {
            _$dialog.jqxWindow('close');
        });

        _$dialog.on('close', function () {
            _$dialog.jqxWindow('destroy');
        });


        _$dialog.on('open', function () {
            $(this).find('[bh-emapdatatable-role="selectAllField"]').each(function () {
                var $checkbox = $(this).closest('.bh-checkbox').next().find('li:visible input:not(:disabled)');
                var isAllSelected = $checkbox.filter(':not(:checked)').length === 0;
                $(this).prop('checked', isAllSelected);
            });
        });

        $dialog.find('input[bh-emapdatatable-role="selectAllField"]').change(function () {
            var $checkbox = $(this).closest('.bh-checkbox').next().find('li:visible input');
            $checkbox.filter(':not(:disabled)').prop('checked', $(this).prop('checked'));
            var disabled = !$(this).prop('checked');
            $checkbox.filter(':disabled').each(function () {
                if ($(this).prop('checked')) {
                    disabled = false;
                    return false;
                }
            });
            $dialog.find('[bh-emapdatatable-role="confirmSelecte"]').attr('disabled', disabled);
        });

        $dialog.find('li input').change(function () {
            var $list = $(this).closest('.bh-emapdatatable-dialog-list');
            if (!$(this).prop('checked')) {
                $list.parent().prev().find('input[bh-emapdatatable-role="selectAllField"]').prop('checked', false);
            } else {
                var isAllChecked = true;
                $list.find('li:visible input:not(:disabled)').each(function () {
                    if (!$(this).prop('checked')) {
                        isAllChecked = false;
                        return false;
                    }
                });
                $list.parent().prev().find('input[bh-emapdatatable-role="selectAllField"]').prop('checked', isAllChecked);
            }
            $dialog.find('[bh-emapdatatable-role="confirmSelecte"]').attr('disabled', !$dialog.find('li:visible input:checked').length);
        });
    }

    /**
     * 生成自定义列
     * @param  {String} type 自定义列类型
     * @return {Object}       自定义列column
     */
    function _genCustomColumns(type, instance, jqxOptions, showCheckAll, widthObj, model, datafield, custom_ready, custom_rendered) {
        var column = null;
        // checkbox列不可排序
        switch (type) {
            case 'checkbox':
                var pinned = model.custom.pinned;
                if (pinned !== true) {
                    pinned = false;
                }
                column = {
                    text: 'checkbox',
                    datafield: 'field_checkbox',
                    //qiyu 2016-11-21 checkbox列增加标示，解决改变宽度后checkbox状态丢失的问题
                    cellClassName: 'datatable-checkbox-column',
                    width: 32,
                    minWidth: 32,
                    maxWidth: 32,
                    cellsAlign: 'center',
                    align: 'center',
                    sortable: false,
                    pinned: pinned,
                    renderer: function (text, align, height) {
                        var checkBox = '<div class="selectAllCheckboxFlag bh-checkbox bh-mh-8"><label><input type="checkbox" value=""><i class="bh-choice-helper"></i></label></div>';
                        if (showCheckAll === false) {
                            return ' ';
                        }
                        return checkBox;
                    },
                    rendered: function (element, align, height) {
                        //头部的checkbox点击事件的绑定
                        element.on("click", "input", function (e) {
                            var $table = instance.$element;
                            var $tableContent = $table.find('table:not([id^="pinnedtable"])');
                            if ($table.find('table[id^="pinnedtable"]').length > 0) {
                                $tableContent = $table.find('table[id^="pinnedtable"]');
                            }
                            var $checkboxList = $tableContent.find("div.bh-checkbox");

                            var $input = $(this);
                            if ($input.hasClass("selectFlag")) {
                                $input.prop("checked", false).removeClass("selectFlag");
                                $checkboxList.each(function () {
                                    $(this).find("input").prop("checked", false);
                                });
                            } else {
                                $input.prop("checked", true).addClass("selectFlag");
                                $checkboxList.each(function () {
                                    $(this).find("input").prop("checked", true);
                                });
                            }

                            //触发自定义全选按钮事件
                            $(this).trigger('checkall');
                            e.stopPropagation();
                        });
                        return true;
                    },
                    cellsRenderer: function (row, column, value, rowData) {
                        //qiyu 2016-11-21 checkbox列增加标示，解决改变宽度后checkbox状态丢失的问题
                        var checked = false;
                        var cbitem = '<input type="checkbox" value="">';
                        var jqcb = $(".datatable-checkbox-column input[type=checkbox]");
                        if (jqcb.length > 0 && jqcb[row]) {
                            checked = jqcb[row].checked;
                            if (checked) {
                                cbitem = '<input type="checkbox" value="" checked>';
                            }
                        }

                        var checkBox = '<div data-sss="" class="bh-checkbox bh-mh-4" style="margin-left:0 !important;"><label>' + cbitem + '<i class="bh-choice-helper"></i></label></div>';
                        //var checkBox = '<div data-sss="" class="bh-checkbox bh-mh-4" style="margin-left:0 !important;"><label><input type="checkbox" value=""><i class="bh-choice-helper"></i></label></div>';

                        return checkBox;
                    }
                };

                //增加处理函数
                jqxOptions.rendered = function () {
                    //数据加载完成，读取各列的checkbox，判断头部的checkbox是否要勾选
                    var $table = instance.$element;
                    var $tableContent = $table.find('table:not([id^="pinnedtable"])');
                    if ($table.find('table[id^="pinnedtable"]').length > 0) {
                        $tableContent = $table.find('table[id^="pinnedtable"]');
                    }
                    var $checkboxList = $tableContent.find("div.bh-checkbox");
                    var isSelectAllFlag = true;
                    if ($checkboxList.length == 0) {
                        isSelectAllFlag = false;
                    }
                    $checkboxList.each(function () {
                        var $itemCheckbox = $(this);
                        if ($itemCheckbox.find("input[checked]").length === 0) {
                            isSelectAllFlag = false;
                            return;
                        }
                    });
                    var $selectAllCheckbox = $tableContent.find("div.selectAllCheckboxFlag").find("input");
                    // if(isSelectAllFlag){
                    //     $selectAllCheckbox.prop("checked", true).addClass("selectFlag");
                    // }else{
                    //     $selectAllCheckbox.prop("checked", false).removeClass("selectFlag");
                    // }
                    if ($selectAllCheckbox.hasClass('selectFlag')) {
                        $checkboxList.find('input').attr('checked', true);
                    }

                    //调用外部定义的rendered函数
                    if (typeof custom_rendered === 'function') {
                        custom_rendered();
                    }
                };

                jqxOptions.ready = function () {
                    //初始化完成后，绑定checkbox的点击事件
                    instance.$element.on("click", "div.bh-checkbox", function () {
                        _scenesTableContentCheckboxClick($(this).find("input"), instance);
                        //触发自定义事件
                        $(this).trigger('checkone');
                    });

                    //调用外部定义的rendered函数
                    if (typeof custom_ready === 'function') {
                        custom_ready();
                    }

                };
                break;

            case 'radio':
                var guid = BH_UTILS.NewGuid();
                var pinned = model.custom.pinned;
                if (pinned !== true) {
                    pinned = false;
                }
                column = {
                    text: 'radio',
                    datafield: 'field_radio',
                    width: 32,
                    minWidth: 32,
                    maxWidth: 32,
                    cellsAlign: 'center',
                    align: 'center',
                    sortable: false,
                    pinned: pinned,
                    renderer: function (text, align, height) {
                        var radio = '选择';
                        return radio;
                    },
                    cellsRenderer: function (row, column, value, rowData) {
                        var radio = '<div data-sss="" class="bh-radio bh-mh-4" style="margin-left:0 !important;"><label style="padding-left: 0;"><input name="' + guid + '" type="radio" value=""><i class="bh-choice-helper"></i></label></div>';
                        return radio;
                    }
                };

                jqxOptions.ready = function () {
                    //初始化完成后，绑定checkbox的点击事件
                    instance.$element.on("click", "div.bh-radio", function () {
                        //触发自定义事件
                        $(this).trigger('checkone');
                    });

                    //调用外部定义的rendered函数
                    if (typeof custom_ready === 'function') {
                        custom_ready();
                    }

                };
                break;
            case 'link':
                var pinned = model.custom.pinned;
                if (pinned !== true) {
                    pinned = false;
                }
                var default_column = {
                    text: model.caption,
                    datafield: datafield,
                    pinned: pinned
                }
                var cus_column = {
                    cellsRenderer: function (row, column, value, rowData) {
                        if (!isNaN(value)) {
                            value = value.toString();
                        }
                        //qiyu 2016-8-31 解决ie9，placeholder插件点击后不再显示的问题
                        // return '<a href="javascript:void(0);" class="j_link_' + column + '">' + value + '</a>';
                        return '<a class="sc-cursor-point j_link_' + column + '">' + value + '</a>';
                    }
                }
                column = $.extend(default_column, cus_column, widthObj);
                break;
            case 'tpl':
                var default_column = {
                    text: model.caption,
                    datafield: datafield,
                    sortable: false //自定义显示列默认不能排序
                }
                column = $.extend(default_column, model.custom.column, widthObj);
        }
        return column;
    }


    /**
     * 点击tbody上的checkbox，处理头部的checkbox是否要勾选
     * @param $input
     */
    function _scenesTableContentCheckboxClick($input, instance) {
        if (!$input.hasClass("selectAllCheckboxFlag")) {
            var $table = instance.$element;
            var $selectAllCheckbox = $table.find("div.selectAllCheckboxFlag").find("input");
            var $tableContent = $table.find("table");
            var $checkboxList = $tableContent.find("div.bh-checkbox");
            if ($input.prop("checked")) {
                var isSelectAllFlag = true;
                $checkboxList.find("input").each(function () {
                    if (!$(this).prop("checked")) {
                        isSelectAllFlag = false;
                    }
                });

                if (isSelectAllFlag) {
                    $selectAllCheckbox.prop("checked", true).addClass("selectFlag");
                } else {
                    $selectAllCheckbox.prop("checked", false).removeClass("selectFlag");
                }
            } else {
                $selectAllCheckbox.prop("checked", false).removeClass("selectFlag");
            }
        }
    }

    /**
     * 这里是关键
     * 定义一个插件 plugin
     */
    $.fn.emapdatatable = function (options, params, callback, flag) {
        var instance, initParams;
        instance = this.data('emapdatatable');
        initParams = this.data('initParams') || {};
        /**
         * 判断插件是否已经实例化过，如果已经实例化了则直接返回该实例化对象
         */
        if (!instance) {
            //params为表格渲染的初始化参数，后续表格的reload始终会携带该参数
            $(this).data('initParams', options.params);
            return this.each(function () {
                //将实例化后的插件缓存在dom结构里（内存里）
                return $(this).data('emapdatatable', new Plugin(this, options));
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
            var paramsObj = $.extend({}, initParams, params);
            var querySetting = [];
            //默认如果请求参数中有高级搜索的参数 会把其他参数合并进高级搜索参数querySetting
            //如果flag为false则不合并。
            if (typeof paramsObj.querySetting == 'undefined') {

            }
            if (typeof paramsObj.querySetting != 'undefined' && flag !== false) {
                querySetting = JSON.parse(paramsObj.querySetting);
                $.each(paramsObj, function (k, v) {
                    if (k != 'querySetting' && ($.type(v) == 'number' || $.type(v) == 'string' || $.type(v) == 'boolean')) {
                        querySetting.push({
                            name: k,
                            value: v,
                            linkOpt: 'and',
                            builder: 'equal'
                        });
                    }
                });
                paramsObj.querySetting = JSON.stringify(querySetting);
            }
            return instance[options](paramsObj, callback);
        }
        return this;
    };

    /**
     * 插件的默认值
     */
    var height = null;
    if (typeof BH_UTILS != 'undefined') {
        height = BH_UTILS.getTableHeight(10);
    }

    var localization = null;
    if (typeof Globalize != 'undefined') {
        localization = Globalize.culture("zh-CN");
    }

    /**
     * @memberof module:emapdatatable
     * @description 其他参数参考jqxDatatable
     * @prop {String} [pk=WID] - 数据主键字段
     * @prop {String} [url] - 请求表格数据的后台接口, url和pagePath二选一必填
     * @prop {String} [pagePath] - 请求表格数据页面地址, url和pagePath二选一必填
     * @prop {Object} params - 请求参数
     * @prop {Array} datamodel - 一般为emap返回的数据模型
     * @prop {String} action - emap动作名
     * @prop {Array} customColumns - 自定义表格列,colIndex:该自定义位于表格第几列，从0开始，最后一列可以设置‘last’； colField: 自定义列作用的列模型字段； type: 自定义列类型，支持checkbox，link，tpl。chekcbox不可定义colField参数，如果定义了colIndex，则customColumns数组必须按照colIndex值由小到大排序
     * @prop {Int|Stirng} [height] - 高度
     * @prop {Boolean} [pageable=true] - 是否分页
     * @prop {String} [pagerMode=advanced] - 分页形式 'advanced' 'simple'
     * @prop {Boolean} [serverProcessing=true] - 是否开启服务端分页
     * @prop {Array} [pageSizeOptions=['10', '20', '50', '100']] - 分页条数选项
     * @prop {String} [localization='zh-CN'] - 语言选择
     * @prop {Boolean} [sortable=false] - 排序
     * @prop {String} [selectionMode='custom'] - Sets or gets the selection mode. Possible values: "multipleRows", "singleRow" and "custom". In the "custom" mode, rows could be selected/unselected only through the API.
     * @prop {Boolean} [enableBrowserSelection=true] - Enables or disables the default text selection of the web browser.
     * @prop {Boolean} [columnsResize=true] - Sets or gets the jqxDataTable's columnsResize.
     * @prop {Boolean} [colHasMinWidth=true] - 列宽是否有默认最小值100px
     * @prop {Boolean} [schema=true] - 启用schema，必须定义 contextPath   &&  未定义contextPath时   schema 不生效
     * @prop {String} [contextPath] - 根路径
     * @prop {Int} [minLineNum] - 最小高度行数
     * @prop {Boolean} [fastRender=false] - 快速渲染， 用于提高表格渲染速度
     * @prop {Function} [beforeSend] - 请求发送前的回调函数
     * @prop {Function} [downloadComplete] - 表格数据请求完成的回调
     */
    $.fn.emapdatatable.defaults = {
        width: '100%',
        height: height,
        pageable: true,
        pagerMode: 'advanced',
        serverProcessing: true,
        pageSizeOptions: ['10', '20', '50', '100'],
        localization: localization,
        sortable: false,
        selectionMode: "custom",
        enableBrowserSelection: true,
        columnsResize: true,
        colHasMinWidth: true, // 列宽是否有默认最小值100px
        beforeSend: null,
        contextPath: '', //
        schema: true, // 启用schema，必须定义 contextPath   &&  未定义contextPath时   schema 不生效
        minLineNum: null,
        alwaysHide: ['WID', 'TBRQ', 'TBLX', 'CZRQ', 'CZZ', 'CZZXM'], // 自定义显示列的隐藏字段
        fastRender: false
    };

}).call(this);
'use strict';
(function () {
    var Plugin, _eventBind, _renderItem;

    Plugin = (function () {
        function Plugin(element, options) {
            this.options = $.extend({}, $.fn.emapDropdownTable.defaults, options);
            this.$element = $(element);
            _init(this.$element, this.options);
        }

        Plugin.prototype.getValue = function () {
            var selectedItem = this.$element.jqxComboBox('getSelectedItem')
            if (selectedItem && selectedItem.length) {
                var label = selectedItem.label;
                return JSON.parse(label)[this.options.valueMember];
            } else {
                return this.$element.val();
            }
        };

        Plugin.prototype.setValue = function (val) {
            var element = this.$element;
            if (val[0] == '') {
                element.val('');
            }
            if (!element.jqxComboBox('getItemByValue', val[0])) {
                element.jqxComboBox('addItem', {
                    "id": val[0],
                    "name": val[1],
                    "_displayData": (function () {
                        var display = {};
                        display.name = val[1];
                        display.id = val[0];
                        return JSON.stringify(display);
                    })()
                });
            }
            element.jqxComboBox('selectItem', val[0]);
        };

        Plugin.prototype.destroy = function () {
            this.$element.jqxComboBox('destroy');
        };
        return Plugin;
    })();


    //生成dom
    function _init(element, options) {
        options.eleWidth = element.width();
        if (!options.actionName) {
            var urlArr = options.url.split('/');
            options.actionName = urlArr[urlArr.length - 1].split('.')[0];
        }
        var source =
        {
            datatype: "json",
            root: "datas>" + options.actionName + ">rows",
            url: options.url,
            type: "POST",
            async: true
        };

        //qiyu 2016-11-19 将获取mock的url提取函数，在mock文件中重新定义
        if (typeof window.MOCK_CONFIG != 'undefined') {
            source = getSourceMock(source);
        }

        var dataAdapter = new $.jqx.dataAdapter(source,
            {
                beforeLoadComplete: function (data) {

                    $(data).each(function () {
                        this._displayData = JSON.stringify(this);
                    });
                    return data;
                },
                beforeSend: function (xhr, setting) {
                    // 搜索关键词为空时取消请求 多个请求的数据覆盖
                    if (element.jqxComboBox('searchString') === '') {
                        xhr.abort()
                    }
                },
                formatData: function (data) {
                    if (element.jqxComboBox('searchString') != undefined) {
                        data.queryopt = element.jqxComboBox('searchString');
                        data.pageSize = 10;
                        data.pageNumber = 1;
                        if (options.formatData) {
                            data = options.formatData(data);
                        }
                        return data;
                    }
                }
            }
        );
        element.addClass('bh-edt').jqxComboBox({
                remoteAutoComplete: true,
                // autoDropDownHeight: true,
                source: dataAdapter,
                remoteAutoCompleteDelay: 500,
                enableBrowserBoundsDetection: true,
                // selectedIndex: 0,
                //dropDownWidth: 100,
                displayMember: "_displayData",
                valueMember: options.valueMember,
                renderer: function (index, label, value, data) {
                    var rowHtml = '';
                    var rowData = JSON.parse(label);
                    if (!options.searchMember) {
                        options.searchMember = [];
                        for (var v in rowData) {
                            if (v == 'uid' || v == 'queryopt') continue;
                            if ($.inArray(v, options.hideMember) > -1) continue;
                            options.searchMember.push(v);
                        }
                    }
                    var itemMaxWidth = options.eleWidth/options.searchMember.length - 16;
                    for (var v in rowData) {
                        if (v == 'uid' || v == 'queryopt') continue;
                        if ($.inArray(v, options.hideMember) > -1) continue;
                        rowHtml += '<div class="bh-mh-8" style="display: inline-block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;max-width: ' + itemMaxWidth + 'px;" title="' +
                            rowData[v] + '">' +
                            ((rowData[v] === undefined || rowData[v] === null) ? '-' : rowData[v]) +
                            '</div>';
                    }
                    //rowHtml += '</div>';
                    return rowHtml;
                },
                renderSelectedItem: function (index, item) {
                    var label = JSON.parse(item.label);
                        return options.displayMember ? label[options.displayMember] : label.id;
                },
                search: function (searchString) {
                    dataAdapter.dataBind();
                }
            })
            .on('open', function () {
                if (!element.data('datainit')) {
                    dataAdapter.dataBind();
                    element.data('datainit', true);
                }
            });
        _eventBind(element, options);
    }

    _eventBind = function (element, options) {
        element.on('select', function (e) {
            if (!e.args) return;
            options.curValue = e.args.item.value;
        });

        // 文本框失去焦点后, 清空 已有的输入项(必须通过选择)
        if (options.autoClear) {
            $('input.jqx-combobox-input', element).on('blur', function () {
                try {
                    if (element.val() != options.curValue) {
                        element.jqxComboBox('clearSelection');
                    }
                }catch (e) {
                    console && console.log(e);
                }
            });
        }
    };

    _renderItem = function (element, options, data) {
        $(data).each(function () {
            element.jqxComboBox('addItem', this);
        });
    };

    $.fn.emapDropdownTable = function (options, params) {
        var instance;
        instance = this.data('emapdropdowntable');
        if (!instance) {
            return this.each(function () {
                return $(this).data('emapdropdowntable', new Plugin(this, options));
            });
        }
        if (options === true) return instance;
        if ($.type(options) === 'string') return instance[options](params);
        return this;
    };

    $.fn.emapDropdownTable.defaults = {
        valueMember: 'id',
        hideMember: [],
        autoClear: true,
        width: 300
    };
}).call(undefined);
(function () {
    var Plugin,
        _create, _renderTree,
        _getRecords, _getFullPath, _del_ID_PID, _treeBind, _filterLocalData, _getFatherNode, _isSelectable;

    /**
     * @module emapDropdownTree
     * @description 下拉树
     */
    Plugin = (function () {
        function Plugin(element, options) {
            this.settings = $.extend({}, $.fn.emapDropdownTree.defaults, options);
            this.$element = $(element);
            _create(this.$element, this.settings);
        }
        /**
         * @method getValue
         * @description 取值
         * @return {String} 当前下拉树选中的值，多值以逗号分隔
         */
        Plugin.prototype.getValue = function () {
            return $(this.$element.data('values')).map(function () {
                return this.value;
            }).get().join(',');
        };
        /**
         * @method getText
         * @description 获取选中文字
         * @return 当前下拉树选中的值的文字，多值以逗号分隔
         */
        Plugin.prototype.getText = function () {
            return $(this.$element.data('values')).map(function () {
                return this.label;
            }).get().join(',');
        };

        /**
         * @method setValue
         * @description 赋值
         * @param {Array} params - 0 val 1 val_display
         */
        Plugin.prototype.setValue = function (params) {
            var val = params[0];
            var display_val = params[1];
            var settings = this.settings;
            var $dom = this.$element;
            if (display_val === undefined) {
                console && console.log('下拉树缺少display字段');
            } else {
                this.$element.jqxDropDownButton('setContent', display_val);
                // this.settings.$tree.jqxTree('checkItem', $('#' + val, this.settings.$tree), true);
                this.$element.data('values', [{
                    value: val,
                    label: display_val
                }]);
                this.$element.trigger('change');
            }

        };

        /**
         * @method disable
         * @description 禁用
         */
        Plugin.prototype.disable = function () {
            this.$element.jqxDropDownButton({
                disabled: true
            });
        };
        /**
         * @method enable
         * @description 启用
         */
        Plugin.prototype.enable = function () {
            this.$element.jqxDropDownButton({
                disabled: false
            });
        };

        // Plugin.prototype.setSource = function (source) {
        //     this.settings.$tree.jqxTree({
        //         source: _getRecords(source)
        //     })
        // };

        return Plugin;

    })();

    _create = function ($dom, setting) {
        // var _tpl = '<input id="searchInput" placeHolder="请查找" type="text" class="jqx-widget jqx-listbox-filter-input jqx-input jqx-rc-all">';
        // $dom.append(_tpl);

        //var $inputGroup = $("#input", $dom);
        // var $searchInput = $("#searchInput", $dom);
        //var $searchBtn = $("#searchBtn", $dom);
        //var $tree = $('#jqxTree', $dom);
        var Num = "";
        for (var i = 0; i < 6; i++)
            Num += Math.floor(Math.random() * 10);

        setting.$tree = $('<div style="border: none;" class="dropdown-tree"></div>');
        setting.$tree.attr("id", "tree_" + Num);
        $dom.attr("id", "content_" + Num);
        $dom.append(setting.$tree);

        // 若有datas参数，将datas缓存， 后面前端搜索会使用
        if (!setting.url && setting.datas) {
            setting.$tree.data('localdata', setting.datas);
        }

        if (setting.checkboxes) {
            setting.$tree.on('checkChange', function (event) {
                var $tree = $(this);
                var Num = $tree.attr("id").substr("tree_".length);
                var $dom = $("#content_" + Num);
                var args = event.args;
                var item = $tree.jqxTree('getCheckedItems', args.element);
                var values = [];
                if (setting.selectableFlag) {
                    return setting.selectableFlag = false;
                }
                if (!_isSelectable(args, setting, event)) {
                    return false;
                }

                //多选下拉树选中时获取全路径
                var dropDownContent = item.map(function (cv) {
                    values.push({
                        "label": cv.label,
                        "value": cv.value
                    });
                    return _getFullPath(cv, setting.$tree).reverse().join("/");
                }).join(",");
                $dom.jqxDropDownButton('setContent', dropDownContent);
                $dom.data({
                    "values": values
                });
                $dom.trigger('change');
            });
        } else {
            setting.$tree.on('select', function (event) {
                var args = event.args;

                if (!_isSelectable(args, setting, event)) return;
                var $tree = $(this);
                var args = event.args;
                var Num = $tree.attr("id").substr("tree_".length);
                var $dom = $("#content_" + Num);
                var item = $tree.jqxTree('getItem', args.element);
                var values = [];
                // var dropDownContent = item.label;
                var dropDownContent = _getFullPath(item, setting.$tree).reverse().join("/");
                var dropDownValue = item.value;
                values.push({
                    "label": dropDownContent,
                    "value": dropDownValue
                });
                //qiyu 2016-6-6 外部可以干涉节点选中事件，需求人：吴涛
                var flag = $dom.triggerHandler("select", [values, $tree, args]);
                if (flag === undefined || flag == true) {
                    $dom.jqxDropDownButton('setContent', dropDownContent);
                    $dom.data({
                        "values": values
                    });
                    $dom.jqxDropDownButton('close');
                }
            });
        }
        $dom.jqxDropDownButton({
            enableBrowserBoundsDetection: true,
            width: setting.width ? setting.width : "100%"
        });

        $dom.on('close', function () {
            $(this).trigger('change');
        }).on('open', function () {
            if (!setting.treeInit) {
                _treeBind($dom, setting);
                setting.treeInit = true;
                setTimeout(function () { // 解决有时下拉树初始化 高度为0  不显示的问题 zhuhui 0726
                    setting.$tree.jqxTree({
                        height: '220px'
                    });
                }, 0);
            }
            //TODO 打开下拉树时 重新勾选
        });


        // 下拉树设置 placeholder zhuhi  0519
        $dom.jqxDropDownButton('setContent', '请选择...');

    };

    _renderTree = function (setting) {
        if (setting.url) {
            var data = $.extend({
                'pId': ''
            }, setting.params);
            if (setting.params && setting.params.searchValue) {
                data = setting.params;
            }
            var source = {
                datatype: "json",
                root: "datas>code>rows",
                datafields: [{
                    name: 'id'
                }, {
                    name: 'pId'
                }, {
                    name: 'name'
                }, {
                    name: 'isParent'
                }],
                id: 'id',
                url: setting.url,
                data: data,
                //qiyu 2016-5-9 强制使用post方法，解决搜索中文没有结果。反馈人：吴涛
                type: "POST"
            };

            //qiyu 2016-11-19 将获取mock的url提取函数，在mock文件中重新定义
            if (typeof window.MOCK_CONFIG != 'undefined') {
                source = getSourceMock(source);
            }

            var dataAdapter = new $.jqx.dataAdapter(source, {
                beforeLoadComplete: function (loaded_data, original_data) {
                    var new_data = [];
                    if (setting.checkboxes == false) {
                        new_data.push({
                            name: "请选择...",
                            pId: "...",
                            value: ""
                        });
                    }
                    for (var i = 0; i < loaded_data.length; i++) {
                        var item = loaded_data[i];
                        new_data.push({
                            id: item.id,
                            name: item.name,
                            pId: item.pId ? item.pId : "...",
                            value: item.id
                        });
                        if (item.isParent === 1 && !(setting.params && setting.params.checkParent)) {
                            var sub_item = {
                                id: item.id + '_load',
                                name: "加载中...",
                                pId: item.id,
                                value: item.id
                            };
                            new_data.push(sub_item);
                        }
                    }
                    return new_data;
                },
                loadComplete: function () {
                    // dataAdapter.records
                    var records = dataAdapter.getRecordsHierarchy('id', 'pId', 'items', [{
                        name: 'name',
                        map: 'label'
                    }]);
                    _del_ID_PID(records);
                    var treeParams = $.extend({
                        width: setting.width ? setting.width : "100%",
                        height: 220,
                        hasThreeStates: false,
                        allowDrag: false,
                        source: records,
                        checkSize: 16
                    }, setting.treeParams);
                    treeParams.checkboxes = setting.checkboxes;

                    if (!setting.params || !setting.params.checkParent) {
                        setting.$tree.on('expand', function (event) {
                            var $tree = $(this);
                            var $element = $(event.args.element);
                            // var label = $tree.jqxTree('getItem', $element).label;
                            var loader = false;
                            var loaderItem = null;
                            var children = $element.find('ul:first').children();
                            $.each(children, function () {
                                var item = $tree.jqxTree('getItem', this);
                                if (item && item.label == '加载中...') {
                                    loaderItem = item;
                                    loader = true;
                                    return false
                                }
                            });
                            if (loader) {
                                // unblind 取消节点label显示的层级关系
                                var unblind = setting.unblind;
                                $.ajax({
                                    url: setting.url,
                                    data: {
                                        pId: loaderItem.value.replace(".fake", "")
                                    },
                                    success: function (data, status, xhr) {
                                        var items = data;
                                        if (items.datas && items.datas.code && items.datas.code.rows) {
                                            var nodes = items.datas.code.rows;
                                            var treenodes = [];
                                            for (var i = nodes.length - 1; i >= 0; i--) {
                                                var itemLabel = nodes[i].name;
                                                if (unblind)
                                                    itemLabel = itemLabel.substring(itemLabel.lastIndexOf(setting.unblind) + 1, itemLabel.length);
                                                var treenode = {
                                                    label: itemLabel,
                                                    value: nodes[i].id
                                                };

                                                if (nodes[i].isParent === 1) {
                                                    treenode.items = [{
                                                        "value": nodes[i].id,
                                                        label: "加载中..."
                                                    }];
                                                }
                                                treenodes.push(treenode);
                                            }
                                            $tree.jqxTree('addTo', treenodes, $element[0]);
                                            $tree.jqxTree('removeItem', loaderItem.element);
                                        }
                                    }
                                });
                            }
                        });
                    } else {
                        // 搜索结果的回调中, unblind
                        unblindItem(treeParams.source, setting.unblind);


                    }

                    setting.$tree.jqxTree(treeParams);
                    // 解决有时下拉树初始化 高度为0  不显示的问题 zhuhui 0726
                    setTimeout(function () {
                        setting.$tree.jqxTree({
                            height: '220px'
                        });
                    }, 0);

                    if (setting.params && setting.params.checkParent) {
                        setting.$tree.off('expand');
                        setting.$tree.jqxTree('expandAll');
                    }

                    function unblindItem(source, unblind) {
                        if (source.length) {
                            source.map(function (sourceItem) {
                                sourceItem.label = sourceItem.name.substring(sourceItem.name.lastIndexOf(unblind) + 1, sourceItem.name.length);
                                if (sourceItem.items && sourceItem.items.length) {
                                    unblindItem(sourceItem.items, unblind);
                                }
                            })
                        }

                    }
                }
            });
            dataAdapter.dataBind();
        } else {
            var records = _getRecords(setting.datas);
            var treeParams = $.extend({
                width: setting.width ? setting.width : "100%",
                height: 220,
                hasThreeStates: false,
                allowDrag: false,
                source: records,
                checkSize: 16
            }, setting.treeParams);
            treeParams.checkboxes = setting.checkboxes;
            setting.$tree.jqxTree(treeParams);
        }
    };

    _treeBind = function ($dom, setting) {
        // setting.$tree.jqxTree({ width: "100%" });//.jqxTree('addTo', { label: '请选择', value: "" });
        setting.$tree.niceScroll();
        if (setting.search) {
            var $searchInput = $('<input style="height: 21px; top: 3px; left: 3px;  width: calc(100% - 4px); margin: 2px 0 2px 2px; border-radius: 2px;" class="treeSearchInput jqx-widget jqx-listbox-filter-input jqx-input jqx-rc-all" type="text" placeHolder="搜索..."/>');
            setting.$tree.before($searchInput);
            WIS_EMAP_INPUT.placeHolder($searchInput);
            $searchInput.keyup(function () {
                window.clearTimeout($searchInput.data('timerId'));
                $searchInput.data('timerId', window.setTimeout(
                    function () {
                        var value = $searchInput.val();
                        if (value) {
                            if (setting.url) { // 有url参数时， 为远程搜索
                                var source = {
                                    '*tree': "1",
                                    searchValue: value,
                                    checkParent: true
                                };
                                setting.$tree.jqxTree("clear");
                                setting.params = $.extend({}, setting.params, source);
                                _renderTree(setting);
                            } else { // 没有url时， 为本地搜索
                                if (!setting.datas) {
                                    console && console.error('tree need datas options');
                                }
                                setting.$tree.jqxTree("clear");
                                setting.datas = _filterLocalData(setting.$tree.data('localdata'), value);
                                _renderTree(setting);
                            }
                        } else {
                            setting.$tree.jqxTree("clear");
                            if (setting.url) {
                                setting.params = $searchInput.data('originalParam');
                            } else {
                                setting.datas = setting.$tree.data('localdata');
                            }
                            _renderTree(setting);
                        }
                    }, 500));
            });
        }
        _renderTree(setting);
    };

    _getRecords = function (datas) {
        var source = {
            datatype: "json",
            // root:"datas>code>rows",
            datafields: [{
                name: 'id'
            }, {
                name: 'pId'
            }, {
                name: 'name'
            }],
            id: 'id',
            localdata: datas
        };
        var dataAdapter = new $.jqx.dataAdapter(source);
        dataAdapter.dataBind();
        var records = dataAdapter.getRecordsHierarchy('id', 'pId', 'items', [{
            name: 'name',
            map: 'label'
        }, {
            name: 'id',
            map: 'value'
        }]);
        return records;
    };

    _getFullPath = function (treeNode, domTree) {
        var path = [];
        path.push(treeNode.label);
        if (domTree.jqxTree('getItem', treeNode.parentElement) != null) {
            path = path.concat(_getFullPath(domTree.jqxTree('getItem', treeNode.parentElement), domTree));
        }
        return path;
    };

    _del_ID_PID = function (arr_data) {
        for (var i = 0; i < arr_data.length; i++) {
            delete arr_data[i].id;
            delete arr_data[i].pId;
            if (arr_data[i].items)
                _del_ID_PID(arr_data[i].items);
        }
    }

    // 前端搜索
    _filterLocalData = function (data, val) {
        var result_data = [];
        if (data.length) {
            data.map(function (item) {
                if (item.name.indexOf(val) > -1) {
                    result_data.push(item);
                }
            });
            // 向上遍历父节点加入搜索结果
            var len = result_data.length;
            for (var i = 0; i < len; i++) {
                result_data = result_data.concat(_getFatherNode(data, result_data[i]));
            }
        }
        return result_data;
    }

    _getFatherNode = function (data, childNode) {
        if (childNode.pId !== undefined && childNode.pId !== null && childNode.pId !== '') {
            var node_list = [];
            var father_node = data.filter(function (item) {
                return item.id === childNode.pId
            })[0];
            if (father_node) {
                node_list.push(father_node);
                if (father_node.pId !== undefined && father_node.pId !== null && father_node.pId !== '') {
                    node_list = node_list.concat(_getFatherNode(data, father_node));
                }
            }
            return node_list;
        } else { // 没有pid的情况，则认为已经是顶级节点
            return [];
        }
    }

    _isSelectable = function (args, setting, event) {
        var item = setting.$tree.jqxTree('getItem', args.element);
        if (typeof setting.unselectableLevel == 'number') {
            setting.unselectableLevel = setting.unselectableLevel.toString();
        }
        var unselectableLevelArray = setting.unselectableLevel ? setting.unselectableLevel.split(',') : [];
        if (setting.checkboxes) {
            if (!setting.parentNodeSelectable && item.hasItems) {
                // 标记位指示checkChange事件是否由下方的checkItem方法触发，
                // 如果是，则在事件监听里不作处理， 避免由此引起的死循环内存溢出  -- zhuhui 2016-11-15
                setting.selectableFlag = true;
                setting.$tree.jqxTree('checkItem', args.element, false);
                return false;
            }
            if (unselectableLevelArray.length && $.inArray((item.level + 1) + '', unselectableLevelArray) > -1) {
                setting.selectableFlag = true;
                setting.$tree.jqxTree('checkItem', args.element, false);
                return false;
            }
        } else {
            if (!setting.parentNodeSelectable) {
                if (item.hasItems) return false;
            }
            if (unselectableLevelArray.length && $.inArray((item.level + 1) + '', unselectableLevelArray) > -1) {
                return false;
            }
        }

        return true;
    }

    $.fn.emapDropdownTree = function (options, params) {
        var instance;
        instance = this.data('emapDropdownTree');
        if (!instance) {
            return this.each(function () {
                return $(this).data('emapDropdownTree', new Plugin(this, options));
            });
        }
        if (options === true) return instance;
        if ($.type(options) === 'string') return instance[options](params);
        return this;
    };

    /**
     * @memberof module:emapDropdownTree
     * @prop {Array} datas - 下拉树数据，emap格式，与url二选一必须
     * @prop {String} url - 下拉树数据请求地址， 与datas二选一必须
     * @prop {Boolean} [checkboxes=false] - 是否多选
     * @prop {Boolean} [search=true] - 是否允许搜索
     * @prop {String} [unblind] - 节点层次关系分隔符
     * @prop {Boolean} [parentNodeSelectable=true] - 父级节点是否允许选中
     * @prop {String} [unselectableLevel] - 指定层级无法选中如 '1,2', 多层级用 , 分隔
     * @prop {Object} [treeParams] - 树组件参数
     */
    $.fn.emapDropdownTree.defaults = {
        width: "100%",
        checkboxes: false,
        search: true,
        parentNodeSelectable: true,
        unselectableLevel: "",
        treeParams: {}
    };
}).call(this);
/**
 * 类似于纵向tab页签
 */
(function($) {
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
            this.settings = $.extend({}, $.fn.emapEditableTable.defaults, options);
            //将dom jquery对象赋值给插件，方便后续调用
            this.$element = $(element);
            init.call(this, this.settings, this.$element);
        }

        return Plugin;

    })();

    Plugin.prototype = {

    };

    function init(settings, $element) {

        this.models = getModels.call(this);
        this.dataPath = getDataPath.call(this);
        this.dataFields = getDataFields.call(this, this.models);
        this.source = getSource.call(this);
        this.columns = getColumns.call(this);

        render.call(this);
    }

    function render() {
        var params = $.extend({}, this.settings);
        params.source = this.source;
        params.columns = this.columns;

        delete params.pagePath;
        delete params.action;
        delete params.checkbox;
        delete params.editableFields;
        delete params.filter;

        this.$element.jqxDataTable(params);
    }

    function getColumns() {

        var columns = [];
        var checkboxColumn = null;
        var models = this.models;
        var self = this;

        if (this.settings.checkbox) {
            checkboxColumn = getCheckboxColumn.call(this);
            columns.push(checkboxColumn);
        }

        for (var i = 0; i < this.models.length; i++) {
            (function() {
                var model = self.models[i];
                var editable = self.settings.editable && _.contains(self.settings.editableFields, model.name);
                var column = generateColumnByModel.call(self, model, editable);
                columns.push(column);
            })();
        }

        return columns;
    }

    function createCombo(model, editor, width, height) {
        var source = {
            datatype: "json",
            datafields: [{
                name: 'id'
            }, {
                name: 'name'
            }],
            url: model.url
        };
        var dataAdapter = new $.jqx.dataAdapter(source, {
            async: false,
            downloadComplete: function(data, status, xhr) {
                try {
                    var d = [{
                        id: '',
                        name: "请选择..."
                    }];
                    data.data = d.concat(data.datas.code.rows);
                    delete data.datas;
                    delete data.code;
                    return data;
                } catch (e) {
                    source.totalRecords = data.recordsTotal;

                }
            }
        });
        editor.jqxDropDownList({
            placeHolder: '请选择...',
            source: dataAdapter,
            displayMember: "name",
            valueMember: "id",
            width: width - 10,
            height: 25
        });
    }

    function generateColumnByModel(model, editable) {

        var columnWidth = getColumnWidth(model);
        var self = this;

        var column = {
            text: model.caption,
            dataField: model.name,
            hidden: model.hidden,
            width: columnWidth,
            cellsRenderer: function(row, column, value, rowData) {
                if (model.url) {
                    value = rowData[column + "_DISPLAY"]
                }

                return '<span title="' + value + '">' + value + '</span>';
            }
        };

        if (editable) {
            column['createEditor'] = function(row, cellvalue, editor, cellText, width, height) {
                var newEditor = editor;
                if (model.url) {
                    var newEditor = $("<div class='dropDownList'></div>");
                    editor.after(newEditor);
                    editor.hide();
                }
                createField.call(self, model, newEditor, width, height);
            };

            column['initEditor'] = function(row, cellvalue, editor, celltext, width, height) {
                var _this = this;
                if (model.url) {
                    editor = editor.parent().find('.dropDownList');
                    editor.jqxDropDownList({
                        width: width - 10,
                        height: height
                    }).off("select").on("select", function(event) {
                        var args = event.args;
                        if (args) {
                            var item = args.item;
                            var label = item.label;
                            _this.displayValue = {
                                row: row,
                                display: label
                            };
                            var rowData = self.$element.jqxDataTable('getRows')[row];
                            rowData[model.name] = args.item.value;
                            rowData[model.name + '_DISPLAY'] = args.item.label;
                            editor.jqxDropDownList('selectItem', item);
                        }
                    });
                    var items = editor.jqxDropDownList('getItems');
                    editor.jqxDropDownList('clearSelection');
                    var selectedIndex = null;
                    for (var i = 0; i < items.length; i++) {
                        if (items[i].value == cellvalue) {
                            selectedIndex = items[i].index;
                            //editor.jqxDropDownList('selectItem', items[i]);
                            break;
                        }
                    }
                    editor.jqxDropDownList('selectIndex', selectedIndex);

                } else {
                    var inputField = editor.find('input');
                    inputField.val(cellvalue);
                }
            };
            column['getEditorValue'] = function(row, cellvalue, editor) {
                if (model.url) {
                    editor = editor.parent().find('.dropDownList');
                }
                return getEditorValue(model, editor);
            };
        } else {
            column['editable'] = false;
        }

        return column;
    }

    function createField(model, editor, width, height) {
        if (model.url) {
            createCombo(model, editor, width, height);
        } else if (model.dataType == "int") {
            this.createNumber(model, editor, width, height);
        } else {
            var inputElement = $("<input style='padding-left: 4px; border: none;'/>").appendTo(editor);
            inputElement.jqxInput({
                source: getEditorDataAdapter.call(this, model.name),
                displayMember: model.name,
                width: width,
                height: height
            });
        }
    }

    function getEditorDataAdapter(datafield) {
        var dataFields = this.dataFields;
        var source = {
            localData: this.source.records,
            dataType: "array",
            dataFields: dataFields
        };
        var dataAdapter = new $.jqx.dataAdapter(source, {
            uniqueDataFields: [datafield]
        });
        return dataAdapter;
    }

    function getEditorValue(model, editor) {
        if (model.url) {
            var selectItem = editor.jqxDropDownList("getSelectedItem");
            if (selectItem) {
                return selectItem.value;
            } else {
                return "";
            }
        } else {
            return editor.find('input').val();
        }
    }

    function getColumnWidth(model) {
        var url = model.url;
        var width = model["grid.width"];
        if (width) {
            return width;
        }
        var size = 1;
        if (url) { //说明有字典表
            size = 10;
        }
        return null;
        width = (model.dataSize * size);
        if (width < 100) {
            width = 100;
        } else if (width < 200) {
            width = 200;
        } else {
            width = 300;
        }
        return width;
    }

    function getCheckboxColumn() {
        var self = this;
        var checkboxColumn = {
            text: 'checkbox',
            width: '32px',
            cellsAlign: 'center',
            align: 'center',
            editable: false,
            renderer: function(text, align, height) {
                var checkBox = '<div class="selectAllCheckboxFlag bh-checkbox bh-mh-8"><label><input type="checkbox" value=""><i class="bh-choice-helper"></i></label></div>';
                return checkBox;
            },
            cellsRenderer: function(row, column, value, rowData) {
                var checkBox = '<div data-sss="" class="bh-checkbox bh-mh-4" style="margin-left:0 !important;"><label><input type="checkbox" value=""><i class="bh-choice-helper"></i></label></div>';
                return checkBox;
            },
            rendered: function(element, align, height) {
                element.on("click", "input", function(e) {
                    var $table = self.$element;
                    var $tableContent = $table.find("table");
                    var $checkboxList = $tableContent.find("div.bh-checkbox");
                    var $input = $(this);
                    if ($input.hasClass("selectFlag")) {
                        $input.prop("checked", false).removeClass("selectFlag");
                        $checkboxList.each(function() {
                            $(this).find("input").prop("checked", false);
                        });
                    } else {
                        $input.prop("checked", true).addClass("selectFlag");
                        $checkboxList.each(function() {
                            $(this).find("input").prop("checked", true);
                        });
                    }
                    $(this).trigger('checkall');
                    e.stopPropagation();
                });
                return true;
            }
        };
        return checkboxColumn;
    }

    /**
     * *
     * [获取数据源]
     */
    function getSource() {
        var self = this;
        var source = {
            datatype: "json",
            datafields: this.dataFields,
            id: 'WID',
            url: this.dataPath
        };
        var dataAdapter = new $.jqx.dataAdapter(source, {
            formatData: function(data) {
                var pageSize = data.pagesize;
                var pageNumber = data.pagenum + 1;
                var querySetting = [];
                if (data.querySetting) {
                    if (data.querySetting.length > 0) {
                        var q = eval(data.querySetting);
                        if (q.length > 0) {
                            querySetting = querySetting.concat(q);
                        }
                    }
                }
                if (querySetting) {
                    querySetting.push(eval(self.settings.filter.querySetting));
                }
                data.querySetting = JSON.stringify(querySetting);
                data.pageSize = pageSize;
                data.pageNumber = pageNumber;
                delete data.pagesize;
                delete data.pagenum;
                delete data.filterslength;
                return data;
            },
            downloadComplete: function(data, status, xhr) {
                var action = self.settings.action;
                try {
                    source.totalRecords = data.datas[action].totalSize;
                    data.recordsTotal = data.datas[action].totalSize;
                    data.data = data.datas[action].rows;
                    delete data.datas;
                    delete data.code;
                    return data;
                } catch (e) {
                    source.totalRecords = data.recordsTotal;
                }
            }
        });

        return dataAdapter;
    }

    function getModels() {

        var models = WIS_EMAP_SERV.getModel(this.settings.pagePath, this.settings.action, "grid");

        return models;
    }

    function getDataPath() {
        var pagePath = this.settings.pagePath;
        var action = this.settings.action;

        var dataPath = pagePath.replace(".do", "/" + action + ".do");
        var dataPath = 'http://res.wisedu.com/fe_components/mock/table.json'

        return WIS_EMAP_SERV.getAbsPath(dataPath);
    }

    function getDataFields(models) {
        var datafields = [];
        for (var i = 0; i < models.length; i++) {
            if (models[i].url) {
                datafields.push({
                    name: models[i].name + '_DISPLAY',
                    type: 'string'
                });
            }
            datafields.push({
                name: models[i].name,
                type: 'string'
            });
        }
        return datafields;
    }

    /**
     * 这里是关键
     * 定义一个插件 plugin
     */
    $.fn.emapEditableTable = function(options, params) {
        var instance;
        instance = this.data('emapEditableTable');
        /**
         * 判断插件是否已经实例化过，如果已经实例化了则直接返回该实例化对象
         */
        if (!instance) {
            return this.each(function() {
                //将实例化后的插件缓存在dom结构里（内存里）
                return $(this).data('emapEditableTable', new Plugin(this, options));
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
    $.fn.emapEditableTable.defaults = {

        /**
         * [pagePath 页面模型]
         * @type {String}
         */
        pagePath: '',

        /**
         * [action 动作]
         * @type {String}
         */
        action: '',

        /**
         * [editableFields 可编辑的列，未配置在此则表示不可编辑]
         * @type {Array}
         */
        editableFields: [],

        /**
         * [checkbox 是否显示复选框]
         * @type {Boolean}
         * @default  true
         */
        checkbox: true,

        /**
         * [pageable 是否可分页]
         * @type {Boolean}
         */
        pageable: true,

        /**
         * [filter 查询条件]
         * @type {String}
         */
        filter: '',

        editable: true,

        width: '100%'
    };
})(jQuery);
/**
 * @fileOverview EMAP富文本编辑器
 * @example
 $('#container').emapEditor({
            contextPath: "/emap"
        })
 */
(function () {
    var Plugin,
        _init;
    /**
     * @module emapEditor
     * @example
        $('#container').emapEditor({
            contextPath: "/emap"
        })
     */
    Plugin = (function () {
        function Plugin(element, options) {
            this.options = $.extend({}, $.fn.emapEditor.defaults, options);
            this.$element = $(element);
            _init(this.$element, this.options);

        }

        /**
         * 判断是否为空
         * @method isEmpty
         * @returns {Boolean}
         * @example
            $("#container").emapEditor('isEmpty');
         */
        Plugin.prototype.isEmpty = function () {
            return this.$element.summernote('isEmpty');
        };

        /**
         * 清空内容
         * @method clear
         * @example
            $("#container").emapEditor('clear');
         */
        Plugin.prototype.clear = function () {
            return this.$element.summernote('reset');
        };

        /**
         * 禁用
         * @method disable
         * @example
         $("#container").emapEditor('disable');
         */
        Plugin.prototype.disable = function () {
            return this.$element.summernote('disable');
        };

        /**
         * 启用
         * @method enable
         * @example
         $("#container").emapEditor('enable');
         */
        Plugin.prototype.enable = function () {
            return this.$element.summernote('enable');
        };

        /**
         * 获取富文本编辑器的内容
         * @method getValue
         * @return {String} 富文本编辑器内容
         * @example
         $("#container").emapEditor('getValue');
         */
        Plugin.prototype.getValue = function () {
            return this.$element.summernote('code');
        };

        /**
         * 富文本编辑器赋值
         * @method setValue
         * @param {String} value - 要赋值的内容
         * @example
         $("#container").emapEditor('setValue', 'content');
         */
        Plugin.prototype.setValue = function (content) {
            return this.$element.summernote('code', content);
        };

        /**
         * 销毁
         * @method destroy
         * @example
         $("#container").emapEditor('destroy');
         */
        Plugin.prototype.destroy = function () {
            this.$element.summernote('reset');
            return this.$element.summernote('destroy');
        };
        return Plugin;
    })();

    _init = function (element, options) {
        if (!options.contextPath && WIS_EMAP_SERV) {
            options.contextPath = WIS_EMAP_SERV.getContextPath();
        }
        options.$element = $(element);
        // 判断时是否已加载summernote  若没有  则加载js
        if (!$.fn.summernote) {
            console && console.warn('依赖插件summernote未引入!');
            return;
        }

        // 自定义 按钮
        var uploadFile = function (context) {
            var ui = $.summernote.ui;

            // create button
            var button = ui.button({
                contents: '<i class="iconfont icon-attachfile" style="line-height: 12px;font-size: 14px;" />',
                tooltip: 'uploadFile',
                click: function () {
                    var $self = context.options.$element;
                    var uploadDiv = context.options.uploadDiv;
                    context.options.uploadFlag = 'file';

                    $('input[type=file]', uploadDiv).fileupload('option', {
                        submit: function () {},
                        done: function (e, data) {
                            if (data.result.success) {
                                var token = uploadDiv.emapUploadCore('saveTempFile');
                                if (token) {
                                    var imgNode;
                                    imgNode = $('<a href="' + (options.fullFilePath ? gethost() : '') + options.contextPath + '/sys/emapcomponent/file/getFileByToken/' + token + '.do" >' + data.result.name + '</a>')[0]

                                    $self.summernote('insertNode', imgNode);
                                    //  插入成功后 重载上传 刷新token
                                    uploadDiv.emapUploadCore('reload')
                                }
                            }
                        }
                    });
                    $('input[type=file]', context.options.uploadDiv).trigger('click');

                }
            });

            return button.render(); // return button as jquery object
        };

        // 自定义图片上传
        var uploadImage = function (context) {
            var ui = $.summernote.ui;

            // create button
            var button = ui.button({
                contents: '<i class="iconfont icon-image" style="line-height: 12px;font-size: 14px;" />',
                tooltip: 'uploadImage',
                click: function () {
                    var $self = context.options.$element;
                    var uploadDiv = context.options.uploadDiv;
                    context.options.uploadFlag = 'file';

                    $('input[type=file]', uploadDiv).fileupload('option', {
                        submit: function (e, data) {
                            var file = data.files[0];
                            var imgType = ['jpg', 'jpeg', 'png'];
                            // 文件的大小 和类型校验
                            if (!new RegExp((imgType.join('|') + '$').toUpperCase()).test(file.name.toUpperCase())) {
                                $.bhTip && $.bhTip({
                                    content: '请上传正确的图片类型',
                                    state: 'danger',
                                    iconClass: 'icon-close'
                                });
                                return false;
                            }
                        },
                        done: function (e, data) {
                            if (data.result.success) {
                                var token = uploadDiv.emapUploadCore('saveTempFile');
                                if (token) {
                                    var imgNode;
                                    imgNode = $('<img src="' + (options.fullFilePath ? gethost() : '') + options.contextPath + '/sys/emapcomponent/file/getFileByToken/' + token + '.do" />')[0]

                                    $self.summernote('insertNode', imgNode);
                                    //  插入成功后 重载上传 刷新token
                                    uploadDiv.emapUploadCore('reload')
                                }
                            }
                        }
                    });
                    $('input[type=file]', context.options.uploadDiv).trigger('click');

                }
            });

            return button.render(); // return button as jquery object
        }

        function gethost () {
            return location.origin || location.host;
        }

        // 上传功能的html
        $(element).after('<div role="emap-editor-upload" style="display: none;"></div>')
        options.uploadDiv = $(element).next('[role="emap-editor-upload"]');
        options.uploadDiv.emapUploadCore({
            contextPath: options.contextPath
        });

        // 隐藏计数文本域下的计数条 (可能存在在计数文本域上实例化富文本编辑器的情况)
        var numFooter = $('.bh-txt-input__foot', $(element).parent());
        if (numFooter.length) {
            numFooter.hide();
        }
        var txtContainer = $(element).closest('.bh-txt-input');
        if (txtContainer.length) {
            txtContainer.css('border', 'none');
        }

        $(element).summernote($.extend({
            lang: 'zh-CN',
            buttons: {
                uploadFile: uploadFile,
                uploadImage: uploadImage
            }
        }, options));
        // 默认字体微软雅黑
        $(element).summernote('fontName', 'Microsoft YaHei');


    };

    $.fn.emapEditor = function (options, param) {
        var instance;
        instance = this.data('emapeditor');
        if (!instance) {
            return this.each(function () {
                return $(this).data('emapeditor', new Plugin(this, options));
            });
        }
        if (options === true) return instance;
        if ($.type(options) === 'string') return instance[options](param);
        return this;
    };

    /**
     * @memberof module:emapEditor
     * @prop {String}  contextPath - emap根路径
     *
     * @description 详细配置参数见 <a href="http://summernote.org/">summernote</a>
     */

    $.fn.emapEditor.defaults = {
        height: 200,
        disableDragAndDrop: true,
        fullFilePath: false, // 保存文件和 图片的 绝对路径
        popover: {
            air: [
                ['color', ['color']],
                ['font', ['bold', 'underline', 'clear']]
            ]
        },
        toolbar: [
            ['style', ['style']],
            ['font', ['bold', 'underline', 'italic', 'clear']],
            ['fontname', ['fontname']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['table', ['table']],
            ['insert', ['link', 'uploadImage', 'uploadFile', 'hr']],
            ['view', ['codeview']]
        ],
        fontNames: ['SimHei', 'SimSun', 'KaiTi', 'Microsoft YaHei', 'Arial', 'Arial Black', 'Helvetica', 'Comic Sans MS', 'Courier New']
    };
}).call(this);
(function() {
    var Plugin, _renderFormWrap,
        _renderReadonlyFormStructure, _renderEditFormStructure, _sortModel, _getAttr, _emapFormDo, _renderTableFormStructure,
        _renderReadonlyInputPlace, _renderEditInputPlace, _eventBind, _calcLineHeight; //插件的私有方法
    var _defaultValues = {};

    Plugin = (function() {
        /**
         * @module emapForm
         * @description 表单
         */
        function Plugin(element, options) {
            // 旧版 option 参数的兼容处理
            if (options.mode) {
                options.model = options.mode;
            }
            if (options.model == 'L' || options.model == 'horizontal') {
                options.model = 'h';
            }
            if (options.model == 'S' || options.model == 'vertical') {
                options.model = 'v';
            }
            if (options.rows) {
                options.cols = options.rows;
            }

            //将插件的默认参数及用户定义的参数合并到一个新的obj里
            this.options = $.extend({}, $.fn.emapForm.defaults, options);
            if (!this.options || this.options == null || this.options == "") {
                this.options = WIS_EMAP_SERV.getContextPath();
            }
            //将dom jquery对象赋值给插件，方便后续调用
            this.$element = $(element);

            this.$element.attr("emap-role", "form");

            this.$element.attr("emap", JSON.stringify({
                "emap-url": WIS_EMAP_SERV.url,
                "emap-name": WIS_EMAP_SERV.name,
                "emap-app-name": WIS_EMAP_SERV.appName,
                "emap-model-name": WIS_EMAP_SERV.modelName
            }));
            delete WIS_EMAP_SERV.url;
            delete WIS_EMAP_SERV.name;
            delete WIS_EMAP_SERV.appName;
            delete WIS_EMAP_SERV.modelName;

            _renderFormWrap(this.$element, this.options);


            //初始化控件
            if (!this.options.readonly && this.options.data) {
                this.$element.emapFormInputInit(this.options);
                if (!$.isEmptyObject(_defaultValues)) WIS_EMAP_INPUT.formSetValue(this.$element, _defaultValues, this.options);
                if (this.options.validate) {
                    // 初始化表单校验
                    this.$element.emapValidate(options);
                }
            }

            if (!this.options.readonly && this.options.data) {
                // 初始化 下拉框联动
                var linkModal = this.options.data.filter(function(val) {
                    return !!(val.linkageBy || val['form.linkageBy']);
                });
                if (linkModal.length > 0) {
                    this.$element.emapLinkage({
                        data: linkModal
                    });
                }
            }
            var self = this;

            _eventBind(this.$element, this.options);

            setTimeout(function() {
                // 针对某些特殊情况连续调用destroy后实例化 options可能为null时，做安全处理
                if (!self.options) {
                    return;
                }
                // 自动补齐
                if (self.options.readonly || self.options.model == 't') {
                    self.$element.emapForm('refreshColumns');
                }
                // ie9 添加placeholder
                WIS_EMAP_INPUT.placeHolder();

                // 表格表单 计算label行高, 文字过多时两行布局
                if (!options.flexLayout) {
                    _calcLineHeight(self.$element, self.options);
                }
            }, 0);
        }


        /**
         * @method disableItem
         * @description 禁用表单项
         * @param {String|Array} ids - 表单字段的name
         */
        Plugin.prototype.disableItem = function(ids) {
            WIS_EMAP_INPUT.formDisable(this.$element, ids);
            if (this.options.model == 't' && this.options.showDisableLockedIcon == true) {
                var element = this.$elemet;
                _emapFormDo(ids, function(id) {
                    $('[data-name=' + id + ']', element).closest('[emap-role="input-wrap"]').append('<i class="iconfont icon-lock bh-table-form-icon" style="background: #fff;"></i>')
                })
            }
            this.$element.emapForm('reloadValidate');
        };

        /**
         * @method enableItem
         * @description 启用表单项
         * @param {String|Array} ids - 表单字段的name
         */
        Plugin.prototype.enableItem = function(ids) {
            WIS_EMAP_INPUT.formEnable(this.$element, ids);
            if (this.options.model == 't' && this.options.showDisableLockedIcon == true) {
                var element = this.$elemet;
                _emapFormDo(ids, function(id) {
                    var lockIcon = $('[data-name=' + id + ']', element).closest('[emap-role="input-wrap"]').find('<i class="iconfont icon-lock bh-table-form-icon" style="background: #fff;"></i>');
                    if (lockIcon.length) lockIcon.remove();
                })
            }
            this.$element.emapForm('reloadValidate');
        };

        /**
         * @method saveUpload
         * @description 保存表单中的上传组件 (请使用saveUploadSync代替)
         * @param {Object} [param] - 保存请求的附带参数
         */
        Plugin.prototype.saveUpload = function(param) {
            var items = $('[xtype=uploadphoto], [xtype=uploadfile], [xtype=uploadsingleimage], [xtype=uploadmuiltimage]', this.$element);
            if (items.length === 0) {
                // 表单中无上传组件的情况下调用保存上传方法
                console && console.error("There's no upload component in form, don't call the 'saveUploadSync' method !");
            } else {
                items.each(function() {
                    switch ($(this).attr('xtype')) {
                        case 'uploadphoto':
                            $(this).emapFilePhoto('saveTempFile', param);
                            break;
                        case 'uploadfile':
                            $(this).emapFileUpload('saveTempFile', param);
                            break;
                        case 'uploadsingleimage':
                            $(this).emapSingleImageUpload('saveTempFile', param);
                            break;
                        case 'uploadmuiltimage':
                            $(this).emapImageUpload('saveTempFile', param);
                            break;
                    }
                });
            }
        };

        /**
         * @method saveUploadSync
         * @description  异步的保存表单中上传组件的方法， 返回promise对象
         * @param {Object} params - 保存请求附带参数
         * @return {Object} 异步方法的Defer对象
         */
        Plugin.prototype.saveUploadSync = function(param) {
            var items = $('[xtype=uploadphoto], [xtype=uploadfile], [xtype=uploadsingleimage], [xtype=uploadmuiltimage]', this.$element);
            var items_length = items.length;
            var result_array = [];
            var result_defer = $.Deferred();
            result_defer.fail(function() { // 对于表单保存操作 中 上传文件保存操作失败的处理
                $.bhTip && $.bhTip({
                    content: '上传文件保存失败',
                    state: 'danger',
                    iconClass: 'icon-close'
                });
            });
            if (items_length === 0) {
                // 表单中无上传组件的情况下调用保存上传方法
                console && console.error("There's no upload component in form, don't call the 'saveUploadSync' method !");
                setTimeout(function() {
                    result_defer.resolve([]);
                }, 10);
            } else {
                items.each(function() {
                    var defer;
                    switch ($(this).attr('xtype')) {
                        case 'uploadfile':
                            defer = $(this).emapFileUpload('saveUpload', param);
                            break;
                        case 'uploadsingleimage':
                            defer = $(this).emapSingleImageUpload('saveUpload', param);
                            break;
                        case 'uploadmuiltimage':
                            defer = $(this).emapImageUpload('saveUpload', param);
                            break;
                    }
                    defer.done(function(res) {
                        if (res.success) {
                            result_array.push(res);
                            if (result_array.length == items_length) {
                                result_defer.resolve(result_array);
                            }
                        } else {
                            result_defer.reject();
                        }
                    }).fail(function(error) {
                        result_defer.reject();
                    });
                });
            }

            return result_defer;
        };

        /**
         * @method showItem
         * @description 显示表单项
         * @param {String|Array} ids - 表单字段的name
         */
        Plugin.prototype.showItem = function(ids) {
            var self = this.$element;
            var options = this.options;
            _emapFormDo(ids, _show);
            self.emapForm('reloadValidate');
            if (options.model == 't' || options.readonly == true) {
                self.emapForm('refreshColumns')
            }

            function _show(id) {
                if (options.model == 't' || options.readonly === true) {
                    var item = $('[data-name=' + id + ']', self).closest('.bh-form-group');
                    item.show();
                    if (options.model == 't') {
                        item.parent().show();
                    }
                } else {
                    $('[data-name=' + id + ']', self).closest('.bh-row').show().attr('hidden', false);
                }
            }
        };

        /**
         * @method hideItem
         * @description 隐藏表单项
         * @param {String|Array} ids - 表单字段的name
         */
        Plugin.prototype.hideItem = function(ids) {
            var self = this.$element;
            var options = this.options;
            _emapFormDo(ids, _hide);
            self.emapForm('reloadValidate');
            if (options.model == 't' || options.readonly == true) {
                self.emapForm('refreshColumns')
            }

            function _hide(id) {
                if (options.model == 't' || options.readonly === true) {
                    var item = $('[data-name=' + id + ']', self).closest('.bh-form-group');
                    item.hide();
                    if (options.model == 't') {
                        item.parent().hide();
                    }
                } else {
                    $('[data-name=' + id + ']', self).closest('.bh-row').hide().attr('hidden', true);
                }
            }
        };

        /**
         * @method getValue
         * @description 表单取值
         * @return {Object} 包含表单每个字段的值的json对象， key为表单字段的name， value为表单字段的值
         */
        Plugin.prototype.getValue = function() {
            return WIS_EMAP_INPUT.formGetValue(this.$element, this.options);
        };

        /**
         * @method clear
         * @description 表单清空
         * @param {String|Array} - 如果不传参数，则清空表单中所有值;如果传入参数是个数组，则清空该数组中为字段名称的控件值
         */
        Plugin.prototype.clear = function(val) {
            WIS_EMAP_INPUT.formClear(this.$element, val, this.options);
        };

        /**
         * @method setValue
         * @description 表单赋值
         * @param {Object} - 表单数据json对象， key为表单字段的name， value为表单字段的值
         */
        Plugin.prototype.setValue = function(val) {
            WIS_EMAP_INPUT.formSetValue(this.$element, val, this.options);
            // 表单塞值后清除出现的 校验信息
            this.$element.emapForm('clearValidateInfo');
        };


        /**
         * @method destroy
         * @description 销毁表单
         */
        Plugin.prototype.destroy = function() {
            // 遍历销毁单个控件 确保控件在body底部插入的dom元素被销毁
            $('[xtype]', this.$element).each(function() {
                var _this = $(this);
                var xtype = _this.attr('xtype');
                switch (xtype) {
                    case 'select':
                        _this.jqxDropDownList('destroy');
                        break;
                    case 'multi-select':
                        _this.jqxComboBox('destroy');
                        break;
                    case 'date-local':
                    case 'date-ym':
                    case 'date-full':
                        _this.jqxDateTimeInput('destroy');
                        break;
                    case 'tree':
                        _this.jqxDropDownButton('destroy');
                        break;
                }
            });
            if (!this.options.readonly) this.$element.emapValidate('destroy');
            this.options = null;
            $(this.$element).removeAttr("emap-role");
            $(this.$element).data('emapform', false).empty();
        };

        /**
         * @method reloadValidate
         * @description 校验重载
         */
        Plugin.prototype.reloadValidate = function() {
            this.$element.emapValidate('destroy');
            this.$element.emapValidate(this.options);
        };

        /**
         * @method requireItem
         * @description 添加字段的必填校验
         * @param {String|Array} ids - 表单字段的name
         */
        Plugin.prototype.requireItem = function(ids) {
            var self = this.$element;
            _emapFormDo(ids, _required);

            function _required(id) {
                var $formGroup = $('[data-name=' + id + ']', self).closest('.bh-form-group');
                if (!$formGroup.hasClass('bh-required')) {
                    $formGroup.addClass('bh-required');
                    self.emapForm('reloadValidate');
                }
            }
        };

        /**
         * @method unRequireItem
         * @description 取消字段的必填校验
         * @param {String|Array} ids - 表单字段的name
         */
        Plugin.prototype.unRequireItem = function(ids) {
            var self = this.$element;
            _emapFormDo(ids, _required);

            function _required(id) {
                var $formGroup = $('[data-name=' + id + ']', self).closest('.bh-form-group');
                if ($formGroup.hasClass('bh-required')) {
                    $formGroup.removeClass('bh-required');
                    self.emapForm('reloadValidate');
                }
            }
        };

        /**
         * @method getModel
         * @description 获取表单模型
         * @param {Boolean} [sort=false] - 是否对表单模型按分组序列化
         * @return {Object} 表单模型
         */
        Plugin.prototype.getModel = function(sort) { // sort 是否自动分组
            if (this.options.hasGroup && sort) {
                return _sortModel(this.options.data);
            } else {
                return this.options.data;
            }
        };

        /**
         * @method refreshColumns
         * @description 刷新只读表单和表格表单的列布局  自动补齐
         */
        Plugin.prototype.refreshColumns = function() {
            var options = this.options;
            if (options.readonly || options.model == 't') {
                $('.bh-form-block', this.$element).each(function() {
                    if (options.model == 't') {
                        var groups = $('.bh-form-group:visible', $(this)).parent();
                    } else {
                        var groups = $('.bh-form-group:visible', $(this));
                    }

                    // 补齐重置
                    groups.each(function(i) {
                        groups[i].className = groups[i].className.replace(/bh\-col\-md\-\d+/g, 'bh-col-md-' + $(groups[i]).data('col') * options.colWidth)
                    });


                    var colCounter = 0;
                    groups.each(function(i) {
                        var col = $(this).data('col');
                        colCounter += col;
                        if (col == options.cols || (options.cols == 3 && col == options.cols - 1)) {
                            // 满列的前一列 自动补齐
                            if ((colCounter - col) % options.cols) {
                                var newCol = groups.eq(i - 1).data('col') + options.cols * 1 - (colCounter - col) % options.cols;
                                // groups.eq(i-1).data('col', newCol);
                                groups[i - 1].className = groups[i - 1].className.replace(/bh\-col\-md\-\d+/g, 'bh-col-md-' + newCol * options.colWidth);
                                colCounter = 0;
                            }
                        } else if (i == groups.length - 1) {
                            // 最后一项自动补齐
                            if (colCounter % options.cols) {
                                var newCol = groups.eq(i).data('col') + options.cols * 1 - colCounter % options.cols;
                                // groups.eq(i).data('col', newCol);
                                groups[i].className = groups[i].className.replace(/bh\-col\-md\-\d+/g, 'bh-col-md-' + newCol * options.colWidth);
                                colCounter = 0;
                            }
                        }
                    });
                });
            }
        };

        /**
         * @method changeLabelColor
         * @description 不爱换表单字段label的背景色
         * @param {Object} [params] - json对象, key 为 颜色 可选值: 'primary', 'info', 'success', 'warning', 'danger' , 'normal',
         *  value 为要变换的 字段的name 可以为数组
         * @example
         *  $Form.emapForm('changeLabelColor', {
         *      primary: ['WID', 'XH'],
         *      success: ['XM']
         *  })
         */
        Plugin.prototype.changeLabelColor = function(params) {
            var instance = this;
            for (var k in params) {
                if (k != 'primary' && k != 'info' && k != 'success' && k != 'warning' && k != 'danger' && k != 'normal') {
                    console && console.error(k + '不是有效的label color 属性!');
                }
                if (params[k] instanceof Array) {
                    params[k].map(function(item) {
                        _handleColor(item, k, instance);
                    })
                } else {
                    _handleColor(params[k], k, instance);
                }
            }


            function _handleColor(name, color, instance) {
                var element = instance.$element;
                var type = instance.options.model;
                var form_group = $();
                if (type == 't' || instance.options.readonly == true) {
                    form_group = $('[data-name=' + name + ']', element).closest('.bh-form-group');
                } else if (type == 'h' || type == 'v') {
                    form_group = $('[data-name=' + name + ']', element).closest('.form-validate-block');
                }
                form_group.length && form_group.removeClass('bh-primary bh-info bh-success bh-warning bh-danger bh-normal').addClass('bh-' + color);
            }
        };

        /**
         * @method clearValidateInfo
         * @description 清除字段上的校验出错信息
         * @param {Array|String} [id=] 字段id
         */
        Plugin.prototype.clearValidateInfo = function(id) {
            var element = this.$element;
            if (id === undefined) { // 清除表单中所有校验信息
                element.jqxValidator('hide')
            } else if (id instanceof Array) { // 清除多个字段的校验信息
                if (id.length) {
                    id.map(function(item) {
                        element.jqxValidator('hideHint', '[data-name=' + item + ']');
                    });
                }
            } else if (typeof id == 'string') { // 清除单个字段的校验信息
                element.jqxValidator('hideHint', '[data-name=' + id + ']');
            }
        }


        return Plugin;
    })();

    // 渲染表单外框
    _renderFormWrap = function(element, options) {
        if (!options.data) return; // 为兼容孟斌的特殊样式表单 此处实现表单的假实例化功能
        var readOnly = options.readonly ? options.readonly : false;
        var $form = $('<div class="bh-form-horizontal" bh-form-role="bhForm" ></div>');

        if (readOnly || options.model == "t") {
            $form.addClass('bh-form-readonly');
            if (options.model == "t") {
                $form.addClass('bh-table-form');
            }
            // 如果开启 flexLayout , 则采用flex布局
            if (options.flexLayout && document.documentMode != 9 && document.documentMode != 10) {
                $form.addClass('bh-flex-form');
            }
        } else {
            if (options.model == "v") {
                $form.addClass('bh-form-S');
            }
        }

        options.hasGroup = options.data.filter(function(val) {
            return !!val.groupName && val.groupName != "";
        }).length > 0;

        if (options.hasGroup && options.renderByGroup) {
            // 分组表单
            var sortedModel = _sortModel(options.data);
            for (var i = 0; i < sortedModel.length; i++) {

                // ui 要求 标题下边距高位24  表单区域下边距改为36
                var groupContainer = $('<div bh-form-role=groupContainer>' +
                    '<div class="bh-col-md-12 bh-form-groupname sc-title-borderLeft bh-mb-24"  title="' + sortedModel[i].groupName + '" >' +
                    '</div>' +
                    '<div class="bh-form-block bh-mb-36" bh-role-form-outline="container" style="margin-left: 12px;margin-bottom: 36px;"></div>' +
                    '</div>');

                if (options.showCollapseBtn) {
                    $('.bh-form-groupname', groupContainer).append(
                        '<span bh-role-form-outline="title">' + sortedModel[i].groupName + '</span>' +
                        '<a bh-form-role="collapseBtn" data-collapse=false class="bh-text-caption bh-mh-8" style="font-weight: normal;" href="javascript:void(0)">收起</a>'
                    );
                } else {
                    $('.bh-form-groupname', groupContainer).attr('bh-role-form-outline', 'title').append(sortedModel[i].groupName);
                }
                var formBlock = $('[bh-role-form-outline=container]', groupContainer);
                var visibleItem = sortedModel[i].items.filter(function(val) {
                    return !val.get('hidden');
                });
                if (!sortedModel[i].groupName || visibleItem.length == 0) {
                    // 隐藏未分组的字段
                    groupContainer.css('display', 'none');
                    $('.bh-form-groupname', groupContainer).removeAttr('bh-role-form-outline');
                    $('.bh-form-block', groupContainer).attr('bh-role-form-outline', 'hidden');
                }
                if (options.model == 't') {
                    // 表格表单
                    _renderTableFormStructure(formBlock, sortedModel[i].items, options);
                } else if (readOnly) {
                    _renderReadonlyFormStructure(formBlock, sortedModel[i].items, options);
                } else {
                    _renderEditFormStructure(formBlock, sortedModel[i].items, options);
                }
                $form.append(groupContainer);
            }
        } else {
            // 不分组表单
            if (options.model == 't') {
                // 表格表单
                _renderTableFormStructure($form, options.data, options);
            } else if (readOnly) {
                _renderReadonlyFormStructure($form, options.data, options);
            } else {
                _renderEditFormStructure($form, options.data, options);
            }
        }
        element.append($form);
    };

    // model 分组排序
    _sortModel = function(model) {
        var result = [];
        for (var i = 0; i < model.length; i++) {
            var groupItem = result.filter(function(val) {
                return val.groupName == model[i].groupName;
            });
            if (groupItem.length == 0) {
                result.push({
                    "groupName": model[i].groupName,
                    "items": [model[i]]
                });
            } else {
                groupItem[0].items.push(model[i]);
            }
        }
        return result;
    };

    // 渲染只读表单结构
    _renderReadonlyFormStructure = function(form, data, options) {
        options.cols = options.cols ? options.cols : 3;
        options.colWidth = 12 / options.cols;

        var itemHtml = '';
        var columnCounter = 0;

        // 计算出最后一个显示的字段的序号

        // var lastVisibleItemIndex = 0;
        // $(data).each(function(i) {
        //     var attr = _getAttr(this);
        //     if (!attr.hidden) {
        //         lastVisibleItemIndex = i;
        //     }
        // });
        $(data).each(function(i) {
            var attr = _getAttr(this);
            if (!attr.hidden) {
                columnCounter += attr.col;
            }

            // if (i == lastVisibleItemIndex && options.autoColumn) {
            //     if (columnCounter % options.cols != 0) {
            //         attr.col += options.cols - columnCounter % options.cols;
            //     }
            // }
            if (attr.xtype == 'textarea') {
                attr.col = 12 / options.colWidth;
            }
            itemHtml += '<div class="bh-form-group  bh-col-md-' + attr.col * options.colWidth + '" ' + (attr.hidden ? 'style="display: none;"' : '') + ' data-col="' + attr.col + '" >' +
                '<label class="bh-form-label bh-form-readonly-label" title="' + attr.caption + '">' + attr.caption + '</label>' +
                '<div class="bh-form-readonly-input">';
            itemHtml += _renderReadonlyInputPlace(this, options);
            itemHtml += '</div></div>';

        });
        form.append(itemHtml).addClass('bh-form-block');
    };


    // 渲染表格表单结构
    _renderTableFormStructure = function(form, data, options) {
        var itemArray = [];
        options.cols = options.cols ? options.cols : 3;
        options.colWidth = 12 / options.cols;

        $(data).each(function() {
            var itemHtml = '';
            var attr = _getAttr(this);
            if (attr.xtype == "textarea") attr.col = options.cols;

            itemHtml += '<div class="form-validate-block bh-col-md-' + attr.col * options.colWidth + '" data-col="' + attr.col + '" >' +
                '<div class="bh-form-group ' + attr.required + '" ' + (attr.hidden ? 'style="display: none;"' : '') + ' >' +
                '<label class="bh-form-label bh-form-readonly-label" title="' + attr.caption + '">' + attr.caption + '</label>' +
                '<div class="bh-ph-8 bh-form-readonly-input" emap-role="input-wrap">';
            itemHtml += '<div class="bh-form-placeholder bh-form-flow">' + attr.placeholder + '</div>';
            itemHtml += '</div></div></div>';

            itemHtml = $(itemHtml);
            // 添加字段布局的最大高度为33px,防止在hover和校验出错时出现的边框导致高度增加而影响布局  仅在不占满一行的字段上生效 zhuhui 2016-07-16
            if (attr.col != options.cols && !options.flexLayout) {
                itemHtml.css({
                    'max-height': '33px'
                });
            }
            if (options.flexLayout && attr.hidden) {
                itemHtml.css({
                    'display': 'none'
                })
            }

            var input_wrap = $('[emap-role="input-wrap"]', itemHtml);
            if (attr.inputReadonly) {
                // 只读字段
                input_wrap.append(_renderReadonlyInputPlace(this, options));
            } else {
                // 可编辑字段
                input_wrap.append(_renderEditInputPlace(this))
                if (attr.xtype == undefined || attr.xtype == 'text') {
                    // 为 文本框 添加右边的编辑图标
                    input_wrap.append('<i class="iconfont icon-edit bh-table-form-icon"></i>');
                }
            }
            itemArray.push(itemHtml);
        });
        form.append(itemArray).addClass('bh-form-block');
        $(".form-validate-block", form).hover(function() {
            $(this).addClass("bh-actived");
        }, function() {
            $(this).removeClass("bh-actived");
        });
    };

    // 渲染编辑表单结构
    _renderEditFormStructure = function(form, data, options) {
        $(data).each(function() {
            var attr = _getAttr(this);
            var rowHtml = "";
            var controlHtml = _renderEditInputPlace(this);
            var placeholderWidth = 12 - parseInt(options.inputWidth);

            if (options.model == 'h') {
                rowHtml = '<div class="bh-row form-validate-block" {{hidden}} data-field=' + attr.name + ' >' +
                    '<div class="bh-form-group bh-col-md-' + options.inputWidth + ' ' + attr.required + ' {{inputReadonly}}">' +
                    '<label class="bh-form-label bh-form-h-label bh-pull-left" title="' + attr.caption + '">' + attr.caption + '</label>' +
                    '<div class="bh-ph-8" style="margin-left: 115px;" emap-role="input-wrap">' +
                    // controlHtml +
                    '</div>' +
                    '</div>' +
                    '<div class="bh-form-group bh-col-md-' + placeholderWidth + ' bh-color-caption bh-form-placeholder">' + attr.placeholder + '</div>' +
                    '</div>';
            } else if (options.model == 'v') {
                rowHtml = '<div class="bh-row form-validate-block" {{hidden}} data-field=' + attr.name + '>' +
                    '<div class="bh-form-group bh-col-md-12 ' + attr.required + ' {{inputReadonly}}" style="padding: 0 4px 0 12px;">' +
                    '<label class="bh-form-label  ">' + attr.caption + '</label>' +
                    '<div class="bh-form-vertical-input-wrap" emap-role="input-wrap">' +
                    // controlHtml +
                    '</div>' +
                    '</div>' +
                    '<div class="bh-form-group bh-col-md-12 bh-color-caption bh-form-placeholder">' + attr.placeholder + '</div>' +
                    '</div>';
            }
            rowHtml = rowHtml.replace(/\{\{hidden\}\}/g, (attr.hidden ? 'style="display: none;" hidden=true' : ''))
            rowHtml = $(rowHtml);
            $('[emap-role="input-wrap"]', rowHtml).append(controlHtml);

            form.append(rowHtml);

            // 垂直可编辑表单的 开关 控件改为 左右布局
            if (options.model == 'v' && attr.xtype == 'switcher') {
                $('.bh-form-group', rowHtml).addClass('bh-form-vertical-switcher');
            }

            if (form.attr('bh-role-form-outline') != "hidden") {
                form.attr('bh-role-form-outline', 'container');
            }
        });
    };


    _renderReadonlyInputPlace = function(ele, options) {
        var itemHtml = '';
        var attr = _getAttr(ele);
        if (attr.xtype == "textarea") attr.col = options.cols;

        switch (attr.xtype) {
            case "uploadfile":
            case "uploadphoto":
            case "uploadsingleimage":
            case "uploadmuiltimage":
                itemHtml += '<div xtype="' + attr.xtype + '" class="" data-name="' + attr.name + '" data-disable=true data-JSONParam="' + encodeURI(JSON.stringify(attr.JSONParam)) + '"></div>';
                break;
            case "textarea":
                itemHtml += '<textarea xtype="textarea" data-name="' + attr.name + '" class="bh-form-control" rows="3" maxlength="' + attr.dataSize + '" unselectable="on" readOnly  style="background: #fff;resize: none;border: none!important;box-shadow: none!important;overflow: auto;" ></textarea>';
                break;
            default:
                itemHtml += '<p data-name="' + attr.name + '" data-url="' + attr.url + '" xtype="' + attr.xtype + '" class="bh-form-static bh-ph-8"></p>';
        }

        return itemHtml;
    };

    _renderEditInputPlace = function(ele) {
        return WIS_EMAP_INPUT.renderPlaceHolder(ele);
    };


    _getAttr = function(item) {
        var attr = WIS_EMAP_SERV.getAttr(item);
        if (attr.defaultValue !== undefined) {
            _defaultValues[item.get("name")] = attr.defaultValue;
        }
        return attr;
    };

    _emapFormDo = function(ids, cb) {
        if ($.isArray(ids)) {
            $(ids).each(function() {
                cb(this);
            })
        } else {
            cb(ids);
        }
    };

    // 自动计算行高
    _calcLineHeight = function(element, options) {
        if (options.model == 't' || options.readonly == true) {
            $('.bh-form-readonly-label', element).each(function() {
                var h = $(this).height();
                if (h > 30) {
                    $(this).css({
                        "line-height": "13px",
                        "max-height": "28px"
                    });
                    if (h > 35) { // 超出两行显示 ...
                        $.bhCutStr({
                            dom: {
                                selector: $(this),
                                line: 2
                            }
                        })
                    }
                }
            });
        }
    };

    _eventBind = function(element, options) {
        var formWrap = $('[bh-form-role="bhForm"]', element);
        // 分组项 的展开收起
        formWrap.on('click', '[bh-form-role="collapseBtn"]', function() {
            var self = $(this);
            var formBlock = $(this).closest('[bh-form-role="groupContainer"]').find('.bh-form-block');
            if (self.data('collapse')) {
                formBlock.slideDown(200);
                self.data('collapse', false).text('收起');
            } else {
                formBlock.slideUp(200);
                self.data('collapse', true).text('展开');
            }
        });
    };

    $.fn.emapForm = function(options, params) {
        var instance;
        instance = this.data('emapform');
        if (!instance) {
            return this.each(function() {
                if (options == 'destroy') {
                    return this;
                }
                return $(this).data('emapform', new Plugin(this, options));
            });
        }
        if (options === true) return instance;
        if ($.type(options) === 'string') return instance[options](params);
        return this;
    };

    /**
     * @memberof module:emapForm
     * @prop {Object} data - 表单数据模型
     * @prop {String}  [root] - emap根路径
     * @prop {Boolean} [readonly=false] - 是否只读
     * @prop {Sring} [model=h] - 表单布局方式 可选值 'h' 水平布局  'v'' 垂直布局  't' 表格布局 ; 只在非只读表单中生效
     * @prop {Int} [cols=3] - 表单布局列数，只在只读表单和表格表单中生效，可选值  1 2 3
     * @prop {Boolean} [validate=true] - 是否开启表单校验
     * @prop {Boolean} [renderByGroup=true] - 在模型中有分组的情况下，是否按照分组进行渲染
     * @prop {Boolean} [autoColumn=true] - 只读表单和表格表单列宽是否自动补齐
     * @prop {Int} [inputWidth=6] - 水平布局表单，表单控件所占宽度 可选1-12
     * @prop {Object} [defaultOptions] - 控件默认配置参数， 是针对表单中的相同类型控件批量设置的参数，如给所有的单选下拉框统一设置开启搜索功能
      $('#form').emapForm({
         data: data,
         defaultOptions: {
           select: {
               search: true
           }
         }
      })
      若需要给单独字段设置额外配置参数，请在模型的JSONParam中实现
     * @prop {Boolean} [showCollapseBtn=false] - 分组表单是否显示 展开收起按钮
     * @prop {Boolean} [showDisableLockedIcon=false] - 表格表单 disable 项 控件右侧是否展示 小锁icon
     * @prop {Boolean} [flexLayout=false] - 只读表单和表格表单是否启用flex布局，**此选项ie9 ie10不兼容**
     */
    $.fn.emapForm.defaults = {
        readonly: false, // 是否只读
        model: 'h', // 编辑表单样式  h  v
        cols: '3', // 只读表单 列数
        root: "", // emap根路径
        validate: true, // 是否开启校验
        renderByGroup: true, // 按照分组渲染表单
        autoColumn: true, // 只读表单列宽自动补齐
        inputWidth: '6', // 水平表单 表单控件所占列数  默认6  最高12
        showCollapseBtn: false, // 分组表单是否显示 展开收起按钮
        showDisableLockedIcon: false, // 表格表单 disable 项 控件右侧是否展示 小锁icon
        flexLayout: false
    };
}).call(this);
/**
 * 类似于纵向tab页签
 */
(function($) {
  /**
   * 定义一个插件
   */
  var Plugin;

  var currentView = 'table';
  var gParams = {};
  var gPageNumber = null;
  var gPageSize = null;

  /**
   * 这里是一个自运行的单例模式。
   */
  Plugin = (function() {

    /**
     * 插件实例化部分，初始化时调用的代码可以放这里
     */
    function Plugin(element, options) {
      resetGlobalVar();
      //将插件的默认参数及用户定义的参数合并到一个新的obj里
      this.settings = $.extend({}, $.fn.emapGrid.defaults, options);
      //将dom jquery对象赋值给插件，方便后续调用
      this.$element = $(element);
      init(this.settings, this.$element);
    }

    return Plugin;

  })();

  Plugin.prototype = {
    /**
     * 重新加载数据
     */
    reload: function(params, callback) {
      gParams = params || gParams;
      if (callback === true) {
        gPageNumber = 0;
      }
      switchGrid(currentView, this.settings, this.$element, params);
    },

    getTable: function() {
      return this.$element.find('.bh-grid-table');
    },

    getCard: function() {
      return this.$element.find('.bh-grid-card');
    },

    getType: function() {
      return currentView;
    },

    renderTable: function(behind){
      renderTable(this.settings, this.$element, behind);
    },

    renderCard: function(){
      renderCard(this.settings, this.$element);
    }
  };

  function resetGlobalVar() {
    currentView = 'table';
    gParams = {};
    gPageNumber = null;
    gPageSize = null;
  }

  function init(settings, $element) {
    layout($element);
    if (settings.showCustomColumnSetting === false || settings.schema === false) {
      $element.find('.bh-switch-setting').remove();
    } else {
      settings.schema = true;
      settings.contextPath = settings.contextPath || window.contextPath;
    }
    switchGrid(settings.type, settings, $element);
    bindEvent(settings, $element);
  }

  function setSwitchButtonStyle(type, $element) {
    $('.bh-switch-item').removeClass('bh-active');
    if (type == 'list' || type == 'table') {
      $element.find('.bh-switch-list').addClass('bh-active');
    } else if (type == 'card') {
      $element.find('.bh-switch-card').addClass('bh-active');
    }
    if (type == 'card') {
      $element.find('.bh-switch-setting').hide();
    } else if (type == 'list') {
      $element.find('.bh-switch-setting').show();
    }
  }

  function bindEvent(settings, $element) {
    $element.find('.bh-switch-item').click(function(event) {
      var type = $(event.currentTarget).attr('data-x-type');
      if (type == 'setting') {
        $element.find('.bh-grid-table').emapdatatable('selectToShowColumns');
        return;
      }


      switchGrid(type, settings, $element);
      settings.gridAfterSwitch && settings.gridAfterSwitch(type);
    });
    $element.find('.bh-grid-table').on('pageSizeChanged', function(event) {
      var args = event.args;
      gPageNumber = args.pagenum;
      gPageSize = args.pageSize;
    });

    $element.find('.bh-grid-table').on('pageChanged', function(event) {
      var args = event.args;
      gPageNumber = args.pagenum;
      gPageSize = args.pageSize;
    });
  }

  function switchGrid(type, settings, $element, callback) {
    currentView = type;
    setSwitchButtonStyle(type, $element);
    if (type == 'list' || type == 'table') {
      if ($element.find('.bh-grid-table').prop('rendered')) {
        $element.find('.bh-grid-table').jqxDataTable({
          pageSize: gPageSize || 12
        });
        $element.find('.bh-grid-table').emapdatatable(true).source.data = $.extend({}, settings.params, gParams);

        if (!$element.find('.bh-grid-table').jqxDataTable('goToPage', gPageNumber || 0)) {
          $element.find('.bh-grid-table').jqxDataTable('updateBoundData');
        }
        //$element.find('.bh-grid-table').emapdatatable('reload', gParams);

      } else {
        renderTable(settings, $element);
      }
      $element.find('.bh-grid-table').show();
      $element.find('.bh-grid-card').hide();
      settings.afterCardRender && settings.afterCardRender();
    } else if (type == 'card') {
      gParams.pageSize = gPageSize;
      gParams.pageNumber = gPageNumber === 0 ? gPageNumber + '' : gPageNumber;
      if ($element.find('.bh-grid-card').prop('rendered')) {
        //qiyu 2016-8-26 卡片页面搜索时页面不跳转 RS-1316，孙仁秀
        if(gParams.pageNumber == 0){
            $element.find('.bh-grid-card').emapCard('reloadFirstPage', gParams);
        }else{
            $element.find('.bh-grid-card').emapCard('reload', gParams);
        }
        //$element.find('.bh-grid-card').emapCard('reload', gParams);
      } else {
        renderCard(settings, $element);
      }
      $element.find('.bh-grid-table').hide();
      $element.find('.bh-grid-card').show();
    }
  }

  function layout($element) {

    var _html =
      '<div class="bh-grid-container">' +
      ' <div class="bh-switch-card-view">' +
      '   <span class="bh-switch-item bh-switch-setting" data-x-type="setting" style="margin-right: 8px;"><i class="iconfont icon-zidingyixianshilie"></i><span>自定义列</span></span>' +
      '     <span class="bh-switch-item bh-switch-list bh-active" data-x-type="list"><i class="iconfont icon-viewlist"></i><span>列表</span></span>' +
      '     <span class="bh-switch-item bh-switch-card" data-x-type="card"><i class="iconfont icon-viewmodule"></i><span>卡片</span></span>' +
      ' </div>' +
      ' <div class="bh-grid-table"></div>' +
      ' <div class="bh-grid-card"></div>' +
      '</div>';

    $element.html(_html);
  }

  function renderTable(settings, $element, behind) {
    var tableOptions = $.extend({}, settings);
    tableOptions.params = $.extend({}, tableOptions.params, gParams);
    delete tableOptions.template;
    delete tableOptions.cardAfterRender;
    delete tableOptions.gridAfterSwitch;
    delete tableOptions.cardBeforeRender;
    delete tableOptions.showCustomColumnSetting;
    delete tableOptions.type;

    tableOptions.pageSize = gPageSize || 12;
    tableOptions.pageSizeOptions = [12, 24, 48, 96];
    $element.find('.bh-grid-table').prop('rendered', true);
    $element.find('.bh-grid-table').emapdatatable(tableOptions);
    if(!behind){
      setSwitchButtonStyle('list', $element)
    }
  }

  function renderCard(settings, $element, behind) {
    var cardSettings = $.extend({}, settings);
    cardSettings.params = $.extend({}, cardSettings.params, gParams);
    cardSettings.pageSize = gPageSize;
    cardSettings.pageNumber = gPageNumber;
    cardSettings.pageSizeOptionsChange = function(pageSize, pageNumber) {
      gPageSize = pageSize;
      gPageNumber = pageNumber;
    }
    $element.find('.bh-grid-card').prop('rendered', true);
    $element.find('.bh-grid-card').emapCard(cardSettings);
    if(!behind){
      setSwitchButtonStyle('card', $element)
    }
  }

  /**
   * 这里是关键
   * 定义一个插件 plugin
   */
  $.fn.emapGrid = function(options, params, callback) {
    var instance;
    instance = this.data('emapGrid');
    /**
     * 判断插件是否已经实例化过，如果已经实例化了则直接返回该实例化对象
     */
    if (!instance) {
      return this.each(function() {
        //将实例化后的插件缓存在dom结构里（内存里）
        return $(this).data('emapGrid', new Plugin(this, options));
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
      return instance[options](params, callback);
    }
    return this;
  };

  /**
   * 插件的默认值
   */
  $.fn.emapGrid.defaults = {

    //card or list, default list
    type: 'list',
    /**
     * [cardBeforeRender 每个card渲染前执行的事件(此事件中可以在渲染前对数据做处理，入参为row)]
     */
    cardBeforeRender: null,

    /**
     * [cardAfterRender card渲染结束后执行的事件]
     */
    cardAfterRender: null,

    /**
     * [gridAfterSwitch card list 切换后执行的事件]
     */
    gridAfterSwitch: null,

    /**
     * 是否显示自定义列设置
     */
    showCustomColumnSetting: true


  };
})(jQuery);

(function () {
    var Plugin, _linkSelect;

    Plugin = (function () {
        function Plugin(element, options) {
            this.options = $.extend({}, $.fn.emapLinkage.defaults, options);
            this.$element = $(element);
            _init(this.$element, this.options);
        }

        // Plugin.prototype.destroy = function () {
        //     this.options = null;
        //     $(this.$element).data('emapLinkage', false).empty();
        // };
        // Plugin.prototype.getValue = function () {
        // };
        return Plugin;
    })();


    //生成dom
    function _init(element, options) {
        $(options.data).each(function () {
            var linkageBy = this.linkageBy || this['form.linkageBy'];
            var linkageName = this.linkageName || this['form.linkageName'];
            var name = this.name;
            var orgDom = $('[data-name=' + linkageBy + ']', element);
            orgDom.data({
                'emaplinkagename': linkageName,
                'emaplinkageitem': name
            });
            if (orgDom.attr('xtype') == 'select') {
                $('[data-name=' + linkageBy + ']', element).on('select', function () {
                    var val = [{
                        "name": $(this).data('emaplinkagename'),
                        "value": $(this).val(),
                        "builder": "equal",
                        "linkOpt": "AND"
                    }];
                    _linkSelect($('[data-name=' + $(this).data('emaplinkageitem') + ']', element), JSON.stringify(val));
                });
            } else if (orgDom.attr('xtype') == 'tree') {
                $('[data-name=' + linkageBy + ']', element).on('close', function () {
                    var val = [{
                        "name": $(this).data('emaplinkagename'),
                        "value": $(this).emapDropdownTree('getValue'),
                        "builder": "equal",
                        "linkOpt": "AND"
                    }];
                    // var val = $(this).val();
                    _linkSelect($('[data-name=' + $(this).data('emaplinkageitem') + ']', element), JSON.stringify(val));
                });
            }

        });

    }

    _linkSelect = function (dom, val) {
        dom.jqxDropDownList('clear');
        var source = WIS_EMAP_SERV.getCode(dom.data('url'), undefined, undefined, undefined, val);
        if (dom.attr('xtype') == "select") {
            dom.data('loaded', true);
            dom.jqxDropDownList({source: source});
            if (source.length === 1) {
                // 若返回联动结果只有一项， 则默认选中该项
                dom.jqxDropDownList('selectIndex', 0 );
            }
        } else if (dom.attr('xtype') == 'selecttable') {
            dom.jqxDropDownList({source: source});
        }
        // else if (dom.attr('xtype') == "tree") {
        //     dom.emapDropdownTree('setSource', source);
        // }
    };


    $.fn.emapLinkage = function (options, params) {
        var instance;
        instance = $(this).data('emapLinkage');
        if (!instance) {
            return this.each(function () {
                if (options == 'destroy') {
                    return this;
                }
                return $(this).data('emapLinkage', new Plugin(this, options));
            });
        }
        if (options === true) return instance;
        if ($.type(options) === 'string') return instance[options](params);
        return this;
    };

    $.fn.emapLinkage.defaults = {
        storeId: 'image',
        contextPath: "/emap",
        defaultAvatar: "../u20.png",
        ratio: 1,
        width: 100,
        type: ['jpg', 'png', 'gif'],
        size: 5120
    };

}).call(undefined);

(function() {
    var template = [
        '<div class="bh-num-range">',
            '<div class="bh-num-range__input-wrap bh-pull-left">',
                '<div class="bh-num-range__input bh-num-input__1 "></div>',
            '</div>',
            '<span class="bh-num-range__linkLine"></span>',
            '<div class="bh-num-range__input-wrap bh-pull-right">',
                '<div class="bh-num-range__input bh-num-input__2"></div>',
            '</div>',
        '</div>'
    ].join('');

    function jqxBridge($elem, data) {
        $elem.toggleClass('jqx-widget', true);
        $elem.data('jqxWidget', data);
    }

    var NumRange = function(elem, options) {
        this.$elem = $(elem);
        this.template = template;

        this.$input1 = null;
        this.$line = null;
        this.$input2 = null;

        this.options = $.extend(NumRange.DEFAULT, options);

        this.init();
        jqxBridge(this.$elem, this);

        return this;
    };

    NumRange.DEFAULT = {
        value: null,
        spinButtons: true,
        inputMode: 'simple',
        decimal: null,
        decimalDigits: 0,
        promptChar: '',

        input1: null, //input1的配置
        input2: null //input2的配置
    };

    NumRange.prototype.init = function() {
        var $c = this.$elem;
        $c.html(this.template);
        this.$input1 = $c.find('.bh-num-input__1');
        this.$input2 = $c.find('.bh-num-input__2');
        this.$line = $c.find('.bh-num-range__linkLine');

        //input config
        var options = _.cloneDeep(this.options);
        var input1_conf = options.input1;
        var input2_conf = options.input2;

        delete options.input1;
        delete options.input2;

        var width = Math.floor((this.$elem.width() - 15) / 2);
        this.$elem.find('.bh-num-range__input-wrap').width(width);

        input1_conf = $.extend({}, options, input1_conf);
        input2_conf = $.extend({}, options, input2_conf);

        this.$input1.jqxNumberInput(input1_conf);
        this.$input2.jqxNumberInput(input2_conf);

        // this.upgradeInputWidth();


        this.bindEvent();
    };

    NumRange.prototype.bindEvent = function() {
        // var self = this;
        // window.onresize = function() {
        //     self.upgradeInputWidth();
        // };
    };

    NumRange.prototype.upgradeInputWidth = function() {
        var width = Math.floor((this.$elem.width() - 20) / 2);
        this.$input1.jqxNumberInput('width', width);
        this.$input2.jqxNumberInput('width', width);
    };

    //------------------------------API
    NumRange.prototype.val = function (value) {
        if (arguments.length) {
           return this.setValue(value);
        } else {
           return this.getValue();
        }
    };
    /**
     * 设置input的值
            {
                input1:
                input2:
            }
     * @param {array} valArr
     */
    NumRange.prototype.setValue = function(valObj) {
        this.$input1.val(valObj.input1);
        this.$input2.val(valObj.input2);
    };

    NumRange.prototype.getValue = function() {
        return [this.$input1.val() || this.$input1.find('input').val(), this.$input2.val() || this.$input2.find('input').val()].join(',');
    };

    /**
     * [disabled description]
     * @param  {obj} inputs
     *         boolean
     *             或者
     *         {
     *             input1: bool,
     *             input2: bool
     *         }
     */
    NumRange.prototype.disabled = function(inputs) {
        if(typeof inputs == 'boolean') {
            inputs = {
                input1: inputs,
                input2: inputs
            };
        }
        this.$input1.jqxNumberInput('disabled', inputs.input1);
        this.$input2.jqxNumberInput('disabled', inputs.input2);
    };

    //jquery adapter
    function Plugin(option, params) {
        this.each(function(index, elem) {
            var $elem = $(elem);
            var data = $elem.data('we.bhNumRange');
            var options = typeof option === 'object';
            if (!data) {
                $elem.data('we.bhNumRange', data = new NumRange(elem, options));
            }
        });

        if (typeof option === 'string') {
            return this.data('we.bhNumRange')[option](params);
        }
    }


    $.fn.bhNumRange = Plugin;
    $.fn.bhNumRange.constructor = NumRange;
})();


//TODO:
//1. 无法动态调整宽度 ： 如果没有值，动态调整时会设置为0  , 解决方法： 更新jqx的NumberInput 组件到最新

(function ($) {
    /**
     * @module: emapPDFViewer
     * @description pdf文件预览
     * @param options
     */
    $.emapPDFViewer = function (options) {
        if (!options.contextPath) {
            options.contextPath =  WIS_EMAP_SERV.getContextPath();
        }
        window.open( options.contextPath + '/sys/emapcomponent/pdf/index.do?file=' + options.url);
    };
})(jQuery);
/**
 * 将插件封装在一个闭包里面，防止外部代码污染  冲突
 */
(function () {
    /**
     * 定义一个插件
     */
    var Plugin,
        _render;  //插件的私有方法

    /**
     * 这里是一个自运行的单例模式。
     *
     */
    Plugin = (function () {

        /**
         * 插件实例化部分，初始化时调用的代码可以放这里
         */
        function Plugin(element, options) {
            //将插件的默认参数及用户定义的参数合并到一个新的obj里
            this.settings = $.extend({}, $.fn.emapRepeater.defaults, options);
            //将dom jquery对象赋值给插件，方便后续调用
            this.$element = $(element);
            _render(this.$element, this.settings);
        }

        /**
         * 插件的公共方法，相当于接口函数，用于给外部调用
         */
        Plugin.prototype.getValue = function () {
            /**
             * 方法内容
             */
            var returnValue = [];
            $(this.$element).find(".repeateritem").each(function(){
                var v = $(this).data("value");
                if(v !== undefined)
                  returnValue.push($(this).data("value"));
            });
            this.$element.val(returnValue);
        };

        Plugin.prototype.setValue = function (valueArray) {
            /**
             * 方法内容
             */
            //this.$element.val(valueArray);
            $(this.$element).find(".repeateritem").each(function(){
                //var v = $(this).data("value");
                $(this).trigger("setValue", [valueArray]);
            });

        };

        return Plugin;

    })();

    /**
     * 插件的私有方法
     */
    _render = function (element, options) {
        var $element = element;
        var source =
        {
            datatype: "json",
            root:"datas>code>rows",
            datafields: [
                { name: 'id' },
                { name: 'name' }
            ],
            id: 'id',
            url: options.url,
            data: options.params
        };
        var dataAdapter = new $.jqx.dataAdapter(source, {
            loadComplete: function () {
                var records = dataAdapter.records;
                for (var i = 0; i < records.length; i++) {
                    var item = records[i];
                    var itemDOM = $("<div class='repeateritem'></div>");
                    if(options.align == "horizontal")itemDOM.css({"float":"left"});
                    options.render(itemDOM, item);
                    $element.append(itemDOM);
                }
            }
        });
        dataAdapter.dataBind();
    };

    /**
     * 这里是关键
     * 定义一个插件 plugin
     */
    $.fn.emapRepeater = function (options, params) {
        var instance;
        instance = this.data('emapRepeater');
        /**
         *判断插件是否已经实例化过，如果已经实例化了则直接返回该实例化对象
         */
        if (!instance) {
            return this.each(function () {
                //将实例化后的插件缓存在dom结构里（内存里）
                return $(this).data('emapRepeater', new Plugin(this, options));
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
    $.fn.emapRepeater.defaults = {
        align: "vertical",
        itemWidth: '50%'
    };
}).call(this);

'use strict';
(function () {
    //定义html和css

    var tpl = '<div class="bh-ers-j-condition"></div>' +
        '<div class="bh-ers-add bh-ph-8 bh-ers-j-add-btn">' +
        '<i class="iconfont icon-addcircle"></i>' +
        '<span>添加条件</span>' +
        '</div>';

    var Plugin;

    Plugin = (function () {
        function Plugin(element, options) {
            this.options = $.extend({}, $.fn.emapRuleSetting.defaults, options);
            this.$element = $(element);
            _create(this.$element, this.options);
        }

        Plugin.prototype.getValue = function () {
            return getCondition(this.$element, this.options);
        };

        Plugin.prototype.setValue = function (val) {
            var value;
            var _this = this;
            $('.bh-ers-j-condition', _this.$element).empty();
            if (!val || val == null || val == "") {return}
            if (typeof val == 'string') {
                value = JSON.parse(val);
            } else {
                value = val;
            }
            if (value.length && value.length > 0) {
                $(value).each(function () {
                    addCondition(_this.$element, _this.options, this);
                });
            }
        };
        return Plugin;
    })();


    //生成dom
    function _create(element, options) {
        element.html(tpl);
        _eventListener(element, options);
    }

    //事件注册
    function _eventListener(element, options) {
        //  添加条件
        $('.bh-ers-j-add-btn', element).on('click', function () {
            addCondition(element, options);
        });

        // 删除
        element.on('click', '.bh-ers-close', function () {
            var $this = $(this);
            BH_UTILS.bhDialogWarning({
                title: '确定要删除该条件吗？',
                buttons: [{
                    text: '确定', className: 'bh-btn-warning',
                    callback: function callback() {
                        $this.parent().remove();
                    }
                }, {text: '取消', className: 'bh-btn-default'}]
            });
        });

        // select change
        element.on('change', '.bh-ers-select .bh-ers-nice-select', function () {
            var row = $(this).closest('.bh-ers-row');
            var model = options.data.controls;
            var value = $(this).val();
            var selectedModel = model.filter(function (item) {
                return item.name == value;
            })[0];
            renderRow(options, selectedModel, row);
        });
    }

    // 添加一个搜索条件
    function addCondition(element, options, value) {
        var row = $('<div class="bh-clearfix bh-ers-row" ></div>');
        var selectModel = options.data.controls;
        row.append('<div class="' + (options.showBuilder ? 'bh-ers-col-3' : 'bh-ers-col-2') + '"><div class="bh-ers-select"></div></div>');
        if (options.showBuilder) {
            row.append('<div class="bh-ers-col-3"><div class="bh-ers-builder"></div></div>');
        }
        row.append('<div class="' + (options.showBuilder ? 'bh-ers-col-3' : 'bh-ers-col-2') + '"><div class="bh-ers-option"></div></div>');
        row.append('<i class="iconfont icon-close bh-ers-close"></i>');

        renderSelect({
            dom: $('.bh-ers-select', row),
            source: selectModel
        });
        $('.bh-ers-j-condition', element).append(row);
        if (value) {
            var valueModel = selectModel.filter(function (val) {
                return val.name == value.name;
            })[0];
            $('.bh-ers-select select', row).val(value.name);
            renderRow(options, valueModel, row);
        } else {
            renderRow(options, selectModel[0], row);
        }
        if (value) {
            $('.bh-ers-builder select', row).val(value.builder);
            $('.bh-ers-option select, .bh-ers-option input', row).val(value.value);
        }
    }

    // 渲染 字段下拉框
    function renderSelect(opt) {
        var select = $('<select class="bh-ers-nice-select"></select>');
        $(opt.source).each(function () {
            select.append('<option value="' + this.name + '">' + this.caption + '</option>');
        });
        opt.dom.html(select);
        opt.dom.append('<i class="iconfont icon-arrowdropdown bh-ers-nice-select-arrow"></i>');
    }

    // 渲染赋值下拉框
    function renderOptionSelect(opt) {
        var select = $('<select class="bh-ers-nice-select"></select>');
        $(opt.source).each(function () {
            select.append('<option value="' + this.id + '">' + this.name + '</option>');
        });
        opt.dom.html(select);
        opt.dom.append('<i class="iconfont icon-arrowdropdown bh-ers-nice-select-arrow"></i>');
    }

    function renderRow(options, model, dom) {
        var builderList = model.builderList;

        renderSelect({
            dom: $('.bh-ers-builder', dom),
            source: options.data.builderLists[builderList]
        });


        switch (model.xtype) {
            case 'select' :
            case 'radiolist' :
            case 'checkboxlist' :
                _getItemModel(model.url, function (data) {
                    renderOptionSelect({
                        dom: $('.bh-ers-option', dom),
                        source: data
                    });
                });
                break;
            case 'date-local':
            case 'date-ym':
            case 'date-full':
                $('.bh-ers-option', dom).empty().append('<div class="bh-ers-control"></div>');
                $('.bh-ers-option div', dom).jqxDateTimeInput({
                    width: "100%",
                    value: null,
                    formatString: 'yyyy-MM-dd',
                    culture: 'zh-CN'
                });
                break;
            default :
                $('.bh-ers-option', dom).html('<input class="bh-form-control bh-ers-control" type="text">')
        }
    }

    function _getItemModel(url, callback) {
        //qiyu 2016-11-19 将获取mock的url提取函数，在mock文件中重新定义
        var source = {
            url: url,
            datatype: "json",
            async: false,
            root: "datas>code>rows"
        };
        if (typeof window.MOCK_CONFIG != 'undefined') {
            source = getSourceMock(source);
        }
        var dataAdapter = new $.jqx.dataAdapter(source, {
            loadComplete: function (records) {
                callback(records.datas.code.rows);
            }
        });
        dataAdapter.dataBind();
    };

    function getCondition(element, options) {
        var result = [];
        $('.bh-ers-row', element).each(function () {
            var _this = $(this);
            var optionValue;
            if ($('.bh-ers-option .bh-ers-control', _this).length == 0) {
                optionValue = $('.bh-ers-option .bh-ers-nice-select', _this).val();
            } else {
                optionValue = $('.bh-ers-option .bh-ers-control', _this).val();
            }
            if (!optionValue || $.trim(optionValue) == "") {
                return true;
            }
            var resultItem = {
                "name": $('.bh-ers-select .bh-ers-nice-select', _this).val(),
                "value": optionValue,
                "linkOpt": "AND"
            };
            if ($('.bh-ers-builder .bh-ers-nice-select', _this).length > 0) {
                resultItem.builder = $('.bh-ers-builder .bh-ers-nice-select', _this).val();
            } else {
                resultItem.builder = $('bh-.ers-control', _this).val();
            }

            result.push(resultItem);
        });
        return JSON.stringify(result);
    }


    $.fn.emapRuleSetting = function (options, params) {
        var instance;
        instance = this.data('emapRuleSetting');
        if (!instance) {
            return this.each(function () {
                return $(this).data('emapRuleSetting', new Plugin(this, options));
            });
        }
        if (options === true) return instance;
        if ($.type(options) === 'string') return instance[options](params);
        return this;
    };

    $.fn.emapRuleSetting.defaults = {
        showBuilder: true,
        builderData: [{
            name: "等于",
            id: "equal"
        }]
    };
}).call(undefined);
(function () {
    var Plugin, _init;
    var _animateTime, _eventBind, _renderEasySearch, _renderQuickSearch, _initConstructorEditor, _popOver, _getConditionFromEditor,
        _renderInputPlace, _getSearchCondition, _findModel, _getConditionFromForm, _bindEditorEvent, _renderInput3Place, _validateEditor,
        _renderOneTag, _addOrFilter, _addAndFilter, _resetRowIndent, _refreshUnfixNum, _schemaDialogEventBind, _closeSchema, _initSchema, _renderFixedSchema;

    var _defaultValues = [];
    Plugin = (function () {
        function Plugin(element, options) {
            this.options = $.extend({}, $.fn.emapRulesConstructor.defaults, options);
            this.$element = $(element);
            this.$element.attr("emap-role", "advancedQuery").attr("emap-pagePath", "").attr("emap-action", this.options.data.name);
            this.options._initCount = 0;  // 需要初始化的控件的总数
            this.options._initCounter = 0; // 控件初始化计数器
            _init(this.$element, this.options);
        }

        Plugin.prototype.getValue = function () {
            return _getSearchCondition(this.options);
        };

        Plugin.prototype.setValue = function (val) {
            this.$element.emapRulesConstructor('clear');
            var value = (typeof val == "string") ? JSON.parse(val) : val;
            var $advanced = this.options.$advanced;
            var block = $('.bh-rules-block', $advanced);
            $($advanced).addClass('bh-active');
            this.options.searchModel = 'advanced';
            $('.bh-rules-block', $advanced).show();
            $('.bh-rules-body > .bh-rules-editor', $advanced).hide();
            for (var i = 0; i < value.length; i++) {
                if ($.isArray(value[i])) {
                    for (var j = 0; j < value[i].length; j++) {
                        if (j == 0) {
                            // 添加行
                            _addOrFilter(this.options, value[i][j]);
                        } else {
                            // 添加tag
                            _addAndFilter(this.options, value[i][j], $('.bh-rules-row:eq(' + i + ')', block))
                        }
                    }
                }
            }
        };

        Plugin.prototype.clear = function () {
            var $advanced = this.options.$advanced;
            $('.bh-rules-row:not([rules-role=addOrRow])').remove();
            _resetRowIndent(this.options);
        };

        return Plugin;
    })();

    _init = function (element, options) {

        element.attr("emap", JSON.stringify({
            "emap-url": WIS_EMAP_SERV.url,
            "emap-name": WIS_EMAP_SERV.name,
            "emap-app-name": WIS_EMAP_SERV.appName,
            "emap-model-name": WIS_EMAP_SERV.modelName
        }));
        delete WIS_EMAP_SERV.url;
        delete WIS_EMAP_SERV.name;
        delete WIS_EMAP_SERV.appName;
        delete WIS_EMAP_SERV.modelName;

        var modalData = options.data.controls;
        var easyArray = [];
        var quickArray = [];
        var guid = BH_UTILS.NewGuid();

        _animateTime = function () {
            return 450;
        };

        _eventBind = function (options) {
            var $advanced = options.$advanced;
            // var $advancedModal = options.$advancedModal;

            // 展开高级搜索
            $advanced.on("click", "[bh-advanced-query-role=advancedOpen]", function () {
                $($advanced).addClass('bh-active');
                options.searchModel = 'advanced';
            });

            // 关闭高级搜索
            $advanced.on("click", "[bh-advanced-query-role=advancedClose]", function () {
                $($advanced).removeClass('bh-active');
                options.searchModel = 'easy';
            });

            // easy搜索 监听 按键输入
            $advanced.on('keyup', '.bh-advancedQuery-quick-search-wrap input[type=text]', function (e) {
                var easySelectH = $advanced.data('easyarray').length * 28 + 1; // 下拉框高度
                var easySelectW = $(this).outerWidth(); // 下拉框宽度
                var searchValue = $(this).val();
                var pos = $(this).offset();
                var selectDiv = $('.bh-advancedQuery-quick-select[data-guid=' + options.guid + ']');
                pos.top += 28;

                // 回车快速搜索
                if (e.keyCode == 13) {
                    selectDiv.css({'height': 0, 'border-width': '0'});
                    element.trigger('search', [_getSearchCondition(options), options]);
                    return;
                }

                if (searchValue == '') {
                    selectDiv.css({'height': 0, 'border-width': '0'});
                } else {
                    $('.bh-advancedQuery-easy-query', selectDiv).html(searchValue);
                    selectDiv.css({
                        'height': easySelectH + 'px',
                        'width': easySelectW + 'px',
                        'border-width': '1px',
                        'top': pos.top,
                        'left': pos.left
                    });
                }
            });

            //  点击下拉框选项
            $('[bh-advanced-query-role=advancedEasySelect][data-guid=' + options.guid + ']').on('click', 'p', function () {
                var selectDiv = $(this).closest('[bh-advanced-query-role=advancedEasySelect]');
                if (selectDiv.height() > 0) {
                    selectDiv.css({'height': 0, 'border-width': '0'});
                }
                element.trigger('search', [_getSearchCondition(options, $(this).data('name')), options]);
            });

            // 点击搜索按钮  easy search
            $advanced.on('click', '[bh-advanced-query-role=easySearchBtn]', function () {
                element.trigger('search', [_getSearchCondition(options), options]);
            });

            // 点击筛选条件  quick search
            $advanced.on('click', '[bh-advanced-query-role=quickSearchForm] .bh-label-radio', function () {
                // radio 的事件冒泡问题
                setTimeout(function () {
                    element.trigger('search', [_getSearchCondition(options), options]);
                }, 200);
            });

            // 执行高级搜索
            $advanced.on('click', '[bh-advanced-query-role=advancedSearchBtn]', function () {
                element.trigger('search', [_getSearchCondition(options), options]);
            });

            // 监听 控件初始化事件  bhInputInitComplete, 根据计数器options._initCounter 判断出发高级搜索组件的 初始化回调
            element.on('bhInputInitComplete', function () {
                options._initCounter++;
                if (options._initCounter == options._initCount) {
                    element.trigger('init', [options]);
                    options.initComplete && options.initComplete();
                }
            });

            // easySearch 下拉框的关闭
            $(document).on('click', function (e) {
                var target = e.target;
                if ($(target).closest('[bh-advanced-query-role=advancedEasySelect]').length == 0) {
                    var selectDiv = $('.bh-advancedQuery-quick-select');
                    // if (selectDiv.height() > 0) {
                    selectDiv.css({'height': 0, 'border-width': '0'});
                    // }
                }
            });

            // 点击 新增且条件 按钮
            $advanced.on('click', '[rules-role=addAndBtn]', function () {
                var row = $(this).closest('.bh-rules-row');
                _popOver(options, "+ 新增[且]条件", $(this), function (e, ele) {
                    var editorData = _getConditionFromEditor(ele);
                    if (editorData) {
                        _addAndFilter(options, editorData, row);
                    } else {
                        return false;
                    }

                });
            });

            // 点击新增或条件按钮
            $advanced.on('click', '[rules-role=addOrBtn]', function () {
                _popOver(options, "+ 新增[或]条件", $(this), function (e, ele) {
                    var editorData = _getConditionFromEditor(ele);
                    if (editorData) {
                        _addOrFilter(options, editorData);
                    } else {
                        return false;
                    }
                });
            });

            // 页面初始editor 的确定按钮
            $advanced.on('click', '.bh-rules-body > .bh-rules-editor [rules-role=editorAddBtn]', function () {
                var editorData = _getConditionFromEditor($(this).closest('.bh-rules-editor'));
                if (editorData) {
                    _addOrFilter(options, editorData);
                    $('.bh-rules-block', $advanced).show();
                    $('.bh-rules-body > .bh-rules-editor', $advanced).hide();
                }
            });
            // 页面初始editor 的关闭按钮  点击后清空editor
            $advanced.on('click', '.bh-rules-body > .bh-rules-editor [rules-role=editorCloseBtn]', function () {
                var editor = $(this).closest('.bh-rules-editor');
                $('[rules-role^=editorInput]', editor).each(function (i) {
                    if (i == 2) {
                        switch ($(this).attr('xtype')) {
                            case 'select' :
                                $(this).jqxDropDownList("clearSelection");
                                break;
                            default :
                                $(this).val("");
                        }
                    } else {
                        $(this).jqxDropDownList("clearSelection");
                    }
                });
            });

            // tag点击删除
            $advanced.on('click', '[rules-role=closeTag]', function () {
                var tag = $(this).parent();
                var andSPan = tag.prev('.bh-rules-and-text');
                if (andSPan.length > 0) {
                    //删除tag
                    andSPan.remove();
                    tag.remove();
                } else {
                    var row = tag.closest('.bh-rules-row');
                    if ($('.bh-tag', row).length > 1) {
                        tag.next('.bh-rules-and-text').remove();
                        tag.remove();
                    } else {
                        // 该行只剩一个tag  所以删除整行
                        row.remove();
                        _resetRowIndent(options);
                    }
                }
                $.bhPaperPileDialog.resetPageFooter();
                $.bhPaperPileDialog.resetDialogFooter();
            });

            //编辑 tag
            $advanced.on('click', '[rules-role=tagTxt]', function (e) {
                var $trigger = $(e.currentTarget);
                var $tag = $trigger.closest('.bh-tag');

                var data = $tag.data('data');

                _defaultValues = [data.name, data.builder, data.value, data.value_display];
                //回写CALLBACK
                var callback = function (e, editor) {
                    var data = _getConditionFromEditor(editor);
                    if (!data) {
                        return false;
                    }
                    $tag.data('data', data);
                    $('span', $tag).text('"' + data.caption + '" ' + data.builder_display + ' "' + (data.value_display ? data.value_display : data.value) + '"');
                    return true;
                };
                //弹出气泡弹窗
                _popOver(options, '编辑: ' + $trigger.text(), $tag, callback);
            });

            // 保存为方案
            $advanced.on('click', '[bh-advanced-query-role="saveSchema"]', function () {
                $(this).closest('.bh-schema-btn-wrap').addClass('active');
            });

            // 点击取消保存方案
            $advanced.on('click', '[bh-advanced-query-role=saveSchemaCancel]', function () {
                _closeSchema(options);
            });

            // 点击确认保存搜索方案
            $advanced.on('click', '[bh-advanced-query-role=saveSchemaConfirm]', function () {
                var name = $('.bh-schema-name-input', $advanced).val();
                var conditionData = _getSearchCondition(options);
                var fixed = $('[bh-schema-role=fixCheckbox]', $advanced).prop('checked') ? 1 : 0;
                var programContainer = $('.bh-rules-program', $advanced);
                element.emapSchema('saveSchema', [name, conditionData, fixed]).done(function () {
                    _closeSchema(options);
                    var schInfo = options.schemaList.filter(function (val) {
                            return val.SCHEMA_NAME == name;
                        });
                        // 判断是否有重名的方案  如果有  直接覆盖
                    if (schInfo.length) {
                        // 重名方案
                        options.schemaList.filter(function (val) {
                            if (val.SCHEMA_NAME == name) {
                                val.CONTENT = conditionData;
                                val.FIXED = fixed;
                            }
                        });
                    } else {
                        schInfo = {
                            "CONTENT": conditionData,
                            "SCHEMA_NAME": name,
                            "FIXED": fixed
                        };
                        options.schemaList.push(schInfo);
                    }

                    if (fixed == 1) {
                        var sch = $('<a  data-name="' + name + '" href="javascript:void(0)">' + name + '</a>');
                        sch.data('info', schInfo);
                        $('.bh-rules-program [bh-schema-role=more]', element).before(sch);
                    } else {
                        var sch = $('.bh-rules-program', element).find('a[data-name=' + name + ']');
                        if (sch.length) {
                            sch.remove();
                        }
                    }
                    programContainer.show();

                }).fail(function (res) {
                    console && console.log(res)
                });
            });

            // 点击快速方案
            $advanced.on('click', '.bh-rules-program a:not([bh-schema-role=more])', function () {
                var condition = $(this).data('info');
                element.emapRulesConstructor('setValue', condition.CONTENT);
                element.trigger('search', [condition.CONTENT, options]);
            });

            // 点击方案的 更多按钮 呼出方案列表侧边弹窗
            $advanced.on('click', '[bh-schema-role=more]', function () {
                if (!$('main > article aside').length) {
                    $('main > article').append('<aside></aside>');
                }
                $.bhPropertyDialog.show({
                    "content": '<h3>条件构造方案</h3>' +
                        '<section>' +
                        '<div id="schemaDialog" style="display: none;">' +
                        '<p class="bh-color-caption">置顶方案(将直接出现在搜索栏上)</p>' +
                        '<ul class="bh-schema-list" bh-schema-role="fixedUl">' +
                        // '<li>' +
                        // '<a class="bh-pull-right">删除</a>' +
                        // '<a class="bh-pull-right">取消置顶</a>' +
                        // '固定的条件构造方案' +
                        // '</li>' +
                        // '<li>' +
                        // '<a class="bh-pull-right">删除</a>' +
                        // '<a class="bh-pull-right">取消置顶</a>' +
                        // '固定的条件构造方案' +
                        // '</li>' +
                        '</ul>' +
                        '<p class="bh-color-caption">其他方案(<span>4</span>)</p>' +
                        '<ul class="bh-schema-list" bh-schema-role="unFixedUl"></ul>' +
                        '</div>' +
                        '</section>', //侧边栏的内容html
                    "footer": '', //侧边栏的页脚按钮
                    ready: function () { //初始化完成后的处理
                        var fixedUl = $('[bh-schema-role=fixedUl]');
                        var unFixedUl = $('[bh-schema-role=unFixedUl]');
                        $(options.schemaList).each(function () {
                            var liHtml;
                            liHtml = $('<li data-name="' + this.SCHEMA_NAME + '">' +
                                '<a href="javascript:void(0)" class="bh-pull-right" bh-schema-role="delete">删除</a>' +
                                '<a href="javascript:void(0)" class="bh-pull-right" bh-schema-role="unfixed">取消置顶</a>' +
                                '<a href="javascript:void(0)" class="bh-pull-right" bh-schema-role="fixed">置顶</a>' +
                                this.SCHEMA_NAME +
                                '</li>').data('info', this);
                            if (this.FIXED == 1) {
                                fixedUl.append(liHtml);
                            } else {
                                unFixedUl.append(liHtml);
                            }
                            _refreshUnfixNum(unFixedUl);
                        });
                        if (!options.schemaList.length) {
                            $('#schemaDialog').length && $('#schemaDialog').hide();
                        } else {
                            $('#schemaDialog').length && $('#schemaDialog').show();
                        }
                        _schemaDialogEventBind(element, options);
                    }
                });
            });
        };

        // 更新未置顶的方案个数
        _refreshUnfixNum = function (ul) {
            var count = $('li', ul).length;
            ul.prev('p').find('span').html(count);
            if (count == 0) {
                ul.hide().prev('p').hide();
            } else {
                ul.show().prev('p').show();
            }

            var fixedUl = $(ul).siblings('[bh-schema-role=fixedUl]');
            if ($('li', fixedUl).length == 0) {
                fixedUl.hide().prev('p').hide();
            } else {
                fixedUl.show().prev('p').show();
            }
        };

        // 初始化方案
        _initSchema = function (element, options) {
            options = $.extend(options, {
                schemaType: "aq"
            });
            $.fn.emapSchema && $(element).emapSchema(options);
            _renderFixedSchema(element, options);
        };

        // 关闭构造方案
        _closeSchema = function (options) {
            var wrap = $('.bh-schema-btn-wrap', options.$advanced);
            wrap.removeClass('active');
            $('.bh-schema-name-input', wrap).val('');
            $('[bh-schema-role=fixCheckbox]', wrap).prop('checked', false);
        };

        // 方案侧边弹窗事件绑定
        _schemaDialogEventBind = function (element, options) {
            var dialog = $('#schemaDialog');
            // 删除
            dialog.on('click', '[bh-schema-role=delete]', function (e) {
                e.stopPropagation();
                var li = $(this).parent();
                var name = li.data('info').SCHEMA_NAME;
                if (element.emapSchema('deleteSchema', name)) {
                    li.remove();
                    $('.bh-rules-program', element).find('[data-name=' + name + ']').remove();
                    $(options.schemaList).each(function (i) {
                        if (this.SCHEMA_NAME == name) {
                            options.schemaList.splice(i, 1);
                        }
                    });
                    _refreshUnfixNum($('[bh-schema-role=unFixedUl]', dialog));
                }
            });

            // 点击选择方案
            dialog.on('click', 'li', function (event) {
                var condition = $(this).data('info');
                element.emapAdvancedQuery('setValue', condition.CONTENT);
                element.trigger('search', [condition.CONTENT, options, event]);
                $.bhPropertyDialog.hide();
            });

            // 置顶
            dialog.on('click', '[bh-schema-role=fixed]', function (e) {
                    e.stopPropagation();
                    var li = $(this).closest('li');
                    var info = li.data('info');
                    var name = info.SCHEMA_NAME;
                    var conditionData = info.CONTENT;
                    element.emapSchema('saveSchema', [name, conditionData, 1]).done(function () {
                        _closeSchema(options);
                        var infoData = {
                            "CONTENT": conditionData,
                            "SCHEMA_NAME": name,
                            "FIXED": 1
                        }
                        options.schemaList.filter(function (val) {
                            return val.SCHEMA_NAME == name;
                        })[0].FIXED = 1;
                        $('[bh-schema-role=fixedUl]', dialog).append(li);
                        var sch = $('<a  data-name="' + name + '" href="javascript:void(0)">' + name + '</a>');
                        sch.data('info', infoData);
                        $('.bh-rules-program [bh-schema-role=more]', element).before(sch);
                        _refreshUnfixNum($('[bh-schema-role=unFixedUl]', dialog));
                    }).fail(function (res) {
                        console && console.log(res);
                    });
                });
                // 取消置顶
            dialog.on('click', '[bh-schema-role=unfixed]', function (e) {
                e.stopPropagation();
                var li = $(this).closest('li');
                var info = li.data('info');
                var name = info.SCHEMA_NAME;
                var conditionData = info.CONTENT;
                element.emapSchema('saveSchema', [name, conditionData, 0]).done(function () {
                    _closeSchema(options);
                    options.schemaList.filter(function (val) {
                        return val.SCHEMA_NAME == name;
                    })[0].FIXED = 0;
                    $('[bh-schema-role=unFixedUl]', dialog).append(li);
                    $('.bh-rules-program', element).find('[data-name=' + name + ']').remove();
                    _refreshUnfixNum($('[bh-schema-role=unFixedUl]', dialog));

                }).fail(function (res) {
                    console && console.log(res);
                });
            });
        };

        // 渲染固定的搜索方案
        _renderFixedSchema = function (element, options) {
            options.schemaList = element.emapSchema('getSchemaList');
            options.schemaList = options.schemaList ? options.schemaList : [];
            var $advanced = options.$advanced;
            var programContainer = $('.bh-rules-program', $advanced);


            if (options.schemaList.length > 0) {
                var fixedSchema = options.schemaList.filter(function (val) {
                    return val.FIXED == 1;
                });
                if (!fixedSchema.length) {
                    programContainer.html('<label>构造方案: </label><a bh-schema-role="more" href="javascript:void(0)">更多 ></a>');
                } else {
                    $(fixedSchema).each(function () {
                        var sch = $('<a  data-name="' + this.SCHEMA_NAME + '" href="javascript:void(0)">' + this.SCHEMA_NAME + '</a>');
                        sch.data('info', this);
                        $('[bh-schema-role=more]', programContainer).before(sch);
                    });
                    programContainer.show();
                }
            } else {
                programContainer.hide();
            }
        };

        _renderEasySearch = function (easyArray, options) {
            var easySearch = '';
            var easySearchPlaceholder = ''; // easySearch 文本框placeholder

            if (easyArray.length && easyArray.length > 0) {
                easySearchPlaceholder += '请输入';
                $(easyArray).each(function () {
                    easySearchPlaceholder += this.caption + '/';
                    easySearch += '<p data-name="' + this.name + '">搜索 <span class="bh-advancedQuery-easy-caption">' + this.caption + '</span> : <span class="bh-advancedQuery-easy-query"></span></p>';
                });
                $('.bh-advancedQuery-quick-select[data-guid=' + options.guid + ']').html(easySearch);
                easySearchPlaceholder = easySearchPlaceholder.substring(0, easySearchPlaceholder.length - 1);
                $('.bh-advancedQuery-quick-search-wrap input[type=text]', options.$advanced).attr('placeholder', easySearchPlaceholder);
            } else {
                $('.bh-advancedQuery-quick-search-wrap', options.$advanced).hide();
                $('[bh-advanced-query-role=easySearchBtn]', options.$advanced).hide();
            }
        };

        _renderQuickSearch = function (quickArray) {
            var quickSearchHtml = $('<div></div>');
            $(quickArray).each(function (i) {
                /**
                 * 代码不做 数量显示
                 * 由设计规范控制
                 */
                //if (i >= 3) {
                //    return false;
                //}
                if (this.xtype == 'select' || this.xtype == 'radiolist' || this.xtype == 'checkboxlist') {
                    this.xtype = 'buttonlist';
                }
                quickSearchHtml.append(_renderInputPlace(this));
            });
            return quickSearchHtml;
        };

        _renderInputPlace = function (item, showClose) {
            //showClose  是否显示 关闭按钮
            var _this = item;
            _this.get = function (attr) {
                return _this[attr];
            };
            var xtype = _this.get("xtype");
            var caption = _this.get("caption");
            var builder = _this.get("defaultBuilder");
            var url = _this.get("url");
            var name = _this.get("name");
            var hidden = _this.get("hidden") ? "hidden" : "";
            var placeholder = _this.get("placeholder") ? _this.get("placeholder") : "";
            var checkType = _this.get("checkType");
            var checkSize = _this.get("checkSize");
            var dataSize = _this.get("dataSize");
            var checkExp = _this.get("checkExp");
            //var allOption = _this.get("allOption") !== undefined ? _this.get("allOption") : true; // 是否显示 "全部"  按钮,  仅在 buttonlist使用
            var format = _this.get("format") ? _this.get("format") : 'yyyy-MM-dd';
            var controlHtml = $(' <div class="bh-advancedQuery-form-row bh-advancedQuery-h-28">' +
                '<div class="bh-advancedQuery-groupName">' + caption + '：</div>' +
                '<div class="bh-advancedQuery-groupList bh-label-radio-group">' +
                '</div>' +
                '</div>');

            if (showClose) {
                controlHtml.append('<a class="bh-bh-advancedQuery-group-dismiss" href="javascript:void(0)" bh-advanced-query-role="conditionDismiss"> ' +
                    '<i class="icon-close iconfont"></i>' +
                    '</a>');
            }
            var inputHtml = '';
            switch (xtype) {

                case "tree":
                case "multi-tree":
                    inputHtml += '<div xtype="{{xtype}}" data-name="{{name}}" data-builder="{{builder}}" data-caption="{{caption}}" data-url="{{url}}" {{hidden}} style="max-width: 300px;"></div>';
                    break;
                case "date-local":
                case "date-range":
                    inputHtml += '<div xtype="{{xtype}}" data-builder="{{builder}}" data-caption="{{caption}}" data-name="{{name}}" data-format="{{format}}" {{hidden}} style="max-width: 300px;"></div>';
                    break;
                case "date-ym":
                    inputHtml += '<div xtype="{{xtype}}" data-builder="{{builder}}" data-caption="{{caption}}" data-name="{{name}}" data-format="yyyy-MM" {{hidden}}></div>';
                    break;
                case "date-full":
                    inputHtml += '<div xtype="{{xtype}}" data-builder="{{builder}}" data-caption="{{caption}}" data-name="{{name}}" data-format="yyyy-MM-dd HH:mm" {{hidden}}></div>';
                    break;
                case "switcher":
                    inputHtml += '<div xtype="{{xtype}}"  data-builder="{{builder}}" data-caption="{{caption}}" data-name="{{name}}" {{hidden}}></div>';
                    break;
                case "radiolist":
                    inputHtml += '<div xtype="{{xtype}}" data-name="{{name}}" class="bh-radio" data-url="{{url}}" data-builder="{{builder}}" data-caption="{{caption}}" {{hidden}}></div>';
                    break;
                case "checkboxlist":
                    inputHtml += '<div xtype="{{xtype}}" data-name="{{name}}" class="bh-checkbox" data-url="{{url}}" data-builder="{{builder}}" data-caption="{{caption}}" {{hidden}}></div>';
                    break;
                case "buttonlist":
                case "multi-buttonlist":
                    inputHtml += '<div xtype="{{xtype}}" data-name="{{name}}" data-url="{{url}}" data-builder="{{builder}}" data-alloption={{allOption}} data-caption="{{caption}}" {{hidden}} ></div>';
                    break;
                case "select":
                case "multi-select":
                case "multi-select2":
                    inputHtml += '<div xtype="{{xtype}}" data-name="{{name}}" data-url="{{url}}" data-builder="{{builder}}" data-alloption={{allOption}} data-caption="{{caption}}" {{hidden}} style="max-width: 300px;"></div>';
                    break;
                case 'number':
                case 'number-range':
                    inputHtml += '<div xtype="{{xtype}}" data-name="{{name}}" data-url="{{url}}" data-builder="{{builder}}" data-caption="{{caption}}" {{hidden}} style="max-width: 300px;"></div>';
                    break;
                default:
                    inputHtml += '<input class="bh-form-control" data-name="{{name}}" name="{{name}}" data-builder="{{builder}}" data-caption="{{caption}}" xtype="text" type="text" {{hidden}} />';
                    break;
            }
            inputHtml = inputHtml.replace(/\{\{xtype\}\}/g, xtype)
                .replace(/\{\{name\}\}/g, name)
                .replace(/\{\{builder\}\}/g, builder)
                .replace(/\{\{caption\}\}/g, caption)
                .replace(/\{\{url\}\}/g, url)
                .replace(/\{\{hidden\}\}/g, (hidden ? 'style="display:none;"' : ''))
                .replace(/\{\{allOption\}\}/g, options.allowAllOption)


            $('.bh-advancedQuery-groupList', controlHtml).html(inputHtml);
            return controlHtml;
        };

        // 生成搜索条件
        _getSearchCondition = function (options, name) {
            var conditionResult = [];
            var easyArray = options.$advanced.data('easyarray');
            var modalarray = options.$advanced.data('modalarray');
            var orCondition = [];
            if (options.searchModel == 'easy') {
                var searchKey = $('.bh-advancedQuery-quick-search-wrap input', options.$advanced).val();
                // 简单搜索
                if ($.trim(searchKey) != "") {
                    if (name) {
                        //简单搜索的下拉框搜索
                        var searchItem = _findModel(name, easyArray);
                        conditionResult.push({
                            "caption": searchItem.caption,
                            "name": searchItem.name,
                            "value": searchKey,
                            "builder": searchItem.defaultBuilder || "include",
                            "linkOpt": "AND"
                        });
                    } else {
                        for (var i = 0; i < easyArray.length; i++) {
                            orCondition.push({
                                "caption": easyArray[i].caption,
                                "name": easyArray[i].name,
                                "value": searchKey,
                                "builder": easyArray[i].defaultBuilder || "include",
                                "linkOpt": "OR"
                            });
                        }
                        conditionResult.push(orCondition);
                    }
                }
                conditionResult = conditionResult.concat(_getConditionFromForm($('[bh-advanced-query-role=quickSearchForm]', options.$advanced), options));
            } else if (options.searchModel == 'advanced') {
                var block = $('.bh-rules-block', options.$advanced);
                $('.bh-rules-row', block).each(function () {
                    var rowData = [];
                    var tags = $('.bh-tag', $(this));
                    if (tags.length) {
                        tags.each(function () {
                            var tagData = $(this).data('data');
                            tagData.linkOpt = 'and';
                            rowData.push(tagData);
                        });
                        rowData[0].linkOpt = 'or';
                        conditionResult.push(rowData);
                    }
                });

            }
            return JSON.stringify(conditionResult);
        };

        _getConditionFromForm = function (form, options) {
            var model = options.$advanced.data('modalarray');
            var conditionArray = [];
            var formElement = $('[xtype]', form);
            for (var i = 0; i < formElement.length; i++) {
                var conditionItem = {};

                switch ($(formElement[i]).attr('xtype')) {
                    case 'radiolist' :
                        conditionItem.value = $('input[type=radio]:checked', formElement[i]).map(function () {
                            return $(this).val();
                        }).get().join(',');
                        break;
                    case 'checkboxlist' :
                        conditionItem.value = $('input[type=checkbox]:checked', formElement[i]).map(function () {
                            return $(this).val();
                        }).get().join(',');
                        break;
                    case 'tree' :
                        conditionItem.value = $(formElement[i]).emapDropdownTree('getValue');
                        break;
                    case 'buttonlist' :
                        conditionItem.value = $('.bh-label-radio.bh-active', formElement[i]).data('id');
                        break;
                    default :
                        conditionItem.value = $(formElement[i]).val();
                        break;
                }
                if (conditionItem.value == 'ALL' || $.trim(conditionItem.value) == '') {
                    continue;
                }
                conditionItem.name = $(formElement[i]).data('name');
                conditionItem.caption = $(formElement[i]).data('caption');
                conditionItem.builder = $(formElement[i]).data('builder');
                conditionItem.linkOpt = 'AND';
                conditionArray.push(conditionItem);
            }
            return conditionArray;
        };

        _findModel = function (name, modelArray) {
            for (var i = 0; i < modelArray.length; i++) {
                if (modelArray[i].name == name) {
                    return modelArray[i];
                }
            }
        };

        // 初始化构造器编辑框
        _initConstructorEditor = function (options, ele) {
            // 字段名称下拉
            var modalOptions = options.$advanced.data('modalarray');
            // builder下拉
            var builderOptions = options.data.builderLists.cbl_String;

            var select1 = $('[rules-role=editorInput1]', ele)
                .jqxDropDownList({
                    placeHolder: "选择查询项目...",
                    width: 200,
                    source: modalOptions,
                    displayMember: "caption",
                    filterable: true,
                    searchMode: "containsignorecase",
                    filterPlaceHolder: "请查找",
                    valueMember: "name"
                })

            var select2 = $('[rules-role=editorInput2]', ele)
                .jqxDropDownList({
                    placeHolder: "选择条件...",
                    width: 100,
                    source: builderOptions,
                    filterable: true,
                    searchMode: "containsignorecase",
                    displayMember: "caption",
                    filterPlaceHolder: "请查找",
                    valueMember: "name"
                })
            var select3 = undefined;


            if (_defaultValues[0]) { //select1 有 值，则
                select1.val(_defaultValues[0]);

                var input3Wrap = $('.bh-rules-input-wrap3', ele);
                var modalItem = options.data.controls.filter(function (item) {
                    return item.name == _defaultValues[0];
                })[0];


                // 条件选择下拉框的联动
                select2.jqxDropDownList({source: options.data.builderLists[modalItem.builderList]})
                select2.val(_defaultValues[1])

                // 搜索value 的控件联动
                input3Wrap.html(_renderInput3Place(modalItem)).emapFormInputInit({
                    defaultOptions: {
                        tree: {
                            unblind: "/"
                        }
                    }
                });
                select3 = $('[xtype]', input3Wrap)
                select3.attr('rules-role', 'editorInput3');
                var fieldVal = {}
                var name = select3.data('name')
                fieldVal[name + '_DISPLAY'] = _defaultValues[3]
                fieldVal[name] = _defaultValues[2]
                WIS_EMAP_INPUT.setValue(select3, name, select3.attr('xtype'), fieldVal)
            }

            _bindEditorEvent(options, ele);

            _defaultValues = [] //reset
        };

        // 弹出气泡弹窗
        _popOver = function (options, title, ele, cb) {
            /************************
             * jqxPopover 深坑
             *
             */
            var pop = $('<div style="display: none" id="bhRulesPopover">' + options.editorHtml + '</div>');
            $('body').append(pop);

            // 计算popover 水平位置
            var docWidth = document.documentElement.clientWidth;
            var selectLeft = $(ele).offset().left;
            var popWidth = 728; // popover的宽度为 728 ,我量出来的
            var offsetLeft = 0;
            if (selectLeft - popWidth / 2 < 24) {
                offsetLeft = Math.abs(selectLeft - popWidth / 2 - 24)
            }
            if (selectLeft + popWidth / 2 > docWidth - 24) {
                offsetLeft = docWidth - 100 - selectLeft - popWidth / 2;
            }

            // 计算垂直位置
            var eleTop = $(ele).offset().top;
            var position = 'bottom';
            if (window.scrollY + document.documentElement.clientHeight - eleTop < 200) {
                position = 'top';
            }

            pop.jqxPopover({
                offset: {left: offsetLeft, top: 0},
                arrowOffsetValue: -offsetLeft,
                showArrow: false,
                autoClose: true,
                isModal: true,
                title: title,
                selector: ele,
                position: position
            });
            // 实例化editor
            _initConstructorEditor(options, $('#bhRulesPopover'));
            setTimeout(function () {  // 自动打开
                pop.jqxPopover('open')
                var popWindow = $('#bhRulesPopover');
                popWindow.on('close', function () {  // 气泡弹窗关闭时 自动销毁
                        // 取消 对下拉框事件冒泡的阻止
                        $(document).off('click.bhRules.stop')
                        // 销毁editor内的下拉框
                        $('div[rules-role=editorInput1],div[rules-role=editorInput2],div[rules-role=editorInput3]', popWindow).jqxDropDownList('destroy');
                        // 销毁popover
                        $(this).jqxPopover('destroy');
                    })
                    .on('click', '[rules-role=editorCloseBtn]', function () {
                        // 关闭气泡弹窗事件
                        popWindow.jqxPopover('close')
                    })
                    .on('click', '[rules-role=editorAddBtn]', function (e) {
                        if (cb(e, popWindow) !== false) {
                            popWindow.jqxPopover('close');
                        }
                    });

                // 阻止下拉框的事件冒泡  防止点击下拉后 poppver 自动关闭
                $(document).on('click.bhRules.stop', '.jqx-listbox, .jqx-calendar, .jqx-dropdownbutton-popup', function (e) {
                    e.stopPropagation();
                })

            }, 0)
        };

        _getConditionFromEditor = function (editor) {
            if (_validateEditor(editor)) {
                var select1Val = $('[rules-role=editorInput1]', editor).jqxDropDownList('getSelectedItem');
                var select2Val = $('[rules-role=editorInput2]', editor).jqxDropDownList('getSelectedItem');
                var select3 = $('.bh-rules-input-wrap3 [xtype]', editor);
                var select3Val = select3.val();
                var conData = {
                    caption: select1Val.label,
                    name: select1Val.value,
                    builder: select2Val.value,
                    builder_display: select2Val.label,
                    value: select3Val
                };
                if (select3.attr('xtype') == 'select') {
                    conData.value_display = select3.jqxDropDownList('getSelectedItem').label;
                } else if (select3.attr('xtype') == 'multi-select') {

                    conData.value_display = select3.jqxComboBox('getSelectedItems').map(function (val) {
                        return val.label;
                    }).join(',');
                    conData.value = select3.jqxComboBox('getSelectedItems').map(function (val) {
                        return val.value;
                    }).join(',');
                } else if (select3.attr('xtype') == 'multi-select2') {
                    conData.value_display = select3.jqxDropDownList('getCheckedItems').map(function (val) {
                        return val.label;
                    }).join(',');
                    conData.value = select3.jqxDropDownList('getCheckedItems').map(function (val) {
                        return val.value;
                    }).join(',');
                } else if (select3.attr('xtype') == 'tree' || select3.attr('xtype') == 'multi-tree') {
                    conData.value_display = select3.emapDropdownTree('getText');
                    conData.value = select3.emapDropdownTree('getValue');
                }
                return conData;
            }
            return false;
        };

        _validateEditor = function (editor) {
            var select1 = $('[rules-role=editorInput1]', editor);
            var select2 = $('[rules-role=editorInput2]', editor);
            var input3Wrap = $('.bh-rules-input-wrap3', editor);
            if (!select1.val()) {
                select1.addClass('bh-error');
                return false;
            }
            if (!select2.val()) {
                select2.addClass('bh-error');
                return false;
            }
            if (!$('[xtype]', input3Wrap).val()) {
                $('[xtype]', input3Wrap).addClass('bh-error');
                return false;
            }
            return true;
        };

        // editor内下拉框联动事件绑定
        _bindEditorEvent = function (options, editor) {
            var select1 = $('[rules-role=editorInput1]', editor);
            var select2 = $('[rules-role=editorInput2]', editor);
            var select3 = undefined;
            var input3Wrap = $('.bh-rules-input-wrap3', editor);
            var select3 = $('[xtype]', input3Wrap);
            select1.on('select', function (e) {
                var name = e.args.item.value;
                var modalItem = options.data.controls.filter(function (item) {
                    return item.name == name;
                })[0];

                if (select1.val()) {
                    select1.removeClass('bh-error');
                }

                // 条件选择下拉框的联动
                select2.jqxDropDownList({source: options.data.builderLists[modalItem.builderList]})
                select2.jqxDropDownList('selectIndex', 0);
                // 搜索value 的控件联动
                input3Wrap.html(_renderInput3Place(modalItem)).emapFormInputInit({
                    defaultOptions: {
                        tree: {
                            unblind: "/",
                            search: true
                        }
                    }
                });
                $('[xtype]', input3Wrap).attr('rules-role', 'editorInput3');

            });
            select2.on('select', function () {
                if (select2.val()) {
                    select2.removeClass('bh-error');
                }
                var itemModel = options.data.controls.filter(function (val) {
                    return val.name == select1.val();
                })[0];
                // 多值相等时,右侧的下拉框变为多选下拉
                if ($.inArray(itemModel.xtype, ['select', 'radiolist', 'checkboxlist']) > -1 && $.inArray($(this).val(), ['m_value_include', 'm_value_equal', 'm_value_not_include', 'm_value_not_equal']) > -1) {
                    itemModel = JSON.parse(JSON.stringify(itemModel));
                    itemModel.get = function (field) {
                        if (this["search." + field] !== undefined)
                            return this["search." + field];
                        else
                            return this[field];
                    };
                    itemModel.xtype = 'multi-select2';
                    input3Wrap.empty();
                    input3Wrap.html(_renderInput3Place(itemModel)).emapFormInputInit({
                        defaultOptions: {
                            tree: {
                                unblind: "/",
                                search: true
                            }
                        }
                    });
                    // $('div[rules-role=editorInput3]', popWindow)
                } else if ($('[xtype]', input3Wrap).attr('xtype') == 'multi-select2') {
                    //  多选改变为单选
                    input3Wrap.empty();
                    input3Wrap.html(_renderInput3Place(itemModel)).emapFormInputInit({
                        defaultOptions: {
                            tree: {
                                unblind: "/",
                                search: true
                            }
                        }
                    });

                } else if ($.inArray($(this).val(), ['m_value_include', 'm_value_equal', 'm_value_not_include', 'm_value_not_equal']) > -1 && itemModel.xtype == 'tree') {
                    // 树变为多选
                    itemModel = JSON.parse(JSON.stringify(itemModel));
                    itemModel.get = function (field) {
                        if (this["search." + field] !== undefined)
                            return this["search." + field];
                        else
                            return this[field];
                    };
                    itemModel.xtype = 'multi-tree';
                    input3Wrap.empty();
                    input3Wrap.html(_renderInput3Place(itemModel)).emapFormInputInit({
                        defaultOptions: {
                            "multi-tree": {
                                unblind: "/",
                                search: true
                            }
                        }
                    });
                } else if ($('[xtype]', input3Wrap).attr('xtype') == 'multi-tree') {
                    // 多选树变为单选
                    input3Wrap.empty();
                    input3Wrap.html(_renderInput3Place(itemModel)).emapFormInputInit({
                        defaultOptions: {
                            tree: {
                                unblind: "/",
                                search: true
                            }
                        }
                    });
                }

            });

            input3Wrap.on('select, input', '[xtype]', function () {

                if ($(this).val()) {
                    $(this).removeClass('bh-error');
                }
            });

        };

        _renderInput3Place = function (modalItem) {
            var attr = WIS_EMAP_SERV.getAttr(modalItem);
            var controlHtml = "";
            attr.xtype = attr.xtype ? attr.xtype : 'text';
            if (attr.xtype == 'checkboxlist' || attr.xtype == 'radiolist') {
                attr.xtype = 'select';
            }


            switch (attr.xtype) {
                case undefined:
                case "text" :
                    attr.xtype = "text";
                    controlHtml = '<input class="bh-form-control" data-type="{{dataType}}" data-name="{{name}}" name="{{name}}" xtype="{{xtype}}" type="{{xtype}}" {{checkType}}  {{dataSize}} {{checkSize}} {{checkExp}} ' + (attr.inputReadonly ? 'readOnly' : '') + '  />';
                    break;
                case "textarea" :
                    controlHtml = '<textarea xtype="{{xtype}}" data-type="{{dataType}}" class="bh-form-control" rows="3" data-name="{{name}}" {{checkType}} {{dataSize}} {{checkSize}} {{checkExp}} ' + (attr.inputReadonly ? 'readOnly' : '') + ' ></textarea>';
                    break;
                case "selecttable" :
                case "select" :
                case "tree" :
                case "multi-tree" :
                case "date-local" :
                case "date-ym" :
                case "date-full" :
                case "switcher" :
                case "uploadfile":
                case "uploadphoto":
                case "uploadsingleimage":
                case "uploadmuiltimage":
                case "buttonlist":
                case "multi-select" :
                case "multi-select2" :
                case "div":
                    controlHtml = '<div xtype="{{xtype}}" data-type="{{dataType}}" data-name="{{name}}" {{url}} {{format}} {{checkType}} {{JSONParam}} {{checkSize}} data-disabled={{inputReadonly}}></div>';
                    break;
                case "radiolist" :
                    controlHtml = '<div xtype="{{xtype}}" data-type="{{dataType}}" class="bh-radio jqx-radio-group" data-name="{{name}}" {{url}} {{checkSize}} data-disabled={{inputReadonly}}></div>';
                    break;
                case "checkboxlist" :
                    controlHtml = '<div xtype="{{xtype}}" data-type="{{dataType}}" class="bh-checkbox" data-name="{{name}}" {{checkType}} {{url}} {{checkSize}} data-disabled={{inputReadonly}}></div>';
                    break;
            }
            controlHtml = controlHtml.replace(/\{\{xtype\}\}/g, attr.xtype)
                .replace(/\{\{name\}\}/g, attr.name)
                .replace(/\{\{dataType\}\}/g, attr.dataType)
                .replace(/\{\{inputReadonly\}\}/g, attr.inputReadonly);
            controlHtml = controlHtml.replace(/\{\{url\}\}/g, attr.url ? ('data-url="' + attr.url + '"') : '');
            controlHtml = controlHtml.replace(/\{\{format\}\}/g, attr.format ? ('data-format="' + attr.format + '"') : '');
            controlHtml = controlHtml.replace(/\{\{JSONParam\}\}/g, attr.JSONParam ? ('data-jsonparam="' + encodeURI(JSON.stringify(attr.JSONParam)) + '"') : '');
            controlHtml = controlHtml.replace(/\{\{checkType\}\}/g, attr.checkType ? ('data-checktype="' + encodeURI(JSON.stringify(attr.checkType)) + '"') : '');
            controlHtml = controlHtml.replace(/\{\{dataSize\}\}/g, attr.dataSize ? ('data-size="' + attr.dataSize + '"') : '');
            controlHtml = controlHtml.replace(/\{\{checkSize\}\}/g, attr.checkSize ? ('data-checksize="' + attr.checkSize + '"') : '');
            controlHtml = controlHtml.replace(/\{\{checkExp\}\}/g, attr.checkExp ? ('data-checkexp=' + encodeURI(attr.checkExp)) : '');
            controlHtml = $(controlHtml);
            if (attr.JSONParam) {
                controlHtml.data('jsonparam', attr.JSONParam);
            }
            return controlHtml;
        };

        // 渲染一个tag
        _renderOneTag = function (data) {
            var tag = $('<label class="bh-tag"><span class="bh-tag__txt" rules-role="tagTxt"></span><a rules-role="closeTag" href="javascript:void(0)"><i class="iconfont icon-close"></i></a></label>');
            tag.data('data', data);
            $('span', tag).text('"' + data.caption + '" ' + data.builder_display + ' "' + (data.value_display ? data.value_display : data.value) + '"');
            return tag;
        };

        // 添加 且 条件
        _addAndFilter = function (options, data, row) {
            var andBtn = $('[rules-role=addAndBtn]', row);
            andBtn.before(options.andSpan).before(_renderOneTag(data));
            $.bhPaperPileDialog.resetPageFooter();
            $.bhPaperPileDialog.resetDialogFooter();
        };

        // 添加或条件
        _addOrFilter = function (options, data) {
            var row = $('<div class="bh-rules-row">' +
                '<div class="bh-rules-row-indent">或</div>' +
                '<a rules-role="addAndBtn" href="javascript:void(0)">+ 新增[且]条件</a>' +
                '</div>');
            $('[rules-role=addAndBtn]', row).before(_renderOneTag(data));
            $('[rules-role=addOrRow]', options.$advanced).before(row);
            _resetRowIndent(options);
        };

        // 重置 row indent
        _resetRowIndent = function (options) {
            var $advanced = options.$advanced;
            var rows = $('.bh-rules-row', $advanced);
            rows.each(function (i) {
                if (i > 0) {
                    $(this).css('margin-left', (i - 1) * 20)
                }
            })
            $.bhPaperPileDialog.resetPageFooter();
            $.bhPaperPileDialog.resetDialogFooter();
        };


        options.editorHtml = '<div class="bh-rules-editor bh-clearfix bh-mb-16">' +
            '<div class="bh-rules-input-wrap"><div rules-role="editorInput1"></div></div>' +
            '<div class="bh-rules-input-wrap"><div rules-role="editorInput2"></div></div>' +
            '<div class="bh-rules-input-wrap bh-rules-input-wrap3"><input rules-role="editorInput3" class="bh-form-control" type="text" placeholder="多值请用逗号隔开"></div>' +
            '<div class="bh-rules-input-wrap bh-rules-input-wrap4">' +
            '<a class="bh-btn bh-btn-small bh-btn-primary" rules-role="editorAddBtn"><i class="iconfont icon-check" style="margin-right: 0;"></i></a>' +
            '<a class="bh-btn bh-btn-small bh-btn-default" rules-role="editorCloseBtn"><i class="iconfont icon-close" style="margin-right: 0;"></i></a>' +
            '</div>' +
            '</div>';

        options.andSpan = '<span class="bh-rules-and-text">且</span>';
        options.orSpan = '<span class="bh-rules-or-text">或</span>';
        options.tag = '<label class="bh-tag"><span class="bh-tag__txt" rules-role="tagTxt"></span><a rules-role="closeTag" href="javascript:void(0)"><i class="iconfont icon-close"></i></a></label>';

        element.css({
            "position": "relative",
            "z-index": 358
        }).html('<div class="bh-advancedQuery bh-mb-16" bh-advanced-query-role="advancedQuery">' +
            '<div class="bh-advancedQuery-dropDown ">' +
            '<div class="" style="display: table-cell">' +
            '<div class="bh-advancedQuery-form" bh-advanced-query-role="advanceSearchForm" >' +

            '<div class="bh-rules-container">' +
            '<div class="bh-rules-header bh-clearfix">' +
            '<h4>' +
            '<i class="iconfont icon-search"></i>条件构造器' +
            '</h4>' +
            '<p class="bh-rules-program">' +
            '<label>构造方案: </label>' +
            '<a bh-schema-role="more" href="javascript:void(0)">更多 ></a>' +
            '</p>' +
            '</div>' +


            '<div class="bh-rules-body">' +
            options.editorHtml +

            '<div class="bh-rules-block">' +


            '<div class="bh-rules-row" rules-role="addOrRow">' +
            '<div class="bh-rules-row-indent"></div>' +
            '<a rules-role="addOrBtn" href="javascript:void(0)">+ 新增[或]条件</a>' +

            '</div>' +

            '</div>' +
            '</div>' +

            '</div>' +


            '<div class="bh-advancedQuery-form-row bh-advancedQuery-form-btn-row bh-advancedQuery-h-28" bh-advanced-query-role="dropDownBtnWrap"> ' +
            '<div class="bh-advancedQuery-groupList">' +
            '<a class="bh-btn bh-btn-primary" bh-advanced-query-role="advancedSearchBtn">执行条件搜索</a>' +
            '<div class="bh-schema-btn-wrap">' +
            '<div class="bh-schema-edit-div">' +
            '<input type="text" placeholder="请输入方案名称" maxlength="20" class="bh-form-control bh-schema-name-input" />' +
            '<a  class="bh-btn bh-btn-success bh-btn-small"  bh-advanced-query-role="saveSchemaConfirm">保存</a>' +
            '<a class="bh-btn bh-btn-default bh-btn-small" bh-advanced-query-role="saveSchemaCancel">取消</a>' +
            '<span class="bh-checkbox" style="display:inline-block;vertical-align:middle;margin-left:8px;"><label>' +
            '<input type="checkbox" bh-schema-role="fixCheckbox"><i class="bh-choice-helper"></i> 固定至搜索栏' +
            '</label></span>' +
            '</div>' +
            '<a class="bh-btn bh-btn-default bh-btn-small " bh-advanced-query-role="saveSchema" href="javascript:void(0)">保存为方案</a>' +
            '</div>' +
            '<a class="bh-mh-4" bh-advanced-query-role="advancedClose" href="javascript:void(0)">[关闭条件构造器]</a>' +
            '</div>' +
            '</div>' +
            '</div>' +

            '</div>' +
            '</div>' +
            '<div class="bh-advancedQuery-quick">' +
            '<div class="bh-advancedQuery-inputGroup bh-clearfix">' +
            '<div class="bh-advancedQuery-quick-search-wrap" >' +
            '<input type="text" class="bh-form-control"/>' +
            '<i class="iconfont icon-search" style="position: absolute;left: 6px;top: 6px;"></i>' +
            '</div>' +
            '<a class="bh-btn bh-btn bh-btn-primary bh-btn-small" bh-advanced-query-role="easySearchBtn">搜索</a>' +
            '<a href="javascript:void(0);" class="bh-mh-8" bh-advanced-query-role="advancedOpen">[条件构造器]</a>' +
            '</div>' +
            '<div class="bh-advancedQuery-form bh-mt-8" bh-advanced-query-role="quickSearchForm">' +
            '</div>' +
            '</div>' +
            '</div>');

        options.$advanced = $('div[bh-advanced-query-role=advancedQuery]', element).css({'overflow': 'hidden'});
        options.guid = guid;
        if (options.searchModel == 'advanced') {
            options.$advanced.addClass('bh-active');
        }

        $('body').append('<div class="bh-advancedQuery-quick-select" bh-advanced-query-role="advancedEasySelect" data-guid="' + guid + '" ></div>');
        if (options.formType) {
            element.addClass('bu-rules-form-type');
        }


        var advanceInputPlaceHolder = '';
        _eventBind(options);
        $(modalData).each(function (i) {
            //移除 hidden 项
            var index = modalData.indexOf(this);
            if (this.get('hidden')) {
                modalData.splice(index, 1);
                return true;
            }

            if (!this.xtype || this.xtype == 'text') {
                advanceInputPlaceHolder += this.caption + '/'; // 高级搜索关键词输入框placeholder
            } else {
                options._initCount++;
            }

            if (this.quickSearch) {
                if (!this.xtype || this.xtype == 'text') {
                    easyArray.push(this);
                } else {
                    quickArray.push(this);
                }
            }
        });
        // 高级搜索关键词字段添加placeholder
        $('[bh-advanced-query-role=advancedInput]', element).attr('placeholder', advanceInputPlaceHolder.substr(0, advanceInputPlaceHolder.length - 1));

        options.$advanced.data('modalarray', modalData);
        options.$advanced.data('easyarray', easyArray);
        options.$advanced.data('quickarray', quickArray);

        if (options.searchModel == 'easy') {
            options._initCount = quickArray.length;
        }
        if (easyArray.length == 0 && quickArray.length == 0) {
            // console.warn("没有配置快速搜索字段,所以高级搜索控件无法展示!");
        }

        // 简单搜索 条件渲染
        _renderEasySearch(easyArray, options);

        // 快速搜索条件渲染
        quickArray = JSON.parse(JSON.stringify(quickArray));
        $('[bh-advanced-query-role=quickSearchForm]', options.$advanced).html(_renderQuickSearch(quickArray))
            .emapFormInputInit({
                root: '',
                defaultOptions: {
                    tree: {
                        unblind: "/"
                    }
                }
            });

        // 初始化构造器默认的 editor
        _initConstructorEditor(options, $('.bh-rules-editor', element));

        // 初始化 方案 模块
        if (options.schema) {
            $.fn.emapSchema && _initSchema(element, options);
        } else {
            $('.bh-rules-program, .bh-schema-btn-wrap', options.$advanced).hide();

        }
    };


    $.fn.emapRulesConstructor = function (options, params) {
        var instance;
        instance = this.data('plugin');
        if (!instance) {
            return this.each(function () {
                return $(this).data('plugin', new Plugin(this, options));
            });
        }
        if (options === true) return instance;
        if ($.type(options) === 'string') return instance[options](params);
        return this;
    };

    $.fn.emapRulesConstructor.defaults = {
        allowAllOption: true, // 是否显示[全部]选项
        defaultItem: [],
        searchModel: 'easy',
        formType: false // 表单中使用的模式, 开启后,隐藏简单搜索的文本框与搜索按钮,隐藏高级模式的按钮
    };

    // console.log('here')
    // HTMLElement.prototype.appendChild

}).call(this);

(function () {
    var Plugin, _eventBind, _closeEdit, _getPageFlag;

    Plugin = (function () {
        function Plugin(element, options) {
            this.options = $.extend({}, $.fn.emapSchema.defaults, options);
            this.$element = $(element);
            _init(this.$element, this.options);
        }

        Plugin.prototype.destroy = function () {
            this.options = null;
            $(this.$element).data('emapSchema', false).empty();
        };
        Plugin.prototype.saveSchema = function () {
            var result = $.Deferred();
            var name = arguments[0][0];
            var conditionData = arguments[0][1];
            var fixed = arguments[0][2] ? 1 : 0;
            var options = this.options;
            var element = this.$element;
            if (!name){
                $.bhTip && $.bhTip({
                    content: '请输入方案名',
                    state: 'warning',
                    iconClass: 'icon-erroroutline'
                });
                result.reject('方案名为空');
                return result.promise();
            }
            doRequest(options.contextPath + '/sys/emapcomponent/schema/save.do',{
                condition: conditionData,
                schemaName: name,
                schemaType: options.schemaType,
                pageFlag: options.pageFlag,
                fixed: fixed
            }).done(function(res){
                if (res.success) {
                    $.bhTip && $.bhTip({
                        content: '保存成功',
                        state: 'success',
                        iconClass: 'icon-check'
                    });


                }
                result.resolve(res);
            }).fail(function(res){
                $.bhTip && $.bhTip({
                    content: '保存失败',
                    state: 'danger',
                    iconClass: 'icon-close'
                });
                result.reject(res);
            });
            return result.promise();
        };

        /**
         * @method getSchemaList
         * @description  获取方案列表
         * @returns {*}
         */
        Plugin.prototype.getSchemaList = function () {
            var options = this.options;
            var pageFlag = this.options.pageFlag;
            var schemaType = this.options.schemaType;
            var result;
            $.ajax({
                type: 'post',
                url: options.contextPath + '/sys/emapcomponent/schema/getList.do',
                async: false,
                data: {
                    schemaType : schemaType,
                    pageFlag : pageFlag
                }
            }).done(function(res){
                if (res.success) {
                    result = res.data;
                }
            });
            return result;
        };


        // 删除方案
        Plugin.prototype.deleteSchema = function (name) {
            var options = this.options;
            var result = false;
            $.ajax({
                type: 'post',
                url: options.contextPath + '/sys/emapcomponent/schema/deleteSingle.do',
                async: false,
                data: {
                    schemaName : name,
                    schemaType : options.schemaType,
                    pageFlag : options.pageFlag
                }
            }).done(function(res){
                if (res.success) {
                    $.bhTip && $.bhTip({
                        content: '删除成功',
                        state: 'success',
                        iconClass: 'icon-check'
                    });
                    result = true;
                }
            });
            return result;
        };
        return Plugin;
    })();


    //生成dom
    function _init(element, options) {
        // if (options.pageFlag && options.pageFlag != null) {
        //     // 已有方案
        //     options.newFlag = false;
        // } else {
        //     // 新上传
        //     options.pageFlag = new Date().getTime() + "" + parseInt(Math.random() * 100).toString();
        //     options.newToken = true;
        // }
        options.contextPath = options.contextPath || WIS_EMAP_SERV.getContextPath();
        _getPageFlag(options);
        _eventBind(element, options);

    }

    _getPageFlag = function (options) {
        var pageName = location.hash.replace(/\/|#/g, '');
        var modelName = options.data.modelName || options.customModelName;
        options.pageFlag = pageName + ',' + modelName;
    };

    _eventBind = function (element, options) {
    };

    _closeEdit = function (element, options) {
        var wrap = $('.bh-schema-btn-wrap', element);
        $('.bh-schema-name-input', wrap).val();
        wrap.removeClass('active');
    };


    $.fn.emapSchema = function (options, params) {
        var instance;
        instance = $(this).data('emapSchema');
        if (!instance) {
            return this.each(function () {
                if (options == 'destroy') {
                    return this;
                }
                return $(this).data('emapSchema', new Plugin(this, options));
            });
        }
        if (options === true) return instance;
        if ($.type(options) === 'string') return instance[options](params);
        return this;
    };

    $.fn.emapSchema.defaults = {

    };

    function doRequest (url, param) {
        var result = $.Deferred();
        $.ajax({
            type: 'post',
            data: param,
            url: url,
            dataType: 'json'
        })
       .done(function(res){
        result.resolve(res)
       }).fail(function(res){
           result.reject(res);
       });
        return result.promise();
    }

}).call(undefined);
;
(function(WIS_EMAP_SERV, undefined) {
    var fileTypeArray = ['7Z', 'AAC', 'ASP', 'AVI', 'BAT', 'BMP', 'CAD', 'CSS', 'DOC', 'DOCX', 'EXE', 'FLV', 'GIF', 'HTML', 'ISO', 'JAVA', 'JAR', 'JPEG', 'JPG', 'MOV', 'MP3', 'MP4', 'MPEG', 'PHP', 'PNG', 'PPT', 'PPTX', 'PSD', 'RAR', 'RMVB', 'SVG', 'SWF', 'BT', 'TXT', 'XLS', 'XLSX', 'ZIP']
    WIS_EMAP_SERV.getFileInfoByName = function(fileName) {
        var type = fileName.substring(fileName.lastIndexOf('.') + 1);
        type = type.toUpperCase();
        if (fileTypeArray.indexOf(type) > -1) {
            return {
                tag: type,
                text: type
            };
        } else {
            return {
                tag: 'unknown',
                text: '???'
            };
        }
    };

    // model 分组排序
    WIS_EMAP_SERV._sortModel = function(model) {
        var result = [];
        for (var i = 0; i < model.length; i++) {
            var groupItem = result.filter(function(val) {
                return val.groupName == model[i].groupName;
            });
            if (groupItem.length == 0) {
                result.push({
                    "groupName": model[i].groupName,
                    "items": [model[i]]
                });
            } else {
                groupItem[0].items.push(model[i]);
            }
        }
        return result;
    };

    /**
     * 获取emap pageMeta数据
     * @param  {String} pagePath 页面地址
     * @param  {Object} params 请求参数
     * @param  {Object} requestOption 请求配置
     * @return {Object}        pageMeta
     */
    WIS_EMAP_SERV.getPageMeta = function(pagePath, params, requestOption) {

        var params = $.extend({ "*json": "1" }, params);
        var pageMeta = BH_UTILS.doSyncAjax(WIS_EMAP_SERV.getAbsPath(pagePath), params, null, requestOption);
        window._EMAP_PageMeta = window._EMAP_PageMeta || {};
        window._EMAP_PageMeta[pagePath] = pageMeta;
        if (typeof pageMeta.loginURL != 'undefined') {
            window._EMAP_PageMeta = {};
        }
        return pageMeta;
    };

    /**
     * 获取emap模型
     * @param  {String} pagePath    页面地址
     * @param  {String} actionID  [description]
     * @param  {String} type      [description]
     * @param  {String} params    请求参数
     * @param  {String} requestOption 请求配置
     * @return {Object} params    [description]
     */
    WIS_EMAP_SERV.getModel = function(pagePath, actionID, type, params, requestOption) {
        // window.sessionStorage.setItem();
        // window._EMAP_PageMeta = window._EMAP_PageMeta || {};

        // var pageMeta = window._EMAP_PageMeta[pagePath];
        // if (pageMeta === undefined) {
        //     pageMeta = this.getPageMeta(pagePath);
        // }
        var pageMeta = this.getPageMeta(pagePath, params, requestOption);
        var model;

        if (type == "search") {
            var url = WIS_EMAP_SERV.getAbsPath(pagePath).replace('.do', '/' + actionID + '.do');
            pageMeta = BH_UTILS.doSyncAjax(url, $.extend({ "*searchMeta": "1" }, params), null, requestOption);
            model = pageMeta.searchMeta;

        } else {
            var getData = pageMeta.models.filter(function(val) {
                return val.name == actionID
            });
            model = getData[0];
        }
        WIS_EMAP_SERV.modelName = model.modelName;
        WIS_EMAP_SERV.appName = model.appName;
        WIS_EMAP_SERV.url = model.url;
        WIS_EMAP_SERV.name = model.name;

        return this.convertModel(model, type);
    };

    WIS_EMAP_SERV.convertModel = function(model, type) {

        if (model === undefined || model == null) {
            //getData = {code: 0,msg: "没有数据",models:[],datas:{}};
            return undefined;
        } else {

            if (type === undefined)
                return model.controls;
            else {
                model.controls.map(function(item) {
                    item.get = function(field) {
                        if (this[type + "." + field] !== undefined && this[type + "." + field] !== "")
                            return this[type + "." + field];
                        else
                            return this[field];
                    }
                });
                if (type == "search")
                    return model;
                else
                    return model.controls;
            }
        }
    };


    WIS_EMAP_SERV.getData = function(pagePath, actionID, queryKey) {
        window._EMAP_PageMeta = window._EMAP_PageMeta || {};
        var pageMeta = window._EMAP_PageMeta[pagePath];
        if (pageMeta === undefined)
            pageMeta = this.getPageMeta(pagePath);

        var model = pageMeta.models.filter(function(val) {
            return val.name == actionID
        });


        var modelPath = pagePath.substring(0, pagePath.indexOf("/")) + "/" + model[0].url;
        var getData = BH_UTILS.doSyncAjax(WIS_EMAP_SERV.getAbsPath(modelPath), queryKey);
        if (getData === undefined || getData == null) {
            getData = {
                code: 0,
                msg: "没有数据",
                datas: {}
            };
            return { rows: [] };
        } else {
            if (getData.result !== undefined && getData.result.datas !== undefined)
                getData = getData.result;
            return getData.datas[actionID];
        }
    };

    WIS_EMAP_SERV.getCode = function(url, id, name, pid, searchValue) {
        var params = {};
        if (id) params["id"] = id;
        if (name) params["name"] = name;
        if (pid) params["pid"] = pid;
        if (searchValue) params["searchValue"] = searchValue;
        var codeData = BH_UTILS.doSyncAjax(url, params);
        if (codeData === undefined || codeData == null) {
            return undefined;
        } else {
            return codeData.datas.code.rows;
        }
    };

    //name 传入的是string，则只返回一个参数的查询条件
    //name 传入的是array，结构是：[{name:"", value:""},{name:"", value:""}]，则返回多个参数的查询条件
    WIS_EMAP_SERV.buildCodeSearchParam = function(name, value) {
        if ($.isArray(name)) {
            var list_map = name;
            var result = [];
            for (var i = list_map.length - 1; i >= 0; i--) {
                result.push({ name: list_map[i].name, value: list_map[i].value, linkOpt: "and", builder: "equal" });
            };
            return {
                searchValue: JSON.stringify(result)
            };
        } else {
            return {
                searchValue: JSON.stringify([{ name: name, value: value, linkOpt: "and", builder: "equal" }])
            };
        }
    };

    WIS_EMAP_SERV.getContextPath = function() {
        var contextPath = "";
        var path = window.location.pathname;
        var end = path.indexOf('/sys/');

        return path.substring(0, end) || '/emap';
    };

    WIS_EMAP_SERV.getAppPath = function() {
        var path = window.location.pathname;
        var start = path.indexOf('/sys/') + '/sys/'.length;

        var tmpPath = path.substring(start, path.length);
        var app_path = tmpPath.substring(0, tmpPath.indexOf("/"));
        return WIS_EMAP_SERV.getContextPath() + "/sys/" + app_path;
    };

    /**
     * @method getAbsPath
     * @description 获取绝对路径
     * @param {String} page_path 传入的相对路径
     */
    WIS_EMAP_SERV.getAbsPath = function(page_path) {
        if (page_path === undefined) {
            console && console.warn('WIS_EMAP_SERV.getAbsPath 传参为空');
            return;
        }
        if (page_path.substring(0, 7) == "http://" || page_path.substring(0, 8) == "https://") {
            return page_path;
        }
        if (page_path.substring(0, 1) == '/') {
            page_path = page_path.substring(1, page_path.length);
        }
        // if(page_path.substring(0, '*default/'.length) == '*default/'){
        //     page_path = page_path;
        // }

        //访问的是页面.do
        var page_found = page_path.match(/module*(.*?)\//);
        if (page_found == null) {
            // //路由的绝对路径
            // if(page_path.substring(0, 8) != 'modules/'){
            //     page_path = 'modules/' + page_path;
            // }

            // if(page_path.substring(0, 16) == 'modules/modules/'){
            //     page_path = page_path.slice(8);
            // }
            // if(page_path.substring(0, 15) == 'modules/http://' || page_path.substring(0, 16) == 'modules/https://'){
            //     page_path = page_path.slice(8);
            // }
        }

        var absPath = WIS_EMAP_SERV.getAppPath() + "/" + page_path;
        return absPath;
    };

    /**
     * clone对象
     * @param obj
     * @returns {{}}
     * @private
     */
    WIS_EMAP_SERV.cloneObj = function(obj) {
        var clone = {};
        for (var k in obj) {
            if (typeof obj[k] == 'Object') {
                clone[k] = _cloneObj(obj[k]);
            } else {
                clone[k] = obj[k];
            }
        }
        return clone;
    };


    /*
     * 批量下载文件
     * @param  {object} options
     * {
     *      contextPath：地址 //字符串
     *      tokens: token串 //数组或者字符串，字符串中间以逗号隔开
     *      imageSize: 0(默认) 原始  1 中等  2 小型
     *       nameType: 命名类型  0 (默认)id   1 fielname
     *       zipName: 自定义下载的zip 文件名 (可选)
     * }
     */
    WIS_EMAP_SERV.batchDownloadFiles = function(options) {
        if (options) {
            $('body').append('<form method="post" class="bh-hide"></form>');
            var $form = $('form').last();
            var type = $.type(options.tokens);
            $form.attr('action', (options.contextPath || '..') + '/sys/emapcomponent/file/getFileBatchByTokenArray.do');
            if (options.imageSize) {
                $form.append('<input type="hidden" name="imageSize" value="' + options.imageSize + '"/>');
            }

            if (options.nameType) {
                $form.append('<input type="hidden" name="nameType" value="' + options.nameType + '"/>');
            }

            if (options.zipName !== undefined && options.zipName !== null) {
                $form.append('<input type="hidden" name="zipName" value="' + options.zipName + '"/>');
            }
            if (type === 'array') {
                $form.append('<input type="hidden" name="fileTokenArray" value="' + options.tokens.join(',') + '"/>');
                $form.submit();
            }
            if (type === 'string') {
                $form.append('<input type="hidden" name="fileTokenArray" value="' + options.tokens + '"/>');
                $form.submit();
            }

            $form.remove();
        }
    };

    WIS_EMAP_SERV._html2Escape = function(sHtml) {
        return sHtml.replace(/[<>&"]/g, function(c) {
            return { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c];
        });
    };

    /**
     * @method getAttr
     * @description 根据模型项获取配置信息
     * @param {Object} item - 模型JSON对象
     * @returns {Object} - 模型配置信息
     */
    WIS_EMAP_SERV.getAttr = function(item) {
        return {
            xtype: item.get("xtype"),
            dataType: item.get("dataType"),
            caption: item.get("caption"),
            col: item.get("col") ? item.get("col") : 1,
            url: item.get("url"),
            name: item.get("name"),
            hidden: item.get("hidden"),
            placeholder: item.get("placeholder") ? item.get("placeholder") : '',
            inputReadonly: item.get("readonly") ? true : false,
            required: item.get("required") ? "bh-required" : "",
            checkType: item.get("checkType") ? item.get("checkType") : false,
            checkSize: item.get("checkSize"),
            dataSize: item.get("dataSize") ? item.get("dataSize") : 99999,
            checkExp: item.get("checkExp"),
            JSONParam: item.get("JSONParam") ? item.get("JSONParam") : '{}',
            format: item.get("format"),
            defaultValue: item.get("defaultValue"),
            optionData: item.get("optionData")
        }
    };

    WIS_EMAP_SERV.inputSetValue = function(val, $element, options) {
        if (options.readonly) {
            options.formValue = val;
            $element.find('[xtype]').each(function() {
                var name = $(this).data('name');
                var _this = $(this);
                var nameDisplay = null;
                if (val[name] !== undefined && val[name] !== null) {
                    switch ($(this).attr('xtype')) {
                        case 'multi-select':
                        case 'select':
                            if (val[name + '_DISPLAY']) {
                                setItemVal(val[name + '_DISPLAY'], val[name]);
                            } else {
                                WIS_EMAP_SERV._getInputOptions(_this.data("url"), function(res) {
                                    _this.data('model', res);
                                    var valueArr = val[name].split(',');
                                    var nameArr = [];
                                    $(res).each(function() {
                                        if ($.inArray(this.id, valueArr) > -1) {
                                            nameArr.push(this.name);
                                        }
                                    });
                                    setItemVal(nameArr.join(','), val[name]);
                                });
                            }
                            break;
                        case 'multi-select2':

                            break;
                        case 'radiolist':
                            if (val[name + '_DISPLAY']) {
                                setItemVal(val[name + '_DISPLAY'], val[name]);
                            } else {
                                WIS_EMAP_SERV._getInputOptions(_this.data("url"), function(res) {
                                    _this.data('model', res);
                                    $(res).each(function() {
                                        if (this.id == val[name]) {
                                            nameDisplay = this.name;
                                            return false;
                                        }
                                    });
                                });
                            }
                            break;

                        case 'checkboxlist':
                            if (val[name + '_DISPLAY']) {
                                setItemVal(val[name + '_DISPLAY'], val[name]);
                            } else {
                                WIS_EMAP_SERV._getInputOptions(_this.data("url"), function(res) {
                                    _this.data('model', res);
                                    var valueArr = val[name].split(',');
                                    var nameArr = [];
                                    $(res).each(function() {
                                        if ($.inArray(this.id, valueArr) > -1) {
                                            nameArr.push(this.name);
                                        }
                                    });
                                    setItemVal(nameArr.join(','), val[name]);
                                });
                            }

                            break;
                        case 'tree':
                            if (val[name + '_DISPLAY']) {
                                setItemVal(val[name + '_DISPLAY'], val[name]);
                            } else {
                                WIS_EMAP_SERV._getInputOptions(_this.data("url"), function(res) {
                                    _this.data('model', res);
                                    var valueArr = val[name].split(',');
                                    var nameArr = [];
                                    $(res).each(function() {
                                        if ($.inArray(this.id, valueArr) > -1) {
                                            nameArr.push(this.name);
                                        }
                                    });
                                    setItemVal(nameArr.join(','), val[name]);
                                });
                            }
                            break;
                        case 'uploadfile':
                            $(this).emapFileDownload($.extend({}, {
                                contextPath: options.root,
                                token: val[name]
                            }, JSON.parse(decodeURI($(this).data('jsonparam')))));
                            break;
                        case 'uploadsingleimage':
                        case 'uploadmuiltimage':
                            $(this).emapFileDownload($.extend({}, {
                                model: 'image',
                                contextPath: options.root,
                                token: val[name]
                            }, JSON.parse(decodeURI($(this).data('jsonparam')))));
                            break;
                        case 'uploadphoto':
                            $(this).emapFilePhoto('destroy');
                            $(this).emapFilePhoto($.extend({}, {
                                token: val[name],
                                contextPath: options.root
                            }, JSON.parse(decodeURI($(this).data('jsonparam')))));
                            $('a', this).hide();
                            break;
                        case 'switcher':
                            val[name + 'DISPLAY'] = parseInt(val[name]) ? '是' : '否';
                            setItemVal(val[name + 'DISPLAY'], val[name]);
                            break;
                        default:
                            setItemVal(val[name]);
                    }
                }

                function setItemVal(val_dis, val) {
                    if (val_dis != null) {
                        _this.text(val_dis).attr('title', val_dis).data('value', val);
                    }
                }
            });
        } else {
            $element.find('[xtype]').each(function() {
                var name = $(this).data('name');
                var _this = $(this);
                var xtype = _this.attr('xtype');
                //qiyu 2016-1-2 清空表单时，传入字段值为空，需要重置该控件
                //qiyu 2016-3-17 清空表单请使用clear方法，以下这句话将被注释掉
                //if (val[name] == null) {val[name] = ""}

                // 为表格表单中的 只读字段赋值
                if (options.model == 't' && _this.hasClass('bh-form-static')) {
                    if (val[name] != null) {
                        if (val[name + '_DISPLAY'] !== undefined && val[name + '_DISPLAY'] !== null) {
                            _this.text(val[name + '_DISPLAY']).attr('title', val[name + '_DISPLAY']).data('value', val[name]);
                        } else {
                            _this.text(val[name]).attr('title', val[name]);
                        }
                    }
                }

                if (val === undefined) {

                } else if (val[name] !== undefined && val[name] !== null) {
                    WIS_EMAP_INPUT.setValue(_this, name, xtype, val, options.root);
                }
            });
        }
    };

    // 根据不同的文件后缀名获取不同的icon图标
    WIS_EMAP_SERV._getIconImgClass = function(fileName) {
        var iconImgClass = '';
        var suffixName = fileName.split('.').pop();
        switch (suffixName) {
            case 'docx':
                iconImgClass = 'icon-wenjiangeshidoc';
                break;
            case 'doc':
                iconImgClass = 'icon-wenjiangeshidoc';
                break;
            case 'pdf':
                iconImgClass = 'icon-wenjiangeshipdf';
                break;
            case 'rar':
                iconImgClass = 'icon-wenjiangeshirar';
                break;
            case 'txt':
                iconImgClass = 'icon-wenjiangeshitxt';
                break;
            case 'xls':
                iconImgClass = 'icon-wenjiangeshixls';
                break;
            case 'xlsx':
                iconImgClass = 'icon-wenjiangeshixls';
                break;
            case 'zip':
                iconImgClass = 'icon-wenjiangeshizip';
                break;
            default:
                iconImgClass = 'icon-wenjian';
        }
        return iconImgClass;
    };

    // 重置页脚定位
    WIS_EMAP_SERV._resetPageFooter = function() {
        if ($.bhPaperPileDialog && $('[bh-paper-pile-dialog-role="bhPaperPileDialog"]').length) {
            $.bhPaperPileDialog.resetPageFooter(); //改变页面的页脚位置
            $.bhPaperPileDialog.resetDialogFooter(); //改变弹框的页脚位置
        }
    };

    // 日期格式转化成时间戳
    WIS_EMAP_SERV.toDateStp = function(str) {
        if (!str) return false;
        var date = new Date();
        var arr = str.toString().split(' ');
        var dateArr = arr[0].split('-');
        date.setFullYear(dateArr[0]);
        date.setMonth(dateArr[1] - 1);
        dateArr[2] ? date.setDate(dateArr[2]) : date.setDate(0);
        date.setMilliseconds(0);
        if (arr.length > 1) {
            var timeArr = arr[1].split(':')
            timeArr[0] ? date.setHours(timeArr[0]) : date.setHours(0);
            timeArr[1] ? date.setMinutes(timeArr[1]) : date.setMinutes(0);
            timeArr[2] ? date.setSeconds(timeArr[2]) : date.setSeconds(0);
        }
        return parseInt(date.getTime() / 1000);
    };


    if (window.WIS_CONFIG != undefined && (WIS_CONFIG.ROOT_PATH === undefined || WIS_CONFIG.ROOT_PATH == ""))
        WIS_CONFIG.ROOT_PATH = WIS_EMAP_SERV.getAppPath();

    /**
     *  以下为兼容性接口  准备废弃
     */

    WIS_EMAP_SERV._getAttr = function(item) {
        WIS_EMAP_SERV.getAttr(item);
    };

    // 表单控件赋值
    WIS_EMAP_SERV._setEditControlValue = function(_this, name, xtype, val, root) {
        WIS_EMAP_INPUT.setValue(_this, name, xtype, val, root);
    };

    // 获取表单选项数据
    WIS_EMAP_SERV._getInputOptions = function(url, callback) {
        WIS_EMAP_INPUT.getInputOptions(url, callback);
    };

})(window.WIS_EMAP_SERV = window.WIS_EMAP_SERV || {});
/**
 * @fileOverview EMAP计数文本域
 * @example
    $("#container").bhTxtInput();
 */
;
(function ($) {
    //区分中英文，中文算3个
    function _getStrLen(str) {
        return str.replace(/[\u0391-\uFFE5]/g, '***').length;
    }

    function jqxBridge($elem, data) {
        $elem.toggleClass('jqx-widget', true);
        $elem.data('jqxWidget', data);
    }

    var TxtInput = function (elem, options) {

        this.$container = $(elem);
        this.$inner = undefined;
        this.$txtArea = undefined;
        this.$curLen = undefined;

        this.options = {
            limit:  options.limit || 140,
            name: options.name,
            easyCheck: options.textareaEasyCheck || false
        };

        // if (this.options.easyCheck) {
        //     this.options.limit = Math.floor(options.limit / 3);
        // }

        this.init();

        //val
        jqxBridge(this.$container, this);

        return this
    };

    TxtInput.prototype.render = function () {
        var $template = $(
            '<div class="bh-txt-input">' +
            '<textarea class="bh-txt-input__txtarea"></textarea>' +
            '<div class="bh-txt-input__foot">' +
            '<span class="bh-txt-input__cur-len">0</span>/<span class="bh-txt-input__max-len">' + this.options.limit + '</span>' +
            '</div>' +
            '</div>'
        );

        $template
            .find('.bh-txt-input__txtarea').attr({
                name: this.options.name
            }).end()
            .appendTo(this.$container);
        this.$inner = $template;
        this.$txtArea = $template.find('.bh-txt-input__txtarea');
        this.$curLen = $template.find('.bh-txt-input__cur-len');
    };

    TxtInput.prototype.init = function () {
        this.render();
        this.bindEvents();
    };

    TxtInput.prototype.bindEvents = function () {
        var self = this;
        // this.$container[0].addEventListener('input', $.proxy(this.inputHandler, this), false);

        this.$container.on('input', '.bh-txt-input__txtarea', $.proxy(this.inputHandler, this));
        this.$txtArea
            .on('focus', function () {
                self.$inner.toggleClass('bh-txt-input--focus', true);
            })
            .on('blur', function () {
                self.$inner.toggleClass('bh-txt-input--focus', false);
                self.$inner.trigger('c-blur')
            });
        if (document.documentMode == 9) {  // ie9 backspace 不出发input事件  兼容
            this.$txtArea.on('keyup', function (e) {
                var code = e.keyCode;
                if (code == '8' || code == 46) {
                    $(this).trigger('input');
                }
            })
        }
    };

    TxtInput.prototype.inputHandler = function (e) {
        this.checkLen(e.target.value);
    };

    TxtInput.prototype.checkLen = function (val) {
        var len;
        if (this.options.easyCheck || this.options.textareaEasyCheck) {
            len = val.length;
        } else {
            len = _getStrLen(val);
        }
        this.$inner.toggleClass('bh-txt-input--outlen', len > this.options.limit);
        this.$curLen.text(len)
    };

    //============================ 接口=================================
    TxtInput.prototype.val = function (value) {
        if (arguments.length) {
           return this.setValue(arguments[0])
        } else {
           return this.getValue()
        }
    };
    TxtInput.prototype.getValue = function () {
        return $.trim(this.$txtArea.val())
    };

    TxtInput.prototype.setValue = function (val) {
        this.checkLen(val);
        return this.$txtArea.val(val);
    };

    TxtInput.prototype.disabled = function (bool) {
        var self = this;
        self.$txtArea.prop('disabled', bool);
        this.$inner.toggleClass('bh-txt-input--disabled', bool);
    };
    //============================ end ================================

    TxtInput.prototype.readonly = function (bool) {
        this.$txtArea.prop('readonly', bool);
    };


    function Plugin(options, params) {
        var $this = this;
        var data = $this.data('we.bhTxtInput');

        if (!data) {
            $this.data('we.bhTxtInput', new TxtInput(this, options));
            return $this;
        }
        if (typeof options === 'string') {
            return data[options](params);
        }
    }

    //
    $.fn.bhTxtInput = Plugin;
    $.fn.bhTxtInput.prototype.constructor = TxtInput;

    window.BhTxtInput = TxtInput;
})(jQuery);
(function() {
    var Plugin,
        _init,
        _getValidateCondition,
        _getValueLength; //插件的私有方法

    Plugin = (function() {

        function Plugin(element, options) {
            if ($.fn.emapValidate.rules) {
                $.fn.emapValidate.allRules = $.extend({}, $.fn.emapValidate.defaultRules, $.fn.emapValidate.rules);
            } else {
                $.fn.emapValidate.allRules = $.fn.emapValidate.defaultRules;
            }
            this.options = $.extend({}, $.fn.emapValidate.defaults, options);
            this.$element = $(element);
            _init($(element), options);

        }

        Plugin.prototype.validate = function() {
            return this.$element.jqxValidator('validate');
        };

        Plugin.prototype.destroy = function() {
            this.options = null;
            $(this.$element).data('validate', false)
                .find('.jqx-validator-error-info').remove(); // 修复jqx destroy方法 对日期控件的bug
            return this.$element.jqxValidator('destroy');
        };
        return Plugin;
    })();

    _init = function(element, options) {
        var validateRules = _getValidateCondition(element, options);
        if (options.callback) {
            options.callback(validateRules);
        }
        element.jqxValidator({
            useHintRender: true,
            rules: validateRules
        });
    };

    _getValidateCondition = function(element, options) {
        var rules = [];
        $('[xtype]', element).each(function() {
            var _this = $(this);
            var itemRules;
            // 跳过隐藏字段 跳过disable 字段 跳过表格表单的只读字段和隐藏字段
            if (_this.closest('.bh-row').attr('hidden') || _this.closest('.bh-form-group').css('display') === 'none' || _this.closest('.bh-form-group').hasClass('bh-disabled') || _this[0].nodeName == 'P' || _this.attr('xtype') == 'div') {
                return true
            }
            //2016-04-20 qiyu 表格表单
            // var row = _this.closest('.bh-row');
            var row = _this.closest('.form-validate-block');

            var name = _this.data('name');
            var label = $('label.bh-form-label', row).text();
            var xtype = _this.attr('xtype');
            var dataType = _this.data('type');

            //  必填校验
            if ($('.bh-required', row).length > 0) {

                if (xtype == 'static') {
                    return;
                }
                itemRules = {
                    input: '[data-name=' + name + ']',
                    message: label + '不能为空',
                    action: 'change, blur, valuechanged',
                    rule: 'required'
                };
                if (xtype == 'select' || xtype == 'multi-select2' || xtype == 'date-local' || xtype == 'date-ym' || xtype == 'date-full' || xtype == 'selecttable') {
                    itemRules.rule = function() {
                        if (_this.hasClass('jqx-rc-b-expanded')) {
                            return true;
                        }
                        return _this.val() != '';
                    };
                }

                if (xtype == 'number') {
                    itemRules.rule = function() {
                        return _this.find('input').val() != '';
                    };
                }

                if (xtype == 'date-local' || xtype == 'date-ym' || xtype == 'date-full') {
                    itemRules.action = 'change, valuechanged, close';
                }

                if (xtype == 'select' || xtype == 'multi-select2') {
                    itemRules.action = 'change, select';

                }

                if (xtype == 'tree') {
                    itemRules.rule = function() {
                        return _this.emapDropdownTree('getValue') != '';
                    }
                }
                if (xtype == 'multi-select') {
                    itemRules.rule = function() {
                        return _this.jqxComboBox('getSelectedItems').map(function(item) {
                            return item.value;
                        }).join(',') != '';
                    };
                }
                if (xtype === 'textarea') {
                    itemRules.action = 'c-blur',
                        itemRules.rule = function() {
                            return _this.bhTxtInput('getValue') != '';
                        };
                }
                if (xtype === 'number-range') {
                    itemRules.rule = function() {
                        var valArr = _this.bhNumRange('getValue').split(',');
                        return valArr[0] != '' && valArr[1] != '';
                    };
                }
                // 上传的必填校验
                if (xtype == 'uploadfile' || xtype == 'uploadsingleimage' || xtype == 'uploadmuiltimage') {
                    itemRules.action = 'blur';
                    itemRules.rule = function() {
                        if (xtype == 'uploadfile') {
                            return _this.emapFileUpload('getFileNum') != 0;
                        } else if (xtype == 'uploadsingleimage') {
                            return _this.emapSingleImageUpload('getFileNum') != 0;
                        } else if (xtype == 'uploadmuiltimage') {
                            return _this.emapImageUpload('getFileNum') != 0;
                        }
                    }
                }
                rules.push(itemRules);
            }

            // double 类型的字段 自动添加 double 校验和  长度为21的校验
            if (_this.data('type') == 'double') {
                rules.push({
                    input: '[data-name=' + name + ']',
                    message: '无效的数字格式',
                    action: 'change, blur, valuechanged',
                    rule: function() {
                        if (_this.val() === '') return true;
                        //qiyu 2016-9-1 double类型小数点后位数不限，需求人：吴芳。原始需求人：张毅
                        // return /^\d+(\.\d{1,2})?$/g.test( _this.val());
                        return /^\d+(\.\d+)?$/g.test(_this.val());
                    }
                });
                rules.push({
                    input: '[data-name=' + name + ']',
                    message: '长度超出限制',
                    action: 'change, blur, valuechanged',
                    rule: function() {
                        if (_this.val() == '') return true;
                        //qiyu 2016-9-1 double类型小数点后位数不限，需求人：吴芳。原始需求人：张毅
                        // return /^\d+(\.\d{1,2})?$/g.test(_this.val());
                        return /^\d+(\.\d+)?$/g.test(_this.val());
                    }
                });
            }

            // int 类型的字段 自动添加 数字校验
            if (_this.data('type') == 'int') {
                rules.push({
                    input: '[data-name=' + name + ']',
                    message: $.fn.emapValidate.allRules['integer'].alertText,
                    action: 'change, blur, valuechanged',
                    rule: function() {
                        if (_this.val() == "") {
                            return true;
                        } // 空值不做校验
                        var value = _this.val();
                        // 开关按钮兼容处理
                        if (_this.attr('xtype') == 'switcher') {
                            if (value === true) {
                                value = 1;
                            } else if (value === false) {
                                value = 0;
                            }
                        }
                        return new RegExp($.fn.emapValidate.allRules['integer'].regex).test(value);
                    }
                });
            }

            // 内容长度校验
            /**
             * 5-16 学工业务线要求,textareaEasyCheck只对文本域有效
             *
             */

            // var maxLength = _this.attr('maxlength');
            var maxLength = _this.data('checksize');
            if (!maxLength) {
                if (options.textareaEasyCheck) {
                    //  bi~bi~bi~ 开启简单长度校验模式,所有字符 都算三个长度
                    // if (dataType == 'String' && (!xtype || xtype == 'text' || xtype == 'textarea')) {
                    if (dataType == 'String' && (xtype == 'textarea')) {
                        maxLength = _this.data('size') ? Math.floor(_this.data('size') / 3) : 0;
                    } else {
                        maxLength = _this.data('size') ? _this.data('size') : 0;
                    }
                } else {
                    // 默认:  严格校验模式 , 只有汉字算三个长度
                    maxLength = _this.data('size') ? _this.data('size') : 0;
                }
            }



            if (maxLength) {
                itemRules = {
                    input: '[data-name=' + name + ']',
                    message: label + '长度超出限制',
                    action: 'change, blur, valuechanged',
                    rule: function() {
                        return _getValueLength(_this.val()) <= maxLength;
                    }
                };

                if (options.textareaEasyCheck && xtype == 'textarea') {
                    itemRules.message = label + '长度不能超过' + maxLength + '个字';
                    itemRules.rule = function() {
                        return _this.val().length <= maxLength;
                    }
                }

                // 文本框金额类的 小数  长度校验
                if ((xtype == 'text' || !xtype)) {
                    if (maxLength.toString().indexOf(',') > -1) {
                        var lengthArr = maxLength.split(',');
                        itemRules.rule = function() {
                            if (_this.val() == '') return true;
                            var valArr = _this.val().toString().split('.');
                            if (valArr.length > 1) {
                                if (valArr[1].length > lengthArr[1]) return false
                            }

                            return valArr[0].length <= lengthArr[0] - lengthArr[1];
                        };

                        rules.push({
                            input: '[data-name=' + name + ']',
                            message: '金额类型不正确',
                            action: 'change, blur, valuechanged',
                            rule: function() {
                                if (_this.val() == '') return true;
                                return _this.val().length < 22;
                            }
                        });
                    } else {}

                }

                if (xtype == 'multi-select') {
                    itemRules.message = '最多选择' + maxLength + '项';
                    itemRules.rule = function() {
                        return _this.jqxComboBox('getSelectedItems').length <= (maxLength);
                    }
                }

                if (xtype == 'multi-select2') {
                    itemRules.message = '最多选择' + maxLength + '项';
                    itemRules.rule = function() {
                        return _this.jqxDropDownList('getCheckedItems').length <= (maxLength);
                    }
                }
                rules.push(itemRules);
            }

            // 正则校验
            var exp = decodeURI(_this.data('checkexp'));
            if (exp && exp != "undefined") {
                rules.push({
                    input: '[data-name=' + name + ']',
                    message: label + '不正确',
                    action: 'change, blur, valuechanged',
                    rule: function() {
                        if (_this.val() == "") {
                            return true;
                        } // 空值不做校验
                        return eval(exp).test(_this.val());
                    }
                });
            }

            // 日期控件的 内容附件校验   防止提交奇怪的字符串
            if ($.inArray(xtype, ['date-loacl', 'date-ym', 'date-full']) > -1) {
                rules.push({
                    input: '[data-name=' + name + ']',
                    message: '日期格式不正确',
                    action: 'change, blur, valuechanged',
                    rule: function() {
                        if (_this.val() == "") {
                            return true;
                        } // 空值不做校验
                        return !isNaN(parseInt(_this.val()));
                    }
                })
            }

            // 类型校验
            var jsonType = decodeURI(_this.data('jsonparam'));
            var checkType = decodeURI(_this.data('checktype'));
            if (!checkType || checkType == 'undefined') checkType = jsonType;
            checkType = checkType.replace(/\[|\]|\"|\{|\}|custom/g, "");
            if ($.fn.emapValidate.allRules[checkType]) {
                itemRules = {
                    input: '[data-name=' + name + ']',
                    message: $.fn.emapValidate.allRules[checkType].alertText,
                    action: 'change, blur, valuechanged'
                };
                if ($.fn.emapValidate.allRules[checkType].regex) {
                    itemRules.rule = function() {
                        if (_this.val() == "") {
                            return true;
                        } // 空值不做校验
                        return new RegExp($.fn.emapValidate.allRules[checkType].regex).test(_this.val());
                    }
                } else if ($.fn.emapValidate.allRules[checkType].func) {
                    itemRules.rule = function() {
                        if (_this.val() == "") {
                            return true;
                        } // 空值不做校验
                        return $.fn.emapValidate.allRules[checkType].func(_this.val());
                    }
                }
                rules.push(itemRules);
            } else if (/^after/g.test(checkType) || /^before/g.test(checkType)) {
                itemRules = {
                    input: '[data-name=' + name + ']',
                    action: 'change, blur, valuechanged'
                };
                var formEle = _this.closest('[bh-form-role=bhForm]');
                var targetLabel; // 参照字段的label

                if (/^before/g.test(checkType)) {
                    var checkField = checkType.replace('before', '');
                    if (checkField == 'now') {
                        targetLabel = '今天';
                    } else {
                        targetLabel = $('[data-name=' + checkField.replace('=', '') + ']', formEle).data('caption');
                    }
                    itemRules.message = $.fn.emapValidate.allRules['before'].alertText.replace('*1', label).replace('*2', targetLabel);
                    if (/=/g.test(checkField)) {
                        checkField = checkField.replace('=', '');
                        itemRules.rule = function() {
                            if (!_this.val()) return true;
                            return $.fn.emapValidate.allRules['before='].func(_this.val(), checkField, _this.closest('[bh-form-role=bhForm]'));
                        }
                    } else {
                        itemRules.rule = function() {
                            if (!_this.val()) return true;
                            return $.fn.emapValidate.allRules.before.func(_this.val(), checkField, _this.closest('[bh-form-role=bhForm]'));
                        }
                    }

                }
                if (/^after/g.test(checkType)) {
                    var checkField = checkType.replace('after', '');
                    if (checkField == 'now') {
                        targetLabel = '今天';
                    } else {
                        targetLabel = $('[data-name=' + checkField.replace('=', '') + ']', formEle).data('caption');
                    }
                    itemRules.message = $.fn.emapValidate.allRules['after'].alertText.replace('*1', label).replace('*2', targetLabel);
                    if (/=/g.test(checkField)) {
                        checkField = checkField.replace('=', '');
                        itemRules.rule = function() {
                            if (!_this.val()) return true;
                            return $.fn.emapValidate.allRules['after='].func(_this.val(), checkField, _this.closest('[bh-form-role=bhForm]'));
                        }
                    } else {
                        itemRules.rule = function() {
                            if (!_this.val()) return true;
                            return $.fn.emapValidate.allRules.after.func(_this.val(), checkField, _this.closest('[bh-form-role=bhForm]'));
                        }
                    }

                }
                rules.push(itemRules);
            }

            // 对于整数和 数字的校验 添加 最大为22 的长度校验  wuying  0726
            if ($.inArray(checkType, ['number', 'integer']) > -1) {
                rules.push({
                    input: '[data-name=' + name + ']',
                    message: label + '长度超出限制',
                    action: 'change, blur, valuechanged',
                    rule: function() {
                        return _this.val().length < 22;
                    }
                })
            }
            if ($.inArray(xtype, ['uploadfile']) > -1) {
                rules.push({
                    input: '[data-name=' + name + ']',
                    message: '文件错误',
                    action: 'bh-file-upload-validate',
                    rule: function() {
                        return _this.find('.bh-error').length === 0;
                    }
                });
            }
        });
        return rules;
    };


    // 获取取值长度   中文为 3个字符
    _getValueLength = function(val) {
        return val.replace(/[\u0391-\uFFE5]/g, '***').length;
    };

    $.fn.emapValidate = function(options) {
        var instance;
        instance = this.data('validate');
        if (!instance) {
            return this.each(function() {
                return $(this).data('validate', new Plugin(this, options));
            });
        }
        if (options === true) return instance;
        if ($.type(options) === 'string') return instance[options]();
        return this;
    };

    $.fn.emapValidate.defaults = {
        easyCheck: false,
        textareaEasyCheck: false
    };


    $.fn.emapValidate.defaultRules = WIS_EMAP_INPUT.validateRules

}).call(this);
/**
 * @fileOverview EMAP条件筛选组件
 * @example
 $('#container').emapFilterQuery({
            contextPath: "/emap"
        })
 */
(function () {
    var Plugin;
    /**
     * @module emapFilterQuery
     * @fires search - 搜索事件
     * @example
     $('#container').emapFilterQuery({
            contextPath: "/emap"
        })
     */
    Plugin = (function () {
        function Plugin(element, options) {
            this.options = $.extend({}, $.fn.emapFilterQuery.defaults, options);
            this.$element = $(element);
            _init(this.$element, this.options);

        }

        /**
         * @method setValue
         * @description 赋值
         * @param {String|Array} val - 搜索条件
         */
        Plugin.prototype.setValue = function (val) {
            var filter_block = this.options.filter_block;
            if (typeof val == 'string') {
                try {
                    val = JSON.parse(val);
                } catch (e) {
                    console && console.error('filterQuery setValue 传入参数有误');
                }

            }
            if (val.length) {
                var form_date = {};
                val.map(function (item) {
                    if (item instanceof Array) {
                        // common filter 关键字字段
                        form_date['_commonFilter'] = item[0].value;
                    } else {
                        form_date[item.name] = item.value;
                    }
                });
                WIS_EMAP_INPUT.formSetValue(filter_block, form_date, {});
            } else {
                console && console.error('filterQuery setValue 传入参数有误');
            }
        };

        /**
         * 取值
         * @method getValue
         * @returns {String} 格式化的搜索条件
         * @example
         $("#container").emapFilterQuery('getValue');
         */
        Plugin.prototype.getValue = function () {
            return JSON.stringify(_getSearchConditions(this.options));
        };

        /**
         * 清空
         * @method clear
         */
        Plugin.prototype.clear = function () {
            _clear(this.$element, this.options);
        };

        /**
         * @method destroy
         * @description 销毁
         * @returns {*}
         */
        Plugin.prototype.destroy = function () {
            return this.$element.removeClass('emap-FQ-container').empty().data('emapfilterquery', undefined);
        };

        return Plugin;
    })();

    function _init(element, options) {
        options.model = options.data.controls.map(function (item) {
            if (item['search.hidden'] === true || item['search.hidden'] === false)  {
                item['hidden'] = item['search.hidden'];
            }
            return item;
        });

        if (options.beforeRender) {
            options.model = options.beforeRender(options.model);
        }

        element.addClass('emap-FQ-container').append(
                '<div class="emap-FQ-filters bh-clearfix" emap-role="FQ-filters" style="display: none;"></div>' +
                '<div class="emap-FQ-footer" emap-role="FQ-footer">' +
                '<div class="bh-clearfix emap-FQ-footer-top">' +
                '<h4 class="bh-pull-left emap-FQ-title bh-ph-16" >条件筛选</h4>' +
                '<a href="javascript:void(0)" class="bh-pull-right bh-ph-16" emap-role="FQ-switch-btn__expand">展开  ></a>' +
                '<p class="emap-FQ-text-wrap" emap-role="FQ-text-wrap">' +
                '<span class="emap-FQ-text" emap-role="FQ-text"></span>' +
                '<a href="javascript:void(0)" emap-role="FQ-clear-btn" class="emap-FQ-clear-btn">清空条件</a>' +
                '</p>' +
                '</div>' +
                '<div class="emap-FQ-footer-bottom bh-text-center">' +
                '<a class="bh-btn bh-btn-primary" emap-role="FQ-search-btn">搜索</a>' +
                '<p class="emap-FQ-footer-btn-wrap bh-ph-16">' +
                '<a href="javascript:void(0)" emap-role="FQ-clear-btn" style="width: 120px;">清空条件</a> | ' +
                '<a emap-role="FQ-more" href="javascript:void(0)" class="bh-mr-16">更多条件</a>' +
                '<a href="javascript:void(0)" emap-role="FQ-switch-btn__collapse">收起  ></a>' +
                '</p>' +
                '</div>' +
                '</div>'
        );

        options.filter_block = $('[emap-role="FQ-filters"]', element);

        // 初始化时 ,只显示quickSearch 的字段
        var quick_array = [];
        options.model.map(function (item) {
            quick_array.push({
                name: item.name,
                hidden: !item.quickSearch
            });
        });

        _renderFilterForm(quick_array, options);

        if (options.expanded) {
            element.addClass('emap-expand');
            options.filter_block.show();
        }

        _eventBind(element, options);
    }

    // 渲染filter 表单
    function _renderFilterForm(nameArray, options) {
        var form_array = [];
        var cur_names = options.filter_block.data('names');
        if (!cur_names) {
            cur_names = options.model.map(function(item){
                item.hidden = true;
                return item;
            });
            form_array.push(_renderFilterFormItem({
                name: '_commonFilter',
                caption: '关键字',
                get: function(field) {
                    if (this["search." + field] !== undefined)
                        return this["search." + field];
                    else
                        return this[field];
                }
            }));
        }

        nameArray.map(function (nameItem, i) {
            var name_hidden = nameItem['hidden'];
            var model_item = cur_names.filter(function(item){return item.name == nameItem.name;})[0];
            if (name_hidden !== model_item['hidden']) {
                if (name_hidden) {
                    // 需要移除的字段
                    $('[data-field=' + nameItem.name + ']', options.filter_block).remove();
                } else {
                    // 需要添加的字段
                    form_array.push(_renderFilterFormItem(options.model[i]));
                }
            }
        });

        options.filter_block.data('names', nameArray).append(form_array);
        form_array.map(function (item) {
            WIS_EMAP_INPUT.init(item, {
                defaultOptions: {
                    "date-range": {
                        defaultType: 'all'
                    }
                }
            });
        });
    }

    // 构造表单项的html
    function _renderFilterFormItem(item) {
        var model_item = _adaptModelItem(_cloneObj(item));
        var item_html = '';
        var attr = WIS_EMAP_SERV.getAttr(model_item);
        item_html += '<div class="emap-FQ-filter-group bh-mb-8" data-field="' + attr.name + '">' +
                '<div class="emap-FQ-label" title="' + attr.caption + '">' + attr.caption + '</div>' +
                '<div class="emap-FQ-input-warp" emap-role="input-wrap">' +
                '</div>' +
                '</div>';
        item_html = $(item_html);
        $('[emap-role="input-wrap"]', item_html).append(WIS_EMAP_INPUT.renderPlaceHolder(model_item));
        return item_html;
    }

    function _cloneObj(obj) {
        var clone = {};
        for (var k in obj) {
            if (typeof obj[k] == 'Object') {
                clone[k] = _cloneObj(obj[k]);
            } else {
                clone[k] = obj[k];
            }
        }
        return clone;
    }

    /**
     * 控件类型的强制转换
     * buttonlist => select
     * multi-buttonlist => multi-select2
     * radiolist => select
     * checkboxlist => multi-select2
     */
    function _adaptModelItem(item) {
        switch (item.xtype) {
            case 'buttonlist':
            case 'radiolist' :
                item.xtype = 'select';
                break;
            case 'multi-buttonlist':
            case 'checkboxlist':
                item.xtype = 'multi-select2';
                break;
            default:
        }
        return item;
    }

    function _getSearchConditions(options) {
        var filter_block = options.filter_block;
        var filter_value = WIS_EMAP_INPUT.formGetValue(filter_block, options);
        return _convertConditions(filter_value, options.model);
    }

    // 将表单取值转换 为 搜索条件数据结构
    function _convertConditions(value_obj, model) {
        var condition = [];
        var text_fields = model.map(function (item) {
            if (!item.xtype || item.xtype == 'text') {
                return item.name;
            }
        });
        for (var k in value_obj) {
            if (value_obj[k] == "") continue;
            if (k == '_commonFilter') {
                // 关键字字段  匹配模型中所有的文本字段
                var common_filters = [];
                text_fields.map(function (field, i) {
                    if (field) {
                        var field_data = {
                            name: field,
                            caption: model.filter(function(item){return item.name == field})[0].caption,
                            builder: "include",
                            linkOpt: 'OR',
                            value: value_obj[k]
                        };
                        if (i == 0) field_data.linkOpt = 'AND';
                        common_filters.push(field_data);
                    }
                });
                condition.push(common_filters);
            } else {
                if (/_DISPLAY$/.test(k)) continue;
                var modelItem = model.filter(function(item){return item.name == k})[0];
                var item_filter = {
                    name: k,
                    caption: modelItem.caption,
                    linkOpt: "AND",
                    builderList: modelItem.builderList,
                    builder: modelItem.defaultBuilder,
                    value: value_obj[k],
                    value_display: value_obj[k + '_DISPLAY'] || ""
                };
                condition.push(item_filter);
            }
        }
        return _adaptCondition(condition, model);
     }

    // 搜索条件数据适配
    function _adaptCondition(condition, model){
        var resultCondition = [];
        for (var i = 0; i < condition.length; i++) {
            resultCondition.push(condition[i]);
            var condition_item = resultCondition[i];
            if (!(condition_item instanceof Array)) {
                var model_item = model.filter(function(m_item){return m_item.name == condition_item.name;})[0];
                // 文本类型控件包含 , 时  builder转化为多值包含
                if ((!model_item.xtype || model_item.xtype == 'text') && condition_item.value.indexOf(',') > 0) {
                    condition_item.builder = 'm_value_include';
                }
                // 下拉多选、复选框、多选按钮组类型, builder 转化为多值相等
                else if (model_item.xtype == 'multi-select2' || model_item.xtype == 'checkboxlist' || model_item.xtype == 'multi-buttonlist') {
                    condition_item.builder = 'm_value_equal';
                }
                // 类型为date-range日期范围  num-range数字区间 时, 拆分成 两个条件
                else if (model_item.xtype == 'date-range' || model_item.xtype == 'number-range') {
                    var date_value = condition_item.value.split(',');
                    if (date_value[0] !== ""){
                        resultCondition.splice(i+1, undefined, {
                            name: condition_item.name,
                            caption: condition_item.caption,
                            builder: 'moreEqual',
                            linkOpt: 'AND',
                            builderList: 'cbl_Other',
                            value: date_value[0]
                        });
                    }
                    if (date_value[1] !== "") {
                        resultCondition.splice(i, 1, {
                            name: condition_item.name,
                            caption: condition_item.caption,
                            builder: 'lessEqual',
                            linkOpt: 'AND',
                            builderList: 'cbl_Other',
                            value: date_value[1]
                        });
                    }
                }
            }
        }
        return resultCondition;
    }

    // 根据搜索条件 渲染 搜索条件文字
    function _renderFilterText(element, conditions, builderLists) {
        var filter_text = '';
        conditions.map(function (con_item) {
            if (con_item instanceof Array) {
                filter_text += '"';
                con_item.map(function(common_item, i){
                    filter_text += common_item.caption;
                    if (i == con_item.length - 1) {
                        filter_text += '" '
                    } else {
                        filter_text += '" 或 "';
                    }
                });
                filter_text += '包含 "' + con_item[0].value + '"; ';
            } else {
                filter_text += '"' + con_item.caption + '"';
                filter_text += builderLists[con_item['builderList']].filter(function(list_item){return list_item.name == con_item['builder']})[0].caption;
                filter_text += '"' + (con_item['value_display'] || con_item['value']) + '"; ';
            }
        });
        $('[emap-role="FQ-text"]', element).text(filter_text).attr('title', filter_text);
    }

    function _clear(element, options) {
        WIS_EMAP_INPUT.formClear(options.filter_block);
        $('[emap-role="FQ-text"]', element).text('').attr('title', '');
        $('[emap-role="FQ-text-wrap"]', element).hide();
        options.onSearch && options.onSearch('[]');
        element.trigger('search', ['[]']);
    }

    // 执行搜索
    function _doSearch(element, options) {
        var conditions = _getSearchConditions(options);
        var conditions_string = JSON.stringify(conditions);
        _renderFilterText(element, conditions, options.data.builderLists);

        options.onSearch && options.onSearch(conditions_string);
        element.trigger('search', [conditions_string]);
        if (conditions !== []) {
            $('[emap-role="FQ-text-wrap"]', element).show();
        } else {
            $('[emap-role="FQ-text-wrap"]', element).hide();
        }
    }
    // 事件绑定
    function _eventBind(element, options) {
        // 点击展开
        element.on('click', '[emap-role="FQ-switch-btn__expand"]', function () {
            element.addClass('emap-expand');
            options.filter_block.show();
        })
        // 点击收起
        .on('click', '[emap-role="FQ-switch-btn__collapse"]', function () {
            element.removeClass('emap-expand');
            options.filter_block.hide();
        })
        // 更多条件
        .on('click', '[emap-role=FQ-more]', function () {
            var modelArray = options.model;
            var columns = options.filter_block.data('names');
            $.bhCustomizeColumn({
                model: modelArray,
                columns: columns,
                title: '添加搜索字段',
                callback: function (cols) {
                    _renderFilterForm(cols, options);
                }
            });
        })
        // 搜索
        .on('click', '[emap-role="FQ-search-btn"]', function () {
            _doSearch(element, options);
        })
        // 文本框回车事件搜索
        .on('keyup', 'input[xtype=text]', function (e) {
            if (e.keyCode == 13) {
                _doSearch(element, options);
            }
        })
        // 清空搜索
        .on('click', '[emap-role="FQ-clear-btn"]', function () {
            _clear(element, options);
        })
    }


    $.fn.emapFilterQuery = function (options, param) {
        var instance;
        instance = this.data('emapfilterquery');
        if (!instance) {
            return this.each(function () {
                return $(this).data('emapfilterquery', new Plugin(this, options));
            });
        }
        if (options === true) return instance;
        if ($.type(options) === 'string') return instance[options](param);
        return this;
    };

    /**
     * @memberof module:emapFilterQuery
     * @prop {Object} data - 搜索数据模型
     * @prop {String}  contextPath - emap根路径
     * @prop {Boolean} [expanded=false] - 是否自动展开
     * @prop {Function} onSearch - 搜索回调
     * @prop {Function} beforeRender - 渲染前的回调,需要返回数据模型
     */

    $.fn.emapFilterQuery.defaults = {
        expanded: false,
        onSearch: undefined,
        beforeRender: undefined
    };
}).call(this);


$.fn.emapFormInputInit = function (opt) {
    WIS_EMAP_INPUT.init($(this), opt);
};

/**
 * @fileOverview emapInput 功能模块
 */
(function (WIS_EMAP_INPUT, undefined) {
    /**
     * @module WIS_EMAP_INPUT
     * @example
     WIS_EMAP_INPUT.init($form, {root: '/emap'})
     */

    /**
     * @memberof module:WIS_EMAP_INPUT
     * @description 表单控件注册对象,基于1.1版本进行修改和扩展
     * @prop {Object} date-ym - 年月选择框,基于bhDateTimePicker封装， 默认 yyyy-MM
     * @prop {Object} date-local - 日期选择框,基于bhDateTimePicker封装， 默认 yyyy-MM-dd
     * @prop {Object} date-full - 日期时间选择框,基于bhDateTimePicker封装， 默认 yyyy-MM-dd HH:mm
     * @prop {Object} date-range - 日期范围选择, 只能在高级搜索中使用，基于bhDateTimePicker封装， 默认 yyyy-MM-dd
     * @prop {Object} date-area - 日期范围选择, 在表单中使用，基于bhDateTimePicker封装， 默认 yyyy-MM-dd
     * @prop {Object} cache-upload - 缓存上传， 基于cacheUpload封装
     * @prop {Object} direct-upload - 直接上传， 基于directUpload封装
     */
    WIS_EMAP_INPUT.core = $.extend(WIS_EMAP_INPUT.core, {
        "date-ym": {
            "init": _initDateInput,
            "setValue": _dateSetValue,
            "getValue": _dateGetValue,
            "enable": _enableDateInput,
            "disable": _disableDateInput
        },

        "date-local": {
            "init": _initDateInput,
            "setValue": _dateSetValue,
            "getValue": _dateGetValue,
            "enable": _enableDateInput,
            "disable": _disableDateInput
        },

        "date-full": {
            "init": _initDateInput,
            "setValue": _dateSetValue,
            "getValue": _dateGetValue,
            "enable": _enableDateInput,
            "disable": _disableDateInput
        },
        "date-range": {
            "init": function (ele, params) {
                // range: {//可选，设置时间可选的范围
                //     max: 'today',  //可选，设置时间的最大可选范围，可传入'today'表示今天，或传入时间字符串，格式如'2015/02/05'
                //     min: '2015/02/05' //可选，设置时间的最小可选范围，可传入'today'表示今天，或传入时间字符串，格式如'2015/02/05'
                // },
                // time:{//可选，初始化时显示的时间范围
                //     start: '2015/01/05', //必填，时间字符串，格式如'2015/02/05'
                //     end: '2015/06/01'//必填，时间字符串，格式如'2015/02/05'
                // },
                // selected: function(startTime, endTime){ //可选，选择时间后的回调，返回的参数startTime是选择的开始时间，endTime是选择的结束时间，返回的是时间字符串格式如'2015/02/05'
                // }
                var inputOptions = $.extend({}, {
                    format: ele.data('format').replace(/yyyy/, 'YYYY').replace(/-dd/, '-DD')
                }, params);
                ele.bhTimePicker(inputOptions);
            },
            "setValue": function (ele, name, val, root) {
                if (val === '' || val === undefined || val[name] === "") {
                    // 清空
                    ele.bhTimePicker('setType', 'all');
                } else {
                    var val_arr = val[name].split(',');
                    if (val_arr.length == 2) {
                        ele.bhTimePicker('setType', 'custom');
                        ele.bhTimePicker('setValue', {
                            startTime: val_arr[0],
                            endTime: val_arr[1]
                        });
                    }
                }
            },
            "getValue": function (ele, formData) {
                var rangeValue = ele.bhTimePicker('getValue');
                return rangeValue.startTime + ',' + rangeValue.endTime;
            },
            "disable": function (ele) {
                ele.attr('disabled', true);
            },
            "enable": function (ele) {
                ele.attr('disabled', false);
            }
        },
        "date-area": {
            "init": function (ele, params) {
                /**
                 * start: {},
                 * end: {}
                 * 其他公共参数
                 */
                ele.bhDateAreaPicker(params);
            },
            "setValue": function (ele, name, val, root) {
                ele.bhDateAreaPicker('val', val);
            },
            "getValue": function (ele, formData) {
                var rangeValue = ele.bhDateAreaPicker('getValue');
                return rangeValue.startDate + ',' + rangeValue.endDate;
            },
            "disable": function (ele) {
                ele.bhDateAreaPicker('disable', true);
            },
            "enable": function (ele) {
                ele.bhDateAreaPicker('disable', false);
            }
        },
        "cache-upload": {
            "init": function (ele, params) {
                var inputOptions = $.extend({}, {
                    format: ele.data('format').replace(/yyyy/, 'YYYY').replace(/-dd/, '-DD')
                }, params);
                ele.data('defaultoptions', inputOptions);
                ele.cacheUpload(inputOptions);
            },
            "setValue": function (ele, name, val, root) {
                ele.cacheUpload('destroy');
                ele.cacheUpload($.extend({}, ele.data('defaultoptions'), {
                    contextPath: root,
                    token: val[name]
                }));
            },
            "getValue": function (ele, formData) {
                return ele.cacheUpload('getFileToken');
            },
            "disable": function (ele) {

            }
        },
        "direct-upload": {
            "init": function (ele, params) {
                var inputOptions = $.extend({}, {
                    format: ele.data('format').replace(/yyyy/, 'YYYY').replace(/-dd/, '-DD')
                }, params);
                ele.data('defaultoptions', inputOptions);
                ele.directUpload(inputOptions);
            },
            "setValue": function (ele, name, val, root) {
                ele.directUpload('destroy');
                ele.directUpload($.extend({}, ele.data('defaultoptions'), {
                    contextPath: root,
                    token: val[name]
                }));
            },
            "getValue": function (ele, formData) {

            },
            "disable": function (ele) {

            },
            "enable": function (ele) {

            }
        }
    });

    WIS_EMAP_INPUT.component = (function(){
        return $.extend({}, WIS_EMAP_INPUT.core, {});
    })();

    function _initDateInput(ele, params) {
        var xtype = ele.attr('xtype');
        var inputOptions = $.extend({}, {
            format: 'YYYY-MM'
        }, params);
        if (xtype == 'date-local') {
            inputOptions.format = 'YYYY-MM-DD';
        } else if (xtype == 'date-full') {
            inputOptions.format = ele.data('format') ? ele.data('format') : 'YYYY-MM-DD HH:mm:ss';
            // inputOptions.showTimeButton = true;
        } else if (xtype == 'date-ym') {
            inputOptions.format = 'YYYY-MM';
            inputOptions.viewMode = 'months';
        }
        inputOptions.format = ele.data('format') || inputOptions.format;
        inputOptions.format = inputOptions.format.replace(/yyyy/g, 'YYYY').replace(/\-dd/, '-DD');
        if (inputOptions.width !== undefined) {
            delete inputOptions.width;
        }
        ele.bhDateTimePicker(inputOptions);

        if (ele.data('disabled')) {
            ele.bhDateTimePicker('disabled', true);
        }
    }

    function _dateSetValue(ele, name, val, root) {
        ele.bhDateTimePicker('setValue', (val[name] !== null && val[name] !== undefined) ? val[name] : "");
    }

    function _dateGetValue(ele, formData) {
        return ele.bhDateTimePicker('getValue');
    }

    function _enableDateInput(ele) {
        ele.bhDateTimePicker('disabled', false);
    }

    function _disableDateInput(ele) {
        ele.bhDateTimePicker('disabled', true);
    }


})(window.WIS_EMAP_INPUT = window.WIS_EMAP_INPUT || {});
(function($) {
    /**
     * @param  {} opt
     * {
     *  app
     *  module
     *  page
     *  action
     *  preCallback
     *  importCallback
     *  closeCallback
     *  autoClose
     *  tplUrl
     *  downloadTplName //重命名下载导入模板
     *  params:{
     *      read
     *      readTemplate
     *      readImport
     *  },
     *  adapter // 指定合适的后端处理实例，支持'EMAP_IMPORT_CACHE'(默认)/'EMAP_IMPORT_DIRECT'或其他自定义类型
     *
     * }
     */

    /**
     * @module emapImport
     */
    /**
     * 导入组件
     * @method emapImport
     * @param  {object} opt 初始化组件参数
     * @example
    $.emapImport({
        contextPath: contextPath,
        app: "student_app",
        downloadTplName:'下载的导入模板',
        module: "modules",
        page: "xsxxdbwh",
        action: "T_PXXX_XSJBXX_ADD",
        adapter // 指定合适的后端处理实例，支持'EMAP_IMPORT_CACHE'(默认)/'EMAP_IMPORT_DIRECT'或其他自定义类型
        preCallback: function() {

        },
        closeCallback: function() {
            $('#emapdatatable').emapdatatable('reload');
        },
    });
     */
    $.emapImport = function(opt) {
        opt = convertOpt(opt);

        var option = {
            title: '导入数据',
            btns: {},
            params: {
                height: 450,
                close: function() {
                    if ($.isFunction(opt.closeCallback)) {
                        opt.closeCallback();
                    }
                }
            }
        };
        var view = new WIS_IMPORT_VIEW(option);
        view.show();
        if (opt.preCallback) {
            opt.preCallback();
        }

        /**
         * 初始化导入行为
         */
        emapImportData.call(view.getUploadBtn(), opt, view);
    };

    function getAdapter(opt) {
        return window[opt.adapter || 'EMAP_IMPORT_CACHE'];
    };

    /**
     * 导入组件行为控制方法
     * @param  {object} opt    控制参数
     * @param  {object} view  导入窗口实例
     */
    function emapImportData(opt, view) {
        // 检查传入的后端 adapter 是否存在
        var adapter = getAdapter(opt);
        if (!adapter) {
            console.error('The import adapter is invalid :' + opt.adapter);
            return;
        }

        // 下载导入模板参数
        var downTplData = {
            app: opt.app, // *
            module: opt.module, // *
            page: opt.page, // *
            action: opt.action, // *
            storeId: opt.storeId ? opt.storeId : 'imexport'
        };

        if (opt.params) {
            $.extend(downTplData, opt.params);
        }

        // 用于 adapter init
        var options = $.extend({}, opt, {
            config: {},
            autoUpload: false,
            multiple: false,
            storeId: (opt.storeId ? opt.storeId : 'file'),
            fileInput: view.getUploadBtn(),
            onUploading: function(result, data) {
                view.renderImportTempFileResult(result);

                view.getImportConfirmBtn().off('click').on('click', function() {
                    if ($(this).attr('disabled')) {
                        return;
                    }
                    view.renderImportingFileProgress();
                    data.submit();
                });
            },
            onRownumImported: function(resp) {
                view.renderImportRownumResult(resp);
            },
            onFileImported: function(json) {
                if (json.status == 1) {
                    if (adapter.getDownloadResultUrl) {
                        json.downLoadUrl = adapter.getDownloadResultUrl(opt, json);
                    }
                }
                view.renderImportCompleteResult(json, opt);
            },
            onImportError: function() {
                view.renderImportCompleteResult({ attachment: true });
            }
        });

        adapter.init(view.$window, options, downTplData);
        bindBtnAction(view, opt, downTplData);
    }

    /**
     * 绑定事件
     */
    function bindBtnAction(view, opt, downTplData) {
        // 点击重新上传
        view.getReImportBtn().on('click', function() {
            if (document.documentMode == 9) {
                view.renderReUploadBehaviour();
            } else {
                view.getUploadBtn().trigger('click');
            }
        });

        //下载导入模板
        view.getDownloadImportTplBtn().click(function() {
            if (opt.tplUrl) {
                location.href = opt.tplUrl;
            } else {
                downTplData = differentiateDownloadOrImport(downTplData);
                var data = $.extend({}, downTplData, { filename: opt.downloadTplName || '' });
                var adapter = getAdapter(opt);
                adapter.downloadImportTpl && adapter.downloadImportTpl(opt, data);
            }
        });

        //关闭弹窗
        view.getCloseBtn().on('click', function() {
            if ($.isFunction(opt.closeCallback)) {
                opt.closeCallback();
            }
            view.hide();
        });
    }

    // 区分 下载模板和导入数据的read
    function convertOpt(opt) {
        if (opt.params && opt.params.read) {
            opt.params.readTemplate = opt.params.readImport = opt.params.read;
            delete opt.params.read;
        } else if (opt.params && opt.params.readTemplate && opt.params.readImport) {
            if (opt.params.readTemplate === opt.params.readImport) {
                console && console.error('readTemplate 与 readImport不能相同!');
            }
        }
        return opt;
    }

    // 区分 下载模板和导入数据的read
    function differentiateDownloadOrImport(downTplData) {
        downTplData.read && delete downTplData.read;
        if (downTplData.readTemplate) {
            downTplData.read = downTplData.readTemplate;
        }
        downTplData.actionTemplate && (downTplData.action = downTplData.actionTemplate);
        return downTplData;
    }
})(jQuery);

(function($) {
    /**
     * @module WIS_IMPORT_VIEW
     */

    /**
     * 导入组件view层
     * @constructor importView
     * @param  {object} option
     * @example
    var option = {
        title: '导入数据',
        btns: {},
        params: {
            height: 450,
            close: function() {
                if ($.isFunction(opt.closeCallback)) {
                    opt.closeCallback();
                }
            }
        },
        callback: function(){}
    };
    var view = new WIS_IMPORT_VIEW(option);
    view.show();
     */
    var importView = function(option) {
        this.option = option;
    };

    var proto = importView.prototype;

    /**
     * 显示导入窗口
     * @method show
     */
    proto.show = function() {
        var title = this.option.title;
        var btns = this.option.btns || {};
        var params = $.extend({ height: 450 }, this.option.params);
        var callback = this.option.callback;
        this.$window = BH_UTILS.bhWindow(content, title, btns, params, callback);
    };

    /**
     * 隐藏导入窗口
     * @method hide
     */
    proto.hide = function() {
        this.$window.jqxWindow('close');
    };

    /**
     * 获取上传按钮
     * @method getUploadBtn
     */
    proto.getUploadBtn = function() {
        return this.$window.find('[role=fileInput]');
    };

    /**
     * 获取下载导入模板按钮
     * @method getDownloadImportTplBtn
     */
    proto.getDownloadImportTplBtn = function() {
        return this.$window.find('[role="downTplBtn"]');
    };

    /**
     * 获取导入确认按钮
     * @method getImportConfirmBtn
     */
    proto.getImportConfirmBtn = function() {
        return this.$window.find('[role=importConfirmBtn]');
    };

    /**
     * 获取重新导入按钮
     * @method getReImportBtn
     */
    proto.getReImportBtn = function() {
        return this.$window.find('[role=reImportBtn]');
    };

    /**
     * 获取下载导入结果按钮
     * @method getDownloadResultBtn
     */
    proto.getDownloadResultBtn = function() {
        return this.$window.find('a.emap-import-export');
    };

    /**
     * 获取关闭导入窗口按钮
     * @method getCloseBtn
     */
    proto.getCloseBtn = function() {
        return this.$window.find('[role=closeConfirmBtn]');
    };

    /**
     * 渲染导入临时文件结果
     * @method renderImportTempFileResult
     * @param {object} result 导入结果
     */
    proto.renderImportTempFileResult = function(result) {
        var step1Contents = this.$window.find(".emap-import-step-content");
        // if (e.target.files) {
        step1Contents.eq(0).hide();
        step1Contents.eq(1).show();
        if (result.isSuccess) {
            step1Contents.eq(1).find('span.emap-import-file-name').text(result.file[0].name).attr('title', result.file[0].name);
            if (result.fileReader) {
                step1Contents.eq(1).find('span.emap-import-file-size').text('(' + parseInt(result.file[0].size / 1024) + 'k)');
            } else {
                step1Contents.eq(1).find('span.emap-import-file-size').hide();
            }
            this.getImportConfirmBtn().attr('disabled', false);
        } else {
            step1Contents.eq(1).find('span.emap-import-file-name').html('<span class="bh-color-danger">请上传正确的Excel文件</span>').attr("title", result.file[0].name);
            this.getImportConfirmBtn().attr('disabled', true);
        }
    };

    /**
     * 渲染导入文件进度条
     * @method renderImportingFileProgress
     */
    proto.renderImportingFileProgress = function() {
        var stepContent = this.$window.find('.emap-import-step1-content');
        stepContent.children('a').hide();
        stepContent.prepend('<div class="emap-import-step1-loading-block bh-pull-right"><div class="emap-sk-spinner emap-sk-spinner-fading-circle bh-pull-right" style="height: 28px; width: 28px;">' +
            '<div class="emap-sk-circle1 emap-sk-circle"></div>' +
            '<div class="emap-sk-circle2 emap-sk-circle"></div>' +
            '<div class="emap-sk-circle3 emap-sk-circle"></div>' +
            '<div class="emap-sk-circle4 emap-sk-circle"></div>' +
            '<div class="emap-sk-circle5 emap-sk-circle"></div>' +
            '<div class="emap-sk-circle6 emap-sk-circle"></div>' +
            '<div class="emap-sk-circle7 emap-sk-circle"></div>' +
            '<div class="emap-sk-circle8 emap-sk-circle"></div>' +
            '<div class="emap-sk-circle9 emap-sk-circle"></div>' +
            '<div class="emap-sk-circle10 emap-sk-circle"></div>' +
            '<div class="emap-sk-circle11 emap-sk-circle"></div>' +
            '<div class="emap-sk-circle12 emap-sk-circle"></div>' +
            '</div>' +
            '<p class="bh-pull-right" style="margin-right: 12px;line-height:28px;">上传中……</p></div>');
    };

    /**
     * 渲染导入文件进度条
     * @method renderUploadTempFileResult
     */
    proto.renderUploadTempFileResult = function() {

    };

    /**
     * 渲染保存临时文件结果
     * @method renderSaveAttachmentResult
     */
    proto.renderSaveAttachmentResult = function() {

    };

    /**
     * 渲染导入数据条数结果
     * @method renderImportRownumResult
     */
    proto.renderImportRownumResult = function(result) {
        if (result.code == '500') {
            $('div.emap-import-step-content:eq(2)', this.$window).html('<p></p>');
            $('.emap-import-step1-content', this.$window).find('div.emap-import-step1-loading-block').remove();
            $('div.emap-import-step:eq(2)', this.$window).addClass('active').find('.emap-import-result-detail').html('<span style="color: red">' + (result.msg || '导入失败') + '</span>');
            return;
        }

        $('.emap-import-step2-count', this.$window).html('本次共导入数据' + result.rowNumber + '条');
        $('.emap-import-step1-content', this.$window).find('div.emap-import-step1-loading-block').remove();
        $('div.emap-import-step:eq(1)', this.$window).addClass('active');
        $('.emap-import-loading-bar div', this.$window).animate({
            width: '87%'
        }, 3000);
    };

    /**
     * 渲染导入完成后的结果视图
     * @method renderImportCompleteResult
     */
    proto.renderImportCompleteResult = function(result, opt) {
        var self = this;
        if (result.status == 1) {
            $('.emap-import-loading-bar div', self.$window).stop().animate({
                'width': '100%'
            }, 500, function() {
                var callback = function() {};
                if ($.isFunction(opt.importCallback)) {
                    callback = opt.importCallback(result.total, result.success);
                }
                $("div.emap-import-step-content:eq(2)", self.$window).html('<p class="bh-color-success">数据导入完成</p>');
                $("div.emap-import-step:eq(2)", self.$window).addClass("active").find(".emap-import-result-detail").html("导入已完成， 其中导入成功" + result.success + "条，导入失败" + (result.total - result.success) + "条");
                if (callback) {
                    callback($("div.emap-import-step:eq(2)", self.$window).find(".emap-import-export"));
                }
                if (result.downLoadUrl) {
                    self.getDownloadResultBtn().attr('href', result.downLoadUrl).parent().show();
                }else{
                    self.getDownloadResultBtn().parent().show();
                }
                if (opt.autoClose) {
                    self.hide();
                }
            });
        } else {
            $('div.emap-import-step-content:eq(2)', self.$window).html('<p></p>');
            $('div.emap-import-step:eq(2)', self.$window).addClass('active').find('.emap-import-result-detail').html('<span style="color: red">导入失败' + (result.msg || '') + '</span>');
            if (!result.attachment) {
                $('div.emap-import-step:eq(2)', self.$window).find('.emap-import-export').parent().hide();
            }
        }
    };

    /**
     * 渲染重新上传按钮
     * @method renderReUploadBehaviour
     */
    proto.renderReUploadBehaviour = function() {
        var contents = this.$window.find('.emap-import-step1-content');
        contents.eq(0).show();
        contents.eq(1).hide();
    };

    window.WIS_IMPORT_VIEW = importView;

    var content = '<div class="emap-import-content">' +
        '<div class="emap-import-step active">' +
        '<h5 class="emap-import-step-title">' +

        '<span>1</span>' +
        '上传文件' +
        '<i class="bh-color-caption emap-import-p emap-import-step1-intro">如果您是初次使用，建议您<a role="downTplBtn" href="javascript:void(0)">下载导入模板</a>进行查看。</i>' +
        '</h5>' +

        '<div class="emap-import-step-content emap-import-step1-content">' +
        '<a href="javascript:void(0)" class="bh-btn bh-btn-primary bh-btn-small emap-import-input-a">' +
        '开始上传' +
        '<input type="file" role="fileInput"/>' +
        '</a>' +

        '</p>' +
        '</div>' +
        '<div class="emap-import-step-content emap-import-step1-content" style="display: none;">' +
        '<p class="bh-color-caption emap-import-p  emap-import-step1-file">' +
        '<span class="emap-import-file-name"></span>' +
        '<span class="emap-import-file-size"></span>' +
        '</p>' +
        '<a href="javascript:void(0)" class="emap-import-reload-a bh-mh-8" role="reImportBtn">重新上传</a>' +
        '<a href="javascript:void(0)" role="importConfirmBtn" class="bh-btn bh-btn-primary bh-btn-small">' +
        '确认上传' +
        '</a>' +


        '</div>' +
        '</div>' +
        '<div class="emap-import-step ">' +
        '<h5 class="emap-import-step-title">' +
        '<span>2</span>' +
        '导入数据' +
        '</h5>' +

        '<div class="emap-import-step-content">' +
        '<p class="emap-import-step2-intro">等待文件上传完毕后自动导入数据</p>' +

        '<div class="emap-import-step2-content">' +
        '<div class="emap-import-loading-bar">' +
        '<div></div>' +
        '</div>' +
        '<p class="emap-import-step2-count"></p>' +
        '</div>' +
        '</div>' +
        '</div>' +

        '<div class="emap-import-step ">' +
        '<h5 class="emap-import-step-title">' +
        '<span>3</span>' +
        '完成' +
        '</h5>' +

        '<div class="emap-import-step-content emap-import-step3-content">' +

        '<p class="emap-import-result-detail">该文件全部导入数据10000条，其中失败导入2条</p>' +
        '<p>具体结果可查看<a class="emap-import-export" href="javascript:void(0)">下载导入结果</a>查看明细。</p>' +
        '<button role="closeConfirmBtn" class="bh-btn bh-btn-default bh-btn-small bh-pull-right bh-mh-8 bh-mb-8">确定关闭</button>' +
        '</div>' +
        '</div>' +
        '</div>';
})(jQuery);

/**
 * @fileOverview EMAP条件筛选组件
 * @example
 $('#container').emapQuery({
            contextPath: "/emap"
        })
 */
(function () {
    var Plugin;
    /**
     * @module emapQuery
     * @example
     $('#container').emapQuery({
            contextPath: "/emap"
        })
     */
    Plugin = (function () {
        function Plugin(element, options) {
            this.options = $.extend({}, $.fn.emapQuery.defaults, options);
            this.$element = $(element);
            _init(this);

        }

        /**
         * @method setValue
         * @description 赋值
         * @param {String|Array} val - 搜索条件
         */
        Plugin.prototype.setValue = function (val) {
            var self = this;
            var condition = val;
            if (typeof condition == 'string') {
                condition = JSON.parse(condition);
            }

            $('[emap-role="query-condition-container"]', this.$element).html('');

            condition = _reAdaptCondition(condition);
            condition.map(function (item) {
                _addTag(undefined, self, item);
            });
            var condition_container = $('[emap-role="query-condition-container"]', this.$element)
            if ($('.emap-query-tag', condition_container).length == 0) {
                $(condition_container).closest('.emap-query-condition-wrap').hide();
            } else {
                $(condition_container).closest('.emap-query-condition-wrap').show();
            }
        };

        /**
         * @method getValue
         * @description 赋值
         */
        Plugin.prototype.getValue = function () {
            return _getSearchCondition(this);
        };

        return Plugin;
    })();

    function _init(instance) {
        _renderMain(instance);
        _initSearchForms(instance);

        _initSchema(instance);
        _eventBind(instance);
    }

    // 渲染主体html
    function _renderMain(instance) {
        var element = instance.$element;
        var options = instance.options;
        var main_tpl = '<div class="bh-clearfix">' +  // 搜索框部分
                '<div class="bh-pull-left emap-query-input-wrap">' +
                '<input emap-role="query-input" class="bh-form-control emap-query-input" type="text">' +
                '<i class="iconfont icon-search emap-query-input-icon"></i>' +
                '<span class="emap-query-input-decorator" emap-role="query-input-decorator"></span>' +
                '</div>' +
                '<button type="button" class="bh-btn bh-btn-default bh-mh-8 bh-btn-small" emap-role="query-setting-btn"><i class="iconfont icon-add"></i>设置条件</button>' +
                '<button type="button" class="bh-btn bh-btn-default bh-btn-small" emap-role="query-schema-btn" style="margin-left: 0;"><i class="iconfont icon-edit"></i>搜索方案</button>' +
                '</div>' +

                '<div class="emap-query-form-group emap-query-schema-wrap">' + // 搜索方案部分
                '<label class="emap-query-form-label">搜索方案</label>' +
                '<div emap-role="query-schema-container"></div>' +
                '</div>' +

                '<div emap-role="query-quick-form" class="emap-query-quick-form">' + // button list 表单部分
                '</div>' +

                '<div emap-role="query-advanced-form" class="bh-clearfix emap-query-advanced-form">' + // 展开收起 表单部分
                '</div>' +

                '<p class="emap-query-expand">' +  // 展开收起按钮
                '<a class="emap-query-expand-btn"><i class="iconfont icon-arrowdropdown"></i>查看更多条件</a>' +
                '<a class="emap-query-collapse-btn"><i class="iconfont icon-arrowdropup"></i>收起</a>' +
                '</p>' +

                '<div class="emap-query-condition-wrap" style="display: none;">' + // 当前搜索条件
                '<p class="bh-pull-right">' +
                '<a class="bh-mh-8" emap-role="query-clear-btn">清空</a>' +
                '<a emap-role="query-save-schema-btn">保存为搜索方案</a>' +
                '</p>' +
                '<div class="emap-query-form-group">' +
                '<label class="emap-query-form-label">当前搜索条件</label>' +
                '<div emap-role="query-condition-container"></div>' +
                '</div>' +
                '</div>' +
                '';

        var model = options.data.controls;

        var quickModel = []; // 快速搜索的 字段
        var quickTextField = []; // 搜索框模糊匹配的文本字段
        var buttonListForm = []; // 快速查询的buttonlist 字段
        var advancedForm = [];
        var columns = [];

        options.schemaTpl = '<div class="emap-query-schema-dialog">' +
                '<p class="bh-color-caption bh-text-center emap-schema-none">暂无方案</p>' +
                '<div class="emap-query-schema-add">' +
                '<h4 class="bh-mb-8">新建方案</h4>' +
                '<div>' +
                '<input type="text" emap-role="query-schema-name-input" placeholder="请输入方案名称" class="bh-form-control emap-query-schema-name-input">' +
                '<button type="button" emap-role="query-schema-save-btn" class="bh-btn bh-btn-primary bh-btn-small">保存</button>' +
                '<button type="button" emap-role="query-schema-cancel-btn" class="bh-btn bh-btn-default bh-btn-small">取消</button>' +
                '</div>' +
                '</div>' +
                '<ul class="emap-query-schema-list"></ul>' +
                '</div>';

        options.guid = BH_UTILS.NewGuid();

        model.map(function (item) {
            var attr = WIS_EMAP_SERV.getAttr(item);
            if (item.quickSearch) {
                quickModel.push(item);
            }

            if ((!attr.xtype || attr.xtype == 'text') && item.quickSearch) { // 搜索框模糊匹配的文本字段
                quickTextField.push(item);
            }

            if (attr.xtype == 'buttonlist' || attr.xtype == 'multi-buttonlist') { // 快速查询的buttonlist 字段
                buttonListForm.push(item);
            } else { // 其他字段放入展开收起表单中
                advancedForm.push(item);
            }
        });

        element.html(main_tpl);
        $('[emap-role="query-input"]', element).data('quicktextfield', quickTextField);
        $('[emap-role="query-quick-form"]', element).data('buttonlistform', buttonListForm);
        $('[emap-role="query-advanced-form"]', element).data('advancedform', advancedForm);
        options.quickModel = quickModel;
        options.advancedModel = advancedForm;
        options.searchInput = $('[emap-role="query-input"]', element);

        advancedForm.map(function (item) {
            var hidden = _getSearchAttr(item, 'hidden');
            if (hidden === undefined) hidden = false;
            columns.push({
                name: item.name,
                hidden: hidden
            })
        });
        options.columns = columns;
        _getTextWidth(instance);
    }

    function _initSearchForms(instance) {
        _initSearchInput(instance);
        _initButtonListForm(instance);

    }

    //  初始化 搜索框部分
    function _initSearchInput(instance) {
        var input = $('[emap-role="query-input"]', instance.$element);
        var quickTextField = input.data('quicktextfield');
        var placeHolder = [];

        $('body').append('<div class="emap-query-quick-select" data-guid="' + instance.options.guid + '"></div>');
        if (quickTextField && quickTextField.length > 0) {
            var itemHtml = '<p data-name="_emap_all" emap-role="query-easy-list-item">搜索 <span class="emap-query-easy-caption">全部</span> : <span class="emap-query-easy-query"></span></p>';
            quickTextField.map(function (item) {
                placeHolder.push(item.caption);
                itemHtml += '<p data-name="' + item.name + '" emap-role="query-easy-list-item">搜索 <span class="emap-query-easy-caption">' + item.caption + '</span> : <span class="emap-query-easy-query"></span></p>';
            });
            input.attr('placeholder', placeHolder.join('/'));
            $('.emap-query-quick-select[data-guid="' + instance.options.guid + '"]').html(itemHtml);
        } else {
            console && console.error('未配置快速搜索文本字段!');
        }
    }

    // 初始化 快速查询表单
    function _initButtonListForm(instance) {
        var button_list_form = $('[emap-role="query-quick-form"]', instance.element);
        var button_list_form_model = button_list_form.data('buttonlistform');
        var form_content = [];
        button_list_form_model.map(function (item) {
            var itemHtml = $('<div class="emap-query-form-group"></div>');
            itemHtml.append('<label class="emap-query-form-label">' + item.caption + '</label>');
            $('<div class="emap-query-form-input-container"></div>').append(WIS_EMAP_INPUT.renderPlaceHolder(item)).appendTo(itemHtml);
            form_content.push(itemHtml);
        });
        button_list_form.html(form_content);
        WIS_EMAP_INPUT.init(button_list_form);

    }

    // 初始化 高级表单
    function _initAdvancedForm(instance) {
        var form = $('[emap-role="query-advanced-form"]', instance.element);
        var form_model = form.data('advancedform');
        var form_content = [];
        form_model.map(function (item) {
            if (_getSearchAttr(item, 'hidden')) return;

            form_content.push(_renderAdvancedFormItem(item));
        });
        form.html(form_content);
        WIS_EMAP_INPUT.init(form);
    }

    function _renderAdvancedFormItem(item) {
        var itemHtml = $('<div class="emap-query-form-group emap-advanced bh-pull-left" data-field="' + item.name + '"></div>');
        itemHtml.append('<label class="emap-query-form-label">' + item.caption + '</label>');
        if ($.inArray(item.xtype, _getDoubleWidthField()) > -1) {
            itemHtml.addClass('emap-double-width');
        }
        $('<div class="emap-query-form-input-container"></div>').append(WIS_EMAP_INPUT.renderPlaceHolder(item)).appendTo(itemHtml);
        if (!item.xtype || $.inArray(item.xtype, _getButtonField()) > -1) {
            itemHtml.css({"padding-right": "80px"}).append('<button class="bh-btn bh-btn-default bh-btn-small emap-query-form-btn" emap-role="query-advanced-confirm">确定</button>');
        }
        return itemHtml;
    }

    function _renderAdvancedForm(cols, instance) {
        var options = instance.options;
        var form_array = [];
        var cur_names = options.columns;

        cols.map(function (nameItem, i) {
            var name_hidden = nameItem['hidden'];
            var model_item = cur_names.filter(function (item) {
                return item.name == nameItem.name;
            })[0];
            if (name_hidden !== model_item['hidden']) {
                if (name_hidden) {
                    // 需要移除的字段
                    $('[data-field=' + nameItem.name + ']', options.filter_block).remove();
                } else {
                    // 需要添加的字段
                    form_array.push(_renderAdvancedFormItem(options.advancedModel[i]));
                }
            }
        });
        options.columns = cols;
        $('[emap-role="query-advanced-form"]', instance.$element).append(form_array);
        form_array.map(function (item) {
            $(item).emapFormInputInit({});
        });
    }

    // 带有确认按钮的表单字段
    function _getButtonField() {
        return ['text', 'number-range', 'date-range'];
    }

    // 只能单选的字段
    function _getSingleValueField() {
        return ['text', 'select', 'tree', 'date-local', 'date-ym', 'date-full'];
    }

    // 允许多选的字段
    function _getMultiValueField() {
        return ['multi-select', 'multi-tree'];
    }

    function _getDoubleWidthField() {
        return ['date-range'];
    }

    function _getSearchAttr(item, attr) {
        if (item['search.' + attr] !== undefined) {
            return item['search.' + attr];
        } else {
            return item[attr];
        }
    }

    function _handleFormChangeData(target, instance) {
        var xtype = $(target).attr('xtype');
        _addTag(target, instance);

        if ($.inArray(xtype, _getButtonField()) > -1) {
            // clear input value
            WIS_EMAP_INPUT.formClear($(target).closest('.emap-query-form-group'));
        }
    }

    // 生成tag标签的搜索条件
    function _buildTagCondition(target, instance) {
        var model = instance.options.data.controls;
        var name = $(target).data('name');
        var element = instance.$element;
        var value = {};
        var condition;
        var xtype = 'text';

        if (name == '_emap_all') { // 搜索全部
            value[name] = $('.emap-query-easy-query', $(target)).text();
            condition = [];
            $('[emap-role="query-input"]', element).data('quicktextfield').map(function (item) {
                condition.push({
                    name: item.name,
                    caption: item.caption,
                    builder: item.defaultBuilder,
                    value: value[name],
                    linkOpt: 'OR'
                })
            });
            return condition;
        }
        var itemModel = model.filter(function (item) {
            return item.name == name;
        })[0];

        if ($(target)[0].nodeName == 'P') { // 点击快速下拉进行的搜索
            value[name] = $('.emap-query-easy-query', $(target)).text();
        } else {

            xtype = itemModel['search.xtype'] || itemModel.xtype;
            value = WIS_EMAP_INPUT.formGetValue($(target).closest('.emap-query-form-group'));
        }
        condition = {
            name: name,
            caption: itemModel.caption,
            builder: itemModel.defaultBuilder,
            value: value[name],
            xtype: xtype,
            linkOpt: 'AND'
        };
        if (value[name + '_DISPLAY'] !== undefined) {
            condition.value_display = value[name + '_DISPLAY'];
        }

        return condition;
    }

    // 添加一个搜索条件tag
    function _addTag(target, instance, conditionData) {
        var name;
        var condition;
        if (conditionData) {
            if (conditionData instanceof Array) {
                name = '_emap_all';
            } else {
                name = conditionData.name;
            }
            condition = conditionData;
        } else {
            name = $(target).data('name');
            condition = _buildTagCondition(target, instance);
        }
        if (condition.value === "" || condition.length === 0) return;


        var tag_container = $('[emap-role="query-condition-container"]', instance.$element);
        var tag = $('.emap-query-tag[data-name=' + name + ']');
        if (tag.length > 0) {
            if (name == '_emap_all') {
                tag.html('全部: ' + (condition[0]['value_display'] || condition[0]['value']) +
                        '<i class="iconfont icon-close" emap-role="query-tag-dismiss"></i>')
                        .data({
                            'condition': condition
                        });
            } else {
                tag.html(condition.caption + ': ' + (condition['value_display'] || condition['value']) +
                        '<i class="iconfont icon-close" emap-role="query-tag-dismiss"></i>')
                        .data({
                            'condition': condition
                        });
            }
        } else {
            if (name == '_emap_all') {
                $('<span class="bh-tag emap-query-tag" data-name="' + name + '">全部: ' + (condition[0]['value_display'] || condition[0]['value']) +
                        '<i class="iconfont icon-close" emap-role="query-tag-dismiss"></i>' +
                        '</span>')
                        .data({
                            'condition': condition
                        }).appendTo(tag_container);
            } else {
                $('<span class="bh-tag emap-query-tag" data-name="' + name + '">' + condition.caption + ': ' + (condition['value_display'] || condition['value']) +
                        '<i class="iconfont icon-close" emap-role="query-tag-dismiss"></i>' +
                        '</span>')
                        .data({
                            'condition': condition
                        }).appendTo(tag_container);
            }
        }
        tag_container.closest('.emap-query-condition-wrap').show();
    }

    // 获取字符串基准宽度
    function _getTextWidth(instance) {
        /*生成随机字符串*/
        var guid = BH_UTILS.NewGuid();
        var $obj = instance.$element;
        var options = instance.options;
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
    }

    // 或者字符串实际宽度
    function _getStrWidth(text, instance) {
        var options = instance.options;
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

    // 渲染文本框搜索修饰文字
    function _showSearchDecorator(name, text, instance) {
        var element = instance.$element;
        var options = instance.options;
        var decorator = $('[emap-role=query-input-decorator]', element);
        var left = _getStrWidth(text, instance) + 38;
        if (left > 300) left = 300;
        if ($.trim(text) == '') {
            return decorator.hide().text('');
        }
        decorator.text('(' + name + ')').css('left', left).show();
    }

    // 初始化方案
    function _initSchema(instance) {
        var element = instance.$element;
        var options = instance.options;

        options = $.extend(options, {
            schemaType: "aq"
        });
        $.fn.emapSchema && $(element).emapSchema(options);
        _renderFixedSchema(element, options);
    }

    // 渲染固定的搜索方案
    function _renderFixedSchema(element, options) {
        options.schemaList = element.emapSchema('getSchemaList');
        options.schemaList = options.schemaList ? options.schemaList : [];
        var programContainer = $('.emap-query-schema-wrap', element);

        if (options.schemaList.length > 0) {
            var fixedSchema = options.schemaList.filter(function (val) {
                return val.FIXED == 1;
            });
            if (fixedSchema.length == 0) {
                programContainer.hide();
            } else {
                $(fixedSchema).each(function () {
                    var sch = $('<a  data-name="' + this.SCHEMA_NAME + '" href="javascript:void(0)">' + this.SCHEMA_NAME + '</a>');
                    sch.data('schema', this);
                    $('[emap-role="query-schema-container"]', programContainer).append(sch);
                });
                programContainer.show();
            }
        } else {
            programContainer.hide();
        }
    }

    // 生成搜索条件
    function _getSearchCondition(instance) {
        var conditionContainer = $('[emap-role="query-condition-container"]', instance.$element);
        var condition = [];
        var itemCondition;
        var tags = $('.emap-query-tag', conditionContainer)
        if (tags.length == 0) return '[]';
        tags.each(function () {
            itemCondition = $(this).data('condition');
            if ($(this).data('name') == '_emap_all') {
                itemCondition[0].linkOpt = 'AND';
                condition.push(itemCondition);
            } else {
                itemCondition = _adaptCondition(itemCondition);
                if (itemCondition instanceof Array) {
                    condition = condition.concat(itemCondition);
                } else {
                    condition.push(itemCondition);
                }
            }
        });
        return JSON.stringify(condition);
    }

    function _adaptCondition(condition) {
        if (condition.value.indexOf(',') > -1) { // 多值
            var resultCondition = [];
            condition.value.split(',').map(function (item) {
                var _this = WIS_EMAP_SERV.cloneObj(condition);
                _this.value = item;
                resultCondition.push(_this);
            });

            // 对数字区间字段的特殊处理
            if (condition.xtype == 'number-range' || condition.xtype == 'date-range') {
                resultCondition[0].builder = 'moreEqual';
                resultCondition[1].builder = 'lessEqual';
            }

            return resultCondition;
        } else {
            return condition;
        }
    }

    // 搜索条件反向转换
    function _reAdaptCondition(conditions) {
        var resultArray = [];
        conditions.map(function (item) {
            if (item instanceof Array) {
                resultArray.push(item)
            } else {
                var nameCons = conditions.filter(function (con) {
                    return con.name == item.name;
                });
                if (nameCons.length == 1) {
                    resultArray.push(nameCons[0]);
                } else {
                    item.value = resultArray.map(function (result) {
                        return result.value;
                    }).join(',');
                    if (item['value_display']) {
                        item['value_display'] = resultArray.map(function (result) {
                            return result['value_display'];
                        }).join(',');
                    }
                    resultArray.push(item);
                }

            }
        });
        return resultArray;
    }

    function _renderSchemaList(container, options) {
        if (options.schemaList.length == 0) {
            $(container).addClass('emap-none');
        } else {
            var schemaUl = $('ul.emap-query-schema-list', container).html("");
            options.schemaList.map(function (item) {
                var itemHtml = $('<li class="emap-query-schema-li" data-name="' + item.SCHEMA_NAME + '">' +
                        '<a href="javascript:void(0)" class="bh-pull-right" emap-role="query-schema-delete">删除</a>' +
                        '<a href="javascript:void(0)" class="bh-pull-right bh-mh-8" emap-role="query-schema-unfixed">取消置顶</a>' +
                        '<a href="javascript:void(0)" class="bh-pull-right bh-mh-8" emap-role="query-schema-fixed">置顶</a>' +
                        '<i class="iconfont icon-publish"></i>' +
                        '<i class="iconfont icon-turnedinnot"></i>' +
                        item.SCHEMA_NAME +
                        '</li>').data('schema', item);
                if (item.FIXED == "1") {
                    itemHtml.addClass('emap-fixed');
                }
                schemaUl.append(itemHtml);
                schemaUl.prepend($('.emap-fixed', schemaUl));

            });
            $('.emap-query-schema-dialog', container).removeClass('emap-none');
        }
    }

    // 方案弹窗事件绑定
    function _schemaDialogEventBind(container, instance) {
        // 确定保存为方案
        container.on('click', '[emap-role="query-schema-save-btn"]', function () {
            var name = $('[emap-role="query-schema-name-input"]', container).val();
            if($.trim(name) === "") return;
            var condition = _getSearchCondition(instance);
            instance.$element.emapSchema('saveSchema', [name, condition]).done(function (res) {
                if (res.success == true) {
                    $('.emap-query-schema-add', container).hide();
                    instance.options.schemaList.push({
                        SCHEMA_NAME: name,
                        CONTENT: condition
                    });
                    _renderSchemaList(container, instance.options);
                }
            })
        });

        // 取消保存为方案
        container.on('click', '[emap-role="query-schema-cancel-btn"]', function () {
            $.bhPropertyDialog.hide();
        });

        // 置顶
        container.on('click', '[emap-role="query-schema-fixed"]', function (e) {
            e.stopPropagation();
            var li = $(this).closest('li');
            var name = li.data('schema').SCHEMA_NAME;
            var conditionData = li.data('schema').CONTENT;
            instance.$element.emapSchema('saveSchema', [name, conditionData, 1]).done(function (res) {
                li.addClass('emap-fixed');
                li.parent().prepend(li);
            })
        });

        // 取消置顶
        container.on('click', '[emap-role="query-schema-unfixed"]', function (e) {
            e.stopPropagation();
            var li = $(this).closest('li');
            var name = li.data('schema').SCHEMA_NAME;
            var conditionData = li.data('schema').CONTENT;
            instance.$element.emapSchema('saveSchema', [name, conditionData, 0]).done(function (res) {
                li.removeClass('emap-fixed');
                li.parent().append(li);
            })
        });

        // 删除方案
        container.on('click', '[emap-role="query-schema-delete"]', function (e) {
            e.stopPropagation();
            var li = $(this).closest('li');
            var name = li.data('schema').SCHEMA_NAME;
            var dialog = $(this).closest('.emap-query-schema-dialog');
            if (instance.$element.emapSchema('deleteSchema', name)) {
                li.remove();
                $('.bh-rules-program', instance.$element).find('[data-name=' + name + ']').remove();
                $(instance.options.schemaList).each(function (i) {
                    if (this.SCHEMA_NAME == name) {
                        instance.options.schemaList.splice(i, 1);
                    }
                });
                if (instance.options.schemaList.length == 0) {
                    dialog.addClass('emap-none');
                }
            }
        });

        // 点击搜索方案
        container.on('click', 'li.emap-query-schema-li', function () {
            var condition = $(this).data('schema').CONTENT;
            instance.$element.emapQuery('setValue', condition);
            instance.options.searchInput.trigger('search', condition);
        });
    }

    // 事件绑定
    function _eventBind(instance) {
        var element = instance.$element;
        var options = instance.options;
        // 搜索框输入事件
        element.on('keyup', '[emap-role="query-input"]', function (e) {
            var easySelectH = ($(this).data('quicktextfield').length + 1) * 28 + 1; // 下拉框高度
            var easySelectW = $(this).outerWidth(); // 下拉框宽度
            var searchValue = $(this).val();
            var pos = $(this).offset();
            var selectDiv = $('.emap-query-quick-select[data-guid=' + options.guid + ']');
            pos.top += 28;

            // 回车快速搜索
            if (e.keyCode == 13) {
                selectDiv.css({
                    'height': 0,
                    'border-width': '0'
                });
                element.trigger('search', [_getSearchCondition(options), options, e]);
                return;
            }

            if (searchValue == '') {
                selectDiv.css({
                    'height': 0,
                    'border-width': '0'
                });
            } else {
                $('.emap-query-easy-query', selectDiv).html(searchValue);
                selectDiv.css({
                    'height': easySelectH + 'px',
                    'width': easySelectW + 'px',
                    'border-width': '1px',
                    'top': pos.top,
                    'left': pos.left
                });
            }
        });

        // 点击空白区 收起下拉
        $(document).off('click.emapQuery').on('click.emapQuery', function (e) {
            if ($(e.target).closest('.emap-query-quick-select').length == 0) {
                $('.emap-query-quick-select[data-guid=' + options.guid + ']').css({
                    'height': 0,
                    'border-width': '0'
                });
            }
        });

        // 点击展开收起
        element.on('click', '.emap-query-expand a', function () {
            var parent = $(this).parent();
            if (parent.hasClass('emap-expand')) {
                parent.removeClass('emap-expand');
                $('[emap-role="query-advanced-form"]', element).hide();
            } else {
                parent.addClass('emap-expand');
                $('[emap-role="query-advanced-form"]', element).show();
            }
        });

        // 首次点击展开 实例化高级表单
        element.one('click', '.emap-query-expand a.emap-query-expand-btn', function () {
            _initAdvancedForm(instance);
        });

        // 搜索条件的添加
        element.on('_formChange', function (e, targetInput) {
            var target = e.target;
            var xtype = $(target).attr('xtype');
            if ($.inArray(xtype, _getButtonField()) > -1) {
                if (!targetInput) return;
                _handleFormChangeData(targetInput, instance);
            } else {
                _handleFormChangeData(target, instance);
            }

            options.searchInput.trigger('search', _getSearchCondition(instance));
        });

        // 点击叉叉移除搜索条件
        element.on('click', 'i[emap-role="query-tag-dismiss"]', function () {
            $(this).closest('.emap-query-tag').remove();
            var container = $(this).closest('[emap-role="query-condition-container"]');
            if ($('.emap-query-tag', container).length == 0) {
                container.closest('.emap-query-condition-wrap').hide();
            }
            instance.options.searchInput.trigger('search', condition);
        });

        // 点击表单控件的确认按钮, 触发 _formChange 事件
        element.on('click', '[emap-role="query-advanced-confirm"]', function () {
            var input = $(this).closest('.emap-query-form-group').find('[xtype]');
            input.trigger('_formChange', [input]);
        });

        // 点击顶部搜索框的下拉 执行相应的搜索
        $('.emap-query-quick-select[data-guid=' + options.guid + ']').on('click', '[emap-role="query-easy-list-item"]', function () {
            _addTag($(this), instance);
            $(this).closest('.emap-query-quick-select').css({
                'height': 0,
                'border-width': '0'
            });
            _showSearchDecorator($('.emap-query-easy-caption', $(this)).text(), $('.emap-query-easy-query', $(this)).text(), instance);
            options.searchInput.trigger('search', _getSearchCondition(instance));
        });

        // decorator 点击自动focus 搜索框
        $('[emap-role="query-input-decorator"]', element).on('click', function () {
            $(this).hide();
            $('[emap-role="query-input"]', element).focus();
        });

        // 文本框 获取焦点 隐藏decorator
        $('[emap-role="query-input"]', element).focus(function () {
            $('[emap-role="query-input-decorator"]', element).hide();
        }).blur(function () {
            if ($.trim($(this).val()) != '') {
                $('[emap-role="query-input-decorator"]', element).show();
            }
        }).on('input', function () {
            $('[emap-role="query-input-decorator"]', element).text('');
        });

        // 点击设置条件
        element.on('click', '[emap-role="query-setting-btn"]', function () {
            var modelArray = options.advancedModel;
            var columns = options.columns;
            $('.emap-query-expand a.emap-query-expand-btn', element).trigger('click');
            $.bhCustomizeColumn({
                model: modelArray,
                columns: columns,
                title: '添加搜索字段',
                callback: function (cols) {
                    _renderAdvancedForm(cols, instance);
                }
            });
        });

        // 点击清空搜索条件
        element.on('click', '[emap-role="query-clear-btn"]', function () {
            var wrap = $(this).closest('.emap-query-condition-wrap')
            wrap.find('[emap-role="query-condition-container"]').html('');
            wrap.hide();
        });

        // 点击保存为搜索方案
        element.on('click', '[emap-role="query-save-schema-btn"]', function () {
            $.bhPropertyDialog.show({
                "title": "搜索方案",
                "content": options.schemaTpl,
                "ready": function ($header, $section, $footer) {
                    _renderSchemaList($section, options);
                    $section.removeClass('emap-none');
                    $('.emap-query-schema-add', $section).show();
                    _schemaDialogEventBind($section, instance);
                }
            });
        });

        // 点击搜索方案
        element.on('click', '[emap-role="query-schema-btn"]', function () {
            $.bhPropertyDialog.show({
                "title": "搜索方案",
                "content": options.schemaTpl,
                "ready": function ($header, $section, $footer) {
                    _renderSchemaList($section, options);
                    _schemaDialogEventBind($section, instance);
                }
            });
        });

        // 点击搜索栏下方的方案名称
        element.on('click', '[emap-role="query-schema-container"] a', function () {
            var condition = $(this).data('schema').CONTENT;
            instance.$element.emapQuery('setValue', condition);
            instance.options.searchInput.trigger('search', condition);
        })
    }

    $.fn.emapQuery = function (options, param) {
        var instance;
        instance = this.data('emapquery');
        if (!instance) {
            return this.each(function () {
                return $(this).data('emapquery', new Plugin(this, options));
            });
        }
        if (options === true) return instance;
        if ($.type(options) === 'string') return instance[options](param);
        return this;
    };

    /**
     * @memberof module:emapQuery
     * @prop {Object} data - 搜索数据模型
     * @prop {String}  contextPath - emap根路径
     * @prop {Boolean} [expanded=false] - 是否自动展开
     * @prop {Function} onSearch - 搜索回调
     * @prop {Function} beforeRender - 渲染前的回调,需要返回数据模型
     */

    $.fn.emapQuery.defaults = {
        expanded: false,
        onSearch: undefined,
        beforeRender: undefined
    };
}).call(this);


/**!
 * Sortable
 * @author  RubaXa   <trash@rubaxa.org>
 * @license MIT
 */
(function() {
    "use strict";

    if (typeof window == "undefined" || !window.document) {
        return function sortableError() {
            throw new Error("Sortable.js requires a window with a document");
        };
    }

    var dragEl,
        parentEl,
        ghostEl,
        cloneEl,
        rootEl,
        nextEl,

        scrollEl,
        scrollParentEl,
        scrollCustomFn,

        lastEl,
        lastCSS,
        lastParentCSS,

        oldIndex,
        newIndex,

        activeGroup,
        putSortable,

        autoScroll = {},

        tapEvt,
        touchEvt,

        moved,

        /** @const */
        RSPACE = /\s+/g,

        expando = 'Sortable' + (new Date).getTime(),

        win = window,
        document = win.document,
        parseInt = win.parseInt,

        $ = win.jQuery || win.Zepto,
        Polymer = win.Polymer,

        supportDraggable = !!('draggable' in document.createElement('div')),
        supportCssPointerEvents = (function (el) {
            // false when IE11
            if (!!navigator.userAgent.match(/Trident.*rv[ :]?11\./)) {
                return false;
            }
            el = document.createElement('x');
            el.style.cssText = 'pointer-events:auto';
            return el.style.pointerEvents === 'auto';
        })(),

        _silent = false,

        abs = Math.abs,
        min = Math.min,
        slice = [].slice,

        touchDragOverListeners = [],

        _autoScroll = _throttle(function (/**Event*/evt, /**Object*/options, /**HTMLElement*/rootEl) {
            // Bug: https://bugzilla.mozilla.org/show_bug.cgi?id=505521
            if (rootEl && options.scroll) {
                var el,
                    rect,
                    sens = options.scrollSensitivity,
                    speed = options.scrollSpeed,

                    x = evt.clientX,
                    y = evt.clientY,

                    winWidth = window.innerWidth,
                    winHeight = window.innerHeight,

                    vx,
                    vy,

                    scrollOffsetX,
                    scrollOffsetY
                ;

                // Delect scrollEl
                if (scrollParentEl !== rootEl) {
                    scrollEl = options.scroll;
                    scrollParentEl = rootEl;
                    scrollCustomFn = options.scrollFn;

                    if (scrollEl === true) {
                        scrollEl = rootEl;

                        do {
                            if ((scrollEl.offsetWidth < scrollEl.scrollWidth) ||
                                (scrollEl.offsetHeight < scrollEl.scrollHeight)
                            ) {
                                break;
                            }
                            /* jshint boss:true */
                        } while (scrollEl = scrollEl.parentNode);
                    }
                }

                if (scrollEl) {
                    el = scrollEl;
                    rect = scrollEl.getBoundingClientRect();
                    vx = (abs(rect.right - x) <= sens) - (abs(rect.left - x) <= sens);
                    vy = (abs(rect.bottom - y) <= sens) - (abs(rect.top - y) <= sens);
                }


                if (!(vx || vy)) {
                    vx = (winWidth - x <= sens) - (x <= sens);
                    vy = (winHeight - y <= sens) - (y <= sens);

                    /* jshint expr:true */
                    (vx || vy) && (el = win);
                }


                if (autoScroll.vx !== vx || autoScroll.vy !== vy || autoScroll.el !== el) {
                    autoScroll.el = el;
                    autoScroll.vx = vx;
                    autoScroll.vy = vy;

                    clearInterval(autoScroll.pid);

                    if (el) {
                        autoScroll.pid = setInterval(function () {
                            scrollOffsetY = vy ? vy * speed : 0;
                            scrollOffsetX = vx ? vx * speed : 0;

                            if ('function' === typeof(scrollCustomFn)) {
                                return scrollCustomFn.call(_this, scrollOffsetX, scrollOffsetY, evt);
                            }

                            if (el === win) {
                                win.scrollTo(win.pageXOffset + scrollOffsetX, win.pageYOffset + scrollOffsetY);
                            } else {
                                el.scrollTop += scrollOffsetY;
                                el.scrollLeft += scrollOffsetX;
                            }
                        }, 24);
                    }
                }
            }
        }, 30),

        _prepareGroup = function (options) {
            function toFn(value, pull) {
                if (value === void 0 || value === true) {
                    value = group.name;
                }

                if (typeof value === 'function') {
                    return value;
                } else {
                    return function (to, from) {
                        var fromGroup = from.options.group.name;

                        return pull
                            ? value
                            : value && (value.join
                                ? value.indexOf(fromGroup) > -1
                                : (fromGroup == value)
                            );
                    };
                }
            }

            var group = {};
            var originalGroup = options.group;

            if (!originalGroup || typeof originalGroup != 'object') {
                originalGroup = {name: originalGroup};
            }

            group.name = originalGroup.name;
            group.checkPull = toFn(originalGroup.pull, true);
            group.checkPut = toFn(originalGroup.put);

            options.group = group;
        }
    ;



    /**
     * @class  Sortable
     * @param  {HTMLElement}  el
     * @param  {Object}       [options]
     */
    function Sortable(el, options) {
        if (!(el && el.nodeType && el.nodeType === 1)) {
            throw 'Sortable: `el` must be HTMLElement, and not ' + {}.toString.call(el);
        }

        this.el = el; // root element
        this.options = options = _extend({}, options);


        // Export instance
        el[expando] = this;


        // Default options
        var defaults = {
            group: Math.random(),
            sort: true,
            disabled: false,
            store: null,
            handle: null,
            scroll: true,
            scrollSensitivity: 30,
            scrollSpeed: 10,
            draggable: /[uo]l/i.test(el.nodeName) ? 'li' : '>*',
            ghostClass: 'sortable-ghost',
            chosenClass: 'sortable-chosen',
            dragClass: 'sortable-drag',
            ignore: 'a, img',
            filter: null,
            animation: 0,
            setData: function (dataTransfer, dragEl) {
                dataTransfer.setData('Text', dragEl.textContent);
            },
            dropBubble: false,
            dragoverBubble: false,
            dataIdAttr: 'data-id',
            delay: 0,
            forceFallback: false,
            fallbackClass: 'sortable-fallback',
            fallbackOnBody: false,
            fallbackTolerance: 0,
            fallbackOffset: {x: 0, y: 0}
        };


        // Set default options
        for (var name in defaults) {
            !(name in options) && (options[name] = defaults[name]);
        }

        _prepareGroup(options);

        // Bind all private methods
        for (var fn in this) {
            if (fn.charAt(0) === '_' && typeof this[fn] === 'function') {
                this[fn] = this[fn].bind(this);
            }
        }

        // Setup drag mode
        this.nativeDraggable = options.forceFallback ? false : supportDraggable;

        // Bind events
        _on(el, 'mousedown', this._onTapStart);
        _on(el, 'touchstart', this._onTapStart);

        if (this.nativeDraggable) {
            _on(el, 'dragover', this);
            _on(el, 'dragenter', this);
        }

        touchDragOverListeners.push(this._onDragOver);

        // Restore sorting
        options.store && this.sort(options.store.get(this));
    }


    Sortable.prototype = /** @lends Sortable.prototype */ {
        constructor: Sortable,

        _onTapStart: function (/** Event|TouchEvent */evt) {
            var _this = this,
                el = this.el,
                options = this.options,
                type = evt.type,
                touch = evt.touches && evt.touches[0],
                target = (touch || evt).target,
                originalTarget = evt.target.shadowRoot && evt.path[0] || target,
                filter = options.filter,
                startIndex;

            // Don't trigger start event when an element is been dragged, otherwise the evt.oldindex always wrong when set option.group.
            if (dragEl) {
                return;
            }

            if (type === 'mousedown' && evt.button !== 0 || options.disabled) {
                return; // only left button or enabled
            }

            if (options.handle && !_closest(originalTarget, options.handle, el)) {
                return;
            }

            target = _closest(target, options.draggable, el);

            if (!target) {
                return;
            }

            // Get the index of the dragged element within its parent
            startIndex = _index(target, options.draggable);

            // Check filter
            if (typeof filter === 'function') {
                if (filter.call(this, evt, target, this)) {
                    _dispatchEvent(_this, originalTarget, 'filter', target, el, startIndex);
                    evt.preventDefault();
                    return; // cancel dnd
                }
            }
            else if (filter) {
                filter = filter.split(',').some(function (criteria) {
                    criteria = _closest(originalTarget, criteria.trim(), el);

                    if (criteria) {
                        _dispatchEvent(_this, criteria, 'filter', target, el, startIndex);
                        return true;
                    }
                });

                if (filter) {
                    evt.preventDefault();
                    return; // cancel dnd
                }
            }

            // Prepare `dragstart`
            this._prepareDragStart(evt, touch, target, startIndex);
        },

        _prepareDragStart: function (/** Event */evt, /** Touch */touch, /** HTMLElement */target, /** Number */startIndex) {
            var _this = this,
                el = _this.el,
                options = _this.options,
                ownerDocument = el.ownerDocument,
                dragStartFn;

            if (target && !dragEl && (target.parentNode === el)) {
                tapEvt = evt;

                rootEl = el;
                dragEl = target;
                parentEl = dragEl.parentNode;
                nextEl = dragEl.nextSibling;
                activeGroup = options.group;
                oldIndex = startIndex;

                this._lastX = (touch || evt).clientX;
                this._lastY = (touch || evt).clientY;

                dragEl.style['will-change'] = 'transform';

                dragStartFn = function () {
                    // Delayed drag has been triggered
                    // we can re-enable the events: touchmove/mousemove
                    _this._disableDelayedDrag();

                    // Make the element draggable
                    dragEl.draggable = _this.nativeDraggable;

                    // Chosen item
                    _toggleClass(dragEl, options.chosenClass, true);

                    // Bind the events: dragstart/dragend
                    _this._triggerDragStart(touch);

                    // Drag start event
                    _dispatchEvent(_this, rootEl, 'choose', dragEl, rootEl, oldIndex);
                };

                // Disable "draggable"
                options.ignore.split(',').forEach(function (criteria) {
                    _find(dragEl, criteria.trim(), _disableDraggable);
                });

                _on(ownerDocument, 'mouseup', _this._onDrop);
                _on(ownerDocument, 'touchend', _this._onDrop);
                _on(ownerDocument, 'touchcancel', _this._onDrop);

                if (options.delay) {
                    // If the user moves the pointer or let go the click or touch
                    // before the delay has been reached:
                    // disable the delayed drag
                    _on(ownerDocument, 'mouseup', _this._disableDelayedDrag);
                    _on(ownerDocument, 'touchend', _this._disableDelayedDrag);
                    _on(ownerDocument, 'touchcancel', _this._disableDelayedDrag);
                    _on(ownerDocument, 'mousemove', _this._disableDelayedDrag);
                    _on(ownerDocument, 'touchmove', _this._disableDelayedDrag);

                    _this._dragStartTimer = setTimeout(dragStartFn, options.delay);
                } else {
                    dragStartFn();
                }
            }
        },

        _disableDelayedDrag: function () {
            var ownerDocument = this.el.ownerDocument;

            clearTimeout(this._dragStartTimer);
            _off(ownerDocument, 'mouseup', this._disableDelayedDrag);
            _off(ownerDocument, 'touchend', this._disableDelayedDrag);
            _off(ownerDocument, 'touchcancel', this._disableDelayedDrag);
            _off(ownerDocument, 'mousemove', this._disableDelayedDrag);
            _off(ownerDocument, 'touchmove', this._disableDelayedDrag);
        },

        _triggerDragStart: function (/** Touch */touch) {
            if (touch) {
                // Touch device support
                tapEvt = {
                    target: dragEl,
                    clientX: touch.clientX,
                    clientY: touch.clientY
                };

                this._onDragStart(tapEvt, 'touch');
            }
            else if (!this.nativeDraggable) {
                this._onDragStart(tapEvt, true);
            }
            else {
                _on(dragEl, 'dragend', this);
                _on(rootEl, 'dragstart', this._onDragStart);
            }

            try {
                if (document.selection) {
                    // Timeout neccessary for IE9
                    setTimeout(function () {
                        document.selection.empty();
                    });
                } else {
                    window.getSelection().removeAllRanges();
                }
            } catch (err) {
            }
        },

        _dragStarted: function () {
            if (rootEl && dragEl) {
                var options = this.options;

                // Apply effect
                _toggleClass(dragEl, options.ghostClass, true);
                _toggleClass(dragEl, options.dragClass, false);

                Sortable.active = this;

                // Drag start event
                _dispatchEvent(this, rootEl, 'start', dragEl, rootEl, oldIndex);
            }
        },

        _emulateDragOver: function () {
            if (touchEvt) {
                if (this._lastX === touchEvt.clientX && this._lastY === touchEvt.clientY) {
                    return;
                }

                this._lastX = touchEvt.clientX;
                this._lastY = touchEvt.clientY;

                if (!supportCssPointerEvents) {
                    _css(ghostEl, 'display', 'none');
                }

                var target = document.elementFromPoint(touchEvt.clientX, touchEvt.clientY),
                    parent = target,
                    i = touchDragOverListeners.length;

                if (parent) {
                    do {
                        if (parent[expando]) {
                            while (i--) {
                                touchDragOverListeners[i]({
                                    clientX: touchEvt.clientX,
                                    clientY: touchEvt.clientY,
                                    target: target,
                                    rootEl: parent
                                });
                            }

                            break;
                        }

                        target = parent; // store last element
                    }
                    /* jshint boss:true */
                    while (parent = parent.parentNode);
                }

                if (!supportCssPointerEvents) {
                    _css(ghostEl, 'display', '');
                }
            }
        },


        _onTouchMove: function (/**TouchEvent*/evt) {
            if (tapEvt) {
                var options = this.options,
                    fallbackTolerance = options.fallbackTolerance,
                    fallbackOffset = options.fallbackOffset,
                    touch = evt.touches ? evt.touches[0] : evt,
                    dx = (touch.clientX - tapEvt.clientX) + fallbackOffset.x,
                    dy = (touch.clientY - tapEvt.clientY) + fallbackOffset.y,
                    translate3d = evt.touches ? 'translate3d(' + dx + 'px,' + dy + 'px,0)' : 'translate(' + dx + 'px,' + dy + 'px)';

                // only set the status to dragging, when we are actually dragging
                if (!Sortable.active) {
                    if (fallbackTolerance &&
                        min(abs(touch.clientX - this._lastX), abs(touch.clientY - this._lastY)) < fallbackTolerance
                    ) {
                        return;
                    }

                    this._dragStarted();
                }

                // as well as creating the ghost element on the document body
                this._appendGhost();

                moved = true;
                touchEvt = touch;

                _css(ghostEl, 'webkitTransform', translate3d);
                _css(ghostEl, 'mozTransform', translate3d);
                _css(ghostEl, 'msTransform', translate3d);
                _css(ghostEl, 'transform', translate3d);

                evt.preventDefault();
            }
        },

        _appendGhost: function () {
            if (!ghostEl) {
                var rect = dragEl.getBoundingClientRect(),
                    css = _css(dragEl),
                    options = this.options,
                    ghostRect;

                ghostEl = dragEl.cloneNode(true);

                _toggleClass(ghostEl, options.ghostClass, false);
                _toggleClass(ghostEl, options.fallbackClass, true);
                _toggleClass(ghostEl, options.dragClass, true);

                _css(ghostEl, 'top', rect.top - parseInt(css.marginTop, 10));
                _css(ghostEl, 'left', rect.left - parseInt(css.marginLeft, 10));
                _css(ghostEl, 'width', rect.width);
                _css(ghostEl, 'height', rect.height);
                _css(ghostEl, 'opacity', '0.8');
                _css(ghostEl, 'position', 'fixed');
                _css(ghostEl, 'zIndex', '100000');
                _css(ghostEl, 'pointerEvents', 'none');

                options.fallbackOnBody && document.body.appendChild(ghostEl) || rootEl.appendChild(ghostEl);

                // Fixing dimensions.
                ghostRect = ghostEl.getBoundingClientRect();
                _css(ghostEl, 'width', rect.width * 2 - ghostRect.width);
                _css(ghostEl, 'height', rect.height * 2 - ghostRect.height);
            }
        },

        _onDragStart: function (/**Event*/evt, /**boolean*/useFallback) {
            var dataTransfer = evt.dataTransfer,
                options = this.options;

            this._offUpEvents();

            if (activeGroup.checkPull(this, this, dragEl, evt) == 'clone') {
                cloneEl = _clone(dragEl);
                _css(cloneEl, 'display', 'none');
                rootEl.insertBefore(cloneEl, dragEl);
                _dispatchEvent(this, rootEl, 'clone', dragEl);
            }

            _toggleClass(dragEl, options.dragClass, true);

            if (useFallback) {
                if (useFallback === 'touch') {
                    // Bind touch events
                    _on(document, 'touchmove', this._onTouchMove);
                    _on(document, 'touchend', this._onDrop);
                    _on(document, 'touchcancel', this._onDrop);
                } else {
                    // Old brwoser
                    _on(document, 'mousemove', this._onTouchMove);
                    _on(document, 'mouseup', this._onDrop);
                }

                this._loopId = setInterval(this._emulateDragOver, 50);
            }
            else {
                if (dataTransfer) {
                    dataTransfer.effectAllowed = 'move';
                    options.setData && options.setData.call(this, dataTransfer, dragEl);
                }

                _on(document, 'drop', this);
                setTimeout(this._dragStarted, 0);
            }
        },

        _onDragOver: function (/**Event*/evt) {
            var el = this.el,
                target,
                dragRect,
                targetRect,
                revert,
                options = this.options,
                group = options.group,
                activeSortable = Sortable.active,
                isOwner = (activeGroup === group),
                canSort = options.sort;

            if (evt.preventDefault !== void 0) {
                evt.preventDefault();
                !options.dragoverBubble && evt.stopPropagation();
            }

            moved = true;

            if (activeGroup && !options.disabled &&
                (isOwner
                    ? canSort || (revert = !rootEl.contains(dragEl)) // Reverting item into the original list
                    : (
                        putSortable === this ||
                        activeGroup.checkPull(this, activeSortable, dragEl, evt) && group.checkPut(this, activeSortable, dragEl, evt)
                    )
                ) &&
                (evt.rootEl === void 0 || evt.rootEl === this.el) // touch fallback
            ) {
                // Smart auto-scrolling
                _autoScroll(evt, options, this.el);

                if (_silent) {
                    return;
                }

                target = _closest(evt.target, options.draggable, el);
                dragRect = dragEl.getBoundingClientRect();
                putSortable = this;

                if (revert) {
                    _cloneHide(true);
                    parentEl = rootEl; // actualization

                    if (cloneEl || nextEl) {
                        rootEl.insertBefore(dragEl, cloneEl || nextEl);
                    }
                    else if (!canSort) {
                        rootEl.appendChild(dragEl);
                    }

                    return;
                }


                if ((el.children.length === 0) || (el.children[0] === ghostEl) ||
                    (el === evt.target) && (target = _ghostIsLast(el, evt))
                ) {
                    if (target) {
                        if (target.animated) {
                            return;
                        }

                        targetRect = target.getBoundingClientRect();
                    }

                    _cloneHide(isOwner);

                    if (_onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt) !== false) {
                        if (!dragEl.contains(el)) {
                            el.appendChild(dragEl);
                            parentEl = el; // actualization
                        }

                        this._animate(dragRect, dragEl);
                        target && this._animate(targetRect, target);
                    }
                }
                else if (target && !target.animated && target !== dragEl && (target.parentNode[expando] !== void 0)) {
                    if (lastEl !== target) {
                        lastEl = target;
                        lastCSS = _css(target);
                        lastParentCSS = _css(target.parentNode);
                    }

                    targetRect = target.getBoundingClientRect();

                    var width = targetRect.right - targetRect.left,
                        height = targetRect.bottom - targetRect.top,
                        floating = /left|right|inline/.test(lastCSS.cssFloat + lastCSS.display)
                            || (lastParentCSS.display == 'flex' && lastParentCSS['flex-direction'].indexOf('row') === 0),
                        isWide = (target.offsetWidth > dragEl.offsetWidth),
                        isLong = (target.offsetHeight > dragEl.offsetHeight),
                        halfway = (floating ? (evt.clientX - targetRect.left) / width : (evt.clientY - targetRect.top) / height) > 0.5,
                        nextSibling = target.nextElementSibling,
                        moveVector = _onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt),
                        after
                    ;

                    if (moveVector !== false) {
                        _silent = true;
                        setTimeout(_unsilent, 30);

                        _cloneHide(isOwner);

                        if (moveVector === 1 || moveVector === -1) {
                            after = (moveVector === 1);
                        }
                        else if (floating) {
                            var elTop = dragEl.offsetTop,
                                tgTop = target.offsetTop;

                            if (elTop === tgTop) {
                                after = (target.previousElementSibling === dragEl) && !isWide || halfway && isWide;
                            }
                            else if (target.previousElementSibling === dragEl || dragEl.previousElementSibling === target) {
                                after = (evt.clientY - targetRect.top) / height > 0.5;
                            } else {
                                after = tgTop > elTop;
                            }
                        } else {
                            after = (nextSibling !== dragEl) && !isLong || halfway && isLong;
                        }

                        if (!dragEl.contains(el)) {
                            if (after && !nextSibling) {
                                el.appendChild(dragEl);
                            } else {
                                target.parentNode.insertBefore(dragEl, after ? nextSibling : target);
                            }
                        }

                        parentEl = dragEl.parentNode; // actualization

                        this._animate(dragRect, dragEl);
                        this._animate(targetRect, target);
                    }
                }
            }
        },

        _animate: function (prevRect, target) {
            var ms = this.options.animation;

            if (ms) {
                var currentRect = target.getBoundingClientRect();

                _css(target, 'transition', 'none');
                _css(target, 'transform', 'translate3d('
                    + (prevRect.left - currentRect.left) + 'px,'
                    + (prevRect.top - currentRect.top) + 'px,0)'
                );

                target.offsetWidth; // repaint

                _css(target, 'transition', 'all ' + ms + 'ms');
                _css(target, 'transform', 'translate3d(0,0,0)');

                clearTimeout(target.animated);
                target.animated = setTimeout(function () {
                    _css(target, 'transition', '');
                    _css(target, 'transform', '');
                    target.animated = false;
                }, ms);
            }
        },

        _offUpEvents: function () {
            var ownerDocument = this.el.ownerDocument;

            _off(document, 'touchmove', this._onTouchMove);
            _off(ownerDocument, 'mouseup', this._onDrop);
            _off(ownerDocument, 'touchend', this._onDrop);
            _off(ownerDocument, 'touchcancel', this._onDrop);
        },

        _onDrop: function (/**Event*/evt) {
            var el = this.el,
                options = this.options;

            clearInterval(this._loopId);
            clearInterval(autoScroll.pid);
            clearTimeout(this._dragStartTimer);

            // Unbind events
            _off(document, 'mousemove', this._onTouchMove);

            if (this.nativeDraggable) {
                _off(document, 'drop', this);
                _off(el, 'dragstart', this._onDragStart);
            }

            this._offUpEvents();

            if (evt) {
                if (moved) {
                    evt.preventDefault();
                    !options.dropBubble && evt.stopPropagation();
                }

                ghostEl && ghostEl.parentNode.removeChild(ghostEl);

                if (dragEl) {
                    if (this.nativeDraggable) {
                        _off(dragEl, 'dragend', this);
                    }

                    _disableDraggable(dragEl);
                    dragEl.style['will-change'] = '';

                    // Remove class's
                    _toggleClass(dragEl, this.options.ghostClass, false);
                    _toggleClass(dragEl, this.options.chosenClass, false);

                    if (rootEl !== parentEl) {
                        newIndex = _index(dragEl, options.draggable);

                        if (newIndex >= 0) {

                            // Add event
                            _dispatchEvent(null, parentEl, 'add', dragEl, rootEl, oldIndex, newIndex);

                            // Remove event
                            _dispatchEvent(this, rootEl, 'remove', dragEl, rootEl, oldIndex, newIndex);

                            // drag from one list and drop into another
                            _dispatchEvent(null, parentEl, 'sort', dragEl, rootEl, oldIndex, newIndex);
                            _dispatchEvent(this, rootEl, 'sort', dragEl, rootEl, oldIndex, newIndex);
                        }
                    }
                    else {
                        // Remove clone
                        cloneEl && cloneEl.parentNode.removeChild(cloneEl);

                        if (dragEl.nextSibling !== nextEl) {
                            // Get the index of the dragged element within its parent
                            newIndex = _index(dragEl, options.draggable);

                            if (newIndex >= 0) {
                                // drag & drop within the same list
                                _dispatchEvent(this, rootEl, 'update', dragEl, rootEl, oldIndex, newIndex);
                                _dispatchEvent(this, rootEl, 'sort', dragEl, rootEl, oldIndex, newIndex);
                            }
                        }
                    }

                    if (Sortable.active) {
                        /* jshint eqnull:true */
                        if (newIndex == null || newIndex === -1) {
                            newIndex = oldIndex;
                        }

                        _dispatchEvent(this, rootEl, 'end', dragEl, rootEl, oldIndex, newIndex);

                        // Save sorting
                        this.save();
                    }
                }

            }

            this._nulling();
        },

        _nulling: function() {
            rootEl =
            dragEl =
            parentEl =
            ghostEl =
            nextEl =
            cloneEl =

            scrollEl =
            scrollParentEl =

            tapEvt =
            touchEvt =

            moved =
            newIndex =

            lastEl =
            lastCSS =

            putSortable =
            activeGroup =
            Sortable.active = null;
        },

        handleEvent: function (/**Event*/evt) {
            var type = evt.type;

            if (type === 'dragover' || type === 'dragenter') {
                if (dragEl) {
                    this._onDragOver(evt);
                    _globalDragOver(evt);
                }
            }
            else if (type === 'drop' || type === 'dragend') {
                this._onDrop(evt);
            }
        },


        /**
         * Serializes the item into an array of string.
         * @returns {String[]}
         */
        toArray: function () {
            var order = [],
                el,
                children = this.el.children,
                i = 0,
                n = children.length,
                options = this.options;

            for (; i < n; i++) {
                el = children[i];
                if (_closest(el, options.draggable, this.el)) {
                    order.push(el.getAttribute(options.dataIdAttr) || _generateId(el));
                }
            }

            return order;
        },


        /**
         * Sorts the elements according to the array.
         * @param  {String[]}  order  order of the items
         */
        sort: function (order) {
            var items = {}, rootEl = this.el;

            this.toArray().forEach(function (id, i) {
                var el = rootEl.children[i];

                if (_closest(el, this.options.draggable, rootEl)) {
                    items[id] = el;
                }
            }, this);

            order.forEach(function (id) {
                if (items[id]) {
                    rootEl.removeChild(items[id]);
                    rootEl.appendChild(items[id]);
                }
            });
        },


        /**
         * Save the current sorting
         */
        save: function () {
            var store = this.options.store;
            store && store.set(this);
        },


        /**
         * For each element in the set, get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree.
         * @param   {HTMLElement}  el
         * @param   {String}       [selector]  default: `options.draggable`
         * @returns {HTMLElement|null}
         */
        closest: function (el, selector) {
            return _closest(el, selector || this.options.draggable, this.el);
        },


        /**
         * Set/get option
         * @param   {string} name
         * @param   {*}      [value]
         * @returns {*}
         */
        option: function (name, value) {
            var options = this.options;

            if (value === void 0) {
                return options[name];
            } else {
                options[name] = value;

                if (name === 'group') {
                    _prepareGroup(options);
                }
            }
        },


        /**
         * Destroy
         */
        destroy: function () {
            var el = this.el;

            el[expando] = null;

            _off(el, 'mousedown', this._onTapStart);
            _off(el, 'touchstart', this._onTapStart);

            if (this.nativeDraggable) {
                _off(el, 'dragover', this);
                _off(el, 'dragenter', this);
            }

            // Remove draggable attributes
            Array.prototype.forEach.call(el.querySelectorAll('[draggable]'), function (el) {
                el.removeAttribute('draggable');
            });

            touchDragOverListeners.splice(touchDragOverListeners.indexOf(this._onDragOver), 1);

            this._onDrop();

            this.el = el = null;
        }
    };


    function _cloneHide(state) {
        if (cloneEl && (cloneEl.state !== state)) {
            _css(cloneEl, 'display', state ? 'none' : '');
            !state && cloneEl.state && rootEl.insertBefore(cloneEl, dragEl);
            cloneEl.state = state;
        }
    }


    function _closest(/**HTMLElement*/el, /**String*/selector, /**HTMLElement*/ctx) {
        if (el) {
            ctx = ctx || document;

            do {
                if ((selector === '>*' && el.parentNode === ctx) || _matches(el, selector)) {
                    return el;
                }
                /* jshint boss:true */
            } while (el = _getParentOrHost(el));
        }

        return null;
    }


    function _getParentOrHost(el) {
        var parent = el.host;

        return (parent && parent.nodeType) ? parent : el.parentNode;
    }


    function _globalDragOver(/**Event*/evt) {
        if (evt.dataTransfer) {
            evt.dataTransfer.dropEffect = 'move';
        }
        evt.preventDefault();
    }


    function _on(el, event, fn) {
        el.addEventListener(event, fn, false);
    }


    function _off(el, event, fn) {
        el.removeEventListener(event, fn, false);
    }


    function _toggleClass(el, name, state) {
        if (el) {
            if (el.classList) {
                el.classList[state ? 'add' : 'remove'](name);
            }
            else {
                var className = (' ' + el.className + ' ').replace(RSPACE, ' ').replace(' ' + name + ' ', ' ');
                el.className = (className + (state ? ' ' + name : '')).replace(RSPACE, ' ');
            }
        }
    }


    function _css(el, prop, val) {
        var style = el && el.style;

        if (style) {
            if (val === void 0) {
                if (document.defaultView && document.defaultView.getComputedStyle) {
                    val = document.defaultView.getComputedStyle(el, '');
                }
                else if (el.currentStyle) {
                    val = el.currentStyle;
                }

                return prop === void 0 ? val : val[prop];
            }
            else {
                if (!(prop in style)) {
                    prop = '-webkit-' + prop;
                }

                style[prop] = val + (typeof val === 'string' ? '' : 'px');
            }
        }
    }


    function _find(ctx, tagName, iterator) {
        if (ctx) {
            var list = ctx.getElementsByTagName(tagName), i = 0, n = list.length;

            if (iterator) {
                for (; i < n; i++) {
                    iterator(list[i], i);
                }
            }

            return list;
        }

        return [];
    }



    function _dispatchEvent(sortable, rootEl, name, targetEl, fromEl, startIndex, newIndex) {
        sortable = (sortable || rootEl[expando]);

        var evt = document.createEvent('Event'),
            options = sortable.options,
            onName = 'on' + name.charAt(0).toUpperCase() + name.substr(1);

        evt.initEvent(name, true, true);

        evt.to = rootEl;
        evt.from = fromEl || rootEl;
        evt.item = targetEl || rootEl;
        evt.clone = cloneEl;

        evt.oldIndex = startIndex;
        evt.newIndex = newIndex;

        rootEl.dispatchEvent(evt);

        if (options[onName]) {
            options[onName].call(sortable, evt);
        }
    }


    function _onMove(fromEl, toEl, dragEl, dragRect, targetEl, targetRect, originalEvt) {
        var evt,
            sortable = fromEl[expando],
            onMoveFn = sortable.options.onMove,
            retVal;

        evt = document.createEvent('Event');
        evt.initEvent('move', true, true);

        evt.to = toEl;
        evt.from = fromEl;
        evt.dragged = dragEl;
        evt.draggedRect = dragRect;
        evt.related = targetEl || toEl;
        evt.relatedRect = targetRect || toEl.getBoundingClientRect();

        fromEl.dispatchEvent(evt);

        if (onMoveFn) {
            retVal = onMoveFn.call(sortable, evt, originalEvt);
        }

        return retVal;
    }


    function _disableDraggable(el) {
        el.draggable = false;
    }


    function _unsilent() {
        _silent = false;
    }


    /** @returns {HTMLElement|false} */
    function _ghostIsLast(el, evt) {
        var lastEl = el.lastElementChild,
            rect = lastEl.getBoundingClientRect();

        // 5 — min delta
        // abs — нельзя добавлять, а то глюки при наведении сверху
        return (
            (evt.clientY - (rect.top + rect.height) > 5) ||
            (evt.clientX - (rect.right + rect.width) > 5)
        ) && lastEl;
    }


    /**
     * Generate id
     * @param   {HTMLElement} el
     * @returns {String}
     * @private
     */
    function _generateId(el) {
        var str = el.tagName + el.className + el.src + el.href + el.textContent,
            i = str.length,
            sum = 0;

        while (i--) {
            sum += str.charCodeAt(i);
        }

        return sum.toString(36);
    }

    /**
     * Returns the index of an element within its parent for a selected set of
     * elements
     * @param  {HTMLElement} el
     * @param  {selector} selector
     * @return {number}
     */
    function _index(el, selector) {
        var index = 0;

        if (!el || !el.parentNode) {
            return -1;
        }

        while (el && (el = el.previousElementSibling)) {
            if ((el.nodeName.toUpperCase() !== 'TEMPLATE') && (selector === '>*' || _matches(el, selector))) {
                index++;
            }
        }

        return index;
    }

    function _matches(/**HTMLElement*/el, /**String*/selector) {
        if (el) {
            selector = selector.split('.');

            var tag = selector.shift().toUpperCase(),
                re = new RegExp('\\s(' + selector.join('|') + ')(?=\\s)', 'g');

            return (
                (tag === '' || el.nodeName.toUpperCase() == tag) &&
                (!selector.length || ((' ' + el.className + ' ').match(re) || []).length == selector.length)
            );
        }

        return false;
    }

    function _throttle(callback, ms) {
        var args, _this;

        return function () {
            if (args === void 0) {
                args = arguments;
                _this = this;

                setTimeout(function () {
                    if (args.length === 1) {
                        callback.call(_this, args[0]);
                    } else {
                        callback.apply(_this, args);
                    }

                    args = void 0;
                }, ms);
            }
        };
    }

    function _extend(dst, src) {
        if (dst && src) {
            for (var key in src) {
                if (src.hasOwnProperty(key)) {
                    dst[key] = src[key];
                }
            }
        }

        return dst;
    }

    function _clone(el) {
        return $
            ? $(el).clone(true)[0]
            : (Polymer && Polymer.dom
                ? Polymer.dom(el).cloneNode(true)
                : el.cloneNode(true)
            );
    }


    // Export utils
    Sortable.utils = {
        on: _on,
        off: _off,
        css: _css,
        find: _find,
        is: function (el, selector) {
            return !!_closest(el, selector, el);
        },
        extend: _extend,
        throttle: _throttle,
        closest: _closest,
        toggleClass: _toggleClass,
        clone: _clone,
        index: _index
    };


    /**
     * Create sortable instance
     * @param {HTMLElement}  el
     * @param {Object}      [options]
     */
    Sortable.create = function (el, options) {
        return new Sortable(el, options);
    };


    // Export
    Sortable.version = '1.4.2';

    window['Sortable'] = Sortable;
})();

(function () {
    var Plugin;
    var fileReader = 'FileReader' in window;
    var upload_block;

    /**
     * @module cacheUpload
     * @description 缓存上传
     * @example
        $('#upload').cacheUpload({
            contextPath: '/emap',
            buttonType: 'button'
        })
     */
    Plugin = (function () {
        function Plugin(element, options) {
            this.options = $.extend({}, $.fn.cacheUpload.defaults, options);
            this.$element = $(element);
            _init(this);
        }

        /**
         * @method saveUpload
         * @param {Object} [params] - 保存时附带的参数
         * @description 保存上传
         * @return {Object} - 带有保存结果的promise对象
         */
        Plugin.prototype.saveUpload = function (params) {

            // 删除 已经删除的正式文件
            var options = this.options;
            var element = this.$element;
            var param_data = params || {};
            var result = $.Deferred();

            if(options.view.isSorting(options)){
                $.bhTip({
                    content: '正在排序中，无法保存，请完成排序或者取消排序',
                    state: 'warning'
                });
                result.reject();
                return result;
            }

            param_data.attachmentParam = JSON.stringify($.extend({}, this.options.attachmentParam, {
                orderMap: _getSortData(this.options),
                storeId: options.storeId
            }));

            // 先判断没有没正在上传的文件, 如果有弹出提示框
            if (options.view.hasLoadingFile(options)) {
                BH_UTILS.bhDialogWarning({
                    title: "警告",
                    content: "有文件正在上传中, 操作可能会造成文件丢失, 是否继续?",
                    buttons: [{
                        text: '确认并提交',
                        className: 'bh-btn-warning',
                        callback: function () {
                            saveAction(element, options, param_data, result);
                        }
                    }, {
                        text: '取消',
                        className: 'bh-btn-default',
                        callback: function () {
                            result.reject();
                        }
                    }]
                })
            } else {
                saveAction(element, options, param_data, result);
            }
            return result;

            function saveAction(element, options, param, result) {
                WIS_EMAP_UPLOAD.cacheCore.save(element, options, param).done(function (res) {
                    options.arrToDelete = [];
                    // token下没有文件时, 返回的token为空
                    if (element.cacheUpload('getFileNum') > 0) {
                        res.token = options.token;
                    } else {
                        res.token = "";
                    }
                    options.view.saveBlock(options);
                    result.resolve(res);
                });
            }
        };

        /**
         * @method getFileToken
         * @description 获取token, 若token下文件数量为0,则返回""
         * @returns {string} token
         */
        Plugin.prototype.getFileToken = function () {
            if (this.$element.cacheUpload('getFileNum') == 0) {
                return "";
            }
            return this.options.token;
        };

        /**
         * @method getFileNum
         * @description 获取token下文件数量 包括正式文件和临时文件, 不包含 出错的文件和 正在上传的文件
         * @returns {*|jQuery}
         */
        Plugin.prototype.getFileNum = function () {
            return this.options.view.getFileNum(this.options);
        };

        /**
         * @method getFileInfo
         * @description 获取当前组件下所有的文件信息
         * @param {Boolean} [async=true] - 是否为异步请求
         * @return {Object} 若为异步则返回promis对象，若为同步，则返回请求结果数组
         */
        Plugin.prototype.getFileInfo = function (async) {
            var options = this.options;
            var fileArr;
            var defer = $.Deferred();
            $.ajax({
                type: "post",
                url: options.contextPath + '/sys/emapcomponent/file/getUploadedAttachment/' + options.token + '.do',
                dataType: "json",
                async: async === false ? false : true,
                success: function (res) {
                    if (res.success) {
                        defer.resolve(res.items);
                        fileArr = res.items;
                    } else {
                        defer.reject(res);
                    }
                },
                error: function (error) {
                    defer.reject(error);
                }
            });

            if (async === false) {
                return fileArr;
            } else {
                return defer;
            }
        };

        /**
         * @method disable
         * @description 禁用
         */
        Plugin.prototype.disable = function () {

        };

        /**
         * @method destroy
         * @description 销毁上传实例
         */
        Plugin.prototype.destroy = function () {
            this.options = null;
            $(this.$element).data('cacheupload', false).empty();
        };

        return Plugin;
    })();

    function _init(instance) {
        var element = instance.$element;
        var options = instance.options;
        options.config = options.config || {};
        options.filesToDelete = [];

        _initActions(options);

        options.view = new WIS_UPLOAD_VIEW(instance);

        _uploadCoreInit(instance);
        _eventBind(instance);

    }


    function _initActions(options) {
        options.actions = {
            // 删除临时文件
            deleteTempFile: function (id) {
                return WIS_EMAP_UPLOAD.cacheCore.deleteTempFile(options, id);
            }
        }
    }

    // 初始化上传核心模块
    function _uploadCoreInit(instance) {
        var element = instance.$element;
        var options = instance.options;
        WIS_EMAP_UPLOAD.cacheCore.init(element, options, {
            init: function (items) {
                if (items && items.length) {
                    options.view.renderItemsBlock(items, options);
                }
                options.initComplete && options.initComplete();
            },
            add: function (e, data) {
                var files = data.files;
                var tmp = new Date().getTime();
                $(files).each(function (i) {
                    data.files[i].bhId = tmp + i;
                    if (options.limit == 1 && options.view.getFileNum(options, true) > 0) {
                        // && options.buttonType !== "block"
                        // 单文件上传模式下的重新上传
                        options.view.reloadBlock(this, options);
                    } else if (options.reloadBlock) { // 多文件模式下的重新上传
                        options.view.loadingBlock(this, options);
                    } else {
                        this.state = 'loading';
                        options.view.renderItemsBlock(this, options)
                            // upload_block.addBlock(this, options);
                    }
                });

                if (options.add) {
                    if (options.add(e, data) === fasle) { // 若add回调 返回false则终止上传
                        return false;
                    }
                }
            },
            submit: function (e, data) {
                var file = data.files[0];
                // 文件数量限制的校验
                if (options.limit) {
                    var currentCount = options.view.getFileNum(options);
                    if (currentCount > options.limit) {
                        data.result = {
                            "error": "文件数量超出限制"
                        };
                        options.view.errorBlock(data, options);
                        WIS_EMAP_SERV && WIS_EMAP_SERV._resetPageFooter();
                        return false;
                    }
                }

                // 文件的大小 和类型校验
                if (options.type && options.type.length > 0) {
                    if (!new RegExp((options.type.join('|') + '$').toUpperCase()).test(file.name.toUpperCase())) {
                        data.result = {
                            "error": "文件类型不正确"
                        };
                        options.view.errorBlock(data, options);
                        WIS_EMAP_SERV && WIS_EMAP_SERV._resetPageFooter();
                        return false;
                    }
                }

                if (fileReader && options.size) {
                    if (file.size / 1024 > options.size) {
                        data.result = {
                            "error": "文件大小超出限制"
                        };
                        options.view.errorBlock(data, options);
                        WIS_EMAP_SERV && WIS_EMAP_SERV._resetPageFooter();
                        return false;
                    }
                }
                $('[data-bhid=' + file.bhId + ']', options.list).data('xhr', data);
                if (options.submit) {
                    if (options.submit(e, data) === fasle) {
                        return false;
                    }
                }
            },
            done: function (e, data) {
                // 上传成功
                options.view.successBlock(data, options);
                if (options.done) {
                    options.done(e, data);
                }
                element.trigger('bh.file.upload.done', data);
                WIS_EMAP_SERV && WIS_EMAP_SERV._resetPageFooter();
            }
        })
    }

    // 删除文件 参数： 文件id  文件状态  options
    function _deleteFile(fileId, state, isReload, options) {
        var dtd = $.Deferred();
        //  删除临时文件
        if (state == 'success') {
            options.actions.deleteTempFile(fileId).done(function (res) {
                //删除后再显示出原来上传按钮
                !isReload && options.view.removeBlock(fileId, options);
                dtd.resolve();
            })
        } else if (state == 'saved' || state == 'normal') {
            options.filesToDelete.push(fileId);
            //删除后再显示出原来上传按钮
            !isReload && options.view.removeBlock(fileId, options);
            setTimeout(function(){
                dtd.resolve();
            }, 0)
        } else if (state == 'error') {
            //删除后再显示出原来上传按钮
            !isReload && options.view.removeBlock(fileId, options);
            setTimeout(function(){
                dtd.resolve();
            }, 0)
        }

        return dtd.promise();
    }


    // 获取排序信息
    function _getSortData(options) {
        var blocks = $('.emap-upload-block-wrap:not(.emap-upload-btn-wrap)', options.list);
        var order_flag = 1;
        var order_map = {};
        blocks.each(function () {
            var self = $(this);
            var file_data = self.data('filedata');
            if (self.hasClass('loading error') || !file_data) {
                return; // 出错和正在上传的文件 不计入排序
            }
            /*
             对于上传的临时文件, 如果带有排序, 则说明是已有正式文件重新上传得到的
             如果没有排序, 则说明是新上传的临时文件

             对于上传的正式文件, 若没有排序, 则添加排序
             */

            if (self.hasClass('success')) {
                order_map[file_data.id] = order_flag;
                order_flag++;
            } else if (self.hasClass('saved')) {
                order_map[file_data.id] = order_flag;
                order_flag++;
            }
        });
        return order_map;
    }

    function _eventBind(instance) {
        var element = instance.$element;
        var options = instance.options;
        // 删除事件绑定
        /*
            e       事件对象
            fileId  文件id
            state   文件状态
            isReload  是否为重新上传
        */
        element.on('_uploadDelete', function (e, fileId, state, isReload) {
            _deleteFile(fileId, state, isReload, options).done(function(){
                element.trigger('bh.file.upload.delete');
            });
        });
        // 重新上传事件
        // element.on('_upload')
    }

    $.fn.cacheUpload = function (options, param) {
        var instance;
        instance = this.data('cacheupload');
        if (!instance) {
            return this.each(function () {
                return $(this).data('cacheupload', new Plugin(this, options));
            });
        }
        if (options === true) return instance;
        if ($.type(options) === 'string') return instance[options](param);
        return this;
    };

    /**
     * @memberof module:cacheUpload
     * @prop {String} contextPath - emap根路径
     * @prop {String} storeId - 定义的文件类型
     * @prop {String} [buttonType=button] - 上传按钮样式 button 或者block
     * @prop {String} [displayType=image] - 上传文件展示类型 image 或者 file
     * @prop {Int} [width=168] - image 模式下文件展示的宽度
     * @prop {Int} [height=108] - image 模式下文件展示的高度
     * @prop {Int} [limit=] - 文件上传个数限制
     * @prop {Array} [type=] -  文件格式限制
     * @prop {Int} [size=] - 文件大小限制,单位KB
     * @prop {String} [token=] - 文件token, 编辑页面传入已有token,则不会生成新的token, 组件会自动拉取该token下已有的文件信息
     * @prop {Boolean} [canPreviewPDF=true] - 是否可以预览pdf文件
     * @prop {Boolean} [readonly=false] - 是否只读
     * @prop {Boolean} [sortable=false] - 是否开启排序
     * @prop {Boolean} [showFileTitle=true] - image模式下，是否显示文件的名称
     * @prop {function} [initComplete] - 初始化完成的回调
     */

    $.fn.cacheUpload.defaults = {
        // contextPath: "",
        storeId: "file",
        buttonType: "button",
        displayType: "image",
        width: 168,
        height: 108,
        limit: null,
        type: [],
        size: 0,
        token: undefined,
        canPreviewPDF: true,
        readonly: false,
        sortable: false,
        showFileTitle: true,
        initComplete: undefined
    };
}).call(this);
(function (UPLOAD) {
    UPLOAD.cacheAdaptor = {
        /**
         * @prop uploadUrl
         * @description  文件上传地址
         */
        uploadUrl: WIS_EMAP_SERV.getContextPath() + '/sys/emapcomponent/file/uploadTempFile.do',

        /**
         * @prop uploadData
         * @description 上传文件附加的参数
         */
        uploadParam: {},

        /**
         * @prop uploadCallback
         * @description 上传请求的回调，用于对请求返回的数据做处理， 将数据修改成组件要求的格式
         * @example 要求返回数据格式
           {
                deleteUrl: "/1470800493693911/1c8cd9aca4e948e99ddb75ab95dd21a8.do",
                fileUrl: "/emap/sys/emapcomponent/file/getAttachmentFile/1c8cd9aca4e948e99ddb75ab95dd21a8.do", // 必须
                hasException: false,
                id: "1c8cd9aca4e948e99ddb75ab95dd21a8", // 必须
                isImage: false,
                name: "前端静态资源1.6.2_TR3测试版本发布说明书.doc", // 必须
                size: 56832，
                success: true, // 必须
                tempFileUrl: "/emap/sys/emapcomponent/file/getTempFile/147080049369391/1470800493693911/1c8cd9aca4e948e99ddb75ab95dd21a8.do"
                ts: "2016-11-11 10:27:21"
           }
         */
        uploadCallback: function (res) {
            return res;
        },

        /**
         * @prop getTokenDataAction
         * @description 获取token下已有文件数据的动作，返回一个priomise对象
         * @example  要求返回数据格式
            {
                "success":true, // 必须
                "items":[  // 必须
                    {
                        "id":"1eb9f6c3d41c4ebdb2e9d43424e19b13",  // 必须
                        "name":"前端框架-组件需求.xlsx",  // 必须
                        "fileUrl":"/emap/sys/emapcomponent/file/getAttachmentFile/1eb9f6c3d41c4ebdb2e9d43424e19b13.do",  // 必须
                        "ts":"2016-11-11 16:21:20",
                        "size":"37862",
                        "orderNum":1,
                        "isImage":false
                    }
                ]
            }
         */
        getTokenDataAction: function (element, options) {
            return $.ajax({
                type: "post",
                url: options.contextPath + '/sys/emapcomponent/file/getUploadedAttachment.do',
                data: {
                    fileToken: options.token
                },
                dataType: "json"
            }).fail(function (error) {
                $.bhTip && $.bhTip({
                    content: '请求token数据失败',
                    state: 'danger',
                    iconClass: 'icon-close'
                });
            });
        },

        /**
         * @prop saveAction
         * @description 保存动作，中间包含删除删除 待删除的正式文件的操作
         * @example 保存动作返回的数据格式
           {
               "success": true, // 必须
               "content": "保存成功！",
               "hasException":false
           }
         */
        saveAction: function (element, options, params) {
            var param_data = params || {};
            var result = $.Deferred();
            var saveOpt = {
                type: "post",
                url: (options.contextPath || WIS_EMAP_SERV.getContextPath()) +
                    "/sys/emapcomponent/file/saveAttachment/{scope}/{fileToken}.do".replace('{scope}', options.scope).replace('{fileToken}', options.token),
                data: param_data,
                dataType: "json",
                success: function (data) {
                    if (data.success) {
                        result.resolve(data);
                    } else {
                        result.reject(data);
                        $.bhTip && $.bhTip({
                            content: data.msg || '保存失败',
                            state: 'danger',
                            iconClass: 'icon-close'
                        });
                    }
                },
                error: function (error) {
                    result.reject(error);
                    $.bhTip && $.bhTip({
                        content: '保存失败',
                        state: 'danger',
                        iconClass: 'icon-close'
                    });
                }
            };
            param_data.fileToken = options.token;
            param_data.scope = options.scope;

            if (options.filesToDelete.length) {
                // 删除 已经删除的正式文件
                var widArray = [];
                options.filesToDelete.map(function (item) {
                    var wid = item.replace(/_[1|2]$/g, "");
                    widArray.push(wid);
                    widArray.push(wid + '_1');
                    widArray.push(wid + '_2');
                });
                saveOpt.data.widsOfAttsToDelete = widArray.join(',');
            }

            $.ajax(saveOpt);
            return result;
        }


    };
})(WIS_EMAP_UPLOAD = window.WIS_EMAP_UPLOAD || {});
(function (UPLOAD) {
    UPLOAD.cacheCore = $.extend({}, {
        /**
         * @method init
         * @description 初始化
         * @param {Object} element - dom对象
         * @param {Object} options - 配置
         * @param {Object} cbObj - 包含回调函数的对象 init add submit done
         */
        init: function (element, options, cbObj) {
            // 初始化adaptor
            options.adaptor = options.adaptor || UPLOAD.cacheAdaptor;

            options.filesToDelete = [];
            cbObj = cbObj || {};
            options.uploadUrl = options.adaptor.uploadUrl;
            // 获取已有token下的所有文件
            if (options.token !== undefined && options.token !== '') {
                options.adaptor.getTokenDataAction && options.adaptor.getTokenDataAction(element, options).done(function (res) {
                    if (res.success) {
                        if (res.items) {
                            cbObj.init && cbObj.init(res.items);
                        }
                    } else {
                        $.bhTip && $.bhTip({
                            content: res.msg || '请求token数据失败',
                            state: 'danger',
                            iconClass: 'icon-close'
                        });
                    }
                });
                options.scope = options.token.substring(0, options.token.length - 1);

                // 初始化时 先删除 原有token下的所有临时文件
                this.deleteTempFile(options);
            } else {
                options.scope = new Date().getTime() + "" + parseInt(Math.random() * 100).toString();
                options.token = options.scope + 1;
                cbObj.init && cbObj.init();
            }

            _uploadCoreInit(element, options, cbObj);
        },

        /**
         * @method save
         * @description 缓存上传的保存操作
         * @param {Object} element - dom对象
         * @param {Object} options - 配置对象
         * @param {Object} [param] - 请求附带的参数
         */
        save: function (element, options, params) {
            return options.adaptor.saveAction(element, options, params);
        },

        /**
         * @method deleteTempFile
         * @description 删除临时文件
         */
        deleteTempFile: function (options, id) {
            var defer = $.Deferred();
            // var options = this.options;
            var url = WIS_EMAP_SERV.getContextPath() +
                '/sys/emapcomponent/file/deleteTempFile.do';
            var requestData = {
                scope: options.scope,
                fileToken: options.token
            };
            if (id) {
                requestData.fileWid = id;
                requestData.attachmentParam = JSON.stringify({
                    storeId: options.storeId,
                    items: [{
                        id: id,
                        status: 'Delete'
                    }]
                });
            }

            $.ajax({
                type: "post",
                url: url,
                dataType: "json",
                async: false,
                data: requestData
            }).done(function (res) {
                if (res.success) {
                    defer.resolve(res);
                } else {
                    $.bhTip && $.bhTip({
                        content: res.msg || '删除临时文件失败',
                        state: 'danger',
                        iconClass: 'icon-close'
                    });
                    defer.reject(res);
                }
            }).fail(function (error) {
                $.bhTip && $.bhTip({
                    content: error.msg || '删除临时文件失败',
                    state: 'danger',
                    iconClass: 'icon-close'
                });
                defer.reject(error);
            })
            return defer;
        },

        importRownum: function (opt, data) {
            var dfd = $.Deferred();
            $.ajax({
                type: 'post',
                dataType: 'json',
                url: opt.contextPath + '/sys/emapcomponent/imexport/importRownum.do',
                data: data,
                success: function (resp) {
                    dfd.resolve(resp);
                },
                error: function (resp) {
                    $.bhTip && $.bhTip({
                        content: '获取导入数据行数失败',
                        state: 'danger',
                        iconClass: 'icon-close'
                    });
                    dfd.reject(resp);
                }
            });
            return dfd;
        },

        downloadImportTpl: function (opt, data) {
            $.ajax({
                type: 'post',
                url: opt.contextPath + '/sys/emapcomponent/imexport/importTemplate.do',
                data: data,
                success: function (json) {
                    location.href = (opt.contextPath + '/sys/emapcomponent/file/getAttachmentFile/' + JSON.parse(json).attachment + '.do');
                },
                error: function (e) {
                    $.bhTip && $.bhTip({
                        content: '获取下载地址失败',
                        state: 'danger',
                        iconClass: 'icon-close'
                    });
                    console && console.log(e);
                }
            });
        },

        importFile: function (opt, data) {
            var dfd = $.Deferred();
            $.ajax({
                type: 'post',
                dataType: 'json',
                url: opt.contextPath + '/sys/emapcomponent/imexport/import.do',
                data: data,
                success: function (resp) {
                    dfd.resolve(resp);
                },
                error: function (resp) {
                    $.bhTip && $.bhTip({
                        content: '获取导入数据行数失败',
                        state: 'danger',
                        iconClass: 'icon-close'
                    });
                    dfd.reject(resp);
                }
            });
            return dfd;
        },

        getDownloadResultUrl: function (opt, result) {
            return opt.contextPath + '/sys/emapcomponent/file/getAttachmentFile/' + result.attachment + '.do';
        }

    }, UPLOAD.cacheCore || {});

    // 初始化上传核心模块
    function _uploadCoreInit(element, options, cbObj) {
        var formData = {
            scope: options.scope,
            fileToken: options.token,
            size: options.size,
            type: options.type,
            storeId: options.storeId,
            isSingle: options.isSingle == "1" ? "1" : "0",
            fileName: options.fileName ? options.fileName : ""
        };
        if (options.adaptor.uploadParam) {
            $.extend(formData, options.adaptor.uploadParam);
        }
        options.fileInput = options.fileInput || $('input[type=file]', element);

        options.fileInput.fileupload({
            url: options.uploadUrl,
            autoUpload: (options.autoUpload === false ? false : true),
            multiple: (options.multiple === false ? false : true),
            dataType: 'json',
            limitMultiFileUploads: 10,
            formData: formData,
            add: function (e, data) {
                var isSubmit;
                if (cbObj.add) {
                    isSubmit = cbObj.add(e, data);
                }
                if (isSubmit === undefined) {
                    data.submit();
                }
            },
            submit: function (e, data) {
                if (cbObj.submit) {
                    if (cbObj.submit(e, data) === false) {
                        return false;
                    }
                }
            },
            done: function (e, data) {
                if (options.adaptor.uploadCallback) {
                    data.result = options.adaptor.uploadCallback(data.result);
                }
                if (data.result.success) {
                    // 上传成功
                    if (cbObj.done) {
                        cbObj.done(e, data);
                    }

                } else {
                    $.bhTip && $.bhTip({
                        content: data.result.msg || '上传临时文件失败',
                        state: 'danger',
                        iconClass: 'icon-close'
                    });
                    if (cbObj.fail) {
                        cbObj.fail(e, data);
                    }
                }
                WIS_EMAP_SERV && WIS_EMAP_SERV._resetPageFooter();
            },
            fail: function (e) {
                $.bhTip && $.bhTip({
                    content: '上传临时文件失败',
                    state: 'danger',
                    iconClass: 'icon-close'
                });
            }
        });
    }

})(WIS_EMAP_UPLOAD = window.WIS_EMAP_UPLOAD || {});
/*
    直接上传组件： 不存在token和临时文件的概念等、不需要保存操作
    需要指定：
        上传地址 uploadUrl
        上传参数 uploadParam
        上传成功的回调 （用于处理请求参数）  options.done
            返回参数格式必须处理为
                {
                    fileUrl: "",//上传成功后的图片地址
                    id: "465084e9ed85449fa717d661ae82722d",
                    success: true/false
                }

        删除文件请求地址 deleteUrl   (删除谓词POST)
        删除文件请求参数 deleteParam (json类型)
        删除请求之前的回调（用于处理请求参数） --
        删除请求成功的回调（用于处理请求参数） --
            要求返回格式
                {
                    success: true
                }

        已有文件的数据（要求格式， 包含文件id和文件url）
            要求格式
                [
                    {
                        id: "zzxczxczxc",
                        fileUrl: "asdasdasdsad"
                    },
                    {
                        id: "zzxczxczxc",
                        fileUrl: "asdasdasdsad"
                    }
                ]

*/
(function () {
    var Plugin;
    var fileReader = 'FileReader' in window;
    var upload_block;

    Plugin = (function () {
        function Plugin(element, options) {
            this.options = $.extend({}, $.fn.directUpload.defaults, options);
            this.$element = $(element);
            _init(this);
        }


        /**
         * @method destroy
         * @description 销毁上传实例
         */
        Plugin.prototype.destroy = function () {
            this.options = null;
            $(this.$element).data('directupload', false).empty();
        };

        return Plugin;
    })();

    function _init(instance) {
        var element = instance.$element;
        var options = instance.options;
        options.config = options.config || {};
        //检查uploadUrl，如果没有，则报错
        //options.uploadUrl = WIS_EMAP_SERV.getContextPath() + '/sys/emapcomponent/file/uploadTempFile.do';
        if(!options.uploadUrl || typeof options.uploadUrl !== 'string'){
            console && console.error('directupload error: uploadUrl must be given!');
            return;
        }
        if(!options.deleteUrl || typeof options.deleteUrl !== 'string'){
            console && console.error('directupload error: deleteUrl must be given!');
            return;
        }

        _initActions(options);

        options.view = new WIS_UPLOAD_VIEW(instance);

        _uploadCoreInit(instance);
        _eventBind(instance);
    }


    function _initActions(options) {
        options.actions = {
            // 删除文件
            deleteFile: function (id) {
                var defer = $.Deferred();
                $.ajax({
                    type: "post",
                    url: options.deleteUrl,
                    dataType: "json",
                    //async: false,
                    data: options.deleteParam
                }).done(function (res) {
                    if (res.success) {
                        defer.resolve(res);
                    } else {
                        defer.reject(res);
                    }
                }).fail(function (error) {
                    defer.reject(error);
                });
                return defer;
            }
        }
    }

    // 初始化上传核心模块
    function _uploadCoreInit(instance) {
        var element = instance.$element;
        var options = instance.options;

        WIS_EMAP_UPLOAD.directCore.init(element, options, {
            init: function () { //
                //渲染原有图片
                if(options.imagesUrl instanceof Array && options.imagesUrl.length > 0) {
                    var _items = [];
                    // if(!options.imagesUrl instanceof Array) {
                    //  options.imagesUrl = [options.imagesUrl];
                    // }

                    $(options.imagesUrl).each(function (i, v) {
                        if(v){
                            var _data = {};
                            _data.bhId = new Date().getTime() + i;
                            _data.name = v.replace(/(.*\/)*(.*)([\?\!#]+.*)/ig, "$2");
                            _data.fileUrl = v;
                            _data.state = 'saved';
                            _items.push(_data);
                        }
                    });

                    options.view.renderItemsBlock(_items, options);
                }
                //绑定删除方法
                options.deleteFileCallback = _deleteFile;
            },
            add: function (e, data) {
                var files = data.files;
                var tmp = new Date().getTime();
                $(files).each(function (i) {
                    data.files[i].bhId = tmp + i;
                    if (options.limit == 1 && options.view.getFileNum(options, true) > 0) {// 单文件上传模式下的重新上传
                        options.view.reloadBlock(this, options);
                    } else if (options.reloadBlock) { // 多文件模式下的重新上传
                        options.view.loadingBlock(this, options);
                    } else {
                        this.state = 'loading';
                        options.view.renderItemsBlock(this, options)
                    }
                });

                if (options.add) {
                    if (options.add(e, data) === false) { // 若add回调 返回false则终止上传
                        return false;
                    }
                }
            },
            submit: function (e, data) {
                var file = data.files[0];
                // 文件数量限制的校验
                if (options.limit) {
                    var currentCount = options.view.getFileNum(options);
                    if (currentCount > options.limit) {
                        data.result = {
                            "error": "文件数量超出限制"
                        };
                        options.view.errorBlock(data, options);
                        // WIS_EMAP_SERV && WIS_EMAP_SERV._resetPageFooter();
                        return false;
                    }
                }

                // 文件的大小 和类型校验
                if (options.type && options.type.length > 0) {
                    if (!new RegExp((options.type.join('|') + '$').toUpperCase()).test(file.name.toUpperCase())) {
                        data.result = {
                            "error": "文件类型不正确"
                        };
                        options.view.errorBlock(data, options);
                        // WIS_EMAP_SERV && WIS_EMAP_SERV._resetPageFooter();
                        return false;
                    }
                }

                if (fileReader && options.size) {
                    if (file.size / 1024 > options.size) {
                        data.result = {
                            "error": "文件大小超出限制"
                        };
                        options.view.errorBlock(data, options);
                        // WIS_EMAP_SERV && WIS_EMAP_SERV._resetPageFooter();
                        return false;
                    }
                }

                $('[data-bhid=' + file.bhId + ']', options.list).data('xhr', data);
                if (options.submit) {
                    if (options.submit(e, data) === false) {
                        return false;
                    }
                }
            },
            done: function (e, data) {
                if (data.result.success) {

                    // 上传成功
                    if (!data.result.tempFileUrl) {  // 由于直接上传不存在临时文件的概念，所以此处将tempFileUrl设置为文件的fileUrl
                        data.result.tempFileUrl = data.result.fileUrl;
                    }

                    options.view.successBlock(data, options);
                    if (options.done) {
                        options.done(e, data);
                    }

                } else {
                    console && console.error('文件上传失败');
                    options.view.errorBlock(data, options);
                    if (options.fail) {
                        options.fail(e, data)
                    }
                }

                // WIS_EMAP_SERV && WIS_EMAP_SERV._resetPageFooter();
            },
            fail: function (e, data) {
                $.bhTip && $.bhTip({
                    content: '文件上传失败',
                    state: 'danger',
                    iconClass: 'icon-close'
                });
            }
        });

    }

    // 删除文件 参数： 文件id  文件状态  options
    function _deleteFile(fileId, state, isReload, options) {
        var dtd = $.Deferred();
        //  删除临时文件
        if (state == 'success' || state == 'saved' || state == 'normal') {
            options.actions.deleteFile(fileId).done(function (res) {
                //删除后再显示出原来上传按钮
                !isReload && options.view.removeBlock(fileId, options);
                dtd.resolve();
            }).fail(function (e, data) {
                dtd.reject();
            })
        } else if (state == 'error') {
            //删除后再显示出原来上传按钮
            !isReload && options.view.removeBlock(fileId, options);
            dtd.resolve();
        }

        return dtd.promise();
    }


    function _eventBind(instance) {
        var element = instance.$element;
        var options = instance.options;
        // 删除事件绑定
        /*
            e       事件对象
            fileId  文件id
            state   文件状态
            isReload  是否为重新上传
        */
        element.on('_uploadDelete', function (e, fileId, state, isReload) {
            _deleteFile(fileId, state, isReload, options);
        });
    }

    $.fn.directUpload = function (options, param) {
        var instance;
        instance = this.data('directupload');
        if (!instance) {
            return this.each(function () {
                return $(this).data('directupload', new Plugin(this, options));
            });
        }
        if (options === true) return instance;
        if ($.type(options) === 'string') return instance[options](param);
        return this;
    };

    /**
     * @memberof module:directUpload
     * @prop {String} storeId - 定义的文件类型
     * @prop {String} [buttonType=button] - 上传按钮样式 button 或者block
     * @prop {String} [displayType=image] - 上传文件展示类型 image 或者 file
     * @prop {Int} [width=168] - image 模式下文件展示的宽度
     * @prop {Int} [height=108] - image 模式下文件展示的高度
     * @prop {Int} [limit=] - 文件上传个数限制
     * @prop {Array} [type=] -  文件格式限制
     * @prop {Int} [size=] - 文件大小限制,单位KB
     * @prop {Boolean} [canPreviewPDF=true] - 是否可以预览pdf文件
     * @property {String} uploadUrl - 上传url
     * @property {Object} uploadParam - 上传附件参数
     * @property {String} deleteUrl - 上传url
     * @property {Object} deleteParam - 上传附件参数
     */

    $.fn.directUpload.defaults = {
        storeId: "file",
        buttonType: "button",
        displayType: "image",
        width: 168,
        height: 108,
        limit: null,
        type: [],
        size: 0,
        token: undefined,
        canPreviewPDF: true
    };
}).call(this);
(function (UPLOAD) {
    UPLOAD.directCore = $.extend({}, {
        /**
         * @method init
         * @description 初始化
         * @param {Object} element - dom对象
         * @param {Object} options - 配置
         * @param {Object} cbObj - 包含回调函数的对象 init add submit done
         */
        init: function (element, options, cbObj) {
            cbObj = cbObj || {};

            cbObj.init && cbObj.init();

            _uploadCoreInit(element, options, cbObj);
        }

    }, UPLOAD.directCore || {});

    // 初始化上传核心模块
    function _uploadCoreInit(element, options, cbObj) {
        var formData = $.extend({}, {
            size: options.size,
            type: options.type,
            storeId: options.storeId
        }, options.uploadParam || {});

        options.fileInput = options.fileInput || $('input[type=file]', element);

        options.fileInput.fileupload({
            url: options.uploadUrl,
            autoUpload: true,
            multiple: true,
            dataType: 'json',
            limitMultiFileUploads: 10,
            formData: formData,
            add: function (e, data) {
                if (cbObj.add) {
                    cbObj.add(e, data);
                }
                data.submit(e, data);
            },
            submit: function (e, data) {
                if (cbObj.submit) {
                    if (cbObj.submit(e, data) === false) {
                        return false;
                    }
                }
            },
            done: function (e, data) {
                if (cbObj.done) {
                    cbObj.done(e, data);
                }
            },
            fail: function (e, data) {
                if (cbObj.fail) {
                    cbObj.fail(e, data);
                }
            },
            progressall: function (e, data) {
                if(cbObj.progress){
                    cbObj.progress(e, data);
                }
            }
        });
    }

})(WIS_EMAP_UPLOAD = window.WIS_EMAP_UPLOAD || {});
(function () {
    /**
     * @module emapUpload
     * @description emap缓存上传，配置参数和api方法请参阅 cacheUpload
     * @example
        $('#upload').emapUpload({
            contextPath: '/emap',
            buttonType: 'button'
        })
     */
    $.fn.emapUpload = function (args) {
        return $(this).cacheUpload(args);
    }
})();
(function($) {
    /**
     * @param  {[type]} ) {     function  WIS_UPLOAD_VIEW(instance) {           var element [description]
     * @return {[type]}   [description]
     */
    WIS_UPLOAD_VIEW = (function() {
        function WIS_UPLOAD_VIEW(instance) {
            var element = instance.$element;
            var options = instance.options;
            options.wrap = $('<div class="bh-clearfix" emap-role="upload-container"></div>');
            options.list = $('<div class="bh-clearfix emap-upload-list-container" emap-role="upload-list"></div>');
            options.wrap.append(options.list);
            if (options.readonly) {
                options.list.addClass('emap-readonly');
            }
            element.append(options.wrap);
            upload_block.renderUploadButton(options);
            options.fileInput = $('input[type=file]', options.wrap);
            eventBind(options);
        }

        // api
        WIS_UPLOAD_VIEW.prototype = {
            /**
             * @method renderExistedData
             * @description 根据文件信息将文件列表渲染到组件上
             */
            renderItemsBlock: function(items, options) {
                if (items instanceof Array) {
                    $(items).each(function() {
                        addItem(this, options);
                    });
                } else {
                    addItem(items, options);
                }

                function addItem(item, options) {
                    var state = item.state || 'saved';
                    upload_block.addBlock(item, state, options);
                    if (_isSingleBlock(options)) {
                        options.list.parent().find('.emap-upload-btn-wrap').addClass('bh-hide');
                    }
                }
            },

            /**
             * @method getFileNum
             * @description 获取组件视图中文件数量
             * @param {Boolean} [flag=false] - 是否包含错误文件与上传中文件 默认 不包含
             */
            getFileNum: function(options, flag) {
                var selector = '.emap-upload-block-wrap:not(.emap-upload-btn-wrap)';
                if (flag !== true) {
                    selector += ':not(.error):not(.loading)';
                }
                return $(selector, options.wrap).length;
            },

            /**
             * @method reloadBlock
             * @description 重新上传一个block
             * @param {Object} data -  文件信息
             *  {
             *      name: xxx,
             *      bhId: xxx,
             *      fileUrl: xxx,
             *      size: xxx
             *  }
             * @param {Object} options
             */
            reloadBlock: function(data, options) {
                upload_block.reloadBlock(data, options);
            },

            /**
             * @method loadingBlock
             * @description 将一个block 的状态变为loading
             */
            loadingBlock: function(data, options) {
                upload_block.loadingBlock(data, options);
            },

            /**
             * @method successBlock
             * @description 将一个block 的状态变为success
             */
            successBlock: function(data, options) {
                upload_block.successBlock(data, options);
            },

            saveBlock: function(options) {
                $('.emap-upload-block-wrap', options.list).each(function() {
                    if ($(this).hasClass('success')) {
                        // 将success文件转换为saved文件
                        $(this).removeClass('success').addClass('saved');
                    }
                });
            },

            errorBlock: function(data, options) {
                upload_block.errorBlock(data, options);
            },

            removeBlock: function(fileId, options) {
                var block = $('[data-fileid=' + fileId + ']', options.wrap);
                if (block.length == 0) {
                    block = $('[data-bhid=' + fileId + ']', options.wrap);
                }
                if (_isSingleBlock(options)) {
                    block.parent().find('.emap-upload-btn-wrap').removeClass('bh-hide');
                }
                block.remove();
            },

            hasLoadingFile: function(options) {
                return $('.emap-upload-block-wrap.loading', options.list).length > 0;
            },

            isSorting: function(options) {
                return options.list.parent().hasClass('emap-upload-sorting');
            }
        }
        return WIS_UPLOAD_VIEW;
    })();
    var upload_block = {
        // 渲染上传按钮
        renderUploadButton: function(options) {
            var buttonHtml;
            if (options.buttonType == 'block') {
                buttonHtml = $('<div class="emap-upload-block-wrap emap-upload-btn-wrap"><div class="emap-upload-block emap-upload-btn" ' + upload_block.getBlockStyle(options) + ' ><div class="emap-upload-cell">' +
                    '<i class="iconfont icon-addcircle emap-upload-icon-add"></i>' +
                    '<span class="iconfont icon-info emap-upload-shuoming ">说明 </span>' +
                    '<input type="file" emap-role="upload-input" class="emap-upload-input" ' + (options.limit != 1 ? 'multiple' : '') + '>' +
                    '</div>' +
                    '</div></div>');
                if (options.readonly) {
                    buttonHtml.css({
                        'display': 'none'
                    });
                }
                options.list.append(buttonHtml);
            } else if (options.buttonType == 'button') {
                buttonHtml = $('<p class="bh-mb-16"><a class="bh-btn bh-btn-default emap-upload-btn-button" href="javascript:void(0)">' +
                    '<i class="iconfont icon-fileupload"></i>' +
                    (options.limit != 1 ? '批量上传' : '<span>上传文件</span>') +
                    '<input type="file" emap-role="upload-input" ' + (options.limit != 1 ? 'multiple' : '') + ' >' +
                    '</a>' +
                    '<span class="bh-color-caption">' + _getInfoText(options) + '</span>' +
                    '</p>');
                if (options.readonly) {
                    buttonHtml.css({
                        'display': 'none'
                    });
                }
                if (options.sortable) {
                    var sortButtons = $('<div class="bh-l-inline bh-mr-8"><button class="bh-btn bh-btn-default emap-upload-start-sort" emap-role="sort-file" style="margin-left: 0"><i class="iconfont icon-importexport"></i>文件排序</button>' +
                        '<div class="emap-upload-sort-btns"><button class="bh-btn bh-btn-primary" emap-role="save-sort" style="margin-left: 0">完成排序</button><button class="bh-btn bh-btn-default" emap-role="cancel-sort">取消</button><span class="bh-text-caption bh-color-caption bh-ph-8">拖动以排序</span></div>' +
                        '</div>');
                    buttonHtml.find('.emap-upload-btn-button').after(sortButtons);
                }

                options.list.before(buttonHtml);
            }
        },

        // 拼接block宽高样式
        getBlockStyle: function(options) {
            return 'style="width: ' + options.width + 'px; height: ' + options.height + 'px;"'
        },

        /**
         * @method addBlock
         * @description 添加一个上传项
         * @param {Object} data - 文件信息json数据
         * @param {String} state - 文件状态 success saved loading
         * @param {Object} options - 组件options对象
         */
        addBlock: function(data, state, options) {
            if (options.buttonType == 'block') {
                $('.emap-upload-btn', options.list).parent().before(upload_block.renderBlockItem(data, state, options));
                if (_isSingleBlock(options)) {
                    $('.emap-upload-btn', options.list).parent().addClass('bh-hide');
                }
            } else if (options.buttonType == 'button') {
                if (options.limit == 1) {
                    $('.emap-upload-btn-button span', options.wrap).attr('disabled', true).html('重新上传');
                    $('input[type=file]', options.wrap).addClass('emap-upload-single');
                }
                var blockItem = upload_block.renderBlockItem(data, state, options);
                options.list.append(blockItem);
                if (options.displayType == 'file') {
                    _resizeFilenameLength(blockItem);
                }
            }

            if (options.displayType == 'image') {
                // 对于展示缩略图的情况。宽度不够的时候自动铺满
                var imgs = $('.emap-upload-img',  options.list);
                if (imgs.length) {
                    imgs.on('load', function() {
                        var height = $(this).height();
                        var width = $(this).width();
                        var optWidth = options.width-8;
                        var optHeight = options.height-8;
                        if (height < optHeight && width < optWidth) {
                            if ((width / height) < (optWidth / optHeight)) {
                                $(this).height(optHeight);
                            } else {
                                $(this).width(optWidth);
                            }
                        }
                    })
                }
            }
        },

        // 文件的重新上传 (单文件的重新上传)
        reloadBlock: function(data, options) {
            var block = $('[data-bhid]', options.list);
            /*
             重新上传时给block 添加标记位
             */

            if (!options.deleteFileCallback) {
                options.list.trigger('_uploadDelete', [block.data('fileid') || block.data('bhid'), _getFileState(block), true])
            }
            // _deleteFile(block, options).done(function () {
            //  upload_block.addBlock(data, 'loading', options);
            // });
            // block.addClass('loading');

        },

        // 渲染单个文件
        renderBlockItem: function(data, state, options) {
            var itemHtml = '';
            var readonly = options.readonly;
            data.bhId = data.bhId || data.id; // 渲染正式文件时， 若没有bhId  则将文件id（fileId）作为bhId，此情况一般出现在渲染上传组件原有文件时
            if (options.displayType == 'image') {
                itemHtml += '<div class="emap-upload-block-wrap {{state}}" data-bhid="{{bhId}}" style="width:' + (options.width + 2) + 'px">' +
                    '<div class="emap-upload-block "   {{style}}>' +
                    // loading
                    '<div class="emap-upload-cell emap-upload-loading-cell" style="height: ' + (options.height - 8) + 'px;width: ' + (options.width - 8) + 'px;">' +
                    '<p class="emap-upload-loading-cell-size">{{size}}</p>' +
                    '<img src="{{loadingIcon}}">' +
                    '<p><a href="javascript:void(0)" emap-role="upload-cancel">取消上传</a></p>' +
                    '</div>' +
                    // file
                    '<div class="emap-upload-cell emap-upload-file-cell" style="height: ' + (options.height - 8) + 'px;width: ' + (options.width - 8) + 'px;">' +
                    upload_block.renderFileDetail(data.name, data.middleSizeImageUrl || data.fileUrl, options) +  // 列表中展示小图片
                    '</div>' +

                    // edit
                    '<div class="emap-upload-cell emap-upload-mask emap-upload-cell-edit ' + _getblockClass(data.name, options) + '" >' +
                    // 重新上传功能8月19日 之前输出
                    '<a href="javascript:void(0)" emap-role="upload-reupload">' +
                    '<i class="iconfont icon-fileupload"></i>重新上传' +
                    '<input type="file" name="reUpload">' +
                    '</a>' +
                    '<a href="javascript:void(0)"  emap-role="upload-preview"><i class="iconfont icon-findinpage"></i>预览</a>' +
                    '<a href="javascript:void(0)" emap-role="upload-down"><i class="iconfont icon-filedownload"></i>下载</a>' +
                    '<a href="javascript:void(0)" emap-role="upload-delete"><i class="iconfont icon-delete"></i>删除</a>' +
                    '</div>' +

                    // error
                    '<div class="emap-upload-cell emap-upload-error-cell" style="height:' + (options.height - 8) + 'px">' +
                    '<p class="emap-upload-error-icon"><i class="iconfont icon-close"></i></p>' +
                    '<p class="emap-upload-error-text">上传失败</p>' +
                    '<p>' +
                    // '<a href="javascript:void(0)" class="bh-mh-4" emap-role="upload-reupload">重新上传</a>' +
                    '<a href="javascript:void(0)" class="bh-mh-4" emap-role="upload-delete">删除</a>' +
                    '</p>' +
                    '</div>' +
                    '<div class="emap-upload-cell emap-upload-mask emap-upload-sort-icon"><i class="iconfont icon-dehaze" style="line-height: ' + options.height + 'px"></i></div>' +
                    '</div>' +
                    '<p class="emap-upload-name" title="{{fileName}}" style="width: ' + options.width + 'px;">{{fileName}}</p>' +
                    '</div>';
                if ('FileReader' in window) {
                    itemHtml = itemHtml.replace('{{size}}', _getFileSize(data.size / 1024));
                } else {
                    itemHtml = itemHtml.replace('{{size}}', '');
                }

                itemHtml = itemHtml.replace('{{state}}', state)
                    .replace('{{style}}', upload_block.getBlockStyle(options))
                    .replace('{{bhId}}', data.bhId)
                    .replace('{{loadingIcon}}', _getLoadingGIF());
                if (_isSingleBlock(options)) {
                    itemHtml = itemHtml.replace(/\{\{fileName\}\}/g, options.title ? options.title : '');
                } else {
                    itemHtml = itemHtml.replace(/\{\{fileName\}\}/g, data.name);
                }


                itemHtml = $(itemHtml);
                if (options.displayType == 'image' && options.showFileTitle === false) {
                    $('.emap-upload-name', itemHtml).hide();
                }
                if (state == 'saved') {
                    itemHtml.data('filedata', data);
                } else {
                    itemHtml.data('file', data);
                }
                return itemHtml;
            } else if (options.displayType == 'file') {

                //added by zsl on 2016.8.11
                itemHtml += '<div class=" emap-upload-block-wrap emap-upload-file-wrap {{state}} {{support-rate}} " data-bhid="{{bhId}}">' +
                    '<span class="bh-icon-file-type {{filetype}}">{{filetype}}</span>' +
                    '<span class="filename" title="{{filename}}">{{filename}}</span>' +
                    '<span class="state-icon"></span>' +
                    '<span class="result-fail">上传失败！</span>' +
                    '<span class="result-success">上传成功！</span>' +
                    '<a class="cancel" emap-role="upload-cancel" href="javascript:void(0)">取消上传</a>' +
                    '<a class="error-reupload" emap-role="upload-reupload" href="javascript:void(0)">' +
                    '重新上传' +
                    '<input type="file" name="reUpload">' +
                    '</a>' +
                    '<a class="fail-reupload" emap-role="upload-reupload" href="javascript:void(0)">' +
                    '重试' +
                    '<input type="file" name="reUpload">' +
                    '</a>' +
                    (_canPreview(data.name, options) ? '<a class="view" emap-role="upload-preview" href="javascript:void(0)">预览</a>' : '') +
                    '<a class="download" emap-role="upload-down" href="javascript:void(0)">下载</a>' +
                    '<a class="del" emap-role="upload-delete" href="javascript:void(0)">删除</a>' +
                    '<span class=" rate">{{uploadrate}}</span>' +
                    '<div class="progress">' +
                    '   <div class="bar" style="width: {{uploadpercent}}%;"></div>' +
                    '</div>' +
                    '</div>';

                if ('FileReader' in window) {
                    itemHtml = itemHtml.replace('{{size}}', '<p >' + _getFileSize(data.size) + '</p>');
                }
                //替换是否支持速度、bhid、filetype、filename、uploadrate、uploadpercent
                itemHtml = itemHtml.replace('{{state}}', (state === 'saved' ? 'saved' : 'loading'))
                    .replace(/\{\{support-rate\}\}/g, _isSupportRate() ? 'state-support-rate' : '')
                    .replace(/\{\{filetype\}\}/g, function() {
                        var sfx = data.name.match(/\.[^\.]+$/);
                        if (sfx) {
                            return sfx[0].substr(1).toUpperCase();
                        } else {
                            return '';
                        }
                    })
                    .replace(/\{\{filename\}\}/g, data.name)
                    .replace('{{bhId}}', data.bhId);
                if (_isSupportRate()) {
                    itemHtml.replace(/\{\{uploadrate\}\}/g, '0KB/s')
                        .replace(/\{\{uploadpercent\}\}/g, '0');
                }

                itemHtml = $(itemHtml);
                if (state == 'saved') {
                    itemHtml.data('filedata', data);
                } else {
                    itemHtml.data('file', data);
                }
                return itemHtml;
            }
        },

        renderFileDetail: function(name, url, options) {
            var fileHtml = "";
            if (_isImage(name)) {
                // 图片
                fileHtml += '<img class="emap-upload-img"  ' + (url ? ' src="' + url + '"' : '') + '" style="max-height: ' + (options.height - 8) + 'px;max-width: ' + (options.width - 8) + 'px;" />';
            } else {
                fileHtml += '<div class="emap-upload-img-file ' + _getIconByFileName(name) + '"></div>';
            }
            return fileHtml;
        },

        loadingBlock: function(data, options) {
            var block = options.reloadBlock.element;
            block.removeClass('success saved error normal').addClass('loading').data('bhid', data.bhId).attr('data-bhid', data.bhId);
            if (options.displayType == 'image') {
                $('.emap-upload-name', block).text(data.name).attr('title', data.name);
                if ('FileReader' in window) {
                    $('.emap-upload-loading-cell-size', block).text(_getFileSize(data.size / 1024));
                }
            } else if (options.displayType == 'file') {
                $('span.filename', block).text(data.name).attr('title', data.name);
                var suffix = data.name.match(/\.(\w+$)/)[1].toUpperCase();
                $('.bh-icon-file-type', block).html(suffix).attr('class', 'bh-icon-file-type ' + suffix);
            }

        },

        // 将上传block的状态从loading 改变为success
        successBlock: function(data, options) {
            var bhId = data.files[0].bhId;
            var result = data.result;
            var block = $('[data-bhid=' + bhId + ']', options.list);
            if (block.length == 0) {
                // 针对buttonType = block 模式下的单文件上传，block为已有的文件block
                if (options.reloadBlock) {
                    block = options.reloadBlock.element;
                }
            }

            block.attr('data-fileid', data.result.id);
            if (options.displayType == 'image') {
                block.removeClass('loading error').addClass('success').data('filedata', result);
                if (_isImage(result.name)) {
                    $('.emap-upload-file-cell img', block).attr('src', result.tempFileUrl)
                        .css({
                            "height": options.height - 8,
                            "width": options.width - 8
                        });
                }
                if (options.limit == 1) {
                    $('.emap-upload-btn-button', options.wrap).attr('disabled', false);
                }

                $('.emap-upload-file-cell', block).html(upload_block.renderFileDetail(result.name, result.tempFileUrl, options));
                // 显示上传成功图标
                var successCell = $('<div class="emap-upload-cell emap-upload-mask emap-upload-cell-success" style="display: block;">' +
                    '<p class="emap-upload-success-icon"><i class="iconfont icon-check"></i></p>' +
                    '<p>上传成功</p>' +
                    '</div>');
                $('.emap-upload-block', block).append(successCell);
                successCell.css('opacity', 1);
                setTimeout(function() {
                    successCell.css({
                        top: '-101%'
                    });
                    setTimeout(function() {
                        successCell.remove();
                        var editCell = $('.emap-upload-cell-edit', block);
                        // 添加操作图标
                        editCell.removeClass('emap-upload-cell-edit_3 emap-upload-cell-edit_4');
                        if (_canPreview(result.name, options)) {
                            editCell.addClass('emap-upload-cell-edit_4');
                        } else {
                            editCell.addClass('emap-upload-cell-edit_3');
                        }
                    }, 250);
                }, 2000);
            } else if (options.displayType == 'file') {
                block.removeClass('loading').addClass('success').data('filedata', result);
                _resizeFilenameLength(block);
                setTimeout(function() {
                    block.addClass('normal'); //removeClass('success').
                    //状态改变后重新计算filename长度
                    _resizeFilenameLength(block);
                    $('[emap-role="upload-down"]', block).attr('href', result.tempFileUrl);
                }, 2000);
            }

            // 对重新上传的处理
            if (options.reloadBlock) {
                // options.list.trigger('_uploadDelete', [options.reloadBlock.id, options.reloadBlock.type]);

                options.reloadBlock = null;
            }

            options.wrap.trigger('bh.file.upload.done', data);

        },

        // 上传出错将block 变为error状态
        errorBlock: function(res, options) {
            var bhId = res.files[0].bhId;
            var result = res.result || {
                "error": "已取消"
            }; // 点击取消上传时, res 没有result, 此时错误提示应为 已取消
            var block = $('[data-bhid=' + bhId + ']', options.list);
            if (options.displayType == 'image') {

                result.error = result.error || '上传失败';
                block.removeClass('success loading').addClass('error');
                $('.emap-upload-error-text', block).text(result.error);
                if (options.limit == 1) {
                    $('.emap-upload-btn-button', options.wrap).attr('disabled', false);
                }

            } else if (options.displayType == 'file') {

                if (options.limit == 1) {
                    $('.emap-upload-btn-button', options.wrap).attr('disabled', false);
                }
                //错误、失败两种状态
                if (result && result.error) {
                    block.removeClass('success loading').addClass('error');
                    $('.result-fail', block).text(result.error);
                } else {
                    block.removeClass('success loading').addClass('fail');
                    $('.result-fail', block).text('上传失败！');
                }

                //状态改变时重新计算文件名长度
                _resizeFilenameLength(block);

            }
        },

        editBlock: function() {

        }
    };

    // 判断是否为block模式下的单文件上传
    function _isSingleBlock(options) {
        if (options.displayType && options.buttonType && options.limit) {
            return options.displayType === 'image' && options.buttonType === 'block' && options.limit === 1;
        } else {
            return false;
        }
    }

    // 文件列表模式下重新计算文件名长度
    function _resizeFilenameLength(block) {
        //重置长度
        $('.filename', block).css('max-width', '');

        block = $(block);
        //总长
        var totalWidth = block.get(0).clientWidth;
        //偏移
        var offset = 80;
        if (block.hasClass('normal') || block.hasClass('saved')) {
            offset = 180;
        }

        //其它元素宽度
        var otherWidth = 0;
        $('.filename', block).siblings().each(function() {
            otherWidth += this.offsetWidth;
        });
        //剩余长度
        var remainWidth = totalWidth - otherWidth - offset;
        //文件名原长度
        var oWidth = $('.filename', block).get(0).offsetWidth;

        if (oWidth > remainWidth) {
            $('.filename', block).css('max-width', remainWidth + 'px');
        }
    }

    // loading icon gif base64
    function _getLoadingGIF() {
        return 'data:image/gif;base64,R0lGODlhIAAgAPYAAP///4qEhPz8/PHw8Ono6Orp6fb29v39/fr6+t7c3Lu3t6mkpK2pqcjFxevq6vn5+eTj46yoqIuFhZeSkvDv7/T09NLPz9XT0/j4+MnGxpWQkKKdnd7d3e/u7u3s7MG+vqWgoJyXl56ZmdbU1L+8vJCKipmUlNfV1bGtrfX19cfExJiTk4+JidjW1paRkeXk5JSOjo6IiJuWlsbDw+Lh4aahoZKMjL67u8zKysvJyZSPj8nHx93b25+bm9/e3s3Ly6ijo+zr69TS0uHg4Obl5efl5bOvr5qVlcrIyMPAwL66usTBwY2Hh+Df39nX18K/v87MzLm1tbq2ttza2u7t7bWystvZ2drY2MC9vejm5sXCwrKurqCcnOPi4vLx8fv7+/f39/Py8p2YmLazs7SxsfPz8725uQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAIAAgAAAH/4AAgoOEhYaHiImKi4yNjQeGCCkCjoYpBDQFKYMCHDMElYQeKgw1DA1BkAg5QAmhghUfKxK0Jh8VBwcOPBWFFR0PiQIJILTGGwmQALmEKUtGTgiIDxYhxrUW0ocEGyUKBogIFyLXEiEnlIcVz9GIBwQMLNcMRMrqHsGJBiMLGjYuC4RgeFXoAAYPLVSQ2OEDHMFBCCBkIJGBwwAD6Rwx45QggoYSAF+8cmDBAoVBAxSUu5GvUYUnE0zscEhgQbkFvRxRMEJLQc4CDMoxyNkIA5QaC0YMBGCgwQRjLnBkbGSACBGHyxwo2GBiA4mTDwtS4HAigQOMYQ89eGEhBy97iZg2uoOAQsYEED82xSVigcZSdSRgGAMyJC6HGi42ZEPUAUUMYyFGKEOAQRtTEiVoRaGCqIKCzLRA+AAgoAiSJCdyYlABg0kJKUQLdtSgo8eMAbqMwCjRwwK4d0ZqGJkytdCDBDM+WOhwQJwMY0Y8CDrgoUkBy4gEVKiQD4GQI7RKRCcENxQB3bwt/E1LmsYMJSbZFxJggLujQAAh+QQJCgAAACwAAAAAIAAgAAAH/4AAgoOEgwcVVFQpB4WNjo4PEEkoKEsvD4+ZjQI0RhoSEhpGEAKapgAVSxOgoBNJFaeFBg4EFQJBRkysoEZBsYIHDg0oDFhNREa7EiW9vwADJKsSOihOSdKgLq+CFRWMjwI8G7sTGTwoMKA2W0OlqUkDmQhCIcokFUVaDAwzBAjcUaI4yCTAyjhWK3JgQpAiBYJvAG4FKZWJgpJPEmAwgOBM3osnDCIoSIChYyMMBYYQCUKg1j+ThDA4MbIAhQVbMAsdGBKhBKgNJyDGQgDBAgGKD35gK0ECk7MORkIogAXgAY6lTTt6iCKDRDwAB5r0lMBiQwuhpxB0MUoRgAEnVZxq3syJFgDKIQQM5NQk4IAADA/q7nXLAQkUf6ceOOR7ZcGKI1GyCB6UwgKJESUfVVCQTsIRKE4dHbDSo0SNJhWjsJqAJHPEtmBHmJDAZUomDDhEMIGxIEGpAwWECCnQtoOSCEu+asYRRcoVvQA8SDGxIgoVQhVqmTqAgQJOsDx6gOrBY7LJISBAgRhivmOFHCFzUB2MvUiR+fQHBwIAIfkECQoAAAAsAAAAACAAIAAAB/+AAIKDhIUAB4aJiokHFUVdQQ+Lk4YHDksLNUYjFZSeABRPKxISJUAtkgcPGAieDwMFAwgCPkBMpBI6HwMYRBY4Jw4CixhOClsKPBUtXLilUQQnWyImGwovX4m0CyUlOgwJTRHOLk8XESW4LgpUiQYNOrgmOUEqR6QsEU4ZJs4SCxwQFUqRBAYuDRkMVLBghMGHLhWWxHO2ocWwQghOcIkhgQkIJ4gOKMQA4AGUe7hYAPFxsVAFFQt6RMgxQFEXFDbkfeigCEGFJi2GVBBoCMMVIz1CbLhBpJUhBBhCEu1ZwIkQHhSmCsJAQIiQAi09IZilrcmWEDKMQPhUSFW2QQa1VGggpUGLU7YAPEBxYmBQBRLpSim4y5YGil2DEFjg0m2DhbCfKnBoSqgCDiNGLNTEO+lACg8OOnEeTdoTBgNaSw86QADJEh+SKKUg4CU1oQ5RNMAACLnQgxw1lFCYBGEDKRNQYitKoQBGhCKTgmyBUeLj3QcUhg4ScEUKFNGKHjiJknkzAAwjoiQhQNQnSUoIKATpO8jBuCM53qsmVIBBiSM46LefIAZcoB57AxaCQXaEJUhaIAAh+QQJCgAAACwAAAAAIAAgAAAH/4AAgoOEhQcCB4WKi4yCBgRTTRSJjZWFDxdbG0BLBJSWlQdEDCUSEmIZFaCKCGAIgggtYqYSJVEOAhVFEEEPlgMtGRdBAghOIrS2BQQqDAtRLSmNFSobGj1JHQceYzC1GxYvWEemJRFTr4tFC7Q1CQAITQoLDBYePDW0EhpJqosvNZiY2mBF0IEKHSg8ENCihz5bHhhVUGCihIkoBBg1WVDKlIkZ/hQdeKHCyJImvhYN0NIjhgQYKDikW3TQQYWZigQ4yGGEgQIhQVLgXLUIQ5AuV3AsyXBlwCcwHQYMtXQAgoIeLkwAQeJvAI4tRloYIAqgAgkX+jZcACBgCoiXDLUyEiWQTx8MBfAshBjogywBhw/JADhAA8WEIwqCkA0SgYU+HUkEpeDRAAeRqY0e5GhpCgaDIYMQpDDwiaiHHQt6bIhyZSxZRge7OJlCAMNrUAdKK6pQIIxuRohAdViyQIEnS0GQJMA86MAVLqcspGyUYIEK17B9RNAB5MpMASlsEwJGRIClFC1ICAkp4EUDCyEFBQeFoMKDTwZUHInQ5fftQQ9YUANG/1VCAQcviFcgcP4tWGAgACH5BAkKAAAALAAAAAAgACAAAAf/gACCg4SFhoeIiQAYQURBD4qRhQ88UREKPBiSkgcFRjASMFFFB4OlmwgPpwc+GxKvQDwCAAgdRUGaiQcOFxZEkAcvESUSJQxdAgYJCgxRIxWJHVg9MlEQpRU/QGILFhUIQ1s6oQtWkIdDNa89FucVHBZN0Bg/Mq8SKzPQhgdEwxIbTpwTdAqAgRxH7rl4MgBRCgsoIjToULAQAh4LSjApAUJILn4ViNAYUNFQBQsMNkTYQVHRgZKHBFR4YYUHgQEYYG4CmWDHEgsEEBR6uXMQghYoTGgQoYDAqQdELFjZt7ODEWKvTGRIAWCXAjEgLgyUBKHHvWJGOnSFsECCCxVcyHcScXWvRBQqgjwkqcFgitCdA6KMeyUGSS4BHXy8MFCUVoIqXEKASFKg4AEBOhEdMBAEQgsoP1oEmdWYEAICOaKgUGDBQc7ShYJgEfEKxgIhcQ8d6PDCS2YEFjYwuSeKAGlDHT4sQEK1kAEtg++BsHK8EIEtExSoPZRiSfRXNaZUJ1Thwo1MhAS8Bs7lrA4jpBI9+Jb+BVBBQZ70sFFCQwTcpT0AkROlCFAADlEYocAJze0kgH0OmFKBAwVQ8FFpAqgC24YcdhgIACH5BAkKAAAALAAAAAAgACAAAAf/gACCg4SFhoeIiYIHD1+Kj4cYL0JTFAKQmAddRj1AOQOYkA9QJhIlW0QHgweqkAeXgw8WMqZGBKoHFC9EFa2IBl1XQbACRWYgDBYVAAcESgsRM0G+hQIJWyBJHoMIDlMQvQApSLQSG0IYiBgNExILPtSFFAolEhIrWsuHCC0RPQq3ElVoUIoFF2UCr1jo8kARAghSNtTAQgDWoQMIMFhM9IDAFR4OGobKxOrBg40jESEIcuXECwOEDmCogCAlAAEQonDpkQwmswpCZjQRGWrAk3amUEAQhGAIChkfQI0kgKKevR4nBhFQEAGKvlBBolhlAoIHtwJdpI5MIQSIDhgiyT50KBTP1QMPFqJE2VGkps1BAgb4GNGiCwECFVCmPBAkw4IeIG4wfFS3UAoLG+xJCJFkrkAeBPwCAFNg14AvBaLA0CwhwpDKN4cwyFCGGYUfDLiAUJCgSVXWC5rAZoxkCoYDFTBrnmDkwo0VmmFEIaDoQIqGOH9rlpGhRZUjOiZEuJAilAAeNVhLgIHFwZAdCpJM+QpJQJMITFjrmEGzQocK6aQUhBIuaBYDCC0Q9RcADzRhhAklwACCCp4tGMsLGUShxAUdKFZIIAAh+QQJCgAAACwAAAAAIAAgAAAH/4AAgoOEhYaHiImKi4wCFR0pB4yTggUZChYVlIwIFhsaKBCSm4mdIiULNKMAGBQUD4wYYbCDBElGUJqCFRZSCk4pigZXWjwYgwgUBRUCggddDDAuRkTNiARGRwpBig8jIRISNTwIiQMqEUgDis8MLiZRRauGAg4cQdaJBk4kT8aLBwTMS/SAwgBapBIq7DaAgoGBACBOqiAkSpQfHlY9cABB16YHToDAkLABioFBA3ZEaSIxUYUMLsKViEJlUIoTOwi0RGTgBzgJLpR4ZFWhHKkDL6L0EIGixTFDAXcaegDhRw4eQwUJoOBjxBUCJxcJEIAgRQWEg+qpWMBlQ5QrYdEPpSiSoGPLCkh6lAinwQiNfIQqjDBSg0GODhAP0EARrnGIHBUOgPFSFAACDhFGlthgIVghBFNqxGgsQQMWBzRUGMEUpAKUnxJ0KOkAdQgD0hJWLJlixESJElxUELHQo/GED7QNeXhigonMBRYyyCC9oAUHIy5KwAAyIi4hBEOicJkQIgKUISR0kBZhYcAUKSiMWKCQCMPwGTmmuJqxgvSGFghgQEAXBETGDgYVpFDOAzwssFduUhAwSEALpWDBFhvUoMAQaC0kiH1XcNCBUYoEAgAh+QQJCgAAACwAAAAAIAAgAAAH/4AAgoOEhYaHiImKi4wAB18HjZIADwQ+HZGTi0FPKFAVmotEKCEfA4QPBg+Nj5mCFRZPPBiDFS0NLaCKAh0+A64CKRS0ggJDDCYMCQiKBhZbLcSICE5cEhsXq4kPTTtEzIkHBQoRJASuiBgV2ooIlgTshQcCCAIH6Lv26Q4+Vl0UAkIdejAESwQgKHZ4wLfoAAYMAQEIIBJlhQQJJUTk0NXInYUcPkClsNDjoskIRBgiCoJFxJEtHBAM+ODC5EUuHFQaOjBkwUUxPwxUaGDCpgQQTSI2JGBERwkQQh48uBKhhEkYChaySjEiCooMDu51QFJjAgwZDKZIa1SBSJcO4OB4nVCBRYUFHwUqKGV0z9CDCgVOfNgSBQeBvYUEVOigNxGCF1GOlIDBRUuHaUR2KMjwDVEKHEdsApkCjtABB1gkH1FQQGWFJzpsirBQIUUQAlRWCfDh8+ICHqUJVchQ9CKTDSOCXJCC4kMTDAiGVMW4wEfwQQg4MNDBRMLqJiMWwJBgIsqLBx1UbDCxYYnWQ7aiRGBAggMBmia5WDCAoICFJRYQcJ1pFRDAQRMO2KZEbBf1AIUBACBQAQWNLSLAhZHA0kN3JUTAQzwCRVjAEkBwwYAFFIRoCC9XXBCSToQEAgA7AAAAAAAAAAAA';
    }

    // 拼接上传 提示文字
    function _getInfoText(options) {
        var infoHtml = [];
        if (options.type && options.type.length > 0) {
            infoHtml.push('仅支持' + options.type.join(",").toLowerCase() + '类型文件');
        }
        if (options.size) {
            infoHtml.push('文件大小' + _getFileSize(options.size) + '以内');
        }
        return infoHtml.join('; ');
    }

    // 获取文件大小文字 自动转换单位
    function _getFileSize(size) {
        size = parseInt(size * 10) / 10;
        return size < 1024 ? size + ' KB' : parseInt(size / 1024 * 10) / 10 + 'MB';
    }

    // 获取文件block的状态
    function _getFileState(ele) {
        var stateArray = ['success', 'saved', 'normal', 'loading', 'error'];
        var stateArrayLen = stateArray.length;
        for (var i = 0; i < stateArrayLen; i++) {
            if (ele.hasClass(stateArray[i])) {
                return stateArray[i];
            }
        }
        return '';
    }

    function _isImage(fileName) {
        return /\.(jpg$|jpeg$|png$|gif$)/.test(fileName.toLowerCase());
    }

    function _canPreview(fileName, options) {
        options = options || {};
        var previewArray = ['gif', 'jpg', 'jpeg', 'png'];
        if (options.canPreviewPDF) {
            previewArray.push('pdf');
        }
        return previewArray.filter(function(item) {
            return new RegExp('.' + item + '$').test(fileName.toLowerCase())
        }).length > 0;
    }

    // 根据文件和配置信息状态 获取不同的class，控制block中可选的操作项
    function _getblockClass(fileName, options) {
        var readonly = options.readonly;
        var count;
        if (_canPreview(fileName, options)) {
            count = 4;
            if (readonly) {
                count = 2;
            }
        } else {
            count = 3;
            if (readonly) {
                count = 1;
            }
        }
        return 'emap-upload-cell-edit_' + count;
    }

    // 根据文件后缀名获取展示的icon图片地址
    function _getIconByFileName(fileName) {
        var urlMap = {
            "(doc|docx)": "doc",
            "(xls|xlsx)": "xls",
            "(ppt|pptx)": "ppt",
            "psd": "psd",
            "zip": "zip",
            "other": "other"
        };

        for (var k in urlMap) {
            if (new RegExp('.' + k + '$').test(fileName)) {
                return urlMap[k];
            }
        }
        return urlMap['other'];
    }

    function _isSupportRate() {
        return false;
    }

    function _isPDF(fileName) {
        return /\.pdf$/.test(fileName.toLowerCase());
    }

    function eventBind(options) {
        if (options.buttonType == 'block') {
            // 上传按钮为block 形式下, hover上去显示 上传说明的气泡弹窗
            options.list.on('mouseover', '.emap-upload-btn-wrap', function() {
                if ($.bhPopOver) {
                    $.bhPopOver({
                        selector: $(this),
                        title: null,
                        showCloseButton: false,
                        width: 200,
                        content: '<p>' + _getInfoText(options) + '</p>'
                    })
                }
            }).on('mouseout', '.emap-upload-btn-wrap', function() {
                $.bhPopOver.close();
            });
        }

        // 点击上传按钮 清空 重新上传状态
        $('[emap-role="upload-input"]', options.wrap).on('focus', function() {
            options.reloadBlock = null;
        });

        // 点击删除
        options.list.on('click', '[emap-role="upload-delete"]', function(e) {
            var block = $(this).closest('.emap-upload-block-wrap');
            //有回调删除，调用回调删除；没有时采用事件机制
            if (options.deleteFileCallback) {
                options.deleteFileCallback(block.data('fileid') || block.data('bhid'), _getFileState(block), false, options).fail(function() {
                    //删除失败，请稍后重试
                    if ($.bhPopOver) {
                        $.bhPopOver({
                            selector: $(block),
                            width: 220,
                            title: null,
                            content: '<p class="bh-mb-16"><i class="iconfont icon-info bh-color-danger"></i>文件删除失败</p>' +
                                '<div class="emap-upload-loading-popover bh-text-center">' +
                                '<a class="bh-btn bh-btn-primary bh-mh-8" emap-role="upload-pop-confirm" href="javascript:void(0)">确定</a>' +
                                '</div>',
                            ready: function(popover) {
                                // 确定
                                popover.on('click', '[emap-role="upload-pop-confirm"]', function() {
                                    $.bhPopOver.close();
                                });
                            }

                        });
                    } else {
                        console && console.info('文件删除失败，重新上传取消');
                    }

                });
            } else {
                options.list.trigger('_uploadDelete', [block.data('fileid') || block.data('bhid'), _getFileState(block)]);
            }
        });

        //  点击下载
        options.list.on('click', '[emap-role="upload-down"]', function() {
            var block = $(this).closest('.emap-upload-block-wrap');
            if (block.hasClass('success')) {
                // 临时文件
                window.open(block.data('filedata').tempFileUrl);
            } else if (block.hasClass('saved') || block.hasClass('normal')) {
                // 正式文件
                window.open(block.data('filedata').fileUrl);
            }
        });

        // 点击取消上传
        options.list.on('click', '[emap-role="upload-cancel"]', function() {
            var target = $(this);
            if ($.bhPopOver) {
                $.bhPopOver({
                    selector: $(this),
                    width: 220,
                    title: null,
                    content: '<p class="bh-mb-16"><i class="iconfont icon-info bh-color-danger"></i>文件正在上传, 确认取消吗?</p>' +
                        '<div class="emap-upload-loading-popover bh-text-center">' +
                        '<a class="bh-btn bh-btn-primary bh-mh-8" emap-role="upload-pop-confirm" href="javascript:void(0)"><i class="iconfont icon-check"></i></a>' +
                        '<a class="bh-btn bh-btn-default bh-mh-8" emap-role="upload-pop-cancel" href="javascript:void(0)"><i class="iconfont icon-close"></i></a>' +
                        '</div>',
                    ready: function(popover) {
                        // 取消
                        popover.on('click', '[emap-role="upload-pop-cancel"]', function() {
                            $.bhPopOver.close();
                        });
                        // 确认
                        popover.on('click', '[emap-role="upload-pop-confirm"]', function() {
                            var xhr = $(target).closest('.emap-upload-block-wrap').data('xhr');
                            xhr.abort();
                            $.bhPopOver.close();
                            $(target).closest('.emap-upload-block-wrap').parent().find('.emap-upload-btn-wrap').removeClass('bh-hide');
                            $(target).closest('.emap-upload-block-wrap').remove();
                            //block.parent().find('.emap-upload-btn-wrap').removeClass('bh-hide');

                            if (_isSingleBlock(options)) {
                                $('.emap-upload-btn', options.list).parent().addClass('bh-hide');
                            }
                        });
                    }

                });
            }
        });

        // 对重新上传的处理
        options.list.on('change', 'input[type=file][name=reUpload]', function() {
            var block = $(this).closest('.emap-upload-block-wrap');
            var fileInput = $('[emap-role="upload-input"]', options.wrap);
            var files;
            options.reloadBlock = {
                element: block,
                id: block.data('filedata').id
            };

            if (block.hasClass('success')) {
                // 重新上传临时文件, 删除当前的临时文件
                options.reloadBlock.type = 'success';
            } else if (block.hasClass('saved') || block.hasClass('normal')) {
                // 重新上传正式文件, 将已有正式文件添加到 待删除数组
                options.reloadBlock.type = 'saved';
            }
            if ('FileReader' in window) {
                files = this.files;
            } else {
                files = [{
                    name: this.value
                }]
            }
            //有回调删除，采用回调方式先删除再上传；没有时，直接调用上传方法（原来的删除再上传方法中）
            if (options.deleteFileCallback) {
                options.deleteFileCallback(block.data('fileid') || block.data('bhid'), _getFileState(block), true, options).done(function() {
                    fileInput.fileupload('add', {
                        files: files
                    });
                    fileInput.fileupload('send');
                }).fail(function() {
                    //删除失败，请稍后重试
                    if ($.bhPopOver) {
                        $.bhPopOver({
                            selector: $(block),
                            width: 220,
                            title: null,
                            content: '<p class="bh-mb-16"><i class="iconfont icon-info bh-color-danger"></i>文件删除失败</p>' +
                                '<div class="emap-upload-loading-popover bh-text-center">' +
                                '<a class="bh-btn bh-btn-primary bh-mh-8" emap-role="upload-pop-confirm" href="javascript:void(0)">确定</a>' +
                                '</div>',
                            ready: function(popover) {
                                // 确定
                                popover.on('click', '[emap-role="upload-pop-confirm"]', function() {
                                    $.bhPopOver.close();
                                });
                            }

                        });
                    } else {
                        console && console.info('文件删除失败，重新上传取消');
                    }

                });
            } else {
                fileInput.fileupload('add', {
                    files: files
                });
                fileInput.fileupload('send');
            }

        });

        // 点击预览
        options.list.on('click', '[emap-role="upload-preview"]', function() {
            if (!$.bhGallery) {
                console && console.warn('图片轮播插件Gallery未引入');
                return;
            }
            var block = $(this).closest('.emap-upload-block-wrap');
            var imgSource = [];
            var imgUrlArr = [];
            var show = 0;
            var file_url;
            if (block.hasClass('saved') || block.hasClass('normal')) {
                file_url = block.data("filedata")['fileUrl'];
            } else if (block.hasClass('success')) {
                file_url = block.data("filedata")['tempFileUrl'];
            }

            // 预览pdf
            if (_isPDF(block.data("filedata")['name'])) {
                $.emapPDFViewer({
                    url: file_url
                });
                return;
            }

            // 预览图片
            $('.emap-upload-block-wrap:not(.emap-upload-btn-wrap)', options.list).each(function() {
                var file_data = $(this).data("filedata");

                if (_canPreview(file_data.name, options)) {
                    if (_isPDF(file_data.name)) return true;

                    if ($(this).hasClass('saved') || block.hasClass('normal')) {
                        imgUrlArr.push(file_data['fileUrl']);
                    } else if ($(this).hasClass('success')) {
                        imgUrlArr.push(file_data['tempFileUrl']);
                    }
                }
            });

            $(imgUrlArr).each(function(i) {
                if (file_url == this) {
                    show = i;
                }
                imgSource.push({
                    image: this
                })
            });
            $.bhGallery({
                dataSource: imgSource,
                show: show
            });


        });

        //文件排序
        options.list.parent().on('click', '[emap-role="sort-file"]', function(e) {
            var $delegate = $(e.delegateTarget);
            var $fileWrap = $delegate.find('.emap-upload-block-wrap:not(.emap-upload-btn-wrap)');
            if ($fileWrap.length) {
                if ($fileWrap.length === 1) {
                    $.bhTip && $.bhTip({
                        content: '只有一个文件，无法排序',
                        state: 'warning'
                    });
                    return;
                }
                var loading = $fileWrap.filter('div.error').length;
                var fail = $fileWrap.filter('div.loading').length;
                var num = loading + fail;
                if (num) {
                    var button = [{
                        text: '去处理',
                        className: 'bh-btn-primary',
                        callback: $.noop
                    }];
                    BH_UTILS.bhWindow('有' + num + '个文件正在上传或上传出错，无法排序！', '提示', button, {
                        width: 368,
                        height: 240
                    });
                    return;
                }
                $delegate.addClass('emap-upload-sorting');
                var $list = $delegate.find('[emap-role="upload-list"]');
                var sorter = Sortable.create($list[0], {
                    filter: '.emap-upload-btn-wrap',
                    dataIdAttr: 'data-bhid'
                });
                $delegate.data('sorter', sorter);
                $delegate.data('sorterOrder', sorter.toArray());
            } else {
                $.bhTip && $.bhTip({
                    content: '没有文件，无法排序',
                    state: 'warning'
                });
            }
        });

        //完成排序
        options.list.parent().on('click', '[emap-role="save-sort"]', function(e) {
            var $delegate = $(e.delegateTarget);
            var sorter = $delegate.data('sorter');
            sorter.destroy();
            $delegate.removeData('sorter');
            $delegate.removeData('sorterOrder');
            $delegate.removeClass('emap-upload-sorting');
        });

        //取消排序
        options.list.parent().on('click', '[emap-role="cancel-sort"]', function(e) {
            var $delegate = $(e.delegateTarget);
            var sorter = $delegate.data('sorter');
            var order = $delegate.data('sorterOrder');
            sorter.sort(order);
            sorter.destroy();
            $delegate.removeClass('emap-upload-sorting');
        });
    }
})(jQuery);
/**
 * 使用缓存的后端上传机制。
 * 注册名称为 'EMAP_IMPORT_CACHE',
 *
 * 必须包含的接口：
 *     - init(view, options) // 初始化
 *     - downloadImportTpl(opt, data) // 下载模板
 *
 * 可选支持的回调事件：
 *     - onUploading(result) // 正在上传
 *     - onRownumImported(resp) // rownum计算成功
 *     - onFileImported(json, opt) // 文件上传成功
 *     - onImportError() // 上传失败
 */
(function(win, undefined) {
    var importAdapter = {
        init: function(view, options, downTplData) {
            var fileReader = 'FileReader' in window;

            var callbacks = {
                add: function(e, data) {
                    var file = data.files;
                    var fileType = file[0].name.split('.');
                    var result = {
                        file: file,
                        fileReader: fileReader,
                        isSuccess: /^(xlsx|xlsm|xltx|xltm|xlsb|xlam|xls)$/i.test(fileType.slice(-1)[0])
                    };
                    options.onUploading && options.onUploading(result, data);
                    return false;
                },
                done: function(e, data) { //设置文件上传完毕事件的回调函数
                    var mid = data.result.id;
                    downTplData.attachment = data.result.id;
                    var params = {
                        attachmentParam: JSON.stringify({
                            scope: options.scope,
                            fileToken: options.token,
                            attachmentParam: {
                                storeId: downTplData.storeId
                            }
                        })
                    };
                    WIS_EMAP_UPLOAD.cacheCore.save(view, options, params).done(function() {
                        var data = $.extend(downTplData, {
                            app: downTplData.app,
                            attachment: mid
                        });
                        WIS_EMAP_UPLOAD.cacheCore.importRownum(options, data).done(function(resp) {
                            options.onRownumImported && options.onRownumImported(resp);

                            downTplData.read && delete downTplData.read;
                            if (downTplData.readTemplate) {
                                downTplData.read = downTplData.readTemplate;
                            }
                            downTplData.actionTemplate && (downTplData.action = downTplData.actionTemplate);

                            WIS_EMAP_UPLOAD.cacheCore.importFile(options, downTplData).done(function(json) {
                                options.onFileImported && options.onFileImported(json);
                            });
                        }).fail(function() {
                            options.onImportError && options.onImportError();
                        });
                    });
                }
            };
            WIS_EMAP_UPLOAD.cacheCore.init(view, options, callbacks);
        },
        downloadImportTpl: function(opt, data) {
            WIS_EMAP_UPLOAD.cacheCore.downloadImportTpl(opt, data);
        },
        getDownloadResultUrl: function(opt, result){ return WIS_EMAP_UPLOAD.cacheCore.getDownloadResultUrl(opt, result);}
    };

    win['EMAP_IMPORT_CACHE'] = importAdapter;
})(window);

/**
 * 不使用缓存，直接进行上传的后端上传机制【公有云业务提供】。
 * 注册名称为 'EMAP_IMPORT_DIRECT',
 *
 * 必须包含的接口：
 *     - init(view, options) // 初始化
 *
 * 可选支持的回调事件：
 *     - onUploading(result) // 正在上传
 *     - onRownumImported(resp) // rownum计算成功
 *     - onFileImported(json, opt) // 文件上传成功
 *     - onImportError() // 上传失败
 *
 * @example
 *     <caption>javascript</caption>
 *     $.emapImport({
 *         adapter: 'EMAP_IMPORT_DIRECT',
 *         uploadUrl: '', // 上传文件请求url
 *         rownumUrl: '', // 导入行号请求url
 *         fileImportUrl: '', // 导入文件请求url
 *         tplUrl: '' // 下载模板请求url，view直接下载
 *     });
 */
(function(win, undefined) {

    var _postData = function(url, data, method) {
        return $.ajax({
            type: method || 'POST',
            dataType: 'json',
            url: url,
            data: data
        });
    };

    var _importRownum = function(opts, data) {
        return _postData(opts.rownumUrl, data);
    };

    var _importFile = function(opts, data) {
        return _postData(opts.fileImportUrl, data);
    };

    var importAdapter = {
        /**
         * 初始化
         * @param {Object} view    包含file input控件的元素
         * @param {Object} options 初始化参数
         * @param {String} options.rownumUrl 导入行号请求url
         * @param {String} options.fileImportUrl 导入文件请求url
         * @param {String} options.templatUrl 下载模板请求url
         */
        init: function(view, options, downTplData) {
            var fileReader = 'FileReader' in window;

            var callbacks = {
                add: function(e, data) {
                    var file = data.files;
                    var fileType = file[0].name.split('.');
                    var result = {
                        file: file,
                        fileReader: fileReader,
                        isSuccess: /^(xlsx|xlsm|xltx|xltm|xlsb|xlam|xls)$/i.test(fileType.slice(-1)[0])
                    };
                    options.onUploading && options.onUploading(result, data);
                    return false;
                },
                done: function(e, data) { //设置文件上传完毕事件的回调函数
                    var mid = data.result.id;
                    downTplData.attachment = data.result.id;
                    var params = {
                        attachmentParam: JSON.stringify({
                            scope: options.scope,
                            fileToken: options.token,
                            attachmentParam: {
                                storeId: downTplData.storeId
                            }
                        })
                    };
                    WIS_EMAP_UPLOAD.directCore.save(view, options, params).done(function() {
                        var data = $.extend(downTplData, {
                            app: downTplData.app,
                            attachment: mid
                        });
                        _importRownum(options, data, options.ajaxType).done(function(resp) {
                            options.onRownumImported && options.onRownumImported(resp);

                            // 区分 下载模板和导入数据的read
                            downTplData.read && delete downTplData.read;
                            if (downTplData.readTemplate) {
                                downTplData.read = downTplData.readTemplate;
                            }
                            downTplData.actionTemplate && (downTplData.action = downTplData.actionTemplate);

                            _importFile(options, downTplData).done(function(json) {
                                options.onFileImported && options.onFileImported(json);
                            }).fail(function() {
                                options.onImportError && options.onImportError('import');
                            });
                        }).fail(function() {
                            options.onImportError && options.onImportError('rownum');
                        });
                    }).fail(function() {
                        options.onImportError && options.onImportError('upload');
                    });
                },
                fail: function(e, data) {
                    options.onImportError && options.onImportError('upload');
                }
            };
            WIS_EMAP_UPLOAD.directCore.init(view, options, callbacks);
        }
    };

    win['EMAP_IMPORT_DIRECT'] = importAdapter;
})(window);

(function () {
    var Plugin, _init;
    var _animateTime, _eventBind, _addTime, _cancelAddTime, _renderEasySearch, _renderQuickSearch,
        _renderInputPlace, _renderConditionList, _getSelectedConditionFromForm, _renderAdvanceSearchForm, _getSelectedConditionFromModal,
        _getSearchCondition, _findModel, _getConditionFromForm, _initSchema, _closeSchema, _renderFixedSchema, _schemaDialogEventBind,
        _refreshUnfixNum;
    /**
     * @module emapAdvancedQuery
     * @description 高级搜索, 通过监听search事件，进行搜索操作
     * @example
     $('#advancedQueryPlaceholder').emapAdvancedQuery({
        data: searchData
    });
    $('#advancedQueryPlaceholder').on('search', function(e, data, opts){
        // data 为序列化的搜索条件
        console.log(data);
        //调用表格reload方法
        $("#retirementInfoTable").emapdatatable('reload', {querySetting: JSON.stringify(data)});
    });
     */
    Plugin = (function () {
        function Plugin(element, options) {
            this.options = $.extend({}, $.fn.emapAdvancedQuery.defaults, options);
            this.$element = $(element);
            this.$element.attr("emap-role", "advancedQuery").attr("emap-pagePath", "").attr("emap-action", this.options.data.name);
            this.options._initCount = 0; // 需要初始化的控件的总数
            this.options._initCounter = 0; // 控件初始化计数器
            _init(this.$element, this.options);
        }

        /**
         * @method getValue
         * @description 获取高级搜索当前的搜索条件
         * @return {Stirng} 搜索条件Json字符串
         */
        Plugin.prototype.getValue = function () {
            return _getSearchCondition(this.options);
        };
        /**
         * @method setValue
         * @description 高级搜索赋值
         * @param {Object|String} 搜索条件
         */
        Plugin.prototype.setValue = function (condition) {
            var element = this.$element;
            var options = this.options;
            this.$element.emapAdvancedQuery('clear');
            var value = (typeof condition == "string") ? JSON.parse(condition) : condition;
            if (value.length > 0) {
                var formValue = {};
                $(value).each(function () {
                    if ($.isArray(this)) {
                        // 数组
                        $('[bh-advanced-query-role=advancedInput]', element).val(this[0].value);
                    } else {
                        var self = this;
                        var items = options.data.controls.filter(function (item) {
                            return item.name == self.name
                        });
                        var xtype = "";
                        if (items.length) {
                            xtype = items[0]['search.xtype'] || items[0].xtype;
                        }
                        // 对日期范围组建的兼容处理
                        if (xtype == 'date-range') {
                            var valItems = value.filter(function (m) {
                                return m.name == self.name;
                            });
                            if (valItems.length) {
                                formValue[this.name] = valItems.map(function (m) {
                                    return m.value;
                                }).join(',')
                            }
                        } else {
                            // 单独字段
                            formValue[this.name] = this.value;
                            if (this.value_display) {
                                formValue[this.name + '_DISPLAY'] = this.value_display;
                            }
                        }
                    }
                });
                _renderAdvanceSearchForm(this.options, formValue);
                WIS_EMAP_INPUT.formSetValue(element, formValue, this.options);
            }
        };

        /**
         * @method clear
         * @description 清空高级搜索条件
         */
        Plugin.prototype.clear = function () {
            var element = this.$element;
            var options = this.options;
            // 清空高级搜索
            $('[bh-advanced-query-role=advancedInput]', element).val('');
            $('[bh-advanced-query-role=advanceSearchForm] [xtype]', element).each(function () {
                var _this = $(this);
                var name = _this.data('name');
                var xtype = _this.attr('xtype');
                WIS_EMAP_INPUT.setValue(_this, name, xtype, "", options.contextPath);
            });
            // 清空简单搜索
            $('.bh-advancedQuery-quick-search-wrap input[type=text]', element).val('');
            $('[bh-advanced-query-role="quickSearchForm"] [xtype]', element).each(function () {
                var _this = $(this);
                var name = _this.data('name');
                var xtype = _this.attr('xtype');
                WIS_EMAP_INPUT.setValue(_this, name, xtype, "", options.contextPath);
            });
        };

        /**
         * @method updateTotalNum
         * @description 刷新全部数据条数
         */
        Plugin.prototype.updateTotalNum = function (num) {
            if (!this.options.showTotalNum) return;
            var numWrap = $('.bh-advancedQuery-totalNum-wrap', this.$element);
            if (numWrap.css('display') == 'none') {
                numWrap.show();
            }
            $('.bh-advancedQuery-totalNum span', numWrap).text(num);
        };

        return Plugin;
    })();

    _init = function (element, options) {
        element.attr("emap", JSON.stringify({
            "emap-url": WIS_EMAP_SERV.url,
            "emap-name": WIS_EMAP_SERV.name,
            "emap-app-name": WIS_EMAP_SERV.appName,
            "emap-model-name": WIS_EMAP_SERV.modelName
        }));
        delete WIS_EMAP_SERV.url;
        delete WIS_EMAP_SERV.name;
        delete WIS_EMAP_SERV.appName;
        delete WIS_EMAP_SERV.modelName;
        // contextPath 兼容
        options.contextPath = options.contextPath || WIS_EMAP_SERV.getContextPath();
        var modalData = options.data.controls;
        var easyArray = [];
        var quickArray = [];
        var guid = BH_UTILS.NewGuid();

        _animateTime = function () {
            return 450;
        };

        _eventBind = function (options, element) {
            var $advanced = options.$advanced;
            var $advancedModal = options.$advancedModal;
            $advanced.on("click", "[bh-advanced-query-role=addTime]", function () {
                _addTime($(this));
            });

            $advanced.on("click", "[bh-advanced-query-role=cancelAddTime]", function () {
                _cancelAddTime($(this));
            });

            // 展开高级搜索
            $advanced.on("click", "[bh-advanced-query-role=advancedOpen]", function () {
                $($advanced).addClass('bh-active');
                options.searchModel = 'advanced';
                if (document.documentMode == 9 && $.fn.placeholder) {
                    setTimeout(function () {
                        WIS_EMAP_INPUT.placeHolder();
                    }, 300);
                }
                WIS_EMAP_SERV && WIS_EMAP_SERV._resetPageFooter();
            });

            // 关闭高级搜索
            $advanced.on("click", "[bh-advanced-query-role=advancedClose]", function (event) {
                $($advanced).removeClass('bh-active');
                options.searchModel = 'easy';
                // 关闭高级搜索时, 清空高级搜索  6-1 zhuhui
                element.emapAdvancedQuery('clear');
                // 关闭高级搜索时, 触发一次简单搜索 5-13 zhuhui
                element.trigger('search', [_getSearchCondition(options, $(this).data('name')), options, event]);
                WIS_EMAP_SERV && WIS_EMAP_SERV._resetPageFooter();
            });

            // 删除搜索条件
            $advanced.on("click", "[bh-advanced-query-role=conditionDismiss]", function () {
                // 针对日期范围选择组件，删除时连同 范围选择的弹出框一同清除
                var inputRow = $(this).closest('.bh-advancedQuery-form-row');
                var inputItem = $('[xtype]', inputRow);
                if (inputItem.length && inputItem.attr('xtype') == 'date-range') {
                    inputItem.bhTimePicker('remove');
                }
                inputRow.remove();
            });

            // 弹出  添加搜索条件 弹框
            $advanced.on("click", "[bh-advanced-query-role=addCondition]", function () {
                _renderConditionList(options);
            });

            // easy搜索 监听 按键输入
            $advanced.on('keyup', '.bh-advancedQuery-quick-search-wrap input[type=text]', function (e) {
                var easySelectH = $advanced.data('easyarray').length * 28 + 1; // 下拉框高度
                var easySelectW = $(this).outerWidth(); // 下拉框宽度
                var searchValue = $(this).val();
                var pos = $(this).offset();
                var selectDiv = $('.bh-advancedQuery-quick-select[data-guid=' + options.guid + ']');
                pos.top += 28;
                // 回车快速搜索
                if (e.keyCode == 13) {
                    selectDiv.css({
                        'height': 0,
                        'border-width': '0'
                    });
                    element.trigger('search', [_getSearchCondition(options), options, e]);
                    return;
                }
                if (searchValue == '') {
                    selectDiv.css({
                        'height': 0,
                        'border-width': '0'
                    });
                } else {
                    $('.bh-advancedQuery-easy-query', selectDiv).html(searchValue);
                    selectDiv.css({
                        'height': easySelectH + 'px',
                        'width': easySelectW + 'px',
                        'border-width': '1px',
                        'top': pos.top,
                        'left': pos.left
                    });
                }
            });

            // 点击下拉快速搜索
            $('[bh-advanced-query-role=advancedEasySelect][data-guid=' + options.guid + ']').on('click', 'p', function (event) {
                var selectDiv = $(this).closest('[bh-advanced-query-role=advancedEasySelect]');
                if (selectDiv.height() > 0) {
                    selectDiv.css({
                        'height': 0,
                        'border-width': '0'
                    });
                }
                element.trigger('search', [_getSearchCondition(options, $(this).data('name')), options, event]);
            });

            // 点击搜索按钮  easy search
            $advanced.on('click', '[bh-advanced-query-role=easySearchBtn]', function (event) {
                element.trigger('search', [_getSearchCondition(options), options, event]);
            });

            // 点击筛选条件  quick search
            $advanced.on('click', '[bh-advanced-query-role=quickSearchForm] .bh-label-radio', function (event) {
                // radio 的事件冒泡问题
                setTimeout(function () {
                    element.trigger('search', [_getSearchCondition(options), options, event]);
                }, 200);
            });

            //监听普通搜索里时间选择框selected事件
            $advanced.on('selectedTime', '.bh-advancedQuery-quick div[xtype="date-range"]', function (event) {
                var searchCondition = _getSearchCondition(options);
                element.trigger('search', [searchCondition, options, event]);
            });

            // 执行高级搜索
            $advanced.on('click', '[bh-advanced-query-role=advancedSearchBtn]', function (event) {
                _getSearchCondition(options);
                element.trigger('search', [_getSearchCondition(options), options, event]);
            });

            // 监听 控件初始化事件  bhInputInitComplete, 根据计数器options._initCounter 判断出发高级搜索组件的 初始化回调
            element.one('_init', function () {
                element.trigger('init', [options]);
                options.initComplete && options.initComplete();
            });

            // easySearch 下拉框的关闭
            $(document).on('click', function (e) {
                var target = e.target;
                if ($(target).closest('[bh-advanced-query-role=advancedEasySelect]').length == 0) {
                    var selectDiv = $('.bh-advancedQuery-quick-select');
                    selectDiv.css({
                        'height': 0,
                        'border-width': '0'
                    });
                }
            });

            // 点击保存为搜索方案
            $advanced.on('click', '[bh-advanced-query-role=saveSchema]', function () {
                $(this).closest('.bh-schema-btn-wrap').addClass('active');
            });

            // 点击取消保存搜索方案
            $advanced.on('click', '[bh-advanced-query-role=saveSchemaCancel]', function () {
                _closeSchema(options);
            });

            // 点击确认保存搜索方案
            $advanced.on('click', '[bh-advanced-query-role=saveSchemaConfirm]', function () {
                var name = $('.bh-schema-name-input', $advanced).val();
                var conditionData = _getSearchCondition(options, undefined, true);
                var fixed = $('[bh-schema-role=fixCheckbox]', $advanced).prop('checked') ? 1 : 0;
                var programContainer = $('.bh-rules-program', $advanced);
                element.emapSchema('saveSchema', [name, conditionData, fixed]).done(function () {
                    _closeSchema(options);
                    var schInfo = options.schemaList.filter(function (val) {
                        return val.SCHEMA_NAME == name;
                    })
                    var sameSch = false;
                    if (schInfo.length > 0) {
                        sameSch = true;
                    }
                    // 判断是否有重名的方案  如果有  直接覆盖
                    if (sameSch) {
                        // 重名方案
                        options.schemaList.filter(function (val) {
                            if (val.SCHEMA_NAME == name) {
                                val.CONTENT = conditionData;
                                val.FIXED = fixed;
                            }
                        })
                    } else {
                        schInfo = {
                            "CONTENT": conditionData,
                            "SCHEMA_NAME": name,
                            "FIXED": fixed
                        };
                        options.schemaList.push(schInfo);
                    }
                    if (fixed == 1) {
                        if (sameSch) {
                            // 固定方案中的重名方案
                            $('.bh-rules-program a[data-name=' + name + ']', element).data('info', {
                                "CONTENT": conditionData,
                                "SCHEMA_NAME": name,
                                "FIXED": fixed
                            });
                        } else {
                            var sch = $('<a  data-name="' + name + '" href="javascript:void(0)">' + name + '</a>');
                            sch.data('info', schInfo);
                            $('.bh-rules-program [bh-schema-role=more]', element).before(sch);

                        }
                    } else {
                        var sch = $('.bh-rules-program', element).find('a[data-name=' + name + ']');
                        if (sch.length > 0) {
                            sch.remove()
                        }
                    }
                    programContainer.show();
                }).fail(function (res) {
                    console && console.log(res)
                });
            });

            // 点击方案的 更多按钮 呼出方案列表侧边弹窗
            $advanced.on('click', '[bh-schema-role=more]', function () {
                if ($('main > article aside').length == 0) {
                    $('main > article').append('<aside></aside>');
                }
                $.bhPropertyDialog.show({
                    // "title": "高级搜索方案", //侧边栏的标题
                    "content": '<h3>高级搜索方案</h3>' +
                        '<section>' +
                        '<div id="schemaDialog" style="display: none;">' +
                        '<p class="bh-color-caption">置顶方案(将直接出现在搜索栏上)</p>' +
                        '<ul class="bh-schema-list" bh-schema-role="fixedUl">' +
                        '</ul>' +
                        '<p class="bh-color-caption">其他方案(<span>4</span>)</p>' +
                        '<ul class="bh-schema-list" bh-schema-role="unFixedUl"></ul>' +
                        '</div>' +
                        '</section>', //侧边栏的内容html
                    "footer": '', //侧边栏的页脚按钮
                    ready: function () { //初始化完成后的处理
                        var fixedUl = $('[bh-schema-role=fixedUl]');
                        var unFixedUl = $('[bh-schema-role=unFixedUl]');
                        $(options.schemaList).each(function () {
                                var liHtml;
                                liHtml = $('<li data-name="' + this.SCHEMA_NAME + '">' +
                                    '<a href="javascript:void(0)" class="bh-pull-right" bh-schema-role="delete">删除</a>' +
                                    '<a href="javascript:void(0)" class="bh-pull-right" bh-schema-role="unfixed">取消置顶</a>' +
                                    '<a href="javascript:void(0)" class="bh-pull-right" bh-schema-role="fixed">置顶</a>' +
                                    this.SCHEMA_NAME +
                                    '</li>').data('info', this);
                                if (this.FIXED == 1) {
                                    fixedUl.append(liHtml);
                                } else {
                                    unFixedUl.append(liHtml);
                                }
                                _refreshUnfixNum(unFixedUl);
                            })
                            // 处理保存方案的排序
                        var fixedSchema = $('.bh-rules-program a:not([bh-schema-role="more"])', options.$advanced);
                        if (fixedSchema.length > 0) {
                            fixedSchema.each(function () {
                                var condition
                                var schemaName = $(this).data('info').SCHEMA_NAME;
                                fixedUl.append($('li[data-name=' + schemaName + ']'));
                            });
                        }
                        if (options.schemaList.length == 0) {
                            $('#schemaDialog').length > 0 && $('#schemaDialog').hide()
                        } else {
                            $('#schemaDialog').length > 0 && $('#schemaDialog').show()
                        }
                        _schemaDialogEventBind(element, options);
                    }
                });
            })

            // 点击快速方案
            $advanced.on('click', '.bh-rules-program a:not([bh-schema-role=more])', function (event) {
                var condition = $(this).data('info');
                element.emapAdvancedQuery('setValue', condition.CONTENT);
                element.trigger('search', [JSON.stringify(filterCondition(condition.CONTENT)), options, event]);
                $.bhTip && $.bhTip({
                    content: condition.SCHEMA_NAME + ' 方案执行成功',
                    state: 'success',
                    iconClass: 'icon-checkcircle'
                });
            });

            // 点击清空按钮
            $advanced.on('click', '[bh-advanced-query-role=clearBtn]', function (event) {
                $(element).emapAdvancedQuery('clear');
                element.trigger('search', [_getSearchCondition(options), options, event]);
            });
        };

        // 更新未置顶的方案个数
        _refreshUnfixNum = function (ul) {
            var count = $('li', ul).length;
            ul.prev('p').find('span').html(count);
            if (count == 0) {
                ul.hide().prev('p').hide()
            } else {
                ul.show().prev('p').show()
            }
            var fixedUl = $(ul).siblings('[bh-schema-role=fixedUl]');
            if ($('li', fixedUl).length == 0) {
                fixedUl.hide().prev('p').hide();
            } else {
                fixedUl.show().prev('p').show();
            }
        };

        _addTime = function ($item) {
            var $groupParent = $item.closest(".bh-advancedQuery-addBlock");
            $groupParent.addClass("bh-active");
            var $addTime = $groupParent.children("div[bh-advanced-query-role=addTime]");
            $groupParent.children("div[bh-advanced-query-role=addTimeGroup]").show();
            $addTime.hide();
        };

        _cancelAddTime = function ($item) {
            var $groupParent = $item.closest(".bh-advancedQuery-addBlock");
            $groupParent.removeClass("bh-active");
            var $addTimeGroup = $groupParent.children("div[bh-advanced-query-role=addTimeGroup]");
            $addTimeGroup.removeClass("bh-entryLeft").addClass("bh-outLeft");
            $groupParent.children("div[bh-advanced-query-role=addTime]").addClass("bh-entryRight").show();
            setTimeout(function () {
                $addTimeGroup.removeClass("bh-outLeft").addClass("bh-entryLeft").hide();
            }, _animateTime());
        };

        _renderEasySearch = function (easyArray, options) {
            var easySearch = '';
            var easySearchPlaceholder = ''; // easySearch 文本框placeholder
            if (easyArray.length && easyArray.length > 0) {
                easySearchPlaceholder += '请输入';
                $(easyArray).each(function () {
                    easySearchPlaceholder += this.caption + '/';
                    easySearch += '<p data-name="' + this.name + '">搜索 <span class="bh-advancedQuery-easy-caption">' + this.caption + '</span> : <span class="bh-advancedQuery-easy-query"></span></p>';
                });
                $('.bh-advancedQuery-quick-select[data-guid=' + options.guid + ']').html(easySearch);
                easySearchPlaceholder = easySearchPlaceholder.substring(0, easySearchPlaceholder.length - 1);
                $('.bh-advancedQuery-quick-search-wrap input[type=text]', options.$advanced).attr('placeholder', easySearchPlaceholder);
            } else {
                $('.bh-advancedQuery-inputGroup', options.$advanced).hide();
            }
        };

        _renderQuickSearch = function (quickArray) {
            var quickSearchHtml = $('<div></div>');
            $(quickArray).each(function (i) {
                // 应业务线需求将快速搜索中的多选下拉放出  不做类型转换  zhuhui 0722
                if (this.xtype == 'select' || this.xtype == 'radiolist' || this.xtype == 'checkboxlist' || this.xtype == 'multi-select2') {
                    this.xtype = 'buttonlist';
                }
                // 添加 quickSearchXtype属性, 表示字段在 快速搜索中展示的类型 zhuhui 0725
                if (this['search.quickSearchXtype']) {
                    this.xtype = this['search.quickSearchXtype'];
                }
                quickSearchHtml.append(_renderInputPlace(this));
            });
            return quickSearchHtml;
        };

        _renderInputPlace = function (item, showClose) {
            //showClose  是否显示 关闭按钮
            var _this = item;
            _this.get = function (attr) {
                if (_this['search.' + attr] !== undefined) {
                    return _this['search.' + attr];
                } else {
                    return _this[attr];
                }
            };
            var xtype = _this.get("xtype");
            var caption = _this.get("caption");
            var builder = _this.get("defaultBuilder");
            var url = _this.get("url");
            var name = _this.get("name");
            var hidden = _this.get("hidden") ? "hidden" : "";
            var placeholder = _this.get("placeholder") ? _this.get("placeholder") : "";
            var checkType = _this.get("checkType");
            var checkSize = _this.get("checkSize");
            var dataSize = _this.get("dataSize");
            var checkExp = _this.get("checkExp");
            var JSONParam = _this.get("JSONParam");
            var format = _this.get("format") ? _this.get("format") : 'yyyy-MM-dd';
            var controlHtml = $(' <div class="bh-advancedQuery-form-row bh-advancedQuery-h-28">' +
                '<div class="bh-advancedQuery-groupName">' + caption + '：</div>' +
                '<div class="bh-advancedQuery-groupList bh-label-radio-group">' +
                '</div>' +
                '</div>');

            if (showClose) {
                controlHtml.append('<a class="bh-bh-advancedQuery-group-dismiss" bh-advanced-query-role="conditionDismiss"> ' +
                    '<i class="icon-close iconfont"></i>' +
                    '</a>');
            }
            var inputHtml = '';
            switch (xtype) {

                case "tree":
                case "multi-tree":
                    inputHtml += '<div xtype="{{xtype}}" data-name="{{name}}" data-builder="{{builder}}" data-caption="{{caption}}" data-url="{{url}}" {{hidden}} style="max-width: 300px;"></div>';
                    break;
                case "date-local":
                case "date-range":
                    inputHtml += '<div xtype="{{xtype}}" data-builder="{{builder}}" data-caption="{{caption}}" data-name="{{name}}" data-format="{{format}}" {{hidden}} style="max-width: 300px;"></div>';
                    break;
                case "date-ym":
                    inputHtml += '<div xtype="{{xtype}}" data-builder="{{builder}}" data-caption="{{caption}}" data-name="{{name}}" data-format="YYYY-MM" {{hidden}}></div>';
                    break;
                case "date-full":
                    inputHtml += '<div xtype="{{xtype}}" data-builder="{{builder}}" data-caption="{{caption}}" data-name="{{name}}" data-format="yyyy-MM-dd HH:mm" {{hidden}}></div>';
                    break;
                case "switcher":
                    inputHtml += '<div xtype="{{xtype}}"  data-builder="{{builder}}" data-caption="{{caption}}" data-name="{{name}}" {{hidden}}></div>';
                    break;
                case "radiolist":
                    inputHtml += '<div xtype="{{xtype}}" data-name="{{name}}" class="bh-radio" data-url="{{url}}" data-builder="{{builder}}" data-caption="{{caption}}" {{hidden}}></div>';
                    break;
                case "checkboxlist":
                    inputHtml += '<div xtype="{{xtype}}" data-name="{{name}}" class="bh-checkbox" data-url="{{url}}" data-builder="{{builder}}" data-caption="{{caption}}" {{hidden}}></div>';
                    break;
                case "buttonlist":
                case "multi-buttonlist":
                    inputHtml += '<div xtype="{{xtype}}" data-name="{{name}}" data-url="{{url}}" data-builder="{{builder}}" data-alloption={{allOption}} data-caption="{{caption}}" {{hidden}} ></div>';
                    break;
                case "select":
                case "multi-select":
                case "multi-select2":
                    inputHtml += '<div xtype="{{xtype}}" data-name="{{name}}" data-url="{{url}}" data-builder="{{builder}}" data-alloption={{allOption}} data-caption="{{caption}}" {{hidden}} style="max-width: 300px;"></div>';
                    break;
                case 'number':
                case 'number-range':
                    inputHtml += '<div xtype="{{xtype}}" data-name="{{name}}" data-url="{{url}}" data-builder="{{builder}}" data-caption="{{caption}}" {{hidden}} style="max-width: 300px;"></div>';
                    break;
                default:
                    inputHtml += '<input class="bh-form-control" data-name="{{name}}" name="{{name}}" data-builder="{{builder}}" data-caption="{{caption}}" xtype="text" type="text" {{hidden}} />';
                    break;
            }
            inputHtml = inputHtml.replace(/\{\{xtype\}\}/g, xtype)
                .replace(/\{\{name\}\}/g, name)
                .replace(/\{\{builder\}\}/g, builder)
                .replace(/\{\{caption\}\}/g, caption)
                .replace(/\{\{url\}\}/g, url)
                .replace(/\{\{hidden\}\}/g, (hidden ? 'style="display:none;"' : ''))
                .replace(/\{\{allOption\}\}/g, options.allowAllOption)
                .replace(/\{\{format\}\}/g, format);
            inputHtml = $(inputHtml);
            if (JSONParam) {
                inputHtml.data('jsonparam', JSONParam);
            }
            $('.bh-advancedQuery-groupList', controlHtml).html(inputHtml);
            return controlHtml;
        };

        _getSelectedConditionFromForm = function (options) {
            var selectedForm = $('[bh-advanced-query-role=advanceSearchForm]', options.$advanced);
            var selectedArr = [];
            $('[xtype][data-name]', selectedForm).each(function () {
                selectedArr.push($(this).data('name'));
            });
            return selectedArr;
        };

        _renderConditionList = function (options) {
            var modalArray = options.$advanced.data('modalarray');
            // 获取已选condition 数据
            var selectedArr = _getSelectedConditionFromForm(options);

            var columns = [];

            $(modalArray).each(function () {
                var colItem = {};
                colItem.hidden = $.inArray(this.name, selectedArr) == -1;
                colItem.text = this.caption;
                colItem.datafield = this.name;
                columns.push(colItem);
            });

            $.bhCustomizeColumn({
                model: modalArray,
                modelType: 'search',
                columns: columns,
                title: '添加搜索字段',
                callback: function (col) {
                    var colData = {};
                    col.map(function (item) {
                        if (!item.hidden) {
                            colData[item.name] = "";
                        }
                    });
                    _renderAdvanceSearchForm(options, colData);
                    setTimeout(function () {
                        // 若表单字段有变动则 弹出tip 弹窗
                        if (options._changeCounter > 0) {
                            $.bhTip && $.bhTip({
                                content: '添加成功',
                                state: 'success',
                                iconClass: 'icon-checkcircle'
                            });
                        }
                    }, 0);
                }
            });
        };

        // 渲染高级搜索表单
        _renderAdvanceSearchForm = function (options, selectedObj) {
            var advanceForm = $('[bh-advanced-query-role=advanceSearchForm]', options.$advanced);
            var btnWrap = $('[bh-advanced-query-role=dropDownBtnWrap]', advanceForm);
            options._changeCounter = 0; // 记录改变的字段的数量，如果有改动，则在渲染完成后弹出 成功的 tip
            $(options.$advanced.data('modalarray')).each(function () {
                var _this = this;
                var formItem = $('[data-name=' + this.name + ']', advanceForm);
                if (selectedObj[this.name] !== undefined && selectedObj[this.name] != null) {
                    if (formItem.length > 0) {
                        // 表单已有字段
                        return true;
                    } else {
                        // 表单添加字段
                        options._changeCounter++;
                        btnWrap.before(_renderInputPlace(this, true));
                    }
                } else {
                    if (formItem.length > 0) {
                        // 表单删除字段
                        options._changeCounter++;
                        formItem.closest('.bh-advancedQuery-form-row').remove();
                    }
                }
            });
            advanceForm.emapFormInputInit({
                defaultOptions: {
                    tree: {
                        unblind: '/',
                        search: true
                    },
                    "multi-tree": {
                        unblind: '/',
                        search: true
                    },
                    switcher: {
                        checked: true
                    },
                    "multi-select2": {
                        width: 300
                    },
                    "date-range": {
                        defaultType: 'all'
                    }
                }
            });

            // 表单塞值
            for (var v in selectedObj) {
                if (selectedObj[v] === undefined || selectedObj[v] === null) return true;
                var ele = $('[data-name=' + v + ']', advanceForm);
                var xtype = ele.attr('xtype');
                if (xtype == 'switcher') {
                    if (selectedObj[v] === "") selectedObj[v] = "1";
                } // 高级搜索的开关 默认选中
                if (xtype == 'date-range' && selectedObj[v] === "") selectedObj[v] = "all"; // 高级搜索的开关 默认选中
                if (selectedObj[v] !== "") {
                    WIS_EMAP_INPUT.setValue(ele, v, xtype, selectedObj, "");
                }
            }
            WIS_EMAP_SERV && WIS_EMAP_SERV._resetPageFooter();
        };

        // 生成搜索条件
        // blank_condition 是否允许搜索条件中存在空值
        _getSearchCondition = function (options, name, blank_condition) {
            var conditionResult = [];
            var easyArray = options.$advanced.data('easyarray');
            var modalarray = options.$advanced.data('modalarray')
            var orCondition = [];
            if (options.searchModel == 'easy') {
                var searchKey = $.trim($('.bh-advancedQuery-quick-search-wrap input', options.$advanced).val());
                // 简单搜索
                if (searchKey != "") {
                    if (name) {
                        //简单搜索的下拉框搜索
                        var searchItem = _findModel(name, easyArray);
                        var conditionData = {
                            "caption": searchItem.caption,
                            "name": searchItem.name,
                            "value": searchKey,
                            "builder": (searchItem.defaultBuilder == "equal" ? "include" : searchItem.defaultBuilder), // equal时强制转换为include
                            "linkOpt": "AND"
                        };
                        conditionResult.push(conditionData);
                    } else {
                        for (var i = 0; i < easyArray.length; i++) {
                            var conditionData = {
                                "caption": easyArray[i].caption,
                                "name": easyArray[i].name,
                                "value": searchKey,
                                "builder": (easyArray[i].defaultBuilder == "equal" ? "include" : easyArray[i].defaultBuilder), // equal时强制转换为include
                                "linkOpt": "OR"
                            };
                            orCondition.push(conditionData);
                        }
                        conditionResult.push(orCondition);
                    }
                }
                conditionResult = conditionResult.concat(_getConditionFromForm($('[bh-advanced-query-role=quickSearchForm]', options.$advanced), options));
            } else if (options.searchModel == 'advanced') {
                var advancedKeyWord = $.trim($('[bh-advanced-query-role=advancedInput]', options.$advanced).val());
                // 高级搜索
                if (advancedKeyWord != '') {
                    for (var i = 0; i < easyArray.length; i++) {
                        if (!easyArray[i].xtype || easyArray[i].xtype == 'text') {
                            orCondition.push({
                                "caption": easyArray[i].caption,
                                "name": easyArray[i].name,
                                "value": advancedKeyWord,
                                "builder": (easyArray[i].defaultBuilder == "equal" ? "include" : easyArray[i].defaultBuilder), // equal时强制转换为include,
                                "linkOpt": "OR"
                            });
                        }
                    }
                    conditionResult.push(orCondition);
                }
                conditionResult = conditionResult.concat(_getConditionFromForm($('[bh-advanced-query-role=advanceSearchForm]', options.$advanced), options));
            }
            if (blank_condition !== true) {
                conditionResult = filterCondition(conditionResult);
            }
            return JSON.stringify(conditionResult);
        };

        _getConditionFromForm = function (form, options) {
            var model = options.$advanced.data('modalarray');
            var conditionArray = [];
            var formElement = $('[xtype]', form);
            for (var i = 0; i < formElement.length; i++) {
                var conditionItem = {};
                var xtype = $(formElement[i]).attr('xtype');
                conditionItem.name = $(formElement[i]).data('name');
                conditionItem.caption = $(formElement[i]).data('caption');
                conditionItem.builder = $(formElement[i]).data('builder');
                conditionItem.linkOpt = 'AND';
                var curModelItem = model.filter(function (item) {
                    return item.name === conditionItem.name
                })[0];
                switch (xtype) {
                    case 'radiolist':
                        conditionItem.value = $('input[type=radio]:checked', formElement[i]).map(function () {
                            return $(this).val();
                        }).get().join(',');
                        break;
                    case 'checkboxlist':
                        conditionItem.value = $('input[type=checkbox]:checked', formElement[i]).map(function () {
                            return $(this).val();
                        }).get().join(',');
                        break;
                    case 'tree':
                        conditionItem.value = $(formElement[i]).emapDropdownTree('getValue');
                        conditionItem['value_display'] = $(formElement[i]).emapDropdownTree('getText');
                        break;
                    case 'multi-tree':
                        conditionItem.value = $(formElement[i]).emapDropdownTree('getValue');
                        conditionItem['value_display'] = $(formElement[i]).emapDropdownTree('getText');
                        break;
                    case 'buttonlist':
                        conditionItem.value = $('.bh-label-radio.bh-active', formElement[i]).data('id');
                        if (conditionItem.value !== undefined && conditionItem.value !== null) {
                            conditionItem.value = conditionItem.value + '';
                        }
                        break;
                    case 'multi-buttonlist':
                        conditionItem.value = $(formElement[i]).bhButtonGroup('getValue');
                        if (conditionItem.value !== undefined && conditionItem.value !== null) {
                            conditionItem.value = conditionItem.value + '';
                        }
                        break;
                    case 'date-range':
                        conditionItem.value = $(formElement[i]).bhTimePicker('getValue');
                        break;
                    case 'switcher':
                        conditionItem.value = ($(formElement[i]).val() ? 1 : 0);
                        break;
                    case 'number':
                        var numVal = $(formElement[i]).jqxNumberInput('value');
                        if (numVal) {
                            numVal = numVal.toString().replace(/\D/g, '')
                        }
                        conditionItem.value = numVal === null ? '' : numVal * 1;
                        break;
                    case 'multi-select':
                        var items = $(formElement[i]).jqxComboBox('getSelectedItems');
                        if (items.length > 0) {
                            conditionItem.value = items.map(function (val) {
                                return val.value;
                            }).join(',');
                        } else {
                            conditionItem.value = "";
                        }
                        break;
                    case 'multi-select2':
                        var items = $(formElement[i]).jqxDropDownList('getCheckedItems');
                        if (items.length > 0) {
                            conditionItem.value = items.map(function (val) {
                                return val.value;
                            }).join(',');
                        } else {
                            conditionItem.value = "";
                        }
                        break;
                    case "date-ym":
                    case "date-local":
                    case "date-full":
                        conditionItem.value = $(formElement[i]).bhDateTimePicker('getValue');
                        break;
                    default:
                        conditionItem.value = $.trim($(formElement[i]).val());
                        break;
                }
                if (xtype === 'date-range') { // 日期区间控件
                    var vauleObj = conditionItem.value;
                    if (vauleObj) {
                        if (vauleObj.startTime) {
                            conditionItem.value = vauleObj.startTime;
                            conditionItem.builder = 'moreEqual';
                            conditionArray.push(conditionItem);
                        }
                        if (vauleObj.endTime) {
                            var newItem = $.extend({}, conditionItem);
                            newItem.value = vauleObj.endTime;
                            newItem.builder = 'lessEqual';
                            conditionArray.push(newItem);
                        }
                    } else {
                        continue;
                    }
                } else if (xtype == 'number-range') { // 数字区间控件
                    var numRange = $(formElement[i]).bhNumRange('getValue');
                    if (numRange !== undefined && numRange !== null) {
                        var numRangeArr = numRange.split(',');
                        if (numRangeArr[0] !== "") {
                            conditionItem.value = numRangeArr[0];
                            conditionItem.builder = 'moreEqual';
                            conditionArray.push(conditionItem);
                        }
                        if (numRangeArr[1] !== "") {
                            var newItem = $.extend({}, conditionItem);
                            newItem.value = numRangeArr[1];
                            newItem.builder = 'lessEqual';
                            conditionArray.push(newItem);
                        }
                    }

                } else {
                    if (conditionItem.value === undefined) {
                        continue;
                    }
                    if (conditionItem.value == 'ALL') {
                        conditionItem.value = ''
                    }
                    // 当文本框控件的value包含,时
                    if (conditionItem.value.toString().indexOf(',') > -1) { // mengbin:多选下拉树 的builder 使用模型配置, 因为要做递归查询 --- zhuhui 6-7
                        if (xtype == 'multi-tree') {}
                        if (xtype == 'text') {
                            conditionItem.builder = 'm_value_include';
                        }
                        if (xtype == 'multi-select' || xtype == 'multi-select2' || xtype == 'multi-buttonlist') {
                            conditionItem.builder = 'm_value_equal';
                        }
                    }
                    conditionArray.push(conditionItem);
                }
            }
            return conditionArray;
        };

        _findModel = function (name, modelArray) {
            for (var i = 0; i < modelArray.length; i++) {
                if (modelArray[i].name == name) {
                    return modelArray[i];
                }
            }
        };

        // 初始化方案
        _initSchema = function (element, options) {
            options = $.extend(options, {
                schemaType: "aq"
            });
            $.fn.emapSchema && $(element).emapSchema(options);
            _renderFixedSchema(element, options);
        };

        // 关闭搜索方案
        _closeSchema = function (options) {
            var wrap = $('.bh-schema-btn-wrap', options.$advanced);
            wrap.removeClass('active');
            $('.bh-schema-name-input', wrap).val('');
            $('[bh-schema-role=fixCheckbox]', wrap).prop('checked', false);
        };

        // 渲染固定的搜索方案
        _renderFixedSchema = function (element, options) {
            options.schemaList = element.emapSchema('getSchemaList');
            options.schemaList = options.schemaList ? options.schemaList : [];
            var $advanced = options.$advanced;
            var programContainer = $('.bh-rules-program', $advanced);
            if (options.schemaList.length > 0) {
                var fixedSchema = options.schemaList.filter(function (val) {
                    return val.FIXED == 1;
                })
                if (fixedSchema.length == 0) {
                    programContainer.html('<label>常用方案: </label><a bh-schema-role="more" href="javascript:void(0)">更多 ></a>')
                } else {
                    $(fixedSchema).each(function () {
                        var sch = $('<a  data-name="' + this.SCHEMA_NAME + '" href="javascript:void(0)">' + this.SCHEMA_NAME + '</a>');
                        sch.data('info', this);
                        $('[bh-schema-role=more]', programContainer).before(sch);
                    });
                    programContainer.show()
                }
            } else {
                programContainer.hide();
            }
        };

        // 方案侧边弹窗事件绑定
        _schemaDialogEventBind = function (element, options) {
            var dialog = $('#schemaDialog');
            // 删除
            dialog.on('click', '[bh-schema-role=delete]', function (e) {
                e.stopPropagation();
                var li = $(this).parent();
                var name = li.data('info').SCHEMA_NAME;
                if (element.emapSchema('deleteSchema', name)) {
                    li.remove();
                    $('.bh-rules-program', element).find('[data-name=' + name + ']').remove();
                    $(options.schemaList).each(function (i) {
                        if (this.SCHEMA_NAME == name) {
                            options.schemaList.splice(i, 1);
                        }
                    })
                    _refreshUnfixNum($('[bh-schema-role=unFixedUl]', dialog));
                }
            });

            // 点击选择方案
            dialog.on('click', 'li', function (event) {
                var condition = $(this).data('info');
                element.emapAdvancedQuery('setValue', condition.CONTENT);
                element.trigger('search', [condition.CONTENT, options, event]);
                $.bhPropertyDialog.hide();
                $.bhTip && $.bhTip({
                    content: condition.SCHEMA_NAME + ' 方案执行成功',
                    state: 'success',
                    iconClass: 'icon-checkcircle'
                });
            });

            // 置顶
            dialog.on('click', '[bh-schema-role=fixed]', function (e) {
                e.stopPropagation();
                var li = $(this).closest('li');
                var info = li.data('info');
                var name = info.SCHEMA_NAME;
                var conditionData = info.CONTENT;
                element.emapSchema('saveSchema', [name, conditionData, 1]).done(function () {
                    _closeSchema(options);
                    var infoData = {
                        "CONTENT": conditionData,
                        "SCHEMA_NAME": name,
                        "FIXED": 1
                    }
                    options.schemaList.filter(function (val) {
                        return val.SCHEMA_NAME == name;
                    })[0].FIXED = 1;
                    $('[bh-schema-role=fixedUl]', dialog).append(li);
                    var sch = $('<a  data-name="' + name + '" href="javascript:void(0)">' + name + '</a>');
                    sch.data('info', infoData);
                    $('.bh-rules-program [bh-schema-role=more]', element).before(sch);
                    _refreshUnfixNum($('[bh-schema-role=unFixedUl]', dialog));
                }).fail(function (res) {
                    console && console.log(res)
                });
            });
            // 取消置顶
            dialog.on('click', '[bh-schema-role=unfixed]', function (e) {
                e.stopPropagation();
                var li = $(this).closest('li');
                var info = li.data('info');
                var name = info.SCHEMA_NAME;
                var conditionData = info.CONTENT;
                element.emapSchema('saveSchema', [name, conditionData, 0]).done(function () {
                    _closeSchema(options);
                    options.schemaList.filter(function (val) {
                        return val.SCHEMA_NAME == name;
                    })[0].FIXED = 0;
                    $('[bh-schema-role=unFixedUl]', dialog).append(li);
                    $('.bh-rules-program', element).find('[data-name=' + name + ']').remove()
                    _refreshUnfixNum($('[bh-schema-role=unFixedUl]', dialog));
                }).fail(function (res) {
                    console && console.log(res)
                });
            })
        };

        function filterCondition(condition) {
            var con = condition;
            var result = [];
            if (typeof condition == 'string') {
                con = JSON.parse(con);
            }
            con.map(function (item, i) {
                if (item instanceof Array) {
                    result.push(filterCondition(item));
                } else {
                    if (item.value !== '') {
                        result.push(item);
                    }
                }
            })
            return result;
        }

        element.css({
            "position": "relative",
            "z-index": 358
        }).html('<div class="bh-advancedQuery bh-mb-16" bh-advanced-query-role="advancedQuery">' +
            '<div class="bh-advancedQuery-dropDown ">' +
            '<div class="" style="display: table-cell">' +
            '<div class="bh-rules-header bh-clearfix">' +
            '<h4><i class="iconfont icon-search"></i>高级搜索</h4>' +
            '<p class="bh-rules-program">' +
            '<label>常用方案: </label>' +
            '<a bh-schema-role="more" href="javascript:void(0)">更多 ></a>' +
            '</p>' +
            '</div>' +
            '<div class="bh-advancedQuery-form" bh-advanced-query-role="advanceSearchForm" >' +
            '<div class="bh-advancedQuery-form-row bh-advancedQuery-h-28">' +
            '<div class="bh-advancedQuery-groupName">关键词：</div>' +
            '<div class="bh-advancedQuery-groupList">' +
            '<input type="text" bh-advanced-query-role="advancedInput" class="bh-form-control">' +
            '</div>' +
            '</div>' +
            '<div class="bh-advancedQuery-form-row bh-advancedQuery-form-btn-row bh-advancedQuery-h-28" bh-advanced-query-role="dropDownBtnWrap"> ' +
            '<div class="bh-advancedQuery-groupName"></div>' +
            '<div class="bh-advancedQuery-groupList">' +
            '<a class="bh-btn bh-btn-primary bh-btn-small" bh-advanced-query-role="advancedSearchBtn" >执行高级搜索</a>' +
            '<a class="bh-btn bh-btn-default bh-btn-small" bh-advanced-query-role="addCondition" >添加搜索字段</a>' +
            '<div class="bh-schema-btn-wrap">' +
            '<div class="bh-schema-edit-div">' +
            '<input type="text" placeholder="请输入方案名称" maxlength="20" class="bh-form-control bh-schema-name-input" />' +
            '<a  class="bh-btn bh-btn-success bh-btn-small"  bh-advanced-query-role="saveSchemaConfirm">保存</a>' +
            '<a class="bh-btn bh-btn-default bh-btn-small" bh-advanced-query-role="saveSchemaCancel">取消</a>' +
            '<span class="bh-checkbox" style="display:inline-block;vertical-align:middle;margin-left:8px;padding-top: 0;"><label>' +
            '<input type="checkbox" bh-schema-role="fixCheckbox"><i class="bh-choice-helper"></i> 固定至搜索栏' +
            '</label></span>' +
            '</div>' +
            '<a class="bh-btn bh-btn-default bh-btn-small " bh-advanced-query-role="saveSchema" href="javascript:void(0)">保存为方案</a>' +
            '</div>' +
            '<a class="bh-mh-4" bh-advanced-query-role="advancedClose" href="javascript:void(0)">[关闭高级搜索]</a>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="bh-advancedQuery-quick">' +
            '<div class="bh-advancedQuery-inputGroup bh-clearfix" style="padding-bottom: 8px;background: #fff;">' +
            '<div class="bh-advancedQuery-quick-search-wrap" >' +
            '<input type="text" class="bh-form-control"/>' +
            '<i class="iconfont icon-search" style="position: absolute;left: 6px;top: 6px;"></i>' +
            //'<div class="bh-advancedQuery-quick-select" bh-advanced-query-role="advancedEasySelect">' +
            //'</div>' +
            '</div>' +
            '<a class="bh-btn bh-btn bh-btn-primary bh-btn-small" bh-advanced-query-role="easySearchBtn" >搜索</a>' +
            '<a href="javascript:void(0);" class="bh-mh-8" bh-advanced-query-role="advancedOpen">[高级搜索]</a>' +
            '</div>' +
            '<div class="bh-advancedQuery-form" bh-advanced-query-role="quickSearchForm">' +
            '</div>' +
            '</div>' +
            '<div class="bh-clearfix bh-advancedQuery-totalNum-wrap">' +
            '<p class="bh-advancedQuery-totalNum bh-pull-left">共<span></span>条数据 <a href="javascript:void(0)" bh-advanced-query-role="clearBtn">[清空搜索]</a></p>' +
            '<div class="bh-advancedQuery-totalNum-line"></div>' +
            '</div>' +
            '</div>');
        options.$advanced = $('div[bh-advanced-query-role=advancedQuery]', element).css({
            'overflow': 'hidden'
        });
        options.guid = guid;
        $('body').append('<div class="bh-advancedQuery-quick-select" bh-advanced-query-role="advancedEasySelect" data-guid="' + guid + '" ></div>');
        _eventBind(options, element);

        var easySearchPlaceholder = '';
        $(modalData).each(function (i) {
            //移除 hidden 项
            var index = modalData.indexOf(this);
            if (this.get('hidden')) {
                modalData.splice(index, 1);
                return true;
            }
            if (!this.xtype || this.xtype == 'text') {
                // easySearchPlaceholder += this.caption + '/'; // 高级搜索关键词输入框placeholder
            } else if ($.inArray(this.xtype, ["radiolist", "checkboxlist", "buttonlist", "multi-buttonlist"]) > -1) {
                options._initCount++;
            }
            if (this.quickSearch) {
                if (!this.xtype || this.xtype == 'text') {
                    easySearchPlaceholder += this.caption + '/';
                    easyArray.push(this);
                } else {
                    quickArray.push(this);
                }
            }
        });
        // 高级搜索关键词字段添加placeholder
        $('[bh-advanced-query-role=advancedInput]', element).attr('placeholder', easySearchPlaceholder.substr(0, easySearchPlaceholder.length - 1));
        options.$advanced.data('modalarray', modalData);
        options.$advanced.data('easyarray', easyArray);
        options.$advanced.data('quickarray', quickArray);
        if (options.searchModel !== 'easy') {
            options._initCount = quickArray.length;
        }
        if (easyArray.length == 0 && quickArray.length == 0) {
            console && console.warn("没有配置快速搜索字段,所以高级搜索控件无法展示!");
        }

        // 简单搜索 条件渲染
        _renderEasySearch(easyArray, options);

        // 快速搜索条件渲染
        quickArray = JSON.parse(JSON.stringify(quickArray));
        $('[bh-advanced-query-role=quickSearchForm]', options.$advanced).html(_renderQuickSearch(quickArray))
            .emapFormInputInit({
                root: '',
                defaultOptions: {
                    tree: {
                        // checkboxes: true,
                        width: 300,
                        unblind: '/',
                        search: true // 高级搜索下拉树默认开启 搜索
                    },
                    "multi-tree": {
                        width: "300px",
                        unblind: '/',
                        search: true // 高级搜索下拉树默认开启 搜索
                    },
                    switcher: {
                        checked: true
                    },
                    "date-range": {
                        defaultType: 'all'
                    },
                    "select": {
                        width: "300px"
                    },
                    "multi-select": {
                        width: "300px"
                    },
                    "multi-select2": {
                        width: "300px"
                    },
                    "multi-tree": {
                        width: "300px"
                    },
                    "date-local": {
                        width: "300px"
                    },
                    "date-ym": {
                        width: "300px"
                    },
                    "date-full": {
                        width: "300px"
                    }
                }
            });

        _renderAdvanceSearchForm(options, options.defaultItem);
        // 初始化 方案 模块
        if (options.schema) {
            $.fn.emapSchema && _initSchema(element, options);
        } else {
            $('.bh-rules-program, .bh-schema-btn-wrap', options.$advanced).hide();

        }
        if (document.documentMode == 9 && JPlaceHolder) {
            // WIS_EMAP_INPUT.placeHolder();
            JPlaceHolder.fix(element);
        }
    };


    $.fn.emapAdvancedQuery = function (options, params) {
        var instance;
        instance = this.data('plugin');
        if (!instance) {
            return this.each(function () {
                return $(this).data('plugin', new Plugin(this, options));
            });
        }
        if (options === true) return instance;
        if ($.type(options) === 'string') return instance[options](params);
        return this;
    };

    /**
     * @memberof module:emapAdvancedQuery
     * @prop {Object} data - 搜索数据模型
     * @prop {Boolean} [allowAllOption=true] - 快速搜索的按钮组是否显示[全部]选项
     * @prop {Boolean} [contextPath] - 快速搜索的按钮组是否显示[全部]选项
     * @prop {Object} [defaultItem=[]] - 高级搜索模式默认展示的字段 [{name: "xxx"}]
     * @prop {String} [searchModel=easy] - 默认搜索模式 可选值： 'easy' 简单模式  'advanced' 高级模式
     * @prop {Boolean} [schema=true] - 是否开启保存搜索方案功能
     * @prop {Boolean} [showTotalNum=false] - 是否展示表格数据联动显示
     * @prop {Function} [initComplete] - 初始化成功的回调函数
     */
    $.fn.emapAdvancedQuery.defaults = {
        allowAllOption: true,
        defaultItem: [],
        searchModel: 'easy',
        schema: true,
        showTotalNum: false
    };

}).call(this);

(function() {
    var Plugin;

    /**
     * @module emapdatatable
     * @description 数据表格
     */
    Plugin = (function() {
        function Plugin(element, options) {
            //将插件的默认参数及用户定义的参数合并到一个新的obj里
            this.settings = $.extend({}, $.fn.emapdatatable.defaults, options);
            //将dom jquery对象赋值给插件，方便后续调用
            this.$element = $(element);
            this.$element.attr("emap-role", "datatable").attr("emap-pagePath", this.settings.pagePath).attr("emap-action", this.settings.action);

            //拼接请求地址
            var url = this.settings.url || WIS_EMAP_SERV.getAbsPath(this.settings.pagePath).replace('.do', '/' + this.settings.action + '.do');

            //前端模拟数据开发时type使用get方式
            var ajaxMethod = this.settings.method || 'POST';
            if (typeof window.MOCK_CONFIG != 'undefined') {
                //qiyu 2016-7-21 将emapdatatable中的获取mock的url提取函数，在mock文件中重新定义
                ajaxMethod = this.settings.method || getMethodMock();
                if (typeof this.settings.url == 'undefined') {
                    url = getURLMock(url, this.settings);
                }
                // ajaxMethod = this.settings.method || 'GET';
                // if (typeof this.settings.url == 'undefined') {
                //     var models = BH_UTILS.doSyncAjax(url, {}, ajaxMethod).models;
                //     for (var i = 0; i < models.length; i++) {
                //         if (models[i].name == this.settings.action) {
                //             url = models[i].url;
                //             break;
                //         }
                //     }
                // }
            }
            var params = $.extend({}, this.settings.params, this.settings.onceParams);
            //数据源
            this.source = {
                root: 'datas>' + this.settings.action + '>rows',
                id: this.settings.pk || 'WID', // id: "WID", 主键字段可配置  //qiyu 2016-1-16
                datatype: 'json',
                url: url,
                data: params || {},
                type: ajaxMethod,
                datafields: []
            };

            //qiyu 2016-7-21 将emapdatatable中的获取mock的url提取函数，在mock文件中重新定义
            if (typeof window.MOCK_CONFIG != 'undefined') {
                this.source = getSourceMock(this.source);
            }

            _create(this);
        }

        /**
         * @method reload
         * @description 刷新表格数据
         * @param {Object} params - 附带参数
         * @param {Object} params._gotoFirstPage -
         * callback 可以是function 或者是 true，true的话意味着强制跳回第一页
         * _gotoFirstPage 如果callback为回调函数，此时需要调回第一页 则可以设置params._gotoFirstPage为true
         *
         */
        Plugin.prototype.reload = function(params, callback) {
            /**
             * 方法内容
             */
            var gotoFirstPage = params._gotoFirstPage;
            gotoFirstPage && delete params._gotoFirstPage;
            this.source.data = params;
            if (callback === true || gotoFirstPage === true) {
                if (!this.$element.jqxDataTable('goToPage', 0)) {
                    this.$element.jqxDataTable('updateBoundData');
                }
            } else {
                this.$element.jqxDataTable('updateBoundData');
            }

            var that = this;
            if (typeof callback == 'function') {
                var intervalId = setInterval(function() {
                    if (that.$element.jqxDataTable('isBindingCompleted')) {
                        clearInterval(intervalId);
                        // 将callback放在 refresh后面， 避免callback中的dom操作被refresh刷新掉 zhuhui 2016-10-21
                        that.$element.jqxDataTable('refresh');
                        callback();
                    }
                }, 10);
            }
        };

        /**
         * @method reloadFirstPage
         * @description 默认刷新表格回到首页
         * @param {Object} params - 附带参数
         * @param {Function} callback - 回调函数
         */
        Plugin.prototype.reloadFirstPage = function(params, callback) {
            this.reload($.extend({}, params, {
                _gotoFirstPage: true
            }), callback);
        };

        /**
         * @method checkedRecords
         * @description 获取选中的数据
         */
        Plugin.prototype.checkedRecords = function() {
            var selectedArr = [];
            var rowsData = this.$element.jqxDataTable('getRows');
            var $checkedSelector = this.$element.find('table:not([id^="pinnedtable"]) tr');
            if (this.$element.find('table[id^="pinnedtable"]').length > 0) {
                $checkedSelector = this.$element.find('table[id^="pinnedtable"] tr');
            }
            $checkedSelector.each(function(index) {
                var ischecked = $(this).find('input[type="checkbox"]').prop('checked');
                if (ischecked) {
                    selectedArr.push(rowsData[index]);
                }
            });
            return selectedArr;
        };

        /**
         * @method getTotalRecords
         * @description 获取数据总条数
         */
        Plugin.prototype.getTotalRecords = function() {
            return this.source.totalRecords;
        };

        /**
         * @method getResult
         * @description 获取当前表格内数据
         */
        Plugin.prototype.getResult = function() {
            return this.$element.data('tableResult');
        };

        /**
         * @method getSort
         * @description 获取表格排序
         */
        Plugin.prototype.getSort = function() {
            var args = this.$element.data("sortfield");

            if (args === undefined)
                return;

            var sortObj = {
                direction: args.sortdirection,
                field: args.sortcolumn,
                exp: ""
            };
            var exp = "";
            if (args.sortdirection.ascending == true) {
                sortObj.exp = "+" + args.sortcolumn;
            } else if (args.sortdirection.descending == true) {
                sortObj.exp = "-" + args.sortcolumn;
            }

            return sortObj;
        };

        /**
         * @method getModel
         * @description 获取表格数据
         */
        Plugin.prototype.getModel = function() {
            return this.$element.data('tableDataModel');
        };

        /**
          * @method selectColumnsExport
          * @description 导出 表格数据， 列为选择列
          *
          * @param  {object} params
          *
          *  【url】：
             /[root]/sys/emapcomponent/imexport/export.do

            【参数 params】：
             root:
             app：调用导出的应用名称，必填
             module：调用导出的模块名，必填
             page：调用导出的页面，必填
             action：调用导出的动作，必填
             colnames：导出时自定义的字段，多个用逗号分隔，选填  toUpperCase
             analyse：自定义的导出过程分析服务，实现IImportAnalyse，选填
             write：自定义的导出写文件服务，实现IExportWrite，选填
             filename：自定义的导出文件名，选填
          *
          */
        Plugin.prototype.selectColumnsExport = function(params) {
            this.selectToShowColumns({
                type: 'export',
                params: params
            });
        };

        /**
         * @method selectToShowColumns
         * @description 展开选择列窗口
         * @param  {object} action 动作
         *    {
         *        type: //action type, 内置动作有 toggle(默认),export
         *        handler: //action handler
         *        param:  //action hander 的参数
         *    }
         *    'toggle'  显示选择的列，隐藏未选择的列,默认值
         *    'export'  导出表单， 支持选择列
         * @param {object} params  action 动作 所需的参数
         */
        Plugin.prototype.selectToShowColumns = function(action) {
            var self = this;
            action.type = action.type || 'toggle';

            //默认动作
            // if(action.type === 'toggle')
            // {
            //
            //     action['name'] = '显示/隐藏字段';
            //     action['handler'] = function(columns) {
            //             self.$element.jqxDataTable({
            //                 columns: columns
            //             });
            //
            //             if (self.settings.schema && self.settings.contextPath) { // if rememberCustomColumn , save columns
            //                 _saveSchema(self, columns);
            //             }
            //
            //         };
            //
            // }
            // else

            // 表格传参时,为了方便高级搜索会将其他参数合并进来,  其中有可能含有type 所以 此处默认走 隐藏显示列
            // zhuhui 6-8
            if (action.type === 'export') {
                action['name'] = '导出选择字段';
                action['handler'] = function(columns) {
                    var config, selectedCols;

                    selectedCols = [];
                    columns.forEach(function(col) {
                        if (col.hidden === false && col.hasOwnProperty('datafield')) {
                            selectedCols.push(col.datafield);
                        }
                    });

                    config = $.extend({}, action.params, {
                        colnames: selectedCols.join(',').replace(/_DISPLAY/g, '').toUpperCase()
                    });
                    self.export(config);
                };
            } else {
                action['name'] = '显示/隐藏字段';
                action['handler'] = function(columns) {
                    if (self.settings.fastRender) {
                        columns = columns.filter(function(item) {
                            return !item.hidden;
                        })
                    }

                    self.$element.jqxDataTable({
                        columns: columns
                    });

                    if (self.settings.schema && self.settings.contextPath) { // if rememberCustomColumn , save columns
                        _saveSchema(self, columns);
                    }

                };
            }


            var columns = this.$element.data('columns');
            var newmodel = this.$element.data('newmodel');
            _initSelectColumnsWindow(this, newmodel, columns, action);
        };

        /**
         * @method export
         * @description 导出表格数据
         * @param {Object} config - 配置参数，导出请求参数
         * @param {String} config.root - 根路径
         */
        Plugin.prototype.export = function(config) {
            var root = config.root;
            delete config.root;
            $.ajax({
                    url: root + '/sys/emapcomponent/imexport/export.do',
                    data: config,
                    type: 'POST'
                })
                .done(function(res) {
                    res = JSON.parse(res);
                    window.location = location.protocol + '//' + location.host + root + '/sys/emapcomponent/file/getAttachmentFile/' + res.attachment + '.do';
                });
        };

        /**
         * @method  getVisibleColumns
         * @description 获取当前表格内所有现实的列
         * @return {Array} 可视的列
         */
        Plugin.prototype.getVisibleColumns = function() {
            var columns = this.$element.data('columns');
            if (columns && columns.length) {
                return columns.filter(function(item) {
                    return item.hidden === false;
                });
            }
            return [];
        };

        return Plugin;

    })();

    /**
     * 插件的私有方法
     */
    //生成表格
    function _create(instance) {
        if (!instance.settings.contextPath) {
            instance.settings.contextPath = WIS_EMAP_SERV.getContextPath();
        }
        var jqxOptions = $.extend({}, instance.settings);
        try {
            delete jqxOptions.pk; //qiyu 2016-1-16
            delete jqxOptions.url;
            delete jqxOptions.pagePath;
            delete jqxOptions.params;
            delete jqxOptions.datamodel;
            delete jqxOptions.method;
            delete jqxOptions.action;
            delete jqxOptions.customColumns;
            delete jqxOptions.colHasMinWidth;
            delete jqxOptions.beforeSend;
            delete jqxOptions.downloadComplete;
            delete jqxOptions.schema;
            delete jqxOptions.contextPath;
            delete jqxOptions.searchElement;
            delete jqxOptions.minLineNum;
            delete jqxOptions.onceParams;
            delete jqxOptions.alwaysHide;
            delete jqxOptions.customModelName;
            delete jqxOptions.formatData;
            delete jqxOptions.fastRender;
        } catch (e) {

        }


        var dataAdapter = new $.jqx.dataAdapter(instance.source, {
            formatData: function(data) {
                if (jqxOptions.pageable) {
                    data.pageSize = data.pagesize;
                    data.pageNumber = data.pagenum + 1;
                }

                var sortorder = '+';
                if (jqxOptions.sortable && data.sortdatafield && data.sortorder) {
                    if (data.sortorder == 'asc') {
                        sortorder = '+';
                    } else if (data.sortorder == 'desc') {
                        sortorder = '-';
                    }
                    data['*order'] = sortorder + data.sortdatafield.split('_DISPLAY')[0];
                }

                if (instance.settings.formatData && typeof instance.settings.formatData == 'function') {
                    data = instance.settings.formatData(data);
                }

                delete data.pagesize;
                delete data.pagenum;
                delete data.filterslength;
                delete data.sortdatafield;
                delete data.sortorder;
                return data;
            },
            beforeSend: function(xhr) {
                if (typeof instance.settings.beforeSend === 'function') {
                    instance.settings.beforeSend.call(this, arguments);
                }
            },
            downloadComplete: function(data, status, xhr) {
                // 添加downloadComplete 回调  zhuhui 0726
                if (typeof instance.settings.downloadComplete === 'function') {
                    instance.settings.downloadComplete(data, status, xhr);
                }
                //如果未登录则跳转至登录地址
                // console.log("emapdatatable:------------");
                // console.log(data);
                // console.log(xhr);
                // console.log(status);
                // console.log("-----------:emapdatatable");
                if (typeof data.loginURL != 'undefined' && data.loginURL != '') {
                    window.location.href = data.loginURL;
                    return;
                }

                //qiyu 2016-7-21 将emapdatatable中的获取mock的url提取函数，在mock文件中重新定义
                if (typeof window.MOCK_CONFIG != 'undefined') {
                    instance.source.totalRecords = getTotalRecordsMock(data, instance.settings.action);
                } else {
                    instance.source.totalRecords = data.datas[instance.settings.action].totalSize || data.datas[instance.settings.action].total_size;
                }
                // instance.source.totalRecords = data.datas[instance.settings.action].totalSize || data.datas[instance.settings.action].total_size;


                //qiyu 2016-6-8 解决翻页总数刷新问题
                //instance.source.totalrecords = instance.source.totalRecords;

                instance.$element.data('tableResult', data);

                // 联动高级搜索的
                if (instance.settings.searchElement && instance.settings.searchElement.length > 0) {
                    instance.settings.searchElement.emapAdvancedQuery('updateTotalNum', (instance.source.totalRecords ? instance.source.totalRecords : 0));
                }
            }
        });

        //保存调用组件时传进来的ready和rendered函数。因为后面checkbox会复写此函数
        var custom_ready = jqxOptions.ready;
        var custom_rendered_tmp = jqxOptions.rendered;

        var custom_rendered = jqxOptions.rendered = function() {
            //处理无排序时表格列背景色及排序按钮背景色问题
            _handleSortStyle(instance);
            if (typeof custom_rendered_tmp === 'function') {
                custom_rendered_tmp();
            }
        };

        jqxOptions.columns = _genColums(instance, jqxOptions, custom_ready, custom_rendered);
        jqxOptions.source = dataAdapter;

        instance.$element.jqxDataTable(jqxOptions);

        instance.$element.on('sort', function(event) {
            var args = event.args;
            // column's data field.
            //var sortcolumn = args.sortcolumn;
            instance.$element.data("sortfield", args);
        });

        instance.$element.on('bindingComplete', function(event) {
            _handleSortStyle(instance);
            _handleMinHeight(instance);
            _handleHorizontalScrollBar(instance);
            _handleVerticalScrollBar(instance);
            _resetPageFooter(instance);

        });

        //qiyu 2016-6-7 增加创建时事件，用于提供给产品线，创建后的行为。需求人：孟斌。如：表格默认增加右侧自定义显示列
        instance.$element.trigger("emapdatatable.created", [instance]);
    }

    //在纸质弹窗中的页面，改变分页大小，需要重置页脚
    function _resetPageFooter(instance) {
        //当弹框内容的高度出现变化的时候调用以下两个方法
        if (instance.$element.closest(".bh-paper-pile-dialog").length > 0) {
            $.bhPaperPileDialog.resetPageFooter(); //改变页面的页脚位置
            $.bhPaperPileDialog.resetDialogFooter(); //改变弹框的页脚位置
        }
    }

    /**
     * 处理出现横向滚动条后导致的纵向滚动条
     */
    function _handleHorizontalScrollBar(instance) {
        var id = instance.$element.attr('id');
        //qiyu 2016-9-21 希望永远不显示纵向滚动条，判断依此调整，处理出现横向滚动条后导致的纵向滚动条
        // var $selector = $('#horizontalScrollBar' + id);
        var $selector = $('#verticalScrollBar' + id);
        if ($selector.css('visibility') != 'hidden') {
            var height = instance.$element.jqxDataTable('height');
            if (height != null) {
                //qiyu 2016-9-14 解决刷新会不断增高的问题，之前的临时方案是设置表格的height=null
                //instance.$element.jqxDataTable('height', height + 17);
                //qiyu 2016-9-21 调整行高为10px
                instance.$element.jqxDataTable('height', height + 10);
            }
        }
    }

    /**
     * 处理表格行高因自定义内容被撑大后，出现纵向滚动条问题
     */
    function _handleVerticalScrollBar(instance) {
        var id = instance.$element.attr('id');
        var $selector = $('#verticalScrollBar' + id);
        var rowsData = instance.$element.jqxDataTable('getRows');
        var minLineNum = instance.settings.minLineNum;
        if (minLineNum == null || isNaN(minLineNum)) {
            return;
        }
        if ($selector.css('visibility') != 'hidden' && rowsData.length <= minLineNum) {
            instance.$element.jqxDataTable('height', null);
        }
    }
    /**
     * 处理表格最小高度
     */
    function _handleMinHeight(instance) {
        var rowsData = instance.$element.jqxDataTable('getRows');
        var minLineNum = instance.settings.minLineNum;

        if (minLineNum == null || isNaN(minLineNum)) {
            return;
        }

        if (rowsData.length < minLineNum) {
            instance.$element.jqxDataTable('height', BH_UTILS.getTableHeight(parseInt(minLineNum)));
        } else {
            instance.$element.jqxDataTable('height', null);
        }

    }

    /**
     * 初始化 schema, 如果启用schema， 则返回 schema 的数据
     * @param  {object} instance
     * @param  {string} modelName
     */
    function _initSchema(instance, modelName, contextPath) {
        var $elem = instance.$element;
        var res;
        if (!instance.settings.schema || !instance.settings.contextPath) { //disable schema
            return false;
        }
        //TODO: enable schema
        $elem.emapSchema({
            schemaType: 'col',
            contextPath: contextPath,
            data: {
                modelName: modelName
            }
        });

        res = $elem.emapSchema('getSchemaList')
        if (res && res[0] && res[0].CONTENT) {
            return res[0].CONTENT.split(',')
        }
        return []
    }

    function _handleSortStyle(instance) {
        //处理无排序时表格列背景色问题
        var sortObj = instance.$element.data("sortfield");
        if (typeof sortObj == 'undefined' || (sortObj.sortdirection.ascending == false && sortObj.sortdirection.descending == false)) {
            instance.$element.find('td.jqx-grid-cell-sort').removeClass('jqx-grid-cell-sort');
        }

        //处理表格排序按钮背景色问题
        instance.$element.find('div.sortasc, div.sortdesc').css('background', 'none');
    }

    /**
     * 生成表格列
     * @param  {any} instance
     * @param  {any} jqxOptions
     * @param  {any} custom_ready
     * @param  {any} custom_rendered
     */
    function _genColums(instance, jqxOptions, custom_ready, custom_rendered) {
        var columns = [],
            schemaList;

        var datamodel = instance.settings.datamodel ||
            WIS_EMAP_SERV.getModel(instance.settings.pagePath, instance.settings.action, "grid", instance.settings.params);
        //保存datamodel
        instance.$element.data('tableDataModel', datamodel);

        instance.$element.attr("emap", JSON.stringify({
            "emap-pagePath": instance.settings.pagePath,
            "emap-action": instance.settings.action,
            "emap-url": WIS_EMAP_SERV.url,
            "emap-name": WIS_EMAP_SERV.name,
            "emap-app-name": WIS_EMAP_SERV.appName,
            "emap-model-name": WIS_EMAP_SERV.modelName
        }));
        schemaList = _initSchema(instance, WIS_EMAP_SERV.modelName || instance.settings.customModelName, instance.settings.contextPath);
        delete WIS_EMAP_SERV.url;
        delete WIS_EMAP_SERV.name;
        delete WIS_EMAP_SERV.appName;
        delete WIS_EMAP_SERV.modelName;

        var cusColLen = 0;
        var customColumns = instance.settings.customColumns;
        if (typeof customColumns != 'undefined' && customColumns != null) {
            cusColLen = customColumns.length;
        }

        //重新组织datamodel
        //type为link时只能为某列快速设置为链接类型，该列必须是模型中已经存在的数据列（此设定为兼容上一版本）
        var newmodel = [];
        var lastcolumn = null;
        var linkCol = [];
        for (var i = 0; i < cusColLen; i++) {
            var colIndex = customColumns[i].colIndex;
            var colField = customColumns[i].colField;
            var type = customColumns[i].type;
            if (colIndex > 40) {
                colIndex = 'last';
            }
            if (colIndex == 'last') {
                lastcolumn = customColumns[i];
            } else if (typeof colField != 'undefined' && colField != '') {
                for (var j = 0; j < datamodel.length; j++) {
                    if (datamodel[j].name == colField) {
                        datamodel[j].custom = customColumns[i];
                    }
                }
            } else if (colIndex != 'undefined') {
                colIndex = colIndex < 0 ? 0 : colIndex;

                //兼容上一版本设定
                if (type != 'link') {
                    newmodel[colIndex] = {
                        custom: customColumns[i]
                    }
                } else {
                    linkCol.push({
                        colIndex: colIndex,
                        column: customColumns[i]
                    });
                }

            }
        }
        //datamodel保存至source的datafields数组中
        for (var m = 0; m < datamodel.length; m++) {
            if (typeof datamodel[m].get == 'function') {
                instance.source.datafields.push({
                    name: datamodel[m].name,
                    type: 'string'
                });
                if (typeof datamodel[m].url != 'undefined') {
                    instance.source.datafields.push({
                        name: datamodel[m].name + '_DISPLAY',
                        type: 'string'
                    });
                }
            }
        }
        for (var k = 0; k < newmodel.length; k++) {
            if (newmodel[k] == undefined) {
                if (datamodel.length > 0) {
                    newmodel[k] = datamodel.shift();
                } else {
                    newmodel.splice(k, 1);
                    k--;
                }
            }
        }

        if (datamodel.length > 0) {
            newmodel = newmodel.concat(datamodel);
        }

        if (lastcolumn != null) {
            newmodel.push({
                custom: lastcolumn
            });
        }

        var datafield;
        var _col;
        var thiner_columns = [];
        var isFastRender = instance.settings.fastRender;
        for (var n = 0; n < newmodel.length; n++) {
            //设置自定义列类型为link，且指定了colIndex的项
            for (var t = 0; t < linkCol.length; t++) {
                if (n == linkCol[t].colIndex) {
                    newmodel[n].custom = linkCol[t].column;
                }
            }
            //设置数据类型全部是string
            if (typeof newmodel[n].name != 'undefined') {
                instance.source.datafields.push({
                    name: newmodel[n].name,
                    type: 'string'
                });
            }
            if (typeof newmodel[n].url != 'undefined') {
                datafield = newmodel[n].name + '_DISPLAY';
                instance.source.datafields.push({
                    name: datafield,
                    type: 'string'
                });
            } else {
                datafield = newmodel[n].name
            }

            var width = null;
            var widthObj = {};
            var isHidden = newmodel[n].hidden === true || newmodel[n]['grid.hidden'] === true;
            if (typeof newmodel[n].get == 'function') {
                isHidden = isHidden || newmodel[n].get('hidden') === true;
            }

            //schema: schema 权重高于 hidden属性， 如果不在schemaList中，则隐藏该列
            if (instance.settings.schema && schemaList && schemaList.length && newmodel[n].name && newmodel[n]['grid.fixed'] !== true) {
                _col = newmodel[n].name
                    // _col.replace('_DISPLAY', '');
                    // isHidden = $.inArray(_col, schemaList) === -1

                var arrNoDisplay = schemaList.map(function(val) {
                    return val.replace('_DISPLAY', '');
                })
                isHidden = $.inArray(_col, arrNoDisplay) === -1
            }

            //固定列属性pinned 默认值
            var pinned = false;
            //从后台模型中读取固定列属性pinned
            pinned = newmodel[n].pinned;
            if (pinned !== true) {
                pinned = false;
            }
            // 默认列宽为100px
            if (newmodel[n].custom == undefined) {
                width = newmodel[n]['grid.width'] == undefined ? null : newmodel[n]['grid.width'];
                widthObj = _genWidthObj(width, instance.settings.colHasMinWidth);
                var dCol = $.extend({}, {
                    text: newmodel[n].caption,
                    datafield: datafield,
                    hidden: isHidden,
                    pinned: pinned,
                    cellsRenderer: function(row, column, value, rowData) {
                        return '<span title="' + $("<div>" + value + "</div>").text() + '">' + value + '</span>';
                    }
                }, widthObj);
                columns.push(dCol);
                if (isFastRender && _canColFastRender(dCol)) {
                    thiner_columns.push(dCol);
                }
            } else {
                var type = newmodel[n].custom.type;
                var showCheckAll = newmodel[n].custom.showCheckAll;
                width = newmodel[n].custom.width;
                if (width == undefined) {
                    width = newmodel[n]['grid.width'] == undefined ? null : newmodel[n]['grid.width'];
                }
                widthObj = _genWidthObj(width, instance.settings.colHasMinWidth);
                var col = _genCustomColumns(type, instance, jqxOptions, showCheckAll, widthObj, newmodel[n], datafield, custom_ready, custom_rendered);
                var cCol = $.extend({
                    hidden: isHidden,
                    pinned: pinned
                }, col);
                columns.push(cCol);
                if (isFastRender) {
                    thiner_columns.push(cCol);
                }
            }
        }

        if (isFastRender) {
            instance.$element.data('newmodel', newmodel);
            instance.$element.data('columns', columns);
            return thiner_columns;
        } else {
            instance.$element.data('newmodel', newmodel);
            instance.$element.data('columns', columns);
            return columns;
        }
    }

    function _canColFastRender(col) {
        if (col['grid.hidden'] === true) {
            return false;
        } else if (col['grid.hidden'] === undefined && col['hidden'] === true) {
            return false;
        }
        return true;
    }

    function _genWidthObj(width, colHasMinWidth) {
        var widthStr = width == null ? '' : width.toString();
        widthStr = widthStr.replace('px', '').replace('PX', '').replace('%', '');
        widthStr = $.trim(widthStr);
        if (!colHasMinWidth) {
            if (width && widthStr != '' && !isNaN(widthStr)) {
                return {
                    width: width
                };
            }
            return {};
        } else {
            if (width != null && widthStr != '' && !isNaN(widthStr)) {
                width = width.toString();
                width.replace('px', '').replace('PX', '');
                if (width.indexOf("%") == -1 && parseInt(width) < 100) {
                    width = 100;
                }

                return {
                    width: width,
                    minWidth: 100
                };
            }
            return {
                minWidth: 100
            };
        }

    }

    function _saveSchema(instance, columns) {
        var $elem = instance.$element;
        //1. 获取 含有 name的 显示列
        var data = [];
        columns.forEach(function(column) {
            if (column.hasOwnProperty('datafield') && !column.hidden) {
                data.push(column.datafield)
            }
        });
        //2. 保存 显示列 到 schema
        $elem.emapSchema('saveSchema', [
            'emap.table',
            data.join(',')
        ]);
    }
    /*
     *   列表字段的显示隐藏策略
     *   fixed > 保存方案 > 模型配置
     *   保存方案的优先级高于模型中的显示隐藏配置
     *   模型中配置了固定的字段的显示隐藏以模型中的配置为准，优先级高于保存方案
     *
     */
    function _initSelectColumnsWindow(instance, newmodel, columns, action) {
        var callback = function(cols) {
            var colMap = {};
            cols.map(function(item) {
                colMap[item.name] = {
                    hidden: item.hidden
                }
            });

            var clength = columns.length;
            if (action.type === 'export') {
                var exportCols = [];
                for (var i = 0; i < clength; i++) {
                    if (columns[i].datafield) {
                        var key = columns[i].datafield.replace('_DISPLAY', '');
                        if (colMap[key]) {
                            exportCols.push({
                                datafield: key,
                                hidden: !!colMap[key].hidden
                            });
                        }
                    }
                }
                action.handler(exportCols);
            } else {
                for (var i = 0; i < clength; i++) {
                    if (columns[i].datafield) {
                        var key = columns[i].datafield.replace('_DISPLAY', '');
                        if (colMap[key]) {
                            columns[i].hidden = colMap[key].hidden;
                        }
                    }
                }
                action.handler(columns);
            }

        };
        $.bhCustomizeColumn({
            model: newmodel,
            alwaysHide: instance.settings.alwaysHide,
            callback: callback,
            columns: columns,
            title: action.name
        });
    }

    /**
     * 生成自定义列
     * @param  {String} type 自定义列类型
     * @return {Object}       自定义列column
     */
    function _genCustomColumns(type, instance, jqxOptions, showCheckAll, widthObj, model, datafield, custom_ready, custom_rendered) {
        var column = null;
        // checkbox列不可排序
        switch (type) {
            case 'checkbox':
                var pinned = model.custom.pinned;
                if (pinned !== true) {
                    pinned = false;
                }
                column = {
                    text: 'checkbox',
                    datafield: 'field_checkbox',
                    width: 32,
                    minWidth: 32,
                    maxWidth: 32,
                    cellsAlign: 'center',
                    align: 'center',
                    sortable: false,
                    pinned: pinned,
                    renderer: function(text, align, height) {
                        var checkBox = '<div class="selectAllCheckboxFlag bh-checkbox bh-mh-8"><label><input type="checkbox" value=""><i class="bh-choice-helper"></i></label></div>';
                        if (showCheckAll === false) {
                            return ' ';
                        }
                        return checkBox;
                    },
                    rendered: function(element, align, height) {
                        //头部的checkbox点击事件的绑定
                        element.on("click", "input", function(e) {
                            var $table = instance.$element;
                            var $tableContent = $table.find('table:not([id^="pinnedtable"])');
                            if ($table.find('table[id^="pinnedtable"]').length > 0) {
                                $tableContent = $table.find('table[id^="pinnedtable"]');
                            }
                            var $checkboxList = $tableContent.find("div.bh-checkbox");

                            var $input = $(this);
                            if ($input.hasClass("selectFlag")) {
                                $input.prop("checked", false).removeClass("selectFlag");
                                $checkboxList.each(function() {
                                    $(this).find("input").prop("checked", false);
                                });
                            } else {
                                $input.prop("checked", true).addClass("selectFlag");
                                $checkboxList.each(function() {
                                    $(this).find("input").prop("checked", true);
                                });
                            }

                            //触发自定义全选按钮事件
                            $(this).trigger('checkall');
                            e.stopPropagation();
                        });
                        return true;
                    },
                    cellsRenderer: function(row, column, value, rowData) {
                        var checkBox = '<div data-sss="" class="bh-checkbox bh-mh-4" style="margin-left:0 !important;"><label><input type="checkbox" value=""><i class="bh-choice-helper"></i></label></div>';

                        return checkBox;
                    }
                };

                //增加处理函数
                jqxOptions.rendered = function() {
                    //数据加载完成，读取各列的checkbox，判断头部的checkbox是否要勾选
                    var $table = instance.$element;
                    var $tableContent = $table.find('table:not([id^="pinnedtable"])');
                    if ($table.find('table[id^="pinnedtable"]').length > 0) {
                        $tableContent = $table.find('table[id^="pinnedtable"]');
                    }
                    var $checkboxList = $tableContent.find("div.bh-checkbox");
                    var isSelectAllFlag = true;
                    if ($checkboxList.length == 0) {
                        isSelectAllFlag = false;
                    }
                    $checkboxList.each(function() {
                        var $itemCheckbox = $(this);
                        if ($itemCheckbox.find("input[checked]").length === 0) {
                            isSelectAllFlag = false;
                            return;
                        }
                    });
                    var $selectAllCheckbox = $tableContent.find("div.selectAllCheckboxFlag").find("input");
                    // if(isSelectAllFlag){
                    //     $selectAllCheckbox.prop("checked", true).addClass("selectFlag");
                    // }else{
                    //     $selectAllCheckbox.prop("checked", false).removeClass("selectFlag");
                    // }
                    if ($selectAllCheckbox.hasClass('selectFlag')) {
                        $checkboxList.find('input').attr('checked', true);
                    }

                    //调用外部定义的rendered函数
                    if (typeof custom_rendered === 'function') {
                        custom_rendered();
                    }
                };

                jqxOptions.ready = function() {
                    //初始化完成后，绑定checkbox的点击事件
                    instance.$element.on("click", "div.bh-checkbox", function() {
                        _scenesTableContentCheckboxClick($(this).find("input"), instance);
                        //触发自定义事件
                        $(this).trigger('checkone');
                    });

                    //调用外部定义的rendered函数
                    if (typeof custom_ready === 'function') {
                        custom_ready();
                    }

                };
                break;

            case 'radio':
                var guid = BH_UTILS.NewGuid();
                var pinned = model.custom.pinned;
                if (pinned !== true) {
                    pinned = false;
                }
                column = {
                    text: 'radio',
                    datafield: 'field_radio',
                    width: 32,
                    minWidth: 32,
                    maxWidth: 32,
                    cellsAlign: 'center',
                    align: 'center',
                    sortable: false,
                    pinned: pinned,
                    renderer: function(text, align, height) {
                        var radio = '选择';
                        return radio;
                    },
                    cellsRenderer: function(row, column, value, rowData) {
                        var radio = '<div data-sss="" class="bh-radio bh-mh-4" style="margin-left:0 !important;"><label style="padding-left: 0;"><input name="' + guid + '" type="radio" value=""><i class="bh-choice-helper"></i></label></div>';
                        return radio;
                    }
                };

                jqxOptions.ready = function() {
                    //初始化完成后，绑定checkbox的点击事件
                    instance.$element.on("click", "div.bh-radio", function() {
                        //触发自定义事件
                        $(this).trigger('checkone');
                    });

                    //调用外部定义的rendered函数
                    if (typeof custom_ready === 'function') {
                        custom_ready();
                    }

                };
                break;
            case 'link':
                var pinned = model.custom.pinned;
                if (pinned !== true) {
                    pinned = false;
                }
                var default_column = {
                    text: model.caption,
                    datafield: datafield,
                    pinned: pinned
                }
                var cus_column = {
                    cellsRenderer: function(row, column, value, rowData) {
                        if (!isNaN(value)) {
                            value = value.toString();
                        }
                        //qiyu 2016-8-31 解决ie9，placeholder插件点击后不再显示的问题
                        // return '<a href="javascript:void(0);" class="j_link_' + column + '">' + value + '</a>';
                        return '<a class="sc-cursor-point j_link_' + column + '">' + value + '</a>';
                    }
                }
                column = $.extend(default_column, cus_column, widthObj);
                break;
            case 'tpl':
                var default_column = {
                    text: model.caption,
                    datafield: datafield,
                    sortable: false //自定义显示列默认不能排序
                }
                column = $.extend(default_column, model.custom.column, widthObj);
        }
        return column;
    }


    /**
     * 点击tbody上的checkbox，处理头部的checkbox是否要勾选
     * @param $input
     */
    function _scenesTableContentCheckboxClick($input, instance) {
        if (!$input.hasClass("selectAllCheckboxFlag")) {
            var $table = instance.$element;
            var $selectAllCheckbox = $table.find("div.selectAllCheckboxFlag").find("input");
            var $tableContent = $table.find("table");
            var $checkboxList = $tableContent.find("div.bh-checkbox");
            if ($input.prop("checked")) {
                var isSelectAllFlag = true;
                $checkboxList.find("input").each(function() {
                    if (!$(this).prop("checked")) {
                        isSelectAllFlag = false;
                    }
                });

                if (isSelectAllFlag) {
                    $selectAllCheckbox.prop("checked", true).addClass("selectFlag");
                } else {
                    $selectAllCheckbox.prop("checked", false).removeClass("selectFlag");
                }
            } else {
                $selectAllCheckbox.prop("checked", false).removeClass("selectFlag");
            }
        }
    }

    /**
     * 这里是关键
     * 定义一个插件 plugin
     */
    $.fn.emapdatatable = function(options, params, callback, flag) {
        var instance, initParams;
        instance = this.data('emapdatatable');
        initParams = this.data('initParams') || {};
        /**
         * 判断插件是否已经实例化过，如果已经实例化了则直接返回该实例化对象
         */
        if (!instance) {
            //params为表格渲染的初始化参数，后续表格的reload始终会携带该参数
            $(this).data('initParams', options.params);
            return this.each(function() {
                //将实例化后的插件缓存在dom结构里（内存里）
                return $(this).data('emapdatatable', new Plugin(this, options));
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
            var paramsObj = $.extend({}, initParams, params);
            var querySetting = [];
            //默认如果请求参数中有高级搜索的参数 会把其他参数合并进高级搜索参数querySetting
            //如果flag为false则不合并。
            if (typeof paramsObj.querySetting == 'undefined') {

            }
            if (typeof paramsObj.querySetting != 'undefined' && flag !== false) {
                querySetting = JSON.parse(paramsObj.querySetting);
                $.each(paramsObj, function(k, v) {
                    if (k != 'querySetting' && ($.type(v) == 'number' || $.type(v) == 'string' || $.type(v) == 'boolean')) {
                        querySetting.push({
                            name: k,
                            value: v,
                            linkOpt: 'and',
                            builder: 'equal'
                        });
                    }
                });
                paramsObj.querySetting = JSON.stringify(querySetting);
            }
            return instance[options](paramsObj, callback);
        }
        return this;
    };

    /**
     * 插件的默认值
     */
    var height = null;
    if (typeof BH_UTILS != 'undefined') {
        height = BH_UTILS.getTableHeight(10);
    }

    var localization = null;
    if (typeof Globalize != 'undefined') {
        localization = Globalize.culture("zh-CN");
    }

    /**
     * @memberof module:emapdatatable
     * @description 其他参数参考jqxDatatable
     * @prop {String} [pk=WID] - 数据主键字段
     * @prop {String} [url] - 请求表格数据的后台接口, url和pagePath二选一必填
     * @prop {String} [pagePath] - 请求表格数据页面地址, url和pagePath二选一必填
     * @prop {Object} params - 请求参数
     * @prop {Array} datamodel - 一般为emap返回的数据模型
     * @prop {String} action - emap动作名
     * @prop {Array} customColumns - 自定义表格列,colIndex:该自定义位于表格第几列，从0开始，最后一列可以设置‘last’； colField: 自定义列作用的列模型字段； type: 自定义列类型，支持checkbox，link，tpl。chekcbox不可定义colField参数，如果定义了colIndex，则customColumns数组必须按照colIndex值由小到大排序
     * @prop {Int|Stirng} [height] - 高度
     * @prop {Boolean} [pageable=true] - 是否分页
     * @prop {String} [pagerMode=advanced] - 分页形式 'advanced' 'simple'
     * @prop {Boolean} [serverProcessing=true] - 是否开启服务端分页
     * @prop {Array} [pageSizeOptions=['10', '20', '50', '100']] - 分页条数选项
     * @prop {String} [localization='zh-CN'] - 语言选择
     * @prop {Boolean} [sortable=false] - 排序
     * @prop {String} [selectionMode='custom'] - Sets or gets the selection mode. Possible values: "multipleRows", "singleRow" and "custom". In the "custom" mode, rows could be selected/unselected only through the API.
     * @prop {Boolean} [enableBrowserSelection=true] - Enables or disables the default text selection of the web browser.
     * @prop {Boolean} [columnsResize=true] - Sets or gets the jqxDataTable's columnsResize.
     * @prop {Boolean} [colHasMinWidth=true] - 列宽是否有默认最小值100px
     * @prop {Boolean} [schema=true] - 启用schema，必须定义 contextPath   &&  未定义contextPath时   schema 不生效
     * @prop {String} [contextPath] - 根路径
     * @prop {Int} [minLineNum] - 最小高度行数
     * @prop {Boolean} [fastRender=false] - 快速渲染， 用于提高表格渲染速度
     * @prop {Function} [beforeSend] - 请求发送前的回调函数
     * @prop {Function} [downloadComplete] - 表格数据请求完成的回调
     */
    $.fn.emapdatatable.defaults = {
        width: '100%',
        height: height,
        pageable: true,
        pagerMode: 'advanced',
        serverProcessing: true,
        pageSizeOptions: ['10', '20', '50', '100'],
        localization: localization,
        sortable: false,
        selectionMode: "custom",
        enableBrowserSelection: true,
        columnsResize: true,
        colHasMinWidth: true, // 列宽是否有默认最小值100px
        beforeSend: null,
        contextPath: '', //
        schema: true, // 启用schema，必须定义 contextPath   &&  未定义contextPath时   schema 不生效
        minLineNum: null,
        alwaysHide: ['WID', 'TBRQ', 'TBLX', 'CZRQ', 'CZZ', 'CZZXM'], // 自定义显示列的隐藏字段
        fastRender: false
    };

}).call(this);
(function() {
    var Plugin,
        _init,
        _getValidateCondition,
        _getValueLength; //插件的私有方法

    Plugin = (function() {

        function Plugin(element, options) {
            if ($.fn.emapValidate.rules) {
                $.fn.emapValidate.allRules = $.extend({}, $.fn.emapValidate.defaultRules, $.fn.emapValidate.rules);
            } else {
                $.fn.emapValidate.allRules = $.fn.emapValidate.defaultRules;
            }
            this.options = $.extend({}, $.fn.emapValidate.defaults, options);
            this.$element = $(element);
            _init($(element), options);

        }

        Plugin.prototype.validate = function() {
            return this.$element.jqxValidator('validate');
        };

        Plugin.prototype.destroy = function() {
            this.options = null;
            $(this.$element).data('validate', false)
                .find('.jqx-validator-error-info').remove(); // 修复jqx destroy方法 对日期控件的bug
            return this.$element.jqxValidator('destroy');
        };
        return Plugin;
    })();

    _init = function(element, options) {
        var validateRules = _getValidateCondition(element, options);
        if (options.callback) {
            options.callback(validateRules);
        }
        element.jqxValidator({
            useHintRender: true,
            rules: validateRules
        });
    };

    _getValidateCondition = function(element, options) {
        var rules = [];
        $('[xtype]', element).each(function() {
            var _this = $(this);
            var itemRules;
            // 跳过隐藏字段 跳过disable 字段 跳过表格表单的只读字段和隐藏字段
            if (_this.closest('.bh-row').attr('hidden') || _this.closest('.bh-form-group').css('display') === 'none' || _this.closest('.bh-form-group').hasClass('bh-disabled') || _this[0].nodeName == 'P' || _this.attr('xtype') == 'div') {
                return true
            }
            //2016-04-20 qiyu 表格表单
            // var row = _this.closest('.bh-row');
            var row = _this.closest('.form-validate-block');

            var name = _this.data('name');
            var label = $('label.bh-form-label', row).text();
            var xtype = _this.attr('xtype');
            var dataType = _this.data('type');

            // double 类型的字段 自动添加 double 校验和  长度为21的校验
            if (_this.data('type') == 'double') {
                rules.push({
                    input: '[data-name=' + name + ']',
                    message: '无效的数字格式',
                    action: 'change, blur, valuechanged',
                    rule: function() {
                        if (_this.val() == '') return true;
                        return /^\d+(\.\d{1,2})?$/g.test(_this.val());
                    }
                });
                rules.push({
                    input: '[data-name=' + name + ']',
                    message: '长度超出限制',
                    action: 'change, blur, valuechanged',
                    rule: function() {
                        if (_this.val() == '') return true;
                        return /^\d+(\.\d{1,2})?$/g.test(_this.val());
                    }
                });
            }

            // int 类型的字段 自动添加 数字校验
            if (_this.data('type') == 'int') {
                rules.push({
                    input: '[data-name=' + name + ']',
                    message: $.fn.emapValidate.allRules['integer'].alertText,
                    action: 'change, blur, valuechanged',
                    rule: function() {
                        if (_this.val() == "") {
                            return true;
                        } // 空值不做校验
                        var value = _this.val();
                        // 开关按钮兼容处理
                        if (_this.attr('xtype') == 'switcher') {
                            if (value === true) {
                                value = 1;
                            } else if (value === false) {
                                value = 0;
                            }
                        }
                        return new RegExp($.fn.emapValidate.allRules['integer'].regex).test(value);
                    }
                });
            }

            //  必填校验
            if ($('.bh-required', row).length > 0) {

                if (xtype == 'static') {
                    return;
                }
                itemRules = {
                    input: '[data-name=' + name + ']',
                    message: label + '不能为空',
                    action: 'change, blur, valuechanged',
                    rule: 'required'
                };
                if (xtype == 'select' || xtype == 'date-local' || xtype == 'date-ym' || xtype == 'date-full' || xtype == 'selecttable') {
                    itemRules.rule = function() {
                        if (_this.hasClass('jqx-rc-b-expanded')) {
                            return true;
                        }
                        return _this.val() != '';
                    }
                }
                if (xtype == 'date-local' || xtype == 'date-ym' || xtype == 'date-full') {
                    itemRules.action = 'dateInputBlur, close';
                    itemRules.rule = function() {
                        return _this.bhDateTimePicker('getValue') != "";

                    }
                }

                if (xtype == 'number') {
                    itemRules.rule = function() {
                        return _this.find('input').val() != '';
                    };
                }

                if (xtype == 'select' || xtype == 'multi-select2') {
                    itemRules.action = 'change, select';

                }

                if (xtype == 'tree') {
                    itemRules.rule = function() {
                        return _this.emapDropdownTree('getValue') != '';
                    }
                }
                if (xtype == 'multi-select') {
                    itemRules.rule = function() {
                        return _this.jqxComboBox('getSelectedItems').map(function(item) {
                            return item.value;
                        }).join(',') != '';
                    };
                }
                if (xtype === 'textarea') {
                    itemRules.action = 'c-blur',
                        itemRules.rule = function() {
                            return _this.bhTxtInput('getValue') != '';
                        };
                }
                if (xtype === 'number-range') {
                    itemRules.rule = function() {
                        var valArr = _this.bhNumRange('getValue').split(',');
                        return valArr[0] != '' && valArr[1] != '';
                    };
                }
                // 上传的必填校验
                if (xtype == 'uploadfile' || xtype == 'uploadsingleimage' || xtype == 'uploadmuiltimage') {
                    itemRules.action = 'blur';
                    itemRules.rule = function() {
                        if (xtype == 'uploadfile') {
                            return _this.emapFileUpload('getFileNum') != 0;
                        } else if (xtype == 'uploadsingleimage') {
                            return _this.emapSingleImageUpload('getFileNum') != 0;
                        } else if (xtype == 'uploadmuiltimage') {
                            return _this.emapImageUpload('getFileNum') != 0;
                        }
                    }
                }

                rules.push(itemRules);
            }

            // 内容长度校验
            /**
             * 5-16 学工业务线要求,textareaEasyCheck只对文本域有效
             *
             */

            // var maxLength = _this.attr('maxlength');
            var maxLength = _this.data('checksize');
            if (!maxLength) {
                if (options.textareaEasyCheck) {
                    //  bi~bi~bi~ 开启简单长度校验模式,所有字符 都算三个长度
                    // if (dataType == 'String' && (!xtype || xtype == 'text' || xtype == 'textarea')) {
                    if (dataType == 'String' && (xtype == 'textarea')) {
                        maxLength = _this.data('size') ? Math.floor(_this.data('size') / 3) : 0;
                    } else {
                        maxLength = _this.data('size') ? _this.data('size') : 0;
                    }
                } else {
                    // 默认:  严格校验模式 , 只有汉字算三个长度
                    maxLength = _this.data('size') ? _this.data('size') : 0;
                }
            }

            if (maxLength) {
                itemRules = {
                    input: '[data-name=' + name + ']',
                    message: label + '长度超出限制',
                    action: 'change, blur, valuechanged',
                    rule: function() {
                        return _getValueLength(_this.val()) <= maxLength;
                    }
                };

                if (options.textareaEasyCheck && xtype == 'textarea') {
                    itemRules.message = label + '长度不能超过' + maxLength + '个字';
                    itemRules.rule = function() {
                        return _this.val().length <= maxLength;
                    }
                }

                // 文本框金额类的 小数  长度校验
                if ((xtype == 'text' || !xtype) && maxLength.toString().indexOf(',') > -1) {
                    var lengthArr = maxLength.split(',');
                    itemRules.rule = function() {
                        if (_this.val() == '') return true;
                        var valArr = _this.val().toString().split('.');
                        if (valArr.length > 1) {
                            if (valArr[1].length > lengthArr[1]) return false
                        }

                        return valArr[0].length <= lengthArr[0] - lengthArr[1];
                    };

                    rules.push({
                        input: '[data-name=' + name + ']',
                        message: '金额类型不正确',
                        action: 'change, blur, valuechanged',
                        rule: function() {
                            if (_this.val() == '') return true;
                            return /^\d+(\.\d{1,2})?$/g.test(_this.val());
                        }
                    });
                }

                if (xtype == 'multi-select') {
                    itemRules.message = '最多选择' + maxLength + '项';
                    itemRules.rule = function() {
                        return _this.jqxComboBox('getSelectedItems').length <= (maxLength);
                    }
                }

                if (xtype == 'multi-select2') {
                    itemRules.message = '最多选择' + maxLength + '项';
                    itemRules.rule = function() {
                        return _this.jqxDropDownList('getCheckedItems').length <= (maxLength);
                    }
                }

                //日期控件类型没有长度校验
                if (xtype == 'date-local' || xtype == 'date-ym' || xtype == 'date-full') {

                } else {
                    rules.push(itemRules);
                }
            }

            // 正则校验

            var exp = decodeURI(_this.data('checkexp'));
            if (exp && exp != "undefined") {
                rules.push({
                    input: '[data-name=' + name + ']',
                    message: label + '不正确',
                    action: 'change, blur, valuechanged',
                    rule: function() {
                        if (_this.val() == "") {
                            return true;
                        } // 空值不做校验
                        return eval(exp).test(_this.val());
                    }
                });
            }


            // 日期控件的 内容附件校验   防止提交奇怪的字符串
            if ($.inArray(xtype, ['date-loacl', 'date-ym', 'date-full']) > -1) {
                rules.push({
                    input: '[data-name=' + name + ']',
                    message: '日期格式不正确',
                    action: 'change, blur, valuechanged',
                    rule: function() {
                        if (_this.bhDateTimePicker('getValue') == "") {
                            return true;
                        } // 空值不做校验
                        return !isNaN(parseInt(_this.bhDateTimePicker('getValue')));
                    }
                })
            }

            // 类型校验
            // 'data-jsonparam="' + encodeURI(JSON.stringify(attr.JSONParam)) + '"'
            var jsonType = decodeURI(_this.data('jsonparam'));
            var checkType = decodeURI(_this.data('checktype'));
            if (!checkType || checkType == 'undefined') checkType = jsonType;
            checkType = checkType.replace(/\[|\]|\"|\{|\}|custom/g, "");
            if ($.fn.emapValidate.allRules[checkType]) {
                itemRules = {
                    input: '[data-name=' + name + ']',
                    message: $.fn.emapValidate.allRules[checkType].alertText,
                    action: 'change, blur, valuechanged'
                };
                if ($.fn.emapValidate.allRules[checkType].regex) {
                    itemRules.rule = function() {
                        if (_this.val() == "") {
                            return true;
                        } // 空值不做校验
                        return new RegExp($.fn.emapValidate.allRules[checkType].regex).test(_this.val());
                    }
                } else if ($.fn.emapValidate.allRules[checkType].func) {
                    itemRules.rule = function() {
                        if (_this.val() == "") {
                            return true;
                        } // 空值不做校验
                        return $.fn.emapValidate.allRules[checkType].func(_this.val());
                    }
                }
                rules.push(itemRules);
            } else if (/^after/g.test(checkType) || /^before/g.test(checkType)) {
                itemRules = {
                    input: '[data-name=' + name + ']',
                    action: 'change, blur, valuechanged'
                };
                var formEle = _this.closest('[bh-form-role=bhForm]');
                var targetLabel; // 参照字段的label

                if (/^before/g.test(checkType)) {
                    var checkField = checkType.replace('before', '');
                    if (checkField == 'now') {
                        targetLabel = '今天';
                    } else {
                        targetLabel = $('[data-name=' + checkField.replace('=', '') + ']', formEle).data('caption');
                    }
                    itemRules.message = $.fn.emapValidate.allRules['before'].alertText.replace('*1', label).replace('*2', targetLabel);
                    if (/=/g.test(checkField)) {
                        checkField = checkField.replace('=', '');
                        itemRules.rule = function() {
                            if (!_this.val()) return true;
                            return $.fn.emapValidate.allRules['before='].func(_this.val(), checkField, _this.closest('[bh-form-role=bhForm]'));
                        }
                    } else {
                        itemRules.rule = function() {
                            if (!_this.val()) return true;
                            return $.fn.emapValidate.allRules.before.func(_this.val(), checkField, _this.closest('[bh-form-role=bhForm]'));
                        }
                    }

                }
                if (/^after/g.test(checkType)) {
                    var checkField = checkType.replace('after', '');
                    if (checkField == 'now') {
                        targetLabel = '今天';
                    } else {
                        targetLabel = $('[data-name=' + checkField.replace('=', '') + ']', formEle).data('caption');
                    }
                    itemRules.message = $.fn.emapValidate.allRules['after'].alertText.replace('*1', label).replace('*2', targetLabel);
                    if (/=/g.test(checkField)) {
                        checkField = checkField.replace('=', '');
                        itemRules.rule = function() {
                            if (!_this.val()) return true;
                            return $.fn.emapValidate.allRules['after='].func(_this.val(), checkField, _this.closest('[bh-form-role=bhForm]'));
                        }
                    } else {
                        itemRules.rule = function() {
                            if (!_this.val()) return true;
                            return $.fn.emapValidate.allRules.after.func(_this.val(), checkField, _this.closest('[bh-form-role=bhForm]'));
                        }
                    }

                }
                rules.push(itemRules);
            }

            // 对于整数和 数字的校验 添加 最大为22 的长度校验  wuying  0726
            if ($.inArray(checkType, ['number', 'integer']) > -1) {
                rules.push({
                    input: '[data-name=' + name + ']',
                    message: label + '长度超出限制',
                    action: 'change, blur, valuechanged',
                    rule: function() {
                        return _this.val().length <= 22;
                    }
                });
            }

            if ($.inArray(xtype, ['uploadfile']) > -1) {
                rules.push({
                    input: '[data-name=' + name + ']',
                    message: '文件错误',
                    action: 'bh-file-upload-validate',
                    rule: function() {
                        return _this.find('.bh-error').length === 0;
                    }
                });
            }
        });
        return rules;
    };


    // 获取取值长度   中文为 3个字符
    _getValueLength = function(val) {
        return val.replace(/[\u0391-\uFFE5]/g, '***').length;
    };

    $.fn.emapValidate = function(options) {
        var instance;
        instance = this.data('validate');
        if (!instance) {
            return this.each(function() {
                return $(this).data('validate', new Plugin(this, options));
            });
        }
        if (options === true) return instance;
        if ($.type(options) === 'string') return instance[options]();
        return this;
    };

    $.fn.emapValidate.defaults = {
        easyCheck: false,
        textareaEasyCheck: false
    };


    $.fn.emapValidate.defaultRules = WIS_EMAP_INPUT.validateRules;

}).call(this);
