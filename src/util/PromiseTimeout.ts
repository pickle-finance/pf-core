type CallbackFunction = (...args: any[]) => any;

export const fulfillWithTimeLimit = async (
  [task, ...args]: [ CallbackFunction, ...any[] ],
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
 * @param {string} [retries=1] - Number of times to run the task if not resolved (default=1).
 * @param {string} [failureValue=null] - Return value on failure to resolve the task in time (default=null).
 * @returns {Promise<any>} Task response (if resolved in time) || failureValue
 */
export const fulfillWithRetries = async (
  [task, ...args]: [ CallbackFunction, ...any[] ],
  timeLimit: number,
  retries = 3,
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
