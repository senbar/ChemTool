    export type Chemical={
        name:string;
        recipe: Recipe[]
    }
    export type Recipe={
        parts:number,
        substrate:Chemical
    }
