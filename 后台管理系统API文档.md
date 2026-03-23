# 后台管理系统 API 文档

## 1. 基础信息

- **API 基础路径**: `/api/admin`
- **认证方式**: JWT Token (Bearer Token)
- **响应格式**: JSON
- **错误处理**: 统一返回错误码和错误信息

## 2. 认证接口

### 2.1 管理员登录

**接口地址**: `/api/admin/login`
**请求方法**: POST

**请求参数**:
| 参数名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| username | string | 是 | 用户名 |
| password | string | 是 | 密码 |

**响应格式**:

成功:

```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "avatar": "https://avatars.githubusercontent.com/u/44761321",
    "username": "admin",
    "nickname": "admin",
    "roles": ["admin"],
    "permissions": ["*:*:*"],
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expires": "2024/03/17 14:30:00"
  }
}
```

失败:

```json
{
  "code": 401,
  "message": "用户名或密码错误",
  "data": null
}
```

**响应字段说明**:

| 字段名            | 类型   | 描述                |
| ----------------- | ------ | ------------------- |
| code              | number | 状态码，200表示成功 |
| message           | string | 响应消息            |
| data.avatar       | string | 用户头像URL         |
| data.username     | string | 用户名              |
| data.nickname     | string | 用户昵称            |
| data.roles        | array  | 用户角色数组        |
| data.permissions  | array  | 用户权限数组        |
| data.accessToken  | string | 访问令牌            |
| data.refreshToken | string | 刷新令牌            |
| data.expires      | string | 令牌过期时间        |

**角色权限对应表**:

| 角色    | 权限数组                         | 说明               |
| ------- | -------------------------------- | ------------------ |
| admin   | `["*:*:*"]`                      | 管理员拥有所有权限 |
| kitchen | `["order:view", "order:update"]` | 后厨权限           |

## 3. 店铺管理

### 3.1 获取店铺信息

**接口地址**: `/api/admin/shop`
**请求方法**: GET
**认证**: 需要

**响应格式**:

成功:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "_id": "店铺ID",
    "name": "店铺名称",
    "phone": "联系电话",
    "notice": "店铺公告",
    "status": true,
    "createdAt": "创建时间"
  }
}
```

### 3.2 更新店铺信息

**接口地址**: `/api/admin/shop`
**请求方法**: PUT
**认证**: 需要

**请求参数**:
| 参数名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| name | string | 否 | 店铺名称 |
| phone | string | 否 | 联系电话 |
| notice | string | 否 | 店铺公告 |
| status | boolean | 否 | 店铺状态 |

**响应格式**:

成功:

```json
{
  "code": 200,
  "message": "更新成功",
  "data": {
    "_id": "店铺ID",
    "name": "店铺名称",
    "phone": "联系电话",
    "notice": "店铺公告",
    "status": true,
    "createdAt": "创建时间"
  }
}
```

## 4. 菜品分类管理

### 4.1 获取菜品分类列表

**接口地址**: `/api/admin/categories`
**请求方法**: GET
**认证**: 需要

**响应格式**:

成功:

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "_id": "分类ID",
      "shop": "店铺ID",
      "name": "分类名称",
      "sort": 10,
      "status": true,
      "createdAt": "创建时间"
    }
  ]
}
```

### 4.2 创建菜品分类

**接口地址**: `/api/admin/categories`
**请求方法**: POST
**认证**: 需要

**请求参数**:
| 参数名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| name | string | 是 | 分类名称 |
| sort | number | 否 | 排序权重 |

**响应格式**:

成功:

```json
{
  "code": 200,
  "message": "创建成功",
  "data": {
    "_id": "分类ID",
    "shop": "店铺ID",
    "name": "分类名称",
    "sort": 10,
    "status": true,
    "createdAt": "创建时间"
  }
}
```

### 4.3 更新菜品分类

**接口地址**: `/api/admin/categories/:id`
**请求方法**: PUT
**认证**: 需要

**请求参数**:
| 参数名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| name | string | 否 | 分类名称 |
| sort | number | 否 | 排序权重 |
| status | boolean | 否 | 分类状态 |

**响应格式**:

成功:

```json
{
  "code": 200,
  "message": "更新成功",
  "data": {
    "_id": "分类ID",
    "shop": "店铺ID",
    "name": "分类名称",
    "sort": 10,
    "status": true,
    "createdAt": "创建时间"
  }
}
```

### 4.4 删除菜品分类

**接口地址**: `/api/admin/categories/:id`
**请求方法**: DELETE
**认证**: 需要

**响应格式**:

成功:

