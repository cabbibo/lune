uniform sampler2D t_iri;
uniform mat4 modelMatrix;
uniform vec3 lightPos;


varying vec3 vNorm;
varying vec3 vPos;
varying vec3 vMPos;
varying vec3 vView;

varying vec3 vTang; 
varying vec3 vBino; 
varying vec3 vPosOG;
varying vec3 vNormOG;

const float dAmount = .03;
const float specular =1.;

$simplex
$calcStuff


void main(){

  vec3 view = normalize( vMPos - cameraPosition );
  // need tangent and binormal so we can do displacement calculation
  // on different points to cross and get normal;
  vec3 norm = calcTangNorm( vPosOG * 40. , vNormOG , vTang , vBino , dAmount );
  float displacement = calcDisplacement( vPosOG );

  vec3 mNorm = normalize( (modelMatrix * vec4( norm , 0. )).xyz );
  vec3 newNorm = normalize( vNorm + .3 * mNorm );

  vec3 lightDir = normalize( lightPos - vMPos );
  float match = dot( newNorm , -lightDir );

  vec3 refl = reflect( lightDir , newNorm );
  float eyeMatch = max( 0. , dot( normalize( refl )  , normalize( view )));
  float spec = pow( eyeMatch , specular );

  vec4 iri = texture2D( t_iri , vec2( sin( spec * 3. ) , 0. ) ) ;
  vec4 iri2 = texture2D( t_iri , vec2( match, 0. ) );
  
  // We are also going to color our fragments
  // based on the color of the audio
  vec3 col =  iri.xyz * spec;
  //col += iri2.xyz * .5 *  match;

  //col = newNorm * .5 + .5;

  gl_FragColor = vec4( col , .5 );

}
