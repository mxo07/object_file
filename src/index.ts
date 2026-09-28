import * as readline from 'readline';
import * as repl from 'repl';
// import start = require('repl');
// import repl = require('repl');

type TypeName = 'Normal'|'Fire'|'Water'|'Grass'| 'Electric' | 'Ice' | 
    'Fighting' | 'Poison' | 'Ground' | 'Flying' | 'Psychic' | 'Bug' | 
    'Rock' | 'Ghost' | 'Dragon' | 'Dark' | 'Steel' | 'Fairy';


class TypeRelations{
    private static 
        chart: Record<TypeName, Partial<Record<TypeName, number >>> = {
             Normal:   { Rock: 0.5, Ghost: 0, Steel: 0.5 },
        Fire:     { Fire: 0.5, Water: 0.5, Grass: 2, Ice: 2, Bug: 2, Rock: 0.5, Dragon: 0.5, Steel: 2 },
        Water:    { Fire: 2, Water: 0.5, Grass: 0.5, Ground: 2, Rock: 2, Dragon: 0.5 },
        Grass:    { Fire: 0.5, Water: 2, Grass: 0.5, Poison: 0.5, Ground: 2, Flying: 0.5, Bug: 0.5, Rock: 2, Dragon: 0.5, Steel: 0.5 },
        Electric: { Water: 2, Grass: 0.5, Electric: 0.5, Ground: 0, Flying: 2, Dragon: 0.5 },
        Ice:      { Fire: 0.5, Water: 0.5, Grass: 2, Ice: 0.5, Ground: 2, Flying: 2, Dragon: 2, Steel: 0.5 },
        Fighting: { Normal: 2, Ice: 2, Poison: 0.5, Flying: 0.5, Psychic: 0.5, Bug: 0.5, Rock: 2, Ghost: 0, Dark: 2, Steel: 2, Fairy: 0.5 },
        Poison:   { Grass: 2, Poison: 0.5, Ground: 0.5, Rock: 0.5, Ghost: 0.5, Steel: 0, Fairy: 2 },
        Ground:   { Fire: 2, Electric: 2, Grass: 0.5, Poison: 2, Flying: 0, Bug: 0.5, Rock: 2, Steel: 2 },
        Flying:   { Grass: 2, Electric: 0.5, Fighting: 2, Bug: 2, Rock: 0.5, Steel: 0.5 },
        Psychic:  { Fighting: 2, Poison: 2, Psychic: 0.5, Dark: 0, Steel: 0.5 },
        Bug:      { Fire: 0.5, Grass: 2, Fighting: 0.5, Poison: 0.5, Flying: 0.5, Psychic: 2, Ghost: 0.5, Dark: 2, Steel: 0.5, Fairy: 0.5 },
        Rock:     { Fire: 2, Ice: 2, Fighting: 0.5, Ground: 0.5, Flying: 2, Bug: 2, Steel: 0.5 },
        Ghost:    { Normal: 0, Psychic: 2, Ghost: 2, Dark: 0.5 },
        Dragon:   { Dragon: 2, Steel: 0.5, Fairy: 0 },
        Dark:     { Fighting: 0.5, Psychic: 2, Ghost: 2, Dark: 0.5, Fairy: 0.5 },
        Steel:    { Fire: 0.5, Water: 0.5, Ice: 2, Rock: 2, Steel: 0.5, Fairy: 2 },
        Fairy:    { Fire: 0.5, Fighting: 2, Poison: 0.5, Dragon: 2, Dark: 2, Steel: 0.5 }
        };
        
    static getEffectiveness(attack: TypeName, defense: TypeName): number {
        return this.chart[attack]?.[defense] ?? 1;
    }
            
}

//技クラス
class Skill {
    constructor(
        public readonly name: string,
        public readonly type: TypeName,
        public readonly power: number
    ){}
}

//ポケモンクラス
class Pokemon {
    protected hp: number;

    constructor(
        public readonly name: string,
        protected types: TypeName[],
        public readonly maxHp: number,
        private skills: Skill[]
    ){
        this.hp = maxHp;
    }

    getSkills(): Skill[] {
        return this.skills;
    }

    getHp(): number{
        return this.hp;
    }

