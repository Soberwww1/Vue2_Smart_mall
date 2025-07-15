智慧商城项目结构梳理

# **1.** **项目初始 --- 进行准备工作**

## **1.1** **环境以及依赖的创建**

1.1.1   安装 vue-cli 脚手架(ps:我之前安过了，安过一次就不用安)并自定义创建项目（Vue2.x\Balel\Router\Vuex3\CSS\Linter）

1.1.2   导入一些外部组件库 --- 因为是移动端项目，可以导入的组件库有很多，这里我选择 Vant2.x 实现很多业务效果以及跑马灯vue_marquee 库实现跑马灯效果

1.1.3   导入 axios 数据请求库，依赖他与后端进行数据请求。

**1.2** **工程化项目的分类**

1.2.1   依据导入的各个包，分类创建文件夹 --- 
 导入 vue-router包创建router文件夹，创建主文件，存放路由跳转的数据与配置文件，并在main.js主文件中导入注册。

1.2.2   导入 vuex 包创建 store文件夹，存放一些响应式数据（利用了vuex数据响应式特点），并且因为此次项目规模有一点大（对目前的我而言），所以在store文件夹中新建modules模块文件夹分模块管理不同页面数据。并在main.js主文件中导入注册。

1.2.3   导入的vant组件包、axios数据请求包、vue_marquee跑马灯包、自定义本地存储函数包等辅助工具包统统放入utils文件夹，该新建文件夹用来存放辅助工具，其中再创建axios文件夹时新建一个request.js文件，虽然所有业务都是访问一个基地址，但是在以后的开发时可能存在不同的域名访问，不同的服务器访问，所以新建一个axios实例 --- request，对于axios的配置也是配置在request上**防止污染axios**，加入之后有访问别的服务器时，可以继续新建一个新的axios实例并对其配置。并在main.js主文件中导入。

1.2.4   新建 style文件夹，将一些公共CSS样式写入，并在main.js主文件中导入

1.2.5   新建minxins文件夹，这是vue中一个**代码混入**的文件夹，专门放那种在**很多页面中都使用到的函数等**（在本项目中，minxins中存放的是用户登录验证函数），于是将其封装到一个个js文件然后存放如minxins文件夹中，哪个vue文件要使用，就在那个vue文件中注册并使用

1.2.6   Components文件夹，存放一些自定义的小组件，有的组件第三方没提供，但是又有多个页面需要，于是自己定义，并分别命名并存放入components文件夹。需要用时就导入注册使用

1.2.7   创建views页面（这个就是主线任务的存放地了，具体在页面路由分类中细嗦）

## **1.3** **页面路由分类**

明确该项目路由的分级 --- 一般路由都分两级，再多就不好维护了

该项目有如下页面：

一级路由：
   **首页页面**、**登录页面**、**订单页面**、**支付页面**、**商品详情页**、**搜索页**、**搜索详情页**、**个人地址页**、（我的钱包页、个人积分页、我的优惠劵页、领劵中心页、帮助页、售后服务/替换页）

二级路由：
   其中，首页页面又包括 --- 首页、商品分类页、购物车页、用户页
 

具体如何分辨该页面是几级页面（暂时先以1、2级页面阐述），页面路由的作用就是将子组件的内容渲染在父组件中，以这个基础完成页面跳转的操作，一级路由就是APP.Vue主文件的“儿子”，二级路由就是一级路由的儿子，但是二级路由渲染的画面一般是组成一级路由的一部分（换言之，就是一级路由加入带有2个以上的二级路由，那么改一级路由界面一定带有通往不同二级路由的标志，所以区分以及还是二级界面就是看是否这些页面是否带着一些固有的特征）

 

## **1.4** **本地存储化**

因为该项目存在登录功能，搜索历史记录功能。而一些界面的渲染数据与个人信息是强相关的（就是每个人对应着单独的信息，比如订单，购物车，个人钱包等），所以在渲染这些界面时会时刻请求个人信息数据，那么存在一个问题：
   每一次渲染打开订单页、购物车页等页面就要请求数据，太浪费资源了，于是就想到将个人登录数据保存在本地（个人账户创建后会分配一个userid、token，而识别是否登录就是看是不是有token），而vuex仓库不会保存数据（一刷新就没了），于是将个人信息（账号 --- Token）保存在localStorage，
 **存储用户登录数据**就使用:

