/* ------------------------------------------------------------------------- */
/*   Copyright (C) 2009 Eric J. Gaudet

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 675 Mass Ave, Cambridge, MA 02139, USA.		     */
/* ------------------------------------------------------------------------- */

function FirstAssistant() {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
}

FirstAssistant.prototype.setup = function() {
	/* this function is for setup tasks that have to happen when the scene is first created */
		
	/* use Mojo.View.render to render view templates and add them to the scene, if needed. */
	
        this.poll_freq = 0;
        
	this.ball = {
            x: 150,
            y: 150
        };
        
	this.attributes = {
            modelProperty: 'value'
            ,minValue: 0
            ,maxValue: 5
            ,round: true
        };
        
        this.model = {
            value: 0
            ,width: 15
        }
	
        this.appMenuModel = {
            visible: true,
            items: [
                Mojo.Menu.editItem,
                { label: "Restart", command: 'handleRestart' },
                { label: "Preferences", command: 'handlePrefs' }
            ]
        }
        
        this.controller.setupWidget(Mojo.Menu.appMenu,
            {omitDefaultItems: true}, this.appMenuModel);
        this.controller.setupWidget('slider', this.attributes, this.model);
        this.propertyChanged = this.propertyChanged.bindAsEventListener(this);
        Mojo.Event.listen(this.controller.get('slider'),Mojo.Event.propertyChange,this.propertyChanged)
            Mojo.Event.listen(document, 'acceleration', this.handleAcceleration.bindAsEventListener(this));

}

FirstAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
}


FirstAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
}

FirstAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
  
  // Set back to default Palm value of 4 HZ when app closes
  this.controller.serviceRequest('palm://org.webosinternals.accelservice',
      {
      method: 'setPollFreq',
      parameters: {freq: 4}
      });
}

FirstAssistant.prototype.handleAcceleration = function (event) {
        this.ball.x = this.ball.x + (50 * event.accelX);
        if (this.ball.x > 290) {
            this.ball.x = 290;
        }
        if (this.ball.x < 0) {
            this.ball.x = 0;
        }
        
        this.ball.y = this.ball.y - (50 * event.accelY);
        if (this.ball.y > 385) {
            this.ball.y = 385;
        }
        if (this.ball.y < 70) {
            this.ball.y = 70;
        }
	
        document.getElementById('ball').style.left=this.ball.x + "px"
	document.getElementById('ball').style.top=this.ball.y + "px"
}

FirstAssistant.prototype.propertyChanged = function(event) {
    this.poll_freq = event.value * 10;
    if (this.poll_freq < 10) {
        this.poll_freq = 4;
    }
    
  this.controller.serviceRequest('palm://org.webosinternals.accelservice',
      {
      method: 'setPollFreq',
      parameters: {freq:this.poll_freq}
      });
}
