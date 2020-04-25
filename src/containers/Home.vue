<template>
  <div>
    <ul id="example-1">
      <li v-for="item in list" :key="item.key">
        <span>{{ item.key }}</span>
        <input v-model="val" />
        <button v-on:click="sendMessage(item)">点吧</button>
      </li>
    </ul>
  </div>
</template>
<script>
// import { MSG_IN, MSG_OUT, MSG_CONTENT } from "../../common/type";

export default {
  name: "Home",
  data() {
    return {
      aboutMsg: "我是about组件",
      items: [],
      id: Math.random(),
      list: [],
      socket: null,
      val: ""
    };
  },
  methods: {
    sendMessage: function(data) {
      data.sessionType = 1;
      data.sideId = data.key;
      data.id = this.id;
      data.msg = this.val;
      this.socket.emit("serve", JSON.stringify(data));
    }
  },
  created() {
    // eslint-disable-next-line no-undef
    const socket = io("http://localhost:3000");
    this.socket = socket;
    socket.on("client", data => {
      console.log(JSON.parse(data));
    });
    socket.emit("login", {
      id: this.id,
      // 本次发送的信息内容
      msg: "",
      // 聊天方的id
      sideId: "",
      // 动作类型
      type: 0,
      // 会话类型
      sessionType: "",
      moreId: ""
    });
    socket.on("private", data => {
      console.log(data);
    });

    socket.on("uerlist", data => {
      const obj = JSON.parse(data);
      let list = [];
      try {
        list = Object.keys(obj)
          .map(key => {
            list.push({
              key,
              ...obj[key]
            });
          })
          .filter(item => item.id !== this.id);
      } catch (error) {
        console.log(error);
      }
      this.list = list;
      console.log(JSON.parse(data));
    });
  }
};
</script>