/*
 * @Author: shufei.han
 * @Date: 2024-10-16 11:26:20
 * @LastEditors: shufei.han
 * @LastEditTime: 2024-10-16 11:56:36
 * @FilePath: \kvm-web-vue3\src\api\websocket.ts
 * @Description: 
 */
export class WebSocketService<T = any> {
    public socket: WebSocket;   
    constructor(private url: string, private protocol?: string, private onMessage?: (data: T) => void) {
        this.init();
    }

    private init() {
        this.socket = new WebSocket(this.url, this.protocol || undefined);
        this.configSocketLifeCircle()
    }

    private configSocketLifeCircle() {
        this.socket.onopen = () => {
            console.log('WebSocket connected');
        };
        this.socket.onclose = () => {
            console.log('WebSocket disconnected');
        };
        this.socket.onerror = (error) => {
            console.log('WebSocket error:', error);
        };
        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.onMessage?.(data)
            
        };
    }

    public send(message: string) {
        this.socket.send(message);
    }

    public close () {
        this.socket.close();
    }
}