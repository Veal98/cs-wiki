
/* IMPORT */

import _ from '../utils';
import Channels from '../channels';
import ChannelsReusable from '../channels/reusable';
import {DEC2HEX} from '../consts';

/* HEX */

const Hex = {

  /* VARIABLES */

  re: /^#((?:[a-f0-9]{2}){2,4}|[a-f0-9]{3})$/i,

  /* API */

  parse: ( color: string ): Channels | void => {

    if ( color.charCodeAt ( 0 ) !== 35 ) return; // '#'

    const match = color.match ( Hex.re );

    if ( !match ) return;

    const hex = match[1],
          dec = parseInt ( hex, 16 ),
          length = hex.length,
          hasAlpha = length % 4 === 0,
          isFullLength = length > 4,
          multiplier = isFullLength ? 1 : 17,
          bits = isFullLength ? 8 : 4,
          bitsOffset = hasAlpha ? 0 : -1,
          mask = isFullLength ? 255 : 15;

    return ChannelsReusable.set ({
      r: ( ( dec >> ( bits * ( bitsOffset + 3 ) ) ) & mask ) * multiplier,
      g: ( ( dec >> ( bits * ( bitsOffset + 2 ) ) ) & mask ) * multiplier,
      b: ( ( dec >> ( bits * ( bitsOffset + 1 ) ) ) & mask ) * multiplier,
      a: hasAlpha ? ( dec & mask ) * multiplier / 255 : 1
    }, color );

  },

  stringify: ( channels: Channels ): string => {

    const {r, g, b, a} = channels;

    if ( a < 1 ) { // #RRGGBBAA

      return `#${DEC2HEX[Math.round ( r )]}${DEC2HEX[Math.round ( g )]}${DEC2HEX[Math.round ( b )]}${DEC2HEX[Math.round ( a * 255 )]}`;

    } else { // #RRGGBB

      return `#${DEC2HEX[Math.round ( r )]}${DEC2HEX[Math.round ( g )]}${DEC2HEX[Math.round ( b )]}`;

    }

  }

};

/* EXPORT */

export default Hex;
