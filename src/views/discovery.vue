<template>
    <div class="discovery-container">
        <!-- 轮播图 -->
        <el-carousel class :interval="2000" type="card">
            <el-carousel-item v-for="item in banners" :key="item.id">
                <img :src="item.imageUrl" alt/>
            </el-carousel-item>
        </el-carousel>
        <!-- 推荐歌单 -->
        <div class="recommend">
            <h3 class="title">推荐歌单</h3>
            <div class="items">
                <div class="item" v-for="item in list" :key="item.id" @click="getPlayList(item.id)" style="cursor: pointer">
                    <div class="img-wrap">
                        <div class="desc-wrap">
                            <span class="desc">{{item.description}}</span>
                        </div>
                        <img :src="item.coverImgUrl" alt/>
                        <span class="iconfont icon-play"></span>
                    </div>
                    <p class="name">{{item.name}}</p>
                </div>
            </div>
        </div>
        <!-- 最新音乐 -->
        <div class="news">
            <h3 class="title">最新音乐</h3>
            <div class="items">
                <div class="item" v-for="item in newSongs" :key="item.id" @click="getMusic(item.id)" style="cursor: pointer">
                    <div class="img-wrap">
                        <img :src="item.album.picUrl" alt/>
                        <span class="iconfont icon-play"></span>
                    </div>
                    <div class="song-wrap">
                        <div class="song-name">{{item.name}}</div>
                        <div class="singer">{{item.artists[0].name}}</div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 推荐MV -->
        <div class="mvs">
            <h3 class="title">推荐MV</h3>
            <div class="items">
                <div class="item" v-for="item in mv" :key="item.id" @click="getMv(item.id)">
                    <div class="img-wrap">
                        <img :src="item.cover" alt/>
                        <span class="iconfont icon-play"></span>
                        <div class="num-wrap">
                            <div class="iconfont icon-play"></div>
                            <div class="num">{{item.playCount | changeCount()}}</div>
                        </div>
                    </div>
                    <div class="info-wrap">
                        <div class="name">{{item.name}}</div>
                        <div class="singer">{{item.artistName}}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "discovery",
        data() {
            return {
                banners: [],
                list: [],
                newSongs: [],
                mv: []
            };
        },
        mounted() {
            this.$axios.get("http://121.36.94.53:3000/banner").then(res => {
                this.banners = res.data.banners;
                // console.log(this.banners);
            });
            this.$axios.get("http://121.36.94.53:3000/top/playlist?limit=10").then(res => {
                this.list = res.data.playlists;
                // console.log(res)
            });
            this.$axios.get("http://121.36.94.53:3000/top/song?type=0").then(res => {
                // console.log(res.data.data.slice(0,10))
                this.newSongs = res.data.data.slice(0, 10);
            });
            this.$axios.get("http://121.36.94.53:3000/mv/first?limit=4").then(res => {
                // console.log(res)
                this.mv = res.data.data;
            });
        },
        methods: {
            getMusic(id) {
              this.$axios.get("http://121.36.94.53:3000/song/url?id=" + id).then(res => {
                // console.log(res)
                const url = res.data.data[0].url;
                this.$parent.musicUrl = url;
                this.$message.success('歌曲正在为您播放')
              });
            },
            getPlayList(id){
                this.$router.push({name:'playlist',query:{id:id}})
            },
            getMv(id){
                this.$router.push({name:'mv',query:{id:id}})
                location.reload()
            }
        }
    };
</script>

<style>
</style>
