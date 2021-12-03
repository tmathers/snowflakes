

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
        
        var numBranchPoints = 1;

        //for (var k = numBranchPoints; k > 0; k--) {

           // len = len / numBranchPoints - k ;

            //lineLength ++;

            theta = 0.7;

            
            //lineLength = lineLength / 2;

            // reflect
            for (var j = 0; j < 1; j++) {

                //if (j > 0) {
                //    theta = (Math.PI * j) - theta + Math.PI;  // reflect it along y-axis
                //    console.log("j=" + j + ",theta=" + theta);
                //}

                var x1, y1, x2, y2;

                if (depth == 1) {
                    color = 0xff00ff
                }/*
                    x1 = startX + Math.sin(theta) *  lineLength; 
                    y1 = startY +   Math.cos(theta) *  lineLength; 

                    angle = Math.asin((y1 - startY) / lineLength) - theta;

                    x2 = x1 + lineLength * Math.cos(angle);
                    y2 = y1 + lineLength * Math.sin(angle);
                } else {
                    */
                    x1 = startX;
                    y1 = startY;

                    
                    //startX += Math.cos(theta) *  lineLength; 
                    x2 = endX;
                    y2 = y1 + lineLength;

                    //x2 = x1 + lineLength * Math.sin(theta);
                    //y2 = y1 + lineLength * Math.cos(theta);
                //}

                //startX = lineLength * Math.sin(theta) + lineLength;
                //startY = lineLength * Math.cos(theta) + lineLength;
                
                //endX = lineLength * Math.sin(theta);
                //endY = lineLength * Math.cos(theta);

               // dx = lineLength / 2 * Math.sin(theta ) + startX;
                //dy = lineLength / 2 * Math.cos(theta ) + startY;
                
                //makePoint(i, 0, len, endX, endY + len, color, lineWidth );

                if (i == 0) {
                    //console.log(endX + ", " + (endY + len))
                }

                console.log('=====================================')

                console.log("DEPTH=", depth)
                console.log("BEFORE dx, dy =" + dx + ", " + dy)

                console.log("ROTATION=" + (rotation ))

                
                xNeg = 0                < rotation + theta  && Math.PI              > rotation + theta ;
                yNeg = Math.PI  / 2.0   < rotation + theta && 3 * Math.PI /2.0     > rotation + theta ;    // 1.57 - 4.71

                


                
                if (depth == 3) {

                    var angle = Math.PI / 2.0 - rotation

                    console.log("2^ depth=" + Math.pow(2, depth))
                    var x = (Math.cos(angle) * (lineLength / Math.pow(2, depth)));
                    var y = ( Math.sin(angle) * (lineLength / Math.pow(2, depth)));

                    console.log("rad to add X=" + x);
                    console.log("rad to add Y=" + y);

                    dx = dx - x;
                     dy = dy + y;
                }

                else if (depth == 1) {
                    dx = 0;
                    dy = lineLength / 2;
                } else {
                    dx = dx + (xNeg ? -1 : 1) * Math.sin(theta) * (lineLength / Math.pow(2, depth));
                dy = dy + (yNeg ? -1 : 1) * Math.cos(theta) * (lineLength / Math.pow(2, depth)); // 1.57 - 

                
                }


                console.log("dx, dy =" + dx + ", " + dy)

                drawBranches(x1, y1, x2, y2, 
                    lineLength, color, depth,  rotation + theta, scale / 2.0, 
                    dx ,                         // translate to the mid-point of the last line
                    dy);
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