```json
{
  "code": 200,
  "message": "删除成功",
  "data": null
}
```

失败（分类下有菜品）:

```json
{
  "code": 400,
  "message": "该分类下还有菜品，无法删除",
  "data": null
}
```

## 5. 菜品管理

### 5.1 获取菜品列表

**接口地址**: `/api/admin/dishes`
**请求方法**: GET
**认证**: 需要

**查询参数**:
| 参数名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| categoryId | string | 否 | 分类 ID |
| keyword | string | 否 | 搜索关键词 |
| page | number | 否 | 页码，默认 1 |
| pageSize | number | 否 | 每页数量，默认 10 |

**响应格式**:

成功:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "_id": "菜品ID",
        "shop": "店铺ID",
        "category": {
          "_id": "分类ID",
          "name": "分类名称"
        },
        "name": "菜品名称",
        "price": 28.8,
        "image": "图片URL",
        "stock": -1,
        "status": true,
        "sort": 10,
        "createdAt": "创建时间"
      }
    ],
    "total": 100,
    "page": 1,
    "pageSize": 10
  }
}
```

### 5.2 创建菜品

**接口地址**: `/api/admin/dishes`
**请求方法**: POST
**认证**: 需要

**请求参数**:
| 参数名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| name | string | 是 | 菜品名称 |
| price | number | 是 | 菜品价格 |
| image | string | 否 | 图片 URL |
| categoryId | string | 是 | 分类 ID |
| stock | number | 否 | 库存，默认-1（无限库存） |
| sort | number | 否 | 排序权重，默认 0 |

**响应格式**:

成功:

```json
{
  "code": 200,
  "message": "创建成功",
  "data": {
    "_id": "菜品ID",
    "shop": "店铺ID",
    "category": "分类ID",
    "name": "菜品名称",
    "price": 28.8,
    "image": "图片URL",
    "stock": -1,
    "status": true,
    "sort": 0,
    "createdAt": "创建时间"
  }
}
```

### 5.3 更新菜品

**接口地址**: `/api/admin/dishes/:id`
**请求方法**: PUT
**认证**: 需要

**请求参数**:
| 参数名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| name | string | 否 | 菜品名称 |
| price | number | 否 | 菜品价格 |
| image | string | 否 | 图片 URL |
| categoryId | string | 否 | 分类 ID |
| stock | number | 否 | 库存 |
| status | boolean | 否 | 菜品状态 |
| sort | number | 否 | 排序权重 |

**响应格式**:

成功:

```json
{
  "code": 200,
  "message": "更新成功",
  "data": {
    "_id": "菜品ID",
    "shop": "店铺ID",
    "category": "分类ID",
    "name": "菜品名称",
    "price": 28.8,
    "image": "图片URL",
    "stock": -1,
    "status": true,
    "sort": 10,
    "createdAt": "创建时间"
  }
}
```

### 5.4 删除菜品

**接口地址**: `/api/admin/dishes/:id`
**请求方法**: DELETE
**认证**: 需要

**响应格式**:

成功:

```json
{
  "code": 200,
  "message": "删除成功",
  "data": null
}
```

## 6. 桌台管理

### 6.1 获取桌台列表

**接口地址**: `/api/admin/tables`
**请求方法**: GET
**认证**: 需要

**响应格式**:

成功:

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "_id": "桌台ID",
      "shop": "店铺ID",
      "tableNo": "A1",
      "tableType": "大厅",
      "status": "空闲",
      "qrCode": "二维码URL",
      "createdAt": "创建时间"
    }
  ]
}
```

### 6.2 创建桌台

**接口地址**: `/api/admin/tables`
**请求方法**: POST
**认证**: 需要

**请求参数**:
| 参数名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| tableNo | string | 是 | 桌号 |
| tableType | string | 否 | 桌台类型，默认"大厅" |

**响应格式**:

成功:

```json
{
  "code": 200,
  "message": "创建成功",
  "data": {
    "_id": "桌台ID",
    "shop": "店铺ID",
    "tableNo": "A1",
    "tableType": "大厅",
    "status": "空闲",
    "qrCode": "二维码URL",
    "createdAt": "创建时间"
  }
}
```

失败（桌号已存在）:

```json
{
  "code": 400,
  "message": "桌号已存在",
  "data": null
}
```

### 6.3 更新桌台

**接口地址**: `/api/admin/tables/:id`
**请求方法**: PUT
**认证**: 需要

**请求参数**:
| 参数名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| tableNo | string | 否 | 桌号 |
| tableType | string | 否 | 桌台类型 |

**响应格式**:

成功:

