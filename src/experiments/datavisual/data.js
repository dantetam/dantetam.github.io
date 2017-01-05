var frames = 0, days = 0, currentDate = new Date("2100-01-01");

var points = [],
    stars = [],
    planets = [],
    sectors = [],
    civilizations = [];
    //points = d3.range(2000).map(function() { return [randomX(), randomY()]; });

var civColors = ["red", "blue", "steelblue", "violet", "green"];

var gameMode = "Paused";
var constructionOrders = [], unitOrders = [], satelliteOrders = [], moveWithinSectorOrders = [], moveToSectorOrders = [], shipRecoverFTL = [];

var currentSectorSelected = null;
var currentPlanetSelected = null;
var currentFleetSelected = null;
var currentSpaceportSelected = null;

var planetData = [];
var removePlanetNames = [];
//var removePlanetNames = ["Kepler", "HD "];
d3.csv("./planet-names.csv", function(data) {
  for (var i = 0; i < data.length; i++) {
    //console.log();
    var planetName = data[i]["pl_hostname"];
    var valid = true;
    for (var j = 0; j < removePlanetNames.length; j++) {
      valid = valid && !planetName.includes(removePlanetNames[j]);
    }
    if (valid) {
      planetData.push(data[i]);
    }
  }
  namePlanets();
});

var starData = [];
var removeStarNames = ["Hip", "BD+", "BD-"];
var starSpectralClasses = ["O", "B", "A", "F", "G", "K", "M"];
function determineStarType(stringy) {
  for (var i = 0; i < stringy.length; i++) {
    for (var j = 0; j < starSpectralClasses.length; j++) {
      if (stringy[i] === starSpectralClasses[j]) {
        return stringy[i];
      }
    }
  }
  return "U";
}
d3.csv("./stars-cut.csv", function(data) {
  //console.log(data);
  for (var i = 0; i < data.length; i++) {
    //console.log();
    var starName = data[i]["Display Name"];
    var valid = true;
    for (var j = 0; j < removeStarNames.length; j++) {
      valid = valid && !starName.includes(removeStarNames[j]);
    }
    //console.log(data[i]["Spectral Class"][0]);
    data[i]["Star Type"] = determineStarType(data[i]["Spectral Class"]);
    if (valid) {
      starData.push(data[i]);
    }
  }
  nameStars();
});

var smallBodyData = [];
d3.csv("./small-body.csv", function(data) {
  //console.log(data);
  for (var i = 0; i < data.length; i++) {
    //console.log();
    var smallBodyName = data[i]["name"];
    if (smallBodyName.length < 10) {
      if (smallBodyName !== null && smallBodyName !== "") {
        smallBodyData.push(data[i]);
      }
    }
  }
  nameAsteroids();
});

var small = d3.random.normal(7, 1.5),
    medium = d3.random.normal(12, 1.5),
    large = d3.random.normal(16, 3);

var maxTiles = 20;

var specialResources = {};
specialResources["Crystal Cells"] = {name: "Crystal Cells", icon: "./images/crystal_cells.png"};

