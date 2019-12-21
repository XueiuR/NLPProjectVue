<template>
    <div class="login-wrap"
         v-loading="loading"
         element-loading-text="为您拼命识别中"
         element-loading-spinner="el-icon-loading"
         element-loading-background="rgba(0, 0, 0, 0.8)">
        <div class="title">NLP Project——恶意样本分析平台</div>
        <!--上传组件-->
        <div class="upload" v-if="isShow">
            <el-tabs v-model="tabsActiveName">
                <!--用户以文本形式上传API序列-->
                <el-tab-pane label="提交API序列文本" name="text">
                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px">
                        <el-form-item prop="api">
                            <el-input v-model="ruleForm.api" :autosize="{ minRows: 12, maxRows:13}"
                                      placeholder="请在此输入API序列" type="textarea" resize="none">
                            </el-input>
                        </el-form-item>
                        <div class="submitTextButton">
                            <el-button type="primary" @click="submitTextUpload('ruleForm')">
                                提交检测
                            </el-button>
                        </div>
                    </el-form>
                </el-tab-pane>
                <!--用户以txt文件形式上传API序列-->
                <el-tab-pane label="提交API序列文件" name="file">
                    <el-upload ref="upload" class="uploadFile"
                               :file-list="fileList" accept=".txt" drag
                               :limit="1" :on-exceed="handleExceed"
                               :on-change="handleChange" :on-remove="handleRemove"
                               :auto-upload="false">
                        <el-button slot="trigger" type="primary">选取文件</el-button>
                        <el-button type="primary" @click="submitFileUpload"
                                   class="uploadFileButton">提交检测</el-button>
                        <div slot="tip" class="el-upload__tip">每次检测只能上传一个txt文件，支持拖拽</div>
                    </el-upload>
                </el-tab-pane>
            </el-tabs>
        </div>

        <!--显示组件-->
        <div class="result" v-if="!isShow">
            <div class="resultSchartBox">
                <div class="backToUpload">
                    <el-button type="primary" @click="backToUpload">返回</el-button>
                </div>
                <div class="resultFont1">下图为根据API序列生成的可能文件类型概率图，根据图片可以看出，该文件最可能属于:
                    <div class="resultFont2">
<!--                        {{newSchartData[7].name}}-->
                        test
                    </div>
                </div>
                <schart class="resultSchart" canvasId="pie" :data="schartData"
                        type="pie" :options="schartOption"></schart>
            </div>
        </div>
    </div>
</template>

