
/* IMPORT */

import _ from '../utils';
import luminance from './luminance';

/* CONTRAST */

function contrast ( color1: string, color2: string ): number {

  const luminance1 = luminance ( color1 ),
        luminance2 = luminance ( color2 ),
        max = Math.max ( luminance1, luminance2 ),
        min = Math.min ( luminance1, luminance2 ),
        ratio = ( max + Number.EPSILON ) / ( min + Number.EPSILON );

  return _.lang.round ( _.lang.clamp ( ratio, 1, 10 ) );

}

/* EXPORT */

export default contrast;
