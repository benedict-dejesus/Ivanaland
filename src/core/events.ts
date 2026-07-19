/** Minimal typed event bus. */
export interface GameEvents {
  found: { id: number };
  delight: { x: number; y: number };
  district: { id: string };
  hint: { phoneId: number };
  achievement: { id: string };
  completed: Record<string, never>;
}

type Handler<T> = (payload: T) => void;

export class EventBus {
  private handlers = new Map<keyof GameEvents, Handler<never>[]>();

  on<K extends keyof GameEvents>(ev: K, fn: Handler<GameEvents[K]>): void {
    const list = this.handlers.get(ev) ?? [];
    list.push(fn as Handler<never>);
    this.handlers.set(ev, list);
  }

  emit<K extends keyof GameEvents>(ev: K, payload: GameEvents[K]): void {
    const list = this.handlers.get(ev);
    if (!list) return;
    for (const fn of list) (fn as Handler<GameEvents[K]>)(payload);
  }
}
