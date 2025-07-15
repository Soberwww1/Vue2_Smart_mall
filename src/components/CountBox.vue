<template>
  <div class="count-box">
    <button @click="handlenum(-1)">-</button>
    <input class="quantity" :value="value" @change="handlechange">
    <button @click="handlenum(1)">+</button>
  </div>
</template>

<script>
import { Toast } from 'vant'
export default {
  name: 'CountBox',
  props: {
    value: {
      type: Number,
      default: 1
    }
  },
  methods: {
    handlenum (num) {
      let tempcount = this.value
      tempcount += num
      if (tempcount <= 1) {
        tempcount = 1
      }
      // console.log(tempcount)
      this.$emit('input', tempcount)
    },
    handlechange (e) { // 当你的函数不给形参时，默认你的第一个形参就是事件对象
      // 当输入不合法值，都会恢复上个值，并提示
      if (!e.target.value.trim() || !(/^[0-9]+$/.test(e.target.value)) || Number(e.target.value) < 1) {
        e.target.value = this.value
        Toast('输入不合法，请重新输入')
        return
      }
      // 这里有点小坑，传过去的要是Number类型，而输入框输入的是字符串类型
      this.$emit('input', Number(e.target.value))
    }
  }

}
</script>

<style lang="less" scoped>
.count-box{
    padding: 0;
    border: 0;
    margin: 0;
    button,input{
        border: 0;
        padding: 2px 5px;
        background-color: rgb(242, 243, 245);
    }
    button{
        width: 30px;
    }
    .quantity{
        text-align: center;
        display: inline-block;
        width: 50px;
        margin: 0 2px;
    }
}

</style>
