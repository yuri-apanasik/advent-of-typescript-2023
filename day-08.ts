type RemoveNaughtyChildren<TChildren extends object> = Pick<TChildren, {[K in keyof TChildren]: K extends `naughty_${infer _}` ? never : K}[keyof TChildren]>;
