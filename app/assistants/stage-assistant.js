function StageAssistant() {
}

StageAssistant.prototype.setup = function() {
    this.sceneArgs = {
        name: 'first',
	disableSceneScroller: false
    }

    this.controller.pushScene(this.sceneArgs);
}
