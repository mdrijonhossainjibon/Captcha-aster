import { ethers } from 'ethers';
import { getERC20Decimals, formatTokenBalance } from 'auth-fingerprint';

/**
 * Get deposit history for a token and wallet (Custom version with 5-minute lookback)
 * @param tokenAddress - ERC20 token contract address
 * @param walletAddress - Wallet address to check deposits for
 * @param rpcUrl - RPC URL
 * @returns Array of deposit events
 */
export async function getDepositHistory(tokenAddress: string, walletAddress: string, rpcUrl: string) {
    const ERC20_ABI = [
        "event Transfer(address indexed from, address indexed to, uint256 value)"
    ];

    try {
        const provider = new ethers.JsonRpcProvider(rpcUrl);
        const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);

        // Get current block
        const currentBlock = await provider.getBlockNumber();
      
        
        const fromBlock = currentBlock - 100

        // Filter Transfer events to this wallet (deposit = to this wallet)
        const filter = contract.filters.Transfer(null, walletAddress);
 
        const events = await contract.queryFilter(filter, fromBlock, currentBlock);


   

        const recentDeposits = [];
        for (const event of events) {
            // Ensure we have an EventLog with args
            if ('args' in event && event.args) {
                const block = await provider.getBlock(event.blockNumber);
                if (block) {
                    recentDeposits.push({
                        from: event.args[0], // from
                        to: event.args[1],   // to
                        amount: event.args[2]?.toString() || '0', // value/amount
                        timestamp: new Date(block.timestamp * 1000).toISOString(),
                        txHash: event.transactionHash
                    });
                }
            }
        }

        return recentDeposits;
    } catch (error) {
        console.log(error)
        return [];
    }
}

export { getERC20Decimals, formatTokenBalance };