<script setup lang="ts">
import _, { type Dictionary } from 'lodash';
import { onMounted, ref } from 'vue';
import type { Chemical } from './data/chemical.model';
import type { Dose } from './data/dose.model';
import { BaseDosesCalculator } from './services/base-doses-calculator';
import { ChemistryDataParser } from './services/chemistry-xml-parser.service';
import { ChemistryDataService } from './services/fetching/chemistry-data.service';
import { ChemistryExpandService } from './services/fetching/chemistry-expand.service';

const dosesToShow = ref<Dose[]>()
const tieredRecipe = ref<Dictionary<Dose[]>>()
const text = "";

onMounted(async () => {
})

const searchForRecipeAndExpand = async (name: string) => {
  var chemical = await ChemistryDataService.fetchChemTemplate(fetch, name).then(res =>
    ChemistryDataParser.parseString(res).head().value());

  var expanded = await ChemistryExpandService.expandRecipes(fetch, chemical);
  dosesToShow.value = BaseDosesCalculator.calculateBaseDoses(expanded, 90);

  tieredRecipe.value = _(dosesToShow.value).groupBy(x => x.inverseStep).value()
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
    <div class="tree">
      <li v-for="(tier, index) in tieredRecipe">
        Tier {{ index }}
        <li v-for="(item, index) in tier">
          {{ index }} - {{ item.chemical }} - {{ item.amount }}u
        </li>
      </li>

    </div>

    <div class="bottom">
      Base Dosage:
      <li v-for="(item, index) in dosesToShow">
        {{ index }} - {{ item.chemical }} - {{ item.amount }}u
      </li>
    </div>
  </main>
</template>

<style>
@import './assets/base.css';

main {
  width: 100%;
  height: 100%;
  position: relative;
}

header {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  flex-flow: column;
}

header h1 {
  width: 11rem;
}

.search-box {
  width: 15rem;
}

.bottom {
  height: 300px;
}
</style>
