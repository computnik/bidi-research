export type Message = { username: string; message: string }
export type MessageHook = (
  initialMessages: Message[],
  ...any: any
) => { messages: Message[]; sendMessage: ({ username, message }: Message) => void }
