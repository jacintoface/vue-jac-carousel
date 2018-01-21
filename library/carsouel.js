var Slider = function () {
  function Slider(params) {
    if (!params.el) {
      throw new Error('you must specify a el params')
    }
    if (params.el.tagName && params.el.nodeType) {
      this.el = params.el
    } else {
      this.el = document.querySelector(params.el)
    }
    this._init(params)
  }

  Slider.prototype._init = function (params) {
    this.options = Object.assign({}, {
      $ul: this.el.children[0],             //轮播图父组件
      $li: this.el.children[0].children,    //轮播项父组件
      lazyload: true,                       //懒加载
      beforeSlide: function () {},          //轮播之前触发的回调函数
      onSlide: function () {},              //每次轮播后执行的回调函数
      loop: true,                           //循环播放
      autoPlay: true,                       //自动轮播
      index: 0,                             //初始显示项
      delay: 4000,                          //轮播间隔
      ease: 'linear',                       //轮播动画
      moveDistance: 50
    }, params)

    //记录轮播图图片个数
    this.$length = this.options.$li.length

    //记录屏幕宽度
    this.$width = this.options.$ul.getBoundingClientRect().width

    this.transition = fnGetPrefix('transition')

    this.transform = fnGetPrefix('transform')

    // 当前显示的是第几张轮播图
    this.index = this.options.index

    var that = this

    that.isScrolling = false

    //调用轮播图开始之前的回调函数
    that.options.beforeSlide(that.options.$li[that.index], that.index)

    //如果只有一张图片，则不开启轮播
    if (that.$length <= 1) {
      if (that.options.lazyload) fnLazyload(that, that.index)
      return
    }

    //如果循环轮播，则克隆首尾节点
    if (that.options.loop) {
      fnCloneDom(that.options.$li)
    }

    /*
		 * 懒加载图片
		 * 需要注意 对于不循环轮播的情况 index 就是对应html中的图片index
		 * 对于要循环轮播的情况，因为拷贝了节点，实际index为html中的图片index + 1
		 * */
    if (that.options.lazyload) {
      fnLazyload(that, that.index)
      if (that.options.loop) {
        /*
				 *
				 * 对于loop，index + 1 才是对应的当前正在显示的html中的图片
				 *
				 * */
        fnLazyload(that, that.index + 1)
        fnLazyload(that, that.index + 2)
        if (that.index === that.$length - 1) {
          fnLazyload(that, 0)
          fnLazyload(that, 1)
        } else if (that.index === 0) {
          fnLazyload(that, that.$length)
          fnLazyload(that, that.$length + 1)
        }
      } else {
        if (that.index === 0) {
          fnLazyload(that, that.index + 1)
        } else if (that.index === that.$length - 1) {
          fnLazyload(that, that.index - 1)
        } else {
          fnLazyload(that, that.index + 1)
          fnLazyload(that, that.index - 1)
        }
      }
    }

    /*
		 *
		 * 初始化节点位置
		 *
		 * */
    fnInitPosition(that, that.index)

    /*
		*
		* 自动轮播
		*
		* */
    fnAutoPlay(that, that.index)


    /*
		* 屏幕触摸事件处理
		* */
    fnHandleTouch(that, that.index)
  }


  Slider.prototype.go = function (type, time) {
    fnPlay(this, type, time)
  }

  /*
	 *
	 * 设置懒加载图片, 如果需要加载图片，则
	 *
	 * */
  function fnLazyload(el, index) {
    var li = el.options.$li[index]
    var target = li && li.querySelectorAll('[data-src]')
    if (target) {
      for (var i = 0, length = target.length; i < length; i++) {
        var ret = target[i]
        var srcAttr = ret.dataset.src
        if (ret.tagName.toUpperCase() === 'IMG') {
          ret.setAttribute('src', srcAttr)
        } else {
          ret.style.backgroundImage = srcAttr
        }
        ret.removeAttribute('data-src')
      }
    }
  }

  /*
	 *
	 * 向li节点收尾添加节点，帮助循环轮播
	 *
	 * */
  function fnCloneDom(list) {
    var firstNode = list[0].cloneNode(true)
    var lastNode = list[list.length - 1].cloneNode(true)
    var parentNode = list[0].parentNode
    parentNode.insertBefore(lastNode, list[0])
    parentNode.appendChild(firstNode)
  }

  /*
	 *
	 * 初始化节点位置
	 *
	 * */
  function fnInitPosition(that, index) {
    var width = that.$width
    fnTransition(that.options.$ul, 0, that)
    fnTranslate(that.options.$ul, -width * (Math.max(-1, index)), that)
    fnTransition(that.options.$li, 0, that)
    fnTranslate(that.options.$li, that)
  }

  /*
	 *
	 * 设置transitione
	 *
	 * */
  function fnTransition(dom, time, el) {

    if (dom.length && dom.length > 0) {
      for (var i = 0, leng = dom.length; i < leng; i++) {
        dom[i].style[el.transition] = `all ${time}ms ${el.options.linear}`
      }
    } else {
      dom.style[el.transition] = `all ${time}ms ${el.options.linear}`
    }
  }

  /*
	 *
	 * 设置transform
	 *
	 * */
  function fnTranslate(dom, distance, el) {
    if (dom.length && dom.length > 0) {
      var that = distance
      var flag = 0
      if (that.options.loop) {
        flag = -1
      }
      for (var i = 0, leng = dom.length; i < leng; i++) {
        dom[i].style[that.transform] = `translate3d(${that.$width * (i + flag)}px, 0, 0)`
      }
    } else {
      dom.style[el.transform] = `translate3d(${distance}px, 0, 0)`
    }
  }

  /*
	 *
	 * 添加兼容前缀
	 *
	 * */
  function fnGetPrefix(style) {
    var vendor = function () {

      let elementStyle = document.createElement('div').style

      var transform = {
        'webkit': 'webkitTransform',
        'Moz': 'MozTransform',
        'O': 'OTransform',
        'ms': 'msTransform',
        'standard': 'transform'
      }
      for (var key in transform) {
        if (elementStyle[transform[key]] !== undefined) {
          return key
        }
      }
    }()

    if (!style) {
      return
    }
    if (vendor === 'standard') {
      return style
    }
    return vendor + style.charAt(0).toUpperCase() + style.slice(1)
  }

  /*
	* 自动轮播
	* */

  function fnAutoPlay(that) {
    if (that.options.autoPlay) {
      that.timer = setInterval(() => {
        fnPlay(that, "next", 300)
      }, that.options.delay)
    }
  }

  /*
	* 清除自动轮播
	* */
  function fnClearAutoPlay(that) {
    if (that.options.autoPlay) {
      if (that.timer) {
        clearInterval(that.timer)
        that.timer = null
      }
    }
  }

  /*
	*
	* 滚动函数
	* */
  function scroll(that, time) {
    that.isScrolling = true
    that.options.$ul.style[that.transition] = `all ${time}ms ${that.options.ease}`
    setTimeout(() => {
      that.isScrolling = false
    }, time)
    that.options.$ul.style[that.transform] = `translate3d(${-that.$width * that.index}px, 0, 0)`
  }


  function scrollByNumberFn(that, type, time) {
    if (typeof type === 'number') {
      that.index = type
      if (that.options.lazyload) {
        fnLazyload(that, that.index)
        if (that.options.loop) {
          fnLazyload(that, that.index + 1)
          fnLazyload(that, that.index + 2)
          if (that.index >= that.$length - 1) {
            fnLazyload(that, 0)
            fnLazyload(that, 1)
          } else if (that.index === 0) {
            fnLazyload(that, that.$length)
            fnLazyload(that, that.$length + 1)
          } else {
            fnLazyload(that, that.index + 1)
            fnLazyload(that, that.index + 2)
          }
        } else {
          if (that.index === 0) {
            fnLazyload(that, that.index + 1)
          } else if (that.index === that.$length - 1) {
            fnLazyload(that, that.$length - 2)
          } else {
            fnLazyload(that, that.index + 1)
            fnLazyload(that, that.index - 1)
          }
        }
      }
    } else {
      return 'nextSuccessor'
    }
  }


  function scrollByNextFn(that, type, time) {
    console.log('我执行了这里', that, type, time)
    if (type === 'next') {
      that.index++
      if (that.options.lazyload) {
        if (that.options.loop) {
          /*
					* 如果是next,当前的index的下一张是默认已经 lazy loading了
					* Loop状态下，由于在前面插入了一张图，index++ 是next之前的那张图
					* 如果不能理解 推荐在that.index++ 以及fnLazyload(that, that.index + 2) 处打印index 以及 index + 2
					* */
          fnLazyload(that, that.index + 2)
          if (that.index + 1 >= that.$length) {
            fnLazyload(that, 0)
            fnLazyload(that, 1)
          }
        }else {
          fnLazyload(that, that.index + 1)
        }
      }
    }else {
      return 'nextSuccessor'
    }
  }

  function scrollByPrevFn(that, type, time) {
    if (type === 'prev') {
      that.index--
      if (that.options.lazyload) {
        if (that.options.loop) {
          fnLazyload(that, that.index)
          if (that.index - 1 < 0) {
            fnLazyload(that, that.$length + 1)
            fnLazyload(that, that.$length)
          }
          if (that.index < 0) {
            fnLazyload(that, that.$length - 1)
          }
        } else {
          fnLazyload(that, that.index - 1)
        }
      }
    } else {
      return 'nextSuccessor'
    }
  }

  /*
	*
	* 职责链类
	*
	* */
  function ScrollChain(fn) {
    this.fn = fn
    this.successor = null
  }

  ScrollChain.prototype.setNextSuccessor = function (successor) {
    this.successor = successor
  }

  ScrollChain.prototype.passRequest = function () {
    var ret = this.fn.apply(this, arguments)
    if (ret === 'nextSuccessor') {
      return this.successor && this.successor.passRequest.apply(this.successor, arguments)
    }
    return ret
  }
  /*
	*
	* 兼容异步情况
	* */
  ScrollChain.prototype.next = function () {
    return this.successor && this.successor.passRequest.apply(this.successor, arguments)
  }

  const scrollByNumberChain = new ScrollChain(scrollByNumberFn)
  const scrollByPrevChain = new ScrollChain(scrollByPrevFn)
  const scrollByNextChain = new ScrollChain(scrollByNextFn)

  scrollByNumberChain.setNextSuccessor(scrollByPrevChain)
  scrollByPrevChain.setNextSuccessor(scrollByNextChain)

  /*
	*
	* 轮播动画
	*
	* */

  function fnPlay(that, type, time) {
    if (that.isScrolling) return
    /*
		* 当轮播的时候，处理各项的图片懒加载
		* */
    scrollByNumberChain.passRequest(that, type, time)

    /*
		* 滚动
		* */
    if (that.options.loop) {
      if (that.index >= that.$length) {
        scroll(that, time)
        that.index = 0
        setTimeout(() => {
          console.log('我执行了这里')
          scroll(that, 0)
          /*

				  加50防止出现切换transform会发生白屏闪烁问题
				  */
        }, time + 50)
      } else if (that.index < 0) {
        scroll(that, time)
        that.index = that.$length - 1
        setTimeout(() => {
          console.log('我执行了这里2')
          scroll(that, 0)
        }, time + 50)
      } else {
        scroll(that, time)
      }
    } else {
      if (that.index >= that.$length) {
        return
      }
      scroll(that, time)
    }
  }

  /*
	*
	* 屏幕触摸事件处理
	*
	* */
  function fnHandleTouch(that, index) {
    let ul = that.options.$ul
    that.touch = {}
    ul.addEventListener('touchstart', function (e) {
      that.touch.startX = e.touches[0].pageX
      that.touch.startY = e.touches[0].pageY
    })
    ul.addEventListener('touchmove', function (e) {
      fnClearAutoPlay(that)
      that.touch.moveX = that.touch.startX - e.touches[0].pageX
      that.touch.moveY = that.touch.startY - e.touches[0].pageY
      /*
			* 防止在做竖直方向的滚动时影响轮播图
			* */
      let flag = Math.abs(that.touch.moveY) - Math.abs(that.touch.moveX)

      if (flag < 0) {
        fnTransition(this, 0, that)
        if (!that.options.loop) {
          if ((that.index === 0 && that.touch.moveX > 0) || that.index === that.$length - 1 && that.touch.moveX < 0) {
            that.touch.moveX = 0
          }
        }
        fnTranslate(ul, -(that.index * that.$width + that.touch.moveX), that)
      }
    })
    ul.addEventListener('touchend', function () {
      fnClearAutoPlay(that)
      if (Math.abs(that.touch.moveX) <= that.options.moveDistance) {
        fnPlay(that, '', 300)
      }else {
        if (that.touch.moveX > that.options.moveDistance) {
          fnPlay(that, 'next', 300)
        } else if (that.touch.moveX < 0 && (Math.abs(that.touch.moveX) > that.options.moveDistance)) {
          fnPlay(that, 'prev', 300)
        }
      }
      that.touch.moveX = 0
    })
  }
  return Slider
}()

export default Slider
