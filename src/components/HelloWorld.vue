<template>
  <div class="hello">
    <h1 class="title">{{ title }}</h1>
    <div class="message-box">
      <div class="message" v-for="(item,index) in ChatMessageData" :key="index">
        <span class="msg-cont" >{{ item }}</span>
      </div>
    </div>
    <div class="send-box">
      <el-input placeholder="请输入内容" v-model="message" class="input-with-select">
        <el-button slot="append" type="primary" icon="el-icon-edit" @click="send"></el-button>
      </el-input>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      title: 'WebSocket Room',
      message:"",
      ChatMessageData:[]
    }
  },
  components: {
  },
  created () {},
  methods: {
    send: function () { // 发送聊天
      eventBus.$emit('sendMsg', this.message)
      this.message = '';
    }
  },
  mounted () {    
    eventBus.$on('websocketData', (redata) => {  //父路由传递过来的
      console.log("bus传递过来的",redata)
      this.ChatMessageData = this.ChatMessageData.concat(redata);
    }) 
  },
   destroyed: function() {
    eventBus.$off("websocketData")//页面销毁时销毁bus监听
  },
}
</script>

<style scoped lang="scss">
  .hello{
    height: 100%;
    position: relative;
    overflow: hidden;
    .title{
      padding: 0;
      margin: 0;
      height: 60px;
      line-height: 60px;
    }
    .message-box{
      width: 100%;
      height: calc( 100vh - 100px);
      overflow-y:auto;
    }
    .send-box{
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 40px;
    }
  }
  
</style>
