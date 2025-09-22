import { generateID } from "./utils.js"

export interface IListener<T = any> {
  id: string
  handler: ListenerHandler<T>
}

export type ListenerHandler<T = any> = (data: T) => void

export interface IObservable<IEvents extends Record<string, any> = { [x in string]: any }> {
  on<EventName extends keyof IEvents>(event: EventName, handler: ListenerHandler<IEvents[EventName]>): string
  clearListener(event: keyof IEvents, id: string): void
  clearAllListeners(): void
  clearListenersByEvent(event: keyof IEvents): void
}

export class Observer<IEvents extends Record<string, any> = { [x in string]: any }> implements IObservable<IEvents> {
  private listeners = new Map<keyof IEvents, IListener[]>()

  on<EventName extends keyof IEvents>(event: EventName, handler: ListenerHandler<IEvents[EventName]>) {
    const id = generateID()
    const listeners = this.listeners.get(event) || []

    listeners.push({ id, handler })

    this.listeners.set(event, listeners)

    return id
  }

  emit<EventName extends keyof IEvents>(event: EventName, data: IEvents[EventName]) {
    const listeners = this.listeners.get(event) || []

    for (let i = 0; i < listeners.length; i++) {
      listeners[i].handler(data)
    }
  }

  clearListener(event: keyof IEvents, id: string) {
    const listeners = this.listeners.get(event) || []

    const index = listeners.findIndex(({ id: listenerId }) => listenerId == id)

    if (index < 0) {
      return
    }

    listeners.splice(index, 1)

    this.listeners.set(event, listeners)
  }

  clearAllListeners() {
    this.listeners.clear()
  }

  clearListenersByEvent(event: keyof IEvents) {
    this.listeners.delete(event)
  }
}
