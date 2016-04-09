// ===========================================
// 47都道府県クイズ JavaScript
// ===========================================

//  ============アプリ共通変数の定義============

//グローバルオブジェクト（空オブジェクト）
var MYQUIZ = {};

//都道府県データ（名称、面積(平方km)）
MYQUIZ.todofuken = [
    ["北海道", "83457"],["青森県", "9644"],  ["岩手県", "15279"],
    ["宮城県", "7286"], ["秋田県", "11636"], ["山形県", "9323"],
    ["福島県", "13783"],["茨城県", "6096"],  ["栃木県", "6408"],
    ["群馬県", "6363"], ["埼玉県", "3797"],  ["千葉県", "5157"],
    ["東京都", "2188"], ["神奈川県", "2416"],["新潟県", "12584"],
    ["富山県", "4248"], ["石川県", "4186"],  ["福井県", "4190"],
    ["山梨県", "4465"], ["長野県", "13562"], ["岐阜県", "10621"],
    ["静岡県", "7780"], ["愛知県", "5165"],  ["三重県", "5777"],
    ["滋賀県", "4017"], ["京都府", "4613"],  ["大阪府", "1898"],
    ["兵庫県", "8396"], ["奈良県", "3691"],  ["和歌山県","4726"],
    ["鳥取県", "3507"], ["島根県", "6708"],  ["岡山県", "7113"],
    ["広島県", "8479"], ["山口県", "6113"],  ["徳島県", "4147"],
    ["香川県", "1877"], ["愛媛県", "5678"],  ["高知県", "7105"],
    ["福岡県", "4977"], ["佐賀県", "2440"],  ["長崎県", "4105"],
    ["熊本県", "7405"], ["大分県", "6340"],  ["宮崎県", "7736"],
    ["鹿児島県","9189"],["沖縄県", "2276"]
];

quiz_text = [];
$(document).ready(function(){
  quiz_text = creatQuiz(); // in create_quiz.js
});


//スコアの初期化
if(!localStorage.totalQuestion){
    //localStorage.totalQuestion = 0;
    //localStorage.correctAnswer = 0;
    //localStorage.timeUsed = 0;
    resetLocalStorage();
}

//  =====▽▽この下にページごとの処理を記述します▽▽=====

//  ============ページ区切り[問題]============
$(document).on("pageinit", "#questionPage", function(){

   //画面表示時の処理
    $("#questionPage").on("pageshow", function() {
        var randNum = new Array(3);
         timeCount() ;//セットタイマー
         setInterval(function(){showTime();}, 500);//時間表示
         if (!sessionStorage.quiz_id||sessionStorage.quiz_id >= quiz_text.length) {
           sessionStorage.quiz_id = 0; //もしクイズがなしまたはクイズが終わりのとき、一から繰り返す
         }
         var tempQuiz = quiz_text[sessionStorage.quiz_id];
         sessionStorage.ans = tempQuiz.ans;//set answer
         $("#quiz_text").html(tempQuiz.text);
         $(".quiz_img").attr("src","./img/quiz/"+tempQuiz.image);
         $("#1").html(tempQuiz.choices[0]);
         $("#2").html(tempQuiz.choices[1]);
         $("#3").html(tempQuiz.choices[2]);


        /*
        //0から46までの重複のない整数を3つ取得
        do{
            for(var i = 0; i < randNum.length ; i++){
                randNum[i] = Math.floor(Math.random() * 47);
            }
        }while(MYQUIZ.isDuplicate(randNum));
        //問題を表示
        $("#1").html(MYQUIZ.todofuken[randNum[0]][0]);
        $("#2").html(MYQUIZ.todofuken[randNum[1]][0]);
        $("#3").html(MYQUIZ.todofuken[randNum[2]][0]);

        //都道府県番号をsessionStorageに保存
        sessionStorage.randNum1 = randNum[0];
        sessionStorage.randNum2 = randNum[1];
        sessionStorage.randNum3 = randNum[2];
          */
    });
    // when choien
    $("#questionList a").on("click", function() {
        var selectedAns = $(this).html();
        sessionStorage.selectedAns = selectedAns;

        //alert(sessionStorage.selectedAns);
        //alert(sessionStorage.selectedAns == sessionStorage.ans)// ===はfalse
    });
    /*
    //都道府県名の選択時の処理
    $("#questionList a").on("click", function() {
        var selectedId = $(this).attr("id");
        sessionStorage.selectedNumber = sessionStorage["randNum" + selectedId];
	//alert(sessionStorage.selectedNumber);
    });
    */
});

