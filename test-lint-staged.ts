// 意図的なlintエラーを含むテストファイル
const unusedVariable = 'this will cause eslint error';
let anotherBadVar: any = "bad";

function badFunction(param: any): any {
console.log("bad formatting");
const x    =  123   ;  // Bad formatting
  return param
}

// 未使用の変数
const anotherUnusedVar = 123;
const yetAnotherUnused: string = "test";

// 明らかなESLintエラー
eval("console.log('eval is bad')");

export { badFunction }; 