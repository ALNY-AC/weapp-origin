function parseGetter(exp) {
    if (/[^\w.$]/.test(exp)) return;
    var exps = exp.split('.');
    return function (obj) {
        for (var i = 0, len = exps.length; i < len - 1; i++) {
            if (!obj) return;
            obj = obj[exps[i]];
        }
        return obj;
    }
}
function Getter(exp) {
    if (/[^\w.$]/.test(exp)) return;
    var exps = exp.split('.');
    return function (obj) {
        for (var i = 0, len = exps.length; i < len; i++) {
            if (!obj) return;
            obj = obj[exps[i]];
        }
        return obj;
    }
}
/**
 * 
 * @param {Object} vm 实例
 */
function Tool(vm) {
    var tool = {
        update(vm, key, value) {
            // let keys = key.split('.');
            // let test = getJson(keys, 0, vm, isEnd);
            // let a = parseGetter(key).call(vm, vm);
            // a[keys[keys.length - 1]] = value;
            let oldValue = vm.$(key);
            // 本质上是小程序的setData，但是会在更新后，调用watch监听函数
            vm.setData({
                [key]: value
            });
            if (vm.watch) {
                if (vm.watch[key]) {
                    vm.watch[key].call(vm, value, oldValue);
                }
            }
        }
    }
    // 事件命令，目前只实现了更新data中的变量
    vm.$emit = function (key = false, value) {
        if (!key) return false;
        var methods = key.split(':')[0];//命令的名称
        var key = key.split(':')[1];//值的路径
        tool[methods](this, key, value);//调用处理函数
        return this;
    };

    /**
     * 
     * @param {String} key 要修改或获取的值的路径，可以连续调用下去，比如：form.user.id ，就会返回id的值
     * @param {*} value 如果想要修改某个值，就传入第这个参数，否则会返回 key 指定的值
     */
    vm.$ = function (key = false, value) {
        if (typeof value == "undefined") {
            // 模式1：获取值
            if (!key) return false;
            // 设置上下文为小程序实例
            let v = Getter(key).call(this, this.data);
            return v;
        } else {
            // 模式2：设置值
            // 调用封装过的方法
            return this.$emit(`update:${key}`, value);
        }
    };
    // 封装的小方法，快速小黑框提示
    vm.$toast = function (msg = '', icon = 'none') {
        wx.showToast({
            title: msg,
            icon: icon
        });
    };
}

module.exports = Tool;