localStorage.setItem(‘自定义的存储名’, JSON.string(obj)),
 **获取用户登录数据**就使用:

localStorage.getItem(‘自定义的存储名’)，
 

在该项目中有一个小功能是搜索历史记录保存，就是你搜索完毕可以看到你的搜索历史记录，一般而言**不涉及多端同步**，这个功能就只需要在本地实现就行。所以实现该功能便使用本地存储。核心逻辑是在data中初始化一个历史空列表 **history：[]**， 、一个历史对象：**value:‘’**， 并且在搜索输入框中使用**v-mode=‘value**’，这样对value进行响应式监听,每次获得的数据使用history.unshift(value)添加进历史纪录列表中然后对该历史记录列表进行存储更新:

localStorage.setItem(‘自定义的存储名’, JSON.string(arry))
 至于存储详情与输入搜索细节在之后的“页面解析”中分析。

 

## **1.5** **Vuex****仓库**

对于页面的一些频繁进行更改的数据，如购物车列表，还有一些数据如果使用本地存储每次要写的代码量太大，并且读取速度比较慢，而vuex仓库数据存储在内存中读取很快，并且其中数据是响应式，不必在要渲染的页面存储数据，于是购物车数据、用户数据、用户地址、首页导航栏高亮三个数据我选择使用vuex仓库存储。

所以我的vuex仓库共分为3个模块 --- user.js、cart.js、address.js、tabbarActive.js，
 在index.js的modules状态模块中导入注册
 注意：每个小模块一定要记得开辟命名空间：namespaced:true。Vuex仓库遵循单一文档树合并规则。即不管你人为分出多少个模块，最后浏览器解析代码底层也会把各个模块的state、mutations、actions、getters整合到index.js上，这时命名空间的开辟便起到作用了。因为各个模块中可能有同名的mutataions、actions等函数，**如果没有开辟命名空间，那么在最后解析时可能会有触发多个同名函数的情况**，**但是开启了命名空间，在逻辑上就会对各个模块分类**，利于多人开发与复用。

 

 

## **1.6** **Components****组件**

在整个项目中有两个进行复用的组件

加减数字框：
 主要步骤：使用组件通信 --- props&$emit
 **+ & -**是通过设置点击事件handlenum（1/-1）函数更改value值，并使用this.$emit(‘input’,更改后的值)传给调用该组件的父组件
 中间的输入框当然也可以输入值进行更改，添加点击事件监听器设置handlechange函数，
 首先对于输入的不合法的值或者空值，会直接提醒

~~~js
if(!e.target.value.trim()||(!/^[1-9]+$/.test(e.target.value))||Number(e.target.value)<1){
 	e.target.value = this.value // 这句代码是将更改了但是不规范的值变为原值
	Toast(‘输入不合法’)
    return
}
this.$emit(‘input’,Number(e.target.value))
~~~

​                               

商品详情框：
 这个没什么技巧，画图罢。注意：因为使用组件通信传递进每个商品的信息，所以每个商品所携带的商品ID也会传入进来，并使用点击事件监听器进行点击路由跳转，跳转到每个商品的详情页
  

 

## **1.7** **不同API数据请求封装**

该项目的每个页面基本都存在数据请求交互的部分

具体细节在“详解各个页面”中阐述



## 1.8响应拦截器 && 请求拦截器

1、请求拦截器：

在每次请求时都会执行该程序

在本项目中有如下核心操作

​	1、从vuex中获取token判断用户是否登录 --- 进而更改请求头 （一些页面请求数据与登录强相关--- 订单页、购物车页、支付页等）

​	2、在每次数据请求时都使用vant组件 Toast.loading 设置缓冲动画

~~~js
instance.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么

  // 判断是否登录 --- 如果登录了，就配置请求参数 --- Access-Token
  if (store.getters['user/token']) {
    config.headers['Access-Token'] = store.getters['user/token']
  }

  // 在每次进行数据请求的过程中设置缓冲动画
  Toast.loading({
    message: '加载中...',
    forbidClick: true,
    loadingType: 'spinner'
  })
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})
~~~



2、响应拦截器：

在每次axios请求后，返回的响应数据都会经过该拦截器

在本项目中核心操作就是每次响应不是200，就是用Toast提示错误

