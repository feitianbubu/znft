import CardGiftCardIcon from '@mui/icons-material/CardGiftcard';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import {Box, FormControl} from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import Snackbar from '@mui/material/Snackbar';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import _ from 'lodash';
import moment from "moment";
import React from 'react';
import Web3 from "web3";
import './App.css';
import abiJson from './config/abi.json';
import heroClockAuctionJson from './config/HeroClockAuction.json';
import heroCoreJson from './config/HeroCore.json';
import SendGiftFormDialog from "./SendGiftFormDialog";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import OutboxIcon from '@mui/icons-material/Outbox';

import mintBoxAbi from './config/mintBox.json';
import preSaleAbi from './config/preSale.json';

let baseApiUrl = abiJson.baseApiUrl;
const location = document.location.href;
// 本地测试url切换
if (location.indexOf('localhost:3000') > -1) {
    baseApiUrl = 'http://localhost:3080' + abiJson.baseApiUrl;
}

let configData = {};
const jsonInterface = heroCoreJson.abi;
const auctionJsonInterface = heroClockAuctionJson;
let contractAddress
let getConfig = () => {
    let chainID = user.chainID;
    return configData?.Chain?.[chainID] || {};
};

const AppName = 'Z-NFT';
// 定义货币单位
let CURRENCY_UNIT = 'ETH';

const pages = [{name: '市场', id: 'market'}, {name: '我的', id: 'my'}, {name: '空投', id: 'mint'}];
let web3;
let user = {};
let connectBtnName = '连接钱包';
let contractBtnName = '获取合约';
let mintBtnName = '空投';
let contractBtnNameDisabled = false
let selectPageId = 'market';

let auctionContract;
let heroContract;
let mintBoxContract;
let preSaleContract;

const theme = createTheme();
const initState = {
    value: '',
    rows: [],
    itemData: [],
    user: {},
    snackbarOpen: false,
    snackbarMsg: '',
    dialogOpen: false,
    dialogMsg: '',
    open: false,
    tokenId: '',
    SnackbarOpen: false,
    mintToAddress: '',
    mintUri: '',
    mintBtnDisabled: false,
    totalSupply: '',
    sellList: [],
    nftInfo: {},
    connectBtnDisabled: false,
    contactBalance: '',
    whitelistedSpawner: false,
    selectPageId: selectPageId,
};

