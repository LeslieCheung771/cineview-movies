---
name: add-magnet
description: 为 CineView 片单中的电影添加磁力链接。用户提供电影名和磁力链接，Agent 自动找到对应条目并添加 magnet 字段。
---

# add-magnet — 添加磁力链接

## 使用方式

用户说 `/add-magnet` 或 "加磁力"、"添加磁力链接"，然后提供：

```
电影名
magnet:?xt=urn:btih:xxxxx
```

## 操作步骤

### 1. 搜索电影

在 `index.html` 中用 Grep 搜索用户提供的电影名（中文名或原名），定位到对应的 JSON 条目所在行。

数据在 `var MOVIES = [...]` 数组中，每部电影是一行 JSON 对象。

### 2. 判断状态

- **已有 magnet 字段**：告诉用户该电影已有磁力链接，展示当前值，询问是否覆盖。
- **无 magnet 字段**：在末尾 `}` 前插入 `,"magnet":"..."`。

### 3. 插入 magnet 字段

使用 Edit 工具，精确替换。示例：

**替换前：**
```json
{"id":"1301106","title_cn":"布达佩斯之恋",...,"countries":["德国","匈牙利"]}
```

**替换后：**
```json
{"id":"1301106","title_cn":"布达佩斯之恋",...,"countries":["德国","匈牙利"],"magnet":"magnet:?xt=urn:btih:xxxxx"}
```

关键：在最后一个字段的 `}` 之前插入 `,"magnet":"..."`。

### 4. 验证

```bash
node -e "JSON.parse(require('fs').readFileSync('index.html','utf8').match(/var MOVIES = (\[[\s\S]*?\]);\s*\/\/ END_MOVIES/)[1])" && echo "JSON OK"
```

### 5. 完成

告诉用户刷新浏览器，点击对应海报即可看到弹窗。

## 参考：已成功的测试条目

布达佩斯之恋 (id: 1301106)：
```
"magnet":"magnet:?xt=urn:btih:D4B6E45A647B5E04FB24B4129E9E7CEB8111ED71"
```

## 磁力链接格式注意事项

- 链接中的 `&` 不需要转义
- 双引号 `"` 在 JSON 字符串值中不需要转义（外层就是 JSON 字符串）
- 不要多写逗号
