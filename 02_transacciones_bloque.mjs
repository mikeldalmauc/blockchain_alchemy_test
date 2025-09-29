import 'dotenv/config';
import { createPublicClient, http, formatEther } from 'viem';
import { sepolia, mainnet } from 'viem/chains';

async function main() {
  const url = process.env.ALCHEMY_URL;
  if (!url) throw new Error('ALCHEMY_URL no definido en .env');
  const chain = url.includes('mainnet') ? mainnet : sepolia;

  const client = createPublicClient({ chain, transport: http(url) });

  // Usa bloque pasado por argumento: `node 02_transacciones_bloque.mjs 123456`
  const arg = process.argv[2];
  const blockNumber = arg ? BigInt(arg) : await client.getBlockNumber();

  const block = await client.getBlock({ blockNumber });
  console.log(`Bloque ${blockNumber} en ${chain.name} con ${block.transactions.length} transacciones`);
  console.log('Primeras 5 tx hashes:');
  block.transactions.slice(0, 5).forEach((h, i) => console.log(`${i + 1}. ${h}`));

  if (block.transactions.length === 0) return;

  // Lee 1 tx completa
  const txHash = block.transactions[0];
  const tx = await client.getTransaction({ hash: txHash });

  console.log('\nDetalle de la primera tx:');
  console.log(`hash: ${tx.hash}`);
  console.log(`from: ${tx.from}`);
  console.log(`to:   ${tx.to}`);
  console.log(`valor: ${formatEther(tx.value)} ETH`);
  console.log(`nonce: ${tx.nonce}`);
  console.log(`gas:   ${tx.gas.toString()}`);
}

main().catch(console.error);
