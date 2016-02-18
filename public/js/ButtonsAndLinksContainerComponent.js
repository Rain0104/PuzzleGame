/**
 * Created by alyona.bugayeva on 7/9/2015.
 */
function ButtonsAndLinksContainerComponent() {

	this.isVisibleLoginButtonTS = ko.observable(true);
	this.isVisibleLogOutTS = ko.observable(false);

	this.bindEvents();
}

ButtonsAndLinksContainerComponent.prototype = {

	ready: function () {
	},

	bindEvents: function () {
		//TestPortal.EventDispatcher.on('TokenTSReceived', this.onTokenTSCome.bind(this));
		//TestPortal.EventDispatcher.on('LoggedOutFromTS', this.onSuccessfulLogOutFromTS.bind(this));
	},

	//onLoginToGMS4Clicked: function () {
	//	var msg = '[operator action] Clicked Sign in GMS4 Button';
	//	TestPortal.Logger.logOperatorActions(msg);
	//	TestPortal.EventDispatcher.trigger('LoginGMS4ButtonClicked');
	//},

	onLoginToTSClicked: function () {
		var msg = '[operator action] Clicked Sign in button';
		console.log(msg);
		//TestPortal.Logger.logOperatorActions(msg);
		//TestPortal.EventDispatcher.trigger('LoginTSButtonClicked');
	},

	onLogoutFromTSClicked: function () {
		var msg = '[operator action] Clicked Sign out button';
		console.log(msg);

		//TestPortal.Logger.logOperatorActions(msg);
		//TestPortal.EventDispatcher.trigger('logoutTSButtonClicked:logoutFromTS');
		//TestPortal.RequestManager.logOutTS();
		//TestPortal.RequestManager.logOutGS();
	}

	// Event Handlers

	//onTokenTSCome: function () {
	//	this.isVisibleLoginButtonTS(false);
	//	this.isVisibleLogOutTS(true);
	//},
    //
	//onSuccessfulLogOutFromTS: function () {
	//	this.isVisibleLoginButtonTS(true);
	//	this.isVisibleLogOutTS(false);
	//}

};

TestPortal.ButtonsAndLinksContainerComponent = ButtonsAndLinksContainerComponent;