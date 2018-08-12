import { CryptEngine } from "./crypt/crypt-engine";
import { BroadcastServer } from "./server/broadcast-server";

BroadcastServer.start();
CryptEngine.start();

const stdIn = process.openStdin();

stdIn.addListener("data", function(d: any) {

    const command = d.toString().trim().toLowerCase();

    switch (command) {
        case 'exit':
            BroadcastServer.stop();
            CryptEngine.stop();
            process.exit();
            break;
        default:
            console.log('Unknown Command, allowed commands: ');
            console.log(' "exit" - close server.');
    }
});

console.log('Listening commands from console...');
