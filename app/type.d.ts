// types.d.ts
declare module "jsonwebtoken" {
    export function sign(
      payload: string | object | Buffer, 
      secretOrPrivateKey: string | Buffer, 
      options?: object
    ): string;
    
    export function verify(
      token: string,
      secretOrPublicKey: string | Buffer,
      options?: object
    ): any;
  }