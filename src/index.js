const algoliasearch = require("algoliasearch");

const search = algoliasearch("Your Application ID", "Your API Key");
const index = search.initIndex("ecom");
console.log('Index "ecom" created');

const dataset = require("./assets/dataset.json");
console.log(`Dataset length is ${dataset.length}`);

(async () => {
  try {
    await index.setSettings({
      searchableAttributes: [
        "name",
        "description",
        "categories",
        "type",
        "brand"
      ],
      attributesForFaceting: [
        "hierarchicalCategories.lvl0",
        "hierarchicalCategories.lvl1",
        "hierarchicalCategories.lvl2",
        "hierarchicalCategories.lvl3",
        "type",
        "searchable(brand)",
        "rating",
        "price_range"
      ],
      sortFacetValuesBy: "alpha",
      customRanking: ["desc(popularity)", "desc(rating)", "asc(price)"]
    });
    console.log("Index settings updated form an E-commerce");

    let n = 0;
    let chunkSize = 1000;
    while (dataset.length > 0) {
      let chunks = [];
      chunkSize = dataset.length < chunkSize ? dataset.length : chunkSize;
      for (let i = 0; i < chunkSize; i += 1) chunks.push(dataset.shift());
      await index.addObjects(chunks);
      n++;
      console.log(`Chunk n°${n} of ${chunks.length} data has been pushed`);
    }
    console.log(`All dataset pushed in index "ecom"!`);
  } catch (err) {
    console.log(err.message);
    console.log(err.debugData);
  }
})();
