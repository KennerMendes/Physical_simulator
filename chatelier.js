// sketchProc makes Processing JS run in html canvas
let sketchProc = function(processingInstance) {
     with (processingInstance) {
        size(600, 600);
        frameRate(30);

        // ProgramCodeGoesHere

        // Particle object
        var Particle = function(my_specie)
        {
            this.diam = 60;
            this.specie = my_specie;
            this.position = new PVector(random(10, (width - 10)), random(10, (height - 10)));
            this.velocity = new PVector(random(-0.5, 0.5), random(-0.5, 0.5));
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
            // Changes particle's color based in its specie
            if(this.specie === 'a')
            {
                // Green particle
                fill(33, 214, 23);
            }
            if(this.specie === 'b')
            {
                // Yellow particle
                fill(209, 193, 15);
            }
            if(this.specie === 'c')
            {
                // Red particle
                fill(237, 47, 21);
            }
            if(this.specie === 'd')
            {
                // Blue particle
                fill(23, 16, 230);
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

        // Simulates the reaction A + B ⇌  C + D
        Particle.prototype.checkReaction = function(particle)
        {
            if(this.velocity.mag() + particle.velocity.mag() > 0.3)
            {
                if((this.specie === 'a') && (particle.specie === 'b'))
                {
                    this.specie = 'c';
                    particle.specie = 'd';
                }
                else if((this.specie === 'b') && (particle.specie === 'a'))
                {
                    this.specie = 'd';
                    particle.specie = 'c';
                }
                else if((this.specie === 'c') && (particle.specie === 'd'))
                {
                    this.specie = 'a';
                    particle.specie = 'b';
                }
                else if((this.specie === 'd') && (particle.specie === 'c'))
                {
                    this.specie = 'b';
                    particle.specie = 'a';
                }
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
                this.checkReaction(particle);
            }
        };

        var species = ['a', 'b', 'c', 'd']; // Reaction species
        //Istantiate a lot of particle objects of each specie
        var particles = [];
        for(var i = 0; i < 4; i++)
        {
            for(var j = 0; j < 3; j++)
            {
                particles.push(new Particle(species[i]));
            }
        }

        // Continuously draw on canvas
        var draw = function() {
            background(107, 103, 107);
            //Continuously check collisions, edges and reactions for each object, updates and draw them
            for(var i = 0; i < particles.length; i++)
            {
                for(var j = 0; j< particles.length; j++)
                {
                    if(i !== j)
                    {
                        particles[j].checkCollision(particles[i]);
                        particles[i].update();
                        particles[i].checkEdges();
                        particles[i].display();
                    }
                }
            }
        };

        // When mouse is clicked, 8 new A particles are instantiated (only once)
        var mouseClicked = function()
        {
            if(particles.length < 20)
            {
                for(var i = 0; i < 8; i++)
                {
                    particles.push(new Particle('a'));
                }
            }
        };
    }};

    // Get the canvas that Processing-js will use
    let canvas = document.getElementById("mycanvas");
    // Pass the function sketchProc (defined in myCode.js) to Processing's constructor.
    let processingInstance = new Processing(canvas, sketchProc);