
const ChemistryDataService={

    async getChemistryRecipes(fetch: (url:string)=>Promise<Response>){
        const url= "https://www.paradisestation.org/wiki/api.php?&origin=*&action=parse&page=Guide_to_Chemistry&format=json";
        return await fetch(url).then(res=> res.json());
    }
}
export default ChemistryDataService;