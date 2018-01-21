import Carousel from './carousel.vue'
import CarouselItem from './carousel-item.vue'

export default {
  install (Vue, options) {
    Vue.component('Carousel', Carousel)
    Vue.component('CarouselItem', CarouselItem)
  }
}

export {
  Carousel,
  CarouselItem
}
