<template>
 <div class="w-100 order flex-col h-100" style="overflow-x:hidden;">
    <el-row :gutter="20">
        <el-col :span="6">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>角色</span>
                </div>
                <el-radio-group v-model="roleCheck" @change="init">
                    <div class="text item" v-for="item in roleList" :key="item.id">
                        <el-radio :label="item.id">{{item.name}}</el-radio>
                    </div>
                </el-radio-group>
            </el-card>
        </el-col>
        <el-col :span="17">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>权限</span>
                </div>
                
                <el-checkbox-group v-model="list">
                    <div v-for="item in authGroupList" :key="item.authGroup" style="padding-top:10px;">
                        <div class="title">{{item.authGroupName}}</div>
                        <div class="sel">
                            <el-checkbox :label="v.authItem" v-for="v in item.authItemList" :key="v.authItem">{{v.authItemName}}</el-checkbox>
                        </div>
                    </div>
                </el-checkbox-group>

                <div style="height: 100px;text-align:center;">
                    <el-button type="success" @click="saveAuth">保存</el-button>
                </div>
            </el-card>
        </el-col>
    </el-row>
</div>
</template>

<script>
import { getRoleAuth,saveAuth } from "../../request/api.js";

export default {
  data() {
    return {
        roleCheck: 1,
        roleList: [
            {
                id: 1,
                name: '老板'
            },
            {
                id: 2,
                name: '前台收银员'
            },
            {
                id: 3,
                name: '仓储采购 财务'
            },
            {
                id: 4,
                name: '施工员'
            },
            {
                id: 5,
                name: '客服业务'
            }
        ],
        authGroupLists: [
            {
                authGroup: 1,
                authGroupName: '客户资料',
                authItemList: [
                    {
                        authItem: 1,
                        authItemName: '隐藏手机号'
                    },
                    {
                        authItem: 2,
                        authItemName: '禁止修改客户资料'
                    }
                ]
            },
            {
                authGroup: 2,
                authGroupName: '会员管理',
                authItemList: [
                    {
                        authItem: 3,
                        authItemName: '设置活动'
                    },
                    {
                        authItem: 4,
                        authItemName: '修改会员等级'
                    },
                    {
                        authItem: 5,
                        authItemName: '赠送优惠券'
                    },
                    {
                        authItem: 6,
                        authItemName: '设置套餐'
                    }
                ]
            },
            {
                authGroup: 3,
                authGroupName: '开单',
                authItemList: [
                    {
                        authItem: 7,
                        authItemName: '新增服务项目'
                    },
                    {
                        authItem: 8,
                        authItemName: '修改车牌号'
                    },
                    {
                        authItem: 9,
                        authItemName: '是否可以修改时间'
                    },
                    {
                        authItem: 10,
                        authItemName: '修改项目，配件'
                    }
                ]
            },
            {
                authGroup: 4,
                authGroupName: '配件管理',
                authItemList: [
                    {
                        authItem: 11,
                        authItemName: '隐藏成本'
                    },
                    {
                        authItem: 12,
                        authItemName: '修改库存信息'
                    },
                    {
                        authItem: 13,
                        authItemName: '出入库操作'
                    },
                    {
                        authItem: 14,
                        authItemName: '询价'
                    }
                ]
            },
            {
                authGroup: 5,
                authGroupName: '收银',
                authItemList: [
                    {
                        authItem: 15,
                        authItemName: '可结算'
                    },
                    {
                        authItem: 16,
                        authItemName: '结算'
                    },
                    {
                        authItem: 17,
                        authItemName: '反结算'
                    },
                    {
                        authItem: 18,
                        authItemName: '是否可优惠'
                    }
                ]
            },
            {
                authGroup: 6,
                authGroupName: '财务',
                authItemList: [
                    {
                        authItem: 19,
                        authItemName: '隐藏成本，毛利'
                    }
                ]
            },
            {
                authGroup: 7,
                authGroupName: '员工管理',
                authItemList: [
                    {
                        authItem: 20,
                        authItemName: '设置员工'
                    }
                ]
            },
            {
                authGroup: 8,
                authGroupName: 'PC端',
                authItemList: [
                    {
                        authItem: 21,
                        authItemName: '可登录'
                    }
                ]
            }

        ],
        authGroupList: [
            {
                authGroup: 1,
                authGroupName: '客户资料',
                authItemList: [
                    {
                        authItem: 1,
                        authItemName: '隐藏手机号'
                    },
                    {
                        authItem: 2,
                        authItemName: '禁止修改客户资料'
                    }
                ]
            },
            {
                authGroup: 2,
                authGroupName: '会员管理',
                authItemList: [
                    {
                        authItem: 3,
                        authItemName: '设置活动'
                    },
                    {
                        authItem: 4,
                        authItemName: '修改会员等级'
                    },
                    {
                        authItem: 5,
                        authItemName: '赠送优惠券'
                    },
                    {
                        authItem: 6,
                        authItemName: '设置套餐'
                    }
                ]
            },
            {
                authGroup: 3,
                authGroupName: '开单',
                authItemList: [
                    {
                        authItem: 7,
                        authItemName: '新增服务项目'
                    },
                    {
                        authItem: 8,
                        authItemName: '修改车牌号'
                    },
                    {
                        authItem: 9,
                        authItemName: '是否可以修改时间'
                    },
                    {
                        authItem: 10,
                        authItemName: '修改项目，配件'
                    }
                ]
            },
            {
                authGroup: 4,
                authGroupName: '配件管理',
                authItemList: [
                    {
                        authItem: 11,
                        authItemName: '隐藏成本'
                    },
                    {
                        authItem: 12,
                        authItemName: '修改库存信息'
                    },
                    {
                        authItem: 13,
                        authItemName: '出入库操作'
                    },
                    {
                        authItem: 14,
                        authItemName: '询价'
                    }
                ]
            },
            {
                authGroup: 5,
                authGroupName: '收银',
                authItemList: [
                    {
                        authItem: 15,
                        authItemName: '可结算'
                    },
                    {
                        authItem: 16,
                        authItemName: '结算'
                    },
                    {
                        authItem: 17,
                        authItemName: '反结算'
                    },
                    {
                        authItem: 18,
                        authItemName: '是否可优惠'
                    }
                ]
            },
            {
                authGroup: 6,
                authGroupName: '财务',
                authItemList: [
                    {
                        authItem: 19,
                        authItemName: '隐藏成本，毛利'
                    }
                ]
            },
            {
                authGroup: 7,
                authGroupName: '员工管理',
                authItemList: [
                    {
                        authItem: 20,
                        authItemName: '设置员工'
                    }
                ]
            },
            {
                authGroup: 8,
                authGroupName: 'PC端',
                authItemList: [
                    {
                        authItem: 21,
                        authItemName: '可登录'
                    }
                ]
            }

        ],
        list: []
    }
  },
  created() {
      this.init()
  },
  methods: {
    init() {
        getRoleAuth({role: parseInt(this.roleCheck)}).then(res => {
            const data = res.data.data.authGroupList
            const authGroup = data.map(v => v.authGroup)
            let authItem = []
            data.forEach(v => {
                v.authItemList.forEach(k => {
                    authItem.push(k.authItem)
                })
            })
            this.list = authItem
        })
    },
    saveAuth() {
        const data = {
            role: this.roleCheck,
            authGroupList: []
        }
        let role = this.roleList.find(v => v.id === this.roleCheck)
        data.roleName = role.name
        this.authGroupList.forEach(item => {
            let at = {
                authGroup: item.authGroup,
                authGroupName: item.authGroupName,
                authItemList: []
            }
            item.authItemList.forEach(v => {
                if(this.list.includes(v.authItem)) {
                    at.authItemList.push(v)
                }
            })
            if(at.authItemList.length > 0)data.authGroupList.push(at)
        })
        saveAuth(data).then(res => {
            this.$message({
                type: 'success',
                message: '保存成功'
            })
        }).catch(err => console.log(err))
    }
  }
};
</script>

<style scoped>
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
  .title{
    font-size:17px;
  }
  .sel{
    padding: 10px 0px 0px 70px;
  }
</style>