//TODO: Convert data into CSV format
var tileImprovements = [
  {name: "Primitive Farm", output: [0,0,1,0,0,0], buildTime: 70, cost: [50,0,25,0,0,0], maintenance: [0,0,0,0,0,0], techLevelRestrictMin: 0, techLevelRestrictMax: 3, biomeRestrict: "Arable", terrainRestrict: "Land", buildingRestrict: null},
  {name: "Primitive City", output: [1,1,1,1,1,1], buildTime: 70, cost: [50,0,25,0,0,0], maintenance: [0,-1,0,0,0,0], techLevelRestrictMin: 0, techLevelRestrictMax: 3, biomeRestrict: "NotToxic", terrainRestrict: "Land", buildingRestrict: null},
  {name: "Mine I", output: [2,0,0,0,0,0], buildTime: 70, cost: [60,0,0,0,0,0], maintenance: [0,-1,0,0,0,0], techLevelRestrictMin: 4, techLevelRestrictMax: 99, biomeRestrict: "NotToxic", terrainRestrict: "Land", buildingRestrict: null},
  {name: "Mine II", output: [3,0,0,0,0,0], buildTime: 120, cost: [90,0,0,0,0,0], maintenance: [0,-2,0,0,0,0], techLevelRestrictMin: 4, techLevelRestrictMax: 99, biomeRestrict: "NotToxic", terrainRestrict: "Land", buildingRestrict: "Mine I"},
  {name: "Mine III", output: [4,0,0,0,0,0], buildTime: 200, cost: [120,0,0,0,0,0], maintenance: [0,-3,0,0,0,0], techLevelRestrictMin: 4, techLevelRestrictMax: 99, biomeRestrict: "NotToxic", terrainRestrict: "Land", buildingRestrict: "Mine II"},
  {name: "Crystall Processor", output: [5,0,0,0,0,0], buildTime: 100, cost: [50,50,0,0,0,0], maintenance: [0,-1,0,0,0,0], techLevelRestrictMin: 4, techLevelRestrictMax: 99, biomeRestrict: "NotToxic", terrainRestrict: "Land", buildingRestrict: null, specResRestrict: "Crystal Cells"},
  {name: "Platform I", output: [1,1,0,0,0,0], buildTime: 100, cost: [100,50,0,0,0,0], maintenance: [0,0,0,0,0,0], techLevelRestrictMin: 4, techLevelRestrictMax: 99, biomeRestrict: "NotToxic", terrainRestrict: "Sea", buildingRestrict: null},
  {name: "Platform II", output: [1,2,0,0,0,0], buildTime: 160, cost: [150,50,0,0,0,0], maintenance: [0,0,0,0,0,0], techLevelRestrictMin: 4, techLevelRestrictMax: 99, biomeRestrict: "NotToxic", terrainRestrict: "Sea", buildingRestrict: "Platform I"},
  {name: "Platform III", output: [1,3,0,0,0,0], buildTime: 250, cost: [200,50,0,0,0,0], maintenance: [0,0,0,0,0,0], techLevelRestrictMin: 4, techLevelRestrictMax: 99, biomeRestrict: "NotToxic", terrainRestrict: "Sea", buildingRestrict: "Platform II"},
  {name: "Hydroponic Farm I", output: [0,0,2,0,0,0], buildTime: 70, cost: [50,0,25,0,0,0], maintenance: [0,-1,0,0,0,0], techLevelRestrictMin: 4, techLevelRestrictMax: 99, biomeRestrict: "Arable", terrainRestrict: "Land", buildingRestrict: null},
  {name: "Hydroponic Farm II", output: [0,0,2,0,0,0], buildTime: 120, cost: [100,0,25,0,0,0], maintenance: [0,-2,0,0,0,0], techLevelRestrictMin: 4, techLevelRestrictMax: 99, biomeRestrict: "Arable", terrainRestrict: "Land", buildingRestrict: "Hydroponic Farm I"},
  {name: "Hydroponic Farm III", output: [0,0,2,0,0,0], buildTime: 200, cost: [150,0,25,0,0,0], maintenance: [0,-3,0,0,0,0], techLevelRestrictMin: 4, techLevelRestrictMax: 99, biomeRestrict: "Arable", terrainRestrict: "Land", buildingRestrict: "Hydroponic Farm II"},
  {name: "Power Plant I", output: [0,2,0,0,0,0], buildTime: 70, cost: [50,50,0,0,0,0], maintenance: [0,0,-1,0,0,0], techLevelRestrictMin: 4, techLevelRestrictMax: 99, biomeRestrict: "NotToxic", terrainRestrict: "Land", buildingRestrict: null},
  {name: "Power Plant II", output: [0,3,0,0,0,0], buildTime: 120, cost: [100,50,0,0,0,0], maintenance: [-1,0,-1,0,0,0], techLevelRestrictMin: 4, techLevelRestrictMax: 99, biomeRestrict: "NotToxic", terrainRestrict: "Land", buildingRestrict: "Power Plant I"},
  {name: "Power Plant III", output: [0,4,0,0,0,0], buildTime: 200, cost: [150,50,0,0,0,0], maintenance: [-2,0,-1,0,0,0], techLevelRestrictMin: 4, techLevelRestrictMax: 99, biomeRestrict: "NotToxic", terrainRestrict: "Land", buildingRestrict: "Power Plant II"},
  {name: "Crystalline Power Plant", output: [0,6,0,0,0,0], buildTime: 100, cost: [50,50,0,0,0,0], maintenance: [-1,0,-1,0,0,0], techLevelRestrictMin: 4, techLevelRestrictMax: 99, biomeRestrict: "NotToxic", terrainRestrict: "Land", buildingRestrict: null, specResRestrict: "Crystal Cells"},
  {name: "Lab I", output: [0,0,0,1,1,1], buildTime: 200, cost: [150,50,0,0,0,0], maintenance: [-2,0,-1,0,0,0], techLevelRestrictMin: 4, techLevelRestrictMax: 99, biomeRestrict: "NotToxic", terrainRestrict: "Land", buildingRestrict: "Power Plant II"},
  {name: "Colony", output: [0,0,3,3,3,3], buildTime: 250, cost: [250,0,50,0,0,0], maintenance: [-3,-3,0,0,0,0], techLevelRestrictMin: 4, techLevelRestrictMax: 99, biomeRestrict: "NotToxic", terrainRestrict: "Land", buildingRestrict: null}
];

