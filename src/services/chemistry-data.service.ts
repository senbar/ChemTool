import { rmSync } from 'fs';
import { match, P } from 'ts-pattern';
import _ from 'lodash';
import type { fetchFunc } from './fetch.type';
import TemplateDataService from './template-data.service';

// const templatesIndex="https://www.paradisestation.org/wiki/api.php?&origin=*&action=parse&page=Guide_to_Chemistry&format=json&prop=templates";
const baseUrl="https://www.paradisestation.org/wiki/api.php?&origin=*";

// type fetchFunc= typeof fetch;
export namespace ChemistryDataService{
    export let fetchChemTemplate= async (fetch:fetchFunc, name:string)=>
        TemplateDataService.fetchTemplatesWhere(fetch, templateName=>templateName==_templateNameFromChemical(name))

    

    let _templateNameFromChemical= (name:string)=> `Template:RecursiveChem/${name}`
}