```json
{
  "code": 200,
  "message": "更新成功",
  "data": {
    "_id": "桌台ID",
    "shop": "店铺ID",
    "tableNo": "A1",
    "tableType": "大厅",
    "status": "空闲",
    "qrCode": "二维码URL",
    "createdAt": "创建时间"
  }
}
```

### 6.4 删除桌台

**接口地址**: `/api/admin/tables/:id`
**请求方法**: DELETE
**认证**: 需要

**响应格式**:

成功:

```json
{
  "code": 200,
  "message": "删除成功",
  "data": null
}
```

失败（有未完成订单）:

```json
{
  "code": 400,
  "message": "该桌台还有未完成的订单，无法删除",
  "data": null
}
```

## 7. 订单管理

### 7.1 获取订单列表

**接口地址**: `/api/admin/orders`
**请求方法**: GET
**认证**: 需要

**查询参数**:
| 参数名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| orderStatus | number | 否 | 订单状态 |
| tableNo | string | 否 | 桌号 |
| page | number | 否 | 页码，默认 1 |
| pageSize | number | 否 | 每页数量，默认 10 |

**响应格式**:

成功:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "_id": "订单ID",
        "orderNo": "订单号",
        "shop": "店铺ID",
        "user": "用户ID",
        "table": "桌台ID",
        "tableNo": "A1",
        "items": [
          {
            "dish": "菜品ID",
            "dishName": "菜品名称",
            "price": 28.8,
            "num": 1,
            "remark": "备注"
          }
        ],
        "totalAmount": 28.8,
        "payStatus": 0,
        "orderStatus": 0,
        "payType": "微信支付",
        "payAt": "支付时间",
        "servedAt": "接单时间",
        "completedAt": "完成时间",
        "remark": "订单备注",
        "createdAt": "创建时间"
      }
    ],
    "total": 100,
    "page": 1,
    "pageSize": 10
  }
}
```

### 7.2 获取订单详情

**接口地址**: `/api/admin/orders/:orderNo`
**请求方法**: GET
**认证**: 需要

**响应格式**:

成功:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "_id": "订单ID",
    "orderNo": "订单号",
    "shop": "店铺ID",
    "user": "用户ID",
    "table": "桌台ID",
    "tableNo": "A1",
    "items": [
      {
        "dish": "菜品ID",
        "dishName": "菜品名称",
        "price": 28.8,
        "num": 1,
        "remark": "备注"
      }
    ],
    "totalAmount": 28.8,
    "payStatus": 0,
    "orderStatus": 0,
    "payType": "微信支付",
    "payAt": "支付时间",
    "servedAt": "接单时间",
    "completedAt": "完成时间",
    "remark": "订单备注",
    "createdAt": "创建时间"
  }
}
```

### 7.3 更新订单状态

**接口地址**: `/api/admin/orders/:orderNo/status`
**请求方法**: PUT
**认证**: 需要

**请求参数**:
| 参数名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| orderStatus | number | 是 | 订单状态（0:待支付, 1:已支付, 2:已接单, 3:已完成, 4:已取消） |

**响应格式**:

成功:

```json
{
  "code": 200,
  "message": "更新成功",
  "data": {
    "orderNo": "订单号",
    "orderStatus": 2,
    "servedAt": "接单时间",
    "completedAt": "完成时间"
  }
}
```

## 8. 动态路由管理

### 8.1 获取动态路由

**接口地址**: `/api/admin/get-async-routes`
**请求方法**: GET
**认证**: 需要

**响应格式**:

