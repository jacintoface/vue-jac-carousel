<template>
  <div class="carousel-item">
    <slot></slot>
  </div>
</template>
<script>
  export default {

  }
</script>
<style scoped>
  .carousel-item {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
</style>
