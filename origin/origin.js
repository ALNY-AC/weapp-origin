var app = getApp();
import Http from "Http.js";//ajax处理类
import Router from "Router.js";//路由处理类
import Tool from "Tool.js";//工具类
import Directive from "Directive.js";//指令类

/**
 * 
 * @param {Object} opt 实例
 */
function Origin(opt) {
    let vm = opt;
    // 把methods的函数拼接进主体
    Object.assign(vm, opt.methods);
    // 清空函数
    vm.methods = {};
    // 很多框架都是在 onReady 函数里面做处理，事实证明也只能在这处理（笑）
    vm.onReady = function () {
        // 初始化路由
        this.$router.initRouter();
        // 获取当前页面地址
        let url = this.$router.getUrl({ url: getCurrentPages()[0].route, query: this.$router.query });
        // 调动登录接口，登录成功后回跳，具体处理根据业务来
        app.userLoginApp(url, () => {
            // 这个函数是封装的，更新data里面变量的
            this.$emit('update:$app', app.globalData);
            // 模仿vue的生命周期，这个函数会在登录完成后，一切准备就绪后调用
            if (this.mounted) this.mounted();
        });
    }
    // 统一加上转发，根据业务需要，可删除
    if (typeof vm.onShareAppMessage == "undefined") {
        vm.onShareAppMessage = function () { };
    }

    // 如果已经声明 onLoad ，就不继续声明，以免覆盖原有的逻辑，但不能使用路由
    if (!vm.onLoad) {
        vm.onLoad = function (query) {
            this.$router.query = query;
        }
    }
    vm.$router = Router;//路由
    vm.$http = Http//http请求
    Tool(vm);//快捷工具
    Directive(vm);//事件指令
    Page(vm);//微信的page函数
}

module.exports = Origin;
