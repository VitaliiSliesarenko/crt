import { Connection } from "./connection";
import { connection } from "websocket";
import * as Collections from 'typescript-collections';

export class ConnectionManager {

    private connections = new Collections.Dictionary<number, Connection>();

    public set(connection: connection): Connection {
        const con = new Connection(connection);
        con.onClose = (con: Connection) => { this.remove(con); };
        this.connections.setValue(con.getId(), con);
        console.log(`Connection added, total in pool: ${this.connections.size()}`);
        return con;
    }

    public closeAll(): void {
        this.connections.forEach((key, value) => {
           value.close();
        });
        this.connections.clear();
    }

    public remove(con: Connection) {
        this.connections.remove(con.getId());
        console.log(`Connection removed, total in pool: ${this.connections.size()}`);
    }

    public forEach(callback: Function) {
        this.connections.forEach((key, connection) => callback(connection));
    }
}