import Vue from 'vue'
import Router from 'vue-router'
import CssClear from '@/page/toll/cssClear'
import notFound from '@/page/default/404'
Vue.use(Router)
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
//首页管理
import home from '@/page/home/home'
import page from '@/page/home/page'
import formPage from '@/page/home/formPage'
import formPageB from '@/page/home/formPageB'
import formPageB_A from '@/page/home/formPageB_A'
import formPageB_B from '@/page/home/formPageB_B'
import formA from '@/page/home/formA'
import formB from '@/page/home/formB'
import formC from '@/page/home/formC'
import formD from '@/page/home/formD'
import formE from '@/page/home/formE'
import formF from '@/page/home/formF'
import formG from '@/page/home/formG'
import formH from '@/page/home/formH'
import formI from '@/page/home/formI'
import formJ from '@/page/home/formJ'
import formK from '@/page/home/formK'
import formL from '@/page/home/formL'
import order from '@/page/home/order'
import orderX from '@/page/home/orderX'
import print from '@/page/home/print'
import damagePrint from '@/page/home/damagePrint'
import orderPrint from '@/page/home/orderPrint'
import filePrint from '@/page/home/filePrint'
import setting from '@/page/home/setting'
import role from '@/page/home/role'
import qrcode from '@/page/home/qrcode'
import project_setting from '@/page/home/project_setting'
import parts_setting from '@/page/home/parts_setting'
import royalty_setting from '@/page/home/royalty_setting'
import parts from '@/page/home/parts'
import stock from '@/page/home/stock'
import out_stock from '@/page/home/out_stock'
import in_stock from '@/page/home/in_stock'
import stock_order from '@/page/home/stock_order'
import stock_enquiry from '@/page/home/stock_enquiry'
import supplier from '@/page/home/supplier'


import login from '@/page/login/login'



