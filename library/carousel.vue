<template>
  <div class="carousel" ref="carousel">
    <div class="carousel-wrapper">
      <slot></slot>
    </div>
  </div>
</template>
<script>
  import Carousel from './carsouel.js'
  export default {
    data() {
      return {}
    },
    mounted() {
      let el = this.$refs.carousel
      this.carousel = new Carousel({
        lazyload: this.lazyload,
        loop: this.loop,
        autoPlay: this.autoPlay,
        index: this.index,
        delay: this.delay,
        ease: this.ease,
        moveDistance: this.moveDistance,
        el: el
      })
    },
    props: {
      lazyload: {
        type: Boolean,
        default: true
      },
      beforeSlide: {
        type: Function,
        default: function (e) {
          console.log(e)
        }
      },
      onSlide: {
        type: Function,
        default: function (e) {
          console.log(e)
        }
      },
      loop: {
        type: Boolean,
        default: true
      },
      autoPlay: {
        type: Boolean,
        default: true
      },
      index: {
        type: Number,
        default: 0
      },
      delay: {
        type: Number,
        default: 4000
      },
      ease: {
        type: String,
        default: 'linear'
      },
      moveDistance: {
        type: Number,
        default: 50
      }
    }
  }
</script>
<style scoped>
  .carousel {
    position: fixed;
    width: 100%;
    height: 0;
    padding-top: 50%;
  }

  .carousel-wrapper {
    position: absolute;
    background-color: red;
    list-style-type: none;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
</style>
