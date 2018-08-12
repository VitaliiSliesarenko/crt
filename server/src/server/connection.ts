import { connection, IMessage } from "websocket";
import { MessageProcessor } from './message-processor';

let id: number = 0;

export class Connection {

    private readonly id: number;
    public onClose: (con: Connection) => void = null;

    constructor(private connection: connection) {
        this.id = ++id;
        this.connection.on('message', (message: IMessage) => { this.processMessage(message); });
        connection.on('close', (reasonCode: number, description: string) => { this.processClose(reasonCode, description); });
    }

    public getId(): number {
        return this.id;
    }

    processMessage(message: IMessage): void {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            MessageProcessor.process(message.utf8Data).then(retMessage => {
                this.send(JSON.stringify(retMessage));
            });
        }
        else if (message.type === 'binary') {
           console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
        }
    }

    processClose(reasonCode: number, description: string): void {
        console.log(`${new Date()} Peer ${this.connection.remoteAddress} disconnected. Reason code: ${reasonCode}; Description: ${description}`);
        if (this.onClose != null) {
            this.onClose(this);
        }
    }

    close(): void {
        this.connection.close();
    }

    send(message: string): void {
        this.connection.sendUTF(message);
    }
}