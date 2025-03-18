import redis from 'redis';

const client = redis.createClient({
    url: 'redis://localhost:6379',
    socket: {
        reconnectStrategy: retries => Math.min(retries * 50, 2000),
    }
});


client.on('connect', () => console.log('Connected to Redis'));
client.on('error', (err) => console.error('Redis Connection Error:', err));
client.on('reconnecting', () => console.log('Reconnecting to Redis...'));

client.connect().catch(err => console.error('Redis Connection Error:', err));

export default client;
