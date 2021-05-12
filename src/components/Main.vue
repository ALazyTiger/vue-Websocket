<template>
  <div class="main">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>
<script>
export default {
  data() {
    return {
      websock: null,
      lockReconnect: false,//是否真正建立连接
      timeout: 28*1000,//30秒一次心跳
      timeoutObj: null,//心跳心跳倒计时
      serverTimeoutObj: null,//心跳倒计时
      timeoutnum: null,//断开 重连倒计时
    };
  },
  created() {
    this.initWebSocket();//页面刚进入时开启长连接
  },
  destroyed: function() {
    this.websocketclose();//页面销毁时关闭长连接
     eventBus.$off("sendMsg")//页面销毁时销毁bus监听
  },
  mounted () {
    eventBus.$on("sendMsg", msg => { //bus 监听发送消息
    console.log(msg)
      this.websocketsend(msg);
    });
  },
  methods: {
    initWebSocket() {//初始化weosocket
      let wsuri  = "ws://echo.websocket.org/";
      this.websock = new WebSocket(wsuri);
      this.websock.onopen = this.websocketonopen;
      this.websock.onerror = this.websocketonerror;
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onclose = this.websocketclose;
    },
    websocketonopen() {
      console.log("WebSocket连接成功");
      this.start();//开启心跳
    },
    websocketonerror(e) {  //错误
      console.log("WebSocket连接发生错误");
      this.reconnect(); //重连websocket
    },
    websocketonmessage(e) { //数据接收
      const redata = e.data; 
      this.reset();//收到服务器信息，心跳重置
      console.log(e);
      if(redata == "heartCheck") return false;
      eventBus.$emit("websocketData", redata); //bus 传递接收到的消息
    },

    websocketsend(agentData) {//数据发送
      this.websock.send(agentData);
    },
    websocketclose(e) {//关闭websocket
      console.log("connection closed (" + e.code + ")");
    },
    reconnect() {//重新连接
      if(this.lockReconnect) return false;
      this.lockReconnect = true;//没连接上会一直重连，设置延迟避免请求过多
      this.timeoutnum && clearTimeout(that.timeoutnum);
      this.timeoutnum =  setTimeout(()=> {//新连接
        this.initWebSocket();
        this.lockReconnect = false;
      },5000);
    },
    reset(){//重置心跳 
    console.log("重置心跳")
      clearTimeout(this.timeoutObj);//清除时间
      clearTimeout(this.serverTimeoutObj);
      this.start();//重启心跳
    },
    start(){//开启心跳
      this.timeoutObj && clearTimeout(this.timeoutObj);
      this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj);
      this.timeoutObj = setTimeout(()=> {//这里发送一个心跳，后端收到后，返回一个心跳消息                
        if(this.websock.readyState == 1) {//如果连接正常
          this.websock.send("heartCheck");
        }else{//否则重连
          this.reconnect();
        }
        this.serverTimeoutObj = setTimeout(function() {//超时关闭
          this.websock.close();
        }, this.timeout);

      }, this.timeout)
    },
  }
};
</script>