let isMintBox = function (item) {
    return item.creator === getConfig().MintBoxContractAddress;
}
let isPreSale = function (item) {
    return item.creator === getConfig().PreSaleContractAddress;
}

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = initState;
        this.componentDidMount = this.componentDidMount.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleMint = this.handleMint.bind(this);
        this.openSellDialog = this.openSellDialog.bind(this);
        this.copyText = this.copyText.bind(this);
        this.disconnectWallet = this.disconnectWallet.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.handleChangePage = this.handleChangePage.bind(this);
    }

    async componentDidMount() {
        let self = this;
        console.log('componentDidMount');
        web3 = new Web3(Web3.givenProvider)

        fetch(baseApiUrl + '/Config', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({})
        }).then(res => {
            console.log('res', res);
            let json = res.json();
            console.log('json', json);
            return json;
        }).then(res => {
            if (res.code) {
                return self.addOpenSnackbar('获取配置失败', res);
            }
            console.log('获取配置成功', res);
            configData = JSON.parse(res.data);
        }).catch(err => {
            self.addOpenSnackbar('获取配置失败', err);
        });
        await this.handleSubmit();
    }

    copyText(event) {
        // 复制文本到剪贴板
        if (event.target.getAttribute('name') !== 'account') {
            return;
        }
        let text = event.target.getAttribute('title')
        const input = document.createElement('input');
        input.value = text;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        this.addOpenSnackbar(`复制成功: ${text}`);
    }

    // 断开钱包
    disconnectWallet() {
        // 断开连接
        console.log('disconnect', user);
        user = {};
        connectBtnName = '连接钱包';
        contractBtnName = '获取合约';
        mintBtnName = '空投';
        contractBtnNameDisabled = false;
        user = {};
        this.setState(initState);
        this.forceUpdate();
    }

    // 连接钱包
    handleClick = async () => {
        console.log('handleClick', connectBtnName);
        this.setState({connectBtnDisabled: true});
        if (user.account) {
            this.disconnectWallet();
            return;
        }
        connectBtnName = '正在连接...';
        web3 = new Web3(Web3.givenProvider);

        if (!window.ethereum || !web3.currentProvider?.isMetaMask) {
            this.addOpenSnackbar('请先安装MetaMask');
            return;
        }

        const permissions = await window.ethereum.request({
            method: 'wallet_getPermissions',
        })

        console.log({permissions}, web3.eth.accounts)

        // 判断是否已授权
        if (!permissions.length) {
            this.addOpenSnackbar('请先授权MetaMask');
            window.ethereum.request({
                method: 'wallet_requestPermissions', params: [{
                    'eth_accounts': {
                        requiredMethods: ['signTypedData_v4']
                    }
                }]
            }).then((permissions) => {
                const granted = permissions.find((permission) => permission.parentCapability === 'eth_accounts');
                if (granted) {
                    this.addOpenSnackbar('授权成功!');
                }
            }).catch((error) => {
                this.addOpenSnackbar('授权失败!', error);
            })
            return;
        }
        try {
            user.account = (await web3.eth.getAccounts())[0];
        } catch (e) {
            this.addOpenSnackbar('请先安装metamask');
            return;
        }
        if (!user.account) {
            this.addOpenSnackbar('请先解锁metamask');
            return;
        }

        try {
            connectBtnName = '断开钱包';
            user.balance = await web3.eth.getBalance(user.account);
            user.network = await web3.eth.net.getNetworkType();
            let chainID = await web3.eth.net.getId();
            user.chainID = chainID?.toString();

            this.setState({connectBtnDisabled: false});
            this.setState({user: user});

            if(_.isEmpty(configData)) {
                return this.addOpenSnackbar('获取服务端配置失败');
            }
            let config = getConfig();
            if (_.isEmpty(config)) {
                this.addOpenSnackbar(`平台暂不支持的该链[${user.network}:${user.chainID}], 请检查钱包对应网络是否正确`);
            }

            CURRENCY_UNIT = config.Symbol;
            contractAddress = getConfig().HeroContractAddress;
            auctionContract = new web3.eth.Contract(auctionJsonInterface, getConfig().AuctionContractAddress);
            heroContract = new web3.eth.Contract(jsonInterface, contractAddress);
            mintBoxContract = new web3.eth.Contract(mintBoxAbi, getConfig().MintBoxContractAddress);
            preSaleContract = new web3.eth.Contract(preSaleAbi, getConfig().PreSaleContractAddress);

        } catch (e) {
            this.disconnectWallet();
            this.addOpenSnackbar('metamask连接失败', e);
            return;
        }

        console.log('configData', configData, user.chainID, getConfig());
        // 获取角色信息
        // try {
        //     let userSync = await this.getUserInfo(user.account);
        //     let userInfo = await userSync.json();
        //     user.nickname = userInfo['nickName'];
        //     let token = userInfo.token;
        //     this.setState({token});
        //     this.setState({user});
        // } catch (e) {
        //     user['getLpFail'] = e
        //     this.addOpenSnackbar("lp用户信息获取失败", e);
        // }
        await this.handleSubmit();

        this.forceUpdate();
    };
    handleSubmit = async () => {
        let self = this;
        if (!user.account) {
            await self.handleClick();
        }
        contractBtnName = '正在获取...';
        contractBtnNameDisabled = true;
        console.log('handleSubmit', user, this.state);

        let itemData = [];
        self.setState({itemData});
        self.forceUpdate();
        self.setState({whitelistedSpawner: false});
        if (selectPageId === 'mint') {
            // 是否可以空投
            let whitelistedSpawner = await heroContract.methods.whitelistedSpawner(self.state.user.account).call().catch(e => self.addOpenSnackbar("是否可以空投获取失败", e));
            self.setState({whitelistedSpawner});
            if (!whitelistedSpawner) {
                self.addOpenSnackbar("您没有空投权限");
                return;
            }

            let totalSupply = await heroContract.methods.totalSupply().call().catch(e => self.addOpenSnackbar("合约总量获取失败", e));
            totalSupply = parseInt(totalSupply);

            self.setState({totalSupply: `总量: ${totalSupply}`});
            return;
        }

        let owner;
        let chainID = user.chainID
        if (selectPageId === 'my') {
            owner = user.account;
        } else if (selectPageId === 'market') {
            owner = getConfig().AuctionContractAddress
        }
        if (!owner) {
            return;
        }
        let body = {
            owner,
            chainID
        };
        console.log('start fetch itemlist', body);
        fetch(`${baseApiUrl}/ItemList`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }).then(res => {
            return res.json();
        }).then(res => {
            console.log('res', baseApiUrl, res);
            if (res.reason === 12002) {
                self.addOpenSnackbar(`请检查钱包对应网络[${user.network}:${user.chainID}]是否正确`, res);
                return;
            }
            if (res.error) {
                console.log('res.error', body);
                self.addOpenSnackbar("获取商品列表失败", res.error.message);
                return;
            }
            let itemData = res.items || [];
            console.log('itemData:', itemData);
            self.setState({itemData});
            // self.forceUpdate();
            self.setState({sortByDesc: false});
            self.handleSortChange();

        }).catch(e => {
            console.log('e', e, body);
            self.addOpenSnackbar("获取商品列表失败", e + JSON.stringify(body))
        });
    };

    handleChange(event) {
        console.log('handleChange', event.target.id, event.target.value);
        let state = {};
        state[event.target.id] = event.target.value;
        this.setState(state);
    }

    openSendGiftDialog = (item) => {
        let tokenId = item.tokenId;
        this.setState({dialogOpen: true});
        this.setState({tokenId: tokenId});
        this.forceUpdate();
    }
    handleSendGift = async (event, msg) => {
        let self = this;
        console.log('handleSendGift', user, this.state, msg);
        if (!user.account) {
            this.addOpenSnackbar('请先连接钱包');
            return;
        }
        let myContract = new web3.eth.Contract(jsonInterface, contractAddress);
        let to = msg.to;
        let tokenId = this.state.tokenId;
        if (!to || !tokenId) {
            console.log('handleSendGift fail', to, tokenId);
            this.setState({snackbarMsg: "请输入收货地址和NFT编号"});
            this.setState({SnackbarOpen: true});
            return;
        }
        let gasPrice = await web3.eth.getGasPrice();
        let from = user.account;
        console.log('handleSendGift msg: ', from, to, tokenId, gasPrice);
        let method = myContract.methods['safeTransferFrom'](from, to, tokenId);
        let gasLimit = await method.estimateGas({from: user.account});
        console.log('gasPrice', gasPrice);
        console.log('gasLimit', gasLimit);
        try {
            let tx = await method.send({
                from: user.account, gasPrice: gasPrice, gas: gasLimit, value: 0
            });
            self.addOpenSnackbar("赠送成功:", tx);
            await self.handleSubmit();
        } catch (e) {
            self.addOpenSnackbar("赠送失败:", e);
        }
    };
    onOpenChange = (open) => {
        console.log('onOpenChange', open);
        this.setState({dialogOpen: open});
        this.forceUpdate();
    };

    addOpenSnackbar = (snackbarMsg, json) => {
        if (!snackbarMsg) {
            return;
        }
        console.log('addOpenSnackbar snackbarMsg:', snackbarMsg, json);
        if (json) {
            snackbarMsg += " " + (json.message || JSON.stringify(json));
        }
        const maxLength = 200;
        if (snackbarMsg.length > maxLength) {
            snackbarMsg = snackbarMsg.substring(0, maxLength) + "...";
        }
        this.setState({snackbarMsg});
        this.setState({SnackbarOpen: true});
        if (!user.account) {
            connectBtnName = '连接钱包';
            this.setState({connectBtnDisabled: false});
        }
        this.forceUpdate();
    };
    handleClose = () => {
        console.log('handleClose');
        this.setState({SnackbarOpen: false});
    };

    handleMint = async () => {
        let self = this;
        console.log('handleMint', user, this.state);
        if (!user.account) {
            this.addOpenSnackbar('请先连接钱包');
            return;
        }
        let myContract = new web3.eth.Contract(jsonInterface, contractAddress);
        let mintToAddress = this.state.mintToAddress;
        let mintUri = this.state.mintUri || _.random(1, 5).toString();

        let totalSupply = await myContract.methods.totalSupply().call();
        this.setState({totalSupply: totalSupply});

        let heroesJson = abiJson.heroesJson[_.random(abiJson.heroesJson.length - 1)];
        let tokenUri = (heroesJson.bsID ?? '') + '';
        let method = myContract.methods['spawnHero'](mintUri, mintToAddress, tokenUri);
        console.log('spawnHero', totalSupply, mintUri, mintToAddress, tokenUri);
        let tx = await method.send({
            from: user.account
        });
        console.log('tx', tx);
        self.setState({snackbarMsg: "空投成功"});
        self.setState({SnackbarOpen: true});
        await self.handleSubmit();
    };
    openMintBoxDialog = async (item) => {
        let self = this;
        let tokenId = item.tokenId;
        let method = mintBoxContract.methods['usageBox'](tokenId);
        try {
            // 计算gasLimit
            let usageBoxgasLimit = await method.estimateGas({from: user.account});
            console.log('usageBoxgasLimit', usageBoxgasLimit);

            // let burnMethod = mintBoxContract.methods['_burn'](tokenId);
            // let BurnGasLimit = await method.estimateGas({from: user.account, value: 0});
            // console.log('BurnGasLimit', BurnGasLimit);
            let mintMethod = heroContract.methods['spawnHero']('1', user.account, '');
            let mintGasLimit = await mintMethod.estimateGas({from: user.account});
            console.log('mintGasLimit', mintGasLimit);

            let gasLimit = usageBoxgasLimit + mintGasLimit;
            console.log('gasLimit', gasLimit);
            let gasPrice = await web3.eth.getGasPrice();
            console.log('gasPrice', gasPrice);

            let tx = await method.send({
                from: user.account, gasLimit: gasLimit * 2, gasPrice: gasPrice
            })
            console.log('tx', tx);
            self.addOpenSnackbar(`打开成功`);
            await self.handleSubmit();
        } catch (e) {
            self.addOpenSnackbar(`打开失败:`, e);
        }

    };

    openSellDialog = async (item) => {
        let self = this;
        let tokenId = item.tokenId;
        let defaultPrice = (Math.min(parseFloat(item.quality), 1) / 100).toString();
        let price = prompt("请输入价格", defaultPrice);
        price = parseFloat(price);
        if (!_.isNumber(price) || price <= 0) {
            alert(`请输入正确的价格!`);
            return;
        }
        price = web3.utils.toWei(price.toString(), 'ether');

        // createAuction
        let method = auctionContract.methods['createAuction'](contractAddress, tokenId, price, price, 6000000);
        console.log(contractAddress, tokenId, price, price, 0);
        let gasLimit = await method.estimateGas({from: user.account});
        let gasPrice = await web3.eth.getGasPrice();
        console.log('gasPrice', gasPrice);
        console.log('gasLimit', gasLimit);
        let tx = await method.send({
            from: user.account, gasPrice: gasPrice, gas: gasLimit
        }).catch(e => {
            self.addOpenSnackbar(`出售失败:`, e);
        });
        console.log('tx', tx);
        self.addOpenSnackbar(`出售成功`);

        await self.handleSubmit();
    }
    handCancelAuction = async (item) => {
        let self = this;
        let tokenId = item.tokenId;
        let actionName = '取消拍卖';
        if (!confirm(`确认取消拍卖该物品吗?`)) {
            return;
        }
        // cancelAuction
        let method = auctionContract.methods['cancelAuction'](contractAddress, tokenId);
        console.log(contractAddress, tokenId);
        let tx = await method.send({
            from: user.account
        }).catch(e => {
            self.addOpenSnackbar(`${actionName}失败:`, e);
        });
        console.log('tx', tx);
        self.addOpenSnackbar(`${actionName}成功`);

        await self.handleSubmit();
    }
    handBid = async (item) => {
        let self = this;
        let tokenId = item.tokenId;
        let actionMsg = '购买成功';
        let price = item.currentPrice;
        if (!confirm(`确认将该物品以${web3.utils.fromWei(price)}${CURRENCY_UNIT}的价格购买吗?`)) {
            return;
        }

        let method;
        if (isMintBox(item)) {
            method = mintBoxContract.methods['mintBox']();
        } else if (isPreSale(item)) {
            // 判断是否开始
            let isStart = await preSaleContract.methods['isStart']().call();
            if (!isStart) {
                return self.addOpenSnackbar(`预售未开始`);
            }
            // 判断是否结束
            let isFinish = await preSaleContract.methods['isFinish']().call();
            if (isFinish) {
                return self.addOpenSnackbar(`预售已结束`);
            }

            method = preSaleContract.methods['Support']();
        } else {
            // createAuction
            method = auctionContract.methods['bid'](contractAddress, tokenId);
        }
        console.log(contractAddress, tokenId, price);
        let tx;
        try {
            tx = await method.send({
                from: user.account, value: price
            });
            console.log('tx', tx);
        } catch (e) {
            actionMsg = '购买失败' + e;
        }
        self.addOpenSnackbar(`${actionMsg}`);

        await self.handleSubmit();
    }
    handleChangePage = async (event) => {
        console.log('handleChangePage', event, event.target.id, document.getElementById(event.target.id));
        selectPageId = event.target.id;
        this.setState({selectPageId})
        console.log('this.state.selectPageId', event.target.id, selectPageId);
        await this.handleSubmit();
    };
    handleWithdrawBalance = async () => {
        let self = this;
        // 余额
        let balance = await web3.eth.getBalance(getConfig().AuctionContractAddress);
        console.log('balance', balance);
        let showBalance = web3.utils.fromWei(balance, 'ether');
        showBalance = parseFloat(showBalance).toFixed(4);
        if (!confirm(`确认提取${showBalance}${CURRENCY_UNIT}吗?`)) {
            return;
        }
        // withdrawBalance
        let method = auctionContract.methods['withdrawBalance']();
        let tx = await method.send({
            from: user.account
        }).catch(e => {
            self.addOpenSnackbar(`提取失败:`, e);
        });
        console.log('tx', tx);
        self.addOpenSnackbar(`提取成功`);

        await self.handleSubmit();
    }

    handleSortChange = async () => {
        let sortByValue = document.querySelector("input[name='sort']:checked")?.value || 'tokenId';
        let sortByDesc = !this.state.sortByDesc;
        this.setState({sortByDesc});

        let itemData = this.state.itemData;
        itemData = _.sortBy(itemData, function (item) {
            let value = item?.[sortByValue];
            value = parseFloat(value);
            return sortByDesc ? value : -value;
        });
        this.setState({itemData});
        this.forceUpdate();
    }

    render() {

        const action = (<React.Fragment>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={this.handleClose}
            >
                <CloseIcon fontSize="small"/>
            </IconButton>
        </React.Fragment>);

        return (<div className="App">
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <AppBar position="relative">
                    <Toolbar>
                        <Box sx={{
                            display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center'
                        }}>
                            <Typography
                                variant="h6"
                                noWrap
                                component="div"
                                sx={{mr: 2, display: {xs: 'none', md: 'flex'}, fontWeight: 'bold'}}
                            >
                                {AppName}
                            </Typography>
                            <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
                                {pages.map((page) => (
                                    <Button
                                        color={this.state.selectPageId === page.id ? 'warning' : 'inherit'}
                                        key={page.id}
                                        id={page.id}
                                        size={'large'}
                                        sx={{
                                            fontWeight: 'bold',
                                            fontSize: '1.2rem',
                                            mr: 2,
                                            display: {xs: 'none', md: 'flex'}
                                        }}
                                        onClick={this.handleChangePage}
                                    >
                                        {page.name}
                                    </Button>
                                ))}
                            </Box>
                            <Box>
                                <Box sx={{height: 20}}>
                                    {Object.keys(this.state.user).map((key, index) => {
                                        let title = this.state.user[key];
                                        let name = title;
                                        if (key === 'account') {
                                            name = title.substr(0, 6) + '...' + title.substr(name.length - 4);
                                        }
                                        if (key === 'balance') {
                                            // 显示以太币
                                            name = (title / web3.utils.unitMap.ether).toFixed(4);
                                        }
                                        return (<Box component="span" name={key} key={index} title={title}
                                                     onClick={this.copyText}><span
                                            className="name">{_.startCase(key)}:</span>
                                            {name}
                                        </Box>);
                                    })}
                                </Box>
                                <Box sx={{display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end'}}>
                                    <Button id="connectBtn" disabled={this.state.connectBtnDisabled}
                                            color="inherit"
                                            onClick={this.handleClick}>{connectBtnName}</Button>
                                </Box>
                            </Box>
                        </Box>
                    </Toolbar>
                </AppBar>
                <Box className='App-body'
                     display={_.indexOf(['market', 'my', 'mint'], this.state.selectPageId) !== -1 ? '' : 'none'}>
                    <FormControl sx={{display: 'inline', width: '80%'}}>
                        <FormLabel sx={{display: 'inline', width: '200px'}}>排序: </FormLabel>
                        <RadioGroup id="sortRadioGroup" sx={{display: 'inline', width: '300px'}} row
                                    onClick={this.handleSortChange} defaultValue="tokenId">
                            <FormControlLabel name="sort" value="tokenId" control={<Radio/>} label="tokenId"/>
                            <FormControlLabel name="sort" value="currentPrice" control={<Radio/>} label="售价"/>
                            <FormControlLabel name="sort" value="quality" control={<Radio/>} label="星级"/>
                        </RadioGroup>
                    </FormControl>
                    <ImageList sx={{width: '80%'}} cols={5}>
                        {this.state.itemData?.map((item, i) => {
                            let account = this.state.user.account;
                            if (item.quality) {
                                // quality转化为五星个数
                                item.star = _.times(Math.max(Math.min(item.quality, 5), 1), _.constant('★')).join('');
                            }
                            item.img = item.img || 'static/img/empty.jpg';
                            if (item.tokenUri?.match(/^\d+$/)) {
                                item.name = _.find(abiJson.heroesJson, (heroJson) => heroJson['bsID'] === parseInt(item.tokenUri))?.name;
                                item.img = `https://img7.99.com/yhkd/image/data/hero//big-head/${item.tokenUri}.jpg`;
                            }
                            // 显示格式化地址
                            let owner = '';
                            if (item.owner) {
                                owner = item.owner.substr(0, 6) + '...' + item.owner.substr(item.owner.length - 4);
                                if (item.owner === account) {
                                    owner = '★我的';
                                } else if (_.indexOf([getConfig().AuctionContractAddress, getConfig().MintBoxContractAddress, getConfig().PreSaleContractAddress], item.owner) !== -1) {
                                    owner = '' + (item.currentPrice / web3.utils.unitMap.ether).toFixed(4) + CURRENCY_UNIT;
                                } else {
                                    owner = '@' + owner;
                                }
                            }

                            let subtitle = `${item.tokenId} ${item.name ?? ''} ${item.star ?? ''}`;
                            if (isMintBox(item)) {
                                item.name = '盲盒';
                                item.img = 'static/img/mintBox.jpg';
                                if (this.state.selectPageId === 'market') {
                                    subtitle = `剩余:${item.num} ${item.name}`
                                }
                            }
                            if (isPreSale(item)) {
                                item.name = '预售';
                                item.img = 'static/img/preSale.jpg';
                                if (this.state.selectPageId === 'market') {
                                    subtitle = `剩余:${item.num} 截止:${moment(item.preSale?.endTime*1000).format('MM-DD HH:mm:ss')}`
                                }
                            }

                            let isSeller = item.seller && account && item.currentPrice && (item.seller === account);
                            let isBuyer = item.seller && account && item.currentPrice && !isSeller;
                            let buttonDisplay = (item.owner && (account === item.owner)) ? 'flex' : 'none';
                            return (<Box key={item.tokenId + '-' + i}><ImageListItem>
                                <img
                                    src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
                                    srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                    alt={item.tokenId}
                                    loading="lazy"
                                />
                                <ImageListItemBar
                                    title={`${owner}`}
                                    subtitle={subtitle}
                                />

                            </ImageListItem>
                                <Box sx={{display: buttonDisplay, justifyContent: 'space-around', m: 1}}>
                                    {isMintBox(item) ?
                                        <div><Button name={item.tokenId} variant="outlined" endIcon={<OutboxIcon/>}
                                                     onClick={() => this.openMintBoxDialog(item)}>
                                            打开
                                        </Button></div> :
                                        <div><Button name={item.tokenId} variant="outlined"
                                                     endIcon={<CardGiftCardIcon/>}
                                                     onClick={() => this.openSendGiftDialog(item)}>
                                            赠送
                                        </Button>
                                            <Button name={item.tokenId} variant="outlined"
                                                    sx={{marginLeft: 1}}
                                                    endIcon={<ShoppingCartIcon/>}
                                                    onClick={() => this.openSellDialog(item)}
                                                    color={'secondary'}>
                                                出售
                                            </Button></div>
                                    }
                                </Box>
                                {isSeller ?
                                    <Button name={item.tokenId} variant="outlined"
                                            endIcon={<ShoppingCartCheckoutIcon/>}
                                            color={'warning'}
                                            onClick={() => this.handCancelAuction(item)}>
                                        取回
                                    </Button> : null}
                                {isBuyer ?
                                    <Button name={item.tokenId} currentprice={item.currentPrice} variant="outlined"
                                            endIcon={<CardGiftCardIcon/>}
                                            color={'success'}
                                            onClick={() => this.handBid(item)}>
                                        {isPreSale(item) ? '预购' : '购买'}
                                    </Button> : null}
                            </Box>)
                        })}
                    </ImageList>
                    <SendGiftFormDialog open={this.state.dialogOpen} onOpenChange={this.onOpenChange}
                                        onChange={this.handleChange} onClick={this.handleSendGift}/>
                    {this.state.whitelistedSpawner ?
                        <form>
                            <FormControl>
                                <div><TextField id="mintToAddress" label="空投地址" value={this.state.mintToAddress}
                                                required
                                                sx={{m: 1, width: '25ch'}}
                                                onChange={this.handleChange}/></div>
                                <div><TextField id="mintUri" label="星级 空为随机1-5星" value={this.state.mintUri}
                                                sx={{m: 1, width: '25ch'}}
                                                onChange={this.handleChange}/></div>
                                <div>
                                    <Button type="button" variant="outlined" disabled={this.state.mintBtnDisabled}
                                            onClick={this.handleMint}>{mintBtnName}({this.state.totalSupply})</Button>
                                    <Button type="button" variant="outlined" sx={{ml: 1}}
                                            onClick={this.handleWithdrawBalance}>取出</Button>
                                </div>
                            </FormControl>
                        </form> : null}
                    <div>
                        <Snackbar
                            open={this.state.SnackbarOpen}
                            onClose={this.handleClose}
                            autoHideDuration={30000}
                            message={this.state.snackbarMsg}
                            anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                            action={action}
                        />
                    </div>
                </Box>
            </ThemeProvider>
        </div>)
    }
}


export default App;
