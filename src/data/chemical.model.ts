    export type Chemical={
        Name:string;
        Recipe: Recipe[]
    }
    export type Recipe={
        parts:number,
        substrate:Chemical
    }
