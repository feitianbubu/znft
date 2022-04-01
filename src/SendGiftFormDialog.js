import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {Box} from "@mui/material";

class App extends React.Component {
    constructor(props) {
        console.log('constructor', props);
        super(props);
        this.state = {props, to: '', toProps: {}};
        this.handleClose = this.handleClose.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleClose = () => {
        this.state.props.onOpenChange(false);
    };
    handleClick = (ev) => {
        console.log('handleClick', ev);
        let to = this.state.to;
        // check to not a NFT address
        if (to.length !== 42 || to.substr(0, 2) !== '0x') {
            let toProps = {error: true};
            this.setState({toProps})
            ev.preventDefault();
            return;
        }
        this.state.props.onClick(ev, {to})
        this.state.props.onOpenChange(false);
        this.setState({toProps: {}});
        ev.preventDefault();
    };

    handleChange = (e) => {
        console.log('dialog onChange', e.target);
        this.setState({[e.target.id]: e.target.value});
        this.state.props.onChange(e);
    }

    render() {
        return (
            <Dialog open={this.props.open} onClose={this.handleClose} fullWidth>
                <Box component="form" onSubmit={this.handleClick}>
                    <DialogTitle>赠送</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                        </DialogContentText>
                        <TextField
                            error={this.state.toProps.error}
                            helperText={this.state.toProps.error ? '请输入合法的地址' : ''}
                            required
                            autoFocus
                            margin="dense"
                            id="to"
                            label="赠送地址"
                            fullWidth
                            variant="standard"
                            value={this.props.to}
                            onChange={this.handleChange}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose}>取消</Button>
                        <Button type="submit">确认</Button>
                    </DialogActions>
                </Box>
            </Dialog>
        );
    }
}

export default App;