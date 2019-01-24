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