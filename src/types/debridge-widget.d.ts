/* eslint-disable @typescript-eslint/no-explicit-any */

/** 전역 window 보강 */
declare global {
  interface Window {
    deBridge?: any;
  }
}

export {};
