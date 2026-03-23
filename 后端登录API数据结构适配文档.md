# 后端登录API数据结构适配文档

## 📋 文档概述

本文档旨在指导后端开发人员如何修改登录API返回的数据结构，以兼容 `pure-admin-thin` 前端项目的期望格式。

## 🔍 当前数据结构对比

### 当前后端API返回格式

```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "JWT token",
    "admin": {
      "_id": "管理员ID",
      "username": "用户名",
      "role": "角色",
      "shop": {
        "_id": "店铺ID",
        "name": "店铺名称"
      }
    }
  }
}
```

### 前端项目期望格式

```typescript
{
  "success": true,
  "data": {
    "avatar": "头像URL",
    "username": "用户名",
    "nickname": "昵称",
    "roles": ["角色数组"],
    "permissions": ["权限数组"],
    "accessToken": "访问令牌",
    "refreshToken": "刷新令牌",
    "expires": "过期时间"
  }
}
```

## 🎯 适配目标格式

### 修改后的后端API返回格式

```json
{
  "success": true,
  "data": {
    "avatar": "https://avatars.githubusercontent.com/u/44761321",
    "username": "admin",
    "nickname": "管理员",
    "roles": ["admin"],
    "permissions": ["*:*:*"],
    "accessToken": "eyJhbGciOiJIUzUxMiJ9.admin",
    "refreshToken": "eyJhbGciOiJIUzUxMiJ9.adminRefresh",
    "expires": "2030/10/30 00:00:00"
  }
}
```

## 🔧 具体修改要求

### 1. 响应结构修改

**修改前：**

```json
{
  "code": 200,
  "message": "登录成功",
  "data": { ... }
}
```

**修改后：**

```json
{
  "success": true,
  "data": { ... }
}
```

**修改说明：**

- 将 `code` 字段改为 `success`（布尔值）
- 移除 `message` 字段（前端会自行处理提示）
- 保持 `data` 字段，但内部结构需要调整

### 2. 用户数据结构修改

**修改前：**

```json
{
  "token": "JWT token",
  "admin": {
    "_id": "管理员ID",
    "username": "用户名",
    "role": "角色",
    "shop": {
      "_id": "店铺ID",
      "name": "店铺名称"
    }
  }
}
```

**修改后：**

```json
{
  "avatar": "头像URL",
  "username": "用户名",
  "nickname": "昵称",
  "roles": ["角色数组"],
  "permissions": ["权限数组"],
  "accessToken": "访问令牌",
  "refreshToken": "刷新令牌",
  "expires": "过期时间"
}
```

**字段映射说明：**

| 原字段                | 新字段              | 转换规则               | 备注        |
| --------------------- | ------------------- | ---------------------- | ----------- |
| `data.token`          | `data.accessToken`  | 直接映射               | 字段名变更  |
| `data.admin.username` | `data.username`     | 直接映射               | 层级简化    |
| `data.admin.role`     | `data.roles`        | 字符串转数组           | `["admin"]` |
| -                     | `data.avatar`       | 根据角色设置默认头像   | 必填字段    |
| -                     | `data.nickname`     | 使用用户名或自定义昵称 | 必填字段    |
| -                     | `data.permissions`  | 根据角色设置权限       | 必填字段    |
| -                     | `data.refreshToken` | 生成刷新令牌           | 必填字段    |
| -                     | `data.expires`      | 计算过期时间           | 必填字段    |

### 3. 角色和权限映射规则

**角色权限对应表：**

| 角色      | 权限数组                         | 说明               |
| --------- | -------------------------------- | ------------------ |
| `admin`   | `["*:*:*"]`                      | 管理员拥有所有权限 |
| `kitchen` | `["order:view", "order:update"]` | 后厨权限           |
| `common`  | `["order:view"]`                 | 普通用户权限       |

**权限格式说明：**

- `*:*:*` - 所有权限
- `order:view` - 查看订单权限
- `order:update` - 更新订单权限

### 4. 默认值设置规则

**头像默认值：**

- `admin` 角色：`https://avatars.githubusercontent.com/u/44761321`
- `kitchen` 角色：`https://avatars.githubusercontent.com/u/52823142`
- `common` 角色：`https://avatars.githubusercontent.com/u/52823142`

**昵称默认值：**

- 使用用户名作为默认昵称
- 或根据业务需求设置固定昵称

**过期时间：**

- 格式：`YYYY/MM/DD HH:mm:ss`
- 默认：当前时间 + 7天

