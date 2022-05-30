// 这玩意叫缓动函数 https://www.cnblogs.com/brainworld/p/7240564.html  https://www.cnblogs.com/sky000/archive/2010/10/14/1851274.html
export const tween:{[key:string]:(pos:number)=>number} = {
  easeInQuad: function(pos:number) {
    return Math.round( Math.round( Math.pow(pos, 2)*10000)/10000*10000)/10000;
  },

  easeOutQuad: function(pos:number) {
    return Math.round( -(Math.pow((pos-1), 2) -1)*10000)/10000;
  },

  easeInOutQuad: function(pos:number) {
    if ((pos/=0.5) < 1) return Math.round( 0.5*Math.pow(pos, 2)*10000)/10000;
    return Math.round( -0.5 * ((pos-=2)*pos - 2)*10000)/10000;
  },

  easeInCubic: function(pos:number) {
    return Math.round( Math.pow(pos, 3)*10000)/10000;
  },

  easeOutCubic: function(pos:number) {
    return Math.round( (Math.pow((pos-1), 3) +1)*10000)/10000;
  },

  easeInOutCubic: function(pos:number) {
    if ((pos/=0.5) < 1) return Math.round( 0.5*Math.pow(pos, 3)*10000)/10000;
    return Math.round( 0.5 * (Math.pow((pos-2), 3) + 2)*10000)/10000;
  },

  easeInQuart: function(pos:number) {
    return Math.round( Math.pow(pos, 4)*10000)/10000;
  },

  easeOutQuart: function(pos:number) {
    return -(Math.pow((pos-1), 4) -1);
  },

  easeInOutQuart: function(pos:number) {
    if ((pos/=0.5) < 1) return Math.round( 0.5*Math.pow(pos, 4)*10000)/10000;
    return Math.round( -0.5 * ((pos-=2)*Math.pow(pos, 3) - 2)*10000)/10000;
  },

  easeInQuint: function(pos:number) {
    return Math.round( Math.pow(pos, 5)*10000)/10000;
  },

  easeOutQuint: function(pos:number) {
    return Math.round( (Math.pow((pos-1), 5) +1)*10000)/10000;
  },

  easeInOutQuint: function(pos:number) {
    if ((pos/=0.5) < 1) return Math.round( 0.5*Math.pow(pos, 5)*10000)/10000;
    return Math.round( 0.5 * (Math.pow((pos-2), 5) + 2)*10000)/10000;
  },

  easeInSine: function(pos:number) {
    return Math.round( -Math.cos(pos * (Math.PI/2)) + 1*10000)/10000;
  },

  easeOutSine: function(pos:number) {
    return Math.round( Math.sin(pos * (Math.PI/2))*10000)/10000;
  },

  easeInOutSine: function(pos:number) {
    return Math.round( (-.5 * (Math.cos(Math.PI*pos) -1))*10000)/10000;
  },

  easeInExpo: function(pos:number) {
    return Math.round( (pos==0) ? 0 : Math.pow(2, 10 * (pos - 1))*10000)/10000;
  },

  easeOutExpo: function(pos:number) {
    return Math.round( (pos==1) ? 1 : -Math.pow(2, -10 * pos) + 1*10000)/10000;
  },

  easeInOutExpo: function(pos:number) {
    if (pos==0) return Math.round( 0*10000)/10000;
    if (pos==1) return Math.round( 1*10000)/10000;
    if ((pos/=0.5) < 1) return Math.round( 0.5 * Math.pow(2, 10 * (pos-1))*10000)/10000;
    return Math.round( 0.5 * (-Math.pow(2, -10 * --pos) + 2)*10000)/10000;
  },

  easeInCirc: function(pos:number) {
    return Math.round( -(Math.sqrt(1 - (pos*pos)) - 1)*10000)/10000;
  },

  easeOutCirc: function(pos:number) {
    return Math.sqrt(1 - Math.pow((pos-1), 2));
  },

  easeInOutCirc: function(pos:number) {
    if ((pos/=0.5) < 1) return Math.round( -0.5 * (Math.sqrt(1 - pos*pos) - 1)*10000)/10000;
    return Math.round( 0.5 * (Math.sqrt(1 - (pos-=2)*pos) + 1)*10000)/10000;
  },

  easeOutBounce: function(pos:number) {
    if ((pos) < (1/2.75)) {
      return Math.round( (7.5625*pos*pos)*10000)/10000;
    } else if (pos < (2/2.75)) {
      return Math.round( (7.5625*(pos-=(1.5/2.75))*pos + .75)*10000)/10000;
    } else if (pos < (2.5/2.75)) {
      return Math.round( (7.5625*(pos-=(2.25/2.75))*pos + .9375)*10000)/10000;
    } else {
      return Math.round( (7.5625*(pos-=(2.625/2.75))*pos + .984375)*10000)/10000;
    }
  },

  easeInBack: function(pos:number) {
    const s = 1.70158;
    return Math.round( (pos)*pos*((s+1)*pos - s)*10000)/10000;
  },

  easeOutBack: function(pos:number) {
    const s = 1.70158;
    return Math.round( (pos=pos-1)*pos*((s+1)*pos + s) + 1*10000)/10000;
  },

  easeInOutBack: function(pos:number) {
    let s = 1.70158;
    if ((pos/=0.5) < 1) return Math.round( 0.5*(pos*pos*(((s*=(1.525))+1)*pos -s))*10000)/10000;
    return Math.round( 0.5*((pos-=2)*pos*(((s*=(1.525))+1)*pos +s) +2)*10000)/10000;
  },

  elastic: function(pos:number) {
    return Math.round( -1 * Math.pow(4, -8*pos) * Math.sin((pos*6-1)*(2*Math.PI)/2) + 1*10000)/10000;
  },

  swingFromTo: function(pos:number) {
    let s = 1.70158;
    return ((pos/=0.5) < 1) ? 0.5*(pos*pos*(((s*=(1.525))+1)*pos - s)) :
            0.5*((pos-=2)*pos*(((s*=(1.525))+1)*pos + s) + 2);
  },

  swingFrom: function(pos:number) {
    const s = 1.70158;
    return Math.round( pos*pos*((s+1)*pos - s)*10000)/10000;
  },

  swingTo: function(pos:number) {
    const s = 1.70158;
    return Math.round( (pos-=1)*pos*((s+1)*pos + s) + 1*10000)/10000;
  },

  bounce: function(pos:number) {
    if (pos < (1/2.75)) {
      return Math.round( (7.5625*pos*pos)*10000)/10000;
    } else if (pos < (2/2.75)) {
      return Math.round( (7.5625*(pos-=(1.5/2.75))*pos + .75)*10000)/10000;
    } else if (pos < (2.5/2.75)) {
      return Math.round( (7.5625*(pos-=(2.25/2.75))*pos + .9375)*10000)/10000;
    } else {
      return Math.round( (7.5625*(pos-=(2.625/2.75))*pos + .984375)*10000)/10000;
    }
  },

  bouncePast: function(pos:number) {
    if (pos < (1/2.75)) {
      return Math.round( (7.5625*pos*pos)*10000)/10000;
    } else if (pos < (2/2.75)) {
      return Math.round( 2 - (7.5625*(pos-=(1.5/2.75))*pos + .75)*10000)/10000;
    } else if (pos < (2.5/2.75)) {
      return Math.round( 2 - (7.5625*(pos-=(2.25/2.75))*pos + .9375)*10000)/10000;
    } else {
      return Math.round( 2 - (7.5625*(pos-=(2.625/2.75))*pos + .984375)*10000)/10000;
    }
  },

  easeFromTo: function(pos:number) {
    if ((pos/=0.5) < 1) return Math.round( 0.5*Math.pow(pos, 4)*10000)/10000;
    return Math.round( -0.5 * ((pos-=2)*Math.pow(pos, 3) - 2)*10000)/10000;
  },

  easeFrom: function(pos:number) {
    return Math.round( Math.pow(pos, 4)*10000)/10000;
  },

  easeTo: function(pos:number) {
    return Math.round( Math.pow(pos, 0.25)*10000)/10000;
  },

  linear: function(pos:number) {
    return pos;
  },

  sinusoidal: function(pos:number) {
    return Math.round( (-Math.cos(pos*Math.PI)/2) + 0.5*10000)/10000;
  },

  reverse: function(pos:number) {
    return Math.round( 1 - pos*10000)/10000;
  },

  // mirror: function(pos:number, transition:any) {
  //     transition = transition || tween.sinusoidal;
  //     if(pos<0.5)
  //         return Math.round( transition(pos*2)*10000)/10000;
  //     else
  //         return Math.round( transition(1-(pos-0.5)*2)*10000)/10000;
  // },

  flicker: function(pos:number) {
    const _pos = pos + (Math.random()-0.5)/5;
    return Math.round( tween.sinusoidal(_pos < 0 ? 0 : _pos > 1 ? 1 : _pos)*10000)/10000;
  },

  wobble: function(pos:number) {
    return Math.round( (-Math.cos(pos*Math.PI*(9*pos))/2) + 0.5*10000)/10000;
  },

  // pulse: function(pos:number, pulses:number) {
  //     return Math.round( (-Math.cos((pos*((pulses||5)-.5)*2)*Math.PI)/2) + .5*10000)/10000;
  // },
  //
  // blink: function(pos:number, blinks:number) {
  //     return Math.round( Math.round(pos*(blinks||5)) % 2*10000)/10000;
  // },

  spring: function(pos:number) {
    return Math.round( 1 - (Math.cos(pos * 4.5 * Math.PI) * Math.exp(-pos * 6))*10000)/10000;
  },

  none: function() {
    return 0;
  },

  full: function() {
    return 1;
  },
};
