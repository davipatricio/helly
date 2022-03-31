## Helly

A Node.js wrapper for interfacing with Discord.

<div align="center">
  <br />
  <p>
    <a href="https://helly.js.org"><img src="https://ondemand.bannerbear.com/signedurl/9K5qxXae32jEAGRDkj/image.jpg?modifications=W3sibmFtZSI6InJlcG8iLCJ0ZXh0IjoiZGF2aXBhdHJpY2lvIC8gKmhlbGx5KiJ9LHsibmFtZSI6ImRlc2MiLCJ0ZXh0IjoiW1dJUF0gQSBzaW1wbGUsIHR5cGVkLCBwZXJmb3JtYW5jZS1mb2N1c2VkIERpc2NvcmQgQVBJIFdyYXBwZXIuIn0seyJuYW1lIjoiYXZhdGFyNSIsImltYWdlX3VybCI6Imh0dHBzOi8vYXZhdGFycy5naXRodWJ1c2VyY29udGVudC5jb20vdS83MzQ0MzM5MT92PTQifSx7Im5hbWUiOiJhdmF0YXI0IiwiaW1hZ2VfdXJsIjoiaHR0cHM6Ly9hdmF0YXJzLmdpdGh1YnVzZXJjb250ZW50LmNvbS91LzYwOTA3NDI5P3Y9NCJ9LHsibmFtZSI6ImF2YXRhcjMiLCJpbWFnZV91cmwiOiJodHRwczovL2F2YXRhcnMuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3UvNzE4MzUxNDY_dj00In0seyJuYW1lIjoiYXZhdGFyMiIsImltYWdlX3VybCI6Imh0dHBzOi8vYXZhdGFycy5naXRodWJ1c2VyY29udGVudC5jb20vaW4vMjc0MD92PTQifSx7Im5hbWUiOiJhdmF0YXIxIiwiaW1hZ2VfdXJsIjoiaHR0cHM6Ly9hdmF0YXJzLmdpdGh1YnVzZXJjb250ZW50LmNvbS91LzcxMTY0NzUyP3Y9NCJ9LHsibmFtZSI6ImNvbnRyaWJ1dG9ycyIsInRleHQiOiI1IENvbnRyaWJ1dG9ycyJ9LHsibmFtZSI6InN0YXJzIiwidGV4dCI6IjUifV0&s=3095c12b208729586d06e0f2c25c7003d2e2546f75da3c23bee31914ae1e1886" width="546" alt="helly" /></a>
  </p>
</div>

---

⚠️ This library is not ready for production use.

---

## Installation

#### Node.js 16.9.0 or newer is required

### Stable version

```sh-session
npm install helly
yarn add helly
pnpm add helly
```

##### Development version

```sh-session
npm install helly@dev
```

### Optional packages
- [bufferutil](https://www.npmjs.com/package/bufferutil) for a much faster WebSocket connection (`npm install bufferutil`)

- [utf-8-validate](https://www.npmjs.com/package/utf-8-validate) in combination with `bufferutil` for much faster WebSocket processing (`npm install utf-8-validate`)

## Ping Pong Example
```js
const { Client, Events, GatewayIntentBits } = require('helly');

const client = new Client({
    intents: [GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

// Code inside here will run when the bot connects to the Discord API
client.on(Events.Ready /* you can also use 'Ready', but using enums are recommended */, () => {
    console.log("Ready!"); // Log "Ready!"
});


// Code inside here will run when someone sends a message in a channel
client.on(Events.MessageCreate /* you can also use 'MessageCreate', but using enums are recommended */, (message) => {
  if (message.content === '!ping') return message.reply(`🏓 ${client.ping}ms...`)
  if (message.content === 'Hi') return message.reply(`Hello, ${message.author}! How are you?`)
});

// Replace TOKEN with your bot account's token
client.login('TOKEN')
```


## Useful Links
- [The website](https://helly.js.org) has more details and documentation.
- [The GitHub repo](https://github.com/davipatricio/helly) is where development primarily happens.
- [The NPM package webpage](https://npmjs.com/package/helly) is, well, the webpage for the NPM package.
