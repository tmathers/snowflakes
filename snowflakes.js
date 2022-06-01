
var ctx;

var CANVAS_HEIGHT = 600;
var CANVAS_WIDTH = 600;

const scene = new THREE.Scene();



var MAX_LINE_LENGTH;
var LENGTH_FACTOR = 2.75;

const ONE_THIRD_PI = 1.047198;


var color1 = rgbToHex(
        0,
        Math.floor(255 * Math.random()),
        255
    );


var branchAngle = Math.random() * 0.8 + 0.3;
var branchLengthFactor = Math.random() * 0.2 + 0.25;
var numBranchPoints = Math.round(Math.random() * 3 + 3);
var MAX_DEPTH = Math.round(Math.random() * 2 + 2);

function setParams() {
    color1 = rgbToHex(
        0,
        Math.floor(255 * Math.random()),
        255
    );


    branchAngle = Math.random() * 0.7 + 0.4 //.7;
    branchLengthFactor = Math.random() * 0.3 + 0.3;//0.5;
    numBranchPoints = Math.round(Math.random() * 3 + 3);//4;
}


window.onload = function load() {


    var canvas = document.getElementById("canvas");

    CANVAS_WIDTH = canvas.width = window.innerWidth;
    CANVAS_HEIGHT = canvas.height = window.innerHeight;
    
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    MAX_LINE_LENGTH = CANVAS_HEIGHT / LENGTH_FACTOR;

    ctx = canvas.getContext("2d");

    // Create background
    var grd = ctx.createRadialGradient(
        CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 0, 
        CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, CANVAS_WIDTH / 2);
    grd.addColorStop(0, "#120a8f");
    grd.addColorStop(1, "#002147");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); 


    drawBranches(0, 0, 0, MAX_LINE_LENGTH, MAX_LINE_LENGTH , 0x00ffff, 0, 0, 1, 0, 0, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);

/*    for (var i = 0; i < 5; i++) {

        var size = (CANVAS_HEIGHT / 4) *  Math.random()  + CANVAS_HEIGHT / 8;
        var x = (i + 1) * CANVAS_WIDTH / 6 ;//Math.random() * CANVAS_WIDTH;
        var y =  Math.random() * CANVAS_HEIGHT * .8 + 0.1 * CANVAS_HEIGHT;

        //ctx.translate(-500, 0)
        setParams();

        MAX_DEPTH = Math.floor(Math.random() * 2 + 2);

        drawBranches(0, 0, 0, size, size, 0x00ffff, 0, 0, 1, 0, 0, x, y);
    }
*/

    // download button
    var link = document.getElementById('link');
    link.setAttribute('download', 'snowflake.png');
    link.setAttribute('href', canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
   
}



/**
 * 
 * @param {*} startX 
 * @param {*} startY 
 * @param {*} endX 
 * @param {*} endY 
 * @param {*} color 
 * @param {*} depth 
 * @param {*} rotation 
 * @param {*} scale 
 * @param {*} dx 
 * @param {*} dy 
 * @returns 
 */
function drawBranches(startX, startY, endX, endY, lineLength, color, depth, rotation, scale, dx, dy,
    originX, originY) {

    if (depth == MAX_DEPTH) {
        return;
    }
    depth++;


    var lineWidth = 1;

    for (var i = 0; i < 6; i++) {
        
        // when depth == 1, this makes the first 6 lines
        makePointOnCanvas(i, startX, startY, endX, endY, color, lineWidth, rotation, scale, dx, dy, depth, originX, originY);
    }
 
    // Take a middle point on the line....
    
    for (var k = numBranchPoints; k > 0; k--) {

        // reflect
        for (var j = 0; j <= 1; j++) {

            var theta = branchAngle;

            if (j > 0) {
                theta = - branchAngle;  // reflect it along y-axis
            }

            var x1 = startX;
            var y1 = startY;
            var x2 = endX;
            var y2 = y1 +  MAX_LINE_LENGTH ;

            var dx2 = dx;   // Where do we move to draw the next branch
            var dy2 = dy;

            var angle = Math.PI / 2.0 - rotation

            var dyDxHyp = k * (lineLength / 2) / (numBranchPoints - 1);


            var x = Math.cos(angle) * dyDxHyp;
            var y = Math.sin(angle) * dyDxHyp;

            dx2 = dx - x;
            dy2 = dy + y;
            

            newLineLen = lineLength * (k % 2 == 0 ? branchLengthFactor : (branchLengthFactor / 2));

            drawBranches(x1, y1, x2, y2, newLineLen,
                color, depth, rotation + theta, newLineLen / MAX_LINE_LENGTH,
                dx2 ,                         // translate to the mid-point of the last line
                dy2,
                originX, originY);
        }
    }
    
    
}


/**
 * 
 * @param {*} num 
 * @param {*} startX 
 * @param {*} startY 
 * @param {*} endX 
 * @param {*} endY 
 * @param {*} color 
 * @param {*} lineWidth 
 * @param {*} rotate 
 * @param {*} scale 
 * @param {*} dx 
 * @param {*} dy 
 */
function makePointOnCanvas(num, startX, startY, endX, endY, color, lineWidth, rotate, scale, dx, dy, depth,
    originX, originY) {
    
    var grad= ctx.createLinearGradient(startX, startY, endX, endY);
    grad.addColorStop(0, color1);
    grad.addColorStop(1, "white");
    

    ctx.strokeStyle = grad;

    ctx.lineWidth = 12 * depth ;
    ctx.lineCap = "round";


    ctx.translate( originX, originY );
    
    ctx.rotate(ONE_THIRD_PI * num);
    
    ctx.translate(dx,  dy);
    

    if (rotate != 0) {
        ctx.rotate(rotate);   
    }
    
    ctx.scale(scale, scale);

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
    

    // Reset transformation matrix to the identity matrix
    ctx.setTransform(1, 0, 0, 1, 0, 0);

}


function componentToHex(c) {
    let hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}