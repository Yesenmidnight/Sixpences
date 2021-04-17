void function() {
        Scene_Title.prototype.start = function() {
            Stage.prototype.initialize.call(this);
            DataManager.setupNewGame();
            SceneManager.clearStack();
            $gamePlayer.requestMapReload();
            SceneManager.goto(Scene_Map);
    }
}();