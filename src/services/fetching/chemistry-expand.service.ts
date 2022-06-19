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
        name: chem.name,
        recipe: await Promise.all(_.map(chem.recipe, (recipe)=> 
            match(recipe)
                .with({ substrate: {name : P.when(name=>name.includes("Recursive"))} }, async (recipe)=>
                    ({ 
                        parts: recipe.parts,
                        substrate: await ChemistryDataService.fetchChemTemplate(fetch, 
                            ChemicalNameConvert.convertToChemicalName(recipe.substrate.name))
                            .then(res=>ChemistryDataParser.parseString(res).head().value())
                    } as Recipe))

                .otherwise(recipe=>recipe)
                ))
    } as Chemical)
}
