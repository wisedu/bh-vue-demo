import * as types from './mutation-types';

export const fetchStaffs = function ({ dispatch, state }) {
    var staffs = ['Steven White', 'Nancy King', 'Nancy Davolio', 'Robert Davolio', 'Michael Leverling', 'Andrew Callahan', 'Michael Suyama', 'Anne King', 'Laura Peacock', 'Robert Fuller', 'Janet White', 'Nancy Leverling', 'Robert Buchanan', 'Margaret Buchanan', 'Andrew Fuller', 'Anne Davolio', 'Andrew Suyama', 'Nige Buchanan', 'Laura Fuller'];

    setTimeout(() => {
        dispatch(types.STAFF_LIST, staffs);
    }, 3000);
};

export const fetchMenus = function ({ dispatch, state }) {
    var menus = {
        title: '组件列表',  // 标题
        iconFont: '', // 字体图标的总类名
        data: [[
            {
                'text': '输入框组', // 菜单名
                'icon': 'iconfont icon-bookmark',
                'href': '#!/',
                'active': true  // 该标题为选中状态，必须有一个菜单的该属性是true
            }, {
                'text': '卡片',
                'icon': 'iconfont icon-menu',
                'href': '#!/card'
            }, {
                'text': '面板',
                'icon': 'iconfont icon-menu',
                'href': '#!/panel'
            }, {
                'text': '下拉框',
                'icon': 'iconfont icon-menu',
                'href': '#!/dropdown'
            }, {
                'text': '步骤向导',
                'icon': 'iconfont icon-menu',
                'href': '#!/stepwizard'
            }, {
                'text': '竖向步骤条',
                'icon': 'iconfont icon-menu',
                'href': '#!/stepflow'
            }, {
                'text': '列表选择器',
                'icon': 'iconfont icon-menu',
                'href': '#!/choose'
            }, {
                'text': '表格[jqwidgets]',
                'icon': 'iconfont icon-tablet',
                'href': '#!/datatable'
            }, {
                'text': '表格[EMAP]',
                'icon': 'iconfont icon-tablet',
                'href': '#!/emap-datatable'
            }, {
                'text': '高级表格[EMAP Grid]',
                'icon': 'iconfont icon-tablet',
                'href': '#!/emap-grid'
            }, {
                'text': '普通多条件搜索[EMAP]',
                'icon': 'iconfont icon-tablet',
                'href': '#!/emap-search'
            }, {
                'text': '高级搜索[EMAP]',
                'icon': 'iconfont icon-tablet',
                'href': '#!/emap-search-adv'
            }, {
                'text': '卡片列表[EMAP]',
                'icon': 'iconfont icon-tablet',
                'href': '#!/emap-card'
            }, {
                'text': '表单[EMAP]',
                'icon': 'iconfont icon-tablet',
                'href': '#!/emap-form'
            }, {
                'text': '下拉表格[EMAP]',
                'icon': 'iconfont icon-tablet',
                'href': '#!/emap-dd-table'
            }, {
                'text': '下拉树[EMAP]',
                'icon': 'iconfont icon-tablet',
                'href': '#!/emap-dd-tree'
            }, {
                'text': '级联下拉[EMAP]',
                'icon': 'iconfont icon-tablet',
                'href': '#!/emap-linkage'
            }, {
                'text': '日历',
                'icon': 'iconfont icon-tablet',
                'href': '#!/calendar'
            }, {
                'text': '文件上传',
                'icon': 'iconfont icon-tablet',
                'href': '#!/fileupload'
            }, {
                'text': '图片上传',
                'icon': 'iconfont icon-tablet',
                'href': '#!/imageupload'
            }, {
                'text': '头像裁剪上传',
                'icon': 'iconfont icon-tablet',
                'href': '#!/avatarupload'
            }, {
                'text': '加载效果',
                'icon': 'iconfont icon-filter',
                'href': '#!/loading'
            }, {
                'text': '工具提示',
                'icon': 'iconfont icon-settings',
                'href': '#!/tooltip'
            }, {
                'text': '气泡弹窗',
                'icon': 'iconfont icon-settings',
                'href': '#!/popover'
            }, {
                'text': '模态对话框',
                'icon': 'iconfont icon-settings',
                'href': '#!/window'
            }, {
                'text': '树形控件',
                'icon': 'iconfont icon-settings',
                'href': '#!/tree'
            }, {
                'text': 'Tab控件',
                'icon': 'iconfont icon-settings',
                'href': '#!/tab'
            }, {
                'text': '导航菜单',
                'icon': 'iconfont icon-settings',
                'href': '#!/nav'
            }, {
                'text': '分页',
                'icon': 'iconfont icon-settings',
                'href': '#!/pagination'
            }, {
                'text': '富文本编辑器',
                'icon': 'iconfont icon-settings',
                'href': '#!/editor'
            }
        ]]
    };

    dispatch(types.MENU_LIST, menus);
};

export const fetchTreeData = ({ dispatch, state }) => {
    var data = [
        {
            icon: 'resources/img/icon/tree/mailIcon.png', label: 'Mail', expanded: true, items: [
              { icon: 'resources/img/icon/tree/calendarIcon.png', label: 'Calendar', id: 11, username: 'qqq' },
              { icon: 'resources/img/icon/tree/contactsIcon.png', label: 'Contacts', selected: true }
            ]
        },
        {
            icon: 'resources/img/icon/tree/folder.png', label: 'Inbox', expanded: true, items: [
             { icon: 'resources/img/icon/tree/folder.png', label: 'Admin' },
             { icon: 'resources/img/icon/tree/folder.png', label: 'Corporate' },
             { icon: 'resources/img/icon/tree/folder.png', label: 'Finance' },
             { icon: 'resources/img/icon/tree/folder.png', label: 'Other' }
            ]
        },
        { icon: 'resources/img/icon/tree/recycle.png', label: 'Deleted Items' },
        { icon: 'resources/img/icon/tree/notesIcon.png', label: 'Notes' },
        { iconsize: 14, icon: 'resources/img/icon/tree/settings.png', label: 'Settings' },
        { icon: 'resources/img/icon/tree/favorites.png', label: 'Favorites' }
    ];

    dispatch(types.TREE_DATA, data);
};
