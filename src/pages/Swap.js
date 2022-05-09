import {SwapWidget} from '@uniswap/widgets'
import '@uniswap/widgets/fonts.css'

// Web3 provider as described in the requirements above
// import {provider} from './your/provider'

// Infura endpoint
const jsonRpcEndpoint = 'https://mainnet.infura.io/v3/<YOUR_INFURA_PROJECT_ID>'


class App extends React.Component {
    render() {
        return (
            <div className="Uniswap">
                <SwapWidget
                    // provider={provider}
                    jsonRpcEndpoint={jsonRpcEndpoint}
                />
            </div>
        )
    }
}

export default App;

