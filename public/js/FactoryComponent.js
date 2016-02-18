/**
 * Created by alyona.bugayeva on 12/15/2015.
 */
window.PuzzleGame = window.PuzzleGame || {};

PuzzleGame.FactoryComponent = (function () {
	function Factory() {
	}
	Factory.prototype.createComponent =
		function (itemConfig) {
			var container = window.document.querySelector(itemConfig.container);
			if (container) {
				var domElement = window.document.createElement('div');
				domElement.setAttribute('data-bind', 'template: {name:"' + itemConfig.template.id + '"}');
				container.appendChild(domElement);
				var ViewModelConstructor = PuzzleGame[itemConfig.type];
				var viewModel = new ViewModelConstructor(itemConfig.viewModelData || {});
				viewModel.init();
				ko.applyBindings(viewModel, domElement);
				viewModel.ready();
			}
			return viewModel;
		};
	return new Factory();
})();
