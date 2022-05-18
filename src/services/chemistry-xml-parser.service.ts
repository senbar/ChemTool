import _ from 'lodash';
import { match } from 'ts-pattern';

export namespace ChemistryDataParser{
    export let parseString= (string:string)=>
    _.chain(string)
    //todo fix missing domparser in test
        .map(str=>new DOMParser().parseFromString(str, "application/xml"))
        .map(document=> document.firstChild?.childNodes)
        .map(nodes=> 
            _.map(nodes, (x)=> 
                match(x)
                    .with({nodeName:"#text"}, (node => node))
                    .with({nodeName:"template"}, (node => node.getElementsByTagName("tile").filter((element:ChildNode)=>element.textContent=="ResursiveChem")))
                    .otherwise(node => {throw new Error("Unexpected node type: " + node.nodeName)} )))
        

}