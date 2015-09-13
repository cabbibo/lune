
uniform float time;

varying vec3 vPos;
varying vec3 vNorm;
varying vec3 vMPos;
varying vec3 vView;

varying vec3 vTang; 
varying vec3 vBino; 
varying vec3 vPosOG;
varying vec3 vNormOG;


const float dAmount = .001;


$simplex

$calcStuff



void main(){

  vec3 pos = position;
  vec3 norm = normal;

  vPosOG = position;
  vNormOG = normal;

  // choose arbitrary up vector to get our tangent space
  vec3 up = vec3( 0. , 1. , 0. );

  // if arbitrary vector is too close to normal,
  // choose another one.
  if( abs( dot( up , normal ) ) >  .999 ){ up = vec3( 0., 0., 1.); }

  vec3 tangent = normalize( cross( up , normal ) );
  vec3 binormal = normalize( cross( tangent , normal ) );

  vTang = tangent;
  vBino = binormal;

  // need tangent and binormal so we can do displacement calculation
  // on different points to cross and get normal;
  norm = calcTangNorm( pos , normal , tangent , binormal , dAmount * 20.);

  pos = calcNewPos( pos, normal , dAmount * 10.);


  vPos = pos;
  vNorm = normalize( (modelMatrix * vec4( norm , 0. )).xyz );
  vMPos = (modelMatrix * vec4( pos , 1. )).xyz;


  // Use this position to get the final position 
  gl_Position = projectionMatrix * modelViewMatrix * vec4( pos , 1.);

}
