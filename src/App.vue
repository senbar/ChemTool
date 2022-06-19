<script setup lang="ts">
import _ from 'lodash';
import { onMounted, ref } from 'vue';
import type { Chemical } from './data/chemical.model';
import type { Dose } from './data/dose.model';
import { BaseDosesCalculator } from './services/base-doses-calculator';
import { ChemistryDataParser } from './services/chemistry-xml-parser.service';
import { ChemistryDataService } from './services/fetching/chemistry-data.service';
import { ChemistryExpandService } from './services/fetching/chemistry-expand.service';

const dosesToShow = ref<Dose[]>()
const text = "";

onMounted(async () => {
})

const searchForRecipeAndExpand = async (name: string) => {
  var chemical = await ChemistryDataService.fetchChemTemplate(fetch, name).then(res =>
    ChemistryDataParser.parseString(res).head().value());
    
  var expanded= await ChemistryExpandService.expandRecipes(fetch, chemical);
  dosesToShow.value =BaseDosesCalculator.calculateBaseDoses(expanded, 90);

}

</script>

<template>
  <header>
    <h1>Search for chemical</h1>

    <div class="search-box">
      <input v-model="text">
      <button @click="searchForRecipeAndExpand(text)">Search</button>
    </div>
  </header>
  <main>
    <li v-for="(item, index) in dosesToShow">
      {{ index }} - {{ item.chemical }} - {{item.amount}}u
</li>
  </main>
</template>

<style>
@import './assets/base.css';

header {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  margin-top: 2rem;
  flex-flow: column;
}

header h1 {width: 11rem;}

.search-box{
  width:15rem;
}

header main {}
</style>
