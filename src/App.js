import CardGiftCardIcon from '@mui/icons-material/CardGiftcard';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import {Box, Chip, FormControl} from '@mui/material';
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
import React from 'react';
import Web3 from "web3";
import './App.css';
import abiJson from './config/abi.json';
import heroClockAuctionJson from './config/HeroClockAuction.json';
import heroCoreJson from './config/HeroCore.json';
import SendGiftFormDialog from "./SendGiftFormDialog";

const jsonInterface = heroCoreJson.abi;
const auctionJsonInterface = heroClockAuctionJson;
const contractAddress = abiJson.contractAddress;

const AppName = 'Z-NFT';
// 定义货币单位
const CURRENCY_UNIT = 'ETH';
const pages = [{name: '市场', id: 'market'}, {name: '我的', id: 'my'}];
let web3;
let user = {};
let connectBtnName = '连接钱包';
let contractBtnName = '获取合约';
let mintBtnName = '空投';
let contractBtnNameDisabled = false
let selectPageId = 'market';

const theme = createTheme();
const initState = {
    value: '',
    rows: [],
    contractAddress: '',
    transactionConfirmationBlocks: '',
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
    mintUri: '1',
    mintBtnDisabled: false,
    totalSupply: '',
    sellList: [],
    nftInfo: {},
    connectBtnDisabled: false,
    contactBalance: '',
    whitelistedSpawner: false,
    selectPageId: selectPageId,
};

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = initState;
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleMint = this.handleMint.bind(this);
        this.openSellDialog = this.openSellDialog.bind(this);
        this.copyText = this.copyText.bind(this);
        this.disconnectWallet = this.disconnectWallet.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.handleChangePage = this.handleChangePage.bind(this);
    }

    componentDidMount() {
        console.log('componentDidMount');
        web3 = new Web3(Web3.givenProvider);
        let auctionContract = new web3.eth.Contract(auctionJsonInterface, abiJson.auctionContractAddress);
        let heroContract = new web3.eth.Contract(jsonInterface, contractAddress);
        this.setState({auctionContract});
        this.setState({heroContract});
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
            this.setState({connectBtnDisabled: false});
            this.setState({contractAddress});
            this.setState({user: user});
            let transactionConfirmationBlocks = web3.eth.transactionConfirmationBlocks;
            this.setState({transactionConfirmationBlocks});
        } catch (e) {
            this.disconnectWallet();
            this.addOpenSnackbar('metamask连接失败', e);
            return;
        }

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
        contractBtnName = '正在获取...';
        contractBtnNameDisabled = true;
        self.forceUpdate();
        console.log('handleSubmit', user, this.state);


        let itemData = [];
        let indexArray = [];
        if (selectPageId === 'market') {
            // 显示auction所有tokenId
            indexArray = await this.state.heroContract.methods.tokenOf(abiJson.auctionContractAddress).call();
        } else if (selectPageId === 'my') {
            if (!user.account) {
                // self.disconnectWallet();
                self.addOpenSnackbar("请先连接钱包");
                return;
            }

            let totalSupply = await self.state.heroContract.methods.totalSupply().call().catch(e => self.addOpenSnackbar("合约总量获取失败", e));
            totalSupply = parseInt(totalSupply);

            self.setState({totalSupply: `总量: ${totalSupply}`});

            let balance = await self.state.heroContract.methods['balanceOf'](user.account).call();
            balance = parseInt(balance);

            let name = await self.state.heroContract.methods['name']().call();
            let symbol = await self.state.heroContract.methods['symbol']().call();
            self.setState({contactBalance: `我的${name}: ${balance} ${symbol}`});

            // 显示我的
            for (let i = 0; i < balance; i++) {
                let tokenId = await self.state.heroContract.methods['tokenOfOwnerByIndex'](user.account, i).call();
                indexArray.push(tokenId);
            }
            indexArray = _.sortBy(indexArray);
        }
        console.log('indexArray', indexArray);
        _.each(indexArray, function (index) {
            let row = {title: index};
            itemData.push(row);
        });
        self.setState({itemData});


        _.each(indexArray, async function (index, i) {
            let heroInfo = await self.state.heroContract.methods['getHero'](index).call();
            let ownerOf = await self.state.heroContract.methods['ownerOf'](index).call();
            console.log('heroInfo', heroInfo);
            let row = _.find(self.state.itemData, function (item) {
                return item.title === index;
            });
            row.quantity = heroInfo[0];
            row.createTime = heroInfo[1];
            row.img = row.quantity;
            row.ownerOf = ownerOf;
            if (row.ownerOf === abiJson.auctionContractAddress) {
                // 查询拍卖状态
                console.log('========================', self.state.auctionContract);
                let auctions = await self.state.auctionContract.methods['auctions'](contractAddress, index).call().catch(e => self.addOpenSnackbar("拍卖状态获取失败", e));
                console.log('getAuction', auctions, index);
                row.seller = auctions.seller;
                row.currentPrice = await self.state.auctionContract.methods['getCurrentPrice'](contractAddress, index).call().catch(e => self.addOpenSnackbar("拍卖价格获取失败", e));
            }
            // itemData.push(row);
            // self.setState({itemData});
            self.forceUpdate();
            if (i === (indexArray.length - 1)) {
                contractBtnName = '获取合约';
                contractBtnNameDisabled = false;
                self.forceUpdate();
            }
        });
        // if (balance === 0) {
        //     self.setState({itemData});
        //     contractBtnName = '获取合约'
        //     contractBtnNameDisabled = false;
        //     self.forceUpdate();
        // }

        // 获取合约创建者
        // let contractOwner = await myContract.methods.owner().call().catch(e => self.addOpenSnackbar("合约创建者获取失败", e));
        // self.setState({contractOwner});
        // console.log('contractOwner', contractOwner);
        // 是否可以空投
        // let whitelistedSpawner = await self.state.heroContract.methods.whitelistedSpawner(self.state.user.account).call().catch(e => self.addOpenSnackbar("是否可以空投获取失败", e));
        // self.setState({whitelistedSpawner});

        self.forceUpdate();
    };

    handleChange(event) {
        console.log('handleChange', event.target.id, event.target.value);
        let state = {};
        state[event.target.id] = event.target.value;
        this.setState(state);

        if (event.target.id === 'transactionConfirmationBlocks') {
            web3.eth.transactionConfirmationBlocks = parseInt(event.target.value);
            this.addOpenSnackbar('设置成功: 确认区块数=' + event.target.value);
        }
    }

    addDefaultSrc(ev) {
        ev.target.src = 'img/empty.jpg';
    }

    openSendGiftDialog = (event) => {
        let tokenId = event.target.name;
        if (!tokenId) {
            return;
        }
        console.log('openSendGiftDialog', tokenId);
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
                from: user.account, gasPrice: gasPrice, gas: gasLimit
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
        let mintUri = this.state.mintUri;

        let totalSupply = await myContract.methods.totalSupply().call();
        console.log('totalSupply', totalSupply);
        let gasPrice = await web3.eth.getGasPrice();
        console.log('handleMint msg: ', mintToAddress, mintUri, gasPrice);
        this.setState({totalSupply: totalSupply});

        let method = myContract.methods['spawnHero'](mintUri, mintToAddress);
        let gasLimit = await method.estimateGas({from: user.account});
        console.log('gasPrice', gasPrice);
        console.log('gasLimit', gasLimit);
        let tx = await method.send({
            from: user.account, gasPrice: gasPrice, gas: gasLimit
        });
        console.log('tx', tx);
        self.setState({snackbarMsg: "空投成功"});
        self.setState({SnackbarOpen: true});
        await self.handleSubmit();
    };

    openSellDialog = async (event) => {
        let self = this;
        let body = {
            itemId: event.target.name,
        }
        let price = prompt("请输入价格", "1");
        price = parseFloat(price);
        if (!_.isNumber(price) || price <= 0) {
            alert(`请输入正确的价格!`);
            return;
        }
        price = web3.utils.toWei(price.toString(), 'ether');
        body.uid = this.state.user.account;
        body.price = price;

        // createAuction
        let method = self.state.auctionContract.methods['createAuction'](contractAddress, body.itemId, body.price, body.price, 6000000);
        console.log(contractAddress, body.itemId, body.price, body.price, 0);
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
    handCancelAuction = async (event) => {
        let self = this;
        let body = {
            itemId: event.target.name,
        }
        let actionName = '取消拍卖';
        if (!confirm(`确认取消拍卖该物品吗?`)) {
            return;
        }
        // cancelAuction
        let method = self.state.auctionContract.methods['cancelAuction'](contractAddress, body.itemId);
        console.log(contractAddress, body.itemId);
        let gasLimit = await method.estimateGas({from: user.account});
        let gasPrice = await web3.eth.getGasPrice();
        console.log('gasPrice', gasPrice);
        console.log('gasLimit', gasLimit);
        let tx = await method.send({
            from: user.account, gasPrice: gasPrice, gas: gasLimit
        }).catch(e => {
            self.addOpenSnackbar(`${actionName}失败:`, e);
        });
        console.log('tx', tx);
        self.addOpenSnackbar(`${actionName}成功`);

        await self.handleSubmit();
    }
    handBid = async (event) => {
        let self = this;
        let itemId = event.target.name;
        let actionName = '购买';
        // 获取event.target的currentPrice
        let price = event.target.getAttribute('currentprice');
        if (!confirm(`确认将该物品以${web3.utils.fromWei(price)}${CURRENCY_UNIT}的价格购买吗?`)) {
            return;
        }

        // createAuction
        let method = self.state.auctionContract.methods['bid'](contractAddress, itemId);
        console.log(contractAddress, itemId, price);
        let tx = await method.send({
            from: user.account, value: price
        }).catch(e => {
            self.addOpenSnackbar(`${actionName}失败:`, e);
        });
        console.log('tx', tx);
        self.addOpenSnackbar(`${actionName}成功`);

        await self.handleSubmit();
    }
    handleChangePage = async (event) => {
        console.log('handleChangePage', event, event.target.id, document.getElementById(event.target.id));
        selectPageId = event.target.id;
        this.setState({selectPageId})
        console.log('this.state.selectPageId', event.target.id, selectPageId);
        await this.handleSubmit();
    };

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
                <Box className='App-body'>
                    <Box>
                        <Chip sx={{display: this.state.contactBalance ? '' : 'none'}}
                              label={this.state.contactBalance}
                              variant="outlined"
                        />
                    </Box>
                    <ImageList sx={{width: '80%'}} cols={5}>
                        {this.state.itemData.map((item) => {
                            // 显示格式化时间
                            // let showCreateTime = moment(item.createTime * 1000).format('YYYY-MM-DD HH:mm:ss');
                            if (item.quantity) {
                                // quantity转化为五星个数
                                item.star = _.times(Math.max(item.quantity, 5), _.constant('★')).join('');
                            }
                            //
                            // 显示格式化地址
                            let ownerOf = '';
                            if (item.ownerOf) {
                                ownerOf = item.ownerOf.substr(0, 6) + '...' + item.ownerOf.substr(item.ownerOf.length - 4);
                                if (item.ownerOf === this.state.user.account) {
                                    ownerOf = '★我的';
                                } else if (item.ownerOf === abiJson.auctionContractAddress) {
                                    ownerOf = '$出售中:' + (item.currentPrice / web3.utils.unitMap.ether).toFixed(4) + CURRENCY_UNIT;
                                } else {
                                    ownerOf = '@' + ownerOf;
                                }
                            }
                            let isSeller = item.currentPrice && (item.seller === this.state.user.account);
                            let isBuyer = item.currentPrice && !isSeller;
                            let buttonDisplay = (this.state.user.account === item.ownerOf) ? 'flex' : 'none';
                            return (<Box key={item.title}><ImageListItem>
                                <img
                                    src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
                                    srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                    alt={item.title}
                                    loading="lazy"
                                    onError={this.addDefaultSrc}
                                />
                                <ImageListItemBar
                                    title={`${ownerOf}`}
                                    subtitle={`${item.title}.${item.star ?? ''}`}
                                />

                            </ImageListItem>
                                <Box sx={{display: buttonDisplay, justifyContent: 'space-around', m: 1}}>
                                    <Button name={item.title} variant="contained" endIcon={<CardGiftCardIcon/>}
                                            onClick={this.openSendGiftDialog}>
                                        赠送
                                    </Button>
                                    <Button name={item.title} variant="contained"
                                            endIcon={<ShoppingCartIcon/>}
                                            onClick={this.openSellDialog}
                                            color={'secondary'}>
                                        出售
                                    </Button>
                                </Box>
                                {isSeller ?
                                    <Button name={item.title} variant="contained" endIcon={<ShoppingCartCheckoutIcon/>}
                                            color={'warning'}
                                            onClick={this.handCancelAuction}>
                                        取回
                                    </Button> : null}
                                {isBuyer ?
                                    <Button name={item.title} currentprice={item.currentPrice} variant="contained"
                                            endIcon={<CardGiftCardIcon/>}
                                            color={'success'}
                                            onClick={this.handBid}>
                                        购买
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
                                <div><TextField id="mintUri" label="quality" value={this.state.mintUri} required
                                                sx={{m: 1, width: '25ch'}}
                                                onChange={this.handleChange}/></div>
                                <div><Button type="button" variant="contained" disabled={this.state.mintBtnDisabled}
                                             onClick={this.handleMint}>{mintBtnName}({this.state.totalSupply})</Button>
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
