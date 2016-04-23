// SET MAIN NAMESPACE
goog.provide('chapter9');


//get requirements
goog.require('lime.Director');
goog.require('lime.Scene');
goog.require('lime.Layer');
goog.require('lime.Circle');
goog.require('lime.fill.LinearGradient');
goog.require('box2d.Vec2');
goog.require('box2d.AABB');
goog.require('box2d.World');


// ENTRYPOINT
chapter9.start = function(){
    
    // DIRECTOR
    var director = new lime.Director(document.body,480,320);
    director.makeMobileWebAppCapable();
    director.setDisplayFPS(false);
    
    var scene1 = new lime.Scene().setRenderer(lime.Renderer.CANVAS);    
    var layer1 =  new lime.Layer().setAnchorPoint(0,0).setPosition(0,0);
      
    scene1.appendChild(layer1);
    
    // SKY
    var sky_gradient = new lime.fill.LinearGradient().setDirection(0,0,1,1)
        .addColorStop(0,'#B2DFEE').addColorStop(1, '#0000CD');
    
    var sky = new lime.Sprite().setSize(800,640).setPosition(0,0).setAnchorPoint(0,0).setFill(sky_gradient);
    layer1.appendChild(sky);

    // THE WORLD

    // GRAVITY IN WORLD
    var gravity = new box2d.Vec2(0,100); 

    // WORLD BOUNDRIES

    var bounds = new box2d.AABB();
    bounds.minVertex.Set(0,0);
    bounds.maxVertex.Set(480,320);

    var world = new box2d.World(bounds,gravity,false);

    // GROUND

    // LIMEJS ELEMENT
    var floor = new lime.Sprite().setFill('#008000').setSize(480,40);
    layer1.appendChild(floor);

    // BODY DEFINITION
    var bodyDef = new box2d.BodyDef();
    bodyDef.position.Set(240,300); 

    // SHAPE DEFINITION
    var shapeDef = new box2d.BoxDef;
    shapeDef.restitution = 0; // ALLOWS BOUNCING
    shapeDef.density = 0; 
    shapeDef.friction = 1;
    shapeDef.extents.Set(240,20); 

    bodyDef.AddShape(shapeDef);

    var body = world.CreateBody(bodyDef);
    floor._body = body;

    // BLOCK 1

    // LIMEJS ELEMENT
    var block = new lime.Sprite().setFill('#8B8878').setSize(50,50);
    layer1.appendChild(block);

    // BODY DEFINITION
    var bodyDef = new box2d.BodyDef();
    bodyDef.position.Set(100,100); 

    // SHAPE DEFINITION
    var shapeDef = new box2d.BoxDef;
    shapeDef.restitution = 0.9; // ALLOWS BOUNCING
    shapeDef.density = 10; 
    shapeDef.friction = 1;
    shapeDef.extents.Set(25,25); 

    bodyDef.AddShape(shapeDef);

    var body = world.CreateBody(bodyDef);
    block._body = body;

    // BLOCK 2

    // LIMEJS ELEMENT
    var block2 = new lime.Sprite().setFill('#8B8878').setSize(50,50);
    layer1.appendChild(block2);

    // BODY DEFINITION
    var bodyDef = new box2d.BodyDef();
    bodyDef.position.Set(60,100); 

    // SHAPE DEFINITION
    var shapeDef = new box2d.BoxDef;
    shapeDef.restitution = 0.9; // ALLOWS BOUNCING
    shapeDef.density = 10; 
    shapeDef.friction = 1;
    shapeDef.extents.Set(25,25); 

    bodyDef.AddShape(shapeDef);

    var body = world.CreateBody(bodyDef);
    block2._body = body;

    // BLOCK 3

    // LIMEJS ELEMENT
    var block3 = new lime.Sprite().setFill('#8B8878').setSize(50,50);
    layer1.appendChild(block3);

    // BODY DEFINITION
    var bodyDef = new box2d.BodyDef();
    bodyDef.position.Set(300,100); 

    // SHAPE DEFINITION
    var shapeDef = new box2d.BoxDef;
    shapeDef.restitution = 0.9; // ALLOWS BOUNCING
    shapeDef.density = 10;
    shapeDef.friction = 1;
    shapeDef.extents.Set(25,25);

    bodyDef.AddShape(shapeDef);

    var body = world.CreateBody(bodyDef);
    block3._body = body;

    // CIRCLE

    // LIMEJS ELEMENT
    var ball = new lime.Circle().setFill('#FFB90F').setSize(40,40);
    layer1.appendChild(ball);

    // BODY DEFINITION
    var bodyDef = new box2d.BodyDef();
    bodyDef.position.Set(200,100); 

    // SHAPE DEFINITION
    var shapeDef = new box2d.BoxDef;
    shapeDef.restitution = 0.9; // ALLOWS BOUNCING
    shapeDef.density = 10; 
    shapeDef.friction = 1;
    shapeDef.extents.Set(20,20); 

    bodyDef.AddShape(shapeDef);
    
    var body = world.CreateBody(bodyDef);
    ball._body = body;                            

    //source: https://gist.github.com/1758226
    function updateFromBody(shape) {

        var pos = shape._body.GetCenterPosition();
        var rot = shape._body.GetRotation();
        shape.setRotation(-rot / Math.PI * 180);
        shape.setPosition(pos);
    }

    // UPDATING THE WORLD
    dt = 25;
    lime.scheduleManager.scheduleWithDelay(function() {

        this.Step(dt / 1000, 3);
        updateFromBody(floor);
        updateFromBody(block);
        updateFromBody(block2);
        updateFromBody(block3);
        updateFromBody(ball);

    }, world,dt);

    goog.events.listen(sky,['mousedown','touchstart'], function(e) {

        e.event.stopPropagation();

        mouse_coord_x = e.position.x;
        mouse_coord_y = e.position.y;
        
        ball._body.ApplyImpulse(new box2d.Vec2((mouse_coord_x - ball.getPosition().x) * ball._body.GetMass(), (mouse_coord_y - ball.getPosition().y) * ball._body.GetMass()), ball.getPosition()); //(momentum, position where the event is being appied)
    })
    
    director.replaceScene(scene1);
}
