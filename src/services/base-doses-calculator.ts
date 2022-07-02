import type { Chemical, Recipe } from "@/data/chemical.model";
import type { Dose } from "@/data/dose.model";
import _ from "lodash";
import { match, P } from "ts-pattern";

export namespace BaseDosesCalculator {
    export const calculateBaseDoses = (chemical: Chemical, desiredAmount: number): Dose[] =>
        _.map(calculateChemicalsFractions(chemical, 1), chemicalFraction =>
        ({
            chemical: chemicalFraction.chemical,
            amount: (chemicalFraction.fraction * desiredAmount),
            inverseStep: chemicalFraction.inverseStep
        } as Dose))

    const calculateChemicalsFractions = (chemical: Chemical, currentFraction: number, recipeInverseStep: number = 0): chemicalView[] =>
        match(chemical)
            .with({ recipe: [] }, (baseSubstrate) => [{ chemical: baseSubstrate.name, fraction: currentFraction, inverseStep: recipeInverseStep } as chemicalView])
            .otherwise((chemical) =>
                _(chemical.recipe)
                    .thru(recipes => {
                        let partsSum = _.reduce(recipes, (accu, prev) => accu + prev.parts, 0);
                        return recipes.map((recChem) => calculateChemicalsFractions(recChem.substrate, (recChem.parts / partsSum) * currentFraction, recipeInverseStep + 1))
                    })
                    .thru(recipes => recipes.flat())
                    .value())

    //represents fraction of chemical in entire recipe in [0,1]
    type chemicalView = {
        chemical: string,
        fraction: number,
        inverseStep: number
    }
}