export default new Router({
  // mode:'history',
  routes: [
    // 缺省==============================
    {
      path: '*',
      name: 'notFound',
      component: notFound,
      meta: {
        title: '404',
        index: 5,
        animation: 'rotateIn'
      }
    },
    {
      path: '/toll/cssClear',
      name: 'CssClear',
      component: CssClear,
      meta: {
        title: 'css工具',
        index: 1
      }
    },
    // 登录注册==============================

    // 首页管理==============================
    
    {
      path: '/',
      name: 'home',
      component: home,
      meta: {
        title: '易车驹',
        index: 0
      },
      children: [{
          path: '/',
          name: 'page',
          component: page,
          meta: {
            title: '易车驹',
            index: 0
          }
        },
        {
          path: '/home/formPage',
          name: 'formPage',
          component: formPage,
          meta: {
            title: '易车驹',
            index: 0
          },
          children: [{
            path: '/',
            name: 'formA',
            component: formA,
            meta: {
              title: '易车驹',
              index: 0
            }
          }, {
            path: '/home/formB',
            name: 'formB',
            component: formB,
            meta: {
              title: '易车驹',
              index: 0
            }
          }, {
            path: '/home/formC',
            name: 'formC',
            component: formC,
            meta: {
              title: '易车驹',
              index: 0
            }
          }, {
            path: '/home/formD',
            name: 'formD',
            component: formD,
            meta: {
              title: '易车驹',
              index: 0
            }
          }, {
            path: '/home/formE',
            name: 'formE',
            component: formE,
            meta: {
              title: '易车驹',
              index: 0
            }
          }, {
            path: '/home/formF',
            name: 'formF',
            component: formF,
            meta: {
              title: '易车驹',
              index: 0
            }
          }, {
            path: '/home/formG',
            name: 'formG',
            component: formG,
            meta: {
              title: '易车驹',
              index: 0
            }
          }, {
            path: '/home/formH',
            name: 'formH',
            component: formH,
            meta: {
              title: '易车驹',
              index: 0
            }
          }, {
            path: '/home/formI',
            name: 'formI',
            component: formI,
            meta: {
              title: '易车驹',
              index: 0
            }
          }, {
            path: '/home/formJ',
            name: 'formJ',
            component: formJ,
            meta: {
              title: '易车驹',
              index: 0
            }
          }, {
            path: '/home/formK',
            name: 'formK',
            component: formK,
            meta: {
              title: '易车驹',
              index: 0
            }
          }, {
            path: '/home/formL',
            name: 'formL',
            component: formL,
            meta: {
              title: '易车驹',
              index: 0
            }
          }]
        },
        {
          path: '/home/formPageB',
          name: 'formPageB',
          component: formPageB,
          meta: {
            title: '易车驹',
            index: 0
          },
          children: [{
            path: '/',
            name: 'formPageB_A',
            component: formPageB_A,
            meta: {
              title: '易车驹',
              index: 0
            }
          }, {
            path: '/home/formPageB_B',
            name: 'formPageB_B',
            component: formPageB_B,
            meta: {
              title: '易车驹',
              index: 0
            }
          }]
        },
        {
          path: '/home/order',
          name: 'order',
          component: order,
          meta: {
            title: '易车驹',
            index: 0
          }
        },
        {
          path: '/home/orderX',
          name: 'orderX',
          component: orderX,
          meta: {
            title: '易车驹',
            index: 1
          }
        },
        {
          path: '/home/setting',
          name: 'setting',
          component: setting,
          meta: {
            title: '易车驹',
            index: 0
          },
          children: [
            {
              path: '/home/role',
              name: 'role',
              component: role,
              meta: {
                title: '易车驹',
                index: 0
              }
            },
            {
              path: '/home/qrcode',
              name: 'qrcode',
              component: qrcode,
              meta: {
                title: '易车驹',
                index: 0
              }
            },
            {
              path: '/home/project_setting',
              name: 'project_setting',
              component: project_setting,
              meta: {
                title: '易车驹',
                index: 0
              }
            },
            {
              path: '/home/parts_setting',
              name: 'parts_setting',
              component: parts_setting,
              meta: {
                title: '易车驹',
                index: 0
              }
            },
            {
              path: '/home/royalty_setting',
              name: 'royalty_setting',
              component: royalty_setting,
              meta: {
                title: '易车驹',
                index: 0
              }
            }
          ]
        },
        {
          path: '/home/parts',
          name: 'parts',
          component: parts,
          meta: {
            title: '易车驹',
            index: 0
          },
          children: [
            {
              path: '/home/stock',
              name: 'stock',
              component: stock,
              meta: {
                title: '易车驹',
                index: 0
              }
            },
            {
              path: '/home/out_stock',
              name: 'out_stock',
              component: out_stock,
              meta: {
                title: '易车驹',
                index: 0
              }
            },
            {
              path: '/home/in_stock',
              name: 'in_stock',
              component: in_stock,
              meta: {
                title: '易车驹',
                index: 0
              }
            }, {
              path: '/home/stock_enquiry',
              name: 'stock_enquiry',
              component: stock_enquiry,
              meta: {
                title: '易车驹',
                index: 0
              }
            },
            {
              path: '/home/stock_order',
              name: 'stock_order',
              component: stock_order,
              meta: {
                title: '易车驹',
                index: 0
              }
            },
            {
              path: '/home/supplier',
              name: 'supplier',
              component: supplier,
              meta: {
                title: '易车驹',
                index: 0
              }
            }
          ]
        },
      ],
    },
    {
      path: '/login/login',
      name: 'login',
      component: login,
      meta: {
        title: '易车驹',
        index: 0
      }
    },
    {
      path: '/home/print',
      name: 'print',
      component: print,
      meta: {
        title: '打印结算单',
        index: 1
      }
    },
    {
      path: '/home/damagePrint',
      name: 'damagePrint',
      component: damagePrint,
      meta: {
        title: '定损单打印',
        index: 1
      }
    },
    {
      path: '/home/orderPrint',
      name: 'orderPrint',
      component: orderPrint,
      meta: {
        title: '打印派工单',
        index: 1
      }
    },
    {
      path: '/home/filePrint',
      name: 'filePrint',
      component: filePrint,
      meta: {
        title: '打印附件',
        index: 1
      }
    }







  ]
})
