import EventEmitter from "events";

type CallbackFunction = (...args: any[]) => any;

export const fulfillWithTimeLimit = async (
  [task, ...args]: [CallbackFunction, ...any[]],
  timeLimit: number,
  failureValue: any,
): Promise<any> => {
  let timeout: NodeJS.Timeout;
  const timeoutPromise = new Promise((resolve, _reject) => {
    timeout = setTimeout(() => {
      resolve(failureValue);
    }, timeLimit);
  });
  const taskPromise: Promise<any> = task(...args);
  const response = await Promise.race([taskPromise, timeoutPromise]);
  if (timeout) {
    clearTimeout(timeout);
  }
  return response;
};

/**
 * @param {CallbackFunction} task - The async task to be run.
 * @param {...any[]} args - Arguments to pass to the task.
 * @param {number}  timeLimit - Number of milliseconds to wait for the task.
 * @param {number} [retries=1] - Number of times to run the task if not resolved (default=1).
 * @param {string} [failureValue=null] - Return value on failure to resolve the task in time (default=null).
 * @returns {Promise<any>} Task response (if resolved in time) || failureValue
 */
export const fulfillWithRetries = async (
  [task, ...args]: [CallbackFunction, ...any[]],
  timeLimit: number,
  retries = 1,
  failureValue: any = null,
): Promise<any> => {
  let response = null;
  for (let i = 0; i < retries; i++) {
    response = await fulfillWithTimeLimit(
      [task, ...args],
      timeLimit,
      failureValue,
    );
    if (response !== failureValue) break;
  }
  return response;
};

export const timeout = (prom, time, exception) => {
  let timer;
  return Promise.race([
    prom,
    new Promise((_r, rej) => (timer = setTimeout(rej, time, exception))),
  ]).finally(() => clearTimeout(timer));
};

/**
 * @notice Utility class to queue callback functions with unique queue IDs. When multiple functions are assigned the same ID, only one is allowed to execute at a time.
 */
 export class FuncsQueue {
  #emitter = new EventEmitter();
  #eventsQ: { [event: string]: boolean } = {};
  #results: { [event: string]: any } = {};

  constructor() {
    this.#emitter.setMaxListeners(50);
  }

/**
 * @notice Assumes callbacks with the same ID returns the same result. The consecutive queued callbacks will return the same result as the first fulfilled one in the queue.
 */
  async queue<T>(fn: () => Promise<T>, queueId = "-"): Promise<T> {
    if (this.#results[queueId]) {
      return this.#results[queueId];
    } else if (this.#eventsQ[queueId]) {
      await new Promise((r, _) => this.#emitter.once(queueId, r));
    } else {
      this.#eventsQ[queueId] = true;
      const result = await fn();
      this.#results[queueId] = result;
      this.#emitter.emit(queueId);
      this.#eventsQ[queueId] = false;
    }

    return this.#results[queueId];
  }

  /**
 * @notice Assumes callbacks with the same ID returns different results. All queued callbacks will be executed fully one at a time.
 */
  async queueDifferentResultsOneAtATime<T>(fn: () => Promise<T>, queueId = "-"): Promise<T> {
    let result:Awaited<T>;
    if (this.#eventsQ[queueId]) {
      await new Promise((r, _) => this.#emitter.once(queueId, r));
      result = await this.queueDifferentResultsOneAtATime(fn, queueId);
    } else {
      this.#eventsQ[queueId] = true;
      result = await fn();
      this.#eventsQ[queueId] = false;
      this.#emitter.emit(queueId);
    }

    return result;
  }
}