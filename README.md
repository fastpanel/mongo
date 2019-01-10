# fastPanel MongoDB Extension.
Extension to work with "MongoDB" base.

---

## Env

```

```

---

## Events

### cli:getCommands

The event is triggered when the application is ready to register mongoose models.

``` typescript
  this.events.once('db:getModels', async (db: Mongoose.Connection) => {});
```

### db:getSeedsSubscriptions

The event allows you to register in the queue 
for execution actions to seeds data to database.

``` typescript
  this.events.on('db:getSeedsSubscriptions', (list: Array<Cli.CommandSubscriptionDefines>) => {
    list.push(async (command: Vorpal.CommandInstance, args?: any) => {});
  });
```

---

## License
The MIT License (MIT)

---

## Copyright
(c) 2014 - 2019 Desionlab
