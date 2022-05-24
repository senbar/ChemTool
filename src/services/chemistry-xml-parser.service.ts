import type { Chemical, Recipe } from '@/data/chemical.model';
import _ from 'lodash';
import { match, P } from 'ts-pattern';
import { ChemicalNameConvert } from './chemical-name-convert';

export namespace ChemistryDataParser {

    export const parseString = (string: any) =>
        _.chain<string>(string)
            //todo fix missing domparser in test
            .map(str => (
                {
                    title: ChemicalNameConvert.convertToChemicalName((str as any)["title"] as string),
                    doc: new DOMParser().parseFromString((str as any)['parsetree']['*'], "application/xml")
                }))
            .map(({title, doc}) => traverseTree(title, doc.childNodes))

    const traverseTree = (chemicalName:string,collection: NodeListOf<ChildNode>): Chemical  =>
        _.reduce(collection, ((accu: Chemical, child: ChildNode) =>
            match(matchNode(child))
                .with(null, ()=> accu)
                .otherwise((parsedStr:string[]|null)=> 
                {
                    accu.Recipe= accu.Recipe.concat(pairUpStringNodes(parsedStr!).map(pair=> matchPairsIntoRecipe(pair[0], pair[1])))
                    return accu
                })
        ), ({ Name: chemicalName, Recipe: [] } as Chemical))

    const matchNode = (child: ChildNode):string[]|null =>
        match(child)
            .with({ childNodes: P.when((nodes) => nodes.length > 0) },
                (node: ChildNode) =>  (_.map(node.childNodes, 
                    (childNode)=> matchNode(childNode)).filter((x): x is string[] => !!x)).flat())
            .with({ nodeName: "#text", parentNode: P.when(node => node?.nodeName == "root") },
                node => node.textContent!
                    .split("<br>").filter(x=>x!="")
                    .map(str=>str.trim().split(" part").filter(str=>str!="")).flat().map(str=> str.trim()))
            .with({ nodeName: "#text", textContent: P.when(text => text?.includes("RecursiveChem")) },
                node =>[node.textContent!])
            .otherwise(_ => null)
    
    const pairUpStringNodes=(stringNodes:string[])=>
        _.reduce(stringNodes, (accu:string[][], stringNode)=>
            match(accu[accu.length-1].length)
            .with( P.when(len=>len==1 || len==0), () => accu.concat([accu.pop()!.concat([stringNode])]))
            .with(2, ()=> accu.concat([[stringNode]]))
                .otherwise(_=> accu  )
            , [[]])
    
    const matchPairsIntoRecipe=(parts:string, chemicalName:string)=>
                    Recipe(
                        match(extractNumber(parts))
                            .with(undefined, ()=> { throw new Error("cant extract number") })
                            .otherwise(x => x!) , Chemical(chemicalName))
                    
    const extractNumber=(str:string):number|undefined=>
                     str.match(/\d+/g)?.map(Number)[0]


    const Chemical = (name: string) => ({ Name: name } as Chemical)
    const Recipe = (amount: number, chemical: Chemical) => ({ parts: amount, substrate: chemical } as Recipe)
}