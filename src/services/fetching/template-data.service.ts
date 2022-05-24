import _ from "lodash";
import type { fetchFunc, stringPredicate } from "./fetch.type";

const baseUrl="https://www.paradisestation.org/wiki/api.php?&origin=*";

export namespace TemplateDataService{

    const getTemplate= async (fetch: fetchFunc, templatePageName:string) =>
         await fetch(`${baseUrl}&action=parse&page=${templatePageName}&format=json&prop=parsetree`)
            .then(async res => await res.json() as string)

    const getTemplatesIndex= async (fetch: fetchFunc) =>
         await fetch(`${baseUrl}&action=parse&page=Guide_to_Chemistry&format=json&prop=templates`).then(async res=> await res.json())

    const mapTemplateIndexToTemplateNames= (jsonString:any)=>
        ((jsonString.parse.templates as any[])
        .map(template=> template["*"]) as string[])

    export const fetchTemplatesWhere= async (fetch: fetchFunc, predicate: stringPredicate)=>
            getTemplatesIndex(fetch)
            .then(mapTemplateIndexToTemplateNames)
            .then(templateNames=>_.filter(templateNames, predicate))
            .then((strings:string[])=>_.map(strings, async (templateName:string)=> await getTemplate(fetch, templateName)))
            .then(res=>Promise.all(res))
}