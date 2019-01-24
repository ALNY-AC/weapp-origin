# weapp-origin 小程序轻量级渐进式框架 

## 功能
* 无需js处理的，表单双向绑定。
* 在任何地方都可以获取url参数`this.$router.query`，抛弃 `onLoad()` 。
* 简洁的http请求：`this.$http.post()`。
* 简单的data参数`获取/设置`方式：`this.$('msg')` & `this.$('msg',1)`。
* 数据改变监听。
* 渐进式框架，按需使用，你一样可以使用小程序自带的任何api。



## 开始



**第一步，导入：**
`const origin = require('./origin/origin');`
<br>

**第二步，替换Page函数：**
<del>`Page({})`</del> 改成：`origin({})`
<br>

**第三步，按需使用：**

````JavaScript

const origin = require('./origin/origin');
const Validator = require('./origin/Validator');

origin({
    /**
     * 页面的初始数据
     */
    data: {},
    // 监听值变化
    watch: {},
    /**
     * 用户登录后的回调，一切的起点。
     */
    mounted() {
        console.warn(this.$router.query);
    },
    // 所有函数在这写
    methods: {
        test() {},
        onShow() {
            console.warn(this.$router.query);
        }
    },
    // 也可以在这写
    test(){}
    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        console.warn(this.$router.query);
    }
})

````



## 双向绑定



| 参数           | 说明                        |
| -------------- | --------------------------- |
| bind="o-model" | o-model为双向绑定函数       |
| data-model     | 想要改变的值的路径          |
| data-value     | 当o-model调用后想要设置的值 |
| data-methods   | 当值发生改变后调用的函数    |



### 简单使用



**监听事件委托至`o-model`，并且使用`data-model`设置要改变的值的路径，不需要使用js监听。**

````html
<textarea bindinput="o-model" data-model="form.info"></textarea>
````



**或使用在日期选择器上，不需要处理任何js。**

````html
<picker mode="date" value="{{form.date}}" bindchange="o-model" data-model="form.date">
    <input value='{{form.date}}' disabled placeholder='请选择'></input>
</picker>
````



**做一个开关。**

````html
<!-- 点击后会切换显示 -->
<button bindtap="o-model" data-model="isShow" data-value="{{isShow?false:true}}">		{{isShow}}
</button>
<view wx:if="{{isShow}}">Hello Word</view>
````



**当数值改变后，调用一个函数。**

````html
<!-- 值发生变化后调用函数，可以使用js中的watch或使用data-methods -->
<picker value="{{date}}" bindchange="o-model" data-methods="update" data-model="date">
</picker>
````



## 路由

使用`this.$router`进行路由操作。



**路由跳转**

````javascript
this.$router.to({
       url: '', //url
           
       query: {
            // url参数
            id: 1
       }
});
````



**指定跳转函数**

```javascript
this.$router.to({
       url: '', //url
            // url参数
       query: {
            id: 1
       }
},'reLaunch');//默认 navigateTo 跳转
```



**取得当前页面的参数**

````javascript
this.$router.query//=>{id:1}
````





## data操作



 **设置**

````javascript
this.$('id',1);//=> this.setData({a:1})
````



**获取**

````javascript
this.$('form.id')//=> this.data.form.id
````





## 网络请求



````javascript
// http请求
this.$http.post('接口名', {
    user_name: '',
    user_id: '',
}, res => {
    // 请求成功
}, error => {
    // 请求失败
});

````





## 监听器

> 注：目前仅能实现监听框架内对data操作的变化



````javascript
origin({
    data:{},
    watch:{
        isShow(v){
           console.log(v);
        }
    },
    methods{}
})
````





## 完整代码

````JavaScript
const origin = require('./origin/origin');
const Validator = require('./origin/Validator');

origin({
    /**
     * 页面的初始数据
     */
    data: {
        user_id: 1,
        id: 2,
        msg: 'Hello Word',
        userInfo: {
            head: 1,
            info: 2
        },
        form: {
            head: 1,
            info: 2,
            date: ''
        },
        isShow: true,
        flag: ''
    },
    // 监听值变化
    watch: {
        isShow(v) {
            console.warn(v);
        }
    },
    /**
     * 用户登录后的回调，一切的起点。
     */
    mounted() {

        // ======================================================

        // 获取url参数
        let query = this.$router.query; //返回如：{a:1}
        console.warn(query);

        // ======================================================

        // http请求
        this.$http.post('接口名/接口名', {
            user_name: '',
            user_id: '',
            userInfo: {
                head: 1,
                info: 2
            }
        }, res => {
            // 请求成功
        }, error => {
            // 请求失败
        });

        // ======================================================

        // 取data参数

        this.data.msg;//微信
        let msg = this.$('msg');//框架
        let head = this.$('userInfo.head');//框架
        console.warn('msg：', msg);
        console.warn('head：', head);
        console.warn('head：', this.$('userInfo.head'));

        // ======================================================

        // 设置data参数
        // 微信设置变量
        this.setData({
            flag: this.data.flag == 1 ? 0 : 1,
            user_id: 2,
            ['form.info']: 2
        })
        // 框架设置变量
        this.$('flag', this.$('flag') == 1 ? 0 : 1);

        this.$('form.info', 2);

        this.$('id', this.$router.query.id);

        // or
        this.$('flag', 1)
            .$('form.info', 2)
            .$('id', 3);

        // ======================================================

        // 页面跳转
        let url = this.$router.to({
            url: '', //url
            // url参数
            query: {
                id: 1
            }
        });
        console.warn(url);

        // ======================================================
        // 表单验证，下面是两种方式展示
        let map = {
            head: { required: true, error: () => this.$toast('头像不能为空！') },
            info: {
                required: true, error: () => {
                    this.$toast('签名不能为空！')
                }
            },
        };

        new Validator()
            .map(map)//指定一个规则
            .validate(this.$('form'), () => {
                this.$http.post('user/create', this.$('form'), res => {
                    // 成功回调
                }, e => {
                    this.$toast('提交失败！');
                });
            })

    },
    // 所有函数在这写
    methods: {
        test() {
            // 微信设置变量
            this.setData({
                flag: this.data.flag == 1 ? 0 : 1
            })
            // 框架设置变量
            this.$('flag', this.$('flag') == 1 ? 0 : 1)
        },
        onShow() {
            console.warn(this.$router.query);
        },
    },
    // 也可以在这写
    // test() { },
    /**
     * 生命周期函数--监听页面显示
     */
    // onShow() {
    //     console.warn(this.$router.query);
    // },

})

````

## 注意

> 目前本框架仅实现部分功能，有些业务逻辑，比如登录等操作，需要根据实际业务进行代码修改。

