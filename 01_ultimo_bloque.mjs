import 'dotenv/config';
import { createPublicClient, http } from 'viem';
import { sepolia, mainnet } from 'viem/chains';

async function main() {
  const url = process.env.ALCHEMY_URL;
  if (!url) throw new Error('ALCHEMY_URL no definido en .env');

  // Detecta cadena por la URL (simple) o fuerza una:
  const chain = url.includes('mainnet') ? mainnet : sepolia;

  const client = createPublicClient({
    chain,
    transport: http(url),
  });

  const latestNumber = await client.getBlockNumber();
  const latestBlock = await client.getBlock({ blockNumber: latestNumber });

  console.log(`Red: ${chain.name}`);
  console.log(`Último bloque: ${latestNumber}`);
  console.log(`Timestamp (unix): ${latestBlock.timestamp}`);
  console.log(`Fecha/Hora: ${new Date(Number(latestBlock.timestamp) * 1000).toISOString()}`);
  console.log(`Txs en el bloque: ${latestBlock.transactions.length}`);
}

main().catch(console.error);