    //責任の分散
    receiveDamage(damage: number, attackType: TypeName): void {
        let effectiveness = 1;
        this.types.forEach(defType => {
            effectiveness *= TypeRelations.getEffectiveness(attackType, defType);
        });

        const finalDamage = Math.floor(damage * effectiveness);
        this.hp = Math.max(0, this.hp - finalDamage);

        console.log(`${this.name}は${finalDamage}のダメージを受けた！`);
        if(effectiveness > 1) console.log("効果はバツグンだ！");
        if(effectiveness < 1 && effectiveness > 0)console.log("効果はいまひとつのようだ...");
        if(effectiveness === 0) console.log("効果がないみたいだ...");
    }
}

interface PokemonTemplate{
  name: string;
  types: TypeName[];
  maxHp: number;
  skills: Skill[];
}

const POKEMON_DATABASE: PokemonTemplate[] =[
{ name: "カビゴン", types: ["Normal"], maxHp: 150, skills: [new Skill("のしかかり", "Normal", 70)] },
  { name: "リザードン", types: ["Fire", "Flying"], maxHp: 100, skills: [new Skill("かえんほうしゃ", "Fire", 80)] },
  { name: "カメックス", types: ["Water"], maxHp: 110, skills: [new Skill("ハイドロポンプ", "Water", 80)] },
  { name: "フシギバナ", types: ["Grass", "Poison"], maxHp: 105, skills: [new Skill("ソーラービーム", "Grass", 90)] },
  { name: "ピカチュウ", types: ["Electric"], maxHp: 80, skills: [new Skill("10まんボルト", "Electric", 80)] },
  { name: "ラプラス", types: ["Water","Ice"], maxHp: 130, skills: [new Skill("れいとうビーム", "Ice", 80)] },
  { name: "カイリキー", types: ["Fighting"], maxHp: 110, skills: [new Skill("クロスチョップ", "Fighting", 80)] },
  { name: "ゲンガー", types: ["Ghost", "Poison"], maxHp: 90, skills: [new Skill("ヘドロばくだん", "Poison", 80)] },
  { name: "サイドン", types: ["Ground","Rock"], maxHp: 120, skills: [new Skill("じしん", "Ground", 90)] },
  { name: "ピジョット", types: ["Normal","Flying"], maxHp: 100, skills: [new Skill("エアスラッシュ", "Flying", 75)] },
  { name: "フーディン", types: ["Psychic"], maxHp: 85, skills: [new Skill("サイコキネシス", "Psychic", 80)] },
  { name: "ハッサム", types: ["Bug","Steel"], maxHp: 100, skills: [new Skill("シザークロス", "Bug", 75)] },
  { name: "バンギラス", types: ["Rock","Dark"], maxHp: 120, skills: [new Skill("いわなだれ", "Rock", 75)] },
  { name: "ミミッキュ", types: ["Ghost","Fairy"], maxHp: 95, skills: [new Skill("シャドーボール", "Ghost", 80)] },
  { name: "カイリュー", types: ["Dragon", "Flying"], maxHp: 125, skills: [new Skill("ドラゴンクロー", "Dragon", 80)] },
  { name: "ブラッキー", types: ["Dark"], maxHp: 140, skills: [new Skill("あくのはどう", "Dark", 80)] },
  { name: "ジバコイル", types: ["Steel","Electric"], maxHp: 70, skills: [new Skill("ラスターカノン", "Steel", 120)] },
  { name: "サーナイト", types: ["Fairy","Psychic"], maxHp: 95, skills: [new Skill("ムーンフォース", "Fairy", 85)] }
];

// const charizard = new Pokemon("リザードン", ["Fire"], 100, [
//   new Skill("かえんほうしゃ", "Fire", 90),
//   new Skill("きりさく", "Normal", 70)
// ]);

// const blastoise = new Pokemon("カメックス", ["Water"], 100, [
//   new Skill("ハイドロポンプ", "Water", 110)
// ]);
// const venusaur = new Pokemon("フシギバナ", ["Grass"], 100, [
//   new Skill("つるのムチ","Grass",45),
//   new Skill("たいあたり","Normal",40)
// ]);

function createPokemonFromTemplate(template: PokemonTemplate): Pokemon {
    const skillsCopy = template.skills.map(s => new Skill(s.name, s.type, s.power));
    return new Pokemon(template.name, [...template.types], template.maxHp, skillsCopy);
}

