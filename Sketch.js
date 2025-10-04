//document.body.style.backgroundColor = 'black'

// Make variables globally accessible
window.sketchVars = {
    mode: "difference",
    rotationSpeed: 0.05,
    pattern: null,
    colors: ['white', 'red'],
    heights: [40, 100]
}

// For backward compatibility
let mode = window.sketchVars.mode
function makePattern(pattern, height, rot, col){
    console.log('makePattern called with:', { pattern, height, rot, col });
    console.log('View bounds:', paper.view.bounds);
   
    let groupHeight = pattern.length*2*height
    let directionLine = new paper.Path.Line(paper.view.bounds.topLeft, paper.view.bounds.bottomRight)
    directionLine.strokeColor = "red"
    directionLine.rotate(rot)
    
    let patternGroup = new paper.Group()
    for(let [idx, i] of Object.entries(pattern)){
        let r = new paper.Path.Rectangle([0,idx*height], [paper.view.bounds.width*2, height])
        r.fillColor = col
        r.opacity = i
        r.blendMode = window.sketchVars.mode;
        patternGroup.addChild(r)
    }
    
    for(let [idx, i] of Object.entries(pattern)){
        let r = new paper.Path.Rectangle([0,idx*height+groupHeight/2], [paper.view.bounds.width*2, height])
        r.fillColor = col
        r.opacity = pattern[pattern.length-idx-1]
        r.blendMode = window.sketchVars.mode
        patternGroup.addChild(r)
    }
    
    patternGroup.rotate(directionLine.getNormalAt(10).angle)
    patternGroup.remove()
    
    let patternSymbol = new paper.Symbol(patternGroup)
    for(let i = 0; i<directionLine.length;i+=groupHeight){
        console.log(i)
        patternSymbol.place(directionLine.getPointAt(i))
        
        console.log("placed at angle:", directionLine.getTangentAt(i).angle)
    }
    directionLine.remove()
}

function getRandomTest(nr){
    let pattern = []
    for(let i = 0; i<nr; i++){
        pattern.push(Math.round(Math.random()))
    }
    return pattern
}

window.setPatterns = function(pattern1, pattern2){
    window.sketchVars.pattern = pattern1
    window.sketchVars.pattern2 = pattern2
    //fadeOut()
    paper.project.activeLayer.removeChildren()
    //setTimeout(() => {
    //    window.sketchVars.redraw()
    //}, 3000)

    window.sketchVars.redraw()
}

function fadeOut(){
    for( let elem of paper.project.activeLayer.children){
        elem.tweenTo({opacity: 0}, Math.random()*2000+1000).onComplete = function(){
            elem.remove()
        }
    }
    
}

// Store pattern globally
window.sketchVars.pattern = getRandomTest(10)
window.sketchVars.pattern2 = getRandomTest(10)

// Function to regenerate and redraw patterns
window.sketchVars.redraw = function() {
    console.log('Redraw function called');
    console.log('Paper.js view size:', paper.view.viewSize);
    //:', window.sketchVars.pattern);
    
    // Use paper scope to access project
    paper.project.clear()
    let p = window.sketchVars.pattern
    let p2 = window.sketchVars.pattern2
    console.log('Making patterns...');
    
    makePattern(p, window.sketchVars.heights[0], 0, window.sketchVars.colors[0])
    makePattern(p, window.sketchVars.heights[0], 120, window.sketchVars.colors[0])
    makePattern(p, window.sketchVars.heights[0], 240, window.sketchVars.colors[0])
        
    makePattern(p2, window.sketchVars.heights[1], 0, window.sketchVars.colors[1])
    makePattern(p2, window.sketchVars.heights[1], 120, window.sketchVars.colors[1])
    makePattern(p2, window.sketchVars.heights[1], 240, window.sketchVars.colors[1])

    for(let elem of paper.project.activeLayer.children){
        console.log(elem.className)
    }
    
    console.log('Patterns created, total items in project:', paper.project.activeLayer.children.length);
    
}

// Function to set up the animation frame
window.sketchVars.setupAnimation = function() {
    paper.view.onFrame = function(e) {
        // Use frame delta for smooth rotation independent of frame rate
        paper.view.rotate(window.sketchVars.rotationSpeed /2 )
    }
}

// Handle canvas resize
window.sketchVars.onResize = function(event) {
    console.log('Canvas resized to:', paper.view.viewSize);
    // Let Paper.js handle the resize automatically
}

// Initial setup - this will be called after Paper.js is ready
window.sketchVars.init = function() {
   
    window.sketchVars.redraw()
    window.sketchVars.setupAnimation()
    
    // Set up resize handler
    paper.view.onResize = window.sketchVars.onResize
}