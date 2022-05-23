
export namespace ChemicalNameConvert{
    export const convertToTemplateName= (chemicalName:string)=> `Template:RecursiveChem/${chemicalName}`;
    export const convertToChemicalName=(templateName:string)=> templateName.replace("RecursiveChem/","").replace("Template:", "");
}