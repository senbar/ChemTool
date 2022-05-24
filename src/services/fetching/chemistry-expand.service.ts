import type { Chemical, Recipe } from "@/data/chemical.model";
import _ from 'lodash';
import { match, P } from "ts-pattern";
import { ChemistryDataService } from "./chemistry-data.service";
import { ChemistryDataParser } from "../chemistry-xml-parser.service";
import { ChemicalNameConvert } from "../chemical-name-convert";
import type { fetchFunc } from "./fetch.type";

export namespace ChemistryExpandService
{
    export const expandRecipes= async (fetch: fetchFunc, chem:Chemical):Promise<Chemical>=>
    ({
        Name: chem.Name,
        Recipe: await Promise.all(_.map(chem.Recipe, (recipe)=> 
            match(recipe)
                .with({ substrate: {Name : P.when(name=>name.includes("Recursive"))} }, async (chemical)=>
                    await ChemistryDataService.fetchChemTemplate(fetch, 
                            ChemicalNameConvert.convertToChemicalName(chemical.substrate.Name))
                            .then(res=>ChemistryDataParser.parseString(res).head().value()))
                .otherwise(recipe=>recipe)
                ))
    } as Chemical)
}