成功（管理员角色）:

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "path": "/shop",
      "meta": {
        "title": "店铺管理",
        "icon": "ri:store-2-line",
        "rank": 1
      },
      "children": [
        {
          "path": "/shop/index",
          "name": "Shop",
          "component": "shop/index",
          "meta": {
            "title": "店铺信息",
            "roles": ["admin"]
          }
        }
      ]
    },
    {
      "path": "/category",
      "meta": {
        "title": "菜品分类管理",
        "icon": "ri:folder-3-line",
        "rank": 2
      },
      "children": [
        {
          "path": "/category/index",
          "name": "Category",
          "component": "category/index",
          "meta": {
            "title": "分类管理",
            "roles": ["admin"]
          }
        }
      ]
    },
    {
      "path": "/dish",
      "meta": {
        "title": "菜品管理",
        "icon": "ri:restaurant-line",
        "rank": 3
      },
      "children": [
        {
          "path": "/dish/index",
          "name": "Dish",
          "component": "dish/index",
          "meta": {
            "title": "菜品列表",
            "roles": ["admin"]
          }
        }
      ]
    },
    {
      "path": "/table",
      "meta": {
        "title": "桌台管理",
        "icon": "ri:table-line",
        "rank": 4
      },
      "children": [
        {
          "path": "/table/index",
          "name": "Table",
          "component": "table/index",
          "meta": {
            "title": "桌台列表",
            "roles": ["admin"]
          }
        }
      ]
    },
    {
      "path": "/order",
      "meta": {
        "title": "订单管理",
        "icon": "ri:file-list-3-line",
        "rank": 5
      },
      "children": [
        {
          "path": "/order/index",
          "name": "Order",
          "component": "order/index",
          "meta": {
            "title": "订单列表",
            "roles": ["admin", "kitchen"]
          }
        }
      ]
    }
  ]
}
```

成功（后厨角色）:

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "path": "/order",
      "meta": {
        "title": "订单管理",
        "icon": "ri:file-list-3-line",
        "rank": 5
      },
      "children": [
        {
          "path": "/order/index",
          "name": "Order",
          "component": "order/index",
          "meta": {
            "title": "订单列表",
            "roles": ["admin", "kitchen"]
          }
        }
      ]
    }
  ]
}
```

**路由字段说明**:

| 字段名                   | 类型   | 描述                                         |
| ------------------------ | ------ | -------------------------------------------- |
| **一级路由（菜单组）**   |        |
| path                     | string | 路由路径，如 `/shop`                         |
| meta.title               | string | 菜单显示名称                                 |
| meta.icon                | string | 菜单图标，Iconify 格式，如 `ri:store-2-line` |
| meta.rank                | number | 菜单排序，值越小越靠前                       |
| children                 | array  | 子路由数组                                   |
| **二级路由（实际页面）** |        |
| path                     | string | 完整路由路径，如 `/shop/index`               |
| name                     | string | 路由名称，必须唯一                           |
| component                | string | 组件路径，格式 `目录名/index`                |
| meta.title               | string | 页面标题                                     |
| meta.roles               | array  | 允许访问的角色列表                           |

**图标说明**:
| 菜单 | 图标 |
|------|------|
| 店铺管理 | `ri:store-2-line` |
| 菜品分类管理 | `ri:folder-3-line` |
| 菜品管理 | `ri:restaurant-line` |
| 桌台管理 | `ri:table-line` |
| 订单管理 | `ri:file-list-3-line` |

更多图标参考：https://icon-sets.iconify.design/ri/

## 10. 状态码说明

| 状态码 | 描述             |
| ------ | ---------------- |
| 200    | 成功             |
| 400    | 请求参数错误     |
| 401    | 未授权，需要登录 |
| 404    | 资源不存在       |
| 500    | 服务器内部错误   |

## 11. 订单状态说明

| 状态码 | 描述   |
| ------ | ------ |
| 0      | 待支付 |
| 1      | 已支付 |
| 2      | 已接单 |
| 3      | 已完成 |
| 4      | 已取消 |

## 12. 支付状态说明

| 状态码 | 描述   |
| ------ | ------ |
| 0      | 未支付 |
| 1      | 已支付 |

## 13. 接口调用示例

### 13.1 登录获取 Token

```bash
curl -X POST "https://vtdoptbzeqek.sealoshzh.site/api/admin/login" \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "123456"}'
```

### 13.2 获取菜品列表（带认证）

```bash
curl -X GET "https://vtdoptbzeqek.sealoshzh.site/api/admin/dishes?page=1&pageSize=10" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 13.3 创建新菜品

```bash
curl -X POST "https://vtdoptbzeqek.sealoshzh.site/api/admin/dishes" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "宫保鸡丁",
    "price": 28.8,
    "categoryId": "分类ID",
    "stock": -1,
    "sort": 10
  }'
```

### 13.4 获取动态路由

```bash
curl -X GET "https://vtdoptbzeqek.sealoshzh.site/api/admin/get-async-routes" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 14. 注意事项

1. **认证**: 除登录接口外，所有接口都需要在请求头中携带有效的 accessToken（`Authorization: Bearer YOUR_ACCESS_TOKEN`）
2. **Token刷新**: 当 accessToken 过期时，可使用 refreshToken 获取新的 accessToken
3. **权限**: 每个管理员只能操作自己店铺的数据，权限由 roles 和 permissions 字段控制
4. **分页**: 列表接口默认支持分页，建议前端实现分页功能
5. **错误处理**: 前端应根据返回的 code 字段判断请求是否成功（200为成功）
6. **数据验证**: 后端会对所有输入参数进行验证，前端也应进行相应的客户端验证
