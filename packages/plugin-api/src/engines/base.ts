import type { RouteHandler } from '../core/types.js'
import type { ViteDevServer } from 'vite'

export interface InitOptions {
	vite?: ViteDevServer
}

export interface StartOptions {
	port: number
}

export abstract class BaseEngine {
	/**
	 * Called when the server should initialize.
	 * This refers to any setup that needs to be done before the server can start listening for requests.
	 *
	 * The actual listening should be done in the `start` method, not here.
	 *
	 * @returns A promise that resolves when the server has initialized.
	 */
	public abstract init(options: InitOptions): Promise<void>

	/**
	 * Returns whether the server is currently running.
	 */
	public abstract isRunning(): boolean

	/**
	 * Registers a route handler for the given path.
	 *
	 * @param path The path to register the handler for. (e.g. `/api/test`)
	 * @param handler The handler function to call when the path is requested.
	 */
	public abstract registerRoute(path: string, handler: RouteHandler): void

	/**
	 * Called when the server should start listening for requests.
	 *
	 * @param options Options for the server, such as the port to listen on.
	 * @returns A promise that resolves when the server has started.
	 */
	public abstract start(options: StartOptions): Promise<void>

	/**
	 * Called when the server should stop listening for requests.
	 *
	 * @returns A promise that resolves when the server has stopped.
	 */
	public abstract stop(): Promise<void>
}
