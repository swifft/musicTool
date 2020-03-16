<template>
  <div class="playlist-container">
    <div class="top-wrap">
      <div class="img-wrap">
        <img :src="playList.coverImgUrl" alt="" />
      </div>
      <div class="info-wrap">
        <p class="title">{{playList.name}}</p>
        <div class="author-wrap" v-if="playList.creator">
          <img class="avatar" :src="playList.creator.avatarUrl" alt="" />
          <span class="name">{{playList.creator.nickname}}</span>
          <span class="time">{{playList.createTime | changeTime()}} 创建</span>
        </div>
        <div class="play-wrap">
          <span class="iconfont icon-circle-play"></span>
          <span class="text" @click="playAll" style="cursor: pointer">播放全部</span>
        </div>
        <div class="tag-wrap">
          <span class="title">标签:</span>
          <ul>
            <li v-for="(item, index) in playList.tags" :key="index">{{item}}</li>
          </ul>
        </div>
        <div class="desc-wrap">
          <span class="title">简介:</span>
          <span class="desc">{{playList.description}}</span>
        </div>
      </div>
    </div>
    <el-tabs v-model="activeIndex">
      <el-tab-pane label="歌曲列表" name="1">
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
            <tr class="el-table__row" v-for="(item, index) in playList.tracks" :key="index" @click="getSong(item.id)" style="cursor: pointer">
              <td>{{index + 1}}</td>
              <td>
                <div class="img-wrap">
                  <img :src="item.al.picUrl" alt="" />
                  <span class="iconfont icon-play" @click="getSong(item.id)"></span>
                </div>
              </td>
              <td>
                <div class="song-wrap">
                  <div class="name-wrap">
                    <span>{{item.al.name}}</span>
                    <span v-if="item.mv != 0" class="iconfont icon-mv"></span>
                  </div>
                  <span v-if="item.alia[0]">item.alia[0]</span>
                </div>
              </td>
              <td>{{item.ar[0].name}}</td>
              <td>{{playList.name}}</td>
              <td>{{item.dt | changNum()}}</td>
            </tr>
          </tbody>
        </table>
      </el-tab-pane>
      <el-tab-pane label="评论(66)" name="2">
        <!-- 精彩评论 -->
        <div class="comment-wrap">
          <p class="title">精彩评论<span class="number">({{hotCommentsCount}})</span></p>
          <div class="comments-wrap">
            <div class="item" v-for="(item, index) in hotComments" :key="index" >
              <div class="icon-wrap">
                <img :src="item.user.avatarUrl" alt="" />
              </div>
              <div class="content-wrap">
                <div class="content">
                  <span class="name">{{item.user.nickname}}:</span>
                  <span class="comment">{{item.content}}</span>
                </div>
                <div class="re-content" v-if="item.beReplied.length != 0" v-for="(re,index) in item.beReplied" :key="index">
                  <span class="name">{{re.user.nickname}}：</span>
                  <span class="comment">{{re.content}}</span>
                </div>
                <div class="date">{{item.time | changeTime()}}</div>
              </div>
            </div>
          </div>
        </div>
        <!-- 最新评论 -->
        <div class="comment-wrap">
          <p class="title">最新评论<span class="number">({{newCommentsCount}})</span></p>
          <div class="comments-wrap">
            <div class="item" v-for="(item, index) in newComments" :key="index" >
              <div class="icon-wrap">
                <img :src="item.user.avatarUrl" alt="" />
              </div>
              <div class="content-wrap">
                <div class="content">
                  <span class="name">{{item.user.nickname}}:</span>
                  <span class="comment">{{item.content}}</span>
                </div>
                <div class="re-content" v-if="item.beReplied.length != 0" v-for="(re,index) in item.beReplied" :key="index">
                  <span class="name">{{re.user.nickname}}：</span>
                  <span class="comment">{{re.content}}</span>
                </div>
                <div class="date">2020-02-12 17:26:11</div>
              </div>
            </div>
          </div>
        </div>
        <!-- 分页器 -->
        <el-pagination
          @current-change="handleCurrentChange"
          background
          layout="prev, pager, next"
          :total="total"
          :current-page="page"
          :page-size="5"
        >
        </el-pagination>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'playlist',
  data() {
    return {
      activeIndex: '1',
      total: 0,
      page: 1,
      playList:[],
      newComments:[],
      newCommentsCount:0,
      hotComments:[],
      hotCommentsCount:0,
      num:0
    };
  },
  mounted(){
    this.listData()
  },
  watch:{
    activeIndex(){
      switch (this.activeIndex) {
        case "1":
          this.listData();
          break;
        case "2":
          this.getCommit()
          break;
        default:
          break;
      }
    }
  },
  methods: {
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.page = val;
      this.$axios.get("http://121.36.94.53:3000/comment/playlist?id=" + this.$route.query.id + '&offset=' + (this.page - 1)*20).then(res => {
        // console.log(res)
        this.newComments = res.data.comments
      });
    },
    listData(){
      this.$axios.get("http://121.36.94.53:3000/playlist/detail?id=" + this.$route.query.id).then(res => {
        // console.log(res)
        this.playList = res.data.playlist;
      });
    },
    getSong(id){
      this.$axios.get("http://121.36.94.53:3000/song/url?id=" + id).then(res => {
        // console.log(res)
        const url = res.data.data[0].url;
        this.$parent.musicUrl = url;
      });
    },
    getCommit(){
      this.$axios.get("http://121.36.94.53:3000/comment/playlist?id=" + this.$route.query.id).then(res => {
        // console.log(res)
        this.newComments = res.data.comments
        this.newCommentsCount = res.data.total
        this.total = res.data.total
      });
      this.$axios.get('http://121.36.94.53:3000/comment/hot?id=' + this.$route.query.id + '&type=2').then(res => {
        // console.log(res)
        this.hotComments = res.data.hotComments
        this.hotCommentsCount = res.data.total
      });
    },
    playAll(){
      const id = this.playList.tracks[this.num].id
      this.num = this.num + 1;
      this.$axios.get("http://121.36.94.53:3000/song/url?id=" + id).then(res => {
        // console.log(res)
        const url = res.data.data[0].url;
        this.$parent.musicUrl = url;
      })
    }
  }
};
</script>

<style >

</style>
