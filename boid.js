const ForceEnum = {
    ALIGNMENT: "alignment",
    COHESION: "cohesion",
    SEPARATION: "separation",
};

class Boid {
    constructor() {
        this.position = createVector(random(width), random(height));
        this.velocity = p5.Vector.random2D();
        this.velocity.setMag(random(2, 4));
        this.acceleration = createVector();
        this.maxForce = 0.5
        this.maxSpeed = 5
        this.perceptionRadius = 50
    }

    edges() {
        if (this.position.x > width) {
            this.position.x = 0;
        } else if (this.position.x < 0) {
            this.position.x = width;
        }
        if (this.position.y > height) {
            this.position.y = 0;
        } else if (this.position.y < 0) {
            this.position.y = height;
        }
    }

    applyForce(boids, force) {
        let steering = createVector();
        let total = 0;
        for (let other of boids) {
            let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
            if (other != this && d < this.perceptionRadius) {
                if (force == ForceEnum.ALIGNMENT) {
                    steering.add(other.velocity);
                } else if (force == ForceEnum.COHESION) {
                    steering.add(other.position);
                } else if (force == ForceEnum.SEPARATION) {
                    let diff = p5.Vector.sub(this.position, other.position);
                    diff.div(Math.pow(d, 2));
                    steering.add(diff);
                }
                total++;
            }
        }
        if (total > 0) {
            steering.div(total);
            if (force == ForceEnum.COHESION) {
                steering.sub(this.position);
            }
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }
        return steering;
    }

    flock(boids, alignmentWeight, cohesionWeight, separationWeight) {
        let alignment = this.applyForce(boids, ForceEnum.ALIGNMENT);
        let cohesion = this.applyForce(boids, ForceEnum.COHESION);
        let separation = this.applyForce(boids, ForceEnum.SEPARATION);

        alignment.mult(alignSlider.value());
        cohesion.mult(cohesionWeight);
        separation.mult(separationSlider.value());

        this.acceleration.add(alignment);
        this.acceleration.add(cohesion);
        this.acceleration.add(separation);
    }

    update() {
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.acceleration.set(0,0);
    }

    show() {
        // triangles (lil paper planes)
        // TODO: change background back to white
        // stroke(300);
        // noFill();
        // triangle(this.position.x-5, this.position.y+15,
        //     this.position.x, this.position.y,  
        //     this.position.x+5, this.position.y+15);

        strokeWeight(5);
        stroke(0);
        point(this.position.x, this.position.y);
    }
}