// 意図的なlintエラーを含むテストファイル
const unusedVariable = 'this will cause eslint error';

function badFunction(param: any) {
console.log("bad formatting");
  return param
}

// 未使用の変数
const anotherUnusedVar = 123;

export { badFunction }; 