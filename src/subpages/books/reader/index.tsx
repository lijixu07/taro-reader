import { ComponentType } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, RichText, ScrollView } from '@tarojs/components'
import { AtDivider } from 'taro-ui'

import './index.scss'
import api from '../../../api'

interface IState {
  detail: any,
  status: any,
  content: any,
  contents: any,
  id: any,
  isComplete: boolean
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
    navigationBarTitleText: '阅读器'
  }

  constructor () {
    super(...arguments)
    this.state = {
      status: '加载中···',
      detail: {},
      contents: {},
      content: '',
      id: '',
      isComplete: true
    }
  }

  componentWillMount () {
    Taro.setNavigationBarTitle({title: this.$router.params.name})
    Taro.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#0d0d0d'
    })
  }

  componentWillReact () {
    console.log('componentWillReact')
  }

  async componentDidMount () {
    const { id } = this.$router.params
    this.getContent(id)
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  getContent (id) {
    let err: any;
    let { isComplete, content } = this.state
    if (!isComplete || !id) return
    this.setState({isComplete: false})
    this.setState({id})
    api.getchapter({id})
    .then((res: any) => {
      if (res.code === 0) {
        let data = res.data
        console.log(data)
        if (data.name) Taro.setNavigationBarTitle({title: data.name})
        this.setState({detail: data})
        return api.getchapterContent({
          index: data.index,
          novelId: data.novelId
        })
      } else {
        console.log(res)
        err = res.err
        throw new Error(err.error)
      }
    })
    .then((res: any) => {

      if (res.code === 0) {
        let { detail } = this.state
        let data = res.data
        if(!data.nextId) this.setState({status: '没有更多了'})
        let format = (data.content || '')
        .split('<em>').join('').split('</em>').join('').split('</p>').join(`</p><br/>`)
        format = `<h3 class="title center" style="text-indent: 0;">${detail.name}</h3>${format}`
        let reg = /<a(([\s\S])*?)<\/a>/g
        format = format.replace(reg, '')
        if (content) content += '<br/>'
        let con = `${content}${format}`
        this.setState({
          content: con,
          contents: data,
          isComplete: true
        })
      } else {
        err = res.err
        throw new Error(err.error)
      }
      
    })
    .catch(() => {
      Taro.showModal({
        title: '错误',
        content: err.error || '出现错误',
        showCancel: false
      })
      this.setState({isComplete: true})
    })
  }

  async onReachBottom() {
    const { contents } = this.state
    this.getContent(contents.nextId)
  }

  go (id) {
    if (!id) return
    Taro.redirectTo({url: `/subpages/books/reader/index?id=${id}&name=${this.$router.params.name}`})
  }

  render () {
    let { content, status } = this.state
    return (
      <ScrollView className="container">
        {/* <View className="title center">{detail.name}</View> */}
        <RichText style={`
          font-size: ${Taro.pxTransform(36)};
          line-height: 160%;
          color: rgb(82, 85, 82);
          text-align: justify;
          text-indent: 2em;
          font-family: "Xin Gothic","PT Sans","Hiragino Sans GB","Helvetica Neue",Helvetica,Arial,Sans-serif;
          `} 
          nodes={content}> </RichText>
          {/* <View className="btns flex flex-a-i-center flex-j-c-sb">
            <View onClick={this.go.bind(this, contents.preId)} className="btn center">上一章</View>
            <View onClick={this.go.bind(this, contents.nextId)} className="btn center">下一章</View>
          </View> */}
          <View className="bottom">
            <AtDivider content={status} fontSize={24} fontColor='#999999' lineColor='#eeeeee' />
          </View>
      </ScrollView>
    )
  }
}

export default Index  as ComponentType
