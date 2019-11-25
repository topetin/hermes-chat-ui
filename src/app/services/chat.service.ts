import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

const connectionOptions =  {
    "force new connection" : true,
    "reconnectionAttempts": "Infinity",
    "timeout" : 10000,
    "transports" : ["websocket"]
};

@Injectable()
export class ChatService {

    private url = 'http://localhost:3000/app';
    private socket;    

    public initSocket(): void {
        this.socket = io(this.url, connectionOptions);
    }

    public emitOnline(companyId, userId): void {
        this.socket.emit('emit-online', {companyId, userId})
    }

    public onOnline(): Observable<any> {
        return new Observable<any>(observer => {
            this.socket.on('on-online', (data: any) => observer.next(data));
        });
    }

    public onOffline() {
        return new Observable<any>(observer => {
            this.socket.on('on-offline', (data: any) => observer.next(data));
        })
    }

    //

    public send(room, message): void {
        this.socket.emit('new-message', {room, message});
    }

    public join(room, user) {
        this.socket.emit('join', {room, user});
    }

    public notifyTyping(room, user) {
        this.socket.emit('typing', {room, user});
    }

    public onMessage(): Observable<any> {
        return new Observable<any>(observer => {
            this.socket.on('new-message', (data: any) => observer.next(data));
        });
    }

    public onJoin() {
        return new Observable<any>(observer => {
            this.socket.on('new-member', (data: any) => observer.next(data));
        })
    }
    
    public onEvent(event: any): Observable<any> {
        return new Observable<any>(observer => {
            this.socket.on(event, () => observer.next());
        });
    }

    public onTyping() {
        return new Observable<any>(observer => {
            this.socket.on('typing', (data: any) => observer.next(data));
        })
    }


} 