type SantaListProtector<T extends object> = Readonly<{[K in keyof T]: T[K] extends object
  ? T[K] extends Function ? T[K] : SantaListProtector<T[K]>
  : T[K]}>;