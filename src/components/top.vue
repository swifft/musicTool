<template>
  <div class="top-container">
    <div class="left-box">
      <div class="icon-wrapper">
        <span class="iconfont icon-home"></span>
        <span class="iconfont icon-sami-select"></span>
        <span class="iconfont icon-full-screen"></span>
      </div>
      <div class="history-wrapper">
        <span class="iconfont icon-arrow-lift" @click="back"></span>
        <span class="iconfont icon-arrow-right" @click="forward"></span>
      </div>
    </div>
    <div class="right-box">
      <div class="el-input el-input--small el-input--prefix">
        <input type="text" autocomplete="off" placeholder="搜索" class="el-input__inner" v-model="searchInfo" @keyup.enter="search"/>
        <span class="el-input__prefix">
          <i class="el-input__icon el-icon-search"></i>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'top',
    data() {
      return {
        searchInfo:''
      }
    },
    methods:{
      search(){
        if (this.searchInfo == ''){
          this.$message.warning('请输入内容')
        }else {
          this.$router.push({name:'result',query:{q:this.searchInfo}})
        }
      },
      back(){
        if (window.history.length <= 1) {
          this.$router.push({path:'/'})
          return false
        } else {
          this.$router.go(-1)
        }
      },
      forward(){
          this.$router.go(+1)

      }
    }
  }
</script>

<style scoped></style>
