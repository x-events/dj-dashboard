export const store = {
    debug: true,
    state: {
        siteTitle:"党建可视化",
        menu: [],               // 导航菜单
        user: {},               // 用户信息
        isCollapse: false,      // 菜单收起状态 
    },
    set(key, newValue) {
        if(this.state[key]!==void(0)){
            this.state[key] = newValue;

            this.debug && console.log(`store update: ${key} =>`,  this.state[key])
        }else{
            console.warn(`this key [${key}] is not register in store!`)
        }
    }
}