~~~js
// 添加响应拦截器
instance.interceptors.response.use(function (response) {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
  const res = response.data
  if (res.status !== 200) {
    Toast(res.message)// 一般都是这样提醒错误，后端会定义好，不然每个错误都要自定义，难以维护并且繁琐
    // 返回Promise.reject的关键就是 await只能接受Promise.resolve，现在响应状态码只要不是200，就直接返回Promise.reject，相当于提前拦截了
    return Promise.reject(res.message)
  }
  Toast.clear()
  return res
}, function (error) {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  return Promise.reject(error)
})
~~~



## 1.9路由守卫

在每次进行路由跳转时都会执行下面程序，因为订单页、支付页、钱包页与个人登录强相关，假如user没有登录，进入这些页面也没有意义，所以就判断当未登录时，user对这些页面进行路由跳转时，拦截跳转并跳转到登录页/login

~~~js
const nextlist = ['/myorder', '/pay', '/purse']
router.beforeEach((to, from, next) => {
  if (!nextlist.includes(to.path)) {
    next()
    return
  }
  if (store.getters['user/token']) {
    next()
    return
  }
  next('/login')
  Toast('请登录后查看')
})
~~~



# **2.** **详解各个页面**

## **layout****首页及其四个路由导航**

 首页主页面是layout文件夹下的index.vue页面，使用vant-tabbar组件进行路由跳转，且跳转渲染的组件使用router-view元素接受
 两点注意：
 1、点击不同路由标签实现跳转，采用的是vant-tabber封装好的声明式跳转，但是使用v-model绑定的不是data中的active了。采用computed计算属性get获取vuex仓库中**active**值\set**更改vuex中active值**

~~~js
computed: {
    active: {
      get () {
        return this.$store.state.tabbarActive.active
      },
      set (value) {
        this.$store.commit('tabbarActive/changeActive', value)
      }
    }
  }
~~~



 2、从各个页面点击跳转（函数式跳转）如何控制active值：
   使用vuex仓库建立tabbarActive模块存放active状态，设立changeActive函数更改active值（借助此函数对导航栏高亮状态进行更改）

总共跳转到首页导航的步骤 --- 
1、/home页从grid导航跳转/categroy页

2、/productdetail页从cart购物车图标跳转到/cart页

下面以/home -->/category页为例

~~~js
...mapMutations('tabbarActive', ['changeActive'])
this.changeActive(1)
~~~

 

### home

首页的首页😁😁😁：
 在API文件夹中封装get方法，从后台获取页面数据渲染 --- 轮播图使用vant-swiper组件，棋盘格导航使用vant-grid组件，“猜你喜欢”使用自定义组件 --- GoodItem.vue，并使用组件通信 --- **props & $emit** 对其进行数据响应，注意点

 

### category

商品分类页：
 同样在API界面封装**request.get**方法获取页面数据方法 --- 获取整体页面、get但是传递query参数方法（点击实例商品进行路由跳转 --- 到达对应的商品搜索列表页）
注意点：
	**点击左侧导航 --- >右边商品栏进行变换**
核心原理：在页面结构渲染之前 （created生命周期钩子时）进行数据请求 --- request.get(xxx)，并在data中赋值给给定义好的列表（存储在内存中）并再声明一个goods空列表存储每次渲染的商品数据。开始默认渲染第一个商品导航，之后渲染时点击哪个导航标签，就把哪个导航的商品数据列表赋值给goods（v-for又是响应式驱动，每当goods改变，数据也会随之改变）

### cart（见下面购物车数据）

### user

这个也没什么好说的 --- 里面所有小按钮都只是一个路由跳转而已，但是大部分需要登陆验证 ---

此时之前存储在vuex仓库中的user.js数据起到作用了
~~~js
 // 比如说登录 --- 如果没有查询到用户Token信息，强制登录
    login () {
      if (!this.$store.getters['user/token']) {
        this.$router.replace('/login')
      }
    },
~~~



注意：上面代码有一个小细节路由跳转不使用$router.push(xxx) 而使用 --- $router.replace(xxx),

是因为在vue中页面历史被设置为一个  history栈，遵循先进后出原则，每次使用$router.push()都是在增加历史栈的元素，但是此时是user未登录，想要浏览应该登录，所以登录之后就不应该看到之前没登陆的页面，所以使用replace将其替换