<script>
    import schart from 'vue-schart'
    export default {
        components:{
            schart,
        },
        data: function(){
            return {
                tabsActiveName: 'text', //默认展示标签页
                url: '', //后端api名称
                ruleForm: {
                    api: ''
                },
                isShow: 'true',
                fileList: [],
                fileContent: '',
                rules: {
                    api: [
                        { required: true, message: '请输入提交的API序列', trigger: 'blur' }
                    ]
                },
                schartData: [
                    {name:'0-正常文件',value:10},
                    {name:'1-勒索病毒',value:10},
                    {name:'2-挖矿程序',value:10},
                    {name:'3-DDoS木马',value:80},
                    {name:'4-蠕虫病毒',value:10},
                    {name:'5-感染型病毒',value:10},
                    {name:'6-后门程序',value:10},
                    {name:'7-木马程序',value:30},
                ],
                newSchartData: [],
                schartOption: {
                    type:'pie',
                    bgColor: '#ffffff',
                    titleColor: '#000000',
                    legendColor: '#000000',
                    radius: 120
                },
                loading: false
            }
        },
        methods: {
            submitTextUpload(formName) {
                var _this = this;
                _this.$refs[formName].validate((valid) => {
                    if (valid) {
                        _this.loading = true;
                        _this.url = process.env.API_HOST+'/getResult/'; //需要修改
                        _this.$axios.post(_this.url, {
                            api: _this.ruleForm.api,
                        }).then(
                            (res) => {
                                if (res.code == 200){
                                    setTimeout(function () {
                                        _this.loading = false;
                                    }, 500);

                                    console.log("success submit");

                                    //对接收到的json进行处理
                                    var resultJSON = res.data;
                                    _this.schartData = resultJSON;
                                    _this.schartData.forEach((x) => {
                                        _this.newSchartData.push(x);
                                    });
                                    _this.newSchartData.sort(this.sortBy("value"));

                                    _this.isShow = false;
                                }
                            },
                            (res) => {
                                if(res.code == 500){
                                    setTimeout(function () {
                                        _this.loading = false;
                                        _this.$alert('出现错误，请重新尝试', '', {
                                            confirmButtonText: '确定',
                                        });
                                    }, 500);
                                }
                            }
                        );
                        // if (process.env.NODE_ENV === 'development') {
                        //     this.url = process.env.API_HOST+'/auth/'; //需要修改
                        //     this.$axios.post(this.url, {
                        //         api: this.ruleForm.api,
                        //     }).then((res) => {
                        //         console.log("success submit");
                        //         this.isShow = false;
                        //     })
                        // } else{ //build
                        //     console.log("This is build version")
                        //         this.url = '/auth/';
                        //         this.$axios.post(this.url, {
                        //             api: this.ruleForm.api,
                        //         }).then((res) => {
                        //             if (this.loginres){
                        //             } else{
                        //                 this.$router.push('/login')
                        //             }
                        //         })
                        // }
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            submitFileUpload() {
                var _this = this;
                console.log("提交的txt文本内容为："+_this.fileContent);
                if(_this.fileContent != ''){
                    _this.loading = true;
                    _this.url = process.env.API_HOST+'/getResult/';
                    _this.$axios.post(_this.url, {api: _this.fileContent,}).then(
                        (res) => {
                            if (res.code == 200){
                                console.log("success submit");

                                //对接收到的json进行处理
                                var resultJSON = res.data;
                                _this.schartData = resultJSON;
                                _this.schartData.forEach((x) => {
                                    _this.newSchartData.push(x);
                                });
                                _this.newSchartData.sort(_this.sortBy("value"));

                                _this.isShow = false;
                            }
                        },
                        (res) => {
                            if (res.code == 500){
                                setTimeout(function () {
                                    _this.loading = false;
                                    _this.$alert('出现错误，请重新尝试', '', {
                                        confirmButtonText: '确定',
                                    });
                                }, 500);
                            }
                        });
                }
                // if (process.env.NODE_ENV === 'development') {
                //     this.url = process.env.API_HOST+'/auth/'; //需要修改
                //     this.$axios.post(this.url, {
                //         api: this.ruleForm.api,
                //     }).then((res) => {
                //         console.log("success submit");
                //     })
                // } else{ //build
                //     console.log("This is build version")
                //     this.url = '/auth/';
                //     this.$axios.post(this.url, {
                //         api: this.ruleForm.api,
                //     }).then((res) => {
                //         if (this.loginres){
                //         } else{
                //             this.$router.push('/login')
                //         }
                //     })
                else {
                    _this.$alert('请提交一份txt文件，或txt文件内容不能为空', '', {
                        confirmButtonText: '确定',
                    });
                    return false;
                }
            },
            handleChange(file,fileList){
                var _this = this
                _this.fileList.push(file);
                var list = [];
                list.push(fileList[0].raw);
                var reader = new FileReader();
                var blob = new Blob(list);
                reader.readAsText(blob, "UTF-8"); //读取文件
                reader.onload = function(evt) {
                    _this.fileContent = evt.target.result; // 读取文件内容
                    console.log("content:"+_this.fileContent);
                }
            },
            handleExceed(files, fileList) {
                this.$alert('每次仅可上传一份文件', '', {
                    confirmButtonText: '确定',
                });
            },
            handleRemove(file, fileList){
                var _this = this;
                _this.fileList = [];
                _this.fileContent = '';
            },
            sortBy(field) {
                return (x, y) => {
                    return x[field] - y[field];
                }
            },
            backToUpload(){
                var _this = this;
                _this.ruleForm.api = '';
                _this.fileList = [];
                _this.fileContent = '';
                _this.schartData = [];
                _this.newSchartData = [];
                _this.isShow = true;
            }
        }
    }
</script>

<style scoped>
    .login-wrap{
        position: relative;
        width: 100%;
        height: 100%;
    }
    .title{
        position: absolute;
        top: 50%;
        width: 100%;
        margin-top: -290px;
        text-align: center;
        font-size: 30px;
        color: #fff;
    }
    .upload{
        position: absolute;
        left: 30%;
        top: 50%;
        width: 870px;
        height: 340px;
        margin: -170px 0 0 -190px;
        padding: 40px;
        border-radius: 5px;
        background: #fff;
    }
    .submitTextButton{
        text-align: center;
        float: right
    }
    .submitTextButton button{
        width: 100%;
        height: 36px;
    }
    .uploadFile{
        margin-top: 10px;
        margin-left: 20px
    }
    .uploadFileButton{
        float: right;
        margin-top: 250px
    }

    .result{
        position: absolute;
        left: 30%;
        top: 50%;
        width: 870px;
        height: 340px;
        margin: -200px 0 0 -190px;
        padding: 40px;
        border-radius: 5px;
        background: #fff;
    }
    .resultSchartBox{
        display: inline-block;
        margin: 20px;
    }
    .resultFont1{
        margin-top: -30px;
        margin-left: 15px;
    }
    .resultFont2{
        height: 90%;
        width: 100%;
        color: #ff4d51;
        text-align: center;
        margin-top: 5px;
        margin-left: -20px;
        font-size: 20px;
    }
    .resultSchart{
        width: 800px;
        height: 300px;
        margin-top: 30px;
        margin-left: 60px;
    }
    .backToUpload{
        float: right;
        margin-top: -20px;
        margin-right: -10px;
        padding-top: -40px;
    }

</style>