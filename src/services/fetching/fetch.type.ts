
export type fetchFunc= (url:string, init?: RequestInit | undefined)=> Promise<Response>;

export type stringPredicate= (string:string)=> boolean;
