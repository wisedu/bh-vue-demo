WIS_EMAP_SERV.getModel = function(pagePath, actionID, type, params) {
    var pageMeta = this.getPageMeta(pagePath, params);
    var model;

    if (type == "search") {
        var url = WIS_EMAP_SERV.getAbsPath(pagePath).replace('.do', '/' + actionID + '.do');
        pageMeta = BH_UTILS.doSyncAjax(url, $.extend({ "*searchMeta": "1" }, params), 'GET');
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
}
