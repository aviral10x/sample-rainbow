import { ConnectButton } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { ethers } from "ethers";
import { useSigner, useProvider, useAccount } from 'wagmi'
import { useState, useEffect } from "react";
import { ERC_20_ABI } from './constants/abi'
import './App.css'

export const Demo = () => {

    const { isConnected } = useAccount()
    const provider = useProvider()
    const { data: signer } = useSigner()
  
    const [consoleMsg, setConsoleMsg] = useState<null|string>(null)
    const [consoleLoading, setConsoleLoading] = useState<boolean>(false)
    const [output, setOutput] = useState('');
  
    const appendConsoleLine = (message: string) => {
      return (setConsoleMsg((prevState => {
        return `${prevState}\n\n${message}`
      })))
    }
    
    const resetConsole = () => {
      setConsoleMsg(null)
      setConsoleLoading(true)
    }
  
    const addNewConsoleLine = (message: string) => {
      setConsoleMsg((() => {
        return (message)
      }))
    }
  
    const consoleWelcomeMessage = () => {
      setConsoleLoading(false)
      setConsoleMsg('Status: Wallet not connected. Please connect wallet to use Methods')
    }
  
    const consoleErrorMesssage = () => {
      setConsoleLoading(false)
      setConsoleMsg('An error occurred')
    }
  
    useEffect(() => {
      if (isConnected) {
        setConsoleMsg('Wallet connected!')
      } else {
        consoleWelcomeMessage()
      }
    }, [isConnected])
  
    const getChainID = async () => {
      try {
        resetConsole()
        //@ts-ignore
        const chainId = await signer.getChainId()
        console.log('signer.getChainId()', chainId)
        addNewConsoleLine(`signer.getChainId(): ${chainId}`)
        setConsoleLoading(false)
        setOutput(JSON.stringify(chainId.toString()));
      } catch(e) {
        console.error(e)
        consoleErrorMesssage()
      }
    }
  
    const getBalance = async () => {
      try {
        resetConsole()
        //@ts-ignore
        const account = await signer.getAddress()

        console.log(" This is account ", account);
        const balanceChk1 = await provider!.getBalance(account)
        console.log('balance check 1', balanceChk1.toString())
        addNewConsoleLine(`balance check 1: ${balanceChk1.toString()}`)

        setOutput(JSON.stringify(balanceChk1))

        //@ts-ignore
        const balanceChk2 = await signer.getBalance()
        console.log('balance check 2', balanceChk2.toString())
        appendConsoleLine(`balance check 2: ${balanceChk2.toString()}`)
        setConsoleLoading(false) 
      } catch(e) {
        console.error(e)
        consoleErrorMesssage()
      }
    }
  
  
    const getNetworks = async () => {
      try {
        resetConsole()
        const network = await provider!.getNetwork() 
        console.log('networks:', network)
        setOutput(JSON.stringify(network));
        addNewConsoleLine(`networks: ${JSON.stringify(network)}`)
        setConsoleLoading(false) 
      } catch(e) {
        console.error(e)
        consoleErrorMesssage()
      }
    }
  
    const signMessage = async () => {
      try {
        resetConsole()  
        const message = `Hello World`
    
    
        // sign
        console.log(" This is signer ", signer)
        //@ts-ignore
        const sig = await signer.signBananaMessage(message)
        console.log('signature:', sig)
        setOutput(JSON.stringify(sig));
    
        addNewConsoleLine(`signature: ${sig}`)

        setConsoleLoading(false) 
      } catch(e) {
        console.error(e)
        consoleErrorMesssage()
      }
    }
  
    const sendETH = async () => {
      try {
        resetConsole()

        //@ts-ignore
        console.log(`Transfer txn on ${signer.getChainId()}`)
        //@ts-ignore
        addNewConsoleLine(`Transfer txn on ${signer.getChainId()}`)
    
        const toAddress = ethers.Wallet.createRandom().address
    
        const tx1 = {
          gasLimit: '0x55555',
          to: toAddress,
          value: ethers.utils.parseEther('0.000001'),
          data: '0x'
        }
    
        // const balance1 = await provider!.getBalance(toAddress)
        // console.log(`balance of ${toAddress}, before:`, balance1)
        // appendConsoleLine(`balance of ${toAddress}, before: ${balance1}`)
        //@ts-ignore
        const txnResp = await signer.sendTransaction(tx1)
        // await txnResp.wait()
        setOutput(JSON.stringify(txnResp));
    
        // const balance2 = await provider!.getBalance(toAddress)
        // console.log(`balance of ${toAddress}, after:`, balance2)
        // appendConsoleLine(`balance of ${toAddress}, after: ${balance2}`)
        setConsoleLoading(false) 
      } catch(e) {
        console.error(e)
        consoleErrorMesssage()
      }
    }
  
    const sendDAI = async () => {
      try {
        resetConsole()
        const toAddress = ethers.Wallet.createRandom().address
    
        const amount = ethers.utils.parseUnits('5', 18)
    
        const daiContractAddress = '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063' // (DAI address on Polygon)
    
        const tx = {
          gasLimit: '0x55555',
          to: daiContractAddress,
          value: 0,
          data: new ethers.utils.Interface(ERC_20_ABI).encodeFunctionData('transfer', [toAddress, amount.toHexString()])
        }

        //@ts-ignore
        const txnResp = await signer.sendTransaction(tx)
        await txnResp.wait()
        
    
        console.log('transaction response', txnResp)
        addNewConsoleLine(`TX response ${JSON.stringify(txnResp)}`)
        setConsoleLoading(false) 
      } catch(e) {
        console.error(e)
        consoleErrorMesssage()
      }
    }
  

    const getWalletActions = () => {
        if (!isConnected) {
          return null
        }
        return (
          <>
            {/* <Box marginBottom="4">
              <Text>Please open your browser dev inspector to view output of functions below</Text>
            </Box> */}
              <button className="action-btn" onClick={() => getChainID()}>
                ChainID
              </button>
              <button className="action-btn" onClick={() => getNetworks()}>
                Networks
              </button>
              <button className="action-btn" onClick={() => getBalance()}>
                Get Balance
              </button>
    
              <button className="action-btn" onClick={() => signMessage()}>
                Sign Message
              </button>
    
              <button className="action-btn" onClick={() => sendETH()}>
                Send ETH
              </button>
            </>
        )
      }

  return (
    <div className="connect-div">
      <h1 className="stylish-heading"> Account Abstraction</h1>
      <h2 className="stylish-heading"> Banana SDK with Rainbow Kit </h2>
      <div style={{width: '150px', margin: '0 auto'}}>
        <ConnectButton />
      </div>
      {getWalletActions()}
      <h4 className="stylish-heading"> Output </h4>
      <div className="output-div">
        <p>{output}</p>
      </div>
    </div>
  );
};

