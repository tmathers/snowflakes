

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 );
camera.position.set( 0, 0, 100 );
camera.lookAt( 0, 0, 0 );

const scene = new THREE.Scene();

const MAX_DEPTH = 3;

const MAX_LINE_LENGTH = 30;

const ONE_THIRD_PI = 1.047198;
var branchAngle = 0.4;


drawBranches(0, 0, 0, MAX_LINE_LENGTH, MAX_LINE_LENGTH, 0x00ffff, 0, 0, 1, 0, 0);


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
function drawBranches(startX, startY, endX, endY, lineLength, color, depth, rotation, scale, dx, dy) {

    if (depth == MAX_DEPTH) {
        return;
    }
    depth++;

    console.log("DEPTH = " + depth)


    var lineWidth = 1;

    for (var i = 0; i < 6; i++) {
        
        // when depth == 1, this makes the first 6 lines
        makePoint(i, startX, startY, endX, endY, color, lineWidth, rotation, scale, dx, dy);
    }
 
    // Take a middle point on the line....
    
    var numBranchPoints = 3;

    for (var k = numBranchPoints; k > 0; k--) {


        if (k == 1) {
            //color = 0x0000ff;
        }

        // reflect
        for (var j = 0; j <= 1; j++) {

            var theta = branchAngle;

            if (j > 0) {
                theta = - branchAngle;  // reflect it along y-axis
            }

            if (depth == 1) {
                //color = 0xff00ff
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
            

            newLineLen = lineLength / (k % 2 == 0 ? 2 : 3);


            console.log("DRawing branch. depth = " + depth + ", k = " + k + ", color = "
                + (color == 0x0000ff ? "blue" : "cyan"));


            drawBranches(x1, y1, x2, y2, newLineLen,
                color, depth, rotation + theta, newLineLen / MAX_LINE_LENGTH,//scale / (depth + 1), 
                dx2 ,                         // translate to the mid-point of the last line
                dy2);
        }
    }
    
    
}



renderer.render( scene, camera );



/**
 * 
 * 
 *        angle
 *      |--/
 *      | / length
 *      |/
 *      . (startX, startY)
 * 
 *      sin = opp/hyp
 *      cos = adj/hyp           sin(theta) = x/length   =>  x = length * sin(theta)
 *      tan = opp/adg           cos(theta) = y/length   =>  y = length * cos(theta)
 * 
 *      
 * 
 *      have angle, & length 
 * 
 * @param {*} num 
 * @param {*} pointLen 
 */


function makePoint(num, startX, startY, endX, endY, color, lineWidth, rotate, scale, dx, dy) {

    const points = [];

    points.push( new THREE.Vector2( startX, startY ));
    points.push( new THREE.Vector2( endX, endY ));

    material = new THREE.LineBasicMaterial( { color: color, linewidth: lineWidth} );
    const geometry = new THREE.BufferGeometry().setFromPoints( points );

    if (rotate != 0) {
        geometry.translate(- startX, - startY, 0);
        geometry.rotateZ(rotate);
        geometry.translate(startX, startY, 0);
    }

    
    geometry.scale(scale, scale, scale);
    geometry.translate(dx, dy, 0);
    
    
    geometry.rotateZ(ONE_THIRD_PI * num);    // Radians (30 deg)
    

    const line = new THREE.Line( geometry, material );

    scene.add( line );


       /* const geometry = new LineGeometry();
    geometry.setPositions( points );
    geometry.setColors( colors );

    geometry.rotateZ(1.047198 * num);  // Radians (30 deg)

    matLine = new LineMaterial( {
        color: color,
        linewidth: lineWidth, // in pixels
        vertexColors: true,
        dashed: false
    } );

    line = new Line2( geometry, matLine );
    line.computeLineDistances();
    scene.add( line );
*/
}