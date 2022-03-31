import './App.css';
import React from 'react';
import Web3 from "web3";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {Box, Chip, FormControl, Tooltip} from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import CardGiftCardIcon from '@mui/icons-material/CardGiftcard';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import _ from 'lodash';
import SendGiftFormDialog from "./SendGiftFormDialog";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import abiJson from './config/abi.json';

const jsonInterface = abiJson.nftAbi;

const AppName = 'Z-NFT';
const CONTRACT_OWNER_ADDRESS = '0xf7c5921DAa96F045851509a62a005Af19dADEe23';
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
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleMint = this.handleMint.bind(this);
    }

    componentDidMount() {
        console.log('componentDidMount');
    }

    handleClick = async () => {
        console.log('handleClick', connectBtnName);
        this.setState({connectBtnDisabled: true});
        if (user.account) {
            console.log('disconnect', user);
            user = {};
            connectBtnName = '连接钱包';
            this.setState({connectBtnDisabled: false});
            this.setState({user})
            this.forceUpdate();
            return;
        }
        connectBtnName = '正在连接...';
        web3 = new Web3(Web3.givenProvider);
        user.account = (await web3.eth.getAccounts())[0];
        if (!user.account) {
            this.addOpenSnackbar('请先解锁钱包');
            connectBtnName = '连接钱包';
            this.setState({connectBtnDisabled: false});
            this.forceUpdate();
            return;
        }
        user.balance = web3.utils.fromWei(await web3.eth.getBalance(user.account));
        user.networkType = await web3.eth.net.getNetworkType();
        connectBtnName = '断开钱包';
        this.setState({connectBtnDisabled: false});
        this.setState({contractAddress: '0x5A73bCA4986592E9B78a64c5392BA9b301CEe70d'});
        this.setState({user: user});
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
            contractBtnName = '获取信息'
            contractBtnNameDisabled = false;
            return;
        }

        let myContract = new web3.eth.Contract(jsonInterface, this.state.contractAddress);
        let balance = await myContract.methods['balanceOf'](user.account).call();
        self.setState({contactBalance: `我的NFT: ${balance}`});

        let itemData = [];

        let count = 0;
        _.times(parseInt(balance), async function (i) {
            let index = await myContract.methods['tokenOfOwnerByIndex'](user.account, i).call();
            console.log('tokenByIndex', index);
            let tokenURI = await myContract.methods['tokenURI'](index).call();
            console.log('tokenURI', tokenURI);
            // if(!_.startsWith(tokenURI, 'http')) {
            //     continue;
            // }
            let row = {title: index, img: tokenURI};
            itemData.push(row);
            self.setState({itemData});
            self.forceUpdate();
            if (++count === parseInt(balance)) {
                contractBtnName = '获取信息'
                contractBtnNameDisabled = false;
                self.forceUpdate();
            }
        });
        if (balance === '0') {
            self.setState({itemData});
            contractBtnName = '获取信息'
            contractBtnNameDisabled = false;
            self.forceUpdate();
        }

        let totalSupply = await myContract.methods.totalSupply().call();
        self.setState({totalSupply: `总量: ${totalSupply}`});
        self.forceUpdate();
    };

    handleChange(event) {
        console.log('handleChange', event.target.id, event.target.value);
        let state = {};
        state[event.target.id] = event.target.value;
        this.setState(state);
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
            this.setState({snackbarMsg: "请先连接钱包"});
            this.setState({SnackbarOpen: true});
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
        let tx = await method.send({
            from: user.account,
            gasPrice: gasPrice,
            gas: gasLimit
        });
        console.log('tx', tx);
        self.setState({snackbarMsg: "赠送成功"});
        self.setState({SnackbarOpen: true});
        await self.handleSubmit();
    };
    onOpenChange = (open) => {
        console.log('onOpenChange', open);
        this.setState({dialogOpen: open});
        this.forceUpdate();
    };

    addOpenSnackbar = (snackbarMsg) => {
        if (!snackbarMsg) {
            return;
        }
        console.log('addOpenSnackbar snackbarMsg:', snackbarMsg);
        this.setState({snackbarMsg});
        this.setState({SnackbarOpen: true});
    };
    handleClose = () => {
        console.log('handleClose');
        this.setState({SnackbarOpen: false});
    };

    handleMint = async () => {
        let self = this;
        console.log('handleMint', user, this.state);
        if (!user.account) {
            this.setState({snackbarMsg: "请先连接钱包"});
            this.setState({SnackbarOpen: true});
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
            from: user.account,
            gasPrice: gasPrice,
            gas: gasLimit
        });
        console.log('tx', tx);
        self.setState({snackbarMsg: "空投成功"});
        self.setState({SnackbarOpen: true});
        await self.handleSubmit();
    };

    render() {

        const action = (
            <React.Fragment>
                <IconButton
                    size="small"
                    aria-label="close"
                    color="inherit"
                    onClick={this.handleClose}
                >
                    <CloseIcon fontSize="small"/>
                </IconButton>
            </React.Fragment>
        );

        return (<div className="App">
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <AppBar position="relative">
                    <Toolbar>
                        <Box sx={{display: 'flex', width: '100%', justifyContent: 'space-between'}}>
                            <Typography type="title" color="inherit"
                                        sx={{fontSize: 24, fontWeight: 'bold'}}>
                                {AppName}
                            </Typography>
                            <Box>
                                <Box sx={{height: 15}}>
                                    {this.state.user.account ?
                                        <Box sx={{width: '100%', textAlign: 'right', display: 'flex'}}>
                                            <Typography variant="body2" gutterBottom component="div"
                                                        sx={{display: 'flex'}}
                                                        title={this.state.user.networkType}>
                                                <Box className='name'>网络:</Box>{_.truncate(this.state.user.networkType, {length: 10})}
                                            </Typography>
                                            <Tooltip title={this.state.user.account} enterDelay={500} leaveDelay={200}>
                                                <Typography variant="body2" gutterBottom component="div"
                                                            sx={{display: 'flex', mx: 3}}>
                                                    <Box className='name'>账号:</Box>
                                                    {_.truncate(this.state.user.account, {length: 10})}
                                                </Typography>
                                            </Tooltip>
                                            <Typography variant="body2" gutterBottom component="div"
                                                        sx={{display: 'flex'}}
                                                        title={this.state.user.balance}>
                                                <Box className='name'>余额:</Box>{_.truncate(this.state.user.balance, {length: 10})}
                                            </Typography>
                                        </Box>
                                        : null
                                    }
                                </Box>
                                <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
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
                            <div><TextField id="contractAddress" label="合约地址" value={this.state.contractAddress}
                                            required
                                            sx={{m: 2, width: '50ch'}}
                                            onChange={this.handleChange}/></div>
                            <div><Button type="button" variant="contained" disabled={contractBtnNameDisabled}
                                         onClick={this.handleSubmit}>{contractBtnName}</Button></div>
                        </FormControl>
                    </form>

                    <Box sx={{width: '80%', testAlign: 'left', display: this.state.contactBalance ? '' : 'none'}}>
                        <Chip
                            label={this.state.contactBalance}
                            variant="outlined"
                        />
                    </Box>
                    <ImageList sx={{width: '80%'}} cols={5} rowHeight={'auto'}>
                        {this.state.itemData.map((item) => (
                            <ImageListItem key={item.title}>
                                <img
                                    src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
                                    srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                    alt={item.title}
                                    loading="lazy"
                                    onError={this.addDefaultSrc}
                                />
                                <Button name={item.title} variant="contained" endIcon={<CardGiftCardIcon/>}
                                        onClick={this.openSendGiftDialog}>
                                    赠送
                                </Button>
                                <ImageListItemBar
                                    title={`tokenId: ${item.title}`}
                                    position="below"
                                />
                            </ImageListItem>
                        ))}
                    </ImageList>
                    <SendGiftFormDialog open={this.state.dialogOpen} onOpenChange={this.onOpenChange}
                                        onChange={this.handleChange} onClick={this.handleSendGift}/>
                    {this.state.user.account === CONTRACT_OWNER_ADDRESS ?
                        <form>
                            <FormControl>
                                <div><TextField id="mintToAddress" label="空投地址" value={this.state.mintToAddress}
                                                required
                                                sx={{m: 1, width: '25ch'}}
                                                onChange={this.handleChange}/></div>
                                <div><TextField id="mintUri" label="uri" value={this.state.mintUri} required
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
                            autoHideDuration={6000}
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
