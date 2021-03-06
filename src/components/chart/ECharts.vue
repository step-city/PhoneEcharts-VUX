<template>
<div class="echarts"/>
</template>

<style>
/* .echarts {
  width: 600px;
  height: 400px;
} */
.echarts {
  width: auto;
  height: 450px;
}
</style>

<script>
import echarts from 'echarts/lib/echarts'
import debounce from 'lodash/debounce'
import Vue from 'vue'
// enumerating ECharts events for now
const ACTION_EVENTS = [
  'legendselectchanged',
  'legendselected',
  'legendunselected',
  'datazoom',
  'datarangeselected',
  'timelinechanged',
  'timelineplaychanged',
  'restore',
  'dataviewchanged',
  'magictypechanged',
  'geoselectchanged',
  'geoselected',
  'geounselected',
  'pieselectchanged',
  'pieselected',
  'pieunselected',
  'mapselectchanged',
  'mapselected',
  'mapunselected',
  'axisareaselected',
  'focusnodeadjacency',
  'unfocusnodeadjacency',
  'brush',
  'brushselected'
]
const MOUSE_EVENTS = [
  'click',
  'dblclick',
  'mouseover',
  'mouseout',
  'mousedown',
  'mouseup',
  'globalout'
]
export default {
  props: {
    events: { type: Object },
    options: Object,
    theme: [String, Object],
    initOptions: Object,
    group: String,
    autoResize: Boolean,
    watchShallow: Boolean
  },
  data () {
    return {
      chart: null
    }
  },
  computed: {
    // Only recalculated when accessed from JavaScript.
    // Won't update DOM on value change because getters
    // don't depend on reactive values
    width: {
      cache: false,
      get () {
        return this.delegateGet('width', 'getWidth')
      }
    },
    height: {
      cache: false,
      get () {
        return this.delegateGet('height', 'getHeight')
      }
    },
    isDisposed: {
      cache: false,
      get () {
        return !!this.delegateGet('isDisposed', 'isDisposed')
      }
    },
    computedOptions: {
      cache: false,
      get () {
        return this.delegateGet('computedOptions', 'getOption')
      }
    }
  },
  watch: {
    group (group) {
      this.chart.group = group
    },
    events: {
      deep: true,
      handler () {
        this.createEventProxy()
      }
    },
  },
  methods: {
    // provide a explicit merge option method
    mergeOptions (options, notMerge, lazyUpdate) {
      this.delegateMethod('setOption', options, notMerge, lazyUpdate)
    },
    // just delegates ECharts methods to Vue component
    // use explicit params to reduce transpiled size for now
    resize (options) {
      this.delegateMethod('resize', options)
    },
    dispatchAction (payload) {
      this.delegateMethod('dispatchAction', payload)
    },
    convertToPixel (finder, value) {
      return this.delegateMethod('convertToPixel', finder, value)
    },
    convertFromPixel (finder, value) {
      return this.delegateMethod('convertFromPixel', finder, value)
    },
    containPixel (finder, value) {
      return this.delegateMethod('containPixel', finder, value)
    },
    showLoading (type, options) {
      this.delegateMethod('showLoading', type, options)
    },
    hideLoading () {
      this.delegateMethod('hideLoading')
    },
    getDataURL (options) {
      return this.delegateMethod('getDataURL', options)
    },
    getConnectedDataURL (options) {
      return this.delegateMethod('getConnectedDataURL', options)
    },
    clear () {
      this.delegateMethod('clear')
    },
    dispose () {
      this.delegateMethod('dispose')
    },
    delegateMethod (name, ...args) {
      if (!this.chart) {
        Vue.util.warn(`Cannot call [${name}] before the chart is initialized. Set prop [options] first.`, this)
        return
      }
      return this.chart[name](...args)
    },
    delegateGet (name, method) {
      if (!this.chart) {
        Vue.util.warn(`Cannot get [${name}] before the chart is initialized. Set prop [options] first.`, this)
      }
      return this.chart[method]()
    },
    init () {
      if (this.chart) {
        return
      }
      let chart = echarts.init(this.$el, this.theme, this.initOptions)
      if (this.group) {
        chart.group = this.group
      }
      chart.setOption(this.options, true)
      // expose ECharts events as custom events
      ACTION_EVENTS.forEach(event => {
        chart.on(event, params => {
          this.$emit(event, params)
        })
      })
      MOUSE_EVENTS.forEach(event => {
        chart.on(event, params => {
          this.$emit(event, params)
          // for backward compatibility, may remove in the future
          this.$emit('chart' + event, params)
        })
      })
      if (this.autoResize) {
        this.__resizeHanlder = debounce(() => {
          chart.resize()
        }, 100, { leading: true })
        window.addEventListener('resize', this.__resizeHanlder)
      }
      this.chart = chart
      this.createEventProxy()
      //  if (this.events) this.bindEvents()
    },
    createEventProxy () {
      // 只要用户使用 on 方法绑定的事件都做一层代理，
      // 是否真正执行相应的事件方法取决于该方法是否仍然存在 events 中
      // 实现 events 的动态响应
      const self = this
      const keys = Object.keys(this.events || {})
      keys.length && keys.forEach(ev => {
        if (this.registeredEvents.indexOf(ev) === -1) {
          this.registeredEvents.push(ev)
          this.chart.on(ev, (function (ev) {
            return function (...args) {
              if (ev in self.events) {
                self.events[ev].apply(null, args)
              }
            }
          })(ev))
        }
      })
    },
     bindEvents () {
      Object.keys(this.events).forEach(event => {
        this.chart.on(event, this.events[event])
      })
    },
    destroy () {
      if (this.autoResize) {
        window.removeEventListener('resize', this.__resizeHanlder)
      }
      this.dispose()
      this.chart = null
    },
    refresh () {
      this.destroy()
      this.init()
    }
  },
  created () {
    this.registeredEvents = []    
    this.$watch('options', options => {
      if (!this.chart && options) {
        this.init()
      } else {
        this.chart.setOption(this.options, true)
      }
    }, { deep: !this.watchShallow })
    let watched = ['theme', 'initOptions', 'autoResize', 'watchShallow']
    watched.forEach(prop => {
      this.$watch(prop, () => {
        this.refresh()
      }, { deep: true })
    })
  },
  mounted () {
    // auto init if `options` is already provided
    if (this.options) {
      this.init()
    }
  },
  activated () {
    if (this.autoResize) {
      this.chart && this.chart.resize()
    }
  },
  beforeDestroy () {
    if (!this.chart) {
      return
    }
    this.destroy()
  },
  connect (group) {
    if (typeof group !== 'string') {
      group = group.map(chart => chart.chart)
    }
    echarts.connect(group)
  },
  disconnect (group) {
    echarts.disConnect(group)
  },
  registerMap (...args) {
    echarts.registerMap(...args)
  },
  registerTheme (...args) {
    echarts.registerTheme(...args)
  }
}
</script>