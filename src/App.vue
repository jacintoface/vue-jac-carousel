<template>
  <div id="app">
    <carousel>
      <carousel-item>
        <img src="http://d10.yihaodianimg.com/V00/M03/4D/41/CgQDsVQG4d6AISZPAAFa7N3KyPY18100.jpg" style="width: 100%;height: 100%">
      </carousel-item>
      <carousel-item>
        <img src="http://d10.yihaodianimg.com/N07/M09/26/8B/CgQI0FQFd8-ACrb7AADBtSan3a084000.jpg" alt="" style="width: 100%;height: 100%">
      </carousel-item>
      <carousel-item>
        <img src="http://d10.yihaodianimg.com/V00/M04/32/59/CgQDsVQDEtaAVv4BAAEFc6n3fws75000.jpg" alt="" style="width: 100%;height: 100%">
      </carousel-item>
      <carousel-item>
        <img src="http://d11.yihaodianimg.com/N05/M04/82/EC/CgQI01QEHoiAFBbgAAC9du5zOPc62900.jpg" alt="" style="width: 100%;height: 100%">
      </carousel-item>
      <carousel-item>
        <img src="http://d10.yihaodianimg.com/N07/M09/26/8B/CgQI0FQFd8-ACrb7AADBtSan3a084000.jpg" alt="" style="width: 100%;height: 100%">
      </carousel-item>
    </carousel>
  </div>
</template>

<script>
  import {Carousel, CarouselItem} from '../dist/vue-jac-carousel'
export default {
  name: 'App',
  components: {
    components: {
      Carousel,
      CarouselItem
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
