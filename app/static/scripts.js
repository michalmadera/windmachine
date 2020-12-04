function draw2(boatangle, sailangle, winddir, rudderangle) {
    var canvas = document.getElementById('canvas');
    if (canvas.getContext) {
      var ctx = canvas.getContext('2d');
      var xpos = 0
      var ypos = 0
      var boatlength = 150
      var curve = boatlength / 4
      var curveshift = boatlength / 2
          var sternwidth = boatlength / 16
          /* north direction */
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.beginPath();
          ctx.moveTo(5, 35);
          ctx.lineTo(20, 15);
          ctx.lineTo(35, 35);
          ctx.lineTo(20, 25);
          ctx.lineTo(5, 35);		
          ctx.stroke();
          ctx.font = "20px Arial";
          ctx.strokeText("N", 13, 48);
  
          /* wind direction */
          var relx = -ctx.canvas.width/2
          var rely = -ctx.canvas.height/2
          ctx.save();
      ctx.translate(-relx, -rely);
      ctx.rotate(winddir * Math.PI / 180);
      ctx.beginPath();
      ctx.moveTo(0, rely+60);
          ctx.lineTo(0-20, rely+20);
          ctx.lineTo(0+20, rely+20);
          ctx.lineTo(0, rely+60);
          ctx.font = "10px Arial";
          ctx.fillText("wind", -10, rely+30);
      ctx.stroke();
          ctx.font = "12px Arial";
          ctx.fillText("3.8 m/s", -18, rely+15);
          ctx.restore();
  //    ctx.rotate(-winddir * Math.PI / 180);
  //		ctx.translate(relx, rely);
  
      /* boat */
      ctx.save()
      ctx.translate(ctx.canvas.width/2, ctx.canvas.height/2);
      ctx.rotate(boatangle * Math.PI / 180);
      ctx.moveTo(xpos, ypos);
      ctx.quadraticCurveTo(xpos-curve, ypos+curveshift, xpos-sternwidth, ypos+boatlength);
          ctx.moveTo(xpos, ypos);
      ctx.quadraticCurveTo(xpos+curve, ypos+curveshift, xpos+sternwidth, ypos+boatlength);
          ctx.stroke();
      ctx.beginPath();
          ctx.moveTo(xpos+sternwidth, ypos+boatlength);
          ctx.lineTo(xpos-sternwidth, ypos+boatlength);
          ctx.stroke();
  
          /* rudder */
      ctx.translate(xpos, ypos+boatlength)
      ctx.rotate( rudderangle * Math.PI / 180);
      ctx.beginPath();
      //ctx.fillRect(-2, 0, 4, 4);
      ctx.moveTo(0, 0)
      ctx.lineTo(0, boatlength*0.15);
      ctx.stroke();
      ctx.rotate( -rudderangle * Math.PI / 180);
      ctx.translate(-xpos, -ypos-boatlength)
      //ctx.restore();
       
  
      /* main sail */
          ctx.translate(0, boatlength*0.3); 
      ctx.rotate( -sailangle * Math.PI / 180);
      ctx.beginPath();
      ctx.moveTo(xpos, ypos);
          ctx.fillRect(xpos-2, ypos-2, 4, 4);
          if (Math.abs(winddir - boatangle) < 20){ 
        for (var i=1; i<16; i++){
          ctx.lineTo(xpos+2*boatlength*0.015, ypos+i*boatlength*0.03);
          ctx.lineTo(xpos-2*boatlength*0.015, ypos+(i+1)*boatlength*0.03);
          i++;
           }
      } else {
          if (sailangle > 0) {
            ctx.quadraticCurveTo(xpos+boatlength*0.15, ypos+boatlength*0.10, 
          xpos, ypos+boatlength*0.6);
        } else {
                  ctx.quadraticCurveTo(xpos-boatlength*0.15, ypos+boatlength*0.10, 
          xpos, ypos+boatlength*0.6);
        }
          
      }
          ctx.stroke();
          ctx.translate(0, -boatlength*0.3); 
      ctx.restore();
      }
  }
  
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  async function test_angles() {
       for (var i=-60; i < 80; i=i+2) {
          draw2(i, i, 0, -40)
          await sleep(60);
        }
      for (var i=80; i > 10; i=i-2) {
          draw2(80, i, 0, -40)
          await sleep(60);
        }
      for (var i=10; i < 80; i=i+2) {
          draw2(80, i, 0, -40)
          await sleep(60);
        }
      for (var i=-40; i < 40; i=i+2) {
          draw2(80, 80, 0, i)
          await sleep(10);
        }
          for (var i=40; i > -40; i=i-2) {
          draw2(80, 80, 0, i)
          await sleep(10);
        } 
      for (var i=-40; i < 40; i=i+2) {
      draw2(80, 80, 0, i)
      await sleep(10);
    }
      for (var i=0; i < 360; i=i+1) {
      draw2(80, 80, i, 40)
      await sleep(30);
    }
  
  }

function testBoat(){
  test_angles();
}
  //draw2(0, 5, 45, 0)
  //draw2(0, -35, 45, 45)
  