/*
//配列内の値の重複を確認
MYQUIZ.isDuplicate = function(array){
    array.sort();
    for(var i = 0; i < (array.length - 1); i++){
        if(array[i] === array[i + 1]) return true;
    }
    return false;
}
*/
//  ============ページ区切り[解答]============
$(document).on("pageinit", "#answerPage", function(){

    //画面表示時の処理
    $("#answerPage").on("pageshow", function() {
      //正誤の判定と表示
      if(sessionStorage.selectedAns == sessionStorage.ans){
          $("#judge").html("正解").css("color","green")/*.css("font-size","2em")*/;
          localStorage.correctAnswer++;
      }else{
          $("#judge").html("ハズレ").css("color","red")/*.css("font-size","0.2em")*/;
      }
      $("#ans").html(sessionStorage.ans);
      //総解答数の更新
      localStorage.totalQuestion++;
      //問題の前進
      sessionStorage.quiz_id++;

      /*
        var selectedNum = sessionStorage.selectedNumber;
        var randNum = new Array(3);
        randNum[0] = sessionStorage.randNum1;
        randNum[1] = sessionStorage.randNum2;
        randNum[2] = sessionStorage.randNum3;

        var questionData = new Array(3);
        for(var i = 0; i < questionData.length; i++){
            questionData[i] = new Array(2);
            questionData[i][0] = MYQUIZ.todofuken[randNum[i]][0];
            questionData[i][1] = MYQUIZ.todofuken[randNum[i]][1];
        }
        questionData.sort(MYQUIZ.arraySort);
        //正誤の判定と表示
        if(questionData[0][0] === MYQUIZ.todofuken[selectedNum][0]){
            $("#judge").html("正解").css("color","green");
            localStorage.correctAnswer++;
        }else{
            $("#judge").html("ハズレ").css("color","red");
        }

        //ランキング表示
        for(var i = 0; i < questionData.length; i++){
            $("#todofuken" + (i+1) ).html(questionData[i][0]);
            $("#areaSize" + (i+1) ).html(questionData[i][1] + "平方Km");
        }
        */

    });
});
//2次元配列ソート(並べ替え)用の関数
MYQUIZ.arraySort = function(a, b){
    return b[1] - a[1];//array[][]の二番目を大きい順で並び替え
}
//  ============ページ区切り[正解率]============
$(document).on("pageinit", "#scorePage", function(){

   //画面表示時の処理
    $("#scorePage").on("pageshow", function() {
       $("#totalQuestion").html(localStorage.totalQuestion);
       $("#correctAnswer").html(localStorage.correctAnswer);
       var ratio = Math.floor((localStorage.correctAnswer / localStorage.totalQuestion) * 100);
       $("#correctRatio").html(ratio + "%");
    });
});


//  =============その他の関数====================
//シャッフル関数
function shuffle(array){
  var ary_length = array.length;
  for (var i = 0; i < ary_length*2; i++) {
    var num_01=Math.floor( Math.random() * (ary_length) );
    var num_02=Math.floor( Math.random() * (ary_length) );
    var temp = array[num_01];
    array[num_01] = array[num_02];
    array[num_02] = temp;
  }
}
//localStorageを空に
function resetLocalStorage() {
  //alert("clear")
  //localStorage.clear();
  //var quiz_text = creatQuiz();
  //alert(quiz_text[1].ans)
  //alert(quiz_text[1].ans == quiz_text[1].choices[2])
  //alert(quiz_text[1].ans == quiz_text[1].choices[1])
  localStorage.totalQuestion = 0;
  localStorage.correctAnswer = 0;
  localStorage.timeUsed = 0;
}
// タイマー
var timer
function timeCount() {
  if (!localStorage.timeUsed) {
    localStorage.timeUsed = 0;
  }
  timer = setInterval(function(){
    localStorage.timeUsed++;
  }, 1000);
}
function timeStop(){
  clearInterval(timer);
  localStorage.timeUsed = 0;
}

function showTime() {
  var sec = parseInt(localStorage.timeUsed%60);
  var min = parseInt(localStorage.timeUsed/60);
  var timeStr = checkTime(min)+":"+checkTime(sec);
  $(".timer").html(timeStr);
}
function checkTime(i) {
  if (i<10){i="0" + i}
    return i
}