var planetSatellites = [
  {name: "Spaceport I", planet: null, output: [0,0,0,1,1,1], buildTime: 250, cost: [250,0,0,0,0,0], maintenance: [0,-3,-2,0,0,0], biomeRestrict: "NotAsteroid", starRestrict: null, satelliteRestrict: null, orders: []},
  {name: "Spaceport II", planet: null, output: [0,0,0,2,2,2], buildTime: 400, cost: [350,0,0,0,0,0], maintenance: [0,-4,-3,0,0,0], biomeRestrict: "NotAsteroid", starRestrict: null, satelliteRestrict: "Spaceport I", orders: []},
  {name: "Mining Station", planet: null, output: [2,0,0,0,0,0], buildTime: 120, cost: [90,0,0,0,0,0], maintenance: [0,-1,0,0,0,0], biomeRestrict: null, starRestrict: null, satelliteRestrict: null, orders: []},
  {name: "Star Station", planet: null, output: [0,2,0,0,0,0], buildTime: 120, cost: [90,0,0,0,0,0], maintenance: [0,0,0,0,0,0], biomeRestrict: null, starRestrict: null, satelliteRestrict: null, orders: []},
  {name: "Research Station", planet: null, output: [0,0,0,1,1,1], buildTime: 120, cost: [90,0,0,0,0,0], maintenance: [0,-1,0,0,0,0], biomeRestrict: null, starRestrict: null, satelliteRestrict: null, orders: []}
];

var shipTypes = {};
shipTypes["Satellite"] = {name: "Satellite", strength: 10, maxHealth: 30, speed: 0, buildTime: 250, cost: [250,0,0,0,0,0], maintenance: [0,0,0,0,0,0], levelRestrict: 0, ftl: 0, maxFtl: 0};
shipTypes["Explorer"] = {name: "Explorer", strength: 30, maxHealth: 50, speed: 2, buildTime: 100, cost: [100,0,0,0,0,0], maintenance: [0,-1,0,0,0,0], levelRestrict: 1, ftl: 30, maxFtl: 30, action: "Survey"};
shipTypes["Constructor"] = {name: "Constructor", strength: 40, maxHealth: 50, speed: 2, buildTime: 100, cost: [100,0,0,0,0,0], maintenance: [0,-1,0,0,0,0], levelRestrict: 1, ftl: 30, maxFtl: 30, action: "Build"};
shipTypes["Colony Flagship"] = {name: "Colony Flagship", strength: 90, speed: 1, maxHealth: 100, buildTime: 250, cost: [250,0,40,0,0,0], maintenance: [0,-1,0,0,0,0], levelRestrict: 1, ftl: 30, maxFtl: 30, action: "Colonize"};
shipTypes["Cruiser"] = {name: "Cruiser", strength: 50, maxHealth: 30, speed: 1, buildTime: 70, cost: [60,0,0,0,0,0], maintenance: [0,-1,0,0,0,0], levelRestrict: 1, ftl: 30, maxFtl: 30};
shipTypes["Destroyer"] = {name: "Destroyer", strength: 150, maxHealth: 50, speed: 1, buildTime: 150, cost: [150,0,0,0,0,0], maintenance: [0,-2,0,0,0,0], levelRestrict: 2, ftl: 30, maxFtl: 30};
shipTypes["Battleship"] = {name: "Battleship", strength: 350, maxHealth: 120, speed: 1, buildTime: 350, cost: [400,0,0,0,0,0], maintenance: [0,-3,0,0,0,0], levelRestrict: 3, ftl: 30, maxFtl: 30};

var shipAliens = {};
shipAliens["Drone"] = {name: "Drone", strength: 50, maxHealth: 50, attitude: "Innocent", speed: 1, mean: 3, stdDev: 2, ftl: 30, maxFtl: 30};
shipAliens["Predator"] = {name: "Predator", strength: 150, maxHealth: 100, attitude: "Aggressive", speed: 0.5, mean: 1, stdDev: 1, ftl: 100, maxFtl: 100};
shipAliens["PirateCruiser"] = {name: "PirateCruiser", strength: 40, maxHealth: 40, attitude: "Passive", speed: 1, mean: 3, stdDev: 2, ftl: 30, maxFtl: 30};
shipAliens["PirateDestroyer"] = {name: "PirateDestroyer", strength: 125, maxHealth: 50, attitude: "Aggressive", speed: 1, mean: 2, stdDev: 1, ftl: 30, maxFtl: 30};
shipAliens["Startraveller"] = {name: "Startraveller", strength: 50, maxHealth: 100, attitude: "Evasive", speed: 2, mean: 4, stdDev: 2, ftl: 30, maxFtl: 30};
shipAliens["Guardian"] = {name: "Guardian", strength: 500, maxHealth: 500, attitude: "Passive", speed: 0.5, mean: 1, stdDev: 0, ftl: 30, maxFtl: 30};

