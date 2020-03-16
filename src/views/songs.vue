<template>
  <div class="songs-container">
    <div class="tab-bar" style="margin-bottom: 20px">
      <span class="item" :class="{active:tag == 0}"  @click="tag=0">全部</span>
      <span class="item" :class="{active:tag == 7}"  @click="tag=7">华语</span>
      <span class="item" :class="{active:tag == 96}"  @click="tag=96">欧美</span>
      <span class="item" :class="{active:tag == 8}"  @click="tag=8">日本</span>
      <span class="item" :class="{active:tag == 16}"  @click="tag=16">韩国</span>
    </div>
    <!-- 底部的table -->
    <table class="el-table playlit-table">
      <thead>
        <th></th>
        <th></th>
        <th>音乐标题</th>
        <th>歌手</th>
        <th>专辑</th>
        <th>时长</th>
      </thead>
      <tbody>
        <tr class="el-table__row" v-for="(item, index) in songList" :key="index" @click="getSong(item.id)" style="cursor: pointer">
          <td>{{index + 1}}</td>
          <td>
            <div class="img-wrap">
              <img :src="item.album.picUrl" alt="" />
              <span class="iconfont icon-play"></span>
            </div>
          </td>
          <td>
            <div class="song-wrap">
              <div class="name-wrap">
                <span>{{item.name}}</span>
                <span class="iconfont icon-mv"></span>
              </div>
              <span></span>
            </div>
          </td>
          <td>{{item.artists[0].name}}</td>
          <td>{{item.album.name}}</td>
          <td>{{item.duration | changNum()}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'songs',
  data() {
    return {
      songList:[],
      tag: 0
    };
  },
  watch:{
    tag(){
      this.listData()
    }
  },
  mounted() {
    this.listData()
  },
  methods:{
    listData(){
      this.$axios.get("http://121.36.94.53:3000/top/song?type=" + this.tag).then(res => {
        // console.log(res)
        this.songList = res.data.data
      });
    },
    getSong(id){
      // console.log(id)
      this.$axios.get("http://121.36.94.53:3000/song/url?id=" + id).then(res => {
        // console.log(res)
        const url = res.data.data[0].url;
        this.$parent.musicUrl = url;
        this.$message.success('歌曲正在为您播放')
      });
    }
  }
};
</script>

<style >

</style>
