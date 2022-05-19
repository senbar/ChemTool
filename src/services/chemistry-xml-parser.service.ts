import _ from 'lodash';
import { match } from 'ts-pattern';

export namespace ChemistryDataParser {
    export const parseString = (string: object) =>
        _.chain(string)
            //todo fix missing domparser in test
            .map(str => new DOMParser().parseFromString(str['parsetree']['*'], "application/xml"))
            .map(doc => doc.children)
            .map(nodes =>
                _.map(nodes, (x) =>
                    match(x)
                        .with({ nodeName: "#text" }, (node => node.textContent))
                        .with({ nodeName: "template" }, ((node:Element) => _.filter(node.getElementsByTagName("title"),((element: ChildNode) => element.textContent == "ResursiveChem"))[0].textContent))
                        .otherwise(node => ("Unexpected node type: " + node?.nodeName))))

    const traverseTree = (collection: HTMLCollection):string[] =>
        _.map(collection, child =>
            match(child)
                .with({ nodeName: "root" }, (node => traverseTree(node.children)))
                .with({ nodeName: "#text" }, (node => node.textContent))
                .with({ nodeName: "template" }, (node => _.filter(
                                                    node.getElementsByTagName("title"),
                                                    function (element: Element) {return element.textContent?.includes("RecursiveChem") ?? false})
                                                        [0].textContent))
                .otherwise(node => ("Unexpected node type: " + node?.nodeName)))
            .flat().map(x=>x??"")
}