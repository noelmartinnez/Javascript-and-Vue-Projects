import { createSSRApp } from 'vue';

export function createApp() {
  return createSSRApp({
    data: () => ({ count: 1 }),
    template: `
       <h1>{{count}}</h1>
       <button @click="count++">Incrementar</button>
    `,
  });
}
