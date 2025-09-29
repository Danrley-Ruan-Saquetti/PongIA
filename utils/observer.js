import { generateID } from "./utils.js";
export class Observer {
    constructor() {
        this.listeners = new Map();
    }
    on(event, handler) {
        const id = generateID();
        const listeners = this.listeners.get(event) || [];
        listeners.push({ id, handler });
        this.listeners.set(event, listeners);
        return id;
    }
    emit(event, data) {
        const listeners = this.listeners.get(event) || [];
        for (let i = 0; i < listeners.length; i++) {
            listeners[i].handler(data);
        }
    }
    clearListener(event, id) {
        const listeners = this.listeners.get(event) || [];
        const index = listeners.findIndex(({ id: listenerId }) => listenerId == id);
        if (index < 0) {
            return;
        }
        listeners.splice(index, 1);
        this.listeners.set(event, listeners);
    }
    clearAllListeners() {
        this.listeners.clear();
    }
    clearListenersByEvent(event) {
        this.listeners.delete(event);
    }
}
//# sourceMappingURL=observer.js.map