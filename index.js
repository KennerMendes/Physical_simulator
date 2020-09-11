// sketchProc makes Processing JS run in html canvas
let sketchProc = function(processingInstance) {
     with (processingInstance) {
        size(600, 600);
        frameRate(30);

        // ProgramCodeGoesHere

        // Particle object
        var Particle = function(my_side)
        {
            this.diam = 15;
            this.my_side = my_side;
            //Determines object side at the start of simulation
            if(this.my_side === "left")
            {
                this.position = new PVector(random(10,(width/2)-20), random(10, height-20));
                this.velocity = new PVector(random(-0.05, 0.05), random(-0.05, 0.05));
            }
            else
            {
                this.position = new PVector(random((width/2)+20, width-10), random(10, height-20));
                this.velocity = new PVector(random(0.8, 1), random(0.8, 1));
            }
        };

        Particle.prototype.update = function()
        {
            this.velocity.limit(2.5);
            this.position.add(this.velocity);
        };

        // Method to show object on screen
        Particle.prototype.display = function()
        {
            stroke(0);
            strokeWeight(2);
            // changes particle's color based in its velocity
            if(this.velocity.mag() < 0.08)
            {
                fill(33, 214, 23);
            }
            else if(this.velocity.mag() > 0.8)
            {
                fill(255, 0, 0);
            }
            else
            {
                fill(224, 189, 11);
            }
            ellipse(this.position.x, this.position.y, this.diam, this.diam);
        };

        // Confine particles on frame
        Particle.prototype.checkEdges = function()
        {
            if(this.position.x + (this.diam/2) > width)
            {
                this.velocity.x *= -1;
                this.position.x = width - (this.diam/2);
            }

            if(this.position.x - (this.diam/2) < 0)
            {
                this.velocity.x *= -1;
                this.position.x = this.diam/2;
            }

            if(this.position.y + (this.diam/2) > height)
            {
                this.velocity.y *= -1;
                this.position.y = height - (this.diam/2);
            }

            if (this.position.y - (this.diam/2) < 0)
            {
                this.velocity.y *= -1;
                this.position.y = (this.diam/2);
            }
        };

        // Simulates collisions between particles
        Particle.prototype.checkCollision = function(particle)
        {
            // For clarifications about the math, look at images in physics folder
            var distance = PVector.sub(this.position, particle.position);
            var teta = distance.heading();
            if ((distance.mag() <= this.diam))
            {
                var V_3 = PVector.sub(this.velocity, particle.velocity);
                var V_4_x = (V_3.x + V_3.y*tan(teta))/(1 + tan(teta)*tan(teta));
                var V_4_y = V_4_x*tan(teta);
                var momentum = new PVector(V_4_x, V_4_y);
                var V_5_x = V_3.x - V_4_x;
                var V_5_y = V_3.y - V_4_y;
                var my_momentum = new PVector(V_5_x, V_5_y);
                distance.normalize();
                distance.mult(this.diam + 1);
                this.position = PVector.add(particle.position, distance);
                this.velocity = PVector.add(my_momentum, particle.velocity);
                particle.velocity.add(momentum);
            }
        };

        // Doesn't let particles pass through wall
        Particle.prototype.checkWall = function()
        {
            if((this.my_side === "right") && (this.position.x < (width/2) + 10 + (this.diam/2)))
            {
                this.position.x = (width/2) + 10 + (this.diam/2);
                this.velocity.x *= -1;
            }
            if((this.my_side === "left") && (this.position.x > (width/2) - 10 - (this.diam/2)))
            {
                this.position.x = (width/2) - 10 - (this.diam/2);
                this.velocity.x *= -1;
            }
        };

        var isPressed = false; // signals when mouse button is pressed

        //Istantiate a lot of particle objects
        var particles = [];
        for(var i = 0; i < 20; i++)
        {
            var choice = floor(random(0, 2));
            if (choice === 0)
            {
                particles[i] = new Particle("left");
            }
            else
            {
                particles[i] = new Particle("right");
            }
        }

        // Continuously draw on canvas
        var draw = function() {
            background(107, 103, 107);
            //Continuously check collisions, edges and wall for each object, updates and draw them
            for(var i = 0; i < particles.length; i++)
            {
                for(var j = 0; j< particles.length; j++)
                {
                    if(i !== j)
                    {
                        particles[j].checkCollision(particles[i]);
                        particles[i].update();
                        particles[i].checkEdges();
                        if(!isPressed)
                        {
                            particles[i].checkWall();
                        }
                        particles[i].display();
                    }
                }
            }
            // Draw or not the wall
            if(!isPressed)
            {
                fill(255,0, 0);
                stroke(255, 0, 0);
                rect((width/2) - 10, 0, 20, height);
            }
        };

        var mousePressed = function()
            {
                isPressed = true;
            };

        var mouseReleased = function()
            {
                isPressed = false;
                // When the wall is restored, it updates the my_side of each particle
                for(var i = 0; i < particles.length; i++)
                {
                    if(particles[i].position.x < (width/2))
                    {
                        particles[i].my_side = "left";
                    }
                    else
                    {
                        particles[i].my_side = "right";
                    }
                }
            };
    }};

    // Get the canvas that Processing-js will use
    let canvas = document.getElementById("mycanvas");
    // Pass the function sketchProc (defined in myCode.js) to Processing's constructor.
    let processingInstance = new Processing(canvas, sketchProc);


    /*
    let sketchProc = function(processingInstance) {
     with (processingInstance) {
        size(600, 600);
        frameRate(30);

        // ProgramCodeGoesHere
        fill(255, 255, 0);
        ellipse(200, 200, 200, 200);
        noFill();
        stroke(0, 0, 0);
        strokeWeight(2);
        arc(200, 200, 150, 100, 0, PI);
        fill(0, 0, 0);
        ellipse(250, 200, 10, 10);
        ellipse(153, 200, 10, 10);
    }};

    // Get the canvas that Processing-js will use
    let canvas = document.getElementById("mycanvas");
    // Pass the function sketchProc (defined in myCode.js) to Processing's constructor.
    let processingInstance = new Processing(canvas, sketchProc);
    */