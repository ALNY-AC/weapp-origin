// o-model双向绑定类

var modelTool = {
    OModel: {
        picker(e) {
        },
        input(e) {
            let key = e.currentTarget.dataset.model;
            let value = '';
            if (typeof e.detail == "object") {
                value = e.detail.value;
            }
            if (typeof e.detail == "string") {
                value = e.detail;
            }
            if (Array.isArray(e.detail)) {
                value = e.detail;
            }
            if (typeof e.currentTarget.dataset['value'] != 'undefined') {
                value = e.currentTarget.dataset['value'];
            }
            this.$emit(`update:${key}`, value);

        }
    }
}


function Directive(vm) {
    vm['o-model'] = function (e) {
        // 下面大部分是查找值在哪个变量下面
        let dataset = e.currentTarget.dataset;
        let modelType = typeof dataset.modelType == 'undefined' ? 'input' : dataset.modelType;
        if (modelTool.OModel[modelType]) {
            modelTool.OModel[modelType].call(this, e);
        } else {
            console.warn(`[origin] ${modelType} 是无效的Model方式!`);
        }
        let method = dataset['method'] ? dataset['method'] : false;
        if (method) {
            if (this[method]) {
                this[e.currentTarget.dataset['method']](e);
            } else {
                console.warn(`[origin] ${method} 方法不存在!`);
            }
        }
    }
}

module.exports = Directive;
