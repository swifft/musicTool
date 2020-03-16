<template>
  <div class="mv-container">
    <div class="mv-wrap">
      <h3 class="title">mv详情</h3>
      <!-- mv -->
      <div class="video-wrap">
        <video controls :src="MvUrl" autoplay></video>
      </div>
      <!-- mv信息 -->
      <div class="info-wrap">
        <div class="singer-info">
          <div class="avatar-wrap">
            <img :src="artistImg" alt="" />
          </div>
          <span class="name">{{MvInfo.artistName}}</span>
        </div>
        <div class="mv-info">
          <h2 class="title">{{MvInfo.name}}</h2>
          <span class="date">发布：{{MvInfo.publishTime}}</span>
          <span class="number">播放：{{MvInfo.playCount}}次</span>
          <p class="desc" v-if="MvInfo.desc">{{MvInfo.desc}}</p>
          <p class="desc" v-else>什么也没留下！</p>
        </div>
      </div>
      <!-- 精彩评论 -->
      <div class="comment-wrap">
        <p class="title" v-if="HotMvComments">精彩评论<span class="number">({{HotMvComments.length}})</span></p>
        <div class="comments-wrap">
          <div class="item" v-for="(item, index) in HotMvComments" :key="index">
            <div class="icon-wrap">
              <img :src="item.user.avatarUrl" alt="" />
            </div>
            <div class="content-wrap">
              <div class="content">
                <span class="name">{{item.user.nickname}}：</span>
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
        <p class="title" v-if="NewMvComments">最新评论<span class="number">({{NewMvComments.length}})</span></p>
        <div class="comments-wrap">
          <div class="item" v-for="(item, index) in NewMvComments" :key="index">
            <div class="icon-wrap">
              <img :src="item.user.avatarUrl" alt="" />
            </div>
            <div class="content-wrap">
              <div class="content">
                <span class="name">{{item.user.nickname}}：</span>
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
      <!-- 分页器 -->
      <el-pagination
        @current-change="handleCurrentChange"
        background
        layout="prev, pager, next"
        :total="total"
        :current-page="page"
        :page-size="5"
        :limit="limit"
      >
      </el-pagination>
    </div>
    <div class="mv-recommend">
      <h3 class="title">相关推荐</h3>
      <div class="mvs">
        <div class="items">
          <div class="item" v-for="(item, index) in MvList" :key="index" @click="getMv(item.id)">
            <div class="img-wrap">
              <img :src="item.cover" alt="" />
              <span class="iconfont icon-play"></span>
              <div class="num-wrap">
                <div class="iconfont icon-play"></div>
                <div class="num">{{item.playCount}}</div>
              </div>
              <span class="time">{{item.duration | changNum()}}</span>
            </div>
            <div class="info-wrap">
              <div class="name">{{item.name}}</div>
              <div class="singer">{{item.artistName}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'mv',
  data() {
    return {
      total: 20,
      page: 1,
      limit: 10,
      MvUrl:'',
      MvList:[],
      MvInfo:[],
      artistImg:[],
      HotMvComments:[],
      NewMvComments:[]
    };
  },
  mounted(){
    this.getMvUrl()
    this.getMvComments()
  },
  methods: {
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.page = val;
      this.$axios.get("http://121.36.94.53:3000/comment/mv?id=" + this.$route.query.id + '&offset=' + (this.page - 1)*20).then(res => {
        this.HotMvComments = res.data.hotComments
        this.NewMvComments = res.data.comments
      });
    },
    getMvUrl(){
      this.$axios.get("http://121.36.94.53:3000/mv/url?id=" + this.$route.query.id).then(res => {
        // console.log(res)
        this.MvUrl = res.data.data.url
      });
      this.$axios.get("http://121.36.94.53:3000/simi/mv?mvid=" + this.$route.query.id).then(res => {
        // console.log(res)
        this.MvList = res.data.mvs
      });
      this.$axios.get("http://121.36.94.53:3000/mv/detail?mvid=" + this.$route.query.id).then(res => {
        // console.log(res)
        this.MvInfo = res.data.data
        this.$axios.get("http://121.36.94.53:3000/artists?id=" + this.MvInfo.artists[0].id).then(res => {
          // console.log(res)
          this.artistImg = res.data.artist.picUrl
        });
      });
    },
    getMvComments(){
      this.$axios.get("http://121.36.94.53:3000/comment/mv?id=" + this.$route.query.id).then(res => {
        // console.log(res)
        this.HotMvComments = res.data.hotComments
        this.NewMvComments = res.data.comments
        this.total = res.data.total
      });
    },
    getMv(id){
      this.$router.push({name:'mv',query:{id:id}})
      location.reload()
    }
  }
};
</script>

<style></style>
