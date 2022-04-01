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
        this.state = {props, to: ''};
        this.handleClose = this.handleClose.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleClose = () => {
        this.state.props.onOpenChange(false);
    };
    handleClick = (ev) => {
        console.log('handleClick', ev);
        this.state.props.onClick(ev, {to: this.state.to})
        this.state.props.onOpenChange(false);
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