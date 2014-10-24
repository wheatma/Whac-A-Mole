
var whacAMole = angular.module('whacAMole',[]);

whacAMole.controller('PlayController', ['$scope','$timeout', function($scope){
    var outInverval, timeRemain;
    var hole = 9;
    var addScore = 10;
    var subtractScore = 5;
    $scope.levelTimer = 1000;
    $scope.levelLabel = '正常';
    $scope.levels = [{
        timer: 1000,
        label: '正常'
    },{
        timer: 1500,
        label: '入门'
    },{
        timer: 500,
        label: '困难'
    },{
        timer: 300,
        label: '噩梦'
    }];
    $scope.init = function(levelTimer){
        $scope.shareText = '';
        $scope.shrewmouses = [];
        for(var i = 0; i < hole; i++){
            $scope.shrewmouses.push({
                index: i,
                out: false
            });
        }
        $scope.game = {
            current: null,
            status: false,
            time: 60,
            score: 0,
            select: true,
            levelTimer: levelTimer
        };
        $('#stopModal').modal('hide');
        $('#gameOverModal').modal('hide');
    }
    
    $scope.start = function(){
        $('#stopModal').modal('hide');
        $('#gameOverModal').modal('hide');
        if($scope.game.status){
            return false;
        }
        if($scope.game.time == 0){
            $scope.reset();
        }
        $scope.game.status = true;
        $scope.game.select = false;
        outInverval = setInterval(function(){
            $scope.$apply(shrewMouseOut);
        }, $scope.game.levelTimer);
        timeRemain = setInterval(function(){
            $scope.$apply(timer);
        }, 1000);
    };
    
    $scope.stop = function(type){
        if(!$scope.game.status){
            return false;
        }
        if(type){
            $('#stopModal').modal('show');
        }
        clearInterval(outInverval);
        clearInterval(timeRemain);
        $scope.game.status = false;
    };
    
    $scope.gameOver = function(){
        $scope.stop(false);
        $scope.shrewmouses[$scope.game.current].out = false;
        $scope.game.current = null;
        $('#gameOverModal').modal('show').on('hidden', function(){
            $scope.$apply($scope.init($scope.levelTimer));
        });
    }
    
    $scope.reset = function(){
        $scope.stop(false);
        $scope.init($scope.levelTimer);
    };
    
    $scope.selectLevel = function(){
        $scope.reset();
        angular.forEach($scope.levels, function(o){
           if(o.timer == $scope.levelTimer){
               $scope.levelLabel = o.label;
               return false;
           } 
        });
    }
    
    $scope.hit = function(index){
        if(index < 0 || index >= hole){
            return false;
        }
        if(!$scope.game.status){
            return false;
        }
        var currentIndex = $scope.game.current;
        if(!$scope.shrewmouses[currentIndex].out){
            return false;
        }
        if(index == currentIndex){
            $scope.shrewmouses[currentIndex].out = false;
            $scope.game.score += addScore;
        } else {
            $scope.game.score = ($scope.game.score >= subtractScore) ? ($scope.game.score - subtractScore) : 0;
        }
    };
    
    $scope.setShareText = function(){
        $scope.shareText = '#WhacAMole#我在wheat的网站上玩了#打地鼠#游戏，难度：' + $scope.levelLabel + ',得分：' + $scope.game.score + '。快来玩吧！链接：' + window.location.href;
    }
    
    var shrewMouseOut = function(){
        var currentIndex = $scope.game.current;
        if(currentIndex !== null){
            $scope.shrewmouses[currentIndex].out = false;
        }
        var randomIndex = randIndex(hole);
        $scope.game.current = randomIndex;
        $scope.shrewmouses[randomIndex].out = true;
    };
    
    var timer = function(){
        $scope.game.time -= 1;
        if($scope.game.time == 0){
            $scope.gameOver();
        }
    }
        
    var randIndex = function(num){
        return parseInt(Math.random()*num);
    };
    
    $scope.init($scope.levelTimer);
}]);
