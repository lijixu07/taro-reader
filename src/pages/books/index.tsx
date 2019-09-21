import { ComponentType } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtDivider } from 'taro-ui'
import api from '../../api';

import './index.scss'

interface IState {
  list: any,
  status: any,
  pageSize: number,
  pageNum: number,
  isLoadAll: boolean,
  isLoadding: boolean
}

class Index extends Component<{}, IState>{

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '书海',
    "enablePullDownRefresh": true
  }

  constructor () {
    super(...arguments)
    this.state = {
      status: '加载中···',
      list: [],
      pageSize: 10,
      pageNum: 1,
      isLoadAll: false,
      isLoadding: false
    }
  }

  componentWillMount () { }

  componentWillReact () {
    console.log('componentWillReact')
  }

  componentDidMount () { 
    this.getList()
  }

  componentWillUnmount () {
  }

  componentDidShow () { }

  componentDidHide () { }

  onPullDownRefresh(){
    Taro.showLoading({
      title: '刷新中...',
      mask: true
    })
    setTimeout(() => {
      // 没有更多了
      Taro.stopPullDownRefresh()
      Taro.hideLoading()
      this.getList(1)
      this.setState({isLoadAll: false})
    }, 1200)
  }

  async onReachBottom() {
    const { pageNum } = this.state
    this.getList(pageNum + 1)
  }

  async getList (pageNum = 1) {
    const { pageSize, list, isLoadAll, isLoadding } = this.state
    if (isLoadAll || isLoadding) return
    this.setState({isLoadding: true})
    if (pageNum) {
      this.setState({
        pageNum
      })
    }
    try {
      let res: any = await api.getBooks({pageNum, pageSize: pageSize})
      if (res.code === 0) {
        let data = res.data
        if (data.list.length < pageSize) this.setState({isLoadAll: true, status: '没有更多了'})
        if (pageNum === 1) this.setState({list: data.list})
        else this.setState({list: list.concat(data.list)})
      }
    } finally {
      this.setState({isLoadding: false})
    } 
  }

  goDetail (id) {
    Taro.navigateTo({url: `/subpages/books/detail/index?id=${id}`})
  }

  render () {
    let { list, status } = this.state
    return ( 
      <View className="container">
        <View className="books-list">
        {list.map((item: any, number) => {
          return(
          <View onClick={this.goDetail.bind(this, item.id)} key={number} className="list-item flex flex-a-i-center flex-j-c-sb">
            <Image
              className="list-item-img"
              mode="aspectFill"
              src={item.img}
            />
            <View className="list-item-right flex flex-wrap flex-a-i-center flex-a-c-start">
              <View className="list-item-title ellipsis">{item.name}</View>
              <View className="list-item-author ellipsis">{item.author}{item.isEnd ? '（已完结）' : '（连载中）'}</View>
              <View className="list-item-desc ellipsis-more">{item.description}</View>
            </View>
          </View>
          )
        })}
        <View className="list-bottom">
          <AtDivider content={status} fontSize={24} fontColor='#999999' lineColor='#eeeeee' />
        </View>
        </View>
      </View>
    )
  }
}

export default Index  as ComponentType
