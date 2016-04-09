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
    resetLocalStorage();
}

//  =====▽▽この下にページごとの処理を記述します▽▽=====

//  ============ページ区切り[問題]============
$(document).on("pageinit", "#questionPage", function(){
    if (!timer) {
      timeCount();//多重タイマー防止
    }
   //画面表示時の処理
    $("#questionPage").on("pageshow", function() {
        var randNum = new Array(3);
         setInterval(function(){showTime();}, 500);//時間表示
         if (!sessionStorage.quiz_id||sessionStorage.quiz_id >= quiz_text.length) {
           sessionStorage.quiz_id = 0; //もしクイズがなしまたはクイズが終わりのとき、一から繰り返す
         }
         var tempQuiz = quiz_text[sessionStorage.quiz_id];
         sessionStorage.ans = tempQuiz.ans;//set answer
         $("#quiz_text").html(tempQuiz.text);
         if (tempQuiz.image) {
           $(".quiz_img").attr("src","./img/quiz/"+tempQuiz.image);
         }else {
           $(".quiz_img").attr("src","./img/vietnam.png");
         }
         $("#1").html(tempQuiz.choices[0]);
         $("#2").html(tempQuiz.choices[1]);
         $("#3").html(tempQuiz.choices[2]);
    });
    // when choien
    $("#questionList a").on("click", function() {
        var selectedAns = $(this).html();
        sessionStorage.selectedAns = selectedAns;

        //alert(sessionStorage.selectedAns);
        //alert(sessionStorage.selectedAns == sessionStorage.ans)// ===はfalse
    });
});
//  ============ページ区切り[解答]============
$(document).on("pageinit", "#answerPage", function(){

    //画面表示時の処理
    $("#answerPage").on("pageshow", function() {
      //次の問題ボタンをリセット
      $("#nextButton").html("次の問題").attr("href","#questionPage")
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
      //最後の問題で
      if (sessionStorage.quiz_id == quiz_text.length) {
        $("#nextButton").html("スコア").attr("href","#scorePage")
      }
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
       $("#timeUsed").html(showTime(localStorage.timeUsed));
       // ボタンの処理
       $("#resetBtn").show();
       $("#returnBtn").hide();
    });
    //リセットのロジック
    $("#resetBtn").on("click",function(){
        resetLocalStorage();//点数のりせっと
        resetSessionStorage();
        timeStop();//タイマーのリセット
        $("#totalQuestion").html(localStorage.totalQuestion);
        $("#correctAnswer").html(localStorage.correctAnswer);
        var ratio = Math.floor((localStorage.correctAnswer / localStorage.totalQuestion) * 100);
        $("#correctRatio").html(ratio + "%");
        $("#timeUsed").html(showTime(localStorage.timeUsed));
        $(this).hide();
        $("#returnBtn").show();
        //閉じるボタンに変身、早すぎはいかん
        //setTimeout(function() {
          //$(this).html("閉じる").attr("id","").attr("href","#topPage")
        //},500)

        //window.location = "http://www.google.com";
        //$("body").pagecontainer( "change", "#scorePage", { role: "dialog",reload:"true"} );

        //change("#scorePage2")
    })
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
  localStorage.totalQuestion = 0;
  localStorage.correctAnswer = 0;
  localStorage.timeUsed = 0;
}
function resetSessionStorage(){
  sessionStorage.quiz_id = 0
  sessionStorage.ans = null
  sessionStorage.selectedAns = ""
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
  timer=null;
}

function showTime() {
  var sec = parseInt(localStorage.timeUsed%60);
  var min = parseInt(localStorage.timeUsed/60);
  var timeStr = checkTime(min)+":"+checkTime(sec);
  $(".timer").html(timeStr);
  return timeStr;
}
function checkTime(i) {
  if (i<10){i="0" + i}
    return i
}
