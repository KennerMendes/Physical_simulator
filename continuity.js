// sketchProc makes Processing JS run in html canvas
let sketchProc = function(processingInstance) {
     with (processingInstance) {
        size(300, 300);
        frameRate(30);

        // ProgramCodeGoesHere

        // Global variables for vectors and flow tightness
        var isPressed = false;
        var final_x = 220;
        var x_0 = 100;
        var delta = 30;
        var L = 120;
        var P0 = PVector.sub(new PVector((x_0 + delta), L), new PVector(x_0, 0));
        P0.normalize();
        var N0 = new PVector(cos(P0.heading() - radians(90)), sin(P0.heading() - radians(90)));
        N0.normalize();
        var ang_tg = tan(P0.heading());
        var ang_sin = sin(P0.heading());
        var P1 = PVector.sub(new PVector((x_0 + delta), (height - L)), new PVector(x_0, height));
        var N1 = new PVector(cos(P1.heading() + radians(90)), sin(P1.heading() + radians(90)));
        P1.normalize();
        N1.normalize();

        // Particle object
        var Particle = function()
        {
            this.diam = 50;
            this.radius = this.diam/2;
            this.position = new PVector(random(10, 60), random(10, (height - 10)));
            this.velocity = new PVector(0.8, random(-0.1, 0.1));
        };

        //Updates particle's position
        Particle.prototype.update = function()
        {
            this.velocity.limit(2.5);
            this.position.add(this.velocity);
        };

        // Show particles on screen and change its color according to its velocity
        Particle.prototype.display = function()
        {
            stroke(0);
            strokeWeight(2);
            if(this.velocity.x < 0.5)
            {
                fill(33, 214, 23);
            }
            else if(this.velocity.x > 0.9)
            {
                fill(255, 0, 0);
            }
            else
            {
                fill(224, 189, 11);
            }
            ellipse(this.position.x, this.position.y, this.diam, this.diam);
        };

        // Dont let particles pass through any edge (including flow tightness)
        Particle.prototype.checkEdges = function()
        {
            if(this.position.x - this.radius < 0)
            {
                this.velocity.x *= -1;
                this.position.x = this.radius;
            }

            if(this.position.x < final_x)
            {
                if(this.position.y + this.radius > height)
                {
                    this.velocity.y *= -1;
                    this.position.y = height - this.radius;
                }

                if (this.position.y - this.radius < 0)
                {
                    this.velocity.y *= -1;
                    this.position.y = this.radius;
                }
            }

            // Don't let particles pass through superior sloped face
            // For more clarifications about math, look images in physics folder
            var sup_lim = ang_tg * (this.position.x - x_0 + this.radius / ang_sin);
            if((this.position.y < sup_lim) && (this.position.x < x_0 + delta + this.radius))
            {
                if(this.position.y < L)
                {
                    var teta = this.velocity.heading() - N0.heading();
                    var Vn = this.velocity.mag() * cos(teta);
                    var Vp = this.velocity.mag() * sin(teta);
                    var vector_p = new PVector(P0.x, P0.y);
                    vector_p.mult(Vp);
                    N0.mult(Vn);
                    this.velocity = PVector.sub(vector_p, N0);
                    N0.normalize();
                    this.position.y = sup_lim;
                }
            }

            // Don't let particles pass through inferior sloped face
            var inf_lim = - ang_tg * (this.position.x - x_0 + this.radius / ang_sin - height / ang_tg);
            if((this.position.y > inf_lim) && (this.position.x < x_0 + delta + this.radius))
            {
                if(this.position.y > height - L)
                {
                    var teta = N1.heading() - this.velocity.heading();
                    var Vn = this.velocity.mag() * cos(teta);
                    var Vp = this.velocity.mag() * sin(teta);
                    var vector_p = new PVector(P1.x, P1.y);
                    vector_p.mult(Vp);
                    N1.mult(Vn);
                    this.velocity = PVector.sub(vector_p, N1);
                    N1.normalize();
                    this.position.y = inf_lim;
                }
            }

            //Don't let particles pass through tightness horizontal faces
            if((this.position.x >= x_0 + delta) && (this.position.x <= final_x))
            {
                if(this.position.y < L + this.radius)
                {
                    this.position.y = L + this.radius;
                    this.velocity.y *= -1;
                }
                if(this.position.y > height - L - this.radius)
                {
                    this.position.y = height - L - this.radius;
                    this.velocity.y *= -1;
                }
            }
            // Draw tightness
            fill(204, 91, 16);
            quad(x_0, 0, final_x, 0, final_x, L, (x_0 + delta), L);
            quad(x_0, height, final_x, height, final_x, (height - L), (x_0 + delta), (height - L));
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

        // Check frame limit when the tightness is not activated
        Particle.prototype.checkFrame = function()
        {
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

        // Instantiate 10 Particle objects
        var particles = [];
        for(var i = 0; i < 10; i++)
        {
            particles[i] = new Particle();
        }

        // Continuously draw on canvas
        var draw = function() {
            background(107, 103, 107);
            for(var i = 0; i < particles.length; i++)
            {
                // If particle pass frame limit it is discarded and a new particle is instantiated
                if(particles[i].position.x > width)
                    {
                        particles[i] = new Particle();
                    }
                if(particles[i].position.x > final_x)
                {
                    if((particles[i].position.y > height) || (particles[i].position.y < 0))
                    {
                        particles[i] = new Particle();
                    }
                }
                for(var j = 0; j< particles.length; j++)
                {
                    //Continuously check collisions and edges for each object, updates and draw them
                    if(i !== j)
                    {
                        particles[j].checkCollision(particles[i]);
                        particles[i].update();
                        particles[i].display();
                        // if mouse button is pressed tightness exists, else not
                        if(isPressed)
                        {
                            particles[i].checkEdges();
                        }
                        else
                        {
                            particles[i].checkFrame();
                        }
                    }
                }
            }
        };
        var mousePressed = function()
        {
            isPressed = true;
        };

        var mouseReleased = function()
        {
            isPressed = false;
        };
    }};

    // Get the canvas that Processing-js will use
    let canvas = document.getElementById("mycanvas");
    // Pass the function sketchProc (defined in myCode.js) to Processing's constructor.
    let processingInstance = new Processing(canvas, sketchProc);