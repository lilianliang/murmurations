const flock = [];

let alignSlider, cohesionSlider, separationSlider;

let poem;

let currTime;

function setup() {
    createCanvas(1500, 700);

    currTime = millis();

    poem = new Poem();
    console.log(poem);

    textSize(35);

    input = createDiv('<textarea name="input" rows="10" cols="30"> </textarea>');
    input.position(10, 50);

    button = createButton('submit');
    button.position(200, 200);
    button.mousePressed(poem.updatePoem);

    alignSlider = createSlider(0, 5, 1, 0.1);
    alignSlider.position(10, 390);
    cohesionSlider = createSlider(0, 5, 1, 0.1);
    cohesionSlider.position(10, 420);
    separationSlider = createSlider(0, 5, 1, 0.1);
    separationSlider.position(10, 450);

    for (let i = 0; i < 100; i++) {
        flock.push(new Boid());
    }
}

function draw() {
    // NOTE: Cool effect if you comment out background!! Leaves lil trails
    background(300);
    text('alignment', alignSlider.x * 2 + alignSlider.width, 405);
    text('cohesion', cohesionSlider.x * 2 + cohesionSlider.width, 435);
    text('separation', cohesionSlider.x * 2 + cohesionSlider.width, 465);

    // Update every 3 seconds
    if (millis() > currTime + 3000) {
        console.log(poem);
        poem.updateCohesionWeight();
        poem.updateSeparationWeight();
        console.log(poem.lines[poem.currLine]);
        console.log("cohesion weight: " + poem.cohesionWeight);

        poem.incrementLine();
        currTime = millis();
    }

    for (let boid of flock) {
        boid.edges();
        boid.flock(flock, poem.alignmentWeight, poem.cohesionWeight, poem.separationWeight);
        boid.update();
        boid.show();
    }
}