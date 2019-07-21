const WebSocketServer = require('ws').Server;

module.exports = (server) => {
    const wss = new WebSocketServer({server: server, path: '/api/alive'});
    wss.on('connection', (ws) => {
        ws.on('message', (message) => {
            message = JSON.parse(message);
            if (message === 'pong') {
                ws.isAlive = true;
                console.log('message received: ' + message);
            }
        });
    });

    const interval = setInterval(() => {
        wss.clients.forEach((ws) => {
            if(ws.isAlive === false) return ws.terminate();
            ws.isAlive = false;
            console.log('ping');
            ws.send(JSON.stringify('ping'));
        })
    }, 15000);
}