还有个注意点 --- 将重复使用的代码进一步封装，让其可以在该项目的各个组件中都能使用

minxins混入（相当于高级函数封装）

~~~js
logincomfirm () {
      if (!this.$store.getters['user/token']) {
        Dialog.confirm({
          title: '温馨提示',
          message: '此时此刻需要您先登录哦',
          confirmButtonText: '去登陆',
          cancelButtonText: '再逛会'
        })
          // 确认按钮 --- 此处就是对应着 去登陆
          .then(() => {
            // 那么现在没有登录就是要跳转登陆页面登录
            // 这里有个小注意点 --- 这里跳转不要用 $router.push() ; 而是要用$router.replace()，$router.replace() 是将当前页面出 history栈 然后将目标页面压入栈中（相当于栈的长度不变，但是栈顶的元素变了）
            // 这是因为 $router.push(目标路由)就是将当前页面压入 history历史栈 中，再去目标页面，然后在目标页面带你返回也可以回到之前的页面
            // 但是这里不需要这样，为了用户体验考虑，这里跳转到登录页面肯定是要买东西（从购物车跳转的嘛），而商品详情页是从商品分类页或者首页商品列表跳转而来，
            // 在登录之后肯定是想直接加入购物车，但是push会将登录页也加入历史，那么在用户回到商品详情页时再返回就返回到了登录页，再返回才是商品分类页或者商品列表（严重影响体验）
            this.$router.replace({
              path: '/login',
              query: {
              // 此处就是将该页面的url传递给登录页面，然后当登录完成 再跳转到本页面
                backUrl: this.$route.fullPath
              }
            })
          })
          // 取消按钮 --- 此处就是对应着 再逛会 --- 此时既然是取消，就不必再做什么
          .catch(() => {})
      }
    }
~~~





这里很多地方利用计算属性 --- 

eg:登录名
~~~js
 nikeName () {
      if (this.islogin) {
        return this.userInfo.nick_name
      }
      return '未登录'
    }
~~~



## **登录页验证**

登录页的页面是一个很经典的表单提交界面 --- 值得细细揣摩

注意点1：在短信验证码发送时有个“30s之后重新发送”，此处我使用了**“节流”** --- 防止一直给服务器发送请求，减轻服务器压力。在data中设置一个初始开关flag = true，以flag为判断条件，true才能执行之后操作，当点击按钮后将flag值赋值为false，当倒计时完毕（数字===0了）flag再赋值为true。
注意点2：**倒计时功能实现**，点击按钮之后，使用setInterval(()=>{xxx},1000)让数字每隔1s减1，再利用vue的数据响应式，实现数字倒计时。

注意点3：假如用户在等待短信验证码发送过来的时间段离开了该页面，浏览其他页面，应该关闭倒计时等一切还在运行的程序（节约性能）在destroyed生命周期钩子中结束计时器

~~~js
destroyed () {
    clearInterval(this.VerifyCount)
  }
~~~



剩下就是一些数据的验证，一般数据的格式采用正则表达式去验证，数据的准确是后端人员进行验证。
 1、获取图形验证码 --- get方法
 2、获取短信验证码 --- post方法（获取前提 --- 在手机号输入格式无误&&图片验证码格式无误&&后台验证图片输入验证码无误）
 3、提交手机号码表单表单

 

## **搜索页 & 搜索列表页**

搜索详情页：
 获取商品名传给后端数据库进行搜索 --- get方法，但是需要在parms中传入商品名、商品ID（这个在这里搜索导航没用但在**分类页跳转**有用）等query参数。其中搜索详情页中也存在一个小导航 --- 综合、销量、价格高到低、价格低到高
 这里的数据获取时我采用的措施是**一次性获取所有搜索数据**，然后**分类赋值给data中的各个定义好的列表。**
 注意：这里我**没有使用路由或者每换一个导航就进行数据请求**的方式是因为用户搜索商品**每次数据都固定**（三个导航只是将商品顺序换一下而已），所以没必要每次都进行数据请求，一次性获取数据存储本地点击不同导航渲染不同数据会有更加流畅的用户体验，减少了服务器请求次数，但是初始页面会有点慢（因为相当于首页渲染一次性请求了4倍数据）

 

## **商品详情页**

