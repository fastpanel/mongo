# fastPanel MongoDB Extension.
Extension to work with "MongoDB" base.

---

## Env

```
# Defines the MongoDB environment.
MONGODB_HOST='localhost'
MONGODB_PORT=27017
MONGODB_USER=''
MONGODB_PASS=''
MONGODB_DBNAME='fastPanel'

# Connection options.
MONGODB_AUTO_RECONNECT=true
MONGODB_RECONNECT_TRIES=9999
MONGODB_RECONNECT_INTERVAL=500
MONGODB_POOL_SIZE=10
```

---

## Events

### cli:getCommands

The event is triggered when the application is ready to register mongoose models.

``` typescript
  this.events.once('db:getModels', async (db: Mongoose.Connection) => {});
```

---

## License
The MIT License (MIT)

---

## Copyright
(c) 2014 - 2019 Desionlab
