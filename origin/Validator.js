// 验证类
class Validator {
    constructor() {
        this._map = null;
    }
    map(map) {
        this._map = map;
        return this;
    }
    validate(obj, success) {
        let map = this._map;
        for (let x in obj) {
            let item = obj[x];
            if (map[x]) {
                if (map[x]['required']) {
                    // 必填
                    if (typeof map[x].type == 'undefined' || map[x].type == 'string') {
                        if ((item + '').length <= 0) {
                            map[x].error(item, x);
                            return false;
                        }
                    }
                }
            }
        }
        success(true);
    }
}

module.exports = Validator;