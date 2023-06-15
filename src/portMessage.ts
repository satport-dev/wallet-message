import browser from './browser';

import Message from './message';

/** chrome runtime long connect */
class PortMessage extends Message {
  port: any | null = null;
  listenCallback: any;

  constructor(port?: any) {
    super();

    if (port) {
      this.port = port;
    }
  }
  /** connect message listener  */
  connect = (name?: string) => {
    /** connect and return port object*/
    this.port = browser.runtime.connect(undefined, name ? { name } : undefined);
    /** message listener */
    this.port.onMessage.addListener(({ _type_, data }: { _type_: string, data: any }) => {
      if (_type_ === `${this._EVENT_PRE}message`) {
        this.emit('message', data);
        return;
      }

      if (_type_ === `${this._EVENT_PRE}response`) {
        this.onResponse(data);
      }
    });

    return this;
  };

  listen = (listenCallback: any) => {
    if (!this.port) return;
    this.listenCallback = listenCallback;
    this.port.onMessage.addListener(({ _type_, data }: { _type_: string, data: any }) => {
      if (_type_ === `${this._EVENT_PRE}request`) {
        this.onRequest(data);
      }
    });

    return this;
  };

  /**
   * send message
   * @param type message type
   * @param data message
   * @returns 
   */
  send = (type: string, data: any) => {
    if (!this.port) return;
    try {
      this.port.postMessage({ _type_: `${this._EVENT_PRE}${type}`, data });
    } catch (e) {
      // DO NOTHING BUT CATCH THIS ERROR
    }
  };

  /** 是否连接 */
  dispose = () => {
    this._dispose();
    this.port?.disconnect();
  };
}

export default PortMessage;
