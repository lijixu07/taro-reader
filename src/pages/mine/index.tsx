import { ComponentType } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtButton, AtAvatar } from 'taro-ui'

import './index.scss'
import api from '../../api';

class Index extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '我的'
  }

  constructor () {
    super(...arguments)
    this.state = {
      
    }
  }

  componentWillMount () { }

  componentWillReact () {
    console.log('componentWillReact')
  }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  async onGetUserInfo (e) {
    console.log(e)
    const { detail } = e
    console.log(detail.errMsg)
    if (detail.errMsg !== 'getUserInfo:ok') return
    const { code } = await Taro.login()
    if (code) {
      const infoRes: any = await Taro.getUserInfo()
      if (infoRes.errMsg !== 'getUserInfo:ok') return
      const { encryptedData, iv } = infoRes
      const res: any = await api.login({code, encryptedData, iv})
      console.log(encryptedData, iv)
      if (res.code === 0) {
        Taro.setStorageSync('r_token', res.data.token);
      }
    }
  }

  render () {
    return (
      <View className="container">
        <AtAvatar className="avatar" circle size="large" openData={{ type: 'userAvatarUrl'}}></AtAvatar>
        <AtButton 
        className="login-btn" 
        type='primary' 
        openType="getUserInfo"
        onGetUserInfo={this.onGetUserInfo.bind(this)}>登录</AtButton>
      </View>
    )
  }
}

export default Index  as ComponentType
