import {asyncCanvas2Base64} from '../file';

/**
 * 头像生成器
 */
export interface IOptions{
  seed: string, // seed used to generate icon data, default: random
  color: string, // to manually specify the icon color, default: random
  bgcolor: string, // choose a different background color, default: random
  size: number, // width/height of the icon in blocks, default: 8
  scale: number, // width/height of each block in pixels, default: 4
  spotcolor: string
}
export const defaultOptions:Partial<IOptions> = {
  size: 8, // width/height of the icon in blocks, default: 8
  scale: 3, // width/height of each block in pixels, default: 4
  bgcolor: '#ffffff',
};
export type IOps = Pick<IOptions, 'seed'>&Omit<Partial<IOptions>, 'seed'>
/**
 * 根据hash生成头像
 */
export class Identicon {
  private static rand = (randSeed:number[])=> {
    // based on Java's String.hashCode(), expanded to 4 32bit values
    const t = randSeed[0] ^ (randSeed[0] << 11);

    randSeed[0] = randSeed[1];
    randSeed[1] = randSeed[2];
    randSeed[2] = randSeed[3];
    randSeed[3] = (randSeed[3] ^ (randSeed[3] >> 19) ^ t ^ (t >> 8));

    return (randSeed[3]>>>0) / ((1 << 31)>>>0);
  }
  private static seedRand = (seed:string)=> {
    const randSeed:number[] = new Array(4);
    for (let i = 0; i < randSeed.length; i++) {
      randSeed[i] = 0;
    }
    for (let i = 0; i < seed.length; i++) {
      randSeed[i%4] = ((randSeed[i%4] << 5) - randSeed[i%4]) + seed.charCodeAt(i);
    }
    return randSeed;
  }
  private static buildOpts:(opts:Partial<IOptions>)=>[IOptions, number[]] = (opts:Partial<IOptions>)=> {
    const newOpts:Partial<IOptions> = {};

    newOpts.seed = opts.seed || Math.floor((Math.random()*Math.pow(10, 16))).toString(16);

    const randSeed = this.seedRand(newOpts.seed);

    newOpts.size = opts.size || defaultOptions.size;
    newOpts.scale = opts.scale || defaultOptions.scale;
    newOpts.color = opts.color || `#${newOpts.seed.slice(0, 6)}`;
    newOpts.bgcolor = opts.bgcolor || defaultOptions.bgcolor;
    newOpts.spotcolor = opts.spotcolor || `#${newOpts.seed.slice(-6)}`;

    return [newOpts as IOptions, randSeed];
  }
  private static createImageData = (size:number, randSeed:number[])=> {
    const width = size; // Only support square icons for now
    const height = size;

    const dataWidth = Math.ceil(width / 2);
    const mirrorWidth = width - dataWidth;

    const data = [];
    for (let y = 0; y < height; y++) {
      let row = [];
      for (let x = 0; x < dataWidth; x++) {
        // this makes foreground and background color to have a 43% (1/2.3) probability
        // spot color has 13% chance
        row[x] = Math.floor(this.rand(randSeed)*2.3);
      }
      const r = row.slice(0, mirrorWidth);
      r.reverse();
      row = row.concat(r);

      for (let i = 0; i < row.length; i++) {
        data.push(row[i]);
      }
    }

    return data;
  }

  private static renderIcon = (opts:IOps, canvas:HTMLCanvasElement)=>{
    const [_opts, randSeed] = this.buildOpts(opts || {});
    const imageData = this.createImageData(_opts.size, randSeed);
    const width = Math.sqrt(imageData.length);

    canvas.width = canvas.height = _opts.size * _opts.scale;

    const cc = canvas.getContext('2d');
    if (cc) {
      cc.fillStyle = _opts.bgcolor;
      cc.fillRect(0, 0, canvas.width, canvas.height);
      cc.fillStyle = _opts.color;

      for (let i = 0; i < imageData.length; i++) {
        // if data is 0, leave the background
        if (imageData[i]) {
          const row = Math.floor(i / width);
          const col = i % width;

          // if data is 2, choose spot color, if 1 choose foreground
          cc.fillStyle = (imageData[i] == 1) ? _opts.color : _opts.spotcolor;

          cc.fillRect(col * _opts.scale, row * _opts.scale, _opts.scale, _opts.scale);
        }
      }
      return canvas;
    }
  }
  public static createIcon = async (opts:IOps)=> {
    const document = globalThis?.document;
    const {seed} = opts;
    if (seed.length<=12) {
      return '';
    }
    if (document) {
      const canvas = document.createElement('canvas');
      this.renderIcon(opts, canvas);
      return await asyncCanvas2Base64(canvas);
    } else {
      return;
    }
  }
}
