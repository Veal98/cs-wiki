
/* UNIT */

const Unit = {

  dec2hex ( dec: number ): string {

    const hex = Math.round ( dec ).toString ( 16 );

    return hex.length > 1 ? hex : `0${hex}`;

  }

};

/* EXPORT */

export default Unit;