function getRandomWildPokemon(): Pokemon {
    const randomIndex = Math.floor(Math.random() * POKEMON_DATABASE.length);
    const template = POKEMON_DATABASE[randomIndex];
    
    if(!template){
      return createPokemonFromTemplate(POKEMON_DATABASE[0]!);
    }

    return createPokemonFromTemplate(template);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
let playerPokemon: Pokemon;
let wildPokemon: Pokemon;

let myPartyTemplates: PokemonTemplate[] = [];
  function askQuestion(query: string): Promise<string> {
    return new Promise(resolve => rl.question(query, resolve));
}

startGame();

function isAdvantageous(candidate: PokemonTemplate, wild: PokemonTemplate): boolean {
    // ① 味方の技が野生のポケモンに効果バツグン（2倍以上）か？
    let attackEffectiveness = 1;
    const candidateSkill = candidate.skills[0]; // 味方の最初の技
    if (candidateSkill) {
        wild.types.forEach(defType => {
            attackEffectiveness *= TypeRelations.getEffectiveness(candidateSkill.type, defType);
        });
    }

  let defenseEffectiveness = 1;
    const wildSkill = wild.skills[0]; // 野生の最初の技
    if (wildSkill) {
        candidate.types.forEach((defType: TypeName) => {
            defenseEffectiveness *= TypeRelations.getEffectiveness(wildSkill.type, defType);
        });
    }

    return attackEffectiveness >= 2 || defenseEffectiveness <= 0.5;
  }

function startGame(){
    const wildIndex = Math.floor(Math.random() * POKEMON_DATABASE.length);
    const wildTemplate = POKEMON_DATABASE[wildIndex]!;
    wildPokemon = createPokemonFromTemplate(wildTemplate);

  console.log(`あ、やせいの ${wildPokemon.name} （タイプ: ${wildTemplate.types.join('/')}）が とびだしてきた！`);

  const goodPokemon: PokemonTemplate[] = [];
  const otherPokemon: PokemonTemplate[] = [];

      POKEMON_DATABASE.forEach(p => {
        if (isAdvantageous(p, wildTemplate)) {
            goodPokemon.push(p);
        } else {
            otherPokemon.push(p);
        }
    });

  myPartyTemplates = [];
  const goodCount = Math.min(goodPokemon.length, 2);

  goodPokemon.sort(() => Math.random() - 0.5);
    for (let i = 0; i < goodCount; i++){
        if(goodPokemon[i]) myPartyTemplates.push(goodPokemon[i]!);
    }

  otherPokemon.sort(() => Math.random() - 0.5);
  while (myPartyTemplates.length < 5 && otherPokemon.length > 0) {
      const p = otherPokemon.pop();
      if (p) myPartyTemplates.push(p);
  }

  if(myPartyTemplates.length === 0){
    myPartyTemplates = POKEMON_DATABASE.slice(0,5);
  }
  choosePokemon();
}
// const myPartyTemplates = POKEMON_DATABASE.slice(0, 5);
    
    // POKEMON_DATABASE.forEach(p => {
    //     if(p.name === wildTemplate.name) return;
    //     if (isAdvantageous(p, wildTemplate)) {
    //         goodPokemon.push(p);
    //     } else {
    //         otherPokemon.push(p);
    //     }
    // });
 
function choosePokemon(){
console.log(`\n--- ゆけ！ ポケモン 選択 ---`);

    if (myPartyTemplates.length === 0) {
        console.log("（デバッグ警告: 手持ち候補が空っぽです）");
    }

    myPartyTemplates.forEach((p, index) => {
        console.log(`${index + 1}: ${p.name} (タイプ:${p.types.join('/')})`);
    });

rl.question('だれを バトルに だす？ (数字を入力): ', (answer) => {
        const choice = parseInt(answer.trim()) - 1;
        if (choice >= 0 && choice < myPartyTemplates.length) {

          const selectedTemplate = myPartyTemplates[choice];

          if(selectedTemplate !== undefined) {
            playerPokemon = createPokemonFromTemplate(selectedTemplate);
            console.log(`\nゆけ！ ${playerPokemon.name} ！`);
            playerTurn();
        }else{
              console.log('ポケモンのデータが見つかりませんでした。');
              choosePokemon();
        }
        } else {
            console.log('正しい 数字を 入力してね！');
            choosePokemon();
        }
    });
}


function playerTurn() {
  console.log(`\n============================`);
  console.log(`--- ${playerPokemon.name} のターン (HP: ${playerPokemon.getHp()}) ---`);
  const skills = playerPokemon.getSkills();

  skills.forEach((skill, index) => {
    console.log(`${index + 1}: ${skill.name} (${skill.type} / 威力:${skill.power})`);
  });

  rl.question('どの わざを つかう？ (数字を入力): ', (answer) => {
    const choice = parseInt(answer.trim()) - 1; 
if (choice >= 0 && choice < skills.length) {
      const chosenSkill = skills[choice];
      if (chosenSkill) {
        console.log(`\n${playerPokemon.name} の ${chosenSkill.name}！`);
        wildPokemon.receiveDamage(chosenSkill.power, chosenSkill.type);

        if (wildPokemon.getHp() <= 0) {
          console.log(`やせいの ${wildPokemon.name} は たおれた！勝負に 勝った！`);
          rl.close(); 
        } else {
          enemyTurn();
        }
      }
    } else {
      console.log('正しい 数字を 入力してね！');
      playerTurn(); 
    }
  });
}

function enemyTurn() {
  console.log(`\n----------------------------`);
  console.log(`--- やせいの ${wildPokemon.name} のターン (HP: ${wildPokemon.getHp()}) ---`);
  
  const enemySkills = wildPokemon.getSkills();
  const randomIndex = Math.floor(Math.random() * enemySkills.length);
  const chosenSkill = enemySkills[randomIndex];

  if (chosenSkill) {
    console.log(`やせいの ${wildPokemon.name} の ${chosenSkill.name}！`);
    playerPokemon.receiveDamage(chosenSkill.power, chosenSkill.type);

    if (playerPokemon.getHp() <= 0) {
      console.log(`${playerPokemon.name} は たおれた！目の前が 真っ暗に なった！`);
      rl.close();
    } else {
      playerTurn();
    }
  }
}







// // バトル開始
// console.log(`あ、やせいの ${venusaur.name} が とびだしてきた！`);
// playerTurn();

// function playerTurn() {
//   console.log(`\n============================`);
//   console.log(`\n--- ${charizard.name} のターン ---`);
//   const skills = charizard.getSkills();

//   skills.forEach((skill, index) => {
//     console.log(`${index + 1}: ${skill.name} (${skill.type} / 威力:${skill.power})`);
//   });

//   rl.question('どの わざを つかう？ (数字を入力): ', (answer) => {
//     const choice = parseInt(answer.trim()) - 1; 

//      // 正しい選択肢が選ばれたかチェック
//     if (choice >= 0 && choice < skills.length) {
//       const chosenSkill = skills[choice];
      
//       if(chosenSkill){
//       console.log(`\n${charizard.name} の ${chosenSkill.name}！`);
//       venusaur.receiveDamage(chosenSkill.power, chosenSkill.type);

//  // カメックスの残りHPをチェック
//       console.log(`${venusaur.name} の残りHP: ${venusaur.getHp()}`);

//       if (venusaur.getHp() <= 0) {
//         console.log(`やせいの ${venusaur.name} は たおれた！`);
//         rl.close(); // アプリを終了
//       } else {
//         // まだ倒れていなければ、次のターンへ（繰り返し）
//         enemyTurn();
//       }
//     }
//     } else {
//       console.log('正しい 数字を 入力してね！');
//       playerTurn(); // もう一度同じターンをやり直す
//     }
//   });
// }

// function enemyTurn(){
//   console.log(`\n============================`);
//   console.log(`\n--- やせいの${venusaur.name} のターン ---`);

//   const enemySkills = venusaur.getSkills();

//   const randomIndex = Math.floor(Math.random() * enemySkills.length);
//   const chosenSkill = enemySkills[randomIndex];

//   if (chosenSkill) {
//     console.log(`やせいの ${venusaur.name} の ${chosenSkill.name}！`);
//     // 自分（リザードン）がダメージを受ける
//     charizard.receiveDamage(chosenSkill.power, chosenSkill.type);
    
//     console.log(`${charizard.name} の残りHP: ${charizard.getHp()}`);

//     // 自分が倒れたかチェック
//     if (charizard.getHp() <= 0) {
//       console.log(`${charizard.name} は たおれた！`);
//       console.log("目の前が 真っ暗に なった！");
//       rl.close();
//     } else {
//       // 生き残っていれば、再びプレイヤーのターンへ戻る
//       playerTurn();
//     }
//   } else {
//     console.log(`やせいの ${venusaur.name} は 技を 覚えていない！`);
//     playerTurn();
//   }
// }
// // const chosenSkill = charizard.getSkills()[0]; // かえんほうしゃを選択


// // if(chosenSkill) {
// // console.log(`${charizard.name} の ${chosenSkill.name}！`);
// // blastoise.receiveDamage(chosenSkill.power, chosenSkill.type);
// // }else {
// //     console.log(`${charizard.name} は 出せる 技が ない!`)
// // }
