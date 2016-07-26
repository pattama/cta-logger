'use strict';

/**
 * Class StreamHook captures the output of a given stream.
 * Create one instance of StreamHook for each stream you want to capture.
 */
class StreamHook {
  /**
   * Create a new StreamHoook.
   * Create one instance of StreamHook for each stream you want to capture.
   */
  constructor() {
    this._stream = null;
    this._buffer = '';
  }

  /**
   * Starts the capture on the given stream. All the content pushed to this stream is still pushed to the actual stream output.
   * @param stream {stream.Writable|*} the stream to capture
   * @returns {stream.Writable|*} the stream as given in input parameter
   * @throws error if capture is started on a non-stream reference or starting again on a different stream reference.
   */
  startCapture(stream) {
    if (this._stream !== null) {
      if (this._stream !== stream) {
        throw new Error('Capture already started with another stream');
      }
      return stream;
    }
    if (!stream || (typeof stream.write !== 'function')) {
      throw new Error('Cannot capture on non-stream');
    }
    this._stream = stream;
    this._write = stream.write;
    this._buffer = '';

    const that = this;
    stream.write = function (chunk, encoding, callback) {
      that._buffer += chunk.toString(encoding); // chunk is a String or Buffer
      that._write.apply(that._stream, arguments);
    };

    return stream;
  }

  /**
   * Stops capturing on the requested stream.
   * @returns {string|string|String} the captured output
   * @throws {Error} if capture was not actually started
   */
  stopCapture() {
    if (this._stream === null) {
      throw new Error('Capture is not started');
    }
    this._stream.write = this._write;
    this._stream = null;
    return this._buffer;
  }

  /**
   * Returns the captured output so far and reset the capture buffer.
   * @returns {string|string|String} the captured string so far
   */
  captured() {
    const content = this._buffer;
    this._buffer = '';
    return content;
  }
}

module.exports = StreamHook;