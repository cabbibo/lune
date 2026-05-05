function AudioController(){

  this.ctx = new AudioContext();

  var _ctx = this.ctx;

  // Build a "start audio" button, show it only if autoplay was blocked
  var btn = document.createElement( 'div' );
  btn.innerText = 'click to start song';
  btn.style.cssText = 'position:fixed;bottom:30px;left:50%;transform:translateX(-50%);padding:12px 24px;background:rgba(255,255,255,0.15);color:#fff;font-family:monospace;font-size:14px;letter-spacing:0.1em;border:1px solid rgba(255,255,255,0.4);border-radius:4px;cursor:pointer;z-index:9999;display:none;';
  document.body.appendChild( btn );

  // Show button after a short delay if audio context is still suspended
  setTimeout( function(){
    if( _ctx.state === 'suspended' ) btn.style.display = 'block';
  }, 500 );

  function unlock(){
    if( _ctx.state === 'suspended' ){ _ctx.resume(); console.log( 'audio context resumed' ); }
    else { console.log( 'audio context already running:', _ctx.state ); }
    if( typeof ULTIMATE_STREAM !== 'undefined' && ULTIMATE_STREAM.paused ){ ULTIMATE_STREAM.play(); console.log( 'stream restarted' ); }
    else { console.log( 'stream state:', typeof ULTIMATE_STREAM !== 'undefined' ? ULTIMATE_STREAM.paused : 'not defined' ); }
    btn.style.display = 'none';
  }

  document.addEventListener( 'click', unlock, { once: true } );


  this.mute     = this.ctx.createGain();
  this.analyser = this.ctx.createAnalyser();
  this.gain     = this.ctx.createGain();

  this.gain.connect( this.analyser );
  this.analyser.connect( this.mute );
  
  // If you sound to come out, connect it to the destination
  this.mute.connect( this.ctx.destination );

  this.analyser.frequencyBinCount = 1024;
  this.analyser.array = new Uint8Array( this.analyser.frequencyBinCount );

  
  var data = this.processAudioController();
  
  this.texture = new THREE.DataTexture(
    data,
    data.length / 16,
    1,
    THREE.RGBAFormat,
    THREE.FloatType
  );
  
  this.texture.needsUpdate = true;
  

}

AudioController.prototype.update = function(){

  this.analyser.getByteFrequencyData( this.analyser.array );

  this.audioData = this.processAudioController(); 

  this.texture.image.data = this.processAudioController(); 
  this.texture.needsUpdate = true;


}


AudioController.prototype.processAudioController = function(){


  var width = this.analyser.frequencyBinCount
 
  var audioTextureData = new Float32Array( width );
 
  for (var i = 0; i < width; i+=4) {
   
    //console.log( this.analyser.array[ i / 4 ] ); 
    audioTextureData[ i+0 ] = this.analyser.array[ (i/4) + 0 ] / 256;
    audioTextureData[ i+1 ] = this.analyser.array[ (i/4) + 1 ] / 256;
    audioTextureData[ i+2 ] = this.analyser.array[ (i/4) + 2 ] / 256;
    audioTextureData[ i+3 ] = this.analyser.array[ (i/4) + 3 ] / 256;
    
  }

  return audioTextureData;

}
