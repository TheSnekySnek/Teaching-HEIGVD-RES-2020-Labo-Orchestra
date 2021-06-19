const { v4: uuidv4 } = require('uuid');
var dgram = require('dgram'); 

const UDPMulticastAdr = '230.185.192.108';
const UDPPort = 3000;

const soundMap = new Map(
    [
        ['piano',  'ti-ta-ti'   ],
        ['trumpet','pouet'      ],
        ['flute',  'trulu'      ],
        ['violin', 'gzi-gzi'    ],
        ['drum',   'boum-boum'  ],
    ]
)

const ID = uuidv4();
const instrument = process.argv[2];
const sound = soundMap.get(instrument)

var server = dgram.createSocket("udp4"); 

server.on('listening', function(){
    server.setBroadcast(true);
    server.setMulticastTTL(128);
    server.addMembership('230.185.192.108'); 
});

server.bind();


setInterval(sendSound, 1000);

function sendSound() {
    var message = JSON.stringify({
        uuid: ID,
        instrument: instrument,
        sound: sound
    })
    server.send(message, 0, message.length, UDPPort, UDPMulticastAdr);
}