// ===========================================
// クイズテンプレート
// ===========================================

//  ============アプリ共通変数の定義============

quiz_num = 0;//出そうとする問題の数、問題総数超えてはならない
quiz_time_min = 0.15;
quiz_text = [];
persion_list = [];
$(document).ready(function(){
  quiz_text = creatQuiz(); // in create_quiz.js
  persion_list = create_persion();// in create_persion.js
  shuffle(quiz_text);//問題をシャフル
  shuffle(persion_list);
  if (quiz_num <= 0||quiz_num > quiz_text.length) {
    quiz_num = quiz_text.length;
  }
  //念のため一回リセット
  resetLocalStorage();//点数のりせっと
  resetSessionStorage();
  //timeStop();//タイマーのリセット
  countDownStop()
});


//スコアの初期化
if(!localStorage.totalQuestion){
    resetLocalStorage();
}

//  =====▽▽この下にページごとの処理を記述します▽▽=====
//  ============ページ区切り[準備]============
$(document).on("pageinit", "#preparePage", function(){
  //画面表示時の処理
   $("#preparePage").on("pageshow", function() {
     if (!sessionStorage.persion_id||sessionStorage.persion_id >= persion_list.length) {
       sessionStorage.persion_id = 0; //もしクイズがなしまたはクイズが終わりのとき、一から繰り返す
     }
     beep("low")
     $("#321").html("3").css({"font-size":"20em","color":"Orange"});
     setTimeout(function() {
       $("#321").fadeToggle("slow");
     },200);
     setTimeout(function() {
       beep("low")
       $("#321").html("2").css({"font-size":"20em","color":"OrangeRed"}).fadeToggle("slow");

       $("#321").fadeToggle("slow");

     },1200);
     setTimeout(function() {
       beep("low")
       $("#321").html("1").css({"font-size":"20em","color":"Red"}).fadeToggle("slow");
       $("#321").fadeToggle("slow");
     },2600);
     setTimeout(function() {
       beep("high")
       //let persion_temp = persion_list[sessionStorage.persion_id]
       $("#ques_num").html("第 "+(parseInt(sessionStorage.quiz_id)+1)+" 問").css({"font-size":"4em","color":"Sienna"})
       $("#321").html("<a href='#questionPage' style='text-decoration:none;color:Sienna'>" +
        persion_list[sessionStorage.persion_id]+ "</a>").css({"font-size":"6em"}).fadeToggle("slow");
     },3800);
     setTimeout(function() {
       $("body").pagecontainer( "change", "#questionPage" );
       $("#ques_num").html("");
       $("#123").html("");
       $("#judge").html("");//問題文の一部もリセット
     },4800)
     //$("#321").on("click",function() {
       //$("body").pagecontainer( "change", "#preparePage" );
     //})
   });
});
//  ============ページ区切り[問題]============
$(document).on("pageinit", "#questionPage", function(){
   //画面表示時の処理
    $("#questionPage").on("pageshow", function() {

        //if (!timer) {
        //  timeCount();//多重タイマー防止
        //}
        countDownStop();//多重タイマー防止
        timeCountDown();
        countDownFlag = true;//5秒時のカウントダウン用フラグ
        //console.log(countDownFlag);
        sessionStorage.selectedAns = "" //sessionStorageリセット
        var randNum = new Array(3);
         //setInterval(function(){showTime(localStorage.timeUsed);}, 500);//時間表示
         setInterval(function(){showTime(sessionStorage.countDown,"#answerPage");}, 500);//カウントダウン時間表示
         if (!sessionStorage.quiz_id||sessionStorage.quiz_id >= quiz_text.length) {
           sessionStorage.quiz_id = 0; //もしクイズがなしまたはクイズが終わりのとき、一から繰り返す
         }
         tempQuiz = quiz_text[sessionStorage.quiz_id];
         sessionStorage.ans = tempQuiz.ans;//set answer
         sessionStorage.name = tempQuiz.name;
         $(".quiz_text").html(tempQuiz.text);
         $(".name").html('（ By：'+sessionStorage.name+' ）');
         if (tempQuiz.image) {
           $(".quiz_img").attr("src","./img/quiz/"+tempQuiz.image);
         }else {
           $(".quiz_img").attr("src","./img/vietnam.png");
         }
         shuffle(tempQuiz.choices);//選択肢をシャッフル
         for (var i = 0; i < tempQuiz.choices.length; i++) {
           let temp_id = "#ch_" + i +"";
           $(temp_id).html(tempQuiz.choices[i])
         }
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
      countDownStop();//カウントダウンストップ

      //次の問題ボタンをリセット
      $("#nextButton").html("次の問題").attr("href","#preparePage")
      //正誤の判定と表示
      //console.log(sessionStorage.selectedAns);
      if(sessionStorage.selectedAns == sessionStorage.ans){
          $("#judge").html("正解").css("color","green").css("font-size","4.5em");
          judge_beep("right");
          localStorage.correctAnswer++;
      }else if (sessionStorage.selectedAns === "") {
          $("#judge").html("時間切れ").css("color","OrangeRed").css("font-size","4em");
          judge_beep("time_up");
      }else{
          $("#judge").html("ハズレ").css("color","red").css("font-size","4em");
          judge_beep("wrong");
      }
      $(".quiz_text").html(tempQuiz.text+'（ By：'+sessionStorage.name+' ）');
      $("#ans").html(sessionStorage.ans);
      //総解答数の更新
      localStorage.totalQuestion++;
      //回答者の前進
      sessionStorage.persion_id++;
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
       //$("#resetBtn").hide();
       $("#returnBtn").hide();
       setTimeout(function() {
         $("#resetBtn").show();
       },1000)
    });
    //リセットのロジック
    $("#resetBtn").on("click",function(){
        resetLocalStorage();//点数のりせっと
        //resetSessionStorage();
        //timeStop();//タイマーのリセット
        countDownStop()
        $("#totalQuestion").html(localStorage.totalQuestion);
        $("#correctAnswer").html(localStorage.correctAnswer);
        var ratio = Math.floor((localStorage.correctAnswer / localStorage.totalQuestion) * 100);
        $("#correctRatio").html(ratio + "%");
        $("#timeUsed").html(showTime(localStorage.timeUsed));
        $("#resetBtn").hide();
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
  sessionStorage.persion_id = 0
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


//カウントダウン時計
var timer_down
function timeCountDown(href){
  if (!sessionStorage.countDown||sessionStorage.countDown == 0) {
    sessionStorage.countDown = parseInt(quiz_time_min*60);
  }
  play_bgm();
  timer_down = setInterval(function(){
    sessionStorage.countDown--;
  }, 1000);
}
function countDownStop() {
  clearInterval(timer_down);
  sessionStorage.countDown = parseInt(quiz_time_min*60);
  timer_down=null;
  stop_warn();
  stop_bgm();
}

function showTime(time_sec,href) {
  let sec = parseInt(time_sec%60);
  let min = parseInt(time_sec/60);
  let timeStr = checkTime(min)+":"+checkTime(sec);
  $(".timer").html(timeStr);
  if (sessionStorage.countDown <= 4 && countDownFlag == true) { //5秒若干長い
    warn_beep();
    fade_bgm();
    countDownFlag = false;
  }
  if (sessionStorage.countDown <= 0) {
    stop_bgm();
    stop_warn();
    $("body").pagecontainer( "change", "#answerPage" );
    sessionStorage.countDown = parseInt(quiz_time_min*60);
    //$("body").pagecontainer( "change", "href" ); //カウントダウン終了後自動切り替え
  }
  return timeStr;
}
/*
function showCountDown() {
  let sec = parseInt(sessionStorage.countDown%60);
  let min = parseInt(sessionStorage.countDown/60);
  let timeStr = checkTime(min)+":"+checkTime(sec);
  $(".timer").html(timeStr);
  return timeStr;
}*/

function checkTime(i) {
  if (i<10){i="0" + i}
    return i
}
