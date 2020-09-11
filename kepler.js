let sketchProc = function(processingInstance) {
     with (processingInstance) {
        size(600, 600);
        frameRate(30);

        // ProgramCodeGoesHere

        // Particle object (planet)
        var Particle = function(x, y)
        {
            this.position = new PVector(x, y);
            this.velocity = new PVector(2.5, 0.5);
            this.acelleration = new PVector(0, 0);
        };

        // Updates particle's position, velocity and brings acceleration to 0
        Particle.prototype.update = function()
        {
            this.velocity.add(this.acelleration);
            this.position.add(this.velocity);
            this.acelleration.mult(0);
        };

        // Show particle on screen
        Particle.prototype.display = function()
        {
            stroke(0);
            strokeWeight(2);
            fill(204, 0, 0);
            ellipse(this.position.x, this.position.y, 15, 15);
        };

        // Interacts this particle with a force
        Particle.prototype.applyForce = function(force)
        {
            this.acelleration.add(force);
        };

        // Attractor object (Sun)
        var Attractor = function()
        {
            this.position = new PVector(width/2, height/2);
        };

        // Calculate attrction force from particle to attractor (planet to sun)
        Attractor.prototype.calculateAttraction = function(particle)
        {
            var force = PVector.sub(this.position, particle.position);
            var distance = force.mag();
            var strength = 10000/(distance * distance);
            force.normalize();
            force.mult(strength);
            return force;
        };

        // Show attractor on screen
        Attractor.prototype.display = function()
        {
            fill(255, 204, 0);
            ellipse(width/2, height/2, 30, 30);
        };

        // Instantiate one particle and one attractor
        var particle = new Particle(width / 2, 10);
        var attractor = new Attractor();
        // Array to store particles latest 20 positions
        var lines = [];
        for(var i = 0; i < 20; i++)
        {
            // Particle's initial position
            lines[i] = [width / 2, 10];
        }
        var transfer_a = [];
        var transfer_b = [];

        // Continuously draw on canvas
        var draw = function() {
            background(0);
            // Calculates and apply current force in particle and update it
            var force = attractor.calculateAttraction(particle);
            particle.applyForce(force);
            particle.update();

            // Gets the particle's latest 20 positions and draw lines between attractor and these positions
            // (sweep effect)
            for(var i = 0; i < lines.length; i++)
            {
                if(i === 0)
                {
                    transfer_a = [lines[0][0], lines[0][1]];
                    lines[0] = [particle.position.x, particle.position.y];
                }
                else
                {
                    transfer_b = [lines[i][0], lines[i][1]];
                    lines[i] = [transfer_a[0], transfer_a[1]];
                    transfer_a = [transfer_b[0], transfer_b[1]];
                }
                stroke(220);
                strokeWeight(2);
                line(lines[i][0], lines[i][1], attractor.position.x, attractor.position.y);
            }
            // Draw particle and attractor
            particle.display();
            attractor.display();
        };

    }};

    // Get the canvas that Processing-js will use
    let canvas = document.getElementById("mycanvas");
    // Pass the function sketchProc (defined in myCode.js) to Processing's constructor.
    let processingInstance = new Processing(canvas, sketchProc);