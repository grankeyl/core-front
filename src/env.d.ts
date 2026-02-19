declare module 'buffer' {
  export const Buffer: typeof globalThis.Buffer;
}

declare module 'process' {
  const process: NodeJS.Process;
  export default process;
}
