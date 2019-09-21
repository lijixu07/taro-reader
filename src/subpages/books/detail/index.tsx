import { ComponentType } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image} from '@tarojs/components'
import { AtButton } from 'taro-ui'

import api from '../../../api'

import './index.scss'

interface IState {
  detail: any,
  list: any,
  record: any
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
    navigationBarTitleText: '详情'
  }

  constructor () {
    super(...arguments)
    this.state = {
      detail: {},
      list: [],
      record: {}
    }
  }

  componentWillMount () { }

  componentWillReact () {
    console.log('componentWillReact')
  }

  async componentDidMount () {
    const { id } = this.$router.params
    let detailRes: any = await api.getBookDetail(id)
    if (detailRes.code === 0) {
      this.setState({detail: detailRes.data})
      Taro.setNavigationBarTitle({title: detailRes.data.name})
    }
    let listRes: any = await api.getBookList({novelId: id})
    if (listRes.code === 0) {
      this.setState({list: listRes.data})
    }
  }

  componentWillUnmount () { }

  async componentDidShow () { 
    const { id } = this.$router.params
    let recordRes: any = await api.getchapterPosition({novelId: id})
    if (recordRes.code === 0) {
      this.setState({
        record: recordRes.data || {}
      })
    }
  }

  componentDidHide () { }

  read (id) {
    Taro.navigateTo({url: `/subpages/books/reader/index?id=${id}&name=${this.state.detail.name}`})
  }

  render () {
    let { detail, list, record } = this.state
    return (
      <View className="container">
        <View className="detail-con">
          <View className="top flex flex-a-i-center">
            <Image
              className="img"
              mode="aspectFill"
              src={detail.img}
            />
            <View className="detail-right">
              <View className="title">{detail.name}</View>
              <View className="author">作者：{detail.author}</View>
              <View className="status">状态：{detail.isEnd ? '已完结' : '连载中'}</View>
              { record.chapterId ? 
              <AtButton type='primary' size='small' onClick={this.read.bind(this, record.chapterId)}>
                继续阅读</AtButton> 
              : <AtButton type='primary' size='small'>开始阅读</AtButton> }
              <View className="readed ellipsis">({record.chapterName || 
                (list && list[0].name) || ''})</View>
            </View>
          </View>
          <View className="desc-con">
            <View className="section-title">简介</View>
            <View className="desc">{detail.description}</View>
          </View>
        </View>
        <View className="chapters-con">
          <View className="section-title">目录</View>
          <View className="list">
            {
              list.map(item => {
                return (
                  <View 
                    onClick={this.read.bind(this, item.id)} 
                    key={item.id} 
                    className="chapter"
                    style={
                      (record.chapterId && record.chapterId === item.id) 
                      ? 'color: #E17230;' : ''}
                    >{item.name}</View>
                )
              })
            }
          </View>
        </View>
      </View>
    )
  }
}

export default Index  as ComponentType
