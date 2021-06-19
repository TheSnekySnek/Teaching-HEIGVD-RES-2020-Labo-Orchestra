var moment = require('moment');
var dgram = require('dgram');
var net = require('net');
var client = dgram.createSocket('udp4');

const UDPPort = 3000;
const UDPHost = '0.0.0.0';
const UDPMulticastAdr = '230.185.192.108';

var musicians = [];

// TCP SERVER
var server = net.createServer(function(socket) {
    socket.write(JSON.stringify(musicians));
    socket.destroy();
});

server.listen(2205, '0.0.0.0');

// UDP LISTENER
client.on('listening', function () {
    client.setBroadcast(true);
    client.setMulticastTTL(128); 
    client.addMembership(UDPMulticastAdr, UDPHost);
});

client.on('message', function (message, remote) {
    musician = JSON.parse(message);
    updateMusician(musician);
});

client.bind(UDPPort, UDPHost);

/**
 * Update or adds a new musician
 * @param {*} musician 
 */
function updateMusician(musician) {
    for (let i = 0; i < musicians.length; i++) {
        if(musicians[i].uuid == musician.uuid){
            musicians[i].activeLast = moment().format();
            return;
        }
    }

    musicians.push({
        uuid: musician.uuid,
        instrument: musician.instrument,
        activeSince: moment().format(),
        activeLast: moment().format()
    });
}

/**
 * Checks if a musician is inactive then removes it
 */
function checkMusicians() {
    for (let i = 0; i < musicians.length; i++) {
        if(moment().diff(moment(musicians[i].activeLast), 'seconds') >= 5){
            console.log("Removing inactive musician", musicians[i].uuid);
            musicians.splice(i, 1);
            i--;
        }
    }
}

// Check for inactive musicians
setInterval(checkMusicians, 1000);