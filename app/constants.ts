interface TYPE_COLORS_Type {
    [key: string]: string; 
    grass: string;
    poison: string;
    fire: string;
    normal: string,
    water: string,
    flying: string,
    electric: string,
    ice: string,
    fighting: string,
    ground: string,
    psychic: string,
    bug: string,
    rock: string,
    ghost: string,
    dark: string,
    dragon: string,
    steel: string,
    fairy: string;
  }
  

export const TYPE_COLORS : TYPE_COLORS_Type = {
    grass: "#6890f0",
    poison: "#a040a0",
    fire: "#fd7d24",
    normal: "#A8A878",
    water: "#6890f0",
    flying: "#a890f0",
    electric: "#6890f0",
    ice: "#98d8d8",
    fighting: "#c03028",
    ground: "#e0c068",
    psychic: "#f85888",
    bug: "#a8b820",
    rock: "#b8a038",
    ghost: "#705898",
    dark: "#705848",
    dragon: "#7038f8",
    steel: "#b8b8d0",
    fairy: "#f0b6bc"
};

interface STAT_SHORT_NAMES_Type {
  [key: string]: string; 
  "hp": string;
  "attack": string;
  "defense": string;
  "special-defense": string,
  "special-attack": string,
  "speed": string,
}

export const STAT_SHORT_NAMES : STAT_SHORT_NAMES_Type = {
  "hp": "hp",
  "attack": "atk",
  "defense": "def",
  "special-defense": "s.def",
  "special-attack": "s.atk",
  "speed": "spd"
}

interface STAT_COLORS_Type {
  [key: string]: string; 
  "hp": string;
  "attack": string;
  "defense": string;
  "special-defense": string,
  "special-attack": string,
  "speed": string,
} 
export const STAT_COLORS : STAT_COLORS_Type = {
  "hp": "#f15f4d",
  "attack": "#0894be",
  "defense": "#dd6f8b",
  "special-defense": "#419573",
  "special-attack": "#ffdd57",
  "speed": "#a0e515"
}