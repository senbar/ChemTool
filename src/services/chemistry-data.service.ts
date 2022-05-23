import _ from 'lodash';
import type { fetchFunc } from './fetch.type';
import {TemplateDataService} from './template-data.service';
import {ChemicalNameConvert} from "./chemical-name-convert"

const baseUrl="https://www.paradisestation.org/wiki/api.php?&origin=*";

export namespace ChemistryDataService{
    export const fetchChemTemplate= async (fetch:fetchFunc, name:string)=>
        (await TemplateDataService.fetchTemplatesWhere(fetch, templateName=>templateName==ChemicalNameConvert.convertToTemplateName(name)))[0]

}