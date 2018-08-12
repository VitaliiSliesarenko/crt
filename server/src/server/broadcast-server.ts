import * as webSocket from "websocket";
import * as http from "http";
import { ConnectionManager } from "./connection-manager";
import { Server } from "http";
import { Connection } from "./connection";
import { Logger } from "../../../common/src/Logger";
import { ServerInfoMessage } from '../../../common/src/messages/server-info-message';
import { CryptEngine } from '../crypt/crypt-engine';
import { CryptMessage } from '../../../common/src/messages/crypt-message';

export class BroadcastServer {

    private static connectionManager: ConnectionManager = new ConnectionManager();
    private static wsServer: webSocket.server = null;
    private static httpServer: Server = null;

    public static start() {
        BroadcastServer.stop();

        BroadcastServer.httpServer = http.createServer((request, response) => {
            Logger.log('Received request for ' + request.url);
            response.writeHead(404);
            response.end();
        });

        BroadcastServer.httpServer.listen(8080, function() {
            Logger.log('Server is listening on port 8080');
        });

        BroadcastServer.wsServer = new webSocket.server({
            httpServer: BroadcastServer.httpServer,
            autoAcceptConnections: false
        });

        function originIsAllowed(origin: string): boolean {
            // put logic here to detect whether the specified origin is allowed.
            return true;
        }

        BroadcastServer.wsServer.on('request', (request) => {
            if (!originIsAllowed(request.origin)) {
                // Make sure we only accept requests from an allowed origin
                request.reject();
                Logger.log('Connection from origin ' + request.origin + ' rejected.');
                return;
            }
            try {
                const connection: webSocket.connection = request.accept('crypt-protocol', request.origin);
                Logger.log('Connection accepted.');
                const conn = BroadcastServer.connectionManager.set(connection);
                BroadcastServer.sendServerInfo(conn);
            } catch (error) {
                Logger.error(error);
            }
        });
    }

    public static broadcast(cryptMessage: CryptMessage) {
        BroadcastServer.connectionManager.forEach((c: Connection) => {
            c.send(JSON.stringify(cryptMessage));
        });
    }

    public static stop() {
        BroadcastServer.connectionManager.closeAll();

        if (BroadcastServer.wsServer != null) {
            BroadcastServer.wsServer.shutDown();
            BroadcastServer.wsServer = null;
        }
        if (BroadcastServer.httpServer != null) {
            BroadcastServer.httpServer.close();
            BroadcastServer.httpServer = null;
        }
    }

    private static sendServerInfo(c: Connection): void {
        const serverInfoMessage = new ServerInfoMessage();
        serverInfoMessage.traders = CryptEngine.getTraderNames();
        c.send(JSON.stringify(serverInfoMessage));
    }
}