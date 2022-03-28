import './App.css';
import React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Web3 from "web3";


let web3;
let user = {};
let connectBtnName = '连接钱包';

function UserInfo(props) {
    console.log('UserInfo: ', props);
    if (props.user.account) {
        return (
            <div>
                <div>账号: {props.user.account}</div>
                <div>余额: {props.user.balance}</div>
            </div>
        )
    } else {
        return (
            <div>请先连接钱包</div>
        )
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value: ''};
        this.handleChange = this.handleChange.bind(this);
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
            this.forceUpdate();
            return;
        }
        connectBtnName = '正在连接...';
        web3 = new Web3(Web3.givenProvider);
        user.account = (await web3.eth.getAccounts())[0];
        user.balance = web3.utils.fromWei(await web3.eth.getBalance(user.account));
        connectBtnName = '断开钱包';
        this.setState({connectBtnDisabled: false});
        this.forceUpdate();
    };
    handleTranscation = async () => {
        console.log('handleTranscation', user, this.state);
        if (!user.account) {
            alert('请先连接钱包');
            return;
        }
        let msg = {
            from: user.account,
            to: this.state.toAccount,
            value: web3.utils.toWei(this.state.toBalance, 'ether')
        }
        web3.eth.sendTransaction(msg).then(function (result) {
            console.log('then: ', result);
        }).catch(function (err) {
            console.log('catch: ', err);
        });
    };

    handleChange(event) {
        console.log('handleChange', event.target.id);
        let state = {};
        state[event.target.id] = event.target.value;
        this.setState(state);
    }

    render() {
        return (
            <div className="App">
                <header className="App-header" align="left">
                    <div>
                        <Button id="connectBtn" variant="contained" disabled={this.state.connectBtnDisabled} onClick={this.handleClick}>{connectBtnName}</Button>
                    </div>
                    <div>
                        <UserInfo user={user}/>
                    </div>

                    <div>
                        <form>
                        <p></p>
                        <div><TextField id="toBalance" label="输入金额" value={user.toBalance} required sx={{ m: 1, width: '25ch' }} type="number"
                                        onChange={this.handleChange}/></div>
                        <div><TextField id="toAccount" label="输入收款账号" value={user.toAccount} required sx={{ m: 1, width: '25ch' }}
                                        onChange={this.handleChange}/></div>
                        <div><Button  type="submit" variant="contained" onClick={this.handleTranscation}>确认</Button></div>
                            </form>
                    </div>


                </header>
            </div>
        )
    }
}

export default App;
