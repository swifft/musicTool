<template>
  <div class="playlists-container">
    <!-- 同步 -->
    <div class="top-card" v-if="top">
      <div class="icon-wrap">
        <img :src="top.coverImgUrl" alt="" />
      </div>
      <div class="content-wrap">
        <div class="tag">精品歌单</div>
        <div class="title">{{top.name}}</div>
        <div class="info">{{top.description}}</div>
      </div>
      <img :src="top.coverImgUrl" alt="" class="bg" />
      <div class="bg-mask"></div>
    </div>
    <div class="tab-container">
      <!-- tab栏 顶部 -->
      <div class="tab-bar" >
        <span class="item" :class="{active:selectCat=='全部'}" @click="selectCat='全部'">全部</span>
        <span class="item" v-for="item in catList" :class="{active:selectCat == item.name}" @click="selectCat=item.name">{{item.name}}</span>
      </div>
      <!-- tab的内容区域 -->
      <div class="tab-content">
        <div class="items">
          <div class="item" v-for="(item,index) in playLists" :key="index" @click="getPlayList(item.id)" style="cursor: pointer">
            <div class="img-wrap">
              <div class="num-wrap">
                播放量:
                <span class="num">{{item.playCount}}</span>
              </div>
              <img :src="item.coverImgUrl" alt="" />
              <span class="iconfont icon-play"></span>
            </div>
            <p class="name">{{item.description}}</p>
          </div>
        </div>
      </div>
    </div>
    <!-- 分页器 -->
    <el-pagination @current-change="handleCurrentChange" background layout="prev, pager, next" :total="total" :page-size="10" :current-page="page"></el-pagination>
  </div>
</template>

<script>
export default {
  name: 'recommend',
  data() {
    return {
      total:0,
      page:1,
      catList:'',
      top:[],
      playLists:[],
      selectCat:'全部'
    };
  },
  watch:{
    selectCat(){
      this.topData()
      this.page = 1
      this.listData()
    }
  },
  mounted(){
    this.topData()
    this.catData()
    this.listData()
  },
  methods: {
    catData(){
      this.$axios.get("http://121.36.94.53:3000/playlist/catlist").then(res => {
        this.catList = res.data.sub.slice(0, 18)
      });
    },
    topData(){
      this.$axios.get("http://121.36.94.53:3000/top/playlist/highquality?cat=" + this.selectCat).then(res => {
        this.top = res.data.playlists[1];
      });
    },
    listData(){
      this.$axios.get("http://121.36.94.53:3000/top/playlist?limit=10&cat=" + this.selectCat + '&offset=' + (this.page - 1)*10).then(res => {
        // console.log(res)
        this.total = res.data.total;
        this.playLists = res.data.playlists;
      });
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.page = val;
      this.listData();
    },
    getPlayList(id){
      this.$router.push({name:'playlist',query:{id:id}})
    }
  }
};
</script>

<style >

</style>
