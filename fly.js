function currentCityAllFlys(start, endArr) {
  if (cityGroup.children.length) disposeGroup(cityGroup);
  if (flyGroup.children.length) disposeGroup(flyGroup);

  var startPoint = cityPoint(start)
  cityGroup.add(startPoint)
  startMesh = startMeshFun(start);
  cityGroup.add(startMesh);

  cityPointArr.push(startPoint)
  startPoint.position.z += 1.3
  startPoint.geometry.scale(1.2, 1.2, 1.0)
  endArr.forEach((cood, i) => {
    var end = new THREE.Vector3(cood.E, cood.N, 0); 
    var cityPointMesh = cityPoint(end)
    cityGroup.add(cityPointMesh)
    cityPointMesh.s = _s * Math.random() + 1; 
    cityPointArr.push(cityPointMesh)
    var flyTrack = flyTrackFun(start, end);
    flyGroup.add(flyTrack);

    var points = flyTrack.flyTrackPoints;

    var index = 20; 
    var flyline = flylineFun(index, points); 
    flyline.index = Math.floor((points.length - flyline.num) * Math.random()); 
    flyTrack.add(flyline); 
    var maxH = 4;
    var h = 1 + (maxH - 1) * Math.random();
    var heightMesh = cityHeight(h, h / maxH);
    heightMesh.position.set(cood.E, cood.N, 0);
    cityGroup.add(heightMesh);
  })
}

function disposeGroup(group) {
  group.traverse(function(obj) {
    if (obj.type == 'Mesh' || obj.type == 'Line') {
      obj.geometry.dispose();
      obj.material.dispose();
    }
  })
  if (group.children.length) {
    group.children = []; 
  }
}
function startMeshFun(startCoord) {
  var startgeometry = new THREE.ConeBufferGeometry(0.5, 2, 4);
  startgeometry.rotateX(-Math.PI / 2);
  var startmaterial = new THREE.MeshLambertMaterial({
    color: 0x00ffff,
  });
  var startMesh = new THREE.Mesh(startgeometry, startmaterial);
  startMesh.position.copy(startCoord);
  startMesh.position.z += 1;
  return startMesh
}
var texLoad = new THREE.TextureLoader();
var geometryHeight = new THREE.CylinderGeometry(0.2, 0.2, 1, 6);
geometryHeight.rotateX(Math.PI / 2);
geometryHeight.translate(0, 0, 0.5);
geometryHeight.computeFlatVertexNormals();
var color1 = new THREE.Color(0x00ffff);
var color2 = new THREE.Color(0x00ff33);
function cityHeight(h, percent) {
  var material = new THREE.MeshLambertMaterial({
    color: 0xffff00,
  });
  var color = color1.clone().lerp(color2.clone(), percent)
  material.color.copy(color);

  var mesh = new THREE.Mesh(geometryHeight, material);
  mesh.scale.z = h; 
  return mesh;
}

var cityPointTexture = texLoad.load("./point.png")
function cityPoint(cityCoord) {
  var mat = new THREE.MeshBasicMaterial({
    // color: 0xffff00,
    color: 0x00ffff,
    map: cityPointTexture,
    transparent: true,
    side: THREE.DoubleSide, 
    depthWrite: false, 
  })
  var geo = new THREE.PlaneGeometry(1.5, 1.5)
  var cirMesh = new THREE.Mesh(geo, mat)
  cirMesh.position.copy(cityCoord)
  return cirMesh
}
function updateFlyGeo(flyline, index, points) {
  var pointArr = []; 
  for (var i = 0; i < flyline.num; i++) {
    var v3 = points[i + index]
    pointArr.push(v3.x, v3.y, v3.z)
  }
  flyline.geometry.setPositions(pointArr);
  flyline.geometry.verticesNeedUpdate = true; 
}

function flylineFun(index, points) {
  var choosePoints = []; 
  var num = 11; 
  for (var i = 0; i < num; i++) {
    choosePoints.push(points[i + index])
  }
  var geometry = new THREE.LineGeometry();
  var pointArr = []
  choosePoints.forEach(function(v3) {
    pointArr.push(v3.x, v3.y, v3.z)
  })
  geometry.setPositions(pointArr);
  var colorArr = []
  for (var i = 0; i < choosePoints.length; i++) {
    var color1 = new THREE.Color(0x006666); 
    var color2 = new THREE.Color(0xffff00);
    var colo = null
    var posNum = choosePoints.length - 2;
    if (i < posNum) {
      colo = color1.lerp(color2, i / posNum)
    } else {
      colo = color2.lerp(color1, (i - posNum) / (choosePoints.length - posNum))
    }
    colorArr.push(colo.r, colo.g, colo.b)
  }
  geometry.setColors(colorArr);
  var material = new THREE.LineMaterial({
    vertexColors: THREE.VertexColors, 
    linewidth: 2.5,
  });
  material.resolution.set(window.innerWidth, window.innerHeight);
  var flyline = new THREE.Line2(geometry, material);
  flyline.num = num;
  flyline.index = index;
  return flyline;
}

function flyTrackFun(start, end) {
  var length = start.clone().sub(end).length();
  var H = length * 0.1; 
  var middle = new THREE.Vector3(0, 0, 0);
  middle.add(start).add(end).divideScalar(2)
  middle.z += H; 

  var geometry = new THREE.Geometry();
  var curve = new THREE.CatmullRomCurve3([
    start,
    middle,
    end
  ]);
  var points = curve.getPoints(100); 
  geometry.setFromPoints(points); 
  var material = new THREE.LineBasicMaterial({
    color: 0x00aaaa,
  });
  var line = new THREE.Line(geometry, material);
  line.flyTrackPoints = points;
  return line;
}
