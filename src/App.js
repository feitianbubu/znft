import CardGiftCardIcon from '@mui/icons-material/CardGiftcard';
import CloseIcon from '@mui/icons-material/Close';
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
import SendGiftFormDialog from "./SendGiftFormDialog";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const jsonInterface = abiJson.nftAbi;
const USER_LOGIN_URL = abiJson.userLoginUrl;
const BASE_LP_URL = abiJson.baseLpUrl;

const AppName = 'Z-NFT';
let web3;
let user = {};
let connectBtnName = '连接钱包';
let contractBtnName = '获取信息';
let mintBtnName = '空投';
let contractBtnNameDisabled = false;

const theme = createTheme();

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
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
            mintUri: '',
            mintBtnDisabled: false,
            totalSupply: '',
            sellList: [],
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleMint = this.handleMint.bind(this);
        this.openSellDialog = this.openSellDialog.bind(this);
        this.copyText = this.copyText.bind(this);
    }

    componentDidMount() {
        console.log('componentDidMount');
    }

    copyText(event) {
        // 复制文本到剪贴板
        if(event.target.getAttribute('name') !== 'account') {
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

    handleClick = async () => {
        console.log('handleClick', connectBtnName);
        this.setState({connectBtnDisabled: true});
        if (user.account) {
            // 断开连接
            console.log('disconnect', user);
            connectBtnName = '连接钱包';
            this.setState({connectBtnDisabled: false});
            user = {};
            this.setState({user})
            this.forceUpdate();
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
        user.balance = await web3.eth.getBalance(user.account);
        user.network = await web3.eth.net.getNetworkType();
        connectBtnName = '断开钱包';
        this.setState({connectBtnDisabled: false});
        this.setState({contractAddress: '0x5A73bCA4986592E9B78a64c5392BA9b301CEe70d'});
        this.setState({user: user});

        let transactionConfirmationBlocks = web3.eth.transactionConfirmationBlocks;
        this.setState({transactionConfirmationBlocks});

        // 获取角色信息
        try {
            let userSync = await this.getUserInfo(user.account);
            let userInfo = await userSync.json();
            user.nickname = userInfo['nickName'];
            let token = userInfo.token;
            this.setState({token});
            this.setState({user});
        } catch (e) {
            user['getLpFail'] = e
            this.addOpenSnackbar("lp用户信息获取失败", e);
        }

        this.forceUpdate();
    };
    handleSubmit = async () => {
        let self = this;
        contractBtnName = '正在获取...';
        contractBtnNameDisabled = true;
        self.forceUpdate();
        console.log('handleSubmit', user, this.state);
        if (!user.account) {
            this.setState({snackbarMsg: "请先连接钱包"});
            this.setState({SnackbarOpen: true});
            contractBtnName = '获取信息';
            contractBtnNameDisabled = false;
            return;
        }

        let myContract = new web3.eth.Contract(jsonInterface, this.state.contractAddress);
        let balance = await myContract.methods['balanceOf'](user.account).call();
        balance = parseInt(balance);
        self.setState({contactBalance: `我的NFT: ${balance}`});

        let itemData = [];

        let count = 0;

        let indexArray = [];

        for (let i = 0; i < balance; i++) {
            let tokenId = await myContract.methods['tokenOfOwnerByIndex'](user.account, i).call();
            indexArray.push(tokenId);
        }
        indexArray = _.sortBy(indexArray);
        console.log('indexArray', indexArray);
        _.each(indexArray, function (index) {
            let row = {title: index};
            itemData.push(row);
        });
        self.setState({itemData});


        _.each(indexArray, async function (index) {
            // let index = await myContract.methods['tokenOfOwnerByIndex'](user.account, i).call();
            // console.log('tokenByIndex', index);
            let tokenURI = await myContract.methods['tokenURI'](index).call();
            console.log('tokenURI', tokenURI);
            let row = _.find(self.state.itemData, function (item) {
                return item.title === index;
            });
            row.img = tokenURI;
            // itemData.push(row);
            // self.setState({itemData});
            self.forceUpdate();
            if (++count === balance) {
                contractBtnName = '获取信息';
                contractBtnNameDisabled = false;
                self.forceUpdate();
            }
        });
        if (balance === 0) {
            self.setState({itemData});
            contractBtnName = '获取信息'
            contractBtnNameDisabled = false;
            self.forceUpdate();
        }

        // 获取交易列表
        try {
            let sellList = await fetch(BASE_LP_URL + '/SellList', {
                method: 'POST',
                headers: {
                    'Tevat-Authorization': this.state.token,
                },
                body: JSON.stringify({})
            }).then(res => res.json());
            sellList = sellList?.['Items'];
            console.log('sellList', sellList);
            this.setState({sellList});
        } catch (e) {
            this.addOpenSnackbar("交易列表获取失败", e);
        }

        // 获取合约创建者
        let contractOwner = await myContract.methods.owner().call();
        self.setState({contractOwner});
        console.log('contractOwner', contractOwner);

        let totalSupply = await myContract.methods.totalSupply().call();
        self.setState({totalSupply: `总量: ${totalSupply}`});
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
        let myContract = new web3.eth.Contract(jsonInterface, this.state.contractAddress);
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
            snackbarMsg += (json.message || JSON.stringify(json));
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
        let myContract = new web3.eth.Contract(jsonInterface, this.state.contractAddress);
        let mintToAddress = this.state.mintToAddress;
        let mintUri = this.state.mintUri;

        let totalSupply = await myContract.methods.totalSupply().call();
        console.log('totalSupply', totalSupply);
        let gasPrice = await web3.eth.getGasPrice();
        console.log('handleMint msg: ', mintToAddress, mintUri, gasPrice);
        this.setState({totalSupply: totalSupply});
        let toTokenId = parseInt(totalSupply) + 1;

        let method = myContract.methods['safeMint'](mintToAddress, toTokenId, mintUri);
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
        let actionName = '出售';
        if (this.isSold(event.target.name)) {
            //取回操作
            if (!confirm(`确认取回该物品吗?`)) {
                return;
            }
            actionName = '取回';
        } else {
            let price = prompt("请输入价格", "1");
            price = parseFloat(price);
            if (!_.isNumber(price) || price <= 0) {
                alert(`请输入正确的价格!`);
                return;
            }
            if (!confirm(`确认将该物品以${price}的价格出售吗?`)) {
                return;
            }
            body.uid = this.state.user.account;
        }
        let sellUrl = `${BASE_LP_URL}/Sell`;
        fetch(sellUrl, {
            method: 'POST',
            headers: {
                'Tevat-Authorization': this.state.token,
            },
            body: JSON.stringify(body)
        }).then(function (response) {
            return response.json();
        }).then(function () {
            self.addOpenSnackbar(`${actionName}成功: `);
        }).catch(function (e) {
            self.addOpenSnackbar(`${actionName}失败: `, e);
        });
        await self.handleSubmit();
    }
    isSold = (itemId) => {
        let find = _.find(this.state.sellList, (item) => {
            if (item.itemId === itemId) {
                return true;
            }
        });
        return !!find;
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
                            display: 'flex',
                            width: '100%',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <Typography type="title" color="inherit"
                                        sx={{fontSize: 24, fontWeight: 'bold'}}>
                                {AppName}
                            </Typography>
                            <Box>
                                <Box sx={{height: 20}}>
                                    {Object.keys(this.state.user).map((key, index) => {
                                        let title = this.state.user[key];
                                        let name = title;
                                        if(key === 'account') {
                                            name = title.substr(0, 6) + '...' + title.substr(name.length - 4);
                                        }
                                        if(key === 'balance') {
                                            // 显示以太币
                                            name = (title / web3.utils.unitMap.ether).toFixed(4);
                                        }
                                        return (<Box component="span" name={key} key={index} title={title} onClick={this.copyText}><span
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
                    <form>
                        <FormControl>
                            <Box sx={{display: 'flex'}}>
                                <TextField id="contractAddress" label="合约地址"
                                           value={this.state.contractAddress}
                                           required
                                           sx={{m: 2, width: '30ch'}}
                                           size="small"
                                           onChange={this.handleChange}/>

                                <TextField id="transactionConfirmationBlocks" label="确认区块数"
                                           value={this.state.transactionConfirmationBlocks}
                                           required
                                           sx={{m: 2, width: '6ch'}}
                                           size="small"
                                           type="number"
                                           onChange={this.handleChange}/>
                            </Box>
                            <div><Button type="button" variant="contained" disabled={contractBtnNameDisabled}
                                         onClick={this.handleSubmit}>{contractBtnName}</Button>
                            </div>
                        </FormControl>
                    </form>

                    <Box sx={{width: '80%', display: this.state.contactBalance ? '' : 'none'}}>
                        <Chip
                            label={this.state.contactBalance}
                            variant="outlined"
                        />
                    </Box>
                    <ImageList sx={{width: '80%'}} cols={5}>
                        {this.state.itemData.map((item) => {
                            return (<Box><ImageListItem key={item.title}>
                                    <img
                                        src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
                                        srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                        alt={item.title}
                                        loading="lazy"
                                        onError={this.addDefaultSrc}
                                    />
                                    <ImageListItemBar
                                        title={`tokenId: ${item.title}`}
                                    />

                                </ImageListItem>
                                    <Box sx={{display: 'flex', justifyContent: 'space-around', m: 1}}>
                                        <Button name={item.title} variant="contained" endIcon={<CardGiftCardIcon/>}
                                                onClick={this.openSendGiftDialog}>
                                            赠送
                                        </Button>
                                        <Button name={item.title} variant="contained"
                                                endIcon={this.isSold(item.title) ? <ShoppingCartCheckoutIcon/> :
                                                    <ShoppingCartIcon/>}
                                                onClick={this.openSellDialog}
                                                color={this.isSold(item.title) ? 'secondary' : 'success'}>
                                            {this.isSold(item.title) ? '取回' : '出售'}
                                        </Button>
                                    </Box>
                                </Box>
                            )
                        })}
                    </ImageList>
                    <SendGiftFormDialog open={this.state.dialogOpen} onOpenChange={this.onOpenChange}
                                        onChange={this.handleChange} onClick={this.handleSendGift}/>
                    {(this.state.user.account && (this.state.user.account === this.state.contractOwner)) ? <form>
                        <FormControl>
                            <div><TextField id="mintToAddress" label="空投地址" value={this.state.mintToAddress}
                                            required
                                            sx={{m: 1, width: '25ch'}}
                                            onChange={this.handleChange}/></div>
                            <div><TextField id="mintUri" label="tokenUri" value={this.state.mintUri} required
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

    async getUserInfo(accountId) {
        return await fetch(`${USER_LOGIN_URL}`, {method: "POST", body: JSON.stringify({accountId})})
    }
}


export default App;