商品详情页：
 进入商品详情页的方式有三种 --- 
 1、搜索进入搜索列表页，从特定商品进入。 --- 使用自定义函数跳转和query查询参数传参
 skipfn(){this.$router.push({path: ‘xxx’, query: { xxx: xxx }})}

2、首页“猜你喜欢”商品栏点击跳转(这个和1一样，不一样的是1是搜索到列表再点击特定商品跳转 --- 其核心逻辑还是从后台数据中获取goods_id，然后跳转商品详情页，基于goods_id再从后台获取数据渲染整个页面)

3、从商品分类页面进入

注意点1：代码混入 --- minxins --- 里面的logincomfirm.js程序封装了logincomfirm登陆验证函数，并且其中二次封装了vant组件 --- Dialog异步确认取消组件，让用户自己选择登录 or 取消，并且会将本页面中全部信息进行函数式跳转，即先登录，登陆完毕再进行路由跳转，至于跳转的路径就是之前未登录浏览的商品详情页

~~~js
 this.$router.replace({
    path: '/login',
    query: {
// 此处就是将该页面的url传递给登录页面，然后当登录完成 再跳转到本页面
   backUrl: this.$route.fullPath
    }
})
~~~



 

## **购物车页**

注意点1：将购物车数据存入vuex仓库中 --- 因为cart中数据的变动及其频繁，假如每次都进行数据请求获取数据更改数据，对网络、服务器压力较大，要求较高；假如使用LocalStorage存储本地，每次获取数据都从硬盘读取调用，性能较差，而vuex仓库数据直接从内存读取，响应迅速

注意点2：商品的全选 --- 反选。

核心逻辑：大控小，小控大。

大控小即 ，在进行数据请求时将数据传给vuex仓库时新增ischeck属性并赋值true（注意，这里复选框使用vant组件van-checkbox）点击全选按键（:value="isCheckAll"）

在vuex仓库中对所有购物车元素 --- item的ischeck属性取全选按钮的反值

~~~js
// 实现点击全选复选框控制所有小复选框
    toggleCheckAll (state, tempflag) {
      // console.log(tempflag)
      state.cartlist.forEach(item => {
        item.isCheck = !tempflag
      })
    }
~~~



小控大：
因为在vuex仓库中存储着购物车商品列表，那么在vuex仓库模块cart.js中定义getters计算属性isCheckAll

~~~js
// 实现点击小复选框控制全选按钮
isCheckAll (state) {
      const tempflag = state.cartlist.every(item => (item.isCheck === true))
      return tempflag
}
~~~

核心逻辑就是遍历购物车商品列表的isCheck属性是不是都为true，这里使用array.every(()=>{})直接返回判断的true和false，最后直接返回这个值（true/false）导入到cart.vue中当作全选按钮的属性值:value="isCheckAll"，依赖于vue的响应属性，实现了小控大。

注意点2：自定义数字框的使用 ：

核心点：组件通信props&$emit，具体查阅上文Components组件

注意点3：后台数据更新（一些商品数量更新）后，直接再拉取一份数据更新vuex中数据，从而更新页面数据

注意点4：删除商品 --- 核心逻辑：将在上一次的商品cartid中进行筛选 --- 返回那些还留着的商品的ID，再进行数据请求拉取新数据。

~~~ js
// 删除购物车选中的商品
    async deleteCartGoods (context) {
      // 先获取那些 isCheck已经是true的商品，然后直接用array.map函数返回只带有商品ID的 新数组 --- 奶奶滴，API文档也不写清楚，这个参数就是ID，我还以为是商品ID，搞得我排查半天错误🤮🤮🤮
      const cartIds = context.getters.isCheckGoodList.map(item => item.id)
      // 更新后台数据，同样也没有返回值
      await deleteCartGoods(cartIds)
      // 所以，对于vuex仓库的数据，就重新请求一遍后台进行更新
      context.dispatch('getCartList')
    }
~~~



注意点5：在用户购买购物车商品列表时，尽量全选，因为我们希望user尽可能多的购买商品；在删除购物车元素时，尽量全不选，在删除完成时还要弹出确认框询问user是否真的删除，尽量阻拦用户删除。

注意点6：尽量使用计算属性返回商品各个属性 --- 比如各个商品总数、各个商品总价、选中的商品总数、选中的商品总结等



 

## **支付页**

 

## **订单页**

 

# **3.**  

 

 