var tileStarts = [
  [0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],
  [0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],
  [0,0,1,0,0,0],[0,1,0,0,0,0],[1,0,0,0,0,0],[0,0,2,0,0,0],[0,2,0,0,0,0],[2,0,0,0,0,0],[1,1,0,0,0,0],
  [0,0,0,1,0,0],[0,0,0,0,1,0],[0,0,0,0,0,1],[0,0,0,2,0,0],[0,0,0,0,2,0],[0,0,0,0,0,2]
]; //Minerals, Energy, Food, Physics Research, Society Research, Engineering Research
var tileBiomes = [
  "Volatile",
  "Toxic",
  "Tundra",
  "Desert",
  "Savanna",
  "Grassland",
  "Forest",
  "Rainforest"
];
var tileTerrains = [
  "Ocean",
  "Plain",
  "Hill",
  "Mountain"
];

var numStars = 500;
var numPlanets = 1000;
var numAsteroids = 2000;

var sectorRadius = 10;

var numMajorCivs = 10;
var numMinorCivs = 0;

var biomeAbbrs = {};
biomeAbbrs["Arid"] = "A";
biomeAbbrs["Icy"] = "I";
biomeAbbrs["Tundra"] = "Tu";
biomeAbbrs["Ocean"] = "O";
biomeAbbrs["Temperate"] = "Te";
biomeAbbrs["Tropical"] = "Tr";
biomeAbbrs["Gaia"] = "G";
biomeAbbrs["Toxic"] = "Tx";
biomeAbbrs["Ice Cream"] = "IC";
biomeAbbrs["Barren"] = "B";
biomeAbbrs["Gas Giant"] = "GG";
biomeAbbrs["Primordial"] = "P";
biomeAbbrs["Asteroid"] = "x";

var biomeDesc = {};
biomeDesc["Arid"] = "Dry and nearly barren, this planet is harsh for many forms of higher life.";
biomeDesc["Icy"] = "Cold and frozen over, this planet preserves little life and biodiversity.";
biomeDesc["Tundra"] = "Mostly grasses and patches of ice, this planet is tough to live off of.";
biomeDesc["Ocean"] = "This planet has a wet, warm climate and a thick atmosphere which led to the formation of large bodies of water.";
biomeDesc["Temperate"] = "This planet has seasonal, normal weather supporting a somewhat diverse ecosystem.";
biomeDesc["Tropical"] = "Hot and humid, this planet is home to all types of life.";
biomeDesc["Gaia"] = "This planet is a monument and living museum to all the biodiversity imaginable within the universe.";
biomeDesc["Toxic"] = "Magma flowing in rivers, noxious gases in the air, and jagged, hostile terrain render this planet unbearable and unlivable.";
biomeDesc["Ice Cream"] = "This planet is very peculiar — the frozen surface preserves a massive sea, almost like a cosmic slushie of water, sugar, and lactating bacteria.";
biomeDesc["Barren"] = "This planet has no atmosphere, a past of volcanic activity, and all its life has passed away ages ago.";
biomeDesc["Gas Giant"] = "This planet is a swirling sphere of gases.";
biomeDesc["Primordial"] = "This planet is newly formed and still undergoes the stress of its own gravity.";
biomeDesc["Asteroid"] = "Anywhere from a small piece of space debris to a large space base, this object can only support small satellites.";

var civTypes = ["Primordial", "Neolithic", "Modern", "Information", "PostInformation", "Transcendent"];
var civTypeDesc = {};
civTypeDesc["Primordial"] = "This species has not developed sentience.";
civTypeDesc["Neolithic"] = "This species has developed agriculture and has formed permanent, social cities.";
civTypeDesc["Modern"] = "This species has developed some technology and culture but remains relatively unconnected.";
civTypeDesc["Information"] = "This species has connected itself and runs the world with information technology.";
civTypeDesc["PostInformation"] = "This species has developed viable interstellar space travel.";
civTypeDesc["Transcendent"] = "This species has exceeded the limit of its purely biological potential and remains stagnant in perfection.";

var techEra0 = [];

techEra0.push({name: "Interstellar Administration", type: "Star", researchNeeded: 300, building: "Administration"});

techEra0.push({name: "Colony Ships", type: "Society", researchNeeded: 300, unit: "Colony Flagship"});

techEra0.push({name: "Spaceport II", type: "Production", researchNeeded: 300, satellite: "Spaceport II"});















//A comment to hold the line
