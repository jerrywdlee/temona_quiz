

array=["aa","bb","cc","dd","ee"];

for (var i = 0; i < array.length; i++) {
  console.log(array[i]);
}

console.log("=========================")
shuffle_one(array);
console.log("=========================")
for (var i = 0; i < array.length; i++) {
  console.log(array[i]);
}

function shuffle_one(array){
  var ary_length = array.length;
  for (var i = 0; i < ary_length*2; i++) {
    var num_01=Math.floor( Math.random() * (ary_length ) );
    var num_02=Math.floor( Math.random() * (ary_length ) );
    var temp = array[num_01];
    array[num_01] = array[num_02];
    array[num_02] = temp;
  }
}
