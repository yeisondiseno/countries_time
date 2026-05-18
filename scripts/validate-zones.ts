import dataset from "../src/data/countries-zones.json";
import {
  validateZonesDataset,
  type ZonesDataset,
} from "../src/data/countries-zones";

validateZonesDataset(dataset as unknown as ZonesDataset);
console.log("countries-zones dataset OK");
