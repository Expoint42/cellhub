# CHANGELOG

## 180312002

### Updated

- vpnModel.js
  - 删除了默认为 `1` 的 `ip_from` 字段
  - 删除了默认为 `254` 的 `ip_to` 字段
  - 将原 `in_use` 字段该为 `inUse`，并修改为 `{ type:[{ type: Number, min: 1, max: 254 }], default: [1] }`

- cellModel.js
  - 将原 `address` 字段改为 `tIP` 表示 tinc IP
  - 将原 `adsl_id` 字段改为 `adslId`
  - 将原 `adsl_key` 字段改为 `adslKey`
  - 将原 `wifikey` 字段改为 `wifiKey`

## 180312001

### Added

- 添加了 VPN 相关代码：
  - vpnRoute.js
  - vpnController.js
  - vpnModel.js

### Updated

- cellModel.js
  - 添加了 tPubKey 字段

- connectionModel.js
  - 移除了 name 字段（由于首次验证时，无法获取用户设备名称）

- state.js
  - 对应移除了 connection 对象的 name 字段。

## 180308002

### Added

在运行 tinc 的服务器上的 `/etc/tinc/<netname>` 添加了如下的脚本：

- host-up

```bash
#!/bin/bash

CELLHUB="ianki.cn:1338"

mkdir -p /tmp/log

echo "${NODE} @${REMOTEADDRESS}:${REMOTEPORT} is online" >> /tmp/log/tinc-host.log
res_msg=$( wget -qO- --post-data="_id=${NODE}&status=1" http://${CELLHUB}/cellstatus )
echo "Server Response: ${res_msg}" >> /tmp/log/tinc-host.log
```

- host-down

```bash
#!/bin/bash

CELLHUB="ianki.cn:1338"

mkdir -p /tmp/log

echo "${NODE} @${REMOTEADDRESS}:${REMOTEPORT} is offline" >> /tmp/log/tinc-host.log
res_msg=$( wget -qO- --post-data="_id=${NODE}&status=0" http://${CELLHUB}/cellstatus )
echo "Server Response: ${res_msg}" >> /tmp/log/tinc-host.log
```

### Updated

- cellController.js
  - 移除了 `getCells` 方法，并将 `getCellsByDataTable` 方法改为 `getCells` 方法
  - 为 `getCellById` 方法添加了 http status code
  - 新增了 `updateCellStatus` 代码转为 tinc 的 `host-up` & `host-down` 脚本服务从而更新哪些路由器在线哪些不在线。
  - 为 `count` 方法添加了 http status code

- cellModel.js
  - 为 `mac` 字段添加了 `uppercase:true` 属性
  - 新增了 `status` 字段

- connectionModel.js
  - 为 `mac` 字段添加了 `uppercase:true` 属性
  - 为 `cell` 字段添加了 `uppercase:true` 属性

- cellRoute.js
  - 移除了导入的`getCellsByDataTable` 方法和 `/celldemo` 路由
  - 新增导入 `updateCellStatus` 方法和 `/cellstatus` 路由

## 180308001

### Added

### Updated

- index.js
  - 添加了 `res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');` 以解决 jQuery.ajax 是用 `PUT` 更新不支持的问题情况

- state.js
  - 移除了 `newConnection(client)` 方法，将其处理内容放到 `refreshStateOfClients(client)` 方法中
  - 添加了 `dailyConnectNum` 变量用于统计每天独立连接的数量，并在 `takeSnapshot()` 方法中的 `snapshot` 对象添加了 `connectNum` 字段

- cellController.js
  - 启用并简化了 `getCellsByDataTable` 方法用于支持 DataTable 复杂的查询
  - 更新了 `updateCellById` 方法，主要希望统一将时间字段改为 UTC 时间戳，同时给 Response添加了 HTTP Code，并将在所有的API中添加。

- connectionController.js
  - 移除了 `addNewConnection(data)` 中累计连接数量和像客户端广播的部分，该功能由 `state.js` 中的 `refreshStateOfClients(client)` 和 `takeSnapshot()` 方法 分别完成

- stateController.js
  给 `getStateOfCells` 的 Response 添加了 HTTP Code，

- wifiDogController.js
  - 移除了 `auth(req, res, next)` 监测新连接并调用 `newConnection(client)` 方法

- adModel.js
  - 将 `createdAt` 字段的类型从 Date 改为 Number

- cellModel.js
  - 新增了 `password`, `sn`, `adsl_id`, `adsl_key`, `ssid`, `wifikey`, `scene`, `updatedAt` 字段
  - 删除了 `kernel` 字段
  - 修改了 `model`, `fv`, `cratedAt` 字段

- connectionModel.js
  - 新增了 `name` 字段

- cellRoute.js
  - 禁用了 `.delete` API
  - 添加了 `options` API 以便于 jQuery ajax 使用 `PUT` 方法来更新cell
  - 添加了 `app.route('celldemo')` API 以便于 DataTable 查询。