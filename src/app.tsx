import Taro, { Component, Config } from '@tarojs/taro'
import { Provider } from '@tarojs/mobx'
import Index from './pages/index'
import 'taro-ui/dist/style/index.scss'

import counterStore from './store/counter'

import './app.less'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

const store = {
  counterStore
}

class App extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    pages: [
      'pages/index/index'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#E17230',
      navigationBarTitleText: 'reader',
      navigationBarTextStyle: 'white'
    },
    tabBar: {
      color: '#999999',
      selectedColor: '#E17230',
      backgroundColor: '#ffffff',
      list: [
        {
          pagePath: 'pages/index/index',
          text: '首页',
          iconPath: 'assets/tabbar/index.png',
          selectedIconPath: 'assets/tabbar/index_active.png'
        },
        {
          pagePath: 'pages/index/index',
          text: '书海',
          iconPath: 'assets/tabbar/book.png',
          selectedIconPath: 'assets/tabbar/book_active.png'
        },
        {
          pagePath: 'pages/index/index',
          text: '书架',
          iconPath: 'assets/tabbar/bookshelf.png',
          selectedIconPath: 'assets/tabbar/bookshelf_active.png'
        },
        {
          pagePath: 'pages/index/index',
          text: '我的',
          iconPath: 'assets/tabbar/mine.png',
          selectedIconPath: 'assets/tabbar/mine_active.png'
        }
      ]
    }
  }

  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