## 💡 实现示例

### Node.js 实现示例

```javascript
// 登录接口实现
app.post("/api/admin/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. 验证用户身份
    const user = await UserModel.findOne({ username });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.json({
        success: false,
        data: null
      });
    }

    // 2. 生成Token
    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "30d" }
    );

    // 3. 构建响应数据
    const responseData = {
      avatar: getAvatarByRole(user.role),
      username: user.username,
      nickname: user.nickname || user.username,
      roles: [user.role],
      permissions: getPermissionsByRole(user.role),
      accessToken: accessToken,
      refreshToken: refreshToken,
      expires: getExpiryDate(7) // 7天后过期
    };

    res.json({
      success: true,
      data: responseData
    });
  } catch (error) {
    console.error("登录错误:", error);
    res.json({
      success: false,
      data: null
    });
  }
});

// 根据角色获取头像
function getAvatarByRole(role) {
  const avatars = {
    admin: "https://avatars.githubusercontent.com/u/44761321",
    kitchen: "https://avatars.githubusercontent.com/u/52823142",
    common: "https://avatars.githubusercontent.com/u/52823142"
  };
  return avatars[role] || avatars.common;
}

// 根据角色获取权限
function getPermissionsByRole(role) {
  const permissions = {
    admin: ["*:*:*"],
    kitchen: ["order:view", "order:update"],
    common: ["order:view"]
  };
  return permissions[role] || [];
}

// 计算过期时间
function getExpiryDate(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date
    .toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    })
    .replace(/\//g, "/");
}
```

### Java Spring Boot 实现示例

```java
@RestController
@RequestMapping("/api/admin")
public class AuthController {

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest request) {
        try {
            // 验证用户
            User user = userService.authenticate(request.getUsername(), request.getPassword());
            if (user == null) {
                return ResponseEntity.ok(Map.of("success", false, "data", null));
            }

            // 生成Token
            String accessToken = jwtUtil.generateToken(user);
            String refreshToken = jwtUtil.generateRefreshToken(user);

            // 构建响应数据
            Map<String, Object> userData = new HashMap<>();
            userData.put("avatar", getAvatarByRole(user.getRole()));
            userData.put("username", user.getUsername());
            userData.put("nickname", user.getNickname() != null ? user.getNickname() : user.getUsername());
            userData.put("roles", Arrays.asList(user.getRole()));
            userData.put("permissions", getPermissionsByRole(user.getRole()));
            userData.put("accessToken", accessToken);
            userData.put("refreshToken", refreshToken);
            userData.put("expires", getExpiryDate(7));

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", userData);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("success", false, "data", null));
        }
    }

    private String getAvatarByRole(String role) {
        // 实现头像逻辑
        return "https://avatars.githubusercontent.com/u/44761321";
    }

    private List<String> getPermissionsByRole(String role) {
        // 实现权限逻辑
        return Arrays.asList("*:*:*");
    }

    private String getExpiryDate(int days) {
        // 实现过期时间逻辑
        return "2030/10/30 00:00:00";
    }
}
```

## 🔄 测试用例

### 成功登录响应示例

```json
{
  "success": true,
  "data": {
    "avatar": "https://avatars.githubusercontent.com/u/44761321",
    "username": "admin",
    "nickname": "管理员",
    "roles": ["admin"],
    "permissions": ["*:*:*"],
    "accessToken": "eyJhbGciOiJIUzUxMiJ9.admin",
    "refreshToken": "eyJhbGciOiJIUzUxMiJ9.adminRefresh",
    "expires": "2030/10/30 00:00:00"
  }
}
```

### 登录失败响应示例

```json
{
  "success": false,
  "data": null
}
```

## 📋 验收标准

1. ✅ 响应结构必须包含 `success` 和 `data` 字段
2. ✅ `data` 字段必须包含所有必填的用户信息
3. ✅ 角色字段必须是数组格式
4. ✅ 必须提供有效的 Token 和过期时间
5. ✅ 权限字段必须根据角色正确设置
6. ✅ 头像和昵称字段不能为空

## 💡 注意事项

1. **向后兼容**：如果现有其他系统依赖原API格式，可以考虑版本控制
2. **错误处理**：登录失败时返回 `{"success": false, "data": null}`
3. **安全性**：确保Token生成和验证的安全性
4. **性能**：权限和角色映射逻辑应高效执行

## 📞 技术支持

如有任何问题，请联系前端开发团队或参考 `pure-admin-thin` 项目文档。
