
var meshArr = [];
var chooseMesh = null; 

function lineFun(childAreaArr, mapGroup) {
  var group = new THREE.Group()
  var material = new THREE.LineBasicMaterial({
    color: 0x00cccc, 
  })
  childAreaArr.forEach((childArea, i) => {
    childArea.geo.forEach((vertices) => {
      var newVertices = []
      vertices.forEach((v2, i) => {
        newVertices.push(new THREE.Vector3(v2.x, v2.y, 0))
      });
      var geometry = new THREE.Geometry()
      geometry.vertices = newVertices; 
      var line = new THREE.LineLoop(geometry, material);
      group.add(line); 

    });
  });
  return group
}


function extrudeMeshFun(childAreaArr, mapGroup, h) {
  childAreaArr.forEach((childArea, i) => {
    var shapeArr = []
    childArea.geo.forEach((vertices) => {
      var shape = new THREE.Shape(vertices);
      shapeArr.push(shape)
    });
    var geometry = new THREE.ExtrudeGeometry(shapeArr,
      {
        amount: h, 
        curveSegments: 35, 
        bevelEnabled: false 
      }
    );
    var material = new THREE.MeshPhongMaterial({
      color: 0x004444,
    }); 
    var mesh = new THREE.Mesh(geometry, material); 
    mapGroup.add(mesh);
    if (childArea.name == '河南') {
      mesh.material = new THREE.MeshPhongMaterial({
        color: 0x006666,
      });
      chooseMesh = mesh;
    }
    meshArr.push(mesh);
    mesh.name = childArea.name;
  });
}
function childAreaArrFun(data) {
  var childAreaArr = [];
  data.features.forEach(function(childArea) {
    var area = {
      geo: [],
      name: childArea.properties.name,
    };
    childAreaArr.push(area);
    if (childArea.geometry.type === "Polygon") {
      area.geo[0] = [];
      childArea.geometry.coordinates[0].forEach(elem => {
        area.geo[0].push(new THREE.Vector2(elem[0], elem[1]))
      });
    } else if (childArea.geometry.type === "MultiPolygon") {
      childArea.geometry.coordinates.forEach((range, index) => {
        area.geo[index] = [];
        range[0].forEach(elem => {
          area.geo[index].push(new THREE.Vector3(elem[0], elem[1], 0))
        });
      });
    }
  });
  return childAreaArr
}

function GeoJSON(data) {
  var mapGroup = new THREE.Group();
  var childAreaArr = childAreaArrFun(data);
  var linegroup = lineFun(childAreaArr);
  mapGroup.add(linegroup)
  var maxL = centerCamera(mapGroup, camera);
  var h = maxL * 0.01; 
  extrudeMeshFun(childAreaArr, mapGroup, h)
  var linegroup2 = linegroup.clone();
  linegroup2.position.z = h + h * 0.01;
  linegroup.position.z = -h * 0.01;
  mapGroup.add(linegroup2)
  return mapGroup;
}
function centerCamera(mapGroup, camera) {
  var box3 = new THREE.Box3(); 
  box3.expandByObject(mapGroup);
  var center = new THREE.Vector3(); 
  box3.getCenter(center);
  mapGroup.position.x = mapGroup.position.x - center.x;
  mapGroup.position.y = mapGroup.position.y - center.y;
  mapGroup.position.z = mapGroup.position.z - center.z;

  var scaleV3 = new THREE.Vector3(); 
  box3.getSize(scaleV3) 
  console.log('查看包围盒尺寸', scaleV3)
  var maxL = maxLFun(scaleV3);
  s = maxL / 2 * 0.5;
  camera.left = -s * k;
  camera.right = s * k;
  camera.top = s;
  camera.bottom = -s;
  camera.updateProjectionMatrix();
  return maxL
}
function maxLFun(v3) {
  var max;
  if (v3.x > v3.y) {
    max = v3.x
  } else {
    max = v3.y
  }
  if (max > v3.z) {} else {
    max = v3.z
  }
  return max;
}
