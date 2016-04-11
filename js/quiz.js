// ===========================================
// クイズテンプレート
// ===========================================

//  ============アプリ共通変数の定義============

quiz_num = 2;//出そうとする問題の数、問題総数超えてはならない
quiz_text = [];
$(document).ready(function(){
  quiz_text = creatQuiz(); // in create_quiz.js
  shuffle(quiz_text);//問題をシャフル
  if (quiz_num <= 0||quiz_num > quiz_text.length) {
    quiz_num = quiz_text.length;
  }
  //念のため一回リセット
  resetLocalStorage();//点数のりせっと
  resetSessionStorage();
  timeStop();//タイマーのリセット
});


//スコアの初期化
if(!localStorage.totalQuestion){
    resetLocalStorage();
}

//  =====▽▽この下にページごとの処理を記述します▽▽=====

//  ============ページ区切り[問題]============
$(document).on("pageinit", "#questionPage", function(){
   //画面表示時の処理
    $("#questionPage").on("pageshow", function() {
        if (!timer) {
          timeCount();//多重タイマー防止
        }
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
         shuffle(tempQuiz.choices);//選択肢をシャッフル
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
      if (localStorage.totalQuestion >= quiz_num) {
        $("#nextButton").html("スコア").attr("href","#scorePage").attr("data-rel","dialog")
      }
    });
});

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
       $("#resetBtn").hide();
       $("#returnBtn").hide();
       setTimeout(function() {
         $("#resetBtn").show();
       },1000)
    });
    //リセットのロジック
    $("#resetBtn").on("click",function(){
        resetLocalStorage();//点数のりせっと
        //resetSessionStorage();
        timeStop();//タイマーのリセット
        $("#totalQuestion").html(localStorage.totalQuestion);
        $("#correctAnswer").html(localStorage.correctAnswer);
        var ratio = Math.floor((localStorage.correctAnswer / localStorage.totalQuestion) * 100);
        $("#correctRatio").html(ratio + "%");
        $("#timeUsed").html(showTime(localStorage.timeUsed));
        $(this).hide();
        $("#returnBtn").show();
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
