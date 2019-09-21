import { ComponentType } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, ScrollView} from '@tarojs/components'
import { AtTabs, AtTabsPane, AtDivider } from 'taro-ui'

import './index.scss'
import api from '../../api';

interface IState {
  status: any,
  list: any,
  current: number,
  records: any,
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
    navigationBarTitleText: '书架',
    disableScroll: true,
    disableSwipeBack: true
  }

  constructor () {
    super(...arguments)
    this.state = {
      status: '加载中···',
      list: [],
      current: 3,
      records: [],
      pageSize: 10000,
      pageNum: 1,
      isLoadAll: false,
      isLoadding: false
    }
  }

  componentWillMount () { }

  componentWillReact () {
    console.log('componentWillReact')
  }

  async componentDidMount () { 
    
  }

  componentWillUnmount () { }

  async componentDidShow () { 
    let res: any = await api.getBooks()
    if (res.code === 0) {
      console.log(res.data)
      this.setState({list: res.data.list})
    }
    this.getList()
  }

  componentDidHide () {
    this.setState({isLoadAll: false, status: '加载中···'})
  }

  async getList (pageNum = 1) {
    const { pageSize, records, isLoadAll, isLoadding } = this.state
    if (isLoadAll || isLoadding) return
    this.setState({isLoadding: true})
    if (pageNum) {
      this.setState({
        pageNum
      })
    }
    try {
      let res: any = await api.getRecords({pageNum, pageSize})
      if (res.code === 0) {
        let data = res.data.list
        if (data.length < pageSize) this.setState({isLoadAll: true, status: '没有更多了'})
        if (pageNum === 1) this.setState({records: data})
        else this.setState({records: records.concat(data)})
      }
    } finally {
      this.setState({isLoadding: false})
    } 
  }

  handleClick (value) {
    if (value < 3) return
    this.setState({
      current: value
    })
  }

  goDetail (id) {
    Taro.navigateTo({url: `/subpages/books/detail/index?id=${id}`})
  }

  read (id, name) {
    Taro.navigateTo({url: `/subpages/books/reader/index?id=${id}&name=${name}`})
  }

  onReachBottom () {
    console.log(0)
    const { pageNum } = this.state
    this.getList(pageNum + 1)
  }

  render () {
    let { list, current, records, status } = this.state
    const tabList = [{ title: '' }, { title: '' }, { title: '' }, { title: '收藏' }, { title: '历史' }]
    return (
      <View className="container">
        <AtTabs current={current} tabList={tabList} onClick={this.handleClick.bind(this)}>
          <AtTabsPane current={current} index={0}></AtTabsPane>
          <AtTabsPane current={current} index={1}></AtTabsPane>
          <AtTabsPane current={current} index={2}></AtTabsPane>
          <AtTabsPane current={current} index={3} >
            <View className="book-con flex flex-a-i-center flex-j-c-sb flex-wrap">
            {list.map((item: any, number) => {
              return(
              <View className="book" key={number} onClick={this.goDetail.bind(this, item.id)}>
                <Image className="img" mode="aspectFill" src={item.img} />
                <View className="title center ellipsis">{item.name}</View>
                <View className="desc center ellipsis">{item.author}{item.isEnd && '(已完结)'}</View>
              </View>)
            })}
            {(list.length % 3 === 2) && 
              <View className="book hide">
                <Image className="img" mode="aspectFill" src="" />
                <View className="title center ellipsis"></View>
                <View className="desc center ellipsis"></View>
              </View>
            }
            </View>
          </AtTabsPane>
          <AtTabsPane current={current} index={4}>
            <View className="records-list">
            {records.map((item: any, number) => {
              return(
                <View onClick={this.read.bind(this, item.chapterId, item.chapterName)} key={number} className="list-item flex flex-a-i-center flex-j-c-sb">
                  <Image
                    className="list-item-img"
                    mode="aspectFill"
                    src={item.novel.img}
                  />
                  <View className="list-item-right flex flex-wrap flex-a-i-center flex-a-c-center">
                    <View className="list-item-title ellipsis">{item.novel.name}</View>
                    <View className="list-item-author ellipsis">{item.novel.author}{item.novel.isEnd ? '（已完结）' : '（连载中）'}</View>
                    <View className="list-item-desc ellipsis">上次看到：{item.chapterName}</View>
                    {/* <View className="list-item-desc ellipsis">{item.updateTime}</View> */}
                  </View>
                </View>
              )})}
              <View className="list-bottom">
                <AtDivider content={status} fontSize={24} fontColor='#999999' lineColor='#eeeeee' />
              </View>
            </View>
          </AtTabsPane>
        </AtTabs>
        
      </View>
    )
  }
}

export default Index  as ComponentType
