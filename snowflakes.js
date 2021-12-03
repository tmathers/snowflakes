

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 );
camera.position.set( 0, 0, 100 );
camera.lookAt( 0, 0, 0 );

const scene = new THREE.Scene();

const MAX_DEPTH = 4;

length = 30;
drawBranches(0, 0, 0, length, length, 0x00ffff, 0, 0, 1, 0, 0);


function drawBranches(startX, startY, endX, endY, lineLength, color, depth, rotation, scale, dx, dy) {

    if (depth == MAX_DEPTH) {
        return;
    }
    depth++;

    console.log(startX + ", " + startY + " - " + endX + ", " + endY)


    var lineWidth = 1;

    for (var i = 0; i < 6; i++) {
        
        //if (depth == 1)
        makePoint(i, startX, startY, endX, endY, color, lineWidth, rotation, scale, dx, dy);
    }
 
        // Take a middle point on the line....
        
        var numBranchPoints = 2;

        for (var k = numBranchPoints; k > 0; k--) {

           // len = len / numBranchPoints - k ;

            //lineLength ++;

            if (k == 1) {
                color = 0x0000ff;
            }
            

            // reflect
            for (var j = 0; j <= 1; j++) {

                theta = 0.7;

                if (j > 0) {
                    theta = - theta;  // reflect it along y-axis
                }

                var x1, y1, x2, y2;

                if (depth == 1) {
                    //color = 0xff00ff
                }

                x1 = startX;
                y1 = startY;
                x2 = endX;
                y2 = y1 + lineLength ;

                dx2 = dx;
                dy2 = dy;

                
                xNeg = 0                < rotation + theta  && Math.PI              > rotation + theta ;
                yNeg = Math.PI  / 2.0   < rotation + theta && 3 * Math.PI /2.0     > rotation + theta ;    // 1.57 - 4.71

                
                console.log("X NEG? " , xNeg);
                console.log("Y neg? " + yNeg)

                
                if  (xNeg || !xNeg) {

                    var angle = Math.PI / 2.0 - rotation

                    //console.log("2^ depth=" + Math.pow(2, depth))
                    var x = (Math.cos(angle) * (lineLength / Math.pow(2, depth)));
                    var y = ( Math.sin(angle) * (lineLength / Math.pow(2, depth)));

                    //console.log("rad to add X=" + x);
                    //console.log("rad to add Y=" + y);

                    dx2 = dx - x;
                    dy2 = dy + y;
                }

                else if (depth == 1) {  // TODO does this get called?
                    dx2 = 0;
                    dy2 = (lineLength) / 2;
                } 


                //console.log("dx, dy =" + dx + ", " + dy)

                drawBranches(x1, y1, x2, y2, 
                    lineLength, color, depth,  rotation + theta, scale / 2.0, 
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
    
    geometry.rotateZ(1.047198 * num);    // Radians (30 deg)
    

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