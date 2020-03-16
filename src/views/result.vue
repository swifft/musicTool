<template>
  <div class="result-container">
    <div class="title-wrap">
      <h2 class="title">{{$route.query.q}}</h2>
      <span class="sub-title">找到 <span style="color: #c3473a">{{searchSongs.songCount}}</span> 个结果</span>
    </div>
    <el-tabs v-model="activeIndex">
      <el-tab-pane label="歌曲" name="songs">
        <table class="el-table">
          <thead>
            <th></th>
            <th>音乐标题</th>
            <th>歌手</th>
            <th>专辑</th>
            <th>时长</th>
          </thead>
          <tbody>
            <tr class="el-table__row" v-for="(item, index) in searchSongs.songs" :key="index" @click="getSong(item.id)" style="cursor: pointer">
              <td>{{index + 1}}</td>
              <td>
                <div class="song-wrap">
                  <div class="name-wrap">
                    <span>{{item.name}}</span>
                    <span class="iconfont icon-mv" v-if="item.mvid != 0"></span>
                  </div>
                  <span v-if="item.alias">{{item.alias[0]}}</span>
                </div>
              </td>
              <td>{{item.artists[0].name}}</td>
              <td>{{item.album.name}}</td>
              <td>{{item.duration | changNum()}}</td>
            </tr>
          </tbody>
        </table>
      </el-tab-pane>
      <el-tab-pane label="歌单" name="lists">
        <div class="items">
          <div class="item" v-for="(item, index) in searchLists.playlists" :key="index" @click="getPlayList(item.id)">
            <div class="img-wrap">
              <div class="num-wrap">
                播放量:
                <span class="num">{{item.playCount | changeCount()}}</span>
              </div>
              <img :src="item.coverImgUrl" alt="" />
              <span class="iconfont icon-play"></span>
            </div>
            <p class="name">{{item.description}}</p>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="MV" name="mv">
        <div class="items mv">
          <div class="item" v-for="(item, index) in searchMvs.mvs" :key="index" @click="getMv(item.id)">
            <div class="img-wrap">
              <img :src="item.cover" alt="" />
              <span class="iconfont icon-play"></span>
              <div class="num-wrap">
                <div class="iconfont icon-play"></div>
                <div class="num">{{item.playCount | changeCount()}}</div>
              </div>
              <span class="time">{{item.duration | changNum()}}</span>
            </div>
            <div class="info-wrap">
              <div class="name">{{item.name}}</div>
              <div class="singer">{{item.artistName}}</div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'result',
  data() {
    return {
      activeIndex: 'songs',
      limit:10,
      type:1,
      searchSongs:[],
      searchLists:[],
      searchMvs:[],
      count:''
    };
  },
  mounted() {
    this.getSearch();
  },
  watch:{
    activeIndex(){
      let type = 1;
      let limit = 10;
      switch (this.activeIndex) {
        case "songs":
          type = 1;
          limit = 10;
          break;
        case "lists":
          type = 1000;
          limit = 10;
          break;
        case "mv":
          type = 1004;
          limit = 8;
          break;
        default:
          break;
      }
      this.$axios({
        url: "http://121.36.94.53:3000/search",
        method: "get",
        params: {
          keywords:this.$route.query.q,
          type:type,
          limit:limit
        }
      }).then(res => {
        // console.log(res)
        if (type == 1){
          this.searchSongs = res.data.result;
          this.count = res.data.result.songCount;
        }else if (type == 1000){
          this.searchLists = res.data.result;
          this.count = res.data.result.playlistCount;
        }else if (type == 1004){
          // console.log(res)
          this.searchMvs = res.data.result;
          this.count = res.data.result.mvCount;
        }
      });
    }
  },
  methods:{
    getSearch(){
      this.$axios.get("http://121.36.94.53:3000/search?keywords=" + this.$route.query.q + '&type=' + this.type + '&limit=' + this.limit).then(res => {
        // console.log(res)
          this.searchSongs = res.data.result;
      });
    },
    getSong(id){
      this.$axios.get("http://121.36.94.53:3000/song/url?id=" + id).then(res => {
        // console.log(res)
        const url = res.data.data[0].url;
        this.$parent.musicUrl = url;
      });
    },
    getPlayList(id){
      this.$router.push({name:'playlist',query:{id:id}})
    },
    getMv(id){
      this.$router.push({name:'mv',query:{id:id}})
    }
  }
};
</script>

<style >

</style>
