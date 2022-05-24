<script setup lang="ts">
import _ from 'lodash';
import { onMounted, ref } from 'vue';
import type { Chemical } from './data/chemical.model';
import { ChemistryDataParser } from './services/chemistry-xml-parser.service';
import { ChemistryDataService } from './services/fetching/chemistry-data.service';
import { ChemistryExpandService } from './services/fetching/chemistry-expand.service';

const chemicalToShow= ref<Chemical>()
const text="";

onMounted(async ()=>{
})

const searchForRecipeAndExpand = async (name:string) =>{
  var chemical=await ChemistryDataService.fetchChemTemplate(fetch, name).then(res=>
    ChemistryDataParser.parseString(res).head().value());
  chemicalToShow.value= await ChemistryExpandService.expandRecipes(fetch, chemical);
}

</script>

<template>
<header>
  <h1>Search for chemical</h1>

    <input v-model="text">
    <button @click="searchForRecipeAndExpand(text)">Search</button>
</header>
  <main>
    {{chemicalToShow?.Name ?? "nothing"}}
  </main>
</template>

<style>
@import './assets/base.css';

header{
  display: flex;
justify-content: center;
margin-top:2rem
}
main {

}
</style>
