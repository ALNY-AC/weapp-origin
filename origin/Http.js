var app = getApp();

var Http = {
  // 处理数据，添加必选项
  handleData(data) {
    // 预设参数，比如用户id或者 token
    let map = {
      "user_id": app.globalData.user_id,
      "token": app.globalData.token,
    }

    let _data = {};
    let _map = {};
    // 将传入的参数key改为小写
    Object.keys(data).map((key) => {
      _data[key.toLowerCase()] = data[key];
    });
    // 将预设的参数key改为小写
    Object.keys(map).map((key) => {
      _map[key.toLowerCase()] = map[key];
    });

    // 把预设参数和传入参数组合
    for (let x in _map) {
      if (!_data[x]) {
        _data[x] = _map[x];
      }
    };
    // 返回处理后的数据
    return _data;
  },
  /**
   * 
   * @param {String} url 接口地址，可以携带域名，也可以不携带，会自动处理
   * @param {Object} data 要传给后端的数据
   * @param {Function} success 成功后的回调
   * @param {Function} error 接口调用失败后的回调
   * @param {String} method 请求方式，默认POST，可选值：POST|GET
   */
  ajax(url, data, success = false, error = false, method = "POST") {
    //没有http的情况下，自动加上域名
    if (url.indexOf("http") == -1) {
      url = app.globalData.WebHost + url;
    }
    //处理参数，加上预设参数和key的大小写转换
    data = this.handleData(data);
    // 调用微信的ajax请求
    wx.request({
      url: url,
      data: data,
      method: method,
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'Authorization': 'token ' + wx.getStorageSync('token'),
        "Access-TimeSpan": (new Date()).valueOf(),
      },
      success(res) {
        if (success) success(res.data, res);
      },
      fail(e) {
        if (error) error(e);
      },
      complete(e) {
        // if (option.complete) option.complete(e);
      }
    });
  },
  post(url, data = {}, success, error) {
    this.ajax(url, data, success, error, 'POST');
  },
  get() {
    // this.ajax(url, data, success, error, 'GET');
  }
}

module.exports = Http;