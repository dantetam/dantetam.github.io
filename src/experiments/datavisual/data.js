var frames = 0, days = 0, currentDate = new Date("2100-01-01");

var points = [],
    stars = [],
    planets = [],
    sectors = [],
    civilizations = [];
    //points = d3.range(2000).map(function() { return [randomX(), randomY()]; });

var civColors = ["red", "blue", "steelblue", "violet", "green"];

var gameMode = "Paused";
var constructionOrders = [], unitOrders = [], satelliteOrders = [], moveWithinSectorOrders = [], moveToSectorOrders = [], shipRecoverFTL = [], battles = [];

var currentSectorSelected = null;
var currentPlanetSelected = null;
var currentFleetSelected = null;
var currentSpaceportSelected = null;

var small = d3.random.normal(10, 1.5),
    medium = d3.random.normal(14, 1.5),
    large = d3.random.normal(18, 3);

var maxTiles = 20;

var specialResources = {};
specialResources["Crystal Cells"] = {name: "Crystal Cells", icon: "./images/crystal_cells.png"};

//TODO: Convert data into CSV format
var tileImprovements = [
  {name: "Primitive Farm", output: [0,0,1,0,0,0], buildTime: 70, cost: [50,0,25,0,0,0], mod: [0,0,0,0,0,0], maintenance: [0,0,0,0,0,0], techLevelRestrictMin: 0, techLevelRestrictMax: 3, biomeRestrict: "Arable", terrainRestrict: "Land", buildingRestrict: null},
  {name: "Primitive City", output: [1,1,1,1,1,1], buildTime: 70, cost: [50,0,25,0,0,0], mod: [0,0,0,0,0,0], maintenance: [0,-1,0,0,0,0], techLevelRestrictMin: 0, techLevelRestrictMax: 3, biomeRestrict: "NotToxic", terrainRestrict: "Land", buildingRestrict: null},
  {name: "Mine I", output: [2,0,0,0,0,0], buildTime: 70, cost: [60,0,0,0,0,0], mod: [0,0,0,0,0,0], maintenance: [0,-1,0,0,0,0], techLevelRestrictMin: 4, techLevelRestrictMax: 99, biomeRestrict: "NotToxic", terrainRestrict: "Land", buildingRestrict: null},
  {name: "Mine II", output: [3,0,0,0,0,0], buildTime: 120, cost: [90,0,0,0,0,0], mod: [0,0,0,0,0,0], maintenance: [0,-2,0,0,0,0], techLevelRestrictMin: 4, techLevelRestrictMax: 99, biomeRestrict: "NotToxic", terrainRestrict: "Land", buildingRestrict: "Mine I", techRestrict: "Mine II"},
  {name: "Mine III", output: [4,0,0,0,0,0], buildTime: 200, cost: [120,0,0,0,0,0], mod: [0,0,0,0,0,0], maintenance: [0,-3,0,0,0,0], techLevelRestrictMin: 4, techLevelRestrictMax: 99, biomeRestrict: "NotToxic", terrainRestrict: "Land", buildingRestrict: "Mine II", techRestrict: "Mine III"},
  {name: "Crystal Processor", output: [5,0,0,0,0,0], buildTime: 100, cost: [50,50,0,0,0,0], mod: [0,0,0,0,0,0], maintenance: [0,-1,0,0,0,0], techLevelRestrictMin: 4, techLevelRestrictMax: 99, biomeRestrict: "NotToxic", terrainRestrict: "Land", buildingRestrict: null, specResRestrict: "Crystal Cells"},
  {name: "Platform I", output: [1,1,0,0,0,0], buildTime: 100, cost: [100,50,0,0,0,0], mod: [0,0,0,0,0,0], maintenance: [0,0,0,0,0,0], techLevelRestrictMin: 4, techLevelRestrictMax: 99, biomeRestrict: "NotToxic", terrainRestrict: "Sea", buildingRestrict: null},
  {name: "Platform II", output: [1,2,0,0,0,0], buildTime: 160, cost: [150,50,0,0,0,0], mod: [0,0,0,0,0,0], maintenance: [0,0,0,0,0,0], techLevelRestrictMin: 4, techLevelRestrictMax: 99, biomeRestrict: "NotToxic", terrainRestrict: "Sea", buildingRestrict: "Platform I", techRestrict: "Platform II"},
  {name: "Platform III", output: [1,3,0,0,0,0], buildTime: 250, cost: [200,50,0,0,0,0], mod: [0,0,0,0,0,0], maintenance: [0,0,0,0,0,0], techLevelRestrictMin: 4, techLevelRestrictMax: 99, biomeRestrict: "NotToxic", terrainRestrict: "Sea", buildingRestrict: "Platform II", techRestrict: "Platform III"},
  {name: "Hydroponic Farm I", output: [0,0,2,0,0,0], buildTime: 70, cost: [50,0,25,0,0,0], mod: [0,0,0,0,0,0], maintenance: [0,-1,0,0,0,0], techLevelRestrictMin: 4, techLevelRestrictMax: 99, biomeRestrict: "Arable", terrainRestrict: "Land", buildingRestrict: null},
  {name: "Hydroponic Farm II", output: [0,0,2,0,0,0], buildTime: 120, cost: [100,0,25,0,0,0], mod: [0,0,0,0,0,0], maintenance: [0,-2,0,0,0,0], techLevelRestrictMin: 4, techLevelRestrictMax: 99, biomeRestrict: "Arable", terrainRestrict: "Land", buildingRestrict: "Hydroponic Farm I", techRestrict: "Hydroponic Farm II"},
  {name: "Hydroponic Farm III", output: [0,0,2,0,0,0], buildTime: 200, cost: [150,0,25,0,0,0], mod: [0,0,0,0,0,0], maintenance: [0,-3,0,0,0,0], techLevelRestrictMin: 4, techLevelRestrictMax: 99, biomeRestrict: "Arable", terrainRestrict: "Land", buildingRestrict: "Hydroponic Farm II", techRestrict: "Hydroponic Farm III"},
  {name: "Power Plant I", output: [0,2,0,0,0,0], buildTime: 70, cost: [50,50,0,0,0,0], mod: [0,0,0,0,0,0], maintenance: [0,0,-1,0,0,0], techLevelRestrictMin: 4, techLevelRestrictMax: 99, biomeRestrict: "NotToxic", terrainRestrict: "Land", buildingRestrict: null},
  {name: "Power Plant II", output: [0,3,0,0,0,0], buildTime: 120, cost: [100,50,0,0,0,0], mod: [0,0,0,0,0,0], maintenance: [-1,0,-1,0,0,0], techLevelRestrictMin: 4, techLevelRestrictMax: 99, biomeRestrict: "NotToxic", terrainRestrict: "Land", buildingRestrict: "Power Plant I", techRestrict: "Power Plant I"},
  {name: "Power Plant III", output: [0,4,0,0,0,0], buildTime: 200, cost: [150,50,0,0,0,0], mod: [0,0,0,0,0,0], maintenance: [-2,0,-1,0,0,0], techLevelRestrictMin: 4, techLevelRestrictMax: 99, biomeRestrict: "NotToxic", terrainRestrict: "Land", buildingRestrict: "Power Plant II", techRestrict: "Power Plant II"},
  {name: "Crystalline Power Plant", output: [0,6,0,0,0,0], buildTime: 100, cost: [50,50,0,0,0,0], mod: [0,0,0,0,0,0], maintenance: [-1,0,-1,0,0,0], techLevelRestrictMin: 4, techLevelRestrictMax: 99, biomeRestrict: "NotToxic", terrainRestrict: "Land", buildingRestrict: null, specResRestrict: "Crystal Cells"},
  {name: "Lab I", output: [0,0,0,1,1,1], buildTime: 100, cost: [150,50,0,0,0,0], mod: [0,0,0,0,0,0], maintenance: [0,-1,-1,0,0,0], techLevelRestrictMin: 4, techLevelRestrictMax: 99, biomeRestrict: "NotToxic", terrainRestrict: "Land", buildingRestrict: null},
  {name: "Star Observatory", output: [0,0,0,3,1,1], buildTime: 250, cost: [250,50,0,0,0,0], mod: [0,0,0,0,0,0], maintenance: [0,-2,-1,0,0,0], techLevelRestrictMin: 4, techLevelRestrictMax: 99, biomeRestrict: "NotToxic", terrainRestrict: "Land", buildingRestrict: "Lab I", techRestrict: "Star Research I"},
  {name: "Biological Survey", output: [0,0,0,1,3,1], buildTime: 250, cost: [250,50,0,0,0,0], mod: [0,0,0,0,0,0], maintenance: [0,-2,-1,0,0,0], techLevelRestrictMin: 4, techLevelRestrictMax: 99, biomeRestrict: "NotToxic", terrainRestrict: "Land", buildingRestrict: "Lab I", techRestrict: "Society Research I"},
  {name: "Engineering Facility", output: [0,0,0,1,1,3], buildTime: 250, cost: [250,50,0,0,0,0], mod: [0,0,0,0,0,0], maintenance: [0,-2,-1,0,0,0], techLevelRestrictMin: 4, techLevelRestrictMax: 99, biomeRestrict: "NotToxic", terrainRestrict: "Land", buildingRestrict: "Lab I", techRestrict: "Production Research I"},
  {name: "Colony", output: [0,0,3,3,3,3], buildTime: 250, cost: [250,0,50,0,0,0], mod: [0,0,0,0,0,0], maintenance: [-3,-3,0,0,0,0], techLevelRestrictMin: 4, techLevelRestrictMax: 99, biomeRestrict: "NotToxic", terrainRestrict: "Land", buildingRestrict: null}
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
shipAliens["Drone"] = {name: "Drone", strength: 50, maxHealth: 50, speed: 2, attitude: "Neutral", ai: "Innocent", speed: 1, mean: 3, stdDev: 2, ftl: 30, maxFtl: 30};
shipAliens["Predator"] = {name: "Predator", strength: 150, maxHealth: 100, speed: 2, attitude: "Hostile", ai: "Aggressive", speed: 0.5, mean: 1, stdDev: 1, ftl: 100, maxFtl: 100};
shipAliens["PirateCruiser"] = {name: "PirateCruiser", strength: 40, maxHealth: 40, speed: 2, attitude: "Hostile", ai: "Passive", speed: 1, mean: 3, stdDev: 2, ftl: 30, maxFtl: 30};
shipAliens["PirateDestroyer"] = {name: "PirateDestroyer", strength: 125, maxHealth: 50, speed: 2, attitude: "Hostile", ai: "Aggressive", speed: 1, mean: 2, stdDev: 1, ftl: 30, maxFtl: 30};
shipAliens["Startraveller"] = {name: "Startraveller", strength: 50, maxHealth: 100, speed: 2, attitude: "Neutral", ai: "Evasive", speed: 2, mean: 4, stdDev: 2, ftl: 30, maxFtl: 30};
shipAliens["Guardian"] = {name: "Guardian", strength: 500, maxHealth: 500, speed: 2, attitude: "Neutral", ai: "Passive", speed: 0.5, mean: 1, stdDev: 0, ftl: 30, maxFtl: 30};

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

var numStars = 300;
var numPlanets = 1000;
var numAsteroids = 1000;

var sectorRadius = 10;

var numMajorCivs = 10;
var numMinorCivs = 0;

/*
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
*/

var biomes = [
  ["Arid", "A", 0.2],
  ["Icy", "I", 0.2],
  ["Tundra", "Tn", 0.4],
  ["Ocean", "O", 0.6],
  ["Temperate", "Te", 1.0],
  ["Tropical", "Tr", 0.6],
  ["Toxic", "Tx", 0.0],
  ["Gaia", "G", 1.0],
  ["Ice Cream", "IC", 0.6],
  ["Barren", "B", 0.0],
  ["Cold Barren", "CB", 0.0],
  ["Gas Giant", "GG", 0.0],
  ["Primordial", "P", 0.4],
  ["Asteroid", "x", 0.0]
];

var biomeChances = [1,0.5,0.5,1,1,1,1,0.5,0.1,3,3,0.3,0.3,0]

var temperatePreferenceNum = [0.2, 0.2, 0.4, 0.6, 1.0, 0.6, 0.0, 1.0, 0.6, 0.0, 0.0, 0.0, 0.4, 0.0];
var coldPreferenceNum =      [0.6, 1.0, 1.0, 0.4, 0.2, 0.0, 0.0, 0.6, 0.8, 0.0, 0.0, 0.0, 0.4, 0.0];
var hotPreferenceNum =       [1.0, 0.0, 0.2, 0.6, 0.6, 0.8, 0.0, 1.0, 0.2, 0.0, 0.0, 0.0, 0.4, 0.0];

var temperatePreference = {}, coldPreference = {}, hotPreference = {};

var ethics = [];
ethics.push({
  name: "Ascensionist",
  desc: "Desire to go beyond and break the chains of biological substance, perfection over species identity and autonomy — to become greater.",
  mod: [-0.1,0,-0.1,0.1,0.1,0.1],
  specialAbility: null
});
ethics.push({
  name: "Perfectionist",
  desc: "Desire to improve life to the best quality possible, while maintaining identity.",
  mod: [-0.05,0.05,0.05,0,0,0],
  specialAbility: null
});
ethics.push({
  name: "Individualist",
  desc: "Belief in the freedom, autonomy, and free will of individuals, whose lives intersect in complicated ways.",
  mod: [0,0.15,0,0,0.1,0],
  ethicDiv: 0.1,
  specialAbility: null
});
ethics.push({
  name: "Collectivist",
  desc: "Belief in the health and well-being of the group above individuals, faith and trust in society.",
  mod: [0.1,0,0.1,0.1,0,0],
  ethicDiv: -0.1,
  specialAbility: null
});
ethics.push({
  name: "Scientific",
  desc: "Belief in the power of knowledge, careful observation, and understanding of physical laws, to further the goals of the species.",
  mod: [0,-0.1,0,0.05,0.05,0.05],
  ethicDiv: 0.1,
  specialAbility: null
});
ethics.push({
  name: "Spiritualist",
  desc: "Belief in the power of faith, as well as understanding of societies and greater beings, to further the mental prowess of the species.",
  mod: [0,0,0,-0.05,0.15,-0.05],
  ethicDiv: -0.1,
  specialAbility: null
});
ethics.push({
  name: "Pacifistic",
  desc: "Harmony and cooperation above all, peace ensures prosperity and preserves the well-being of the galaxy.",
  mod: [-0.05,-0.05,0,0,0.1,-0.05],
  ethicDiv: 0,
  specialAbility: null
});


var examplePlanetMod = {
  name: "Mineral Field",
  desc: "This planet has rich, natural deposits of well-formed, high quality minerals.",
  mod: [0.25,0,0,0,0,0]
};

var biomeDesc = {};
biomeDesc["Arid"] = "Dry and nearly barren, this planet is harsh for many forms of higher life.";
biomeDesc["Icy"] = "Cold and frozen over yet still barely inhabitable, this planet preserves little life and biodiversity.";
biomeDesc["Tundra"] = "Mostly grasses and patches of ice, this planet is tough to live off of.";
biomeDesc["Ocean"] = "This planet has a wet, warm climate and a thick atmosphere which led to the formation of large bodies of water.";
biomeDesc["Temperate"] = "This planet has seasonal, normal weather supporting a somewhat diverse ecosystem.";
biomeDesc["Tropical"] = "Hot and humid, this planet is home to all types of life.";
biomeDesc["Gaia"] = "This planet is a monument and living museum to all the biodiversity imaginable within the universe.";
biomeDesc["Toxic"] = "Magma flowing in rivers, noxious gases in the air, and jagged, hostile terrain render this planet unbearable and unlivable.";
biomeDesc["Ice Cream"] = "This planet is very peculiar — the frozen surface preserves a massive sea almost like a cosmic slushie of water, sugar, and lactating bacteria.";
biomeDesc["Barren"] = "This planet has no atmosphere, a past of volcanic activity, and all its life has passed away ages ago.";
biomeDesc["Cold Barren"] = "This planet is cold due to its lack of an atmosphere, and life never lived here.";
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

var nameFileNames = ["AI","ART1","ART2","ART3","AVI1","AVI2","AVI3","Extradimensional","FUN1","FUN2","FUN3",
                     "Human","Human2","MAM1","MAM2","MAM3","MAM4","MAM5","MOL1","MOL2","MOL3","Prethoryn",
                     "PRT1","PRT2","REP1","REP2","REP3"];
var keyNameWords = ["full_names", "generic", "names"];

var names = {};

function parseNameFile(fileName, data) {
  //console.log(data);
  names[fileName] = [];
  var split = data.replace("\n", " ").split(/\{|\}/);
  var parseNamesNextToken = false;
  for (var i = 0; i < split.length; i++) {
    var token = split[i].trim();
    if (parseNamesNextToken) {
      parseNamesNextToken = false;
      var allNamesInFile = token.replace('"', "").split(" ");
      for (var j = 0; j < allNamesInFile.length; j++) {
        names[fileName].push(allNamesInFile[j]);
      }
      console.log(token);
    }
    else {
      for (var j = 0; j < keyNameWords.length; j++) {
        if (token.indexOf(keyNameWords[j]) !== -1) {
          parseNamesNextToken = true;
          break;
        }
      }
    }
  }
}

function parseFiles() {
  for (var i = 0; i < nameFileNames.length; i++) {
    var url = "./name_lists/" + nameFileNames[i] + ".txt";
    readFile(url, parseNameFile);
  }
}

function readFile(file, dataFunction) {
  var rawFile = new XMLHttpRequest();
  rawFile.onreadystatechange = function() {
    if (rawFile.readyState === 4) {
      if (rawFile.status === 200 || rawFile.status == 0) {
        var allText = rawFile.responseText;
        dataFunction(allText);
        rawFile.abort();
        rawFile = null;
      }
    }
  }
  rawFile.open("GET", file, false);
  rawFile.send(null);
}

/*
function getJsonpUrl(url, callback) {
  $(document).ready(function() {
    $.ajax({
      url: url,
      dataType: 'txt',
      success: function(dataWeGotViaJsonp) {
        //console.log(dataWeGotViaJsonp);
        callback(dataWeGotViaJsonp);
      }
    });
  });
}
*/

parseFiles();















//A comment to hold the line
