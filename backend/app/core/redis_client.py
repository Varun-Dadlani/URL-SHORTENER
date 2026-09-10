from redis.asyncio import Redis

redis = Redis(
        host="REDIS_HOST",
        port=6379,
        decode_responses=True
    )


