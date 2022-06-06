/*
 * From Sugar Custom 2022.06.04
 *
 *  Freely distributable and licensed under the MIT-style license.
 *  Copyright (c)  Andrew Plummer
 *  https://sugarjs.com/
 *
 */

class InflectionSet {
 constructor() {
  /**
   * @type {{string:string}}
   */
  this.map = {};
  /**
   * @type {{rule:RegExp,replacement:string}[]}
   */
  this.rules = [];
 }
 /**
  * Add to map.
  * @param {string|RegExp} rule - the string or regex  to search for.
  * @param {string} replacement the string to replace with
  */
 add(rule, replacement) {
  if (typeof rule === "string") {
   this.map[rule] = replacement;
  } else {
   this.rules.unshift({
    rule: rule,
    replacement: replacement
   });
  }
 }
 /**
  * Lookup word in map and return modified version.
  * @param {string} str - the word to lookup
  */
 inflect(str) {
  let lu = this.map[str] ?? this.runRules(str);
  return lu;
 }

 runRules(str) {
  var s = "";
  for (let i in this.rules) {
   let r = this.rules[i];
   let rule = r.rule;
   let replacement = r.replacement;
   if (rule.test(str)) {
    s += str.replace(rule, replacement);
    break;
   }
  }
  return s;
 }
}

function buildCommonPlurals() {
 addPlural(/$/, "s");
 addPlural(/s$/i, "s");
 addPlural(/(ax|test)is$/i, "$1es");
 addPlural(/(octop|fung|foc|radi|alumn|cact)(i|us)$/i, "$1i");
 addPlural(/(census|alias|status|fetus|genius|virus)$/i, "$1es");
 addPlural(/(bu)s$/i, "$1ses");
 addPlural(/(buffal|tomat)o$/i, "$1oes");
 addPlural(/([ti])um$/i, "$1a");
 addPlural(/([ti])a$/i, "$1a");
 addPlural(/sis$/i, "ses");
 addPlural(/f+e?$/i, "ves");
 addPlural(/(cuff|roof)$/i, "$1s");
 addPlural(/([ht]ive)$/i, "$1s");
 addPlural(/([^aeiouy]o)$/i, "$1es");
 addPlural(/([^aeiouy]|qu)y$/i, "$1ies");
 addPlural(/(x|ch|ss|sh)$/i, "$1es");
 addPlural(/(tr|vert)(?:ix|ex)$/i, "$1ices");
 addPlural(/([ml])ouse$/i, "$1ice");
 addPlural(/([ml])ice$/i, "$1ice");
 addPlural(/^(ox)$/i, "$1en");
 addPlural(/^(oxen)$/i, "$1");
 addPlural(/(quiz)$/i, "$1zes");
 addPlural(/(phot|cant|hom|zer|pian|portic|pr|quart|kimon)o$/i, "$1os");
 addPlural(/(craft)$/i, "$1");
 addPlural(/([ft])[eo]{2}(th?)$/i, "$1ee$2");
 addSingular(/s$/i, "");
 addSingular(/([pst][aiu]s)$/i, "$1");
 addSingular(/([aeiouy])ss$/i, "$1ss");
 addSingular(/(n)ews$/i, "$1ews");
 addSingular(/([ti])a$/i, "$1um");
 addSingular(/((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$/i, "$1$2sis");
 addSingular(/(^analy)ses$/i, "$1sis");
 addSingular(/(i)(f|ves)$/i, "$1fe");
 addSingular(/([aeolr]f?)(f|ves)$/i, "$1f");
 addSingular(/([ht]ive)s$/i, "$1");
 addSingular(/([^aeiouy]|qu)ies$/i, "$1y");
 addSingular(/(s)eries$/i, "$1eries");
 addSingular(/(m)ovies$/i, "$1ovie");
 addSingular(/(x|ch|ss|sh)es$/i, "$1");
 addSingular(/([ml])(ous|ic)e$/i, "$1ouse");
 addSingular(/(bus)(es)?$/i, "$1");
 addSingular(/(o)es$/i, "$1");
 addSingular(/(shoe)s?$/i, "$1");
 addSingular(/(cris|ax|test)[ie]s$/i, "$1is");
 addSingular(/(octop|fung|foc|radi|alumn|cact)(i|us)$/i, "$1us");
 addSingular(/(census|alias|status|fetus|genius|virus)(es)?$/i, "$1");
 addSingular(/^(ox)(en)?/i, "$1");
 addSingular(/(vert)(ex|ices)$/i, "$1ex");
 addSingular(/tr(ix|ices)$/i, "trix");
 addSingular(/(quiz)(zes)?$/i, "$1");
 addSingular(/(database)s?$/i, "$1");
 addSingular(/ee(th?)$/i, "oo$1");
 addIrregular("child", "children");
 addIrregular("goose", "geese");
 addIrregular("human", "humans");
 addIrregular("man", "men");
 addIrregular("move", "moves");
 addIrregular("person", "people");
 addIrregular("save", "saves");
 addIrregular("sex", "sexes");
 addIrregular("zombie", "zombies");
 addUncountable("equipment information rice money species series fish deer sheep jeans");
}

function addPlural(singular, plural = singular) {
 addInflection("plural", singular, plural);
 if (typeof singular === "string") {
  addSingular(plural, singular);
 }
}

function addSingular(plural, singular) {
 addInflection("singular", plural, singular);
}

function addIrregular(singular, plural) {
 var sReg = RegExp(singular + "$", "i");
 var pReg = RegExp(plural + "$", "i");
 addPlural(sReg, plural);
 addPlural(pReg, plural);
 addSingular(pReg, singular);
 addSingular(sReg, singular);
}

function addUncountable(set) {
 let split = set.split(" ");
 split.forEach(function (str) {
  addPlural(str);
 });
}
const Inflections = {
 "plural": new InflectionSet(),
 "singular": new InflectionSet()
};
let inflectPlurals = (type, str) => Inflections[type].inflect(str);
function addInflection(type, rule, replacement) {
 Inflections[type].add(rule, replacement);
}
let pluralize = str => inflectPlurals("plural", str);

let singularize = str => inflectPlurals("singular", str);

buildCommonPlurals();

globalThis.fmt = {plur: pluralize, sing: singularize};
console.log(pluralize("octopi"));
console.log(singularize("octopi"));
