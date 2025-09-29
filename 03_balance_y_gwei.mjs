import 'dotenv/config';
import { createPublicClient, http, formatEther, parseGwei } from 'viem';
import { sepolia, mainnet } from 'viem/chains';

async function main() {
  const url = process.env.ALCHEMY_URL;
  if (!url) throw new Error('ALCHEMY_URL no definido en .env');
  const chain = url.includes('mainnet') ? mainnet : sepolia;

  const client = createPublicClient({ chain, transport: http(url) });

  // Dirección por argumento (o una conocida)
  const address = process.argv[2] || '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'; // (Vitalik)
  const balanceWei = await client.getBalance({ address });
  console.log(`Red: ${chain.name}`);
  console.log(`Address: ${address}`);
  console.log(`Balance: ${formatEther(balanceWei)} ETH`);

  // Datos de fee/gas
  const feeData = await client.getGasPrice(); // gasPrice “legacy”
  console.log(`Gas price aproximado: ${feeData} wei (~${Number(feeData) / 1e9} gwei)`);

  // (Opcional) EIP-1559
  const fee = await client.estimateFeesPerGas().catch(() => null);
  if (fee) {
    console.log(`Base fee: ${Number(fee.maxFeePerGas) / 1e9} gwei`);
    console.log(`Priority fee sugerida: ${Number(fee.maxPriorityFeePerGas) / 1e9} gwei`);
  }
}

main().catch(console.error);
