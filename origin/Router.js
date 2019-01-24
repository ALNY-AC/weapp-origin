var app = getApp();
var Router = {
    /**
     * 
     * @param {Object} opt 通过参数获取字符串的url
     */
    getUrl(opt) {
        let { query, url } = opt;
        let _query = query ? Object.keys(query).map((key) => key + "=" + query[key]).join("&") : false;
        return _query ? `${url}?${_query}` : url;
    },
    /**
     * 
     * @param {Object} opt 路由参数：
     * {
     *      url:'要跳转的地址',
     *      query:{
     *          //路由参数
     *      }
     * }
     */
    to(opt) {
        // 获取字符串的url
        opt.url = this.getUrl(opt);
        // 转换一下，防止误修改
        let _opt = JSON.stringify(opt);
        // 调用微信的跳转函数，默认是 navigateTo 跳转
        wx[(opt['mode'] ? opt['mode'] : 'navigateTo')](opt);
        // 返回路由信息，不过一般到这页面就跳转了
        return JSON.parse(_opt);
    },
    // 初始化函数
    initRouter() {
        // 设置当前页面的地址，微信应该有处理方法，没有试过
        this.path = '/' + this.getUrl({ url: getCurrentPages()[0].route, query: this.query });
    },
    // 当前页面的地址
    path: '',
    // 当前页面的路由参数
    query: {},
}
module.exports = Router;
